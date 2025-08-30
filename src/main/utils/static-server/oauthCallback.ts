import type { IncomingMessage, ServerResponse } from 'http';
import { Logger } from '../../../shared/logger';
import { buildDefaultHeaders } from './headers';
import { OAuthManager } from './authManager';

export class OAuthCallbackHandler {
    private manager: OAuthManager;

    constructor(private staticPath: string) {
        this.manager = new OAuthManager(staticPath);
    }

    public async handleCallback(req: IncomingMessage, res: ServerResponse): Promise<void> {
        try {
            const hostHeader = (req.headers && (req.headers.host as string)) || `localhost:${(req.socket as any).localPort || 35821}`;
            const url = new URL(req.url || '', `http://${hostHeader}`);

            Logger.info('OAUTH_CALLBACK', 'Callback received', { rawUrl: url.toString() });

            const result = await this.manager.processCallback(url, req);

            if (result.redirectTo) {
                const headers = buildDefaultHeaders('text/plain');
                res.writeHead(302, { ...headers, Location: result.redirectTo });
                res.end();
                return;
            }

            const html = result.html || '<html><body><h1>Auth complete</h1><script>setTimeout(()=>window.close(),1200)</script></body></html>';
            const headers = buildDefaultHeaders('text/html; charset=utf-8');
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