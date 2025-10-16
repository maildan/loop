/**
 * 📖 웹소설 플랫폼별 회차 기준 - 한국 주요 플랫폼
 * 
 * 리서치 출처:
 * - 카카오페이지/네이버시리즈/조아라/노벨피아: 5,000~5,500자 (업계 표준)
 * - 문피아: 4,500자
 * - 일반적으로 1회차 = A4 4.5~5장 분량
 * 
 * @see https://edseo.tistory.com/74 (문피아 작가 가이드)
 * @see https://ideasoop.tistory.com/65 (웹소설 분량 환산)
 */

/**
 * 🔥 지원하는 웹소설 플랫폼
 */
export type PlatformType = 'kakao' | 'naver' | 'munpia' | 'joara' | 'novelpia';

/**
 * 🔥 플랫폼별 최소 글자수 기준 (단어 기준)
 * 
 * 주의: calculateWordCount()는 토큰 기반이므로 실제 글자수와 차이 있을 수 있음
 * 한글의 경우 단어 수 ≒ 글자수 * 0.4 정도로 추정
 */
export const PLATFORM_REQUIREMENTS: Record<PlatformType, number> = {
  kakao: 5000,      // 카카오페이지 - 5,000자
  naver: 5000,      // 네이버시리즈 - 5,000자
  munpia: 4500,     // 문피아 - 4,500자 (판타지/무협 특화)
  joara: 5000,      // 조아라 - 5,000자
  novelpia: 5500,   // 노벨피아 - 5,500자
} as const;

/**
 * 🔥 플랫폼 한글 이름 매핑
 */
export const PLATFORM_NAMES: Record<PlatformType, string> = {
  kakao: '카카오페이지',
  naver: '네이버시리즈',
  munpia: '문피아',
  joara: '조아라',
  novelpia: '노벨피아',
} as const;

/**
 * 🔥 플랫폼별 대표 색상 (Tailwind CSS 클래스)
 */
export const PLATFORM_COLORS: Record<PlatformType, string> = {
  kakao: 'bg-yellow-500 text-black',     // 카카오 노란색
  naver: 'bg-green-600 text-white',      // 네이버 초록색
  munpia: 'bg-purple-600 text-white',    // 문피아 보라색
  joara: 'bg-blue-600 text-white',       // 조아라 파란색
  novelpia: 'bg-orange-600 text-white',  // 노벨피아 주황색
} as const;

/**
 * 🔥 플랫폼 목록 (UI 렌더링용)
 */
export const PLATFORMS: Array<{ id: PlatformType; name: string; requirement: number }> = [
  { id: 'kakao', name: PLATFORM_NAMES.kakao, requirement: PLATFORM_REQUIREMENTS.kakao },
  { id: 'naver', name: PLATFORM_NAMES.naver, requirement: PLATFORM_REQUIREMENTS.naver },
  { id: 'munpia', name: PLATFORM_NAMES.munpia, requirement: PLATFORM_REQUIREMENTS.munpia },
  { id: 'joara', name: PLATFORM_NAMES.joara, requirement: PLATFORM_REQUIREMENTS.joara },
  { id: 'novelpia', name: PLATFORM_NAMES.novelpia, requirement: PLATFORM_REQUIREMENTS.novelpia },
];

/**
 * 🔥 충족률 계산 (wordCount 기반)
 * 
 * @param wordCount 현재 단어 수
 * @param platform 연재 플랫폼
 * @returns 충족률 (0-100+, 소수점 1자리)
 */
export function calculateCompletionRate(
  wordCount: number,
  platform: PlatformType | null | undefined
): number {
  if (!platform || wordCount === 0) {
    return 0;
  }

  const requirement = PLATFORM_REQUIREMENTS[platform];
  return Math.round((wordCount / requirement) * 1000) / 10; // 소수점 1자리
}

/**
 * 🔥 충족률 상태 판단
 * 
 * @param completionRate 충족률 (0-100+)
 * @returns 'success' (100%+) | 'warning' (80-99%) | 'danger' (80% 미만)
 */
export function getCompletionStatus(completionRate: number): 'success' | 'warning' | 'danger' {
  if (completionRate >= 100) return 'success';
  if (completionRate >= 80) return 'warning';
  return 'danger';
}

/**
 * 🔥 충족률 색상 (Tailwind CSS 클래스)
 */
export function getCompletionColor(completionRate: number): string {
  const status = getCompletionStatus(completionRate);
  
  switch (status) {
    case 'success':
      return 'text-green-600 bg-green-50';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50';
    case 'danger':
      return 'text-red-600 bg-red-50';
  }
}

/**
 * 🔥 Progress Bar 색상
 */
export function getProgressColor(completionRate: number): string {
  const status = getCompletionStatus(completionRate);
  
  switch (status) {
    case 'success':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'danger':
      return 'bg-red-500';
  }
}
