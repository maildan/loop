# StatsManager API 가이드

## 개요

StatsManager는 Loop Typing Analytics의 통계 관리 시스템으로, 타이핑 세션의 모든 통계 데이터를 실시간으로 수집, 분석, 저장하는 역할을 담당합니다.

## 주요 기능

- 📊 **실시간 통계**: WPM, 정확도, 키스트로크 등 실시간 분석
- 🎯 **세션 관리**: 타이핑 세션별 데이터 추적
- 📈 **성능 지표**: 평균, 최고, 트렌드 분석
- 💾 **데이터 지속성**: 통계 데이터 저장 및 복원

## API 레퍼런스

### StatsManager 클래스

```typescript
import { StatsManager } from '../main/keyboard/StatsManager';

const statsManager = new StatsManager();
```

#### 생명주기 메서드

##### `initialize()`

StatsManager를 초기화합니다.

```typescript
await statsManager.initialize();
```

**반환값**: `Promise<void>`

##### `start()`

통계 수집을 시작합니다.

```typescript
await statsManager.start();
```

**반환값**: `Promise<void>`

##### `stop()`

통계 수집을 중지합니다.

```typescript
await statsManager.stop();
```

**반환값**: `Promise<void>`

#### 세션 관리

##### `startSession()`

새로운 타이핑 세션을 시작합니다.

```typescript
const session: TypingSession = {
  id: 'session-123',
  content: '',
  startTime: new Date(),
  endTime: new Date(),
  keyCount: 0,
  wpm: 0,
  accuracy: 100,
  language: 'korean',
  windowTitle: 'Visual Studio Code'
};

const result = await statsManager.startSession(session);
console.log(result.success); // true
```

**매개변수**:
- `session: TypingSession` - 세션 정보

**반환값**: `Promise<Result<void>>`

##### `endSession()`

현재 세션을 종료합니다.

```typescript
const session: TypingSession = {
  id: 'session-123',
  // ... 세션 정보
};

const result = await statsManager.endSession(session);
console.log(result.data); // TypingStats
```

**매개변수**:
- `session: TypingSession` - 종료할 세션 정보

**반환값**: `Promise<Result<TypingStats>>`

##### `processKeyEvent()`

키보드 이벤트를 처리하여 통계를 업데이트합니다.

```typescript
const keyEvent: KeyboardEvent = {
  key: 'a',
  code: 'KeyA',
  keychar: 'a',
  timestamp: Date.now(),
  windowTitle: 'Visual Studio Code',
  type: 'keydown'
};

await statsManager.processKeyEvent(keyEvent);
```

**매개변수**:
- `event: KeyboardEvent` - 키보드 이벤트

**반환값**: `Promise<void>`

#### 통계 조회

##### `getCurrentStats()`

현재 세션의 통계를 반환합니다.

```typescript
const result = await statsManager.getCurrentStats();
console.log(result.data);
// {
//   totalKeystrokes: 1250,
//   wpm: 65,
//   accuracy: 96.5,
//   sessionDuration: 3600000,
//   charactersTyped: 5000
// }
```

**반환값**: `Promise<Result<TypingStats>>`

##### `getRealtimeStats()`

실시간 통계를 반환합니다.

```typescript
const realtimeStats = statsManager.getRealtimeStats();
console.log(realtimeStats);
// {
//   currentWpm: 68,
//   currentAccuracy: 97.2,
//   keystrokesPerMinute: 340,
//   sessionProgress: 45,
//   peakWpm: 78,
//   averageWpm: 62
// }
```

**반환값**: `RealtimeStats`

##### `getTotalKeystrokes()`

총 키스트로크 수를 반환합니다.

```typescript
const totalKeystrokes = statsManager.getTotalKeystrokes();
console.log(totalKeystrokes); // 15420
```

**반환값**: `number`

##### `getSessionDuration()`

현재 세션의 지속 시간을 반환합니다.

```typescript
const duration = statsManager.getSessionDuration();
console.log(duration); // 3600000 (밀리초)
```

**반환값**: `number`

##### `getStatsState()`

통계 관리자의 상태를 반환합니다.

```typescript
const state = statsManager.getStatsState();
console.log(state);
// {
//   currentStats: { ... },
//   sessionStats: Map(...),
//   isCollecting: true,
//   lastUpdate: Date(...),
//   totalSessions: 5
// }
```

**반환값**: `StatsManagerState`

##### `healthCheck()`

시스템 헬스 체크를 수행합니다.

```typescript
const health = await statsManager.healthCheck();
console.log(health);
// {
//   healthy: true,
//   uptime: 3600000,
//   collecting: true,
//   totalSessions: 5,
//   currentWpm: 65
// }
```

**반환값**: `Promise<HealthCheckResult>`

## 이벤트

StatsManager는 EventEmitter를 확장하여 다음 이벤트를 발생시킵니다:

### `session-started`

새 세션이 시작될 때 발생합니다.

```typescript
statsManager.on('session-started', (session: TypingSession) => {
  console.log('Session started:', session.id);
});
```

### `session-ended`

세션이 종료될 때 발생합니다.

```typescript
statsManager.on('session-ended', (stats: TypingStats) => {
  console.log(`Session ended: WPM ${stats.wpm}, Accuracy ${stats.accuracy}%`);
});
```

### `stats-updated`

통계가 업데이트될 때 발생합니다.

```typescript
statsManager.on('stats-updated', (stats: TypingStats) => {
  console.log('Stats updated:', stats);
});
```

### `milestone-reached`

특정 이정표에 도달했을 때 발생합니다.

```typescript
statsManager.on('milestone-reached', (milestone: StatsMilestone) => {
  console.log(`Milestone reached: ${milestone.type} - ${milestone.value}`);
});
```

## 타입 정의

### TypingStats

```typescript
interface TypingStats {
  totalKeystrokes: number;     // 총 키스트로크 수
  wpm: number;                 // Words Per Minute
  accuracy: number;            // 정확도 (%)
  sessionDuration: number;     // 세션 지속 시간 (밀리초)
  charactersTyped: number;     // 타이핑한 문자 수
}
```

### RealtimeStats

```typescript
interface RealtimeStats {
  currentWpm: number;          // 현재 WPM
  currentAccuracy: number;     // 현재 정확도
  keystrokesPerMinute: number; // 분당 키스트로크
  sessionProgress: number;     // 세션 진행률 (%)
  peakWpm: number;            // 최고 WPM
  averageWpm: number;         // 평균 WPM
}
```

### StatsManagerState

```typescript
interface StatsManagerState {
  currentStats: TypingStats;              // 현재 통계
  sessionStats: Map<string, TypingStats>; // 세션별 통계
  isCollecting: boolean;                  // 수집 중 여부
  lastUpdate: Date | null;                // 마지막 업데이트 시간
  totalSessions: number;                  // 총 세션 수
}
```

### StatsMilestone

```typescript
interface StatsMilestone {
  type: 'wpm' | 'accuracy' | 'keystrokes' | 'session';
  value: number;
  description: string;
  achievedAt: Date;
}
```

## 사용 예제

### 기본 사용법

```typescript
import { StatsManager } from '../main/keyboard/StatsManager';

const statsManager = new StatsManager();

// 초기화 및 시작
await statsManager.initialize();
await statsManager.start();

// 세션 시작
const session: TypingSession = {
  id: `session-${Date.now()}`,
  content: '',
  startTime: new Date(),
  endTime: new Date(),
  keyCount: 0,
  wpm: 0,
  accuracy: 100,
  language: 'korean',
  windowTitle: 'Visual Studio Code'
};

await statsManager.startSession(session);

// 실시간 통계 모니터링
const monitoringInterval = setInterval(() => {
  const stats = statsManager.getRealtimeStats();
  console.log(`WPM: ${stats.currentWpm}, Accuracy: ${stats.currentAccuracy}%`);
}, 1000);

// 세션 종료
setTimeout(async () => {
  clearInterval(monitoringInterval);
  const result = await statsManager.endSession(session);
  console.log('Final stats:', result.data);
}, 30000); // 30초 후 종료
```

### 키보드 이벤트 처리

```typescript
import { StatsManager } from '../main/keyboard/StatsManager';
import { KeyboardEvent } from '../shared/types';

const statsManager = new StatsManager();

// 키보드 이벤트 시뮬레이션
const simulateTyping = async () => {
  const text = 'Hello, World!';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const event: KeyboardEvent = {
      key: char,
      code: `Key${char.toUpperCase()}`,
      keychar: char,
      timestamp: Date.now(),
      windowTitle: 'Text Editor',
      type: 'keydown'
    };
    
    await statsManager.processKeyEvent(event);
    
    // 실제 타이핑 속도 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  }
};

// 타이핑 시뮬레이션 실행
await simulateTyping();
```

### 성능 분석

```typescript
import { StatsManager } from '../main/keyboard/StatsManager';

const statsManager = new StatsManager();

// 성능 분석 대시보드
const createPerformanceDashboard = () => {
  setInterval(async () => {
    const currentStats = await statsManager.getCurrentStats();
    const realtimeStats = statsManager.getRealtimeStats();
    const state = statsManager.getStatsState();
    
    console.clear();
    console.log('=== Loop Typing Analytics Dashboard ===');
    console.log(`Current WPM: ${realtimeStats.currentWpm}`);
    console.log(`Peak WPM: ${realtimeStats.peakWpm}`);
    console.log(`Average WPM: ${realtimeStats.averageWpm}`);
    console.log(`Accuracy: ${realtimeStats.currentAccuracy.toFixed(1)}%`);
    console.log(`Total Keystrokes: ${statsManager.getTotalKeystrokes()}`);
    console.log(`Session Duration: ${Math.floor(statsManager.getSessionDuration() / 1000)}s`);
    console.log(`Total Sessions: ${state.totalSessions}`);
    console.log('=====================================');
  }, 1000);
};

// 대시보드 시작
createPerformanceDashboard();
```

### 세션별 통계 비교

```typescript
import { StatsManager } from '../main/keyboard/StatsManager';

const statsManager = new StatsManager();

// 세션 통계 분석
const analyzeSessionPerformance = () => {
  const sessionHistory: TypingStats[] = [];
  
  statsManager.on('session-ended', (stats: TypingStats) => {
    sessionHistory.push(stats);
    
    if (sessionHistory.length >= 2) {
      const current = sessionHistory[sessionHistory.length - 1];
      const previous = sessionHistory[sessionHistory.length - 2];
      
      const wpmImprovement = current.wpm - previous.wpm;
      const accuracyImprovement = current.accuracy - previous.accuracy;
      
      console.log(`Performance Comparison:`);
      console.log(`WPM: ${wpmImprovement >= 0 ? '+' : ''}${wpmImprovement.toFixed(1)}`);
      console.log(`Accuracy: ${accuracyImprovement >= 0 ? '+' : ''}${accuracyImprovement.toFixed(1)}%`);
      
      // 개선 사항 제안
      if (wpmImprovement < 0) {
        console.log('💡 Tip: Focus on consistency over speed');
      }
      if (accuracyImprovement < 0) {
        console.log('💡 Tip: Slow down and focus on accuracy');
      }
    }
  });
};

// 분석 시작
analyzeSessionPerformance();
```

### 이정표 추적

```typescript
import { StatsManager } from '../main/keyboard/StatsManager';

const statsManager = new StatsManager();

// 이정표 정의
const milestones = [
  { type: 'wpm', value: 30, description: 'Beginner typist' },
  { type: 'wpm', value: 50, description: 'Average typist' },
  { type: 'wpm', value: 70, description: 'Good typist' },
  { type: 'wpm', value: 90, description: 'Excellent typist' },
  { type: 'accuracy', value: 95, description: 'High accuracy' },
  { type: 'accuracy', value: 98, description: 'Very high accuracy' },
  { type: 'keystrokes', value: 1000, description: '1K keystrokes' },
  { type: 'keystrokes', value: 10000, description: '10K keystrokes' },
];

const achievedMilestones = new Set<string>();

// 이정표 체크
const checkMilestones = () => {
  setInterval(() => {
    const realtimeStats = statsManager.getRealtimeStats();
    const totalKeystrokes = statsManager.getTotalKeystrokes();
    
    milestones.forEach(milestone => {
      const key = `${milestone.type}-${milestone.value}`;
      
      if (achievedMilestones.has(key)) return;
      
      let achieved = false;
      
      switch (milestone.type) {
        case 'wpm':
          achieved = realtimeStats.currentWpm >= milestone.value;
          break;
        case 'accuracy':
          achieved = realtimeStats.currentAccuracy >= milestone.value;
          break;
        case 'keystrokes':
          achieved = totalKeystrokes >= milestone.value;
          break;
      }
      
      if (achieved) {
        achievedMilestones.add(key);
        console.log(`🎉 Milestone achieved: ${milestone.description}`);
        
        // 이정표 이벤트 발생
        statsManager.emit('milestone-reached', {
          ...milestone,
          achievedAt: new Date()
        });
      }
    });
  }, 1000);
};

// 이정표 추적 시작
checkMilestones();
```

## 성능 최적화

### 메모리 관리

```typescript
// 주기적으로 오래된 세션 데이터 정리
setInterval(() => {
  const state = statsManager.getStatsState();
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  
  // 1시간 이전 세션 데이터 정리
  for (const [sessionId, stats] of state.sessionStats) {
    if (stats.sessionDuration && stats.sessionDuration < oneHourAgo) {
      state.sessionStats.delete(sessionId);
    }
  }
}, 30 * 60 * 1000); // 30분마다 정리
```

### 배치 처리

```typescript
// 키 이벤트 배치 처리로 성능 향상
class BatchProcessor {
  private eventQueue: KeyboardEvent[] = [];
  private batchSize = 10;
  private batchTimeout = 100; // ms
  
  constructor(private statsManager: StatsManager) {
    this.processBatch = this.processBatch.bind(this);
  }
  
  addEvent(event: KeyboardEvent): void {
    this.eventQueue.push(event);
    
    if (this.eventQueue.length >= this.batchSize) {
      this.processBatch();
    } else {
      setTimeout(this.processBatch, this.batchTimeout);
    }
  }
  
  private async processBatch(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    
    const batch = this.eventQueue.splice(0, this.batchSize);
    
    for (const event of batch) {
      await this.statsManager.processKeyEvent(event);
    }
  }
}

const batchProcessor = new BatchProcessor(statsManager);
```

## 문제 해결

### 통계 데이터 검증

```typescript
// 통계 데이터 무결성 검사
const validateStats = async () => {
  const stats = await statsManager.getCurrentStats();
  
  // 기본 검증
  if (stats.data) {
    const { wpm, accuracy, totalKeystrokes } = stats.data;
    
    if (wpm < 0 || wpm > 300) {
      console.warn('Invalid WPM value:', wpm);
    }
    
    if (accuracy < 0 || accuracy > 100) {
      console.warn('Invalid accuracy value:', accuracy);
    }
    
    if (totalKeystrokes < 0) {
      console.warn('Invalid keystroke count:', totalKeystrokes);
    }
  }
};

// 주기적으로 검증 실행
setInterval(validateStats, 5000);
```

### 디버깅 도구

```typescript
// 통계 디버깅 도구
const enableStatsDebugging = () => {
  statsManager.on('stats-updated', (stats) => {
    console.debug('Stats updated:', {
      timestamp: new Date().toISOString(),
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      keystrokes: stats.totalKeystrokes
    });
  });
  
  // 헬스 체크
  setInterval(async () => {
    const health = await statsManager.healthCheck();
    if (!health.healthy) {
      console.error('StatsManager health check failed:', health);
    }
  }, 10000);
};

// 디버깅 활성화
if (process.env.NODE_ENV === 'development') {
  enableStatsDebugging();
}
```

## 관련 문서

- [UnifiedHandler API](./unified-handler.md)
- [KeyboardEngine API](./keyboard-engine.md)
- [DatabaseManager API](./database-manager.md)
- [Types Reference](./types.md)
- [Architecture](./architecture.md)
