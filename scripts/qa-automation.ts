#!/usr/bin/env ts-node
// 🔥 기가차드 전역 QA 자동화 스크립트 - 11원칙 준수

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * 🔥 QA 결과 인터페이스
 */
interface QAResult {
  category: string;
  severity: 'critical' | 'high' | 'medium';
  issues: QAIssue[];
  score: number; // 0-100
}

interface QAIssue {
  file: string;
  line?: number;
  description: string;
  recommendation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * 🔥 QA 자동화 클래스
 */
class QAAutomation {
  private readonly srcPath = path.join(process.cwd(), 'src');
  private readonly results: QAResult[] = [];
  
  /**
   * 🔥 메인 QA 실행
   */
  async runFullQA(): Promise<void> {
    console.log('🔥 기가차드 전역 QA 시작!\n');
    
    try {
      // 1. 타입 안전성 체크
      await this.checkTypeScript();
      
      // 2. 코드 품질 체크
      await this.checkCodeQuality();
      
      // 3. Electron 특화 체크
      await this.checkElectronSpecific();
      
      // 4. 성능 및 최적화 체크
      await this.checkPerformance();
      
      // 5. 보안 체크
      await this.checkSecurity();
      
      // 6. 접근성 체크
      await this.checkAccessibility();
      
      // 7. 결과 리포트 생성
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ QA 실행 중 오류:', error);
    }
  }

  /**
   * 🔥 1. TypeScript 타입 안전성 체크
   */
  private async checkTypeScript(): Promise<void> {
    console.log('🔍 1. TypeScript 타입 안전성 체크...');
    
    const issues: QAIssue[] = [];
    
    try {
      // TypeScript 컴파일 체크
      const { stdout, stderr } = await execAsync('npx tsc --noEmit --pretty');
      
      if (stderr) {
        const lines = stderr.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('error TS')) {
            issues.push({
              file: this.extractFileFromError(line),
              line: this.extractLineFromError(line),
              description: line,
              recommendation: '타입 에러를 수정하세요',
              priority: 'critical'
            });
          }
        });
      }
      
      // any 타입 남용 체크
      await this.checkAnyTypeUsage(issues);
      
      // 함수 반환 타입 체크
      await this.checkFunctionReturnTypes(issues);
      
      this.results.push({
        category: 'TypeScript 타입 안전성',
        severity: issues.some(i => i.priority === 'critical') ? 'critical' : 'medium',
        issues,
        score: Math.max(0, 100 - (issues.length * 10))
      });
      
    } catch (error) {
      console.error('TypeScript 체크 실패:', error);
    }
  }

  /**
   * 🔥 any 타입 남용 체크
   */
  private async checkAnyTypeUsage(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // any 타입 사용 패턴 검사
        const anyPatterns = [
          /:\s*any\s*[;,=}]/,
          /\(\s*\w+:\s*any\s*\)/,
          /any\[\]/,
          /any\s*=>/
        ];
        
        anyPatterns.forEach(pattern => {
          if (pattern.test(line) && !line.includes('// @allow-any')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: `any 타입 사용 발견: ${line.trim()}`,
              recommendation: 'any 대신 구체적인 타입을 사용하거나 unknown + 타입 가드를 사용하세요',
              priority: 'high'
            });
          }
        });
      });
    }
  }

  /**
   * 🔥 함수 반환 타입 체크
   */
  private async checkFunctionReturnTypes(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // 반환 타입이 없는 함수 검사
        const functionPatterns = [
          /(?:function|async\s+function)\s+\w+\s*\([^)]*\)\s*{/,
          /\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*{/,
          /(?:public|private|protected)\s+(?:async\s+)?\w+\s*\([^)]*\)\s*{/
        ];
        
        functionPatterns.forEach(pattern => {
          if (pattern.test(line) && !line.includes(': ') && !line.includes('=> void')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: `함수 반환 타입이 명시되지 않음: ${line.trim()}`,
              recommendation: '함수에 명시적 반환 타입을 추가하세요',
              priority: 'medium'
            });
          }
        });
      });
    }
  }

  /**
   * 🔥 2. 코드 품질 체크
   */
  private async checkCodeQuality(): Promise<void> {
    console.log('🔍 2. 코드 품질 체크...');
    
    const issues: QAIssue[] = [];
    
    try {
      // ESLint 실행
      await this.runESLint(issues);
      
      // 중복 코드 체크
      await this.checkDuplicateCode(issues);
      
      // 사용되지 않는 import 체크
      await this.checkUnusedImports(issues);
      
      // Dead code 체크
      await this.checkDeadCode(issues);
      
      this.results.push({
        category: '코드 품질',
        severity: issues.some(i => i.priority === 'critical') ? 'critical' : 'medium',
        issues,
        score: Math.max(0, 100 - (issues.length * 5))
      });
      
    } catch (error) {
      console.error('코드 품질 체크 실패:', error);
    }
  }

  /**
   * 🔥 ESLint 실행
   */
  private async runESLint(issues: QAIssue[]): Promise<void> {
    try {
      const { stdout } = await execAsync('npx eslint src --format json');
      const results = JSON.parse(stdout);
      
      results.forEach((result: any) => {
        result.messages.forEach((message: any) => {
          issues.push({
            file: path.relative(process.cwd(), result.filePath),
            line: message.line,
            description: `${message.ruleId}: ${message.message}`,
            recommendation: 'ESLint 규칙을 준수하세요',
            priority: message.severity === 2 ? 'high' : 'medium'
          });
        });
      });
    } catch (error) {
      // ESLint 에러는 무시 (설정되지 않을 수 있음)
      console.log('ESLint 건너뛰기 (설정되지 않음)');
    }
  }

  /**
   * 🔥 중복 코드 체크
   */
  private async checkDuplicateCode(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    const codeBlocks = new Map<string, string[]>();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      // 5줄 이상의 코드 블록을 체크
      for (let i = 0; i < lines.length - 4; i++) {
        const block = lines.slice(i, i + 5).join('\n').trim();
        if (block.length > 50 && !block.includes('//') && !block.includes('/*')) {
          if (!codeBlocks.has(block)) {
            codeBlocks.set(block, []);
          }
          codeBlocks.get(block)!.push(`${file}:${i + 1}`);
        }
      }
    }
    
    // 중복 발견 시 이슈 추가
    codeBlocks.forEach((locations, block) => {
      if (locations.length > 1) {
        issues.push({
          file: locations[0].split(':')[0],
          line: parseInt(locations[0].split(':')[1]),
          description: `중복 코드 발견 (${locations.length}곳): ${block.substring(0, 50)}...`,
          recommendation: '중복 코드를 함수나 모듈로 추출하세요',
          priority: 'medium'
        });
      }
    });
  }

  /**
   * 🔥 사용되지 않는 import 체크
   */
  private async checkUnusedImports(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const importMatch = line.match(/import\s+.*?from\s+['"](.+)['"]/);
        if (importMatch) {
          const importPath = importMatch[1];
          const importedItems = line.match(/import\s+{([^}]+)}/);
          
          if (importedItems) {
            const items = importedItems[1].split(',').map(item => item.trim());
            items.forEach(item => {
              // 입력 검증: import 항목이 너무 길거나 위험한 문자 포함 시 스킵
              const trimmedItem = item.trim();
              if (trimmedItem.length > 100 || /[<>{}\\^$|]/.test(trimmedItem)) {
                console.warn(`잠재적으로 위험한 import 항목 감지: ${trimmedItem}`);
                return;
              }
              
              // 안전한 정적 패턴으로 변경
              const escapedItem = trimmedItem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(`\\b${escapedItem}\\b`, 'g');
              const matches = content.match(regex);
              if (!matches || matches.length <= 1) { // import 자체만 있고 사용 안됨
                issues.push({
                  file: path.relative(process.cwd(), file),
                  line: index + 1,
                  description: `사용되지 않는 import: ${item}`,
                  recommendation: '사용되지 않는 import를 제거하세요',
                  priority: 'low'
                });
              }
            });
          }
        }
      });
    }
  }

  /**
   * 🔥 Dead code 체크
   */
  private async checkDeadCode(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // 도달할 수 없는 코드 패턴
        if (line.includes('return') && index < lines.length - 1) {
          const nextLine = lines[index + 1].trim();
          if (nextLine && !nextLine.startsWith('}') && !nextLine.startsWith('//')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 2,
              description: `return 이후 도달할 수 없는 코드: ${nextLine}`,
              recommendation: 'return 이후의 코드를 제거하거나 구조를 변경하세요',
              priority: 'medium'
            });
          }
        }
      });
    }
  }

  /**
   * 🔥 3. Electron 특화 체크
   */
  private async checkElectronSpecific(): Promise<void> {
    console.log('🔍 3. Electron 특화 체크...');
    
    const issues: QAIssue[] = [];
    
    // 프로세스 분리 체크
    await this.checkProcessSeparation(issues);
    
    // 보안 설정 체크
    await this.checkElectronSecurity(issues);
    
    // IPC 통신 체크
    await this.checkIPCCommunication(issues);
    
    this.results.push({
      category: 'Electron 특화',
      severity: issues.some(i => i.priority === 'critical') ? 'critical' : 'medium',
      issues,
      score: Math.max(0, 100 - (issues.length * 15))
    });
  }

  /**
   * 🔥 프로세스 분리 체크
   */
  private async checkProcessSeparation(issues: QAIssue[]): Promise<void> {
    const mainFiles = await this.getFilesInDirectory(path.join(this.srcPath, 'main'));
    const rendererFiles = await this.getFilesInDirectory(path.join(this.srcPath, 'renderer'));
    
    // Main process에서 DOM 접근 체크
    for (const file of mainFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('document.') || content.includes('window.')) {
        issues.push({
          file: path.relative(process.cwd(), file),
          description: 'Main process에서 DOM에 접근하고 있음',
          recommendation: 'DOM 접근은 Renderer process에서만 해야 합니다',
          priority: 'critical'
        });
      }
    }
    
    // Renderer process에서 Node.js API 직접 접근 체크
    for (const file of rendererFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const nodePatterns = [
        /require\(['"]fs['"]\)/,
        /require\(['"]path['"]\)/,
        /require\(['"]os['"]\)/,
        /import.*from ['"]fs['"]/,
        /import.*from ['"]path['"]/,
        /import.*from ['"]os['"]/
      ];
      
      nodePatterns.forEach(pattern => {
        if (pattern.test(content)) {
          issues.push({
            file: path.relative(process.cwd(), file),
            description: 'Renderer process에서 Node.js API에 직접 접근',
            recommendation: 'Node.js API는 preload script나 IPC를 통해 접근하세요',
            priority: 'critical'
          });
        }
      });
    }
  }

  /**
   * 🔥 Electron 보안 설정 체크
   */
  private async checkElectronSecurity(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // contextIsolation 체크
      if (content.includes('new BrowserWindow') && 
          !content.includes('contextIsolation: true')) {
        issues.push({
          file: path.relative(process.cwd(), file),
          description: 'BrowserWindow에서 contextIsolation이 활성화되지 않음',
          recommendation: 'contextIsolation: true를 설정하세요',
          priority: 'critical'
        });
      }
      
      // nodeIntegration 체크
      if (content.includes('nodeIntegration: true')) {
        issues.push({
          file: path.relative(process.cwd(), file),
          description: 'nodeIntegration이 활성화되어 있음',
          recommendation: 'nodeIntegration: false로 설정하세요',
          priority: 'critical'
        });
      }
      
      // remote 모듈 사용 체크
      if (content.includes('remote.')) {
        issues.push({
          file: path.relative(process.cwd(), file),
          description: 'deprecated된 remote 모듈 사용',
          recommendation: 'remote 모듈 대신 IPC 통신을 사용하세요',
          priority: 'high'
        });
      }
    }
  }

  /**
   * 🔥 IPC 통신 체크
   */
  private async checkIPCCommunication(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // 에러 처리 없는 IPC 호출 체크
        if ((line.includes('ipcRenderer.invoke') || line.includes('ipcMain.handle')) &&
            !lines[index + 1]?.includes('catch') &&
            !lines[index - 1]?.includes('try')) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: 'IPC 호출에 에러 처리가 없음',
            recommendation: 'IPC 호출에 try-catch나 .catch()를 추가하세요',
            priority: 'high'
          });
        }
      });
    }
  }

  /**
   * 🔥 4. 성능 및 최적화 체크
   */
  private async checkPerformance(): Promise<void> {
    console.log('🔍 4. 성능 및 최적화 체크...');
    
    const issues: QAIssue[] = [];
    
    // 메모리 누수 체크
    await this.checkMemoryLeaks(issues);
    
    // React 성능 체크
    await this.checkReactPerformance(issues);
    
    // 무한 루프 체크
    await this.checkInfiniteLoops(issues);
    
    this.results.push({
      category: '성능 및 최적화',
      severity: issues.some(i => i.priority === 'critical') ? 'critical' : 'medium',
      issues,
      score: Math.max(0, 100 - (issues.length * 10))
    });
  }

  /**
   * 🔥 메모리 누수 체크
   */
  private async checkMemoryLeaks(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // setInterval without clearInterval
        if (line.includes('setInterval') || line.includes('setTimeout')) {
          const functionContent = this.getFunctionContent(lines, index);
          if (!functionContent.includes('clearInterval') && 
              !functionContent.includes('clearTimeout')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: 'setInterval/setTimeout 사용 시 정리 함수가 없음',
              recommendation: 'clearInterval/clearTimeout를 사용하여 정리하세요',
              priority: 'high'
            });
          }
        }
        
        // addEventListener without removeEventListener
        if (line.includes('addEventListener')) {
          const functionContent = this.getFunctionContent(lines, index);
          if (!functionContent.includes('removeEventListener')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: 'addEventListener 사용 시 removeEventListener가 없음',
              recommendation: 'removeEventListener를 사용하여 정리하세요',
              priority: 'high'
            });
          }
        }
      });
    }
  }

  /**
   * 🔥 React 성능 체크
   */
  private async checkReactPerformance(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // useEffect 의존성 배열 체크
        if (line.includes('useEffect') && index < lines.length - 1) {
          const nextLines = lines.slice(index, index + 10).join('\n');
          if (!nextLines.includes('], [') && !nextLines.includes('], []')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: 'useEffect에 의존성 배열이 없음',
              recommendation: 'useEffect에 의존성 배열을 추가하세요',
              priority: 'medium'
            });
          }
        }
        
        // 인라인 객체 생성 체크
        if (line.includes('style={{') || line.includes('props={{')) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: '인라인 객체 생성으로 인한 불필요한 리렌더링',
            recommendation: '객체를 컴포넌트 외부에서 생성하거나 useMemo를 사용하세요',
            priority: 'medium'
          });
        }
      });
    }
  }

  /**
   * 🔥 무한 루프 체크
   */
  private async checkInfiniteLoops(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // setInterval과 setTimeout이 조건 없이 반복되는 패턴
        if (line.includes('setInterval') && !line.includes('clearInterval')) {
          const intervalContent = this.getFunctionContent(lines, index);
          if (!intervalContent.includes('if') && !intervalContent.includes('condition')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: '조건 없는 setInterval로 인한 무한 루프 위험',
              recommendation: '종료 조건을 추가하거나 clearInterval을 사용하세요',
              priority: 'critical'
            });
          }
        }
      });
    }
  }

  /**
   * 🔥 5. 보안 체크
   */
  private async checkSecurity(): Promise<void> {
    console.log('🔍 5. 보안 체크...');
    
    const issues: QAIssue[] = [];
    
    // 코드 인젝션 체크
    await this.checkCodeInjection(issues);
    
    // 민감한 정보 노출 체크
    await this.checkSensitiveDataExposure(issues);
    
    // 파일 시스템 보안 체크
    await this.checkFileSystemSecurity(issues);
    
    this.results.push({
      category: '보안',
      severity: issues.some(i => i.priority === 'critical') ? 'critical' : 'medium',
      issues,
      score: Math.max(0, 100 - (issues.length * 20))
    });
  }

  /**
   * 🔥 코드 인젝션 체크
   */
  private async checkCodeInjection(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // eval() 사용 체크
        if (line.includes('eval(')) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: 'eval() 함수 사용으로 인한 코드 인젝션 위험',
            recommendation: 'eval() 대신 안전한 대안을 사용하세요',
            priority: 'critical'
          });
        }
        
        // innerHTML 사용 체크
        if (line.includes('innerHTML')) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: 'innerHTML 사용으로 인한 XSS 위험',
            recommendation: 'innerHTML 대신 textContent나 안전한 DOM 조작을 사용하세요',
            priority: 'high'
          });
        }
        
        // new Function() 체크
        if (line.includes('new Function(')) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: 'new Function() 사용으로 인한 코드 인젝션 위험',
            recommendation: 'new Function() 대신 안전한 대안을 사용하세요',
            priority: 'critical'
          });
        }
      });
    }
  }

  /**
   * 🔥 민감한 정보 노출 체크
   */
  private async checkSensitiveDataExposure(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // API 키, 패스워드 하드코딩 체크
        const sensitivePatterns = [
          /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
          /password\s*[:=]\s*['"][^'"]+['"]/i,
          /secret\s*[:=]\s*['"][^'"]+['"]/i,
          /token\s*[:=]\s*['"][^'"]+['"]/i,
          /access[_-]?key\s*[:=]\s*['"][^'"]+['"]/i
        ];
        
        sensitivePatterns.forEach(pattern => {
          if (pattern.test(line) && !line.includes('process.env')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: '민감한 정보가 하드코딩되어 있음',
              recommendation: '환경변수를 사용하여 민감한 정보를 관리하세요',
              priority: 'critical'
            });
          }
        });
        
        // console.log에 민감한 정보 체크
        if (line.includes('console.log') && 
            (line.includes('password') || line.includes('token') || line.includes('key'))) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: 'console.log에 민감한 정보가 출력될 수 있음',
            recommendation: '민감한 정보는 로그에 출력하지 마세요',
            priority: 'high'
          });
        }
      });
    }
  }

  /**
   * 🔥 파일 시스템 보안 체크
   */
  private async checkFileSystemSecurity(issues: QAIssue[]): Promise<void> {
    const files = await this.getAllTSFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Path traversal 공격 가능성 체크
        if (line.includes('path.join') || line.includes('fs.readFile')) {
          if (line.includes('..') || line.includes('../')) {
            issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              description: 'Path traversal 공격 가능성',
              recommendation: '사용자 입력을 파일 경로에 직접 사용하지 마세요',
              priority: 'high'
            });
          }
        }
      });
    }
  }

  /**
   * 🔥 6. 접근성 체크
   */
  private async checkAccessibility(): Promise<void> {
    console.log('🔍 6. 접근성 체크...');
    
    const issues: QAIssue[] = [];
    
    // JSX 접근성 체크
    await this.checkJSXAccessibility(issues);
    
    // 키보드 내비게이션 체크
    await this.checkKeyboardNavigation(issues);
    
    this.results.push({
      category: '접근성',
      severity: issues.some(i => i.priority === 'critical') ? 'critical' : 'medium',
      issues,
      score: Math.max(0, 100 - (issues.length * 5))
    });
  }

  /**
   * 🔥 JSX 접근성 체크
   */
  private async checkJSXAccessibility(issues: QAIssue[]): Promise<void> {
    const files = await this.getFilesWithExtension('.tsx');
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // img 태그에 alt 속성 체크
        if (line.includes('<img') && !line.includes('alt=')) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: 'img 태그에 alt 속성이 없음',
            recommendation: 'img 태그에 적절한 alt 속성을 추가하세요',
            priority: 'medium'
          });
        }
        
        // button에 aria-label 체크
        if (line.includes('<button') && !line.includes('aria-label') && !line.includes('>')) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: 'button에 텍스트나 aria-label이 없을 수 있음',
            recommendation: 'button에 적절한 텍스트나 aria-label을 추가하세요',
            priority: 'medium'
          });
        }
      });
    }
  }

  /**
   * 🔥 키보드 내비게이션 체크
   */
  private async checkKeyboardNavigation(issues: QAIssue[]): Promise<void> {
    const files = await this.getFilesWithExtension('.tsx');
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // onClick이 있지만 onKeyDown이 없는 요소
        if (line.includes('onClick') && !content.includes('onKeyDown') && 
            (line.includes('<div') || line.includes('<span'))) {
          issues.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            description: '클릭 가능한 요소에 키보드 이벤트 핸들러가 없음',
            recommendation: 'onKeyDown 이벤트 핸들러를 추가하거나 button 태그를 사용하세요',
            priority: 'medium'
          });
        }
      });
    }
  }

  /**
   * 🔥 7. 결과 리포트 생성
   */
  private async generateReport(): Promise<void> {
    console.log('\n🔥 QA 결과 리포트 생성 중...\n');
    
    // 총점 계산
    const totalScore = this.results.reduce((sum, result) => sum + result.score, 0) / this.results.length;
    const totalIssues = this.results.reduce((sum, result) => sum + result.issues.length, 0);
    
    // 우선순위별 이슈 집계
    const criticalIssues = this.results.flatMap(r => r.issues.filter(i => i.priority === 'critical'));
    const highIssues = this.results.flatMap(r => r.issues.filter(i => i.priority === 'high'));
    const mediumIssues = this.results.flatMap(r => r.issues.filter(i => i.priority === 'medium'));
    
    // 콘솔 출력
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔥 기가차드 Loop 프로젝트 QA 결과 리포트');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 전체 점수: ${totalScore.toFixed(1)}/100`);
    console.log(`🔍 총 이슈 수: ${totalIssues}개`);
    console.log('');
    console.log('🎯 우선순위별 이슈:');
    console.log(`  🔴 Critical: ${criticalIssues.length}개`);
    console.log(`  🟡 High: ${highIssues.length}개`);
    console.log(`  🟢 Medium: ${mediumIssues.length}개`);
    console.log('');
    
    // 카테고리별 결과
    this.results.forEach(result => {
      const emoji = result.severity === 'critical' ? '🔴' : 
                   result.severity === 'high' ? '🟡' : '🟢';
      console.log(`${emoji} ${result.category}: ${result.score.toFixed(1)}/100 (${result.issues.length}개 이슈)`);
    });
    
    console.log('');
    console.log('🔥 상위 10개 Critical/High 이슈:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const topIssues = [...criticalIssues, ...highIssues].slice(0, 10);
    topIssues.forEach((issue, index) => {
      const priority = issue.priority === 'critical' ? '🔴' : '🟡';
      console.log(`${index + 1}. ${priority} ${issue.file}:${issue.line || '?'}`);
      console.log(`   📝 ${issue.description}`);
      console.log(`   💡 ${issue.recommendation}`);
      console.log('');
    });
    
    // 파일로 저장
    const reportData = {
      timestamp: new Date().toISOString(),
      totalScore,
      totalIssues,
      summary: {
        critical: criticalIssues.length,
        high: highIssues.length,
        medium: mediumIssues.length,
        low: this.results.flatMap(r => r.issues.filter(i => i.priority === 'low')).length
      },
      categories: this.results,
      topIssues
    };
    
    const reportPath = path.join(process.cwd(), 'qa-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`📄 상세 리포트가 저장되었습니다: ${reportPath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * 🔥 유틸리티 메서드들
   */
  private async getAllTSFiles(): Promise<string[]> {
    return this.getFilesWithExtension('.ts', '.tsx');
  }

  private async getFilesWithExtension(...extensions: string[]): Promise<string[]> {
    const files: string[] = [];
    
    const walkDir = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walkDir(fullPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      });
    };
    
    walkDir(this.srcPath);
    return files;
  }

  private async getFilesInDirectory(dir: string): Promise<string[]> {
    if (!fs.existsSync(dir)) return [];
    
    const files: string[] = [];
    const walkDir = (currentDir: string) => {
      const items = fs.readdirSync(currentDir);
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      });
    };
    
    walkDir(dir);
    return files;
  }

  private extractFileFromError(errorLine: string): string {
    const match = errorLine.match(/^([^(]+)\(/);
    return match ? match[1] : 'unknown';
  }

  private extractLineFromError(errorLine: string): number {
    const match = errorLine.match(/\((\d+),\d+\)/);
    return match ? parseInt(match[1]) : 0;
  }

  private getFunctionContent(lines: string[], startIndex: number): string {
    let braceCount = 0;
    let content = '';
    
    for (let i = startIndex; i < lines.length && i < startIndex + 50; i++) {
      const line = lines[i];
      content += line + '\n';
      
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      if (braceCount === 0 && i > startIndex) break;
    }
    
    return content;
  }
}

/**
 * 🔥 메인 실행
 */
if (require.main === module) {
  const qa = new QAAutomation();
  qa.runFullQA().catch(console.error);
}

export default QAAutomation;
