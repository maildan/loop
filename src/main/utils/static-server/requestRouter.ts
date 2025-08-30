import type { IncomingMessage, ServerResponse } from 'http';
import { Logger } from '../../../shared/logger';
import { StaticFileProvider } from '././staticProvider';
import { DynamicRouter } from '././dynamicRouter';
import { OAuthCallbackHandler } from '././oauthCallback';

/**
 * RequestRouter: delegate requests to the right handler with SPA routing support.
 */
export class RequestRouter {
    private staticProvider: StaticFileProvider;
    private dynamicRouter: DynamicRouter;
    private oauthHandler: OAuthCallbackHandler;

    constructor(staticProvider: StaticFileProvider, dynamicRouter: DynamicRouter, oauthHandler: OAuthCallbackHandler) {
        this.staticProvider = staticProvider;
        this.dynamicRouter = dynamicRouter;
        this.oauthHandler = oauthHandler;
    }

    public async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
        try {
            const rawUrl = typeof req.url === 'string' ? req.url : '/';
            const url = rawUrl.split('#')[0] || '/';
            let pathOnly = (url.split('?')[0] || '/') as string;
            // normalize // and trailing
            pathOnly = pathOnly.replace(/\/+/g, '/');
            if (!pathOnly.startsWith('/')) pathOnly = '/' + pathOnly;

            Logger.debug('REQUEST_ROUTER', 'Processing request', { pathOnly, method: req.method });

            // 1. OAuth callback special case
            if (pathOnly === '/oauth/callback') {
                await this.oauthHandler.handleCallback(req, res);
                return;
            }

            // 1.5. Internal OAuth redirect bypass: avoid SPA routing for internal redirects
            if (pathOnly === '/oauth/redirect') {
                try {
                    const host = (req.headers && req.headers.host) ? req.headers.host : 'localhost';
                    const urlObj = new URL(req.url || '/', `http://${host}`);
                    const target = urlObj.searchParams.get('to');
                    if (target) {
                        // Normalize to absolute URL when redirect target is a path
                        const location = target.startsWith('/') ? `http://${host}${target}` : target;
                        res.writeHead(302, { Location: location, 'Content-Type': 'text/plain' });
                        res.end();
                        return;
                    }
                } catch (e) {
                    // fall through to normal routing
                }
            }

            // 2. Check if this is a file request (contains . in last segment)
            const isFileRequest = this.isFileRequest(pathOnly);

            // 3. Try static file for file requests
            if (isFileRequest) {
                const fullPath = this.staticProvider.resolvePath(pathOnly);
                if (this.staticProvider.exists(fullPath)) {
                    await this.staticProvider.serveFile(fullPath, res);
                    return;
                }
                // File not found - serve 404
                this.staticProvider.serve404(res);
                return;
            }

            // 4. For route requests, try dynamic router first
            const handled = await this.dynamicRouter.tryHandleDynamicRoute(pathOnly, res);
            if (handled) return;

            // 5. SPA History API Fallback: serve index.html for GET/HEAD requests that accept HTML
            if (this.shouldUseSpaFallback(req)) {
                const indexPath = this.staticProvider.resolvePath('/');
                if (this.staticProvider.exists(indexPath)) {
                    Logger.debug('REQUEST_ROUTER', 'SPA fallback served', { pathOnly });
                    await this.staticProvider.serveFile(indexPath, res);
                    return;
                }
            }

            // 6. Final fallback: 404
            this.staticProvider.serve404(res);
        } catch (error) {
            Logger.error('REQUEST_ROUTER', 'Request handling failed', error);
            try {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } catch (e) {
                Logger.error('REQUEST_ROUTER', 'Failed to send 500 response', e);
            }
        }
    }

    /**
     * Determine if a request is for a file (has extension in last path segment)
     * Based on http-server-spa pattern
     */
    private isFileRequest(pathOnly: string): boolean {
        const segments = pathOnly.split('/');
        const lastSegment = segments[segments.length - 1];
        return lastSegment ? lastSegment.includes('.') : false;
    }

    /**
     * Determine if we should use SPA fallback for this request
     * Criteria: GET/HEAD request for routes (not files)
     */
    private shouldUseSpaFallback(req: IncomingMessage): boolean {
        const method = req.method?.toUpperCase();
        const acceptHeader = req.headers.accept || '';

        // Accept any GET/HEAD request that's not explicitly for a specific file type
        const isHttpGetOrHead = method === 'GET' || method === 'HEAD';
        const acceptsHtml = acceptHeader.includes('text/html') || acceptHeader.includes('*/*') || !acceptHeader;

        return isHttpGetOrHead && acceptsHtml;
    }
}
