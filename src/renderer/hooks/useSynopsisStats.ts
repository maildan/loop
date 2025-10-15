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
import { RendererLogger as Logger } from '../../shared/logger-renderer';
import type { DashboardSummary } from '../../shared/types';

// 🔥 Symbol 기반 컴포넌트 이름
const USE_SYNOPSIS_STATS = Symbol.for('USE_SYNOPSIS_STATS');
const SYNOPSIS_STATS_REFRESH_EVENT = 'synopsis-stats:refresh';

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
  summary: DashboardSummary | null;
}

export interface SynopsisStatsResult {
  data: SynopsisStats;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
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
      Logger.error(USE_SYNOPSIS_STATS, 'Error fetching writing activity:', err);
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
      Logger.error(USE_SYNOPSIS_STATS, 'Error fetching progress timeline:', err);
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
      Logger.error(USE_SYNOPSIS_STATS, 'Error fetching episode stats:', err);
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
// Hook: useDashboardSummary
// ============================================

function useDashboardSummary(projectId: string) {
  const [data, setData] = useState<DashboardSummary | null>(null);
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

      const result = await window.electronAPI.synopsis.getDashboardSummary(projectId);
      setData(result);
    } catch (err) {
      Logger.error(USE_SYNOPSIS_STATS, 'Error fetching dashboard summary:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard summary'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ projectId?: string }>;
      if (!custom.detail || !custom.detail.projectId || custom.detail.projectId === projectId) {
        fetchData();
      }
    };

    window.addEventListener(SYNOPSIS_STATS_REFRESH_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(SYNOPSIS_STATS_REFRESH_EVENT, handler as EventListener);
    };
  }, [fetchData, projectId]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Hook: useSynopsisStats (통합)
// ============================================

/**
 * Dashboard용 통합 통계 데이터
 * @param projectId 프로젝트 ID
 */
export function useSynopsisStats(projectId: string): SynopsisStatsResult {
  const writingActivity = useWritingActivity(projectId, 7);
  const progressTimeline = useProgressTimeline(projectId, 30);
  const episodeStats = useEpisodeStats(projectId);
  const dashboardSummary = useDashboardSummary(projectId);

  const loading = writingActivity.loading || progressTimeline.loading || episodeStats.loading || dashboardSummary.loading;
  const error = writingActivity.error || progressTimeline.error || episodeStats.error || dashboardSummary.error;

  const refetchAll = useCallback(() => {
    writingActivity.refetch();
    progressTimeline.refetch();
    episodeStats.refetch();
    dashboardSummary.refetch();
  }, [writingActivity.refetch, progressTimeline.refetch, episodeStats.refetch, dashboardSummary.refetch]);

  return {
    data: {
      writingActivity: writingActivity.data,
      progressTimeline: progressTimeline.data,
      episodeStats: episodeStats.data,
      summary: dashboardSummary.data,
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
        Logger.error(USE_SYNOPSIS_STATS, 'Error recording writing activity:', err);
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
