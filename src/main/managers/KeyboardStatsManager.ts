// 🔥 기가차드 키보드 통계 관리자 - 실시간 WPM 및 정확도 계산

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import type { ProcessedKeyboardEvent, TypingSession } from '../../shared/types';

/**
 * 🔥 KeyboardStatsManager - 키보드 통계 전문 관리
 * 
 * 책임:
 * - 실시간 WPM 계산
 * - 타이핑 정확도 측정
 * - 언어별 통계 관리
 * - 성능 메트릭 수집
 */
export class KeyboardStatsManager extends BaseManager {
  private readonly componentName = 'KEYBOARD_STATS_MANAGER';
  
  // 통계 데이터
  private currentWpm = 0;
  private currentAccuracy = 100;
  private totalKeystrokes = 0;
  private correctKeystrokes = 0;
  private errorKeystrokes = 0;
  
  // 성능 추적
  private startTime: Date | null = null;
  private lastKeystrokeTime: Date | null = null;
  private recentKeystrokes: ProcessedKeyboardEvent[] = [];
  private readonly maxRecentKeystrokes = 100; // 최근 100개 키스트로크 유지
  
  // 언어별 통계
  private languageStats: Map<string, {
    keystrokes: number;
    wpm: number;
    accuracy: number;
    lastUpdate: Date;
  }> = new Map();

  constructor() {
    super({
      name: 'KeyboardStatsManager',
      autoStart: false
    });
    
    Logger.info(this.componentName, '키보드 통계 관리자 초기화됨');
  }

  /**
   * BaseManager 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, '키보드 통계 관리자 초기화 시작');
    this.resetStats();
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '키보드 통계 관리자 시작됨');
    this.startTime = new Date();
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '키보드 통계 관리자 중지됨');
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '키보드 통계 관리자 정리됨');
    this.resetStats();
  }

  /**
   * 🔥 키 이벤트 통계 업데이트
   */
  public updateKeyboardStats(event: ProcessedKeyboardEvent): void {
    this.totalKeystrokes++;
    this.lastKeystrokeTime = new Date();
    
    // 최근 키스트로크 관리
    this.recentKeystrokes.push(event);
    if (this.recentKeystrokes.length > this.maxRecentKeystrokes) {
      this.recentKeystrokes.shift();
    }
    
    // 정확도 계산 (백스페이스는 에러로 간주)
    if (this.isErrorKeystroke(event)) {
      this.errorKeystrokes++;
    } else {
      this.correctKeystrokes++;
    }
    
    // WPM 계산 (실시간)
    this.updateWpm();
    
    // 정확도 계산
    this.updateAccuracy();
    
    // 언어별 통계 업데이트
    this.updateLanguageStats(event);
    
    Logger.debug(this.componentName, '키보드 통계 업데이트됨', {
      totalKeystrokes: this.totalKeystrokes,
      wpm: this.currentWpm,
      accuracy: this.currentAccuracy,
      language: event.language
    });
  }

  /**
   * 🔥 실시간 WPM 계산
   */
  private updateWpm(): void {
    if (!this.startTime || this.totalKeystrokes < 5) {
      this.currentWpm = 0;
      return;
    }

    const now = new Date();
    const durationMinutes = (now.getTime() - this.startTime.getTime()) / 60000;
    
    if (durationMinutes > 0) {
      // 평균 단어 길이를 5로 가정하여 WPM 계산
      const words = this.correctKeystrokes / 5;
      this.currentWpm = Math.round(words / durationMinutes);
    }
  }

  /**
   * 🔥 정확도 계산
   */
  private updateAccuracy(): void {
    if (this.totalKeystrokes === 0) {
      this.currentAccuracy = 100;
      return;
    }
    
    this.currentAccuracy = Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100);
  }

  /**
   * 🔥 언어별 통계 업데이트
   */
  private updateLanguageStats(event: ProcessedKeyboardEvent): void {
    const language = event.language || 'en';
    const existing = this.languageStats.get(language) || {
      keystrokes: 0,
      wpm: 0,
      accuracy: 100,
      lastUpdate: new Date()
    };
    
    existing.keystrokes++;
    existing.lastUpdate = new Date();
    
    // 언어별 정확도 계산 (간단화)
    if (!this.isErrorKeystroke(event)) {
      existing.accuracy = Math.round(((existing.keystrokes - 1) * existing.accuracy + 100) / existing.keystrokes);
    } else {
      existing.accuracy = Math.round(((existing.keystrokes - 1) * existing.accuracy + 0) / existing.keystrokes);
    }
    
      this.languageStats.set(language, existing);
  }

  /**
   * 🔥 에러 키스트로크 판별
   */
  private isErrorKeystroke(event: ProcessedKeyboardEvent): boolean {
    // 백스페이스, 삭제 키를 에러로 간주
    return event.key === 'Backspace' || 
           event.key === 'Delete' || 
           event.keycode === 8 || 
           event.keycode === 46;
  }

  /**
   * 🔥 현재 통계 조회
   */
  public getCurrentStats(): {
    wpm: number;
    accuracy: number;
    totalKeystrokes: number;
    correctKeystrokes: number;
    errorKeystrokes: number;
    sessionDuration: number;
    languageStats: Array<{
      language: string;
      keystrokes: number;
      wpm: number;
      accuracy: number;
    }>;
  } {
    const sessionDuration = this.startTime ? 
      Date.now() - this.startTime.getTime() : 0;
    
    const languageStatsArray = Array.from(this.languageStats.entries()).map(([language, stats]) => ({
      language,
      keystrokes: stats.keystrokes,
      wpm: stats.wpm,
      accuracy: stats.accuracy
    }));

    return {
      wpm: this.currentWpm,
      accuracy: this.currentAccuracy,
      totalKeystrokes: this.totalKeystrokes,
      correctKeystrokes: this.correctKeystrokes,
      errorKeystrokes: this.errorKeystrokes,
      sessionDuration,
      languageStats: languageStatsArray
    };
  }

  /**
   * 🔥 최근 키스트로크 분석
   */
  public getRecentKeystrokeAnalysis(): {
    averageInterval: number;
    burstTyping: boolean;
    typingPattern: 'steady' | 'burst' | 'slow';
  } {
    if (this.recentKeystrokes.length < 2) {
      return {
        averageInterval: 0,
        burstTyping: false,
        typingPattern: 'steady'
      };
    }

    // 최근 키스트로크 간격 계산
    const intervals: number[] = [];
    for (let i = 1; i < this.recentKeystrokes.length; i++) {
      const current = this.recentKeystrokes[i];
      const previous = this.recentKeystrokes[i - 1];
      if (current && previous) {
        const interval = current.timestamp - previous.timestamp;
        intervals.push(interval);
      }
    }

    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    
    // 버스트 타이핑 감지 (평균보다 50% 빠른 구간이 5개 이상)
    const fastIntervals = intervals.filter(interval => interval < averageInterval * 0.5);
    const burstTyping = fastIntervals.length >= 5;
    
    // 타이핑 패턴 분석
    let typingPattern: 'steady' | 'burst' | 'slow' = 'steady';
    if (averageInterval < 100) {
      typingPattern = 'burst';
    } else if (averageInterval > 500) {
      typingPattern = 'slow';
    }

    return {
      averageInterval,
      burstTyping,
      typingPattern
    };
  }

  /**
   * 🔥 통계 리셋
   */
  public resetStats(): void {
    this.currentWpm = 0;
    this.currentAccuracy = 100;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorKeystrokes = 0;
    this.startTime = null;
    this.lastKeystrokeTime = null;
    this.recentKeystrokes = [];
    this.languageStats.clear();
    
    Logger.info(this.componentName, '키보드 통계 리셋됨');
  }

  /**
   * 🔥 헬스 체크
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    isTracking: boolean;
    totalKeystrokes: number;
    currentWpm: number;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      isTracking: this.startTime !== null,
      totalKeystrokes: this.totalKeystrokes,
      currentWpm: this.currentWpm
    };
  }
}

export default KeyboardStatsManager;
