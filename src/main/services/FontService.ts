/**
 * 🔥 동적 폰트 서비스 - public/fonts 폴더 기반 폰트 관리
 * TTF 파일을 스캔하고 CSS @font-face 동적 생성
 */

import { app } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import type { Dirent } from 'fs';
import { Logger } from '../../shared/logger';
import ttf2woff2 from 'ttf2woff2';

export type FontCategory = 'korean' | 'japanese' | 'english' | 'system';

interface FontInfo {
    family: string;
    weight: string;
    style: 'normal' | 'italic';
    filePath: string;
    displayName: string;
    category: FontCategory;
    variantId: string;
}

interface FontFamily {
    name: string;
    displayName: string;
    category: FontCategory;
    variants: FontInfo[];
    cssFamily: string;
}

interface FontOption {
    value: string;
    label: string;
    category: FontCategory;
}

const STATIC_FONT_OPTIONS: FontOption[] = [
    { value: 'system-ui, sans-serif', label: '시스템 기본', category: 'system' },
    { value: '-apple-system, BlinkMacSystemFont, sans-serif', label: 'Apple 시스템', category: 'system' },
    { value: 'Arial, Helvetica, sans-serif', label: 'Arial', category: 'english' },
    { value: 'Times New Roman, Times, serif', label: 'Times New Roman', category: 'english' },
    { value: 'Verdana, Geneva, sans-serif', label: 'Verdana', category: 'english' },
    { value: 'Georgia, serif', label: 'Georgia', category: 'english' }
];

class FontService {
    private static instance: FontService;
    private fontsCache: Map<string, FontFamily> = new Map();
    private variantIndex: Map<string, string> = new Map();
    private fontsPath: string | null = null;
    private cachePath: string | null = null;
    private isInitialized = false;

    private constructor() {}

    public static getInstance(): FontService {
        if (!FontService.instance) {
            FontService.instance = new FontService();
        }
        return FontService.instance;
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        await app.whenReady();

        const { source, cache } = await this.resolvePaths();
        this.fontsPath = source;
        this.cachePath = cache;

        this.fontsCache.clear();
        this.variantIndex.clear();

        await this.scanFontsDirectory();
        this.isInitialized = true;

        Logger.info('FONT_SERVICE', '✅ Font service ready', {
            families: Array.from(this.fontsCache.keys()),
            cachePath: this.cachePath
        });
    }

    public async reload(): Promise<void> {
        this.isInitialized = false;
        this.fontsCache.clear();
        this.variantIndex.clear();
        await this.initialize();
    }

    public getAvailableFonts(): FontOption[] {
        this.ensureInitialized();

        const fonts: FontOption[] = [];
        for (const family of this.fontsCache.values()) {
            fonts.push({
                value: family.cssFamily,
                label: family.displayName,
                category: family.category
            });
        }

        // 정렬: 카테고리 → 라벨
        return fonts.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.label.localeCompare(b.label, 'ko');
        });
    }

    public getStaticFonts(): FontOption[] {
        return STATIC_FONT_OPTIONS;
    }

    public getFontFamily(identifier: string): FontFamily | null {
        this.ensureInitialized();

        if (!identifier) {
            return null;
        }

        const direct = this.fontsCache.get(identifier);
        if (direct) {
            return direct;
        }

        for (const family of this.fontsCache.values()) {
            if (
                family.cssFamily === identifier ||
                family.displayName === identifier ||
                family.name === identifier
            ) {
                return family;
            }
        }

        return null;
    }

    public generateFontFaceCSS(): string {
        this.ensureInitialized();

        const css: string[] = [];

        for (const family of this.fontsCache.values()) {
            for (const font of family.variants) {
                css.push(`
@font-face {
  font-family: "${family.displayName}";
  src: url("loop-font://${font.variantId}") format("woff2");
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}`);
            }
        }

        return css.join('\n');
    }

    public async getFontBinary(variantId: string): Promise<ArrayBuffer | null> {
        this.ensureInitialized();

        const filePath = this.variantIndex.get(variantId);
        if (!filePath) {
            Logger.warn('FONT_SERVICE', 'Requested font variant not found', { variantId });
            return null;
        }

        try {
            const buffer = await fs.readFile(filePath);
            return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
        } catch (error) {
            Logger.error('FONT_SERVICE', 'Failed to read cached font file', { variantId, filePath, error });
            return null;
        }
    }

    private ensureInitialized(): void {
        if (!this.isInitialized) {
            throw new Error('FontService has not been initialized yet. Call initialize() first.');
        }
    }

    private async resolvePaths(): Promise<{ source: string; cache: string }> {
        const candidates = [
            path.join(process.cwd(), 'public', 'fonts'),
            path.join(app.getAppPath(), 'public', 'fonts'),
            path.join(process.resourcesPath ?? '', 'public', 'fonts')
        ].filter(Boolean);

        for (const candidate of candidates) {
            try {
                const stats = await fs.stat(candidate);
                if (stats.isDirectory()) {
                    const cacheDir = path.join(app.getPath('userData'), 'fonts-cache');
                    await fs.mkdir(cacheDir, { recursive: true });
                    return { source: candidate, cache: cacheDir };
                }
            } catch {
                // continue to next candidate
            }
        }

    const fallback = candidates[0] ?? path.join(process.cwd(), 'public', 'fonts');
        const cacheDir = path.join(app.getPath('userData'), 'fonts-cache');
        await fs.mkdir(cacheDir, { recursive: true });

        Logger.warn('FONT_SERVICE', 'No font directory found in candidates, using fallback', {
            fallback
        });

        return { source: fallback, cache: cacheDir };
    }

    private async scanFontsDirectory(): Promise<void> {
        if (!this.fontsPath) {
            Logger.warn('FONT_SERVICE', 'Fonts path is not defined, skipping scan');
            return;
        }

        try {
            const fontDirs = await fs.readdir(this.fontsPath, { withFileTypes: true });

            for (const dir of fontDirs) {
                if (!dir.isDirectory() || dir.name.startsWith('.')) {
                    continue;
                }

                if (dir.name === 'Noto_Sans') {
                    await this.processNotoSansDirectory(path.join(this.fontsPath, dir.name));
                } else {
                    await this.processFontDirectory(dir.name);
                }
            }
        } catch (error) {
            Logger.error('FONT_SERVICE', 'Failed to scan fonts directory', { fontsPath: this.fontsPath, error });
        }
    }

    private async processFontDirectory(dirName: string): Promise<void> {
        if (!this.fontsPath) {
            return;
        }

        const dirPath = path.join(this.fontsPath, dirName);
        const fontInfo = await this.scanForFontFiles(dirPath, dirName);
        if (fontInfo.length === 0) {
            Logger.warn('FONT_SERVICE', 'Font directory did not contain convertible files', { dirName });
            return;
        }

        const family = this.createFontFamily(dirName, fontInfo);
        this.fontsCache.set(family.name, family);
        fontInfo.forEach(info => this.variantIndex.set(info.variantId, info.filePath));

        Logger.debug('FONT_SERVICE', 'Registered font family', {
            family: family.name,
            variants: fontInfo.length
        });
    }

    private async processNotoSansDirectory(dirPath: string): Promise<void> {
        const allFonts: FontInfo[] = [];

        try {
            const subDirs = await fs.readdir(dirPath, { withFileTypes: true });

            for (const subDir of subDirs) {
                if (!subDir.isDirectory() || subDir.name.startsWith('.')) {
                    continue;
                }

                const fonts = await this.scanForFontFiles(path.join(dirPath, subDir.name), 'Noto_Sans');
                allFonts.push(...fonts);
            }

            if (allFonts.length > 0) {
                const family = this.createFontFamily('Noto_Sans', allFonts);
                family.displayName = 'Noto Sans (KR/JP)';
                family.category = 'korean';
                this.fontsCache.set('Noto_Sans', family);
                allFonts.forEach(info => this.variantIndex.set(info.variantId, info.filePath));

                Logger.info('FONT_SERVICE', 'Registered merged Noto Sans family', {
                    variants: allFonts.length
                });
            }
        } catch (error) {
            Logger.error('FONT_SERVICE', 'Failed to process Noto Sans directory', { dirPath, error });
        }
    }

    private async scanForFontFiles(dirPath: string, familyName: string): Promise<FontInfo[]> {
        const fonts: FontInfo[] = [];

        const scanRecursive = async (currentPath: string): Promise<void> => {
            let items: Dirent[] = [];
            try {
                items = await fs.readdir(currentPath, { withFileTypes: true });
            } catch (error) {
                Logger.warn('FONT_SERVICE', 'Failed to read directory while scanning fonts', { currentPath, error });
                return;
            }

            for (const item of items) {
                const itemPath = path.join(currentPath, item.name);
                if (item.isDirectory()) {
                    await scanRecursive(itemPath);
                    continue;
                }

                const lowerName = item.name.toLowerCase();
                if (!lowerName.endsWith('.ttf') && !lowerName.endsWith('.otf') && !lowerName.endsWith('.woff2')) {
                    continue;
                }

                const parsed = FontService.parseFont(itemPath, familyName);
                if (!parsed) {
                    continue;
                }

                try {
                    const cachedPath = await this.ensureWoff2(itemPath, familyName, parsed.displayName);
                    parsed.filePath = cachedPath;
                    parsed.variantId = this.createVariantId(familyName, parsed, fonts.length);
                    fonts.push(parsed);
                } catch (error) {
                    Logger.error('FONT_SERVICE', 'Failed to convert font to WOFF2', {
                        file: itemPath,
                        error
                    });
                }
            }
        };

        await scanRecursive(dirPath);
        return fonts;
    }

    private async ensureWoff2(sourcePath: string, familyName: string, displayName: string): Promise<string> {
        const ext = path.extname(sourcePath).toLowerCase();
        if (ext === '.woff2') {
            return sourcePath;
        }

        if (!this.cachePath) {
            throw new Error('Font cache path has not been resolved');
        }

        const familyDir = path.join(this.cachePath, this.sanitizeId(familyName));
        await fs.mkdir(familyDir, { recursive: true });

        const baseName = path.basename(sourcePath, ext);
        const targetPath = path.join(familyDir, `${baseName}.woff2`);

        if (await this.isCacheValid(sourcePath, targetPath)) {
            return targetPath;
        }

        const fontBuffer = await fs.readFile(sourcePath);
        const converted = await Promise.resolve(ttf2woff2(fontBuffer));
        const outBuffer = Buffer.isBuffer(converted) ? converted : Buffer.from(converted);
        await fs.writeFile(targetPath, outBuffer);

        Logger.info('FONT_SERVICE', 'Converted font to WOFF2', {
            family: familyName,
            file: displayName,
            source: sourcePath,
            target: targetPath
        });

        return targetPath;
    }

    private async isCacheValid(sourcePath: string, targetPath: string): Promise<boolean> {
        try {
            const [sourceStat, targetStat] = await Promise.all([
                fs.stat(sourcePath),
                fs.stat(targetPath)
            ]);

            return targetStat.mtimeMs >= sourceStat.mtimeMs && targetStat.size > 0;
        } catch {
            return false;
        }
    }

    private createFontFamily(dirName: string, fonts: FontInfo[]): FontFamily {
        const category = FontService.determineFontCategory(dirName);
        const displayName = FontService.createDisplayName(dirName, fonts[0]?.displayName ?? dirName);
        const cssFamily = this.generateCSSFontFamily(displayName);

        return {
            name: dirName,
            displayName,
            category,
            variants: fonts,
            cssFamily
        };
    }

    private generateCSSFontFamily(displayName: string): string {
        const fallbacks = ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'];
        return `"${displayName}"` + (fallbacks.length ? `, ${fallbacks.join(', ')}` : '');
    }

    private createVariantId(familyName: string, font: FontInfo, index: number): string {
        const parts = [
            this.sanitizeId(familyName),
            font.weight || '400',
            font.style || 'normal',
            index.toString()
        ];
        return parts.join('-');
    }

    private sanitizeId(value: string): string {
        return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    private static parseFont(filePath: string, familyName: string): FontInfo | null {
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath, ext);
        const lowerFileName = fileName.toLowerCase();

        const weightMap: Record<string, string> = {
            thin: '100',
            extralight: '200',
            light: '300',
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '900',
            variable: '400'
        };

        let weight = '400';
        for (const [keyword, mapped] of Object.entries(weightMap)) {
            if (lowerFileName.includes(keyword)) {
                weight = mapped;
                break;
            }
        }

        const style: 'normal' | 'italic' = lowerFileName.includes('italic') ? 'italic' : 'normal';
        const category = FontService.determineFontCategory(familyName);
        const displayName = FontService.createDisplayName(familyName, fileName);

        return {
            family: familyName,
            weight,
            style,
            filePath,
            displayName,
            category,
            variantId: ''
        };
    }

    private static determineFontCategory(familyName: string): FontCategory {
        const name = familyName.toLowerCase();
        if (/(nanum|pretendard|gangwon|malgun|noto_sans|noto-sans|hangang)/.test(name)) {
            return 'korean';
        }
        if (/(ms gothic|ms mincho|pretendardjp|jp)/.test(name)) {
            return 'japanese';
        }
        if (/(arial|times|verdana|calibri|sf-pro|roboto|inter)/.test(name)) {
            return 'english';
        }
        return 'system';
    }

    private static createDisplayName(familyName: string, fallback: string): string {
        const map: Record<string, string> = {
            Pretendard: 'Pretendard',
            PretendardJP: 'Pretendard JP',
            'nanum-gothic': 'Nanum Gothic (나눔고딕)',
            Noto_Sans: 'Noto Sans',
            'Noto_Sans_KR': 'Noto Sans KR',
            'Noto_Sans_JP': 'Noto Sans JP',
            Gangwon_mac: '강원교육모두체 (Mac)',
            Gangwon_win: '강원교육모두체 (Windows)',
            'MS Gothic': 'MS Gothic',
            'MS Mincho Regular': 'MS Mincho',
            'sf-pro-display': 'SF Pro Display',
            arial: 'Arial',
            'times-new-roman': 'Times New Roman',
            Verdana: 'Verdana',
            'calibri-font-family': 'Calibri',
            Roboto: 'Roboto',
            Inter: 'Inter'
        };

        return map[familyName] || fallback || familyName;
    }
}

export const fontService = FontService.getInstance();
export default fontService;
