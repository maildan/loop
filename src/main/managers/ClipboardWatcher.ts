// 🔥 기가차드 클립보드 감시자 - 복사/붙여넣기 패턴 분석 및 생산성 추적

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { clipboard, nativeImage } from 'electron';
import { Result } from '../../shared/types';
import { EventEmitter } from 'events';

// #DEBUG: Clipboard watcher entry point
Logger.debug('CLIPBOARD_WATCHER', 'Clipboard watcher module loaded');

// 🔥 기가차드 클립보드 항목 타입
export interface ClipboardItem {
  id: string;
  type: 'text' | 'image' | 'rtf' | 'html' | 'file';
  content: string;
  rawContent?: string; // RTF, HTML 등의 원본 내용
  size: number; // bytes
  timestamp: Date;
  source?: string; // 복사한 앱 이름
  charCount?: number; // 텍스트 문자 수
  wordCount?: number; // 단어 수
  lineCount?: number; // 줄 수
}

// 🔥 기가차드 클립보드 통계
export interface ClipboardStats {
  totalCopies: number;
  totalPastes: number;
  uniqueItems: number;
  mostCopiedType: string;
  averageItemSize: number;
  duplicateRate: number; // 중복 복사 비율
  productivityScore: number; // 생산성 점수 (0-100)
}

// 🔥 기가차드 클립보드 설정
export interface ClipboardConfig {
  maxHistorySize: number;
  enableTextAnalysis: boolean;
  enableImageTracking: boolean;
  enableDuplicateDetection: boolean;
  maxItemSize: number; // bytes
  pollInterval: number; // milliseconds
  enableProductivityAnalysis: boolean;
}

// 🔥 기가차드 클립보드 이벤트
export interface ClipboardEvent {
  type: 'copy' | 'paste' | 'clear' | 'duplicate';
  item: ClipboardItem;
  timestamp: Date;
  context?: string; // 추가 컨텍스트 정보
}

/**
 * 🔥 ClipboardWatcher - 클립보드 활동 모니터링 및 생산성 분석
 * 복사/붙여넣기 패턴 추적, 중복 감지, 생산성 메트릭 계산
 */
export class ClipboardWatcher extends BaseManager {
  private readonly componentName = 'CLIPBOARD_WATCHER';
  private clipboardConfig: ClipboardConfig;
  private clipboardHistory: ClipboardItem[] = [];
  private lastClipboardContent: string = '';
  private lastClipboardHash: string = '';
  private pollingInterval: NodeJS.Timeout | null = null;
  private currentStats: ClipboardStats;

  constructor(config: Partial<ClipboardConfig> = {}) {
    super({
      name: 'ClipboardWatcher',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.clipboardConfig = {
      maxHistorySize: 100,
      enableTextAnalysis: true,
      enableImageTracking: true,
      enableDuplicateDetection: true,
      maxItemSize: 10 * 1024 * 1024, // 10MB
      pollInterval: 500, // 0.5초
      enableProductivityAnalysis: true,
      ...config,
    };

    this.currentStats = {
      totalCopies: 0,
      totalPastes: 0,
      uniqueItems: 0,
      mostCopiedType: 'text',
      averageItemSize: 0,
      duplicateRate: 0,
      productivityScore: 0,
    };

    Logger.info(this.componentName, 'Clipboard watcher instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 초기 클립보드 상태 체크
      await this.checkInitialClipboard();
      
      Logger.info(this.componentName, 'Clipboard watcher initialized');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize clipboard watcher', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 클립보드 모니터링 시작
      this.startClipboardPolling();
      
      this.emit('clipboard-monitoring-started');
      Logger.info(this.componentName, 'Clipboard monitoring started', {
        pollInterval: this.clipboardConfig.pollInterval,
      });
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start clipboard monitoring', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      // 폴링 중지
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }

      this.emit('clipboard-monitoring-stopped');
      Logger.info(this.componentName, 'Clipboard monitoring stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop clipboard monitoring', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      await this.doStop();
      
      // 히스토리 정리
      this.clipboardHistory = [];
      this.lastClipboardContent = '';
      this.lastClipboardHash = '';
      
      Logger.info(this.componentName, 'Clipboard watcher cleanup completed');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup clipboard watcher', err);
      throw err;
    }
  }

  /**
   * 초기 클립보드 상태 체크
   */
  private async checkInitialClipboard(): Promise<void> {
    try {
      const currentContent = clipboard.readText();
      if (currentContent) {
        this.lastClipboardContent = currentContent;
        this.lastClipboardHash = this.generateContentHash(currentContent);
      }
    } catch (error) {
      Logger.error(this.componentName, 'Failed to check initial clipboard', error);
    }
  }

  /**
   * 클립보드 폴링 시작
   */
  private startClipboardPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(async () => {
      await this.checkClipboardChange();
    }, this.clipboardConfig.pollInterval);
  }

  /**
   * 클립보드 변경 체크
   */
  private async checkClipboardChange(): Promise<void> {
    try {
      const currentText = clipboard.readText();
      const currentHash = this.generateContentHash(currentText);

      // 내용이 변경되었는지 확인
      if (currentHash !== this.lastClipboardHash && currentText.trim()) {
        await this.handleClipboardChange(currentText);
        this.lastClipboardContent = currentText;
        this.lastClipboardHash = currentHash;
      }
    } catch (error) {
      Logger.error(this.componentName, 'Error checking clipboard change', error);
    }
  }

  /**
   * 클립보드 변경 처리
   */
  private async handleClipboardChange(content: string): Promise<void> {
    try {
      // 클립보드 항목 생성
      const clipboardItem = await this.createClipboardItem(content);
      
      // 크기 제한 체크
      if (clipboardItem.size > this.clipboardConfig.maxItemSize) {
        Logger.warn(this.componentName, 'Clipboard item too large, skipping', {
          size: clipboardItem.size,
          maxSize: this.clipboardConfig.maxItemSize,
        });
        return;
      }

      // 중복 감지
      const isDuplicate = this.isDuplicateItem(clipboardItem);
      
      // 히스토리에 추가
      this.addToHistory(clipboardItem);
      
      // 통계 업데이트
      this.updateStats(clipboardItem, isDuplicate);
      
      // 이벤트 발생
      const event: ClipboardEvent = {
        type: isDuplicate ? 'duplicate' : 'copy',
        item: clipboardItem,
        timestamp: new Date(),
        context: this.getClipboardContext(),
      };
      
      this.emit('clipboard-changed', event);
      
      Logger.debug(this.componentName, 'Clipboard changed', {
        type: clipboardItem.type,
        size: clipboardItem.size,
        charCount: clipboardItem.charCount,
        isDuplicate,
      });
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to handle clipboard change', error);
    }
  }

  /**
   * 클립보드 항목 생성
   */
  private async createClipboardItem(content: string): Promise<ClipboardItem> {
    const timestamp = new Date();
    const id = `clip-${timestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 클립보드 형식 감지
    const formats = clipboard.availableFormats();
    let type: ClipboardItem['type'] = 'text';
    let rawContent: string | undefined;
    
    if (formats.includes('image/png') || formats.includes('image/jpeg')) {
      type = 'image';
    } else if (formats.includes('text/rtf')) {
      type = 'rtf';
      rawContent = clipboard.readRTF();
    } else if (formats.includes('text/html')) {
      type = 'html';
      rawContent = clipboard.readHTML();
    }

    // 텍스트 분석
    const charCount = content.length;
    const wordCount = this.countWords(content);
    const lineCount = this.countLines(content);
    const size = Buffer.byteLength(content, 'utf8');

    return {
      id,
      type,
      content,
      rawContent,
      size,
      timestamp,
      source: this.getCurrentAppName(),
      charCount,
      wordCount,
      lineCount,
    };
  }

  /**
   * 중복 항목 감지
   */
  private isDuplicateItem(item: ClipboardItem): boolean {
    if (!this.clipboardConfig.enableDuplicateDetection) {
      return false;
    }

    const contentHash = this.generateContentHash(item.content);
    return this.clipboardHistory.some(historyItem => 
      this.generateContentHash(historyItem.content) === contentHash
    );
  }

  /**
   * 히스토리에 추가
   */
  private addToHistory(item: ClipboardItem): void {
    this.clipboardHistory.unshift(item);
    
    // 최대 크기 제한
    if (this.clipboardHistory.length > this.clipboardConfig.maxHistorySize) {
      this.clipboardHistory = this.clipboardHistory.slice(0, this.clipboardConfig.maxHistorySize);
    }
  }

  /**
   * 통계 업데이트
   */
  private updateStats(item: ClipboardItem, isDuplicate: boolean): void {
    this.currentStats.totalCopies++;
    
    if (!isDuplicate) {
      this.currentStats.uniqueItems++;
    }

    // 가장 많이 복사된 타입 업데이트
    const typeCounts = this.getTypeCounts();
    this.currentStats.mostCopiedType = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'text';

    // 평균 아이템 크기 업데이트
    this.currentStats.averageItemSize = this.clipboardHistory.reduce((sum, item) => 
      sum + item.size, 0) / this.clipboardHistory.length;

    // 중복률 계산
    this.currentStats.duplicateRate = 
      (this.currentStats.totalCopies - this.currentStats.uniqueItems) / 
      this.currentStats.totalCopies * 100;

    // 생산성 점수 계산
    this.currentStats.productivityScore = this.calculateProductivityScore();
  }

  /**
   * 타입별 개수 계산
   */
  private getTypeCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.clipboardHistory.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }

  /**
   * 생산성 점수 계산
   */
  private calculateProductivityScore(): number {
    if (this.clipboardHistory.length === 0) return 0;

    let score = 50; // 기본 점수

    // 중복률이 낮을수록 높은 점수
    score += (100 - this.currentStats.duplicateRate) * 0.3;

    // 다양한 타입 사용 시 보너스
    const typeVariety = Object.keys(this.getTypeCounts()).length;
    score += typeVariety * 5;

    // 적절한 크기의 항목들 사용 시 보너스
    const appropriateSize = this.clipboardHistory.filter(item => 
      item.size > 10 && item.size < 10000).length;
    score += (appropriateSize / this.clipboardHistory.length) * 20;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 콘텐츠 해시 생성
   */
  private generateContentHash(content: string): string {
    // 간단한 해시 함수 (실제로는 crypto 사용 권장)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit 정수로 변환
    }
    return hash.toString();
  }

  /**
   * 단어 수 계산
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * 줄 수 계산
   */
  private countLines(text: string): number {
    return text.split(/\r\n|\r|\n/).length;
  }

  /**
   * 현재 앱 이름 가져오기
   */
  private getCurrentAppName(): string {
    // UnifiedHandler에서 현재 활성 윈도우 정보 가져오기
    if (globalThis.unifiedHandler?.getCurrentWindow) {
      const currentWindow = globalThis.unifiedHandler.getCurrentWindow();
      // 타입 가드를 사용한 안전한 접근
      if (currentWindow && typeof currentWindow === 'object' && 'owner' in currentWindow) {
        const owner = (currentWindow as { owner?: { name?: string } }).owner;
        return owner?.name || 'Unknown';
      }
    }
    return 'Unknown';
  }

  /**
   * 클립보드 컨텍스트 가져오기
   */
  private getClipboardContext(): string {
    const currentApp = this.getCurrentAppName();
    const timeOfDay = new Date().getHours();
    
    let context = `${currentApp}`;
    
    if (timeOfDay >= 9 && timeOfDay <= 17) {
      context += ' (work-hours)';
    } else {
      context += ' (off-hours)';
    }
    
    return context;
  }

  /**
   * 공개 API: 클립보드 히스토리 반환
   */
  public getClipboardHistory(limit?: number): ClipboardItem[] {
    const history = [...this.clipboardHistory];
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * 공개 API: 클립보드 통계 반환
   */
  public getClipboardStats(): ClipboardStats {
    return { ...this.currentStats };
  }

  /**
   * 공개 API: 클립보드 설정 업데이트
   */
  public updateConfig(newConfig: Partial<ClipboardConfig>): void {
    this.clipboardConfig = { ...this.clipboardConfig, ...newConfig };
    
    // 폴링 간격 변경 시 재시작
    if (newConfig.pollInterval && this.isRunning()) {
      this.startClipboardPolling();
    }
    
    Logger.info(this.componentName, 'Clipboard config updated', newConfig);
  }

  /**
   * 공개 API: 히스토리 초기화
   */
  public clearHistory(): void {
    this.clipboardHistory = [];
    this.currentStats = {
      totalCopies: 0,
      totalPastes: 0,
      uniqueItems: 0,
      mostCopiedType: 'text',
      averageItemSize: 0,
      duplicateRate: 0,
      productivityScore: 0,
    };
    
    Logger.info(this.componentName, 'Clipboard history cleared');
    this.emit('history-cleared');
  }

  /**
   * 공개 API: 특정 항목 검색
   */
  public searchHistory(query: string): ClipboardItem[] {
    const lowercaseQuery = query.toLowerCase();
    return this.clipboardHistory.filter(item =>
      item.content.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * 헬스 체크 (BaseManager 오버라이드)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    monitoring: boolean;
    historySize: number;
    totalCopies: number;
    productivityScore: number;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      monitoring: this.isRunning(),
      historySize: this.clipboardHistory.length,
      totalCopies: this.currentStats.totalCopies,
      productivityScore: this.currentStats.productivityScore,
    };
  }
}

// 🔥 기가차드 전역 클립보드 감시자
export const clipboardWatcher = new ClipboardWatcher();

// #DEBUG: Clipboard watcher module exit point
Logger.debug('CLIPBOARD_WATCHER', 'Clipboard watcher module setup complete');

export default clipboardWatcher;
