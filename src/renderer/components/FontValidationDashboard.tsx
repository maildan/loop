// 🔥 Phase 5 Validation UI - 폰트 시스템 테스트 대시보드
'use client';

import React, { useState, useCallback } from 'react';
import { FontPerformanceTester } from '../utils/FontPerformanceTester';
import { FontAccessibilityManager } from '../utils/FontAccessibilityManager';
import { useFont } from '../contexts/FontProvider';

interface TestStatus {
  isRunning: boolean;
  currentTest: string;
  progress: number;
  results: any;
  error: string | null;
}

/**
 * 🔥 폰트 시스템 검증 대시보드 컴포넌트
 */
export function FontValidationDashboard() {
  const [testStatus, setTestStatus] = useState<TestStatus>({
    isRunning: false,
    currentTest: '',
    progress: 0,
    results: null,
    error: null
  });

  const fontContext = useFont();

  /**
   * 🔥 종합 테스트 실행
   */
  const runComprehensiveTest = useCallback(async () => {
    setTestStatus({
      isRunning: true,
      currentTest: '종합 테스트 시작...',
      progress: 0,
      results: null,
      error: null
    });

    try {
      // Phase 1: 성능 테스트
      setTestStatus(prev => ({ ...prev, currentTest: '성능 테스트 실행 중...', progress: 20 }));
      const performanceResults = await FontPerformanceTester.measureFontChangePerformance('Arial', 3);
      
      // Phase 2: TipTap 통합 테스트
      setTestStatus(prev => ({ ...prev, currentTest: 'TipTap 통합 테스트...', progress: 40 }));
      const tipTapResults = await FontPerformanceTester.testTipTapIntegration();
      
      // Phase 3: 접근성 테스트
      setTestStatus(prev => ({ ...prev, currentTest: '접근성 기능 테스트...', progress: 60 }));
      const accessibilityResults = await FontPerformanceTester.testAccessibilityFeatures();
      
      // Phase 4: 접근성 리포트 생성
      setTestStatus(prev => ({ ...prev, currentTest: '접근성 리포트 생성...', progress: 80 }));
      const accessibilityReport = await FontAccessibilityManager.generateAccessibilityReport();
      
      // Phase 5: 종합 검증
      setTestStatus(prev => ({ ...prev, currentTest: '종합 결과 분석...', progress: 90 }));
      const comprehensiveResults = await FontPerformanceTester.runComprehensiveTest();

      const finalResults = {
        performance: performanceResults,
        tipTap: tipTapResults,
        accessibility: accessibilityResults,
        accessibilityReport,
        comprehensive: comprehensiveResults,
        timestamp: new Date().toISOString()
      };

      setTestStatus({
        isRunning: false,
        currentTest: '테스트 완료',
        progress: 100,
        results: finalResults,
        error: null
      });

    } catch (error) {
      setTestStatus(prev => ({
        ...prev,
        isRunning: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        currentTest: '테스트 실패'
      }));
    }
  }, []);

  /**
   * 🔥 성능 테스트만 실행
   */
  const runPerformanceTest = useCallback(async () => {
    setTestStatus({
      isRunning: true,
      currentTest: '성능 테스트 실행 중...',
      progress: 50,
      results: null,
      error: null
    });

    try {
      const results = await FontPerformanceTester.measureFontChangePerformance(
        fontContext.currentFont, 
        5
      );
      
      setTestStatus({
        isRunning: false,
        currentTest: '성능 테스트 완료',
        progress: 100,
        results: { performance: results },
        error: null
      });
    } catch (error) {
      setTestStatus(prev => ({
        ...prev,
        isRunning: false,
        error: error instanceof Error ? error.message : 'Performance test failed'
      }));
    }
  }, [fontContext.currentFont]);

  /**
   * 🔥 결과 렌더링
   */
  const renderResults = () => {
    if (!testStatus.results) return null;

    const { results } = testStatus;

    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">테스트 결과</h3>
        
        {/* 종합 점수 */}
        {results.comprehensive && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">종합 점수</h4>
            <div className="flex items-center mt-2">
              <div className="text-2xl font-bold text-blue-600">
                {results.comprehensive.overall.score}/100
              </div>
              <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                results.comprehensive.overall.passed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {results.comprehensive.overall.passed ? '합격' : '불합격'}
              </div>
            </div>
            {results.comprehensive.overall.recommendations.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-blue-700 font-medium">권장사항:</p>
                <ul className="mt-1 text-sm text-blue-600">
                  {results.comprehensive.overall.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 성능 결과 */}
        {results.performance && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">성능 테스트</h4>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-700">평균 시간</div>
                <div className="text-green-600">{results.performance.averageTime.toFixed(2)}ms</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-700">최소 시간</div>
                <div className="text-green-600">{results.performance.minTime.toFixed(2)}ms</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-700">최대 시간</div>
                <div className="text-green-600">{results.performance.maxTime.toFixed(2)}ms</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-700">성공률</div>
                <div className="text-green-600">{results.performance.successRate.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* TipTap 통합 */}
        {results.tipTap && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900">TipTap 에디터 통합</h4>
            <div className="mt-2 space-y-2">
              <div className={`flex items-center ${results.tipTap.fontInheritance ? 'text-green-600' : 'text-red-600'}`}>
                <span className="mr-2">{results.tipTap.fontInheritance ? '✅' : '❌'}</span>
                <span>폰트 상속</span>
              </div>
              <div className={`flex items-center ${results.tipTap.editorFunctional ? 'text-green-600' : 'text-red-600'}`}>
                <span className="mr-2">{results.tipTap.editorFunctional ? '✅' : '❌'}</span>
                <span>에디터 기능</span>
              </div>
              {results.tipTap.issues.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-purple-700 font-medium">이슈:</p>
                  <ul className="text-sm text-purple-600">
                    {results.tipTap.issues.map((issue: string, idx: number) => (
                      <li key={idx}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 접근성 테스트 */}
        {results.accessibility && (
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900">접근성 기능</h4>
            <div className="mt-2 space-y-2">
              <div className={`flex items-center ${results.accessibility.liveRegionExists ? 'text-green-600' : 'text-red-600'}`}>
                <span className="mr-2">{results.accessibility.liveRegionExists ? '✅' : '❌'}</span>
                <span>Live Region</span>
              </div>
              <div className={`flex items-center ${results.accessibility.rollbackAvailable ? 'text-green-600' : 'text-red-600'}`}>
                <span className="mr-2">{results.accessibility.rollbackAvailable ? '✅' : '❌'}</span>
                <span>롤백 기능</span>
              </div>
              <div className={`flex items-center ${results.accessibility.screenReaderSupport ? 'text-green-600' : 'text-orange-600'}`}>
                <span className="mr-2">{results.accessibility.screenReaderSupport ? '✅' : '⚠️'}</span>
                <span>화면 읽기 도구 지원</span>
              </div>
              <div className={`flex items-center ${results.accessibility.keyboardNavigation ? 'text-green-600' : 'text-red-600'}`}>
                <span className="mr-2">{results.accessibility.keyboardNavigation ? '✅' : '❌'}</span>
                <span>키보드 네비게이션</span>
              </div>
            </div>
          </div>
        )}

        {/* 접근성 리포트 */}
        {results.accessibilityReport && (
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-medium text-indigo-900">접근성 상세 리포트</h4>
            <div className="mt-2 text-sm text-indigo-700">
              <p>롤백 상태: {results.accessibilityReport.rollbackStatesCount}개</p>
              <p>사용자 맞춤설정: {results.accessibilityReport.hasCustomizations ? '있음' : '없음'}</p>
              <p>동작 감소 모드: {results.accessibilityReport.systemSupport.reducedMotion ? '활성' : '비활성'}</p>
              <p>고대비 모드: {results.accessibilityReport.systemSupport.highContrast ? '활성' : '비활성'}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔥 폰트 시스템 검증 대시보드
        </h2>
        <p className="text-gray-600">
          Phase 5: Testing & Validation - 시스템 성능 및 품질 검증
        </p>
      </div>

      {/* 현재 폰트 상태 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">현재 폰트 상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">폰트:</span> {fontContext.currentFont}
          </div>
          <div>
            <span className="font-medium">크기:</span> {fontContext.fontSize}px
          </div>
          <div>
            <span className="font-medium">상태:</span> 
            <span className={fontContext.isLoading ? 'text-orange-600' : 'text-green-600'}>
              {fontContext.isLoading ? ' 로딩 중' : ' 준비됨'}
            </span>
          </div>
        </div>
      </div>

      {/* 테스트 버튼들 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={runComprehensiveTest}
          disabled={testStatus.isRunning}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔥 종합 테스트 실행
        </button>
        <button
          onClick={runPerformanceTest}
          disabled={testStatus.isRunning}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⚡ 성능 테스트만
        </button>
      </div>

      {/* 진행 상태 */}
      {testStatus.isRunning && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{testStatus.currentTest}</span>
            <span className="text-sm text-gray-500">{testStatus.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${testStatus.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 오류 표시 */}
      {testStatus.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900">테스트 오류</h4>
          <p className="text-red-700 mt-1">{testStatus.error}</p>
        </div>
      )}

      {/* 결과 표시 */}
      {renderResults()}
    </div>
  );
}