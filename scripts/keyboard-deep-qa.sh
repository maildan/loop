#!/bin/bash

echo "🔥 Loop Keyboard 시스템 Deep QA 시작..."
echo "=========================================="

# 1. uiohook-napi 상태 확인
echo "📦 1. uIOhook-napi 모듈 상태 확인..."
if [ -f "node_modules/uiohook-napi/build/Release/uiohook.node" ]; then
  echo "✅ uiohook 네이티브 바이너리 존재"
  file node_modules/uiohook-napi/build/Release/uiohook.node
  
  # 바이너리 크기와 수정 시간
  ls -la node_modules/uiohook-napi/build/Release/uiohook.node
else
  echo "❌ uiohook 네이티브 바이너리 없음"
  echo "💡 해결책: pnpm rebuild 또는 pnpm add uiohook-napi"
fi

echo ""

# 2. Node.js 환경에서 uiohook 테스트
echo "🧪 2. Node.js 환경에서 uiohook 테스트..."
node -e "
try {
  console.log('🔍 uiohook-napi 모듈 로드 시도...');
  const uiohookModule = require('uiohook-napi');
  console.log('✅ uiohook 모듈 로드 성공');
  console.log('📋 모듈 exports:', Object.keys(uiohookModule));
  
  if (uiohookModule.uIOhook) {
    const uIOhook = uiohookModule.uIOhook;
    console.log('✅ uIOhook 인스턴스 존재');
    console.log('📋 uIOhook 메서드:', Object.getOwnPropertyNames(Object.getPrototypeOf(uIOhook)));
    
    if (typeof uIOhook.start === 'function') {
      console.log('✅ start 함수 존재');
    } else {
      console.log('❌ start 함수 없음');
    }
    
    if (typeof uIOhook.stop === 'function') {
      console.log('✅ stop 함수 존재');
    } else {
      console.log('❌ stop 함수 없음');
    }
  } else {
    console.log('❌ uIOhook 인스턴스 없음');
  }
} catch(e) {
  console.log('❌ uiohook 로드 실패:', e.message);
  console.log('스택 트레이스:', e.stack);
}
"

echo ""

# 3. active-win 모듈 테스트
echo "🪟 3. active-win 모듈 테스트..."
node -e "
try {
  const activeWin = require('active-win');
  console.log('✅ active-win 모듈 로드 성공');
  
  activeWin().then(window => {
    if (window) {
      console.log('✅ 활성 윈도우 감지 성공:', {
        title: window.title,
        owner: window.owner.name,
        platform: window.platform
      });
    } else {
      console.log('⚠️ 활성 윈도우 정보 없음');
    }
  }).catch(err => {
    console.log('❌ 활성 윈도우 감지 실패:', err.message);
  });
} catch(e) {
  console.log('❌ active-win 로드 실패:', e.message);
}
"

echo ""

# 4. TypeScript 컴파일 확인
echo "📝 4. TypeScript 컴파일 확인..."
echo "Main 프로젝트:"
npx tsc --noEmit -p tsconfig.main.json 2>&1 | head -20

echo ""
echo "Renderer 프로젝트:"
cd src/renderer && npx tsc --noEmit 2>&1 | head -10
cd ../..

echo ""

# 5. 키보드 모듈 의존성 확인
echo "🔗 5. 키보드 모듈 의존성 확인..."

echo "🔍 KeyboardService 의존성:"
grep -r "import.*from.*keyboard" src/main/ | grep -v node_modules | head -10

echo ""
echo "🔍 Manager 의존성:"
grep -r "import.*Manager" src/main/keyboard/ | head -10

echo ""

# 6. 권한 관련 확인 (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "🍎 6. macOS 권한 확인..."
  
  # 현재 앱의 접근성 권한 상태
  echo "접근성 권한 요청 가능 여부:"
  /usr/bin/osascript -e 'tell application "System Events" to get UI elements of application process "Finder"' >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "✅ 접근성 권한 있음"
  else
    echo "❌ 접근성 권한 없음"
    echo "💡 시스템 환경설정 > 보안 및 개인정보보호 > 개인정보보호 > 접근성에서 권한 부여 필요"
  fi
fi

echo ""

# 7. 키보드 서비스 파일 무결성 확인
echo "📄 7. 키보드 서비스 파일 무결성 확인..."
echo "KeyboardService 파일 크기:"
wc -l src/main/keyboard/keyboardService.ts

echo ""
echo "핵심 모듈 존재 확인:"
ls -la src/main/managers/KeyboardPermissionManager.ts 2>/dev/null && echo "✅ KeyboardPermissionManager" || echo "❌ KeyboardPermissionManager"
ls -la src/main/managers/KeyboardStatsManager.ts 2>/dev/null && echo "✅ KeyboardStatsManager" || echo "❌ KeyboardStatsManager"
ls -la src/main/managers/SessionManager.ts 2>/dev/null && echo "✅ SessionManager" || echo "❌ SessionManager"
ls -la src/main/keyboard/WindowTracker.ts 2>/dev/null && echo "✅ WindowTracker" || echo "❌ WindowTracker"

echo ""

# 8. 빌드 테스트
echo "🏗️ 8. 빌드 테스트..."
echo "Main 빌드:"
pnpm build:main 2>&1 | tail -5

echo ""

# 9. 키보드 모듈 중복 확인
echo "🔍 9. 키보드 모듈 중복 확인..."
echo "KeyboardService 클래스 정의 수:"
grep -r "class.*KeyboardService" src/ | wc -l

echo ""
echo "SessionManager 클래스 정의 수:"
grep -r "class.*SessionManager" src/ | wc -l

echo ""

# 10. 메모리 사용량 예측
echo "📊 10. 번들 크기 확인..."
if [ -d "dist" ]; then
  echo "Main 번들 크기:"
  du -sh dist/main/
  
  echo "가장 큰 파일들:"
  find dist/main -name "*.js" -exec ls -la {} \; | sort -k5 -nr | head -5
fi

echo ""
echo "🏁 Deep QA 완료!"
echo "=========================================="
