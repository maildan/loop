// 🔥 기가차드 Settings 기본값 정의 - 모든 설정의 기본값!

import { Logger } from '../../shared/logger';
import { SettingsSchema } from './types';

// #DEBUG: Settings defaults entry point
Logger.debug('SETTINGS_DEFAULTS', 'Settings defaults module loaded');

// 🔥 기가차드 앱 카테고리 정의 (AppDetector와 호환)
export const APP_CATEGORIES = {
  DEVELOPMENT: ['Visual Studio Code', 'Xcode', 'IntelliJ IDEA', 'WebStorm', 'Sublime Text', 'Atom', 'Terminal', 'iTerm2'],
  BROWSER: ['Safari', 'Google Chrome', 'Firefox', 'Microsoft Edge', 'Arc', 'Brave Browser'],
  OFFICE: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Pages', 'Numbers', 'Keynote'],
  COMMUNICATION: ['Slack', 'Discord', 'Microsoft Teams', 'Zoom', 'Mail', 'Messages'],
  DESIGN: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch', 'Canva'],
  ENTERTAINMENT: ['YouTube', 'Netflix', 'Spotify', 'Apple Music', 'VLC'],
  PRODUCTIVITY: ['Notion', 'Obsidian', 'Roam Research', 'Todoist', 'Calendar', 'Notes'],
  SYSTEM: ['Finder', 'System Preferences', 'Activity Monitor', 'Console', 'Keychain Access']
} as const;

/**
 * 🎯 완벽한 기본 설정값들
 */
export const DEFAULT_SETTINGS: SettingsSchema = {
  // 🏠 앱 전반 설정
  app: {
    theme: 'system',
    language: 'ko',
    autoStart: false,
    minimizeToTray: true,
    
    windowBounds: {
      width: 1200,
      height: 800,
      x: undefined,
      y: undefined
    },
    alwaysOnTop: false,
    
    devMode: false,
    enableLogging: true,
    logLevel: 'info'
  },

  // ⌨️ 키보드 설정
  keyboard: {
    enabled: true,
    language: 'korean',
    enableIme: true,
    enableGlobalShortcuts: true,
    enableAppDetection: true,
    autoSaveInterval: 30, // 30초
    debugMode: false,
    autoStartMonitoring: false,
    sessionTimeout: 15, // 15분
    enableBatchProcessing: true,
    batchSize: 100,
    debounceDelay: 10, // 10ms
    enableHealthCheck: true,
    
    // 글로벌 단축키
    globalShortcuts: {
      startStop: 'CommandOrControl+Shift+T',
      pause: 'CommandOrControl+Shift+P',
      showStats: 'CommandOrControl+Shift+S'
    },
    
    // 🔥 앱 필터링 (카테고리 기반)
    ignoreApps: [...APP_CATEGORIES.SYSTEM],
    focusOnlyApps: [],
    
    // 성능 설정
    eventBufferSize: 1000,
    processingDelay: 5 // 5ms
  },

  // 🎨 UI/테마 설정
  ui: {
    colorScheme: 'blue',
    accentColor: '#3b82f6',
    
    sidebarPosition: 'left',
    compactMode: false,
    showStatusBar: true,
    
    enableAnimations: true,
    animationSpeed: 'normal',
    
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 14,
    fontWeight: 'normal'
  },

  // 📊 분석/통계 설정
  analytics: {
    targetWPM: 60,
    targetAccuracy: 95,
    dailyGoal: 120, // 2시간

    trackingPeriod: 'daily',
    excludeShortSessions: true,
    minSessionDuration: 30, // 30초

    enableAdvancedAnalytics: false,
    trackAppUsage: true,
    trackTimePatterns: true
  },

  // 🛡️ 보안/권한 설정
  security: {
    enableAccessibilityPermission: false,
    enableInputMonitoring: false,
    
    encryptLocalData: false,
    anonymizeData: true,
    
    allowTelemetry: false,
    allowUpdates: true,
    allowExternalLinks: false
  },

  // 🔔 알림 설정
  notifications: {
    enableNotifications: true,
    enableSounds: false,
    
    notifyGoalAchieved: true,
    notifyDailyGoal: true,
    notifyWeeklyGoal: true,
    
    notifyNewRecord: true,
    notifyMilestone: true,
    
    notifyErrors: true,
    notifyUpdates: true
  },

  // 🤖 AI 기능 설정
  ai: {
    enableAI: false,
    autoAnalysis: false,
    realTimeAnalysis: false,
    
    enableTypingPatternAnalysis: false,
    enableErrorCorrection: false,
    enableProductivityTips: false,
    enablePersonalizedFeedback: false,
    
    apiProvider: 'local',
    maxTokens: 1000,
    temperature: 0.7,
    
    shareAnonymousData: false,
    localProcessingOnly: true,
    
    analysisFrequency: 'periodic',
    batchSize: 100,
    debounceDelay: 1000
  },

  // 📋 클립보드 설정
  clipboard: {
    enableClipboard: false,
    enableClipboardHistory: false,
    enableClipboardAnalysis: false,
    
    maxHistoryItems: 100,
    historyRetentionDays: 7,
    enableEncryption: true,
    
    ignorePasswordManagers: true,
    ignoreImageData: false,
    maxTextLength: 10000,
    
    enableAutoClean: true,
    enableSmartPaste: false,
    enableDuplicateDetection: true,
    
    excludePatterns: ['password', 'secret', 'token', 'api_key'],
    includeOnlyApps: [],
    maskSensitiveData: true
  },

  // 📸 스크린샷 설정
  screenshot: {
    enableScreenshots: false,
    autoCapture: false,
    enableOCR: false,
    
    captureFormat: 'png',
    quality: 90,
    captureDelay: 0,
    
    savePath: '~/Documents/Loop/Screenshots',
    filenamePattern: 'Loop_{timestamp}_{app}',
    maxFileSize: 10, // 10MB
    retentionDays: 30,
    
    enableCloudUpload: false,
    cloudProvider: 'none',
    
    blurSensitiveAreas: true,
    excludeApps: ['1Password', 'Keychain Access', 'LastPass'],
    enableWatermark: false,
    
    shortcuts: {
      captureFullScreen: 'CommandOrControl+Shift+3',
      captureWindow: 'CommandOrControl+Shift+4',
      captureSelection: 'CommandOrControl+Shift+5',
      captureDelayed: 'CommandOrControl+Shift+Alt+3'
    }
  },

  // 👤 계정 설정
  account: {
    enableSync: false,
    syncProvider: 'local',
    syncInterval: 30,
    
    enableTwoFactor: false,
    authProvider: 'local',
    sessionTimeout: 60,
    
    subscriptionType: 'free',
    
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'yyyy-mm-dd',
    timeFormat: '24h',
    
    allowAnalytics: false,
    allowCrashReports: true,
    allowUsageStats: false
  },

  // 🗄️ 데이터 보관 설정
  dataRetention: {
    retentionPeriod: 90,
    autoDeleteOldData: true,
    enableDataArchive: false,
    
    typingData: {
      enabled: true,
      retentionDays: 365,
      enableCompression: true
    },
    
    keystrokeData: {
      enabled: true,
      retentionDays: 30,
      enableAggregation: true
    },
    
    appUsageData: {
      enabled: true,
      retentionDays: 180,
      aggregationLevel: 'daily'
    },
    
    clipboardData: {
      enabled: false,
      retentionDays: 7,
      enableEncryption: true
    },
    
    screenshotData: {
      enabled: false,
      retentionDays: 30,
      compressionLevel: 6
    },
    
    enableAutoBackup: false,
    backupFrequency: 'weekly',
    backupLocation: '~/Documents/Loop/Backups',
    maxBackupFiles: 10,
    enableCloudBackup: false,
    
    exportFormat: 'json',
    enableScheduledExport: false,
    
    enableSmartCleanup: true,
    cleanupThreshold: 5, // 5GB
    prioritizeRecent: true
  },

  // 메타데이터
  version: '1.0.0',
  lastModified: new Date(),
  userId: undefined
};

/**
 * 🔥 설정 카테고리별 기본값 추출 헬퍼
 */
export const getDefaultSettings = {
  app: () => DEFAULT_SETTINGS.app,
  keyboard: () => DEFAULT_SETTINGS.keyboard,
  ui: () => DEFAULT_SETTINGS.ui,
  analytics: () => DEFAULT_SETTINGS.analytics,
  security: () => DEFAULT_SETTINGS.security,
  notifications: () => DEFAULT_SETTINGS.notifications,
  ai: () => DEFAULT_SETTINGS.ai,
  clipboard: () => DEFAULT_SETTINGS.clipboard,
  screenshot: () => DEFAULT_SETTINGS.screenshot,
  account: () => DEFAULT_SETTINGS.account,
  dataRetention: () => DEFAULT_SETTINGS.dataRetention,
  all: () => DEFAULT_SETTINGS
};

/**
 * 🎯 설정 유효성 검사 스키마
 */
export const SETTINGS_CONSTRAINTS = {
  app: {
    theme: ['light', 'dark', 'system'],
    language: ['ko', 'en', 'ja', 'zh'],
    logLevel: ['debug', 'info', 'warn', 'error'],
    windowBounds: {
      width: { min: 800, max: 3840 },
      height: { min: 600, max: 2160 }
    }
  },
  
  keyboard: {
    language: ['korean', 'japanese', 'chinese', 'english'],
    autoSaveInterval: { min: 10, max: 300 },
    sessionTimeout: { min: 5, max: 120 },
    batchSize: { min: 10, max: 1000 },
    debounceDelay: { min: 1, max: 100 },
    eventBufferSize: { min: 100, max: 10000 },
    processingDelay: { min: 1, max: 50 }
  },
  
  ui: {
    colorScheme: ['blue', 'green', 'purple', 'orange'],
    sidebarPosition: ['left', 'right'],
    animationSpeed: ['slow', 'normal', 'fast'],
    fontWeight: ['normal', 'medium', 'bold'],
    fontSize: { min: 10, max: 24 }
  },
  
  analytics: {
    targetWPM: { min: 10, max: 200 },
    targetAccuracy: { min: 50, max: 100 },
    dailyGoal: { min: 10, max: 480 }, // 최대 8시간
    trackingPeriod: ['session', 'daily', 'weekly', 'monthly'],
    minSessionDuration: { min: 5, max: 300 }
  },
  
  ai: {
    apiProvider: ['openai', 'anthropic', 'local', 'custom'],
    maxTokens: { min: 100, max: 4000 },
    temperature: { min: 0, max: 2 },
    analysisFrequency: ['realtime', 'periodic', 'manual'],
    batchSize: { min: 10, max: 1000 },
    debounceDelay: { min: 100, max: 10000 }
  },
  
  clipboard: {
    maxHistoryItems: { min: 10, max: 1000 },
    historyRetentionDays: { min: 1, max: 365 },
    maxTextLength: { min: 100, max: 100000 }
  },
  
  screenshot: {
    captureFormat: ['png', 'jpg', 'webp'],
    quality: { min: 10, max: 100 },
    maxFileSize: { min: 1, max: 100 }, // MB
    retentionDays: { min: 1, max: 365 },
    cloudProvider: ['none', 'imgur', 'cloudinary', 's3', 'custom']
  },
  
  account: {
    syncProvider: ['local', 'cloud', 'custom'],
    syncInterval: { min: 5, max: 1440 }, // 분 단위
    authProvider: ['local', 'google', 'apple', 'microsoft'],
    sessionTimeout: { min: 15, max: 1440 }, // 분 단위
    subscriptionType: ['free', 'premium', 'enterprise'],
    dateFormat: ['yyyy-mm-dd', 'mm/dd/yyyy', 'dd/mm/yyyy'],
    timeFormat: ['12h', '24h']
  },
  
  dataRetention: {
    retentionPeriod: { min: 7, max: 365 },
    backupFrequency: ['daily', 'weekly', 'monthly'],
    maxBackupFiles: { min: 3, max: 50 },
    exportFormat: ['json', 'csv', 'sqlite', 'all'],
    cleanupThreshold: { min: 1, max: 100 }, // GB
    compressionLevel: { min: 1, max: 9 }
  }
} as const;
