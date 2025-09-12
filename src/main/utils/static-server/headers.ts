import { CSP } from '../../core/security';

export function buildDefaultHeaders(contentType = 'text/html; charset=utf-8') {
    // 🔥 환경에 따라 적절한 CSP 선택
    const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === 'true';
    const cspPolicy = isDev ? CSP.development : CSP.production;

    return {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=60, max=1000',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': "1; mode=block",
        'Content-Security-Policy': cspPolicy,
        // 🔥 CORS 헤더 추가 (AI API 호출을 위해)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    } as Record<string, string>;
}
