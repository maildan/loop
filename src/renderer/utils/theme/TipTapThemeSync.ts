/**
 * 🖊️ TipTapThemeSync - TipTap 에디터 테마 동기화 전용 모듈
 * 
 * 역할:
 * - TipTap 에디터 CSS 변수 동기화
 * - ProseMirror 스타일 강제 적용
 * - 에디터 테마 변수 관리
 * - 폰트 설정 적용
 */

import { CSSVariableManager } from '../CSSVariableManager';

export class TipTapThemeSync {
  
  /**
   * TipTap 에디터에 현재 테마의 CSS 변수들 동기화 (강화된 버전)
   */
  static syncTipTapEditorVariables(): void {
    // CSS 변수 읽기를 약간 지연시켜서 DOM 업데이트 완료 후 실행
    setTimeout(() => {
      try {
        // 현재 적용된 테마의 에디터 관련 CSS 변수들 가져오기
        const editorVariables = [
          { name: '--editor-bg', value: this.getCSSVariable('--editor-bg') },
          { name: '--editor-bg-secondary', value: this.getCSSVariable('--editor-bg-secondary') },
          { name: '--editor-text', value: this.getCSSVariable('--editor-text') },
          { name: '--editor-text-muted', value: this.getCSSVariable('--editor-text-muted') },
          { name: '--editor-border', value: this.getCSSVariable('--editor-border') },
          { name: '--editor-accent', value: this.getCSSVariable('--editor-accent') },
          { name: '--border', value: this.getCSSVariable('--border') },
          { name: '--background', value: this.getCSSVariable('--background') },
          { name: '--foreground', value: this.getCSSVariable('--foreground') }
        ].filter(variable => variable.value && variable.value !== ''); // 빈 값 필터링

        console.log('🔍 CSS 변수 읽기 결과:', editorVariables);

        // CSSVariableManager를 통해 TipTap 에디터에 직접 적용
        if (editorVariables.length > 0) {
          CSSVariableManager.syncTipTapThemeVariables(editorVariables);
          console.log('🎨 TipTap 에디터에 테마 CSS 변수 동기화 완료:', editorVariables.length, '개');
        } else {
          console.warn('⚠️ 읽을 수 있는 에디터 CSS 변수가 없습니다. 테마가 제대로 적용되지 않았을 수 있습니다.');
        }

        // 추가로 폰트 설정도 재적용
        const appFontFamily = this.getCSSVariable('--app-font-family');
        if (appFontFamily) {
          CSSVariableManager.forceFontOnTipTap(appFontFamily);
        }

        // ProseMirror 요소에 직접 배경색과 텍스트 색상 강제 적용
        this.forceTipTapEditorStyles();

      } catch (error) {
        console.warn('TipTap 에디터 CSS 변수 동기화 실패:', error);
      }
    }, 100); // 100ms 지연
  }

  /**
   * ProseMirror 에디터에 배경색과 텍스트 색상 강제 적용
   */
  static forceTipTapEditorStyles(): void {
    try {
      const proseMirrorElements = document.querySelectorAll('.ProseMirror');
      
      proseMirrorElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          // CSS 변수를 직접 읽어서 강제 적용
          const editorBg = this.getCSSVariable('--editor-bg');
          const editorText = this.getCSSVariable('--editor-text');
          
          if (editorBg) {
            element.style.setProperty('background-color', `var(--editor-bg, ${editorBg})`, 'important');
            element.style.setProperty('background', `var(--editor-bg, ${editorBg})`, 'important');
          }
          
          if (editorText) {
            element.style.setProperty('color', `var(--editor-text, ${editorText})`, 'important');
          }
          
          console.log('🎯 ProseMirror 스타일 강제 적용:', {
            element: element.className,
            background: editorBg,
            color: editorText
          });
        }
      });
    } catch (error) {
      console.warn('ProseMirror 에디터 스타일 강제 적용 실패:', error);
    }
  }

  /**
   * 특정 테마 선택자를 사용한 강제 스타일 적용 (sepia 테마용)
   */
  static forceThemeSpecificStyles(theme: string): void {
    try {
      const selectors = [
        `.${theme} .tiptap-editor`,
        `.${theme} .ProseMirror`, 
        `.${theme} .tiptap`,
        `[data-theme="${theme}"] .tiptap-editor`,
        `[data-theme="${theme}"] .ProseMirror`,
        `[data-theme="${theme}"] .tiptap`
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element instanceof HTMLElement) {
            const editorBg = this.getCSSVariable('--editor-bg');
            const editorText = this.getCSSVariable('--editor-text');
            
            if (editorBg) {
              element.style.setProperty('background-color', `var(--editor-bg, ${editorBg})`, 'important');
            }
            
            if (editorText) {
              element.style.setProperty('color', `var(--editor-text, ${editorText})`, 'important');
            }
          }
        });
      });

      console.log(`🎯 ${theme} 테마 전용 스타일 강제 적용 완료`);
    } catch (error) {
      console.warn(`${theme} 테마 전용 스타일 적용 실패:`, error);
    }
  }

  /**
   * CSS 변수 값 가져오기 (내부용)
   */
  private static getCSSVariable(variable: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }

  /**
   * 폰트 패밀리 변경시 TipTap 에디터 동기화
   */
  static syncEditorFont(fontFamily: string): void {
    try {
      const editors = document.querySelectorAll('.ProseMirror, .tiptap-editor');
      editors.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.fontFamily = fontFamily;
        }
      });
      
      console.log('🔤 TipTap 에디터 폰트 동기화:', fontFamily);
    } catch (error) {
      console.warn('TipTap 에디터 폰트 동기화 실패:', error);
    }
  }

  /**
   * 에디터 플레이스홀더 스타일 업데이트
   */
  static updateEditorPlaceholder(): void {
    try {
      const mutedColor = this.getCSSVariable('--editor-text-muted');
      if (mutedColor) {
        // 플레이스홀더 스타일 동적 업데이트
        const style = document.createElement('style');
        style.textContent = `
          .ProseMirror .is-editor-empty:first-child::before,
          .tiptap-editor .is-editor-empty:first-child::before {
            color: ${mutedColor} !important;
          }
        `;
        
        // 기존 스타일 제거 후 새로 추가
        const existingStyle = document.querySelector('#tiptap-placeholder-style');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        style.id = 'tiptap-placeholder-style';
        document.head.appendChild(style);
        
        console.log('📝 TipTap 플레이스홀더 스타일 업데이트:', mutedColor);
      }
    } catch (error) {
      console.warn('TipTap 플레이스홀더 스타일 업데이트 실패:', error);
    }
  }
}