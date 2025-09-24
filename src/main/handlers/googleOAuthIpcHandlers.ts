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
          const result = await googleOAuthService.startAuthentication();

          if (!result.success) {
            Logger.error(componentName, '❌ Google OAuth 인증 시작 실패', result.error);
          }

          return result;
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


          const parsed = codeSchema.safeParse(code);
          if (!parsed.success) {
            Logger.warn(componentName, 'Invalid OAuth callback code');
            return { success: false, error: 'Invalid callback code' };
          }

          const parsedState = stateSchema.safeParse(state);

          const stateValue: string = parsedState.success && parsedState.data ? parsedState.data : '';
          const result = await googleOAuthService.handleCallback(parsed.data, stateValue);

          if (!result.success) {
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

          const result = await googleOAuthService.getConnectionStatus();
          return result;
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

          const result = await googleOAuthService.listDocuments();
          return result;
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
          const result = await googleOAuthService.disconnect();

          if (!result.success) {
            Logger.error(componentName, '❌ Google OAuth 연결 해제 실패', result.error);
          }

          return result;
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
