/**
 * ✅ Font Loading Observer - FOUT/FOIT 방지 및 로딩 상태 관리
 * FontFaceObserver 패턴 구현으로 성능 최적화
 */

interface FontLoadingState {
  loaded: boolean;
  error: boolean;
  loading: boolean;
}

export class FontObserver {
  private static loadingFonts = new Map<string, Promise<void>>();
  private static loadedFonts = new Set<string>();

  /**
   * 폰트 로딩 상태 확인 (동기)
   */
  static isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  /**
   * 폰트 로딩 확인 (비동기 - FontFaceObserver 패턴)
   */
  static async loadFont(fontFamily: string, timeout = 3000): Promise<FontLoadingState> {
    // 이미 로드된 폰트는 즉시 반환
    if (this.loadedFonts.has(fontFamily)) {
      return { loaded: true, error: false, loading: false };
    }

    // 이미 로딩 중인 폰트는 기존 Promise 반환
    if (this.loadingFonts.has(fontFamily)) {
      try {
        await this.loadingFonts.get(fontFamily);
        return { loaded: true, error: false, loading: false };
      } catch {
        return { loaded: false, error: true, loading: false };
      }
    }

    // 새로운 폰트 로딩 시작
    const loadingPromise = this._checkFontAvailability(fontFamily, timeout);
    this.loadingFonts.set(fontFamily, loadingPromise);

    try {
      await loadingPromise;
      this.loadedFonts.add(fontFamily);
      this.loadingFonts.delete(fontFamily);
      return { loaded: true, error: false, loading: false };
    } catch (error) {
      this.loadingFonts.delete(fontFamily);
      return { loaded: false, error: true, loading: false };
    }
  }

  /**
   * 브라우저 FontFace API를 사용한 폰트 가용성 확인
   */
  private static async _checkFontAvailability(fontFamily: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        reject(new Error(`Font loading timeout: ${fontFamily}`));
      }, timeout);

      // FontFace API 사용 (최신 브라우저)
      if ('fonts' in document) {
        document.fonts.load(`16px "${fontFamily}"`).then(() => {
          clearTimeout(timeoutId);
          resolve();
        }).catch(() => {
          // FontFace API 실패 시 fallback 방식 사용
          this._fallbackFontCheck(fontFamily, resolve, reject, timeoutId);
        });
      } else {
        // 구형 브라우저 fallback
        this._fallbackFontCheck(fontFamily, resolve, reject, timeoutId);
      }
    });
  }

  /**
   * Fallback 폰트 확인 방식 (canvas 기반)
   */
  private static _fallbackFontCheck(
    fontFamily: string,
    resolve: () => void,
    reject: (error: Error) => void,
    timeoutId: NodeJS.Timeout
  ): void {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      clearTimeout(timeoutId);
      reject(new Error('Canvas context not available'));
      return;
    }

    // 기준 폰트로 텍스트 크기 측정
    context.font = '16px monospace';
    const fallbackWidth = context.measureText('abcdefghijklmnopqrstuvwxyz').width;

    // 대상 폰트로 텍스트 크기 측정
    context.font = `16px "${fontFamily}", monospace`;
    const targetWidth = context.measureText('abcdefghijklmnopqrstuvwxyz').width;

    // 폰트가 로드되었으면 크기가 달라짐
    if (Math.abs(targetWidth - fallbackWidth) > 0.1) {
      clearTimeout(timeoutId);
      resolve();
    } else {
      // 폰트가 아직 로드되지 않음 - 재시도
      setTimeout(() => {
        this._fallbackFontCheck(fontFamily, resolve, reject, timeoutId);
      }, 100);
    }
  }

  /**
   * 폰트 사전 로딩 (성능 최적화) - URL 생성 수정
   */
  static preloadFont(fontFamily: string): void {
    // FontFace API를 사용한 사전 로딩
    if ('fonts' in document) {
      // 폰트 이름을 안전한 파일 경로로 변환
      const safeFontName = fontFamily.replace(/[^a-zA-Z0-9-_]/g, '');
      const fontFace = new FontFace(fontFamily, `url('/fonts/${safeFontName}/${safeFontName}.woff2')`);
      fontFace.load().then(() => {
        document.fonts.add(fontFace);
        this.loadedFonts.add(fontFamily);
      }).catch(() => {
        // 실패해도 무시 (선택적 최적화)
      });
    }
  }

  /**
   * 로딩 상태 초기화
   */
  static clear(): void {
    this.loadingFonts.clear();
    this.loadedFonts.clear();
  }
}