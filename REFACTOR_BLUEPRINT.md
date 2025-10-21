# 🏗 ProjectEditor 모듈화 리팩토링 청사진

**생성 날짜**: 2024  
**파일 대상**: `src/renderer/components/projects/modules/projectEditor/index.tsx`  
**현재 상태**: 1190줄, 단일 파일 (모듈화 전)  
**목표**: 6-7개 모듈로 분해 (SRP 준수)  

---

## 📋 현재 상태 요약

### 파일 규모 및 복잡도
| 구간 | 라인 수 | 담당 영역 |
|------|--------|---------|
| 1-60 | 60줄 | Import, 인터페이스, 심볼 정의 |
| 60-250 | 190줄 | Hook 초기화, 상태관리, 단축키 바인딩 |
| 250-500 | 250줄 | useEffect 훅들, renderCurrentView() |
| 500-750 | 250줄 | EditorTabBar 렌더링, 탭 이벤트 핸들러 |
| 750-1000 | 250줄 | ProjectSidebar (전개/축소), 뷰 전환 |
| 1000-1190 | 190줄 | 모달들, 하단 코드 |

### 핵심 관심사 (Concerns)
1. **상태관리**: 7개 useEffect, 3개 저장소 (useProjectEditorState, useStructureStore, useSettings)
2. **UI 렌더링**: 6가지 뷰 (write, structure, characters, notes, synopsis, idea)
3. **탭 시스템**: 탭 생성, 활성화, 삭제, 메타데이터 캐싱
4. **사이드바**: 펼침/축소, hover 상태, 뷰 전환
5. **이벤트 핸들링**: 키보드 단축키 6개, 탭 이벤트들, 모달 제어
6. **모달 관리**: 5개 모달 (NewChapter, Delete, Share, Character, Note)
7. **EmptyState**: 탭 없을 때 "최근 챕터 복구" 로직

---

## 🔍 상세 분석

### 1. Import 분석 (30+ 의존성)

#### UI 컴포넌트 (15개)
```typescript
MarkdownEditor, EditorProvider, ShortcutHelp
WriterSidebar, ProjectSidebar, WriterStatsPanel, ProjectHeader
EditorTabBar, NewChapterModal, ConfirmDeleteDialog, ShareDialog
WriteView, StructureView, CharactersView, NotesView, SynopsisView
GeminiSynopsisAgent, IdeaView, EmptyEditorState
```

#### 상태/데이터 Hook (5개)
```typescript
useProjectData        // 프로젝트 메타데이터
useUIState           // UI 전역상태
useProjectEditorState // 에디터 상태 (tabs, activeTabId, cache)
useStructureStore    // Zustand store
useSettings          // 설정 (zenMode, sidebarCollapsed)
```

#### 서비스/유틸
```typescript
ProjectEditorStateService, Logger
```

### 2. 상태 계층 분석

#### 로컬 상태 (useState)
- `tabBarHovered: boolean` → 탭바 hover
- `sidebarHovered: boolean` → 사이드바 hover  
- `headerHovered: boolean` → 헤더 hover (미사용)
- `editorInstance: MarkdownEditor | null` → 에디터 인스턴스

#### Hook 상태 (useProjectEditorState)
- `tabs: EditorTab[]` → 열린 탭 목록
- `activeTabId: string` → 활성 탭
- `tabMetadataCache: Record<string, TabMetadata>` → 캐시
- `currentView: ProjectEditorView` → 현재 뷰 (write/structure/characters/notes/synopsis/idea)
- `showRightSidebar: boolean` → 우측 사이드바 표시 여부
- `showDeleteDialog, showShareDialog, showNewChapterModal, showNewCharacterModal, showNewNoteModal: boolean` → 모달 상태 5개

#### Store 상태 (useStructureStore)
- `structures[projectId][]` → 챕터 목록

#### Settings 상태 (useSettings)
- `ui.zenMode: boolean` → 집중 모드
- `ui.sidebarCollapsed: boolean` → 사이드바 축소 여부

### 3. useEffect 훅 분석 (7개)

| useEffect | 라인 | 의존성 | 역할 |
|-----------|------|--------|------|
| #1 | ~90 | [state.tabMetadataCache] | 캐시 변경 시 localStorage 저장 |
| #2 | ~120 | [projectId, actions] | 마운트 시 최근 챕터 자동 열기 ⚠️ 무한루프 위험 |
| #3 | ~140 | [state.showNewChapterModal] | 모달 상태 디버그 (미사용) |
| #4 | ~160 | [isSidebarCollapsed] | 사이드바 상태 동기화 |
| #5 | ~180 | [projectId] | Cmd+S 단축키 저장 |
| #6 | ~200 | [projectId] | 키보드 단축키 바인딩 (Alt+Ctrl+S, Alt+Ctrl+H, Escape) |
| #7 | (진행 중) | ... | ... |

### 4. 렌더링 함수 분석

#### renderCurrentView() (라인 ~280-500)
6가지 케이스를 처리하는 거대 switch 문:

```typescript
switch (state.currentView) {
  case 'write':       // MarkdownEditor + EditorProvider
  case 'structure':   // StructureView + onNavigateToChapterEdit
  case 'characters':  // CharactersView
  case 'notes':       // NotesView
  case 'synopsis':    // SynopsisView
  case 'idea':        // IdeaView
  default:            // 에러 표시
}
```

각 케이스는 다양한 props과 콜백을 전달함.

#### JSX 렌더링 구조 (라인 ~520-1190)

```
ProjectEditorLayout.Container
├── Sticky Header (z-1200)
│   ├── ProjectHeader (write 뷰만)
│   └── EditorTabBar
├── Main Content (ProjectEditorLayout.Main)
│   ├── Hover Trigger 영역 (z-100)
│   ├── ProjectSidebar (hover, z-150)
│   ├── ProjectSidebar (normal, z-140)
│   └── Main Content Area
│       ├── EmptyState (탭 없을 때)
│       │   └── MRU 탭 복구 로직
│       └── Content + Right Sidebar
│           ├── renderCurrentView()
│           └── WriterStatsPanel or GeminiSynopsisAgent
├── 모달들 (5개)
│   ├── ConfirmDeleteDialog
│   ├── ShareDialog
│   ├── NewChapterModal
│   ├── NewCharacterModal (임시)
│   └── NewNoteModal (임시)
└── ShortcutHelp
```

### 5. 이벤트 핸들러 분석

#### 탭 이벤트 (EditorTabBar)
- `onTabClick(tabId)` → 탭 활성화 + 뷰 동기화
- `onTabClose(tabId)` → 탭 제거 + 캐시 저장 (🔥 CRITICAL: sync save)
- `onNewTab()` → 새 탭 생성

#### 단축키 (6개)
- **Cmd+S**: 현재 탭 내용 저장
- **Alt+Ctrl+S**: 전체 프로젝트 저장
- **Alt+Ctrl+H**: 단축키 도움말 토글
- **Escape**: 모달/사이드바 닫기
- (추가 분석 필요)

#### 사이드바 뷰 전환
- `onViewChange(view)` → 뷰 변경 + 탭 생성/활성화 (2곳 중복)

#### 모달 이벤트
- `onAddStructure()` → NewChapterModal 열기
- `onAddCharacter()` → NewCharacterModal 열기
- `onAddNote()` → NewNoteModal 열기

### 6. MRU (최근 사용) 탭 복구 로직

**문제점**: 페이지 새로고침 후 탭이 없을 때, "계속 작성하기" 버튼으로 최근 챕터 복구

**현재 구현** (라인 ~850-1000):
1. state.tabMetadataCache 확인
2. 비어있으면 localStorage 직접 로드
3. 가장 최근 탭 찾기 (lastAccessedAt)
4. EmptyEditorState에 metadata 전달
5. 사용자 클릭 시 탭 재생성

**문제**:
- ✅ 캐시 로드 로직 구현됨
- ✅ localStorage 폴백 구현됨
- ✅ chapterId 검증 및 구조 데이터 연계

---

## 🎯 모듈화 계획 (6-7개 모듈)

### Phase 1: 상태 관리 분리

#### Module 1: `hooks/useEditorState.ts`
**책임**: 탭, 뷰, 모달 상태 관리  
**내용**:
- useProjectEditorState 래핑
- 모든 상태 액션 (addTab, removeTab, setActiveTab, setCurrentView, etc.)
- 캐시 로드/저장 로직
- useRef로 무한루프 방지

**라인 수**: ~150-200줄  
**의존성**: ProjectEditorStateService, useStructureStore

---

#### Module 2: `hooks/useEditorShortcuts.ts`
**책임**: 키보드 단축키 바인딩  
**내용**:
- Cmd+S, Alt+Ctrl+S, Alt+Ctrl+H, Escape 등
- useEffect로 listener 등록
- 각 단축키별 핸들러 함수

**라인 수**: ~100줄  
**의존성**: Logger

---

#### Module 3: `hooks/useUIState.ts`
**책임**: UI 전역 상태 (사이드바, hover, zenMode)  
**내용**:
- isSidebarCollapsed, tabBarHovered, sidebarHovered
- useSettings 연계
- toggleSidebar, setSidebarHovered 등

**라인 수**: ~80줄  
**의존성**: useSettings

---

### Phase 2: 뷰 컴포넌트 분리

#### Module 4: `views/EditorViewManager.tsx`
**책임**: renderCurrentView() 함수의 모듈화  
**내용**:
```typescript
export function EditorViewManager({ 
  view, 
  activeTab, 
  onNavigateToChapterEdit,
  ...handlers 
}) {
  switch (view) {
    case 'write': return <WriteView ... />
    case 'structure': return <StructureView ... />
    case 'characters': return <CharactersView ... />
    case 'notes': return <NotesView ... />
    case 'synopsis': return <SynopsisView ... />
    case 'idea': return <IdeaView ... />
  }
}
```

**라인 수**: ~200줄  
**의존성**: 모든 뷰 컴포넌트

---

#### Module 5: `components/EditorLayout.tsx`
**책임**: 전체 레이아웃 구조 (sticky header, sidebar, main)  
**내용**:
```typescript
export function EditorLayout({
  header,
  sidebar,
  mainContent,
  rightSidebar,
  modals,
  shortcutHelp
}) {
  // ProjectEditorLayout.Container 구조
  // Header + TabBar sticky 영역
  // Main content area
  // Modals
  // ShortcutHelp
}
```

**라인 수**: ~150줄  
**의존성**: ProjectEditorLayout

---

### Phase 3: 이벤트 핸들러 분리

#### Module 6: `handlers/editorEventHandlers.ts`
**책임**: 모든 이벤트 콜백 함수  
**내용**:
```typescript
export const createEditorEventHandlers = (state, actions, projectData, etc.) => ({
  onTabClick: (tabId) => { ... },
  onTabClose: (tabId) => { ... },
  onTabNew: () => { ... },
  onNavigateToChapterEdit: (chapterId) => { ... },
  onNavigateToIdeaEdit: (ideaId) => { ... },
  onSaveContent: () => { ... },
  // ... 기타 핸들러
});
```

**라인 수**: ~150줄  
**의존성**: Logger, ProjectEditorStateService

---

#### Module 7: `components/ModalsContainer.tsx`
**책임**: 모든 모달 컴포넌트 렌더링  
**내용**:
```typescript
export function ModalsContainer({
  state,
  actions,
  projectData,
  handlers
}) {
  return (
    <>
      {state.showDeleteDialog && <ConfirmDeleteDialog ... />}
      {state.showShareDialog && <ShareDialog ... />}
      {state.showNewChapterModal && <NewChapterModal ... />}
      {state.showNewCharacterModal && <NewCharacterModal ... />}
      {state.showNewNoteModal && <NewNoteModal ... />}
    </>
  );
}
```

**라인 수**: ~80줄  
**의존성**: 모든 모달 컴포넌트

---

### Phase 4: MRU 탭 복구 분리

#### Module 8: `components/EmptyEditorContainer.tsx`
**책임**: 탭 없을 때 EmptyState + MRU 로직  
**내용**:
```typescript
export function EmptyEditorContainer({
  projectId,
  tabMetadataCache,
  onCreateChapter,
  onOpenLastChapter
}) {
  // 캐시에서 최근 탭 조회
  // localStorage 폴백
  // EmptyEditorState 렌더링
  // 복구 로직
}
```

**라인 수**: ~120줄  
**의존성**: EmptyEditorState, ProjectEditorStateService, useStructureStore

---

## 📊 모듈화 전후 비교

### Before
```
index.tsx (1190줄)
├── imports (30+)
├── 상태 선언 (50줄)
├── 7개 useEffect (200줄)
├── 6개 renderCurrentView 케이스 (200줄)
├── 사이드바 렌더링 (300줄)
├── 탭 이벤트 (150줄)
├── 모달들 (200줄)
└── JSX 구조 (150줄)
```

### After
```
index.tsx (200-250줄, 통합)
├── imports (간결)
├── 상태 hooks 임포트
├── 메인 로직 (상태 초기화, props 설정)
└── JSX (Layout 호출)

hooks/
├── useEditorState.ts (150-200줄)
├── useEditorShortcuts.ts (100줄)
└── useUIState.ts (80줄)

views/
└── EditorViewManager.tsx (200줄)

components/
├── EditorLayout.tsx (150줄)
├── ModalsContainer.tsx (80줄)
└── EmptyEditorContainer.tsx (120줄)

handlers/
└── editorEventHandlers.ts (150줄)
```

**총 결과**: 1190줄 → 8개 모듈, 각 100-200줄 (관리 용이)

---

## 🔧 구현 순서 (권장)

### Step 1: 상태 관리 Hook 추출 (Module 1-3)
**우선순위**: 🔴 높음  
**이유**: 다른 모듈이 의존함  
**검증**: 상태 로직 동일성 테스트

### Step 2: 이벤트 핸들러 추출 (Module 6)
**우선순위**: 🟡 중간  
**이유**: Module 1 완료 후 가능  
**검증**: 이벤트 동작 통합 테스트

### Step 3: 뷰 매니저 추출 (Module 4)
**우선순위**: 🟡 중간  
**이유**: 렌더링 로직만 분리  
**검증**: 각 뷰 렌더링 동일성

### Step 4: 레이아웃 + 모달 추출 (Module 5, 7-8)
**우선순위**: 🟢 낮음  
**이유**: UI 구조 최적화용  
**검증**: 레이아웃 계층 확인

---

## ✅ 검증 기준

모든 모듈화 후 다음을 확인:

- [ ] **기능**: 모든 탭 작업, 뷰 전환, 단축키 동일
- [ ] **성능**: 리렌더링 횟수 증가 없음
- [ ] **타입 안정성**: TypeScript strict 모드 통과
- [ ] **테스트**: 기존 테스트 모두 통과
- [ ] **빌드**: 0 에러, 번들 크기 변화 없음

---

## 📝 주의사항

1. **useEffect 의존성**
   - ⚠️ useEditorState에서 `actions` 객체 의존성 주의
   - ✅ useRef로 첫 로드 추적하여 무한루프 방지

2. **상태 동기화**
   - ✅ state.tabMetadataCache ↔ localStorage 동기화 필수
   - ✅ removeTab 호출 후 즉시 localStorage 저장 (sync)

3. **타입 안정성**
   - ✅ ProjectEditorView, EditorTab, TabMetadata 타입 명확
   - ✅ 모든 핸들러 함수 타입 정의

4. **마이그레이션 경로**
   - 🔄 각 모듈 추출 후 index.tsx 즉시 업데이트
   - 🔄 빌드 확인 후 다음 모듈 진행
   - 🚫 모든 모듈을 동시에 변경하지 말 것

---

## 🎯 최종 목표

- ✅ 단일 책임 원칙 준수
- ✅ 각 모듈 100-200줄 (읽기 용이)
- ✅ 의존성 명확 (순환 참조 없음)
- ✅ 테스트 용이 (단위 테스트 가능)
- ✅ 유지보수 개선 (새 기능 추가 시 영향 범위 최소화)
