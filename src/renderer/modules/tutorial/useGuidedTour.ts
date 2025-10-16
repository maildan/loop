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

/**
 * 스타일 상수 (다크모드 지원)
 */
const DRIVER_STYLES = {
  popoverClass: 'loop-driver-popover',
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
   * 튜토리얼 활성화/비활성화 감지 및 Driver.js 제어
   * 
   * 🔧 개선사항:
   * 1. requestAnimationFrame으로 DOM 렌더링 완료 대기
   * 2. Scroll/Resize 이벤트 리스너 추가
   * 3. ResizeObserver로 layout shift 감시
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
   * 🔧 Resize 이벤트 감시 - window 크기 변경 시 popover 재계산
   * Media query 활성화나 responsive layout 변경 시 호출
   */
  useEffect(() => {
    if (!driverRef.current || !isActive) return;

    const handleResize = () => {
      if (driverRef.current?.refresh) {
        // 50ms 후 refresh (resize 애니메이션 완료 대기)
        setTimeout(() => {
          if (driverRef.current?.refresh) {
            driverRef.current.refresh();
            Logger.debug('useGuidedTour', '🔄 Popover refreshed after resize');
          }
        }, 50);
      }
    };

    window.addEventListener('resize', handleResize);
    Logger.debug('useGuidedTour', '✅ Resize listener added');

    return () => {
      window.removeEventListener('resize', handleResize);
      Logger.debug('useGuidedTour', '🗑️ Resize listener removed');
    };
  }, [isActive]);

  /**
   * 🔧 ResizeObserver - popover 자체의 layout shift 감시
   * CSS media query나 동적 콘텐츠로 인한 크기 변경 감지
   */
  useEffect(() => {
    if (!driverRef.current || !isActive) return;

    let resizeObserver: ResizeObserver | null = null;

    try {
      resizeObserver = new ResizeObserver(() => {
        if (driverRef.current?.refresh) {
          // 100ms 후 refresh (크기 변경 애니메이션 완료 대기)
          setTimeout(() => {
            if (driverRef.current?.refresh) {
              driverRef.current.refresh();
              Logger.debug('useGuidedTour', '🔍 Popover refreshed after resize (ResizeObserver)');
            }
          }, 100);
        }
      });

      const popover = document.querySelector('.loop-driver-popover');
      if (popover) {
        resizeObserver.observe(popover);
        Logger.debug('useGuidedTour', '✅ ResizeObserver started');
      }
    } catch (error) {
      Logger.warn('useGuidedTour', 'ResizeObserver not supported', error);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        Logger.debug('useGuidedTour', '🗑️ ResizeObserver stopped');
      }
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

/**
 * CSS 주입 (다크모드 지원)
 * 페이지 로드 시 한 번 실행
 */
function injectTutorialStyles(): void {
  if (typeof document === 'undefined') return;

  const styleId = 'loop-tutorial-styles';
  if (document.getElementById(styleId)) {
    return; // 이미 주입됨
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* ============================================================
       Loop 튜토리얼 팝오버 - 확대되고 개선된 스타일
       문제 해결:
       1. 팝오버 크기 40% 확대 (최소 450px)
       2. 글 가독성 개선 (폰트 크기, 줄간격)
       3. 버튼 텍스트/색상 명확화
       4. Hover 상태 개선
       5. Close 버튼 스타일 수정
       6. 테마 호환성 완벽 지원
       ============================================================ */

    /* 팝오버 기본 스타일 */
    .loop-driver-popover {
      --driver-primary-color: hsl(var(--accent-primary));
      --driver-text-color: hsl(var(--foreground));
      --driver-bg-color: hsl(var(--card));
      --driver-border-color: hsl(var(--border));
      
      /* 문제 1 해결: 팝오버 크기 확대 (40% 더 큼) */
      min-width: 450px;
      max-width: 550px;
      padding: 28px !important;
      
      background-color: var(--driver-bg-color);
      color: var(--driver-text-color);
      border: 1.5px solid var(--driver-border-color);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 1rem;
    }

    /* 문제 2 해결: 제목 가독성 */
    .loop-driver-popover .driver-popover-title {
      color: var(--driver-text-color);
      font-weight: 700;
      font-size: 1.25rem;
      line-height: 1.4;
      margin-bottom: 1rem;
      letter-spacing: -0.3px;
    }

    /* 문제 2 해결: 설명 텍스트 가독성 대폭 개선 */
    .loop-driver-popover .driver-popover-description {
      color: hsl(var(--muted-foreground));
      font-size: 0.95rem;
      line-height: 1.7;
      letter-spacing: 0.2px;
      margin-bottom: 1.5rem;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* 문제 2 해결: 리스트 항목 여백 */
    .loop-driver-popover .driver-popover-description li {
      margin-bottom: 0.6rem;
    }

    /* 문제 5 해결: Close 버튼 스타일 정확히 */
    .loop-driver-popover .driver-popover-close-btn {
      background: transparent;
      color: hsl(var(--muted-foreground));
      border: none !important;
      outline: none !important;
      padding: 4px;
      cursor: pointer;
      transition: color 0.2s ease;
      font-size: 1.25rem;
      line-height: 1;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .loop-driver-popover .driver-popover-close-btn:hover {
      color: var(--driver-text-color);
      background-color: hsl(var(--muted))/50;
    }

    .loop-driver-popover .driver-popover-close-btn:focus {
      outline: none !important;
    }

    /* 문제 3-4 해결: 푸터 영역 */
    .loop-driver-popover .driver-popover-footer {
      display: flex;
      gap: 0.75rem;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--driver-border-color);
    }

    /* 문제 3-4 해결: Progress 텍스트 */
    .loop-driver-popover .driver-popover-progress-text {
      color: hsl(var(--muted-foreground));
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    /* 문제 3-4 해결: 버튼 스타일 (명확한 색상/텍스트) */
    .loop-driver-popover button {
      background-color: var(--driver-primary-color);
      color: white;
      border: none !important;
      outline: none !important;
      border-radius: 6px;
      padding: 0.65rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }

    /* 문제 4 해결: Hover 상태 명확 */
    .loop-driver-popover button:hover:not(:disabled) {
      background-color: var(--driver-primary-color);
      filter: brightness(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    .loop-driver-popover button:active:not(:disabled) {
      transform: translateY(0);
      filter: brightness(0.95);
    }

    /* 비활성 버튼 */
    .loop-driver-popover button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* 문제 6 해결: 모든 테마 호환성 */
    @media (prefers-color-scheme: light) {
      .loop-driver-popover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
    }

    @media (prefers-color-scheme: dark) {
      .loop-driver-popover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      }
      
      .loop-driver-popover button {
        filter: brightness(1);
      }
      
      .loop-driver-popover button:hover:not(:disabled) {
        filter: brightness(1.15);
      }
    }

    /* 접근성 개선: 포커스 상태 */
    .loop-driver-popover button:focus-visible {
      outline: 2px solid var(--driver-primary-color);
      outline-offset: 2px;
    }

    /* 모바일 지원 */
    @media (max-width: 600px) {
      .loop-driver-popover {
        min-width: 320px;
        max-width: 95vw;
        padding: 20px !important;
      }
      
      .loop-driver-popover .driver-popover-title {
        font-size: 1.1rem;
      }
      
      .loop-driver-popover .driver-popover-description {
        font-size: 0.9rem;
        line-height: 1.6;
      }
      
      .loop-driver-popover .driver-popover-footer {
        flex-direction: column;
        gap: 1rem;
      }
      
      .loop-driver-popover button {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);
  Logger.debug('useGuidedTour', '✅ Tutorial styles injected (enhanced)');
}

// 페이지 로드 시 스타일 주입
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTutorialStyles);
  } else {
    injectTutorialStyles();
  }
}
