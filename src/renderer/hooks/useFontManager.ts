// 🔥 기가차드 폰트 훅 - 동적 폰트 시스템 React Hook

import { Logger } from '../../shared/logger';

/**
 * @deprecated useFontManager has been superseded by useDynamicFont. Import useDynamicFont instead.
 */
export function useFontManager(): never {
  Logger.error('USE_FONT_MANAGER', 'useFontManager is deprecated. Use useDynamicFont instead.');
  throw new Error('useFontManager is deprecated. Use useDynamicFont instead.');
}

export default useFontManager;

// #DEBUG: Font hooks exit point
Logger.debug('FONT_HOOKS', 'Dynamic font hooks module setup complete');
