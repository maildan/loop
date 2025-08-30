# Loop Typing Analytics - IPC 채널 문서

## 🔌 IPC (Inter-Process Communication) 채널 정의

Loop 애플리케이션의 Main Process와 Renderer Process 간 통신을 위한 모든 IPC 채널과 메시지 형식을 정의합니다.

## 📊 타입 정의

### 기본 응답 타입

```typescript
// src/shared/types.ts
export interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: Date;
}

export interface Result<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
}
```

## ⌨️ Keyboard IPC 채널

### 1. 키보드 모니터링 제어

#### `keyboard:start-monitoring`
키보드 모니터링을 시작합니다.

**요청:**
```typescript
// 매개변수 없음
await window.electronAPI.keyboard.startMonitoring();
```

**응답:**
```typescript
IpcResponse<boolean>
```

**예제:**
```typescript
const response = await window.electronAPI.keyboard.startMonitoring();
if (response.success && response.data) {
  console.log('모니터링이 시작되었습니다.');
} else {
  console.error('모니터링 시작 실패:', response.error);
}
```

#### `keyboard:stop-monitoring`
키보드 모니터링을 중지합니다.

**요청:**
```typescript
await window.electronAPI.keyboard.stopMonitoring();
```

**응답:**
```typescript
IpcResponse<boolean>
```

#### `keyboard:get-status`
현재 키보드 모니터링 상태를 조회합니다.

**요청:**
```typescript
await window.electronAPI.keyboard.getStatus();
```

**응답:**
```typescript
interface MonitoringStatus {
  isActive: boolean;
  startTime?: Date;
  sessionDuration: number;
  language: string;
}

IpcResponse<MonitoringStatus>
```

### 2. 언어 및 설정

#### `keyboard:set-language`
키보드 입력 언어를 설정합니다.

**요청:**
```typescript
interface LanguageRequest {
  language: 'ko' | 'en' | 'ja' | 'zh';
}

await window.electronAPI.keyboard.setLanguage('ko');
```

**응답:**
```typescript
IpcResponse<boolean>
```

#### `keyboard:get-language`
현재 설정된 언어를 조회합니다.

**요청:**
```typescript
await window.electronAPI.keyboard.getLanguage();
```

**응답:**
```typescript
IpcResponse<string>
```

### 3. 실시간 통계

#### `keyboard:get-realtime-stats`
실시간 타이핑 통계를 조회합니다.

**요청:**
```typescript
await window.electronAPI.keyboard.getRealtimeStats();
```

**응답:**
```typescript
interface RealtimeStats {
  currentWpm: number;
  averageWpm: number;
  totalKeystrokes: number;
  sessionDuration: number;
  accuracy: number;
  charactersTyped: number;
  errorsCount: number;
}

IpcResponse<RealtimeStats>
```

#### `keyboard:get-recent-events`
최근 키보드 이벤트를 조회합니다.

**요청:**
```typescript
interface RecentEventsRequest {
  limit?: number; // 기본값: 100
  includeMetadata?: boolean; // 기본값: false
}

await window.electronAPI.keyboard.getRecentEvents({ limit: 50 });
```

**응답:**
```typescript
interface KeyboardEventData {
  keycode: number;
  timestamp: number;
  windowTitle: string;
  type: 'keydown' | 'keyup';
  character?: string;
  isComposed?: boolean; // 한글 조합 여부
}

IpcResponse<KeyboardEventData[]>
```

### 4. 세션 관리

#### `keyboard:start-session`
새로운 타이핑 세션을 시작합니다.

**요청:**
```typescript
interface SessionStartRequest {
  sessionName?: string;
  metadata?: Record<string, unknown>;
}

await window.electronAPI.keyboard.startSession({ sessionName: 'Work Session' });
```

**응답:**
```typescript
interface SessionInfo {
  sessionId: string;
  startTime: Date;
  sessionName?: string;
}

IpcResponse<SessionInfo>
```

#### `keyboard:end-session`
현재 활성 세션을 종료합니다.

**요청:**
```typescript
await window.electronAPI.keyboard.endSession();
```

**응답:**
```typescript
interface SessionResult {
  sessionId: string;
  duration: number;
  totalKeystrokes: number;
  averageWpm: number;
  accuracy: number;
}

IpcResponse<SessionResult>
```

## 📊 Dashboard IPC 채널

### 1. 통계 조회

#### `dashboard:get-stats`
타이핑 통계를 조회합니다.

**요청:**
```typescript
interface StatsRequest {
  days?: number; // 기본값: 30
  includeDetails?: boolean; // 기본값: false
}

await window.electronAPI.dashboard.getStats({ days: 7 });
```

**응답:**
```typescript
interface TypingStats {
  totalKeystrokes: number;
  wpm: number;
  accuracy: number;
  sessionDuration: number;
  charactersTyped: number;
  totalSessions: number;
  averageSessionDuration: number;
  bestWpm: number;
  worstWpm: number;
  improvementRate: number;
}

IpcResponse<TypingStats>
```

#### `dashboard:get-daily-stats`
일별 통계를 조회합니다.

**요청:**
```typescript
interface DailyStatsRequest {
  startDate: string; // ISO 8601 형식
  endDate: string;
}

await window.electronAPI.dashboard.getDailyStats({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

**응답:**
```typescript
interface DailyStats {
  date: string;
  totalKeystrokes: number;
  averageWpm: number;
  accuracy: number;
  sessionCount: number;
  totalDuration: number;
}

IpcResponse<DailyStats[]>
```

### 2. 세션 관리

#### `dashboard:get-sessions`
타이핑 세션 목록을 조회합니다.

**요청:**
```typescript
interface SessionsRequest {
  limit?: number; // 기본값: 100
  offset?: number; // 기본값: 0
  sortBy?: 'startTime' | 'wpm' | 'duration'; // 기본값: 'startTime'
  sortOrder?: 'asc' | 'desc'; // 기본값: 'desc'
}

await window.electronAPI.dashboard.getSessions({ limit: 20 });
```

**응답:**
```typescript
interface TypingSession {
  id: string;
  content: string;
  startTime: Date;
  endTime: Date;
  keyCount: number;
  wpm: number;
  accuracy: number;
  language: string;
  windowTitle: string;
  errors?: number;
}

IpcResponse<TypingSession[]>
```

#### `dashboard:get-session-details`
특정 세션의 상세 정보를 조회합니다.

**요청:**
```typescript
interface SessionDetailsRequest {
  sessionId: string;
  includeKeystrokes?: boolean; // 기본값: false
}

await window.electronAPI.dashboard.getSessionDetails({ 
  sessionId: 'session-123',
  includeKeystrokes: true 
});
```

**응답:**
```typescript
interface SessionDetails extends TypingSession {
  keystrokes?: KeyboardEventData[];
  windowHistory?: WindowInfo[];
  wpmHistory?: number[];
  accuracyHistory?: number[];
}

IpcResponse<SessionDetails>
```

#### `dashboard:delete-session`
세션을 삭제합니다.

**요청:**
```typescript
interface DeleteSessionRequest {
  sessionId: string;
}

await window.electronAPI.dashboard.deleteSession({ sessionId: 'session-123' });
```

**응답:**
```typescript
IpcResponse<boolean>
```

### 3. 데이터 내보내기

#### `dashboard:export-data`
데이터를 다양한 형식으로 내보냅니다.

**요청:**
```typescript
interface ExportRequest {
  format: 'json' | 'csv' | 'xlsx';
  dataType: 'sessions' | 'stats' | 'all';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  includeKeystrokes?: boolean; // 기본값: false
}

await window.electronAPI.dashboard.exportData({
  format: 'csv',
  dataType: 'sessions',
  dateRange: {
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  }
});
```

**응답:**
```typescript
interface ExportResult {
  fileName: string;
  filePath: string;
  format: string;
  recordCount: number;
  fileSize: number; // bytes
}

IpcResponse<ExportResult>
```

## 🪟 Window IPC 채널

### 1. 윈도우 정보

#### `window:get-current`
현재 활성 윈도우 정보를 조회합니다.

**요청:**
```typescript
await window.electronAPI.window.getCurrent();
```

**응답:**
```typescript
interface WindowInfo {
  title: string;
  processName: string;
  pid: number;
}

IpcResponse<WindowInfo>
```

#### `window:get-history`
윈도우 변경 히스토리를 조회합니다.

**요청:**
```typescript
interface WindowHistoryRequest {
  limit?: number; // 기본값: 100
  includeMetadata?: boolean; // 기본값: false
}

await window.electronAPI.window.getHistory({ limit: 50 });
```

**응답:**
```typescript
interface WindowHistoryItem extends WindowInfo {
  timestamp: Date;
  duration: number; // milliseconds
  switchType: 'focus' | 'create' | 'close';
}

IpcResponse<WindowHistoryItem[]>
```

### 2. 세션 추적

#### `window:get-active-sessions`
현재 활성 윈도우 세션들을 조회합니다.

**요청:**
```typescript
await window.electronAPI.window.getActiveSessions();
```

**응답:**
```typescript
interface WindowSession {
  sessionId: string;
  windowInfo: WindowInfo;
  startTime: Date;
  duration: number;
  isActive: boolean;
}

IpcResponse<WindowSession[]>
```

## 🔧 System IPC 채널

### 1. 시스템 정보

#### `system:get-info`
시스템 정보를 조회합니다.

**요청:**
```typescript
await window.electronAPI.system.getInfo();
```

**응답:**
```typescript
interface SystemInfo {
  platform: string;
  arch: string;
  version: string;
  appVersion: string;
  electronVersion: string;
  nodeVersion: string;
  memory: {
    total: number;
    free: number;
    used: number;
  };
  uptime: number;
}

IpcResponse<SystemInfo>
```

#### `system:get-health`
애플리케이션 건강 상태를 조회합니다.

**요청:**
```typescript
await window.electronAPI.system.getHealth();
```

**응답:**
```typescript
interface HealthStatus {
  status: 'healthy' | 'warning' | 'error';
  uptime: number;
  memoryUsage: number;
  eventProcessingRate: number;
  lastError?: string;
  components: {
    [componentName: string]: {
      status: 'ok' | 'warning' | 'error';
      message?: string;
    };
  };
}

IpcResponse<HealthStatus>
```

### 2. 설정 관리

#### `system:get-config`
애플리케이션 설정을 조회합니다.

**요청:**
```typescript
await window.electronAPI.system.getConfig();
```

**응답:**
```typescript
interface AppConfig {
  language: string;
  autoStart: boolean;
  minimizeToTray: boolean;
  notifications: boolean;
  dataRetentionDays: number;
  backupEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

IpcResponse<AppConfig>
```

#### `system:update-config`
애플리케이션 설정을 업데이트합니다.

**요청:**
```typescript
interface ConfigUpdateRequest {
  updates: Partial<AppConfig>;
}

await window.electronAPI.system.updateConfig({
  updates: {
    autoStart: true,
    theme: 'dark'
  }
});
```

**응답:**
```typescript
IpcResponse<AppConfig>
```

### 3. 외부 연동

#### `system:open-external`
외부 URL을 기본 브라우저에서 엽니다.

**요청:**
```typescript
interface OpenExternalRequest {
  url: string;
}

await window.electronAPI.system.openExternal({ url: 'https://example.com' });
```

**응답:**
```typescript
IpcResponse<boolean>
```

#### `system:show-in-folder`
파일을 폴더에서 표시합니다.

**요청:**
```typescript
interface ShowInFolderRequest {
  filePath: string;
}

await window.electronAPI.system.showInFolder({ filePath: '/path/to/file.txt' });
```

**응답:**
```typescript
IpcResponse<boolean>
```

## 📢 이벤트 채널 (Main → Renderer)

### 1. 실시간 업데이트

#### `stats:updated`
실시간 통계가 업데이트될 때 발생합니다.

**이벤트 데이터:**
```typescript
interface StatsUpdateEvent {
  stats: RealtimeStats;
  timestamp: Date;
}
```

**리스너 등록:**
```typescript
window.electronAPI.on('stats:updated', (event, data: StatsUpdateEvent) => {
  console.log('Stats updated:', data.stats);
});
```

#### `window:changed`
윈도우가 변경될 때 발생합니다.

**이벤트 데이터:**
```typescript
interface WindowChangeEvent {
  previous: WindowInfo | null;
  current: WindowInfo;
  timestamp: Date;
  changeType: 'focus' | 'create' | 'close';
}
```

**리스너 등록:**
```typescript
window.electronAPI.on('window:changed', (event, data: WindowChangeEvent) => {
  console.log('Window changed from', data.previous?.title, 'to', data.current.title);
});
```

### 2. 세션 이벤트

#### `session:started`
새로운 세션이 시작될 때 발생합니다.

**이벤트 데이터:**
```typescript
interface SessionStartedEvent {
  sessionId: string;
  startTime: Date;
  windowInfo: WindowInfo;
}
```

#### `session:ended`
세션이 종료될 때 발생합니다.

**이벤트 데이터:**
```typescript
interface SessionEndedEvent {
  sessionId: string;
  endTime: Date;
  duration: number;
  finalStats: SessionResult;
}
```

### 3. 시스템 이벤트

#### `system:error`
시스템 오류가 발생할 때 발생합니다.

**이벤트 데이터:**
```typescript
interface SystemErrorEvent {
  component: string;
  error: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: Record<string, unknown>;
}
```

#### `system:notification`
시스템 알림이 있을 때 발생합니다.

**이벤트 데이터:**
```typescript
interface SystemNotificationEvent {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  duration?: number; // milliseconds
  actions?: {
    label: string;
    action: string;
  }[];
}
```

## 🛡️ 에러 처리

### 표준 에러 응답

모든 IPC 호출은 다음과 같은 표준화된 에러 형식을 사용합니다:

```typescript
interface IpcErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}
```

### 일반적인 에러 코드

| 코드 | 설명 | 해결 방법 |
|------|------|-----------|
| `HANDLER_NOT_FOUND` | IPC 핸들러를 찾을 수 없음 | 채널명 확인 |
| `INVALID_PARAMS` | 잘못된 매개변수 | 요청 형식 확인 |
| `PERMISSION_DENIED` | 권한 없음 | 시스템 권한 확인 |
| `SERVICE_UNAVAILABLE` | 서비스 이용 불가 | 서비스 상태 확인 |
| `TIMEOUT` | 요청 시간 초과 | 네트워크 또는 시스템 부하 확인 |

### 에러 처리 예제

```typescript
try {
  const response = await window.electronAPI.keyboard.startMonitoring();
  
  if (!response.success) {
    switch (response.error) {
      case 'PERMISSION_DENIED':
        console.error('Accessibility permission required');
        // 권한 요청 UI 표시
        break;
      case 'SERVICE_UNAVAILABLE':
        console.error('Keyboard service not available');
        // 서비스 재시작 버튼 표시
        break;
      default:
        console.error('Unknown error:', response.error);
    }
  }
} catch (error) {
  console.error('IPC communication failed:', error);
}
```

## 🔧 개발 도구

### IPC 디버깅

개발 모드에서 모든 IPC 통신을 로깅하려면:

```typescript
// Main Process
if (process.env.NODE_ENV === 'development') {
  ipcMain.on('*', (event, ...args) => {
    console.log('IPC Event:', event.frameId, ...args);
  });
}

// Renderer Process
if (process.env.NODE_ENV === 'development') {
  const originalInvoke = window.electronAPI.invoke;
  window.electronAPI.invoke = async (channel, ...args) => {
    console.log('IPC Invoke:', channel, args);
    const result = await originalInvoke(channel, ...args);
    console.log('IPC Result:', channel, result);
    return result;
  };
}
```

### 타입 검증

TypeScript를 사용하여 컴파일 타임에 IPC 메시지 형식을 검증할 수 있습니다:

```typescript
// src/shared/ipc-types.ts
export interface IpcChannels {
  'keyboard:start-monitoring': {
    request: void;
    response: boolean;
  };
  'keyboard:get-realtime-stats': {
    request: void;
    response: RealtimeStats;
  };
  // ... 더 많은 채널 정의
}

// 타입 안전한 IPC 호출
export async function safeIpcInvoke<T extends keyof IpcChannels>(
  channel: T,
  request: IpcChannels[T]['request']
): Promise<IpcResponse<IpcChannels[T]['response']>> {
  return window.electronAPI.invoke(channel, request);
}
```

---

**🔥 Loop의 IPC 시스템은 타입 안전성과 에러 처리를 완벽하게 지원하여 안정적이고 예측 가능한 통신을 보장합니다.**
