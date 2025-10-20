# 🔍 Loop 프로젝트 - 검증 체크리스트 (Verification Checklist)

> **목적**: 각 모듈별로 **실제 코드를 읽고 검증**해야 할 항목 나열

**작성일**: 2025-10-20  
**검증 상태**: ❌ 미검증 / ⚠️ 부분 검증 / ✅ 완료

---

## 1️⃣ Main Process Bootstrap Verification

### 1.1 Race Condition 검증

```typescript
// ❌ 검증 필요: ApplicationBootstrapper.ts
// Q: Renderer가 IPC 호출할 때 핸들러가 등록되었나?

[ ] 확인 사항 1: 
    - Phase 1 완료 시점이 명확한가?
    - 핸들러 등록이 Phase 1 내부인가, 외부인가?
    - 코드 위치: src/main/core/ApplicationBootstrapper.ts:XXX

[ ] 확인 사항 2:
    - Renderer는 언제 첫 IPC 호출을 시도하는가?
    - 코드 위치: src/renderer/src/App.tsx 또는 main.tsx

[ ] 확인 사항 3:
    - Window load 이벤트와 IPC 핸들러 등록 순서?
    - 코드 위치: src/main/core/ApplicationBootstrapper.ts:XXX

[ ] 확인 사항 4:
    - EnvironmentService.initialize() 부작용 없는가?
    - 코드 위치: src/main/services/EnvironmentService.ts
```

### 1.2 에러 복구 검증

```typescript
// ❌ 검증 필요: ManagerCoordinator.ts
// Q: 매니저 초기화 실패 시 어떻게 되나?

[ ] 확인 사항 1:
    - try-catch 블록이 Phase 1, 2, 3 각각에 있는가?
    - 코드 위치: src/main/core/ManagerCoordinator.ts:XXX

[ ] 확인 사항 2:
    - 매니저 초기화 실패 → 앱 강제 종료? 또는 계속 실행?
    - 정책이 명시되어 있는가?

[ ] 확인 사항 3:
    - 부분 초기화 상태에서의 기능 제한이 있는가?
    - 예: MemoryManager만 실패 → 메모리 모니터링 비활성?
```

### 1.3 Preload-Main 동기화 검증

```typescript
// ❌ 검증 필요: preload/index.ts ↔ handlers/

[ ] 확인 사항 1:
    - Preload의 모든 IPC 채널이 handlers에 등록되어 있는가?
    - 코드 비교:
      - src/preload/index.ts의 ipcRenderer.invoke() 호출 목록
      - src/main/handlers/index.ts의 ipcMain.handle() 등록 목록
    - 불일치 항목? 

[ ] 확인 사항 2:
    - 응답 타입 미매칭 가능성?
    - 예: Preload에서 Project[] 기대 → Main에서 Project 반환

[ ] 확인 사항 3:
    - keyboard.* API가 왜 모두 더미인가?
    - 코드 검색: grep "keyboard.*() =>" src/preload/index.ts
```

---

## 2️⃣ IPC Handler Verification

### 2.1 projectIpcHandlers.ts 검증

```typescript
// 🔴 Critical: src/main/handlers/projectIpcHandlers.ts (1251줄)

[ ] 확인 사항 1: N+1 쿼리
    - projects:get-all 핸들러 읽기
    - Prisma query에 include/select 사용 여부?
    - 코드: prisma.project.findMany({ include: { ... } })
    - 또는: prisma.project.findMany() // select 없음 → N+1!

[ ] 확인 사항 2: 트랜잭션
    - projects:create 핸들러에서 프로젝트 + 기본 구조 동시 생성?
    - prisma.$transaction() 사용?
    - 코드: prisma.$transaction([...])

[ ] 확인 사항 3: 입력 검증
    - 모든 IPC 핸들러에 Zod 검증이 있는가?
    - 검색: grep -n "parse\|safeParse" src/main/handlers/projectIpcHandlers.ts

[ ] 확인 사항 4: 에러 처리
    - try-catch 블록이 모든 핸들러에 있는가?
    - 에러 타입별 처리? (Validation vs Database vs Unknown)

[ ] 확인 사항 5: 응답 크기 제한
    - 대용량 프로젝트 조회 → 응답 몇 MB?
    - 페이지네이션 있는가?
    - 코드: limit, offset 파라미터?
```

### 2.2 aiIpcHandlers.ts 검증

```typescript
// 🔴 Critical: src/main/handlers/aiIpcHandlers.ts (419줄)

[ ] 확인 사항 1: 타임아웃
    - OpenAI API 호출에 타임아웃 설정?
    - 코드: axios.defaults.timeout? fetch timeout?
    - 기본값은 몇 초?

[ ] 확인 사항 2: API 키 노출
    - API 키가 응답에 포함되는가?
    - 코드 검색: grep -n "OPENAI_API_KEY\|GEMINI_API_KEY" src/main/handlers/aiIpcHandlers.ts

[ ] 확인 사항 3: 동시 요청 제한
    - 사용자가 "분석" 버튼 10번 클릭 → 10개 API 호출?
    - 큐 메커니즘? 또는 제한 없음?

[ ] 확인 사항 4: 스트리밍 응답
    - ai:send-message에서 스트리밍 구현?
    - 버퍼 오버플로우 방지?

[ ] 확인 사항 5: 에러 메시지
    - 사용자에게 민감한 정보 노출?
    - 예: "OpenAI API Error: invalid_request_error"
```

### 2.3 databaseIpcHandlers.ts 검증

```typescript
[ ] 확인 사항 1: 백업 무결성
    - 백업 중 쓰기 차단?
    - 파일 락? 또는 읽기만 가능?

[ ] 확인 사항 2: 복원 롤백
    - 복원 실패 시 이전 상태 복원?
    - 코드: backup 후 restore 실패 → recovery?

[ ] 확인 사항 3: 마이그레이션 자동 실행
    - 앱 시작 시 마이그레이션 자동 실행?
    - 실패 시? 앱 강제 종료? 또는 계속?
```

---

## 3️⃣ Manager Verification

### 3.1 MemoryManager.ts 검증

```typescript
// 🟡 Medium: src/main/managers/MemoryManager.ts

[ ] 확인 사항 1: 메모리 누수 감지
    - 메모리 지속 증가 패턴 감지 로직?
    - 절대값만 모니터링? 또는 증가율도 확인?

[ ] 확인 사항 2: GC 강제 트리거
    - global.gc() 호출 시점?
    - 빈도? → UI 끊김 가능성?

[ ] 확인 사항 3: 메모리 풀
    - "4개 메모리 풀" 구현 실제 확인?
    - 코드: grep -n "pool" src/main/managers/MemoryManager.ts
    - 또는 계획 단계?

[ ] 확인 사항 4: 임계값 기준
    - 80%, 90%, 95% → 근거?
    - 시스템 RAM에 따른 동적 조정?
```

### 3.2 DatabaseManager.ts 검증

```typescript
[ ] 확인 사항 1: 마이그레이션 자동 실행
    - prisma migrate deploy 자동 실행?
    - 실패 시 에러 처리?

[ ] 확인 사항 2: 연결 풀
    - Prisma 기본 풀 크기?
    - 병목 가능성?

[ ] 확인 사항 3: SQLite 잠금
    - 동시 쓰기 1개 제한 처리?
    - SQLITE_BUSY 재시도 로직?
```

### 3.3 WindowManager.ts 검증

```typescript
[ ] 확인 사항 1: 창 위치 복원
    - 저장된 좌표가 모니터 범위 밖이면?
    - 검증 로직?

[ ] 확인 사항 2: 다중 모니터
    - 모니터 제거 시나리오 처리?
```

### 3.4 UpdaterManager.ts 검증

```typescript
[ ] 확인 사항 1: 다운로드 중 종료
    - 불완전한 업데이트 파일?
    - 다음 실행 시 정리?

[ ] 확인 사항 2: 롤백 지원
    - 새 버전 문제 발견 → 이전 버전 복원?
    - 코드 확인
```

---

## 4️⃣ Service Verification

### 4.1 OpenAIService.ts 검증

```typescript
[ ] 확인 사항 1: 재시도 로직
    - 네트워크 오류 → 재시도?
    - 몇 번? 백오프 전략?
    - 코드: exponential backoff?

[ ] 확인 사항 2: 프롬프트 인젝션
    - 사용자 입력이 프롬프트에 직접 삽입?
    - 템플릿 방식 사용?

[ ] 확인 사항 3: 토큰 사용량 추적
    - API 응답에서 토큰 카운트 추출?
    - 누적? 모니터링?
```

### 4.2 googleOAuthService.ts 검증

```typescript
[ ] 확인 사항 1: CSRF 방어
    - OAuth state 파라미터 검증?
    - 코드: state 비교 로직?

[ ] 확인 사항 2: 토큰 저장
    - Keychain 암호화?
    - Plain text 저장?

[ ] 확인 사항 3: 토큰 갱신
    - refresh_token으로 자동 갱신?
    - 만료 감지 로직?
```

---

## 5️⃣ Renderer Verification

### 5.1 ProjectDetail.tsx 검증

```typescript
[ ] 확인 사항 1: 자동 저장
    - Tiptap 편집 → 얼마 후 자동 저장?
    - 코드: useEffect 의존성, 지연?
    - 또는 수동 저장만?

[ ] 확인 사항 2: 변경사항 추적
    - "저장하지 않음" 표시?
    - 사용자가 종료 전 경고?

[ ] 확인 사항 3: 대용량 문서
    - 100,000줄 렌더링 성능?
    - Virtual scrolling 사용?

[ ] 확인 사항 4: Undo/Redo
    - 히스토리 크기 제한?
    - 메모리 사용 모니터링?
```

### 5.2 AI.tsx 검증

```typescript
[ ] 확인 사항 1: 스트리밍 취소
    - 사용자 "중단" 버튼 → API 요청 취소?
    - AbortController 사용?

[ ] 확인 사항 2: 에러 표시
    - 사용자 친화적 메시지?
    - 원시 API 에러 노출?

[ ] 확인 사항 3: API 키 보안
    - 콘솔에 요청/응답 로깅?
    - 개발자 도구에서 노출?
```

### 5.3 WriterStatsPanel.tsx 검증

```typescript
[ ] 확인 사항 1: 실시간 동기화
    - 글 입력 → 통계 업데이트 지연?
    - 얼마나 자주 갱신?

[ ] 확인 사항 2: IPC 호출 빈도
    - 매 글자마다? 매 초마다?
    - Debounce/throttle?

[ ] 확인 사항 3: 차트 성능
    - 1년치 데이터 → 몇 개 점?
    - Recharts 렌더링 성능?
```

---

## 6️⃣ Preload Verification

### 6.1 keyboard API 검증

```typescript
// ❌ 의문: keyboard.* 모두 더미 구현

[ ] 확인 사항 1: 비활성화 이유
    - 왜 모니터링 기능 제거?
    - 보안? 성능? 기술 부채?

[ ] 확인 사항 2: 렌더러 코드 호환성
    - Renderer가 keyboard API 호출?
    - 항상 false 반환 → 버그?

[ ] 확인 사항 3: 제거 vs 더미
    - 완전 제거 나은가? 아니면 부분 활성화?
```

### 6.2 IPC 응답 검증

```typescript
[ ] 확인 사항 1: 응답 타입
    - Main 응답이 Preload 타입과 일치?
    - 예: Project[] vs Project?

[ ] 확인 사항 2: 에러 응답
    - 에러 시 응답 형식?
    - 예: { success: false, error: "..." }?

[ ] 확인 사항 3: 응답 크기
    - 대용량 응답 → 버퍼 오버플로우?
```

---

## 7️⃣ Database Verification

### 7.1 Schema 검증

```typescript
[ ] 확인 사항 1: 레거시 모델
    - TypingSession, KeyEvent 등 왜 남아있는가?
    - 완전 제거? 아니면 기능 재활성화?

[ ] 확인 사항 2: JSON 필드 구조
    - tags, criteria, metadata → 문서화?
    - 타입 정의?

[ ] 확인 사항 3: 외래키 제약
    - 모든 관계에 명시적 제약?
    - 고아 레코드 가능성?

[ ] 확인 사항 4: 인덱스
    - "9개 추가 인덱스 권장" → 아직 미적용?
    - 성능 테스트?
```

### 7.2 마이그레이션 검증

```typescript
[ ] 확인 사항 1: 마이그레이션 순서
    - 여러 개발자 동시 작업 → 충돌 방지?
    - 번호 관리 규칙?

[ ] 확인 사항 2: 롤백
    - down migration 정의?
    - 모든 마이그레이션 되돌릴 수 있나?

[ ] 확인 사항 3: 테스트
    - CI에서 마이그레이션 테스트?
    - 샌드박스 DB?
```

---

## 8️⃣ Security Verification

### 8.1 API 키 보안

```typescript
// 🔴 Critical

[ ] 확인 사항 1: 환경변수 로드
    - .env 파일 로드 시 검증?
    - 필수 키 누락 시?

[ ] 확인 사항 2: 키 접근 권한
    - Main process만? Renderer 접근 금지?
    - 코드 검색: OPENAI_API_KEY 사용 위치

[ ] 확인 사항 3: 키 전달 경로
    - IPC 응답에 포함? 절대 금지!
    - 검증: grep -r "process.env.OPENAI" src/renderer

[ ] 확인 사항 4: 로그 보안
    - API 키가 로그에 기록?
    - 마스킹?
```

### 8.2 OAuth 보안

```typescript
[ ] 확인 사항 1: CSRF 방어
    - state 파라미터 검증?
    - 세션에 저장 후 비교?

[ ] 확인 사항 2: 토큰 저장
    - Keychain (macOS) 암호화?
    - 렌더러 localStorage? 위험!

[ ] 확인 사항 3: Callback URL 검증
    - 리다이렉트 URL 화이트리스트?
    - 공격자 도메인으로 리다이렉트 방지?
```

### 8.3 CSP 보안

```typescript
[ ] 확인 사항 1: CSP 정책
    - production/development 분리?
    - 코드: src/main/core/security.ts

[ ] 확인 사항 2: 위반 리포팅
    - CSP 위반 감지 → 로깅?
```

---

## 9️⃣ Performance Verification

### 9.1 N+1 쿼리

```typescript
[ ] 확인 사항 1: 모든 API 엔드포인트
    - projects:get-all → eager loading?
    - 프로젝트 1000개 → 몇 개 쿼리?

[ ] 확인 사항 2: Prisma select/include
    - 코드 검사: 모든 findMany, findUnique 호출
    - include: {} 있는가?

[ ] 확인 사항 3: 성능 테스트
    - 1000+ 레코드에서 응답 시간?
```

### 9.2 메모리 누수

```typescript
[ ] 확인 사항 1: 이벤트 리스너
    - 컴포넌트 언마운트 시 리스너 제거?
    - 메모리 덤프 분석?

[ ] 확인 사항 2: 타이머/인터벌
    - setInterval 정리? clearInterval?
    - 매니저들 shutdown 시?

[ ] 확인 사항 3: 싱글톤
    - 매니저 싱글톤이 메모리에 영구 정착?
    - 앱 재시작 시에도 이전 상태?
```

---

## 🔟 Concurrency Verification

### 10.1 Race Condition

```typescript
[ ] 확인 사항 1: 동시 업데이트
    - 사용자 A, B가 동시에 프로젝트 수정
    - Last Write Wins? 또는 충돌 감지?

[ ] 확인 사항 2: Renderer 업데이트 지연
    - Main에서 저장 → Renderer에 반영 몇 ms?
    - 중간에 불일치?

[ ] 확인 사항 3: SQLite 잠금
    - 동시 쓰기 처리?
    - SQLITE_BUSY 재시도?
```

### 10.2 트랜잭션

```typescript
[ ] 확인 사항 1: ACID 준수
    - 프로젝트 + 캐릭터 동시 생성?
    - 부분 실패 시나리오?

[ ] 확인 사항 2: 격리 수준
    - Dirty read 가능?
    - 트랜잭션 격리 레벨?
```

---

## 📋 검증 체크리스트 완료 기준

```
✅ 완료 기준:
   - 모든 [ ] 항목 확인 완료
   - 코드 리뷰 또는 실제 테스트 수행
   - 문제점 발견 시 Issue 생성

⚠️ 우선순위:
   1. 🔴 Critical (이번 주)
   2. 🟠 High (다음 주)
   3. 🟡 Medium (다음달)
   4. 🟢 Low (백로그)
```

---

## 🎯 검증 일정

| 담당자 | 모듈 | 시작 | 종료 | 상태 |
|--------|------|------|------|------|
| - | main/core | - | - | ❌ |
| - | main/handlers | - | - | ❌ |
| - | main/managers | - | - | ❌ |
| - | main/services | - | - | ❌ |
| - | renderer | - | - | ❌ |
| - | preload | - | - | ❌ |
| - | database | - | - | ❌ |
| - | security | - | - | ❌ |

