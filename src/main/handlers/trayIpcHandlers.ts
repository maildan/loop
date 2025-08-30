// 🔥 기가차드 Tray IPC 핸들러 - 시스템 트레이 연결!

import { ipcMain } from 'electron';
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
      const info = trayManager.getTrayInfo();
      
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

  // 🔥 키보드 모니터링 상태 업데이트
  ipcMain.handle('tray:set-monitoring-status', async (_: any, isMonitoring: boolean) => {
    try {
      const trayManager = getTrayManager();
      trayManager.setKeyboardMonitoringStatus(isMonitoring);
      
      Logger.debug(componentName, 'Keyboard monitoring status updated', { isMonitoring });
      return {
        success: true,
        data: { isMonitoring }
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to set monitoring status', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 통계 업데이트
  ipcMain.handle('tray:update-stats', async (_: any, stats: { wpm: number; accuracy: number; sessionTime: number }) => {
    try {
      const trayManager = getTrayManager();
      trayManager.updateStats(stats);
      
      Logger.debug(componentName, 'Tray stats updated', stats);
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      Logger.error(componentName, 'Failed to update tray stats', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // 🔥 성공 알림 표시
  ipcMain.handle('tray:show-success', async (_: any, message: string) => {
    try {
      const trayManager = getTrayManager();
      trayManager.showSuccessNotification(message);
      
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
  ipcMain.handle('tray:show-error', async (_: any, errorMessage: string) => {
    try {
      const trayManager = getTrayManager();
      trayManager.showErrorStatus(errorMessage);
      
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
      
      const info = trayManager.getTrayInfo();
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
      
      const info = trayManager.getTrayInfo();
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
    'tray:set-monitoring-status',
    'tray:update-stats',
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
