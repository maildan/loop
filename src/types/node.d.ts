// src/types/node.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // Loop 전용 환경변수
    LOOP_ENV: 'development' | 'production' | 'test';
    LOOP_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
    LOOP_DATA_DIR?: string;
    LOOP_CONFIG_PATH?: string;
    LOOP_AUTO_START?: 'true' | 'false';
    LOOP_ENABLE_DEVTOOLS?: 'true' | 'false';
    LOOP_KEYBOARD_POLLING_RATE?: string;
    LOOP_MAX_SESSION_SIZE?: string;
    LOOP_BACKUP_ENABLED?: 'true' | 'false';
    
    // Electron 관련
    ELECTRON_IS_DEV?: string;
    ELECTRON_ENABLE_LOGGING?: 'true' | 'false';
    
    // Next.js 관련
    NEXT_HOST?: string;
    NEXT_PORT?: string;
    NEXT_EXPORT?: 'true' | 'false';
  }

  interface Process {
    // 커스텀 프로세스 속성
    loopVersion?: string;
    loopStartTime?: Date;
    loopPid?: number;
  }

  // Global 네임스페이스 확장
  interface Global {
    __LOOP_DEBUG__?: boolean;
    __LOOP_VERSION__?: string;
    __LOOP_BUILD_TIME__?: string;
  }
}

// 모듈 타입 확장
declare module 'path' {
  interface PlatformPath {
    // 커스텀 경로 메서드
    loopData(): string;
    loopConfig(): string;
    loopLogs(): string;
  }
}

export {};
