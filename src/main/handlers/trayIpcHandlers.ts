// 🔥 기가차드 Tray IPC 핸들러 - 시스템 트레이 연결!

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { getTrayManager } from '../managers/TrayManager';

const componentName = 'TRAY_IPC';

/**
 * 🔥 Tray IPC 핸들러 설정
 */
export function setupTrayIpcHandlers(): void {
  Logger.info(componentName, 'Setting up Tray IPC handlers...');

  // 🔥 트레이 상태 정보 가져오기
  ipcMain.handle('tray:get-info', async () => {
    try {
      const trayManager = getTrayManager();
      const info = await trayManager.getTrayInfo();
      
      Logger.debug(componentName, 'Tray info retrieved', info);
      return {
        success: true,
        data: info
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to get tray info', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 성공 알림 표시
  ipcMain.handle('tray:show-success', async (_: IpcMainInvokeEvent, message: string) => {
    try {
      const trayManager = getTrayManager();
      await trayManager.showSuccessNotification(message);
      
      Logger.debug(componentName, 'Success notification sent', { message });
      return {
        success: true,
        data: { message }
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to show success notification', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 에러 상태 표시
  ipcMain.handle('tray:show-error', async (_: IpcMainInvokeEvent, errorMessage: string) => {
    try {
      const trayManager = getTrayManager();
      await trayManager.showErrorStatus(errorMessage);
      
      Logger.debug(componentName, 'Error status sent', { errorMessage });
      return {
        success: true,
        data: { errorMessage }
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to show error status', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 트레이 표시/숨기기 토글
  ipcMain.handle('tray:toggle-visibility', async () => {
    try {
      const trayManager = getTrayManager();
      await trayManager.toggleTrayVisibility();
      
      const info = await trayManager.getTrayInfo();
      Logger.debug(componentName, 'Tray visibility toggled', info);
      return {
        success: true,
        data: info
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to toggle tray visibility', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 트레이 테스트 (개발용)
  ipcMain.handle('tray:test', async () => {
    try {
      const trayManager = getTrayManager();
      await trayManager.testTray();
      
      const info = await trayManager.getTrayInfo();
      Logger.info(componentName, 'Tray test completed', info);
      return {
        success: true,
        data: info
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to test tray', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  Logger.info(componentName, 'Tray IPC handlers setup completed');
}

/**
 * 🔥 Tray IPC 핸들러 정리
 */
export function cleanupTrayIpcHandlers(): void {
  Logger.info(componentName, 'Cleaning up Tray IPC handlers...');
  
  // 모든 tray 관련 IPC 핸들러 제거
  const trayChannels = [
    'tray:get-info',
    'tray:show-success',
    'tray:show-error',
    'tray:toggle-visibility',
    'tray:test'
  ];
  
  trayChannels.forEach(channel => {
    ipcMain.removeAllListeners(channel);
  });
  
  Logger.info(componentName, 'Tray IPC handlers cleanup completed');
}
