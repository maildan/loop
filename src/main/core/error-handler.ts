// 🔥 기가차드 에러 핸들러 - 전역 에러 처리 시스템

import { Logger } from '../../shared/logger';
import { app } from 'electron';

// #DEBUG: Error handler entry point
Logger.debug('ERROR_HANDLER', 'Error handler module loaded');

// 🔥 기가차드 에러 타입 정의
export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: Date;
  component: string;
  context?: Record<string, unknown>;
}

// 🔥 기가차드 에러 핸들러 클래스
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorInfo[] = [];
  private maxErrors = 100;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // 🔥 전역 에러 핸들러 설정
  private setupGlobalErrorHandlers(): void {
    // #DEBUG: Setting up global error handlers
    Logger.debug('ERROR_HANDLER', 'Setting up global error handlers');

    // Uncaught Exception 처리
    process.on('uncaughtException', (error: Error) => {
      this.handleUncaughtException(error);
    });

    // Unhandled Promise Rejection 처리
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      this.handleUnhandledRejection(reason, promise);
    });

    // Warning 처리
    process.on('warning', (warning: Error) => {
      this.handleWarning(warning);
    });

    Logger.info('ERROR_HANDLER', 'Global error handlers setup completed');
  }

  // 🔥 Uncaught Exception 처리
  private handleUncaughtException(error: Error): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      component: 'UNCAUGHT_EXCEPTION',
      context: {
        name: error.name,
        cause: (error as any).cause,
      }
    };

    this.logError(errorInfo);
    this.addToQueue(errorInfo);

    Logger.error('ERROR_HANDLER', 'Uncaught exception occurred', {
      message: error.message,
      stack: error.stack
    });

    // 앱 종료 (치명적 에러)
    this.gracefulShutdown();
  }

  // 🔥 Unhandled Promise Rejection 처리
  private handleUnhandledRejection(reason: unknown, promise: Promise<unknown>): void {
    const errorMessage = reason instanceof Error 
      ? reason.message 
      : String(reason);

    const errorInfo: ErrorInfo = {
      message: `Unhandled Promise Rejection: ${errorMessage}`,
      stack: reason instanceof Error ? reason.stack : undefined,
      timestamp: new Date(),
      component: 'UNHANDLED_REJECTION',
      context: {
        reason: reason instanceof Error ? reason.name : typeof reason,
        promise: promise.toString(),
      }
    };

    this.logError(errorInfo);
    this.addToQueue(errorInfo);

    Logger.error('ERROR_HANDLER', 'Unhandled promise rejection', {
      reason: errorMessage,
      stack: reason instanceof Error ? reason.stack : 'No stack trace'
    });
  }

  // 🔥 Warning 처리
  private handleWarning(warning: Error): void {
    const errorInfo: ErrorInfo = {
      message: warning.message,
      stack: warning.stack,
      timestamp: new Date(),
      component: 'WARNING',
      context: {
        name: warning.name,
      }
    };

    this.logError(errorInfo);
    
    Logger.warn('ERROR_HANDLER', 'Process warning', {
      message: warning.message,
      name: warning.name
    });
  }

  // 🔥 커스텀 에러 처리
  public handleCustomError(
    error: Error | string, 
    component: string, 
    context?: Record<string, unknown>
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    const errorInfo: ErrorInfo = {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date(),
      component,
      context,
    };

    this.logError(errorInfo);
    this.addToQueue(errorInfo);

    Logger.error('ERROR_HANDLER', `Custom error in ${component}`, {
      message: errorMessage,
      context
    });
  }

  // 🔥 에러 로깅
  private logError(errorInfo: ErrorInfo): void {
    // #DEBUG: Logging error using Logger system
    Logger.error(errorInfo.component, `Error: ${errorInfo.message}`, {
      stack: errorInfo.stack,
      context: errorInfo.context,
      timestamp: errorInfo.timestamp
    });
  }

  // 🔥 에러 큐에 추가
  private addToQueue(errorInfo: ErrorInfo): void {
    this.errorQueue.push(errorInfo);

    // 큐 크기 제한
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue.shift();
    }
  }

  // 🔥 에러 목록 가져오기
  public getErrors(): ErrorInfo[] {
    return [...this.errorQueue];
  }

  // 🔥 에러 개수 가져오기
  public getErrorCount(): number {
    return this.errorQueue.length;
  }

  // 🔥 에러 큐 정리
  public clearErrors(): void {
    this.errorQueue = [];
    Logger.info('ERROR_HANDLER', 'Error queue cleared');
  }

  // 🔥 앱 안전 종료
  private gracefulShutdown(): void {
    Logger.error('ERROR_HANDLER', 'Initiating graceful shutdown due to critical error');

    // 잠깐 대기 후 종료 (로그 처리 시간 확보)
    setTimeout(() => {
      app.quit();
    }, 1000);
  }

  // 🔥 에러 통계 가져오기
  public getErrorStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    this.errorQueue.forEach(error => {
      stats[error.component] = (stats[error.component] || 0) + 1;
    });

    return stats;
  }
}

// 🔥 기가차드 전역 에러 핸들러 초기화
export const errorHandler = ErrorHandler.getInstance();

// #DEBUG: Error handler module exit point
Logger.debug('ERROR_HANDLER', 'Error handler module setup complete');

export default errorHandler;
