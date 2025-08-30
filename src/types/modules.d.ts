// src/types/modules.d.ts

// Electron 관련 모듈들
declare module 'electron-is-dev' {
  const isDev: boolean;
  export default isDev;
}

declare module 'electron-store' {
  interface Options<T> {
    defaults?: T;
    name?: string;
    cwd?: string;
    encryptionKey?: string;
    clearInvalidConfig?: boolean;
  }

  class Store<T = Record<string, unknown>> {
    constructor(options?: Options<T>);
    get<K extends keyof T>(key: K): T[K];
    get<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
    set<K extends keyof T>(key: K, value: T[K]): void;
    set(object: Partial<T>): void;
    delete<K extends keyof T>(key: K): void;
    clear(): void;
    has<K extends keyof T>(key: K): boolean;
    size: number;
    store: T;
  }

  export default Store;
}

// Active-win 모듈
declare module 'active-win' {
  interface ActiveWindow {
    title: string;
    id: number;
    owner: {
      name: string;
      processId: number;
      bundleId?: string;
      path?: string;
    };
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    memoryUsage: number;
  }

  interface Options {
    screenRecordingPermission?: boolean;
    accessibilityPermission?: boolean;
  }

  function activeWindow(options?: Options): Promise<ActiveWindow | undefined>;
  export default activeWindow;
}

// System Information 모듈
declare module 'systeminformation' {
  interface SystemData {
    system: {
      manufacturer: string;
      model: string;
      version: string;
      serial: string;
    };
    cpu: {
      manufacturer: string;
      brand: string;
      vendor: string;
      speed: number;
      cores: number;
    };
    mem: {
      total: number;
      free: number;
      used: number;
      active: number;
    };
  }

  export function system(): Promise<SystemData['system']>;
  export function cpu(): Promise<SystemData['cpu']>;
  export function mem(): Promise<SystemData['mem']>;
}

// Winston Logger 확장
declare module 'winston' {
  interface Logger {
    // Loop 전용 로깅 메서드
    keyboard(message: string, meta?: unknown): void;
    session(message: string, meta?: unknown): void;
    performance(message: string, meta?: unknown): void;
    security(message: string, meta?: unknown): void;
  }
}

export {};
