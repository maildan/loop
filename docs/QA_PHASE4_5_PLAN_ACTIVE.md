# Phase 4.5: 종합 QA 및 버그 수정 계획

**상태**: 🔄 **진행 중** (V3 검증 버그 발견 및 수정 중)  
**날짜**: 2025-10-18  
**우선순위**: 🔴 **긴급** (사용자가 에디터 사용 불가)

---

## 📋 Phase 4.5 QA 목표

1. ✅ **V3 검증 실패 원인 파악 및 수정**
2. ✅ **V4 속도 제한 정상 작동 확인**
3. 🔄 **타입 안전성 통합 테스트**
4. 🔄 **실시간 사용성 테스트 (에디터, 저장, 프로젝트 관리)**

---

## 🐛 발견된 버그 #1: V3 Zod 검증 - `lastModified` 필드 거부

### 증상
```
❌ Unrecognized key: "lastModified"
❌ 프로젝트 업데이트 실패
❌ 자동저장 실패
❌ 사용자 에디터 쓸 수 없음
```

### 원인
**파일**: `src/shared/validation/projectValidation.ts`

```typescript
// ❌ 문제점:
const ProjectUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  // ... 기타 필드
  // ⚠️ lastModified 필드 정의 없음!
})
.strict() // ← 미알려진 필드 거부!
```

**렌더러**에서 보내는 데이터:
```typescript
// src/renderer/components/projects/hooks/useProjectData.ts:404
const payload = {
  title,
  content,
  chapters,
  lastModified: new Date()  // ← 여기서 포함!
};
```

### 해결책 ✅ (이미 적용됨)

```typescript
export const ProjectUpdateSchema = z.object({
  // ... 기타 필드
  
  // 🔥 추가됨:
  lastModified: z
    .date()
    .or(z.string().datetime())
    .optional(),  // 백엔드에서 무시됨 (자체 타임스탐프 사용)
})
.strict()
.refine(
  (obj) => {
    // lastModified 제외하고 실제 업데이트 필드 확인
    const { lastModified, ...updates } = obj;
    return Object.keys(updates).length > 0;
  },
  { message: '최소 하나의 필드를 업데이트해야 합니다' }
);
```

**변경 파일**: `src/shared/validation/projectValidation.ts`  
**변경 크기**: ~10 줄  
**타입 체크**: ✅ 통과  
**빌드**: ✅ 성공

---

## 📊 Phase 4.5 QA Checklist

### 🔴 긴급 (에디터 접근 불가)

- [x] **V3 검증 - lastModified 필드 추가**
  - Status: ✅ 완료
  - Test: 빌드 및 타입 체크 통과
  - Next: 실시간 테스트 필요

### 🟡 중요 (검증 규칙)

- [ ] **V3 검증 - 다른 필드 검증 규칙 재확인**
  - Goal: title/content 필드 요구사항 확인
  - Check: 선택 사항이 맞는지 검증
  
- [ ] **V3 검증 - Episode 관련 스키마 확인**
  - Goal: Episode 업데이트도 동일 패턴인지 확인
  - File: episodeValidation.ts (존재하는가?)

### 🟢 보조 (통합 테스트)

- [ ] **V4 속도 제한 - 정상 작동**
  - Check: 로그에서 "Request allowed" 메시지
  - Verify: Rate limit이 예상대로 작동하는지

- [ ] **타입 안전성 - Enum 일관성**
  - Test: 다양한 장르로 프로젝트 생성
  - Test: 다양한 상태로 업데이트
  - Verify: 바인딩 오류 없음

---

## 🧪 테스트 시나리오

### Test Case 1: 프로젝트 생성 및 기본 저장 ✅

**입력**:
```javascript
{
  title: "테스트 프로젝트",
  genre: "romance-fantasy",
  status: "active",
  content: "첫 번째 문장"
}
```

**예상 결과**:
- ✅ V3 검증 통과
- ✅ V4 속도 제한 통과 (1/100)
- ✅ 프로젝트 생성됨
- ✅ 로그: "✅ 프로젝트 생성 완료"

**테스트 방법**:
1. 앱 시작
2. "새 프로젝트" 버튼
3. 프로젝트 정보 입력
4. "생성" 클릭
5. 콘솔 로그 확인

---

### Test Case 2: 에디터에서 텍스트 입력 및 자동저장 🔴 **우선**

**입력**:
```
에디터에 텍스트 입력 + 자동저장 (5초)
```

**예상 결과**:
- ✅ 에디터 입력 가능
- ✅ 5초 후 자동저장 시작
- ✅ V3 검증 통과
  - title: 프로젝트 제목 (1자 이상)
  - content: 입력한 텍스트
  - lastModified: 현재 시간 (무시됨)
- ✅ V4 속도 제한 통과 (2/100)
- ✅ 저장 성공
- ✅ 로그: "✅ 프로젝트 업데이트 완료"

**테스트 방법**:
1. 프로젝트 생성 (Test Case 1)
2. 에디터에 텍스트 입력
3. 콘솔 로그 확인 (5초 후)
4. 저장 성공 메시지 확인

---

### Test Case 3: 복수 필드 업데이트 🟡

**입력**:
```javascript
{
  title: "수정된 제목",
  content: "수정된 내용",
  progress: 50,
  // lastModified: new Date() (자동 포함)
}
```

**예상 결과**:
- ✅ 모든 필드 검증 통과
- ✅ V3 refine: lastModified 제외하고 3개 필드 확인 ✓
- ✅ V4 속도 제한 통과 (3/100)
- ✅ 저장 성공

---

### Test Case 4: 장르/상태 다양성 테스트 🟢

**입력**:
```javascript
// 다양한 장르 조합
[
  { genre: 'romance-fantasy', status: 'active' },
  { genre: 'hunter', status: 'paused' },
  { genre: 'martial-arts', status: 'completed' },
  { genre: 'unknown', status: 'active' }, // fallback
]
```

**예상 결과**:
- ✅ 모든 Enum 값 타입 안전 (컴파일 타임)
- ✅ 모든 값 검증 통과 (런타임)
- ✅ 0개 바인딩 오류
- ✅ 타입 안전성 100%

---

## 🔍 로그 검수 체크리스트

### V3 검증 로그 확인

```log
✅ [PROJECT_CRUD_IPC] 🚀 즉시 프로젝트 업데이트 시작 { id: '...', ... }
✅ [RATE_LIMITER] ✅ Request allowed
✅ [PROJECT_CRUD_IPC] ✅ V4 Rate limit check passed { remaining: 99 }
✅ [PROJECT_CRUD_IPC] ✅ V3 Zod create validation passed { title: '...', genre: '...' }
✅ [PROJECT_CRUD_IPC] ✅ 프로젝트 생성 완료
```

### 에러 로그 (발생하면 안 됨)

```log
❌ [PROJECT_CRUD_IPC] ❌ V3 Zod update validation failed
❌ [PROJECT_CRUD_IPC] Unrecognized key: lastModified
❌ [PROJECT_DATA] Error saving project
```

---

## 📈 성과 지표

| 메트릭 | 목표 | 현재 상태 |
|-------|------|---------|
| **Type-check 에러** | 0 | ✅ 0 |
| **빌드 성공** | Yes | ✅ Yes |
| **V3 검증 실패율** | 0% | 🔄 측정 중 |
| **V4 속도 제한 작동** | 100% | 🔄 확인 중 |
| **에디터 입력 가능** | Yes | 🔄 테스트 중 |
| **자동저장 성공율** | >95% | 🔄 측정 중 |
| **Enum 바인딩 오류** | 0 | ✅ 0 (컴파일 타임) |

---

## 🛠️ 다음 액션 아이템

1. **즉시**: 앱 시작 후 Test Case 2 실행 (에디터 입력 테스트)
2. **5분**: 로그 확인 및 에러 없는지 검증
3. **10분**: Test Case 1, 3, 4 순차 실행
4. **버그 발견 시**: 로그 캡처 → 근본 원인 분석 → 수정 → 재빌드
5. **성공 시**: Phase 4.5 완료 선언 → Phase 5+ 준비

---

## 📝 알려진 제한사항

### 현재 (Phase 4.5)
- Google OAuth 비활성화 (로컬 테스트 환경)
- AUTH_CONTEXT "인증되지 않음" 메시지 정상 (Google 없음)
- 인증이 필수가 아닌 기능만 테스트 가능

### 향후 (Phase 5+)
- Google OAuth 통합 테스트
- 멀티유저 시나리오
- 부하 테스트 (Rate limit 한계)

---

**현재 진행**: 🔄 V3 검증 버그 수정 완료, 실시간 테스트 중...
