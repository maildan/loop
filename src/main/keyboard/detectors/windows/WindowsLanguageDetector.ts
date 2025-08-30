// 🔥 기가차드 Windows 전용 언어 감지기 - Win32 API 완전 활용!

import { BaseLanguageDetector } from '../base/BaseLanguageDetector';
import { Platform } from '../../../utils/platform';
import { Logger } from '../../../../shared/logger';
import type { 
  UiohookKeyboardEvent, 
  LanguageDetectionResult 
} from '../../../../shared/types';
import type { SupportedLanguage } from '../types/CommonTypes';

// 🔥 중앙화된 키코드 매핑 import
import { 
  WINDOWS_HANGUL_KEYCODES, 
  WINDOWS_KEYBOARD_LAYOUTS,
  ENGLISH_KEYCODES,
  NUMBER_KEYCODES,
  SPECIAL_KEYCODES
} from '../types/KeycodeMappings';

// 🔥 Windows FFI 타입 정의
interface FFILibrary {
  Library: (name: string, funcs: Record<string, unknown[]>) => WindowsAPI;
}

interface BufferWithAddress extends Buffer {
  address(): BufferWithAddress;
  toString(encoding?: BufferEncoding): string;
}

interface WindowsAPI {
  GetKeyboardLayout: (threadId: number) => BufferWithAddress;
  GetForegroundWindow: () => BufferWithAddress;
  GetWindowThreadProcessId: (hwnd: BufferWithAddress, processId: null) => number;
}

// 🔥 Windows FFI 바인딩 (ffi-napi 사용) - 동적 로딩
let ffi: FFILibrary | null = null;
let ref: unknown = null;
let user32: WindowsAPI | null = null;

try {
  if (Platform.isWindows()) {
    ffi = require('ffi-napi');
    ref = require('ref-napi');
    
    // Win32 API 바인딩
    if (ffi) {
      user32 = ffi.Library('user32', {
        'GetKeyboardLayout': ['pointer', ['int']],
        'GetForegroundWindow': ['pointer', []],
        'GetWindowThreadProcessId': ['int', ['pointer', 'pointer']],
        'ToUnicodeEx': ['int', ['uint', 'uint', 'pointer', 'pointer', 'int', 'uint', 'pointer']]
      });
    }
    
    Logger.info('WINDOWS_LANGUAGE_DETECTOR', 'Windows FFI 바인딩 성공');
  }
} catch (error) {
  Logger.warn('WINDOWS_LANGUAGE_DETECTOR', 'Windows FFI 바인딩 실패', error);
}

/**
 * 🔥 WindowsLanguageDetector - Windows 전용 언어 감지기
 * 
 * Windows 전용 최적화:
 * - GetKeyboardLayout Win32 API
 * - ToUnicodeEx 키 변환 API
 * - IME 상태 감지
 * - 스레드별 키보드 레이아웃 추적
 */
export class WindowsLanguageDetector extends BaseLanguageDetector {
  // 🔥 Windows 전용 키보드 레이아웃 캐시
  private currentKeyboardLayout: number | null = null;
  private lastLayoutCheck = 0;
  private readonly LAYOUT_CHECK_INTERVAL = 500; // 0.5초

  constructor() {
    super('WINDOWS_LANGUAGE_DETECTOR');
    
    // 🔥 테스트 환경에서는 플랫폼 검증 스킵
    if (process.env.NODE_ENV !== 'test' && !Platform.isWindows()) {
      throw new Error('WindowsLanguageDetector는 Windows에서만 사용할 수 있습니다');
    }

    if (process.env.NODE_ENV !== 'test' && !user32) {
      Logger.warn(this.componentName, 'Windows API 바인딩이 없어 기본 모드로 동작');
    }
  }

  protected getPlatformName(): string {
    return 'Windows';
  }

  /**
   * 🔥 BaseManager 추상 메서드 구현
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Windows 언어 감지기 초기화 시작');
    
    // Windows 플랫폼 검증
    if (!Platform.isWindows()) {
      Logger.error(this.componentName, 'Windows가 아닌 플랫폼에서 실행 불가');
      throw new Error('Windows 플랫폼에서만 사용 가능');
    }
    
    // 초기 키보드 레이아웃 감지
    try {
      await this.getCurrentKeyboardLayout();
      Logger.info(this.componentName, 'Windows 언어 감지기 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, 'Windows 언어 감지기 초기화 실패', error);
      throw error;
    }
  }

  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Windows 언어 감지기 시작');
  }

  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Windows 언어 감지기 중지');
  }

  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Windows 언어 감지기 정리');
    this.currentKeyboardLayout = null;
    this.lastLayoutCheck = 0;
  }

  /**
   * 🔥 Windows 메인 언어 감지 메서드
   */
  public async detectLanguage(rawEvent: UiohookKeyboardEvent): Promise<LanguageDetectionResult> {
    const startTime = performance.now();

    try {
      Logger.debug(this.componentName, '🔥 Windows 네이티브 언어 감지 시작', {
        keycode: rawEvent.keycode,
        keychar: rawEvent.keychar,
        isShift: rawEvent.shiftKey,
        currentLanguage: this.currentLanguage
      });

      // 🔥 1순위: Windows 키보드 레이아웃 감지 (가장 정확)
      const layoutResult = await this.detectByKeyboardLayout();
      if (layoutResult && layoutResult.confidence >= 0.95) {
        return this.finalizeResult(layoutResult, startTime);
      }

      // 🔥 2순위: Windows 한글 키코드 매핑
      const keycodeResult = this.detectByWindowsKeycode(rawEvent);
      if (keycodeResult.confidence >= 0.85) {
        return this.finalizeResult(keycodeResult, startTime);
      }

      // 🔥 3순위: 현재 언어 유지 (안전장치)
      return this.finalizeResult({
        language: this.currentLanguage,
        confidence: 0.7,
        method: 'fallback',
        isComposing: this.currentLanguage === 'ko',
        metadata: {
          keycode: rawEvent.keycode,
          keychar: rawEvent.keychar,
          reason: 'windows-fallback-maintain-current'
        }
      }, startTime);

    } catch (error) {
      Logger.error(this.componentName, 'Windows 언어 감지 오류', error);
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
   * 🔥 Windows 키보드 레이아웃 기반 감지
   */
  private async detectByKeyboardLayout(): Promise<LanguageDetectionResult | null> {
    try {
      const layout = await this.getCurrentKeyboardLayout();
      
      if (layout !== null) {
        const language = (WINDOWS_KEYBOARD_LAYOUTS[layout as keyof typeof WINDOWS_KEYBOARD_LAYOUTS] || 'en') as SupportedLanguage;
        const mappedLanguage = this.mapToSupportedLanguage(language);
        this.currentLanguage = mappedLanguage;
        
        Logger.debug(this.componentName, '🔥 Windows 키보드 레이아웃 감지 성공', {
          layout: `0x${layout.toString(16)}`,
          language,
          confidence: 0.98
        });
        
        return {
          language,
          confidence: 0.98,
          method: 'system',
          isComposing: language === 'ko',
          metadata: {
            source: 'GetKeyboardLayout',
            reason: `windows-layout-0x${layout.toString(16)}`
          }
        };
      }
      
      return null;
    } catch (error) {
      Logger.error(this.componentName, 'Windows 키보드 레이아웃 감지 실패', error);
      return null;
    }
  }

  /**
   * 🔥 Windows GetKeyboardLayout API 호출
   */
  private async getCurrentKeyboardLayout(): Promise<number | null> {
    // 캐시된 결과가 유효하면 반환
    const now = Date.now();
    if (this.currentKeyboardLayout !== null && 
        now - this.lastLayoutCheck < this.LAYOUT_CHECK_INTERVAL) {
      return this.currentKeyboardLayout;
    }

    if (!user32) {
      Logger.debug(this.componentName, 'Windows API 없어 레이아웃 감지 불가');
      return null;
    }

    try {
      // 현재 활성 윈도우의 스레드 ID 가져오기
      const foregroundWindow = user32.GetForegroundWindow();
      const threadId = user32.GetWindowThreadProcessId(foregroundWindow, null);
      
      // 해당 스레드의 키보드 레이아웃 가져오기
      const layoutHandle = user32.GetKeyboardLayout(threadId);
      const layout = parseInt(layoutHandle.address().toString('hex').slice(-8), 16);
      
      this.currentKeyboardLayout = layout;
      this.lastLayoutCheck = now;
      
      Logger.debug(this.componentName, '🔥 Windows GetKeyboardLayout 성공', {
        threadId,
        layout: `0x${layout.toString(16)}`
      });
      
      return layout;
    } catch (error) {
      Logger.error(this.componentName, 'Windows GetKeyboardLayout 실패', error);
      return null;
    }
  }

  /**
   * 🔥 Windows 키코드 기반 감지
   */
  private detectByWindowsKeycode(rawEvent: UiohookKeyboardEvent): LanguageDetectionResult {
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
          reason: 'windows-control-key-maintain-current' 
        }
      };
    }

    // Windows 한글 키코드 확인
    const hangulChar = WINDOWS_HANGUL_KEYCODES.get(keycode);
    if (hangulChar) {
      Logger.debug(this.componentName, '🔥 Windows 한글 키코드 감지', {
        keycode,
        keychar,
        hangulChar
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
          reason: 'windows-hangul-keycode-mapping'
        }
      };
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
          reason: 'windows-english-alphabet'
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
        reason: 'windows-unknown-key-maintain-current'
      }
    };
  }

  /**
   * 🔥 Windows 전용 추가 메서드들
   */
  public async getKeyboardLayoutInfo(): Promise<{
    currentLayout: string | null;
    availableLayouts: string[];
    lastLayoutCheck: number;
    ffiAvailable: boolean;
  }> {
    const layout = await this.getCurrentKeyboardLayout();
    
    return {
      currentLayout: layout ? `0x${layout.toString(16)}` : null,
      availableLayouts: Object.keys(WINDOWS_KEYBOARD_LAYOUTS).map(k => `0x${parseInt(k).toString(16)}`),
      lastLayoutCheck: this.lastLayoutCheck,
      ffiAvailable: !!user32
    };
  }

  /**
   * 🔥 Windows IME 상태 감지
   */
  public async detectIMEState(): Promise<{
    isIMEActive: boolean;
    inputMethod: string;
    language: string;
    confidence: number;
  }> {
    try {
      // 키보드 레이아웃으로 IME 상태 판단
      const layout = await this.getCurrentKeyboardLayout();
      
      if (!layout) {
        return {
          isIMEActive: false,
          inputMethod: 'unknown',
          language: 'unknown',
          confidence: 0.0
        };
      }

      // 한국어 레이아웃인지 확인
      const isKoreanLayout = layout === 0x0412 || // 한국어
                           layout === 0x040D ||   // 한국어 (구 버전)
                           WINDOWS_KEYBOARD_LAYOUTS[layout] === 'ko';

      if (isKoreanLayout) {
        return {
          isIMEActive: true,
          inputMethod: 'Korean IME',
          language: 'ko-KR',
          confidence: 0.95
        };
      }

      // 기타 IME 언어들
      const layoutInfo = WINDOWS_KEYBOARD_LAYOUTS[layout];
      if (layoutInfo && layoutInfo !== 'en') {
        return {
          isIMEActive: true,
          inputMethod: `${layoutInfo} IME`,
          language: layoutInfo === 'ko' ? 'ko-KR' : `${layoutInfo}-${layoutInfo.toUpperCase()}`,
          confidence: 0.85
        };
      }

      // 영어 또는 알 수 없는 레이아웃
      return {
        isIMEActive: false,
        inputMethod: 'Direct Input',
        language: 'en-US',
        confidence: 0.8
      };

    } catch (error) {
      Logger.warn(this.componentName, 'IME 상태 감지 실패', error);
      return {
        isIMEActive: false,
        inputMethod: 'unknown',
        language: 'unknown',
        confidence: 0.0
      };
    }
  }

  /**
   * 🔥 Windows 한글 입력 모드 감지
   */
  public async detectHangulInputMode(): Promise<{
    isHangulMode: boolean;
    inputMode: 'english' | 'hangul' | 'unknown';
    confidence: number;
  }> {
    try {
      const imeState = await this.detectIMEState();
      
      if (imeState.language === 'ko-KR' && imeState.isIMEActive) {
        // 추가적으로 레지스트리나 시스템 상태 확인 가능
        return {
          isHangulMode: true,
          inputMode: 'hangul',
          confidence: imeState.confidence
        };
      }

      return {
        isHangulMode: false,
        inputMode: imeState.language.startsWith('en') ? 'english' : 'unknown',
        confidence: imeState.confidence
      };

    } catch (error) {
      Logger.warn(this.componentName, '한글 입력 모드 감지 실패', error);
      return {
        isHangulMode: false,
        inputMode: 'unknown',
        confidence: 0.0
      };
    }
  }

  public getPerformanceStats() {
    return {
      ...super.getPerformanceStats(),
      platform: 'Windows',
      layoutCache: {
        current: this.currentKeyboardLayout ? `0x${this.currentKeyboardLayout.toString(16)}` : null,
        lastCheck: this.lastLayoutCheck,
        interval: this.LAYOUT_CHECK_INTERVAL
      },
      ffiStatus: !!user32,
      hangulKeycodeCount: WINDOWS_HANGUL_KEYCODES.size,
      supportedLayoutCount: Object.keys(WINDOWS_KEYBOARD_LAYOUTS).length
    };
  }
}

// 🔥 Windows에서만 인스턴스 생성 (조건부 export)
let windowsLanguageDetector: WindowsLanguageDetector | null = null;

if (Platform.isWindows()) {
  try {
    windowsLanguageDetector = new WindowsLanguageDetector();
  } catch (error) {
    Logger.error('WINDOWS_LANGUAGE_DETECTOR', 'Windows 언어 감지기 생성 실패', error);
    windowsLanguageDetector = null;
  }
} else {
  Logger.debug('WINDOWS_LANGUAGE_DETECTOR', 'Windows가 아닌 플랫폼에서는 생성하지 않음');
  windowsLanguageDetector = null;
}

export { windowsLanguageDetector };
export default windowsLanguageDetector;
