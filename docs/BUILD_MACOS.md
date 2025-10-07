# macOS 로컬 빌드 & GitHub Release 자동 업로드 가이드

## 🍎 macOS DMG 빌드 + 자동 업로드

이제 `pnpm dist:mac` 실행 시 자동으로 GitHub Release에 업로드됩니다!

### 사전 준비: GitHub Token 설정 (최초 1회)

#### 1. GitHub Personal Access Token 생성

1. https://github.com/settings/tokens/new 접속
2. 설정:
   - **Note**: `Loop macOS Build Token`
   - **Expiration**: `No expiration` (또는 원하는 기간)
   - **권한**: ✅ `repo` (전체 체크)
3. "Generate token" 클릭 → 토큰 복사 (다시 볼 수 없음!)

#### 2. 환경변수 등록

**방법 A: `.zshrc`에 영구 등록 (권장)**

```bash
echo 'export GH_TOKEN="ghp_your_token_here"' >> ~/.zshrc
source ~/.zshrc

# 확인
echo $GH_TOKEN
```

**방법 B: 매번 실행 시 입력**

```bash
export GH_TOKEN="ghp_your_token_here"
pnpm dist:mac
```

**방법 C: `.env.local` 파일**

```bash
echo 'GH_TOKEN=ghp_your_token_here' > .env.local
# .gitignore에 포함되어 있어 안전
```

---

## 🚀 빌드 & 배포 프로세스

### 전체 워크플로우

```bash
# 1. 버전 업데이트 (필요 시)
vim package.json  # "version": "1.1.7"

# 2. 변경사항 커밋 & 푸시
git add .
git commit -m "chore: bump version to 1.1.7"
git push

# 3. 태그 생성 & 푸시
git tag v1.1.7
git push origin v1.1.7

# 4. DMG 빌드 & 자동 업로드 ✨
pnpm dist:mac
```

### 생성되는 파일 (`release/` 디렉토리)

- ✅ `Loop-1.1.7-x64.dmg` (~150-200MB, Intel Mac)
- ✅ `Loop-1.1.7-arm64.dmg` (~150-200MB, Apple Silicon)
- ✅ `Loop-1.1.7-mac.zip` (Universal 압축본)
- ✅ `latest-mac.yml` (auto-update 메타데이터)

**모두 자동으로 GitHub Release에 업로드됩니다!**

---

## 📊 확인 사항

### 빌드 성공 로그

```bash
  • electron-builder  version=26.0.12
  • loaded configuration  file=electron-builder.json
  • building        target=macOS zip
  • building        target=DMG
  • building target platforms  arch=x64, arm64
✔ Building macOS targets... done
✔ Uploading artifacts to GitHub Releases... done  # 이 메시지 확인!
```

### GitHub Release 확인

https://github.com/maildan/loop/releases/tag/v1.1.7

**업로드 확인**:
- ✅ Loop-1.1.7-x64.dmg
- ✅ Loop-1.1.7-arm64.dmg  
- ✅ Loop-1.1.7-mac.zip
- ✅ latest-mac.yml

---

## 🛠 빌드만 하고 업로드 안 하기

```bash
# --publish 플래그 없이 빌드
pnpm build:mac
```

---

## ⚠️ 트러블슈팅

### 1. "GH_TOKEN is not set" 에러

```bash
export GH_TOKEN="your_token"
# 또는 ~/.zshrc 확인
```

### 2. "401 Unauthorized" 에러

- 토큰 권한: `repo` 체크 확인
- 토큰 만료: 재생성 필요

### 3. "Release not found" 경고

```bash
# 태그를 먼저 푸시해야 함
git tag v1.1.7
git push origin v1.1.7
```

### 4. 빌드는 성공, 업로드 실패

```bash
# 수동 업로드 (GitHub CLI)
gh release upload v1.1.7 release/*.dmg --clobber
```

---

## 📝 참고

- **Windows 빌드**: GitHub Actions 자동화 (태그 푸시 시)
- **macOS 빌드**: 로컬에서 수동 실행 (이 가이드)
- **서명/노타리제이션**: Phase 2 (Apple Developer $99/year 필요)

---

## 🔄 전체 Release 워크플로우

### Windows (자동 - GitHub Actions)
```bash
# 1. 태그 생성 & 푸시
git tag v1.1.6
git push origin v1.1.6

# 2. GitHub Actions가 자동으로 빌드 & 업로드
# → https://github.com/maildan/loop/actions
```

### macOS (로컬 빌드 + 수동 업로드)
```bash
# 1. 같은 태그 사용
git tag v1.1.6
git push origin v1.1.6

# 2. 로컬 빌드
pnpm build:mac

# 3. GitHub Release에 수동 업로드
gh release upload v1.1.6 release/*.dmg

# 4. 확인
# → https://github.com/maildan/loop/releases/tag/v1.1.6
```

---

## 🔐 macOS 코드 사이닝 (선택사항)

Apple Developer 계정이 있는 경우:

```bash
# 1. 인증서 Keychain에 설치
# 2. 환경변수 설정
export CSC_NAME="Developer ID Application: Your Name"
export APPLE_ID="your@email.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"

# 3. 빌드 (자동으로 사이닝 & 공증)
pnpm build:mac
```

**없어도 괜찮음**: 빌드는 정상 작동, 사용자가 "신뢰되지 않은 개발자" 경고 무시하면 실행 가능

---

## 📊 빌드 크기 최적화 확인

```bash
# 빌드 후 크기 확인
du -h release/*.dmg

# 예상 크기 (compression: maximum 적용 후)
# - 최적화 전: ~250-300MB
# - 최적화 후: ~150-200MB
```

---

## ❓ 문제 해결

### 빌드 실패 시
```bash
# 캐시 정리
pnpm clean
rm -rf node_modules
pnpm install

# 재빌드
pnpm build:mac
```

### gh 명령어 권한 오류
```bash
# 토큰 재생성
gh auth refresh -s write:packages
```

### 코드 사이닝 실패
```bash
# 사이닝 건너뛰기
CSC_IDENTITY_AUTO_DISCOVERY=false pnpm build:mac
```

---

## 🚀 빠른 참조

| 작업 | 명령어 |
|------|--------|
| macOS 빌드 | `pnpm build:mac` |
| Release 업로드 | `gh release upload v1.x.x release/*.dmg` |
| Release 생성 | `gh release create v1.x.x --generate-notes` |
| Release 확인 | `gh release view v1.x.x` |
| 빌드 정리 | `rm -rf release/` |

---

**Windows는 자동**: `git push origin v1.x.x` 태그 푸시만 하면 GitHub Actions가 알아서 처리합니다. ✅
