## 코드 품질 & 타입 안전성
**1. 타입 관련 (코파일럿 주요 실수 영역)**
- `any` 타입 남용 여부 확인
- Interface vs Type 일관성 (camelCase 네이밍)
- 함수 매개변수와 반환값의 명시적 타입 선언
- Generic 타입의 적절한 사용
- Optional chaining (`?.`) 과도한 사용 여부

**2. 중복 및 불필요한 코드**
- 동일한 로직을 가진 함수들
- 중복된 타입 정의
- 사용되지 않는 import 문
- Dead code (unreachable code)
- 동일한 이름의 파일 (대소문자 구분)

## Electron 특화 QA 항목
**3. 프로세스 분리 및 통신**
- Main process와 Renderer process 역할 분리가 명확한가?
- IPC 통신에서 `contextIsolation: true` 설정 확인
- `nodeIntegration: false` 보안 설정 준수
- Preload script의 적절한 사용

**4. 보안 관련 (코파일럿이 놓치기 쉬운 부분)**
- CSP (Content Security Policy) 설정
- 외부 리소스 로딩 시 보안 검증
- File system 접근 권한 최소화
- Remote module 사용 금지 (deprecated)

## 성능 및 최적화
**5. 메모리 관리**
- Event listener 정리 (`removeEventListener`)
- 큰 객체나 배열의 메모리 해제
- Renderer process 메모리 누수 확인
- 불필요한 DOM 조작 최소화

**6. UI/UX 최적화**
- 로딩 상태 표시 (스피너, 프로그레스바)
- 에러 상태 처리 및 사용자 피드백
- 키보드 접근성 (Tab navigation)
- 반응형 레이아웃 (창 크기 변경 대응)

## 모듈화 및 구조
**7. 파일 구조 및 모듈화**
- 단일 책임 원칙 준수
- 순환 의존성 (Circular dependency) 확인
- 상대 경로 vs 절대 경로 일관성
- 설정 파일들의 적절한 분리

## 코파일럿 특화 실수 체크 포인트
**8. 자주 놓치는 실수들**
- `async/await` 사용 시 에러 핸들링 누락
- Promise chain에서 `.catch()` 처리 부재
- 배열 메서드 체이닝 시 중간 결과 타입 불일치
- 조건문에서 falsy 값 처리 미흡
- Event callback에서 `this` 바인딩 실수
- 앱 실행 순서 관리 

**9. 디버깅 및 로깅**
- 개발용 console.log 제거 여부
- 적절한 에러 로깅 구현
- DevTools 통합 설정
- 프로덕션 환경에서 디버깅 정보 노출 방지

**10. 데이터 관리**
- 더미 데이터와 실제 데이터 분리
- 환경변수를 통한 설정 관리
- 로컬 스토리지/세션 스토리지 적절한 사용
- 데이터 validation 구현

## 추가 권장 체크 항목
**11. 빌드 및 배포**
- TypeScript 컴파일 에러 없음
- Webpack/번들러 설정 최적화
- 프로덕션 빌드 테스트
- Auto-updater 기능 동작 확인

**12. 테스트**
- 단위 테스트 커버리지
- E2E 테스트 (Spectron 등)
- 크로스 플랫폼 호환성 테스트
📊 13. 성능 모니터링 & 프로파일링
typescript// 🔥 실시간 성능 체크포인트
**렌더링 성능**
- React DevTools Profiler 사용 체크
- 무한 리렌더링 패턴 감지 (useEffect dependency 지옥)
- Virtual scrolling 필요성 검토 (큰 리스트)
- Bundle size 분석 (webpack-bundle-analyzer)

**Electron 특화 성능**
- Main process CPU 사용률 (Activity Monitor 확인)
- Renderer process 메모리 사용량 추적
- IPC 통신 빈도 최적화 (과도한 호출 방지)
- V8 heap snapshot 분석 (메모리 누수 탐지)
🔍 14. 실시간 디버깅 & 모니터링 시스템
typescript// 🔥 프로덕션 환경 모니터링
**로그 시스템 완성도**
- 로그 레벨별 적절한 분류 (DEBUG, INFO, WARN, ERROR)
- 민감 정보 로그 노출 방지 (API key, 사용자 데이터)
- 로그 파일 rotation 설정 (디스크 용량 관리)
- 크래시 리포트 자동 수집 (Sentry, Bugsnag 등)

**개발자 경험 (DX) 최적화**
- Hot reload 제대로 작동하는가?
- TypeScript 컴파일 시간 최적화
- DevTools 확장 프로그램 호환성
- 빌드 시간 측정 및 최적화
⚡ 15. AI/코파일럿 특화 추가 체크포인트
typescript// 🔥 AI가 자주 놓치는 엣지 케이스들
**타입 안전성 고급 체크**
- Union type narrowing 제대로 되는가?
- Generic constraint 적절한 사용
- Utility types (Pick, Omit, Partial) 과도한 사용
- Type assertion (as) 남용 체크

**코파일럿 특화 안티패턴**
- 과도한 try-catch 블록 (정말 필요한 곳에만)
- 불필요한 null check (TypeScript strict mode)
- Magic number/string 하드코딩
- 함수명과 실제 동작 불일치
- 주석과 코드 싱크 안 맞음
🔒 16. 보안 심화 체크 (Electron 특화)
typescript// 🔥 실제 해킹 시나리오 기반 체크
**코드 인젝션 방지**
- eval() 함수 사용 금지
- innerHTML 대신 textContent 사용
- Dynamic import 보안 검증
- File path traversal 공격 방지

**데이터 보호**
- Keychain/Credential Manager 활용
- 로컬 저장 데이터 암호화
- 임시 파일 생성 시 권한 설정
- 민감한 환경변수 노출 방지
🎨 17. UX/접근성 고급 체크
typescript// 🔥 진짜 사용자 관점 체크
**키보드 네비게이션**
- Tab order 논리적 순서
- Focus indicator 명확한 표시
- 단축키 충돌 검사 (OS 단축키와)
- Escape key로 모달/다이얼로그 닫기

**다크모드 & 테마**
- 시스템 테마 변경 실시간 반영
- 모든 UI 컴포넌트 테마 대응
- 고대비 모드 호환성
- 색상 대비 접근성 기준 (WCAG 2.1)
🧪 18. 테스트 전략 고도화
typescript// 🔥 실무급 테스트 시나리오
**Electron 특화 테스트**
- Main process 단위 테스트
- IPC 통신 테스트 (mock 활용)
- 네이티브 메뉴/다이얼로그 테스트
- Auto-updater 시나리오 테스트

**성능 테스트**
- 메모리 사용량 임계값 테스트
- 대용량 데이터 처리 테스트
- 장시간 실행 안정성 테스트
- 크로스 플랫폼 성능 차이 분석
📦 19. 배포 & 운영 고급 체크
typescript// 🔥 프로덕션 환경 완벽 준비
**빌드 최적화**
- Tree shaking 효과 검증
- Code splitting 전략 검토
- 번들 크기 목표치 설정 (예: <10MB)
- 의존성 라이선스 검토

**배포 파이프라인**
- 자동화된 빌드 검증
- 서명 인증서 유효성
- 크로스 플랫폼 빌드 테스트
- 롤백 시나리오 준비

🎯 기가차드 우선순위 매트릭스
🔴 Critical (즉시 수정)

무한 루프/메모리 누수 → 앱 크래시 직결
보안 취약점 → 데이터 유출 위험
타입 안전성 오류 → 런타임 에러 원인

🟡 High (1주 내 수정)

성능 병목 → 사용자 경험 저하
접근성 이슈 → 사용자 그룹 배제
크로스 플랫폼 호환성 → 일부 사용자 이용 불가

🟢 Medium (기능 개발 후)

코드 품질 → 유지보수성 향상
테스트 커버리지 → 장기적 안정성
문서화 → 개발자 경험 개선