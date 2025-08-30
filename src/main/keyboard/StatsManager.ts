// 🔥 기가차드 통계 관리자 - 실시간 타이핑 분석!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { TypingStats, TypingSession, KeyboardEvent, Result } from '../../shared/types';
import KEYBOARD_CONSTANTS from './constants';

// #DEBUG: Stats manager entry point
Logger.debug('STATS_MANAGER', 'Stats manager module loaded');

// 🔥 기가차드 통계 관리자 상태 인터페이스
export interface StatsManagerState {
  currentStats: TypingStats;
  sessionStats: Map<string, TypingStats>;
  isCollecting: boolean;
  lastUpdate: Date | null;
  totalSessions: number;
}

// 🔥 기가차드 실시간 통계 인터페이스
export interface RealtimeStats {
  currentWpm: number;
  currentAccuracy: number;
  keystrokesPerMinute: number;
  sessionProgress: number;
  peakWpm: number;
  averageWpm: number;
}

/**
 * 🔥 StatsManager - 실시간 타이핑 통계 분석 및 관리
 * 키스트로크, WPM, 정확도 등 모든 타이핑 지표를 실시간으로 계산하고 관리
 */
export class StatsManager extends BaseManager {
  private readonly componentName = 'STATS_MANAGER';
  private statsState: StatsManagerState;
  private realtimeStats: RealtimeStats;
  private keyBuffer: KeyboardEvent[] = [];
  private sessionBuffer: TypingSession[] = [];
  private wpmHistory: number[] = [];
  private accuracyHistory: number[] = [];
  private currentSessionId: string | null = null;

  constructor() {
    super({
      name: 'StatsManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 2,
      retryDelay: 1000,
    });

    this.statsState = {
      currentStats: this.createEmptyStats(),
      sessionStats: new Map(),
      isCollecting: false,
      lastUpdate: null,
      totalSessions: 0,
    };

    this.realtimeStats = {
      currentWpm: 0,
      currentAccuracy: 1.0,
      keystrokesPerMinute: 0,
      sessionProgress: 0,
      peakWpm: 0,
      averageWpm: 0,
    };

    Logger.info(this.componentName, 'Stats manager instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 통계 수집 시작
      this.statsState.isCollecting = true;
      
      Logger.info(this.componentName, 'Stats manager initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize stats manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      this.statsState.isCollecting = true;
      this.statsState.lastUpdate = new Date();
      
      Logger.info(this.componentName, 'Stats manager started successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start stats manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      this.statsState.isCollecting = false;
      
      Logger.info(this.componentName, 'Stats manager stopped successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop stats manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    this.keyBuffer = [];
    this.sessionBuffer = [];
    this.wpmHistory = [];
    this.accuracyHistory = [];
    this.currentSessionId = null;
    this.statsState.sessionStats.clear();
    
    Logger.info(this.componentName, 'Stats manager cleaned up');
  }

  /**
   * 키보드 이벤트 처리
   */
  public async processKeyEvent(event: KeyboardEvent): Promise<void> {
    if (!this.statsState.isCollecting) return;

    try {
      // 키 버퍼에 추가
      this.keyBuffer.push(event);
      
      // 통계 업데이트
      this.updateCurrentStats(event);
      this.updateRealtimeStats();
      
      this.statsState.lastUpdate = new Date();
      
    } catch (error) {
      Logger.error(this.componentName, 'Error processing key event', error as Error);
    }
  }

  /**
   * 세션 시작
   */
  public async startSession(session: TypingSession): Promise<Result<void>> {
    try {
      this.currentSessionId = session.id;
      
      // 세션별 통계 초기화
      const sessionStats = this.createEmptyStats();
      this.statsState.sessionStats.set(session.id, sessionStats);
      
      // 세션 버퍼에 추가
      this.sessionBuffer.push(session);
      this.statsState.totalSessions++;
      
      Logger.info(this.componentName, 'Session started', { sessionId: session.id });
      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start session', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 세션 종료
   */
  public async endSession(session: TypingSession): Promise<Result<TypingStats>> {
    try {
      if (this.currentSessionId !== session.id) {
        return { success: false, error: 'Session ID mismatch' };
      }

      // 최종 통계 계산
      const finalStats = this.calculateSessionStats(session);
      this.statsState.sessionStats.set(session.id, finalStats);
      
      // 전체 통계에 반영
      this.mergeSessionToGlobalStats(finalStats);
      
      this.currentSessionId = null;
      
      Logger.info(this.componentName, 'Session ended', {
        sessionId: session.id,
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
      });
      
      return { success: true, data: finalStats };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to end session', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 현재 통계 조회
   */
  public async getCurrentStats(): Promise<Result<TypingStats>> {
    try {
      return { success: true, data: { ...this.statsState.currentStats } };
    } catch (error) {
      const err = error as Error;
      return { success: false, error: err.message };
    }
  }

  /**
   * 실시간 통계 조회
   */
  public getRealtimeStats(): RealtimeStats {
    return { ...this.realtimeStats };
  }

  /**
   * 세션별 통계 조회
   */
  public getSessionStats(sessionId: string): TypingStats | null {
    return this.statsState.sessionStats.get(sessionId) || null;
  }

  /**
   * 전체 세션 통계 조회
   */
  public getAllSessionStats(): Map<string, TypingStats> {
    return new Map(this.statsState.sessionStats);
  }

  /**
   * 빈 통계 객체 생성
   */
  private createEmptyStats(): TypingStats {
    return {
      totalKeystrokes: 0,
      wpm: 0,
      accuracy: 1.0,
      sessionDuration: 0,
      charactersTyped: 0,
      wordsTyped: 0,
      errorsCount: 0,
    };
  }

  /**
   * 현재 통계 업데이트
   */
  private updateCurrentStats(event: KeyboardEvent): void {
    this.statsState.currentStats.totalKeystrokes++;
    this.statsState.currentStats.charactersTyped++;
    
    // 단어 계산 (공백 기준)
    if (event.key === 'space') {
      this.statsState.currentStats.wordsTyped++;
    }
    
    // 에러 감지 (백스페이스)
    if (event.key === 'backspace') {
      this.statsState.currentStats.errorsCount++;
    }
  }

  /**
   * 실시간 통계 업데이트
   */
  private updateRealtimeStats(): void {
    if (this.keyBuffer.length === 0) return;

    const now = Date.now();
    const recentKeys = this.keyBuffer.filter(
      key => now - key.timestamp < KEYBOARD_CONSTANTS.WPM_CONSTANTS.MINUTE_IN_MS
    );

    // 실시간 WPM 계산
    const minuteKeys = recentKeys.length;
    const currentWpm = Math.round(minuteKeys / KEYBOARD_CONSTANTS.WPM_CONSTANTS.AVERAGE_WORD_LENGTH);
    
    this.realtimeStats.currentWpm = currentWpm;
    this.realtimeStats.keystrokesPerMinute = minuteKeys;

    // WPM 히스토리 업데이트
    this.wpmHistory.push(currentWpm);
    if (this.wpmHistory.length > 60) { // 최근 60개만 유지
      this.wpmHistory.shift();
    }

    // 피크 WPM 업데이트
    this.realtimeStats.peakWpm = Math.max(this.realtimeStats.peakWpm, currentWpm);
    
    // 평균 WPM 계산
    if (this.wpmHistory.length > 0) {
      this.realtimeStats.averageWpm = Math.round(
        this.wpmHistory.reduce((sum, wpm) => sum + wpm, 0) / this.wpmHistory.length
      );
    }

    // 정확도 계산
    const totalKeys = this.statsState.currentStats.totalKeystrokes;
    const errors = this.statsState.currentStats.errorsCount;
    this.realtimeStats.currentAccuracy = totalKeys > 0 ? (totalKeys - errors) / totalKeys : 1.0;
  }

  /**
   * 세션 통계 계산
   */
  private calculateSessionStats(session: TypingSession): TypingStats {
    const stats = this.createEmptyStats();
    
    stats.totalKeystrokes = session.keyCount;
    stats.wpm = session.wpm;
    stats.accuracy = session.accuracy;
    stats.sessionDuration = session.endTime 
      ? session.endTime.getTime() - session.startTime.getTime()
      : 0;
    stats.charactersTyped = session.content.length;
    stats.wordsTyped = Math.ceil(session.content.length / KEYBOARD_CONSTANTS.WPM_CONSTANTS.AVERAGE_WORD_LENGTH);
    stats.errorsCount = Math.max(0, Math.round(session.keyCount * (1 - session.accuracy)));
    
    return stats;
  }

  /**
   * 세션 통계를 전체 통계에 병합
   */
  private mergeSessionToGlobalStats(sessionStats: TypingStats): void {
    const global = this.statsState.currentStats;
    
    global.totalKeystrokes += sessionStats.totalKeystrokes;
    global.charactersTyped += sessionStats.charactersTyped;
    global.wordsTyped += sessionStats.wordsTyped;
    global.errorsCount += sessionStats.errorsCount;
    global.sessionDuration += sessionStats.sessionDuration;
    
    // 평균 WPM 및 정확도 재계산
    const totalSessions = this.statsState.totalSessions;
    if (totalSessions > 0) {
      global.wpm = Math.round(
        (global.wpm * (totalSessions - 1) + sessionStats.wpm) / totalSessions
      );
      global.accuracy = 
        (global.accuracy * (totalSessions - 1) + sessionStats.accuracy) / totalSessions;
    }
  }

  /**
   * 통계 리셋
   */
  public resetStats(): void {
    this.statsState.currentStats = this.createEmptyStats();
    this.statsState.sessionStats.clear();
    this.statsState.totalSessions = 0;
    this.keyBuffer = [];
    this.sessionBuffer = [];
    this.wpmHistory = [];
    this.accuracyHistory = [];
    
    this.realtimeStats = {
      currentWpm: 0,
      currentAccuracy: 1.0,
      keystrokesPerMinute: 0,
      sessionProgress: 0,
      peakWpm: 0,
      averageWpm: 0,
    };
    
    Logger.info(this.componentName, 'Stats reset');
  }

  /**
   * 통계 매니저 상태 반환
   */
  public getStatsState(): StatsManagerState {
    return { ...this.statsState };
  }

  /**
   * 총 키스트로크 수 반환 (모든 세션)
   */
  public getTotalKeystrokes(): number {
    let total = 0;
    for (const stats of this.statsState.sessionStats.values()) {
      total += stats.totalKeystrokes || 0;
    }
    return total;
  }

  /**
   * 현재 세션 지속 시간 반환 (밀리초)
   */
  public getSessionDuration(): number {
    if (!this.currentSessionId || !this.statsState.sessionStats.has(this.currentSessionId)) {
      return 0;
    }
    
    const sessionStats = this.statsState.sessionStats.get(this.currentSessionId);
    if (!sessionStats) {
      return 0;
    }
    
    return sessionStats.sessionDuration || 0;
  }

  /**
   * 헬스 체크 (BaseManager 오버라이드)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    collecting: boolean;
    totalSessions: number;
    currentWpm: number;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      collecting: this.statsState.isCollecting,
      totalSessions: this.statsState.totalSessions,
      currentWpm: this.realtimeStats.currentWpm,
    };
  }
}

export const statsManager = new StatsManager();
export default statsManager;
