/**
 * 🔥 동적 폰트 서비스 - public/fonts 폴더 기반 폰트 관리

 */

import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { Logger } from '../../shared/logger';

interface FontInfo {
    family: string;
    weight: string;
    style: string;
    filePath: string;
    displayName: string;
    category: 'korean' | 'japanese' | 'english' | 'system';
}

interface FontFamily {
    name: string;
    displayName: string;
    category: 'korean' | 'japanese' | 'english' | 'system';
    variants: FontInfo[];
    cssFamily: string;
}

class FontService {
    private static instance: FontService;
    private fontsCache: Map<string, FontFamily> = new Map();
    private fontsPath: string;
    private isInitialized = false;

    private constructor() {
        // public/fonts 경로 설정
        this.fontsPath = path.join(process.cwd(), 'public', 'fonts');
    }

    public static getInstance(): FontService {
        if (!FontService.instance) {
            FontService.instance = new FontService();
        }
        return FontService.instance;
    }

    // ✅ 초기화 상태 추적을 위한 Promise 저장 (race condition 방지)
    private initializationPromise: Promise<void> | null = null;

    /**
     * 🔥 폰트 폴더 스캔 및 초기화
     */
    public async initialize(): Promise<void> {
        // ✅ Race condition 방지: 이미 초기화 중이거나 완료된 경우 같은 Promise 반환
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        if (this.isInitialized) {
            Logger.debug('FONT_SERVICE', '폰트 서비스가 이미 초기화되었습니다');
            return Promise.resolve();
        }

        // 초기화 Promise 생성 및 저장 (동시 호출 방지)
        this.initializationPromise = this._performInitialization();
        
        try {
            await this.initializationPromise;
        } catch (error) {
            // 실패 시 Promise 초기화하여 재시도 가능하게 함
            this.initializationPromise = null;
            throw error;
        }
    }

    private async _performInitialization(): Promise<void> {

        try {
            Logger.info('FONT_SERVICE', '� 폰트 서비스 초기화 시작', {
                fontsPath: this.fontsPath,
                exists: existsSync(this.fontsPath),
                NODE_ENV: process.env.NODE_ENV
            });

            await this.scanFontsDirectory();
            this.isInitialized = true;

            Logger.info('FONT_SERVICE', '✅ 폰트 서비스 초기화 완료', {
                totalFamilies: this.fontsCache.size,
                families: Array.from(this.fontsCache.keys())
            });
        } catch (error) {
            Logger.error('FONT_SERVICE', '❌ 폰트 서비스 초기화 실패', error);
            throw error;
        }
    }

    /**
     * 🔥 폰트 디렉토리 스캔
     */
    private async scanFontsDirectory(): Promise<void> {
        try {
            const fontDirs = await fs.readdir(this.fontsPath, { withFileTypes: true });

            Logger.info('FONT_SERVICE', '🔍 폰트 디렉토리 스캔 시작', {
                totalDirs: fontDirs.length,
                directories: fontDirs.filter(d => d.isDirectory() && !d.name.startsWith('.')).map(d => d.name)
            });

            for (const dir of fontDirs) {
                if (!dir.isDirectory() || dir.name.startsWith('.')) {
                    Logger.debug('FONT_SERVICE', `⏭️ 디렉토리 스킵: ${dir.name}`, { isDirectory: dir.isDirectory(), startsWithDot: dir.name.startsWith('.') });
                    continue;
                }

                Logger.info('FONT_SERVICE', `🔍 폰트 디렉토리 처리 시작: ${dir.name}`);
                await this.processFontDirectory(dir.name);
            }
        } catch (error) {
            Logger.error('FONT_SERVICE', '폰트 디렉토리 스캔 실패', error);
        }
    }

    /**
     * 🔥 개별 폰트 디렉토리 처리
     */
    private async processFontDirectory(dirName: string): Promise<void> {
        const dirPath = path.join(this.fontsPath, dirName);

        try {
            // Noto_Sans 특별 처리 (JP/KR 서브폴더)
            if (dirName === 'Noto_Sans') {
                await this.processNotoSansDirectory(dirPath);
                return;
            }

            const fontInfo = await this.scanForFontFiles(dirPath, dirName);
            if (fontInfo.length > 0) {
                const family = this.createFontFamily(dirName, fontInfo);
                this.fontsCache.set(family.name, family);
                Logger.debug('FONT_SERVICE', `폰트 패밀리 등록: ${family.name}`, { variantCount: fontInfo.length });
            } else {
                Logger.warn('FONT_SERVICE', `🚨 폰트 패밀리에서 TTF 파일을 찾을 수 없음: ${dirName}`, { dirPath });
            }
        } catch (error) {
            Logger.warn('FONT_SERVICE', `폰트 디렉토리 처리 실패: ${dirName}`, error);
        }
    }

    /**
     * 🔥 Noto Sans 특별 처리 (JP/KR 통합)
     */
    private async processNotoSansDirectory(dirPath: string): Promise<void> {
        const allFonts: FontInfo[] = [];

        try {
            const subDirs = await fs.readdir(dirPath, { withFileTypes: true });

            for (const subDir of subDirs) {
                if (!subDir.isDirectory() || subDir.name.startsWith('.')) continue;

                const subDirPath = path.join(dirPath, subDir.name);
                const fonts = await this.scanForFontFiles(subDirPath, 'Noto Sans');
                allFonts.push(...fonts);
            }

            if (allFonts.length > 0) {
                const family = this.createFontFamily('Noto_Sans', allFonts);
                family.displayName = 'Noto Sans (KR/JP)';
                family.category = 'korean'; // 한국어로 분류
                this.fontsCache.set('Noto_Sans', family);
                Logger.info('FONT_SERVICE', 'Noto Sans 통합 폰트 등록', { variantCount: allFonts.length });
            }
        } catch (error) {
            Logger.error('FONT_SERVICE', 'Noto Sans 처리 실패', error);
        }
    }

    /**
     * 🔥 폰트 파일(TTF/OTF) 스캔 - Mac에서는 OTF 우선
     */
    private async scanForFontFiles(dirPath: string, familyName: string): Promise<FontInfo[]> {
        const fonts: FontInfo[] = [];
        const fontFiles: { path: string; type: 'TTF' | 'OTF' }[] = [];

        async function scanRecursive(currentPath: string): Promise<void> {
            try {
                const items = await fs.readdir(currentPath, { withFileTypes: true });

                for (const item of items) {
                    const itemPath = path.join(currentPath, item.name);

                    if (item.isDirectory()) {
                        await scanRecursive(itemPath);
                    } else if (item.name.toLowerCase().endsWith('.ttf') || item.name.toLowerCase().endsWith('.otf')) {
                        const fontType = item.name.toLowerCase().endsWith('.ttf') ? 'TTF' : 'OTF';
                        fontFiles.push({ path: itemPath, type: fontType });
                    }
                }
            } catch (error) {
                Logger.warn('FONT_SERVICE', `폰트 파일 스캔 실패: ${currentPath}`, error);
            }
        }

        await scanRecursive(dirPath);

        // 🔥 Mac에서는 OTF 우선, Windows에서는 TTF 우선
        const isMac = process.platform === 'darwin';
        const sortedFontFiles = fontFiles.sort((a, b) => {
            if (isMac) {
                // Mac: OTF 우선
                if (a.type === 'OTF' && b.type === 'TTF') return -1;
                if (a.type === 'TTF' && b.type === 'OTF') return 1;
            } else {
                // Windows: TTF 우선  
                if (a.type === 'TTF' && b.type === 'OTF') return -1;
                if (a.type === 'OTF' && b.type === 'TTF') return 1;
            }
            return 0;
        });

        // 같은 스타일의 중복 제거 (OTF 우선)
        const processedStyles = new Set<string>();
        
        for (const fontFile of sortedFontFiles) {
            const fontInfo = FontService.parseFont(fontFile.path, familyName);
            if (fontInfo) {
                const styleKey = `${fontInfo.weight}-${fontInfo.style}`;
                
                if (!processedStyles.has(styleKey)) {
                    fonts.push(fontInfo);
                    processedStyles.add(styleKey);
                    Logger.debug('FONT_SERVICE', `✅ ${fontFile.type} 폰트 선택: ${path.basename(fontFile.path)}`, fontInfo);
                } else {
                    Logger.debug('FONT_SERVICE', `⏭️ ${fontFile.type} 폰트 스킵 (중복): ${path.basename(fontFile.path)}`);
                }
            }
        }

        return fonts;
    }

    /**
     * 🔥 폰트 파일명(TTF/OTF)에서 폰트 정보 추출
     */
    private static parseFont(filePath: string, familyName: string): FontInfo | null {
        // TTF 또는 OTF 확장자 제거
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath, ext);

        // 가중치 매핑
        const weightMap: Record<string, string> = {
            'thin': '100',
            'extralight': '200',
            'light': '300',
            'regular': '400',
            'medium': '500',
            'semibold': '600',
            'bold': '700',
            'extrabold': '800',
            'black': '900',
            'variable': '400' // Variable 폰트는 기본 400
        };

        let weight = '400';
        let style = 'normal';

        const lowerFileName = fileName.toLowerCase();

        // 가중치 감지
        for (const [keyword, w] of Object.entries(weightMap)) {
            if (lowerFileName.includes(keyword)) {
                weight = w;
                break;
            }
        }

        // 이탤릭 감지
        if (lowerFileName.includes('italic')) {
            style = 'italic';
        }

        // 카테고리 결정
        const category = FontService.determineFontCategory(familyName);

        return {
            family: familyName,
            weight,
            style,
            filePath,
            displayName: FontService.createDisplayName(familyName, fileName),
            category
        };
    }

    /**
     * 🔥 폰트 카테고리 결정
     */
    private static determineFontCategory(familyName: string): 'korean' | 'japanese' | 'english' | 'system' {
        const korean = ['nanum', 'pretendard', 'gangwon', 'malgun', 'noto_sans'];
        const japanese = ['ms gothic', 'ms mincho', 'pretendardjp'];
        const english = ['arial', 'times', 'verdana', 'calibri', 'sf-pro'];

        const lowerName = familyName.toLowerCase();

        if (korean.some(k => lowerName.includes(k))) return 'korean';
        if (japanese.some(j => lowerName.includes(j))) return 'japanese';
        if (english.some(e => lowerName.includes(e))) return 'english';

        return 'system';
    }

    /**
     * 🔥 표시명 생성
     */
    private static createDisplayName(familyName: string, fileName: string): string {
        const displayMap: Record<string, string> = {
            'Pretendard': 'Pretendard (프리텐다드)',
            'PretendardJP': 'Pretendard JP',
            'nanum-gothic': 'Nanum Gothic (나눔고딕)',
            'Noto_Sans': 'Noto Sans',
            'Gangwon_mac': 'Gangwon Mac (강원교육모두체)',
            'Gangwon_win': 'Gangwon Win (강원교육모두체)',
            'MS Gothic': 'MS Gothic (MS ゴシック)',
            'MS Mincho Regular': 'MS Mincho (MS 明朝)',
            'sf-pro-display': 'SF Pro Display',
            'arial': 'Arial',
            'times-new-roman': 'Times New Roman',
            'Verdana': 'Verdana',
            'calibri-font-family': 'Calibri'
        };

        return displayMap[familyName] || familyName;
    }

    /**
     * 🔥 폰트 패밀리 생성
     */
    private createFontFamily(dirName: string, fonts: FontInfo[]): FontFamily {
        const category = FontService.determineFontCategory(dirName);
        const displayName = FontService.createDisplayName(dirName, '');

        // CSS font-family 문자열 생성
        const cssFamily = this.generateCSSFontFamily(dirName, fonts);

        return {
            name: dirName,
            displayName,
            category,
            variants: fonts,
            cssFamily
        };
    }

    /**
     * 🔥 CSS font-family 문자열 생성
     */
    private generateCSSFontFamily(familyName: string, fonts: FontInfo[]): string {
        const baseName = familyName.replace(/[-_]/g, ' ');

        // 폴백 폰트 추가
        const fallbacks = {
            korean: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
            japanese: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
            english: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
            system: ['system-ui', 'sans-serif']
        };

        const category = FontService.determineFontCategory(familyName);
        const fallbackList = fallbacks[category];

        return `"${baseName}", ${fallbackList.join(', ')}`;
    }

    /**
     * 🔥 블랙리스트된 폰트 체크 (알려진 문제 폰트들)
     */
    private isBlacklistedFont(filePath: string): boolean {
        const fileName = path.basename(filePath).toLowerCase();
        const problematicFonts = [
            'gaw.otf',
            'gaw_bold.otf', 
            'nanumgothicbold.otf',
            'nanumgothic.otf'
        ];
        
        return problematicFonts.some(problematic => fileName.includes(problematic));
    }

    /**
     * 🔥 @font-face CSS 생성
     */
    public generateFontFaceCSS(): string {
        const css: string[] = [];

        for (const family of this.fontsCache.values()) {
            for (const font of family.variants) {
                // 🎯 단순한 상대경로 사용 - 실무 표준 방식
                let relativePath = path.relative(this.fontsPath, font.filePath);
                relativePath = relativePath.replace(/\\/g, '/'); // Windows 경로 정규화

                // WOFF2 우선, 없으면 원본 확장자 사용
                const woff2Path = relativePath.replace(/\.(ttf|otf)$/i, '.woff2');
                const woff2FilePath = path.join(this.fontsPath, woff2Path);

                const finalPath = existsSync(woff2FilePath) ? woff2Path : relativePath;
                const format = finalPath.endsWith('.woff2') ? 'woff2' :
                    finalPath.endsWith('.woff') ? 'woff' : 'truetype';

                // 🔥 통일된 URL 생성 - vite-plugin-static-copy로 폰트 파일이 복사되므로 동일한 경로 사용
                const fontUrl = `/fonts/${finalPath}`;
                
                Logger.debug('FONT_SERVICE', '� 폰트 URL 생성', { 
                    fontUrl, 
                    finalPath,
                    family: font.family 
                });

                Logger.debug('FONT_SERVICE', '🔗 Font URL mapping', {
                    originalPath: font.filePath,
                    relativePath: finalPath,
                    fontUrl,
                    family: font.family,
                    format
                });

                // 🔥 블랙리스트된 폰트 제외 (OTS 에러 방지)
                const isBlacklisted = this.isBlacklistedFont(font.filePath);
                if (isBlacklisted) {
                    Logger.warn('FONT_SERVICE', `⚠️ 블랙리스트된 폰트 스킵: ${font.family}`, { 
                        filePath: font.filePath,
                        fileName: path.basename(font.filePath)
                    });
                    continue;
                }

                css.push(`
@font-face {
  font-family: "${font.family.replace(/[-_]/g, ' ')}";
  src: url("${fontUrl}") format("${format}");
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}`);
            }
        }

        return css.join('\n');
    }

    /**
     * 🔥 사용 가능한 폰트 목록 반환
     */
    public getAvailableFonts(): Array<{ value: string; label: string; category: string }> {
        const fonts: Array<{ value: string; label: string; category: string }> = [];

        for (const family of this.fontsCache.values()) {
            fonts.push({
                value: family.cssFamily,
                label: family.displayName,
                category: family.category
            });
        }

        // 카테고리별 정렬
        return fonts.sort((a, b) => {
            const categoryOrder = { korean: 1, japanese: 2, english: 3, system: 4 };
            const orderA = categoryOrder[a.category as keyof typeof categoryOrder] || 5;
            const orderB = categoryOrder[b.category as keyof typeof categoryOrder] || 5;

            if (orderA !== orderB) return orderA - orderB;
            return a.label.localeCompare(b.label);
        });
    }

    /**
     * 🔥 특정 폰트 패밀리 정보 조회
     */
    public getFontFamily(familyName: string): FontFamily | null {
        return this.fontsCache.get(familyName) || null;
    }

    /**
     * 🔥 폰트 서비스 리로드
     */
    public async reload(): Promise<void> {
        Logger.info('FONT_SERVICE', '🔄 폰트 서비스 리로드 시작');
        this.fontsCache.clear();
        this.isInitialized = false;
        await this.initialize();
        Logger.info('FONT_SERVICE', '✅ 폰트 서비스 리로드 완료');
    }

    /**
     * 🔥 캐시 클리어 (개발 모드 전용)
     */
    public clearCache(): void {
        Logger.info('FONT_SERVICE', '🗑️ 폰트 캐시 클리어');
        this.fontsCache.clear();
        this.isInitialized = false;
    }
}

export const fontService = FontService.getInstance();
export default fontService;
