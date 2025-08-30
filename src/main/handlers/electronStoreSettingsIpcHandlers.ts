// 🔥 기가차드 Electron Store Settings IPC 핸들러

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { getElectronStoreSettingsManager } from '../settings/ElectronStoreSettingsManager';
import { IpcResponse } from '../../shared/types';

const componentName = 'ELECTRON_STORE_SETTINGS_IPC';

/**
 * 🔥 Electron Store Settings IPC 핸들러 설정
 */
export function setupElectronStoreSettingsIpcHandlers(): void {
  Logger.info(componentName, 'Setting up Electron Store Settings IPC handlers...');

  // 🔥 모든 설정 가져오기
  ipcMain.handle('electron-store-settings:get-all', async (): Promise<IpcResponse<any>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      const settings = settingsManager.getAll();
      
      Logger.debug(componentName, 'All settings retrieved');
      return {
        success: true,
        data: settings,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get all settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  // 🔥 카테고리별 설정 가져오기
  ipcMain.handle('electron-store-settings:get-category', async (_: IpcMainInvokeEvent, category: string): Promise<IpcResponse<any>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      const categorySettings = settingsManager.get(category as any);
      
      Logger.debug(componentName, `Category '${category}' settings retrieved`);
      return {
        success: true,
        data: categorySettings,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error(componentName, `Failed to get '${category}' settings`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  // 🔥 개별 설정값 가져오기
  ipcMain.handle('electron-store-settings:get', async (_: IpcMainInvokeEvent, category: string, key?: string): Promise<IpcResponse<any>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      let value;
      
      if (key) {
        value = settingsManager.get(category as any, key as any);
      } else {
        value = settingsManager.get(category as any);
      }
      
      Logger.debug(componentName, `Setting retrieved: ${category}.${key}`, { value });
      return {
        success: true,
        data: value,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error(componentName, `Failed to get setting: ${category}.${key}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  // 🔥 카테고리별 설정 저장
  ipcMain.handle('electron-store-settings:set-category', async (_: IpcMainInvokeEvent, category: string, value: any): Promise<IpcResponse<boolean>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      const success = settingsManager.set(category as any, value);
      
      if (success) {
        Logger.debug(componentName, `Category '${category}' settings updated`);
        return {
          success: true,
          data: true,
          timestamp: new Date()
        };
      } else {
        return {
          success: false,
          error: 'Failed to save category settings',
          timestamp: new Date()
        };
      }
    } catch (error) {
      Logger.error(componentName, `Failed to set '${category}' settings`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  // 🔥 개별 설정값 저장
  ipcMain.handle('electron-store-settings:set', async (_: IpcMainInvokeEvent, category: string, key: string, value: any): Promise<IpcResponse<boolean>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      const success = settingsManager.set(category as any, key as any, value);
      
      if (success) {
        Logger.debug(componentName, `Setting updated: ${category}.${key}`, { value });
        return {
          success: true,
          data: true,
          timestamp: new Date()
        };
      } else {
        return {
          success: false,
          error: 'Failed to save setting',
          timestamp: new Date()
        };
      }
    } catch (error) {
      Logger.error(componentName, `Failed to set setting: ${category}.${key}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  // 🔥 설정 리셋
  ipcMain.handle('electron-store-settings:reset', async (_: IpcMainInvokeEvent, category?: string): Promise<IpcResponse<boolean>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      const success = settingsManager.reset(category as any);
      
      if (success) {
        Logger.info(componentName, `Settings reset: ${category || 'all'}`);
        return {
          success: true,
          data: true,
          timestamp: new Date()
        };
      } else {
        return {
          success: false,
          error: 'Failed to reset settings',
          timestamp: new Date()
        };
      }
    } catch (error) {
      Logger.error(componentName, `Failed to reset settings: ${category}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  // 🔥 스토어 정보 가져오기
  ipcMain.handle('electron-store-settings:get-info', async (): Promise<IpcResponse<{ path: string; size: number }>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      const info = {
        path: settingsManager.getStorePath(),
        size: settingsManager.getStoreSize()
      };
      
      Logger.debug(componentName, 'Store info retrieved', info);
      return {
        success: true,
        data: info,
        timestamp: new Date()
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get store info', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  // 🔥 성능 설정 특화 핸들러
  ipcMain.handle('electron-store-settings:set-performance', async (_: IpcMainInvokeEvent, settings: any): Promise<IpcResponse<boolean>> => {
    try {
      const settingsManager = getElectronStoreSettingsManager();
      const success = settingsManager.set('performance', settings);
      
      if (success) {
        Logger.info(componentName, 'Performance settings updated', settings);
        return {
          success: true,
          data: true,
          timestamp: new Date()
        };
      } else {
        return {
          success: false,
          error: 'Failed to save performance settings',
          timestamp: new Date()
        };
      }
    } catch (error) {
      Logger.error(componentName, 'Failed to set performance settings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  });

  Logger.info(componentName, '✅ Electron Store Settings IPC handlers setup complete');
}
