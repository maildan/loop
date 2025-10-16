/**
 * 🔥 useTutorial Hook - 튜토리얼 제어 API
 * TutorialContext에 대한 편의 인터페이스
 */

import { useContext } from 'react';
import { TutorialContext } from './TutorialContext';
import type { TutorialContextValue } from './types';
import { Logger } from '../../../shared/logger';

/**
 * 튜토리얼 시스템 접근 Hook
 * @throws 에러: TutorialProvider 내부에서만 사용 가능
 * @returns 튜토리얼 제어 API
 * 
 * @example
 * ```tsx
 * const { startTutorial, isActive, currentStepIndex } = useTutorial();
 * 
 * // 튜토리얼 시작
 * const handleStartTutorial = async () => {
 *   await startTutorial('dashboard-intro');
 * };
 * 
 * // 진행 상황 표시
 * if (isActive) {
 *   console.log(`Step ${currentStepIndex + 1}`);
 * }
 * ```
 */
export function useTutorial(): TutorialContextValue {
  const context = useContext(TutorialContext);

  if (context === undefined) {
    Logger.error(
      'useTutorial',
      '❌ useTutorial must be used within TutorialProvider'
    );
    throw new Error('useTutorial must be used within TutorialProvider');
  }

  return context;
}

/**
 * 튜토리얼 상태 조회 Hook (읽기 전용)
 * @returns 현재 튜토리얼 상태
 */
export function useTutorialState() {
  const context = useContext(TutorialContext);

  if (context === undefined) {
    Logger.error(
      'useTutorialState',
      '❌ useTutorialState must be used within TutorialProvider'
    );
    throw new Error('useTutorialState must be used within TutorialProvider');
  }

  return {
    currentTutorialId: context.currentTutorialId,
    currentStepIndex: context.currentStepIndex,
    isActive: context.isActive,
    completedTutorials: context.completedTutorials,
    tutorialProgress: context.tutorialProgress,
  };
}

/**
 * 특정 튜토리얼 완료 여부 조회
 * @param tutorialId 튜토리얼 ID
 * @returns 완료 여부
 */
export function useTutorialCompleted(tutorialId: string): boolean {
  const { completedTutorials } = useTutorialState();
  return completedTutorials.includes(tutorialId);
}

/**
 * 특정 튜토리얼의 진행도 조회
 * @param tutorialId 튜토리얼 ID
 * @returns 저장된 스텝 인덱스
 */
export function useTutorialProgress(tutorialId: string): number {
  const { tutorialProgress } = useTutorialState();
  return tutorialProgress[tutorialId] ?? 0;
}
