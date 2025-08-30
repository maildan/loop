import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import type { ServerResponse } from 'http';
import { Logger } from '../../../shared/logger';
import { buildDefaultHeaders } from './headers';

export class StaticFileProvider {
    private staticPath: string;

    constructor(staticPath: string) {
        this.staticPath = staticPath;
    }

    public resolvePath(requestPath: string): string {
        const decoded = decodeURIComponent(requestPath || '/');
        if (decoded === '/') return join(this.staticPath, 'index.html');
        return join(this.staticPath, decoded);
    }

    public exists(fullPath: string): boolean {
        try {
            if (!existsSync(fullPath)) return false;
            const s = statSync(fullPath);
            return s.isFile();
        } catch (e) {
            return false;
        }
    }

    public serve404(res: ServerResponse) {
        const notFoundPath = join(this.staticPath, '404.html');
        if (existsSync(notFoundPath)) {
            const headers = buildDefaultHeaders('text/html; charset=utf-8');
            res.writeHead(404, headers);
            res.end(readFileSync(notFoundPath));
        } else {
            const headers = buildDefaultHeaders('text/plain');
            res.writeHead(404, headers);
            res.end('404 - Page Not Found');
        }
    }

    public serveFile(fullPath: string, res: ServerResponse): void {
        try {
            const ext = extname(fullPath);
            const mimeTypes: { [key: string]: string } = {
                '.html': 'text/html; charset=utf-8',
                '.js': 'application/javascript; charset=utf-8',
                '.css': 'text/css; charset=utf-8',
                '.json': 'application/json; charset=utf-8',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf',
                '.eot': 'font/eot',
                '.ico': 'image/x-icon'
            };

            const content = readFileSync(fullPath);
            const headers = buildDefaultHeaders(mimeTypes[ext] || 'application/octet-stream');
            res.writeHead(200, headers);
            res.end(content);
            Logger.debug('STATIC_PROVIDER', 'File served', { path: fullPath.replace(this.staticPath, '') });
        } catch (e) {
            Logger.error('STATIC_PROVIDER', 'serveFile failed', e);
            try {
                const headers = buildDefaultHeaders('text/plain');
                res.writeHead(500, headers);
                res.end('Internal Server Error');
            } catch (err) {
                Logger.error('STATIC_PROVIDER', 'Failed to send 500', err);
            }
        }
    }
}
