// 🔥 기가차드 폰트 ZIP 생성 헬퍼 - 테스트용

import { Logger } from '../../shared/logger';

/**
 * @deprecated FontZipHelper has been removed in favor of the new FontService pipeline.
 * This stub remains only to avoid breaking stray imports.
 */
export class FontZipHelper {
  private static instance: FontZipHelper | null = null;

  private constructor() {
    Logger.warn('FONT_ZIP_HELPER', 'FontZipHelper is deprecated. Use FontService instead.');
  }

  public static getInstance(): FontZipHelper {
    if (!FontZipHelper.instance) {
      FontZipHelper.instance = new FontZipHelper();
    }

    return FontZipHelper.instance;
  }

  public static ensureZipSupport(): never {
    throw new Error('FontZipHelper.ensureZipSupport is obsolete. The new FontService handles font loading.');
  }
}

export const fontZipHelper = FontZipHelper.getInstance();

export default fontZipHelper;
