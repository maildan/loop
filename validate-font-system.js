#!/usr/bin/env node

/**
 * 🔥 Phase 5 Validation Script - 폰트 시스템 자동 테스트
 * 
 * 이 스크립트는 Node.js 환경에서 실행되어 폰트 시스템의 
 * 기본적인 파일 구조와 설정을 검증합니다.
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 폰트 시스템 Phase 5 검증 시작...\n');

// 테스트 결과 저장
const testResults = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  }
};

/**
 * 테스트 함수
 */
function runTest(name, testFn) {
  testResults.summary.total++;
  
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${name}`);
      testResults.tests.push({ name, status: 'PASS', details: result });
      testResults.summary.passed++;
      return true;
    } else {
      console.log(`❌ ${name}`);
      testResults.tests.push({ name, status: 'FAIL', details: 'Test returned false' });
      testResults.summary.failed++;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} - ERROR: ${error.message}`);
    testResults.tests.push({ name, status: 'ERROR', details: error.message });
    testResults.summary.failed++;
    return false;
  }
}

// 프로젝트 루트 경로
const rootPath = process.cwd();
const srcPath = path.join(rootPath, 'src');
const rendererPath = path.join(srcPath, 'renderer');

console.log('📁 파일 구조 검증\n');

// Phase 1-3 구현 파일들 검증
runTest('FontProvider.tsx 존재', () => {
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  return fs.existsSync(fontProviderPath);
});

runTest('FontObserver.ts 존재 (Phase 3.5)', () => {
  const fontObserverPath = path.join(rendererPath, 'utils', 'FontObserver.ts');
  return fs.existsSync(fontObserverPath);
});

runTest('FontAccessibilityManager.ts 존재 (Phase 4)', () => {
  const accessibilityPath = path.join(rendererPath, 'utils', 'FontAccessibilityManager.ts');
  return fs.existsSync(accessibilityPath);
});

runTest('FontPerformanceTester.ts 존재 (Phase 5)', () => {
  const performancePath = path.join(rendererPath, 'utils', 'FontPerformanceTester.ts');
  return fs.existsSync(performancePath);
});

runTest('FontValidationDashboard.tsx 존재 (Phase 5)', () => {
  const dashboardPath = path.join(rendererPath, 'components', 'FontValidationDashboard.tsx');
  return fs.existsSync(dashboardPath);
});

console.log('\n🔍 코드 품질 검증\n');

// FontProvider 구현 내용 검증
runTest('FontProvider - MutationObserver 제거됨', () => {
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  // 실제 MutationObserver 생성 코드가 제거되었는지 확인 (주석은 제외)
  return !content.includes('new MutationObserver') && !content.match(/MutationObserver\s*\(/);
});

runTest('FontProvider - Console overriding 제거됨', () => {
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  // console overriding 패턴이 제거되었는지 확인
  return !content.includes('console.error = ') && !content.includes('console.warn = ');
});

runTest('FontProvider - CSS 변수 시스템 구현됨', () => {
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  // CSS 변수 시스템이 구현되었는지 확인
  return content.includes('--app-font-family') && content.includes('--app-font-size');
});

runTest('FontProvider - Electron Store 단일 저장소', () => {
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  // localStorage 의존성이 제거되고 Electron Store만 사용하는지 확인
  const hasElectronStore = content.includes('window.electronAPI?.settings');
  const noLocalStorage = !content.includes('localStorage.setItem') && !content.includes('localStorage.getItem');
  return hasElectronStore && noLocalStorage;
});

runTest('FontAccessibilityManager - Live Region 구현', () => {
  const accessibilityPath = path.join(rendererPath, 'utils', 'FontAccessibilityManager.ts');
  if (!fs.existsSync(accessibilityPath)) return false;
  
  const content = fs.readFileSync(accessibilityPath, 'utf8');
  // Live Region (화면 읽기 도구 지원) 구현 확인
  return content.includes('aria-live') && content.includes('announceFontChange');
});

runTest('FontAccessibilityManager - 롤백 시스템 구현', () => {
  const accessibilityPath = path.join(rendererPath, 'utils', 'FontAccessibilityManager.ts');
  if (!fs.existsSync(accessibilityPath)) return false;
  
  const content = fs.readFileSync(accessibilityPath, 'utf8');
  // 롤백 시스템 구현 확인
  return content.includes('saveRollbackState') && content.includes('rollbackToState');
});

console.log('\n📊 성능 최적화 검증\n');

runTest('querySelectorAll("*") 제거됨', () => {
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  // 성능 저하를 일으키는 전체 DOM 조회가 제거되었는지 확인
  return !content.includes('querySelectorAll("*")') && !content.includes("querySelectorAll('*')");
});

runTest('Context memoization 구현됨', () => {
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  // Context value memoization이 구현되었는지 확인
  return content.includes('useMemo') && content.includes('FontContextType');
});

console.log('\n🏗️ 아키텍처 검증\n');

runTest('Phase 1: DOM 조작 제거 완료', () => {
  // Phase 1 요구사항: MutationObserver, console overriding, querySelectorAll('*') 제거
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  const noMutationObserver = !content.includes('new MutationObserver') && !content.match(/MutationObserver\s*\(/);
  const noConsoleOverride = !content.includes('console.error = ') && !content.includes('console.warn = ');
  const noFullDomQuery = !content.includes('querySelectorAll("*")') && !content.includes("querySelectorAll('*')");
  
  return noMutationObserver && noConsoleOverride && noFullDomQuery;
});

runTest('Phase 2: 단일 저장소 시스템 완료', () => {
  // Phase 2 요구사항: Electron Store만 사용, localStorage/cookie 제거
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  const hasElectronStore = content.includes('window.electronAPI?.settings');
  const noLocalStorage = !content.includes('localStorage.');
  const noCookies = !content.includes('document.cookie');
  
  return hasElectronStore && noLocalStorage && noCookies;
});

runTest('Phase 3: CSS 변수 시스템 완료', () => {
  // Phase 3 요구사항: CSS 변수 중심 폰트 시스템
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  if (!fs.existsSync(fontProviderPath)) return false;
  
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  return content.includes('--app-font-family') && 
         content.includes('--app-font-size') && 
         content.includes('applyCSSVariables');
});

runTest('Phase 4: 접근성 & 안전성 완료', () => {
  // Phase 4 요구사항: 접근성 기능 및 롤백 시스템
  const accessibilityPath = path.join(rendererPath, 'utils', 'FontAccessibilityManager.ts');
  const fontProviderPath = path.join(rendererPath, 'contexts', 'FontProvider.tsx');
  
  if (!fs.existsSync(accessibilityPath) || !fs.existsSync(fontProviderPath)) return false;
  
  const accessibilityContent = fs.readFileSync(accessibilityPath, 'utf8');
  const providerContent = fs.readFileSync(fontProviderPath, 'utf8');
  
  const hasLiveRegion = accessibilityContent.includes('aria-live');
  const hasRollback = accessibilityContent.includes('rollbackToState');
  const integrated = providerContent.includes('FontAccessibilityManager');
  
  return hasLiveRegion && hasRollback && integrated;
});

runTest('Phase 5: 테스트 도구 완료', () => {
  // Phase 5 요구사항: 성능 테스트 및 검증 도구
  const performancePath = path.join(rendererPath, 'utils', 'FontPerformanceTester.ts');
  const dashboardPath = path.join(rendererPath, 'components', 'FontValidationDashboard.tsx');
  
  const hasPerformanceTester = fs.existsSync(performancePath);
  const hasDashboard = fs.existsSync(dashboardPath);
  
  if (!hasPerformanceTester || !hasDashboard) return false;
  
  const performanceContent = fs.readFileSync(performancePath, 'utf8');
  const hasComprehensiveTesting = performanceContent.includes('runComprehensiveTest');
  
  return hasComprehensiveTesting;
});

// 최종 결과 출력
console.log('\n📋 테스트 요약\n');
console.log(`총 테스트: ${testResults.summary.total}`);
console.log(`✅ 통과: ${testResults.summary.passed}`);
console.log(`❌ 실패: ${testResults.summary.failed}`);

const successRate = (testResults.summary.passed / testResults.summary.total * 100).toFixed(1);
console.log(`📊 성공률: ${successRate}%`);

// 권장사항
console.log('\n💡 권장사항\n');

if (testResults.summary.failed > 0) {
  console.log('❌ 실패한 테스트들을 확인하고 수정이 필요합니다:');
  testResults.tests
    .filter(test => test.status !== 'PASS')
    .forEach(test => {
      console.log(`   - ${test.name}: ${test.details}`);
    });
} else {
  console.log('🎉 모든 테스트가 통과했습니다!');
  console.log('✨ 폰트 시스템이 성공적으로 개선되었습니다.');
  console.log('🚀 이제 실제 사용자 테스트를 진행할 수 있습니다.');
}

// 테스트 결과를 JSON 파일로 저장
const resultsPath = path.join(rootPath, 'font-validation-results.json');
fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
console.log(`\n📄 상세 결과가 ${resultsPath}에 저장되었습니다.`);

// 종료 코드 설정
process.exit(testResults.summary.failed > 0 ? 1 : 0);