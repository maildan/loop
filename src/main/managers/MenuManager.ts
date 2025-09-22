// 🔥 기가차드 Menu 매니저 - macOS/Windows/Linux 메뉴 통합 관리

import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import { DEV_TOOLS } from '../constants';
import { app, Menu, MenuItem, BrowserWindow, MenuItemConstructorOptions } from 'electron';

// #DEBUG: Menu manager entry point
Logger.debug('MENU_MANAGER', 'Menu manager module loaded');

/**
 * 🔥 기가차드 메뉴 매니저 인터페이스
 */
export interface MenuAction {
  id: string;
  label: string;
  accelerator?: string;
  action: () => void | Promise<void>;
  submenu?: MenuAction[];
  enabled?: boolean;
  visible?: boolean;
  role?: string;
}

/**
 * 🔥 기가차드 메뉴 매니저
 * 플랫폼별 네이티브 메뉴를 중앙 관리
 */
export class MenuManager extends BaseManager {
  private readonly componentName = 'MENU_MANAGER';
  private applicationMenu: Menu | null = null;
  private contextMenu: Menu | null = null;
  private menuActions: Map<string, MenuAction> = new Map();

  constructor() {
    super({
      name: 'MenuManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 2,
      retryDelay: 1000
    });

    Logger.info(this.componentName, 'Menu manager instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 플랫폼별 기본 메뉴 작업 등록
      this.registerDefaultMenuActions();
      
      // 애플리케이션 메뉴 생성
      this.createApplicationMenu();
      
      // 컨텍스트 메뉴 생성
      this.createContextMenu();

      Logger.info(this.componentName, 'Menu manager initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize menu manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      Logger.debug(this.componentName, 'Starting menu manager...');
      
      // 🔥 플랫폼별 메뉴 설정
      if (Platform.isWindows() || Platform.isLinux()) {
        // 윈도우/리눅스에서는 메뉴바 완전 제거
        Menu.setApplicationMenu(null);
        Logger.info(this.componentName, '✅ Menu bar completely hidden on Windows/Linux');
      } else if (this.applicationMenu) {
        // macOS에서만 최소 메뉴 설정
        Menu.setApplicationMenu(this.applicationMenu);
        Logger.info(this.componentName, '✅ Minimal macOS menu set successfully');
      } else {
        Logger.error(this.componentName, '❌ macOS menu is null!');
        // macOS에서 메뉴가 없으면 기본 메뉴라도 생성
        this.createBasicMenu();
      }

      // 🔥 개발 환경에서 메뉴 상태 확인
      if (process.env.NODE_ENV === 'development') {
        const currentMenu = Menu.getApplicationMenu();
        if (currentMenu) {
          Logger.info(this.componentName, '🎉 Menu verification: Menu is active!');
        } else {
          Logger.info(this.componentName, '🎯 Menu verification: No menu set (expected on Windows/Linux)');
        }
      }

      Logger.info(this.componentName, 'Menu manager started');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start menu manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      // 메뉴 해제 (필요시)
      Logger.info(this.componentName, 'Menu manager stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop menu manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      this.applicationMenu = null;
      this.contextMenu = null;
      this.menuActions.clear();

      Logger.info(this.componentName, 'Menu manager cleaned up');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup menu manager', err);
      throw err;
    }
  }

  /**
   * 🔥 기본 메뉴 액션들 등록 (최소한만 유지)
   */
  private registerDefaultMenuActions(): void {
    // Loop 전용 필수 액션들만 유지
    this.registerMenuAction({
      id: 'app.about',
      label: Platform.isMacOS() ? 'Loop에 관하여' : '정보',
      action: () => this.handleAbout()
    });

    // 개발자 도구는 항상 사용 가능하도록 설정
    this.registerMenuAction({
      id: 'dev.toggle-devtools',
      label: '개발자 도구',
      accelerator: Platform.isMacOS() ? 'Cmd+Option+I' : 'F12', // Option으로 변경
      action: () => this.handleToggleDevTools()
    });

    Logger.debug(this.componentName, 'Minimal menu actions registered');
  }

  /**
   * 🔥 메뉴 액션 등록
   */
  public registerMenuAction(action: MenuAction): void {
    this.menuActions.set(action.id, action);
    Logger.debug(this.componentName, `Menu action registered: ${action.id}`);
  }

  /**
   * 🔥 애플리케이션 메뉴 생성 (윈도우에서는 완전 숨김)
   */
  private createApplicationMenu(): void {
    const template: MenuItemConstructorOptions[] = [];

    if (Platform.isMacOS()) {
      // macOS 앱 메뉴 (최소한만 유지)
      template.push({
        label: app.getName(),
        submenu: [
          { 
            label: 'Loop에 관하여',
            click: () => this.handleAbout()
          },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });
    } else {
      // 🔥 Windows/Linux - 메뉴 완전 제거 (빈 템플릿)
      // 아무것도 추가하지 않음으로써 메뉴바 완전 숨김
      Logger.info(this.componentName, 'Windows/Linux menu completely hidden');
    }

    // 🔥 윈도우에서는 null로 설정하여 메뉴바 완전 제거
    if (Platform.isWindows() || Platform.isLinux()) {
      this.applicationMenu = null;
      Logger.info(this.componentName, 'Menu bar completely hidden on Windows/Linux');
    } else {
      this.applicationMenu = Menu.buildFromTemplate(template);
      Logger.info(this.componentName, 'Minimal macOS menu created');
    }
  }

  /**
   * 🔥 컨텍스트 메뉴 생성 (간소화됨)
   */
  private createContextMenu(): void {
    const template: MenuItemConstructorOptions[] = [
      { 
        label: 'Loop에 관하여',
        click: () => this.handleAbout()
      }
    ];

    // 개발자 도구는 항상 사용 가능하도록 설정
    template.push(
      { type: 'separator' },
      { 
        label: '개발자 도구',
        accelerator: Platform.isMacOS() ? 'Cmd+Option+I' : 'F12', // Option으로 변경
        click: () => this.handleToggleDevTools()
      }
    );

    this.contextMenu = Menu.buildFromTemplate(template);
    Logger.info(this.componentName, 'Minimal context menu created');
  }

  /**
   * 🔥 메뉴 액션으로부터 메뉴 아이템 생성
   */
  private createMenuItemFromAction(actionId: string): MenuItemConstructorOptions {
    const action = this.menuActions.get(actionId);
    if (!action) {
      Logger.warn(this.componentName, `Menu action not found: ${actionId}`);
      return { label: 'Unknown Action', enabled: false };
    }

    return {
      label: action.label,
      accelerator: action.accelerator,
      enabled: action.enabled !== false,
      visible: action.visible !== false,
      click: () => {
        try {
          Logger.debug(this.componentName, `Menu action executed: ${actionId}`);
          action.action();
        } catch (error) {
          Logger.error(this.componentName, `Menu action failed: ${actionId}`, error);
        }
      }
    };
  }

  /**
   * 🔥 메뉴 액션 핸들러들 (필수만 유지)
   */
  private async handleToggleDevTools(): Promise<void> {
    try {
      Logger.info(this.componentName, '🚀 DevTools toggle requested via menu');
      
      const mainWindow = this.getMainWindow();
      Logger.info(this.componentName, 'Main window status', { 
        hasWindow: !!mainWindow, 
        isDestroyed: mainWindow?.isDestroyed(),
        windowCount: BrowserWindow.getAllWindows().length 
      });
      
      if (mainWindow) {
        const isDevToolsOpened = mainWindow.webContents.isDevToolsOpened();
        Logger.info(this.componentName, 'DevTools current state', { isDevToolsOpened });
        
        if (isDevToolsOpened) {
          Logger.info(this.componentName, 'Closing DevTools...');
          mainWindow.webContents.closeDevTools();
        } else {
          Logger.info(this.componentName, 'Opening DevTools in detached mode...');
          mainWindow.webContents.openDevTools({ mode: 'detach' });
          Logger.info(this.componentName, '✅ DevTools openDevTools() call completed');
        }
      } else {
        Logger.error(this.componentName, '❌ No main window found for DevTools toggle');
      }
      
      Logger.info(this.componentName, 'Toggle dev tools action triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle dev tools', error);
    }
  }

  private async handleAbout(): Promise<void> {
    try {
      const { dialog } = await import('electron');
      await dialog.showMessageBox({
        type: 'info',
        title: 'Loop에 관하여',
        message: 'Loop Typing Analytics',
        detail: `
버전: 1.0.0
실시간 타이핑 분석을 위한 고급 도구

개발: Loop Development Team
기술: Electron + Next.js + TypeScript
        `.trim(),
        buttons: ['확인']
      });
      Logger.info(this.componentName, 'About dialog shown');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to show about dialog', error);
    }
  }

  /**
   * 🔥 메인 윈도우 가져오기
   */
  private getMainWindow(): BrowserWindow | null {
    const windows = BrowserWindow.getAllWindows();
    return windows.find(window => !window.isDestroyed()) || null;
  }

  /**
   * 🔥 컨텍스트 메뉴 표시
   */
  public showContextMenu(): void {
    if (this.contextMenu) {
      this.contextMenu.popup();
      Logger.debug(this.componentName, 'Context menu shown');
    }
  }

  /**
   * 🔥 메뉴 액션 실행
   */
  public executeMenuAction(actionId: string): void {
    const action = this.menuActions.get(actionId);
    if (action) {
      try {
        action.action();
        Logger.debug(this.componentName, `Menu action executed: ${actionId}`);
      } catch (error) {
        Logger.error(this.componentName, `Menu action failed: ${actionId}`, error);
      }
    } else {
      Logger.warn(this.componentName, `Menu action not found: ${actionId}`);
    }
  }

  /**
   * 🔥 메뉴 액션 활성화/비활성화
   */
  public setMenuActionEnabled(actionId: string, enabled: boolean): void {
    const action = this.menuActions.get(actionId);
    if (action) {
      action.enabled = enabled;
      // 메뉴 다시 빌드 (필요시)
      Logger.debug(this.componentName, `Menu action ${actionId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * 🔥 기본 메뉴 생성 (fallback용)
   */
  private createBasicMenu(): void {
    try {
      Logger.debug(this.componentName, 'Creating basic fallback menu...');
      
      const template: MenuItemConstructorOptions[] = [];

      if (Platform.isMacOS()) {
        // macOS 앱 메뉴 (필수)
        template.push({
          label: app.getName(),
          submenu: [
            {
              label: `${app.getName()} 정보`,
              role: 'about'
            },
            { type: 'separator' },
            {
              label: '환경설정...',
              accelerator: 'Cmd+,',
              click: () => Logger.info(this.componentName, 'Preferences clicked')
            },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        });
      }

      // 기본 파일 메뉴
      template.push({
        label: '파일',
        submenu: [
          {
            label: '새 세션',
            accelerator: Platform.getModifierKey() + '+N',
            click: () => Logger.info(this.componentName, 'New session clicked')
          },
          { type: 'separator' },
          Platform.isMacOS() ? { role: 'close' } : { role: 'quit' }
        ]
      });

      // 기본 편집 메뉴
      template.push({
        label: '편집',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      });

      // 기본 보기 메뉴
      template.push({
        label: '보기',
        submenu: [
          { role: 'reload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      });

      // macOS 윈도우 메뉴
      if (Platform.isMacOS()) {
        template.push({
          label: '윈도우',
          submenu: [
            { role: 'minimize' },
            { role: 'close' },
            { type: 'separator' },
            { role: 'front' }
          ]
        });
      }

      // 기본 도움말 메뉴
      const helpSubmenu: MenuItemConstructorOptions[] = [
        {
          label: '단축키',
          click: () => Logger.info(this.componentName, 'Shortcuts clicked')
        }
      ];

      if (!Platform.isMacOS()) {
        helpSubmenu.push({
          label: `${app.getName()} 정보`,
          role: 'about'
        });
      }

      template.push({
        label: '도움말',
        submenu: helpSubmenu
      });

      this.applicationMenu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(this.applicationMenu);
      
      Logger.info(this.componentName, '✅ Basic fallback menu created and set successfully');
    } catch (error) {
      Logger.error(this.componentName, '❌ Failed to create basic menu', error);
    }
  }

  /**
   * 🔥 테마 변경 메서드 - any 타입 제거용
   */
  public updateTheme(colorScheme: string): void {
    Logger.info(this.componentName, `Theme updated to: ${colorScheme}`);
    // 테마 변경에 따른 메뉴 스타일 업데이트 로직
    // 필요시 메뉴 재구성
  }

  /**
   * 🔥 언어 변경 메서드 - any 타입 제거용
   */
  public updateLanguage(language: string): void {
    Logger.info(this.componentName, `Language updated to: ${language}`);
    // 언어 변경에 따른 메뉴 라벨 업데이트 로직
    // 필요시 메뉴 재구성
  }
}

// 🔥 기가차드 싱글톤 인스턴스
let menuManagerInstance: MenuManager | null = null;

export function getMenuManager(): MenuManager {
  if (!menuManagerInstance) {
    menuManagerInstance = new MenuManager();
  }
  return menuManagerInstance;
}

// #DEBUG: Menu manager exit point
Logger.debug('MENU_MANAGER', 'Menu manager module setup complete');

export default MenuManager;
