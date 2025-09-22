// 🔥 기가차드 Shortcuts 매니저 - 글로벌 단축키 통합 관리

import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import { DEV_TOOLS } from '../constants';
import { getSettingsManager } from '../settings';
import { globalShortcut, BrowserWindow } from 'electron';

// #DEBUG: Shortcuts manager entry point
Logger.debug('SHORTCUTS_MANAGER', 'Shortcuts manager module loaded');

/**
 * 🔥 단축키 정의 인터페이스
 */
export interface ShortcutDefinition {
  accelerator: string;
  description: string;
  action: () => void | Promise<void>;
  enabled?: boolean;
  global?: boolean; // 글로벌 단축키 여부
}

/**
 * 🔥 기가차드 단축키 매니저
 * Settings와 통합된 글로벌 단축키 관리
 */
export class ShortcutsManager extends BaseManager {
  private readonly componentName = 'SHORTCUTS_MANAGER';
  private registeredShortcuts: Map<string, ShortcutDefinition> = new Map();
  private globalShortcuts: Set<string> = new Set();

  constructor() {
    super({
      name: 'ShortcutsManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000
    });

    Logger.info(this.componentName, 'Shortcuts manager instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // Settings에서 단축키 설정 로드
      await this.loadShortcutsFromSettings();
      
      // 기본 단축키들 등록
      this.registerDefaultShortcuts();

      Logger.info(this.componentName, 'Shortcuts manager initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize shortcuts manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 글로벌 단축키들 등록
      await this.registerGlobalShortcuts();

      Logger.info(this.componentName, 'Shortcuts manager started');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start shortcuts manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      // 모든 글로벌 단축키 해제
      await this.unregisterAllGlobalShortcuts();

      Logger.info(this.componentName, 'Shortcuts manager stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop shortcuts manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      this.registeredShortcuts.clear();
      this.globalShortcuts.clear();

      Logger.info(this.componentName, 'Shortcuts manager cleaned up');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup shortcuts manager', err);
      throw err;
    }
  }

  /**
   * 🔥 Settings에서 단축키 설정 로드
   */
  private async loadShortcutsFromSettings(): Promise<void> {
    try {
      const settingsManager = getSettingsManager();
      const keyboardSettings = settingsManager.get('keyboard');
      
      // 🔥 간단 버전에서는 기본 단축키만 사용
      if (keyboardSettings.enabled) {
        // 기본 단축키들 등록
        this.registerShortcut('keyboard.start-stop', {
          accelerator: 'CommandOrControl+Shift+K',
          description: '키보드 모니터링 시작/중지',
          action: () => this.toggleKeyboardMonitoring(),
          global: true
        });

        this.registerShortcut('keyboard.pause', {
          accelerator: 'CommandOrControl+Shift+P',
          description: '키보드 모니터링 일시정지',
          action: () => this.pauseKeyboardMonitoring(),
          global: true
        });

        this.registerShortcut('keyboard.show-stats', {
          accelerator: 'CommandOrControl+Shift+S',
          description: '현재 세션 통계 보기',
          action: () => this.showSessionStats(),
          global: true
        });

        Logger.info(this.componentName, 'Shortcuts loaded with default values', {
          startStop: 'CommandOrControl+Shift+K',
          pause: 'CommandOrControl+Shift+P',
          showStats: 'CommandOrControl+Shift+S'
        });
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to load shortcuts from settings', error);
    }
  }

  /**
   * 🔥 기본 단축키들 등록
   */
  private registerDefaultShortcuts(): void {
    // 🔥 기가차드 핵심 단축키들
    const shortcuts: { [key: string]: ShortcutDefinition } = {
      'app.focus-main-window': {
        accelerator: Platform.getModifierKey() + '+Shift+L',
        description: 'Loop 앱 포커스',
        action: () => this.focusMainWindow(),
        global: true
      },
      'app.quick-session': {
        accelerator: Platform.getModifierKey() + '+Shift+Q',
        description: '빠른 세션 시작',
        action: () => this.quickStartSession(),
        global: true
      },
      'app.toggle-window': {
        accelerator: Platform.getModifierKey() + '+Shift+H',
        description: '윈도우 숨기기/보이기',
        action: () => this.toggleMainWindow(),
        global: true
      },
      'dev.reload': {
        accelerator: Platform.getModifierKey() + '+R',
        description: '앱 새로고침',
        action: () => this.reloadApp(),
        enabled: true, // 항상 활성화
        global: true // 🔥 글로벌 단축키로 설정!
      },
      'dev.devtools': {
        accelerator: Platform.isMacOS() ? 'Cmd+Option+I' : 'F12', // Option으로 변경
        description: '개발자 도구',
        action: () => this.toggleDevTools(),
        enabled: true, // 항상 활성화
        global: true // 🔥 글로벌 단축키로 설정!
      }
    };

    // 각 단축키 등록
    for (const [key, shortcut] of Object.entries(shortcuts)) {
      if (shortcut.enabled !== false) {
        this.registerShortcut(key, shortcut);
        Logger.info(this.componentName, `✅ Shortcut registered: ${key} (${shortcut.accelerator})`);
      } else {
        Logger.warn(this.componentName, `❌ Shortcut disabled: ${key} (${shortcut.accelerator})`);
      }
    }

    Logger.debug(this.componentName, 'Default shortcuts registered');
  }

  /**
   * 🔥 단축키 등록
   */
  public registerShortcut(id: string, shortcut: ShortcutDefinition): boolean {
    try {
      this.registeredShortcuts.set(id, shortcut);
      Logger.debug(this.componentName, `Shortcut registered: ${id} (${shortcut.accelerator})`);
      return true;
    } catch (error) {
      Logger.error(this.componentName, `Failed to register shortcut: ${id}`, error);
      return false;
    }
  }

  /**
   * 🔥 글로벌 단축키들 등록
   */
  private async registerGlobalShortcuts(): Promise<void> {
    for (const [id, shortcut] of this.registeredShortcuts) {
      if (shortcut.global && shortcut.enabled !== false) {
        try {
          const success = globalShortcut.register(shortcut.accelerator, () => {
            try {
              Logger.debug(this.componentName, `Global shortcut triggered: ${id}`);
              shortcut.action();
            } catch (error) {
              Logger.error(this.componentName, `Global shortcut action failed: ${id}`, error);
            }
          });

          if (success) {
            this.globalShortcuts.add(id);
            Logger.debug(this.componentName, `Global shortcut registered: ${id} (${shortcut.accelerator})`);
          } else {
            Logger.warn(this.componentName, `Failed to register global shortcut: ${id} (${shortcut.accelerator})`);
          }
        } catch (error) {
          Logger.error(this.componentName, `Error registering global shortcut: ${id}`, error);
        }
      }
    }

    Logger.info(this.componentName, `Global shortcuts registered: ${this.globalShortcuts.size}`);
  }

  /**
   * 🔥 모든 글로벌 단축키 해제
   */
  private async unregisterAllGlobalShortcuts(): Promise<void> {
    try {
      globalShortcut.unregisterAll();
      this.globalShortcuts.clear();
      Logger.info(this.componentName, 'All global shortcuts unregistered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to unregister global shortcuts', error);
    }
  }

  /**
   * 🔥 단축키 액션 핸들러들
   */
  private async toggleKeyboardMonitoring(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('global-shortcut', {
          action: 'toggle-keyboard-monitoring',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Toggle keyboard monitoring shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle keyboard monitoring', error);
    }
  }

  private async pauseKeyboardMonitoring(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('global-shortcut', {
          action: 'pause-keyboard-monitoring',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Pause keyboard monitoring shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to pause keyboard monitoring', error);
    }
  }

  private async showSessionStats(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('global-shortcut', {
          action: 'show-session-stats',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Show session stats shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to show session stats', error);
    }
  }

  private async focusMainWindow(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
        mainWindow.show();
      }
      Logger.info(this.componentName, 'Focus main window shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to focus main window', error);
    }
  }

  private async quickStartSession(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('global-shortcut', {
          action: 'quick-start-session',
          timestamp: Date.now()
        });
      }
      Logger.info(this.componentName, 'Quick start session shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to quick start session', error);
    }
  }

  private async toggleMainWindow(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
      Logger.info(this.componentName, 'Toggle main window shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle main window', error);
    }
  }

  private async reloadApp(): Promise<void> {
    try {
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.reload();
      }
      Logger.info(this.componentName, 'Reload app shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to reload app', error);
    }
  }

  private async toggleDevTools(): Promise<void> {
    try {
      Logger.info(this.componentName, '🚀 DevTools toggle requested via shortcut');
      
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
      
      Logger.info(this.componentName, 'Toggle dev tools shortcut triggered');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to toggle dev tools', error);
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
   * 🔥 등록된 단축키 목록 가져오기
   */
  public getRegisteredShortcuts(): Map<string, ShortcutDefinition> {
    return new Map(this.registeredShortcuts);
  }

  /**
   * 🔥 단축키 활성화/비활성화
   */
  public setShortcutEnabled(id: string, enabled: boolean): boolean {
    const shortcut = this.registeredShortcuts.get(id);
    if (shortcut) {
      shortcut.enabled = enabled;
      
      // 글로벌 단축키인 경우 다시 등록/해제
      if (shortcut.global) {
        if (enabled) {
          this.registerGlobalShortcuts();
        } else {
          if (this.globalShortcuts.has(id)) {
            globalShortcut.unregister(shortcut.accelerator);
            this.globalShortcuts.delete(id);
          }
        }
      }
      
      Logger.debug(this.componentName, `Shortcut ${id} ${enabled ? 'enabled' : 'disabled'}`);
      return true;
    }
    return false;
  }

  /**
   * 🔥 단축키 실행
   */
  public executeShortcut(id: string): boolean {
    const shortcut = this.registeredShortcuts.get(id);
    if (shortcut && shortcut.enabled !== false) {
      try {
        shortcut.action();
        Logger.debug(this.componentName, `Shortcut executed: ${id}`);
        return true;
      } catch (error) {
        Logger.error(this.componentName, `Shortcut execution failed: ${id}`, error);
      }
    }
    return false;
  }

  /**
   * 🔥 단축키 업데이트 메서드 - any 타입 제거용
   */
  public updateShortcuts(shortcuts: Record<string, string>): void {
    Logger.info(this.componentName, 'Shortcuts updated', { count: Object.keys(shortcuts).length });
    
    // 기존 글로벌 단축키 해제
    this.unregisterAllGlobalShortcuts();
    
    // 새로운 단축키 등록
    Object.entries(shortcuts).forEach(([action, accelerator]) => {
      this.registerShortcut(`global_${action}`, {
        accelerator,
        description: `Global shortcut for ${action}`,
        action: () => {
          Logger.debug(this.componentName, `Global shortcut triggered: ${action}`);
          // 실제 액션 실행 로직은 나중에 구현
        },
        global: true
      });
    });
  }
}

// 🔥 기가차드 싱글톤 인스턴스
let shortcutsManagerInstance: ShortcutsManager | null = null;

export function getShortcutsManager(): ShortcutsManager {
  if (!shortcutsManagerInstance) {
    shortcutsManagerInstance = new ShortcutsManager();
  }
  return shortcutsManagerInstance;
}

// #DEBUG: Shortcuts manager exit point
Logger.debug('SHORTCUTS_MANAGER', 'Shortcuts manager module setup complete');

export default ShortcutsManager;
