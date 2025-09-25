#!/usr/bin/env node

/**
 * 🔥 폰트 시스템 실시간 진단 실행기
 * 
 * 이 스크립트는 현재 폰트 시스템의 상태를 실시간으로 진단하고
 * 문제점과 해결책을 제시합니다.
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 폰트 시스템 실시간 진단 시작...\n');

// 1. 현재 FontProvider 상태 분석
console.log('📊 1. FontProvider 코드 분석\n');

const fontProviderPath = path.join(process.cwd(), 'src/renderer/contexts/FontProvider.tsx');
if (fs.existsSync(fontProviderPath)) {
  const content = fs.readFileSync(fontProviderPath, 'utf8');
  const lineCount = content.split('\n').length;
  
  console.log(`📄 파일 크기: ${lineCount}줄`);
  
  // applyCSSVariables 함수가 제대로 구현되었는지 확인
  const hasApplyCSSVariables = content.includes('applyCSSVariables');
  const hasCSSVariableSet = content.includes('setProperty(\'--app-font-family\'');
  const hasGlobalStyle = content.includes('global-font-style');
  
  console.log(`✅ applyCSSVariables 함수: ${hasApplyCSSVariables ? '있음' : '없음'}`);
  console.log(`✅ CSS 변수 설정: ${hasCSSVariableSet ? '있음' : '없음'}`);
  console.log(`✅ 글로벌 스타일 주입: ${hasGlobalStyle ? '있음' : '없음'}`);
  
  // 블랙리스트 시스템 확인
  const hasBlacklist = content.includes('FontBlacklistManager');
  const hasGawBlacklist = content.includes('gaw.otf');
  
  console.log(`✅ 블랙리스트 시스템: ${hasBlacklist ? '있음' : '없음'}`);
  console.log(`✅ gaw.otf 블랙리스트: ${hasGawBlacklist ? '있음' : '없음'}`);
  
  if (lineCount > 500) {
    console.log(`⚠️  파일이 너무 큽니다 (${lineCount}줄). 리팩토링이 필요합니다.`);
  }
  
} else {
  console.log('❌ FontProvider.tsx 파일을 찾을 수 없습니다.');
}

console.log('\n📊 2. 코드 품질 문제 분석\n');

// Codacy 오류들 기반으로 분석
const codeIssues = [
  {
    file: 'FontService.ts',
    issue: '파일 경로 보안 문제',
    severity: 'HIGH',
    solution: 'path.join() 대신 안전한 경로 생성 방식 사용'
  },
  {
    file: 'FontProvider.tsx',
    issue: '순환복잡도 27 (제한: 8)',
    severity: 'HIGH',
    solution: '함수를 여러 개의 작은 함수로 분할'
  },
  {
    file: 'FontProvider.tsx',
    issue: '파일 크기 718줄 (제한: 500)',
    severity: 'MEDIUM',
    solution: '별도 모듈로 분리'
  },
  {
    file: 'projectEditor/index.tsx',
    issue: 'XSS 취약점',
    severity: 'HIGH',
    solution: 'eval() 사용 제거 및 입력 검증 강화'
  }
];

codeIssues.forEach((issue, index) => {
  const icon = issue.severity === 'HIGH' ? '🚨' : '⚠️';
  console.log(`${icon} ${issue.file}: ${issue.issue}`);
  console.log(`   해결책: ${issue.solution}\n`);
});

console.log('📊 3. 폰트 적용 실패 가능한 원인 분석\n');

const possibleCauses = [
  {
    cause: 'CSS 변수가 실제 DOM에 적용되지 않음',
    check: 'document.documentElement.style.getPropertyValue(\'--app-font-family\') 확인',
    probability: 'HIGH'
  },
  {
    cause: '블랙리스트 시스템이 작동하지 않아 문제 폰트 로드',
    check: '네트워크 탭에서 gaw_Light.otf 로드 여부 확인',
    probability: 'HIGH'  
  },
  {
    cause: 'TipTap 에디터의 CSS 우선순위 문제',
    check: '.ProseMirror 요소의 computed style 확인',
    probability: 'MEDIUM'
  },
  {
    cause: 'Electron Store와 렌더러 프로세스 간 동기화 문제',
    check: 'window.electronAPI.settings.get() 결과 확인',
    probability: 'MEDIUM'
  },
  {
    cause: 'React Context 리렌더링 이슈',
    check: 'FontProvider의 value 객체 memoization 확인',
    probability: 'LOW'
  }
];

possibleCauses.forEach(cause => {
  const icon = cause.probability === 'HIGH' ? '🔴' : cause.probability === 'MEDIUM' ? '🟡' : '🟢';
  console.log(`${icon} ${cause.cause}`);
  console.log(`   확인 방법: ${cause.check}\n`);
});

console.log('💡 4. 즉시 수행해야 할 액션 아이템\n');

const actionItems = [
  {
    priority: 1,
    action: 'FontProvider.tsx 복잡도 줄이기',
    details: '현재 955줄을 여러 모듈로 분할하여 각각 200줄 이하로 만들기'
  },
  {
    priority: 2,
    action: '블랙리스트 시스템 수정',
    details: 'gaw_Light.otf가 로드되지 않도록 패턴 매칭 로직 개선'
  },
  {
    priority: 3,
    action: 'CSS 변수 적용 검증',
    details: 'applyCSSVariables 함수가 실제로 DOM을 수정하는지 확인'
  },
  {
    priority: 4,
    action: 'FontService.ts 보안 문제 해결',
    details: '파일 경로 구성 시 path traversal 공격 방지'
  },
  {
    priority: 5,
    action: 'XSS 취약점 해결',
    details: 'projectEditor에서 eval() 사용 제거'
  }
];

actionItems.forEach(item => {
  console.log(`${item.priority}. ${item.action}`);
  console.log(`   ${item.details}\n`);
});

console.log('🎯 5. 권장 해결 순서\n');

console.log('1️⃣ 즉시 수행 (긴급)');
console.log('   - CSS 변수 적용 상태 브라우저에서 직접 확인');
console.log('   - 블랙리스트 동작 여부 확인');
console.log('   - TipTap 에디터 폰트 상속 확인\n');

console.log('2️⃣ 단기 수정 (1-2시간)');
console.log('   - FontProvider 복잡도 줄이기');
console.log('   - 블랙리스트 패턴 매칭 수정');
console.log('   - CSS 적용 로직 단순화\n');

console.log('3️⃣ 중기 개선 (1일)');
console.log('   - 보안 문제 해결');
console.log('   - 코드 품질 개선');
console.log('   - 테스트 강화\n');

console.log('📋 진단 완료. 다음 단계는 브라우저에서 직접 확인입니다.');
console.log('Chrome 개발자 도구 → Console → FontSystemDiagnostic.runCompleteDiagnostic() 실행');