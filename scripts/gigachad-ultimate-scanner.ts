#!/usr/bin/env tsx
// 🔥 기가차드 울트라 스캐너 - 펔킹 빠른 프로젝트 분석기

import { promises as fs } from 'fs';
import { join, dirname, relative } from 'path';
import { performance } from 'perf_hooks';

// #DEBUG: Entry point
console.time('GIGACHAD_SCANNER');

// 🔥 기가차드 타입 정의
interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  lines: number;
  functions: string[];
  classes: string[];
  interfaces: string[];
  exports: string[];
  imports: string[];
  duplicates: DuplicatePattern[];
}

interface DuplicatePattern {
  type: 'function' | 'class' | 'interface' | 'constant';
  name: string;
  occurrences: number;
  files: string[];
  similarity: number;
}

interface ScanResult {
  totalFiles: number;
  totalLines: number;
  duplicatePatterns: DuplicatePattern[];
  recommendations: ModularizationRecommendation[];
  performance: {
    scanTime: number;
    filesPerSecond: number;
    linesPerSecond: number;
    memoryUsage: number;
  };
}

interface ModularizationRecommendation {
  action: 'extract' | 'merge' | 'refactor';
  target: string;
  destination: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
}

class GigaChadScanner {
  private files: FileInfo[] = [];
  private patterns: Map<string, DuplicatePattern> = new Map();
  private startTime = performance.now();
  private memoryStart = process.memoryUsage();

  async scanProject(rootPath: string): Promise<ScanResult> {
    // #DEBUG: Starting project scan
    console.log('🔥 GIGACHAD SCANNER STARTING...');
    
    const tsFiles = await this.findTsFiles(rootPath);
    console.log(`📁 Found ${tsFiles.length} TypeScript files`);

    for (const filePath of tsFiles) {
      // #DEBUG: Processing file
      await this.analyzeFile(filePath);
    }

    // #DEBUG: Analysis complete, generating recommendations
    const recommendations = this.generateRecommendations();
    const duplicates = Array.from(this.patterns.values());

    const endTime = performance.now();
    const memoryEnd = process.memoryUsage();
    
    return {
      totalFiles: this.files.length,
      totalLines: this.files.reduce((sum, f) => sum + f.lines, 0),
      duplicatePatterns: duplicates,
      recommendations,
      performance: {
        scanTime: endTime - this.startTime,
        filesPerSecond: this.files.length / ((endTime - this.startTime) / 1000),
        linesPerSecond: this.files.reduce((sum, f) => sum + f.lines, 0) / ((endTime - this.startTime) / 1000),
        memoryUsage: memoryEnd.heapUsed - this.memoryStart.heapUsed,
      }
    };
  }

  private async findTsFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          files.push(...(await this.findTsFiles(fullPath)));
        } else if (entry.isFile() && this.isTsFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Cannot read directory: ${dir}`);
    }
    
    return files;
  }

  private shouldSkipDirectory(name: string): boolean {
    return [
      'node_modules', '.next', '.git', 'dist', 'build', 
      'coverage', '.vscode', '.idea', 'out'
    ].includes(name);
  }

  private isTsFile(name: string): boolean {
    return /\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts');
  }

  private async analyzeFile(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      
      const fileInfo: FileInfo = {
        path: filePath,
        name: relative(process.cwd(), filePath),
        extension: filePath.split('.').pop() || '',
        size: content.length,
        lines: lines.length,
        functions: this.extractFunctions(content),
        classes: this.extractClasses(content),
        interfaces: this.extractInterfaces(content),
        exports: this.extractExports(content),
        imports: this.extractImports(content),
        duplicates: [],
      };

      this.files.push(fileInfo);
      this.analyzePatterns(fileInfo);
      
    } catch (error) {
      console.warn(`⚠️ Cannot analyze file: ${filePath}`);
    }
  }

  private extractFunctions(content: string): string[] {
    const patterns = [
      /function\s+(\w+)/g,
      /const\s+(\w+)\s*=\s*\(/g,
      /(\w+)\s*:\s*\([^)]*\)\s*=>/g,
      /async\s+function\s+(\w+)/g,
      /export\s+function\s+(\w+)/g,
    ];

    const functions: string[] = [];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        functions.push(match[1]);
      }
    }
    
    return [...new Set(functions)];
  }

  private extractClasses(content: string): string[] {
    const pattern = /class\s+(\w+)/g;
    const classes: string[] = [];
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      classes.push(match[1]);
    }
    
    return classes;
  }

  private extractInterfaces(content: string): string[] {
    const pattern = /interface\s+(\w+)/g;
    const interfaces: string[] = [];
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      interfaces.push(match[1]);
    }
    
    return interfaces;
  }

  private extractExports(content: string): string[] {
    const patterns = [
      /export\s+(?:const|let|var|function|class|interface)\s+(\w+)/g,
      /export\s*{\s*([^}]+)\s*}/g,
      /export\s+default\s+(\w+)/g,
    ];

    const exports: string[] = [];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1].includes(',')) {
          exports.push(...match[1].split(',').map(s => s.trim()));
        } else {
          exports.push(match[1]);
        }
      }
    }
    
    return [...new Set(exports)];
  }

  private extractImports(content: string): string[] {
    const patterns = [
      /import\s+{\s*([^}]+)\s*}\s+from/g,
      /import\s+(\w+)\s+from/g,
      /import\s*\*\s*as\s+(\w+)\s+from/g,
    ];

    const imports: string[] = [];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1].includes(',')) {
          imports.push(...match[1].split(',').map(s => s.trim()));
        } else {
          imports.push(match[1]);
        }
      }
    }
    
    return [...new Set(imports)];
  }

  private analyzePatterns(fileInfo: FileInfo): void {
    // 함수 중복 분석
    fileInfo.functions.forEach(func => {
      const key = `function:${func}`;
      if (this.patterns.has(key)) {
        const pattern = this.patterns.get(key)!;
        pattern.occurrences++;
        pattern.files.push(fileInfo.path);
      } else {
        this.patterns.set(key, {
          type: 'function',
          name: func,
          occurrences: 1,
          files: [fileInfo.path],
          similarity: 0.9,
        });
      }
    });

    // 인터페이스 중복 분석
    fileInfo.interfaces.forEach(iface => {
      const key = `interface:${iface}`;
      if (this.patterns.has(key)) {
        const pattern = this.patterns.get(key)!;
        pattern.occurrences++;
        pattern.files.push(fileInfo.path);
      } else {
        this.patterns.set(key, {
          type: 'interface',
          name: iface,
          occurrences: 1,
          files: [fileInfo.path],
          similarity: 0.95,
        });
      }
    });
  }

  private generateRecommendations(): ModularizationRecommendation[] {
    const recommendations: ModularizationRecommendation[] = [];

    // #DEBUG: Generating modularization recommendations
    
    // 중복된 패턴들을 common.ts로 이동 추천
    Array.from(this.patterns.values())
      .filter(pattern => pattern.occurrences > 1)
      .forEach(pattern => {
        recommendations.push({
          action: 'extract',
          target: pattern.name,
          destination: `src/shared/common.ts`,
          reason: `${pattern.name} appears in ${pattern.occurrences} files`,
          impact: pattern.occurrences > 3 ? 'high' : 'medium',
          effort: pattern.type === 'interface' ? 'easy' : 'medium',
        });
      });

    // Logger 패턴 통일 추천
    const needsLogger = this.files.filter(f => 
      f.imports.includes('console') || 
      f.functions.some(fn => fn.includes('log'))
    );

    if (needsLogger.length > 0) {
      recommendations.push({
        action: 'refactor',
        target: 'console.log usage',
        destination: 'Logger system',
        reason: `${needsLogger.length} files using console.log instead of Logger`,
        impact: 'high',
        effort: 'easy',
      });
    }

    // 타입 정의 통합 추천
    const typeFiles = this.files.filter(f => f.interfaces.length > 3);
    if (typeFiles.length > 2) {
      recommendations.push({
        action: 'merge',
        target: 'scattered type definitions',
        destination: 'src/shared/types.ts',
        reason: `Multiple files with many type definitions should be consolidated`,
        impact: 'medium',
        effort: 'medium',
      });
    }

    return recommendations;
  }
}

// 🔥 기가차드 실행부
async function main(): Promise<void> {
  try {
    const scanner = new GigaChadScanner();
    const result = await scanner.scanProject(process.cwd());

    // #DEBUG: Scan complete, generating report
    console.log('\n🔥 GIGACHAD SCAN RESULTS:');
    console.log(`📊 Files: ${result.totalFiles}`);
    console.log(`📏 Lines: ${result.totalLines}`);
    console.log(`⚡ Speed: ${result.performance.filesPerSecond.toFixed(2)} files/sec`);
    console.log(`💾 Memory: ${(result.performance.memoryUsage / 1024 / 1024).toFixed(2)} MB`);

    // 중복 패턴 리포트
    console.log('\n🔍 DUPLICATE PATTERNS:');
    result.duplicatePatterns
      .filter(p => p.occurrences > 1)
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 10)
      .forEach(pattern => {
        console.log(`  ${pattern.type}: ${pattern.name} (${pattern.occurrences}x)`);
      });

    // 추천사항 리포트
    console.log('\n💡 RECOMMENDATIONS:');
    result.recommendations
      .sort((a, b) => a.impact === 'high' ? -1 : 1)
      .forEach(rec => {
        console.log(`  ${rec.action.toUpperCase()}: ${rec.target} → ${rec.destination}`);
        console.log(`    Reason: ${rec.reason}`);
        console.log(`    Impact: ${rec.impact}, Effort: ${rec.effort}\n`);
      });

    // JSON 출력
    await fs.writeFile(
      'gigachad-scan-result.json',
      JSON.stringify(result, null, 2)
    );

    console.log('✅ Report saved to gigachad-scan-result.json');

  } catch (error) {
    console.error('💥 GIGACHAD SCANNER FAILED:', error);
    process.exit(1);
  } finally {
    // #DEBUG: Exit point
    console.timeEnd('GIGACHAD_SCANNER');
  }
}

// #DEBUG: Starting main execution
main().catch(console.error);
