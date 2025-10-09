/**
 * Synopsis 통계 기능 - Shared Types
 * @module shared/types/synopsis-stats
 */

// ===========================
// Publication Types
// ===========================

export type PlatformType =
  | 'naver'
  | 'kakao'
  | 'munpia'
  | 'joara'
  | 'ridibooks'
  | 'toksoda';

export type PublicationStatus = 'ongoing' | 'completed' | 'hiatus' | 'discontinued';

export type ContractType = 'exclusive' | 'non-exclusive' | 'revenue_share';

export interface Publication {
  id: string;
  projectId: string;
  platform: PlatformType;
  platformUrl?: string;
  startDate?: Date;
  endDate?: Date;
  status: PublicationStatus;
  contractType?: ContractType;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePublicationDTO {
  projectId: string;
  platform: PlatformType;
  platformUrl?: string;
  startDate?: Date;
  status?: PublicationStatus;
  contractType?: ContractType;
  note?: string;
}

// ===========================
// Platform Metric Types
// ===========================

export type RankType = 'realtime' | 'daily' | 'weekly' | 'genre';

export interface PlatformMetric {
  id: string;
  publicationId: string;
  date: Date;
  views?: number;
  revenue?: number;
  purchases?: number;
  rank?: number;
  rankType?: RankType;
  episodeNumber?: number;
  note?: string;
  isEstimated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickLogDTO {
  publicationId: string;
  date: Date;
  views?: number;
  revenue?: number;
  purchases?: number;
  rank?: number;
  rankType?: RankType;
  episodeNumber?: number;
  note?: string;
  isEstimated?: boolean;
}

export interface MetricSuggestions {
  avgViews?: number;
  avgRevenue?: number;
  avgPurchases?: number;
  lastRank?: number;
  lastEpisodeNumber?: number;
}

// ===========================
// Publisher Relation Types
// ===========================

export type PublisherType = 'publisher' | 'agency' | 'platform_editor';

export type PublisherStatus =
  | 'contacted'
  | 'negotiating'
  | 'contracted'
  | 'rejected'
  | 'pending';

export interface PublisherRelation {
  id: string;
  projectId: string;
  publisherName: string;
  publisherType: PublisherType;
  contactDate: Date;
  status: PublisherStatus;
  contractType?: string;
  contract?: Record<string, unknown>;
  advance?: number;
  royaltyRate?: number;
  nextActionDate?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublisherFeedback {
  id: string;
  relationId: string;
  date: Date;
  type: 'positive' | 'negative' | 'neutral' | 'request';
  content: string;
  actionItem?: string;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// Strategy Experiment Types
// ===========================

export type ExperimentType =
  | 'title_change'
  | 'cover_change'
  | 'schedule_change'
  | 'break'
  | 'genre_shift'
  | 'promotion';

export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'cancelled';

export interface StrategyExperiment {
  id: string;
  projectId: string;
  type: ExperimentType;
  title: string;
  description: string;
  hypothesis: string;
  startDate: Date;
  endDate?: Date;
  status: ExperimentStatus;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  results?: Record<string, unknown>;
  conclusion?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExperimentDTO {
  projectId: string;
  type: ExperimentType;
  title: string;
  description: string;
  hypothesis: string;
  startDate: Date;
  status?: ExperimentStatus;
}

// ===========================
// Dashboard Analytics Types
// ===========================

export interface PlatformComparison {
  platform: PlatformType;
  totalViews: number;
  totalRevenue: number;
  avgViewsPerEpisode: number;
  revenuePerView: number; // 효율성 지표
  efficiency: 'high' | 'medium' | 'low';
}

export interface InsightCard {
  id: string;
  type: 'warning' | 'success' | 'info' | 'action';
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  priority: number;
}

export interface TrendPhase {
  phase: '초반' | '중반' | '후반';
  startDate: Date;
  endDate?: Date;
  avgGrowthRate: number;
  status: 'growing' | 'stable' | 'declining';
}

// ===========================
// IPC Channel Types
// ===========================

export interface SynopsisStatsIPC {
  // Publications
  'synopsis-stats:get-publications': (projectId: string) => Promise<Publication[]>;
  'synopsis-stats:create-publication': (data: CreatePublicationDTO) => Promise<Publication>;
  'synopsis-stats:delete-publication': (id: string) => Promise<void>;

  // Quick Log
  'synopsis-stats:create-metric': (data: QuickLogDTO) => Promise<PlatformMetric>;
  'synopsis-stats:get-metrics': (
    publicationId: string,
    dateRange?: { start: Date; end: Date }
  ) => Promise<PlatformMetric[]>;
  'synopsis-stats:get-suggestions': (publicationId: string) => Promise<MetricSuggestions>;

  // Platform Comparison
  'synopsis-stats:get-comparison': (projectId: string) => Promise<PlatformComparison[]>;
  'synopsis-stats:get-insights': (projectId: string) => Promise<InsightCard[]>;

  // Publishers
  'synopsis-stats:get-publishers': (projectId: string) => Promise<PublisherRelation[]>;
  'synopsis-stats:create-publisher': (
    data: Omit<PublisherRelation, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<PublisherRelation>;

  // Experiments
  'synopsis-stats:get-experiments': (projectId: string) => Promise<StrategyExperiment[]>;
  'synopsis-stats:create-experiment': (
    data: CreateExperimentDTO
  ) => Promise<StrategyExperiment>;
}
