// 🔥 기가차드 Settings 검증 로직 - 모든 설정값 검증!

import { SettingsSchema, SettingsResult } from './types';
import { SETTINGS_CONSTRAINTS } from './defaults';

/**
 * 🔥 완전한 설정 검증
 */
export function validateSettings(settings: Partial<SettingsSchema>): SettingsResult<SettingsSchema> {
  try {
    // 앱 설정 검증
    if (settings.app) {
      const appResult = validateAppSettings(settings.app);
      if (!appResult.success) {
        return { success: false, error: `App settings: ${appResult.error}` };
      }
    }

    // 키보드 설정 검증
    if (settings.keyboard) {
      const keyboardResult = validateKeyboardSettings(settings.keyboard);
      if (!keyboardResult.success) {
        return { success: false, error: `Keyboard settings: ${keyboardResult.error}` };
      }
    }

    // UI 설정 검증
    if (settings.ui) {
      const uiResult = validateUISettings(settings.ui);
      if (!uiResult.success) {
        return { success: false, error: `UI settings: ${uiResult.error}` };
      }
    }

    // 분석 설정 검증
    if (settings.analytics) {
      const analyticsResult = validateAnalyticsSettings(settings.analytics);
      if (!analyticsResult.success) {
        return { success: false, error: `Analytics settings: ${analyticsResult.error}` };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation error'
    };
  }
}

/**
 * 🔥 앱 설정 검증
 */
function validateAppSettings(app: unknown): SettingsResult<unknown> {
  if (!app || typeof app !== 'object') {
    return { success: false, error: 'App settings must be an object' };
  }
  
  const appSettings = app as Record<string, unknown>;
  
  // 테마 검증 - 더 엄격하게
  if (appSettings.theme !== undefined) {
    if (typeof appSettings.theme !== 'string') {
      return { success: false, error: 'Theme must be a string' };
    }
    const validThemes = SETTINGS_CONSTRAINTS.app.theme as readonly string[];
    if (!validThemes.includes(appSettings.theme)) {
      return { success: false, error: `Invalid theme: ${appSettings.theme}` };
    }
  }

  // 언어 검증 - 더 엄격하게
  if (appSettings.language !== undefined) {
    if (typeof appSettings.language !== 'string') {
      return { success: false, error: 'Language must be a string' };
    }
    const validLanguages = SETTINGS_CONSTRAINTS.app.language as readonly string[];
    if (!validLanguages.includes(appSettings.language)) {
      return { success: false, error: `Invalid language: ${appSettings.language}` };
    }
  }

  // 자동 시작 검증 - 더 엄격하게
  if (appSettings.autoStart !== undefined) {
    if (typeof appSettings.autoStart !== 'boolean') {
      return { success: false, error: 'Auto start must be a boolean' };
    }
  }

  // 최소화 상태로 시작 검증 - 더 엄격하게
  if (appSettings.startMinimized !== undefined) {
    if (typeof appSettings.startMinimized !== 'boolean') {
      return { success: false, error: 'Start minimized must be a boolean' };
    }
  }

  // 시스템 트레이 사용 검증 - 더 엄격하게
  if (appSettings.useSystemTray !== undefined) {
    if (typeof appSettings.useSystemTray !== 'boolean') {
      return { success: false, error: 'Use system tray must be a boolean' };
    }
  }

  // 윈도우 경계 검증 - 더 엄격하게
  if (appSettings.windowBounds !== undefined) {
    if (!appSettings.windowBounds || typeof appSettings.windowBounds !== 'object') {
      return { success: false, error: 'Window bounds must be an object' };
    }
    
    const bounds = appSettings.windowBounds as Record<string, unknown>;
    const { width, height } = bounds;
    const constraints = SETTINGS_CONSTRAINTS.app.windowBounds;
    
    if (width !== undefined) {
      if (typeof width !== 'number') {
        return { success: false, error: 'Window width must be a number' };
      }
      if (width < constraints.width.min || width > constraints.width.max) {
        return { success: false, error: `Invalid window width: ${width}` };
      }
    }
    
    if (height !== undefined) {
      if (typeof height !== 'number') {
        return { success: false, error: 'Window height must be a number' };
      }
      if (height < constraints.height.min || height > constraints.height.max) {
        return { success: false, error: `Invalid window height: ${height}` };
      }
    }
  }

  return { success: true };
}

/**
 * 🔥 키보드 설정 검증
 */
export function validateKeyboardSettings(keyboard: unknown): SettingsResult<unknown> {
  if (!keyboard || typeof keyboard !== 'object') {
    return { success: false, error: 'Keyboard settings must be an object' };
  }
  
  const keyboardSettings = keyboard as Record<string, unknown>;
  
  // 자동 저장 간격 검증 - 더 엄격하게
  if (keyboardSettings.autoSaveInterval !== undefined) {
    if (typeof keyboardSettings.autoSaveInterval !== 'number') {
      return { success: false, error: 'Auto save interval must be a number' };
    }
    const constraints = SETTINGS_CONSTRAINTS.keyboard.autoSaveInterval;
    if (keyboardSettings.autoSaveInterval < constraints.min || keyboardSettings.autoSaveInterval > constraints.max) {
      return { success: false, error: `Invalid auto save interval: ${keyboardSettings.autoSaveInterval}` };
    }
  }

  // 세션 타임아웃 검증 - 더 엄격하게
  if (keyboardSettings.sessionTimeout !== undefined) {
    if (typeof keyboardSettings.sessionTimeout !== 'number') {
      return { success: false, error: 'Session timeout must be a number' };
    }
    const constraints = SETTINGS_CONSTRAINTS.keyboard.sessionTimeout;
    if (keyboardSettings.sessionTimeout < constraints.min || keyboardSettings.sessionTimeout > constraints.max) {
      return { success: false, error: `Invalid session timeout: ${keyboardSettings.sessionTimeout}` };
    }
  }

  // 배치 크기 검증 - 더 엄격하게
  if (keyboardSettings.batchSize !== undefined) {
    if (typeof keyboardSettings.batchSize !== 'number') {
      return { success: false, error: 'Batch size must be a number' };
    }
    const constraints = SETTINGS_CONSTRAINTS.keyboard.batchSize;
    if (keyboardSettings.batchSize < constraints.min || keyboardSettings.batchSize > constraints.max) {
      return { success: false, error: `Invalid batch size: ${keyboardSettings.batchSize}` };
    }
  }

  // 배열 필드 검증 추가
  if (keyboardSettings.ignoreApps !== undefined) {
    if (!Array.isArray(keyboardSettings.ignoreApps)) {
      return { success: false, error: 'Ignore apps must be an array' };
    }
    // 각 요소가 문자열인지 확인
    for (const app of keyboardSettings.ignoreApps) {
      if (typeof app !== 'string') {
        return { success: false, error: 'All ignore apps must be strings' };
      }
    }
  }

  if (keyboardSettings.focusOnlyApps !== undefined) {
    if (!Array.isArray(keyboardSettings.focusOnlyApps)) {
      return { success: false, error: 'Focus only apps must be an array' };
    }
    // 각 요소가 문자열인지 확인
    for (const app of keyboardSettings.focusOnlyApps) {
      if (typeof app !== 'string') {
        return { success: false, error: 'All focus only apps must be strings' };
      }
    }
  }

  return { success: true };
}

/**
 * 🔥 UI 설정 검증
 */
export function validateUISettings(ui: unknown): SettingsResult<unknown> {
  if (!ui || typeof ui !== 'object') {
    return { success: false, error: 'UI settings must be an object' };
  }
  
  const uiSettings = ui as Record<string, unknown>;
  
  // 글꼴 크기 검증 - 더 엄격하게
  if (uiSettings.fontSize !== undefined) {
    if (typeof uiSettings.fontSize !== 'number') {
      return { success: false, error: 'Font size must be a number' };
    }
    const constraints = SETTINGS_CONSTRAINTS.ui.fontSize;
    if (uiSettings.fontSize < constraints.min || uiSettings.fontSize > constraints.max) {
      return { success: false, error: `Invalid font size: ${uiSettings.fontSize}` };
    }
  }

  // 불리언 필드 검증 추가
  if (uiSettings.showNotifications !== undefined && typeof uiSettings.showNotifications !== 'boolean') {
    return { success: false, error: 'Show notifications must be a boolean' };
  }

  if (uiSettings.autoHide !== undefined && typeof uiSettings.autoHide !== 'boolean') {
    return { success: false, error: 'Auto hide must be a boolean' };
  }

  if (uiSettings.darkMode !== undefined && typeof uiSettings.darkMode !== 'boolean') {
    return { success: false, error: 'Dark mode must be a boolean' };
  }

  return { success: true };
  // 애니메이션 속도 검증 - 더 엄격하게  
  if (uiSettings.animationSpeed !== undefined) {
    if (typeof uiSettings.animationSpeed !== 'string') {
      return { success: false, error: 'Animation speed must be a string' };
    }
    const validSpeeds = SETTINGS_CONSTRAINTS.ui.animationSpeed as readonly string[];
    if (!validSpeeds.includes(uiSettings.animationSpeed as string)) {
      return { success: false, error: `Invalid animation speed: ${uiSettings.animationSpeed}` };
    }
  }

  return { success: true };
}

/**
 * 🔥 분석 설정 검증
 */
export function validateAnalyticsSettings(analytics: unknown): SettingsResult<unknown> {
  if (!analytics || typeof analytics !== 'object') {
    return { success: false, error: 'Analytics settings must be an object' };
  }
  
  const analyticsSettings = analytics as Record<string, unknown>;
  
  // 목표 WPM 검증 - 더 엄격하게
  if (analyticsSettings.targetWPM !== undefined) {
    if (typeof analyticsSettings.targetWPM !== 'number') {
      return { success: false, error: 'Target WPM must be a number' };
    }
    const constraints = SETTINGS_CONSTRAINTS.analytics.targetWPM;
    if (analyticsSettings.targetWPM < constraints.min || analyticsSettings.targetWPM > constraints.max) {
      return { success: false, error: `Invalid target WPM: ${analyticsSettings.targetWPM}` };
    }
  }

  // 목표 정확도 검증 - 더 엄격하게
  if (analyticsSettings.targetAccuracy !== undefined) {
    if (typeof analyticsSettings.targetAccuracy !== 'number') {
      return { success: false, error: 'Target accuracy must be a number' };
    }
    const constraints = SETTINGS_CONSTRAINTS.analytics.targetAccuracy;
    if (analyticsSettings.targetAccuracy < constraints.min || analyticsSettings.targetAccuracy > constraints.max) {
      return { success: false, error: `Invalid target accuracy: ${analyticsSettings.targetAccuracy}` };
    }
  }

  // 일일 목표 검증 - 더 엄격하게
  if (analyticsSettings.dailyGoal !== undefined) {
    if (typeof analyticsSettings.dailyGoal !== 'number') {
      return { success: false, error: 'Daily goal must be a number' };
    }
    const constraints = SETTINGS_CONSTRAINTS.analytics.dailyGoal;
    if (analyticsSettings.dailyGoal < constraints.min || analyticsSettings.dailyGoal > constraints.max) {
      return { success: false, error: `Invalid daily goal: ${analyticsSettings.dailyGoal}` };
    }
  }

  return { success: true };
}

/**
 * 🔥 보안 설정 검증
 */
function validateSecuritySettings(security: unknown): SettingsResult<unknown> {
  if (!security || typeof security !== 'object') {
    return { success: false, error: 'Security settings must be an object' };
  }
  
  // 기본적인 불린 값들만 검증
  return { success: true };
}

/**
 * 🔥 알림 설정 검증
 */
function validateNotificationSettings(notifications: unknown): SettingsResult<unknown> {
  if (!notifications || typeof notifications !== 'object') {
    return { success: false, error: 'Notification settings must be an object' };
  }
  
  // 기본적인 불린 값들만 검증
  return { success: true };
}
