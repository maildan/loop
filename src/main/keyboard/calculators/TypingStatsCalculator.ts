// 🔥 기가차드 타이핑 통계 계산기 - 실시간 WPM/정확도 계산!

import { Logger } from '../../../shared/logger';
import type { TypingStats, KeyInputData } from '../../../shared/types';

/**
 * 🔥 TypingStatsCalculator - 실시간 타이핑 통계 계산
 * WPM, 정확도, 타이핑 속도 등 모든 통계를 실시간으로 계산
 */
export class TypingStatsCalculator {
  private readonly componentName = 'TYPING_STATS_CALCULATOR';
  
  // 기본 통계
  private totalKeystrokes = 0;
  private totalCorrectKeystrokes = 0;
  private totalErrors = 0;
  private sessionStartTime: Date | null = null;
  
  // WPM 계산용
  private wpmWindow: Array<{ timestamp: number; isCorrect: boolean }> = [];
  private readonly wpmWindowDuration = 60000; // 1분
  
  // 정확도 계산용
  private accuracyWindow: Array<{ timestamp: number; isCorrect: boolean }> = [];
  private readonly accuracyWindowSize = 100; // 최근 100키
  
  // 성능 추적
  private lastCalculationTime = 0;
  private calculationCount = 0;

  constructor() {
    Logger.info(this.componentName, '타이핑 통계 계산기 초기화됨');
  }

  /**
   * 새로운 세션 시작
   */
  public startSession(): void {
    this.sessionStartTime = new Date();
    this.totalKeystrokes = 0;
    this.totalCorrectKeystrokes = 0;
    this.totalErrors = 0;
    this.wpmWindow = [];
    this.accuracyWindow = [];
    this.calculationCount = 0;
    
    Logger.info(this.componentName, '새 타이핑 세션 시작', {
      startTime: this.sessionStartTime
    });
  }

  /**
   * 현재 세션 종료
   */
  public endSession(): TypingStats {
    const finalStats = this.getCurrentStats();
    
    Logger.info(this.componentName, '타이핑 세션 종료', {
      duration: this.getSessionDuration(),
      finalStats
    });
    
    return finalStats;
  }

  /**
   * 키 입력 추가
   */
  public addKeystroke(input: KeyInputData): void {
    const now = Date.now();
    const isCorrect = this.isCorrectKeystroke(input);
    
    this.totalKeystrokes++;
    if (isCorrect) {
      this.totalCorrectKeystrokes++;
    } else {
      this.totalErrors++;
    }

    // WPM 윈도우에 추가
    this.wpmWindow.push({ timestamp: now, isCorrect });
    this.cleanupWpmWindow(now);

    // 정확도 윈도우에 추가
    this.accuracyWindow.push({ timestamp: now, isCorrect });
    if (this.accuracyWindow.length > this.accuracyWindowSize) {
      this.accuracyWindow.shift();
    }

    this.calculationCount++;
    this.lastCalculationTime = now;
  }

  /**
   * 현재 통계 반환
   */
  public getCurrentStats(): TypingStats {
    const sessionDuration = this.getSessionDuration();
    
    return {
      totalKeystrokes: this.totalKeystrokes,
      wpm: this.calculateCurrentWpm(),
      accuracy: this.calculateCurrentAccuracy(),
      sessionDuration,
      charactersTyped: this.totalCorrectKeystrokes,
      wordsTyped: Math.floor(this.totalCorrectKeystrokes / 5),
      errorsCount: this.totalErrors
    };
  }

  /**
   * 통계 리셋
   */
  public reset(): void {
    this.totalKeystrokes = 0;
    this.totalCorrectKeystrokes = 0;
    this.totalErrors = 0;
    this.sessionStartTime = null;
    this.wpmWindow = [];
    this.accuracyWindow = [];
    this.lastCalculationTime = 0;
    this.calculationCount = 0;
    
    Logger.info(this.componentName, '통계 리셋됨');
  }

  /**
   * 현재 WPM 계산 (최근 1분간)
   */
  private calculateCurrentWpm(): number {
    if (this.wpmWindow.length === 0) return 0;

    const now = Date.now();
    this.cleanupWpmWindow(now);

    if (this.wpmWindow.length === 0) return 0;

    const correctKeystrokes = this.wpmWindow.filter(k => k.isCorrect).length;
    const firstKeystroke = this.wpmWindow[0];
    if (!firstKeystroke) return 0;
    
    const timeSpanMs = now - firstKeystroke.timestamp;
    const timeSpanMinutes = timeSpanMs / 60000;
    
    if (timeSpanMinutes === 0) return 0;
    
    const wpm = Math.round((correctKeystrokes / 5) / timeSpanMinutes);
    return Math.max(0, wpm);
  }

  /**
   * 현재 정확도 계산 (최근 키스트로크 기준)
   */
  private calculateCurrentAccuracy(): number {
    if (this.accuracyWindow.length === 0) return 100;

    const correctCount = this.accuracyWindow.filter(k => k.isCorrect).length;
    const accuracy = (correctCount / this.accuracyWindow.length) * 100;
    
    return Math.round(accuracy * 100) / 100;
  }

  /**
   * 세션 지속 시간 계산 (밀리초)
   */
  private getSessionDuration(): number {
    if (!this.sessionStartTime) return 0;
    return Date.now() - this.sessionStartTime.getTime();
  }

  /**
   * WPM 윈도우 정리 (1분 이상 된 데이터 제거)
   */
  private cleanupWpmWindow(currentTime: number): void {
    const cutoffTime = currentTime - this.wpmWindowDuration;
    this.wpmWindow = this.wpmWindow.filter(entry => entry.timestamp > cutoffTime);
  }

  /**
   * 올바른 키스트로크인지 판단
   */
  private isCorrectKeystroke(input: KeyInputData): boolean {
    const char = input.character;
    
    if (char.length !== 1) return false;
    if (char.charCodeAt(0) < 32) return false;
    if (char === '\b' || char === '\x08') return false;
    
    return true;
  }
}

export default TypingStatsCalculator;
