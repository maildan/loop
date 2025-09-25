// 🔥 기가차드 테스트 설정 - 완벽한 테스트 환경 구성

import '@testing-library/jest-dom';

// 🔧 Node.js fs 모듈 모킹 (Jest 환경 호환성)
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    existsSync: jest.fn().mockImplementation((path: string) => {
      // 실제 파일 시스템 확인
      try {
        return actualFs.existsSync(path);
      } catch {
        return false;
      }
    }),
    statSync: jest.fn().mockImplementation((path: string) => {
      try {
        return actualFs.statSync(path);
      } catch {
        return { isDirectory: () => false, isFile: () => false };
      }
    }),
    readdirSync: jest.fn().mockImplementation((path: string) => {
      try {
        return actualFs.readdirSync(path);
      } catch {
        return [];
      }
    })
  };
});

// 🔧 Electron 모킹
Object.defineProperty(global, 'process', {
  value: {
    ...process,
    platform: 'darwin', // 기본 플랫폼
    env: {
      ...process.env,
      NODE_ENV: 'test'
    }
  }
});

// 🌐 완전히 새로운 Mock 전략 - 직접 window에 할당
const mockStorage = new Map<string, any>();

// 🔥 완전히 새로운 Mock 전략
const electronAPIMock = {
  settings: {
    get: async (key: string) => {
      console.log(`🔧 NEW Mock GET called: ${key}`);
      const value = mockStorage.get(key);
      const result = { 
        success: true, 
        data: value !== undefined ? value : (key === 'app.fontBlacklist' ? [] : null)
      };
      console.log(`🔧 NEW Mock GET result:`, result);
      return result;
    },
    set: async (key: string, value: any) => {
      console.log(`🔧 NEW Mock SET called: ${key} =`, value);
      mockStorage.set(key, value);
      const result = { success: true };
      console.log(`🔧 NEW Mock SET result:`, result);
      return result;
    },
    getAll: async () => {
      console.log('🔧 NEW Mock GETALL called');
      const result = Array.from(mockStorage.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);
      return { success: true, data: result };
    },
    reset: async () => {
      console.log('🔧 NEW Mock RESET called');
      mockStorage.clear();
      return { success: true };
    },
    onDidChange: (listener: (payload: { keyPath: string; value: unknown; reset?: boolean }) => void) => {
      console.log('🔧 NEW Mock onDidChange called');
      return () => {}; // unsubscribe function
    }
  },
  font: {
    initialize: async () => ({ success: true, data: true }),
    getAvailableFonts: async () => ({ success: true, data: [] }),
    generateCSS: async () => ({ success: true, data: '' }),
    getFontFamily: async (familyName: string) => ({ success: true, data: null }),
    reload: async () => ({ success: true, data: true }),
    getStaticFonts: async () => ({ success: true, data: [] }),
    clearCache: async () => ({ success: true, data: true })
  }
};

// 🔥 Window에 직접 할당 (defineProperty 대신)
(window as any).electronAPI = electronAPIMock;

// 전역 함수로 Mock 저장소 리셋
(global as any).__resetMockStorage = () => {
  console.log('🔧 Global Mock Storage Reset called');
  mockStorage.clear();
};

// 테스트 간 Mock 저장소 초기화를 위한 글로벌 함수 추출
// 전역 리셋 함수 제거 (이미 위에서 정의됨)

// 🔧 Logger 모킹 (테스트 중 로그 출력 방지)
jest.mock('../src/shared/logger', () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
  }
}));

// 🔧 Electron IPC 모킹
const mockIpcMain = {
  handle: jest.fn(),
  removeAllListeners: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn()
};

const mockIpcRenderer = {
  invoke: jest.fn(),
  on: jest.fn(),
  removeAllListeners: jest.fn(),
  removeListener: jest.fn()
};

jest.mock('electron', () => ({
  app: {
    getVersion: jest.fn(() => '1.0.0'),
    getPath: jest.fn((name: string) => `/mock/path/${name}`),
    quit: jest.fn(),
    whenReady: jest.fn(() => Promise.resolve()),
    on: jest.fn(),
    setAsDefaultProtocolClient: jest.fn()
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadURL: jest.fn(),
    loadFile: jest.fn(),
    on: jest.fn(),
    webContents: {
      send: jest.fn(),
      on: jest.fn()
    },
    show: jest.fn(),
    hide: jest.fn(),
    minimize: jest.fn(),
    maximize: jest.fn(),
    close: jest.fn(),
    destroy: jest.fn(),
    isDestroyed: jest.fn(() => false)
  })),
  ipcMain: mockIpcMain,
  ipcRenderer: mockIpcRenderer,
  contextBridge: {
    exposeInMainWorld: jest.fn()
  },
  Menu: {
    setApplicationMenu: jest.fn(),
    buildFromTemplate: jest.fn()
  },
  Tray: jest.fn().mockImplementation(() => ({
    setToolTip: jest.fn(),
    setContextMenu: jest.fn(),
    destroy: jest.fn(),
    isDestroyed: jest.fn(() => false)
  })),
  globalShortcut: {
    register: jest.fn(),
    unregister: jest.fn(),
    unregisterAll: jest.fn()
  },
  clipboard: {
    readText: jest.fn(() => 'mock clipboard text'),
    writeText: jest.fn()
  },
  powerMonitor: {
    on: jest.fn(),
    removeAllListeners: jest.fn()
  }
}));

// 🔧 uiohook-napi 모킹 (프로젝트에 설치되지 않았으므로 조건부 모킹)
try {
  jest.mock('uiohook-napi', () => ({
    UiohookKey: {},
    UiohookMouseButton: {},
    UiohookWheelDirection: {},
    uIOhook: {
      start: jest.fn(() => Promise.resolve()),
      stop: jest.fn(() => Promise.resolve()),
      on: jest.fn(),
      removeAllListeners: jest.fn()
    }
  }));
} catch (error) {
  // uiohook-napi가 설치되지 않은 경우 무시
}

// 🔧 파일 시스템 모킹
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
    access: jest.fn(),
    stat: jest.fn()
  }
}));

// 🔧 path 모킹
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn((...args: string[]) => args.join('/')),
  resolve: jest.fn((...args: string[]) => '/' + args.join('/'))
}));

// 🔧 글로벌 테스트 유틸리티
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidSettingsSchema(): R;
      toBeValidIpcChannel(): R;
    }
  }
}

// 🔧 커스텀 매처
expect.extend({
  toBeValidSettingsSchema(received: unknown) {
    const isValid = received && typeof received === 'object' && !Array.isArray(received);
    
    if (isValid) {
      return {
        message: () => `expected ${received} not to be a valid settings schema`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid settings schema`,
        pass: false,
      };
    }
  },
  
  toBeValidIpcChannel(received: string) {
    const channelPattern = /^[a-z]+:[a-z-]+$/;
    const isValid = typeof received === 'string' && channelPattern.test(received);
    
    if (isValid) {
      return {
        message: () => `expected ${received} not to be a valid IPC channel`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid IPC channel (format: 'category:action')`,
        pass: false,
      };
    }
  },
});

// 🔧 테스트 전역 설정
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// 🔧 테스트 타임아웃 경고 방지
jest.setTimeout(5000);
