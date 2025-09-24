/**
 * 🔄 Font Service Integration Layer
 * Gradual migration from legacy FontService to ModernFontService
 * Maintains compatibility while introducing modern features
 */

import { Logger } from '../../shared/logger';
import { modernFontService } from './FontService.modern';

// Legacy FontService import (for fallback)
import { fontService as legacyFontService } from './FontService';

interface FontServiceInterface {
    initialize(): Promise<any>;
    generateFontFaceCSS(): string;
    getAvailableFonts(): Array<{ value: string; label: string; category: string }>;
    getFontFamily(familyName: string): any;
    reload(): Promise<any>;
    clearCache(): void;
}

class FontServiceIntegration implements FontServiceInterface {
    private static instance: FontServiceIntegration;
    private useModernService = true;
    private isModernServiceReady = false;

    private constructor() {
        // Determine which service to use based on environment
        this.useModernService = this.shouldUseModernService();
    }

    public static getInstance(): FontServiceIntegration {
        if (!FontServiceIntegration.instance) {
            FontServiceIntegration.instance = new FontServiceIntegration();
        }
        return FontServiceIntegration.instance;
    }

    /**
     * 🎯 Determine if modern service should be used
     */
    private shouldUseModernService(): boolean {
        try {
            // Always prefer modern service unless explicitly disabled
            const useModern = process.env.USE_MODERN_FONT_SERVICE !== 'false';
            
            if (useModern) {
                Logger.info('FONT_INTEGRATION', '🚀 Modern font service enabled');
            } else {
                Logger.info('FONT_INTEGRATION', '🔄 Legacy font service enabled (explicit disable)');
            }
            
            return useModern;
        } catch (error) {
            Logger.warn('FONT_INTEGRATION', 'Font service configuration check failed, using modern by default', error);
            return true; // Default to modern service
        }
    }

    /**
     * 🚀 Initialize font service
     */
    public async initialize(): Promise<any> {
        if (this.useModernService) {
            try {
                Logger.info('FONT_INTEGRATION', '🚀 Initializing modern font service');
                const stats = await modernFontService.initialize();
                this.isModernServiceReady = true;
                Logger.info('FONT_INTEGRATION', '✅ Modern font service initialized', stats);
                return stats;
            } catch (error) {
                Logger.error('FONT_INTEGRATION', '❌ Modern font service failed, falling back to legacy', error);
                this.useModernService = false;
                this.isModernServiceReady = false;
            }
        }

        // Fallback to legacy service
        Logger.info('FONT_INTEGRATION', '🔄 Using legacy font service');
        return legacyFontService.initialize();
    }

    /**
     * 🎨 Generate @font-face CSS
     */
    public generateFontFaceCSS(): string {
        if (this.useModernService && this.isModernServiceReady) {
            try {
                const css = modernFontService.generateFontFaceCSS();
                Logger.debug('FONT_INTEGRATION', 'Generated CSS using modern service', { 
                    cssLength: css.length 
                });
                return css;
            } catch (error) {
                Logger.warn('FONT_INTEGRATION', 'Modern CSS generation failed, using legacy', error);
            }
        }

        return legacyFontService.generateFontFaceCSS();
    }

    /**
     * 📋 Get available fonts
     */
    public getAvailableFonts(): Array<{ value: string; label: string; category: string }> {
        if (this.useModernService && this.isModernServiceReady) {
            try {
                const fonts = modernFontService.getAvailableFonts();
                Logger.debug('FONT_INTEGRATION', 'Retrieved fonts using modern service', { 
                    fontCount: fonts.length 
                });
                
                // Modern service returns fonts with reliability info, map to legacy format
                return fonts.map(font => ({
                    value: font.value,
                    label: font.label,
                    category: font.category
                }));
            } catch (error) {
                Logger.warn('FONT_INTEGRATION', 'Modern font retrieval failed, using legacy', error);
            }
        }

        return legacyFontService.getAvailableFonts();
    }

    /**
     * 🔍 Get font family details
     */
    public getFontFamily(familyName: string): any {
        if (this.useModernService && this.isModernServiceReady) {
            try {
                return modernFontService.getFontFamily(familyName);
            } catch (error) {
                Logger.warn('FONT_INTEGRATION', 'Modern font family lookup failed, using legacy', error);
            }
        }

        return legacyFontService.getFontFamily(familyName);
    }

    /**
     * 🔄 Reload font service
     */
    public async reload(): Promise<any> {
        Logger.info('FONT_INTEGRATION', '🔄 Reloading font service');
        
        if (this.useModernService) {
            try {
                const stats = await modernFontService.reload();
                this.isModernServiceReady = true;
                return stats;
            } catch (error) {
                Logger.error('FONT_INTEGRATION', 'Modern service reload failed, falling back', error);
                this.useModernService = false;
                this.isModernServiceReady = false;
            }
        }

        return legacyFontService.reload();
    }

    /**
     * 🧹 Clear cache
     */
    public clearCache(): void {
        Logger.info('FONT_INTEGRATION', '🧹 Clearing font caches');
        
        if (this.useModernService && this.isModernServiceReady) {
            modernFontService.clearCache();
        }
        
        legacyFontService.clearCache();
        this.isModernServiceReady = false;
    }

    /**
     * 📊 Get service status
     */
    public getServiceStatus(): {
        isModern: boolean;
        isReady: boolean;
        blacklistedFonts?: string[];
        stats?: any;
    } {
        const status = {
            isModern: this.useModernService,
            isReady: this.isModernServiceReady
        };

        if (this.useModernService && this.isModernServiceReady) {
            try {
                return {
                    ...status,
                    blacklistedFonts: modernFontService.getBlacklistedFonts(),
                    stats: {
                        families: modernFontService.getAvailableFonts().length
                    }
                };
            } catch (error) {
                Logger.warn('FONT_INTEGRATION', 'Failed to get modern service status', error);
            }
        }

        return status;
    }

    /**
     * 🔧 Force switch to legacy service
     */
    public forceLegacyMode(): void {
        Logger.warn('FONT_INTEGRATION', '⚠️ Forcing legacy font service mode');
        this.useModernService = false;
        this.isModernServiceReady = false;
    }

    /**
     * 🚀 Force switch to modern service
     */
    public async forceModernMode(): Promise<boolean> {
        Logger.info('FONT_INTEGRATION', '🚀 Forcing modern font service mode');
        this.useModernService = true;
        
        try {
            await this.initialize();
            return this.isModernServiceReady;
        } catch (error) {
            Logger.error('FONT_INTEGRATION', 'Failed to force modern mode', error);
            return false;
        }
    }
}

export const fontServiceIntegration = FontServiceIntegration.getInstance();
export default fontServiceIntegration;