// 🔥 기가차드 폰트 매니저 - ZIP 폰트 동적 로딩 시스템

import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import { Logger } from '../../shared/logger';
import { Result, createSuccess, createError } from '../../shared/common';

// #DEBUG: Font manager entry point
Logger.debug('FONT_MANAGER', 'Font manager module loaded');

// 🔥 폰트 정보 인터페이스
export interface FontInfo {
    name: string;
    displayName: string;
    fileName: string;
    category: 'korean' | 'english' | 'universal';
    weight: 'normal' | 'bold' | 'light';
    style: 'normal' | 'italic';
    format: 'ttf' | 'otf' | 'woff2';
    size?: number; // bytes
}

// 🔥 폰트 로드 결과
export interface FontLoadResult {
    success: boolean;
    fontFamily: string;
    cssUrl?: string;
    error?: string;
}

// 🔥 지원하는 폰트 목록 (8가지)
export const SUPPORTED_FONTS: FontInfo[] = [
    {
        name: 'pretendard',
        displayName: 'Pretendard (기본)',
        fileName: 'Pretendard-Regular.woff2',
        category: 'universal',
        weight: 'normal',
        style: 'normal',
        format: 'woff2'
    },
    {
        name: 'noto-sans-kr',
        displayName: 'Noto Sans KR',
        fileName: 'NotoSansKR-Regular.woff2',
        category: 'korean',
        weight: 'normal',
        style: 'normal',
        format: 'woff2'
    },
    {
        name: 'malgun-gothic',
        displayName: '맑은 고딕',
        fileName: 'MalgunGothic.ttf',
        category: 'korean',
        weight: 'normal',
        style: 'normal',
        format: 'ttf'
    },
    {
        name: 'sf-pro-display',
        displayName: 'SF Pro Display',
        fileName: 'SFProDisplay-Regular.otf',
        category: 'english',
        weight: 'normal',
        style: 'normal',
        format: 'otf'
    },
    {
        name: 'roboto',
        displayName: 'Roboto',
        fileName: 'Roboto-Regular.ttf',
        category: 'universal',
        weight: 'normal',
        style: 'normal',
        format: 'ttf'
    },
    {
        name: 'nanum-gothic',
        displayName: '나눔고딕',
        fileName: 'NanumGothic-Regular.ttf',
        category: 'korean',
        weight: 'normal',
        style: 'normal',
        format: 'ttf'
    },
    {
        name: 'inter',
        displayName: 'Inter',
        fileName: 'Inter-Regular.woff2',
        category: 'english',
        weight: 'normal',
        style: 'normal',
        format: 'woff2'
    },
    {
        name: 'source-han-sans',
        displayName: 'Source Han Sans',
        fileName: 'SourceHanSansKR-Regular.otf',
        category: 'korean',
        weight: 'normal',
        style: 'normal',
        format: 'otf'
    },
    {
        name: 'gangwon',
        displayName: '강원교육모두체',
        fileName: 'GangwonEduAll-Regular.ttf',
        category: 'korean',
        weight: 'normal',
        style: 'normal',
        format: 'ttf'
    }
];

/**
 * 🔥 기가차드 폰트 매니저
 * ZIP 폰트 파일을 동적으로 로드하고 CSS로 등록하는 시스템
 */
export class FontManager {
    private static instance: FontManager | null = null;
    private fontsDirectory: string;
    private loadedFonts = new Set<string>();
    private fontCache = new Map<string, Buffer>();

    private constructor() {
        // 폰트 저장 디렉토리 설정
        this.fontsDirectory = path.join(app.getPath('userData'), 'fonts');
        this.ensureFontsDirectory();
        Logger.info('FONT_MANAGER', 'Font manager instance created', {
            fontsDirectory: this.fontsDirectory
        });
    }

    // 🔥 싱글톤 인스턴스
    public static getInstance(): FontManager {
        if (!FontManager.instance) {
            FontManager.instance = new FontManager();
        }
        return FontManager.instance;
    }

    // 🔥 폰트 디렉토리 확인/생성
    private ensureFontsDirectory(): void {
        try {
            if (!fs.existsSync(this.fontsDirectory)) {
                fs.mkdirSync(this.fontsDirectory, { recursive: true });
                Logger.info('FONT_MANAGER', 'Fonts directory created', {
                    path: this.fontsDirectory
                });
            }
        } catch (error) {
            Logger.error('FONT_MANAGER', 'Failed to create fonts directory', error);
        }
    }

    // 🔥 ZIP에서 폰트 추출
    public async extractFontFromZip(
        zipPath: string,
        fontName: string
    ): Promise<Result<Buffer>> {
        try {
            Logger.debug('FONT_MANAGER', 'Extracting font from ZIP', {
                zipPath,
                fontName
            });

            if (!fs.existsSync(zipPath)) {
                return createError(`ZIP 파일을 찾을 수 없습니다: ${zipPath}`);
            }

            const zip = new AdmZip(zipPath);
            const fontInfo = SUPPORTED_FONTS.find(f => f.name === fontName);

            if (!fontInfo) {
                return createError(`지원하지 않는 폰트: ${fontName}`);
            }

            // ZIP에서 폰트 파일 찾기
            const entries = zip.getEntries();
            const fontEntry = entries.find((entry: any) =>
                entry.entryName.includes(fontInfo.fileName) ||
                entry.entryName.endsWith(`.${fontInfo.format}`)
            );

            if (!fontEntry) {
                return createError(`ZIP에서 폰트 파일을 찾을 수 없습니다: ${fontInfo.fileName}`);
            }

            const fontBuffer = fontEntry.getData();

            // 캐시에 저장
            this.fontCache.set(fontName, fontBuffer);

            Logger.info('FONT_MANAGER', 'Font extracted successfully', {
                fontName,
                size: fontBuffer.length,
                format: fontInfo.format
            });

            return createSuccess(fontBuffer);

        } catch (error) {
            Logger.error('FONT_MANAGER', 'Failed to extract font from ZIP', {
                zipPath,
                fontName,
                error
            });
            return createError(error instanceof Error ? error.message : 'ZIP 추출 실패');
        }
    }

    // 🔥 폰트를 파일로 저장
    public async saveFontToFile(
        fontName: string,
        fontBuffer: Buffer
    ): Promise<Result<string>> {
        try {
            const fontInfo = SUPPORTED_FONTS.find(f => f.name === fontName);
            if (!fontInfo) {
                return createError(`지원하지 않는 폰트: ${fontName}`);
            }

            const fontPath = path.join(this.fontsDirectory, fontInfo.fileName);

            // 이미 파일이 있으면 스킷
            if (fs.existsSync(fontPath)) {
                Logger.debug('FONT_MANAGER', 'Font file already exists', { fontPath });
                return createSuccess(fontPath);
            }

            fs.writeFileSync(fontPath, fontBuffer);

            Logger.info('FONT_MANAGER', 'Font saved to file', {
                fontName,
                fontPath,
                size: fontBuffer.length
            });

            return createSuccess(fontPath);

        } catch (error) {
            Logger.error('FONT_MANAGER', 'Failed to save font to file', {
                fontName,
                error
            });
            return createError(error instanceof Error ? error.message : '폰트 저장 실패');
        }
    }

    // 🔥 CSS @font-face 규칙 생성
    public generateFontFaceCSS(fontName: string, fontPath: string): string {
        const fontInfo = SUPPORTED_FONTS.find(f => f.name === fontName);
        if (!fontInfo) {
            return '';
        }

        // 파일 URL 생성 (Electron에서 사용)
        const fontUrl = `file://${fontPath.replace(/\\/g, '/')}`;

        return `
@font-face {
  font-family: '${fontInfo.displayName}';
  src: url('${fontUrl}') format('${this.getFontFormat(fontInfo.format)}');
  font-weight: ${fontInfo.weight};
  font-style: ${fontInfo.style};
  font-display: swap;
}`;
    }

    // 🔥 폰트 포맷 CSS 문자열 변환
    private getFontFormat(format: string): string {
        switch (format) {
            case 'woff2': return 'woff2';
            case 'woff': return 'woff';
            case 'ttf': return 'truetype';
            case 'otf': return 'opentype';
            default: return 'truetype';
        }
    }

    // 🔥 폰트 로드 및 CSS 적용
    public async loadFont(
        fontName: string,
        zipPath?: string
    ): Promise<Result<FontLoadResult>> {
        try {
            Logger.debug('FONT_MANAGER', 'Loading font', { fontName, zipPath });

            // 이미 로드된 폰트인지 확인
            if (this.loadedFonts.has(fontName)) {
                Logger.debug('FONT_MANAGER', 'Font already loaded', { fontName });
                return createSuccess({
                    success: true,
                    fontFamily: this.getFontFamily(fontName)
                });
            }

            let fontBuffer: Buffer;

            // 캐시에서 확인
            if (this.fontCache.has(fontName)) {
                fontBuffer = this.fontCache.get(fontName)!;
                Logger.debug('FONT_MANAGER', 'Font loaded from cache', { fontName });
            } else if (zipPath) {
                // ZIP에서 추출
                const extractResult = await this.extractFontFromZip(zipPath, fontName);
                if (!extractResult.success) {
                    return createError(extractResult.error || '폰트 추출 실패');
                }
                fontBuffer = extractResult.data!;
            } else {
                return createError('폰트 소스를 찾을 수 없습니다');
            }

            // 파일로 저장
            const saveResult = await this.saveFontToFile(fontName, fontBuffer);
            if (!saveResult.success) {
                return createError(saveResult.error || '폰트 저장 실패');
            }

            const fontPath = saveResult.data!;

            // CSS 생성
            const cssRule = this.generateFontFaceCSS(fontName, fontPath);

            // 로드된 폰트로 마킹
            this.loadedFonts.add(fontName);

            Logger.info('FONT_MANAGER', 'Font loaded successfully', {
                fontName,
                fontPath,
                cssGenerated: cssRule.length > 0
            });

            return createSuccess({
                success: true,
                fontFamily: this.getFontFamily(fontName),
                cssUrl: `file://${fontPath}`
            });

        } catch (error) {
            Logger.error('FONT_MANAGER', 'Failed to load font', {
                fontName,
                zipPath,
                error
            });
            return createError(error instanceof Error ? error.message : '폰트 로드 실패');
        }
    }

    // 🔥 폰트 패밀리 이름 가져오기
    public getFontFamily(fontName: string): string {
        const fontInfo = SUPPORTED_FONTS.find(f => f.name === fontName);
        return fontInfo ? fontInfo.displayName : fontName;
    }

    // 🔥 지원하는 폰트 목록 가져오기
    public getSupportedFonts(): FontInfo[] {
        return [...SUPPORTED_FONTS];
    }

    // 🔥 로드된 폰트 목록 가져오기
    public getLoadedFonts(): string[] {
        return Array.from(this.loadedFonts);
    }

    // 🔥 폰트 캐시 클리어
    public clearCache(): void {
        this.fontCache.clear();
        Logger.info('FONT_MANAGER', 'Font cache cleared');
    }

    // 🔥 정리
    public cleanup(): void {
        this.clearCache();
        this.loadedFonts.clear();
        Logger.info('FONT_MANAGER', 'Font manager cleaned up');
    }
}

// 🔥 기가차드 전역 폰트 매니저
export const fontManager = FontManager.getInstance();

// #DEBUG: Font manager exit point
Logger.debug('FONT_MANAGER', 'Font manager module setup complete');

export default fontManager;
