# Loop Typing Analytics - 타입 정의 문서

## 🎯 타입 시스템 개요

Loop 애플리케이션은 **완전한 타입 안전성**을 보장하기 위해 모든 데이터 구조와 함수에 명시적인 TypeScript 타입을 정의합니다.

## 📋 핵심 타입 정의

### 1. 기본 응답 타입

```typescript
// src/shared/types.ts

/**
 * 🔥 기가차드 표준 결과 타입 - 모든 비동기 작업의 기본
 */
export interface Result<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
}

/**
 * 🔥 IPC 통신 전용 응답 타입
 */
export interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: Date;
}

/**
 * 🔥 에러 정보 상세 타입
 */
export interface ErrorInfo {
  code: string;
  message: string;
  component: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

### 2. 키보드 관련 타입

```typescript
/**
 * 🔥 타이핑 세션 타입 (데이터베이스 모델)
 */
export interface TypingSession {
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

/**
 * 🔥 키보드 이벤트 데이터
 */
export interface KeyboardEvent {
  keycode: number;
  timestamp: number;
  windowTitle: string;
  type: 'keydown' | 'keyup';
}

/**
 * 🔥 확장된 키보드 이벤트 (내부 처리용)
 */
export interface KeyboardEventData extends KeyboardEvent {
  character?: string;
  isComposed?: boolean; // 한글 조합 여부
  processName?: string;
  isBackspace?: boolean;
  isModifier?: boolean;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

/**
 * 🔥 실시간 통계 타입
 */
export interface RealtimeStats {
  currentWpm: number;
  averageWpm: number;
  totalKeystrokes: number;
  sessionDuration: number; // seconds
  accuracy: number; // 0-100
  charactersTyped: number;
  errorsCount: number;
  sessionStartTime?: Date;
}

/**
 * 🔥 종합 타이핑 통계
 */
export interface TypingStats {
  totalKeystrokes: number;
  wpm: number;
  accuracy: number;
  sessionDuration: number;
  charactersTyped: number;
  totalSessions: number;
  averageSessionDuration: number;
  bestWpm: number;
  worstWpm: number;
  improvementRate: number; // percentage
  consistencyScore: number; // 0-100
}

/**
 * 🔥 일별 통계 타입
 */
export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalKeystrokes: number;
  averageWpm: number;
  accuracy: number;
  sessionCount: number;
  totalDuration: number; // seconds
  bestSession?: {
    id: string;
    wpm: number;
    accuracy: number;
  };
}
```

### 3. 윈도우 관련 타입

```typescript
/**
 * 🔥 윈도우 정보 타입 (Loop 내부용)
 */
export interface WindowInfo {
  title: string;
  processName: string;
  pid: number;
}

/**
 * 🔥 윈도우 변경 이벤트
 */
export interface WindowChangeEvent {
  previous: WindowInfo | null;
  current: WindowInfo;
  timestamp: Date;
  changeType: 'focus-changed' | 'window-created' | 'window-closed' | 'title-changed';
}

/**
 * 🔥 윈도우 세션 정보
 */
export interface WindowSession {
  sessionId: string;
  windowInfo: WindowInfo;
  startTime: Date;
  endTime?: Date;
  duration: number; // milliseconds
  isActive: boolean;
  keystrokeCount: number;
  characterCount: number;
}

/**
 * 🔥 윈도우 히스토리 항목
 */
export interface WindowHistoryItem extends WindowInfo {
  timestamp: Date;
  duration: number; // milliseconds
  switchType: 'focus' | 'create' | 'close' | 'title-change';
  sessionId?: string;
}

/**
 * 🔥 윈도우 추적 통계
 */
export interface WindowTrackingStats {
  totalSwitches: number;
  averageSessionDuration: number; // milliseconds
  mostUsedApp: string;
  totalApps: number;
  currentSession?: WindowSession;
  sessionsToday: number;
}
```

### 4. 한글 조합 타입

```typescript
/**
 * 🔥 한글 자모 타입
 */
export type HangulJamo = 'initial' | 'medial' | 'final';

/**
 * 🔥 한글 조합 상태
 */
export interface HangulState {
  initial: string; // 초성
  medial: string;  // 중성
  final: string;   // 종성
  current: string; // 현재 조합된 문자
}

/**
 * 🔥 한글 조합 결과
 */
export interface HangulCompositionResult {
  composing: string; // 조합 중인 문자
  completed: string; // 완성된 문자
  isCompleted: boolean; // 조합 완료 여부
  needsUpdate: boolean; // UI 업데이트 필요 여부
}

/**
 * 🔥 한글 백스페이스 결과
 */
export interface HangulBackspaceResult {
  removed: string; // 제거된 문자/자모
  remaining: string; // 남은 조합 문자
  shouldDeletePrevious: boolean; // 이전 문자 삭제 필요 여부
}

/**
 * 🔥 한글 자모 매핑
 */
export interface HangulJamoMapping {
  [key: string]: {
    type: HangulJamo;
    code: number;
    combinable: string[]; // 결합 가능한 자모들
  };
}
```

### 5. 언어 및 지역화 타입

```typescript
/**
 * 🔥 지원되는 언어 타입
 */
export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh';

/**
 * 🔥 언어 정보
 */
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  composition: boolean; // 조합형 언어 여부
  keyboardLayout?: string;
}

/**
 * 🔥 키 매핑 정보
 */
export interface KeyMapping {
  language: SupportedLanguage;
  keyCode: number;
  char: string;
  composed?: string; // 조합된 문자
  alternatives?: string[]; // 대체 가능한 문자들
  requiresComposition?: boolean;
}

/**
 * 🔥 지역화 설정
 */
export interface LocaleSettings {
  language: SupportedLanguage;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  currency: string;
  timezone: string;
}
```

### 6. 시스템 및 설정 타입

```typescript
/**
 * 🔥 애플리케이션 설정
 */
export interface AppConfig {
  language: SupportedLanguage;
  autoStart: boolean;
  minimizeToTray: boolean;
  notifications: boolean;
  dataRetentionDays: number;
  backupEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  keyboardShortcuts: Record<string, string>;
  privacy: {
    collectUsageData: boolean;
    shareAnonymousStats: boolean;
  };
}

/**
 * 🔥 시스템 정보
 */
export interface SystemInfo {
  platform: NodeJS.Platform;
  arch: string;
  version: string;
  appVersion: string;
  electronVersion: string;
  nodeVersion: string;
  memory: {
    total: number;
    free: number;
    used: number;
    percentUsed: number;
  };
  cpu: {
    model: string;
    cores: number;
    usage: number; // percentage
  };
  uptime: number; // seconds
  userDataPath: string;
}

/**
 * 🔥 건강 상태
 */
export interface HealthStatus {
  status: 'healthy' | 'warning' | 'error' | 'critical';
  uptime: number; // seconds
  memoryUsage: number; // MB
  eventProcessingRate: number; // events/second
  lastError?: ErrorInfo;
  components: {
    [componentName: string]: ComponentHealth;
  };
  recommendations?: string[];
}

/**
 * 🔥 컴포넌트 건강 상태
 */
export interface ComponentHealth {
  status: 'ok' | 'warning' | 'error';
  message?: string;
  lastChecked: Date;
  metrics?: Record<string, number>;
}
```

### 7. 데이터베이스 관련 타입

```typescript
/**
 * 🔥 데이터베이스 연결 정보
 */
export interface DatabaseConfig {
  url: string;
  provider: 'sqlite' | 'postgresql' | 'mysql';
  maxConnections?: number;
  timeout?: number;
  retryAttempts?: number;
  backupInterval?: number; // hours
}

/**
 * 🔥 백업 정보
 */
export interface BackupInfo {
  id: string;
  fileName: string;
  filePath: string;
  size: number; // bytes
  createdAt: Date;
  checksum: string;
  isCompressed: boolean;
  metadata: {
    recordCount: number;
    schemaVersion: string;
    appVersion: string;
  };
}

/**
 * 🔥 사용자 환경설정
 */
export interface UserPreferences {
  id: string;
  userId?: string;
  preferences: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 🔥 데이터 내보내기 옵션
 */
export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  dataType: 'sessions' | 'stats' | 'all';
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  includeKeystrokes?: boolean;
  compression?: boolean;
  encryption?: boolean;
}

/**
 * 🔥 내보내기 결과
 */
export interface ExportResult {
  fileName: string;
  filePath: string;
  format: string;
  recordCount: number;
  fileSize: number; // bytes
  checksum?: string;
  createdAt: Date;
}
```

### 8. 이벤트 및 콜백 타입

```typescript
/**
 * 🔥 이벤트 리스너 타입
 */
export type EventListener<TData = unknown> = (data: TData) => void;

/**
 * 🔥 이벤트 이름 타입
 */
export type EventName = 
  | 'stats-updated'
  | 'window-changed'
  | 'session-started'
  | 'session-ended'
  | 'keyboard-event'
  | 'composition-updated'
  | 'error-occurred'
  | 'health-check'
  | 'config-changed';

/**
 * 🔥 이벤트 데이터 매핑
 */
export interface EventDataMap {
  'stats-updated': RealtimeStats;
  'window-changed': WindowChangeEvent;
  'session-started': WindowSession;
  'session-ended': WindowSession;
  'keyboard-event': KeyboardEventData;
  'composition-updated': HangulCompositionResult;
  'error-occurred': ErrorInfo;
  'health-check': HealthStatus;
  'config-changed': Partial<AppConfig>;
}

/**
 * 🔥 비동기 콜백 타입
 */
export type AsyncCallback<TResult = void> = () => Promise<TResult>;

/**
 * 🔥 에러 핸들러 타입
 */
export type ErrorHandler = (error: Error, context?: Record<string, unknown>) => void;
```

### 9. 유틸리티 타입

```typescript
/**
 * 🔥 Nullable 타입
 */
export type Nullable<T> = T | null;

/**
 * 🔥 Optional 타입
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 🔥 DeepPartial 타입
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 🔥 DeepReadonly 타입
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 🔥 Union을 Intersection으로 변환
 */
export type UnionToIntersection<U> = 
  (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

/**
 * 🔥 타입 가드 함수 타입
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * 🔥 Validator 함수 타입
 */
export type Validator<T> = (value: T) => Result<T>;

/**
 * 🔥 Transformer 함수 타입
 */
export type Transformer<TInput, TOutput> = (input: TInput) => TOutput;
```

### 10. API 응답 타입

```typescript
/**
 * 🔥 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 🔥 페이지네이션된 응답
 */
export interface PaginatedResponse<TData> {
  data: TData[];
  meta: PaginationMeta;
}

/**
 * 🔥 정렬 옵션
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * 🔥 필터 옵션
 */
export interface FilterOptions {
  [key: string]: unknown;
}

/**
 * 🔥 쿼리 옵션
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: SortOptions;
  filter?: FilterOptions;
  include?: string[];
}

/**
 * 🔥 API 요청 컨텍스트
 */
export interface RequestContext {
  timestamp: Date;
  requestId: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
}
```

## 🛡️ 타입 가드 함수

```typescript
// src/shared/type-guards.ts

/**
 * 🔥 기가차드 타입 가드 컬렉션
 */

export function isRealtimeStats(value: unknown): value is RealtimeStats {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RealtimeStats).currentWpm === 'number' &&
    typeof (value as RealtimeStats).averageWpm === 'number' &&
    typeof (value as RealtimeStats).totalKeystrokes === 'number' &&
    typeof (value as RealtimeStats).sessionDuration === 'number' &&
    typeof (value as RealtimeStats).accuracy === 'number'
  );
}

export function isWindowInfo(value: unknown): value is WindowInfo {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as WindowInfo).title === 'string' &&
    typeof (value as WindowInfo).processName === 'string' &&
    typeof (value as WindowInfo).pid === 'number'
  );
}

export function isKeyboardEventData(value: unknown): value is KeyboardEventData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as KeyboardEventData).keycode === 'number' &&
    typeof (value as KeyboardEventData).timestamp === 'number' &&
    typeof (value as KeyboardEventData).windowTitle === 'string' &&
    ['keydown', 'keyup'].includes((value as KeyboardEventData).type)
  );
}

export function isTypingSession(value: unknown): value is TypingSession {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as TypingSession).id === 'string' &&
    typeof (value as TypingSession).content === 'string' &&
    (value as TypingSession).startTime instanceof Date &&
    (value as TypingSession).endTime instanceof Date &&
    typeof (value as TypingSession).keyCount === 'number' &&
    typeof (value as TypingSession).wpm === 'number' &&
    typeof (value as TypingSession).accuracy === 'number'
  );
}

export function isHangulCompositionResult(value: unknown): value is HangulCompositionResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as HangulCompositionResult).composing === 'string' &&
    typeof (value as HangulCompositionResult).completed === 'string' &&
    typeof (value as HangulCompositionResult).isCompleted === 'boolean' &&
    typeof (value as HangulCompositionResult).needsUpdate === 'boolean'
  );
}

export function isResult<T>(value: unknown, dataGuard?: TypeGuard<T>): value is Result<T> {
  const isValidResult = (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Result).success === 'boolean'
  );

  if (!isValidResult) return false;

  const result = value as Result<T>;
  
  // 성공한 경우 data 검증
  if (result.success && result.data !== undefined && dataGuard) {
    return dataGuard(result.data);
  }

  // 실패한 경우 error 검증
  if (!result.success && typeof result.error !== 'string') {
    return false;
  }

  return true;
}

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === 'string' && ['ko', 'en', 'ja', 'zh'].includes(value);
}
```

## 🔧 타입 유틸리티 함수

```typescript
// src/shared/type-utils.ts

/**
 * 🔥 타입 안전한 키 추출
 */
export function getKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * 🔥 타입 안전한 값 추출
 */
export function getValues<T extends Record<string, unknown>>(obj: T): Array<T[keyof T]> {
  return Object.values(obj);
}

/**
 * 🔥 타입 안전한 엔트리 추출
 */
export function getEntries<T extends Record<string, unknown>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * 🔥 깊은 복사 (타입 보존)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * 🔥 타입 안전한 Object.assign
 */
export function safeAssign<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  return Object.assign(target, ...sources);
}

/**
 * 🔥 null/undefined 안전한 접근
 */
export function safe<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj?.[key];
}

/**
 * 🔥 타입 변환 with 검증
 */
export function safeCast<T>(value: unknown, guard: TypeGuard<T>): T | null {
  return guard(value) ? value : null;
}
```

---

**🔥 Loop의 타입 시스템은 컴파일 타임 안전성과 런타임 검증을 모두 제공하여 완벽한 타입 안전성을 보장합니다.**
