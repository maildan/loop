/**
 * 🎯 Persistent Font Manager
 * React 컴포넌트 생명주기와 독립적인 전역 폰트 설정 관리
 * 
 * 목표:
 * - 에디터를 나가도 전역 폰트 설정 유지
 * - DOM 레벨에서 CSS 변수 영구 적용
 * - FontProvider 언마운트에 영향받지 않는 지속성
 */

import { Logger } from '../../shared/logger';

interface FontSettings {
  fontFamily: string;
  fontSize: number;
}

interface PersistentFontConfig {
  enablePersistence: boolean;
  storageKey: string;
  cssVariablePrefix: string;
}

class PersistentFontManager {
  private static instance: PersistentFontManager;
  private currentSettings: FontSettings = {
    fontFamily: 'system-ui, sans-serif', // TODO: 이후 FONT_CONFIG와 통합
    fontSize: 16 // TODO: 이후 FONT_CONFIG와 통합
  };
  
  private config: PersistentFontConfig = {
    enablePersistence: true,
    storageKey: 'loop-persistent-fonts',
    cssVariablePrefix: '--app'
  };

  private globalStyleElement: HTMLStyleElement | null = null;
  private initialized = false;

  private constructor() {
    this.initializeGlobalStyles();
  }

  public static getInstance(): PersistentFontManager {
    if (!PersistentFontManager.instance) {
      PersistentFontManager.instance = new PersistentFontManager();
    }
    return PersistentFontManager.instance;
  }

  /**
   * 🚀 Initialize persistent font system
   */
  public initialize(): void {
    if (this.initialized) {
      Logger.debug('PERSISTENT_FONT', 'Already initialized');
      return;
    }

    try {
      // 1. Load saved settings from localStorage
      this.loadSavedSettings();
      
      // 2. Apply settings to DOM
      this.applySettingsToDOM();
      
      // 3. Set up DOM monitoring for external changes
      this.setupDOMMonitoring();
      
      this.initialized = true;
      Logger.info('PERSISTENT_FONT', 'Persistent font manager initialized', {
        fontFamily: this.currentSettings.fontFamily,
        fontSize: this.currentSettings.fontSize
      });
    } catch (error) {
      Logger.error('PERSISTENT_FONT', 'Failed to initialize persistent font manager', error);
    }
  }

  /**
   * 🎨 Apply font settings with persistence
   */
  public applyFontSettings(fontFamily: string, fontSize: number): void {
    const previousSettings = { ...this.currentSettings };
    
    this.currentSettings = { fontFamily, fontSize };
    
    try {
      // 1. Apply to DOM immediately
      this.applySettingsToDOM();
      
      // 2. Save to localStorage for persistence
      if (this.config.enablePersistence) {
        this.saveSettings();
      }
      
      Logger.info('PERSISTENT_FONT', 'Font settings applied and persisted', {
        previous: previousSettings,
        current: this.currentSettings
      });
    } catch (error) {
      Logger.error('PERSISTENT_FONT', 'Failed to apply font settings', error);
      // Rollback on error
      this.currentSettings = previousSettings;
    }
  }

  /**
   * 📖 Get current font settings
   */
  public getCurrentSettings(): FontSettings {
    return { ...this.currentSettings };
  }

  /**
   * 🔧 Update only font family
   */
  public updateFontFamily(fontFamily: string): void {
    this.applyFontSettings(fontFamily, this.currentSettings.fontSize);
  }

  /**
   * 📏 Update only font size
   */
  public updateFontSize(fontSize: number): void {
    this.applyFontSettings(this.currentSettings.fontFamily, fontSize);
  }

  /**
   * 🎯 Initialize global style element for persistent CSS
   */
  private initializeGlobalStyles(): void {
    // Create dedicated style element for persistent fonts
    this.globalStyleElement = document.createElement('style');
    this.globalStyleElement.id = 'persistent-font-styles';
    this.globalStyleElement.setAttribute('data-managed-by', 'PersistentFontManager');
    
    // Insert at the end of head to ensure high specificity
    document.head.appendChild(this.globalStyleElement);
    
    Logger.debug('PERSISTENT_FONT', 'Global style element created');
  }

  /**
   * 🌍 Apply font settings to DOM (persistent)
   */
  private applySettingsToDOM(): void {
    try {
      // 1. Update CSS variables on document root
      const root = document.documentElement;
      root.style.setProperty(`${this.config.cssVariablePrefix}-font-family`, this.currentSettings.fontFamily);
      root.style.setProperty(`${this.config.cssVariablePrefix}-font-size`, `${this.currentSettings.fontSize}px`);

      // 2. Generate comprehensive CSS for persistence
      const persistentCSS = this.generatePersistentCSS();
      
      if (this.globalStyleElement) {
        this.globalStyleElement.textContent = persistentCSS;
      }

      // 3. Force layout recalculation
      document.body.offsetHeight;
      
      Logger.debug('PERSISTENT_FONT', 'DOM styles applied', {
        cssVariablesSet: true,
        persistentCSSApplied: true,
        globalStyleElementExists: !!this.globalStyleElement
      });
    } catch (error) {
      Logger.error('PERSISTENT_FONT', 'Failed to apply DOM styles', error);
    }
  }

  /**
   * 🎨 Generate persistent CSS that survives component unmounts
   */
  private generatePersistentCSS(): string {
    const { fontFamily, fontSize } = this.currentSettings;
    
    return `
      /* 🔥 Persistent Font Settings - Independent of React lifecycle */
      
      /* Root CSS variables - highest priority */
      :root {
        ${this.config.cssVariablePrefix}-font-family: ${fontFamily}, system-ui, sans-serif !important;
        ${this.config.cssVariablePrefix}-font-size: ${fontSize}px !important;
      }
      
      /* Global application of font settings */
      html, body {
        font-family: var(${this.config.cssVariablePrefix}-font-family) !important;
        font-size: var(${this.config.cssVariablePrefix}-font-size) !important;
      }
      
      /* Ensure new elements inherit persistent fonts */
      * {
        font-family: inherit;
        font-size: inherit;
      }
      
      /* TipTap editor specific - ensure inheritance */
      .ProseMirror {
        font-family: var(${this.config.cssVariablePrefix}-font-family, ${fontFamily}) !important;
        font-size: var(${this.config.cssVariablePrefix}-font-size, ${fontSize}px) !important;
      }
      
      /* Override any conflicting styles */
      .ProseMirror *:not([style*="font-family"]):not([data-font-family]) {
        font-family: inherit !important;
        font-size: inherit !important;
      }
    `;
  }

  /**
   * 💾 Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      const serialized = JSON.stringify(this.currentSettings);
      localStorage.setItem(this.config.storageKey, serialized);
      Logger.debug('PERSISTENT_FONT', 'Settings saved to localStorage', this.currentSettings);
    } catch (error) {
      Logger.warn('PERSISTENT_FONT', 'Failed to save settings to localStorage', error);
    }
  }

  /**
   * 📖 Load settings from localStorage
   */
  private loadSavedSettings(): void {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as FontSettings;
        
        // Validate loaded settings
        if (parsed.fontFamily && typeof parsed.fontSize === 'number') {
          this.currentSettings = parsed;
          Logger.debug('PERSISTENT_FONT', 'Settings loaded from localStorage', parsed);
        } else {
          Logger.warn('PERSISTENT_FONT', 'Invalid saved settings, using defaults');
        }
      }
    } catch (error) {
      Logger.warn('PERSISTENT_FONT', 'Failed to load settings from localStorage', error);
    }
  }

  /**
   * 👀 Monitor DOM for external CSS variable changes
   */
  private setupDOMMonitoring(): void {
    // Monitor changes to CSS variables made by other components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;
          if (target === document.documentElement) {
            this.syncWithExternalChanges();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    Logger.debug('PERSISTENT_FONT', 'DOM monitoring set up');
  }

  /**
   * 🔄 Sync with external changes to CSS variables
   */
  private syncWithExternalChanges(): void {
    try {
      const root = document.documentElement;
      const currentFontFamily = root.style.getPropertyValue(`${this.config.cssVariablePrefix}-font-family`);
      const currentFontSize = root.style.getPropertyValue(`${this.config.cssVariablePrefix}-font-size`);

      let hasChanges = false;

      if (currentFontFamily && currentFontFamily !== this.currentSettings.fontFamily) {
        this.currentSettings.fontFamily = currentFontFamily;
        hasChanges = true;
      }

      if (currentFontSize) {
        const sizeNum = parseInt(currentFontSize);
        if (!isNaN(sizeNum) && sizeNum !== this.currentSettings.fontSize) {
          this.currentSettings.fontSize = sizeNum;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        Logger.debug('PERSISTENT_FONT', 'Synced with external changes', this.currentSettings);
        this.saveSettings();
      }
    } catch (error) {
      Logger.warn('PERSISTENT_FONT', 'Failed to sync with external changes', error);
    }
  }

  /**
   * 🧹 Clean up persistent styles (for debugging/reset)
   */
  public cleanup(): void {
    if (this.globalStyleElement) {
      this.globalStyleElement.remove();
      this.globalStyleElement = null;
    }
    
    localStorage.removeItem(this.config.storageKey);
    this.initialized = false;
    
    Logger.info('PERSISTENT_FONT', 'Persistent font manager cleaned up');
  }
}

// Export singleton instance
export const persistentFontManager = PersistentFontManager.getInstance();

// 🔍 디버깅용 전역 함수 등록 (개발 환경에서만)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugPersistentFontManager = () => {
    console.log('🔍 PersistentFontManager Debug Info:');
    console.log('- Current Settings:', persistentFontManager.getCurrentSettings());
    console.log('- Initialized:', (persistentFontManager as any).initialized);
    console.log('- Global Style Element:', (persistentFontManager as any).globalStyleElement?.textContent);
    console.log('- CSS Variables on :root:', {
      fontFamily: document.documentElement.style.getPropertyValue('--app-font-family'),
      fontSize: document.documentElement.style.getPropertyValue('--app-font-size')
    });
    console.log('- localStorage:', localStorage.getItem('loop-persistent-fonts'));
  };
  
  (window as any).testFontNavigation = () => {
    console.log('🧪 Testing font navigation persistence...');
    persistentFontManager.updateFontFamily('Gangwon Edu');
    console.log('- Font changed to Gangwon Edu');
    setTimeout(() => {
      (window as any).debugPersistentFontManager();
    }, 1000);
  };
}

export default persistentFontManager;