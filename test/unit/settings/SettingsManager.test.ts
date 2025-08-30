// 🔥 기가차드 Settings Manager 단위 테스트

import { SettingsManager } from '../../../src/main/settings/SettingsManager';
import { FileStorage } from '../../../src/main/settings/storage/FileStorage';
import { DEFAULT_SETTINGS } from '../../../src/main/settings/defaults';
import { Logger } from '../../../src/shared/logger';
import type { SettingsSchema, SettingsResult } from '../../../src/main/settings/types';

// Mock dependencies
jest.mock('../../../src/main/settings/storage/FileStorage');
jest.mock('../../../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const MockedFileStorage = FileStorage as jest.MockedClass<typeof FileStorage>;

// 🔥 타입 안전한 테스트 헬퍼 함수
function createValidSettings(): SettingsSchema {
  return {
    app: {
      theme: 'dark',
      language: 'ko',
      autoStart: false,
      minimizeToTray: true,
      windowBounds: { width: 1200, height: 800, x: 100, y: 100 },
      alwaysOnTop: false,
      devMode: false,
      enableLogging: true,
      logLevel: 'info',
    },
    keyboard: {
      enabled: true,
      language: 'korean',
      enableIme: true,
      enableGlobalShortcuts: true,
      enableAppDetection: true,
      autoSaveInterval: 30,
      debugMode: false,
      autoStartMonitoring: false,
      sessionTimeout: 30,
      enableBatchProcessing: true,
      batchSize: 100,
      debounceDelay: 16,
      enableHealthCheck: true,
      globalShortcuts: {
        startStop: 'CmdOrCtrl+Shift+K',
        pause: 'CmdOrCtrl+Shift+P',
        showStats: 'CmdOrCtrl+Shift+S',
      },
      ignoreApps: [],
      focusOnlyApps: [],
      eventBufferSize: 1000,
      processingDelay: 16,
    },
    ui: {
      colorScheme: 'blue',
      accentColor: '#007acc',
      sidebarPosition: 'left',
      compactMode: false,
      showStatusBar: true,
      enableAnimations: true,
      animationSpeed: 'normal',
      fontFamily: 'system-ui',
      fontSize: 14,
      fontWeight: 'normal',
    },
    analytics: {
      targetWPM: 60,
      targetAccuracy: 95,
      dailyGoal: 60,
      trackingPeriod: 'daily',
      excludeShortSessions: true,
      minSessionDuration: 30,
      enableAdvancedAnalytics: true,
      trackAppUsage: true,
      trackTimePatterns: true,
    },
    security: {
      enableAccessibilityPermission: true,
      enableInputMonitoring: true,
      encryptLocalData: false,
      anonymizeData: false,
      allowTelemetry: true,
      allowUpdates: true,
      allowExternalLinks: true,
    },
    notifications: {
      enableNotifications: true,
      enableSounds: true,
      notifyGoalAchieved: true,
      notifyDailyGoal: true,
      notifyWeeklyGoal: true,
      notifyNewRecord: true,
      notifyMilestone: true,
      notifyErrors: true,
      notifyUpdates: true,
    },
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
      debounceDelay: 300,
    },
    clipboard: {
      enableClipboard: false,
      enableClipboardHistory: false,
      enableClipboardAnalysis: false,
      maxHistoryItems: 100,
      historyRetentionDays: 7,
      enableEncryption: false,
      ignorePasswordManagers: true,
      ignoreImageData: true,
      maxTextLength: 10000,
      enableAutoClean: true,
      enableSmartPaste: false,
      enableDuplicateDetection: true,
      excludePatterns: ['password', 'secret'],
      includeOnlyApps: [],
      maskSensitiveData: true,
    },
    screenshot: {
      enableScreenshots: false,
      autoCapture: false,
      enableOCR: false,
      captureFormat: 'png',
      quality: 80,
      captureDelay: 3000,
      savePath: '/tmp/screenshots',
      filenamePattern: 'screenshot-{timestamp}',
      maxFileSize: 10,
      retentionDays: 30,
      enableCloudUpload: false,
      cloudProvider: 'none',
      blurSensitiveAreas: true,
      excludeApps: [],
      enableWatermark: false,
      shortcuts: {
        captureFullScreen: 'CmdOrCtrl+Shift+3',
        captureWindow: 'CmdOrCtrl+Shift+4',
        captureSelection: 'CmdOrCtrl+Shift+5',
        captureDelayed: 'CmdOrCtrl+Shift+6',
      },
    },
    account: {
      enableSync: false,
      syncProvider: 'local',
      syncInterval: 60,
      enableTwoFactor: false,
      authProvider: 'local',
      sessionTimeout: 480,
      subscriptionType: 'free',
      timezone: 'Asia/Seoul',
      dateFormat: 'yyyy-mm-dd',
      timeFormat: '24h',
      allowAnalytics: false,
      allowCrashReports: true,
      allowUsageStats: false,
    },
    dataRetention: {
      retentionPeriod: 365,
      autoDeleteOldData: false,
      enableDataArchive: true,
      typingData: {
        enabled: true,
        retentionDays: 365,
        enableCompression: true,
      },
      keystrokeData: {
        enabled: true,
        retentionDays: 90,
        enableAggregation: true,
      },
      appUsageData: {
        enabled: true,
        retentionDays: 180,
        aggregationLevel: 'daily',
      },
      clipboardData: {
        enabled: false,
        retentionDays: 7,
        enableEncryption: true,
      },
      screenshotData: {
        enabled: false,
        retentionDays: 30,
        compressionLevel: 6,
      },
      enableAutoBackup: true,
      backupFrequency: 'weekly',
      backupLocation: '/tmp/backups',
      maxBackupFiles: 10,
      enableCloudBackup: false,
      exportFormat: 'json',
      enableScheduledExport: false,
      enableSmartCleanup: true,
      cleanupThreshold: 10,
      prioritizeRecent: true,
    },
    version: '1.0.0',
    lastModified: new Date(),
  };
}

describe('🔥 SettingsManager 단위 테스트', () => {
  let settingsManager: SettingsManager;
  let mockStorage: jest.Mocked<FileStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock storage instance
    mockStorage = {
      load: jest.fn(),
      save: jest.fn(),
      backup: jest.fn(),
      restore: jest.fn(),
    } as any;

    MockedFileStorage.mockImplementation(() => mockStorage);
    settingsManager = new SettingsManager(mockStorage);
  });

  afterEach(async () => {
    if (settingsManager) {
      await settingsManager.cleanup();
    }
  });

  describe('기본 기능', () => {
    it('should create SettingsManager instance', () => {
      expect(settingsManager).toBeInstanceOf(SettingsManager);
      expect(settingsManager).toBeDefined();
    });

    it('should initialize successfully', async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);

      const result = await settingsManager.initialize();
      
      expect(result).toBe(true);
      expect(settingsManager.isInitialized()).toBe(true);
      expect(mockStorage.load).toHaveBeenCalled();
    });
  });

  describe('설정 조회', () => {
    beforeEach(async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);
      await settingsManager.initialize();
    });

    it('should get app settings', () => {
      const appSettings = settingsManager.get('app');
      
      expect(appSettings).toBeDefined();
      expect(appSettings.theme).toBe('dark');
      expect(appSettings.logLevel).toBe('info');
    });

    it('should get keyboard settings', () => {
      const keyboardSettings = settingsManager.get('keyboard');
      
      expect(keyboardSettings).toBeDefined();
      expect(keyboardSettings.enabled).toBe(true);
      expect(keyboardSettings.language).toBe('korean');
    });

    it('should get UI settings', () => {
      const uiSettings = settingsManager.get('ui');
      
      expect(uiSettings).toBeDefined();
      expect(uiSettings.colorScheme).toBe('blue');
      expect(uiSettings.fontSize).toBe(14);
    });

    it('should get all settings', () => {
      const allSettings = settingsManager.getAll();
      
      expect(allSettings).toBeDefined();
      expect(allSettings.app).toBeDefined();
      expect(allSettings.keyboard).toBeDefined();
      expect(allSettings.ui).toBeDefined();
      expect(allSettings.security).toBeDefined();
      expect(allSettings.notifications).toBeDefined();
    });

    it('should get deep nested values', () => {
      const colorScheme = settingsManager.getDeep('ui', 'colorScheme');
      expect(colorScheme).toBe('blue');
      
      const logLevel = settingsManager.getDeep('app', 'logLevel');
      expect(logLevel).toBe('info');
    });
  });

  describe('설정 수정', () => {
    beforeEach(async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);
      mockStorage.save.mockResolvedValue(undefined);
      await settingsManager.initialize();
    });

    it('should set app settings', async () => {
      const newAppSettings = {
        theme: 'light' as const,
        language: 'en' as const,
        autoStart: true,
        minimizeToTray: false,
        windowBounds: { width: 1400, height: 900 },
        alwaysOnTop: true,
        devMode: true,
        enableLogging: false,
        logLevel: 'debug' as const,
      };

      const result = await settingsManager.set('app', newAppSettings);
      
      expect(result.success).toBe(true);
      expect(mockStorage.save).toHaveBeenCalled();
      
      const updated = settingsManager.get('app');
      expect(updated.theme).toBe('light');
      expect(updated.logLevel).toBe('debug');
    });

    it('should set keyboard settings', async () => {
      const newKeyboardSettings = {
        enabled: false,
        language: 'english' as const,
        enableIme: false,
        enableGlobalShortcuts: false,
        enableAppDetection: false,
        autoSaveInterval: 60,
        debugMode: true,
        autoStartMonitoring: true,
        sessionTimeout: 60,
        enableBatchProcessing: false,
        batchSize: 50,
        debounceDelay: 32,
        enableHealthCheck: false,
        globalShortcuts: {
          startStop: 'CmdOrCtrl+Alt+K',
          pause: 'CmdOrCtrl+Alt+P',
          showStats: 'CmdOrCtrl+Alt+S',
        },
        ignoreApps: ['test-app'],
        focusOnlyApps: ['focus-app'],
        eventBufferSize: 500,
        processingDelay: 32,
      };

      const result = await settingsManager.set('keyboard', newKeyboardSettings);
      
      expect(result.success).toBe(true);
      
      const updated = settingsManager.get('keyboard');
      expect(updated.enabled).toBe(false);
      expect(updated.language).toBe('english');
    });

    it('should set deep nested values', async () => {
      const result = await settingsManager.setDeep('ui', 'colorScheme', 'green');
      
      expect(result.success).toBe(true);
      expect(mockStorage.save).toHaveBeenCalled();
      
      const colorScheme = settingsManager.getDeep('ui', 'colorScheme');
      expect(colorScheme).toBe('green');
    });
  });

  describe('설정 감시', () => {
    beforeEach(async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);
      mockStorage.save.mockResolvedValue(undefined);
      await settingsManager.initialize();
    });

    it('should watch for setting changes', async () => {
      const mockCallback = jest.fn();
      
      const unwatch = settingsManager.watch('ui', mockCallback);
      expect(typeof unwatch).toBe('function');
      
      // Change UI setting
      await settingsManager.setDeep('ui', 'colorScheme', 'purple');
      
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'ui',
          oldValue: expect.objectContaining({ colorScheme: 'blue' }),
          newValue: expect.objectContaining({ colorScheme: 'purple' }),
        })
      );
      
      // Cleanup watcher
      unwatch();
    });
  });

  describe('백업 및 복원', () => {
    beforeEach(async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);
      await settingsManager.initialize();
    });

    it('should create backup', async () => {
      const backupData = JSON.stringify(createValidSettings());
      mockStorage.backup.mockResolvedValue(backupData);

      const result = await settingsManager.backup();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockStorage.backup).toHaveBeenCalled();
    });

    it('should restore from backup', async () => {
      const backupData = JSON.stringify(createValidSettings());
      
      mockStorage.restore.mockResolvedValue();
      mockStorage.load.mockResolvedValue(createValidSettings()); // loadSettings가 호출되므로 load가 호출됨

      const result = await settingsManager.restore(backupData);
      
      expect(result.success).toBe(true);
      expect(mockStorage.restore).toHaveBeenCalledWith(backupData);
      expect(mockStorage.load).toHaveBeenCalled(); // save 대신 load가 호출됨
    });
  });

  describe('설정 리셋', () => {
    beforeEach(async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);
      mockStorage.save.mockResolvedValue(undefined);
      await settingsManager.initialize();
    });

    it('should reset to default settings', async () => {
      const result = await settingsManager.reset();
      
      expect(result.success).toBe(true);
      expect(mockStorage.save).toHaveBeenCalled();
      
      // Check that settings were reset to defaults
      const allSettings = settingsManager.getAll();
      expect(allSettings).toBeDefined();
    });
  });

  describe('에러 처리', () => {
    it('should handle storage load errors gracefully', async () => {
      // 스토리지 로드 실패 시뮬레이션
      mockStorage.load.mockRejectedValue(new Error('Load failed'));

      const result = await settingsManager.initialize();
      
      // 로드 실패 시에도 기본값으로 초기화되어 성공해야 함
      expect(result).toBe(true);
      expect(mockStorage.load).toHaveBeenCalled();
      
      // 기본값이 로드되었는지 확인
      const settings = settingsManager.getAll();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('should handle storage save errors', async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);
      mockStorage.save.mockRejectedValue(new Error('Save failed'));
      
      await settingsManager.initialize();

      const result = await settingsManager.set('app', {
        theme: 'light',
        language: 'en',
        autoStart: true,
        minimizeToTray: false,
        windowBounds: { width: 1200, height: 800 },
        alwaysOnTop: false,
        devMode: false,
        enableLogging: true,
        logLevel: 'error',
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Save failed');
    });

    it('should handle backup errors', async () => {
      const testSettings = createValidSettings();
      mockStorage.load.mockResolvedValue(testSettings);
      mockStorage.backup.mockRejectedValue(new Error('Backup failed'));
      
      await settingsManager.initialize();

      const result = await settingsManager.backup();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Backup failed');
    });
  });
});
