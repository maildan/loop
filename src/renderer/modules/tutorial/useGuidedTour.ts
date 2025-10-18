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
  const { startTutorial, nextStep, previousStep, closeTutorial, completeTutorial } = useTutorial();
  const { currentTutorialId, currentStepIndex, isActive } = useTutorialState();
  const driverRef = useRef<Driver | null>(null);
  const isInitializingRef = useRef(false);
  const autoProgressTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 🔥 중복 타이머 방지
  const renderCountRef = useRef(0); // 🔥 onPopoverRender 호출 횟수 추적 (디버깅)
  const currentStepIndexRef = useRef(0); // 🔥 최신 currentStepIndex를 ref로 추적 (closure 문제 해결)

  /**
   * 🔥 currentStepIndex를 ref로 항상 최신 상태 유지
   * onPopoverRender 콜백에서 stale closure 문제 방지
   */
  useEffect(() => {
    currentStepIndexRef.current = currentStepIndex;
    Logger.debug('useGuidedTour', `📌 currentStepIndexRef updated: ${currentStepIndex}`);
  }, [currentStepIndex]);

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

      // 🔥 안전성 검증: 첫 번째 step의 element가 존재하는지 확인
      // 이 검사가 없으면 element를 못 찾을 때 무한 재시도 루프 발생 (무한루프 버그)
      const firstStep = tutorial.steps[0];
      if (firstStep?.element) {
        let firstElement: Element | null = null;
        if (typeof firstStep.element === 'string') {
          firstElement = document.querySelector(firstStep.element);
        } else if (typeof firstStep.element === 'function') {
          try {
            const result = firstStep.element();
            firstElement = result as Element | null;
          } catch (e) {
            Logger.warn('useGuidedTour', `⚠️ Error calling element function: ${e}`);
          }
        }

        if (!firstElement) {
          Logger.warn(
            'useGuidedTour',
            `⚠️ Tutorial "${currentTutorialId}" element not found. ` +
            `Modal may be closed or not yet mounted. Skipping driver initialization.`
          );
          // 요소가 없으면 튜토리얼을 강제로 종료 (무한 재시도 방지)
          await closeTutorial();
          return;
        }
      }

      // 기존 인스턴스 정리
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch {
          // 이미 destroy된 경우 무시
        }
      }

      // Driver.js 설정
      const autoProgressDelay = tutorial.meta?.autoProgressDelay ?? 3000;
      const isAutoProgress = tutorial.meta?.autoProgress ?? false;

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
          const stepIdx = currentStepIndexRef.current;
          const currentStep = tutorial.steps[stepIdx];
          
          Logger.debug('useGuidedTour', `→ Next button clicked (step ${stepIdx})`);
          
          // 🔥 특수 처리: 'action-create' 스텝에서 버튼 자동 클릭 후 프로젝트 생성 튜토리얼 전환
          if (currentStep?.stepId === 'action-create') {
            Logger.info('useGuidedTour', '🎯 Detected action-create step → auto-triggering modal');
            const actionCreateBtn = document.querySelector('[data-tour="action-create"]') as HTMLElement;
            if (actionCreateBtn) {
              actionCreateBtn.click();
              Logger.debug('useGuidedTour', '⏳ Waiting for modal to open before starting project-creator tutorial');
              
              // 모달 오픈 애니메이션 완료 대기
              setTimeout(() => {
                startTutorial('project-creator');
              }, 500);
              return;
            } else {
              Logger.warn('useGuidedTour', '⚠️ action-create button not found');
            }
          }
          
          // 🔥 일반 다음 버튼: Context state 업데이트 (driver.moveTo는 useEffect에서 자동 처리)
          await nextStep();
          
          // 🔥 개선: driver.js API를 사용해 마지막 스텝 여부 확인 (더 정확함)
          // nextStep() 직후 driver가 이미 새로운 step으로 이동했으므로
          // driver.isLastStep()를 사용하면 비동기 지연 없이 즉시 확인 가능
          if (!driverRef.current) return;
          
          try {
            // 마지막 스텝에 도달했는지 확인
            const isNowLastStep = driverRef.current.isLastStep?.();
            
            // ✅ 해결책: 마지막 스텝이고 다음 튜토리얼이 있으면 그곳으로 전환
            if (isNowLastStep && tutorial.meta?.nextTutorialId) {
              Logger.info(
                'useGuidedTour',
                `🔄 Last step completed → Transitioning to next tutorial: ${tutorial.meta.nextTutorialId}`
              );
              
              // 다음 튜토리얼로 자동 전환 (지연 없음)
              await startTutorial(tutorial.meta.nextTutorialId);
            }
            // ✅ 핵심 수정: 마지막 스텝이고 다음 튜토리얼이 없으면 튜토리얼 완료 처리
            else if (isNowLastStep) {
              Logger.info(
                'useGuidedTour',
                `🎉 Tutorial completed (last step) → completeTutorial()`
              );
              
              // TutorialContext의 completeTutorial() 호출
              // 이를 통해 returnTutorialId가 있으면 그곳으로 복귀
              // 없으면 isActive = false로 설정
              await completeTutorial();
            }
          } catch (error) {
            Logger.error('useGuidedTour', 'Error checking last step status', error);
          }
        },

        onPrevClick: async () => {
          const stepIdx = currentStepIndexRef.current;
          Logger.debug('useGuidedTour', `← Previous button clicked (step ${stepIdx})`);
          
          // Context state 업데이트 (driver.moveTo는 useEffect에서 자동 처리)
          try {
            await previousStep();
          } catch (error) {
            Logger.error('useGuidedTour', 'Error in previousStep', error);
          }
        },

        onCloseClick: async () => {
          Logger.info('useGuidedTour', '✖️ Tutorial closed');
          closeTutorial();
        },

        // 🔥 자동 진행 콜백 + Smooth scroll 감지
        onPopoverRender: (popover) => {
          renderCountRef.current++;
          const renderCount = renderCountRef.current;
          const currentStepIdx = currentStepIndexRef.current; // 🔥 ref에서 최신 값 가져오기
          
          Logger.debug(
            'useGuidedTour',
            `📍 onPopoverRender called (count: ${renderCount}, step: ${currentStepIdx})`
          );

          // 🔥 이전 타이머 정리 (중복 방지) - 더 엄격한 확인
          if (autoProgressTimeoutRef.current !== null) {
            clearTimeout(autoProgressTimeoutRef.current);
            autoProgressTimeoutRef.current = null;
            Logger.debug('useGuidedTour', '🧹 Cleared previous auto-progress timer');
          }

          // 🔥 Scroll to element if needed
          try {
            const currentStep = tutorial.steps[currentStepIdx]; // 🔥 ref 값 사용
            if (currentStep?.element && typeof currentStep.element === 'string') {
              const element = document.querySelector(currentStep.element) as HTMLElement;
              if (element) {
                // 요소가 뷰포트 아래에 있으면 smooth scroll
                const rect = element.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                if (rect.bottom > viewportHeight) {
                  Logger.debug(
                    'useGuidedTour',
                    `📜 Scrolling to element (bottom: ${rect.bottom}, viewport: ${viewportHeight})`
                  );
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                  
                  // Scroll 후 popover 위치 재계산 (400ms 대기 - 애니메이션 완료 확인)
                  setTimeout(() => {
                    if (driverRef.current?.refresh) {
                      driverRef.current.refresh();
                      Logger.debug('useGuidedTour', '🔄 Driver refreshed after scroll');
                    }
                  }, 400);
                }
              }
            }
          } catch (error) {
            Logger.error('useGuidedTour', 'Error in scroll detection', error);
          }

          // 🔥 자동 진행 타이머 (마지막 step이 아닐 때만)
          if (isAutoProgress && currentStepIdx < tutorial.steps.length - 1) { // 🔥 ref 값 사용
            Logger.info(
              'useGuidedTour',
              `⏱️ Auto-progress scheduled for step ${currentStepIdx} after ${autoProgressDelay}ms (render #${renderCount})`
            );
            
            autoProgressTimeoutRef.current = setTimeout(() => {
              // 타이머 실행 시점에 다시 체크 (상태가 변경되었을 수 있음)
              if (autoProgressTimeoutRef.current === null) {
                Logger.debug('useGuidedTour', '⏭️ Auto-progress timer already cleared, skipping nextStep');
                return;
              }
              
              autoProgressTimeoutRef.current = null;
              Logger.info('useGuidedTour', `→ Auto-progress executing for step ${currentStepIndexRef.current}`);
              nextStep().catch(err =>
                Logger.error('useGuidedTour', 'Error in auto-progress', err)
              );
            }, autoProgressDelay);
          } else if (!isAutoProgress) {
            Logger.debug('useGuidedTour', '⏸️ Auto-progress disabled for this step');
          } else if (currentStepIdx >= tutorial.steps.length - 1) { // 🔥 ref 값 사용
            Logger.info('useGuidedTour', '✅ Last step reached, no auto-progress scheduled');
          }
        },

        // 튜토리얼 완료 시
        onDestroyed: () => {
          Logger.info('useGuidedTour', `🏁 Tutorial driver destroyed`);
          driverRef.current = null;
        },

        // 하이라이트 시작
        onHighlighted: (element, step) => {
          // 🔥 currentStepIndex는 stale closure이므로 currentStepIndexRef 사용
          Logger.debug(
            'useGuidedTour',
            `🎯 Highlighted step ${currentStepIndexRef.current}`,
            { element: element?.id || element?.className }
          );
          // Driver.js가 자동으로 positioning을 처리하므로 수동 개입 제거 ✅
        },

        // 하이라이트 해제
        onDeselected: () => {
          // 🔥 currentStepIndex는 stale closure이므로 currentStepIndexRef 사용
          Logger.debug('useGuidedTour', `⭕ Deselected step ${currentStepIndexRef.current}`);
        },
      });

      // 🔥 튜토리얼 시작 (저장된 진행도부터 시작)
      // currentStepIndexRef를 사용하여 최신 상태 반영
      const startStep = currentStepIndexRef.current;
      driverRef.current.drive(startStep);
      Logger.info('useGuidedTour', `✅ Driver.js started at step ${startStep}`);
    } catch (error) {
      Logger.error('useGuidedTour', '❌ Failed to initialize Driver.js', error);
    } finally {
      isInitializingRef.current = false;
    }
  }, [currentTutorialId, nextStep, previousStep, closeTutorial]);
  // 🔥 currentStepIndex는 ref로 추적하므로 의존성 제외
  // 이렇게 하면 step 변경 시 useCallback 재생성 안 됨 (driver 재초기화 방지)
  // 하지만 onPopoverRender는 currentStepIndexRef.current로 항상 최신 값 사용!

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
  }, [isActive, currentTutorialId]);
  // 🔥 initializeDriver 제거: 이미 currentTutorialId 변경으로 재초기화됨
  // initializeDriver 포함 시 → 재생성 → useEffect 재실행 → driver 재초기화 (무한루프 위험)

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
   * 🔧 Step index 변경 시 driver를 해당 step으로 이동
   * 사용자가 이전/다음 버튼 클릭 시 Driver.js의 internal state도 동기화
   */
  useEffect(() => {
    if (!driverRef.current || !isActive) return;

    // 🔥 driver.moveTo(currentStepIndex)로 동기화
    // 이렇게 하면 TutorialContext의 상태 변경이 Driver.js에 반영됨
    try {
      driverRef.current.moveTo(currentStepIndex);
      Logger.info(
        'useGuidedTour',
        `🎯 Driver moved to step ${currentStepIndex}`
      );
    } catch (error) {
      Logger.error('useGuidedTour', `Error moving driver to step ${currentStepIndex}:`, error);
    }

    // 🔥 주의: moveTo() 호출 후 refresh() 제거
    // moveTo()가 이미 새 step의 popover를 렌더링하므로
    // refresh() 호출하면 onPopoverRender가 2번 실행됨 (중복 문제)
    // Step 전환 후 element 위치가 변경되었다면 scroll 핸들러에서 처리
    
    // 나중에 필요하면 조건부로만 refresh 호출:
    // const needsRefresh = /* element position changed */ 
    // if (needsRefresh) driverRef.current?.refresh();
  }, [currentStepIndex, isActive]);

  /**
   * 🔥 isActive가 false되면 즉시 driver destroy
   * 이를 통해 completeTutorial() 후 popover DOM 정리
   */
  useEffect(() => {
    if (!isActive && driverRef.current) {
      Logger.info(
        'useGuidedTour',
        '🛑 isActive=false detected → destroying driver immediately'
      );
      try {
        driverRef.current.destroy();
      } catch (error) {
        Logger.error('useGuidedTour', 'Error destroying driver on isActive change', error);
      }
      driverRef.current = null;
    }
  }, [isActive]);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      // 🔥 타이머 정리
      if (autoProgressTimeoutRef.current) {
        clearTimeout(autoProgressTimeoutRef.current);
        autoProgressTimeoutRef.current = null;
        Logger.debug('useGuidedTour', '⏱️ Auto-progress timer cleared on unmount');
      }
      
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
          Logger.debug('useGuidedTour', '🗑️ Driver destroyed on unmount');
        } catch {
          // 이미 destroy된 경우 무시
        }
      }
    };
  }, []);

  return driverRef.current;
}
