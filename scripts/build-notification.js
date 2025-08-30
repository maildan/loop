/**
 * 빌드 시작 알림 스크립트
 */

'use strict';

console.log('🚀 Loop 빌드 프로세스 시작됨');
console.log(`📦 빌드 대상: ${process.platform}-${process.arch}`);
console.log('⏳ 빌드 최적화 진행 중... 잠시만 기다려주세요.');

module.exports = async function(buildInfo) {
  console.log(`🔧 빌드 시작: ${buildInfo.appInfo.name} v${buildInfo.appInfo.version}`);
};
