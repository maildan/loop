import { CSP } from '../../core/security';

export function buildDefaultHeaders(contentType = 'text/html; charset=utf-8') {
    return {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=60, max=1000',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': "1; mode=block",
        'Content-Security-Policy': CSP.production
    } as Record<string, string>;
}
