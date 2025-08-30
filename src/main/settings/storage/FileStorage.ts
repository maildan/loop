// 🔥 기가차드 파일 기반 Settings 저장소 - 로컬 파일 시스템!

import { app } from 'electron';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../../../shared/logger';
import { SettingsSchema, SettingsStorage } from '../types';

/**
 * 🔥 파일 기반 설정 저장소
 * - JSON 파일로 설정 저장
 * - 자동 백업 및 복원
 * - 원자적 쓰기 보장
 */
export class FileStorage implements SettingsStorage {
  private readonly settingsPath: string;
  private readonly backupPath: string;
  private readonly componentName = 'FILE_STORAGE';

  constructor(customPath?: string) {
    if (customPath) {
      // 테스트용 커스텀 경로
      this.settingsPath = customPath;
      this.backupPath = customPath.replace('.json', '.backup.json');
    } else {
      // 프로덕션용 기본 경로
      const userDataPath = app.getPath('userData');
      this.settingsPath = join(userDataPath, 'settings.json');
      this.backupPath = join(userDataPath, 'settings.backup.json');
    }
    
    Logger.debug(this.componentName, `Settings path: ${this.settingsPath}`);
  }

  /**
   * 🔥 설정 로드
   */
  async load(): Promise<Partial<SettingsSchema>> {
    try {
      // 메인 파일 시도
      const data = await fs.readFile(this.settingsPath, 'utf8');
      const settings = JSON.parse(data);
      
      Logger.debug(this.componentName, 'Settings loaded from main file');
      return settings;
    } catch (mainError) {
      Logger.warn(this.componentName, 'Failed to load main settings file', mainError);
      
      try {
        // 백업 파일 시도
        const backupData = await fs.readFile(this.backupPath, 'utf8');
        const settings = JSON.parse(backupData);
        
        Logger.info(this.componentName, 'Settings loaded from backup file');
        return settings;
      } catch (backupError) {
        Logger.warn(this.componentName, 'Failed to load backup settings file', backupError);
        return {};
      }
    }
  }

  /**
   * 🔥 설정 저장 (원자적 쓰기)
   */
  async save(settings: Partial<SettingsSchema>): Promise<void> {
    try {
      const data = JSON.stringify(settings, null, 2);
      const tempPath = `${this.settingsPath}.tmp`;
      
      // 임시 파일에 쓰기
      await fs.writeFile(tempPath, data, 'utf8');
      
      // 기존 파일을 백업으로 이동 (있는 경우)
      try {
        await fs.access(this.settingsPath);
        await fs.copyFile(this.settingsPath, this.backupPath);
      } catch {
        // 기존 파일이 없으면 무시
      }
      
      // 임시 파일을 메인 파일로 이동 (원자적 쓰기)
      await fs.rename(tempPath, this.settingsPath);
      
      Logger.debug(this.componentName, 'Settings saved successfully');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to save settings', error);
      throw error;
    }
  }

  /**
   * 🔥 특정 설정값 가져오기
   */
  async get<K extends keyof SettingsSchema>(key: K): Promise<SettingsSchema[K] | undefined> {
    try {
      const settings = await this.load();
      return settings[key];
    } catch (error) {
      Logger.error(this.componentName, `Failed to get setting '${String(key)}'`, error);
      return undefined;
    }
  }

  /**
   * 🔥 특정 설정값 저장
   */
  async set<K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]): Promise<void> {
    try {
      const settings = await this.load();
      settings[key] = value;
      await this.save(settings);
    } catch (error) {
      Logger.error(this.componentName, `Failed to set setting '${String(key)}'`, error);
      throw error;
    }
  }

  /**
   * 🔥 특정 설정 삭제
   */
  async delete(key: keyof SettingsSchema): Promise<void> {
    try {
      const settings = await this.load();
      delete settings[key];
      await this.save(settings);
      
      Logger.debug(this.componentName, `Setting '${String(key)}' deleted`);
    } catch (error) {
      Logger.error(this.componentName, `Failed to delete setting '${String(key)}'`, error);
      throw error;
    }
  }

  /**
   * 🔥 모든 설정 삭제
   */
  async clear(): Promise<void> {
    try {
      await fs.unlink(this.settingsPath);
      await fs.unlink(this.backupPath).catch(() => {}); // 백업 파일도 삭제 (에러 무시)
      
      Logger.info(this.componentName, 'All settings cleared');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to clear settings', error);
      throw error;
    }
  }

  /**
   * 🔥 설정 백업 생성
   */
  async backup(): Promise<string> {
    try {
      const settings = await this.load();
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        settings
      };
      
      const backupString = JSON.stringify(backupData, null, 2);
      
      // 타임스탬프가 포함된 백업 파일 생성
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const timestampedBackupPath = join(
        app.getPath('userData'),
        `settings-backup-${timestamp}.json`
      );
      
      await fs.writeFile(timestampedBackupPath, backupString, 'utf8');
      
      Logger.info(this.componentName, `Backup created: ${timestampedBackupPath}`);
      return backupString;
    } catch (error) {
      Logger.error(this.componentName, 'Failed to create backup', error);
      throw error;
    }
  }

  /**
   * 🔥 설정 백업에서 복원
   */
  async restore(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData);
      
      if (!backup.settings) {
        throw new Error('Invalid backup format: missing settings');
      }
      
      await this.save(backup.settings);
      
      Logger.info(this.componentName, 'Settings restored from backup');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to restore from backup', error);
      throw error;
    }
  }
}
