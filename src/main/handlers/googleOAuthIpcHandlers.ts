// 🔥 기가차드 Google OAuth IPC 핸들러 - 실제 Google Docs 연동!

import { ipcMain } from 'electron';
import { Logger } from '../../shared/logger';
import { createSafeAsyncIpcHandler } from '../../shared/ipc-utils';
import { googleOAuthService } from '../services/googleOAuthService';
import { z } from 'zod';

const componentName = 'GOOGLE_OAUTH_IPC';

/**
 * 🔥 Google OAuth IPC 핸들러 설정
 */
export function setupGoogleOAuthIpcHandlers(): void {
  try {
    Logger.info(componentName, '🚀 Google OAuth IPC 핸들러 설정 시작');

    // 🔥 Google OAuth 인증 시작
    ipcMain.handle(
      'google-oauth:start-auth',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.info(componentName, '🔐 Google OAuth 인증 시작 요청');
          const result = await googleOAuthService.startAuthentication();

          if (result.success) {
            Logger.info(componentName, '✅ Google OAuth 인증 URL 생성 완료');
          } else {
            Logger.error(componentName, '❌ Google OAuth 인증 시작 실패', result.error);
          }

          // startAuthentication()도 Result를 반환하므로 data만 추출
          if (result.success && result.data) {
            return result.data;
          }
          if (!result.success) {
            throw new Error(result.error || '인증 시작 실패');
          }
          throw new Error('인증 시작 실패');
        },
        componentName,
        'Start Google OAuth authentication'
      )
    );

    // 🔥 인증 코드 처리
    const codeSchema = z.string().min(10).max(2048);
    const stateSchema = z.string().min(8).max(1024).optional();

    ipcMain.handle(
      'google-oauth:handle-callback',
      createSafeAsyncIpcHandler(
        async (...args: unknown[]) => {
          const [, code, state] = args;
          Logger.info(componentName, '🔄 Google OAuth 콜백 처리 중...');

          const parsed = codeSchema.safeParse(code);
          if (!parsed.success) {
            Logger.warn(componentName, 'Invalid OAuth callback code');
            return { success: false, error: 'Invalid callback code' };
          }

          const parsedState = stateSchema.safeParse(state);

          const stateValue: string = parsedState.success && parsedState.data ? parsedState.data : '';
          const result = await googleOAuthService.handleCallback(parsed.data, stateValue);

          if (result.success) {
            Logger.info(componentName, '✅ Google OAuth 인증 완료');
          } else {
            Logger.error(componentName, '❌ Google OAuth 콜백 처리 실패', result.error);
          }

          return result;
        },
        componentName,
        'Handle Google OAuth callback'
      )
    );

    // 🔥 연결 상태 확인
    ipcMain.handle(
      'google-oauth:check-connection',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.debug(componentName, '🔍 Google OAuth 연결 상태 확인');
          const result = await googleOAuthService.getConnectionStatus();
          // 주의: getConnectionStatus()는 이미 Result 객체를 반환함
          // 따라서 래퍼가 이중 래핑하지 않도록 data 필드만 추출해서 반환
          if (result.success && result.data) {
            return {
              isConnected: result.data.isConnected,
              email: result.data.email,
            };
          }
          if (!result.success) {
            throw new Error(result.error || '연결 상태 확인 실패');
          }
          throw new Error('연결 상태 확인 실패');
        },
        componentName,
        'Check Google OAuth connection status'
      )
    );

    // 🔥 사용자 정보 조회 (임시 비활성화)
    ipcMain.handle(
      'google-oauth:get-user-info',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.info(componentName, '👤 Google 사용자 정보 조회 (임시 비활성화)');
          return {
            success: false,
            error: '아직 구현되지 않음'
          };
        },
        componentName,
        'Get Google user information'
      )
    );

    // 🔥 Google Docs 문서 생성 (임시)
    ipcMain.handle(
      'google-docs:create-document',
      createSafeAsyncIpcHandler(
        async (...args: unknown[]) => {
          const [, title, content] = args;
          Logger.info(componentName, `📝 Google Docs 문서 생성: ${title} (임시 비활성화)`);
          return {
            success: false,
            error: '아직 구현되지 않음'
          };
        },
        componentName,
        'Create Google Docs document'
      )
    );

    // 🔥 Google Docs 문서 업데이트 (임시)
    ipcMain.handle(
      'google-docs:update-document',
      createSafeAsyncIpcHandler(
        async (...args: unknown[]) => {
          const [, documentId, content] = args;
          Logger.info(componentName, `📝 Google Docs 문서 업데이트: ${documentId} (임시 비활성화)`);
          return {
            success: false,
            error: '아직 구현되지 않음'
          };
        },
        componentName,
        'Update Google Docs document'
      )
    );

    // 🔥 Google Docs 문서 목록 조회
    ipcMain.handle(
      'google-docs:list-documents',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.info(componentName, '📚 Google Docs 문서 목록 조회');
          const result = await googleOAuthService.listDocuments();
          // listDocuments()는 이미 Result 객체를 반환하므로
          // 래퍼가 이중 래핑하지 않도록 data만 추출해서 반환
          if (result.success && result.data) {
            return result.data;  // 배열을 직접 반환
          }
          if (!result.success) {
            throw new Error(result.error || '문서 목록 조회 실패');
          }
          throw new Error('문서 목록 조회 실패');
        },
        componentName,
        'List Google Docs documents'
      )
    );

    // 🔥 연결 해제
    ipcMain.handle(
      'google-oauth:disconnect',
      createSafeAsyncIpcHandler(
        async () => {
          Logger.info(componentName, '🔌 Google OAuth 연결 해제');
          const result = await googleOAuthService.disconnect();

          if (result.success) {
            Logger.info(componentName, '✅ Google OAuth 연결 해제 완료');
          } else {
            Logger.error(componentName, '❌ Google OAuth 연결 해제 실패', result.error);
          }

          // disconnect()도 Result를 반환하므로 data만 추출 (boolean 성공 여부)
          if (result.success && result.data !== undefined) {
            return result.data;
          }
          if (!result.success) {
            throw new Error(result.error || '연결 해제 실패');
          }
          return true;  // 성공
        },
        componentName,
        'Disconnect Google OAuth'
      )
    );

    Logger.info(componentName, '✅ Google OAuth IPC 핸들러 설정 완료');

  } catch (error) {
    Logger.error(componentName, '❌ Google OAuth IPC 핸들러 설정 실패', error);
    throw error;
  }
}

/**
 * 🔥 Directly handle callback from StaticServer (OAuth 콜백 → 토큰 저장)
 */
export async function handleGoogleOAuthCallbackDirect(code: string, state?: string | null): Promise<any> {
  try {
    Logger.debug(componentName, '🔄 Google OAuth 콜백 처리 (StaticServer에서 호출)');
    const result = await googleOAuthService.handleCallback(code, state || '');
    Logger.debug(componentName, 'handleGoogleOAuthCallbackDirect result', { success: result.success });
    return result;
  } catch (error) {
    Logger.error(componentName, 'Direct handleGoogleOAuthCallback failed', error);
    return { success: false, error: 'Google OAuth callback handling failed' };
  }
}
