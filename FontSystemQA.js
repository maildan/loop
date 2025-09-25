/**
 * 🔥 폐품트 시스템 종합 QA 도구 v2.0
 * 브라우저 개발자 콘솔에서 실행 가능한 폰트 시스템 검증 도구
 * 
 * 사용법: 브라우저 콘솔에서 runFontQA() 실행
 */

class FontSystemQA {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
    
    console.log('%c🔥 FontSystemQA v2.0 초기화 완료', 'color: #ff6b35; font-weight: bold; font-size: 16px;');
  }

  async runAllTests() {
    console.log('\n%c🚀 폰트 시스템 종합 QA 시작', 'color: #4CAF50; font-weight: bold; font-size: 18px;');
    
    const tests = [
      () => this.testStep1_ElectronAPIAvailability(),
      () => this.testStep2_IPCCommunication(),
      () => this.testStep3_FontServiceStatus(),
      () => this.testStep4_StaticFontsRetrieval(),
      () => this.testStep5_FontCSSGeneration(),
      () => this.testStep6_DOMIntegration(),
      () => this.testStep7_PerformanceValidation()
    ];

    for (let i = 0; i < tests.length; i++) {
      try {
        console.log(`\n%c📋 Step ${i + 1}/7 실행 중...`, 'color: #2196F3; font-weight: bold;');
        await tests[i]();
        this.results.push(`✅ Step ${i + 1}: PASS`);
      } catch (error) {
        console.error(`❌ Step ${i + 1} 실패:`, error);
        this.results.push(`❌ Step ${i + 1}: FAIL - ${error.message}`);
      }
    }

    this.generateReport();
  }

  async testStep1_ElectronAPIAvailability() {
    console.log('🔍 1단계: Electron API 가용성 검사');
    
    if (!window.electronAPI) {
      throw new Error('window.electronAPI가 정의되지 않음 - preload 스크립트 문제');
    }
    
    if (!window.electronAPI.font) {
      throw new Error('window.electronAPI.font가 정의되지 않음 - 폰트 API 누락');
    }

    const requiredMethods = [
      'initialize',
      'getAvailableFonts', 
      'generateCSS',
      'getFontFamily',
      'reload',
      'getStaticFonts'
    ];

    for (const method of requiredMethods) {
      if (typeof window.electronAPI.font[method] !== 'function') {
        throw new Error(`window.electronAPI.font.${method} 메서드가 없음`);
      }
    }

    console.log('✅ Electron API 모든 메서드 확인 완료');
  }

  async testStep2_IPCCommunication() {
    console.log('🔍 2단계: IPC 통신 테스트');
    
    try {
      const initResult = await window.electronAPI.font.initialize();
      console.log('폰트 서비스 초기화 결과:', initResult);
      
      if (!initResult || !initResult.success) {
        throw new Error(`폰트 서비스 초기화 실패: ${initResult?.error || '알 수 없는 오류'}`);
      }

      console.log('✅ IPC 통신 정상 작동');
    } catch (error) {
      throw new Error(`IPC 통신 실패: ${error.message}`);
    }
  }

  async testStep3_FontServiceStatus() {
    console.log('🔍 3단계: FontService 상태 확인');
    
    try {
      const statusResult = await window.electronAPI.font.initialize();
      console.log('FontService 상태:', statusResult);
      
      if (!statusResult.success) {
        throw new Error(`FontService 상태 오류: ${statusResult.error}`);
      }

      const status = statusResult.status;
      if (!status.isInitialized) {
        throw new Error('FontService가 초기화되지 않음');
      }

      if (!status.fontsPathExists) {
        throw new Error(`폰트 디렉토리가 존재하지 않음: ${status.fontsPath}`);
      }

      console.log(`✅ FontService 정상 (경로: ${status.fontsPath})`);
    } catch (error) {
      throw new Error(`FontService 상태 확인 실패: ${error.message}`);
    }
  }

  async testStep4_StaticFontsRetrieval() {
    console.log('🔍 4단계: 정적 폰트 목록 조회');
    
    try {
      const fontsResult = await window.electronAPI.font.getStaticFonts();
      console.log('정적 폰트 조회 결과:', fontsResult);
      
      if (!fontsResult || !fontsResult.success) {
        throw new Error(`폰트 목록 조회 실패: ${fontsResult?.error || '알 수 없는 오류'}`);
      }

      const fonts = fontsResult.data;
      if (!Array.isArray(fonts)) {
        throw new Error('폰트 데이터가 배열이 아님');
      }

      console.log(`✅ 폰트 목록 조회 성공: ${fonts.length}개 폰트 발견`);
      
      if (fonts.length > 0) {
        console.log('📝 폰트 카테고리별 분포:');
        const categories = {};
        fonts.forEach(font => {
          categories[font.category] = (categories[font.category] || 0) + 1;
        });
        console.table(categories);
        
        console.log('📝 첫 5개 폰트:');
        console.table(fonts.slice(0, 5).map(f => ({
          이름: f.name,
          카테고리: f.category,
          크기: `${(f.size / 1024).toFixed(1)}KB`
        })));
      } else {
        console.warn('⚠️ 폰트가 하나도 발견되지 않음 - 스캔 로직 확인 필요');
      }

      return fonts;
    } catch (error) {
      throw new Error(`정적 폰트 조회 실패: ${error.message}`);
    }
  }

  async testStep5_FontCSSGeneration() {
    console.log('🔍 5단계: CSS 생성 테스트');
    
    try {
      const cssResult = await window.electronAPI.font.generateCSS();
      console.log('CSS 생성 결과:', cssResult);
      
      if (!cssResult || !cssResult.success) {
        throw new Error(`CSS 생성 실패: ${cssResult?.error || '알 수 없는 오류'}`);
      }

      const css = cssResult.data;
      if (typeof css !== 'string') {
        throw new Error('생성된 CSS가 문자열이 아님');
      }

      console.log(`✅ CSS 생성 성공 (길이: ${css.length}자)`);
      
      if (css.length > 0) {
        console.log('📝 생성된 CSS 미리보기:');
        console.log(css.substring(0, 300) + (css.length > 300 ? '...' : ''));
      }

      return css;
    } catch (error) {
      throw new Error(`CSS 생성 실패: ${error.message}`);
    }
  }

  async testStep6_DOMIntegration() {
    console.log('🔍 6단계: DOM 통합 테스트');
    
    try {
      // FontProvider 컨텍스트 확인
      const fontProvider = document.querySelector('[data-font-provider]');
      if (fontProvider) {
        console.log('FontProvider 감지됨:', fontProvider);
      }

      // CSS 변수 확인
      const rootStyle = getComputedStyle(document.documentElement);
      const fontFamily = rootStyle.getPropertyValue('--app-font-family').trim();
      const fontSize = rootStyle.getPropertyValue('--app-font-size').trim();
      
      console.log('CSS 변수 상태:', {
        '--app-font-family': fontFamily || '(설정되지 않음)',
        '--app-font-size': fontSize || '(설정되지 않음)'
      });

      // DOM에서 폰트 관련 요소 확인
      const fontElements = document.querySelectorAll('[style*="font-family"], .font-');
      console.log(`폰트 관련 DOM 요소: ${fontElements.length}개`);

      console.log('✅ DOM 통합 상태 확인 완료');
    } catch (error) {
      throw new Error(`DOM 통합 테스트 실패: ${error.message}`);
    }
  }

  async testStep7_PerformanceValidation() {
    console.log('🔍 7단계: 성능 검증');
    
    try {
      const startTime = performance.now();
      
      // 여러 IPC 호출을 병렬로 실행
      const promises = [
        window.electronAPI.font.initialize(),
        window.electronAPI.font.getStaticFonts(),
        window.electronAPI.font.generateCSS()
      ];

      const results = await Promise.all(promises);
      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`병렬 IPC 호출 성능: ${duration.toFixed(2)}ms`);
      
      if (duration > 5000) {
        console.warn('⚠️ IPC 응답 시간이 느림 (5초 초과)');
      }

      // 메모리 사용량 확인 (가능한 경우)
      if (performance.memory) {
        const memory = performance.memory;
        console.log('메모리 사용량:', {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
        });
      }

      console.log('✅ 성능 검증 완료');
    } catch (error) {
      throw new Error(`성능 검증 실패: ${error.message}`);
    }
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    
    console.log('\n%c📊 QA 결과 보고서', 'color: #FF5722; font-weight: bold; font-size: 20px;');
    console.log(`⏱️ 총 실행 시간: ${duration}ms`);
    console.log('\n📋 테스트 결과:');
    
    this.results.forEach(result => {
      console.log(result);
    });

    const passCount = this.results.filter(r => r.includes('PASS')).length;
    const failCount = this.results.filter(r => r.includes('FAIL')).length;
    
    console.log(`\n📈 통계: ${passCount}개 통과, ${failCount}개 실패`);
    
    if (failCount === 0) {
      console.log('%c🎉 모든 테스트 통과! 폰트 시스템이 정상 작동합니다.', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
    } else {
      console.log('%c⚠️ 일부 테스트 실패. 위의 오류 메시지를 확인하세요.', 'color: #FF5722; font-weight: bold; font-size: 16px;');
    }

    return {
      passCount,
      failCount,
      duration,
      results: this.results
    };
  }
}

// 전역 함수로 노출
window.runFontQA = async function() {
  const qa = new FontSystemQA();
  return await qa.runAllTests();
};

// 단축 함수들
window.testFontAPI = async function() {
  console.log('🔍 폰트 API 빠른 테스트');
  try {
    const fonts = await window.electronAPI.font.getStaticFonts();
    console.log('폰트 조회 결과:', fonts);
    return fonts;
  } catch (error) {
    console.error('폰트 API 테스트 실패:', error);
    return null;
  }
};

window.showFontStatus = async function() {
  console.log('🔍 폰트 서비스 상태 확인');
  try {
    const status = await window.electronAPI.font.initialize();
    console.log('폰트 서비스 상태:', status);
    return status;
  } catch (error) {
    console.error('상태 확인 실패:', error);
    return null;
  }
};

console.log('%c🔥 FontSystemQA 로드 완료!', 'color: #ff6b35; font-weight: bold;');
console.log('%c📋 사용법:', 'color: #2196F3; font-weight: bold;');
console.log('  runFontQA()     - 전체 QA 테스트 실행');
console.log('  testFontAPI()   - 폰트 API 빠른 테스트');
console.log('  showFontStatus() - 폰트 서비스 상태 확인');