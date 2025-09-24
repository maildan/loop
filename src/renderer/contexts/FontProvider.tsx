// 🔥 Font Provider - React Context로 실시간 폰트 관리
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Logger } from '../../shared/logger';
import persistentFontManager from '../utils/persistentFontManager';

// 🔥 폰트 설정 상수들
const FONT_CONFIG = {
  DEFAULT_FALLBACK: 'system-ui, sans-serif',
  DEFAULT_FONT_SIZE: 14,
  BLACKLIST_DURATION: 7 * 24 * 60 * 60 * 1000, // 7일
  MAX_ERROR_COUNT: 3,
  FONT_SERVER_PORT: 35821, // 동적으로 가져올 수 있도록 나중에 개선
  STORAGE_KEY: 'loop-font-blacklist'
} as const;

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
  // 🔥 블랙리스트 관리 함수들
  getBlacklistedFonts: () => string[];
  addToBlacklist: (fontName: string, reason?: string) => void;
  removeFromBlacklist: (fontName: string) => void;
  clearBlacklist: () => void;
}

interface FontMetadata {
  id: string;
  name: string;
  cssFamily: string;
  category: string;
  isLocal: boolean;
}

// 🔥 동적 블랙리스트 시스템
interface FontBlacklistEntry {
  fontName: string;
  reason: 'cff_error' | 'decode_error' | 'ots_error' | 'user_blacklist' | 'loading_timeout';
  timestamp: number;
  errorCount: number;
  lastError?: string;
}

interface FontErrorPattern {
  pattern: RegExp;
  reason: FontBlacklistEntry['reason'];
  extractFontName?: (match: RegExpMatchArray) => string;
}

// 🔥 폰트 오류 패턴 정의 (확장 가능) - 동적 서버 URL 지원
const createFontErrorPatterns = (fontServerPort: number = FONT_CONFIG.FONT_SERVER_PORT): FontErrorPattern[] => [
  {
    // Renderer 콘솔 로그 형식: 동적 포트 지원
    pattern: new RegExp(`Failed to decode downloaded font:\\s*https?:\\/\\/[^\\/]+:${fontServerPort}\\/fonts\\/[^\\/]+\\/([^\\/\\s]+\\.(otf|ttf|woff2?))`, 'i'),
    reason: 'decode_error',
    extractFontName: (match) => match[1] ? decodeURIComponent(match[1]) : 'unknown'
  },
  {
    // 일반적인 decode 에러 패턴
    pattern: /Failed to decode downloaded font:\s*https?:\/\/[^\/]+\/fonts\/[^\/]+\/([^\/\s]+\.(otf|ttf|woff2?))/i,
    reason: 'decode_error',
    extractFontName: (match) => match[1] ? decodeURIComponent(match[1]) : 'unknown'
  },
  {
    // 기존 패턴 유지
    pattern: /Failed to decode downloaded font.*\/([^\/]+\.(otf|ttf|woff2?))$/i,
    reason: 'decode_error',
    extractFontName: (match) => match[1] ? decodeURIComponent(match[1]) : 'unknown'
  },
  {
    // CFF 파싱 에러 (강원 폰트 문제)
    pattern: /OTS parsing error: CFF.*Failed to parse Name INDEX data/i,
    reason: 'cff_error'
  },
  {
    // TSI3 에러 (나눔고딕 문제)
    pattern: /OTS parsing error: TSI3.*zero-length table/i,
    reason: 'ots_error'
  },
  {
    pattern: /OTS parsing error: CFF.*table/i,
    reason: 'cff_error'
  },
  {
    pattern: /OTS parsing error.*Failed to parse table/i,
    reason: 'ots_error'
  },
  {
    pattern: /FontFace.*failed.*decode/i,
    reason: 'decode_error'
  }
];

// 🔥 전역 폰트 에러 패턴 인스턴스 (기본 포트로 초기화)
const FONT_ERROR_PATTERNS = createFontErrorPatterns();

/**
 * 🔥 동적 블랙리스트 매니저
 */
class FontBlacklistManager {
  private static readonly STORAGE_KEY = FONT_CONFIG.STORAGE_KEY;
  private static readonly MAX_ERROR_COUNT = FONT_CONFIG.MAX_ERROR_COUNT;
  private static readonly BLACKLIST_DURATION = FONT_CONFIG.BLACKLIST_DURATION;

  static getBlacklist(): FontBlacklistEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const entries = JSON.parse(stored) as FontBlacklistEntry[];
      // 만료된 항목 제거
      const now = Date.now();
      const validEntries = entries.filter(entry =>
        now - entry.timestamp < this.BLACKLIST_DURATION
      );

      if (validEntries.length !== entries.length) {
        this.saveBlacklist(validEntries);
      }

      return validEntries;
    } catch (e) {
      Logger.warn('FONT_BLACKLIST', 'Failed to load blacklist', e);
      return [];
    }
  }

  static saveBlacklist(entries: FontBlacklistEntry[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      Logger.warn('FONT_BLACKLIST', 'Failed to save blacklist', e);
    }
  }

  private static isProcessing = false;

  static addToBlacklist(fontName: string, reason: FontBlacklistEntry['reason'], error?: string): void {
    // 순환 호출 방지
    if (this.isProcessing) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      const entries = this.getBlacklist();
      const existing = entries.find(entry => entry.fontName === fontName);

      if (existing) {
        existing.errorCount++;
        existing.timestamp = Date.now();
        existing.lastError = error;
      } else {
        entries.push({
          fontName,
          reason,
          timestamp: Date.now(),
          errorCount: 1,
          lastError: error
        });
      }

      this.saveBlacklist(entries);
      
      // Logger 대신 직접 console 호출로 순환 방지
      console.log(`[FONT_BLACKLIST] 폰트 블랙리스트 추가: ${fontName}`, { reason, error: error?.substring(0, 100) });
    } finally {
      this.isProcessing = false;
    }
  }

  static isBlacklisted(fontName: string): boolean {
    const entries = this.getBlacklist();
    return entries.some(entry =>
      entry.fontName === fontName ||
      fontName.includes(entry.fontName) ||
      entry.fontName.includes(fontName)
    );
  }

  static removeFromBlacklist(fontName: string): void {
    const entries = this.getBlacklist();
    const filtered = entries.filter(entry => entry.fontName !== fontName);
    this.saveBlacklist(filtered);
    Logger.info('FONT_BLACKLIST', `폰트 블랙리스트 제거: ${fontName}`);
  }

  static getBlacklistedFonts(): string[] {
    return this.getBlacklist().map(entry => entry.fontName);
  }

  // 🔥 콘솔 오류 메시지에서 폰트 이름 추출 (강화된 버전)
  static extractFontFromError(errorMessage: string): string | null {
    // 패턴 매칭 우선 시도
    for (const pattern of FONT_ERROR_PATTERNS) {
      const match = errorMessage.match(pattern.pattern);
      if (match) {
        if (pattern.extractFontName) {
          const fontName = pattern.extractFontName(match);
          if (fontName && fontName !== 'unknown') {
            return fontName;
          }
        }
      }
    }

    // 백업 추출 방법들
    const extractionMethods = [
      // Renderer 콘솔 URL 형식: "http://localhost:35821/fonts/Gangwon_mac/gaw.otf"
      /https?:\/\/[^\/]+\/fonts\/[^\/]+\/([^\/\s]+\.(otf|ttf|woff2?))/i,
      // 일반 URL 패턴
      /\/([^\/]*\.(otf|ttf|woff2?))(?:\s|$)/i,
      // 파일명만 추출
      /([a-zA-Z0-9_-]+\.(otf|ttf|woff2?))/i
    ];

    for (const regex of extractionMethods) {
      const match = errorMessage.match(regex);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }

    // 알려진 문제 폰트들 매칭
    const knownProblematicFonts = [
      'gaw.otf', 'gaw_Bold.otf', // 강원 폰트
      'NanumGothicBold.otf', 'NanumGothic.otf', // 나눔고딕
      'Gangwon', 'NanumGothic' // 폰트 패밀리명
    ];

    for (const font of knownProblematicFonts) {
      if (errorMessage.toLowerCase().includes(font.toLowerCase())) {
        return font;
      }
    }

    return null;
  }
}

const FontContext = createContext<FontContextType | null>(null);

/**
 * 🔥 Font Provider - 앱 전체의 폰트 상태 관리 - 즉시 적용 강화버전
 */
export function FontProvider({ children }: { children: React.ReactNode }) {
  const [currentFont, setCurrentFont] = useState<string>(() => {
    // 🔥 기본값으로 시작 (비동기 로딩은 useEffect에서 처리)
    return FONT_CONFIG.DEFAULT_FALLBACK;
  });

  const [fontSize, setFontSizeState] = useState<number>(() => {
    // 🔥 기본값으로 시작 (비동기 로딩은 useEffect에서 처리)  
    return FONT_CONFIG.DEFAULT_FONT_SIZE;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFonts, setAvailableFonts] = useState<FontMetadata[]>([]);
  // pendingDynamicCss stores generated dynamic CSS from the font service
  const pendingDynamicCssRef = useRef<string | null>(null);

  /**
   * 🔥 다른 폰트 시스템들과의 충돌 방지 (최우선 초기화)
   */
  useEffect(() => {
    // 다른 폰트 시스템들의 간섭 차단
    const disableOtherFontSystems = () => {
      try {
        // 기존 폰트 관련 스타일들 제거
        const existingFontStyles = document.querySelectorAll('style[id*="font"], style[id*="dynamic"]');
        existingFontStyles.forEach(style => {
          if (style.id !== 'global-font-style' && style.id !== 'dynamic-fonts') {
            style.remove();
          }
        });

        // 다른 폰트 매니저 hooks 비활성화 (일시적)
        (window as any).__fontManagerDisabled = true;

        // 🔥 강화된 충돌 방지: 다른 폰트 로더들 차단
        const fontObservers = document.querySelectorAll('[data-font-observer]');
        fontObservers.forEach(observer => observer.remove());

        // 🔥 CSS 변수 강제 설정으로 다른 시스템 무력화
        document.documentElement.style.setProperty('--font-loading-disabled', 'true');

        Logger.info('FONT_PROVIDER', '🔥 다른 폰트 시스템들 간섭 차단 완료 (강화됨)');
      } catch (e) {
        Logger.warn('FONT_PROVIDER', '폰트 시스템 간섭 차단 실패', e);
      }
    };

    disableOtherFontSystems();

    // 🔥 FIXED: 2초 interval 제거 - 이것이 무한 렌더링의 원인이었음!
    // 필요시에만 실행되도록 최적화
    let timeoutId: NodeJS.Timeout;
    const scheduleCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // 페이지 포커스나 폰트 로딩 중에만 검사
        if (document.hasFocus() && document.visibilityState === 'visible') {
          disableOtherFontSystems();
        }
      }, 10000); // 10초로 늘리고 조건부 실행
    };

    // 페이지 포커스/가시성 변경시에만 검사
    document.addEventListener('visibilitychange', scheduleCheck);
    window.addEventListener('focus', scheduleCheck);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', scheduleCheck);
      window.removeEventListener('focus', scheduleCheck);
    };
  }, []);  /**
   * 🔥 콘솔 오류 감지 및 자동 블랙리스트 추가 (강화된 버전)
   */
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    let isHandlingConsoleMessage = false;

    const handleConsoleMessage = (message: string, type: 'error' | 'warn' | 'info') => {
      // 순환 호출 방지
      if (isHandlingConsoleMessage) {
        return;
      }
      
      // 자기 자신이 생성한 메시지 무시
      if (message.includes('[FONT_BLACKLIST]') || message.includes('FONT_PROVIDER')) {
        return;
      }

      isHandlingConsoleMessage = true;
      
      try {
        // 폰트 관련 오류 감지 (더 포괄적)
        const isFont관련 = message.includes('font') || 
                        message.includes('Font') || 
                        message.includes('OTS') || 
                        message.includes('decode') ||
                        message.includes('.otf') ||
                        message.includes('.ttf') ||
                        message.includes('.woff');

        if (isFont관련) {
          const fontName = FontBlacklistManager.extractFontFromError(message);
          if (fontName) {
            const reason = message.includes('CFF') ? 'cff_error' :
              message.includes('TSI3') ? 'ots_error' :
              message.includes('decode') ? 'decode_error' : 'ots_error';
            
            FontBlacklistManager.addToBlacklist(fontName, reason, message);
            // Logger 대신 직접 console.log 사용
            console.log(`[FONT_PROVIDER] 🚫 문제 폰트 블랙리스트 추가: ${fontName}`, { reason, message: message.substring(0, 200) });

            // 현재 CSS에서 해당 폰트 제거
            setTimeout(() => {
              removeProblematicFontFromCSS(fontName);
            }, 100);
          }
        }
      } finally {
        isHandlingConsoleMessage = false;
      }
    };

    // 콘솔 메서드 오버라이드 (info도 포함)
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      handleConsoleMessage(message, 'error');
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      handleConsoleMessage(message, 'warn');
      originalConsoleWarn.apply(console, args);
    };

    console.info = (...args: any[]) => {
      const message = args.join(' ');
      handleConsoleMessage(message, 'info');
      originalConsoleInfo.apply(console, args);
    };

    // 🔥 미리 알려진 문제 폰트들 블랙리스트에 추가
    const knownProblematicFonts = [
      { name: 'gaw.otf', reason: 'cff_error' as const },
      { name: 'gaw_Bold.otf', reason: 'cff_error' as const },
      { name: 'NanumGothicBold.otf', reason: 'ots_error' as const }
    ];

    knownProblematicFonts.forEach(({ name, reason }) => {
      if (!FontBlacklistManager.isBlacklisted(name)) {
        FontBlacklistManager.addToBlacklist(name, reason, 'Pre-emptive blacklist based on known issues');
      }
    });

    // 정리
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
    };
  }, []);

  /**
   * 🔥 문제 폰트를 CSS에서 즉시 제거 (debounced)
   */
  const removeProblematicFontFromCSS = useCallback((fontName: string) => {
    // 🔥 debounce로 DOM 조작 최소화
    const debounceKey = `remove-${fontName}`;
    if ((window as any).__fontRemovalTimeouts?.[debounceKey]) {
      clearTimeout((window as any).__fontRemovalTimeouts[debounceKey]);
    }

    if (!(window as any).__fontRemovalTimeouts) {
      (window as any).__fontRemovalTimeouts = {};
    }

    (window as any).__fontRemovalTimeouts[debounceKey] = setTimeout(() => {
      try {
        const dynamicFontStyle = document.getElementById('dynamic-fonts');
        if (dynamicFontStyle && dynamicFontStyle.textContent) {
          let css = dynamicFontStyle.textContent;

          // Remove @font-face blocks that reference the fontName (safe string parsing)
          try {
            let lowerCss = css.toLowerCase();
            const lowerFont = fontName.toLowerCase();
            let out = '';
            let pos = 0;
            while (true) {
              const start = lowerCss.indexOf('@font-face', pos);
              if (start === -1) {
                out += css.slice(pos);
                break;
              }
              // append content before this block
              out += css.slice(pos, start);
              const blockStart = start;
              const blockEnd = lowerCss.indexOf('}', blockStart);
              if (blockEnd === -1) {
                // malformed, stop
                out += css.slice(start);
                break;
              }
              const block = lowerCss.slice(blockStart, blockEnd + 1);
              if (block.includes(lowerFont)) {
                // skip this block
                pos = blockEnd + 1;
              } else {
                // keep this block
                out += css.slice(blockStart, blockEnd + 1);
                pos = blockEnd + 1;
              }
            }
            css = out;
          } catch (e) {
            // fallback to best-effort replacement using indexOf
            css = css.split('@font-face').filter(part => !part.toLowerCase().includes(fontName.toLowerCase())).join('@font-face');
          }

          // Remove url(...) occurrences that reference the fontName
          try {
            const lowerFont = fontName.toLowerCase();
            let searchPos = 0;
            while (true) {
              const idx = css.toLowerCase().indexOf(lowerFont, searchPos);
              if (idx === -1) break;
              const urlStart = css.lastIndexOf('url(', idx);
              const urlEnd = css.indexOf(')', idx);
              if (urlStart !== -1 && urlEnd !== -1 && urlEnd > urlStart) {
                css = css.slice(0, urlStart) + css.slice(urlEnd + 1);
                searchPos = urlStart;
              } else {
                searchPos = idx + lowerFont.length;
              }
            }
          } catch (e) {
            // ignore
          }

          dynamicFontStyle.textContent = css;
          Logger.info('FONT_PROVIDER', `문제 폰트 CSS에서 제거: ${fontName}`);
        }
      } catch (e) {
        Logger.warn('FONT_PROVIDER', `폰트 제거 실패: ${fontName}`, e);
      }
    }, 200); // 200ms debounce
  }, []);

  /**
   * 🔥 하이브리드 폰트 적용 - CSS 변수 + 직접 적용 병행으로 안정성 확보
   */
  const applyCSSVariables = useCallback((fontFamily: string, size: number) => {
    try {
      const root = document.documentElement;

      // Defensive normalization: ensure a valid font-family string
      if (!fontFamily || typeof fontFamily !== 'string' || fontFamily.trim().length === 0) {
        fontFamily = FONT_CONFIG.DEFAULT_FALLBACK;
      } else {
        const parts = fontFamily.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length > 0) {
          fontFamily = parts.join(', ');
        }
      }

      // 🔥 1. CSS 변수 설정 (테마 변경 시에도 유지)
      root.style.setProperty('--app-font-family', fontFamily);
      root.style.setProperty('--dynamic-font-family', fontFamily);
      root.style.setProperty('--app-font-size', `${size}px`);

      // 🔥 2. 직접 적용 (즉시 효과 보장)
      root.style.fontFamily = `${fontFamily}, ${FONT_CONFIG.DEFAULT_FALLBACK}`;
      document.body.style.fontFamily = `${fontFamily}, ${FONT_CONFIG.DEFAULT_FALLBACK}`;
      document.body.style.fontSize = `${size}px`;

      // 🔥 3. 글로벌 CSS 스타일 주입 (프레임워크 충돌 해결)
      let globalFontStyle = document.getElementById('global-font-style');
      if (!globalFontStyle) {
        globalFontStyle = document.createElement('style');
        globalFontStyle.id = 'global-font-style';
        document.head.appendChild(globalFontStyle);
      }

      globalFontStyle.textContent = `
        /* 🔥 하이브리드 폰트 적용 - CSS 변수와 직접 적용 병행 */
        html, body {
          font-family: ${fontFamily}, var(--app-font-family, ${FONT_CONFIG.DEFAULT_FALLBACK}) !important;
          font-size: var(--app-font-size, ${size}px) !important;
        }
        
        /* 🔥 CSS 변수 정의 */
        :root {
          --app-font-family: ${fontFamily}, ${FONT_CONFIG.DEFAULT_FALLBACK};
          --dynamic-font-family: ${fontFamily}, ${FONT_CONFIG.DEFAULT_FALLBACK};
          --app-font-size: ${size}px;
        }
        
        /* 🔥 Tailwind 및 기타 프레임워크 충돌 해결 */
        .font-sans, .font-serif, .font-mono, [class*="font-"] {
          font-family: ${fontFamily}, var(--app-font-family, ${FONT_CONFIG.DEFAULT_FALLBACK}) !important;
        }
      `;

      // 🔥 5. 동적으로 추가되는 요소들을 위한 MutationObserver 강화
      const fontObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // 즉시 폰트 적용
              node.style.fontFamily = `${fontFamily}, ${FONT_CONFIG.DEFAULT_FALLBACK}`;

              // 자식 요소들도 강제 적용
              const children = node.querySelectorAll('*');
              children.forEach((child) => {
                if (child instanceof HTMLElement) {
                  child.style.fontFamily = `${fontFamily}, ${FONT_CONFIG.DEFAULT_FALLBACK}`;
                }
              });
            }
          });
        });
      });

      // Observer 재설정 (기존 observer 정리)
      const existingObserver = (window as any).__fontObserver;
      if (existingObserver) {
        existingObserver.disconnect();
      }

      fontObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });

      // 전역 observer 저장
      (window as any).__fontObserver = fontObserver;

      // 🔥 6. localStorage에 백업 저장
      try {
        localStorage.setItem('loop-font-family', fontFamily);
        localStorage.setItem('loop-font-size', String(size));

        // 쿠키에도 저장 (SSR 지원)
        document.cookie = `loop-font-family=${encodeURIComponent(fontFamily)}; path=/; max-age=31536000`;
        document.cookie = `loop-font-size=${size}; path=/; max-age=31536000`;
      } catch (e) {
        Logger.warn('FONT_PROVIDER', 'Failed to save font to storage', e);
      }

      Logger.debug('FONT_PROVIDER', '🔥 하이브리드 폰트 적용 완료', {
        fontFamily,
        fontSize: size,
        globalStyleInjected: true,
        method: 'CSS-variables + direct-apply (하이브리드 방식)'
      });

      // Force a reflow to ensure browsers apply new font metrics
      try {
        // reading offsetHeight forces reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = document.body.offsetHeight;
      } catch (e) {
        // ignore
      }
    } catch (error) {
      Logger.error('FONT_PROVIDER', 'Failed to apply CSS variables', error);
      throw error;
    }
  }, []);
  /**
   * 🔥 폰트 변경 (Electron API + 즉시 CSS 적용)
   */
  const setFont = useCallback(async (fontFamily: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      Logger.info('FONT_PROVIDER', 'Changing font', { fontFamily });

      // 1. 🎯 PersistentFontManager를 통한 즉시 적용 및 지속성 보장
      persistentFontManager.updateFontFamily(fontFamily);
      
      // 2. React state 업데이트 (UI 동기화)
      setCurrentFont(fontFamily);

      // 3. 🔥 Electron Settings 저장 (외부 동기화)
      if (window.electronAPI?.settings?.set) {
        const result = await window.electronAPI.settings.set('app.fontFamily', fontFamily);
        if (!result.success) {
          throw new Error(result.error || 'Failed to save font setting');
        }
        Logger.debug('FONT_PROVIDER', 'Font saved to Electron settings', { fontFamily });
      }

      Logger.info('FONT_PROVIDER', 'Font applied with persistence', { 
        fontFamily,
        persistentApplied: true,
        reactStateUpdated: true 
      });

    } catch (error) {
      Logger.error('FONT_PROVIDER', 'Failed to set font', error);
      setError(error instanceof Error ? error.message : 'Failed to set font');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fontSize, applyCSSVariables]);

  /**
   * 🔥 폰트 크기 변경
   */
  const setFontSize = useCallback(async (size: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      Logger.info('FONT_PROVIDER', 'Changing font size', { size });

      // 1. 🎯 PersistentFontManager를 통한 즉시 적용 및 지속성 보장
      persistentFontManager.updateFontSize(size);
      
      // 2. React state 업데이트 (UI 동기화)
      setFontSizeState(size);

      // 3. 🔥 Electron Settings 저장 (외부 동기화)
      if (window.electronAPI?.settings?.set) {
        const result = await window.electronAPI.settings.set('app.fontSize', size);
        if (!result.success) {
          throw new Error(result.error || 'Failed to save font size setting');
        }
        Logger.debug('FONT_PROVIDER', 'Font size saved to Electron settings', { size });
      }

      Logger.info('FONT_PROVIDER', 'Font size applied with persistence', { 
        size,
        persistentApplied: true,
        reactStateUpdated: true 
      });

    } catch (error) {
      Logger.error('FONT_PROVIDER', 'Failed to set font size', error);
      setError(error instanceof Error ? error.message : 'Failed to set font size');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentFont, applyCSSVariables]);

  /**
   * 🔥 동적 폰트 로딩
   */
  const loadFont = useCallback(async (fontId: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      Logger.info('FONT_PROVIDER', 'Loading font', { fontId });

      if (window.electronAPI?.font?.getFontFamily) {
        const result = await window.electronAPI.font.getFontFamily(fontId);
        if (result && result.cssFamily) {
          await setFont(result.cssFamily);
          return true;
        }
      }

      return false;
    } catch (error) {
      Logger.error('FONT_PROVIDER', 'Failed to load font', error);
      setError(error instanceof Error ? error.message : 'Failed to load font');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setFont]);

  /**
   * 🔥 사용 가능한 폰트 목록 새로고침
   */
  const refreshFonts = useCallback(async (): Promise<void> => {
    try {
      if (window.electronAPI?.font?.getAvailableFonts) {
        const fonts = await window.electronAPI.font.getAvailableFonts();
        const formattedFonts = fonts.map(font => ({
          id: font.value,
          name: font.label,
          cssFamily: font.value,
          category: font.category,
          isLocal: true
        }));
        setAvailableFonts(formattedFonts);
        Logger.debug('FONT_PROVIDER', 'Fonts refreshed', { count: formattedFonts.length });
      }
    } catch (error) {
      Logger.error('FONT_PROVIDER', 'Failed to refresh fonts', error);
    }
  }, []);

  /**
   * 🔥 초기화: 저장된 설정 로드 및 CSS 적용 - 실제 폰트 CSS 주입 통합
   */
  useEffect(() => {
    const initializeFonts = async () => {
      try {
        Logger.debug('FONT_PROVIDER', 'EFFECT 1: 데이터 로딩 및 상태 설정 시작');
        setIsLoading(true);

        // 🔥 0. Initialize PersistentFontManager first
        persistentFontManager.initialize();
        const persistentSettings = persistentFontManager.getCurrentSettings();
        Logger.debug('FONT_PROVIDER', 'Persistent font manager initialized', persistentSettings);

        // 1. 🔥 Electron Settings에서 먼저 로드 시도
        let savedFont: string | undefined;
        let savedSize: number | undefined;

        if (window.electronAPI?.settings?.get) {
          try {
            const fontResult = await window.electronAPI.settings.get('app.fontFamily');
            const sizeResult = await window.electronAPI.settings.get('app.fontSize');
            
            if (fontResult.success && fontResult.data) {
              savedFont = fontResult.data as string;
            }
            if (sizeResult.success && sizeResult.data) {
              savedSize = sizeResult.data as number;
            }
            Logger.debug('FONT_PROVIDER', 'Settings loaded from Electron', { savedFont, savedSize });
          } catch (electronError) {
            Logger.warn('FONT_PROVIDER', 'Failed to load from Electron settings, trying localStorage', electronError);
          }
        }

        // 2. 🔥 Electron 로드 실패 시 PersistentFontManager에서 fallback
        if (!savedFont) {
          savedFont = persistentSettings.fontFamily !== FONT_CONFIG.DEFAULT_FALLBACK 
            ? persistentSettings.fontFamily 
            : localStorage.getItem('loop-font-family') || undefined;
        }
        if (!savedSize) {
          savedSize = persistentSettings.fontSize !== 16 
            ? persistentSettings.fontSize 
            : (() => {
                const savedSizeRaw = localStorage.getItem('loop-font-size');
                return savedSizeRaw ? parseInt(savedSizeRaw, 10) : undefined;
              })();
        }

        // 3. 상태 업데이트 및 PersistentFontManager 동기화
        if (savedFont) {
          setCurrentFont(savedFont);
        }
        if (savedSize) {
          setFontSizeState(savedSize);
        }

        // 4. Apply settings to PersistentFontManager for immediate DOM application
        const finalFont = savedFont || persistentSettings.fontFamily;
        const finalSize = savedSize || persistentSettings.fontSize;
        persistentFontManager.applyFontSettings(finalFont, finalSize);

        // 2. Initialize font service and obtain dynamic CSS, but do not touch DOM here
        try {
          await window.electronAPI?.font?.initialize?.();
          const css = await window.electronAPI?.font?.generateCSS?.();
          if (css) {
            const dynamicBlacklist = FontBlacklistManager.getBlacklistedFonts();
            const staticBlacklist = ['강원교육현옥샘', '강원교육모두', 'Gangwon', '%EA%B0%95%EC%9B%90%EA%B5%90%EC%9C%A1'];
            const allBlacklistedFonts = [...new Set([...dynamicBlacklist, ...staticBlacklist])];

            // remove blacklisted fonts from css string using safe string parsing
            let safeCss = css;
            const removeFontFromCss = (inputCss: string, fontName: string) => {
              try {
                const lowerCss = inputCss.toLowerCase();
                const lowerFont = fontName.toLowerCase();
                // remove @font-face blocks that mention the font
                let out = '';
                let pos = 0;
                while (true) {
                  const start = lowerCss.indexOf('@font-face', pos);
                  if (start === -1) {
                    out += inputCss.slice(pos);
                    break;
                  }
                  out += inputCss.slice(pos, start);
                  const blockEnd = lowerCss.indexOf('}', start);
                  if (blockEnd === -1) {
                    out += inputCss.slice(start);
                    break;
                  }
                  const block = lowerCss.slice(start, blockEnd + 1);
                  if (block.includes(lowerFont)) {
                    pos = blockEnd + 1; // skip block
                  } else {
                    out += inputCss.slice(start, blockEnd + 1);
                    pos = blockEnd + 1;
                  }
                }

                let result = out;

                // remove url(...) occurrences that include the font name
                const searchLower = lowerFont;
                let searchPos = 0;
                while (true) {
                  const idx = result.toLowerCase().indexOf(searchLower, searchPos);
                  if (idx === -1) break;
                  const urlStart = result.lastIndexOf('url(', idx);
                  const urlEnd = result.indexOf(')', idx);
                  if (urlStart !== -1 && urlEnd !== -1 && urlEnd > urlStart) {
                    result = result.slice(0, urlStart) + result.slice(urlEnd + 1);
                    searchPos = urlStart;
                  } else {
                    searchPos = idx + searchLower.length;
                  }
                }

                return result;
              } catch (e) {
                // fallback naive removal
                return inputCss.split('@font-face').filter(part => !part.toLowerCase().includes(fontName.toLowerCase())).join('@font-face');
              }
            };

            allBlacklistedFonts.forEach(fontName => {
              safeCss = removeFontFromCss(safeCss, fontName);
            });

            const normalizedCSS = safeCss + `\n:root { --dynamic-font-family: var(--app-font-family, ${FONT_CONFIG.DEFAULT_FALLBACK}); }`;
            // store for later DOM injection
            pendingDynamicCssRef.current = normalizedCSS;
            Logger.info('FONT_PROVIDER', '🔥 안전한 폰트 CSS 준비됨 (DOM 주입 보류)', { originalLength: css.length, safeLength: safeCss.length, removedFonts: allBlacklistedFonts.length });
          }
        } catch (e) {
          Logger.warn('FONT_PROVIDER', '폰트 CSS 생성 실패 - DOM 주입 생략', e);
        }

        // 3. Electron settings 동기화 (상태만 변경)
        if (window.electronAPI?.settings?.getAll) {
          const result = await window.electronAPI.settings.getAll();
          if (result.success && result.data) {
            const settings = result.data as any;
            if (settings.app?.fontFamily) setCurrentFont(settings.app.fontFamily);
            if (settings.app?.fontSize) setFontSizeState(settings.app.fontSize);
          }
        }

        // 4. 폰트 목록 로드
        try {
          const [dynamicFonts, staticFonts] = await Promise.all([
            window.electronAPI?.font?.getAvailableFonts?.() || [],
            window.electronAPI?.font?.getStaticFonts?.() || []
          ]);
          const allFonts = [...staticFonts, ...dynamicFonts];
          const formattedFonts = allFonts.map(font => ({ id: font.value, name: font.label, cssFamily: font.value, category: font.category, isLocal: true }));
          setAvailableFonts(formattedFonts);
          try { await refreshFonts(); Logger.info('FONT_PROVIDER', 'initializeFonts: refreshFonts executed successfully'); } catch (rfError) { Logger.warn('FONT_PROVIDER', 'initializeFonts: refreshFonts failed', rfError); }
        } catch (e) {
          Logger.warn('FONT_PROVIDER', '폰트 목록 로드 실패', e);
        }

        Logger.info('FONT_PROVIDER', '--- [EFFECT 1] 모든 상태 설정 완료 ---');
      } catch (error) {
        Logger.error('FONT_PROVIDER', 'Failed to initialize fonts', error);
        setError('Failed to initialize fonts');
      } finally {
        setIsLoading(false);
      }
    };

    initializeFonts();
  }, [refreshFonts]);

  /**
   * 🔥 테마 변경 시 폰트 재적용 (테마 무관한 폰트 적용 보장)
   */
  useEffect(() => {
    const handleThemeChange = () => {
      Logger.debug('FONT_PROVIDER', 'Theme changed, reapplying fonts');
      applyCSSVariables(currentFont, fontSize);
    };

    // MutationObserver로 테마 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
          (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    return () => observer.disconnect();
  }, [currentFont, fontSize]);

  // 🔥 EFFECT 2: DOM 조작은 React 상태가 준비된 이후에만 수행
  useEffect(() => {
    if (isLoading) return; // 대기 중이면 적용하지 않음
    if (!currentFont || !fontSize) return; // 상태 준비되지 않음

    try {
      Logger.info('FONT_PROVIDER', '--- [EFFECT 2] DOM 스타일 적용 시작 ---', { currentFont, fontSize });

      // 1) apply CSS variables + global style
      applyCSSVariables(currentFont, fontSize);

      // 2) inject pending dynamic CSS if present
      const pendingCss = pendingDynamicCssRef.current;
      if (pendingCss) {
        // remove existing dynamic-fonts style
        const existing = document.getElementById('dynamic-fonts');
        if (existing) existing.remove();
        const style = document.createElement('style');
        style.id = 'dynamic-fonts';
        style.textContent = pendingCss;
        document.head.appendChild(style);
        // clear ref after injection
        pendingDynamicCssRef.current = null;
        Logger.info('FONT_PROVIDER', '동적 폰트 CSS가 DOM에 주입됨');
      }

      // 3) Ensure MutationObserver is active for late-added nodes
      const existingObserver = (window as any).__fontObserver;
      if (!existingObserver) {
        const fontObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                node.style.fontFamily = `${currentFont}, ${FONT_CONFIG.DEFAULT_FALLBACK}`;
                const children = node.querySelectorAll('*');
                children.forEach((child) => {
                  if (child instanceof HTMLElement) child.style.fontFamily = `${currentFont}, ${FONT_CONFIG.DEFAULT_FALLBACK}`;
                });
              }
            });
          });
        });

        fontObserver.observe(document.body, { childList: true, subtree: true });
        (window as any).__fontObserver = fontObserver;
        Logger.info('FONT_PROVIDER', 'MutationObserver 등록 완료 (EFFECT 2)');
      }

    } catch (e) {
      Logger.warn('FONT_PROVIDER', 'EFFECT 2에서 DOM 적용 실패', e);
    }

  }, [currentFont, fontSize, isLoading]);

  const value: FontContextType = {
    currentFont,
    fontSize,
    isLoading,
    error,
    setFont,
    setFontSize,
    loadFont,
    availableFonts,
    refreshFonts,
    // 🔥 블랙리스트 관리 함수들
    getBlacklistedFonts: () => FontBlacklistManager.getBlacklistedFonts(),
    addToBlacklist: (fontName: string, reason?: string) => {
      FontBlacklistManager.addToBlacklist(fontName, 'user_blacklist', reason);
      removeProblematicFontFromCSS(fontName);
    },
    removeFromBlacklist: (fontName: string) => FontBlacklistManager.removeFromBlacklist(fontName),
    clearBlacklist: () => FontBlacklistManager.saveBlacklist([])
  };

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
}

/**
 * 🔥 useFont hook - 폰트 상태 및 제어 함수 접근
 */
export function useFont(): FontContextType {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within FontProvider');
  }
  return context;
}
