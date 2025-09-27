/**
 * 🎨 Theme System Entry Point - 테마 시스템 메인 진입점
 * 
 * 모든 테마 관련 컴포넌트와 로직을 하나로 통합
 */

import { ThemeProvider, useTheme, useThemeChanger, useDarkMode, useAccessibility } from '../contexts/themeContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { ThemeUtils, DEFAULT_THEMES } from '../utils/themeUtils';
import { Logger } from '@/shared/logger';

// 명시적으로 다시 export
export { ThemeProvider, useTheme, useThemeChanger, useDarkMode, useAccessibility } from '../contexts/themeContext';
export { ThemeSelector } from '../components/ThemeSelector';
export { ThemeUtils, DEFAULT_THEMES } from '../utils/themeUtils';

// CSS 파일들 자동 로드 (TypeScript에서는 CSS import를 주석 처리)
// import '../styles/themes/index.css';

/* 🔥 테마 시스템 초기화 */
export const initThemeSystem = () => {
  // 필요한 경우 여기서 추가 초기화 작업 수행
  Logger.warn('Theme','🎨 Loop Theme System initialized');
};

/* 🔥 테마 시스템 버전 정보 */
export const THEME_SYSTEM_VERSION = '1.0.0';

/* 🔥 기본 내보내기 */
export default {
  ThemeProvider,
  ThemeSelector,
  ThemeUtils,
  DEFAULT_THEMES,
  useTheme,
  useDarkMode,
  useAccessibility,
  initThemeSystem,
  version: THEME_SYSTEM_VERSION
};