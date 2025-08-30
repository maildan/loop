// 🔥 기가차드 OAuth 서비스 - Google Docs 연동 전문가!
import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result, IpcResponse, GoogleDriveFilesResponse, GoogleDriveFile, OAuthTokenResponse, GoogleUserInfo } from '../../shared/types';
import { GOOGLE_OAUTH_CONFIG } from '../types/oauth';
import { shell } from 'electron';
import { createHash, randomBytes, createCipheriv } from 'crypto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { app as electronApp } from 'electron';
import { windowManager } from '../core/window';

// 🔥 OAuth 상태 인터페이스
interface OAuthState {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  userEmail?: string;
  expiresAt?: Date;
  scopes?: string[];
}

// 🔥 Google 문서 인터페이스
interface GoogleDocument {
  id: string;
  title: string;
  modifiedTime: string;
  webViewLink?: string;
}

/**
 * 🔥 OAuthService - Google OAuth 2.0 인증 및 문서 가져오기
 * PKCE (Proof Key for Code Exchange) 보안 강화 적용
 */
export class OAuthService extends BaseManager {
  private readonly componentName = 'OAUTH_SERVICE';
  private oauthState: OAuthState = { isAuthenticated: false };
  private codeVerifier: string = '';
  private codeChallenge: string = '';
  private readonly redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:35821/oauth/callback';

  constructor() {
    super({
      name: 'OAuthService',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service initialized');
    // 환경변수에서 토큰 부트스트랩
    await this.bootstrapFromEnv();
    // 저장된 토큰 로드 시도
    await this.loadStoredTokens();
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service started');
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service stopped');
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'OAuth service cleaned up');
    // 토큰 정리는 명시적 revokeAuth 호출에서만 수행
  }

  /**
   * 🔥 Google OAuth 인증 시작
   */
  public async startGoogleAuth(): Promise<IpcResponse<{ authUrl: string }>> {
    try {
      Logger.info(this.componentName, 'Starting Google OAuth authentication');

      // 환경변수 검증
      if (!GOOGLE_OAUTH_CONFIG.clientId) {
        Logger.error(this.componentName, 'GOOGLE_CLIENT_ID가 설정되지 않았습니다');
        return {
          success: false,
          error: 'Google OAuth 설정이 완료되지 않았습니다.\n\n.env 파일에 다음을 추가하세요:\nGOOGLE_CLIENT_ID=your-client-id\nGOOGLE_CLIENT_SECRET=your-client-secret\n\n또는 Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성하세요.',
          timestamp: new Date(),
        };
      }

      if (!GOOGLE_OAUTH_CONFIG.clientSecret) {
        Logger.error(this.componentName, 'GOOGLE_CLIENT_SECRET가 설정되지 않았습니다');
        return {
          success: false,
          error: 'Google Client Secret이 설정되지 않았습니다.\n\n.env 파일에 GOOGLE_CLIENT_SECRET를 추가하세요.',
          timestamp: new Date(),
        };
      }

      // PKCE 코드 생성
      this.codeVerifier = this.generateCodeVerifier();
      this.codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

      // OAuth URL 생성
      const authUrl = this.buildAuthUrl();

      Logger.info(this.componentName, 'OAuth URL generated', { url: authUrl });

      // 🔥 외부 기본 브라우저에서 OAuth 열기 (Google 권장 방식)
      try {
        await shell.openExternal(authUrl);
        Logger.info(this.componentName, 'OAuth URL opened in default browser');
      } catch (browserError) {
        Logger.error(this.componentName, 'Failed to open browser', browserError);
      }

      return {
        success: true,
        data: { authUrl },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to start Google auth', error);
      return {
        success: false,
        error: 'OAuth 인증을 시작할 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 OAuth 콜백 처리 (인증 코드 → 액세스 토큰)
   */
  public async handleCallback(code: string): Promise<IpcResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      Logger.info(this.componentName, 'Handling OAuth callback');

      const tokenResponse = await this.exchangeCodeForTokens(code);

      if (!tokenResponse.access_token) {
        throw new Error('No access token received');
      }

      // 사용자 정보 가져오기
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // 상태 업데이트
      this.oauthState = {
        isAuthenticated: true,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        userEmail: userInfo.email,
        expiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000)),
        scopes: tokenResponse.scope?.split(' '),
      };

      // 토큰 저장
      await this.saveTokens();

      Logger.info(this.componentName, 'OAuth authentication successful', {
        email: userInfo.email
      });

      return {
        success: true,
        data: {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token || '',
        },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle OAuth callback', error);
      return {
        success: false,
        error: 'OAuth 인증에 실패했습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 Google 문서 목록 가져오기
   */
  public async getGoogleDocuments(): Promise<IpcResponse<GoogleDocument[]>> {
    try {
      if (!this.oauthState.isAuthenticated || !this.oauthState.accessToken) {
        return {
          success: false,
          error: '인증이 필요합니다',
          timestamp: new Date(),
        };
      }

      // 토큰 만료 확인 및 갱신
      await this.ensureValidToken();
      const doRequest = async () => axios.get('https://www.googleapis.com/drive/v3/files', {
        headers: {
          Authorization: `Bearer ${this.oauthState.accessToken}`,
        },
        params: {
          q: "mimeType='application/vnd.google-apps.document'",
          fields: 'files(id,name,modifiedTime,webViewLink)',
          orderBy: 'modifiedTime desc',
          pageSize: 50,
        },
      });
      let response = await doRequest();
      // 401 대응: 토큰 갱신 후 1회 재시도
      if (response.status === 401) {
        await this.refreshAccessToken();
        response = await doRequest();
      }

      const data = response.data as GoogleDriveFilesResponse;
      const documents: GoogleDocument[] = data.files.map((file: GoogleDriveFile) => ({
        id: file.id,
        title: file.name,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
      }));

      Logger.info(this.componentName, 'Google documents retrieved', {
        count: documents.length
      });

      return {
        success: true,
        data: documents,
        timestamp: new Date(),
      };
    } catch (error) {
      // 401 에러 시 재시도 경로가 실패했을 가능성 → 인증 초기화 유도
      Logger.error(this.componentName, 'Failed to get Google documents', error);
      return {
        success: false,
        error: 'Google 문서를 가져올 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 Google 문서 내용 가져오기
   */
  public async importGoogleDoc(documentId: string): Promise<IpcResponse<{ title: string; content: string }>> {
    try {
      if (!this.oauthState.isAuthenticated || !this.oauthState.accessToken) {
        return {
          success: false,
          error: '인증이 필요합니다',
          timestamp: new Date(),
        };
      }

      await this.ensureValidToken();

      // 문서 메타데이터 가져오기 (401 시 재시도)
      const doMeta = async () => axios.get(`https://www.googleapis.com/drive/v3/files/${documentId}`, {
        headers: { Authorization: `Bearer ${this.oauthState.accessToken}` },
        params: { fields: 'name' },
      });
      let metaResponse = await doMeta();
      if (metaResponse.status === 401) {
        await this.refreshAccessToken();
        metaResponse = await doMeta();
      }

      // 문서 내용 가져오기 (텍스트 형태로)
      const doContent = async () => axios.get(`https://docs.googleapis.com/v1/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${this.oauthState.accessToken}` },
      });
      let contentResponse = await doContent();
      if (contentResponse.status === 401) {
        await this.refreshAccessToken();
        contentResponse = await doContent();
      }

      // Google Docs API 응답에서 텍스트 추출
      const content = this.extractTextFromGoogleDoc(contentResponse.data);

      Logger.info(this.componentName, 'Google document imported', {
        documentId,
        title: metaResponse.data.name,
        contentLength: content.length
      });

      return {
        success: true,
        data: {
          title: metaResponse.data.name,
          content,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to import Google document', error);
      return {
        success: false,
        error: 'Google 문서를 가져올 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 인증 상태 확인 (실제 토큰 유효성 검증)
   */
  public async getAuthStatus(): Promise<IpcResponse<{ isAuthenticated: boolean; userEmail?: string; userName?: string; userPicture?: string }>> {
    try {
      // 🔥 단순한 플래그 확인이 아니라 실제 토큰 존재 여부 및 유효성 검증
      if (!this.oauthState.accessToken || !this.oauthState.refreshToken) {
        // 저장된 토큰 다시 로드 시도
        await this.loadStoredTokens();

        if (!this.oauthState.accessToken || !this.oauthState.refreshToken) {
          Logger.debug(this.componentName, 'No valid tokens found');
          return {
            success: true,
            data: {
              isAuthenticated: false,
            },
            timestamp: new Date(),
          };
        }
      }

      // 🔥 토큰 만료 확인 및 갱신 시도
      try {
        await this.ensureValidToken();

        // 🔥 실제 API 호출로 토큰 유효성 검증
        const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: {
            Authorization: `Bearer ${this.oauthState.accessToken}`,
          },
        });

        const userInfo = response.data;

        // 🔥 상태 동기화 - userEmail, userName, userPicture 업데이트
        if (userInfo.email && !this.oauthState.userEmail) {
          this.oauthState.userEmail = userInfo.email;
        }
        if (userInfo.name) {
          (this.oauthState as any).userName = userInfo.name;
        }
        if (userInfo.picture) {
          (this.oauthState as any).userPicture = userInfo.picture;
        }
        await this.saveTokens(); // 업데이트된 정보 저장

        Logger.debug(this.componentName, 'Auth status verified with API call', {
          isAuthenticated: true,
          userEmail: userInfo.email || this.oauthState.userEmail,
          userName: userInfo.name,
        });

        return {
          success: true,
          data: {
            isAuthenticated: true,
            userEmail: userInfo.email || this.oauthState.userEmail,
            userName: userInfo.name || (this.oauthState as any).userName,
            userPicture: userInfo.picture || (this.oauthState as any).userPicture,
          },
          timestamp: new Date(),
        };
      } catch (apiError) {
        Logger.warn(this.componentName, 'Token validation failed, attempting refresh', apiError);

        // 🔥 토큰 갱신 시도
        try {
          await this.refreshAccessToken();

          // 갱신 후 다시 확인
          const retryResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
              Authorization: `Bearer ${this.oauthState.accessToken}`,
            },
          });

          const retryUserInfo = retryResponse.data;

          Logger.info(this.componentName, 'Auth status verified after token refresh', {
            userEmail: retryUserInfo.email
          });

          return {
            success: true,
            data: {
              isAuthenticated: true,
              userEmail: retryUserInfo.email || this.oauthState.userEmail,
            },
            timestamp: new Date(),
          };
        } catch (refreshError) {
          Logger.error(this.componentName, 'Token refresh failed, user needs to re-authenticate', refreshError);

          // 🔥 토큰이 완전히 무효화된 경우 상태 초기화
          this.oauthState = { isAuthenticated: false };
          await this.clearStoredTokens();

          return {
            success: true,
            data: {
              isAuthenticated: false,
            },
            timestamp: new Date(),
          };
        }
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to check auth status', error);
      return {
        success: false,
        error: '인증 상태를 확인할 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 인증 취소
   */
  public async revokeAuth(): Promise<IpcResponse<boolean>> {
    try {
      if (this.oauthState.accessToken) {
        // Google에서 토큰 취소
        await axios.post('https://oauth2.googleapis.com/revoke', null, {
          params: {
            token: this.oauthState.accessToken,
          },
        });
      }

      // 로컬 상태 초기화
      this.oauthState = { isAuthenticated: false };
      await this.clearStoredTokens();

      // broadcast logout to renderers
      try {
        const wins = windowManager.getAllWindows();
        wins.forEach(w => {
          try { w.webContents.send('auth-status-changed', { isAuthenticated: false }); } catch (e) { }
        });
      } catch (e) {
        Logger.warn(this.componentName, 'Failed to broadcast logout to renderers', e);
      }

      Logger.info(this.componentName, 'OAuth authentication revoked');

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to revoke auth', error);
      return {
        success: false,
        error: '인증 취소에 실패했습니다',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 Private Helper Methods

  private generateCodeVerifier(): string {
    return randomBytes(32).toString('base64url');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const hash = createHash('sha256').update(verifier).digest();
    return hash.toString('base64url');
  }

  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
      code_challenge: this.codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      // select_account를 추가하여 브라우저에서 계정 선택창이 뜨도록 강제
      prompt: 'select_account consent',
    });

    return `${GOOGLE_OAUTH_CONFIG.authUrl}?${params.toString()}`;
  }

  /**
   * 빌드된 OAuth URL에 login_hint를 추가하여 특정 이메일을 제안할 수 있도록 합니다.
   */
  public buildAuthUrlWithHint(loginHint?: string): string {
    const base = this.buildAuthUrl();
    if (!loginHint) return base;
    const url = new URL(base);
    url.searchParams.set('login_hint', loginHint);
    return url.toString();
  }

  private async exchangeCodeForTokens(code: string): Promise<OAuthTokenResponse> {
    const params1 = new URLSearchParams();
    params1.append('client_id', GOOGLE_OAUTH_CONFIG.clientId);
    params1.append('client_secret', GOOGLE_OAUTH_CONFIG.clientSecret);
    params1.append('redirect_uri', this.redirectUri);
    params1.append('grant_type', 'authorization_code');
    params1.append('code', code);
    params1.append('code_verifier', this.codeVerifier);

    const response = await axios.post<OAuthTokenResponse>(GOOGLE_OAUTH_CONFIG.tokenUrl, params1.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data;
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await axios.get<GoogleUserInfo>('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.oauthState.expiresAt || this.oauthState.expiresAt <= new Date()) {
      if (this.oauthState.refreshToken) {
        await this.refreshAccessToken();
      } else {
        throw new Error('Token expired and no refresh token available');
      }
    }
  }

  private async refreshAccessToken(): Promise<void> {
    // allow using env refresh token as fallback for development
    const refreshToken = this.oauthState.refreshToken || process.env.GOOGLE_REFRESH_TOKEN;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    // Retry with exponential backoff
    let attempt = 0;
    let lastErr: any = null;
    let response: any = null;
    while (attempt < 3) {
      try {
        const params2 = new URLSearchParams();
        params2.append('client_id', GOOGLE_OAUTH_CONFIG.clientId);
        params2.append('client_secret', GOOGLE_OAUTH_CONFIG.clientSecret);
        params2.append('refresh_token', refreshToken);
        params2.append('grant_type', 'refresh_token');

        response = await axios.post(GOOGLE_OAUTH_CONFIG.tokenUrl, params2.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        break;
      } catch (err) {
        lastErr = err;
        const backoff = Math.pow(2, attempt) * 250; // 250ms, 500ms, 1000ms
        Logger.warn(this.componentName, `Refresh access token attempt ${attempt + 1} failed, retrying in ${backoff}ms`, err);
        await new Promise((r) => setTimeout(r, backoff));
        attempt++;
      }
    }
    if (!response) {
      // If the remote returned invalid_grant (revoked/expired refresh token), clear stored tokens
      const errData = lastErr?.response?.data;
      if (errData && (errData.error === 'invalid_grant' || (errData.error_description && /revoked|expired/i.test(errData.error_description)))) {
        Logger.warn(this.componentName, 'Refresh token invalid (expired or revoked) - clearing stored tokens', errData);
        try {
          await this.clearStoredTokens();
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to clear stored tokens after invalid_grant', e);
        }

        // Notify renderer(s) to prompt re-authentication
        try {
          const wins = windowManager.getAllWindows();
          wins.forEach(w => {
            try {
              w.webContents.send('oauth:login-required');
            } catch (e) {
              // ignore per-window send failures
            }
          });
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to notify renderers about login requirement', e);
        }

        throw new Error('invalid_grant');
      }

      throw lastErr || new Error('Failed to refresh access token');
    }

    this.oauthState.accessToken = response.data.access_token;
    this.oauthState.refreshToken = this.oauthState.refreshToken || refreshToken;
    this.oauthState.expiresAt = new Date(Date.now() + (response.data.expires_in * 1000));

    // After refresh, fetch user info to update snapshot
    try {
      const userInfo = await this.getUserInfo(this.oauthState.accessToken as string);
      if (userInfo.email) this.oauthState.userEmail = userInfo.email;
      if (userInfo.name) (this.oauthState as any).userName = userInfo.name;
      if (userInfo.picture) (this.oauthState as any).userPicture = userInfo.picture;
    } catch (e) {
      Logger.warn(this.componentName, 'Failed to fetch user info after refresh', e);
    }

    await this.saveTokens();
  }

  private extractTextFromGoogleDoc(docData: any): string {
    // Google Docs API 응답에서 텍스트 추출
    let text = '';

    if (docData.body && docData.body.content) {
      for (const element of docData.body.content) {
        if (element.paragraph) {
          for (const textElement of element.paragraph.elements || []) {
            if (textElement.textRun) {
              text += textElement.textRun.content;
            }
          }
        }
      }
    }

    return text;
  }

  private async loadStoredTokens(): Promise<void> {
    try {
      // dynamic import for optional native dependency (keytar)
      let keytar: any = null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
        keytar = await import('keytar');
        if (!keytar) {
          Logger.debug(this.componentName, 'keytar not available - skipping token load');
          return;
        }
      } catch (e) {
        Logger.debug(this.componentName, 'keytar dynamic import failed - skipping token load', e);
        return;
      }

      const service = 'loop-oauth';
      const account = 'google';
      const stored = await keytar.getPassword(service, account);
      if (!stored) {
        Logger.debug(this.componentName, 'No stored tokens found in keychain');
        return;
      }

      const parsed = JSON.parse(stored);
      this.oauthState = {
        isAuthenticated: true,
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        userEmail: parsed.userEmail,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
        scopes: parsed.scopes,
      };

      Logger.info(this.componentName, 'Loaded OAuth tokens from keychain', { userEmail: this.oauthState.userEmail });
      // persist non-secret auth snapshot for preload synchronous access
      try {
        await this.writeAuthSnapshot();
      } catch (e) {
        Logger.warn(this.componentName, 'Failed to write auth snapshot after loading tokens', e);
      }
    } catch (error) {
      Logger.warn(this.componentName, 'Failed to load stored tokens (keytar)', error);
    }
  }

  private async saveTokens(): Promise<void> {
    try {
      let keytar: any = null;
      try {
        keytar = await import('keytar');
      } catch (e) {
        Logger.debug(this.componentName, 'keytar dynamic import failed - will fallback to file snapshot', e);
        keytar = null;
      }

      const service = 'loop-oauth';
      const account = 'google';
      const payload = JSON.stringify({
        accessToken: this.oauthState.accessToken,
        refreshToken: this.oauthState.refreshToken,
        userEmail: this.oauthState.userEmail,
        expiresAt: this.oauthState.expiresAt ? this.oauthState.expiresAt.toISOString() : undefined,
        scopes: this.oauthState.scopes,
      });

      if (keytar && typeof keytar.setPassword === 'function') {
        try {
          await keytar.setPassword(service, account, payload);
          Logger.info(this.componentName, 'Saved OAuth tokens to keychain', { userEmail: this.oauthState.userEmail });
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to save tokens to keychain - will fallback to file snapshot', e);
        }
      } else {
        Logger.debug(this.componentName, 'keytar not available - skipping token save to keychain');
      }

      // update non-sensitive auth snapshot for renderer preload (always attempt)
      try {
        await this.writeAuthSnapshot();
      } catch (e) {
        Logger.warn(this.componentName, 'Failed to write auth snapshot after saving tokens', e);
      }

      // Do not broadcast auth-status-changed here to avoid event loops where
      // renderers call getAuthStatus in response and trigger repeated saves.
      // If consumers need an immediate notification, they should listen for
      // 'oauth-success' which is emitted elsewhere in the flow after full
      // completion of the auth handshake.
    } catch (error) {
      Logger.warn(this.componentName, 'Failed to save tokens to keychain', error);
    }
  }

  private async clearStoredTokens(): Promise<void> {
    try {
      let keytar: any = null;
      try {
        keytar = await import('keytar');
        if (!keytar) {
          Logger.debug(this.componentName, 'keytar not available - skipping token clear');
          return;
        }
      } catch (e) {
        Logger.debug(this.componentName, 'keytar dynamic import failed - skipping token clear', e);
        return;
      }

      const service = 'loop-oauth';
      const account = 'google';
      await keytar.deletePassword(service, account);
      Logger.info(this.componentName, 'Cleared stored OAuth tokens from keychain');
      // Also remove any non-sensitive auth snapshot stored in keytar and on disk
      try {
        try {
          await keytar.deletePassword('loop-auth-snapshot', 'snapshot');
          Logger.debug(this.componentName, 'Removed auth snapshot from keychain');
        } catch (e) {
          // ignore if snapshot not present
        }

        try {
          let baseDir = process.cwd();
          try {
            if (electronApp && typeof electronApp.getPath === 'function') {
              baseDir = electronApp.getPath('userData');
            }
          } catch (e) {
            // ignore
          }
          const filePath = path.join(baseDir, '.auth_snapshot.json');
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); Logger.debug(this.componentName, 'Removed auth snapshot file'); } catch (e) { /* ignore */ }
          }
        } catch (e) {
          // ignore
        }
      } catch (e) {
        Logger.warn(this.componentName, 'Failed cleaning up auth snapshot after clearing tokens', e);
      }
    } catch (error) {
      Logger.warn(this.componentName, 'Failed to clear stored tokens (keytar)', error);
    }
  }

  // (외부 브라우저 플로우 사용)

  /**
   * 🔥 환경변수에서 토큰 부트스트랩
   */
  private async bootstrapFromEnv(): Promise<void> {
    try {
      // Only allow bootstrapping from env in non-production (development/testing) to avoid leaking user tokens in distributed builds
      if (process.env.NODE_ENV === 'production') {
        Logger.debug(this.componentName, 'Skipping bootstrapFromEnv in production');
        return;
      }
      const envAccess = process.env.GOOGLE_ACCESS_TOKEN;
      const envRefresh = process.env.GOOGLE_REFRESH_TOKEN;

      // 우선: refresh token이 있으면 이를 사용해 access token을 갱신 시도
      if (envRefresh) {
        Logger.info(this.componentName, 'Env refresh token found - attempting to refresh access token first');
        try {
          this.oauthState.refreshToken = envRefresh;
          await this.refreshAccessToken();

          const newAccess = this.oauthState.accessToken || '';
          const valid = await this.validateTokenScopes(newAccess);
          if (valid) {
            this.oauthState.isAuthenticated = true;
            this.oauthState.scopes = GOOGLE_OAUTH_CONFIG.scopes;
            this.oauthState.expiresAt = new Date(Date.now() + (3600 * 1000));
            Logger.info(this.componentName, 'Access token refreshed and has required scopes');
            return;
          } else {
            Logger.warn(this.componentName, 'Refreshed access token does not contain required scopes');
          }
        } catch (refreshError) {
          Logger.warn(this.componentName, 'Failed to refresh access token using env refresh token', refreshError);
        }
      }

      // fallback: env access token 사용
      if (envAccess && envRefresh) {
        Logger.info(this.componentName, 'Bootstrapping OAuth tokens from environment variables (fallback to env access token)');
        const hasValidScopes = await this.validateTokenScopes(envAccess);
        if (!hasValidScopes) {
          Logger.warn(this.componentName, 'Env access token does not have required scopes - marking unauthenticated');
          this.oauthState = { isAuthenticated: false };
          return;
        }

        this.oauthState = {
          isAuthenticated: true,
          accessToken: envAccess,
          refreshToken: envRefresh,
          userEmail: 'user@gmail.com',
          expiresAt: new Date(Date.now() + (3600 * 1000)),
          scopes: GOOGLE_OAUTH_CONFIG.scopes
        };

        Logger.info(this.componentName, 'OAuth tokens loaded from environment (access token)');
        try {
          await this.writeAuthSnapshot();
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to write auth snapshot after bootstrapFromEnv', e);
        }
      } else {
        Logger.debug(this.componentName, 'No OAuth tokens found in environment variables');
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to bootstrap tokens from environment', error);
    }
  }

  /**
   * Write a minimal, non-sensitive auth snapshot file for preload to read synchronously.
   * This file MUST NOT contain tokens. It only contains isAuthenticated, userEmail, userName, userPicture.
   */
  private async writeAuthSnapshot(): Promise<void> {
    try {
      const snapshot = {
        isAuthenticated: !!this.oauthState.isAuthenticated,
        userEmail: this.oauthState.userEmail || null,
        userName: (this.oauthState as any).userName || null,
        userPicture: (this.oauthState as any).userPicture || null,
      };
      // Try to save snapshot to OS secure storage first (keytar)
      try {
        let keytar: any = null;
        try {
          keytar = await import('keytar');
          if (keytar) {
            const service = 'loop-auth-snapshot';
            const account = 'snapshot';
            await keytar.setPassword(service, account, JSON.stringify(snapshot));
            Logger.debug(this.componentName, 'Auth snapshot saved to secure storage');
            return;
          }
        } catch (e) {
          Logger.warn(this.componentName, 'Keytar not available - falling back to file-based auth snapshot', e);
        }
      } catch (e) {
        // fallback continues to file write
      }

      // Fallback: write to userData directory
      let baseDir = process.cwd();
      try {
        if (electronApp && typeof electronApp.getPath === 'function') {
          baseDir = electronApp.getPath('userData');
        }
      } catch (e) {
        // ignore
      }

      const filePath = path.join(baseDir, '.auth_snapshot.json');

      // If environment variable ENCRYPT_SNAPSHOT_KEY is present, encrypt snapshot before writing
      const encryptionKey = process.env.ENCRYPT_SNAPSHOT_KEY;
      if (encryptionKey) {
        try {
          const iv = randomBytes(12);
          const cipher = createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
          const data = Buffer.from(JSON.stringify(snapshot), 'utf-8');
          const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
          const tag = cipher.getAuthTag();
          const payload = Buffer.concat([iv, tag, encrypted]).toString('base64');
          fs.writeFileSync(filePath, payload, { encoding: 'utf-8', mode: 0o600 });
          Logger.debug(this.componentName, 'Encrypted auth snapshot written to file');
        } catch (e) {
          Logger.warn(this.componentName, 'Failed to encrypt auth snapshot - falling back to plaintext file', e);
          fs.writeFileSync(filePath, JSON.stringify(snapshot), { encoding: 'utf-8', mode: 0o600 });
        }
      } else {
        // write with restrictive permissions and attempt to remove after delay if keytar is available later
        fs.writeFileSync(filePath, JSON.stringify(snapshot), { encoding: 'utf-8', mode: 0o600 });
      }
      try {
        // schedule background task to remove file if keytar becomes available
        setTimeout(async () => {
          try {
            const keytar = await import('keytar');
            if (keytar) {
              // move to keytar and remove file
              await keytar.setPassword('loop-auth-snapshot', 'snapshot', JSON.stringify(snapshot));
              try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
              Logger.debug(this.componentName, 'Auth snapshot migrated to keychain and file removed');
            }
          } catch (e) {
            // ignore
          }
        }, 5000);
      } catch (e) {
        // ignore
      }
    } catch (error) {
      Logger.warn(this.componentName, 'Failed to write auth snapshot file', error);
    }
  }

  /**
   * 🔥 토큰 스코프 검증
   */
  private async validateTokenScopes(accessToken: string): Promise<boolean> {
    try {
      // Google OAuth2 tokeninfo API로 스코프 확인
      const response = await axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        params: { access_token: accessToken }
      });

      const tokenScopes = response.data.scope?.split(' ') || [];
      const requiredScopes = [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive.file'
      ];

      // 필수 스코프가 모두 포함되어 있는지 확인
      const hasAllScopes = requiredScopes.every(scope =>
        tokenScopes.includes(scope)
      );

      Logger.info(this.componentName, '토큰 스코프 검증 결과', {
        tokenScopes,
        requiredScopes,
        hasAllScopes
      });

      return hasAllScopes;
    } catch (error) {
      Logger.warn(this.componentName, '토큰 스코프 검증 실패 - 재인증 필요', error);
      return false; // 검증 실패 시 재인증 필요
    }
  }
}
