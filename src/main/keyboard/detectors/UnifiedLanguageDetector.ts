// 🔥 기가차드 통합 언어 감지기 - 팩토리 기반 단순화!

import { BaseManager } from '../../common/BaseManager';
import { Logger } from '../../../shared/logger';
import type { UiohookKeyboardEvent, LanguageDetectionResult } from '../../../shared/types';
import type { SupportedLanguage } from './types/CommonTypes';

// 🔥 팩토리 import
import { LanguageDetectorFactory } from './factory/LanguageDetectorFactory';
import type { BaseLanguageDetector } from './base/BaseLanguageDetector';

/**
 * 🔥 통합 언어 감지기 - 팩토리 패턴 기반 단순화
 * 
 * 복잡한 플랫폼 분기 로직을 팩토리로 이관하고
 * 단순한 프록시 역할만 수행
 */
export class UnifiedLanguageDetector extends BaseManager {
  private readonly componentName = 'UNIFIED_LANGUAGE_DETECTOR';
  
  // 🔥 팩토리에서 생성된 실제 감지기
  private detector: BaseLanguageDetector;
  
  // 🔥 통합 성능 추적
  private detectionCount = 0;
  private totalProcessingTime = 0;
  private lastError: string | undefined = undefined;
  private startTime = Date.now();

  constructor() {
    super();
    
    try {
      // 🔥 팩토리에서 플랫폼별 최적 감지기 자동 생성
      this.detector = LanguageDetectorFactory.create();
      
      // null 체크 추가
      if (!this.detector) {
        throw new Error('LanguageDetectorFactory가 null을 반환했습니다');
      }
      
      Logger.info(this.componentName, '통합 언어 감지기 초기화 완료', {
        detectorType: this.detector?.constructor?.name || 'Unknown',
        factoryInfo: LanguageDetectorFactory.getInfo()
      });
    } catch (error) {
      Logger.error(this.componentName, '감지기 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 BaseManager 추상 메서드 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, '통합 언어 감지기 초기화 시작');
    
    try {
      await this.detector.initialize();
      Logger.info(this.componentName, '하위 감지기 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, '하위 감지기 초기화 실패', error);
      this.lastError = String(error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, '통합 언어 감지기 시작');
    if (this.detector) {
      await this.detector.start();
    }
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, '통합 언어 감지기 중지');
    if (this.detector) {
      await this.detector.stop();
    }
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, '통합 언어 감지기 정리');
    if (this.detector) {
      await this.detector.cleanup();
    }
  }

  /**
   * 🔥 메인 언어 감지 메서드 (프록시)
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();
    this.detectionCount++;

    try {
      // 🔥 감지기 초기화 확인
      if (!this.detector) {
        throw new Error('언어 감지기가 초기화되지 않았습니다');
      }

      // 🔥 실제 감지기에 위임
      const result = await this.detector.detectLanguage(rawEvent);
      
      // 🔥 성능 추적 업데이트
      const processingTime = performance.now() - startTime;
      this.totalProcessingTime += processingTime;
      
      Logger.debug(this.componentName, '언어 감지 완료', {
        language: result.language,
        confidence: result.confidence,
        method: result.method,
        processingTime: `${processingTime.toFixed(2)}ms`
      });

      return result;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      this.totalProcessingTime += processingTime;
      this.lastError = String(error);
      
      Logger.error(this.componentName, '언어 감지 에러', error);
      
      // 🔥 에러 시 안전한 기본값 반환
      return {
        language: 'en',
        confidence: 0.1,
        method: 'fallback',
        isComposing: false,
        metadata: {
          error: String(error),
          processingTime: `${processingTime.toFixed(2)}ms`
        }
      };
    }
  }

  /**
   * 🔥 현재 언어 반환 (프록시)
   */
  public getCurrentLanguage(): SupportedLanguage {
    if (!this.detector) {
      Logger.warn(this.componentName, '감지기가 초기화되지 않음, 기본값 반환');
      return 'en';
    }
    return this.detector.getCurrentLanguage();
  }

  /**
   * 🔥 언어 설정 (프록시)
   */
  public setLanguage(language: SupportedLanguage): void {
    if (!this.detector) {
      Logger.warn(this.componentName, '감지기가 초기화되지 않음, 언어 설정 무시');
      return;
    }
    // 🔥 확장된 언어를 기본 언어로 매핑
    const mappedLanguage = this.mapToSupportedLanguage(language);
    this.detector.setLanguage(mappedLanguage);
    Logger.info(this.componentName, `언어 설정 변경: ${language}`);
  }

  /**
   * 🔥 통합 성능 통계
   */
  public getPerformanceStats() {
    const detectorStats = this.detector?.getPerformanceStats?.() || undefined;
    const factoryInfo = LanguageDetectorFactory.getInfo();
    
    return {
      // 🔥 통합 레이어 통계
      unified: {
        detectionCount: this.detectionCount,
        averageProcessingTime: this.detectionCount > 0 ? 
          this.totalProcessingTime / this.detectionCount : 0,
        lastError: this.lastError,
        uptime: Date.now() - this.startTime
      },
      
      // 🔥 실제 감지기 통계
      detector: detectorStats,
      
      // 🔥 팩토리 정보
      factory: factoryInfo
    };
  }

  /**
   * 🔥 헬스체크 (BaseManager 인터페이스 구현)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
  }> {
    try {
      if (!this.detector) {
        return {
          healthy: false,
          lastError: '감지기가 초기화되지 않음'
        };
      }

      const detectorHealth = typeof this.detector.healthCheck === 'function' 
        ? await this.detector.healthCheck() 
        : { healthy: true };

      const uptime = Date.now() - this.startTime;
      const isHealthy = detectorHealth.healthy && this.lastError === undefined;

      return {
        healthy: isHealthy,
        uptime,
        lastError: this.lastError
      };

    } catch (error) {
      Logger.error(this.componentName, '헬스체크 실패', error);
      return {
        healthy: false,
        lastError: String(error)
      };
    }
  }

  /**
   * 🔥 감지기 재시작 (BaseManager 인터페이스 구현)
   */
  public async restart(): Promise<boolean> {
    Logger.info(this.componentName, '감지기 재시작 시작');
    
    try {
      await this.detector.stop();
      await this.detector.cleanup();
      
      // 🔥 새로운 감지기 생성
      this.detector = LanguageDetectorFactory.create();
      await this.detector.initialize();
      await this.detector.start();
      
      this.lastError = undefined;
      Logger.info(this.componentName, '감지기 재시작 완료');
      
      return true;
    } catch (error) {
      this.lastError = String(error);
      Logger.error(this.componentName, '감지기 재시작 실패', error);
      return false;
    }
  }

  /**
   * 🔥 확장된 언어를 기본 지원 언어로 매핑
   */
  private mapToSupportedLanguage(language: SupportedLanguage): 'ko' | 'en' | 'ja' | 'zh' {
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

// 🔥 기본 export만 유지 (테스트 시 singleton 문제 방지)
export default UnifiedLanguageDetector;
