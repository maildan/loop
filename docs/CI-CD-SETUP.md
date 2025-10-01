# 🚀 Loop CI/CD & Auto-Update 설정 완료

## ✅ 구현 완료 항목

### 1. GitHub Actions 워크플로우 (`.github/workflows/release.yml`)
- **트리거**: `v*` 태그 push 시 자동 실행 (예: `v1.1.1`)
- **빌드 환경**: macOS-latest, Node.js 20, pnpm 9
- **자동 수행**:
  - 의존성 설치 및 캐싱
  - Prisma Client 생성
  - 애플리케이션 빌드 (`pnpm build`)
  - DMG 패키징 (`pnpm dist`)
  - GitHub Release 자동 생성 (release notes 포함)
  - DMG, blockmap, latest-mac.yml 자동 업로드

### 2. electron-builder 설정 (`electron-builder.json`)
```json
"publish": {
  "provider": "github",
  "owner": "maildan",
  "repo": "loop",
  "releaseType": "release"
}
```
- GitHub Releases를 자동 업데이트 서버로 사용
- `latest-mac.yml` 자동 생성 ✅ 확인 완료

### 3. electron-updater 통합 (`UpdaterManager.ts`)
- **기능**:
  - 앱 시작 10초 후 첫 업데이트 체크
  - 1시간마다 백그라운드 업데이트 체크
  - 자동 다운로드 활성화
  - 사용자에게 업데이트 알림 다이얼로그
  - 앱 종료 시 자동 설치
- **패키지 환경에서만 작동** (개발 환경 안전)

---

## 🎯 테스트 릴리즈 생성 방법

### Step 1: 버전 업데이트
```bash
# package.json 버전 수정 (1.1.0 → 1.1.1)
code package.json
```

### Step 2: Git 커밋 & 태그
```bash
git add .
git commit -m "chore: release v1.1.1 - CI/CD 및 auto-update 구축"
git tag v1.1.1
git push origin featire/vitev2
git push origin v1.1.1
```

### Step 3: GitHub Actions 모니터링
1. https://github.com/maildan/loop/actions 방문
2. "Release" 워크플로우 실행 확인
3. 빌드 성공 시 자동으로 Release 생성됨

### Step 4: GitHub Release 확인
- https://github.com/maildan/loop/releases
- `v1.1.1` 릴리즈에 다음 파일들이 업로드되었는지 확인:
  - `Loop-1.1.0.dmg` (x64)
  - `Loop-1.1.0-arm64.dmg` (arm64)
  - `Loop-1.1.0.dmg.blockmap`
  - `Loop-1.1.0-arm64.dmg.blockmap`
  - `latest-mac.yml` ← **이 파일이 핵심!**

---

## 🔄 Auto-Update 동작 방식

1. **사용자가 Loop v1.1.0 실행**
2. **10초 후 UpdaterManager가 GitHub Releases 체크**
   - `latest-mac.yml`을 읽어서 최신 버전 확인
3. **새 버전(v1.1.1) 발견 시**:
   - 백그라운드에서 DMG 다운로드
   - 다운로드 완료 시 사용자에게 알림
   - "지금 재시작" 또는 "나중에" 선택
4. **재시작 시 자동으로 v1.1.1로 업그레이드**

---

## 📋 로그 확인

### 앱 실행 시 UpdaterManager 로그 확인:
```bash
# 패키지된 앱 실행
/Users/user/loop/loop/release/mac-arm64/Loop.app/Contents/MacOS/Loop > /tmp/loop-app.log 2>&1 &

# UpdaterManager 로그 필터링
cat /tmp/loop-app.log | grep UPDATER
```

**예상 로그**:
```
ℹ️ [2025-10-01T02:XX:XX.XXXZ] INFO [UPDATER] 🔄 Auto-updater 초기화 시작
ℹ️ [2025-10-01T02:XX:XX.XXXZ] INFO [UPDATER] ✅ Auto-updater 초기화 완료
ℹ️ [2025-10-01T02:XX:XX.XXXZ] INFO [UPDATER] 🔍 업데이트 확인 중...
ℹ️ [2025-10-01T02:XX:XX.XXXZ] INFO [UPDATER] 🎉 새 업데이트 발견! { version: '1.1.1' }
```

---

## 🛠 추후 확장 (Optional)

### Windows & Linux 지원
`.github/workflows/release.yml`의 matrix에 추가:
```yaml
strategy:
  matrix:
    os: [macos-latest, ubuntu-latest, windows-latest]
```

### 코드 사이닝 (macOS Notarization)
GitHub Secrets에 추가:
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `CSC_LINK` (Developer ID Application 인증서 p12 base64)
- `CSC_KEY_PASSWORD`

---

## 🎉 완료!

이제 `git tag v1.1.1 && git push origin v1.1.1` 명령만 실행하면:
1. GitHub Actions가 자동 빌드
2. Release 자동 생성
3. 사용자 앱이 자동 업데이트 감지
4. 원클릭 업그레이드 가능!

**진정한 CI/CD 구축 완료** 🚀
