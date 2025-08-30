// 🔥 기가차드 테스트 설정 - 완벽한 테스트 환경 구성

import '@testing-library/jest-dom';

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

// 🔧 uiohook-napi 모킹
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
