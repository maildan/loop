// 🔥 기가차드 키보드 엔진 - 어댑터 패턴 기반 통합 시스템!

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../common/BaseManager';
import { TypingSession, TypingStats, Result, UiohookKeyboardEvent, KeyboardEvent } from '../../shared/types';
import type { IKeyboardInputAdapter, KeyInputData, AdapterOptions } from './adapters/IKeyboardInputAdapter';
import { KeyboardAdapterFactory } from './factories/KeyboardAdapterFactory';
// ✅ 올바른 uiohook 타입 import
import { uIOhook } from 'uiohook-napi';
import type * as UiohookNapi from 'uiohook-napi';

// #DEBUG: Keyboard engine entry point
Logger.debug('KEYBOARD_ENGINE', 'Keyboard engine module loaded');

// 🔥 기가차드 키보드 상수 정의
const KEYBOARD_CONSTANTS = {
  WPM_CONSTANTS: {
    CALCULATION_INTERVAL: 1000, // 1초
    WORDS_PER_MINUTE_DIVISOR: 5, // 평균 단어 길이
  },
  SESSION_CONSTANTS: {
    MIN_DURATION: 5000, // 5초
    AUTO_SAVE_INTERVAL: 30000, // 30초
  },
  PERFORMANCE_CONSTANTS: {
    EVENT_BATCH_SIZE: 100,
    MAX_MEMORY_MB: 200,
  }
} as const;

// 🔥 키보드 엔진 상태 인터페이스
interface KeyboardEngineState {
  totalKeystrokes: number;
  wpm: number;
  accuracy: number;
  lastKeystroke: KeyInputData | null;
  currentSession: TypingSession | null;
  isMonitoring: boolean;
  isRecording: boolean;
  adapterType: string;
  hasPermissions: boolean;
}

// 🔥 키보드 엔진 설정 인터페이스
interface KeyboardEngineConfig {
  enableBuffering: boolean;
  bufferSize: number;
  enableLanguageDetection: boolean;
  enableWindowTracking: boolean;
  enableSessionRecording: boolean;
  inputDelay: number;
  debugMode: boolean;
}

/**
 * 🔥 KeyboardEngine - 핵심 키보드 모니터링 및 분석 엔진
 * 글로벌 키보드 이벤트 처리, 세션 관리, 실시간 통계 계산
 */
export class KeyboardEngine extends BaseManager {
  private readonly componentName = 'KEYBOARD_ENGINE';
  
  // 🔥 기가차드 상태 관리
  private keyboardState: KeyboardEngineState;
  private engineConfig: KeyboardEngineConfig;
  
  // 🔥 어댑터 패턴: OS별 입력 처리기
  private inputAdapter: IKeyboardInputAdapter | null = null;
  
  // 🔥 통계 계산기들 (나중에 분리될 예정)
  private wpmCalculator: unknown = null;
  private accuracyCalculator: unknown = null;
  private sessionManager: unknown = null;
  
  // 🔥 이벤트 발송기
  private eventEmitter: EventEmitter;
  
  // 🔥 성능 추적
  private performanceStats = {
    totalEvents: 0,
    lastEventTime: Date.now(),
    processingTimeSum: 0,
    memoryUsage: process.memoryUsage()
  };

  constructor(adapter?: IKeyboardInputAdapter, config?: Partial<KeyboardEngineConfig>) {
    super({
      name: 'KeyboardEngine',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000
    });
    
    this.eventEmitter = new EventEmitter();
    
    // 🔥 기본 설정 적용
    this.engineConfig = {
      enableBuffering: true,
      bufferSize: 100,
      enableLanguageDetection: true,
      enableWindowTracking: true,
      enableSessionRecording: config?.enableSessionRecording ?? true,
      inputDelay: 0,
      debugMode: false,
      ...config
    };
    
    // 🔥 초기 상태 설정
    this.keyboardState = {
      totalKeystrokes: 0,
      wpm: 0,
      accuracy: 0,
      lastKeystroke: null,
      currentSession: null,
      isMonitoring: false,
      isRecording: false,
      adapterType: adapter?.constructor.name || 'Universal',
      hasPermissions: false
    };
    
    // 🔥 어댑터 설정 (나중에 팩토리에서 생성)
    if (adapter) {
      this.inputAdapter = adapter;
      this.setupAdapterEvents();
    }
    
    Logger.info(this.componentName, '키보드 엔진 초기화 완료', {
      adapterType: this.keyboardState.adapterType,
      config: this.config
    });
  }

  /**
   * 🔥 BaseManager 인터페이스 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, '키보드 엔진 초기화 시작');
    
    try {
      // 어댑터가 없으면 기본 어댑터 생성 (나중에 팩토리 사용)
      if (!this.inputAdapter) {
        // TODO: KeyboardAdapterFactory.createAdapter() 사용
        Logger.warn(this.componentName, '어댑터가 설정되지 않음, uIOhook 사용');
      }
      
      // 어댑터 초기화 (인터페이스 확인 후)
      if (this.inputAdapter && 'initialize' in this.inputAdapter && typeof this.inputAdapter.initialize === 'function') {
        await this.inputAdapter.initialize();
      }
      
      Logger.info(this.componentName, '키보드 엔진 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, '키보드 엔진 초기화 실패', error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '키보드 모니터링 시작');
    
    try {
      if (this.inputAdapter) {
        await this.inputAdapter.startListening();
      } else {
        // 폴백: uIOhook 직접 사용
        await this.startUIOhookFallback();
      }
      
      this.keyboardState.isMonitoring = true;
      this.emit('monitoring-started', this.keyboardState);
      
      Logger.info(this.componentName, '키보드 모니터링 시작됨');
    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 시작 실패', error);
      throw error;
    }
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '키보드 모니터링 중지');
    
    try {
      if (this.inputAdapter) {
        await this.inputAdapter.stopListening();
      } else {
        // 폴백: uIOhook 직접 중지
        uIOhook.stop();
      }
      
      this.keyboardState.isMonitoring = false;
      this.emit('monitoring-stopped', this.keyboardState);
      
      Logger.info(this.componentName, '키보드 모니터링 중지됨');
    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 중지 실패', error);
      throw error;
    }
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '키보드 엔진 정리');
    
    try {
      await this.doStop();
      
      if (this.inputAdapter?.cleanup) {
        await this.inputAdapter.cleanup();
      }
      
      this.eventEmitter.removeAllListeners();
      
      Logger.info(this.componentName, '키보드 엔진 정리 완료');
    } catch (error) {
      Logger.error(this.componentName, '키보드 엔진 정리 실패', error);
    }
  }

  /**
   * 🔥 권한 관리
   */
  public async requestPermissions(): Promise<Result<boolean>> {
    try {
      if (this.inputAdapter?.requestPermissions) {
        const hasPermission = await this.inputAdapter.requestPermissions();
        this.keyboardState.hasPermissions = hasPermission;
        return { success: true, data: hasPermission };
      }
      
      return { success: true, data: true }; // 폴백의 경우 권한 없이 동작
    } catch (error) {
      Logger.error(this.componentName, '권한 요청 실패', error);
      return { success: false, error: String(error) };
    }
  }

  public async checkPermissions(): Promise<Result<boolean>> {
    try {
      if (this.inputAdapter?.checkPermissions) {
        const hasPermission = await this.inputAdapter.checkPermissions();
        this.keyboardState.hasPermissions = hasPermission;
        return { success: true, data: hasPermission };
      }
      
      return { success: true, data: true }; // 폴백의 경우 권한 없이 동작
    } catch (error) {
      Logger.error(this.componentName, '권한 확인 실패', error);
      return { success: false, error: String(error) };
    }
  }

  public setPermissions(hasPermissions: boolean): Result<void> {
    try {
      this.keyboardState.hasPermissions = hasPermissions;
      Logger.info(this.componentName, `권한 상태 업데이트: ${hasPermissions}`);
      return { success: true };
    } catch (error) {
      Logger.error(this.componentName, '권한 설정 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 상태 조회 (BaseManager와 구분)
   */
  public getKeyboardState(): KeyboardEngineState {
    return { ...this.keyboardState };
  }

  public getEngineConfig(): KeyboardEngineConfig {
    return { ...this.engineConfig };
  }

  public getStats(): TypingStats {
    const sessionDuration = this.keyboardState.currentSession ? 
      Date.now() - this.keyboardState.currentSession.startTime.getTime() : 0;
    
    return {
      totalKeystrokes: this.keyboardState.totalKeystrokes,
      wpm: this.keyboardState.wpm,
      accuracy: this.keyboardState.accuracy,
      sessionDuration,
      charactersTyped: this.keyboardState.currentSession?.content.length || 0,
      wordsTyped: Math.floor((this.keyboardState.currentSession?.content.length || 0) / KEYBOARD_CONSTANTS.WPM_CONSTANTS.WORDS_PER_MINUTE_DIVISOR),
      errorsCount: 0 // TODO: 에러 계산기 연동
    };
  }

  /**
   * 🔥 이벤트 처리 - 어댑터로부터 받은 입력 데이터 처리
   */
  private handleKeyInput(inputData: KeyInputData): void {
    const startTime = performance.now();
    
    try {
      // 🔥 통계 업데이트
      this.updateTypingStats(inputData);
      
      // 🔥 세션 기록
      if (this.engineConfig.enableSessionRecording) {
        this.updateSession(inputData);
      }
      
      // 🔥 이벤트 발송
      this.emit('keyboard-event', {
        ...inputData,
        stats: this.getStats()
      });
      
      // 🔥 성능 추적
      const processingTime = performance.now() - startTime;
      this.updatePerformanceStats(processingTime);
      
    } catch (error) {
      Logger.error(this.componentName, '키 입력 처리 실패', error);
    }
  }

  /**
   * 🔥 uIOhook 폴백 처리 (어댑터가 없을 때)
   */
  private async startUIOhookFallback(): Promise<void> {
    Logger.warn(this.componentName, 'uIOhook 폴백 모드로 시작');
    
    // uIOhook 이벤트 핸들러 등록
    uIOhook.on('keydown', (event: UiohookKeyboardEvent) => {
      this.handleUIOhookEvent('keydown', event);
    });
    
    uIOhook.on('keyup', (event: UiohookKeyboardEvent) => {
      this.handleUIOhookEvent('keyup', event);
    });
    
    // uIOhook 시작
    uIOhook.start();
  }

  /**
   * 🔥 uIOhook 이벤트를 KeyInputData로 변환
   */
  private handleUIOhookEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): void {
    try {
      const char = String.fromCharCode(rawEvent.keychar || 0);
      
      // 기본 변환
      const inputData: KeyInputData = {
        character: char,
        timestamp: Date.now(),
        language: 'ko', // TODO: 언어 감지기 연동
        windowInfo: {
          title: 'Unknown',
          processName: 'Unknown'
        },
        inputMethod: 'direct'
      };
      
      this.handleKeyInput(inputData);
      
    } catch (error) {
      Logger.error(this.componentName, 'uIOhook 이벤트 처리 실패', error);
    }
  }

  /**
   * 🔥 통계 업데이트
   */
  private updateTypingStats(inputData: KeyInputData): void {
    // 키스트로크 카운트
    this.keyboardState.totalKeystrokes++;
    this.keyboardState.lastKeystroke = inputData;
    
    // TODO: 실제 WPM/정확도 계산기 연동
    // 임시 계산
    if (this.keyboardState.currentSession) {
      const elapsed = Date.now() - this.keyboardState.currentSession.startTime.getTime();
      const minutes = elapsed / 60000;
      if (minutes > 0) {
        this.keyboardState.wpm = Math.round(
          (this.keyboardState.totalKeystrokes / KEYBOARD_CONSTANTS.WPM_CONSTANTS.WORDS_PER_MINUTE_DIVISOR) / minutes
        );
      }
    }
  }

  /**
   * 🔥 세션 업데이트
   */
  private updateSession(inputData: KeyInputData): void {
    // TODO: SessionManager 연동
    if (!this.keyboardState.currentSession) {
      this.keyboardState.currentSession = {
        id: `session_${Date.now()}`,
        userId: 'default',
        content: '',
        startTime: new Date(),
        endTime: null,
        keyCount: 0,
        wpm: 0,
        accuracy: 0,
        windowTitle: inputData.windowInfo.title,
        appName: inputData.windowInfo.processName || 'Unknown',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    // 세션 데이터 업데이트
    if (this.keyboardState.currentSession) {
      this.keyboardState.currentSession.keyCount++;
      this.keyboardState.currentSession.content += inputData.character;
      this.keyboardState.currentSession.updatedAt = new Date();
    }
  }

  /**
   * 🔥 성능 통계 업데이트
   */
  private updatePerformanceStats(processingTime: number): void {
    this.performanceStats.totalEvents++;
    this.performanceStats.processingTimeSum += processingTime;
    this.performanceStats.lastEventTime = Date.now();
    
    // 주기적으로 메모리 사용량 체크
    if (this.performanceStats.totalEvents % 1000 === 0) {
      this.performanceStats.memoryUsage = process.memoryUsage();
      
      // 메모리 경고
      const memoryMB = this.performanceStats.memoryUsage.heapUsed / 1024 / 1024;
      if (memoryMB > KEYBOARD_CONSTANTS.PERFORMANCE_CONSTANTS.MAX_MEMORY_MB) {
        Logger.warn(this.componentName, `높은 메모리 사용량: ${memoryMB.toFixed(2)}MB`);
      }
    }
  }

  /**
   * 🔥 어댑터 이벤트 설정
   */
  private setupAdapterEvents(): void {
    if (!this.inputAdapter) return;
    
    // 입력 이벤트 연결
    this.inputAdapter.on('input', (inputData: KeyInputData) => {
      this.handleKeyInput(inputData);
    });
    
    // 에러 이벤트 연결
    this.inputAdapter.on('error', (error: Error) => {
      Logger.error(this.componentName, '어댑터 에러', error);
      this.emit('error', error);
    });
  }

  /**
   * 🔥 이벤트 발송 (EventEmitter 래핑)
   */
  public on(event: string, listener: (...args: unknown[]) => void): this {
    this.eventEmitter.on(event, listener);
    return this;
  }

  public emit(event: string, ...args: unknown[]): boolean {
    return this.eventEmitter.emit(event, ...args);
  }

  public off(event: string, listener?: (...args: unknown[]) => void): this {
    if (listener) {
      this.eventEmitter.off(event, listener);
    } else {
      this.eventEmitter.removeAllListeners(event);
    }
    return this;
  }

  /**
   * 🔥 헬스체크
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    stats?: object;
  }> {
    try {
      const baseHealth = await super.healthCheck();
      
      return {
        ...baseHealth,
        stats: {
          totalEvents: this.performanceStats.totalEvents,
          averageProcessingTime: this.performanceStats.totalEvents > 0 ? 
            this.performanceStats.processingTimeSum / this.performanceStats.totalEvents : 0,
          memoryUsage: this.performanceStats.memoryUsage,
          state: this.keyboardState
        }
      };
    } catch (error) {
      Logger.error(this.componentName, '헬스체크 실패', error);
      return {
        healthy: false,
        lastError: String(error)
      };
    }
  }
}

export default KeyboardEngine;
