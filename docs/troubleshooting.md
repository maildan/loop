# 문제 해결 가이드

## macOS: "Loop이(가) 손상되어 열 수 없습니다" 오류

### 원인
macOS가 서명되지 않은 앱을 보안 이유로 차단합니다.

### 해결 방법

#### 방법 1: 시스템 설정에서 허용
1. **시스템 설정** → **개인 정보 보호 및 보안**으로 이동
2. 아래로 스크롤하면 "Loop"이(가) 차단되었습니다" 메시지 확인
3. **"확인 후 열기"** 버튼 클릭

#### 방법 2: 터미널 명령어 (권장)
```bash
xattr -cr /Applications/Loop.app
```

또는 DMG 파일에 직접 적용:
```bash
xattr -cr ~/Downloads/Loop-1.1.2-arm64.dmg
```

그 다음 DMG를 다시 열면 정상적으로 설치됩니다.

---

## Windows: SmartScreen 경고

Windows에서 "Windows에서 PC를 보호했습니다" 메시지가 나올 수 있습니다.

### 해결 방법
1. **추가 정보** 클릭
2. **실행** 버튼 클릭

---

## 업데이트가 작동하지 않는 경우

1. 인터넷 연결 확인
2. GitHub Release 페이지 확인: https://github.com/maildan/loop/releases
3. 수동으로 최신 버전 다운로드

---

## 앱이 실행되지 않는 경우

### macOS
```bash
# 로그 확인
/Applications/Loop.app/Contents/MacOS/Loop > ~/loop-debug.log 2>&1
```

### Windows
```powershell
# 관리자 권한으로 실행
```

문제가 계속되면 GitHub Issues에 보고해주세요:
https://github.com/maildan/loop/issues
