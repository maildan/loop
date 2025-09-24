// Type declarations for opentype.js
declare module 'opentype.js' {
    export function parse(buffer: ArrayBuffer, options?: { lowMemory?: boolean }): Font;
    
    export class Font {
        names: {
            fontFamily?: { en?: string };
            preferredFamily?: { en?: string };
            fullName?: { en?: string };
            fontSubfamily?: { en?: string };
            preferredSubfamily?: { en?: string };
        };
        tables: {
            os2?: {
                usWeightClass?: number;
                fsSelection?: number;
            };
            fvar?: any;
            gvar?: any;
            cmap?: {
                glyphIndexMap?: Record<number, number>;
            };
        };
        numGlyphs: number;
    }
}