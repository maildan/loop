// 🔥 기가차드 타입 확장 - 중복 방지
declare module 'electron' {
  namespace Electron {
    interface BrowserWindow {
      // 커스텀 속성 추가
      loopWindowId?: string;
      loopMetadata?: Record<string, unknown>;
    }
  }
}

// 메인 프로세스 글로벌 확장
declare namespace NodeJS {
  interface Global {
    mainWindow?: import('electron').BrowserWindow;
    keyboardEngine?: import('../main/keyboard/KeyboardEngine').KeyboardEngine;
    loopApp?: import('../main/index').LoopApplication;
  }
}

export {};
