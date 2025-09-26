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

        // 🔥 CSS 생성 및 주입
        ipcMain.handle(
            'font:generate-css',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'CSS generation requested');
                    const fontService = FontService.getInstance();
                    const css = await fontService.generateCSS();
                    
                    if (css) {
                        Logger.info('FONT_IPC', 'CSS generated', { fontsCount: (css.match(/@font-face/g) || []).length });
                        return css;
                    } else {
                        Logger.warn('FONT_IPC', 'CSS generation returned empty string');
                        return '';
                    }
                } catch (error) {
                    Logger.error('FONT_IPC', 'CSS generation failed', error);
                    return '';
                }
            }
        );

        // 🔥 CSS 생성 및 DOM 주입 (웹컨텐츠에 직접 주입)
        ipcMain.handle(
            'font:inject-css',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'CSS injection requested');
                    const fontService = FontService.getInstance();
                    const webContents = event.sender;
                    
                    const cssKey = await fontService.generateAndInjectCSS(webContents);
                    
                    if (cssKey) {
                        Logger.info('FONT_IPC', 'CSS injected successfully', { cssKey });
                        return { success: true, cssKey };
                    } else {
                        Logger.warn('FONT_IPC', 'CSS injection failed - no CSS key returned');
                        return { success: false, error: 'CSS injection failed' };
                    }
                } catch (error) {
                    Logger.error('FONT_IPC', 'CSS injection failed', error);
                    return { success: false, error: String(error) };
                }
            }
        );

        // 🔥 폰트 패밀리 목록 가져오기 (preload에서 요구)
        ipcMain.handle(
            'font:get-font-families',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'Font families requested');
                    const fontService = FontService.getInstance();
                    const families = await fontService.getFontFamilies();
                    Logger.info('FONT_IPC', 'Font families retrieved', { count: families.length });
                    return families;
                } catch (error) {
                    Logger.error('FONT_IPC', 'Get font families failed', error);
                    return [];
                }
            }
        );

        // 🔥 정적 폰트 목록 가져오기 (preload에서 요구)
        ipcMain.handle(
            'font:get-static-fonts',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'Static fonts requested');
                    const fontService = FontService.getInstance();
                    const fonts = await fontService.getAvailableFonts();
                    Logger.info('FONT_IPC', 'Static fonts retrieved', { count: fonts.length });
                    return fonts;
                } catch (error) {
                    Logger.error('FONT_IPC', 'Get static fonts failed', error);
                    return [];
                }
            }
        );

        // 🔥 특정 폰트 패밀리 가져오기 (preload에서 요구)
        ipcMain.handle(
            'font:get-font-family',
            async (event: IpcMainInvokeEvent, familyName: string) => {
                try {
                    Logger.debug('FONT_IPC', 'Font family requested', { familyName });
                    const fontService = FontService.getInstance();
                    const families = await fontService.getFontFamilies();
                    const family = families.find(f => f.name === familyName);
                    
                    if (family) {
                        Logger.info('FONT_IPC', 'Font family found', { familyName, fontCount: family.fonts.length });
                        return { success: true, data: family };
                    } else {
                        Logger.warn('FONT_IPC', 'Font family not found', { familyName });
                        return { success: false, error: 'Font family not found' };
                    }
                } catch (error) {
                    Logger.error('FONT_IPC', 'Get font family failed', error);
                    return { success: false, error: String(error) };
                }
            }
        );

        // 🔥 폰트 재로드 (preload에서 요구)
        ipcMain.handle(
            'font:reload',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'Font reload requested');
                    const fontService = FontService.getInstance();
                    // FontService는 매번 파일시스템을 스캔하므로 별도 재로드 불필요
                    const fonts = await fontService.getAvailableFonts();
                    Logger.info('FONT_IPC', 'Font reload completed', { count: fonts.length });
                    return { success: true, count: fonts.length };
                } catch (error) {
                    Logger.error('FONT_IPC', 'Font reload failed', error);
                    return { success: false, error: String(error) };
                }
            }
        );

        // 🔥 폰트 캐시 클리어 (preload에서 요구)
        ipcMain.handle(
            'font:clear-cache',
            async (event: IpcMainInvokeEvent) => {
                try {
                    Logger.debug('FONT_IPC', 'Font cache clear requested');
                    // FontService는 현재 인메모리 캐시를 사용하지 않으므로 성공 반환
                    Logger.info('FONT_IPC', 'Font cache cleared');
                    return { success: true };
                } catch (error) {
                    Logger.error('FONT_IPC', 'Font cache clear failed', error);
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
            'font:get-service-status',
            'font:generate-css',
            'font:inject-css',
            'font:get-font-families',
            'font:get-static-fonts',
            'font:get-font-family',
            'font:reload',
            'font:clear-cache'
        ];

        handlers.forEach(handler => {
            ipcMain.removeAllListeners(handler);
        });

        Logger.info('FONT_IPC', 'Font IPC handlers cleaned up');
    } catch (cleanupError) {
        Logger.error('FONT_IPC', 'Failed to cleanup font IPC handlers', cleanupError);
    }
}
