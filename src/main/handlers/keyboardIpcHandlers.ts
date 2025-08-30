// 🔥 기가차드 키보드 IPC 핸들러 - 다국어 모니터링 전문!

import { ipcMain, BrowserWindow } from 'electron';
import { Logger } from '../../shared/logger';
import { IPC_CHANNELS } from '../../shared/types';
import { createSafeIpcHandler, createSafeAsyncIpcHandler } from '../../shared/ipc-utils';
import { keyboardService } from '../keyboard/keyboardService';

// #DEBUG: Keyboard IPC handlers entry point
Logger.time('KEYBOARD_IPC_SETUP');
Logger.debug('KEYBOARD_IPC', 'Setting up keyboard IPC handlers');

// 🔥 기가차드 키보드 모니터링 IPC 핸들러 설정
export async function setupKeyboardIpcHandlers(): Promise<void> {
  try {
    // 🔥 권한 관련 IPC 핸들러 추가
    const { setupPermissionHandlers } = await import('../utils/AutoPermissionManager');
    await setupPermissionHandlers();

    // #DEBUG: Registering keyboard monitoring handlers
    
    // 🔥 모니터링 시작
    ipcMain.handle(
      IPC_CHANNELS.KEYBOARD.START_MONITORING,
      createSafeAsyncIpcHandler
      (
        async (event) => {
          // #DEBUG: IPC call - start monitoring
          Logger.info('KEYBOARD_IPC', '🚀 모니터링 시작 요청 받음');
          
          try {
            // 🔥 현재 권한 상태 확인
            const { ensurePermissionsForKeyboard } = await import('../utils/AutoPermissionManager');
            const hasPermission = await ensurePermissionsForKeyboard();
            
            Logger.info('KEYBOARD_IPC', `권한 상태 확인: ${hasPermission ? '✅ 허용됨' : '❌ 거부됨'}`);
            
            // 🔥 권한 상태를 키보드 서비스에 전달
            keyboardService.setAccessibilityPermission(hasPermission);

            // 🔥 권한이 없어도 시도해보고, 키보드 서비스에서 처리하도록 변경
            const result = await keyboardService.startMonitoring();
            
            if (result.success) {
              Logger.info('KEYBOARD_IPC', '✅ 모니터링 시작 성공');
            } else {
              Logger.warn('KEYBOARD_IPC', '⚠️ 모니터링 시작 실패:', result.error);
            }
            
            return result.data;
          } catch (error) {
            Logger.error('KEYBOARD_IPC', '❌ 모니터링 시작 중 예외 발생:', error);
            throw error;
          }
        },
        'KEYBOARD_IPC',
        'Start keyboard monitoring'
      )
    );

    // 🔥 모니터링 중지
    ipcMain.handle(
      IPC_CHANNELS.KEYBOARD.STOP_MONITORING,
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - stop monitoring
          Logger.debug('KEYBOARD_IPC', 'IPC: Stop monitoring requested');
          const result = await keyboardService.stopMonitoring();
          return result.data;
        },
        'KEYBOARD_IPC',
        'Stop keyboard monitoring'
      )
    );

    // 🔥 모니터링 상태 조회
    ipcMain.handle(
      IPC_CHANNELS.KEYBOARD.GET_STATUS,
      createSafeAsyncIpcHandler(
        async (event) => {
          // #DEBUG: IPC call - get status
          Logger.debug('KEYBOARD_IPC', 'IPC: Status requested');
          const result = await keyboardService.getStatus();
          
          // 🔥 IpcResponse 형태로 반환 + Analytics 필수 필드 추가
          if (result.success && result.data) {
            const statusData = {
              isActive: Boolean(result.data.isActive),
              language: String(result.data.language || 'auto'),
              inputMethod: String(result.data.inputMethod || 'unknown'),
              eventsPerSecond: Number(result.data.eventsPerSecond || 0),
              totalEvents: Number(result.data.totalEvents || 0),
              startTime: result.data.startTime ? result.data.startTime.toISOString() : null,
              // 🔥 Analytics에서 요구하는 필드 추가
              sessionDuration: result.data.startTime ? 
                Math.floor((Date.now() - result.data.startTime.getTime()) / 1000) : 0,
              hasPermission: true
            };
            
            Logger.debug('KEYBOARD_IPC', 'Status data serialized with analytics fields', statusData);
            return statusData;
          }
          
          const fallbackData = {
            isActive: false,
            language: 'auto',
            inputMethod: 'unknown',
            eventsPerSecond: 0,
            totalEvents: 0,
            startTime: null,
            sessionDuration: 0,
            hasPermission: true
          };
          
          Logger.debug('KEYBOARD_IPC', 'Returning fallback status data', fallbackData);
          return fallbackData;
        },
        'KEYBOARD_IPC',
        'Get keyboard monitoring status'
      )
    );

    // 🔥 언어 설정 변경
    ipcMain.handle(
      'keyboard:set-language',
      createSafeIpcHandler(
        (event: unknown, language: unknown) => {
          // #DEBUG: IPC call - set language
          const langStr = String(language);
          Logger.debug('KEYBOARD_IPC', 'IPC: Set language requested', { language: langStr });
          return keyboardService.setLanguage(langStr);
        },
        'KEYBOARD_IPC',
        'Set keyboard language'
      )
    );

    // 🔥 최근 이벤트 조회
    ipcMain.handle(
      'keyboard:get-recent-events',
      createSafeIpcHandler(
        (event: unknown, count: unknown = 10) => {
          // #DEBUG: IPC call - get recent events
          const countNum = typeof count === 'number' ? count : 10;
          Logger.debug('KEYBOARD_IPC', 'IPC: Recent events requested', { count: countNum });
          return keyboardService.getRecentEvents(countNum);
        },
        'KEYBOARD_IPC',
        'Get recent keyboard events'
      )
    );

    // 🔥 실시간 통계 조회
    ipcMain.handle('keyboard:get-realtime-stats', createSafeAsyncIpcHandler(
      async () => {
        Logger.debug('KEYBOARD_IPC', 'IPC: Get realtime stats requested');
        
        try {
          // TODO: 실제 실시간 통계 구현
          const realtimeStats = {
            currentWpm: 0,
            charactersTyped: 0,
            sessionTime: 0,
            accuracy: 0,
          };
          
          return realtimeStats;
        } catch (error) {
          Logger.error('KEYBOARD_IPC', 'Failed to get realtime stats', error);
          throw error;
        }
      },
      'KEYBOARD_IPC',
      'Get realtime statistics'
    ));

    // 🔥 한글 강제 설정 (디버깅용)
    ipcMain.handle('keyboard:force-korean', createSafeAsyncIpcHandler(
      async () => {
        Logger.info('KEYBOARD_IPC', 'IPC: Force Korean language requested');
        
        const result = keyboardService.forceKoreanLanguage();
        
        Logger.info('KEYBOARD_IPC', 'Force Korean result', { success: result });
        return result;
      },
      'KEYBOARD_IPC',
      'Force Korean language setting'
    ));

    // 🔥 언어 감지 테스트 (디버깅용)
    ipcMain.handle('keyboard:test-language-detection', createSafeAsyncIpcHandler(
      async (event, ...args: unknown[]) => {
        const keycode = args[0] as number;
        const keychar = args[1] as number | undefined;
        
        Logger.info('KEYBOARD_IPC', 'IPC: Language detection test requested', { keycode, keychar });
        
        const result = await keyboardService.testLanguageDetection(keycode, keychar);
        
        Logger.info('KEYBOARD_IPC', 'Language detection test result', { result, keycode, keychar });
        return result;
      },
      'KEYBOARD_IPC',
      'Test language detection'
    ));

    // 🔥 새로운 다국어 지원 IPC 핸들러들

    // 언어 감지 (단일 키코드)
    ipcMain.handle('keyboard:detect-language', createSafeIpcHandler(
      (event: unknown, keycode: unknown) => {
        const keycodeNum = typeof keycode === 'number' ? keycode : 0;
        Logger.debug('KEYBOARD_IPC', 'IPC: Detect language requested', { keycode: keycodeNum });
        
        const detectedLanguage = keyboardService.testLanguageDetection(keycodeNum);
        
        Logger.debug('KEYBOARD_IPC', 'Language detected', { keycode: keycodeNum, detectedLanguage });
        return detectedLanguage;
      },
      'KEYBOARD_IPC',
      'Detect language from keycode'
    ));

    // 지원되는 언어 목록 조회
    ipcMain.handle('keyboard:get-supported-languages', createSafeIpcHandler(
      () => {
        Logger.debug('KEYBOARD_IPC', 'IPC: Get supported languages requested');
        
        const supportedLanguages = ['ko', 'en', 'ja', 'zh'];
        
        Logger.debug('KEYBOARD_IPC', 'Supported languages returned', { languages: supportedLanguages });
        return supportedLanguages;
      },
      'KEYBOARD_IPC',
      'Get supported languages'
    ));

    // 입력 방식 설정
    ipcMain.handle('keyboard:set-input-method', createSafeAsyncIpcHandler(
      async (event: unknown, method: unknown) => {
        const methodStr = typeof method === 'string' ? method as 'direct' | 'composition' : 'composition';
        Logger.info('KEYBOARD_IPC', 'IPC: Set input method requested', { method: methodStr });
        
        // KeyboardService에 입력 방식 설정 메서드 호출
        const result = await keyboardService.setLanguage(methodStr === 'composition' ? 'ko' : 'en');
        
        Logger.info('KEYBOARD_IPC', 'Input method set', { method: methodStr, result });
        return result;
      },
      'KEYBOARD_IPC',
      'Set input method'
    ));

    // 조합 상태 초기화
    ipcMain.handle('keyboard:reset-composition', createSafeIpcHandler(
      () => {
        Logger.info('KEYBOARD_IPC', 'IPC: Reset composition requested');
        
        // HangulComposer 초기화 (KeyboardService 경유)
        const result = keyboardService.forceKoreanLanguage();
        
        Logger.info('KEYBOARD_IPC', 'Composition reset', { result });
        return result;
      },
      'KEYBOARD_IPC',
      'Reset composition state'
    ));

    // 조합 상태 조회
    ipcMain.handle('keyboard:get-composition-state', createSafeIpcHandler(
      async () => {
        Logger.debug('KEYBOARD_IPC', 'IPC: Get composition state requested');
        
        // HangulComposer에서 직접 조합 상태 가져오기
        const compositionState = {
          isComposing: false, // 기본값, 실제로는 HangulComposer.getCompositionState() 사용
          composingText: '' // 추후 HangulComposer에서 실제 조합 중인 텍스트 반환
        };
        
        Logger.debug('KEYBOARD_IPC', 'Composition state returned', compositionState);
        return compositionState;
      },
      'KEYBOARD_IPC',
      'Get composition state'
    ));

    // 🔥 키보드 이벤트 포워딩 설정
    keyboardService.on('keyboard-event', (event: unknown) => {
      // #DEBUG: Forwarding keyboard event to renderer
      const mainWindow = (global as Record<string, unknown>).mainWindow as BrowserWindow | undefined;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC_CHANNELS.KEYBOARD.EVENT, event);
        
        // 타입 가드로 안전하게 로깅
        const eventData = event as { type?: string; language?: string };
        Logger.debug('KEYBOARD_IPC', 'Event forwarded to renderer', {
          eventType: eventData.type || 'unknown',
          language: eventData.language || 'unknown'
        });
      }
    });

    Logger.timeEnd('KEYBOARD_IPC_SETUP');
    Logger.info('KEYBOARD_IPC', 'Keyboard IPC handlers setup completed', {
      handlersCount: 6,
      setupTime: 'measured'
    });

  } catch (error) {
    Logger.error('KEYBOARD_IPC', 'Failed to setup keyboard IPC handlers', error);
    throw error;
  }
}

// 🔥 기가차드 IPC 핸들러 정리
export function cleanupKeyboardIpcHandlers(): void {
  try {
    // #DEBUG: Cleaning up keyboard IPC handlers
    Logger.debug('KEYBOARD_IPC', 'Cleaning up keyboard IPC handlers');

    // 모든 키보드 관련 IPC 핸들러 제거
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.START_MONITORING);
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.STOP_MONITORING);
    ipcMain.removeHandler(IPC_CHANNELS.KEYBOARD.GET_STATUS);
    ipcMain.removeHandler('keyboard:set-language');
    ipcMain.removeHandler('keyboard:get-recent-events');
    ipcMain.removeHandler('keyboard:get-realtime-stats');
    ipcMain.removeHandler('keyboard:force-korean');
    ipcMain.removeHandler('keyboard:test-language-detection');
    ipcMain.removeHandler('keyboard:detect-language');
    ipcMain.removeHandler('keyboard:get-supported-languages');
    ipcMain.removeHandler('keyboard:set-input-method');
    ipcMain.removeHandler('keyboard:reset-composition');
    ipcMain.removeHandler('keyboard:get-composition-state');

    // 키보드 서비스 이벤트 리스너 정리
    keyboardService.removeAllListeners();

    Logger.info('KEYBOARD_IPC', 'Keyboard IPC handlers cleaned up');

  } catch (error) {
    Logger.error('KEYBOARD_IPC', 'Failed to cleanup keyboard IPC handlers', error);
  }
}

// #DEBUG: Keyboard IPC handlers module exit point
Logger.debug('KEYBOARD_IPC', 'Keyboard IPC handlers module loaded');

export default {
  setupKeyboardIpcHandlers,
  cleanupKeyboardIpcHandlers,
};
