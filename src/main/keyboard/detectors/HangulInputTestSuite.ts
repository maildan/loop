// 🔥 기가차드 한글 입력 시스템 통합 테스트 스위트

import { Logger } from '../../../shared/logger';
import { UnifiedLanguageDetector } from './UnifiedLanguageDetector';
import { HangulComposer } from '../HangulComposer';
import { Platform } from '../../utils/platform';

/**
 * 🔥 테스트 케이스 인터페이스
 */
interface TestCase {
  name: string;
  description: string;
  inputs: string[];
  expected: string;
  category: 'basic' | 'complex' | 'mixed' | 'edge' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * 🔥 테스트 결과 인터페이스
 */
interface TestResult {
  testCase: TestCase;
  actual: string;
  passed: boolean;
  duration: number;
  errors: string[];
  metadata?: Record<string, unknown>;
}

/**
 * 🔥 기가차드 한글 입력 시스템 QA 테스트 스위트
 * 완전한 통합 테스트로 모든 기능 검증
 */
export class HangulInputTestSuite {
  private readonly componentName = 'HANGUL_INPUT_TEST_SUITE';
  
  // 🔥 테스트 컴포넌트들
  private languageDetector: UnifiedLanguageDetector;
  private hangulComposer: HangulComposer;
  
  // 🔥 테스트 통계
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;
  private testResults: TestResult[] = [];
  private startTime = 0;
  
  constructor() {
    this.languageDetector = new UnifiedLanguageDetector();
    this.hangulComposer = new HangulComposer();
  }

  /**
   * 🔥 완전한 테스트 케이스 정의
   */
  private getTestCases(): TestCase[] {
    return [
      // 🔥 Level 1: 기본 한글 조합 테스트
      {
        name: '기본_자음모음_조합',
        description: '초성 + 중성 기본 조합',
        inputs: ['ㄱ', 'ㅏ'],
        expected: '가',
        category: 'basic',
        priority: 'critical'
      },
      {
        name: '완전한_음절_조합',
        description: '초성 + 중성 + 종성 완전 조합',
        inputs: ['ㅎ', 'ㅏ', 'ㄴ'],
        expected: '한',
        category: 'basic',
        priority: 'critical'
      },
      {
        name: '복잡한_음절_조합',
        description: '복잡한 음절 구성',
        inputs: ['ㄱ', 'ㅡ', 'ㄹ'],
        expected: '글',
        category: 'basic',
        priority: 'critical'
      },

      // 🔥 Level 2: 복합모음 테스트
      {
        name: '복합모음_ㅘ',
        description: 'ㅗ + ㅏ = ㅘ 조합',
        inputs: ['ㄱ', 'ㅗ', 'ㅏ'],
        expected: '과',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '복합모음_ㅚ',
        description: 'ㅗ + ㅣ = ㅚ 조합', 
        inputs: ['ㄱ', 'ㅗ', 'ㅣ'],
        expected: '괴',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '복합모음_ㅝ',
        description: 'ㅜ + ㅓ = ㅝ 조합',
        inputs: ['ㄱ', 'ㅜ', 'ㅓ'],
        expected: '궈',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '복합모음_ㅢ',
        description: 'ㅡ + ㅣ = ㅢ 조합',
        inputs: ['ㅇ', 'ㅡ', 'ㅣ'],
        expected: '의',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '복합모음_ㅙ',
        description: 'ㅗ + ㅐ = ㅙ 조합',
        inputs: ['ㄱ', 'ㅗ', 'ㅐ'],
        expected: '괘',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '복합모음_ㅞ',
        description: 'ㅜ + ㅔ = ㅞ 조합',
        inputs: ['ㄱ', 'ㅜ', 'ㅔ'],
        expected: '궤',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '복합모음_ㅟ',
        description: 'ㅜ + ㅣ = ㅟ 조합',
        inputs: ['ㄱ', 'ㅜ', 'ㅣ'],
        expected: '귀',
        category: 'complex',
        priority: 'high'
      },

      // 🔥 Level 3: Shift 조합 테스트
      {
        name: 'Shift_ㅖ_직접입력',
        description: 'Shift+p = ㅖ 직접 입력',
        inputs: ['ㅇ', 'ㅖ'],
        expected: '예',
        category: 'complex',
        priority: 'high'
      },
      {
        name: 'Shift_ㅒ_직접입력',
        description: 'Shift+o = ㅒ 직접 입력',
        inputs: ['ㅇ', 'ㅒ'],
        expected: '얘',
        category: 'complex',
        priority: 'high'
      },

      // 🔥 Level 4: 쌍자음 테스트
      {
        name: '쌍자음_ㄲ',
        description: 'Shift+r = ㄲ 쌍자음',
        inputs: ['ㄲ', 'ㅏ'],
        expected: '까',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '쌍자음_ㅃ',
        description: 'Shift+q = ㅃ 쌍자음',
        inputs: ['ㅃ', 'ㅏ'],
        expected: '빠',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '쌍자음_ㄸ',
        description: 'Shift+e = ㄸ 쌍자음',
        inputs: ['ㄸ', 'ㅏ'],
        expected: '따',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '쌍자음_ㅆ',
        description: 'Shift+t = ㅆ 쌍자음',
        inputs: ['ㅆ', 'ㅏ'],
        expected: '싸',
        category: 'complex',
        priority: 'high'
      },
      {
        name: '쌍자음_ㅉ',
        description: 'Shift+w = ㅉ 쌍자음',
        inputs: ['ㅉ', 'ㅏ'],
        expected: '짜',
        category: 'complex',
        priority: 'high'
      },

      // 🔥 Level 5: 복합자음 종성 테스트
      {
        name: '복합자음_ㄳ',
        description: 'ㄱ + ㅅ = ㄳ 종성',
        inputs: ['ㄱ', 'ㅏ', 'ㄱ', 'ㅅ'],
        expected: '값',
        category: 'complex',
        priority: 'medium'
      },
      {
        name: '복합자음_ㄵ',
        description: 'ㄴ + ㅈ = ㄵ 종성',
        inputs: ['ㅇ', 'ㅏ', 'ㄴ', 'ㅈ'],
        expected: '앉',
        category: 'complex',
        priority: 'medium'
      },
      {
        name: '복합자음_ㅄ',
        description: 'ㅂ + ㅅ = ㅄ 종성',
        inputs: ['ㅇ', 'ㅓ', 'ㅂ', 'ㅅ'],
        expected: '없',
        category: 'complex',
        priority: 'medium'
      },

      // 🔥 Level 6: 연속 입력 테스트
      {
        name: '연속_단어_입력',
        description: '스페이스로 구분된 연속 입력',
        inputs: ['ㅎ', 'ㅏ', 'ㄴ', ' ', 'ㄱ', 'ㅡ', 'ㄹ'],
        expected: '한 글',
        category: 'mixed',
        priority: 'high'
      },
      {
        name: '긴_문장_입력',
        description: '긴 한글 문장 입력',
        inputs: ['ㅇ', 'ㅏ', 'ㄴ', 'ㄴ', 'ㅕ', 'ㅇ', 'ㅎ', 'ㅏ', 'ㅅ', 'ㅔ', 'ㅇ', 'ㅛ'],
        expected: '안녕하세요',
        category: 'mixed',
        priority: 'high'
      },

      // 🔥 Level 7: 백스페이스 테스트
      {
        name: '백스페이스_종성제거',
        description: '백스페이스로 종성 제거',
        inputs: ['ㅎ', 'ㅏ', 'ㄴ', 'backspace'],
        expected: '하',
        category: 'edge',
        priority: 'medium'
      },
      {
        name: '백스페이스_중성제거',
        description: '백스페이스로 중성 제거',
        inputs: ['ㅎ', 'ㅏ', 'backspace'],
        expected: 'ㅎ',
        category: 'edge',
        priority: 'medium'
      },

      // 🔥 Level 8: 혼합 입력 테스트
      {
        name: '숫자_혼합_입력',
        description: '한글과 숫자 혼합 입력',
        inputs: ['ㅎ', 'ㅏ', 'ㄴ', 'ㄱ', 'ㅡ', 'ㄹ', '1', '2', '3'],
        expected: '한글123',
        category: 'mixed',
        priority: 'medium'
      },

      // 🔥 Level 9: 특수 케이스 테스트
      {
        name: '단독_자음_입력',
        description: '자음만 단독 입력',
        inputs: ['ㄱ'],
        expected: 'ㄱ',
        category: 'edge',
        priority: 'low'
      },
      {
        name: '단독_모음_입력',
        description: '모음만 단독 입력 (묵음 초성)',
        inputs: ['ㅏ'],
        expected: '아',
        category: 'edge',
        priority: 'medium'
      },

      // 🔥 Level 10: 성능 테스트
      {
        name: '빠른_연속_입력',
        description: '빠른 속도 연속 입력 시뮬레이션',
        inputs: Array(100).fill(['ㄱ', 'ㅏ']).flat(),
        expected: '가'.repeat(100),
        category: 'performance',
        priority: 'low'
      }
    ];
  }

  /**
   * 🔥 전체 테스트 스위트 실행
   */
  public async runFullTestSuite(): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      passRate: number;
      duration: number;
    };
    results: TestResult[];
    platform: string;
    detectorType: string;
  }> {
    Logger.info(this.componentName, '🔥 한글 입력 시스템 완전 테스트 시작!');
    
    this.startTime = Date.now();
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;

    try {
      // 🔥 컴포넌트 초기화
      await this.initializeComponents();
      
      // 🔥 테스트 케이스 실행
      const testCases = this.getTestCases();
      this.totalTests = testCases.length;
      
      Logger.info(this.componentName, `📋 총 ${this.totalTests}개 테스트 케이스 실행`);
      
      for (const testCase of testCases) {
        const result = await this.runSingleTest(testCase);
        this.testResults.push(result);
        
        if (result.passed) {
          this.passedTests++;
        } else {
          this.failedTests++;
        }
        
        // 🔥 실시간 진행상황 로깅
        if (this.testResults.length % 10 === 0 || !result.passed) {
          Logger.info(this.componentName, `📊 진행상황: ${this.testResults.length}/${this.totalTests} (${result.passed ? '✅' : '❌'} ${testCase.name})`);
        }
      }
      
      const duration = Date.now() - this.startTime;
      const passRate = Math.round((this.passedTests / this.totalTests) * 100 * 100) / 100;
      
      // 🔥 최종 결과 리포트
      this.generateTestReport(passRate, duration);
      
      return {
        summary: {
          total: this.totalTests,
          passed: this.passedTests,
          failed: this.failedTests,
          passRate,
          duration
        },
        results: this.testResults,
        platform: Platform.getPlatformName(),
        detectorType: Platform.isMacOS() ? 'macOS-HIToolbox' : 'Fallback-Keycode'
      };
      
    } catch (error) {
      Logger.error(this.componentName, '❌ 테스트 스위트 실행 실패', error);
      throw error;
    } finally {
      await this.cleanupComponents();
    }
  }

  /**
   * 🔥 컴포넌트 초기화
   */
  private async initializeComponents(): Promise<void> {
    try {
      await this.languageDetector.initialize();
      await this.languageDetector.start();
      
      await this.hangulComposer.initialize();
      await this.hangulComposer.start();
      
      Logger.info(this.componentName, '✅ 테스트 컴포넌트 초기화 완료');
    } catch (error) {
      Logger.error(this.componentName, '❌ 컴포넌트 초기화 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 단일 테스트 실행
   */
  private async runSingleTest(testCase: TestCase): Promise<TestResult> {
    const testStartTime = performance.now();
    const errors: string[] = [];
    
    try {
      Logger.debug(this.componentName, `🧪 테스트 시작: ${testCase.name}`, {
        description: testCase.description,
        inputs: testCase.inputs,
        expected: testCase.expected
      });
      
      // 🔥 조합기 초기화
      this.hangulComposer.resetComposition();
      
      let result = '';
      
      // 🔥 입력 시뮬레이션
      for (const input of testCase.inputs) {
        if (input === ' ') {
          // 스페이스: 조합 완료
          const compResult = this.hangulComposer.processKeyString(' ');
          if (compResult.completed) {
            result += compResult.completed;
          }
          result += ' ';
        } else if (input === 'backspace') {
          // 백스페이스 처리
          const compResult = this.hangulComposer.processKeyString('backspace');
          if (compResult.completed) {
            result += compResult.completed;
          }
          if (compResult.composing) {
            result = result.slice(0, -1) + compResult.composing;
          }
        } else if (/^\d$/.test(input)) {
          // 숫자: 조합 완료 후 추가
          const compResult = this.hangulComposer.processKeyString(' ');
          if (compResult.completed) {
            result += compResult.completed;
          }
          result += input;
        } else {
          // 한글 문자 처리
          const compResult = this.hangulComposer.processKeyString(input);
          
          if (compResult.completed) {
            result += compResult.completed;
          }
          
          // 마지막 입력이거나 다음이 스페이스인 경우 조합 중인 문자도 추가
          const currentIndex = testCase.inputs.indexOf(input);
          const isLast = currentIndex === testCase.inputs.length - 1;
          const nextIsSpace = testCase.inputs[currentIndex + 1] === ' ';
          
          if ((isLast || nextIsSpace) && compResult.composing) {
            result += compResult.composing;
          }
        }
      }
      
      // 🔥 마지막 조합 완료 처리
      const finalResult = this.hangulComposer.processKeyString(' ');
      if (finalResult.completed) {
        result += finalResult.completed;
      }
      
      // 🔥 공백 정리
      result = result.trim();
      
      const duration = performance.now() - testStartTime;
      const passed = result === testCase.expected;
      
      if (!passed) {
        errors.push(`예상: "${testCase.expected}", 실제: "${result}"`);
        Logger.warn(this.componentName, `❌ 테스트 실패: ${testCase.name}`, {
          expected: testCase.expected,
          actual: result,
          inputs: testCase.inputs
        });
      } else {
        Logger.debug(this.componentName, `✅ 테스트 성공: ${testCase.name}`, {
          result,
          duration: `${duration.toFixed(2)}ms`
        });
      }
      
      return {
        testCase,
        actual: result,
        passed,
        duration,
        errors,
        metadata: {
          inputCount: testCase.inputs.length,
          outputLength: result.length
        }
      };
      
    } catch (error) {
      const duration = performance.now() - testStartTime;
      const errorMessage = (error as Error).message;
      errors.push(`실행 오류: ${errorMessage}`);
      
      Logger.error(this.componentName, `💥 테스트 실행 오류: ${testCase.name}`, error);
      
      return {
        testCase,
        actual: '',
        passed: false,
        duration,
        errors,
        metadata: {
          error: errorMessage
        }
      };
    }
  }

  /**
   * 🔥 테스트 리포트 생성
   */
  private generateTestReport(passRate: number, duration: number): void {
    const durationSec = Math.round(duration / 1000 * 100) / 100;
    
    Logger.info(this.componentName, '📊 =========================');
    Logger.info(this.componentName, '📊 한글 입력 시스템 QA 결과');
    Logger.info(this.componentName, '📊 =========================');
    Logger.info(this.componentName, `📊 전체 테스트: ${this.totalTests}개`);
    Logger.info(this.componentName, `✅ 성공: ${this.passedTests}개`);
    Logger.info(this.componentName, `❌ 실패: ${this.failedTests}개`);
    Logger.info(this.componentName, `📊 성공률: ${passRate}%`);
    Logger.info(this.componentName, `⏱️  총 시간: ${durationSec}초`);
    Logger.info(this.componentName, `🖥️  플랫폼: ${Platform.getPlatformName()}`);
    Logger.info(this.componentName, `🔍 감지기: ${Platform.isMacOS() ? 'macOS HIToolbox' : 'Fallback Keycode'}`);
    
    // 🔥 실패한 테스트 상세 리포트
    const failedTests = this.testResults.filter(r => !r.passed);
    if (failedTests.length > 0) {
      Logger.info(this.componentName, '📊 =========================');
      Logger.info(this.componentName, '❌ 실패한 테스트 상세 분석');
      Logger.info(this.componentName, '📊 =========================');
      
      failedTests.forEach((result, index) => {
        Logger.info(this.componentName, `❌ ${index + 1}. ${result.testCase.name}`);
        Logger.info(this.componentName, `   설명: ${result.testCase.description}`);
        Logger.info(this.componentName, `   입력: [${result.testCase.inputs.join(', ')}]`);
        Logger.info(this.componentName, `   예상: "${result.testCase.expected}"`);
        Logger.info(this.componentName, `   실제: "${result.actual}"`);
        Logger.info(this.componentName, `   오류: ${result.errors.join(', ')}`);
      });
    }
    
    // 🔥 최종 판정
    Logger.info(this.componentName, '📊 =========================');
    if (passRate >= 98) {
      Logger.info(this.componentName, '🎉 QA 결과: 완벽! 배포 준비 완료');
    } else if (passRate >= 95) {
      Logger.info(this.componentName, '✅ QA 결과: 우수! 배포 가능');
    } else if (passRate >= 90) {
      Logger.info(this.componentName, '⚠️ QA 결과: 양호하나 개선 권장');
    } else {
      Logger.info(this.componentName, '❌ QA 결과: 수정 필요! 배포 불가');
    }
    Logger.info(this.componentName, '📊 =========================');
  }

  /**
   * 🔥 컴포넌트 정리
   */
  private async cleanupComponents(): Promise<void> {
    try {
      await this.hangulComposer.stop();
      await this.hangulComposer.cleanup();
      
      await this.languageDetector.stop();
      await this.languageDetector.cleanup();
      
      Logger.info(this.componentName, '✅ 테스트 컴포넌트 정리 완료');
    } catch (error) {
      Logger.warn(this.componentName, '⚠️ 컴포넌트 정리 중 오류', error);
    }
  }

  /**
   * 🔥 특정 카테고리만 테스트 실행
   */
  public async runCategoryTests(category: TestCase['category']): Promise<TestResult[]> {
    const testCases = this.getTestCases().filter(tc => tc.category === category);
    
    Logger.info(this.componentName, `🧪 ${category} 카테고리 테스트 실행 (${testCases.length}개)`);
    
    await this.initializeComponents();
    
    try {
      const results: TestResult[] = [];
      
      for (const testCase of testCases) {
        const result = await this.runSingleTest(testCase);
        results.push(result);
      }
      
      return results;
    } finally {
      await this.cleanupComponents();
    }
  }

  /**
   * 🔥 우선순위별 테스트 실행
   */
  public async runPriorityTests(priority: TestCase['priority']): Promise<TestResult[]> {
    const testCases = this.getTestCases().filter(tc => tc.priority === priority);
    
    Logger.info(this.componentName, `🎯 ${priority} 우선순위 테스트 실행 (${testCases.length}개)`);
    
    await this.initializeComponents();
    
    try {
      const results: TestResult[] = [];
      
      for (const testCase of testCases) {
        const result = await this.runSingleTest(testCase);
        results.push(result);
      }
      
      return results;
    } finally {
      await this.cleanupComponents();
    }
  }
}

export const hangulInputTestSuite = new HangulInputTestSuite();
export default hangulInputTestSuite;
