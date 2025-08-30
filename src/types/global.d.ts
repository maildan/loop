// 🔥 기가차드 글로벌 타입 확장 - Electron 환경 특화
// src/types/global.d.ts

import type { ElectronAPI } from '../shared/types';
import type { AppCategory } from '../main/keyboard/appCategories';

// 🔥 uiohook-napi 타입 정의 (shared/types.ts 기반으로 통합)
declare module 'uiohook-napi' {
  // shared/types.ts에서 import
  import type { UiohookKeyboardEvent } from '../shared/types';
  
  // 기본 export
  export { UiohookKeyboardEvent };

  // 🔥 기가차드 마우스 이벤트 타입
  export interface UiohookMouseEvent {
    x: number;
    y: number;
    button: number;
    clicks: number;
    type: number;
  }

  // 🔥 기가차드 휠 이벤트 타입
  export interface UiohookWheelEvent {
    x: number;
    y: number;
    direction: number;
    rotation: number;
    type: number;
  }

  // 🔥 기가차드 uIOhook 인스턴스 (KeyboardEngine + KeyboardService 호환)
  export interface UiohookInstance {
    start(): void;
    stop(): void;
    on(event: 'keydown' | 'keyup', listener: (event: UiohookKeyboardEvent) => void): this;
    on(event: 'mousedown' | 'mouseup' | 'mousemove', listener: (event: UiohookMouseEvent) => void): this;
    on(event: 'wheel', listener: (event: UiohookWheelEvent) => void): this;
    removeAllListeners(): void;
    
    // 🔥 Loop 전용 확장 메서드들 (KeyboardEngine에서 사용)
    isRunning?(): boolean;
    getEventCount?(): number;
    enableLoopMode?(): void;
    disableLoopMode?(): void;
    setLanguage?(lang: 'ko' | 'en' | 'ja' | 'zh'): void;
  }

  // 🔥 기가차드 메인 uIOhook 익스포트 (싱글톤 패턴)
  export const uIOhook: UiohookInstance;
  export default uIOhook;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    // 🔥 추가 기가차드 글로벌 API
    __LOOP_APP_VERSION__?: string;
    __LOOP_DEBUG_MODE__?: boolean;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      ELECTRON_IS_DEV?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      // 🔥 Loop 특화 환경변수
      LOOP_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
      LOOP_DATA_DIR?: string;
      LOOP_AUTO_START?: 'true' | 'false';
    }
  }

  // 🔥 한국어/일본어/중국어 지원을 위한 타입 확장
  interface String {
    toHangul?(): string;
    toHiragana?(): string;
    toKatakana?(): string;
  }
}

// 🔥 기가차드 키보드 언어 지원 타입
export interface KeyboardLanguage {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  composition: boolean; // 조합형 언어 여부 (한글, 일본어 등)
}

// 🔥 다국어 키 매핑 타입
export interface KeyMapping {
  language: string;
  keyCode: number;
  char: string;
  composed?: string; // 조합된 문자 (한글의 경우)
  alternatives?: string[]; // 대체 입력 가능한 문자들
}

// 모듈로 만들기 위해 필요
export {};

// 🔥 Window 인터페이스 확장 (Electron API 노출)
declare global {
  interface Window {
    electronAPI: import('../shared/types').ElectronAPI;
  }

  namespace globalThis {
    var unifiedHandler: {
      // 실시간 통계 메서드
      getRealtimeStats(): {
        currentWpm: number;
        averageWpm: number;
        peakWpm: number;
        totalKeys: number;
        sessionTime: number;
      };
      
      // 윈도우 관련 메서드  
      getCurrentWindow(): {
        title: string;
        pid: number;
        path: string;
      } | null;
      
      // 모니터링 제어
      pauseMonitoring(): void;
      resumeMonitoring(): void;
      
      // 배터리 최적화
      setBatteryOptimization(enabled: boolean): void;
      
      // 백그라운드 활동 제어
      reduceBackgroundActivity(): void;
      
      // 상태 체크
      isActive(): boolean;
    } | undefined;
    
    var windowTracker: import('../main/keyboard/WindowTracker').WindowTracker | undefined;
    var databaseManager: import('../main/managers/DatabaseManager').DatabaseManager | undefined;
  }
}
