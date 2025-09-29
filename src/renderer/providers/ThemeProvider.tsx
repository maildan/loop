/**
 * 🎨 기가차드 테마 프로바이더 - 리팩토링 버전
 * 
 * Root Class + CSS Variables 아키텍처
 * - DOM 조작은 themeManager가 담당
 * - React Context는 상태 관리만 담당
 * - preload API를 통한 안전한 IPC 통신
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Logger } from '../../shared/logger';
import { themeManager, type ThemeMode } from '../utils/themeManager';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: ThemeMode; // 실제 적용된 테마 (system 해결됨)
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

// 🔥 Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ThemeMode>('light');

  /**
   * 🎯 테마 설정 (설정 저장 포함)
   */
  const setTheme = useCallback(async (newTheme: 'light' | 'dark' | 'system'): Promise<void> => {
    try {
      Logger.debug('THEME_PROVIDER', 'Setting theme', { newTheme });
      
      setThemeState(newTheme);
      
      if (window.electronAPI) {
        // Electron 환경: preload API 사용
        const response = await window.electronAPI.theme.set(newTheme);
        if (!response.success) {
          Logger.error('THEME_PROVIDER', 'Failed to save theme:', response.error);
        }
      }
      
      // 해결된 테마 계산
      let resolved: ThemeMode;
      if (newTheme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = newTheme;
      }
      
      // DOM 업데이트는 themeManager가 담당
      themeManager.applyTheme(resolved);
      setResolvedTheme(resolved);
      
      Logger.info('THEME_PROVIDER', 'Theme updated', { theme: newTheme, resolved });
    } catch (error) {
      Logger.error('THEME_PROVIDER', 'Error setting theme', error);
    }
  }, []);

  /**
   * 🎯 테마 토글
   */
  const toggleTheme = useCallback((): void => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  /**
   * 🎯 초기 테마 로드 및 리스너 설정
   */
  useEffect(() => {
    const initializeTheme = async (): Promise<void> => {
      try {
        let initialTheme: 'light' | 'dark' | 'system' = defaultTheme;
        
        if (window.electronAPI) {
          // Electron 환경: 저장된 설정 로드
          const response = await window.electronAPI.theme.get();
          if (response.success && response.data) {
            initialTheme = response.data;
          }
        } else {
          // 웹 환경: localStorage 사용
          const saved = localStorage.getItem('loop-theme') as 'light' | 'dark' | 'system' | null;
          if (saved && ['light', 'dark', 'system'].includes(saved)) {
            initialTheme = saved;
          }
        }
        
        // 테마 적용
        await setTheme(initialTheme);
        
        Logger.info('THEME_PROVIDER', 'Theme initialized', { initialTheme });
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Failed to initialize theme', error);
        await setTheme('light'); // 기본값
      }
    };

    initializeTheme();
  }, [defaultTheme, setTheme]);

  /**
   * 🎯 시스템 테마 변경 및 설정 변경 리스너 설정
   */
  useEffect(() => {
    if (window.electronAPI) {
      if (!window.electronAPI.theme) {
        Logger.error('THEME_PROVIDER', 'electronAPI.theme is undefined');
        return;
      }

      const onChange = window.electronAPI.theme.onChange?.bind(window.electronAPI.theme);
      const onSystemChange = window.electronAPI.theme.onSystemChange?.bind(window.electronAPI.theme);

      if (typeof onChange !== 'function' || typeof onSystemChange !== 'function') {
        Logger.error('THEME_PROVIDER', 'electronAPI.theme listeners are missing or invalid', window.electronAPI.theme);
        return;
      }

      let unsubscribeThemeChange: (() => void) | undefined;
      let unsubscribeSystemChange: (() => void) | undefined;

      try {
        unsubscribeThemeChange = onChange((newResolvedTheme: ThemeMode) => {
          setResolvedTheme(newResolvedTheme);
          Logger.debug('THEME_PROVIDER', 'Theme changed via IPC', { newResolvedTheme });
        });
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Failed to subscribe to theme changes', error);
      }

      try {
        unsubscribeSystemChange = onSystemChange((shouldUseDarkColors: boolean) => {
          if (theme === 'system') {
            const systemTheme = shouldUseDarkColors ? 'dark' : 'light';
            setResolvedTheme(systemTheme);
            themeManager.applyTheme(systemTheme);
            Logger.debug('THEME_PROVIDER', 'System theme changed', { systemTheme });
          }
        });
      } catch (error) {
        Logger.error('THEME_PROVIDER', 'Failed to subscribe to system theme changes', error);
      }

      return () => {
        try {
          unsubscribeThemeChange?.();
        } catch (error) {
          Logger.warn('THEME_PROVIDER', 'Failed to cleanup theme change listener', error);
        }

        try {
          unsubscribeSystemChange?.();
        } catch (error) {
          Logger.warn('THEME_PROVIDER', 'Failed to cleanup system theme listener', error);
        }
      };
    } else {
      // 웹 환경에서의 시스템 테마 감지
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          const systemTheme = e.matches ? 'dark' : 'light';
          setResolvedTheme(systemTheme);
          themeManager.applyTheme(systemTheme);
          Logger.debug('THEME_PROVIDER', 'System theme changed (web)', { systemTheme });
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className="transition-colors duration-200" suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * 🔥 테마 컨텍스트 훅
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 편의성을 위한 추가 훅들
export function useResolvedTheme(): ThemeMode {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}

export function useThemeToggle(): () => void {
  const { toggleTheme } = useTheme();
  return toggleTheme;
}
