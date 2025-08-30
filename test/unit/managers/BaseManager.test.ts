// 🔥 기가차드 BaseManager 단위 테스트

import { BaseManager, ManagerConfig, ManagerState } from '../../../src/main/common/BaseManager';
import { Logger } from '../../../src/shared/logger';

// Mock Logger
jest.mock('../../../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Test implementation of BaseManager
class TestManager extends BaseManager {
  protected async doInitialize(): Promise<void> {
    // Simulate initialization
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  protected async doStart(): Promise<void> {
    // Simulate start
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  protected async doStop(): Promise<void> {
    // Simulate stop
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  protected async doCleanup(): Promise<void> {
    // Simulate cleanup
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

describe('BaseManager', () => {
  let manager: TestManager;
  
  beforeEach(() => {
    jest.clearAllMocks();
    manager = new TestManager({
      name: 'TestManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 100,
    });
  });

  afterEach(async () => {
    if (manager) {
      await manager.cleanup();
    }
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const result = await manager.initialize();
      
      expect(result).toBe(true);
      expect(manager.isInitialized()).toBe(true);
      expect(manager.isRunning()).toBe(false);
    });

    it('should not re-initialize if already initialized', async () => {
      await manager.initialize();
      const result = await manager.initialize();
      
      expect(result).toBe(true);
      expect(Logger.warn).toHaveBeenCalledWith(
        'BASE_MANAGER',
        'TestManager already initialized'
      );
    });

    it('should auto-start if autoStart is enabled', async () => {
      const autoStartManager = new TestManager({
        name: 'AutoStartManager',
        autoStart: true,
      });
      
      const result = await autoStartManager.initialize();
      
      expect(result).toBe(true);
      expect(autoStartManager.isInitialized()).toBe(true);
      expect(autoStartManager.isRunning()).toBe(true);
      
      await autoStartManager.cleanup();
    });
  });

  describe('Lifecycle', () => {
    beforeEach(async () => {
      await manager.initialize();
    });

    it('should start successfully', async () => {
      const result = await manager.start();
      
      expect(result).toBe(true);
      expect(manager.isRunning()).toBe(true);
    });

    it('should stop successfully', async () => {
      await manager.start();
      const result = await manager.stop();
      
      expect(result).toBe(true);
      expect(manager.isRunning()).toBe(false);
    });

    it('should restart successfully', async () => {
      await manager.start();
      const result = await manager.restart();
      
      expect(result).toBe(true);
      expect(manager.isRunning()).toBe(true);
    });

    it('should cleanup successfully', async () => {
      await manager.start();
      await manager.cleanup();
      
      expect(manager.isInitialized()).toBe(false);
      expect(manager.isRunning()).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should return correct state', () => {
      const state = manager.getState();
      
      expect(state).toEqual({
        isInitialized: false,
        isRunning: false,
      });
    });

    it('should return config', () => {
      const config = manager.getConfig();
      
      expect(config.name).toBe('TestManager');
      expect(config.autoStart).toBe(false);
      expect(config.retryOnError).toBe(true);
      expect(config.maxRetries).toBe(3);
      expect(config.retryDelay).toBe(100);
    });

    it('should perform health check', async () => {
      const health = await manager.healthCheck();
      
      expect(health.healthy).toBe(false); // Not initialized yet
      expect(health.uptime).toBeUndefined();
      expect(health.lastError).toBeUndefined();
    });

    it('should return metrics', () => {
      const metrics = manager.getMetrics();
      
      expect(metrics.name).toBe('TestManager');
      expect(metrics.isInitialized).toBe(false);
      expect(metrics.isRunning).toBe(false);
      expect(metrics.hasError).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors', async () => {
      // Create a manager that fails during initialization
      class FailingManager extends BaseManager {
        protected async doInitialize(): Promise<void> {
          throw new Error('Initialization failed');
        }
        protected async doStart(): Promise<void> {}
        protected async doStop(): Promise<void> {}
        protected async doCleanup(): Promise<void> {}
      }

      const failingManager = new FailingManager({
        name: 'FailingManager',
        retryOnError: false,
      });

      // Listen for error events to prevent unhandled errors
      failingManager.on('error', () => {
        // Error is expected, do nothing
      });

      const result = await failingManager.initialize();
      
      expect(result).toBe(false);
      expect(failingManager.getLastError()?.message).toBe('Initialization failed');
      
      await failingManager.cleanup();
    });

    it('should retry on failure', async () => {
      let attemptCount = 0;
      
      class RetryManager extends BaseManager {
        protected async doInitialize(): Promise<void> {
          attemptCount++;
          if (attemptCount < 3) {
            throw new Error('Temporary failure');
          }
        }
        protected async doStart(): Promise<void> {}
        protected async doStop(): Promise<void> {}
        protected async doCleanup(): Promise<void> {}
      }

      const retryManager = new RetryManager({
        name: 'RetryManager',
        retryOnError: true,
        maxRetries: 3,
        retryDelay: 10,
      });

      // Listen for error events to prevent unhandled errors during retries
      retryManager.on('error', () => {
        // Errors during retries are expected, do nothing
      });

      const result = await retryManager.initialize();
      
      expect(result).toBe(true);
      expect(attemptCount).toBe(3);
      
      await retryManager.cleanup();
    });
  });

  describe('Events', () => {
    it('should emit events during lifecycle', async () => {
      const events: string[] = [];
      
      manager.on('initialized', () => events.push('initialized'));
      manager.on('started', () => events.push('started'));
      manager.on('stopped', () => events.push('stopped'));

      await manager.initialize();
      await manager.start();
      await manager.stop();
      
      expect(events).toEqual(['initialized', 'started', 'stopped']);
    });

    it('should emit error events', async () => {
      const errors: Error[] = [];
      
      manager.on('error', (error: Error) => errors.push(error));

      // Create a manager that fails during start
      class ErrorManager extends BaseManager {
        protected async doInitialize(): Promise<void> {}
        protected async doStart(): Promise<void> {
          throw new Error('Start failed');
        }
        protected async doStop(): Promise<void> {}
        protected async doCleanup(): Promise<void> {}
      }

      const errorManager = new ErrorManager();
      errorManager.on('error', (error: Error) => errors.push(error));

      await errorManager.initialize();
      await errorManager.start();
      
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Start failed');
      
      await errorManager.cleanup();
    });
  });
});
