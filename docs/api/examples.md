# Loop Typing Analytics - 코드 예제 모음

## 🚀 실제 사용 예제

Loop 애플리케이션의 핵심 기능들을 실제로 어떻게 사용하는지 보여주는 완전한 예제 모음입니다.

## 📱 기본 애플리케이션 설정

### 1. Main Process 초기화

```typescript
// src/main/index.ts
import { app, BrowserWindow } from 'electron';
import { Logger } from '../shared/logger';
import { windowManager } from './core/window';
import { setupKeyboardIpcHandlers } from './handlers/keyboardIpcHandlers';
import { setupDashboardIpcHandlers } from './handlers/dashboardIpcHandlers';
import { unifiedHandler } from './keyboard/UnifiedHandler';

class LoopApplication {
  private isInitialized = false;
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    Logger.info('MAIN_INDEX', 'Loop application instance created');
    this.setupEventHandlers();
  }

  public async initialize(): Promise<void> {
    try {
      Logger.debug('MAIN_INDEX', 'Starting application initialization');

      // IPC 핸들러 설정
      this.setupIpcHandlers();
      Logger.info('MAIN_INDEX', 'IPC handlers setup complete');

      // UnifiedHandler 초기화
      await this.initializeUnifiedHandler();
      Logger.info('MAIN_INDEX', 'UnifiedHandler initialized');

      this.isInitialized = true;
      Logger.info('MAIN_INDEX', 'Application initialization complete');

    } catch (error) {
      Logger.error('MAIN_INDEX', 'Application initialization failed', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    app.whenReady().then(() => {
      this.initialize();
      this.createMainWindow();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    app.on('before-quit', async (event) => {
      event.preventDefault();
      await this.cleanup();
      app.quit();
    });
  }

  private createMainWindow(): void {
    this.mainWindow = windowManager.createMainWindow();
    
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
  }

  private setupIpcHandlers(): void {
    setupKeyboardIpcHandlers();
    setupDashboardIpcHandlers();
    Logger.info('MAIN_INDEX', 'All IPC handlers registered');
  }

  private async initializeUnifiedHandler(): Promise<void> {
    const result = await unifiedHandler.initialize();
    if (!result.success) {
      throw new Error(`UnifiedHandler initialization failed: ${result.error}`);
    }
    
    // 글로벌 접근을 위해 등록
    globalThis.unifiedHandler = unifiedHandler;
  }

  private async cleanup(): Promise<void> {
    Logger.info('MAIN_INDEX', 'Starting cleanup process');
    
    try {
      if (unifiedHandler) {
        await unifiedHandler.cleanup();
      }
      Logger.info('MAIN_INDEX', 'Cleanup completed successfully');
    } catch (error) {
      Logger.error('MAIN_INDEX', 'Error during cleanup', error);
    }
  }
}

// 애플리케이션 인스턴스 생성 및 시작
const loopApp = new LoopApplication();
```

### 2. Renderer Process (React 컴포넌트)

```typescript
// src/renderer/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Logger } from '../../shared/logger';

// 🔥 프리컴파일된 스타일
const DASHBOARD_STYLES = {
  container: 'min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6',
  header: 'text-3xl font-bold text-slate-900 mb-8',
  statsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
  statCard: 'bg-white rounded-lg p-6 shadow-sm border border-slate-200',
  statValue: 'text-2xl font-bold text-blue-600',
  statLabel: 'text-sm text-slate-600 mt-1',
  controlPanel: 'bg-white rounded-lg p-6 shadow-sm border border-slate-200',
  button: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
  buttonDanger: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors',
  sessionList: 'bg-white rounded-lg p-6 shadow-sm border border-slate-200 mt-6'
} as const;

interface RealtimeStats {
  currentWpm: number;
  averageWpm: number;
  totalKeystrokes: number;
  sessionDuration: number;
  accuracy: number;
}

interface TypingSession {
  id: string;
  startTime: string;
  endTime: string;
  wpm: number;
  accuracy: number;
  keyCount: number;
  windowTitle: string;
}

export function Dashboard(): JSX.Element {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [sessions, setSessions] = useState<TypingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 실시간 통계 업데이트
  useEffect(() => {
    if (!isMonitoring) return;

    const updateStats = async (): Promise<void> => {
      try {
        const response = await window.electronAPI.keyboard.getRealtimeStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        Logger.error('DASHBOARD', 'Failed to fetch realtime stats', error);
      }
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  // 세션 목록 로드
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async (): Promise<void> => {
    try {
      const response = await window.electronAPI.dashboard.getSessions(10);
      if (response.success && response.data) {
        setSessions(response.data);
      }
    } catch (error) {
      Logger.error('DASHBOARD', 'Failed to load sessions', error);
    }
  };

  const handleStartMonitoring = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await window.electronAPI.keyboard.startMonitoring();
      if (response.success) {
        setIsMonitoring(true);
        Logger.info('DASHBOARD', 'Monitoring started successfully');
      } else {
        Logger.error('DASHBOARD', 'Failed to start monitoring', response.error);
      }
    } catch (error) {
      Logger.error('DASHBOARD', 'Error starting monitoring', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopMonitoring = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await window.electronAPI.keyboard.stopMonitoring();
      if (response.success) {
        setIsMonitoring(false);
        setStats(null);
        await loadSessions(); // 새로운 세션 로드
        Logger.info('DASHBOARD', 'Monitoring stopped successfully');
      } else {
        Logger.error('DASHBOARD', 'Failed to stop monitoring', response.error);
      }
    } catch (error) {
      Logger.error('DASHBOARD', 'Error stopping monitoring', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className={DASHBOARD_STYLES.container}>
      <h1 className={DASHBOARD_STYLES.header}>
        Loop Typing Analytics
      </h1>

      {/* 실시간 통계 */}
      <div className={DASHBOARD_STYLES.statsGrid}>
        <div className={DASHBOARD_STYLES.statCard}>
          <div className={DASHBOARD_STYLES.statValue}>
            {stats?.currentWpm ?? 0}
          </div>
          <div className={DASHBOARD_STYLES.statLabel}>Current WPM</div>
        </div>

        <div className={DASHBOARD_STYLES.statCard}>
          <div className={DASHBOARD_STYLES.statValue}>
            {stats?.averageWpm ?? 0}
          </div>
          <div className={DASHBOARD_STYLES.statLabel}>Average WPM</div>
        </div>

        <div className={DASHBOARD_STYLES.statCard}>
          <div className={DASHBOARD_STYLES.statValue}>
            {stats?.totalKeystrokes ?? 0}
          </div>
          <div className={DASHBOARD_STYLES.statLabel}>Total Keystrokes</div>
        </div>

        <div className={DASHBOARD_STYLES.statCard}>
          <div className={DASHBOARD_STYLES.statValue}>
            {stats?.accuracy ? `${stats.accuracy}%` : '0%'}
          </div>
          <div className={DASHBOARD_STYLES.statLabel}>Accuracy</div>
        </div>
      </div>

      {/* 제어 패널 */}
      <div className={DASHBOARD_STYLES.controlPanel}>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Monitoring Control
        </h2>
        
        <div className="flex gap-4 items-center">
          {!isMonitoring ? (
            <button
              onClick={handleStartMonitoring}
              disabled={loading}
              className={DASHBOARD_STYLES.button}
            >
              {loading ? 'Starting...' : 'Start Monitoring'}
            </button>
          ) : (
            <button
              onClick={handleStopMonitoring}
              disabled={loading}
              className={DASHBOARD_STYLES.buttonDanger}
            >
              {loading ? 'Stopping...' : 'Stop Monitoring'}
            </button>
          )}

          <div className="text-sm text-slate-600">
            Status: {isMonitoring ? 
              <span className="text-green-600 font-medium">Active</span> : 
              <span className="text-red-600 font-medium">Inactive</span>
            }
          </div>

          {stats?.sessionDuration && (
            <div className="text-sm text-slate-600">
              Session Duration: {formatDuration(stats.sessionDuration)}
            </div>
          )}
        </div>
      </div>

      {/* 최근 세션 */}
      <div className={DASHBOARD_STYLES.sessionList}>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Recent Sessions
        </h2>
        
        {sessions.length === 0 ? (
          <p className="text-slate-600">No sessions yet. Start monitoring to create your first session!</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">
                    {session.windowTitle}
                  </div>
                  <div className="text-sm text-slate-600">
                    {new Date(session.startTime).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-600">
                    {session.wpm} WPM
                  </div>
                  <div className="text-sm text-slate-600">
                    {session.accuracy}% accuracy • {session.keyCount} keys
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## ⌨️ 키보드 모니터링 예제

### 3. 키보드 이벤트 처리

```typescript
// src/main/keyboard/examples/KeyboardEventExample.ts
import { unifiedHandler } from '../UnifiedHandler';
import { Logger } from '../../../shared/logger';

export class KeyboardEventExample {
  public async demonstrateKeyboardEvents(): Promise<void> {
    Logger.info('EXAMPLE', 'Starting keyboard event demonstration');

    // 1. 키보드 모니터링 시작
    const startResult = await unifiedHandler.startMonitoring();
    if (!startResult.success) {
      throw new Error('Failed to start monitoring');
    }

    // 2. 언어 설정
    await unifiedHandler.setLanguage('ko'); // 한국어 설정

    // 3. 실시간 통계 리스너 등록
    unifiedHandler.on('stats-updated', (stats) => {
      Logger.info('EXAMPLE', 'Real-time stats updated', {
        currentWpm: stats.currentWpm,
        totalKeystrokes: stats.totalKeystrokes,
        sessionDuration: stats.sessionDuration
      });
    });

    // 4. 윈도우 변경 리스너 등록
    unifiedHandler.on('window-changed', (windowInfo) => {
      Logger.info('EXAMPLE', 'Window changed', {
        title: windowInfo.title,
        processName: windowInfo.processName
      });
    });

    // 5. 세션 이벤트 리스너 등록
    unifiedHandler.on('session-started', (sessionInfo) => {
      Logger.info('EXAMPLE', 'New typing session started', sessionInfo);
    });

    unifiedHandler.on('session-ended', (sessionInfo) => {
      Logger.info('EXAMPLE', 'Typing session ended', {
        duration: sessionInfo.duration,
        wpm: sessionInfo.wpm,
        accuracy: sessionInfo.accuracy
      });
    });

    // 6. 10초 후 모니터링 중지
    setTimeout(async () => {
      await unifiedHandler.stopMonitoring();
      Logger.info('EXAMPLE', 'Keyboard monitoring demonstration completed');
    }, 10000);
  }
}

// 사용 예제
const example = new KeyboardEventExample();
example.demonstrateKeyboardEvents().catch(console.error);
```

### 4. 한글 조합 처리 예제

```typescript
// src/main/keyboard/examples/HangulExample.ts
import { HangulComposer } from '../HangulComposer';
import { Logger } from '../../../shared/logger';

export class HangulComposerExample {
  private composer: HangulComposer;

  constructor() {
    this.composer = new HangulComposer();
  }

  public demonstrateHangulComposition(): void {
    Logger.info('HANGUL_EXAMPLE', 'Starting Hangul composition demonstration');

    // 1. "안녕" 타이핑 시뮬레이션
    const characters = ['ㅇ', 'ㅏ', 'ㄴ', 'ㄴ', 'ㅕ', 'ㅇ'];
    let result = '';

    for (const char of characters) {
      const composition = this.composer.addCharacter(char);
      
      Logger.debug('HANGUL_EXAMPLE', 'Character added', {
        input: char,
        composing: composition.composing,
        completed: composition.completed
      });

      // 완성된 문자가 있으면 결과에 추가
      if (composition.completed) {
        result += composition.completed;
      }
    }

    // 마지막 조합 중인 문자도 추가
    const finalState = this.composer.getCurrentState();
    if (finalState.current) {
      result += finalState.current;
    }

    Logger.info('HANGUL_EXAMPLE', 'Final composition result', { result }); // "안녕"

    // 2. 상태 초기화
    this.composer.reset();

    // 3. 백스페이스 처리 예제
    this.demonstrateBackspaceHandling();
  }

  private demonstrateBackspaceHandling(): void {
    Logger.info('HANGUL_EXAMPLE', 'Demonstrating backspace handling');

    // "가나" 타이핑
    const chars = ['ㄱ', 'ㅏ', 'ㄴ', 'ㅏ'];
    for (const char of chars) {
      this.composer.addCharacter(char);
    }

    Logger.debug('HANGUL_EXAMPLE', 'Before backspace', {
      state: this.composer.getCurrentState()
    });

    // 백스페이스 처리
    const backspaceResult = this.composer.handleBackspace();
    
    Logger.info('HANGUL_EXAMPLE', 'Backspace result', {
      removed: backspaceResult.removed,
      remaining: backspaceResult.remaining,
      newState: this.composer.getCurrentState()
    });
  }

  public demonstrateRealTimeComposition(): void {
    Logger.info('HANGUL_EXAMPLE', 'Real-time composition demonstration');

    // 실제 키보드 입력 시뮬레이션
    const keySequence = [
      { key: 'ㅎ', delay: 100 },
      { key: 'ㅏ', delay: 150 },
      { key: 'ㄴ', delay: 120 },
      { key: 'ㄱ', delay: 180 },
      { key: 'ㅡ', delay: 110 },
      { key: 'ㄹ', delay: 140 }
    ];

    let index = 0;
    const processNext = (): void => {
      if (index >= keySequence.length) {
        const finalState = this.composer.getCurrentState();
        Logger.info('HANGUL_EXAMPLE', 'Real-time composition completed', {
          finalText: finalState.current || 'No text'
        });
        return;
      }

      const { key, delay } = keySequence[index];
      const result = this.composer.addCharacter(key);

      Logger.debug('HANGUL_EXAMPLE', 'Real-time input', {
        key,
        composing: result.composing,
        completed: result.completed
      });

      index++;
      setTimeout(processNext, delay);
    };

    processNext();
  }
}

// 사용 예제
const hangulExample = new HangulComposerExample();
hangulExample.demonstrateHangulComposition();
hangulExample.demonstrateRealTimeComposition();
```

## 📊 통계 및 분석 예제

### 5. 실시간 통계 처리

```typescript
// src/main/keyboard/examples/StatsExample.ts
import { StatsManager } from '../StatsManager';
import { Logger } from '../../../shared/logger';

export class StatsExample {
  private statsManager: StatsManager;

  constructor() {
    this.statsManager = new StatsManager();
  }

  public demonstrateStatsCalculation(): void {
    Logger.info('STATS_EXAMPLE', 'Starting statistics demonstration');

    // 1. 타이핑 이벤트 시뮬레이션
    this.simulateTypingSession();

    // 2. 실시간 통계 모니터링
    this.monitorRealtimeStats();

    // 3. 세션 통계 분석
    this.analyzeSessionStats();
  }

  private simulateTypingSession(): void {
    const startTime = Date.now();
    
    // 60초 동안 분당 60타의 속도로 타이핑 시뮬레이션
    const wpm = 60;
    const charactersPerMinute = wpm * 5; // 평균 단어 길이 5
    const intervalMs = 60000 / charactersPerMinute; // ~500ms per character

    let keyCount = 0;
    const maxKeys = 300; // 5분간 타이핑

    const typingInterval = setInterval(() => {
      // 키 입력 이벤트 생성
      const keyEvent = {
        keycode: 65 + (keyCount % 26), // A-Z 순환
        timestamp: Date.now(),
        windowTitle: 'Visual Studio Code',
        type: 'keydown' as const
      };

      this.statsManager.addKeystroke(keyEvent);
      keyCount++;

      // 가끔 백스페이스 (오타 시뮬레이션)
      if (Math.random() < 0.05) { // 5% 확률로 오타
        const backspaceEvent = {
          keycode: 8, // Backspace
          timestamp: Date.now() + 50,
          windowTitle: 'Visual Studio Code',
          type: 'keydown' as const
        };
        this.statsManager.addKeystroke(backspaceEvent);
      }

      if (keyCount >= maxKeys) {
        clearInterval(typingInterval);
        Logger.info('STATS_EXAMPLE', 'Typing simulation completed', {
          totalKeys: keyCount,
          duration: Date.now() - startTime
        });
      }
    }, intervalMs);
  }

  private monitorRealtimeStats(): void {
    const monitoringInterval = setInterval(() => {
      const stats = this.statsManager.getRealtimeStats();
      
      Logger.debug('STATS_EXAMPLE', 'Realtime stats', {
        currentWpm: stats.currentWpm,
        averageWpm: stats.averageWpm,
        totalKeystrokes: stats.totalKeystrokes,
        accuracy: stats.accuracy
      });

      // 통계가 충분히 수집되면 모니터링 중지
      if (stats.totalKeystrokes >= 300) {
        clearInterval(monitoringInterval);
        this.generateDetailedReport(stats);
      }
    }, 1000);
  }

  private analyzeSessionStats(): void {
    // 세션 종료 후 분석
    setTimeout(() => {
      const sessionStats = this.statsManager.calculateSessionStats();
      
      Logger.info('STATS_EXAMPLE', 'Session analysis completed', {
        totalDuration: sessionStats.sessionDuration,
        averageWpm: sessionStats.averageWpm,
        peakWpm: sessionStats.peakWpm,
        accuracy: sessionStats.accuracy,
        totalKeystrokes: sessionStats.totalKeystrokes,
        wordsTyped: Math.floor(sessionStats.totalKeystrokes / 5)
      });

      // 성능 등급 계산
      const grade = this.calculatePerformanceGrade(sessionStats.averageWpm);
      Logger.info('STATS_EXAMPLE', 'Performance grade', { grade });

    }, 10000); // 10초 후 분석
  }

  private generateDetailedReport(stats: RealtimeStats): void {
    const report = {
      timestamp: new Date().toISOString(),
      performance: {
        wpm: {
          current: stats.currentWpm,
          average: stats.averageWpm,
          trend: this.calculateWpmTrend()
        },
        accuracy: {
          current: stats.accuracy,
          trend: this.calculateAccuracyTrend()
        },
        keystroke: {
          total: stats.totalKeystrokes,
          rate: stats.totalKeystrokes / (stats.sessionDuration / 60) // per minute
        }
      },
      analysis: {
        consistency: this.calculateConsistency(),
        improvement: this.calculateImprovement(),
        recommendations: this.generateRecommendations(stats)
      }
    };

    Logger.info('STATS_EXAMPLE', 'Detailed performance report', report);
  }

  private calculatePerformanceGrade(wpm: number): string {
    if (wpm >= 80) return 'A+';
    if (wpm >= 70) return 'A';
    if (wpm >= 60) return 'B+';
    if (wpm >= 50) return 'B';
    if (wpm >= 40) return 'C+';
    if (wpm >= 30) return 'C';
    return 'D';
  }

  private calculateWpmTrend(): string {
    const history = this.statsManager.getWpmHistory();
    if (history.length < 2) return 'insufficient-data';
    
    const recent = history.slice(-5).reduce((sum, wpm) => sum + wpm, 0) / 5;
    const older = history.slice(-15, -5).reduce((sum, wpm) => sum + wpm, 0) / 10;
    
    if (recent > older * 1.1) return 'improving';
    if (recent < older * 0.9) return 'declining';
    return 'stable';
  }

  private calculateAccuracyTrend(): string {
    // 유사한 로직으로 정확도 트렌드 계산
    return 'stable';
  }

  private calculateConsistency(): number {
    const wpmHistory = this.statsManager.getWpmHistory();
    if (wpmHistory.length < 5) return 0;
    
    const mean = wpmHistory.reduce((sum, wpm) => sum + wpm, 0) / wpmHistory.length;
    const variance = wpmHistory.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmHistory.length;
    const standardDeviation = Math.sqrt(variance);
    
    // 일관성 점수 (0-100, 낮은 표준편차가 높은 점수)
    return Math.max(0, 100 - (standardDeviation / mean) * 100);
  }

  private calculateImprovement(): number {
    // 세션 시작 대비 개선도 계산
    const history = this.statsManager.getWpmHistory();
    if (history.length < 10) return 0;
    
    const initial = history.slice(0, 5).reduce((sum, wpm) => sum + wpm, 0) / 5;
    const final = history.slice(-5).reduce((sum, wpm) => sum + wpm, 0) / 5;
    
    return ((final - initial) / initial) * 100;
  }

  private generateRecommendations(stats: RealtimeStats): string[] {
    const recommendations: string[] = [];
    
    if (stats.accuracy < 95) {
      recommendations.push('Focus on accuracy - slow down to improve precision');
    }
    
    if (stats.currentWpm < 40) {
      recommendations.push('Practice touch typing to increase speed');
    }
    
    if (this.calculateConsistency() < 80) {
      recommendations.push('Work on maintaining consistent typing rhythm');
    }
    
    return recommendations;
  }
}

// 사용 예제
const statsExample = new StatsExample();
statsExample.demonstrateStatsCalculation();
```

## 🪟 윈도우 추적 예제

### 6. 윈도우 변경 감지 및 세션 관리

```typescript
// src/main/keyboard/examples/WindowTrackingExample.ts
import { WindowTracker } from '../WindowTracker';
import { Logger } from '../../../shared/logger';

export class WindowTrackingExample {
  private windowTracker: WindowTracker;

  constructor() {
    this.windowTracker = new WindowTracker();
  }

  public async demonstrateWindowTracking(): Promise<void> {
    Logger.info('WINDOW_EXAMPLE', 'Starting window tracking demonstration');

    // 1. 윈도우 추적 시작
    const result = await this.windowTracker.start();
    if (!result.success) {
      throw new Error('Failed to start window tracking');
    }

    // 2. 이벤트 리스너 등록
    this.setupEventListeners();

    // 3. 현재 윈도우 정보 조회
    await this.getCurrentWindowInfo();

    // 4. 윈도우 히스토리 분석
    this.analyzeWindowHistory();

    // 5. 생산성 분석
    this.analyzeProductivity();

    // 6. 30초 후 추적 중지
    setTimeout(async () => {
      await this.windowTracker.stop();
      Logger.info('WINDOW_EXAMPLE', 'Window tracking demonstration completed');
    }, 30000);
  }

  private setupEventListeners(): void {
    // 윈도우 변경 이벤트
    this.windowTracker.on('window-changed', (event) => {
      Logger.info('WINDOW_EXAMPLE', 'Window changed', {
        from: event.previous?.title || 'Unknown',
        to: event.current.title,
        processName: event.current.owner.name,
        changeType: event.changeType
      });
    });

    // 윈도우 포커스 이벤트
    this.windowTracker.on('window-focused', (windowInfo) => {
      Logger.debug('WINDOW_EXAMPLE', 'Window focused', {
        title: windowInfo.title,
        process: windowInfo.owner.name
      });
    });

    // 세션 시작 이벤트
    this.windowTracker.on('session-started', (sessionInfo) => {
      Logger.info('WINDOW_EXAMPLE', 'New window session started', {
        windowTitle: sessionInfo.windowInfo.title,
        sessionId: sessionInfo.sessionId
      });
    });

    // 세션 종료 이벤트
    this.windowTracker.on('session-ended', (sessionInfo) => {
      Logger.info('WINDOW_EXAMPLE', 'Window session ended', {
        windowTitle: sessionInfo.windowInfo.title,
        duration: sessionInfo.duration,
        sessionId: sessionInfo.sessionId
      });
    });
  }

  private async getCurrentWindowInfo(): Promise<void> {
    const currentWindow = this.windowTracker.getCurrentWindow();
    
    if (currentWindow) {
      Logger.info('WINDOW_EXAMPLE', 'Current window info', {
        title: currentWindow.title,
        processName: currentWindow.owner.name,
        pid: currentWindow.owner.processId,
        bounds: currentWindow.bounds
      });
    } else {
      Logger.warn('WINDOW_EXAMPLE', 'No active window found');
    }
  }

  private analyzeWindowHistory(): void {
    // 5초마다 히스토리 분석
    const analysisInterval = setInterval(() => {
      const history = this.windowTracker.getWindowHistory();
      const stats = this.windowTracker.getTrackingStats();

      Logger.debug('WINDOW_EXAMPLE', 'Window tracking analysis', {
        totalWindows: history.length,
        totalSwitches: stats.totalSwitches,
        averageSessionDuration: stats.averageSessionDuration,
        mostUsedApp: this.findMostUsedApp(history)
      });

      // 30초 후 분석 중지
      if (stats.totalSwitches >= 5) {
        clearInterval(analysisInterval);
      }
    }, 5000);
  }

  private findMostUsedApp(history: WindowInfo[]): string {
    const appCounts = new Map<string, number>();
    
    for (const window of history) {
      const appName = window.owner.name;
      appCounts.set(appName, (appCounts.get(appName) || 0) + 1);
    }

    let mostUsedApp = '';
    let maxCount = 0;
    
    for (const [app, count] of appCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostUsedApp = app;
      }
    }

    return mostUsedApp;
  }

  private analyzeProductivity(): void {
    // 10초마다 생산성 분석
    const productivityInterval = setInterval(() => {
      const sessions = this.windowTracker.getActiveSessions();
      const productivityScore = this.calculateProductivityScore(sessions);

      Logger.info('WINDOW_EXAMPLE', 'Productivity analysis', {
        activeSessions: sessions.length,
        productivityScore,
        recommendation: this.getProductivityRecommendation(productivityScore)
      });

    }, 10000);

    // 30초 후 분석 중지
    setTimeout(() => {
      clearInterval(productivityInterval);
    }, 30000);
  }

  private calculateProductivityScore(sessions: any[]): number {
    if (sessions.length === 0) return 0;

    let totalScore = 0;
    let totalDuration = 0;

    for (const session of sessions) {
      const appName = session.windowInfo.owner.name.toLowerCase();
      const duration = session.duration || 0;
      
      // 앱별 생산성 점수 (0-100)
      let appScore = 50; // 기본값
      
      if (this.isProductiveApp(appName)) {
        appScore = 80;
      } else if (this.isNeutralApp(appName)) {
        appScore = 50;
      } else if (this.isDistractingApp(appName)) {
        appScore = 20;
      }

      totalScore += appScore * duration;
      totalDuration += duration;
    }

    return totalDuration > 0 ? totalScore / totalDuration : 0;
  }

  private isProductiveApp(appName: string): boolean {
    const productiveApps = [
      'code', 'vscode', 'visual studio',
      'xcode', 'intellij', 'webstorm',
      'notion', 'obsidian', 'todoist',
      'figma', 'sketch', 'photoshop'
    ];
    
    return productiveApps.some(app => appName.includes(app));
  }

  private isNeutralApp(appName: string): boolean {
    const neutralApps = [
      'finder', 'explorer', 'terminal',
      'chrome', 'firefox', 'safari',
      'mail', 'calendar', 'notes'
    ];
    
    return neutralApps.some(app => appName.includes(app));
  }

  private isDistractingApp(appName: string): boolean {
    const distractingApps = [
      'facebook', 'twitter', 'instagram',
      'youtube', 'netflix', 'spotify',
      'games', 'discord', 'slack'
    ];
    
    return distractingApps.some(app => appName.includes(app));
  }

  private getProductivityRecommendation(score: number): string {
    if (score >= 70) {
      return 'Excellent focus! Keep up the productive work.';
    } else if (score >= 50) {
      return 'Good productivity. Consider minimizing distracting apps.';
    } else if (score >= 30) {
      return 'Room for improvement. Try to focus on productive tasks.';
    } else {
      return 'Low productivity detected. Consider taking a break or refocusing.';
    }
  }
}

// 사용 예제
const windowExample = new WindowTrackingExample();
windowExample.demonstrateWindowTracking().catch(console.error);
```

## 🔧 통합 예제

### 7. 전체 시스템 통합 데모

```typescript
// src/main/examples/FullSystemDemo.ts
import { unifiedHandler } from '../keyboard/UnifiedHandler';
import { Logger } from '../../shared/logger';

export class FullSystemDemo {
  public async runCompleteDemo(): Promise<void> {
    Logger.info('FULL_DEMO', 'Starting complete system demonstration');

    try {
      // 1. 시스템 초기화
      await this.initializeSystem();

      // 2. 5분간 모니터링 세션 실행
      await this.runMonitoringSession();

      // 3. 결과 분석 및 리포트
      await this.generateFinalReport();

    } catch (error) {
      Logger.error('FULL_DEMO', 'Demo failed', error);
    } finally {
      await this.cleanup();
    }
  }

  private async initializeSystem(): Promise<void> {
    Logger.info('FULL_DEMO', 'Initializing unified handler');
    
    const result = await unifiedHandler.initialize();
    if (!result.success) {
      throw new Error(`Initialization failed: ${result.error}`);
    }

    // 한국어 설정
    await unifiedHandler.setLanguage('ko');
    
    Logger.info('FULL_DEMO', 'System initialized successfully');
  }

  private async runMonitoringSession(): Promise<void> {
    Logger.info('FULL_DEMO', 'Starting 5-minute monitoring session');

    // 모니터링 시작
    await unifiedHandler.startMonitoring();

    // 진행상황 리포터 설정
    const progressInterval = setInterval(() => {
      const stats = unifiedHandler.getRealtimeStats();
      const currentWindow = unifiedHandler.getCurrentWindow();

      Logger.info('FULL_DEMO', 'Session progress', {
        duration: `${Math.floor(stats.sessionDuration / 60)}:${String(Math.floor(stats.sessionDuration % 60)).padStart(2, '0')}`,
        wpm: stats.currentWpm,
        totalKeys: stats.totalKeystrokes,
        currentApp: currentWindow?.processName || 'Unknown'
      });
    }, 30000); // 30초마다 진행상황 출력

    // 5분 대기
    await new Promise(resolve => setTimeout(resolve, 300000));

    clearInterval(progressInterval);
    
    // 모니터링 중지
    await unifiedHandler.stopMonitoring();
    
    Logger.info('FULL_DEMO', 'Monitoring session completed');
  }

  private async generateFinalReport(): Promise<void> {
    Logger.info('FULL_DEMO', 'Generating final report');

    const finalStats = unifiedHandler.getRealtimeStats();
    const windowHistory = unifiedHandler.getWindowHistory();
    const healthCheck = await unifiedHandler.getHealthStatus();

    const report = {
      sessionSummary: {
        totalDuration: finalStats.sessionDuration,
        totalKeystrokes: finalStats.totalKeystrokes,
        averageWpm: finalStats.averageWpm,
        peakWpm: Math.max(...this.getWpmHistory()),
        accuracy: finalStats.accuracy
      },
      windowActivity: {
        totalWindows: windowHistory.length,
        mostUsedApp: this.findMostUsedApp(windowHistory),
        appSwitches: this.countAppSwitches(windowHistory)
      },
      systemHealth: {
        status: healthCheck.status,
        uptime: healthCheck.uptime,
        memoryUsage: healthCheck.memoryUsage,
        eventProcessingRate: healthCheck.eventProcessingRate
      },
      insights: this.generateInsights(finalStats, windowHistory)
    };

    Logger.info('FULL_DEMO', 'Final session report', report);

    // 리포트를 파일로 저장 (옵션)
    await this.saveReportToFile(report);
  }

  private getWpmHistory(): number[] {
    // StatsManager에서 WPM 히스토리 가져오기
    // 실제 구현에서는 unifiedHandler를 통해 접근
    return []; // 플레이스홀더
  }

  private findMostUsedApp(windowHistory: any[]): string {
    const appCounts = new Map<string, number>();
    
    for (const window of windowHistory) {
      const appName = window.processName;
      appCounts.set(appName, (appCounts.get(appName) || 0) + 1);
    }

    let mostUsedApp = '';
    let maxCount = 0;
    
    for (const [app, count] of appCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostUsedApp = app;
      }
    }

    return mostUsedApp;
  }

  private countAppSwitches(windowHistory: any[]): number {
    let switches = 0;
    for (let i = 1; i < windowHistory.length; i++) {
      if (windowHistory[i].processName !== windowHistory[i-1].processName) {
        switches++;
      }
    }
    return switches;
  }

  private generateInsights(stats: any, windowHistory: any[]): string[] {
    const insights: string[] = [];

    // WPM 분석
    if (stats.averageWpm >= 60) {
      insights.push('Excellent typing speed! You\'re in the top 20% of typists.');
    } else if (stats.averageWpm >= 40) {
      insights.push('Good typing speed. With practice, you can reach professional levels.');
    } else {
      insights.push('Consider practicing touch typing to improve your speed.');
    }

    // 정확도 분석
    if (stats.accuracy >= 95) {
      insights.push('Outstanding accuracy! You make very few mistakes.');
    } else if (stats.accuracy >= 90) {
      insights.push('Good accuracy. Focus on maintaining precision as you increase speed.');
    } else {
      insights.push('Work on improving accuracy before focusing on speed.');
    }

    // 앱 사용 패턴 분석
    const uniqueApps = new Set(windowHistory.map(w => w.processName)).size;
    if (uniqueApps >= 5) {
      insights.push('You multitask across many applications. Consider focusing on fewer tasks for better productivity.');
    } else if (uniqueApps <= 2) {
      insights.push('You show good focus by working primarily in a few applications.');
    }

    return insights;
  }

  private async saveReportToFile(report: any): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const os = await import('os');

      const reportPath = path.join(os.homedir(), 'loop-session-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      
      Logger.info('FULL_DEMO', 'Report saved to file', { reportPath });
    } catch (error) {
      Logger.error('FULL_DEMO', 'Failed to save report', error);
    }
  }

  private async cleanup(): Promise<void> {
    Logger.info('FULL_DEMO', 'Cleaning up demo');
    
    try {
      await unifiedHandler.cleanup();
      Logger.info('FULL_DEMO', 'Demo cleanup completed');
    } catch (error) {
      Logger.error('FULL_DEMO', 'Error during cleanup', error);
    }
  }
}

// 사용 예제
const demo = new FullSystemDemo();
demo.runCompleteDemo().catch(console.error);
```

---

**🔥 이 예제들은 Loop 애플리케이션의 모든 핵심 기능을 실제 사용 시나리오에서 어떻게 활용하는지 보여주는 완전한 가이드입니다.**
