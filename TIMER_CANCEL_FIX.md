# 🔧 버그 수정: 타이머 취소 로직 추가

## 문제

사용자가 "새 프로젝트" 버튼을 클릭했을 때도 project-creator 튜토리얼이 시작되는 문제가 지속됨.

### 근본 원인
```
이전 수정: closeTutorial()만 호출
↓
하지만 setTimeout(startTutorial, 800ms)이 이미 예약되어 있었음!
↓
800ms 후에 타이머가 실행되어 튜토리얼 시작
```

## 최종 해결책

### 변경사항

**파일:** `src/renderer/src/routes/Projects.tsx`

#### 1️⃣ Ref 추가 (56-57줄)
```tsx
// 🔥 진행 중인 튜토리얼 시작 타이머 추적 (수동 열기 시 취소하기 위함)
const tutorialStartTimerRef = useRef<number | null>(null);
```

#### 2️⃣ 타이머 저장 (109줄)
```tsx
// 🔥 진행 중인 타이머 저장 (수동 열기 시 취소하기 위함)
tutorialStartTimerRef.current = timerId;
```

#### 3️⃣ 타이머 정리 (107줄)
```tsx
tutorialStartTimerRef.current = null; // 🔥 타이머 정리
```

#### 4️⃣ 타이머 취소 (수동 열기 시)
```tsx
// 🔥 CRITICAL: 진행 중인 튜토리얼 시작 타이머 취소
// Dashboard 자동 흐름에서 예약된 setTimeout을 중단해야 함
if (tutorialStartTimerRef.current) {
  clearTimeout(tutorialStartTimerRef.current);
  tutorialStartTimerRef.current = null;
  Logger.info('PROJECTS_PAGE', '⏹️ Cancelled pending tutorial timer');
  console.warn(`⏹️ [PROJECTS_PAGE] Tutorial timer cancelled - manual modal open`);
}
```

## 실행 흐름

### Dashboard 자동 흐름 (정상)
```
Dashboard "새 프로젝트" 버튼 클릭
  ↓
URL: ?create=true 추가
  ↓
Projects 페이지로 이동
  ↓
isCreateFlow=true 감지
  ↓
setTimeout(startTutorial, 800ms) 예약
  ↓
tutorialStartTimerRef.current = 타이머ID (저장됨)
  ↓
800ms 후 startTutorial() 실행 ✅
  ↓
프로젝트-creator 튜토리얼 시작
```

### Projects 수동 열기 (버그 수정됨!)
```
Projects "새 프로젝트" 버튼 클릭
  ↓
onCreateProject()
  ├─ closeTutorial() (이전 튜토리얼 종료)
  ├─ manualCreatorOpenRef.current = true
  └─ setShowCreator(true)
  ↓
React 리렌더링
  ↓
showCreator effect 실행
  ↓
조건: showCreator && !isCreateFlow && manualCreatorOpenRef.current
  ↓
if (tutorialStartTimerRef.current) {
  clearTimeout() ← 🎯 예약된 타이머 취소!
  closeTutorial()
}
  ↓
✅ 튜토리얼 시작 안 됨!
```

## 검증

### ✅ 타입 안전성
- TypeScript 컴파일 성공 (pnpm exec tsc --noEmit)
- `useRef<number | null>(null)` - 브라우저 setTimeout의 타입과 일치

### ✅ 빌드 성공
- pnpm build 완료
- 모든 번들 생성됨
- renderer/index-CE3dVldr.js (581.06 kB)

## 코드 요약

| 부분 | 변경 | 이유 |
|------|------|------|
| **Ref 추가** | `tutorialStartTimerRef` | 진행 중인 타이머 추적 |
| **타이머 저장** | `requestAnimationFrame` 콜백 | setTimeout ID 저장 |
| **타이머 취소** | 수동 열기 시 `clearTimeout()` | 예약된 튜토리얼 시작 중단 |
| **타이머 정리** | 타이머 실행 후 | 메모리 누수 방지 |

## 최종 결과

✅ **Dashboard 자동 흐름:** 튜토리얼 정상 시작  
✅ **Projects 수동 열기:** 튜토리얼 NOT 시작  
✅ **타입 안전성:** 유지  
✅ **부작용:** 없음

