// 🔥 기가차드 Settings 모듈 통합 진입점 - electron-store 기반

export * from './types';
export * from './defaults';
export * from './validation';
export { ElectronStoreSettingsManager } from './ElectronStoreSettingsManager';

// 🔥 electron-store 기반 Settings 인스턴스 생성 팩토리
import { ElectronStoreSettingsManager } from './ElectronStoreSettingsManager';

/**
 * 🔥 기가차드 Settings 시스템 생성 (electron-store 기반)
 */
export function createSettingsManager(): ElectronStoreSettingsManager {
  return new ElectronStoreSettingsManager();
}

/**
 * 🔥 전역 Settings 인스턴스 (싱글톤)
 */
let globalSettingsManager: ElectronStoreSettingsManager | null = null;

export function getSettingsManager(): ElectronStoreSettingsManager {
  if (!globalSettingsManager) {
    globalSettingsManager = createSettingsManager();
  }
  return globalSettingsManager;
}


/**
 * 🔥 Settings 시스템 초기화 (electron-store는 자동 초기화)
 */
export async function initializeSettings(): Promise<ElectronStoreSettingsManager> {
  const settingsManager = getSettingsManager();
  // electron-store는 자동으로 초기화됨
  return settingsManager;
}

/**
 * 🔥 Settings 시스템 정리
 */
export async function cleanupSettings(): Promise<void> {
  if (globalSettingsManager) {
    // electron-store는 별도 cleanup이 필요 없음
    globalSettingsManager = null;
  }
}
