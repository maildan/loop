// 🔥 Font Blacklist System - 문제 폰트 관리 (FontProvider에서 분리)
'use client';

import { Logger } from '../../shared/logger';

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

// 🔥 폰트 오류 패턴 정의 (확장 가능)
const FONT_ERROR_PATTERNS: FontErrorPattern[] = [
  {
    // Renderer 콘솔 로그 형식: "Failed to decode downloaded font: http://localhost:35821/fonts/Gangwon_mac/gaw.otf"
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

/**
 * 🔥 동적 블랙리스트 매니저 (단순화됨)
 */
export class FontBlacklistSystem {
  private static readonly STORAGE_KEY = 'loop-font-blacklist';
  private static readonly MAX_ERROR_COUNT = 3;
  private static readonly BLACKLIST_DURATION = 7 * 24 * 60 * 60 * 1000; // 7일

  static async getBlacklist(): Promise<FontBlacklistEntry[]> {
    try {
      console.log('🔥 FontBlacklistSystem.getBlacklist: Starting...');
      console.log('🔥 window.electronAPI exists:', !!window.electronAPI);
      console.log('🔥 window.electronAPI.settings exists:', !!(window.electronAPI?.settings));
      console.log('🔥 window.electronAPI.settings.get exists:', !!(window.electronAPI?.settings?.get));
      
      // ✅ Electron Store 사용 (단일 저장소)
      if (window.electronAPI?.settings?.get) {
        console.log('🔥 Calling window.electronAPI.settings.get with key: app.fontBlacklist');
        const result = await window.electronAPI.settings.get('app.fontBlacklist');
        console.log('🔥 Result from electronAPI.settings.get:', result);
        
        if (result.success && Array.isArray(result.data)) {
          const entries = result.data as FontBlacklistEntry[];
          const now = Date.now();
          
          // 만료된 항목 정리
          const validEntries = entries.filter(entry =>
            now - entry.timestamp < this.BLACKLIST_DURATION
          );

          if (validEntries.length !== entries.length) {
            await this.saveBlacklist(validEntries);
          }

          console.log('🔥 Returning validEntries:', validEntries);
          return validEntries;
        }
      }

      console.log('🔥 Returning empty array');
      return [];
    } catch (e) {
      console.log('🔥 Exception in getBlacklist:', e);
      Logger.warn('FONT_BLACKLIST', 'Failed to load blacklist from Electron Store', e);
      return [];
    }
  }

  static async saveBlacklist(entries: FontBlacklistEntry[]): Promise<void> {
    try {
      console.log('🔥 FontBlacklistSystem.saveBlacklist: Starting with entries:', entries);
      console.log('🔥 window.electronAPI.settings.set exists:', !!(window.electronAPI?.settings?.set));
      
      // ✅ Electron Store 사용 (단일 저장소)
      if (window.electronAPI?.settings?.set) {
        console.log('🔥 Calling window.electronAPI.settings.set with key: app.fontBlacklist');
        const result = await window.electronAPI.settings.set('app.fontBlacklist', entries);
        console.log('🔥 Result from electronAPI.settings.set:', result);
        
        if (!result.success) {
          Logger.warn('FONT_BLACKLIST', 'Failed to save blacklist to Electron Store', result.error);
        }
      }
    } catch (e) {
      console.log('🔥 Exception in saveBlacklist:', e);
      Logger.warn('FONT_BLACKLIST', 'Failed to save blacklist', e);
    }
  }

  static async addToBlacklist(fontName: string, reason: FontBlacklistEntry['reason'], error?: string): Promise<void> {
    const entries = await this.getBlacklist();
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

    await this.saveBlacklist(entries);
    Logger.warn('FONT_BLACKLIST', `폰트 블랙리스트 추가: ${fontName}`, { reason, error });
  }

  /**
   * 🔥 개선된 블랙리스트 확인 - 부분 매칭 포함
   */
  static async isBlacklisted(fontName: string): Promise<boolean> {
    const entries = await this.getBlacklist();
    
    // 정확한 매칭
    const exactMatch = entries.some(entry => entry.fontName === fontName);
    if (exactMatch) return true;

    // 부분 매칭 (gaw.otf가 gaw_Light.otf도 블랙리스트)
    const partialMatch = entries.some(entry => {
      const entryBase = entry.fontName.replace(/\.(otf|ttf|woff2?)$/i, '');
      const fontBase = fontName.replace(/\.(otf|ttf|woff2?)$/i, '');
      return fontBase.toLowerCase().includes(entryBase.toLowerCase()) ||
             entryBase.toLowerCase().includes(fontBase.toLowerCase());
    });

    if (partialMatch) {
      Logger.info('FONT_BLACKLIST', `부분 매칭으로 블랙리스트됨: ${fontName}`);
      return true;
    }

    return false;
  }

  static async removeFromBlacklist(fontName: string): Promise<void> {
    const entries = await this.getBlacklist();
    const filtered = entries.filter(entry => entry.fontName !== fontName);
    await this.saveBlacklist(filtered);
    Logger.info('FONT_BLACKLIST', `폰트 블랙리스트 제거: ${fontName}`);
  }

  static async getBlacklistedFonts(): Promise<string[]> {
    const entries = await this.getBlacklist();
    return entries.map(entry => entry.fontName);
  }

  static async clearBlacklist(): Promise<void> {
    await this.saveBlacklist([]);
    Logger.info('FONT_BLACKLIST', '블랙리스트 전체 삭제');
  }

  /**
   * 🔥 사전 정의된 문제 폰트들을 블랙리스트에 추가
   */
  static async initializeKnownProblematicFonts(): Promise<void> {
    const knownProblematicFonts = [
      { name: 'gaw.otf', reason: 'cff_error' as const },
      { name: 'gaw_Bold.otf', reason: 'cff_error' as const },
      { name: 'gaw_Light.otf', reason: 'cff_error' as const }, // 추가
      { name: 'NanumGothicBold.otf', reason: 'ots_error' as const }
    ];

    for (const { name, reason } of knownProblematicFonts) {
      if (!(await this.isBlacklisted(name))) {
        await this.addToBlacklist(name, reason, 'Pre-emptive blacklist based on known issues');
        Logger.info('FONT_BLACKLIST', `🚫 사전 블랙리스트 추가: ${name}`, { reason });
      }
    }
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
      'gaw.otf', 'gaw_Bold.otf', 'gaw_Light.otf', // 강원 폰트
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

  /**
   * 🔥 CSS에서 블랙리스트된 폰트 제거
   */
  static async removeBlacklistedFontsFromCSS(): Promise<void> {
    try {
      const blacklistedFonts = await this.getBlacklistedFonts();
      if (blacklistedFonts.length === 0) return;

      const dynamicFontStyle = document.getElementById('dynamic-fonts');
      if (!dynamicFontStyle || !dynamicFontStyle.textContent) return;

      let css = dynamicFontStyle.textContent;

      // 각 블랙리스트된 폰트에 대해 CSS에서 제거
      for (const fontName of blacklistedFonts) {
        css = this.removeFontFromCSS(css, fontName);
      }

      dynamicFontStyle.textContent = css;
      Logger.info('FONT_BLACKLIST', `블랙리스트된 폰트들을 CSS에서 제거함`, { count: blacklistedFonts.length });

    } catch (e) {
      Logger.warn('FONT_BLACKLIST', 'CSS에서 블랙리스트된 폰트 제거 실패', e);
    }
  }

  /**
   * 🔥 CSS 문자열에서 특정 폰트 제거 (안전한 파싱)
   */
  private static removeFontFromCSS(css: string, fontName: string): string {
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

      // 🔒 ReDoS 공격 방지: 입력 검증 및 길이 제한
      if (!fontName || typeof fontName !== 'string') {
        Logger.warn('FONT_BLACKLIST', '유효하지 않은 폰트명');
        return css;
      }
      
      // 길이 제한 (ReDoS 방지)
      if (fontName.length > 100) {
        Logger.warn('FONT_BLACKLIST', `폰트명이 너무 긺: ${fontName.substring(0, 50)}...`);
        return css;
      }
      
      // 위험한 문자 패턴 감지 (ReDoS 가능성 있는 문자들)
      if (/[<>{}\\|*?[\]"'`]/.test(fontName)) {
        Logger.warn('FONT_BLACKLIST', `잠재적으로 위험한 폰트명 감지: ${fontName}`);
        return css;
      }
      
      // 안전한 이스케이프 처리 (길이 제한된 입력에만 적용)
      const escapedFontName = fontName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // 안전한 정적 패턴 구성
      const urlPattern = `url\\([^)]*${escapedFontName}[^)]*\\)`;
      const urlRegex = new RegExp(urlPattern, 'gi');
      out = out.replace(urlRegex, '');

      return out;
    } catch (e) {
      Logger.warn('FONT_BLACKLIST', `폰트 제거 실패: ${fontName}`, e);
      return css;
    }
  }
}