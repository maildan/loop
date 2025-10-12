/**
 * 🔥 Synopsis Stats Custom Hooks
 * 
 * Dashboard와 EpisodesView를 위한 통계 데이터 hooks
 * - useSynopsisStats: 통합 통계 데이터 (Dashboard용)
 * - useWritingActivity: 7일 작성 활동 (BarChart)
 * - useProgressTimeline: 30일 누적 진행도 (AreaChart)
 * - useEpisodeStats: 5막 구조 분포 (ComposedChart)
 * - useRecordActivity: 작성 활동 기록
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================
// Types
// ============================================

export interface WritingActivity {
  date: string; // YYYY-MM-DD
  words: number;
  duration: number; // minutes
}

export interface ProgressTimelineData {
  date: string; // M/D
  words: number; // cumulative
}

export interface EpisodeStatsData {
  act: string; // 도입, 발단, 전개, 절정, 결말
  count: number;
  avgWords: number;
  color: string;
}

export interface SynopsisStats {
  writingActivity: WritingActivity[];
  progressTimeline: ProgressTimelineData[];
  episodeStats: EpisodeStatsData[];
}

// ============================================
// Hook: useWritingActivity
// ============================================

/**
 * 최근 N일 작성 활동 데이터
 * @param projectId 프로젝트 ID
 * @param days 조회 일수 (기본 7일)
 */
export function useWritingActivity(projectId: string, days: number = 7) {
  const [data, setData] = useState<WritingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await window.electronAPI.synopsis.getWritingActivity(
        projectId,
        days
      );

      setData(result);
    } catch (err) {
      console.error('Error fetching writing activity:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch writing activity'));
    } finally {
      setLoading(false);
    }
  }, [projectId, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Hook: useProgressTimeline
// ============================================

/**
 * 최근 N일 누적 글자 수 추이
 * @param projectId 프로젝트 ID
 * @param days 조회 일수 (기본 30일)
 */
export function useProgressTimeline(projectId: string, days: number = 30) {
  const [data, setData] = useState<ProgressTimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await window.electronAPI.synopsis.getProgressTimeline(
        projectId,
        days
      );

      setData(result);
    } catch (err) {
      console.error('Error fetching progress timeline:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch progress timeline'));
    } finally {
      setLoading(false);
    }
  }, [projectId, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Hook: useEpisodeStats
// ============================================

/**
 * 5막 구조별 회차 통계
 * @param projectId 프로젝트 ID
 */
export function useEpisodeStats(projectId: string) {
  const [data, setData] = useState<EpisodeStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await window.electronAPI.synopsis.getEpisodeStats(
        projectId
      );

      setData(result);
    } catch (err) {
      console.error('Error fetching episode stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch episode stats'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Hook: useSynopsisStats (통합)
// ============================================

/**
 * Dashboard용 통합 통계 데이터
 * @param projectId 프로젝트 ID
 */
export function useSynopsisStats(projectId: string) {
  const writingActivity = useWritingActivity(projectId, 7);
  const progressTimeline = useProgressTimeline(projectId, 30);
  const episodeStats = useEpisodeStats(projectId);

  const loading = writingActivity.loading || progressTimeline.loading || episodeStats.loading;
  const error = writingActivity.error || progressTimeline.error || episodeStats.error;

  const refetchAll = useCallback(() => {
    writingActivity.refetch();
    progressTimeline.refetch();
    episodeStats.refetch();
  }, [writingActivity, progressTimeline, episodeStats]);

  return {
    data: {
      writingActivity: writingActivity.data,
      progressTimeline: progressTimeline.data,
      episodeStats: episodeStats.data,
    },
    loading,
    error,
    refetch: refetchAll,
  };
}

// ============================================
// Hook: useRecordActivity (작성 활동 기록)
// ============================================

/**
 * 작성 활동 기록 (저장 시 자동 호출)
 */
export function useRecordActivity() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const recordActivity = useCallback(
    async (
      projectId: string,
      wordCount: number,
      duration: number,
      episodeId?: string
    ) => {
      try {
        setRecording(true);
        setError(null);

        await window.electronAPI.synopsis.recordWritingActivity(
          projectId,
          wordCount,
          duration,
          episodeId
        );
      } catch (err) {
        console.error('Error recording writing activity:', err);
        setError(err instanceof Error ? err : new Error('Failed to record activity'));
        throw err;
      } finally {
        setRecording(false);
      }
    },
    []
  );

  return { recordActivity, recording, error };
}
