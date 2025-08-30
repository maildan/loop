// 🔥 기가차드 로거 시스템
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  component: string;
  message: string;
  data?: unknown;
  timestamp: Date;
}

class LoggerService {
  private logLevel: LogLevel = LogLevel.DEBUG; // 🔥 강제로 DEBUG 레벨 활성화
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private timers: Map<string, number> = new Map();

  constructor() {
    // 🔥 환경변수 기반 로그 레벨 설정
    const envLogLevel = process.env.LOG_LEVEL?.toLowerCase();
    const debugMode = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
    
    if (debugMode || envLogLevel === 'debug') {
      this.logLevel = LogLevel.DEBUG;
    } else if (envLogLevel === 'info') {
      this.logLevel = LogLevel.INFO;
    } else if (envLogLevel === 'warn') {
      this.logLevel = LogLevel.WARN;
    } else if (envLogLevel === 'error') {
      this.logLevel = LogLevel.ERROR;
    } else {
      // 🔥 기본값: DEBUG 레벨
      this.logLevel = LogLevel.DEBUG;
    }
    
    console.log(`🔥 [LOGGER] Logger initialized - Level: ${LogLevel[this.logLevel]}, ENV: ${process.env.NODE_ENV}, DEBUG: ${process.env.DEBUG}`);
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private log(level: LogLevel, component: string, message: string, data?: unknown): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      level,
      component,
      message,
      data,
      timestamp: new Date(),
    };

    this.logs.push(entry);
    
    // 로그 개수 제한
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 🔥 콘솔 출력 - 환경변수 기반 + 강제 출력 모드
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[level];
    const prefix = `[${timestamp}] ${levelName} [${component}]`;
    const verboseMode = process.env.VERBOSE_LOGGING === 'true';

    // 🔥 강제 출력: DEBUG 레벨도 항상 표시
    const shouldForceOutput = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';

    if (level >= this.logLevel || shouldForceOutput) {
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
          console.error(`❌ ${prefix}`, message, data || '');
          break;
      }
    }
  }

  debug(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, component, message, data);
  }

  info(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, component, message, data);
  }

  warn(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, component, message, data);
  }

  error(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, component, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level >= level);
  }

  // 🔥 Timer 기능
  time(label: string): void {
    this.timers.set(label, performance.now());
    this.debug('TIMER', `Timer started: ${label}`);
  }

  timeEnd(label: string): void {
    const startTime = this.timers.get(label);
    if (startTime === undefined) {
      this.warn('TIMER', `Timer not found: ${label}`);
      return;
    }
    
    const duration = performance.now() - startTime;
    this.timers.delete(label);
    this.info('TIMER', `Timer completed: ${label}`, { duration: `${duration.toFixed(3)}ms` });
  }
}

export const Logger = new LoggerService();
