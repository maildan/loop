// 🔥 기가차드 범용 언어 감지기 - 플랫폼 독립적 Fallback 감지기!

import { BaseLanguageDetector } from './base/BaseLanguageDetector';
import { Logger } from '../../../shared/logger';
import { UiohookKeyboardEvent, LanguageDetectionResult } from '../../../shared/types';
import { SupportedLanguage } from './types/CommonTypes';

// 🔥 중앙화된 키코드 매핑 import
import { 
  FALLBACK_HANGUL_KEYCODES, 
  ENGLISH_KEYCODES,
  NUMBER_KEYCODES,
  SPECIAL_KEYCODES
} from './types/KeycodeMappings';

// 🔥 키 버퍼 이벤트
interface KeyBufferEvent {
  keycode: number;
  timestamp: number;
}

/**
 * 🔥 FallbackLanguageDetector - 범용 언어 감지기 (Fallback)
 * 플랫폼에 관계없이 동작하는 기본 언어 감지 시스템
 * 키코드 패턴 분석 + 간단한 휴리스틱 기반
 */
export class FallbackLanguageDetector extends BaseLanguageDetector {
  // 🔥 키 버퍼 (패턴 분석용)
  private keyBuffer: KeyBufferEvent[] = [];
  private readonly BUFFER_SIZE = 15;

  constructor() {
    super('FALLBACK_LANGUAGE_DETECTOR');
  }

  protected getPlatformName(): string {
    return 'Fallback';
  }

  /**
   * 🔥 BaseManager 추상 메서드 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Fallback 언어 감지기 초기화');
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Fallback 언어 감지기 시작');
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Fallback 언어 감지기 중지');
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Fallback 언어 감지기 정리');
    this.keyBuffer = [];
  }

  /**
   * 🔥 메인 언어 감지 엔트리포인트
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();
    this.detectionCount++;
    
    try {
      Logger.debug(this.componentName, '🔥 범용 언어 감지 시작', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        currentLanguage: this.currentLanguage
      });
      
      // 키 버퍼에 추가
      this.addToBuffer(rawEvent);
      
      // 🔥 1단계: 특수키 필터링
      const specialKeyResult = this.handleSpecialKeys(rawEvent);
      if (specialKeyResult) {
        return this.finalizeResult(specialKeyResult, startTime);
      }
      
      // 🔥 2단계: 키코드 기반 언어 감지
      const keycodeResult = this.detectByKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.7) {
        return this.finalizeResult(keycodeResult, startTime);
      }
      
      // 🔥 3단계: 패턴 분석 기반 감지
      const patternResult = this.detectByPattern();
      if (patternResult.confidence >= 0.6) {
        return this.finalizeResult(patternResult, startTime);
      }
      
      // 🔥 4단계: 폴백 처리
      return this.finalizeResult(this.createFallbackResult(), startTime);
      
    } catch (error) {
      Logger.error(this.componentName, '범용 언어 감지 에러', error);
      return this.finalizeResult(this.createErrorResult(), startTime);
    }
  }

  /**
   * 🔥 특수키 처리
   */
  private handleSpecialKeys(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult | null {
    const { keycode } = rawEvent;
    
    // 제어문자
    if (keycode <= 31 || keycode === 127) {
      return {
        language: 'en',
        confidence: 0.9,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          reason: 'control-character'
        }
      };
    }
    
    // 기능키들
    const functionKeys = new Set([
      112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, // F1-F12
      37, 38, 39, 40, // Arrow keys
      33, 34, 35, 36, // PageUp, PageDown, End, Home
      45, 46, // Insert, Delete
      16, 17, 18, // Shift, Ctrl, Alt
      91, 92, 93, // Windows keys
      144, 145 // NumLock, ScrollLock
    ]);
    
    if (functionKeys.has(keycode)) {
      return {
        language: this.currentLanguage,
        confidence: 0.8,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          reason: 'function-key-maintain'
        }
      };
    }
    
    return null;
  }

  /**
   * 🔥 키코드 기반 언어 감지
   */
  private detectByKeycode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;
    
    // 한글 키 범위 확인
    if (FALLBACK_HANGUL_KEYCODES.has(keycode)) {
      return {
        language: 'ko',
        confidence: 0.75,
        method: 'keycode',
        isComposing: true,
        metadata: { 
          keycode,
          reason: 'hangul-keycode-range'
        }
      };
    }
    
    // 영어 알파벳 확인
    if (keychar && ((keychar >= 65 && keychar <= 90) || (keychar >= 97 && keychar <= 122))) {
      return {
        language: 'en',
        confidence: 0.8,
        method: 'character',
        isComposing: false,
        detectedChar: String.fromCharCode(keychar),
        metadata: { 
          keycode,
          keychar,
          reason: 'english-alphabet'
        }
      };
    }
    
    // 숫자 키 (0-9)
    if (keycode >= 48 && keycode <= 57) {
      return {
        language: this.currentLanguage,
        confidence: 0.6,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          reason: 'number-key-maintain'
        }
      };
    }
    
    // 기타 키들
    return {
      language: this.currentLanguage,
      confidence: 0.4,
      method: 'keycode',
      isComposing: false,
      metadata: { 
        keycode,
        reason: 'keycode-unknown'
      }
    };
  }

  /**
   * 🔥 패턴 분석 기반 언어 감지
   */
  private detectByPattern(): LanguageDetectionResult {
    if (this.keyBuffer.length < 3) {
      return {
        language: this.currentLanguage,
        confidence: 0.4,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'insufficient-buffer' }
      };
    }
    
    // 최근 키들의 한글/영어 비율 계산
    let hangulCount = 0;
    let englishCount = 0;
    const recentKeys = this.keyBuffer.slice(-8);
    
    for (const keyEvent of recentKeys) {
      if (FALLBACK_HANGUL_KEYCODES.has(keyEvent.keycode)) {
        hangulCount++;
      } else if (ENGLISH_KEYCODES.has(keyEvent.keycode)) {
        englishCount++;
      }
    }
    
    const totalCount = hangulCount + englishCount;
    if (totalCount === 0) {
      return {
        language: this.currentLanguage,
        confidence: 0.3,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'no-alphabet-keys' }
      };
    }
    
    const hangulRatio = hangulCount / totalCount;
    
    if (hangulRatio >= 0.7) {
      return {
        language: 'ko',
        confidence: 0.7,
        method: 'pattern',
        isComposing: true,
        metadata: { reason: 'pattern-korean-dominant' }
      };
    } else if (hangulRatio <= 0.3) {
      return {
        language: 'en',
        confidence: 0.65,
        method: 'pattern',
        isComposing: false,
        metadata: { reason: 'pattern-english-dominant' }
      };
    }
    
    return {
      language: this.currentLanguage,
      confidence: 0.5,
      method: 'pattern',
      isComposing: false,
      metadata: { reason: 'pattern-mixed' }
    };
  }

  /**
   * 🔥 키 버퍼에 추가
   */
  private addToBuffer(rawEvent: UiohookKeyboardEvent): void {
    const keyEvent: KeyBufferEvent = {
      keycode: rawEvent.keycode,
      timestamp: Date.now()
    };
    
    this.keyBuffer.push(keyEvent);
    
    if (this.keyBuffer.length > this.BUFFER_SIZE) {
      this.keyBuffer.shift();
    }
  }

  /**
   * 🔥 결과 최종화
   */
  protected finalizeResult(result: LanguageDetectionResult, startTime: number): LanguageDetectionResult {
    const processingTime = performance.now() - startTime;
    this.totalProcessingTime += processingTime;
    
    // 신뢰도가 높을 때만 언어 변경
    if (result.confidence >= 0.7 && result.language !== this.currentLanguage) {
      this.currentLanguage = result.language as 'ko' | 'en' | 'ja' | 'zh';
    }
    
    Logger.debug(this.componentName, '범용 언어 감지 완료', {
      language: result.language,
      confidence: result.confidence,
      method: result.method,
      processingTime: `${processingTime.toFixed(3)}ms`
    });
    
    return result;
  }

  /**
   * 🔥 폴백 결과 생성
   */
  private createFallbackResult(): LanguageDetectionResult {
    return {
      language: this.currentLanguage,
      confidence: 0.3,
      method: 'fallback',
      isComposing: false,
      metadata: { reason: 'universal-fallback' }
    };
  }

  /**
   * 🔥 에러 결과 생성
   */
  private createErrorResult(): LanguageDetectionResult {
    return {
      language: this.currentLanguage,
      confidence: 0.2,
      method: 'fallback',
      isComposing: false,
      metadata: { reason: 'detection-error' }
    };
  }

  // 🔥 공개 메서드들
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    this.keyBuffer = [];
    Logger.info(this.componentName, '범용 언어 수동 설정', { language });
  }

  public getPerformanceStats(): {
    platform: 'fallback';
    detectionCount: number;
    averageProcessingTime: number;
    bufferSize: number;
    currentLanguage: SupportedLanguage;
  } {
    return {
      platform: 'fallback',
      detectionCount: this.detectionCount,
      averageProcessingTime: this.detectionCount > 0 ? 
        this.totalProcessingTime / this.detectionCount : 0,
      bufferSize: this.keyBuffer.length,
      currentLanguage: this.currentLanguage
    };
  }

  public async healthCheck(): Promise<{
    healthy: boolean;
    lastError?: string;
    performance: ReturnType<FallbackLanguageDetector['getPerformanceStats']>;
  }> {
    try {
      const stats = this.getPerformanceStats();
      
      return {
        healthy: true,
        performance: stats
      };
    } catch (error) {
      return {
        healthy: false,
        lastError: error instanceof Error ? error.message : String(error),
        performance: this.getPerformanceStats()
      };
    }
  }
}

export const fallbackLanguageDetector = new FallbackLanguageDetector();
export default fallbackLanguageDetector;
