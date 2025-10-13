/**
 * 🔥 electron-builder 빌드 후 실행되는 스크립트
 * 불필요한 파일을 제거하여 앱 크기를 줄입니다.
 */

const fs = require('fs');
const path = require('path');
const { rimraf } = require('rimraf');

/**
 * 특정 디렉토리에서 필요없는 파일을 제거
 * @param {string} dir - 정리할 디렉토리
 * @param {string[]} patterns - 삭제할 파일 패턴
 * @param {string[]} protectedPatterns - 보호할 파일 패턴 (삭제하지 않음)
 */
async function cleanDir(dir, patterns, protectedPatterns = []) {
  if (!fs.existsSync(dir)) {
    console.log(`📂 디렉토리가 존재하지 않음: ${dir}`);
    return;
  }

  console.log(`🔍 정리 중: ${dir}`);
  
  for (const pattern of patterns) {
    // 🔥 Prisma 보호: 패턴이 보호 대상이면 건너뛰기
    const isProtected = protectedPatterns.some(protectedPattern => {
      return pattern.includes('.prisma') || 
             pattern.includes('@prisma') || 
             pattern.includes('prisma') ||
             pattern.includes('.node') ||
             pattern.includes('query-engine');
    });
    
    if (isProtected) {
      console.log(`🛡️ 보호됨 (건너뜀): ${pattern}`);
      continue;
    }
    
    try {
      const files = await rimraf(path.join(dir, pattern), { glob: true });
      console.log(`🗑️ 제거됨: ${pattern} (${files.length} 파일)`);
    } catch (error) {
      console.warn(`⚠️ 제거 실패: ${pattern}`, error.message);
    }
  }
}

/**
 * electron-builder 빌드 후처리 함수
 */
module.exports = async function(context) {
  const { appOutDir, packager, electronPlatformName } = context;
  const arch = context.arch || process.arch;
  const platform = electronPlatformName || process.platform;

  console.log(`
🔧 빌드 후처리 작업 시작
📦 플랫폼: ${platform}
🖥️ 아키텍처: ${arch}
📂 출력 경로: ${appOutDir}
  `);

  // 모든 플랫폼에서 제거할 불필요한 파일 패턴
  const commonPatterns = [
    '**/*.d.ts',
    '**/*.map',
    '**/*.md',
    '**/LICENSE',
    '**/license',
    '**/CHANGELOG',
    '**/readme',
    '**/README',
    '**/test/**',
    '**/tests/**',
    '**/docs/**',
    '**/doc/**',
    '**/example/**',
    '**/examples/**',
  ];

  // 🔥 Prisma 관련 파일 보호 - 절대 삭제하지 않음
  const prismaProtectedPatterns = [
    '**/.prisma/**',
    '**/@prisma/**',
    '**/prisma/**',
    '**/*prisma*/**',
    '**/*.node', // 네이티브 바이너리
    '**/query-engine-*', // Prisma 쿼리 엔진
  ];

  // 특정 크기가 큰 모듈 정리
  const nodePaths = [
    path.join(appOutDir, 'resources', 'app.asar.unpacked', 'node_modules'),
    path.join(appOutDir, 'node_modules')
  ];

  for (const nodePath of nodePaths) {
    if (fs.existsSync(nodePath)) {
      // 큰 개발 의존성 정리 (Prisma는 보호됨)
      await cleanDir(nodePath, [
        ...commonPatterns,
        // 특정 크기가 큰 모듈들
        '@types/**',
        '**/esm/**', 
        '**/umd/**',
        '**/cjs/**',
      ], prismaProtectedPatterns); // 🔥 Prisma 보호 패턴 전달
    }
  }

  // 🔥 Prisma 파일 존재 확인 (검증용)
  const prismaCheckPaths = [
    path.join(appOutDir, 'resources', 'app.asar.unpacked', 'node_modules', '.prisma'),
    path.join(appOutDir, 'resources', 'app.asar.unpacked', 'node_modules', '@prisma'),
  ];
  
  for (const prismaPath of prismaCheckPaths) {
    if (fs.existsSync(prismaPath)) {
      console.log(`✅ Prisma 파일 확인됨: ${prismaPath}`);
    } else {
      console.warn(`⚠️ Prisma 파일 없음: ${prismaPath}`);
    }
  }

  console.log('✅ 빌드 후처리 완료');
  return true;
};
