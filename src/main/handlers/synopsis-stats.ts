/**
 * Synopsis Statistics IPC Handlers
 * 
 * Dashboard와 EpisodesView에서 사용하는 통계 데이터 IPC 핸들러
 * - Writing Activity (7일/30일 작성량)
 * - Progress Timeline (누적 글자 수)
 * - Episode Statistics (5막 구조 분포)
 */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { prismaService } from '../services/PrismaService';

/**
 * 최근 N일 작성 활동 가져오기
 * @returns { date, wordCount, duration }[]
 */
export function registerGetWritingActivityHandler() {
  ipcMain.handle('synopsis:getWritingActivity', async (_event: IpcMainInvokeEvent, projectId: string, days: number = 7) => {
    try {
      const prisma = await prismaService.getClient();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

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

      // 날짜별 데이터 형식 변환
      return activities.map((activity: any) => ({
        date: activity.date.toISOString().split('T')[0], // YYYY-MM-DD
        words: activity.wordCount,
        duration: activity.duration,
      }));
    } catch (error) {
      console.error('Error fetching writing activity:', error);
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
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

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

      // 누적 계산
      let cumulative = 0;
      return activities.map((activity: any) => {
        cumulative += activity.wordCount;
        return {
          date: `${activity.date.getMonth() + 1}/${activity.date.getDate()}`,
          words: cumulative,
        };
      });
    } catch (error) {
      console.error('Error fetching progress timeline:', error);
      throw error;
    }
  });
}

/**
 * 5막 구조별 회차 통계
 * @returns { act, count, avgWords }[]
 */
export function registerGetEpisodeStatsHandler() {
  ipcMain.handle('synopsis:getEpisodeStats', async (_event: IpcMainInvokeEvent, projectId: string) => {
    try {
      const prisma = await prismaService.getClient();
      const episodes = await prisma.episode.findMany({
        where: {
          projectId,
          isActive: true,
        },
        select: {
          act: true,
          wordCount: true,
        },
      });

      // 5막 구조별 그룹화
      const acts = ['intro', 'rising', 'development', 'climax', 'conclusion'];
      const actLabels = { intro: '도입', rising: '발단', development: '전개', climax: '절정', conclusion: '결말' };
      const actColors = { intro: '#3b82f6', rising: '#10b981', development: '#eab308', climax: '#ef4444', conclusion: '#8b5cf6' };

      return acts.map(act => {
        const actEpisodes = episodes.filter((ep: any) => ep.act === act);
        const count = actEpisodes.length;
        const avgWords = count > 0 ? Math.round(actEpisodes.reduce((sum: number, ep: any) => sum + ep.wordCount, 0) / count) : 0;

        return {
          act: actLabels[act as keyof typeof actLabels],
          count,
          avgWords,
          color: actColors[act as keyof typeof actColors],
        };
      });
    } catch (error) {
      console.error('Error fetching episode stats:', error);
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Upsert: 오늘 날짜 기록이 있으면 업데이트, 없으면 생성
      await prisma.writingActivity.upsert({
        where: {
          projectId_date: {
            projectId,
            date: today,
          },
        },
        update: {
          wordCount: {
            increment: wordCount, // 누적 증가
          },
          duration: {
            increment: duration,
          },
        },
        create: {
          projectId,
          date: today,
          wordCount,
          duration,
          episodeId,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error recording writing activity:', error);
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
  
  console.log('✅ Synopsis Stats IPC handlers registered');
}
