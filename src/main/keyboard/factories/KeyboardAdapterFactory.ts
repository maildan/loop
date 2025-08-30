// 🔥 기가차드 키보드 어댑터 팩토리 - OS별 최적 어댑터 자동 선택!

import { Logger } from '../../../shared/logger';
import { Platform } from '../../utils/platform';
import type { IKeyboardInputAdapter, AdapterOptions } from '../adapters/IKeyboardInputAdapter';
import { UniversalKeyboardAdapter } from '../adapters/UniversalKeyboardAdapter';

/**
 * 🔥 KeyboardAdapterFactory - 플랫폼별 최적 키보드 어댑터 자동 선택
 * 
 * 단 하나의 역할: 현재 플랫폼에 최적화된 키보드 입력 어댑터를 생성
 * - macOS: CoreGraphics 이벤트 탭 기반 네이티브 감지
 * - Windows: Win32 API SetWindowsHookEx 기반 감지  
 * - Linux: X11/Wayland 이벤트 기반 감지
 * - Fallback: uIOhook 기반 범용 감지
 */
export class KeyboardAdapterFactory {
  private static readonly componentName = 'KEYBOARD_ADAPTER_FACTORY';

  /**
   * 🔥 플랫폼별 최적 키보드 어댑터 생성
   */
  public static async createAdapter(options: AdapterOptions = {}): Promise<IKeyboardInputAdapter> {
    Logger.info(this.componentName, '🔥 플랫폼 감지 및 키보드 어댑터 생성 시작', {
      platform: Platform.getPlatformName(),
      arch: process.arch,
      options
    });

    try {
      let adapter: IKeyboardInputAdapter;

      // 🔥 플랫폼별 최적 어댑터 선택
      if (Platform.isMacOS()) {
        adapter = await this.createMacOSAdapter(options);
        Logger.info(this.componentName, '✅ macOS 네이티브 키보드 어댑터 생성됨');
      } else if (Platform.isWindows()) {
        adapter = await this.createWindowsAdapter(options);
        Logger.info(this.componentName, '✅ Windows 네이티브 키보드 어댑터 생성됨');
      } else if (Platform.isLinux()) {
        adapter = await this.createLinuxAdapter(options);
        Logger.info(this.componentName, '✅ Linux 네이티브 키보드 어댑터 생성됨');
      } else {
        adapter = await this.createUniversalAdapter(options);
        Logger.warn(this.componentName, '⚠️ 알 수 없는 플랫폼, Universal 어댑터 사용', {
          platform: process.platform
        });
      }

      Logger.info(this.componentName, '🎯 키보드 어댑터 생성 완료', {
        adapterType: adapter.constructor.name,
        platform: Platform.getPlatformName(),
        createdAt: new Date()
      });

      return adapter;

    } catch (error) {
      Logger.error(this.componentName, '❌ 키보드 어댑터 생성 실패, Universal 어댑터로 폴백', {
        error: String(error)
      });
      
      // 실패 시 Universal 어댑터 사용
      return await this.createUniversalAdapter(options);
    }
  }

  /**
   * 🔥 macOS 전용 어댑터 생성
   */
  private static async createMacOSAdapter(options: AdapterOptions): Promise<IKeyboardInputAdapter> {
    try {
      // 동적 import로 macOS 어댑터 로드
      const { MacOSKeyboardAdapter } = await import('../adapters/MacOSKeyboardAdapter');
      return new MacOSKeyboardAdapter(options);
    } catch (error) {
      Logger.warn(this.componentName, 'macOS 어댑터 로드 실패, Universal 어댑터로 폴백', error);
      return await this.createUniversalAdapter(options);
    }
  }

  /**
   * 🔥 Windows 전용 어댑터 생성
   */
  private static async createWindowsAdapter(options: AdapterOptions): Promise<IKeyboardInputAdapter> {
    try {
      // 동적 import로 Windows 어댑터 로드
      const { WindowsKeyboardAdapter } = await import('../adapters/WindowsKeyboardAdapter');
      return new WindowsKeyboardAdapter(options);
    } catch (error) {
      Logger.warn(this.componentName, 'Windows 어댑터 로드 실패, Universal 어댑터로 폴백', error);
      return await this.createUniversalAdapter(options);
    }
  }

  /**
   * 🔥 Linux 전용 어댑터 생성
   */
  private static async createLinuxAdapter(options: AdapterOptions): Promise<IKeyboardInputAdapter> {
    try {
      // 동적 import로 Linux 어댑터 로드
      const { LinuxKeyboardAdapter } = await import('../adapters/LinuxKeyboardAdapter');
      return new LinuxKeyboardAdapter(options);
    } catch (error) {
      Logger.warn(this.componentName, 'Linux 어댑터 로드 실패, Universal 어댑터로 폴백', error);
      return await this.createUniversalAdapter(options);
    }
  }

  /**
   * 🔥 범용 어댑터 생성 (uIOhook 기반)
   */
  private static async createUniversalAdapter(options: AdapterOptions): Promise<IKeyboardInputAdapter> {
    return new UniversalKeyboardAdapter(options);
  }

  /**
   * 🔥 팩토리 정보 반환
   */
  public static getInfo(): {
    platform: string;
    availableAdapters: string[];
    recommendedAdapter: string;
  } {
    const availableAdapters = ['UniversalKeyboardAdapter'];
    let recommendedAdapter = 'UniversalKeyboardAdapter';

    if (Platform.isMacOS()) {
      availableAdapters.push('MacOSKeyboardAdapter');
      recommendedAdapter = 'MacOSKeyboardAdapter';
    } else if (Platform.isWindows()) {
      availableAdapters.push('WindowsKeyboardAdapter');
      recommendedAdapter = 'WindowsKeyboardAdapter';
    } else if (Platform.isLinux()) {
      availableAdapters.push('LinuxKeyboardAdapter');
      recommendedAdapter = 'LinuxKeyboardAdapter';
    }

    return {
      platform: Platform.getPlatformName(),
      availableAdapters,
      recommendedAdapter
    };
  }
}

export default KeyboardAdapterFactory;
