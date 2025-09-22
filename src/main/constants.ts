// 🔥 기가차드 메인 프로세스 상수 정의

import { Logger } from '../shared/logger';

// #DEBUG: Constants module entry point
Logger.debug('CONSTANTS', 'Constants module loaded');

// 🔥 기가차드 앱 메타데이터
export const APP_METADATA = {
  NAME: 'Loop',
  VERSION: '1.0.0',
  DESCRIPTION: 'loop on desktop for writers',
  AUTHOR: 'Loop Development Team',
  HOMEPAGE: 'https://loop.app',
  ELECTRON_MIN_VERSION: '38.1.2',
} as const;

// 🔥 기가차드 앱 식별자 (중앙 관리)
export const APP_IDENTITY = {
  ID: 'com.loop.app',                    // 앱 ID (모든 파일에서 통일)
  NAME: 'Loop',                          // 앱 이름
  USER_MODEL_ID: 'com.loop.app',         // Windows 작업표시줄 ID
  PROTOCOL: 'com.loop.app',              // 프로토콜 스키마
} as const;

// 🔥 기가차드 포트 설정 (중앙 관리)
export const PORTS = {
  STATIC_SERVER: 35821,                  // 정적 서버 포트
  RENDERER_DEV: 4000,                    // Next.js 렌더러 개발 서버
  VITE_DEV: [5000, 5173],               // Vite 개발 서버들
  OAUTH_CALLBACK_PORT: 35821,            // OAuth 콜백 포트
} as const;

// 🔥 기가차드 CSP 정책 (중앙 관리 - 포트 기반 동적 생성)
export const CSP_POLICIES = {
  DEVELOPMENT: [
    "default-src 'self' data: blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:*",
    "style-src 'self' 'unsafe-inline' http://localhost:* https://localhost:*",
    "img-src 'self' data: blob: http://localhost:* https://localhost:* https://lh3.googleusercontent.com",
    "connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://www.googleapis.com https://oauth2.googleapis.com https://generativelanguage.googleapis.com https://api.openai.com",
    "frame-src 'self' http://localhost:* https://localhost:*",
    "worker-src 'self' blob: http://localhost:*"
  ].join('; '),
  
  PRODUCTION: [
    "default-src 'self' data:",
    `script-src 'self' 'unsafe-inline' https://accounts.google.com http://localhost:${PORTS.STATIC_SERVER}`,
    `style-src 'self' 'unsafe-inline' http://localhost:${PORTS.STATIC_SERVER} http://localhost:${PORTS.RENDERER_DEV} http://localhost:${PORTS.VITE_DEV[0]} http://localhost:${PORTS.VITE_DEV[1]}`,
    "img-src 'self' data: blob: https://ui-avatars.com https://lh3.googleusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://www.googleapis.com https://oauth2.googleapis.com https://generativelanguage.googleapis.com https://api.openai.com",
    "frame-src https://accounts.google.com",
    "worker-src 'self' blob:"
  ].join('; ')
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
    ICON_ICO: 'public/assets/icon.ico',
    ICON_ICNS: 'public/assets/icon.icns',
    ICON_PNG: 'public/assets/icon.png',
    TRAY_ICON: 'public/icon/tray.png',
    APP_ICON: 'public/assets/icon/app.icns',    // macOS 앱 아이콘
    TRAY_ICO: 'public/icon/tray.ico',           // Windows 트레이 아이콘
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
    DEFAULT: 'ko',
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
  APP_IDENTITY,
  PORTS,
  CSP_POLICIES,
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
