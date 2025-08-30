// 🔥 기가차드 Event Controller - Electron 이벤트 전담 처리 (타입 안전)

import { app, BrowserWindow, Event, WebContents, Certificate } from 'electron';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';

/**
 * 🔥 이벤트 핸들러 인터페이스
 */
export interface EventHandlers {
  onReady: () => Promise<void>;
  onShutdown: () => Promise<void>;
  onActivate: () => Promise<void>;
  onWindowAllClosed: () => void;
}

/**
 * 🔥 EventController - Electron 이벤트만 전담 처리 (타입 안전)
 * 
 * 책임:
 * - Electron 앱 이벤트 관리
 * - 플랫폼별 이벤트 처리
 * - 보안 이벤트 감시
 * - 이벤트 핸들러 등록/해제
 */
export class EventController {
  private readonly componentName = 'EVENT_CONTROLLER';
  private isSetup = false;

  constructor() {
    Logger.info(this.componentName, '🎮 Event controller created');
  }

  /**
   * 🔥 모든 앱 이벤트 설정 (타입 안전)
   */
  public setupAppEvents(handlers: EventHandlers): void {
    if (this.isSetup) {
      Logger.warn(this.componentName, 'Events already setup, skipping');
      return;
    }

    try {
      this.setupMainEvents(handlers);
      this.setupSecurityEvents();
      this.setupPlatformSpecificEvents(handlers);
      this.setupPerformanceEvents();
      
      this.isSetup = true;
      Logger.info(this.componentName, '✅ All app events configured');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to setup events', error);
      throw error;
    }
  }

  /**
   * 🔥 메인 앱 이벤트 설정
   */
  private setupMainEvents(handlers: EventHandlers): void {
    // 앱 준비 완료
    app.whenReady().then(async () => {
      try {
        Logger.info(this.componentName, '🚀 App ready event triggered');
        await handlers.onReady();
        Logger.info(this.componentName, '✅ App ready handler completed');
      } catch (error) {
        Logger.error(this.componentName, '💥 App ready handler failed', error);
        app.quit();
      }
    });

    // 모든 윈도우 닫힘
    app.on('window-all-closed', () => {
      Logger.debug(this.componentName, '🪟 All windows closed');
      handlers.onWindowAllClosed();
    });

    // 앱 활성화
    app.on('activate', async () => {
      Logger.debug(this.componentName, '🔄 App activated');
      try {
        await handlers.onActivate();
      } catch (error) {
        Logger.error(this.componentName, 'Activate handler failed', error);
      }
    });

    // 앱 종료 전 (타입 안전)
    app.on('before-quit', (event: Event) => {
      Logger.debug(this.componentName, '🛑 App before quit');
      event.preventDefault();
      
      // 비동기 종료 처리
      handlers.onShutdown().catch(error => {
        Logger.error(this.componentName, 'Shutdown handler failed', error);
        app.exit(1);
      });
    });

    // SSL 인증서 에러 처리 (타입 안전)
    app.on('certificate-error' as any, (
      event: Event, 
      webContents: WebContents, 
      url: string, 
      error: Error, 
      certificate: Certificate, 
      callback: (isTrusted: boolean) => void
    ) => {
      Logger.warn(this.componentName, 'Certificate error', { url, error: error.message });
      
      // 개발 환경에서는 localhost 허용
      if (process.env.NODE_ENV === 'development' && url.includes('localhost')) {
        event.preventDefault();
        callback(true);
      } else {
        callback(false); // 보안상 거부
      }
    });

    Logger.debug(this.componentName, 'Main events configured');
  }

  /**
   * 🔥 보안 이벤트 설정 (타입 안전)
   */
  private setupSecurityEvents(): void {
    // 새 웹 컨텐츠 생성 감시 (타입 안전)
    app.on('web-contents-created', (_: Event, contents: WebContents) => {
      Logger.debug(this.componentName, '🔒 Web contents created with security protection');
      
      // 새 윈도우 시도 차단 (타입 안전)
      contents.setWindowOpenHandler(({ url }: { url: string }) => {
        Logger.warn(this.componentName, '🚫 Blocked window open attempt', { url });
        return { action: 'deny' as const };
      });

      // 네비게이션 차단 (타입 안전)
      contents.on('will-navigate', (event: Event, navigationUrl: string) => {
        if (!navigationUrl.startsWith('http://localhost') && 
            !navigationUrl.startsWith('https://localhost') &&
            !navigationUrl.startsWith('file://')) {
          Logger.warn(this.componentName, '🚫 Blocked navigation attempt', { url: navigationUrl });
          event.preventDefault();
        }
      });
    });

    Logger.debug(this.componentName, 'Security events configured');
  }

  /**
   * 🔥 플랫폼별 이벤트 설정 (타입 안전)
   */
  private setupPlatformSpecificEvents(handlers: EventHandlers): void {
    if (Platform.isMacOS()) {
      // macOS 파일 열기 (타입 안전)
      app.on('open-file', (event: Event, path: string) => {
        event.preventDefault();
        Logger.info(this.componentName, '📂 File open requested', { path });
      });

      // macOS URL 열기 (타입 안전)
      app.on('open-url', (event: Event, url: string) => {
        event.preventDefault();
        Logger.info(this.componentName, '🔗 URL open requested', { url });
      });
    }

    Logger.debug(this.componentName, `Platform-specific events configured for ${process.platform}`);
  }

  /**
   * 🔥 성능 최적화 이벤트 설정 (타입 안전)
   */
  private setupPerformanceEvents(): void {
    // GPU 프로세스 크래시 처리 (타입 안전)
    app.on('gpu-process-crashed', (event: Event, killed: boolean) => {
      Logger.error(this.componentName, '💥 GPU process crashed', { killed });
      
      if (!killed) {
        app.disableHardwareAcceleration();
        Logger.info(this.componentName, '🔧 Hardware acceleration disabled');
      }
    });

    // 자식 프로세스 종료 처리 (타입 안전)
    app.on('child-process-gone', (event: Event, details: { type: string; reason: string; exitCode: number }) => {
      Logger.warn(this.componentName, '⚠️ Child process gone', details);
      
      if (details.reason === 'oom-killed') {
        Logger.error(this.componentName, '💾 Process killed due to out of memory');
        this.triggerMemoryCleanup();
      }
    });

    // 렌더러 프로세스 크래시 처리 (타입 안전)
    app.on('render-process-gone', (event: Event, webContents: WebContents, details: { reason: string; exitCode: number }) => {
      Logger.error(this.componentName, '🖥️ Render process gone', details);
      
      if (details.reason === 'crashed' && !webContents.isDestroyed()) {
        Logger.info(this.componentName, '🔄 Attempting to reload crashed renderer');
        webContents.reload();
      }
    });

    // 브라우저 윈도우 생성 최적화 (타입 안전)
    app.on('browser-window-created', (event: Event, window: BrowserWindow) => {
      Logger.debug(this.componentName, '🪟 Browser window created');
      this.optimizeWindowPerformance(window);
    });

    Logger.debug(this.componentName, 'Performance events configured');
  }

  /**
   * 🔥 윈도우 성능 최적화
   */
  private optimizeWindowPerformance(window: BrowserWindow): void {
    try {
      // 개발 모드가 아닐 때만 최적화 적용
      if (process.env.NODE_ENV !== 'development') {
        // 백그라운드 스로틀링 설정
        window.webContents.setBackgroundThrottling(true);
      }

      // 줌 레벨 고정 (성능 최적화)
      window.webContents.setZoomFactor(1.0);
      
      Logger.debug(this.componentName, '⚡ Window performance optimized');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to optimize window performance', error);
    }
  }

  /**
   * 🔥 메모리 정리 트리거
   */
  private triggerMemoryCleanup(): void {
    try {
      // 가비지 컬렉션 강제 실행
      if (global.gc) {
        global.gc();
      }
      
      // 모든 윈도우의 메모리 정리
      BrowserWindow.getAllWindows().forEach(window => {
        if (!window.isDestroyed()) {
          window.webContents.session.clearCache();
        }
      });
      
      Logger.info(this.componentName, '🧹 Memory cleanup triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Memory cleanup failed', error);
    }
  }

  /**
   * 🔥 이벤트 설정 상태 확인
   */
  public isEventsSetup(): boolean {
    return this.isSetup;
  }

  /**
   * 🔥 정리 (필요시)
   */
  public cleanup(): void {
    this.isSetup = false;
    Logger.info(this.componentName, '🧹 Event controller cleaned up');
  }
}
