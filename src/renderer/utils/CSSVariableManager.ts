// 🔥 CSS 변수 관리 시스템 - DOM 적용 전용 (FontProvider에서 분리)
'use client';

import { Logger } from '../../shared/logger';

/**
 * CSS 변수 정의 인터페이스
 */
interface CSSVariableDefinition {
  name: string;
  value: string;
  priority?: 'important' | 'normal';
  element?: HTMLElement | null;
}

/**
 * 🔥 CSS 변수 적용 시스템 - 단순화, 안정성 중심
 */
export class CSSVariableManager {
  private static readonly CSS_VAR_PREFIX = '--app-';
  
  /**
   * 🔥 핵심 폰트 CSS 변수들을 DOM에 직접 적용
   */
  static applyFontVariables(fontSettings: {
    family?: string;
    size?: number;
    weight?: number;
    lineHeight?: number;
    letterSpacing?: number;
  }): void {
    try {
      const root = document.documentElement;
      const variables: CSSVariableDefinition[] = [];

      // 폰트 패밀리 (가장 중요)
      if (fontSettings.family) {
        variables.push({
          name: `${this.CSS_VAR_PREFIX}font-family`,
          value: this.sanitizeFontFamily(fontSettings.family)
        });
      }

      // 폰트 크기
      if (fontSettings.size !== undefined) {
        variables.push({
          name: `${this.CSS_VAR_PREFIX}font-size`,
          value: `${Math.max(8, Math.min(72, fontSettings.size))}px`
        });
      }

      // 폰트 가중치
      if (fontSettings.weight !== undefined) {
        variables.push({
          name: `${this.CSS_VAR_PREFIX}font-weight`,
          value: String(Math.max(100, Math.min(900, fontSettings.weight)))
        });
      }

      // 줄 간격
      if (fontSettings.lineHeight !== undefined) {
        variables.push({
          name: `${this.CSS_VAR_PREFIX}line-height`,
          value: String(Math.max(0.8, Math.min(3.0, fontSettings.lineHeight)))
        });
      }

      // 글자 간격
      if (fontSettings.letterSpacing !== undefined) {
        variables.push({
          name: `${this.CSS_VAR_PREFIX}letter-spacing`,
          value: `${Math.max(-2, Math.min(5, fontSettings.letterSpacing))}px`
        });
      }

      // DOM에 CSS 변수 적용
      this.setVariablesOnElement(root, variables);

      // TipTap 에디터 특별 처리
      this.applyToTipTapEditor(variables);

      Logger.info('CSS_VARIABLES', '폰트 CSS 변수 적용 완료', {
        variables: variables.map(v => `${v.name}: ${v.value}`),
        element: 'document.documentElement'
      });

      // 🔥 적용 검증 (디버깅용)
      this.verifyVariableApplication(variables);

    } catch (error) {
      Logger.error('CSS_VARIABLES', '폰트 CSS 변수 적용 실패', error);
    }
  }

  /**
   * 🔥 DOM 요소에 CSS 변수 설정 (안전한 방식)
   */
  private static setVariablesOnElement(element: HTMLElement, variables: CSSVariableDefinition[]): void {
    try {
      for (const variable of variables) {
        const targetElement = variable.element || element;
        const priority = variable.priority === 'important' ? 'important' : '';
        
        targetElement.style.setProperty(variable.name, variable.value, priority);
        
        // 즉시 검증
        const applied = getComputedStyle(targetElement).getPropertyValue(variable.name);
        if (!applied || applied.trim() === '') {
          Logger.warn('CSS_VARIABLES', `CSS 변수 적용 실패: ${variable.name}`, {
            value: variable.value,
            element: targetElement.tagName
          });
        }
      }
    } catch (error) {
      Logger.error('CSS_VARIABLES', 'CSS 변수 설정 중 오류', error);
    }
  }

  /**
   * 🔥 TipTap 에디터에 직접 적용 (중요!)
   */
  private static applyToTipTapEditor(variables: CSSVariableDefinition[]): void {
    try {
      // TipTap 컨테이너들 찾기
      const tipTapSelectors = [
        '.ProseMirror',
        '.tiptap',
        '.editor-content',
        '[data-tippy-content]',
        '.prose'
      ];

      for (const selector of tipTapSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element instanceof HTMLElement) {
            this.setVariablesOnElement(element, variables);
          }
        });
      }

      // 추가: TipTap 에디터 특별 스타일링
      const fontFamily = variables.find(v => v.name.includes('font-family'))?.value;
      if (fontFamily) {
        const proseMirrorElements = document.querySelectorAll('.ProseMirror');
        proseMirrorElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.style.fontFamily = fontFamily;
          }
        });
      }

    } catch (error) {
      Logger.warn('CSS_VARIABLES', 'TipTap 에디터 스타일 적용 실패', error);
    }
  }

  /**
   * 🔥 폰트 패밀리 문자열 정제 (보안 + 안정성)
   */
  private static sanitizeFontFamily(fontFamily: string): string {
    if (!fontFamily || typeof fontFamily !== 'string') {
      return '"Pretendard", system-ui, sans-serif';
    }

    // 위험한 문자 제거
    let sanitized = fontFamily
      .replace(/[<>'"\\]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/expression\(/gi, '')
      .trim();

    // 빈 문자열 체크
    if (!sanitized) {
      return '"Pretendard", system-ui, sans-serif';
    }

    // 적절한 fallback 추가
    const commonFallbacks = ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'];
    const fallbackString = commonFallbacks.join(', ');

    // 이미 fallback이 있는지 확인
    if (!sanitized.includes('system-ui') && !sanitized.includes('sans-serif')) {
      sanitized = `${sanitized}, ${fallbackString}`;
    }

    return sanitized;
  }

  /**
   * 🔥 CSS 변수 적용 검증 (실시간 디버깅) - 수정된 로직
   */
  private static verifyVariableApplication(variables: CSSVariableDefinition[]): void {
    try {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      const verificationResults: { name: string; expected: string; actual: string; applied: boolean }[] = [];

      for (const variable of variables) {
        const actualValue = computedStyle.getPropertyValue(variable.name).trim();
        // 🔥 수정: 값이 존재하면 적용된 것으로 간주 (이전 로직 오류 수정)
        const applied = actualValue !== '';
        
        verificationResults.push({
          name: variable.name,
          expected: variable.value,
          actual: actualValue,
          applied
        });
      }

      const failedApplications = verificationResults.filter(result => !result.applied);
      
      if (failedApplications.length > 0) {
        Logger.warn('CSS_VARIABLES', 'CSS 변수 적용 검증 실패', {
          failed: failedApplications,
          total: variables.length,
          successRate: `${((variables.length - failedApplications.length) / variables.length * 100).toFixed(1)}%`
        });
      } else {
        Logger.info('CSS_VARIABLES', 'CSS 변수 적용 검증 성공', {
          applied: verificationResults.length,
          successRate: '100%'
        });
      }

      // 🔥 브라우저 개발자 도구용 정보 출력 (개선)
      if (process.env.NODE_ENV === 'development') {
        console.group('🔥 CSS Variables Applied');
        verificationResults.forEach(result => {
          const status = result.applied ? '✅' : '❌';
          const value = result.actual || 'NOT APPLIED';
          console.log(`${status} ${result.name}: ${value}`);
          
          // 예상값과 실제값이 다른 경우 경고
          if (result.applied && result.actual !== result.expected) {
            console.warn(`  ⚠️ Expected: ${result.expected}, Got: ${result.actual}`);
          }
        });
        console.groupEnd();
        
        // 🔥 추가: TipTap 에디터 폰트 확인
        const proseMirror = document.querySelector('.ProseMirror');
        if (proseMirror) {
          const pmStyle = getComputedStyle(proseMirror);
          console.group('🎯 TipTap Editor Font Check');
          console.log(`Font Family: ${pmStyle.fontFamily}`);
          console.log(`Font Size: ${pmStyle.fontSize}`);
          console.log(`Font Weight: ${pmStyle.fontWeight}`);
          console.groupEnd();
        }
      }

    } catch (error) {
      Logger.warn('CSS_VARIABLES', 'CSS 변수 검증 중 오류', error);
    }
  }

  /**
   * 🔥 전체 CSS 변수 초기화
   */
  static resetAllFontVariables(): void {
    try {
      const root = document.documentElement;
      const fontVariables = [
        `${this.CSS_VAR_PREFIX}font-family`,
        `${this.CSS_VAR_PREFIX}font-size`,
        `${this.CSS_VAR_PREFIX}font-weight`,
        `${this.CSS_VAR_PREFIX}line-height`,
        `${this.CSS_VAR_PREFIX}letter-spacing`
      ];

      for (const varName of fontVariables) {
        root.style.removeProperty(varName);
      }

      Logger.info('CSS_VARIABLES', '모든 폰트 CSS 변수 초기화 완료');
    } catch (error) {
      Logger.error('CSS_VARIABLES', 'CSS 변수 초기화 실패', error);
    }
  }

  /**
   * 🔥 현재 적용된 CSS 변수 값들 조회
   */
  static getCurrentVariableValues(): Record<string, string> {
    try {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      const fontVariables = [
        `${this.CSS_VAR_PREFIX}font-family`,
        `${this.CSS_VAR_PREFIX}font-size`,
        `${this.CSS_VAR_PREFIX}font-weight`,
        `${this.CSS_VAR_PREFIX}line-height`,
        `${this.CSS_VAR_PREFIX}letter-spacing`
      ];

      const currentValues: Record<string, string> = {};

      for (const varName of fontVariables) {
        const value = computedStyle.getPropertyValue(varName).trim();
        if (value) {
          currentValues[varName] = value;
        }
      }

      return currentValues;
    } catch (error) {
      Logger.warn('CSS_VARIABLES', '현재 CSS 변수 값 조회 실패', error);
      return {};
    }
  }

  /**
   * 🔥 TipTap 에디터 감지 및 폰트 강제 적용 (개선된 로직)
   */
  static forceFontOnTipTap(fontFamily: string): void {
    try {
      const sanitizedFont = this.sanitizeFontFamily(fontFamily);
      
      // TipTap 요소들에 직접 스타일 적용 (!important 사용)
      const tipTapSelectors = [
        '.ProseMirror',
        '.tiptap',
        '.editor-content',
        '.prose'
      ];

      let appliedCount = 0;

      for (const selector of tipTapSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element instanceof HTMLElement) {
            // 🔥 !important로 강제 적용
            element.style.setProperty('font-family', sanitizedFont, 'important');
            element.style.setProperty('font-synthesis', 'none', 'important');
            
            // 추가 CSS 클래스 적용
            element.classList.add('custom-font-applied');
            
            appliedCount++;
          }
        });
      }

      // 🔥 동적 CSS 규칙 추가 (더 강력한 방법)
      this.injectTipTapFontCSS(sanitizedFont);

      Logger.info('CSS_VARIABLES', 'TipTap 에디터 폰트 강제 적용 완료', {
        fontFamily: sanitizedFont,
        elementsApplied: appliedCount,
        selectors: tipTapSelectors
      });

    } catch (error) {
      Logger.error('CSS_VARIABLES', 'TipTap 폰트 강제 적용 실패', error);
    }
  }

  /**
   * 🔥 TipTap용 동적 CSS 규칙 삽입
   */
  private static injectTipTapFontCSS(fontFamily: string): void {
    try {
      // 기존 TipTap 폰트 스타일 제거
      const existingStyle = document.getElementById('tiptap-font-override');
      if (existingStyle) {
        existingStyle.remove();
      }

      // 새로운 스타일 생성
      const style = document.createElement('style');
      style.id = 'tiptap-font-override';
      style.textContent = `
        .ProseMirror,
        .tiptap,
        .editor-content,
        .prose,
        .custom-font-applied {
          font-family: ${fontFamily} !important;
          font-synthesis: none !important;
        }
        
        .ProseMirror * {
          font-family: inherit !important;
        }
      `;

      document.head.appendChild(style);

      Logger.info('CSS_VARIABLES', 'TipTap CSS 규칙 주입 완료', {
        styleId: 'tiptap-font-override',
        fontFamily
      });

    } catch (error) {
      Logger.warn('CSS_VARIABLES', 'TipTap CSS 규칙 주입 실패', error);
    }
  }
}