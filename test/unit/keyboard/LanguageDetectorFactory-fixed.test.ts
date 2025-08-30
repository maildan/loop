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
const createMockDetector = (name: string) => {
  const mockInstance = {
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
      platform: name,
      detectionCount: 5,
      averageProcessingTime: 2.5
    }),
    healthCheck: jest.fn().mockResolvedValue({ healthy: true })
  };

  const MockConstructor = jest.fn().mockImplementation(() => mockInstance);
  
  // constructor.name을 직접 설정
  Object.defineProperty(MockConstructor, 'name', {
    value: name,
    configurable: true
  });
  
  // mockInstance의 constructor도 설정
  Object.defineProperty(mockInstance, 'constructor', {
    value: MockConstructor,
    configurable: true
  });

  return { MockConstructor, mockInstance };
};

const { MockConstructor: mockMacOSLanguageDetector } = createMockDetector('MacOSLanguageDetector');
const { MockConstructor: mockWindowsLanguageDetector } = createMockDetector('WindowsLanguageDetector');
const { MockConstructor: mockLinuxLanguageDetector } = createMockDetector('LinuxLanguageDetector');
const { MockConstructor: mockFallbackLanguageDetector } = createMockDetector('FallbackLanguageDetector');

jest.mock('../../../src/main/keyboard/detectors/macos/MacOSLanguageDetector', () => ({
  MacOSLanguageDetector: mockMacOSLanguageDetector
}));

jest.mock('../../../src/main/keyboard/detectors/windows/WindowsLanguageDetector', () => ({
  WindowsLanguageDetector: mockWindowsLanguageDetector
}));

jest.mock('../../../src/main/keyboard/detectors/linux/LinuxLanguageDetector', () => ({
  LinuxLanguageDetector: mockLinuxLanguageDetector
}));

jest.mock('../../../src/main/keyboard/detectors/FallbackLanguageDetector', () => ({
  FallbackLanguageDetector: mockFallbackLanguageDetector
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
    it('should create macOS detector on macOS platform', () => {
      mockPlatform.isMacOS.mockReturnValue(true);
      mockPlatform.isWindows.mockReturnValue(false);
      mockPlatform.isLinux.mockReturnValue(false);
      mockPlatform.getPlatformName.mockReturnValue('macOS');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('MacOSLanguageDetector');
    });

    it('should create Windows detector on Windows platform', () => {
      mockPlatform.isMacOS.mockReturnValue(false);
      mockPlatform.isWindows.mockReturnValue(true);
      mockPlatform.isLinux.mockReturnValue(false);
      mockPlatform.getPlatformName.mockReturnValue('Windows');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('WindowsLanguageDetector');
    });

    it('should create Linux detector on Linux platform', () => {
      mockPlatform.isMacOS.mockReturnValue(false);
      mockPlatform.isWindows.mockReturnValue(false);
      mockPlatform.isLinux.mockReturnValue(true);
      mockPlatform.getPlatformName.mockReturnValue('Linux');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('LinuxLanguageDetector');
    });

    it('should create Fallback detector on unknown platform', () => {
      mockPlatform.isMacOS.mockReturnValue(false);
      mockPlatform.isWindows.mockReturnValue(false);
      mockPlatform.isLinux.mockReturnValue(false);
      mockPlatform.getPlatformName.mockReturnValue('Unknown');

      const detector = LanguageDetectorFactory.create();
      
      expect(detector).toBeDefined();
      expect(detector.constructor.name).toBe('FallbackLanguageDetector');
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
        detectorType: 'MacOSLanguageDetector',
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
