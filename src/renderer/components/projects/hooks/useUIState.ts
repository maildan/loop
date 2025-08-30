'use client';

import { useState, useCallback } from 'react';
import { Logger } from '../../../../shared/logger';
import { useTheme } from '../../../providers/ThemeProvider';

interface UseUIStateReturn {
  // UI 상태
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  showHeader: boolean;
  isDarkMode: boolean;
  isFocusMode: boolean;
  
  // 액션
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleDarkMode: () => void;
  toggleFocusMode: () => void;
  setShowHeader: (show: boolean) => void;
}

export function useUIState(): UseUIStateReturn {
  // 🔥 테마 관리를 ThemeProvider로 위임
  const { resolvedTheme, toggleTheme } = useTheme();
  
  // 🔥 UI 상태 (테마 제외)
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(true);
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // 🔥 핸들러 함수들
  const toggleLeftSidebar = useCallback((): void => {
    setShowLeftSidebar(prev => !prev);
    Logger.debug('UI_STATE', 'Left sidebar toggled');
  }, []);
  
  const toggleRightSidebar = useCallback((): void => {
    setShowRightSidebar(prev => !prev);
    Logger.debug('UI_STATE', 'Right sidebar toggled');
  }, []);
  
  const toggleDarkMode = useCallback((): void => {
    toggleTheme(); // ThemeProvider의 토글 사용
    Logger.debug('UI_STATE', 'Dark mode toggled via ThemeProvider');
  }, [toggleTheme]);
  
  const toggleFocusMode = useCallback((): void => {
    setIsFocusMode(prev => {
      const newValue = !prev;
      if (newValue) {
        setShowLeftSidebar(false);
        setShowRightSidebar(false);
      }
      Logger.info('UI_STATE', `Focus mode ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);

  return {
    showLeftSidebar,
    showRightSidebar,
    showHeader,
    isDarkMode: resolvedTheme === 'dark', // ThemeProvider에서 가져옴
    isFocusMode,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleDarkMode,
    toggleFocusMode,
    setShowHeader
  };
}