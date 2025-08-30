import type { IncomingMessage, ServerResponse } from 'http';
import { Logger } from '../../../shared/logger';
import { isWhitelistedRedirect } from '../../core/security';
import { buildDefaultHeaders } from './headers';
import { OAuthSuccessPage } from './oauthSuccessPage';

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
    public async processCallback(url: URL, req: IncomingMessage): Promise<{ redirectTo?: string; html?: string }> {
        const code = url.searchParams.get('code') || '';
        const state = url.searchParams.get('state') || '';

        const origin = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
        if (!isWhitelistedRedirect(origin)) {
            Logger.warn('OAUTH_MANAGER', 'Callback origin not whitelisted', { origin });
        }

        // Delegate token exchange or other side-effects to the ipc handler
        try {
            const { handleCallbackDirect } = await import('../../handlers/oauthIpcHandlers');
            if (typeof handleCallbackDirect === 'function') {
                await handleCallbackDirect(code);
            }
        } catch (e) {
            Logger.error('OAUTH_MANAGER', 'Delegated callback handler failed', e);
        }

        // Decide browser response based on state
        if (state) {
            // If state is exactly '/' or empty, do not redirect to root; show enhanced OAuth success page
            const trimmedState = state.trim();
            if (trimmedState === '/' || trimmedState === '') {
                const html = OAuthSuccessPage.generateSuccessHtml();
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
                    const port = (req.socket as any).localPort || 35821;
                    return { redirectTo: `http://localhost:${port}${state}` };
                }
            }
        }

        // default: enhanced OAuth success page with auto app launch
        const html = OAuthSuccessPage.generateSuccessHtml();
        return { html };
    }
}
