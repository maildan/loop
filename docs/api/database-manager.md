# DatabaseManager API 가이드

## 개요

DatabaseManager는 Loop Typing Analytics의 데이터 지속성 계층을 담당하는 핵심 컴포넌트입니다. Prisma ORM을 통해 타이핑 세션, 통계, 사용자 설정 등의 데이터를 안전하고 효율적으로 관리합니다.

## 주요 기능

- 💾 **데이터 지속성**: 타이핑 세션 및 통계 데이터 저장
- 🔄 **자동 백업**: 정기적인 데이터베이스 백업
- 📊 **통계 집계**: 복합 쿼리를 통한 성능 분석
- 🛡️ **데이터 무결성**: 트랜잭션 기반 안전한 데이터 처리
- 🧹 **자동 정리**: 오래된 데이터 자동 정리

## API 레퍼런스

### DatabaseManager 클래스

```typescript
import { DatabaseManager } from '../main/managers/DatabaseManager';

const databaseManager = new DatabaseManager();
```

#### 생명주기 메서드

##### `initialize()`

DatabaseManager를 초기화하고 데이터베이스 연결을 설정합니다.

```typescript
await databaseManager.initialize();
```

**반환값**: `Promise<void>`

##### `start()`

데이터베이스 연결을 시작합니다.

```typescript
await databaseManager.start();
```

**반환값**: `Promise<void>`

##### `stop()`

데이터베이스 연결을 종료합니다.

```typescript
await databaseManager.stop();
```

**반환값**: `Promise<void>`

#### 연결 관리

##### `connect()`

데이터베이스에 연결합니다.

```typescript
const result = await databaseManager.connect();
console.log(result.success); // true
```

**반환값**: `Promise<Result<void>>`

##### `disconnect()`

데이터베이스 연결을 해제합니다.

```typescript
const result = await databaseManager.disconnect();
console.log(result.success); // true
```

**반환값**: `Promise<Result<void>>`

##### `getConnectionStatus()`

현재 연결 상태를 반환합니다.

```typescript
const status = databaseManager.getConnectionStatus();
console.log(status);
// {
//   connected: true,
//   latency: 25,
//   lastConnected: Date(...),
//   connectionAttempts: 1,
//   lastError: null
// }
```

**반환값**: `DatabaseConnectionStatus`

#### 세션 관리

##### `saveSession()`

타이핑 세션을 저장합니다.

```typescript
const session: TypingSession = {
  id: 'session-123',
  content: 'Hello, World!',
  startTime: new Date(),
  endTime: new Date(),
  keyCount: 13,
  wpm: 60,
  accuracy: 95.5,
  language: 'english',
  windowTitle: 'Text Editor'
};

const result = await databaseManager.saveSession(session);
console.log(result.data); // 저장된 세션 ID
```

**매개변수**:
- `session: TypingSession` - 저장할 세션 데이터

**반환값**: `Promise<Result<string>>`

##### `getSession()`

세션 ID로 세션을 조회합니다.

```typescript
const result = await databaseManager.getSession('session-123');
console.log(result.data); // TypingSession 객체
```

**매개변수**:
- `sessionId: string` - 조회할 세션 ID

**반환값**: `Promise<Result<TypingSession>>`

##### `getSessions()`

조건에 맞는 세션 목록을 조회합니다.

```typescript
const result = await databaseManager.getSessions({
  limit: 10,
  offset: 0,
  language: 'korean'
});

console.log(result.data); // TypingSession[]
```

**매개변수**:
- `filters: SessionFilters` - 조회 조건

**반환값**: `Promise<Result<TypingSession[]>>`

##### `deleteSession()`

세션을 삭제합니다.

```typescript
const result = await databaseManager.deleteSession('session-123');
console.log(result.success); // true
```

**매개변수**:
- `sessionId: string` - 삭제할 세션 ID

**반환값**: `Promise<Result<void>>`

#### 통계 관리

##### `saveStats()`

통계 데이터를 저장합니다.

```typescript
const stats: TypingStats = {
  totalKeystrokes: 1000,
  wpm: 65,
  accuracy: 96.5,
  sessionDuration: 600000,
  charactersTyped: 800
};

const result = await databaseManager.saveStats('session-123', stats);
console.log(result.success); // true
```

**매개변수**:
- `sessionId: string` - 세션 ID
- `stats: TypingStats` - 통계 데이터

**반환값**: `Promise<Result<void>>`

##### `getStats()`

통계 데이터를 조회합니다.

```typescript
const result = await databaseManager.getStats('session-123');
console.log(result.data); // TypingStats
```

**매개변수**:
- `sessionId: string` - 세션 ID

**반환값**: `Promise<Result<TypingStats>>`

##### `getAggregatedStats()`

집계된 통계를 조회합니다.

```typescript
const result = await databaseManager.getAggregatedStats({
  fromDate: new Date('2024-01-01'),
  toDate: new Date('2024-12-31'),
  groupBy: 'month'
});

console.log(result.data);
// {
//   totalSessions: 150,
//   totalKeystrokes: 50000,
//   averageWpm: 62.5,
//   bestWpm: 89,
//   totalTypingTime: 7200000,
//   lastSessionDate: Date(...)
// }
```

**매개변수**:
- `options: AggregationOptions` - 집계 옵션

**반환값**: `Promise<Result<DatabaseStats>>`

#### 사용자 설정

##### `saveUserPreferences()`

사용자 설정을 저장합니다.

```typescript
const preferences: UserPreferences = {
  theme: 'dark',
  language: 'korean',
  autoSave: true,
  soundEnabled: false
};

const result = await databaseManager.saveUserPreferences('user-123', preferences);
console.log(result.success); // true
```

**매개변수**:
- `userId: string` - 사용자 ID
- `preferences: UserPreferences` - 사용자 설정

**반환값**: `Promise<Result<void>>`

##### `getUserPreferences()`

사용자 설정을 조회합니다.

```typescript
const result = await databaseManager.getUserPreferences('user-123');
console.log(result.data); // UserPreferences
```

**매개변수**:
- `userId: string` - 사용자 ID

**반환값**: `Promise<Result<UserPreferences>>`

#### 백업 및 관리

##### `createBackup()`

데이터베이스 백업을 생성합니다.

```typescript
const result = await databaseManager.createBackup();
console.log(result.data);
// {
//   id: 'backup_1703123456789',
//   path: '/Users/user/AppData/backups/loop_backup_2024-01-01T10-30-45.db',
//   size: 2048576,
//   created: Date(...),
//   checksum: 'a1b2c3d4e5f6...'
// }
```

**반환값**: `Promise<Result<BackupInfo>>`

##### `cleanupOldData()`

오래된 데이터를 정리합니다.

```typescript
const result = await databaseManager.cleanupOldData(365); // 365일 이전 데이터 삭제
console.log(result.data); // 삭제된 레코드 수
```

**매개변수**:
- `olderThanDays: number` - 삭제할 데이터의 기준 일수 (기본값: 365)

**반환값**: `Promise<Result<number>>`

##### `optimizeDatabase()`

데이터베이스를 최적화합니다.

```typescript
const result = await databaseManager.optimizeDatabase();
console.log(result.success); // true
```

**반환값**: `Promise<Result<void>>`

##### `healthCheck()`

데이터베이스 헬스 체크를 수행합니다.

```typescript
const health = await databaseManager.healthCheck();
console.log(health);
// {
//   healthy: true,
//   uptime: 3600000,
//   connectionStatus: { connected: true, latency: 25, ... },
//   databaseSize: 10485760,
//   totalSessions: 150
// }
```

**반환값**: `Promise<HealthCheckResult>`

## 타입 정의

### DatabaseConnectionStatus

```typescript
interface DatabaseConnectionStatus {
  connected: boolean;              // 연결 상태
  latency: number;                // 응답 시간 (ms)
  lastConnected: Date | null;     // 마지막 연결 시간
  connectionAttempts: number;     // 연결 시도 횟수
  lastError: string | null;       // 마지막 에러 메시지
}
```

### SessionFilters

```typescript
interface SessionFilters {
  limit?: number;                 // 조회 제한
  offset?: number;               // 시작 위치
  language?: string;             // 언어 필터
  fromDate?: Date;              // 시작 날짜
  toDate?: Date;                // 종료 날짜
  minWpm?: number;              // 최소 WPM
  minAccuracy?: number;         // 최소 정확도
}
```

### AggregationOptions

```typescript
interface AggregationOptions {
  fromDate?: Date;              // 집계 시작 날짜
  toDate?: Date;               // 집계 종료 날짜
  groupBy?: 'day' | 'week' | 'month' | 'year'; // 그룹화 단위
  language?: string;           // 언어 필터
}
```

### DatabaseStats

```typescript
interface DatabaseStats {
  totalSessions: number;        // 총 세션 수
  totalKeystrokes: number;     // 총 키스트로크 수
  averageWpm: number;          // 평균 WPM
  bestWpm: number;             // 최고 WPM
  totalTypingTime: number;     // 총 타이핑 시간 (ms)
  lastSessionDate: Date | null; // 마지막 세션 날짜
}
```

### BackupInfo

```typescript
interface BackupInfo {
  id: string;                  // 백업 ID
  path: string;               // 백업 파일 경로
  size: number;               // 파일 크기 (bytes)
  created: Date;              // 생성 시간
  checksum: string;           // 체크섬
}
```

## 사용 예제

### 기본 사용법

```typescript
import { DatabaseManager } from '../main/managers/DatabaseManager';

const databaseManager = new DatabaseManager();

// 초기화 및 연결
await databaseManager.initialize();
await databaseManager.start();

// 세션 저장
const session: TypingSession = {
  id: `session-${Date.now()}`,
  content: 'Hello, World! This is a typing test.',
  startTime: new Date(),
  endTime: new Date(),
  keyCount: 35,
  wpm: 70,
  accuracy: 98.5,
  language: 'english',
  windowTitle: 'Text Editor'
};

const saveResult = await databaseManager.saveSession(session);
if (saveResult.success) {
  console.log('Session saved successfully');
  
  // 통계 저장
  const stats: TypingStats = {
    totalKeystrokes: 35,
    wpm: 70,
    accuracy: 98.5,
    sessionDuration: 30000,
    charactersTyped: 35
  };
  
  await databaseManager.saveStats(session.id, stats);
}

// 연결 해제
await databaseManager.stop();
```

### 세션 분석

```typescript
import { DatabaseManager } from '../main/managers/DatabaseManager';

const databaseManager = new DatabaseManager();

// 최근 세션 분석
const analyzeRecentSessions = async () => {
  const result = await databaseManager.getSessions({
    limit: 10,
    offset: 0
  });
  
  if (result.success && result.data) {
    const sessions = result.data;
    
    console.log('Recent Sessions Analysis:');
    console.log(`Total sessions: ${sessions.length}`);
    
    const averageWpm = sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length;
    const averageAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
    const bestWpm = Math.max(...sessions.map(s => s.wpm));
    
    console.log(`Average WPM: ${averageWpm.toFixed(1)}`);
    console.log(`Average Accuracy: ${averageAccuracy.toFixed(1)}%`);
    console.log(`Best WPM: ${bestWpm}`);
    
    // 언어별 분석
    const languageStats = sessions.reduce((acc, session) => {
      acc[session.language] = (acc[session.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Language distribution:', languageStats);
  }
};

await analyzeRecentSessions();
```

### 성능 트렌드 분석

```typescript
import { DatabaseManager } from '../main/managers/DatabaseManager';

const databaseManager = new DatabaseManager();

// 월별 성능 트렌드
const analyzeTrends = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  
  const result = await databaseManager.getAggregatedStats({
    fromDate: sixMonthsAgo,
    toDate: now,
    groupBy: 'month'
  });
  
  if (result.success && result.data) {
    const stats = result.data;
    
    console.log('6-Month Performance Trend:');
    console.log(`Total sessions: ${stats.totalSessions}`);
    console.log(`Total keystrokes: ${stats.totalKeystrokes.toLocaleString()}`);
    console.log(`Average WPM: ${stats.averageWpm.toFixed(1)}`);
    console.log(`Best WPM: ${stats.bestWpm}`);
    console.log(`Total typing time: ${Math.round(stats.totalTypingTime / 1000 / 60)} minutes`);
  }
  
  // 언어별 성능 비교
  const languages = ['korean', 'english'];
  
  for (const language of languages) {
    const langResult = await databaseManager.getAggregatedStats({
      fromDate: sixMonthsAgo,
      toDate: now,
      language: language
    });
    
    if (langResult.success && langResult.data) {
      console.log(`\n${language.toUpperCase()} Performance:`);
      console.log(`Average WPM: ${langResult.data.averageWpm.toFixed(1)}`);
      console.log(`Sessions: ${langResult.data.totalSessions}`);
    }
  }
};

await analyzeTrends();
```

### 자동 백업 시스템

```typescript
import { DatabaseManager } from '../main/managers/DatabaseManager';

const databaseManager = new DatabaseManager();

class AutoBackupManager {
  private backupInterval: NodeJS.Timeout | null = null;
  private maxBackups = 7; // 최대 7개 백업 유지

  constructor(private databaseManager: DatabaseManager) {}

  public startAutoBackup(): void {
    // 매일 자정에 백업 실행
    const scheduleBackup = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(async () => {
        await this.performBackup();
        this.startAutoBackup(); // 다음 백업 스케줄링
      }, msUntilMidnight);
    };

    scheduleBackup();
    console.log('Auto backup scheduled for midnight');
  }

  public stopAutoBackup(): void {
    if (this.backupInterval) {
      clearTimeout(this.backupInterval);
      this.backupInterval = null;
    }
  }

  private async performBackup(): Promise<void> {
    try {
      console.log('Starting automatic backup...');
      
      const result = await this.databaseManager.createBackup();
      
      if (result.success && result.data) {
        console.log(`Backup created: ${result.data.path}`);
        console.log(`Size: ${(result.data.size / 1024 / 1024).toFixed(2)} MB`);
        
        // 오래된 백업 정리
        await this.cleanupOldBackups();
      } else {
        console.error('Backup failed:', result.error);
      }
    } catch (error) {
      console.error('Backup error:', error);
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    // 백업 디렉토리에서 오래된 백업 파일 삭제 로직
    // 실제 구현에서는 파일 시스템 작업이 필요
    console.log(`Cleanup completed, keeping last ${this.maxBackups} backups`);
  }
}

// 자동 백업 시작
const autoBackup = new AutoBackupManager(databaseManager);
autoBackup.startAutoBackup();
```

### 데이터 정리 및 최적화

```typescript
import { DatabaseManager } from '../main/managers/DatabaseManager';

const databaseManager = new DatabaseManager();

// 정기적인 데이터 유지보수
const performMaintenance = async () => {
  console.log('Starting database maintenance...');
  
  // 1. 오래된 데이터 정리 (1년 이전)
  const cleanupResult = await databaseManager.cleanupOldData(365);
  if (cleanupResult.success) {
    console.log(`Cleaned up ${cleanupResult.data} old records`);
  }
  
  // 2. 데이터베이스 최적화
  const optimizeResult = await databaseManager.optimizeDatabase();
  if (optimizeResult.success) {
    console.log('Database optimization completed');
  }
  
  // 3. 백업 생성
  const backupResult = await databaseManager.createBackup();
  if (backupResult.success && backupResult.data) {
    console.log(`Backup created: ${backupResult.data.id}`);
  }
  
  // 4. 헬스 체크
  const health = await databaseManager.healthCheck();
  console.log('Database health:', health.healthy ? 'Good' : 'Issues detected');
  
  console.log('Maintenance completed');
};

// 주간 유지보수 스케줄링
setInterval(performMaintenance, 7 * 24 * 60 * 60 * 1000); // 7일마다
```

### 사용자 설정 관리

```typescript
import { DatabaseManager } from '../main/managers/DatabaseManager';

const databaseManager = new DatabaseManager();

class UserSettingsManager {
  constructor(private databaseManager: DatabaseManager) {}

  public async loadUserSettings(userId: string): Promise<UserPreferences | null> {
    const result = await this.databaseManager.getUserPreferences(userId);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    // 기본 설정 반환
    return {
      theme: 'light',
      language: 'korean',
      autoSave: true,
      soundEnabled: true
    };
  }

  public async saveUserSettings(userId: string, preferences: UserPreferences): Promise<boolean> {
    const result = await this.databaseManager.saveUserPreferences(userId, preferences);
    return result.success;
  }

  public async resetUserSettings(userId: string): Promise<boolean> {
    const defaultPreferences: UserPreferences = {
      theme: 'light',
      language: 'korean',
      autoSave: true,
      soundEnabled: true
    };
    
    return await this.saveUserSettings(userId, defaultPreferences);
  }
}

// 사용 예제
const settingsManager = new UserSettingsManager(databaseManager);

// 설정 로드
const settings = await settingsManager.loadUserSettings('user-123');
console.log('User settings:', settings);

// 설정 변경
const newSettings: UserPreferences = {
  ...settings,
  theme: 'dark',
  soundEnabled: false
};

const saved = await settingsManager.saveUserSettings('user-123', newSettings);
if (saved) {
  console.log('Settings saved successfully');
}
```

## 성능 최적화

### 연결 풀링

```typescript
// 연결 풀 설정
const databaseManager = new DatabaseManager({
  poolSize: 10,
  connectionTimeout: 5000,
  idleTimeout: 30000
});
```

### 배치 처리

```typescript
// 여러 세션을 배치로 저장
const saveBatchSessions = async (sessions: TypingSession[]) => {
  const results = await Promise.all(
    sessions.map(session => databaseManager.saveSession(session))
  );
  
  const successCount = results.filter(r => r.success).length;
  console.log(`Saved ${successCount}/${sessions.length} sessions`);
};
```

### 캐싱

```typescript
// 자주 조회되는 데이터 캐싱
class DatabaseCache {
  private cache = new Map<string, any>();
  private ttl = 5 * 60 * 1000; // 5분

  async getCachedStats(key: string, fetcher: () => Promise<any>): Promise<any> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    
    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    
    return data;
  }
}
```

## 문제 해결

### 연결 문제 디버깅

```typescript
// 연결 상태 모니터링
setInterval(async () => {
  const status = databaseManager.getConnectionStatus();
  
  if (!status.connected) {
    console.warn('Database connection lost, attempting reconnect...');
    
    try {
      await databaseManager.connect();
      console.log('Reconnection successful');
    } catch (error) {
      console.error('Reconnection failed:', error);
    }
  }
}, 10000); // 10초마다 체크
```

### 데이터 무결성 검증

```typescript
// 데이터 무결성 체크
const validateData = async () => {
  const result = await databaseManager.getSessions({ limit: 100 });
  
  if (result.success && result.data) {
    const sessions = result.data;
    
    for (const session of sessions) {
      // 세션 데이터 검증
      if (session.wpm < 0 || session.wpm > 300) {
        console.warn(`Invalid WPM in session ${session.id}: ${session.wpm}`);
      }
      
      if (session.accuracy < 0 || session.accuracy > 100) {
        console.warn(`Invalid accuracy in session ${session.id}: ${session.accuracy}`);
      }
      
      if (session.endTime < session.startTime) {
        console.warn(`Invalid time range in session ${session.id}`);
      }
    }
  }
};

// 주기적으로 검증 실행
setInterval(validateData, 60 * 60 * 1000); // 1시간마다
```

## 관련 문서

- [UnifiedHandler API](./unified-handler.md)
- [StatsManager API](./stats-manager.md)
- [Data Models](./data-models.md)
- [Configuration](./configuration.md)
- [Architecture](./architecture.md)
