# Data Sync Manager API

## 개요
`DataSyncManager`는 Loop 프로젝트의 데이터 동기화 및 백업 모듈입니다. 클라우드 동기화, 백업/복원, 충돌 해결, 오프라인 지원을 제공합니다.

## 주요 기능

### ☁️ 클라우드 동기화
- 실시간 데이터 동기화
- 다중 디바이스 지원
- 자동 백업 및 복원

### 🔄 충돌 해결
- 자동 충돌 감지
- 다양한 병합 전략
- 수동 충돌 해결 지원

### 📡 오프라인 지원
- 오프라인 큐 관리
- 네트워크 복구 시 자동 동기화
- 로컬 캐시 관리

## API 참조

### 클래스: DataSyncManager

#### 생성자
```typescript
constructor()
```

#### 주요 메서드

##### `initialize(): Promise<void>`
- 동기화 관리자 초기화
- 설정 로드
- 네트워크 상태 확인

##### `start(): Promise<void>`
- 동기화 서비스 시작
- 자동 동기화 활성화
- 오프라인 큐 처리 시작

##### `stop(): Promise<void>`
- 동기화 서비스 중지
- 진행 중인 동기화 완료 대기

##### `sync(data: SyncData): Promise<SyncResult>`
- 데이터 동기화 실행
```typescript
interface SyncData {
  id: string;
  type: 'settings' | 'typing-sessions' | 'statistics';
  data: unknown;
  timestamp: Date;
  checksum: string;
}

interface SyncResult {
  success: boolean;
  conflicts?: ConflictInfo[];
  error?: string;
  syncedAt: Date;
}
```

##### `backup(): Promise<BackupResult>`
- 전체 데이터 백업
```typescript
interface BackupResult {
  success: boolean;
  backupId: string;
  size: number;
  timestamp: Date;
  error?: string;
}
```

##### `restore(backupId: string): Promise<RestoreResult>`
- 백업에서 데이터 복원
```typescript
interface RestoreResult {
  success: boolean;
  restoredItems: number;
  conflicts?: ConflictInfo[];
  error?: string;
}
```

##### `resolveConflict(conflictId: string, resolution: ConflictResolution): Promise<void>`
- 충돌 수동 해결
```typescript
interface ConflictResolution {
  strategy: 'local' | 'remote' | 'merge' | 'custom';
  customData?: unknown;
}
```

##### `getSyncStatus(): SyncStatus`
- 현재 동기화 상태 조회
```typescript
interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingItems: number;
  conflicts: number;
  syncInProgress: boolean;
}
```

#### 이벤트

##### `syncStarted`
```typescript
emit('syncStarted', { type: string, itemCount: number })
```

##### `syncCompleted`
```typescript
emit('syncCompleted', result: SyncResult)
```

##### `syncFailed`
```typescript
emit('syncFailed', { error: string, retryCount: number })
```

##### `conflictDetected`
```typescript
emit('conflictDetected', conflict: ConflictInfo)
```

##### `networkStatusChanged`
```typescript
emit('networkStatusChanged', { isOnline: boolean })
```

## 설정

### 동기화 설정
```typescript
const SYNC_CONFIG = {
  AUTO_SYNC_INTERVAL: 300000,    // 5분마다 자동 동기화
  RETRY_ATTEMPTS: 3,             // 실패 시 재시도 횟수
  RETRY_DELAY: 5000,             // 재시도 간격 (ms)
  BACKUP_RETENTION: 30,          // 백업 보관 기간 (일)
  CONFLICT_RESOLUTION: 'merge'   // 기본 충돌 해결 방식
};
```

### 클라우드 제공자
```typescript
const CLOUD_PROVIDERS = {
  GOOGLE_DRIVE: 'google-drive',
  DROPBOX: 'dropbox',
  ONEDRIVE: 'onedrive',
  ICLOUD: 'icloud'
};
```

## 사용 예시

```typescript
import { DataSyncManager } from './managers/DataSyncManager';

const syncManager = new DataSyncManager();

// 초기화 및 시작
await syncManager.initialize();
await syncManager.start();

// 이벤트 리스너 등록
syncManager.on('syncCompleted', (result) => {
  if (result.success) {
    console.log('동기화 완료');
  } else {
    console.log('동기화 실패:', result.error);
  }
});

syncManager.on('conflictDetected', (conflict) => {
  console.log('충돌 감지:', conflict.description);
  // 자동 해결 또는 사용자에게 알림
});

// 데이터 동기화
const syncData = {
  id: 'settings-001',
  type: 'settings',
  data: userSettings,
  timestamp: new Date(),
  checksum: calculateChecksum(userSettings)
};

const result = await syncManager.sync(syncData);

// 백업 생성
const backupResult = await syncManager.backup();
console.log('백업 ID:', backupResult.backupId);

// 상태 확인
const status = syncManager.getSyncStatus();
console.log('온라인:', status.isOnline);
console.log('대기 중인 항목:', status.pendingItems);
```

## 충돌 해결

### 자동 해결 전략

#### Merge 전략
```typescript
// 필드별 병합
const mergedData = {
  ...localData,
  ...remoteData,
  // 타임스탬프가 더 최신인 값 선택
  lastModified: Math.max(localData.lastModified, remoteData.lastModified)
};
```

#### Last-Write-Wins 전략
```typescript
// 가장 최근에 수정된 데이터 사용
const winnerData = localData.timestamp > remoteData.timestamp 
  ? localData 
  : remoteData;
```

### 수동 해결
```typescript
// 충돌 정보 조회
const conflicts = syncManager.getPendingConflicts();

// 충돌 해결
await syncManager.resolveConflict(conflictId, {
  strategy: 'merge',
  customData: mergedResult
});
```

## 오프라인 지원

### 오프라인 큐
```typescript
// 오프라인 상태에서 동기화 요청
await syncManager.sync(data); // 큐에 추가됨

// 네트워크 복구 시 자동으로 처리
syncManager.on('networkStatusChanged', ({ isOnline }) => {
  if (isOnline) {
    console.log('온라인 복구 - 대기 중인 동기화 처리 시작');
  }
});
```

### 캐시 관리
```typescript
// 로컬 캐시 크기 조회
const cacheSize = syncManager.getCacheSize();

// 캐시 정리
await syncManager.clearCache();

// 선택적 캐시 정리
await syncManager.clearCache({ olderThan: 7 }); // 7일 이전 데이터
```

## 백업 관리

### 자동 백업
```typescript
// 자동 백업 설정
syncManager.setAutoBackup({
  enabled: true,
  interval: 24 * 60 * 60 * 1000, // 24시간마다
  retention: 30 // 30일 보관
});
```

### 백업 목록 조회
```typescript
const backups = await syncManager.listBackups();
backups.forEach(backup => {
  console.log(`${backup.id}: ${backup.timestamp} (${backup.size} bytes)`);
});
```

### 증분 백업
```typescript
// 변경된 데이터만 백업
const incrementalBackup = await syncManager.createIncrementalBackup();
```

## 로깅

모든 동기화 활동은 Logger를 통해 기록됩니다:
- 동기화 시작/완료
- 충돌 감지 및 해결
- 네트워크 상태 변화
- 백업/복원 작업
- 에러 및 재시도 정보
