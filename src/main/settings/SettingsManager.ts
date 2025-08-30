// 🔥 기가차드 Settings 매니저 - 모든 설정의 중앙 관리자!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { 
  SettingsSchema, 
  SettingsResult, 
  SettingsChangeEvent,
  SettingsStorage 
} from './types';
import { DEFAULT_SETTINGS } from './defaults';
import { validateSettings } from './validation';

/**
 * 🔥 기가차드 Settings 매니저
 * - 타입 안전한 설정 관리
 * - 실시간 변경 감지
 * - 자동 백업/복원
 * - 검증 및 마이그레이션
 */
export class SettingsManager extends BaseManager {
  private settings: SettingsSchema;
  private storage: SettingsStorage;
  private changeListeners: Map<string, Set<(event: SettingsChangeEvent) => void>>;
  private autoSaveInterval: NodeJS.Timeout | null = null;

  // 컴포넌트 이름 getter
  private get componentName(): string {
    return this.config.name;
  }

  constructor(storage: SettingsStorage) {
    super({
      name: 'SETTINGS_MANAGER',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });
    
    this.storage = storage;
    this.settings = { ...DEFAULT_SETTINGS };
    this.changeListeners = new Map();
    
    Logger.info(this.componentName, 'Settings manager instance created');
  }

  /**
   * 🔥 설정 매니저 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      Logger.info(this.componentName, 'Initializing settings manager...');
      
      // 저장된 설정 로드
      await this.loadSettings();
      
      // 자동 저장 설정
      this.setupAutoSave();
      
      Logger.info(this.componentName, 'Settings manager initialized successfully');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to initialize settings manager', error);
      throw error;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Settings manager started');
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지  
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Settings manager stopped');
  }

  /**
   * 🔥 설정 로드
   */
  private async loadSettings(): Promise<void> {
    try {
      const loadResult = await this.storage.load();
      const savedSettings = loadResult && 'data' in loadResult ? loadResult.data : loadResult;
      // 기본값과 병합
      this.settings = this.mergeWithDefaults(savedSettings as Partial<SettingsSchema>);
      // 설정 검증
      const validationResult = validateSettings(this.settings);
      if (!validationResult.success) {
        Logger.warn(this.componentName, 'Settings validation failed, using defaults', validationResult.error);
        this.settings = { ...DEFAULT_SETTINGS };
      }
      Logger.info(this.componentName, 'Settings loaded successfully');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to load settings, using defaults', error);
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * 🔥 설정 저장
   */
  private async saveSettings(): Promise<void> {
    try {
      await this.storage.save(this.settings);
      Logger.debug(this.componentName, 'Settings saved successfully');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to save settings', error);
      throw error;
    }
  }

  /**
   * 🔥 기본값과 병합
   */
  private mergeWithDefaults(savedSettings: Partial<SettingsSchema>): SettingsSchema {
    return {
      app: { ...DEFAULT_SETTINGS.app, ...savedSettings.app },
      keyboard: { ...DEFAULT_SETTINGS.keyboard, ...savedSettings.keyboard },
      ui: { ...DEFAULT_SETTINGS.ui, ...savedSettings.ui },
      analytics: { ...DEFAULT_SETTINGS.analytics, ...savedSettings.analytics },
      security: { ...DEFAULT_SETTINGS.security, ...savedSettings.security },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...savedSettings.notifications },
      ai: { ...DEFAULT_SETTINGS.ai, ...savedSettings.ai },
      clipboard: { ...DEFAULT_SETTINGS.clipboard, ...savedSettings.clipboard },
      screenshot: { ...DEFAULT_SETTINGS.screenshot, ...savedSettings.screenshot },
      account: { ...DEFAULT_SETTINGS.account, ...savedSettings.account },
      dataRetention: { ...DEFAULT_SETTINGS.dataRetention, ...savedSettings.dataRetention },
      version: savedSettings.version || DEFAULT_SETTINGS.version,
      lastModified: new Date(),
      userId: savedSettings.userId
    };
  }

  /**
   * 🔥 설정값 가져오기 (타입 안전)
   */
  public get<K extends keyof SettingsSchema>(key: K): SettingsSchema[K] {
    return this.settings[key];
  }

  /**
   * 🔥 중첩된 설정값 가져오기
   */
  public getDeep<K extends keyof SettingsSchema>(
    category: K, 
    key: string
  ): unknown {
    const categoryData = this.settings[category];
    if (categoryData && typeof categoryData === 'object') {
      return (categoryData as unknown as Record<string, unknown>)[key];
    }
    return undefined;
  }

  /**
   * 🔥 설정값 변경 (타입 안전)
   */
  public async set<K extends keyof SettingsSchema>(
    key: K, 
    value: SettingsSchema[K]
  ): Promise<SettingsResult<SettingsSchema[K]>> {
    try {
      const oldValue = this.settings[key];
      
      // 값 검증
      const validationResult = validateSettings({ [key]: value } as Partial<SettingsSchema>);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Validation failed: ${validationResult.error}`
        };
      }
      
      // 값 변경 (사용자가 제공한 값을 그대로 사용)
      this.settings[key] = value;
      this.settings.lastModified = new Date();
      
      // 변경 이벤트 발생
      this.emitChange(key as string, oldValue, value);
      
      // 저장
      await this.saveSettings();
      
      Logger.debug(this.componentName, `Setting '${key}' updated successfully`);
      
      return {
        success: true,
        data: value
      };
    } catch (error) {
      Logger.error(this.componentName, `Failed to set '${key}'`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🔥 중첩된 설정값 변경
   */
  public async setDeep<K extends keyof SettingsSchema>(
    category: K,
    key: string,
    value: unknown
  ): Promise<SettingsResult<unknown>> {
    try {
      const categorySettings = { ...this.settings[category] as unknown as Record<string, unknown> };
      categorySettings[key] = value;
      const result = await this.set(category, categorySettings as unknown as SettingsSchema[K]);
      return {
        success: result.success,
        data: value,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🔥 설정 변경 감지 등록
   */
  public watch<K extends keyof SettingsSchema>(
    key: K,
    callback: (event: SettingsChangeEvent<SettingsSchema[K]>) => void
  ): () => void {
    const keyStr = key as string;
    if (!this.changeListeners.has(keyStr)) {
      this.changeListeners.set(keyStr, new Set());
    }
    
    // 타입 안전한 콜백 추가
    const typedCallback = callback as (event: SettingsChangeEvent<unknown>) => void;
    this.changeListeners.get(keyStr)!.add(typedCallback);
    
    // 제거 함수 반환
    return () => {
      const listeners = this.changeListeners.get(keyStr);
      if (listeners) {
        listeners.delete(typedCallback);
        if (listeners.size === 0) {
          this.changeListeners.delete(keyStr);
        }
      }
    };
  }

  /**
   * 🔥 변경 이벤트 발생
   */
  private emitChange<T>(key: string, oldValue: T, newValue: T): void {
    const listeners = this.changeListeners.get(key);
    if (!listeners || listeners.size === 0) return;
    
    const event: SettingsChangeEvent<T> = {
      key,
      oldValue,
      newValue,
      timestamp: new Date()
    };
    
    listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        Logger.error(this.componentName, `Error in settings change callback for '${key}'`, error);
      }
    });
  }

  /**
   * 🔥 자동 저장 설정 (무한루프 방지)
   */
  private setupAutoSave(): void {
    // 🔥 기존 interval 정리
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }

    // 30초마다 자동 저장 (개발 모드에서는 60초)
    const interval = process.env.NODE_ENV === 'development' ? 60000 : 30000;
    
    this.autoSaveInterval = setInterval(async () => {
      try {
        // 🔥 매니저가 실행 중일 때만 저장
        if (this.isRunning()) {
          await this.saveSettings();
        }
      } catch (error) {
        Logger.error(this.componentName, 'Auto-save failed', error);
      }
    }, interval);
    
    Logger.debug(this.componentName, `Auto-save setup with ${interval/1000}s interval`);
  }

  /**
   * 🔥 설정 리셋
   */
  public async reset(): Promise<SettingsResult<SettingsSchema>> {
    try {
      const oldSettings = { ...this.settings };
      this.settings = { ...DEFAULT_SETTINGS };
      
      await this.saveSettings();
      
      // 모든 변경 이벤트 발생
      for (const [key, newValue] of Object.entries(this.settings)) {
        const oldValue = (oldSettings as Record<string, unknown>)[key];
        this.emitChange(key, oldValue, newValue);
      }
      
      Logger.info(this.componentName, 'Settings reset to defaults');
      
      return {
        success: true,
        data: this.settings
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to reset settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🔥 설정 백업
   */
  public async backup(): Promise<SettingsResult<string>> {
    try {
      const backupData = await this.storage.backup();
      Logger.info(this.componentName, 'Settings backup created');
      return {
        success: true,
        data: backupData
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to backup settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🔥 설정 복원
   */
  public async restore(backupData: string): Promise<SettingsResult<SettingsSchema>> {
    try {
      await this.storage.restore(backupData);
      await this.loadSettings();
      
      Logger.info(this.componentName, 'Settings restored from backup');
      return {
        success: true,
        data: this.settings
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to restore settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리 (무한루프 방지)
   */
  protected async doCleanup(): Promise<void> {
    try {
      // 🔥 자동 저장 interval 정리
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
        Logger.debug(this.componentName, 'Auto-save interval cleared');
      }
      
      // 마지막 저장
      await this.saveSettings();
      
      // 리스너 정리
      this.changeListeners.clear();
      
      Logger.info(this.componentName, 'Settings manager cleaned up');
    } catch (error) {
      Logger.error(this.componentName, 'Error during settings cleanup', error);
      throw error;
    }
  }

  /**
   * 🔥 현재 설정 전체 조회
   */
  public getAll(): SettingsSchema {
    return { ...this.settings };
  }
}
