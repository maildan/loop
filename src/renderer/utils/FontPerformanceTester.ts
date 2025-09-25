// 🔥 Font Performance Testing Suite - Phase 5 validation
'use client';

import { Logger } from '../../shared/logger';

interface FontPerformanceMetrics {
  fontChangeTime: number;
  domUpdateTime: number;
  renderTime: number;
  memoryUsage: number;
  domNodeCount: number;
  cssRuleCount: number;
  timestamp: number;
}

interface FontTestResults {
  testName: string;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  successRate: number;
  metrics: FontPerformanceMetrics[];
}

/**
 * 🔥 폰트 시스템 성능 테스트 클래스
 */
export class FontPerformanceTester {
  private static readonly PERFORMANCE_STORAGE_KEY = 'loop-font-performance-tests';
  
  /**
   * 🔥 DOM 조작 제거 전후 성능 비교 테스트
   */
  static async measureFontChangePerformance(
    fontFamily: string,
    iterations: number = 10
  ): Promise<FontTestResults> {
    const testName = `Font Change Performance Test - ${fontFamily}`;
    const metrics: FontPerformanceMetrics[] = [];
    let successCount = 0;

    Logger.info('FONT_PERFORMANCE', `시작: ${testName}`, { iterations });

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        
        // DOM 상태 기록 (before)
        const beforeNodeCount = document.querySelectorAll('*').length;
        const beforeCssRules = this.getCSSRuleCount();
        const beforeMemory = this.getMemoryUsage();

        // 폰트 변경 시뮬레이션 (CSS 변수 방식)
        const fontChangeStart = performance.now();
        document.documentElement.style.setProperty('--app-font-family', fontFamily);
        document.body.style.fontFamily = `${fontFamily}, system-ui, sans-serif`;
        const fontChangeEnd = performance.now();

        // DOM reflow 강제 발생 (측정을 위해)
        const domUpdateStart = performance.now();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = document.body.offsetHeight; // Force reflow
        const domUpdateEnd = performance.now();

        // 렌더링 완료 대기
        await new Promise(resolve => requestAnimationFrame(resolve));
        const renderEnd = performance.now();

        // DOM 상태 기록 (after)
        const afterNodeCount = document.querySelectorAll('*').length;
        const afterCssRules = this.getCSSRuleCount();
        const afterMemory = this.getMemoryUsage();

        const metric: FontPerformanceMetrics = {
          fontChangeTime: fontChangeEnd - fontChangeStart,
          domUpdateTime: domUpdateEnd - domUpdateStart,
          renderTime: renderEnd - startTime,
          memoryUsage: afterMemory - beforeMemory,
          domNodeCount: afterNodeCount - beforeNodeCount,
          cssRuleCount: afterCssRules - beforeCssRules,
          timestamp: Date.now()
        };

        metrics.push(metric);
        successCount++;

        // 작은 지연으로 브라우저가 안정화되도록 함
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        Logger.warn('FONT_PERFORMANCE', `테스트 실패 (iteration ${i + 1})`, error);
      }
    }

    const times = metrics.map(m => m.renderTime);
    const results: FontTestResults = {
      testName,
      iterations,
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      successRate: (successCount / iterations) * 100,
      metrics
    };

    Logger.info('FONT_PERFORMANCE', `완료: ${testName}`, results);
    await this.saveTestResults(results);

    return results;
  }

  /**
   * 🔥 메모리 사용량 측정 (가능한 경우)
   */
  private static getMemoryUsage(): number {
    try {
      // @ts-ignore - Performance Memory API
      if (performance.memory) {
        // @ts-ignore
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  /**
   * 🔥 CSS 규칙 개수 측정
   */
  private static getCSSRuleCount(): number {
    try {
      let ruleCount = 0;
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const styleSheet = document.styleSheets[i];
          if (styleSheet && styleSheet.cssRules) {
            ruleCount += styleSheet.cssRules.length;
          }
        } catch {
          // Cross-origin stylesheets may not be accessible
          continue;
        }
      }
      return ruleCount;
    } catch {
      return 0;
    }
  }

  /**
   * 🔥 TipTap 에디터 통합 테스트
   */
  static async testTipTapIntegration(): Promise<{
    success: boolean;
    issues: string[];
    fontInheritance: boolean;
    editorFunctional: boolean;
  }> {
    const issues: string[] = [];
    let fontInheritance = false;
    let editorFunctional = false;

    try {
      // TipTap 에디터 요소 찾기
      const tipTapElements = document.querySelectorAll('.ProseMirror, .tiptap, [data-tiptap]');
      
      if (tipTapElements.length === 0) {
        issues.push('TipTap 에디터 요소를 찾을 수 없습니다');
      } else {
        // 폰트 상속 확인
        const editorElement = tipTapElements[0] as HTMLElement;
        const computedStyle = window.getComputedStyle(editorElement);
        const rootFontFamily = window.getComputedStyle(document.documentElement).getPropertyValue('--app-font-family');
        
        if (rootFontFamily && computedStyle.fontFamily.includes(rootFontFamily.replace(/['"]/g, ''))) {
          fontInheritance = true;
        } else {
          issues.push('TipTap 에디터가 글로벌 폰트를 상속받지 못했습니다');
        }

        // 에디터 기능 확인 (기본적인 편집 가능 여부)
        if (editorElement.contentEditable === 'true' || editorElement.isContentEditable) {
          editorFunctional = true;
        } else {
          issues.push('TipTap 에디터가 편집 가능하지 않습니다');
        }
      }

      Logger.info('FONT_PERFORMANCE', 'TipTap 통합 테스트 완료', {
        fontInheritance,
        editorFunctional,
        issues
      });

      return {
        success: issues.length === 0,
        issues,
        fontInheritance,
        editorFunctional
      };

    } catch (error) {
      issues.push(`TipTap 테스트 오류: ${error}`);
      return {
        success: false,
        issues,
        fontInheritance: false,
        editorFunctional: false
      };
    }
  }

  /**
   * 🔥 접근성 기능 테스트
   */
  static async testAccessibilityFeatures(): Promise<{
    liveRegionExists: boolean;
    rollbackAvailable: boolean;
    screenReaderSupport: boolean;
    keyboardNavigation: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // Live Region 존재 확인
      const liveRegion = document.getElementById('font-accessibility-announcements');
      const liveRegionExists = !!liveRegion && liveRegion.getAttribute('aria-live') === 'polite';
      
      if (!liveRegionExists) {
        issues.push('접근성 Live Region이 없거나 잘못 설정되었습니다');
      }

      // 롤백 기능 확인
      let rollbackAvailable = false;
      try {
        if (window.electronAPI?.settings?.get) {
          const result = await window.electronAPI.settings.get('loop-font-rollback-history');
          rollbackAvailable = result.success && !!result.data;
        }
      } catch {
        issues.push('롤백 기능을 확인할 수 없습니다');
      }

      // 화면 읽기 도구 지원 확인
      const screenReaderSupport = !!(window as any).speechSynthesis || 
                                  navigator.userAgent.includes('NVDA') || 
                                  navigator.userAgent.includes('JAWS');

      // 키보드 네비게이션 확인 (기본적인 포커스 가능 요소들)
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const keyboardNavigation = focusableElements.length > 0;

      if (!keyboardNavigation) {
        issues.push('키보드로 접근 가능한 요소가 없습니다');
      }

      return {
        liveRegionExists,
        rollbackAvailable,
        screenReaderSupport,
        keyboardNavigation,
        issues
      };

    } catch (error) {
      issues.push(`접근성 테스트 오류: ${error}`);
      return {
        liveRegionExists: false,
        rollbackAvailable: false,
        screenReaderSupport: false,
        keyboardNavigation: false,
        issues
      };
    }
  }

  /**
   * 🔥 종합 유효성 검사
   */
  static async runComprehensiveTest(): Promise<{
    performance: FontTestResults;
    tipTap: any;
    accessibility: any;
    overall: {
      passed: boolean;
      score: number;
      recommendations: string[];
    };
  }> {
    Logger.info('FONT_PERFORMANCE', '🔥 종합 폰트 시스템 테스트 시작');

    const performance = await this.measureFontChangePerformance('Arial', 5);
    const tipTap = await this.testTipTapIntegration();
    const accessibility = await this.testAccessibilityFeatures();

    // 종합 점수 계산
    let score = 0;
    const recommendations: string[] = [];

    // 성능 점수 (40%)
    if (performance.averageTime < 10) score += 40;
    else if (performance.averageTime < 50) score += 30;
    else if (performance.averageTime < 100) score += 20;
    else recommendations.push('폰트 변경 성능이 느립니다. CSS 변수 시스템 최적화가 필요합니다.');

    // TipTap 통합 점수 (30%)
    if (tipTap.success) score += 30;
    else {
      score += tipTap.fontInheritance ? 20 : 0;
      recommendations.push('TipTap 에디터 통합을 개선해야 합니다.');
    }

    // 접근성 점수 (30%)
    const accessibilityScore = [
      accessibility.liveRegionExists,
      accessibility.rollbackAvailable,
      accessibility.keyboardNavigation
    ].filter(Boolean).length * 10;
    score += accessibilityScore;

    if (accessibilityScore < 20) {
      recommendations.push('접근성 기능을 더 강화해야 합니다.');
    }

    const passed = score >= 70;

    Logger.info('FONT_PERFORMANCE', '🔥 종합 테스트 완료', {
      score,
      passed,
      recommendations
    });

    return {
      performance,
      tipTap,
      accessibility,
      overall: {
        passed,
        score,
        recommendations
      }
    };
  }

  /**
   * 🔥 테스트 결과 저장
   */
  private static async saveTestResults(results: FontTestResults): Promise<void> {
    try {
      if (window.electronAPI?.settings?.set) {
        const timestamp = new Date().toISOString();
        await window.electronAPI.settings.set(
          `${this.PERFORMANCE_STORAGE_KEY}-${timestamp}`, 
          results
        );
      }
    } catch (error) {
      Logger.warn('FONT_PERFORMANCE', 'Failed to save test results', error);
    }
  }

  /**
   * 🔥 성능 개선 권장사항 생성
   */
  static generatePerformanceRecommendations(results: FontTestResults): string[] {
    const recommendations: string[] = [];

    if (results.averageTime > 50) {
      recommendations.push('폰트 변경 시간이 50ms를 초과합니다. CSS 변수 최적화를 고려하세요.');
    }

    if (results.successRate < 90) {
      recommendations.push('폰트 변경 성공률이 낮습니다. 오류 처리를 강화하세요.');
    }

    const avgMemoryIncrease = results.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / results.metrics.length;
    if (avgMemoryIncrease > 1000000) { // 1MB
      recommendations.push('메모리 사용량이 증가하고 있습니다. 메모리 누수를 확인하세요.');
    }

    const avgDomNodeIncrease = results.metrics.reduce((sum, m) => sum + m.domNodeCount, 0) / results.metrics.length;
    if (avgDomNodeIncrease > 0) {
      recommendations.push('DOM 노드가 계속 증가하고 있습니다. DOM 정리가 필요합니다.');
    }

    return recommendations;
  }
}