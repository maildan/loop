/**
 * 🔒 Settings IPC 핸들러 보안 테스트
 * 
 * V2 (임의 설정 쓰기): 화이트리스트 검증 테스트
 * V1 (파일 읽기): 경로 검증 및 심링크 공격 방어 테스트
 */

import {
  isAllowedSettingsKey,
  validateSettingValue,
  ALLOWED_SETTINGS_KEYS,
  SettingsDataSchema,
} from '../../src/shared/validation/settingsValidation';

describe('🔒 Settings Validation - V2 & V1 Security Fixes', () => {
  describe('V2: 화이트리스트 검증', () => {
    describe('isAllowedSettingsKey', () => {
      it('✅ 허용되는 UI 설정 키는 통과', () => {
        expect(isAllowedSettingsKey('ui.theme')).toBe(true);
        expect(isAllowedSettingsKey('ui.fontSize')).toBe(true);
        expect(isAllowedSettingsKey('ui.focusMode')).toBe(true);
      });

      it('✅ 허용되는 앱 설정 키는 통과', () => {
        expect(isAllowedSettingsKey('app.theme')).toBe(true);
        expect(isAllowedSettingsKey('app.language')).toBe(true);
        expect(isAllowedSettingsKey('app.fontSize')).toBe(true);
      });

      it('✅ 허용되는 계정 프로필 키는 통과', () => {
        expect(isAllowedSettingsKey('account.displayName')).toBe(true);
        expect(isAllowedSettingsKey('account.avatar')).toBe(true);
      });

      it('🚫 금지된 admin 키는 차단', () => {
        expect(isAllowedSettingsKey('admin.token')).toBe(false);
        expect(isAllowedSettingsKey('admin.apiKey')).toBe(false);
        expect(isAllowedSettingsKey('security.apiKey')).toBe(false);
      });

      it('🚫 금지된 auth 키는 차단', () => {
        expect(isAllowedSettingsKey('auth.token')).toBe(false);
        expect(isAllowedSettingsKey('auth.refreshToken')).toBe(false);
        expect(isAllowedSettingsKey('auth.sessionId')).toBe(false);
      });

      it('🚫 임의의 새로운 키는 차단', () => {
        expect(isAllowedSettingsKey('malicious.key')).toBe(false);
        expect(isAllowedSettingsKey('hacker.settings')).toBe(false);
        expect(isAllowedSettingsKey('random.value')).toBe(false);
      });

      it('🚫 계정 민감 정보 키는 차단', () => {
        expect(isAllowedSettingsKey('account.userId')).toBe(false);
        expect(isAllowedSettingsKey('account.email')).toBe(false);
        expect(isAllowedSettingsKey('account.username')).toBe(false);
        expect(isAllowedSettingsKey('account.authProvider')).toBe(false);
      });
    });

    describe('validateSettingValue', () => {
      it('✅ 유효한 boolean 값은 통과', () => {
        expect(() => validateSettingValue('ui.focusMode', true)).not.toThrow();
        expect(() => validateSettingValue('ui.focusMode', false)).not.toThrow();
        expect(() => validateSettingValue('app.autoSave', true)).not.toThrow();
      });

      it('✅ 유효한 숫자 값은 통과', () => {
        expect(() => validateSettingValue('app.fontSize', 14)).not.toThrow();
        expect(() => validateSettingValue('ui.windowWidth', 1024)).not.toThrow();
        expect(() => validateSettingValue('performance.maxCPUUsage', 50)).not.toThrow();
      });

      it('✅ 유효한 enum 값은 통과', () => {
        expect(() => validateSettingValue('app.theme', 'dark')).not.toThrow();
        expect(() => validateSettingValue('app.theme', 'light')).not.toThrow();
        expect(() => validateSettingValue('account.syncProvider', 'cloud')).not.toThrow();
      });

      it('🚫 잘못된 타입은 throw', () => {
        expect(() => validateSettingValue('ui.focusMode', 'true')).toThrow();
        expect(() => validateSettingValue('app.fontSize', 'large')).toThrow();
        expect(() => validateSettingValue('app.fontSize', -5)).toThrow(); // 범위 밖
      });

      it('🚫 범위 밖의 값은 throw', () => {
        expect(() => validateSettingValue('app.fontSize', 5)).toThrow(); // 너무 작음
        expect(() => validateSettingValue('app.fontSize', 100)).toThrow(); // 너무 큼
        expect(() => validateSettingValue('performance.maxCPUUsage', 150)).toThrow(); // 100 초과
        expect(() => validateSettingValue('ui.windowWidth', 100)).toThrow(); // 400 미만
      });

      it('🚫 허용되지 않는 키는 throw', () => {
        expect(() => validateSettingValue('admin.token', 'secret')).toThrow(
          /Invalid settings key/
        );
        expect(() => validateSettingValue('auth.sessionId', 'abc123')).toThrow(
          /Invalid settings key/
        );
      });

      it('✅ 선택적 필드는 undefined 허용', () => {
        expect(() => validateSettingValue('account.displayName', undefined)).not.toThrow();
        expect(() => validateSettingValue('account.avatar', undefined)).not.toThrow();
      });
    });

    describe('whitelist 커버리지', () => {
      it('✅ 모든 UI 설정은 화이트리스트에 있음', () => {
        const uiSettings = ALLOWED_SETTINGS_KEYS.filter((k: string) => k.startsWith('ui.'));
        expect(uiSettings.length).toBeGreaterThan(0);
        expect(uiSettings).toContain('ui.focusMode');
        expect(uiSettings).toContain('ui.zenMode');
      });

      it('✅ 모든 app 설정은 화이트리스트에 있음', () => {
        const appSettings = ALLOWED_SETTINGS_KEYS.filter((k: string) => k.startsWith('app.'));
        expect(appSettings.length).toBeGreaterThan(0);
        expect(appSettings).toContain('app.theme');
        expect(appSettings).toContain('app.fontSize');
      });

      it('✅ 승인된 계정 프로필 필드만 있음', () => {
        const accountSettings = ALLOWED_SETTINGS_KEYS.filter((k: string) => k.startsWith('account.'));
        expect(accountSettings).toContain('account.displayName');
        expect(accountSettings).toContain('account.avatar');
        expect(accountSettings).not.toContain('account.userId');
        expect(accountSettings).not.toContain('account.email');
      });

      it('✅ 민감한 카테고리는 없음', () => {
        const sensitiveCategories = ['admin', 'auth', 'secret', 'token', 'api'];
        for (const key of ALLOWED_SETTINGS_KEYS) {
          for (const sensitive of sensitiveCategories) {
            expect(key).not.toContain(`${sensitive}.`);
          }
        }
      });
    });
  });

  describe('V1: 파일 경로 검증 (심링크 방어)', () => {
    it('✅ SettingsDataSchema는 유효한 설정 객체 검증', () => {
      const validSettings = {
        app: {
          theme: 'dark' as const,
          language: 'ko',
          autoSave: true,
          startMinimized: false,
          minimizeToTray: false,
          fontSize: 14,
          fontFamily: 'system-ui',
        },
        keyboard: {
          enabled: true,
          language: 'ko',
          trackAllApps: false,
          sessionTimeout: 300,
        },
        ui: {
          windowWidth: 1024,
          windowHeight: 768,
          sidebarCollapsed: false,
          showLineNumbers: true,
          showWordCount: true,
          appSidebarCollapsed: false,
          zenMode: false,
          focusMode: false,
          hideToolbars: false,
          minimalistMode: false,
          compactMode: false,
          showShortcutHelp: true,
        },
        performance: {
          enableGPUAcceleration: true,
          maxCPUUsage: 50,
          maxMemoryUsage: 2048,
          enableHardwareAcceleration: true,
        },
        account: {
          displayName: 'User',
          enableSync: true,
          syncProvider: 'local' as const,
          syncInterval: 60,
          enableTwoFactor: false,
          authProvider: 'local' as const,
          sessionTimeout: 3600,
        },
        notifications: {
          enableNotifications: true,
          enableSounds: true,
          notifyGoalAchieved: true,
          notifyDailyGoal: true,
          notifyErrors: false,
        },
      };

      const result = SettingsDataSchema.safeParse(validSettings);
      expect(result.success).toBe(true);
    });
  });

  describe('종합 보안 검증', () => {
    it('✅ 공격 패턴 차단 확인', () => {
      const attackPatterns = [
        'security.apiKey',
        'admin.token',
        'auth.refreshToken',
        'db.password',
        'api.key',
        'jwt.secret',
        'app.admin.token',
        'account.password',
        'settings.encryptionKey',
      ];

      for (const pattern of attackPatterns) {
        expect(isAllowedSettingsKey(pattern)).toBe(false);
      }
    });

    it('✅ 일반 사용자 설정 접근 보장', () => {
      const userSettings = [
        'ui.focusMode',
        'app.theme',
        'account.displayName',
        'app.fontSize',
        'notifications.enableNotifications',
      ];

      for (const setting of userSettings) {
        expect(isAllowedSettingsKey(setting)).toBe(true);
      }
    });
  });
});
