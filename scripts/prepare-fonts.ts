import path from 'path';
import { existsSync, rmSync, promises as fs } from 'fs';
import ttf2woff2Module from 'ttf2woff2';
import {
  sanitizeId,
  determineFontCategory,
  createDisplayName,
  generateCssFontFamily,
  inferWeight,
  inferStyle,
  deriveVariantLabel,
  buildVariantId
} from '../src/shared/fonts/utils';
import type { FontManifest, FontFamilyManifestEntry, FontVariantManifestEntry, FontCategory } from '../src/shared/fonts/types';

const SYSTEM_FONT_DEFINITIONS: Array<{ name: string; displayName: string; cssFamily: string; category: FontCategory }> = [
  {
    name: 'system-default',
    displayName: '시스템 기본',
    cssFamily: 'system-ui, sans-serif',
    category: 'system'
  },
  {
    name: 'apple-system',
    displayName: 'Apple 시스템',
    cssFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    category: 'system'
  },
  {
    name: 'arial',
    displayName: 'Arial',
    cssFamily: 'Arial, Helvetica, sans-serif',
    category: 'english'
  },
  {
    name: 'times-new-roman',
    displayName: 'Times New Roman',
    cssFamily: 'Times New Roman, Times, serif',
    category: 'english'
  },
  {
    name: 'verdana',
    displayName: 'Verdana',
    cssFamily: 'Verdana, Geneva, sans-serif',
    category: 'english'
  },
  {
    name: 'georgia',
    displayName: 'Georgia',
    cssFamily: 'Georgia, serif',
    category: 'english'
  }
];

const resolveConverter = (mod: unknown) => {
  if (typeof mod === 'function') {
    return mod;
  }
  if (mod && typeof (mod as { default?: unknown }).default === 'function') {
    return (mod as { default: unknown }).default;
  }
  throw new Error('ttf2woff2 module did not export a converter function.');
};

const ttf2woff2 = resolveConverter(ttf2woff2Module) as (input: Buffer) => Buffer | Promise<Buffer>;

const cwd = process.cwd();
const SOURCE_DIR = path.resolve(cwd, 'public', 'fonts');
const OUTPUT_DIR = path.resolve(cwd, 'public', 'fonts-dist');
const MANIFEST_PATH = path.resolve(cwd, 'public', 'fonts-manifest.json');

interface FontCandidate {
  filePath: string;
  fileName: string;
  weight: string;
  style: 'normal' | 'italic';
  label: string;
}

async function ensureCleanDirectory(dir: string): Promise<void> {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
  await fs.mkdir(dir, { recursive: true });
}

async function collectFonts(dirPath: string): Promise<FontCandidate[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const results: FontCandidate[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectFonts(entryPath);
      results.push(...nested);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!['.ttf', '.otf', '.woff2'].includes(ext)) {
      continue;
    }

    const weight = inferWeight(entry.name);
    const style = inferStyle(entry.name);
    const label = deriveVariantLabel(entry.name);

    results.push({
      filePath: entryPath,
      fileName: entry.name,
      weight,
      style,
      label
    });
  }

  return results;
}

async function convertFontToWoff2(sourcePath: string): Promise<Buffer> {
  const buffer = await fs.readFile(sourcePath);
  const converted = await Promise.resolve(ttf2woff2(buffer));
  return Buffer.isBuffer(converted) ? converted : Buffer.from(converted);
}

async function copyOrConvertFont(sourcePath: string): Promise<Buffer> {
  const ext = path.extname(sourcePath).toLowerCase();
  if (ext === '.woff2') {
    return fs.readFile(sourcePath);
  }
  return convertFontToWoff2(sourcePath);
}

async function buildFamilyManifest(familyDir: string, familyName: string): Promise<FontFamilyManifestEntry | null> {
  const fonts = await collectFonts(familyDir);
  if (fonts.length === 0) {
    return null;
  }

  const familyId = sanitizeId(familyName);
  const displayName = createDisplayName(familyName);
  const category = determineFontCategory(familyName);
  const cssFamily = generateCssFontFamily(displayName);
  const familyOutputDir = path.join(OUTPUT_DIR, familyId);
  await fs.mkdir(familyOutputDir, { recursive: true });

  const seenIds = new Set<string>();
  const variants: FontVariantManifestEntry[] = [];

  for (const font of fonts) {
    const uniquePart = sanitizeId(font.label) || undefined;
    let variantId = buildVariantId(familyId, font.weight, font.style, uniquePart);
    let counter = 1;
    while (seenIds.has(variantId)) {
      variantId = buildVariantId(familyId, font.weight, font.style, `${uniquePart}-${counter}`);
      counter += 1;
    }
    seenIds.add(variantId);

    const targetFileName = `${variantId}.woff2`;
    const targetPath = path.join(familyOutputDir, targetFileName);

    const data = await copyOrConvertFont(font.filePath);
    await fs.writeFile(targetPath, data);

    const relativePath = path.relative(path.dirname(MANIFEST_PATH), targetPath).split(path.sep).join('/');

    variants.push({
      id: variantId,
      weight: font.weight,
      style: font.style,
      label: font.label,
      file: relativePath
    });
  }

  return {
    id: familyId,
    name: familyName,
    displayName,
    category,
    cssFamily,
    variants
  };
}

async function main(): Promise<void> {
  if (!existsSync(SOURCE_DIR)) {
    throw new Error(`Source fonts directory not found: ${SOURCE_DIR}`);
  }

  await ensureCleanDirectory(OUTPUT_DIR);

  const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
  const families: FontFamilyManifestEntry[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue;
    }

    const familyDir = path.join(SOURCE_DIR, entry.name);
    const manifestEntry = await buildFamilyManifest(familyDir, entry.name);
    if (manifestEntry) {
      families.push(manifestEntry);
    }
  }

  const existingIds = new Set(families.map(family => family.id));
  for (const systemFont of SYSTEM_FONT_DEFINITIONS) {
    const id = sanitizeId(systemFont.name);
    if (existingIds.has(id)) {
      continue;
    }

    families.push({
      id,
      name: systemFont.name,
      displayName: systemFont.displayName,
      category: systemFont.category,
      cssFamily: systemFont.cssFamily,
      variants: [],
      isSystem: true
    });
  }

  if (families.length === 0) {
    throw new Error('No fonts were discovered. Ensure public/fonts contains font directories.');
  }

  const manifest: FontManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    families: families.sort((a, b) => a.displayName.localeCompare(b.displayName, 'ko'))
  };

  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`✅ Font manifest generated with ${families.length} families → ${path.relative(cwd, MANIFEST_PATH)}`);
}

main().catch(error => {
  console.error('❌ Failed to prepare fonts:', error);
  process.exitCode = 1;
});
