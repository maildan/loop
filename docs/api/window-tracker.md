# WindowTracker API 가이드

## 개요

WindowTracker는 Loop Typing Analytics의 윈도우 감지 및 추적 시스템입니다. 사용자의 활성 윈도우를 실시간으로 모니터링하고 컨텍스트별 타이핑 분석을 제공합니다.

## 주요 기능

- 🔍 **실시간 윈도우 감지**: 활성 윈도우 자동 감지
- 📊 **윈도우별 통계**: 앱별 타이핑 패턴 분석
- 🏗️ **이벤트 기반 아키텍처**: 효율적인 리소스 사용
- 🔒 **타입 안전성**: 완전한 TypeScript 지원

## API 레퍼런스

### WindowTracker 클래스

```typescript
import { WindowTracker } from '../main/keyboard/WindowTracker';

const windowTracker = new WindowTracker();
```

#### 주요 메서드

##### `initialize()`

윈도우 트래커를 초기화합니다.

```typescript
await windowTracker.initialize();
```

**반환값**: `Promise<void>`

##### `start()`

윈도우 모니터링을 시작합니다.

```typescript
await windowTracker.start();
```

**반환값**: `Promise<void>`

##### `stop()`

윈도우 모니터링을 중지합니다.

```typescript
await windowTracker.stop();
```

**반환값**: `Promise<void>`

##### `getCurrentWindow()`

현재 활성 윈도우 정보를 반환합니다.

```typescript
const windowInfo = windowTracker.getCurrentWindow();
console.log(windowInfo);
// {
//   title: "Loop Typing Analytics",
//   processName: "electron",
//   pid: 12345
// }
```

**반환값**: `WindowInfo | null`

##### `getWindowHistory()`

윈도우 히스토리를 반환합니다.

```typescript
const history = windowTracker.getWindowHistory();
console.log(history); // WindowInfo[]
```

**반환값**: `WindowInfo[]`

##### `getWindowStats()`

윈도우별 통계를 반환합니다.

```typescript
const stats = await windowTracker.getWindowStats();
console.log(stats);
// {
//   "Visual Studio Code": { sessionCount: 5, totalTime: 3600000 },
//   "Chrome": { sessionCount: 3, totalTime: 1800000 }
// }
```

**반환값**: `Promise<Result<Record<string, WindowStats>>>`

### 이벤트

WindowTracker는 EventEmitter를 확장하여 다음 이벤트를 발생시킵니다:

#### `window-changed`

윈도우가 변경될 때 발생합니다.

```typescript
windowTracker.on('window-changed', (windowInfo: WindowInfo) => {
  console.log('Window changed to:', windowInfo.title);
});
```

#### `window-focused`

윈도우가 포커스를 받을 때 발생합니다.

```typescript
windowTracker.on('window-focused', (windowInfo: WindowInfo) => {
  console.log('Window focused:', windowInfo.title);
});
```

#### `window-session-started`

새 윈도우 세션이 시작될 때 발생합니다.

```typescript
windowTracker.on('window-session-started', (sessionInfo: WindowSessionInfo) => {
  console.log('New window session:', sessionInfo);
});
```

#### `window-session-ended`

윈도우 세션이 종료될 때 발생합니다.

```typescript
windowTracker.on('window-session-ended', (sessionInfo: WindowSessionInfo) => {
  console.log('Window session ended:', sessionInfo);
});
```

## 타입 정의

### WindowInfo

```typescript
interface WindowInfo {
  title: string;          // 윈도우 제목
  processName: string;    // 프로세스 이름
  pid: number;           // 프로세스 ID
}
```

### WindowStats

```typescript
interface WindowStats {
  sessionCount: number;   // 세션 수
  totalTime: number;     // 총 시간 (밀리초)
  lastAccessed?: Date;   // 마지막 접근 시간
}
```

### WindowSessionInfo

```typescript
interface WindowSessionInfo {
  id: string;            // 세션 ID
  windowInfo: WindowInfo; // 윈도우 정보
  startTime: Date;       // 시작 시간
  endTime?: Date;        // 종료 시간 (선택사항)
  duration?: number;     // 지속 시간 (밀리초)
}
```

## 사용 예제

### 기본 사용법

```typescript
import { WindowTracker } from '../main/keyboard/WindowTracker';

const windowTracker = new WindowTracker();

// 초기화 및 시작
await windowTracker.initialize();
await windowTracker.start();

// 이벤트 리스너 등록
windowTracker.on('window-changed', (windowInfo) => {
  console.log(`Switched to: ${windowInfo.title} (${windowInfo.processName})`);
});

// 현재 윈도우 정보 가져오기
const currentWindow = windowTracker.getCurrentWindow();
if (currentWindow) {
  console.log(`Current window: ${currentWindow.title}`);
}

// 윈도우 히스토리 가져오기
const history = windowTracker.getWindowHistory();
console.log(`Visited ${history.length} windows in this session`);

// 정리
await windowTracker.stop();
```

### 윈도우별 타이핑 분석

```typescript
import { WindowTracker } from '../main/keyboard/WindowTracker';
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';

const windowTracker = new WindowTracker();
const unifiedHandler = new UnifiedHandler();

// 윈도우 변경 시 타이핑 세션 전환
windowTracker.on('window-changed', async (windowInfo) => {
  // 이전 세션 종료
  await unifiedHandler.endCurrentSession();
  
  // 새 세션 시작
  await unifiedHandler.startSession({
    appName: windowInfo.processName,
    windowTitle: windowInfo.title,
  });
});
```

### 생산성 분석

```typescript
import { WindowTracker } from '../main/keyboard/WindowTracker';

const windowTracker = new WindowTracker();

// 생산성 앱 목록
const productivityApps = ['code', 'notion', 'obsidian', 'figma'];

windowTracker.on('window-session-ended', (sessionInfo) => {
  const isProductiveApp = productivityApps.some(app => 
    sessionInfo.windowInfo.processName.toLowerCase().includes(app)
  );
  
  if (isProductiveApp && sessionInfo.duration) {
    console.log(`Productive session: ${sessionInfo.duration / 1000}s in ${sessionInfo.windowInfo.title}`);
  }
});
```

## 최적화 및 성능

### 메모리 관리

WindowTracker는 자동으로 메모리를 관리합니다:

- 윈도우 히스토리는 최대 100개 항목으로 제한
- 세션 데이터는 24시간 후 자동 정리
- 이벤트 리스너는 컴포넌트 정리 시 자동 해제

### 배터리 최적화

```typescript
// 배터리 절약 모드 설정
windowTracker.setBatteryOptimization(true);

// 폴링 간격 조정 (기본: 1초)
windowTracker.setPollingInterval(5000); // 5초
```

## 문제 해결

### 권한 문제

macOS에서 접근성 권한이 필요할 수 있습니다:

```typescript
const hasPermission = await windowTracker.checkPermissions();
if (!hasPermission) {
  await windowTracker.requestPermissions();
}
```

### 디버깅

```typescript
// 디버그 모드 활성화
windowTracker.setDebugMode(true);

// 헬스 체크
const health = await windowTracker.healthCheck();
console.log('WindowTracker health:', health);
```

## 통합 가이드

### UnifiedHandler와 연동

```typescript
import { UnifiedHandler } from '../main/keyboard/UnifiedHandler';

const unifiedHandler = new UnifiedHandler();

// UnifiedHandler에는 WindowTracker가 이미 통합되어 있습니다
const currentWindow = unifiedHandler.getCurrentWindow();
const windowHistory = unifiedHandler.getWindowHistory();
```

### IPC 통신

```typescript
// 렌더러 프로세스에서 윈도우 정보 요청
const windowInfo = await window.electron.ipcRenderer.invoke('window:get-current');
const windowHistory = await window.electron.ipcRenderer.invoke('window:get-history');
```

## 마이그레이션 가이드

기존 active-win에서 get-windows로 마이그레이션:

```typescript
// 이전 (active-win)
// const activeWindow = await activeWin();

// 새로운 방식 (WindowTracker)
const currentWindow = windowTracker.getCurrentWindow();
```

## 보안 고려사항

- 윈도우 제목에 민감한 정보가 포함될 수 있으므로 로깅 시 주의
- 프로덕션 환경에서는 디버그 모드 비활성화 권장
- 윈도우 정보는 로컬에만 저장되며 외부로 전송되지 않음

## 관련 문서

- [UnifiedHandler API](./unified-handler.md)
- [IPC Channels](./ipc-channels.md)
- [Architecture](./architecture.md)
- [Troubleshooting](./troubleshooting.md)
