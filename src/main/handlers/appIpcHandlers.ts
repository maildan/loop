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

        // 🔥 Updater: 재시작 및 업데이트 설치 (모든 플랫폼 지원)
        ipcMain.handle('updater:restart-and-install', async () => {
            try {
                const platform = process.platform;
                Logger.info('UPDATER_IPC', '🔄 업데이트 재시작 요청', { platform });

                // 🔥 Method 1: electron-updater의 quitAndInstall (권장)
                try {
                    Logger.debug('UPDATER_IPC', '📡 Method 1: autoUpdater.quitAndInstall() 시도');
                    autoUpdater.quitAndInstall(false, true); // (isSilent, isForceRunAfter)
                    Logger.info('UPDATER_IPC', '✅ quitAndInstall 완료');
                    return {
                        success: true,
                        data: true,
                        timestamp: new Date(),
                    };
                } catch (quitError) {
                    Logger.warn('UPDATER_IPC', '⚠️ quitAndInstall 실패, fallback 시도', quitError);
                }

                // 🔥 Method 2: app.relaunch() + app.exit() (fallback for all platforms)
                try {
                    Logger.debug('UPDATER_IPC', '📡 Method 2: app.relaunch() + app.exit() 시도');
                    app.relaunch();
                    app.exit(0);
                    Logger.info('UPDATER_IPC', '✅ app.relaunch() 완료');
                    return {
                        success: true,
                        data: true,
                        timestamp: new Date(),
                    };
                } catch (relaunhError) {
                    Logger.warn('UPDATER_IPC', '⚠️ app.relaunch() 실패, final fallback 시도', relaunhError);
                }

                // 🔥 Method 3: 직접 프로세스 종료 (최후의 수단)
                Logger.debug('UPDATER_IPC', '📡 Method 3: process.exit(0) 시도');
                process.exit(0);
                
            } catch (error) {
                Logger.error('UPDATER_IPC', '❌ 모든 재시작 방법 실패', { error: error instanceof Error ? error.message : String(error), platform: process.platform });
                return {
                    success: false,
                    data: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date(),
                };
            }
        });

        // 🔥 Updater: quitAndInstall 직접 호출 (추가 옵션)
        ipcMain.handle('updater:quit-and-install', async () => {
            try {
                Logger.info('UPDATER_IPC', '🔄 quitAndInstall 직접 호출');
                autoUpdater.quitAndInstall(false, true);
                return {
                    success: true,
                    data: true,
                    timestamp: new Date(),
                };
            } catch (error) {
                Logger.error('UPDATER_IPC', '❌ quitAndInstall 실패', error);
                return {
                    success: false,
                    data: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date(),
                };
            }
        });

        // 🔥 App: 재시작 (일반 앱 재시작)
        ipcMain.handle('app:restart', async () => {
            try {
                Logger.info('APP_IPC', '🔄 앱 재시작 요청', { platform: process.platform });
                app.relaunch();
                app.exit(0);
                return {
                    success: true,
                    data: true,
                    timestamp: new Date(),
                };
            } catch (error) {
                Logger.error('APP_IPC', '❌ 앱 재시작 실패', error);
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