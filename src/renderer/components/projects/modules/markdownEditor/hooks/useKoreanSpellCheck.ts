/**
 * 🇰🇷 간단한 한국어 맞춤법 검사 훅
 * TipTap Extension 대신 훅 기반으로 단순화
 */

import { useCallback, useRef } from 'react';
import { koreanSpellChecker, SpellCheckError } from '../../../../../services/KoreanSpellChecker';

interface UseKoreanSpellCheckOptions {
    enabled: boolean;
    debounceMs: number;
}

export function useKoreanSpellCheck(options: UseKoreanSpellCheckOptions = { enabled: true, debounceMs: 2000 }) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const checkSpelling = useCallback(async (text: string): Promise<SpellCheckError[]> => {
        if (!options.enabled || !text.trim()) return [];

        try {
            return await koreanSpellChecker.checkSentence(text);
        } catch (error) {
            console.warn('Korean spell check failed:', error);
            return [];
        }
    }, [options.enabled]);

    const debouncedCheck = useCallback((text: string, callback?: (errors: SpellCheckError[]) => void) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            const errors = await checkSpelling(text);
            callback?.(errors);
        }, options.debounceMs);
    }, [checkSpelling, options.debounceMs]);

    const autoCorrect = useCallback(async (text: string): Promise<string> => {
        if (!options.enabled) return text;
        return await koreanSpellChecker.autoCorrect(text);
    }, [options.enabled]);

    return {
        checkSpelling,
        debouncedCheck,
        autoCorrect
    };
}

// CSS 스타일 자동 주입
export const injectSpellCheckStyles = () => {
    if (typeof window === 'undefined' || document.getElementById('korean-spell-check-styles')) return;

    const style = document.createElement('style');
    style.id = 'korean-spell-check-styles';
    style.textContent = `
    .korean-spell-error {
      position: relative;
      border-bottom: 2px wavy #ef4444;
      cursor: pointer;
    }

    .korean-spell-popup {
      position: absolute;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 8px;
      z-index: 1000;
      font-size: 14px;
      max-width: 250px;
    }

    .korean-spell-suggestion {
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.15s;
    }

    .korean-spell-suggestion:hover {
      background-color: #f3f4f6;
    }

    @media (prefers-color-scheme: dark) {
      .korean-spell-popup {
        background: #374151;
        color: #f9fafb;
        border-color: #4b5563;
      }

      .korean-spell-suggestion:hover {
        background-color: #4b5563;
      }
    }
  `;
    document.head.appendChild(style);
};
