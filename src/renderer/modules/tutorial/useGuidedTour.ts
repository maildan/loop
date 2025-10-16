/**
 * 🔥 useGuidedTour Hook - Driver.js 래퍼
 * 튜토리얼 시스템과 Driver.js를 연결하는 고수준 Hook
 */

import { useEffect, useRef, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import type { Driver } from 'driver.js';
import { useTutorial, useTutorialState } from './useTutorial';
import { getTutorial } from './TutorialContext';
import { Logger } from '../../../shared/logger';
import { useTutorialRefreshController } from '../../hooks/useTutorialRefreshController';
import { waitForCSSVariables } from '../../utils/tutorial-refresh';

/**
 * 스타일 상수 (다크모드 지원)
 */
const DRIVER_STYLES = {
  popoverClass: 'driver-popover', // ✅ 공식 클래스명으로 변경
  stagePadding: 10,
  stageRadius: 8,
  allowKeyboardControl: true,
  overlayOpacity: 0.75,
} as const;

/**
 * Driver.js와 튜토리얼 시스템을 연결하는 Hook
 * 
 * @returns Driver 객체 (수동 제어용, 거의 사용 안함)
 * 
 * @example
 * ```tsx
 * function DashboardWithTutorial() {
 *   useGuidedTour();
 *   const { startTutorial } = useTutorial();
 *   
 *   return (
 *     <>
 *       <button onClick={() => startTutorial('dashboard-intro')}>
 *         사용법 보기
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export function useGuidedTour(): Driver | null {
  const { startTutorial, nextStep, previousStep, closeTutorial } = useTutorial();
  const { currentTutorialId, currentStepIndex, isActive } = useTutorialState();
  const driverRef = useRef<Driver | null>(null);
  const isInitializingRef = useRef(false);

  /**
   * Driver.js 초기화 및 실행
   */
  const initializeDriver = useCallback(async (): Promise<void> => {
    if (!currentTutorialId || isInitializingRef.current) {
      return;
    }

    try {
      isInitializingRef.current = true;
      
      // 🔥 개선: CSS 변수가 로드될 때까지 대기 (모든 테마 색상 준비)
      await waitForCSSVariables(2000);
      
      const tutorial = getTutorial(currentTutorialId);

      if (!tutorial) {
        Logger.warn('useGuidedTour', `⚠️ Tutorial not found: ${currentTutorialId}`);
        return;
      }

      Logger.info('useGuidedTour', `🎬 Initializing Driver.js for ${currentTutorialId}`);

      // 기존 인스턴스 정리
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch {
          // 이미 destroy된 경우 무시
        }
      }

      // Driver.js 설정
      driverRef.current = driver({
        ...DRIVER_STYLES,
        steps: tutorial.steps.map((step, index) => ({
          element: step.element,
          popover: {
            title: step.popover.title,
            description: step.popover.description,
            side: step.popover.side ?? 'bottom',
            align: step.popover.align ?? 'center',
            showButtons: step.popover.showButtons ?? ['next', 'previous', 'close'],
            nextBtnText: step.popover.nextBtnText ?? '다음',
            prevBtnText: step.popover.prevBtnText ?? '이전',
            doneBtnText: step.popover.doneBtnText ?? '완료',
            showProgress: step.popover.showProgress ?? true,
            progressText: step.popover.progressText ?? '{{current}} / {{total}}',
            popoverClass: `${DRIVER_STYLES.popoverClass} loop-step-${index}`,
          },
          disableActiveInteraction: step.disableActiveInteraction,
        })),

        // 네비게이션 핸들러
        onNextClick: async () => {
          Logger.debug('useGuidedTour', `→ Next button clicked (step ${currentStepIndex})`);
          await nextStep();
        },

        onPrevClick: async () => {
          Logger.debug('useGuidedTour', `← Previous button clicked (step ${currentStepIndex})`);
          await previousStep();
        },

        onCloseClick: async () => {
          Logger.info('useGuidedTour', '✖️ Tutorial closed');
          closeTutorial();
        },

        // 튜토리얼 완료 시
        onDestroyed: () => {
          Logger.info('useGuidedTour', `🏁 Tutorial driver destroyed`);
          driverRef.current = null;
        },

        // 하이라이트 시작
        onHighlighted: (element, step) => {
          Logger.debug(
            'useGuidedTour',
            `🎯 Highlighted step ${currentStepIndex}`,
            { element: element?.id || element?.className }
          );
          // Driver.js가 자동으로 positioning을 처리하므로 수동 개입 제거 ✅
        },

        // 하이라이트 해제
        onDeselected: () => {
          Logger.debug('useGuidedTour', `⭕ Deselected step ${currentStepIndex}`);
        },
      });

      // 튜토리얼 시작 (저장된 진행도부터)
      driverRef.current.drive(currentStepIndex);
      Logger.info('useGuidedTour', `✅ Driver.js started at step ${currentStepIndex}`);
    } catch (error) {
      Logger.error('useGuidedTour', '❌ Failed to initialize Driver.js', error);
    } finally {
      isInitializingRef.current = false;
    }
  }, [currentTutorialId, currentStepIndex, nextStep, previousStep, closeTutorial]);

  /**
   * 🔥 개선: TutorialRefreshController 통합
   * 테마/폰트/반응형 시스템 변화 자동 감지 및 새로고침
   */
  useTutorialRefreshController({
    driver: driverRef.current,
    enabled: isActive,
  });

  /**
   * 튜토리얼 활성화/비활성화 감지 및 Driver.js 제어
   * 
   * 🔧 개선사항:
   * 1. requestAnimationFrame으로 DOM 렌더링 완료 대기
   * 2. CSS 변수 로드 대기 추가
   */
  useEffect(() => {
    if (!isActive || !currentTutorialId) {
      // 튜토리얼 비활성화 → Driver 정리 + 리스너 제거
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch {
          // 이미 destroy된 경우 무시
        }
        driverRef.current = null;
      }
      return;
    }

    // 🚀 개선: requestAnimationFrame으로 DOM 렌더링 완료 대기
    const frameId = requestAnimationFrame(() => {
      // 한 번 더 기다려서 CSS도 적용되도록 함
      setTimeout(() => {
        initializeDriver();
      }, 10);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isActive, currentTutorialId, initializeDriver]);

  /**
   * 🔧 Scroll 이벤트 감시 - popover position 업데이트
   * Driver.js는 initial positioning만 하므로, scroll 후 refresh 필요
   */
  useEffect(() => {
    if (!driverRef.current || !isActive) return;

    const handleScroll = () => {
      // Throttle: 100ms 간격으로만 refresh
      if (!isInitializingRef.current && driverRef.current?.refresh) {
        driverRef.current.refresh();
        // Driver.js가 자동으로 처리하므로 수동 sync 제거 ✅
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    Logger.debug('useGuidedTour', '✅ Scroll listener added');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      Logger.debug('useGuidedTour', '🗑️ Scroll listener removed');
    };
  }, [isActive]);

  /**
   * 🔧 Step index 변경 시 popover 재계산
   * 새로운 element를 highlight할 때 위치 재계산 필요
   */
  useEffect(() => {
    if (!driverRef.current || !isActive) return;

    // 50ms 후 refresh (step 전환 애니메이션 완료 대기)
    const timerId = setTimeout(() => {
      if (driverRef.current?.refresh) {
        driverRef.current.refresh();
        Logger.debug('useGuidedTour', `🔄 Popover refreshed for step ${currentStepIndex}`);
        // Driver.js가 자동으로 처리하므로 수동 sync 제거 ✅
      }
    }, 50);

    return () => {
      clearTimeout(timerId);
    };
  }, [currentStepIndex, isActive]);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch {
          // 이미 destroy된 경우 무시
        }
      }
    };
  }, []);

  return driverRef.current;
}
