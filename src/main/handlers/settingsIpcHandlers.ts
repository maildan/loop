// 🔥 기가차드 Settings IPC 핸들러 - electron-store 기반 완전 리팩토링

import { ipcMain, IpcMainInvokeEvent, app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';
import { getElectronStoreSettingsManager } from '../settings/ElectronStoreSettingsManager';
import { validatePathSafety } from '../../shared/utils/pathSecurity';
import { promises as fsPromises } from 'fs';
import {
  isAllowedSettingsKey,
  validateSettingValue,
  ALLOWED_SETTINGS_KEYS,
} from '../../shared/validation/settingsValidation';
import { channelLimiters } from '../services/RateLimiterService';

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
  // 🔒 V2 보안 수정: 화이트리스트 기반 키 검증
  // 🔒 V4 보안 수정: 속도 제한 (Rate Limiting)
  ipcMain.handle('settings:set', async (_event: IpcMainInvokeEvent, keyPath: string, value: unknown): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug(componentName, 'Setting value', { keyPath, value });

      // 🔒 V4 단계 0: 속도 제한 검증
      const rateLimitKey = 'settings:set';
      const limiter = channelLimiters[rateLimitKey];
      if (limiter) {
        const limitResult = limiter.checkLimit(keyPath); // keyPath별로 추적
        if (!limitResult.allowed) {
          Logger.warn(componentName, '⚠️ V4 Rate limit exceeded for settings:set', {
            keyPath,
            retryAfterMs: limitResult.retryAfter,
            requestCount: limitResult.requestCount,
          });
          return {
            success: false,
            error: `Too many settings changes. Please try again after ${Math.ceil(limitResult.retryAfter / 1000)}s`,
            timestamp: new Date(),
          };
        }
        Logger.debug(componentName, '✅ V4 Rate limit check passed', {
          keyPath,
          remaining: limitResult.remaining,
        });
      }

      // 🔒 V2 단계 1: 키 경로 화이트리스트 검증
      if (!isAllowedSettingsKey(keyPath)) {
        Logger.warn(componentName, 'Unauthorized settings key attempted', {
          keyPath,
          allowedKeys: ALLOWED_SETTINGS_KEYS.length,
          remoteAddress: (_event.sender as any)?.getURL?.(),
        });
        return {
          success: false,
          error: `Invalid settings key: ${keyPath}. Please use allowed settings only.`,
          timestamp: new Date(),
        };
      }

      // 🔒 V2 단계 2: 값 타입 검증
      try {
        validateSettingValue(keyPath, value);
      } catch (validationError) {
        Logger.warn(componentName, 'Settings value validation failed', {
          keyPath,
          error: validationError instanceof Error ? validationError.message : String(validationError),
        });
        return {
          success: false,
          error: validationError instanceof Error ? validationError.message : 'Invalid value type',
          timestamp: new Date(),
        };
      }

      // 🔒 V2 단계 3: 설정 저장
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
  // 🔒 V1 보안 수정: 심링크 해석 및 경로 검증
  ipcMain.handle('settings:read-file', async (_event: IpcMainInvokeEvent, filePath: string): Promise<IpcResponse<string>> => {
    try {
      // Use fs promises for async safe IO
      // 파일 경로가 userData 디렉토리 내부인지 검증
      const userDataPath = app.getPath('userData');

      // 🔒 1단계: 기본 경로 해석
      const resolvedPath = path.resolve(filePath);

      // 🔒 2단계: 경로 안전성 검증
      if (!validatePathSafety(resolvedPath, userDataPath)) {
        Logger.warn(componentName, 'Path traversal attempt detected in settings:read-file', {
          requestedPath: filePath,
          resolvedPath,
          userDataPath,
        });
        return {
          success: false,
          error: 'Access denied: File must be within userData directory',
          timestamp: new Date(),
        };
      }

      // 🔒 3단계: 심링크 해석 및 재검증 (심링크 공격 방어)
      let realPath: string;
      try {
        realPath = fs.realpathSync(resolvedPath);
      } catch (err) {
        Logger.warn(componentName, 'Failed to resolve real path (symlink check)', {
          resolvedPath,
          error: err instanceof Error ? err.message : String(err),
        });
        return {
          success: false,
          error: 'Invalid file path or insufficient permissions',
          timestamp: new Date(),
        };
      }

      // 🔒 4단계: 심링크 해석 후 경로 재검증
      if (!validatePathSafety(realPath, userDataPath)) {
        Logger.warn(componentName, 'Symlink escape attempt detected in settings:read-file', {
          requestedPath: filePath,
          resolvedPath,
          realPath,
          userDataPath,
        });
        return {
          success: false,
          error: 'Access denied: Symlink points outside userData directory',
          timestamp: new Date(),
        };
      }

      // 🔒 5단계: 파일 읽기 (nosemgrep: 이미 경로 검증됨)
      // nosemgrep: javascript-pathtraversal-rule-non-literal-fs-filename
      const data = await fsPromises.readFile(realPath);
      const ext = (realPath.split('.').pop() || 'png').toLowerCase();
      const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
      const dataUrl = `data:${mime};base64,${data.toString('base64')}`;
      return { success: true, data: dataUrl, timestamp: new Date() };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      };
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
