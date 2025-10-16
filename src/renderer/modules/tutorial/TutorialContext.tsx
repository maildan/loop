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
}

export function TutorialProvider({ children }: TutorialProviderProps): React.ReactElement {
  const [state, setState] = useState<TutorialState>(() => ({
    ...initialState,
    ...loadStateFromStorage(),
  }));

  /**
   * 튜토리얼 시작
   */
  const startTutorial = useCallback(async (tutorialId: string): Promise<void> => {
    const tutorial = getTutorial(tutorialId);
    if (!tutorial) {
      Logger.error('TUTORIAL_CONTEXT', `❌ Tutorial not found: ${tutorialId}`);
      return;
    }

    try {
      Logger.info('TUTORIAL_CONTEXT', `🚀 Starting tutorial: ${tutorialId}`);
      
      // 저장된 진행도 복구 (범위 검증)
      const savedProgress = state.tutorialProgress[tutorialId] ?? 0;
      const validStepIndex = Math.min(Math.max(0, savedProgress), tutorial.steps.length - 1);

      setState(prev => ({
        ...prev,
        currentTutorialId: tutorialId,
        currentStepIndex: validStepIndex,
        isActive: true,
      }));

      // 튜토리얼 시작 콜백
      if (tutorial.onStart) {
        await tutorial.onStart();
      }

      Logger.info('TUTORIAL_CONTEXT', `✅ Tutorial started at step ${validStepIndex}`);
    } catch (error) {
      Logger.error('TUTORIAL_CONTEXT', `❌ Failed to start tutorial: ${tutorialId}`, error);
    }
  }, [state.tutorialProgress]);

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
    setState(prev => ({
      ...prev,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
    }));
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
   */
  const completeTutorial = useCallback(async (): Promise<void> => {
    const { currentTutorialId, completedTutorials, tutorialProgress } = state;

    if (!currentTutorialId) return;

    try {
      const tutorial = getTutorial(currentTutorialId);
      if (!tutorial) return;

      // 완료 목록에 추가
      const newCompleted = Array.from(new Set([...completedTutorials, currentTutorialId]));

      setState(prev => ({
        ...prev,
        currentTutorialId: null,
        currentStepIndex: 0,
        isActive: false,
        completedTutorials: newCompleted,
      }));

      // localStorage에 저장
      saveStateToStorage({
        completedTutorials: newCompleted,
        tutorialProgress: {
          ...tutorialProgress,
          [currentTutorialId]: 0, // 진행도 초기화
        },
      });

      // 튜토리얼 완료 콜백
      if (tutorial.onComplete) {
        await tutorial.onComplete();
      }

      Logger.info('TUTORIAL_CONTEXT', `✅ Tutorial completed: ${currentTutorialId}`);
    } catch (error) {
      Logger.error('TUTORIAL_CONTEXT', '❌ Failed to complete tutorial', error);
    }
  }, [state]);

  /**
   * 튜토리얼 스킵
   */
  const skipTutorial = useCallback(async (): Promise<void> => {
    const { currentTutorialId } = state;

    if (!currentTutorialId) return;

    try {
      const tutorial = getTutorial(currentTutorialId);
      if (!tutorial) return;

      setState(prev => ({
        ...prev,
        currentTutorialId: null,
        currentStepIndex: 0,
        isActive: false,
      }));

      // 튜토리얼 스킵 콜백
      if (tutorial.onSkip) {
        await tutorial.onSkip();
      }

      Logger.info('TUTORIAL_CONTEXT', `⏭️ Tutorial skipped: ${currentTutorialId}`);
    } catch (error) {
      Logger.error('TUTORIAL_CONTEXT', '❌ Failed to skip tutorial', error);
    }
  }, [state]);

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
   */
  const resetTutorial = useCallback(async (tutorialId?: string): Promise<void> => {
    if (tutorialId) {
      // 특정 튜토리얼만 재설정
      setState(prev => ({
        ...prev,
        tutorialProgress: {
          ...prev.tutorialProgress,
          [tutorialId]: 0,
        },
        completedTutorials: prev.completedTutorials.filter(id => id !== tutorialId),
      }));

      saveStateToStorage({
        tutorialProgress: {
          ...state.tutorialProgress,
          [tutorialId]: 0,
        },
        completedTutorials: state.completedTutorials.filter(id => id !== tutorialId),
      });
    } else {
      // 모든 튜토리얼 재설정
      setState(initialState);
      localStorage.removeItem(STORAGE_KEYS.completedTutorials);
      localStorage.removeItem(STORAGE_KEYS.progress);
    }

    Logger.info('TUTORIAL_CONTEXT', `🔄 Tutorial reset: ${tutorialId ?? 'all'}`);
  }, [state.tutorialProgress, state.completedTutorials]);

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
