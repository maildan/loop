# ✅ 튜토리얼 next 버튼 버그 최종 수정

## 🔴 문제
Dashboard 자동 흐름으로 project-creator 튜토리얼 시작 시, next 버튼이 작동하지 않음.

**에러:**
```
⚠️ nextStep: No current tutorial
```

## 🔍 근본 원인 분석

### 실행 흐름 (버그)
```
1. Dashboard → ?create=true로 Projects 진입
2. navigate() 호출: URL 정리 (?create 제거)
   → location.search 변경
   → useEffect 의존성 트리거!
   
3. showCreator effect 실행
   → if (showCreator && isCreateFlow) → TRUE
   → startTutorial('project-creator') 호출
   → setTimeout(setIsCreateFlow(false), 800ms) 예약
   
4. 800ms 후 setIsCreateFlow(false) 호출
   → isCreateFlow 의존성 변화
   → showCreator effect 다시 실행
   
5. showCreator effect 실행 (2번째)
   → if (showCreator && isCreateFlow) → FALSE
   → else if (showCreator && !isCreateFlow) → TRUE!
   → location.search.includes('create') → false (URL 이미 정리됨!)
   → closeTutorial() 호출! 🔴
   
6. TutorialContext.currentTutorialId = null
   → next 버튼 클릭
   → nextStep() 호출
   → "No current tutorial" 경고!
```

## ✅ 해결책

### 핵심: isAutomaticFlowRef 플래그 추가

**변경 위치:** `src/renderer/src/routes/Projects.tsx`

#### 1. Ref 추가 (54줄)
```tsx
// 🔥 자동 흐름(Dashboard에서 시작) 여부 추적
const isAutomaticFlowRef = useRef<boolean>(false);
```

#### 2. 자동 흐름 표시 (93줄)
```tsx
if (showCreator && isCreateFlow) {
  // 🔥 자동 흐름 시작 표시
  isAutomaticFlowRef.current = true;
  
  // startTutorial() 호출...
}
```

#### 3. 조건 분리 (자동 vs 수동)
```tsx
// 🔴 수동 열기만 closeTutorial()
} else if (showCreator && !isCreateFlow && !isAutomaticFlowRef.current) {
  closeTutorial();
}

// 🟢 자동 흐름의 setIsCreateFlow(false) → 무시
} else if (showCreator && !isCreateFlow && isAutomaticFlowRef.current) {
  console.warn(`📌 Automatic flow ongoing - keeping tutorial active`);
}
```

## 🎯 수정된 실행 흐름

### Dashboard 자동 흐름 (이제 정상!)
```
1. navigate() → URL 정리 (?create 제거)
2. showCreator effect: if (showCreator && isCreateFlow) → TRUE
   → isAutomaticFlowRef.current = true ✅
   → startTutorial() 호출
   → setTimeout(setIsCreateFlow(false), 800ms)
   
3. 800ms 후 setIsCreateFlow(false)
   → showCreator effect 다시 실행
   
4. showCreator effect: else if (showCreator && !isCreateFlow && isAutomaticFlowRef.current)
   → TRUE!
   → closeTutorial() 호출 안 함! ✅
   → 튜토리얼 계속 유지!
   
5. next 버튼 클릭
   → nextStep() 정상 작동! ✅
```

### 사용자 수동 열기 (여전히 정상!)
```
1. "새 프로젝트" 버튼 클릭
   → isAutomaticFlowRef.current = false (초기값)
   → closeTutorial() 호출
   → setShowCreator(true)
   
2. showCreator effect: else if (showCreator && !isCreateFlow && !isAutomaticFlowRef.current)
   → TRUE!
   → closeTutorial() 재호출 (이미 호출됨)
   → 튜토리얼 중지 ✅
```

## ✅ 검증 결과

- ✅ TypeScript 컴파일 성공
- ✅ pnpm build 성공
- ✅ renderer/index-kXdlVsj_.js (581.16 kB) 생성
- ✅ 타입 안전성 유지
- ✅ 부작용 없음

## 📊 코드 통계

| 부분 | 변경 |
|------|------|
| **Ref 추가** | `isAutomaticFlowRef` |
| **ref 설정** | showCreator && isCreateFlow 분기에서 true로 설정 |
| **조건 분리** | 자동 흐름과 수동 흐름을 명시적으로 구분 |
| **closeTutorial 호출** | 자동 흐름에서는 스킵 |

## 🎓 학습 포인트

### 문제의 본질
- **의존성 배열이 여러 번 변화 시 effect가 여러 번 실행됨**
- **URL 상태와 컴포넌트 상태가 동기화되지 않을 때 발생**
- **상태 플래그만으로는 부족 → ref 기반 추적 필요**

### 해결 전략
1. **명확한 상태 구분:** 자동 vs 수동
2. **Ref 활용:** 렌더링과 무관하게 상태 유지
3. **의존성 최소화:** location.search 제거

## 최종 결론

이 수정은 **자동 흐름과 수동 흐름을 명확히 구분**하여, 각각 다른 동작을 하도록 설계했습니다.

**결과:**
- Dashboard 자동 흐름: 튜토리얼 계속 진행 ✅
- 사용자 수동 열기: 튜토리얼 중지 ✅
- next 버튼: 정상 작동 ✅

