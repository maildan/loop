# macOS 로컬 빌드 & Release 업로드 가이드

## 🍎 macOS 빌드 방법

### 1. 로컬에서 빌드

```bash
# 의존성 설치 (최초 1회)
pnpm install

# macOS 빌드 실행
pnpm build:mac

# 또는 전체 빌드
pnpm dist:mac
```

**생성 파일 위치**: `release/` 디렉토리
- `Loop-{version}.dmg` - macOS 설치 파일
- `Loop-{version}-arm64.dmg` - Apple Silicon
- `Loop-{version}-x64.dmg` - Intel Mac

---

## 📦 GitHub Release에 업로드

### 2-1. GitHub CLI 사용 (권장)

```bash
# GitHub CLI 설치 (최초 1회)
brew install gh

# 로그인 (최초 1회)
gh auth login

# Release에 DMG 업로드
gh release upload v1.1.6 release/*.dmg

# 특정 파일만 업로드
gh release upload v1.1.6 release/Loop-1.1.6-arm64.dmg
```

### 2-2. GitHub 웹 UI 사용

1. https://github.com/maildan/loop/releases
2. 해당 태그의 Release 편집
3. "Assets" 섹션에 DMG 파일 드래그 & 드롭
4. "Update release" 클릭

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
