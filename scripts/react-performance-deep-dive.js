#!/usr/bin/env node

// 🔥 기가차드 React 성능 Deep Dive 스크립트

const fs = require('fs');
const path = require('path');

class ReactPerformanceAnalyzer {
    constructor() {
        this.srcPath = path.join(process.cwd(), 'src', 'renderer');
        this.results = [];
    }

    /**
     * 🔥 React 성능 Deep Dive 실행
     */
    async runAnalysis() {
        console.log('🔥 기가차드 React 성능 Deep Dive 시작!\n');
        
        if (!fs.existsSync(this.srcPath)) {
            console.log('❌ Renderer 디렉토리를 찾을 수 없습니다');
            return;
        }

        await this.scanDirectory(this.srcPath);
        await this.generateDetailedReport();
    }

    /**
     * 🔥 디렉토리 스캔
     */
    async scanDirectory(dirPath) {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                await this.scanDirectory(filePath);
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                await this.analyzeFile(filePath);
            }
        }
    }

    /**
     * 🔥 개별 파일 분석
     */
    async analyzeFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            const relativePath = path.relative(process.cwd(), filePath);

            const fileAnalysis = {
                file: relativePath,
                issues: [],
                score: 100
            };

            // 1. 인라인 객체/함수 체크
            this.checkInlineObjects(lines, fileAnalysis);
            
            // 2. useEffect 의존성 체크
            this.checkUseEffectDeps(lines, fileAnalysis);
            
            // 3. 불필요한 리렌더링 체크
            this.checkUnnecessaryRerenders(lines, fileAnalysis);
            
            // 4. 메모이제이션 기회 체크
            this.checkMemoizationOpportunities(lines, fileAnalysis);
            
            // 5. 조건부 렌더링 최적화 체크
            this.checkConditionalRendering(lines, fileAnalysis);

            // 6. 컴포넌트 구조 최적화 체크
            this.checkComponentStructure(content, fileAnalysis);

            if (fileAnalysis.issues.length > 0) {
                fileAnalysis.score = Math.max(0, 100 - (fileAnalysis.issues.length * 5));
                this.results.push(fileAnalysis);
            }

        } catch (error) {
            console.error(`❌ 파일 분석 실패 ${filePath}:`, error.message);
        }
    }

    /**
     * 🔥 인라인 객체/함수 체크
     */
    checkInlineObjects(lines, fileAnalysis) {
        const patterns = [
            { 
                regex: /style=\{\{[^}]+\}\}/, 
                message: '인라인 스타일 객체 사용',
                suggestion: 'COMPONENT_STYLES 상수로 분리하거나 useMemo 사용'
            },
            {
                regex: /onClick=\{.*=>\s*/, 
                message: '인라인 이벤트 핸들러',
                suggestion: 'useCallback으로 메모이제이션하거나 컴포넌트 외부로 분리'
            },
            {
                regex: /onChange=\{.*=>\s*/, 
                message: '인라인 변경 핸들러',
                suggestion: 'useCallback으로 메모이제이션'
            },
            {
                regex: /className=\{.*\?.*:.*\}/, 
                message: '조건부 className 인라인 생성',
                suggestion: 'clsx/cn 유틸리티와 미리 정의된 클래스 사용'
            }
        ];

        lines.forEach((line, index) => {
            patterns.forEach(pattern => {
                if (pattern.regex.test(line)) {
                    fileAnalysis.issues.push({
                        line: index + 1,
                        type: 'inline-object',
                        severity: 'medium',
                        message: pattern.message,
                        suggestion: pattern.suggestion,
                        code: line.trim()
                    });
                }
            });
        });
    }

    /**
     * 🔥 useEffect 의존성 체크
     */
    checkUseEffectDeps(lines, fileAnalysis) {
        lines.forEach((line, index) => {
            // useEffect without dependencies
            if (/useEffect\s*\([^,]+\)\s*;?$/.test(line.trim())) {
                fileAnalysis.issues.push({
                    line: index + 1,
                    type: 'missing-deps',
                    severity: 'high',
                    message: 'useEffect에 의존성 배열이 없어 매 렌더링마다 실행',
                    suggestion: '의존성 배열을 추가하거나 빈 배열 []을 사용',
                    code: line.trim()
                });
            }

            // useEffect with empty deps but using external vars
            if (/useEffect\s*\([^,]+,\s*\[\s*\]\s*\)/.test(line)) {
                const effectContent = this.getEffectContent(lines, index);
                const externalVars = this.findExternalVariables(effectContent);
                
                if (externalVars.length > 0) {
                    fileAnalysis.issues.push({
                        line: index + 1,
                        type: 'incorrect-deps',
                        severity: 'high',
                        message: `useEffect가 외부 변수 사용하지만 의존성에 없음: ${externalVars.join(', ')}`,
                        suggestion: '사용된 변수들을 의존성 배열에 추가',
                        code: line.trim()
                    });
                }
            }
        });
    }

    /**
     * 🔥 불필요한 리렌더링 체크
     */
    checkUnnecessaryRerenders(lines, fileAnalysis) {
        lines.forEach((line, index) => {
            // 동일한 값으로 setState
            if (/set\w+\(\w+\)/.test(line) && line.includes('useState')) {
                fileAnalysis.issues.push({
                    line: index + 1,
                    type: 'unnecessary-update',
                    severity: 'medium',
                    message: '동일한 값으로 상태 업데이트 가능성',
                    suggestion: '상태 업데이트 전에 값 비교 추가',
                    code: line.trim()
                });
            }

            // Object.assign이나 spread 연산자로 객체 업데이트
            if (/setState\(\{?\.\.\..*\}?\)/.test(line)) {
                fileAnalysis.issues.push({
                    line: index + 1,
                    type: 'object-update',
                    severity: 'medium',
                    message: '객체 상태 업데이트 시 불변성 유지 확인 필요',
                    suggestion: 'immer 라이브러리 사용 또는 값 변경 여부 확인',
                    code: line.trim()
                });
            }
        });
    }

    /**
     * 🔥 메모이제이션 기회 체크
     */
    checkMemoizationOpportunities(lines, fileAnalysis) {
        const expensiveOps = [
            { regex: /\.filter\(.*\)\.map\(/, message: '체이닝된 배열 메서드', suggestion: 'useMemo로 감싸기' },
            { regex: /\.sort\(/, message: '배열 정렬', suggestion: 'useMemo로 결과 캐싱' },
            { regex: /new Date\(/, message: '날짜 객체 생성', suggestion: 'useMemo 또는 상수로 분리' },
            { regex: /JSON\.parse\(/, message: 'JSON 파싱', suggestion: 'useMemo로 결과 캐싱' },
            { regex: /Object\.keys\(.*\)\.map\(/, message: '객체 키 순회', suggestion: 'useMemo로 최적화' }
        ];

        lines.forEach((line, index) => {
            expensiveOps.forEach(op => {
                if (op.regex.test(line) && !line.includes('useMemo') && !line.includes('useCallback')) {
                    fileAnalysis.issues.push({
                        line: index + 1,
                        type: 'missing-memo',
                        severity: 'medium',
                        message: `비용이 큰 연산: ${op.message}`,
                        suggestion: op.suggestion,
                        code: line.trim()
                    });
                }
            });
        });
    }

    /**
     * 🔥 조건부 렌더링 체크
     */
    checkConditionalRendering(lines, fileAnalysis) {
        lines.forEach((line, index) => {
            // 삼항 연산자 대신 논리 연산자 사용 권장
            if (/\?\s*<.*>\s*:\s*null/.test(line) || /\?\s*<.*>\s*:\s*<><\/>/.test(line)) {
                fileAnalysis.issues.push({
                    line: index + 1,
                    type: 'conditional-render',
                    severity: 'low',
                    message: '삼항 연산자 대신 논리 연산자 사용 권장',
                    suggestion: 'condition ? <Component /> : null → condition && <Component />',
                    code: line.trim()
                });
            }

            // 키 속성 누락
            if (/\.map\s*\([^)]*\)\s*.*<[A-Z]/.test(line) && !line.includes('key=')) {
                fileAnalysis.issues.push({
                    line: index + 1,
                    type: 'missing-key',
                    severity: 'high',
                    message: '리스트 렌더링에서 key 속성 누락',
                    suggestion: '각 아이템에 고유한 key 속성 추가',
                    code: line.trim()
                });
            }
        });
    }

    /**
     * 🔥 컴포넌트 구조 최적화 체크
     */
    checkComponentStructure(content, fileAnalysis) {
        const lines = content.split('\n');
        
        // 큰 컴포넌트 체크 (100줄 이상)
        if (lines.length > 100) {
            fileAnalysis.issues.push({
                line: 1,
                type: 'large-component',
                severity: 'medium',
                message: `큰 컴포넌트 (${lines.length}줄)`,
                suggestion: '더 작은 컴포넌트로 분리 고려',
                code: `전체 컴포넌트 크기: ${lines.length}줄`
            });
        }

        // useState 과다 사용 체크
        const useStateCount = (content.match(/useState/g) || []).length;
        if (useStateCount > 5) {
            fileAnalysis.issues.push({
                line: 1,
                type: 'too-many-states',
                severity: 'medium',
                message: `과도한 useState 사용 (${useStateCount}개)`,
                suggestion: 'useReducer 또는 상태 관리 라이브러리 고려',
                code: `useState 사용 횟수: ${useStateCount}`
            });
        }
    }

    /**
     * 🔥 useEffect 내용 추출
     */
    getEffectContent(lines, startIndex) {
        let content = '';
        let braceCount = 0;
        let started = false;

        for (let i = startIndex; i < lines.length && i < startIndex + 20; i++) {
            const line = lines[i];
            content += line + '\n';

            for (const char of line) {
                if (char === '{') {
                    braceCount++;
                    started = true;
                } else if (char === '}') {
                    braceCount--;
                    if (started && braceCount === 0) {
                        return content;
                    }
                }
            }
        }

        return content;
    }

    /**
     * 🔥 외부 변수 찾기
     */
    findExternalVariables(effectContent) {
        const variables = [];
        const varPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        const matches = effectContent.match(varPattern) || [];
        
        // 일반적인 키워드 제외
        const excludeKeywords = [
            'console', 'log', 'const', 'let', 'var', 'function', 'return', 
            'if', 'else', 'for', 'while', 'true', 'false', 'null', 'undefined'
        ];

        matches.forEach(match => {
            if (!excludeKeywords.includes(match) && !variables.includes(match)) {
                variables.push(match);
            }
        });

        return variables.slice(0, 5); // 처음 5개만
    }

    /**
     * 🔥 상세 리포트 생성
     */
    async generateDetailedReport() {
        console.log('\n🔥 기가차드 React 성능 Deep Dive 결과\n');
        console.log('=' * 60);

        if (this.results.length === 0) {
            console.log('✅ 성능 이슈가 발견되지 않았습니다!\n');
            return;
        }

        // 이슈 타입별 통계
        const issueStats = {};
        let totalIssues = 0;

        this.results.forEach(file => {
            file.issues.forEach(issue => {
                totalIssues++;
                issueStats[issue.type] = (issueStats[issue.type] || 0) + 1;
            });
        });

        console.log(`📊 전체 통계:`);
        console.log(`   - 분석된 파일: ${this.results.length}개`);
        console.log(`   - 총 성능 이슈: ${totalIssues}개\n`);

        console.log(`🔍 이슈 타입별 분포:`);
        Object.entries(issueStats)
            .sort(([,a], [,b]) => b - a)
            .forEach(([type, count]) => {
                const percentage = ((count / totalIssues) * 100).toFixed(1);
                console.log(`   - ${this.getIssueTypeName(type)}: ${count}개 (${percentage}%)`);
            });

        console.log('\n🚨 주요 성능 이슈가 있는 파일들:\n');

        // 점수 순으로 정렬
        this.results
            .sort((a, b) => a.score - b.score)
            .slice(0, 10) // 상위 10개
            .forEach((file, index) => {
                console.log(`${index + 1}. ${file.file} (점수: ${file.score}/100)`);
                
                // 심각도 높은 이슈 3개만 표시
                const criticalIssues = file.issues
                    .filter(issue => issue.severity === 'high')
                    .slice(0, 3);

                criticalIssues.forEach(issue => {
                    console.log(`   ⚠️  라인 ${issue.line}: ${issue.message}`);
                    console.log(`       💡 ${issue.suggestion}`);
                });

                if (file.issues.length > criticalIssues.length) {
                    console.log(`   ... 외 ${file.issues.length - criticalIssues.length}개 이슈`);
                }
                console.log('');
            });

        // JSON 리포트도 생성
        await this.saveJsonReport();
    }

    /**
     * 🔥 이슈 타입명 매핑
     */
    getIssueTypeName(type) {
        const names = {
            'inline-object': '인라인 객체/함수',
            'missing-deps': 'useEffect 의존성 누락',
            'incorrect-deps': 'useEffect 의존성 오류',
            'unnecessary-update': '불필요한 상태 업데이트',
            'missing-memo': '메모이제이션 누락',
            'conditional-render': '조건부 렌더링 최적화',
            'missing-key': '리스트 key 누락',
            'large-component': '큰 컴포넌트',
            'too-many-states': '과도한 상태',
            'object-update': '객체 상태 업데이트'
        };
        return names[type] || type;
    }

    /**
     * 🔥 JSON 리포트 저장
     */
    async saveJsonReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalFiles: this.results.length,
            totalIssues: this.results.reduce((sum, file) => sum + file.issues.length, 0),
            averageScore: Math.round(this.results.reduce((sum, file) => sum + file.score, 0) / this.results.length),
            files: this.results
        };

        const reportPath = path.join(process.cwd(), 'react-performance-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📄 상세 리포트 저장됨: ${reportPath}`);
    }
}

// 실행
if (require.main === module) {
    const analyzer = new ReactPerformanceAnalyzer();
    analyzer.runAnalysis().catch(console.error);
}

module.exports = ReactPerformanceAnalyzer;
