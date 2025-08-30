// 🔥 기가차드 Settings 타입 정의 - 완전 타입 안전!

/**
 * 🔥 기본 키보드 설정 인터페이스
 */
interface BaseKeyboardConfig {
  enabled: boolean;
  language: 'korean' | 'japanese' | 'chinese' | 'english';
  enableIme: boolean;
  enableGlobalShortcuts: boolean;
  enableAppDetection: boolean;
  autoSaveInterval: number;
  debugMode: boolean;
  autoStartMonitoring?: boolean;
  sessionTimeout?: number; // minutes
  enableBatchProcessing?: boolean;
  batchSize?: number;
  debounceDelay?: number;
  enableHealthCheck?: boolean;
}

/**
 * 🎯 앱 전반 설정
 */
export interface AppSettingsSchema {
  // 기본 설정
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en' | 'ja' | 'zh';
  autoStart: boolean;
  minimizeToTray: boolean;
  
  // 윈도우 설정
  windowBounds: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  alwaysOnTop: boolean;
  
  // 개발 설정
  devMode: boolean;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * ⌨️ 키보드 관련 설정
 */
export interface KeyboardSettingsSchema extends BaseKeyboardConfig {
  // 추가 키보드 설정
  globalShortcuts: {
    startStop: string;
    pause: string;
    showStats: string;
  };
  
  // 감지 설정
  ignoreApps: string[];
  focusOnlyApps: string[];
  
  // 성능 설정
  eventBufferSize: number;
  processingDelay: number;
}

/**
 * 🎨 UI/테마 설정
 */
export interface UISettingsSchema {
  // 테마
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  accentColor: string;
  
  // 레이아웃
  sidebarPosition: 'left' | 'right';
  compactMode: boolean;
  showStatusBar: boolean;
  
  // 애니메이션
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // 글꼴
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'bold';
}

/**
 * 📊 분석/통계 설정
 */
export interface AnalyticsSettingsSchema {
  // 목표 설정
  targetWPM: number;
  targetAccuracy: number;
  dailyGoal: number; // 분 단위
  
  // 통계 설정
  trackingPeriod: 'session' | 'daily' | 'weekly' | 'monthly';
  excludeShortSessions: boolean;
  minSessionDuration: number; // 초 단위
  
  // 분석 옵션
  enableAdvancedAnalytics: boolean;
  trackAppUsage: boolean;
  trackTimePatterns: boolean;
}

/**
 * 🛡️ 보안/권한 설정
 */
export interface SecuritySettingsSchema {
  // 권한
  enableAccessibilityPermission: boolean;
  enableInputMonitoring: boolean;
  
  // 데이터 보호
  encryptLocalData: boolean;
  anonymizeData: boolean;
  
  // 네트워크
  allowTelemetry: boolean;
  allowUpdates: boolean;
  allowExternalLinks: boolean;
}

/**
 * 🔔 알림 설정
 */
export interface NotificationSettingsSchema {
  // 알림 활성화
  enableNotifications: boolean;
  enableSounds: boolean;
  
  // 목표 달성 알림
  notifyGoalAchieved: boolean;
  notifyDailyGoal: boolean;
  notifyWeeklyGoal: boolean;
  
  // 성과 알림
  notifyNewRecord: boolean;
  notifyMilestone: boolean;
  
  // 시스템 알림
  notifyErrors: boolean;
  notifyUpdates: boolean;
}

/**
 * 🤖 AI 기능 설정
 */
export interface AISettingsSchema {
  // AI 활성화
  enableAI: boolean;
  autoAnalysis: boolean;
  realTimeAnalysis: boolean;
  
  // AI 분석 옵션
  enableTypingPatternAnalysis: boolean;
  enableErrorCorrection: boolean;
  enableProductivityTips: boolean;
  enablePersonalizedFeedback: boolean;
  
  // AI 서비스 설정
  apiProvider: 'openai' | 'anthropic' | 'local' | 'custom';
  apiKey?: string;
  apiEndpoint?: string;
  maxTokens: number;
  temperature: number;
  
  // 프라이버시
  shareAnonymousData: boolean;
  localProcessingOnly: boolean;
  
  // 성능
  analysisFrequency: 'realtime' | 'periodic' | 'manual';
  batchSize: number;
  debounceDelay: number;
}

/**
 * 📋 클립보드 모니터링 설정
 */
export interface ClipboardSettingsSchema {
  // 클립보드 활성화
  enableClipboard: boolean;
  enableClipboardHistory: boolean;
  enableClipboardAnalysis: boolean;
  
  // 히스토리 설정
  maxHistoryItems: number;
  historyRetentionDays: number;
  enableEncryption: boolean;
  
  // 필터링
  ignorePasswordManagers: boolean;
  ignoreImageData: boolean;
  maxTextLength: number;
  
  // 자동 기능
  enableAutoClean: boolean;
  enableSmartPaste: boolean;
  enableDuplicateDetection: boolean;
  
  // 보안
  excludePatterns: string[];
  includeOnlyApps: string[];
  maskSensitiveData: boolean;
}

/**
 * 📸 스크린샷 설정
 */
export interface ScreenshotSettingsSchema {
  // 스크린샷 활성화
  enableScreenshots: boolean;
  autoCapture: boolean;
  enableOCR: boolean;
  
  // 캡처 설정
  captureFormat: 'png' | 'jpg' | 'webp';
  quality: number; // 1-100
  captureDelay: number;
  
  // 저장 설정
  savePath: string;
  filenamePattern: string;
  maxFileSize: number; // MB
  retentionDays: number;
  
  // 업로드 설정
  enableCloudUpload: boolean;
  cloudProvider: 'none' | 'imgur' | 'cloudinary' | 's3' | 'custom';
  cloudApiKey?: string;
  
  // 개인정보 보호
  blurSensitiveAreas: boolean;
  excludeApps: string[];
  enableWatermark: boolean;
  watermarkText?: string;
  
  // 단축키
  shortcuts: {
    captureFullScreen: string;
    captureWindow: string;
    captureSelection: string;
    captureDelayed: string;
  };
}

/**
 * 👤 계정/프로필 설정
 */
export interface AccountSettingsSchema {
  // 프로필 정보
  userId?: string;
  username?: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  
  // 계정 설정
  enableSync: boolean;
  syncProvider: 'local' | 'cloud' | 'custom';
  syncInterval: number; // 분 단위
  
  // 인증
  enableTwoFactor: boolean;
  authProvider: 'local' | 'google' | 'apple' | 'microsoft';
  sessionTimeout: number; // 분 단위
  
  // 구독/라이선스
  subscriptionType: 'free' | 'premium' | 'enterprise';
  licenseKey?: string;
  expiryDate?: Date;
  
  // 개인화
  timezone: string;
  dateFormat: 'yyyy-mm-dd' | 'mm/dd/yyyy' | 'dd/mm/yyyy';
  timeFormat: '12h' | '24h';
  
  // 개인정보
  allowAnalytics: boolean;
  allowCrashReports: boolean;
  allowUsageStats: boolean;
}

/**
 * 🗄️ 데이터 보관/관리 설정
 */
export interface DataRetentionSettingsSchema {
  // 보관 정책
  retentionPeriod: number; // 일 단위
  autoDeleteOldData: boolean;
  enableDataArchive: boolean;
  
  // 데이터 타입별 설정
  typingData: {
    enabled: boolean;
    retentionDays: number;
    enableCompression: boolean;
  };
  
  keystrokeData: {
    enabled: boolean;
    retentionDays: number;
    enableAggregation: boolean;
  };
  
  appUsageData: {
    enabled: boolean;
    retentionDays: number;
    aggregationLevel: 'hourly' | 'daily' | 'weekly';
  };
  
  clipboardData: {
    enabled: boolean;
    retentionDays: number;
    enableEncryption: boolean;
  };
  
  screenshotData: {
    enabled: boolean;
    retentionDays: number;
    compressionLevel: number; // 1-9
  };
  
  // 백업 설정
  enableAutoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupLocation: string;
  maxBackupFiles: number;
  enableCloudBackup: boolean;
  
  // 데이터 내보내기
  exportFormat: 'json' | 'csv' | 'sqlite' | 'all';
  enableScheduledExport: boolean;
  exportSchedule?: string; // cron expression
  
  // 정리 설정
  enableSmartCleanup: boolean;
  cleanupThreshold: number; // GB
  prioritizeRecent: boolean;
}

/**
 * 🔥 통합 Settings 스키마
 */
export interface SettingsSchema {
  app: AppSettingsSchema;
  keyboard: KeyboardSettingsSchema;
  ui: UISettingsSchema;
  analytics: AnalyticsSettingsSchema;
  security: SecuritySettingsSchema;
  notifications: NotificationSettingsSchema;
  ai: AISettingsSchema;
  clipboard: ClipboardSettingsSchema;
  screenshot: ScreenshotSettingsSchema;
  account: AccountSettingsSchema;
  dataRetention: DataRetentionSettingsSchema;
  
  // 메타데이터
  version: string;
  lastModified: Date;
  userId?: string;
}

/**
 * 🎯 Settings 결과 타입
 */
export interface SettingsResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 🔄 Settings 변경 이벤트
 */
export interface SettingsChangeEvent<T = unknown> {
  key: string;
  oldValue: T;
  newValue: T;
  timestamp: Date;
}

/**
 * 💾 Settings 저장소 인터페이스
 */
export interface SettingsStorage {
  load(): Promise<Partial<SettingsSchema>>;
  save(settings: Partial<SettingsSchema>): Promise<void>;
  get<K extends keyof SettingsSchema>(key: K): Promise<SettingsSchema[K] | undefined>;
  set<K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]): Promise<void>;
  delete(key: keyof SettingsSchema): Promise<void>;
  clear(): Promise<void>;
  backup(): Promise<string>;
  restore(backupData: string): Promise<void>;
}
