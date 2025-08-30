// 🔥 기가차드 세션 관리자 - 타이핑 세션 관리

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result, TypingSession, KeyInputData } from '../../shared/types';
import { EventEmitter } from 'events';

// #DEBUG: Session manager entry point
Logger.debug('SESSION_MANAGER', 'Session manager module loaded');

// 🔥 기가차드 세션 상태 열거형
export enum SessionState {
  IDLE = 'idle',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
}

// 🔥 기가차드 진행 중인 세션 정보
export interface ActiveSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  keyCount: number;
  content: string;
  language: string;
  windowTitle: string;
  state: SessionState;
  pausedDuration: number;
  errorCount: number;
  wordCount: number;
  characterCount: number;
}

// 🔥 기가차드 세션 통계
export interface SessionStats {
  wpm: number;
  accuracy: number;
  duration: number;
  keyRate: number;
  errorRate: number;
}

// 🔥 기가차드 세션 설정
export interface SessionConfig {
  minDuration: number; // 최소 세션 길이 (ms)
  maxIdleTime: number; // 최대 유휴 시간 (ms)
  autoSave: boolean;
  autoEndOnIdle: boolean;
  trackErrors: boolean;
  calculateWpmRealtime: boolean;
}

/**
 * 🔥 SessionManager - 타이핑 세션 라이프사이클 관리
 * 세션 시작, 일시정지, 종료, 통계 계산 등 관리
 */
export class SessionManager extends BaseManager {
  private readonly componentName = 'SESSION_MANAGER';
  private activeSessions: Map<string, ActiveSession> = new Map();
  private sessionConfig: SessionConfig;
  private idleCheckTimer: NodeJS.Timeout | null = null;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private sessionCounter = 0;

  // 🔥 키보드 전용 추가 속성들
  private keyboardCurrentSession: TypingSession | null = null;
  private keyboardSessionData: KeyInputData[] = [];
  private keyboardSessionId = 0;

  constructor() {
    super({ name: 'SessionManager', autoStart: true });
    
    this.sessionConfig = {
      minDuration: 10000, // 10초
      maxIdleTime: 300000, // 5분
      autoSave: true,
      autoEndOnIdle: true,
      trackErrors: true,
      calculateWpmRealtime: true,
    };
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing session manager');
    
    this.startIdleCheck();
    
    if (this.sessionConfig.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting session manager');
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping session manager');
    
    // 진행 중인 모든 세션 종료
    await this.endAllSessions();
    
    if (this.idleCheckTimer) {
      clearInterval(this.idleCheckTimer);
      this.idleCheckTimer = null;
    }
    
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up session manager');
    
    this.activeSessions.clear();
  }

  /**
   * 새 세션 시작
   */
  public async startSession(windowTitle: string, language = 'auto'): Promise<Result<string>> {
    try {
      const sessionId = `session_${Date.now()}_${++this.sessionCounter}`;
      const now = new Date();
      
      const session: ActiveSession = {
        id: sessionId,
        startTime: now,
        lastActivity: now,
        keyCount: 0,
        content: '',
        language,
        windowTitle,
        state: SessionState.ACTIVE,
        pausedDuration: 0,
        errorCount: 0,
        wordCount: 0,
        characterCount: 0,
      };

      this.activeSessions.set(sessionId, session);
      
      Logger.info(this.componentName, 'Session started', {
        sessionId,
        windowTitle,
        language,
      });
      
      this.emit('sessionStarted', session);
      
      return { success: true, data: sessionId };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to start session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션에 키 이벤트 추가
   */
  public async addKeyEvent(sessionId: string, key: string, isError = false): Promise<Result<boolean>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      if (session.state !== SessionState.ACTIVE) {
        return { success: false, error: 'Session not active' };
      }

      // 세션 업데이트
      session.lastActivity = new Date();
      session.keyCount++;
      session.content += key;
      
      if (isError && this.sessionConfig.trackErrors) {
        session.errorCount++;
      }

      // 단어와 문자 수 업데이트
      this.updateSessionCounts(session);
      
      // 실시간 WPM 계산
      if (this.sessionConfig.calculateWpmRealtime) {
        this.emit('sessionUpdated', {
          sessionId,
          stats: this.calculateSessionStats(session),
        });
      }

      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to add key event', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션 일시정지
   */
  public async pauseSession(sessionId: string): Promise<Result<boolean>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      if (session.state !== SessionState.ACTIVE) {
        return { success: false, error: 'Session not active' };
      }

      session.state = SessionState.PAUSED;
      
      Logger.info(this.componentName, 'Session paused', { sessionId });
      this.emit('sessionPaused', session);
      
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to pause session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션 재개
   */
  public async resumeSession(sessionId: string): Promise<Result<boolean>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      if (session.state !== SessionState.PAUSED) {
        return { success: false, error: 'Session not paused' };
      }

      session.state = SessionState.ACTIVE;
      session.lastActivity = new Date();
      
      Logger.info(this.componentName, 'Session resumed', { sessionId });
      this.emit('sessionResumed', session);
      
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to resume session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 세션 종료
   */
  public async endSession(sessionId: string, save = true): Promise<Result<TypingSession | null>> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      session.state = SessionState.ENDED;
      const endTime = new Date();
      
      // 최소 지속 시간 확인
      const duration = endTime.getTime() - session.startTime.getTime();
      if (duration < this.sessionConfig.minDuration) {
        Logger.debug(this.componentName, 'Session too short, not saving', {
          sessionId,
          duration,
          minDuration: this.sessionConfig.minDuration,
        });
        
        this.activeSessions.delete(sessionId);
        return { success: true, data: null };
      }

      // 타이핑 세션 객체 생성
      const stats = this.calculateSessionStats(session);
      const typingSession: TypingSession = {
        id: sessionId,
        userId: 'default-user',
        content: session.content,
        startTime: session.startTime,
        endTime,
        keyCount: session.keyCount,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        windowTitle: session.windowTitle,
        appName: session.windowTitle?.split(' ')[0] || null,
        isActive: false,
        createdAt: session.startTime,
        updatedAt: new Date(),
      };

      this.activeSessions.delete(sessionId);
      
      Logger.info(this.componentName, 'Session ended', {
        sessionId,
        duration,
        keyCount: session.keyCount,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
      });
      
      this.emit('sessionEnded', typingSession);
      
      return { success: true, data: save ? typingSession : null };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to end session', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 모든 세션 종료
   */
  private async endAllSessions(): Promise<void> {
    const sessionIds = Array.from(this.activeSessions.keys());
    
    for (const sessionId of sessionIds) {
      await this.endSession(sessionId, true);
    }
  }

  /**
   * 유휴 세션 확인
   */
  private startIdleCheck(): void {
    this.idleCheckTimer = setInterval(() => {
      if (!this.sessionConfig.autoEndOnIdle) return;
      
      const now = Date.now();
      const sessionsToEnd: string[] = [];
      
      for (const [sessionId, session] of this.activeSessions) {
        if (session.state === SessionState.ACTIVE) {
          const idleTime = now - session.lastActivity.getTime();
          
          if (idleTime > this.sessionConfig.maxIdleTime) {
            sessionsToEnd.push(sessionId);
          }
        }
      }
      
      // 유휴 세션들 종료
      for (const sessionId of sessionsToEnd) {
        Logger.debug(this.componentName, 'Ending idle session', { sessionId });
        this.endSession(sessionId, true);
      }
    }, 30000); // 30초마다 확인
  }

  /**
   * 자동 저장
   */
  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      for (const session of this.activeSessions.values()) {
        if (session.state === SessionState.ACTIVE) {
          this.emit('sessionAutoSave', {
            sessionId: session.id,
            stats: this.calculateSessionStats(session),
          });
        }
      }
    }, 60000); // 1분마다
  }

  /**
   * 세션 통계 계산
   */
  private calculateSessionStats(session: ActiveSession): SessionStats {
    const now = Date.now();
    const duration = now - session.startTime.getTime() - session.pausedDuration;
    const durationMinutes = duration / 60000;
    
    // WPM 계산 (평균 5글자를 1단어로 계산)
    const wpm = durationMinutes > 0 ? Math.round((session.wordCount / durationMinutes)) : 0;
    
    // 정확도 계산
    const accuracy = session.keyCount > 0 ? 
      Math.round(((session.keyCount - session.errorCount) / session.keyCount) * 100) : 100;
    
    // 키 입력 속도 (키/분)
    const keyRate = durationMinutes > 0 ? Math.round(session.keyCount / durationMinutes) : 0;
    
    // 에러율
    const errorRate = session.keyCount > 0 ? 
      Math.round((session.errorCount / session.keyCount) * 100) : 0;

    return {
      wpm,
      accuracy,
      duration,
      keyRate,
      errorRate,
    };
  }

  /**
   * 세션의 단어 및 문자 수 업데이트
   */
  private updateSessionCounts(session: ActiveSession): void {
    // 단어 수 계산 (공백으로 구분)
    const words = session.content.trim().split(/\s+/);
    session.wordCount = words.length > 0 && words[0] !== '' ? words.length : 0;
    
    // 문자 수 계산 (공백 제외)
    session.characterCount = session.content.replace(/\s/g, '').length;
  }

  /**
   * 활성 세션 목록 조회
   */
  public getActiveSessions(): ActiveSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * 특정 세션 조회
   */
  public getSession(sessionId: string): ActiveSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * 세션 존재 여부 확인
   */
  public hasSession(sessionId: string): boolean {
    return this.activeSessions.has(sessionId);
  }

  /**
   * 활성 세션 수 조회
   */
  public getActiveSessionCount(): number {
    return this.activeSessions.size;
  }

  /**
   * 특정 윈도우의 활성 세션 찾기
   */
  public findSessionByWindow(windowTitle: string): ActiveSession | null {
    for (const session of this.activeSessions.values()) {
      if (session.windowTitle === windowTitle && session.state === SessionState.ACTIVE) {
        return session;
      }
    }
    return null;
  }

  /**
   * 세션 설정 업데이트
   */
  public updateSessionConfig(config: Partial<SessionConfig>): void {
    this.sessionConfig = { ...this.sessionConfig, ...config };
    
    Logger.info(this.componentName, 'Session config updated', config);
    this.emit('configUpdated', this.sessionConfig);
  }

  /**
   * 세션 설정 조회
   */
  public getSessionConfig(): SessionConfig {
    return { ...this.sessionConfig };
  }

  /**
   * 세션 통계 조회
   */
  public getSessionStats(sessionId: string): SessionStats | null {
    const session = this.activeSessions.get(sessionId);
    return session ? this.calculateSessionStats(session) : null;
  }

  // 🔥 기가차드 키보드 세션 관리 추가 기능들 (keyboard/managers에서 통합)

  /**
   * 🔥 키보드 전용 새 세션 시작
   */
  public async startKeyboardSession(): Promise<TypingSession> {
    // 기존 세션이 있으면 종료
    if (this.keyboardCurrentSession) {
      await this.endKeyboardCurrentSession();
    }

    const now = new Date();
    this.keyboardSessionId++;

    this.keyboardCurrentSession = {
      id: `keyboard_session_${this.keyboardSessionId}_${now.getTime()}`,
      userId: 'default_user', // Prisma 필수 필드
      content: '',
      startTime: now,
      endTime: null, // 시작 시에는 null
      keyCount: 0, // Prisma 필수 필드
      wpm: 0,
      accuracy: 100,
      windowTitle: null, // nullable
      appName: null, // nullable
      isActive: true, // Prisma 필수 필드
      createdAt: now, // Prisma 필수 필드
      updatedAt: now, // Prisma 필수 필드
    };

    this.keyboardSessionData = [];

    Logger.info(this.componentName, '새 키보드 타이핑 세션 시작됨', {
      sessionId: this.keyboardCurrentSession.id,
      startTime: this.keyboardCurrentSession.startTime
    });

    return this.keyboardCurrentSession;
  }

  /**
   * 🔥 키보드 전용 현재 세션 종료
   */
  public async endKeyboardCurrentSession(): Promise<TypingSession | null> {
    if (!this.keyboardCurrentSession) {
      Logger.warn(this.componentName, '종료할 키보드 활성 세션이 없음');
      return null;
    }

    const now = new Date();
    const sessionDuration = now.getTime() - this.keyboardCurrentSession.startTime.getTime();

    // 세션 데이터 업데이트
    this.keyboardCurrentSession.endTime = now;
    this.keyboardCurrentSession.isActive = false;
    this.keyboardCurrentSession.updatedAt = now;
    
    this.keyboardCurrentSession.content = this.keyboardSessionData.map(d => d.character).join('');
    this.keyboardCurrentSession.keyCount = this.keyboardSessionData.length;
    
    // WPM 계산
    const durationMinutes = sessionDuration / 60000;
    const charactersTyped = this.keyboardSessionData.filter(d => this.isKeyboardValidCharacter(d.character)).length;
    if (durationMinutes > 0) {
      const wordsTyped = charactersTyped / 5; // 평균 단어 길이 5
      this.keyboardCurrentSession.wpm = Math.round(wordsTyped / durationMinutes);
    }

    // 마지막 윈도우 정보 설정
    if (this.keyboardSessionData.length > 0) {
      const lastInput = this.keyboardSessionData[this.keyboardSessionData.length - 1];
      if (lastInput && lastInput.windowInfo) {
        this.keyboardCurrentSession.windowTitle = lastInput.windowInfo.title || 'Unknown';
        this.keyboardCurrentSession.appName = lastInput.windowInfo.processName || null;
      } else {
        this.keyboardCurrentSession.windowTitle = 'Unknown';
        this.keyboardCurrentSession.appName = null;
      }
    }

    const finalSession = { ...this.keyboardCurrentSession };

    Logger.info(this.componentName, '키보드 타이핑 세션 종료됨', {
      sessionId: finalSession.id,
      duration: sessionDuration,
      keystrokes: finalSession.keyCount,
      wpm: finalSession.wpm,
      accuracy: finalSession.accuracy
    });

    // 세션 저장
    await this.saveKeyboardSession(finalSession);

    // 현재 세션 초기화
    this.keyboardCurrentSession = null;
    this.keyboardSessionData = [];

    return finalSession;
  }

  /**
   * 🔥 키보드 전용 키 입력 기록
   */
  public recordKeyboardInput(input: KeyInputData): void {
    if (!this.keyboardCurrentSession) {
      Logger.warn(this.componentName, '키보드 활성 세션이 없어서 입력을 기록할 수 없음');
      return;
    }

    this.keyboardSessionData.push(input);

    // 실시간 통계 업데이트
    this.updateKeyboardSessionStats();

    Logger.debug(this.componentName, '키보드 키 입력 기록됨', {
      sessionId: this.keyboardCurrentSession.id,
      character: input.character,
      language: input.language,
      totalInputs: this.keyboardSessionData.length
    });
  }

  /**
   * 🔥 키보드 전용 현재 세션 정보 반환
   */
  public getKeyboardCurrentSession(): TypingSession | null {
    return this.keyboardCurrentSession ? { ...this.keyboardCurrentSession } : null;
  }

  /**
   * 🔥 키보드 전용 세션 통계 업데이트
   */
  private updateKeyboardSessionStats(): void {
    if (!this.keyboardCurrentSession || this.keyboardSessionData.length === 0) return;

    const now = new Date();
    const sessionDuration = now.getTime() - this.keyboardCurrentSession.startTime.getTime();
    const durationMinutes = sessionDuration / 60000;

    // 기본 통계 업데이트
    this.keyboardCurrentSession.keyCount = this.keyboardSessionData.length;
    const charactersTyped = this.keyboardSessionData.filter(d => this.isKeyboardValidCharacter(d.character)).length;

    // WPM 업데이트 (최소 1초 이상 경과했을 때만)
    if (durationMinutes > 0.0167) { // 1초 = 0.0167분
      const wordsTyped = charactersTyped / 5;
      this.keyboardCurrentSession.wpm = Math.round(wordsTyped / durationMinutes);
    }

    // 정확도 계산 (백스페이스나 수정 키 감지 시 정확도 조정)
    const errorInputs = this.keyboardSessionData.filter(d => this.isKeyboardErrorInput(d.character)).length;
    
    if (this.keyboardCurrentSession.keyCount > 0) {
      this.keyboardCurrentSession.accuracy = Math.round(
        ((this.keyboardCurrentSession.keyCount - errorInputs) / this.keyboardCurrentSession.keyCount) * 100
      );
    }
  }

  /**
   * 🔥 키보드 전용 유효한 문자인지 확인
   */
  private isKeyboardValidCharacter(char: string): boolean {
    if (char.length !== 1) return false;
    const charCode = char.charCodeAt(0);
    
    // 제어 문자 제외
    if (charCode < 32) return false;
    
    // 백스페이스, 삭제 키 제외
    if (char === '\b' || char === '\x08' || char === '\x7f') return false;
    
    return true;
  }

  /**
   * 🔥 키보드 전용 오류 입력인지 확인 (백스페이스, 삭제 등)
   */
  private isKeyboardErrorInput(char: string): boolean {
    return char === '\b' || char === '\x08' || char === '\x7f';
  }

  /**
   * 🔥 키보드 전용 세션 저장 (실제 구현에서는 데이터베이스 연동)
   */
  private async saveKeyboardSession(session: TypingSession): Promise<void> {
    try {
      // TODO: 실제 구현에서는 Prisma를 통한 데이터베이스 저장
      const duration = session.endTime ? 
        session.endTime.getTime() - session.startTime.getTime() : 0;
      
      Logger.info(this.componentName, '키보드 세션 저장됨 (임시 로그)', {
        sessionId: session.id,
        duration,
        keystrokes: session.keyCount
      });
    } catch (error) {
      Logger.error(this.componentName, '키보드 세션 저장 실패', error);
    }
  }

  /**
   * 🔥 키보드 전용 헬스 체크
   */
  public async keyboardHealthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    activeSession: boolean;
    totalSessions: number;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      activeSession: this.keyboardCurrentSession !== null,
      totalSessions: this.keyboardSessionId
    };
  }
}

// 🔥 기가차드 전역 세션 관리자
export const sessionManager = new SessionManager();

// #DEBUG: Session manager exit point
Logger.debug('SESSION_MANAGER', 'Session manager module setup complete');

export default sessionManager;