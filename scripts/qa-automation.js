#!/usr/bin/env ts-node
"use strict";
// 🔥 기가차드 전역 QA 자동화 스크립트 - 11원칙 준수
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * 🔥 QA 자동화 클래스
 */
class QAAutomation {
    constructor() {
        // 🔥 현재 디렉토리 확인 및 올바른 경로 설정
        this.projectRoot = process.cwd();
        this.srcPath = path.join(this.projectRoot, 'src');
        this.results = [];
        
        console.log(`🔍 Current working directory: ${process.cwd()}`);
        console.log(`🔍 Project root: ${this.projectRoot}`);
        console.log(`🔍 Src path: ${this.srcPath}`);
        console.log(`🔍 Renderer path: ${path.join(this.srcPath, 'renderer')}`);
        console.log(`🔍 Renderer exists: ${fs.existsSync(path.join(this.srcPath, 'renderer'))}`);
    }
    /**
     * 🔥 메인 QA 실행
     */
    async runFullQA() {
        console.log('🔥 기가차드 전역 QA 시작!\n');
        try {
            // 1. 마크업 기능 검증 (사용자 요청 우선순위)
            await this.checkMarkupFunctionality();
            // 2. 타입 안전성 체크
            await this.checkTypeScript();
            // 3. 코드 품질 체크
            await this.checkCodeQuality();
            // 4. Electron 특화 체크
            await this.checkElectronSpecific();
            // 5. 성능 및 최적화 체크
            await this.checkPerformance();
            // 6. 보안 체크
            await this.checkSecurity();
            // 7. 접근성 체크
            await this.checkAccessibility();
            // 8. 결과 리포트 생성
            await this.generateReport();
        }
        catch (error) {
            console.error('❌ QA 실행 중 오류:', error);
        }
    }
    /**
     * 🔥 1. TypeScript 타입 안전성 체크
     */
    async checkTypeScript() {
        console.log('🔍 1. TypeScript 타입 안전성 체크...');
        const issues = [];
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
        }
        catch (error) {
            console.error('TypeScript 체크 실패:', error);
        }
    }
    /**
     * 🔥 any 타입 남용 체크
     */
    async checkAnyTypeUsage(issues) {
        const files = await this.getAllTSFiles();
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                // any 타입 사용 패턴 검사 (더 엄격하게)
                const anyPatterns = [
                    { pattern: /:\s*any\s*[;,=}]/, desc: '변수/파라미터에 any 타입' },
                    { pattern: /\(\s*\w+:\s*any\s*\)/, desc: '함수 파라미터에 any 타입' },
                    { pattern: /any\[\]/, desc: 'any 배열 타입' },
                    { pattern: /any\s*=>/, desc: '함수 반환값에 any 타입' },
                    { pattern: /as\s+any/, desc: 'any로 타입 어서션' },
                    { pattern: /<any>/, desc: 'any 제네릭 타입' },
                    { pattern: /Promise<any>/, desc: 'Promise에 any 타입' },
                    { pattern: /Record<string,\s*any>/, desc: 'Record에 any 타입' },
                    { pattern: /commands:\s*any/, desc: 'TipTap commands에 any 타입' },
                ];
                
                anyPatterns.forEach(({ pattern, desc }) => {
                    if (pattern.test(line) && 
                        !line.includes('// @allow-any') && 
                        !line.includes('// eslint-disable-next-line @typescript-eslint/no-explicit-any') &&
                        !file.includes('legacy') && 
                        !file.includes('migration')) {
                        issues.push({
                            file: path.relative(process.cwd(), file),
                            line: index + 1,
                            description: `${desc}: ${line.trim()}`,
                            recommendation: 'any 대신 구체적인 타입을 사용하거나 unknown + 타입 가드를 사용하세요',
                            priority: 'critical' // any 타입을 critical로 변경
                        });
                    }
                });
            });
        }
    }
    /**
     * 🔥 함수 반환 타입 체크
     */
    async checkFunctionReturnTypes(issues) {
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
    async checkCodeQuality() {
        console.log('🔍 2. 코드 품질 체크...');
        const issues = [];
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
        }
        catch (error) {
            console.error('코드 품질 체크 실패:', error);
        }
    }
    /**
     * 🔥 ESLint 실행
     */
    async runESLint(issues) {
        try {
            const { stdout } = await execAsync('npx eslint src --format json');
            const results = JSON.parse(stdout);
            results.forEach((result) => {
                result.messages.forEach((message) => {
                    issues.push({
                        file: path.relative(process.cwd(), result.filePath),
                        line: message.line,
                        description: `${message.ruleId}: ${message.message}`,
                        recommendation: 'ESLint 규칙을 준수하세요',
                        priority: message.severity === 2 ? 'high' : 'medium'
                    });
                });
            });
        }
        catch (error) {
            // ESLint 에러는 무시 (설정되지 않을 수 있음)
            console.log('ESLint 건너뛰기 (설정되지 않음)');
        }
    }
    /**
     * 🔥 중복 코드 체크
     */
    async checkDuplicateCode(issues) {
        const files = await this.getAllTSFiles();
        const codeBlocks = new Map();
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
                    codeBlocks.get(block).push(`${file}:${i + 1}`);
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
    async checkUnusedImports(issues) {
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
    async checkDeadCode(issues) {
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
    async checkElectronSpecific() {
        console.log('🔍 3. Electron 특화 체크...');
        const issues = [];
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
    async checkProcessSeparation(issues) {
        const mainFiles = await this.getFilesInDirectory(path.join(this.srcPath, 'main'));
        const rendererFiles = await this.getFilesInDirectory(path.join(this.srcPath, 'renderer'));
        // Main process에서 DOM 접근 체크 (개선된 로직)
        for (const file of mainFiles) {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                // 🔥 더 정확한 DOM 접근 패턴 체크
                const domPatterns = [
                    /document\./,               // document. 직접 접근
                    /window\.(?!electronAPI)/,  // window. 접근 (electronAPI 제외)
                    /localStorage/,             // localStorage 접근
                    /sessionStorage/,           // sessionStorage 접근
                    /navigator\./,              // navigator 접근
                    /location\./,               // location 접근
                    /history\./,                // history 접근
                ];
                
                // Electron 관련 키워드는 제외
                const isElectronCode = line.includes('BrowserWindow') || 
                                     line.includes('webContents') ||
                                     line.includes('electron') ||
                                     line.includes('import') ||
                                     line.includes('require');
                
                if (!isElectronCode) {
                    domPatterns.forEach(pattern => {
                        if (pattern.test(line)) {
                            issues.push({
                                file: path.relative(process.cwd(), file),
                                line: index + 1,
                                description: 'Main process에서 DOM에 접근하고 있음',
                                recommendation: 'DOM 접근은 Renderer process에서만 해야 합니다',
                                priority: 'critical'
                            });
                        }
                    });
                }
            });
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
    async checkElectronSecurity(issues) {
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
    async checkIPCCommunication(issues) {
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
    async checkPerformance() {
        console.log('🔍 4. 성능 및 최적화 체크...');
        const issues = [];
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
    async checkMemoryLeaks(issues) {
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
    async checkReactPerformance(issues) {
        console.log('⚛️ React 성능 이슈 체크...');
        
        const rendererPath = path.join(this.srcPath, 'renderer');
        
        console.log(`🔍 Checking renderer path: ${rendererPath}`);
        console.log(`🔍 Renderer exists: ${fs.existsSync(rendererPath)}`);
        
        if (!fs.existsSync(rendererPath)) {
            console.log('   ⚠️ Renderer 디렉토리가 없습니다');
            
            // 🔥 대안 경로들 확인
            const alternativePaths = [
                path.join(process.cwd(), 'src', 'renderer'),
                path.join(process.cwd(), 'renderer'),
                path.join(this.projectRoot, 'src', 'renderer')
            ];
            
            for (const altPath of alternativePaths) {
                console.log(`🔍 Alternative path: ${altPath} - exists: ${fs.existsSync(altPath)}`);
                if (fs.existsSync(altPath)) {
                    console.log(`✅ Found renderer at: ${altPath}`);
                    await this.scanDirectoryForReactIssues(altPath, issues);
                    break;
                }
            }
            
            if (issues.length === 0) {
                console.log('   ❌ React 컴포넌트를 찾을 수 없습니다');
                return issues;
            }
        } else {
            await this.scanDirectoryForReactIssues(rendererPath, issues);
        }

        console.log(`   ✅ React 성능 체크 완료: ${issues.length}개 이슈 발견`);
        
        return issues;
    }
    /**
     * 🔥 React 성능 이슈 스캔
     */
    async scanDirectoryForReactIssues(dirPath, issues) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                await this.scanDirectoryForReactIssues(filePath, issues);
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                await this.checkFileForReactIssues(filePath, issues);
            }
        }
    }
    /**
     * 🔥 개별 파일 React 성능 이슈 체크
     */
    async checkFileForReactIssues(filePath, issues) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            const relativePath = path.relative(process.cwd(), filePath);
            // 1. 인라인 객체/함수 생성 체크 (렌더링 최적화)
            this.checkInlineObjectCreation(lines, relativePath, issues);
            // 2. useEffect 의존성 배열 누락 체크
            this.checkUseEffectDependencies(lines, relativePath, issues);
            // 3. 불필요한 useState 리렌더링 체크
            this.checkUnnecessaryStateUpdates(lines, relativePath, issues);
            // 4. 메모이제이션 누락 체크
            this.checkMissingMemoization(lines, relativePath, issues);
            // 5. 비효율적인 조건부 렌더링 체크
            this.checkIneffectiveConditionalRendering(lines, relativePath, issues);
            // 6. 키 프로퍼티 누락 체크
            this.checkMissingKeys(lines, relativePath, issues);
        } catch (error) {
            console.error(`   ❌ 파일 체크 실패 ${filePath}:`, error);
        }
    }
    /**
     * 🔥 인라인 객체/함수 생성 체크
     */
    checkInlineObjectCreation(lines, filePath, issues) {
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            // 인라인 객체 생성 패턴 검출
            const inlineObjectPatterns = [
                /style=\{\{[^}]+\}\}/,          // style={{...}}
                /className=\{[^}]*\{[^}]+\}[^}]*\}/, // className={condition ? {...} : {...}}
                /onClick=\{.*=>\s*{/,          // onClick={() => {...}}
                /onSubmit=\{.*=>\s*{/,        // onSubmit={() => {...}}
                /onChange=\{.*=>\s*{/,        // onChange={() => {...}}
                /\.map\(\([^)]*\)\s*=>\s*</,  // .map(() => <...>)
            ];
            inlineObjectPatterns.forEach(pattern => {
                if (pattern.test(line)) {
                    issues.push({
                        file: filePath,
                        line: lineNum,
                        description: `React 성능 이슈: ${filePath}:${lineNum} - 인라인 객체/함수 생성으로 인한 불필요한 리렌더링`,
                        recommendation: '인라인 객체/함수를 컴포넌트 외부나 useMemo/useCallback으로 최적화하세요',
                        priority: 'medium'
                    });
                }
            });
        });
    }
    /**
     * 🔥 useEffect 의존성 배열 누락 체크
     */
    checkUseEffectDependencies(lines, filePath, issues) {
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            // useEffect without dependency array
            if (/useEffect\s*\([^,]+\)/.test(line) && !line.includes('], [')) {
                issues.push({
                    file: filePath,
                    line: lineNum,
                    description: `React 성능 이슈: ${filePath}:${lineNum} - useEffect 의존성 배열 누락`,
                    recommendation: 'useEffect에 올바른 의존성 배열을 추가하세요',
                    priority: 'high'
                });
            }
            // Empty dependency array with variables used inside
            if (/useEffect\s*\([^,]+,\s*\[\s*\]\s*\)/.test(line)) {
                const nextFewLines = lines.slice(index, index + 10).join(' ');
                if (/\b[a-zA-Z_][a-zA-Z0-9_]*\b/.test(nextFewLines)) {
                    issues.push({
                        file: filePath,
                        line: lineNum,
                        description: `React 성능 이슈: ${filePath}:${lineNum} - useEffect 빈 의존성 배열에도 불구하고 외부 변수 사용`,
                        recommendation: '사용된 변수들을 의존성 배열에 추가하세요',
                        priority: 'high'
                    });
                }
            }
        });
    }
    /**
     * 🔥 불필요한 useState 리렌더링 체크
     */
    checkUnnecessaryStateUpdates(lines, filePath, issues) {
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            // setState with same value patterns
            const problematicPatterns = [
                /setState\([^)]*===.*\?\s*\1\s*:/,     // setState(value === condition ? value : newValue)
                /set\w+\(\w+\)/,                       // setState(state) - same variable
                /set\w+\([^)]*\|\|[^)]*\)/,           // setState(value || value)
            ];
            problematicPatterns.forEach(pattern => {
                if (pattern.test(line)) {
                    issues.push({
                        file: filePath,
                        line: lineNum,
                        description: `React 성능 이슈: ${filePath}:${lineNum} - 불필요한 상태 업데이트로 인한 리렌더링`,
                        recommendation: '상태 업데이트 전에 값이 실제로 변경되었는지 확인하세요',
                        priority: 'medium'
                    });
                }
            });
        });
    }
    /**
     * 🔥 메모이제이션 누락 체크
     */
    checkMissingMemoization(lines, filePath, issues) {
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            // 복잡한 계산이나 객체 생성이 렌더링마다 발생
            const expensiveOperations = [
                /\.filter\(.*\)\.map\(/,               // 체이닝된 배열 메서드
                /\.sort\(/,                            // 정렬 연산
                /new Date\(/,                          // 날짜 객체 생성
                /Object\.keys\(.*\)\.map\(/,           // 객체 키 반복
                /JSON\.parse\(/,                       // JSON 파싱
                /JSON\.stringify\(/,                   // JSON 직렬화
            ];
            expensiveOperations.forEach(pattern => {
                if (pattern.test(line) && !line.includes('useMemo') && !line.includes('useCallback')) {
                    issues.push({
                        file: filePath,
                        line: lineNum,
                        description: `React 성능 이슈: ${filePath}:${lineNum} - 비용이 큰 연산이 메모이제이션 없이 매번 실행`,
                        recommendation: 'useMemo나 useCallback으로 비용이 큰 연산을 메모이제이션하세요',
                        priority: 'medium'
                    });
                }
            });
        });
    }
    /**
     * 🔥 비효율적인 조건부 렌더링 체크
     */
    checkIneffectiveConditionalRendering(lines, filePath, issues) {
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            // 논리 연산자 대신 삼항 연산자 사용으로 인한 불필요한 렌더링
            if (/\?\s*<.*>\s*:\s*null/.test(line) || /\?\s*<.*>\s*:\s*<><\/>/.test(line)) {
                issues.push({
                    file: filePath,
                    line: lineNum,
                    description: `React 성능 이슈: ${filePath}:${lineNum} - 삼항 연산자 대신 논리 연산자 사용 권장`,
                    recommendation: 'condition ? <Component /> : null 대신 condition && <Component />를 사용하세요',
                    priority: 'low'
                });
            }
        });
    }
    /**
     * 🔥 키 프로퍼티 누락 체크
     */
    checkMissingKeys(lines, filePath, issues) {
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            // .map() 사용하지만 key 속성이 없는 경우
            if (/\.map\s*\([^)]*\)\s*.*<[A-Z]/.test(line) && !line.includes('key=')) {
                issues.push({
                    file: filePath,
                    line: lineNum,
                    description: `React 성능 이슈: ${filePath}:${lineNum} - 리스트 렌더링에서 key 속성 누락`,
                    recommendation: '각 리스트 아이템에 고유한 key 속성을 추가하세요',
                    priority: 'high'
                });
            }
        });
    }
    /**
     * 🔥 5. 보안 체크
     */
    async checkSecurity() {
        console.log('🔍 5. 보안 체크...');
        const issues = [];
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
    async checkCodeInjection(issues) {
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
    async checkSensitiveDataExposure(issues) {
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
    async checkFileSystemSecurity(issues) {
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
    async checkAccessibility() {
        console.log('🔍 6. 접근성 체크...');
        const issues = [];
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
    async checkJSXAccessibility(issues) {
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
    async checkKeyboardNavigation(issues) {
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
    async generateReport() {
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
    async getAllTSFiles() {
        return this.getFilesWithExtension('.ts', '.tsx');
    }
    async getFilesWithExtension(...extensions) {
        const files = [];
        const walkDir = (dir) => {
            if (!fs.existsSync(dir))
                return;
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    walkDir(fullPath);
                }
                else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
                    files.push(fullPath);
                }
            });
        };
        walkDir(this.srcPath);
        return files;
    }
    async getFilesInDirectory(dir) {
        if (!fs.existsSync(dir))
            return [];
        const files = [];
        const walkDir = (currentDir) => {
            const items = fs.readdirSync(currentDir);
            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    walkDir(fullPath);
                }
                else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
                    files.push(fullPath);
                }
            });
        };
        walkDir(dir);
        return files;
    }
    extractFileFromError(errorLine) {
        const match = errorLine.match(/^([^(]+)\(/);
        return match ? match[1] : 'unknown';
    }
    extractLineFromError(errorLine) {
        const match = errorLine.match(/\((\d+),\d+\)/);
        return match ? parseInt(match[1]) : 0;
    }
    getFunctionContent(lines, startIndex) {
        let braceCount = 0;
        let content = '';
        for (let i = startIndex; i < lines.length && i < startIndex + 50; i++) {
            const line = lines[i];
            content += line + '\n';
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            if (braceCount === 0 && i > startIndex)
                break;
        }
        return content;
    }
    /**
     * 🔥 무한 루프 체크
     */
    async checkInfiniteLoops(issues) {
        const files = await this.getAllTSFiles();
        
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');
            const relativePath = path.relative(process.cwd(), file);

            lines.forEach((line, index) => {
                const lineNum = index + 1;
                
                // setInterval without clearInterval
                if (/setInterval\s*\(/.test(line) && !content.includes('clearInterval')) {
                    issues.push({
                        file: relativePath,
                        line: lineNum,
                        description: `무한 루프 위험: ${relativePath}:${lineNum}`,
                        recommendation: 'setInterval 사용 시 적절한 cleanup에서 clearInterval을 호출하세요',
                        priority: 'critical'
                    });
                }
                
                // setTimeout without cleanup
                if (/setTimeout\s*\(/.test(line) && !content.includes('clearTimeout')) {
                    issues.push({
                        file: relativePath,
                        line: lineNum,
                        description: `타이머 누수 위험: ${relativePath}:${lineNum}`,
                        recommendation: 'setTimeout 사용 시 컴포넌트 언마운트에서 clearTimeout을 호출하세요',
                        priority: 'medium'
                    });
                }
            });
        }
    }
    /**
     * 🔥 마크업 기능 검증 (사용자 요청 사항)
     */
    async checkMarkupFunctionality() {
        console.log('🔍 마크업 기능 검증...');
        const issues = [];
        
        try {
            // MarkdownEditor.tsx에서 마크업 처리 로직 확인
            const markdownEditorPath = path.join(this.srcPath, 'renderer/components/projects/editor/MarkdownEditor.tsx');
            if (fs.existsSync(markdownEditorPath)) {
                const content = fs.readFileSync(markdownEditorPath, 'utf8');
                
                // 필수 마크업 패턴 확인
                const requiredPatterns = [
                    { pattern: /textBefore === '#'/, name: 'H1 처리' },
                    { pattern: /textBefore === '##'/, name: 'H2 처리' },
                    { pattern: /textBefore === '###'/, name: 'H3 처리' },
                    { pattern: /textBefore === '-'/, name: '불릿 리스트 처리' },
                    { pattern: /\/\^\d\+\\\.\$\/\.test\(textBefore\)/, name: '번호 리스트 처리' },
                    { pattern: /\.setHeading\(\{ level: 1 \}\)/, name: 'H1 명령어' },
                    { pattern: /\.setHeading\(\{ level: 2 \}\)/, name: 'H2 명령어' },
                    { pattern: /\.setHeading\(\{ level: 3 \}\)/, name: 'H3 명령어' },
                    { pattern: /\.toggleBulletList\(\)/, name: '불릿 리스트 명령어' },
                    { pattern: /\.toggleOrderedList\(\)/, name: '번호 리스트 명령어' },
                ];
                
                requiredPatterns.forEach(({ pattern, name }) => {
                    if (!pattern.test(content)) {
                        issues.push({
                            file: 'MarkdownEditor.tsx',
                            line: 0,
                            description: `마크업 기능 누락: ${name}`,
                            recommendation: `${name} 처리 로직을 추가하세요`,
                            priority: 'high'
                        });
                    }
                });
                
                // 에러 처리 확인
                const hasErrorHandling = /try\s*\{[\s\S]*?\}\s*catch\s*\([\s\S]*?\)\s*\{/.test(content);
                if (!hasErrorHandling) {
                    issues.push({
                        file: 'MarkdownEditor.tsx',
                        line: 0,
                        description: 'try-catch 에러 처리가 없습니다',
                        recommendation: '마크업 처리에 에러 처리를 추가하세요',
                        priority: 'medium'
                    });
                }
                
                // setTimeout 사용 확인 (QA 가이드에서 금지)
                const hasSetTimeout = /setTimeout/.test(content);
                if (hasSetTimeout) {
                    issues.push({
                        file: 'MarkdownEditor.tsx',
                        line: 0,
                        description: 'setTimeout 사용 발견 (QA 가이드 위반)',
                        recommendation: '직접적인 동기 명령어 체인을 사용하세요',
                        priority: 'high'
                    });
                }
            }
            
            this.results.push({
                category: '마크업 기능 검증',
                severity: issues.some(i => i.priority === 'high') ? 'high' : 'medium',
                issues,
                score: Math.max(0, 100 - (issues.length * 15))
            });
            
        } catch (error) {
            console.error('마크업 기능 검증 실패:', error);
        }
    }

    // ...existing code...
}

/**
 * 🔥 메인 실행
 */
if (require.main === module) {
    const qa = new QAAutomation();
    qa.runFullQA().catch(console.error);
}
exports.default = QAAutomation;
