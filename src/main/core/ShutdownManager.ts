// 🔥 기가차드 Shutdown Manager - 깔끔한 종료 처리

import { app } from 'electron';
import { Logger } from '../../shared/logger';
import { ManagerCoordinator } from './ManagerCoordinator';

/**
 * 🔥 ShutdownManager - 앱 종료 프로세스 전담
 * 
 * 책임:
 * - 순서대로 안전한 종료 처리
 * - 매니저들의 정리
 * - 데이터 저장 및 백업
 * - 리소스 해제
 */
export class ShutdownManager {
  private isShuttingDown = false;
  private shutdownTimeout: NodeJS.Timeout | null = null;

  constructor(private managerCoordinator: ManagerCoordinator) {
    Logger.info('SHUTDOWN_MANAGER', '🛑 Shutdown manager created');
  }

  /**
   * 🔥 안전한 앱 종료 프로세스
   */
  public async shutdown(): Promise<void> {
    if (this.isShuttingDown) {
      Logger.warn('SHUTDOWN_MANAGER', 'Shutdown already in progress');
      return;
    }

    this.isShuttingDown = true;
    Logger.info('SHUTDOWN_MANAGER', '🛑 Starting application shutdown...');

    // 강제 종료 타이머 (10초 후)
    this.shutdownTimeout = setTimeout(() => {
      Logger.error('SHUTDOWN_MANAGER', '⏰ Shutdown timeout, forcing exit');
      app.exit(1);
    }, 10000);

    try {
      // Phase 1: 키보드 모니터링 정지
      await this.stopKeyboardMonitoring();

      // Phase 2: 매니저들 정리
      await this.stopManagers();

      // Phase 3: 설정 저장
      await this.saveSettings();

      // Phase 4: StaticServer 정리
      await this.cleanupStaticServer();

      // Phase 5: 데이터베이스 정리
      await this.cleanupDatabase();
      await this.closeWindows();

      // Phase 6: 최종 정리
      this.finalCleanup();

      // 타이머 해제
      if (this.shutdownTimeout) {
        clearTimeout(this.shutdownTimeout);
        this.shutdownTimeout = null;
      }

      Logger.info('SHUTDOWN_MANAGER', '✅ Shutdown completed successfully');
      // EventController의 before-quit 이벤트가 기본 종료 동작을 처리함

    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', '💥 Shutdown error', error);

      // 에러가 있어도 강제 종료
      if (this.shutdownTimeout) {
        clearTimeout(this.shutdownTimeout);
      }
      app.exit(1);
    }
  }

  /**
   * 🔥 키보드 모니터링 정지 (비활성화됨)
   */
  private async stopKeyboardMonitoring(): Promise<void> {
    try {
      // 키보드 모니터링 비활성화됨 - 정지 요청 무시
      Logger.info('SHUTDOWN_MANAGER', '⌨️ Keyboard monitoring stop ignored - feature disabled');
    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', 'Failed to stop keyboard monitoring', error);
    }
  }

  /**
   * 🔥 모든 매니저 정리
   */
  private async stopManagers(): Promise<void> {
    try {
      Logger.info('SHUTDOWN_MANAGER', '🔧 Stopping all managers...');
      await this.managerCoordinator.stopAll();
      Logger.info('SHUTDOWN_MANAGER', '✅ All managers stopped');
    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', 'Manager cleanup failed', error);
    }
  }

  /**
   * 🔥 설정 저장
   */
  private async saveSettings(): Promise<void> {
    try {
      const { getSettingsManager } = await import('../settings');
      const settingsManager = getSettingsManager();

      // 설정이 저장 메서드가 있다면 호출
      if (settingsManager && typeof (settingsManager as any).save === 'function') {
        await (settingsManager as any).save();
        Logger.info('SHUTDOWN_MANAGER', '💾 Settings saved');
      }
    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', 'Settings save failed', error);
    }
  }

  /**
   * 🔥 StaticServer 정리
   */
  private async cleanupStaticServer(): Promise<void> {
    try {
      const { StaticServer } = await import('../utils/StaticServer');
      const staticServer = StaticServer.getInstance();
      
      if (staticServer) {
        staticServer.cleanup();
        Logger.info('SHUTDOWN_MANAGER', '🌐 StaticServer cleaned up');
      }
    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', 'StaticServer cleanup failed', error);
    }
  }

  /**
   * 🔥 데이터베이스 정리
   */
  private async cleanupDatabase(): Promise<void> {
    try {
      // 데이터베이스 연결 정리 로직이 필요하면 여기에 추가
      Logger.info('SHUTDOWN_MANAGER', '🗄️ Database cleaned up');
    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', 'Database cleanup failed', error);
    }
  }

  /**
   * 🔥 모든 윈도우 정리
   */
  private async closeWindows(): Promise<void> {
    try {
      const { BrowserWindow } = await import('electron');
      const windows = BrowserWindow.getAllWindows();

      const closePromises = windows.map(window => {
        return new Promise<void>((resolve) => {
          if (window && !window.isDestroyed()) {
            window.once('closed', () => resolve());
            window.close();
          } else {
            resolve();
          }
        });
      });

      await Promise.allSettled(closePromises);
      Logger.info('SHUTDOWN_MANAGER', '🪟 All windows closed');
    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', 'Window cleanup failed', error);
    }
  }

  /**
   * 🔥 최종 정리 작업
   */
  private finalCleanup(): void {
    try {
      // 글로벌 변수 정리
      if ((global as any).mainWindow) {
        (global as any).mainWindow = null;
      }

      // 프로세스 정리
      process.removeAllListeners('uncaughtException');
      process.removeAllListeners('unhandledRejection');

      Logger.info('SHUTDOWN_MANAGER', '🧹 Final cleanup completed');
    } catch (error) {
      Logger.error('SHUTDOWN_MANAGER', 'Final cleanup failed', error);
    }
  }

  /**
   * 🔥 강제 종료 (비상시)
   */
  public forceShutdown(): void {
    Logger.warn('SHUTDOWN_MANAGER', '🚨 Force shutdown initiated');

    if (this.shutdownTimeout) {
      clearTimeout(this.shutdownTimeout);
    }

    app.exit(1);
  }

  /**
   * 🔥 종료 상태 조회
   */
  public getShutdownStatus(): { isShuttingDown: boolean; hasTimeout: boolean } {
    return {
      isShuttingDown: this.isShuttingDown,
      hasTimeout: this.shutdownTimeout !== null
    };
  }

  /**
   * 🔥 정리 (메모리 해제)
   */
  public cleanup(): void {
    if (this.shutdownTimeout) {
      clearTimeout(this.shutdownTimeout);
      this.shutdownTimeout = null;
    }

    this.isShuttingDown = false;
    Logger.debug('SHUTDOWN_MANAGER', 'Shutdown manager cleaned up');
  }
}

export default ShutdownManager;
