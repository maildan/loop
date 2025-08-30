/**
 * 빌드 완료 알림 스크립트
 */

'use strict';

const path = require('path');
const fs = require('fs');

module.exports = async function(buildInfo) {
  const { artifactPaths, outDir, appInfo } = buildInfo;
  
  console.log('✅ 빌드 완료!');
  console.log(`📦 앱 정보: ${appInfo.name} v${appInfo.version}`);
  
  if (artifactPaths && artifactPaths.length > 0) {
    console.log('\n📦 생성된 파일:');
    for (const artifactPath of artifactPaths) {
      const fileName = path.basename(artifactPath);
      const fileStat = fs.statSync(artifactPath);
      const fileSizeMB = (fileStat.size / (1024 * 1024)).toFixed(2);
      
      console.log(`- ${fileName} (${fileSizeMB} MB)`);
    }
  }
  
  console.log('\n🎉 Loop 빌드가 성공적으로 완료되었습니다!');
  console.log(`출력 경로: ${outDir}`);
};
