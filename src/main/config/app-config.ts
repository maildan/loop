// 🔥 기가차드 앱 설정 관리자

import { Logger } from '../../shared/logger';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

// #DEBUG: App config entry point
Logger.debug('APP_CONFIG', 'App config module loaded');

// 🔥 기가차드 앱 설정 인터페이스
export interface AppConfig {
  version: string;
  environment: 'development' | 'production' | 'test';
  dataDirectory: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  updateCheckInterval: number;
}

// 🔥 기가차드 기본 설정
export const DEFAULT_APP_CONFIG: AppConfig = {
  version: '1.0.0',
  environment: 'development',
  dataDirectory: './data',
  logLevel: 'info',
  enableAnalytics: false,
  enableCrashReporting: false,
  updateCheckInterval: 86400000, // 24시간
};

// 🔥 기가차드 앱 설정 관리자
export class AppConfigManager {
  private static instance: AppConfigManager | null = null;
  private config: AppConfig = { ...DEFAULT_APP_CONFIG };
  private configPath: string;

  private constructor() {
    // 설정 파일 경로 설정
    const userDataPath = app.getPath('userData');
    this.configPath = join(userDataPath, 'config.json');
    
    this.loadConfig();
  }

  public static getInstance(): AppConfigManager {
    if (!AppConfigManager.instance) {
      AppConfigManager.instance = new AppConfigManager();
    }
    return AppConfigManager.instance;
  }

  private loadConfig(): void {
    try {
      if (existsSync(this.configPath)) {
        const configData = readFileSync(this.configPath, 'utf8');
        const parsedConfig = JSON.parse(configData) as Partial<AppConfig>;
        
        // 기본 설정과 병합하여 누락된 속성 채우기
        this.config = { ...DEFAULT_APP_CONFIG, ...parsedConfig };
        
        Logger.info('APP_CONFIG', 'Config loaded from file', { path: this.configPath });
      } else {
        // 설정 파일이 없으면 기본 설정으로 생성
        this.saveConfig();
        Logger.info('APP_CONFIG', 'Created default config file', { path: this.configPath });
      }
    } catch (error) {
      Logger.error('APP_CONFIG', 'Failed to load config, using defaults', error as Error);
      this.config = { ...DEFAULT_APP_CONFIG };
    }
    
    Logger.info('APP_CONFIG', 'Config loaded', this.config);
  }

  private saveConfig(): void {
    try {
      writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
      Logger.info('APP_CONFIG', 'Config saved to file', { path: this.configPath });
    } catch (error) {
      Logger.error('APP_CONFIG', 'Failed to save config', error as Error);
    }
  }

  public getConfig(): Readonly<AppConfig> {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig(); // 설정 변경 시 파일에 즉시 저장
    Logger.info('APP_CONFIG', 'Config updated and saved', updates);
  }

  public resetToDefaults(): void {
    this.config = { ...DEFAULT_APP_CONFIG };
    this.saveConfig();
    Logger.info('APP_CONFIG', 'Config reset to defaults');
  }

  public getConfigPath(): string {
    return this.configPath;
  }
}

export const appConfig = AppConfigManager.getInstance();
export default appConfig;
