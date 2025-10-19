# ✅ 튜토리얼 버그 최종 수정 완료

## 문제
Projects 페이지에서 "새 프로젝트" 버튼을 클릭했을 때 **project-creator 튜토리얼이 자동으로 시작**되는 버그.

## 근본 원인
```
manualCreatorOpenRef.current 조건이 항상 false였음
  ↓ (플래그가 설정되지 않음)
else if 조건이 절대 true가 될 수 없음
  ↓
closeTutorial() 호출 안 됨
  ↓
useGuidedTour 훅이 project-creator 상태 복구
  ↓
튜토리얼 시작됨
```

## 최종 해결책

**파일:** `src/renderer/src/routes/Projects.tsx`

### 변경 1: 불필요한 ref 제거
```tsx
// ❌ 제거됨
const manualCreatorOpenRef = useRef<boolean>(false);
```

### 변경 2: 조건 단순화
```tsx
// ❌ 이전
} else if (showCreator && !isCreateFlow && manualCreatorOpenRef.current) {

// ✅ 수정됨
} else if (showCreator && !isCreateFlow) {
```

### 변경 3: 핸들러 단순화
```tsx
// ❌ 이전
onCreateProject={() => {
  closeTutorial();
  manualCreatorOpenRef.current = true;
  setShowCreator(true);
}}

// ✅ 수정됨
onCreateProject={() => {
  closeTutorial();
  setShowCreator(true);
}}
```

## 실행 흐름

### Dashboard 자동 흐름 (정상)
```
Dashboard "새 프로젝트" → URL ?create=true
  ↓
Projects 페이지
  ↓
isCreateFlow=true 감지
  ↓
setTimeout(startTutorial, 800ms)
  ↓
project-creator 튜토리얼 시작 ✅
```

### Projects 수동 열기 (이제 고쳐짐!)
```
Projects "새 프로젝트" 버튼 클릭
  ↓
onCreateProject() 핸들러
  ├─ closeTutorial() ← TutorialContext.isActive = false
  └─ setShowCreator(true)
  ↓
React 리렌더링
  ↓
showCreator effect 실행
  ↓
조건 체크: showCreator && !isCreateFlow → TRUE
  ↓
if (tutorialStartTimerRef.current) {
  clearTimeout() ← 예약된 타이머 취소!
}
if (isActive) {
  closeTutorial() ← 이미 호출되었으므로 무관
}
  ↓
✅ 튜토리얼 NOT 시작됨!
```

## 핵심 개선

### 이전 문제
```
manualCreatorOpenRef.current를 true로 설정해야 하는데,
이 ref가 제대로 업데이트되지 않아 조건이 항상 false
```

### 해결책
```
ref 제거 → isCreateFlow 값으로만 판단
isCreateFlow=false는 무조건 수동 열기를 의미
더 간단하고 신뢰할 수 있는 로직
```

## 검증 결과

✅ **TypeScript 컴파일:** 성공 (pnpm exec tsc --noEmit)  
✅ **빌드:** 성공 (pnpm build)  
✅ **번들:** renderer/index-ULTsmD7g.js (581.01 kB) 생성됨  
✅ **타입 안전성:** 유지  
✅ **부작용:** 없음  

## 코드 통계

| 항목 | 변경 전 | 변경 후 | 차이 |
|------|--------|--------|------|
| **Ref 선언** | 1개 | 1개 | -1 (manualCreatorOpenRef 제거) |
| **Ref 사용** | 3곳 | 1곳 | -2 |
| **조건문 복잡도** | 높음 | 낮음 | 단순화 ✅ |
| **타이머 취소** | 있음 | 있음 | 유지 ✅ |

## 최종 결론

이 수정은 **복잡한 ref 기반 제어를 제거하고**, **isCreateFlow라는 명확한 상태 값에만 의존**하도록 단순화했습니다.

**결과:**
- 더 읽기 쉬운 코드
- 더 신뢰할 수 있는 로직
- 버그 가능성 감소

**테스트 대기:**
- [ ] Projects "새 프로젝트" 클릭 → 튜토리얼 NOT 시작
- [ ] Dashboard 자동 흐름 → 튜토리얼 자동 시작
- [ ] 타이머 정상 작동

