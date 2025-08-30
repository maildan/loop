// 🔥 기가차드 통합 권한 관리자 - macOS 네이티브 권한 요청

import { Logger } from '../../shared/logger';
import { Platform } from './platform';
import { Result } from '../../shared/types';

// 🔥 node-mac-permissions 타입 정의 (정확한 API)
interface NodeMacPermissions {
  getAuthStatus(type: string): string;
  askForAccessibilityAccess(): void; // 🔥 동기 함수, void 반환 (다이얼로그만 표시)
  askForScreenCaptureAccess(): void; // 🔥 동기 함수, void 반환
}

// 🔥 안전한 동적 import 변수
let macPermissions: any = null;
let systemPreferences: any = null;

/**
 * 🔥 UnifiedPermissionManager - 모든 권한을 통합 관리
 * 
 * 특징:
 * - macOS: node-mac-permissions + Electron systemPreferences 사용
 * - 자동 권한 요청 다이얼로그 표시
 * - 권한 상태 실시간 모니터링
 * - 단일 진입점으로 모든 권한 관리
 */
export class UnifiedPermissionManager {
  private static instance: UnifiedPermissionManager;
  private readonly componentName = 'UNIFIED_PERMISSION';
  
  // 🔥 권한 상태 캐시
  private permissions = {
    accessibility: false,
    screenRecording: false,
    lastChecked: 0
  };
  
  private isRequestingPermissions = false;
  private readonly CACHE_DURATION = 5000; // 5초 캐시

  private constructor() {
    this.initializeNativeModules();
  }

  public static getInstance(): UnifiedPermissionManager {
    if (!UnifiedPermissionManager.instance) {
      UnifiedPermissionManager.instance = new UnifiedPermissionManager();
    }
    return UnifiedPermissionManager.instance;
  }

  /**
   * 🔥 네이티브 모듈 초기화
   */
  /**
   * 🔥 네이티브 모듈 초기화 (수정됨)
   */
  private async initializeNativeModules(): Promise<void> {
    try {
      if (Platform.isMacOS()) {
        // 🔥 node-mac-permissions 동적 import
        try {
          macPermissions = await import('node-mac-permissions');
          Logger.info(this.componentName, '✅ node-mac-permissions 로드됨');
        } catch (error) {
          Logger.warn(this.componentName, '⚠️ node-mac-permissions 로드 실패', error);
          Logger.info(this.componentName, '💡 설치 필요: pnpm add node-mac-permissions');
        }

        // 🔥 Electron systemPreferences 동적 import
        try {
          const electron = await import('electron');
          systemPreferences = electron.systemPreferences;
          Logger.info(this.componentName, '✅ Electron systemPreferences 로드됨');
        } catch (error) {
          Logger.warn(this.componentName, 'Electron systemPreferences 로드 실패', error);
        }
      }
    } catch (error) {
      Logger.error(this.componentName, '네이티브 모듈 초기화 실패', error);
    }
  }

  /**
   * 🔥 접근성 권한 체크 (캐시 포함)
   */
  public async checkAccessibilityPermission(): Promise<boolean> {
    const now = Date.now();
    
    // 캐시된 결과 사용 (5초 이내)
    if (now - this.permissions.lastChecked < this.CACHE_DURATION) {
      return this.permissions.accessibility;
    }

    try {
      if (!Platform.isMacOS()) {
        this.permissions.accessibility = true;
        this.permissions.lastChecked = now;
        return true;
      }

      let hasPermission = false;

      // 🔥 1순위: node-mac-permissions 사용 (정확한 API)
      if (macPermissions && typeof macPermissions.getAuthStatus === 'function') {
        const status = macPermissions.getAuthStatus('accessibility');
        hasPermission = status === 'authorized';
        Logger.debug(this.componentName, '✅ node-mac-permissions 권한 상태', { status, hasPermission });
      }
      
      // 🔥 2순위: Electron systemPreferences 사용 (보조 검증)
      if (!hasPermission && systemPreferences) {
        hasPermission = systemPreferences.isTrustedAccessibilityClient(false);
        Logger.debug(this.componentName, '🔧 Electron systemPreferences 권한 체크', { hasPermission });
      }

      this.permissions.accessibility = hasPermission;
      this.permissions.lastChecked = now;

      Logger.info(this.componentName, '접근성 권한 상태 확인', { hasPermission });
      return hasPermission;

    } catch (error) {
      Logger.error(this.componentName, '접근성 권한 체크 실패', error);
      return false;
    }
  }

  /**
   * 🔥 접근성 권한 요청 (macOS 시스템 다이얼로그 자동 표시)
   */
  public async requestAccessibilityPermission(): Promise<Result<boolean>> {
    try {
      // 중복 요청 방지
      if (this.isRequestingPermissions) {
        Logger.warn(this.componentName, '이미 권한 요청 중입니다');
        return { success: false, error: '이미 권한 요청 중입니다' };
      }

      this.isRequestingPermissions = true;
      Logger.info(this.componentName, '🔍 접근성 권한 요청 시작');

      // 현재 권한 상태 확인
      const currentPermission = await this.checkAccessibilityPermission();
      if (currentPermission) {
        Logger.info(this.componentName, '✅ 이미 접근성 권한이 있음');
        this.isRequestingPermissions = false;
        return { success: true, data: true };
      }

      if (!Platform.isMacOS()) {
        Logger.info(this.componentName, '✅ macOS가 아님 - 권한 자동 허용');
        this.isRequestingPermissions = false;
        return { success: true, data: true };
      }

      Logger.info(this.componentName, '❌ 접근성 권한이 없음 - 자동 요청 시작');

      let permissionGranted = false;

      // 🔥 Method 1: node-mac-permissions 사용 (올바른 동기 방식)
      if (macPermissions && typeof macPermissions.askForAccessibilityAccess === 'function') {
        try {
          Logger.info(this.componentName, '📱 node-mac-permissions로 권한 요청 시도');
          
          // 🔥 올바른 API 사용: 동기적으로 호출하고 시스템 다이얼로그를 띄움
          macPermissions.askForAccessibilityAccess();
          
          // 요청 후 잠시 대기하고 상태 재확인
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
          
          if (typeof macPermissions.getAuthStatus === 'function') {
            const status = macPermissions.getAuthStatus('accessibility');
            permissionGranted = status === 'authorized';
            Logger.info(this.componentName, `📱 node-mac-permissions 결과: ${status} (${permissionGranted})`);
          }
        } catch (error) {
          Logger.warn(this.componentName, '❌ node-mac-permissions 권한 요청 실패', error);
        }
      }

      // 🔥 Method 2: Electron systemPreferences 사용 (백업)
      if (!permissionGranted && systemPreferences) {
        try {
          Logger.info(this.componentName, '🔧 Electron systemPreferences로 권한 요청 시도');
          
          // prompt=true로 설정하면 시스템 다이얼로그 표시
          permissionGranted = systemPreferences.isTrustedAccessibilityClient(true);
          
          Logger.info(this.componentName, `Electron systemPreferences 결과: ${permissionGranted}`);
        } catch (error) {
          Logger.warn(this.componentName, 'Electron systemPreferences 권한 요청 실패', error);
        }
      }

      // 권한 캐시 업데이트
      this.permissions.accessibility = permissionGranted;
      this.permissions.lastChecked = Date.now();

      if (permissionGranted) {
        Logger.info(this.componentName, '🎉 접근성 권한 허용됨!');
      } else {
        Logger.warn(this.componentName, '⚠️ 접근성 권한 거부됨 또는 요청 실패');
        await this.showManualPermissionGuide();
      }

      this.isRequestingPermissions = false;
      return { success: true, data: permissionGranted };

    } catch (error) {
      Logger.error(this.componentName, '권한 요청 중 오류 발생', error);
      this.isRequestingPermissions = false;
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 화면 기록 권한 체크
   */
  public async checkScreenRecordingPermission(): Promise<boolean> {
    try {
      if (!Platform.isMacOS()) {
        return true;
      }

      if (systemPreferences) {
        const hasPermission = systemPreferences.getMediaAccessStatus('screen') === 'granted';
        this.permissions.screenRecording = hasPermission;
        return hasPermission;
      }

      return false;
    } catch (error) {
      Logger.error(this.componentName, '화면 기록 권한 체크 실패', error);
      return false;
    }
  }

  /**
   * 🔥 화면 기록 권한 요청
   */
  public async requestScreenRecordingPermission(): Promise<Result<boolean>> {
    try {
      if (!Platform.isMacOS()) {
        return { success: true, data: true };
      }

      if (systemPreferences) {
        const status = await systemPreferences.askForMediaAccess('screen');
        this.permissions.screenRecording = status;
        return { success: true, data: status };
      }

      return { success: false, error: 'systemPreferences not available' };
    } catch (error) {
      Logger.error(this.componentName, '화면 기록 권한 요청 실패', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * 🔥 모든 권한 체크
   */
  public async checkAllPermissions(): Promise<{
    accessibility: boolean;
    screenRecording: boolean;
  }> {
    const [accessibility, screenRecording] = await Promise.all([
      this.checkAccessibilityPermission(),
      this.checkScreenRecordingPermission()
    ]);

    return { accessibility, screenRecording };
  }

  /**
   * 🔥 수동 권한 설정 가이드 표시
   */
  private async showManualPermissionGuide(): Promise<void> {
    try {
      const { dialog } = await import('electron');
      
      const result = await dialog.showMessageBox({
        type: 'info',
        title: 'Loop - 접근성 권한 필요',
        message: '키보드 모니터링을 위해 접근성 권한이 필요합니다',
        detail: [
          '자동 권한 요청이 실패했습니다.',
          '',
          '수동으로 권한을 설정해주세요:',
          '1. 시스템 환경설정 > 보안 및 개인 정보 보호',
          '2. 개인 정보 보호 > 접근성',
          '3. Loop (또는 Electron) 체크박스 활성화',
          '',
          '설정 후 앱을 재시작해주세요.'
        ].join('\n'),
        buttons: ['🔧 시스템 환경설정 열기', '⏭️ 나중에'],
        defaultId: 0,
        cancelId: 1
      });

      if (result.response === 0) {
        // 시스템 환경설정 열기
        const { shell } = await import('electron');
        await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
      }
    } catch (error) {
      Logger.error(this.componentName, '수동 권한 가이드 표시 실패', error);
    }
  }

  /**
   * 🔥 권한 상태 가져오기
   */
  public getPermissionStatus(): {
    accessibility: boolean;
    screenRecording: boolean;
    lastChecked: number;
  } {
    return { ...this.permissions };
  }

  /**
   * 🔥 권한 캐시 강제 초기화
   */
  public clearCache(): void {
    this.permissions.lastChecked = 0;
    Logger.info(this.componentName, '권한 캐시 초기화됨');
  }
}

// 🔥 단일 인스턴스 export
export const unifiedPermissionManager = UnifiedPermissionManager.getInstance();
