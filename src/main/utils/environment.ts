// 🔥 기가차드 환경 감지 유틸리티

import { Logger } from '../../shared/logger';
import { Platform } from './platform';

// #DEBUG: Environment utils entry point
Logger.debug('ENVIRONMENT', 'Environment utility module loaded');

// 🔥 기가차드 환경 타입 정의
export interface EnvironmentInfo {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  isElectron: boolean;
  isPackaged: boolean;
  platform: NodeJS.Platform;
  arch: string;
  nodeVersion: string;
  electronVersion?: string;
  chromeVersion?: string;
  v8Version?: string;
}

// 🔥 기가차드 개발 환경 감지 클래스
export class EnvironmentDetector {
  private static instance: EnvironmentDetector | null = null;
  private environmentInfo: EnvironmentInfo;

  private constructor() {
    this.environmentInfo = this.detectEnvironment();
    Logger.info('ENVIRONMENT', 'Environment detected', this.environmentInfo);
  }
      
  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): EnvironmentDetector {
    if (!EnvironmentDetector.instance) {
      EnvironmentDetector.instance = new EnvironmentDetector();
    }
    return EnvironmentDetector.instance;
  }

  // 🔥 환경 정보 감지
  private detectEnvironment(): EnvironmentInfo {
    // #DEBUG: Detecting environment
    Logger.debug('ENVIRONMENT', 'Detecting current environment');

    const nodeEnv = process.env.NODE_ENV || 'development';
    
    return {
      isDevelopment: nodeEnv === 'development',
      isProduction: nodeEnv === 'production',
      isTest: nodeEnv === 'test',
      isElectron: typeof process !== 'undefined' && 'electron' in process.versions,
      isPackaged: process.env.NODE_ENV === 'production' || !process.env.ELECTRON_IS_DEV,
      platform: Platform.getCurrentPlatform(),
      arch: process.arch,
      nodeVersion: process.version,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      v8Version: process.versions.v8,
    };
  }

  // 🔥 환경 정보 가져오기
  public getEnvironmentInfo(): EnvironmentInfo {
    return { ...this.environmentInfo };
  }

  // 🔥 개발 환경 여부
  public isDevelopment(): boolean {
    return this.environmentInfo.isDevelopment;
  }

  // 🔥 프로덕션 환경 여부
  public isProduction(): boolean {
    return this.environmentInfo.isProduction;
  }

  // 🔥 테스트 환경 여부
  public isTest(): boolean {
    return this.environmentInfo.isTest;
  }

  // 🔥 Electron 환경 여부
  public isElectron(): boolean {
    return this.environmentInfo.isElectron;
  }

  // 🔥 패키지된 앱 여부
  public isPackaged(): boolean {
    return this.environmentInfo.isPackaged;
  }

  // 🔥 플랫폼 확인 (Platform 모듈 위임)
  public isPlatform(platform: NodeJS.Platform): boolean {
    return Platform.getCurrentPlatform() === platform;
  }

  // 🔥 macOS 여부 (Platform 모듈 위임)
  public isMacOS(): boolean {
    return Platform.isMacOS();
  }

  // 🔥 Windows 여부 (Platform 모듈 위임)
  public isWindows(): boolean {
    return Platform.isWindows();
  }

  // 🔥 Linux 여부 (Platform 모듈 위임)
  public isLinux(): boolean {
    return Platform.isLinux();
  }

  // 🔥 디버그 모드 여부
  public isDebugMode(): boolean {
    return this.isDevelopment() || process.env.DEBUG === 'true';
  }

  // 🔥 개발자 도구 사용 가능 여부
  public canUseDevTools(): boolean {
    return this.isDevelopment() || this.isTest();
  }

  // 🔥 환경 변수 가져오기 (안전)
  public getEnvVar(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
  }

  // 🔥 환경 유효성 검사
  public validateEnvironment(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Node.js 버전 확인
    const nodeVersion = process.version;
    const versionParts = nodeVersion.split('.');
    const majorVersionStr = versionParts[0] ? versionParts[0].substring(1) : '0';
    const majorVersion = parseInt(majorVersionStr);
    if (majorVersion < 16) {
      errors.push(`Node.js version ${nodeVersion} is too old. Minimum required: 16.x`);
    }

    // Electron 환경 확인
    if (!this.isElectron()) {
      errors.push('Not running in Electron environment');
    }

    // 필수 환경 변수 확인
    const requiredEnvVars = ['NODE_ENV'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // 🔥 성능 모니터링 설정
  public getPerformanceConfig(): {
    enableProfiling: boolean;
    enableTracing: boolean;
    maxMemoryUsage: number;
  } {
    return {
      enableProfiling: this.isDevelopment(),
      enableTracing: this.isDevelopment() || this.isTest(),
      maxMemoryUsage: this.isProduction() ? 512 : 1024, // MB
    };
  }

  // 🔥 로깅 설정
  public getLoggingConfig(): {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
    maxFiles: number;
  } {
    return {
      level: this.isDevelopment() ? 'debug' : 'info',
      enableConsole: !this.isProduction(),
      enableFile: true,
      maxFiles: this.isProduction() ? 10 : 5,
    };
  }
}

// 🔥 기가차드 전역 환경 감지기
export const environmentDetector = EnvironmentDetector.getInstance();

// #DEBUG: Environment utils exit point
Logger.debug('ENVIRONMENT', 'Environment utility module setup complete');

export default environmentDetector;
