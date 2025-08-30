// 🔥 기가차드 키보드 모니터링 서비스 - 다국어 지원 전문!

import { Logger } from '../../shared/logger';
import { 
  IpcResponse, 
  KeyboardEvent, 
  ProcessedKeyboardEvent,
  KeyboardState,
  KeyboardMonitorState,
  HangulCompositionResult,
  LanguageDetectionResult,
  UiohookKeyboardEvent
} from '../../shared/types';
import { KEYBOARD_LANGUAGES, perf } from '../../shared/common';
import { EventEmitter } from 'events';

// ✅ 올바른 uiohook 타입 import
import { uIOhook } from 'uiohook-napi';
import type * as UiohookNapi from 'uiohook-napi';
import { WindowTracker } from './WindowTracker';
import { HangulComposer } from './HangulComposer';
import { UnifiedLanguageDetector } from './detectors/UnifiedLanguageDetector';
import { HANGUL_KEY_MAP } from './constants';

// #DEBUG: Keyboard service entry point
Logger.debug('KEYBOARD', 'Keyboard service initialization started');
Logger.debug('KEYBOARD', 'Keyboard service module loaded');

// 🔥 기가차드 키보드 서비스 클래스
export class KeyboardService extends EventEmitter {
  private state: KeyboardState = {
    isActive: false,
    language: 'ko', // 🔥 기본값을 한글로 설정
    inputMethod: 'composition', // 🔥 조합형으로 설정
    totalEvents: 0,
    startTime: new Date(),
  };

  private uiohook: typeof import("uiohook-napi").uIOhook | null = null;
  private eventBuffer: ProcessedKeyboardEvent[] = [];
  private performanceTracker = perf;
  private windowTracker: WindowTracker | null = null; // 🔥 지연 초기화로 변경
  private hasAccessibilityPermission = false; // 🔥 권한 상태 추적
  private hangulComposer: HangulComposer; // 🔥 한글 조합기 추가
  private languageDetector: UnifiedLanguageDetector; // 🔥 통합 언어 감지 시스템
  
  // 🔥 영어 키 시퀀스 감지를 위한 배열
  private englishKeySequence: string[] = [];
  private readonly englishSwitchThreshold = 5; // 연속 5개 영어 키
  
  constructor() {
    super();
    // 🔥 HangulComposer 초기화
    this.hangulComposer = new HangulComposer();
    // 🔥 UnifiedLanguageDetector 초기화
    this.languageDetector = new UnifiedLanguageDetector();
    // 🔥 WindowTracker는 권한 확인 후 지연 초기화
    this.initializeUiohook();
  }

  // 🔥 접근성 권한 설정 (main process에서 호출)
  public setAccessibilityPermission(hasPermission: boolean): void {
    this.hasAccessibilityPermission = hasPermission;
    
    if (hasPermission && !this.windowTracker) {
      try {
        // 🔥 WindowTracker 생성 후 권한 설정
        this.windowTracker = new WindowTracker({});
        this.windowTracker.setAccessibilityPermission(hasPermission);
        Logger.info('KEYBOARD', 'WindowTracker initialized with accessibility permission');
      } catch (error) {
        Logger.error('KEYBOARD', 'Failed to initialize WindowTracker', error);
        this.windowTracker = null;
      }
    } else if (!hasPermission && this.windowTracker) {
      // 권한이 제거되면 WindowTracker 정리
      this.windowTracker.cleanup();
      this.windowTracker = null;
      Logger.warn('KEYBOARD', 'WindowTracker disabled due to missing permissions');
    }
  }

  private async initializeUiohook(): Promise<void> {
    try {
      // #DEBUG: Loading uiohook-napi
      this.performanceTracker.start('UIOHOOK_LOAD');
      
      const uiohookModule = await import('uiohook-napi');
      this.uiohook = (uiohookModule.uIOhook as unknown as typeof uIOhook);
      
      const loadTime = this.performanceTracker.end('UIOHOOK_LOAD');
      Logger.info('KEYBOARD', 'uiohook-napi loaded successfully', { 
        loadTime: `${loadTime.toFixed(2)}ms` 
      });
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to load uiohook-napi', error);
      throw new Error('Keyboard monitoring unavailable');
    }
  }

  // 🔥 모니터링 시작 - 권한 체크 및 자동 요청 포함
  public async startMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      Logger.info('KEYBOARD', '🚀 키보드 모니터링 시작 요청');
      
      // #DEBUG: Starting keyboard monitoring
      this.performanceTracker.start('MONITORING_START');
      
      if (this.state.isActive) {
        Logger.warn('KEYBOARD', '⚠️ 모니터링이 이미 활성화되어 있음');
        return {
          success: true,
          data: true,
          timestamp: new Date(),
        };
      }

      // 🔥 권한 체크 및 자동 요청
      Logger.info('KEYBOARD', '🔐 접근성 권한 체크 시작');
      
      const { unifiedPermissionManager } = await import('../utils/UnifiedPermissionManager');
      
      // 현재 권한 상태 확인
      const hasPermission = await unifiedPermissionManager.checkAccessibilityPermission();
      Logger.info('KEYBOARD', `권한 상태 확인: ${hasPermission ? '✅ 허용됨' : '❌ 거부됨'}`);
      
      if (!hasPermission) {
        Logger.warn('KEYBOARD', '❌ 접근성 권한이 없습니다 - 자동 요청 시작');
        
        // 🔥 권한 요청 (macOS 시스템 다이얼로그 자동 표시)
        const requestResult = await unifiedPermissionManager.requestAccessibilityPermission();
        Logger.info('KEYBOARD', '권한 요청 결과:', requestResult);
        
        if (!requestResult.success || !requestResult.data) {
          Logger.error('KEYBOARD', '❌ 접근성 권한 요청 실패');
          return {
            success: false,
            error: '접근성 권한이 필요합니다. 시스템 환경설정에서 권한을 허용해주세요.',
            timestamp: new Date(),
          };
        }
        
        Logger.info('KEYBOARD', '✅ 접근성 권한 허용됨!');
        this.setAccessibilityPermission(true);
      } else {
        Logger.info('KEYBOARD', '✅ 접근성 권한이 이미 있습니다');
        this.setAccessibilityPermission(true);
      }

      if (!this.uiohook) {
        Logger.error('KEYBOARD', '❌ uiohook이 초기화되지 않았음');
        throw new Error('uiohook not initialized');
      }

      // 🔥 uiohook 상태 추가 검증
      if (typeof this.uiohook.start !== 'function') {
        Logger.error('KEYBOARD', '❌ uiohook.start 함수가 없음');
        throw new Error('uiohook.start function not available');
      }

      // 🔥 WindowTracker 초기화 및 시작 (권한이 있는 경우에만)
      if (this.windowTracker && !this.windowTracker.isRunning()) {
        Logger.info('KEYBOARD', '🪟 WindowTracker 초기화 시작');
        await this.windowTracker.initialize();
        await this.windowTracker.start();
        Logger.info('KEYBOARD', '✅ WindowTracker 시작 완료');
      } else if (!this.windowTracker) {
        Logger.warn('KEYBOARD', '⚠️ WindowTracker가 없음 (권한 부족)');
      } else {
        Logger.info('KEYBOARD', '✅ WindowTracker가 이미 실행 중');
      }

      // 🔥 LanguageDetector 초기화 및 시작
      if (!this.languageDetector.isRunning()) {
        Logger.info('KEYBOARD', '🌐 LanguageDetector 초기화 시작');
        await this.languageDetector.initialize();
        await this.languageDetector.start();
        Logger.info('KEYBOARD', '✅ LanguageDetector 시작 완료');
      } else {
        Logger.info('KEYBOARD', '✅ LanguageDetector가 이미 실행 중');
      }

      Logger.info('KEYBOARD', '⌨️ uiohook 이벤트 리스너 설정 시작');
      
      // 키보드 이벤트 리스너 설정
      this.uiohook.on('keydown', (rawEvent: UiohookKeyboardEvent) => {
        Logger.debug('KEYBOARD', '🔥 keydown 이벤트 수신!', { 
          keycode: rawEvent.keycode, 
          keychar: rawEvent.keychar,
          time: Date.now() 
        });
        
        // 🔥 비동기 처리로 이벤트 블로킹 방지
        setImmediate(async () => {
          try {
            await this.handleKeyEventWithTimeout('keydown', rawEvent);
          } catch (error) {
            Logger.error('KEYBOARD', 'Failed to handle keydown event', error);
            // 🔥 에러가 발생해도 모니터링 계속 유지
          }
        });
      });
      
      this.uiohook.on('keyup', (rawEvent: UiohookKeyboardEvent) => {
        Logger.debug('KEYBOARD', '🔥 keyup 이벤트 수신!', { 
          keycode: rawEvent.keycode, 
          keychar: rawEvent.keychar,
          time: Date.now() 
        });
        
        // 🔥 비동기 처리로 이벤트 블로킹 방지
        setImmediate(async () => {
          try {
            await this.handleKeyEventWithTimeout('keyup', rawEvent);
          } catch (error) {
            Logger.error('KEYBOARD', 'Failed to handle keyup event', error);
            // 🔥 에러가 발생해도 모니터링 계속 유지
          }
        });
      });

      Logger.info('KEYBOARD', '🔥 uiohook 시작');
      
      // 🔥 모니터링 시작 (에러 처리 추가)
      try {
        this.uiohook.start();
        Logger.info('KEYBOARD', '✅ uiohook.start() 호출 완료 - 이제 키보드 이벤트를 기다리는 중...');
      } catch (uiohookError) {
        Logger.error('KEYBOARD', '❌ uiohook.start() 실패', uiohookError);
        throw new Error(`Failed to start uiohook: ${uiohookError instanceof Error ? uiohookError.message : 'Unknown uiohook error'}`);
      }
      
      this.state.isActive = true;
      this.state.startTime = new Date();
      this.state.totalEvents = 0;

      const startTime = this.performanceTracker.end('MONITORING_START');
      Logger.info('KEYBOARD', '🎉 키보드 모니터링 시작 완료!', {
        language: this.state.language,
        inputMethod: this.state.inputMethod,
        startTime: `${startTime.toFixed(2)}ms`,
        hasWindowTracker: !!this.windowTracker,
        hasLanguageDetector: this.languageDetector.isRunning()
      });

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to start monitoring', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 모니터링 중지
  public async stopMonitoring(): Promise<IpcResponse<boolean>> {
    try {
      // #DEBUG: Stopping keyboard monitoring
      this.performanceTracker.start('MONITORING_STOP');

      if (!this.state.isActive) {
        Logger.warn('KEYBOARD', 'Monitoring not active');
        return {
          success: true,
          data: false,
          timestamp: new Date(),
        };
      }

      if (this.uiohook) {
        this.uiohook.stop();
        this.uiohook.removeAllListeners();
      }

      // 🔥 WindowTracker 중지 (모니터링 중지시)
      if (this.windowTracker && this.windowTracker.isRunning()) {
        await this.windowTracker.stop();
        Logger.info('KEYBOARD', 'WindowTracker stopped with monitoring');
      }

      // 🔥 LanguageDetector 중지
      if (this.languageDetector && this.languageDetector.isRunning()) {
        await this.languageDetector.stop();
        Logger.info('KEYBOARD', 'LanguageDetector stopped with monitoring');
      }

      this.state.isActive = false;
      this.state.startTime = undefined;
      
      const stopTime = this.performanceTracker.end('MONITORING_STOP');
      Logger.info('KEYBOARD', 'Keyboard monitoring stopped', {
        totalEvents: this.state.totalEvents,
        stopTime: `${stopTime.toFixed(2)}ms`
      });

      return {
        success: true,
        data: false,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to stop monitoring', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 키보드 이벤트 처리 (다국어 지원 + HANGUL_KEY_MAP 활용)
  private async handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): Promise<void> {
    try {
      // 🔥 rawEvent를 enhanced event로 변환 (정확한 keychar 포함)
      const enhancedEvent = this.enhanceRawEvent(rawEvent);
      
      // #DEBUG: Processing keyboard event with enhanced Korean detection
      const processingStart = performance.now();
      
      // 🔥 1. 개선된 언어 감지 (enhanced event 사용)
      const detectionResult = await this.languageDetector.detectLanguage(enhancedEvent);
      const detectedLanguage = detectionResult.language;
      
      // 🔥 2. 한글 특별 처리
      let composedChar: string | undefined;
      let isComposing = false;
      let hangulResult: HangulCompositionResult | null = null; // 🔥 스코프 확장
      
      // 🔥 기가차드 수정: LanguageDetector 결과를 절대적으로 존중하되 숫자/특수문자는 제외
      const shouldProcessAsKorean = detectedLanguage === 'ko' && this.isValidAlphabetKey(enhancedEvent.keycode);
      
      if (shouldProcessAsKorean) {
        Logger.debug('KEYBOARD', 'Korean input confirmed, processing with HangulComposer', {
          keycode: enhancedEvent.keycode,
          keychar: enhancedEvent.keychar,
          detectedLanguage,
          isValidAlphabet: true
        });
        
        // 🔥 LanguageDetector에서 감지된 한글 문자 우선 사용
        let pressedKey: string;
        let hangulChar: string | undefined;
        
        if (detectionResult.detectedChar) {
          // ✅ LanguageDetector에서 이미 한글로 매핑한 경우
          hangulChar = detectionResult.detectedChar;
          pressedKey = hangulChar;
          
          Logger.debug('KEYBOARD', '🔥 LanguageDetector에서 감지된 한글 문자 사용', {
            keycode: enhancedEvent.keycode,
            detectedChar: detectionResult.detectedChar,
            usingHangul: hangulChar
          });
        } else {
          // 🔥 한글 감지됐지만 detectedChar가 없는 경우: keycode로 직접 매핑
          const keycode = enhancedEvent.keycode;
          
          // 🔥 올바른 한글 keycode 매핑 (알파벳만!)
          const validHangulKeycodes = new Map([
            // 알파벳 키만 한글로 매핑 (두벌식 기준)
            [113, 'ㅂ'], // q → ㅂ
            [119, 'ㅈ'], // w → ㅈ  
            [101, 'ㄷ'], // e → ㄷ
            [114, 'ㄱ'], // r → ㄱ
            [116, 'ㅅ'], // t → ㅅ
            [97, 'ㅁ'],  // a → ㅁ
            [115, 'ㄴ'], // s → ㄴ
            [100, 'ㅇ'], // d → ㅇ
            [102, 'ㄹ'], // f → ㄹ
            [103, 'ㅎ'], // g → ㅎ
            [122, 'ㅋ'], // z → ㅋ
            [120, 'ㅌ'], // x → ㅌ
            [99, 'ㅊ'],  // c → ㅊ
            [118, 'ㅍ'], // v → ㅍ
            [121, 'ㅛ'], // y → ㅛ
            [117, 'ㅕ'], // u → ㅕ
            [105, 'ㅑ'], // i → ㅑ
            [111, 'ㅐ'], // o → ㅐ
            [112, 'ㅔ'], // p → ㅔ
            [104, 'ㅗ'], // h → ㅗ
            [106, 'ㅓ'], // j → ㅓ
            [107, 'ㅏ'], // k → ㅏ
            [108, 'ㅣ'], // l → ㅣ
            [98, 'ㅠ'],  // b → ㅠ
            [110, 'ㅜ'], // n → ㅜ
            [109, 'ㅡ']  // m → ㅡ
          ]);
          
          // 🔥 특수문자/제어문자/숫자는 절대 한글로 매핑하지 않음
          const isValidAlphabetKey = (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122);
          
          if (isValidAlphabetKey) {
            // 대문자는 소문자로 변환
            const normalizedKeycode = keycode >= 65 && keycode <= 90 ? keycode + 32 : keycode;
            hangulChar = validHangulKeycodes.get(normalizedKeycode);
          } else {
            // 특수문자, 제어문자, 숫자는 한글 매핑 차단
            hangulChar = undefined;
          }
          
          if (hangulChar) {
            pressedKey = hangulChar;
            Logger.debug('KEYBOARD', '🔥 KeyboardService에서 알파벳 키 한글 매핑 성공', {
              keycode,
              mappedHangul: hangulChar
            });
          } else {
            // ❌ 기존 방식으로 폴백
            pressedKey = String.fromCharCode(this.keycodeToKeychar(enhancedEvent.keycode || 0));
            hangulChar = Object.entries(HANGUL_KEY_MAP).find(([_, english]) => 
              english.toLowerCase() === pressedKey
            )?.[0];
            
            Logger.debug('KEYBOARD', '⚠️ 폴백: 기존 매핑 방식 사용', {
              keycode: enhancedEvent.keycode,
              pressedKey,
              hangulChar
            });
          }
        }
        
        // 🔥 HangulComposer로 한글 조합 처리 (개선된 키 값 검증)
        const validKey = hangulChar || (this.isValidHangulInput(pressedKey) ? pressedKey : null);
        
        if (validKey) {
          hangulResult = await this.hangulComposer.processKey({
            key: validKey, // 검증된 한글 문자만 전달
            code: `Key${enhancedEvent.keycode}`,
            keycode: enhancedEvent.keycode, // 🔥 keycode 추가
            keychar: hangulChar || String.fromCharCode(enhancedEvent.keychar || 0), // 한글 문자 우선, 아니면 유니코드 변환
            timestamp: Date.now(),
            windowTitle: '',
            type
          });
          
          Logger.debug('KEYBOARD', '🔥 유효한 한글 키로 조합 처리', {
            validKey,
            hangulChar,
            pressedKey
          });
        } else {
          // 🔥 유효하지 않은 키는 조합 완료
          Logger.debug('KEYBOARD', '⚠️ 유효하지 않은 한글 키 - 조합 완료', {
            hangulChar,
            pressedKey,
            keycode: enhancedEvent.keycode
          });
          hangulResult = { completed: '', composing: '' };
        }
        
        // 🔥 HangulCompositionResult 처리
        composedChar = hangulResult.completed || hangulResult.composing;
        isComposing = !!hangulResult.composing; // composing 문자가 있으면 조합 중
        
        Logger.debug('KEYBOARD', 'Hangul composition result', {
          pressedKey,
          hangulChar,
          completed: hangulResult.completed,
          composing: hangulResult.composing,
          isComposing
        });
        
        // ✅ 수정: 언어 상태는 실제 감지 결과로만 업데이트
        if (detectedLanguage === 'ko') {
          this.state.language = 'ko';
          this.state.inputMethod = 'composition';
        }
      } else {
        // ✅ 영어/기타 언어 처리
        Logger.debug('KEYBOARD', 'Non-Korean input detected', {
          keycode: enhancedEvent.keycode,
          keychar: enhancedEvent.keychar,
          detectedLanguage
        });
        
        // ✅ 언어 상태 업데이트
        if (detectedLanguage === 'en') {
          this.state.language = 'en';
          this.state.inputMethod = 'direct';
        }
        
        composedChar = enhancedEvent.keychar ? String.fromCharCode(enhancedEvent.keychar) : undefined;
      }
      
      const currentLanguage = detectedLanguage;
      const languageConfig = KEYBOARD_LANGUAGES[currentLanguage];
      
      // 🔥 실제 윈도우 정보 가져오기 (권한이 있을 때만)
      const currentWindow = this.windowTracker?.getCurrentWindow();
      const windowTitle = currentWindow?.title || 'Unknown Window';
      
      const processedEvent: ProcessedKeyboardEvent = {
        key: this.getDisplayKey(enhancedEvent, currentLanguage, composedChar, hangulResult ?? undefined), // 🔥 enhanced event 사용
        code: `Key${enhancedEvent.keycode}`,
        keycode: enhancedEvent.keycode, // 🔥 keycode 추가
        keychar: composedChar || hangulResult?.completed || String.fromCharCode(enhancedEvent.keychar || 0), // 🔥 유니코드를 문자로 변환
        timestamp: Date.now(),
        windowTitle,
        type: type === 'keydown' && (composedChar || hangulResult?.completed) ? 'input' : type, // 🔥 실제 입력 시 'input' 타입
        language: currentLanguage,
        composedChar: hangulResult?.completed || composedChar,
        isComposing: isComposing || !!hangulResult?.composing || (languageConfig?.composition || false),
        inputMethod: languageConfig?.inputMethod || 'composition',
        processingTime: performance.now() - processingStart,
      };

      // 이벤트 버퍼에 추가
      this.eventBuffer.push(processedEvent);
      if (this.eventBuffer.length > 1000) {
        this.eventBuffer.shift(); // 오래된 이벤트 제거
      }

      // 통계 업데이트
      this.state.totalEvents++;
      this.updateEventsPerSecond();

      // 이벤트 발송
      this.emit('keyboard-event', processedEvent);
      
      Logger.debug('KEYBOARD', 'Event processed', {
        type,
        language: currentLanguage,
        processingTime: `${processedEvent.processingTime.toFixed(2)}ms`,
        isComposing: processedEvent.isComposing
      });

    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to process keyboard event', error);
    }
  }

  /**
   * 🔥 타임아웃 기능이 있는 키 이벤트 핸들러 (블로킹 방지)
   */
  private async handleKeyEventWithTimeout(
    type: 'keydown' | 'keyup', 
    rawEvent: UiohookKeyboardEvent
  ): Promise<void> {
    const timeoutMs = 100; // 100ms 타임아웃
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Event handling timeout')), timeoutMs);
    });
    
    try {
      await Promise.race([
        this.handleKeyEvent(type, rawEvent),
        timeoutPromise
      ]);
    } catch (error) {
      if (error instanceof Error && error.message === 'Event handling timeout') {
        Logger.warn('KEYBOARD', `⚠️ 키 이벤트 처리 타임아웃 (${timeoutMs}ms)`, {
          type,
          keycode: rawEvent.keycode,
          keychar: rawEvent.keychar
        });
      } else {
        throw error;
      }
    }
  }

  // 🔥 한글 키보드 레이아웃 감지 (HANGUL_KEY_MAP 활용)
  private isKoreanKeyboardLayout(rawEvent: UiohookKeyboardEvent): boolean {
    try {
      const keycode = rawEvent.keycode;
      const keychar = rawEvent.keychar;
      
      // 🔥 1. HANGUL_KEY_MAP을 역매핑하여 한글 키 패턴 확인
      const reversedHangulMap = new Map<string, string>();
      Object.entries(HANGUL_KEY_MAP).forEach(([hangul, english]) => {
        reversedHangulMap.set(english.toLowerCase(), hangul);
      });
      
      // 🔥 2. 현재 눌린 키가 한글 자판 키인지 확인
      const pressedKey = String.fromCharCode(keycode).toLowerCase();
      const isHangulKey = reversedHangulMap.has(pressedKey);
      
      if (isHangulKey) {
        Logger.debug('KEYBOARD', 'HANGUL_KEY_MAP match found', { 
          keycode, 
          pressedKey, 
          hangulChar: reversedHangulMap.get(pressedKey),
          keychar 
        });
        
        // 🔥 3. 한글 IME 활성 상태 확인
        // keychar가 0이거나 예상 ASCII와 다르면 IME가 처리 중
        const expectedAscii = keycode;
        if (!keychar || keychar !== expectedAscii) {
          Logger.debug('KEYBOARD', 'Korean IME active detected', { 
            expected: expectedAscii, 
            actual: keychar 
          });
          return true;
        }
        
        // 🔥 4. 한글 범위 keychar 확인
        if (keychar && (
          (keychar >= 0x3131 && keychar <= 0x318F) || // 한글 자모
          (keychar >= 0xAC00 && keychar <= 0xD7AF)    // 한글 완성형
        )) {
          Logger.debug('KEYBOARD', 'Korean character detected via keychar', { keychar });
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Error in Korean keyboard layout detection', error);
      return false;
    }
  }
  
  // 🔥 기가차드 keycode를 유니코드 숫자로 변환하는 함수 (macOS uIOhook 전용)
  private keycodeToKeychar(keycode: number): number {
    // 🔥 macOS uIOhook 실제 키코드 → 유니코드 매핑
    const MACOS_UIOHOOK_KEYCODE_MAP: Record<number, number> = {
      // ===== macOS uIOhook 실제 키코드 매핑 =====
      // 숫자 키 (실제 uIOhook 키코드)
      29: 49,  // '1'
      
      // 첫 번째 줄 (QWERTY) - uIOhook 키코드 → ASCII
      16: 113, // q → 'ㅂ'/'ㅃ'
      17: 119, // w → 'ㅈ'/'ㅉ'  
      18: 101, // e → 'ㄷ'/'ㄸ'
      19: 114, // r → 'ㄱ'/'ㄲ'
      20: 116, // t → 'ㅅ'/'ㅆ'
      21: 121, // y → 'ㅛ'
      22: 117, // u → 'ㅕ'
      23: 105, // i → 'ㅑ'
      24: 111, // o → 'ㅐ'/'ㅒ'
      25: 112, // p → 'ㅔ'/'ㅖ'

      // 두 번째 줄 (ASDF...) - uIOhook 키코드 → ASCII  
      30: 97,  // a → 'ㅁ'
      31: 115, // s → 'ㄴ'
      32: 100, // d → 'ㅇ'
      33: 102, // f → 'ㄹ'
      34: 103, // g → 'ㅎ'
      35: 104, // h → 'ㅗ'/'ㅚ'/'ㅢ'
      36: 106, // j → 'ㅓ'/'ㅝ'
      37: 107, // k → 'ㅏ'/'ㅘ'
      38: 108, // l → 'ㅣ'
      
      // 세 번째 줄 (ZXCV...) - uIOhook 키코드 → ASCII
      44: 122, // z → 'ㅋ'
      45: 120, // x → 'ㅌ'
      46: 99,  // c → 'ㅊ'
      47: 118, // v → 'ㅍ'
      48: 98,  // b → 'ㅠ'
      49: 110, // n → 'ㅜ'/'ㅟ'
      50: 109, // m → 'ㅡ'
      
      // 특수키들
      57: 32,   // Space
      43: 44,   // Comma ','
      53: 47,   // Slash '/'
      39: 59,   // Semicolon ';'
      40: 39,   // Apostrophe "'"
      26: 91,   // Left bracket '['
      27: 93,   // Right bracket ']'
      42: 92,   // Backslash '\'
      12: 45,   // Minus '-'
      13: 61,   // Equal '='
    };
    
    const result = MACOS_UIOHOOK_KEYCODE_MAP[keycode] || keycode;
    
    Logger.debug('KEYBOARD', '🔧 macOS uIOhook 키코드 변환', {
      originalKeycode: keycode,
      mappedUnicode: result,
      mappedChar: String.fromCharCode(result)
    });
    
    return result;
  }

  // 🔥 기가차드 rawEvent에 정확한 keychar 추가하는 함수
  private enhanceRawEvent(rawEvent: UiohookKeyboardEvent): UiohookKeyboardEvent {
    // 🔥 keycode를 유니코드 숫자로 변환 (LanguageDetector 호환)
    const keychar = this.keycodeToKeychar(rawEvent.keycode || 0);
    
    return {
      ...rawEvent,
      keychar
    };
  }

  private isKoreanKeyEvent(rawEvent: UiohookKeyboardEvent): boolean {
    try {
      // ❌ 기존 문제 코드 제거: state.language 의존성 완전 제거
      // if (this.state.language === 'ko') return true;
      
      // ✅ 1. 알파벳 키코드만 한글 매핑 허용 (65-90: A-Z, 97-122: a-z)
      const keycode = rawEvent.keycode;
      const isAlphabetKey = (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122);
      
      if (!isAlphabetKey) {
        // 숫자, 특수문자, 제어문자는 한글 조합에서 제외
        const keyType = this.getKeyType(keycode);
        Logger.debug('KEYBOARD', `✅ ${keyType} 키는 한글 조합 제외 (정상)`, { 
          keycode, 
          keychar: rawEvent.keychar,
          actualChar: String.fromCharCode(keycode),
          keyType,
          reason: '한글은 알파벳 키만 조합 가능'
        });
        return false;
      }
      
      // ✅ 2. 한글 키 매핑 확인 (알파벳만)
      const reversedHangulMap = new Map<string, string>();
      Object.entries(HANGUL_KEY_MAP).forEach(([hangul, english]) => {
        reversedHangulMap.set(english.toLowerCase(), hangul);
      });
      
      const pressedKey = String.fromCharCode(keycode).toLowerCase();
      
      if (reversedHangulMap.has(pressedKey)) {
        Logger.debug('KEYBOARD', '✅ 알파벳 키의 한글 매핑 확인됨', { 
          keycode, 
          pressedKey, 
          mappedHangul: reversedHangulMap.get(pressedKey),
          keychar: rawEvent.keychar 
        });
        return true;
      }
      
      // ✅ 3. 한글 유니코드 범위 확인 (실제 한글 문자)
      if (rawEvent.keychar) {
        const isHangulChar = (rawEvent.keychar >= 0x3131 && rawEvent.keychar <= 0x318F) || // 자모
                            (rawEvent.keychar >= 0xAC00 && rawEvent.keychar <= 0xD7AF);   // 완성형
        
        if (isHangulChar) {
          Logger.debug('KEYBOARD', '✅ 한글 유니코드 문자 확인됨', {
            keycode,
            keychar: rawEvent.keychar,
            hangulChar: String.fromCharCode(rawEvent.keychar)
          });
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Error in isKoreanKeyEvent', error);
      return false;
    }
  }

  // 🔥 조합형 문자 처리
  private async processComposition(rawEvent: UiohookKeyboardEvent, languageConfig?: typeof KEYBOARD_LANGUAGES[keyof typeof KEYBOARD_LANGUAGES]): Promise<string | undefined> {
    // #DEBUG: Processing character composition
    
    if (!languageConfig?.composition) {
      return undefined;
    }

    // 🔥 한글 조합 처리 (초성 + 중성 + 종성)
    if (languageConfig.code === 'ko') {
      return await this.processHangulComposition(rawEvent);
    }

    // 🔥 일본어 조합 처리 (로마자 → 히라가나/가타카나)
    if (languageConfig.code === 'ja') {
      return this.processJapaneseComposition(rawEvent);
    }

    // 🔥 중국어 조합 처리 (핀인 입력)
    if (languageConfig.code === 'zh') {
      return this.processChineseComposition(rawEvent);
    }
    
    return String.fromCharCode(rawEvent.keychar || 0);
  }

  // 🔥 한글 조합 처리 (HangulComposer 사용)
  private async processHangulComposition(rawEvent: UiohookKeyboardEvent): Promise<string | undefined> {
    try {
      // 🔥 실제 HangulComposer를 사용하여 한글 조합 처리
      const keyboardEvent: KeyboardEvent = {
        key: this.mapKeyToString(rawEvent.keycode),
        code: `Key${rawEvent.keycode}`,
        keycode: rawEvent.keycode, // 🔥 keycode 추가
        keychar: String.fromCharCode(rawEvent.keychar || 0),
        timestamp: Date.now(),
        windowTitle: this.windowTracker?.getCurrentWindow()?.title || 'Unknown',
        type: 'keydown'
      };

      // HangulComposer 초기화 (필요시)
      if (!this.hangulComposer.isRunning()) {
        await this.hangulComposer.initialize();
        await this.hangulComposer.start();
      }

      const compositionResult = await this.hangulComposer.processKey(keyboardEvent);
      
      if (compositionResult.completed) {
        Logger.debug('KEYBOARD', 'Hangul composition completed', { 
          completed: compositionResult.completed 
        });
        return compositionResult.completed;
      }
      
      if (compositionResult.composing) {
        Logger.debug('KEYBOARD', 'Hangul composition in progress', { 
          composing: compositionResult.composing 
        });
        return compositionResult.composing;
      }

      return undefined;
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to process hangul composition', error);
      return String.fromCharCode(rawEvent.keychar || 0);
    }
  }

  // 🔥 일본어 조합 처리 (로마자 → 히라가나/가타카나)
  private processJapaneseComposition(rawEvent: UiohookKeyboardEvent): string | undefined {
    const char = rawEvent.keychar;
    if (!char) return undefined;

    // 히라가나 범위 (あ-ん)
    if (char >= 0x3040 && char <= 0x309F) {
      return String.fromCharCode(char);
    }

    // 가타카나 범위 (ア-ン)
    if (char >= 0x30A0 && char <= 0x30FF) {
      return String.fromCharCode(char);
    }

    return String.fromCharCode(char);
  }

  // 🔥 중국어 조합 처리 (핀인 입력)
  private processChineseComposition(rawEvent: UiohookKeyboardEvent): string | undefined {
    const char = rawEvent.keychar;
    if (!char) return undefined;

    // 한자 범위 (일-龯)
    if (char >= 0x4E00 && char <= 0x9FFF) {
      return String.fromCharCode(char);
    }

    return String.fromCharCode(char);
  }

  // 🔥 키코드를 문자열로 매핑
  private mapKeyToString(keycode: number): string {
    // #DEBUG: Mapping keycode to string
    
    // 기본 알파벳 (A-Z)
    if (keycode >= 65 && keycode <= 90) {
      return String.fromCharCode(keycode);
    }
    
    // 숫자 (0-9)
    if (keycode >= 48 && keycode <= 57) {
      return String.fromCharCode(keycode);
    }
    
    // 특수 키 매핑
    const specialKeys: Record<number, string> = {
      8: 'Backspace',
      9: 'Tab',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      20: 'CapsLock',
      27: 'Escape',
      32: 'Space',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      46: 'Delete',
    };
    
    return specialKeys[keycode] || `Key${keycode}`;
  }

  // 🔥 정확한 키 표시 메서드 (기가차드 정확성 원칙!)
  private getDisplayKey(
    rawEvent: UiohookKeyboardEvent, 
    language: string, 
    composedChar?: string, 
    hangulResult?: { completed?: string; composing?: string }
  ): string {
    try {
      const { keycode, keychar } = rawEvent;
      
      // 🔥 1. 조합된 문자가 있으면 최우선 표시
      if (composedChar) {
        Logger.debug('KEYBOARD', 'Using composed character', { composedChar });
        return composedChar;
      }
      
      // 🔥 2. 한글 조합 결과가 있으면 표시
      if (hangulResult?.completed) {
        Logger.debug('KEYBOARD', 'Using hangul completed character', { completed: hangulResult.completed });
        return hangulResult.completed;
      }
      
      // 🔥 3. 한글 조합 중인 문자가 있으면 표시
      if (hangulResult?.composing) {
        Logger.debug('KEYBOARD', 'Using hangul composing character', { composing: hangulResult.composing });
        return hangulResult.composing;
      }
      
      // 🔥 4. keychar가 있고 출력 가능한 문자면 표시
      if (keychar && keychar >= 32 && keychar <= 126) {
        const displayChar = String.fromCharCode(keychar);
        Logger.debug('KEYBOARD', 'Using keychar', { keychar, displayChar });
        return displayChar;
      }
      
      // 🔥 5. 한글 언어일 때 HANGUL_KEY_MAP 활용
      if (language === 'ko' && keycode >= 65 && keycode <= 90) {
        const englishKey = String.fromCharCode(keycode).toLowerCase();
        const hangulChar = HANGUL_KEY_MAP[englishKey as keyof typeof HANGUL_KEY_MAP];
        
        if (hangulChar) {
          Logger.debug('KEYBOARD', 'Using hangul mapping', { englishKey, hangulChar });
          return hangulChar;
        }
      }
      
      // 🔥 6. 특수 키 처리
      const specialKeys: Record<number, string> = {
        8: 'Backspace',
        9: 'Tab',
        13: 'Enter',
        16: 'Shift',
        17: 'Ctrl',
        18: 'Alt',
        27: 'Escape',
        32: 'Space',
        37: 'ArrowLeft',
        38: 'ArrowUp',
        39: 'ArrowRight',
        40: 'ArrowDown',
        46: 'Delete',
      };
      const specialKey = specialKeys[keycode];
      if (specialKey !== undefined) {
        return specialKey;
      }
      // 🔥 7. 일반 알파벳 키 (A-Z)
      if (keycode >= 65 && keycode <= 90) {
        return String.fromCharCode(keycode).toLowerCase();
      }
      
      // 🔥 8. 숫자 키 (0-9)
      if (keycode >= 48 && keycode <= 57) {
        return String.fromCharCode(keycode);
      }
      
      // 🔥 9. 기타 키는 keycode 표시
      const fallbackKey = `Key${keycode}`;
      Logger.debug('KEYBOARD', 'Using fallback key', { keycode, fallbackKey });
      return fallbackKey;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to get display key', error);
      return `Key${rawEvent.keycode}`;
    }
  }

  // 🔥 초당 이벤트 수 계산
  private updateEventsPerSecond(): void {
    if (!this.state.startTime) return;
    
    const elapsedSeconds = (Date.now() - this.state.startTime.getTime()) / 1000;
    this.state.eventsPerSecond = this.state.totalEvents / elapsedSeconds;
  }

  // 🔥 상태 조회
  public getStatus(): IpcResponse<KeyboardMonitorState> {
    try {
      // #DEBUG: Getting keyboard status
      const monitorState: KeyboardMonitorState = {
        isActive: this.state.isActive,
        language: this.state.language,
        inputMethod: this.state.inputMethod,
        eventsPerSecond: this.state.eventsPerSecond || 0,
        totalEvents: this.state.totalEvents,
        startTime: this.state.startTime || null,
      };
      
      return {
        success: true,
        data: monitorState,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to get status', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // 🔥 최근 이벤트 조회
  public getRecentEvents(count: number = 10): ProcessedKeyboardEvent[] {
    // #DEBUG: Getting recent events
    Logger.debug('KEYBOARD', 'Getting recent events', { count });
    return this.eventBuffer.slice(-count);
  }

  // 🔥 언어 변경
  public async setLanguage(language: string): Promise<boolean> {
    // #DEBUG: Setting language
    if (!(language in KEYBOARD_LANGUAGES)) {
      Logger.warn('KEYBOARD', 'Unsupported language', { language });
      return false;
    }

    const languageConfig = KEYBOARD_LANGUAGES[language];
    if (!languageConfig) {
      Logger.warn('KEYBOARD', 'Language config not found', { language });
      return false;
    }

    this.state.language = language;
    this.state.inputMethod = languageConfig.inputMethod;
    
    // 🔥 한글 모드일 때 HangulComposer 활성화
    if (language === 'ko' && !this.hangulComposer.isRunning()) {
      try {
        await this.hangulComposer.initialize();
        await this.hangulComposer.start();
        Logger.info('KEYBOARD', 'HangulComposer activated for Korean input');
      } catch (error) {
        Logger.error('KEYBOARD', 'Failed to activate HangulComposer', error);
      }
    }
    
    Logger.info('KEYBOARD', 'Language changed', {
      language,
      inputMethod: this.state.inputMethod,
      composition: languageConfig.composition
    });
    
    return true;
  }

  // 🔥 한글 강제 설정 (디버깅용)
  public forceKoreanLanguage(): boolean {
    try {
      Logger.info('KEYBOARD', '🔥 Force setting language to Korean');
      this.state.language = 'ko';
      this.state.inputMethod = 'composition';
      
      return true;
    } catch (error) {
      Logger.error('KEYBOARD', 'Failed to force Korean language', error);
      return false;
    }
  }

  // 🔥 언어 감지 강제 재실행
  public async testLanguageDetection(testKeycode: number, testKeychar?: number): Promise<string> {
    const testEvent = {
      keycode: testKeycode,
      keychar: testKeychar || 0
    } as UiohookKeyboardEvent;
    
    Logger.info('KEYBOARD', '🔥 Testing language detection', {
      testKeycode,
      testKeychar,
      testKeycodeChar: String.fromCharCode(testKeycode),
      testKeycharChar: testKeychar ? String.fromCharCode(testKeychar) : 'null'
    });
    
    const result = await this.languageDetector.detectLanguage(testEvent);
    Logger.info('KEYBOARD', '🔥 Language detection test result', { result });
    return result.language;
  }

  /**
   * 🔥 영어 키 시퀀스 감지 메서드
   */
  private isEnglishKeySequence(rawEvent: UiohookKeyboardEvent): boolean {
    try {
      const { keycode, keychar } = rawEvent;
      
      // 영어 알파벳 키만 확인 (A-Z)
      if (keycode >= 65 && keycode <= 90) {
        const pressedKey = String.fromCharCode(keycode).toLowerCase();
        
        // keychar가 예상 ASCII와 일치하면 영어 키
        if (keychar && keychar === keycode) {
          this.englishKeySequence.push(pressedKey);
          
          // 배열 크기 제한 (메모리 최적화)
          if (this.englishKeySequence.length > 10) {
            this.englishKeySequence.shift();
          }
          
          // 연속 영어 키 임계값 확인
          if (this.englishKeySequence.length >= this.englishSwitchThreshold) {
            Logger.debug('KEYBOARD', '🔥 English key sequence detected', {
              sequence: this.englishKeySequence.slice(-5),
              count: this.englishKeySequence.length
            });
            return true;
          }
        } else {
          // IME 활성 상태이면 시퀀스 리셋
          this.englishKeySequence = [];
        }
      }
      
      return false;
      
    } catch (error) {
      Logger.error('KEYBOARD', 'Error in English sequence detection', error);
      return false;
    }
  }

  // 🔥 기가차드 macOS IME 완성형 한글 감지
  private isCompleteHangul(keychar: number): boolean {
    // 한글 완성형 유니코드 범위: AC00-D7AF
    return keychar >= 0xAC00 && keychar <= 0xD7AF;
  }

  // 🔥 기가차드 macOS IME 완성형 한글 직접 처리
  private async processCompletedHangul(completedChar: string, rawEvent: UiohookKeyboardEvent): Promise<void> {
    const currentWindow = this.windowTracker?.getCurrentWindow();
    
    const keyboardEvent: ProcessedKeyboardEvent = {
      key: completedChar,
      code: `Key${rawEvent.keycode || 0}`, // 🔥 code 추가
      keycode: rawEvent.keycode || 0,
      keychar: completedChar,
      type: 'keydown',
      timestamp: Date.now(),
      windowTitle: currentWindow?.title || '',
      language: 'ko',
      composedChar: completedChar,
      isComposing: false, // 이미 완성됨
      inputMethod: 'system-ime',
      processingTime: 0.1
    };

    this.emit('keystroke', keyboardEvent);
    this.emit('keyboard-event', {
      eventType: 'input',
      data: keyboardEvent,
      language: 'ko'
    });

    Logger.debug('KEYBOARD', '🎯 macOS IME 완성형 한글 처리 완료', {
      completedChar,
      keycode: rawEvent.keycode
    });
  }

  /**
   * 🔥 유효한 한글 입력 키인지 검증
   */
  private isValidHangulInput(key: string): boolean {
    if (!key || key.length !== 1) return false;
    
    const charCode = key.charCodeAt(0);
    
    // 🔥 확장된 유효 키 범위: 알파벳 + 숫자 + 기본 특수문자
    const isAlphabet = (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
    const isNumber = (charCode >= 48 && charCode <= 57); // 0-9
    const isBasicSymbol = [
      32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, // 기본 기호들
      58, 59, 60, 61, 62, 63, 64, // : ; < = > ? @
      91, 92, 93, 94, 95, 96, // [ \ ] ^ _ `
      123, 124, 125, 126 // { | } ~
    ].includes(charCode);
    
    const isValidKey = isAlphabet || isNumber || isBasicSymbol;
    
    if (!isValidKey) {
      Logger.debug('KEYBOARD', '❌ 지원하지 않는 키 타입', { 
        key, 
        charCode,
        isAlphabet,
        isNumber,
        isBasicSymbol,
        isValid: false
      });
      return false;
    }
    
    // HANGUL_KEY_MAP에서 매핑 확인
    const reversedMap = new Map<string, string>();
    Object.entries(HANGUL_KEY_MAP).forEach(([hangul, english]) => {
      reversedMap.set(english.toLowerCase(), hangul);
    });
    
    const hasMapping = reversedMap.has(key.toLowerCase());
    
    Logger.debug('KEYBOARD', '🔍 한글 입력 키 검증', { 
      key, 
      isAlphabet,
      hasMapping,
      isValid: hasMapping
    });
    
    return hasMapping;
  }

  // 🔥 키 타입 분류 유틸리티
  private getKeyType(keycode: number): string {
    if (keycode >= 48 && keycode <= 57) return '숫자';
    if (keycode >= 65 && keycode <= 90) return '대문자';
    if (keycode >= 97 && keycode <= 122) return '소문자';
    if (keycode <= 31) return '제어문자';
    if ((keycode >= 32 && keycode <= 47) || (keycode >= 58 && keycode <= 64) || (keycode >= 91 && keycode <= 96) || (keycode >= 123 && keycode <= 126)) return '특수문자';
    if (keycode === 32) return 'Space';
    if (keycode >= 112 && keycode <= 123) return '기능키';
    return '기타';
  }

  /**
   * 🔥 알파벳 키인지 확인 (숫자/특수문자 제외)
   */
  private isValidAlphabetKey(keycode: number): boolean {
    // 알파벳 키코드 범위: A-Z (대소문자 모두)
    return (keycode >= 65 && keycode <= 90) ||   // A-Z
           (keycode >= 97 && keycode <= 122);    // a-z
  }
}

// 🔥 기가차드 싱글톤 인스턴스
export const keyboardService = new KeyboardService();

// #DEBUG: Keyboard service exit point
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');
Logger.debug('KEYBOARD', 'Keyboard service initialization complete');

export default keyboardService;
