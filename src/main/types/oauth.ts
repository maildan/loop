// 🔥 기가차드 OAuth 타입 정의 - Google Docs/Drive 연동 전용

/**
 * 🔥 Google OAuth 설정
 */
export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  authUrl: string;
  tokenUrl: string;
}

/**
 * 🔥 OAuth 토큰 정보
 */
export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
  expires_at?: number; // 계산된 만료 시간
}

/**
 * 🔥 OAuth 인증 결과
 */
export interface OAuthResult {
  success: boolean;
  tokens?: OAuthTokens;
  error?: string;
  userInfo?: GoogleUserInfo;
}

/**
 * 🔥 Google 사용자 정보
 */
export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  locale?: string;
}

/**
 * 🔥 Google 문서 정보
 */
export interface GoogleDocument {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
}

/**
 * 🔥 OAuth 상태 정보
 */
export interface OAuthStatus {
  connected: boolean;
  expiresAt?: number;
  userInfo?: GoogleUserInfo;
  scopes?: string[];
}

/**
 * 🔥 현재 환경변수를 기반으로 한 Google OAuth 설정
 */
export const GOOGLE_OAUTH_CONFIG: GoogleOAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: (process.env.GOOGLE_REDIRECT_URI || 'http://localhost:35821/oauth/callback').trim(), // 🔥 콜백 URL
  scopes: [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ],
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token'
};

/**
 * 🔥 OAuth 설정 검증 및 로그
 */
export function validateOAuthConfig(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!GOOGLE_OAUTH_CONFIG.clientId) {
    missing.push('GOOGLE_CLIENT_ID');
  }
  
  if (!GOOGLE_OAUTH_CONFIG.clientSecret) {
    missing.push('GOOGLE_CLIENT_SECRET');
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

/**
 * 🔥 Google API 엔드포인트
 */
export const GOOGLE_API_ENDPOINTS = {
  userInfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
  documents: 'https://docs.googleapis.com/v1/documents',
  drive: 'https://www.googleapis.com/drive/v3/files'
} as const;
