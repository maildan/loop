/**
 * 🚀 Modern FontService for Electron + Vite
 * Dynamic font discovery and metadata extraction using opentype.js
 * Replaces static configuration with runtime font analysis
 */

import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { Logger } from '../../shared/logger';

// Dynamic import for opentype.js (ES module)
let opentype: any = null;

interface FontMetadata {
    familyName: string;
    styleName: string;
    weight: number;
    style: 'normal' | 'italic' | 'oblique';
    isVariable: boolean;
    format: 'ttf' | 'otf' | 'woff' | 'woff2';
    filePath: string;
    fileSize: number;
    glyphCount: number;
    hasKoreanGlyphs: boolean;
    hasJapaneseGlyphs: boolean;
    hasLatinGlyphs: boolean;
    error?: string;
}

interface FontFamily {
    name: string;
    displayName: string;
    category: 'korean' | 'japanese' | 'english' | 'mixed' | 'unknown';
    variants: FontMetadata[];
    cssFamily: string;
    reliability: 'high' | 'medium' | 'low';
}

interface FontDiscoveryStats {
    totalFiles: number;
    parsedFiles: number;
    failedFiles: number;
    blacklistedFiles: number;
    families: number;
    variants: number;
}

class ModernFontService {
    private static instance: ModernFontService;
    private fontFamilies: Map<string, FontFamily> = new Map();
    private fontCache: Map<string, FontMetadata> = new Map();
    private blacklistedFiles = new Set<string>();
    private fontsPath: string;
    private isInitialized = false;

    private constructor() {
        // Electron + Vite: public/fonts 폴더가 올바른 위치
        this.fontsPath = path.join(process.cwd(), 'public', 'fonts');
    }

    public static getInstance(): ModernFontService {
        if (!ModernFontService.instance) {
            ModernFontService.instance = new ModernFontService();
        }
        return ModernFontService.instance;
    }

    /**
     * 🚀 Initialize font service with dynamic discovery
     */
    public async initialize(): Promise<FontDiscoveryStats> {
        if (this.isInitialized && process.env.NODE_ENV === 'production') {
            Logger.debug('MODERN_FONT', 'Font service already initialized');
            return this.getStats();
        }

        try {
            // Load opentype.js dynamically
            await this.loadOpenType();

            Logger.info('MODERN_FONT', '🚀 Starting modern font discovery', {
                fontsPath: this.fontsPath,
                exists: existsSync(this.fontsPath),
                NODE_ENV: process.env.NODE_ENV
            });

            const stats = await this.discoverFonts();
            this.isInitialized = true;

            Logger.info('MODERN_FONT', '✅ Font discovery completed', stats);
            return stats;

        } catch (error) {
            Logger.error('MODERN_FONT', 'Font service initialization failed', error);
            throw error;
        }
    }

    /**
     * 🔧 Dynamically load opentype.js
     */
    private async loadOpenType(): Promise<void> {
        try {
            if (!opentype) {
                // Dynamic import for ES module compatibility
                const opentypeModule = await import('opentype.js');
                opentype = opentypeModule.default || opentypeModule;
                Logger.debug('MODERN_FONT', 'opentype.js loaded successfully');
            }
        } catch (error) {
            Logger.error('MODERN_FONT', 'Failed to load opentype.js', error);
            throw new Error('opentype.js is required for font analysis');
        }
    }

    /**
     * 🔍 Discover and analyze all font files
     */
    private async discoverFonts(): Promise<FontDiscoveryStats> {
        const stats: FontDiscoveryStats = {
            totalFiles: 0,
            parsedFiles: 0,
            failedFiles: 0,
            blacklistedFiles: 0,
            families: 0,
            variants: 0
        };

        this.fontFamilies.clear();
        this.fontCache.clear();
        this.blacklistedFiles.clear();

        if (!existsSync(this.fontsPath)) {
            Logger.warn('MODERN_FONT', 'Fonts directory does not exist', { fontsPath: this.fontsPath });
            return stats;
        }

        // Scan all font files recursively
        const fontFiles = await this.scanFontFiles(this.fontsPath);
        stats.totalFiles = fontFiles.length;

        Logger.info('MODERN_FONT', `Found ${fontFiles.length} font files`);

        // Analyze each font file
        for (const filePath of fontFiles) {
            try {
                const metadata = await this.analyzeFontFile(filePath);
                if (metadata) {
                    if (metadata.error) {
                        // Dynamic blacklisting based on actual errors
                        this.blacklistedFiles.add(filePath);
                        stats.blacklistedFiles++;
                        Logger.warn('MODERN_FONT', `Blacklisted font due to error: ${path.basename(filePath)}`, {
                            error: metadata.error
                        });
                    } else {
                        this.fontCache.set(filePath, metadata);
                        stats.parsedFiles++;
                        Logger.debug('MODERN_FONT', `Successfully analyzed: ${metadata.familyName}`, {
                            weight: metadata.weight,
                            style: metadata.style,
                            glyphs: metadata.glyphCount
                        });
                    }
                } else {
                    stats.failedFiles++;
                }
            } catch (error) {
                stats.failedFiles++;
                Logger.warn('MODERN_FONT', `Failed to analyze font: ${path.basename(filePath)}`, error);
            }
        }

        // Group fonts into families
        this.groupFontsByFamily();
        stats.families = this.fontFamilies.size;
        stats.variants = Array.from(this.fontFamilies.values())
            .reduce((total, family) => total + family.variants.length, 0);

        return stats;
    }

    /**
     * 📁 Recursively scan for font files
     */
    private async scanFontFiles(dirPath: string): Promise<string[]> {
        const fontFiles: string[] = [];
        const supportedExtensions = ['.ttf', '.otf', '.woff', '.woff2'];

        async function scanRecursive(currentPath: string): Promise<void> {
            try {
                const items = await fs.readdir(currentPath, { withFileTypes: true });

                for (const item of items) {
                    const itemPath = path.join(currentPath, item.name);

                    if (item.isDirectory() && !item.name.startsWith('.')) {
                        await scanRecursive(itemPath);
                    } else if (item.isFile()) {
                        const ext = path.extname(item.name).toLowerCase();
                        if (supportedExtensions.includes(ext)) {
                            fontFiles.push(itemPath);
                        }
                    }
                }
            } catch (error) {
                Logger.warn('MODERN_FONT', `Failed to scan directory: ${currentPath}`, error);
            }
        }

        await scanRecursive(dirPath);
        return fontFiles;
    }

    /**
     * 🔬 Analyze individual font file using opentype.js
     */
    private async analyzeFontFile(filePath: string): Promise<FontMetadata | null> {
        try {
            const buffer = await fs.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const stats = await fs.stat(filePath);

            let font: any;
            try {
                // Handle WOFF2 decompression if needed
                if (ext === '.woff2') {
                    // For now, mark as requiring special handling
                    Logger.debug('MODERN_FONT', `WOFF2 font requires decompression: ${path.basename(filePath)}`);
                }

                font = opentype.parse(buffer.buffer || buffer, { lowMemory: true });
            } catch (parseError) {
                const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
                return {
                    familyName: 'Unknown',
                    styleName: 'Unknown',
                    weight: 400,
                    style: 'normal',
                    isVariable: false,
                    format: ext.slice(1) as any,
                    filePath,
                    fileSize: stats.size,
                    glyphCount: 0,
                    hasKoreanGlyphs: false,
                    hasJapaneseGlyphs: false,
                    hasLatinGlyphs: false,
                    error: `Parse error: ${errorMessage}`
                };
            }

            // Extract font metadata
            const familyName = this.extractFamilyName(font);
            const styleName = this.extractStyleName(font);
            const weight = this.extractWeight(font, styleName);
            const style = this.extractStyle(font, styleName);
            const isVariable = this.isVariableFont(font);

            // Analyze glyph coverage
            const glyphAnalysis = this.analyzeGlyphCoverage(font);

            return {
                familyName,
                styleName,
                weight,
                style,
                isVariable,
                format: ext.slice(1) as any,
                filePath,
                fileSize: stats.size,
                glyphCount: font.numGlyphs || 0,
                hasKoreanGlyphs: glyphAnalysis.korean,
                hasJapaneseGlyphs: glyphAnalysis.japanese,
                hasLatinGlyphs: glyphAnalysis.latin
            };

        } catch (error) {
            Logger.warn('MODERN_FONT', `Font analysis failed: ${path.basename(filePath)}`, error);
            return null;
        }
    }

    /**
     * 📝 Extract family name from font metadata
     */
    private extractFamilyName(font: any): string {
        try {
            // Try different name sources in order of preference
            const names = font.names;
            return names.fontFamily?.en || 
                   names.preferredFamily?.en ||
                   names.fullName?.en ||
                   'Unknown Font';
        } catch {
            return 'Unknown Font';
        }
    }

    /**
     * 🎨 Extract style name from font metadata
     */
    private extractStyleName(font: any): string {
        try {
            const names = font.names;
            return names.fontSubfamily?.en ||
                   names.preferredSubfamily?.en ||
                   'Regular';
        } catch {
            return 'Regular';
        }
    }

    /**
     * ⚖️ Extract actual font weight from metadata
     */
    private extractWeight(font: any, styleName: string): number {
        try {
            // Use OS/2 table weight class if available
            if (font.tables?.os2?.usWeightClass) {
                return font.tables.os2.usWeightClass;
            }

            // Fallback to style name parsing
            return this.parseWeightFromStyleName(styleName);
        } catch {
            return 400; // Default weight
        }
    }

    /**
     * 🔤 Extract font style from metadata
     */
    private extractStyle(font: any, styleName: string): 'normal' | 'italic' | 'oblique' {
        try {
            // Check OS/2 table selection flags
            if (font.tables?.os2?.fsSelection) {
                const selection = font.tables.os2.fsSelection;
                if (selection & 1) return 'italic'; // Italic bit
                if (selection & 512) return 'oblique'; // Oblique bit
            }

            // Fallback to style name parsing
            const lowerStyle = styleName.toLowerCase();
            if (lowerStyle.includes('italic')) return 'italic';
            if (lowerStyle.includes('oblique')) return 'oblique';
            
            return 'normal';
        } catch {
            return 'normal';
        }
    }

    /**
     * 🔄 Check if font is variable
     */
    private isVariableFont(font: any): boolean {
        try {
            return !!(font.tables?.fvar || font.tables?.gvar);
        } catch {
            return false;
        }
    }

    /**
     * 🌐 Analyze glyph coverage for language support
     */
    private analyzeGlyphCoverage(font: any): { korean: boolean; japanese: boolean; latin: boolean } {
        try {
            const cmap = font.tables?.cmap;
            if (!cmap) return { korean: false, japanese: false, latin: false };

            // Sample character ranges for detection
            const koreanRange = [0xAC00, 0xD7AF]; // Hangul Syllables
            const japaneseRange = [0x3040, 0x309F]; // Hiragana
            const latinRange = [0x0041, 0x005A]; // Basic Latin A-Z

            const hasKorean = this.hasCharactersInRange(cmap, koreanRange[0]!, koreanRange[1]!);
            const hasJapanese = this.hasCharactersInRange(cmap, japaneseRange[0]!, japaneseRange[1]!);
            const hasLatin = this.hasCharactersInRange(cmap, latinRange[0]!, latinRange[1]!);

            return { korean: hasKorean, japanese: hasJapanese, latin: hasLatin };
        } catch {
            return { korean: false, japanese: false, latin: false };
        }
    }

    /**
     * 🔍 Check if font has characters in Unicode range
     */
    private hasCharactersInRange(cmap: any, start: number, end: number): boolean {
        try {
            // Check a sample of characters in the range
            const sampleSize = Math.min(10, end - start + 1);
            const step = Math.floor((end - start) / sampleSize);
            
            for (let i = start; i <= end; i += step) {
                if (cmap.glyphIndexMap && cmap.glyphIndexMap[i]) {
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }

    /**
     * ⚖️ Parse weight from style name (fallback method)
     */
    private parseWeightFromStyleName(styleName: string): number {
        const weightMapping: Record<string, number> = {
            'thin': 100,
            'hairline': 100,
            'extralight': 200,
            'ultralight': 200,
            'light': 300,
            'regular': 400,
            'normal': 400,
            'medium': 500,
            'semibold': 600,
            'demibold': 600,
            'bold': 700,
            'extrabold': 800,
            'ultrabold': 800,
            'black': 900,
            'heavy': 900
        };

        const lowerStyle = styleName.toLowerCase();
        for (const [keyword, weight] of Object.entries(weightMapping)) {
            if (lowerStyle.includes(keyword)) {
                return weight;
            }
        }

        return 400; // Default weight
    }

    /**
     * 👥 Smart font family grouping - consolidates font variants into families
     * 🚀 Enhanced algorithm: NanumGothic + NanumGothicBold → NanumGothic family
     */
    private groupFontsByFamily(): void {
        const families = new Map<string, FontMetadata[]>();

        // 🔥 Step 1: Smart grouping by extracting base family names
        for (const metadata of this.fontCache.values()) {
            const baseName = this.extractBaseFamilyName(metadata.familyName);
            const familyKey = baseName.toLowerCase().trim();
            
            if (!families.has(familyKey)) {
                families.set(familyKey, []);
            }
            families.get(familyKey)!.push(metadata);
        }

        // 🔥 Step 2: Create consolidated FontFamily objects
        for (const [familyKey, variants] of families) {
            if (variants.length === 0) continue;
            
            // Find the most representative variant (usually Regular or the first one)
            const representativeVariant = this.findRepresentativeVariant(variants);
            const baseName = this.extractBaseFamilyName(representativeVariant.familyName);
            const category = this.determineFontCategory(variants);
            const displayName = this.generateDisplayName(baseName, category);
            const cssFamily = this.generateCSSFontFamily(baseName, category);
            const reliability = this.assessReliability(variants);

            this.fontFamilies.set(familyKey, {
                name: baseName,
                displayName,
                category,
                variants: variants.sort((a, b) => a.weight - b.weight), // Sort by weight
                cssFamily,
                reliability
            });

            Logger.debug('MODERN_FONT', `Smart grouped family: ${baseName}`, {
                variantCount: variants.length,
                weights: variants.map(v => v.weight),
                originalNames: variants.map(v => v.familyName)
            });
        }
    }

    /**
     * 🎯 Extract base family name from font name
     * Examples:
     * - "NanumGothicExtraBold" → "NanumGothic" 
     * - "Pretendard-Bold" → "Pretendard"
     * - "AppleSDGothicNeo-Regular" → "Apple SD Gothic Neo"
     * - "GangwonEduAll Bold" → "Gangwon Edu" (🔥 Enhanced for Korean fonts)
     */
    private extractBaseFamilyName(fontName: string): string {
        // 🔥 Special handling for Korean font families first
        // Define regex patterns for Korean fonts
        const koreanPatterns = [
            { pattern: /^GangwonEdu(All|Power|Saeeum|HyeonokT|Hyeonok)/i, baseName: 'Gangwon Edu' },
            { pattern: /^NanumGothic/i, baseName: 'Nanum Gothic' },
            { pattern: /^Pretendard/i, baseName: 'Pretendard' }
        ];

        // Check Korean patterns first
        for (const { pattern, baseName } of koreanPatterns) {
            if (pattern.test(fontName)) {
                Logger.debug('MODERN_FONT', `Korean font pattern matched: "${fontName}" → "${baseName}"`);
                return baseName;
            }
        }

        // Weight keywords to remove (order matters - longer first)
        const weightKeywords = [
            'ExtraBlack', 'UltraBlack', 'Heavy',
            'ExtraBold', 'UltraBold', 'ExtraDemi', 'DemiBold', 'SemiBold',
            'Bold', 'Black', 'Dark', 'Thick',
            'ExtraLight', 'UltraLight', 'Thin', 'Light',
            'Regular', 'Normal', 'Medium', 'Book',
            // Korean weight keywords
            '세미볼드', '데미볼드', '볼드', '굵은', '굵게', '진하게',
            '가는', '얇은', '세미라이트', '라이트', '보통', '레귤러'
        ];

        // Style keywords to remove  
        const styleKeywords = [
            'Condensed', 'Extended', 'Expanded', 'Narrow', 'Wide',
            'Italic', 'Oblique', 'Slanted',
            'Rounded', 'Display', 'Text', 'Caption', 'Headline',
            // 🔥 Enhanced: Korean font subfamily keywords
            'All', 'Power', 'Saeeum', 'HyeonokT', 'Hyeonok'
        ];

        let baseName = fontName;

        // Remove weight keywords
        for (const keyword of weightKeywords) {
            const regex = new RegExp(`[-_\\s]?${keyword}$`, 'i');
            baseName = baseName.replace(regex, '');
            
            // Also try removing from middle with delimiters
            const middleRegex = new RegExp(`[-_\\s]${keyword}[-_\\s]`, 'i');
            baseName = baseName.replace(middleRegex, '-');
        }

        // Remove style keywords
        for (const keyword of styleKeywords) {
            const regex = new RegExp(`[-_\\s]?${keyword}$`, 'i');
            baseName = baseName.replace(regex, '');
        }

        // Clean up delimiters and normalize
        baseName = baseName
            .replace(/[-_]+/g, ' ')  // Replace hyphens/underscores with spaces
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Split camelCase
            .replace(/\s+/g, ' ')  // Normalize multiple spaces
            .trim();

        // Handle special cases
        const specialMappings: Record<string, string> = {
            'Apple SD Gothic Neo': 'Apple SD Gothic Neo',
            'SF Pro Display': 'SF Pro Display',
            'SF Pro Text': 'SF Pro Text',
            'Apple Color Emoji': 'Apple Color Emoji',
            'Helvetica Neue': 'Helvetica Neue',
            'Times New Roman': 'Times New Roman',
            'Courier New': 'Courier New'
        };

        const normalized = specialMappings[baseName] || baseName;
        
        Logger.debug('MODERN_FONT', `Base name extraction: "${fontName}" → "${normalized}"`);
        return normalized;
    }

    /**
     * 🏆 Find most representative variant (preferably Regular weight)
     */
    private findRepresentativeVariant(variants: FontMetadata[]): FontMetadata {
        // First preference: weight 400 (Regular)
        const regular = variants.find(v => v.weight === 400);
        if (regular) return regular;

        // Second preference: styleName contains "Regular" or "Normal"
        const regularByName = variants.find(v => 
            /regular|normal|book/i.test(v.styleName)
        );
        if (regularByName) return regularByName;

        // Third preference: closest to 400 weight
        const sorted = [...variants].sort((a, b) => 
            Math.abs(a.weight - 400) - Math.abs(b.weight - 400)
        );
        
        return sorted[0] || variants[0]!;
    }

    /**
     * 🏷️ Determine font category based on glyph coverage
     */
    private determineFontCategory(variants: FontMetadata[]): 'korean' | 'japanese' | 'english' | 'mixed' | 'unknown' {
        let hasKorean = false;
        let hasJapanese = false;
        let hasLatin = false;

        for (const variant of variants) {
            if (variant.hasKoreanGlyphs) hasKorean = true;
            if (variant.hasJapaneseGlyphs) hasJapanese = true;
            if (variant.hasLatinGlyphs) hasLatin = true;
        }

        if (hasKorean && hasJapanese) return 'mixed';
        if (hasKorean) return 'korean';
        if (hasJapanese) return 'japanese';
        if (hasLatin) return 'english';
        
        return 'unknown';
    }

    /**
     * 📛 Generate display name
     */
    private generateDisplayName(familyName: string, category: string): string {
        const specialNames: Record<string, string> = {
            'Pretendard': 'Pretendard (프리텐다드)',
            'Noto Sans KR': 'Noto Sans 한국어',
            'Noto Sans JP': 'Noto Sans 日本語',
            'SF Pro Display': 'SF Pro Display'
        };

        return specialNames[familyName] || familyName;
    }

    /**
     * 🎨 Generate CSS font-family string
     */
    private generateCSSFontFamily(familyName: string, category: string): string {
        const fallbacks: Record<string, string[]> = {
            korean: ['-apple-system', 'BlinkMacSystemFont', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
            japanese: ['-apple-system', 'BlinkMacSystemFont', '"Hiragino Kaku Gothic ProN"', '"Noto Sans JP"', 'sans-serif'],
            english: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
            mixed: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
            unknown: ['system-ui', 'sans-serif']
        };

        const fallbackList = fallbacks[category] || fallbacks.unknown || ['system-ui', 'sans-serif'];
        return `"${familyName}", ${fallbackList.join(', ')}`;
    }

    /**
     * 🎯 Assess font reliability
     */
    private assessReliability(variants: FontMetadata[]): 'high' | 'medium' | 'low' {
        // High: Multiple variants, good glyph coverage, no errors
        // Medium: Some variants or coverage
        // Low: Single variant or limited coverage

        const hasMultipleWeights = variants.length > 1;
        const hasGoodCoverage = variants.some(v => v.glyphCount > 1000);
        const hasNoErrors = variants.every(v => !v.error);

        if (hasMultipleWeights && hasGoodCoverage && hasNoErrors) return 'high';
        if (hasGoodCoverage && hasNoErrors) return 'medium';
        return 'low';
    }

    /**
     * 📊 Get discovery statistics
     */
    private getStats(): FontDiscoveryStats {
        return {
            totalFiles: this.fontCache.size + this.blacklistedFiles.size,
            parsedFiles: this.fontCache.size,
            failedFiles: 0,
            blacklistedFiles: this.blacklistedFiles.size,
            families: this.fontFamilies.size,
            variants: Array.from(this.fontFamilies.values())
                .reduce((total, family) => total + family.variants.length, 0)
        };
    }

    /**
     * 🛤️ Generate optimized font URL for Electron + Vite
     */
    private generateFontUrl(variant: FontMetadata): string {
        const relativePath = path.relative(this.fontsPath, variant.filePath).replace(/\\/g, '/');
        
        // Electron + Vite path resolution strategy
        if (process.env.NODE_ENV === 'development') {
            // Development: Use dev server path
            return `/fonts/${relativePath}`;
        } else {
            // Production: Check if font exists in bundled location
            const bundledPath = `./fonts/${relativePath}`;
            const fallbackPath = `/fonts/${relativePath}`;
            
            // For production builds, prefer bundled path but provide fallback
            return bundledPath;
        }
    }

    /**
     * 🎨 Generate @font-face CSS with modern best practices
     */
    public generateFontFaceCSS(): string {
        const css: string[] = [];

        for (const family of this.fontFamilies.values()) {
            // Only include reliable fonts
            if (family.reliability === 'low') {
                Logger.debug('MODERN_FONT', `Skipping low reliability font: ${family.name}`);
                continue;
            }

            for (const variant of family.variants) {
                if (variant.error) continue; // Skip fonts with errors

                const fontUrl = this.generateFontUrl(variant);
                
                const formatMap: Record<string, string> = {
                    'woff2': 'woff2',
                    'woff': 'woff',
                    'ttf': 'truetype',
                    'otf': 'opentype'
                };

                // Modern CSS with preload hints and optimizations
                css.push(`
@font-face {
  font-family: "${variant.familyName}";
  src: url("${fontUrl}") format("${formatMap[variant.format] || 'truetype'}");
  font-weight: ${variant.weight};
  font-style: ${variant.style};
  font-display: swap;
  ${variant.isVariable ? 'font-variation-settings: normal;' : ''}
  /* Font size: ${(variant.fileSize / 1024).toFixed(1)}KB, Glyphs: ${variant.glyphCount} */
}`);
            }
        }

        Logger.info('MODERN_FONT', `Generated CSS for ${this.fontFamilies.size} font families`, {
            cssLength: css.join('\n').length,
            totalVariants: Array.from(this.fontFamilies.values()).reduce((sum, family) => sum + family.variants.length, 0)
        });

        return css.join('\n');
    }

    /**
     * 📋 Get available fonts for UI
     */
    public getAvailableFonts(): Array<{ value: string; label: string; category: string; reliability: string }> {
        const fonts: Array<{ value: string; label: string; category: string; reliability: string }> = [];

        for (const family of this.fontFamilies.values()) {
            fonts.push({
                value: family.cssFamily,
                label: family.displayName,
                category: family.category,
                reliability: family.reliability
            });
        }

        // Sort by category, then reliability, then name
        return fonts.sort((a, b) => {
            const categoryOrder = { korean: 1, japanese: 2, english: 3, mixed: 4, unknown: 5 };
            const reliabilityOrder = { high: 1, medium: 2, low: 3 };
            
            const catA = categoryOrder[a.category as keyof typeof categoryOrder] || 6;
            const catB = categoryOrder[b.category as keyof typeof categoryOrder] || 6;
            
            if (catA !== catB) return catA - catB;
            
            const relA = reliabilityOrder[a.reliability as keyof typeof reliabilityOrder] || 4;
            const relB = reliabilityOrder[b.reliability as keyof typeof reliabilityOrder] || 4;
            
            if (relA !== relB) return relA - relB;
            
            return a.label.localeCompare(b.label);
        });
    }

    /**
     * 🔍 Get font family details
     */
    public getFontFamily(familyName: string): FontFamily | null {
        return this.fontFamilies.get(familyName.toLowerCase()) || null;
    }

    /**
     * 🗑️ Get blacklisted fonts
     */
    public getBlacklistedFonts(): string[] {
        return Array.from(this.blacklistedFiles);
    }

    /**
     * 🔄 Reload font service
     */
    public async reload(): Promise<FontDiscoveryStats> {
        Logger.info('MODERN_FONT', 'Reloading font service');
        this.isInitialized = false;
        return this.initialize();
    }

    /**
     * 🧹 Clear all caches
     */
    public clearCache(): void {
        this.fontFamilies.clear();
        this.fontCache.clear();
        this.blacklistedFiles.clear();
        this.isInitialized = false;
    }
}

export const modernFontService = ModernFontService.getInstance();
export default modernFontService;