// 🔥 기가차드 Settings 검증 시스템 단위 테스트

import { validateSettings, validateKeyboardSettings, validateUISettings } from '../../../src/main/settings/validation';
import { DEFAULT_SETTINGS } from '../../../src/main/settings/defaults';
import type { SettingsSchema } from '../../../src/main/settings/types';

describe('🔥 Settings 검증 시스템 단위 테스트', () => {
  describe('전체 설정 검증', () => {
    test('유효한 설정이 검증을 통과해야 함', () => {
      const validSettings: SettingsSchema = { ...DEFAULT_SETTINGS };
      const result = validateSettings(validSettings);
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('부분 설정도 검증을 통과해야 함', () => {
      const partialSettings = { 
        app: DEFAULT_SETTINGS.app 
      };
      
      const result = validateSettings(partialSettings);
      expect(result.success).toBe(true);
    });

    test('잘못된 타입의 설정이 검증에 실패해야 함', () => {
      const invalidSettings = {
        app: {
          ...DEFAULT_SETTINGS.app,
          theme: 'invalid-theme'
        }
      } as unknown as Partial<SettingsSchema>;
      
      const result = validateSettings(invalidSettings);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('키보드 설정 검증', () => {
    test('유효한 키보드 설정이 검증을 통과해야 함', () => {
      const validKeyboardSettings = { ...DEFAULT_SETTINGS.keyboard };
      const result = validateKeyboardSettings(validKeyboardSettings);
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('범위를 벗어난 자동 저장 간격이 검증에 실패해야 함', () => {
      const invalidKeyboardSettings = {
        ...DEFAULT_SETTINGS.keyboard,
        autoSaveInterval: 99999 // 허용 범위 초과
      };
      
      const result = validateKeyboardSettings(invalidKeyboardSettings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('auto save interval');
    });

    test('잘못된 타입의 키보드 설정이 검증에 실패해야 함', () => {
      const result = validateKeyboardSettings('invalid');
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be an object');
    });
  });

  describe('UI 설정 검증', () => {
    test('유효한 UI 설정이 검증을 통과해야 함', () => {
      const validUISettings = { ...DEFAULT_SETTINGS.ui };
      const result = validateUISettings(validUISettings);
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('범위를 벗어난 글꼴 크기가 검증에 실패해야 함', () => {
      const invalidUISettings = {
        ...DEFAULT_SETTINGS.ui,
        fontSize: 999 // 허용 범위 초과
      };
      
      const result = validateUISettings(invalidUISettings);
      expect(result.success).toBe(false);
      expect(result.error).toContain('font size');
    });

    test('잘못된 타입의 UI 설정이 검증에 실패해야 함', () => {
      const result = validateUISettings(null);
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be an object');
    });
  });

  describe('에지 케이스', () => {
    test('빈 객체가 올바르게 처리되어야 함', () => {
      const emptySettings = {};
      
      const result = validateSettings(emptySettings);
      
      // 부분 설정은 허용되므로 성공해야 함
      expect(result.success).toBe(true);
    });

    test('null과 undefined가 안전하게 처리되어야 함', () => {
      const nullResult = validateKeyboardSettings(null);
      const undefinedResult = validateKeyboardSettings(undefined);
      
      expect(nullResult.success).toBe(false);
      expect(undefinedResult.success).toBe(false);
    });
  });
});
