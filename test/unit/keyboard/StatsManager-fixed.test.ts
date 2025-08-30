// 🔥 기가차드 StatsManager 단위 테스트

import { StatsManager, type RealtimeStats } from '../../../src/main/keyboard/StatsManager';
import { Logger } from '../../../src/shared/logger';
import type { TypingStats, KeyboardEvent, TypingSession, Result } from '../../../src/shared/types';

// Mock Logger
jest.mock('../../../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// 🔥 타입 안전한 테스트 헬퍼 함수들
function createValidTypingSession(overrides?: Partial<TypingSession>): TypingSession {
  return {
    id: 'test-session-' + Date.now(),
    userId: 'test-user-1',
    content: 'Hello World Test Content',
    startTime: new Date(),
    endTime: new Date(Date.now() + 60000), // 1분 후
    keyCount: 22,
    wpm: 25,
    accuracy: 95,
    windowTitle: 'Test Application',
    appName: 'Test App',
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createValidKeyboardEvent(overrides?: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    key: 'a',
    code: 'KeyA',
    keychar: 'a',
    keycode: overrides?.keycode !== undefined ? overrides.keycode : 65,
    timestamp: Date.now(),
    windowTitle: 'Test Window',
    type: 'keydown',
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

    it('should start and stop successfully', async () => {
      await statsManager.initialize();
      
      const started = await statsManager.start();
      expect(started).toBe(true);
      expect(statsManager.isRunning()).toBe(true);
      
      const stopped = await statsManager.stop();
      expect(stopped).toBe(true);
      expect(statsManager.isRunning()).toBe(false);
    });
  });

  describe('Event Processing', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should process keyboard events', async () => {
      const event = createValidKeyboardEvent();

      await expect(statsManager.processKeyEvent(event)).resolves.not.toThrow();
    });

    it('should handle multiple events in sequence', async () => {
      const events = [
        createValidKeyboardEvent({ key: 'h', code: 'KeyH', keychar: 'h' }),
        createValidKeyboardEvent({ key: 'e', code: 'KeyE', keychar: 'e', timestamp: Date.now() + 100 }),
        createValidKeyboardEvent({ key: 'l', code: 'KeyL', keychar: 'l', timestamp: Date.now() + 200 }),
      ];

      for (const event of events) {
        await expect(statsManager.processKeyEvent(event)).resolves.not.toThrow();
      }
    });
  });

  describe('Session Management', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should start a typing session', async () => {
      const session = createValidTypingSession();
      
      const result = await statsManager.startSession(session);
      
      expect(result.success).toBe(true);
    });

    it('should end a typing session and return stats', async () => {
      const session = createValidTypingSession();
      
      const startResult = await statsManager.startSession(session);
      expect(startResult.success).toBe(true);
      
      const endResult = await statsManager.endSession(session);
      expect(endResult.success).toBe(true);
      
      if (endResult.success && endResult.data) {
        expect(endResult.data.wpm).toBeGreaterThanOrEqual(0);
        expect(endResult.data.accuracy).toBeGreaterThanOrEqual(0);
        expect(endResult.data.totalKeystrokes).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Statistics Retrieval', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should get current stats', async () => {
      const result = await statsManager.getCurrentStats();
      
      expect(result.success).toBe(true);
      
      if (result.success && result.data) {
        expect(typeof result.data.wpm).toBe('number');
        expect(typeof result.data.accuracy).toBe('number');
        expect(typeof result.data.totalKeystrokes).toBe('number');
        expect(result.data.wpm).toBeGreaterThanOrEqual(0);
        expect(result.data.accuracy).toBeGreaterThanOrEqual(0);
      }
    });

    it('should get realtime stats', async () => {
      const realtimeStats: RealtimeStats = statsManager.getRealtimeStats();
      
      expect(realtimeStats).toBeDefined();
      expect(typeof realtimeStats.currentWpm).toBe('number');
      expect(typeof realtimeStats.currentAccuracy).toBe('number');
      expect(typeof realtimeStats.keystrokesPerMinute).toBe('number');
      expect(typeof realtimeStats.sessionProgress).toBe('number');
      expect(typeof realtimeStats.peakWpm).toBe('number');
      expect(typeof realtimeStats.averageWpm).toBe('number');
      
      expect(realtimeStats.currentWpm).toBeGreaterThanOrEqual(0);
      expect(realtimeStats.currentAccuracy).toBeGreaterThanOrEqual(0);
      expect(realtimeStats.keystrokesPerMinute).toBeGreaterThanOrEqual(0);
    });

    it('should get session stats by id', async () => {
      const sessionId = 'test-session-123';
      const stats = statsManager.getSessionStats(sessionId);
      
      // 새로운 매니저이므로 해당 세션이 없을 것임
      expect(stats).toBeNull();
    });

    it('should get all session stats', async () => {
      const allStats = statsManager.getAllSessionStats();
      
      expect(allStats).toBeInstanceOf(Map);
      expect(allStats.size).toBeGreaterThanOrEqual(0);
    });

    it('should get total keystrokes', async () => {
      const totalKeystrokes = statsManager.getTotalKeystrokes();
      
      expect(typeof totalKeystrokes).toBe('number');
      expect(totalKeystrokes).toBeGreaterThanOrEqual(0);
    });

    it('should get session duration', async () => {
      const duration = statsManager.getSessionDuration();
      
      expect(typeof duration).toBe('number');
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Stats Management', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should reset stats', async () => {
      // 몇 개 이벤트 처리
      const event = createValidKeyboardEvent();
      await statsManager.processKeyEvent(event);
      
      // 통계 리셋
      statsManager.resetStats();
      
      // 리셋 후 확인
      const totalKeystrokes = statsManager.getTotalKeystrokes();
      expect(totalKeystrokes).toBe(0);
    });

    it('should get stats state', async () => {
      const state = statsManager.getStatsState();
      
      expect(state).toBeDefined();
      expect(typeof state.isCollecting).toBe('boolean');
      expect(typeof state.totalSessions).toBe('number');
      expect(state.sessionStats).toBeInstanceOf(Map);
      expect(state.currentStats).toBeDefined();
      expect(state.totalSessions).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Health Check', () => {
    beforeEach(async () => {
      await statsManager.initialize();
      await statsManager.start();
    });

    it('should perform health check', async () => {
      const healthResult = await statsManager.healthCheck();
      
      expect(healthResult).toBeDefined();
      expect(typeof healthResult.healthy).toBe('boolean');
      expect(typeof healthResult.collecting).toBe('boolean');
      expect(typeof healthResult.totalSessions).toBe('number');
      expect(typeof healthResult.currentWpm).toBe('number');
      expect(healthResult.totalSessions).toBeGreaterThanOrEqual(0);
      expect(healthResult.currentWpm).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle operations before initialization', async () => {
      // 초기화하지 않은 상태에서 작업 수행
      const event = createValidKeyboardEvent();
      
      await expect(statsManager.processKeyEvent(event)).resolves.not.toThrow();
    });

    it('should handle invalid session data', async () => {
      await statsManager.initialize();
      await statsManager.start();
      
      const invalidSession = createValidTypingSession({
        wpm: -1,
        accuracy: -1,
      });
      
      const result = await statsManager.startSession(invalidSession);
      
      // 매니저가 잘못된 데이터를 어떻게 처리하는지 확인
      expect(result).toBeDefined();
    });
  });
});
