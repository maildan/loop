/**
 * 🔥 electron-builder 빌드 후 실행되는 스크립트
 * 불필요한 파일을 제거하여 앱 크기를 줄입니다.
 */

const fs = require('fs');
const path = require('path');
const { rimraf } = require('rimraf');

/**
 * 특정 디렉토리에서 필요없는 파일을 제거
 */
async function cleanDir(dir, patterns) {
  if (!fs.existsSync(dir)) {
    console.log(`📂 디렉토리가 존재하지 않음: ${dir}`);
    return;
  }

  console.log(`🔍 정리 중: ${dir}`);
  for (const pattern of patterns) {
    const files = await rimraf(path.join(dir, pattern), { glob: true });
    console.log(`🗑️ 제거됨: ${pattern} (${files.length} 파일)`);
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

  // 특정 크기가 큰 모듈 정리
  const nodePaths = [
    path.join(appOutDir, 'resources', 'app.asar.unpacked', 'node_modules'),
    path.join(appOutDir, 'node_modules')
  ];

  for (const nodePath of nodePaths) {
    if (fs.existsSync(nodePath)) {
      // 큰 개발 의존성 정리
      await cleanDir(nodePath, [
        ...commonPatterns,
        // 특정 크기가 큰 모듈들
        '@types/**',
        '**/esm/**', 
        '**/umd/**',
        '**/cjs/**',
      ]);
    }
  }

  console.log('✅ 빌드 후처리 완료');
  return true;
};
