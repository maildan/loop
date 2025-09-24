// 🔥 기가차드 OAuth IPC 핸들러 - Google Docs 연동 통신

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';
import { OAuthService } from '../services/OAuthService';
import { z } from 'zod';



// 🔥 OAuth 서비스 인스턴스
let oauthService: OAuthService | null = null;

/**
 * 🔥 OAuth 서비스 초기화
 */
export async function initializeOAuthService(): Promise<void> {
  try {
    if (!oauthService) {
      oauthService = new OAuthService();
      await oauthService.initialize();
      Logger.info('OAUTH_IPC', 'OAuth service initialized');
    }
  } catch (error) {
    Logger.error('OAUTH_IPC', 'Failed to initialize OAuth service', error);
    throw error;
  }
}

/**
 * 🔥 OAuth IPC 핸들러 설정
 */
export function setupOAuthIpcHandlers(): void {

  // 🔥 Google OAuth 인증 시작
  const loginHintSchema = z.string().min(3).max(254).optional();

  ipcMain.handle('oauth:start-google-auth', async (_event: IpcMainInvokeEvent, loginHint?: unknown): Promise<IpcResponse<{ authUrl: string }>> => {
    try {
      if (!oauthService) {
        await initializeOAuthService();
      }

      // startGoogleAuth will open browser itself; support optional login hint
      const parsedLoginHint = loginHintSchema.safeParse(loginHint);
      if (parsedLoginHint.success && parsedLoginHint.data) {
        const authUrl = oauthService!.buildAuthUrlWithHint(parsedLoginHint.data);
        try {
          // open with login hint
          await (oauthService as any).openAuthUrlInBrowser?.(authUrl);
        } catch (e) {
          // fallback: shell.openExternal
          const { shell } = require('electron');
          await shell.openExternal(authUrl);
        }
        return { success: true, data: { authUrl }, timestamp: new Date() };
      }

      const result = await oauthService!.startGoogleAuth();
      Logger.debug('OAUTH_IPC', 'OAuth start-google-auth completed', { success: result.success });
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth start-google-auth failed', error);
      return {
        success: false,
        error: 'OAuth 인증을 시작할 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 OAuth 콜백 처리
  const codeSchema = z.string().min(10).max(1024);

  ipcMain.handle('oauth:handle-callback', async (_event: IpcMainInvokeEvent, code: unknown): Promise<IpcResponse<{ accessToken: string; refreshToken: string }>> => {
    try {
      if (!oauthService) {
        await initializeOAuthService();
      }

      const parsed = codeSchema.safeParse(code);
      if (!parsed.success) {
        Logger.warn('OAUTH_IPC', 'Invalid OAuth callback code received');
        return { success: false, error: 'Invalid callback code', timestamp: new Date() };
      }

      const result = await oauthService!.handleCallback(parsed.data);
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth handle-callback failed', error);
      return {
        success: false,
        error: 'OAuth 콜백 처리에 실패했습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 Google 문서 목록 가져오기
  ipcMain.handle('oauth:get-google-documents', async (_event: IpcMainInvokeEvent): Promise<IpcResponse<Array<{ id: string; title: string; modifiedTime: string }>>> => {
    try {
      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.getGoogleDocuments();
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth get-google-documents failed', error);
      return {
        success: false,
        error: 'Google 문서 목록을 가져올 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 Google 문서 가져오기
  const documentIdSchema = z.string().min(5).max(512);

  ipcMain.handle('oauth:import-google-doc', async (_event: IpcMainInvokeEvent, documentId: unknown): Promise<IpcResponse<{ title: string; content: string }>> => {
    try {

      const parsed = documentIdSchema.safeParse(documentId);
      if (!parsed.success) {
        Logger.warn('OAUTH_IPC', 'Invalid documentId for import');
        return { success: false, error: 'Invalid documentId', timestamp: new Date() };
      }

      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.importGoogleDoc(parsed.data);
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth import-google-doc failed', error);
      return {
        success: false,
        error: 'Google 문서를 가져올 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 인증 상태 확인
  ipcMain.handle('oauth:get-auth-status', async (_event: IpcMainInvokeEvent): Promise<IpcResponse<{ isAuthenticated: boolean; userEmail?: string }>> => {
    try {
      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.getAuthStatus();
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth get-auth-status failed', error);
      return {
        success: false,
        error: '인증 상태를 확인할 수 없습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 인증 취소
  ipcMain.handle('oauth:revoke-auth', async (_event: IpcMainInvokeEvent): Promise<IpcResponse<boolean>> => {
    try {
      if (!oauthService) {
        await initializeOAuthService();
      }

      const result = await oauthService!.revokeAuth();
      return result;
    } catch (error) {
      Logger.error('OAUTH_IPC', 'OAuth revoke-auth failed', error);
      return {
        success: false,
        error: '인증 취소에 실패했습니다',
        timestamp: new Date()
      };
    }
  });

  // 🔥 Ensure authenticated (silent refresh) - returns success: true if still authenticated
  ipcMain.handle('oauth:ensure-authenticated', async (_event: IpcMainInvokeEvent): Promise<IpcResponse<{ isAuthenticated: boolean }>> => {
    try {
      if (!oauthService) {
        await initializeOAuthService();
      }

      const ok = await (oauthService as any).ensureAuthenticated();
      return { success: true, data: { isAuthenticated: !!ok }, timestamp: new Date() };
    } catch (error) {
      Logger.error('OAUTH_IPC', 'oauth:ensure-authenticated failed', error);
      return { success: false, error: 'Failed to ensure authentication', timestamp: new Date() };
    }
  });


}

/**
 * Directly handle callback from code (used by StaticServer to call into main flow without IPC)
 */
export async function handleCallbackDirect(code: string, state?: string | null): Promise<IpcResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    if (!oauthService) {
      await initializeOAuthService();
    }

    const result = await (oauthService as any).handleCallback(code, state || undefined);
    Logger.debug('OAUTH_IPC', 'handleCallbackDirect result', { success: result.success, error: result.error });
    return result;
  } catch (error) {
    Logger.error('OAUTH_IPC', 'Direct handleCallback failed', error);
    return { success: false, error: 'Direct callback handling failed', timestamp: new Date() };
  }
}

/**
 * 🔥 OAuth IPC 핸들러 정리
 */
export function cleanupOAuthIpcHandlers(): void {

  const handlersToClean = [
    'oauth:start-google-auth',
    'oauth:handle-callback',
    'oauth:get-google-documents',
    'oauth:import-google-doc',
    'oauth:get-auth-status',
    'oauth:revoke-auth',
  ];

  handlersToClean.forEach(channel => {
    ipcMain.removeAllListeners(channel);
  });

  // OAuth 서비스 정리
  if (oauthService) {
    oauthService.cleanup();
    oauthService = null;
  }


}
