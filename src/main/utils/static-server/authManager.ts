import type { IncomingMessage, ServerResponse } from 'http';
import { Logger } from '../../../shared/logger';
import { isWhitelistedRedirect } from '../../core/security';
import { buildDefaultHeaders } from './headers';
import { OAuthSuccessPage } from './oauthSuccessPage';
import { PORTS } from '../../constants';

export class OAuthManager {
    constructor(private staticPath: string) { }

    /**
     * Process an OAuth callback URL and perform delegated token exchange work.
     * Returns either a redirect target or an HTML response to send to the browser.
     *
     * Assumptions made:
     * - If the `state` query parameter is a valid absolute URL, the browser will be redirected to it.
     * - If the `state` starts with `/`, it will be treated as a path on the local static server and
     *   redirected to http://localhost:{port}{state} (port will be extracted from req.socket.localPort).
     * - Otherwise, the window will be closed by returning a small HTML page.
     */
    public async processCallback(url: URL, req: IncomingMessage, nonce: string): Promise<{ redirectTo?: string; html?: string }> {
        const code = url.searchParams.get('code') || '';
        const state = url.searchParams.get('state') || '';

        const origin = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
        if (!isWhitelistedRedirect(origin)) {
            Logger.warn('OAUTH_MANAGER', 'Callback origin not whitelisted', { origin });
        }

        // Delegate token exchange or other side-effects to the ipc handler
        try {
            // 🔥 우선: GoogleOAuthService 사용 (신규, End User 토큰)
            Logger.info('OAUTH_MANAGER', '🔥 Google OAuth 핸들러 import 시작');
            const googleOAuthModule = await import('../../handlers/googleOAuthIpcHandlers');
            const { handleGoogleOAuthCallbackDirect } = googleOAuthModule;
            Logger.info('OAUTH_MANAGER', '✅ Google OAuth 핸들러 import 완료', { hasFn: typeof handleGoogleOAuthCallbackDirect });
            
            if (typeof handleGoogleOAuthCallbackDirect === 'function') {
                Logger.info('OAUTH_MANAGER', '🔄 GoogleOAuthService 콜백 처리 시작', { code, state });
                const result = await handleGoogleOAuthCallbackDirect(code, state);
                Logger.info('OAUTH_MANAGER', '✅ GoogleOAuthService 콜백 처리 완료', { result });
                
                // 🔥 토큰 저장 성공 여부 검증
                if (!result.success) {
                    Logger.warn('OAUTH_MANAGER', '⚠️ GoogleOAuth 콜백 처리 실패', { error: result.error });
                    // 에러 페이지 반환 (3초 후 app 포커스)
                    const errorHtml = OAuthSuccessPage.generateErrorHtml(nonce, result.error || 'Authentication failed');
                    return { html: errorHtml };
                }
                
                Logger.info('OAUTH_MANAGER', '🔐 토큰 Keychain 저장 완료');
            } else {
                throw new Error('handleGoogleOAuthCallbackDirect is not a function');
            }
        } catch (e) {
            Logger.error('OAUTH_MANAGER', '❌ GoogleOAuth callback failed', e);
            // 🔥 폴백: OAuthService (구형)
            try {
                Logger.info('OAUTH_MANAGER', '🔥 Fallback: OAuthService import 시작');
                const { handleCallbackDirect } = await import('../../handlers/oauthIpcHandlers');
                if (typeof handleCallbackDirect === 'function') {
                    Logger.info('OAUTH_MANAGER', '🔄 OAuthService fallback 콜백 처리');
                    const fallbackResult = await handleCallbackDirect(code, state);
                    if (!fallbackResult.success) {
                        Logger.warn('OAUTH_MANAGER', '⚠️ OAuthService 콜백도 실패', { error: fallbackResult.error });
                        const errorHtml = OAuthSuccessPage.generateErrorHtml(nonce, fallbackResult.error || 'Authentication failed');
                        return { html: errorHtml };
                    }
                }
            } catch (fallbackError) {
                Logger.error('OAUTH_MANAGER', 'Both OAuth handlers failed', fallbackError);
                const errorHtml = OAuthSuccessPage.generateErrorHtml(nonce, 'Both authentication methods failed');
                return { html: errorHtml };
            }
        }

        // Decide browser response based on state
        if (state) {
            // If state is exactly '/' or empty, do not redirect to root; show enhanced OAuth success page
            const trimmedState = state.trim();
            if (trimmedState === '/' || trimmedState === '') {
                const html = OAuthSuccessPage.generateSuccessHtml(nonce);
                return { html };
            }
            // try absolute URL
            try {
                const parsed = new URL(state);
                return { redirectTo: parsed.toString() };
            } catch (e) {
                // not an absolute URL — if it starts with /, treat as local path
                if (state.startsWith('/')) {
                    // derive port from socket if available
                    const port = (req.socket as any).localPort || PORTS.STATIC_SERVER;
                    return { redirectTo: `http://localhost:${port}${state}` };
                }
            }
        }

        // default: enhanced OAuth success page with auto app launch
        const html = OAuthSuccessPage.generateSuccessHtml(nonce);
        return { html };
    }
}
