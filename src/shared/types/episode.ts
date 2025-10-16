/**
 * 📖 Episode Types - 한국 웹소설 회차 관리
 * 
 * Prisma Episode 모델과 동기화된 TypeScript 타입 정의
 */

import type { PlatformType } from '../constants/platform-requirements';

/**
 * 🔥 회차 상태
 */
export type EpisodeStatus = 'draft' | 'in-progress' | 'completed' | 'published';

/**
 * 🔥 5막 구조 타입 (한국식 기승전결)
 */
export type FiveActType = 'introduction' | 'rising' | 'development' | 'climax' | 'conclusion';

/**
 * 🔥 클리프행어 타입
 */
export type CliffhangerType = 'revelation' | 'danger' | 'emotional' | 'mystery';

/**
 * 🔥 Episode 인터페이스 (Prisma 모델과 동기화)
 */
export interface Episode {
  id: string;
  projectId: string;
  episodeNumber: number; // 회차 번호 (1, 2, 3...)
  title: string; // "1화: 회귀의 시작"
  content: string; // 실제 본문
  wordCount: number; // 현재 단어 수
  targetWordCount: number; // 목표 단어 수 (기본 5500자)
  status: EpisodeStatus; // 회차 상태
  act: FiveActType | null; // 5막 구조 매핑
  cliffhangerType: CliffhangerType | null; // 클리프행어 유형
  cliffhangerIntensity: number | null; // 클리프행어 강도 (1-10)
  notes: string | null; // 작가 메모
  sortOrder: number; // 정렬 순서
  isActive: boolean; // 활성 상태
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null; // 발행 일시
  platform: PlatformType | null; // 🔥 Phase 2: 연재 플랫폼 (카카오/네이버/문피아 등)
}

/**
 * 🔥 Episode 생성 DTO
 */
export interface CreateEpisodeInput {
  projectId: string;
  episodeNumber: number;
  title: string;
  content?: string;
  targetWordCount?: number;
  status?: EpisodeStatus;
  act?: FiveActType;
  notes?: string;
  platform?: PlatformType | null; // 🔥 Phase 2: 연재 플랫폼
}

/**
 * 🔥 Episode 수정 DTO
 */
export interface UpdateEpisodeInput {
  title?: string;
  content?: string;
  wordCount?: number;
  targetWordCount?: number;
  status?: EpisodeStatus;
  act?: FiveActType;
  cliffhangerType?: CliffhangerType;
  cliffhangerIntensity?: number;
  notes?: string;
  sortOrder?: number;
  platform?: PlatformType | null; // 🔥 Phase 2: 플랫폼 변경
}

/**
 * 🔥 비축 현황 (Manuscript Reserves)
 * 
 * 한국 웹소설 작가의 필수 지표:
 * - 완성된 회차 vs 발행된 회차
 * - 비축 회차 수 = completed - published
 */
export interface ManuscriptReserves {
  totalEpisodes: number; // 전체 회차 수 (모든 상태)
  draftEpisodes: number; // 초안 회차 수
  inProgressEpisodes: number; // 작성 중 회차 수
  completedEpisodes: number; // 완성된 회차 수
  publishedEpisodes: number; // 발행된 회차 수
  reserveCount: number; // 비축 회차 (completed - published)
  lastPublishedDate: Date | null; // 마지막 발행일
  nextScheduledPublish: Date | null; // 다음 예정일 (optional)
  totalWordCount: number; // 전체 단어 수
  averageWordCount: number; // 평균 단어 수 (completed episodes 기준)
}

/**
 * 🔥 5막 구조 분석 결과
 */
export interface FiveActAnalysis {
  act: FiveActType;
  name: string; // 한국어 이름 (도입, 발단, 전개, 절정, 결말)
  description: string;
  targetPercentage: number; // 목표 비율 (도입 10%, 발단 20%, ...)
  currentPercentage: number; // 현재 비율
  targetWordCount: number; // 목표 단어 수
  currentWordCount: number; // 현재 단어 수
  episodes: Episode[]; // 이 막에 속한 회차들
  isComplete: boolean; // 목표 달성 여부
}

/**
 * 🔥 Episode 필터 옵션
 */
export interface EpisodeFilterOptions {
  status?: EpisodeStatus;
  act?: FiveActType;
  hasCliffhanger?: boolean;
  minWordCount?: number;
  maxWordCount?: number;
  publishedAfter?: Date;
  publishedBefore?: Date;
  limit?: number;
  offset?: number;
}

/**
 * 🔥 Episode 정렬 옵션
 */
export type EpisodeSortBy = 'episodeNumber' | 'createdAt' | 'updatedAt' | 'wordCount' | 'status';
export type EpisodeSortOrder = 'asc' | 'desc';

export interface EpisodeSortOptions {
  sortBy: EpisodeSortBy;
  order: EpisodeSortOrder;
  field?: EpisodeSortBy; // legacy 호환성
  direction?: EpisodeSortOrder; // legacy 호환성
}

/**
 * 🔥 Episode 통계
 */
export interface EpisodeStats {
  totalEpisodes: number;
  byStatus: Record<EpisodeStatus, number>;
  byAct: Partial<Record<FiveActType, number>>;
  totalWordCount: number;
  averageWordCount: number;
  longestEpisode: { episodeNumber: number; wordCount: number } | null;
  shortestEpisode: { episodeNumber: number; wordCount: number } | null;
  withCliffhanger: number;
}

/**
 * 🔥 Phase 2: 플랫폼별 충족률 계산을 위한 확장 타입
 * 
 * Episode 데이터에 계산 속성을 추가한 유틸리티 타입
 */
export interface EpisodeWithCompletion extends Episode {
  /**
   * 플랫폼 기준 대비 충족률 (0-100+, 소수점 1자리)
   * platform이 null이면 0
   */
  completionRate: number;
  
  /**
   * 충족 상태 ('success' | 'warning' | 'danger')
   */
  completionStatus: 'success' | 'warning' | 'danger';
}
