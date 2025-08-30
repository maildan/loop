// 🔥 기가차드 LanguageDetectorFactory 단위 테스트 - 완전 수정 버전

// Mock Logger
jest.mock('../../../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Platform
jest.mock('../../../src/main/utils/platform', () => ({
  Platform: {
    isMacOS: jest.fn(() => true),
    isWindows: jest.fn(() => false),
    isLinux: jest.fn(() => false),
    getPlatformName: jest.fn(() => 'macOS'),
  },
}));

// 🔥 실제 감지기 클래스들을 Mock으로 교체
const mockMacOSDetector = {
  constructor: { name: 'MacOSLanguageDetector' },
  initialize: jest.fn().mockResolvedValue(undefined),
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  cleanup: jest.fn().mockResolvedValue(undefined),
  detectLanguage: jest.fn().mockResolvedValue({
    language: 'ko',
    confidence: 0.95,
    method: 'native',
    isComposing: true
  }),
  getCurrentLanguage: jest.fn().mockReturnValue('ko'),
  setLanguage: jest.fn(),
  getPerformanceStats: jest.fn().mockReturnValue({
    platform: 'macOS',
    detectionCount: 5,
    averageProcessingTime: 2.5
  }),
  healthCheck: jest.fn().mockResolvedValue({ healthy: true })
};

jest.mock('../../../src/main/keyboard/detectors/macos/MacOSLanguageDetector', () => ({
  MacOSLanguageDetector: jest.fn().mockImplementation(() => mockMacOSDetector)
}));

jest.mock('../../../src/main/keyboard/detectors/windows/WindowsLanguageDetector', () => ({
  WindowsLanguageDetector: jest.fn().mockImplementation(() => ({
    ...mockMacOSDetector,
    constructor: { name: 'WindowsLanguageDetector' }
  }))
}));

jest.mock('../../../src/main/keyboard/detectors/linux/LinuxLanguageDetector', () => ({
  LinuxLanguageDetector: jest.fn().mockImplementation(() => ({
    ...mockMacOSDetector,
    constructor: { name: 'LinuxLanguageDetector' }
  }))
}));

jest.mock('../../../src/main/keyboard/detectors/FallbackLanguageDetector', () => ({
  FallbackLanguageDetector: jest.fn().mockImplementation(() => ({
    ...mockMacOSDetector,
    constructor: { name: 'FallbackLanguageDetector' }
  }))
}));

// Import after mocks
import { LanguageDetectorFactory } from '../../../src/main/keyboard/detectors/factory/LanguageDetectorFactory';
import { Platform } from '../../../src/main/utils/platform';
import { Logger } from '../../../src/shared/logger';

describe('LanguageDetectorFactory', () => {
  const mockPlatform = Platform as jest.Mocked<typeof Platform>;
  const mockLogger = Logger as jest.Mocked<typeof Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
    LanguageDetectorFactory.reset();
  });

  describe('🔥 Cross-Platform Detection and Factory Creation', () => {
    it('should create detector instance successfully', () => {
      const detector = LanguageDetectorFactory.create();
      expect(detector).toBeDefined();
    });

    it('should handle different platform configurations', () => {
      // Test macOS
      mockPlatform.isMacOS.mockReturnValue(true);
      const macDetector = LanguageDetectorFactory.create();
      expect(macDetector).toBeDefined();
      
      LanguageDetectorFactory.reset();
      
      // Test Windows
      mockPlatform.isMacOS.mockReturnValue(false);
      mockPlatform.isWindows.mockReturnValue(true);
      const winDetector = LanguageDetectorFactory.create();
      expect(winDetector).toBeDefined();
      
      LanguageDetectorFactory.reset();
      
      // Test Linux
      mockPlatform.isWindows.mockReturnValue(false);
      mockPlatform.isLinux.mockReturnValue(true);
      const linuxDetector = LanguageDetectorFactory.create();
      expect(linuxDetector).toBeDefined();
    });
  });

  describe('Basic Factory Operations', () => {
    beforeEach(() => {
      mockPlatform.isMacOS.mockReturnValue(true);
      mockPlatform.getPlatformName.mockReturnValue('macOS');
    });

    it('should return same instance on multiple create calls', () => {
      const detector1 = LanguageDetectorFactory.create();
      const detector2 = LanguageDetectorFactory.create();

      expect(detector1).toBe(detector2);
    });

    it('should return factory info', () => {
      LanguageDetectorFactory.create();
      const info = LanguageDetectorFactory.getInfo();

      expect(info).toEqual({
        platform: 'macOS',
        detectorType: expect.any(String),
        isInitialized: true,
        createdAt: expect.any(Date)
      });
    });

    it('should handle reset correctly', () => {
      const detector1 = LanguageDetectorFactory.create();
      LanguageDetectorFactory.reset();
      const detector2 = LanguageDetectorFactory.create();

      expect(detector1).not.toBe(detector2);
    });
  });

  describe('Error Handling', () => {
    it('should handle platform detection failures gracefully', () => {
      mockPlatform.isMacOS.mockImplementation(() => { throw new Error('Platform detection failed'); });

      expect(() => LanguageDetectorFactory.create()).not.toThrow();
      
      const detector = LanguageDetectorFactory.create();
      expect(detector).toBeDefined();
    });
  });
});
