/**
 * 🔒 보안 로깅 유틸리티
 * 
 * API 키, 비밀번호 등 민감한 정보를 로깅에서 자동으로 마스킹합니다.
 */

/**
 * 민감한 키 패턴 (정규식)
 * 예: API_KEY, password, token, secret, etc.
 */
const SENSITIVE_KEY_PATTERNS = [
  /api[_-]?key/i,
  /auth[_-]?token/i,
  /password/i,
  /secret/i,
  /token/i,
  /credential/i,
  /bearer/i,
  /authorization/i,
  /x-api-key/i,
  /gemini/i,
  /openai/i,
  /google/i,
  /github/i,
];

/**
 * API 키 값 패턴 (대략적인 포맷 감지)
 */
const SENSITIVE_VALUE_PATTERNS = [
  /^sk-/,  // OpenAI 키 format
  /^AIza/,  // Google API 키 format
  /^ghp_/,  // GitHub 토큰 format
  /^gho_/,  // GitHub OAuth 토큰 format
  /^gr1_/,  // GitHub 새 형식
];

/**
 * 민감한 값을 마스킹합니다 (마지막 8글자만 노출)
 * @param value 마스킹할 값
 * @param visibleChars 끝에 노출할 문자 수 (기본값: 8)
 * @returns 마스킹된 값
 */
export function maskValue(value: string | undefined, visibleChars: number = 8): string {
  if (!value) return '(empty)';
  if (value.length <= visibleChars) return '***';
  return `***${value.slice(-visibleChars)}`;
}

/**
 * 객체의 모든 민감한 필드를 마스킹합니다
 * @param obj 처리할 객체
 * @returns 민감한 필드가 마스킹된 객체
 */
export function maskSensitiveData(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // 값이 API 키처럼 보이면 마스킹
    if (SENSITIVE_VALUE_PATTERNS.some(pattern => pattern.test(obj))) {
      return maskValue(obj);
    }
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => maskSensitiveData(item));
  }

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    // 키가 민감한 패턴과 일치하면 값을 마스킹
    if (SENSITIVE_KEY_PATTERNS.some(pattern => pattern.test(key))) {
      if (typeof value === 'string') {
        masked[key] = maskValue(value);
      } else if (value === undefined || value === null) {
        masked[key] = value;
      } else {
        masked[key] = '***';
      }
    } else if (typeof value === 'object') {
      // 재귀적으로 처리
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * 에러 메시지에서 민감한 정보를 제거합니다
 * @param error 에러 객체 또는 메시지
 * @returns 정제된 에러 메시지
 */
export function maskErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    let message = error.message;
    
    // 일반적인 API 키 패턴 제거
    message = message.replace(/(['\"]?)([a-zA-Z0-9_-]{20,})['\"]?/g, (match) => {
      // API 키처럼 보이는 긴 문자열 제거
      if (SENSITIVE_VALUE_PATTERNS.some(pattern => pattern.test(match))) {
        return '***API_KEY***';
      }
      return match;
    });
    
    // Bearer 토큰 제거
    message = message.replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer ***');
    
    // Authorization 헤더 값 제거
    message = message.replace(/Authorization:\s*[a-zA-Z0-9._-]+/gi, 'Authorization: ***');
    
    return message;
  }
  
  return String(error || 'Unknown error');
}

/**
 * 완벽한 로깅을 위한 안전한 데이터 직렬화
 * @param data 로깅할 데이터
 * @returns 민감한 정보가 마스킹된 데이터
 */
export function sanitizeForLogging(data: unknown): unknown {
  try {
    return maskSensitiveData(data);
  } catch (error) {
    // 마스킹 중 에러 발생 시 원본 반환
    return data;
  }
}
