// 🔥 UpdaterManager - 자동 업데이트 관리 (Electron Updater 통합)

import { app, dialog, MessageBoxReturnValue } from 'electron';
import { autoUpdater } from 'electron-updater';
import { Logger } from '../../shared/logger';
import { windowManager } from '../core/window';

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
   * ManagerCoordinator 호환성을 위한 stop 메서드
   */
  public async stop(): Promise<void> {
    await this.shutdown();
  }

  /**
   * ManagerCoordinator 호환성을 위한 cleanup 메서드
   */
  public async cleanup(): Promise<void> {
    // UpdaterManager는 특별한 cleanup이 필요 없음
    Logger.debug('UPDATER', 'UpdaterManager cleanup 완료');
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

      // Main window에 알림 전송 (향후 UI 활용 가능)
      const mainWindow = windowManager.getWindow('main');
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('updater:available', {
          version: info.version,
          releaseDate: info.releaseDate,
        });
      }
    });

    // 업데이트 없음
    autoUpdater.on('update-not-available', (info) => {
      Logger.info('UPDATER', '✅ 최신 버전 사용 중', { version: info.version });
    });

    // 다운로드 진행률
    autoUpdater.on('download-progress', (progressObj) => {
      const percent = progressObj.percent.toFixed(1);
      const mbTransferred = (progressObj.transferred / 1024 / 1024).toFixed(2);
      const mbTotal = (progressObj.total / 1024 / 1024).toFixed(2);
      const speedMBps = (progressObj.bytesPerSecond / 1024 / 1024).toFixed(2);

      Logger.info(
        'UPDATER',
        `⬇️  다운로드: ${percent}% | ${mbTransferred}/${mbTotal} MB | ${speedMBps} MB/s`
      );

      // 🔥 Taskbar/Dock에 진행률 표시 (0.0 ~ 1.0)
      const mainWindow = windowManager.getWindow('main');
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setProgressBar(progressObj.percent / 100);

        // 🔥 Renderer로 진행률 전송 (UI 업데이트용)
        mainWindow.webContents.send('updater:download-progress', {
          percent: progressObj.percent,
          transferred: progressObj.transferred,
          total: progressObj.total,
          bytesPerSecond: progressObj.bytesPerSecond,
        });
      }
    });

    // 다운로드 완료
    autoUpdater.on('update-downloaded', (info) => {
      Logger.info('UPDATER', '✅ 업데이트 다운로드 완료', { version: info.version });

      // 🔥 진행률 표시 초기화 (완료)
      const mainWindow = windowManager.getWindow('main');
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setProgressBar(-1); // -1 = 진행률 제거

        // 🔥 Renderer로 다운로드 완료 알림 (UpdateNotification.tsx에서 처리)
        mainWindow.webContents.send('updater:downloaded', {
          version: info.version,
          releaseDate: info.releaseDate,
        });
      }

      // 🔥 Native dialog 제거: Renderer UI (UpdateNotification.tsx)에서 처리
      // autoInstallOnAppQuit=true이므로 앱 종료 시 자동 설치됨
      Logger.info('UPDATER', 'UpdateNotification UI에서 재시작 버튼 표시 대기 중...');
    });

    // 에러 처리
    autoUpdater.on('error', (error) => {
      Logger.error('UPDATER', '업데이트 에러', error);
    });
  }
}

// 싱글톤 인스턴스 export
export const updaterManager = new UpdaterManager();
