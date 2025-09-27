/**
 * 🎨 Theme Manager Utility - 모듈화된 테마 관리 시스템
 * 
 * 새로운 아키텍처:
 * - ThemeClassManager: DOM 클래스 조작 전담  
 * - ThemeCSSManager: CSS 변수 및 애니메이션 관리
 * - TipTapThemeSync: TipTap 에디터 테마 동기화
 * - ThemeUtils: 통합 인터페이스 (이 파일)
 * 
 * 복잡도: 각 모듈 10 이하로 제한
 * 유지보수성: 단일 책임 원칙 적용
 */

import { Theme, ThemeMetadata, ThemeTransitionOptions, UserThemePreferences } from '@/shared/types/theme';
import { ThemeClassManager } from './theme/ThemeClassManager';
import { ThemeCSSManager } from './theme/ThemeCSSManager';
import { TipTapThemeSync } from './theme/TipTapThemeSync';

/* 🔥 확장된 테마 메타데이터 */
export const DEFAULT_THEMES: ThemeMetadata[] = [
  {
    id: 'light',
    name: '라이트 모드',
    description: 'shadcn/ui 기본 라이트 테마',
    category: 'base',
    author: 'shadcn',
    version: '1.0.0',
    tags: ['기본', '밝음', '표준'],
    supportsDarkMode: false,
    isAccessible: true,
    colorSpace: 'oklch'
  },
  {
    id: 'dark',
    name: '다크 모드', 
    description: 'shadcn/ui 기본 다크 테마',
    category: 'base',
    author: 'shadcn',
    version: '1.0.0',
    tags: ['기본', '어둠', '표준'],
    supportsDarkMode: true,
    isAccessible: true,
    colorSpace: 'oklch'
  },
  {
    id: 'warm',
    name: '따뜻한 테마',
    description: '부드럽고 따뜻한 색감의 테마',
    category: 'custom',
    author: 'Loop Team',
    version: '1.0.0',
    tags: ['따뜻함', '주황', '베이지'],
    supportsDarkMode: false,
    isAccessible: true,
    colorSpace: 'oklch'
  },
  {
    id: 'cool',
    name: '시원한 테마',
    description: '차갑고 깔끔한 블루 톤 테마',
    category: 'custom',
    author: 'Loop Team',
    version: '1.0.0',
    tags: ['시원함', '파랑', '깔끔'],
    supportsDarkMode: false,
    isAccessible: true,
    colorSpace: 'oklch'
  },
  {
    id: 'forest',
    name: '숲 테마',
    description: '자연스러운 녹색 계열 테마',
    category: 'custom',
    author: 'Loop Team',
    version: '1.0.0',
    tags: ['자연', '녹색', '평화'],
    supportsDarkMode: false,
    isAccessible: true,
    colorSpace: 'oklch'
  },
  {
    id: 'midnight',
    name: '자정 테마',
    description: '깊은 밤의 어두운 테마',
    category: 'custom',
    author: 'Loop Team',
    version: '1.0.0',
    tags: ['어둠', '자정', '진한'],
    supportsDarkMode: true,
    isAccessible: true,
    colorSpace: 'oklch'
  },
  {
    id: 'writer-focus',
    name: '작가 집중 모드',
    description: '장시간 글쓰기에 최적화된 집중 테마',
    category: 'writer',
    author: 'Loop Team',
    version: '1.0.0',
    tags: ['작가', '집중', '세리프', '종이'],
    supportsDarkMode: true,
    isAccessible: true,
    colorSpace: 'oklch'
  },
  {
    id: 'sepia',
    name: '세피아 종이',
    description: '종이 질감의 따뜻한 세피아 테마',
    category: 'writer',
    author: 'Loop Team', 
    version: '1.0.0',
    tags: ['세피아', '종이', '따뜻함', '빈티지'],
    supportsDarkMode: true,
    isAccessible: true,
    colorSpace: 'oklch'
  }
];

/* 🔥 통합 테마 유틸리티 클래스 */
export class ThemeUtils {
  
  /**
   * 현재 적용된 테마 감지 (위임)
   */
  static getCurrentTheme(): Theme {
    return ThemeClassManager.getCurrentTheme();
  }

  /**
   * 테마 적용 (통합 인터페이스)
   */
  static applyTheme(theme: Theme, options?: ThemeTransitionOptions): void {
    // 테마 유효성 검사
    if (!ThemeClassManager.validateTheme(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    // 애니메이션과 함께 테마 적용
    ThemeCSSManager.animateThemeTransition({
      ...options,
      onStart: () => {
        // 클래스 적용
        ThemeClassManager.applyThemeClasses(theme);
        options?.onStart?.();
      },
      onComplete: () => {
        // TipTap 동기화
        TipTapThemeSync.syncTipTapEditorVariables();
        
        // sepia 테마 특별 처리
        if (theme.includes('sepia')) {
          TipTapThemeSync.forceThemeSpecificStyles('sepia');
        }
        
        options?.onComplete?.();
      }
    });
  }

  /**
   * CSS 변수 값 가져오기 (위임)
   */
  static getCSSVariable(variable: string): string {
    return ThemeCSSManager.getCSSVariable(variable);
  }

  /**
   * CSS 변수 값 설정 (위임)
   */
  static setCSSVariable(variable: string, value: string): void {
    ThemeCSSManager.setCSSVariable(variable, value);
  }

  /**
   * TipTap 에디터 테마 동기화 (위임)
   */
  static syncTipTapEditorVariables(): void {
    TipTapThemeSync.syncTipTapEditorVariables();
  }

  /**
   * TipTap 에디터 스타일 강제 적용 (위임)
   */
  static forceTipTapEditorStyles(): void {
    TipTapThemeSync.forceTipTapEditorStyles();
  }
  /**
   * 시스템 선호도 확인 (위임)
   */
  static getSystemDarkModePreference(): boolean {
    return ThemeClassManager.getSystemDarkModePreference();
  }

  static getSystemHighContrastPreference(): boolean {
    return ThemeClassManager.getSystemHighContrastPreference();
  }

  static getSystemReducedMotionPreference(): boolean {
    return ThemeClassManager.getSystemReducedMotionPreference();
  }

  /**
   * 테마 전환 애니메이션 (위임)
   */
  static async animateThemeTransition(options: ThemeTransitionOptions = {}): Promise<void> {
    return ThemeCSSManager.animateThemeTransition(options);
  }

  /**
   * 테마 유효성 검사 (위임)
   */
  static validateTheme(theme: Theme): boolean {
    return ThemeClassManager.validateTheme(theme);
  }

  /**
   * 테마 메타데이터 가져오기
   */
  static getThemeMetadata(theme: Theme): ThemeMetadata | null {
    return DEFAULT_THEMES.find(t => t.id === theme) || null;
  }

  /**
   * 다크 모드 여부 확인 (위임)
   */
  static isDarkTheme(theme: Theme): boolean {
    return ThemeClassManager.isDarkTheme(theme);
  }

  /**
   * 기본 테마로 전환 (위임)
   */
  static getBaseTheme(theme: Theme): 'light' | 'dark' {
    return ThemeClassManager.getBaseTheme(theme);
  }

  /**
   * 사용자 선호도 관리 (위임)
   */
  static loadUserPreferences(): UserThemePreferences {
    return ThemeCSSManager.loadUserPreferences();
  }

  static saveUserPreferences(preferences: UserThemePreferences): void {
    ThemeCSSManager.saveUserPreferences(preferences);
  }

  static shouldAutoSwitchToDark(preferences: UserThemePreferences): boolean {
    return ThemeCSSManager.shouldAutoSwitchToDark(preferences);
  }

  /**
   * 🔥 하위 호환성을 위한 기존 메서드 (Deprecated)
   * @deprecated Use applyTheme() instead
   */
  static applyThemeClasses(theme: Theme): void {
    // ThemeClassManager로 위임
    ThemeClassManager.applyThemeClasses(theme);
    
    // TipTap 동기화도 실행
    TipTapThemeSync.syncTipTapEditorVariables();
  }

  /**
   * 🔥 완전 모듈화된 테마 시스템
   * - CSS: global.css에서 정적 import
   * - 클래스: ThemeClassManager가 관리
   * - 변수: ThemeCSSManager가 관리  
   * - TipTap: TipTapThemeSync가 관리
   */
}