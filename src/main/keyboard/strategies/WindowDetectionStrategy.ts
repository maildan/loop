// 🔥 기가차드 윈도우 감지 전략 인터페이스 - 크로스플랫폼 지원

import { WindowInfo, Result, AppCategory } from '../../../shared/types';
import { Logger } from '../../../shared/logger';

/**
 * 🔥 윈도우 감지 전략 인터페이스
 * 각 플랫폼별로 구현하여 일관된 API 제공
 */
export interface WindowDetectionStrategy {
  /**
   * 전략 초기화
   */
  initialize(): Promise<Result<boolean>>;

  /**
   * 현재 활성 윈도우 가져오기
   */
  getCurrentActiveWindow(): Promise<Result<WindowInfo>>;

  /**
   * 모든 열린 윈도우 가져오기
   */
  getAllOpenWindows(): Promise<Result<WindowInfo[]>>;

  /**
   * 윈도우 변경 감지 지원 여부
   */
  supportsWindowChangeDetection(): boolean;

  /**
   * 권한 확인
   */
  checkPermissions(): Promise<Result<boolean>>;

  /**
   * 리소스 정리
   */
  cleanup(): Promise<void>;

  /**
   * 전략 이름
   */
  readonly strategyName: string;

  /**
   * 지원하는 플랫폼
   */
  readonly supportedPlatforms: NodeJS.Platform[];
}

/**
 * 🔥 기본 윈도우 감지 전략 추상 클래스
 */
export abstract class BaseWindowDetectionStrategy implements WindowDetectionStrategy {
  protected readonly componentName: string;
  protected isInitialized = false;

  constructor(componentName: string) {
    this.componentName = componentName;
  }

  abstract initialize(): Promise<Result<boolean>>;
  abstract getCurrentActiveWindow(): Promise<Result<WindowInfo>>;
  abstract getAllOpenWindows(): Promise<Result<WindowInfo[]>>;
  abstract supportsWindowChangeDetection(): boolean;
  abstract checkPermissions(): Promise<Result<boolean>>;
  abstract cleanup(): Promise<void>;
  abstract readonly strategyName: string;
  abstract readonly supportedPlatforms: NodeJS.Platform[];

  /**
   * 🔥 윈도우 정보 검증
   */
  protected validateWindowInfo(windowInfo: Partial<WindowInfo>): Result<WindowInfo> {
    try {
      // 필수 필드 검증
      if (!windowInfo.id || typeof windowInfo.id !== 'number') {
        return { success: false, error: 'Invalid window ID' };
      }

      if (!windowInfo.title || typeof windowInfo.title !== 'string') {
        return { success: false, error: 'Invalid window title' };
      }

      if (!windowInfo.owner?.name) {
        return { success: false, error: 'Invalid owner name' };
      }

      if (!windowInfo.owner?.processId || typeof windowInfo.owner.processId !== 'number') {
        return { success: false, error: 'Invalid process ID' };
      }

      // 기본값 설정
      const validatedWindow: WindowInfo = {
        id: windowInfo.id,
        title: windowInfo.title,
        owner: {
          name: windowInfo.owner.name,
          processId: windowInfo.owner.processId,
          bundleId: windowInfo.owner.bundleId,
          path: windowInfo.owner.path,
        },
        bounds: windowInfo.bounds || { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: windowInfo.memoryUsage || 0,
        loopTimestamp: Date.now(),
        loopAppCategory: windowInfo.loopAppCategory || ('other' as AppCategory),
        loopSessionId: `${windowInfo.owner.name}-${Date.now()}`,
      };

      return { success: true, data: validatedWindow };
    } catch (error) {
      Logger.error(this.componentName, 'Window validation failed', error);
      return { success: false, error: `Validation failed: ${error}` };
    }
  }

  /**
   * 🔥 에러를 Result 타입으로 변환
   */
  protected handleError<T>(error: unknown, context: string): Result<T> {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(this.componentName, `${context} failed`, error);
    return { success: false, error: errorMessage };
  }

  /**
   * 🔥 초기화 상태 확인
   */
  protected ensureInitialized(): Result<boolean> {
    if (!this.isInitialized) {
      return { success: false, error: 'Strategy not initialized' };
    }
    return { success: true, data: true };
  }
}
