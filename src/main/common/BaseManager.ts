// 🔥 기가차드 베이스 매니저 - 모든 매니저의 기본 클래스

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';

// #DEBUG: Base manager module entry point
Logger.debug('BASE_MANAGER', 'Base manager module loaded');

// 🔥 기가차드 매니저 상태 인터페이스
export interface ManagerState {
  isInitialized: boolean;
  isRunning: boolean;
  lastError?: Error;
  initTime?: Date;
  startTime?: Date;
}

// 🔥 기가차드 매니저 설정 인터페이스
export interface ManagerConfig {
  name: string;
  autoStart: boolean;
  retryOnError: boolean;
  maxRetries: number;
  retryDelay: number;
}

// 🔥 기가차드 베이스 매니저 추상 클래스
export abstract class BaseManager extends EventEmitter {
  protected readonly config: ManagerConfig;
  protected state: ManagerState;
  protected retryCount = 0;

  constructor(config: Partial<ManagerConfig> = {}) {
    super();
    
    this.config = {
      name: this.constructor.name,
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };

    this.state = {
      isInitialized: false,
      isRunning: false,
    };

    Logger.debug('BASE_MANAGER', `${this.config.name} manager created`);
  }

  // 🔥 추상 메서드들 - 하위 클래스에서 구현 필수
  protected abstract doInitialize(): Promise<void>;
  protected abstract doStart(): Promise<void>;
  protected abstract doStop(): Promise<void>;
  protected abstract doCleanup(): Promise<void>;

  // 🔥 매니저 초기화
  public async initialize(): Promise<boolean> {
    try {
      if (this.state.isInitialized) {
        Logger.warn('BASE_MANAGER', `${this.config.name} already initialized`);
        return true;
      }

      // #DEBUG: Initializing manager
      Logger.debug('BASE_MANAGER', `Initializing ${this.config.name} manager`);

      await this.doInitialize();
      
      this.state.isInitialized = true;
      this.state.initTime = new Date();
      this.retryCount = 0;

      this.emit('initialized');
      Logger.info('BASE_MANAGER', `${this.config.name} manager initialized successfully`);

      // 자동 시작 설정
      if (this.config.autoStart) {
        await this.start();
      }

      return true;

    } catch (error) {
      Logger.error('BASE_MANAGER', `Failed to initialize ${this.config.name}`, error);
      this.state.lastError = error instanceof Error ? error : new Error(String(error));
      this.emit('error', this.state.lastError);

      // 재시도 로직
      if (this.config.retryOnError && this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        Logger.info('BASE_MANAGER', `Retrying initialization (${this.retryCount}/${this.config.maxRetries})`);
        
        await this.delay(this.config.retryDelay);
        return this.initialize();
      }

      return false;
    }
  }

  // 🔥 매니저 시작
  public async start(): Promise<boolean> {
    try {
      if (!this.state.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return false;
        }
      }

      if (this.state.isRunning) {
        Logger.warn('BASE_MANAGER', `${this.config.name} already running`);
        return true;
      }

      // #DEBUG: Starting manager
      Logger.debug('BASE_MANAGER', `Starting ${this.config.name} manager`);

      await this.doStart();
      
      this.state.isRunning = true;
      this.state.startTime = new Date();

      this.emit('started');
      Logger.info('BASE_MANAGER', `${this.config.name} manager started successfully`);

      return true;

    } catch (error) {
      Logger.error('BASE_MANAGER', `Failed to start ${this.config.name}`, error);
      this.state.lastError = error instanceof Error ? error : new Error(String(error));
      this.emit('error', this.state.lastError);
      return false;
    }
  }

  // 🔥 매니저 중지
  public async stop(): Promise<boolean> {
    try {
      if (!this.state.isRunning) {
        Logger.warn('BASE_MANAGER', `${this.config.name} not running`);
        return true;
      }

      // #DEBUG: Stopping manager
      Logger.debug('BASE_MANAGER', `Stopping ${this.config.name} manager`);

      await this.doStop();
      
      this.state.isRunning = false;

      this.emit('stopped');
      Logger.info('BASE_MANAGER', `${this.config.name} manager stopped successfully`);

      return true;

    } catch (error) {
      Logger.error('BASE_MANAGER', `Failed to stop ${this.config.name}`, error);
      this.state.lastError = error instanceof Error ? error : new Error(String(error));
      this.emit('error', this.state.lastError);
      return false;
    }
  }

  // 🔥 매니저 재시작
  public async restart(): Promise<boolean> {
    // #DEBUG: Restarting manager
    Logger.debug('BASE_MANAGER', `Restarting ${this.config.name} manager`);

    const stopped = await this.stop();
    if (!stopped) {
      return false;
    }

    await this.delay(500); // 짧은 대기
    return this.start();
  }

  // 🔥 매니저 정리
  public async cleanup(): Promise<void> {
    try {
      // #DEBUG: Cleaning up manager
      Logger.debug('BASE_MANAGER', `Cleaning up ${this.config.name} manager`);

      if (this.state.isRunning) {
        await this.stop();
      }

      await this.doCleanup();
      
      this.state.isInitialized = false;
      this.removeAllListeners();

      Logger.info('BASE_MANAGER', `${this.config.name} manager cleaned up`);

    } catch (error) {
      Logger.error('BASE_MANAGER', `Failed to cleanup ${this.config.name}`, error);
    }
  }

  // 🔥 상태 확인 메서드들
  public isInitialized(): boolean {
    return this.state.isInitialized;
  }

  public isRunning(): boolean {
    return this.state.isRunning;
  }

  public getState(): Readonly<ManagerState> {
    return { ...this.state };
  }

  public getConfig(): Readonly<ManagerConfig> {
    return { ...this.config };
  }

  public getLastError(): Error | undefined {
    return this.state.lastError;
  }

  // 🔥 헬스 체크
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
  }> {
    const healthy = this.state.isInitialized && !this.state.lastError;
    
    let uptime: number | undefined;
    if (this.state.startTime) {
      uptime = Date.now() - this.state.startTime.getTime();
    }

    return {
      healthy,
      uptime,
      lastError: this.state.lastError?.message,
    };
  }

  // 🔥 메트릭스 수집
  public getMetrics(): Record<string, unknown> {
    return {
      name: this.config.name,
      isInitialized: this.state.isInitialized,
      isRunning: this.state.isRunning,
      initTime: this.state.initTime?.toISOString(),
      startTime: this.state.startTime?.toISOString(),
      retryCount: this.retryCount,
      maxRetries: this.config.maxRetries,
      hasError: !!this.state.lastError,
      errorMessage: this.state.lastError?.message,
    };
  }

  // 🔥 유틸리티 메서드들
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected handleError(error: unknown, context: string): Error {
    const err = error instanceof Error ? error : new Error(String(error));
    Logger.error('BASE_MANAGER', `${this.config.name} error in ${context}`, err);
    this.state.lastError = err;
    this.emit('error', err);
    return err;
  }
}

// #DEBUG: Base manager module exit point
Logger.debug('BASE_MANAGER', 'Base manager module setup complete');

export default BaseManager;
