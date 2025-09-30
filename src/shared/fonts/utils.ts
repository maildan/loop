import path from 'path';
import type { FontCategory } from './types';

const WEIGHT_KEYWORDS: Record<string, string> = {
  thin: '100',
  extralight: '200',
  ultralight: '200',
  'extra-light': '200',
  light: '300',
  book: '350',
  regular: '400',
  roman: '400',
  medium: '500',
  mdm: '500',
  semibold: '600',
  'semi-bold': '600',
  demibold: '600',
  bold: '700',
  heavybold: '700',
  'extra-bold': '800',
  extrabold: '800',
  heavy: '900',
  black: '900',
  variable: '400'
};

const TOKEN_REPLACEMENTS: Record<string, string> = {
  jp: 'JP',
  kr: 'KR',
  ms: 'MS',
  sf: 'SF',
  ui: 'UI',
  us: 'US',
  uk: 'UK',
  win: 'Windows',
  mac: 'Mac',
  ttf: 'TTF',
  otf: 'OTF',
  woff: 'WOFF',
  woff2: 'WOFF2'
};

const NON_LATIN_REGEX = /[^\u0000-\u007f]/;

const formatDisplayToken = (token: string): string => {
  const trimmed = token.trim();
  if (!trimmed) {
    return '';
  }

  const match = trimmed.match(/^([\(\[]?)(.*?)([\)\]]?)$/);
  const prefix = match?.[1] ?? '';
  const core = match?.[2] ?? trimmed;
  const suffix = match?.[3] ?? '';

  if (!core) {
    return trimmed;
  }

  if (NON_LATIN_REGEX.test(core)) {
    return `${prefix}${core}${suffix}`;
  }

  if (/^\d+$/.test(core)) {
    return `${prefix}${core}${suffix}`;
  }

  const lower = core.toLowerCase();
  const replacement = TOKEN_REPLACEMENTS[lower];

  if (replacement) {
    return `${prefix}${replacement}${suffix}`;
  }

  if (core.length <= 2) {
    return `${prefix}${lower.toUpperCase()}${suffix}`;
  }

  return `${prefix}${core.charAt(0).toUpperCase()}${core.slice(1).toLowerCase()}${suffix}`;
};

export const sanitizeId = (value: string): string => {
  if (!value) {
    return '';
  }

  // Normalize accents and convert to lowercase ASCII where possible
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  let sanitized = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  if (!sanitized) {
    // Fall back to URL encoding for non-Latin scripts, keep alphanumeric percent pairs
    sanitized = encodeURIComponent(value)
      .replace(/%/g, '-')
      .replace(/[^a-z0-9-]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }

  return sanitized;
};

export const determineFontCategory = (familyName: string): FontCategory => {
  const name = familyName.toLowerCase();
  if (/(nanum|pretendard|gangwon|malgun|noto[_-]sans|hangang)/.test(name)) {
    return 'korean';
  }
  if (/(ms\s*gothic|ms\s*mincho|pretendardjp|noto[_-]sans_?jp|jp)/.test(name)) {
    return 'japanese';
  }
  if (/(arial|times|verdana|calibri|sf-pro|roboto|inter|helvetica|georgia)/.test(name)) {
    return 'english';
  }
  return 'system';
};

export const createDisplayName = (familyName: string, fallback?: string): string => {
  const source = (familyName || fallback || '').trim();
  if (!source) {
    return '';
  }

  const withSpacing = source
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])(\d)/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  if (!withSpacing) {
    return '';
  }

  const tokens = withSpacing.split(' ').map(formatDisplayToken).filter(Boolean);
  return tokens.join(' ').replace(/\s+\(/g, ' (');
};

export const inferWeight = (fileName: string): string => {
  const lower = fileName.toLowerCase();
  for (const [keyword, weight] of Object.entries(WEIGHT_KEYWORDS)) {
    if (lower.includes(keyword)) {
      return weight;
    }
  }
  return '400';
};

export const inferStyle = (fileName: string): 'normal' | 'italic' => {
  const lower = fileName.toLowerCase();
  if (lower.includes('italic') || lower.includes('ital') || lower.includes('itl') || lower.includes('oblique')) {
    return 'italic';
  }
  return 'normal';
};

export const deriveVariantLabel = (fileName: string): string => {
  const base = path.basename(fileName).replace(/\.[^.]+$/, '');
  const normalized = base
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b([a-z])/g, match => match.toUpperCase());
  return normalized;
};

export const generateCssFontFamily = (displayName: string): string => {
  const fallbacks = ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'];
  return `"${displayName}"${fallbacks.length ? `, ${fallbacks.join(', ')}` : ''}`;
};

export const buildVariantId = (
  familyId: string,
  weight: string,
  style: 'normal' | 'italic',
  uniquePart?: string
): string => {
  const parts = [familyId, weight, style];
  if (uniquePart) {
    parts.push(uniquePart);
  }
  return parts.filter(Boolean).join('-');
};
