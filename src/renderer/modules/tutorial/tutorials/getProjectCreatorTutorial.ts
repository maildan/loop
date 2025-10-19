/**
 * 🔥 getProjectCreatorTutorial - 프로젝트 생성 상세 가이드 (9-STEP VERSION)
 * 
 * 구조:
 * Step 1-3: 작성 플랫폼 선택 (개별 spotlight)
 * Step 4-7: 프로젝트 상세 정보 (scroll with animation)
 * Step 8: 완료 (돌아가기)
 * 
 * 특수 기능:
 * - 자동 진행 (4.5초 간격, smooth scroll)
 * - close + next 버튼 제공 (사용자도 수동으로 진행 가능)
 * - Smooth scroll 애니메이션 (detail section으로)
 */

import type { Tutorial } from '../types';
import { Logger } from '../../../../shared/logger';

/**
 * 프로젝트 생성 튜토리얼 (9-Step 버전)
 * 
 * 특징:
 * - 작성 플랫폼을 하나씩 spotlight
 * - 상세 정보 섹션을 scroll로 보여주기
 * - 4.5초 자동 진행 + smooth scroll animation
 * - X 버튼 클릭 시 completeTutorial() → Projects로 이동
 */
export const getProjectCreatorTutorial = (): Tutorial => ({
  id: 'project-creator',
  name: '프로젝트 생성 가이드',
  description: '프로젝트를 만드는 방법과 상세 정보를 설정합니다',
  
  // 🔥 ProjectCreator는 modal이므로 requiredPath 없음!
  // Projects 페이지에서 modal로 열리므로 navigation 불필요
  // requiredPath: undefined,

  steps: [
    // ============================================================
    // Step 1: 프로젝트 생성 방법 소개
    // ============================================================
    {
      stepId: 'create-method-intro',
      element: '[data-tour="project-creator-container"]',
      popover: {
        title: '📝 프로젝트를 만드는 방법',
        description:
          '프로젝트를 만드는 방법은 3가지입니다!\n\n' +
          '각 방법에 대해 자세히 알아보겠습니다.\n' +
          '(다음 버튼으로 진행해주세요)',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: true,
    },

    // ============================================================
    // Step 2: Loop Editor 플랫폼
    // ============================================================
    {
      stepId: 'create-platform-loop',
      element: '[data-tour="platform-option-loop"]',
      popover: {
        title: '🎯 Loop Editor',
        description:
          'Loop 에디터에서 바로 작성할 수 있습니다!\n\n' +
          '✨ 특징:\n' +
          '• 타이핑 분석 및 통계\n' +
          '• 실시간 글자 수 계산\n' +
          '• 창작 흐름 최적화\n\n' +
          '가장 추천하는 방법입니다! �',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: true, // 🔥 클릭 방지 (5.5초 자동 진행 중 의도치 않은 선택 방지)
    },

    // ============================================================
    // Step 3: Google Docs 플랫폼
    // ============================================================
    {
      stepId: 'create-platform-google-docs',
      element: '[data-tour="platform-option-google-docs"]',
      popover: {
        title: '�📄 Google Docs',
        description:
          'Google Docs의 문서를 Loop로 가져올 수 있습니다!\n\n' +
          '✨ 특징:\n' +
          '• 실시간 협업 가능\n' +
          '• 클라우드 동기화\n' +
          '• 여러 기기에서 작성\n\n' +
          '협업 작업에 최적입니다! 🤝',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: true, // 🔥 클릭 방지 (Google Docs OAuth 자동 시작 방지)
    },

    // ============================================================
    // Step 4: 파일 불러오기 플랫폼
    // ============================================================
    {
      stepId: 'create-platform-import',
      element: '[data-tour="platform-option-import"]',
      popover: {
        title: '💾 파일 불러오기',
        description:
          '컴퓨터의 파일에서 프로젝트를 생성할 수 있습니다!\n\n' +
          '✨ 지원 형식:\n' +
          '• Word (.docx)\n' +
          '• 텍스트 (.txt)\n' +
          '• PDF (.pdf)\n\n' +
          '기존 작품을 Loop로 옮길 때 유용합니다! 📂',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 5: 프로젝트 상세 정보 소개
    // ============================================================
    {
      stepId: 'create-details-intro',
      element: '[data-tour="project-details-section"]',
      popover: {
        title: '🎨 프로젝트 상세 정보',
        description:
          '이제 프로젝트의 상세 정보를 설정해봅시다!\n\n' +
          '제목, 장르, 목표 등을 입력할 수 있습니다.\n' +
          '(다음 버튼으로 진행해주세요)',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 6: 프로젝트 제목 입력
    // ============================================================
    {
      stepId: 'create-details-title',
      element: '[data-tour="project-input-title"]',
      popover: {
        title: '📌 프로젝트 제목',
        description:
          '프로젝트의 제목을 입력하세요!\n\n' +
          '• 최대 100자\n' +
          '• 나중에 변경 가능\n' +
          '• 한글, 영문, 숫자 모두 가능',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 7: 장르 선택
    // ============================================================
    {
      stepId: 'create-details-genre',
      element: '[data-tour="project-select-genre"]',
      popover: {
        title: '🏷️ 장르 선택',
        description:
          '창작물의 장르를 선택하세요!\n\n' +
          '• 소설, 에세이, 블로그\n' +
          '• 시, 대본, 기술 문서\n' +
          '• 기타 장르 선택 가능',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 8: 목표 설정
    // ============================================================
    {
      stepId: 'create-details-goal',
      element: '[data-tour="project-input-target-words"]',
      popover: {
        title: '🎯 목표 설정',
        description:
          '글자 수 목표를 설정할 수 있습니다!\n\n' +
          '• 목표 글자 수 (예: 100,000자)\n' +
          '• 완료 목표 날짜\n' +
          '• 진행도 추적\n\n' +
          '모든 항목은 선택사항입니다! 📊',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / 9',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 9: 완료 및 돌아가기
    // ============================================================
    {
      stepId: 'create-finish',
      element: '[data-tour="project-creator-close-btn"]',
      popover: {
        title: '✨ 완료!',
        description:
          '프로젝트 생성 방법을 모두 알아봤습니다! 🎉\n\n' +
          '이제 프로젝트를 만들 준비가 됐습니다!\n\n' +
          '💡 팁: X 버튼을 누르면 프로젝트 목록으로 돌아갑니다.\n' +
          '또는 "생성" 버튼을 클릭해서 바로 작성을 시작하세요! 🚀',
        side: 'top',
        align: 'center',
        showButtons: ['close'],
        doneBtnText: '완료',
        showProgress: true,
        progressText: '{{current}} / 9',
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
   * 🔥 자동 진행 플래그 (수동 클릭 유지)
   * ProjectCreator 완료 후 Dashboard 튜토리얼로 복귀하도록 return 설정
   */
  meta: {
    autoProgress: false, // 🔥 수동 모드: 사용자가 버튼 클릭해서 진행
    returnTutorialId: 'dashboard-intro', // � Dashboard 튜토리얼로 복귀
    returnStepId: 'action-import', // 🔙 QuickStart의 다음 스텝부터 이어서 진행
  },
});
