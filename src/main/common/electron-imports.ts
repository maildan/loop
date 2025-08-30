// 🔥 기가차드 일렉트론 임포트 헬퍼 - 안전한 임포트 관리

import { Logger } from '../../shared/logger';

// #DEBUG: Electron imports module entry point
Logger.debug('ELECTRON_IMPORTS', 'Electron imports module loaded');

// 🔥 기가차드 Electron 모듈 타입 정의
export interface ElectronModules {
  app: typeof import('electron').app;
  BrowserWindow: typeof import('electron').BrowserWindow;
  Menu: typeof import('electron').Menu;
  Tray: typeof import('electron').Tray;
  dialog: typeof import('electron').dialog;
  shell: typeof import('electron').shell;
  screen: typeof import('electron').screen;
  nativeImage: typeof import('electron').nativeImage;
  ipcMain: typeof import('electron').ipcMain;
  contextBridge: typeof import('electron').contextBridge;
  webContents: typeof import('electron').webContents;
  session: typeof import('electron').session;
}

// 🔥 기가차드 안전한 Electron 임포트 클래스
export class ElectronImportManager {
  private static instance: ElectronImportManager | null = null;
  private electronModules: Partial<ElectronModules> = {};
  private isElectronAvailable = false;

  private constructor() {
    this.initializeElectronModules();
  }

  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): ElectronImportManager {
    if (!ElectronImportManager.instance) {
      ElectronImportManager.instance = new ElectronImportManager();
    }
    return ElectronImportManager.instance;
  }

  // 🔥 Electron 모듈 초기화
  private async initializeElectronModules(): Promise<void> {
    try {
      // #DEBUG: Initializing Electron modules
      Logger.debug('ELECTRON_IMPORTS', 'Initializing Electron modules');

      // Electron 환경 확인
      if (typeof process === 'undefined' || !process.versions.electron) {
        throw new Error('Not running in Electron environment');
      }

      // 동적 임포트로 Electron 모듈들 로드
      const electron = await import('electron');
      
      this.electronModules = {
        app: electron.app,
        BrowserWindow: electron.BrowserWindow,
        Menu: electron.Menu,
        Tray: electron.Tray,
        dialog: electron.dialog,
        shell: electron.shell,
        screen: electron.screen,
        nativeImage: electron.nativeImage,
        ipcMain: electron.ipcMain,
        contextBridge: electron.contextBridge,
        webContents: electron.webContents,
        session: electron.session,
      };

      this.isElectronAvailable = true;
      Logger.info('ELECTRON_IMPORTS', 'Electron modules loaded successfully');

    } catch (error) {
      Logger.error('ELECTRON_IMPORTS', 'Failed to load Electron modules', error);
      this.isElectronAvailable = false;
    }
  }

  // 🔥 Electron 사용 가능 여부 확인
  public isAvailable(): boolean {
    return this.isElectronAvailable;
  }

  // 🔥 안전한 모듈 가져오기
  public getModule<K extends keyof ElectronModules>(
    moduleName: K
  ): ElectronModules[K] | null {
    if (!this.isElectronAvailable) {
      Logger.warn('ELECTRON_IMPORTS', `Electron not available, cannot get ${moduleName}`);
      return null;
    }

    // 🔥 기가차드 수정: module 변수명 변경으로 Next.js 경고 해결
    const electronModule = this.electronModules[moduleName];
    if (!electronModule) {
      Logger.warn('ELECTRON_IMPORTS', `Module ${moduleName} not loaded`);
      return null;
    }

    return electronModule as ElectronModules[K];
  }

  // 🔥 안전한 앱 모듈 가져오기
  public getApp(): typeof import('electron').app | null {
    return this.getModule('app');
  }

  // 🔥 안전한 BrowserWindow 가져오기
  public getBrowserWindow(): typeof import('electron').BrowserWindow | null {
    return this.getModule('BrowserWindow');
  }

  // 🔥 안전한 ipcMain 가져오기
  public getIpcMain(): typeof import('electron').ipcMain | null {
    return this.getModule('ipcMain');
  }

  // 🔥 안전한 dialog 가져오기
  public getDialog(): typeof import('electron').dialog | null {
    return this.getModule('dialog');
  }

  // 🔥 안전한 shell 가져오기
  public getShell(): typeof import('electron').shell | null {
    return this.getModule('shell');
  }

  // 🔥 안전한 screen 가져오기
  public getScreen(): typeof import('electron').screen | null {
    return this.getModule('screen');
  }

  // 🔥 안전한 nativeImage 가져오기
  public getNativeImage(): typeof import('electron').nativeImage | null {
    return this.getModule('nativeImage');
  }

  // 🔥 모듈 상태 확인
  public getModuleStatus(): Record<keyof ElectronModules, boolean> {
    const status: Record<string, boolean> = {};
    
    const moduleNames: (keyof ElectronModules)[] = [
      'app', 'BrowserWindow', 'Menu', 'Tray', 'dialog', 
      'shell', 'screen', 'nativeImage', 'ipcMain', 
      'contextBridge', 'webContents', 'session'
    ];

    for (const moduleName of moduleNames) {
      status[moduleName] = !!this.electronModules[moduleName];
    }

    return status as Record<keyof ElectronModules, boolean>;
  }

  // 🔥 모든 모듈 강제 재로드
  public async reloadModules(): Promise<boolean> {
    try {
      // #DEBUG: Reloading Electron modules
      Logger.debug('ELECTRON_IMPORTS', 'Reloading Electron modules');

      this.electronModules = {};
      this.isElectronAvailable = false;
      
      await this.initializeElectronModules();
      
      return this.isElectronAvailable;

    } catch (error) {
      Logger.error('ELECTRON_IMPORTS', 'Failed to reload Electron modules', error);
      return false;
    }
  }

  // 🔥 메모리 정리
  public cleanup(): void {
    // #DEBUG: Cleaning up Electron imports
    Logger.debug('ELECTRON_IMPORTS', 'Cleaning up Electron imports');

    this.electronModules = {};
    this.isElectronAvailable = false;
  }
}

// 🔥 기가차드 전역 Electron 임포트 매니저
export const electronImportManager = ElectronImportManager.getInstance();

// 🔥 편의 함수들
export const safeGetApp = (): typeof import('electron').app | null => 
  electronImportManager.getApp();

export const safeGetBrowserWindow = (): typeof import('electron').BrowserWindow | null => 
  electronImportManager.getBrowserWindow();

export const safeGetIpcMain = (): typeof import('electron').ipcMain | null => 
  electronImportManager.getIpcMain();

export const safeGetDialog = (): typeof import('electron').dialog | null => 
  electronImportManager.getDialog();

export const safeGetShell = (): typeof import('electron').shell | null => 
  electronImportManager.getShell();

// #DEBUG: Electron imports module exit point
Logger.debug('ELECTRON_IMPORTS', 'Electron imports module setup complete');

export default electronImportManager;
