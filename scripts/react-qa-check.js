#!/usr/bin/env node

// 🔥 기가차드 React 성능 이슈만 체크하는 간소 버전

const fs = require('fs');
const path = require('path');

class ReactPerformanceChecker {
    constructor() {
        this.projectRoot = process.cwd();
        this.srcPath = path.join(this.projectRoot, 'src');
        this.results = [];
    }

    /**
     * 🔥 React 성능 이슈 체크만 실행
     */
    async runReactCheck() {
        console.log('🔥 기가차드 React 성능 이슈 체크 시작!\n');
        
        const rendererPath = path.join(this.srcPath, 'renderer');
        
        if (!fs.existsSync(rendererPath)) {
            console.log('❌ Renderer 디렉토리를 찾을 수 없습니다');
            return;
        }

        console.log(`✅ Renderer 경로: ${rendererPath}`);
        
        const issues = [];
        await this.scanDirectoryForReactIssues(rendererPath, issues);
        
        console.log(`\n📊 React 성능 이슈 체크 완료: ${issues.length}개 이슈 발견\n`);
        
        // 이슈 타입별 분류
        const issuesByType = {};
        issues.forEach(issue => {
            const type = issue.type || 'unknown';
            issuesByType[type] = (issuesByType[type] || 0) + 1;
        });

        console.log('🔍 이슈 타입별 분포:');
        Object.entries(issuesByType)
            .sort(([,a], [,b]) => b - a)
            .forEach(([type, count]) => {
                console.log(`   - ${this.getIssueTypeName(type)}: ${count}개`);
            });

        // 심각도별 분류
        const issuesBySeverity = {};
        issues.forEach(issue => {
            const severity = issue.priority || issue.severity || 'medium';
            issuesBySeverity[severity] = (issuesBySeverity[severity] || 0) + 1;
        });

        console.log('\n🚨 심각도별 분포:');
        Object.entries(issuesBySeverity)
            .sort(([,a], [,b]) => b - a)
            .forEach(([severity, count]) => {
                const emoji = severity === 'critical' ? '🔴' : 
                             severity === 'high' ? '🟠' : 
                             severity === 'medium' ? '🟡' : '🟢';
                console.log(`   ${emoji} ${severity}: ${count}개`);
            });

        // 상위 10개 이슈 파일 표시
        const fileIssues = {};
        issues.forEach(issue => {
            const file = issue.file;
            if (!fileIssues[file]) {
                fileIssues[file] = [];
            }
            fileIssues[file].push(issue);
        });

        const sortedFiles = Object.entries(fileIssues)
            .sort(([,a], [,b]) => b.length - a.length)
            .slice(0, 10);

        if (sortedFiles.length > 0) {
            console.log('\n🚨 상위 문제 파일들:');
            sortedFiles.forEach(([file, fileIssues], index) => {
                console.log(`${index + 1}. ${file} (${fileIssues.length}개 이슈)`);
            });
        }

        // JSON 리포트 저장
        const report = {
            timestamp: new Date().toISOString(),
            totalIssues: issues.length,
            issuesByType,
            issuesBySeverity,
            issues: issues.slice(0, 50) // 처음 50개만
        };

        const reportPath = path.join(this.projectRoot, 'react-qa-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 상세 리포트: ${reportPath}`);
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
            const relativePath = path.relative(this.projectRoot, filePath);

            // 1. 인라인 객체/함수 생성 체크
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
            console.error(`❌ 파일 체크 실패 ${filePath}:`, error.message);
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
                { regex: /style=\{\{[^}]+\}\}/, type: 'inline-style', message: '인라인 스타일 객체' },
                { regex: /onClick=\{.*=>\s*/, type: 'inline-handler', message: '인라인 클릭 핸들러' },
                { regex: /onSubmit=\{.*=>\s*/, type: 'inline-handler', message: '인라인 폼 핸들러' },
                { regex: /onChange=\{.*=>\s*/, type: 'inline-handler', message: '인라인 변경 핸들러' },
                { regex: /\.map\(\([^)]*\)\s*=>\s*</, type: 'inline-map', message: '인라인 map 렌더링' },
                { regex: /className=\{.*\?.*:.*\}/, type: 'inline-conditional', message: '인라인 조건부 className' }
            ];

            inlineObjectPatterns.forEach(pattern => {
                if (pattern.regex.test(line)) {
                    issues.push({
                        file: filePath,
                        line: lineNum,
                        type: pattern.type,
                        message: pattern.message,
                        severity: 'medium',
                        suggestion: 'useCallback/useMemo로 메모이제이션하거나 컴포넌트 외부로 분리',
                        code: line.trim()
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
            if (/useEffect\s*\([^,]+\)\s*;?\s*$/.test(line.trim())) {
                issues.push({
                    file: filePath,
                    line: lineNum,
                    type: 'missing-deps',
                    message: 'useEffect 의존성 배열 누락',
                    severity: 'high',
                    suggestion: '의존성 배열을 추가하세요',
                    code: line.trim()
                });
            }

            // Empty dependency array but likely using external vars
            if (/useEffect\s*\([^,]+,\s*\[\s*\]\s*\)/.test(line)) {
                // 간단한 휴리스틱: 다음 몇 줄에서 변수 사용 패턴 체크
                const nextLines = lines.slice(index, index + 5).join(' ');
                if (/\b[a-zA-Z_][a-zA-Z0-9_]*\b/.test(nextLines) && 
                    !nextLines.includes('console.log') && 
                    !nextLines.includes('return')) {
                    issues.push({
                        file: filePath,
                        line: lineNum,
                        type: 'incorrect-deps',
                        message: 'useEffect 빈 의존성 배열이지만 외부 변수 사용 가능성',
                        severity: 'medium',
                        suggestion: '사용된 변수들을 의존성 배열에 추가하세요',
                        code: line.trim()
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
            
            // setState with potentially same value
            if (/set\w+\(\w+\)/.test(line) && line.includes('set')) {
                issues.push({
                    file: filePath,
                    line: lineNum,
                    type: 'unnecessary-update',
                    message: '동일한 값으로 상태 업데이트 가능성',
                    severity: 'medium',
                    suggestion: '상태 업데이트 전에 값 비교 추가',
                    code: line.trim()
                });
            }
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
                { regex: /\.filter\(.*\)\.map\(/, message: '체이닝된 배열 메서드' },
                { regex: /\.sort\(/, message: '배열 정렬' },
                { regex: /new Date\(/, message: '날짜 객체 생성' },
                { regex: /Object\.keys\(.*\)\.map\(/, message: '객체 키 순회' },
                { regex: /JSON\.parse\(/, message: 'JSON 파싱' },
                { regex: /JSON\.stringify\(/, message: 'JSON 직렬화' }
            ];

            expensiveOperations.forEach(op => {
                if (op.regex.test(line) && !line.includes('useMemo') && !line.includes('useCallback')) {
                    issues.push({
                        file: filePath,
                        line: lineNum,
                        type: 'missing-memo',
                        message: `비용이 큰 연산: ${op.message}`,
                        severity: 'medium',
                        suggestion: 'useMemo나 useCallback으로 메모이제이션하세요',
                        code: line.trim()
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
            
            // 논리 연산자 대신 삼항 연산자 사용
            if (/\?\s*<.*>\s*:\s*null/.test(line) || /\?\s*<.*>\s*:\s*<><\/>/.test(line)) {
                issues.push({
                    file: filePath,
                    line: lineNum,
                    type: 'conditional-render',
                    message: '삼항 연산자 대신 논리 연산자 사용 권장',
                    severity: 'low',
                    suggestion: 'condition ? <Component /> : null → condition && <Component />',
                    code: line.trim()
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
                    type: 'missing-key',
                    message: '리스트 렌더링에서 key 속성 누락',
                    severity: 'high',
                    suggestion: '각 리스트 아이템에 고유한 key 속성을 추가하세요',
                    code: line.trim()
                });
            }
        });
    }

    /**
     * 🔥 이슈 타입명 매핑
     */
    getIssueTypeName(type) {
        const names = {
            'inline-style': '인라인 스타일',
            'inline-handler': '인라인 핸들러', 
            'inline-map': '인라인 map 렌더링',
            'inline-conditional': '인라인 조건부 className',
            'missing-deps': 'useEffect 의존성 누락',
            'incorrect-deps': 'useEffect 의존성 오류',
            'unnecessary-update': '불필요한 상태 업데이트',
            'missing-memo': '메모이제이션 누락',
            'conditional-render': '조건부 렌더링 최적화',
            'missing-key': '리스트 key 누락'
        };
        return names[type] || type;
    }
}

// 실행
if (require.main === module) {
    const checker = new ReactPerformanceChecker();
    checker.runReactCheck().catch(console.error);
}

module.exports = ReactPerformanceChecker;
