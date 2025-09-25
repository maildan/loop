// 🔥 Font System Jest Test Suite - 체계적인 단위 테스트

import { FontService } from '../main/services/FontService';
import { FontBlacklistSystem } from '../renderer/utils/FontBlacklistSystem';
import { CSSVariableManager } from '../renderer/utils/CSSVariableManager';
import { FontLoader } from '../renderer/utils/FontLoader';
import { FontAccessibilityManager } from '../renderer/utils/FontAccessibilityManager';

// Mock logger to prevent console spam
jest.mock('../shared/logger', () => ({
  Logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }
}));

// Mock window.electronAPI
const mockElectronAPI = {
  settings: {
    get: jest.fn(),
    set: jest.fn(),
  },
  font: {
    getAvailableFonts: jest.fn(),
  }
};

// Mock blacklist data for testing - 전역 블랙리스트 상태
const mockBlacklist = new Set(['gaw.otf', 'gaw_Light.otf', 'NanumGothicBold.otf']);

// Mock settings responses
(mockElectronAPI.settings.get as jest.Mock).mockImplementation((key: string) => {
  if (key === 'font-blacklist') {
    return {
      success: true,
      data: Array.from(mockBlacklist)
    };
  }
  if (key === 'font-blacklist-history') {
    return {
      success: true,
      data: []
    };
  }
  return { success: true, data: null };
});

(mockElectronAPI.settings.set as jest.Mock).mockImplementation((key: string, value: any) => {
  if (key === 'font-blacklist') {
    // 실제 블랙리스트 업데이트 시뮬레이션
    if (Array.isArray(value)) {
      mockBlacklist.clear();
      value.forEach(item => mockBlacklist.add(item));
    }
  }
  return { success: true };
});

// Mock DOM environment - global window 설정
if (typeof global.window === 'undefined') {
  Object.defineProperty(global, 'window', {
    value: {
      electronAPI: mockElectronAPI,
      matchMedia: global.matchMedia,
      navigator: {
        userAgent: 'Jest Test Environment',
      },
      speechSynthesis: {
        speak: jest.fn(),
        cancel: jest.fn(),
        getVoices: jest.fn(() => []),
      },
    },
    writable: true,
    configurable: true,
  });
} else {
  (global.window as any).electronAPI = mockElectronAPI;
  if (!(global.window as any).matchMedia) {
    (global.window as any).matchMedia = global.matchMedia;
  }
  if (!(global.window as any).navigator) {
    (global.window as any).navigator = {
      userAgent: 'Jest Test Environment',
    };
  }
  if (!(global.window as any).speechSynthesis) {
    (global.window as any).speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
      getVoices: jest.fn(() => []),
    };
  }
}

// 전역 DOM 모킹 강화
Object.defineProperty(global, 'FontFace', {
  value: jest.fn().mockImplementation((family, source, options) => ({
    family,
    source,
    options,
    loaded: Promise.resolve(),
    load: jest.fn().mockResolvedValue(true),
    status: 'loaded'
  })),
  writable: true,
  configurable: true,
});

Object.defineProperty(global, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
  writable: true,
  configurable: true,
});

// Mock DOM environment - 기존 document가 있을 수 있으므로 조건부 설정
if (typeof global.document === 'undefined') {
  Object.defineProperty(global, 'document', {
    value: {
      documentElement: {
        style: {
          setProperty: jest.fn(),
          removeProperty: jest.fn(),
          getPropertyValue: jest.fn(() => ''),
        }
      },
      getElementById: jest.fn(),
      createElement: jest.fn(() => ({
        id: '',
        textContent: '',
        style: {
          setProperty: jest.fn(),
          getPropertyValue: jest.fn(() => ''),
          removeProperty: jest.fn(),
        },
        setAttribute: jest.fn(),
        getAttribute: jest.fn(() => null),
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn(() => false),
        },
        onload: null,
        onerror: null,
      })),
      head: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(() => []),
      fonts: {
        forEach: jest.fn(),
        size: 0,
        add: jest.fn(),
        delete: jest.fn(),
        clear: jest.fn(),
        has: jest.fn(() => false),
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    writable: true,
    configurable: true,
  });
} else {
  // document가 이미 있으면 필요한 메서드들만 확장/대체
  const existingDocument = global.document as any;
  existingDocument.getElementById = jest.fn();
  existingDocument.createElement = jest.fn(() => ({
    id: '',
    textContent: '',
    style: {
      setProperty: jest.fn(),
      getPropertyValue: jest.fn(() => ''),
      removeProperty: jest.fn(),
    },
    setAttribute: jest.fn(),
    getAttribute: jest.fn(() => null),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(() => false),
    },
    onload: null,
    onerror: null,
  }));
  existingDocument.querySelectorAll = jest.fn(() => []);
  
  // window.matchMedia가 없으면 추가
  if (!global.window.matchMedia) {
    (global.window as any).matchMedia = global.matchMedia;
  }
}

Object.defineProperty(global, 'getComputedStyle', {
  value: jest.fn(() => ({
    getPropertyValue: jest.fn(() => 'Pretendard'),
    fontFamily: 'Pretendard',
    fontSize: '16px',
    fontWeight: '400',
  })),
  writable: true
});

Object.defineProperty(global, 'performance', {
  value: {
    getEntriesByType: jest.fn(() => []),
  },
  writable: true
});

describe('🔥 Font System Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('FontService', () => {
    let fontService: FontService;

    beforeEach(() => {
      fontService = FontService.getInstance();
    });

    test('should create singleton instance', () => {
      const instance1 = FontService.getInstance();
      const instance2 = FontService.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('should return service status', async () => {
      const fontService = FontService.getInstance();
      const status = fontService.getServiceStatus();
      
      expect(status).toHaveProperty('fontsPath');
      expect(status).toHaveProperty('isInitialized');
      expect(status).toHaveProperty('fontsPathExists');
      expect(status).toHaveProperty('allowedExtensions');
      expect(typeof status.fontsPath).toBe('string');
      expect(typeof status.isInitialized).toBe('boolean');
      expect(typeof status.fontsPathExists).toBe('boolean');
      expect(Array.isArray(status.allowedExtensions)).toBe(true);
    });

    test('should get available fonts safely', async () => {
      const fonts = await fontService.getAvailableFonts();
      expect(Array.isArray(fonts)).toBe(true);
      fonts.forEach(font => {
        expect(font).toHaveProperty('name');
        expect(font).toHaveProperty('path');
        expect(font).toHaveProperty('category');
        expect(font).toHaveProperty('isValid');
      });
    });

    test('should get fonts by category', async () => {
      const categories = await fontService.getFontsByCategory();
      expect(Array.isArray(categories)).toBe(true);
      categories.forEach(category => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('fonts');
        expect(category).toHaveProperty('count');
        expect(Array.isArray(category.fonts)).toBe(true);
      });
    });

    test('should handle font info request safely', async () => {
      // Test with non-existent font
      const nonExistentFont = await fontService.getFontInfo('NonExistentFont.otf');
      expect(nonExistentFont).toBeNull();

      // Test with empty string
      const emptyFont = await fontService.getFontInfo('');
      expect(emptyFont).toBeNull();
    });
  });

  describe('FontBlacklistSystem', () => {
    beforeEach(() => {
      // Mock electron settings for blacklist
      mockElectronAPI.settings.get.mockResolvedValue({
        success: true,
        data: []
      });
      mockElectronAPI.settings.set.mockResolvedValue({
        success: true
      });
    });

    test('should initialize known problematic fonts', async () => {
      await FontBlacklistSystem.initializeKnownProblematicFonts();
      const blacklisted = await FontBlacklistSystem.getBlacklistedFonts();
      
      expect(blacklisted).toContain('gaw.otf');
      expect(blacklisted).toContain('gaw_Light.otf');
      expect(blacklisted).toContain('NanumGothicBold.otf');
    });

    test('should detect partial font name matches', async () => {
      await FontBlacklistSystem.addToBlacklist('gaw.otf', 'cff_error');
      
      const isBlacklisted1 = await FontBlacklistSystem.isBlacklisted('gaw_Light.otf');
      const isBlacklisted2 = await FontBlacklistSystem.isBlacklisted('gaw_Bold.otf');
      
      expect(isBlacklisted1).toBe(true);
      expect(isBlacklisted2).toBe(true);
    });

    test('should extract font names from error messages', () => {
      const errorMessage1 = 'Failed to decode downloaded font: http://localhost:35821/fonts/Gangwon_mac/gaw.otf';
      const extracted1 = FontBlacklistSystem.extractFontFromError(errorMessage1);
      expect(extracted1).toBe('gaw.otf');

      const errorMessage2 = 'OTS parsing error: CFF: Failed to parse Name INDEX data';
      const extracted2 = FontBlacklistSystem.extractFontFromError(errorMessage2);
      // Should return null for generic errors without font names
      expect(extracted2).toBeNull();
    });

    test('should manage blacklist operations safely', async () => {
      const testFont = 'TestFont.otf';
      
      // Add to blacklist
      await FontBlacklistSystem.addToBlacklist(testFont, 'decode_error');
      expect(await FontBlacklistSystem.isBlacklisted(testFont)).toBe(true);
      
      // Remove from blacklist
      await FontBlacklistSystem.removeFromBlacklist(testFont);
      expect(await FontBlacklistSystem.isBlacklisted(testFont)).toBe(false);
      
      // Clear all
      await FontBlacklistSystem.clearBlacklist();
      const allBlacklisted = await FontBlacklistSystem.getBlacklistedFonts();
      expect(allBlacklisted).toHaveLength(0);
    });
  });

  describe('CSSVariableManager', () => {
    test('should apply font variables to DOM', () => {
      const mockSetProperty = jest.fn();
      document.documentElement.style.setProperty = mockSetProperty;

      CSSVariableManager.applyFontVariables({
        family: 'Pretendard',
        size: 16,
        weight: 400,
        lineHeight: 1.5,
        letterSpacing: 0
      });

      expect(mockSetProperty).toHaveBeenCalledWith('--app-font-family', expect.any(String));
      expect(mockSetProperty).toHaveBeenCalledWith('--app-font-size', '16px');
      expect(mockSetProperty).toHaveBeenCalledWith('--app-font-weight', '400');
      expect(mockSetProperty).toHaveBeenCalledWith('--app-line-height', '1.5');
      expect(mockSetProperty).toHaveBeenCalledWith('--app-letter-spacing', '0px');
    });

    test('should sanitize font family names', () => {
      const mockSetProperty = jest.fn();
      document.documentElement.style.setProperty = mockSetProperty;

      // Test with potentially dangerous font name
      CSSVariableManager.applyFontVariables({
        family: '<script>alert("xss")</script>Pretendard'
      });

      expect(mockSetProperty).toHaveBeenCalledWith(
        '--app-font-family', 
        expect.not.stringContaining('<script>')
      );
    });

    test('should force font on TipTap elements', () => {
      const mockElements = [
        { style: { setProperty: jest.fn() }, classList: { add: jest.fn() } }
      ];
      (document.querySelectorAll as jest.Mock) = jest.fn(() => mockElements as any);
      (document.createElement as jest.Mock) = jest.fn(() => ({
        id: '',
        textContent: '',
      }) as any);
      (document.getElementById as jest.Mock) = jest.fn(() => null);

      CSSVariableManager.forceFontOnTipTap('Pretendard');

      expect(mockElements[0].style.setProperty).toHaveBeenCalledWith(
        'font-family', 
        expect.stringContaining('Pretendard'), 
        'important'
      );
      expect(mockElements[0].classList.add).toHaveBeenCalledWith('custom-font-applied');
    });

    test('should get current variable values', () => {
      const mockGetPropertyValue = jest.fn()
        .mockReturnValueOnce('Pretendard')
        .mockReturnValueOnce('16px')
        .mockReturnValueOnce('400')
        .mockReturnValueOnce('1.5')
        .mockReturnValueOnce('0px');

      (getComputedStyle as jest.Mock).mockReturnValue({
        getPropertyValue: mockGetPropertyValue
      });

      const currentValues = CSSVariableManager.getCurrentVariableValues();

      expect(currentValues).toHaveProperty('--app-font-family', 'Pretendard');
      expect(currentValues).toHaveProperty('--app-font-size', '16px');
      expect(mockGetPropertyValue).toHaveBeenCalledTimes(5);
    });

    test('should reset all font variables', () => {
      const mockRemoveProperty = jest.fn();
      document.documentElement.style.removeProperty = mockRemoveProperty;

      CSSVariableManager.resetAllFontVariables();

      expect(mockRemoveProperty).toHaveBeenCalledWith('--app-font-family');
      expect(mockRemoveProperty).toHaveBeenCalledWith('--app-font-size');
      expect(mockRemoveProperty).toHaveBeenCalledWith('--app-font-weight');
      expect(mockRemoveProperty).toHaveBeenCalledWith('--app-line-height');
      expect(mockRemoveProperty).toHaveBeenCalledWith('--app-letter-spacing');
    });
  });

  describe('FontLoader', () => {
    test('should load font with blacklist check', async () => {
      // Mock successful font loading
      const result = await FontLoader.loadFontWithBlacklistCheck({
        name: 'TestFont',
        family: 'TestFont',
        style: 'normal',
        weight: 'normal',
        url: '/fonts/TestFont.otf'
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('fontName');
      expect(typeof result.success).toBe('boolean');
    });

    test('should reject blacklisted fonts', async () => {
      // Add font to blacklist first
      await FontBlacklistSystem.addToBlacklist('BlacklistedFont.otf', 'decode_error');

      const result = await FontLoader.loadFontWithBlacklistCheck({
        name: 'BlacklistedFont.otf',
        family: 'BlacklistedFont',
        style: 'normal',
        weight: 'normal',
        url: '/fonts/BlacklistedFont.otf'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('blacklisted');
    });
  });

  describe('FontAccessibilityManager', () => {
    beforeEach(() => {
      // Mock accessibility settings
      mockElectronAPI.settings.get.mockResolvedValue({
        success: true,
        data: {
          announceChanges: true,
          highContrast: false,
          reduceMotion: false
        }
      });
    });

    test('should get accessibility settings', async () => {
      const settings = await FontAccessibilityManager.getAccessibilitySettings();
      
      expect(settings).toHaveProperty('announceChanges');
      expect(settings).toHaveProperty('highContrast');
      expect(settings).toHaveProperty('reduceMotion');
    });

    test('should announce font changes safely', async () => {
      const mockLiveRegion = {
        textContent: '',
        setAttribute: jest.fn(),
        style: {}
      };
      document.getElementById = jest.fn(() => mockLiveRegion as any);

      await FontAccessibilityManager.announceFontChange('Pretendard', 16);
      
      // Should not throw errors even with undefined font
      await FontAccessibilityManager.announceFontChange(undefined, 16);
      
      expect(document.getElementById).toHaveBeenCalled();
    });

    test('should generate accessibility report', async () => {
      const report = await FontAccessibilityManager.generateAccessibilityReport();
      
      expect(report).toHaveProperty('settings');
      expect(report).toHaveProperty('rollbackStatesCount');
      expect(report).toHaveProperty('hasCustomizations');
      expect(report).toHaveProperty('systemSupport');
    });

    test('should check accessibility compliance', async () => {
      const compliance = await FontAccessibilityManager.checkAccessibilityCompliance('Pretendard', 16);
      
      expect(compliance).toHaveProperty('warnings');
      expect(compliance).toHaveProperty('suggestions');
      expect(Array.isArray(compliance.warnings)).toBe(true);
      expect(Array.isArray(compliance.suggestions)).toBe(true);
    });

    test('should manage rollback states', async () => {
      await FontAccessibilityManager.saveRollbackState('Pretendard', 16, 'user_change');
      const states = await FontAccessibilityManager.getRollbackStates();
      
      expect(Array.isArray(states)).toBe(true);
      
      if (states.length > 0) {
        const rollbackState = await FontAccessibilityManager.rollbackToState(0);
        expect(rollbackState).toHaveProperty('fontFamily');
        expect(rollbackState).toHaveProperty('fontSize');
      }
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete font change workflow', async () => {
      // 1. Initialize blacklist system
      await FontBlacklistSystem.initializeKnownProblematicFonts();
      
      // 2. Check if font is blacklisted
      const isBlacklisted = await FontBlacklistSystem.isBlacklisted('Pretendard');
      expect(isBlacklisted).toBe(false);
      
      // 3. Apply font variables
      CSSVariableManager.applyFontVariables({
        family: 'Pretendard',
        size: 16
      });
      
      // 4. Force apply to TipTap
      CSSVariableManager.forceFontOnTipTap('Pretendard');
      
      // 5. Announce change for accessibility
      await FontAccessibilityManager.announceFontChange('Pretendard', 16);
      
      // Should complete without errors
      expect(true).toBe(true);
    });

    test('should handle error conditions gracefully', async () => {
      // Test with invalid inputs
      CSSVariableManager.applyFontVariables({});
      CSSVariableManager.forceFontOnTipTap('');
      await FontAccessibilityManager.announceFontChange('', undefined);
      
      // Should not throw errors
      expect(true).toBe(true);
    });

    test('should maintain consistent state across operations', async () => {
      const fontName = 'TestConsistencyFont';
      
      // Add to blacklist
      await FontBlacklistSystem.addToBlacklist(fontName, 'decode_error');
      expect(await FontBlacklistSystem.isBlacklisted(fontName)).toBe(true);
      
      // Try to load (should fail)
      const loadResult = await FontLoader.loadFontWithBlacklistCheck({
        name: fontName,
        family: fontName,
        style: 'normal',
        weight: 'normal',
        url: `/fonts/${fontName}`
      });
      expect(loadResult.success).toBe(false);
      
      // Remove from blacklist
      await FontBlacklistSystem.removeFromBlacklist(fontName);
      expect(await FontBlacklistSystem.isBlacklisted(fontName)).toBe(false);
    });
  });
});