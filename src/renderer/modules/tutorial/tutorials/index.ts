/**
 * 🔥 튜토리얼 레지스트리 및 Export
 */

import { getDashboardTutorial } from './getDashboardTutorial';
import { getProjectCreatorTutorial } from './getProjectCreatorTutorial';
import { getProjectsTutorial } from './getProjectsTutorial';
import { getAnalyticsTutorial } from './getAnalyticsTutorial';
import { registerTutorial } from '../TutorialContext';
import { Logger } from '../../../../shared/logger';

/**
 * 모든 튜토리얼 등록
 */
export function initializeTutorials(): void {
  // 🔥 강력한 디버깅: console.warn으로 반드시 보이게 함
  console.warn('🚀🚀🚀 [TUTORIALS_INDEX] initializeTutorials() CALLED 🚀🚀🚀');
  Logger.info('TUTORIALS_INDEX', '🚀 initializeTutorials() called - registering all tutorials');
  
  const dash = getDashboardTutorial();
  console.warn(`📊 [TUTORIALS_INDEX] getDashboardTutorial returned:`, dash?.id);
  registerTutorial(dash);
  Logger.info('TUTORIALS_INDEX', '✅ getDashboardTutorial registered');
  
  const creator = getProjectCreatorTutorial();
  console.warn(`📝 [TUTORIALS_INDEX] getProjectCreatorTutorial returned:`, creator?.id);
  registerTutorial(creator);
  Logger.info('TUTORIALS_INDEX', '✅ getProjectCreatorTutorial registered');
  
  const projects = getProjectsTutorial();
  console.warn(`🗂️ [TUTORIALS_INDEX] getProjectsTutorial returned:`, projects?.id);
  registerTutorial(projects);
  Logger.info('TUTORIALS_INDEX', '✅ getProjectsTutorial registered');
  
  const analytics = getAnalyticsTutorial();
  console.warn(`📈 [TUTORIALS_INDEX] getAnalyticsTutorial returned:`, analytics?.id);
  registerTutorial(analytics);
  Logger.info('TUTORIALS_INDEX', '✅ getAnalyticsTutorial registered');
  
  console.warn('✅✅✅ [TUTORIALS_INDEX] initializeTutorials() FINISHED ✅✅✅');
}

// 자동으로 튜토리얼 레지스트리 초기화
if (typeof window !== 'undefined') {
  // 🔥 강력한 디버깅: console.log 직접 사용 (Logger 체인 문제 회피)
  console.warn('🌍 [TUTORIALS_INDEX TOP-LEVEL] Client-side detected at import time');
  Logger.info('TUTORIALS_INDEX', '🌍 Client-side detected, calling initializeTutorials()');
  initializeTutorials();
  console.warn('🌍 [TUTORIALS_INDEX TOP-LEVEL] initializeTutorials() finished');
}

export { getDashboardTutorial };
export { getProjectCreatorTutorial };
export { getProjectsTutorial };
export { getAnalyticsTutorial };
