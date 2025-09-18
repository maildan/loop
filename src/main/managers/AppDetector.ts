// 🔥 기가차드 앱 감지자 - DISABLED (모니터링 기능 제거됨)

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result, WindowInfo } from '../../shared/types';

// #DEBUG: App detector entry point
Logger.debug('APP_DETECTOR', 'App detector module disabled - monitoring feature removed');

// 🔥 기가차드 앱 감지자 - DISABLED
export class AppDetector extends BaseManager {
  private readonly componentName = 'APP_DETECTOR';

  constructor() {
    super();
    Logger.info(this.componentName, '앱 감지자 비활성화됨 - 모니터링 기능 제거');
  }

  /**
   * 초기화 (비활성화됨)
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, '앱 감지자 초기화 스킵 - 비활성화됨');
  }

  /**
   * 시작 (비활성화됨)
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '앱 감지자 시작 스킵 - 비활성화됨');
  }

  /**
   * 정지 (비활성화됨)
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '앱 감지자 정지 스킵 - 비활성화됨');
  }

  /**
   * 정리 (비활성화됨)
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '앱 감지자 정리 스킵 - 비활성화됨');
  }

  /**
   * 현재 활성 창 정보 가져오기 (비활성화됨)
   */
  public async getCurrentWindow(): Promise<Result<WindowInfo>> {
    return {
      success: false,
      error: 'App detector disabled',
      data: {
        id: 0,
        title: 'Unknown',
        owner: {
          name: 'Unknown',
          processId: 0,
          bundleId: 'unknown'
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: 0
      }
    };
  }

  /**
   * 창 변경 감지 (비활성화됨)
   */
  public async detectWindowChange(): Promise<boolean> {
    return false;
  }

  /**
   * 상태 정보 (비활성화됨)
   */
  public getStatus(): {
    isRunning: boolean;
    currentWindow?: WindowInfo;
    lastDetectionTime?: Date;
  } {
    return {
      isRunning: false
    };
  }
}

// Export default
export default AppDetector;
