// 🔥 macOS 자동 권한 요청 시스템 (VS Code 스타일)

import { systemPreferences, dialog, shell, ipcMain } from 'electron';
import { Logger } from '../../shared/logger';

export class AutoPermissionManager {
  private static instance: AutoPermissionManager;
  private readonly componentName = 'AUTO_PERMISSION';

  static getInstance(): AutoPermissionManager {
    if (!AutoPermissionManager.instance) {
      AutoPermissionManager.instance = new AutoPermissionManager();
    }
    return AutoPermissionManager.instance;
  }

  /**
   * 🔥 VS Code 스타일 접근성 권한 자동 요청
   * - 현재 권한 확인
   * - 없으면 자동으로 시스템 다이얼로그 표시
   * - 사용자가 거부하면 수동 설정 안내
   */
  async requestAccessibilityPermission(): Promise<boolean> {
    try {
      Logger.info(this.componentName, '🔍 접근성 권한 요청 시작');

      // 1단계: 현재 권한 상태 확인 (다이얼로그 없이)
      const hasPermission = systemPreferences.isTrustedAccessibilityClient(false);
      
      if (hasPermission) {
        Logger.info(this.componentName, '✅ 이미 접근성 권한이 있음');
        return true;
      }

      Logger.info(this.componentName, '❌ 접근성 권한이 없음 - 자동 요청 시작');

      // 2단계: 자동 권한 요청 다이얼로그 표시
      // prompt=true로 설정하면 시스템이 자동으로 권한 요청 다이얼로그를 띄움
      const permissionGranted = systemPreferences.isTrustedAccessibilityClient(true);

      if (permissionGranted) {
        Logger.info(this.componentName, '🎉 접근성 권한 허용됨!');
        return true;
      }

      // 3단계: 자동 요청이 실패한 경우 수동 안내
      Logger.warn(this.componentName, '⚠️ 자동 권한 요청 실패 - 수동 설정 안내');
      await this.showManualPermissionDialog();
      
      return false;

    } catch (error) {
      Logger.error(this.componentName, '권한 요청 중 오류 발생', error);
      return false;
    }
  }

  /**
   * 🔥 화면 기록 권한 자동 요청
   */
  async requestScreenRecordingPermission(): Promise<boolean> {
    try {
      Logger.info(this.componentName, '🔍 화면 기록 권한 요청 시작');

      // 현재 상태 확인
      const currentStatus = systemPreferences.getMediaAccessStatus('screen');
      
      if (currentStatus === 'granted') {
        Logger.info(this.componentName, '✅ 이미 화면 기록 권한이 있음');
        return true;
      }

      if (currentStatus === 'denied') {
        Logger.warn(this.componentName, '❌ 화면 기록 권한이 거부됨 - 수동 설정 필요');
        await this.showScreenRecordingDialog();
        return false;
      }

      // 권한 요청은 시스템 설정에서만 가능 (screen은 askForMediaAccess에서 지원되지 않음)
      // await systemPreferences.askForMediaAccess('screen');
      
      // 권한 요청 후 상태 재확인
      const newStatus = systemPreferences.getMediaAccessStatus('screen');
      const success = newStatus === 'granted';

      if (success) {
        Logger.info(this.componentName, '🎉 화면 기록 권한 허용됨!');
      } else {
        Logger.warn(this.componentName, '❌ 화면 기록 권한 거부됨');
      }

      return success;

    } catch (error) {
      Logger.error(this.componentName, '화면 기록 권한 요청 중 오류', error);
      return false;
    }
  }

  /**
   * 🔥 수동 접근성 권한 설정 안내 다이얼로그
   */
  private async showManualPermissionDialog(): Promise<void> {
    const result = await dialog.showMessageBox({
      type: 'info',
      title: 'Loop - 접근성 권한 필요',
      message: 'Loop의 키보드 모니터링을 위해 접근성 권한이 필요합니다.',
      detail: `다음 단계를 따라 권한을 허용해주세요:

1. "시스템 환경설정 열기"를 클릭
2. 보안 및 개인 정보 보호 → 개인 정보 보호 → 접근성
3. 잠금 아이콘을 클릭하여 변경 허용
4. Loop (또는 Electron) 항목을 체크
5. Loop를 재시작

권한 설정 후 앱이 자동으로 감지하여 기능이 활성화됩니다.`,
      buttons: ['시스템 환경설정 열기', '나중에 설정'],
      defaultId: 0,
      cancelId: 1
    });

    if (result.response === 0) {
      // 시스템 환경설정의 접근성 페이지로 바로 이동
      await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility');
    }
  }

  /**
   * 🔥 화면 기록 권한 설정 안내
   */
  private async showScreenRecordingDialog(): Promise<void> {
    const result = await dialog.showMessageBox({
      type: 'info',
      title: 'Loop - 화면 기록 권한 필요',
      message: 'Loop의 윈도우 트래킹을 위해 화면 기록 권한이 필요합니다.',
      detail: `다음 단계를 따라 권한을 허용해주세요:

1. "시스템 환경설정 열기"를 클릭
2. 보안 및 개인 정보 보호 → 개인 정보 보호 → 화면 기록
3. 잠금 아이콘을 클릭하여 변경 허용
4. Loop (또는 Electron) 항목을 체크
5. Loop를 재시작`,
      buttons: ['시스템 환경설정 열기', '건너뛰기'],
      defaultId: 0,
      cancelId: 1
    });

    if (result.response === 0) {
      await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
    }
  }

  /**
   * 🔥 앱 시작 시 권한 체크 및 자동 요청
   */
  async checkAndRequestOnStartup(): Promise<boolean> {
    Logger.info(this.componentName, '🚀 앱 시작 시 권한 체크');

    // macOS가 아니면 권한 체크 불필요
    if (process.platform !== 'darwin') {
      Logger.info(this.componentName, '✅ macOS가 아님 - 권한 체크 건너뜀');
      return true;
    }

    const accessibility = systemPreferences.isTrustedAccessibilityClient(false);
    
    if (accessibility) {
      Logger.info(this.componentName, '✅ 모든 권한이 이미 허용됨');
      return true;
    }

    // 첫 실행 또는 권한이 없는 경우 사용자에게 안내
    const result = await dialog.showMessageBox({
      type: 'question',
      title: 'Loop - 권한 설정',
      message: 'Loop를 사용하기 위해 시스템 권한이 필요합니다.',
      detail: '키보드 모니터링과 윈도우 트래킹을 위해 접근성 권한이 필요합니다.\n\n지금 설정하시겠습니까?',
      buttons: ['지금 설정', '나중에'],
      defaultId: 0,
      cancelId: 1
    });

    if (result.response === 0) {
      return await this.requestAccessibilityPermission();
    }

    return false;
  }
}

// 🔥 사용 예시 - IPC 핸들러에서 호출
export async function setupPermissionHandlers() {
  const permissionManager = AutoPermissionManager.getInstance();

  // IPC: 권한 요청
  ipcMain.handle('permissions:request-all', async () => {
    try {
      const accessibility = await permissionManager.requestAccessibilityPermission();
      const screenRecording = await permissionManager.requestScreenRecordingPermission();
      
      return { 
        success: true, 
        data: { accessibility, screenRecording, allGranted: accessibility && screenRecording } 
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // IPC: 접근성 권한만 요청
  ipcMain.handle('permissions:request-accessibility', async () => {
    try {
      const accessibility = await permissionManager.requestAccessibilityPermission();
      return { success: true, data: accessibility };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // IPC: 화면 기록 권한만 요청
  ipcMain.handle('permissions:request-screen-recording', async () => {
    try {
      const screenRecording = await permissionManager.requestScreenRecordingPermission();
      return { success: true, data: screenRecording };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  // IPC: 권한 상태 확인
  ipcMain.handle('permissions:check-status', async () => {
    try {
      if (process.platform !== 'darwin') {
        return { success: true, data: { accessibility: true, screenRecording: true } };
      }

      const accessibility = systemPreferences.isTrustedAccessibilityClient(false);
      const screenRecording = systemPreferences.getMediaAccessStatus('screen') === 'granted';

      return { 
        success: true, 
        data: { accessibility, screenRecording } 
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });
}

// 🔥 키보드 서비스 시작 전 권한 체크
export async function ensurePermissionsForKeyboard(): Promise<boolean> {
  const permissionManager = AutoPermissionManager.getInstance();
  
  // 접근성 권한만 확인 (키보드 모니터링용)
  return await permissionManager.requestAccessibilityPermission();
}
