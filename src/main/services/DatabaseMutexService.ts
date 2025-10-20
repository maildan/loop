/**
 * 🔒 데이터베이스 동시성 제어 서비스
 * 
 * SQLite는 동시 쓰기를 1개만 허용하므로, IPC 핸들러의 쓰기 작업을 직렬화합니다.
 * 이를 통해 SQLITE_BUSY 에러를 방지하고 안정적인 동시 요청 처리를 보장합니다.
 * 
 * 사용:
 * ```typescript
 * const result = await databaseMutex.acquire('write', async () => {
 *   return await prisma.project.create({ data });
 * });
 * ```
 */

import AsyncLock from 'async-lock';
import { Logger } from '../../shared/logger';

/**
 * 🔒 데이터베이스 뮤텍스 싱글톤
 */
class DatabaseMutexService {
  private readonly componentName = 'DB_MUTEX';
  private lock: AsyncLock;
  private stats = {
    totalRequests: 0,
    acquiredLocks: 0,
    waitingRequests: 0,
    failedRequests: 0,
  };

  constructor() {
    this.lock = new AsyncLock() as any;
    Logger.info(this.componentName, '✅ Database Mutex Service initialized');
  }

  /**
   * 🔒 쓰기 작업을 직렬화하여 실행
   */
  async acquireWriteLock<T>(
    operation: () => Promise<T>,
    timeout: number = 30000
  ): Promise<T> {
    const operationId = Math.random().toString(36).substring(7);
    this.stats.totalRequests++;

    try {
      Logger.debug(this.componentName, `[${operationId}] Acquiring write lock...`, {
        waitingRequests: this.stats.waitingRequests,
        acquiredLocks: this.stats.acquiredLocks,
      });

      this.stats.waitingRequests++;

      // 🔒 Mutex로 쓰기 작업 보호
      const result = await (this.lock as any).acquire('db-write', async () => {
        this.stats.waitingRequests--;
        this.stats.acquiredLocks++;

        const startTime = Date.now();
        Logger.debug(this.componentName, `[${operationId}] Lock acquired, executing operation...`);

        try {
          const result = await Promise.race([
            operation(),
            new Promise<never>((_, reject) =>
              setTimeout(
                () => reject(new Error(`Operation timeout after ${timeout}ms`)),
                timeout
              )
            ),
          ]);

          const duration = Date.now() - startTime;
          Logger.debug(this.componentName, `[${operationId}] Operation completed`, {
            duration: `${duration}ms`,
            totalRequests: this.stats.totalRequests,
          });

          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          Logger.error(this.componentName, `[${operationId}] Operation failed`, {
            error,
            duration: `${duration}ms`,
          });
          throw error;
        }
      });

      return result;
    } catch (error) {
      this.stats.failedRequests++;
      Logger.error(this.componentName, `[${operationId}] Failed to acquire lock`, {
        error,
        stats: this.stats,
      });
      throw error;
    } finally {
      this.stats.acquiredLocks--;
    }
  }

  /**
   * 🔒 읽기 작업 (Lock 불필요)
   */
  async acquireReadLock<T>(operation: () => Promise<T>): Promise<T> {
    return operation();
  }

  /**
   * 📊 통계 조회
   */
  getStats() {
    return {
      totalRequests: this.stats.totalRequests,
      acquiredLocks: this.stats.acquiredLocks,
      waitingRequests: this.stats.waitingRequests,
      failedRequests: this.stats.failedRequests,
      successRate: this.stats.totalRequests > 0 
        ? (((this.stats.totalRequests - this.stats.failedRequests) / this.stats.totalRequests) * 100).toFixed(2) + '%'
        : 'N/A',
    };
  }

  /**
   * 🔄 Lock 상태 초기화 (테스트용)
   */
  reset(): void {
    this.lock = new AsyncLock() as any;
    this.stats = {
      totalRequests: 0,
      acquiredLocks: 0,
      waitingRequests: 0,
      failedRequests: 0,
    };
    Logger.debug(this.componentName, 'Database Mutex reset');
  }
}

// 싱글톤 인스턴스
export const databaseMutex = new DatabaseMutexService();

export default databaseMutex;
