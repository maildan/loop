/**
 * 🎨 CSS Theme Files Simple Validation Test
 * 
 * Jest 환경 문제 없이 작동하는 간단한 CSS 테마 검증 테스트
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// 🎯 테스트할 테마 파일 목록
const THEME_FILES = [
  'base.css', 'sepia.css', 'warm.css', 'cool.css', 
  'forest.css', 'midnight.css', 'high-contrast.css', 'writer-focus.css',
  'index.css'
] as const;

// 🎨 필수 CSS 변수 목록 (핵심 변수만 검증)
const REQUIRED_VARIABLES = [
  'background', 'foreground', 'primary', 'secondary', 
  'card', 'border', 'input'
] as const;

// 🏢 사이드바 관련 변수
const SIDEBAR_VARIABLES = [
  'sidebar', 'sidebar-foreground', 'sidebar-primary'
] as const;

describe('🎨 CSS Theme Files Simple Validation', () => {
  const themesDir = join(process.cwd(), 'src', 'renderer', 'styles', 'themes');
  
  // 헬퍼 함수: 파일 내용 안전하게 읽기
  const readThemeFile = (fileName: string): string | null => {
    try {
      const filePath = join(themesDir, fileName);
      if (!existsSync(filePath)) {
        console.warn(`⚠️ ${fileName} 파일이 존재하지 않음: ${filePath}`);
        return null;
      }
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`❌ ${fileName} 읽기 실패:`, error);
      return null;
    }
  };

  // 헬퍼 함수: CSS 변수 추출
  const extractCSSVariables = (cssContent: string): Set<string> => {
    const variableRegex = /--([a-zA-Z0-9-_]+)\s*:/g;
    const variables = new Set<string>();
    let match;
    
    while ((match = variableRegex.exec(cssContent)) !== null) {
      variables.add(match[1]);
    }
    
    return variables;
  };

  describe('1️⃣ 파일 존재성 검증', () => {
    it('base.css (핵심 파일)이 존재해야 함', () => {
      const content = readThemeFile('base.css');
      expect(content).not.toBeNull();
      expect(content!.length).toBeGreaterThan(100); // 최소한의 내용이 있어야 함
    });

    it('최소 5개 이상의 테마 파일이 존재해야 함', () => {
      const existingFiles = THEME_FILES.filter(file => readThemeFile(file) !== null);
      expect(existingFiles.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('2️⃣ CSS 변수 정의 검증', () => {
    it('base.css에 필수 변수들이 정의되어야 함', () => {
      const content = readThemeFile('base.css');
      expect(content).not.toBeNull();
      
      const variables = extractCSSVariables(content!);
      
      for (const requiredVar of REQUIRED_VARIABLES) {
        expect(variables.has(requiredVar)).toBe(true);
      }
    });

    it('base.css에 사이드바 변수들이 정의되어야 함', () => {
      const content = readThemeFile('base.css');
      expect(content).not.toBeNull();
      
      const variables = extractCSSVariables(content!);
      
      for (const sidebarVar of SIDEBAR_VARIABLES) {
        expect(variables.has(sidebarVar)).toBe(true);
      }
    });
  });

  describe('3️⃣ OKLCH 형식 검증', () => {
    it('CSS 변수 값이 OKLCH 형식이어야 함', () => {
      const content = readThemeFile('base.css');
      expect(content).not.toBeNull();
      
      // OKLCH 형식: 숫자 공백 숫자 공백 숫자 패턴 검증
      const oklchPattern = /--[a-zA-Z0-9-_]+\s*:\s*([0-9.]+\s+[0-9.]+\s+[0-9.]+)/g;
      const matches = [...content!.matchAll(oklchPattern)];
      
      expect(matches.length).toBeGreaterThan(5); // 최소 5개 이상의 OKLCH 값
      
      // 각 값이 올바른 OKLCH 범위에 있는지 확인
      matches.forEach(match => {
        const [l, c, h] = match[1].split(/\s+/).map(Number);
        expect(l).toBeGreaterThanOrEqual(0);
        expect(l).toBeLessThanOrEqual(1);
        expect(c).toBeGreaterThanOrEqual(0);
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThanOrEqual(360);
      });
    });
  });

  describe('4️⃣ 테마별 고유성 검증', () => {
    it('각 테마가 서로 다른 배경색을 가져야 함', () => {
      const backgroundValues = new Map<string, string>();
      
      for (const themeFile of THEME_FILES) {
        const content = readThemeFile(themeFile);
        if (!content) continue;
        
        // --background 변수 값 추출
        const backgroundMatch = content.match(/--background\s*:\s*([^;]+)/);
        if (backgroundMatch) {
          const bgValue = backgroundMatch[1].trim();
          backgroundValues.set(themeFile, bgValue);
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
        const content = readThemeFile(themeFile);
        if (!content) continue;
        
        const importantCount = (content.match(/!important/g) || []).length;
        expect(importantCount).toBeLessThanOrEqual(2); // 최대 2개까지 허용
      }
    });

    it('CSS 파일이 올바른 구조를 가져야 함', () => {
      const content = readThemeFile('base.css');
      expect(content).not.toBeNull();
      
      // :root 선택자가 있어야 함
      expect(content!).toMatch(/:root\s*\{/);
      
      // 다크모드 선택자도 있어야 함 (보통 .dark나 [data-theme="dark"])
      expect(content!).toMatch(/(\[data-theme="dark"\]|\.dark)/);
    });
  });
});