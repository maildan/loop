// 🔥 기가차드 테스트 픽스처 - 타입 안전한 테스트 데이터

import type { 
  SettingsSchema, 
  AppSettingsSchema, 
  KeyboardSettingsSchema,
  UISettingsSchema 
} from '../../src/main/settings/types';
import type { TypingSession, KeyboardEvent, WindowInfo } from '../../src/shared/types';

// 🎯 Settings 픽스처
export const mockAppSettings: AppSettingsSchema = {
  theme: 'dark',
  language: 'ko',
  autoStart: false,
  minimizeToTray: true,
  windowBounds: {
    width: 1200,
    height: 800,
    x: 100,
    y: 100
  },
  alwaysOnTop: false,
  devMode: false,
  enableLogging: true,
  logLevel: 'info'
};

export const mockKeyboardSettings: KeyboardSettingsSchema = {
  enabled: true,
  language: 'korean',
  enableIme: true,
  enableGlobalShortcuts: true,
  enableAppDetection: true,
  autoSaveInterval: 30,
  debugMode: false,
  autoStartMonitoring: true,
  sessionTimeout: 30,
  enableBatchProcessing: true,
  batchSize: 100,
  debounceDelay: 10,
  enableHealthCheck: true,
  globalShortcuts: {
    startStop: 'CommandOrControl+Shift+K',
    pause: 'CommandOrControl+Shift+P',
    showStats: 'CommandOrControl+Shift+S'
  },
  ignoreApps: ['1Password', 'Keychain Access'],
  focusOnlyApps: [],
  eventBufferSize: 1000,
  processingDelay: 16
};

export const mockUISettings: UISettingsSchema = {
  colorScheme: 'blue',
  accentColor: '#3b82f6',
  sidebarPosition: 'left',
  compactMode: false,
  showStatusBar: true,
  enableAnimations: true,
  animationSpeed: 'normal',
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: 'normal'
};

export const mockSettings: Partial<SettingsSchema> = {
  app: mockAppSettings,
  keyboard: mockKeyboardSettings,
  ui: mockUISettings,
  version: '1.0.0',
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  userId: 'test-user-id'
};

// ⌨️ Keyboard 이벤트 픽스처
export const mockKeyboardEvent: KeyboardEvent = {
  type: 'keydown',
  key: 'a',
  code: 'KeyA',
  keycode: 65,
  keychar: 'a',
  timestamp: Date.now(),
  windowTitle: 'Test Application'
};

export const mockTypingSession: TypingSession = {
  id: 'test-session-1',
  userId: 'test-user-1',
  content: 'Hello, World!',
  startTime: new Date('2024-01-01T10:00:00.000Z'),
  endTime: new Date('2024-01-01T10:05:00.000Z'),
  keyCount: 13,
  wpm: 50,
  accuracy: 95.5,
  windowTitle: 'Test Document',
  appName: 'Test App',
  isActive: false,
  createdAt: new Date('2024-01-01T10:00:00.000Z'),
  updatedAt: new Date('2024-01-01T10:05:00.000Z'),
};

// 🪟 Window 정보 픽스처
export const mockWindowInfo: WindowInfo = {
  id: 12345,
  title: 'Test Window',
  owner: {
    name: 'Test Application',
    processId: 1234,
    bundleId: 'com.test.app',
    path: '/Applications/Test.app'
  },
  bounds: {
    x: 100,
    y: 100,
    width: 800,
    height: 600
  },
  memoryUsage: 1024000,
  loopTimestamp: Date.now(),
  loopAppCategory: 'development'
};

// 🔧 IPC 응답 픽스처
export const mockIpcSuccessResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date()
});

export const mockIpcErrorResponse = (error: string) => ({
  success: false,
  error,
  timestamp: new Date()
});

// 📊 통계 픽스처
export const mockTypingStats = {
  totalSessions: 10,
  totalKeystrokes: 5000,
  averageWPM: 45,
  averageAccuracy: 92.5,
  totalTime: 3600, // 1시간
  bestWPM: 65,
  worstWPM: 25,
  dailyGoalProgress: 75,
  streakDays: 5,
  favoriteApps: ['VSCode', 'Notion', 'Slack'],
  timeSpentByApp: {
    'VSCode': 2000,
    'Notion': 1000,
    'Slack': 600
  }
};

// 🎭 테스트 헬퍼 함수
export const createMockSettings = (overrides: Partial<SettingsSchema> = {}): Partial<SettingsSchema> => {
  return {
    ...mockSettings,
    ...overrides
  };
};

export const createMockKeyboardEvent = (overrides: Partial<KeyboardEvent> = {}): KeyboardEvent => {
  return {
    ...mockKeyboardEvent,
    ...overrides
  };
};

export const createMockTypingSession = (overrides: Partial<TypingSession> = {}): TypingSession => {
  return {
    ...mockTypingSession,
    ...overrides
  };
};

// 🕒 시간 관련 헬퍼
export const mockDate = (date: string): void => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(date));
};

export const restoreTime = (): void => {
  jest.useRealTimers();
};

// 🔄 비동기 헬퍼
export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const flushPromises = (): Promise<void> => {
  return new Promise(resolve => setImmediate(resolve));
};
