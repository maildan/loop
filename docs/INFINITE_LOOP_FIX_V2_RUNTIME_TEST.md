# 🧪 수정된 무한루프 버그 - 런타임 테스트 (V2)

## ✅ 수정 사항

### **문제**: ProjectCreator useEffect 조건이 잘못됨
```typescript
// ❌ 잘못된 조건
if (isOpen && !isActive && currentTutorialId === 'dashboard-intro')

// ✅ 올바른 조건
if (isOpen && currentTutorialId === 'dashboard-intro' && isActive)
```

**이유**: 
- completeTutorial()은 isActive를 `true`로 유지 (Dashboard 튜토리얼이 활성화되어야 함)
- 따라서 `!isActive` 조건은 **절대 만족될 수 없음**
- 올바른 조건: currentTutorialId가 'dashboard-intro'로 변경되고 isActive가 true면 복귀 완료

---

## 🧪 테스트 시나리오 (수정된 버전)

### **테스트 흐름**:

```
1. ✅ 앱 시작 (pnpm dev 실행 중)
2. ✅ Dashboard 나타남
3. 🖱️ "사용법 보기" 버튼 클릭
4. ⏭️ Step 1-3 자동 진행
5. ⏭️ Step 4 도달: "📝 새 프로젝트 만들기" (action-create)
6. 🖱️ "다음" 버튼 또는 "직접 해보기 →" 클릭
   ├─ ProjectCreator 모달 자동 열림
   ├─ 콘솔: "[useGuidedTour] 🎯 Detected action-create step → auto-triggering modal"
   └─ 콘솔: "[PROJECT_CREATOR] 🚀 Starting project-creator tutorial"
7. ⏭️ ProjectCreator Step 1-7 자동 진행 (약 30초)
   ├─ auto-progress: 5.5초마다 자동 진행
   └─ Step 8 (create-finish) 도달
8. ⏭️ Step 8 도달: "✨ 완료!"
   ├─ Popover 제목: "✨ 완료!"
   ├─ 버튼: [닫기] only
9. 🖱️ X 버튼 또는 "닫기" 버튼 클릭
   ├─ 콘솔 확인 포인트:
   │  ├─ "[PROJECT_CREATOR] 🎬 X button: completeTutorial() → Dashboard"
   │  ├─ "[TUTORIAL_CONTEXT] ✅ Tutorial completed: project-creator"
   │  ├─ "[TUTORIAL_CONTEXT] 🔄 Returning from project-creator to dashboard-intro at step 5 (stepId: action-import)"
   │  └─ "[PROJECT_CREATOR] 🎉 Returned to dashboard-intro → Auto-closing ProjectCreator modal"
   ├─ ⏳ 300ms 대기
   └─ 콘솔: "[PROJECT_CREATOR] ✅ Modal closed, dashboard tutorial ready to start"
10. ✅ ProjectCreator 모달 닫힘
11. ✅ Dashboard 표시됨
12. ✅ 튜토리얼 계속: Step 5 (action-import) 표시됨
    ├─ Popover 제목: "📂 기존 파일 가져오기"
    ├─ 콘솔: "[useGuidedTour] 🎬 Initializing Driver.js for dashboard-intro"
    ├─ 콘솔: "[useGuidedTour] 🎯 Driver moved to step 5"
    └─ 버튼: [이전] [다음] [닫기]
13. 🖱️ "다음" 버튼 클릭
    └─ Step 6 (action-sample) 진행 ✅
14. 🖱️ "이전" 버튼 클릭
    └─ Step 5 (action-import) 복귀 ✅
15. ⏭️ Step 5-10까지 모두 진행
16. ⏭️ Step 10 도달: "🎉 튜토리얼 완료!"
17. 🖱️ "완료" 버튼 클릭
    └─ 튜토리얼 종료 ✅
```

---

## 📊 성공 기준

| 체크포인트 | 기대 결과 | 상태 |
|-----------|---------|------|
| X 버튼 클릭 | 모달 닫힘 | ⏳ 테스트 필요 |
| 모달 닫기 타이밍 | 300ms 후 onClose() 호출 | ⏳ 테스트 필요 |
| Dashboard 표시 | Dashboard 컴포넌트 DOM 로드 | ⏳ 테스트 필요 |
| Step 5 시작 | 'action-import' Popover 표시 | ⏳ 테스트 필요 |
| Element 검증 | `[data-tour="action-import"]` 찾기 성공 | ⏳ 테스트 필요 |
| Driver 초기화 | "🎬 Initializing Driver.js" 로그 | ⏳ 테스트 필요 |
| 다음 버튼 | Step 6로 이동 | ⏳ 테스트 필요 |
| 이전 버튼 | Step 5로 복귀 | ⏳ 테스트 필요 |
| 완료 버튼 | 튜토리얼 종료 (currentTutorialId=null) | ⏳ 테스트 필요 |

---

## 🔍 중요 콘솔 로그 (예상)

### **X 버튼 클릭 시**:
```javascript
[PROJECT_CREATOR] 🎬 X button: completeTutorial() → Dashboard
[TUTORIAL_CONTEXT] ✅ Tutorial completed: project-creator
[TUTORIAL_CONTEXT] 🔄 Returning from project-creator to dashboard-intro at step 5 (stepId: action-import)
[PROJECT_CREATOR] 🎉 Returned to dashboard-intro → Auto-closing ProjectCreator modal
[PROJECT_CREATOR] ✅ Modal closed, dashboard tutorial ready to start
[useGuidedTour] 🎬 Initializing Driver.js for dashboard-intro (current step: 5)
[useGuidedTour] 🎯 Driver moved to step 5
```

### **오류 로그 (이전 버전에서)**:
```javascript
⚠️ Tutorial "dashboard-intro" element not found. 
Modal may be closed or not yet mounted. Skipping driver initialization.
```

이 로그가 더 이상 나타나면 **안 됨**! ✅

---

## 🛠️ 수정 내용 정리

### **파일**: `src/renderer/components/projects/ProjectCreator.tsx`

#### **변경 전** (line 165):
```typescript
if (isOpen && !isActive && currentTutorialId === 'dashboard-intro') {
  // ❌ isActive=true이면 조건 불만족 → 모달 안 닫힘
}
```

#### **변경 후** (line 163):
```typescript
if (isOpen && currentTutorialId === 'dashboard-intro' && isActive) {
  // ✅ currentTutorialId 변경되고 isActive=true면 복귀 중 → 모달 닫기
  onClose();
}
```

---

## ⚠️ 주의사항

1. **서버 재시작 필수**: `pnpm dev` 재실행 (Ctrl+C 후 다시 시작)
2. **캐시 초기화**: 개발자 도구 → Application → Clear storage (선택사항)
3. **콘솔 확인**: DevTools Console 열어서 로그 확인
4. **타이밍**: 모달이 닫히고 Dashboard가 표시되는 데 300ms 소요

---

## ✅ 최종 확인 체크리스트

- [ ] 서버 재시작 후 X 버튼 클릭
- [ ] 콘솔에 "🎉 Returned to dashboard-intro" 로그 표시
- [ ] ProjectCreator 모달 닫힘
- [ ] Dashboard 표시됨
- [ ] Step 5 (action-import) Popover 표시됨
- [ ] "다음" 버튼으로 Step 6 진행 가능
- [ ] "이전" 버튼으로 Step 5 복귀 가능
- [ ] Step 10까지 모두 진행 가능
- [ ] 콘솔에 오류 또는 무한 루프 로그 없음 ✅

---

**이제 테스트할 준비가 완료되었습니다!** 🚀
