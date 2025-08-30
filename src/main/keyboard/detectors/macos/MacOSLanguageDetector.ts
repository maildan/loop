// 🔥 기가차드 macOS 전용 언어 감지기 - HIToolbox + 실시간 키코드 변환!

import { exec } from 'child_process';
import { BaseLanguageDetector } from '../base/BaseLanguageDetector';
import { Platform } from '../../../utils/platform';
import { Logger } from '../../../../shared/logger';
import { MacOSKeycodeTranslator } from './MacOSKeycodeTranslator';
import type { 
  UiohookKeyboardEvent, 
  LanguageDetectionResult 
} from '../../../../shared/types';
import {
  MacOSInputSourceType,
  MacOSModifiers,
  MacOSTranslationResult,
  DetectionMetadata,
  SupportedLanguage,
  HangulType
} from '../types/CommonTypes';

// 🔥 공통 키코드 매핑 import (폴백용)
import { 
  MACOS_HANGUL_KEYCODES, 
  MACOS_INPUT_SOURCES,
  isHangulKeycode,
  isEnglishKeycode 
} from '../types/KeycodeMappings';

/**
 * 🔥 MacOSLanguageDetector - macOS 네이티브 API 전용 언어 감지기
 * 
 * macOS 전용 최적화:
 * - HIToolbox AppleCurrentKeyboardLayoutInputSourceID
 * - 실시간 TIS API 키코드 변환 (MacOSKeycodeTranslator)
 * - NSTextInputContext 상태 감지
 * - IME 조합 상태 실시간 추적
 */
export class MacOSLanguageDetector extends BaseLanguageDetector {
  // 🔥 macOS 전용 시스템 입력소스 캐시 (확장된 언어 지원)
  private systemInputSourceCache: MacOSInputSourceType = null;
  private lastSystemCheck = 0;
  private readonly SYSTEM_CHECK_INTERVAL = 200; // 🔥 2024-25년 최적화: 200ms
  private systemCheckInProgress = false;
  
  // 🔥 실시간 키코드 변환기
  private keycodeTranslator: MacOSKeycodeTranslator;

  constructor() {
    super('MACOS_LANGUAGE_DETECTOR');
    
    // 🔥 실시간 키코드 변환기 초기화
    this.keycodeTranslator = MacOSKeycodeTranslator.getInstance();
    
    // 🔥 테스트 환경에서는 플랫폼 검증 스킵
    if (process.env.NODE_ENV !== 'test' && !Platform.isMacOS()) {
      throw new Error('MacOSLanguageDetector는 macOS에서만 사용할 수 있습니다');
    }
  }

  protected getPlatformName(): string {
    return 'macOS';
  }

  /**
   * 🔥 macOS 메인 언어 감지 메서드 - 실시간 키코드 변환 통합
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();

    try {
      Logger.debug(this.componentName, '🔥 macOS 네이티브 언어 감지 시작 (실시간 변환)', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage,
        // 🔥 A번 접근법 테스트 정보 추가
        hasKeychar: !!rawEvent.keychar,
        keycharString: rawEvent.keychar ? String.fromCharCode(rawEvent.keychar) : 'null',
        isHangulRange: rawEvent.keychar ? (rawEvent.keychar >= 0xAC00 && rawEvent.keychar <= 0xD7AF) : false,
        isLatinRange: rawEvent.keychar ? ((rawEvent.keychar >= 32 && rawEvent.keychar <= 126) || (rawEvent.keychar >= 160 && rawEvent.keychar <= 255)) : false
      });

      // 🔥 0순위: 특수 문자 및 제어 문자 사전 필터링
      if (this.isSpecialOrControlKey(rawEvent.keycode, rawEvent.keychar)) {
        Logger.debug(this.componentName, '🔥 특수/제어 문자 감지 - 현재 언어 유지', {
          keycode: rawEvent.keycode,
          keychar: rawEvent.keychar,
          reason: 'special-control-char-filtered'
        });
        
        return this.finalizeResult({
          language: this.currentLanguage,
          confidence: 0.95,
          method: 'special-char-mapping',
          isComposing: false,
          metadata: {
            keycode: rawEvent.keycode,
            keychar: rawEvent.keychar,
            reason: 'special-control-char-filtered'
          }
        }, startTime);
      }

      // 🔥 1순위: 시스템 입력소스 직접 조회 (macOS IME 상태 우선)
      const systemResult = await this.detectBySystemInputSource(startTime);
      if (systemResult && systemResult.confidence >= 0.95) {
        // 🔥 한글 IME 활성 시 영어 키 무시
        if (systemResult.language === 'ko' && this.isEnglishKeycode(rawEvent.keychar)) {
          Logger.debug(this.componentName, '🔥 한글 IME 활성 - 영어 키 무시하고 한글 조합 중으로 처리', {
            keycode: rawEvent.keycode,
            keychar: rawEvent.keychar,
            systemLanguage: systemResult.language,
            reason: 'korean-ime-active-ignore-english-key'
          });
          
          return this.finalizeResult({
            language: 'ko',
            confidence: 0.95,
            method: 'ime',
            isComposing: true,
            metadata: {
              keycode: rawEvent.keycode,
              keychar: rawEvent.keychar,
              systemLanguage: systemResult.language,
              reason: 'korean-ime-active-composing'
            }
          }, startTime);
        }
        return this.finalizeResult(systemResult, startTime);
      }

      // 🔥 2순위: 실시간 TIS API 키코드 변환 (시스템 감지 실패 시에만)
      const translationResult = await this.detectByRealtimeTranslation(rawEvent, startTime);
      if (translationResult && translationResult.confidence >= 0.9) {
        return this.finalizeResult(translationResult, startTime);
      }

      // 🔥 3순위: macOS 한글 키코드 매핑 (폴백)
      const keycodeResult = this.detectByMacOSKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.7) {
        return this.finalizeResult(keycodeResult, startTime);
      }

      // 🔥 4순위: 현재 언어 유지 (안전장치)
      return this.finalizeResult({
        language: this.currentLanguage,
        confidence: 0.5,
        method: 'fallback',
        isComposing: this.currentLanguage === 'ko',
        metadata: {
          keycode: rawEvent.keycode,
          keychar: rawEvent.keychar,
          reason: 'macos-fallback-maintain-current'
        }
      }, startTime);

    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지 오류', error);
      return this.finalizeResult({
        language: this.currentLanguage,
        confidence: 0.3,
        method: 'fallback',
        isComposing: false,
        metadata: { error: String(error) }
      }, startTime);
    }
  }

  /**
   * 🔥 keychar 우선 활용 기반 언어 감지 (A번 접근법)
   */
  private async detectByRealtimeTranslation(
    rawEvent: UiohookKeyboardEvent, 
    startTime: number
  ): Promise<LanguageDetectionResult | null> {
    try {
      // 🔥 1순위: keychar 직접 활용 (85-90% 케이스, 1ms 속도)
      if (rawEvent.keychar && rawEvent.keychar > 0) {
        const char = String.fromCharCode(rawEvent.keychar);
        
        // 유효한 문자인지 확인
        if (char && char.trim().length > 0) {
          const charCode = rawEvent.keychar;
          
          // 🔥 macOS IME 조합 중 상태 체크 (keychar가 ASCII인데 시스템 입력소스가 다른 언어인 경우)
          const isIMEComposing = await this.checkIMEComposingState(charCode);
          if (isIMEComposing.isComposing) {
            Logger.debug(this.componentName, '🎌 macOS IME 조합 중 감지', {
              keycode: rawEvent.keycode,
              keychar: rawEvent.keychar,
              character: char,
              expectedLanguage: isIMEComposing.language,
              reason: 'ime-composing-detected'
            });
            
            // IME 조합 중이면 예상 언어로 설정하되 낮은 신뢰도
            return {
              language: isIMEComposing.language as SupportedLanguage,
              confidence: 0.7, // 조합 중이므로 낮은 신뢰도
              method: 'ime',
              isComposing: true,
              detectedChar: char, // 현재 입력된 문자 (변환 전)
              metadata: {
                source: 'ime-composing',
                keycode: rawEvent.keycode,
                keychar: rawEvent.keychar,
                processingTime: `${(performance.now() - startTime).toFixed(3)}ms`,
                reason: 'ime-composing-state',
                detectedLanguage: isIMEComposing.language
              }
            };
          }
          
          // 🔥 한글 완성형 범위 체크 (AC00-D7AF)
          if (charCode >= 0xAC00 && charCode <= 0xD7AF) {
            Logger.debug(this.componentName, '✅ keychar 기반 한글 즉시 감지', {
              keycode: rawEvent.keycode,
              keychar: rawEvent.keychar,
              character: char,
              method: 'keychar-direct'
            });
            
            this.currentLanguage = 'ko';
            
            return {
              language: 'ko',
              confidence: 0.98, // keychar 기반이므로 매우 높은 신뢰도
              method: 'native',
              isComposing: false, // 완성형 한글은 조합 완료 상태
              detectedChar: char,
              metadata: {
                source: 'keychar-direct',
                keycode: rawEvent.keycode,
                keychar: rawEvent.keychar,
                processingTime: `${(performance.now() - startTime).toFixed(3)}ms`,
                reason: 'keychar-hangul-complete'
              }
            };
          }
          
          // 🔥 일본어 문자 범위 체크 (히라가나, 카타카나)
          if ((charCode >= 0x3040 && charCode <= 0x309F) || // ひらがな (Hiragana)
              (charCode >= 0x30A0 && charCode <= 0x30FF) || // カタカナ (Katakana)
              (charCode >= 0xFF65 && charCode <= 0xFF9F)) { // Half-width Katakana
            Logger.debug(this.componentName, '✅ keychar 기반 일본어 즉시 감지', {
              keycode: rawEvent.keycode,
              keychar: rawEvent.keychar,
              character: char,
              charCode: charCode.toString(16),
              method: 'keychar-direct'
            });
            
            this.currentLanguage = 'ja';
            
            return {
              language: 'ja',
              confidence: 0.98,
              method: 'native',
              isComposing: false,
              detectedChar: char,
              metadata: {
                source: 'keychar-direct',
                keycode: rawEvent.keycode,
                keychar: rawEvent.keychar,
                processingTime: `${(performance.now() - startTime).toFixed(3)}ms`,
                reason: 'keychar-japanese-hiragana-katakana'
              }
            };
          }
          
          // 🔥 중국어 문자 범위 체크 (CJK 통합 한자)
          if ((charCode >= 0x4E00 && charCode <= 0x9FFF) || // CJK Unified Ideographs
              (charCode >= 0x3400 && charCode <= 0x4DBF) || // CJK Extension A
              (charCode >= 0xF900 && charCode <= 0xFAFF)) { // CJK Compatibility Ideographs
            Logger.debug(this.componentName, '✅ keychar 기반 중국어 즉시 감지', {
              keycode: rawEvent.keycode,
              keychar: rawEvent.keychar,
              character: char,
              charCode: charCode.toString(16),
              method: 'keychar-direct'
            });
            
            this.currentLanguage = 'zh';
            
            return {
              language: 'zh',
              confidence: 0.98,
              method: 'native',
              isComposing: false,
              detectedChar: char,
              metadata: {
                source: 'keychar-direct',
                keycode: rawEvent.keycode,
                keychar: rawEvent.keychar,
                processingTime: `${(performance.now() - startTime).toFixed(3)}ms`,
                reason: 'keychar-chinese-cjk'
              }
            };
          }
          
          // 🔥 영어/라틴 문자 범위 체크 (마지막 우선순위)
          if ((charCode >= 32 && charCode <= 126) || // ASCII
              (charCode >= 160 && charCode <= 255)) { // Latin-1
            Logger.debug(this.componentName, '✅ keychar 기반 영어 즉시 감지', {
              keycode: rawEvent.keycode,
              keychar: rawEvent.keychar,
              character: char,
              method: 'keychar-direct'
            });
            
            this.currentLanguage = 'en';
            
            return {
              language: 'en',
              confidence: 0.95,
              method: 'native',
              isComposing: false,
              detectedChar: char,
              metadata: {
                source: 'keychar-direct',
                keycode: rawEvent.keycode,
                keychar: rawEvent.keychar,
                processingTime: `${(performance.now() - startTime).toFixed(3)}ms`,
                reason: 'keychar-latin-ascii'
              }
            };
          }
          
          Logger.debug(this.componentName, '� keychar 감지됨 (기타 문자)', {
            keycode: rawEvent.keycode,
            keychar: rawEvent.keychar,
            character: char,
            charCode: charCode.toString(16)
          });
        }
      }
      
      // 🔥 2순위: 간소화된 TIS API (keychar 실패 시에만, 10-15% 케이스)
      Logger.debug(this.componentName, '⚠️ keychar 없음 - 간소화된 fallback 사용', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar
      });
      
      // TIS API 대신 기존 키코드 매핑 활용
      const fallbackResult = this.detectByMacOSKeycode(rawEvent);
      if (fallbackResult.confidence >= 0.7) {
        return fallbackResult;
      }

      return null;
    } catch (error) {
      Logger.warn(this.componentName, 'keychar 기반 언어 감지 실패', error);
      return null;
    }
  }

  /**
   * 🔥 macOS 시스템 입력소스 기반 감지 (HIToolbox)
   */
  private async detectBySystemInputSource(startTime: number): Promise<LanguageDetectionResult | null> {
    try {
      const systemLanguage = await this.getCurrentInputSourceFromSystem();
      
      // 🔥 유효한 언어만 설정 (타입 안전성 보장)
      if (systemLanguage && systemLanguage !== null) {
        // MacOSInputSourceType를 기본 지원 언어로 매핑
        const mappedLanguage = this.mapMacOSLanguageToSupported(systemLanguage);
        this.currentLanguage = mappedLanguage;
        
        Logger.debug(this.componentName, '🔥 macOS 시스템 입력소스 감지 성공', {
          systemLanguage,
          confidence: 0.98
        });
        
        return {
          language: systemLanguage as SupportedLanguage,
          confidence: 0.98, // macOS 시스템 레벨이므로 최고 신뢰도
          method: 'system',
          isComposing: systemLanguage === 'ko',
          metadata: {
            source: 'HIToolbox',
            processingTime: `${(performance.now() - startTime).toFixed(3)}ms`
          }
        };
      }
      
      return null;
    } catch (error) {
      Logger.error(this.componentName, 'macOS 시스템 입력소스 감지 실패', error);
      return null;
    }
  }

  /**
   * 🔥 macOS HIToolbox를 통한 현재 입력소스 조회
   */
  private async getCurrentInputSourceFromSystem(): Promise<MacOSInputSourceType> {
    // 캐시된 결과가 유효하면 반환
    const now = Date.now();
    if (this.systemInputSourceCache && 
        now - this.lastSystemCheck < this.SYSTEM_CHECK_INTERVAL) {
      return this.systemInputSourceCache;
    }

    // 이미 진행 중이면 캐시된 값 반환
    if (this.systemCheckInProgress) {
      return this.systemInputSourceCache;
    }

    this.systemCheckInProgress = true;

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.systemCheckInProgress = false;
        this.lastSystemCheck = now;
        Logger.debug(this.componentName, '⚠️ HIToolbox 타임아웃 - 캐시 사용', {
          cachedValue: this.systemInputSourceCache,
          timeoutMs: 200
        });
        resolve(this.systemInputSourceCache);
      }, 200); // 🔥 2024-25년 최적화: 200ms 타임아웃 (성능 개선)

      exec('defaults read com.apple.HIToolbox AppleCurrentKeyboardLayoutInputSourceID', 
        (error, stdout) => {
          clearTimeout(timeout);
          this.systemCheckInProgress = false;
          this.lastSystemCheck = now;

          if (error) {
            Logger.debug(this.componentName, 'HIToolbox 조회 실패', { error: error.message });
            resolve(null);
            return;
          }

          const inputSourceId = stdout.trim();
          
          // 입력소스 ID를 언어로 변환 (확장된 다국어 지원)
          let detectedLanguage: 'ko' | 'en' | 'ja' | 'zh' | null = null;
          for (const [sourceId, lang] of Object.entries(MACOS_INPUT_SOURCES)) {
            if (inputSourceId.includes(sourceId) || inputSourceId.includes(lang)) {
              detectedLanguage = lang as 'ko' | 'en' | 'ja' | 'zh';
              break;
            }
          }

          // 🔥 특별 처리: 다국어 키워드 감지
          const inputSourceLower = inputSourceId.toLowerCase();
          if (inputSourceLower.includes('hangul') || inputSourceLower.includes('korean') || inputSourceLower.includes('2set') || inputSourceLower.includes('3set')) {
            detectedLanguage = 'ko';
          } else if (inputSourceLower.includes('japanese') || inputSourceLower.includes('hiragana') || inputSourceLower.includes('katakana') || inputSourceLower.includes('romaji')) {
            detectedLanguage = 'ja';
          } else if (inputSourceLower.includes('chinese') || inputSourceLower.includes('pinyin') || inputSourceLower.includes('simplified') || inputSourceLower.includes('traditional')) {
            detectedLanguage = 'zh';
          } else if (inputSourceLower.includes('abc') || inputSourceLower.includes('us') || inputSourceLower.includes('british') || inputSourceLower.includes('english')) {
            detectedLanguage = 'en';
          }

          this.systemInputSourceCache = detectedLanguage;

          Logger.debug(this.componentName, '🔥 macOS HIToolbox 입력소스 감지 완료', {
            inputSourceId,
            detectedLanguage,
            confidence: 0.98
          });

          resolve(detectedLanguage);
        });
    });
  }

  /**
   * 🔥 macOS 키코드 기반 감지 (IME 우회) + 특수 문자 필터링
   */
  private detectByMacOSKeycode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;

    // 🔥 제어문자 및 특수문자 필터링
    if (this.isSpecialOrControlKey(keycode, keychar)) {
      return {
        language: this.currentLanguage,
        confidence: 0.8,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode,
          keychar,
          reason: 'macos-special-control-key-filtered'
        }
      };
    }

    // 🔥 한글 키코드 확인 - keycode 우선, keychar 보조
    let hangulChar = MACOS_HANGUL_KEYCODES.get(keycode);
    if (!hangulChar && keychar) {
      hangulChar = MACOS_HANGUL_KEYCODES.get(keychar);
    }
    
    if (hangulChar) {
      Logger.debug(this.componentName, '🔥 macOS 한글 키코드 감지', {
        keycode,
        keychar,
        hangulChar,
        mappedBy: MACOS_HANGUL_KEYCODES.get(keycode) ? 'keycode' : 'keychar'
      });

      return {
        language: 'ko',
        confidence: 0.9,
        method: 'keycode',
        isComposing: true,
        detectedChar: hangulChar,
        metadata: {
          keycode,
          keychar,
          hangulChar,
          mappedBy: MACOS_HANGUL_KEYCODES.get(keycode) ? 'keycode' : 'keychar',
          reason: 'macos-hangul-keycode-mapping'
        }
      };
    }

    // 🔥 현재 입력소스가 한글인 경우 폴백 처리
    if (this.systemInputSourceCache === 'ko') {
      Logger.debug(this.componentName, '⚠️ 폴백: 기존 매핑 방식 사용', {
        keycode,
        pressedKey: keychar ? String.fromCharCode(keychar) : undefined,
        hangulChar: this.fallbackToKoreanChar(keycode, keychar)
      });
      
      const fallbackChar = this.fallbackToKoreanChar(keycode, keychar);
      if (fallbackChar) {
        return {
          language: 'ko',
          confidence: 0.7,
          method: 'fallback',
          isComposing: true,
          detectedChar: fallbackChar,
          metadata: {
            keycode,
            keychar,
            reason: 'macos-korean-fallback-mapping'
          }
        };
      }
    }

    // 영어 키코드 확인 (a-z, A-Z)
    if (keychar && ((keychar >= 97 && keychar <= 122) || (keychar >= 65 && keychar <= 90))) {
      const char = String.fromCharCode(keychar);
      
      return {
        language: 'en',
        confidence: 0.85,
        method: 'character',
        isComposing: false,
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          char,
          reason: 'macos-english-alphabet'
        }
      };
    }

    // 기타 키들은 현재 언어 유지
    return {
      language: this.currentLanguage,
      confidence: 0.7,
      method: 'fallback',
      isComposing: false,
      metadata: {
        keycode,
        keychar,
        reason: 'macos-unknown-key-maintain-current'
      }
    };
  }

  /**
   * 🔥 BaseManager 추상 메서드 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 초기화 시작');
    
    // macOS 플랫폼 검증
    if (!Platform.isMacOS()) {
      Logger.error(this.componentName, 'macOS가 아닌 플랫폼에서 실행 불가');
      throw new Error('macOS 플랫폼에서만 사용 가능');
    }
    
    // 초기 시스템 입력소스 캐시
    try {
      await this.getCurrentInputSourceFromSystem();
      Logger.info(this.componentName, 'macOS 언어 감지기 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, 'macOS 언어 감지기 초기화 실패', error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 시작');
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 중지');
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'macOS 언어 감지기 정리');
    this.systemInputSourceCache = null;
    this.lastSystemCheck = 0;
    this.systemCheckInProgress = false;
  }

  /**
   * 🔥 macOS 전용 추가 메서드들
   */
  public async getInputSourceInfo(): Promise<{
    currentInputSource: string | null;
    availableInputSources: string[];
    lastCacheUpdate: number;
  }> {
    const current = await this.getCurrentInputSourceFromSystem();
    
    return {
      currentInputSource: current,
      availableInputSources: Object.keys(MACOS_INPUT_SOURCES),
      lastCacheUpdate: this.lastSystemCheck
    };
  }

  public getPerformanceStats() {
    return {
      ...super.getPerformanceStats(),
      platform: 'macOS',
      systemCallCount: this.systemCheckInProgress ? 1 : 0,
      cacheStatus: {
        cached: this.systemInputSourceCache,
        lastCheck: this.lastSystemCheck,
        interval: this.SYSTEM_CHECK_INTERVAL
      },
      hangulKeycodeCount: MACOS_HANGUL_KEYCODES.size,
      inputSourceCount: Object.keys(MACOS_INPUT_SOURCES).length
    };
  }

  /**
   * 🔥 새로운 Unicode 범위 기반 감지 시스템
   */
  private detectByUnicodeRange(keychar: number, keycode: number): LanguageDetectionResult {
    const char = String.fromCharCode(keychar);
    const charCode = keychar;

    // 🔥 한글 Unicode 범위들
    if (this.isHangulUnicode(charCode)) {
      const hangulType = this.getHangulType(charCode);
      
      Logger.debug(this.componentName, '🔥 Unicode 한글 감지', { 
        char, charCode, hangulType 
      });

      return {
        language: 'ko',
        confidence: 0.95,
        method: 'unicode',
        isComposing: hangulType !== 'syllable', // 완성형이 아니면 조합 중
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          charCode,
          hangulType,
          reason: 'unicode-hangul-range'
        }
      };
    }

    // 🔥 영어/라틴 Unicode 범위
    if (this.isLatinUnicode(charCode)) {
      return {
        language: 'en',
        confidence: 0.9,
        method: 'unicode',
        isComposing: false,
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          charCode,
          reason: 'unicode-latin-range'
        }
      };
    }

    // 🔥 기타 Unicode (일본어, 중국어 등)
    const otherLanguage = this.detectOtherLanguageByUnicode(charCode);
    if (otherLanguage) {
      return {
        language: 'en', // 현재는 한/영만 지원하므로 영어로 분류
        confidence: 0.8,
        method: 'unicode',
        isComposing: false,
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          charCode,
          detectedLanguage: otherLanguage,
          reason: 'unicode-other-language'
        }
      };
    }

    // Unicode 범위로 감지 실패
    return {
      language: this.currentLanguage,
      confidence: 0.3,
      method: 'fallback',
      isComposing: false,
      metadata: {
        keycode,
        keychar,
        charCode,
        reason: 'unicode-detection-failed'
      }
    };
  }

  /**
   * 🔥 한글 Unicode 범위 체크
   */
  private isHangulUnicode(charCode: number): boolean {
    return (
      // 한글 완성형 (가-힣)
      (charCode >= 0xAC00 && charCode <= 0xD7A3) ||
      // 한글 자모 (ㄱ-ㅎ, ㅏ-ㅣ)
      (charCode >= 0x3131 && charCode <= 0x318E) ||
      // 한글 호환 자모 (호환성)
      (charCode >= 0x3200 && charCode <= 0x321E) ||
      (charCode >= 0x3260 && charCode <= 0x327E)
    );
  }

  /**
   * 🔥 한글 타입 분류
   */
  private getHangulType(charCode: number): 'syllable' | 'consonant' | 'vowel' | 'compat' {
    if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
      return 'syllable'; // 완성형 음절
    }
    if (charCode >= 0x3131 && charCode <= 0x314E) {
      return 'consonant'; // 자음
    }
    if (charCode >= 0x314F && charCode <= 0x3163) {
      return 'vowel'; // 모음
    }
    return 'compat'; // 호환 자모
  }

  /**
   * 🔥 라틴 Unicode 범위 체크
   */
  private isLatinUnicode(charCode: number): boolean {
    return (
      // Basic Latin (ASCII)
      (charCode >= 0x0020 && charCode <= 0x007F) ||
      // Latin-1 Supplement
      (charCode >= 0x00A0 && charCode <= 0x00FF) ||
      // Latin Extended-A
      (charCode >= 0x0100 && charCode <= 0x017F) ||
      // Latin Extended-B
      (charCode >= 0x0180 && charCode <= 0x024F)
    );
  }

  /**
   * 🔥 기타 언어 Unicode 감지
   */
  private detectOtherLanguageByUnicode(charCode: number): string | null {
    // 일본어 (ひらがな, カタカナ)
    if ((charCode >= 0x3040 && charCode <= 0x309F) || 
        (charCode >= 0x30A0 && charCode <= 0x30FF)) {
      return 'ja';
    }
    
    // 중국어 (CJK Unified Ideographs)
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
      return 'zh';
    }
    
    // 아랍어
    if (charCode >= 0x0600 && charCode <= 0x06FF) {
      return 'ar';
    }
    
    // 러시아어 (키릴 문자)
    if (charCode >= 0x0400 && charCode <= 0x04FF) {
      return 'ru';
    }
    
    return null;
  }

  /**
   * 🔥 스마트 추론 시스템 (컨텍스트 기반)
   */
  private detectBySmartInference(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;

    // 🔥 특수키들 처리
    if (this.isSpecialKey(keycode)) {
      return {
        language: this.currentLanguage, // 현재 언어 유지
        confidence: 0.8,
        method: 'inference',
        isComposing: false,
        detectedChar: undefined,
        metadata: {
          keycode,
          keychar,
          reason: 'special-key-maintain-current'
        }
      };
    }

    // 🔥 숫자키 처리 (언어 중립)
    if (this.isNumberKey(keycode)) {
      const numberChar = keychar ? String.fromCharCode(keychar) : undefined;
      return {
        language: this.currentLanguage, // 현재 언어 유지
        confidence: 0.9,
        method: 'inference',
        isComposing: false,
        detectedChar: numberChar,
        metadata: {
          keycode,
          keychar,
          reason: 'number-key-language-neutral'
        }
      };
    }

    // 🔥 기본 추론 (키코드 범위 기반)
    if (keycode >= 16 && keycode <= 50) {
      // 주요 문자 키 범위 - 현재 언어의 확신도 낮춤
      return {
        language: this.currentLanguage,
        confidence: 0.6,
        method: 'inference',
        isComposing: this.currentLanguage === 'ko',
        detectedChar: undefined,
        metadata: {
          keycode,
          keychar,
          reason: 'main-character-key-range-inference'
        }
      };
    }

    // 🔥 최종 폴백
    return {
      language: this.currentLanguage,
      confidence: 0.5,
      method: 'fallback',
      isComposing: false,
      detectedChar: undefined,
      metadata: {
        keycode,
        keychar,
        reason: 'smart-inference-fallback'
      }
    };
  }

  /**
   * 🔥 특수키 체크
   */
  private isSpecialKey(keycode: number): boolean {
    const specialKeys = [
      8,   // Backspace
      9,   // Tab
      13,  // Enter
      16,  // Shift
      17,  // Ctrl
      18,  // Alt
      20,  // Caps Lock
      27,  // Escape
      32,  // Space
      37, 38, 39, 40, // Arrow keys
      112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123 // F1-F12
    ];
    return specialKeys.includes(keycode);
  }

  /**
   * 🔥 숫자키 체크
   */
  private isNumberKey(keycode: number): boolean {
    return (keycode >= 48 && keycode <= 57) || // 0-9
           (keycode >= 96 && keycode <= 105);   // 넘패드 0-9
  }

  /**
   * 🔥 한글 폴백 매핑 (영어 키를 한글로 변환)
   */
  private fallbackToKoreanChar(keycode: number, keychar?: number): string | undefined {
    // 🔥 1순위: keycode 기반 매핑
    if (MACOS_HANGUL_KEYCODES.has(keycode)) {
      return MACOS_HANGUL_KEYCODES.get(keycode);
    }
    
    // 🔥 2순위: 영어 문자를 한글로 매핑 (QWERTY → 두벌식)
    if (keychar) {
      const char = String.fromCharCode(keychar).toLowerCase();
      const qwertyToHangul: Record<string, string> = {
        'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
        'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
        'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
        'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
        'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ',
        'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ'
      };
      
      return qwertyToHangul[char];
    }
    
    return undefined;
  }

  /**
   * 🔥 특수 문자 및 제어 키 필터링 (강화 버전)
   */
  private isSpecialOrControlKey(keycode: number, keychar?: number): boolean {
    // 🔥 제어 문자 키코드
    if (keycode <= 31 || keycode === 127) {
      return true;
    }
    
    // 🔥 숫자키는 한글 입력에서 유효할 수 있으므로 필터링하지 않음
    // 한국어 IME에서 숫자키도 한글로 변환될 수 있음
    
    // 🔥 macOS 시스템 키 (Fn, Command, Option 등)
    const systemKeyCodes = [
      58, 59, 60, 61, 62, 63, 64, 65, // F1-F8
      67, 69, 70, 71, 72, 73, 74, 75, // F9-F16
      55, 54, 58, 61, // Command, Option keys
      56, 60, // Shift keys  
      59, 62, // Control keys
      122, 120, 99, 118, 96, 97, 98, // Special function keys
    ];
    
    if (systemKeyCodes.includes(keycode)) {
      return true;
    }
    
    // 🔥 keychar 기반 특수 문자 필터링 (강화)
    if (keychar) {
      const char = String.fromCharCode(keychar);
      
      // 🔥 숫자 문자 필터링 (0-9)
      if (char >= '0' && char <= '9') {
        Logger.debug(this.componentName, '❌ 숫자 문자 감지 - 한글 처리 제외', { 
          char, 
          charCode: keychar,
          reason: 'number-char-filtered'
        });
        return true;
      }
      
      // 🔥 태국, 아랍, 힌두 등 다른 언어 문자 필터링
      const unicodeValue = keychar;
      
      // 태국어 범위 (U+0E00-U+0E7F)
      if (unicodeValue >= 0x0E00 && unicodeValue <= 0x0E7F) {
        Logger.debug(this.componentName, '🔥 태국어 문자 필터링', { char, charCode: unicodeValue.toString(16) });
        return true;
      }
      
      // 아랍어 범위 (U+0600-U+06FF)
      if (unicodeValue >= 0x0600 && unicodeValue <= 0x06FF) {
        Logger.debug(this.componentName, '🔥 아랍어 문자 필터링', { char, charCode: unicodeValue.toString(16) });
        return true;
      }
      
      // 힌두어 범위 (U+0900-U+097F)
      if (unicodeValue >= 0x0900 && unicodeValue <= 0x097F) {
        Logger.debug(this.componentName, '🔥 힌두어 문자 필터링', { char, charCode: unicodeValue.toString(16) });
        return true;
      }
      
      // 🔥 특수 기호 및 제어 문자
      const specialChars = [
        '๛', // U+0E5B (태국 문자)
        '‍', '‌', '​', '﻿', // Zero-width characters
        '', // 빈 문자
        '\u0000', '\u0001', '\u0002', '\u0003', // NULL, SOH, STX, ETX
        '\u0004', '\u0005', '\u0006', '\u0007', // EOT, ENQ, ACK, BEL
        '\u0008', '\u0009', '\u000A', '\u000B', // BS, HT, LF, VT
        '\u000C', '\u000D', '\u000E', '\u000F', // FF, CR, SO, SI
      ];
      
      if (specialChars.includes(char)) {
        return true;
      }
      
      // Unicode 제어 문자 범위
      const charCode = char.charCodeAt(0);
      if (charCode <= 0x1F || (charCode >= 0x7F && charCode <= 0x9F)) {
        return true;
      }
      
      // 유효하지 않은 Unicode 범위
      if (charCode >= 0xFDD0 && charCode <= 0xFDEF) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 🔥 macOS 언어를 기본 지원 언어로 매핑
   */
  private mapMacOSLanguageToSupported(language: MacOSInputSourceType): 'ko' | 'en' | 'ja' | 'zh' {
    if (!language) return 'en';
    
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

  /**
   * 🔥 macOS IME 조합 중 상태 체크
   * ASCII 문자가 입력되었지만 시스템 입력소스가 다른 언어인 경우 IME 조합 중으로 판단
   */
  private async checkIMEComposingState(charCode: number): Promise<{ isComposing: boolean; language: string }> {
    try {
      // ASCII 범위가 아니면 조합 중이 아님
      if (charCode < 32 || charCode > 126) {
        return { isComposing: false, language: 'en' };
      }
      
      // 현재 시스템 입력소스 확인
      const systemLanguage = this.systemInputSourceCache || await this.getCurrentInputSourceFromSystem();
      
      // 시스템 입력소스가 영어가 아닌 경우 IME 조합 중으로 판단
      if (systemLanguage && systemLanguage !== 'en') {
        return { isComposing: true, language: systemLanguage };
      }
      
      return { isComposing: false, language: 'en' };
    } catch (error) {
      Logger.debug(this.componentName, 'IME 조합 상태 체크 실패', error);
      return { isComposing: false, language: 'en' };
    }
  }

  /**
   * 🔥 영어 키코드인지 확인
   */
  private isEnglishKeycode(keychar?: number): boolean {
    if (!keychar) return false;
    
    // ASCII 영문 범위 (a-z, A-Z)
    return (keychar >= 97 && keychar <= 122) || (keychar >= 65 && keychar <= 90);
  }
}

export const macOSLanguageDetector = new MacOSLanguageDetector();
export default macOSLanguageDetector;
