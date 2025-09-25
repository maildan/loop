// 🔥 긴급 폰트 시스템 진단 도구
'use client';

export class FontSystemDiagnostic {
  /**
   * 🔥 현재 폰트 시스템 상태를 종합적으로 진단
   */
  static runDiagnostic(): {
    cssVariables: Record<string, string | null>;
    domFontFamily: {
      documentElement: string;
      body: string;
      firstElement: string | null;
    };
    globalStyles: {
      exists: boolean;
      content: string | null;
    };
    dynamicStyles: {
      exists: boolean;
      content: string | null;
    };
    electronStore: {
      available: boolean;
      fontFamily: any;
      fontSize: any;
    };
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    // CSS 변수 확인
    const root = document.documentElement;
    const cssVariables = {
      '--app-font-family': root.style.getPropertyValue('--app-font-family') || 
                          getComputedStyle(root).getPropertyValue('--app-font-family'),
      '--app-font-size': root.style.getPropertyValue('--app-font-size') || 
                        getComputedStyle(root).getPropertyValue('--app-font-size'),
      '--dynamic-font-family': root.style.getPropertyValue('--dynamic-font-family') || 
                              getComputedStyle(root).getPropertyValue('--dynamic-font-family')
    };

    // DOM 요소의 실제 폰트 확인
    const domFontFamily = {
      documentElement: getComputedStyle(root).fontFamily,
      body: getComputedStyle(document.body).fontFamily,
      firstElement: document.querySelector('*:not(script):not(style)') ? 
                   getComputedStyle(document.querySelector('*:not(script):not(style)')!).fontFamily : null
    };

    // 글로벌 스타일 확인
    const globalStyleElement = document.getElementById('global-font-style');
    const globalStyles = {
      exists: !!globalStyleElement,
      content: globalStyleElement?.textContent || null
    };

    // 동적 폰트 스타일 확인
    const dynamicStyleElement = document.getElementById('dynamic-fonts');
    const dynamicStyles = {
      exists: !!dynamicStyleElement,
      content: dynamicStyleElement?.textContent || null
    };

    // Electron Store 확인
    const electronStore = {
      available: !!(window as any).electronAPI?.settings,
      fontFamily: null,
      fontSize: null
    };

    // 권장사항 생성
    if (!cssVariables['--app-font-family']) {
      recommendations.push('CSS 변수 --app-font-family가 설정되지 않았습니다.');
    }

    if (!globalStyles.exists) {
      recommendations.push('global-font-style 요소가 존재하지 않습니다.');
    }

    if (domFontFamily.body.includes('system-ui') && !domFontFamily.body.includes('Pretendard')) {
      recommendations.push('실제 폰트가 시스템 기본 폰트로 fallback되고 있습니다.');
    }

    if (!electronStore.available) {
      recommendations.push('Electron API를 사용할 수 없습니다 (웹 환경일 가능성).');
    }

    return {
      cssVariables,
      domFontFamily,
      globalStyles,
      dynamicStyles,
      electronStore,
      recommendations
    };
  }

  /**
   * 🔥 블랙리스트 시스템 진단
   */
  static async diagnoseBlacklist(): Promise<{
    blacklistedFonts: string[];
    loadedFonts: string[];
    problemFonts: string[];
    recommendations: string[];
  }> {
    const recommendations: string[] = [];
    let blacklistedFonts: string[] = [];
    
    // Electron Store에서 블랙리스트 확인
    try {
      if ((window as any).electronAPI?.settings?.get) {
        const result = await (window as any).electronAPI.settings.get('app.fontBlacklist');
        if (result.success && result.data) {
          blacklistedFonts = (result.data as any[]).map(entry => entry.fontName);
        }
      }
    } catch (e) {
      recommendations.push('블랙리스트를 로드할 수 없습니다.');
    }

    // 현재 로드된 폰트들 확인 (네트워크 탭 기반)
    const loadedFonts: string[] = [];
    const problemFonts = ['gaw.otf', 'gaw_Bold.otf', 'gaw_Light.otf', 'NanumGothicBold.otf'];
    
    // CSS의 @font-face 규칙들 확인
    try {
      for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i];
        if (styleSheet && styleSheet.cssRules) {
          for (let j = 0; j < styleSheet.cssRules.length; j++) {
            const rule = styleSheet.cssRules[j];
            if (rule instanceof CSSFontFaceRule) {
              const src = rule.style.getPropertyValue('src');
              if (src) {
                const fontMatch = src.match(/url\(.*?([^\/]+\.(otf|ttf|woff2?))/);
                if (fontMatch && fontMatch[1]) {
                  loadedFonts.push(fontMatch[1]);
                }
              }
            }
          }
        }
      }
    } catch (e) {
      recommendations.push('CSS 폰트 규칙을 확인할 수 없습니다.');
    }

    // 문제 폰트 감지
    const detectedProblemFonts = loadedFonts.filter(font => 
      problemFonts.some(problem => font.toLowerCase().includes(problem.toLowerCase()))
    );

    if (detectedProblemFonts.length > 0) {
      recommendations.push(`문제 폰트들이 여전히 로드되고 있습니다: ${detectedProblemFonts.join(', ')}`);
    }

    if (blacklistedFonts.length === 0) {
      recommendations.push('블랙리스트가 비어있거나 제대로 초기화되지 않았습니다.');
    }

    return {
      blacklistedFonts,
      loadedFonts,
      problemFonts: detectedProblemFonts,
      recommendations
    };
  }

  /**
   * 🔥 TipTap 에디터 폰트 적용 상태 확인
   */
  static diagnoseTipTap(): {
    editorExists: boolean;
    inheritedFont: string | null;
    directFont: string | null;
    cssVariableApplied: boolean;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    const tipTapElements = document.querySelectorAll('.ProseMirror, .tiptap, [data-tiptap]');
    const editorExists = tipTapElements.length > 0;
    
    if (!editorExists) {
      recommendations.push('TipTap 에디터 요소를 찾을 수 없습니다.');
      return {
        editorExists: false,
        inheritedFont: null,
        directFont: null,
        cssVariableApplied: false,
        recommendations
      };
    }

    const editorElement = tipTapElements[0] as HTMLElement;
    const computedStyle = getComputedStyle(editorElement);
    const inheritedFont = computedStyle.fontFamily;
    const directFont = editorElement.style.fontFamily;
    
    const rootFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--app-font-family');
    const cssVariableApplied = !!(rootFontFamily && inheritedFont.includes(rootFontFamily.replace(/['"]/g, '')));

    if (!cssVariableApplied) {
      recommendations.push('TipTap 에디터가 CSS 변수를 상속받지 못했습니다.');
    }

    if (inheritedFont.includes('system-ui') && !inheritedFont.includes('Pretendard')) {
      recommendations.push('TipTap 에디터가 시스템 기본 폰트를 사용하고 있습니다.');
    }

    return {
      editorExists,
      inheritedFont,
      directFont,
      cssVariableApplied,
      recommendations
    };
  }

  /**
   * 🔥 종합 진단 및 해결책 제시
   */
  static async runCompleteDiagnostic(): Promise<{
    system: ReturnType<typeof FontSystemDiagnostic.runDiagnostic>;
    blacklist: Awaited<ReturnType<typeof FontSystemDiagnostic.diagnoseBlacklist>>;
    tipTap: ReturnType<typeof FontSystemDiagnostic.diagnoseTipTap>;
    overallHealth: 'healthy' | 'warning' | 'critical';
    criticalIssues: string[];
    actionItems: string[];
  }> {
    const system = this.runDiagnostic();
    const blacklist = await this.diagnoseBlacklist();
    const tipTap = this.diagnoseTipTap();

    const allRecommendations = [
      ...system.recommendations,
      ...blacklist.recommendations,
      ...tipTap.recommendations
    ];

    const criticalIssues: string[] = [];
    const actionItems: string[] = [];

    // 심각한 문제들 식별
    if (!system.cssVariables['--app-font-family']) {
      criticalIssues.push('CSS 변수가 설정되지 않아 폰트 시스템이 작동하지 않습니다.');
      actionItems.push('FontProvider의 applyCSSVariables 함수가 호출되는지 확인하세요.');
    }

    if (blacklist.problemFonts.length > 0) {
      criticalIssues.push('블랙리스트된 문제 폰트들이 여전히 로드되고 있습니다.');
      actionItems.push('블랙리스트 매칭 로직을 수정하고 폰트 필터링을 강화하세요.');
    }

    if (!tipTap.cssVariableApplied && tipTap.editorExists) {
      criticalIssues.push('TipTap 에디터에 폰트가 적용되지 않았습니다.');
      actionItems.push('에디터 CSS 상속 규칙을 검토하고 !important 우선순위를 확인하세요.');
    }

    const overallHealth: 'healthy' | 'warning' | 'critical' = 
      criticalIssues.length > 0 ? 'critical' : 
      allRecommendations.length > 0 ? 'warning' : 'healthy';

    return {
      system,
      blacklist,
      tipTap,
      overallHealth,
      criticalIssues,
      actionItems
    };
  }
}