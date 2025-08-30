// 🔥 기가차드 앱 라이프사이클 관리자 - 앱 생명주기 통합 관리

import { app, BrowserWindow } from 'electron';
import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Platform } from '../utils/platform';

// #DEBUG: App lifecycle manager entry point
Logger.debug('APP_LIFECYCLE', 'App lifecycle manager module loaded');

// 🔥 기가차드 앱 상태 열거형
export enum AppState {
  STARTING = 'starting',
  READY = 'ready',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  QUITTING = 'quitting',
  CRASHED = 'crashed',
}

// 🔥 기가차드 라이프사이클 이벤트
export interface LifecycleEvent {
  type: string;
  timestamp: Date;
  state: AppState;
  data?: unknown;
}

// 🔥 기가차드 앱 메트릭스
export interface AppMetrics {
  startTime: Date;
  uptime: number;
  state: AppState;
  windowCount: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  eventCount: number;
  crashCount: number;
  lastActivity: Date | null;
}

/**
 * 🔥 AppLifecycle - 앱 생명주기 이벤트 관리
 * 시작, 종료, 상태 변화, 크래시 복구 등 관리
 */
export class AppLifecycle extends BaseManager {
  private readonly componentName = 'APP_LIFECYCLE';
  private currentState: AppState = AppState.STARTING;
  private events: LifecycleEvent[] = [];
  private readonly maxEvents = 1000;
  private startTime: Date = new Date();
  private crashCount = 0;
  private isQuitting = false;
  private beforeQuitHandlers: Array<() => Promise<void>> = [];
  private onActivateHandlers: Array<() => Promise<void>> = [];
  private onDeactivateHandlers: Array<() => Promise<void>> = [];
  private metricsInterval: NodeJS.Timeout | null = null;

  constructor() {
    super({ name: 'AppLifecycle', autoStart: true });
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing app lifecycle manager');
    
    this.setupElectronEventHandlers();
    this.setupProcessEventHandlers();
    this.startPeriodicMetricsCollection();
    
    this.addEvent('app-initialized', AppState.READY);
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting app lifecycle manager');
    this.setState(AppState.READY);
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping app lifecycle manager');
    this.setState(AppState.QUITTING);
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up app lifecycle manager');
    
    // 🔥 메트릭스 수집 타이머 정리
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    
    this.events.length = 0;
    this.beforeQuitHandlers.length = 0;
    this.onActivateHandlers.length = 0;
    this.onDeactivateHandlers.length = 0;
  }

  /**
   * Electron 이벤트 핸들러 설정
   */
  private setupElectronEventHandlers(): void {
    // 앱 준비됨
    app.on('ready', () => {
      Logger.info(this.componentName, 'App ready event received');
      this.setState(AppState.READY);
      this.addEvent('app-ready', AppState.READY);
    });

    // 앱 활성화 (macOS)
    app.on('activate', async () => {
      Logger.info(this.componentName, 'App activated');
      this.setState(AppState.ACTIVE);
      this.addEvent('app-activated', AppState.ACTIVE);
      
      // 활성화 핸들러 실행
      for (const handler of this.onActivateHandlers) {
        try {
          await handler();
        } catch (error) {
          Logger.error(this.componentName, 'Activate handler failed', error);
        }
      }
    });

    // 윈도우 모두 닫힘
    app.on('window-all-closed', () => {
      Logger.info(this.componentName, 'All windows closed');
      this.addEvent('windows-all-closed', this.currentState);
      
      // macOS가 아니면 앱 종료
      if (!Platform.isMacOS()) {
        this.gracefulQuit();
      }
    });

    // 앱 종료 전
    app.on('before-quit', async (event: Electron.Event) => {
      if (!this.isQuitting) {
        Logger.info(this.componentName, 'Before quit event received');
        event.preventDefault();
        
        this.isQuitting = true;
        this.setState(AppState.QUITTING);
        this.addEvent('before-quit', AppState.QUITTING);
        
        // 종료 전 핸들러 실행
        await this.executeBforeQuitHandlers();
        
        // 실제 종료
        app.quit();
      }
    });

    // 앱 종료
    app.on('will-quit', () => {
      Logger.info(this.componentName, 'App will quit');
      this.addEvent('will-quit', AppState.QUITTING);
    });

    // 앱 활성화됨 (포커스)
    app.on('browser-window-focus', () => {
      this.setState(AppState.ACTIVE);
      this.addEvent('window-focused', AppState.ACTIVE);
    });

    // 앱 비활성화됨 (포커스 해제)
    app.on('browser-window-blur', async () => {
      this.setState(AppState.INACTIVE);
      this.addEvent('window-blurred', AppState.INACTIVE);
      
      // 비활성화 핸들러 실행
      for (const handler of this.onDeactivateHandlers) {
        try {
          await handler();
        } catch (error) {
          Logger.error(this.componentName, 'Deactivate handler failed', error);
        }
      }
    });

    // 렌더러 프로세스 크래시
    app.on('render-process-gone', (event: any, webContents: any, details: any) => {
      Logger.error(this.componentName, 'Renderer process crashed', details);
      this.crashCount++;
      this.setState(AppState.CRASHED);
      this.addEvent('renderer-crashed', AppState.CRASHED, details);
      
      // 크래시 복구 시도
      this.handleRendererCrash(webContents);
    });

    // 자식 프로세스 크래시
    app.on('child-process-gone', (event: any, details: any) => {
      Logger.error(this.componentName, 'Child process crashed', details);
      this.crashCount++;
      this.addEvent('child-process-crashed', this.currentState, details);
    });
  }

  /**
   * 프로세스 이벤트 핸들러 설정
   */
  private setupProcessEventHandlers(): void {
    // 처리되지 않은 예외
    process.on('uncaughtException', (error) => {
      Logger.error(this.componentName, 'Uncaught exception', error);
      this.crashCount++;
      this.setState(AppState.CRASHED);
      this.addEvent('uncaught-exception', AppState.CRASHED, { error: error.message });
    });

    // 처리되지 않은 Promise 거부
    process.on('unhandledRejection', (reason, promise) => {
      Logger.error(this.componentName, 'Unhandled promise rejection', { reason, promise });
      this.addEvent('unhandled-rejection', this.currentState, { reason });
    });

    // 시스템 신호 (SIGINT, SIGTERM)
    process.on('SIGINT', () => {
      Logger.info(this.componentName, 'SIGINT received');
      this.gracefulQuit();
    });

    process.on('SIGTERM', () => {
      Logger.info(this.componentName, 'SIGTERM received');
      this.gracefulQuit();
    });
  }

  /**
   * 주기적 메트릭스 수집 (무한루프 방지)
   */
  private startPeriodicMetricsCollection(): void {
    // 🔥 기존 interval 정리
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }

    // 개발 모드에서는 간격을 늘림 (5분)
    const interval = process.env.NODE_ENV === 'development' ? 300000 : 60000;
    
    this.metricsInterval = setInterval(() => {
      try {
        // 🔥 매니저가 실행 중일 때만 수집
        if (this.isRunning()) {
          this.addEvent('metrics-collected', this.currentState, {
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            uptime: process.uptime(),
          });
        }
      } catch (error) {
        Logger.error(this.componentName, 'Metrics collection failed', error);
      }
    }, interval);
    
    Logger.debug(this.componentName, `Metrics collection setup with ${interval/1000}s interval`);
  }

  /**
   * 앱 상태 변경
   */
  private setState(newState: AppState): void {
    if (this.currentState !== newState) {
      const previousState = this.currentState;
      this.currentState = newState;
      
      Logger.info(this.componentName, 'App state changed', {
        from: previousState,
        to: newState,
      });
      
      this.emit('stateChange', { from: previousState, to: newState });
    }
  }

  /**
   * 라이프사이클 이벤트 추가
   */
  private addEvent(type: string, state: AppState, data?: unknown): void {
    const event: LifecycleEvent = {
      type,
      timestamp: new Date(),
      state,
      data,
    };

    this.events.push(event);
    
    // 이벤트 개수 제한
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    this.emit('lifecycleEvent', event);
  }

  /**
   * 우아한 종료
   */
  public async gracefulQuit(): Promise<void> {
    if (this.isQuitting) return;
    
    Logger.info(this.componentName, 'Starting graceful quit');
    this.isQuitting = true;
    this.setState(AppState.QUITTING);
    
    try {
      await this.executeBforeQuitHandlers();
      app.quit();
    } catch (error) {
      Logger.error(this.componentName, 'Error during graceful quit', error);
      app.exit(1);
    }
  }

  /**
   * 종료 전 핸들러 실행
   */
  private async executeBforeQuitHandlers(): Promise<void> {
    Logger.info(this.componentName, 'Executing before quit handlers', {
      count: this.beforeQuitHandlers.length,
    });

    const promises = this.beforeQuitHandlers.map(async (handler, index) => {
      try {
        await Promise.race([
          handler(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Handler timeout')), 5000)
          )
        ]);
        Logger.debug(this.componentName, `Before quit handler ${index} completed`);
      } catch (error) {
        Logger.error(this.componentName, `Before quit handler ${index} failed`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * 렌더러 크래시 처리
   */
  private handleRendererCrash(webContents: Electron.WebContents): void {
    Logger.info(this.componentName, 'Attempting renderer crash recovery');
    
    try {
      // 웹 컨텐츠 다시 로드
      if (!webContents.isDestroyed()) {
        webContents.reload();
        Logger.info(this.componentName, 'Renderer reloaded successfully');
        this.setState(AppState.ACTIVE);
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to recover from renderer crash', error);
    }
  }

  /**
   * 종료 전 핸들러 등록
   */
  public onBeforeQuit(handler: () => Promise<void>): void {
    this.beforeQuitHandlers.push(handler);
  }

  /**
   * 활성화 핸들러 등록
   */
  public onActivate(handler: () => Promise<void>): void {
    this.onActivateHandlers.push(handler);
  }

  /**
   * 비활성화 핸들러 등록
   */
  public onDeactivate(handler: () => Promise<void>): void {
    this.onDeactivateHandlers.push(handler);
  }

  /**
   * 현재 앱 상태 조회
   */
  public getAppState(): AppState {
    return this.currentState;
  }

  /**
   * 앱 메트릭스 조회
   */
  public getAppMetrics(): AppMetrics {
    const now = Date.now();
    const uptime = now - this.startTime.getTime();
    
    return {
      startTime: this.startTime,
      uptime,
      state: this.currentState,
      windowCount: BrowserWindow.getAllWindows().length,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      eventCount: this.events.length,
      crashCount: this.crashCount,
      lastActivity: (() => {
        const lastEvent = this.events.length > 0 ? this.events[this.events.length - 1] : null;
        return lastEvent ? lastEvent.timestamp : null;
      })(),
    };
  }

  /**
   * 라이프사이클 이벤트 조회
   */
  public getEvents(limit = 100): LifecycleEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * 특정 타입 이벤트 조회
   */
  public getEventsByType(type: string): LifecycleEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * 앱 재시작
   */
  public restartApp(): void {
    Logger.info(this.componentName, 'Restarting application');
    this.addEvent('app-restart', this.currentState);
    
    app.relaunch();
    app.exit(0);
  }

  /**
   * 앱이 종료 중인지 확인
   */
  public isQuittingApp(): boolean {
    return this.isQuitting;
  }
}

// 🔥 기가차드 전역 앱 라이프사이클 관리자
export const appLifecycle = new AppLifecycle();

// #DEBUG: App lifecycle manager exit point
Logger.debug('APP_LIFECYCLE', 'App lifecycle manager module setup complete');

export default appLifecycle;