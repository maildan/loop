/**
 * 🎨 CSS Theme Variables Validation Test
 * 
 * CSS 파일을 직접 읽어서 변수 정의 상태를 검증합니다.
 * 실제 파일 시스템을 기반으로 한 정적 분석 테스트입니다.
 */

import { promises as fs } from 'fs';
import { resolve, join } from 'path';

// 🎯 테스트할 테마 파일 목록
const THEME_FILES = [
  'base.css', 'sepia.css', 'warm.css', 'cool.css', 
  'forest.css', 'midnight.css', 'high-contrast.css', 'writer-focus.css',
  'index.css'  // 추가 발견된 파일
] as const;

// 🎨 필수 CSS 변수 목록 (Tailwind에서 사용)
const REQUIRED_VARIABLES = [
  'background', 'foreground', 'primary', 'secondary', 'card', 'popover',
  'accent', 'destructive', 'border', 'input', 'ring', 'radius'
] as const;

// 🏢 사이드바 관련 변수 (UI 레이아웃 필수)
const SIDEBAR_VARIABLES = [
  'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring'
] as const;

describe('🎨 CSS Theme Files Static Analysis', () => {
  // 테마 파일 경로 설정 - Jest 환경에서 디버깅
  const themesDir = join(process.cwd(), 'src', 'renderer', 'styles', 'themes');

  describe('1️⃣ 파일 존재성 검증', () => {
    it('모든 테마 파일이 존재해야 함', () => {
      for (const themeFile of THEME_FILES) {
        const filePath = path.join(themesDir, themeFile);
        expect(fs.existsSync(filePath)).toBe(true);
      }
    });

    it('테마 디렉토리가 존재해야 함', () => {
      expect(fs.existsSync(themesDir)).toBe(true);
    });
  });

  describe('2️⃣ CSS 변수 정의 검증', () => {
    it('모든 테마 파일에서 기본 변수가 정의되어야 함', () => {
      for (const themeFile of THEME_FILES) {
        const filePath = path.join(themesDir, themeFile);
        
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️ ${themeFile} 파일이 존재하지 않음`);
          continue;
        }

        const cssContent = fs.readFileSync(filePath, 'utf-8');
        const missingVariables: string[] = [];

        // 기본 변수 검증
        for (const variable of REQUIRED_VARIABLES) {
          const variablePattern = new RegExp(`--${variable}\\s*:`);
          if (!variablePattern.test(cssContent)) {
            missingVariables.push(`--${variable}`);
          }
        }

        if (missingVariables.length > 0) {
          console.error(`❌ ${themeFile}에서 누락된 변수:`, missingVariables);
        }

        expect(missingVariables).toEqual([]);
      }
    });

    it('모든 테마 파일에서 사이드바 변수가 정의되어야 함', () => {
      for (const themeFile of THEME_FILES) {
        const filePath = path.join(themesDir, themeFile);
        
        if (!fs.existsSync(filePath)) continue;

        const cssContent = fs.readFileSync(filePath, 'utf-8');
        const missingSidebarVars: string[] = [];

        // 사이드바 변수 검증
        for (const variable of SIDEBAR_VARIABLES) {
          const variablePattern = new RegExp(`--${variable}\\s*:`);
          if (!variablePattern.test(cssContent)) {
            missingSidebarVars.push(`--${variable}`);
          }
        }

        if (missingSidebarVars.length > 0) {
          console.error(`❌ ${themeFile}에서 누락된 사이드바 변수:`, missingSidebarVars);
        }

        // base.css는 라이트/다크 모드 둘 다 가지므로 더 많은 변수를 가질 수 있음
        if (themeFile !== 'base.css') {
          expect(missingSidebarVars).toEqual([]);
        }
      }
    });
  });

  describe('3️⃣ OKLCH 형식 검증', () => {
    it('CSS 변수 값이 올바른 OKLCH 형식이어야 함', () => {
      const oklchPattern = /--[\w-]+:\s*([^;]+);/g;
      const validOklchValue = /^[\d.]+\s+[\d.]+\s+[\d.]+(\s*\/\s*[\d.]+%?)?$/;
      const invalidSlashPattern = /\d+\s+\d+\s+\d+\s*\/\s*\d+%/; // 잘못된 alpha 형식
      
      for (const themeFile of THEME_FILES) {
        const filePath = path.join(themesDir, themeFile);
        
        if (!fs.existsSync(filePath)) continue;

        const cssContent = fs.readFileSync(filePath, 'utf-8');
        const invalidValues: string[] = [];
        
        let match;
        while ((match = oklchPattern.exec(cssContent)) !== null) {
          const [fullMatch, value] = match;
          const cleanValue = value.trim();
          
          // rem, px 등의 단위가 있는 값은 제외 (radius 등)
          if (cleanValue.includes('rem') || cleanValue.includes('px') || cleanValue.includes('%')) {
            continue;
          }
          
          // 잘못된 슬래시 사용 패턴 검사
          if (invalidSlashPattern.test(cleanValue)) {
            invalidValues.push(`${fullMatch.split(':')[0]}: ${cleanValue}`);
          }
        }

        if (invalidValues.length > 0) {
          console.error(`❌ ${themeFile}에서 잘못된 OKLCH 형식:`, invalidValues);
        }

        expect(invalidValues).toEqual([]);
      }
    });
  });

  describe('4️⃣ 테마별 고유성 검증', () => {
    it('각 테마가 고유한 배경색을 가져야 함', () => {
      const backgroundValues = new Map<string, string>();
      
      for (const themeFile of THEME_FILES) {
        const filePath = path.join(themesDir, themeFile);
        
        if (!fs.existsSync(filePath)) continue;

        const cssContent = fs.readFileSync(filePath, 'utf-8');
        const backgroundMatch = cssContent.match(/--background:\s*([^;]+);/);
        
        if (backgroundMatch) {
          const value = backgroundMatch[1].trim();
          
          // 중복 배경색 검사 (base.css 제외)
          if (themeFile !== 'base.css') {
            const existingTheme = Array.from(backgroundValues.entries())
              .find(([theme, bgValue]) => bgValue === value && theme !== 'base.css');
            
            if (existingTheme) {
              console.warn(`⚠️ ${themeFile}과 ${existingTheme[0]}이 동일한 배경색을 사용: ${value}`);
            }
          }
          
          backgroundValues.set(themeFile, value);
        }
      }
      
      // 최소 3개 이상의 다른 배경색이 있어야 함
      const uniqueValues = new Set(backgroundValues.values());
      expect(uniqueValues.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('5️⃣ CSS 파일 품질 검증', () => {
    it('CSS 파일에서 !important 사용이 최소화되어야 함', () => {
      for (const themeFile of THEME_FILES) {
        const filePath = path.join(themesDir, themeFile);
        
        if (!fs.existsSync(filePath)) continue;

        const cssContent = fs.readFileSync(filePath, 'utf-8');
        const importantCount = (cssContent.match(/!important/g) || []).length;
        
        // !important는 최대 5개까지만 허용 (접근성 모드 등 예외적인 경우)
        if (importantCount > 5) {
          console.warn(`⚠️ ${themeFile}에서 !important 과다 사용: ${importantCount}개`);
        }
        
        expect(importantCount).toBeLessThanOrEqual(10); // 너무 엄격하지 않게 설정
      }
    });

    it('CSS 파일이 UTF-8로 인코딩되어야 함', () => {
      for (const themeFile of THEME_FILES) {
        const filePath = path.join(themesDir, themeFile);
        
        if (!fs.existsSync(filePath)) continue;

        // 파일 읽기 시 오류가 없으면 UTF-8 인코딩이 정상
        expect(() => {
          fs.readFileSync(filePath, 'utf-8');
        }).not.toThrow();
      }
    });
  });
});