import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 🔥 기가차드 유틸리티: Tailwind 클래스 병합
 * clsx와 tailwind-merge를 결합하여 조건부 클래스와 중복 제거를 동시에 처리
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 🔥 기가차드 유틸리티: 타입 안전한 키 추출
 */
export function getObjectKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * 🔥 기가차드 유틸리티: 딜레이 함수
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 🔥 기가차드 유틸리티: 디바운스
 */
export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  waitMs: number
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: T): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, waitMs);
  };
}

/**
 * 🔥 기가차드 유틸리티: 포맷팅
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * 🔥 기가차드 유틸리티: 타입 가드
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}
