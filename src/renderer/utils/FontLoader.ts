// 🔥 폰트 로딩 시스템 - 안전한 로딩 및 적용 (FontProvider에서 분리)
'use client';

import { Logger } from '../../shared/logger';
import { FontBlacklistSystem } from './FontBlacklistSystem';

interface FontLoadResult {
  success: boolean;
  fontName: string;
  error?: string;
  loadTime?: number;
}

interface FontMetadata {
  name: string;
  family: string;
  style: string;
  weight: string;
  url: string;
  format?: string;
  size?: number;
}

/**
 * 🔥 폰트 로딩 매니저 - 블랙리스트 통합, 안전성 중심
 */
export class FontLoader {
  private static readonly FONT_LOAD_TIMEOUT = 10000; // 10초
  private static readonly MAX_CONCURRENT_LOADS = 3;
  private static loadingQueue: string[] = [];
  private static currentlyLoading = new Set<string>();

  /**
   * 🔥 동적 폰트 로딩 (블랙리스트 검증 포함)
   */
  static async loadFontWithBlacklistCheck(fontMetadata: FontMetadata): Promise<FontLoadResult> {
    const startTime = Date.now();
    
    try {
      // 1. 블랙리스트 확인 (우선)
      const isBlacklisted = await FontBlacklistSystem.isBlacklisted(fontMetadata.name);
      if (isBlacklisted) {
        Logger.warn('FONT_LOADER', `블랙리스트된 폰트 로딩 차단: ${fontMetadata.name}`);
        return {
          success: false,
          fontName: fontMetadata.name,
          error: 'Font is blacklisted'
        };
      }

      // 2. 이미 로딩 중인지 확인
      if (this.currentlyLoading.has(fontMetadata.name)) {
        Logger.info('FONT_LOADER', `이미 로딩 중인 폰트: ${fontMetadata.name}`);
        return await this.waitForFontLoad(fontMetadata.name);
      }

      // 3. 동시 로딩 제한
      if (this.currentlyLoading.size >= this.MAX_CONCURRENT_LOADS) {
        this.loadingQueue.push(fontMetadata.name);
        Logger.info('FONT_LOADER', `폰트 로딩 대기열에 추가: ${fontMetadata.name}`);
        return await this.waitForQueueProcessing(fontMetadata);
      }

      // 4. 실제 로딩 시작
      this.currentlyLoading.add(fontMetadata.name);
      const result = await this.performFontLoad(fontMetadata);
      
      const loadTime = Date.now() - startTime;
      result.loadTime = loadTime;

      // 5. 로딩 완료 처리
      this.currentlyLoading.delete(fontMetadata.name);
      this.processQueue();

      // 6. 실패 시 블랙리스트 추가
      if (!result.success && result.error) {
        await FontBlacklistSystem.addToBlacklist(
          fontMetadata.name, 
          'loading_timeout',
          result.error
        );
      }

      return result;

    } catch (error) {
      const loadTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // 오류 발생 시 블랙리스트 추가
      await FontBlacklistSystem.addToBlacklist(
        fontMetadata.name,
        'decode_error',
        errorMessage
      );

      this.currentlyLoading.delete(fontMetadata.name);
      this.processQueue();

      return {
        success: false,
        fontName: fontMetadata.name,
        error: errorMessage,
        loadTime
      };
    }
  }

  /**
   * 🔥 실제 폰트 로딩 로직 (FontFace API 사용)
   */
  private static async performFontLoad(fontMetadata: FontMetadata): Promise<FontLoadResult> {
    try {
      // FontFace 객체 생성
      let fontUrl = fontMetadata.url;
      
      // URL 형식 검증 및 수정
      if (!fontUrl.startsWith('http') && !fontUrl.startsWith('/')) {
        fontUrl = `/fonts/${fontUrl}`;
      }

      const fontFace = new FontFace(
        fontMetadata.family,
        `url("${fontUrl}")`, 
        {
          style: fontMetadata.style || 'normal',
          weight: fontMetadata.weight || 'normal',
          display: 'swap' // 폰트 로딩 중에도 텍스트 표시
        }
      );

      // 타임아웃과 함께 로딩
      const loadPromise = fontFace.load();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Font load timeout')), this.FONT_LOAD_TIMEOUT);
      });

      const loadedFontFace = await Promise.race([loadPromise, timeoutPromise]);

      // 문서에 폰트 추가
      document.fonts.add(loadedFontFace);

      // 로딩 성공 확인
      await document.fonts.ready;

      Logger.info('FONT_LOADER', `폰트 로딩 성공: ${fontMetadata.name}`, {
        family: fontMetadata.family,
        url: fontUrl
      });

      return {
        success: true,
        fontName: fontMetadata.name
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      Logger.error('FONT_LOADER', `폰트 로딩 실패: ${fontMetadata.name}`, {
        error: errorMessage,
        url: fontMetadata.url
      });

      return {
        success: false,
        fontName: fontMetadata.name,
        error: errorMessage
      };
    }
  }

  /**
   * 🔥 CSS 스타일 태그로 폰트 추가 (백업 방법)
   */
  static addFontToCSS(fontMetadata: FontMetadata): void {
    try {
      let dynamicFontStyle = document.getElementById('dynamic-fonts') as HTMLStyleElement;
      
      if (!dynamicFontStyle) {
        dynamicFontStyle = document.createElement('style');
        dynamicFontStyle.id = 'dynamic-fonts';
        document.head.appendChild(dynamicFontStyle);
      }

      let fontUrl = fontMetadata.url;
      if (!fontUrl.startsWith('http') && !fontUrl.startsWith('/')) {
        fontUrl = `/fonts/${fontUrl}`;
      }

      const fontFaceCSS = `
@font-face {
  font-family: "${fontMetadata.family}";
  src: url("${fontUrl}") format("${fontMetadata.format || 'opentype'}");
  font-style: ${fontMetadata.style || 'normal'};
  font-weight: ${fontMetadata.weight || 'normal'};
  font-display: swap;
}`;

      dynamicFontStyle.textContent += fontFaceCSS;

      Logger.info('FONT_LOADER', `CSS 폰트 정의 추가: ${fontMetadata.name}`, {
        family: fontMetadata.family,
        url: fontUrl
      });

    } catch (error) {
      Logger.error('FONT_LOADER', `CSS 폰트 정의 추가 실패: ${fontMetadata.name}`, error);
    }
  }

  /**
   * 🔥 폰트 로딩 대기 (이미 로딩 중인 경우)
   */
  private static async waitForFontLoad(fontName: string): Promise<FontLoadResult> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.currentlyLoading.has(fontName)) {
          clearInterval(checkInterval);
          resolve({
            success: true,
            fontName,
            error: 'Font was already loading'
          });
        }
      }, 100);

      // 최대 대기 시간
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve({
          success: false,
          fontName,
          error: 'Wait timeout'
        });
      }, this.FONT_LOAD_TIMEOUT);
    });
  }

  /**
   * 🔥 대기열 처리
   */
  private static async waitForQueueProcessing(fontMetadata: FontMetadata): Promise<FontLoadResult> {
    return new Promise((resolve) => {
      const checkQueue = () => {
        if (this.currentlyLoading.size < this.MAX_CONCURRENT_LOADS && 
            this.loadingQueue.includes(fontMetadata.name)) {
          
          // 대기열에서 제거하고 로딩 시작
          this.loadingQueue = this.loadingQueue.filter(name => name !== fontMetadata.name);
          this.loadFontWithBlacklistCheck(fontMetadata).then(resolve);
        } else {
          setTimeout(checkQueue, 200);
        }
      };

      checkQueue();

      // 최대 대기 시간
      setTimeout(() => {
        resolve({
          success: false,
          fontName: fontMetadata.name,
          error: 'Queue timeout'
        });
      }, this.FONT_LOAD_TIMEOUT * 2);
    });
  }

  /**
   * 🔥 대기열 처리 시작
   */
  private static processQueue(): void {
    if (this.loadingQueue.length > 0 && this.currentlyLoading.size < this.MAX_CONCURRENT_LOADS) {
      const nextFontName = this.loadingQueue.shift();
      if (nextFontName) {
        Logger.info('FONT_LOADER', `대기열에서 폰트 로딩 시작: ${nextFontName}`);
        // 실제 로딩은 호출자가 다시 시도하도록 함
      }
    }
  }

  /**
   * 🔥 폰트 로딩 상태 확인
   */
  static getFontLoadingStatus(): {
    currentlyLoading: string[];
    queueLength: number;
    totalLoaded: number;
  } {
    return {
      currentlyLoading: Array.from(this.currentlyLoading),
      queueLength: this.loadingQueue.length,
      totalLoaded: document.fonts.size
    };
  }

  /**
   * 🔥 모든 폰트 로딩 중단
   */
  static cancelAllLoading(): void {
    this.currentlyLoading.clear();
    this.loadingQueue = [];
    Logger.info('FONT_LOADER', '모든 폰트 로딩 중단');
  }

  /**
   * 🔥 시스템 폰트로 대체 (안전망)
   */
  static async fallbackToSystemFonts(): Promise<void> {
    try {
      // 모든 로딩 중단
      this.cancelAllLoading();

      // 안전한 시스템 폰트들
      const systemFonts = [
        { family: 'Pretendard', source: 'system' },
        { family: 'system-ui', source: 'system' },
        { family: '-apple-system', source: 'system' },
        { family: 'BlinkMacSystemFont', source: 'system' },
        { family: 'sans-serif', source: 'system' }
      ];

      // CSS에 시스템 폰트 정의 추가
      let dynamicFontStyle = document.getElementById('dynamic-fonts') as HTMLStyleElement;
      
      if (!dynamicFontStyle) {
        dynamicFontStyle = document.createElement('style');
        dynamicFontStyle.id = 'dynamic-fonts';
        document.head.appendChild(dynamicFontStyle);
      }

      // 기존 내용 초기화
      dynamicFontStyle.textContent = `
/* 시스템 폰트 백업 정의 */
body, .ProseMirror, .tiptap {
  font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
}`;

      Logger.info('FONT_LOADER', '시스템 폰트로 대체 완료');

    } catch (error) {
      Logger.error('FONT_LOADER', '시스템 폰트 대체 실패', error);
    }
  }
}