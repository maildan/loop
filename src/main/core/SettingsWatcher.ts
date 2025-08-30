// 🔥 기가차드 Settings Watcher - 설정 변경 감시 통합

import { Logger } from '../../shared/logger';
import { getSettingsManager } from '../settings';
import type { 
  SettingsChangeEvent, 
  AppSettingsSchema, 
  UISettingsSchema, 
  KeyboardSettingsSchema 
} from '../settings/types';

/**
 * 🔥 SettingsWatcher - 모든 설정 변경 감시 통합
 * 
 * 책임:
 * - 설정 카테고리별 변경 감시
 * - 변경 이벤트에 따른 적절한 액션 실행
 * - 성능 최적화를 위한 배치 처리
 */
export class SettingsWatcher {
  private settingsManager = getSettingsManager();
  private isWatching = false;
  private watcherTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    Logger.info('SETTINGS_WATCHER', '👁️ Settings watcher created');
  }

  /**
   * 🔥 모든 설정 감시 시작
   */
  public startWatching(): void {
    if (this.isWatching) {
      Logger.warn('SETTINGS_WATCHER', 'Already watching settings');
      return;
    }

    try {
      this.watchUISettings();
      this.watchAppSettings();
      this.watchKeyboardSettings();
      this.watchPerformanceSettings();
      
      this.isWatching = true;
      Logger.info('SETTINGS_WATCHER', '✅ All settings watchers started');
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Failed to start watchers', error);
    }
  }

  /**
   * 🔥 UI 설정 변경 감시
   */
  private watchUISettings(): void {
    try {
      this.settingsManager.watch('ui', (event) => {
        Logger.info('SETTINGS_WATCHER', '🎨 UI settings changed', {
          key: event.key,
          newValue: event.newValue
        });

        // 디바운스 처리로 성능 최적화
        this.debounceAction('ui-update', () => {
          this.handleUISettingsChange({
            ...event,
            timestamp: new Date()
          });
        }, 500);
      });

      Logger.debug('SETTINGS_WATCHER', 'UI settings watcher configured');
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'UI watcher setup failed', error);
    }
  }

  /**
   * 🔥 앱 설정 변경 감시
   */
  private watchAppSettings(): void {
    try {
      this.settingsManager.watch('app', (event) => {
        Logger.info('SETTINGS_WATCHER', '⚙️ App settings changed', {
          theme: event.newValue?.theme,
          language: event.newValue?.language,
          minimizeToTray: event.newValue?.minimizeToTray
        });

        this.debounceAction('app-update', () => {
          this.handleAppSettingsChange(event);
        }, 1000);
      });

      Logger.debug('SETTINGS_WATCHER', 'App settings watcher configured');
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'App watcher setup failed', error);
    }
  }

  /**
   * 🔥 키보드 설정 변경 감시
   */
  private watchKeyboardSettings(): void {
    try {
      this.settingsManager.watch('keyboard', (event) => {
        Logger.info('SETTINGS_WATCHER', '⌨️ Keyboard settings changed', {
          enabled: event.newValue?.enabled,
          language: event.newValue?.language
        });

        // 키보드 설정은 즉시 적용 (디바운스 없음)
        this.handleKeyboardSettingsChange(event);
      });

      Logger.debug('SETTINGS_WATCHER', 'Keyboard settings watcher configured');
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Keyboard watcher setup failed', error);
    }
  }

  /**
   * 🔥 성능 설정 변경 감시
   */
  private watchPerformanceSettings(): void {
    try {
      this.settingsManager.watch('performance', (event) => {
        Logger.info('SETTINGS_WATCHER', '🚀 Performance settings changed');

        this.debounceAction('performance-update', () => {
          this.handlePerformanceSettingsChange(event);
        }, 2000);
      });

      Logger.debug('SETTINGS_WATCHER', 'Performance settings watcher configured');
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Performance watcher setup failed', error);
    }
  }

  /**
   * 🔥 UI 설정 변경 처리 (타입 안전)
   */
  private handleUISettingsChange(event: { newValue?: unknown; oldValue?: unknown; timestamp?: Date }): void {
    try {
      const uiSettings = event.newValue as Record<string, unknown>;
      const { colorScheme, fontSize, fontFamily, enableAnimations } = uiSettings || {};

      if (colorScheme) {
        Logger.debug('SETTINGS_WATCHER', `Color scheme changed to: ${colorScheme}`);
        // 색상 테마 변경 로직 (렌더러로 이벤트 전송)
        this.notifyRenderer('theme-changed', { colorScheme });
      }

      if (fontSize) {
        Logger.debug('SETTINGS_WATCHER', `Font size changed to: ${fontSize}`);
        this.notifyRenderer('font-size-changed', { fontSize });
      }

      if (fontFamily) {
        Logger.debug('SETTINGS_WATCHER', `Font family changed to: ${fontFamily}`);
        this.notifyRenderer('font-family-changed', { fontFamily });
      }

      if (enableAnimations !== undefined) {
        Logger.debug('SETTINGS_WATCHER', `Animations ${enableAnimations ? 'enabled' : 'disabled'}`);
        this.notifyRenderer('animations-changed', { enableAnimations });
      }

    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'UI settings change handling failed', error);
    }
  }

  /**
   * 🔥 앱 설정 변경 처리 (타입 안전)
   */
  private handleAppSettingsChange(event: { newValue?: unknown; oldValue?: unknown }): void {
    try {
      const appSettings = event.newValue as Record<string, unknown>;
      const { autoStart, minimizeToTray, language } = appSettings || {};

      if (autoStart !== undefined) {
        Logger.debug('SETTINGS_WATCHER', `Auto start changed to: ${autoStart}`);
        // 자동 시작 설정 로직
        this.updateAutoStart(autoStart as boolean);
      }

      if (minimizeToTray !== undefined) {
        Logger.debug('SETTINGS_WATCHER', `Minimize to tray changed to: ${minimizeToTray}`);
        // 트레이 설정 로직
      }

      if (language) {
        Logger.debug('SETTINGS_WATCHER', `Language changed to: ${language}`);
        this.notifyRenderer('language-changed', { language });
      }

    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'App settings change handling failed', error);
    }
  }

  /**
   * 🔥 키보드 설정 변경 처리 (타입 안전)
   */
  private handleKeyboardSettingsChange(event: { newValue?: unknown; oldValue?: unknown }): void {
    try {
      const keyboardSettings = event.newValue as Record<string, unknown>;
      const { enabled, language, shortcuts } = keyboardSettings || {};

      if (enabled !== undefined) {
        Logger.debug('SETTINGS_WATCHER', `Keyboard monitoring changed to: ${enabled}`);
        // 키보드 서비스 활성화/비활성화
        this.toggleKeyboardMonitoring(enabled as boolean);
      }

      if (language) {
        Logger.debug('SETTINGS_WATCHER', `Keyboard language changed to: ${language}`);
        // 키보드 언어 설정 변경
      }

      if (shortcuts) {
        Logger.debug('SETTINGS_WATCHER', 'Keyboard shortcuts updated');
        // 단축키 업데이트
      }

    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Keyboard settings change handling failed', error);
    }
  }

  /**
   * 🔥 성능 설정 변경 처리 (타입 안전)
   */
  private handlePerformanceSettingsChange(event: { newValue?: unknown; oldValue?: unknown }): void {
    try {
      const performanceSettings = event.newValue as Record<string, unknown>;
      const { memoryMonitoring, backgroundProcessing } = performanceSettings || {};

      if (memoryMonitoring !== undefined) {
        Logger.debug('SETTINGS_WATCHER', `Memory monitoring changed to: ${memoryMonitoring}`);
        // 메모리 모니터링 설정
      }

      if (backgroundProcessing !== undefined) {
        Logger.debug('SETTINGS_WATCHER', `Background processing changed to: ${backgroundProcessing}`);
        // 백그라운드 처리 설정
      }

    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Performance settings change handling failed', error);
    }
  }

  /**
   * 🔥 디바운스 액션 (성능 최적화)
   */
  private debounceAction(key: string, action: () => void, delay: number): void {
    // 기존 타이머 취소
    const existingTimeout = this.watcherTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // 새 타이머 설정
    const newTimeout = setTimeout(() => {
      action();
      this.watcherTimeouts.delete(key);
    }, delay);

    this.watcherTimeouts.set(key, newTimeout);
  }

  /**
   * 🔥 렌더러에 이벤트 알림 (타입 안전)
   */
  private notifyRenderer(event: string, data: Record<string, unknown>): void {
    try {
      // 메인 윈도우로 이벤트 전송
      const { BrowserWindow } = require('electron');
      const mainWindow = BrowserWindow.getAllWindows()[0];
      
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('settings-changed', { event, data });
      }
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Failed to notify renderer', error);
    }
  }

  /**
   * 🔥 자동 시작 설정 업데이트
   */
  private async updateAutoStart(enabled: boolean): Promise<void> {
    try {
      const { app } = require('electron');
      app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath
      });
      Logger.info('SETTINGS_WATCHER', `Auto start ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Auto start update failed', error);
    }
  }

  /**
   * 🔥 키보드 모니터링 토글
   */
  private async toggleKeyboardMonitoring(enabled: boolean): Promise<void> {
    try {
      // 키보드 서비스 import 및 토글
      const { keyboardService } = await import('../keyboard/keyboardService');
      
      if (enabled) {
        await keyboardService.startMonitoring();
        Logger.info('SETTINGS_WATCHER', 'Keyboard monitoring started');
      } else {
        await keyboardService.stopMonitoring();
        Logger.info('SETTINGS_WATCHER', 'Keyboard monitoring stopped');
      }
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Keyboard monitoring toggle failed', error);
    }
  }

  /**
   * 🔥 감시 중지
   */
  public stopWatching(): void {
    try {
      // 모든 디바운스 타이머 정리
      this.watcherTimeouts.forEach(timeout => clearTimeout(timeout));
      this.watcherTimeouts.clear();

      // 설정 감시 해제 (SettingsManager 구현에 따라)
      // this.settingsManager.unwatch();

      this.isWatching = false;
      Logger.info('SETTINGS_WATCHER', '🛑 Settings watching stopped');
    } catch (error) {
      Logger.error('SETTINGS_WATCHER', 'Failed to stop watching', error);
    }
  }

  /**
   * 🔥 감시 상태 조회
   */
  public getWatchingStatus(): { isWatching: boolean; activeWatchers: number } {
    return {
      isWatching: this.isWatching,
      activeWatchers: this.watcherTimeouts.size
    };
  }
}

export default SettingsWatcher;
