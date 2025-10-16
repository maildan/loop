/**
 * 🎨 Tutorial 상태 동기화 및 갱신 유틸리티
 *
 * - Throttle/Debounce 로직
 * - CSS 변수 로드 대기
 * - 상태 비교 및 변화 감지
 */

import type { Driver } from 'driver.js';
import type { Theme } from '../../shared/types/theme';

/**
 * 🎯 Tutorial 상태 스냅샷
 */
export interface TutorialState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  fontFamily: string;
  editorFontFamily: string;
  editorFontScope: 'document' | 'selection';
  windowWidth: number;
  windowHeight: number;
  viewportWidth: number;
  isResponsive: boolean; // max-width: 600px 여부
  timestamp: number;
}

/**
 * 🎯 Throttle 함수 - 일정 시간 내 반복 호출을 1번으로 축소
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastTimestamp = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (!inThrottle) {
      inThrottle = true;
      lastTimestamp = now;
      func.apply(this, args);
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else if (now - lastTimestamp >= limit) {
      // 마지막 호출 이후 limit 경과: 즉시 실행
      inThrottle = false;
      lastTimestamp = now;
      func.apply(this, args);
    }
  };
}

/**
 * 🎯 Debounce 함수 - 일정 시간 동안 호출이 없을 때만 실행
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
      timeout = null;
    }, delay);
  };
}

/**
 * 🎯 CSS 변수가 로드될 때까지 대기
 *
 * @param timeout - 최대 대기 시간 (ms)
 * @returns CSS 변수 로드 완료 또는 timeout 후 resolve
 */
export async function waitForCSSVariables(timeout = 2000): Promise<void> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const check = () => {
      const computed = window.getComputedStyle(document.documentElement);
      const bgPrimary = computed.getPropertyValue('--bg-primary').trim();
      const textPrimary = computed.getPropertyValue('--text-primary').trim();

      // CSS 변수가 로드됨 (fallback 값이 아닌 실제 변수)
      if (bgPrimary && !bgPrimary.startsWith('--') && textPrimary && !textPrimary.startsWith('--')) {
        resolve();
        return;
      }

      // Timeout 초과
      if (Date.now() - startTime > timeout) {
        console.warn('[Tutorial] CSS variables not loaded within timeout, proceeding anyway');
        resolve();
        return;
      }

      // 다시 확인
      requestAnimationFrame(check);
    };

    check();
  });
}

/**
 * 🎯 현재 Viewport 상태 추출
 */
export function getCurrentViewportState(): Pick<
  TutorialState,
  'windowWidth' | 'windowHeight' | 'viewportWidth' | 'isResponsive'
> {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const viewportWidth = Math.min(windowWidth, document.documentElement.clientWidth);
  const isResponsive = viewportWidth <= 600;

  return {
    windowWidth,
    windowHeight,
    viewportWidth,
    isResponsive,
  };
}

/**
 * 🎯 현재 테마 상태 추출
 */
export function getCurrentThemeState(): Pick<TutorialState, 'theme' | 'resolvedTheme'> {
  const html = document.documentElement;
  const themePreference = html.getAttribute('data-theme-preference') || 'system';
  const themeMode = (html.getAttribute('data-theme-mode') || 'light') as 'light' | 'dark';

  return {
    theme: themePreference as Theme,
    resolvedTheme: themeMode,
  };
}

/**
 * 🎯 현재 폰트 상태 추출
 */
export function getCurrentFontState(): Pick<
  TutorialState,
  'fontFamily' | 'editorFontFamily' | 'editorFontScope'
> {
  const computed = window.getComputedStyle(document.documentElement);
  const fontFamily = computed.getPropertyValue('--font-family').trim() || 'system-ui';
  const editorFontFamily = computed.getPropertyValue('--editor-font-family').trim() || 'monospace';
  const editorFontScope = (
    document.documentElement.getAttribute('data-editor-font-scope') || 'document'
  ) as 'document' | 'selection';

  return {
    fontFamily,
    editorFontFamily,
    editorFontScope,
  };
}

/**
 * 🎯 완전한 Tutorial 상태 스냅샷 생성
 */
export function captureCurrentState(): TutorialState {
  return {
    ...getCurrentThemeState(),
    ...getCurrentFontState(),
    ...getCurrentViewportState(),
    timestamp: Date.now(),
  };
}

/**
 * 🎯 두 상태의 의미 있는 변화 감지
 *
 * @param previous - 이전 상태
 * @param current - 현재 상태
 * @returns 변화가 있으면 true
 */
export function hasSignificantChange(
  previous: TutorialState | null,
  current: TutorialState,
): boolean {
  if (!previous) return true; // 초기 상태는 항상 변화

  // 테마 변화
  if (previous.theme !== current.theme || previous.resolvedTheme !== current.resolvedTheme) {
    return true;
  }

  // 폰트 변화 (3% 이상 변했으면 감지)
  if (previous.fontFamily !== current.fontFamily) {
    return true;
  }
  if (previous.editorFontFamily !== current.editorFontFamily) {
    return true;
  }

  // Viewport 변화 (50px 이상 변했으면 감지)
  if (Math.abs(previous.windowWidth - current.windowWidth) > 50) {
    return true;
  }
  if (Math.abs(previous.windowHeight - current.windowHeight) > 50) {
    return true;
  }

  // 반응형 상태 변화
  if (previous.isResponsive !== current.isResponsive) {
    return true;
  }

  return false;
}

export interface PopoverPlacement {
  top: number;
  left: number;
  side: 'top' | 'bottom' | 'left' | 'right';
}

export interface PopoverPlacementOptions {
  offset?: number;
  padding?: number;
}

export interface SyncPopoverOptions extends PopoverPlacementOptions {
  animationThreshold?: number;
  animationDuration?: number;
  animationEasing?: string;
}

const DEFAULT_PLACEMENT_OPTIONS: Required<PopoverPlacementOptions> = {
  offset: 20,
  padding: 16,
};

const DEFAULT_SYNC_OPTIONS: Required<SyncPopoverOptions> = {
  offset: 20,
  padding: 16,
  animationThreshold: 24,
  animationDuration: 240,
  animationEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

/**
 * 🎯 Popover 목표 위치 계산 (viewport에 맞게 clamp)
 */
export function calculatePopoverPlacement(
  targetRect: DOMRect,
  popoverRect: DOMRect,
  options: PopoverPlacementOptions = {},
): PopoverPlacement {
  const { offset, padding } = { ...DEFAULT_PLACEMENT_OPTIONS, ...options };
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 기본은 하단 배치
  let top = targetRect.bottom + offset;
  let side: PopoverPlacement['side'] = 'bottom';

  // 하단 공간 부족하면 상단 배치 시도
  if (top + popoverRect.height + padding > viewportHeight) {
    const candidateTop = targetRect.top - popoverRect.height - offset;
    if (candidateTop >= padding) {
      top = candidateTop;
      side = 'top';
    } else {
      // 상하 모두 부족하면 viewport 내부로 clamp
      top = Math.max(padding, viewportHeight - popoverRect.height - padding);
    }
  }

  // 기본은 중앙 정렬, viewport 범위로 clamp
  let left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
  left = Math.min(Math.max(left, padding), viewportWidth - popoverRect.width - padding);

  // 좌우 공간 부족하면 좌/우 측 배치 고려
  if (targetRect.left - popoverRect.width - offset >= padding) {
    // 왼쪽 배치 가능 (필요시 사용)
    // 현재 요구사항에서는 가로 배치를 사용하지 않지만 대비값 저장
  }

  if (targetRect.right + popoverRect.width + offset <= viewportWidth - padding) {
    // 오른쪽 배치 가능
  }

  return { top, left, side };
}

/**
 * 🎯 Popover 위치를 애니메이션으로 이동시키기
 */
function applyAnimatedPlacement(
  popover: HTMLElement,
  placement: PopoverPlacement,
  options: Required<SyncPopoverOptions>,
): void {
  const previousRect = popover.getBoundingClientRect();
  const deltaX = previousRect.left - placement.left;
  const deltaY = previousRect.top - placement.top;
  const distance = Math.hypot(deltaX, deltaY);
  const hasInitialized = popover.dataset.loopPopoverInitialized === 'true';
  const shouldAnimate = hasInitialized && distance > options.animationThreshold;

  popover.style.top = `${placement.top}px`;
  popover.style.left = `${placement.left}px`;
  popover.dataset.loopPopoverSide = placement.side;

  // slide 애니메이션
  if (shouldAnimate) {
    popover.style.setProperty('--loop-slide-dx', `${deltaX}px`);
    popover.style.setProperty('--loop-slide-dy', `${deltaY}px`);
    popover.classList.add('loop-driver-popover--slide');
    const handleAnimationEnd = () => {
      popover.classList.remove('loop-driver-popover--slide');
      popover.removeEventListener('animationend', handleAnimationEnd);
    };
    popover.addEventListener('animationend', handleAnimationEnd, { once: true });
  }

  // 위치 transition (작은 이동도 부드럽게)
  if (!hasInitialized) {
    popover.style.transition = 'none';
    requestAnimationFrame(() => {
      popover.style.transition = '';
    });
  } else {
    popover.style.transition = `top ${options.animationDuration}ms ${options.animationEasing}, left ${options.animationDuration}ms ${options.animationEasing}`;
  }

  popover.dataset.loopPopoverInitialized = 'true';
}

/**
 * 🎯 Driver.js 활성 요소에 맞춰 Popover 위치 동기화
 */
export function syncPopoverPositionToActiveElement(
  driver: Driver | null,
  options: SyncPopoverOptions = {},
): void {
  if (!driver || typeof driver.getActiveElement !== 'function') {
    return;
  }

  const activeElement = driver.getActiveElement();
  if (!activeElement) {
    return;
  }

  const popover = document.querySelector<HTMLElement>('.loop-driver-popover');
  if (!popover) {
    return;
  }

  const mergedOptions: Required<SyncPopoverOptions> = {
    ...DEFAULT_SYNC_OPTIONS,
    ...options,
  };

  const targetRect = activeElement.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const placement = calculatePopoverPlacement(targetRect, popoverRect, mergedOptions);

  applyAnimatedPlacement(popover, placement, mergedOptions);
}
