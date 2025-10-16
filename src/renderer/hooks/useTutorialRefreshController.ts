/**
 * 🎨 Tutorial Refresh Controller Hook
 *
 * - 상태 변화 감지
 * - Driver.js 자동 새로고침
 * - Popover 위치 재계산
 */

import { useEffect, useRef, useCallback } from 'react';
import type { Driver } from 'driver.js';
import { tutorialStateManager } from '../managers/TutorialStateManager';
import type { TutorialState } from '../utils/tutorial-refresh';
import { syncPopoverPositionToActiveElement } from '../utils/tutorial-refresh';
import { Logger } from '../../shared/logger';

interface UseTutorialRefreshControllerOptions {
  driver: Driver | null;
  enabled?: boolean;
  onRefresh?: (state: TutorialState) => void;
}

/**
 * 🎯 Tutorial 상태 변화 감지 및 자동 새로고침 Hook
 */
export function useTutorialRefreshController({
  driver,
  enabled = true,
  onRefresh,
}: UseTutorialRefreshControllerOptions): void {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Popover 새로고침 함수
  const refreshPopover = useCallback(
    (state: TutorialState) => {
      if (!driver || !enabled || isRefreshingRef.current) {
        return;
      }

      isRefreshingRef.current = true;

      try {
        Logger.debug('TUTORIAL_REFRESH', 'Refreshing popover', { state });

        // Driver.js 새로고침 (refresh 메서드가 있는지 확인)
        if (driver && typeof driver.refresh === 'function') {
          driver.refresh();

          requestAnimationFrame(() => {
            syncPopoverPositionToActiveElement(driver);
          });
        }

        // 콜백 실행
        if (onRefresh) {
          onRefresh(state);
        }

        Logger.debug('TUTORIAL_REFRESH', 'Popover refreshed successfully');
      } catch (error) {
        Logger.error('TUTORIAL_REFRESH', 'Error refreshing popover', error);
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [driver, enabled, onRefresh],
  );

  // 상태 변화 구독
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // 상태 매니저 초기화
    tutorialStateManager.initialize().catch((error) => {
      Logger.error('TUTORIAL_REFRESH', 'Failed to initialize TutorialStateManager', error);
    });

    // 리스너 등록
    unsubscribeRef.current = tutorialStateManager.subscribe((state: TutorialState) => {
      // Debounce 추가 (throttle 이후에도 추가 debounce)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        refreshPopover(state);
      }, 50); // 50ms 추가 지연 (CSS 계산 완료 대기)
    });

    Logger.debug('TUTORIAL_REFRESH', 'Listener registered');

    return () => {
      // 정리
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [enabled, refreshPopover]);
}
