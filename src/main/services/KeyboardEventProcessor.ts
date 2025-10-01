// 🔥 기가차드 키보드 이벤트 프로세서 - DISABLED (모니터링 기능 제거됨)

import { Logger } from '../../shared/logger';
import type {
  ProcessedKeyboardEvent,
  KeyboardEvent,
  HangulCompositionResult,
  LanguageDetectionResult
} from '../../shared/types';

/**
 * 🔥 KeyboardEventProcessor - 키보드 이벤트 처리 및 변환 전문 서비스 [DISABLED]
 * 모니터링 기능이 제거되어 모든 메서드가 비활성화됨
 */
export class KeyboardEventProcessor {
  private readonly componentName = 'KEYBOARD_EVENT_PROCESSOR';

  constructor() {
    Logger.info(this.componentName, '키보드 이벤트 프로세서 비활성화됨 - 모니터링 기능 제거');
  }

  /**
   * 초기화 (비활성화됨)
   */
  public async initialize(): Promise<void> {
    Logger.info(this.componentName, '키보드 이벤트 프로세서 초기화 스킵 - 비활성화됨');
  }

  /**
   * 정리 (비활성화됨)
   */
  public async cleanup(): Promise<void> {
    Logger.info(this.componentName, '키보드 이벤트 프로세서 정리 스킵 - 비활성화됨');
  }

  /**
   * 이벤트 처리 (비활성화됨)
   */
  public async processEvent(event: KeyboardEvent): Promise<ProcessedKeyboardEvent | null> {
    // 모든 이벤트 무시
    return null;
  }

  /**
   * 이벤트 배치 처리 (비활성화됨)
   */
  public async processBatch(events: KeyboardEvent[]): Promise<ProcessedKeyboardEvent[]> {
    // 모든 이벤트 무시
    return [];
  }

  /**
   * 한글 조합 상태 가져오기 (비활성화됨)
   */
  public getHangulCompositionState(): HangulCompositionResult | null {
    return null;
  }

  /**
   * 언어 감지 결과 가져오기 (비활성화됨)
   */
  public getLanguageDetectionResult(): LanguageDetectionResult | null {
    return null;
  }

  /**
   * 수동 언어 변경 (비활성화됨)
   */
  public forceLanguageChange(language: 'ko' | 'en'): void {
    // 아무것도 하지 않음
  }

  /**
   * 버퍼 정리 (비활성화됨)
   */
  public clearBuffer(): void {
    // 아무것도 하지 않음
  }

  /**
   * 상태 정보 (비활성화됨)
   */
  public getStats(): {
    isInitialized: boolean;
    bufferSize: number;
    isProcessing: boolean;
    componentsHealth: {
      hangulComposer: boolean;
      languageDetector: boolean;
      windowTracker: boolean;
      macOSHandler: boolean;
    };
  } {
    return {
      isInitialized: false,
      bufferSize: 0,
      isProcessing: false,
      componentsHealth: {
        hangulComposer: false,
        languageDetector: false,
        windowTracker: false,
        macOSHandler: false
      }
    };
  }
}

export default KeyboardEventProcessor;
