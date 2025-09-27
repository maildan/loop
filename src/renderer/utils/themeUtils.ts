/**
 * 🎨 Theme Manager Utility - 다중 테마 관리 시스템
 * 
 * React Hook과 Context를 통한 테마 상태 관리
 */

import { Theme, ThemeMetadata, ThemeConfig, ThemeTransitionOptions, UserThemePreferences } from '@/shared/types/theme';

/* 🔥 기본 테마 메타데이터 */
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

/* 🔥 테마 유틸리티 클래스 */
export class ThemeUtils {
  
  /**
   * 현재 적용된 테마 감지
   */
  static getCurrentTheme(): Theme {
    const html = document.documentElement;
    
    // 클래스 기반 테마 감지
    if (html.classList.contains('dark')) return 'dark';
    if (html.classList.contains('writer-focus')) {
      return html.classList.contains('dark') ? 'writer-focus-dark' : 'writer-focus';
    }
    if (html.classList.contains('sepia')) {
      return html.classList.contains('dark') ? 'sepia-dark' : 'sepia';
    }
    
    return 'light';
  }

  /**
   * 테마 클래스 적용
   */
  static applyThemeClasses(theme: Theme): void {
    const html = document.documentElement;
    
    // 기존 테마 클래스 제거
    html.classList.remove('dark', 'writer-focus', 'sepia', 'high-contrast', 'colorblind-friendly');
    
    // 새 테마 적용
    switch (theme) {
      case 'dark':
        html.classList.add('dark');
        break;
      case 'writer-focus':
        html.classList.add('writer-focus');
        break;
      case 'writer-focus-dark':
        html.classList.add('writer-focus', 'dark');
        break;
      case 'sepia':
        html.classList.add('sepia');
        break;
      case 'sepia-dark':
        html.classList.add('sepia', 'dark');
        break;
      case 'high-contrast':
        html.classList.add('high-contrast');
        break;
      case 'colorblind-friendly':
        html.classList.add('colorblind-friendly');
        break;
      case 'light':
      default:
        // 라이트 모드는 기본값이므로 클래스 추가 불필요
        break;
    }
    
    // color-scheme 설정
    const isDark = theme.includes('dark') || theme === 'dark';
    html.style.colorScheme = isDark ? 'dark' : 'light';
  }

  /**
   * CSS 변수 값 가져오기
   */
  static getCSSVariable(variable: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }

  /**
   * CSS 변수 값 설정
   */
  static setCSSVariable(variable: string, value: string): void {
    document.documentElement.style.setProperty(variable, value);
  }

  /**
   * 시스템 다크 모드 선호도 확인
   */
  static getSystemDarkModePreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * 고대비 모드 선호도 확인
   */
  static getSystemHighContrastPreference(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  /**
   * 애니메이션 감소 선호도 확인
   */
  static getSystemReducedMotionPreference(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 테마 전환 애니메이션
   */
  static async animateThemeTransition(
    options: ThemeTransitionOptions = {}
  ): Promise<void> {
    const {
      duration = 300,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
      skipAnimation = false,
      onStart,
      onComplete
    } = options;

    if (skipAnimation || this.getSystemReducedMotionPreference()) {
      onStart?.();
      onComplete?.();
      return;
    }

    onStart?.();

    // 전환 중 클래스 추가
    document.documentElement.classList.add('theme-transitioning');

    // CSS 변수로 애니메이션 설정
    this.setCSSVariable('--theme-transition-duration', `${duration}ms`);
    this.setCSSVariable('--theme-transition-easing', easing);

    // 애니메이션 완료 대기
    await new Promise(resolve => setTimeout(resolve, duration));

    // 전환 중 클래스 제거
    document.documentElement.classList.remove('theme-transitioning');

    onComplete?.();
  }

  /**
   * 테마 유효성 검사
   */
  static validateTheme(theme: Theme): boolean {
    const validThemes: Theme[] = [
      'light', 'dark', 'writer-focus', 'writer-focus-dark', 
      'sepia', 'sepia-dark', 'high-contrast', 'colorblind-friendly'
    ];
    return validThemes.includes(theme);
  }

  /**
   * 테마 메타데이터 가져오기
   */
  static getThemeMetadata(theme: Theme): ThemeMetadata | null {
    return DEFAULT_THEMES.find(t => t.id === theme) || null;
  }

  /**
   * 다크 모드 여부 확인
   */
  static isDarkTheme(theme: Theme): boolean {
    return theme === 'dark' || theme.endsWith('-dark');
  }

  /**
   * 기본 테마로 전환
   */
  static getBaseTheme(theme: Theme): 'light' | 'dark' {
    return this.isDarkTheme(theme) ? 'dark' : 'light';
  }

  /**
   * 로컬 스토리지에서 사용자 선호도 로드
   */
  static loadUserPreferences(): UserThemePreferences {
    try {
      const stored = localStorage.getItem('user-theme-preferences');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load user theme preferences:', error);
    }

    // 기본값 반환
    return {
      preferredTheme: this.getSystemDarkModePreference() ? 'dark' : 'light',
      autoSwitchDarkMode: false,
      accessibility: {
        highContrast: this.getSystemHighContrastPreference(),
        colorblindFriendly: false,
        reducedMotion: this.getSystemReducedMotionPreference()
      },
      customThemes: [],
      favoriteThemes: ['light', 'dark', 'writer-focus', 'sepia']
    };
  }

  /**
   * 로컬 스토리지에 사용자 선호도 저장
   */
  static saveUserPreferences(preferences: UserThemePreferences): void {
    try {
      localStorage.setItem('user-theme-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user theme preferences:', error);
    }
  }

  /**
   * 시간 기반 자동 테마 전환 확인
   */
  static shouldAutoSwitchToDark(preferences: UserThemePreferences): boolean {
    if (!preferences.autoSwitchDarkMode || !preferences.darkModeSchedule) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = preferences.darkModeSchedule;

    // 일반적인 경우 (18:00 ~ 07:00)
    if (start > end) {
      return currentTime >= start || currentTime < end;
    }
    // 특수한 경우 (예: 07:00 ~ 18:00는 라이트 모드)
    else {
      return currentTime >= start && currentTime < end;
    }
  }

  /**
   * 테마 CSS 파일 동적 로드
   */
  static async loadThemeCSS(theme: Theme): Promise<void> {
    // 기본 테마는 이미 로드되어 있음
    if (theme === 'light' || theme === 'dark') return;

    const themeFile = theme.replace('-dark', ''); // writer-focus-dark → writer-focus
    const cssUrl = `/src/renderer/styles/themes/${themeFile}.css`;

    // 이미 로드된 경우 스킵
    if (document.querySelector(`link[data-theme="${themeFile}"]`)) return;

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      link.setAttribute('data-theme', themeFile);
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load theme: ${theme}`));
      
      document.head.appendChild(link);
    });
  }

  /**
   * 테마 CSS 파일 언로드
   */
  static unloadThemeCSS(theme: Theme): void {
    const themeFile = theme.replace('-dark', '');
    const link = document.querySelector(`link[data-theme="${themeFile}"]`);
    if (link) {
      link.remove();
    }
  }
}