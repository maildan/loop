// 🔥 기가차드 메모리 매니저 - 완벽한 메모리 최적화 전문가!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result } from '../../shared/types';
import { EventEmitter } from 'events';

// #DEBUG: Memory manager entry point
Logger.debug('MEMORY_MANAGER', 'Memory manager module loaded');

// 🔥 기가차드 메모리 정보 인터페이스
export interface MemoryInfo {
  used: number; // bytes
  total: number; // bytes
  free: number; // bytes
  percentage: number; // 0-100
  heap: {
    used: number;
    total: number;
    limit: number;
  };
  external: number;
  arrayBuffers: number;
}

// 🔥 기가차드 가비지 컬렉션 통계
export interface GCStats {
  totalCollections: number;
  totalTime: number; // milliseconds
  averageTime: number; // milliseconds
  lastCollection: Date | null;
  memoryFreed: number; // bytes
}

// 🔥 기가차드 메모리 풀 정보
export interface MemoryPoolInfo {
  name: string;
  type: 'buffer' | 'object' | 'string' | 'array';
  size: number; // current pool size
  maxSize: number; // maximum pool size
  used: number; // currently used items
  allocated: number; // total allocated items
  hits: number; // pool hits
  misses: number; // pool misses
  efficiency: number; // hit rate percentage
}

// 🔥 기가차드 메모리 임계값
export interface MemoryThresholds {
  warning: number; // percentage (e.g., 80)
  critical: number; // percentage (e.g., 90)
  emergency: number; // percentage (e.g., 95)
}

// 🔥 기가차드 메모리 설정
export interface MemoryConfig {
  enableMonitoring: boolean;
  enableGC: boolean;
  enableMemoryPools: boolean;
  monitoringInterval: number; // milliseconds
  gcInterval: number; // milliseconds
  thresholds: MemoryThresholds;
  maxHistorySize: number;
}

// 🔥 기가차드 메모리 이벤트
export interface MemoryEvent {
  type: 'warning' | 'critical' | 'emergency' | 'gc-completed' | 'pool-overflow';
  timestamp: Date;
  memoryInfo: MemoryInfo;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * 🔥 MemoryManager - 완벽한 메모리 관리 시스템
 * 실시간 모니터링, 자동 가비지 컬렉션, 메모리 풀 관리, 임계값 알림
 */
export class MemoryManager extends BaseManager {
  private readonly componentName = 'MEMORY_MANAGER';
  private memoryConfig: MemoryConfig;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private gcInterval: NodeJS.Timeout | null = null;
  private memoryHistory: MemoryInfo[] = [];
  private gcStats: GCStats;
  private memoryPools: Map<string, MemoryPoolInfo> = new Map();
  private lastMemoryInfo: MemoryInfo | null = null;

  constructor(config: Partial<MemoryConfig> = {}) {
    super({
      name: 'MemoryManager',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.memoryConfig = {
      enableMonitoring: true,
      enableGC: true,
      enableMemoryPools: true,
      monitoringInterval: 5000, // 5초마다 체크
      gcInterval: 30000, // 30초마다 GC
      thresholds: {
        warning: 80,
        critical: 90,
        emergency: 95,
      },
      maxHistorySize: 100,
      ...config,
    };

    this.gcStats = {
      totalCollections: 0,
      totalTime: 0,
      averageTime: 0,
      lastCollection: null,
      memoryFreed: 0,
    };

    this.initializeMemoryPools();
    
    Logger.info(this.componentName, 'Memory manager instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      this.setupProcessMemoryWarnings();
      
      Logger.info(this.componentName, 'Memory manager initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize memory manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      if (this.memoryConfig.enableMonitoring) {
        this.startMemoryMonitoring();
      }
      
      if (this.memoryConfig.enableGC) {
        this.startGarbageCollection();
      }
      
      Logger.info(this.componentName, 'Memory manager started successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start memory manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      this.stopMemoryMonitoring();
      this.stopGarbageCollection();
      
      Logger.info(this.componentName, 'Memory manager stopped successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop memory manager', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      await this.doStop();
      this.memoryHistory = [];
      this.memoryPools.clear();
      this.lastMemoryInfo = null;
      
      Logger.info(this.componentName, 'Memory manager cleanup completed');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup memory manager', err);
      throw err;
    }
  }

  /**
   * 메모리 풀 초기화
   */
  private initializeMemoryPools(): void {
    if (!this.memoryConfig.enableMemoryPools) return;

    // 버퍼 풀
    this.createMemoryPool('bufferPool', 'buffer', 50, 200);
    
    // 객체 풀
    this.createMemoryPool('objectPool', 'object', 100, 500);
    
    // 문자열 풀
    this.createMemoryPool('stringPool', 'string', 200, 1000);
    
    // 배열 풀
    this.createMemoryPool('arrayPool', 'array', 75, 300);

    Logger.debug(this.componentName, 'Memory pools initialized', {
      poolCount: this.memoryPools.size,
    });
  }

  /**
   * 메모리 풀 생성
   */
  private createMemoryPool(
    name: string, 
    type: MemoryPoolInfo['type'], 
    initialSize: number, 
    maxSize: number
  ): void {
    const poolInfo: MemoryPoolInfo = {
      name,
      type,
      size: initialSize,
      maxSize,
      used: 0,
      allocated: 0,
      hits: 0,
      misses: 0,
      efficiency: 0,
    };

    this.memoryPools.set(name, poolInfo);
  }

  /**
   * 프로세스 메모리 경고 설정
   */
  private setupProcessMemoryWarnings(): void {
    process.on('warning', (warning) => {
      if (warning.name === 'MaxListenersExceededWarning') {
        Logger.warn(this.componentName, 'Memory leak detected: too many listeners', {
          warning: warning.message,
        });
      }
    });
  }

  /**
   * 메모리 모니터링 시작
   */
  private startMemoryMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, this.memoryConfig.monitoringInterval);

    Logger.debug(this.componentName, 'Memory monitoring started');
  }

  /**
   * 메모리 모니터링 중지
   */
  private stopMemoryMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    Logger.debug(this.componentName, 'Memory monitoring stopped');
  }

  /**
   * 가비지 컬렉션 시작
   */
  private startGarbageCollection(): void {
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
    }

    this.gcInterval = setInterval(() => {
      this.performGarbageCollection();
    }, this.memoryConfig.gcInterval);

    Logger.debug(this.componentName, 'Automatic garbage collection started');
  }

  /**
   * 가비지 컬렉션 중지
   */
  private stopGarbageCollection(): void {
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
      this.gcInterval = null;
    }

    Logger.debug(this.componentName, 'Automatic garbage collection stopped');
  }

  /**
   * 메모리 사용량 체크
   */
  private checkMemoryUsage(): void {
    try {
      const memoryInfo = this.getCurrentMemoryInfo();
      
      // 히스토리 업데이트
      this.updateMemoryHistory(memoryInfo);
      
      // 임계값 체크
      this.checkMemoryThresholds(memoryInfo);
      
      // 풀 효율성 업데이트
      this.updatePoolEfficiency();
      
      this.lastMemoryInfo = memoryInfo;
    } catch (error) {
      Logger.error(this.componentName, 'Error checking memory usage', error);
    }
  }

  /**
   * 현재 메모리 정보 가져오기
   */
  private getCurrentMemoryInfo(): MemoryInfo {
    const memUsage = process.memoryUsage();
    const totalMemory = this.getTotalSystemMemory();
    const freeMemory = totalMemory - memUsage.heapUsed;
    
    return {
      used: memUsage.heapUsed,
      total: totalMemory,
      free: freeMemory,
      percentage: (memUsage.heapUsed / totalMemory) * 100,
      heap: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        limit: memUsage.heapUsed + freeMemory,
      },
      external: memUsage.external,
      arrayBuffers: memUsage.arrayBuffers,
    };
  }

  /**
   * 시스템 총 메모리 계산
   */
  private getTotalSystemMemory(): number {
    // Node.js에서는 정확한 시스템 메모리를 얻기 어려우므로
    // heap 기반으로 추정 (실제 구현에서는 OS별 API 사용)
    const memUsage = process.memoryUsage();
    return memUsage.heapTotal * 4; // 대략적인 추정
  }

  /**
   * 메모리 히스토리 업데이트
   */
  private updateMemoryHistory(memoryInfo: MemoryInfo): void {
    this.memoryHistory.push(memoryInfo);
    
    // 히스토리 크기 제한
    if (this.memoryHistory.length > this.memoryConfig.maxHistorySize) {
      this.memoryHistory.shift();
    }
  }

  /**
   * 메모리 임계값 체크
   */
  private checkMemoryThresholds(memoryInfo: MemoryInfo): void {
    const { percentage } = memoryInfo;
    const { thresholds } = this.memoryConfig;

    if (percentage >= thresholds.emergency) {
      this.emitMemoryEvent('emergency', memoryInfo, 'Emergency memory usage detected');
      this.performEmergencyCleanup();
    } else if (percentage >= thresholds.critical) {
      this.emitMemoryEvent('critical', memoryInfo, 'Critical memory usage detected');
      this.performGarbageCollection();
    } else if (percentage >= thresholds.warning) {
      this.emitMemoryEvent('warning', memoryInfo, 'High memory usage detected');
    }
  }

  /**
   * 풀 효율성 업데이트
   */
  private updatePoolEfficiency(): void {
    for (const pool of this.memoryPools.values()) {
      const totalRequests = pool.hits + pool.misses;
      pool.efficiency = totalRequests > 0 ? (pool.hits / totalRequests) * 100 : 0;
    }
  }

  /**
   * 가비지 컬렉션 수행
   */
  private performGarbageCollection(): void {
    const startTime = Date.now();
    const beforeMemory = process.memoryUsage().heapUsed;

    // 강제 가비지 컬렉션 (global.gc가 사용 가능한 경우)
    if (global.gc) {
      global.gc();
    }

    const endTime = Date.now();
    const afterMemory = process.memoryUsage().heapUsed;
    const collectionTime = endTime - startTime;
    const memoryFreed = beforeMemory - afterMemory;

    // GC 통계 업데이트
    this.updateGCStats(collectionTime, memoryFreed);

    Logger.debug(this.componentName, 'Garbage collection completed', {
      duration: collectionTime,
      memoryFreed,
      beforeMemory,
      afterMemory,
    });

    this.emitMemoryEvent('gc-completed', this.getCurrentMemoryInfo(), 'Garbage collection completed', {
      duration: collectionTime,
      memoryFreed,
    });
  }

  /**
   * GC 통계 업데이트
   */
  private updateGCStats(collectionTime: number, memoryFreed: number): void {
    this.gcStats.totalCollections++;
    this.gcStats.totalTime += collectionTime;
    this.gcStats.averageTime = this.gcStats.totalTime / this.gcStats.totalCollections;
    this.gcStats.lastCollection = new Date();
    this.gcStats.memoryFreed += Math.max(0, memoryFreed);
  }

  /**
   * 긴급 정리 수행
   */
  private performEmergencyCleanup(): void {
    Logger.warn(this.componentName, 'Performing emergency memory cleanup');

    // 메모리 히스토리 절반으로 줄이기
    this.memoryHistory = this.memoryHistory.slice(-Math.floor(this.memoryConfig.maxHistorySize / 2));

    // 풀 크기 줄이기
    for (const pool of this.memoryPools.values()) {
      pool.size = Math.floor(pool.size * 0.7); // 30% 감소
    }

    // 강제 GC
    this.performGarbageCollection();
  }

  /**
   * 메모리 이벤트 발생
   */
  private emitMemoryEvent(
    type: MemoryEvent['type'], 
    memoryInfo: MemoryInfo, 
    message: string,
    data?: Record<string, unknown>
  ): void {
    const event: MemoryEvent = {
      type,
      timestamp: new Date(),
      memoryInfo,
      message,
      data,
    };

    this.emit('memory-event', event);
    this.emit(type, event);

    Logger.debug(this.componentName, `Memory event: ${type}`, {
      message,
      percentage: memoryInfo.percentage,
      used: memoryInfo.used,
      data,
    });
  }

  /**
   * 공개 API: 현재 메모리 정보 반환
   */
  public getMemoryInfo(): MemoryInfo {
    return this.getCurrentMemoryInfo();
  }

  /**
   * 공개 API: 메모리 히스토리 반환
   */
  public getMemoryHistory(): MemoryInfo[] {
    return [...this.memoryHistory];
  }

  /**
   * 공개 API: GC 통계 반환
   */
  public getGCStats(): GCStats {
    return { ...this.gcStats };
  }

  /**
   * 공개 API: 메모리 풀 정보 반환
   */
  public getMemoryPools(): MemoryPoolInfo[] {
    return Array.from(this.memoryPools.values());
  }

  /**
   * 공개 API: 특정 풀에서 객체 할당
   */
  public allocateFromPool<TType = unknown>(poolName: string): TType | null {
    const pool = this.memoryPools.get(poolName);
    if (!pool) {
      Logger.warn(this.componentName, 'Pool not found', { poolName });
      return null;
    }

    if (pool.used >= pool.size) {
      pool.misses++;
      
      // 풀이 최대 크기보다 작으면 확장
      if (pool.size < pool.maxSize) {
        pool.size = Math.min(pool.maxSize, Math.floor(pool.size * 1.2));
      } else {
        this.emitMemoryEvent('pool-overflow', this.getCurrentMemoryInfo(), `Pool ${poolName} overflow`);
        return null;
      }
    }

    pool.hits++;
    pool.used++;
    pool.allocated++;

    // 실제 구현에서는 타입별 객체 생성 로직 필요
    return {} as TType;
  }

  /**
   * 공개 API: 풀에 객체 반환
   */
  public returnToPool(poolName: string, obj: unknown): boolean {
    const pool = this.memoryPools.get(poolName);
    if (!pool) {
      return false;
    }

    if (pool.used > 0) {
      pool.used--;
    }

    // 실제 구현에서는 객체 재활용 로직 필요
    return true;
  }

  /**
   * 공개 API: 수동 가비지 컬렉션
   */
  public forceGarbageCollection(): void {
    this.performGarbageCollection();
  }

  /**
   * 공개 API: 메모리 정리
   */
  public async forceCleanup(): Promise<void> {
    this.performEmergencyCleanup();
  }

  /**
   * 공개 API: 설정 업데이트
   */
  public updateConfig(newConfig: Partial<MemoryConfig>): Result<void> {
    try {
      this.memoryConfig = { ...this.memoryConfig, ...newConfig };
      
      // 인터벌 재시작 (필요한 경우)
      if (newConfig.monitoringInterval && this.isRunning()) {
        this.stopMemoryMonitoring();
        this.startMemoryMonitoring();
      }
      
      if (newConfig.gcInterval && this.isRunning()) {
        this.stopGarbageCollection();
        this.startGarbageCollection();
      }

      Logger.info(this.componentName, 'Memory manager config updated', newConfig);
      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to update config', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 공개 API: 메모리 사용량 통계
   */
  public getMemoryStats(): {
    current: MemoryInfo;
    peak: MemoryInfo;
    average: MemoryInfo;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    const current = this.getCurrentMemoryInfo();
    
    if (this.memoryHistory.length === 0) {
      return {
        current,
        peak: current,
        average: current,
        trend: 'stable',
      };
    }

    const peak = this.memoryHistory.reduce((max, info) => 
      info.percentage > max.percentage ? info : max
    );

    const totalUsage = this.memoryHistory.reduce((sum, info) => sum + info.percentage, 0);
    const avgPercentage = totalUsage / this.memoryHistory.length;
    
    const average: MemoryInfo = {
      ...current,
      percentage: avgPercentage,
    };

    // 트렌드 계산 (최근 10개 샘플 기준)
    const recentSamples = this.memoryHistory.slice(-10);
    const trend = this.calculateMemoryTrend(recentSamples);

    return {
      current,
      peak,
      average,
      trend,
    };
  }

  /**
   * 메모리 트렌드 계산
   */
  private calculateMemoryTrend(samples: MemoryInfo[]): 'increasing' | 'decreasing' | 'stable' {
    if (samples.length < 3) return 'stable';

    const firstSample = samples.length > 0 ? samples[0] : null;
    const lastSample = samples.length > 0 ? samples[samples.length - 1] : null;
    
    if (!firstSample || !lastSample) return 'stable';
    
    const first = firstSample.percentage;
    const last = lastSample.percentage;
    const diff = last - first;
    const threshold = 5; // 5% 임계값

    if (diff > threshold) return 'increasing';
    if (diff < -threshold) return 'decreasing';
    return 'stable';
  }
}

// 🔥 기가차드 전역 메모리 매니저
export const memoryManager = new MemoryManager();

// #DEBUG: Memory manager module exit point
Logger.debug('MEMORY_MANAGER', 'Memory manager module setup complete');

export default memoryManager;
