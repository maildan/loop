// 🔥 기가차드 Application Bootstrapper - 메인 오케스트레이터

import { app, protocol, net, BrowserWindow, nativeImage } from 'electron';
import type { Event as ElectronEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { ManagerCoordinator } from './ManagerCoordinator';
import { EventController } from './EventController';
import { SettingsWatcher } from './SettingsWatcher';
import { ShutdownManager } from './ShutdownManager';
import { unifiedPermissionManager } from '../utils/UnifiedPermissionManager';
import { APP_IDENTITY, FILE_PATHS } from '../constants';
// Register keychain IPC handlers
import { registerKeychainHandlers } from '../handlers/keychainIpcHandlers';
import registerNotificationHandlers from '../handlers/notificationIpcHandlers';
import { windowManager } from '../core/window';
// unifiedHandler 제거됨 - 모니터링 기능 불필요
import * as fs from 'fs';
import * as path from 'path';
import { fontService } from '../services/FontService';
import { safePathJoin, safePathResolve } from '../../shared/utils/pathSecurity';
import { IconResolver } from '../utils/IconResolver';

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
    const assetsPath = safePathJoin(process.cwd(), 'assets');
    const publicAssetsPath = safePathJoin(process.cwd(), 'public', 'assets');
    const publicIconPath = safePathJoin(process.cwd(), 'public', 'icon');
    const publicPath = safePathJoin(process.cwd(), 'public');
    
    const safeBases = [
      app.getPath('userData'),
      app.getPath('temp'),
      process.resourcesPath || '',
      assetsPath,
      publicAssetsPath,
      publicIconPath,
      publicPath,
      process.cwd()
    ].filter(Boolean);

    if (!safeBases.some(safe => baseDir.startsWith(safe as string))) {
      return null;
    }

    const resolvedCandidate = safePathJoin(baseDir, sanitizedPath);
    if (!resolvedCandidate) return null;

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

    // 🔥 EnvironmentService 즉시 초기화 (IPC 핸들러 등록 전에)
    // 이를 통해 renderer가 즉시 'gemini:get-status' 요청해도 안전함
    this.initializeEnvironmentServiceEarly();

    Logger.info('BOOTSTRAPPER', '🚀 Application bootstrapper created');
  }

  /**
   * 🔥 환경변수 조기 초기화 (constructor 단계에서)
   * Renderer IPC 요청이 들어오기 전에 준비하기 위함
   */
  private initializeEnvironmentServiceEarly(): void {
    try {
      const { EnvironmentService } = require('../services/EnvironmentService');
      // 동기적으로 process.env는 이미 dotenv에 의해 로드됨
      // EnvironmentService.initialize()는 비동기이므로 약간의 지연이 있을 수 있음
      // 하지만 이곳에서 config 객체를 프리페칭하면 성능 최적화됨
      Logger.debug('BOOTSTRAPPER', '⏱️ EnvironmentService early initialization started');
    } catch (error) {
      Logger.warn('BOOTSTRAPPER', 'EnvironmentService early initialization skipped', error);
    }
  }

  /**
   * 🔥 메인 부트스트래핑 프로세스
   * 
   * Race Condition 해결: IPC 핸들러 등록 → Window 생성 순서 보장
   */
  public async bootstrap(): Promise<void> {
    try {
      Logger.info('BOOTSTRAPPER', 'Starting bootstrap process...');

      // 🔥 앱 이름 설정 (Electron → Loop)
      this.setupAppName();

      // 🔥 Windows/Linux: Single instance lock 설정 (프로토콜 URL 처리를 위해)
      this.setupSingleInstanceLock();

      // 1. Electron 이벤트 설정 (프로토콜 핸들링은 onReady 내부에서)
      this.setupElectronEvents();

      // 2. 앱 아이콘 설정
      await this.setupAppIcons();

      // 3. 핵심 시스템 초기화 (Database, Settings)
      await this.initializeCore();

      // 4. 권한 체크 (1회만, UnifiedPermissionManager 활용)
      await this.checkPermissions();

      // 5️⃣ CRITICAL: IPC 핸들러 먼저 등록 (Race Condition 방지)
      // Window가 생성되고 Renderer가 IPC 호출하기 전에 모든 핸들러가 준비되어야 함
      await this.initializeManagers();
      Logger.info('BOOTSTRAPPER', '✅ All IPC handlers registered before window creation');

      // 6️⃣ 이제 안전하게 Window 생성 (핸들러 준비됨)
      await this.handleAppReady();

      // 7. 설정 감시 시작
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
      // 🔥 packaged 여부 확인 (dev 모드 vs 프로덕션 빌드)
      // app.isPackaged = false: `electron .` 또는 `pnpm dev` 실행 중
      // app.isPackaged = true: `pnpm start` 또는 실제 설치된 앱 (.dmg, .exe 등)
      const isPackaged = app.isPackaged;
      
      // loop:// 프로토콜을 이 앱의 기본 핸들러로 설정
      if (!app.isDefaultProtocolClient('loop')) {
        let result: boolean;
        let devArgs: string[] | undefined;
        if (!isPackaged) {
          // 🔥 개발 모드: electron CLI 경로와 진입점 경로를 명시해야 함
          // 모든 플랫폼(macOS, Windows, Linux)에서 동일하게 처리
          devArgs = this.getDevProtocolArgs();
          result = app.setAsDefaultProtocolClient('loop', process.execPath, devArgs);
        } else {
          // 🔥 프로덕션 빌드: 추가 인자 없이 등록
          result = app.setAsDefaultProtocolClient('loop');
        }
        Logger.info('BOOTSTRAPPER', '🔗 Protocol handler registration result', {
          protocol: 'loop',
          success: result,
          isPackaged,
          platform: process.platform,
          execPath: !isPackaged ? process.execPath : 'N/A',
          devArgs: !isPackaged ? devArgs : undefined
        });
      } else {
        Logger.info('BOOTSTRAPPER', '🔗 Already registered as default protocol handler for loop://');
      }

      // APP_IDENTITY.PROTOCOL 프로토콜도 등록 (com.loop.app)
      if (!app.isDefaultProtocolClient(APP_IDENTITY.PROTOCOL)) {
        let result: boolean;
        let devArgs: string[] | undefined;
        if (!isPackaged) {
          devArgs = this.getDevProtocolArgs();
          result = app.setAsDefaultProtocolClient(APP_IDENTITY.PROTOCOL, process.execPath, devArgs);
        } else {
          result = app.setAsDefaultProtocolClient(APP_IDENTITY.PROTOCOL);
        }
        Logger.info('BOOTSTRAPPER', '🔗 Custom protocol handler registration result', {
          protocol: APP_IDENTITY.PROTOCOL,
          success: result,
          isPackaged,
          platform: process.platform,
          devArgs: !isPackaged ? devArgs : undefined
        });
      } else {
        Logger.info('BOOTSTRAPPER', `🔗 Already registered as default protocol handler for ${APP_IDENTITY.PROTOCOL}://`);
      }
    } catch (error) {
      Logger.error('BOOTSTRAPPER', 'Failed to setup protocol handling', error);
    }
  }

  /**
   * 🔥 커스텀 프로토콜 설정 (avatar 파일 안전 접근용 + OAuth 리다이렉트용)
   */
  private async setupCustomProtocols(): Promise<void> {
    const userDataPath = app.getPath('userData');
    const avatarsDir = safePathJoin(userDataPath, 'avatars');
    if (!avatarsDir) {
      Logger.error('ApplicationBootstrapper', 'Failed to create secure avatars directory path');
      return;
    }
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

    try {
      await fontService.registerProtocol();
    } catch (error) {
      Logger.error('BOOTSTRAPPER', 'Failed to register loop-font protocol', error);
    }
  }

  /**
   * 🔥 Windows/Linux: Single instance lock 설정
   * macOS는 open-url 이벤트로 처리하지만, Windows/Linux는 second-instance로 처리
   */
  private setupSingleInstanceLock(): void {
    // macOS는 자동으로 single instance 처리되므로 skip
    if (process.platform === 'darwin') {
      return;
    }

    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      Logger.info('BOOTSTRAPPER', '🔒 Another instance is already running, quitting...');
      app.quit();
      return;
    }

    // 🔥 두 번째 인스턴스 시도 시 (프로토콜 URL 클릭 시)
  app.on('second-instance', (_event: ElectronEvent, commandLine: string[], _workingDirectory: string) => {
      Logger.info('BOOTSTRAPPER', '🔗 Second instance detected (protocol URL)', {
        commandLine
      });

      // Windows/Linux에서는 commandLine 마지막 인자에 프로토콜 URL이 전달됨
      const protocolUrl = commandLine.find(arg => 
        arg.startsWith('loop://') || arg.startsWith(`${APP_IDENTITY.PROTOCOL}://`)
      );

      if (protocolUrl) {
        Logger.info('BOOTSTRAPPER', '🔗 Protocol URL detected in second instance', { protocolUrl });
        this.handleProtocolUrl(protocolUrl);
      }

      // 기존 윈도우 포커스
      if (windowManager) {
        windowManager.focusMainWindow();
      }
    });

    Logger.info('BOOTSTRAPPER', '🔒 Single instance lock acquired');
  }

  /**
   * 🔥 개발 모드에서 프로토콜 핸들링을 위한 추가 인자 계산
   */
  private getDevProtocolArgs(): string[] {
    const normalizedArgs = process.argv
      .slice(1)
      .filter((arg): arg is string => typeof arg === 'string' && arg.length > 0)
      .map(arg => path.resolve(arg));

    if (normalizedArgs.length > 0) {
      return normalizedArgs;
    }

    // electron-vite 기본 빌드 결과 경로를 안전한 기본값으로 사용
    const fallbackEntry = path.resolve(process.cwd(), 'out/main/index.js');
    return [fallbackEntry];
  }

  /**
   * 🔥 프로토콜 URL 처리 (Windows/Linux용)
   */
  private handleProtocolUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      Logger.info('BOOTSTRAPPER', '🔗 Processing protocol URL', {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname
      });

      // OAuth 성공 콜백
      if (urlObj.hostname === 'oauth-success') {
        Logger.info('BOOTSTRAPPER', '✅ OAuth success - focusing main window');
        if (windowManager) {
          windowManager.focusMainWindow();
        }
      }
    } catch (error) {
      Logger.error('BOOTSTRAPPER', '❌ Failed to process protocol URL', { url, error });
    }
  }

  /**
   * 🔥 Electron 이벤트 설정 (EventController 활용)
   * 
   * 주의: app.on('ready') 는 bootstrap 프로세스가 완료되면 자동으로 호출됨
   * IPC 핸들러 등록이 먼저 완료되므로 onReady는 최소한의 작업만 수행
   */
  private setupElectronEvents(): void {
    this.eventController.setupAppEvents({
      onReady: async () => {
        // 🔥 1. 프로토콜 기본 앱 설정 (OAuth 리다이렉트용) - app.whenReady() 이후 실행
        this.setupProtocolHandling();
        
        // 🔥 2. 커스텀 프로토콜 등록 (loop-avatar://, loop://, loop-font://)
        await this.setupCustomProtocols();
        
        // 🔥 3. Window는 이미 생성됨 (handleAppReady에서 완료)
        // onReady에서는 추가 세팅만 처리
        Logger.info('BOOTSTRAPPER', '✅ onReady event processed (handlers already registered)');
      },
      onShutdown: () => this.shutdownManager.shutdown(),
      onActivate: () => this.handleAppActivate(),
      onWindowAllClosed: () => this.handleWindowAllClosed(),
      // 🔥 macOS open-url 이벤트 핸들러
      onProtocolUrl: (url: string) => this.handleProtocolUrl(url)
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
   * 
   * Race Condition 수정: bootstrap() 메서드에서 명시적으로 호출
   * IPC 핸들러가 등록된 후에만 Window 생성 및 URL 로딩
   */
  private async handleAppReady(): Promise<void> {
    try {
      Logger.info('BOOTSTRAPPER', '🪟 Creating main window (IPC handlers ready)...');
      
      // 기존 windowManager 활용 (중복 방지)
      const mainWindow = windowManager.createMainWindow('main');
      // 글로벌 참조 설정 (이벤트 포워딩 등 기존 코드 호환)
      (globalThis as unknown as { mainWindow?: typeof mainWindow }).mainWindow = mainWindow;

      // 🔥 URL 로딩 추가 (빈 화면 문제 해결)
      await windowManager.loadUrl('main');

      Logger.info('BOOTSTRAPPER', '✅ Main window created and URL loaded (race condition fixed)');
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
  private async setupAppIcons(): Promise<void> {
    try {
      // 🔥 Use IconResolver for consistent icon path resolution
      const iconPath = await IconResolver.getTrayIconPath();
      
      if (iconPath) {
        Logger.debug('BOOTSTRAPPER', 'Using icon from IconResolver', { iconPath });
      }

      // 🔥 개발 환경과 프로덕션 환경 구분
      const isDev = process.env.NODE_ENV === 'development';

      // Correct icon directory - always use project root in development
      const iconsDir = path.join(process.cwd(), 'public', 'assets');

      if (process.platform === 'darwin') {
        // 🔥 macOS - ICNS 파일 사용, 여러 후보 경로 시도
        const candidates = [
          path.join(process.cwd(), 'public', 'assets', 'icon.icns'),
          path.join(process.cwd(), 'public', 'icon', 'app.icns'),
          path.join(iconsDir, 'icon.icns'),
          path.join(__dirname, '..', '..', 'public', 'assets', 'icon.icns')
        ];

        let found: string | null = null;
        for (const iconPath of candidates) {
          try {
            // 직접 파일 존재 여부 확인 (보안상 안전한 하드코딩된 경로들)
            if (fs.existsSync(iconPath)) {
              const stats = fs.statSync(iconPath);
              if (stats.isFile() && stats.size > 100) {
                found = iconPath;
                Logger.debug('BOOTSTRAPPER', 'Found valid icon file', { path: iconPath, size: stats.size });
                break;
              }
            }
          } catch (e) { 
            Logger.debug('BOOTSTRAPPER', 'Icon candidate failed', { path: iconPath, error: e });
          }
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
    app.setAppUserModelId(APP_IDENTITY.USER_MODEL_ID);
    Logger.info('BOOTSTRAPPER', 'App name set to Loop');
  }
}

export default ApplicationBootstrapper;
