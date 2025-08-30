# Loop Typing Analytics - 환경변수 가이드

## 📋 개요

Loop 프로젝트에서 사용하는 모든 환경변수(.env 파일)에 대한 완전한 가이드입니다. 이 문서는 개발, 프로덕션 환경에서 필요한 모든 환경변수를 설명합니다.

## 🔧 환경변수 파일 구조

Loop는 환경별로 다른 .env 파일을 사용합니다:

```
.env                    # 기본 환경변수 (개발/프로덕션 공통)
.env.development        # 개발 환경 전용
.env.production         # 프로덕션 환경 전용
.env.test              # 테스트 환경 전용
.env.local             # 로컬 개발자별 설정 (git ignore)
```

## 🔥 필수 환경변수 (Required)

### Node.js 기본 환경
```bash
# 애플리케이션 실행 환경
NODE_ENV=development
# 가능한 값: development, production, test
# 기본값: development
```

### 포트 설정
```bash
# Next.js 렌더러 프로세스 포트
PORT=3000
# 기본값: 3000
# Electron 메인 프로세스가 이 포트로 렌더러에 연결

# Electron 개발 서버 포트 (개발 환경만)
ELECTRON_DEV_PORT=3000
# 기본값: PORT와 동일
```

### 로깅 설정
```bash
# 로그 레벨 설정
LOG_LEVEL=debug
# 가능한 값: debug, info, warn, error
# 기본값: debug (개발), info (프로덕션)

# 디버그 모드 활성화
DEBUG=true
# 가능한 값: true, false
# 기본값: true (개발), false (프로덕션)

# 상세 로깅 활성화
VERBOSE_LOGGING=true
# 가능한 값: true, false
# 기본값: false
```

## 📊 선택적 환경변수 (Optional)

### Electron 개발 설정
```bash
# Electron 개발 모드 활성화
ELECTRON_IS_DEV=true
# 가능한 값: true, false
# 자동 감지됨 (electron-is-dev 사용)

# DevTools 자동 열기
OPEN_DEVTOOLS=true
# 가능한 값: true, false
# 기본값: false

# Hot Reload 활성화
HOT_RELOAD=true
# 가능한 값: true, false
# 기본값: true (개발)
```

### 데이터베이스 설정
```bash
# 데이터베이스 파일 경로
DATABASE_PATH=./data/app.db
# 기본값: {userData}/app.db

# 데이터베이스 백업 활성화
DB_BACKUP_ENABLED=true
# 기본값: true

# 백업 간격 (밀리초)
DB_BACKUP_INTERVAL=3600000
# 기본값: 1시간 (3600000ms)

# 최대 백업 파일 수
DB_MAX_BACKUPS=10
# 기본값: 10
```

### 키보드 모니터링 설정
```bash
# 키보드 모니터링 자동 시작
AUTO_START_MONITORING=false
# 기본값: false

# 배치 처리 활성화
ENABLE_BATCH_PROCESSING=true
# 기본값: true

# 배치 크기
BATCH_SIZE=100
# 기본값: 100

# 디바운스 지연 (밀리초)
DEBOUNCE_DELAY=300
# 기본값: 300ms
```

### 성능 모니터링
```bash
# 메모리 사용량 모니터링
ENABLE_MEMORY_MONITORING=true
# 기본값: true

# 성능 메트릭 수집
ENABLE_PERFORMANCE_METRICS=true
# 기본값: true

# 헬스 체크 활성화
ENABLE_HEALTH_CHECK=true
# 기본값: true
```

### 보안 설정
```bash
# CSP(Content Security Policy) 활성화
ENABLE_CSP=true
# 기본값: true

# 개발자 도구 접근 허용
ALLOW_DEVTOOLS=true
# 기본값: true (개발), false (프로덕션)

# 외부 리소스 로딩 허용
ALLOW_EXTERNAL_RESOURCES=false
# 기본값: false
```

### UI/UX 설정
```bash
# 기본 테마
DEFAULT_THEME=system
# 가능한 값: light, dark, system
# 기본값: system

# 기본 언어
DEFAULT_LANGUAGE=ko
# 가능한 값: ko, en
# 기본값: ko

# 트레이 아이콘 표시
SHOW_TRAY_ICON=true
# 기본값: true

# 시작 시 최소화
START_MINIMIZED=false
# 기본값: false
```

### 알림 설정
```bash
# 알림 활성화
ENABLE_NOTIFICATIONS=true
# 기본값: true

# 알림 간격 (초)
NOTIFICATION_INTERVAL=60
# 기본값: 60초

# 소리 알림 활성화
ENABLE_SOUND_NOTIFICATIONS=false
# 기본값: false
```

## 🌍 환경별 설정 예시

### .env.development
```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DEBUG=true
VERBOSE_LOGGING=true
OPEN_DEVTOOLS=true
HOT_RELOAD=true
AUTO_START_MONITORING=false
ENABLE_MEMORY_MONITORING=true
ENABLE_PERFORMANCE_METRICS=true
ALLOW_DEVTOOLS=true
```

### .env.production
```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
DEBUG=false
VERBOSE_LOGGING=false
OPEN_DEVTOOLS=false
HOT_RELOAD=false
AUTO_START_MONITORING=true
ENABLE_MEMORY_MONITORING=true
ENABLE_PERFORMANCE_METRICS=false
ALLOW_DEVTOOLS=false
ENABLE_CSP=true
```

### .env.test
```bash
NODE_ENV=test
PORT=3001
LOG_LEVEL=warn
DEBUG=false
VERBOSE_LOGGING=false
AUTO_START_MONITORING=false
ENABLE_MEMORY_MONITORING=false
ENABLE_PERFORMANCE_METRICS=false
DB_BACKUP_ENABLED=false
ENABLE_NOTIFICATIONS=false
```

## 🔧 환경변수 로딩 순서

Loop는 다음 순서로 환경변수를 로딩합니다:

1. **시스템 환경변수** (OS 레벨)
2. **.env.{NODE_ENV}** (환경별 파일)
3. **.env.local** (로컬 개발자 설정)
4. **.env** (기본 설정)

나중에 로딩되는 설정이 이전 설정을 덮어씁니다.

## 📱 플랫폼별 특별 설정

### macOS
```bash
# macOS 트레이 아이콘 템플릿 모드
MACOS_TRAY_TEMPLATE=true
# 기본값: true

# macOS 권한 요청 자동화
MACOS_AUTO_PERMISSIONS=false
# 기본값: false
```

### Windows
```bash
# Windows 시작 프로그램 등록
WINDOWS_AUTO_START=false
# 기본값: false

# Windows 알림 스타일
WINDOWS_NOTIFICATION_STYLE=modern
# 가능한 값: modern, classic
# 기본값: modern
```

### Linux
```bash
# Linux 데스크톱 통합
LINUX_DESKTOP_INTEGRATION=true
# 기본값: true

# X11/Wayland 호환성
LINUX_DISPLAY_SERVER=auto
# 가능한 값: x11, wayland, auto
# 기본값: auto
```

## ⚠️ 중요 참고사항

### 보안 고려사항
- **민감한 정보는 .env.local에 저장**하고 git에 커밋하지 마세요
- **프로덕션에서는 시스템 환경변수** 사용을 권장합니다
- **API 키나 비밀번호**는 절대 .env 파일에 저장하지 마세요

### 성능 고려사항
- **LOG_LEVEL=debug**는 성능에 영향을 줄 수 있습니다
- **VERBOSE_LOGGING=true**는 디스크 사용량을 증가시킵니다
- **ENABLE_PERFORMANCE_METRICS=true**는 메모리 사용량을 증가시킵니다

### 호환성 확인
- **NODE_ENV**는 반드시 설정해야 합니다
- **PORT**는 다른 애플리케이션과 충돌하지 않는 포트를 사용하세요
- **DATABASE_PATH**는 쓰기 권한이 있는 경로를 지정하세요

## 🔍 환경변수 검증

Loop는 시작 시 다음과 같이 환경변수를 검증합니다:

```typescript
// src/main/utils/environment.ts
export function validateEnvironment(): EnvironmentValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // NODE_ENV 검증
  if (!process.env.NODE_ENV) {
    errors.push('NODE_ENV is required');
  }

  // PORT 검증
  const port = parseInt(process.env.PORT || '3000');
  if (isNaN(port) || port < 1024 || port > 65535) {
    warnings.push('PORT should be between 1024-65535');
  }

  // LOG_LEVEL 검증
  const validLogLevels = ['debug', 'info', 'warn', 'error'];
  if (process.env.LOG_LEVEL && !validLogLevels.includes(process.env.LOG_LEVEL)) {
    warnings.push('Invalid LOG_LEVEL, using default');
  }

  return { errors, warnings };
}
```

## 📚 관련 문서

- [Architecture Guide](./docs/api/architecture.md) - 전체 아키텍처 이해
- [Development Setup](./README.md) - 개발 환경 설정
- [Deployment Guide](./docs/deployment.md) - 배포 가이드
- [Troubleshooting](./docs/api/troubleshooting.md) - 문제 해결

---

**🔥 기가차드 원칙**: 모든 환경변수는 명시적으로 정의되고, 기본값이 제공되어야 하며, 검증되어야 합니다.
