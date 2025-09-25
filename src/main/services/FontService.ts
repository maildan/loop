/**
 * 🔥 동적 폰트 서비스 - 보안 강화된 버전
 * Path traversal 공격 방지 및 안전한 파일 경로 처리
 */

import { join, resolve, basename, extname } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { Logger } from '../../shared/logger';

export interface FontFile {
  name: string;
  path: string;
  size: number;
  category: string;
  isValid: boolean;
}

export interface FontCategory {
  name: string;
  fonts: FontFile[];
  count: number;
}

export class FontService {
  private static instance: FontService;
  private readonly fontsPath: string;
  private readonly allowedExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
  private readonly maxPathDepth = 3; // 최대 하위 폴더 깊이 제한
  
  private constructor() {
    // 🔥 안전한 경로 구성 - Path traversal 방지
    this.fontsPath = resolve(process.cwd(), 'public', 'fonts');
    Logger.info('FONT_SERVICE', '폰트 서비스 초기화', {
      fontsPath: this.fontsPath,
      exists: existsSync(this.fontsPath)
    });
  }

  public static getInstance(): FontService {
    if (!FontService.instance) {
      FontService.instance = new FontService();
    }
    return FontService.instance;
  }

  /**
   * 🔥 안전한 파일 경로 검증 - Path traversal 공격 방지
   */
  private isPathSafe(filePath: string): boolean {
    try {
      // 절대 경로로 해결
      const absolutePath = resolve(filePath);
      const normalizedFontsPath = resolve(this.fontsPath);
      
      // 폰트 디렉토리 내부에 있는지 확인
      if (!absolutePath.startsWith(normalizedFontsPath)) {
        Logger.warn('FONT_SERVICE', '위험한 파일 경로 차단', { 
          attempted: filePath,
          resolved: absolutePath,
          allowed: normalizedFontsPath 
        });
        return false;
      }

      // 파일 확장자 검증
      const ext = extname(absolutePath).toLowerCase();
      if (!this.allowedExtensions.includes(ext)) {
        Logger.warn('FONT_SERVICE', '허용되지 않은 파일 확장자', { 
          file: basename(absolutePath),
          extension: ext 
        });
        return false;
      }

      // 경로 깊이 제한
      const relativePath = absolutePath.replace(normalizedFontsPath, '');
      const pathDepth = relativePath.split('/').length - 1;
      if (pathDepth > this.maxPathDepth) {
        Logger.warn('FONT_SERVICE', '경로 깊이 초과', { 
          path: relativePath,
          depth: pathDepth,
          maxDepth: this.maxPathDepth 
        });
        return false;
      }

      return true;
    } catch (error) {
      Logger.error('FONT_SERVICE', '파일 경로 검증 실패', error);
      return false;
    }
  }

  /**
   * 🔥 안전한 폰트 파일 목록 조회
   */
  public async getAvailableFonts(): Promise<FontFile[]> {
    try {
      if (!existsSync(this.fontsPath)) {
        Logger.warn('FONT_SERVICE', '폰트 디렉토리가 존재하지 않음', { 
          path: this.fontsPath 
        });
        return [];
      }

      const fonts: FontFile[] = [];
      await this.scanFontsRecursively(this.fontsPath, fonts, 0);

      Logger.info('FONT_SERVICE', '폰트 스캔 완료', { 
        totalFonts: fonts.length,
        validFonts: fonts.filter(f => f.isValid).length 
      });

      return fonts.filter(font => font.isValid);
    } catch (error) {
      Logger.error('FONT_SERVICE', '폰트 목록 조회 실패', error);
      return [];
    }
  }

  /**
   * 🔥 재귀적 폰트 스캔 (깊이 제한 포함)
   */
  private async scanFontsRecursively(
    dirPath: string, 
    fonts: FontFile[], 
    depth: number
  ): Promise<void> {
    if (depth > this.maxPathDepth) {
      Logger.warn('FONT_SERVICE', '최대 스캔 깊이 초과', { 
        path: dirPath,
        depth 
      });
      return;
    }

    try {
      const items = readdirSync(dirPath);

      for (const item of items) {
        const itemPath = join(dirPath, item);
        
        // 안전성 검증
        if (!this.isPathSafe(itemPath)) {
          continue;
        }

        const stats = statSync(itemPath);

        if (stats.isDirectory()) {
          // 하위 디렉토리 재귀 스캔
          await this.scanFontsRecursively(itemPath, fonts, depth + 1);
        } else if (stats.isFile()) {
          // 폰트 파일 처리
          const font = this.createFontFile(itemPath, stats);
          if (font) {
            fonts.push(font);
          }
        }
      }
    } catch (error) {
      Logger.warn('FONT_SERVICE', '디렉토리 스캔 실패', { 
        path: dirPath,
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }

  /**
   * 🔥 폰트 파일 객체 생성
   */
  private createFontFile(filePath: string, stats: any): FontFile | null {
    try {
      const fileName = basename(filePath);
      const ext = extname(fileName).toLowerCase();
      
      // 허용된 확장자만 처리
      if (!this.allowedExtensions.includes(ext)) {
        return null;
      }

      // 카테고리 결정 (디렉토리 기반)
      const relativePath = filePath.replace(this.fontsPath, '');
      const pathParts = relativePath.split('/').filter(Boolean);
      const category = pathParts.length > 1 ? pathParts[0] : 'default';

      return {
        name: fileName,
        path: filePath,
        size: stats.size,
        category: this.sanitizeCategory(category || 'default'),
        isValid: true
      };
    } catch (error) {
      Logger.warn('FONT_SERVICE', '폰트 파일 처리 실패', { 
        path: filePath,
        error: error instanceof Error ? error.message : String(error) 
      });
      return null;
    }
  }

  /**
   * 🔥 카테고리 이름 정제 (XSS 방지)
   */
  private sanitizeCategory(category: string): string {
    return category
      .replace(/[^a-zA-Z0-9가-힣_-]/g, '') // 안전한 문자만 허용
      .substring(0, 50) // 길이 제한
      .trim() || 'default';
  }

  /**
   * 🔥 폰트 카테고리별 그룹화
   */
  public async getFontsByCategory(): Promise<FontCategory[]> {
    try {
      const fonts = await this.getAvailableFonts();
      const categoryMap = new Map<string, FontFile[]>();

      // 카테고리별 그룹화
      fonts.forEach(font => {
        const category = font.category;
        if (!categoryMap.has(category)) {
          categoryMap.set(category, []);
        }
        categoryMap.get(category)!.push(font);
      });

      // FontCategory 객체 배열로 변환
      const categories: FontCategory[] = Array.from(categoryMap.entries()).map(
        ([name, fonts]) => ({
          name,
          fonts,
          count: fonts.length
        })
      );

      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      Logger.error('FONT_SERVICE', '카테고리별 폰트 조회 실패', error);
      return [];
    }
  }

  /**
   * 🔥 특정 폰트 파일 정보 조회 (안전한 방식)
   */
  public async getFontInfo(fontName: string): Promise<FontFile | null> {
    try {
      // 입력값 정제
      const sanitizedName = basename(fontName); // 경로 정보 제거
      
      if (!sanitizedName || sanitizedName.length > 100) {
        Logger.warn('FONT_SERVICE', '잘못된 폰트 이름', { fontName });
        return null;
      }

      const fonts = await this.getAvailableFonts();
      return fonts.find(font => font.name === sanitizedName) || null;
    } catch (error) {
      Logger.error('FONT_SERVICE', '폰트 정보 조회 실패', error);
      return null;
    }
  }

  /**
   * 🔥 폰트 서비스 상태 확인
   */
  public getServiceStatus(): {
    isInitialized: boolean;
    fontsPath: string;
    fontsPathExists: boolean;
    allowedExtensions: string[];
  } {
    return {
      isInitialized: true,
      fontsPath: this.fontsPath,
      fontsPathExists: existsSync(this.fontsPath),
      allowedExtensions: [...this.allowedExtensions]
    };
  }
}
