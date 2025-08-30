# 🔧 Loop 환경변수 설정 가이드

## 📋 필수 환경변수

### 개발 환경 (.env.development)

```bash
# 🔥 기본 환경 설정
NODE_ENV=development
PORT=4000
ELECTRON_PORT=4000

# 🔥 Logger 설정
LOG_LEVEL=debug
DEBUG=true
VERBOSE_LOGGING=true

# 🔥 데이터베이스 설정
DATABASE_URL="file:./dev.db"
PRISMA_DATABASE_URL="file:./dev.db"

# 🔥 보안 설정
ELECTRON_ENABLE_SECURITY_WARNINGS=false
ELECTRON_DISABLE_SECURITY_WARNINGS=true

# 🔥 성능 모니터링
ENABLE_PERFORMANCE_TRACKING=true
MEMORY_MONITORING=true

# 🔥 키보드 모니터링 설정
KEYBOARD_MONITORING_ENABLED=true
KEYBOARD_DEBUG_MODE=true

# 🔥 AI/분석 기능 (개발용)
AI_ANALYSIS_ENABLED=false
MOCK_AI_RESPONSES=true

# 🔥 개발자 도구
REACT_DEVELOPER_TOOLS=true
REDUX_DEVTOOLS=true
```

### 프로덕션 환경 (.env.production)

```bash
# 🔥 기본 환경 설정
NODE_ENV=production
PORT=4000

# 🔥 Logger 설정 (프로덕션용)
LOG_LEVEL=info
DEBUG=false
VERBOSE_LOGGING=false

# 🔥 데이터베이스 설정
DATABASE_URL="file:./app.db"
PRISMA_DATABASE_URL="file:./app.db"

# 🔥 보안 설정 (강화)
ELECTRON_ENABLE_SECURITY_WARNINGS=true
ELECTRON_DISABLE_SECURITY_WARNINGS=false

# 🔥 성능 모니터링
ENABLE_PERFORMANCE_TRACKING=false
MEMORY_MONITORING=true

# 🔥 키보드 모니터링 설정
KEYBOARD_MONITORING_ENABLED=true
KEYBOARD_DEBUG_MODE=false

# 🔥 AI/분석 기능
AI_ANALYSIS_ENABLED=true
MOCK_AI_RESPONSES=false

# 🔥 개발자 도구 (비활성화)
REACT_DEVELOPER_TOOLS=false
REDUX_DEVTOOLS=false
```

### 테스트 환경 (.env.test)

```bash
# 🔥 기본 환경 설정
NODE_ENV=test
PORT=4001

# 🔥 Logger 설정 (최소화)
LOG_LEVEL=error
DEBUG=false
VERBOSE_LOGGING=false

# 🔥 데이터베이스 설정 (테스트용)
DATABASE_URL="file:./test.db"
PRISMA_DATABASE_URL="file:./test.db"

# 🔥 테스트 최적화
KEYBOARD_MONITORING_ENABLED=false
AI_ANALYSIS_ENABLED=false
MOCK_AI_RESPONSES=true

# 🔥 성능 테스트
ENABLE_PERFORMANCE_TRACKING=true
MEMORY_MONITORING=false
```

## 🚀 환경변수 설정 방법

### 1. 개발 환경 설정

```bash
# 프로젝트 루트에 .env.development 파일 생성
cd /Users/user/loop/loop
touch .env.development

# 위의 개발 환경 내용을 복사해서 붙여넣기
```

### 2. 로컬 환경변수 (.env.local) - 개인 설정

```bash
# 🔥 개인별 커스텀 설정 (Git에 추가되지 않음)
LOG_LEVEL=debug
DEBUG=true
VERBOSE_LOGGING=true

# 🔥 개발자별 포트 설정
PORT=4000
ELECTRON_PORT=4000

# 🔥 개인 개발 설정
DEVELOPER_MODE=true
SKIP_ANIMATIONS=false
```

## 📊 Logger 레벨 설정

### LOG_LEVEL 옵션

```bash
# 🔥 로그 레벨별 출력 내용
LOG_LEVEL=debug    # DEBUG, INFO, WARN, ERROR 모두 출력
LOG_LEVEL=info     # INFO, WARN, ERROR 출력
LOG_LEVEL=warn     # WARN, ERROR 출력  
LOG_LEVEL=error    # ERROR만 출력
LOG_LEVEL=silent   # 로그 출력 안함
```

### DEBUG 플래그

```bash
# 🔥 DEBUG 모드 활성화
DEBUG=true         # 모든 DEBUG 로그 출력
DEBUG=false        # DEBUG 로그 숨김

# 🔥 특정 모듈 디버깅
DEBUG=KEYBOARD*    # 키보드 관련 로그만
DEBUG=MAIN*        # 메인 프로세스 로그만
DEBUG=RENDERER*    # 렌더러 프로세스 로그만
```

## 🔧 환경변수 적용 확인

### 1. 개발 서버 실행

```bash
# 🔥 환경변수가 적용된 상태로 실행
pnpm run dev

# 🔥 특정 환경변수로 실행
NODE_ENV=development DEBUG=true pnpm run dev
```

### 2. 환경변수 확인 명령어

```bash
# 🔥 현재 환경변수 확인
echo $NODE_ENV
echo $LOG_LEVEL
echo $DEBUG

# 🔥 모든 Loop 관련 환경변수 확인
env | grep -E "(NODE_ENV|LOG_LEVEL|DEBUG|ELECTRON|KEYBOARD)"
```

## 🐛 문제 해결

### Logger가 안 보일 때

1. **환경변수 확인**
```bash
# .env.development 파일 존재 확인
ls -la .env*

# LOG_LEVEL 확인
grep LOG_LEVEL .env.development
```

2. **DEBUG 플래그 설정**
```bash
# 강제로 DEBUG 모드 실행
DEBUG=true NODE_ENV=development pnpm run dev
```

3. **Logger 설정 확인**
```typescript
// src/shared/logger.ts에서 현재 설정 확인
console.log('Current LOG_LEVEL:', process.env.LOG_LEVEL);
console.log('Current DEBUG:', process.env.DEBUG);
```

### BE 연동 확인 방법

1. **IPC 통신 테스트**
```bash
# 개발자 도구에서 실행
window.electronAPI.invoke('ping').then(console.log);
```

2. **데이터베이스 연결 확인**
```bash
# Prisma Studio 실행 (별도 터미널)
pnpm run dev:db
# http://localhost:5555 접속
```

3. **키보드 서비스 상태 확인**
```bash
# 로그에서 확인할 항목들
grep "Keyboard service" logs/*.log
grep "IPC handlers" logs/*.log
```

## 📝 환경변수 우선순위

1. `process.env` (시스템 환경변수)
2. `.env.local` (로컬 개인 설정)
3. `.env.development` / `.env.production` / `.env.test`
4. `.env` (기본 설정)

## 🔒 보안 주의사항

### .gitignore 확인

```bash
# 다음 파일들이 Git에 추가되지 않는지 확인
.env.local
.env*.local
.env.development.local
.env.production.local
```

### 민감한 정보 관리

```bash
# 🚫 절대 Git에 추가하면 안 되는 정보들
API_KEYS=secret
DATABASE_PASSWORDS=secret
ENCRYPTION_KEYS=secret
```

## 🎯 권장 설정

### 개발자용 최적 설정

```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
DEBUG=true
VERBOSE_LOGGING=true
KEYBOARD_DEBUG_MODE=true
ENABLE_PERFORMANCE_TRACKING=true
```

### CI/CD용 설정

```bash
# .env.test
NODE_ENV=test
LOG_LEVEL=error
DEBUG=false
KEYBOARD_MONITORING_ENABLED=false
AI_ANALYSIS_ENABLED=false
```

이제 환경변수를 설정하고 다시 실행하시면 모든 DEBUG 로그가 정상적으로 출력될 것입니다! 🚀
