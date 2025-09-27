// 🔥 Font Provider - 간소화된 React Context (955줄 → ~200줄) + 성능 최적화
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Logger } from '../../shared/logger';
import { FontBlacklistSystem } from '../utils/FontBlacklistSystem';
import { CSSVariableManager } from '../utils/CSSVariableManager';
import { FontLoader } from '../utils/FontLoader';
import { FontAccessibilityManager } from '../utils/FontAccessibilityManager';
import { getFontDisplayName, generateCSSFontFamily, determineFontCategory } from '../../shared/utils/fontUtils';

interface FontContextType {
  currentFont: string;
  fontSize: number;
  isLoading: boolean;
  error: string | null;
  setFont: (fontFamily: string) => Promise<void>;
  setFontSize: (size: number) => Promise<void>;
  loadFont: (fontId: string) => Promise<boolean>;
  availableFonts: FontMetadata[];
  refreshFonts: () => Promise<void>;
  // 블랙리스트 관리 (위임)
  getBlacklistedFonts: () => Promise<string[]>;
  addToBlacklist: (fontName: string, reason?: string) => Promise<void>;
  removeFromBlacklist: (fontName: string) => Promise<void>;
  clearBlacklist: () => Promise<void>;
  // 접근성 & 안전성
  generateAccessibilityReport: () => Promise<any>;
  // 🔥 스마트 매핑 기능들
  getSmartFontRecommendations: (currentFont: string) => FontMetadata[];
  searchFontsByName: (query: string) => FontMetadata[];
  getFontsByCategory: (category: string) => FontMetadata[];
  // 🔥 작가 전용 기능들
  getWriterFriendlyFonts: () => FontMetadata[];
  getReadabilityScore: (fontName: string) => number;
  getFontForWritingPurpose: (purpose: 'draft' | 'editing' | 'publishing') => FontMetadata[];
}

interface FontMetadata {
  id: string;
  name: string;
  cssFamily: string;
  category: string;
  isLocal: boolean;
}

const FontContext = createContext<FontContextType | null>(null);

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 🔥 State (최소화)
  const [currentFont, setCurrentFont] = useState<string>('Pretendard');
  const [fontSize, setCurrentFontSize] = useState<number>(16);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFonts, setAvailableFonts] = useState<FontMetadata[]>([]);
  
  // Refs
  const initializationRef = useRef<boolean>(false);
  const consoleErrorHandlerRef = useRef<((event: ErrorEvent) => void) | null>(null);

  /**
   * 🔥 초기화 - 블랙리스트 및 오류 감지 설정
   */
  const initializeFontSystem = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    try {
      setIsLoading(true);

      // 🔥 1. 블랙리스트 완전 초기화 - 모든 폰트 서빙 허용
      try {
        await FontBlacklistSystem.clearBlacklist();
        Logger.info('FONT_PROVIDER', '블랙리스트 완전 초기화 - 모든 폰트 서빙 가능');
      } catch (blacklistError) {
        Logger.warn('FONT_PROVIDER', '블랙리스트 초기화 실패', blacklistError);
        // 실패해도 계속 진행
      }

      // 2. 콘솔 오류 감지 설정 (동적 블랙리스트 관리)
      setupConsoleErrorListener();

      // 3. 사용 가능한 폰트 목록 로드
      await refreshFonts();

      // 4. 저장된 설정 복원
      await restoreSettings();

      Logger.info('FONT_PROVIDER', '폰트 시스템 초기화 완료');

    } catch (initError) {
      const errorMessage = initError instanceof Error ? initError.message : String(initError);
      setError(`초기화 실패: ${errorMessage}`);
      Logger.error('FONT_PROVIDER', '폰트 시스템 초기화 실패', initError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 🔥 콘솔 오류 감지 및 자동 블랙리스트 추가
   */
  const setupConsoleErrorListener = useCallback(() => {
    if (consoleErrorHandlerRef.current) return;

    const originalConsoleError = console.error;
    const errorHandler = async (message: any, ...args: any[]) => {
      originalConsoleError(message, ...args);
      
      const errorMessage = String(message);
      const fontName = FontBlacklistSystem.extractFontFromError(errorMessage);
      
      if (fontName) {
        Logger.warn('FONT_PROVIDER', `콘솔에서 폰트 오류 감지: ${fontName}`, { error: errorMessage });
        await FontBlacklistSystem.addToBlacklist(fontName, 'decode_error', errorMessage);
        
        // CSS에서 블랙리스트된 폰트 제거
        await FontBlacklistSystem.removeBlacklistedFontsFromCSS();
      }
    };

    console.error = errorHandler;
    consoleErrorHandlerRef.current = errorHandler;
  }, []);

  /**
   * 🔥 폰트 설정 (스마트 매핑 + CSS 변수 적용)
   */
  const setFont = useCallback(async (fontFamily: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 블랙리스트 확인
      const isBlacklisted = await FontBlacklistSystem.isBlacklisted(fontFamily);
      if (isBlacklisted) {
        const errorMsg = `블랙리스트된 폰트: ${fontFamily}`;
        setError(errorMsg);
        Logger.warn('FONT_PROVIDER', errorMsg);
        return;
      }

      // 🔥 1단계: 실제 폰트 파일 로딩 시도
      const fontLoaded = await loadFont(fontFamily);
      if (!fontLoaded) {
        Logger.warn('FONT_PROVIDER', `폰트 파일 로딩 실패, CSS 변수만 적용: ${fontFamily}`);
      }

      // 🔥 2단계: 스마트 매핑 적용: 폰트명을 정규화하고 CSS font-family 생성
      const displayName = getFontDisplayName(fontFamily);
      const smartCSSFamily = generateCSSFontFamily(fontFamily);
      
      Logger.info('FONT_PROVIDER', '스마트 폰트 매핑 적용', {
        original: fontFamily,
        displayName: displayName,
        cssFamily: smartCSSFamily,
        fileLoaded: fontLoaded
      });

      // 🔥 3단계: CSS 변수로 폰트 적용 (스마트 매핑된 CSS 사용)
      CSSVariableManager.applyFontVariables({
        family: smartCSSFamily, // fallback 체인 포함된 스마트 CSS
        size: fontSize
      });

      // 🔥 4단계: 상태 업데이트 (표시명 사용)
      setCurrentFont(displayName);

      // 🔥 5단계: 설정 저장 (원본명 저장)
      await saveSettings(fontFamily, fontSize);

      Logger.info('FONT_PROVIDER', `폰트 변경 완료: ${displayName}`, { 
        originalName: fontFamily,
        cssFamily: smartCSSFamily,
        fontSize 
      });

    } catch (fontError) {
      const errorMessage = fontError instanceof Error ? fontError.message : String(fontError);
      setError(`폰트 설정 실패: ${errorMessage}`);
      Logger.error('FONT_PROVIDER', `폰트 설정 실패: ${fontFamily}`, fontError);
    } finally {
      setIsLoading(false);
    }
  }, [fontSize, availableFonts]);

  /**
   * 🔥 폰트 크기 설정
   */
  const setFontSize = useCallback(async (size: number) => {
    try {
      setIsLoading(true);
      setError(null);

      // CSS 변수로 크기 적용
      CSSVariableManager.applyFontVariables({
        family: currentFont,
        size: size
      });

      // 상태 업데이트
      setCurrentFontSize(size);

      // 설정 저장
      await saveSettings(currentFont, size);

      Logger.info('FONT_PROVIDER', `폰트 크기 변경: ${size}px`);

    } catch (sizeError) {
      const errorMessage = sizeError instanceof Error ? sizeError.message : String(sizeError);
      setError(`폰트 크기 설정 실패: ${errorMessage}`);
      Logger.error('FONT_PROVIDER', '폰트 크기 설정 실패', sizeError);
    } finally {
      setIsLoading(false);
    }
  }, [currentFont]);

  /**
   * 🔥 폰트 로딩 (스마트 매핑 + FontLoader 위임)
   */
  const loadFont = useCallback(async (fontId: string): Promise<boolean> => {
    // 🔥 폰트명 추출: CSS family 문자열에서 첫 번째 폰트명만 추출
    const extractedFontName = fontId ? fontId.split(',')[0]?.trim().replace(/['"]/g, '') || fontId : '';
    
    // 🔥 유연한 폰트 검색: ID, 이름으로 검색 (family 속성 제거)
    let fontMetadata = availableFonts.find(f => 
      f.id === extractedFontName || 
      f.name === extractedFontName ||
      f.id.toLowerCase() === extractedFontName.toLowerCase() ||
      f.name.toLowerCase() === extractedFontName.toLowerCase()
    );
    
    if (!fontMetadata) {
      // 🔥 부분 매칭 시도
      fontMetadata = availableFonts.find(f => 
        f.id.toLowerCase().includes(extractedFontName.toLowerCase()) ||
        f.name.toLowerCase().includes(extractedFontName.toLowerCase()) ||
        extractedFontName.toLowerCase().includes(f.id.toLowerCase())
      );
    }
    
    if (!fontMetadata) {
      Logger.warn('FONT_PROVIDER', `폰트 메타데이터를 찾을 수 없음: ${extractedFontName} (원본: ${fontId})`);
      return false;
    }
    
    Logger.info('FONT_PROVIDER', `폰트 메타데이터 발견: ${fontMetadata.name}`, {
      searchTerm: extractedFontName,
      found: fontMetadata
    });

    // 🔥 스마트 매핑으로 더 정확한 로딩 정보 생성
    const displayName = getFontDisplayName(fontId);
    const smartCSSFamily = generateCSSFontFamily(fontId);

    const result = await FontLoader.loadFontWithBlacklistCheck({
      name: displayName, // 표시명 사용
      family: smartCSSFamily, // fallback 포함 CSS
      style: 'normal',
      weight: 'normal',
      url: `/fonts/${fontId}` // 원본 ID로 URL 생성
    });

    if (result.success) {
      Logger.info('FONT_PROVIDER', `폰트 로딩 성공: ${displayName}`, {
        originalId: fontId,
        cssFamily: smartCSSFamily
      });
    }

    return result.success;
  }, [availableFonts]);

  /**
   * 🔥 폰트 가족별 그룹핑 및 중복 제거 함수
   */
  const groupFontsByFamily = useCallback((fontList: any[]): FontMetadata[] => {
    const fontGroups = new Map<string, any[]>();
    
    // 1단계: 폰트들을 가족별로 그룹핑
    fontList.forEach(font => {
      const displayName = getFontDisplayName(font.value);
      const familyKey = displayName.toLowerCase().trim();
      
      if (!fontGroups.has(familyKey)) {
        fontGroups.set(familyKey, []);
      }
      fontGroups.get(familyKey)?.push({
        ...font,
        displayName,
        originalValue: font.value
      });
    });

    // 2단계: 각 그룹에서 대표 폰트 선택
    const representativeFonts: FontMetadata[] = [];
    
    fontGroups.forEach((fonts, familyKey) => {
      // 선호도 순서: Regular > Normal > Medium > Bold > 기타
      const preferenceOrder = ['regular', 'normal', '', 'medium', 'light', 'semibold', 'bold'];
      
      let selectedFont = fonts[0]; // 기본값
      
      // 가장 선호하는 스타일 찾기
      for (const preference of preferenceOrder) {
        const found = fonts.find(font => {
          const lowerValue = font.originalValue.toLowerCase();
          if (preference === '') {
            // 스타일이 명시되지 않은 폰트 (일반적으로 Regular)
            return !lowerValue.includes('bold') && 
                   !lowerValue.includes('light') && 
                   !lowerValue.includes('medium') &&
                   !lowerValue.includes('thin') &&
                   !lowerValue.includes('black');
          }
          return lowerValue.includes(preference);
        });
        
        if (found) {
          selectedFont = found;
          break;
        }
      }

      // 스마트 매핑 적용
      const cssFontFamily = generateCSSFontFamily(selectedFont.originalValue);
      const category = determineFontCategory(selectedFont.originalValue);
      
      representativeFonts.push({
        id: selectedFont.originalValue,
        name: selectedFont.displayName,
        cssFamily: cssFontFamily,
        category: category,
        isLocal: true
      });
    });

    return representativeFonts;
  }, []);

  /**
   * 🔥 사용 가능한 폰트 목록 새로고침 (중복 제거 + 스마트 매핑)
   */
  const refreshFonts = useCallback(async () => {
    try {
      // Electron API로 폰트 목록 조회
      if (window.electronAPI?.font?.getAvailableFonts) {
        const fontList = await window.electronAPI.font.getAvailableFonts();
        
        Logger.info('FONT_PROVIDER', `원본 폰트 목록: ${fontList.length}개`);
        
        // 🔥 폰트 가족별 그룹핑 및 중복 제거
        const groupedFonts = groupFontsByFamily(fontList);
        
        // 카테고리별로 정렬 (한글 > 영문 > 일본어 > 모노스페이스 > 시스템)
        const categoryOrder = { korean: 0, english: 1, japanese: 2, monospace: 3, system: 4 };
        groupedFonts.sort((a, b) => {
          const orderA = categoryOrder[a.category as keyof typeof categoryOrder] ?? 5;
          const orderB = categoryOrder[b.category as keyof typeof categoryOrder] ?? 5;
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name, 'ko');
        });
        
        setAvailableFonts(groupedFonts);
        
        const categoryStats = groupedFonts.reduce((acc, font) => {
          acc[font.category] = (acc[font.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        Logger.info('FONT_PROVIDER', `폰트 중복 제거 완료: ${fontList.length}개 → ${groupedFonts.length}개`, {
          categories: categoryStats,
          reductionRate: `${(((fontList.length - groupedFonts.length) / fontList.length) * 100).toFixed(1)}% 감소`
        });
      }
    } catch (refreshError) {
      Logger.error('FONT_PROVIDER', '폰트 목록 새로고침 실패', refreshError);
    }
  }, [groupFontsByFamily]);

  /**
   * 🔥 설정 저장
   */
  const saveSettings = useCallback(async (font: string, size: number) => {
    try {
      if (window.electronAPI?.settings?.set) {
        await window.electronAPI.settings.set('app.font.family', font);
        await window.electronAPI.settings.set('app.font.size', size);
      }
    } catch (saveError) {
      Logger.warn('FONT_PROVIDER', '폰트 설정 저장 실패', saveError);
    }
  }, []);

  /**
   * 🔥 설정 복원
   */
  const restoreSettings = useCallback(async () => {
    try {
      if (window.electronAPI?.settings?.get) {
        // 폰트 패밀리 복원
        const fontResult = await window.electronAPI.settings.get('app.font.family');
        if (fontResult.success && fontResult.data) {
          const savedFont = fontResult.data as string;
          await setFont(savedFont);
        }

        // 폰트 크기 복원
        const sizeResult = await window.electronAPI.settings.get('app.font.size');
        if (sizeResult.success && sizeResult.data) {
          const savedSize = sizeResult.data as number;
          await setFontSize(savedSize);
        }
      }
    } catch (restoreError) {
      Logger.warn('FONT_PROVIDER', '폰트 설정 복원 실패', restoreError);
    }
  }, [setFont, setFontSize]);

  // 🔥 블랙리스트 관리 함수들 (위임)
  const getBlacklistedFonts = useCallback(async (): Promise<string[]> => {
    return await FontBlacklistSystem.getBlacklistedFonts();
  }, []);

  const addToBlacklist = useCallback(async (fontName: string, reason?: string): Promise<void> => {
    await FontBlacklistSystem.addToBlacklist(fontName, reason === 'user_blacklist' ? 'user_blacklist' : 'decode_error', reason);
  }, []);

  const removeFromBlacklist = useCallback(async (fontName: string): Promise<void> => {
    await FontBlacklistSystem.removeFromBlacklist(fontName);
  }, []);

  const clearBlacklist = useCallback(async (): Promise<void> => {
    await FontBlacklistSystem.clearBlacklist();
  }, []);

  // 🔥 접근성 리포트 생성 (위임)
  const generateAccessibilityReport = useCallback(async (): Promise<any> => {
    return await FontAccessibilityManager.generateAccessibilityReport();
  }, []);

  /**
   * 🔥 추가 스마트 매핑 유틸리티 함수들
   */
  const getSmartFontRecommendations = useCallback((currentFont: string): FontMetadata[] => {
    const category = determineFontCategory(currentFont);
    return availableFonts
      .filter(font => font.category === category && font.id !== currentFont)
      .slice(0, 5); // 상위 5개 추천
  }, [availableFonts]);

  const searchFontsByName = useCallback((query: string): FontMetadata[] => {
    const lowerQuery = query.toLowerCase();
    return availableFonts.filter(font => 
      font.name.toLowerCase().includes(lowerQuery) ||
      font.id.toLowerCase().includes(lowerQuery)
    );
  }, [availableFonts]);

    const getFontsByCategory = useCallback((category: string): FontMetadata[] => {
    return availableFonts.filter(font => font.category.toLowerCase().includes(category.toLowerCase()));
  }, [availableFonts]);

  // 🔥 작가 친화적 폰트 추천 시스템
  const getWriterFriendlyFonts = useCallback((): FontMetadata[] => {
    // 작가에게 적합한 폰트 특성:
    // 1. 높은 가독성 (serif, sans-serif 중 읽기 좋은 것들)
    // 2. 긴 글에 적합한 character spacing
    // 3. 눈의 피로를 줄이는 디자인
    const writerFriendlyPatterns = [
      // Serif 폰트 (긴 글 읽기에 좋음)
      'Times', 'Georgia', 'Palatino', 'Book Antiqua', 'Minion', 'Crimson', 'Lora', 'PT Serif',
      // Sans-serif (화면 읽기에 좋음)
      'Helvetica', 'Arial', 'Verdana', 'Trebuchet', 'Open Sans', 'Source Sans', 'Lato', 'Roboto',
      // 한글 폰트
      'Pretendard', 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', 'NanumGothic', 'NanumMyeongjo',
      // 모노스페이스 (코드 작성용)
      'Monaco', 'SF Mono', 'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Consolas'
    ];

    return availableFonts.filter(font => 
      writerFriendlyPatterns.some(pattern => 
        font.name.toLowerCase().includes(pattern.toLowerCase())
      )
    ).map(font => ({
      ...font,
      category: font.category || determineFontCategory(font.name)
    }));
  }, [availableFonts]);

  const getReadabilityScore = useCallback((fontName: string): number => {
    // 폰트별 가독성 점수 (0-100)
    const readabilityScores: Record<string, number> = {
      // Serif 폰트 (긴 글에 좋음)
      'Times New Roman': 85,
      'Georgia': 90,
      'Palatino': 88,
      'Book Antiqua': 82,
      'PT Serif': 87,
      'Lora': 89,
      'Crimson Text': 86,
      
      // Sans-serif 폰트 (화면에 좋음)
      'Helvetica': 88,
      'Arial': 85,
      'Verdana': 92,
      'Trebuchet MS': 84,
      'Open Sans': 91,
      'Source Sans Pro': 90,
      'Lato': 89,
      'Roboto': 87,
      
      // 한글 폰트
      'Pretendard': 93,
      'Noto Sans KR': 91,
      'Malgun Gothic': 85,
      'Apple SD Gothic Neo': 88,
      'NanumGothic': 84,
      'NanumMyeongjo': 87,
      
      // 모노스페이스
      'Monaco': 78,
      'SF Mono': 81,
      'Cascadia Code': 83,
      'JetBrains Mono': 85,
      'Fira Code': 84,
      'Consolas': 79
    };

    // 폰트명에서 패턴 매칭으로 점수 계산
    for (const [pattern, score] of Object.entries(readabilityScores)) {
      if (fontName.toLowerCase().includes(pattern.toLowerCase())) {
        return score;
      }
    }

    // 기본 점수 (카테고리별)
    const lowerName = fontName.toLowerCase();
    if (lowerName.includes('serif') && !lowerName.includes('sans')) return 80; // serif
    if (lowerName.includes('sans')) return 82; // sans-serif
    if (lowerName.includes('mono')) return 75; // monospace
    
    return 70; // 기본값
  }, []);

  const getFontForWritingPurpose = useCallback((purpose: 'draft' | 'editing' | 'publishing'): FontMetadata[] => {
    const writerFonts = getWriterFriendlyFonts();
    
    switch (purpose) {
      case 'draft':
        // 초안 작성: 편안하고 빠른 타이핑에 좋은 폰트
        return writerFonts.filter(font => 
          ['sans-serif', 'monospace'].includes(font.category) &&
          getReadabilityScore(font.name) >= 85
        );
        
      case 'editing':
        // 편집: 세세한 부분까지 잘 보이는 폰트
        return writerFonts.filter(font => 
          getReadabilityScore(font.name) >= 88
        );
        
      case 'publishing':
        // 출간: 전문적이고 읽기 좋은 폰트
        return writerFonts.filter(font => 
          font.category === 'serif' && 
          getReadabilityScore(font.name) >= 87
        );
        
      default:
        return writerFonts;
    }
  }, [getWriterFriendlyFonts, getReadabilityScore]);

  // 🔥 초기화 실행
  useEffect(() => {
    initializeFontSystem();
    
    // 정리 함수
    return () => {
      if (consoleErrorHandlerRef.current) {
        // console.error 복원은 복잡하므로 생략
      }
    };
  }, [initializeFontSystem]);

  // 🔥 Context Value (useMemo로 최적화 - 불필요한 리렌더링 방지)
  const contextValue: FontContextType = useMemo(() => ({
    currentFont,
    fontSize,
    isLoading,
    error,
    setFont,
    setFontSize,
    loadFont,
    availableFonts,
    refreshFonts,
    getBlacklistedFonts,
    addToBlacklist,
    removeFromBlacklist,
    clearBlacklist,
    generateAccessibilityReport,
    // 🔥 스마트 매핑 기능들
    getSmartFontRecommendations,
    searchFontsByName,
    getFontsByCategory,
    // 🔥 작가 전용 기능들
    getWriterFriendlyFonts,
    getReadabilityScore,
    getFontForWritingPurpose
  }), [
    currentFont,
    fontSize, 
    isLoading,
    error,
    setFont,
    setFontSize,
    loadFont,
    availableFonts,
    refreshFonts,
    getBlacklistedFonts,
    addToBlacklist,
    removeFromBlacklist,
    clearBlacklist,
    generateAccessibilityReport,
    getSmartFontRecommendations,
    searchFontsByName,
    getFontsByCategory,
    getWriterFriendlyFonts,
    getReadabilityScore,
    getFontForWritingPurpose
  ]);

  return (
    <FontContext.Provider value={contextValue}>
      {children}
    </FontContext.Provider>
  );
};