/**
 * 🎨 ThemeCSSManager - CSS 변수 및 스타일 관리 전용 모듈
 * 
 * 역할:
 * - CSS 변수 읽기/쓰기
 * - 테마 전환 애니메이션
 * - 사용자 선호도 관리
 * - 로컬 스토리지 연동
 */

import { Theme, ThemeTransitionOptions, UserThemePreferences } from '@/shared/types/theme';

export class ThemeCSSManager {
  
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
   * 애니메이션 감소 선호도 확인
   */
  private static getSystemReducedMotionPreference(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
   * 시스템 다크 모드 선호도 확인
   */
  private static getSystemDarkModePreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * 고대비 모드 선호도 확인
   */
  private static getSystemHighContrastPreference(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
}