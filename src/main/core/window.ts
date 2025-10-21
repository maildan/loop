// 🔥 기가차드 윈도우 매니저 - 타입 안전한 윈도우 관리 시스템

import { BrowserWindow, screen, Event, app } from 'electron';
import { join } from 'path';
import { Logger } from '../../shared/logger';
import { WindowInfo } from '../../shared/types';
import { isObject } from '../../shared/common';
import { Platform } from '../utils/platform';
import { StaticServer } from '../utils/StaticServer';
import { CSP } from './security'; // 🔥 보안 정책 import
import { DEV_TOOLS } from '../constants';
import { RenderProcessGoneDetails } from '../types/electron-events';


// #DEBUG: Window manager entry point
Logger.debug('WINDOW', 'Window manager module loaded');

// 🔥 기가차드 윈도우 설정 인터페이스
export interface WindowSettings {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  show: boolean;
  center: boolean;
  titleBarStyle: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';
}

// 🔥 기가차드 윈도우 매니저 클래스
export class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map();

  constructor() {
    // #DEBUG: Window manager initialized
    Logger.debug('WINDOW', 'Window manager initialized');
  }

  // 🔥 메인 윈도우 생성
  public createMainWindow(windowId: string = 'main'): BrowserWindow {
    try {
      // #DEBUG: Creating main window
      Logger.debug('WINDOW', 'Creating main window', { windowId });

      const { width, height } = screen.getPrimaryDisplay().workAreaSize;

      const settings: WindowSettings = {
        width: Math.min(1440, Math.floor(width * 0.8)),
        height: Math.min(900, Math.floor(height * 0.8)),
        minWidth: 800,
        minHeight: 600,
        show: false, // 🔥 성능 최적화: 준비될 때까지 숨김
        center: true,
        titleBarStyle: Platform.isMacOS() ? 'default' : 'default', // 🔥 메뉴바 표시 강제
      };

      const iconPath = this.getAppIcon();
      Logger.info('WINDOW', 'Creating window with icon', { iconPath });

      const window = new BrowserWindow({
        ...settings,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: false,
          preload: join(__dirname, '../preload/index.js'),
          webSecurity: true,
          allowRunningInsecureContent: false,
          experimentalFeatures: false,
          // 🔥 DevTools 설정: 항상 활성화하되 자동 오픈은 하지 않음.
          // 요청에 따라 단축키로만 열리게 허용 (사용자 요청)
          devTools: true,
        },
        icon: iconPath,
        // macOS 전용 설정
        ...(Platform.isMacOS() && {
          titleBarStyle: 'default',
          trafficLightPosition: { x: 20, y: 20 },
          transparent: false,
          vibrancy: undefined,
          autoHideMenuBar: false,
        }),
        // Windows/Linux 설정
        ...((Platform.isWindows() || Platform.isLinux()) ? {
          autoHideMenuBar: true, // Windows/Linux에서 메뉴바 자동 숨김
          frame: true // 표준 창 프레임 사용
        } : {}),
        title: 'Loop',
        show: false, // 준비될 때까지 숨김
        backgroundColor: '#ffffff', // 배경색 설정으로 깜빡임 방지
      });

      // 보안 설정
      this.setupWindowSecurity(window);

      // CSP 설정 (Electron 38 권장 방식)
      this.setupCSPHeaders(window);

      // 윈도우 이벤트 설정
      this.setupWindowEvents(window, windowId);

      // 🔥 메뉴 단축키 활성화 (Cmd+C, Cmd+V 등)
      window.webContents.on('before-input-event', (event, input) => {
        // Ctrl/Cmd가 눌렸을 때만 메뉴 단축키 허용
        window.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta);
      });

      // 윈도우 맵에 추가
      this.windows.set(windowId, window);

      Logger.info('WINDOW', 'Main window created successfully', {
        windowId,
        settings
      });

      return window;

    } catch (error) {
      Logger.error('WINDOW', 'Failed to create main window', error);
      throw error;
    }
  }

  // 🔥 윈도우 보안 설정
  private setupWindowSecurity(window: BrowserWindow): void {
    // #DEBUG: Setting up window security
    Logger.debug('WINDOW', 'Setting up window security');

    // 새 윈도우 생성 차단
    window.webContents.setWindowOpenHandler(() => {
      Logger.warn('WINDOW', 'Blocked window open attempt');
      return { action: 'deny' };
    });

    // 네비게이션 보안
    window.webContents.on('will-navigate', (event, navigationUrl) => {
      const allowedOrigins = [
        'http://localhost',
        'https://localhost',
        'file://'
      ];

      const isAllowed = allowedOrigins.some(origin =>
        navigationUrl.startsWith(origin)
      );

      if (!isAllowed) {
        event.preventDefault();
        Logger.warn('WINDOW', 'Blocked navigation attempt', {
          url: navigationUrl
        });
      }
    });

    // 외부 링크 차단 (최신 Electron API 사용)
    window.webContents.on('will-redirect', (event, navigationUrl) => {
      const allowedOrigins = [
        'http://localhost',
        'https://localhost',
        'https://accounts.google.com',
        'https://oauth2.googleapis.com',
        'file://'
      ];

      const isAllowed = allowedOrigins.some(origin =>
        navigationUrl.startsWith(origin)
      );

      if (!isAllowed) {
        event.preventDefault();
        Logger.warn('WINDOW', 'Blocked redirect attempt', {
          url: navigationUrl
        });
      }
    });
  }

  // 🔥 CSP 헤더는 StaticServer에서 처리 (중복 방지)
  private setupCSPHeaders(window: BrowserWindow): void {
    Logger.debug('WINDOW', 'CSP headers will be handled by StaticServer to avoid duplication');
    // CSP는 src/main/utils/static-server/headers.ts에서 설정됨
  }

  // 🔥 윈도우 이벤트 설정
  private setupWindowEvents(window: BrowserWindow, windowId: string): void {
    // #DEBUG: Setting up window events
    Logger.debug('WINDOW', 'Setting up window events', { windowId });

    // 🔥 성능 최적화: 윈도우가 준비되면 표시
    window.once('ready-to-show', () => {
      window.show();
      Logger.info('WINDOW', 'Window shown', { windowId });
    });

    // 🔥 렌더러 프로세스 크래시 감지 (Electron 38+에서는 render-process-gone 사용)
    window.webContents.on('render-process-gone', (_event: Event, details: RenderProcessGoneDetails) => {
      Logger.error('WINDOW', `Renderer process gone: ${details.reason}`, {
        windowId,
        exitCode: details.exitCode,
        reason: details.reason
      });
      // 여기에 추가적인 크래시 처리 로직 (예: 재시작) 추가 가능
    });

    window.on('closed', () => {
      this.windows.delete(windowId);
      Logger.info('WINDOW', 'Window closed and removed', { windowId });
    });

    window.on('focus', () => {
      Logger.debug('WINDOW', 'Window focused', { windowId });
    });

    window.on('blur', () => {
      Logger.debug('WINDOW', 'Window blurred', { windowId });
    });

    window.on('maximize', () => {
      Logger.debug('WINDOW', 'Window maximized', { windowId });
    });

    window.on('minimize', () => {
      Logger.debug('WINDOW', 'Window minimized', { windowId });
    });
  }

  // 🔥 앱 아이콘 경로 가져오기 (Platform 모듈 사용)
  private getAppIcon(): string | undefined {
    // #DEBUG: Getting app icon
    try {
      const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
      const isPackagedProd = app.isPackaged;
      const isUnpackagedProd = !app.isPackaged && process.env.NODE_ENV === 'production';

      let iconsDir: string;
      if (isDev) {
        // 개발 환경: 프로젝트 루트의 public/assets 폴더
        iconsDir = join(process.cwd(), 'public', 'assets');
      } else if (isPackagedProd) {
        // 패키지된 프로덕션 환경: 패키지된 앱의 public/assets 폴더
        iconsDir = join(__dirname, '../../../public/assets');
      } else if (isUnpackagedProd) {
        // 패키지되지 않은 프로덕션 환경 (pnpm start): 프로젝트 루트의 public/assets 폴더
        iconsDir = join(process.cwd(), 'public', 'assets');
      } else {
        // 기본값
        iconsDir = join(process.cwd(), 'public', 'assets');
      }

      if (Platform.isWindows()) {
        const iconPath = join(iconsDir, 'icon.ico');
        Logger.info('WINDOW', '🪟 Using Windows icon', { iconPath });
        return iconPath;
      } else if (Platform.isMacOS()) {
        const iconPath = join(iconsDir, 'icon.icns');
        Logger.info('WINDOW', '🍎 Using macOS icon', { iconPath });
        return iconPath;
      } else {
        const iconPath = join(iconsDir, 'icon.png');
        Logger.info('WINDOW', '🐧 Using Linux icon', { iconPath });
        return iconPath;
      }
    } catch (error) {
      Logger.warn('WINDOW', 'Could not find app icon', error);
      return undefined;
    }
  }

  // 🔥 윈도우 URL 로드 - 하이브리드 접근 방식
  public async loadUrl(windowId: string, url?: string): Promise<void> {
    try {
      // #DEBUG: Loading URL
      const window = this.windows.get(windowId);
      if (!window) {
        throw new Error(`Window ${windowId} not found`);
      }

      let targetUrl: string;

      if (url) {
        targetUrl = url;
      } else if (process.env.NODE_ENV === 'production' || app.isPackaged) {
        // 🔥 프로덕션 환경: 정적 빌드 파일 사용
        // - app.isPackaged: 패키지된 앱 (electron-builder로 빌드된 .app, .exe 등)
        // - NODE_ENV=production: 패키지되지 않았지만 프로덕션 모드 (pnpm start)
        const staticServer = StaticServer.getInstance();
        const isHealthy = await staticServer.checkHealth();

        if (isHealthy) {
          targetUrl = staticServer.getMainUrl();
          Logger.info('WINDOW', '🚀 프로덕션 모드 - 정적 파일 사용', { 
            url: targetUrl, 
            isPackaged: app.isPackaged,
            nodeEnv: process.env.NODE_ENV
          });
        } else {
          Logger.error('WINDOW', '❌ StaticServer health check failed - trying direct file load');
          // Fallback: asar 내부 파일 직접 로드
          const rendererPath = join(__dirname, '..', 'renderer', 'index.html');
          try {
            await window.loadFile(rendererPath);
            Logger.info('WINDOW', '✅ Fallback: loaded renderer via loadFile', { rendererPath });
            return; // 성공하면 여기서 종료
          } catch (fallbackError) {
            Logger.error('WINDOW', '💥 Fallback loadFile failed', { fallbackError, rendererPath });
            throw new Error('❌ 정적 파일을 찾을 수 없습니다. 먼저 빌드를 실행하세요.');
          }
        }
      } else {
        // 🔥 개발 환경: electron-vite 개발 서버 사용
        // - !app.isPackaged && NODE_ENV !== 'production'
        const rendererUrl = process.env.ELECTRON_RENDERER_URL || process.env.VITE_DEV_SERVER_URL;
        if (rendererUrl && rendererUrl.startsWith('http')) {
          targetUrl = rendererUrl;
        } else if (rendererUrl) {
          targetUrl = `http://localhost:${rendererUrl}`;
        } else {
          // 환경 변수가 없으면 기본 포트 5173 사용 (electron-vite 기본값)
          targetUrl = 'http://localhost:5173';
        }
        Logger.info('WINDOW', '🔧 개발 모드 - electron-vite 개발 서버 연결 시도', { 
          url: targetUrl,
          electronRendererUrl: process.env.ELECTRON_RENDERER_URL,
          viteUrl: process.env.VITE_DEV_SERVER_URL,
          isPackaged: app.isPackaged,
          nodeEnv: process.env.NODE_ENV,
          tip: 'Vite 서버가 실행 중인지 확인하세요 (pnpm dev)'
        });
      }

      try {
        await window.loadURL(targetUrl);
        Logger.info('WINDOW', 'URL loaded successfully', { windowId, url: targetUrl });
      } catch (error) {
        Logger.error('WINDOW', 'Failed to load URL', { error, targetUrl });
        
        // 개발 환경에서 연결 실패 시 개발 서버를 기다림
        if (!app.isPackaged && process.env.NODE_ENV !== 'production') {
          Logger.info('WINDOW', '개발 서버 연결 대기 중... 5초 후 재시도');
          setTimeout(async () => {
            try {
              await window.loadURL(targetUrl);
              Logger.info('WINDOW', '재시도 성공', { url: targetUrl });
            } catch (retryError) {
              Logger.error('WINDOW', '재시도 실패', { retryError });
              // 앱 종료하지 않고 빈 페이지 표시
              await window.loadURL('data:text/html,<h1>개발 서버를 시작하고 새로고침하세요</h1>');
            }
          }, 5000);
        } else {
          // 프로덕션에서도 fallback 시도
          Logger.warn('WINDOW', '🔄 Production loadURL failed - trying loadFile fallback');
          const rendererPath = join(__dirname, '..', 'renderer', 'index.html');
          try {
            await window.loadFile(rendererPath);
            Logger.info('WINDOW', '✅ Fallback success via loadFile', { rendererPath });
          } catch (fallbackError) {
            Logger.error('WINDOW', '💥 All load methods failed', { originalError: error, fallbackError });
            throw error;
          }
        }
      }

      // 🔥 개발 도구 - DevTools 자동 열기 완전 비활성화
      // DevTools는 수동으로만 열도록 설정 (사용자 경험 개선)
      Logger.debug('WINDOW', 'DevTools auto-open disabled for better UX');

      // 콘솔 메시지 로깅
      window.webContents.on('console-message', (event, level, message, line, sourceId) => {
        Logger.info('RENDERER_CONSOLE', `[${level}] ${message}`, { line, sourceId });
      });

      // 🔥 file:// 프로토콜에서 보안 설정 완화
      if (process.env.NODE_ENV === 'production') {
        window.webContents.session.webRequest.onBeforeRequest((details, callback) => {
          // 정적 파일 요청은 모두 허용
          callback({});
        });
      }

      Logger.info('WINDOW', 'URL loaded successfully', {
        windowId,
        url: targetUrl
      });

    } catch (error) {
      Logger.error('WINDOW', 'Failed to load URL', error);
      throw error;
    }
  }

  // 🔥 윈도우 가져오기
  public getWindow(windowId: string): BrowserWindow | undefined {
    return this.windows.get(windowId);
  }

  // 🔥 모든 윈도우 가져오기
  public getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  // 🔥 메인 윈도우 포커스 (OAuth 성공 시 사용)
  public focusMainWindow(): void {
    try {
      const mainWindow = this.getWindow('main');
      if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
        mainWindow.show();
        Logger.info('WINDOW', 'Main window focused and brought to front');
      } else {
        Logger.warn('WINDOW', 'Main window not found or destroyed, cannot focus');
      }
    } catch (error) {
      Logger.error('WINDOW', 'Failed to focus main window', error);
    }
  }

  // 🔥 윈도우 닫기
  public closeWindow(windowId: string): boolean {
    try {
      const window = this.windows.get(windowId);
      if (window && !window.isDestroyed()) {
        window.close();
        Logger.info('WINDOW', 'Window closed', { windowId });
        return true;
      }
      return false;
    } catch (error) {
      Logger.error('WINDOW', 'Failed to close window', error);
      return false;
    }
  }

  // 🔥 모든 윈도우 닫기
  public closeAllWindows(): void {
    try {
      // #DEBUG: Closing all windows
      Logger.debug('WINDOW', 'Closing all windows');

      this.windows.forEach((window, windowId) => {
        if (!window.isDestroyed()) {
          window.close();
        }
      });

      this.windows.clear();
      Logger.info('WINDOW', 'All windows closed');

    } catch (error) {
      Logger.error('WINDOW', 'Failed to close all windows', error);
    }
  }

  // 🔥 활성 윈도우 정보 가져오기
  public getActiveWindowInfo(): WindowInfo | null {
    try {
      // #DEBUG: Getting active window info
      const focusedWindow = BrowserWindow.getFocusedWindow();

      if (!focusedWindow) {
        return null;
      }

      const bounds = focusedWindow.getBounds();
      const windowInfo: WindowInfo = {
        id: focusedWindow.id,
        title: focusedWindow.getTitle(),
        owner: {
          name: 'Loop',
          processId: process.pid,
          bundleId: Platform.isMacOS() ? 'com.loop.app' : undefined,
          path: process.execPath,
        },
        bounds: {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        },
        memoryUsage: process.memoryUsage().heapUsed,
        loopTimestamp: Date.now(),
        loopAppCategory: 'productivity',
      };

      Logger.debug('WINDOW', 'Active window info retrieved', windowInfo);
      return windowInfo;

    } catch (error) {
      Logger.error('WINDOW', 'Failed to get active window info', error);
      return null;
    }
  }

  // 🔥 윈도우 목록 가져오기
  public getWindowList(): WindowInfo[] {
    try {
      // #DEBUG: Getting window list
      const windowList: WindowInfo[] = [];

      this.windows.forEach((window, windowId) => {
        if (!window.isDestroyed()) {
          const bounds = window.getBounds();
          windowList.push({
            id: window.id,
            title: window.getTitle(),
            owner: {
              name: `Loop Window (${windowId})`,
              processId: process.pid,
              bundleId: Platform.isMacOS() ? 'com.loop.app' : undefined,
              path: process.execPath,
            },
            bounds: {
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height,
            },
            memoryUsage: process.memoryUsage().heapUsed,
            loopTimestamp: Date.now(),
            loopAppCategory: 'productivity',
          });
        }
      });

      Logger.debug('WINDOW', 'Window list retrieved', {
        count: windowList.length
      });

      return windowList;

    } catch (error) {
      Logger.error('WINDOW', 'Failed to get window list', error);
      return [];
    }
  }
}

// 🔥 기가차드 싱글톤 윈도우 매니저
export const windowManager = new WindowManager();

// #DEBUG: Window manager module exit point
Logger.debug('WINDOW', 'Window manager module setup complete');

export default windowManager;
