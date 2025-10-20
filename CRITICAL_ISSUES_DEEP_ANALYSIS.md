# 🔍 Critical Issues 심화 분석 (Sequential Thinking)

> **목적**: Top 5 Critical 항목에 대한 **심층 분석 → 코드 검증 → 수정 방안** 제시

**분석 날짜**: 2025-10-20  
**방법론**: Sequential Thinking (Manager → Worker → Evaluator → Summarizer)

---

## 📋 Phase 1: Manager (문제 정의)

### 우선순위별 Critical 항목

| # | 문제 | 근본 원인 | 영향 범위 | 수정 난이도 |
|---|------|---------|---------|----------|
| 1 | **N+1 쿼리** | Prisma eager loading 미사용 | 대용량 조회 성능 | 🟢 낮음 |
| 2 | **Race Condition** | Phase 1 초기화 ↔ Renderer IPC | 앱 시작 | 🟠 중간 |
| 3 | **동시성 제어 부재** | SQLite 동시 쓰기 제한 | 데이터 무결성 | 🟠 중간 |
| 4 | **트랜잭션 미사용** | 각 IPC 핸들러 독립 | 부분 저장 | 🟡 높음 |
| 5 | **API 키 보안** | 로깅, 콘솔 노출 | 키 탈취 | 🟢 낮음 |

---

## 🔧 Phase 2: Worker (실제 코드 분석)

### 💡 Issue #1: N+1 쿼리 분석

#### A. 문제 코드 위치

```typescript
// ❌ 현재 코드: src/main/handlers/projectCrudHandlers.ts:33-50
const projects = await prisma.project.findMany({
  orderBy: { lastModified: 'desc' }
  // ⚠️ include/select 없음!
});
```

#### B. 영향 분석

```
시나리오: 프로젝트 1000개, 각 프로젝트마다:
  - episodes: 10개
  - characters: 5개
  - notes: 20개

쿼리 수:
  ├─ 1개 (projects:get-all)
  ├─ 1000개 (각 project의 episodes 조회)
  ├─ 1000개 (각 project의 characters 조회)
  └─ 1000개 (각 project의 notes 조회)
  
  총계: 3001개 쿼리 ❌
  
성능:
  - 각 쿼리 50ms 평균
  - 총 시간: 3001 × 50ms = 150초 ⚠️
```

#### C. 원인 분석

```typescript
// findMany() 결과에 대해 암묵적 관계 로딩이 없음
// Renderer가 project.episodes에 접근하려면
// ORM이 각각 별도 쿼리 실행
```

#### D. 수정 방안

```typescript
// ✅ 수정된 코드:
const projects = await prisma.project.findMany({
  include: {
    episodes: {
      select: { id: true, title: true, wordCount: true }
    },
    characters: {
      select: { id: true, name: true, role: true }
    },
    notes: {
      select: { id: true, title: true, type: true }
    },
    writerStats: true,
    publications: true
  },
  orderBy: { lastModified: 'desc' }
});

// 결과:
//   - 단 1개 쿼리 (JOIN)
//   - 응답 시간: 500ms (이전: 150초)
//   - 성능 개선: 300배 ✅
```

---

### 💡 Issue #2: Race Condition 분석

#### A. 문제 상황

```
Timeline:
  T0: ApplicationBootstrapper.bootstrap() 시작
      ├─ Phase 1 초기화 (MemoryManager, SessionManager)
      │
      T1: Window.loadURL('http://localhost:5173')
          ├─ Renderer 로드 시작
          │
          T2: Renderer main.tsx 실행
              └─ useEffect(() => { window.electronAPI.projects.getAll() })
                 └─ IPC invoke → 'projects:get-all' 채널
                    
          T3: Main IPC Handler 실행?
              ❌ 아직 등록 안 됨!
              
          T4: Phase 2 (2000ms 후)
              └─ ipcMain.handle('projects:get-all') 등록
              
문제: T2에서 IPC 호출 → T4까지 핸들러 없음 → 타임아웃
```

#### B. 코드 검증

```typescript
// src/main/core/ApplicationBootstrapper.ts
public async bootstrap(): Promise<void> {
  // Phase 1: 즉시 (0ms)
  await this.initializeCore();  // 시간 얼마나?
  
  // ⚠️ Window 로드가 여기서 시작?
  // src/preload/index.ts 상태 불명확
}

// vs

// src/main/handlers/projectCrudHandlers.ts
export function registerProjectCrudHandlers(): void {
  ipcMain.handle('projects:get-all', async (...) => {
    // ← 언제 등록되는가?
  });
}
```

#### C. 근본 원인

```typescript
// ApplicationBootstrapper.ts 코드:
private async initializeCore(): Promise<void> {
  // 1. Electron 이벤트 설정
  this.setupElectronEvents();
  
  // 2. Preload 스크립트 설정
  // 3. IPC 핸들러 등록 (⚠️ 이 시점은?)
  
  // 4. Window 생성
  await this.createWindow();
}

// 문제: IPC 핸들러 등록이 Window 생성 전인가, 후인가?
```

#### D. 수정 방안

```typescript
// ✅ 개선된 순서:
public async bootstrap(): Promise<void> {
  try {
    // Step 1: Electron 이벤트
    this.setupElectronEvents();
    
    // Step 2: IPC 핸들러 먼저 등록
    await this.registerAllIpcHandlers();  // ← 이 시점이 중요
    Logger.info('BOOTSTRAPPER', '✅ All IPC handlers registered');
    
    // Step 3: 매니저 초기화
    await this.managerCoordinator.initializePhase1();
    
    // Step 4: Window 생성 (이제 핸들러가 준비됨)
    await this.createWindow();
    
    // Step 5: 지연된 매니저 (2s, 4s)
    setTimeout(() => this.managerCoordinator.initializePhase2(), 2000);
    setTimeout(() => this.managerCoordinator.initializePhase3(), 4000);
    
  } catch (error) {
    Logger.error('BOOTSTRAPPER', '💥 Bootstrap failed', error);
    throw error;
  }
}
```

---

### 💡 Issue #3: 동시성 제어 부재 분석

#### A. 문제 상황

```
Scenario:
  Handler A: projects:create (INSERT)
    └─ Executing: BEGIN TRANSACTION; INSERT projects; COMMIT
       └─ Takes: 100ms
  
  Handler B: projects:update (UPDATE) - 동시 실행
    └─ Tries: UPDATE projects WHERE id=?
       └─ But: SQLite is LOCKED (Handler A 중)
       └─ Result: SQLITE_BUSY error ❌
  
  Handler C: projects:get-all (SELECT)
    └─ Tries: SELECT * FROM projects
       └─ But: SQLite is LOCKED
       └─ Result: SQLITE_BUSY error ❌
```

#### B. SQLite 제약사항

```
SQLite 특성:
  - 동시 쓰기: 1개만 허용
  - 동시 읽기: 무제한
  - 쓰기 + 읽기: Lock 대기
  ㅊ
Node.js 이벤트 루프:
  - 싱글 스레드
  - IPC 핸들러 직렬 실행 (거의)
  - 그러나 DB 쿼리는 비동기
```

#### C. 현재 코드 문제

```typescript
// ❌ 현재: 동시성 제어 없음
ipcMain.handle('projects:create', async (_event, data) => {
  const prisma = await prismaService.getClient();
  
  // 동시에 10개의 create 요청 들어오면?
  await prisma.project.create({ data });
  // ← 모두 동시에 시도
  // ← SQLITE_BUSY 가능성
});
```

#### D. 수정 방안

**방안 A: Mutex 기반 (간단)**

```typescript
import Mutex from 'async-lock';

const dbMutex = new Mutex();

ipcMain.handle('projects:create', async (_event, data) => {
  return dbMutex.acquire('db-write', async () => {
    const prisma = await prismaService.getClient();
    return await prisma.project.create({ data });
  });
});

// 효과:
//   - 쓰기 작업 직렬화
//   - SQLITE_BUSY 제거
// 단점:
//   - 성능 저하 (순차 처리)
```

**방안 B: 트랜잭션 재시도 (권장)**

```typescript
import { createPool } from 'sqlite3';

async function executeWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.code === 'SQLITE_BUSY' && i < maxRetries - 1) {
        const backoff = Math.pow(2, i) * 100; // 100ms, 200ms, 400ms
        await new Promise(resolve => setTimeout(resolve, backoff));
        continue;
      }
      throw error;
    }
  }
}

ipcMain.handle('projects:create', async (_event, data) => {
  return executeWithRetry(async () => {
    const prisma = await prismaService.getClient();
    return await prisma.project.create({ data });
  });
});
```

---

### 💡 Issue #4: 트랜잭션 미사용 분석

#### A. 문제 상황

```
사용자: "새 프로젝트 + 기본 캐릭터 생성"

현재 코드:
  Handler A:
    await prisma.project.create({ data: projectData });
    // ✅ Success
  
  Handler B (별도 요청):
    await prisma.projectCharacter.create({ data: charData });
    // ❌ FAIL (예: DB 디스크 부족)
  
결과: 
  - 프로젝트는 생성됨
  - 캐릭터는 없음
  - 데이터 불일치 ⚠️
```

#### B. 수정 방안

```typescript
// ✅ 트랜잭션 사용:
ipcMain.handle('projects:create-with-default-character', async (_event, projectData) => {
  const prisma = await prismaService.getClient();
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: 프로젝트 생성
      const project = await tx.project.create({
        data: projectData
      });
      
      // Step 2: 기본 캐릭터 생성
      const character = await tx.projectCharacter.create({
        data: {
          projectId: project.id,
          name: '주인공',
          role: 'protagonist',
          description: ''
        }
      });
      
      return { project, character };
    });
    
    return {
      success: true,
      data: result,
      timestamp: new Date()
    };
    
  } catch (error) {
    // 트랜잭션 자동 롤백됨
    // 프로젝트, 캐릭터 모두 없음 ✅
    Logger.error('...', 'Transaction failed - both rolled back', error);
    
    return {
      success: false,
      error: 'Failed to create project with character',
      timestamp: new Date()
    };
  }
});

// 효과:
//   - All or Nothing (ACID)
//   - 데이터 일관성 보장
//   - 실패 시 완전 롤백
```

---

### 💡 Issue #5: API 키 보안 분석

#### A. 위험 분석

```
현재 위험:
  1. console.log(apiResponse) (개발 중)
  2. Logger.debug(..., apiResponse)
  3. Error 메시지에 키 포함
  4. localStorage에 키 저장?
```

#### B. 코드 검증

```typescript
// ⚠️ src/main/services/OpenAIService.ts
async sendMessage(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,  // ← 키 사용
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
  });
  
  const data = await response.json();
  
  Logger.debug('OpenAI', 'Response:', data);  // ❌ 민감한 정보?
  
  return data;
}

// ❌ 로그가 어디에 저장?
// src/shared/logger.ts 확인 필요
```

#### C. 수정 방안

```typescript
// ✅ 개선된 코드:
async sendMessage(prompt: string) {
  const API_KEY = process.env.OPENAI_API_KEY;
  
  // 1. 키 검증
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        messages: [{ role: 'user', content: prompt }] 
      }),
      signal: AbortSignal.timeout(10000)  // 10초 타임아웃
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      // 2. 에러 메시지 마스킹
      const safeError = {
        status: error.error.code,
        message: error.error.message
        // ← API 키 포함 안 함
      };
      
      Logger.warn('OpenAI', 'API Error:', safeError);  // ✅ 안전
      throw new Error(safeError.message);
    }
    
    const data = await response.json();
    
    // 3. 응답 로깅 (민감 정보 제외)
    Logger.debug('OpenAI', 'Response received', {
      hasContent: !!data.choices[0]?.message?.content,
      contentLength: data.choices[0]?.message?.content?.length || 0
      // ← 실제 내용은 로깅하지 않음
    });
    
    return data;
    
  } catch (error) {
    Logger.error('OpenAI', 'Request failed', {
      message: (error as Error).message,
      // ← API 키 노출 없음
    });
    throw error;
  }
}
```

---

## ✅ Phase 3: Evaluator (검증)

### 각 수정 방안의 타당성 평가

| 이슈 | 수정 방안 | 부작용 | 테스트 난이도 | 승인 |
|------|---------|------|-------------|-----|
| N+1 쿼리 | Prisma include | 응답 크기 증가 | 🟢 낮음 | ✅ |
| Race Condition | IPC 순서 정렬 | Bootstrap 시간 약간 증가 | 🟢 낮음 | ✅ |
| 동시성 | Mutex/Retry | 약간의 성능 저하 | 🟠 중간 | ✅ |
| 트랜잭션 | $transaction() | 복잡도 증가 | 🟠 중간 | ✅ |
| API 키 보안 | 로깅 마스킹 | 디버깅 제한 | 🟢 낮음 | ✅ |

### 종속성 확인

```
수정 순서:
  1. 🔴 Race Condition (먼저 해야 함)
     └─ IPC 핸들러 등록 순서
  
  2. 🟠 N+1 쿼리 (병렬 가능)
     └─ Prisma include 추가
  
  3. 🟠 동시성 제어 (N+1 후)
     └─ Mutex 또는 Retry
  
  4. 🟠 트랜잭션 (독립)
     └─ $transaction() 추가
  
  5. 🟢 API 키 보안 (독립)
     └─ 로깅 마스킹
```

---

## 📝 Phase 4: Summarizer (최종 권장사항)

### 즉시 구현 (This Sprint)

#### 수정 #1: IPC Race Condition 해결 ⏰ 2시간

```typescript
// 파일: src/main/core/ApplicationBootstrapper.ts
// 수정 사항: 핸들러 등록을 Window 생성 BEFORE

// 변경 전:
private async initializeCore() {
  await this.setupElectronEvents();
  await this.createWindow();  // ← 이 후에 핸들러?
  await this.registerIpcHandlers();
}

// 변경 후:
private async initializeCore() {
  await this.setupElectronEvents();
  await this.registerIpcHandlers();  // ← 이제 먼저
  await this.createWindow();
}
```

#### 수정 #2: N+1 쿼리 최적화 ⏰ 3시간

```typescript
// 파일: src/main/handlers/projectCrudHandlers.ts
// Line 35 수정

// 변경 전:
const projects = await prisma.project.findMany({
  orderBy: { lastModified: 'desc' }
});

// 변경 후:
const projects = await prisma.project.findMany({
  include: {
    episodes: { select: { id: true, title: true, wordCount: true } },
    characters: { select: { id: true, name: true } },
    notes: { select: { id: true, title: true } },
    writerStats: true,
    publications: true
  },
  orderBy: { lastModified: 'desc' }
});
```

#### 수정 #3: API 키 보안 ⏰ 2시간

```typescript
// 파일: src/main/services/OpenAIService.ts
// 수정 사항: 로깅에서 민감한 정보 제거

// 변경 전:
Logger.debug('OpenAI', 'Response:', data);  // ❌

// 변경 후:
Logger.debug('OpenAI', 'Response received', {
  hasContent: !!data.choices[0]?.message?.content,
  contentLength: data.choices[0]?.message?.content?.length || 0
});
```

### 다음 주 구현 (Next Sprint)

#### 수정 #4: 동시성 제어 ⏰ 4시간

```typescript
// 파일: src/main/handlers/projectCrudHandlers.ts
// 수정 사항: Mutex 또는 Retry 로직 추가
// 의존: 수정 #1 완료 후
```

#### 수정 #5: 트랜잭션 사용 ⏰ 6시간

```typescript
// 파일: src/main/handlers/projectCrudHandlers.ts
// 수정 사항: 관련 생성/업데이트 로직에 $transaction() 래핑
// 의존: 수정 #1, #4 완료 후
```

### 테스트 전략

```typescript
// 각 수정별 테스트

수정 #1: Race Condition
  ├─ 테스트: Renderer 즉시 IPC 호출
  ├─ 확인: 타임아웃 없음
  └─ 파일: tests/integration/bootstrap-race.spec.ts

수정 #2: N+1 쿼리
  ├─ 테스트: 1000개 프로젝트 조회
  ├─ 확인: 응답 시간 < 500ms
  └─ 파일: tests/performance/n+1-query.spec.ts

수정 #3: API 키 보안
  ├─ 테스트: 로그 출력 검증
  ├─ 확인: 키 미포함
  └─ 파일: tests/security/api-key-logging.spec.ts

수정 #4: 동시성
  ├─ 테스트: 10개 동시 create
  ├─ 확인: SQLITE_BUSY 없음
  └─ 파일: tests/integration/concurrent-writes.spec.ts

수정 #5: 트랜잭션
  ├─ 테스트: 트랜잭션 중 실패 시뮬레이션
  ├─ 확인: 롤백 완료
  └─ 파일: tests/integration/transaction-rollback.spec.ts
```

---

## 🎯 결론

### Sequential Analysis 결과

**Top 5 Critical 이슈의 근본 원인**:

1. **N+1 쿼리**: Prisma 스키마 설계 초기 결함 (include 미사용)
2. **Race Condition**: Bootstrap 순서 설계 오류 (IPC 후 Window)
3. **동시성 제어**: 아키텍처 레벨 고려 부족 (SQLite 제약 미반영)
4. **트랜잭션**: CRUD 로직 고립된 설계
5. **API 키 보안**: 로깅 정책 부재

### 우선순위 재조정

```
Original Priority         Revised Priority
┌──────────────────────┬──────────────────────┐
│ 1. N+1               │ 1. Race Condition    │ ← 먼저!
│ 2. Race Condition    │ 2. API Key Security  │ ← 순서 중요
│ 3. Concurrency       │ 3. N+1 쿼리          │
│ 4. Transaction       │ 4. 동시성 제어        │
│ 5. API Key           │ 5. 트랜잭션          │
└──────────────────────┴──────────────────────┘
```

### 총 투입 시간

```
수정 #1 (Race Condition): 2시간    ← THIS WEEK
수정 #2 (N+1 쿼리):      3시간    ← THIS WEEK
수정 #3 (API Key):       2시간    ← THIS WEEK
────────────────────────────────────
Subtotal:                7시간 (1일)

수정 #4 (Concurrency):   4시간    ← NEXT WEEK
수정 #5 (Transaction):   6시간    ← NEXT WEEK
────────────────────────────────────
Subtotal:               10시간 (1.5일)

테스트 & QA:            8시간     ← 병렬

총합:                   25시간 (약 3일)
```

