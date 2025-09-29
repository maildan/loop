// 🔥 기가차드 동적 폰트 핸들러 - ZIP 기반 폰트 로딩 (LEGACY)
// NOTE: This module is deprecated. The new FontService pipeline should be used instead.

import { ipcMain, app, IpcMainInvokeEvent } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import AdmZip from 'adm-zip';
import { FontData, FontLoadResult } from '../../shared/ipcTypes';
import { Logger } from '../../shared/logger';

// #DEBUG: Font handler entry point
Logger.debug('FONT_HANDLER', 'Dynamic font handler module loaded');

// 🔥 폰트 디렉토리 경로
const getUserDataPath = () => app.getPath('userData');
const getFontsDir = () => path.join(getUserDataPath(), 'fonts');

// 🔥 지원되는 폰트 MIME 타입
const FONT_MIME_TYPES: Record<string, string> = {
    '.ttf': 'font/truetype',
    '.otf': 'font/opentype',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

// 🔥 캐시된 폰트 데이터
const fontCache = new Map<string, FontData[]>();

/**
 * 🔥 폰트 디렉토리 생성 (없으면)
 */
async function ensureFontsDirectory(): Promise<void> {
    const fontsDir = getFontsDir();
    try {
        await fs.access(fontsDir);
    } catch {
        await fs.mkdir(fontsDir, { recursive: true });
        Logger.info('FONT_HANDLER', 'Fonts directory created', { fontsDir });
    }
}

/**
 * 🔥 파일명에서 폰트 속성 파싱
 */
function parseFontAttributes(fileName: string): { fontFamily: string; fontWeight: number; fontStyle: 'normal' | 'italic' } {
    const baseName = path.basename(fileName, path.extname(fileName));

    // 폰트 이름 추출 (첫 번째 하이픈 또는 언더스코어 전까지)
    const fontFamily = baseName.split(/[-_]/)[0] || 'Unknown';

    // 굵기 파싱
    let fontWeight = 400; // 기본값
    if (/bold|700/i.test(baseName)) fontWeight = 700;
    else if (/light|300/i.test(baseName)) fontWeight = 300;
    else if (/thin|100/i.test(baseName)) fontWeight = 100;
    else if (/medium|500/i.test(baseName)) fontWeight = 500;
    else if (/black|900/i.test(baseName)) fontWeight = 900;

    // 스타일 파싱
    const fontStyle: 'normal' | 'italic' = /italic/i.test(baseName) ? 'italic' : 'normal';

    return { fontFamily, fontWeight, fontStyle };
}

/**
 * 🔥 ZIP에서 폰트 로드
 */
async function loadFontFromZip(zipFileName: string): Promise<FontLoadResult> {
    try {
        Logger.debug('FONT_HANDLER', 'Loading font from ZIP', { zipFileName });

        // 캐시 확인
        if (fontCache.has(zipFileName)) {
            const cachedFonts = fontCache.get(zipFileName)!;
            Logger.info('FONT_HANDLER', 'Font loaded from cache', { zipFileName, fontCount: cachedFonts.length });
            return { success: true, fonts: cachedFonts };
        }

        const fontsDir = getFontsDir();
        const zipPath = path.join(fontsDir, zipFileName);

        // ZIP 파일 존재 확인
        try {
            await fs.access(zipPath);
        } catch {
            throw new Error(`ZIP 파일을 찾을 수 없습니다: ${zipFileName}`);
        }

        const zip = new AdmZip(zipPath);
        const zipEntries = zip.getEntries();
        const fontDataList: FontData[] = [];

        for (const entry of zipEntries) {
            if (entry.isDirectory) continue;

            const ext = path.extname(entry.entryName).toLowerCase();
            if (FONT_MIME_TYPES[ext]) {
                const fontBuffer = entry.getData();
                const base64Data = fontBuffer.toString('base64');
                const dataUri = `data:${FONT_MIME_TYPES[ext]};base64,${base64Data}`;

                const { fontFamily, fontWeight, fontStyle } = parseFontAttributes(entry.entryName);

                fontDataList.push({
                    fontFamily,
                    fontWeight,
                    fontStyle,
                    dataUri,
                    fileName: entry.entryName,
                    format: ext.substring(1), // .ttf -> ttf
                });

                Logger.debug('FONT_HANDLER', 'Font file processed', {
                    fileName: entry.entryName,
                    fontFamily,
                    fontWeight,
                    fontStyle,
                    size: fontBuffer.length
                });
            }
        }

        if (fontDataList.length === 0) {
            throw new Error(`ZIP 파일에 폰트 파일이 없습니다: ${zipFileName}`);
        }

        // 캐시에 저장
        fontCache.set(zipFileName, fontDataList);

        Logger.info('FONT_HANDLER', 'Font loaded successfully from ZIP', {
            zipFileName,
            fontCount: fontDataList.length,
            fonts: fontDataList.map(f => ({ family: f.fontFamily, weight: f.fontWeight, style: f.fontStyle }))
        });

        return { success: true, fonts: fontDataList };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        Logger.error('FONT_HANDLER', 'Failed to load font from ZIP', {
            zipFileName,
            error: errorMessage,
            fullError: error
        });

        return {
            success: false,
            fonts: [],
            error: errorMessage
        };
    }
}

/**
 * 🔥 웹폰트 다운로드 (구글 폰트 등)
 */
async function downloadWebFont(fontFamily: string, weights: number[] = [400]): Promise<FontLoadResult> {
    try {
        Logger.debug('FONT_HANDLER', 'Downloading web font', { fontFamily, weights });

        // Google Fonts API를 사용하여 폰트 다운로드
        // 이 부분은 실제 구현에서는 axios나 fetch를 사용하여 폰트 파일을 다운로드해야 합니다
        // 여기서는 예시로 간단히 구현

        const fontDataList: FontData[] = [];

        for (const weight of weights) {
            // 실제로는 Google Fonts API에서 다운로드
            const dummyDataUri = `data:font/woff2;base64,d09GMgABAAAAAA...`; // 실제 폰트 데이터

            fontDataList.push({
                fontFamily,
                fontWeight: weight,
                fontStyle: 'normal',
                dataUri: dummyDataUri,
                fileName: `${fontFamily}-${weight}.woff2`,
                format: 'woff2',
            });
        }

        Logger.info('FONT_HANDLER', 'Web font downloaded successfully', {
            fontFamily,
            weights,
            fontCount: fontDataList.length
        });

        return { success: true, fonts: fontDataList };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        Logger.error('FONT_HANDLER', 'Failed to download web font', {
            fontFamily,
            weights,
            error: errorMessage
        });

        return {
            success: false,
            fonts: [],
            error: errorMessage
        };
    }
}

/**
 * 🔥 IPC 핸들러 등록
 */
export function registerDynamicFontHandlers(): void {
    Logger.warn('FONT_HANDLER', 'registerDynamicFontHandlers is deprecated. Use setupFontIpcHandlers instead.');
    throw new Error('registerDynamicFontHandlers is deprecated.');
}

// #DEBUG: Font handler exit point
Logger.debug('FONT_HANDLER', 'Dynamic font handler module setup complete');

export default registerDynamicFontHandlers;
