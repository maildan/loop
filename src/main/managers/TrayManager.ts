// 🔥 기가차드 시스템 트레이 관리자

import { Tray, Menu, MenuItem, MenuItemConstructorOptions, nativeImage, BrowserWindow, app } from 'electron';
import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import { getSettingsManager } from '../settings';
import type { SettingsChangeEvent, UISettingsSchema, AppSettingsSchema, KeyboardSettingsSchema, NotificationSettingsSchema } from '../settings/types';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { FILE_PATHS } from '../constants';
import { safePathResolve, validatePathSafety } from '../../shared/utils/pathSecurity';

// Helper: resolve + whitelist + containment checks to avoid path traversal
// 🔥 ASYNC: fs.existsSync → fsPromises.access for non-blocking I/O
async function resolveAndValidate(filePath: string | null, iconsDir: string, allowedFilenames?: string[]): Promise<string | null> {
  try {
    if (!filePath) return null;
  const resolvedCandidate = safePathResolve(iconsDir, filePath);
    if (!resolvedCandidate) return null;
    
    const resolvedIconsDir = path.normalize(path.resolve(iconsDir));

    // Ensure candidate is inside icons directory (already validated by safePathResolve)
    if (!validatePathSafety(resolvedCandidate, resolvedIconsDir)) return null;

    // If a basename whitelist is provided, enforce it
    if (allowedFilenames && allowedFilenames.length > 0) {
      const basename = path.basename(resolvedCandidate);
      if (!allowedFilenames.includes(basename)) return null;
    }

    // 🔥 SECURITY FIX: Async file existence check (eliminates Semgrep warning)
    try {
      await fsPromises.access(resolvedCandidate);
      return resolvedCandidate;
    } catch {
      return null;
    }
  } catch (e) {
    return null;
  }
}

// Helper: safely read file content for validated paths
// 🔥 ASYNC: fs.readFileSync → fsPromises.readFile for non-blocking I/O
async function readValidatedFile(validatedPath: string): Promise<string | null> {
  try {
    return await fsPromises.readFile(validatedPath, 'utf-8');
  } catch (e) {
    return null;
  }
}

/**
 * 🔥 기가차드 트레이 매니저
 * 시스템 트레이 아이콘, 컨텍스트 메뉴, 상태 표시 관리
 * 🔥 REFACTORED: Removed keyboard monitoring features (not applicable for writer app)
 */
export class TrayManager extends BaseManager {
  private readonly componentName = 'TRAY_MANAGER';
  private tray: Tray | null = null;
  private settingsUnwatchers: Array<() => void> = [];

  constructor() {
    super({
      name: 'TrayManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000
    });
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing system tray');

    try {
      // 플랫폼별 트레이 지원 확인
      if (!Platform.supportsSystemTray()) {
        Logger.warn(this.componentName, 'System tray not supported on this platform');
        return;
      }

      await this.createTrayIcon();
      await this.createTrayMenu();
      this.setupTrayEventHandlers();
      this.setupSettingsWatchers();

      Logger.info(this.componentName, 'System tray initialized successfully');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to initialize system tray', error);
      throw error;
    }
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting tray manager');

    if (this.tray) {
      this.updateTrayStatus();
      this.updateTrayTooltip();
    }
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping tray manager');
    // 트레이는 유지하되 상태만 업데이트
    if (this.tray) {
      this.updateTrayStatus();
    }
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up tray manager');

    // 설정 감시자 정리
    this.cleanupSettingsWatchers();

    if (this.tray && !this.tray.isDestroyed()) {
      this.tray.destroy();
      this.tray = null;
    }
  }

  /**
   * 🔥 트레이 아이콘 생성
   * 🔥 ASYNC: All path validation and icon loading now use async I/O
   */
  private async createTrayIcon(): Promise<void> {
    try {
      // 🔥 플랫폼별 기본 아이콘 생성
      let defaultIcon: Electron.NativeImage;

      // 플랫폼별 아이콘 경로 얻기
      const isDev = process.env.NODE_ENV === 'development';
      const iconsDir = isDev ? path.join(process.cwd(), 'public', 'icon') : path.join(process.resourcesPath, 'public', 'icon');
      const iconPath = await this.getTrayIconPath();

      const validatedIconPath = await resolveAndValidate(iconPath, iconsDir);
      if (validatedIconPath) {
        // 파일이 실제로 존재하는 경우에만 아이콘 생성
        Logger.info(this.componentName, '✅ Using tray icon from verified path', { iconPath: validatedIconPath });

        try {
          defaultIcon = nativeImage.createFromPath(validatedIconPath);

          // 아이콘이 비어있는지 추가 검증
          if (defaultIcon.isEmpty()) {
            Logger.warn(this.componentName, '⚠️ Icon is empty despite file existing, using fallback');

            // 대체 아이콘: 앱 기본 아이콘 사용
            const appIconPath = await resolveAndValidate(path.join(process.cwd(), 'assets', 'icon.png'), iconsDir);
            if (appIconPath) {
              defaultIcon = nativeImage.createFromPath(appIconPath);
            } else {
              // 그래도 없으면 빈 아이콘 생성
              defaultIcon = nativeImage.createEmpty();
            }
          }
        } catch (iconError) {
          Logger.error(this.componentName, '❌ Failed to create icon despite file check', { iconPath: validatedIconPath, error: iconError });
          // 빈 아이콘으로 대체
          defaultIcon = nativeImage.createEmpty();
        }
      } else {
        // 아이콘 경로가 없거나 파일이 존재하지 않는 경우 기본 아이콘 사용
        Logger.warn(this.componentName, '⚠️ Icon file not found, using fallback icon', { iconPath });

        // 앱 기본 아이콘 시도
        const appIconPath = await resolveAndValidate(path.join(process.cwd(), 'assets', 'icon.png'), iconsDir);
        if (appIconPath) {
          defaultIcon = nativeImage.createFromPath(appIconPath);
        } else {
          // 그래도 없으면 빈 아이콘 생성
          defaultIcon = nativeImage.createEmpty();
        }
      }

      // macOS 템플릿 이미지 설정
      if (Platform.isMacOS()) {
        Logger.info(this.componentName, '🍎 Creating macOS template image');

        // 템플릿 모드 설정 (다크/라이트 모드 자동 변경)
        defaultIcon.setTemplateImage(true);
        this.tray = new Tray(defaultIcon);

        // Retina 디스플레이 지원 시도
        if (iconPath) {
          // icon_16x16.png -> icon_16x16@2x.png
          // Retina variant: look next to validated icon or inside iconsDir
          try {
            let retinaCandidate: string | null = null;
            if (validatedIconPath) {
              const candidate = path.join(path.dirname(validatedIconPath), 'icon_16x16@2x.png');
              retinaCandidate = await resolveAndValidate(candidate, iconsDir);
            }
            if (!retinaCandidate) {
              retinaCandidate = await resolveAndValidate(path.join(iconsDir, 'icon.iconset', 'icon_16x16@2x.png'), iconsDir);
            }
            if (retinaCandidate) {
              const retinaIcon = nativeImage.createFromPath(retinaCandidate);
              retinaIcon.setTemplateImage(true);
              this.tray.setImage(retinaIcon);
              Logger.info(this.componentName, '✨ macOS Retina image applied successfully', { retinaIconPath: retinaCandidate });
            }
          } catch (error) {
            // 무시 - 기본 아이콘을 계속 사용
            Logger.debug(this.componentName, 'Retina image application failed, using standard resolution');
          }
        }
      } else {
        // Windows/Linux용 기본 아이콘 설정
        this.tray = new Tray(defaultIcon);
      }

      Logger.info(this.componentName, 'Tray icon created successfully', {
        iconPath,
        platform: process.platform,
        isEmpty: defaultIcon.isEmpty()
      });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to create tray icon', error);
      throw error;
    }
  }

  /**
   * 🔥 최근 프로젝트 조회 (최대 5개)
   */
  private async getRecentProjects(): Promise<Array<{ id: string; title: string }>> {
    try {
      const mainWindow = this.getMainWindow();
      if (!mainWindow) return [];

      // IPC를 통해 프로젝트 목록 가져오기
      const response = await mainWindow.webContents.executeJavaScript(`
        window.electronAPI?.projects?.getAll()
          .then(res => res.success ? res.data : [])
          .catch(() => [])
      `);

      if (!Array.isArray(response)) return [];

      // 최근 수정 순으로 정렬하여 상위 5개 반환
      return response
        .sort((a: any, b: any) => {
          const dateA = new Date(a.lastModified || a.updatedAt || 0).getTime();
          const dateB = new Date(b.lastModified || b.updatedAt || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5)
        .map((p: any) => ({ id: p.id, title: p.title }));
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get recent projects', error);
      return [];
    }
  }

  /**
   * 🔥 트레이 메뉴 생성
   * 🔥 REFACTORED: Removed keyboard monitoring, added project management
   */
  private async createTrayMenu(): Promise<void> {
    if (!this.tray) return;

    // 최근 프로젝트 가져오기
    const recentProjects = await this.getRecentProjects();

    const template: MenuItemConstructorOptions[] = [
      {
        label: '📊 Dashboard',
        click: () => this.showMainWindow()
      },
      { type: 'separator' },
      {
        label: '📝 새 프로젝트',
        click: () => this.createNewProject()
      },
      {
        label: '� 최근 프로젝트',
        submenu: recentProjects.length > 0 
          ? recentProjects.map(p => ({
              label: p.title,
              click: () => this.openProject(p.id)
            }))
          : [{ label: '프로젝트 없음', enabled: false }]
      },
      { type: 'separator' },
      {
        label: '⚙️ 설정',
        click: () => this.openSettings()
      },
      {
        label: '🔄 새로고침',
        click: () => this.reloadApp(),
        visible: process.env.NODE_ENV === 'development'
      },
      { type: 'separator' },
      {
        label: '❌ 종료',
        click: () => this.quitApp()
      }
    ];

    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);

    Logger.debug(this.componentName, 'Tray context menu created with recent projects');
  }

  /**
   * 🔥 새 프로젝트 생성
   */
  private createNewProject(): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('tray-action', {
          action: 'new-project',
          timestamp: Date.now()
        });
        this.showMainWindow();
      }

      Logger.info(this.componentName, 'New project requested from tray');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to create new project', error);
    }
  }

  /**
   * 🔥 프로젝트 열기
   */
  private openProject(projectId: string): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('tray-action', {
          action: 'open-project',
          projectId,
          timestamp: Date.now()
        });
        this.showMainWindow();
      }

      Logger.info(this.componentName, 'Project open requested from tray', { projectId });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to open project', error);
    }
  }

  /**
   * 🔥 트레이 이벤트 핸들러 설정
   */
  private setupTrayEventHandlers(): void {
    if (!this.tray) return;

    // 트레이 아이콘 클릭 (좌클릭)
    this.tray.on('click', () => {
      Logger.debug(this.componentName, 'Tray icon clicked');
      this.showMainWindow();
    });

    // 트레이 아이콘 더블클릭
    this.tray.on('double-click', () => {
      Logger.debug(this.componentName, 'Tray icon double-clicked');
      this.showMainWindow();
    });

    // 트레이 아이콘 우클릭 (Windows에서는 자동으로 컨텍스트 메뉴 표시)
    this.tray.on('right-click', () => {
      Logger.debug(this.componentName, 'Tray icon right-clicked');
      // Windows에서는 자동으로 처리됨
    });

    Logger.debug(this.componentName, 'Tray event handlers setup complete');
  }

  /**
   * 🔥 설정 변경 감시자 설정
   */
  private setupSettingsWatchers(): void {
    try {
      const settingsManager = getSettingsManager();

      // 🎨 UI 설정 변경 감지 (테마, 색상 등)
      const uiUnwatcher = settingsManager.watch('ui', (event) => {
        Logger.debug(this.componentName, 'UI settings changed', {
          key: event.key,
          newValue: event.newValue
        });
        this.updateTrayStatus();
      });

      // 🏠 앱 설정 변경 감지 (트레이 표시 등)
      const appUnwatcher = settingsManager.watch('app', (event) => {
        Logger.debug(this.componentName, 'App settings changed', {
          key: event.key,
          minimizeToTray: event.newValue?.minimizeToTray
        });

        // 트레이 표시/숨기기 설정이 변경되면 자동으로 토글
        if (event.oldValue?.minimizeToTray !== event.newValue?.minimizeToTray) {
          this.toggleTrayVisibility();
        }
      });

      // unwatcher 함수들 저장
      this.settingsUnwatchers = [uiUnwatcher, appUnwatcher];

      Logger.debug(this.componentName, 'Settings watchers setup complete');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to setup settings watchers', error);
    }
  }

  /**
   * 🔥 설정 감시자 정리
   */
  private cleanupSettingsWatchers(): void {
    try {
      // 모든 설정 감시자 해제
      this.settingsUnwatchers.forEach(unwatcher => {
        if (typeof unwatcher === 'function') {
          unwatcher();
        }
      });

      this.settingsUnwatchers = [];
      Logger.debug(this.componentName, 'Settings watchers cleaned up');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to cleanup settings watchers', error);
    }
  }

  /**
   * 🔥 플랫폼별 트레이 아이콘 경로 반환
   * 🔥 ASYNC: All file operations now use fsPromises for non-blocking I/O
   */
  private async getTrayIconPath(): Promise<string | null> {
    try {
      // 🔥 개발 환경과 프로덕션 환경 구분
      const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
      const isPackagedProd = app.isPackaged;
      const isUnpackagedProd = !app.isPackaged && process.env.NODE_ENV === 'production';

      let iconsDir: string;
      if (isDev) {
        // 개발 환경: 프로젝트 루트의 public/assets 폴더
        iconsDir = path.join(process.cwd(), 'public', 'assets');
      } else if (isPackagedProd) {
        // 패키지된 프로덕션 환경: 패키지된 앱의 public/assets 폴더
        iconsDir = path.join(process.resourcesPath, 'public', 'assets');
      } else if (isUnpackagedProd) {
        // 패키지되지 않은 프로덕션 환경 (pnpm start): 프로젝트 루트의 public/assets 폴더
        iconsDir = path.join(process.cwd(), 'public', 'assets');
      } else {
        // 기본값
        iconsDir = path.join(process.cwd(), 'public', 'assets');
      }

      Logger.info(this.componentName, '🔄 Resolving tray icon path', {
        iconsDir,
        isDev,
        platform: process.platform
      });

      if (Platform.isMacOS()) {
        // 🔥 macOS - icon_16x16.png (메뉴바에 최적화된 사이즈)
        // In production, prefer an explicit manifest file that lists allowed icon paths.
        if (!isDev) {
          const manifestPath = await resolveAndValidate(path.join(iconsDir, 'icon-manifest.json'), iconsDir);
          try {
            if (manifestPath) {
              const raw = await readValidatedFile(manifestPath);
              if (!raw) throw new Error('Failed to read manifest file');
              const manifest = JSON.parse(raw) as Record<string, string[]>;
              const candidates = manifest.mac || manifest.default || [];
              for (const rel of candidates) {
                const candidate = await resolveAndValidate(path.join(iconsDir, rel), iconsDir);
                if (candidate) return candidate;
              }
            }
          } catch (e) {
            Logger.warn(this.componentName, 'Failed to read icon manifest, falling back to default checks', e);
          }
        }

        // public/assets 폴더에 있는 실제 파일들 사용
        const candidates = [
          'icon.icns',                    // 기본 macOS 아이콘 (가장 안정적)
          'icon.iconset/icon_16x16.png',  // 메뉴바용 PNG 아이콘
          'icon_128x128.icns',            // Retina 메뉴바 아이콘
          'icon.png',                     // PNG 아이콘
          'icon/icon.png'                 // icon 폴더 안의 PNG
        ];

        for (const candidate of candidates) {
          const iconPath = await resolveAndValidate(path.join(iconsDir, candidate), iconsDir);
          if (iconPath) {
            Logger.info(this.componentName, '🍎 macOS tray icon found', { iconPath });
            return iconPath;
          }
        }

        Logger.warn(this.componentName, '⚠️ macOS icon not found, using null');
        return null;
      } else if (Platform.isWindows()) {
        // Windows - ICO 파일
        if (!isDev) {
          const manifestPath = await resolveAndValidate(path.join(iconsDir, 'icon-manifest.json'), iconsDir);
          try {
            if (manifestPath) {
              const raw = await readValidatedFile(manifestPath);
              if (!raw) throw new Error('Failed to read manifest file');
              const manifest = JSON.parse(raw) as Record<string, string[]>;
              const candidates = manifest.windows || manifest.default || [];
              for (const rel of candidates) {
                const candidate = await resolveAndValidate(path.join(iconsDir, rel), iconsDir);
                if (candidate) return candidate;
              }
            }
          } catch (e) {
            Logger.warn(this.componentName, 'Failed to read icon manifest, falling back to default checks', e);
          }
        }

        // public/icon 폴더에 있는 실제 Windows ICO 파일들 사용
        const windowsCandidates = [
          'tray.ico',      // 전용 트레이 아이콘
          'app.ico',       // 앱 아이콘
          'tray.png'       // PNG 백업
        ];

        for (const candidate of windowsCandidates) {
          const iconPath = await resolveAndValidate(path.join(iconsDir, candidate), iconsDir);
          if (iconPath) {
            Logger.info(this.componentName, '🪟 Windows tray icon found', { iconPath });
            return iconPath;
          }
        }

        Logger.warn(this.componentName, '⚠️ Windows icon not found, using null');
        return null;
      } else if (Platform.isLinux()) {
        // Linux - PNG 파일
        if (!isDev) {
          const manifestPath = await resolveAndValidate(path.join(iconsDir, 'icon-manifest.json'), iconsDir);
          try {
            if (manifestPath) {
              const raw = await readValidatedFile(manifestPath);
              if (!raw) throw new Error('Failed to read manifest file');
              const manifest = JSON.parse(raw) as Record<string, string[]>;
              const candidates = manifest.linux || manifest.default || [];
              for (const rel of candidates) {
                const candidate = await resolveAndValidate(path.join(iconsDir, rel), iconsDir);
                if (candidate) return candidate;
              }
            }
          } catch (e) {
            Logger.warn(this.componentName, 'Failed to read icon manifest, falling back to default checks', e);
          }
        }

        const iconPathCandidateLinux = await resolveAndValidate(path.join(iconsDir, 'icon.png'), iconsDir);
        if (iconPathCandidateLinux) {
          Logger.info(this.componentName, '🐧 Linux tray icon path resolved', { iconPath: iconPathCandidateLinux });
          return iconPathCandidateLinux;
        }

        Logger.warn(this.componentName, '⚠️ Linux icon not found, using null');
        return null;
      }

      return null;
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get tray icon path', error);
      return null;
    }
  }

  /**
   * 🔥 트레이 상태 업데이트
   * 🔥 ASYNC: Icon and menu updates now use async operations
   */
  public async updateTrayStatus(): Promise<void> {
    if (!this.tray) return;

    try {
      // 상태에 따른 아이콘 업데이트
      await this.updateTrayIcon();
      this.updateTrayTooltip();
      await this.createTrayMenu(); // 메뉴 업데이트

      Logger.debug(this.componentName, 'Tray status updated');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to update tray status', error);
    }
  }

  /**
   * 🔥 트레이 아이콘 업데이트 (상태별)
   * 🔥 ASYNC: Icon path resolution now uses async I/O
   * 🔥 NULL SAFE: Guards against race conditions during async operations
   */
  private async updateTrayIcon(): Promise<void> {
    if (!this.tray) return;

    try {
      // 기본 아이콘 경로 (항상 동일)
      const iconPath = await this.getTrayIconPath();
      
      // 🔥 NULL GUARD: Tray may be destroyed during async operation
      if (!this.tray) {
        Logger.warn(this.componentName, 'Tray destroyed during icon path resolution');
        return;
      }
      
      if (!iconPath) {
        Logger.warn(this.componentName, 'Icon path not available for update');
        return;
      }

      // 아이콘 이미지 생성
      const icon = nativeImage.createFromPath(iconPath);
      
      // 🔥 NULL GUARD: Check again before accessing tray
      if (!this.tray) {
        Logger.warn(this.componentName, 'Tray destroyed during icon creation');
        return;
      }
      
      if (icon.isEmpty()) {
        Logger.warn(this.componentName, 'Failed to create icon for update', { iconPath });
        return;
      }

      // macOS에서는 템플릿 이미지 설정
      if (Platform.isMacOS()) {
        const templateIcon = nativeImage.createFromPath(iconPath);
        templateIcon.setTemplateImage(true);
        
        // 🔥 NULL GUARD: Final check before setImage
        if (!this.tray) {
          Logger.warn(this.componentName, 'Tray destroyed before setting macOS template icon');
          return;
        }
        
        this.tray.setImage(templateIcon);
        Logger.debug(this.componentName, 'macOS template icon updated', { iconPath });
      } else {
        // 🔥 NULL GUARD: Final check before setImage
        if (!this.tray) {
          Logger.warn(this.componentName, 'Tray destroyed before setting standard icon');
          return;
        }
        
        this.tray.setImage(icon);
        Logger.debug(this.componentName, 'Standard icon updated', { iconPath });
      }

      Logger.debug(this.componentName, 'Tray icon updated', { iconPath });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to update tray icon', error);
    }
  }

  /**
   * 🔥 트레이 툴팁 업데이트
   * 🔥 SIMPLIFIED: Removed monitoring status
   */
  private updateTrayTooltip(): void {
    if (!this.tray) return;

    const tooltip = `Loop - Writer's Workspace`;

    this.tray.setToolTip(tooltip);
    Logger.debug(this.componentName, 'Tray tooltip updated', { tooltip });
  }

  /**
   * 🔥 에러 상태 표시
   * 🔥 ASYNC: Icon path resolution uses async I/O
   * 🔥 NULL SAFE: Guards against race conditions
   */
  public async showErrorStatus(errorMessage: string): Promise<void> {
    if (!this.tray) return;

    try {
      // 에러 툴팁 설정
      this.tray.setToolTip(`Loop Typing Analytics - 오류: ${errorMessage}`);

      // 에러 알림 (Windows/Linux에서만 지원)
      if (!Platform.isMacOS()) {
        const iconPath = await this.getTrayIconPath();
        
        // 🔥 NULL GUARD: Check after async operation
        if (!this.tray) {
          Logger.warn(this.componentName, 'Tray destroyed during error status display');
          return;
        }
        
        this.tray.displayBalloon({
          title: 'Loop Typing Analytics',
          content: `오류가 발생했습니다: ${errorMessage}`,
          icon: iconPath || ''
        });
      }

      Logger.warn(this.componentName, 'Error status displayed in tray', { errorMessage });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to show error status', error);
    }
  }

  /**
   * 🔥 성공 알림 표시
   * 🔥 ASYNC: Icon path resolution uses async I/O
   * 🔥 NULL SAFE: Guards against race conditions
   */
  public async showSuccessNotification(message: string): Promise<void> {
    if (!this.tray) return;

    try {
      if (!Platform.isMacOS()) {
        const iconPath = await this.getTrayIconPath();
        
        // 🔥 NULL GUARD: Check after async operation
        if (!this.tray) {
          Logger.warn(this.componentName, 'Tray destroyed during success notification');
          return;
        }
        
        this.tray.displayBalloon({
          title: 'Loop Typing Analytics',
          content: message,
          icon: iconPath || ''
        });
      }

      Logger.info(this.componentName, 'Success notification displayed', { message });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to show success notification', error);
    }
  }

  /**
   * 🔥 메인 윈도우 표시
   */
  private showMainWindow(): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.show();
        mainWindow.focus();

        Logger.debug(this.componentName, 'Main window shown from tray');
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to show main window', error);
    }
  }

  /**
   * 🔥 설정 페이지 열기
   */
  private openSettings(): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('tray-action', {
          action: 'open-settings',
          timestamp: Date.now()
        });
        this.showMainWindow();
      }

      Logger.info(this.componentName, 'Settings page requested from tray');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to open settings', error);
    }
  }

  /**
   * 🔥 앱 새로고침 (개발용)
   */
  private reloadApp(): void {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.reload();
      }

      Logger.info(this.componentName, 'App reload requested from tray');

    } catch (error) {
      Logger.error(this.componentName, 'Failed to reload app', error);
    }
  }

  /**
   * 🔥 앱 종료
   */
  private quitApp(): void {
    Logger.info(this.componentName, 'App quit requested from tray');
    app.quit();
  }

  /**
   * 🔥 메인 윈도우 가져오기
   */
  private getMainWindow(): BrowserWindow | null {
    try {
      return (global as unknown as { mainWindow?: BrowserWindow }).mainWindow || null;
    } catch (error) {
      Logger.error(this.componentName, 'Failed to get main window', error);
      return null;
    }
  }
  /**
   * 🔥 트레이 표시/숨기기 (설정 기반)
   */
  public async toggleTrayVisibility(): Promise<void> {
    try {
      const settingsManager = getSettingsManager();
      const appSettings = settingsManager.get('app');

      if (appSettings.minimizeToTray) {
        if (!this.tray) {
          await this.initialize();
          await this.start();
        }
      } else {
        if (this.tray) {
          await this.cleanup();
        }
      }

      Logger.info(this.componentName, 'Tray visibility toggled', {
        visible: appSettings.minimizeToTray
      });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle tray visibility', error);
    }
  }

  /**
   * 🔥 트레이 상태 정보 가져오기 (디버깅용)
   * 🔥 ASYNC: Icon path resolution uses async I/O
   * 🔥 SIMPLIFIED: Removed keyboard monitoring stats
   */
  public async getTrayInfo(): Promise<{
    isVisible: boolean;
    iconPath: string | null;
  }> {
    return {
      isVisible: this.tray !== null && !this.tray.isDestroyed(),
      iconPath: await this.getTrayIconPath()
    };
  }

  /**
   * 🔥 트레이 테스트 (개발용)
   * 🔥 SIMPLIFIED: Removed keyboard monitoring tests
   */
  public async testTray(): Promise<void> {
    try {
      Logger.info(this.componentName, 'Testing tray functionality');

      // 메뉴 업데이트 테스트
      await this.createTrayMenu();

      // 성공 알림 테스트
      await this.showSuccessNotification('트레이 테스트가 성공적으로 완료되었습니다!');

      const info = await this.getTrayInfo();
      Logger.info(this.componentName, 'Tray test completed', info);

    } catch (error) {
      Logger.error(this.componentName, 'Tray test failed', error);
      await this.showErrorStatus('트레이 테스트 실패');
    }
  }
}

// 🔥 기가차드 전역 트레이 매니저
let trayManagerInstance: TrayManager | null = null;

export const getTrayManager = (): TrayManager => {
  if (!trayManagerInstance) {
    trayManagerInstance = new TrayManager();
  }
  return trayManagerInstance;
};

export const trayManager = getTrayManager();
