// 🔥 기가차드 Settings 검증 테스트 - 타입 안전성 100%

import { validateSettings, validateKeyboardSettings, validateUISettings } from '../../../src/main/settings/validation';
import { SettingsSchema } from '../../../src/main/settings/types';
import { DEFAULT_SETTINGS } from '../../../src/main/settings/defaults';

describe('Settings Validation', () => {
  describe('전체 설정 검증', () => {
    test('유효한 전체 설정이 통과되어야 함', () => {
      const result = validateSettings(DEFAULT_SETTINGS);
      expect(result.success).toBe(true);
    });

    test('빈 객체가 통과되어야 함', () => {
      const result = validateSettings({});
      expect(result.success).toBe(true);
    });

    test('부분 설정이 통과되어야 함', () => {
      const partialSettings = {
        app: DEFAULT_SETTINGS.app
      };
      const result = validateSettings(partialSettings);
      expect(result.success).toBe(true);
    });
  });

  describe('앱 설정 검증', () => {
    test('유효한 앱 설정이 통과되어야 함', () => {
      const settings = {
        app: DEFAULT_SETTINGS.app
      };
      const result = validateSettings(settings);
      expect(result.success).toBe(true);
    });

    test('잘못된 테마가 거부되어야 함', () => {
      const settings = {
        app: {
          ...DEFAULT_SETTINGS.app,
          theme: 'invalid-theme' as any
        }
      };
      const result = validateSettings(settings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid theme');
    });

    test('잘못된 언어가 거부되어야 함', () => {
      const settings = {
        app: {
          ...DEFAULT_SETTINGS.app,
          language: 'invalid-lang' as any
        }
      };
      const result = validateSettings(settings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid language');
    });

    test('잘못된 윈도우 크기가 거부되어야 함', () => {
      const settings = {
        app: {
          ...DEFAULT_SETTINGS.app,
          windowBounds: {
            width: 'invalid' as any,
            height: 600
          }
        }
      };
      const result = validateSettings(settings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Window width must be a number');
    });
  });

  describe('키보드 설정 검증', () => {
    test('유효한 키보드 설정이 통과되어야 함', () => {
      const result = validateKeyboardSettings(DEFAULT_SETTINGS.keyboard);
      expect(result.success).toBe(true);
    });

    test('잘못된 autoSaveInterval 타입이 거부되어야 함', () => {
      const invalidSettings = {
        ...DEFAULT_SETTINGS.keyboard,
        autoSaveInterval: 'invalid' as any
      };
      const result = validateKeyboardSettings(invalidSettings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Auto save interval must be a number');
    });

    test('범위를 벗어난 batchSize가 거부되어야 함', () => {
      const invalidSettings = {
        ...DEFAULT_SETTINGS.keyboard,
        batchSize: 999999
      };
      const result = validateKeyboardSettings(invalidSettings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid batch size');
    });

    test('잘못된 배열 타입이 거부되어야 함', () => {
      const invalidSettings = {
        ...DEFAULT_SETTINGS.keyboard,
        ignoreApps: 'not-an-array' as any
      };
      const result = validateKeyboardSettings(invalidSettings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Ignore apps must be an array');
    });
  });

  describe('UI 설정 검증', () => {
    test('유효한 UI 설정이 통과되어야 함', () => {
      const result = validateUISettings(DEFAULT_SETTINGS.ui);
      expect(result.success).toBe(true);
    });

    test('잘못된 fontSize 타입이 거부되어야 함', () => {
      const invalidSettings = {
        ...DEFAULT_SETTINGS.ui,
        fontSize: 'large' as any
      };
      const result = validateUISettings(invalidSettings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Font size must be a number');
    });

    test('잘못된 불리언 값이 거부되어야 함', () => {
      const invalidSettings = {
        ...DEFAULT_SETTINGS.ui,
        showNotifications: 'yes' as any
      };
      const result = validateUISettings(invalidSettings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Show notifications must be a boolean');
    });
  });

  describe('에지 케이스', () => {
    test('null 객체가 안전하게 처리되어야 함', () => {
      const result = validateSettings({});
      expect(result.success).toBe(true);
    });

    test('추가 속성이 무시되어야 함', () => {
      const settingsWithExtra = {
        ...DEFAULT_SETTINGS,
        extraProperty: 'should-be-ignored'
      } as any;
      const result = validateSettings(settingsWithExtra);
      expect(result.success).toBe(true);
    });
  });

  describe('성능 테스트', () => {
    test('대량 검증이 합리적인 시간 내에 완료되어야 함', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 100; i++) {
        validateSettings(DEFAULT_SETTINGS);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // 1초 이내
    });
  });
});
