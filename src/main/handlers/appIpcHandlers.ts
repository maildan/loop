// 🔥 App IPC 핸들러 - 기본적인 앱 정보 제공

import { ipcMain, app } from 'electron';
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

        Logger.info('APP_IPC', 'App IPC 핸들러 설정 완료');
        return true;
    } catch (error) {
        Logger.error('APP_IPC', 'App IPC 핸들러 설정 실패', error);
        return false;
    }
}