/**
 * 🌍 Environment Service - Production 환경변수 관리
 * 
 * Purpose: Production 환경에서 환경변수를 안전하게 로드
 * - Dev: .env 파일 사용
 * - Production: OS Keychain (keychainAdapter) 사용
 */

import { Logger } from '../../shared/logger';
import { keychainAdapter } from '../utils/keychainAdapter';

const COMPONENT = 'ENV_SERVICE';

export interface EnvironmentConfig {
  GEMINI_API_KEY: string;
  GEMINI_MODEL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
}

class EnvironmentServiceClass {
  private loaded = false;
  private config: Partial<EnvironmentConfig> = {};

  /**
   * 🚀 환경변수 초기화
   */
  public async initialize(): Promise<void> {
    if (this.loaded) {
      Logger.debug(COMPONENT, 'Environment already loaded');
      return;
    }

    const isDev = process.env.NODE_ENV === 'development';
    Logger.info(COMPONENT, 'Initializing environment', { isDev });

    if (isDev) {
      // Dev: .env 파일이 이미 로드됨 (main/index.ts의 dotenv/config)
      await this.loadFromProcessEnv();
    } else {
      // Production: Keychain에서 로드
      await this.loadFromKeychain();
    }

    this.loaded = true;
    Logger.info(COMPONENT, '✅ Environment initialized', {
      hasGeminiKey: Boolean(this.config.GEMINI_API_KEY),
      hasGoogleAuth: Boolean(this.config.GOOGLE_CLIENT_ID)
    });
  }

  /**
   * 📁 process.env에서 로드 (Dev)
   */
  private async loadFromProcessEnv(): Promise<void> {
    this.config = {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      GEMINI_MODEL: process.env.GEMINI_MODEL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    };

    Logger.debug(COMPONENT, 'Loaded from process.env', {
      keysLoaded: Object.keys(this.config).filter(k => this.config[k as keyof EnvironmentConfig])
    });
  }

  /**
   * 🔐 Keychain에서 로드 (Production)
   */
  private async loadFromKeychain(): Promise<void> {
    try {
      // Keychain에서 API 키들 로드
      // service: 'loop-env', account: key name
      const geminiKey = await keychainAdapter.getPassword('loop-env', 'GEMINI_API_KEY');
      const googleClientId = await keychainAdapter.getPassword('loop-env', 'GOOGLE_CLIENT_ID');
      const googleClientSecret = await keychainAdapter.getPassword('loop-env', 'GOOGLE_CLIENT_SECRET');

      this.config = {
        GEMINI_API_KEY: geminiKey || '',
        GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-pro',
        GOOGLE_CLIENT_ID: googleClientId || '',
        GOOGLE_CLIENT_SECRET: googleClientSecret || '',
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
      };

      // process.env에 주입 (기존 코드 호환성)
      if (geminiKey) {
        Reflect.set(process.env as Record<string, unknown>, 'GEMINI_API_KEY', geminiKey);
      }
      if (googleClientId) {
        Reflect.set(process.env as Record<string, unknown>, 'GOOGLE_CLIENT_ID', googleClientId);
      }
      if (googleClientSecret) {
        Reflect.set(process.env as Record<string, unknown>, 'GOOGLE_CLIENT_SECRET', googleClientSecret);
      }

      Logger.info(COMPONENT, 'Loaded from keychain and injected into process.env');
    } catch (error) {
      Logger.error(COMPONENT, 'Failed to load from keychain', error);
      await this.loadFromProcessEnv();
    }
  }

  /**
   * 🔑 환경변수 조회
   */
  public get(key: keyof EnvironmentConfig): string | undefined {
    return this.config[key];
  }

  /**
   * ✍️ 환경변수 설정 (Keychain에 저장)
   */
  public async set(key: keyof EnvironmentConfig, value: string): Promise<boolean> {
    try {
      const isDev = process.env.NODE_ENV === 'development';
      
      // Keychain에 저장
      await keychainAdapter.setPassword('loop-env', key, value);
      
      // 메모리 업데이트
      this.config[key] = value;
      
      // process.env 업데이트
      Reflect.set(process.env as Record<string, unknown>, key, value);
      
      Logger.info(COMPONENT, `Environment variable set`, { key, isDev });
      return true;
    } catch (error) {
      Logger.error(COMPONENT, 'Failed to set environment variable', { key, error });
      return false;
    }
  }

  /**
   * 🔍 환경변수 존재 여부 확인
   */
  public has(key: keyof EnvironmentConfig): boolean {
    return Boolean(this.config[key]);
  }

  /**
   * 📊 환경변수 상태 조회
   */
  public getStatus(): Record<keyof EnvironmentConfig, 'set' | 'missing'> {
    return {
      GEMINI_API_KEY: this.config.GEMINI_API_KEY ? 'set' : 'missing',
      GEMINI_MODEL: this.config.GEMINI_MODEL ? 'set' : 'missing',
      GOOGLE_CLIENT_ID: this.config.GOOGLE_CLIENT_ID ? 'set' : 'missing',
      GOOGLE_CLIENT_SECRET: this.config.GOOGLE_CLIENT_SECRET ? 'set' : 'missing',
      GOOGLE_REDIRECT_URI: this.config.GOOGLE_REDIRECT_URI ? 'set' : 'missing',
    };
  }

  /**
   * ⚠️ Gemini API 키 필수 검증
   */
  public async ensureGeminiApiKey(): Promise<boolean> {
    if (this.has('GEMINI_API_KEY')) {
      return true;
    }

    Logger.warn(COMPONENT, 'Gemini API key missing - setup required');
    
    // TODO: 설정 UI 표시
    // await this.showApiKeySetupDialog();
    
    return false;
  }
}

export const EnvironmentService = new EnvironmentServiceClass();
