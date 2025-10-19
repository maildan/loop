# 🔍 튜토리얼 시스템 QA 체크리스트 (비관적 관점)

## 📋 테스트 시나리오

### 1️⃣ Dashboard → 튜토리얼 시작 (자동 흐름)
**기대 동작:**
- Dashboard에서 "새 프로젝트 만들기" action 클릭
- URL: `http://localhost:3000/projects?create=true` 로 이동
- Projects 페이지에서 **자동으로** ProjectCreator 모달 열기
- **project-creator 튜토리얼 자동 시작** ✅

**실제 동작:** ❓ **미검증**
- [ ] URL에 `?create=true` 파라미터가 제대로 생기는가?
- [ ] Projects 페이지가 이 파라미터를 감지하는가?
- [ ] 튜토리얼이 자동으로 시작되는가?

---

### 2️⃣ 수동 모달 열기 (버튼 클릭)
**기대 동작:**
- Projects 페이지에서 "새 프로젝트" 버튼 직접 클릭
- URL 변화 없음 (또는 `?create=false`로 유지)
- ProjectCreator 모달 열기
- **튜토리얼 NOT 시작** ❌ (이것이 현재 버그)
- 사용자가 콘텐츠 입력만 가능

**실제 동작:** 🐛 **BUG 확인됨**
- [x] URL에 `?create=true` 없음 ✓
- [x] `isCreateFlow=false` ✓
- [x] `showCreator=true` ✓
- [x] **하지만 튜토리얼이 시작됨** 🔴

**근본 원인 분석:**
```
Projects.tsx render
  ↓
useGuidedTour() 호출 ← 🚨 이 시점에서 문제 발생
  ↓
TutorialContext에서 project-creator 상태 복구
  ↓
useGuidedTour 훅이 자동으로 드라이버 초기화
  ↓
showCreator 조건 체크 전에 이미 튜토리얼이 시작됨
```

---

## 🐛 현재 코드 문제점

### Projects.tsx의 showCreator effect

```tsx
} else if (showCreator && !isCreateFlow && manualCreatorOpenRef.current) {
  // 🚨 문제: manualCreatorOpenRef.current가 정의되지 않았음
  closeTutorial();
}
```

**문제점:**
1. `manualCreatorOpenRef` 선언 없음 → 항상 undefined
2. 조건이 항상 false → closeTutorial() 절대 호출 안 됨
3. 수동 열기 시 튜토리얼이 계속 돌아감

---

## 📊 실패 원인 피라미드 (하단부터)

### Level 1: useGuidedTour 훅의 자동 복구
```
useGuidedTour() mount
  → TutorialContext.currentTutorialId = "project-creator" (이전 상태)
  → useEffect 트리거
  → initializeDriver() 자동 호출
  → 튜토리얼 시작 (Projects.tsx의 isCreateFlow와 무관)
```

### Level 2: Projects.tsx의 조건 검사 실패
```
showCreator effect 실행
  → if (showCreator && isCreateFlow) → true일 때만 startTutorial()
  → else if (showCreator && !isCreateFlow && manualCreatorOpenRef.current)
     → manualCreatorOpenRef.current = undefined → false
     → closeTutorial() 호출 안 됨
```

### Level 3: 타이밍 문제
```
Projects render
  ↓
useGuidedTour() 호출 (component level hook)
  ↓
TutorialContext 복구 (project-creator 상태)
  ↓
Effect 실행되어 Driver 초기화
  ↓
(이 시점에서 showCreator 값이 아직 확정 안 됨 가능)
```

---

## ❌ 실패 케이스

### Case 1: 수동 모달 열기 → 튜토리얼 표시됨
```
상황: 사용자가 "새 프로젝트" 버튼 클릭 (URL에 ?create 없음)
예상: 모달만 열림
실제: 튜토리얼이 나타남
근거: 위 로그 "isCreateFlow=false, showCreator=true" + Driver 초기화 로그
```

### Case 2: 이전 튜토리얼 상태 자동 복구
```
상황: 앱 재시작 → 이전에 project-creator 튜토리얼 중 나갔었음
예상: 튜토리얼 상태 초기화 (사용자 명시적 시작 전까지)
실제: TutorialContext가 자동으로 이전 상태 복구
문제: useGuidedTour()가 무조건 복구해서 시작함
```

### Case 3: Analytics 튜토리얼 미표시
```
상황: Projects 튜토리얼 완료 → Analytics로 이동
예상: Analytics 튜토리얼 자동 시작
실제: 아직 확인 안 됨 (QA 필요)
```

---

## ✅ 해결 방안 (후보)

### 🔴 지금 까지의 시도 (실패)
```tsx
// Projects.tsx에 추가했던 것:
manualCreatorOpenRef.current = false; // ← 선언 없음 = undefined
```

### 🟡 진짜 해결책 (3가지 옵션)

#### 옵션 A: manualCreatorOpenRef 제대로 구현
```tsx
const manualCreatorOpenRef = useRef<boolean>(false);

// ProjectGrid에서 버튼 클릭할 때
const handleNewProject = () => {
  manualCreatorOpenRef.current = true; // 플래그 설정
  setShowCreator(true);
};

// Projects.tsx effect에서
else if (showCreator && !isCreateFlow && manualCreatorOpenRef.current) {
  closeTutorial(); // 이제 작동함
  manualCreatorOpenRef.current = false;
}
```

#### 옵션 B: showCreator 상태 더 명확하게 분리
```tsx
const [showCreator, setShowCreator] = useState<boolean>(false);
const [creatorSource, setCreatorSource] = useState<'auto' | 'manual' | null>(null);

// auto flow
if (isCreateFlow) {
  setCreatorSource('auto');
  setShowCreator(true);
}

// manual flow
const handleNewProject = () => {
  setCreatorSource('manual');
  setShowCreator(true);
};

// effect
if (creatorSource === 'manual') {
  closeTutorial();
}
```

#### 옵션 C: useGuidedTour의 자동 초기화 비활성화
```tsx
// ProjectCreator 컴포넌트에서만 useGuidedTour() 호출
// Projects.tsx에서는 호출 안 함
// → 각 페이지에서 필요할 때만 수동으로 호출
```

---

## 🎯 검증 계획

### Step 1: 재현
- [ ] "새 프로젝트" 버튼 클릭
- [ ] 콘솔에서 `isCreateFlow=false, showCreator=true` 확인
- [ ] Driver 초기화 로그 확인

### Step 2: 근본 원인 확인
- [ ] Projects.tsx의 showCreator effect 로그 출력 추가
- [ ] manualCreatorOpenRef의 정의 여부 확인
- [ ] else if 조건이 실제로 평가되는지 확인

### Step 3: 해결책 구현 및 검증
- [ ] 선택한 옵션 구현
- [ ] 모든 케이스 재테스트

---

## 📝 결론

**현재 상태:** 🔴 실패

**주요 문제:**
1. `manualCreatorOpenRef` 선언 누락
2. `useGuidedTour` 자동 복구 메커니즘 간섭
3. 타이밍 문제로 인한 조건 검사 실패

**다음 액션:**
→ 옵션 B (creatorSource 분리)를 추천
  - 가장 명확한 의도 표현
  - 유지보수 용이
  - 향후 확장 가능

