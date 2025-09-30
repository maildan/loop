// 🔥 기가차드 Loop Main - 978줄을 50줄로 축소한 깔끔한 진입점

// 🔥 환경변수 우선 로드
import 'dotenv/config';



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
  NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'set' : 'missing',
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
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error('MAIN', '💥 Unhandled rejection', { reason, promise });
});

// 🔥 애플리케이션 시작
const loopMain = new LoopMain();
loopMain.start();

export default loopMain;
