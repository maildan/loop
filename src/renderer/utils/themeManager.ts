/**
 * 🎨 기가차드 테마 DOM 매니저
 * 
 * Root Class + CSS Variables 아키텍처 구현
 * - 단일 DOM 조작 지점
 * - 실시간 테마 변경
 * - 시스템 테마 자동 감지
 */

export type ThemeMode = 'light' | 'dark';

export class ThemeDOMManager {
  private static instance: ThemeDOMManager | null = null;
  private currentTheme: ThemeMode = 'light';

  private constructor() {
    this.initializeTheme();
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
      if (window.electronAPI) {
        const response = await window.electronAPI.theme.get();
        if (response.success && response.data) {
          let resolvedTheme: ThemeMode;
          
          if (response.data === 'system') {
            // 시스템 테마 감지
            resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          } else if (response.data === 'light' || response.data === 'dark') {
            resolvedTheme = response.data;
          } else {
            resolvedTheme = 'light';
          }
          
          this.applyTheme(resolvedTheme);
        }
      } else {
        // Fallback: 시스템 테마 감지
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.applyTheme(systemTheme);
      }
    } catch (error) {
      console.error('🚨 Failed to initialize theme:', error);
      this.applyTheme('light'); // 기본값
    }
  }

  /**
   * 🎯 테마 적용 (DOM 조작)
   */
  public applyTheme(theme: ThemeMode): void {
    const html = document.documentElement;
    const body = document.body;
    
    // 기존 테마 클래스 제거
    html.classList.remove('theme-light', 'theme-dark', 'dark');
    body.classList.remove('theme-light', 'theme-dark', 'dark');
    
    // 새 테마 클래스 추가
    html.classList.add(`theme-${theme}`);
    body.classList.add(`theme-${theme}`);
    
    // 현재 테마 저장
    this.currentTheme = theme;
    
    // Tailwind 호환성을 위한 dark 클래스 관리
    if (theme === 'dark') {
      html.classList.add('dark');
      body.classList.add('dark');
    }
    
    // 명시적으로 스타일 강제 적용
    html.style.setProperty('background-color', theme === 'dark' ? '#0f1419' : '#fefcf7');
    html.style.setProperty('color', theme === 'dark' ? '#f8fafc' : '#0a0a0a');
    body.style.setProperty('background-color', theme === 'dark' ? '#0f1419' : '#fefcf7');
    body.style.setProperty('color', theme === 'dark' ? '#f8fafc' : '#0a0a0a');
    
    // 메타 테마 컬러 업데이트
    this.updateMetaThemeColor(theme);
    
    console.log(`🎨 Theme applied: ${theme}`, { 
      htmlClasses: html.classList.toString(),
      bodyClasses: body.classList.toString(),
      computedStyles: {
        backgroundColor: window.getComputedStyle(html).backgroundColor,
        color: window.getComputedStyle(html).color,
        bgPrimary: window.getComputedStyle(html).getPropertyValue('--bg-primary'),
        textPrimary: window.getComputedStyle(html).getPropertyValue('--text-primary'),
        background: window.getComputedStyle(html).getPropertyValue('--background'),
        foreground: window.getComputedStyle(html).getPropertyValue('--foreground')
      }
    });
  }

  /**
   * 🎯 메타 테마 컬러 업데이트
   */
  private updateMetaThemeColor(theme: ThemeMode): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    
    if (metaThemeColor) {
      const color = theme === 'dark' ? '#0f1419' : '#fefcf7';
      metaThemeColor.setAttribute('content', color);
    }
  }

  /**
   * 🎯 현재 테마 반환
   */
  public getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }

  /**
   * 🎯 테마 토글
   */
  public async toggleTheme(): Promise<void> {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    await this.setTheme(newTheme);
  }

  /**
   * 🎯 테마 설정 (설정 저장 포함)
   */
  public async setTheme(theme: ThemeMode): Promise<void> {
    try {
      if (window.electronAPI) {
        const response = await window.electronAPI.theme.set(theme);
        if (response.success) {
          this.applyTheme(theme);
        } else {
          console.error('🚨 Failed to save theme:', response.error);
        }
      } else {
        // Fallback: DOM만 업데이트
        this.applyTheme(theme);
      }
    } catch (error) {
      console.error('🚨 Failed to set theme:', error);
    }
  }

  /**
   * 🎯 시스템 테마 변경 리스너 설정
   */
  public setupSystemThemeListener(): void {
    if (window.electronAPI) {
      try {
        window.electronAPI.theme?.onSystemChange?.((shouldUseDarkColors: boolean) => {
          window.electronAPI.theme?.get().then(response => {
            if (response.success && response.data === 'system') {
              const systemTheme = shouldUseDarkColors ? 'dark' : 'light';
              this.applyTheme(systemTheme);
            }
          }).catch(error => {
            console.error('🚨 Failed to resolve system theme:', error);
          });
        });
      } catch (error) {
        console.error('🚨 Failed to subscribe system theme listener:', error);
      }

      try {
        window.electronAPI.theme?.onChange?.((theme: ThemeMode) => {
          this.applyTheme(theme);
        });
      } catch (error) {
        console.error('🚨 Failed to subscribe theme change listener:', error);
      }
    }

    // 웹 환경에서의 시스템 테마 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Electron 환경이 아닌 경우에만 적용
      if (!window.electronAPI) {
        const systemTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(systemTheme);
      }
    });
  }
}

/**
 * 🎯 전역 테마 매니저 인스턴스
 */
export const themeManager = ThemeDOMManager.getInstance();