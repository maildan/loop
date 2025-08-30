// 🔥 기가차드 Linux 전용 언어 감지기 - IBus/XIM 통합!

import { exec } from 'child_process';
import { BaseLanguageDetector } from '../base/BaseLanguageDetector';
import { Platform } from '../../../utils/platform';
import { Logger } from '../../../../shared/logger';
import type { 
  UiohookKeyboardEvent, 
  LanguageDetectionResult 
} from '../../../../shared/types';

// 🔥 공통 키코드 매핑 import
import { 
  LINUX_HANGUL_KEYCODES, 
  LINUX_INPUT_METHODS,
  isHangulKeycode,
  isEnglishKeycode 
} from '../types/KeycodeMappings';

/**
 * 🔥 LinuxLanguageDetector - Linux 전용 언어 감지기
 * 
 * Linux 전용 최적화:
 * - IBus D-Bus 통신
 * - setxkbmap 키보드 레이아웃 감지
 * - XIM 입력 메서드 상태 추적
 * - locale 환경 변수 확인
 */
export class LinuxLanguageDetector extends BaseLanguageDetector {
  // 🔥 Linux 전용 IBus 상태 캐시
  private currentInputMethod: string | null = null;
  private lastImCheck = 0;
  private readonly IM_CHECK_INTERVAL = 1000; // 1초

  constructor() {
    super('LINUX_LANGUAGE_DETECTOR');
    
    // 🔥 테스트 환경에서는 플랫폼 검증 스킵
    if (process.env.NODE_ENV !== 'test' && !Platform.isLinux()) {
      throw new Error('LinuxLanguageDetector는 Linux에서만 사용할 수 있습니다');
    }
  }

  protected getPlatformName(): string {
    return 'Linux';
  }

  /**
   * 🔥 BaseManager 추상 메서드 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Linux 언어 감지기 초기화 시작');
    
    // Linux 플랫폼 검증
    if (!Platform.isLinux()) {
      Logger.error(this.componentName, 'Linux가 아닌 플랫폼에서 실행 불가');
      throw new Error('Linux 플랫폼에서만 사용 가능');
    }
    
    // 초기 입력 메서드 감지
    try {
      await this.getCurrentInputMethod();
      Logger.info(this.componentName, 'Linux 언어 감지기 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, 'Linux 언어 감지기 초기화 실패', error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Linux 언어 감지기 시작');
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Linux 언어 감지기 중지');
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Linux 언어 감지기 정리');
    this.currentInputMethod = null;
    this.lastImCheck = 0;
  }

  /**
   * 🔥 Linux 메인 언어 감지 메서드
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();

    try {
      Logger.debug(this.componentName, '🔥 Linux 네이티브 언어 감지 시작', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage
      });

      // 🔥 1순위: IBus/XIM 입력 메서드 감지 (가장 정확)
      const imResult = await this.detectByInputMethod();
      if (imResult && imResult.confidence >= 0.95) {
        return this.finalizeResult(imResult, startTime);
      }

      // 🔥 2순위: Linux 한글 키코드 매핑
      const keycodeResult = this.detectByLinuxKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.85) {
        return this.finalizeResult(keycodeResult, startTime);
      }

      // 🔥 3순위: 환경 변수 기반 감지
      const envResult = this.detectByEnvironment();
      if (envResult.confidence >= 0.7) {
        return this.finalizeResult(envResult, startTime);
      }

      // 🔥 4순위: 현재 언어 유지 (안전장치)
      return this.finalizeResult({
        language: this.currentLanguage,
        confidence: 0.6,
        method: 'fallback',
        isComposing: this.currentLanguage === 'ko',
        metadata: {
          keycode: rawEvent.keycode,
          keychar: rawEvent.keychar,
          reason: 'linux-fallback-maintain-current'
        }
      }, startTime);

    } catch (error) {
      Logger.error(this.componentName, 'Linux 언어 감지 오류', error);
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
   * 🔥 Linux 입력 메서드 기반 감지 (IBus/XIM)
   */
  private async detectByInputMethod(): Promise<LanguageDetectionResult | null> {
    try {
      const inputMethod = await this.getCurrentInputMethod();
      
      if (inputMethod) {
        // 입력 메서드 이름을 언어로 변환
        let detectedLanguage: 'ko' | 'en' | 'ja' | 'zh' = 'en';
        
        for (const [imName, lang] of Object.entries(LINUX_INPUT_METHODS)) {
          if (inputMethod.toLowerCase().includes(imName)) {
            detectedLanguage = lang as 'ko' | 'en' | 'ja' | 'zh';
            break;
          }
        }
        
        this.currentLanguage = detectedLanguage;
        
        Logger.debug(this.componentName, '🔥 Linux 입력 메서드 감지 성공', {
          inputMethod,
          detectedLanguage,
          confidence: 0.95
        });
        
        return {
          language: detectedLanguage,
          confidence: 0.95,
          method: 'system',
          isComposing: detectedLanguage === 'ko',
          metadata: {
            source: 'IBus/XIM',
            reason: `linux-input-method-${inputMethod}`
          }
        };
      }
      
      return null;
    } catch (error) {
      Logger.error(this.componentName, 'Linux 입력 메서드 감지 실패', error);
      return null;
    }
  }

  /**
   * 🔥 Linux 현재 입력 메서드 조회 (IBus 우선, setxkbmap 백업)
   */
  private async getCurrentInputMethod(): Promise<string | null> {
    // 캐시된 결과가 유효하면 반환
    const now = Date.now();
    if (this.currentInputMethod && 
        now - this.lastImCheck < this.IM_CHECK_INTERVAL) {
      return this.currentInputMethod;
    }

    // IBus 엔진 확인
    const ibusEngine = await this.getIbusEngine();
    if (ibusEngine) {
      this.currentInputMethod = ibusEngine;
      this.lastImCheck = now;
      return ibusEngine;
    }

    // setxkbmap 레이아웃 확인
    const xkbLayout = await this.getXkbLayout();
    if (xkbLayout) {
      this.currentInputMethod = xkbLayout;
      this.lastImCheck = now;
      return xkbLayout;
    }

    return null;
  }

  /**
   * 🔥 IBus 엔진 조회 (D-Bus)
   */
  private async getIbusEngine(): Promise<string | null> {
    return new Promise((resolve) => {
      exec('ibus engine', (error, stdout) => {
        if (error) {
          Logger.debug(this.componentName, 'IBus 엔진 조회 실패', error);
          resolve(null);
          return;
        }

        const engine = stdout.trim();
        Logger.debug(this.componentName, '🔥 IBus 엔진 조회 성공', { engine });
        resolve(engine);
      });
    });
  }

  /**
   * 🔥 setxkbmap 레이아웃 조회
   */
  private async getXkbLayout(): Promise<string | null> {
    return new Promise((resolve) => {
      exec('setxkbmap -query | grep layout', (error, stdout) => {
        if (error) {
          Logger.debug(this.componentName, 'setxkbmap 조회 실패', error);
          resolve(null);
          return;
        }

        const match = stdout.match(/layout:\s*(\w+)/);
        const layout = match ? match[1] : null;
        Logger.debug(this.componentName, '🔥 setxkbmap 레이아웃 조회 성공', { layout });
        resolve(layout || null);
      });
    });
  }

  /**
   * 🔥 Linux 키코드 기반 감지
   */
  private detectByLinuxKeycode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
    const { keycode, keychar } = rawEvent;

    // 제어문자는 언어 변경하지 않음
    if (keycode <= 31 || keycode === 127) {
      return {
        language: this.currentLanguage,
        confidence: 0.8,
        method: 'keycode',
        isComposing: false,
        metadata: { 
          keycode, 
          reason: 'linux-control-key-maintain-current' 
        }
      };
    }

    // Linux 한글 키코드 확인
    const hangulChar = LINUX_HANGUL_KEYCODES.get(keychar || keycode);
    if (hangulChar) {
      Logger.debug(this.componentName, '🔥 Linux 한글 키코드 감지', {
        keycode,
        keychar,
        hangulChar
      });

      return {
        language: 'ko',
        confidence: 0.85,
        method: 'keycode',
        isComposing: true,
        detectedChar: hangulChar,
        metadata: {
          keycode,
          keychar,
          hangulChar,
          reason: 'linux-hangul-keycode-mapping'
        }
      };
    }

    // 영어 키코드 확인
    if (keychar && ((keychar >= 97 && keychar <= 122) || (keychar >= 65 && keychar <= 90))) {
      const char = String.fromCharCode(keychar);
      
      return {
        language: 'en',
        confidence: 0.8,
        method: 'character',
        isComposing: false,
        detectedChar: char,
        metadata: {
          keycode,
          keychar,
          char,
          reason: 'linux-english-alphabet'
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
        reason: 'linux-unknown-key-maintain-current'
      }
    };
  }

  /**
   * 🔥 환경 변수 기반 언어 감지
   */
  private detectByEnvironment(): LanguageDetectionResult {
    const lang = process.env.LANG || process.env.LC_ALL || process.env.LC_CTYPE || '';
    
    let detectedLanguage: 'ko' | 'en' | 'ja' | 'zh' = 'en';
    let confidence = 0.5;

    if (lang.includes('ko') || lang.includes('korean')) {
      detectedLanguage = 'ko';
      confidence = 0.7;
    } else if (lang.includes('ja') || lang.includes('japanese')) {
      detectedLanguage = 'ja';
      confidence = 0.7;
    } else if (lang.includes('zh') || lang.includes('chinese')) {
      detectedLanguage = 'zh';
      confidence = 0.7;
    }

    Logger.debug(this.componentName, '🔥 Linux 환경 변수 언어 감지', {
      lang,
      detectedLanguage,
      confidence
    });

    return {
      language: detectedLanguage,
      confidence,
      method: 'system',
      isComposing: detectedLanguage === 'ko',
      metadata: {
        source: 'Environment',
        reason: `linux-env-lang-${lang}`
      }
    };
  }

  /**
   * 🔥 Linux 전용 추가 메서드들
   */
  public async getInputMethodInfo(): Promise<{
    currentInputMethod: string | null;
    ibusEngine: string | null;
    xkbLayout: string | null;
    environmentLang: string;
    lastImCheck: number;
  }> {
    const [ibusEngine, xkbLayout] = await Promise.all([
      this.getIbusEngine(),
      this.getXkbLayout()
    ]);
    
    return {
      currentInputMethod: this.currentInputMethod,
      ibusEngine,
      xkbLayout,
      environmentLang: process.env.LANG || '',
      lastImCheck: this.lastImCheck
    };
  }

  public getPerformanceStats() {
    return {
      ...super.getPerformanceStats(),
      platform: 'Linux',
      inputMethodCache: {
        current: this.currentInputMethod,
        lastCheck: this.lastImCheck,
        interval: this.IM_CHECK_INTERVAL
      },
      hangulKeycodeCount: LINUX_HANGUL_KEYCODES.size,
      supportedImCount: Object.keys(LINUX_INPUT_METHODS).length,
      environment: {
        lang: process.env.LANG || null,
        lcAll: process.env.LC_ALL || null,
        lcCtype: process.env.LC_CTYPE || null
      }
    };
  }
}

export const linuxLanguageDetector = new LinuxLanguageDetector();
export default linuxLanguageDetector;
