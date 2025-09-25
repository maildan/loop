// 🔥 Font Accessibility Manager - 접근성 및 안전성 기능
'use client';

interface FontAccessibilitySettings {
  announceChanges: boolean;
  allowRollback: boolean;
  preserveCustomizations: boolean;
  reducedMotion: boolean;
}

interface FontRollbackState {
  timestamp: number;
  fontFamily: string;
  fontSize: number;
  customCss?: string;
  reason: string;
}

/**
 * 🔥 폰트 변경에 대한 접근성 지원 클래스
 */
export class FontAccessibilityManager {
  private static readonly STORAGE_KEY = 'loop-font-accessibility';
  private static readonly ROLLBACK_KEY = 'loop-font-rollback-history';
  private static readonly MAX_ROLLBACK_STATES = 10;
  private static readonly ROLLBACK_TIMEOUT = 30 * 60 * 1000; // 30분

  // 🔥 Live Region for Screen Reader Announcements
  private static liveRegion: HTMLElement | null = null;

  /**
   * 🔥 접근성 설정 로드
   */
  static async getAccessibilitySettings(): Promise<FontAccessibilitySettings> {
    try {
      if (window.electronAPI?.settings?.get) {
        const result = await window.electronAPI.settings.get('app.fontAccessibility');
        if (result.success && result.data) {
          return result.data as FontAccessibilitySettings;
        }
      }

      // 기본 설정 (접근성 우선)
      return {
        announceChanges: true,
        allowRollback: true,
        preserveCustomizations: true,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };
    } catch (e) {
      return {
        announceChanges: true,
        allowRollback: true,
        preserveCustomizations: true,
        reducedMotion: false
      };
    }
  }

  /**
   * 🔥 접근성 설정 저장
   */
  static async saveAccessibilitySettings(settings: FontAccessibilitySettings): Promise<void> {
    try {
      if (window.electronAPI?.settings?.set) {
        await window.electronAPI.settings.set('app.fontAccessibility', settings);
      }
    } catch (e) {
      console.warn('Failed to save accessibility settings:', e);
    }
  }

  /**
   * 🔥 Live Region 생성/가져오기 (화면 읽기 도구용)
   */
  private static getLiveRegion(): HTMLElement {
    if (!this.liveRegion || !document.contains(this.liveRegion)) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-label', 'Font change announcements');
      this.liveRegion.id = 'font-accessibility-announcements';
      this.liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
      `;
      document.body.appendChild(this.liveRegion);
    }
    return this.liveRegion;
  }

  /**
   * 🔥 화면 읽기 도구를 위한 폰트 변경 공지
   */
  static async announceFontChange(fontFamily: string | undefined, fontSize?: number): Promise<void> {
    try {
      const settings = await this.getAccessibilitySettings();
      if (!settings.announceChanges) return;

      const liveRegion = this.getLiveRegion();
      
      // 폰트 이름 정리 (사용자 친화적) - undefined 체크 강화
      const fontString: string = fontFamily ? String(fontFamily) : 'system-ui';
      const parts = fontString.split(',');
      const cleanFontName = (parts[0] || 'system-ui')
        .replace(/['"]/g, '') // 따옴표 제거
        .trim();

      let announcement = `폰트가 ${cleanFontName}로 변경되었습니다`;
      if (fontSize) {
        announcement += `, 크기는 ${fontSize}픽셀입니다`;
      }

      // Clear previous announcement and set new one
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = announcement;
      }, 100);

      // 로그 기록
      console.info('FONT_ACCESSIBILITY', 'Font change announced to screen readers', {
        fontFamily: cleanFontName,
        fontSize,
        announcement
      });

    } catch (e) {
      console.warn('Failed to announce font change:', e);
    }
  }

  /**
   * 🔥 롤백 상태 저장
   */
  static async saveRollbackState(
    fontFamily: string, 
    fontSize: number, 
    reason: string,
    customCss?: string
  ): Promise<void> {
    try {
      const settings = await this.getAccessibilitySettings();
      if (!settings.allowRollback) return;

      let rollbackHistory: FontRollbackState[] = [];
      
      if (window.electronAPI?.settings?.get) {
        const result = await window.electronAPI.settings.get(this.ROLLBACK_KEY);
        if (result.success && result.data) {
          rollbackHistory = result.data as FontRollbackState[];
        }
      }

      // 새 롤백 상태 추가
      const newState: FontRollbackState = {
        timestamp: Date.now(),
        fontFamily,
        fontSize,
        customCss,
        reason
      };

      rollbackHistory.unshift(newState);

      // 최대 개수 제한
      if (rollbackHistory.length > this.MAX_ROLLBACK_STATES) {
        rollbackHistory = rollbackHistory.slice(0, this.MAX_ROLLBACK_STATES);
      }

      // 오래된 상태 제거 (30분 이상)
      const now = Date.now();
      rollbackHistory = rollbackHistory.filter(
        state => now - state.timestamp < this.ROLLBACK_TIMEOUT
      );

      if (window.electronAPI?.settings?.set) {
        await window.electronAPI.settings.set(this.ROLLBACK_KEY, rollbackHistory);
      }

      console.info('FONT_ACCESSIBILITY', 'Rollback state saved', {
        reason,
        fontFamily,
        fontSize,
        historyLength: rollbackHistory.length
      });

    } catch (e) {
      console.warn('Failed to save rollback state:', e);
    }
  }

  /**
   * 🔥 롤백 가능한 상태 목록 가져오기
   */
  static async getRollbackStates(): Promise<FontRollbackState[]> {
    try {
      if (window.electronAPI?.settings?.get) {
        const result = await window.electronAPI.settings.get(this.ROLLBACK_KEY);
        if (result.success && result.data) {
          const history = result.data as FontRollbackState[];
          
          // 유효한 상태만 반환 (30분 이내)
          const now = Date.now();
          return history.filter(state => now - state.timestamp < this.ROLLBACK_TIMEOUT);
        }
      }
      return [];
    } catch (e) {
      console.warn('Failed to get rollback states:', e);
      return [];
    }
  }

  /**
   * 🔥 롤백 실행
   */
  static async rollbackToState(stateIndex: number): Promise<FontRollbackState | null> {
    try {
      const rollbackStates = await this.getRollbackStates();
      if (stateIndex < 0 || stateIndex >= rollbackStates.length) {
        throw new Error('Invalid rollback state index');
      }

      const targetState = rollbackStates[stateIndex];
      if (!targetState) {
        throw new Error('Rollback state not found');
      }
      
      // 롤백 공지
      await this.announceFontChange(
        targetState.fontFamily, 
        targetState.fontSize
      );

      console.info('FONT_ACCESSIBILITY', 'Font rolled back', {
        targetState,
        reason: 'User requested rollback'
      });

      return targetState;
    } catch (e) {
      console.error('Failed to rollback font state:', e);
      return null;
    }
  }

  /**
   * 🔥 사용자 맞춤 설정 보존
   */
  static async preserveUserCustomizations(css: string): Promise<void> {
    try {
      const settings = await this.getAccessibilitySettings();
      if (!settings.preserveCustomizations) return;

      if (window.electronAPI?.settings?.set) {
        await window.electronAPI.settings.set('app.userFontCustomizations', {
          css,
          timestamp: Date.now()
        });
      }

      console.info('FONT_ACCESSIBILITY', 'User customizations preserved', {
        cssLength: css.length
      });
    } catch (e) {
      console.warn('Failed to preserve user customizations:', e);
    }
  }

  /**
   * 🔥 저장된 사용자 맞춤 설정 복원
   */
  static async restoreUserCustomizations(): Promise<string | null> {
    try {
      const settings = await this.getAccessibilitySettings();
      if (!settings.preserveCustomizations) return null;

      if (window.electronAPI?.settings?.get) {
        const result = await window.electronAPI.settings.get('app.userFontCustomizations');
        if (result.success && result.data) {
          const customizations = result.data as { css: string; timestamp: number };
          
          // 24시간 이내의 맞춤 설정만 복원
          const dayOld = 24 * 60 * 60 * 1000;
          if (Date.now() - customizations.timestamp < dayOld) {
            console.info('FONT_ACCESSIBILITY', 'User customizations restored');
            return customizations.css;
          }
        }
      }
      return null;
    } catch (e) {
      console.warn('Failed to restore user customizations:', e);
      return null;
    }
  }

  /**
   * 🔥 접근성 위반 검사 및 경고
   */
  static async checkAccessibilityCompliance(fontFamily: string, fontSize: number): Promise<{
    warnings: string[];
    suggestions: string[];
  }> {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      // 최소 폰트 크기 검사 (WCAG 권장사항)
      if (fontSize < 12) {
        warnings.push('폰트 크기가 너무 작습니다 (12px 미만)');
        suggestions.push('가독성을 위해 최소 12px 이상 사용을 권장합니다');
      }

      // 시스템 폰트 접근성 검사
      const accessibleFonts = [
        'system-ui', 'arial', 'helvetica', 'times', 'georgia', 
        'verdana', 'tahoma', 'trebuchet ms', 'sans-serif', 'serif'
      ];
      
      const isAccessibleFont = accessibleFonts.some(font => 
        fontFamily.toLowerCase().includes(font)
      );

      if (!isAccessibleFont) {
        suggestions.push('시스템 폰트나 웹 안전 폰트 사용을 고려해보세요');
      }

      // 대비 감소 운동 선호도 검사
      const settings = await this.getAccessibilitySettings();
      if (settings.reducedMotion) {
        suggestions.push('동작 감소 설정이 활성화되어 있습니다. 폰트 전환 애니메이션이 줄어들 수 있습니다');
      }

      return { warnings, suggestions };

    } catch (e) {
      console.warn('Failed to check accessibility compliance:', e);
      return { warnings: [], suggestions: [] };
    }
  }

  /**
   * 🔥 접근성 리포트 생성
   */
  static async generateAccessibilityReport(): Promise<{
    settings: FontAccessibilitySettings;
    rollbackStatesCount: number;
    hasCustomizations: boolean;
    systemSupport: {
      screenReader: boolean;
      reducedMotion: boolean;
      highContrast: boolean;
    };
  }> {
    try {
      const settings = await this.getAccessibilitySettings();
      const rollbackStates = await this.getRollbackStates();
      const customizations = await this.restoreUserCustomizations();

      return {
        settings,
        rollbackStatesCount: rollbackStates.length,
        hasCustomizations: !!customizations,
        systemSupport: {
          screenReader: !!(window.navigator as any).userAgent.includes('NVDA') || 
                       !!(window.navigator as any).userAgent.includes('JAWS') ||
                       !!(window as any).speechSynthesis,
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          highContrast: window.matchMedia('(prefers-contrast: high)').matches
        }
      };
    } catch (e) {
      console.error('Failed to generate accessibility report:', e);
      throw e;
    }
  }
}