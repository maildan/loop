// 🔥 기가차드 Performance Optimizer - V8 & 메모리 최적화 (크로스 플랫폼)

import { app, BrowserWindow } from 'electron';
import { Logger } from '../../shared/logger';
import { Platform } from '../utils/platform';

/**
 * 🔥 성능 최적화 설정 인터페이스
 */
export interface PerformanceConfig {
  v8Flags: string[];
  memoryConfig: {
    maxOldSpaceSize: number;
    maxNewSpaceSize: number;
    enableGC: boolean;
  };
  electronFlags: string[];
  developmentMode: boolean;
}

/**
 * 🔥 PerformanceOptimizer - 크로스 플랫폼 성능 최적화
 * 
 * 책임:
 * - V8 엔진 최적화
 * - 메모리 관리 최적화  
 * - GPU/CPU 가속 설정
 * - 플랫폼별 최적화
 */
export class PerformanceOptimizer {
  private readonly componentName = 'PERFORMANCE_OPTIMIZER';
  private isOptimized = false;
  private performanceConfig: PerformanceConfig;

  constructor() {
    this.performanceConfig = this.createOptimalConfig();
    Logger.info(this.componentName, '🚀 Performance optimizer created');
  }

  /**
   * 🔥 전체 성능 최적화 적용
   */
  public async optimizeApplication(): Promise<void> {
    if (this.isOptimized) {
      Logger.warn(this.componentName, 'Performance already optimized, skipping');
      return;
    }

    try {
      Logger.info(this.componentName, '🔧 Starting performance optimization');

      // 1. V8 엔진 최적화
      this.optimizeV8Engine();
      
      // 2. 메모리 최적화
      this.optimizeMemorySettings();
      
      // 3. GPU/하드웨어 가속 최적화
      this.optimizeHardwareAcceleration();
      
      // 4. 플랫폼별 최적화
      this.optimizePlatformSpecific();
      
      // 5. 프로세스 최적화
      this.optimizeProcessSettings();

      this.isOptimized = true;
      Logger.info(this.componentName, '✅ Performance optimization complete');
    } catch (error) {
      Logger.error(this.componentName, 'Performance optimization failed', error);
      throw error;
    }
  }

  /**
   * 🔥 최적 설정 생성 (플랫폼별)
   */
  private createOptimalConfig(): PerformanceConfig {
    const isDev = process.env.NODE_ENV === 'development';
    const platform = process.platform;
    
    // 기본 V8 플래그 (크로스 플랫폼)
    const baseV8Flags = [
      '--max-old-space-size=4096',        // 4GB 힙 크기
      '--max-new-space-size=1024',        // 1GB 새로운 공간
      '--optimize-for-size',              // 메모리 최적화 우선
      '--gc-interval=100',                // GC 간격 최적화
      '--expose-gc',                      // GC 수동 제어 활성화
    ];

    // 개발 모드 추가 플래그
    const devV8Flags = isDev ? [
      '--prof',                           // 프로파일링 활성화
      '--trace-opt',                      // 최적화 추적
      '--trace-deopt',                    // 비최적화 추적
    ] : [];

    // 플랫폼별 추가 플래그
    const platformV8Flags = this.getPlatformSpecificV8Flags(platform);

    return {
      v8Flags: [...baseV8Flags, ...devV8Flags, ...platformV8Flags],
      memoryConfig: {
        maxOldSpaceSize: isDev ? 2048 : 4096,  // 개발/프로덕션 차등
        maxNewSpaceSize: isDev ? 512 : 1024,
        enableGC: true,
      },
      electronFlags: this.getElectronFlags(platform, isDev),
      developmentMode: isDev,
    };
  }

  /**
   * 🔥 플랫폼별 V8 플래그
   */
  private getPlatformSpecificV8Flags(platform: string): string[] {
    switch (platform) {
      case 'darwin': // macOS
        return [
          '--use-idle-notification',      // 유휴 알림 사용
          '--optimize-for-memory',        // 메모리 최적화
        ];
        
      case 'win32': // Windows
        return [
          '--experimental-wasm-threads',  // WASM 스레드 지원
          '--concurrent-marking',         // 동시 마킹
        ];
        
      case 'linux': // Linux
        return [
          '--use-strict',                 // 엄격 모드
          '--harmony',                    // 최신 JS 기능
        ];
        
      default:
        return [];
    }
  }

  /**
   * 🔥 Electron 플래그 설정
   */
  private getElectronFlags(platform: string, isDev: boolean): string[] {
    const baseFlags = [
      '--disable-background-timer-throttling',  // 백그라운드 스로틀링 비활성화
      '--disable-backgrounding-occluded-windows', // 가려진 윈도우 백그라운드 처리 비활성화
      '--disable-renderer-backgrounding',       // 렌더러 백그라운드 처리 비활성화
      '--enable-features=VaapiVideoDecoder',    // 하드웨어 비디오 디코딩
    ];

    // 개발 모드 플래그
    const devFlags = isDev ? [
      '--enable-logging',               // 로깅 활성화
      '--v=1',                         // 상세 로깅
    ] : [
      '--disable-logging',             // 프로덕션에서는 로깅 비활성화
    ];

    // 플랫폼별 플래그
    const platformFlags = this.getPlatformElectronFlags(platform);

    return [...baseFlags, ...devFlags, ...platformFlags];
  }

  /**
   * 🔥 플랫폼별 Electron 플래그
   */
  private getPlatformElectronFlags(platform: string): string[] {
    switch (platform) {
      case 'darwin': // macOS
        return [
          '--enable-gpu-rasterization',   // GPU 래스터화
          '--enable-zero-copy',           // 제로 카피
        ];
        
      case 'win32': // Windows
        return [
          '--enable-direct-composition',  // Direct Composition
          '--enable-hardware-overlays',   // 하드웨어 오버레이
        ];
        
      case 'linux': // Linux
        return [
          '--enable-accelerated-2d-canvas', // 2D 캔버스 가속
          '--enable-gpu-memory-buffer-video-frames', // GPU 메모리 버퍼
        ];
        
      default:
        return [];
    }
  }

  /**
   * 🔥 V8 엔진 최적화
   */
  private optimizeV8Engine(): void {
    try {
      // V8 플래그 적용
      this.performanceConfig.v8Flags.forEach(flag => {
        app.commandLine.appendSwitch('js-flags', flag);
      });

      // 추가 V8 최적화
      app.commandLine.appendSwitch('js-flags', 
        this.performanceConfig.v8Flags.join(' ')
      );

      Logger.info(this.componentName, '🎯 V8 engine optimized', {
        flags: this.performanceConfig.v8Flags.length,
        memoryLimit: this.performanceConfig.memoryConfig.maxOldSpaceSize
      });
    } catch (error) {
      Logger.error(this.componentName, 'V8 optimization failed', error);
    }
  }

  /**
   * 🔥 메모리 설정 최적화
   */
  private optimizeMemorySettings(): void {
    try {
      const { memoryConfig } = this.performanceConfig;

      // 메모리 제한 설정
      app.commandLine.appendSwitch('max_old_space_size', memoryConfig.maxOldSpaceSize.toString());
      app.commandLine.appendSwitch('max_semi_space_size', memoryConfig.maxNewSpaceSize.toString());

      // GC 최적화
      if (memoryConfig.enableGC) {
        app.commandLine.appendSwitch('expose-gc', 'true');
      }

      // 메모리 압축 활성화 (Electron 14+)
      app.commandLine.appendSwitch('enable-pointer-compression', 'true');

      Logger.info(this.componentName, '💾 Memory settings optimized', {
        oldSpaceSize: `${memoryConfig.maxOldSpaceSize}MB`,
        newSpaceSize: `${memoryConfig.maxNewSpaceSize}MB`,
        gcEnabled: memoryConfig.enableGC
      });
    } catch (error) {
      Logger.error(this.componentName, 'Memory optimization failed', error);
    }
  }

  /**
   * 🔥 하드웨어 가속 최적화
   */
  private optimizeHardwareAcceleration(): void {
    try {
      // GPU 가속 활성화 (플랫폼별)
      if (Platform.isMacOS() || Platform.isWindows()) {
        // macOS, Windows: GPU 가속 활성화
        app.commandLine.appendSwitch('enable-gpu-rasterization');
        app.commandLine.appendSwitch('enable-zero-copy');
      } else if (Platform.isLinux()) {
        // Linux: 조건부 GPU 가속
        app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
        app.commandLine.appendSwitch('ignore-gpu-blacklist');
      }

      // 공통 하드웨어 최적화
      app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,CanvasOopRasterization');
      app.commandLine.appendSwitch('disable-features', 'UseChromeOSDirectVideoDecoder');

      // WebGL 최적화
      app.commandLine.appendSwitch('enable-webgl2-compute-context');
      app.commandLine.appendSwitch('enable-unsafe-webgpu');

      Logger.info(this.componentName, '🎮 Hardware acceleration optimized', {
        platform: process.platform,
        gpuEnabled: true
      });
    } catch (error) {
      Logger.error(this.componentName, 'Hardware acceleration optimization failed', error);
    }
  }

  /**
   * 🔥 플랫폼별 최적화
   */
  private optimizePlatformSpecific(): void {
    try {
      if (Platform.isMacOS()) {
        this.optimizeMacOS();
      } else if (Platform.isWindows()) {
        this.optimizeWindows();
      } else if (Platform.isLinux()) {
        this.optimizeLinux();
      }

      Logger.info(this.componentName, `🎯 Platform-specific optimization applied for ${process.platform}`);
    } catch (error) {
      Logger.error(this.componentName, 'Platform-specific optimization failed', error);
    }
  }

  /**
   * 🔥 macOS 최적화
   */
  private optimizeMacOS(): void {
    // Metal 렌더링 활성화
    app.commandLine.appendSwitch('enable-metal');
    
    // 고해상도 디스플레이 최적화
    app.commandLine.appendSwitch('force-device-scale-factor', '1');
    
    // 에너지 효율성 최적화
    app.commandLine.appendSwitch('enable-low-end-device-mode');
  }

  /**
   * 🔥 Windows 최적화
   */
  private optimizeWindows(): void {
    // DirectWrite 최적화
    app.commandLine.appendSwitch('enable-direct-write');
    
    // D3D11 활성화
    app.commandLine.appendSwitch('enable-d3d11');
    
    // Windows 특화 GPU 최적화
    app.commandLine.appendSwitch('enable-direct-composition');
  }

  /**
   * 🔥 Linux 최적화
   */
  private optimizeLinux(): void {
    // X11/Wayland 최적화
    app.commandLine.appendSwitch('enable-features', 'UseOzonePlatform');
    app.commandLine.appendSwitch('ozone-platform', 'wayland');
    
    // 리눅스 특화 렌더링 최적화
    app.commandLine.appendSwitch('enable-gpu-sandbox');
  }

  /**
   * 🔥 프로세스 설정 최적화
   */
  private optimizeProcessSettings(): void {
    try {
      // Electron 플래그 적용
      this.performanceConfig.electronFlags.forEach(flag => {
        const [key, value] = flag.split('=');
        if (key) {
          if (value) {
            app.commandLine.appendSwitch(key.replace('--', ''), value);
          } else {
            app.commandLine.appendSwitch(flag.replace('--', ''));
          }
        }
      });

      // 프로세스 우선순위 설정 (플랫폼별)
      let prioritySet = false;
      if (Platform.isWindows()) {
        try {
          // Windows에서만 프로세스 우선순위 설정 시도
          require('child_process').exec('wmic process where processid=' + process.pid + ' CALL setpriority "high priority"');
          prioritySet = true;
        } catch (error) {
          Logger.warn(this.componentName, 'Failed to set high priority on Windows', error);
        }
      }

      Logger.info(this.componentName, '⚙️ Process settings optimized', {
        flags: this.performanceConfig.electronFlags.length,
        prioritySet: prioritySet
      });
    } catch (error) {
      Logger.error(this.componentName, 'Process optimization failed', error);
    }
  }

  /**
   * 🔥 윈도우별 성능 최적화
   */
  public optimizeWindow(window: BrowserWindow): void {
    try {
      const webContents = window.webContents;

      // 백그라운드 스로틀링 설정
      if (this.performanceConfig.developmentMode) {
        webContents.setBackgroundThrottling(false); // 개발 중에는 비활성화
      } else {
        webContents.setBackgroundThrottling(true);  // 프로덕션에서는 활성화
      }

      // 오디오 정책 설정
      webContents.setAudioMuted(false);

      // 줌 레벨 고정 (성능 최적화)
      webContents.setZoomFactor(1.0);

      // 프레임률 최적화
      webContents.setFrameRate(60);

      Logger.debug(this.componentName, '🪟 Window performance optimized');
    } catch (error) {
      Logger.error(this.componentName, 'Window optimization failed', error);
    }
  }

  /**
   * 🔥 메모리 정리 강제 실행
   */
  public forceGarbageCollection(): void {
    try {
      if (global.gc) {
        // V8 GC 강제 실행
        global.gc();
        
        // 모든 윈도우 캐시 정리
        BrowserWindow.getAllWindows().forEach(window => {
          if (!window.isDestroyed()) {
            window.webContents.session.clearCache();
          }
        });

        Logger.debug(this.componentName, '🧹 Forced garbage collection completed');
      }
    } catch (error) {
      Logger.error(this.componentName, 'Forced GC failed', error);
    }
  }

  /**
   * 🔥 성능 상태 확인
   */
  public getPerformanceStatus(): {
    optimized: boolean;
    config: PerformanceConfig;
    platform: string;
    memoryUsage: NodeJS.MemoryUsage;
  } {
    return {
      optimized: this.isOptimized,
      config: this.performanceConfig,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
    };
  }

  /**
   * 🔥 정리
   */
  public cleanup(): void {
    this.isOptimized = false;
    Logger.info(this.componentName, '🧹 Performance optimizer cleaned up');
  }
}

// 🔥 단일 인스턴스 export
export const performanceOptimizer = new PerformanceOptimizer();
