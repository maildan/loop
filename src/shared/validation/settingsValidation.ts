/**
 * 🔒 Settings 보안 검증 스키마
 * V2 취약점 완화: settings:set 화이트리스트 기반 검증
 * 
 * @module settingsValidation
 */

import { z } from 'zod';

/**
 * 🔒 허용되는 설정 키 경로 (카테고리.필드 형식)
 * 
 * 이 화이트리스트는:
 * - 렌더러가 설정할 수 있는 키만 명시적으로 정의
 * - 관리자/시스템 키(예: security.*, admin.*) 차단
 * - 사용자 가입 정보(예: auth.*, token.*) 차단
 * 
 * @see settingsIpcHandlers.ts - settings:set 핸들러에서 사용
 */
export const ALLOWED_SETTINGS_KEYS = [
  // ✅ UI 설정
  'ui.windowWidth',
  'ui.windowHeight',
  'ui.sidebarCollapsed',
  'ui.appSidebarCollapsed',
  'ui.showLineNumbers',
  'ui.showWordCount',
  'ui.zenMode',
  'ui.focusMode',
  'ui.hideToolbars',
  'ui.minimalistMode',
  'ui.compactMode',
  'ui.showShortcutHelp',

  // ✅ 앱 설정
  'app.theme',
  'app.language',
  'app.fontSize',
  'app.fontFamily',
  'app.autoSave',
  'app.startMinimized',
  'app.minimizeToTray',

  // ✅ 키보드 설정
  'keyboard.enabled',
  'keyboard.language',
  'keyboard.trackAllApps',
  'keyboard.sessionTimeout',

  // ✅ 성능 설정
  'performance.enableGPUAcceleration',
  'performance.maxCPUUsage',
  'performance.maxMemoryUsage',
  'performance.enableHardwareAcceleration',

  // ✅ 알림 설정
  'notifications.enableNotifications',
  'notifications.enableSounds',
  'notifications.notifyGoalAchieved',
  'notifications.notifyDailyGoal',
  'notifications.notifyErrors',

  // ✅ 계정 설정 (프로필 정보만)
  'account.displayName',
  'account.avatar',
  'account.avatarThumb',
  'account.enableSync',
  'account.syncProvider',
  'account.syncInterval',
  'account.enableTwoFactor',
  'account.sessionTimeout',

  // ✅ 대시보드 저장 상태
  'dashboard.lastTab',
  'dashboard.viewMode',
  'dashboard.sortBy',
  'dashboard.filterBy',
  'dashboard.collapsedSections',
] as const;

/**
 * 🔒 허용된 설정 키 타입
 */
export type AllowedSettingsKey = (typeof ALLOWED_SETTINGS_KEYS)[number];

/**
 * 🔒 설정 값 검증 스키마
 * 
 * 각 설정 키마다 예상되는 타입을 정의합니다.
 * 이를 통해 타입 안전성 및 런타임 검증을 보장합니다.
 */
export const SETTINGS_VALUE_SCHEMAS: Record<AllowedSettingsKey, z.ZodType> = {
  // UI 설정
  'ui.windowWidth': z.number().min(400).max(3840),
  'ui.windowHeight': z.number().min(300).max(2160),
  'ui.sidebarCollapsed': z.boolean(),
  'ui.appSidebarCollapsed': z.boolean(),
  'ui.showLineNumbers': z.boolean(),
  'ui.showWordCount': z.boolean(),
  'ui.zenMode': z.boolean(),
  'ui.focusMode': z.boolean(),
  'ui.hideToolbars': z.boolean(),
  'ui.minimalistMode': z.boolean(),
  'ui.compactMode': z.boolean(),
  'ui.showShortcutHelp': z.boolean(),

  // 앱 설정
  'app.theme': z.enum([
    'light',
    'dark',
    'system',
    'writer-focus',
    'writer-focus-dark',
    'sepia',
    'sepia-dark',
    'warm',
    'cool',
    'forest',
    'midnight',
    'high-contrast',
  ]),
  'app.language': z.string().min(2).max(10),
  'app.fontSize': z.number().min(10).max(48),
  'app.fontFamily': z.string().min(1).max(256),
  'app.autoSave': z.boolean(),
  'app.startMinimized': z.boolean(),
  'app.minimizeToTray': z.boolean(),

  // 키보드 설정
  'keyboard.enabled': z.boolean(),
  'keyboard.language': z.string().min(2).max(10),
  'keyboard.trackAllApps': z.boolean(),
  'keyboard.sessionTimeout': z.number().min(1).max(3600),

  // 성능 설정  
  'performance.enableGPUAcceleration': z.boolean(),
  'performance.maxCPUUsage': z.number().min(0).max(100),
  'performance.maxMemoryUsage': z.number().min(100).max(8192),
  'performance.enableHardwareAcceleration': z.boolean(),

  // 알림 설정
  'notifications.enableNotifications': z.boolean(),
  'notifications.enableSounds': z.boolean(),
  'notifications.notifyGoalAchieved': z.boolean(),
  'notifications.notifyDailyGoal': z.boolean(),
  'notifications.notifyErrors': z.boolean(),

  // 계정 설정
  'account.displayName': z.string().max(256).optional(),
  'account.avatar': z.string().max(10_000_000).optional(), // base64 문자열
  'account.avatarThumb': z.string().max(100_000).optional(),
  'account.enableSync': z.boolean(),
  'account.syncProvider': z.enum(['local', 'cloud', 'custom']),
  'account.syncInterval': z.number().min(1).max(3600),
  'account.enableTwoFactor': z.boolean(),
  'account.sessionTimeout': z.number().min(1).max(86400),

  // 대시보드 설정
  'dashboard.lastTab': z.string().max(64),
  'dashboard.viewMode': z.enum(['list', 'grid', 'tree']),
  'dashboard.sortBy': z.enum(['name', 'date', 'status']),
  'dashboard.filterBy': z.string().max(256),
  'dashboard.collapsedSections': z.array(z.string()).max(50),
};

/**
 * 🔒 설정 키 경로 검증
 * 
 * @param keyPath - 검증할 설정 키 경로
 * @returns 유효한 화이트리스트 키인지 여부
 */
export function isAllowedSettingsKey(keyPath: string): keyPath is AllowedSettingsKey {
  return (ALLOWED_SETTINGS_KEYS as readonly string[]).includes(keyPath);
}

/**
 * 🔒 설정 값 검증
 * 
 * @param keyPath - 설정 키 경로
 * @param value - 검증할 값
 * @returns 검증 결과
 * @throws {z.ZodError} 검증 실패 시
 */
export function validateSettingValue(keyPath: string, value: unknown): boolean {
  if (!isAllowedSettingsKey(keyPath)) {
    throw new Error(`Invalid settings key: ${keyPath}`);
  }

  const schema = SETTINGS_VALUE_SCHEMAS[keyPath];
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new Error(`Invalid value for ${keyPath}: ${result.error.message}`);
  }

  return true;
}

/**
 * 🔒 전체 설정 객체 검증 (마이그레이션용)
 * 
 * 이 스키마는 전체 SettingsData 객체를 검증합니다.
 * 마이그레이션이나 초기화 시에 사용됩니다.
 */
export const SettingsDataSchema = z.object({
  app: z.object({
    theme: z.enum([
      'light',
      'dark',
      'system',
      'writer-focus',
      'writer-focus-dark',
      'sepia',
      'sepia-dark',
      'warm',
      'cool',
      'forest',
      'midnight',
      'high-contrast',
    ]),
    language: z.string().min(2).max(10),
    autoSave: z.boolean(),
    startMinimized: z.boolean(),
    minimizeToTray: z.boolean(),
    fontSize: z.number().min(10).max(48),
    fontFamily: z.string().min(1).max(256),
  }),
  keyboard: z.object({
    enabled: z.boolean(),
    language: z.string().min(2).max(10),
    trackAllApps: z.boolean(),
    sessionTimeout: z.number().min(1).max(3600),
  }),
  ui: z.object({
    windowWidth: z.number().min(400).max(3840),
    windowHeight: z.number().min(300).max(2160),
    sidebarCollapsed: z.boolean(),
    showLineNumbers: z.boolean(),
    showWordCount: z.boolean(),
    appSidebarCollapsed: z.boolean(),
    zenMode: z.boolean(),
    focusMode: z.boolean(),
    hideToolbars: z.boolean(),
    minimalistMode: z.boolean(),
    compactMode: z.boolean(),
    showShortcutHelp: z.boolean(),
  }),
  performance: z.object({
    enableGPUAcceleration: z.boolean(),
    maxCPUUsage: z.number().min(0).max(100),
    maxMemoryUsage: z.number().min(100).max(8192),
    enableHardwareAcceleration: z.boolean(),
  }),
  account: z.object({
    userId: z.string().optional(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    displayName: z.string().max(256).optional(),
    avatar: z.string().max(10_000_000).optional(),
    enableSync: z.boolean(),
    syncProvider: z.enum(['local', 'cloud', 'custom']),
    syncInterval: z.number().min(1).max(3600),
    enableTwoFactor: z.boolean(),
    authProvider: z.enum(['local', 'google', 'apple', 'microsoft']),
    sessionTimeout: z.number().min(1).max(86400),
  }),
  notifications: z.object({
    enableNotifications: z.boolean(),
    enableSounds: z.boolean(),
    notifyGoalAchieved: z.boolean(),
    notifyDailyGoal: z.boolean(),
    notifyErrors: z.boolean(),
  }),
});

export type SettingsData = z.infer<typeof SettingsDataSchema>;
