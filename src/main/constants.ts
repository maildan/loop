// 🔥 기가차드 메인 프로세스 상수 정의

import { Logger } from '../shared/logger';

// #DEBUG: Constants module entry point
Logger.debug('CONSTANTS', 'Constants module loaded');

// 🔥 기가차드 앱 메타데이터
export const APP_METADATA = {
  NAME: 'Loop',
  VERSION: '1.0.0',
  DESCRIPTION: 'Real-time typing analytics for enhanced productivity',
  AUTHOR: 'Loop Development Team',
  HOMEPAGE: 'https://loop.app',
  ELECTRON_MIN_VERSION: '24.0.0',
} as const;

// 🔥 기가차드 파일 경로 상수
export const FILE_PATHS = {
  CONFIG: {
    APP: 'app-config.json',
    KEYBOARD: 'keyboard-config.json',
    USER_PREFERENCES: 'user-preferences.json',
  },
  LOGS: {
    DIRECTORY: 'logs',
    APP: 'app.log',
    KEYBOARD: 'keyboard.log',
    ERROR: 'error.log',
  },
  DATABASE: {
    MAIN: 'loop.db',
    BACKUP: 'loop-backup.db',
  },
  ASSETS: {
    ICON_ICO: 'assets/icon.ico',
    ICON_ICNS: 'assets/icon.icns',
    ICON_PNG: 'assets/icon.png',
    TRAY_ICON: 'assets/tray.png',
  },
} as const;

// 🔥 기가차드 윈도우 설정 상수
export const WINDOW_SETTINGS = {
  MAIN: {
    WIDTH: 1200,
    HEIGHT: 800,
    MIN_WIDTH: 800,
    MIN_HEIGHT: 600,
    RESIZABLE: true,
    CLOSABLE: true,
  },
  SPLASH: {
    WIDTH: 400,
    HEIGHT: 300,
    RESIZABLE: false,
    FRAME: false,
    ALWAYS_ON_TOP: true,
  },
  TRAY: {
    WIDTH: 300,
    HEIGHT: 400,
    FRAME: false,
    SKIP_TASKBAR: true,
  },
} as const;

// 🔥 기가차드 키보드 모니터링 상수
export const KEYBOARD_CONSTANTS = {
  BUFFER: {
    MAX_SIZE: 1000,
    FLUSH_INTERVAL: 5000, // 5초
    BATCH_SIZE: 50,
  },
  EVENTS: {
    DEBOUNCE_MS: 10,
    THROTTLE_MS: 16, // 60fps
    MAX_KEY_LENGTH: 50,
  },
  LANGUAGES: {
    DEFAULT: 'en',
    SUPPORTED: ['ko', 'ja', 'zh', 'en'] as const,
    COMPOSITION_LANGUAGES: ['ko', 'ja', 'zh'] as const,
  },
  WPM: {
    WORDS_PER_MINUTE_DIVISOR: 5, // 평균 단어 길이
    MIN_CHARS_FOR_WPM: 10,
    CALCULATION_INTERVAL: 1000, // 1초
  },
} as const;

// 🔥 기가차드 성능 임계값 상수
export const PERFORMANCE_THRESHOLDS = {
  MEMORY: {
    WARNING_MB: 100,
    CRITICAL_MB: 200,
    GC_TRIGGER_MB: 150,
  },
  CPU: {
    WARNING_PERCENT: 50,
    CRITICAL_PERCENT: 80,
  },
  EVENTS: {
    MAX_PER_SECOND: 100,
    BUFFER_WARNING_SIZE: 500,
    BUFFER_CRITICAL_SIZE: 800,
  },
} as const;

// 🔥 기가차드 보안 설정 상수
export const SECURITY_SETTINGS = {
  CSP: {
    DEFAULT_SRC: "'self'",
    SCRIPT_SRC: "'self' 'unsafe-inline'",
    STYLE_SRC: "'self' 'unsafe-inline'",
    IMG_SRC: "'self' data: https:",
    CONNECT_SRC: "'self'",
  },
  PERMISSIONS: {
    WEBGL: false,
    MEDIA: false,
    GEOLOCATION: false,
    MICROPHONE: false,
    CAMERA: false,
    MIDI_SYSEX: false,
    PUSH_MESSAGING: false,
    KEYBOARD_LOCK: false,
    POINTER_LOCK: false,
  },
  NAVIGATION: {
    ALLOWED_ORIGINS: ['https://loop.app'],
    BLOCK_NEW_WINDOW: true,
    BLOCK_EXTERNAL_NAVIGATION: true,
  },
} as const;

// 🔥 기가차드 개발 도구 상수
export const DEV_TOOLS = {
  AUTO_OPEN: false,
  ALLOWED_IN_PRODUCTION: false,
  SHORTCUT: 'CommandOrControl+Shift+I',
  EXTENSIONS: {
    REACT_DEVTOOLS: false,
    REDUX_DEVTOOLS: false,
  },
} as const;

// 🔥 기가차드 네트워크 상수
export const NETWORK_SETTINGS = {
  TIMEOUT: {
    REQUEST: 10000, // 10초
    CONNECTION: 5000, // 5초
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    EXPONENTIAL_BACKOFF: true,
  },
  USER_AGENT: `${APP_METADATA.NAME}/${APP_METADATA.VERSION}`,
} as const;

// 🔥 기가차드 기본 내보내기
const CONSTANTS = {
  APP_METADATA,
  FILE_PATHS,
  WINDOW_SETTINGS,
  KEYBOARD_CONSTANTS,
  PERFORMANCE_THRESHOLDS,
  SECURITY_SETTINGS,
  DEV_TOOLS,
  NETWORK_SETTINGS,
} as const;

// #DEBUG: Constants module exit point
Logger.debug('CONSTANTS', 'Constants module setup complete', {
  totalConstants: Object.keys(CONSTANTS).length,
});

export default CONSTANTS;
