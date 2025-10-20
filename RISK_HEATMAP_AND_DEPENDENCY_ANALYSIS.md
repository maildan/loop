# 🔥 Loop 프로젝트 - 위험 영역 히트맵 & 의존성 분석

> **목적**: 프로젝트의 **위험 집중도**와 **모듈 간 의존성** 시각화

**작성일**: 2025-10-20

---

## 📊 1. 위험도 히트맵 (Risk Heat Map)

```
            복잡도 (Complexity)
              낮음  중간  높음
            ┌─────────────────┐
      높음  │     │███│ CRI  │  ← main/handlers/projectIpcHandlers.ts (1251줄, N+1)
심각도            │███│███│        ← main/core/ApplicationBootstrapper.ts (Race Condition)
            │███│███│ HI   │  ← DatabaseManager, MemoryManager
      중간  │███│███│ MED  │  ← OpenAIService, settingsIpcHandlers
            │ █ │ █ │ LO   │  ← 타입, 유틸리티 모듈
            └─────────────────┘
            
범례:
  CRI = Critical (즉시 조치)
  HI  = High (이번 주)
  MED = Medium (다음 주)
  LO  = Low (백로그)
```

### 모듈별 위험도 점수 (0-100)

```
🔴 Critical Zone (80-100)
  ├─ projectIpcHandlers.ts ..................... 92 ⚠️ N+1, 동시성, 에러 처리
  ├─ ApplicationBootstrapper.ts ................ 88 ⚠️ Race condition, 초기화
  ├─ aiIpcHandlers.ts ......................... 85 ⚠️ 타임아웃, API 키, 동시 요청
  ├─ ManagerCoordinator.ts .................... 82 ⚠️ 부분 초기화, 복구 전략
  └─ DatabaseManager.ts ....................... 80 ⚠️ 마이그레이션, SQLite 잠금

🟠 High Zone (60-79)
  ├─ MemoryManager.ts ......................... 75 ⚠️ GC 강제 트리거, 누수 감지
  ├─ databaseIpcHandlers.ts ................... 73 ⚠️ 백업 무결성, 복원 롤백
  ├─ geminiIpcHandlers.ts ..................... 72 ⚠️ 스트리밍, 컨텍스트 윈도우
  ├─ ProjectDetail.tsx ........................ 70 ⚠️ 자동 저장, 대용량 성능
  ├─ OpenAIService.ts ......................... 68 ⚠️ 재시도, 프롬프트 인젝션
  ├─ UpdaterManager.ts ........................ 65 ⚠️ 다운로드 중 종료, 롤백
  ├─ googleOAuthService.ts .................... 64 ⚠️ CSRF, 토큰 저장, 갱신
  └─ WindowManager.ts ......................... 62 ⚠️ 위치 복원, 다중 모니터

🟡 Medium Zone (40-59)
  ├─ SettingsWatcher.ts ....................... 58 ⚠️ 감지 구현, 지연, 중복
  ├─ ThemeManager.ts .......................... 55 ⚠️ 테마 동기화, 캐시 일관성
  ├─ NotificationManager.ts ................... 54 ⚠️ 권한 캐싱, 재시도
  ├─ LogManager.ts ............................ 52 ⚠️ 파일 크기, 순환, 민감 정보
  ├─ AI.tsx ................................... 51 ⚠️ 스트리밍 취소, 에러 표시
  ├─ CacheManager.ts .......................... 50 ⚠️ 무효화, 메모리 누수
  ├─ preload/index.ts ......................... 48 ⚠️ 응답 타입, 버퍼, 에러
  ├─ PrismaService.ts ......................... 47 ⚠️ 성능, 연결 풀, 재연결
  └─ databaseIpcHandlers.ts ................... 46 ⚠️ 설정 검증, 마이그레이션, 암호화

🟢 Low Zone (0-39)
  ├─ WriterStatsPanel.tsx ..................... 38 ⚠️ 동기화, IPC 빈도, 차트
  ├─ TrayManager.ts ........................... 35 ⚠️ 아이콘 관리
  ├─ ShortcutsManager.ts ...................... 32 ⚠️ 단축키 충돌
  ├─ MenuManager.ts ........................... 30 ⚠️ 메뉴 상태 동기화
  ├─ Authentication.tsx ....................... 28 ⚠️ 토큰 갱신
  ├─ types/ .................................... 25 ⚠️ Prisma 동기화
  ├─ validation/ ............................... 22 ⚠️ 검증 오버헤드
  ├─ utils/ .................................... 18 ⚠️ 엣지 케이스
  └─ constants/ ................................ 10 ⚠️ 하드코딩
```

---

## 📈 2. 모듈 간 의존성 그래프

```
                    ┌─────────────────────────────────────┐
                    │   Electron App Entry (index.ts)     │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │ ApplicationBootstrapper     │
                    │ (메인 오케스트레이터)        │
                    └──────────────┬──────────────┘
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
      ┌──────▼────────┐    ┌───────▼────────┐   ┌──────▼────────┐
      │ ManagerCoord  │    │ IPC Handlers   │   │ Security      │
      │ (16 Managers) │    │ (32 Handlers)  │   │ Setup         │
      └──────┬────────┘    └───────┬────────┘   └──────┬────────┘
             │                     │                     │
    ┌────────┼──────┬──────┬──────┬────────┐            │
    │        │      │      │      │        │            │
┌───▼──┐  ┌──▼──┐ ┌─▼──┐ ┌─▼──┐ ┌─▼──┐  ┌─▼──┐        │
│Memory│  │Menu │ │DB  │ │IPC │ │Wind│  │Tray│        │
│Mgr   │  │Mgr  │ │Mgr │ │Mgr │ │Mgr │  │Mgr │        │
└───┬──┘  └─────┘ └─┬──┘ └─┬──┘ └────┘  └────┘        │
    │               │      │                           │
    └───────────────┼──────┼────────────────────────────┤
                    │      │                            │
              ┌─────▼──────▼──────┐                    │
              │   Prisma Client   │◄───────────────────┘
              │  (Database Layer) │
              └─────────┬─────────┘
                        │
                ┌───────▼────────┐
                │  SQLite DB     │
                │ (schema.prisma)│
                └────────────────┘


IPC 호출 경로 (Renderer ↔ Main):

  Renderer (React)
       │
       │ window.electronAPI.projects.create(data)
       ▼
  Preload (contextBridge)
       │
       │ ipcRenderer.invoke('projects:create', data)
       ▼
  Main Process (IPC Handler)
       │
       │ await prisma.project.create({ data })
       ▼
  Prisma Service
       │
       │ INSERT INTO projects
       ▼
  SQLite Database
       │
       │ { id: "cuid_123", title: "My Novel", ... }
       ▼
  Main Process (Response)
       │
       │ event.reply()
       ▼
  Preload (contextBridge)
       │
       │ Promise resolve
       ▼
  Renderer (React) → UI 업데이트
```

---

## 🔗 3. 의존성 강도 분석

### 강한 의존성 (Strong Coupling) ⚠️

```
패턴 1: 순환 의존성
  ├─ ApplicationBootstrapper
  │  └─ ManagerCoordinator
  │     └─ DatabaseManager
  │        └─ PrismaService
  │           └─ ???? (역순 참조 확인 필요)
  
패턴 2: Singleton 강결합
  ├─ Main 프로세스의 모든 매니저 Singleton
  │  ├─ MemoryManager.getInstance()
  │  ├─ DatabaseManager.getInstance()
  │  └─ ... (16개 모두)
  └─ 문제: 단위 테스트 불가, Mock 어려움

패턴 3: 동기적 IPC 호출 불가
  ├─ Renderer UI
  │  └─ (항상) Main 프로세스 기다림
  │     └─ 만약 Main 블로킹되면 → UI 프리징
  
패턴 4: 환경변수 의존
  ├─ EnvironmentService
  │  └─ 모든 매니저, 서비스
  │     └─ .env 파일 손상 → 캐스케이드 실패
```

### 약한 의존성 (Loose Coupling) ✅

```
패턴 1: IPC 메시지 기반
  ├─ Renderer ⟷ Main
  │  └─ JSON 스키마로만 통신
  │     └─ 구현 변경 자유도 높음

패턴 2: 데이터베이스 추상화
  ├─ IPC 핸들러 ⟷ Prisma
  │  └─ Prisma API로만 상호작용
  │     └─ SQL 쿼리 보이지 않음

패턴 3: 로깅 시스템 독립
  ├─ Logger.info() 호출
  │  └─ 구현 세부사항 감춤
```

---

## ⚠️ 4. 위험 전파 분석 (Risk Propagation)

### Failure Cascade 시나리오

```
🔴 Scenario 1: Database 연결 실패
  │
  └─ DatabaseManager.initialize() 실패
     │
     ├─ ManagerCoordinator.initializePhase1() 실패
     │  │
     │  └─ ApplicationBootstrapper.bootstrap() 실패
     │     │
     │     └─ 앱 부팅 불가 ❌
     │        (모든 기능 비활성화)
     │
     └─ 영향: 100% 앱 사용 불가

🔴 Scenario 2: IPC Handler 등록 실패
  │
  └─ Renderer IPC 호출
     │
     ├─ Handler 없음 → Timeout
     │
     └─ 영향: 특정 기능만 제한

🔴 Scenario 3: Memory Leak (MemoryManager)
  │
  ├─ 메모리 지속 증가
  │
  ├─ 임계값 도달 → GC 강제 트리거
  │  │
  │  └─ UI 응답 정지 (50-500ms)
  │
  └─ 사용자 경험 저하 ⚠️

🔴 Scenario 4: SQLite 동시 쓰기
  │
  ├─ Handler 1: projects:update (쓰기 중)
  │
  ├─ Handler 2: projects:create (대기)
  │  │
  │  └─ SQLITE_BUSY → 재시도? 에러 응답?
  │
  └─ 영향: 데이터 일관성 위험

🔴 Scenario 5: API 키 노출
  │
  ├─ console.log(apiResponse) (개발 중)
  │
  ├─ 프로덕션 빌드에서 로그 제거 안 됨
  │
  ├─ 사용자 콘솔에서 API 키 노출
  │  │
  │  └─ 공격자가 API 키 탈취
  │
  └─ 비용 폭증, 계정 탈취 🔓
```

---

## 🎯 5. 병목 지점 (Bottlenecks)

```
📍 Main Process Bottleneck:
   ├─ 모든 IPC 요청 직렬 처리
   │  (Node.js 이벤트 루프 단일 스레드)
   │
   ├─ 특정 핸들러가 오래 걸리면
   │  │
   │  └─ 다른 IPC 요청 모두 대기
   │
   └─ 영향: 동시성 제한

📍 Database Bottleneck:
   ├─ SQLite 동시 쓰기 1개만 허용
   │
   ├─ IPC 핸들러 10개가 동시에 쓰기 시도
   │  │
   │  └─ SQLITE_BUSY 에러
   │
   └─ 영향: 데이터 손실 또는 느린 응답

📍 IPC Channel Bottleneck:
   ├─ 대용량 응답 (>10MB) → 버퍼 오버플로우
   │
   └─ 영향: IPC 응답 실패

📍 Memory Bottleneck:
   ├─ Renderer에 대용량 프로젝트 로드
   │  (100,000줄 텍스트)
   │
   ├─ UI 렌더링 지연
   │
   └─ 영향: 프리징

📍 API Bottleneck:
   ├─ OpenAI/Gemini API 요청
   │  (평균 2-10초 응답 시간)
   │
   ├─ 사용자가 동시에 여러 분석 요청
   │  │
   │  └─ API 할당량 초과 → 요금 폭증
   │
   └─ 영향: 비용 문제
```

---

## 🔀 6. 데이터 흐름 위험 분석

### 흐름 1: 사용자 프로젝트 생성 (Safe ✅ / Risky ⚠️)

```
사용자 입력
    │
    ├─ [Form] Input validation (Zod) ..................... ✅
    │
    ├─ [Renderer] React state update .................... ✅
    │
    ├─ [Preload] contextBridge 통과 .................... ✅
    │
    ├─ [IPC] 메시지 직렬화 ................................ ✅
    │
    ├─ [Main] IPC 핸들러 역직렬화 ........................ ✅
    │
    ├─ [Main] 입력 재검증 (Zod) ......................... ⚠️ 재검증 필요?
    │
    ├─ [Prisma] 타입 체크 ............................... ✅
    │
    ├─ [SQLite] INSERT ................................. ⚠️ 트랜잭션? 없음
    │
    ├─ [Prisma] 결과 반환 ............................... ✅
    │
    ├─ [IPC] 응답 직렬화 ................................. ✅
    │
    ├─ [Preload] 응답 역직렬화 .......................... ✅
    │
    └─ [Renderer] UI 업데이트 ........................... ⚠️ 지연? 즉시?

⚠️ 위험 지점:
   1. 재검증 누락 (Main에서)
   2. 트랜잭션 미사용
   3. 응답 지연
   4. 에러 처리 불명확
```

### 흐름 2: AI 분석 요청 (High Risk 🔴)

```
사용자 "분석" 클릭
    │
    ├─ [Renderer] Loading 상태 ......................... ✅
    │
    ├─ [IPC] ai:analyze-text 호출 ..................... ⚠️ 타임아웃?
    │
    ├─ [Main] API 요청 생성 ........................... ⚠️ 키 노출?
    │
    ├─ [Network] OpenAI API 호출 ..................... ⚠️ 느림 (2-10s)
    │  │
    │  └─ 동시 요청 10개 → 비용 폭증 🔓
    │
    ├─ [Main] 응답 스트리밍? .......................... ⚠️ 대용량?
    │
    ├─ [IPC] 버퍼 오버플로우? ......................... 🔴
    │
    ├─ [Renderer] UI 업데이트 ......................... ⚠️ 부분? 전체?
    │
    └─ [DB] 결과 저장 ................................ ⚠️ 실패?

🔴 위험 지점:
   1. 타임아웃 없음
   2. 동시 요청 제한 없음
   3. 버퍼 오버플로우
   4. 취소 불가
   5. 에러 복구 전략 부재
```

### 흐름 3: 데이터베이스 백업 (Medium Risk 🟡)

```
사용자 "백업" 클릭
    │
    ├─ [Main] 백업 시작 ................................ ⚠️ 쓰기 차단?
    │  │
    │  ├─ [동시] Renderer "프로젝트 저장" 요청
    │  │  │
    │  │  └─ ❌ 데이터 불일치 가능
    │  │
    │  └─ [SQLite] SELECT * FROM projects
    │
    ├─ [File] backup.db 생성 .......................... ⚠️ 검증?
    │
    └─ 완료

🟡 위험 지점:
   1. 백업 중 쓰기 차단 안 함
   2. 파일 무결성 검증 없음
   3. 실패 시 복구 불가
```

---

## 📊 7. 위험도 우선순위 행렬

```
            영향도 (Impact)
            낮음    중간    높음
     높음  ┌────┬────┬────┐
            │    │ M  │ ⚠️1│  ← MUST FIX NOW (Critical)
복구        │    │    │    │     1. N+1 쿼리
비용        ├────┼────┼────┤     2. Race Condition
(시간)      │    │ M  │⚠️2 │     3. API 키 보안
     중간  │    │    │    │
            │    │    │    │
            ├────┼────┼────┤
     낮음   │ L  │ L  │ M  │  ← NICE TO HAVE
            │    │    │    │
            └────┴────┴────┘

우선순위 1: CRITICAL (이번 주)
  ├─ N+1 쿼리 최적화
  ├─ Race condition 해결
  ├─ API 키 보안 감사
  ├─ 트랜잭션 구현
  └─ 에러 복구 전략

우선순위 2: HIGH (다음 주)
  ├─ 메모리 누수 프로파일링
  ├─ 동시성 제한 (Rate limiter)
  ├─ 자동 저장 구현
  ├─ 타임아웃 설정
  └─ 마이그레이션 테스트

우선순위 3: MEDIUM (다음달)
  ├─ 권한 캐싱 동기화
  ├─ 로그 파일 로테이션
  ├─ 스트리밍 최적화
  └─ 성능 모니터링

우선순위 4: LOW (백로그)
  ├─ 코드 리팩토링
  ├─ 문서 개선
  └─ 개발자 경험 향상
```

---

## 🛡️ 8. 위험 완화 전략 (Mitigation)

### Strategy 1: Database 안정성

```
현재 상태:
  └─ SQLite, 동시성 제어 없음

위험: SQLITE_BUSY, 데이터 손실

해결책:
  ├─ Option 1: 뮤텍스 도입 (간단)
  │  └─ IPC 요청을 직렬화
  │     └─ 성능 저하 (하지만 안정)
  │
  ├─ Option 2: 트랜잭션 큐
  │  └─ 모든 쓰기를 큐에 넣고 순차 처리
  │     └─ 성능 + 안정성 균형
  │
  └─ Option 3: 데이터베이스 변경 (PostgreSQL)
     └─ 진입 장벽 높음 (비용, 복잡도)
```

### Strategy 2: IPC 성능

```
현재 상태:
  └─ N+1 쿼리, 버퍼 오버플로우 위험

위험: 느린 응답, 대량 데이터 손실

해결책:
  ├─ Option 1: 페이지네이션
  │  └─ projects:get-all → limit/offset
  │     └─ UI에서 lazy loading 구현
  │
  ├─ Option 2: 캐싱
  │  └─ Redis 또는 메모리 캐시
  │     └─ 자주 조회되는 데이터 캐싱
  │
  └─ Option 3: GraphQL
     └─ 클라이언트가 필요한 필드만 요청
        └─ 오버엔지니어링 (현재는 불필요)
```

### Strategy 3: API 보안

```
현재 상태:
  └─ API 키 환경변수, 로그에 기록될 수 있음

위험: 키 노출, 비용 폭증

해결책:
  ├─ Option 1: 로그 마스킹
  │  └─ 민감한 정보 제거
  │     └─ grep -r "api\|key\|token" → 검토
  │
  ├─ Option 2: 환경변수 검증
  │  └─ 필수 키 누락 시 앱 시작 불가
  │     └─ process.env.OPENAI_API_KEY || throw Error
  │
  └─ Option 3: 키 로테이션
     └─ 정기적으로 새 키 발급
        └─ 탈취된 키의 피해 최소화
```

### Strategy 4: 메모리 관리

```
현재 상태:
  └─ 싱글톤 매니저, GC 강제 트리거

위험: 메모리 누수, UI 프리징

해결책:
  ├─ Option 1: 메모리 프로파일링
  │  └─ Chrome DevTools → Memory tab
  │     └─ Heap snapshot 비교
  │
  ├─ Option 2: 이벤트 리스너 정리
  │  └─ 컴포넌트 언마운트 시 removeListener()
  │     └─ 모든 useEffect cleanup
  │
  └─ Option 3: 가상 렌더링
     └─ 대용량 리스트 → Virtual scrolling
        └─ react-window, react-virtualized
```

---

## 📈 9. 측정 기준 (Metrics)

### 성능 메트릭

```
✅ 측정 대상:

1. API 응답 시간
   ├─ projects:get-all < 500ms (100개 프로젝트)
   ├─ projects:get-all < 2000ms (1000개 프로젝트)
   └─ 목표: 99% 이하

2. IPC 응답 시간
   ├─ 중앙값 < 100ms
   ├─ p99 < 1000ms
   └─ 타임아웃: 5000ms

3. 메모리 사용량
   ├─ 초기: < 200MB
   ├─ 안정: < 500MB (1시간 사용)
   ├─ 경고: > 1000MB
   └─ 임계: > 2000MB (GC 강제)

4. CPU 사용량
   ├─ 대기: < 5%
   ├─ 문서 편집: < 30%
   └─ AI 분석: < 80%

5. 데이터베이스 성능
   ├─ SELECT avg response: < 50ms
   ├─ INSERT avg response: < 100ms
   └─ SQLITE_BUSY 에러: 0%

6. 네트워크
   ├─ AI API 요청: avg 3-10s
   ├─ 동시 요청: max 1 (rate limited)
   └─ 토큰 사용: monitored
```

### 품질 메트릭

```
✅ 측정 대상:

1. 에러율
   ├─ Critical: 0% (SLA: 99.95%)
   ├─ High: < 0.1%
   └─ Medium: < 1%

2. 테스트 커버리지
   ├─ 목표: > 80%
   ├─ Critical modules: 100%
   └─ Utilities: > 90%

3. 코드 정적 분석
   ├─ 심각 문제: 0
   ├─ 경고: < 10
   └─ Info: < 50

4. 타입 커버리지
   ├─ 목표: 100%
   ├─ any 사용: < 5군데
   └─ unknown 사용: < 10군데
```

---

## 🎯 결론

**Loop 프로젝트는 구조적으로 견고하지만, 동시성 제어와 에러 복구 메커니즘이 미흡합니다.**

### 즉시 조치 (This Sprint)

1. **N+1 쿼리 성능 테스트** (projectIpcHandlers.ts)
2. **Race condition 검증** (ApplicationBootstrapper.ts)
3. **API 키 보안 감시** (로그 마스킹, 환경변수 검증)
4. **메모리 프로파일링** (MemoryManager, 싱글톤)

### 다음주 조치

5. **동시성 제한** (Rate limiter, 뮤텍스)
6. **자동 저장 구현** (ProjectDetail.tsx)
7. **마이그레이션 테스트** (CI/CD)
8. **에러 복구 전략** (Phase 1 실패 시나리오)

### 지속적 모니터링

- 프로덕션 에러 로그 추적
- 메모리 누수 정기 프로파일링
- 성능 메트릭 대시보드
- 보안 감사 (월 1회)

