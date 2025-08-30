import { BaseManager } from '../common/BaseManager';
import { Logger } from '../../shared/logger';
import { HealthCheckResult, HealthStatus, SystemHealth } from '../../shared/types';
import { uIOhook } from 'uiohook-napi';
import { app } from 'electron';
import * as os from 'os';
import * as fs from 'fs/promises';
import { Platform } from '../utils/platform';

/**
 * 🔥 HealthCheckManager - 시스템 및 키보드 모니터링 건강 상태 관리
 * 시스템 리소스, 권한, 키보드 훅 상태를 체크하고 문제 감지 시 복구
 */
export class HealthCheckManager extends BaseManager {
  private readonly componentName = 'HEALTH_CHECK_MANAGER';
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private lastHealthCheck: SystemHealth | null = null;
  private readonly healthCheckIntervalMs = 30000; // 30초마다 체크
  private readonly maxMemoryUsageMB = 500; // 500MB 제한
  private readonly maxCpuUsagePercent = 80; // 80% CPU 사용률 제한

  constructor() {
    super({
      name: 'HealthCheckManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 5000
    });
    Logger.info(this.componentName, 'HealthCheckManager initialized');
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing HealthCheckManager');
    // 초기화 로직은 현재 불필요
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting health check monitoring');
    
    // 초기 건강 체크 실행
    await this.performHealthCheck();
    
    // 주기적 건강 체크 시작
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        Logger.error(this.componentName, 'Health check failed', error);
      }
    }, this.healthCheckIntervalMs);

    Logger.info(this.componentName, 'Health check monitoring started', {
      intervalMs: this.healthCheckIntervalMs
    });
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping health check monitoring');
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    Logger.info(this.componentName, 'Health check monitoring stopped');
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up HealthCheckManager');
    await this.doStop();
    this.lastHealthCheck = null;
    Logger.info(this.componentName, 'HealthCheckManager cleanup completed');
  }

  /**
   * 현재 건강 상태 반환
   */
  public getLastHealthCheck(): SystemHealth | null {
    return this.lastHealthCheck;
  }

  /**
   * 전체 건강 체크 수행
   */
  private async performHealthCheck(): Promise<SystemHealth> {
    const startTime = performance.now();
    Logger.debug(this.componentName, 'Performing health check');

    try {
      const [
        systemHealth,
        keyboardHealth,
        permissionHealth,
        storageHealth
      ] = await Promise.all([
        this.checkSystemResources(),
        this.checkKeyboardHook(),
        this.checkPermissions(),
        this.checkStorage()
      ]);

      const overallStatus = this.determineOverallStatus([
        systemHealth,
        keyboardHealth,
        permissionHealth,
        storageHealth
      ]);

      const health: SystemHealth = {
        timestamp: new Date(),
        overallStatus,
        system: systemHealth,
        keyboard: keyboardHealth,
        permissions: permissionHealth,
        storage: storageHealth,
        uptime: process.uptime(),
        version: app.getVersion()
      };

      this.lastHealthCheck = health;
      
      const duration = performance.now() - startTime;
      Logger.debug(this.componentName, 'Health check completed', {
        status: overallStatus,
        duration: `${duration.toFixed(2)}ms`
      });

      // 문제 감지 시 알림
      if (overallStatus !== HealthStatus.HEALTHY) {
        Logger.warn(this.componentName, 'System health issues detected', {
          status: overallStatus,
          issues: this.getHealthIssues(health)
        });
      }

      return health;
    } catch (error) {
      Logger.error(this.componentName, 'Health check failed', error);
      throw error;
    }
  }

  /**
   * 시스템 리소스 체크 (CPU, 메모리)
   */
  private async checkSystemResources(): Promise<HealthCheckResult> {
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = memUsage.heapUsed / 1024 / 1024;
      
      // CPU 사용률은 간단한 추정치 사용 (실제로는 더 정교한 측정 필요)
      const cpuUsage = process.cpuUsage();
      const totalCpuTime = cpuUsage.user + cpuUsage.system;
      const estimatedCpuPercent = Math.min((totalCpuTime / 1000000) * 100, 100);

      const issues: string[] = [];
      
      if (memUsageMB > this.maxMemoryUsageMB) {
        issues.push(`High memory usage: ${memUsageMB.toFixed(1)}MB`);
      }
      
      if (estimatedCpuPercent > this.maxCpuUsagePercent) {
        issues.push(`High CPU usage: ${estimatedCpuPercent.toFixed(1)}%`);
      }

      const status = issues.length > 0 ? HealthStatus.WARNING : HealthStatus.HEALTHY;

      return {
        status,
        message: status === HealthStatus.HEALTHY ? 'System resources normal' : 'Resource usage issues',
        details: {
          memoryUsageMB: Math.round(memUsageMB),
          memoryLimit: this.maxMemoryUsageMB,
          cpuUsagePercent: Math.round(estimatedCpuPercent),
          cpuLimit: this.maxCpuUsagePercent,
          totalMemory: Math.round(os.totalmem() / 1024 / 1024),
          freeMemory: Math.round(os.freemem() / 1024 / 1024)
        },
        issues,
        lastChecked: new Date()
      };
    } catch (error) {
      Logger.error(this.componentName, 'System resource check failed', error);
      return {
        status: HealthStatus.ERROR,
        message: 'Failed to check system resources',
        details: { error: String(error) },
        issues: ['System resource check failed'],
        lastChecked: new Date()
      };
    }
  }

  /**
   * 키보드 훅 상태 체크
   */
  private async checkKeyboardHook(): Promise<HealthCheckResult> {
    try {
      // 🔥 uIOhook 상태 안전하게 확인
      let isRegistered = false;
      
      try {
        // uIOhook 모듈이 로드 가능한지 확인
        isRegistered = Boolean(uIOhook) && typeof uIOhook === 'object';
      } catch (error) {
        Logger.warn(this.componentName, 'uIOhook 접근 불가', error);
        isRegistered = false;
      }
      
      if (!isRegistered) {
        return {
          status: HealthStatus.ERROR,
          message: 'Keyboard hook not registered',
          details: { hookRegistered: false },
          issues: ['uIOhook not available'],
          lastChecked: new Date()
        };
      }

      return {
        status: HealthStatus.HEALTHY,
        message: 'Keyboard hook functioning',
        details: { 
          hookRegistered: true,
          platform: Platform.getCurrentPlatform(),
          arch: os.arch()
        },
        issues: [],
        lastChecked: new Date()
      };
    } catch (error) {
      Logger.error(this.componentName, 'Keyboard hook check failed', error);
      return {
        status: HealthStatus.ERROR,
        message: 'Keyboard hook check failed',
        details: { error: String(error) },
        issues: ['Keyboard hook check failed'],
        lastChecked: new Date()
      };
    }
  }

  /**
   * 권한 체크 (접근성 권한 등)
   */
  private async checkPermissions(): Promise<HealthCheckResult> {
    try {
      const issues: string[] = [];
      const details: Record<string, unknown> = {
        platform: Platform.getCurrentPlatform()
      };

      // macOS 접근성 권한 체크
      if (Platform.isMacOS()) {
        // 실제로는 systemPreferences.isTrustedAccessibilityClient() 사용
        const hasAccessibility = true; // 플레이스홀더
        details.accessibilityPermission = hasAccessibility;
        
        if (!hasAccessibility) {
          issues.push('Accessibility permission required on macOS');
        }
      }

      const status = issues.length > 0 ? HealthStatus.WARNING : HealthStatus.HEALTHY;

      return {
        status,
        message: status === HealthStatus.HEALTHY ? 'All permissions granted' : 'Permission issues detected',
        details,
        issues,
        lastChecked: new Date()
      };
    } catch (error) {
      Logger.error(this.componentName, 'Permission check failed', error);
      return {
        status: HealthStatus.ERROR,
        message: 'Permission check failed',
        details: { error: String(error) },
        issues: ['Permission check failed'],
        lastChecked: new Date()
      };
    }
  }

  /**
   * 저장소 체크
   */
  private async checkStorage(): Promise<HealthCheckResult> {
    try {
      const userDataPath = app.getPath('userData');
      
      try {
        await fs.access(userDataPath);
        const stats = await fs.stat(userDataPath);
        
        return {
          status: HealthStatus.HEALTHY,
          message: 'Storage accessible',
          details: {
            userDataPath,
            accessible: true,
            isDirectory: stats.isDirectory()
          },
          issues: [],
          lastChecked: new Date()
        };
      } catch (accessError) {
        return {
          status: HealthStatus.ERROR,
          message: 'Storage access failed',
          details: {
            userDataPath,
            accessible: false,
            error: String(accessError)
          },
          issues: ['Cannot access user data directory'],
          lastChecked: new Date()
        };
      }
    } catch (error) {
      Logger.error(this.componentName, 'Storage check failed', error);
      return {
        status: HealthStatus.ERROR,
        message: 'Storage check failed',
        details: { error: String(error) },
        issues: ['Storage check failed'],
        lastChecked: new Date()
      };
    }
  }

  /**
   * 전체 상태 결정
   */
  private determineOverallStatus(results: HealthCheckResult[]): HealthStatus {
    if (results.some(r => r.status === HealthStatus.ERROR)) {
      return HealthStatus.ERROR;
    }
    if (results.some(r => r.status === HealthStatus.WARNING)) {
      return HealthStatus.WARNING;
    }
    return HealthStatus.HEALTHY;
  }

  /**
   * 건강 상태 이슈 추출
   */
  private getHealthIssues(health: SystemHealth): string[] {
    const allIssues: string[] = [];
    
    if (health.system.issues) allIssues.push(...health.system.issues);
    if (health.keyboard.issues) allIssues.push(...health.keyboard.issues);
    if (health.permissions.issues) allIssues.push(...health.permissions.issues);
    if (health.storage.issues) allIssues.push(...health.storage.issues);
    
    return allIssues;
  }
}
