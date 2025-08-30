// 🔥 기가차드 범용 키보드 어댑터 - uIOhook 기반 크로스 플랫폼 지원!

import { EventEmitter } from 'events';
import { Logger } from '../../../shared/logger';
import type { IKeyboardInputAdapter, KeyInputData, AdapterStatus, AdapterOptions } from './IKeyboardInputAdapter';

// ✅ 올바른 uiohook 타입 import
import { uIOhook } from 'uiohook-napi';
import type * as UiohookNapi from 'uiohook-napi';
import type { UiohookKeyboardEvent } from '../../../shared/types';
import { Platform } from '../../utils/platform';

/**
 * 🔥 UniversalKeyboardAdapter - uIOhook 기반 범용 키보드 어댑터
 * 
 * 모든 플랫폼에서 동작하는 폴백 어댑터
 * - uIOhook 네이티브 모듈 사용
 * - 글로벌 키보드 후킹
 * - 기본적인 언어 감지 지원
 */
export class UniversalKeyboardAdapter extends EventEmitter implements IKeyboardInputAdapter {
  private readonly componentName = 'UNIVERSAL_KEYBOARD_ADAPTER';
  private uiohook: typeof import("uiohook-napi").uIOhook | null = null;
  private isListening = false;
  private hasPermissions = false;
  private startedAt: Date | null = null;
  private lastInputAt: Date | null = null;
  private processedInputs = 0;
  private options: Required<AdapterOptions>;

  constructor(options: AdapterOptions = {}) {
    super();
    
    // 기본 옵션 설정
    this.options = {
      enableBuffering: options.enableBuffering ?? false,
      bufferSize: options.bufferSize ?? 100,
      inputDelay: options.inputDelay ?? 0,
      debugMode: options.debugMode ?? false,
      enableLanguageDetection: options.enableLanguageDetection ?? true,
      enableWindowTracking: options.enableWindowTracking ?? true
    };

    Logger.info(this.componentName, 'Universal 키보드 어댑터 생성됨', {
      platform: Platform.getPlatformName(),
      options: this.options
    });
  }

  /**
   * 키보드 모니터링 시작
   */
  public async startListening(): Promise<void> {
    if (this.isListening) {
      Logger.warn(this.componentName, '이미 모니터링 중입니다');
      return;
    }

    Logger.info(this.componentName, '키보드 모니터링 시작');

    try {
      // uIOhook 초기화
      await this.initializeUiohook();
      
      if (!this.uiohook) {
        throw new Error('uIOhook 초기화 실패');
      }

      // 이벤트 리스너 설정
      this.setupEventListeners();

      // uIOhook 시작
      await new Promise<void>((resolve, reject) => {
        if (!this.uiohook) {
          reject(new Error('uIOhook이 초기화되지 않음'));
          return;
        }

        this.uiohook.start();
        
        // 시작 확인을 위한 타이머
        setTimeout(() => {
          if (this.isListening) {
            resolve();
          } else {
            reject(new Error('uIOhook 시작 실패'));
          }
        }, 100);
      });

      this.isListening = true;
      this.startedAt = new Date();
      
      Logger.info(this.componentName, '키보드 모니터링 시작됨');
      
      this.emit('statusChanged', this.getStatus());

    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 시작 실패', error);
      this.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * 키보드 모니터링 중지
   */
  public async stopListening(): Promise<void> {
    if (!this.isListening) {
      Logger.warn(this.componentName, '모니터링이 활성화되지 않음');
      return;
    }

    Logger.info(this.componentName, '키보드 모니터링 중지');

    try {
      if (this.uiohook) {
        this.uiohook.stop();
        this.uiohook = null;
      }

      this.isListening = false;
      this.startedAt = null;
      
      Logger.info(this.componentName, '키보드 모니터링 중지됨');
      
      this.emit('statusChanged', this.getStatus());

    } catch (error) {
      Logger.error(this.componentName, '키보드 모니터링 중지 실패', error);
      this.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * 시스템 권한 요청
   */
  public async requestPermissions(): Promise<boolean> {
    Logger.info(this.componentName, '시스템 권한 요청');

    try {
      // 플랫폼별 권한 확인
      if (Platform.isMacOS()) {
        // macOS는 접근성 권한이 필요
        this.hasPermissions = await this.checkMacOSAccessibilityPermission();
      } else if (Platform.isWindows()) {
        // Windows는 관리자 권한 확인
        this.hasPermissions = await this.checkWindowsPermissions();
      } else {
        // Linux는 일반적으로 권한이 필요하지 않음
        this.hasPermissions = true;
      }

      Logger.info(this.componentName, `권한 상태: ${this.hasPermissions ? '허용' : '거부'}`);
      
      this.emit('permissionChanged', this.hasPermissions);
      
      return this.hasPermissions;

    } catch (error) {
      Logger.error(this.componentName, '권한 요청 실패', error);
      this.hasPermissions = false;
      this.emit('error', error as Error);
      return false;
    }
  }

  /**
   * 현재 권한 상태 확인
   */
  public async checkPermissions(): Promise<boolean> {
    return this.hasPermissions;
  }

  /**
   * 어댑터 상태 정보 반환
   */
  public getStatus(): AdapterStatus {
    return {
      isActive: this.isListening,
      hasPermissions: this.hasPermissions,
      platform: Platform.getPlatformName(),
      adapterType: 'UniversalKeyboardAdapter',
      startedAt: this.startedAt || undefined,
      lastInputAt: this.lastInputAt || undefined,
      processedInputs: this.processedInputs
    };
  }

  /**
   * 어댑터 정리
   */
  public async cleanup(): Promise<void> {
    Logger.info(this.componentName, '어댑터 정리 시작');

    try {
      if (this.isListening) {
        await this.stopListening();
      }

      // 이벤트 리스너 제거
      this.removeAllListeners();

      Logger.info(this.componentName, '어댑터 정리 완료');

    } catch (error) {
      Logger.error(this.componentName, '어댑터 정리 실패', error);
      throw error;
    }
  }

  /**
   * 헬스 체크
   */
  public async healthCheck(): Promise<{ healthy: boolean; details?: string }> {
    try {
      const healthy = this.isListening && this.hasPermissions;
      const details = healthy ? 'All systems operational' : 
        `Issues: ${!this.isListening ? 'Not listening' : ''} ${!this.hasPermissions ? 'No permissions' : ''}`.trim();

      return { healthy, details };

    } catch (error) {
      return { 
        healthy: false, 
        details: `Health check failed: ${error}` 
      };
    }
  }

  /**
   * uIOhook 초기화
   */
  private async initializeUiohook(): Promise<void> {
    try {
      Logger.debug(this.componentName, 'uIOhook 초기화 시작');

      // uIOhook 동적 import
      const uiohookModule = await import('uiohook-napi');
      const rawUiohook = uiohookModule.uIOhook;

      // uIOhook 래퍼 생성
      this.uiohook = this.createUiohookAdapter(rawUiohook);

      Logger.debug(this.componentName, 'uIOhook 초기화 완료');

    } catch (error) {
      Logger.error(this.componentName, 'uIOhook 초기화 실패', error);
      throw new Error(`uIOhook 초기화 실패: ${error}`);
    }
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    if (!this.uiohook) {
      throw new Error('uIOhook이 초기화되지 않음');
    }

    Logger.debug(this.componentName, 'uIOhook 이벤트 리스너 설정');

    // 키 다운 이벤트
    this.uiohook.on('keydown', (event: UiohookKeyboardEvent) => {
      this.handleKeyEvent('keydown', event);
    });

    // 키 업 이벤트  
    this.uiohook.on('keyup', (event: UiohookKeyboardEvent) => {
      this.handleKeyEvent('keyup', event);
    });
  }

  /**
   * 키 이벤트 처리
   */
  private handleKeyEvent(type: 'keydown' | 'keyup', rawEvent: UiohookKeyboardEvent): void {
    try {
      this.processedInputs++;
      this.lastInputAt = new Date();

      // 기본 문자 추출
      const character = this.extractCharacter(rawEvent);
      if (!character) {
        return; // 문자가 없으면 무시
      }

      // 언어 감지
      const language = this.options.enableLanguageDetection ? 
        this.detectLanguage(rawEvent, character) : 'unknown';

      // 윈도우 정보 수집
      const windowInfo = this.options.enableWindowTracking ? 
        this.getCurrentWindowInfo() : { title: 'Unknown', processName: 'Unknown' };

      // KeyInputData 생성
      const inputData: KeyInputData = {
        character,
        timestamp: Date.now(),
        language,
        windowInfo,
        inputMethod: this.determineInputMethod(rawEvent, character),
        rawKeyInfo: {
          keycode: rawEvent.keycode || 0,
          keychar: rawEvent.keychar || 0,
          key: character,
          shiftKey: rawEvent.shiftKey || false,
          ctrlKey: rawEvent.ctrlKey || false,
          altKey: rawEvent.altKey || false,
          metaKey: rawEvent.metaKey || false
        }
      };

      if (this.options.debugMode) {
        Logger.debug(this.componentName, '키 입력 처리됨', {
          type,
          character,
          language,
          keycode: rawEvent.keycode
        });
      }

      // 입력 지연 처리
      if (this.options.inputDelay > 0) {
        setTimeout(() => {
          this.emit('input', inputData);
        }, this.options.inputDelay);
      } else {
        this.emit('input', inputData);
      }

    } catch (error) {
      Logger.error(this.componentName, '키 이벤트 처리 실패', error);
      this.emit('error', error as Error);
    }
  }

  /**
   * 문자 추출
   */
  private extractCharacter(rawEvent: UiohookKeyboardEvent): string {
    // keychar가 있으면 사용
    if (rawEvent.keychar && rawEvent.keychar > 31 && rawEvent.keychar < 127) {
      return String.fromCharCode(rawEvent.keychar);
    }

    // keycode를 문자로 변환 시도
    if (rawEvent.keycode) {
      return this.keycodeToChar(rawEvent.keycode);
    }

    return '';
  }

  /**
   * 키코드를 문자로 변환
   */
  private keycodeToChar(keycode: number): string {
    // 기본적인 키코드 매핑
    if (keycode >= 65 && keycode <= 90) {
      // A-Z
      return String.fromCharCode(keycode + 32); // 소문자로
    }
    
    if (keycode >= 48 && keycode <= 57) {
      // 0-9
      return String.fromCharCode(keycode);
    }

    // 특수 문자는 빈 문자열 반환
    return '';
  }

  /**
   * 언어 감지
   */
  private detectLanguage(rawEvent: UiohookKeyboardEvent, character: string): string {
    // 한글 범위 확인
    const charCode = character.charCodeAt(0);
    
    // 한글 완성형
    if (charCode >= 0xAC00 && charCode <= 0xD7AF) {
      return 'ko';
    }
    
    // 한글 자모
    if ((charCode >= 0x1100 && charCode <= 0x11FF) || 
        (charCode >= 0x3130 && charCode <= 0x318F)) {
      return 'ko';
    }

    // 일본어
    if ((charCode >= 0x3040 && charCode <= 0x309F) || // 히라가나
        (charCode >= 0x30A0 && charCode <= 0x30FF)) { // 가타가나
      return 'ja';
    }

    // 중국어 (간체/번체)
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
      return 'zh';
    }

    // 기본값은 영어
    return 'en';
  }

  /**
   * 입력 방식 결정
   */
  private determineInputMethod(rawEvent: UiohookKeyboardEvent, character: string): 'direct' | 'ime' | 'composition' | 'complete' {
    const charCode = character.charCodeAt(0);
    
    // 한글, 일본어, 중국어는 IME 입력으로 간주
    if (charCode >= 0x3040 || // 일본어/한글/중국어 시작
        (charCode >= 0x1100 && charCode <= 0x11FF) || // 한글 자모
        (charCode >= 0x3130 && charCode <= 0x318F)) { // 한글 호환 자모
      return 'ime';
    }

    // 영어 및 기본 ASCII는 직접 입력
    return 'direct';
  }

  /**
   * 현재 윈도우 정보 가져오기
   */
  private getCurrentWindowInfo(): { title: string; bundleId?: string; processName?: string } {
    // 실제 구현에서는 네이티브 모듈이나 시스템 API 사용
    // 여기서는 기본값 반환
    return {
      title: 'Unknown Window',
      processName: 'Unknown Process'
    };
  }

  /**
   * macOS 접근성 권한 확인
   */
  private async checkMacOSAccessibilityPermission(): Promise<boolean> {
    // 실제 구현에서는 네이티브 모듈 사용
    // 여기서는 임시로 true 반환
    return true;
  }

  /**
   * Windows 권한 확인
   */
  private async checkWindowsPermissions(): Promise<boolean> {
    // 실제 구현에서는 관리자 권한 확인
    // 여기서는 임시로 true 반환
    return true;
  }

  /**
   * uIOhook 어댑터 생성
   */
  private createUiohookAdapter(rawUiohook: typeof import('uiohook-napi').uIOhook): typeof uIOhook {
    const adapter = {
      start: () => {
        rawUiohook.start();
        this.isListening = true;
      },
      stop: () => {
        rawUiohook.stop();
        this.isListening = false;
      },
      on: (event: 'keydown' | 'keyup', callback: (data: UiohookKeyboardEvent) => void) => {
        (rawUiohook as unknown as { on: (e: string, cb: (data: UiohookKeyboardEvent) => void) => void }).on(event, callback);
      },
      off: (event: 'keydown' | 'keyup', callback: (data: UiohookKeyboardEvent) => void) => {
        (rawUiohook as unknown as { off: (e: string, cb: (data: UiohookKeyboardEvent) => void) => void }).off(event, callback);
      }
    };

    return adapter as unknown as typeof uIOhook;
  }
}

export default UniversalKeyboardAdapter;
