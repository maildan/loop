/**
 * 🔥 Loop 튜토리얼 시스템 - Context + Provider
 * Sequential Thinking: 단계별 상태 관리 + localStorage 동기화
 */

import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { TutorialContextValue, TutorialState, Tutorial } from './types';
import { Logger } from '../../../shared/logger';

/**
 * 튜토리얼 Context 생성
 */
export const TutorialContext = createContext<TutorialContextValue | undefined>(undefined);

/**
 * localStorage 키 상수
 */
const STORAGE_KEYS = {
  completedTutorials: 'loop-tutorial:completed',
  progress: 'loop-tutorial:progress',
} as const;

/**
 * 🔥 계획된 튜토리얼 목록 (오늘의 온보딩 플로우)
 * 사용자가 처음 앱을 시작할 때 진행할 튜토리얼의 순서
 */
const PLANNED_TUTORIALS = [
  'dashboard-intro',      // Step 1: 대시보드 소개
  'project-creator',      // Step 2: 프로젝트 생성 방법
  // Step 3 이상: 나중에 추가 (분석, 설정 등)
] as const;

/**
 * 기본 상태
 */
const initialState: TutorialState = {
  currentTutorialId: null,
  currentStepIndex: 0,
  isActive: false,
  completedTutorials: [],
  tutorialProgress: {},
};

/**
 * 튜토리얼 레지스트리 (동적 임포트용)
 * 나중에 추가될 튜토리얼들
 */
const tutorialRegistry = new Map<string, Tutorial>();

/**
 * 튜토리얼 레지스트리에 등록
 */
export function registerTutorial(tutorial: Tutorial): void {
  tutorialRegistry.set(tutorial.id, tutorial);
  Logger.info('TUTORIAL_CONTEXT', `✅ Tutorial registered: ${tutorial.id}`);
}

/**
 * 튜토리얼 레지스트리에서 조회
 */
export function getTutorial(tutorialId: string): Tutorial | undefined {
  return tutorialRegistry.get(tutorialId);
}

/**
 * localStorage에서 상태 복구
 */
function loadStateFromStorage(): Partial<TutorialState> {
  try {
    const completedStr = localStorage.getItem(STORAGE_KEYS.completedTutorials);
    const progressStr = localStorage.getItem(STORAGE_KEYS.progress);

    return {
      completedTutorials: completedStr ? JSON.parse(completedStr) : [],
      tutorialProgress: progressStr ? JSON.parse(progressStr) : {},
    };
  } catch (error) {
    Logger.warn('TUTORIAL_CONTEXT', '⚠️ Failed to load tutorial state from storage', error);
    return {};
  }
}

/**
 * localStorage에 상태 저장
 */
function saveStateToStorage(state: Partial<TutorialState>): void {
  try {
    if (state.completedTutorials) {
      localStorage.setItem(
        STORAGE_KEYS.completedTutorials,
        JSON.stringify(state.completedTutorials)
      );
    }
    if (state.tutorialProgress) {
      localStorage.setItem(
        STORAGE_KEYS.progress,
        JSON.stringify(state.tutorialProgress)
      );
    }
  } catch (error) {
    Logger.warn('TUTORIAL_CONTEXT', '⚠️ Failed to save tutorial state to storage', error);
  }
}

/**
 * TutorialProvider 컴포넌트
 */
export interface TutorialProviderProps {
  readonly children: React.ReactNode;
  readonly navigate?: (path: string) => void; // 🔥 IoC: 의존성 주입 (Optional for backward compatibility)
}

export function TutorialProvider({ children, navigate }: TutorialProviderProps): React.ReactElement {
  const [state, setState] = useState<TutorialState>(() => ({
    ...initialState,
    ...loadStateFromStorage(),
  }));

  /**
   * 📌 주입받은 navigate 함수를 Context에 저장
   * 이를 통해 하위 컴포넌트들이 navigate에 접근 가능
   */
  const navigateRef = React.useRef(navigate);

  /**
   * 튜토리얼 시작
   */
  const startTutorial = useCallback(async (tutorialId: string, startStepId?: string): Promise<void> => {
    const tutorial = getTutorial(tutorialId);
    if (!tutorial) {
      Logger.error('TUTORIAL_CONTEXT', `❌ Tutorial not found: ${tutorialId}`);
      return;
    }

    try {
      Logger.info('TUTORIAL_CONTEXT', `🚀 Starting tutorial: ${tutorialId}`);
      
      // 🔥 stepId 지정된 경우 그 스텝부터 시작, 아니면 0부터 시작
      let validStepIndex = 0;
      if (startStepId) {
        const foundStepIndex = tutorial.steps.findIndex(s => s.stepId === startStepId);
        if (foundStepIndex !== -1) {
          validStepIndex = foundStepIndex;
          Logger.info('TUTORIAL_CONTEXT', `📌 Starting from step ID: ${startStepId} (index: ${validStepIndex})`);
        } else {
          Logger.warn('TUTORIAL_CONTEXT', `⚠️ Step ID not found: ${startStepId}, starting from step 0`);
        }
      }

      // 🔥 완전 초기화: 이전 튜토리얼의 상태를 완전히 제거
      setState(prev => {
        const newState: TutorialState = {
          currentTutorialId: tutorialId,
          currentStepIndex: validStepIndex,
          isActive: true,
          completedTutorials: prev.completedTutorials,
          tutorialProgress: prev.tutorialProgress,
        };
        
        Logger.info(
          'TUTORIAL_CONTEXT',
          `📌 State reset: ${prev.currentTutorialId} (step ${prev.currentStepIndex}) → ${tutorialId} (step ${validStepIndex})`
        );
        
        return newState;
      });

      // 튜토리얼 시작 콜백
      if (tutorial.onStart) {
        await tutorial.onStart();
      }

      // 🔥 튜토리얼이 필요로 하는 경로로 네비게이션 (IoC 패턴: 주입받은 navigate 사용)
      if (tutorial.requiredPath && navigateRef.current) {
        Logger.info('TUTORIAL_CONTEXT', `📍 Navigating to required path: ${tutorial.requiredPath}`);
        navigateRef.current(tutorial.requiredPath);
      }

      Logger.info('TUTORIAL_CONTEXT', `✅ Tutorial started at step ${validStepIndex}`);
    } catch (error) {
      Logger.error('TUTORIAL_CONTEXT', `❌ Failed to start tutorial: ${tutorialId}`, error);
    }
  }, []);

  /**
   * 다음 단계로 이동
   */
  const nextStep = useCallback(async (): Promise<void> => {
    setState(prev => {
      if (!prev.currentTutorialId) return prev;

      const tutorial = getTutorial(prev.currentTutorialId);
      if (!tutorial) return prev;

      const nextIndex = prev.currentStepIndex + 1;
      const isLastStep = nextIndex >= tutorial.steps.length;

      if (isLastStep) {
        // 🔥 마지막 단계: returnTutorialId가 있으면 그 튜토리얼로 전환
        if (tutorial.meta?.returnTutorialId) {
          const returnTutorial = getTutorial(tutorial.meta.returnTutorialId);
          if (returnTutorial) {
            // 복귀할 튜토리얼의 특정 스텝으로 이동
            const returnStepId = tutorial.meta.returnStepId;
            const returnStepIndex = returnStepId
              ? returnTutorial.steps.findIndex(s => s.stepId === returnStepId)
              : 0;
            const validReturnStep = Math.max(0, returnStepIndex);

            Logger.info(
              'TUTORIAL_CONTEXT',
              `🔄 Returning from ${prev.currentTutorialId} to ${tutorial.meta.returnTutorialId} at step ${validReturnStep}`
            );

            return {
              ...prev,
              currentTutorialId: tutorial.meta.returnTutorialId,
              currentStepIndex: validReturnStep,
              isActive: true,
            };
          }
        }

        // 복귀 튜토리얼이 없으면 튜토리얼 완료
        return {
          ...prev,
          currentStepIndex: nextIndex,
          isActive: false,
        };
      }

      return {
        ...prev,
        currentStepIndex: nextIndex,
      };
    });

    // 진행도 저장
    setState(prev => {
      if (prev.currentTutorialId) {
        saveStateToStorage({
          tutorialProgress: {
            ...prev.tutorialProgress,
            [prev.currentTutorialId]: prev.currentStepIndex,
          },
        });
      }
      return prev;
    });
  }, []);

  /**
   * 이전 단계로 이동
   */
  const previousStep = useCallback(async (): Promise<void> => {
    setState(prev => {
      const newIndex = Math.max(0, prev.currentStepIndex - 1);
      Logger.info(
        'TUTORIAL_CONTEXT',
        `← Previous button: ${prev.currentStepIndex} → ${newIndex}`,
        { tutorialId: prev.currentTutorialId }
      );
      return {
        ...prev,
        currentStepIndex: newIndex,
      };
    });
  }, []);

  /**
   * 특정 단계로 이동
   */
  const goToStep = useCallback(async (stepIndex: number): Promise<void> => {
    setState(prev => {
      if (!prev.currentTutorialId) return prev;
      const tutorial = getTutorial(prev.currentTutorialId);
      if (!tutorial) return prev;

      const clampedIndex = Math.max(0, Math.min(stepIndex, tutorial.steps.length - 1));
      return {
        ...prev,
        currentStepIndex: clampedIndex,
      };
    });
  }, []);

  /**
   * 튜토리얼 완료
   * 
   * 🔥 React 공식 패턴: useCallback에서 prevState updater function 사용
   * completeTutorial = useCallback(async () => {
   *   setState(prevState => {
   *     // prevState를 읽고 새 상태 반환
   *     // 의존성 배열: [] (항상 안정적)
   *   });
   * }, []);
   * 
   * 이렇게 하면:
   * - completeTutorial 함수 참조가 절대 변하지 않음
   * - useEffect의 의존성에 안전하게 포함 가능
   * - 무한 루프 방지
   */
  const completeTutorial = useCallback(async (): Promise<void> => {
    // 🔥 방법 1: setState 호출 - 내부에서 prevState 읽기
    setState(prev => {
      if (!prev.currentTutorialId) return prev;

      const tutorial = getTutorial(prev.currentTutorialId);
      if (!tutorial) return prev;

      // ✅ Step 1: 완료 목록에 추가
      const newCompleted = Array.from(new Set([...prev.completedTutorials, prev.currentTutorialId]));
      Logger.info('TUTORIAL_CONTEXT', `✅ Tutorial completed: ${prev.currentTutorialId}`);

      // ✅ Step 2: localStorage에 저장
      saveStateToStorage({
        completedTutorials: newCompleted,
        tutorialProgress: {
          ...prev.tutorialProgress,
          [prev.currentTutorialId]: 0,
        },
      });

      // ✅ Step 3: 튜토리얼 완료 콜백 호출 (비동기, 하지만 setState는 동기)
      if (tutorial.onComplete) {
        // 🔥 비동기 콜백을 fireAndForget하면 에러 무시됨
        // 하지만 completeTutorial이 async라 유지
        Promise.resolve(tutorial.onComplete()).catch((err: unknown) =>
          Logger.error('TUTORIAL_CONTEXT', 'Error in tutorial.onComplete', err)
        );
      }

      // ✅ Step 4: 상태 종료 (사용자가 명시적으로 다음 튜토리얼을 선택하게 함)
      // 🔥 핵심: 더 이상 "자동으로 다시 시작" 하지 않음!
      const newState: TutorialState = {
        ...prev,
        currentTutorialId: null,
        currentStepIndex: 0,
        isActive: false,
        completedTutorials: newCompleted,
      };

      Logger.info(
        'TUTORIAL_CONTEXT',
        `🏁 Tutorial flow ended - User can choose next action or complete tutorial series`
      );

      return newState;
    });
  }, []);
  // 🔥 의존성 배열: [] (절대 변하지 않음)

  /**
   * 튜토리얼 스킵
   * 🔥 동일한 패턴: []의존성
   */
  const skipTutorial = useCallback(async (): Promise<void> => {
    setState(prev => {
      if (!prev.currentTutorialId) return prev;

      const tutorial = getTutorial(prev.currentTutorialId);
      if (!tutorial) return prev;

      // 튜토리얼 스킵 콜백 (비동기 처리)
      if (tutorial.onSkip) {
        Promise.resolve(tutorial.onSkip()).catch((err: unknown) =>
          Logger.error('TUTORIAL_CONTEXT', 'Error in tutorial.onSkip', err)
        );
      }

      Logger.info('TUTORIAL_CONTEXT', `⏭️ Tutorial skipped: ${prev.currentTutorialId}`);

      return {
        ...prev,
        currentTutorialId: null,
        currentStepIndex: 0,
        isActive: false,
      };
    });
  }, []);
  // 🔥 의존성 배열: []

  /**
   * 튜토리얼 닫기
   */
  const closeTutorial = useCallback((): void => {
    setState(prev => ({
      ...prev,
      currentTutorialId: null,
      isActive: false,
    }));
  }, []);

  /**
   * 튜토리얼 재설정
   * 🔥 동일한 패턴: []의존성
   */
  const resetTutorial = useCallback(async (tutorialId?: string): Promise<void> => {
    if (tutorialId) {
      // 특정 튜토리얼만 재설정 - setState 콜백에서 state 읽기
      setState(prev => {
        const newProgress = {
          ...prev.tutorialProgress,
          [tutorialId]: 0,
        };
        const newCompleted = prev.completedTutorials.filter(id => id !== tutorialId);
        
        saveStateToStorage({
          tutorialProgress: newProgress,
          completedTutorials: newCompleted,
        });
        
        return {
          ...prev,
          tutorialProgress: newProgress,
          completedTutorials: newCompleted,
        };
      });
    } else {
      // 모든 튜토리얼 재설정
      setState(initialState);
      localStorage.removeItem(STORAGE_KEYS.completedTutorials);
      localStorage.removeItem(STORAGE_KEYS.progress);
    }

    Logger.info('TUTORIAL_CONTEXT', `🔄 Tutorial reset: ${tutorialId ?? 'all'}`);
  }, []);
  // 🔥 의존성 배열: []

  /**
   * Context 값
   */
  const contextValue: TutorialContextValue = {
    ...state,
    startTutorial,
    nextStep,
    previousStep,
    goToStep,
    completeTutorial,
    skipTutorial,
    closeTutorial,
    resetTutorial,
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
}
