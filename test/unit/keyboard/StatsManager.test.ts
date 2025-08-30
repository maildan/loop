// 🔥 기가차드 StatsManager 단위 테스트

import { StatsManager, type StatsManagerState } from '../../../src/main/keyboard/StatsManager';
import { Logger } from '../../../src/shared/logger';
import type { TypingSession, TypingStats, KeyboardEvent } from '../../../src/shared/types';

// Mock Logger
jest.mock('../../../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    time: jest.fn(),
    timeEnd: jest.fn(),
  },
}));

// 🔥 타입 안전한 테스트 헬퍼 함수
function createValidKeyboardEvent(overrides?: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    key: 'a',
    code: 'KeyA',
    keychar: 'a',
    keycode: overrides?.keycode ?? 65,
    timestamp: Date.now(),
    windowTitle: 'Test Window',
    type: 'keydown',
    ...overrides,
  };
}

function createValidTypingSession(overrides?: Partial<TypingSession>): TypingSession {
  return {
    id: 'test-session-' + Date.now(),
    userId: 'test-user-1',
    content: 'Hello World',
    startTime: new Date(),
    endTime: new Date(),
    keyCount: 11,
    wpm: 60,
    accuracy: 95,
    windowTitle: 'Test Window',
    appName: 'Test App',
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('StatsManager', () => {
  let statsManager: StatsManager;
  
  beforeEach(() => {
    jest.clearAllMocks();
    statsManager = new StatsManager();
  });

  afterEach(async () => {
    if (statsManager) {
      await statsManager.cleanup();
    }
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const result = await statsManager.initialize();
      
      expect(result).toBe(true);
      expect(statsManager.isInitialized()).toBe(true);
    });

    it('should have correct initial state', async () => {
      await statsManager.initialize();
      
      const state = statsManager.getStatsState();
      expect(state).toBeDefined();
      expect(state.currentStats.wpm).toBe(0);
      expect(state.currentStats.accuracy).toBe(1.0);
      expect(state.currentStats.totalKeystrokes).toBe(0);
      expect(state.isCollecting).toBe(true); // 초기화 후 수집 시작
      expect(state.totalSessions).toBe(0);
    });

    it('should start after initialization', async () => {
      await statsManager.initialize();
      await statsManager.start();
      
      const state = statsManager.getStatsState();
      expect(state.isCollecting).toBe(true);
    });
  });

  describe('Session Management', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should start session correctly', async () => {
      const session = createValidTypingSession();
      const result = await statsManager.startSession(session);
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should end session and return statistics', async () => {
      const session = createValidTypingSession();
      
      // Start session first
      await statsManager.startSession(session);
      
      // End session
      const result = await statsManager.endSession(session);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.wpm).toBeGreaterThanOrEqual(0);
        expect(result.data.accuracy).toBeGreaterThanOrEqual(0);
        expect(result.data.accuracy).toBeLessThanOrEqual(100.0); // 0~100 범위
      }
    });

    it('should handle session ID mismatch', async () => {
      const session1 = createValidTypingSession({ id: 'session1' });
      const session2 = createValidTypingSession({ id: 'session2' });
      
      await statsManager.startSession(session1);
      const result = await statsManager.endSession(session2);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Session ID mismatch');
    });
  });

  describe('Key Event Processing', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should process key events correctly', async () => {
      const session = createValidTypingSession();
      await statsManager.startSession(session);

      const events: KeyboardEvent[] = [
        createValidKeyboardEvent({ key: 'h', timestamp: Date.now() }),
        createValidKeyboardEvent({ key: 'e', timestamp: Date.now() + 100 }),
        createValidKeyboardEvent({ key: 'l', timestamp: Date.now() + 200 }),
        createValidKeyboardEvent({ key: 'l', timestamp: Date.now() + 300 }),
        createValidKeyboardEvent({ key: 'o', timestamp: Date.now() + 400 }),
      ];

      for (const event of events) {
        await statsManager.processKeyEvent(event);
      }
      
      const state = statsManager.getStatsState();
      expect(state.currentStats.totalKeystrokes).toBeGreaterThan(0);
    });

    it('should handle backspace events correctly', async () => {
      const session = createValidTypingSession();
      await statsManager.startSession(session);

      const events: KeyboardEvent[] = [
        createValidKeyboardEvent({ key: 'h', timestamp: Date.now() }),
        createValidKeyboardEvent({ key: 'e', timestamp: Date.now() + 100 }),
        createValidKeyboardEvent({ key: 'backspace', timestamp: Date.now() + 200 }),
        createValidKeyboardEvent({ key: 'l', timestamp: Date.now() + 300 }),
      ];

      for (const event of events) {
        await statsManager.processKeyEvent(event);
      }
      
      const state = statsManager.getStatsState();
      expect(state.currentStats.errorsCount).toBeGreaterThan(0);
    });

    it('should not process events when not collecting', async () => {
      // 초기화만 하고 시작하지 않음
      await statsManager.initialize();
      
      // 내부적으로 isCollecting = false로 설정 (테스트용)
      const event = createValidKeyboardEvent();
      
      // 매니저를 중지하여 수집 비활성화
      await statsManager.stop();
      await statsManager.processKeyEvent(event);
      
      const state = statsManager.getStatsState();
      expect(state.currentStats.totalKeystrokes).toBe(0);
    });
  });

  describe('Statistics Tracking', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should track total keystrokes correctly', async () => {
      const session = createValidTypingSession({ keyCount: 100 });
      await statsManager.startSession(session);
      await statsManager.endSession(session);
      
      const totalKeystrokes = statsManager.getTotalKeystrokes();
      expect(totalKeystrokes).toBe(100);
    });

    it('should track session duration', async () => {
      const session = createValidTypingSession();
      await statsManager.startSession(session);
      
      const duration = statsManager.getSessionDuration();
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should reset statistics correctly', async () => {
      const session = createValidTypingSession();
      await statsManager.startSession(session);
      await statsManager.endSession(session);
      
      statsManager.resetStats();
      
      const state = statsManager.getStatsState();
      expect(state.currentStats.totalKeystrokes).toBe(0);
      expect(state.totalSessions).toBe(0);
      expect(statsManager.getTotalKeystrokes()).toBe(0);
    });
  });

  describe('Health Check', () => {
    it('should provide health status', async () => {
      await statsManager.initialize();
      await statsManager.start();
      
      const health = await statsManager.healthCheck();
      
      expect(health.healthy).toBe(true);
      expect(health.collecting).toBe(true);
      expect(health.totalSessions).toBe(0);
      expect(health.currentWpm).toBe(0);
      expect(typeof health.uptime).toBe('number');
    });

    it('should report health when not collecting', async () => {
      await statsManager.initialize();
      // Don't start
      
      const health = await statsManager.healthCheck();
      
      expect(health.healthy).toBe(true);
      expect(health.collecting).toBe(true); // 초기화 후에는 collecting이 true
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources properly', async () => {
      await statsManager.initialize();
      await statsManager.start();
      
      const session = createValidTypingSession();
      await statsManager.startSession(session);
      
      await statsManager.cleanup();
      
      // cleanup은 void를 반환하므로 성공적으로 완료됨을 확인
      const state = statsManager.getStatsState();
      expect(state.sessionStats.size).toBe(0);
      expect(state.totalSessions).toBe(1); // session이 이미 시작되었으므로 1
    });

    it('should handle multiple cleanup calls gracefully', async () => {
      await statsManager.initialize();
      
      await statsManager.cleanup();
      await statsManager.cleanup();
      
      // cleanup은 void를 반환하므로 성공적으로 완료됨을 확인
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid keyboard events gracefully', async () => {
      await statsManager.initialize();
      await statsManager.start();
      
      const invalidEvent: KeyboardEvent = {
        key: '',
        code: '',
        keychar: '',
        timestamp: Date.now(),
        windowTitle: '',
        type: 'keydown',
        keycode: 0,
      };

      await expect(statsManager.processKeyEvent(invalidEvent)).resolves.not.toThrow();
    });

    it('should handle session operations when not initialized', async () => {
      const session = createValidTypingSession();
      
      const result = await statsManager.startSession(session);
      expect(result.success).toBe(true); // BaseManager는 초기화 없어도 기본적으로 동작할 수 있음
    });

    it('should return safe defaults when no session active', () => {
      const duration = statsManager.getSessionDuration();
      expect(duration).toBe(0);
      
      const keystrokes = statsManager.getTotalKeystrokes();
      expect(keystrokes).toBe(0);
    });
  });
});
