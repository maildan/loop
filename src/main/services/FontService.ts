/**
 * 🔥 폰트 서비스 - 사전 변환된 WOFF2 매니페스트 기반 로더
 * 런타임 변환/스캔을 제거하고 즉시 사용 가능한 폰트 메타데이터를 제공
 */

import { app } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../../shared/logger';
import type { FontCategory, FontManifest, FontFamilyManifestEntry, FontOption } from '../../shared/fonts/types';

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
            Logger.warn('FONT_SERVICE', 'No font manifest found - dynamic fonts disabled');
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
        const candidateRoots = [
            path.join(process.cwd(), 'public'),
            path.join(app.getAppPath(), 'public'),
            process.resourcesPath || null,
            app.getAppPath()
        ].filter((value): value is string => Boolean(value));

        for (const root of candidateRoots) {
            const candidate = path.join(root, 'fonts-manifest.json');
            try {
                const stats = await fs.stat(candidate);
                if (stats.isFile()) {
                    return candidate;
                }
            } catch {
                // try next candidate
            }
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

        this.fontsCache.clear();
        this.variantIndex.clear();

        for (const familyEntry of manifest.families) {
            const family = this.createFamilyFromManifest(familyEntry);
            if (!family) {
                continue;
            }

            this.fontsCache.set(family.name, family);

            for (const variant of family.variants) {
                if (variant.filePath) {
                    this.variantIndex.set(variant.variantId, variant.filePath);
                }
            }
        }
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
}

export const fontService = FontService.getInstance();
export default fontService;
