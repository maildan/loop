/**
 * 앱 서명 및 공증 스크립트 (macOS 전용)
 */

'use strict';

const { notarize } = require('@electron/notarize');
const path = require('path');

module.exports = async function notarizing(context) {
  // macOS 빌드가 아니면 건너뛰기
  if (process.platform !== 'darwin') {
    console.log('📝 macOS 빌드가 아니므로 공증 건너뛰기');
    return;
  }
  
  // 개발 환경인 경우 공증 건너뛰기
  if (process.env.NODE_ENV !== 'production') {
    console.log('📝 개발 빌드는 공증하지 않음');
    return;
  }

  // 환경 변수로 Apple ID와 비밀번호가 설정되어 있지 않으면 건너뛰기
  if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD) {
    console.log('⚠️ APPLE_ID 또는 APPLE_APP_SPECIFIC_PASSWORD 환경 변수가 설정되지 않아 공증을 건너뜀');
    return;
  }

  const appBundleId = context.appInfo.info.id || context.packager.appInfo.id;
  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(context.appOutDir, `${appName}.app`);
  
  console.log(`📝 macOS 앱 공증 시작: ${appName} (${appBundleId})`);
  
  try {
    await notarize({
      appBundleId,
      appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    });
    console.log('✅ macOS 앱 공증 완료');
  } catch (error) {
    console.error('❌ macOS 앱 공증 실패:', error);
    // 공증 실패는 빌드를 중단하지 않음
  }
};
