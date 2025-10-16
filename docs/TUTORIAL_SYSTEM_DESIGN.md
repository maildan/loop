# 📚 작업 기반 튜토리얼 시스템 구현 계획

## 🎯 목표

Loop 앱의 "사용법 보기" 기능을 통해 **작업 기반 튜토리얼** (Task-based Onboarding) 시스템 구축
- 사용자가 실제로 앱을 조작하면서 학습
- 각 단계별로 "이렇게 하면 이렇게 된다" 설명
- 진행도 표시 및 상태 저장

---

## 🏗 아키텍처 설계

### 파일 구조

```
src/renderer/modules/tutorial/
├── TutorialProvider.tsx          # 전역 상태 제공자
├── TutorialContext.tsx           # Context 정의
├── useTutorial.ts                # 튜토리얼 제어 Hook
├── useGuidedTour.ts              # Driver.js 래핑 Hook
├── types.ts                      # TypeScript 타입
├── tutorials/
│   ├── index.ts                  # 튜토리얼 목록
│   ├── getStartedTutorial.ts     # 기초 튜토리얼
│   ├── createProjectTutorial.ts  # 프로젝트 생성 튜토리얼
│   └── structureAnalysisTutorial.ts  # 구조 분석 튜토리얼
└── components/
    └── TutorialOverlay.tsx       # 튜토리얼 오버레이 (선택)
```

### 기술 스택

```
핵심 라이브러리:
├── driver.js (v5.x+)     - 인터랙티브 가이드 투어
├── React Context API     - 상태 관리
└── localStorage          - 진행 상태 저장

빌드 도구:
├── TypeScript            - 타입 안전성
├── Vite                  - 번들링
└── Electron              - 데스크톱 앱
```

---

## 📋 타입 정의 (types.ts)

```typescript
/**
 * 튜토리얼 단계 정의
 */
export interface TutorialStep {
  id: string;
  element: string;              // CSS selector 또는 function
  title: string;
  description: string;
  action?: () => Promise<void>; // 자동 실행 액션
  position?: 'top' | 'bottom' | 'left' | 'right';
  waitForElement?: boolean;     // 요소 로드 대기
}

/**
 * 튜토리얼 정의
 */
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  steps: TutorialStep[];
  duration?: number;            // 예상 소요 시간 (초)
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * 튜토리얼 상태
 */
export interface TutorialState {
  currentTutorialId: string | null;
  currentStepIndex: number;
  isActive: boolean;
  completedTutorials: string[];
  skippedTutorials: string[];
}

/**
 * 튜토리얼 Context 값
 */
export interface TutorialContextValue {
  state: TutorialState;
  startTutorial: (tutorialId: string) => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  restartTutorial: () => void;
}
```

---

## 🔧 핵심 구현

### 1. TutorialContext.tsx

```typescript
import React, { createContext, useState, useCallback } from 'react';
import { TutorialState, TutorialContextValue } from './types';

export const TutorialContext = createContext<TutorialContextValue | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TutorialState>({
    currentTutorialId: null,
    currentStepIndex: 0,
    isActive: false,
    completedTutorials: [],
    skippedTutorials: []
  });

  const startTutorial = useCallback((tutorialId: string) => {
    setState(prev => ({
      ...prev,
      currentTutorialId: tutorialId,
      currentStepIndex: 0,
      isActive: true
    }));
  }, []);

  const skipTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      skippedTutorials: prev.currentTutorialId 
        ? [...prev.skippedTutorials, prev.currentTutorialId]
        : prev.skippedTutorials
    }));
  }, []);

  const completeTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      completedTutorials: prev.currentTutorialId
        ? [...prev.completedTutorials, prev.currentTutorialId]
        : prev.completedTutorials
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: prev.currentStepIndex + 1
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1)
    }));
  }, []);

  const restartTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: 0,
      isActive: true
    }));
  }, []);

  return (
    <TutorialContext.Provider value={{
      state,
      startTutorial,
      skipTutorial,
      completeTutorial,
      nextStep,
      previousStep,
      restartTutorial
    }}>
      {children}
    </TutorialContext.Provider>
  );
};
```

### 2. useTutorial.ts

```typescript
import { useContext } from 'react';
import { TutorialContext } from './TutorialContext';

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};
```

### 3. useGuidedTour.ts (Driver.js 래핑)

```typescript
import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { Tutorial } from './types';

export const useGuidedTour = (tutorial: Tutorial | null, isActive: boolean) => {
  const driverRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive || !tutorial) return;

    const steps = tutorial.steps.map((step, index) => ({
      element: step.element,
      popover: {
        title: step.title,
        description: step.description,
        side: step.position || 'bottom',
        align: 'start' as const,
        progressText: `${index + 1} / ${tutorial.steps.length}`
      }
    }));

    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps,
      overlayClickBehavior: 'none',
      allowClose: true
    });

    driverRef.current.drive();

    return () => {
      driverRef.current?.destroy();
    };
  }, [tutorial, isActive]);

  return driverRef.current;
};
```

---

## 📖 튜토리얼 정의

### getStartedTutorial.ts (기초 튜토리얼)

```typescript
import { Tutorial } from '../types';

export const getStartedTutorial: Tutorial = {
  id: 'get-started',
  title: 'Loop 기초 튜토리얼',
  description: '새 프로젝트를 만들고 분석하는 기본 방법을 배워봅시다',
  difficulty: 'beginner',
  duration: 300, // 5분
  steps: [
    {
      id: 'create-project',
      element: '[data-tour="create-project-btn"]',
      title: '1️⃣ 새 프로젝트 만들기',
      description: '이 버튼을 클릭하여 새 프로젝트를 생성합니다',
      position: 'right'
    },
    {
      id: 'project-title',
      element: '[data-tour="project-title-input"]',
      title: '2️⃣ 프로젝트 제목 입력',
      description: '프로젝트에 의미 있는 이름을 지어주세요 (예: "내 소설 첫 장")',
      position: 'bottom'
    },
    {
      id: 'create-confirm',
      element: '[data-tour="create-project-confirm"]',
      title: '3️⃣ 프로젝트 생성',
      description: '생성 버튼을 클릭합니다',
      position: 'top'
    },
    {
      id: 'dashboard-overview',
      element: '[data-tour="dashboard-container"]',
      title: '4️⃣ 프로젝트 대시보드',
      description: '프로젝트가 생성되었습니다! 여기서 전체 진행 상황을 볼 수 있습니다',
      position: 'bottom'
    },
    {
      id: 'sections-tab',
      element: '[data-tour="sections-tab"]',
      title: '5️⃣ 구조 분석',
      description: '이 탭에서 프로젝트의 Section을 관리할 수 있습니다',
      position: 'left'
    },
    {
      id: 'add-episode',
      element: '[data-tour="add-episode-btn"]',
      title: '6️⃣ 에피소드 추가',
      description: '새 에피소드를 추가합니다',
      position: 'bottom'
    },
    {
      id: 'gemini-analysis',
      element: '[data-tour="gemini-analyze-btn"]',
      title: '7️⃣ AI 분석',
      description: 'Gemini AI로 작품을 분석합니다',
      position: 'top'
    },
    {
      id: 'completion',
      element: '[data-tour="dashboard-stats"]',
      title: '🎉 완료!',
      description: 'Loop 기초 사용법을 모두 배웠습니다. 계속 탐험해보세요!',
      position: 'bottom'
    }
  ]
};
```

---

## 🎨 QuickStartCard 수정

### 수정 위치: src/renderer/components/dashboard/QuickStartCard.tsx

```typescript
import { useTutorial } from '@/modules/tutorial/useTutorial';

export const QuickStartCard = ({ onViewDocs }: Props) => {
  const { startTutorial } = useTutorial();

  const actions = [
    {
      id: 'docs',
      label: '사용법 보기',
      icon: BookOpen,
      variant: 'outline',
      onClick: () => startTutorial('get-started'),  // 변경: 튜토리얼 시작
      ariaLabel: '기초 튜토리얼 시작'
    },
    // ... 다른 액션들
  ];

  return (
    // ... JSX
  );
};
```

---

## 🔄 구현 단계

### Phase 1: 기본 구조 (지금)
- [ ] Driver.js 설치
- [ ] TutorialContext, Hook 구현
- [ ] 타입 정의
- [ ] Provider 설정

### Phase 2: 튜토리얼 정의 (다음)
- [ ] getStartedTutorial 작성
- [ ] 요소 data-tour 속성 추가
- [ ] 통합 테스트

### Phase 3: 통합 (최종)
- [ ] QuickStartCard 연동
- [ ] UI/UX 개선
- [ ] 다국어 지원 (한글/영어)

---

## 💾 진행도 저장

```typescript
// localStorage에 저장
const saveProgress = () => {
  localStorage.setItem('tutorial-state', JSON.stringify(state));
};

// 복원
const loadProgress = () => {
  const saved = localStorage.getItem('tutorial-state');
  if (saved) {
    setState(JSON.parse(saved));
  }
};
```

---

## 📱 데이터 속성 추가 (data-tour)

각 컴포넌트에 data-tour 속성 추가 필요:

```tsx
// 대시보드
<div data-tour="dashboard-container">...</div>

// 버튼들
<button data-tour="create-project-btn">프로젝트 생성</button>
<button data-tour="add-episode-btn">에피소드 추가</button>

// 탭
<Tab data-tour="sections-tab">Sections</Tab>

// 분석 버튼
<button data-tour="gemini-analyze-btn">Gemini 분석</button>
```

---

## 🎯 다음 튜토리얼 아이디어

1. **createProjectTutorial**: 상세 프로젝트 설정
2. **structureAnalysisTutorial**: 구조 분석 심화
3. **geminiAnalysisTutorial**: AI 분석 해석
4. **exportTutorial**: 내보내기 가이드

---

## 📊 예상 효과

✅ 새 사용자 온보딩 시간 단축 (5분 → 완전 학습)
✅ 앱 이탈률 감소 (명확한 가치 제시)
✅ 기능 발견율 증가 (숨겨진 기능 소개)
✅ 사용자 만족도 향상

---

## 🔗 참고 자료

- Driver.js 문서: https://driverjs.com
- React Context API: https://react.dev/reference/react/useContext
- 튜토리얼 UX 패턴: https://www.nngroup.com/articles/onboarding-mobile-apps/

