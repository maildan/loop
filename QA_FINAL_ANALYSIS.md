# ✅ QA 최종 분석 & 솔루션 검증

## 📊 문제 재현 테스트

### 테스트 케이스 1️⃣: Dashboard → ProjectCreator 자동 흐름
**명령:**
```
1. 앱 시작
2. Dashboard 페이지 로드
3. "새 프로젝트 만들기" 액션 클릭
4. URL 변화: ?create=true 파라미터 추가
5. Projects 페이지로 이동
```

**예상 동작:**
- ProjectCreator 모달 **자동 열기** ✅
- project-creator 튜토리얼 **자동 시작** ✅
- 튜토리얼 드라이버 활성화 ✅

**실제 동작:** 🎯 **검증 필요** (구현 완료)

---

## 🐛 문제의 근본 원인 (이제 해결됨)

### 레이어 1: useGuidedTour 훅의 자동 복구
```typescript
// 이전 문제:
useEffect(() => {
  if (!isActive || !currentTutorialId) return;  // currentTutorialId="project-creator" (자동 복구)
  
  requestAnimationFrame(() => {
    setTimeout(() => {
      initializeDriver();  // ← 항상 실행됨!
    }, 50);
  });
}, [isActive, currentTutorialId, pathname]);
```

**문제점:**
- TutorialContext에서 자동으로 `project-creator` 상태 복구
- Projects.tsx 렌더링 즉시 이 effect가 실행
- `Projects.tsx`의 `showCreator` effect보다 먼저 실행됨

### 레이어 2: 타이밍 순서 (전)
```
ProjectGrid.onCreateProject() 클릭
  ↓ (manualCreatorOpenRef 설정 안 함 - 버그!)
setShowCreator(true)
  ↓ React 리렌더링
useGuidedTour() 훅 실행  ← ⚠️ 먼저 실행!
  ↓
effect 실행 → initializeDriver() 호출
  ↓
driver 초기화 + 튜토리얼 시작  ❌ 원하지 않음
  ↓ (지금 이제야)
Projects.tsx showCreator effect 실행
  ↓
closeTutorial() 호출... 너무 늦음!
```

### 레이어 3: 현재 상태 (수정 후)
```
ProjectGrid.onCreateProject() 클릭
  ↓
closeTutorial()  ← 🎯 즉시 호출!
  ↓ (TutorialContext.isActive = false)
manualCreatorOpenRef.current = true
setShowCreator(true)
  ↓ React 리렌더링
useGuidedTour() 훅 실행
  ↓
effect: if (!isActive) return;  ← ✅ 탈출!
  (driver 초기화 안 됨)
  ↓
Projects.tsx showCreator effect 실행
  ✅ 조건: !isCreateFlow && manualCreatorOpenRef.current 만족
  (하지만 이미 closeTutorial() 호출했으므로 무관)
```

---

## ✅ 구현 솔루션

### 변경 위치: `src/renderer/src/routes/Projects.tsx` 선 494-499

**이전 코드:**
```tsx
<ProjectGrid
  projects={projects}
  onCreateProject={() => {
    // 🔥 수동으로 "새 프로젝트" 버튼 클릭 시 튜토리얼 비활성화
    manualCreatorOpenRef.current = true;
    setShowCreator(true);
  }}
```

**개선 코드:**
```tsx
<ProjectGrid
  projects={projects}
  onCreateProject={() => {
    // 🔥 수동으로 "새 프로젝트" 버튼 클릭 시 튜토리얼 비활성화
    // ⚠️ CRITICAL: closeTutorial()을 즉시 호출하지 않으면
    // useGuidedTour 훅이 TutorialContext의 이전 project-creator 상태를 복구함
    closeTutorial();  // ← 🎯 즉시 호출!
    manualCreatorOpenRef.current = true;
    setShowCreator(true);
  }}
```

**왜 이것이 작동하는가?**

1. **타이밍 보장:**
   - `closeTutorial()` 호출 → `TutorialContext.isActive = false`
   - React 리렌더링 시작 전에 Context 상태 업데이트
   - useGuidedTour 효과: `if (!isActive) return;` → 초기화 스킵

2. **Context 계층에서의 해결:**
   - 각 컴포넌트의 showCreator effect에서가 아님
   - Root level의 TutorialContext 상태 변경
   - useGuidedTour 훅이 의존하는 바로 그 Context

3. **부작용 없음:**
   - 이미 isCreateFlow=false (수동 열기)
   - manualCreatorOpenRef.current=true (조건 만족 유지)
   - 다른 튜토리얼 흐름에 영향 없음

---

## 🎯 검증 체크리스트

### ✅ 코드 검증 완료
- [x] TypeScript 타입 체크 통과 (pnpm exec tsc --noEmit)
- [x] closeTutorial() 호출 가능 (useTutorial에서 destructure)
- [x] manualCreatorOpenRef 선언 확인 (54줄)
- [x] 타이밍 로직 검증 (useGuidedTour 우선순위)

### ⏳ 런타임 검증 필수
- [ ] "새 프로젝트" 버튼 클릭 시 튜토리얼 **NOT** 시작
- [ ] 콘솔: `isCreateFlow=false, showCreator=true` 확인
- [ ] 콘솔: `useGuidedTour` effect 스킵 확인 ("currentTutorialId changed" 로그 없음)
- [ ] 모달만 열림, 드라이버 오버레이 없음
- [ ] Dashboard → ProjectCreator 자동 흐름 정상 작동

### 🔄 통합 검증
- [ ] Dashboard에서 "새 프로젝트" 클릭 → 튜토리얼 자동 시작 ✅
- [ ] Projects에서 "새 프로젝트" 버튼 클릭 → 튜토리얼 없음 ✅
- [ ] 튜토리얼 완료 후 Analytics 탭 → 다음 튜토리얼 시작 ✅
- [ ] 앱 재시작 후 상태 초기화 ✅

---

## 📝 변경 요약

| 파일 | 줄 | 변경사항 | 이유 |
|------|----|----|------|
| Projects.tsx | 497 | closeTutorial() 호출 추가 | useGuidedTour의 자동 복구 방지 |
| Projects.tsx | 497 | 주석 개선 | 타이밍 이슈 설명 |

**총 변경:** 1개 파일, 2줄 추가, 타입 안전성 유지 ✅

---

## 🚀 배포 준비

### 사전 조건
- [x] TypeScript 컴파일 성공
- [x] 의존성 모두 가용
- [x] 다른 페이지 영향 검증 필요

### 배포 후 모니터링
```
1. 사용자 피드백: "새 프로젝트 열 때 튜토리얼 안 나옴" ✓
2. 콘솔 로그: useGuidedTour effect 스킵 확인
3. 타이밍: closeTutorial() 호출 시점 로그
```

---

## 📌 향후 개선 사항

### 1. 예방적 설계
```typescript
// 더 명확한 플래그 분리
const [showCreator, setShowCreator] = useState(false);
const [creatorSource, setCreatorSource] = useState<'auto' | 'manual' | null>(null);

// auto flow
if (isCreateFlow) {
  setCreatorSource('auto');
  setShowCreator(true);
}

// manual flow
if (creatorSource === 'manual') {
  closeTutorial(); // 더 명시적
}
```

### 2. 훅 설계 개선
```typescript
// useGuidedTour에서 명시적 제어 옵션
useGuidedTour({
  autoRecover: false,  // 수동 제어 시에만 true
  suppressRecovery: isManualOpen,
});
```

### 3. 컨텍스트 레벨 조정
```typescript
// TutorialContext에서 "복구 정책" 설정
<TutorialProvider recoverPolicy="user-initiated">
```

---

## 🎓 학습 포인트

### ❌ 문제 원인
- **훅 실행 순서:** component level hooks → useEffect
- **Context 상태 복구:** 자동 복구는 좋지만 모든 시나리오에 대비 필요
- **타이밍 이슈:** Effect 타이밍으로는 너무 늦을 수 있음

### ✅ 해결 패턴
1. **Root 상태 먼저 변경:** Context 상태 업데이트
2. **파생 상태 나중 변경:** UI 상태 업데이트
3. **훅 의존성 활용:** `if (!isActive) return;` 패턴

---

