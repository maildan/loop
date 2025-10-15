import type { ManuscriptReserves } from './episode';

/**
 * Dashboard 요약 수치를 메인 프로세스에서 계산해 반환할 때 사용하는 타입.
 */
export interface DashboardSummary {
  projectId: string;
  totalEpisodes: number;
  completedEpisodes: number;
  publishedEpisodes: number;
  reserveEpisodes: number;
  totalWordCount: number;
  averageWordCount: number;
  characterCount: number;
  unresolvedForeshadows: number;
  consistencyScore: number;
  lastUpdated: string;
  reserves: ManuscriptReserves;
  timelineEpisodes: TimelineEpisodeSummary[];
  foreshadows: ForeshadowSummary[];
}

export interface TimelineEpisodeSummary {
  id: string;
  title: string;
  episodeNumber: number;
  wordCount: number;
  sortOrder: number;
  status: string;
  act?: string | null;
  updatedAt: string;
}

export interface ForeshadowSummary {
  id: string;
  title: string;
  introducedEpisode: number | null;
  resolvedEpisode: number | null;
  importance?: string | null;
}
