/**
 * RateLimiterService.ts
 * V4 보안 수정 - 요청 속도 제한 (Rate Limiting)
 * 
 * 목적: IPC 핸들러 빈도 제한으로 DoS 공격 방지
 * 구현: Map 기반 Token Bucket 알고리즘
 * 
 * 공격 시나리오:
 * ❌ projects:create를 1초에 1000번 호출
 * ❌ settings:set을 반복 호출하여 데이터 변조
 * ✅ 이제 제한됨
 */

import { Logger } from '../../shared/logger';

export interface RateLimitConfig {
  maxRequests: number;      // 시간 윈도우 내 최대 요청 수
  windowMs: number;         // 시간 윈도우 (ms)
  blockDurationMs: number;  // 차단 시간 (ms)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // ms
  requestCount: number;
}

/**
 * 🔒 Rate Limiter - Token Bucket 알고리즘
 * 
 * 특징:
 * - 메모리 효율: Map 기반 추적
 * - 시간 윈도우: 슬라이딩 윈도우
 * - 유연한 설정: IPC 채널별 다른 제한값 적용 가능
 * - 자동 정리: 만료된 항목 주기적 제거
 */
export class RateLimiterService {
  private readonly requestCounts: Map<string, number[]> = new Map();
  private readonly blockedUntil: Map<string, number> = new Map();
  private readonly config: RateLimitConfig;
  private cleanupInterval?: NodeJS.Timeout;

  /**
   * RateLimiterService 생성자
   * 
   * @param config 레이트 제한 설정
   * @example
   * ```typescript
   * const limiter = new RateLimiterService({
   *   maxRequests: 100,        // 100 requests
   *   windowMs: 60_000,        // per 60 seconds
   *   blockDurationMs: 300_000 // block for 5 minutes
   * })
   * ```
   */
  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      maxRequests: config.maxRequests ?? 100,
      windowMs: config.windowMs ?? 60_000,        // 1분
      blockDurationMs: config.blockDurationMs ?? 300_000, // 5분
    };

    Logger.info('RATE_LIMITER', '🔒 RateLimiterService initialized', {
      maxRequests: this.config.maxRequests,
      windowMs: this.config.windowMs,
      blockDurationMs: this.config.blockDurationMs,
    });

    // 주기적 정리 (1분마다)
    this.startCleanupInterval();
  }

  /**
   * 요청 허용 여부 판단
   * 
   * @param key 식별자 (예: IP, userId, IPC channel)
   * @returns {RateLimitResult}
   * 
   * @example
   * ```typescript
   * const result = limiter.checkLimit('projects:create');
   * if (!result.allowed) {
   *   throw new Error(`Rate limited. Retry after ${result.retryAfter}ms`);
   * }
   * ```
   */
  checkLimit(key: string): RateLimitResult {
    const now = Date.now();

    // 차단 상태 확인
    const blockedUntilTime = this.blockedUntil.get(key);
    if (blockedUntilTime && blockedUntilTime > now) {
      const retryAfter = blockedUntilTime - now;
      Logger.warn('RATE_LIMITER', '⚠️ Key is blocked', {
        key,
        retryAfterMs: retryAfter,
      });

      return {
        allowed: false,
        remaining: 0,
        retryAfter,
        requestCount: 0,
      };
    }

    // 차단 해제
    if (blockedUntilTime) {
      this.blockedUntil.delete(key);
    }

    // 시간 윈도우 내 요청 타임스탬프 가져오기
    let timestamps = this.requestCounts.get(key) || [];

    // 만료된 요청 제거 (윈도우 밖)
    timestamps = timestamps.filter((ts) => now - ts < this.config.windowMs);

    // 요청 수 확인
    const requestCount = timestamps.length;
    const allowed = requestCount < this.config.maxRequests;

    if (allowed) {
      // 새 요청 기록
      timestamps.push(now);
      this.requestCounts.set(key, timestamps);

      Logger.debug('RATE_LIMITER', '✅ Request allowed', {
        key,
        requestCount: timestamps.length,
        maxRequests: this.config.maxRequests,
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - timestamps.length,
        retryAfter: 0,
        requestCount: timestamps.length,
      };
    } else {
      // 제한 초과 - 차단
      const blockUntil = now + this.config.blockDurationMs;
      this.blockedUntil.set(key, blockUntil);

      Logger.warn('RATE_LIMITER', '🚫 Rate limit exceeded - blocking', {
        key,
        requestCount,
        maxRequests: this.config.maxRequests,
        blockDurationMs: this.config.blockDurationMs,
      });

      return {
        allowed: false,
        remaining: 0,
        retryAfter: this.config.blockDurationMs,
        requestCount,
      };
    }
  }

  /**
   * 여러 키에 대해 일괄 확인
   * 
   * @param keys 식별자 배열
   * @returns 각 키에 대한 제한 결과
   */
  checkLimits(keys: string[]): Map<string, RateLimitResult> {
    const results = new Map<string, RateLimitResult>();
    for (const key of keys) {
      results.set(key, this.checkLimit(key));
    }
    return results;
  }

  /**
   * 특정 키 리셋
   * 
   * @param key 리셋할 식별자
   */
  reset(key: string): void {
    this.requestCounts.delete(key);
    this.blockedUntil.delete(key);
    Logger.debug('RATE_LIMITER', 'Key reset', { key });
  }

  /**
   * 모든 제한 초기화
   */
  resetAll(): void {
    this.requestCounts.clear();
    this.blockedUntil.clear();
    Logger.info('RATE_LIMITER', 'All rate limits reset');
  }

  /**
   * 현재 통계 조회
   * 
   * @returns {object} 통계 데이터
   */
  getStats(): object {
    return {
      trackedKeys: this.requestCounts.size,
      blockedKeys: this.blockedUntil.size,
      totalRequests: Array.from(this.requestCounts.values()).reduce(
        (sum, timestamps) => sum + timestamps.length,
        0
      ),
      configuredMaxRequests: this.config.maxRequests,
      configuredWindowMs: this.config.windowMs,
    };
  }

  /**
   * 만료된 항목 정리
   * @private
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    // 만료된 타임스탬프 제거
    for (const [key, timestamps] of this.requestCounts.entries()) {
      const filtered = timestamps.filter((ts) => now - ts < this.config.windowMs);
      if (filtered.length === 0) {
        this.requestCounts.delete(key);
        cleaned++;
      } else if (filtered.length < timestamps.length) {
        this.requestCounts.set(key, filtered);
      }
    }

    // 만료된 차단 해제
    for (const [key, blockUntil] of this.blockedUntil.entries()) {
      if (blockUntil <= now) {
        this.blockedUntil.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      Logger.debug('RATE_LIMITER', 'Cleanup completed', {
        itemsCleaned: cleaned,
        trackedKeys: this.requestCounts.size,
        blockedKeys: this.blockedUntil.size,
      });
    }
  }

  /**
   * 주기적 정리 시작
   * @private
   */
  private startCleanupInterval(): void {
    // 1분마다 정리
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      60_000
    );
  }

  /**
   * 서비스 종료
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requestCounts.clear();
    this.blockedUntil.clear();
    Logger.info('RATE_LIMITER', 'RateLimiterService destroyed');
  }
}

/**
 * 글로벌 Rate Limiter 인스턴스
 * 
 * IPC 채널별로 다른 제한값 적용 권장:
 * - settings:set: 10 requests/60s (민감한 작업)
 * - projects:create: 50 requests/60s (일반 작업)
 * - projects:get-all: 100 requests/60s (읽기 작업)
 */
export const globalRateLimiter = new RateLimiterService({
  maxRequests: 100,
  windowMs: 60_000,
  blockDurationMs: 300_000,
});

/**
 * 채널별 제한 설정
 */
export const channelLimiters = {
  // 🔒 민감한 작업
  'settings:set': new RateLimiterService({
    maxRequests: 10,
    windowMs: 60_000,
    blockDurationMs: 600_000, // 10분
  }),

  // 🔒 프로젝트 작업
  'projects:create': new RateLimiterService({
    maxRequests: 50,
    windowMs: 60_000,
    blockDurationMs: 300_000,
  }),

  'projects:update': new RateLimiterService({
    maxRequests: 100,
    windowMs: 60_000,
    blockDurationMs: 300_000,
  }),

  // ✅ 읽기 작업 (덜 제한함)
  'projects:get-all': new RateLimiterService({
    maxRequests: 200,
    windowMs: 60_000,
    blockDurationMs: 60_000,
  }),
};
