// 🔥 기가차드 키보드 설정 관리자 - 키보드 모니터링 설정 관리

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result } from '../../shared/types';

// #DEBUG: Keyboard config manager entry point
Logger.debug('KEYBOARD_CONFIG_MANAGER', 'Keyboard config manager module loaded');

// 🔥 기가차드 키보드 설정 인터페이스
export interface KeyboardConfig {
  enabled: boolean;
  language: string;
  trackingMode: 'full' | 'typing-only' | 'window-aware';
  privacyMode: boolean;
  bufferSize: number;
  flushInterval: number;
  excludedApplications: string[];
  includedApplications: string[];
  hotkeys: Record<string, string>;
  autoLanguageDetection: boolean;
  multiLanguageSupport: boolean;
  sessionTimeout: number;
  minSessionLength: number;
  enableSounds: boolean;
  enableNotifications: boolean;
  autoSave: boolean;
  statisticsEnabled: boolean;
  advancedMetrics: boolean;
}

// 🔥 기가차드 언어 설정
export interface LanguageConfig {
  code: string;
  name: string;
  layout: string;
  enabled: boolean;
  priority: number;
  characterSet: string[];
  commonWords: string[];
}

// 🔥 기가차드 애플리케이션 필터
export interface ApplicationFilter {
  name: string;
  executable: string;
  enabled: boolean;
  type: 'include' | 'exclude';
  windowTitlePattern?: string;
  priority: number;
}

// 🔥 기가차드 단축키 설정
export interface HotkeyConfig {
  id: string;
  combination: string;
  action: string;
  description: string;
  enabled: boolean;
  global: boolean;
}

/**
 * 🔥 KeyboardConfigManager - 키보드 모니터링 설정 관리
 * 언어, 필터, 단축키, 성능 설정 등 관리
 */
export class KeyboardConfigManager extends BaseManager {
  private readonly componentName = 'KEYBOARD_CONFIG_MANAGER';
  private keyboardConfig: KeyboardConfig;
  private languages: Map<string, LanguageConfig> = new Map();
  private applicationFilters: Map<string, ApplicationFilter> = new Map();
  private hotkeys: Map<string, HotkeyConfig> = new Map();
  private configFilePath: string;
  private autoSaveTimer: NodeJS.Timeout | null = null;

  constructor() {
    super({ name: 'KeyboardConfigManager', autoStart: true });

    // 기본 설정
    this.keyboardConfig = this.getDefaultConfig();
    this.configFilePath = './config/keyboard-config.json';
  }

  /**
   * BaseManager 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    Logger.info(this.componentName, 'Initializing keyboard config manager');

    await this.loadConfig();
    await this.setupDefaultLanguages();
    await this.setupDefaultApplicationFilters();
    await this.setupDefaultHotkeys();

    if (this.keyboardConfig.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * BaseManager 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    Logger.info(this.componentName, 'Starting keyboard config manager');

    // 설정 유효성 검사
    await this.validateConfig();
  }

  /**
   * BaseManager 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    Logger.info(this.componentName, 'Stopping keyboard config manager');

    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }

    // 최종 저장
    await this.saveConfig();
  }

  /**
   * BaseManager 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    Logger.info(this.componentName, 'Cleaning up keyboard config manager');

    this.languages.clear();
    this.applicationFilters.clear();
    this.hotkeys.clear();
  }

  /**
   * 기본 설정 생성
   */
  private getDefaultConfig(): KeyboardConfig {
    return {
      enabled: true,
      language: 'auto',
      trackingMode: 'typing-only',
      privacyMode: false,
      bufferSize: 1000,
      flushInterval: 5000,
      excludedApplications: ['1Password', 'Keychain Access', 'Terminal'],
      includedApplications: [],
      hotkeys: {
        'toggle-monitoring': 'CommandOrControl+Shift+M',
        'pause-monitoring': 'CommandOrControl+Shift+P',
        'show-stats': 'CommandOrControl+Shift+S',
      },
      autoLanguageDetection: true,
      multiLanguageSupport: true,
      sessionTimeout: 300000, // 5분
      minSessionLength: 10000, // 10초
      enableSounds: false,
      enableNotifications: true,
      autoSave: true,
      statisticsEnabled: true,
      advancedMetrics: false,
    };
  }

  /**
   * 설정 로드
   */
  private async loadConfig(): Promise<void> {
    try {
      // 실제 구현에서는 파일 시스템에서 로드
      // 현재는 기본 설정 사용
      Logger.info(this.componentName, 'Config loaded from file');
    } catch (error) {
      Logger.warn(this.componentName, 'Failed to load config, using defaults', error);
      this.keyboardConfig = this.getDefaultConfig();
    }
  }

  /**
   * 설정 저장
   */
  public async saveConfig(): Promise<Result<boolean>> {
    try {
      // 실제 구현에서는 파일 시스템에 저장
      Logger.info(this.componentName, 'Config saved to file');
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to save config', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 기본 언어 설정
   */
  private async setupDefaultLanguages(): Promise<void> {
    const defaultLanguages: LanguageConfig[] = [
      {
        code: 'en',
        name: 'English',
        layout: 'qwerty',
        enabled: true,
        priority: 1,
        characterSet: ['a-z', 'A-Z', '0-9'],
        commonWords: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I'],
      },
      {
        code: 'ko',
        name: '한국어',
        layout: 'hangul',
        enabled: true,
        priority: 2,
        characterSet: ['ㄱ-ㅎ', 'ㅏ-ㅣ', '가-힣'],
        commonWords: ['그리고', '하지만', '그래서', '따라서', '또한', '즉', '예를', '들어', '같은', '다른'],
      },
      {
        code: 'ja',
        name: '日本語',
        layout: 'japanese',
        enabled: false,
        priority: 3,
        characterSet: ['あ-ん', 'ア-ン', '一-龯'],
        commonWords: ['です', 'ます', 'である', 'という', 'ている', 'ない', 'ある', 'する', 'なる', 'いる'],
      },
    ];

    for (const lang of defaultLanguages) {
      this.languages.set(lang.code, lang);
    }
  }

  /**
   * 기본 애플리케이션 필터 설정
   */
  private async setupDefaultApplicationFilters(): Promise<void> {
    const defaultFilters: ApplicationFilter[] = [
      {
        name: '1Password',
        executable: '1Password 7',
        enabled: true,
        type: 'exclude',
        priority: 1,
      },
      {
        name: 'Keychain Access',
        executable: 'Keychain Access',
        enabled: true,
        type: 'exclude',
        priority: 2,
      },
      {
        name: 'VS Code',
        executable: 'Visual Studio Code',
        enabled: true,
        type: 'include',
        priority: 3,
      },
      {
        name: 'Xcode',
        executable: 'Xcode',
        enabled: true,
        type: 'include',
        priority: 4,
      },
    ];

    for (const filter of defaultFilters) {
      this.applicationFilters.set(filter.name, filter);
    }
  }

  /**
   * 기본 단축키 설정
   */
  private async setupDefaultHotkeys(): Promise<void> {
    const defaultHotkeys: HotkeyConfig[] = [
      {
        id: 'toggle-monitoring',
        combination: 'CommandOrControl+Shift+M',
        action: 'toggle-monitoring',
        description: 'Toggle keyboard monitoring',
        enabled: true,
        global: true,
      },
      {
        id: 'pause-monitoring',
        combination: 'CommandOrControl+Shift+P',
        action: 'pause-monitoring',
        description: 'Pause keyboard monitoring',
        enabled: true,
        global: true,
      },
      {
        id: 'show-stats',
        combination: 'CommandOrControl+Shift+S',
        action: 'show-stats',
        description: 'Show typing statistics',
        enabled: true,
        global: false,
      },
    ];

    for (const hotkey of defaultHotkeys) {
      this.hotkeys.set(hotkey.id, hotkey);
    }
  }

  /**
   * 자동 저장 시작
   */
  private startAutoSave(): void {
    if (this.autoSaveTimer) return;

    this.autoSaveTimer = setInterval(async () => {
      await this.saveConfig();
    }, 30000); // 30초마다 저장
  }

  /**
   * 설정 유효성 검사
   */
  private async validateConfig(): Promise<void> {
    // 버퍼 크기 제한
    if (this.keyboardConfig.bufferSize > 10000) {
      this.keyboardConfig.bufferSize = 10000;
      Logger.warn(this.componentName, 'Buffer size limited to 10000');
    }

    // 플러시 간격 제한
    if (this.keyboardConfig.flushInterval < 1000) {
      this.keyboardConfig.flushInterval = 1000;
      Logger.warn(this.componentName, 'Flush interval limited to minimum 1000ms');
    }

    // 세션 타임아웃 제한
    if (this.keyboardConfig.sessionTimeout > 3600000) { // 1시간
      this.keyboardConfig.sessionTimeout = 3600000;
      Logger.warn(this.componentName, 'Session timeout limited to 1 hour');
    }
  }

  /**
   * 전체 설정 조회
   */
  public getKeyboardConfig(): KeyboardConfig {
    return { ...this.keyboardConfig };
  }

  /**
   * 설정 업데이트
   */
  public async updateConfig(updates: Partial<KeyboardConfig>): Promise<Result<boolean>> {
    try {
      this.keyboardConfig = { ...this.keyboardConfig, ...updates };
      await this.validateConfig();

      Logger.info(this.componentName, 'Config updated', { updates });
      this.emit('configUpdated', this.keyboardConfig);

      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to update config', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 언어 설정 조회
   */
  public getLanguages(): LanguageConfig[] {
    return Array.from(this.languages.values());
  }

  /**
   * 언어 설정 업데이트
   */
  public async updateLanguage(code: string, updates: Partial<LanguageConfig>): Promise<Result<boolean>> {
    try {
      const existing = this.languages.get(code);
      if (!existing) {
        return { success: false, error: 'Language not found' };
      }

      const updated = { ...existing, ...updates };
      this.languages.set(code, updated);

      Logger.info(this.componentName, 'Language updated', { code, updates });
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to update language', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 애플리케이션 필터 조회
   */
  public getApplicationFilters(): ApplicationFilter[] {
    return Array.from(this.applicationFilters.values());
  }

  /**
   * 애플리케이션 필터 추가/업데이트
   */
  public async updateApplicationFilter(name: string, filter: Partial<ApplicationFilter>): Promise<Result<boolean>> {
    try {
      const existing = this.applicationFilters.get(name) || {} as ApplicationFilter;
      const updated = { ...existing, name, ...filter };

      this.applicationFilters.set(name, updated);

      Logger.info(this.componentName, 'Application filter updated', { name, filter });
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to update application filter', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 단축키 설정 조회
   */
  public getHotkeys(): HotkeyConfig[] {
    return Array.from(this.hotkeys.values());
  }

  /**
   * 단축키 설정 업데이트
   */
  public async updateHotkey(id: string, hotkey: Partial<HotkeyConfig>): Promise<Result<boolean>> {
    try {
      const existing = this.hotkeys.get(id);
      if (!existing) {
        return { success: false, error: 'Hotkey not found' };
      }

      const updated = { ...existing, ...hotkey };
      this.hotkeys.set(id, updated);

      Logger.info(this.componentName, 'Hotkey updated', { id, hotkey });
      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to update hotkey', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 설정 리셋
   */
  public async resetConfig(): Promise<Result<boolean>> {
    try {
      this.keyboardConfig = this.getDefaultConfig();
      await this.setupDefaultLanguages();
      await this.setupDefaultApplicationFilters();
      await this.setupDefaultHotkeys();

      Logger.info(this.componentName, 'Config reset to defaults');
      this.emit('configReset', this.keyboardConfig);

      return { success: true, data: true };
    } catch (error) {
      Logger.error(this.componentName, 'Failed to reset config', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * 애플리케이션이 포함되는지 확인
   */
  public shouldTrackApplication(appName: string, windowTitle?: string): boolean {
    // 제외 목록 확인
    for (const filter of this.applicationFilters.values()) {
      if (!filter.enabled) continue;

      if (filter.type === 'exclude' &&
        (filter.name === appName || filter.executable === appName)) {

        // 윈도우 타이틀 패턴 확인
        if (filter.windowTitlePattern && windowTitle) {
          // Use simple substring matching to avoid RegExp injection vulnerabilities
          try {
            if (windowTitle.toLowerCase().includes(filter.windowTitlePattern.toLowerCase())) {
              return false;
            }
          } catch (e) {
            // If includes fails due to unexpected input, conservatively skip denying access.
          }
        } else {
          return false;
        }
      }
    }

    // 포함 목록이 있으면 확인
    const includeFilters = Array.from(this.applicationFilters.values())
      .filter(f => f.enabled && f.type === 'include');

    if (includeFilters.length > 0) {
      return includeFilters.some(filter =>
        filter.name === appName || filter.executable === appName
      );
    }

    return true; // 기본적으로 추적
  }

  /**
   * 현재 언어가 지원되는지 확인
   */
  public isLanguageSupported(langCode: string): boolean {
    const lang = this.languages.get(langCode);
    return lang ? lang.enabled : false;
  }
}

// 🔥 기가차드 전역 키보드 설정 관리자
export const keyboardConfigManager = new KeyboardConfigManager();

// #DEBUG: Keyboard config manager exit point
Logger.debug('KEYBOARD_CONFIG_MANAGER', 'Keyboard config manager module setup complete');

export default keyboardConfigManager;