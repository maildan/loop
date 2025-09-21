// 🔥 기가차드 Application Bootstrapper - 메인 오케스트레이터

import { app, protocol, net, BrowserWindow, nativeImage } from 'electron';
import { Logger } from '../../shared/logger';
import { ManagerCoordinator } from './ManagerCoordinator';
import { EventController } from './EventController';
import { SettingsWatcher } from './SettingsWatcher';
import { ShutdownManager } from './ShutdownManager';
import { unifiedPermissionManager } from '../utils/UnifiedPermissionManager';
// Register keychain IPC handlers
import { registerKeychainHandlers } from '../handlers/keychainIpcHandlers';
import registerNotificationHandlers from '../handlers/notificationIpcHandlers';
import { windowManager } from '../core/window';
// unifiedHandler 제거됨 - 모니터링 기능 불필요
import * as fs from 'fs';
import * as path from 'path';

// Helper: resolve + whitelist + containment checks to avoid path traversal
function resolveAndValidate(filePath: string | null, baseDir: string, allowedFilenames?: string[]): string | null {
  try {
    if (!filePath) return null;

    // 🔒 보안: 입력값 strict sanitization
    const sanitizedPath = filePath.replace(/[<>:"|?*\x00-\x1f]/g, '').trim();
    if (!sanitizedPath || sanitizedPath.includes('..') || sanitizedPath.startsWith('/') || sanitizedPath.startsWith('\\')) {
      return null;
    }

    // 🔒 보안: baseDir를 사전에 검증된 안전한 경로로 제한
    const safeBases = [
      app.getPath('userData'),
      app.getPath('temp'),
      process.resourcesPath || '',
      path.join(process.cwd(), 'assets')
    ].filter(Boolean);

    if (!safeBases.some(safe => baseDir.startsWith(safe))) {
      return null;
    }

    const resolvedCandidate = path.join(baseDir, sanitizedPath);

    // Ensure candidate is inside base directory (double check)
    if (!resolvedCandidate.startsWith(baseDir + path.sep) && resolvedCandidate !== baseDir) return null;

    // If a basename whitelist is provided, enforce it
    if (allowedFilenames && allowedFilenames.length > 0) {
      const basename = path.basename(resolvedCandidate);
      if (!allowedFilenames.includes(basename)) return null;
    }

    if (fs.existsSync(resolvedCandidate)) return resolvedCandidate;
    return null;
  } catch (e) {
    return null;
  }
}

// Helper: safely get file stats for validated paths
function getValidatedFileStats(validatedPath: string): { size: number } | null {
  try {
    return fs.statSync(validatedPath);
  } catch (e) {
    return null;
  }
}

/**
 * 🔥 ApplicationBootstrapper - 978줄을 50줄로 축소한 메인 오케스트레이터
 * 
 * 책임:
 * - 앱 부트스트래핑 프로세스 조정
 * - 기존 매니저들과 유틸리티들의 통합 관리
 * - 단계별 초기화 순서 보장
 */
export class ApplicationBootstrapper {
  private managerCoordinator: ManagerCoordinator;
  private eventController: EventController;
  private settingsWatcher: SettingsWatcher;
  private shutdownManager: ShutdownManager;
  private hasAccessibilityPermission = false;

  constructor() {
    // 🔥 의존성 주입으로 깔끔하게 구성
    this.managerCoordinator = new ManagerCoordinator();
    this.eventController = new EventController();
    this.settingsWatcher = new SettingsWatcher();
    this.shutdownManager = new ShutdownManager(this.managerCoordinator);

    Logger.info('BOOTSTRAPPER', '🚀 Application bootstrapper created');
  }

  /**
   * 🔥 메인 부트스트래핑 프로세스
   */
  public async bootstrap(): Promise<void> {
    try {
      Logger.info('BOOTSTRAPPER', 'Starting bootstrap process...');

      // 🔥 앱 이름 설정 (Electron → Loop)
      this.setupAppName();

      // 1. Electron 이벤트 설정
      this.setupElectronEvents();

      // 2. 프로토콜 기본 앱 설정 (OAuth 리다이렉트용)
      this.setupProtocolHandling();

      // 3. 앱 아이콘 설정
      this.setupAppIcons();

      // 3. 핵심 시스템 초기화 (Database, Settings)
      await this.initializeCore();

      // 4. 권한 체크 (1회만, UnifiedPermissionManager 활용)
      await this.checkPermissions();

      // 5. 매니저들 초기화 (CPU 부하 분산)
      await this.initializeManagers();

      // 6. 설정 감시 시작
      this.startWatchers();

      Logger.info('BOOTSTRAPPER', '✅ Bootstrap process completed successfully');

    } catch (error) {
      Logger.error('BOOTSTRAPPER', '💥 Bootstrap process failed', error);
      throw error;
    }
  }

  /**
   * 🔥 프로토콜 핸들링 설정 (OAuth 리다이렉트용)
   */
  private setupProtocolHandling(): void {
    try {
      // loop:// 프로토콜을 이 앱의 기본 핸들러로 설정
      if (!app.isDefaultProtocolClient('loop')) {
        const result = app.setAsDefaultProtocolClient('loop');
        Logger.info('BOOTSTRAPPER', '🔗 Protocol handler registration result', {
          protocol: 'loop',
          success: result
        });
      } else {
        Logger.info('BOOTSTRAPPER', '🔗 Already registered as default protocol handler for loop://');
      }

      // com.loop.app:// 프로토콜도 등록
      if (!app.isDefaultProtocolClient('com.loop.app')) {
        const result = app.setAsDefaultProtocolClient('com.loop.app');
        Logger.info('BOOTSTRAPPER', '🔗 Custom protocol handler registration result', {
          protocol: 'com.loop.app',
          success: result
        });
      } else {
        Logger.info('BOOTSTRAPPER', '🔗 Already registered as default protocol handler for com.loop.app://');
      }
    } catch (error) {
      Logger.error('BOOTSTRAPPER', 'Failed to setup protocol handling', error);
    }
  }

  /**
   * 🔥 커스텀 프로토콜 설정 (avatar 파일 안전 접근용 + OAuth 리다이렉트용)
   */
  private setupCustomProtocols(): void {
    const avatarsDir = path.join(app.getPath('userData'), 'avatars');
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }

    // loop-avatar:// 프로토콜 등록
    protocol.handle('loop-avatar', (request: Electron.ProtocolRequest) => {
      try {
        const requestedPath = request.url.slice('loop-avatar://'.length);

        // 🔒 보안: Path Traversal 방지를 위한 검증
        const safePath = resolveAndValidate(
          requestedPath,
          avatarsDir,
          undefined // 모든 파일명 허용하되 디렉토리 제한
        );

        if (!safePath) {
          Logger.warn('PROTOCOL_HANDLER', `Invalid avatar path requested: ${requestedPath}`);
          return new Response(null, { status: 403 });
        }

        return net.fetch(new URL(`file://${safePath}`).toString());
      } catch (error) {
        Logger.error('PROTOCOL_HANDLER', `Failed to fetch ${request.url}`, error);
        return new Response(null, { status: 404 });
      }
    });

    // 🔥 loop:// 프로토콜 등록 (OAuth 성공 리다이렉트용)
    protocol.handle('loop', (request: Electron.ProtocolRequest) => {
      const url = new URL(request.url);
      Logger.info('PROTOCOL_HANDLER', 'Loop app protocol invoked', {
        hostname: url.hostname,
        pathname: url.pathname
      });

      // OAuth 성공 콜백 처리
      if (url.hostname === 'oauth-success') {
        Logger.info('PROTOCOL_HANDLER', 'OAuth success protocol triggered - focusing main window');

        // 메인 윈도우 포커스
        try {
          if (windowManager && windowManager.focusMainWindow) {
            windowManager.focusMainWindow();
          }
        } catch (error) {
          Logger.error('PROTOCOL_HANDLER', 'Failed to focus main window', error);
        }

        return new Response('OK');
      }

      // 기본 응답
      return new Response('Loop app launched');
    });

    Logger.info('BOOTSTRAPPER', '🔒 Custom protocols registered (loop-avatar://, loop://)');
  }

  /**
   * 🔥 Electron 이벤트 설정 (EventController 활용)
   */
  private setupElectronEvents(): void {
    this.eventController.setupAppEvents({
      onReady: async () => {
        // 🔥 onReady 이벤트가 발생했으므로, 여기서 프로토콜을 등록합니다.
        this.setupCustomProtocols();
        // 그 다음에 윈도우를 생성하는 기존 로직을 실행합니다.
        await this.handleAppReady();
      },
      onShutdown: () => this.shutdownManager.shutdown(),
      onActivate: () => this.handleAppActivate(),
      onWindowAllClosed: () => this.handleWindowAllClosed()
    });

    Logger.info('BOOTSTRAPPER', 'Electron events configured');
  }

  /**
   * 🔥 핵심 시스템 초기화
   */
  private async initializeCore(): Promise<void> {
    await this.managerCoordinator.initializeCore();
    // Keychain IPC hooks (main process only)
    try {
      registerKeychainHandlers();
      Logger.info('BOOTSTRAPPER', 'Keychain IPC handlers registered');
    } catch (e) {
      Logger.warn('BOOTSTRAPPER', 'Failed to register keychain handlers', e);
    }
    try {
      registerNotificationHandlers();
      Logger.info('BOOTSTRAPPER', 'Notification IPC handlers registered');
    } catch (e) {
      Logger.warn('BOOTSTRAPPER', 'Failed to register notification handlers', e);
    }
    Logger.info('BOOTSTRAPPER', 'Core systems initialized');
  }

  /**
   * 🔥 권한 체크 (기존 UnifiedPermissionManager 활용)
   */
  private async checkPermissions(): Promise<void> {
    try {
      // 🔥 1회만 체크 (무인루프 완전 제거)
      this.hasAccessibilityPermission = await unifiedPermissionManager.checkAccessibilityPermission();
      this.managerCoordinator.setPermissionState(this.hasAccessibilityPermission);

      Logger.info('BOOTSTRAPPER', '🔐 Permissions checked', {
        hasAccessibility: this.hasAccessibilityPermission
      });
    } catch (error) {
      Logger.warn('BOOTSTRAPPER', 'Permission check failed, continuing without', error);
      this.hasAccessibilityPermission = false;
    }
  }

  /**
   * 🔥 매니저들 초기화 (ManagerCoordinator에 위임)
   */
  private async initializeManagers(): Promise<void> {
    await this.managerCoordinator.initializeAll();
    Logger.info('BOOTSTRAPPER', 'All managers initialized');
  }

  /**
   * 🔥 설정 감시 시작
   */
  private startWatchers(): void {
    this.settingsWatcher.startWatching();
    Logger.info('BOOTSTRAPPER', 'Settings watchers started');
  }

  /**
   * 🔥 앱 Ready 이벤트 핸들러
   */
  private async handleAppReady(): Promise<void> {
    try {
      // 기존 windowManager 활용 (중복 방지)
      const mainWindow = windowManager.createMainWindow('main');
      // 글로벌 참조 설정 (이벤트 포워딩 등 기존 코드 호환)
      (globalThis as unknown as { mainWindow?: typeof mainWindow }).mainWindow = mainWindow;
      // unifiedHandler 제거됨 - 모니터링 기능 불필요

      // 🔥 URL 로딩 추가 (빈 화면 문제 해결)
      await windowManager.loadUrl('main');

      Logger.info('BOOTSTRAPPER', '🪟 Main window created and URL loaded');
    } catch (error) {
      Logger.error('BOOTSTRAPPER', 'Failed to create main window', error);
      throw error;
    }
  }

  /**
   * 🔥 앱 Activate 이벤트 핸들러
   */
  private async handleAppActivate(): Promise<void> {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
      await this.handleAppReady();
    }
  }

  /**
   * 🔥 윈도우 모두 닫힘 이벤트 핸들러
   */
  private handleWindowAllClosed(): void {
    const { platform } = process;
    if (platform !== 'darwin') {
      this.shutdownManager.shutdown();
    }
  }

  /**
   * 🔥 권한 상태 조회
   */
  public hasPermissions(): boolean {
    return this.hasAccessibilityPermission;
  }

  /**
   * 🔥 앱 아이콘 설정 (플랫폼별)
   */
  private setupAppIcons(): void {
    try {
      // 🔥 개발 환경과 프로덕션 환경 구분
      const isDev = process.env.NODE_ENV === 'development';

      let iconsDir: string;
      if (isDev) {
        iconsDir = path.join(process.cwd(), 'public', 'assets');
      } else {
        iconsDir = path.join(process.resourcesPath, 'public', 'assets');
      }

      if (process.platform === 'darwin') {
        // 🔥 macOS - ICNS 파일 사용, 여러 후보 경로 시도
        const candidates = [
          path.join(iconsDir, 'icon.icns'),
          path.join(process.cwd(), 'public', 'assets', 'icon.icns'),
          path.join(process.cwd(), 'public', 'icon', 'app.icns'),
          path.join(__dirname, '..', '..', 'public', 'assets', 'icon.icns')
        ];

        let found: string | null = null;
        for (const iconPath of candidates) {
          try {
            const validatedPath = resolveAndValidate(iconPath, iconsDir, ['icon.icns', 'icon.png']);
            if (validatedPath) {
              found = validatedPath;
              break;
            }
          } catch (e) { /* continue */ }
        }

        if (found) {
          try {
            const stats = getValidatedFileStats(found);
            if (!stats || stats.size < 100) {
              Logger.warn('BOOTSTRAPPER', 'macOS icon file seems suspiciously small - using fallback', { icon: found, size: stats?.size || 0 });
              throw new Error('Icon file too small');
            }

            const icon = nativeImage.createFromPath(found);
            if (!icon || icon.isEmpty()) {
              Logger.warn('BOOTSTRAPPER', 'Native image created but is empty or invalid - falling back to PNG', { icon: found });
              throw new Error('Empty native image');
            }

            if (app.dock) {
              app.dock.setIcon(icon);
              Logger.info('BOOTSTRAPPER', '🍎 macOS app icon set', { iconPath: found });
            }
          } catch (iconError: any) {
            // fallback: try PNG icon
            try {
              const fallbackPngCandidate = resolveAndValidate(path.join(iconsDir, 'icon.png'), iconsDir, ['icon.png']);
              if (fallbackPngCandidate) {
                const fallbackImg = nativeImage.createFromPath(fallbackPngCandidate);
                if (fallbackImg && !fallbackImg.isEmpty() && app.dock) {
                  app.dock.setIcon(fallbackImg);
                  Logger.info('BOOTSTRAPPER', '🍎 Fallback PNG dock icon set', { icon: fallbackPngCandidate, reason: iconError.message });
                } else {
                  Logger.warn('BOOTSTRAPPER', 'Fallback PNG exists but failed to create image', { fallbackPng: fallbackPngCandidate });
                }
              } else {
                Logger.warn('BOOTSTRAPPER', 'No fallback PNG found for macOS dock icon', { iconsDir });
              }
            } catch (fallbackError: any) {
              Logger.warn('BOOTSTRAPPER', 'Failed to set macOS Dock icon (fallback also failed)', { error: fallbackError, original: iconError });
            }
          }
        } else {
          Logger.warn('BOOTSTRAPPER', 'No macOS icon file found in candidate paths', { candidates });
        }
      } else if (process.platform === 'win32') {
        // 🔥 Windows - ICO 파일 사용 (Electron 자동 처리)
        Logger.info('BOOTSTRAPPER', '🪟 Windows app icon will be set via electron-builder');
      }

    } catch (error) {
      Logger.error('BOOTSTRAPPER', 'Failed to setup app icons', error);
    }
  }

  /**
   * 🔥 앱 이름 설정 (Electron → Loop)
   */
  private setupAppName(): void {
    app.setName('Loop');
    app.setAppUserModelId('com.loop.app');
    Logger.info('BOOTSTRAPPER', 'App name set to Loop');
  }
}

export default ApplicationBootstrapper;
