// 🔥 Renderer 전용 로거 시스템 (Node.js globals 미사용)
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

class RendererLoggerService {
    private logLevel: LogLevel = LogLevel.DEBUG;
    private logs: LogEntry[] = [];
    private maxLogs = 1000;
    private timers: Map<string, number> = new Map();

    constructor() {
        // 🔥 renderer 환경에서는 고정된 DEBUG 레벨 사용
        // process.env 접근 불가하므로 기본값으로 설정
        this.logLevel = LogLevel.DEBUG;
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.logLevel;
    }

    private formatMessage(level: LogLevel, component: string, message: string, data?: unknown): string {
        const timestamp = new Date().toISOString();
        const levelStr = LogLevel[level];
        const dataStr = data ? ` ${JSON.stringify(data)}` : '';
        return `[${timestamp}] ${levelStr} [${component}] ${message}${dataStr}`;
    }

    private addLog(level: LogLevel, component: string, message: string, data?: unknown): void {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            level,
            component,
            message,
            data,
            timestamp: new Date(),
        };

        this.logs.push(entry);

        // 로그 수 제한
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // 콘솔 출력
        const formattedMessage = this.formatMessage(level, component, message, data);

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(formattedMessage);
                break;
            case LogLevel.INFO:
                console.info(formattedMessage);
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage);
                break;
            case LogLevel.ERROR:
                console.error(formattedMessage);
                break;
        }
    }

    public debug(component: string, message: string, data?: unknown): void {
        this.addLog(LogLevel.DEBUG, component, message, data);
    }

    public info(component: string, message: string, data?: unknown): void {
        this.addLog(LogLevel.INFO, component, message, data);
    }

    public warn(component: string, message: string, data?: unknown): void {
        this.addLog(LogLevel.WARN, component, message, data);
    }

    public error(component: string, message: string, data?: unknown): void {
        this.addLog(LogLevel.ERROR, component, message, data);
    }

    // 🔥 Timer 기능 (성능 측정용)
    public startTimer(name: string): void {
        this.timers.set(name, performance.now());
        this.debug('TIMER', `Timer started: ${name}`);
    }

    public endTimer(name: string): void {
        const startTime = this.timers.get(name);
        if (startTime !== undefined) {
            const duration = performance.now() - startTime;
            this.timers.delete(name);
            this.info('TIMER', `Timer completed: ${name}`, { duration: `${duration.toFixed(3)}ms` });
        } else {
            this.warn('TIMER', `Timer ${name} was not found`);
        }
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public clearLogs(): void {
        this.logs = [];
    }

    public setLevel(level: LogLevel): void {
        this.logLevel = level;
    }
}

// 싱글톤 인스턴스 생성
const rendererLoggerInstance = new RendererLoggerService();

// 🔥 기존 Logger와 호환되는 인터페이스 제공
export const RendererLogger = {
    debug: (component: string, message: string, data?: unknown) =>
        rendererLoggerInstance.debug(component, message, data),
    info: (component: string, message: string, data?: unknown) =>
        rendererLoggerInstance.info(component, message, data),
    warn: (component: string, message: string, data?: unknown) =>
        rendererLoggerInstance.warn(component, message, data),
    error: (component: string, message: string, data?: unknown) =>
        rendererLoggerInstance.error(component, message, data),
    startTimer: (name: string) => rendererLoggerInstance.startTimer(name),
    endTimer: (name: string) => rendererLoggerInstance.endTimer(name),
    getLogs: () => rendererLoggerInstance.getLogs(),
    clearLogs: () => rendererLoggerInstance.clearLogs(),
    setLevel: (level: LogLevel) => rendererLoggerInstance.setLevel(level),
};

export default RendererLogger;