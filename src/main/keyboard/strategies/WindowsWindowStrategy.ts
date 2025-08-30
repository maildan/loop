// 🔥 기가차드 Windows 윈도우 감지 전략 - 개선된 PowerShell 방식

import { BaseWindowDetectionStrategy } from './WindowDetectionStrategy';
import { WindowInfo, Result, AppCategory } from '../../../shared/types';
import { Logger } from '../../../shared/logger';
import { Platform } from '../../utils/platform';
import { 
  getAppCategory, 
  APP_CATEGORIES, 
  APP_CATEGORY_MAPPING,
  getCategoryStats,
  getAppsByCategory 
} from '../appCategories';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 간소화된 Windows API 타입
interface User32API {
  GetForegroundWindow?: () => number;
  GetWindowTextW?: (hwnd: number, lpString: Buffer, nMaxCount: number) => number;
  GetWindowThreadProcessId?: (hwnd: number, lpdwProcessId: Buffer) => number;
  IsWindow?: (hwnd: number) => boolean;
  EnumWindows?: (lpEnumFunc: Function, lParam: number) => boolean;
}

/**
 * 🔥 Windows 윈도우 감지 전략
 * PowerShell과 ffi-napi를 활용한 안정적인 윈도우 감지
 */
export class WindowsWindowStrategy extends BaseWindowDetectionStrategy {
  public readonly strategyName = 'WindowsWindowStrategy';
  public readonly supportedPlatforms: NodeJS.Platform[] = ['win32'];
  
  private user32: User32API | null = null;
  private ffi: { Library: (lib: string, defs: Record<string, unknown>) => unknown } | null = null;

  constructor() {
    super('WINDOWS_WINDOW_STRATEGY');
  }

  /**
   * 🔥 전략 초기화 - Windows 플랫폼 체크
   */
  async initialize(): Promise<Result<boolean>> {
    try {
      if (!Platform.isWindows()) {
        return { success: false, error: 'Windows platform required' };
      }

      // ffi-napi 동적 로드 시도
      try {
        this.ffi = require('ffi-napi');
        
        // user32.dll 함수들 로드 (null 가드 및 명시 캐스팅)
        if (this.ffi) {
          const lib = this.ffi.Library('user32', {
            'GetForegroundWindow': ['pointer', []],
            'GetWindowTextW': ['int', ['pointer', 'pointer', 'int']],
            'GetWindowThreadProcessId': ['int', ['pointer', 'pointer']],
            'IsWindow': ['bool', ['pointer']],
            'EnumWindows': ['bool', ['pointer', 'int']],
          }) as unknown;
          this.user32 = lib as User32API;
        }

        Logger.info(this.componentName, '✅ ffi-napi 로드 성공');
      } catch (error) {
        Logger.warn(this.componentName, 'ffi-napi 사용 불가, PowerShell 방식 사용', error);
        this.user32 = null;
        this.ffi = null;
      }

      this.isInitialized = true;
      Logger.info(this.componentName, '✅ Windows 전략 초기화 완료');
      return { success: true, data: true };

    } catch (error) {
      Logger.error(this.componentName, '❌ 초기화 실패', error);
      return { success: false, error: `Initialization failed: ${error}` };
    }
  }

  /**
   * 🔥 현재 활성 윈도우 가져오기
   */
  async getCurrentActiveWindow(): Promise<Result<WindowInfo>> {
    const initCheck = this.ensureInitialized();
    if (!initCheck.success) {
      return { success: false, error: initCheck.error } as Result<WindowInfo>;
    }

    try {
      if (this.user32 && this.ffi) {
        // ffi-napi 방식
        return await this.getActiveWindowViaFFI();
      } else {
        // PowerShell 방식 (fallback)
        return await this.getActiveWindowViaPowerShell();
      }
    } catch (error) {
      return this.handleError(error, 'Get current active window');
    }
  }

  /**
   * 🔥 모든 열린 윈도우 가져오기
   */
  async getAllOpenWindows(): Promise<Result<WindowInfo[]>> {
    const initCheck = this.ensureInitialized();
    if (!initCheck.success) {
      return { success: false, error: initCheck.error } as Result<WindowInfo[]>;
    }

    try {
      if (this.user32 && this.ffi) {
        // ffi-napi 방식
        return await this.getAllWindowsViaFFI();
      } else {
        // PowerShell 방식 (fallback)
        return await this.getAllWindowsViaPowerShell();
      }
    } catch (error) {
      return this.handleError(error, 'Get all open windows');
    }
  }

  /**
   * 🔥 ffi-napi를 통한 활성 윈도우 가져오기
   */
  private async getActiveWindowViaFFI(): Promise<Result<WindowInfo>> {
    if (!this.user32 || !this.ffi) {
      return { success: false, error: 'FFI not available' };
    }

    try {
      // 포그라운드 윈도우 핸들 가져오기
      const hwnd = this.user32.GetForegroundWindow?.();
      if (!hwnd || !this.user32.IsWindow?.(hwnd)) {
        return { success: false, error: 'No active window found' };
      }

      // 윈도우 정보 수집
      const windowInfo = await this.getWindowInfoByHandle(hwnd);
      if (!windowInfo.success) {
        return { success: false, error: windowInfo.error || 'Failed to get window info' };
      }

      // 🔥 IME 상태로 윈도우 정보 향상
      const enhancedWindowInfo = await this.enhanceWindowInfoWithIME(windowInfo.data!);

      // 검증 후 완전한 WindowInfo 반환
      const validationResult = this.validateWindowInfo(enhancedWindowInfo);
      if (!validationResult.success) {
        return { success: false, error: validationResult.error || 'Validation failed' };
      }

      return { success: true, data: validationResult.data! };

    } catch (error) {
      return this.handleError(error, 'FFI get active window');
    }
  }

  /**
   * 🔥 윈도우 핸들로부터 정보 수집
   */
  private async getWindowInfoByHandle(hwnd: number): Promise<Result<Partial<WindowInfo>>> {
    if (!this.user32 || !this.ffi) {
      return { success: false, error: 'FFI not available' };
    }

    try {
      // 윈도우 제목 가져오기 (안전한 호출)
      let title = 'Unknown';
      try {
        const titleBuffer = Buffer.alloc(512); // 256자 UTF-16
        const titleLength = this.user32.GetWindowTextW?.(hwnd, titleBuffer, 256);
        if (titleLength && titleLength > 0) {
          title = titleBuffer.toString('utf16le', 0, titleLength * 2).replace(/\0/g, '');
        }
      } catch (titleError) {
        Logger.warn(this.componentName, 'Failed to get window title', titleError);
      }

      // 프로세스 ID 가져오기 (안전한 호출)
      let processId = 0;
      try {
        const pidBuffer = Buffer.alloc(4);
        this.user32.GetWindowThreadProcessId?.(hwnd, pidBuffer);
        processId = pidBuffer.readUInt32LE(0);
      } catch (pidError) {
        Logger.warn(this.componentName, 'Failed to get process ID', pidError);
      }

      // 프로세스 이름 가져오기 (PowerShell 사용)
      const processName = await this.getProcessNameById(processId);

      const windowInfo: Partial<WindowInfo> = {
        id: hwnd,
        title: title || 'Unknown',
        owner: {
          name: processName || 'Unknown',
          processId,
          path: undefined, // TODO: 프로세스 경로 가져오기
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 }, // TODO: 실제 윈도우 크기 가져오기
        memoryUsage: 0, // TODO: 메모리 사용량 가져오기
        
        // 🔥 Loop 전용 필드들 추가
        loopTimestamp: Date.now(),
        loopAppCategory: getAppCategory(processName || 'Unknown'),
        loopSessionId: `${processName}-${Date.now()}`,
        loopLanguageDetected: 'unknown', // IME 감지로 업데이트 예정
        loopIMEState: 'unknown',
        loopPlatformInfo: {
          platform: 'win32' as NodeJS.Platform,
          version: process.platform === 'win32' ? require('os').release() : 'unknown',
          architecture: process.arch
        },
        loopPermissions: {
          accessibility: true, // Windows는 특별한 권한 불필요
          screenRecording: true,
          inputMonitoring: true
        },
        loopSessionMetadata: {
          startTime: Date.now(),
          totalKeystrokes: 0,
          activeTime: 0,
          idleTime: 0
        }
      };

      return { success: true, data: windowInfo };

    } catch (error) {
      return this.handleError(error, 'Get window info by handle');
    }
  }

  /**
   * 🔥 PowerShell을 통한 활성 윈도우 가져오기 (fallback)
   */
  private async getActiveWindowViaPowerShell(): Promise<Result<WindowInfo>> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      // PowerShell 명령어 타임아웃 설정 (3초)
      const execOptions = {
        timeout: 3000,
        maxBuffer: 1024 * 1024 // 1MB
      };

      // 🔥 향상된 PowerShell 스크립트 - 마커 기반 견고한 출력
      const script = `
        # 에러 출력 설정 (에러 안전성 향상)
        $ErrorActionPreference = "SilentlyContinue"
        
        # 명시적 출력 마커 (이 부분이 중요!)
        Write-Output "LOOP_JSON_START"
        
        try {
            # .NET API 정의 - try 안으로 이동하여 실패해도 마커가 출력되도록
            Add-Type @"
            using System;
            using System.Runtime.InteropServices;
            using System.Text;
            public class APIFuncs {
              [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
              public static extern int GetWindowText(IntPtr hwnd, StringBuilder lpString, int cch);
              [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Auto)]
              public static extern IntPtr GetForegroundWindow();
              [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Auto)]
              public static extern Int32 GetWindowThreadProcessId(IntPtr hWnd, out Int32 lpdwProcessId);
              [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Auto)]
              public static extern Int32 GetWindowTextLength(IntPtr hWnd);
            }
"@
            
            # 현재 활성 창 핸들 가져오기
            $w = [APIFuncs]::GetForegroundWindow()
            
            # 창 텍스트 길이 가져오기
            $len = [APIFuncs]::GetWindowTextLength($w)
            $sb = New-Object text.stringbuilder -ArgumentList ($len + 1)
            $rtnlen = [APIFuncs]::GetWindowText($w,$sb,$sb.Capacity)
            
            # PID 가져오기 및 예외처리
            $pid = 0
            [APIFuncs]::GetWindowThreadProcessId($w, [ref]$pid)
            
            # 프로세스 정보 가져오기
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            $processName = if ($process) { $process.ProcessName } else { "Unknown" }
            
            # 결과 생성 (모든 필드에 기본값 보장)
            $result = @{
              id = if ([int]$w -gt 0) { [int]$w } else { 0 }
              title = if ($sb.ToString()) { $sb.ToString() } else { "Empty Title" }
              processId = if ($pid -gt 0) { $pid } else { 0 }
              processName = if ($processName) { $processName } else { "Unknown" }
            }
            
            # 결과 JSON 출력
            $result | ConvertTo-Json
        }
        catch {
            # 오류 발생 시 기본 JSON 반환 - 오류 정보 포함
            @{
              id = 0
              title = "PowerShell Error: $($_.Exception.Message)" 
              processId = 0
              processName = "Error"
              errorCode = if ($_.Exception.HResult) { $_.Exception.HResult } else { -1 }
            } | ConvertTo-Json
        }
        
        # 항상 종료 마커 출력 - try/catch와 무관하게 실행
        Write-Output "LOOP_JSON_END"
      `;

      const { stdout } = await execAsync(
        `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "${script.replace(/"/g, '\\"')}"`,
        execOptions
      );
      
      // 🔥 JSON 파싱 오류 처리 강화
      let result;
      try {
        // LOOP_JSON_START와 LOOP_JSON_END 사이의 내용만 추출
        const jsonMatch = stdout.match(/LOOP_JSON_START\s*([\s\S]*?)\s*LOOP_JSON_END/);
        let jsonStr = jsonMatch ? jsonMatch[1].trim() : stdout.trim();
        
        // 디버깅을 위한 로깅
        Logger.debug(this.componentName, '👉 PowerShell 출력 변환 전', { 
          rawOutput: stdout,
          extractedJson: jsonStr,
          hasMarkers: !!jsonMatch
        });
        
        // 빈 출력 검사 및 기본값 제공
        if (!jsonStr || jsonStr.length === 0) {
          throw new Error('빈 PowerShell 출력');
        }
        
        result = JSON.parse(jsonStr);
      } catch (jsonError) {
        Logger.error(this.componentName, '❌ PowerShell JSON 파싱 실패', { 
          stdout, 
          error: jsonError,
          errorType: jsonError instanceof Error ? jsonError.name : 'Unknown'
        });
        // 기본값 제공 - 오류 안전성 향상
        result = {
          id: 0,
          title: '⚠️ Window Detection Error',
          processId: 0,
          processName: 'PowerShell Error'
        };
        
        // 오류 발생 시 재시도 계획 로그
        Logger.info(this.componentName, '⚠️ PowerShell 감지 실패, 다음 주기에 재시도');
      }

      const windowInfo: Partial<WindowInfo> = {
        id: result.id || 0,
        title: result.title || 'Unknown',
        owner: {
          name: result.processName || 'Unknown',
          processId: result.processId || 0,
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: 0,
        
        // 🔥 Loop 전용 필드들 추가 (PowerShell 방식)
        loopTimestamp: Date.now(),
        loopAppCategory: getAppCategory(result.processName || 'Unknown'),
        loopSessionId: `${result.processName}-${Date.now()}`,
        loopLanguageDetected: 'unknown',
        loopIMEState: 'unknown',
        loopPlatformInfo: {
          platform: 'win32' as NodeJS.Platform,
          version: require('os').release(),
          architecture: process.arch
        },
        loopPermissions: {
          accessibility: true,
          screenRecording: true,
          inputMonitoring: true
        },
        loopSessionMetadata: {
          startTime: Date.now(),
          totalKeystrokes: 0,
          activeTime: 0,
          idleTime: 0
        }
      };

      // 🔥 IME 상태로 윈도우 정보 향상
      const enhancedWindowInfo = await this.enhanceWindowInfoWithIME(windowInfo);

      return this.validateWindowInfo(enhancedWindowInfo);

    } catch (error) {
      return this.handleError(error, 'PowerShell get active window');
    }
  }

  /**
   * 🔥 프로세스 ID로 프로세스 이름 가져오기
   */
  private async getProcessNameById(processId: number): Promise<string> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      const { stdout } = await execAsync(`powershell -Command "Get-Process -Id ${processId} | Select-Object -ExpandProperty ProcessName"`);
      return stdout.trim() || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * 🔥 ffi-napi를 통한 모든 윈도우 가져오기
   */
  private async getAllWindowsViaFFI(): Promise<Result<WindowInfo[]>> {
    // TODO: EnumWindows API 사용하여 모든 윈도우 수집
    return { success: false, error: 'Not implemented yet' };
  }

  /**
   * 🔥 PowerShell을 통한 모든 윈도우 가져오기
   */
  private async getAllWindowsViaPowerShell(): Promise<Result<WindowInfo[]>> {
    // TODO: PowerShell을 사용하여 모든 윈도우 수집
    return { success: false, error: 'Not implemented yet' };
  }

  /**
   * 🔥 윈도우 변경 감지 지원 여부
   */
  supportsWindowChangeDetection(): boolean {
    return false; // Windows API는 폴링 방식 사용
  }

  /**
   * 🔥 권한 확인
   */
  async checkPermissions(): Promise<Result<boolean>> {
    // Windows에서는 특별한 권한이 필요하지 않음
    return { success: true, data: true };
  }

  /**
   * 🔥 리소스 정리
   */
  async cleanup(): Promise<void> {
    this.user32 = null;
    this.ffi = null;
    this.isInitialized = false;
    Logger.info(this.componentName, 'Windows strategy cleaned up');
  }

  /**
   * 🔥 윈도우 정보에 IME 상태 추가
   */
  private async enhanceWindowInfoWithIME(windowInfo: Partial<WindowInfo>): Promise<Partial<WindowInfo>> {
    try {
      // Windows에서만 동적으로 언어 감지기 로드
      let imeState: 'enabled' | 'disabled' | 'unknown' = 'unknown';
      let languageDetected = 'unknown';
      
      if (Platform.isWindows()) {
        try {
          // 동적 import로 Windows 전용 모듈 로드
          const { windowsLanguageDetector } = await import('../detectors/windows/WindowsLanguageDetector');
          
          if (windowsLanguageDetector) {
            const detectedIME = await windowsLanguageDetector.detectIMEState();
            const hangulMode = await windowsLanguageDetector.detectHangulInputMode();
            
            imeState = detectedIME.isIMEActive ? 'enabled' : 'disabled';
            languageDetected = hangulMode.isHangulMode ? 'hangul' : 'english';
          } else {
            Logger.warn(this.componentName, 'Windows 언어 감지기가 null임');
          }
        } catch (dynamicImportError) {
          Logger.warn(this.componentName, 'Windows 언어 감지기 동적 로드 실패', dynamicImportError);
        }
      }
      
      const baseMetadata = {
        startTime: Date.now(),
        totalKeystrokes: 0,
        activeTime: 0,
        idleTime: 0,
        ...windowInfo.loopSessionMetadata
      };
      
      return {
        ...windowInfo,
        loopLanguageDetected: languageDetected,
        loopIMEState: imeState,
        loopSessionMetadata: baseMetadata
      };
    } catch (error) {
      Logger.warn(this.componentName, 'IME 상태 감지 실패', error);
      return windowInfo;
    }
  }
}
