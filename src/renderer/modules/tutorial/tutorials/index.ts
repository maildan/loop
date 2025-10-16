/**
 * 🔥 튜토리얼 레지스트리 및 Export
 */

import { getDashboardTutorial } from './getDashboardTutorial';
import { getProjectCreatorTutorial } from './getProjectCreatorTutorial';
import { registerTutorial } from '../TutorialContext';

/**
 * 모든 튜토리얼 등록
 */
export function initializeTutorials(): void {
  registerTutorial(getDashboardTutorial());
  registerTutorial(getProjectCreatorTutorial());
  // TODO: 나중에 추가할 튜토리얼
  // registerTutorial(getAnalysisTutorial());
}

// 자동으로 튜토리얼 레지스트리 초기화
if (typeof window !== 'undefined') {
  initializeTutorials();
}

export { getDashboardTutorial };
