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

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  Pretendard: 'Pretendard',
  PretendardJP: 'Pretendard JP',
  'nanum-gothic': 'Nanum Gothic (나눔고딕)',
  Noto_Sans: 'Noto Sans',
  Noto_Sans_KR: 'Noto Sans KR',
  Noto_Sans_JP: 'Noto Sans JP',
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

export const sanitizeId = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

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
  if (DISPLAY_NAME_OVERRIDES[familyName]) {
    return DISPLAY_NAME_OVERRIDES[familyName];
  }

  if (fallback && DISPLAY_NAME_OVERRIDES[fallback]) {
    return DISPLAY_NAME_OVERRIDES[fallback];
  }

  const normalized = fallback ?? familyName;
  return normalized
    .replace(/[_-]+/g, ' ')
    .replace(/\b([a-z])/g, match => match.toUpperCase())
    .trim();
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
