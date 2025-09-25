// 🔥 기가차드 폰트 훅 - 동적 폰트 시스템 React Hook

import { useState, useEffect, useCallback } from 'react';
import { Logger } from '../../shared/logger';

// #DEBUG: Font hooks entry point
Logger.debug('FONT_HOOKS', 'Dynamic font hooks module loaded');

// 🔥 폰트 정보 인터페이스 (새로운 동적 폰트 시스템용)
export interface FontOption {
    value: string;
    label: string;
    category: string;
}

// 🔥 폰트 변형 정보
export interface FontVariant {
    weight: string | number;
    style: 'normal' | 'italic';
}

// 🔥 폰트 패밀리 정보
export interface FontFamily {
    name: string;
    displayName: string;
    category: string;
    variants: FontVariant[];
    cssFamily: string;
}

// 🔥 폰트 매니저 훅
export function useFontManager() {
    const [availableFonts, setAvailableFonts] = useState<FontOption[]>([]);
    const [staticFonts, setStaticFonts] = useState<FontOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // 🔥 폰트 서비스 초기화
    const initializeFonts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            Logger.debug('FONT_HOOKS', 'Initializing font service');

            const result = await window.electronAPI.font.initialize();
            if (result.success) {
                setIsInitialized(true);
                Logger.info('FONT_HOOKS', 'Font service initialized successfully');
            } else {
                throw new Error(result.error || 'Font initialization failed');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to initialize fonts';
            Logger.error('FONT_HOOKS', 'Failed to initialize font service', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔥 사용 가능한 폰트 목록 로드
    const loadAvailableFonts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            Logger.debug('FONT_HOOKS', 'Loading available fonts');

            const fonts = await window.electronAPI.font.getAvailableFonts();
            setAvailableFonts(fonts);

            Logger.info('FONT_HOOKS', 'Available fonts loaded', {
                count: fonts.length
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load available fonts';
            Logger.error('FONT_HOOKS', 'Failed to load available fonts', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔥 정적 폰트 목록 로드
    const loadStaticFonts = useCallback(async () => {
        try {
            Logger.debug('FONT_HOOKS', 'Loading static fonts');

            const response = await window.electronAPI.font.getStaticFonts();
            // 🔥 IPC 응답 형식 처리: { success: boolean, data: fonts[] } 
            const fonts = response?.data || response || [];
            setStaticFonts(fonts);

            Logger.info('FONT_HOOKS', 'Static fonts loaded', {
                count: fonts.length
            });

        } catch (err) {
            Logger.error('FONT_HOOKS', 'Failed to load static fonts', err);
        }
    }, []);

    // 🔥 폰트 CSS 생성 및 주입
    const injectFontCSS = useCallback(async () => {
        try {
            Logger.debug('FONT_HOOKS', 'Injecting font CSS');

            const css = await window.electronAPI.font.generateCSS();

            // 기존 동적 폰트 스타일 제거
            const existingStyle = document.getElementById('dynamic-fonts');
            if (existingStyle) {
                existingStyle.remove();
            }

            // 새로운 스타일 추가
            const style = document.createElement('style');
            style.id = 'dynamic-fonts';
            style.textContent = css;
            document.head.appendChild(style);

            Logger.info('FONT_HOOKS', 'Font CSS injected successfully');

        } catch (err) {
            Logger.error('FONT_HOOKS', 'Failed to inject font CSS', err);
        }
    }, []);

    // 🔥 폰트 서비스 리로드
    const reloadFonts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            Logger.debug('FONT_HOOKS', 'Reloading font service');

            const result = await window.electronAPI.font.reload();
            if (result.success) {
                await loadAvailableFonts();
                await injectFontCSS();
                Logger.info('FONT_HOOKS', 'Font service reloaded successfully');
            } else {
                throw new Error(result.error || 'Font reload failed');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reload fonts';
            Logger.error('FONT_HOOKS', 'Failed to reload font service', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [loadAvailableFonts, injectFontCSS]);

    // 🔥 폰트 패밀리 정보 가져오기
    const getFontFamily = useCallback(async (familyName: string): Promise<FontFamily | null> => {
        try {
            Logger.debug('FONT_HOOKS', 'Getting font family', { familyName });

            const fontFamily = await window.electronAPI.font.getFontFamily(familyName);

            Logger.info('FONT_HOOKS', 'Font family retrieved', {
                familyName,
                fontFamily
            });

            return fontFamily;

        } catch (err) {
            Logger.error('FONT_HOOKS', 'Failed to get font family', { familyName, error: err });
            return null;
        }
    }, []);

    // 🔥 폰트가 사용 가능한지 확인
    const isFontAvailable = useCallback((fontValue: string): boolean => {
        return availableFonts.some(font => font.value === fontValue) ||
            staticFonts.some(font => font.value === fontValue);
    }, [availableFonts, staticFonts]);

    // 🔥 모든 폰트 목록 (동적 + 정적)
    const allFonts = useCallback((): FontOption[] => {
        return [...staticFonts, ...availableFonts];
    }, [staticFonts, availableFonts]);

    // 🔥 초기 로드
    useEffect(() => {
        const initializeAndLoad = async () => {
            await initializeFonts();
            await loadStaticFonts();
            await loadAvailableFonts();
            await injectFontCSS();
        };

        initializeAndLoad();
    }, [initializeFonts, loadStaticFonts, loadAvailableFonts, injectFontCSS]);

    return {
        // 상태
        availableFonts,
        staticFonts,
        loading,
        error,
        isInitialized,

        // 액션
        initializeFonts,
        loadAvailableFonts,
        loadStaticFonts,
        injectFontCSS,
        reloadFonts,

        // 유틸리티
        getFontFamily,
        isFontAvailable,
        allFonts,
    };
}

// 🔥 현재 설정된 폰트 관리 훅
export function useCurrentFont() {
    const [currentFont, setCurrentFont] = useState<string>('system-ui, sans-serif');
    const [currentFontFamily, setCurrentFontFamily] = useState<string>('시스템 기본');
    const { getFontFamily, allFonts, isInitialized } = useFontManager();

    // 🔥 폰트 변경
    const changeFont = useCallback(async (fontValue: string) => {
        try {
            Logger.debug('FONT_HOOKS', '🎨 Changing current font', { fontValue });

            // 정적 폰트인 경우 바로 적용
            if (fontValue.includes(',') || fontValue.includes('-apple-system') || fontValue.includes('system-ui')) {
                setCurrentFont(fontValue);

                // 라벨 찾기
                const allFontOptions = allFonts();
                const fontOption = allFontOptions.find(f => f.value === fontValue);
                setCurrentFontFamily(fontOption?.label || fontValue);

                // CSS 변수 업데이트 (전역 폰트 적용)
                document.documentElement.style.setProperty('--font-family', fontValue);

                Logger.info('FONT_HOOKS', '✅ Static font applied successfully', {
                    fontValue,
                    fontFamily: fontOption?.label || fontValue
                });

                return true;
            }

            // 🔥 동적 폰트인 경우 - CSS 재생성 후 적용
            Logger.debug('FONT_HOOKS', '🔄 Regenerating CSS for dynamic font', { fontValue });

            // 1. CSS 재생성 및 주입
            try {
                const css = await window.electronAPI.font.generateCSS();

                // 기존 동적 폰트 스타일 제거
                const existingStyle = document.getElementById('dynamic-fonts');
                if (existingStyle) {
                    existingStyle.remove();
                }

                // 새로운 스타일 추가
                const style = document.createElement('style');
                style.id = 'dynamic-fonts';
                style.textContent = css;
                document.head.appendChild(style);

                Logger.info('FONT_HOOKS', '✅ Dynamic CSS regenerated and injected');
            } catch (cssError) {
                Logger.error('FONT_HOOKS', '❌ Failed to regenerate CSS', cssError);
            }

            // 2. 폰트 패밀리 정보 가져오기
            const fontFamily = await getFontFamily(fontValue);

            if (fontFamily) {
                setCurrentFont(fontValue);
                setCurrentFontFamily(fontFamily.displayName);

                // CSS 변수 업데이트 (전역 폰트 적용)
                document.documentElement.style.setProperty('--font-family', fontFamily.cssFamily);

                Logger.info('FONT_HOOKS', '✅ Dynamic font applied successfully', {
                    fontValue,
                    fontFamily: fontFamily.displayName,
                    cssFamily: fontFamily.cssFamily
                });

                return true;
            }

            Logger.warn('FONT_HOOKS', '⚠️ Font family not found', { fontValue });
            return false;

        } catch (err) {
            Logger.error('FONT_HOOKS', '❌ Failed to change current font', { fontValue, error: err });
            return false;
        }
    }, [getFontFamily, allFonts]);

    // 🔥 초기 폰트 적용
    useEffect(() => {
        if (!isInitialized) return;

        // 기본 폰트 적용
        changeFont(currentFont).catch(err => {
            Logger.error('FONT_HOOKS', 'Failed to set initial font', err);
        });
    }, [currentFont, changeFont, isInitialized]);

    return {
        currentFont,
        currentFontFamily,
        changeFont,
    };
}

// #DEBUG: Font hooks exit point
Logger.debug('FONT_HOOKS', 'Dynamic font hooks module setup complete');

export default useFontManager;
