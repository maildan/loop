import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { KeyboardEvent, TypingStats, WindowInfo } from '../../shared/types';
import { EventEmitter } from 'events';

/**
 * 🔥 KeyboardEventProcessor - 키보드 이벤트 처리 및 타이핑 통계 계산
 * 원시 키보드 이벤트를 받아서 의미있는 타이핑 데이터로 변환
 */
export class KeyboardEventProcessor extends BaseManager {
  private readonly componentName = 'KEYBOARD_EVENT_PROCESSOR';
  private currentSession: TypingSession | null = null;
  private eventBuffer: KeyboardEvent[] = [];
  private readonly bufferFlushInterval = 1000; // 1초마다 플러시
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly maxBufferSize = 100;

  // 타이핑 통계 계산을 위한 상태
  private sessionStartTime: number | null = null;
  private totalKeystrokes = 0;
  private totalCharacters = 0;
  private errorCount = 0;
  private lastKeystrokeTime = 0;
  private wordsTyped = 0;

  // 성능 최적화를 위한 debouncing
  private statsUpdateTimer: NodeJS.Timeout | null = null;
  private readonly statsUpdateDelay = 500; // 500ms 딜레이

  constructor() {
    super({
      name: 'KeyboardEventProcessor',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 2000
    });
    Logger.info(this.componentName, 'KeyboardEventProcessor initialized');
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing KeyboardEventProcessor');
    this.resetSession();
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting keyboard event processing');
    
    // 버퍼 플러시 타이머 시작
    this.flushTimer = setInterval(() => {
      this.flushEventBuffer();
    }, this.bufferFlushInterval);

    Logger.info(this.componentName, 'Keyboard event processing started');
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping keyboard event processing');
    
    // 타이머 정리
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.statsUpdateTimer) {
      clearTimeout(this.statsUpdateTimer);
      this.statsUpdateTimer = null;
    }

    // 남은 버퍼 플러시
    this.flushEventBuffer();
    
    Logger.info(this.componentName, 'Keyboard event processing stopped');
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up KeyboardEventProcessor');
    await this.doStop();
    this.resetSession();
    this.eventBuffer = [];
    Logger.info(this.componentName, 'KeyboardEventProcessor cleanup completed');
  }

  /**
   * 키보드 이벤트 처리
   */
  public async processKeyboardEvent(event: KeyboardEvent): Promise<void> {
    const startTime = performance.now();
    
    try {
      Logger.debug(this.componentName, 'Processing keyboard event', {
        key: event.key,
        code: event.code,
        type: event.type,
        windowTitle: event.windowTitle
      });

      // 새 세션 시작 감지
      if (!this.currentSession) {
        this.startNewSession(event);
      }

      // 이벤트 버퍼에 추가
      this.eventBuffer.push(event);

      // 버퍼 크기 체크
      if (this.eventBuffer.length >= this.maxBufferSize) {
        this.flushEventBuffer();
      }

      // 타이핑 통계 업데이트 (debounced)
      this.scheduleStatsUpdate(event);

      const duration = performance.now() - startTime;
      Logger.debug(this.componentName, 'Keyboard event processed', {
        duration: `${duration.toFixed(2)}ms`,
        bufferSize: this.eventBuffer.length
      });

    } catch (error) {
      Logger.error(this.componentName, 'Failed to process keyboard event', error);
      throw error;
    }
  }

  /**
   * 새 타이핑 세션 시작
   */
  private startNewSession(firstEvent: KeyboardEvent): void {
    Logger.info(this.componentName, 'Starting new typing session', {
      windowTitle: firstEvent.windowTitle,
      timestamp: new Date(firstEvent.timestamp).toISOString()
    });

    this.sessionStartTime = firstEvent.timestamp;
    this.totalKeystrokes = 0;
    this.totalCharacters = 0;
    this.errorCount = 0;
    this.wordsTyped = 0;
    this.lastKeystrokeTime = firstEvent.timestamp;

    this.currentSession = {
      id: this.generateSessionId(),
      startTime: new Date(firstEvent.timestamp),
      windowTitle: firstEvent.windowTitle,
      events: [],
      isActive: true
    };

    this.emit('sessionStarted', this.currentSession);
  }

  /**
   * 현재 세션 종료
   */
  public async endCurrentSession(): Promise<TypingSession | null> {
    if (!this.currentSession || !this.sessionStartTime) {
      return null;
    }

    Logger.info(this.componentName, 'Ending current typing session', {
      sessionId: this.currentSession.id,
      duration: Date.now() - this.sessionStartTime
    });

    // 마지막 통계 계산
    const finalStats = this.calculateCurrentStats();
    
    const completedSession: TypingSession = {
      ...this.currentSession,
      endTime: new Date(),
      stats: finalStats,
      events: [...this.eventBuffer], // 버퍼의 모든 이벤트 포함
      isActive: false
    };

    // 세션 초기화
    this.currentSession = null;
    this.resetSession();

    this.emit('sessionEnded', completedSession);
    return completedSession;
  }

  /**
   * debounced 통계 업데이트 스케줄링
   */
  private scheduleStatsUpdate(event: KeyboardEvent): void {
    if (this.statsUpdateTimer) {
      clearTimeout(this.statsUpdateTimer);
    }

    this.statsUpdateTimer = setTimeout(() => {
      this.updateTypingStats(event);
    }, this.statsUpdateDelay);
  }

  /**
   * 타이핑 통계 업데이트
   */
  private updateTypingStats(event: KeyboardEvent): void {
    if (!this.sessionStartTime || event.type !== 'keydown') {
      return;
    }

    this.totalKeystrokes++;
    this.lastKeystrokeTime = event.timestamp;

    // 문자 입력 판단 (특수키 제외)
    if (this.isCharacterKey(event.key)) {
      this.totalCharacters++;
    }

    // 단어 구분 (스페이스바 기준)
    if (event.key === ' ') {
      this.wordsTyped++;
    }

    // 실시간 통계 이벤트 발생
    const currentStats = this.calculateCurrentStats();
    this.emit('statsUpdated', currentStats);
  }

  /**
   * 현재 타이핑 통계 계산
   */
  public calculateCurrentStats(): TypingStats {
    if (!this.sessionStartTime) {
      return this.getEmptyStats();
    }

    const sessionDuration = (this.lastKeystrokeTime - this.sessionStartTime) / 1000; // 초 단위
    const minutes = sessionDuration / 60;

    // WPM 계산 (표준: 5글자 = 1단어)
    const wordsPerMinute = minutes > 0 ? (this.totalCharacters / 5) / minutes : 0;

    // 정확도 계산 (에러는 백스페이스 카운트로 추정)
    const accuracy = this.totalKeystrokes > 0 ? 
      Math.max(0, ((this.totalKeystrokes - this.errorCount) / this.totalKeystrokes) * 100) : 100;

    return {
      totalKeystrokes: this.totalKeystrokes,
      wpm: Math.round(wordsPerMinute * 100) / 100, // 소수점 2자리
      accuracy: Math.round(accuracy * 100) / 100,
      sessionDuration: Math.round(sessionDuration),
      charactersTyped: this.totalCharacters,
      wordsTyped: this.wordsTyped,
      errorsCount: this.errorCount
    };
  }

  /**
   * 이벤트 버퍼 플러시
   */
  private flushEventBuffer(): void {
    if (this.eventBuffer.length === 0) {
      return;
    }

    Logger.debug(this.componentName, 'Flushing event buffer', {
      eventCount: this.eventBuffer.length
    });

    // 이벤트 배치 처리
    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    // 이벤트 발생
    this.emit('eventsBatch', events);

    // 현재 세션에 이벤트 추가
    if (this.currentSession) {
      this.currentSession.events.push(...events);
    }
  }

  /**
   * 문자 키 판단
   */
  private isCharacterKey(key: string): boolean {
    // 기본 문자, 숫자, 특수문자 (제어키 제외)
    const controlKeys = [
      'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Enter',
      'Escape', 'Backspace', 'Delete', 'Insert', 'Home', 'End',
      'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ];

    return !controlKeys.includes(key) && key.length <= 2; // 대부분의 문자는 1-2글자
  }

  /**
   * 세션 상태 초기화
   */
  private resetSession(): void {
    this.sessionStartTime = null;
    this.totalKeystrokes = 0;
    this.totalCharacters = 0;
    this.errorCount = 0;
    this.lastKeystrokeTime = 0;
    this.wordsTyped = 0;
  }

  /**
   * 빈 통계 객체 반환
   */
  private getEmptyStats(): TypingStats {
    return {
      totalKeystrokes: 0,
      wpm: 0,
      accuracy: 100,
      sessionDuration: 0,
      charactersTyped: 0,
      wordsTyped: 0,
      errorsCount: 0
    };
  }

  /**
   * 세션 ID 생성
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 현재 세션 정보 반환
   */
  public getCurrentSession(): TypingSession | null {
    return this.currentSession;
  }

  /**
   * 현재 세션 통계 반환
   */
  public getCurrentStats(): TypingStats {
    return this.calculateCurrentStats();
  }

  /**
   * 에러 카운트 증가 (백스페이스 감지 등)
   */
  public incrementErrorCount(): void {
    this.errorCount++;
    Logger.debug(this.componentName, 'Error count incremented', {
      totalErrors: this.errorCount
    });
  }
}

// 타이핑 세션 인터페이스 (내부용)
interface TypingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  windowTitle: string;
  events: KeyboardEvent[];
  stats?: TypingStats;
  isActive: boolean;
}
