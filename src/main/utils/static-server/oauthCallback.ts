import type { IncomingMessage, ServerResponse } from 'http';
import { randomBytes } from 'crypto';
import { Logger } from '../../../shared/logger';
import { buildDefaultHeaders } from './headers';
import { OAuthManager } from './authManager';
import { PORTS } from '../../constants';
import { OAuthSuccessPage } from './oauthSuccessPage';

export class OAuthCallbackHandler {
    private manager: OAuthManager;

    constructor(private staticPath: string) {
        this.manager = new OAuthManager(staticPath);
    }

    public async handleCallback(req: IncomingMessage, res: ServerResponse): Promise<void> {
        try {
            const hostHeader = (req.headers && (req.headers.host as string)) || `localhost:${(req.socket as any).localPort || PORTS.STATIC_SERVER}`;
            const url = new URL(req.url || '', `http://${hostHeader}`);

            Logger.info('OAUTH_CALLBACK', 'Callback received', { rawUrl: url.toString() });

            const nonce = randomBytes(16).toString('base64');
            const result = await this.manager.processCallback(url, req, nonce);

            if (result.redirectTo) {
                const headers = buildDefaultHeaders('text/plain');
                res.writeHead(302, { ...headers, Location: result.redirectTo });
                res.end();
                return;
            }

            const html = result.html || OAuthSuccessPage.generateSuccessHtml(nonce);
            const headers = buildDefaultHeaders('text/html; charset=utf-8', {
                cspTransform: policy => appendNonce(policy, nonce)
            });
            res.writeHead(200, headers);
            res.end(html);
        } catch (error) {
            Logger.error('OAUTH_CALLBACK', 'Callback handling failed', error);
            try {
                const headers = buildDefaultHeaders('text/plain');
                res.writeHead(500, headers);
                res.end('OAuth callback failed');
            } catch (e) {
                Logger.error('OAUTH_CALLBACK', 'Failed to send 500', e);
            }
        }
    }
}

function appendNonce(policy: string, nonce: string): string {
    const directives = policy
        .split(';')
        .map(part => part.trim())
        .filter(Boolean)
        .map(part => {
            if (part.startsWith('script-src')) {
                if (part.includes(`'nonce-${nonce}'`)) {
                    return part;
                }
                return `${part} 'nonce-${nonce}'`;
            }
            return part;
        });

    return directives.join('; ');
}