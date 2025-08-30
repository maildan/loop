// src/types/uiohook.d.ts
declare module 'uiohook-napi' {
  // 🔥 공식 uiohook-napi 타입 정의 (keychar, rawcode 포함)
  export interface UiohookKeyboardEvent {
    type?: number;
    time?: number;
    keycode: number;
    keychar?: number;  // 🔥 실제 입력된 문자의 Unicode 값
    rawcode?: number;  // 🔥 macOS 물리적 키코드
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
  }
  

  // Loop 전용 확장 타입들만 여기에 정의
  export interface UiohookKeyEvent extends UiohookKeyboardEvent {
    // Loop 전용 확장
    loopTimestamp?: number;
    loopProcessed?: boolean;
    loopLanguage?: 'ko' | 'en' | 'ja' | 'zh';
    loopComposed?: string; // 조합된 문자 (한글 등)
  }

  export interface UiohookMouseEvent {
    x: number;
    y: number;
    button: number;
    clicks: number;
    type: number;
    
    // Loop 전용 확장
    loopTimestamp?: number;
    loopWindowTitle?: string;
  }

  export interface UiohookWheelEvent {
    x: number;
    y: number;
    direction: number;
    rotation: number;
    type: number;
    
    // Loop 전용 확장
    loopTimestamp?: number;
  }

  // 이벤트 타입 정의
  export type UiohookEventType = 
    | 'keydown' 
    | 'keyup' 
    | 'mousedown' 
    | 'mouseup' 
    | 'mousemove'
    | 'wheel'
    | 'click'
    | 'doubleclick';

  // 🔥 기가차드 uIOhook 인스턴스 (실제 사용 패턴 반영)
  export interface UiohookInstance {
    start(): void;
    stop(): void;
    
    // shared/types.ts의 UiohookKeyboardEvent 사용
    on(event: 'keydown' | 'keyup', listener: (event: UiohookKeyboardEvent) => void): this;
    on(event: 'mousedown' | 'mouseup' | 'mousemove', listener: (event: UiohookMouseEvent) => void): this;
    on(event: 'wheel', listener: (event: UiohookWheelEvent) => void): this;
    on(event: string, listener: (...args: any[]) => void): this; // 🔥 구체적 함수 타입
    
    // Loop 전용 이벤트 (UiohookKeyEvent 확장 타입 사용)
    on(event: 'loop:keystroke', listener: (event: UiohookKeyEvent) => void): this;
    on(event: 'loop:session-start', listener: () => void): this;
    on(event: 'loop:session-end', listener: () => void): this;
    
    // 제거 메서드
    off(event: UiohookEventType, listener?: (...args: any[]) => void): this; // 🔥 구체적 함수 타입
    removeAllListeners(event?: UiohookEventType): this;
    
    // 상태 메서드
    isRunning(): boolean;
    getEventCount(): number;
    
    // Loop 전용 메서드
    enableLoopMode(): void;
    disableLoopMode(): void;
    setLanguage(lang: 'ko' | 'en' | 'ja' | 'zh'): void;
  }

  // 메인 인스턴스
  export const uIOhook: UiohookInstance;
  export default uIOhook;

  // 키코드 상수들
  export const VC_ESCAPE: number;
  export const VC_F1: number;
  export const VC_F2: number;
  // ... 더 많은 키코드들

  // Mouse 버튼 상수들
  export const MOUSE_BUTTON1: number;
  export const MOUSE_BUTTON2: number;
  export const MOUSE_BUTTON3: number;
}

export {};
