/**
 * 📖 Episode IPC 핸들러 - 한국 웹소설 회차 관리
 *
 * 메인 프로세스에서 EpisodeService를 호출하여 렌더러에 데이터 제공
 */

import { ipcMain } from 'electron';
import type { IpcMainEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { EpisodeService } from '../services/EpisodeService';
import { prismaService } from '../services/PrismaService';
import { calculateWordCount } from '../../shared/utils/text';
import { globalRateLimiter } from '../services/RateLimiterService';
import type {
  CreateEpisodeInput,
  UpdateEpisodeInput,
  EpisodeFilterOptions,
  EpisodeSortOptions,
  Episode,
  EpisodeStatus,
  FiveActType,
} from '../../shared/types/episode';

const episodeService = new EpisodeService();

/**
 * Episode IPC 핸들러 설정
 */
export function setupEpisodeIpcHandlers(): void {
  Logger.debug('EPISODE_IPC', 'Setting up episode IPC handlers');

  // 회차 생성
  ipcMain.handle('episode:create', async (event: IpcMainEvent, input: CreateEpisodeInput) => {
    try {
      // 🔒 V4 단계 0: 속도 제한 (Rate Limiting) 검증
      const limitResult = globalRateLimiter.checkLimit('episode:create');
      if (!limitResult.allowed) {
        Logger.warn('EPISODE_IPC', '⚠️ V4 Rate limit exceeded for episode:create', {
          retryAfterMs: limitResult.retryAfter,
        });
        return {
          success: false,
          error: `회차 생성 요청이 너무 많습니다. ${Math.ceil(limitResult.retryAfter / 1000)}초 후 다시 시도해주세요.`,
        };
      }

      Logger.debug('EPISODE_IPC', 'Creating episode', { input });
      const episode = await episodeService.createEpisode(input);
      return { success: true, data: episode };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to create episode', { error, input });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 조회 (ID)
  ipcMain.handle('episode:get', async (event: IpcMainEvent, id: string) => {
    try {
      Logger.debug('EPISODE_IPC', 'Getting episode', { id });
      const episode = await episodeService.getEpisode(id);
      return { success: true, data: episode };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to get episode', { error, id });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 조회 (프로젝트 + 회차 번호)
  ipcMain.handle('episode:getByNumber', async (event: IpcMainEvent, projectId: string, episodeNumber: number) => {
    try {
      Logger.debug('EPISODE_IPC', 'Getting episode by number', { projectId, episodeNumber });
      const episode = await episodeService.getEpisodeByNumber(projectId, episodeNumber);
      return { success: true, data: episode };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to get episode by number', { error, projectId, episodeNumber });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 목록 조회 - ProjectStructure의 chapters를 episodes로 변환
  ipcMain.handle('episode:list', async (event: IpcMainEvent, projectId: string, filter?: EpisodeFilterOptions, sort?: EpisodeSortOptions) => {
    try {
      Logger.debug('EPISODE_IPC', 'Listing chapters as episodes', { projectId, filter, sort });

      const prisma = await prismaService.getClient();

      type ChapterRecord = {
        id: string;
        projectId: string;
        title: string;
        status: string | null;
        wordCount: number;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        content: string | null;
      };

      const chapters = await prisma.projectStructure.findMany({
        where: {
          projectId,
          type: 'chapter',
          isActive: true,
        },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          projectId: true,
          title: true,
          status: true,
          wordCount: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
          content: true,
        },
      });

      const normalizeStatus = (rawStatus?: string | null): string => (rawStatus ?? 'planned').toLowerCase();

      const statusToEpisodeStatus: Record<string, EpisodeStatus> = {
        planned: 'draft',
        planning: 'draft',
        draft: 'draft',
        drafting: 'draft',
        'in-progress': 'in-progress',
        in_progress: 'in-progress',
        writing: 'in-progress',
        completed: 'completed',
        finished: 'completed',
        published: 'published',
        released: 'published',
      };

      const statusToAct: Record<string, FiveActType> = {
        planned: 'introduction',
        planning: 'introduction',
        draft: 'development',
        drafting: 'development',
        'in-progress': 'rising',
        in_progress: 'rising',
        writing: 'rising',
        completed: 'climax',
        finished: 'climax',
        published: 'conclusion',
        released: 'conclusion',
      };

      const applyFilters = (records: ChapterRecord[]): ChapterRecord[] => {
        return records.filter((chapter) => {
          const normalized = normalizeStatus(chapter.status);
          const mappedStatus = statusToEpisodeStatus[normalized] ?? 'draft';
          const mappedAct = statusToAct[normalized] ?? null;

          if (filter?.status && mappedStatus !== filter.status) {
            return false;
          }

          if (filter?.act && mappedAct !== filter.act) {
            return false;
          }

          if (filter?.minWordCount !== undefined && chapter.wordCount < filter.minWordCount) {
            return false;
          }

          if (filter?.maxWordCount !== undefined && chapter.wordCount > filter.maxWordCount) {
            return false;
          }

          return true;
        });
      };

      const applySorting = (records: ChapterRecord[]): ChapterRecord[] => {
        const sortField = sort?.field ?? sort?.sortBy ?? 'sortOrder';
        const direction = sort?.direction ?? sort?.order ?? 'asc';

        const compare = (a: ChapterRecord, b: ChapterRecord): number => {
          switch (sortField) {
            case 'episodeNumber':
            case 'sortOrder':
              return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
            case 'wordCount':
              return (a.wordCount ?? 0) - (b.wordCount ?? 0);
            case 'createdAt':
              return a.createdAt.getTime() - b.createdAt.getTime();
            case 'updatedAt':
              return a.updatedAt.getTime() - b.updatedAt.getTime();
            case 'status': {
              const aStatus = statusToEpisodeStatus[normalizeStatus(a.status)] ?? 'draft';
              const bStatus = statusToEpisodeStatus[normalizeStatus(b.status)] ?? 'draft';
              return aStatus.localeCompare(bStatus);
            }
            default:
              return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
          }
        };

        const sorted = [...records].sort(compare);
        return direction === 'desc' ? sorted.reverse() : sorted;
      };

      const paginate = (records: ChapterRecord[]): ChapterRecord[] => {
        const offset = filter?.offset ?? 0;
        const limit = filter?.limit ?? records.length;
        return records.slice(offset, offset + limit);
      };

      const filteredChapters = paginate(applySorting(applyFilters(chapters)));

      // 🔥 Helper: content 기반 wordCount 재계산
      const resolveWordCount = (explicit: number | null | undefined, content: string | null | undefined): number => {
        if (explicit && explicit > 0) {
          return explicit;
        }

        if (content) {
          const normalized = content.trim();
          if (normalized.length > 0) {
            return calculateWordCount(normalized);
          }
        }

        return 0;
      };

      const episodes: Episode[] = filteredChapters.map((chapter, index) => {
        const normalized = normalizeStatus(chapter.status);
        const mappedStatus = statusToEpisodeStatus[normalized] ?? 'draft';
        const mappedAct = statusToAct[normalized] ?? null;

        const episodeNumber = chapter.sortOrder ?? index;

        const episode: Episode = {
          id: chapter.id,
          projectId: chapter.projectId,
          episodeNumber: episodeNumber + 1,
          title: chapter.title || `Chapter ${episodeNumber + 1}`,
          content: chapter.content ?? '',
          wordCount: resolveWordCount(chapter.wordCount, chapter.content),
          targetWordCount: 5500,
          status: mappedStatus,
          act: mappedAct,
          cliffhangerType: null,
          cliffhangerIntensity: null,
          notes: null,
          platform: null,
          sortOrder: chapter.sortOrder ?? episodeNumber,
          isActive: chapter.isActive,
          createdAt: chapter.createdAt,
          updatedAt: chapter.updatedAt,
          publishedAt: mappedStatus === 'published' ? chapter.updatedAt : null,
        };

        return episode;
      });

      return { success: true, data: episodes };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to list chapters as episodes', { error, projectId, filter, sort });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 수정
  ipcMain.handle('episode:update', async (event: IpcMainEvent, id: string, input: UpdateEpisodeInput) => {
    try {
      Logger.debug('EPISODE_IPC', 'Updating episode', { id, input });
      const episode = await episodeService.updateEpisode(id, input);
      return { success: true, data: episode };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to update episode', { error, id, input });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 삭제
  ipcMain.handle('episode:delete', async (event: IpcMainEvent, id: string) => {
    try {
      Logger.debug('EPISODE_IPC', 'Deleting episode', { id });
      await episodeService.deleteEpisode(id);
      return { success: true };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to delete episode', { error, id });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 완전 삭제
  ipcMain.handle('episode:hardDelete', async (event: IpcMainEvent, id: string) => {
    try {
      Logger.debug('EPISODE_IPC', 'Hard deleting episode', { id });
      await episodeService.hardDeleteEpisode(id);
      return { success: true };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to hard delete episode', { error, id });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 발행
  ipcMain.handle('episode:publish', async (event: IpcMainEvent, id: string) => {
    try {
      Logger.debug('EPISODE_IPC', 'Publishing episode', { id });
      const episode = await episodeService.publishEpisode(id);
      return { success: true, data: episode };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to publish episode', { error, id });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 비축 현황 조회
  ipcMain.handle('episode:getManuscriptReserves', async (event: IpcMainEvent, projectId: string) => {
    try {
      Logger.debug('EPISODE_IPC', 'Getting manuscript reserves', { projectId });
      const reserves = await episodeService.getManuscriptReserves(projectId);
      return { success: true, data: reserves };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to get manuscript reserves', { error, projectId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 5막 구조 분석
  ipcMain.handle('episode:analyzeFiveActStructure', async (event: IpcMainEvent, projectId: string) => {
    try {
      Logger.debug('EPISODE_IPC', 'Analyzing five-act structure', { projectId });
      const analysis = await episodeService.analyzeFiveActStructure(projectId);
      return { success: true, data: analysis };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to analyze five-act structure', { error, projectId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 회차 통계 조회
  ipcMain.handle('episode:getStats', async (event: IpcMainEvent, projectId: string) => {
    try {
      Logger.debug('EPISODE_IPC', 'Getting episode stats', { projectId });
      const stats = await episodeService.getEpisodeStats(projectId);
      return { success: true, data: stats };
    } catch (error) {
      Logger.error('EPISODE_IPC', 'Failed to get episode stats', { error, projectId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  Logger.info('EPISODE_IPC', 'Episode IPC handlers setup complete');
}