// 🔥 기가차드 macOS 키보드 핸들러 - macOS 전용 IME 처리 최적화

import { Logger } from '../../shared/logger';
import { ProcessedKeyboardEvent, UiohookKeyboardEvent, LanguageDetectionResult } from '../../shared/types';
import { WindowTracker } from '../keyboard/WindowTracker';
import { MacOSLanguageDetector } from '../keyboard/detectors/macos/MacOSLanguageDetector';

/**
 * 🔥 MacOSKeyboardHandler - macOS 전용 키보드 이벤트 처리
 * 
 * macOS IME와의 충돌 방지를 위한 특별 처리:
 * - 시스템 IME 완성 문자만 처리
 * - 조합 중간 과정 무시
 * - 완성된 한글만 통계에 반영
 */
export class MacOSKeyboardHandler {
  private readonly componentName = 'MACOS_KEYBOARD_HANDLER';
  private windowTracker: WindowTracker | null = null;
  private languageDetector: MacOSLanguageDetector;

  constructor(windowTracker: WindowTracker | null) {
    this.windowTracker = windowTracker;
    this.languageDetector = new MacOSLanguageDetector();
    Logger.info(this.componentName, 'macOS 키보드 핸들러 초기화됨');
  }

  /**
   * 🔥 macOS 전용 키 이벤트 처리
   */
  public async handleMacOSKeyEvent(
    type: string, 
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent | null> {
    try {
      const keychar = rawEvent.keychar || 0;
      const char = String.fromCharCode(keychar);
      
      // 🔥 1순위: 시스템 언어 감지를 통한 정확한 처리
      const detectionResult = await this.languageDetector.detectLanguage(rawEvent);
      const detectedLanguage = detectionResult?.language || 'en';
      
      Logger.debug(this.componentName, '🔥 macOS 언어 감지 결과', {
        keycode: rawEvent.keycode,
        keychar: keychar,
        detectedLanguage,
        confidence: detectionResult?.confidence,
        isComposing: detectionResult?.isComposing
      });
      
      // 🔥 완성된 한글 처리
      if (this.isCompletedHangul(keychar)) {
        return await this.processCompletedHangul(char, type, rawEvent);
      }
      // 🔥 한글 IME 활성 시 영어 키 무시 (개선된 로직)
      else if (detectedLanguage === 'ko') {
        // 🔥 한글 IME가 활성화된 상태에서는 모든 알파벳 키를 한글 조합으로 처리
        if (this.isEnglishAlphabet(rawEvent.keychar)) {
          Logger.debug(this.componentName, '🔥 한글 IME 활성 - 영어 알파벳을 한글 조합으로 처리', {
            keycode: rawEvent.keycode,
            keychar: rawEvent.keychar,
            char: rawEvent.keychar ? String.fromCharCode(rawEvent.keychar) : 'unknown',
            detectedLanguage
          });
          return await this.processKoreanComposing(char, type, rawEvent, detectionResult);
        } else {
          // 숫자, 특수문자는 직접 처리
          return await this.processDirectInput(char, type, rawEvent);
        }
      }
      // 🔥 영어/숫자 직접 처리
      else if (this.isDirectInputCharacter(keychar)) {
        return await this.processDirectInput(char, type, rawEvent);
      }
      // 🔥 기타 언어 처리
      else {
        Logger.debug(this.componentName, 'macOS 기타 언어 또는 무시할 키', { 
          keychar: keychar.toString(16),
          char: char || 'none',
          detectedLanguage
        });
        return null;
      }
      
    } catch (error) {
      Logger.error(this.componentName, 'macOS 키 이벤트 처리 실패', error);
      return null;
    }
  }

  /**
   * 🔥 완성된 한글 문자인지 판별
   */
  private isCompletedHangul(keychar: number): boolean {
    // 한글 완성형 범위 (가-힣): U+AC00 ~ U+D7AF
    return keychar >= 0xAC00 && keychar <= 0xD7AF;
  }

  /**
   * 🔥 영어/숫자 등 직접 입력 문자인지 판별
   */
  private isDirectInputCharacter(keychar: number): boolean {
    // ASCII 인쇄 가능 문자 (스페이스~틸드)
    return keychar >= 32 && keychar <= 126;
  }

  /**
   * 🔥 영어 알파벳 키인지 판별
   */
  private isEnglishAlphabet(keychar: number | undefined): boolean {
    if (!keychar) return false;
    // A-Z (65-90) 또는 a-z (97-122)
    return (keychar >= 65 && keychar <= 90) || (keychar >= 97 && keychar <= 122);
  }

  /**
   * 🔥 완성된 한글 처리
   */
  private async processCompletedHangul(
    char: string, 
    type: string, 
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent> {
    const windowInfo = this.windowTracker?.getCurrentWindow() || {
      title: 'Unknown',
      processName: 'Unknown'
    };

    const processedEvent: ProcessedKeyboardEvent = {
      key: char,
      code: `Key${rawEvent.keycode}`,
      keycode: rawEvent.keycode,
      keychar: char,
      timestamp: Date.now(),
      type: type as 'keydown' | 'keyup' | 'input',
      windowTitle: windowInfo.title || 'Unknown',
      language: 'ko',
      composedChar: char,
      isComposing: false,    // 🔥 완성된 상태
      inputMethod: 'ime',
      processingTime: 0
    };

    Logger.debug(this.componentName, 'macOS 완성된 한글 처리됨', {
      char,
      language: 'ko',
      isComposing: false
    });

    return processedEvent;
  }

  /**
   * 🔥 영어/숫자 직접 입력 처리
   */
  private async processDirectInput(
    char: string, 
    type: string, 
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent> {
    const windowInfo = this.windowTracker?.getCurrentWindow() || {
      title: 'Unknown',
      processName: 'Unknown'
    };

    const language = this.detectLanguageFromChar(char);

    const processedEvent: ProcessedKeyboardEvent = {
      key: char,
      code: `Key${rawEvent.keycode}`,
      keycode: rawEvent.keycode,
      keychar: char,
      timestamp: Date.now(),
      type: type as 'keydown' | 'keyup' | 'input',
      windowTitle: windowInfo.title || 'Unknown',
      language,
      composedChar: char,
      isComposing: false,    // 🔥 직접 입력은 조합 없음
      inputMethod: 'direct',
      processingTime: 0
    };

    Logger.debug(this.componentName, 'macOS 직접 입력 처리됨', {
      char,
      language,
      isComposing: false
    });

    return processedEvent;
  }

  /**
   * 🔥 한글 IME 조합 중 상태 처리 (새로 추가!)
   */
  private async processKoreanComposing(
    char: string, 
    type: string, 
    rawEvent: UiohookKeyboardEvent,
    detectionResult: LanguageDetectionResult
  ): Promise<ProcessedKeyboardEvent> {
    const windowInfo = this.windowTracker?.getCurrentWindow() || {
      title: 'Unknown',
      processName: 'Unknown'
    };

    const processedEvent: ProcessedKeyboardEvent = {
      key: char,
      code: `Key${rawEvent.keycode}`,
      keycode: rawEvent.keycode,
      keychar: char,
      timestamp: Date.now(),
      type: type as 'keydown' | 'keyup' | 'input',
      windowTitle: windowInfo.title || 'Unknown',
      language: 'ko',
      composedChar: detectionResult?.detectedChar || char,
      isComposing: detectionResult?.isComposing || true,    // 🔥 조합 중 상태
      inputMethod: 'ime',
      processingTime: 0
    };

    Logger.debug(this.componentName, '🔥 macOS 한글 IME 조합 중 처리됨', {
      char,
      detectedChar: detectionResult?.detectedChar,
      isComposing: detectionResult?.isComposing,
      confidence: detectionResult?.confidence
    });

    return processedEvent;
  }

  /**
   * 🔥 문자로부터 언어 감지
   */
  private detectLanguageFromChar(char: string): string {
    if (!char || char.length !== 1) return 'en';
    
    const charCode = char.charCodeAt(0);
    
    // 한글 완성형
    if (charCode >= 0xAC00 && charCode <= 0xD7AF) return 'ko';
    
    // 한글 자모
    if ((charCode >= 0x1100 && charCode <= 0x11FF) || 
        (charCode >= 0x3130 && charCode <= 0x318F)) return 'ko';
    
    // 일본어
    if ((charCode >= 0x3040 && charCode <= 0x309F) || // 히라가나
        (charCode >= 0x30A0 && charCode <= 0x30FF)) return 'ja'; // 가타카나
    
    // 중국어 (한자)
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) return 'zh';
    
    // 기본값: 영어
    return 'en';
  }
}

export default MacOSKeyboardHandler;
