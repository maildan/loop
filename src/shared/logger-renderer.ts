// 🔥 기가차드 렌더러 로거 (logger.ts와 동일 기능 수준)
import { getComponentName } from './logger-utils';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  component: string;
  message: string;
  data?: unknown;
  timestamp: Date;
}

class RendererLoggerService {
  private logLevel: LogLevel = LogLevel.DEBUG;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private timers: Map<string, number> = new Map();

  constructor() {
    // 🔥 렌더러 환경에서는 DEBUG 레벨 기본값 (process.env 접근 불가)
    this.logLevel = LogLevel.DEBUG;
  }

  private log(level: LogLevel, component: string | symbol, message: string, data?: unknown): void {
    if (level < this.logLevel) return;

    const componentName = getComponentName(component);

    const entry: LogEntry = {
      level,
      component: componentName,
      message,
      data,
      timestamp: new Date(),
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 🔥 렌더러 환경 감지 (window.location, localStorage)
    const isDevelopment =
      typeof window !== 'undefined' &&
      window.location &&
      (window.location.hostname === 'localhost' || window.location.hostname.startsWith('127.0.0.1'));

    // 🔥 Verbose 모드 체크 (localStorage 안전 접근)
    let verboseMode = false;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        verboseMode = window.localStorage.getItem('VERBOSE_LOGGING') === 'true';
      }
    } catch {
      // localStorage 차단된 경우 무시
    }

    // 🔥 강제 출력: 개발 모드에서는 DEBUG도 표시
    const forceOutput = isDevelopment;

    if (level >= this.logLevel || forceOutput) {
      const timestamp = entry.timestamp.toISOString();
      const levelName = LogLevel[level];
      const prefix = `[${timestamp}] ${levelName} [${componentName}]`;

      // 🔥 Emoji 아이콘 출력 (logger.ts와 동일)
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`🔍 ${prefix}`, message, verboseMode && data ? data : '');
          break;
        case LogLevel.INFO:
          console.info(`ℹ️ ${prefix}`, message, verboseMode && data ? data : '');
          break;
        case LogLevel.WARN:
          console.warn(`⚠️ ${prefix}`, message, verboseMode && data ? data : '');
          break;
        case LogLevel.ERROR:
          console.error(`❌ ${prefix}`, message, verboseMode && data ? data : '');
          break;
      }
    }
  }

  debug(component: string | symbol, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, component, message, data);
  }

  info(component: string | symbol, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, component, message, data);
  }

  warn(component: string | symbol, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, component, message, data);
  }

  error(component: string | symbol, message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, component, message, data);
  }

  // 🔥 타이머 유틸 (logger.ts와 동일)
  startTimer(component: string | symbol, label: string): void {
    const componentName = getComponentName(component);
    const key = `${componentName}:${label}`;
    this.timers.set(key, Date.now());
    this.debug(component, `⏱️ Timer started: ${label}`);
  }

  endTimer(component: string | symbol, label: string): number {
    const componentName = getComponentName(component);
    const key = `${componentName}:${label}`;
    const start = this.timers.get(key);
    if (!start) {
      this.warn(component, `⏱️ Timer not found: ${label}`);
      return 0;
    }

    const duration = Date.now() - start;
    this.timers.delete(key);
    this.info(component, `⏱️ Timer ended: ${label}`, { duration });
    return duration;
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

// 🔥 싱글톤 인스턴스
const rendererLoggerInstance = new RendererLoggerService();

// 🔥 logger.ts와 호환되는 export (RendererLogger + Logger alias)
export const RendererLogger = rendererLoggerInstance;
export const Logger = rendererLoggerInstance;

export default RendererLogger;