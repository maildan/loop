// 🔥 기가차드 키보드 IPC 핸들러 - DISABLED (모니터링 기능 제거됨)

import { ipcMain, BrowserWindow } from 'electron';
import { Logger } from '../../shared/logger';
import { IPC_CHANNELS } from '../../shared/types';

// #DEBUG: Keyboard IPC handlers entry point
Logger.debug('KEYBOARD_IPC', 'Keyboard IPC handlers disabled - monitoring feature removed');

// 🔥 기가차드 키보드 모니터링 IPC 핸들러 설정 [DISABLED]
export async function setupKeyboardIpcHandlers(): Promise<void> {
  try {
    Logger.info('KEYBOARD_IPC', '키보드 IPC 핸들러 비활성화됨 - 모니터링 기능 제거');

    // 실제 존재하는 채널들만 더미로 등록
    ipcMain.handle(IPC_CHANNELS.KEYBOARD.START_MONITORING, () => {
      Logger.debug('KEYBOARD_IPC', 'Start monitoring request ignored - disabled');
      return { success: false, message: 'Keyboard monitoring disabled' };
    });

    ipcMain.handle(IPC_CHANNELS.KEYBOARD.STOP_MONITORING, () => {
      Logger.debug('KEYBOARD_IPC', 'Stop monitoring request ignored - disabled');
      return { success: false, message: 'Keyboard monitoring disabled' };
    });

    ipcMain.handle(IPC_CHANNELS.KEYBOARD.GET_STATUS, () => {
      Logger.debug('KEYBOARD_IPC', 'Status request ignored - disabled');
      return {
        success: false,
        isMonitoring: false,
        hasPermission: false,
        message: 'Keyboard monitoring disabled'
      };
    });

    ipcMain.handle(IPC_CHANNELS.KEYBOARD.TEST_LANGUAGE_DETECTION, () => {
      Logger.debug('KEYBOARD_IPC', 'Test language detection request ignored - disabled');
      return { success: false, message: 'Keyboard monitoring disabled' };
    });

    Logger.info('KEYBOARD_IPC', '키보드 IPC 핸들러 더미 등록 완료 - 모든 요청이 비활성화됨');

  } catch (error) {
    Logger.error('KEYBOARD_IPC', 'Error setting up dummy keyboard IPC handlers:', error);
  }
}

// 🔥 키보드 IPC 핸들러 정리 [DISABLED]
export function cleanupKeyboardIpcHandlers(): void {
  try {
    Logger.info('KEYBOARD_IPC', '키보드 IPC 핸들러 정리 시작');

    // 실제 존재하는 핸들러만 제거
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.START_MONITORING);
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.STOP_MONITORING);
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.GET_STATUS);
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.TEST_LANGUAGE_DETECTION);

    Logger.info('KEYBOARD_IPC', '키보드 IPC 핸들러 정리 완료');
  } catch (error) {
    Logger.error('KEYBOARD_IPC', 'Error cleaning up keyboard IPC handlers:', error);
  }
}

// Export default 
export default { setupKeyboardIpcHandlers, cleanupKeyboardIpcHandlers };
