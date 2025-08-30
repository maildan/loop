// 🔥 기가차드 브라우저 감지자 - 웹사이트별 타이핑 분석 전문가!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { Result, WindowInfo } from '../../shared/types';
import { WindowTracker } from '../keyboard/WindowTracker';

// #DEBUG: Browser detector entry point
Logger.debug('BROWSER_DETECTOR', 'Browser detector module loaded');

// 🔥 기가차드 브라우저 정보 인터페이스
export interface BrowserInfo {
  browserName: string;
  browserVersion?: string;
  currentUrl?: string;
  currentTitle?: string;
  domain?: string;
  isGoogleDocs?: boolean;
  isProductiveSite?: boolean;
  siteCategory: string;
}

// 🔥 기가차드 브라우저 이벤트
export interface BrowserEvent {
  type: 'navigation' | 'tab-change' | 'browser-switch' | 'google-docs-detected';
  browserInfo: BrowserInfo;
  timestamp: Date;
  previousUrl?: string;
}

// 🔥 기가차드 브라우저 설정
export interface BrowserConfig {
  enableUrlTracking: boolean;
  enableGoogleDocsDetection: boolean;
  enableProductivityTracking: boolean;
  checkInterval: number; // milliseconds
  supportedBrowsers: string[];
}

// 🔥 기가차드 사이트 카테고리
export interface SiteCategories {
  productivity: string[];
  entertainment: string[];
  social: string[];
  shopping: string[];
  news: string[];
  development: string[];
  education: string[];
}

/**
 * 🔥 BrowserDetector - 브라우저 및 웹사이트 감지 시스템
 * 활성 브라우저 감지, URL 추적, Google Docs 특별 처리, 생산성 분석
 */
export class BrowserDetector extends BaseManager {
  private readonly componentName = 'BROWSER_DETECTOR';
  private browserConfig: BrowserConfig;
  private currentBrowserInfo: BrowserInfo | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private windowTracker: WindowTracker;
  private hasAccessibilityPermission = false; // 🔥 권한 상태 추적

  // 🔥 지원하는 브라우저 목록 (확장)
private readonly supportedBrowsers = [
    'Google Chrome',
    'Safari',
    'Firefox',
    'Microsoft Edge', 
    'Arc',
    'Brave Browser',
    'Opera',
    'Vivaldi',
    'DuckDuckGo',
    'Tor Browser',
    'Chromium',
    'Opera GX',
    'SigmaOS',
    'Orion',
    'Min',
    'Webkit'
  ];

  // 🔥 사이트 카테고리 매핑
  private readonly siteCategories: SiteCategories = {
    productivity: [
      'docs.google.com',
      'notion.so',
      'obsidian.md',
      'roamresearch.com',
      'airtable.com',
      'sheets.google.com',
      'slides.google.com',
      'trello.com',
      'asana.com',
      'monday.com',
      'slack.com',
      'teams.microsoft.com',
      'zoom.us',
      'figma.com',
      'canva.com'
    ],
    development: [
      'github.com',
      'gitlab.com',
      'stackoverflow.com',
      'developer.mozilla.org',
      'npmjs.com',
      'codepen.io',
      'jsfiddle.net',
      'codesandbox.io',
      'replit.com',
      'vercel.com',
      'netlify.com'
    ],
    entertainment: [
      'youtube.com',
      'netflix.com',
      'spotify.com',
      'twitch.tv',
      'reddit.com',
      'instagram.com',
      'tiktok.com'
    ],
    social: [
      'facebook.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'discord.com',
      'telegram.org'
    ],
    shopping: [
      'amazon.com',
      'ebay.com',
      'shopify.com',
      'etsy.com',
      'aliexpress.com'
    ],
    news: [
      'bbc.com',
      'cnn.com',
      'reuters.com',
      'techcrunch.com',
      'hackernews.com'
    ],
    education: [
      'coursera.org',
      'udemy.com',
      'khan.academy.org',
      'edx.org',
      'udacity.com'
    ]
  };

  constructor(config: Partial<BrowserConfig> = {}, hasAccessibilityPermission = false) {
    super({
      name: 'BrowserDetector',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.hasAccessibilityPermission = hasAccessibilityPermission;

    this.browserConfig = {
      enableUrlTracking: true,
      enableGoogleDocsDetection: true,
      enableProductivityTracking: true,
      checkInterval: 1000, // 1초마다 체크
      supportedBrowsers: this.supportedBrowsers,
      ...config,
    };

    // 🔥 권한 상태를 WindowTracker에 전달
    this.windowTracker = new WindowTracker({});
    
    Logger.info(this.componentName, 'Browser detector instance created', {
      hasAccessibilityPermission: this.hasAccessibilityPermission
    });
  }

  /**
   * 🔥 접근성 권한 상태 설정
   */
  public setAccessibilityPermission(hasPermission: boolean): void {
    const wasChanged = this.hasAccessibilityPermission !== hasPermission;
    this.hasAccessibilityPermission = hasPermission;
    
    if (wasChanged) {
      Logger.info(this.componentName, '🔐 접근성 권한 상태 변경됨', { 
        hasPermission,
        canTrackBrowsers: hasPermission 
      });
      
      // WindowTracker에도 권한 상태 전달
      this.windowTracker.setAccessibilityPermission(hasPermission);
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      await this.windowTracker.initialize();
      this.setupEventListeners();
      
      Logger.info(this.componentName, 'Browser detector initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize browser detector', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 🔥 WindowTracker는 별도 명령으로만 시작 (자동 시작 제거)
      // await this.windowTracker.start(); // 제거됨
      this.startBrowserDetection();
      
      Logger.info(this.componentName, 'Browser detector started successfully (WindowTracker는 별도 시작)');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start browser detector', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      this.stopBrowserDetection();
      // 🔥 WindowTracker는 별도 관리 (자동 중지 제거)
      // await this.windowTracker.stop(); // 제거됨
      
      Logger.info(this.componentName, 'Browser detector stopped successfully (WindowTracker는 별도 관리)');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop browser detector', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      await this.doStop();
      await this.windowTracker.cleanup();
      this.currentBrowserInfo = null;
      
      Logger.info(this.componentName, 'Browser detector cleanup completed');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup browser detector', err);
      throw err;
    }
  }

  /**
   * 윈도우 정보 유효성 검증
   */
  private isValidWindowInfo(windowInfo: unknown): windowInfo is WindowInfo {
    if (!windowInfo || typeof windowInfo !== 'object') {
      return false;
    }
    
    const info = windowInfo as WindowInfo;
    
    // 🔥 기본 필드 검증
    if (!info.owner || typeof info.owner !== 'object') {
      return false;
    }
    
    // 🔥 owner.name 검증 (가장 중요)
    if (!info.owner.name || typeof info.owner.name !== 'string' || info.owner.name.trim() === '') {
      return false;
    }
    
    // 🔥 title은 없어도 되지만 있다면 문자열이어야 함
    if (info.title !== undefined && typeof info.title !== 'string') {
      return false;
    }
    
    return true;
  }

  /**
   * 이벤트 리스너 설정 (WindowTracker 시작 상태 확인 추가)
   */
  private setupEventListeners(): void {
    this.windowTracker.on('window-changed', (windowInfo) => {
      try {
        // 🔥 WindowTracker가 시작되지 않았으면 이벤트 처리 건너뛰기
        if (!this.windowTracker.isRunning()) {
          Logger.debug(this.componentName, '⚠️ WindowTracker가 시작되지 않아 브라우저 감지 건너뛰기');
          return;
        }

        // 🔥 권한이 없으면 브라우저 감지 건너뛰기
        if (!this.hasAccessibilityPermission) {
          Logger.debug(this.componentName, '⚠️ 접근성 권한이 없어 브라우저 감지 건너뛰기');
          return;
        }

        // 🔥 안전한 윈도우 정보 접근 및 검증 강화
        if (!this.isValidWindowInfo(windowInfo)) {
          Logger.debug(this.componentName, '⚠️ 윈도우 정보 유효하지 않음 - 브라우저 감지 건너뛰기', {
            hasWindowInfo: !!windowInfo,
            hasOwner: !!(windowInfo && windowInfo.owner),
            hasOwnerName: !!(windowInfo && windowInfo.owner && windowInfo.owner.name),
            ownerName: windowInfo?.owner?.name || 'undefined'
          });
          return;
        }

        const isBrowser = this.isBrowserWindow(windowInfo.owner.name);
        if (isBrowser) {
          this.handleBrowserWindowChange(windowInfo);
        } else {
          // 🔥 브라우저가 아닌 경우도 로그 남기기 (디버깅용)
          Logger.debug(this.componentName, '📝 비브라우저 앱 감지됨', {
            app: windowInfo.owner.name,
            title: windowInfo.title
          });
        }
      } catch (error) {
        Logger.error(this.componentName, '브라우저 윈도우 이벤트 처리 중 오류', error);
      }
    });
  }

  /**
   * 브라우저 감지 시작
   */
  private startBrowserDetection(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      await this.checkBrowserState();
    }, this.browserConfig.checkInterval);
  }

  /**
   * 브라우저 감지 중지
   */
  private stopBrowserDetection(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * 브라우저 윈도우인지 확인
   */
  private isBrowserWindow(processName: string): boolean {
    return this.supportedBrowsers.some(browser => 
      processName.toLowerCase().includes(browser.toLowerCase())
    );
  }

  /**
   * 브라우저 윈도우 변경 처리 (권한 기반)
   */
  private async handleBrowserWindowChange(windowInfo: { owner?: { name?: string }; title?: string }): Promise<void> {
    try {
      // 🔥 필수 데이터 유효성 검증
      if (!windowInfo || !windowInfo.owner || !windowInfo.owner.name) {
        Logger.debug(this.componentName, '⚠️ 윈도우 정보가 유효하지 않음 - 건너뛰기', { windowInfo });
        return;
      }

      // 🔥 접근성 권한이 없으면 제한된 정보만 처리
      if (!this.hasAccessibilityPermission) {
        Logger.debug(this.componentName, '⚠️ 접근성 권한이 없음 - 제한된 브라우저 감지');
        
        // 기본적인 브라우저 정보만 추출 (안전한 방법)
        const basicBrowserInfo = this.extractBasicBrowserInfo(windowInfo);
        if (basicBrowserInfo && this.hasBrowserInfoChanged(basicBrowserInfo)) {
          this.currentBrowserInfo = basicBrowserInfo;
          this.emitBrowserEvent('browser-switch', basicBrowserInfo);
        }
        return;
      }

      // 🔥 권한이 있으면 상세한 정보 추출
      const browserInfo = await this.extractBrowserInfo({
        processName: windowInfo.owner.name,
        title: windowInfo.title || ''
      });
      
      if (browserInfo && this.hasBrowserInfoChanged(browserInfo)) {
        this.currentBrowserInfo = browserInfo;
        this.emitBrowserEvent('browser-switch', browserInfo);
      }
    } catch (error) {
      Logger.warn(this.componentName, '⚠️ 브라우저 윈도우 변경 처리 중 오류 (안전하게 무시)', error);
      // 🔥 에러를 무시하고 안전하게 계속 진행
    }
  }

  /**
   * 🔥 기본적인 브라우저 정보 추출 (권한 없이도 안전)
   */
  private extractBasicBrowserInfo(windowInfo: { owner?: { name?: string }; title?: string }): BrowserInfo | null {
    try {
      const processName = windowInfo.owner?.name;
      const title = windowInfo.title;
      
      if (!processName || !this.isBrowserWindow(processName)) {
        return null;
      }

      return {
        browserName: processName,
        currentTitle: title || '',
        siteCategory: 'unknown',
        isProductiveSite: false,
        isGoogleDocs: false
      };
    } catch (error) {
      Logger.debug(this.componentName, '기본 브라우저 정보 추출 실패 (안전하게 무시)', error);
      return null;
    }
  }

  /**
   * 브라우저 상태 체크 (권한 기반)
   */
  private async checkBrowserState(): Promise<void> {
    try {
      // 🔥 접근성 권한이 없으면 체크 건너뛰기
      if (!this.hasAccessibilityPermission) {
        Logger.debug(this.componentName, '⚠️ 접근성 권한이 없음 - 브라우저 상태 체크 건너뛰기');
        return;
      }

      const currentWindow = this.windowTracker.getCurrentWindow();
      
      if (!currentWindow || !this.isBrowserWindow(currentWindow.owner?.name || '')) {
        return;
      }

      // 🔥 안전한 브라우저 정보 추출
      const browserInfo = await this.extractBrowserInfo({
        processName: currentWindow.owner?.name || '',
        title: currentWindow.title || ''
      });
      
      if (browserInfo && this.hasBrowserInfoChanged(browserInfo)) {
        const eventType = this.determineBrowserEventType(browserInfo);
        this.currentBrowserInfo = browserInfo;
        this.emitBrowserEvent(eventType, browserInfo);
      }
    } catch (error) {
      Logger.debug(this.componentName, '⚠️ 브라우저 상태 체크 중 오류 (안전하게 무시)', error);
      // 🔥 에러를 무시하고 안전하게 계속 진행
    }
  }

  /**
   * 브라우저 정보 추출 (권한 기반)
   */
  private async extractBrowserInfo(windowInfo: { processName: string; title: string }): Promise<BrowserInfo | null> {
    try {
      // 🔥 기본 유효성 검증
      if (!windowInfo.processName || !this.isBrowserWindow(windowInfo.processName)) {
        return null;
      }

      const browserName = this.normalizeBrowserName(windowInfo.processName);
      const { url, title } = this.parseWindowTitle(windowInfo.title || '', browserName);
      const domain = this.extractDomain(url);
      const siteCategory = this.categorizeSite(domain);
      
      return {
        browserName,
        currentUrl: url,
        currentTitle: title,
        domain,
        isGoogleDocs: this.isGoogleDocsUrl(url),
        isProductiveSite: this.isProductiveSite(domain),
        siteCategory,
      };
    } catch (error) {
      Logger.debug(this.componentName, '⚠️ 브라우저 정보 추출 중 오류 (안전하게 무시)', error);
      return null;
    }
  }

  /**
   * 브라우저 이름 정규화
   */
  private normalizeBrowserName(processName: string): string {
    const normalized = processName.toLowerCase();
    
    if (normalized.includes('chrome')) return 'Google Chrome';
    if (normalized.includes('safari')) return 'Safari';
    if (normalized.includes('firefox')) return 'Firefox';
    if (normalized.includes('edge')) return 'Microsoft Edge';
    if (normalized.includes('arc')) return 'Arc';
    if (normalized.includes('brave')) return 'Brave Browser';
    if (normalized.includes('opera')) return 'Opera';
    if (normalized.includes('vivaldi')) return 'Vivaldi';
    
    return processName;
  }

  /**
   * 윈도우 제목에서 URL과 제목 파싱
   */
  private parseWindowTitle(windowTitle: string, browserName: string): { url?: string; title?: string } {
    // Google Docs 특별 처리
    if (this.isGoogleDocsTitle(windowTitle)) {
      return {
        url: 'https://docs.google.com/',
        title: this.extractGoogleDocsTitle(windowTitle)
      };
    }

    // 일반적인 브라우저 제목 파싱
    if (browserName === 'Safari' && windowTitle.includes(' — ')) {
      const parts = windowTitle.split(' — ');
      return {
        title: parts[0],
        url: parts[1]
      };
    }

    // Chrome, Firefox 등
    if (windowTitle.includes(' - ')) {
      const lastDashIndex = windowTitle.lastIndexOf(' - ');
      return {
        title: windowTitle.substring(0, lastDashIndex),
        url: undefined // URL 추출이 어려운 경우
      };
    }

    return {
      title: windowTitle,
      url: undefined
    };
  }

  /**
   * 도메인 추출
   */
  private extractDomain(url?: string): string {
    if (!url) return 'unknown';
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown';
    }
  }

  /**
   * 사이트 카테고리 분류
   */
  private categorizeSite(domain: string): string {
    for (const [category, domains] of Object.entries(this.siteCategories)) {
      if (domains.some((siteDomain: string) => domain.includes(siteDomain))) {
        return category;
      }
    }
    return 'other';
  }

  /**
   * Google Docs URL 확인
   */
  private isGoogleDocsUrl(url?: string): boolean {
    if (!url) return false;
    return url.includes('docs.google.com') || url.includes('sheets.google.com') || url.includes('slides.google.com');
  }

  /**
   * Google Docs 제목 확인
   */
  private isGoogleDocsTitle(title: string): boolean {
    return title.includes('Google Docs') || 
           title.includes('Google Sheets') || 
           title.includes('Google Slides') ||
           title.includes('구글 문서') ||
           title.includes('구글 스프레드시트') ||
           title.includes('구글 프레젠테이션');
  }

  /**
   * Google Docs 제목 추출
   */
  private extractGoogleDocsTitle(windowTitle: string): string {
    // "Document Name - Google Docs" 형태에서 문서명 추출
    const patterns = [
      / - Google Docs$/,
      / - Google Sheets$/,
      / - Google Slides$/,
      / - 구글 문서$/,
      / - 구글 스프레드시트$/,
      / - 구글 프레젠테이션$/
    ];

    for (const pattern of patterns) {
      if (pattern.test(windowTitle)) {
        return windowTitle.replace(pattern, '');
      }
    }

    return windowTitle;
  }

  /**
   * 생산성 사이트 확인
   */
  private isProductiveSite(domain: string): boolean {
    return this.siteCategories.productivity.some(site => domain.includes(site)) ||
           this.siteCategories.development.some(site => domain.includes(site)) ||
           this.siteCategories.education.some(site => domain.includes(site));
  }

  /**
   * 브라우저 정보 변경 확인
   */
  private hasBrowserInfoChanged(newInfo: BrowserInfo): boolean {
    if (!this.currentBrowserInfo) return true;
    
    return (
      this.currentBrowserInfo.browserName !== newInfo.browserName ||
      this.currentBrowserInfo.currentUrl !== newInfo.currentUrl ||
      this.currentBrowserInfo.currentTitle !== newInfo.currentTitle
    );
  }

  /**
   * 브라우저 이벤트 타입 결정
   */
  private determineBrowserEventType(browserInfo: BrowserInfo): BrowserEvent['type'] {
    if (!this.currentBrowserInfo) {
      return 'browser-switch';
    }

    if (this.currentBrowserInfo.browserName !== browserInfo.browserName) {
      return 'browser-switch';
    }

    if (browserInfo.isGoogleDocs && !this.currentBrowserInfo.isGoogleDocs) {
      return 'google-docs-detected';
    }

    if (this.currentBrowserInfo.currentUrl !== browserInfo.currentUrl) {
      return 'navigation';
    }

    return 'tab-change';
  }

  /**
   * 브라우저 이벤트 발생
   */
  private emitBrowserEvent(type: BrowserEvent['type'], browserInfo: BrowserInfo): void {
    const event: BrowserEvent = {
      type,
      browserInfo,
      timestamp: new Date(),
      previousUrl: this.currentBrowserInfo?.currentUrl,
    };

    this.emit('browser-event', event);
    this.emit(type, event);

    Logger.debug(this.componentName, `Browser event: ${type}`, {
      browser: browserInfo.browserName,
      domain: browserInfo.domain,
      category: browserInfo.siteCategory,
    });
  }

  /**
   * 공개 API: 현재 브라우저 정보 반환
   */
  public getCurrentBrowserInfo(): BrowserInfo | null {
    return this.currentBrowserInfo ? { ...this.currentBrowserInfo } : null;
  }

  /**
   * 공개 API: 브라우저 설정 업데이트
   */
  public updateConfig(newConfig: Partial<BrowserConfig>): Result<void> {
    try {
      this.browserConfig = { ...this.browserConfig, ...newConfig };
      
      // 체크 인터벌 업데이트
      if (newConfig.checkInterval && this.isRunning()) {
        this.stopBrowserDetection();
        this.startBrowserDetection();
      }

      Logger.info(this.componentName, 'Browser detector config updated', newConfig);
      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to update config', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 공개 API: 지원하는 브라우저 목록 반환
   */
  public getSupportedBrowsers(): string[] {
    return [...this.supportedBrowsers];
  }

  /**
   * 공개 API: 사이트 카테고리 목록 반환
   */
  public getSiteCategories(): SiteCategories {
    return { ...this.siteCategories };
  }

  /**
   * 공개 API: 현재 사이트 생산성 점수 계산
   */
  public calculateProductivityScore(): number {
    if (!this.currentBrowserInfo) return 0;

    const { siteCategory, isGoogleDocs, isProductiveSite } = this.currentBrowserInfo;

    let score = 0;

    // Google Docs는 최고 점수
    if (isGoogleDocs) score += 100;
    
    // 생산성 사이트
    else if (isProductiveSite) score += 85;
    
    // 카테고리별 점수
    else {
      switch (siteCategory) {
        case 'development': score += 90; break;
        case 'education': score += 80; break;
        case 'productivity': score += 85; break;
        case 'news': score += 60; break;
        case 'social': score += 30; break;
        case 'entertainment': score += 20; break;
        case 'shopping': score += 25; break;
        default: score += 50; break;
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 🔥 브라우저 모니터링 명시적 시작 (WindowTracker 포함)
   */
  public async startBrowserMonitoring(): Promise<Result<void>> {
    try {
      if (!this.hasAccessibilityPermission) {
        return {
          success: false,
          error: '접근성 권한이 필요합니다.'
        };
      }

      // WindowTracker 시작
      if (!this.windowTracker.isRunning()) {
        await this.windowTracker.start();
        Logger.info(this.componentName, '✅ WindowTracker started for browser monitoring');
      }

      // BrowserDetector 시작
      if (!this.isRunning()) {
        await this.start();
        Logger.info(this.componentName, '✅ BrowserDetector started successfully');
      }

      Logger.info(this.componentName, '🌐 브라우저 모니터링 시작됨', {
        hasPermission: this.hasAccessibilityPermission,
        windowTrackerRunning: this.windowTracker.isRunning(),
        browserDetectorRunning: this.isRunning()
      });

      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, '❌ 브라우저 모니터링 시작 실패', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 🔥 브라우저 모니터링 명시적 중지
   */
  public async stopBrowserMonitoring(): Promise<Result<void>> {
    try {
      // BrowserDetector 중지
      if (this.isRunning()) {
        await this.stop();
        Logger.info(this.componentName, '✅ BrowserDetector stopped');
      }

      // WindowTracker 중지
      if (this.windowTracker.isRunning()) {
        await this.windowTracker.stop();
        Logger.info(this.componentName, '✅ WindowTracker stopped for browser monitoring');
      }

      Logger.info(this.componentName, '🌐 브라우저 모니터링 중지됨');
      return { success: true };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, '❌ 브라우저 모니터링 중지 실패', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 🔥 브라우저 모니터링 상태 확인
   */
  public isBrowserMonitoringActive(): boolean {
    return this.isRunning() && this.windowTracker.isRunning();
  }
}

// 🔥 기가차드 전역 브라우저 감지자
export const browserDetector = new BrowserDetector();

// #DEBUG: Browser detector module exit point
Logger.debug('BROWSER_DETECTOR', 'Browser detector module setup complete');

export default browserDetector;
