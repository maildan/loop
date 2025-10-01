
/**
 * 🔥 폰트 서비스 - 사전 변환된 WOFF2 매니페스트 기반 로더
 * 런타임 변환/스캔을 제거하고 즉시 사용 가능한 폰트 메타데이터를 제공
 */

import { app, protocol } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { createRequire } from 'module';
import { safePathResolve } from '../../shared/utils/pathSecurity';
import { Logger } from '../../shared/logger';
import type {
    FontCategory,
    FontManifest,
    FontFamilyManifestEntry,
    FontVariantManifestEntry,
    FontOption
} from '../../shared/fonts/types';
import type { ProtocolRequest } from 'electron';
import {
    sanitizeId,
    determineFontCategory,
    createDisplayName,
    inferWeight,
    inferStyle,
    deriveVariantLabel,
    generateCssFontFamily,
    buildVariantId
} from '../../shared/fonts/utils';

const nodeRequire = createRequire(__filename);

type FontFileFormat = 'woff2' | 'woff' | 'ttf' | 'otf' | 'unknown';

interface PackageFontVariantDefinition {
    module: string;
    weight: string;
    style?: 'normal' | 'italic';
    label?: string;
    uniqueId?: string;
}

interface PackageFontFamilyDefinition {
    id: string;
    displayName: string;
    category: FontCategory;
    cssFamily?: string;
    variants: PackageFontVariantDefinition[];
}

interface SystemFontDefinition {
    id: string;
    displayName: string;
    category: FontCategory;
    cssFamily: string;
}

const PACKAGE_FONT_FAMILIES: PackageFontFamilyDefinition[] = [
    {
        id: 'pretendard',
        displayName: 'Pretendard',
        category: 'korean',
        variants: [
            { weight: '100', label: 'Thin', module: 'pretendard/dist/web/static/woff2/Pretendard-Thin.woff2' },
            { weight: '200', label: 'ExtraLight', module: 'pretendard/dist/web/static/woff2/Pretendard-ExtraLight.woff2' },
            { weight: '300', label: 'Light', module: 'pretendard/dist/web/static/woff2/Pretendard-Light.woff2' },
            { weight: '400', label: 'Regular', module: 'pretendard/dist/web/static/woff2/Pretendard-Regular.woff2' },
            { weight: '500', label: 'Medium', module: 'pretendard/dist/web/static/woff2/Pretendard-Medium.woff2' },
            { weight: '600', label: 'SemiBold', module: 'pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2' },
            { weight: '700', label: 'Bold', module: 'pretendard/dist/web/static/woff2/Pretendard-Bold.woff2' },
            { weight: '800', label: 'ExtraBold', module: 'pretendard/dist/web/static/woff2/Pretendard-ExtraBold.woff2' },
            { weight: '900', label: 'Black', module: 'pretendard/dist/web/static/woff2/Pretendard-Black.woff2' }
        ]
    },
    {
        id: 'pretendard-jp',
        displayName: 'Pretendard JP',
        category: 'japanese',
        variants: [
            { weight: '100', label: 'Thin', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-Thin.woff2' },
            { weight: '200', label: 'ExtraLight', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-ExtraLight.woff2' },
            { weight: '300', label: 'Light', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-Light.woff2' },
            { weight: '400', label: 'Regular', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-Regular.woff2' },
            { weight: '500', label: 'Medium', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-Medium.woff2' },
            { weight: '600', label: 'SemiBold', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-SemiBold.woff2' },
            { weight: '700', label: 'Bold', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-Bold.woff2' },
            { weight: '800', label: 'ExtraBold', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-ExtraBold.woff2' },
            { weight: '900', label: 'Black', module: 'pretendard-jp/dist/web/static/woff2/PretendardJP-Black.woff2' }
        ]
    },
    {
        id: 'nanum-gothic',
        displayName: 'Nanum Gothic (나눔고딕)',
        category: 'korean',
        variants: [
            { weight: '400', label: 'Regular', module: '@fontsource/nanum-gothic/files/nanum-gothic-korean-400-normal.woff2' },
            { weight: '700', label: 'Bold', module: '@fontsource/nanum-gothic/files/nanum-gothic-korean-700-normal.woff2' },
            { weight: '800', label: 'ExtraBold', module: '@fontsource/nanum-gothic/files/nanum-gothic-korean-800-normal.woff2' }
        ]
    },
    {
        id: 'noto-sans-kr',
        displayName: 'Noto Sans KR',
        category: 'korean',
        variants: [
            { weight: '100', label: 'Thin', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-100-normal.woff2' },
            { weight: '200', label: 'ExtraLight', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-200-normal.woff2' },
            { weight: '300', label: 'Light', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-300-normal.woff2' },
            { weight: '400', label: 'Regular', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-400-normal.woff2' },
            { weight: '500', label: 'Medium', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-500-normal.woff2' },
            { weight: '600', label: 'SemiBold', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-600-normal.woff2' },
            { weight: '700', label: 'Bold', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-700-normal.woff2' },
            { weight: '800', label: 'ExtraBold', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-800-normal.woff2' },
            { weight: '900', label: 'Black', module: '@fontsource/noto-sans-kr/files/noto-sans-kr-korean-900-normal.woff2' }
        ]
    },
    {
        id: 'noto-sans-jp',
        displayName: 'Noto Sans JP',
        category: 'japanese',
        variants: [
            { weight: '100', label: 'Thin', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-100-normal.woff2' },
            { weight: '200', label: 'ExtraLight', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-200-normal.woff2' },
            { weight: '300', label: 'Light', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-300-normal.woff2' },
            { weight: '400', label: 'Regular', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff2' },
            { weight: '500', label: 'Medium', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-500-normal.woff2' },
            { weight: '600', label: 'SemiBold', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-600-normal.woff2' },
            { weight: '700', label: 'Bold', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff2' },
            { weight: '800', label: 'ExtraBold', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-800-normal.woff2' },
            { weight: '900', label: 'Black', module: '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-900-normal.woff2' }
        ]
    },
    {
        id: 'gangwon-edu-bold',
        displayName: '강원교육모두체 Bold',
        category: 'korean',
        variants: [
            { weight: '700', label: 'Bold', module: '@noonnu/gangwon-edu-otf-bold-a/fonts/gangwoneduotfbolda-normal.woff' }
        ]
    },
    {
        id: 'gangwon-edu-saeeum',
        displayName: '강원교육새음체 Medium',
        category: 'korean',
        variants: [
            { weight: '500', label: 'Medium', module: '@noonnu/gangwon-edu-saeeum-otf-medium-a/fonts/gangwonedusaeeumotfmediuma-normal.woff' }
        ]
    }
];

const SYSTEM_FONT_FAMILIES: SystemFontDefinition[] = [
    {
        id: 'system-ui',
        displayName: 'System UI',
        category: 'system',
        cssFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    {
        id: 'sf-pro-display',
        displayName: 'SF Pro Display',
        category: 'english',
        cssFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    },
    {
        id: 'arial',
        displayName: 'Arial',
        category: 'english',
        cssFamily: 'Arial, Helvetica, sans-serif'
    },
    {
        id: 'times-new-roman',
        displayName: 'Times New Roman',
        category: 'english',
        cssFamily: '"Times New Roman", Times, serif'
    },
    {
        id: 'verdana',
        displayName: 'Verdana',
        category: 'english',
        cssFamily: 'Verdana, Geneva, sans-serif'
    },
    {
        id: 'calibri',
        displayName: 'Calibri',
        category: 'english',
        cssFamily: 'Calibri, "Segoe UI", sans-serif'
    },
    {
        id: 'roboto',
        displayName: 'Roboto',
        category: 'english',
        cssFamily: 'Roboto, "Noto Sans", sans-serif'
    },
    {
        id: 'inter',
        displayName: 'Inter',
        category: 'english',
        cssFamily: 'Inter, "Helvetica Neue", Arial, sans-serif'
    },
    {
        id: 'ms-gothic',
        displayName: 'MS Gothic',
        category: 'japanese',
        cssFamily: '"MS Gothic", "MS PGothic", "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic Pro", "Noto Sans JP", sans-serif'
    },
    {
        id: 'ms-mincho',
        displayName: 'MS Mincho',
        category: 'japanese',
        cssFamily: '"MS Mincho", "MS PMincho", "Hiragino Mincho Pro", "ヒラギノ明朝 ProN", "Noto Serif JP", serif'
    }
];

interface FontInfo {
    family: string;
    weight: string;
    style: 'normal' | 'italic';
    filePath: string;
    displayName: string;
    category: FontCategory;
    variantId: string;
    format: FontFileFormat;
    label?: string;
}

interface FontFamily {
    name: string;
    displayName: string;
    category: FontCategory;
    variants: FontInfo[];
    cssFamily: string;
    isSystem: boolean;
}

interface FontDisplayMetadataOverride {
    displayName?: string;
    category?: FontCategory;
}

interface VariantRecord {
    filePath: string;
    format: FontFileFormat;
}

class FontService {
    private static instance: FontService;

    private fontsCache: Map<string, FontFamily> = new Map();
    private variantIndex: Map<string, VariantRecord> = new Map();
    private manifestPath: string | null = null;
    private manifestDir: string | null = null;
    private initializePromise: Promise<void> | null = null;
    private isInitialized = false;
    private protocolRegistered = false;
    private protocolRegistrationPromise: Promise<void> | null = null;
    private displayMetadataOverrides: Map<string, FontDisplayMetadataOverride> = new Map();
    private directoryMetadataCache: Map<string, FontDisplayMetadataOverride | null> = new Map();

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

        if (this.initializePromise) {
            return this.initializePromise;
        }

        this.initializePromise = this.performInitialization()
            .then(() => {
                this.isInitialized = true;
                Logger.info('FONT_SERVICE', '✅ Font manifest loaded', {
                    families: Array.from(this.fontsCache.keys()),
                    manifest: this.manifestPath
                });
            })
            .catch(error => {
                Logger.error('FONT_SERVICE', 'Failed to load font manifest', error);
                this.initializePromise = null;
                throw error;
            });

        return this.initializePromise;
    }

    public async reload(): Promise<void> {
        this.isInitialized = false;
        this.initializePromise = null;
        this.fontsCache.clear();
        this.variantIndex.clear();
        this.displayMetadataOverrides.clear();
        this.directoryMetadataCache.clear();
        await this.initialize();
    }

    public async registerProtocol(): Promise<void> {
        if (this.protocolRegistered) {
            return;
        }

        if (this.protocolRegistrationPromise) {
            return this.protocolRegistrationPromise;
        }

        this.protocolRegistrationPromise = this.performProtocolRegistration()
            .then(() => {
                this.protocolRegistered = true;
            })
            .catch(error => {
                Logger.error('FONT_SERVICE', 'Failed to register loop-font protocol', error);
                throw error;
            })
            .finally(() => {
                this.protocolRegistrationPromise = null;
            });

        return this.protocolRegistrationPromise;
    }

    public getAvailableFonts(): FontOption[] {
        this.ensureInitialized();

        const fonts: FontOption[] = [];
        for (const family of this.fontsCache.values()) {
            fonts.push({
                value: family.cssFamily,
                label: family.displayName,
                category: family.category,
                source: family.isSystem ? 'system' : 'local'
            });
        }

        return fonts.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.label.localeCompare(b.label, 'ko');
        });
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
            if (family.isSystem) {
                continue;
            }
            for (const variant of family.variants) {
                                const cssFormat = this.getCssFontFormat(variant.format);
                                const srcValue = cssFormat
                                        ? `url("loop-font://${variant.variantId}") format("${cssFormat}")`
                                        : `url("loop-font://${variant.variantId}")`;
                css.push(`
@font-face {
  font-family: "${family.displayName}";
    src: ${srcValue};
  font-weight: ${variant.weight};
  font-style: ${variant.style};
  font-display: swap;
}`);
            }
        }

        return css.join('\n');
    }

    public async getFontBinary(variantId: string): Promise<{ data: ArrayBuffer; format: FontFileFormat } | null> {
        this.ensureInitialized();

        const normalizedId = this.normalizeVariantId(variantId);
        if (!normalizedId) {
            Logger.warn('FONT_SERVICE', 'Requested font variant without valid identifier', { variantId });
            return null;
        }

        const record = this.variantIndex.get(normalizedId);
        if (!record) {
            Logger.warn('FONT_SERVICE', 'Requested font variant not found', { variantId: normalizedId, rawVariantId: variantId });
            return null;
        }

        try {
            const buffer = await fs.readFile(record.filePath);
            const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
            return { data: arrayBuffer, format: record.format };
        } catch (error) {
            Logger.error('FONT_SERVICE', 'Failed to read font binary', { variantId, filePath: record.filePath, error });
            return null;
        }
    }

    private async performInitialization(): Promise<void> {
        try {
            await app.whenReady().catch(() => undefined);
        } catch {
            // ignore errors from whenReady in tests
        }

        const manifestPath = await this.resolveManifestPath();
        if (!manifestPath) {
            const loadedFromPackages = await this.loadFromPackageDefinitions();
            if (!loadedFromPackages) {
                Logger.warn('FONT_SERVICE', 'No font manifest found - falling back to asset discovery');
                await this.loadFromAssetDirectories();
            }
            this.manifestPath = null;
            this.manifestDir = null;
            return;
        }

        const manifest = await this.loadManifest(manifestPath);
        this.manifestPath = manifestPath;
        this.manifestDir = path.dirname(manifestPath);

        this.hydrateCaches(manifest);
    }

    private async resolveManifestPath(): Promise<string | null> {
        const triedPaths: string[] = [];
        const manifestFileName = 'fonts-manifest.json';

        const candidatePaths = Array.from(
            // 🔒 보안: 이 경로들은 Electron 표준 경로 + 상수만 사용 (사용자 입력 없음)
            // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
            new Set(
                [
                    process.env.LOOP_FONT_MANIFEST_PATH || null,
                    app.isPackaged ? path.join(app.getAppPath(), '..', manifestFileName) : null,
                    path.join(app.getAppPath(), manifestFileName),
                    process.resourcesPath ? path.join(process.resourcesPath, manifestFileName) : null,
                    path.join(process.cwd(), 'out', manifestFileName),
                    path.join(process.cwd(), 'resources', manifestFileName),
                    path.join(process.cwd(), 'dist', manifestFileName),
                    path.join(process.cwd(), manifestFileName),
                    path.join(process.cwd(), 'public', manifestFileName)
                ].filter((value): value is string => Boolean(value))
            )
        );

        for (const candidate of candidatePaths) {
            try {
                const stats = await fs.stat(candidate);
                if (stats.isFile()) {
                    if (candidate !== process.env.LOOP_FONT_MANIFEST_PATH) {
                        Logger.debug('FONT_SERVICE', 'Font manifest resolved', { candidate });
                    }
                    return candidate;
                }
            } catch {
                triedPaths.push(candidate);
            }
        }

        if (triedPaths.length > 0) {
            Logger.warn('FONT_SERVICE', 'Font manifest not found in any candidate paths', { triedPaths });
        }

        return null;
    }

    private async loadManifest(manifestPath: string): Promise<FontManifest> {
        const raw = await fs.readFile(manifestPath, 'utf8');
        let parsed: FontManifest;
        try {
            parsed = JSON.parse(raw) as FontManifest;
        } catch (error) {
            throw new Error(`Invalid font manifest JSON (${manifestPath}): ${String(error)}`);
        }

        if (!Array.isArray(parsed.families)) {
            throw new Error('Font manifest missing families array');
        }

        return parsed;
    }

    private hydrateCaches(manifest: FontManifest): void {
        if (!this.manifestDir) {
            throw new Error('Manifest directory not resolved');
        }

        const families: FontFamily[] = [];
        for (const familyEntry of manifest.families) {
            const family = this.createFamilyFromManifest(familyEntry);
            if (!family) {
                continue;
            }
            families.push(family);
        }

        this.storeFamilies(families);
    }

    private createFamilyFromManifest(entry: FontFamilyManifestEntry): FontFamily | null {
        if (!this.manifestDir) {
            return null;
        }

        const isSystem = Boolean(entry.isSystem);
        const variants: FontInfo[] = [];
        for (const variantEntry of entry.variants) {
            if (!variantEntry.file) {
                if (!isSystem) {
                    Logger.warn('FONT_SERVICE', 'Variant missing file path', {
                        family: entry.name,
                        variant: variantEntry.id
                    });
                }
                continue;
            }

            const resolvedPath = this.resolveVariantPath(variantEntry.file);
            if (!resolvedPath) {
                Logger.warn('FONT_SERVICE', 'Skipping variant with invalid path', {
                    family: entry.name,
                    variant: variantEntry.id,
                    file: variantEntry.file
                });
                continue;
            }

            const variantId = this.ensureVariantId(entry, variantEntry, resolvedPath);
            if (!variantId) {
                Logger.warn('FONT_SERVICE', 'Variant id could not be resolved', {
                    family: entry.name,
                    variant: variantEntry.id,
                    file: variantEntry.file
                });
                continue;
            }

            variants.push({
                family: entry.name,
                weight: variantEntry.weight,
                style: variantEntry.style,
                filePath: resolvedPath,
                displayName: entry.displayName,
                category: entry.category,
                variantId,
                format: this.determineFontFormat(resolvedPath),
                label: variantEntry.label
            });
        }

        if (variants.length === 0 && !isSystem) {
            Logger.warn('FONT_SERVICE', 'Family has no valid variants', { family: entry.name });
            return null;
        }

        return {
            name: entry.name,
            displayName: entry.displayName,
            category: entry.category,
            variants,
            cssFamily: entry.cssFamily,
            isSystem
        };
    }

    private resolveVariantPath(relativePath: string): string | null {
        if (!this.manifestDir) {
            return null;
        }

        const normalized = relativePath.replace(/\\/g, '/');
        const absolute = safePathResolve(this.manifestDir, normalized);

        if (!absolute) {
            Logger.warn('FONT_SERVICE', 'Blocked path traversal attempt in manifest', { relativePath });
            return null;
        }

        return absolute;
    }

    private ensureInitialized(): void {
        if (!this.isInitialized) {
            throw new Error('FontService has not been initialized yet. Call initialize() first.');
        }
    }

    private async loadFromAssetDirectories(): Promise<void> {
        const assetRoots = await this.resolveAssetRoots();
        await this.loadDisplayMetadata(assetRoots);
        const families: FontFamily[] = [];
        const seenFamilyIds = new Set<string>();

        for (const root of assetRoots) {
            let dirEntries: import('fs').Dirent[];
            try {
                dirEntries = await fs.readdir(root, { withFileTypes: true });
            } catch (error) {
                Logger.debug('FONT_SERVICE', 'Skipping font asset root', { root, error: (error as Error).message });
                continue;
            }

            for (const entry of dirEntries) {
                if (!entry.isDirectory()) {
                    continue;
                }

                const folderName = entry.name;
                if (!folderName || folderName.startsWith('.')) {
                    continue;
                }

                // 🔒 보안: root는 resolveAssetRoots()의 검증된 경로, folderName은 fs.readdir로 읽은 디렉토리명
                // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
                const absoluteDir = path.join(root, folderName);
                const family = await this.createFamilyFromDirectory(folderName, absoluteDir);
                if (!family) {
                    continue;
                }

                if (seenFamilyIds.has(family.name)) {
                    Logger.debug('FONT_SERVICE', 'Duplicate font family skipped from assets', { family: family.name, root });
                    continue;
                }

                families.push(family);
                seenFamilyIds.add(family.name);
            }
        }

        if (families.length === 0) {
            Logger.warn('FONT_SERVICE', 'No fonts discovered in asset directories', { assetRoots });
        }

        this.storeFamilies(families);
    }

    // 🔒 보안: 모든 경로는 Electron 표준 경로 + 환경변수 (신뢰할 수 있는 소스)
    // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
    private async resolveAssetRoots(): Promise<string[]> {
        const candidates = new Set<string>();
        const fromEnv = process.env.LOOP_FONT_ASSETS_DIR;
        if (fromEnv) {
            for (const segment of fromEnv.split(path.delimiter)) {
                if (segment.trim()) {
                    candidates.add(path.resolve(segment.trim()));
                }
            }
        }

        const pushCandidate = (candidate: string | null | undefined) => {
            if (!candidate) {
                return;
            }
            candidates.add(path.resolve(candidate));
        };

        pushCandidate(path.join(process.cwd(), 'public', 'assets', 'fonts'));
        pushCandidate(path.join(process.cwd(), 'assets', 'fonts'));
    pushCandidate(path.join(app.getAppPath(), 'assets', 'fonts'));
        pushCandidate(path.join(process.cwd(), 'resources', 'fonts-dist'));
        pushCandidate(path.join(process.cwd(), 'fonts-dist'));
        if (app.isPackaged) {
            pushCandidate(path.join(app.getAppPath(), '..', 'fonts-dist'));
        } else {
            pushCandidate(path.join(app.getAppPath(), 'resources', 'fonts-dist'));
        }
        if (process.resourcesPath) {
            pushCandidate(path.join(process.resourcesPath, 'fonts-dist'));
        }

        const resolvedRoots: string[] = [];
        for (const candidate of candidates) {
            try {
                const stats = await fs.stat(candidate);
                if (stats.isDirectory()) {
                    resolvedRoots.push(candidate);
                }
            } catch {
                // ignore missing paths
            }
        }

        return resolvedRoots;
    }

    private async createFamilyFromDirectory(folderName: string, absoluteDir: string): Promise<FontFamily | null> {
        let fileNames: string[];
        try {
            fileNames = await fs.readdir(absoluteDir);
        } catch (error) {
            Logger.debug('FONT_SERVICE', 'Failed to read font family directory', {
                directory: absoluteDir,
                error: (error as Error).message
            });
            return null;
        }

        const fontFiles = fileNames.filter(file => /\.(woff2?|ttf|otf)$/i.test(file));
        if (fontFiles.length === 0) {
            return null;
        }

        let familyId = sanitizeId(folderName);
        if (!familyId) {
            familyId = sanitizeId(path.basename(absoluteDir));
        }
        if (!familyId) {
            familyId = `family-${Date.now().toString(36)}`;
        }
        const metadata = await this.resolveDisplayMetadata(folderName, absoluteDir);
        const displayName = metadata.displayName?.trim() || createDisplayName(folderName);
        const category = metadata.category ?? determineFontCategory(displayName);
        const cssFamily = generateCssFontFamily(displayName);

        const variants: FontInfo[] = [];
        for (const fileName of fontFiles) {
            // 🔒 보안: absoluteDir은 검증된 폰트 디렉토리, fileName은 fs.readdir로 읽은 실제 파일명
            // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
            const absolutePath = path.join(absoluteDir, fileName);

            try {
                const stats = await fs.stat(absolutePath);
                if (!stats.isFile()) {
                    continue;
                }
            } catch (error) {
                Logger.debug('FONT_SERVICE', 'Skipping unreadable font file', {
                    file: absolutePath,
                    error: (error as Error).message
                });
                continue;
            }

            const weight = inferWeight(fileName);
            const style = inferStyle(fileName);
            const uniquePart = sanitizeId(fileName.replace(/\.[^.]+$/, '')) || `v${variants.length + 1}`;
            const variantId = this.normalizeVariantId(buildVariantId(familyId, weight, style, uniquePart));

            variants.push({
                family: familyId,
                weight,
                style,
                filePath: absolutePath,
                displayName,
                category,
                variantId,
                format: this.determineFontFormat(absolutePath),
                label: deriveVariantLabel(fileName)
            });
        }

        if (variants.length === 0) {
            return null;
        }

        variants.sort((a, b) => {
            const weightDelta = Number(a.weight) - Number(b.weight);
            if (weightDelta !== 0 && !Number.isNaN(weightDelta)) {
                return weightDelta;
            }
            return a.style.localeCompare(b.style);
        });

        return {
            name: familyId,
            displayName,
            category,
            variants,
            cssFamily,
            isSystem: false
        };
    }

    private storeFamilies(families: FontFamily[]): void {
        this.fontsCache.clear();
        this.variantIndex.clear();

        for (const family of families) {
            this.fontsCache.set(family.name, family);

            for (const variant of family.variants) {
                if (!variant.filePath) {
                    continue;
                }

                const normalizedId = this.normalizeVariantId(variant.variantId);
                if (!normalizedId) {
                    Logger.warn('FONT_SERVICE', 'Skipping variant with empty identifier during storage', {
                        family: family.name,
                        variantId: variant.variantId
                    });
                    continue;
                }

                variant.variantId = normalizedId;
                this.variantIndex.set(normalizedId, {
                    filePath: variant.filePath,
                    format: variant.format
                });
            }
        }
    }

    private normalizeVariantId(rawId: string | null | undefined): string {
        if (!rawId) {
            return '';
        }

        let value = rawId.replace(/^loop-font:\/\//i, '').trim();
        if (!value) {
            return '';
        }

    const [withoutQuery] = value.split(/[?#]/, 1);
    value = withoutQuery ?? '';
        value = value.replace(/^[\\/]+/, '').replace(/[\\/]+$/, '');
        if (!value) {
            return '';
        }

        let decoded = value;
        try {
            decoded = decodeURIComponent(value);
        } catch {
            decoded = value;
        }

        return decoded.toLowerCase();
    }

    private normalizeFamilyId(entry: FontFamilyManifestEntry): string {
        const candidates = [entry.id, entry.name, entry.displayName];
        for (const candidate of candidates) {
            if (!candidate) {
                continue;
            }
            const sanitized = sanitizeId(candidate);
            if (sanitized) {
                return sanitized;
            }
        }
        return 'font-family';
    }

    private ensureVariantId(
        entry: FontFamilyManifestEntry,
        variantEntry: FontVariantManifestEntry,
        resolvedPath: string
    ): string | null {
        const normalized = this.normalizeVariantId(variantEntry.id);
        if (normalized) {
            return normalized;
        }

        const familyId = this.normalizeFamilyId(entry);
        const sourceName = variantEntry.file
            ? path.basename(variantEntry.file).replace(/\.[^.]+$/, '')
            : path.basename(resolvedPath).replace(/\.[^.]+$/, '');
        const uniquePart = sanitizeId(sourceName) || `v${variantEntry.weight}-${variantEntry.style}`;
        const generated = buildVariantId(familyId, variantEntry.weight, variantEntry.style, uniquePart);
        const fallback = this.normalizeVariantId(generated);
        return fallback || null;
    }

    private determineFontFormat(filePath: string): FontFileFormat {
        const extension = path.extname(filePath).toLowerCase();
        switch (extension) {
            case '.woff2':
                return 'woff2';
            case '.woff':
                return 'woff';
            case '.ttf':
                return 'ttf';
            case '.otf':
                return 'otf';
            default:
                return 'unknown';
        }
    }

    private getCssFontFormat(format: FontFileFormat): string | null {
        switch (format) {
            case 'woff2':
            case 'woff':
                return format;
            case 'ttf':
                return 'truetype';
            case 'otf':
                return 'opentype';
            default:
                return null;
        }
    }

    private getMimeType(format: FontFileFormat): string {
        switch (format) {
            case 'woff2':
                return 'font/woff2';
            case 'woff':
                return 'font/woff';
            case 'ttf':
                return 'font/ttf';
            case 'otf':
                return 'font/otf';
            default:
                return 'application/octet-stream';
        }
    }

    private resolvePackageAsset(modulePath: string): string | null {
        if (!modulePath) {
            return null;
        }

        try {
            return nodeRequire.resolve(modulePath);
        } catch (error) {
            Logger.warn('FONT_SERVICE', 'Failed to resolve package font asset', {
                modulePath,
                error: (error as Error).message
            });
            return null;
        }
    }

    private createFamilyFromPackageDefinition(definition: PackageFontFamilyDefinition): FontFamily | null {
        const displayName = definition.displayName.trim();
        if (!displayName) {
            return null;
        }

        const category = definition.category ?? determineFontCategory(displayName);
        const cssFamily = definition.cssFamily?.trim() || generateCssFontFamily(displayName);
        const familyId = sanitizeId(definition.id || displayName) || sanitizeId(displayName) || `font-family-${Date.now().toString(36)}`;

        const variants: FontInfo[] = [];
        for (const variantDefinition of definition.variants) {
            const resolvedPath = this.resolvePackageAsset(variantDefinition.module);
            if (!resolvedPath) {
                continue;
            }

            const weight = variantDefinition.weight || inferWeight(resolvedPath);
            const style = variantDefinition.style ?? 'normal';
            const format = this.determineFontFormat(resolvedPath);
            const uniqueSource = variantDefinition.uniqueId || variantDefinition.label || path.basename(resolvedPath).replace(/\.[^.]+$/, '');
            const uniquePart = sanitizeId(uniqueSource) || undefined;
            const generatedId = buildVariantId(familyId, weight, style, uniquePart);
            const variantId = this.normalizeVariantId(generatedId);
            if (!variantId) {
                Logger.warn('FONT_SERVICE', 'Failed to normalize variant id for package font', {
                    family: displayName,
                    module: variantDefinition.module
                });
                continue;
            }

            variants.push({
                family: familyId,
                weight,
                style,
                filePath: resolvedPath,
                displayName,
                category,
                variantId,
                format,
                label: variantDefinition.label ?? deriveVariantLabel(path.basename(resolvedPath))
            });
        }

        if (variants.length === 0) {
            Logger.warn('FONT_SERVICE', 'Package font family has no valid variants', { family: displayName });
            return null;
        }

        variants.sort((a, b) => {
            const weightDelta = Number(a.weight) - Number(b.weight);
            if (!Number.isNaN(weightDelta) && weightDelta !== 0) {
                return weightDelta;
            }
            if (a.style !== b.style) {
                return a.style.localeCompare(b.style);
            }
            return (a.label ?? '').localeCompare(b.label ?? '', 'ko');
        });

        return {
            name: familyId,
            displayName,
            category,
            variants,
            cssFamily,
            isSystem: false
        };
    }

    private createSystemFontFamily(definition: SystemFontDefinition): FontFamily {
        const displayName = definition.displayName.trim();
        const familyId = sanitizeId(definition.id || displayName) || sanitizeId(displayName) || `system-font-${Date.now().toString(36)}`;
        const cssFamily = definition.cssFamily?.trim() || generateCssFontFamily(displayName);

        return {
            name: familyId,
            displayName,
            category: definition.category,
            variants: [],
            cssFamily,
            isSystem: true
        };
    }

    private async loadFromPackageDefinitions(): Promise<boolean> {
        const families: FontFamily[] = [];
        const seen = new Set<string>();

        for (const definition of PACKAGE_FONT_FAMILIES) {
            const family = this.createFamilyFromPackageDefinition(definition);
            if (!family) {
                continue;
            }

            if (seen.has(family.name)) {
                Logger.debug('FONT_SERVICE', 'Duplicate package font family skipped', { family: family.name });
                continue;
            }

            families.push(family);
            seen.add(family.name);
        }

        for (const definition of SYSTEM_FONT_FAMILIES) {
            const family = this.createSystemFontFamily(definition);
            if (seen.has(family.name)) {
                continue;
            }
            families.push(family);
            seen.add(family.name);
        }

        if (families.length === 0) {
            return false;
        }

        families.sort((a, b) => {
            if (a.isSystem !== b.isSystem) {
                return a.isSystem ? 1 : -1;
            }
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category, 'ko');
            }
            return a.displayName.localeCompare(b.displayName, 'ko');
        });

        this.storeFamilies(families);
        Logger.info('FONT_SERVICE', 'Font families loaded from npm packages', { count: families.length });
        return true;
    }

    private async loadDisplayMetadata(assetRoots: string[]): Promise<void> {
        this.displayMetadataOverrides.clear();
        this.directoryMetadataCache.clear();

        const candidateFileNames = [
            'display-metadata.json',
            'fonts-display-metadata.json',
            'fonts-display-names.json',
            'display-names.json'
        ];

        for (const root of assetRoots) {
            for (const fileName of candidateFileNames) {
                // 🔒 보안: root는 resolveAssetRoots()의 검증된 경로, fileName은 상수 배열
                // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
                const filePath = path.join(root, fileName);
                await this.ingestDisplayMetadataFile(filePath);
            }
        }
    }

    private async ingestDisplayMetadataFile(filePath: string): Promise<void> {
        try {
            const raw = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(raw) as unknown;
            this.registerDisplayMetadataEntries(parsed, filePath);
            Logger.debug('FONT_SERVICE', 'Font display metadata loaded', { filePath });
        } catch (error) {
            const code = (error as NodeJS.ErrnoException).code;
            if (code === 'ENOENT') {
                return;
            }
            Logger.warn('FONT_SERVICE', 'Failed to load display metadata file', {
                filePath,
                error: (error as Error).message
            });
        }
    }

    private registerDisplayMetadataEntries(data: unknown, source: string): void {
        if (!data || typeof data !== 'object') {
            Logger.warn('FONT_SERVICE', 'Display metadata file contained invalid format', { source });
            return;
        }

        for (const [rawKey, rawValue] of Object.entries(data as Record<string, unknown>)) {
            const metadata = this.normalizeDisplayMetadataValue(rawValue);
            if (!metadata) {
                continue;
            }

            const keys = new Set<string>();
            if (typeof rawKey === 'string') {
                keys.add(rawKey);
                const sanitized = sanitizeId(rawKey);
                if (sanitized) {
                    keys.add(sanitized);
                }
                keys.add(rawKey.toLowerCase());
            }

            for (const key of keys) {
                if (!key) {
                    continue;
                }
                this.displayMetadataOverrides.set(key, { ...metadata });
            }
        }
    }

    private normalizeDisplayMetadataValue(value: unknown): FontDisplayMetadataOverride | null {
        if (typeof value === 'string') {
            return { displayName: value };
        }

        if (value && typeof value === 'object') {
            const record = value as Record<string, unknown>;
            const displayName = typeof record.displayName === 'string' ? record.displayName : undefined;
            const categoryRaw = record.category;
            let category: FontCategory | undefined;

            if (typeof categoryRaw === 'string') {
                if (['korean', 'japanese', 'english', 'system'].includes(categoryRaw)) {
                    category = categoryRaw as FontCategory;
                }
            }

            if (!displayName && !category) {
                return null;
            }

            return { displayName, category };
        }

        return null;
    }

    private async resolveDisplayMetadata(folderName: string, absoluteDir: string): Promise<FontDisplayMetadataOverride> {
        const keys = new Set<string>();
        if (folderName) {
            keys.add(folderName);
            keys.add(folderName.toLowerCase());
        }
        const sanitized = sanitizeId(folderName);
        if (sanitized) {
            keys.add(sanitized);
        }

        for (const key of keys) {
            const metadata = this.displayMetadataOverrides.get(key);
            if (metadata) {
                return { ...metadata };
            }
        }

        if (this.directoryMetadataCache.has(absoluteDir)) {
            return this.directoryMetadataCache.get(absoluteDir) ?? {};
        }

        const localMetadata = await this.loadDirectoryMetadata(absoluteDir);
        this.directoryMetadataCache.set(absoluteDir, localMetadata);
        return localMetadata ?? {};
    }

    private async loadDirectoryMetadata(absoluteDir: string): Promise<FontDisplayMetadataOverride | null> {
        const jsonCandidates = ['font.metadata.json', 'font.meta.json', 'display-name.json', 'metadata.json'];
        for (const candidate of jsonCandidates) {
            // 🔒 보안: absoluteDir은 검증된 폰트 디렉토리, candidate는 상수 배열
            // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal
            const filePath = path.join(absoluteDir, candidate);
            try {
                const raw = await fs.readFile(filePath, 'utf8');
                const parsed = JSON.parse(raw) as unknown;
                const metadata = this.normalizeDisplayMetadataValue(parsed);
                if (metadata) {
                    Logger.debug('FONT_SERVICE', 'Font directory metadata loaded', {
                        directory: absoluteDir,
                        file: candidate
                    });
                    return metadata;
                }
            } catch (error) {
                const code = (error as NodeJS.ErrnoException).code;
                if (code === 'ENOENT') {
                    continue;
                }
                Logger.warn('FONT_SERVICE', 'Failed to load font directory metadata', {
                    directory: absoluteDir,
                    file: candidate,
                    error: (error as Error).message
                });
            }
        }

        const textCandidates = ['display-name.txt', 'font.name', 'name.txt'];
        for (const candidate of textCandidates) {
            const filePath = path.join(absoluteDir, candidate);
            try {
                const raw = await fs.readFile(filePath, 'utf8');
                const displayName = raw.trim();
                if (displayName) {
                    Logger.debug('FONT_SERVICE', 'Font directory display name override loaded', {
                        directory: absoluteDir,
                        file: candidate
                    });
                    return { displayName };
                }
            } catch (error) {
                const code = (error as NodeJS.ErrnoException).code;
                if (code === 'ENOENT') {
                    continue;
                }
                Logger.warn('FONT_SERVICE', 'Failed to read font directory display name override', {
                    directory: absoluteDir,
                    file: candidate,
                    error: (error as Error).message
                });
            }
        }

        return null;
    }

    private extractVariantIdFromRequest(rawUrl: string): string | null {
        if (!rawUrl) {
            return null;
        }

        let stripped = rawUrl.replace(/^loop-font:\/\//i, '').trim();
        if (!stripped) {
            return null;
        }

    const [withoutQuery] = stripped.split(/[?#]/, 1);
    stripped = withoutQuery ?? '';
        const segments = stripped.split('/').map(segment => segment.trim()).filter(Boolean);

        if (segments.length === 0) {
            return null;
        }

        if (segments.length > 1) {
            Logger.warn('FONT_SERVICE', 'Received loop-font request with unexpected nested path', {
                rawUrl,
                segments
            });
        }

        const normalized = this.normalizeVariantId(segments[0]);
        return normalized || null;
    }

    private async performProtocolRegistration(): Promise<void> {
        try {
            await app.whenReady().catch(() => undefined);
        } catch {
            // ignore errors from whenReady in tests
        }

        const initPromise = this.initialize().catch(error => {
            Logger.error('FONT_SERVICE', 'Font service initialization failed in background', error);
        });

        try {
            await protocol.unhandle?.('loop-font');
        } catch {
            // ignore when protocol has not been registered yet
        }

        protocol.handle('loop-font', async (request: ProtocolRequest) => {
            try {
                const variantId = this.extractVariantIdFromRequest(request.url);

                if (!variantId) {
                    Logger.warn('FONT_SERVICE', 'Received loop-font request without variant id');
                    return new Response(null, { status: 400 });
                }

                try {
                    await this.initialize();
                } catch (initError) {
                    Logger.error('FONT_SERVICE', 'Font service initialization failed during request', initError);
                    return new Response(null, { status: 503 });
                }

                const fontBinary = await this.getFontBinary(variantId);
                if (!fontBinary) {
                    return new Response(null, { status: 404 });
                }

                const mimeType = this.getMimeType(fontBinary.format);
                return new Response(fontBinary.data, {
                    headers: {
                        'Content-Type': mimeType,
                        'Cache-Control': 'public, max-age=31536000, immutable'
                    }
                });
            } catch (error) {
                Logger.error('FONT_SERVICE', 'Failed to serve font via loop-font protocol', {
                    url: request.url,
                    error
                });
                return new Response(null, { status: 500 });
            }
        });

        Logger.info('FONT_SERVICE', 'loop-font protocol registered');

        await initPromise;
    }
}

export const fontService = FontService.getInstance();
export default fontService;
