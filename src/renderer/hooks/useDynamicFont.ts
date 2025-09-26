// 🔥 동적 폰트 훅 - public/fonts TTF 기반
import { useState, useEffect, useCallback } from 'react';
import { Logger } from '../../shared/logger';

interface UseDynamicFontResult {
    currentFont: string;
    availableFonts: Array<{ value: string; label: string; category: string }>;
    setFont: (family: string) => void;
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
}

export function useDynamicFont(): UseDynamicFontResult {
    const [currentFont, setCurrentFont] = useState('');
    const [availableFonts, setAvailableFonts] = useState<Array<{ value: string; label: string; category: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔥 폰트 CSS 주입
    const injectFontCSS = useCallback(async () => {
        try {
            const css = await (window as any).electronAPI?.font?.generateCSS?.();
            if (css) {
                // 기존 동적 폰트 스타일 제거
                const existingStyle = document.getElementById('dynamic-fonts');
                if (existingStyle) {
                    existingStyle.remove();
                }

                // 폰트 정규화 CSS 추가
                const normalizedCSS = css + `
                    /* 🔥 폰트 사이즈 정규화 */
                    * {
                        font-size-adjust: 0.5 !important;
                        line-height: 1.6 !important;
                    }
                    
                    /* 텍스트 에디터 영역 정규화 */
                    textarea, input[type="text"], input[type="email"], .text-editor {
                        font-size-adjust: 0.5 !important;
                        line-height: 1.6 !important;
                        vertical-align: baseline !important;
                    }
                    
                    /* 특정 컴포넌트 정규화 */
                    .idea-content, .synopsis-content, .character-content, .notes-content {
                        font-size-adjust: 0.5 !important;
                        line-height: 1.6 !important;
                    }
                    
                    /* 폰트 패밀리별 개별 조정 */
                    .font-korean { font-size-adjust: 0.48 !important; }
                    .font-english { font-size-adjust: 0.52 !important; }
                    .font-monospace { font-size-adjust: 0.45 !important; }
                `;

                // 새 폰트 스타일 추가
                const style = document.createElement('style');
                style.id = 'dynamic-fonts';
                style.textContent = normalizedCSS;
                document.head.appendChild(style);

                Logger.info('DYNAMIC_FONT', '정규화된 폰트 CSS 주입 완료', { cssLength: normalizedCSS.length });
            }
        } catch (e) {
            Logger.warn('DYNAMIC_FONT', '폰트 CSS 주입 실패', e);
        }
    }, []);

    // 🔥 사용 가능한 폰트 로드
    const loadAvailableFonts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 폰트 서비스 초기화
            await (window as any).electronAPI?.font?.initialize?.();

            // 🔥 폰트 패밀리 기반 조합 (fonts/{dir} 구조)
            const [fontFamiliesResponse, staticFontsResponse] = await Promise.all([
                (window as any).electronAPI?.font?.getFontFamilies?.() || { success: false, data: [] },
                (window as any).electronAPI?.font?.getStaticFonts?.() || {}
            ]);
            
            // 🔥 IPC 응답 형식 처리: { success: boolean, data: FontFamily[] }
            const fontFamilies = fontFamiliesResponse?.success ? fontFamiliesResponse.data : [];
            const staticFonts = Array.isArray(staticFontsResponse) ? staticFontsResponse : (staticFontsResponse?.data || []);

            // 🔥 FontFamily를 UI 옵션으로 변환 (안전한 변환 + 고유 키 생성)
            const dynamicFonts = fontFamilies.flatMap((family: any, familyIndex: number) => {
                if (!family || !Array.isArray(family.fonts)) {
                    Logger.warn('DYNAMIC_FONT', 'Invalid family or fonts', { family });
                    return [];
                }
                
                return family.fonts.map((font: any, fontIndex: number) => {
                    // 🔥 실제 폰트명 우선 사용, 없으면 고유한 value 생성
                    const familyName = family?.name || family?.displayName || 'unknown';
                    const style = font?.style || 'Regular';
                    const weight = font?.weight || '400';
                    const actualFontName = font?.actualName;
                    const uniqueValue = actualFontName || font?.name || `${familyName}-${style}-${weight}-${familyIndex}-${fontIndex}`;
                    
                    return {
                        value: uniqueValue,
                        label: `${actualFontName || family?.displayName || family?.name || 'Unknown'} (${style} ${weight})`,
                        category: family?.category || 'other'
                    };
                });
            });

            const allFonts = [
                ...staticFonts,
                ...dynamicFonts
            ];

            setAvailableFonts(allFonts);

            // 폰트 CSS 주입
            await injectFontCSS();

            Logger.info('DYNAMIC_FONT', '폰트 목록 로드 완료', {
                fontFamiliesCount: fontFamilies.length,
                dynamicCount: dynamicFonts.length,
                staticCount: staticFonts.length,
                totalCount: allFonts.length
            });
        } catch (e) {
            Logger.error('DYNAMIC_FONT', '폰트 로드 실패', e);
            setError('폰트를 불러오는데 실패했습니다.');

            // 폴백 폰트 목록
            setAvailableFonts([
                { value: 'system-ui, sans-serif', label: '시스템 기본', category: 'system' },
                { value: '-apple-system, BlinkMacSystemFont, sans-serif', label: 'Apple 시스템', category: 'system' },
            ]);
        } finally {
            setLoading(false);
        }
    }, [injectFontCSS]);

    // 🔥 초기 로드
    useEffect(() => {
        (async () => {
            await loadAvailableFonts();

            // 현재 적용된 폰트 감지
            const initial = (
                getComputedStyle(document.documentElement).getPropertyValue('--app-font-family') ||
                getComputedStyle(document.body).fontFamily
            ).trim();
            setCurrentFont(initial);
        })();
    }, [loadAvailableFonts]);

    // 🔥 폰트 적용 - 기가차드 강화버전 + 사이즈 정규화
    const setFont = useCallback((family: string) => {
        try {
            // 🔥 CSS 변수와 body 동시 적용으로 깜빡임 방지
            document.documentElement.style.setProperty('--app-font-family', family);
            document.body.style.fontFamily = family;

            // 🔥 폰트 정규화 스타일 적용
            const normalizeStyle = `
                font-size-adjust: 0.5 !important;
                line-height: 1.6 !important;
                vertical-align: baseline !important;
            `;

            // ✅ CSS variables로 대체 (성능 최적화: DOM 순회 제거)
            document.documentElement.style.setProperty('--dynamic-font-family', family);
            
            // 특정 텍스트 입력 요소들만 직접 적용 (성능 최적화)
            const targetSelectors = [
                'textarea',
                'input[type="text"]',
                '.text-editor',
                '.idea-content',
                '.synopsis-content'
            ];
            
            targetSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element) => {
                    if (element instanceof HTMLElement) {
                        element.style.fontFamily = family;
                        element.style.fontSizeAdjust = '0.5';
                        element.style.lineHeight = '1.6';
                        element.style.verticalAlign = 'baseline';
                    }
                });
            });

            setCurrentFont(family);
            Logger.info('DYNAMIC_FONT', '✅ CSS 변수 기반 폰트 적용 완료 (성능 최적화)', {
                family,
                method: 'CSS-variables + targeted-elements'
            });
        } catch (e) {
            Logger.error('DYNAMIC_FONT', '폰트 적용 실패', e);
        }
    }, []);

    // 🔥 폰트 리로드
    const reload = useCallback(async () => {
        try {
            await (window as any).electronAPI?.font?.reload?.();
            await loadAvailableFonts();
        } catch (e) {
            Logger.error('DYNAMIC_FONT', '폰트 리로드 실패', e);
        }
    }, [loadAvailableFonts]);

    return {
        currentFont,
        availableFonts,
        setFont,
        loading,
        error,
        reload
    };
}

export default useDynamicFont;
