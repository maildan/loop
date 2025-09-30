// 🔥 동적 폰트 훅 - 사전 변환된 WOFF2 매니페스트 기반
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Logger } from '../../shared/logger';
import type { FontOption } from '../../shared/fonts/types';

export type EditorFontScope = 'document' | 'selection';

interface UseDynamicFontResult {
  currentFont: string;
  availableFonts: FontOption[];
  setFont: (family: string) => void;
  editorFont: string | null;
  setEditorFont: (family: string | null) => void;
  editorFontScope: EditorFontScope;
  setEditorFontScope: (scope: EditorFontScope) => void;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const STYLE_ELEMENT_ID = 'loop-dynamic-fonts';
const STORAGE_KEY = 'loop-font-family';
const EDITOR_FONT_STORAGE_KEY = 'loop-editor-font-family';
const EDITOR_FONT_SCOPE_STORAGE_KEY = 'loop-editor-font-scope';

function readStoredValue(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(key);
    const trimmed = raw?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : null;
  } catch (error) {
    Logger.warn('DYNAMIC_FONT', `Failed to read stored value: ${key}`, error);
    return null;
  }
}

function writeStoredValue(key: string, value: string | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (value && value.trim().length > 0) {
      localStorage.setItem(key, value.trim());
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    Logger.warn('DYNAMIC_FONT', `Failed to persist stored value: ${key}`, error);
  }
}

function getSavedEditorFont(): string | null {
  return readStoredValue(EDITOR_FONT_STORAGE_KEY);
}

function saveEditorFont(family: string | null): void {
  writeStoredValue(EDITOR_FONT_STORAGE_KEY, family);
}

function getSavedEditorFontScope(): EditorFontScope {
  if (typeof window === 'undefined') {
    return 'document';
  }

  try {
    const stored = localStorage.getItem(EDITOR_FONT_SCOPE_STORAGE_KEY);
    return stored === 'selection' ? 'selection' : 'document';
  } catch (error) {
    Logger.warn('DYNAMIC_FONT', 'Failed to read stored editor font scope', error);
    return 'document';
  }
}

function saveEditorFontScope(scope: EditorFontScope): void {
  writeStoredValue(EDITOR_FONT_SCOPE_STORAGE_KEY, scope);
}

function applyEditorFontPreference(preferred: string | null, fallback: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const normalized = preferred && preferred.trim().length > 0 ? preferred.trim() : fallback;
  const root = document.documentElement;

  root.style.setProperty('--editor-font-family', normalized);
  root.style.setProperty('--font-writing', normalized);
}

function getSavedFont(): string | null {
  return readStoredValue(STORAGE_KEY);
}

function saveFont(family: string): void {
  writeStoredValue(STORAGE_KEY, family);
}

function applyFontToDocument(family: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const normalized = family && family.trim().length > 0 ? family : 'system-ui, sans-serif';
  const root = document.documentElement;

  root.style.setProperty('--app-font-family', normalized);
  root.style.setProperty('--dynamic-font-family', normalized);
  root.style.setProperty('--font-primary', normalized);
  root.style.setProperty('--font-writing', normalized);
  root.style.setProperty('--font-app', normalized);

  root.style.fontFamily = normalized;
  document.body.style.fontFamily = normalized;
}

async function injectFontCss(): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  try {
    const css = await window.electronAPI?.font?.generateCSS?.();
    if (!css || css.trim().length === 0) {
      return;
    }

    let style = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ELEMENT_ID;
      document.head.appendChild(style);
    }

    style.textContent = css;
    Logger.info('DYNAMIC_FONT', 'Injected dynamic font CSS', { length: css.length });
  } catch (error) {
    Logger.error('DYNAMIC_FONT', 'Failed to inject dynamic font CSS', error);
  }
}

function dedupeFonts(fonts: FontOption[]): FontOption[] {
  const unique = new Map<string, FontOption>();

  fonts.forEach((fontOption) => {
    const normalizedValue = fontOption.value.trim();
    const key = normalizedValue.toLowerCase();

    if (!unique.has(key)) {
      unique.set(key, {
        ...fontOption,
        value: normalizedValue
      });
    }
  });

  return Array.from(unique.values());
}

export function useDynamicFont(): UseDynamicFontResult {
  const [currentFont, setCurrentFont] = useState<string>(() => getSavedFont() ?? 'system-ui, sans-serif');
  const [editorFont, setEditorFontState] = useState<string | null>(() => getSavedEditorFont());
  const [editorFontScope, setEditorFontScopeState] = useState<EditorFontScope>(() => getSavedEditorFontScope());
  const [availableFonts, setAvailableFonts] = useState<FontOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const applyAndStoreFont = useCallback((family: string) => {
    applyFontToDocument(family);
    saveFont(family);
    setCurrentFont(family);
  }, []);

  const loadFonts = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await window.electronAPI?.font?.initialize?.();

  const fonts = (await window.electronAPI?.font?.getAvailableFonts?.()) ?? [];
  setAvailableFonts(dedupeFonts(fonts));

      await injectFontCss();

      const systemCount = fonts.filter(font => font.source === 'system').length;
      const localCount = fonts.length - systemCount;

      Logger.info('DYNAMIC_FONT', 'Font catalog loaded', {
        localCount,
        systemCount,
        total: fonts.length
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '폰트를 불러오는데 실패했습니다.';
      setError(message);
      Logger.error('DYNAMIC_FONT', 'Failed to load fonts', err);

      // 최소한의 폴백 보장
      setAvailableFonts([
        { value: 'system-ui, sans-serif', label: '시스템 기본', category: 'system', source: 'system' }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFonts().catch(error => {
      Logger.error('DYNAMIC_FONT', 'Unexpected error during font load', error);
    });
  }, [loadFonts]);

  useEffect(() => {
    applyFontToDocument(currentFont);
  }, [currentFont]);

  useEffect(() => {
    applyEditorFontPreference(editorFont, currentFont);
  }, [currentFont, editorFont]);

  const setFont = useCallback(
    (family: string) => {
      applyAndStoreFont(family);
    },
    [applyAndStoreFont]
  );

  const setEditorFont = useCallback((family: string | null) => {
    const normalized = family && family.trim().length > 0 ? family.trim() : null;
    setEditorFontState(normalized);
    saveEditorFont(normalized);
    applyEditorFontPreference(normalized, currentFont);
  }, [currentFont]);

  const setEditorScope = useCallback((scope: EditorFontScope) => {
    setEditorFontScopeState(scope);
    saveEditorFontScope(scope);
  }, []);

  const reload = useCallback(async () => {
    try {
      await window.electronAPI?.font?.reload?.();
    } catch (error) {
      Logger.warn('DYNAMIC_FONT', 'Font reload request failed', error);
    }

    await loadFonts();
  }, [loadFonts]);

  return useMemo(
    () => ({
      currentFont,
      availableFonts,
      setFont,
      editorFont,
      setEditorFont,
      editorFontScope,
      setEditorFontScope: setEditorScope,
      loading,
      error,
      reload
    }),
    [availableFonts, currentFont, editorFont, editorFontScope, error, loading, reload, setEditorFont, setEditorScope, setFont]
  );
}

export default useDynamicFont;
