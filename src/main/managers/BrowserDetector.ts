// 🔥 기가차드 브라우저 감지자 - DISABLED (모니터링 기능 제거됨)

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result, WindowInfo } from '../../shared/types';

// #DEBUG: Browser detector entry point
Logger.debug('BROWSER_DETECTOR', 'Browser detector module disabled - monitoring feature removed');

// 🔥 기가차드 브라우저 정보 인터페이스
export interface BrowserInfo {
  browserName: string;
  browserVersion?: string;
  currentUrl?: string;
  title?: string;
  tabCount?: number;
  isIncognito?: boolean;
}

// 🔥 기가차드 브라우저 감지자 - DISABLED
export class BrowserDetector extends BaseManager {
  private readonly componentName = 'BROWSER_DETECTOR';

  constructor() {
    super();
    Logger.info(this.componentName, '브라우저 감지자 비활성화됨 - 모니터링 기능 제거');
  }

  /**
   * 초기화 (비활성화됨)
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, '브라우저 감지자 초기화 스킵 - 비활성화됨');
  }

  /**
   * 시작 (비활성화됨)
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '브라우저 감지자 시작 스킵 - 비활성화됨');
  }

  /**
   * 정지 (비활성화됨)
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '브라우저 감지자 정지 스킵 - 비활성화됨');
  }

  /**
   * 정리 (비활성화됨)
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '브라우저 감지자 정리 스킵 - 비활성화됨');
  }

  /**
   * 브라우저 정보 가져오기 (비활성화됨)
   */
  public async getBrowserInfo(): Promise<Result<BrowserInfo>> {
    return {
      success: false,
      error: 'Browser detector disabled',
      data: {
        browserName: 'Unknown',
        browserVersion: 'Unknown'
      }
    };
  }

  /**
   * 현재 탭 정보 가져오기 (비활성화됨)
   */
  public async getCurrentTabInfo(): Promise<Result<{ url: string; title: string }>> {
    return {
      success: false,
      error: 'Browser detector disabled',
      data: {
        url: 'Unknown',
        title: 'Unknown'
      }
    };
  }

  /**
   * 브라우저별 타이핑 분석 (비활성화됨)
   */
  public analyzeTypingForBrowser(browserInfo: BrowserInfo): Result<any> {
    return {
      success: false,
      error: 'Browser detector disabled'
    };
  }

  /**
   * 상태 정보 (비활성화됨)
   */
  public getStatus(): {
    isRunning: boolean;
    browserName?: string;
    currentUrl?: string;
    lastDetectionTime?: Date;
  } {
    return {
      isRunning: false,
      browserName: 'Unknown',
      currentUrl: 'Unknown'
    };
  }
}

// Export default
export default BrowserDetector;
