// 🔥 기가차드 IPC Performance Optimizer - 통신 최적화

import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron';
import { Logger } from '../../shared/logger';

// 🔥 렌더러 프로세스에서만 ipcRenderer 동적 import
let ipcRenderer: { send: (channel: string, ...args: unknown[]) => void } | null = null;

// 🔥 프로세스 타입 안전한 검사
const isMainProcess = (): boolean => {
  try {
    return typeof process !== 'undefined' && 
           typeof process.versions === 'object' &&
           typeof process.versions.electron === 'string' &&
           typeof require !== 'undefined' &&
           typeof window === 'undefined';
  } catch {
    return false;
  }
};

const isRendererProcess = (): boolean => {
  try {
    // ✅ 타입 안전한 체크
    return typeof window !== 'undefined' && 
           'electronAPI' in window;
  } catch {
    return false;
  }
};

/**
 * 🔥 IPC 최적화 설정
 */
export interface IPCOptimizationConfig {
  batchSize: number;
  debounceInterval: number;
  compressionEnabled: boolean;
  priorityChannels: string[];
  maxQueueSize: number;
}

/**
 * 🔥 IPC 메시지 배치 처리용 인터페이스
 */
interface IPCMessage {
  channel: string;
  data: unknown;
  timestamp: number;
  priority: 'high' | 'normal' | 'low';
}

/**
 * 🔥 성능 메트릭 인터페이스
 */
interface PerformanceMetrics {
  messagesProcessed: number;
  averageProcessingTime: number;
  queueSize: number;
  compressionRatio: number;
}

/**
 * 🔥 IPCOptimizer - IPC 통신 성능 최적화
 * 
 * 책임:
 * - IPC 메시지 배치 처리
 * - 우선순위 기반 큐 관리
 * - 메시지 압축
 * - 통신 성능 모니터링
 */
export class IPCOptimizer {
  private readonly componentName = 'IPC_OPTIMIZER';
  private messageQueue: IPCMessage[] = [];
  private processingTimer: NodeJS.Timeout | null = null;
  private isMainProcess: boolean;
  private config: IPCOptimizationConfig;
  private performanceMetrics: PerformanceMetrics = {
    messagesProcessed: 0,
    averageProcessingTime: 0,
    queueSize: 0,
    compressionRatio: 0,
  };

  constructor(config?: Partial<IPCOptimizationConfig>) {
    this.isMainProcess = isMainProcess();
    this.config = {
      batchSize: 50,
      debounceInterval: 16, // 60fps
      compressionEnabled: true,
      priorityChannels: ['keyboard:events', 'stats:update', 'window:state'],
      maxQueueSize: 1000,
      ...config,
    };

    this.initializeOptimizer();
    Logger.info(this.componentName, '🚀 IPC optimizer initialized', {
      isMainProcess: this.isMainProcess,
      config: this.config
    });
  }

  /**
   * 🔥 최적화 초기화
   */
  private async initializeOptimizer(): Promise<void> {
    if (this.isMainProcess) {
      this.setupMainProcessOptimization();
    } else {
      await this.setupRendererProcessOptimization();
    }

    // 배치 처리 타이머 시작
    this.startBatchProcessing();
  }

  /**
   * 🔥 메인 프로세스 최적화 설정
   */
  private setupMainProcessOptimization(): void {
    // 고성능 채널 등록 (배치 처리 우회)
      this.config.priorityChannels.forEach(channel => {
        ipcMain.on(channel, (event: IpcMainEvent, ...args: unknown[]) => {
          this.handleHighPriorityMessage(channel, args, event);
        });
      });

    // 배치 처리용 채널 등록
    ipcMain.on('ipc:batch-message', (event: IpcMainEvent, messages: IPCMessage[]) => {
      this.processBatchMessages(messages, event);
    });

    // 성능 메트릭 요청 처리
    ipcMain.handle('ipc:get-metrics', () => {
      return this.getPerformanceMetrics();
    });

    Logger.debug(this.componentName, 'Main process IPC optimization configured');
  }

  /**
   * 🔥 렌더러 프로세스 최적화 설정
   */
  private async setupRendererProcessOptimization(): Promise<void> {
    try {
      // 렌더러 프로세스에서만 ipcRenderer 동적 import
      if (!this.isMainProcess && typeof window !== 'undefined') {
        const electron = await import('electron');
        ipcRenderer = electron.ipcRenderer;
        Logger.debug(this.componentName, 'Renderer process IPC optimization configured');
      }
    } catch (error) {
      Logger.warn(this.componentName, 'Failed to setup renderer process optimization', error);
    }
  }

  /**
   * 🔥 배치 처리 시작
   */
  private startBatchProcessing(): void {
    if (this.processingTimer) return;

    this.processingTimer = setInterval(() => {
      this.processBatch();
    }, this.config.debounceInterval);
  }

  /**
   * 🔥 최적화된 메시지 전송 (렌더러용)
   */
  public sendOptimized(
    channel: string, 
    data: unknown, 
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): void {
    if (this.isMainProcess) {
      Logger.warn(this.componentName, 'sendOptimized should not be called from main process');
      return;
    }

    const message: IPCMessage = {
      channel,
      data: this.config.compressionEnabled ? this.compressData(data) : data,
      timestamp: Date.now(),
      priority,
    };

    // 고우선순위 메시지는 즉시 전송
    if (priority === 'high' || this.config.priorityChannels.includes(channel)) {
      if (ipcRenderer) {
        ipcRenderer.send(channel, data);
        this.performanceMetrics.messagesProcessed++;
      } else {
        Logger.warn(this.componentName, 'ipcRenderer not available for high priority message');
      }
      return;
    }

    // 일반 메시지는 큐에 추가
    this.addToQueue(message);
  }

  /**
   * 🔥 큐에 메시지 추가
   */
  private addToQueue(message: IPCMessage): void {
    // 큐 크기 제한 확인
    if (this.messageQueue.length >= this.config.maxQueueSize) {
      // 오래된 low priority 메시지 제거
      this.messageQueue = this.messageQueue.filter(m => m.priority !== 'low');
      Logger.warn(this.componentName, 'Queue overflow, removed low priority messages');
    }

    this.messageQueue.push(message);
    this.performanceMetrics.queueSize = this.messageQueue.length;

    // 큐가 배치 크기에 도달하면 즉시 처리
    if (this.messageQueue.length >= this.config.batchSize) {
      this.processBatch();
    }
  }

  /**
   * 🔥 배치 처리 실행
   */
  private processBatch(): void {
    if (this.messageQueue.length === 0) return;

    const startTime = Date.now();
    
    // 우선순위별 정렬
    this.messageQueue.sort((a, b) => {
      const priorityWeight = { high: 3, normal: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    // 배치 크기만큼 처리
    const batch = this.messageQueue.splice(0, this.config.batchSize);
    
    if (this.isMainProcess) {
      // 메인 프로세스: 직접 처리
      batch.forEach(message => {
        this.handleBatchMessage(message);
      });
    } else {
      // 렌더러 프로세스: 배치로 전송
      if (ipcRenderer) {
        ipcRenderer.send('ipc:batch-message', batch);
      } else {
        Logger.warn(this.componentName, 'ipcRenderer not available for batch processing');
      }
    }

    // 성능 메트릭 업데이트
    const processingTime = Date.now() - startTime;
    this.updatePerformanceMetrics(batch.length, processingTime);

    Logger.debug(this.componentName, `📦 Processed batch: ${batch.length} messages in ${processingTime}ms`);
  }

  /**
   * 🔥 고우선순위 메시지 처리
   */
  private handleHighPriorityMessage(channel: string, args: unknown[], event?: IpcMainEvent): void {
    const startTime = Date.now();
    
    try {
      // 채널별 특화 처리
      switch (channel) {
        case 'keyboard:events':
          this.handleKeyboardEvents(args);
          break;
        case 'stats:update':
          this.handleStatsUpdate(args);
          break;
        case 'window:state':
          this.handleWindowState(args);
          break;
        default:
          Logger.debug(this.componentName, `High priority message: ${channel}`);
      }

      const processingTime = Date.now() - startTime;
      this.updatePerformanceMetrics(1, processingTime);
    } catch (error) {
      Logger.error(this.componentName, `High priority message handling failed: ${channel}`, error);
    }
  }

  /**
   * 🔥 배치 메시지 처리 (메인 프로세스)
   */
  private processBatchMessages(messages: IPCMessage[], event?: IpcMainEvent): void {
    const startTime = Date.now();

    try {
      messages.forEach(message => {
        this.handleBatchMessage(message);
      });

      const processingTime = Date.now() - startTime;
      this.updatePerformanceMetrics(messages.length, processingTime);

      Logger.debug(this.componentName, `📦 Batch processed: ${messages.length} messages in ${processingTime}ms`);
    } catch (error) {
      Logger.error(this.componentName, 'Batch message processing failed', error);
    }
  }

  /**
   * 🔥 개별 배치 메시지 처리
   */
  private handleBatchMessage(message: IPCMessage): void {
    try {
      const data = this.config.compressionEnabled ? this.decompressData(message.data) : message.data;
      
      // 메시지 타입별 처리
      switch (message.channel) {
        case 'typing:events':
          this.handleTypingEvents(data);
          break;
        case 'ui:update':
          this.handleUIUpdate(data);
          break;
        case 'settings:change':
          this.handleSettingsChange(data);
          break;
        default:
          Logger.debug(this.componentName, `Batch message: ${message.channel}`);
      }
    } catch (error) {
      Logger.error(this.componentName, `Batch message handling failed: ${message.channel}`, error);
    }
  }

  /**
   * 🔥 키보드 이벤트 처리 (고우선순위)
   */
  private handleKeyboardEvents(args: unknown[]): void {
    // 키보드 이벤트는 즉시 처리되어야 함
    Logger.debug(this.componentName, '⌨️ High priority keyboard event processed');
  }

  /**
   * 🔥 통계 업데이트 처리 (고우선순위)
   */
  private handleStatsUpdate(args: unknown[]): void {
    // 실시간 통계는 즉시 업데이트
    Logger.debug(this.componentName, '📊 High priority stats update processed');
  }

  /**
   * 🔥 윈도우 상태 처리 (고우선순위)
   */
  private handleWindowState(args: unknown[]): void {
    // 윈도우 상태 변경은 즉시 반영
    Logger.debug(this.componentName, '🪟 High priority window state processed');
  }

  /**
   * 🔥 타이핑 이벤트 처리 (배치)
   */
  private handleTypingEvents(data: unknown): void {
    // 타이핑 이벤트 배치 처리
    Logger.debug(this.componentName, '⌨️ Batch typing events processed');
  }

  /**
   * 🔥 UI 업데이트 처리 (배치)
   */
  private handleUIUpdate(data: unknown): void {
    // UI 업데이트 배치 처리
    Logger.debug(this.componentName, '🎨 Batch UI update processed');
  }

  /**
   * 🔥 설정 변경 처리 (배치)
   */
  private handleSettingsChange(data: unknown): void {
    // 설정 변경 배치 처리
    Logger.debug(this.componentName, '⚙️ Batch settings change processed');
  }

  /**
   * 🔥 데이터 압축
   */
  private compressData(data: unknown): unknown {
    try {
      // 간단한 JSON 문자열 압축 (실제로는 zlib 등 사용 권장)
      const jsonString = JSON.stringify(data);
      if (jsonString.length > 1000) {
        // 1KB 이상일 때만 압축 시도
        const compressed = this.simpleCompress(jsonString);
        this.performanceMetrics.compressionRatio = compressed.length / jsonString.length;
        return { __compressed: true, data: compressed };
      }
      return data;
    } catch (error) {
      Logger.warn(this.componentName, 'Data compression failed', error);
      return data;
    }
  }

  /**
   * 🔥 데이터 압축 해제
   */
  private decompressData(data: unknown): unknown {
    try {
      if (data && typeof data === 'object' && (data as any).__compressed) {
        const compressedData = (data as any).data;
        const decompressed = this.simpleDecompress(compressedData);
        return JSON.parse(decompressed);
      }
      return data;
    } catch (error) {
      Logger.warn(this.componentName, 'Data decompression failed', error);
      return data;
    }
  }

  /**
   * 🔥 간단한 압축 (실제 구현에서는 zlib 사용 권장)
   */
  private simpleCompress(str: string): string {
    // Base64 인코딩으로 간단한 압축 시뮬레이션
    return Buffer.from(str).toString('base64');
  }

  /**
   * 🔥 간단한 압축 해제
   */
  private simpleDecompress(str: string): string {
    return Buffer.from(str, 'base64').toString();
  }

  /**
   * 🔥 성능 메트릭 업데이트
   */
  private updatePerformanceMetrics(messageCount: number, processingTime: number): void {
    this.performanceMetrics.messagesProcessed += messageCount;
    
    // 평균 처리 시간 계산 (이동 평균)
    const alpha = 0.1; // 평활화 계수
    this.performanceMetrics.averageProcessingTime = 
      alpha * processingTime + (1 - alpha) * this.performanceMetrics.averageProcessingTime;
    
    this.performanceMetrics.queueSize = this.messageQueue.length;
  }

  /**
   * 🔥 성능 메트릭 조회
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * 🔥 큐 초기화
   */
  public clearQueue(): void {
    this.messageQueue = [];
    this.performanceMetrics.queueSize = 0;
    Logger.info(this.componentName, '🧹 Message queue cleared');
  }

  /**
   * 🔥 정리
   */
  public cleanup(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }
    
    this.clearQueue();
    Logger.info(this.componentName, '🧹 IPC optimizer cleaned up');
  }
}

// 🔥 단일 인스턴스 export
export const ipcOptimizer = new IPCOptimizer();
