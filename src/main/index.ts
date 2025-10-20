// 🔥 기가차드 Loop Main - 978줄을 50줄로 축소한 깔끔한 진입점

// 🔥 1단계: 환경변수 우선 로드 (DevMode)
import 'dotenv/config';

// 🔥 2단계: Packaged 상태에서 Runtime .env 재로드
// 빌드타임 define은 고정되므로, runtime에 명시적으로 .env를 다시 로드해야 함
const { parse } = require('dotenv');
const { existsSync, readFileSync } = require('fs');
const { join: pathJoin, resolve: pathResolve } = require('path');

function reloadEnvForPackaged(): void {
  // 현재 NODE_ENV 확인 (dev라면 스킵)
  const isDev = process.env.NODE_ENV === 'development';
  
  // .env 파일 찾기
  const candidates = [
    pathJoin(process.cwd(), '.env'),
    pathJoin(process.cwd(), '..', '.env'),
    pathJoin(__dirname, '..', '.env'),
    pathJoin(__dirname, '..', '..', '.env'),
  ];

  for (const candidate of candidates) {
    try {
      if (existsSync(candidate)) {
        const content = readFileSync(candidate, 'utf-8');
        const parsed = parse(content);
        
        // 🔥 buildtime define이 빈 값이면, runtime에서 .env로부터 로드
        if (!process.env.GEMINI_API_KEY && parsed.GEMINI_API_KEY) {
          Reflect.set(process.env as Record<string, unknown>, 'GEMINI_API_KEY', parsed.GEMINI_API_KEY);
          console.log('✅ [RUNTIME] GEMINI_API_KEY reloaded from', candidate);
        }
        if (!process.env.GEMINI_MODEL && parsed.GEMINI_MODEL) {
          Reflect.set(process.env as Record<string, unknown>, 'GEMINI_MODEL', parsed.GEMINI_MODEL);
        }
        if (!process.env.GOOGLE_CLIENT_ID && parsed.GOOGLE_CLIENT_ID) {
          Reflect.set(process.env as Record<string, unknown>, 'GOOGLE_CLIENT_ID', parsed.GOOGLE_CLIENT_ID);
        }
        if (!process.env.GOOGLE_CLIENT_SECRET && parsed.GOOGLE_CLIENT_SECRET) {
          Reflect.set(process.env as Record<string, unknown>, 'GOOGLE_CLIENT_SECRET', parsed.GOOGLE_CLIENT_SECRET);
        }
        if (!process.env.GOOGLE_REDIRECT_URI && parsed.GOOGLE_REDIRECT_URI) {
          Reflect.set(process.env as Record<string, unknown>, 'GOOGLE_REDIRECT_URI', parsed.GOOGLE_REDIRECT_URI);
        }
        break; // 첫 번째 발견된 .env만 사용
      }
    } catch (err) {
      // continue to next candidate
    }
  }
}

// Packaged 상태에서만 실행 (asar 체크)
const isPackaged = process.mainModule?.filename?.includes('asar') || 
                   __filename.includes('asar') ||
                   (process.env.NODE_ENV !== 'development');

if (isPackaged && process.env.NODE_ENV !== 'development') {
  reloadEnvForPackaged();
}

// 🔥 DEBUG: dotenv 로드 직후 환경변수 확인
if (process.env.GEMINI_API_KEY) {
  console.log('✅ [DOTENV] GEMINI_API_KEY loaded:', `***${process.env.GEMINI_API_KEY.slice(-8)}`);
} else {
  console.log('❌ [DOTENV] GEMINI_API_KEY is missing after dotenv/config import');
}
console.log('ℹ️  [DOTENV] NODE_ENV:', process.env.NODE_ENV);

import "./core/security"
import { app, protocol } from 'electron';
import { join } from 'path';
import { Logger } from '../shared/logger';
import { ApplicationBootstrapper } from './core/ApplicationBootstrapper';
import { performanceOptimizer } from './core/PerformanceOptimizer';
import { Platform } from './utils/platform';
import { APP_IDENTITY } from './constants';
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'loop-font',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true
    }
  }
]);


// 🔥 환경 변수는 위에서 이미 로드됨
// 🔥 환경변수 로깅(민감값 제외)
const safeEnv = {
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'set' : 'missing',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'missing',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'not set',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'set' : 'missing',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'not set',
};



Logger.info('ENV', 'Loaded environment variables', safeEnv);

// 🔥 앱 이름 설정 (package.json productName과 일치)
app.setName('Loop');
app.setAppUserModelId(APP_IDENTITY.USER_MODEL_ID); // Windows 작업 표시줄 아이콘 ID (constants에서 관리)
Logger.info('MAIN', '🔄 앱 이름 설정 완료', {
  name: app.getName(),
  appId: APP_IDENTITY.ID, // constants에서 관리
  appPath: app.getAppPath()
});

// 🔥 기가차드 하드웨어 극한 최적화 적용 (500-1000% 성능 향상)
performanceOptimizer.applyAllOptimizations();
performanceOptimizer.startPerformanceBenchmark();

// 🔥 플랫폼별 아이콘 설정 (dev/prod 안전 경로) - constants.ts와 일치
const isDev = process.env.NODE_ENV === 'development';
const assetsDir = isDev ? join(process.cwd(), 'public/assets') : join(process.resourcesPath, 'public/assets');
const iconPngPath = join(assetsDir, 'icon.png');
const iconIcoPath = join(assetsDir, 'icon.ico');
const iconIcnsPath = join(assetsDir, 'icon.icns');

// macOS Dock 아이콘 설정은 ApplicationBootstrapper에서 담당

// Windows 사용자 데이터 경로 정리
if (Platform.isWindows()) {
  try {
    app.setPath('userData', app.getPath('userData').replace('Electron', 'Loop'));
    Logger.info('MAIN', '🪟 Windows app data path set to Loop');
  } catch (error) {
    Logger.warn('MAIN', 'Failed to adjust Windows userData path', { error });
  }
}

/**
 * 🔥 Loop 메인 애플리케이션 클래스
 * 
 * 단일 책임: ApplicationBootstrapper를 통한 앱 시작만 담당
 * 978줄의 복잡한 로직을 5개 모듈로 분리하여 50줄로 축소
 */
class LoopMain {
  private bootstrapper: ApplicationBootstrapper;

  constructor() {
    this.bootstrapper = new ApplicationBootstrapper();
    Logger.info('MAIN', '🚀 Loop main application created');
  }

  /**
   * 🔥 애플리케이션 시작
   */
  public async start(): Promise<void> {
    try {
      Logger.info('MAIN', '🔥 Starting Loop Typing Analytics...');

      // ApplicationBootstrapper에 모든 로직 위임
      await this.bootstrapper.bootstrap();

      Logger.info('MAIN', '✅ Loop application started successfully');
    } catch (error) {
      Logger.error('MAIN', '💥 Failed to start Loop application', error);
      process.exit(1);
    }
  }
}

// 🔥 전역 에러 처리
process.on('uncaughtException', (error) => {
  Logger.error('MAIN', '💥 Uncaught exception', error);
  console.error('💥 UNCAUGHT EXCEPTION:', error);
  // 즉시 종료하지 말고 5초 대기 (로그 기록 시간 확보)
  setTimeout(() => process.exit(1), 5000);
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error('MAIN', '💥 Unhandled rejection', { reason, promise });
  console.error('💥 UNHANDLED REJECTION:', reason);
});

// 🔥 애플리케이션 시작
const loopMain = new LoopMain();
loopMain.start();

export default loopMain;
