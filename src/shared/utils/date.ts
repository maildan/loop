/**
 * 🔥 날짜 유틸리티 - 최소화 버전
 * 
 * YAGNI 원칙: date-fns-tz 없이 네이티브 API만 사용
 * Electron 환경에서 Intl API 완전 지원
 */

/**
 * ISO 날짜 포맷 (YYYY-MM-DD)
 * @param date Date 객체
 * @returns YYYY-MM-DD 형식 문자열
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * 짧은 날짜 포맷 (M/D)
 * @param date Date 객체
 * @returns M/D 형식 문자열
 */
export function formatDateShort(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * N일 전 날짜 계산 (시작 시간으로 설정)
 * @param days 일수
 * @param from 기준 날짜 (기본: 현재)
 * @returns N일 전 날짜 (시간 00:00:00)
 */
export function getDaysAgo(days: number, from: Date = new Date()): Date {
  const result = new Date(from);
  result.setDate(result.getDate() - days);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 오늘 시작 시간 (00:00:00)
 * @returns 오늘 00:00:00 Date
 */
export function getTodayStart(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * 두 날짜가 같은 날인지 확인
 * @param date1 첫 번째 날짜
 * @param date2 두 번째 날짜
 * @returns 같은 날이면 true
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 한국어 날짜 포맷 (YYYY년 M월 D일)
 * @param date Date 객체
 * @returns YYYY년 M월 D일 형식
 */
export function formatDateKorean(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}
