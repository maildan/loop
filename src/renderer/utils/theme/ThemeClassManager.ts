/**
 * 🎯 ThemeClassManager - 테마 클래스 관리 전용 모듈
 * 
 * 역할:
 * - DOM 클래스 조작
 * - 테마 클래스 적용/제거
 * - color-scheme 설정
 * - 시스템 접근성 설정 감지
 */

import { Theme } from '@/shared/types/theme';

export class ThemeClassManager {
  
  /**
   * 현재 적용된 테마 감지
   */
  static getCurrentTheme(): Theme {
    const html = document.documentElement;
    
    // 🔥 data-theme 속성 우선 확인 (CSS 셀렉터와 일치)
    const dataTheme = html.getAttribute('data-theme');
    if (dataTheme && this.validateTheme(dataTheme as Theme)) {
      return dataTheme as Theme;
    }
    
    // 클래스 기반 테마 감지 (fallback)
    if (html.classList.contains('dark')) return 'dark';
    if (html.classList.contains('writer-focus')) {
      return html.classList.contains('dark') ? 'writer-focus-dark' : 'writer-focus';
    }
    if (html.classList.contains('sepia')) {
      return html.classList.contains('dark') ? 'sepia-dark' : 'sepia';
    }
    if (html.classList.contains('warm')) return 'warm';
    if (html.classList.contains('cool')) return 'cool'; 
    if (html.classList.contains('forest')) return 'forest';
    if (html.classList.contains('midnight')) return 'midnight';
    
    return 'light';
  }

  /**
   * 테마 클래스 적용
   */
  static applyThemeClasses(theme: Theme): void {
    const html = document.documentElement;
    const body = document.body;
    
    // 기존 테마 클래스 제거
    this.removeAllThemeClasses(html);
    if (body) this.removeAllThemeClasses(body);
    
    // 새 테마 적용
    this.addThemeClasses(html, theme);
    if (body) this.addThemeClasses(body, theme);
    
    // 🔥 data-theme 속성 설정 (CSS 셀렉터를 위해 필수!)
    this.setDataThemeAttribute(html, theme);
    if (body) this.setDataThemeAttribute(body, theme);
    
    // color-scheme 설정
    this.setColorScheme(html, theme);
  }

  /**
   * 모든 테마 클래스 제거
   */
  private static removeAllThemeClasses(html: HTMLElement): void {
    html.classList.remove(
      'dark', 'writer-focus', 'sepia', 'high-contrast', 
      'colorblind-friendly', 'warm', 'cool', 'forest', 'midnight'
    );
  }

  /**
   * 테마에 맞는 클래스 추가
   */
  private static addThemeClasses(html: HTMLElement, theme: Theme): void {
    const themeClassMap: Record<string, string[]> = {
      'dark': ['dark'],
      'writer-focus': ['writer-focus'],
      'writer-focus-dark': ['writer-focus', 'dark'],
      'sepia': ['sepia'],
      'sepia-dark': ['sepia', 'dark'],
      'high-contrast': ['high-contrast'],
      'colorblind-friendly': ['colorblind-friendly'],
      'warm': ['warm'],
      'cool': ['cool'],
      'forest': ['forest'],
      'midnight': ['midnight'],
      'system': this.getSystemDarkModePreference() ? ['dark'] : []
    };

    const classes = themeClassMap[theme] || [];
    classes.forEach(className => html.classList.add(className));
  }

  /**
   * 🔥 data-theme 속성 설정 (CSS 셀렉터용)
   */
  private static setDataThemeAttribute(html: HTMLElement, theme: Theme): void {
    // system 테마는 실제 테마로 변환
    if (theme === 'system') {
      theme = this.getSystemDarkModePreference() ? 'dark' : 'light';
    }
    
    // data-theme 속성 설정
    html.setAttribute('data-theme', theme);
  }

  /**
   * color-scheme 설정
   */
  private static setColorScheme(html: HTMLElement, theme: Theme): void {
    const isDark = theme.includes('dark') || theme === 'dark' || theme === 'midnight';
    html.style.colorScheme = isDark ? 'dark' : 'light';
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
   * 테마 유효성 검사
   */
  static validateTheme(theme: Theme): boolean {
    const validThemes: Theme[] = [
      'light', 'dark', 'system',
      'writer-focus', 'writer-focus-dark', 
      'sepia', 'sepia-dark', 
      'high-contrast', 'colorblind-friendly',
      'warm', 'cool', 'forest', 'midnight'
    ];
    return validThemes.includes(theme);
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
}