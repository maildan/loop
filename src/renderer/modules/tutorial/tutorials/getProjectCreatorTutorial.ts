/**
 * 🔥 getProjectCreatorTutorial - 프로젝트 생성 상세 가이드
 * 
 * 특수 기능:
 * - 자동 진행 (이전/다음 버튼 없음)
 * - onPopoverRender에서 setTimeout으로 3초마다 자동으로 다음 단계로
 * - 이 섹션에서만 이 방식 사용
 * 
 * Step 1: 프로젝트 만드는 방법 (3가지)
 * Step 2: 프로젝트 상세 정보 설정
 * Step 3: 돌아가기 (X 버튼)
 */

import type { Tutorial } from '../types';
import { Logger } from '../../../../shared/logger';

/**
 * 프로젝트 생성 튜토리얼 정의
 * 
 * 특징:
 * - 자동 진행 모드 (getAutoProgressTutorial 래퍼 사용)
 * - 이전/다음 버튼 없음
 * - close 버튼만 제공
 */
export const getProjectCreatorTutorial = (): Tutorial => ({
  id: 'project-creator',
  name: '프로젝트 생성 가이드',
  description: '프로젝트를 만드는 방법과 상세 정보를 설정합니다',

  steps: [
    // ============================================================
    // Step 1: 프로젝트 생성 방법
    // ============================================================
    {
      stepId: 'create-method-intro',
      element: '[data-tour="project-creator-container"]',
      popover: {
        title: '📝 프로젝트를 만드는 방법',
        description:
          '프로젝트를 만드는 방법은 3가지입니다!\n\n' +
          '🎯 Loop Editor: Loop 내에서 바로 작성\n' +
          '📄 Google Docs: Google Docs에서 가져오기\n' +
          '💾 파일 불러오기: 컴퓨터의 파일 가져오기\n\n' +
          '(자동으로 다음 단계로 진행됩니다...)',
        side: 'bottom',
        align: 'center',
        showButtons: ['close'],
        doneBtnText: '건너뛰기',
        showProgress: false, // 자동 진행이므로 진행률 표시 안함
      },
      disableActiveInteraction: true,
    },

    // ============================================================
    // Step 2: 프로젝트 상세 정보
    // ============================================================
    {
      stepId: 'create-details',
      element: '[data-tour="project-details-section"]',
      popover: {
        title: '🎨 프로젝트 상세 정보',
        description:
          '프로젝트 정보를 구성할 수 있습니다!\n\n' +
          '📌 기본: 제목 / 설명\n' +
          '🏷️ 장르: 웹소설 장르 선택\n' +
          '🎯 세부 목표: 연재 주기, 목표 글자 수 등\n\n' +
          '모든 정보는 언제든지 수정할 수 있습니다!\n' +
          '(자동으로 다음 단계로 진행됩니다...)',
        side: 'bottom',
        align: 'center',
        showButtons: ['close'],
        doneBtnText: '건너뛰기',
        showProgress: false,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 3: 돌아가기
    // ============================================================
    {
      stepId: 'create-finish',
      element: '[data-tour="project-creator-close-btn"]',
      popover: {
        title: '✨ 완료!',
        description:
          '프로젝트 생성 방법을 모두 알아봤습니다!\n\n' +
          '계속 가볼까요? 📚\n\n' +
          '위의 X 버튼을 누르면 대시보드의 다른 기능들을\n' +
          '소개하는 가이드로 돌아갑니다.\n\n' +
          '프로젝트를 지금 생성하려면 "생성" 버튼을 클릭하세요! 🚀',
        side: 'top',
        align: 'center',
        showButtons: ['close'],
        doneBtnText: '돌아가기 →',
        showProgress: false,
      },
      disableActiveInteraction: false,
    },
  ] as const,

  // 튜토리얼 시작 콜백
  onStart: async () => {
    Logger.info('getProjectCreatorTutorial', '🚀 Project Creator tutorial started');
  },

  // 튜토리얼 완료 콜백
  onComplete: async () => {
    Logger.info('getProjectCreatorTutorial', '✅ Project Creator tutorial completed');
  },

  // 튜토리얼 스킵 콜백
  onSkip: async () => {
    Logger.info('getProjectCreatorTutorial', '⏭️ Project Creator tutorial skipped');
  },

  /**
   * 🔥 자동 진행 플래그
   * useGuidedTour에서 이 플래그를 감지하여
   * popoverRender 시 setTimeout으로 자동 진행
   */
  meta: {
    autoProgress: true,
    autoProgressDelay: 3000, // 3초마다 자동으로 다음 단계
    returnTutorialId: 'dashboard-intro', // 이 튜토리얼 완료 후 대시보드로 복귀
    returnStepId: 'action-import', // 복귀할 스텝
  },
});
