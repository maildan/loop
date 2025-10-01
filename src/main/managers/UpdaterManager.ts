// 🔥 UpdaterManager - 자동 업데이트 관리 (Electron Updater 통합)

import { app, dialog, MessageBoxReturnValue } from 'electron';
import { autoUpdater } from 'electron-updater';
import { Logger } from '../../shared/logger';

/**
 * UpdaterManager
 * 
 * GitHub Releases를 통한 자동 업데이트 기능 제공.
 * - 앱 시작 시 업데이트 체크
 * - 백그라운드 다운로드
 * - 사용자에게 업데이트 알림
 * 
 * @see https://www.electron.build/auto-update
 */
export class UpdaterManager {
  private updateCheckInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 1000 * 60 * 60; // 1시간마다 체크

  public async initialize(): Promise<void> {
    if (!app.isPackaged) {
      Logger.info('UPDATER', '개발 환경에서는 auto-updater 비활성화');
      return;
    }

    Logger.info('UPDATER', '🔄 Auto-updater 초기화 시작');

    // 자동 다운로드 활성화 (백그라운드)
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    // 이벤트 리스너 등록
    this.setupEventListeners();

    // 앱 시작 후 10초 뒤 첫 업데이트 체크 (사용자 경험 고려)
    setTimeout(() => {
      this.checkForUpdates();
    }, 10000);

    // 주기적 업데이트 체크 (1시간마다)
    this.updateCheckInterval = setInterval(() => {
      this.checkForUpdates();
    }, this.CHECK_INTERVAL);

    Logger.info('UPDATER', '✅ Auto-updater 초기화 완료');
  }

  public async shutdown(): Promise<void> {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
    Logger.info('UPDATER', 'Auto-updater 종료됨');
  }

  /**
   * 수동으로 업데이트 체크 트리거 (메뉴나 IPC에서 호출 가능)
   */
  public async checkForUpdates(): Promise<void> {
    if (!app.isPackaged) {
      Logger.warn('UPDATER', '개발 환경에서는 업데이트 체크 불가');
      return;
    }

    try {
      Logger.info('UPDATER', '🔍 업데이트 확인 중...');
      await autoUpdater.checkForUpdates();
    } catch (error) {
      Logger.error('UPDATER', '업데이트 체크 실패', error);
    }
  }

  private setupEventListeners(): void {
    // 업데이트 확인 중
    autoUpdater.on('checking-for-update', () => {
      Logger.info('UPDATER', '업데이트 확인 중...');
    });

    // 업데이트 사용 가능
    autoUpdater.on('update-available', (info) => {
      Logger.info('UPDATER', '🎉 새 업데이트 발견!', {
        version: info.version,
        releaseDate: info.releaseDate,
      });
    });

    // 업데이트 없음
    autoUpdater.on('update-not-available', (info) => {
      Logger.info('UPDATER', '✅ 최신 버전 사용 중', { version: info.version });
    });

    // 다운로드 진행률
    autoUpdater.on('download-progress', (progressObj) => {
      const percent = progressObj.percent.toFixed(2);
      Logger.debug('UPDATER', `다운로드 진행: ${percent}%`, {
        transferred: progressObj.transferred,
        total: progressObj.total,
        bytesPerSecond: progressObj.bytesPerSecond,
      });
    });

    // 다운로드 완료
    autoUpdater.on('update-downloaded', (info) => {
      Logger.info('UPDATER', '✅ 업데이트 다운로드 완료', { version: info.version });

      // 사용자에게 알림 (restart 선택권 제공)
      dialog
        .showMessageBox({
          type: 'info',
          title: '업데이트 준비 완료',
          message: `Loop ${info.version} 업데이트가 준비되었습니다.`,
          detail: '지금 다시 시작하시겠습니까? (아니면 다음 실행 시 자동 적용)',
          buttons: ['지금 재시작', '나중에'],
          defaultId: 0,
          cancelId: 1,
        })
        .then((result: MessageBoxReturnValue) => {
          if (result.response === 0) {
            Logger.info('UPDATER', '사용자가 즉시 재시작 선택');
            autoUpdater.quitAndInstall();
          } else {
            Logger.info('UPDATER', '사용자가 나중에 재시작 선택 (앱 종료 시 자동 설치)');
          }
        });
    });

    // 에러 처리
    autoUpdater.on('error', (error) => {
      Logger.error('UPDATER', '업데이트 에러', error);
    });
  }
}

// 싱글톤 인스턴스 export
export const updaterManager = new UpdaterManager();
