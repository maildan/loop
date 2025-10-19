/**
 * 🔥 getAnalyticsTutorial - 분석 대시보드 튜토리얼
 * 
 * 흐름:
 * Step 1: 분석 소개 (3개의 분석 창 설명)
 * Step 2: 전역 통계 탭 (전체 작성량, 연속 작성 일수, 골든타임)
 * Step 3: 프로젝트 분석 탭 (총 프로젝트 개수 및 개요)
 * Step 4: 종합 비교 탭 (성과 랭킹 및 진행속도 분석)
 */

import type { Tutorial } from '../types';
import { Logger } from '../../../../shared/logger';

/**
 * 분석 대시보드 튜토리얼 정의
 */
export const getAnalyticsTutorial = (): Tutorial => ({
  id: 'analytics-intro',
  name: '분석 대시보드 가이드',
  description: '당신의 작성 성과를 분석하고 개선하는 방법을 배웁니다',
  
  // 🔥 분석 페이지에서만 표시
  requiredPath: '/analytics',

  steps: [
    // ============================================================
    // Step 1: 분석 대시보드 소개
    // ============================================================
    {
      stepId: 'analytics-welcome',
      element: '[data-tour="analytics-tabs-container"]',
      popover: {
        title: '📊 분석 대시보드에 오신 것을 환영합니다!',
        description:
          '분석 대시보드에는 3개의 강력한 분석 창이 있습니다!\n\n' +
          '✨ 분석 종류:\n' +
          '🌍 전역 통계 - 전체 글쓰기 패턴과 골든타임\n' +
          '📖 프로젝트 분석 - 개별 프로젝트 세부 분석\n' +
          '🏆 종합 비교 - 프로젝트 성과 랭킹과 비교\n\n' +
          '각 탭을 클릭하여 자세히 알아봅시다!',
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
    // Step 2: 전역 통계 탭
    // ============================================================
    {
      stepId: 'analytics-global-tab',
      element: '[data-tour="analytics-tab-global"]',
      popover: {
        title: '🌍 전역 통계',
        description:
          '당신의 전체 글쓰기 패턴을 분석합니다!\n\n' +
          '📊 제공되는 정보:\n' +
          '✓ 오늘 작성량 / 목표\n' +
          '✓ 평균 WPM (분당 단어 수)\n' +
          '✓ 몰입도 점수\n' +
          '✓ 연속 작성 일수\n' +
          '✓ 골든타임 (가장 생산성 높은 시간대)\n\n' +
          '💡 이 정보를 활용해 최적의 작성 루틴을 만들 수 있어요!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: true,
    },

    // ============================================================
    // Step 3: 프로젝트 분석 탭
    // ============================================================
    {
      stepId: 'analytics-project-tab',
      element: '[data-tour="analytics-tab-project"]',
      popover: {
        title: '📖 프로젝트 분석',
        description:
          '각 프로젝트의 개별 성과를 추적합니다!\n\n' +
          '📈 볼 수 있는 정보:\n' +
          '✓ 총 프로젝트 개수\n' +
          '✓ 진행 중인 프로젝트\n' +
          '✓ 완료된 프로젝트\n' +
          '✓ 프로젝트별 상세 분석\n' +
          '✓ 장르별 성과 비교\n\n' +
          '🎯 각 프로젝트를 클릭하면 더 자세한 분석을 볼 수 있습니다!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: true,
    },

    // ============================================================
    // Step 4: 종합 비교 탭
    // ============================================================
    {
      stepId: 'analytics-compare-tab',
      element: '[data-tour="analytics-tab-compare"]',
      popover: {
        title: '🏆 종합 비교',
        description:
          '프로젝트 성과 랭킹과 성장 추이를 비교합니다!\n\n' +
          '🏅 특징:\n' +
          '✓ 프로젝트 성과 랭킹\n' +
          '✓ 진행 속도 분석\n' +
          '✓ 장르별 성과 비교\n' +
          '✓ 작가 벤치마크 (추후 예정)\n\n' +
          '💡 다른 사용자와의 비교를 통해 더 나은 목표를 세울 수 있어요!',
        side: 'bottom',
        align: 'center',
        showButtons: ['previous', 'next'],
        prevBtnText: '← 이전',
        nextBtnText: '다음 →',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: true,
    },

    // ============================================================
    // Step 5: 분석 시작하기
    // ============================================================
    {
      stepId: 'analytics-complete',
      element: '[data-tour="analytics-tabs-container"]',
      popover: {
        title: '✨ 분석을 시작해보세요!',
        description:
          '이제 당신의 작성 성과를 분석할 준비가 되었습니다!\n\n' +
          '🚀 다음 단계:\n' +
          '1. 각 탭을 클릭해서 자세히 살펴보기\n' +
          '2. 인사이트를 바탕으로 목표 설정하기\n' +
          '3. 최적의 작성 시간대 찾기\n' +
          '4. 연속 작성 일수 늘리기\n\n' +
          '💪 꾸준한 분석이 성장의 열쇠입니다!',
        side: 'bottom',
        align: 'center',
        showButtons: ['close', 'next'],
        nextBtnText: '완료',
        doneBtnText: '건너뛰기',
        showProgress: true,
        progressText: '{{current}} / {{total}}',
      },
      disableActiveInteraction: false,
    },
  ],

  // 🔥 튜토리얼 체인: 다음 튜토리얼
  meta: {
    nextTutorialId: undefined, // Analytics는 마지막 튜토리얼
    nextStepId: undefined,
  },

  // 🔥 콜백 함수
  onStart: async () => {
    Logger.info('ANALYTICS_TUTORIAL', '🎬 Analytics tutorial started');
  },

  onComplete: async () => {
    Logger.info('ANALYTICS_TUTORIAL', '✅ Analytics tutorial completed');
  },

  onSkip: async () => {
    Logger.info('ANALYTICS_TUTORIAL', '⏭️ Analytics tutorial skipped');
  },
});

export default getAnalyticsTutorial;
