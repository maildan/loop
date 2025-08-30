// 🔥 기가차드 macOS 윈도우 감지 전략 - active-win 기반

import { BaseWindowDetectionStrategy } from './WindowDetectionStrategy';
import { Result, WindowInfo, AppCategory } from '../../../shared/types';
import { Logger } from '../../../shared/logger';
import { Platform } from '../../utils/platform';
import { 
  getAppCategory, 
  APP_CATEGORIES, 
  APP_CATEGORY_MAPPING,
  getCategoryStats,
  getAppsByCategory 
} from '../appCategories';
import getActiveWindow from 'active-win';

/**
 * 🔥 macOS 윈도우 감지 전략
 * active-win 라이브러리를 활용한 macOS 최적화된 윈도우 감지
 */
export class MacDetectionStrategy extends BaseWindowDetectionStrategy {
  public readonly strategyName = 'MacDetectionStrategy';
  public readonly supportedPlatforms: NodeJS.Platform[] = ['darwin'];

  constructor() {
    super('MAC_DETECTION_STRATEGY');
  }

  /**
   * 🔥 전략 초기화 - macOS 플랫폼 체크
   */
  async initialize(): Promise<Result<boolean>> {
    try {
      if (!Platform.isMacOS()) {
        return this.handleError(new Error('macOS가 아닙니다'), 'Platform check');
      }

      this.isInitialized = true;
      Logger.info(this.componentName, 'macOS 윈도우 감지 전략 초기화 완료');

      return { success: true, data: true };
    } catch (error) {
      return this.handleError(error, 'Initialize');
    }
  }

  /**
   * 🔥 현재 활성 윈도우 가져오기
   */
  async getCurrentActiveWindow(): Promise<Result<WindowInfo>> {
    const initCheck = this.ensureInitialized();
    if (!initCheck.success) {
      return { success: false, error: initCheck.error };
    }

    try {
      // active-win 8.x 호환: 옵션 객체로 권한 우회
      const activeWinResult = await getActiveWindow({
        accessibilityPermission: false,   // macOS 접근성 권한 우회
        screenRecordingPermission: false  // macOS 화면 녹화 권한 우회
      });

      if (!activeWinResult) {
        return { success: false, error: 'No active window found' };
      }

      // active-win 결과를 WindowInfo로 변환
      const windowInfo: Partial<WindowInfo> = {
        id: activeWinResult.id || Date.now(),
        title: activeWinResult.title || 'Unknown Window',
        owner: {
          name: activeWinResult.owner?.name || 'Unknown App',
          processId: activeWinResult.owner?.processId || 0,
          bundleId: readOptionalString(activeWinResult.owner, 'bundleId'),
          path: readOptionalString(activeWinResult.owner, 'path'),
        },
        bounds: activeWinResult.bounds || { x: 0, y: 0, width: 0, height: 0 },
        memoryUsage: typeof (activeWinResult as unknown as { memoryUsage?: number }).memoryUsage === 'number'
          ? (activeWinResult as unknown as { memoryUsage?: number }).memoryUsage as number
          : 0,
      };

      // 윈도우 정보 검증
      const validationResult = this.validateWindowInfo(windowInfo);
      if (!validationResult.success) {
        return { success: false, error: validationResult.error };
      }

      // Loop 전용 필드 추가
      const enhancedWindow = this.enhanceWithLoopFields(validationResult.data!);

      Logger.debug(this.componentName, 'macOS 활성 윈도우 조회 성공', {
        title: enhancedWindow.title,
        app: enhancedWindow.owner.name,
        category: enhancedWindow.loopAppCategory
      });

      return { success: true, data: enhancedWindow };
    } catch (error) {
      return this.handleError(error, 'Get current active window');
    }
  }

  /**
   * 🔥 모든 열린 윈도우 가져오기
   */
  async getAllOpenWindows(): Promise<Result<WindowInfo[]>> {
    const initCheck = this.ensureInitialized();
    if (!initCheck.success) {
      return { success: false, error: initCheck.error };
    }

    try {
      // active-win은 모든 윈도우 조회를 지원하지 않음
      // 현재 활성 윈도우만 배열로 반환
      const currentWindowResult = await this.getCurrentActiveWindow();
      
      if (!currentWindowResult.success || !currentWindowResult.data) {
        return { success: true, data: [] };
      }

      Logger.debug(this.componentName, 'macOS 모든 윈도우 조회 (활성 윈도우만)', {
        count: 1
      });

      return { success: true, data: [currentWindowResult.data] };
    } catch (error) {
      return this.handleError(error, 'Get all open windows');
    }
  }

  /**
   * 🔥 윈도우 변경 감지 지원 여부
   */
  supportsWindowChangeDetection(): boolean {
    return false; // active-win은 폴링 방식 사용
  }

  /**
   * 🔥 권한 확인
   */
  async checkPermissions(): Promise<Result<boolean>> {
    try {
      // macOS에서 active-win 테스트 호출
      const testResult = await getActiveWindow({
        accessibilityPermission: false,
        screenRecordingPermission: false
      });

      const hasPermission = testResult !== undefined;
      
      Logger.debug(this.componentName, 'macOS 권한 확인 완료', { hasPermission });

      return { success: true, data: hasPermission };
    } catch (error) {
      Logger.warn(this.componentName, 'macOS 권한 확인 실패', error);
      return { success: true, data: false }; // 권한이 없어도 fallback 사용 가능
    }
  }

  /**
   * 🔥 리소스 정리
   */
  async cleanup(): Promise<void> {
    this.isInitialized = false;
    Logger.info(this.componentName, 'macOS 윈도우 감지 전략 정리 완료');
  }

  /**
   * 🔥 Loop 전용 필드로 윈도우 정보 향상 (개선된 카테고리 분류)
   */
  private enhanceWithLoopFields(windowInfo: WindowInfo): WindowInfo {
    const appName = windowInfo.owner.name;
    const bundleId = windowInfo.owner.bundleId;
    
    // 🔥 1차: 앱 이름으로 카테고리 분류
    let appCategory = getAppCategory(appName);
    
    // 🔥 2차: Bundle ID로 추가 분류 (macOS 특화)
    if (appCategory === APP_CATEGORIES.UNKNOWN && bundleId) {
      appCategory = this.getCategoryByBundleId(bundleId);
    }
    
    // 🔥 3차: 창 제목으로 추가 분류
    if (appCategory === APP_CATEGORIES.UNKNOWN) {
      appCategory = this.getCategoryByWindowTitle(windowInfo.title, appName);
    }
    
    // 🔥 카테고리 분류 로깅
    Logger.debug(this.componentName, '🏷️ 앱 카테고리 분류 완료', {
      appName,
      bundleId,
      windowTitle: windowInfo.title,
      category: appCategory,
      method: this.getCategorizationMethod(appName, bundleId, appCategory)
    });
    
    return {
      ...windowInfo,
      loopTimestamp: Date.now(),
      loopAppCategory: appCategory,
      loopSessionId: `${appName}-${Date.now()}`,
      loopLanguageDetected: 'unknown',
      loopIMEState: 'unknown',
      loopPlatformInfo: {
        platform: 'darwin',
        version: process.platform,
        architecture: process.arch,
      },
      loopPermissions: {
        accessibility: true, // active-win 사용 시 가정
        screenRecording: false,
        inputMonitoring: false,
      },
      loopSessionMetadata: {
        startTime: Date.now(),
        totalKeystrokes: 0,
        activeTime: 0,
        idleTime: 0,
      },
    };
  }

  /**
   * 🔥 Bundle ID로 카테고리 분류 (macOS 특화)
   */
  private getCategoryByBundleId(bundleId: string): AppCategory {
    // macOS Bundle ID 기반 카테고리 매핑
    const bundleIdMapping: Record<string, AppCategory> = {
      // 브라우저
      'com.google.Chrome': APP_CATEGORIES.BROWSER,
      'org.mozilla.firefox': APP_CATEGORIES.BROWSER,
      'com.apple.Safari': APP_CATEGORIES.BROWSER,
      'com.microsoft.edgemac': APP_CATEGORIES.BROWSER,
      'com.operasoftware.Opera': APP_CATEGORIES.BROWSER,
      'com.brave.Browser': APP_CATEGORIES.BROWSER,
      'company.thebrowser.Browser': APP_CATEGORIES.BROWSER, // Arc
      
      // 개발 도구
      'com.microsoft.VSCode': APP_CATEGORIES.DEVELOPMENT,
      'com.apple.dt.Xcode': APP_CATEGORIES.DEVELOPMENT,
      'com.jetbrains.intellij': APP_CATEGORIES.DEVELOPMENT,
      'com.github.atom': APP_CATEGORIES.DEVELOPMENT,
      'com.sublimetext.4': APP_CATEGORIES.DEVELOPMENT,
      
      // 텍스트 에디터
      'com.coteditor.CotEditor': APP_CATEGORIES.TEXT_EDITOR,
      'com.barebones.bbedit': APP_CATEGORIES.TEXT_EDITOR,
      'com.macromates.textmate': APP_CATEGORIES.TEXT_EDITOR,
      
      // Office 제품군
      'com.microsoft.Word': APP_CATEGORIES.OFFICE,
      'com.microsoft.Excel': APP_CATEGORIES.OFFICE,
      'com.microsoft.Powerpoint': APP_CATEGORIES.OFFICE,
      'com.apple.iWork.Pages': APP_CATEGORIES.OFFICE,
      'com.apple.iWork.Numbers': APP_CATEGORIES.OFFICE,
      'com.apple.iWork.Keynote': APP_CATEGORIES.OFFICE,
      
      // 커뮤니케이션
      'com.tinyspeck.slackmacgap': APP_CATEGORIES.COMMUNICATION,
      'com.hnc.Discord': APP_CATEGORIES.COMMUNICATION,
      'com.microsoft.teams': APP_CATEGORIES.COMMUNICATION,
      'com.apple.MobileSMS': APP_CATEGORIES.COMMUNICATION,
      
      // 노트/메모
      'com.apple.Notes': APP_CATEGORIES.NOTE_TAKING,
      'com.evernote.Evernote': APP_CATEGORIES.NOTE_TAKING,
      'md.obsidian': APP_CATEGORIES.NOTE_TAKING,
      'com.notion.osx': APP_CATEGORIES.NOTE_TAKING,
      
      // AI 도구
      'com.openai.chat': APP_CATEGORIES.AI_ASSISTANT,
      'com.anthropic.claude': APP_CATEGORIES.AI_ASSISTANT,
      
      // 시스템
      'com.apple.finder': APP_CATEGORIES.SYSTEM,
      'com.apple.ActivityMonitor': APP_CATEGORIES.SYSTEM,
      'com.apple.systempreferences': APP_CATEGORIES.SYSTEM,
    };
    
    return bundleIdMapping[bundleId] || APP_CATEGORIES.UNKNOWN;
  }

  /**
   * 🔥 창 제목으로 카테고리 추가 분류
   */
  private getCategoryByWindowTitle(title: string, appName: string): AppCategory {
    const lowerTitle = title.toLowerCase();
    
    // 창 제목 키워드 기반 분류
    if (lowerTitle.includes('github') || lowerTitle.includes('gitlab') || lowerTitle.includes('code')) {
      return APP_CATEGORIES.DEVELOPMENT;
    }
    
    if (lowerTitle.includes('docs') || lowerTitle.includes('document') || lowerTitle.includes('write')) {
      return APP_CATEGORIES.OFFICE;
    }
    
    if (lowerTitle.includes('chat') || lowerTitle.includes('message') || lowerTitle.includes('slack')) {
      return APP_CATEGORIES.COMMUNICATION;
    }
    
    if (lowerTitle.includes('note') || lowerTitle.includes('memo') || lowerTitle.includes('journal')) {
      return APP_CATEGORIES.NOTE_TAKING;
    }
    
    if (lowerTitle.includes('ai') || lowerTitle.includes('gpt') || lowerTitle.includes('claude')) {
      return APP_CATEGORIES.AI_ASSISTANT;
    }
    
    return APP_CATEGORIES.UNKNOWN;
  }

  /**
   * 🔥 카테고리 분류 방법 반환
   */
  private getCategorizationMethod(appName: string, bundleId: string | undefined, category: AppCategory): string {
    if (APP_CATEGORY_MAPPING[appName]) {
      return 'app-name-exact';
    }
    
    if (bundleId && this.getCategoryByBundleId(bundleId) !== APP_CATEGORIES.UNKNOWN) {
      return 'bundle-id';
    }
    
    if (category !== APP_CATEGORIES.UNKNOWN) {
      return 'title-keyword';
    }
    
    return 'fallback-unknown';
  }

  /**
   * 🔥 카테고리 분류 신뢰도 계산
   */
  private calculateCategoryConfidence(appName: string, bundleId: string | undefined, category: AppCategory): number {
    if (category === APP_CATEGORIES.UNKNOWN) {
      return 0.1; // 매우 낮은 신뢰도
    }
    
    if (APP_CATEGORY_MAPPING[appName]) {
      return 0.95; // 매우 높은 신뢰도 (정확한 매칭)
    }
    
    if (bundleId && this.getCategoryByBundleId(bundleId) !== APP_CATEGORIES.UNKNOWN) {
      return 0.85; // 높은 신뢰도 (Bundle ID 매칭)
    }
    
    return 0.7; // 중간 신뢰도 (키워드 기반)
  }

}

// 🔒 안전한 optional 속성 읽기 유틸
function readOptionalString(obj: unknown, key: string): string | undefined {
  if (obj && typeof obj === 'object' && key in (obj as Record<string, unknown>)) {
    const val = (obj as Record<string, unknown>)[key];
    return typeof val === 'string' ? val : undefined;
  }
  return undefined;
}
