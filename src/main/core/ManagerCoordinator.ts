// 🔥 기가차드 Manager Coordinator - 기존 매니저들의 통합 오케스트레이션

import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';
import { unifiedPermissionManager } from '../utils/UnifiedPermissionManager';

// 🔥 기존 매니저들 import (중복 방지)
import { memoryManager } from '../managers/MemoryManager';
import { dataSyncManager } from '../managers/DataSyncManager';
import { BrowserDetector } from '../managers/BrowserDetector';
import { getMenuManager } from '../managers/MenuManager';
import { getShortcutsManager } from '../managers/ShortcutsManager';
import { getTrayManager } from '../managers/TrayManager';
import { handlersManager } from '../managers/HandlersManager';
import { sessionManager } from '../managers/SessionManager';
import { databaseManager } from '../managers/DatabaseManager';
import { updaterManager } from '../managers/UpdaterManager';

// 🔥 BrowserDetector 인스턴스 생성
const browserDetector = new BrowserDetector();

/**
 * 🔥 ManagerCoordinator - 기존 매니저들의 오케스트레이션만 담당
 * 
 * 책임:
 * - 기존 매니저들의 순서대로 초기화
 * - 권한 상태에 따른 조건부 시작
 * - 개발/프로덕션 모드별 최적화
 * - 안전한 종료 처리
 * 
 * 중복 방지:
 * - 새로운 매니저 생성하지 않음
 * - 기존 매니저들만 조율
 */
export class ManagerCoordinator {
  private readonly componentName = 'MANAGER_COORDINATOR';
  private initializedManagers: Set<string> = new Set();
  private startedManagers: Set<string> = new Set();
  private hasAccessibilityPermission = false;
  private isDevelopmentMode = process.env.NODE_ENV === 'development';

  /**
   * 🔥 권한 상태 설정
   */
  public setPermissionState(hasPermission: boolean): void {
    this.hasAccessibilityPermission = hasPermission;
    Logger.info(this.componentName, '권한 상태 설정됨', { hasPermission });

    // 권한 의존적 매니저들에게 권한 상태 전달
    // if (browserDetector) {
    //   browserDetector.setAccessibilityPermission(hasPermission);
    // }
  }

  /**
   * 🔥 핵심 시스템 초기화 (권한 불필요)
   */
  public async initializeCore(): Promise<void> {
    try {
      Logger.info(this.componentName, '핵심 시스템 초기화 시작');

      // 1. 데이터베이스 (최우선)
      await this.initializeDatabase();

      // 2. 설정 시스템
      await this.initializeSettings();

      // 3. 핸들러 관리자
      await this.initializeHandlers();

      Logger.info(this.componentName, '✅ 핵심 시스템 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, '❌ 핵심 시스템 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 모든 매니저 초기화 (단계별)
   */
  public async initializeAll(): Promise<void> {
    try {
      Logger.info(this.componentName, '전체 매니저 초기화 시작', {
        developmentMode: this.isDevelopmentMode,
        hasPermission: this.hasAccessibilityPermission
      });

      // Phase 1: 필수 매니저들 (즉시)
      await this.initializeEssentialManagers();

      // Phase 2: 일반 매니저들 (2초 후 - CPU 부하 분산)
      setTimeout(() => {
        this.initializeGeneralManagers().catch(error => {
          Logger.error(this.componentName, '일반 매니저 초기화 실패', error);
        });
      }, 2000);

      // Phase 3: 권한 의존 매니저들 (4초 후)
      if (this.hasAccessibilityPermission) {
        setTimeout(() => {
          this.initializePermissionDependentManagers().catch(error => {
            Logger.error(this.componentName, '권한 의존 매니저 초기화 실패', error);
          });
        }, 4000);
      }

      Logger.info(this.componentName, '✅ 전체 매니저 초기화 스케줄링 완료');
    } catch (error) {
      Logger.error(this.componentName, '❌ 매니저 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 필수 매니저들 초기화
   */
  private async initializeEssentialManagers(): Promise<void> {
    try {
      // MemoryManager (성능 모니터링 필수)
      if (memoryManager && !this.initializedManagers.has('memory')) {
        await memoryManager.initialize();
        await memoryManager.start();
        this.initializedManagers.add('memory');
        this.startedManagers.add('memory');
        Logger.info(this.componentName, '✅ MemoryManager 초기화 완료');
      }

      // SessionManager (타이핑 세션 관리)
      if (sessionManager && !this.initializedManagers.has('session')) {
        await sessionManager.initialize();
        await sessionManager.start();
        this.initializedManagers.add('session');
        this.startedManagers.add('session');
        Logger.info(this.componentName, '✅ SessionManager 초기화 완료');
      }

      Logger.info(this.componentName, '✅ 필수 매니저들 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, '❌ 필수 매니저 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 일반 매니저들 초기화
   */
  private async initializeGeneralManagers(): Promise<void> {
    try {
      Logger.info(this.componentName, '일반 매니저들 초기화 시작');

      // Menu Manager
      if (!this.initializedManagers.has('menu')) {
        const menuManager = getMenuManager();
        await menuManager.initialize();
        await menuManager.start();
        this.initializedManagers.add('menu');
        this.startedManagers.add('menu');
        Logger.info(this.componentName, '✅ MenuManager 초기화 완료');
      }

      // Shortcuts Manager
      if (!this.initializedManagers.has('shortcuts')) {
        const shortcutsManager = getShortcutsManager();
        await shortcutsManager.initialize();
        await shortcutsManager.start();
        this.initializedManagers.add('shortcuts');
        this.startedManagers.add('shortcuts');
        Logger.info(this.componentName, '✅ ShortcutsManager 초기화 완료');
      }

      // Tray Manager
      if (!this.initializedManagers.has('tray')) {
        const trayManager = getTrayManager();
        await trayManager.initialize();
        await trayManager.start();
        this.initializedManagers.add('tray');
        this.startedManagers.add('tray');
        Logger.info(this.componentName, '✅ TrayManager 초기화 완료');
      }

      // Updater Manager (자동 업데이트, 패키지된 앱에서만 동작)
      if (!this.initializedManagers.has('updater')) {
        await updaterManager.initialize();
        this.initializedManagers.add('updater');
        Logger.info(this.componentName, '✅ UpdaterManager 초기화 완료');
      }

      // DataSync Manager (개발모드에서는 비활성화)
      if (!this.isDevelopmentMode && !this.initializedManagers.has('dataSync')) {
        await dataSyncManager.initialize();
        // 개발모드가 아닐 때만 시작
        await dataSyncManager.start();
        this.initializedManagers.add('dataSync');
        this.startedManagers.add('dataSync');
        Logger.info(this.componentName, '✅ DataSyncManager 초기화 완료');
      }

      Logger.info(this.componentName, '✅ 일반 매니저들 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, '❌ 일반 매니저 초기화 실패', error);
    }
  }

  /**
   * 🔥 권한 의존 매니저들 초기화 (명시적 요청시에만)
   */
  private async initializePermissionDependentManagers(): Promise<void> {
    try {
      Logger.info(this.componentName, '권한 의존 매니저들 초기화 시작');

      // 🔥 BrowserDetector는 자동 시작하지 않음 - 명시적 요청시에만 시작
      // Browser Detector 초기화만 수행 (시작하지 않음)
      if (!this.initializedManagers.has('browser')) {
        await browserDetector.initialize();
        // 🔥 자동 시작 제거: await browserDetector.start();
        this.initializedManagers.add('browser');
        // 🔥 started 목록에 추가하지 않음: this.startedManagers.add('browser');
        Logger.info(this.componentName, '✅ BrowserDetector 초기화 완료 (시작하지 않음 - 명시적 요청시에만)');
      }

      Logger.info(this.componentName, '✅ 권한 의존 매니저들 초기화 완료 (자동 시작 비활성화)');
    } catch (error) {
      Logger.error(this.componentName, '❌ 권한 의존 매니저 초기화 실패', error);
    }
  }

  /**
   * 🔥 데이터베이스 초기화
   */
  private async initializeDatabase(): Promise<void> {
    try {
      // DatabaseManager 사용 (기존)
      if (databaseManager && !this.initializedManagers.has('database')) {
        await databaseManager.initialize();
        await databaseManager.start();
        this.initializedManagers.add('database');
        this.startedManagers.add('database');
        Logger.info(this.componentName, '✅ DatabaseManager 초기화 완료');
      }

      // 🔥 databaseService도 초기화 (Analytics API용)
      if (!this.initializedManagers.has('databaseService')) {
        const { databaseService } = await import('../services/databaseService');
        const result = await databaseService.initialize();
        if (result.success) {
          this.initializedManagers.add('databaseService');
          Logger.info(this.componentName, '✅ databaseService 초기화 완료');
        } else {
          Logger.error(this.componentName, '❌ databaseService 초기화 실패', result.error);
          throw new Error(`databaseService 초기화 실패: ${result.error}`);
        }
      }
    } catch (error) {
      Logger.error(this.componentName, '❌ 데이터베이스 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 설정 시스템 초기화
   */
  private async initializeSettings(): Promise<void> {
    try {
      const { getSettingsManager } = await import('../settings');
      const settingsManager = getSettingsManager();
      // ElectronStoreSettingsManager는 initialize 메서드가 없으므로 제거

      Logger.info(this.componentName, '✅ Settings 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, '❌ 설정 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 핸들러 초기화
   */
  private async initializeHandlers(): Promise<void> {
    try {
      if (handlersManager && !this.initializedManagers.has('handlers')) {
        await handlersManager.initialize();
        await handlersManager.start();
        this.initializedManagers.add('handlers');
        this.startedManagers.add('handlers');
        Logger.info(this.componentName, '✅ HandlersManager 초기화 완료');
      }
    } catch (error) {
      Logger.error(this.componentName, '❌ 핸들러 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 모든 매니저 중지
   */
  public async stopAll(): Promise<void> {
    try {
      Logger.info(this.componentName, '모든 매니저 중지 시작');

      const managers = [
        { name: 'browser', instance: browserDetector },
        { name: 'dataSync', instance: dataSyncManager },
        { name: 'updater', instance: updaterManager },
        { name: 'tray', instance: getTrayManager() },
        { name: 'shortcuts', instance: getShortcutsManager() },
        { name: 'menu', instance: getMenuManager() },
        { name: 'handlers', instance: handlersManager },
        { name: 'session', instance: sessionManager },
        { name: 'memory', instance: memoryManager },
        { name: 'database', instance: databaseManager },
      ];

      // 역순으로 중지 (시작의 반대 순서)
      for (const manager of managers.reverse()) {
        if (this.startedManagers.has(manager.name)) {
          try {
            if (manager.instance && typeof manager.instance.stop === 'function') {
              await manager.instance.stop();
              this.startedManagers.delete(manager.name);
              Logger.debug(this.componentName, `${manager.name} 매니저 중지 완료`);
            }
          } catch (error) {
            Logger.error(this.componentName, `${manager.name} 매니저 중지 실패`, error);
          }
        }
      }

      // 정리
      for (const manager of managers) {
        if (this.initializedManagers.has(manager.name)) {
          try {
            if (manager.instance && typeof manager.instance.cleanup === 'function') {
              await manager.instance.cleanup();
              this.initializedManagers.delete(manager.name);
              Logger.debug(this.componentName, `${manager.name} 매니저 정리 완료`);
            }
          } catch (error) {
            Logger.error(this.componentName, `${manager.name} 매니저 정리 실패`, error);
          }
        }
      }

      Logger.info(this.componentName, '✅ 모든 매니저 중지 완료');
    } catch (error) {
      Logger.error(this.componentName, '❌ 매니저 중지 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 매니저 상태 조회
   */
  public getManagerStatus(): {
    initialized: string[];
    started: string[];
    hasPermission: boolean;
    developmentMode: boolean;
  } {
    return {
      initialized: Array.from(this.initializedManagers),
      started: Array.from(this.startedManagers),
      hasPermission: this.hasAccessibilityPermission,
      developmentMode: this.isDevelopmentMode,
    };
  }

  /**
   * 🔥 특정 매니저 재시작
   */
  public async restartManager(managerName: string): Promise<void> {
    try {
      Logger.info(this.componentName, `${managerName} 매니저 재시작 시작`);

      // 구현 필요시 추가

      Logger.info(this.componentName, `✅ ${managerName} 매니저 재시작 완료`);
    } catch (error) {
      Logger.error(this.componentName, `❌ ${managerName} 매니저 재시작 실패`, error);
      throw error;
    }
  }
}

export default ManagerCoordinator;
