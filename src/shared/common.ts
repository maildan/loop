// 🔥 기가차드 공통 모듈 - 중복 코드 박멸 전용!

import { Logger } from './logger';

// #DEBUG: Common module entry point
Logger.time('COMMON_MODULE_LOAD');
Logger.debug('COMMON', 'Common module loaded');

// 🔥 기가차드 키보드 언어 지원 (한국어/일본어/중국어)
export interface KeyboardLanguageSupport {
  code: string;
  name: string;
  nativeName: string;
  composition: boolean; // 조합형 언어 여부
  inputMethod: 'direct' | 'composition' | 'complex';
}

// 🔥 기가차드 다국어 키보드 매핑 상수
export const KEYBOARD_LANGUAGES: Record<string, KeyboardLanguageSupport> = {
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    composition: true,
    inputMethod: 'composition',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    composition: true,
    inputMethod: 'composition',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    composition: true,
    inputMethod: 'complex',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    composition: false,
    inputMethod: 'direct',
  },
} as const;

// 🔥 기가차드 타입 가드 함수들
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

// 🔥 기가차드 에러 핸들링
export interface ErrorResult {
  success: false;
  error: string;
  timestamp: Date;
}

export interface SuccessResult<T = unknown> {
  success: true;
  data: T;
  timestamp: Date;
}

export type Result<T = unknown> = SuccessResult<T> | ErrorResult;

export function createSuccess<T>(data: T): SuccessResult<T> {
  // #DEBUG: Creating success result
  return {
    success: true,
    data,
    timestamp: new Date(),
  };
}

export function createError(error: string | Error): ErrorResult {
  // #DEBUG: Creating error result
  const errorMessage = error instanceof Error ? error.message : error;
  Logger.error('COMMON', 'Error result created', { error: errorMessage });
  
  return {
    success: false,
    error: errorMessage,
    timestamp: new Date(),
  };
}

// 🔥 기가차드 비동기 래퍼
export async function safeAsync<T>(
  operation: () => Promise<T>,
  component: string = 'UNKNOWN'
): Promise<Result<T>> {
  // #DEBUG: Starting safe async operation
  const startTime = performance.now();
  
  try {
    Logger.debug(component, 'Safe async operation starting');
    const result = await operation();
    
    const endTime = performance.now();
    Logger.debug(component, 'Safe async operation completed', {
      duration: `${(endTime - startTime).toFixed(2)}ms`
    });
    
    return createSuccess(result);
  } catch (error) {
    const endTime = performance.now();
    Logger.error(component, 'Safe async operation failed', {
      error,
      duration: `${(endTime - startTime).toFixed(2)}ms`
    });
    
    return createError(error as Error);
  }
}

// 🔥 기가차드 지연 함수
export function delay(ms: number): Promise<void> {
  // #DEBUG: Creating delay
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🔥 기가차드 재시도 로직
export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000,
  component: string = 'RETRY'
): Promise<T> {
  // #DEBUG: Starting retry operation
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      Logger.debug(component, `Retry attempt ${attempt}/${maxAttempts}`);
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        Logger.error(component, 'All retry attempts failed', { 
          attempts: maxAttempts, 
          error: lastError 
        });
        throw lastError;
      }
      
      Logger.warn(component, `Attempt ${attempt} failed, retrying...`, { 
        error: lastError,
        nextAttemptIn: `${delayMs}ms`
      });
      
      await delay(delayMs);
    }
  }
  
  throw lastError;
}

// 🔥 기가차드 디바운싱
export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  waitMs: number
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: T): void => {
    // #DEBUG: Debouncing function call
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, waitMs);
  };
}

// 🔥 기가차드 스로틀링
export function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limitMs: number
): (...args: T) => void {
  let inThrottle = false;
  
  return (...args: T): void => {
    // #DEBUG: Throttling function call
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

// 🔥 기가차드 메모이제이션
export function memoize<T extends unknown[], R>(
  func: (...args: T) => R,
  getKey?: (...args: T) => string
): (...args: T) => R {
  const cache = new Map<string, R>();
  
  return (...args: T): R => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    // #DEBUG: Checking memoization cache
    if (cache.has(key)) {
      Logger.debug('MEMOIZE', 'Cache hit', { key });
      return cache.get(key)!;
    }
    
    Logger.debug('MEMOIZE', 'Cache miss, computing result', { key });
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  };
}

// 🔥 기가차드 배열 유틸리티
export function chunkArray<T>(array: T[], size: number): T[][] {
  // #DEBUG: Chunking array
  if (size <= 0) {
    throw new Error('Chunk size must be positive');
  }
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

export function uniqueBy<T, K>(array: T[], keySelector: (item: T) => K): T[] {
  // #DEBUG: Removing duplicates by key
  const seen = new Set<K>();
  return array.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// 🔥 기가차드 객체 유틸리티
export function deepClone<T>(obj: T): T {
  // #DEBUG: Deep cloning object
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        (cloned as Record<string, unknown>)[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

export function pickProperties<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  // #DEBUG: Picking properties from object
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

// 🔥 기가차드 문자열 유틸리티
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// 🔥 기가차드 환경 체크
export const Environment = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isElectron: typeof globalThis !== 'undefined' && 'electronAPI' in globalThis,
  isBrowser: typeof globalThis !== 'undefined' && 'document' in globalThis,
  isNode: typeof process !== 'undefined',
} as const;

// 🔥 기가차드 성능 측정
export class PerformanceTracker {
  private marks = new Map<string, number>();
  
  start(label: string): void {
    // #DEBUG: Starting performance tracking
    const timestamp = performance.now();
    this.marks.set(label, timestamp);
    Logger.debug('PERF', `Performance tracking started: ${label}`, { timestamp });
  }
  
  mark(label: string): void {
    // #DEBUG: Performance mark
    const timestamp = performance.now();
    this.marks.set(`mark_${label}`, timestamp);
    Logger.debug('PERF', `Performance mark: ${label}`, { timestamp });
  }
  
  end(label: string): number {
    // #DEBUG: Ending performance tracking
    const startTime = this.marks.get(label);
    if (!startTime) {
      Logger.warn('PERF', `No start mark found for: ${label}`);
      return 0;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.marks.delete(label);
    
    Logger.debug('PERF', `Performance tracking ended: ${label}`, {
      duration: `${duration.toFixed(2)}ms`,
      startTime,
      endTime
    });
    
    return duration;
  }
  
  measure(startLabel: string, endLabel: string): number {
    // #DEBUG: Measuring between marks
    const startTime = this.marks.get(`mark_${startLabel}`);
    const endTime = this.marks.get(`mark_${endLabel}`);
    
    if (!startTime || !endTime) {
      Logger.warn('PERF', `Missing marks for measurement: ${startLabel} → ${endLabel}`);
      return 0;
    }
    
    const duration = endTime - startTime;
    Logger.debug('PERF', `Measurement: ${startLabel} → ${endLabel}`, {
      duration: `${duration.toFixed(2)}ms`
    });
    
    return duration;
  }
  
  getReport(): Record<string, number> {
    // #DEBUG: Generating performance report
    const report: Record<string, number> = {};
    Array.from(this.marks.entries()).forEach(([key, value]) => {
      report[key] = value;
    });
    
    Logger.debug('PERF', 'Generated performance report', { 
      marksCount: this.marks.size 
    });
    
    return report;
  }
}

// 🔥 기가차드 전역 인스턴스
export const perf = new PerformanceTracker();

// 🔥 기가차드 기본 익스포트 객체
const defaultExport = {
  // Type guards
  isString,
  isNumber,
  isObject,
  isArray,
  isDefined,
  
  // Error handling
  createSuccess,
  createError,
  safeAsync,
  retry,
  
  // Timing
  delay,
  debounce,
  throttle,
  memoize,
  
  // Arrays
  chunkArray,
  uniqueBy,
  
  // Objects
  deepClone,
  pickProperties,
  
  // Strings
  capitalize,
  camelToKebab,
  kebabToCamel,
  
  // Environment
  Environment,
  
  // Performance
  perf,
  
  // 🔥 새로운 키보드 언어 지원
  KEYBOARD_LANGUAGES,
} as const;

// #DEBUG: Common module exit point
perf.mark('COMMON_MODULE_COMPLETE');
Logger.timeEnd('COMMON_MODULE_LOAD');
Logger.debug('COMMON', 'Common module setup complete', {
  totalFunctions: Object.keys(defaultExport).length,
  memoryUsage: process.memoryUsage().heapUsed
});

export default defaultExport;
