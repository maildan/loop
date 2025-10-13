// 🔥 App IPC 핸들러 - 기본적인 앱 정보 제공

import { ipcMain, app } from 'electron';
import { autoUpdater } from 'electron-updater';
import { Logger } from '../../shared/logger';

// 🔥 App IPC 핸들러 설정
export function setupAppIpcHandlers(): boolean {
    try {
        // 🔥 유저 데이터 경로 가져오기
        ipcMain.handle('app:get-user-data-path', async () => {
            try {
                const userDataPath = app.getPath('userData');
                Logger.info('APP_IPC', '유저 데이터 경로 조회', { userDataPath });
                return userDataPath;
            } catch (error) {
                Logger.error('APP_IPC', '유저 데이터 경로 조회 실패', error);
                throw error;
            }
        });

        // 🔥 앱 버전 가져오기
        ipcMain.handle('app:get-version', async () => {
            try {
                const version = app.getVersion();
                Logger.info('APP_IPC', '앱 버전 조회', { version });
                return version;
            } catch (error) {
                Logger.error('APP_IPC', '앱 버전 조회 실패', error);
                throw error;
            }
        });

        // 🔥 앱 이름 가져오기
        ipcMain.handle('app:get-name', async () => {
            try {
                const name = app.getName();
                Logger.info('APP_IPC', '앱 이름 조회', { name });
                return name;
            } catch (error) {
                Logger.error('APP_IPC', '앱 이름 조회 실패', error);
                throw error;
            }
        });

        // 🔥 Updater: 수동 업데이트 체크
        ipcMain.handle('updater:check-for-updates', async () => {
            try {
                if (!app.isPackaged) {
                    Logger.warn('UPDATER_IPC', '개발 환경에서는 업데이트 체크 불가');
                    return {
                        success: false,
                        data: false,
                        error: 'Development mode',
                        timestamp: new Date(),
                    };
                }

                Logger.info('UPDATER_IPC', '수동 업데이트 체크 요청');
                await autoUpdater.checkForUpdates();
                return {
                    success: true,
                    data: true,
                    timestamp: new Date(),
                };
            } catch (error) {
                Logger.error('UPDATER_IPC', '업데이트 체크 실패', error);
                return {
                    success: false,
                    data: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date(),
                };
            }
        });

        // 🔥 Updater: 재시작 및 업데이트 설치
        ipcMain.handle('updater:restart-and-install', async () => {
            try {
                Logger.info('UPDATER_IPC', '사용자가 재시작 및 설치 요청');
                autoUpdater.quitAndInstall(false, true); // (isSilent, isForceRunAfter)
                return {
                    success: true,
                    data: true,
                    timestamp: new Date(),
                };
            } catch (error) {
                Logger.error('UPDATER_IPC', '재시작 실패', error);
                return {
                    success: false,
                    data: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date(),
                };
            }
        });

        Logger.info('APP_IPC', 'App IPC 핸들러 설정 완료');
        return true;
    } catch (error) {
        Logger.error('APP_IPC', 'App IPC 핸들러 설정 실패', error);
        return false;
    }
}