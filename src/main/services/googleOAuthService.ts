// 🔥 기가차드 Google OAuth Service - 안전한 인증 통합

import { shell } from 'electron';
import { google } from 'googleapis';
import { Logger } from '../../shared/logger';
import { createSuccess, createError, type Result } from '../../shared/common';
import { tokenStorage } from './tokenStorage';
import type { OAuthTokens, GoogleUserInfo, OAuthResult, GoogleOAuthConfig } from '../types/oauth';
import * as crypto from 'crypto';
import type { OAuth2Client } from 'google-auth-library';
import { PORTS } from '../constants';

/**
 * 🔥 Google OAuth 서비스 클래스
 */
export class GoogleOAuthService {
  private static instance: GoogleOAuthService;
  private readonly componentName = 'GOOGLE_OAUTH';
  private readonly config: GoogleOAuthConfig;
  // PKCE and state storage (in-memory). For multi-window flows a persistent store may be needed.
  private pendingPkce: Map<string, string> = new Map(); // state -> code_verifier

  private constructor() {
    // 🔥 CRITICAL: 환경변수가 번들에 포함되지 않으므로 런타임 체크 필수
    // CI/CD: GitHub Secrets → 환경변수 → electron-builder
    // Local dev: .env 파일 → dotenv → process.env
    // Production: 사용자는 Settings UI에서 입력 (향후 구현)
    this.config = {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORTS.OAUTH_CALLBACK_PORT}/oauth/callback`,
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token'
    };
  }

  static getInstance(): GoogleOAuthService {
    if (!GoogleOAuthService.instance) {
      GoogleOAuthService.instance = new GoogleOAuthService();
    }
    return GoogleOAuthService.instance;
  }

  /**
   * 🔥 OAuth 인증 시작
   */
  async startAuthentication(): Promise<Result<string>> {
    try {
      if (!this.config.clientId || !this.config.clientSecret) {
        Logger.warn(this.componentName, '⚠️ Google OAuth 설정 누락', {
          hasClientId: !!this.config.clientId,
          hasClientSecret: !!this.config.clientSecret
        });
        throw new Error(
          'Google OAuth 설정이 완료되지 않았습니다.\n\n' +
          '.env 파일에 다음을 추가하세요:\n' +
          'GOOGLE_CLIENT_ID=your-client-id\n' +
          'GOOGLE_CLIENT_SECRET=your-client-secret\n\n' +
          '또는 Google Cloud Console에서\n' +
          'OAuth 2.0 클라이언트 ID를 생성하세요.'
        );
      }

      const state = this.generateState();
      // generate PKCE verifier & challenge
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      // store verifier associated with state
      this.pendingPkce.set(state, codeVerifier);

      const authUrl = this.buildAuthUrl(state, codeChallenge);

      // 외부 브라우저에서 OAuth URL 열기
      await shell.openExternal(authUrl);

      Logger.info(this.componentName, '✅ OAuth 인증 시작됨', { authUrl });
      return createSuccess(authUrl);

    } catch (error) {
      Logger.error(this.componentName, '❌ OAuth 인증 시작 실패', error);
      return createError(error instanceof Error ? error.message : 'Authentication failed');
    }
  }

  /**
   * 🔥 OAuth 콜백 처리
   */
  async handleCallback(code: string, state: string): Promise<Result<OAuthResult>> {
    try {
      // 상태 검증 (보안)
      if (!this.verifyState(state)) {
        throw new Error('Invalid state parameter');
      }

      // retrieve code_verifier for this state (PKCE)
      const codeVerifier = this.pendingPkce.get(state) || '';
      // 인증 코드로 토큰 교환 (with code_verifier)
      const tokens = await this.exchangeCodeForTokens(code, codeVerifier);
      if (!tokens) {
        throw new Error('Failed to exchange code for tokens');
      }

      // 사용자 정보 가져오기
      const userInfo = await this.getUserInfo(tokens.access_token);
      if (!userInfo) {
        throw new Error('Failed to get user info');
      }

      // 토큰 안전하게 저장
      const saveResult = await tokenStorage.saveTokens('google', tokens);
      if (!saveResult) {
        throw new Error('Failed to save tokens');
      }

      // cleanup pending PKCE state to avoid reuse
      try { this.pendingPkce.delete(state); } catch (e) { /* ignore */ }

      const result: OAuthResult = {
        success: true,
        tokens,
        userInfo
      };

      Logger.info(this.componentName, '✅ OAuth 인증 완료', {
        userEmail: userInfo.email,
        scopes: tokens.scope,
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
      });

      return createSuccess(result);

    } catch (error) {
      Logger.error(this.componentName, '❌ OAuth 콜백 처리 실패', error);
      return createError(error instanceof Error ? error.message : 'Callback handling failed');
    }
  }

  /**
   * 🔥 현재 연결 상태 확인 (End User 토큰 포함) - 재시도 로직 포함
   */
  async getConnectionStatus(): Promise<Result<{ isConnected: boolean; email?: string }>> {
    try {
      Logger.debug(this.componentName, '🔍 getConnectionStatus() 호출됨');
      
      // 1) ENV 우선 사용 (있으면 부트스트랩)
      const envAccess = process.env.GOOGLE_ACCESS_TOKEN;
      const envRefresh = process.env.GOOGLE_REFRESH_TOKEN;
      // Only allow bootstrapping from env in development to avoid accidental token leaks in production
      if (process.env.NODE_ENV === 'development' && envAccess) {
        Logger.warn(this.componentName, 'Bootstrapping OAuth tokens from environment variables (development only)');
        await tokenStorage.saveTokens('google', {
          access_token: envAccess,
          refresh_token: envRefresh,
          token_type: 'Bearer',
          scope: this.config.scopes.join(' '),
        });
      } else if (envAccess) {
        Logger.warn(this.componentName, 'GOOGLE_ACCESS_TOKEN present in environment but ignored in non-development mode');
      }

      const tokens = await tokenStorage.getTokens('google');
      Logger.debug(this.componentName, `📦 tokenStorage.getTokens() 반환: ${tokens ? 'tokens exist' : 'null'}`);

      if (!tokens) {
        Logger.warn(this.componentName, '❌ tokenStorage에서 토큰을 찾지 못함');
        return createSuccess({ isConnected: false });
      }

      Logger.debug(this.componentName, `🔐 토큰 정보: hasAccess=${!!tokens.access_token}, hasRefresh=${!!tokens.refresh_token}`);

      // 🔥 토큰 유효성 검사 + 사용자 정보 조회 (재시도 로직 포함)
      Logger.info(this.componentName, '🔄 validateTokensWithRetry 시작...');
      const isValid = await this.validateTokensWithRetry(tokens, 2);
      Logger.debug(this.componentName, `🔍 validateTokensWithRetry() 결과: isValid=${isValid}`);
      
      if (!isValid) {
        Logger.warn(this.componentName, '❌ 토큰 유효성 검사 실패 (모든 재시도 소진)');
        return createSuccess({ isConnected: false });
      }

      // 🔥 사용자 정보 조회 (이메일)
      let email: string | undefined;
      try {
        const userInfo = await this.getUserInfo(tokens.access_token);
        email = userInfo?.email;
        Logger.debug(this.componentName, `✅ 사용자 정보 조회 성공: ${email}`);
      } catch (e) {
        Logger.warn(this.componentName, '사용자 정보 조회 실패 (하지만 토큰은 유효함)', e);
      }

      Logger.info(this.componentName, '✅ 연결 상태 확인 완료', { isConnected: true, email });
      return createSuccess({ isConnected: true, email });

    } catch (error) {
      Logger.error(this.componentName, '❌ 연결 상태 확인 실패 (예외 발생)', {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorType: error?.constructor?.name
      });
      return createSuccess({ isConnected: false });
    }
  }

  /**
   * 🔥 Google Docs 문서 생성
   */
  async createDocument(title: string, content: string): Promise<Result<{ documentId: string; webViewLink: string }>> {
    try {
      const tokens = await tokenStorage.getTokens('google');
      if (!tokens) {
        throw new Error('Google 인증이 필요합니다');
      }

      // Use helper to create OAuth2 client that persists refreshed tokens
      const auth = this.getOAuth2Client(tokens);

      // 🔥 Docs API 클라이언트 생성
      const docs = google.docs({ version: 'v1', auth });

      // 🔥 문서 생성
      const document = await docs.documents.create({
        requestBody: {
          title: title
        }
      });

      // 🔥 내용 추가 (GCP SDK 사용)
      if (content && document.data.documentId) {
        await docs.documents.batchUpdate({
          documentId: document.data.documentId,
          requestBody: {
            requests: [{
              insertText: {
                location: { index: 1 }, // 문서 시작 부분
                text: content
              }
            }]
          }
        });
      }

      Logger.info(this.componentName, '✅ Google Docs 문서 생성됨 (GCP SDK)', {
        documentId: document.data.documentId,
        title
      });

      return createSuccess({
        documentId: document.data.documentId!,
        webViewLink: `https://docs.google.com/document/d/${document.data.documentId}/edit`
      });

    } catch (error) {
      Logger.error(this.componentName, '❌ Google Docs 문서 생성 실패', error);
      return createError(error instanceof Error ? error.message : 'Document creation failed');
    }
  }

  /**
   * 🔥 Google Docs 문서 목록 조회
   */
  async listDocuments(): Promise<Result<{ id: string; name: string; modifiedTime: string; webViewLink?: string }[]>> {
    try {
      const tokens = await tokenStorage.getTokens('google');
      if (!tokens) {
        throw new Error('Google 인증이 필요합니다');
      }

      const auth = this.getOAuth2Client(tokens);
      // Drive API client
      const drive = google.drive({ version: 'v3', auth });

      // 🔥 Google Docs 문서 목록 조회
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.document'",
        fields: 'files(id,name,modifiedTime,webViewLink)',
        orderBy: 'modifiedTime desc',
        pageSize: 50,
      });

      const files = (response.data.files || []).map((file) => ({
        id: file.id!,
        name: file.name!,
        modifiedTime: file.modifiedTime!,
        webViewLink: file.webViewLink || undefined,
      }));

      Logger.info(this.componentName, '✅ Google Docs 목록 조회 완료 (GCP SDK)', { count: files.length });
      return createSuccess(files);

    } catch (error) {
      Logger.error(this.componentName, '❌ Google Docs 목록 조회 실패', error);
      return createError(error instanceof Error ? error.message : 'List documents failed');
    }
  }

  /**
   * 🔥 연결 해제
   */
  async disconnect(): Promise<Result<boolean>> {
    try {
      // attempt to revoke token at Google using OAuth2Client if possible
      const tokens = await tokenStorage.getTokens('google');
      if (tokens) {
        try {
          const client = this.getOAuth2Client(tokens) as OAuth2Client;
          const revokeTarget = tokens.refresh_token || tokens.access_token;
          if (revokeTarget && typeof client.revokeToken === 'function') {
            await client.revokeToken(revokeTarget);
          } else if (revokeTarget) {
            // fallback to HTTP revoke
            await fetch('https://oauth2.googleapis.com/revoke', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ token: revokeTarget })
            });
          }
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to call Google revoke endpoint via client', e);
        }
      }

      const deleteResult = await tokenStorage.deleteTokens('google');

      // remove auth snapshot from secure storage (keytar) as well
      try {
        const keytar = await import('keytar');
        await keytar.deletePassword('loop-auth-snapshot', 'snapshot');
      } catch (e) {
        // ignore if keytar not available
      }

      Logger.info(this.componentName, '✅ Google 연결 해제됨');
      return createSuccess(deleteResult);

    } catch (error) {
      Logger.error(this.componentName, '❌ 연결 해제 실패', error);
      return createError(error instanceof Error ? error.message : 'Disconnect failed');
    }
  }

  /**
   * 🔥 Private 헬퍼 메서드들
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateCodeVerifier(): string {
    // 128 chars of random URL-safe characters
    return crypto.randomBytes(64).toString('base64url');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return Buffer.from(hash).toString('base64url');
  }

  private buildAuthUrl(state: string, codeChallenge?: string): string {
    const params: Record<string, string> = {
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      state: state,
      access_type: 'offline',
      prompt: 'consent'
    };

    if (codeChallenge) {
      params['code_challenge'] = codeChallenge;
      params['code_challenge_method'] = 'S256';
    }

    Logger.info(this.componentName, '🔑 Building auth URL with redirect_uri:', {
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId.substring(0, 20) + '...'
    });

    const qs = new URLSearchParams(params).toString();
    return `${this.config.authUrl}?${qs}`;
  }

  private verifyState(state: string): boolean {
    // 실제 구현에서는 세션에 저장된 state와 비교
    // 지금은 간단한 형식 검증만
    return Boolean(state && state.length > 10);
  }
  private async exchangeCodeForTokens(code: string, codeVerifier?: string): Promise<OAuthTokens | null> {
    try {
      const bodyParams: Record<string, string> = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      };

      if (codeVerifier) {
        bodyParams['code_verifier'] = codeVerifier;
      }

      Logger.info(this.componentName, '🔑 Exchanging code for tokens with redirect_uri:', {
        redirect_uri: this.config.redirectUri,
        code: code.substring(0, 20) + '...',
        has_verifier: !!codeVerifier
      });

      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(bodyParams),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        Logger.error(this.componentName, `❌ Token exchange failed: ${response.status}`, {
          status: response.status,
          statusText: response.statusText,
          errorBody
        });
        throw new Error(`Token exchange failed: ${response.status} - ${errorBody}`);
      }

      const tokens: OAuthTokens = await response.json();

      // 만료 시간 계산
      if (tokens.expires_in) {
        tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
      }

      return tokens;

    } catch (error) {
      Logger.error(this.componentName, 'Token exchange failed', error);
      return null;
    }
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`User info fetch failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      Logger.error(this.componentName, 'User info fetch failed', error);
      return null;
    }
  }

  /**
   * 🔥 Token validation with detailed error logging
   */
  private async validateTokens(tokens: OAuthTokens): Promise<boolean> {
    try {
      Logger.debug(this.componentName, `🔐 validateTokens() 시작: hasAccess=${!!tokens.access_token}`);
      
      // 만료 시간 체크
      if (tokens.expires_at && tokens.expires_at < Date.now()) {
        Logger.warn(this.componentName, '⏰ 토큰 만료됨 - 갱신 시도', {
          expiresAt: new Date(tokens.expires_at).toISOString(),
          now: new Date().toISOString()
        });
        // 토큰 갱신 시도
        const refreshed = await tokenStorage.refreshTokens('google');
        if (!refreshed) {
          // Refresh failed -> must re-authenticate
          Logger.warn(this.componentName, '❌ Token refresh failed, re-authentication required');
          return false;
        }
        Logger.debug(this.componentName, '✅ 토큰 갱신 완료');
        // continue with refreshed tokens
        tokens = refreshed;
      }

      // 토큰으로 사용자 정보 조회 테스트 (재시도 로직 포함)
      Logger.debug(this.componentName, `🔍 getUserInfo() 호출 직전`, {
        tokenLength: tokens.access_token.length,
        tokenPrefix: tokens.access_token.substring(0, 10) + '...'
      });
      
      const userInfo = await this.getUserInfo(tokens.access_token);
      
      Logger.debug(this.componentName, `🔍 getUserInfo() 호출 성공`, {
        hasUserInfo: !!userInfo,
        email: userInfo?.email,
        name: userInfo?.name
      });
      
      const isValid = !!userInfo;
      Logger.info(this.componentName, `✅ validateTokens() 완료`, {
        isValid,
        userEmail: userInfo?.email || 'null'
      });
      return isValid;

    } catch (error) {
      Logger.error(this.componentName, '❌ validateTokens 실패', {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorType: error?.constructor?.name,
        statusCode: (error as any)?.response?.status,
        responseData: (error as any)?.response?.data,
        hasTokens: !!tokens.access_token
      });
      return false;
    }
  }

  /**
   * 🔥 Token validation with automatic retry on failure
   */
  private async validateTokensWithRetry(
    tokens: OAuthTokens,
    maxRetries = 2
  ): Promise<boolean> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        Logger.debug(this.componentName, `🔄 validateTokens 시도 ${attempt + 1}/${maxRetries + 1}`, {
          hasAccess: !!tokens.access_token
        });
        
        // 만료 시간 체크
        if (tokens.expires_at && tokens.expires_at < Date.now()) {
          Logger.warn(this.componentName, `⏰ [시도 ${attempt + 1}] 토큰 만료됨 - 갱신 시도`);
          const refreshed = await tokenStorage.refreshTokens('google');
          if (!refreshed) {
            Logger.warn(this.componentName, `❌ [시도 ${attempt + 1}] Token refresh failed`);
            if (attempt < maxRetries) {
              const delay = Math.pow(3, attempt) * 100;
              Logger.debug(this.componentName, `⏳ ${delay}ms 후 재시도...`);
              await new Promise(r => setTimeout(r, delay));
              continue;
            }
            return false;
          }
          tokens = refreshed;
        }

        Logger.debug(this.componentName, `🔍 [시도 ${attempt + 1}] getUserInfo() 호출 중...`);
        const userInfo = await this.getUserInfo(tokens.access_token);
        
        Logger.info(this.componentName, `✅ validateTokens 성공 (시도 ${attempt + 1})`, {
          email: userInfo?.email,
          attempt: attempt + 1
        });
        
        return !!userInfo;
        
      } catch (error) {
        Logger.warn(this.componentName, `⚠️ validateTokens 실패 (시도 ${attempt + 1})`, {
          errorMessage: error instanceof Error ? error.message : String(error),
          statusCode: (error as any)?.response?.status,
          attempt: attempt + 1,
          maxRetries
        });
        
        if (attempt < maxRetries) {
          // exponential backoff: 100ms, 300ms, 900ms
          const delay = Math.pow(3, attempt) * 100;
          Logger.debug(this.componentName, `⏳ ${delay}ms 후 재시도합니다...`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    
    Logger.error(this.componentName, `❌ validateTokens 최종 실패 (모든 ${maxRetries + 1}회 재시도 소진)`);
    return false;
  }

  /**
   * Create an OAuth2 client and attach token refresh handler to persist tokens.
   */
  private getOAuth2Client(tokens: OAuthTokens) {
    const client = new google.auth.OAuth2(this.config.clientId, this.config.clientSecret, this.config.redirectUri);
    client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expires_at
    } as any);

    // attach event to persist new tokens after refresh
    // google-auth-library returns new credentials via getAccessToken or refreshAccessToken on older libs
    // We'll wrap request for token refresh and persist
    if ((client as any).on) {
      (client as any).on('tokens', async (newTokens: Partial<OAuthTokens> & { expiry_date?: number }) => {
        try {
          const merged = { ...tokens, ...newTokens } as OAuthTokens;
          if (newTokens.expiry_date) merged.expires_at = newTokens.expiry_date;
          await tokenStorage.saveTokens('google', merged);
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to persist refreshed tokens', e);
        }
      });
    }

    return client;
  }

  /**
   * Ensure authentication: try to refresh tokens silently, if not possible return false
   * so caller (UI) can start interactive auth flow.
   */
  public async ensureAuthenticated(): Promise<boolean> {
    try {
      const tokens = await tokenStorage.getTokens('google');
      if (!tokens) return false;

      const valid = await this.validateTokens(tokens);
      return valid;
    } catch (e) {
      Logger.error(this.componentName, 'ensureAuthenticated failed', e);
      return false;
    }
  }


}

// 🔥 싱글톤 익스포트
export const googleOAuthService = GoogleOAuthService.getInstance();
