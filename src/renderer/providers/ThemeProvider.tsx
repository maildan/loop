'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Logger } from '../../shared/logger';

// 🔥 테마 타입 정의 - 작가 전용 테마들 추가
export type Theme = 'light' | 'dark' | 'system' | 'sepia' | 'high-contrast' | 'warm' | 'cool' | 'forest' | 'midnight';

// 작가 전용 테마 메타데이터
export const AUTHOR_THEMES = {
  sepia: {
    name: '세피아',
    description: '따뜻한 종이 느낌으로 눈의 피로를 줄입니다',
    category: 'comfortable',
    baseScheme: 'light'
  },
  'high-contrast': {
    name: '고대비',
    description: '접근성을 위한 최대 대비 모드',
    category: 'accessibility',
    baseScheme: 'light'
  },
  warm: {
    name: '따뜻함',
    description: '따뜻한 색온도로 편안한 작업 환경',
    category: 'comfortable',
    baseScheme: 'light'
  },
  cool: {
    name: '시원함',
    description: '차가운 색온도로 집중력 향상',
    category: 'focus',
    baseScheme: 'light'
  },
  forest: {
    name: '숲',
    description: '자연스러운 녹색으로 안정감 제공',
    category: 'comfortable',
    baseScheme: 'light'
  },
  midnight: {
    name: '자정',
    description: '극도로 어두운 환경에서 최적화된 테마',
    category: 'dark',
    baseScheme: 'dark'
  }
} as const;

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: Exclude<Theme, 'system'>; // 실제 적용된 테마 (system 제외)
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// 🔥 Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 🔥 프리컴파일된 스타일
const THEME_STYLES = {
  root: 'transition-colors duration-200',
} as const;

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 🔥 하이드레이션 안전: 서버와 클라이언트 초기값 완전 동기화
    return defaultTheme; // 항상 'system'으로 시작 (서버와 동일)
  });

  // 클라이언트 초기 렌더에서 서버가 넣어둔 HTML 속성(data-theme / class)을 우선 읽어
  // 초기값으로 사용하여 hydration mismatch를 방지합니다.
  // 초기값은 서버가 삽입한 HTML 속성(data-theme/class)을 우선 사용합니다.
  // 시스템 프리퍼런스(matchMedia)는 클라이언트 마운트 이후에만 적용합니다.
  const [resolvedTheme, setResolvedTheme] = useState<Exclude<Theme, 'system'>>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const html = document.documentElement;
      const dataTheme = html.getAttribute('data-theme') as Exclude<Theme, 'system'>;
      const validThemes: Exclude<Theme, 'system'>[] = ['light', 'dark', 'sepia', 'high-contrast', 'warm', 'cool', 'forest', 'midnight'];
      
      if (dataTheme && validThemes.includes(dataTheme)) return dataTheme;
      
      // 클래스 기반 감지 (레거시)
      if (html.classList.contains('dark')) return 'dark';
      if (html.classList.contains('light')) return 'light';
      
      // 아무 설정이 없으면 서버 기본과 동일하게 'light'로 시작
      return 'light';
    } catch (e) {
      return 'light';
    }
  });

  // 🔥 시스템 테마 감지
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // 🔥 해결된 테마 계산
  const calculateResolvedTheme = useCallback((currentTheme: Theme): Exclude<Theme, 'system'> => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme as Exclude<Theme, 'system'>;
  }, [getSystemTheme]);

  // 🔥 Helper: 로컬 스토리지에 테마 저장
  const saveThemeToLocalStorage = useCallback((theme: Theme, resolved: Exclude<Theme, 'system'>) => {
    try {
      localStorage.setItem('loop-theme', theme);
      localStorage.setItem('loop-theme-resolved', resolved);
      Logger.debug('THEME_PROVIDER', 'Theme saved to localStorage', { theme, resolved });
    } catch (storageError) {
      Logger.warn('THEME_PROVIDER', 'Failed to save theme to localStorage', storageError);
    }
  }, []);

  // 🔥 Helper: 백엔드에 테마 저장
  const saveThemeToBackend = useCallback(async (theme: Theme, resolved: Exclude<Theme, 'system'>) => {
    try {
      const result = await window.electronAPI.settings.set('theme', theme);
      if (result.success) {
        Logger.info('THEME_PROVIDER', 'Theme saved to backend', { theme, resolved });
      } else {
        Logger.warn('THEME_PROVIDER', 'Failed to save theme to backend', result.error);
      }
    } catch (error) {
      Logger.error('THEME_PROVIDER', 'Error saving theme to backend', error);
    }
  }, []);

  // 🔥 Helper: DOM에 테마 속성 적용 (완전한 전파 보장)
  const applyThemeToDOM = useCallback((resolved: Exclude<Theme, 'system'>) => {
    const root = document.documentElement;
    const body = document.body;
    const allThemes = ['light', 'dark', 'system', 'sepia', 'high-contrast', 'warm', 'cool', 'forest', 'midnight'];
    const baseScheme = AUTHOR_THEMES[resolved as keyof typeof AUTHOR_THEMES]?.baseScheme || resolved;
    
    // 🔥 HTML 요소에 테마 적용 (최우선)
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-color-scheme', baseScheme);
    root.style.setProperty('color-scheme', baseScheme);
    root.classList.remove(...allThemes);
    root.classList.add(resolved);

    // 🔥 Body 요소에도 동일하게 적용 (이중 보장)
    if (body) {
      body.setAttribute('data-theme', resolved);
      body.setAttribute('data-color-scheme', baseScheme);
      body.style.setProperty('color-scheme', baseScheme);
      body.classList.remove(...allThemes);
      body.classList.add(resolved);
    }
    
    // 🔥 #root 요소가 있다면 추가 적용 (React 앱 루트)
    const appRoot = document.getElementById('root');
    if (appRoot) {
      appRoot.setAttribute('data-theme', resolved);
      appRoot.setAttribute('data-color-scheme', baseScheme);
      appRoot.classList.remove(...allThemes);
      appRoot.classList.add(resolved);
    }
    
    // 🔥 모든 주요 컨테이너에 테마 강제 적용
    const containers = [
      '.app-container',
      '.main-content',
      '.sidebar',
      '.content-area',
      '.prose',
      '.editor-content',
      'main',
      'article',
      'section'
    ];
    
    containers.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.setAttribute('data-theme', resolved);
        element.classList.remove(...allThemes);
        element.classList.add(resolved);
      });
    });
    
    // 🔥 CSS 변수 강제 재적용 (중요!)
    root.style.setProperty('--current-theme', resolved);
    
    Logger.debug('THEME_PROVIDER', 'Theme applied to DOM elements', {
      resolved,
      baseScheme,
      rootClasses: root.className,
      bodyClasses: body?.className,
      appRootExists: !!appRoot,
      containersUpdated: containers.length
    });
  }, []);  // 🔥 Helper: 폰트 CSS 재적용
  const reapplyFontCSS = useCallback(async (theme: Theme, resolved: Exclude<Theme, 'system'>) => {
    try {
      if ((window as any).electronAPI?.font?.injectCSS) {
        const fontResult = await (window as any).electronAPI.font.injectCSS();
        if (fontResult?.success) {
          Logger.info('THEME_PROVIDER', '테마 변경 시 폰트 CSS 재적용 성공', {
            theme,
            resolved,
            cssKey: fontResult.cssKey
          });
        } else {
          Logger.warn('THEME_PROVIDER', '테마 변경 시 폰트 CSS 재적용 실패', {
            theme,
            error: fontResult?.error
          });
        }
      }
    } catch (fontError) {
      Logger.warn('THEME_PROVIDER', '테마 변경 시 폰트 CSS 재적용 에러', fontError);
    }
  }, []);

  // 🔥 Helper: HTML에서 현재 테마 감지
  const detectCurrentThemeFromDOM = useCallback((): Exclude<Theme, 'system'> => {
    const htmlElement = document.documentElement;
    const dataTheme = htmlElement.getAttribute('data-theme') as Exclude<Theme, 'system'>;
    const validThemes: Exclude<Theme, 'system'>[] = ['light', 'dark', 'sepia', 'high-contrast', 'warm', 'cool', 'forest', 'midnight'];
    
    if (dataTheme && validThemes.includes(dataTheme)) return dataTheme;
    
    // 클래스 기반 감지 (레거시)
    if (htmlElement.classList.contains('dark')) return 'dark';
    if (htmlElement.classList.contains('light')) return 'light';
    
    return 'light'; // 기본값
  }, []);

  // 🔥 Helper: 백엔드에서 테마 로드 (단순화)
  const loadThemeFromStorage = useCallback(async (): Promise<{ theme: Theme; source: string }> => {
    const validThemes: Theme[] = ['light', 'dark', 'system', 'sepia', 'high-contrast', 'warm', 'cool', 'forest', 'midnight'];
    
    // 백엔드 시도
    try {
      const result = await window.electronAPI?.settings?.get('theme');
      const themeValue = result?.success ? result.data as Theme : null;
      if (themeValue && validThemes.includes(themeValue)) {
        return { theme: themeValue, source: 'backend' };
      }
    } catch {
      // 무시
    }

    // 로컬 스토리지 폴백
    try {
      const localTheme = localStorage.getItem('loop-theme') as Theme;
      if (localTheme && validThemes.includes(localTheme)) {
        return { theme: localTheme, source: 'localStorage' };
      }
    } catch {
      // 무시
    }

    return { theme: defaultTheme, source: 'default' };
  }, [defaultTheme]);

  // 🔥 Helper: 테마 동기화 (단순화)
  const syncThemeWithDOM = useCallback((resolved: Exclude<Theme, 'system'>, currentDOMTheme: Exclude<Theme, 'system'>) => {
    setResolvedTheme(resolved);
    
    const htmlElement = document.documentElement;
    const allThemes = ['light', 'dark', 'system', 'sepia', 'high-contrast', 'warm', 'cool', 'forest', 'midnight'];
    const baseScheme = AUTHOR_THEMES[resolved as keyof typeof AUTHOR_THEMES]?.baseScheme || resolved;
    
    // DOM 업데이트
    htmlElement.classList.remove(...allThemes);
    htmlElement.classList.add(resolved);
    htmlElement.setAttribute('data-theme', resolved);
    htmlElement.style.setProperty('color-scheme', baseScheme);
    document.body?.setAttribute('data-theme', resolved);
    document.body?.style.setProperty('color-scheme', baseScheme);
    
    Logger.info('THEME_PROVIDER', resolved !== currentDOMTheme ? 'Theme synchronized' : 'Theme reinforced', {
      resolved,
      current: currentDOMTheme
    });
  }, []);

  // 🔥 Helper: 에러 시 폴백 테마 적용
  const applyFallbackTheme = useCallback(() => {
    const root = document.documentElement;
    const body = document.body;
    const allThemes = ['light', 'dark', 'system', 'sepia', 'high-contrast', 'warm', 'cool', 'forest', 'midnight'];
    root.classList.remove(...allThemes);
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    root.style.setProperty('color-scheme', 'light');
    if (body) {
      body.setAttribute('data-theme', 'light');
      body.style.setProperty('color-scheme', 'light');
    }
    setResolvedTheme('light');
  }, []);

  // 🔥 테마 설정 함수 (리팩토링됨)
  const setTheme = useCallback(async (newTheme: Theme): Promise<void> => {
    try {
      Logger.info('THEME_PROVIDER', 'Theme changing', { from: theme, to: newTheme });

      // 상태 업데이트
      setThemeState(newTheme);
      const resolved = calculateResolvedTheme(newTheme);
      setResolvedTheme(resolved);

      // 각각의 작업을 helper 함수로 분리
      saveThemeToLocalStorage(newTheme, resolved);
      await saveThemeToBackend(newTheme, resolved);
      applyThemeToDOM(resolved);
      await reapplyFontCSS(newTheme, resolved);

      Logger.info('THEME_PROVIDER', 'Theme applied successfully', {
        theme: newTheme,
        resolved,
        htmlClass: document.documentElement.className
      });
    } catch (error) {
      Logger.error('THEME_PROVIDER', 'Error setting theme', error);
    }
  }, [theme, calculateResolvedTheme, saveThemeToLocalStorage, saveThemeToBackend, applyThemeToDOM, reapplyFontCSS]);

  // 🔥 테마 토글 함수
  const toggleTheme = useCallback((): void => {
    // 기본 light/dark 토글, 작가 테마는 직접 setTheme으로 변경
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // 🔥 초기 테마 로드 (깜빡임 방지 - 블로킹 스크립트와 완전 동기화)
  useEffect(() => {
    const loadInitialTheme = async (): Promise<void> => {
      try {
        // 1. DOM에서 현재 테마 감지
        const currentDOMTheme = detectCurrentThemeFromDOM();

        // 2. 백엔드/localStorage에서 테마 로드
        const { theme: savedTheme, source } = await loadThemeFromStorage();

        // 3. 상태 동기화
        if (savedTheme !== theme) {
          setThemeState(savedTheme);
        }

        const resolved = calculateResolvedTheme(savedTheme);

        // 4. DOM과 동기화
        syncThemeWithDOM(resolved, currentDOMTheme);

        Logger.info('THEME_PROVIDER', 'Initial theme loaded successfully', {
          theme: savedTheme,
          resolved,
          source,
          htmlClasses: document.documentElement.className
        });
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Error loading initial theme', error);
        applyFallbackTheme();
      }
    };

    // 🔥 즉시 실행 (블로킹 스크립트와 동기화)
    loadInitialTheme();
  }, []); // 🔥 의존성 배열을 비워서 한 번만 실행

  // 🔥 시스템 테마 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (): void => {
      if (theme === 'system') {
        const newResolved = getSystemTheme();
        setResolvedTheme(newResolved);

        // HTML/Body 클래스 및 속성 업데이트
        const root = document.documentElement;
        const body = document.body;
        const allThemes = ['light', 'dark', 'system', 'sepia', 'high-contrast', 'warm', 'cool', 'forest', 'midnight'];
        root.classList.remove(...allThemes);
        root.classList.add(newResolved);
        root.setAttribute('data-theme', newResolved);
        root.style.setProperty('color-scheme', newResolved);
        if (body) {
          body.setAttribute('data-theme', newResolved);
          body.style.setProperty('color-scheme', newResolved);
        }

        Logger.info('THEME_PROVIDER', 'System theme changed', {
          theme: 'system',
          resolved: newResolved
        });
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme, getSystemTheme]);

  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={THEME_STYLES.root} suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 🔥 커스텀 훅
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
