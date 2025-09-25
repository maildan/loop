// 🔥 동적 폰트 IPC 핸들러 - FontService API에 맞게 수정

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { FontService } from '../services/FontService';

// #DEBUG: Font IPC handlers entry point
Logger.debug('FONT_IPC', 'Dynamic font IPC handlers module loaded');

// 🔥 동적 폰트 IPC 핸들러 등록
export function setupFontIpcHandlers(): void {
    try {
        Logger.debug('FONT_IPC', 'Setting up dynamic font IPC handlers');

        // 🔥 폰트 서비스 상태 확인
        ipcMain.handle(
            'font:initialize',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'Font service status requested');
                    const fontService = FontService.getInstance();
                    const status = fontService.getServiceStatus();
                    Logger.info('FONT_IPC', 'Font service status', status);
                    return { success: true, status };
                } catch (error) {
                    Logger.error('FONT_IPC', 'Font service status check failed', error);
                    return { success: false, error: String(error) };
                }
            }
        );

        // 🔥 사용 가능한 폰트 목록 가져오기
        ipcMain.handle(
            'font:get-available-fonts',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'Available fonts requested');
                    const fontService = FontService.getInstance();
                    const fonts = await fontService.getAvailableFonts();
                    Logger.info('FONT_IPC', 'Available fonts retrieved', { count: fonts.length });
                    
                    // UI에서 사용할 수 있는 형태로 변환
                    const formattedFonts = fonts.map(font => ({
                        value: font.name,
                        category: font.category || 'default',
                        isLocal: true,
                        size: font.size
                    }));
                    
                    return formattedFonts;
                } catch (error) {
                    Logger.error('FONT_IPC', 'Get available fonts failed', error);
                    return [];
                }
            }
        );

        // 🔥 카테고리별 폰트 목록 가져오기
        ipcMain.handle(
            'font:get-fonts-by-category',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'Fonts by category requested');
                    const fontService = FontService.getInstance();
                    const categories = await fontService.getFontsByCategory();
                    Logger.info('FONT_IPC', 'Fonts by category retrieved', { 
                        categories: categories.length,
                        totalFonts: categories.reduce((sum, cat) => sum + cat.count, 0)
                    });
                    return categories;
                } catch (error) {
                    Logger.error('FONT_IPC', 'Get fonts by category failed', error);
                    return [];
                }
            }
        );

        // 🔥 특정 폰트 정보 가져오기
        ipcMain.handle(
            'font:get-font-info',
            async (event: IpcMainInvokeEvent, fontName: string) => {
                try {
                    Logger.debug('FONT_IPC', 'Font info requested', { fontName });
                    const fontService = FontService.getInstance();
                    const fontInfo = await fontService.getFontInfo(fontName);
                    
                    if (fontInfo) {
                        Logger.info('FONT_IPC', 'Font info retrieved', { fontName, size: fontInfo.size });
                        return { success: true, data: fontInfo };
                    } else {
                        Logger.warn('FONT_IPC', 'Font not found', { fontName });
                        return { success: false, error: 'Font not found' };
                    }
                } catch (error) {
                    Logger.error('FONT_IPC', 'Get font info failed', error);
                    return { success: false, error: String(error) };
                }
            }
        );

        // 🔥 폰트 서비스 상태 정보
        ipcMain.handle(
            'font:get-service-status',
            async (event: IpcMainInvokeEvent) => {
                try {
                    const fontService = FontService.getInstance();
                    const status = fontService.getServiceStatus();
                    Logger.debug('FONT_IPC', 'Service status requested', status);
                    return { success: true, data: status };
                } catch (error) {
                    Logger.error('FONT_IPC', 'Get service status failed', error);
                    return { success: false, error: String(error) };
                }
            }
        );

        Logger.info('FONT_IPC', 'All dynamic font IPC handlers registered successfully');

    } catch (setupError) {
        Logger.error('FONT_IPC', 'Failed to setup font IPC handlers', setupError);
        throw setupError;
    }
}

// 🔥 IPC 핸들러 정리
export function cleanupFontIpcHandlers(): void {
    try {
        const handlers = [
            'font:initialize',
            'font:get-available-fonts',
            'font:get-fonts-by-category',
            'font:get-font-info',
            'font:get-service-status'
        ];

        handlers.forEach(handler => {
            ipcMain.removeAllListeners(handler);
        });

        Logger.info('FONT_IPC', 'Font IPC handlers cleaned up');
    } catch (cleanupError) {
        Logger.error('FONT_IPC', 'Failed to cleanup font IPC handlers', cleanupError);
    }
}
