// 🔥 기가차드 자동 시작 관리자 - 윈도우/맥/리눅스 지원!

import { app } from 'electron';
import { Logger } from '../../shared/logger';
import { isObject } from '../../shared/common';
import { Platform } from '../utils/platform';

// #DEBUG: Auto-launch manager entry point
Logger.debug('AUTO_LAUNCH', 'Auto-launch manager module loaded');

// 🔥 기가차드 자동 시작 설정 인터페이스
export interface AutoLaunchConfig {
  enabled: boolean;
  minimized: boolean;
  delay: number; // 초 단위
  platform: NodeJS.Platform;
}

// 🔥 기가차드 자동 시작 관리자 클래스
export class AutoLaunchManager {
  private static instance: AutoLaunchManager | null = null;
  private config: AutoLaunchConfig;

  private constructor() {
    this.config = {
      enabled: false,
      minimized: true,
      delay: 5,
      platform: Platform.getCurrentPlatform()
    };
    
    this.loadAutoLaunchConfig();
  }

  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): AutoLaunchManager {
    if (!AutoLaunchManager.instance) {
      AutoLaunchManager.instance = new AutoLaunchManager();
    }
    return AutoLaunchManager.instance;
  }

  // 🔥 자동 시작 설정 로드
  private async loadAutoLaunchConfig(): Promise<void> {
    try {
      // #DEBUG: Loading auto-launch config
      Logger.debug('AUTO_LAUNCH', 'Loading auto-launch configuration');

      // Electron의 내장 설정에서 로드
      const isEnabled = app.getLoginItemSettings().openAtLogin;
      this.config.enabled = isEnabled;

      Logger.info('AUTO_LAUNCH', 'Auto-launch config loaded', {
        enabled: this.config.enabled,
        platform: this.config.platform
      });

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to load auto-launch config', error);
    }
  }

  // 🔥 자동 시작 활성화
  public async enableAutoLaunch(options?: {
    minimized?: boolean;
    delay?: number;
  }): Promise<boolean> {
    try {
      // #DEBUG: Enabling auto-launch
      Logger.debug('AUTO_LAUNCH', 'Enabling auto-launch', options);

      if (options) {
        if (typeof options.minimized === 'boolean') {
          this.config.minimized = options.minimized;
        }
        if (typeof options.delay === 'number' && options.delay >= 0) {
          this.config.delay = options.delay;
        }
      }

      // 플랫폼별 자동 시작 설정
      const success = await this.setAutoLaunchForPlatform(true);
      
      if (success) {
        this.config.enabled = true;
        Logger.info('AUTO_LAUNCH', 'Auto-launch enabled successfully', {
          minimized: this.config.minimized,
          delay: this.config.delay
        });
        return true;
      }

      Logger.error('AUTO_LAUNCH', 'Failed to enable auto-launch');
      return false;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Error enabling auto-launch', error);
      return false;
    }
  }

  // 🔥 자동 시작 비활성화
  public async disableAutoLaunch(): Promise<boolean> {
    try {
      // #DEBUG: Disabling auto-launch
      Logger.debug('AUTO_LAUNCH', 'Disabling auto-launch');

      const success = await this.setAutoLaunchForPlatform(false);
      
      if (success) {
        this.config.enabled = false;
        Logger.info('AUTO_LAUNCH', 'Auto-launch disabled successfully');
        return true;
      }

      Logger.error('AUTO_LAUNCH', 'Failed to disable auto-launch');
      return false;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Error disabling auto-launch', error);
      return false;
    }
  }

  // 🔥 플랫폼별 자동 시작 설정
  private async setAutoLaunchForPlatform(enable: boolean): Promise<boolean> {
    try {
      // #DEBUG: Setting auto-launch for platform
      Logger.debug('AUTO_LAUNCH', 'Setting auto-launch for platform', {
        platform: this.config.platform,
        enable
      });

      switch (this.config.platform) {
        case 'win32':
          return this.setWindowsAutoLaunch(enable);
        case 'darwin':
          return this.setMacAutoLaunch(enable);
        case 'linux':
          return this.setLinuxAutoLaunch(enable);
        default:
          Logger.warn('AUTO_LAUNCH', 'Unsupported platform for auto-launch', {
            platform: this.config.platform
          });
          return false;
      }

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Error setting auto-launch for platform', error);
      return false;
    }
  }

  // 🔥 Windows 자동 시작 설정
  private setWindowsAutoLaunch(enable: boolean): boolean {
    try {
      // #DEBUG: Setting Windows auto-launch
      Logger.debug('AUTO_LAUNCH', 'Setting Windows auto-launch', { enable });

      const args: string[] = [];
      
      if (this.config.minimized) {
        args.push('--minimized');
      }
      
      if (this.config.delay > 0) {
        args.push(`--delay=${this.config.delay}`);
      }

      app.setLoginItemSettings({
        openAtLogin: enable,
        path: process.execPath,
        args: enable ? args : []
      });

      Logger.info('AUTO_LAUNCH', 'Windows auto-launch set successfully', {
        enable,
        args
      });

      return true;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to set Windows auto-launch', error);
      return false;
    }
  }

  // 🔥 macOS 자동 시작 설정
  private setMacAutoLaunch(enable: boolean): boolean {
    try {
      // #DEBUG: Setting macOS auto-launch
      Logger.debug('AUTO_LAUNCH', 'Setting macOS auto-launch', { enable });

      const args: string[] = [];
      
      if (this.config.minimized) {
        args.push('--minimized');
      }
      
      if (this.config.delay > 0) {
        args.push(`--delay=${this.config.delay}`);
      }

      app.setLoginItemSettings({
        openAtLogin: enable,
        openAsHidden: this.config.minimized,
        args: enable ? args : []
      });

      Logger.info('AUTO_LAUNCH', 'macOS auto-launch set successfully', {
        enable,
        openAsHidden: this.config.minimized,
        args
      });

      return true;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to set macOS auto-launch', error);
      return false;
    }
  }

  // 🔥 Linux 자동 시작 설정
  private setLinuxAutoLaunch(enable: boolean): boolean {
    try {
      // #DEBUG: Setting Linux auto-launch
      Logger.debug('AUTO_LAUNCH', 'Setting Linux auto-launch', { enable });

      const args: string[] = [];
      
      if (this.config.minimized) {
        args.push('--minimized');
      }
      
      if (this.config.delay > 0) {
        args.push(`--delay=${this.config.delay}`);
      }

      app.setLoginItemSettings({
        openAtLogin: enable,
        args: enable ? args : []
      });

      Logger.info('AUTO_LAUNCH', 'Linux auto-launch set successfully', {
        enable,
        args
      });

      return true;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to set Linux auto-launch', error);
      return false;
    }
  }

  // 🔥 자동 시작 상태 확인
  public isAutoLaunchEnabled(): boolean {
    try {
      // #DEBUG: Checking auto-launch status
      const settings = app.getLoginItemSettings();
      const isEnabled = settings.openAtLogin;

      Logger.debug('AUTO_LAUNCH', 'Auto-launch status checked', {
        enabled: isEnabled,
        wasOpenedAtLogin: settings.wasOpenedAtLogin,
        wasOpenedAsHidden: settings.wasOpenedAsHidden
      });

      return isEnabled;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to check auto-launch status', error);
      return false;
    }
  }

  // 🔥 자동 시작 설정 가져오기
  public getAutoLaunchConfig(): AutoLaunchConfig {
    try {
      // #DEBUG: Getting auto-launch config
      const currentStatus = this.isAutoLaunchEnabled();
      
      const config = {
        ...this.config,
        enabled: currentStatus
      };

      Logger.debug('AUTO_LAUNCH', 'Auto-launch config retrieved', config);
      return config;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to get auto-launch config', error);
      return this.config;
    }
  }

  // 🔥 자동 시작 토글
  public async toggleAutoLaunch(): Promise<boolean> {
    try {
      // #DEBUG: Toggling auto-launch
      const currentlyEnabled = this.isAutoLaunchEnabled();
      
      Logger.debug('AUTO_LAUNCH', 'Toggling auto-launch', {
        currentlyEnabled,
        willEnable: !currentlyEnabled
      });

      if (currentlyEnabled) {
        return await this.disableAutoLaunch();
      } else {
        return await this.enableAutoLaunch();
      }

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to toggle auto-launch', error);
      return false;
    }
  }

  // 🔥 지연 시작 처리
  public static async handleDelayedStart(): Promise<void> {
    try {
      // #DEBUG: Handling delayed start
      Logger.debug('AUTO_LAUNCH', 'Handling delayed start');

      // 명령줄 인수에서 지연 시간 확인
      const delayArg = process.argv.find(arg => arg.startsWith('--delay='));
      if (delayArg) {
        const delayValue = delayArg.split('=')[1];
        if (delayValue) {
          const delaySeconds = parseInt(delayValue);
          
          if (delaySeconds > 0) {
            Logger.info('AUTO_LAUNCH', 'Delaying app start', { delaySeconds });
            
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
            
            Logger.info('AUTO_LAUNCH', 'Delay completed, continuing startup');
          }
        }
      }

      // 최소화 시작 확인
      const shouldMinimize = process.argv.includes('--minimized');
      if (shouldMinimize) {
        Logger.info('AUTO_LAUNCH', 'App started in minimized mode');
        // 이 정보는 메인 프로세스에서 사용됨
      }

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Error handling delayed start', error);
    }
  }

  // 🔥 자동 시작으로 실행되었는지 확인
  public static wasOpenedAtLogin(): boolean {
    try {
      // #DEBUG: Checking if opened at login
      const settings = app.getLoginItemSettings();
      const wasOpened = settings.wasOpenedAtLogin;

      Logger.debug('AUTO_LAUNCH', 'Checked if opened at login', {
        wasOpenedAtLogin: wasOpened,
        wasOpenedAsHidden: settings.wasOpenedAsHidden
      });

      return wasOpened;

    } catch (error) {
      Logger.error('AUTO_LAUNCH', 'Failed to check if opened at login', error);
      return false;
    }
  }
}

// 🔥 기가차드 싱글톤 자동 시작 관리자
export const autoLaunchManager = AutoLaunchManager.getInstance();

// #DEBUG: Auto-launch manager module exit point
Logger.debug('AUTO_LAUNCH', 'Auto-launch manager module setup complete');

export default autoLaunchManager;
