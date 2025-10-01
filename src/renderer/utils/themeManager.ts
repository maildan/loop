/**
 * 🎨 기가차드 테마 DOM 매니저
 * 
 * Root Class + CSS Variables 아키텍처 구현
 * - 단일 DOM 조작 지점
 * - 실시간 테마 변경
 * - 시스템 테마 자동 감지
 */
import type { Theme } from '../../shared/types/theme';
import { resolveThemeMode, isValidTheme, ALL_THEMES } from '../../shared/types/theme';
import { Logger } from '../../shared/logger';

export type ThemeMode = 'light' | 'dark';

export class ThemeDOMManager {
  private static instance: ThemeDOMManager | null = null;
  private currentThemePreference: Theme = 'system';
  private currentResolvedMode: ThemeMode = 'light';
  private readonly systemDarkMediaQuery: MediaQueryList;
  private listenersRegistered = false;

  private constructor() {
    this.systemDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    void this.initializeTheme();
    this.setupSystemThemeListener();
  }

  public static getInstance(): ThemeDOMManager {
    if (!ThemeDOMManager.instance) {
      ThemeDOMManager.instance = new ThemeDOMManager();
    }
    return ThemeDOMManager.instance;
  }

  /**
   * 🎯 초기 테마 설정
   */
  private async initializeTheme(): Promise<void> {
    try {
      let initialTheme: Theme = 'system';

      if (window.electronAPI?.theme) {
        const response = await window.electronAPI.theme.get();
        if (response.success && isValidTheme(response.data)) {
          initialTheme = response.data;
        }
      }

      this.applyTheme(initialTheme);
    } catch (error) {
      Logger.error('THEME_MANAGER', 'Failed to initialize theme', error);
      this.applyTheme('light'); // 기본값
    }
  }

  /**
   * 🎯 테마 적용 (DOM 조작)
   */
  public applyTheme(theme: Theme, systemPrefersDarkOverride?: boolean): void {
    const preference = isValidTheme(theme) ? theme : 'system';
    const systemPrefersDark = systemPrefersDarkOverride ?? this.systemDarkMediaQuery.matches;
    const resolvedMode = resolveThemeMode(preference, systemPrefersDark);
    const dataThemeValue = preference === 'system' ? resolvedMode : preference;

    this.currentThemePreference = preference;
    this.currentResolvedMode = resolvedMode;

    const html = document.documentElement;
    const body = document.body;

    // 기존 클래스 정리
    const classesToRemove = new Set<string>([
      'dark',
      'theme-light',
      'theme-dark',
    ]);

    ALL_THEMES.forEach((supportedTheme) => {
      classesToRemove.add(`theme-${supportedTheme}`);
      classesToRemove.add(supportedTheme);
    });

    classesToRemove.forEach((className) => {
      html.classList.remove(className);
      body.classList.remove(className);
    });

    // 새 클래스 설정
    html.classList.add(`theme-${resolvedMode}`);
    body.classList.add(`theme-${resolvedMode}`);

    if (preference !== 'system') {
      html.classList.add(`theme-${preference}`);
      body.classList.add(`theme-${preference}`);
    }

    if (resolvedMode === 'dark') {
      html.classList.add('dark');
      body.classList.add('dark');
    }

    // data-theme 속성 업데이트
    html.setAttribute('data-theme', dataThemeValue);
    body.setAttribute('data-theme', dataThemeValue);
    html.setAttribute('data-theme-mode', resolvedMode);
    body.setAttribute('data-theme-mode', resolvedMode);
    html.setAttribute('data-theme-preference', preference);
    body.setAttribute('data-theme-preference', preference);

    // 명시적 스타일 적용
    const computedStyles = window.getComputedStyle(body);
    const fallbackBackground = resolvedMode === 'dark' ? '#0f1419' : '#fefcf7';
    const fallbackText = resolvedMode === 'dark' ? '#f8fafc' : '#0a0a0a';
    const backgroundColor =
      computedStyles.getPropertyValue('--bg-primary').trim() ||
      computedStyles.getPropertyValue('--background').trim() ||
      fallbackBackground;
    const textColor =
      computedStyles.getPropertyValue('--text-primary').trim() ||
      computedStyles.getPropertyValue('--foreground').trim() ||
      fallbackText;

    html.style.setProperty('background-color', backgroundColor);
    html.style.setProperty('color', textColor);
    body.style.setProperty('background-color', backgroundColor);
    body.style.setProperty('color', textColor);

    this.updateMetaThemeColor(backgroundColor);

    Logger.debug('THEME_MANAGER', `Theme applied: ${preference}`, {
      resolvedMode,
      dataThemeValue,
      htmlClasses: html.classList.toString(),
      bodyClasses: body.classList.toString(),
      computedStyles: {
        backgroundColor,
        color: textColor,
        bgPrimary: computedStyles.getPropertyValue('--bg-primary'),
        textPrimary: computedStyles.getPropertyValue('--text-primary'),
        background: computedStyles.getPropertyValue('--background'),
        foreground: computedStyles.getPropertyValue('--foreground'),
      },
    });
  }

  /**
   * 🎯 메타 테마 컬러 업데이트
   */
  private updateMetaThemeColor(color: string): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
  }

  /**
   * 🎯 현재 테마 반환
   */
  public getCurrentTheme(): Theme {
    return this.currentThemePreference;
  }

  public getResolvedThemeMode(): ThemeMode {
    return this.currentResolvedMode;
  }

  /**
   * 🎯 테마 토글
   */
  public async toggleTheme(): Promise<void> {
    const newThemePreference = this.currentResolvedMode === 'dark' ? 'light' : 'dark';
    await this.setTheme(newThemePreference);
  }

  /**
   * 🎯 테마 설정 (설정 저장 포함)
   */
  public async setTheme(theme: Theme): Promise<void> {
    try {
      if (window.electronAPI?.theme) {
        const response = await window.electronAPI.theme.set(theme);
        if (response.success) {
          this.applyTheme(theme);
        } else {
          Logger.error('THEME_MANAGER', 'Failed to save theme', { error: response.error });
        }
      } else {
        // Fallback: DOM만 업데이트
        this.applyTheme(theme);
      }
    } catch (error) {
      Logger.error('THEME_MANAGER', 'Failed to set theme', error);
    }
  }

  /**
   * 🎯 시스템 테마 변경 리스너 설정
   */
  public setupSystemThemeListener(): void {
    if (this.listenersRegistered) {
      return;
    }

    this.listenersRegistered = true;

    if (window.electronAPI?.theme) {
      const { theme } = window.electronAPI;

      if (typeof theme.onChange === 'function') {
        try {
          theme.onChange((newTheme: Theme) => {
            if (isValidTheme(newTheme)) {
              this.applyTheme(newTheme);
            }
          });
        } catch (error) {
          Logger.error('THEME_MANAGER', 'Failed to subscribe theme change listener', error);
        }
      }

      if (typeof theme.onSystemChange === 'function') {
        try {
          theme.onSystemChange((shouldUseDarkColors: boolean) => {
            if (this.currentThemePreference === 'system') {
              this.applyTheme('system', shouldUseDarkColors);
            }
          });
        } catch (error) {
          Logger.error('THEME_MANAGER', 'Failed to subscribe system theme listener', error);
        }
      }
    }

    // 시스템 테마 감지 (웹/디폴트)
    const handleSystemPreferenceChange = (event: MediaQueryListEvent) => {
      if (this.currentThemePreference === 'system') {
        this.applyTheme('system', event.matches);
      }
    };

    this.systemDarkMediaQuery.addEventListener('change', handleSystemPreferenceChange);
  }
}

/**
 * 🎯 전역 테마 매니저 인스턴스
 */
export const themeManager = ThemeDOMManager.getInstance();