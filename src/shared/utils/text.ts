/**
 * Text utilities shared between main and renderer processes.
 * Provides consistent word counting for manuscript analytics.
 */

/**
 * Calculate a rough word count that works for both Korean and Latin scripts.
 * Removes punctuation while preserving alphanumeric and Hangul characters.
 */
export function calculateWordCount(content: string | undefined | null): number {
  if (!content) {
    return 0;
  }

    const sanitized = content.replace(/[^\w\s가-힣]/g, ' ');
    const tokens = sanitized
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 0);

  return tokens.length;
}

/**
 * Count the number of characters excluding control characters.
 */
export function calculateCharacterCount(content: string | undefined | null): number {
  if (!content) {
    return 0;
  }

  return content.replace(/[\r\n\t]/g, '').length;
}
