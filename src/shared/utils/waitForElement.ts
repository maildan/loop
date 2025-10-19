/**
 * DOM에 특정 요소가 나타날 때까지 기다리는 유틸리티
 */

import { Logger } from '../logger';

interface WaitOptions {
  timeout?: number;
  checkInterval?: number;
}

/**
 * CSS selector로 지정된 요소가 DOM에 나타날 때까지 기다립니다.
 * 
 * @param selector CSS selector
 * @param options 타임아웃, 체크 간격
 * @returns Promise<Element | null>
 */
export async function waitForElement(
  selector: string,
  options: WaitOptions = {}
): Promise<Element | null> {
  const {
    timeout = 5000,
    checkInterval = 100,
  } = options;

  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkElement = () => {
      const element = document.querySelector(selector);
      const elapsed = Date.now() - startTime;

      if (element) {
        Logger.debug('waitForElement', `✅ Found: ${selector} (${elapsed}ms)`);
        resolve(element);
        return;
      }

      if (elapsed >= timeout) {
        Logger.warn('waitForElement', `⏱️ Timeout: ${selector} (${timeout}ms)`);
        resolve(null);
        return;
      }

      setTimeout(checkElement, checkInterval);
    };

    checkElement();
  });
}
