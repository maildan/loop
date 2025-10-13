'use strict';

// MIGRATION: MIGRATED FROM projectIpcHandlers.ts:558-579
// MIGRATION: TODO verify shell.openExternal error handling

import { ipcMain, IpcMainInvokeEvent, shell } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';

/**
 * 🔥 Shell 유틸리티 IPC 핸들러
 * 
 * 등록된 채널:
 * - shell:open-external
 */
export function registerShellHandlers(): void {
  Logger.debug('SHELL_IPC', 'Registering shell IPC handlers');

  // 🔥 External shell handler 추가
  ipcMain.handle('shell:open-external', async (_event: IpcMainInvokeEvent, url: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('SHELL_IPC', 'Opening external URL', { url });
      await shell.openExternal(url);

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('SHELL_IPC', 'Failed to open external URL', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to open URL',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('SHELL_IPC', '✅ Shell IPC handlers registered');
}
