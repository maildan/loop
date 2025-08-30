import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { ServerResponse } from 'http';
import { Logger } from '../../../shared/logger';
import { buildDefaultHeaders } from './headers';
import { StaticFileProvider } from './staticProvider';

export class DynamicRouter {
    private provider: StaticFileProvider;

    constructor(private staticPath: string) {
        this.provider = new StaticFileProvider(staticPath);
    }

    /**
     * Check if this router can handle the given path.
     * Currently handles:
     * - /api/* routes
     * - /projects/* routes (for dynamic project pages)
     * - /health, /status endpoints
     */
    public canHandle(pathOnly: string): boolean {
        const handledRoutes = ['/health', '/status'];
        if (handledRoutes.includes(pathOnly)) {
            return true;
        }

        if (pathOnly.startsWith('/api/')) {
            return true;
        }

        if (pathOnly.startsWith('/projects/')) {
            return true;
        }

        // For SPA routing, if it's not a file (no extension), let this router handle it.
        if (!pathOnly.includes('.')) {
            return true;
        }

        return false;
    }

    public async tryHandleDynamicRoute(pathOnly: string, res: ServerResponse): Promise<boolean> {
        try {
            Logger.debug('DYNAMIC_ROUTER', 'Attempting to handle route', { pathOnly });

            if (pathOnly === '/health' || pathOnly === '/status') {
                return this.handleHealthCheck(pathOnly, res);
            }

            if (pathOnly.startsWith('/api/')) {
                return this.handleApiRoute(pathOnly, res);
            }

            if (pathOnly.startsWith('/projects/')) {
                const handled = this.handleProjectRoute(pathOnly, res);
                if (handled) {
                    return true;
                }
            }

            // Next.js routing: Handle both page (.html) and data (.json) requests
            const isNextDataRequest = pathOnly.startsWith('/_next/data/');
            let resourcePath: string;

            if (isNextDataRequest) {
                resourcePath = join(this.staticPath, pathOnly);
            } else {
                const pagePath = pathOnly.endsWith('/') ? pathOnly.slice(0, -1) : pathOnly;
                resourcePath = join(this.staticPath, pagePath === '' ? 'index.html' : pagePath + '.html');
            }

            if (existsSync(resourcePath)) {
                const mimeType = isNextDataRequest ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8';
                const headers = buildDefaultHeaders(mimeType);
                res.writeHead(200, headers);
                res.end(readFileSync(resourcePath));
                Logger.debug('DYNAMIC_ROUTER', 'Next.js resource served', { path: pathOnly, file: resourcePath });
                return true;
            }

            // Fallback to 404.html if specific resource not found
            const notFoundPath = join(this.staticPath, '404.html');
            if (existsSync(notFoundPath)) {
                const headers = buildDefaultHeaders('text/html; charset=utf-8');
                res.writeHead(404, headers);
                res.end(readFileSync(notFoundPath));
                Logger.debug('DYNAMIC_ROUTER', 'Serving 404.html for path', { forPath: pathOnly });
                return true;
            }

            return false; // Let the caller handle the 404

        } catch (error) {
            Logger.error('DYNAMIC_ROUTER', 'Dynamic route handling failed', error);
            try {
                const headers = buildDefaultHeaders('text/plain');
                res.writeHead(500, headers);
                res.end('Internal Server Error');
            } catch (e) {
                Logger.error('DYNAMIC_ROUTER', 'Failed to send 500', e);
            }
            return true;
        }
    }

    private handleHealthCheck(pathOnly: string, res: ServerResponse): boolean {
        const response = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'static-server'
        };
        const headers = buildDefaultHeaders('application/json; charset=utf-8');
        res.writeHead(200, headers);
        res.end(JSON.stringify(response));
        Logger.debug('DYNAMIC_ROUTER', 'Health check served', { path: pathOnly });
        return true;
    }

    private handleApiRoute(pathOnly: string, res: ServerResponse): boolean {
        // Placeholder for API routes - could be expanded to:
        // 1. Proxy to Next.js API routes
        // 2. Handle specific API endpoints
        // 3. Delegate to microservices

        const response = {
            message: 'API endpoint not implemented yet',
            path: pathOnly,
            timestamp: new Date().toISOString()
        };

        const headers = buildDefaultHeaders('application/json; charset=utf-8');
        res.writeHead(501, headers); // 501 Not Implemented
        res.end(JSON.stringify(response));

        Logger.debug('DYNAMIC_ROUTER', 'API route placeholder served', { path: pathOnly });
        return true;
    }

    private handleProjectRoute(pathOnly: string, res: ServerResponse): boolean {
        const segments = pathOnly.split('/');
        if (segments.length >= 3) {
            const projectId = segments[2];
            if (projectId && projectId.trim()) {
                const exactProjectPath = join(this.staticPath, 'projects', projectId, 'index.html');
                if (existsSync(exactProjectPath)) {
                    const headers = buildDefaultHeaders('text/html; charset=utf-8');
                    res.writeHead(200, headers);
                    res.end(readFileSync(exactProjectPath));
                    Logger.debug('DYNAMIC_ROUTER', 'Project page served', { projectId });
                    return true;
                }
            }
        }

        // Project route but no specific file found - let SPA handle it
        return false;
    }

}
