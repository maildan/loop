/**
 * 🔥 getProjectsTutorial - 프로젝트 관리 및 분석 튜토리얼
 * 
 * 흐름:
 * Step 1: 프로젝트 소개
 * Step 2: 프로젝트 목록 (프로젝트 있을 시)
 * Step 3: 프로젝트 상태 설명 (진행중/완료)
 * Step 4: 추가 옵션 (파일불러오기, Google Docs)
 * Step 5: 분석으로의 전환
 * 
 * 조건부 표시:
 * - 프로젝트 없을 시: Step 4-1 (프로젝트 생성 버튼)
 * - 프로젝트 있을 시: Step 2-3 (프로젝트 목록)
 */

import type { Tutorial } from '../types';
import { Logger } from '../../../../shared/logger';

/**
 * 프로젝트 튜토리얼 정의
 */
export const getProjectsTutorial = (): Tutorial => ({
  id: 'projects-intro',
  name: '프로젝트 관리 튜토리얼',
  description: '프로젝트를 관리하고 분석하는 방법을 배웁니다',
  
  // 🔥 프로젝트 페이지에서만 표시
  requiredPath: '/projects',

  steps: [
    // ============================================================
    // Step 1: 프로젝트 소개 (Spotlight + Popover)
    // ============================================================
    {
      stepId: 'projects-welcome',
      element: '[data-tour="projects-container"]',
      popover: {
        title: '🎯 프로젝트 관리',
        description:
          '이제 프로젝트에 대해 알아봅시다!\n\n' +
          '프로젝트는 당신의 모든 창작물을 관리하는 공간입니다.\n' +
          '프로젝트를 통해 체계적으로 작품을 관리할 수 있습니다.',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '다음 →',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 2: 프로젝트 목록 (프로젝트 있을 시) - Spotlight 강조
    // ============================================================
    {
      stepId: 'projects-grid',
      element: '[data-tour="projects-grid"]',
      popover: {
        title: '📚 프로젝트 목록',
        description:
          '여기에 모든 프로젝트가 표시됩니다!\n\n' +
          '🔍 각 카드에서 볼 수 있는 정보:\n' +
          '✓ 프로젝트 제목\n' +
          '✓ 장르 및 태그\n' +
          '✓ 진행도 바\n' +
          '✓ 마지막 편집 시간\n\n' +
          '💡 프로젝트를 클릭하면 에디터로 이동합니다!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 3: 프로젝트 상태 설명 - 다시 전체 페이지 Spotlight
    // ============================================================
    {
      stepId: 'projects-status',
      element: '[data-tour="projects-container"]',
      popover: {
        title: '✨ 프로젝트 상태와 필터',
        description:
          '프로젝트는 다양한 상태로 구분됩니다.\n\n' +
          '📌 상태 종류:\n' +
          '🔵 진행 중 - 현재 작업 중인 프로젝트\n' +
          '✅ 완료 - 완성된 프로젝트\n' +
          '📦 일시정지 - 나중에 볼 프로젝트\n\n' +
          '상단의 탭이나 필터로 상태별로 정렬할 수 있습니다!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 4: 추가 옵션 설명 - QuickStart Card Spotlight
    // ============================================================
    {
      stepId: 'projects-options',
      element: '[data-tour="quick-start-card"]',
      popover: {
        title: '⚙️ 새로운 프로젝트 추가하기',
        description:
          '프로젝트를 추가하는 방법은 여러 가지입니다!\n\n' +
          '🆕 빠른 시작 옵션:\n' +
          '📂 파일 불러오기 - .txt, .docx, .pdf 지원\n' +
          '📄 Google Docs - Google Docs 문서 연동\n' +
          '📝 새 프로젝트 - Loop 에디터에서 작성\n' +
          '당신의 작업 방식에 맞게 선택하세요! 🎯',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 5: 분석으로의 전환 - 최종 단계
    // ============================================================
    {
      stepId: 'projects-analytics',
      element: '[data-tour="projects-container"]',
      popover: {
        title: '🎉 프로젝트 관리 완료!',
        description:
          '프로젝트 관리 방법을 모두 배웠습니다! 🌟\n\n' +
          '📊 다음 단계:\n' +
          '프로젝트를 선택하면 다양한 분석 도구를 사용할 수 있습니다!\n\n' +
          '📈 분석 기능:\n' +
          '📊 실시간 통계 - 글자수, 타이핑 속도 추적\n' +
          '📉 창작 패턴 분석 - 패턴 인식 및 개선 제안\n' +
          '🤖 AI 피드백 - 창작물 분석 및 조언\n\n' +
          '이제 프로젝트를 선택해서 본격 창작을 시작해보세요! 🚀✨',
        side: 'top',
        align: 'center',
        showButtons: ['previous', 'close'],
        prevBtnText: '← 이전',
        doneBtnText: '완료',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: false,
    },
  ] as const,

  // 튜토리얼 시작 콜백
  onStart: async () => {
    Logger.info('getProjectsTutorial', '🚀 Projects tutorial started');
  },

  // 튜토리얼 완료 콜백
  onComplete: async () => {
    Logger.info('getProjectsTutorial', '✅ Projects tutorial completed');
  },

  // 튜토리얼 스킵 콜백
  onSkip: async () => {
    Logger.info('getProjectsTutorial', '⏭️ Projects tutorial skipped');
  },

  // 메타 정보: Projects 완료 후 Analytics 튜토리얼로 전환
  meta: {
    autoProgress: false, // 수동 진행만
    nextTutorialId: 'analytics-intro',
    nextStepId: 'analytics-welcome',
  },
});
