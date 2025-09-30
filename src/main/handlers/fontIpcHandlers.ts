// 🔥 동적 폰트 IPC 핸들러 - public/fonts TTF 기반

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { fontService } from '../services/FontService';

// #DEBUG: Font IPC handlers entry point
Logger.debug('FONT_IPC', 'Dynamic font IPC handlers module loaded');

// 🔥 동적 폰트 IPC 핸들러 등록
export function setupFontIpcHandlers(): void {
    try {
        Logger.debug('FONT_IPC', 'Setting up dynamic font IPC handlers');

        // 🔥 폰트 서비스 초기화
        ipcMain.handle('font:initialize', async (event: IpcMainInvokeEvent) => {
            try {
                Logger.debug('FONT_IPC', 'Font service initialization requested');
                await fontService.initialize();
                return { success: true };
            } catch (error) {
                Logger.error('FONT_IPC', 'Font service initialization failed', error);
                return { success: false, error: String(error) };
            }
        });

        // 🔥 사용 가능한 폰트 목록 가져오기
        ipcMain.handle('font:get-available-fonts', async (event: IpcMainInvokeEvent) => {
            try {
                Logger.debug('FONT_IPC', 'Available fonts requested');
                await fontService.initialize();

                const fonts = fontService.getAvailableFonts();
                Logger.info('FONT_IPC', 'Available fonts retrieved', { count: fonts.length });
                return fonts;
            } catch (error) {
                Logger.error('FONT_IPC', 'Get available fonts failed', error);
                return [];
            }
        });

        // 🔥 @font-face CSS 생성
        ipcMain.handle('font:generate-css', async (event: IpcMainInvokeEvent) => {
            try {
                Logger.debug('FONT_IPC', 'Font CSS generation requested');
                await fontService.initialize();

                const css = fontService.generateFontFaceCSS();
                Logger.info('FONT_IPC', 'Font CSS generated', { cssLength: css.length });
                return css;
            } catch (error) {
                Logger.error('FONT_IPC', 'Font CSS generation failed', error);
                return '';
            }
        });

        // 🔥 특정 폰트 패밀리 정보 조회
        ipcMain.handle('font:get-font-family', async (event: IpcMainInvokeEvent, familyName: string) => {
            try {
                Logger.debug('FONT_IPC', 'Font family info requested', { familyName });
                await fontService.initialize();

                return fontService.getFontFamily(familyName);
            } catch (error) {
                Logger.error('FONT_IPC', 'Get font family failed', error);
                return null;
            }
        });

        // 🔥 폰트 서비스 리로드
        ipcMain.handle('font:reload', async (event: IpcMainInvokeEvent) => {
            try {
                Logger.debug('FONT_IPC', 'Font service reload requested');
                await fontService.reload();
                return { success: true };
            } catch (error) {
                Logger.error('FONT_IPC', 'Font service reload failed', error);
                return { success: false, error: String(error) };
            }
        });

        Logger.info('FONT_IPC', 'Dynamic font IPC handlers setup completed');
    } catch (error) {
        Logger.error('FONT_IPC', 'Font IPC handlers setup failed', error);
    }
}
