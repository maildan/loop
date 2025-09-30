/**
 * 🔥 폰트 서비스 - 사전 변환된 WOFF2 매니페스트 기반 로더
 * 런타임 변환/스캔을 제거하고 즉시 사용 가능한 폰트 메타데이터를 제공
 */

import { app, protocol } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../../shared/logger';
import type { FontCategory, FontManifest, FontFamilyManifestEntry, FontOption } from '../../shared/fonts/types';
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

interface FontInfo {
    family: string;
    weight: string;
    style: 'normal' | 'italic';
    filePath: string;
    displayName: string;
    category: FontCategory;
    variantId: string;
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

class FontService {
    private static instance: FontService;

    private fontsCache: Map<string, FontFamily> = new Map();
    private variantIndex: Map<string, string> = new Map();
    private manifestPath: string | null = null;
    private manifestDir: string | null = null;
    private initializePromise: Promise<void> | null = null;
    private isInitialized = false;
    private protocolRegistered = false;
    private protocolRegistrationPromise: Promise<void> | null = null;

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
                css.push(`
@font-face {
  font-family: "${family.displayName}";
  src: url("loop-font://${variant.variantId}") format("woff2");
  font-weight: ${variant.weight};
  font-style: ${variant.style};
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
            Logger.error('FONT_SERVICE', 'Failed to read font binary', { variantId, filePath, error });
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
            Logger.warn('FONT_SERVICE', 'No font manifest found - falling back to asset discovery');
            await this.loadFromAssetDirectories();
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

            variants.push({
                family: entry.name,
                weight: variantEntry.weight,
                style: variantEntry.style,
                filePath: resolvedPath,
                displayName: entry.displayName,
                category: entry.category,
                variantId: variantEntry.id,
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
        const absolute = path.resolve(this.manifestDir, normalized);

        if (!absolute.startsWith(this.manifestDir)) {
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

        const familyId = sanitizeId(folderName) || sanitizeId(path.basename(absoluteDir)) || `family-${sanitizeId(path.basename(absoluteDir))}`;
        const displayName = createDisplayName(folderName);
        const category = determineFontCategory(displayName);
        const cssFamily = generateCssFontFamily(displayName);

        const variants: FontInfo[] = [];
        for (const fileName of fontFiles) {
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
            const variantId = buildVariantId(familyId, weight, style, uniquePart);

            variants.push({
                family: familyId,
                weight,
                style,
                filePath: absolutePath,
                displayName,
                category,
                variantId,
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
                if (variant.filePath) {
                    this.variantIndex.set(variant.variantId, variant.filePath);
                }
            }
        }
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
                const variantId = request.url.replace('loop-font://', '').replace(/^\//, '');

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

                const arrayBuffer = await this.getFontBinary(variantId);
                if (!arrayBuffer) {
                    return new Response(null, { status: 404 });
                }

                return new Response(arrayBuffer, {
                    headers: {
                        'Content-Type': 'font/woff2',
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
