# Memory Manager API

## 개요
`MemoryManager`는 Loop 프로젝트의 메모리 모니터링 및 최적화 모듈입니다. 실시간 메모리 사용량 추적, 자동 가비지 컬렉션, 메모리 풀 관리를 제공합니다.

## 주요 기능

### 📊 실시간 메모리 모니터링
- Node.js 메모리 사용량 추적
- 시스템 메모리 상태 모니터링
- 메모리 누수 감지

### 🔄 자동 최적화
- 임계값 기반 자동 가비지 컬렉션
- 메모리 풀 관리
- 백그라운드 정리 작업

### ⚠️ 알림 시스템
- 메모리 부족 경고
- 임계값 초과 알림
- 성능 저하 감지

## API 참조

### 클래스: MemoryManager

#### 생성자
```typescript
constructor()
```

#### 주요 메서드

##### `initialize(): Promise<void>`
- 메모리 관리자 초기화
- 임계값 설정
- 모니터링 시스템 준비

##### `start(): Promise<void>`
- 메모리 모니터링 시작
- 주기적 메모리 체크 활성화
- 자동 최적화 시작

##### `stop(): Promise<void>`
- 메모리 모니터링 중지
- 모든 타이머 정리

##### `getMemoryStats(): MemoryStats`
- 현재 메모리 통계 반환
```typescript
interface MemoryStats {
  rss: number;        // 물리 메모리 사용량
  heapTotal: number;  // 힙 전체 크기
  heapUsed: number;   // 힙 사용량
  external: number;   // C++ 객체 메모리
  arrayBuffers: number; // ArrayBuffer 메모리
  timestamp: Date;
}
```

##### `triggerGarbageCollection(): void`
- 수동 가비지 컬렉션 실행
- 메모리 정리 강제 실행

##### `optimizeMemory(): Promise<void>`
- 메모리 최적화 실행
- 불필요한 객체 정리
- 메모리 풀 정리

##### `setMemoryThreshold(threshold: number): void`
- 메모리 임계값 설정 (MB 단위)
- 자동 최적화 기준점 변경

##### `getMemoryUsagePercent(): number`
- 메모리 사용률 백분율 반환 (0-100)

#### 이벤트

##### `memoryWarning`
```typescript
emit('memoryWarning', stats: MemoryStats)
```

##### `memoryThresholdExceeded`
```typescript
emit('memoryThresholdExceeded', { threshold: number, current: number })
```

##### `memoryOptimized`
```typescript
emit('memoryOptimized', { before: MemoryStats, after: MemoryStats })
```

##### `memoryLeakDetected`
```typescript
emit('memoryLeakDetected', { trend: MemoryTrend, severity: 'low' | 'medium' | 'high' })
```

## 설정

### 기본 임계값
```typescript
const DEFAULT_CONFIG = {
  WARNING_THRESHOLD: 500,    // MB - 경고 임계값
  CRITICAL_THRESHOLD: 800,   // MB - 위험 임계값
  AUTO_GC_THRESHOLD: 300,    // MB - 자동 GC 임계값
  MONITORING_INTERVAL: 10000, // ms - 모니터링 주기
  OPTIMIZATION_INTERVAL: 60000 // ms - 최적화 주기
};
```

### 메모리 풀 설정
```typescript
const MEMORY_POOLS = {
  smallObjects: { size: 1024, count: 100 },
  mediumObjects: { size: 8192, count: 50 },
  largeObjects: { size: 65536, count: 10 }
};
```

## 사용 예시

```typescript
import { MemoryManager } from './managers/MemoryManager';

const memoryManager = new MemoryManager();

// 초기화 및 시작
await memoryManager.initialize();
await memoryManager.start();

// 이벤트 리스너 등록
memoryManager.on('memoryWarning', (stats) => {
  console.log('메모리 경고:', stats);
});

memoryManager.on('memoryThresholdExceeded', ({ threshold, current }) => {
  console.log(`메모리 임계값 초과: ${current}MB > ${threshold}MB`);
});

// 현재 메모리 상태 확인
const stats = memoryManager.getMemoryStats();
const usagePercent = memoryManager.getMemoryUsagePercent();

// 수동 최적화
await memoryManager.optimizeMemory();

// 임계값 변경
memoryManager.setMemoryThreshold(600); // 600MB로 설정
```

## 메모리 풀 관리

### 객체 풀 사용
```typescript
// 객체 풀에서 객체 가져오기
const buffer = memoryManager.getFromPool('medium');

// 객체 사용 후 풀에 반환
memoryManager.returnToPool('medium', buffer);
```

### 풀 통계
```typescript
const poolStats = memoryManager.getPoolStats();
console.log('활성 객체:', poolStats.active);
console.log('사용 가능 객체:', poolStats.available);
```

## 메모리 누수 감지

### 자동 감지
- 메모리 사용량 트렌드 분석
- 비정상적 증가 패턴 감지
- 임계값 기반 알림

### 수동 체크
```typescript
const leakReport = memoryManager.checkMemoryLeaks();
if (leakReport.hasLeaks) {
  console.log('메모리 누수 감지:', leakReport.details);
}
```

## 성능 최적화

### 가비지 컬렉션 최적화
- 적응형 GC 주기 조절
- 메모리 압박 상황 대응
- 백그라운드 정리 작업

### 메모리 압축
```typescript
// 메모리 압축 실행
await memoryManager.compactMemory();

// 압축 통계
const compactionStats = memoryManager.getCompactionStats();
```

## 로깅

모든 메모리 관련 활동은 Logger를 통해 기록됩니다:
- 메모리 사용량 변화
- 가비지 컬렉션 실행
- 최적화 작업 결과
- 메모리 누수 감지
- 성능 개선 효과
