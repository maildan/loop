// 🔥 동적 폰트 훅 - 사전 변환된 WOFF2 매니페스트 기반
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Logger } from '../../shared/logger';
import type { FontOption } from '../../shared/fonts/types';

interface UseDynamicFontResult {
  currentFont: string;
  availableFonts: FontOption[];
  setFont: (family: string) => void;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const STYLE_ELEMENT_ID = 'loop-dynamic-fonts';
const STORAGE_KEY = 'loop-font-family';

function getSavedFont(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    Logger.warn('DYNAMIC_FONT', 'Failed to read stored font family', error);
    return null;
  }
}

function saveFont(family: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, family);
  } catch (error) {
    Logger.warn('DYNAMIC_FONT', 'Failed to persist selected font family', error);
  }
}

function applyFontToDocument(family: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const normalized = family && family.trim().length > 0 ? family : 'system-ui, sans-serif';
  document.documentElement.style.setProperty('--app-font-family', normalized);
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

export function useDynamicFont(): UseDynamicFontResult {
  const [currentFont, setCurrentFont] = useState<string>(() => getSavedFont() ?? 'system-ui, sans-serif');
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
      setAvailableFonts(fonts);

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

  const setFont = useCallback(
    (family: string) => {
      applyAndStoreFont(family);
    },
    [applyAndStoreFont]
  );

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
      loading,
      error,
      reload
    }),
    [availableFonts, currentFont, error, loading, reload, setFont]
  );
}

export default useDynamicFont;
