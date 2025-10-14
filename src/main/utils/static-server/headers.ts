import { app } from 'electron';
import { CSP_POLICIES } from '../../constants';

interface HeaderOptions {
    cspOverride?: string;
    cspTransform?: (policy: string) => string;
    extraHeaders?: Record<string, string>;
}

export function buildDefaultHeaders(contentType = 'text/html; charset=utf-8', options?: HeaderOptions) {
    // 🔥 환경에 따라 적절한 CSP 선택 (constants에서 관리)
    const isProd = app.isPackaged || process.env.NODE_ENV === 'production';
    const basePolicy = isProd ? CSP_POLICIES.PRODUCTION : CSP_POLICIES.DEVELOPMENT;
    const transformedPolicy = options?.cspOverride
        ? options.cspOverride
        : options?.cspTransform
            ? options.cspTransform(basePolicy)
            : basePolicy;

    const headers: Record<string, string> = {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=60, max=1000',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': "1; mode=block",
        'Content-Security-Policy': transformedPolicy,
        // 🔥 CORS 헤더 추가 (AI API 호출을 위해)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    };

    if (options?.extraHeaders) {
        Object.assign(headers, options.extraHeaders);
    }

    return headers;
}
