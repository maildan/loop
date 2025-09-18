// 🔥 기가차드 macOS 키보드 핸들러 - DISABLED (모니터링 기능 제거됨)

import { Logger } from '../../shared/logger';
import { ProcessedKeyboardEvent, LanguageDetectionResult } from '../../shared/types';

/**
 * 🔥 MacOSKeyboardHandler - macOS 전용 키보드 이벤트 처리 [DISABLED]
 * 모니터링 기능이 제거되어 모든 메서드가 비활성화됨
 */
export class MacOSKeyboardHandler {
  private readonly componentName = 'MACOS_KEYBOARD_HANDLER';

  constructor(windowTracker?: any) {
    Logger.info(this.componentName, 'macOS 키보드 핸들러 비활성화됨 - 모니터링 기능 제거');
  }

  /**
   * 초기화 (비활성화됨)
   */
  public async initialize(): Promise<void> {
    Logger.info(this.componentName, 'macOS 키보드 핸들러 초기화 스킵 - 비활성화됨');
  }

  /**
   * 이벤트 처리 (비활성화됨)
   */
  public async handleEvent(event: any): Promise<ProcessedKeyboardEvent | null> {
    // 모든 이벤트 무시
    return null;
  }

  /**
   * 언어 감지 (비활성화됨)
   */
  public detectLanguage(event: any): LanguageDetectionResult | null {
    return null;
  }

  /**
   * IME 상태 확인 (비활성화됨)
   */
  public getIMEState(): { isActive: boolean; currentInputSource: string } {
    return {
      isActive: false,
      currentInputSource: 'Unknown'
    };
  }

  /**
   * 정리 (비활성화됨)
   */
  public async cleanup(): Promise<void> {
    Logger.info(this.componentName, 'macOS 키보드 핸들러 정리 스킵 - 비활성화됨');
  }

  /**
   * 상태 정보 (비활성화됨)
   */
  public getStatus(): {
    isInitialized: boolean;
    currentLanguage: string | null;
    imeActive: boolean;
  } {
    return {
      isInitialized: false,
      currentLanguage: null,
      imeActive: false
    };
  }
}

export default MacOSKeyboardHandler;
