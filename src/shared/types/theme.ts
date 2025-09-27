/**
 * 🎨 Theme System Types - 테마 시스템 타입 정의
 * 
 * 다중 테마 시스템의 TypeScript 타입 안정성을 제공합니다.
 */

/* 🔥 기본 테마 타입 */
export type BaseTheme = 'light' | 'dark';

/* 🔥 확장 테마 타입 */
export type ExtendedTheme = 
  | 'writer-focus'
  | 'writer-focus-dark'
  | 'sepia'
  | 'sepia-dark'
  | 'high-contrast'
  | 'colorblind-friendly';

/* 🔥 전체 테마 타입 */
export type Theme = BaseTheme | ExtendedTheme;

/* 🔥 테마 메타데이터 */
export interface ThemeMetadata {
  id: Theme;
  name: string;
  description: string;
  category: 'base' | 'writer' | 'accessibility' | 'custom';
  author: string;
  version: string;
  previewImage?: string;
  tags: string[];
  supportsDarkMode: boolean;
  isAccessible: boolean;
  colorSpace: 'oklch' | 'hsl' | 'rgb';
}

/* 🔥 테마 설정 */
export interface ThemeConfig {
  id: Theme;
  isDark: boolean;
  variables: Record<string, string>;
  customCSS?: string;
  animations: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
  accessibility: {
    highContrast: boolean;
    colorblindFriendly: boolean;
    reducedMotion: boolean;
  };
}

/* 🔥 테마 전환 옵션 */
export interface ThemeTransitionOptions {
  duration?: number;
  easing?: string;
  skipAnimation?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

/* 🔥 테마 컨텍스트 - 확장된 새로운 인터페이스 */
export interface ThemeContextValue {
  // 현재 상태
  theme: Theme;
  currentTheme: Theme;  // 기존 호환성
  availableThemes: ThemeMetadata[];
  isLoading: boolean;
  isTransitioning: boolean;
  preferences: UserThemePreferences;
  
  // 테마 변경 함수들
  setTheme: (theme: Theme, options?: ThemeTransitionOptions) => Promise<void>;
  switchTheme: (theme: Theme, options?: ThemeTransitionOptions) => Promise<void>; // 기존 호환성
  toggleDarkMode: () => void;
  toggleSystemTheme: () => void;
  resetTheme: () => void;
  
  // 선호도 관리
  updatePreferences: (updates: Partial<UserThemePreferences>) => void;
  toggleAccessibilityOption: (option: keyof UserThemePreferences['accessibility']) => void;
  
  // 유틸리티 함수들
  isDarkMode: boolean;
  isSystemDark: boolean;
  getThemeMetadata: (theme: Theme) => ThemeMetadata | null;
  validateTheme: (theme: Theme) => boolean;
  getThemeConfig: (theme: Theme) => ThemeConfig | null; // 기존 호환성
  applyCustomCSS: (css: string) => void; // 기존 호환성
  
  // 접근성 정보
  supportsHighContrast: boolean;
  supportsColorblindFriendly: boolean;
  supportsReducedMotion: boolean;
}

/* 🔥 테마 저장소 설정 */
export interface ThemeStorageConfig {
  key: string;
  storage: 'localStorage' | 'sessionStorage' | 'electron-store';
  fallback: Theme;
  syncAcrossDevices?: boolean;
}

/* 🔥 테마 이벤트 */
export type ThemeEvent = 
  | { type: 'THEME_CHANGED'; payload: { from: Theme; to: Theme } }
  | { type: 'THEME_LOADING'; payload: { theme: Theme } }
  | { type: 'THEME_LOADED'; payload: { theme: Theme } }
  | { type: 'THEME_ERROR'; payload: { theme: Theme; error: string } }
  | { type: 'DARK_MODE_TOGGLED'; payload: { isDark: boolean } };

/* 🔥 테마 검증 함수 타입 */
export type ThemeValidator = (theme: Theme) => boolean;
export type CSSVariableValidator = (variables: Record<string, string>) => string[];

/* 🔥 커스텀 테마 생성기 */
export interface CustomThemeBuilder {
  baseTheme: BaseTheme;
  name: string;
  description: string;
  variables: Partial<Record<CSSVariable, string>>;
  customCSS?: string;
}

/* 🔥 CSS 변수 타입 (shadcn/ui 기반) */
export type CSSVariable = 
  | '--background'
  | '--foreground' 
  | '--card'
  | '--card-foreground'
  | '--popover'
  | '--popover-foreground'
  | '--primary'
  | '--primary-foreground'
  | '--secondary'
  | '--secondary-foreground'
  | '--muted'
  | '--muted-foreground'
  | '--accent'
  | '--accent-foreground'
  | '--destructive'
  | '--destructive-foreground'
  | '--border'
  | '--input'
  | '--ring'
  | '--radius'
  | '--sidebar'
  | '--sidebar-foreground'
  | '--sidebar-primary'
  | '--sidebar-primary-foreground'
  | '--sidebar-accent'
  | '--sidebar-accent-foreground'
  | '--sidebar-border'
  | '--sidebar-ring'
  | '--editor-bg'
  | '--editor-bg-secondary'
  | '--editor-text'
  | '--editor-text-muted'
  | '--editor-border'
  | '--editor-accent';

/* 🔥 테마 팩토리 함수 */
export type ThemeFactory = (config: Partial<ThemeConfig>) => ThemeConfig;

/* 🔥 테마 매니저 인터페이스 */
export interface ThemeManager {
  init(): Promise<void>;
  loadTheme(theme: Theme): Promise<void>;
  unloadTheme(theme: Theme): Promise<void>;
  registerTheme(metadata: ThemeMetadata, config: ThemeConfig): void;
  unregisterTheme(theme: Theme): void;
  validateTheme(theme: Theme): Promise<boolean>;
  exportTheme(theme: Theme): Promise<string>;
  importTheme(cssString: string, metadata: ThemeMetadata): Promise<Theme>;
}

/* 🔥 사용자 선호도 */
export interface UserThemePreferences {
  preferredTheme: Theme;
  autoSwitchDarkMode: boolean;
  accessibility: {
    highContrast: boolean;
    colorblindFriendly: boolean;
    reducedMotion: boolean;
  };
  customThemes: CustomThemeBuilder[];
  favoriteThemes: Theme[];
  darkModeSchedule?: {
    start: string; // HH:mm 형식
    end: string;   // HH:mm 형식
    darkTheme?: Theme;
    lightTheme?: Theme;
  };
}