// 🔥 기가차드 전력 관리자 - 배터리 최적화 및 전력 상태 모니터링

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { powerMonitor, powerSaveBlocker } from 'electron';
import { Result } from '../../shared/types';
import { Platform } from '../utils/platform';

// #DEBUG: Power manager entry point
Logger.debug('POWER_MANAGER', 'Power manager module loaded');

// 🔥 기가차드 전력 상태 인터페이스
export interface PowerStatus {
  onBattery: boolean;
  charging: boolean;
  batteryLevel?: number;
  systemIdleTime: number;
  powerSaveMode: boolean;
  thermalState: 'normal' | 'fair' | 'serious' | 'critical';
}

// 🔥 기가차드 전력 설정
export interface PowerConfig {
  enableBatteryOptimization: boolean;
  reducePollingOnBattery: boolean;
  suspendOnLowBattery: boolean;
  lowBatteryThreshold: number; // percentage
  idleDetectionThreshold: number; // milliseconds
  enableThermalManagement: boolean;
}

// 🔥 기가차드 전력 이벤트
export interface PowerEvent {
  type: 'suspend' | 'resume' | 'ac-connected' | 'ac-disconnected' | 'battery-low' | 'thermal-change';
  timestamp: Date;
  data?: Record<string, unknown>;
}

/**
 * 🔥 PowerManager - 배터리 최적화 및 전력 상태 관리
 * 배터리 상태 모니터링, 전력 절약 모드, 열 관리 등
 */
export class PowerManager extends BaseManager {
  private readonly componentName = 'POWER_MANAGER';
  private powerConfig: PowerConfig;
  private currentStatus: PowerStatus;
  private powerSaveBlockerId: number | null = null;
  private idleCheckInterval: NodeJS.Timeout | null = null;
  private batteryCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<PowerConfig> = {}) {
    super({
      name: 'PowerManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.powerConfig = {
      enableBatteryOptimization: true,
      reducePollingOnBattery: true,
      suspendOnLowBattery: true,
      lowBatteryThreshold: 15,
      idleDetectionThreshold: 300000, // 5분
      enableThermalManagement: true,
      ...config,
    };

    this.currentStatus = {
      onBattery: false,
      charging: false,
      systemIdleTime: 0,
      powerSaveMode: false,
      thermalState: 'normal',
    };

    Logger.info(this.componentName, 'Power manager instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 전력 상태 초기 체크
      await this.updatePowerStatus();
      
      // 전력 이벤트 리스너 설정
      this.setupPowerEventListeners();
      
      Logger.info(this.componentName, 'Power manager initialized', {
        onBattery: this.currentStatus.onBattery,
        charging: this.currentStatus.charging,
      });
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize power manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 배터리 상태 주기적 체크 시작
      this.startBatteryMonitoring();
      
      // 유휴 시간 감지 시작
      this.startIdleDetection();
      
      this.emit('power-monitoring-started');
      Logger.info(this.componentName, 'Power monitoring started');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start power monitoring', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      // 타이머 정리
      if (this.batteryCheckInterval) {
        clearInterval(this.batteryCheckInterval);
        this.batteryCheckInterval = null;
      }

      if (this.idleCheckInterval) {
        clearInterval(this.idleCheckInterval);
        this.idleCheckInterval = null;
      }

      // 전력 절약 차단 해제
      if (this.powerSaveBlockerId !== null) {
        powerSaveBlocker.stop(this.powerSaveBlockerId);
        this.powerSaveBlockerId = null;
      }

      this.emit('power-monitoring-stopped');
      Logger.info(this.componentName, 'Power monitoring stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop power monitoring', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      await this.doStop();
      
      // 이벤트 리스너 정리
      powerMonitor.removeAllListeners();
      
      Logger.info(this.componentName, 'Power manager cleanup completed');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup power manager', err);
      throw err;
    }
  }

  /**
   * 전력 이벤트 리스너 설정
   */
  private setupPowerEventListeners(): void {
    // 시스템 일시중지 이벤트
    powerMonitor.on('suspend', () => {
      const event: PowerEvent = {
        type: 'suspend',
        timestamp: new Date(),
      };
      this.handlePowerEvent(event);
    });

    // 시스템 재개 이벤트
    powerMonitor.on('resume', () => {
      const event: PowerEvent = {
        type: 'resume',
        timestamp: new Date(),
      };
      this.handlePowerEvent(event);
    });

    // AC 어댑터 연결/해제 (macOS/Windows)
    if (!Platform.isLinux()) {
      powerMonitor.on('on-ac', () => {
        const event: PowerEvent = {
          type: 'ac-connected',
          timestamp: new Date(),
        };
        this.handlePowerEvent(event);
      });

      powerMonitor.on('on-battery', () => {
        const event: PowerEvent = {
          type: 'ac-disconnected',
          timestamp: new Date(),
        };
        this.handlePowerEvent(event);
      });
    }

    // 열 상태 변경 (macOS)
    if (Platform.isMacOS() && 'getThermalState' in powerMonitor) {
      powerMonitor.on('thermal-state-change', () => {
        this.updateThermalState();
      });
    }
  }

  /**
   * 전력 이벤트 처리
   */
  private handlePowerEvent(event: PowerEvent): void {
    Logger.info(this.componentName, 'Power event occurred', {
      type: event.type,
      timestamp: event.timestamp,
    });

    switch (event.type) {
      case 'suspend':
        this.handleSystemSuspend();
        break;
      case 'resume':
        this.handleSystemResume();
        break;
      case 'ac-connected':
        this.handleACConnected();
        break;
      case 'ac-disconnected':
        this.handleACDisconnected();
        break;
      case 'battery-low':
        this.handleLowBattery();
        break;
      case 'thermal-change':
        this.handleThermalChange();
        break;
    }

    this.emit('power-event', event);
  }

  /**
   * 배터리 상태 업데이트
   */
  private async updatePowerStatus(): Promise<void> {
    try {
      const onBattery = powerMonitor.isOnBatteryPower();
      const systemIdleTime = powerMonitor.getSystemIdleTime() * 1000; // Convert to ms
      
      this.currentStatus = {
        ...this.currentStatus,
        onBattery,
        systemIdleTime,
      };

      // 배터리 레벨 (가능한 경우)
      if (Platform.isMacOS()) {
        // macOS에서는 시스템 명령어로 배터리 레벨 가져오기
        try {
          const { exec } = require('child_process');
          exec('pmset -g batt | grep -o "[0-9]*%" | head -1', (error: Error | null, stdout: string) => {
            if (!error && stdout) {
              const batteryLevel = parseInt(stdout.replace('%', ''));
              this.currentStatus.batteryLevel = batteryLevel;
            }
          });
        } catch (error) {
          // 배터리 레벨을 가져올 수 없는 경우 무시
        }
      }

      Logger.debug(this.componentName, 'Power status updated', this.currentStatus);
    } catch (error) {
      Logger.error(this.componentName, 'Failed to update power status', error);
    }
  }

  /**
   * 배터리 모니터링 시작
   */
  private startBatteryMonitoring(): void {
    if (this.batteryCheckInterval) {
      clearInterval(this.batteryCheckInterval);
    }

    // 배터리 상태에 따라 체크 간격 조정
    const checkInterval = this.currentStatus.onBattery ? 30000 : 60000; // 30초 또는 1분

    this.batteryCheckInterval = setInterval(async () => {
      await this.updatePowerStatus();
      
      // 저배터리 상태 체크
      if (this.currentStatus.batteryLevel && 
          this.currentStatus.batteryLevel <= this.powerConfig.lowBatteryThreshold) {
        const event: PowerEvent = {
          type: 'battery-low',
          timestamp: new Date(),
          data: { batteryLevel: this.currentStatus.batteryLevel },
        };
        this.handlePowerEvent(event);
      }
    }, checkInterval);
  }

  /**
   * 유휴 시간 감지 시작
   */
  private startIdleDetection(): void {
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval);
    }

    this.idleCheckInterval = setInterval(() => {
      const idleTime = powerMonitor.getSystemIdleTime() * 1000;
      
      if (idleTime >= this.powerConfig.idleDetectionThreshold) {
        this.handleSystemIdle(idleTime);
      }
    }, 60000); // 1분마다 체크
  }

  /**
   * 시스템 일시중지 처리
   */
  private handleSystemSuspend(): void {
    Logger.info(this.componentName, 'System suspend detected');
    
    // 키보드 모니터링 일시중지 (필요시)
    if (globalThis.unifiedHandler && 'pauseMonitoring' in globalThis.unifiedHandler) {
      (globalThis.unifiedHandler as { pauseMonitoring(): void }).pauseMonitoring();
    }
  }

  /**
   * 시스템 재개 처리
   */
  private handleSystemResume(): void {
    Logger.info(this.componentName, 'System resume detected');
    
    // 키보드 모니터링 재개 (필요시)
    if (globalThis.unifiedHandler && 'resumeMonitoring' in globalThis.unifiedHandler) {
      (globalThis.unifiedHandler as { resumeMonitoring(): void }).resumeMonitoring();
    }
    
    // 전력 상태 업데이트
    this.updatePowerStatus();
  }

  /**
   * AC 어댑터 연결 처리
   */
  private handleACConnected(): void {
    Logger.info(this.componentName, 'AC adapter connected');
    
    this.currentStatus.onBattery = false;
    this.currentStatus.charging = true;
    
    // 성능 모드 복원
    this.restorePerformanceMode();
  }

  /**
   * AC 어댑터 해제 처리
   */
  private handleACDisconnected(): void {
    Logger.info(this.componentName, 'AC adapter disconnected');
    
    this.currentStatus.onBattery = true;
    this.currentStatus.charging = false;
    
    // 배터리 절약 모드 활성화
    if (this.powerConfig.enableBatteryOptimization) {
      this.enableBatterySaveMode();
    }
  }

  /**
   * 저배터리 처리
   */
  private handleLowBattery(): void {
    Logger.warn(this.componentName, 'Low battery detected', {
      batteryLevel: this.currentStatus.batteryLevel,
      threshold: this.powerConfig.lowBatteryThreshold,
    });
    
    if (this.powerConfig.suspendOnLowBattery) {
      this.enablePowerSaveMode();
    }
    
    this.emit('battery-low', this.currentStatus.batteryLevel);
  }

  /**
   * 열 상태 변경 처리
   */
  private handleThermalChange(): void {
    this.updateThermalState();
  }

  /**
   * 시스템 유휴 처리
   */
  private handleSystemIdle(idleTime: number): void {
    Logger.debug(this.componentName, 'System idle detected', { idleTime });
    
    // 유휴 시간 동안 배터리 절약
    if (this.currentStatus.onBattery && idleTime > this.powerConfig.idleDetectionThreshold) {
      this.enableIdlePowerSave();
    }
  }

  /**
   * 열 상태 업데이트
   */
  private updateThermalState(): void {
    if (Platform.isMacOS()) {
      try {
        // macOS 열 상태 시뮬레이션 (실제로는 시스템 API 사용)
        this.currentStatus.thermalState = 'normal';
        
        if (this.currentStatus.thermalState !== 'normal') {
          Logger.warn(this.componentName, 'Thermal state changed', {
            state: this.currentStatus.thermalState,
          });
          
          const event: PowerEvent = {
            type: 'thermal-change',
            timestamp: new Date(),
            data: { thermalState: this.currentStatus.thermalState },
          };
          this.emit('power-event', event);
        }
      } catch (error) {
        Logger.error(this.componentName, 'Failed to update thermal state', error);
      }
    }
  }

  /**
   * 배터리 절약 모드 활성화
   */
  private enableBatterySaveMode(): void {
    Logger.info(this.componentName, 'Enabling battery save mode');
    
    this.currentStatus.powerSaveMode = true;
    
    // 키보드 모니터링 폴링 간격 늘리기
    if (globalThis.unifiedHandler && 'setBatteryOptimization' in globalThis.unifiedHandler) {
      (globalThis.unifiedHandler as { setBatteryOptimization(enabled: boolean): void }).setBatteryOptimization(true);
    }
    
    this.emit('battery-save-enabled');
  }

  /**
   * 성능 모드 복원
   */
  private restorePerformanceMode(): void {
    Logger.info(this.componentName, 'Restoring performance mode');
    
    this.currentStatus.powerSaveMode = false;
    
    // 키보드 모니터링 성능 복원
    if (globalThis.unifiedHandler && 'setBatteryOptimization' in globalThis.unifiedHandler) {
      (globalThis.unifiedHandler as { setBatteryOptimization(enabled: boolean): void }).setBatteryOptimization(false);
    }
    
    this.emit('performance-mode-restored');
  }

  /**
   * 전력 절약 모드 활성화
   */
  private enablePowerSaveMode(): void {
    if (this.powerSaveBlockerId === null) {
      this.powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension');
      Logger.info(this.componentName, 'Power save blocker activated');
    }
  }

  /**
   * 유휴 시 전력 절약
   */
  private enableIdlePowerSave(): void {
    Logger.debug(this.componentName, 'Enabling idle power save');
    
    // 불필요한 백그라운드 작업 일시중지
    if (globalThis.unifiedHandler && 'reduceBackgroundActivity' in globalThis.unifiedHandler) {
      (globalThis.unifiedHandler as { reduceBackgroundActivity(): void }).reduceBackgroundActivity();
    }
  }

  /**
   * 공개 API: 현재 전력 상태 반환
   */
  public getPowerStatus(): PowerStatus {
    return { ...this.currentStatus };
  }

  /**
   * 공개 API: 전력 설정 업데이트
   */
  public updateConfig(newConfig: Partial<PowerConfig>): void {
    this.powerConfig = { ...this.powerConfig, ...newConfig };
    Logger.info(this.componentName, 'Power config updated', newConfig);
  }

  /**
   * 공개 API: 배터리 최적화 강제 활성화/비활성화
   */
  public setBatteryOptimization(enabled: boolean): void {
    if (enabled) {
      this.enableBatterySaveMode();
    } else {
      this.restorePerformanceMode();
    }
  }

  /**
   * 공개 API: 전력 통계
   */
  public getPowerStats(): {
    uptime: number;
    batteryLevel?: number;
    onBattery: boolean;
    powerSaveMode: boolean;
    systemIdleTime: number;
  } {
    return {
      uptime: process.uptime() * 1000,
      batteryLevel: this.currentStatus.batteryLevel,
      onBattery: this.currentStatus.onBattery,
      powerSaveMode: this.currentStatus.powerSaveMode,
      systemIdleTime: this.currentStatus.systemIdleTime,
    };
  }

  /**
   * 헬스 체크 (BaseManager 오버라이드)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    monitoring: boolean;
    onBattery: boolean;
    batteryLevel?: number;
    thermalState: string;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      monitoring: this.isRunning(),
      onBattery: this.currentStatus.onBattery,
      batteryLevel: this.currentStatus.batteryLevel,
      thermalState: this.currentStatus.thermalState,
    };
  }
}

// 🔥 기가차드 전역 전력 관리자
export const powerManager = new PowerManager();

// #DEBUG: Power manager module exit point
Logger.debug('POWER_MANAGER', 'Power manager module setup complete');

export default powerManager;
