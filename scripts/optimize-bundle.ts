/**
 * 🔥 빌드 최적화 스크립트
 * 
 * 이 스크립트는 다음 작업을 수행합니다:
 * 1. 프로덕션 빌드에서 불필요한 로그와 디버그 코드 제거
 * 2. 디버그 관련 소스맵 파일 제거
 * 3. 번들 크기 최적화
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { execSync } from 'child_process';
import { glob as globPromise } from 'glob';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


// 환경 변수 설정 확인
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  console.log('⚠️ 경고: 이 스크립트는 프로덕션 빌드에서만 실행되어야 합니다.');
  process.exit(1);
}

async function main() {
  console.log('🔥 빌드 최적화 시작...');
  
  // 0. 타임스탬프 기록 시작
  const startTime = Date.now();
  
  // 1. 불필요한 로그/디버그 제거
  console.log('📦 프로덕션 코드에서 불필요한 콘솔 로그 제거 중...');
  await removeDebugLogs();
  
  // 2. 번들 크기 분석
  console.log('📊 번들 크기 분석 중...');
  analyzeBundle();
  
  // 3. 불필요한 타입 정의 파일 제거
  console.log('🧹 불필요한 타입 정의 파일 제거 중...');
  await cleanupTypeDefinitions();
  
  // 4. 앱 데이터 용량 최적화
  console.log('💼 앱 데이터 용량 최적화 중...');
  await optimizeAppData();
  
  // 5. 불필요한 파일 제거
  console.log('🧹 불필요한 파일 제거 중...');
  await removeUnnecessaryFiles();
  
  console.log('✅ 빌드 최적화 완료!');
}

async function removeDebugLogs() {
  // 타겟 js 파일들을 찾음
  const files = await globPromise('./dist/**/*.js', {});
  
  for (const file of files) {
    try {
      let content = await readFile(file, 'utf8');
      
      // console.debug 제거 (프로덕션에서는 불필요)
      content = content.replace(/console\.debug\([^)]*\);?/g, '');
      
      // Logger.debug 호출 제거 (프로덕션에서는 불필요)
      content = content.replace(/Logger\.debug\([^;]*\);?/g, '');
      
      // 개발용 주석 제거
      content = content.replace(/\/\/ DEV ONLY[\s\S]*?\/\/ END DEV ONLY/g, '');
      
      await writeFile(file, content, 'utf8');
    } catch (error) {
      console.error(`파일 처리 중 오류 발생: ${file}`, error);
    }
  }
}

function analyzeBundle() {
  try {
    const mainBundleSize = getDirSize('./dist/main');
    const rendererBundleSize = getDirSize('./dist/renderer');
    const preloadBundleSize = getDirSize('./dist/preload');
    
    console.log('📊 번들 크기 분석:');
    console.log(`- Main 번들: ${formatSize(mainBundleSize)}`);
    console.log(`- Renderer 번들: ${formatSize(rendererBundleSize)}`);
    console.log(`- Preload 번들: ${formatSize(preloadBundleSize)}`);
    console.log(`- 총 번들 크기: ${formatSize(mainBundleSize + rendererBundleSize + preloadBundleSize)}`);
  } catch (error) {
    console.error('번들 크기 분석 중 오류 발생:', error);
  }
}

async function cleanupTypeDefinitions() {
  try {
    // 불필요한 타입 정의 파일 제거
    execSync('rimraf dist/**/*.d.ts');
    execSync('rimraf dist/**/*.js.map');
    console.log('✅ 불필요한 타입 정의 파일 제거 완료');
  } catch (error) {
    console.error('타입 정의 파일 제거 중 오류 발생:', error);
  }
}

// 최적화 기능 추가
async function optimizeAppData() {
  try {
    // 기본 데이터베이스 크기 최적화
    if (fs.existsSync('./prisma/dev.db')) {
      console.log('📊 개발용 데이터베이스 최적화...');
      try {
        // 빈 스키마로 교체하여 용량 최소화
        fs.copyFileSync('./prisma/schema.prisma', './prisma/dev.db');
        console.log('✅ 개발용 데이터베이스 최적화 완료');
      } catch (dbError) {
        console.warn('⚠️ 데이터베이스 최적화 중 오류:', dbError);
      }
    }
    
    console.log('✅ 앱 데이터 용량 최적화 완료');
  } catch (error) {
    console.error('앱 데이터 최적화 중 오류 발생:', error);
  }
}

async function removeUnnecessaryFiles() {
  try {
    // 빌드에 불필요한 파일 제거
    const unnecessaryPatterns = [
      'dist/**/*.LICENSE.txt',
      'dist/**/*.LICENSE',
      'dist/**/*tests*',
      'dist/**/*examples*',
      'dist/**/*.test.js',
      'dist/**/*.spec.js',
      'dist/**/.git*'
    ];
    
    for (const pattern of unnecessaryPatterns) {
      const files = await globPromise(pattern, {});
      for (const file of files) {
        try {
          fs.unlinkSync(file);
        } catch (err) {
          console.warn(`⚠️ 파일 삭제 실패: ${file}`);
        }
      }
    }
    
    console.log('✅ 불필요한 파일 제거 완료');
  } catch (error) {
    console.error('불필요한 파일 제거 중 오류 발생:', error);
  }
}

// 유틸리티 함수
function getDirSize(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0;
  
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 스크립트 실행
main().catch(error => {
  console.error('빌드 최적화 중 오류 발생:', error);
  process.exit(1);
});
