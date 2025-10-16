/**
 * 🎨 Tutorial 상태 관리자 (싱글톤)
 *
 * - 테마/폰트/viewport 상태 중앙 관리
 * - 모든 상태 변화 감지 및 callback 호출
 * - Throttle을 통한 효율적 업데이트
 */

import type { TutorialState } from '../utils/tutorial-refresh';
import {
  captureCurrentState,
  hasSignificantChange,
  throttle,
  getCurrentThemeState,
  getCurrentFontState,
  getCurrentViewportState,
} from '../utils/tutorial-refresh';
import type { Theme } from '../../shared/types/theme';
import { Logger } from '../../shared/logger';

type TutorialStateListener = (state: TutorialState) => void;

/**
 * 🎯 Tutorial 상태 매니저
 */
export class TutorialStateManager {
  private static instance: TutorialStateManager | null = null;
  private currentState: TutorialState | null = null;
  private listeners: Set<TutorialStateListener> = new Set();
  private isInitialized = false;
  private resizeObserver: ResizeObserver | null = null;
  private mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null;
  private themeChangeHandler: ((theme: Theme) => void) | null = null;
  private fontChangeHandler: (() => void) | null = null;

  private constructor() {
    this.notifyListeners = throttle(this.notifyListeners.bind(this), 300);
  }

  public static getInstance(): TutorialStateManager {
    if (!TutorialStateManager.instance) {
      TutorialStateManager.instance = new TutorialStateManager();
    }
    return TutorialStateManager.instance;
  }

  /**
   * 🎯 상태 매니저 초기화
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 초기 상태 캡처
      this.currentState = captureCurrentState();
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Initial state captured', this.currentState);

      // 리스너 등록
      this.setupThemeListener();
      this.setupFontListener();
      this.setupViewportListener();
      this.setupResizeObserver();

      this.isInitialized = true;
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Initialized successfully');
    } catch (error) {
      Logger.error('TUTORIAL_STATE_MANAGER', 'Initialization failed', error);
    }
  }

  /**
   * 🎯 상태 변화 리스너 등록
   */
  public subscribe(listener: TutorialStateListener): () => void {
    this.listeners.add(listener);

    // Unsubscribe 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 🎯 테마 변화 리스너 설정
   */
  private setupThemeListener(): void {
    if (!window.electronAPI?.theme) {
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Electron theme API not available');
      return;
    }

    // 테마 변화 감지
    if (typeof window.electronAPI.theme.onChange === 'function') {
      this.themeChangeHandler = (theme: Theme) => {
        Logger.debug('TUTORIAL_STATE_MANAGER', 'Theme changed detected', { theme });
        this.checkForStateChange();
      };

      try {
        window.electronAPI.theme.onChange(this.themeChangeHandler);
        Logger.debug('TUTORIAL_STATE_MANAGER', 'Theme onChange listener registered');
      } catch (error) {
        Logger.error('TUTORIAL_STATE_MANAGER', 'Failed to register theme onChange', error);
      }
    }

    // 시스템 테마 변화 감지
    if (typeof window.electronAPI.theme.onSystemChange === 'function') {
      try {
        window.electronAPI.theme.onSystemChange(() => {
          Logger.debug('TUTORIAL_STATE_MANAGER', 'System theme change detected');
          this.checkForStateChange();
        });
        Logger.debug('TUTORIAL_STATE_MANAGER', 'Theme onSystemChange listener registered');
      } catch (error) {
        Logger.error('TUTORIAL_STATE_MANAGER', 'Failed to register theme onSystemChange', error);
      }
    }

    // 미디어쿼리 변화 감지 (prefers-color-scheme)
    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Media query changed', {
        matches: event.matches,
        media: event.media,
      });
      this.checkForStateChange();
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', this.mediaQueryListener);
    Logger.debug('TUTORIAL_STATE_MANAGER', 'Media query listener registered');
  }

  /**
   * 🎯 폰트 변화 리스너 설정
   */
  private setupFontListener(): void {
    // localStorage 변화 감지 (useDynamicFont가 사용)
    this.fontChangeHandler = () => {
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Font change detected via storage');
      this.checkForStateChange();
    };

    window.addEventListener('storage', this.fontChangeHandler);
    Logger.debug('TUTORIAL_STATE_MANAGER', 'Storage listener registered for font changes');

    // CSS 변수 변화 감지 (MutationObserver로 style 속성 감시)
    const styleObserver = new MutationObserver(() => {
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Style attribute changed');
      this.checkForStateChange();
    });

    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'data-editor-font-scope'],
      attributeOldValue: false,
    });

    Logger.debug('TUTORIAL_STATE_MANAGER', 'Style mutation observer registered');
  }

  /**
   * 🎯 Viewport 변화 리스너 설정
   */
  private setupViewportListener(): void {
    // Resize 이벤트 감지
    const handleResize = throttle(() => {
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Window resize detected');
      this.checkForStateChange();
    }, 200); // resize는 200ms로 throttle

    window.addEventListener('resize', handleResize, { passive: true });
    Logger.debug('TUTORIAL_STATE_MANAGER', 'Resize listener registered');

    // Orientation 변화 감지
    window.addEventListener('orientationchange', () => {
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Orientation changed');
      this.checkForStateChange();
    });
  }

  /**
   * 🎯 ResizeObserver로 document 크기 변화 감지
   */
  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      Logger.debug('TUTORIAL_STATE_MANAGER', 'Document resize observed');
      this.checkForStateChange();
    });

    // body와 html 모두 감시
    this.resizeObserver.observe(document.body);
    this.resizeObserver.observe(document.documentElement);

    Logger.debug('TUTORIAL_STATE_MANAGER', 'ResizeObserver registered');
  }

  /**
   * 🎯 현재 상태 확인 및 변화 감지
   */
  private checkForStateChange(): void {
    try {
      const newState = captureCurrentState();

      if (hasSignificantChange(this.currentState, newState)) {
        Logger.debug('TUTORIAL_STATE_MANAGER', 'Significant state change detected', {
          previous: this.currentState,
          current: newState,
        });
        this.currentState = newState;
        this.notifyListeners(newState);
      }
    } catch (error) {
      Logger.error('TUTORIAL_STATE_MANAGER', 'Error checking for state change', error);
    }
  }

  /**
   * 🎯 모든 리스너에게 상태 변화 알림 (throttled)
   */
  private notifyListeners(state: TutorialState): void {
    Logger.debug('TUTORIAL_STATE_MANAGER', 'Notifying listeners', {
      listenerCount: this.listeners.size,
      state,
    });

    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        Logger.error('TUTORIAL_STATE_MANAGER', 'Error in listener callback', error);
      }
    });
  }

  /**
   * 🎯 현재 상태 반환
   */
  public getState(): TutorialState | null {
    return this.currentState;
  }

  /**
   * 🎯 수동으로 상태 새로고침 (필요시)
   */
  public refreshState(): void {
    Logger.debug('TUTORIAL_STATE_MANAGER', 'Manual refresh triggered');
    this.checkForStateChange();
  }

  /**
   * 🎯 정리 (언마운트 시)
   */
  public cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.mediaQueryListener) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }

    if (this.fontChangeHandler) {
      window.removeEventListener('storage', this.fontChangeHandler);
    }

    this.listeners.clear();
    this.isInitialized = false;

    Logger.debug('TUTORIAL_STATE_MANAGER', 'Cleaned up');
  }
}

/**
 * 🎯 전역 인스턴스
 */
export const tutorialStateManager = TutorialStateManager.getInstance();
