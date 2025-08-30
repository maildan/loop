// 🔥 기가차드 키보드 이벤트 프로세서 - 이벤트 처리 및 변환 전문

import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import type { 
  ProcessedKeyboardEvent, 
  UiohookKeyboardEvent,
  HangulCompositionResult,
  LanguageDetectionResult 
} from '../../shared/types';
import { HangulComposer } from '../keyboard/HangulComposer';
import { UnifiedLanguageDetector } from '../keyboard/detectors/UnifiedLanguageDetector';
import { WindowTracker } from '../keyboard/WindowTracker';
import MacOSKeyboardHandler from '../handlers/MacOSKeyboardHandler';

/**
 * 🔥 KeyboardEventProcessor - 키보드 이벤트 처리 및 변환 전문 서비스
 * 
 * 책임:
 * - Raw uIOhook 이벤트를 ProcessedKeyboardEvent로 변환
 * - 플랫폼별 이벤트 처리 (macOS 특별 처리)
 * - 한글 조합 처리
 * - 언어 감지 및 적용
 * - 윈도우 정보 통합
 */
export class KeyboardEventProcessor {
  private readonly componentName = 'KEYBOARD_EVENT_PROCESSOR';
  
  // 핵심 컴포넌트들
  private hangulComposer: HangulComposer;
  private languageDetector: UnifiedLanguageDetector;
  private windowTracker: WindowTracker | null = null;
  private macOSHandler: MacOSKeyboardHandler | null = null;
  
  // 성능 및 상태 관리
  private eventBuffer: ProcessedKeyboardEvent[] = [];
  private readonly maxBufferSize = 1000;
  private isProcessing = false;
  
  // 언어 감지 최적화
  private englishKeySequence: string[] = [];
  private readonly englishSwitchThreshold = 5;

  constructor() {
    Logger.info(this.componentName, '키보드 이벤트 프로세서 초기화됨');
    
    // 핵심 컴포넌트 초기화
    this.hangulComposer = new HangulComposer();
    this.languageDetector = new UnifiedLanguageDetector();
    
    // macOS 전용 핸들러 (macOS에서만 생성)
    if (Platform.isMacOS()) {
      this.macOSHandler = new MacOSKeyboardHandler(this.windowTracker);
    }
  }

  /**
   * 🔥 초기화
   */
  public async initialize(): Promise<void> {
    try {
      Logger.info(this.componentName, '키보드 이벤트 프로세서 초기화 시작');
      
      // 윈도우 트래커 초기화
      this.windowTracker = new WindowTracker();
      await this.windowTracker.initialize();
      
      // macOS 핸들러 업데이트
      if (this.macOSHandler) {
        this.macOSHandler = new MacOSKeyboardHandler(this.windowTracker);
      }
      
      // 한글 조합기 초기화
      await this.hangulComposer.initialize();
      await this.hangulComposer.start();
      
      // 언어 감지기 초기화
      await this.languageDetector.initialize();
      
      Logger.info(this.componentName, '키보드 이벤트 프로세서 초기화 완료');
      
    } catch (error) {
      Logger.error(this.componentName, '키보드 이벤트 프로세서 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 정리
   */
  public async cleanup(): Promise<void> {
    try {
      Logger.info(this.componentName, '키보드 이벤트 프로세서 정리 시작');
      
      // 컴포넌트 정리
      if (this.hangulComposer) {
        await this.hangulComposer.cleanup();
      }
      
      if (this.languageDetector) {
        await this.languageDetector.cleanup();
      }
      
      if (this.windowTracker) {
        await this.windowTracker.cleanup();
      }
      
      // 버퍼 정리
      this.eventBuffer = [];
      
      Logger.info(this.componentName, '키보드 이벤트 프로세서 정리 완료');
      
    } catch (error) {
      Logger.error(this.componentName, '키보드 이벤트 프로세서 정리 실패', error);
    }
  }

  /**
   * 🔥 키 이벤트 처리 (메인 진입점)
   */
  public async processKeyEvent(
    type: 'keydown' | 'keyup', 
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent | null> {
    if (this.isProcessing) {
      Logger.debug(this.componentName, '이벤트 처리 중이므로 스킵', { type, keycode: rawEvent.keycode });
      return null;
    }

    this.isProcessing = true;
    
    try {
      const startTime = Date.now();
      
      // 🔥 플랫폼별 처리 분기
      let processedEvent: ProcessedKeyboardEvent | null = null;
      
      if (Platform.isMacOS() && this.macOSHandler) {
        // macOS: 전용 핸들러 사용 (IME 충돌 방지)
        processedEvent = await this.macOSHandler.handleMacOSKeyEvent(type, rawEvent);
      } else {
        // 다른 플랫폼: 기존 로직 사용 (한글 조합기 포함)
        processedEvent = await this.processWithComposer(type, rawEvent);
      }
      
      if (processedEvent) {
        // 처리 시간 추가 (타입 안전하게)
        const eventWithTiming = {
          ...processedEvent,
          processingTime: Date.now() - startTime
        };
        
        // 이벤트 버퍼에 추가
        this.addToBuffer(eventWithTiming);
        
        Logger.debug(this.componentName, '키 이벤트 처리 완료', {
          type,
          key: eventWithTiming.key,
          language: eventWithTiming.language,
          processingTime: eventWithTiming.processingTime
        });
      }
      
      return processedEvent;
      
    } catch (error) {
      Logger.error(this.componentName, '키 이벤트 처리 중 오류', error);
      return null;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 🔥 한글 조합기 사용 처리 (macOS 외 플랫폼)
   */
  private async processWithComposer(
    type: 'keydown' | 'keyup',
    rawEvent: UiohookKeyboardEvent
  ): Promise<ProcessedKeyboardEvent | null> {
    try {
      const char = String.fromCharCode(rawEvent.keychar || 0);
      const windowInfo = this.windowTracker?.getCurrentWindow() || {
        title: 'Unknown',
        processName: 'Unknown'
      };
      
      // 언어 감지
      const detectionResult = await this.languageDetector.detectLanguage(rawEvent);
      const detectedLanguage = detectionResult?.language || 'en';
      
      // 한글 조합 처리 (한글로 감지된 경우만)
      let compositionResult: HangulCompositionResult | null = null;
      if (detectedLanguage === 'ko' && type === 'keydown') {
        compositionResult = this.hangulComposer.processKeyString(char);
      }
      
      // 최종 문자 결정
      const finalChar = compositionResult?.completed || 
                       compositionResult?.composing || 
                       char;
      
      const processedEvent: ProcessedKeyboardEvent = {
        key: finalChar,
        code: `Key${rawEvent.keycode}`,
        keycode: rawEvent.keycode,
        keychar: finalChar,
        timestamp: Date.now(),
        type: type as 'keydown' | 'keyup' | 'input',
        windowTitle: windowInfo.title || 'Unknown',
        language: detectedLanguage,
        composedChar: finalChar,
        isComposing: (compositionResult?.composing || '').length > 0,
        inputMethod: detectedLanguage === 'ko' ? 'composition' : 'direct',
        processingTime: 0
      };
      
      // 영어 키 시퀀스 감지 (자동 언어 전환)
      this.updateEnglishSequence(processedEvent);
      
      return processedEvent;
      
    } catch (error) {
      Logger.error(this.componentName, '한글 조합 처리 중 오류', error);
      return null;
    }
  }

  /**
   * 🔥 영어 키 시퀀스 업데이트 (자동 언어 전환)
   */
  private updateEnglishSequence(event: ProcessedKeyboardEvent): void {
    if (event.language === 'en') {
      this.englishKeySequence.push(event.key);
      
      // 최대 길이 유지
      if (this.englishKeySequence.length > this.englishSwitchThreshold * 2) {
        this.englishKeySequence = this.englishKeySequence.slice(-this.englishSwitchThreshold);
      }
      
      // 연속 영어 입력 감지
      if (this.englishKeySequence.length >= this.englishSwitchThreshold) {
        Logger.debug(this.componentName, '연속 영어 입력 감지됨', {
          sequence: this.englishKeySequence.slice(-this.englishSwitchThreshold).join('')
        });
        
        // 한글 조합 상태 리셋
        this.hangulComposer.resetComposition();
      }
    } else {
      // 한글 입력 시 영어 시퀀스 리셋
      this.englishKeySequence = [];
    }
  }

  /**
   * 🔥 이벤트 버퍼에 추가
   */
  private addToBuffer(event: ProcessedKeyboardEvent): void {
    this.eventBuffer.push(event);
    
    // 버퍼 크기 제한
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer.shift();
    }
  }

  /**
   * 🔥 최근 이벤트 조회
   */
  public getRecentEvents(count = 10): ProcessedKeyboardEvent[] {
    return this.eventBuffer.slice(-count);
  }

  /**
   * 🔥 이벤트 버퍼 통계
   */
  public getBufferStats(): {
    totalEvents: number;
    languageDistribution: Record<string, number>;
    averageProcessingTime: number;
    compositionEvents: number;
  } {
    const languageDistribution: Record<string, number> = {};
    let totalProcessingTime = 0;
    let compositionEvents = 0;
    
    for (const event of this.eventBuffer) {
      // 언어 분포
      languageDistribution[event.language] = (languageDistribution[event.language] || 0) + 1;
      
      // 처리 시간
      totalProcessingTime += event.processingTime || 0;
      
      // 조합 이벤트
      if (event.isComposing) {
        compositionEvents++;
      }
    }
    
    return {
      totalEvents: this.eventBuffer.length,
      languageDistribution,
      averageProcessingTime: this.eventBuffer.length > 0 ? totalProcessingTime / this.eventBuffer.length : 0,
      compositionEvents
    };
  }

  /**
   * 🔥 버퍼 클리어
   */
  public clearBuffer(): void {
    this.eventBuffer = [];
    Logger.debug(this.componentName, '이벤트 버퍼 클리어됨');
  }

  /**
   * 🔥 언어 수동 설정
   */
  public setLanguage(language: string): void {
    // 한글 조합 상태 리셋
    if (language !== 'ko') {
      this.hangulComposer.resetComposition();
    }
    
    // 영어 시퀀스 리셋
    this.englishKeySequence = [];
    
    Logger.info(this.componentName, '언어 수동 설정됨', { language });
  }

  /**
   * 🔥 조합 상태 리셋
   */
  public resetComposition(): void {
    this.hangulComposer.resetComposition();
    this.englishKeySequence = [];
    Logger.debug(this.componentName, '조합 상태 리셋됨');
  }

  /**
   * 🔥 헬스 체크
   */
  public getHealthStatus(): {
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
      isInitialized: this.windowTracker !== null,
      bufferSize: this.eventBuffer.length,
      isProcessing: this.isProcessing,
      componentsHealth: {
        hangulComposer: this.hangulComposer !== null,
        languageDetector: this.languageDetector !== null,
        windowTracker: this.windowTracker !== null,
        macOSHandler: this.macOSHandler !== null
      }
    };
  }
}

export default KeyboardEventProcessor;
