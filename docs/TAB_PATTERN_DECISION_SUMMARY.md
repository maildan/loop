# 📋 탭 패턴 조사 최종 결과 보고서

**날짜**: 2025-10-21  
**상태**: ✅ 완료 및 결정  
**작성자**: Loop Development Team  

---

## 🎯 Executive Summary

**질문**: "브라우저 같은 탭 네비게이션을 할까, 아니면 primaryChapterId로 할까?"

**답**: **primaryChapterId 패턴 선택** ✅

**이유**: 
- 작성 소프트웨어는 **Chapter-first** 설계
- 구현 단순하고 메모리 효율적
- 사용자 문맥(장 쓰기)과 완벽 부합
- 향후 Phase 2에서 MRU 히스토리 추가 가능 (최적 구조)

---

## 📊 분석 결과

### 1. 브라우저 탭 패턴 (MRU - Most Recently Used)

**동작**:
```
Tabs: [A, B, C, D]
Close D → C (가장 최근 방문)
Close C → B (가장 최근 방문)
Close B → A (가장 최근 방문)
Close A → 불가능 (항상 1개 이상)
```

**평가**:
| 항목 | 점수 | 의견 |
|-----|------|------|
| 직관성 | ⭐⭐⭐⭐⭐ | 브라우저 익숙함 |
| 구현 난이도 | ⭐⭐⭐ | 히스토리 스택 관리 복잡 |
| 프로젝트 부합도 | ⭐⭐ | Chapter-first와 안 맞음 |
| 메모리 효율 | ⭐⭐ | 히스토리 누적 |

**결론**: 기능 풍부하나 우리 프로젝트에는 **과도함** ⚠️

---

### 2. primaryChapterId 패턴 (Fallback)

**동작**:
```
tabs: [A, B, C, D]
primaryChapterId: A ← 첫 장 (영구 보호)

Close D → C (직전)
Close C → B (직전)
Close B → A (직전, 자동으로 primaryChapter)
Close A → A (방지 또는 새 장 생성)
```

**평가**:
| 항목 | 점수 | 의견 |
|-----|------|------|
| 직관성 | ⭐⭐⭐⭐ | 간단하고 예측 가능 |
| 구현 난이도 | ⭐⭐⭐⭐⭐ | 최소한의 코드 |
| 프로젝트 부합도 | ⭐⭐⭐⭐⭐ | Chapter-first 완벽 일치 |
| 메모리 효율 | ⭐⭐⭐⭐⭐ | 상수 메모리 (상수 저장) |

**결론**: **최적의 선택** ✅

---

## 🏆 최종 권장사항

### 선택: primaryChapterId + 선택적 MRU

#### Phase 1 (필수, 즉시)
```typescript
// 기본 구조
interface ProjectEditorState {
  tabs: EditorTab[];
  activeTabId: string;
  primaryChapterId: string;  // ← 첫 장 ID (영구 보호)
}

// 탭 닫기
function findNextActiveTab(tabs, primaryChapterId) {
  // 직전 탭이 있으면 그것
  // 없으면 primaryChapterId로 복구
  // 끝으로 첫 장
}
```

**구현 시간**: 1-2시간
**복잡도**: 낮음
**효과**: 완전한 'main' 탭 제거 + Chapter-only

---

#### Phase 2 (선택사항, 사용자 피드백 후)
```typescript
// MRU 히스토리 추가 (선택적)
interface ProjectEditorState {
  tabs: EditorTab[];
  activeTabId: string;
  primaryChapterId: string;
  tabHistory: string[];  // ← 최근 3-5개만 저장 (메모리 제한)
}

// Ctrl+Tab: 이전 탭으로
function goToPreviousTab() {
  const prevTab = tabHistory[1];  // 두 번째 항목
  setActiveTab(prevTab);
}
```

**효과**: 브라우저 같은 "뒤로 가기" 경험 + Phase 1 안정성

---

#### Phase 3 (고급 기능, 장기)
- Cmd+K 탭 스위처
- Cmd+Shift+T 닫힌 탭 복구
- 탭 재정렬 (드래그)
- 즐겨찾기 탭

---

## 📈 변화 비교

### 현재 상태 (main 탭 있음)
```
tabs: [
  { id: 'main', type: 'main', title: '메인', content: projectData.content },
  { id: 'chapter-1', type: 'chapter', title: '1장', content: ... },
  { id: 'chapter-2', type: 'chapter', title: '2장', content: ... }
]
activeTabId: 'main'
```

**문제**:
- ❌ 'main'은 semantic null (목적 불명확)
- ❌ 사용자는 '장' 중심인데 메인 탭이 거슬림
- ❌ 상태 관리 복잡 (fallback 처리)

### Phase 1 구현 후 (primaryChapterId)
```
tabs: [
  { id: 'chapter-1', type: 'chapter', title: '1장', content: ... },
  { id: 'chapter-2', type: 'chapter', title: '2장', content: ... }
]
activeTabId: 'chapter-1'
primaryChapterId: 'chapter-1'  // ← 영구 보호
```

**개선**:
- ✅ 'main' 제거 (완벽함)
- ✅ Chapter-only (명확함)
- ✅ primaryChapter 자동 복구 (안정적)
- ✅ 상태 관리 간단

---

## 🔄 실제 워크플로우 예시

### 작가의 전형적 사용
```
1️⃣ 프로젝트 열기
   → 1장 자동 표시 (primaryChapter)

2️⃣ 3장 내용 쓰러 가기
   → "3장 선택" → 3장으로 이동

3️⃣ 5장 구성 확인
   → "5장 선택" → 5장으로 이동

4️⃣ 2장 수정
   → "2장 선택" → 2장으로 이동

5️⃣ 2장 닫기 (탭 X)
   → 직전 탭 (5장)으로 자동 이동 ✅

6️⃣ 5장 닫기
   → 직전 탭 (3장)으로 자동 이동 ✅

7️⃣ 3장 닫기
   → 직전 탭 (1장)으로 자동 이동 ✅

8️⃣ 모든 탭 닫으려 함
   → 1장 유지 (primaryChapter) - "안전" ✅
```

**사용자 경험**: 직관적, 안정적, 예측 가능 ✅

---

## 💡 고려 사항

### Q1: 사용자가 "뒤로 가기" 없이 답답해하진 않을까?

**A**: Phase 1로 충분함. 필요하면 Phase 2에서 추가.

- Phase 1: 직전 탭으로 이동 (충분)
- Phase 2: 이전 탭 히스토리 (선택)
- Phase 3: Ctrl+Tab (고급)

### Q2: 첫 장(primaryChapter)를 닫고 싶으면?

**A**: 두 가지 옵션:

1. **닫기 방지** (권장)
   ```
   User tries: 1장 X
   System: "마지막 장입니다"
   Result: 1장 유지
   ```

2. **새 장 자동 생성** (선택사항)
   ```
   User tries: 1장 X
   System: 새 빈 장 생성 + 활성화
   Result: 새 장이 primaryChapter가 됨
   ```

### Q3: 기존 프로젝트는?

**A**: 마이그레이션 필요:
- 기존 'main' 탭의 content → 첫 chapter로 병합
- 또는 별도 마이그레이션 스크립트
- (별도 문서에서 정의)

---

## 📋 구현 체크리스트

### Immediate (Phase 1)
- [ ] Remove 'main' from EditorTab.type
- [ ] Add primaryChapterId to ProjectEditorState
- [ ] Add setPrimaryChapterId action
- [ ] Update findNextActiveTab()
- [ ] Auto-load first chapter
- [ ] Remove 'main' from save logic
- [ ] pnpm build (0 errors)
- [ ] Visual test + unit test

**예상 시간**: 1-2시간  
**다음**: 코드 구현으로 진행

### Later (Phase 2, 3)
- [ ] MRU 히스토리 추가
- [ ] Ctrl+Tab 네비게이션
- [ ] 닫힌 탭 복구
- (사용자 피드백에 따라)

---

## 📚 참고 자료

**생성된 문서**:
1. `/docs/TAB_PATTERN_ANALYSIS.md` - 상세 비교 분석
2. `/docs/TAB_PATTERN_WORKFLOW.md` - 실제 동작 흐름

**연구 출처**:
- Exa AI: React tab patterns, browser tab management (4000 tokens)
- Context7: VS Code editor management, Monaco Editor lifecycle (7000 tokens)
- 40+ 라이브러리 사례 분석 (Ant Design, MUI, Headless UI, etc.)

---

## ✅ 결론

**선택**: primaryChapterId + 선택적 MRU

**다음 단계**: Phase 1 구현 시작

**효과**:
- ✅ 'main' 탭 완전 제거
- ✅ Chapter-only 아키텍처 (명확함)
- ✅ 안정적 fallback (primaryChapter)
- ✅ 메모리 효율적 (상수 저장)
- ✅ 간단한 구현 (1-2시간)
- ✅ 향후 확장 가능 (Phase 2, 3)

**최종 평가**: 🎯 **최적의 선택** ✅

---

**작성 완료**: 2025-10-21 18:00  
**상태**: 코드 구현 준비 완료  
**다음**: `ProjectEditorStateService.ts` → `shared/types/editor.ts` → `projectEditor/index.tsx` 순서로 구현

