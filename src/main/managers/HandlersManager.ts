// 🔥 기가차드 핸들러 관리자 - IPC 핸들러 통합 관리

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { IpcResponse } from '../../shared/types';

// #DEBUG: Handlers manager entry point
Logger.debug('HANDLERS_MANAGER', 'Handlers manager module loaded');

// 🔥 기가차드 IPC 핸들러 인터페이스
export interface IpcHandler {
  channel: string;
  handler: (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown;
  once?: boolean;
}

// 🔥 기가차드 핸들러 그룹
export interface HandlerGroup {
  name: string;
  handlers: IpcHandler[];
  isRegistered: boolean;
}

// 🔥 기가차드 핸들러 통계
export interface HandlerStats {
  totalHandlers: number;
  registeredGroups: number;
  totalCalls: number;
  errorCalls: number;
  averageResponseTime: number;
  lastActivity: Date | null;
}

/**
 * 🔥 HandlersManager - IPC 핸들러 라이프사이클 관리
 * 모든 IPC 핸들러의 등록, 해제, 모니터링 담당
 */
export class HandlersManager extends BaseManager {
  private readonly componentName = 'HANDLERS_MANAGER';
  private handlerGroups: Map<string, HandlerGroup> = new Map();
  private handlerStats: Map<string, { calls: number; errors: number; totalTime: number }> = new Map();
  private globalStats: HandlerStats;

  constructor() {
    super({ name: 'HandlersManager', autoStart: true });
    this.globalStats = {
      totalHandlers: 0,
      registeredGroups: 0,
      totalCalls: 0,
      errorCalls: 0,
      averageResponseTime: 0,
      lastActivity: null,
    };
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing handlers manager');
    
    // IPC 에러 처리
    ipcMain.on('uncaught-exception', (event: Electron.IpcMainEvent, error: Error) => {
      Logger.error(this.componentName, 'Uncaught IPC exception', error);
      this.globalStats.errorCalls++;
    });
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting handlers manager');
    
    // 기본 핸들러 등록
    await this.registerDefaultHandlers();
    
    // 기존 IPC 핸들러 등록
    await this.registerExistingHandlers();
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping handlers manager');
    
    // 모든 핸들러 해제
    await this.unregisterAllHandlers();
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up handlers manager');
    
    this.handlerGroups.clear();
    this.handlerStats.clear();
  }

  /**
   * 핸들러 그룹 등록
   */
  public async registerHandlerGroup(group: Omit<HandlerGroup, 'isRegistered'>): Promise<void> {
    try {
      Logger.info(this.componentName, 'Registering handler group', { name: group.name, count: group.handlers.length });
      
      // 기존 그룹이 있으면 먼저 해제
      if (this.handlerGroups.has(group.name)) {
        await this.unregisterHandlerGroup(group.name);
      }

      const handlerGroup: HandlerGroup = {
        ...group,
        isRegistered: false,
      };

      // 각 핸들러 등록
      for (const handler of group.handlers) {
        const wrappedHandler = this.wrapHandler(handler);
        
        if (handler.once) {
          ipcMain.handleOnce(handler.channel, wrappedHandler);
        } else {
          ipcMain.handle(handler.channel, wrappedHandler);
        }

        // 통계 초기화
        this.handlerStats.set(handler.channel, {
          calls: 0,
          errors: 0,
          totalTime: 0,
        });
      }

      handlerGroup.isRegistered = true;
      this.handlerGroups.set(group.name, handlerGroup);
      
      this.updateGlobalStats();
      
      Logger.info(this.componentName, 'Handler group registered successfully', { name: group.name });
    } catch (error) {
      Logger.error(this.componentName, 'Failed to register handler group', error);
      throw error;
    }
  }

  /**
   * 핸들러 그룹 해제
   */
  public async unregisterHandlerGroup(groupName: string): Promise<void> {
    try {
      const group = this.handlerGroups.get(groupName);
      if (!group) {
        Logger.warn(this.componentName, 'Handler group not found', { name: groupName });
        return;
      }

      Logger.info(this.componentName, 'Unregistering handler group', { name: groupName });

      // 각 핸들러 해제
      for (const handler of group.handlers) {
        ipcMain.removeHandler(handler.channel);
        this.handlerStats.delete(handler.channel);
      }

      this.handlerGroups.delete(groupName);
      this.updateGlobalStats();
      
      Logger.info(this.componentName, 'Handler group unregistered successfully', { name: groupName });
    } catch (error) {
      Logger.error(this.componentName, 'Failed to unregister handler group', error);
      throw error;
    }
  }

  /**
   * 모든 핸들러 해제
   */
  private async unregisterAllHandlers(): Promise<void> {
    const groupNames = Array.from(this.handlerGroups.keys());
    
    for (const groupName of groupNames) {
      await this.unregisterHandlerGroup(groupName);
    }

    // Defensive cleanup for known channels to avoid duplicate registrations
    const knownChannels = [
      'ai:analyze-text',
      'ai:send-message',
      'ai:get-writing-help',
      'ai:improve-text',
      'ai:get-project-context',
      'ai:health-check',
      'ai:generate-suggestions',
      'ai:get-usage-stats',
      'ai:continue-writing',
      'ai:summarize-text',
    ];
    for (const channel of knownChannels) {
      try {
        ipcMain.removeHandler(channel);
      } catch {
        // ignore
      }
    }
  }

  /**
   * 핸들러 래핑 (성능 모니터링 및 에러 처리)
   */
  private wrapHandler(handler: IpcHandler): (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<IpcResponse> {
    return async (event: IpcMainInvokeEvent, ...args: unknown[]): Promise<IpcResponse> => {
      const startTime = Date.now();
      const stats = this.handlerStats.get(handler.channel);
      
      try {
        Logger.debug(this.componentName, 'IPC handler called', { 
          channel: handler.channel, 
          argsCount: args.length 
        });

        const result = await handler.handler(event, ...args);
        const responseTime = Date.now() - startTime;

        // 통계 업데이트
        if (stats) {
          stats.calls++;
          stats.totalTime += responseTime;
        }
        this.globalStats.totalCalls++;
        this.globalStats.lastActivity = new Date();
        this.updateAverageResponseTime();

        Logger.debug(this.componentName, 'IPC handler completed', { 
          channel: handler.channel, 
          responseTime 
        });

        return {
          success: true,
          data: result,
          timestamp: new Date(),
        };
      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        // 에러 통계 업데이트
        if (stats) {
          stats.errors++;
          stats.totalTime += responseTime;
        }
        this.globalStats.errorCalls++;
        this.globalStats.lastActivity = new Date();

        Logger.error(this.componentName, 'IPC handler error', {
          channel: handler.channel,
          error,
          responseTime,
        });

        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
        };
      }
    };
  }

  /**
   * 🔥 기존 IPC 핸들러 등록 - 중복 등록 방지를 위해 handlers/index.ts 사용
   */
  public async registerExistingHandlers(): Promise<void> {
    try {
      Logger.info(this.componentName, 'Using unified handler system from handlers/index.ts');
      
      // 🔥 기존 중복 등록 코드를 제거하고 단일 핸들러 시스템 사용
      const { HandlersManager: UnifiedHandlersManager } = await import('../handlers/index');
      const handlerManager = UnifiedHandlersManager.getInstance();
      
      const success = await handlerManager.setupAllHandlers();
      if (!success) {
        throw new Error('Failed to setup unified handlers');
      }
      
      Logger.info(this.componentName, 'Unified IPC handlers registered successfully');
    } catch (error) {
      Logger.error(this.componentName, 'Failed to register unified IPC handlers', error);
      throw error;
    }
  }

  /**
   * 기본 핸들러 등록
   */
  private async registerDefaultHandlers(): Promise<void> {
    const defaultGroup: Omit<HandlerGroup, 'isRegistered'> = {
      name: 'default',
      handlers: [
        {
          channel: 'handlers:get-stats',
          handler: () => this.getHandlerStats(),
        },
        {
          channel: 'handlers:get-groups',
          handler: () => this.getHandlerGroups(),
        },
        {
          channel: 'handlers:health-check',
          handler: () => this.healthCheck(),
        },
      ],
    };

    await this.registerHandlerGroup(defaultGroup);
  }

  /**
   * 전역 통계 업데이트
   */
  private updateGlobalStats(): void {
    this.globalStats.totalHandlers = Array.from(this.handlerGroups.values())
      .reduce((total, group) => total + group.handlers.length, 0);
    this.globalStats.registeredGroups = this.handlerGroups.size;
  }

  /**
   * 평균 응답 시간 업데이트
   */
  private updateAverageResponseTime(): void {
    const allStats = Array.from(this.handlerStats.values());
    const totalTime = allStats.reduce((sum, stat) => sum + stat.totalTime, 0);
    const totalCalls = allStats.reduce((sum, stat) => sum + stat.calls, 0);
    
    this.globalStats.averageResponseTime = totalCalls > 0 ? totalTime / totalCalls : 0;
  }

  /**
   * 핸들러 통계 조회
   */
  public getHandlerStats(): HandlerStats {
    return { ...this.globalStats };
  }

  /**
   * 핸들러 그룹 목록 조회
   */
  public getHandlerGroups(): HandlerGroup[] {
    return Array.from(this.handlerGroups.values());
  }

  /**
   * 특정 채널 통계 조회
   */
  public getChannelStats(channel: string): { calls: number; errors: number; averageTime: number } | null {
    const stats = this.handlerStats.get(channel);
    if (!stats) return null;

    return {
      calls: stats.calls,
      errors: stats.errors,
      averageTime: stats.calls > 0 ? stats.totalTime / stats.calls : 0,
    };
  }

  /**
   * 핸들러 존재 여부 확인
   */
  public hasHandler(channel: string): boolean {
    return Array.from(this.handlerGroups.values())
      .some(group => group.handlers.some(handler => handler.channel === channel));
  }

  /**
   * 성능이 낮은 핸들러 찾기
   */
  public getSlowHandlers(thresholdMs = 1000): Array<{ channel: string; averageTime: number }> {
    return Array.from(this.handlerStats.entries())
      .filter(([, stats]) => stats.calls > 0 && (stats.totalTime / stats.calls) > thresholdMs)
      .map(([channel, stats]) => ({
        channel,
        averageTime: stats.totalTime / stats.calls,
      }))
      .sort((a, b) => b.averageTime - a.averageTime);
  }

  /**
   * 에러율이 높은 핸들러 찾기
   */
  public getErrorProneHandlers(errorRateThreshold = 0.1): Array<{ channel: string; errorRate: number }> {
    return Array.from(this.handlerStats.entries())
      .filter(([, stats]) => {
        const total = stats.calls + stats.errors;
        return total > 0 && (stats.errors / total) > errorRateThreshold;
      })
      .map(([channel, stats]) => {
        const total = stats.calls + stats.errors;
        return {
          channel,
          errorRate: stats.errors / total,
        };
      })
      .sort((a, b) => b.errorRate - a.errorRate);
  }
}

// 🔥 기가차드 전역 핸들러 관리자
export const handlersManager = new HandlersManager();

// #DEBUG: Handlers manager exit point
Logger.debug('HANDLERS_MANAGER', 'Handlers manager module setup complete');

export default handlersManager;