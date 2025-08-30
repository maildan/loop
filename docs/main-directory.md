# Loop 프로젝트 - src/main 디렉토리 구조 및 역할

## 전체 구조

```
src/main/
├── common/           # 공통 베이스/매니저, Electron import 등
├── config/           # 앱 설정, 부트스트랩, 이벤트/성능/셧다운 관리
├── core/             # 핵심 IPC 핸들러, MacOS 키보드 등
├── handlers/         # 한글 조합, 키보드 설정, 엔진, 이벤트, 통계, 윈도우 추적 등
├── keyboard/         # 앱/브라우저/클립보드/동기화/DB/핸들러/메모리/세션/단축키/트레이 등
├── managers/         # 키보드 이벤트, OAuth, OpenAI, Prisma, DB, 구글 OAuth, 토큰 등
├── services/         # 설정 매니저, 카테고리별/기본값/스토리지/타입/검증 등
├── settings/         # OAuth 관련
├── types/            # 타입 정의
├── utils/            # 권한/IPC/아이콘/성능/환경/플랫폼 등
├── constants.ts      # 상수 정의
├── dialog-manager.ts # 다이얼로그 매니저
├── index.ts          # 메인 진입점
├── ipc-handlers.ts   # IPC 핸들러 통합
```

## 폴더/파일별 기능 설명

### common/
- BaseManager.ts: 모든 매니저의 베이스 클래스
- electron-imports.ts: Electron 관련 import 및 공통 유틸리티

### config/
- app-config.ts: 앱 설정값 관리
- ApplicationBootstrapper.ts: 앱 부트스트랩 및 초기화
- EventController.ts: 이벤트 흐름 제어
- ManagerCoordinator.ts: 매니저 간 조정
- PerformanceOptimizer.ts: 성능 최적화
- SettingsWatcher.ts: 설정 변경 감지
- ShutdownManager.ts: 앱 종료 관리
- autoLaunch.ts: 자동 실행 설정
- error-handler.ts: 에러 핸들러
- screenshot.ts: 스크린샷 기능
- security.ts: 보안 관련 기능
- window.ts: 윈도우 관리

### core/
- MacOSKeyboardHandler.ts: macOS 키보드 특화 핸들러
- aiIpcHandlers.ts: AI IPC 핸들러
- dashboardIpcHandlers.ts: 대시보드 IPC
- electronStoreSettingsIpcHandlers.ts: Electron Store 기반 설정 IPC
- googleOAuthIpcHandlers.ts: 구글 OAuth IPC
- index.ts: core 진입점
- keyboardIpcHandlers.ts: 키보드 IPC
- oauthIpcHandlers.ts: OAuth IPC
- projectIpcHandlers.ts: 프로젝트 IPC
- settingsIpcHandlers.ts: 설정 IPC
- trayIpcHandlers.ts: 트레이 IPC

### handlers/
- HangulComposer.ts: 한글 조합 로직
- KeyboardConfigManager.ts: 키보드 설정 관리
- KeyboardEngine.ts: 키보드 엔진
- KeyboardEventProcessor.ts: 키보드 이벤트 처리
- MacOSKeycodeTranslator.ts: macOS 키코드 변환
- StatsManager.ts: 타이핑 통계 관리
- UnifiedHandler.ts: 키보드 도메인 통합 Facade
- WindowTracker.ts: 윈도우 추적 및 이벤트 감지
- adapters/: 외부 시스템 연동
- appCategories.ts: 앱 카테고리 정의
- calculators/: 통계/계산 로직
- constants.ts: 핸들러 상수
- detectors/: 키보드/언어 감지
- factories/: 핸들러/감지기 팩토리
- keyboardService.ts: 키보드 서비스
- strategies/: 키보드 전략 패턴

### keyboard/
- AppDetector.ts: 앱 감지
- AppLifecycle.ts: 앱 라이프사이클 관리
- BrowserDetector.ts: 브라우저 감지
- ClipboardWatcher.ts: 클립보드 감시
- DataSyncManager.ts: 데이터 동기화
- DatabaseManager.ts: DB 관리
- HandlersManager.ts: 핸들러 통합 관리
- HealthCheckManager.ts: 헬스체크
- KeyboardStatsManager.ts: 키보드 통계
- MemoryManager.ts: 메모리 관리
- MenuManager.ts: 메뉴 관리
- PowerManager.ts: 전원 관리
- SessionManager.ts: 세션 관리
- ShortcutsManager.ts: 단축키 관리
- TrayManager.ts: 트레이 아이콘 관리

### managers/
- KeyboardEventProcessor.ts: 키보드 이벤트 처리
- OAuthService.ts: OAuth 서비스
- OpenAIService.ts: OpenAI 연동
- PrismaService.ts: Prisma ORM 연동
- databaseService.ts: DB 서비스
- googleOAuthService.ts: 구글 OAuth 서비스
- tokenStorage.ts: 토큰 저장소

### services/
- ElectronStoreSettingsManager.ts: Electron Store 기반 설정 매니저
- SettingsManager.ts: 설정 통합 매니저
- categories/: 카테고리별 설정
- defaults.ts: 기본값 정의
- index.ts: 서비스 진입점
- storage/: 파일/DB 기반 저장소
- types.ts: 설정 타입 정의
- validation.ts: 설정값 검증

### settings/
- oauth.ts: OAuth 관련 설정

### types/
- 타입 및 인터페이스 정의

### utils/
- AutoPermissionManager.ts: 자동 권한 관리
- IPCOptimizer.ts: IPC 최적화
- IconResolver.ts: 아이콘 관리
- PerformanceOptimizer.ts: 성능 최적화
- UnifiedPermissionManager.ts: 통합 권한 관리
- environment.ts: 환경 변수/설정
- platform.ts: 플랫폼 감지/추상화

### 루트 파일
- constants.ts: 프로젝트 상수
- dialog-manager.ts: 다이얼로그 관리
- index.ts: Electron 메인 진입점
- ipc-handlers.ts: IPC 핸들러 통합
