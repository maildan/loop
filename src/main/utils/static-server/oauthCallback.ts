import type { IncomingMessage, ServerResponse } from 'http';
import { Logger } from '../../../shared/logger';
import { buildDefaultHeaders } from './headers';
import { OAuthManager } from './authManager';
import { PORTS } from '../../constants';

export class OAuthCallbackHandler {
    private manager: OAuthManager;

    constructor(private staticPath: string) {
        this.manager = new OAuthManager(staticPath);
    }

    public async handleCallback(req: IncomingMessage, res: ServerResponse): Promise<void> {
        try {
            const hostHeader = (req.headers && (req.headers.host as string)) || `localhost:${(req.socket as any).localPort || PORTS.STATIC_SERVER}`;
            const url = new URL(req.url || '', `http://${hostHeader}`);



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
            
            try {
                const headers = buildDefaultHeaders('text/plain');
                res.writeHead(500, headers);
                res.end('OAuth callback failed');
            } catch (e) {
            
            }
        }
    }
}