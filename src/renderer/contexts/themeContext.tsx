/**
 * 🎨 Advanced Theme Context - 고급 테마 컨텍스트
 * 
 * shadcn/ui 기반의 확장된 테마 시스템
 * - 다중 테마 지원 (Light, Dark, Writer 모드 등)
 * - 사용자 설정 저장
 * - 접근성 옵션
 * - 부드러운 전환 효과
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Theme, ThemeContextValue, UserThemePreferences, ThemeTransitionOptions } from '../../shared/types/theme';

// 🎨 완전한 작가 전용 테마 메타데이터 (기존 providers/ThemeProvider.tsx에서 이동)
export const AUTHOR_THEMES = {
  'writer-focus': {
    name: '작가 집중 모드',
    description: '장시간 글쓰기에 최적화된 집중 테마 (세리프 폰트, 최소 UI)',
    category: 'writer',
    baseScheme: 'light'
  },
  'writer-focus-dark': {
    name: '작가 집중 다크',
    description: '작가 집중 모드의 다크 변형 (극도로 어두운 배경)',
    category: 'writer',
    baseScheme: 'dark'
  },
  sepia: {
    name: '세피아 종이',
    description: '따뜻한 종이 텍스처로 눈의 피로를 줄입니다',
    category: 'writer',
    baseScheme: 'light'
  },
  'sepia-dark': {
    name: '세피아 다크',
    description: '세피아 테마의 다크 변형',
    category: 'writer',
    baseScheme: 'dark'
  },
  'high-contrast': {
    name: '고대비',
    description: '접근성을 위한 최대 대비 모드',
    category: 'accessibility',
    baseScheme: 'light'
  },
  'colorblind-friendly': {
    name: '색맹 친화',
    description: '색맹 사용자를 위한 최적화 테마',
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
import { ThemeUtils } from '../utils/themeUtils';

/* 🔥 테마 컨텍스트 생성 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/* 🔥 테마 프로바이더 Props */
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystemTheme?: boolean;
  enableAutoSwitch?: boolean;
}

/**
 * 🔥 테마 프로바이더 컴포넌트
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'loop-theme',
  enableSystemTheme = true,
  enableAutoSwitch = false
}: ThemeProviderProps) {
  
  /* 📚 상태 관리 */
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserThemePreferences>(() => 
    ThemeUtils.loadUserPreferences()
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  /* 🔥 테마 변경 핸들러 */
  const changeTheme = useCallback(async (
    newTheme: Theme,
    options: ThemeTransitionOptions = {}
  ): Promise<void> => {
    if (newTheme === theme || isTransitioning) return;

    // 테마 유효성 검사
    if (!ThemeUtils.validateTheme(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}`);
      return;
    }

    setIsTransitioning(true);

    try {
      // 테마 CSS 로드 (필요한 경우)
      await ThemeUtils.loadThemeCSS(newTheme);

      // 애니메이션과 함께 테마 전환
      await ThemeUtils.animateThemeTransition({
        ...options,
        onStart: () => {
          options.onStart?.();
          // 이전 테마의 CSS 언로드는 나중에
        },
        onComplete: () => {
          // 테마 클래스 적용
          ThemeUtils.applyThemeClasses(newTheme);
          
          // 상태 업데이트
          setTheme(newTheme);
          
          // 로컬 스토리지에 저장
          try {
            localStorage.setItem(storageKey, newTheme);
          } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
          }

          // 사용자 선호도 업데이트
          const updatedPreferences = {
            ...preferences,
            preferredTheme: newTheme
          };
          setPreferences(updatedPreferences);
          ThemeUtils.saveUserPreferences(updatedPreferences);

          options.onComplete?.();
        }
      });

    } catch (error) {
      console.error('Failed to change theme:', error);
    } finally {
      setIsTransitioning(false);
    }
  }, [theme, isTransitioning, storageKey, preferences]);

  /* 🔥 시스템 테마 토글 */
  const toggleSystemTheme = useCallback(() => {
    const isDark = ThemeUtils.getSystemDarkModePreference();
    const newTheme = isDark ? 'dark' : 'light';
    changeTheme(newTheme);
  }, [changeTheme]);

  /* 🔥 다크 모드 토글 */
  const toggleDarkMode = useCallback(() => {
    if (theme === 'light') {
      changeTheme('dark');
    } else if (theme === 'dark') {
      changeTheme('light');
    } else {
      // 다른 테마의 경우 다크/라이트 변형 토글
      const isDark = ThemeUtils.isDarkTheme(theme);
      if (isDark) {
        const lightVariant = theme.replace('-dark', '') as Theme;
        changeTheme(lightVariant);
      } else {
        const darkVariant = `${theme}-dark` as Theme;
        if (ThemeUtils.validateTheme(darkVariant)) {
          changeTheme(darkVariant);
        } else {
          changeTheme('dark');
        }
      }
    }
  }, [theme, changeTheme]);

  /* 🔥 사용자 선호도 업데이트 */
  const updatePreferences = useCallback((
    updates: Partial<UserThemePreferences>
  ) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    ThemeUtils.saveUserPreferences(newPreferences);
  }, [preferences]);

  /* 🔥 접근성 옵션 토글 */
  const toggleAccessibilityOption = useCallback((option: keyof UserThemePreferences['accessibility']) => {
    const newAccessibility = {
      ...preferences.accessibility,
      [option]: !preferences.accessibility[option]
    };

    updatePreferences({ accessibility: newAccessibility });

    // 즉시 적용이 필요한 접근성 옵션들
    if (option === 'highContrast' && newAccessibility.highContrast) {
      changeTheme('high-contrast');
    } else if (option === 'colorblindFriendly' && newAccessibility.colorblindFriendly) {
      changeTheme('colorblind-friendly');
    }
  }, [preferences, updatePreferences, changeTheme]);

  /* 🔥 테마 리셋 */
  const resetTheme = useCallback(() => {
    const systemTheme = ThemeUtils.getSystemDarkModePreference() ? 'dark' : 'light';
    changeTheme(systemTheme);
  }, [changeTheme]);

  /* 🔥 테마 초기화 */
  useEffect(() => {
    let initialTheme: Theme = defaultTheme;

    try {
      // 저장된 테마 복원
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme && ThemeUtils.validateTheme(savedTheme as Theme)) {
        initialTheme = savedTheme as Theme;
      } else if (enableSystemTheme) {
        // 시스템 테마 감지
        const systemDark = ThemeUtils.getSystemDarkModePreference();
        initialTheme = systemDark ? 'dark' : 'light';
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
    }

    // 초기 테마 적용
    ThemeUtils.applyThemeClasses(initialTheme);
    setTheme(initialTheme);
    setIsLoading(false);

  }, [defaultTheme, storageKey, enableSystemTheme]);

  /* 🔥 시스템 테마 변경 감지 */
  useEffect(() => {
    if (!enableSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 사용자가 시스템 테마를 따르도록 설정한 경우에만 자동 변경
      if (preferences.autoSwitchDarkMode) {
        const newTheme = e.matches ? 'dark' : 'light';
        changeTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [enableSystemTheme, preferences.autoSwitchDarkMode, changeTheme]);

  /* 🔥 자동 다크 모드 스케줄러 */
  useEffect(() => {
    if (!enableAutoSwitch || !preferences.autoSwitchDarkMode || !preferences.darkModeSchedule) {
      return;
    }

    const checkSchedule = () => {
      const shouldBeDark = ThemeUtils.shouldAutoSwitchToDark(preferences);
      const currentIsDark = ThemeUtils.isDarkTheme(theme);
      
      if (shouldBeDark && !currentIsDark) {
        changeTheme(preferences.darkModeSchedule?.darkTheme || 'dark');
      } else if (!shouldBeDark && currentIsDark) {
        changeTheme(preferences.darkModeSchedule?.lightTheme || 'light');
      }
    };

    // 매 분마다 스케줄 확인
    const interval = setInterval(checkSchedule, 60000);
    
    // 즉시 한 번 확인
    checkSchedule();

    return () => clearInterval(interval);
  }, [enableAutoSwitch, preferences, theme, changeTheme]);

  /* 🔥 기존 providers/ThemeProvider.tsx 호환성 함수들 */
  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    changeTheme(nextTheme);
  }, [theme, changeTheme]);

  // resolvedTheme - system이 아닌 실제 적용된 테마
  const resolvedTheme: Exclude<Theme, 'system'> = theme === 'system' 
    ? (ThemeUtils.getSystemDarkModePreference() ? 'dark' : 'light')
    : (theme as Exclude<Theme, 'system'>);

  /* 🔥 컨텍스트 값 생성 */
  const contextValue: ThemeContextValue = {
    // 현재 상태
    theme,
    currentTheme: theme, // 기존 호환성
    availableThemes: [], // TODO: DEFAULT_THEMES로 채우기
    isLoading,
    isTransitioning,
    preferences,
    
    // 테마 변경 함수들
    setTheme: changeTheme,
    switchTheme: changeTheme, // 기존 호환성
    toggleDarkMode,
    toggleSystemTheme,
    resetTheme,
    
    // 선호도 관리
    updatePreferences,
    toggleAccessibilityOption,
    
    // 유틸리티 함수들
    isDarkMode: ThemeUtils.isDarkTheme(theme),
    isSystemDark: ThemeUtils.getSystemDarkModePreference(),
    getThemeMetadata: ThemeUtils.getThemeMetadata,
    validateTheme: ThemeUtils.validateTheme,
    getThemeConfig: () => null, // 기존 호환성 - TODO: 구현
    applyCustomCSS: () => {}, // 기존 호환성 - TODO: 구현
    
    // 접근성 정보
    supportsHighContrast: true,
    supportsColorblindFriendly: true,
    supportsReducedMotion: ThemeUtils.getSystemReducedMotionPreference(),

    // 🔥 기존 providers/ThemeProvider.tsx 호환성 속성들
    resolvedTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 🔥 테마 Hook - useTheme
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * 🔥 테마 변경 전용 Hook - useThemeChanger
 */
export function useThemeChanger() {
  const { setTheme, theme, isTransitioning } = useTheme();
  
  return {
    currentTheme: theme,
    isChanging: isTransitioning,
    changeTheme: setTheme
  };
}

/**
 * 🔥 다크 모드 전용 Hook - useDarkMode
 */
export function useDarkMode() {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  
  return {
    isDark: isDarkMode,
    toggle: toggleDarkMode,
    theme
  };
}

/**
 * 🔥 접근성 전용 Hook - useAccessibility
 */
export function useAccessibility() {
  const { 
    preferences, 
    toggleAccessibilityOption,
    supportsHighContrast,
    supportsColorblindFriendly,
    supportsReducedMotion
  } = useTheme();
  
  return {
    accessibility: preferences.accessibility,
    toggleOption: toggleAccessibilityOption,
    supports: {
      highContrast: supportsHighContrast,
      colorblindFriendly: supportsColorblindFriendly,
      reducedMotion: supportsReducedMotion
    }
  };
}