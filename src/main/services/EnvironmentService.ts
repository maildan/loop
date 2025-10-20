/**
 * 🌍 Environment Service - Production 환경변수 관리
 * 
 * Purpose: Production 환경에서 환경변수를 안전하게 로드
 * - Dev: .env 파일 사용
 * - Production: OS Keychain (keychainAdapter) 사용
 */

import { Logger } from '../../shared/logger';
import { keychainAdapter } from '../utils/keychainAdapter';
import { app } from 'electron';
import { join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { parse } from 'dotenv';

const COMPONENT = 'ENV_SERVICE';

export interface EnvironmentConfig {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  GH_TOKEN?: string;
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
    Logger.info(COMPONENT, 'Initializing environment', { 
      isDev, 
      NODE_ENV: process.env.NODE_ENV,
      envKeysCount: Object.keys(process.env).length,
      hasGeminiInEnv: !!process.env.GEMINI_API_KEY,
    });

    if (isDev) {
      // Dev: .env 파일이 이미 로드됨 (main/index.ts의 dotenv/config)
      await this.loadFromProcessEnv();
      
      // 🔥 Dev 모드에서 Gemini API 키 검증
      if (!this.config.GEMINI_API_KEY) {
        Logger.warn(COMPONENT, '⚠️ GEMINI_API_KEY가 설정되지 않았습니다');
        Logger.warn(COMPONENT, '📝 개발 환경에서 Gemini 기능을 사용하려면:');
        Logger.warn(COMPONENT, '   1. .env.example을 참고하여 .env 파일 생성');
        Logger.warn(COMPONENT, '   2. https://aistudio.google.com/app/apikey 에서 API 키 발급');
        Logger.warn(COMPONENT, '   3. GEMINI_API_KEY=your-key-here 설정 후 앱 재시작');
        Logger.warn(COMPONENT, '');
        Logger.warn(COMPONENT, '📦 Production/CI 환경:');
        Logger.warn(COMPONENT, '   - GitHub Secrets에서 GEMINI_API_KEY 자동 주입됨');
        Logger.warn(COMPONENT, '   - vite 빌드 시점에 환경변수가 코드에 포함됨');
        Logger.warn(COMPONENT, '   - .env 파일은 번들에 포함되지 않음 (보안)');
        Logger.warn(COMPONENT, '');
        Logger.warn(COMPONENT, '� Packaged 상태에서는:');
        Logger.warn(COMPONENT, '   - 앱 상위 디렉토리, 프로젝트 루트, userData에서 .env를 찾아 로드');
        Logger.warn(COMPONENT, '');
        Logger.warn(COMPONENT, '�📖 자세한 정보는 docs/ENVIRONMENT_VARIABLES.md 참고');
      }
    } else {
      // Production: 먼저 process.env에서 시도 (Vite define 주입 또는 packaged .env)
      await this.loadFromProcessEnv();
      
      // 아직 로드되지 않았다면 Keychain 시도
      if (!this.config.GEMINI_API_KEY) {
        Logger.info(COMPONENT, 'GEMINI_API_KEY not found in process.env, trying Keychain...');
        await this.loadFromKeychain();
      }
    }

    this.loaded = true;
    Logger.info(COMPONENT, '✅ Environment initialized', {
      hasGeminiKey: Boolean(this.config.GEMINI_API_KEY),
      hasGoogleAuth: Boolean(this.config.GOOGLE_CLIENT_ID),
      environment: isDev ? 'development' : 'production'
    });
  }

  /**
   * 📁 process.env에서 로드 (Dev)
   * 🔥 Packaged 상태에서는 .env 파일을 명시적으로 재로드
   */
  private async loadFromProcessEnv(): Promise<void> {
    // 🔥 DEBUG: process.env 값 확인
    Logger.debug(COMPONENT, '📥 Loading environment variables from process.env', {
      NODE_ENV: process.env.NODE_ENV,
      GEMINI_API_KEY_exists: !!process.env.GEMINI_API_KEY,
      GEMINI_API_KEY_length: process.env.GEMINI_API_KEY?.length || 0,
      GEMINI_API_KEY_prefix: process.env.GEMINI_API_KEY ? `***${process.env.GEMINI_API_KEY.slice(-8)}` : '(empty)',
      GEMINI_MODEL: process.env.GEMINI_MODEL || '(not set)',
    });

    // 🔥 주의: process.env.GEMINI_API_KEY가 undefined인 경우 ''를 할당하면 안 됨!
    // 빈 string은 나중에 falsy 체크에서 문제를 일으킬 수 있음
    this.config = {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || undefined,
      GEMINI_MODEL: process.env.GEMINI_MODEL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      GH_TOKEN: process.env.GH_TOKEN || undefined,
    };

    Logger.debug(COMPONENT, '✅ After loadFromProcessEnv (before .env fallback)', {
      GEMINI_API_KEY_loaded: !!this.config.GEMINI_API_KEY,
      GEMINI_API_KEY_length: this.config.GEMINI_API_KEY ? this.config.GEMINI_API_KEY.length : 0,
      keysLoaded: Object.keys(this.config).filter(k => this.config[k as keyof EnvironmentConfig]).length
    });

    // 🔥 Packaged 상태에서 .env 파일이 process.env에 로드되지 않았다면, 명시적으로 찾아서 로드
    if (!this.config.GEMINI_API_KEY) {
      Logger.debug(COMPONENT, 'GEMINI_API_KEY not in process.env, searching for .env file');
      const envPath = this.findEnvFile();
      if (envPath) {
        try {
          const parsed = parse(readFileSync(envPath));
          Logger.debug(COMPONENT, '.env file parsed', {
            path: envPath,
            hasGeminiKey: !!parsed.GEMINI_API_KEY,
            geminiKeyPreview: parsed.GEMINI_API_KEY ? `***${parsed.GEMINI_API_KEY.slice(-8)}` : 'undefined',
          });
          
          // 🔥 .env 파일에서 로드된 값을 사용 (undefined 아닌 실제 값)
          this.config.GEMINI_API_KEY = parsed.GEMINI_API_KEY || undefined;
          this.config.GEMINI_MODEL = parsed.GEMINI_MODEL || this.config.GEMINI_MODEL;
          this.config.GOOGLE_CLIENT_ID = parsed.GOOGLE_CLIENT_ID || this.config.GOOGLE_CLIENT_ID;
          this.config.GOOGLE_CLIENT_SECRET = parsed.GOOGLE_CLIENT_SECRET || this.config.GOOGLE_CLIENT_SECRET;
          this.config.GOOGLE_REDIRECT_URI = parsed.GOOGLE_REDIRECT_URI || this.config.GOOGLE_REDIRECT_URI;
          this.config.GH_TOKEN = parsed.GH_TOKEN || this.config.GH_TOKEN;

          Logger.info(COMPONENT, '🔥 .env 파일을 명시적으로 로드 (Packaged 상태)', { 
            envPath,
            geminiKeyLoaded: !!this.config.GEMINI_API_KEY,
            geminiKeyLength: this.config.GEMINI_API_KEY ? this.config.GEMINI_API_KEY.length : 0,
          });
        } catch (error) {
          Logger.warn(COMPONENT, '.env 파일 로드 실패', { envPath, error });
        }
      } else {
        Logger.warn(COMPONENT, '.env 파일을 찾을 수 없음. 확인된 경로들을 참고하세요.');
      }
    }
  }

  /**
   * 🔍 Packaged 상태에서 .env 파일 찾기
   * 우선순위:
   * 1. app.getAppPath()의 상위 디렉토리 (asar 외부)
   * 2. process.cwd() (현재 작업 디렉토리)
   * 3. app.getPath('userData') (사용자 데이터 폴더)
   */
  private findEnvFile(): string | null {
    const candidates = [
      // asar 외부 .env (번들 직상위)
      join(app.getAppPath(), '..', '.env'),
      // 프로젝트 루트 .env
      join(process.cwd(), '.env'),
      // userData/.env (사용자 설정 폴더)
      join(app.getPath('userData'), '.env'),
    ];

    for (const candidate of candidates) {
      try {
        if (existsSync(candidate)) {
          const resolvedPath = resolve(candidate);
          Logger.debug(COMPONENT, '✓ .env 파일 발견', { path: resolvedPath });
          return resolvedPath;
        }
      } catch (error) {
        Logger.debug(COMPONENT, '.env 파일 확인 실패', { candidate, error });
      }
    }

    Logger.debug(COMPONENT, '.env 파일을 찾을 수 없음. 후보:', { candidates });
    return null;
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
      GEMINI_API_KEY: this.config.GEMINI_API_KEY && this.config.GEMINI_API_KEY.length > 0 ? 'set' : 'missing',
      GEMINI_MODEL: this.config.GEMINI_MODEL && this.config.GEMINI_MODEL.length > 0 ? 'set' : 'missing',
      GOOGLE_CLIENT_ID: this.config.GOOGLE_CLIENT_ID && this.config.GOOGLE_CLIENT_ID.length > 0 ? 'set' : 'missing',
      GOOGLE_CLIENT_SECRET: this.config.GOOGLE_CLIENT_SECRET && this.config.GOOGLE_CLIENT_SECRET.length > 0 ? 'set' : 'missing',
      GOOGLE_REDIRECT_URI: this.config.GOOGLE_REDIRECT_URI && this.config.GOOGLE_REDIRECT_URI.length > 0 ? 'set' : 'missing',
      GH_TOKEN: this.config.GH_TOKEN && this.config.GH_TOKEN.length > 0 ? 'set' : 'missing',
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
