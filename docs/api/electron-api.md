# Loop Typing Analytics - Electron API 문서

## 🔌 Electron API 통합 가이드

Loop 애플리케이션은 Electron의 핵심 API들을 활용하여 네이티브 데스크탑 기능을 제공합니다.

## 📱 Main Process APIs

### 1. App Module

#### 애플리케이션 라이프사이클 관리

```typescript
import { app } from 'electron';
import { Logger } from '../shared/logger';

class LoopApplication {
  constructor() {
    this.setupAppEvents();
  }

  private setupAppEvents(): void {
    // 🔥 애플리케이션 준비 완료
    app.whenReady().then(() => {
      Logger.info('APP', 'Electron app ready');
      this.initialize();
    });

    // 🔥 모든 윈도우 닫힘 (macOS 제외)
    app.on('window-all-closed', () => {
      Logger.info('APP', 'All windows closed');
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // 🔥 활성화 (macOS)
    app.on('activate', () => {
      Logger.info('APP', 'App activated');
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    // 🔥 종료 전 정리
    app.on('before-quit', async (event) => {
      Logger.info('APP', 'App about to quit');
      event.preventDefault();
      await this.cleanup();
      app.quit();
    });
  }
}
```

#### 자동 실행 설정

```typescript
import { app } from 'electron';

export class AutoLaunchManager {
  public isAutoLaunchEnabled(): boolean {
    return app.getLoginItemSettings().openAtLogin;
  }

  public async enableAutoLaunch(): Promise<void> {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true, // 백그라운드에서 시작
      name: 'Loop Typing Analytics',
      args: ['--auto-launch']
    });
    
    Logger.info('AUTO_LAUNCH', 'Auto-launch enabled');
  }

  public async disableAutoLaunch(): Promise<void> {
    app.setLoginItemSettings({
      openAtLogin: false
    });
    
    Logger.info('AUTO_LAUNCH', 'Auto-launch disabled');
  }
}
```

### 2. BrowserWindow Module

#### 메인 윈도우 생성 및 관리

```typescript
import { BrowserWindow, screen } from 'electron';
import path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  public createMainWindow(): BrowserWindow {
    // 화면 크기 가져오기
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    this.mainWindow = new BrowserWindow({
      width: Math.min(1200, width - 100),
      height: Math.min(800, height - 100),
      minWidth: 800,
      minHeight: 600,
      
      // 🔥 보안 설정
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        enableRemoteModule: false,
        preload: path.join(__dirname, '../preload/preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false
      },

      // 🔥 UI 설정
      titleBarStyle: 'hiddenInset', // macOS
      vibrancy: 'under-window', // macOS 투명 효과
      show: false, // 로딩 완료 후 표시
      
      // 🔥 아이콘 설정
      icon: this.getAppIcon()
    });

    // 로딩 완료 후 표시
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      
      if (process.env.NODE_ENV === 'development') {
        this.mainWindow?.webContents.openDevTools();
      }
    });

    return this.mainWindow;
  }

  private getAppIcon(): string {
    const iconPath = path.join(__dirname, '../../assets');
    
    switch (process.platform) {
      case 'win32':
        return path.join(iconPath, 'icon.ico');
      case 'darwin':
        return path.join(iconPath, 'icon.icns');
      default:
        return path.join(iconPath, 'icon.png');
    }
  }
}
```

#### 윈도우 상태 관리

```typescript
export class WindowManager {
  public setupWindowEvents(): void {
    if (!this.mainWindow) return;

    // 🔥 윈도우 포커스 이벤트
    this.mainWindow.on('focus', () => {
      Logger.debug('WINDOW', 'Main window focused');
      this.sendToRenderer('window:focused');
    });

    this.mainWindow.on('blur', () => {
      Logger.debug('WINDOW', 'Main window blurred');
      this.sendToRenderer('window:blurred');
    });

    // 🔥 윈도우 크기 변경
    this.mainWindow.on('resize', () => {
      const bounds = this.mainWindow?.getBounds();
      Logger.debug('WINDOW', 'Window resized', bounds);
      
      // 사용자 설정 저장
      this.saveWindowState(bounds);
    });

    // 🔥 윈도우 최소화/복원
    this.mainWindow.on('minimize', () => {
      Logger.debug('WINDOW', 'Window minimized');
      // 트레이로 숨기기 (선택사항)
      if (this.shouldHideToTray()) {
        this.mainWindow?.hide();
      }
    });

    this.mainWindow.on('restore', () => {
      Logger.debug('WINDOW', 'Window restored');
      this.sendToRenderer('window:restored');
    });
  }

  private sendToRenderer(channel: string, data?: unknown): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, data);
    }
  }
}
```

### 3. IPC (Inter-Process Communication)

#### Main Process IPC 핸들러

```typescript
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Result, IpcResponse } from '../shared/types';

// 🔥 타입 안전한 IPC 핸들러 생성기
export function createSafeAsyncIpcHandler<TRequest, TResponse>(
  handler: (event: IpcMainInvokeEvent, request: TRequest) => Promise<TResponse>
): (event: IpcMainInvokeEvent, request: TRequest) => Promise<IpcResponse<TResponse>> {
  return async (event: IpcMainInvokeEvent, request: TRequest): Promise<IpcResponse<TResponse>> => {
    try {
      const data = await handler(event, request);
      return {
        success: true,
        data,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error('IPC', 'Handler error', { error, request });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  };
}

// 🔥 키보드 IPC 핸들러 등록
export function setupKeyboardIpcHandlers(): void {
  // 키보드 모니터링 시작
  ipcMain.handle(
    'keyboard:start-monitoring',
    createSafeAsyncIpcHandler(async (event) => {
      Logger.debug('KEYBOARD_IPC', 'Start monitoring requested');
      const result = await unifiedHandler.startMonitoring();
      return result.success;
    })
  );

  // 키보드 모니터링 중지
  ipcMain.handle(
    'keyboard:stop-monitoring',
    createSafeAsyncIpcHandler(async (event) => {
      Logger.debug('KEYBOARD_IPC', 'Stop monitoring requested');
      const result = await unifiedHandler.stopMonitoring();
      return result.success;
    })
  );

  // 실시간 통계 가져오기
  ipcMain.handle(
    'keyboard:get-realtime-stats',
    createSafeAsyncIpcHandler(async (event) => {
      const stats = unifiedHandler.getRealtimeStats();
      return {
        currentWpm: stats.currentWpm,
        averageWpm: stats.averageWpm,
        totalKeystrokes: stats.totalKeystrokes,
        sessionDuration: stats.sessionDuration,
        accuracy: stats.accuracy
      };
    })
  );
}
```

### 4. Session & WebContents

#### 세션 보안 설정

```typescript
import { session } from 'electron';

export class SecurityManager {
  public setupSecurity(): void {
    const ses = session.defaultSession;

    // 🔥 CSP (Content Security Policy) 설정
    ses.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self' 'unsafe-inline' data:; " +
            "script-src 'self' 'unsafe-eval'; " +
            "connect-src 'self' ws: wss:; " +
            "img-src 'self' data: https:;"
          ]
        }
      });
    });

    // 🔥 권한 요청 차단
    ses.setPermissionRequestHandler((webContents, permission, callback) => {
      Logger.warn('SECURITY', 'Permission requested', { permission });
      
      // Loop에 필요한 권한만 허용
      const allowedPermissions = ['notifications'];
      callback(allowedPermissions.includes(permission));
    });

    // 🔥 외부 URL 접근 차단
    ses.webRequest.onBeforeRequest((details, callback) => {
      const { url } = details;
      
      // 로컬 개발 서버나 파일만 허용
      const isAllowed = url.startsWith('http://localhost:') || 
                       url.startsWith('file://') ||
                       url.startsWith('devtools://');
      
      if (!isAllowed) {
        Logger.warn('SECURITY', 'Blocked external URL', { url });
        callback({ cancel: true });
      } else {
        callback({ cancel: false });
      }
    });
  }
}
```

### 5. Tray Module

#### 시스템 트레이 구현

```typescript
import { Tray, Menu, nativeImage } from 'electron';
import path from 'path';

export class TrayManager {
  private tray: Tray | null = null;

  public createTray(): void {
    const iconPath = this.getTrayIconPath();
    const icon = nativeImage.createFromPath(iconPath);
    
    // 고해상도 디스플레이를 위한 크기 조정
    icon.setTemplateImage(true);
    
    this.tray = new Tray(icon);
    this.tray.setToolTip('Loop Typing Analytics');
    
    this.setupTrayMenu();
    this.setupTrayEvents();
  }

  private setupTrayMenu(): void {
    if (!this.tray) return;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Dashboard 열기',
        click: () => {
          this.showMainWindow();
        }
      },
      {
        label: '모니터링 상태',
        submenu: [
          {
            label: '시작',
            click: async () => {
              await unifiedHandler.startMonitoring();
              this.updateTrayMenu();
            }
          },
          {
            label: '중지',
            click: async () => {
              await unifiedHandler.stopMonitoring();
              this.updateTrayMenu();
            }
          }
        ]
      },
      { type: 'separator' },
      {
        label: '설정',
        click: () => {
          this.openSettings();
        }
      },
      { type: 'separator' },
      {
        label: '종료',
        click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  private setupTrayEvents(): void {
    if (!this.tray) return;

    // 더블클릭으로 윈도우 열기
    this.tray.on('double-click', () => {
      this.showMainWindow();
    });

    // 우클릭으로 컨텍스트 메뉴
    this.tray.on('right-click', () => {
      if (this.tray) {
        this.tray.popUpContextMenu();
      }
    });
  }
}
```

### 6. Shell Module

#### 외부 링크 및 파일 관리

```typescript
import { shell } from 'electron';

export class ShellManager {
  // 🔥 외부 브라우저에서 URL 열기
  public openExternal(url: string): void {
    if (this.isUrlSafe(url)) {
      shell.openExternal(url);
      Logger.info('SHELL', 'Opened external URL', { url });
    } else {
      Logger.warn('SHELL', 'Blocked unsafe URL', { url });
    }
  }

  // 🔥 폴더에서 파일 표시
  public showItemInFolder(filePath: string): void {
    shell.showItemInFolder(filePath);
    Logger.info('SHELL', 'Showed item in folder', { filePath });
  }

  // 🔥 파일을 기본 앱으로 열기
  public openPath(path: string): Promise<string> {
    return shell.openPath(path);
  }

  // 🔥 휴지통으로 이동
  public async moveToTrash(path: string): Promise<boolean> {
    try {
      const success = await shell.moveItemToTrash(path);
      Logger.info('SHELL', 'Moved to trash', { path, success });
      return success;
    } catch (error) {
      Logger.error('SHELL', 'Failed to move to trash', { path, error });
      return false;
    }
  }

  private isUrlSafe(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      // HTTP(S) 프로토콜만 허용
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }
}
```

## 🖥️ Renderer Process APIs

### Preload Script API 노출

```typescript
// src/preload/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import { IpcResponse } from '../shared/types';

// 🔥 타입 안전한 API 정의
export interface ElectronAPI {
  // 키보드 API
  keyboard: {
    startMonitoring(): Promise<IpcResponse<boolean>>;
    stopMonitoring(): Promise<IpcResponse<boolean>>;
    getRealtimeStats(): Promise<IpcResponse<RealtimeStats>>;
    setLanguage(language: string): Promise<IpcResponse<boolean>>;
  };

  // 대시보드 API
  dashboard: {
    getStats(days?: number): Promise<IpcResponse<TypingStats>>;
    getSessions(limit?: number): Promise<IpcResponse<TypingSession[]>>;
    exportData(format: 'json' | 'csv'): Promise<IpcResponse<ExportResult>>;
  };

  // 시스템 API
  system: {
    getVersion(): string;
    openExternal(url: string): Promise<void>;
    showInFolder(path: string): Promise<void>;
  };

  // 이벤트 리스너
  on(channel: string, callback: Function): void;
  removeListener(channel: string, callback: Function): void;
}

// 🔥 안전한 API 구현
const electronAPI: ElectronAPI = {
  keyboard: {
    startMonitoring: () => ipcRenderer.invoke('keyboard:start-monitoring'),
    stopMonitoring: () => ipcRenderer.invoke('keyboard:stop-monitoring'),
    getRealtimeStats: () => ipcRenderer.invoke('keyboard:get-realtime-stats'),
    setLanguage: (language: string) => ipcRenderer.invoke('keyboard:set-language', language)
  },

  dashboard: {
    getStats: (days?: number) => ipcRenderer.invoke('dashboard:get-stats', days),
    getSessions: (limit?: number) => ipcRenderer.invoke('dashboard:get-sessions', limit),
    exportData: (format: 'json' | 'csv') => ipcRenderer.invoke('dashboard:export-data', format)
  },

  system: {
    getVersion: () => process.versions.electron,
    openExternal: (url: string) => ipcRenderer.invoke('system:open-external', url),
    showInFolder: (path: string) => ipcRenderer.invoke('system:show-in-folder', path)
  },

  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, callback);
  },

  removeListener: (channel: string, callback: Function) => {
    ipcRenderer.removeListener(channel, callback);
  }
};

// 🔥 Context Bridge로 안전하게 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

### React 컴포넌트에서 API 사용

```typescript
// src/renderer/hooks/useElectronAPI.ts
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export function useKeyboardMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stats, setStats] = useState<RealtimeStats | null>(null);

  const startMonitoring = async (): Promise<boolean> => {
    try {
      const response = await window.electronAPI.keyboard.startMonitoring();
      if (response.success) {
        setIsMonitoring(true);
        return true;
      }
      return false;
    } catch (error) {
      Logger.error('RENDERER', 'Failed to start monitoring', error);
      return false;
    }
  };

  const stopMonitoring = async (): Promise<boolean> => {
    try {
      const response = await window.electronAPI.keyboard.stopMonitoring();
      if (response.success) {
        setIsMonitoring(false);
        return true;
      }
      return false;
    } catch (error) {
      Logger.error('RENDERER', 'Failed to stop monitoring', error);
      return false;
    }
  };

  // 실시간 통계 업데이트
  useEffect(() => {
    const updateStats = async () => {
      if (isMonitoring) {
        const response = await window.electronAPI.keyboard.getRealtimeStats();
        if (response.success) {
          setStats(response.data);
        }
      }
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  return {
    isMonitoring,
    stats,
    startMonitoring,
    stopMonitoring
  };
}
```

## 🔧 디버깅 및 개발 도구

### DevTools 통합

```typescript
export class DevToolsManager {
  public setupDevTools(): void {
    if (process.env.NODE_ENV === 'development') {
      // React DevTools 설치
      this.installExtension('React Developer Tools');
      
      // 자동으로 DevTools 열기
      app.whenReady().then(() => {
        const mainWindow = BrowserWindow.getAllWindows()[0];
        mainWindow?.webContents.openDevTools({ mode: 'detach' });
      });
    }
  }

  private async installExtension(name: string): Promise<void> {
    try {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = 
        await import('electron-devtools-installer');
      
      await installExtension(REACT_DEVELOPER_TOOLS);
      Logger.info('DEVTOOLS', `${name} installed`);
    } catch (error) {
      Logger.error('DEVTOOLS', `Failed to install ${name}`, error);
    }
  }
}
```

### 로그 시스템 연동

```typescript
// Main Process에서 렌더러 로그 수집
ipcMain.handle('log:send', (event, logEntry: LogEntry) => {
  Logger.log(logEntry.level, 'RENDERER', logEntry.message, logEntry.data);
});

// Renderer에서 사용할 로거
export class RendererLogger {
  static debug(component: string, message: string, data?: unknown): void {
    window.electronAPI?.invoke('log:send', {
      level: LogLevel.DEBUG,
      component,
      message,
      data,
      timestamp: new Date()
    });
  }

  // info, warn, error 메서드도 동일하게 구현...
}
```

---

**🔥 Loop의 Electron API 통합은 보안, 성능, 타입 안전성을 모두 고려한 모범 사례를 제시합니다.**
