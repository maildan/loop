'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Logger } from '../../../../shared/logger';
import type { SettingsData, UseSettingsReturn } from '../types';

// 🔥 기가차드 useSettings 훅 - Electron-Store 완벽 호환!

/**
 * 🔥 Settings 관리를 위한 커스텀 훅
 * - main/settings/ElectronStoreSettingsManager와 완벽 호환
 * - IPC 통신을 통한 설정 관리
 * - 타입 안전한 설정 업데이트
 * - 성능 최적화된 상태 관리
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 중복 요청 방지를 위한 ref
  const loadingRef = useRef<boolean>(false);
  const savingRef = useRef<boolean>(false);

  /**
   * 🔥 CSS 변수 업데이트 함수 (폰트 설정)
   */
  const updateCSSVariables = useCallback(() => {
    if (!settings) return;

    const root = document.documentElement;
    root.style.setProperty('--app-font-size', `${settings.app.fontSize}px`);
    root.style.setProperty('--app-font-family', settings.app.fontFamily);

    Logger.debug('USE_SETTINGS', 'CSS variables updated', {
      fontSize: settings.app.fontSize,
      fontFamily: settings.app.fontFamily
    });
  }, [settings]);

  /**
   * 🔥 기본값 정의 (main/settings와 동일)
   */
  const defaultSettings: SettingsData = {
    app: {
      theme: 'system',
      language: 'ko',
      autoSave: true,
      startMinimized: false,
      minimizeToTray: true,
      fontSize: 14,
      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    },
    keyboard: {
      enabled: true,
      language: 'korean',
      trackAllApps: false,
      sessionTimeout: 30,
    },
    ui: {
      windowWidth: 1200,
      windowHeight: 800,
      sidebarCollapsed: false,
      showLineNumbers: true,
      showWordCount: true,
      // 🔥 Zen Browser 스타일 UI 컨트롤 기본값
      appSidebarCollapsed: false,
      zenMode: false,
      focusMode: false, // 🔥 focusMode 기본값 추가
      hideToolbars: false,
      minimalistMode: false,
      compactMode: false,
    },
    performance: {
      enableGPUAcceleration: true,
      maxCPUUsage: 80,
      maxMemoryUsage: 2048,
      enableHardwareAcceleration: true,
    },
    account: {
      userId: undefined,
      username: undefined,
      email: undefined,
      displayName: undefined,
      avatar: undefined,
      enableSync: false,
      syncProvider: 'local',
      syncInterval: 60,
      enableTwoFactor: false,
      authProvider: 'local',
      sessionTimeout: 60,
    },
    notifications: {
      enableNotifications: true,
      enableSounds: true,
      notifyGoalAchieved: true,
      notifyDailyGoal: true,
      notifyErrors: true,
    },
  };

  /**
   * 🔥 설정 로드 (중복 방지)
   */
  const loadSettings = useCallback(async (): Promise<void> => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      Logger.debug('USE_SETTINGS', 'Loading settings from main process');

      const result = await window.electronAPI.settings.getAll();

      if (result && result.success && result.data) {
        // electron-store returns partial/full settings object; merge with defaults
        const loaded = result.data as Partial<SettingsData>;
        const merged: SettingsData = {
          ...defaultSettings,
          ...loaded,
          app: { ...defaultSettings.app, ...(loaded.app || {}) },
          keyboard: { ...defaultSettings.keyboard, ...(loaded.keyboard || {}) },
          ui: { ...defaultSettings.ui, ...(loaded.ui || {}) },
          performance: { ...defaultSettings.performance, ...(loaded.performance || {}) },
          account: { ...defaultSettings.account, ...(loaded.account || {}) },
          notifications: { ...defaultSettings.notifications, ...(loaded.notifications || {}) },
        } as SettingsData;

        setSettings(merged);

        // 🔥 폰트 설정 CSS 변수 업데이트 (즉시 적용)
        setTimeout(() => {
          const root = document.documentElement;
          root.style.setProperty('--app-font-size', `${merged.app.fontSize}px`);
          root.style.setProperty('--app-font-family', merged.app.fontFamily);
          Logger.debug('USE_SETTINGS', 'Initial CSS font variables applied', {
            fontSize: merged.app.fontSize,
            fontFamily: merged.app.fontFamily
          });
        }, 0);

        Logger.info('USE_SETTINGS', 'Settings loaded successfully', result.data);
      } else {
        Logger.warn('USE_SETTINGS', 'Failed to load settings, using defaults', result?.error);
        setSettings(defaultSettings);
        setError('기본 설정을 사용합니다.');
      }
    } catch (error) {
      Logger.error('USE_SETTINGS', 'Error loading settings', error);
      setSettings(defaultSettings);
      setError(error instanceof Error ? error.message : '설정 로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  /**
   * 🔥 설정 업데이트 (타입 안전)
   */
  const updateSetting = useCallback(async <K extends keyof SettingsData, T extends keyof SettingsData[K]>(
    category: K,
    key: T,
    value: SettingsData[K][T]
  ): Promise<void> => {
    if (!settings || savingRef.current) return;

    try {
      setSaving(true);
      savingRef.current = true;

      // 🔥 즉시 UI 업데이트 (낙관적 업데이트)
      setSettings(prev => {
        if (!prev) return null;

        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: value,
          },
        };
      });

      // 🔥 백엔드에 저장 (dot notation 사용)
      const keyPath = `${category}.${String(key)}`;
      Logger.debug('USE_SETTINGS', `Updating setting: ${keyPath}`, { value });

      const result = await window.electronAPI.settings.set(keyPath, value);

      if (result.success) {
        Logger.info('USE_SETTINGS', `Setting updated successfully: ${keyPath}`, { value });

        // 🔥 테마 설정의 경우 localStorage에도 즉시 저장 (백업)
        if (category === 'app' && key === 'theme') {
          try {
            localStorage.setItem('loop-theme', value as string);
            Logger.debug('USE_SETTINGS', 'Theme also saved to localStorage', { theme: value });
          } catch (error) {
            Logger.warn('USE_SETTINGS', 'Failed to save theme to localStorage', error);
          }
        }

        // 🔥 폰트 설정이 변경되면 CSS 변수 즉시 업데이트 (새 값으로)
        if (category === 'app' && (key === 'fontSize' || key === 'fontFamily')) {
          const root = document.documentElement;
          if (key === 'fontSize') {
            root.style.setProperty('--app-font-size', `${value}px`);
          } else if (key === 'fontFamily') {
            root.style.setProperty('--app-font-family', value as string);
          }
          Logger.debug('USE_SETTINGS', 'CSS font variables updated immediately', {
            key,
            value
          });
        }
      } else {
        throw new Error(result.error || `Failed to save ${keyPath}`);
      }
    } catch (error) {
      Logger.error('USE_SETTINGS', `Error updating setting: ${category}.${String(key)}`, error);

      // 🔥 에러 시 롤백
      await loadSettings();
      setError(`설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [settings, loadSettings]);

  /**
   * 🔥 모든 설정 저장 - 명시적 카테고리 저장으로 강화
   */
  const saveAllSettings = useCallback(async (): Promise<void> => {
    if (!settings || savingRef.current) return;

    try {
      savingRef.current = true;
      setSaving(true);
      setError(null);

      Logger.info('USE_SETTINGS', 'Saving all settings...');

      // 🔥 명시적으로 모든 카테고리 저장 (누락 방지)
      const categories = ['app', 'keyboard', 'ui', 'performance', 'account', 'notifications'] as const;

      for (const category of categories) {
        const categoryData = settings[category];
        if (categoryData) {
          Logger.debug('USE_SETTINGS', `Saving category: ${category}`, categoryData);
          const result = await window.electronAPI.settings.set(category, categoryData);
          if (!result.success) {
            throw new Error(`Failed to save ${category} settings: ${result.error}`);
          }
        }
      }

      Logger.info('USE_SETTINGS', 'All settings saved successfully');

      // 저장 성공 메시지 표시 (선택적)
      if (typeof window !== 'undefined' && window.electronAPI?.notifications?.show) {
        try {
          await window.electronAPI.notifications.show('설정 저장 완료', '모든 설정이 성공적으로 저장되었습니다.');
        } catch (e) {
          // 알림 실패는 무시
        }
      }

    } catch (error) {
      Logger.error('USE_SETTINGS', 'Failed to save all settings', error);
      setError(`전체 설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [settings]);

  /**
   * 🔥 설정 리셋
   */
  const resetSettings = useCallback(async (): Promise<void> => {
    if (savingRef.current) return;

    try {
      savingRef.current = true;
      setSaving(true);
      setError(null);

      Logger.info('USE_SETTINGS', 'Resetting all settings...');

      const result = await window.electronAPI.settings.reset();

      if (result.success) {
        // 🔥 성공 시 기본값으로 설정하고 다시 로드
        setSettings(defaultSettings);
        await loadSettings();
        Logger.info('USE_SETTINGS', 'Settings reset successfully');
      } else {
        throw new Error(result.error || 'Failed to reset settings');
      }
    } catch (error) {
      Logger.error('USE_SETTINGS', 'Failed to reset settings', error);
      setError(`설정 초기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [loadSettings]);

  /**
   * 🔥 초기 설정 로드
   */
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // subscribe to main process broadcasts so UI updates immediately when settings change
  useEffect(() => {
    try {
      const electronAPI = window.electronAPI as {
        settings?: {
          onDidChange?: (callback: (payload: { keyPath: string; value: unknown; reset?: boolean }) => void) => () => void;
        };
      };

      const unsub = electronAPI.settings?.onDidChange?.((payload: { keyPath: string; value: unknown; reset?: boolean }) => {
        if (!payload || !payload.keyPath) return;

        // dot-path merge into settings (safe with type guards)
        setSettings(prev => {
          if (!prev) return prev;

          const parts = payload.keyPath.split('.').filter(Boolean);
          if (parts.length === 0) return prev;

          if (parts.length === 1) {
            const category = parts[0] as string;
            return Object.assign({}, prev as any, { [(category as any)]: payload.value }) as SettingsData;
          }

          const cat = parts[0] as string;
          const rest = parts.slice(1) as string[];
          if (!cat) return prev;

          const newCategory = Object.assign({}, (prev as SettingsData)[cat as keyof SettingsData]) as Record<string, unknown>;
          let target: Record<string, unknown> = newCategory || {};

          for (let i = 0; i < rest.length - 1; i++) {
            const k = rest[i];
            if (!k) continue;
            if (!(k in target)) target[k] = {};
            target = target[k] as Record<string, unknown>;
          }

          const lastKey = rest[rest.length - 1];
          if (lastKey) target[lastKey] = payload.value;

          return Object.assign({}, prev, { [cat]: newCategory }) as SettingsData;
        });
      });

      return () => { if (typeof unsub === 'function') unsub(); };
    } catch (e) {
      // ignore if API missing
      return () => { };
    }
  }, []);

  /**
   * 🔥 에러 자동 클리어 (10초 후)
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    saveAllSettings,
    resetSettings,
    setSettings,
  };
}
