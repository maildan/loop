# 🔀 탭 패턴 분석: 브라우저 vs primaryChapterId

**작성일**: 2025-10-21  
**목표**: 두 가지 탭 관리 패턴을 비교 분석, 작성 소프트웨어에 최적의 패턴 결정

---

## 1️⃣ 패턴 소개

### A. 브라우저 탭 패턴 (Browser Stack Pattern)

**구조**:
```
Tabs: [Chapter-1, Chapter-2, Chapter-3, Chapter-4]
      ↑ activeTab = Chapter-4
      
Close Chapter-4 → activeTab = Chapter-3 (이전 활성 탭)
Close Chapter-3 → activeTab = Chapter-2
Close Chapter-2 → activeTab = Chapter-1
Close Chapter-1 → ??? (모든 탭 닫힘, fallback 필요)
```

**핵심 메커니즘**:
- **MRU (Most Recently Used)** 기반: 가장 최근에 방문한 탭으로 자동 이동
- **히스토리 스택**: `tabHistory = [Chapter-1, Chapter-2, Chapter-4]` (시간순)
- **탭 완전 종료 불가**: 브라우저는 항상 최소 1개 탭 유지

**장점**:
✅ 직관적 (사용자가 예측 가능)  
✅ 여러 탭 오가기에 효율적 (Ctrl+Tab 으로 이전 탭 복원)  
✅ IDE/에디터 표준 (VS Code, JetBrains)  

**단점**:
❌ 히스토리 스택 관리 복잡  
❌ 메모리 오버헤드 (모든 탭 히스토리 저장)  
❌ 프로젝트 특성과 맞지 않음 (chapter-first가 아님)  

---

### B. primaryChapterId 패턴 (Fallback Pattern)

**구조**:
```
tabs: [Chapter-1, Chapter-2, Chapter-3, Chapter-4]
      ↑ activeTab = Chapter-4
primaryChapterId: Chapter-1  ← 첫 chapter ID 저장 (복구용)

Close Chapter-4 → activeTab = Chapter-3 (직전 탭)
Close Chapter-3 → activeTab = Chapter-2
Close Chapter-2 → activeTab = Chapter-1
Close Chapter-1 → activeTab = Chapter-1 (유지, primaryChapterId)
```

**핵심 메커니즘**:
- **하이브리드**: 간단한 직전 탭 + 안정적 fallback
- **primaryChapterId**: 첫 chapter = "최후의 보류" (never close)
- **탭 완전 종료 불가**: primaryChapterId 때문에 자동 복구

**장점**:
✅ 간단한 구현 (직전 탭 추적만)  
✅ 메모리 효율적  
✅ Chapter-centric 설계와 완벽 일치  
✅ Fallback 명확  

**단점**:
❌ primaryChapterId 개념이 사용자에게 생소할 수 있음  
❌ Ctrl+Tab 등 고급 네비게이션 미지원  
❌ 여러 탭 오가기 시 불편 (두 탭만 왕복 시 불편)  

---

## 2️⃣ 패턴 비교 테이블

| 기준 | 브라우저 패턴 | primaryChapterId | 추천 |
|------|----------|-------|------|
| **탭 닫기 로직** | MRU 기반 (자동) | 직전 탭 또는 primary | primaryChapterId ✅ |
| **구현 복잡도** | 높음 (히스토리 관리) | 낮음 (간단) | primaryChapterId ✅ |
| **사용자 학습곡선** | 낮음 (브라우저 익숙) | 중간 (primary 개념) | 브라우저 패턴 |
| **탭 완전 종료 시** | 불가능 (최소 1개) | 유지 (primaryChapter) | 둘 다 가능 |
| **프로젝트 부합도** | 중간 (일반적) | 높음 (chapter-centric) | primaryChapterId ✅ |
| **메모리 오버헤드** | 높음 (히스토리 저장) | 낮음 | primaryChapterId ✅ |
| **고급 기능** | 많음 (Ctrl+Tab, MRU) | 기본만 | 브라우저 패턴 |
| **관리 상태** | `tabHistory: []` | `primaryChapterId: ''` | primaryChapterId ✅ |

---

## 3️⃣ 작성 소프트웨어 관점

### 특성 분석

**작성 소프트웨어가 필요한 것**:
1. **Chapter-first 설계** ← 완전한 "장 중심"
2. **안정적 fallback** ← 모든 탭 닫아도 복구
3. **심플한 UX** ← 사용자는 "장 선택"만 생각
4. **메모리 효율** ← 긴 세션 중 누적되지 않음
5. **명확한 상태** ← "메인 탭 없음" (완벽히 제거됨)

### 현재 설계와의 부합도

```
┌─────────────────────────────────────────┐
│ 작성 소프트웨어 = Chapter-Centric App    │
│ (메인 탭 X, 장만 있음)                  │
└─────────────────────────────────────────┘

브라우저 패턴 부합도: 60% (과도한 기능)
primaryChapterId 부합도: 95% (완벽 일치)
```

---

## 4️⃣ 하이브리드 제안

### "Best of Both" 접근

**기본 설계**: primaryChapterId (안정성)  
**+추가**: 간단한 MRU 히스토리 (UX 향상)

```typescript
// ProjectEditorState 확장
export interface ProjectEditorState {
  tabs: EditorTab[];
  activeTabId: string;
  primaryChapterId: string;
  tabHistory: string[];  // ← 최근 3-5개만 유지 (MRU)
}

// 탭 닫기 로직
function findNextActiveTab(
  tabHistory: string[],
  tabs: EditorTab[],
  primaryChapterId: string
): string {
  // 1단계: 히스토리에서 유효한 탭 찾기 (MRU)
  for (const tabId of tabHistory) {
    if (tabs.find(t => t.id === tabId)) {
      return tabId;
    }
  }
  
  // 2단계: primaryChapterId 복구
  if (primaryChapterId && tabs.find(t => t.id === `chapter-${primaryChapterId}`)) {
    return `chapter-${primaryChapterId}`;
  }
  
  // 3단계: 첫 chapter
  return tabs.find(t => t.type === 'chapter')?.id || '';
}

// 탭 클릭 시 히스토리 업데이트
function setActiveTab(tabId: string) {
  setState(prev => ({
    ...prev,
    activeTabId: tabId,
    tabHistory: [tabId, ...prev.tabHistory.slice(0, 4)]  // 최근 5개
  }));
}
```

**이점**:
✅ 기본은 간단 (primaryChapterId)  
✅ 두 탭 사이 왕복 시 부드러움 (MRU)  
✅ 메모리 효율적 (히스토리 제한)  
✅ Chapter-centric 유지  

---

## 5️⃣ 최종 권장사항

### 🎯 선택: **primaryChapterId + 선택적 MRU**

**이유**:

1. **프로젝트 부합도** ← Chapter-first 설계와 완벽 일치
2. **구현 로드맵**:
   - **Phase 1** (필수): primaryChapterId 기본 구현
   - **Phase 2** (선택): 간단한 MRU 히스토리 추가
   - **Phase 3** (고급): Ctrl+Tab, 키보드 네비게이션 추가

3. **즉시 시작**: Phase 1만 해도 충분
   - 안정적 fallback ✅
   - 메모리 효율 ✅
   - 상태 명확 ✅
   - 사용자 학습 용이 ✅

4. **향후 개선 가능**: Phase 2, 3로 고급 기능 추가
   - 사용자 피드백 후 결정
   - 복잡도 증가 최소화

---

## 6️⃣ 구현 체크리스트 (Phased)

### Phase 1: 기본 primaryChapterId (필수)
- [ ] Remove 'main' from EditorTab.type
- [ ] Add primaryChapterId to ProjectEditorState
- [ ] Update findNextActiveTab() with fallback logic
- [ ] Auto-load first chapter on project open
- [ ] Remove 'main' tab initialization

### Phase 2: 간단한 MRU (선택, 향후)
- [ ] Add tabHistory to ProjectEditorState (max 5)
- [ ] Update setActiveTab to push history
- [ ] Update findNextActiveTab to use tabHistory first

### Phase 3: 고급 네비게이션 (선택, 향후)
- [ ] Ctrl+Tab for previous tab
- [ ] Tab switcher (Cmd+K + Tab list)
- [ ] Restore closed tab (Cmd+Shift+T 같은 기능)

---

## 7️⃣ 참고: 다른 에디터들의 선택

| 에디터 | 패턴 | 히스토리 |
|------|-----|--------|
| VS Code | MRU 기반 | ✅ 전체 저장 |
| Sublime Text | MRU 기반 | ✅ 세션 저장 |
| Vim (Tabs) | Stack 기반 | ❌ 없음 |
| Chrome | MRU 기반 | ✅ 세션 복구 |
| **Loop App** | **primaryChapterId** | ⚠️ Phase 2에서 추가 |

---

## 📌 요약

**최종 결정**: **primaryChapterId 패턴** (Phase 1부터 시작)

**지금 바로 구현**:
1. 'main' 타입 제거
2. primaryChapterId 추가
3. Fallback 로직 추가
4. 첫 chapter 자동 로드

**향후 개선 (사용자 피드백 후)**:
1. MRU 히스토리 추가
2. 고급 키보드 네비게이션

이 접근은 **작성 소프트웨어의 본질 (Chapter-first)** 과 **안정성**을 동시에 만족합니다. 🎉

