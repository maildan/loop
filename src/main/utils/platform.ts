// 🔥 기가차드 Platform 모듈 - 플랫폼별 로직 중앙화!

import { app } from 'electron';
import { Logger } from '../../shared/logger';

/**
 * 🔥 플랫폼 정보 인터페이스
 */
export interface PlatformInfo {
  name: 'macOS' | 'Windows' | 'Linux' | 'Unknown';
  platform: NodeJS.Platform;
  arch: string;
  version: string;
  isDesktop: boolean;
  isDarwin: boolean;
  isWin32: boolean;
  isLinux: boolean;
}

/**
 * 🔥 플랫폼별 기본값 인터페이스
 */
export interface PlatformDefaults {
  modifierKey: 'Cmd' | 'Ctrl' | 'Alt';
  titleBarStyle: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover';
  supportsSystemTray: boolean;
  supportsGlobalShortcuts: boolean;
  supportsAutoLaunch: boolean;
  supportsAccessibilityAPI: boolean;
  requiresElevatedPermissions: boolean;
  defaultShell: string;
  pathSeparator: string;
  homeDirectory: string;
  configDirectory: string;
}

/**
 * 🔥 Platform - 플랫폼별 로직 중앙화 클래스
 * 모든 OS 특성을 추상화하여 일관된 인터페이스 제공
 */
export class Platform {
  private static instance: Platform | null = null;
  private static platformInfo: PlatformInfo;
  private static platformDefaults: PlatformDefaults;
  private readonly componentName = 'PLATFORM';

  // 🔥 플랫폼 상수 정의
  private static readonly PLATFORM_NAMES = {
    darwin: 'macOS',
    win32: 'Windows', 
    linux: 'Linux'
  } as const;

  private constructor() {
    Platform.platformInfo = this.detectPlatform();
    Platform.platformDefaults = this.initializePlatformDefaults();
    Logger.info(this.componentName, 'Platform detection completed', Platform.platformInfo);
  }

  /**
   * 🔥 싱글톤 인스턴스 가져오기
   */
  public static getInstance(): Platform {
    if (!Platform.instance) {
      Platform.instance = new Platform();
    }
    return Platform.instance;
  }

  /**
   * 🔥 플랫폼 감지
   */
  private detectPlatform(): PlatformInfo {
    const platform = process.platform;
    const arch = process.arch;
    const version = process.version;

    return {
      name: this.getPlatformName(platform),
      platform,
      arch,
      version,
      isDesktop: true,
      isDarwin: platform === 'darwin',
      isWin32: platform === 'win32',
      isLinux: platform === 'linux'
    };
  }

  /**
   * 🔥 플랫폼 이름 매핑
   */
  private getPlatformName(platform: NodeJS.Platform): PlatformInfo['name'] {
    return Platform.PLATFORM_NAMES[platform as keyof typeof Platform.PLATFORM_NAMES] || 'Unknown';
  }

  /**
   * 🔥 플랫폼별 기본값 초기화
   */
  private initializePlatformDefaults(): PlatformDefaults {
    const platform = process.platform;

    const defaults: Record<string, Partial<PlatformDefaults>> = {
      darwin: {
        modifierKey: 'Cmd',
        titleBarStyle: 'hiddenInset',
        supportsSystemTray: true,
        supportsGlobalShortcuts: true,
        supportsAutoLaunch: true,
        supportsAccessibilityAPI: true,
        requiresElevatedPermissions: false,
        defaultShell: '/bin/zsh',
        pathSeparator: '/',
        homeDirectory: process.env.HOME || '~',
        configDirectory: `${process.env.HOME}/Library/Application Support`
      },
      win32: {
        modifierKey: 'Ctrl',
        titleBarStyle: 'default',
        supportsSystemTray: true,
        supportsGlobalShortcuts: true,
        supportsAutoLaunch: true,
        supportsAccessibilityAPI: false,
        requiresElevatedPermissions: true,
        defaultShell: 'cmd.exe',
        pathSeparator: '\\',
        homeDirectory: process.env.USERPROFILE || process.env.HOME || '~',
        configDirectory: `${process.env.APPDATA}`
      },
      linux: {
        modifierKey: 'Ctrl',
        titleBarStyle: 'default',
        supportsSystemTray: true,
        supportsGlobalShortcuts: true,
        supportsAutoLaunch: true,
        supportsAccessibilityAPI: false,
        requiresElevatedPermissions: false,
        defaultShell: '/bin/bash',
        pathSeparator: '/',
        homeDirectory: process.env.HOME || '~',
        configDirectory: `${process.env.HOME}/.config`
      }
    };

    // 기본값과 플랫폼별 값 병합
    const baseDefaults: PlatformDefaults = {
      modifierKey: 'Ctrl',
      titleBarStyle: 'default',
      supportsSystemTray: false,
      supportsGlobalShortcuts: false,
      supportsAutoLaunch: false,
      supportsAccessibilityAPI: false,
      requiresElevatedPermissions: false,
      defaultShell: '/bin/sh',
      pathSeparator: '/',
      homeDirectory: '~',
      configDirectory: '~/.config'
    };

    return {
      ...baseDefaults,
      ...(defaults[platform] || {})
    } as PlatformDefaults;
  }

  // ===== 🔥 정적 메서드들 (간편한 접근) =====

  /**
   * 🔥 현재 플랫폼 정보 가져오기
   */
  public static current(): PlatformInfo {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformInfo;
  }

  /**
   * 🔥 현재 플랫폼 반환
   */
  public static getCurrentPlatform(): NodeJS.Platform {
    return process.platform;
  }

  /**
   * 🔥 macOS 여부 확인
   */
  public static isMacOS(): boolean {
    return process.platform === 'darwin';
  }

  /**
   * 🔥 Windows 여부 확인
   */
  public static isWindows(): boolean {
    return process.platform === 'win32';
  }

  /**
   * 🔥 Linux 여부 확인
   */
  public static isLinux(): boolean {
    return process.platform === 'linux';
  }

  /**
   * 🔥 플랫폼 이름 가져오기
   */
  public static getPlatformName(): string {
    return Platform.current().name;
  }

  /**
   * 🔥 수정자 키 가져오기 (Cmd/Ctrl)
   */
  public static getModifierKey(): 'Cmd' | 'Ctrl' | 'Alt' {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.modifierKey;
  }

  /**
   * 🔥 타이틀바 스타일 가져오기
   */
  public static getTitleBarStyle(): 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover' {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.titleBarStyle;
  }

  /**
   * 🔥 시스템 트레이 지원 여부
   */
  public static supportsSystemTray(): boolean {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.supportsSystemTray;
  }

  /**
   * 🔥 전역 단축키 지원 여부
   */
  public static supportsGlobalShortcuts(): boolean {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.supportsGlobalShortcuts;
  }

  /**
   * 🔥 자동 시작 지원 여부
   */
  public static supportsAutoLaunch(): boolean {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.supportsAutoLaunch;
  }

  /**
   * 🔥 접근성 API 지원 여부
   */
  public static supportsAccessibilityAPI(): boolean {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.supportsAccessibilityAPI;
  }

  /**
   * 🔥 상승된 권한 필요 여부
   */
  public static requiresElevatedPermissions(): boolean {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.requiresElevatedPermissions;
  }

  /**
   * 🔥 기본 셸 가져오기
   */
  public static getDefaultShell(): string {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.defaultShell;
  }

  /**
   * 🔥 경로 구분자 가져오기
   */
  public static getPathSeparator(): string {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.pathSeparator;
  }

  /**
   * 🔥 홈 디렉토리 가져오기
   */
  public static getHomeDirectory(): string {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.homeDirectory;
  }

  /**
   * 🔥 설정 디렉토리 가져오기
   */
  public static getConfigDirectory(): string {
    Platform.getInstance(); // 초기화 보장
    return Platform.platformDefaults.configDirectory;
  }

  /**
   * 🔥 앱 데이터 경로 가져오기
   */
  public static getAppDataPath(subPath?: string): string {
    const basePath = app.getPath('userData');
    if (subPath) {
      const separator = Platform.getPathSeparator();
      return `${basePath}${separator}${subPath}`;
    }
    return basePath;
  }

  /**
   * 🔥 macOS가 아닌 경우 앱 종료 여부
   */
  public static shouldQuitOnWindowClose(): boolean {
    return !Platform.isMacOS();
  }

  /**
   * 🔥 특정 기능 지원 여부 확인
   */
  public static isSupported(feature: keyof PlatformDefaults): boolean {
    Platform.getInstance(); // 초기화 보장
    const value = Platform.platformDefaults[feature];
    return typeof value === 'boolean' ? value : false;
  }

  /**
   * 🔥 플랫폼별 설정값 조정 - unknown 타입 사용으로 안전성 확보
   */
  public static adaptConfig<T extends Record<string, unknown>>(config: T): T {
    const adapted = { ...config };

    // 플랫폼별 설정 조정 로직 (unknown 사용으로 타입 안전성 확보)
    if (Platform.isMacOS()) {
      // macOS 특화 설정
      (adapted as Record<string, unknown>).vibrancy = 'under-window';
      (adapted as Record<string, unknown>).transparent = true;
    } else if (Platform.isWindows()) {
      // Windows 특화 설정
      (adapted as Record<string, unknown>).frame = true;
      (adapted as Record<string, unknown>).backgroundColor = '#ffffff';
    } else if (Platform.isLinux()) {
      // Linux 특화 설정
      (adapted as Record<string, unknown>).icon = Platform.getAppDataPath('icon.png');
    }

    return adapted;
  }

  /**
   * 🔥 플랫폼별 권한 요청
   */
  public static async requestPermissions(): Promise<{
    accessibility: boolean;
    inputMonitoring: boolean;
    screenRecording: boolean;
  }> {
    const results = {
      accessibility: false,
      inputMonitoring: false,
      screenRecording: false
    };

    if (Platform.isMacOS()) {
      // macOS 권한 요청 로직
      Logger.info('PLATFORM', 'Requesting macOS permissions');
      // 실제 권한 요청은 각 매니저에서 구현
      results.accessibility = Platform.supportsAccessibilityAPI();
    } else if (Platform.isWindows()) {
      // Windows UAC 처리
      Logger.info('PLATFORM', 'Checking Windows permissions');
      results.inputMonitoring = true; // Windows는 기본적으로 허용
    } else if (Platform.isLinux()) {
      // Linux 권한 확인
      Logger.info('PLATFORM', 'Checking Linux permissions');
      results.inputMonitoring = true; // Linux는 기본적으로 허용
    }

    return results;
  }

  /**
   * 🔥 플랫폼 정보 요약
   */
  public static getSummary(): {
    platform: string;
    name: string;
    arch: string;
    modifierKey: string;
    supportsSystemTray: boolean;
    supportsGlobalShortcuts: boolean;
    supportsAutoLaunch: boolean;
  } {
    Platform.getInstance(); // 초기화 보장
    return {
      platform: Platform.platformInfo.platform,
      name: Platform.platformInfo.name,
      arch: Platform.platformInfo.arch,
      modifierKey: Platform.platformDefaults.modifierKey,
      supportsSystemTray: Platform.platformDefaults.supportsSystemTray,
      supportsGlobalShortcuts: Platform.platformDefaults.supportsGlobalShortcuts,
      supportsAutoLaunch: Platform.platformDefaults.supportsAutoLaunch
    };
  }

  /**
   * 🔥 플랫폼 검증
   */
  public static validate(): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    Platform.getInstance(); // 초기화 보장

    // 지원되는 플랫폼인지 확인
    if (Platform.platformInfo.name === 'Unknown') {
      errors.push(`Unsupported platform: ${Platform.platformInfo.platform}`);
    }

    // 아키텍처 확인
    if (!['x64', 'arm64'].includes(Platform.platformInfo.arch)) {
      warnings.push(`Untested architecture: ${Platform.platformInfo.arch}`);
    }

    // 권한 확인
    if (Platform.isMacOS() && !Platform.supportsAccessibilityAPI()) {
      warnings.push('Accessibility permissions may be required on macOS');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  }
}

// 🔥 기가차드 전역 플랫폼 인스턴스
export const platform = Platform.getInstance();

// 🔥 편의 함수들 (하위 호환성)
export const isMacOS = Platform.isMacOS;
export const isWindows = Platform.isWindows;
export const isLinux = Platform.isLinux;
export const getModifierKey = Platform.getModifierKey;
export const getTitleBarStyle = Platform.getTitleBarStyle;
export const supportsSystemTray = Platform.supportsSystemTray;
export const shouldQuitOnWindowClose = Platform.shouldQuitOnWindowClose;

export default Platform;
