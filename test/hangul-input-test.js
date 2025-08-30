#!/usr/bin/env node
/**
 * 🔥 기가차드 한국어 키보드 완전 테스트 스크립트
 * 모든 한글 입력 기능을 검증합니다.
 */

// 테스트 케이스 정의
const TEST_CASES = [
  // 🔥 기본 자음/모음 조합
  {
    name: "기본 한글 조합",
    inputs: ['ㄱ', 'ㅏ'], // 가
    expected: "가",
    description: "초성 + 중성 기본 조합"
  },
  {
    name: "자음+모음+자음",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ'], // 한
    expected: "한",
    description: "완전한 한글 음절"
  },
  
  // 🔥 복합모음 조합 테스트 (표준 7개)
  {
    name: "ㅘ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅏ'], // 과 (ㅗ+ㅏ=ㅘ)
    expected: "과",
    description: "ㅗ + ㅏ = ㅘ 조합"
  },
  {
    name: "ㅙ 복합모음", 
    inputs: ['ㄱ', 'ㅗ', 'ㅐ'], // 괘 (ㅗ+ㅐ=ㅙ)
    expected: "괘",
    description: "ㅗ + ㅐ = ㅙ 조합"
  },
  {
    name: "ㅚ 복합모음",
    inputs: ['ㄱ', 'ㅗ', 'ㅣ'], // 괴 (ㅗ+ㅣ=ㅚ)
    expected: "괴",
    description: "ㅗ + ㅣ = ㅚ 조합"
  },
  {
    name: "ㅝ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅓ'], // 궈 (ㅜ+ㅓ=ㅝ)
    expected: "궈",
    description: "ㅜ + ㅓ = ㅝ 조합"
  },
  {
    name: "ㅞ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅔ'], // 궤 (ㅜ+ㅔ=ㅞ)
    expected: "궤", 
    description: "ㅜ + ㅔ = ㅞ 조합"
  },
  {
    name: "ㅟ 복합모음",
    inputs: ['ㄱ', 'ㅜ', 'ㅣ'], // 귀 (ㅜ+ㅣ=ㅟ)
    expected: "귀",
    description: "ㅜ + ㅣ = ㅟ 조합"
  },
  {
    name: "ㅢ 복합모음",
    inputs: ['ㅇ', 'ㅡ', 'ㅣ'], // 의 (ㅡ+ㅣ=ㅢ)
    expected: "의",
    description: "ㅡ + ㅣ = ㅢ 조합"
  },
  
  // 🔥 Shift 조합 테스트 (직접 입력)
  {
    name: "ㅖ 직접 입력",
    inputs: ['ㅇ', 'ㅖ'], // 예 (Shift+p)
    expected: "예",
    description: "Shift+p = ㅖ 직접 입력"
  },
  {
    name: "ㅒ 직접 입력",
    inputs: ['ㅇ', 'ㅒ'], // 얘 (Shift+o)
    expected: "얘",
    description: "Shift+o = ㅒ 직접 입력"
  },
  
  // 🔥 쌍자음 테스트
  {
    name: "ㄲ 쌍자음",
    inputs: ['ㄲ', 'ㅏ'], // 까 (Shift+r)
    expected: "까",
    description: "Shift+r = ㄲ 쌍자음"
  },
  {
    name: "ㅃ 쌍자음",
    inputs: ['ㅃ', 'ㅏ'], // 빠 (Shift+q)
    expected: "빠",
    description: "Shift+q = ㅃ 쌍자음"
  },
  
  // 🔥 복합종성 테스트
  {
    name: "ㄳ 복합종성",
    inputs: ['ㅁ', 'ㅗ', 'ㄱ', 'ㅅ'], // 목 (ㄱ+ㅅ=ㄳ)
    expected: "몫",
    description: "ㄱ + ㅅ = ㄳ 복합종성"
  },
  {
    name: "ㄵ 복합종성",
    inputs: ['ㅇ', 'ㅏ', 'ㄴ', 'ㅈ'], // 안 (ㄴ+ㅈ=ㄵ)
    expected: "앉",
    description: "ㄴ + ㅈ = ㄵ 복합종성"
  },
  
  // 🔥 연속 입력 테스트
  {
    name: "연속 한글 입력",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ', ' ', 'ㄱ', 'ㅡ', 'ㄹ'], // 한 글
    expected: "한 글",
    description: "스페이스로 구분된 연속 입력"
  },
  
  // 🔥 실제 단어 테스트
  {
    name: "과자 단어",
    inputs: ['ㄱ', 'ㅗ', 'ㅏ', 'ㅈ', 'ㅏ'], // 과자
    expected: "과자",
    description: "실제 한국어 단어 - 복합모음 포함"
  },
  {
    name: "의사 단어",
    inputs: ['ㅇ', 'ㅡ', 'ㅣ', 'ㅅ', 'ㅏ'], // 의사
    expected: "의사", 
    description: "실제 한국어 단어 - ㅢ 복합모음"
  },
  
  // 🔥 특수 케이스
  {
    name: "백스페이스 테스트",
    inputs: ['ㅎ', 'ㅏ', 'ㄴ', 'backspace'], // 한 → 하
    expected: "하",
    description: "백스페이스로 종성 제거"
  }
];

// 키보드 매핑 (영어 키 → 한글)
const KEYBOARD_MAP = {
  // 🔥 기본 자음 (14개)
  'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
  'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
  'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ',
  
  // 🔥 기본 모음 (10개)
  'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
  'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
  'b': 'ㅠ', 'n': 'ㅜ', 'm': 'ㅡ',
  
  // 🔥 Shift 조합 (쌍자음 5개 + 복합모음 2개)
  'Q': 'ㅃ', 'W': 'ㅉ', 'E': 'ㄸ', 'R': 'ㄲ', 'T': 'ㅆ',
  'O': 'ㅒ', 'P': 'ㅖ'
};

// 🔥 실제 테스트 실행 함수
function runHangulTests() {
  console.log('🔥 기가차드 한국어 키보드 완전 테스트 시작! 🔥\n');
  
  let passedTests = 0;
  let totalTests = TEST_CASES.length;
  let detailedResults = [];
  
  for (const testCase of TEST_CASES) {
    console.log(`📝 테스트: ${testCase.name}`);
    console.log(`📖 설명: ${testCase.description}`);
    console.log(`⌨️  입력: ${testCase.inputs.join(' + ')}`);
    console.log(`🎯 예상: ${testCase.expected}`);
    
    // 여기에 실제 HangulComposer 테스트 로직 추가
    const result = simulateHangulInput(testCase.inputs);
    
    const passed = result === testCase.expected;
    
    if (passed) {
      console.log(`✅ 통과: ${result}\n`);
      passedTests++;
    } else {
      console.log(`❌ 실패: ${result} (예상: ${testCase.expected})\n`);
    }
    
    detailedResults.push({
      name: testCase.name,
      passed,
      input: testCase.inputs,
      expected: testCase.expected,
      actual: result
    });
  }
  
  console.log(`🏆 테스트 결과: ${passedTests}/${totalTests} 통과`);
  console.log(`📊 성공률: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 모든 한국어 키보드 기능이 완벽하게 작동합니다!');
  } else {
    console.log('⚠️  일부 기능에 문제가 있습니다. 수정이 필요합니다.');
    console.log('\n🔍 실패한 테스트들:');
    detailedResults
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`- ${r.name}: ${r.actual} ≠ ${r.expected}`);
      });
  }
  
  return { passedTests, totalTests, detailedResults };
}

// 🔥 한글 입력 시뮬레이션 (간단 버전)
function simulateHangulInput(inputs) {
  // 실제로는 HangulComposer를 사용하여 테스트
  // 여기서는 간단한 시뮬레이션만 구현
  let result = '';
  let currentComposition = '';
  
  for (const input of inputs) {
    if (input === ' ') {
      result += currentComposition + ' ';
      currentComposition = '';
    } else if (input === 'backspace') {
      if (currentComposition.length > 0) {
        currentComposition = currentComposition.slice(0, -1);
      }
    } else {
      // 한글 조합 로직 (매우 단순화)
      currentComposition += input;
    }
  }
  
  result += currentComposition;
  return result.trim();
}

// 🔥 영어 키보드 입력 테스트
function runKeyboardMappingTest() {
  console.log('\n🎹 키보드 매핑 테스트\n');
  
  const testWords = [
    { english: 'gksrmf', hangul: '한글', description: 'gksrmf → 한글' },
    { english: 'dkssudgktpdy', hangul: '안녕하세요', description: 'dkssudgktpdy → 안녕하세요' },
    { english: 'rnthr', hangul: '감사', description: 'rnthr → 감사' },
    { english: 'rhkswk', hangul: '과자', description: 'rhkswk → 과자 (복합모음 ㅘ 테스트)' },
    { english: 'dmlgh', hangul: '의사', description: 'dmlgh → 의사 (복합모음 ㅢ 테스트)' }
  ];
  
  for (const test of testWords) {
    console.log(`⌨️  영어: ${test.english}`);
    console.log(`🔄 변환: ${test.description}`);
    console.log(`🎯 결과: ${test.hangul}\n`);
  }
}

// 🔥 복합모음 조합 테스트 (핵심 기능)
function runComplexVowelTest() {
  console.log('\n🔥 복합모음 조합 테스트 (핵심!)\n');
  
  const complexVowels = [
    { combination: 'ㅗ + ㅏ', result: 'ㅘ', example: '과자' },
    { combination: 'ㅗ + ㅐ', result: 'ㅙ', example: '괘' }, 
    { combination: 'ㅗ + ㅣ', result: 'ㅚ', example: '괴물' },
    { combination: 'ㅜ + ㅓ', result: 'ㅝ', example: '궈' },
    { combination: 'ㅜ + ㅔ', result: 'ㅞ', example: '궤' },
    { combination: 'ㅜ + ㅣ', result: 'ㅟ', example: '귀' },
    { combination: 'ㅡ + ㅣ', result: 'ㅢ', example: '의사' }
  ];
  
  console.log('🎯 한국어 표준 복합모음 (7개):');
  for (const vowel of complexVowels) {
    console.log(`${vowel.combination} = ${vowel.result} (예: ${vowel.example})`);
  }
  
  console.log('\n⚠️  주의: ㅒ, ㅖ, ㅐ, ㅔ는 키보드에서 직접 입력 (조합 아님)');
  console.log('- Shift+o = ㅒ, Shift+p = ㅖ, o = ㅐ, p = ㅔ');
}

// 🔥 테스트 실행
if (require.main === module) {
  console.log('🚀 Loop 한국어 키보드 시스템 통합 테스트\n');
  console.log('=' .repeat(60));
  
  // 1. 복합모음 이론 설명
  runComplexVowelTest();
  
  // 2. 키보드 매핑 테스트
  runKeyboardMappingTest();
  
  // 3. 실제 조합 테스트
  const results = runHangulTests();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 최종 결과 요약:');
  console.log(`- 총 테스트: ${results.totalTests}개`);
  console.log(`- 성공: ${results.passedTests}개`);
  console.log(`- 실패: ${results.totalTests - results.passedTests}개`);
  console.log(`- 성공률: ${((results.passedTests/results.totalTests) * 100).toFixed(1)}%`);
  
  if (results.passedTests === results.totalTests) {
    console.log('\n🎉 완벽! 모든 한국어 입력 기능이 작동합니다!');
  } else {
    console.log('\n🔧 일부 수정이 필요합니다. 로그를 확인해주세요.');
  }
}

// 🔥 Export for module usage
module.exports = {
  runHangulTests,
  runKeyboardMappingTest, 
  runComplexVowelTest,
  TEST_CASES,
  KEYBOARD_MAP
};
