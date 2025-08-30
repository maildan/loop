// 🔥 기가차드 통합 핸들러 - 키보드 도메인 Facade 패턴!

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../common/BaseManager';
import { Result, KeyboardEvent, TypingSession, WindowInfo } from '../../shared/types';
import { KeyboardEngine } from './KeyboardEngine';
import { StatsManager } from './StatsManager';
import { HangulComposer } from './HangulComposer';
import { WindowTracker } from './WindowTracker';
import { SessionManager } from '../managers/SessionManager';

// #DEBUG: Unified handler entry point
Logger.debug('UNIFIED_HANDLER', 'Unified handler module loaded');

// 🔥 기가차드 통합 핸들러 상태 인터페이스
export interface UnifiedHandlerState {
  isActive: boolean;
  activeHandlers: string[];
  lastActivity: Date | null;
  totalProcessedEvents: number;
  errors: number;
}

// 🔥 기가차드 통합 통계 타입
export interface UnifiedStats {
  keyboard: unknown;
  statistics: unknown;
  handler: UnifiedHandlerState;
  activeHandlers: string[];
}

// 🔥 기가차드 핸들러 등록 정보
export interface HandlerInfo {
  name: string;
  type: 'processor' | 'analyzer' | 'filter' | 'composer';
  priority: number;
  active: boolean;
  handler: (event: KeyboardEvent) => Promise<KeyboardEvent | null>;
}

/**
 * 🔥 UnifiedHandler - 키보드 도메인 통합 Facade
 * 모든 키보드 관련 기능을 통합하여 관리하는 핵심 도메인 서비스
 * Facade 패턴으로 복잡한 하위 시스템들을 단순한 인터페이스로 제공
 */
export class UnifiedHandler extends BaseManager {
  private readonly componentName = 'UNIFIED_HANDLER';
  private handlerState: UnifiedHandlerState;
  private registeredHandlers: Map<string, HandlerInfo> = new Map();
  private keyboardEngine: KeyboardEngine;
  private statsManager: StatsManager;
  private hangulComposer: HangulComposer;
  private windowTracker: WindowTracker; // 🔥 윈도우 추적기 추가
  private sessionManager: SessionManager; // 🔥 세션 매니저 추가
  private eventQueue: KeyboardEvent[] = [];
  private processingLock = false;

  constructor() {
    super({
      name: 'UnifiedHandler',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.handlerState = {
      isActive: false,
      activeHandlers: [],
      lastActivity: null,
      totalProcessedEvents: 0,
      errors: 0,
    };

    // 하위 시스템 인스턴스 생성
    this.keyboardEngine = new KeyboardEngine();
    this.statsManager = new StatsManager();
    this.hangulComposer = new HangulComposer();
    this.windowTracker = new WindowTracker(); // 🔥 윈도우 추적기 인스턴스 생성
    this.sessionManager = new SessionManager(); // 🔥 세션 매니저 인스턴스 생성

    this.setupInternalHandlers();
    Logger.info(this.componentName, 'Unified handler instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 하위 시스템들 초기화
      await this.keyboardEngine.initialize();
      await this.statsManager.initialize();
      await this.hangulComposer.initialize();
      await this.windowTracker.initialize(); // 🔥 윈도우 추적기 초기화만 (시작하지 않음)
      await this.sessionManager.initialize(); // 🔥 세션 매니저 초기화 추가

      // 이벤트 리스너 설정
      this.setupEventListeners();

      Logger.info(this.componentName, 'Unified handler initialized successfully (WindowTracker initialized but not started)');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize unified handler', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 키보드 엔진 시작
      await this.keyboardEngine.start();
      await this.statsManager.start();
      await this.hangulComposer.start();
      
      // 🔥 WindowTracker는 명시적으로 모니터링 시작 시에만 시작
      // await this.windowTracker.start(); // 제거됨

      this.handlerState.isActive = true;
      this.handlerState.lastActivity = new Date();

      Logger.info(this.componentName, 'Unified handler started successfully (WindowTracker는 별도 시작)');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start unified handler', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      // 하위 시스템들 중지
      await this.keyboardEngine.stop();
      await this.statsManager.stop();
      await this.hangulComposer.stop();
      await this.windowTracker.stop(); // 🔥 윈도우 추적기 중지 추가

      this.handlerState.isActive = false;
      this.eventQueue = [];

      Logger.info(this.componentName, 'Unified handler stopped successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop unified handler', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      // 하위 시스템들 정리
      await this.keyboardEngine.cleanup();
      await this.statsManager.cleanup();
      await this.hangulComposer.cleanup();
      await this.windowTracker.cleanup(); // 🔥 윈도우 추적기 정리 추가

      this.registeredHandlers.clear();
      this.eventQueue = [];

      Logger.info(this.componentName, 'Unified handler cleaned up');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup unified handler', err);
    }
  }

  /**
   * 커스텀 핸들러 등록
   */
  public registerHandler(
    name: string,
    type: HandlerInfo['type'],
    handler: HandlerInfo['handler'],
    priority = 50
  ): Result<void> {
    try {
      if (this.registeredHandlers.has(name)) {
        Logger.warn(this.componentName, 'Handler already registered', { name });
        return { success: false, error: `Handler ${name} already exists` };
      }

      const handlerInfo: HandlerInfo = {
        name,
        type,
        priority,
        active: true,
        handler,
      };

      this.registeredHandlers.set(name, handlerInfo);
      this.updateActiveHandlersList();

      Logger.info(this.componentName, 'Handler registered successfully', {
        name,
        type,
        priority,
      });

      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to register handler', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 핸들러 해제
   */
  public unregisterHandler(name: string): Result<void> {
    try {
      if (!this.registeredHandlers.has(name)) {
        return { success: false, error: `Handler ${name} not found` };
      }

      this.registeredHandlers.delete(name);
      this.updateActiveHandlersList();

      Logger.info(this.componentName, 'Handler unregistered successfully', { name });
      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to unregister handler', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 핸들러 활성화/비활성화
   */
  public setHandlerActive(name: string, active: boolean): Result<void> {
    try {
      const handler = this.registeredHandlers.get(name);
      if (!handler) {
        return { success: false, error: `Handler ${name} not found` };
      }

      handler.active = active;
      this.updateActiveHandlersList();

      Logger.info(this.componentName, 'Handler status updated', { name, active });
      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to update handler status', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 키보드 모니터링 시작 (Facade 메서드)
   */
  public async startKeyboardMonitoring(): Promise<Result<void>> {
    try {
      await this.keyboardEngine.start();
      
      // 🔥 키보드 모니터링 시작할 때만 WindowTracker 시작
      if (!this.windowTracker.getTrackerState().isTracking) {
        await this.windowTracker.start();
        Logger.info(this.componentName, 'WindowTracker started with keyboard monitoring');
      }
      
      Logger.info(this.componentName, 'Keyboard monitoring started via unified handler');
      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 키보드 모니터링 중지 (Facade 메서드)
   */
  public async stopKeyboardMonitoring(): Promise<Result<void>> {
    try {
      await this.keyboardEngine.stop();
      
      // 🔥 키보드 모니터링 중지할 때 WindowTracker도 중지
      if (this.windowTracker.getTrackerState().isTracking) {
        await this.windowTracker.stop();
        Logger.info(this.componentName, 'WindowTracker stopped with keyboard monitoring');
      }
      
      Logger.info(this.componentName, 'Keyboard monitoring stopped via unified handler');
      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 타이핑 세션 시작 (Facade 메서드)
   */
  public async startTypingSession(): Promise<Result<TypingSession>> {
    try {
      const session = await this.sessionManager.startKeyboardSession();
      // 통계 매니저에도 알림
      await this.statsManager.startSession(session);
      Logger.info(this.componentName, 'Typing session started via unified handler');
      return { success: true, data: session };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 타이핑 세션 종료 (Facade 메서드)
   */
  public async endTypingSession(): Promise<Result<TypingSession>> {
    try {
      const session = await this.sessionManager.endKeyboardCurrentSession();
      if (session) {
        // 통계 매니저에도 알림
        await this.statsManager.endSession(session);
        Logger.info(this.componentName, 'Typing session ended via unified handler');
        return { success: true, data: session };
      }
      return { success: false, error: 'No active session to end' };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 통합 통계 조회 (Facade 메서드)
   */
  public async getStats(): Promise<Result<UnifiedStats>> {
    try {
      const keyboardState = this.keyboardEngine.getKeyboardState();
      const statsData = await this.statsManager.getCurrentStats();
      
      const unifiedStats: UnifiedStats = {
        keyboard: keyboardState,
        statistics: statsData.success ? statsData.data : null,
        handler: this.handlerState,
        activeHandlers: this.handlerState.activeHandlers,
      };

      return { success: true, data: unifiedStats };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 내부 핸들러들 설정
   */
  private setupInternalHandlers(): void {
    // 한글 조합 핸들러
    this.registerHandler(
      'hangul-composer',
      'composer',
      async (event: KeyboardEvent) => {
        const result = await this.hangulComposer.processKey(event);
        // 조합 결과가 있으면 이벤트 업데이트
        if (result.completed || result.composing) {
          // 한글 조합 정보를 이벤트에 추가 (확장)
          const extendedEvent = {
            ...event,
            hangulResult: result,
          } as KeyboardEvent;
          return extendedEvent;
        }
        return event;
      },
      10
    );

    // 통계 수집 핸들러  
    this.registerHandler(
      'stats-collector',
      'analyzer',
      async (event: KeyboardEvent) => {
        await this.statsManager.processKeyEvent(event);
        return event;
      },
      20
    );

    Logger.debug(this.componentName, 'Internal handlers setup completed');
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    // 키보드 엔진 이벤트들
    this.keyboardEngine.on('keystroke', (event: unknown) => {
      this.processKeyboardEvent(event as KeyboardEvent).catch((error) => {
        Logger.error(this.componentName, 'Error processing keyboard event', error);
      });
    });

    this.keyboardEngine.on('session-start', (session: unknown) => {
      this.emit('session-start', session as TypingSession);
    });

    this.keyboardEngine.on('session-end', (session: unknown) => {
      this.emit('session-end', session as TypingSession);
    });

    this.keyboardEngine.on('wpm-update', (wpm: unknown) => {
      this.emit('wpm-update', wpm as number);
    });

    Logger.debug(this.componentName, 'Event listeners setup completed');
  }

  /**
   * 키보드 이벤트 처리 (핸들러 체인 실행)
   */
  private async processKeyboardEvent(event: KeyboardEvent): Promise<void> {
    if (this.processingLock) {
      this.eventQueue.push(event);
      return;
    }

    this.processingLock = true;

    try {
      let processedEvent: KeyboardEvent | null = event;

      // 우선순위 순으로 핸들러 실행
      const sortedHandlers = Array.from(this.registeredHandlers.values())
        .filter(h => h.active)
        .sort((a, b) => a.priority - b.priority);

      for (const handlerInfo of sortedHandlers) {
        if (processedEvent) {
          try {
            processedEvent = await handlerInfo.handler(processedEvent);
          } catch (error) {
            Logger.error(this.componentName, `Handler ${handlerInfo.name} failed`, error as Error);
            this.handlerState.errors++;
          }
        }
      }

      this.handlerState.totalProcessedEvents++;
      this.handlerState.lastActivity = new Date();

      // 처리된 이벤트 발생
      if (processedEvent) {
        this.emit('event-processed', processedEvent);
      }

    } catch (error) {
      Logger.error(this.componentName, 'Error in event processing chain', error as Error);
      this.handlerState.errors++;
    } finally {
      this.processingLock = false;

      // 큐에 대기 중인 이벤트 처리
      if (this.eventQueue.length > 0) {
        const nextEvent = this.eventQueue.shift();
        if (nextEvent) {
          setImmediate(() => this.processKeyboardEvent(nextEvent));
        }
      }
    }
  }

  /**
   * 활성 핸들러 목록 업데이트
   */
  private updateActiveHandlersList(): void {
    this.handlerState.activeHandlers = Array.from(this.registeredHandlers.values())
      .filter(h => h.active)
      .map(h => h.name);
  }

  /**
   * 통합 핸들러 상태 반환
   */
  public getHandlerState(): UnifiedHandlerState {
    return { ...this.handlerState };
  }

  /**
   * 등록된 핸들러 목록 반환
   */
  public getRegisteredHandlers(): HandlerInfo[] {
    return Array.from(this.registeredHandlers.values());
  }

  /**
   * 헬스 체크 (BaseManager 오버라이드)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    subsystems: {
      keyboardEngine: unknown;
      statsManager: unknown;
      hangulComposer: unknown;
      windowTracker: unknown;
    };
    handlerStats: UnifiedHandlerState;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      subsystems: {
        keyboardEngine: await this.keyboardEngine.healthCheck(),
        statsManager: await this.statsManager.healthCheck(),
        hangulComposer: await this.hangulComposer.healthCheck(),
        windowTracker: await this.windowTracker.healthCheck(),
      },
      handlerStats: this.handlerState,
    };
  }

  /**
   * 실시간 통계 정보 반환
   */
  public getRealtimeStats(): {
    currentWpm: number;
    averageWpm: number;
    peakWpm: number;
    totalKeystrokes: number;
    accuracy: number;
    sessionDuration: number;
  } {
    const stats = this.statsManager.getRealtimeStats();
    
    return {
      currentWpm: stats.currentWpm || 0,
      averageWpm: stats.averageWpm || 0,
      peakWpm: stats.peakWpm || 0,
      totalKeystrokes: this.statsManager.getTotalKeystrokes(),
      accuracy: stats.currentAccuracy || 0,
      sessionDuration: this.statsManager.getSessionDuration(),
    };
  }

  /**
   * 현재 윈도우 정보 반환
   */
  public getCurrentWindow(): WindowInfo | null {
    const windowInfo = this.windowTracker.getCurrentWindow();
    if (!windowInfo) return null;
    
    // active-win WindowInfo → shared/types WindowInfo 변환 (이미 호환됨)
    return windowInfo;
  }

  /**
   * 윈도우 히스토리 반환
   */
  public getWindowHistory(): WindowInfo[] {
    const history = this.windowTracker.getWindowHistory();
    
    // active-win WindowInfo[] → shared/types WindowInfo[] 변환 (이미 호환됨)
    return history;
  }
}

export const unifiedHandler = new UnifiedHandler();
export default unifiedHandler;
