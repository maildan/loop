// 🔥 기가차드 Settings 타입 정의 - electron-store 호환
'use client';

import React from 'react';

/**
 * 🔥 설정 섹션 타입 (main/settings와 완전 호환)
 */
export type SettingSection = 'app' | 'account' | 'notifications' | 'ui' | 'keyboard' | 'performance';

/**
 * 🔥 설정 데이터 인터페이스 (main/settings/ElectronStoreSettingsManager와 동일)
 */
export interface SettingsData {
  readonly app: {
    theme: 'light' | 'dark' | 'system';
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
  readonly account: {
    userId?: string;
    username?: string;
    email?: string;
    displayName?: string;
    avatar?: string; // base64 or url
    enableSync: boolean;
    syncProvider: 'local' | 'cloud' | 'custom';
    syncInterval: number;
    enableTwoFactor: boolean;
    authProvider: 'local' | 'google' | 'apple' | 'microsoft';
    sessionTimeout: number;
  };
  readonly notifications: {
    enableNotifications: boolean;
    enableSounds: boolean;
    notifyGoalAchieved: boolean;
    notifyDailyGoal: boolean;
    notifyErrors: boolean;
  };
}

/**
 * 🔥 설정 섹션 메타데이터
 */
export interface SettingSectionMeta {
  id: SettingSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * 🔥 설정 필드 공통 Props
 */
export interface SettingFieldProps<T = unknown> {
  title: string;
  description: string;
  value: T;
  onChange: (value: T) => void;
}

/**
 * 🔥 토글 컴포넌트 Props
 */
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * 🔥 설정 업데이트 함수 타입
 */
export type UpdateSettingFunction = <K extends keyof SettingsData, T extends keyof SettingsData[K]>(
  category: K,
  key: T,
  value: SettingsData[K][T]
) => Promise<void>;

/**
 * 🔥 설정 아이템 Props (SettingItem 컴포넌트용)
 */
export interface SettingItemProps {
  title: string;
  description: string;
  control: React.ReactNode;
}

/**
 * 🔥 설정 섹션 정의 (constants/settings.ts용)
 */
export interface SettingSectionDefinition {
  id: SettingSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * 🔥 useSettings 훅 반환 타입
 */
export interface UseSettingsReturn {
  settings: SettingsData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateSetting: UpdateSettingFunction;
  saveAllSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
  setSettings: React.Dispatch<React.SetStateAction<SettingsData | null>>;
}
