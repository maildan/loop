// 중앙 보안 구성: CSP 및 OAuth redirect whitelist
export const CSP = {
  production: [
    "default-src 'self' data:",
    // Allow limited inline scripts and localhost origins used by the packaged static server
    "script-src 'self' 'unsafe-inline' https://accounts.google.com http://localhost:35821",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://ui-avatars.com https://lh3.googleusercontent.com",
    "font-src 'self' data:",
    // Allow connections to local static server and local dev endpoints used by renderer
    "connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://www.googleapis.com https://oauth2.googleapis.com",
    "frame-src https://accounts.google.com",
    "worker-src 'self' blob:"
  ].join('; '),
  development: [
    "default-src 'self' data: blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:*",
    "style-src 'self' 'unsafe-inline' http://localhost:* https://localhost:*",
    "img-src 'self' data: blob: http://localhost:* https://localhost:* https://lh3.googleusercontent.com",
    "connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://www.googleapis.com https://oauth2.googleapis.com",
    "frame-src 'self' https://accounts.google.com",
    "worker-src 'self' blob:"
  ].join('; ')
};

// 안전한 redirect whitelist (localhost only with specific port range)
export const REDIRECT_WHITELIST = [
  'http://localhost:35821',
  'http://127.0.0.1:35821'
];

export function isWhitelistedRedirect(url: string): boolean {
  try {
    const u = new URL(url);
    const base = `${u.protocol}//${u.hostname}${u.port ? ':' + u.port : ''}`;
    return REDIRECT_WHITELIST.includes(base);
  } catch (e) {
    return false;
  }
}
// 🔥 기가차드 보안 관리자 - 앱 보안 최고 수준!

import { app, dialog, shell } from 'electron';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../../shared/logger';
import { isString, isObject } from '../../shared/common';

// #DEBUG: Security manager entry point
Logger.debug('SECURITY', 'Security manager module loaded');

// 🔥 기가차드 보안 설정 인터페이스
export interface SecurityConfig {
  enableCSP: boolean;
  allowExternalLinks: boolean;
  allowLocalFileAccess: boolean;
  trustedOrigins: string[];
  blockedDomains: string[];
}

// 🔥 기가차드 보안 정책
const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableCSP: true,
  allowExternalLinks: false,
  allowLocalFileAccess: true,
  trustedOrigins: [
    'http://localhost',
    'https://localhost',
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:35821',
    'https://localhost:3000',
    'https://localhost:4000',
    'https://localhost:35821',
    'file://'
  ],
  blockedDomains: [
    'facebook.com',
    'google-analytics.com',
    'doubleclick.net',
    'googletagmanager.com'
  ]
};

// 🔥 기가차드 보안 관리자 클래스
export class SecurityManager {
  private static instance: SecurityManager | null = null;
  private config: SecurityConfig;
  private securityViolations: Array<{
    type: string;
    url: string;
    timestamp: Date;
    blocked: boolean;
  }> = [];

  private constructor() {
    this.config = { ...DEFAULT_SECURITY_CONFIG };
    this.loadSecurityConfig();
    this.setupSecurityPolicies();
  }

  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // 🔥 보안 설정 로드
  private async loadSecurityConfig(): Promise<void> {
    try {
      // #DEBUG: Loading security config
      const configPath = join(app.getPath('userData'), 'security-config.json');

      try {
        const configData = await fs.readFile(configPath, 'utf-8');
        const parsedConfig = JSON.parse(configData);

        if (isObject(parsedConfig)) {
          this.config = { ...DEFAULT_SECURITY_CONFIG, ...parsedConfig };
          Logger.info('SECURITY', 'Security config loaded', {
            configPath,
            enableCSP: this.config.enableCSP
          });
        }
      } catch (error) {
        // 설정 파일이 없으면 기본 설정 사용
        Logger.info('SECURITY', 'Using default security config');
        await this.saveSecurityConfig();
      }

    } catch (error) {
      Logger.error('SECURITY', 'Failed to load security config', error);
    }
  }

  // 🔥 보안 설정 저장
  private async saveSecurityConfig(): Promise<void> {
    try {
      // #DEBUG: Saving security config
      const configPath = join(app.getPath('userData'), 'security-config.json');
      await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));

      Logger.info('SECURITY', 'Security config saved', { configPath });
    } catch (error) {
      Logger.error('SECURITY', 'Failed to save security config', error);
    }
  }

  // 🔥 보안 정책 설정
  private setupSecurityPolicies(): void {
    try {
      // #DEBUG: Setting up security policies
      Logger.debug('SECURITY', 'Setting up security policies');

      // CSP 헤더 설정 - 로컬 HTTP 서버 및 동적 chunk 로딩 지원
      if (this.config.enableCSP) {
        app.commandLine.appendSwitch('force-csp', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: filesystem: file: http://localhost:35821; script-src 'self' 'unsafe-inline' 'unsafe-eval' data: file: http://localhost:35821; style-src 'self' 'unsafe-inline' data: file: http://localhost:35821; img-src 'self' data: blob: file: http://localhost:35821; font-src 'self' data: file: http://localhost:35821 http://localhost:4000; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* file: data:; worker-src 'self' blob: data: http://localhost:35821; child-src 'self' blob: data: http://localhost:35821;");
      }

      // 외부 링크 차단
      app.on('web-contents-created', (_event: Electron.Event, contents: Electron.WebContents) => {
        contents.on('will-navigate', (navigationEvent: Electron.Event, navigationUrl: string) => {
          if (!this.isUrlAllowed(navigationUrl)) {
            navigationEvent.preventDefault();
            this.recordSecurityViolation('navigation', navigationUrl, true);
            Logger.warn('SECURITY', 'Blocked navigation attempt', { url: navigationUrl });
          }
        });

        contents.setWindowOpenHandler(({ url }: { url: string }) => {
          if (!this.config.allowExternalLinks && !this.isUrlAllowed(url)) {
            this.recordSecurityViolation('window-open', url, true);
            Logger.warn('SECURITY', 'Blocked window open attempt', { url });
            return { action: 'deny' };
          }

          return { action: 'allow' };
        });
      });

      Logger.info('SECURITY', 'Security policies setup completed');

    } catch (error) {
      Logger.error('SECURITY', 'Failed to setup security policies', error);
    }
  }

  // 🔥 URL 허용 여부 확인
  private isUrlAllowed(url: string): boolean {
    try {
      // #DEBUG: Checking URL permission
      if (!isString(url)) {
        return false;
      }

      // 신뢰할 수 있는 오리진 확인
      const isOriginTrusted = this.config.trustedOrigins.some(origin =>
        url.startsWith(origin)
      );

      // 차단된 도메인 확인
      const isDomainBlocked = this.config.blockedDomains.some(domain =>
        url.includes(domain)
      );

      const allowed = isOriginTrusted && !isDomainBlocked;

      Logger.debug('SECURITY', 'URL permission check', {
        url,
        allowed,
        isOriginTrusted,
        isDomainBlocked
      });

      return allowed;

    } catch (error) {
      Logger.error('SECURITY', 'Error checking URL permission', error);
      return false;
    }
  }

  // 🔥 보안 위반 기록
  private recordSecurityViolation(
    type: string,
    url: string,
    blocked: boolean
  ): void {
    try {
      // #DEBUG: Recording security violation
      const violation = {
        type,
        url,
        timestamp: new Date(),
        blocked
      };

      this.securityViolations.push(violation);

      // 최대 100개의 위반 기록만 유지
      if (this.securityViolations.length > 100) {
        this.securityViolations.shift();
      }

      Logger.warn('SECURITY', 'Security violation recorded', violation);

      // 심각한 위반 시 경고 다이얼로그 표시
      if (blocked && this.securityViolations.filter(v => v.blocked).length > 5) {
        this.showSecurityAlert();
      }

    } catch (error) {
      Logger.error('SECURITY', 'Failed to record security violation', error);
    }
  }

  // 🔥 보안 경고 다이얼로그
  private async showSecurityAlert(): Promise<void> {
    try {
      // #DEBUG: Showing security alert
      await dialog.showMessageBox({
        type: 'warning',
        title: 'Loop - 보안 경고',
        message: '의심스러운 활동이 감지되었습니다.',
        detail: '외부 사이트로의 접근 시도가 여러 번 차단되었습니다. 앱의 보안을 위해 이러한 접근은 차단됩니다.',
        buttons: ['확인']
      });

      Logger.info('SECURITY', 'Security alert shown to user');

    } catch (error) {
      Logger.error('SECURITY', 'Failed to show security alert', error);
    }
  }

  // 🔥 보안 설정 업데이트
  public async updateSecurityConfig(
    updates: Partial<SecurityConfig>
  ): Promise<boolean> {
    try {
      // #DEBUG: Updating security config
      Logger.debug('SECURITY', 'Updating security config', updates);

      this.config = { ...this.config, ...updates };
      await this.saveSecurityConfig();

      Logger.info('SECURITY', 'Security config updated successfully');
      return true;

    } catch (error) {
      Logger.error('SECURITY', 'Failed to update security config', error);
      return false;
    }
  }

  // 🔥 보안 상태 가져오기
  public getSecurityStatus(): {
    config: SecurityConfig;
    violations: Array<{
      type: string;
      url: string;
      timestamp: Date;
      blocked: boolean;
    }>;
    violationCount: number;
    lastViolation: Date | null;
  } {
    try {
      // #DEBUG: Getting security status
      const violationCount = this.securityViolations.length;
      const lastViolationEntry = violationCount > 0 ? this.securityViolations[violationCount - 1] : null;
      const lastViolation = lastViolationEntry ? lastViolationEntry.timestamp : null;

      const status = {
        config: this.config,
        violations: [...this.securityViolations],
        violationCount,
        lastViolation
      };

      Logger.debug('SECURITY', 'Security status retrieved', {
        violationCount,
        lastViolation
      });

      return status;

    } catch (error) {
      Logger.error('SECURITY', 'Failed to get security status', error);
      return {
        config: this.config,
        violations: [],
        violationCount: 0,
        lastViolation: null
      };
    }
  }

  // 🔥 보안 위반 기록 지우기
  public clearViolations(): void {
    try {
      // #DEBUG: Clearing security violations
      this.securityViolations = [];
      Logger.info('SECURITY', 'Security violations cleared');
    } catch (error) {
      Logger.error('SECURITY', 'Failed to clear security violations', error);
    }
  }

  // 🔥 외부 링크 안전하게 열기
  public async openExternalLink(url: string): Promise<boolean> {
    try {
      // #DEBUG: Opening external link safely
      if (!isString(url) || !url.startsWith('http')) {
        Logger.warn('SECURITY', 'Invalid URL for external opening', { url });
        return false;
      }

      // 사용자 확인
      const result = await dialog.showMessageBox({
        type: 'question',
        title: 'Loop - 외부 링크',
        message: '외부 링크를 여시겠습니까?',
        detail: `다음 주소로 이동합니다:\n${url}`,
        buttons: ['취소', '열기'],
        defaultId: 0,
        cancelId: 0
      });

      if (result.response === 1) {
        await shell.openExternal(url);
        Logger.info('SECURITY', 'External link opened with user consent', { url });
        return true;
      }

      Logger.info('SECURITY', 'External link opening cancelled by user', { url });
      return false;

    } catch (error) {
      Logger.error('SECURITY', 'Failed to open external link', error);
      return false;
    }
  }
}

// 🔥 기가차드 싱글톤 보안 관리자
export const securityManager = SecurityManager.getInstance();

// #DEBUG: Security manager module exit point
Logger.debug('SECURITY', 'Security manager module setup complete');

export default securityManager;
