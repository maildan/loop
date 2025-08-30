# UnifiedHandler API 가이드

## 개요

UnifiedHandler는 Loop Typing Analytics의 핵심 도메인 서비스로, 모든 키보드 관련 기능을 통합하여 관리하는 Facade 패턴 구현체입니다. 키보드 엔진, 통계 관리자, 한글 조합기, 윈도우 트래커를 하나의 인터페이스로 제공합니다.

## 주요 기능

- 🎯 **통합 인터페이스**: 모든 키보드 기능을 단일 API로 제공
- 🔄 **핸들러 체인**: 우선순위 기반 이벤트 처리
- 📊 **실시간 통계**: 타이핑 분석 및 통계 제공
- 🇰🇷 **한글 지원**: 완벽한 한글 조합 처리
- 🪟 **윈도우 추적**: 컨텍스트별 타이핑 분석

## API 레퍼런스

### UnifiedHandler 클래스

```typescript
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';

const unifiedHandler = new UnifiedHandler();
```

#### 생명주기 메서드

##### `initialize()`

UnifiedHandler와 모든 하위 시스템을 초기화합니다.

```typescript
await unifiedHandler.initialize();
```

**반환값**: `Promise<void>`

##### `start()`

키보드 모니터링을 시작합니다.

```typescript
await unifiedHandler.start();
```

**반환값**: `Promise<void>`

##### `stop()`

키보드 모니터링을 중지합니다.

```typescript
await unifiedHandler.stop();
```

**반환값**: `Promise<void>`

#### 핸들러 관리

##### `registerHandler()`

새로운 이벤트 핸들러를 등록합니다.

```typescript
unifiedHandler.registerHandler('my-handler', {
  name: 'my-handler',
  type: 'processor',
  priority: 10,
  active: true,
  handler: async (event) => {
    // 이벤트 처리 로직
    return event;
  }
});
```

**매개변수**:
- `name: string` - 핸들러 식별자
- `handlerInfo: HandlerInfo` - 핸들러 정보

**반환값**: `boolean`

##### `unregisterHandler()`

핸들러를 제거합니다.

```typescript
const removed = unifiedHandler.unregisterHandler('my-handler');
```

**매개변수**:
- `name: string` - 핸들러 식별자

**반환값**: `boolean`

##### `toggleHandler()`

핸들러를 활성화/비활성화합니다.

```typescript
unifiedHandler.toggleHandler('my-handler', false); // 비활성화
```

**매개변수**:
- `name: string` - 핸들러 식별자
- `active: boolean` - 활성화 여부

**반환값**: `boolean`

#### 통계 및 상태

##### `getStats()`

통합 통계 정보를 반환합니다.

```typescript
const stats = await unifiedHandler.getStats();
console.log(stats.data);
// {
//   keyboard: { ... },
//   statistics: { ... },
//   handler: { ... },
//   activeHandlers: ['keyboard-processor', 'stats-analyzer']
// }
```

**반환값**: `Promise<Result<UnifiedStats>>`

##### `getRealtimeStats()`

실시간 통계를 반환합니다.

```typescript
const realtimeStats = unifiedHandler.getRealtimeStats();
console.log(realtimeStats);
// {
//   currentWpm: 65,
//   averageWpm: 58,
//   peakWpm: 89,
//   totalKeystrokes: 15420,
//   accuracy: 96.5,
//   sessionDuration: 3600000
// }
```

**반환값**: 실시간 통계 객체

##### `getCurrentWindow()`

현재 활성 윈도우 정보를 반환합니다.

```typescript
const windowInfo = unifiedHandler.getCurrentWindow();
console.log(windowInfo);
// {
//   title: "Visual Studio Code",
//   processName: "code",
//   pid: 12345
// }
```

**반환값**: `WindowInfo | null`

##### `getWindowHistory()`

윈도우 히스토리를 반환합니다.

```typescript
const history = unifiedHandler.getWindowHistory();
console.log(history); // WindowInfo[]
```

**반환값**: `WindowInfo[]`

##### `healthCheck()`

시스템 헬스 체크를 수행합니다.

```typescript
const health = await unifiedHandler.healthCheck();
console.log(health);
// {
//   healthy: true,
//   uptime: 3600000,
//   subsystems: {
//     keyboardEngine: { healthy: true, ... },
//     statsManager: { healthy: true, ... },
//     hangulComposer: { healthy: true, ... },
//     windowTracker: { healthy: true, ... }
//   },
//   handlerStats: { ... }
// }
```

**반환값**: `Promise<HealthCheckResult>`

## 이벤트

UnifiedHandler는 EventEmitter를 확장하여 다음 이벤트를 발생시킵니다:

### `event-processed`

키보드 이벤트가 처리된 후 발생합니다.

```typescript
unifiedHandler.on('event-processed', (event: KeyboardEvent) => {
  console.log('Event processed:', event);
});
```

### `handler-registered`

새 핸들러가 등록될 때 발생합니다.

```typescript
unifiedHandler.on('handler-registered', (name: string) => {
  console.log('Handler registered:', name);
});
```

### `handler-unregistered`

핸들러가 제거될 때 발생합니다.

```typescript
unifiedHandler.on('handler-unregistered', (name: string) => {
  console.log('Handler unregistered:', name);
});
```

### `stats-updated`

통계가 업데이트될 때 발생합니다.

```typescript
unifiedHandler.on('stats-updated', (stats: UnifiedStats) => {
  console.log('Stats updated:', stats);
});
```

## 타입 정의

### HandlerInfo

```typescript
interface HandlerInfo {
  name: string;                    // 핸들러 이름
  type: 'processor' | 'analyzer' | 'filter' | 'composer'; // 핸들러 타입
  priority: number;                // 우선순위 (낮을수록 먼저 실행)
  active: boolean;                 // 활성화 여부
  handler: (event: KeyboardEvent) => Promise<KeyboardEvent | null>; // 핸들러 함수
}
```

### UnifiedHandlerState

```typescript
interface UnifiedHandlerState {
  isActive: boolean;              // 활성 상태
  activeHandlers: string[];       // 활성 핸들러 목록
  lastActivity: Date | null;      // 마지막 활동 시간
  totalProcessedEvents: number;   // 총 처리된 이벤트 수
  errors: number;                 // 에러 수
}
```

### UnifiedStats

```typescript
interface UnifiedStats {
  keyboard: unknown;              // 키보드 상태
  statistics: unknown;            // 통계 데이터
  handler: UnifiedHandlerState;   // 핸들러 상태
  activeHandlers: string[];       // 활성 핸들러 목록
}
```

## 사용 예제

### 기본 사용법

```typescript
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';

const unifiedHandler = new UnifiedHandler();

// 초기화 및 시작
await unifiedHandler.initialize();
await unifiedHandler.start();

// 실시간 통계 모니터링
setInterval(() => {
  const stats = unifiedHandler.getRealtimeStats();
  console.log(`WPM: ${stats.currentWpm}, Accuracy: ${stats.accuracy}%`);
}, 1000);

// 정리
await unifiedHandler.stop();
```

### 커스텀 핸들러 등록

```typescript
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';
import { KeyboardEvent } from '../shared/types';

const unifiedHandler = new UnifiedHandler();

// 키로거 핸들러 등록
unifiedHandler.registerHandler('keylogger', {
  name: 'keylogger',
  type: 'processor',
  priority: 1, // 높은 우선순위
  active: true,
  handler: async (event: KeyboardEvent) => {
    console.log(`Key pressed: ${event.key} at ${event.timestamp}`);
    return event; // 이벤트를 다음 핸들러로 전달
  }
});

// 스팸 필터 핸들러 등록
unifiedHandler.registerHandler('spam-filter', {
  name: 'spam-filter',
  type: 'filter',
  priority: 5,
  active: true,
  handler: async (event: KeyboardEvent) => {
    // 너무 빠른 키 입력 필터링
    const now = Date.now();
    const timeDiff = now - (event.timestamp || 0);
    
    if (timeDiff < 10) { // 10ms 이내 입력 무시
      return null; // 이벤트 차단
    }
    
    return event;
  }
});
```

### 윈도우별 타이핑 분석

```typescript
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';

const unifiedHandler = new UnifiedHandler();

// 윈도우 변경 시 세션 전환
unifiedHandler.on('event-processed', (event) => {
  const currentWindow = unifiedHandler.getCurrentWindow();
  
  if (currentWindow) {
    console.log(`Typing in: ${currentWindow.title} (${currentWindow.processName})`);
  }
});

// 윈도우별 통계 수집
const windowStats = new Map<string, { keyCount: number; startTime: number }>();

unifiedHandler.registerHandler('window-stats', {
  name: 'window-stats',
  type: 'analyzer',
  priority: 10,
  active: true,
  handler: async (event) => {
    const currentWindow = unifiedHandler.getCurrentWindow();
    
    if (currentWindow) {
      const key = `${currentWindow.processName}:${currentWindow.title}`;
      const stats = windowStats.get(key) || { keyCount: 0, startTime: Date.now() };
      
      stats.keyCount++;
      windowStats.set(key, stats);
    }
    
    return event;
  }
});
```

### 한글 타이핑 분석

```typescript
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';

const unifiedHandler = new UnifiedHandler();

// 한글 조합 이벤트 모니터링
unifiedHandler.registerHandler('hangul-analyzer', {
  name: 'hangul-analyzer',
  type: 'analyzer',
  priority: 15,
  active: true,
  handler: async (event) => {
    // 한글 키인지 확인
    if (event.keychar && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(event.keychar)) {
      console.log(`한글 입력: ${event.keychar}`);
      
      // 한글 조합 상태 확인
      const compositionState = unifiedHandler.hangulComposer.getCompositionState();
      if (compositionState.isComposing) {
        console.log(`조합 중: ${compositionState.current}`);
      }
    }
    
    return event;
  }
});
```

## 성능 최적화

### 핸들러 우선순위 설정

```typescript
// 우선순위 가이드라인:
// 1-10: 필터링 및 전처리
// 11-20: 핵심 처리
// 21-30: 분석 및 통계
// 31-40: 로깅 및 부가기능

unifiedHandler.registerHandler('preprocessor', {
  name: 'preprocessor',
  type: 'filter',
  priority: 1, // 가장 먼저 실행
  active: true,
  handler: async (event) => {
    // 전처리 로직
    return event;
  }
});

unifiedHandler.registerHandler('logger', {
  name: 'logger',
  type: 'processor',
  priority: 35, // 가장 나중에 실행
  active: true,
  handler: async (event) => {
    // 로깅 로직
    return event;
  }
});
```

### 메모리 관리

```typescript
// 주기적으로 핸들러 상태 확인
setInterval(async () => {
  const health = await unifiedHandler.healthCheck();
  
  if (!health.healthy) {
    console.warn('UnifiedHandler health check failed:', health);
    
    // 필요시 재시작
    await unifiedHandler.stop();
    await unifiedHandler.start();
  }
}, 60000); // 1분마다 체크
```

## 문제 해결

### 핸들러 디버깅

```typescript
// 핸들러별 에러 추적
unifiedHandler.registerHandler('error-tracker', {
  name: 'error-tracker',
  type: 'processor',
  priority: 1,
  active: true,
  handler: async (event) => {
    try {
      // 다른 핸들러에서 에러가 발생할 수 있는 작업
      return event;
    } catch (error) {
      console.error('Handler error:', error);
      // 에러를 로깅하고 이벤트는 계속 전달
      return event;
    }
  }
});
```

### 성능 모니터링

```typescript
// 처리 시간 측정
unifiedHandler.registerHandler('performance-monitor', {
  name: 'performance-monitor',
  type: 'processor',
  priority: 1,
  active: true,
  handler: async (event) => {
    const startTime = performance.now();
    
    // 이벤트 처리 완료 후 시간 측정
    process.nextTick(() => {
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      if (processingTime > 10) { // 10ms 이상 소요시 경고
        console.warn(`Slow event processing: ${processingTime}ms`);
      }
    });
    
    return event;
  }
});
```

## 마이그레이션 가이드

### KeyboardEngine에서 UnifiedHandler로

```typescript
// 이전 (KeyboardEngine 직접 사용)
// import { keyboardEngine } from '../main/keyboard/KeyboardEngine';
// await keyboardEngine.initialize();
// await keyboardEngine.startListening();

// 새로운 방식 (UnifiedHandler)
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';

const unifiedHandler = new UnifiedHandler();
await unifiedHandler.initialize();
await unifiedHandler.start();
```

## 관련 문서

- [WindowTracker API](./window-tracker.md)
- [StatsManager API](./stats-manager.md)
- [HangulComposer API](./hangul-composer.md)
- [KeyboardEngine API](./keyboard-engine.md)
- [IPC Channels](./ipc-channels.md)
- [Architecture](./architecture.md)
