'use client';

// 🔥 기가차드 Settings 타입 정의 - Electron-Store 완벽 호환!
import type { Theme } from '../../../../shared/types/theme';

/**
 * 🎯 Settings 섹션 타입 (main/settings와 완벽 호환)
 */
export type SettingSection = 'app' | 'keyboard' | 'ui' | 'performance';

/**
 * 🔥 Settings 데이터 스키마 (SimpleSettingsSchema와 100% 호환)
 * - main/settings/ElectronStoreSettingsManager.ts의 SimpleSettingsSchema와 완전 동일
 */
export interface SettingsData {
  readonly app: {
    theme: Theme;
    language: string;
    autoSave: boolean;
    startMinimized: boolean;
    minimizeToTray: boolean;
    fontSize: number;
    fontFamily: string;
  };
  readonly keyboard: {
    enabled: boolean;
    language: string;
    trackAllApps: boolean;
    sessionTimeout: number;
  };
  readonly ui: {
    windowWidth: number;
    windowHeight: number;
    sidebarCollapsed: boolean;
    focusMode: boolean;
    showLineNumbers: boolean;
    showWordCount: boolean;
  };
  readonly performance: {
    enableGPUAcceleration: boolean;
    maxCPUUsage: number;
    maxMemoryUsage: number;
    enableHardwareAcceleration: boolean;
  };
}

/**
 * 🔥 Settings 업데이트 함수 타입
 */
export type SettingsUpdateFunction = <K extends keyof SettingsData, T extends keyof SettingsData[K]>(
  category: K,
  key: T,
  value: SettingsData[K][T]
) => Promise<void>;

/**
 * 🔥 섹션별 설정 타입
 */
export type AppSettings = SettingsData['app'];
export type KeyboardSettings = SettingsData['keyboard'];
export type UISettings = SettingsData['ui'];
export type PerformanceSettings = SettingsData['performance'];

/**
 * 🔥 Settings 섹션 정의
 */
export interface SettingSectionDefinition {
  readonly id: SettingSection;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

/**
 * 🔥 Settings Hook 반환 타입
 */
export interface UseSettingsReturn {
  // 상태
  settings: SettingsData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // 액션
  updateSetting: SettingsUpdateFunction;
  saveAllSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

/**
 * 🔥 Setting Item Props 타입
 */
export interface SettingItemProps {
  readonly title: string;
  readonly description: string;
  readonly control: React.ReactNode;
}

/**
 * 🔥 Toggle Props 타입
 */
export interface ToggleProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly disabled?: boolean;
}

/**
 * 🔥 Section Props 타입
 */
export interface SettingSectionProps<T extends keyof SettingsData> {
  readonly settings: SettingsData[T];
  readonly updateSetting: SettingsUpdateFunction;
  readonly disabled?: boolean;
}

/**
 * 🔥 App Section Props (테마 변경 포함)
 */
export interface AppSectionProps extends SettingSectionProps<'app'> {
  readonly setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

/**
 * 🔥 Settings 저장 상태
 */
export type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'error';

/**
 * 🔥 Settings 오류 타입
 */
export interface SettingsError {
  readonly category: keyof SettingsData;
  readonly key: string;
  readonly message: string;
  readonly timestamp: Date;
}
