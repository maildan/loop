export type FontCategory = 'korean' | 'japanese' | 'english' | 'system';

export interface FontVariantManifestEntry {
  /** Stable identifier composed from family id, weight, and style. */
  id: string;
  weight: string;
  style: 'normal' | 'italic';
  /** Optional human friendly label (e.g. "Regular"). */
  label?: string;
  /** Relative path (from manifest directory) to the WOFF2 asset. Optional for 시스템 폰트. */
  file?: string;
}

export interface FontFamilyManifestEntry {
  /** Folder-friendly id (slug) derived from the family name. */
  id: string;
  /** Original folder name (for reference/debugging). */
  name: string;
  /** Display name used in UI. */
  displayName: string;
  category: FontCategory;
  /** CSS font-family string including fallbacks. */
  cssFamily: string;
  variants: FontVariantManifestEntry[];
  /** true이면 시스템/기본 폰트 (사전 탑재된 폰트) */
  isSystem?: boolean;
}

export interface FontManifest {
  version: number;
  generatedAt: string;
  families: FontFamilyManifestEntry[];
}

export interface FontOption {
  value: string;
  label: string;
  category: FontCategory;
  source: 'local' | 'system';
}
