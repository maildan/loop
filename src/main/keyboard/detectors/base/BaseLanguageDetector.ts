// 🔥 기가차드 Base 언어 감지기 - 모든 플랫폼 공통 인터페이스!

import { BaseManager } from '../../../common/BaseManager';
import { Logger } from '../../../../shared/logger';
import type { 
  UiohookKeyboardEvent, 
  LanguageDetectionResult 
} from '../../../../shared/types';
import type { SupportedLanguage } from '../types/CommonTypes';

/**
 * 🔥 BaseLanguageDetector - 모든 플랫폼 언어 감지기의 공통 인터페이스
 * 
 * 플랫폼별 구현체들이 상속받아야 하는 기본 클래스
 * - macOS: NSTextInputContext + HIToolbox API
 * - Windows: GetKeyboardLayout + IME API  
 * - Linux: IBus/XIM 통합
 */
export abstract class BaseLanguageDetector extends BaseManager {
  protected readonly componentName: string;
  protected currentLanguage: SupportedLanguage = 'en';
  protected detectionCount = 0;
  protected totalProcessingTime = 0;
  
  constructor(componentName: string) {
    super();
    this.componentName = componentName;
  }

  /**
   * 🔥 메인 언어 감지 메서드 (플랫폼별 구현 필수)
   */
  public abstract detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult>;

  /**
   * 🔥 현재 언어 반환
   */
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * 🔥 언어 수동 설정
   */
  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    Logger.info(this.componentName, 'Language manually set', { language });
  }

  /**
   * 🔥 성능 통계 반환 (플랫폼별 확장 가능)
   */
  public getPerformanceStats(): {
    platform: string;
    detectionCount: number;
    averageProcessingTime: number;
    currentLanguage: SupportedLanguage;
  } {
    return {
      platform: this.getPlatformName(),
      detectionCount: this.detectionCount,
      averageProcessingTime: this.detectionCount > 0 ? 
        this.totalProcessingTime / this.detectionCount : 0,
      currentLanguage: this.currentLanguage
    };
  }

  /**
   * 🔥 플랫폼 이름 반환 (하위 클래스에서 구현)
   */
  protected abstract getPlatformName(): string;

  /**
   * 🔥 결과 최종화 및 성능 측정 (공통 로직)
   */
  protected finalizeResult(result: LanguageDetectionResult, startTime: number): LanguageDetectionResult {
    const processingTime = performance.now() - startTime;
    
    this.detectionCount++;
    this.totalProcessingTime += processingTime;
    
    // 신뢰도 임계값 (0.6 이상일 때만 언어 변경)
    if (result.confidence >= 0.6) {
      // 🔥 지원하는 언어만 허용 (확장된 언어는 기본 4개로 매핑)
      const supportedLang = this.mapToSupportedLanguage(result.language);
      this.currentLanguage = supportedLang;
    }
    
    Logger.debug(this.componentName, 'Language detection completed', {
      platform: this.getPlatformName(),
      language: result.language,
      confidence: result.confidence,
      method: result.method,
      processingTime: `${processingTime.toFixed(3)}ms`,
      averageTime: `${(this.totalProcessingTime / this.detectionCount).toFixed(3)}ms`
    });
    
    return result;
  }

  /**
   * 🔥 초기화 (플랫폼별 초기화 로직)
   */
  public async initialize(): Promise<boolean> {
    const result = await super.initialize();
    Logger.info(this.componentName, `${this.getPlatformName()} language detector initialized`);
    return result;
  }

  /**
   * 🔥 정리 (플랫폼별 정리 로직)
   */
  public async cleanup(): Promise<void> {
    await super.cleanup();
    Logger.info(this.componentName, `${this.getPlatformName()} language detector cleaned up`);
  }

  /**
   * 🔥 확장된 언어를 기본 지원 언어로 매핑
   */
  protected mapToSupportedLanguage(language: SupportedLanguage): 'ko' | 'en' | 'ja' | 'zh' {
    // 기본 지원 언어는 그대로 반환
    if (['ko', 'en', 'ja', 'zh'].includes(language)) {
      return language as 'ko' | 'en' | 'ja' | 'zh';
    }
    
    // 확장 언어들을 기본 언어로 매핑
    switch (language) {
      case 'es': // 스페인어 → 영어
      case 'fr': // 프랑스어 → 영어  
      case 'de': // 독일어 → 영어
      default:
        return 'en';
    }
  }
}

export default BaseLanguageDetector;
