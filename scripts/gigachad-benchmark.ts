#!/usr/bin/env tsx
// 🔥 기가차드 벤치마크 - 펔킹 빠른 성능 측정기

import { performance } from 'perf_hooks';
import { promises as fs } from 'fs';
import { join } from 'path';

// #DEBUG: Benchmark entry point
console.time('GIGACHAD_BENCHMARK');

// 🔥 기가차드 벤치마크 타입
interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  opsPerSecond: number;
  memoryUsage: {
    before: NodeJS.MemoryUsage;
    after: NodeJS.MemoryUsage;
    delta: number; // MB
  };
}

interface BenchmarkSuite {
  suiteName: string;
  results: BenchmarkResult[];
  totalOpsPerSecond: number;
  memoryEfficiency: number;
}

// 🔥 기가차드 벤치마크 실행기
class GigaChadBenchmark {
  private results: BenchmarkSuite[] = [];

  async runSuite(suiteName: string, benchmarks: Array<{
    name: string;
    func: () => void | Promise<void>;
    iterations?: number;
  }>): Promise<BenchmarkSuite> {
    // #DEBUG: Running benchmark suite
    console.log(`\n🔥 Running ${suiteName} benchmarks...`);
    
    const suiteResults: BenchmarkResult[] = [];
    
    for (const benchmark of benchmarks) {
      const result = await this.runBenchmark(
        benchmark.name,
        benchmark.func,
        benchmark.iterations || 10000
      );
      suiteResults.push(result);
      
      console.log(`  ✅ ${benchmark.name}: ${result.opsPerSecond.toFixed(0)} ops/sec`);
    }
    
    const suite: BenchmarkSuite = {
      suiteName,
      results: suiteResults,
      totalOpsPerSecond: suiteResults.reduce((sum, r) => sum + r.opsPerSecond, 0),
      memoryEfficiency: this.calculateMemoryEfficiency(suiteResults),
    };
    
    this.results.push(suite);
    return suite;
  }

  private async runBenchmark(
    name: string,
    func: () => void | Promise<void>,
    iterations: number
  ): Promise<BenchmarkResult> {
    // #DEBUG: Running individual benchmark
    
    // 메모리 측정 시작
    global.gc && global.gc(); // 가비지 컬렉션 실행 (가능한 경우)
    const memoryBefore = process.memoryUsage();
    
    // 워밍업
    for (let i = 0; i < Math.min(100, iterations); i++) {
      await func();
    }
    
    // 실제 측정
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      await func();
    }
    
    const endTime = performance.now();
    const memoryAfter = process.memoryUsage();
    
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    const opsPerSecond = 1000 / avgTime;
    
    return {
      name,
      iterations,
      totalTime,
      avgTime,
      opsPerSecond,
      memoryUsage: {
        before: memoryBefore,
        after: memoryAfter,
        delta: (memoryAfter.heapUsed - memoryBefore.heapUsed) / 1024 / 1024,
      },
    };
  }

  private calculateMemoryEfficiency(results: BenchmarkResult[]): number {
    const avgMemoryDelta = results.reduce((sum, r) => sum + r.memoryUsage.delta, 0) / results.length;
    const avgOpsPerSecond = results.reduce((sum, r) => sum + r.opsPerSecond, 0) / results.length;
    
    // 메모리 효율성 = ops/sec per MB
    return avgOpsPerSecond / Math.max(avgMemoryDelta, 0.1);
  }

  async generateReports(): Promise<void> {
    // #DEBUG: Generating benchmark reports
    
    // JSON 스키마 리포트
    const jsonReport = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      suites: this.results,
      summary: {
        totalOpsPerSecond: this.results.reduce((sum, s) => sum + s.totalOpsPerSecond, 0),
        avgMemoryEfficiency: this.results.reduce((sum, s) => sum + s.memoryEfficiency, 0) / this.results.length,
      },
    };
    
    await fs.writeFile('gigachad-benchmark-result.json', JSON.stringify(jsonReport, null, 2));
    
    // 마크다운 테이블 리포트
    const mdReport = this.generateMarkdownReport();
    await fs.writeFile('gigachad-benchmark-report.md', mdReport);
    
    // 콘솔 출력
    console.log('\n🔥 GIGACHAD BENCHMARK SUMMARY:');
    console.log(`📊 Total Ops/Sec: ${jsonReport.summary.totalOpsPerSecond.toFixed(0)}`);
    console.log(`💾 Avg Memory Efficiency: ${jsonReport.summary.avgMemoryEfficiency.toFixed(2)} ops/MB`);
    console.log('✅ Reports saved: gigachad-benchmark-result.json, gigachad-benchmark-report.md');
  }

  private generateMarkdownReport(): string {
    let md = '# 🔥 기가차드 벤치마크 보고서\n\n';
    md += `**생성일**: ${new Date().toLocaleString()}\n`;
    md += `**플랫폼**: ${process.platform} ${process.arch}\n`;
    md += `**Node.js**: ${process.version}\n\n`;
    
    for (const suite of this.results) {
      md += `## ${suite.suiteName}\n\n`;
      md += '| 테스트 | 반복 | 평균 시간(ms) | Ops/Sec | 메모리 사용(MB) |\n';
      md += '|-------|------|---------------|---------|----------------|\n';
      
      for (const result of suite.results) {
        md += `| ${result.name} | ${result.iterations.toLocaleString()} | `;
        md += `${result.avgTime.toFixed(4)} | ${result.opsPerSecond.toFixed(0)} | `;
        md += `${result.memoryUsage.delta.toFixed(2)} |\n`;
      }
      
      md += `\n**스위트 총 Ops/Sec**: ${suite.totalOpsPerSecond.toFixed(0)}\n`;
      md += `**메모리 효율성**: ${suite.memoryEfficiency.toFixed(2)} ops/MB\n\n`;
    }
    
    return md;
  }
}

// 🔥 기가차드 벤치마크 실행
async function main(): Promise<void> {
  try {
    const benchmark = new GigaChadBenchmark();
    
    // 공통 유틸리티 벤치마크
    await benchmark.runSuite('Common Utilities', [
      {
        name: 'Type Guards - isString',
        func: () => {
          const { isString } = require('../src/shared/common');
          isString('test');
          isString(123);
          isString(null);
        },
        iterations: 100000,
      },
      {
        name: 'Type Guards - isNumber',
        func: () => {
          const { isNumber } = require('../src/shared/common');
          isNumber(123);
          isNumber('test');
          isNumber(null);
        },
        iterations: 100000,
      },
      {
        name: 'Array Utils - chunkArray',
        func: () => {
          const { chunkArray } = require('../src/shared/common');
          const arr = Array.from({ length: 100 }, (_, i) => i);
          chunkArray(arr, 10);
        },
        iterations: 10000,
      },
      {
        name: 'String Utils - capitalize',
        func: () => {
          const { capitalize } = require('../src/shared/common');
          capitalize('hello world');
          capitalize('HELLO WORLD');
          capitalize('');
        },
        iterations: 50000,
      },
    ]);
    
    // 로거 벤치마크
    await benchmark.runSuite('Logger System', [
      {
        name: 'Logger - info',
        func: () => {
          const { Logger } = require('../src/shared/logger');
          Logger.info('BENCH', 'Test log message');
        },
        iterations: 10000,
      },
      {
        name: 'Logger - debug',
        func: () => {
          const { Logger } = require('../src/shared/logger');
          Logger.debug('BENCH', 'Test debug message', { data: 'test' });
        },
        iterations: 10000,
      },
    ]);
    
    // IPC 유틸리티 벤치마크
    await benchmark.runSuite('IPC Utilities', [
      {
        name: 'IPC Handler Creation',
        func: () => {
          const { createSafeIpcHandler } = require('../src/shared/ipc-utils');
          createSafeIpcHandler(() => 'test', 'BENCH', 'Test operation');
        },
        iterations: 10000,
      },
      {
        name: 'IPC Handler Execution',
        func: () => {
          const { createSafeIpcHandler } = require('../src/shared/ipc-utils');
          const handler = createSafeIpcHandler(() => 'test', 'BENCH', 'Test operation');
          handler();
        },
        iterations: 10000,
      },
    ]);
    
    // 성능 측정 벤치마크
    await benchmark.runSuite('Performance Tools', [
      {
        name: 'PerformanceTracker - mark',
        func: () => {
          const { PerformanceTracker } = require('../src/shared/common');
          const tracker = new PerformanceTracker();
          tracker.mark('test-operation');
        },
        iterations: 10000,
      },
      {
        name: 'Debounce Function',
        func: () => {
          const { debounce } = require('../src/shared/common');
          const debouncedFunc = debounce(() => {}, 100);
          debouncedFunc();
        },
        iterations: 10000,
      },
    ]);
    
    await benchmark.generateReports();
    
  } catch (error) {
    console.error('Benchmark failed:', error);
  }
}

// #DEBUG: Starting benchmark execution
main().catch(console.error);

console.timeEnd('GIGACHAD_BENCHMARK');
