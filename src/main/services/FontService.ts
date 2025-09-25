/**
 * 🔥 동적 폰트 서비스 - 보안 강화된 버전
 * Path traversal 공격 방지 및 안전한 파일 경로 처리
 */

import { join, resolve, basename, extname } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { app } from 'electron';
import { Logger } from '../../shared/logger';

export interface FontFile {
  name: string;
  path: string;
  category: string;
  size: number;
  isValid: boolean;
  family?: string; // 폰트 패밀리명 추가
  weight?: string; // 폰트 굵기 추가
  style?: string; // 폰트 스타일 추가
}

export interface FontFamily {
  name: string; // 디렉토리명 (예: "Gangwon")
  displayName: string; // 표시명 (예: "Gangwon")
  category: string; // 카테고리
  fonts: FontFile[]; // 패밀리 내 폰트 파일들
  count: number; // 폰트 개수
  path: string; // 패밀리 디렉토리 경로
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
    // 🔥 안전한 경로 구성 - 개발/프로덕션 환경 분리
    let fontsPath: string;
    
    try {
      // 먼저 빌드된 폰트 경로 확인 (개발 서버 테스트용)
      const builtFontsPath = resolve(process.cwd(), 'out', 'renderer', 'fonts');
      const publicFontsPath = resolve(process.cwd(), 'public', 'fonts');
      
      if (existsSync(builtFontsPath)) {
        // 빌드된 폰트 경로가 있으면 우선 사용
        fontsPath = builtFontsPath;
        console.log('Using built fonts path:', builtFontsPath);
      } else if (existsSync(publicFontsPath)) {
        // 개발 환경에서 public 폰트 경로 사용
        fontsPath = publicFontsPath;
        console.log('Using public fonts path:', publicFontsPath);
      } else {
        // 프로덕션 패키지 경로
        fontsPath = resolve(process.resourcesPath, 'app', 'out', 'renderer', 'fonts');
        console.log('Using packaged fonts path:', fontsPath);
      }
      
      if (!fontsPath) {
        throw new Error('resolve returned undefined');
      }
    } catch (error) {
      // Fallback 경로 사용
      fontsPath = join(process.cwd(), 'public', 'fonts');
      
      if (!fontsPath) {
        // 최후의 수단
        fontsPath = `${process.cwd()}/public/fonts`;
      }
    }
    
    this.fontsPath = fontsPath;
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
   * 🔥 폰트 경로 getter (public)
   */
  public getFontsPath(): string {
    return this.fontsPath;
  }

  /**
   * 🔥 디렉토리 안전성 검증 - 확장자 검증 제외
   */
  private isDirectorySafe(dirPath: string): boolean {
    try {
      // 절대 경로로 해결
      const absolutePath = resolve(dirPath);
      const normalizedFontsPath = resolve(this.fontsPath);
      
      // 폰트 디렉토리 내부에 있는지 확인
      if (!absolutePath.startsWith(normalizedFontsPath)) {
        Logger.warn('FONT_SERVICE', '위험한 디렉토리 경로 차단', { 
          attempted: dirPath,
          resolved: absolutePath,
          allowed: normalizedFontsPath 
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
      Logger.error('FONT_SERVICE', '디렉토리 경로 검증 실패', error);
      return false;
    }
  }

  /**
   * 🔥 안전한 파일 경로 검증 - Path traversal 공격 방지
   */
  private isPathSafe(filePath: string): boolean {
    try {
      // 먼저 디렉토리 안전성 검사
      if (!this.isDirectorySafe(filePath)) {
        return false;
      }

      return true;
    } catch (error) {
      Logger.error('FONT_SERVICE', '파일 경로 검증 실패', error);
      return false;
    }
  }

  /**
   * 🔥 안전한 폰트 파일 검증 (파일만)
   */
  private isValidFontFile(filePath: string): boolean {
    try {
      // 파일 확장자 검증
      const ext = extname(filePath).toLowerCase();
      if (!this.allowedExtensions.includes(ext)) {
        Logger.warn('FONT_SERVICE', '허용되지 않은 파일 확장자', { 
          file: basename(filePath),
          extension: ext 
        });
        return false;
      }

      return true;
    } catch (error) {
      Logger.error('FONT_SERVICE', '폰트 파일 검증 실패', error);
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
      Logger.warn('FONT_SERVICE', '최대 깊이 초과', { path: dirPath, depth });
      return;
    }

    try {
      const items = readdirSync(dirPath);

      for (const item of items) {
        // 🚫 숨김 파일 및 시스템 파일 필터링 (로그 스팸 방지)
        if (item.startsWith('.') || item === 'Thumbs.db' || item === 'desktop.ini') {
          continue;
        }

        const itemPath = join(dirPath, item);
        
        if (!this.isPathSafe(itemPath)) {
          continue;
        }

        const stats = statSync(itemPath);

        if (stats.isDirectory()) {
          await this.scanFontsRecursively(itemPath, fonts, depth + 1);
        } else if (stats.isFile()) {
          const font = this.createFontFile(itemPath, stats);
          if (font) {
            fonts.push(font);
          }
        }
      }
    } catch (error) {
      Logger.warn('FONT_SERVICE', '디렉토리 스캔 실패', { path: dirPath, error });
    }
  }

  /**
   * 🔥 폰트 파일 객체 생성
   */
  private createFontFile(filePath: string, stats: any): FontFile | null {
    try {
      // 허용된 폰트 파일인지 확인
      if (!this.isValidFontFile(filePath)) {
        return null;
      }

      const fileName = basename(filePath);

      // 카테고리 결정 (디렉토리 기반)
      const relativePath = filePath.replace(this.fontsPath, '');
      const pathParts = relativePath.split('/').filter(Boolean);
      const category = pathParts.length > 1 ? pathParts[0] : 'default';

      // 🔥 파일명에서 weight와 style 추출 시도
      const { weight, style } = this.extractFontProperties(fileName);

      return {
        name: fileName,
        path: filePath,
        size: stats.size,
        category: this.sanitizeCategory(category || 'default'),
        isValid: true,
        weight: weight || '400',
        style: style || 'Regular'
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
   * 🔥 폰트 파일명에서 weight와 style 추출
   */
  private extractFontProperties(fileName: string): { weight: string; style: string } {
    const name = fileName.toLowerCase().replace(/\.(ttf|otf|woff|woff2)$/i, '');
    
    // Weight 패턴 매칭
    const weightMap: { [key: string]: string } = {
      'thin': '100',
      'extralight': '200',
      'ultralight': '200',
      'light': '300',
      'regular': '400',
      'normal': '400',
      'medium': '500',
      'semibold': '600',
      'demibold': '600',
      'bold': '700',
      'extrabold': '800',
      'ultrabold': '800',
      'black': '900',
      'heavy': '900'
    };

    // Style 패턴 매칭
    const styleMap: { [key: string]: string } = {
      'italic': 'Italic',
      'oblique': 'Oblique',
      'regular': 'Regular',
      'normal': 'Regular'
    };

    let weight = '400';
    let style = 'Regular';

    // Weight 찾기
    for (const [pattern, value] of Object.entries(weightMap)) {
      if (name.includes(pattern)) {
        weight = value;
        break;
      }
    }

    // Style 찾기
    for (const [pattern, value] of Object.entries(styleMap)) {
      if (name.includes(pattern)) {
        style = value;
        break;
      }
    }

    return { weight, style };
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
   * 🔥 폰트 패밀리별 그룹화 (fonts/{dir} 구조 지원)
   */
  public async getFontFamilies(): Promise<FontFamily[]> {
    try {
      if (!existsSync(this.fontsPath)) {
        Logger.warn('FONT_SERVICE', '폰트 디렉토리가 존재하지 않음', { 
          path: this.fontsPath 
        });
        return [];
      }

      const families: FontFamily[] = [];
      const items = readdirSync(this.fontsPath);

      for (const item of items) {
        // 숨김 파일 및 시스템 파일 건너뛰기
        if (item.startsWith('.') || item === 'Thumbs.db' || item === 'desktop.ini') {
          continue;
        }

        const itemPath = join(this.fontsPath, item);
        const stats = statSync(itemPath);

        if (stats.isDirectory()) {
          // 디렉토리인 경우 폰트 패밀리로 처리
          const familyFonts: FontFile[] = [];
          await this.scanFontsRecursively(itemPath, familyFonts, 1);
          
          if (familyFonts.length > 0) {
            const category = this.determineCategoryFromName(item);
            families.push({
              name: item,
              displayName: this.formatDisplayName(item),
              category: category,
              fonts: familyFonts.map(font => ({ ...font, family: item })),
              count: familyFonts.length,
              path: itemPath
            });
          }
        } else if (stats.isFile()) {
          // 루트 폴더의 개별 폰트 파일 처리
          const font = this.createFontFile(itemPath, stats);
          if (font) {
            const existingFamily = families.find(f => f.name === 'Individual');
            if (existingFamily) {
              existingFamily.fonts.push({ ...font, family: 'Individual' });
              existingFamily.count++;
            } else {
              families.push({
                name: 'Individual',
                displayName: 'Individual Fonts',
                category: font.category,
                fonts: [{ ...font, family: 'Individual' }],
                count: 1,
                path: this.fontsPath
              });
            }
          }
        }
      }

      Logger.info('FONT_SERVICE', '폰트 패밀리 스캔 완료', { 
        totalFamilies: families.length,
        totalFonts: families.reduce((sum, family) => sum + family.count, 0)
      });

      return families.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } catch (error) {
      Logger.error('FONT_SERVICE', '폰트 패밀리 스캔 실패', error);
      return [];
    }
  }

  /**
   * 🔥 디렉토리명에서 카테고리 결정
   */
  private determineCategoryFromName(dirName: string): string {
    const name = dirName.toLowerCase();
    
    if (name.includes('gangwon') || name.includes('nanum') || name.includes('korean')) {
      return 'korean';
    }
    if (name.includes('noto') && (name.includes('jp') || name.includes('japanese'))) {
      return 'japanese';
    }
    if (name.includes('noto') && (name.includes('kr') || name.includes('korean'))) {
      return 'korean';
    }
    if (name.includes('pretendard')) {
      return name.includes('jp') ? 'japanese' : 'korean';
    }
    if (name.includes('arial') || name.includes('verdana') || name.includes('calibri') || 
        name.includes('times') || name.includes('sf-pro')) {
      return 'english';
    }
    if (name.includes('ms') && (name.includes('gothic') || name.includes('mincho'))) {
      return 'japanese';
    }
    
    return 'system';
  }

  /**
   * 🔥 디렉토리명을 사용자 친화적 표시명으로 변환
   */
  private formatDisplayName(dirName: string): string {
    return dirName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1 $2');
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
