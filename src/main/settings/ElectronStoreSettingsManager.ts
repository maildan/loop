// 🔥 기가차드 Electron Store Settings 매니저 - electron-store 기반 (간단 버전)

import Store from 'electron-store';
import { Logger } from '../../shared/logger';
import type { Theme } from '../../shared/types/theme';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { gzipSync } from 'zlib';
import { app } from 'electron';
import { safePathJoin } from '../../shared/utils/pathSecurity';

/**
 * 🔥 간단한 설정 스키마
 */
interface SimpleSettingsSchema {
  app: {
    theme: Theme;
    language: string;
    autoSave: boolean;
    startMinimized: boolean;
    minimizeToTray: boolean;
    fontSize: number;
    fontFamily: string;
  };
  keyboard: {
    enabled: boolean;
    language: string;
    trackAllApps: boolean;
    sessionTimeout: number;
  };
  ui: {
    windowWidth: number;
    windowHeight: number;
    sidebarCollapsed: boolean;
    focusMode: boolean;
    showLineNumbers: boolean;
    showWordCount: boolean;
    showShortcutHelp: boolean; // 🔥 ShortcutHelp 표시 여부
  };
  performance: {
    enableGPUAcceleration: boolean;
    maxCPUUsage: number;
    maxMemoryUsage: number;
    enableHardwareAcceleration: boolean;
  };
}

/**
 * 🔥 기본값
 */
const DEFAULT_SIMPLE_SETTINGS: SimpleSettingsSchema = {
  app: {
    theme: 'system',
    language: 'ko',
    autoSave: true,
    startMinimized: false,
    minimizeToTray: true,
    fontSize: 14,
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  keyboard: {
    enabled: true,
    language: 'korean',
    trackAllApps: false,
    sessionTimeout: 30,
  },
  ui: {
    windowWidth: 1200,
    windowHeight: 800,
    sidebarCollapsed: false,
    focusMode: false,
    showLineNumbers: true,
    showWordCount: true,
    showShortcutHelp: true, // 🔥 기본적으로 단축키 가이드 표시
  },
  performance: {
    enableGPUAcceleration: true,
    maxCPUUsage: 80,
    maxMemoryUsage: 2048,
    enableHardwareAcceleration: true,
  },
};

/**
 * 🔥 간단한 Electron Store Settings 매니저
 */
export class ElectronStoreSettingsManager {
  private store: Store<SimpleSettingsSchema>;
  private componentName = 'ELECTRON_STORE_SETTINGS';

  constructor() {
    // 🔥 electron-store 초기화
    this.store = new Store<SimpleSettingsSchema>({
      name: 'loop-settings',
      defaults: DEFAULT_SIMPLE_SETTINGS
    });

    Logger.info(this.componentName, 'Electron Store Settings manager created', {
      storePath: 'electron-store-managed',
      storeSize: this.store.size || 0
    });
  }

  /**
   * 🔥 설정값 가져오기
   */
  get<K extends keyof SimpleSettingsSchema>(category: K): SimpleSettingsSchema[K];
  get<K extends keyof SimpleSettingsSchema, T extends keyof SimpleSettingsSchema[K]>(
    category: K,
    key: T
  ): SimpleSettingsSchema[K][T];
  get<K extends keyof SimpleSettingsSchema, T extends keyof SimpleSettingsSchema[K]>(
    category: K,
    key?: T
  ): SimpleSettingsSchema[K] | SimpleSettingsSchema[K][T] {
    try {
      if (key) {
        const categoryData = this.store.get(category);
        return categoryData[key];
      } else {
        return this.store.get(category);
      }
    } catch (error) {
      Logger.error(this.componentName, `Failed to get setting: ${category}.${String(key)}`, error);

      // 🔥 기본값 반환
      if (key) {
        return DEFAULT_SIMPLE_SETTINGS[category][key];
      } else {
        return DEFAULT_SIMPLE_SETTINGS[category];
      }
    }
  }

  /**
   * 🔥 설정값 설정하기
   */
  set<K extends keyof SimpleSettingsSchema>(
    category: K,
    value: SimpleSettingsSchema[K]
  ): boolean;
  set<K extends keyof SimpleSettingsSchema, T extends keyof SimpleSettingsSchema[K]>(
    category: K,
    key: T,
    value: SimpleSettingsSchema[K][T]
  ): boolean;
  set<K extends keyof SimpleSettingsSchema, T extends keyof SimpleSettingsSchema[K]>(
    category: K,
    keyOrValue: T | SimpleSettingsSchema[K],
    value?: SimpleSettingsSchema[K][T]
  ): boolean {
    try {
      if (value !== undefined) {
        // 개별 키 설정
        const key = keyOrValue as T;
        const categoryData = this.store.get(category);
        const newCategoryData = { ...categoryData, [key]: value };
        this.store.set(category, newCategoryData);

        Logger.debug(this.componentName, `Setting updated: ${category}.${String(key)}`, { value });
        return true;
      } else {
        // 전체 카테고리 설정
        const categoryValue = keyOrValue as SimpleSettingsSchema[K];
        this.store.set(category, categoryValue);

        Logger.debug(this.componentName, `Category updated: ${category}`, { value: categoryValue });
        return true;
      }
    } catch (error) {
      Logger.error(this.componentName, `Failed to set setting: ${category}`, error);
      return false;
    }
  }

  /**
   * 🔥 모든 설정 가져오기
   */
  getAll(): SimpleSettingsSchema {
    return this.store.store as SimpleSettingsSchema;
  }

  /**
   * 🔥 설정 리셋
   */
  reset(category?: keyof SimpleSettingsSchema): boolean {
    try {
      if (category) {
        this.store.set(category, DEFAULT_SIMPLE_SETTINGS[category]);
        Logger.info(this.componentName, `Category reset: ${category}`);
      } else {
        this.store.clear();
        this.store.store = DEFAULT_SIMPLE_SETTINGS;
        Logger.info(this.componentName, 'All settings reset to defaults');
      }
      return true;
    } catch (error) {
      Logger.error(this.componentName, `Failed to reset settings: ${category}`, error);
      return false;
    }
  }

  /**
   * 🔥 변경 감지 리스너 (카테고리별) - 간단 버전
   */
  watch<K extends keyof SimpleSettingsSchema>(
    category: K,
    callback: (event: { key: K; newValue: SimpleSettingsSchema[K]; oldValue?: SimpleSettingsSchema[K] }) => void
  ): () => void {
    // 🔥 성능 최적화: 폴링 대신 이벤트 기반 감시
    let previousValue = this.get(category);

    // 5초 간격으로 변경 (1초에서 5초로)
    const interval = setInterval(() => {
      try {
        const currentValue = this.get(category);
        if (JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
          callback({
            key: category,
            newValue: currentValue,
            oldValue: previousValue
          });
          previousValue = currentValue;
        }
      } catch (error) {
        Logger.error(this.componentName, `Error watching category ${String(category)}`, error);
      }
    }, 5000); // 1000ms → 5000ms로 변경

    Logger.debug(this.componentName, `Watching category: ${category}`);
    return () => clearInterval(interval);
  }

  /**
   * 🔥 변경 감지 리스너 (전체) - 간단 버전
   */
  onDidChange(callback: (newValue?: SimpleSettingsSchema, oldValue?: SimpleSettingsSchema) => void): () => void {
    Logger.warn(this.componentName, 'onDidChange not fully implemented in simple version');
    return () => { };
  }

  /**
   * 🔥 스토어 경로 가져오기
   */
  getStorePath(): string {
    return 'electron-store-managed'; // electron-store는 path가 직접 노출되지 않음
  }

  /**
   * 🔥 스토어 크기 가져오기
   */
  getStoreSize(): number {
    return this.store.size || 0;
  }

  /**
   * 🔥 dot notation으로 깊은 값 가져오기
   */
  getDeep(keyPath: string): unknown {
    try {
      return this.store.get(keyPath as any);
    } catch (error) {
      Logger.error(this.componentName, `Failed to get deep setting: ${keyPath}`, error);
      return undefined;
    }
  }

  /**
   * 🔥 dot notation으로 깊은 값 설정하기
   */
  setDeep(keyPath: string, value: unknown): boolean {
    try {
      // Special handling for account.avatar: accept data URLs and save to disk
      if (keyPath === 'account.avatar' && typeof value === 'string' && value.startsWith('data:')) {
        // parse data URL
        const match = value.match(/^data:(image\/[^;]+);base64,(.+)$/);
        if (!match) throw new Error('Invalid data URL');

        const mime = match[1] || '';
        const base64 = match[2] || '';

        // Allow GIF as requested; enforce 5MB limit on decoded binary
        const buffer = Buffer.from(String(base64), 'base64');
        const sizeBytes = buffer.length;
        const maxBytes = 5 * 1024 * 1024; // 5MB
        if (sizeBytes > maxBytes) {
          Logger.warn(this.componentName, 'Avatar exceeds size limit', { sizeBytes });
          throw new Error('Avatar exceeds 5MB size limit');
        }

        // determine extension
        const ext = mime.split('/')[1] || 'png';

        // create avatars dir under userData
        const userDataPath = app.getPath('userData');
        const avatarsDir = safePathJoin(userDataPath, 'avatars');
        if (!avatarsDir) {
          Logger.error(this.componentName, 'Failed to create secure avatars directory path');
          return false;
        }
        if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

        // file name by hash
        const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 32);
        const fileName = `${hash}.${ext}`;
        const filePath = safePathJoin(avatarsDir, fileName);
        if (!filePath) {
          Logger.error(this.componentName, 'Failed to create secure avatar file path');
          return false;
        }

        // write image file
        fs.writeFileSync(filePath, buffer);

        // write gzipped copy for storage/backup
        try {
          const gz = gzipSync(buffer, { level: 9 });
          fs.writeFileSync(`${filePath}.gz`, gz);
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to gzip avatar', e);
        }

        // store loop-avatar:// path so renderer can load it securely
        const storedValue = `loop-avatar://${fileName}`;
        this.store.set(keyPath as any, storedValue);

        Logger.debug(this.componentName, `Deep setting updated (avatar saved): ${keyPath}`, { value: storedValue });
        return true;
      }

      this.store.set(keyPath as any, value);
      Logger.debug(this.componentName, `Deep setting updated: ${keyPath}`, { value });
      return true;
    } catch (error) {
      Logger.error(this.componentName, `Failed to set deep setting: ${keyPath}`, error);
      return false;
    }
  }

  /**
   * 🔥 설정 백업 (JSON 문자열로 반환)
   */
  backup(): string {
    try {
      const allSettings = this.getAll();
      return JSON.stringify(allSettings, null, 2);
    } catch (error) {
      Logger.error(this.componentName, 'Failed to backup settings', error);
      return JSON.stringify(DEFAULT_SIMPLE_SETTINGS, null, 2);
    }
  }

  /**
   * 🔥 설정 복원 (JSON 문자열에서)
   */
  restore(backupData: string): boolean {
    try {
      const parsedData = JSON.parse(backupData) as SimpleSettingsSchema;

      // 기본 검증
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('Invalid backup data format');
      }

      this.store.clear();
      this.store.store = parsedData;

      Logger.info(this.componentName, 'Settings restored from backup');
      return true;
    } catch (error) {
      Logger.error(this.componentName, 'Failed to restore settings', error);
      return false;
    }
  }

  /**
   * 🔥 스토어 삭제
   */
  delete(): void {
    this.store.clear();
    Logger.info(this.componentName, 'Store cleared');
  }
}

// 🔥 싱글톤 인스턴스
let settingsManagerInstance: ElectronStoreSettingsManager | null = null;

/**
 * 🔥 Settings 매니저 인스턴스 가져오기
 */
export function getElectronStoreSettingsManager(): ElectronStoreSettingsManager {
  if (!settingsManagerInstance) {
    settingsManagerInstance = new ElectronStoreSettingsManager();
  }
  return settingsManagerInstance;
}
