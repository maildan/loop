// 🔥 기가차드 IPC 핸들러 유틸리티 - 중복 코드 박멸!

import { Logger } from '../shared/logger';
import { IpcResponse } from '../shared/types';

// #DEBUG: IPC Utils module entry point
Logger.debug('IPC_UTILS', 'IPC Utils module loaded');

// 🔥 기가차드 IPC 핸들러 래퍼 타입
export type AsyncIpcHandler<T = unknown> = (...args: unknown[]) => Promise<T>;
export type SyncIpcHandler<T = unknown> = (...args: unknown[]) => T;

// 🔥 기가차드 동기 IPC 핸들러 래퍼
export function createSafeIpcHandler<T>(
  handler: (...args: unknown[]) => T,
  component: string,
  operation: string
): (...args: unknown[]) => IpcResponse<T> {
  // #DEBUG: Creating safe IPC handler
  return (...args: unknown[]): IpcResponse<T> => {
    try {
      Logger.debug(component, `${operation} starting`);
      const result = handler(...args);
      
      Logger.debug(component, `${operation} completed successfully`);
      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(component, `Failed to ${operation.toLowerCase()}`, error);
      return {
        success: false,
        error: `Failed to ${operation.toLowerCase()}`,
        timestamp: new Date(),
      };
    }
  };
}

// 🔥 기가차드 비동기 IPC 핸들러 래퍼
export function createSafeAsyncIpcHandler<T>(
  handler: (...args: unknown[]) => Promise<T>,
  component: string,
  operation: string
): (...args: unknown[]) => Promise<IpcResponse<T>> {
  // #DEBUG: Creating safe async IPC handler
  return async (...args: unknown[]): Promise<IpcResponse<T>> => {
    try {
      Logger.debug(component, `${operation} starting`);
      const result = await handler(...args);
      
      Logger.debug(component, `${operation} completed successfully`);
      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(component, `Failed to ${operation.toLowerCase()}`, error);
      return {
        success: false,
        error: `Failed to ${operation.toLowerCase()}`,
        timestamp: new Date(),
      };
    }
  };
}

// 🔥 기가차드 void 반환용 IPC 핸들러 래퍼
export function createSafeVoidIpcHandler(
  handler: (...args: unknown[]) => void,
  component: string,
  operation: string
): (...args: unknown[]) => IpcResponse<void> {
  // #DEBUG: Creating safe void IPC handler
  return (...args: unknown[]): IpcResponse<void> => {
    try {
      Logger.debug(component, `${operation} starting`);
      handler(...args);
      
      Logger.debug(component, `${operation} completed successfully`);
      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(component, `Failed to ${operation.toLowerCase()}`, error);
      return {
        success: false,
        error: `Failed to ${operation.toLowerCase()}`,
        timestamp: new Date(),
      };
    }
  };
}

// 🔥 기가차드 파라미터가 있는 IPC 핸들러 래퍼
export function createSafeParameterizedIpcHandler<TParams, TResult>(
  handler: (params: TParams) => TResult | Promise<TResult>,
  component: string,
  operation: string
): (params: TParams) => Promise<IpcResponse<TResult>> {
  // #DEBUG: Creating safe parameterized IPC handler
  return async (params: TParams): Promise<IpcResponse<TResult>> => {
    try {
      Logger.debug(component, `${operation} starting`, { params });
      const result = await handler(params);
      
      Logger.debug(component, `${operation} completed successfully`);
      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error(component, `Failed to ${operation.toLowerCase()}`, error);
      return {
        success: false,
        error: `Failed to ${operation.toLowerCase()}`,
        timestamp: new Date(),
      };
    }
  };
}

// 🔥 기가차드 IPC 에러 응답 생성기
export function createErrorResponse(
  error: string | Error,
  component: string,
  operation: string
): IpcResponse<never> {
  // #DEBUG: Creating error response
  const errorMessage = typeof error === 'string' ? error : error.message;
  Logger.error(component, `IPC Error in ${operation}`, error);
  
  return {
    success: false,
    error: errorMessage,
    timestamp: new Date(),
  };
}

// 🔥 기가차드 IPC 성공 응답 생성기
export function createSuccessResponse<T>(
  data: T,
  component: string,
  operation: string
): IpcResponse<T> {
  // #DEBUG: Creating success response
  Logger.debug(component, `IPC Success in ${operation}`);
  
  return {
    success: true,
    data,
    timestamp: new Date(),
  };
}

// #DEBUG: IPC Utils module setup complete
Logger.debug('IPC_UTILS', 'IPC Utils module setup complete');
