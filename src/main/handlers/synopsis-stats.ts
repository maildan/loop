/**
 * Synopsis Statistics IPC Handlers
 * 
 * Dashboard와 EpisodesView에서 사용하는 통계 데이터 IPC 핸들러
 * - Writing Activity (7일/30일 작성량)
 * - Progress Timeline (누적 글자 수)
 * - Episode Statistics (5막 구조 분포)
 */

import type { PrismaClient } from '@prisma/client';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { prismaService } from '../services/PrismaService';
import { Logger } from '../../shared/logger';
import { formatDateISO, formatDateShort, getTodayStart } from '../../shared/utils/date';
import { recordDailyWritingActivity } from '../utils/writingActivity';
import type { DashboardSummary, ForeshadowSummary, TimelineEpisodeSummary } from '../../shared/types';

// 🔥 Symbol 기반 컴포넌트 이름
const SYNOPSIS_STATS_HANDLER = Symbol.for('SYNOPSIS_STATS_HANDLER');

type ChapterSnapshot = {
  id: string;
  title: string;
  wordCount: number | null;
  sortOrder: number | null;
  status: string | null;
  updatedAt: Date;
  episodeNumber?: number | null;
};

type ChapterStatsRecord = {
  status: string | null;
  wordCount: number | null;
};

type EpisodeStatsRecord = {
  status: string | null;
  wordCount: number | null;
};

type ChapterOverviewRecord = {
  id: string;
  title: string;
  wordCount: number | null;
  sortOrder: number | null;
  status: string | null;
  updatedAt: Date;
};

type EpisodeOverviewRecord = {
  id: string;
  title: string;
  wordCount: number | null;
  sortOrder: number | null;
  episodeNumber: number | null;
  status: string | null;
  updatedAt: Date;
};

type WordCountStatsRecord = {
  status: string;
  wordCount: number;
};

type EpisodeWordMaps = {
  daily: Map<string, number>;
  totals: Map<string, number>;
};

/**
 * 최근 N일 작성 활동 가져오기
 * @returns { date, wordCount, duration }[]
 */
export function registerGetWritingActivityHandler() {
  ipcMain.handle('synopsis:getWritingActivity', async (_event: IpcMainInvokeEvent, projectId: string, days: number = 7) => {
    try {
      const prisma = await prismaService.getClient();
  const dateRange = buildDateRange(days);
  const startDate = dateRange[0]!;

      const activities = await prisma.writingActivity.findMany({
        where: {
          projectId,
          date: {
            gte: startDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
        select: {
          date: true,
          wordCount: true,
          duration: true,
        },
      });

      type ActivityData = { date: Date; wordCount: number; duration: number };
  const activityMap = new Map<string, { words: number; duration: number }>();

      for (const activity of activities) {
        const key = formatDateISO(activity.date);
        activityMap.set(key, {
          words: activity.wordCount,
          duration: activity.duration,
        });
      }

      if (activityMap.size === 0) {
        const fallbackMap = await aggregateChapterWordCounts(prisma, projectId, startDate);
        fallbackMap.forEach((words, key) => {
          activityMap.set(key, { words, duration: 0 });
        });
      }

      if (!mapHasPositiveWords(activityMap)) {
        const episodeWordMaps = await buildEpisodeWordMaps(prisma, projectId, dateRange);
        episodeWordMaps.daily.forEach((words: number, key: string) => {
          const duration = activityMap.get(key)?.duration ?? 0;
          activityMap.set(key, { words, duration });
        });
      }

      return dateRange.map((date: Date) => {
        const key = formatDateISO(date);
        const metrics = activityMap.get(key);
        return {
          date: key,
          words: metrics?.words ?? 0,
          duration: metrics?.duration ?? 0,
        };
      });
    } catch (error) {
      Logger.error(SYNOPSIS_STATS_HANDLER, 'Error fetching writing activity', { projectId, days, error });
      throw error;
    }
  });
}

/**
 * 누적 글자 수 추이 가져오기 (30일)
 * @returns { date, words (cumulative) }[]
 */
export function registerGetProgressTimelineHandler() {
  ipcMain.handle('synopsis:getProgressTimeline', async (_event: IpcMainInvokeEvent, projectId: string, days: number = 30) => {
    try {
      const prisma = await prismaService.getClient();
      const dateRange = buildDateRange(days);
      const startDate = dateRange[0]!;

      const activities = await prisma.writingActivity.findMany({
        where: {
          projectId,
          date: {
            gte: startDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
        select: {
          date: true,
          wordCount: true,
        },
      });

      type ProgressData = { date: Date; wordCount: number };
      const dailyWords = new Map<string, number>();

      for (const activity of activities) {
        const key = formatDateISO(activity.date);
        dailyWords.set(key, activity.wordCount);
      }

      if (dailyWords.size === 0) {
        const fallbackMap = await aggregateChapterWordCounts(prisma, projectId, startDate);
        fallbackMap.forEach((words, key) => {
          dailyWords.set(key, words);
        });
      }

      if (!mapHasPositiveNumbers(dailyWords)) {
        const episodeWordMaps = await buildEpisodeWordMaps(prisma, projectId, dateRange);
        dailyWords.clear();
        episodeWordMaps.daily.forEach((words: number, key: string) => {
          dailyWords.set(key, words);
        });
      }

      let cumulative = 0;
      return dateRange.map((date: Date) => {
        const key = formatDateISO(date);
        const dailyTotal = dailyWords.get(key) ?? 0;
        cumulative += dailyTotal;
        return {
          date: formatDateShort(date),
          words: cumulative,
        };
      });
    } catch (error) {
      Logger.error(SYNOPSIS_STATS_HANDLER, 'Error fetching progress timeline', { projectId, days, error });
      throw error;
    }
  });
}

/**
 * 5막 구조별 회차 통계
 * 🔥 ProjectStructure (type='chapter') 기반으로 변경
 * @returns { act, count, avgWords }[]
 */
export function registerGetEpisodeStatsHandler() {
  ipcMain.handle('synopsis:getEpisodeStats', async (_event: IpcMainInvokeEvent, projectId: string) => {
    try {
      const prisma = await prismaService.getClient();
      
      const chapterRecords = await prisma.projectStructure.findMany({
        where: {
          projectId,
          type: 'chapter',
          isActive: true,
        },
        select: {
          status: true,
          wordCount: true,
        },
      }) as ChapterStatsRecord[];

      let statsSource: WordCountStatsRecord[] = chapterRecords.map((record: ChapterStatsRecord): WordCountStatsRecord => ({
        status: (record.status ?? 'planned').toLowerCase(),
        wordCount: record.wordCount ?? 0,
      }));

      if (!hasMeaningfulWordData(statsSource)) {
        const episodes = await prisma.episode.findMany({
          where: {
            projectId,
            isActive: true,
          },
          select: {
            status: true,
            wordCount: true,
          },
        }) as EpisodeStatsRecord[];

        statsSource = episodes.map((episode: EpisodeStatsRecord): WordCountStatsRecord => ({
          status: (episode.status ?? 'draft').toLowerCase(),
          wordCount: episode.wordCount ?? 0,
        }));
      }

      const statusToAct: Record<string, string> = {
        planned: 'intro',
        planning: 'intro',
        'in-progress': 'rising',
        in_progress: 'rising',
        writing: 'rising',
        drafting: 'development',
        draft: 'development',
        completed: 'climax',
        finished: 'climax',
        published: 'conclusion',
        released: 'conclusion',
      };

      const acts = ['intro', 'rising', 'development', 'climax', 'conclusion'];
      const actLabels = { intro: '도입', rising: '발단', development: '전개', climax: '절정', conclusion: '결말' };
      const actColors = { intro: '#3b82f6', rising: '#10b981', development: '#eab308', climax: '#ef4444', conclusion: '#8b5cf6' };

      return acts.map((act) => {
        const actChapters = statsSource.filter((entry: WordCountStatsRecord) => statusToAct[entry.status] === act);
        const count = actChapters.length;
        const avgWords = count > 0
          ? Math.round(
            actChapters.reduce((sum: number, entry: WordCountStatsRecord) => sum + entry.wordCount, 0) / count
          )
          : 0;

        return {
          act: actLabels[act as keyof typeof actLabels],
          count,
          avgWords,
          color: actColors[act as keyof typeof actColors],
        };
      });
    } catch (error) {
      Logger.error(SYNOPSIS_STATS_HANDLER, 'Error fetching episode stats', { projectId, error });
      throw error;
    }
  });
}

/**
 * 작성 활동 기록 (자동 추적)
 */
export function registerRecordWritingActivityHandler() {
  ipcMain.handle('synopsis:recordWritingActivity', async (
    _event: IpcMainInvokeEvent, 
    projectId: string, 
    wordCount: number, 
    duration: number,
    episodeId?: string
  ) => {
    try {
      const prisma = await prismaService.getClient();
      await recordDailyWritingActivity(prisma, projectId, wordCount, duration, getTodayStart(), episodeId);
      return { success: true };
    } catch (error) {
      Logger.error(SYNOPSIS_STATS_HANDLER, 'Error recording writing activity', { projectId, wordCount, duration, episodeId, error });
      throw error;
    }
  });
}

export function registerGetDashboardSummaryHandler() {
  ipcMain.handle('synopsis:getDashboardSummary', async (_event: IpcMainInvokeEvent, projectId: string) => {
    try {
      const prisma = await prismaService.getClient();
      const [chapters, episodes, charactersCount, foreshadowNotes] = await Promise.all([
        prisma.projectStructure.findMany({
          where: {
            projectId,
            type: 'chapter',
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            wordCount: true,
            sortOrder: true,
            status: true,
            updatedAt: true,
          },
          orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'asc' }],
        }),
        prisma.episode.findMany({
          where: {
            projectId,
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            wordCount: true,
            sortOrder: true,
            episodeNumber: true,
            status: true,
            updatedAt: true,
          },
          orderBy: [{ sortOrder: 'asc' }, { episodeNumber: 'asc' }],
        }),
        prisma.projectCharacter.count({
          where: {
            projectId,
            isActive: true,
          },
        }),
        prisma.projectNote.findMany({
          where: {
            projectId,
            type: 'foreshadow',
            isArchived: false,
          },
          select: {
            id: true,
            title: true,
            introducedEpisode: true,
            resolvedEpisode: true,
            importance: true,
          },
          orderBy: [{ createdAt: 'asc' }],
        }),
      ]);

      const chapterSnapshots = (chapters as ChapterOverviewRecord[]).map((chapter: ChapterOverviewRecord, index: number): ChapterSnapshot => ({
        id: chapter.id,
        title: chapter.title,
        wordCount: chapter.wordCount,
        sortOrder: chapter.sortOrder ?? index,
        status: chapter.status,
        updatedAt: chapter.updatedAt,
        episodeNumber: null,
      }));

      const episodeSnapshots = (episodes as EpisodeOverviewRecord[]).map((episode: EpisodeOverviewRecord, index: number): ChapterSnapshot => ({
        id: episode.id,
        title: episode.title,
        wordCount: episode.wordCount,
        sortOrder: episode.sortOrder ?? episode.episodeNumber ?? index,
        status: episode.status,
        updatedAt: episode.updatedAt,
        episodeNumber: episode.episodeNumber,
      }));

      const snapshots = chooseChapterSnapshots(chapterSnapshots, episodeSnapshots);
      const summary = buildDashboardSummary(projectId, snapshots, charactersCount, foreshadowNotes);
      return summary;
    } catch (error) {
      Logger.error(SYNOPSIS_STATS_HANDLER, 'Error fetching dashboard summary', { projectId, error });
      throw error;
    }
  });
}

/**
 * 모든 Synopsis Stats IPC 핸들러 등록
 */
export function registerSynopsisStatsHandlers() {
  registerGetWritingActivityHandler();
  registerGetProgressTimelineHandler();
  registerGetEpisodeStatsHandler();
  registerRecordWritingActivityHandler();
  registerGetDashboardSummaryHandler();
  
  Logger.info(SYNOPSIS_STATS_HANDLER, 'Synopsis Stats IPC handlers registered');
}

function buildDateRange(days: number): Date[] {
  const safeDays = Math.max(1, Math.floor(days));
  const today = getTodayStart();
  const range: Date[] = [];

  for (let offset = safeDays - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    range.push(date);
  }

  return range;
}

async function aggregateChapterWordCounts(
  prisma: PrismaClient,
  projectId: string,
  startDate: Date
): Promise<Map<string, number>> {
  const chapters = await prisma.projectStructure.findMany({
    where: {
      projectId,
      type: 'chapter',
      isActive: true,
      updatedAt: {
        gte: startDate,
      },
    },
    select: {
      updatedAt: true,
      wordCount: true,
    },
  });

  const dailyWords = new Map<string, number>();

  chapters.forEach((chapter: { updatedAt: Date; wordCount: number | null }) => {
    const key = formatDateISO(chapter.updatedAt);
    const current = dailyWords.get(key) ?? 0;
    dailyWords.set(key, current + (chapter.wordCount ?? 0));
  });

  if (dailyWords.size === 0) {
    const aggregate = await prisma.projectStructure.aggregate({
      where: {
        projectId,
        type: 'chapter',
        isActive: true,
      },
      _sum: {
        wordCount: true,
      },
    });

    const total = aggregate._sum.wordCount ?? 0;
    if (total > 0) {
      dailyWords.set(formatDateISO(getTodayStart()), total);
    }
  }

  return dailyWords;
}

function buildDashboardSummary(
  projectId: string,
  chapters: ChapterSnapshot[],
  characterCount: number,
  foreshadowNotes: Array<{ id: string; title: string; introducedEpisode: number | null; resolvedEpisode: number | null; importance: string | null }>
): DashboardSummary {
  const normalizedChapters = chapters.map((chapter, index) => {
    const wordCount = chapter.wordCount ?? 0;
    const sortOrder = chapter.sortOrder ?? chapter.episodeNumber ?? index;
    const episodeNumber = chapter.episodeNumber ?? index + 1;
    return {
      ...chapter,
      wordCount,
      sortOrder,
      status: (chapter.status ?? 'planned').toLowerCase(),
      episodeNumber,
    };
  });

  const totalEpisodes = normalizedChapters.length;
  const totalWordCount = normalizedChapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
  const completedEpisodes = normalizedChapters.filter(isCompletedChapter).length;
  const publishedEpisodes = normalizedChapters.filter(chapter => chapter.status.includes('publish') || chapter.status === 'released').length;
  const reserveEpisodes = Math.max(0, completedEpisodes - publishedEpisodes);
  const averageWordCount = totalEpisodes > 0 ? Math.round(totalWordCount / totalEpisodes) : 0;
  const unresolvedForeshadows = foreshadowNotes.filter(note => note.resolvedEpisode == null).length;
  const lastUpdated = normalizedChapters.reduce<Date | null>((latest, chapter) => {
    if (!latest || latest < chapter.updatedAt) {
      return chapter.updatedAt;
    }
    return latest;
  }, null) ?? new Date();

  const draftEpisodes = normalizedChapters.filter(chapter => chapter.status === 'planned' || chapter.status.includes('draft')).length;
  const inProgressEpisodes = normalizedChapters.filter(chapter => chapter.status.includes('progress') || chapter.status.includes('writing')).length;

  const reserves = {
    totalEpisodes,
    draftEpisodes,
    inProgressEpisodes,
    completedEpisodes,
    publishedEpisodes,
    reserveCount: reserveEpisodes,
    lastPublishedDate: computeLastPublishedDate(normalizedChapters),
    nextScheduledPublish: null,
    totalWordCount,
    averageWordCount,
  };

  const timelineEpisodes: TimelineEpisodeSummary[] = normalizedChapters
    .map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      episodeNumber: chapter.episodeNumber,
      wordCount: chapter.wordCount,
      sortOrder: chapter.sortOrder ?? chapter.episodeNumber ?? 0,
      status: chapter.status,
      act: mapStatusToAct(chapter.status),
      updatedAt: chapter.updatedAt.toISOString(),
    }))
    .sort((a, b) => {
      const left = a.sortOrder ?? a.episodeNumber ?? 0;
      const right = b.sortOrder ?? b.episodeNumber ?? 0;
      if (left === right) {
        return (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0);
      }
      return left - right;
    });

  const foreshadows: ForeshadowSummary[] = foreshadowNotes.map(note => ({
    id: note.id,
    title: note.title,
    introducedEpisode: note.introducedEpisode ?? null,
    resolvedEpisode: note.resolvedEpisode ?? null,
    importance: note.importance ?? null,
  }));

  const consistencyScore = computeConsistencyScore({
    totalEpisodes,
    completedEpisodes,
    unresolvedForeshadows,
    characterCount,
  });

  return {
    projectId,
    totalEpisodes,
    completedEpisodes,
    publishedEpisodes,
    reserveEpisodes,
    totalWordCount,
    averageWordCount,
    characterCount,
    unresolvedForeshadows,
    consistencyScore,
    lastUpdated: lastUpdated.toISOString(),
    reserves,
    timelineEpisodes,
    foreshadows,
  };
}

function isCompletedChapter(chapter: { status: string; wordCount: number }): boolean {
  if (chapter.wordCount >= 500) {
    return true;
  }
  const status = chapter.status;
  return status.includes('complete') || status.includes('finish') || status === 'done';
}

function computeLastPublishedDate(chapters: Array<{ status: string; updatedAt: Date }>): Date | null {
  const published = chapters
    .filter(chapter => chapter.status.includes('publish') || chapter.status === 'released')
    .map(chapter => chapter.updatedAt);
  if (published.length === 0) {
    return null;
  }
  return published.reduce((latest, date) => (latest > date ? latest : date));
}

function mapStatusToAct(status: string): string | null {
  const mapping: Record<string, string> = {
    planned: 'intro',
    planning: 'intro',
    draft: 'development',
    drafting: 'development',
    'in-progress': 'rising',
    writing: 'rising',
    completed: 'climax',
    finished: 'climax',
    published: 'conclusion',
    released: 'conclusion',
  };

  const normalized = status.replace(/[\s_]+/g, '-');
  return mapping[normalized] ?? null;
}

function computeConsistencyScore(params: { totalEpisodes: number; completedEpisodes: number; unresolvedForeshadows: number; characterCount: number }): number {
  const { totalEpisodes, completedEpisodes, unresolvedForeshadows, characterCount } = params;
  const completionRatio = totalEpisodes === 0 ? 1 : completedEpisodes / totalEpisodes;
  const characterFactor = Math.min(1, (characterCount || 1) / 5);
  const foreshadowPenalty = Math.min(0.5, unresolvedForeshadows * 0.1);
  const score = (0.6 * completionRatio + 0.3 * characterFactor + 0.1) * 100 * (1 - foreshadowPenalty);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function mapHasPositiveWords(map: Map<string, { words: number; duration: number }>): boolean {
  for (const metrics of map.values()) {
    if (metrics.words > 0) {
      return true;
    }
  }
  return false;
}

function mapHasPositiveNumbers(map: Map<string, number>): boolean {
  for (const value of map.values()) {
    if (value > 0) {
      return true;
    }
  }
  return false;
}

function hasMeaningfulWordData(records: WordCountStatsRecord[]): boolean {
  return records.some(record => record.wordCount > 0);
}

function snapshotsHaveMeaningfulData(snapshots: ChapterSnapshot[]): boolean {
  return snapshots.some(snapshot => (snapshot.wordCount ?? 0) > 0);
}

function chooseChapterSnapshots(chapterSnapshots: ChapterSnapshot[], episodeSnapshots: ChapterSnapshot[]): ChapterSnapshot[] {
  if (snapshotsHaveMeaningfulData(chapterSnapshots)) {
    return chapterSnapshots;
  }

  if (snapshotsHaveMeaningfulData(episodeSnapshots)) {
    return episodeSnapshots;
  }

  return chapterSnapshots.length >= episodeSnapshots.length ? chapterSnapshots : episodeSnapshots;
}

async function buildEpisodeWordMaps(prisma: PrismaClient, projectId: string, dateRange: Date[]): Promise<EpisodeWordMaps> {
  const startDate = dateRange[0] ?? getTodayStart();
  const episodes = await prisma.episode.findMany({
    where: {
      projectId,
      isActive: true,
      updatedAt: {
        gte: startDate,
      },
    },
    select: {
      id: true,
      wordCount: true,
      updatedAt: true,
    },
  });

  const daily = new Map<string, number>();
  const totals = new Map<string, number>();

  for (const episode of episodes) {
    const key = formatDateISO(episode.updatedAt);
    const words = episode.wordCount ?? 0;
    daily.set(key, (daily.get(key) ?? 0) + words);
    totals.set(episode.id, words);
  }

  if (!mapHasPositiveNumbers(daily)) {
    const aggregate = await prisma.episode.aggregate({
      where: {
        projectId,
        isActive: true,
      },
      _sum: {
        wordCount: true,
      },
    });

    const total = aggregate._sum.wordCount ?? 0;
    if (total > 0) {
      daily.set(formatDateISO(getTodayStart()), total);
    }
  }

  return { daily, totals };
}
