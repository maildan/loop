// 🔥 동적 폰트 훅 - public/fonts TTF 기반
import { useState, useEffect, useCallback } from 'react';
import { Logger } from '../../shared/logger';
import { getFontDisplayName } from '../../shared/utils/fontUtils';

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

    // 🔥 폰트 CSS 주입 - webContents 우선, DOM 폴백
    const injectFontCSS = useCallback(async () => {
        try {
            // 🔥 1차 시도: webContents.insertCSS 사용
            const result = await (window as any).electronAPI?.font?.injectCSS?.();
            
            if (result?.success) {
                Logger.info('DYNAMIC_FONT', '✅ webContents를 통한 폰트 CSS 주입 성공', {
                    cssKey: result.cssKey,
                    method: 'webContents-injection'
                });
                return;
            }

            // 🔥 2차 시도: 폴백 DOM 방식
            Logger.warn('DYNAMIC_FONT', '⚠️ webContents 주입 실패, DOM 폴백 시도', {
                error: result?.error
            });

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

                Logger.info('DYNAMIC_FONT', '✅ DOM 폴백을 통한 폰트 CSS 주입 완료', { 
                    cssLength: normalizedCSS.length,
                    method: 'DOM-fallback'
                });
            }
        } catch (e) {
            Logger.error('DYNAMIC_FONT', '❌ 모든 폰트 CSS 주입 방식 실패', e);
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

            // 🔥 디버깅: 전체 응답 데이터 구조 로깅
            Logger.debug('DYNAMIC_FONT', 'IPC 응답 데이터 분석', {
                fontFamiliesResponse: {
                    success: fontFamiliesResponse?.success,
                    dataType: Array.isArray(fontFamiliesResponse?.data) ? 'array' : typeof fontFamiliesResponse?.data,
                    dataLength: fontFamiliesResponse?.data?.length,
                    sampleData: fontFamiliesResponse?.data?.[0]
                },
                staticFontsResponse: {
                    type: Array.isArray(staticFontsResponse) ? 'array' : typeof staticFontsResponse,
                    length: Array.isArray(staticFontsResponse) ? staticFontsResponse.length : staticFontsResponse?.data?.length,
                    sampleStatic: Array.isArray(staticFontsResponse) ? staticFontsResponse[0] : staticFontsResponse?.data?.[0]
                }
            });

            // 🔥 FontFamily를 UI 옵션으로 변환 (안전한 변환 + 고유 키 생성)
            const dynamicFonts = fontFamilies.flatMap((family: any, familyIndex: number) => {
                if (!family || !Array.isArray(family.fonts)) {
                    Logger.warn('DYNAMIC_FONT', 'Invalid family or fonts', { family });
                    return [];
                }
                
                // 🔥 디버깅: 실제 family 데이터 구조 로깅
                Logger.debug('DYNAMIC_FONT', 'FontFamily 구조 분석', {
                    familyIndex,
                    name: family?.name,
                    displayName: family?.displayName,
                    category: family?.category,
                    fontsCount: family?.fonts?.length,
                    sampleFont: family?.fonts?.[0]
                });
                
                return family.fonts.map((font: any, fontIndex: number) => {
                    // 🔥 실제 폰트명 우선 사용, 없으면 고유한 value 생성
                    const familyName = family?.name || family?.displayName || 'unknown';
                    const style = font?.style || 'Regular';
                    const weight = font?.weight || '400';
                    const actualFontName = font?.actualName;
                    const uniqueValue = actualFontName || font?.name || `${familyName}-${style}-${weight}-${familyIndex}-${fontIndex}`;
                    
                    // 🔥 디버깅: 개별 font 데이터 구조 로깅
                    Logger.debug('DYNAMIC_FONT', 'Font 구조 분석', {
                        familyIndex,
                        fontIndex,
                        font: {
                            name: font?.name,
                            actualName: font?.actualName,
                            style: font?.style,
                            weight: font?.weight,
                            path: font?.path
                        },
                        generatedValue: uniqueValue,
                        displayLabel: `${actualFontName || family?.displayName || family?.name || 'Unknown'} (${style} ${weight})`
                    });
                    
                    // 🔥 폰트명 정규화 - fontUtils 사용 (통합된 매핑 시스템)
                    const rawName = actualFontName || family?.displayName || family?.name || 'Unknown';
                    const normalizedName = getFontDisplayName(rawName);
                    
                    return {
                        value: uniqueValue,
                        label: `${normalizedName} (${style} ${weight})`,
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

    // 🔥 테마 변경 감지 및 자동 폰트 리로딩
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
                    
                    const target = mutation.target as HTMLElement;
                    const isDarkMode = target.classList.contains('dark') || 
                                     target.getAttribute('data-theme') === 'dark';
                    
                    Logger.info('DYNAMIC_FONT', '🔥 테마 변경 감지, 폰트 재적용 시작', {
                        isDarkMode,
                        classes: target.className,
                        dataTheme: target.getAttribute('data-theme')
                    });
                    
                    // 폰트 CSS 재주입
                    (async () => {
                        try {
                            const result = await (window as any).electronAPI?.font?.injectCSS?.();
                            if (result?.success) {
                                Logger.info('DYNAMIC_FONT', '✅ 테마 변경 시 폰트 자동 재적용 성공', {
                                    cssKey: result.cssKey,
                                    isDarkMode
                                });
                            }
                        } catch (error) {
                            Logger.error('DYNAMIC_FONT', '❌ 테마 변경 시 폰트 재적용 실패', error);
                        }
                    })();
                    
                    break; // 하나의 변경만 처리
                }
            }
        });

        // HTML 요소의 class와 data-theme 속성 변경 감지
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        return () => observer.disconnect();
    }, []);

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

    // 🔥 폴백 DOM 폰트 주입 방식 (기존 방식)
    const fallbackDOMFontInjection = useCallback(async () => {
        try {
            // 기존 CSS 재생성 및 주입
            const css = await (window as any).electronAPI?.font?.generateCSS?.();
            if (css) {
                // 기존 동적 폰트 스타일 제거
                const existingStyle = document.getElementById('dynamic-fonts');
                if (existingStyle) {
                    existingStyle.remove();
                }

                // 새 폰트 스타일 추가
                const style = document.createElement('style');
                style.id = 'dynamic-fonts';
                style.textContent = css;
                document.head.appendChild(style);

                Logger.info('DYNAMIC_FONT', '폴백 DOM CSS 주입 완료', { cssLength: css.length });
            }
        } catch (error) {
            Logger.error('DYNAMIC_FONT', '폴백 DOM CSS 주입 실패', error);
        }
    }, []);

    // 🔥 폰트 적용 - webContents CSS 주입 방식 (스마트 매핑 포함)
    const setFont = useCallback(async (family: string) => {
        try {
            // 🔥 동적 스마트 매핑: 선택된 값을 실제 CSS font-family로 변환
            const smartFontMapping = (fontValue: string): string => {
                if (!fontValue || fontValue.trim() === '') {
                    return 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
                }

                // 이미 CSS font-family 형태인 경우 (쉼표 포함)
                if (fontValue.includes(',')) {
                    return fontValue;
                }

                // 동적 폰트 타입 감지 및 폴백 체인 생성
                const detectFontType = (name: string) => {
                    const lowerName = name.toLowerCase();
                    
                    if (/nanum|나눔|malgun|맑은|gothic|바탕|dotum|돋움/.test(lowerName)) {
                        return 'korean';
                    } else if (/hiragino|yu.gothic|meiryo|ms.gothic/.test(lowerName)) {
                        return 'japanese';
                    } else if (/mono|code|consolas|menlo|courier/.test(lowerName)) {
                        return 'monospace';
                    } else if (/serif|times|georgia/.test(lowerName)) {
                        return 'serif';
                    }
                    return 'sans-serif';
                };

                const fontType = detectFontType(fontValue);
                const quotedFont = `"${fontValue}"`;

                // 타입별 폴백 체인 생성
                const fallbackChains = {
                    korean: `${quotedFont}, "Apple SD Gothic Neo", "Noto Sans CJK KR", "Malgun Gothic", sans-serif`,
                    japanese: `${quotedFont}, "Hiragino Sans", "Yu Gothic", sans-serif`,
                    monospace: `${quotedFont}, "SF Mono", "Monaco", "Menlo", "Consolas", monospace`,
                    serif: `${quotedFont}, "Times New Roman", "Georgia", serif`,
                    'sans-serif': `${quotedFont}, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
                };

                return fallbackChains[fontType];
            };

            const cssFamily = smartFontMapping(family);
            
            Logger.info('DYNAMIC_FONT', '🔥 동적 스마트 매핑 적용', {
                originalValue: family,
                mappedCSSFamily: cssFamily
            });

            // 🔥 1. CSS 변수 즉시 적용 (UI 반응성) - 변환된 CSS 값 사용
            document.documentElement.style.setProperty('--app-font-family', cssFamily);
            document.body.style.fontFamily = cssFamily;

            // 🔥 2. webContents를 통한 CSS 주입으로 전체 폰트 정의 새로고침
            try {
                const result = await (window as any).electronAPI?.font?.injectCSS?.();
                
                if (result?.success) {
                    Logger.info('DYNAMIC_FONT', '✅ webContents CSS 주입 성공', {
                        family,
                        cssKey: result.cssKey,
                        method: 'webContents-injection'
                    });
                } else {
                    Logger.warn('DYNAMIC_FONT', '⚠️ webContents CSS 주입 실패, 폴백 처리', {
                        family,
                        error: result?.error
                    });
                    // 폴백: 기존 DOM 방식
                    await fallbackDOMFontInjection();
                }
            } catch (injectionError) {
                Logger.error('DYNAMIC_FONT', '❌ CSS 주입 API 호출 실패, 폴백 처리', injectionError);
                // 폴백: 기존 DOM 방식
                await fallbackDOMFontInjection();
            }

            setCurrentFont(family);
            Logger.info('DYNAMIC_FONT', '✅ CSS 변수 기반 폰트 적용 완료 (성능 최적화)', {
                family,
                method: 'webContents-injection + CSS-variables'
            });
        } catch (e) {
            Logger.error('DYNAMIC_FONT', '폰트 적용 실패', e);
        }
    }, [fallbackDOMFontInjection]);

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
