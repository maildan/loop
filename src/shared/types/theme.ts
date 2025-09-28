// 🔥 기가차드 공유 테마 타입 정의
// Main/Renderer 프로세스 간 완전 통일된 테마 시스템

/**
 * 🎨 확장된 테마 타입 - 작가 친화적 테마 포함
 */
export type Theme = 
  | 'light' 
  | 'dark' 
  | 'system'
  | 'writer-focus'
  | 'writer-focus-dark'
  | 'sepia'
  | 'sepia-dark'
  | 'warm'
  | 'cool'
  | 'forest'
  | 'midnight'
  | 'high-contrast';

/**
 * 🔥 해결된 테마 타입 (system 제외)
 */
export type ResolvedTheme = Exclude<Theme, 'system'>;

/**
 * 🔥 기본 테마 (Light/Dark/System)
 */
export type BasicTheme = 'light' | 'dark' | 'system';

/**
 * 🔥 확장 테마 (작가 친화적)
 */
export type ExtendedTheme = Exclude<Theme, BasicTheme>;

/**
 * 🎨 다크 모드 테마 목록
 */
export const DARK_THEMES: readonly Theme[] = [
  'dark',
  'writer-focus-dark',
  'sepia-dark',
  'midnight',
] as const;

/**
 * 🎨 라이트 모드 테마 목록  
 */
export const LIGHT_THEMES: readonly Theme[] = [
  'light',
  'writer-focus',
  'sepia',
  'warm',
  'cool',
  'forest',
  'high-contrast',
] as const;

/**
 * 🔥 모든 지원 테마 목록
 */
export const ALL_THEMES: readonly Theme[] = [
  'light',
  'dark', 
  'system',
  'writer-focus',
  'writer-focus-dark',
  'sepia',
  'sepia-dark',
  'warm',
  'cool',
  'forest',
  'midnight',
  'high-contrast',
] as const;

/**
 * 🔥 테마가 다크 모드인지 확인하는 유틸리티 함수
 */
export function isDarkTheme(theme: Theme): boolean {
  return DARK_THEMES.includes(theme);
}

/**
 * 🔥 테마가 라이트 모드인지 확인하는 유틸리티 함수
 */
export function isLightTheme(theme: Theme): boolean {
  return LIGHT_THEMES.includes(theme);
}

/**
 * 🔥 유효한 테마인지 확인하는 유틸리티 함수
 */
export function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && ALL_THEMES.includes(value as Theme);
}

/**
 * 🔥 테마를 다크/라이트로 해결하는 함수 (system 해결 포함)
 */
export function resolveThemeMode(theme: Theme, systemPrefersDark: boolean): 'light' | 'dark' {
  if (theme === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  
  return isDarkTheme(theme) ? 'dark' : 'light';
}