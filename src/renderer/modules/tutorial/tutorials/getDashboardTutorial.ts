/**
 * 🔥 getDashboardTutorial - 대시보드 소개 튜토리얼
 * Step 1: 환영 메시지
 * Step 2: Loop 차이점 (나중에 슬라이드로 확장)
 * Step 3-1: KPI 섹션
 * Step 3-2~3-5: QuickStartCard 4개 소개
 * 
 * Phase 2에서 추가:
 * Step 4: 메인 그리드 - 활성 프로젝트
 * Step 5: 메인 그리드 - 최근 파일
 * Step 6: 완료 + 프로젝트로
 */

import type { Tutorial } from '../types';
import { Logger } from '../../../../shared/logger';

/**
 * 대시보드 튜토리얼 정의
 */
export const getDashboardTutorial = (): Tutorial => ({
  id: 'dashboard-intro',
  name: '대시보드 시작 가이드',
  description: '대시보드의 주요 기능을 소개합니다',

  steps: [
    // ============================================================
    // Step 1: 환영 메시지
    // ============================================================
    {
      stepId: 'dashboard-welcome',
      element: '[data-tour="dashboard-container"]',
      popover: {
        title: '👋 Loop 튜토리얼에 오신 것을 환영합니다!',
        description:
          '작가들을 위한 웹소설 창작 분석 플랫폼입니다.\n\n' +
          '이 짧은 투어에서 Loop의 주요 기능들을 알아봅시다.\n' +
          '(약 2-3분)',
        side: 'top',
        align: 'center',
        showButtons: ['next', 'close'],
        nextBtnText: '계속하기 →',
        doneBtnText: '시작하기',
        showProgress: true,
      },
      disableActiveInteraction: true,
    },

    // ============================================================
    // Step 2: Loop 차이점 (간단한 버전 - 나중에 슬라이드로)
    // ============================================================
    {
      stepId: 'dashboard-difference',
      element: '[data-tour="dashboard-container"]',
      popover: {
        title: '🚀 Loop만의 특별한 기능',
        description:
          '• 웹소설 연재 전용 플랫폼\n' +
          '• 시놉시스 뷰로 작품의 일관성 증가\n' +
          '• 내장된 AI로 분석과 대화를 한번에\n' +
          '• Google Docs 연동으로 빠르고 유연한 작업 환경\n\n' +
          '이제 대시보드를 둘러봅시다!',
        side: 'top',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: true,
    },

    // ============================================================
    // Step 3-1: KPI 섹션
    // ============================================================
    {
      stepId: 'dashboard-kpi',
      element: '[data-tour="kpi-section"]',
      popover: {
        title: '📊 오늘의 창작 통계',
        description:
          '여기서는 당신의 창작 활동을 한눈에 볼 수 있습니다.\n\n' +
          '• 오늘 작성한 글자 수\n' +
          '• 이번 주 작성 활동량\n' +
          '• 평균 입력 속도 (WPM)\n' +
          '• 활성 진행 중인 프로젝트 개수\n\n' +
          '이 통계는 실시간으로 업데이트됩니다!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 3-2: QuickStart - 소개
    // ============================================================
    {
      stepId: 'quickstart-intro',
      element: '[data-tour="quick-start-card"]',
      popover: {
        title: '⚡ 빠른 시작 메뉴',
        description:
          '여기서 새로운 프로젝트를 시작하거나\n' +
          '기존 파일을 Loop에 가져올 수 있습니다.\n\n' +
          '각 옵션을 하나씩 살펴봅시다!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 3-3: QuickStart - 새 프로젝트
    // ============================================================
    {
      stepId: 'action-create',
      element: '[data-tour="action-create"]',
      popover: {
        title: '📝 새 프로젝트 만들기',
        description:
          '새로운 창작물 프로젝트를 시작하세요!\n\n' +
          '웹소설이나 장편 창작물을 등록하고\n' +
          'Loop에서 실시간으로 활동을 분석받을 수 있습니다.\n\n' +
          '프로젝트마다 독립적인 통계를 관리합니다.\n' +
          '한번 직접 들어가서 어떻게 만드는지 볼까요?',
        side: 'top',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '직접 해보기 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 3-4: QuickStart - 프로젝트 가져오기
    // ============================================================
    {
      stepId: 'action-import',
      element: '[data-tour="action-import"]',
      popover: {
        title: '📂 기존 파일 가져오기',
        description:
          '컴퓨터에 있는 기존 창작물을 Loop으로 가져올 수 있습니다.\n\n' +
          '지원 형식:\n' +
          '• .txt 파일\n' +
          '• Word 문서 (.docx)\n' +
          '• 다양한 형식의 문서\n\n' +
          '이전 창작물도 Loop에서 분석해봅시다!',
        side: 'top',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 3-5: QuickStart - 샘플 보기
    // ============================================================
    {
      stepId: 'action-sample',
      element: '[data-tour="action-sample"]',
      popover: {
        title: '🎬 샘플 프로젝트 보기',
        description:
          'Loop의 모든 기능을 체험할 수 있는\n' +
          '샘플 프로젝트를 확인해봅시다.\n\n' +
          '실제 데이터로 어떤 분석이 가능한지\n' +
          '미리 알아볼 수 있습니다!',
        side: 'top',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 3-6: QuickStart - 사용법 보기
    // ============================================================
    {
      stepId: 'action-docs',
      element: '[data-tour="action-docs"]',
      popover: {
        title: '❓ 사용법 보기',
        description:
          '이 버튼을 다시 클릭하면\n' +
          '언제든지 이 튜토리얼을 다시 볼 수 있습니다!\n\n' +
          '궁금한 점이 있을 때나\n' +
          '새로운 사용자를 소개할 때 유용합니다.\n\n' +
          '이제 Loop을 시작해봅시다! 🎉',
        side: 'top',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 4: 활성 프로젝트 섹션
    // ============================================================
    {
      stepId: 'active-projects',
      element: '[data-tour="active-projects-section"]',
      popover: {
        title: '� 활성 프로젝트',
        description:
          '현재 진행 중인 프로젝트들이 여기 표시됩니다.\n\n' +
          '프로젝트를 클릭하면 에디터로 이동합니다.\n\n' +
          '프로젝트가 많아지면 이 섹션에서 관리하세요!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 5: 최근 파일 섹션
    // ============================================================
    {
      stepId: 'recent-files',
      element: '[data-tour="recent-files-section"]',
      popover: {
        title: '⏱️ 최근 파일',
        description:
          '가장 최근에 편집한 프로젝트들이 여기 표시됩니다.\n\n' +
          '빠르게 이전 작업물로 복귀할 수 있습니다.\n' +
          '이 목록은 자동으로 업데이트됩니다.\n\n' +
          '자주 사용하는 프로젝트는 여기서 한번에 접근하세요!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next', 'close'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
      },
      disableActiveInteraction: false,
    },

    // ============================================================
    // Step 6: 완료 (메인 그리드 설명 추가)
    // ============================================================
    {
      stepId: 'dashboard-complete',
      element: '[data-tour="dashboard-container"]',
      popover: {
        title: '🎉 튜토리얼 완료!',
        description:
          'Loop의 핵심 기능을 모두 배웠습니다!\n\n' +
          '✅ 창작 통계 대시보드로 활동 추적\n' +
          '✅ 새 프로젝트 빠르게 생성\n' +
          '✅ 기존 파일 Loop에 가져오기\n' +
          '✅ 활성 프로젝트 및 최근 파일 관리\n\n' +
          '이제 당신의 창작 여정을 시작해봅시다!\n' +
          '행운의 창작을 기원합니다. ✨',
        side: 'top',
        align: 'center',
        showButtons: ['previous', 'close'],
        prevBtnText: '← 이전',
        doneBtnText: '완료',
        showProgress: true,
      },
      disableActiveInteraction: true,
    },
  ] as const,

  // 튜토리얼 시작 콜백
  onStart: async () => {
    Logger.info('getDashboardTutorial', '🚀 Dashboard tutorial started');
  },

  // 튜토리얼 완료 콜백
  onComplete: async () => {
    Logger.info('getDashboardTutorial', '✅ Dashboard tutorial completed');
    // 나중에: confetti 또는 완료 메시지 표시
  },

  // 튜토리얼 스킵 콜백
  onSkip: async () => {
    Logger.info('getDashboardTutorial', '⏭️ Dashboard tutorial skipped');
  },

  // 메타 정보: Step 3-3 (action-create)에서 ProjectCreator 튜토리얼로 전환
  meta: {
    nextTutorialId: 'project-creator',
    nextStepId: 'create-method-intro',
    returnTutorialId: 'dashboard-intro',
    returnStepId: 'action-import',
  },
});
