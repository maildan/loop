'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Logger } from '../../shared/logger';

// 🔥 테마 타입 정의
export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark'; // 실제 적용된 테마 (system 해결됨)
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
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const html = document.documentElement;
      const dataTheme = html.getAttribute('data-theme');
      if (dataTheme === 'dark' || dataTheme === 'light') return dataTheme as 'light' | 'dark';
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
  const calculateResolvedTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, [getSystemTheme]);

  // 🔥 테마 설정 함수
  const setTheme = useCallback(async (newTheme: Theme): Promise<void> => {
    try {
      Logger.info('THEME_PROVIDER', 'Theme changing', { from: theme, to: newTheme });

      setThemeState(newTheme);
      const resolved = calculateResolvedTheme(newTheme);
      setResolvedTheme(resolved);

      // 🔥 백엔드에 테마 저장
      try {
        const result = await window.electronAPI.settings.set('theme', newTheme);
        if (result.success) {
          Logger.info('THEME_PROVIDER', 'Theme saved to backend', { theme: newTheme, resolved });
        } else {
          Logger.warn('THEME_PROVIDER', 'Failed to save theme to backend', result.error);
        }
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Error saving theme to backend', error);
      }

      // 🔥 HTML/Body 속성 및 클래스 업데이트 (즉시)
      const root = document.documentElement;
      const body = document.body;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      root.setAttribute('data-theme', resolved);
      (root.style as CSSStyleDeclaration).colorScheme = resolved;
      if (body) {
        body.setAttribute('data-theme', resolved);
        (body.style as CSSStyleDeclaration).colorScheme = resolved;
      }

      // 🔥 로컬 스토리지에도 저장 (백업)
      localStorage.setItem('loop-theme', newTheme);

      Logger.info('THEME_PROVIDER', 'Theme applied successfully', {
        theme: newTheme,
        resolved,
        htmlClass: root.className
      });
    } catch (error) {
      Logger.error('THEME_PROVIDER', 'Error setting theme', error);
    }
  }, [theme, calculateResolvedTheme]);

  // 🔥 테마 토글 함수
  const toggleTheme = useCallback((): void => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // 🔥 초기 테마 로드 (깜빡임 방지 - 블로킹 스크립트와 완전 동기화)
  useEffect(() => {
    const loadInitialTheme = async (): Promise<void> => {
      try {
        // 🔥 블로킹 스크립트에서 이미 HTML 클래스가 설정되었으므로 상태만 동기화
        const htmlElement = document.documentElement;
        let currentResolvedTheme: 'light' | 'dark' = 'light';

        // HTML 클래스에서 현재 테마 감지
        if (htmlElement.classList.contains('dark')) {
          currentResolvedTheme = 'dark';
        } else if (htmlElement.classList.contains('light')) {
          currentResolvedTheme = 'light';
        }

        // data-theme 속성도 확인
        const dataTheme = htmlElement.getAttribute('data-theme');
        if (dataTheme === 'dark' || dataTheme === 'light') {
          currentResolvedTheme = dataTheme;
        }

        // 1. 백엔드에서 테마 가져오기 시도 (비동기)
        let savedTheme: Theme = defaultTheme;
        let themeSource = 'default';

        try {
          if (window.electronAPI?.settings?.get) {
            const result = await window.electronAPI.settings.get('theme');
            if (result.success && result.data) {
              const themeValue = result.data as Theme;
              if (['light', 'dark', 'system'].includes(themeValue)) {
                savedTheme = themeValue;
                themeSource = 'backend';
                Logger.info('THEME_PROVIDER', 'Theme loaded from backend', { theme: savedTheme });
              }
            }
          }
        } catch (error) {
          Logger.warn('THEME_PROVIDER', 'Backend not available, using localStorage', error);

          // 2. 로컬 스토리지 폴백
          try {
            const localTheme = localStorage.getItem('loop-theme') as Theme;
            if (localTheme && ['light', 'dark', 'system'].includes(localTheme)) {
              savedTheme = localTheme;
              themeSource = 'localStorage';
              Logger.info('THEME_PROVIDER', 'Theme loaded from localStorage', { theme: savedTheme });
            }
          } catch (error) {
            Logger.warn('THEME_PROVIDER', 'localStorage not available', error);
          }
        }

        // 3. 상태 동기화 (HTML 클래스는 이미 설정됨)
        if (savedTheme !== theme) {
          setThemeState(savedTheme);
        }

        const resolved = calculateResolvedTheme(savedTheme);

        // 4. 현재 HTML과 계산된 테마가 다르면 동기화
        if (resolved !== currentResolvedTheme) {
          setResolvedTheme(resolved);
          htmlElement.classList.remove('light', 'dark');
          htmlElement.classList.add(resolved);
          htmlElement.setAttribute('data-theme', resolved);
          htmlElement.style.setProperty('color-scheme', resolved);
          document.body?.setAttribute('data-theme', resolved);
          document.body?.style.setProperty('color-scheme', resolved);
          Logger.info('THEME_PROVIDER', 'Theme synchronized with calculation', {
            calculated: resolved,
            current: currentResolvedTheme
          });
        } else {
          // 이미 올바른 테마가 적용됨
          setResolvedTheme(currentResolvedTheme);
          // 보수적으로 body에도 동일 속성 보강
          htmlElement.setAttribute('data-theme', currentResolvedTheme);
          htmlElement.style.setProperty('color-scheme', currentResolvedTheme);
          document.body?.setAttribute('data-theme', currentResolvedTheme);
          document.body?.style.setProperty('color-scheme', currentResolvedTheme);
          Logger.debug('THEME_PROVIDER', 'Theme already synchronized', {
            theme: savedTheme,
            resolved: currentResolvedTheme
          });
        }

        Logger.info('THEME_PROVIDER', 'Initial theme loaded successfully', {
          theme: savedTheme,
          resolved,
          source: themeSource,
          htmlClasses: htmlElement.className
        });
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Error loading initial theme', error);
        // 에러 시 안전한 폴백
        const root = document.documentElement;
        const body = document.body;
        root.classList.remove('light', 'dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        root.style.setProperty('color-scheme', 'light');
        if (body) {
          body.setAttribute('data-theme', 'light');
          body.style.setProperty('color-scheme', 'light');
        }
        setResolvedTheme('light');
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
        root.classList.remove('light', 'dark');
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
