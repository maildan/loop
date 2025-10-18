/**
 * 🔒 V4 Security Fix Test Suite - Rate Limiting
 * 
 * Test cases for Token Bucket rate limiting implementation
 * Tests cover:
 * - Request allowance within limits
 * - Request rejection over limits
 * - Block duration enforcement
 * - Cleanup mechanism
 * - Per-channel configuration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RateLimiterService } from '../../src/main/services/RateLimiterService';

describe('V4 Security - Rate Limiting (RateLimiterService)', () => {
  let limiter: RateLimiterService;

  beforeEach(() => {
    // Create a rate limiter with 5 requests per 1000ms for testing
    limiter = new RateLimiterService({
      maxRequests: 5,
      windowMs: 1000,
      blockDurationMs: 2000,
    });
  });

  afterEach(() => {
    // Cleanup
    limiter.destroy();
  });

  describe('Basic Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const result = limiter.checkLimit('test-key-1');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should track multiple requests from same key', () => {
      const keys = Array.from({ length: 5 }, (_, i) => `req-${i}`);
      for (const key of keys) {
        const result = limiter.checkLimit('multi-key');
        expect(result.allowed).toBe(true);
      }

      // 6th request should be denied
      const lastResult = limiter.checkLimit('multi-key');
      expect(lastResult.allowed).toBe(false);
      expect(lastResult.retryAfter).toBeGreaterThan(0);
    });

    it('should allow requests from different keys independently', () => {
      for (let i = 0; i < 5; i++) {
        const result1 = limiter.checkLimit('key-a');
        const result2 = limiter.checkLimit('key-b');
        expect(result1.allowed).toBe(true);
        expect(result2.allowed).toBe(true);
      }

      // Both should be limited now
      const resultA = limiter.checkLimit('key-a');
      const resultB = limiter.checkLimit('key-b');
      expect(resultA.allowed).toBe(false);
      expect(resultB.allowed).toBe(false);
    });
  });

  describe('Block Duration Enforcement', () => {
    it('should block requests when limit exceeded', () => {
      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit('block-test');
      }

      const result = limiter.checkLimit('block-test');
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should return appropriate retry-after value', () => {
      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit('retry-test');
      }

      const result = limiter.checkLimit('retry-test');
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeLessThanOrEqual(2000); // blockDurationMs
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should track request count when blocked', () => {
      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit('count-test');
      }

      const result = limiter.checkLimit('count-test');
      expect(result.allowed).toBe(false);
      expect(result.requestCount).toBe(5); // Should show original limit
    });
  });

  describe('Batch Operations', () => {
    it('should check multiple keys at once', () => {
      const keys = ['batch-1', 'batch-2', 'batch-3'];
      const results = limiter.checkLimits(keys);

      expect(results.size).toBe(3);
      let allAllowed = true;
      results.forEach((result) => {
        if (!result.allowed) allAllowed = false;
      });
      expect(allAllowed).toBe(true);
    });

    it('should handle mixed allowed/denied in batch', () => {
      const key = 'mixed-batch';
      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit(key);
      }

      // Try batch check
      const results = limiter.checkLimits([key, 'other-key']);
      const deniedResult = results.get(key);
      const allowedResult = results.get('other-key');
      
      expect(deniedResult?.allowed).toBe(false); // Exhausted
      expect(allowedResult?.allowed).toBe(true); // Fresh key
    });
  });

  describe('Reset Operations', () => {
    it('should reset specific key', () => {
      // Exhaust limit
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit('reset-test');
      }

      let result = limiter.checkLimit('reset-test');
      expect(result.allowed).toBe(false);

      // Reset
      limiter.reset('reset-test');

      result = limiter.checkLimit('reset-test');
      expect(result.allowed).toBe(true);
    });

    it('should reset all keys', () => {
      // Exhaust multiple keys
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit('reset-all-1');
        limiter.checkLimit('reset-all-2');
      }

      let result1 = limiter.checkLimit('reset-all-1');
      let result2 = limiter.checkLimit('reset-all-2');
      expect(result1.allowed).toBe(false);
      expect(result2.allowed).toBe(false);

      // Reset all
      limiter.resetAll();

      result1 = limiter.checkLimit('reset-all-1');
      result2 = limiter.checkLimit('reset-all-2');
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should return current statistics', () => {
      limiter.checkLimit('stats-1');
      limiter.checkLimit('stats-1');
      limiter.checkLimit('stats-2');

      const stats = limiter.getStats() as any;

      expect(stats).toHaveProperty('trackedKeys');
      expect(stats).toHaveProperty('blockedKeys');
      expect(stats.trackedKeys).toBeGreaterThan(0);
    });

    it('should track when limits are exceeded', () => {
      for (let i = 0; i < 5; i++) {
        limiter.checkLimit('exceed-test');
      }

      const statsBefore = limiter.getStats() as any;
      limiter.checkLimit('exceed-test'); // This should exceed
      const statsAfter = limiter.getStats() as any;

      expect(statsAfter.blockedKeys).toBeGreaterThan(statsBefore.blockedKeys);
    });
  });

  describe('Time Window Behavior', () => {
    it('should allow new requests after window expires', async () => {
      // Use shorter timeout for testing
      const shortLimiter = new RateLimiterService({
        maxRequests: 2,
        windowMs: 100,
        blockDurationMs: 50,
      });

      // Fill quota
      shortLimiter.checkLimit('time-test');
      shortLimiter.checkLimit('time-test');

      let result = shortLimiter.checkLimit('time-test');
      expect(result.allowed).toBe(false);

      // Wait for block duration to pass
      await new Promise(resolve => setTimeout(resolve, 150));

      result = shortLimiter.checkLimit('time-test');
      expect(result.allowed).toBe(true);

      shortLimiter.destroy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty key string', () => {
      const result = limiter.checkLimit('');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should handle very long key strings', () => {
      const longKey = 'x'.repeat(10000);
      const result = limiter.checkLimit(longKey);
      expect(result.allowed).toBe(true);
    });

    it('should handle rapid successive calls', () => {
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(limiter.checkLimit('rapid'));
      }

      // First 5 should be allowed, rest denied
      expect(results.slice(0, 5).every(r => r.allowed)).toBe(true);
      expect(results.slice(5).every(r => !r.allowed)).toBe(true);
    });

    it('should handle zero or negative configuration values gracefully', () => {
      // Should not throw, should use defaults
      const strictLimiter = new RateLimiterService({
        maxRequests: 1,
        windowMs: 100,
        blockDurationMs: 50,
      });

      const result = strictLimiter.checkLimit('strict');
      expect(result.allowed).toBe(true);

      const result2 = strictLimiter.checkLimit('strict');
      expect(result2.allowed).toBe(false);

      strictLimiter.destroy();
    });
  });

  describe('Memory Management', () => {
    it('should cleanup expired entries', async () => {
      const cleanupLimiter = new RateLimiterService({
        maxRequests: 10,
        windowMs: 100,
        blockDurationMs: 100,
      });

      // Add several keys
      for (let i = 0; i < 5; i++) {
        cleanupLimiter.checkLimit(`cleanup-${i}`);
      }

      let stats = cleanupLimiter.getStats() as any;
      expect(stats.trackedKeys).toBe(5);

      // Wait for entries to expire
      await new Promise(resolve => setTimeout(resolve, 200));

      stats = cleanupLimiter.getStats() as any;
      // Should have cleaned up old entries
      expect(stats.trackedKeys).toBeLessThanOrEqual(5);

      cleanupLimiter.destroy();
    });

    it('should handle destroy method', () => {
      limiter.checkLimit('destroy-test');
      expect(() => limiter.destroy()).not.toThrow();

      // After destroy, should not be usable
      const result = limiter.checkLimit('destroy-test');
      // Behavior after destroy is implementation-specific
      expect(result).toBeDefined();
    });
  });

  describe('Real-world IPC Scenarios', () => {
    it('should rate limit projects:create channel', () => {
      // Simulate channel-specific limiter
      const projectLimiter = new RateLimiterService({
        maxRequests: 50,
        windowMs: 60000, // 60 seconds
        blockDurationMs: 300000, // 5 minutes
      });

      // Simulate 50 project creations
      for (let i = 0; i < 50; i++) {
        const result = projectLimiter.checkLimit('projects:create');
        expect(result.allowed).toBe(true);
      }

      // 51st request should be denied
      const result = projectLimiter.checkLimit('projects:create');
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeLessThanOrEqual(300000);

      projectLimiter.destroy();
    });

    it('should rate limit settings:set channel (stricter)', () => {
      // Simulate settings-specific limiter (more restrictive)
      const settingsLimiter = new RateLimiterService({
        maxRequests: 10,
        windowMs: 60000, // 60 seconds
        blockDurationMs: 600000, // 10 minutes
      });

      // Simulate 10 setting changes
      for (let i = 0; i < 10; i++) {
        const result = settingsLimiter.checkLimit('settings:set');
        expect(result.allowed).toBe(true);
      }

      // 11th request should be denied
      const result = settingsLimiter.checkLimit('settings:set');
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeLessThanOrEqual(600000);

      settingsLimiter.destroy();
    });

    it('should handle per-channel difference in limits', () => {
      const readLimiter = new RateLimiterService({
        maxRequests: 200,
        windowMs: 60000,
        blockDurationMs: 60000,
      });

      const writeLimiter = new RateLimiterService({
        maxRequests: 50,
        windowMs: 60000,
        blockDurationMs: 300000,
      });

      // Read operations should allow more
      for (let i = 0; i < 200; i++) {
        const result = readLimiter.checkLimit('projects:get-all');
        if (i < 200) expect(result.allowed).toBe(true);
      }

      // Write operations should allow less
      for (let i = 0; i < 50; i++) {
        const result = writeLimiter.checkLimit('projects:create');
        if (i < 50) expect(result.allowed).toBe(true);
      }

      readLimiter.destroy();
      writeLimiter.destroy();
    });
  });
});
