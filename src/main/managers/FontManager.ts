// 🔥 기가차드 폰트 매니저 - ZIP 폰트 동적 로딩 시스템

import { Logger } from '../../shared/logger';

/**
 * @deprecated FontManager has been superseded by FontService. Any attempt to access legacy APIs
 * will throw so stray imports surface quickly during development.
 */
export class FontManager {
  public static getInstance(): never {
    Logger.error('FONT_MANAGER', 'FontManager is deprecated. Use fontService instead.');
    throw new Error('FontManager is deprecated. Use fontService instead.');
  }
}

export const fontManager: Record<string, never> = new Proxy({} as Record<string, never>, {
  get(_target, property) {
    Logger.error('FONT_MANAGER', `Attempted to access legacy fontManager.${String(property)}`);
    throw new Error('fontManager is deprecated. Use fontService instead.');
  },
});

export default fontManager;
