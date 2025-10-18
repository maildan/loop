/**
 * 🔒 통합 Enum 정의 파일
 * 
 * 모든 프로젝트 엔티티의 상수 정의를 한 곳에서 관리
 * - Genres (장르)
 * - Statuses (상태)
 * 
 * @module shared/constants/enums
 */

/**
 * 🔥 한국 웹소설 장르 (KoreanWebNovelGenre)
 * 
 * 출처: koreanWebNovelAnalyzer.ts
 * 특징:
 * - 케밥 케이스 (canonical format)
 * - 웹소설 업계 표준
 * - AI 분석 모듈과의 일관성
 */
export type KoreanWebNovelGenre =
  | 'romance-fantasy' // 로맨스판타지 (로판) - Female-targeted
  | 'romance' // 로맨스
  | 'bl' // BL (Boys Love) - Female-targeted
  | 'modern-fantasy' // 현대판타지 (현판) - Male-targeted
  | 'hunter' // 헌터물 - Male-targeted
  | 'fantasy' // 판타지 - Male-targeted
  | 'martial-arts' // 무협 - Male-targeted
  | 'historical' // 사극 / 역사 - Mixed
  | 'unknown'; // 미분류

/**
 * 🔥 UI 표시용 장르명 매핑
 * 
 * 시스템 내부: KoreanWebNovelGenre (케밥 케이스)
 * UI 표시: 한글명 (사용자 친화적)
 */
export const GENRE_LABELS: Record<KoreanWebNovelGenre, string> = {
  'romance-fantasy': '로맨스판타지',
  'romance': '로맨스',
  'bl': 'BL',
  'modern-fantasy': '현대판타지',
  'hunter': '헌터',
  'fantasy': '판타지',
  'martial-arts': '무협',
  'historical': '사극',
  'unknown': '기타',
};

/**
 * 🔥 대상 독자층 (AI 분석 및 마케팅용)
 */
export const GENRE_TARGET_AUDIENCE: Record<KoreanWebNovelGenre, '여성향' | '남성향' | '중립'> = {
  'romance-fantasy': '여성향',
  'romance': '여성향',
  'bl': '여성향',
  'modern-fantasy': '남성향',
  'hunter': '남성향',
  'fantasy': '남성향',
  'martial-arts': '남성향',
  'historical': '중립',
  'unknown': '중립',
};

/**
 * 🔥 모든 가능한 장르 배열
 */
export const ALL_GENRES: readonly KoreanWebNovelGenre[] = [
  'romance-fantasy',
  'romance',
  'bl',
  'modern-fantasy',
  'hunter',
  'fantasy',
  'martial-arts',
  'historical',
  'unknown',
];

/**
 * 🔥 UI용 장르 선택지 (unknown 제외)
 */
export const SELECTABLE_GENRES: readonly KoreanWebNovelGenre[] = ALL_GENRES.filter(
  (g) => g !== 'unknown'
);

/**
 * 🔥 장르 유효성 검사
 */
export function isValidGenre(value: unknown): value is KoreanWebNovelGenre {
  return ALL_GENRES.includes(value as KoreanWebNovelGenre);
}

/**
 * 🔥 UI 표시용 장르명 조회
 * 
 * @param genre 장르 ID (케밥 케이스)
 * @returns 한글 장르명
 * @example getGenreLabel('romance-fantasy') // '로맨스판타지'
 */
export function getGenreLabel(genre: KoreanWebNovelGenre): string {
  return GENRE_LABELS[genre] || genre;
}

/**
 * 🔥 대상 독자층 조회
 * 
 * @param genre 장르 ID
 * @returns 대상 독자층
 */
export function getGenreAudience(genre: KoreanWebNovelGenre): '여성향' | '남성향' | '중립' {
  return GENRE_TARGET_AUDIENCE[genre] || '중립';
}

/**
 * 🔥 역매핑: 한글명 → 장르 ID
 * 
 * UI에서 선택한 한글명을 시스템 형식으로 변환
 */
export function getLabelToGenreMap(): Record<string, KoreanWebNovelGenre> {
  const map: Record<string, KoreanWebNovelGenre> = {};
  Object.entries(GENRE_LABELS).forEach(([genre, label]) => {
    map[label] = genre as KoreanWebNovelGenre;
  });
  return map;
}

// ============================================================================
// STATUS ENUMS
// ============================================================================

/**
 * 🔥 프로젝트 상태
 * 
 * - 'active': 작성 진행 중
 * - 'completed': 작성 완료
 * - 'paused': 일시 중단
 */
export type ProjectStatus = 'active' | 'completed' | 'paused';

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'active',
  'completed',
  'paused',
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  'active': '진행 중',
  'completed': '완료',
  'paused': '일시 중단',
};

export function isValidProjectStatus(value: unknown): value is ProjectStatus {
  return PROJECT_STATUSES.includes(value as ProjectStatus);
}

/**
 * 🔥 회차 상태
 * 
 * - 'draft': 초안
 * - 'in-progress': 작성 중
 * - 'completed': 작성 완료
 * - 'published': 발행됨
 */
export type EpisodeStatus = 'draft' | 'in-progress' | 'completed' | 'published';

export const EPISODE_STATUSES: readonly EpisodeStatus[] = [
  'draft',
  'in-progress',
  'completed',
  'published',
];

export const EPISODE_STATUS_LABELS: Record<EpisodeStatus, string> = {
  'draft': '초안',
  'in-progress': '작성 중',
  'completed': '완료',
  'published': '발행됨',
};

export function isValidEpisodeStatus(value: unknown): value is EpisodeStatus {
  return EPISODE_STATUSES.includes(value as EpisodeStatus);
}

/**
 * 🔥 구조 요소 상태
 * 
 * ProjectStructure 의 상태
 * - 'draft': 초안
 * - 'active': 활성
 * - 'completed': 완료
 */
export type StructureStatus = 'draft' | 'active' | 'completed';

export const STRUCTURE_STATUSES: readonly StructureStatus[] = [
  'draft',
  'active',
  'completed',
];

export const STRUCTURE_STATUS_LABELS: Record<StructureStatus, string> = {
  'draft': '초안',
  'active': '활성',
  'completed': '완료',
};

export function isValidStructureStatus(value: unknown): value is StructureStatus {
  return STRUCTURE_STATUSES.includes(value as StructureStatus);
}

// ============================================================================
// DEPRECATED: Migration helpers (ProjectValidation과의 호환성)
// ============================================================================

/**
 * 🔒 V3 검증용 호환 배열 (projectValidation.ts)
 * 
 * ⚠️ 더 이상 사용 금지 - KoreanWebNovelGenre 사용
 */
export const PROJECT_GENRES = [...SELECTABLE_GENRES] as const;

/**
 * 🔒 호환 상태 배열 (projectValidation.ts)
 */
export const PROJECT_STATUSES_COMPAT = [...PROJECT_STATUSES] as const;
