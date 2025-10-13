// 🔥 기가차드 Settings IPC 핸들러 - electron-store 기반 완전 리팩토링

import { ipcMain, IpcMainInvokeEvent, app, BrowserWindow } from 'electron';
import path from 'path';
import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';
import { getElectronStoreSettingsManager } from '../settings/ElectronStoreSettingsManager';
import { validatePathSafety } from '../../shared/utils/pathSecurity';
import { promises as fsPromises } from 'fs';

const componentName = 'SETTINGS_IPC';

/**
 * 🔥 Settings IPC 핸들러 설정 (electron-store 기반)
 */
export function setupSettingsIpcHandlers(): void {
  Logger.info(componentName, 'Setting up electron-store based Settings IPC handlers...');

  const settingsManager = getElectronStoreSettingsManager();

  // 🔥 모든 설정 가져오기
  ipcMain.handle('settings:get-all', async (): Promise<IpcResponse<unknown>> => {
    try {
      Logger.debug(componentName, 'Getting all settings');

      const allSettings = settingsManager.getAll();

      return {
        success: true,
        data: allSettings,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get all settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 특정 설정 가져오기 (dot notation 지원)
  ipcMain.handle('settings:get', async (_event: IpcMainInvokeEvent, keyPath: string): Promise<IpcResponse<unknown>> => {
    try {
      Logger.debug(componentName, 'Getting setting', { keyPath });

      const value = settingsManager.getDeep(keyPath);

      return {
        success: true,
        data: value,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get setting', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 설정 저장하기 (dot notation 지원)
  // 🔥 ASYNC: setDeep now async for avatar file operations
  ipcMain.handle('settings:set', async (_event: IpcMainInvokeEvent, keyPath: string, value: unknown): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug(componentName, 'Setting value', { keyPath, value });

      const success = await settingsManager.setDeep(keyPath, value);
      // broadcast change to all renderer windows so they can update immediately
      try {
        const allWindows = BrowserWindow.getAllWindows();
        for (const w of allWindows) {
          try {
            w.webContents.send('settings:changed', { keyPath, value });
          } catch (e) {
            // ignore per-window failures
          }
        }
      } catch (e) {
        Logger.warn(componentName, 'Failed to broadcast settings change', e);
      }

      return {
        success: true,
        data: success,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to set setting', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 설정 리셋
  ipcMain.handle('settings:reset', async (_event: IpcMainInvokeEvent, category?: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.info(componentName, 'Resetting settings', { category });

      const success = settingsManager.reset(category as any);

      // broadcast reset
      try {
        const allWindows = BrowserWindow.getAllWindows();
        for (const w of allWindows) {
          try {
            w.webContents.send('settings:changed', { keyPath: category || 'all', value: null, reset: true });
          } catch (e) { }
        }
      } catch (e) { }

      return {
        success: true,
        data: success,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to reset settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info(componentName, '✅ electron-store based Settings IPC handlers setup complete');

  // Read local file as data URL (used for avatar file:// paths)
  // 🔒 보안: renderer에서 받은 파일 경로는 반드시 userData 디렉토리 내부로 제한
  ipcMain.handle('settings:read-file', async (_event: IpcMainInvokeEvent, filePath: string): Promise<IpcResponse<string>> => {
    try {
  // Use fs promises for async safe IO
  // 파일 경로가 userData 디렉토리 내부인지 검증
  const userDataPath = app.getPath('userData');
  const resolvedPath = path.resolve(filePath);
      
      if (!validatePathSafety(resolvedPath, userDataPath)) {
        Logger.warn(componentName, 'Path traversal attempt detected in settings:read-file', { 
          requestedPath: filePath,
          resolvedPath,
          userDataPath 
        });
        return { 
          success: false, 
          error: 'Access denied: File must be within userData directory', 
          timestamp: new Date() 
        };
      }
      
  // nosemgrep: javascript-pathtraversal-rule-non-literal-fs-filename
  const data = await fsPromises.readFile(resolvedPath);
  const ext = (resolvedPath.split('.').pop() || 'png').toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
  const dataUrl = `data:${mime};base64,${data.toString('base64')}`;
      return { success: true, data: dataUrl, timestamp: new Date() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error), timestamp: new Date() };
    }
  });
}

/**
 * 🔥 Settings IPC 핸들러 정리
 */
export function cleanupSettingsIpcHandlers(): void {
  ipcMain.removeHandler('settings:get-all');
  ipcMain.removeHandler('settings:get');
  ipcMain.removeHandler('settings:set');
  ipcMain.removeHandler('settings:reset');
  ipcMain.removeHandler('settings:read-file');

  Logger.info(componentName, '✅ Settings IPC handlers cleanup complete');
}
