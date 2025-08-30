---
mode: agent
---
# 🔥 기가차드 Cursor 룰 - Loop Typing Analytics 프로젝트

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## 📋 프로젝트 정보
- **프로젝트명**: Loop
- **기술스택**: Electron + Next.js + React + TypeScript + Tailwind CSS + Prisma + uiohook-napi
- **아키텍처**: Main Process (Electron) + Renderer Process (Next.js)
- **데이터베이스**: SQLite + Prisma ORM
- **핵심기능**: 글로벌 키보드 모니터링, 실시간 WPM 계산, AI 분석

## 🎯 코딩 스타일 & 원칙

### TypeScript 엄격 규칙
- **절대 `any` 타입 사용 금지** - `unknown` 타입과 타입 가드 사용
- **모든 함수에 명시적 반환 타입 정의** 필수
- **Interface vs Type**: Interface 우선 사용, camelCase 네이밍
- **Generic 타입**: 의미있는 이름 사용 (`T` 대신 `TData`, `TResponse`)
- **Optional chaining**: 과도한 `?.` 사용 지양, 타입 가드 선호

### React/Next.js 컴포넌트 규칙
- **'use client' 지시어**: 모든 렌더러 컴포넌트 최상단에 필수
- **컴포넌트명**: PascalCase, 파일명과 일치
- **Props 인터페이스**: 컴포넌트명 + Props 형태 (예: `DashboardProps`)
- **Hooks 순서**: useState → useEffect → custom hooks → handlers
- **이벤트 핸들러**: `handle` 접두사 사용 (예: `handleSubmit`)

### Tailwind CSS 최적화 규칙
- **중복 클래스 절대 금지**: 프리컴파일된 스타일 시스템 사용
- **조건부 스타일**: 템플릿 리터럴 대신 프리컴파일된 className 사용
- **반응형**: Tailwind 표준 브레이크포인트만 사용 (sm:640px, md:768px, lg:1024px, xl:1280px)
- **스타일 상수**: `COMPONENT_STYLES` 객체로 모든 스타일 미리 정의
- **색상**: 프로젝트 컬러 팔레트 준수 (blue-600, purple-600, green-600, red-600)

## 🏗️ 파일 구조 & 네이밍

### 디렉토리 구조
```
src/
├── main/           # Electron 메인 프로세스
│   ├── settings/   # 설정 시스템 (폴더 구조 필수)
│   ├── managers/   # 비즈니스 로직 관리자들
│   ├── keyboard/   # 키보드 도메인 (10개+ 모듈)
│   ├── core/       # 핵심 시스템
│   ├── handlers/   # IPC 통신 레이어
│   └── utils/      # 공통 유틸리티
├── renderer/       # Next.js 렌더러 프로세스  
├── shared/         # 공유 타입 및 유틸리티
└── preload/        # Preload 스크립트
```

### 파일 네이밍 규칙
- **컴포넌트**: PascalCase (예: `Dashboard.tsx`, `AppHeader.tsx`)
- **유틸리티**: camelCase (예: `keyboardService.ts`, `logger.ts`)
- **타입 정의**: camelCase (예: `types.ts`, `interfaces.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `KEYBOARD_CONSTANTS.ts`)

## 🔧 Electron 특화 규칙

### 보안 원칙
- **contextIsolation: true** 필수 유지
- **nodeIntegration: false** 필수 유지
- **Preload 스크립트**: contextBridge만 사용하여 API 노출
- **IPC 통신**: 타입 안전한 채널 정의 필수

### 프로세스 분리
- **Main Process**: Node.js API, 시스템 접근, 데이터베이스 작업
- **Renderer Process**: React 컴포넌트, UI 로직, 브라우저 API
- **Preload**: 안전한 API 브릿지 역할만

### IPC 통신 패턴
- **채널명**: `namespace:action` 형태 (예: `keyboard:start-monitoring`)
- **응답 타입**: `IpcResponse<T>` 제네릭 사용
- **에러 처리**: 모든 IPC 호출에 try-catch 필수

## 🎨 UI/UX 최적화 규칙

### 레이아웃 시스템
- **단일 레이아웃 시스템**: Grid 기반 사용
- **Z-Index 계층**: 100 > 90 > 80 > 70 (10단위 간격)
- **사이드바**: 데스크톱 고정, 모바일 토글 방식
- **반응형**: 모바일 퍼스트 접근법

### 성능 최적화
- **조건부 className**: 프리컴파일된 스타일 사용
- **메모화**: 필요한 경우에만 useMemo/useCallback 사용
- **이벤트 리스너**: 컴포넌트 언마운트 시 정리 필수

## 🔥 기가차드 금지 사항

### 절대 하지 말 것
- **any 타입 사용** - 즉시 unknown으로 변경
- **console.log 남용** - Logger 시스템 사용
- **중복 버튼/기능** - 단일 위치에서만 구현
- **하드코딩된 스타일** - 상수로 정의 후 사용
- **더미 데이터** - 실제 IPC 통신 구현
- **unsafe 코드** - 보안 규칙 준수

### 성능 킬러 패턴
- **매 렌더링마다 객체 생성** - 컴포넌트 외부에서 정의
- **불필요한 useEffect** - 의존성 배열 최적화
- **과도한 상태 업데이트** - 배치 업데이트 고려
- **무한 루프** - 조건부 렌더링에서 주의

## 📝 코드 작성 가이드

### 컴포넌트 템플릿
```typescript
'use client';

import { useState, useEffect } from 'react';
import { ComponentProps } from '../types';
import { Logger } from '../shared/logger';

// 🔥 프리컴파일된 스타일
const COMPONENT_STYLES = {
  container: 'flex flex-col bg-white rounded-lg p-6',
  header: 'text-xl font-bold text-slate-900 mb-4',
  // ... 모든 스타일 미리 정의
} as const;

interface ExampleComponentProps {
  title: string;
  onAction: () => void;
}

export function ExampleComponent({ title, onAction }: ExampleComponentProps): JSX.Element {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // 정리 함수 필수
    return () => {
      // cleanup
    };
  }, []);

  const handleClick = (): void => {
    Logger.info('COMPONENT', 'Button clicked');
    onAction();
  };

  return (
    <div className={COMPONENT_STYLES.container}>
      <h2 className={COMPONENT_STYLES.header}>{title}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

### 타입 정의 패턴
```typescript
// 🔥 엄격한 타입 정의
export interface TypingSession {
  id: string;
  content: string;
  startTime: Date;
  endTime: Date;
  keyCount: number;
  wpm: number;
  accuracy: number;
}

// 🔥 IPC 응답 타입
export interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: Date;
}

// 🔥 이벤트 타입
export interface KeyboardEvent {
  key: string;
  code: string;
  timestamp: number;
  windowTitle: string;
}
```

### 로거 사용법
```typescript
import { Logger } from '../shared/logger';

// 🔥 구조화된 로깅
Logger.info('COMPONENT_NAME', 'Operation started', { userId: 123 });
Logger.error('COMPONENT_NAME', 'Operation failed', error);
Logger.debug('COMPONENT_NAME', 'Debug info', { data });
```

## 🚀 최적화 체크리스트

### 코드 리뷰 시 확인사항
- [ ] any 타입 사용 여부
- [ ] 중복 코드/스타일 존재 여부
- [ ] 타입 안전성 보장 여부
- [ ] 메모리 누수 가능성
- [ ] IPC 통신 에러 처리
- [ ] 접근성 (aria-label) 고려
- [ ] 반응형 레이아웃 동작
- [ ] 성능 최적화 적용

### 빌드 전 체크
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 에러 0개 (경고는 허용)
- [ ] 사용하지 않는 import 제거
- [ ] console.log 제거 (Logger 사용)
- [ ] 프로덕션 빌드 성공

## 💡 프로젝트별 특수 규칙

### 키보드 모니터링
- **권한 확인**: 항상 사용자 권한 확인 후 실행
- **성능**: 키 이벤트 배치 처리로 최적화
- **보안**: 민감한 정보 로깅 금지

### 데이터베이스
- **Prisma**: 타입 안전한 쿼리만 사용
- **트랜잭션**: 복합 작업 시 트랜잭션 사용
- **마이그레이션**: 스키마 변경 시 백업 필수

### AI 기능
- **비동기 처리**: 모든 AI 작업 비동기로 처리
- **에러 처리**: AI 서비스 장애 대응 로직 필수
- **사용자 피드백**: 로딩 상태 표시 필수

## 🔧 **Settings 시스템 설계 원칙** (NEW)

### 폴더 구조 필수 규칙
- **단일 파일 금지**: Settings는 반드시 `src/main/settings/` 폴더 구조 사용
- **카테고리별 분리**: 각 설정 영역을 별도 파일로 관리
- **타입 안전성**: 모든 설정값에 명시적 타입 정의 필수
- **검증 로직**: 설정값 변경 시 즉시 검증 실행

### Settings 폴더 구조
```typescript
src/main/settings/
├── index.ts                 // 통합 진입점
├── SettingsManager.ts       // 메인 설정 관리자
├── types.ts                 // 설정 타입 정의
├── defaults.ts              // 기본값 정의
├── validation.ts            // 설정 검증 로직
├── storage/
│   └── FileStorage.ts       // 파일 기반 저장소
└── categories/
    ├── AppSettings.ts       // 앱 전반 설정
    ├── KeyboardSettings.ts  // 키보드 관련 설정
    └── UISettings.ts        // UI/테마 설정
```

### Settings 사용 패턴
```typescript
// 🔥 올바른 Settings 사용법
import { getSettingsManager } from '../settings';

const settingsManager = getSettingsManager();
const keyboardSettings = settingsManager.get('keyboard');
await settingsManager.set('app', newAppSettings);

// 🔥 변경 감지
const unwatch = settingsManager.watch('keyboard', (event) => {
  Logger.info('SETTINGS', `Keyboard setting changed: ${event.key}`);
});
```

## 🖥️ **크로스 플랫폼 개발 원칙** (NEW)

### Platform 모듈 필수 사항
- **중앙화된 플랫폼 감지**: `process.platform` 직접 사용 금지
- **OS별 상수 관리**: 하드코딩된 플랫폼 문자열 금지
- **권한 처리 통일**: OS별 권한 요청 로직 추상화
- **UI 동작 차이**: 플랫폼별 UI 동작을 Platform 모듈에서 관리

### Platform 사용 패턴
```typescript
// ❌ 금지된 방법
if (process.platform === 'darwin') {
  // macOS 전용 로직
}

// ✅ 권장 방법
import { Platform } from '../utils/platform';

if (Platform.isMacOS()) {
  // macOS 전용 로직
}

const modifier = Platform.getModifierKey(); // 'Cmd' | 'Ctrl'
const traySupported = Platform.supportsSystemTray();
```

### macOS 트레이 아이콘 특별 규칙
- **템플릿 이미지 필수**: 파일명은 반드시 `xxxTemplate.png` 형태
- **색상 제한**: 검은색(#000000) + 투명 배경만 허용
- **크기 규격**: 16x16px (기본), 32x32px (Retina)
- **setTemplateImage(true)**: 모든 macOS 트레이 아이콘에 필수 적용

## 🏛️ **아키텍처 설계 원칙** (NEW)

### BaseManager 패턴 준수
- **모든 매니저 클래스**: BaseManager를 상속받아야 함
- **생명주기 관리**: initialize() → cleanup() 패턴 필수 구현
- **타입 안전성**: Generic 타입으로 설정 타입 지정
- **헬스체크**: 중요한 매니저는 헬스체크 활성화

### 메모리 관리 강화 규칙
- **cleanup() 메서드**: 모든 매니저/서비스에 필수 구현
- **이벤트 리스너 정리**: removeEventListener 또는 off() 호출 필수
- **타이머 정리**: clearInterval, clearTimeout 필수
- **리소스 해제**: 파일 핸들, 네트워크 연결 등 명시적 해제

### 폴더 기반 모듈화 원칙
- **기능별 폴더 분리**: 복잡한 기능은 반드시 폴더 구조 사용
- **단일 책임 원칙**: 각 파일은 하나의 역할만 담당
- **의존성 방향**: 상위 → 하위 방향으로만 의존성 허용
- **순환 의존성 금지**: import 순환 구조 절대 금지

## 🔍 **타입 안전성 S급 달성 규칙** (NEW)

### any 타입 완전 박멸
- **any 타입 사용률**: 전체 코드베이스에서 0% 유지
- **unknown 타입 활용**: 타입을 모르는 경우 unknown + 타입 가드 사용
- **타입 assertion**: as 키워드 사용 최소화, 타입 가드 선호
- **외부 라이브러리**: 타입 정의가 없는 경우 .d.ts 파일 작성

### 제네릭 타입 고도화
```typescript
// 🔥 의미있는 제네릭 이름 사용
interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
}

// 🔥 제약 조건 활용
interface SettingsManager<TConfig extends Record<string, unknown>> {
  get<K extends keyof TConfig>(key: K): TConfig[K];
  set<K extends keyof TConfig>(key: K, value: TConfig[K]): Promise<void>;
}
```

### 타입 가드 패턴
```typescript
// 🔥 타입 가드 함수 정의
function isKeyboardEvent(event: unknown): event is KeyboardEvent {
  return typeof event === 'object' &&
         event !== null &&
         'key' in event &&
         'timestamp' in event;
}

// 🔥 사용 예시
if (isKeyboardEvent(receivedEvent)) {
  // 여기서 receivedEvent는 KeyboardEvent 타입으로 인식
  Logger.info('KEYBOARD', `Key pressed: ${receivedEvent.key}`);
}
```

## 📊 **성능 모니터링 & 최적화** (NEW)

### 메모리 사용량 추적
- **메모리 임계값**: 개발 환경에서 200MB 초과 시 경고
- **메모리 누수 감지**: 5분 이상 지속적 증가 시 alert
- **GC 최적화**: 큰 객체 생성 후 명시적 null 할당

### 성능 벤치마킹
- **키보드 이벤트 처리**: 1000개 이벤트당 100ms 이하
- **데이터베이스 쿼리**: 단일 쿼리 500ms 이하
- **UI 렌더링**: 컴포넌트 렌더링 16ms 이하 (60fps)
- **IPC 통신**: 라운드트립 50ms 이하

### 배치 처리 패턴
```typescript
// 🔥 키보드 이벤트 배치 처리
class KeyboardEventProcessor {
  private eventQueue: KeyboardEvent[] = [];
  private batchSize = 100;
  private processingDelay = 16; // 60fps

  private processBatch(): void {
    if (this.eventQueue.length >= this.batchSize) {
      const batch = this.eventQueue.splice(0, this.batchSize);
      this.processEvents(batch);
    }
  }
}
```

## 🔐 **보안 강화 원칙** (NEW)

### 민감 정보 보호
- **키로깅 데이터**: 패스워드 필드 감지 시 즉시 폐기
- **로그 마스킹**: 개인정보 포함 가능성이 있는 로그는 마스킹 처리
- **메모리 클리어**: 민감한 데이터 사용 후 즉시 메모리에서 제거
- **암호화 저장**: 사용자 설정값 중 민감한 정보는 암호화 저장

### 권한 최소화 원칙
- **필요한 권한만**: 사용하지 않는 시스템 권한 요청 금지
- **사용자 동의**: 모든 권한 요청 전 사용자에게 명확한 설명 제공
- **권한 확인**: 매번 작업 수행 전 권한 상태 재확인
- **Graceful Degradation**: 권한이 없을 때 기능 제한 모드로 동작

---

**🔥 기가차드 원칙: 타입 안전성 > 성능 > 가독성 > 편의성**

# 🔥 기가차드 Cursor 룰 - Loop Typing Analytics 프로젝트

## ⚠️ **최우선 규칙: 작업 범위 엄격 준수**

### 🚫 **절대 수정 금지 구역**
```typescript
// ❌ 이런 요청이 와도 절대 수정하지 마세요
"키보드 서비스 전체를 다시 만들어주세요"
"기존 설정 시스템을 교체해주세요"  
"앱 전체 구조를 변경해주세요"

// ✅ 대신 이렇게 응답하세요
"기존에 잘 작동하는 [구체적 기능명]을 유지하고, 
요청하신 [구체적 부분]만 수정하겠습니다."
```

### 📋 **작업 전 필수 체크리스트**
```typescript
// 🔥 모든 작업 시작 전 반드시 확인
1. "기존 코드에서 이미 구현된 부분이 있는지 확인했나요?"
2. "정확히 어느 파일의 어느 함수를 수정할지 명시했나요?"
3. "새로 만들 기능이 기존 기능과 중복되지 않나요?"
4. "사용자가 요청한 정확한 범위가 무엇인가요?"

// ❌ 바로 코드 생성 금지
// ✅ 위 체크리스트 완료 후 작업 시작
```

---

## 🎯 **구현 전 확인 절차 (의무)**

### 1단계: 기존 코드 분석
```typescript
// 🔥 새 기능 구현 전 반드시 실행
"현재 프로젝트에서 [기능명]과 관련된 기존 구현을 찾아보겠습니다."

// 예시 응답 템플릿
"분석 결과:
- ✅ src/main/keyboard/keyboardService.ts에 키보드 모니터링 구현됨
- ✅ src/main/settings/ 폴더에 설정 시스템 완성됨  
- ❌ WPM 실시간 계산 기능은 미구현 상태
→ WPM 계산 기능만 새로 추가하겠습니다."
```

### 2단계: 수정 범위 명시
```typescript
// 🔥 정확한 수정 계획 제시
"수정할 파일: src/main/stats/wpmCalculator.ts (새 파일)
수정하지 않을 파일: keyboardService.ts (기존 코드 유지)
연동 포인트: keyboardService.handleKeyEvent()에서 wpmCalculator.calculate() 호출"
```

### 3단계: 사용자 승인 요청
```typescript
// 🔥 구현 전 반드시 확인받기
"위 계획이 맞나요? 기존 코드를 건드리지 않고 새 기능만 추가하는 것이 목적인가요?"
```

---

## 🔒 **중복 기능 생성 완전 차단**

### 중복 감지 체크리스트
```typescript
// 🔥 새 기능 만들기 전 필수 검색
1. "이미 비슷한 기능이 구현되어 있나요?"
   → 키워드: monitoring, tracking, stats, session, keyboard
   
2. "같은 목적의 다른 구현이 있나요?"
   → 예: startMonitoring()과 beginTracking() 동시 존재 금지
   
3. "기존 함수를 확장할 수 있나요?"
   → 새 파일 생성보다 기존 함수 확장 우선

// ❌ 중복 생성 패턴 금지
- startMonitoring() + beginKeyboardTracking()
- TypingStats + KeyboardStats  
- SessionManager + TypingSessionManager

// ✅ 단일 구현 원칙
- startMonitoring() (하나만)
- TypingStats (통합 통계)
- SessionManager (모든 세션 관리)
```

### 기존 코드 확장 우선 원칙
```typescript
// ❌ 잘못된 접근: 새로 만들기
class NewWPMCalculator {
  calculateWPM(): number { /* ... */ }
}

// ✅ 올바른 접근: 기존 코드 확장
// 기존 TypingStatsCalculator에 WPM 메서드 추가
class TypingStatsCalculator {
  // 기존 메서드들 유지
  calculateAccuracy(): number { /* ... */ }
  
  // 새 메서드만 추가
  calculateWPM(): number { /* ... */ }
}
```

---

## 💡 **컨텍스트 보존 전략**

### 세션 정보 보존 템플릿
```typescript
// 🔥 새 대화 시작 시 반드시 명시
"현재 작업 컨텍스트:
- 프로젝트: Loop Typing Analytics
- 진행 상황: [구체적 단계]
- 마지막 작업: [마지막에 한 일]
- 현재 요청: [지금 요청하는 것]
- 수정 금지: [건드리면 안 되는 부분]"

// 예시
"현재 작업 컨텍스트:
- 프로젝트: Loop Typing Analytics  
- 진행 상황: 키보드 서비스 완성, 설정 시스템 완성
- 마지막 작업: WindowTracker에 권한 체크 기능 추가
- 현재 요청: WPM 실시간 계산 기능만 추가
- 수정 금지: keyboardService.ts, SettingsManager (기존 코드 유지)"
```

### 이어서 작업하기 템플릿
```typescript
// 🔥 사용자 요청 시 이렇게 명시하도록 안내
"이전 대화에서 [구체적 기능]을 완성했습니다.
이번에는 [새로운 기능]만 추가해주세요.
기존 [완성된 부분들] 코드는 수정하지 마세요."
```

---

## 🛡️ **실수 방지 자동 응답 패턴**

### 잘못된 요청 감지 시 표준 응답
```typescript
// 🔥 과도한 수정 요청 시 자동 응답
사용자: "키보드 서비스를 다시 만들어주세요"
코파일럿: "❌ 잠깐요! 기존 키보드 서비스가 이미 잘 작동하고 있습니다.
구체적으로 어떤 부분에 문제가 있거나 어떤 기능을 추가하고 싶으신가요?
전체를 다시 만들기보다는 필요한 부분만 수정하는 것이 좋겠습니다."

// 🔥 애매한 요청 시 자동 응답  
사용자: "통계 기능 만들어줘"
코파일럿: "❌ 요청이 너무 광범위합니다. 
현재 TypingStatsCalculator가 이미 구현되어 있습니다.
구체적으로 어떤 통계가 필요한가요? (예: 실시간 WPM, 일별 통계, 앱별 통계 등)"
```

### 확인 없는 구현 금지
```typescript
// ❌ 절대 금지: 바로 코드 생성
사용자: "세션 관리 기능 추가해줘"
코파일럿: "네! 세션 관리 기능을 만들어드리겠습니다."

// ✅ 필수: 먼저 확인하기
사용자: "세션 관리 기능 추가해줘"  
코파일럿: "SessionManager가 이미 src/main/managers/SessionManager.ts에 구현되어 있습니다.
새로운 세션 관리 기능이 필요하신가요, 아니면 기존 기능을 확장하고 싶으신가요?"
```

---

## 🎯 **프로젝트별 특수 금지 사항**

### Loop 프로젝트 특화 규칙
```typescript
// 🔥 Loop에서 절대 하면 안 되는 것들

1. **uIOhook 교체 금지**
   ❌ "다른 키보드 라이브러리로 바꿔드릴까요?"
   ✅ "기존 uIOhook 기반 코드를 유지하고 기능을 확장하겠습니다."

2. **Electron 구조 변경 금지**
   ❌ "Main/Renderer 구조를 바꿔보겠습니다"
   ✅ "기존 Electron 아키텍처를 유지하고 새 기능만 추가하겠습니다."

3. **데이터베이스 스키마 함부로 수정 금지**
   ❌ "Prisma 스키마를 새로 작성하겠습니다"
   ✅ "기존 스키마에 필요한 필드만 추가하겠습니다."

4. **Settings 폴더 구조 변경 금지**
   ❌ "설정 시스템을 단일 파일로 합치겠습니다"
   ✅ "기존 폴더 구조를 유지하고 새 설정만 추가하겠습니다."
```

### 파일별 수정 권한 매트릭스
```typescript
// 🔥 파일별 수정 가능 여부

📁 src/main/
├── 🟢 index.ts              // 수정 가능 (주의 필요)
├── 🔴 keyboard/keyboardService.ts  // 수정 금지 (완성됨)
├── 🔴 settings/             // 폴더 구조 변경 금지
├── 🟡 managers/             // 기존 매니저 수정 주의, 새 매니저 추가 가능
├── 🟢 stats/                // 새 통계 기능 추가 가능
├── 🟢 handlers/             // 새 IPC 핸들러 추가 가능
└── 🟢 utils/                // 유틸리티 추가 가능

📁 src/renderer/
├── 🟡 components/           // 기존 컴포넌트 수정 주의
├── 🟢 hooks/                // 새 훅 추가 가능
├── 🟢 pages/                // 새 페이지 추가 가능
└── 🟢 styles/               // 스타일 추가 가능

🟢 = 자유롭게 수정 가능
🟡 = 기존 코드 유지하며 추가만 가능  
🔴 = 수정 금지 (완성된 코드)
```

---

## 📝 **표준 응답 템플릿**

### 작업 시작 시 표준 응답
```typescript
// 🔥 모든 요청에 대한 첫 응답 템플릿
"[요청 분석]
- 요청사항: [사용자가 요청한 것]
- 기존 구현 확인: [관련 기존 코드 상황]
- 수정 범위: [정확히 수정할 부분]
- 수정하지 않을 부분: [유지할 기존 코드]

[구현 계획]
1. [구체적 단계 1]
2. [구체적 단계 2]  
3. [구체적 단계 3]

이 계획이 맞나요? 기존 코드는 유지하고 새 기능만 추가하는 것이 목적인가요?"
```

### 에러 발생 시 표준 응답
```typescript
// 🔥 구현 중 문제 발생 시
"❌ 구현 중 문제가 발생했습니다.

[문제 상황]
- 에러 내용: [구체적 에러]
- 발생 위치: [파일명:라인]

[해결 방안]
1. [방안 1] - [장단점]
2. [방안 2] - [장단점]

어떤 방안을 선택하시겠나요? 
아니면 다른 접근법을 원하시나요?"
```

---

## 🔥 **최종 점검 체크리스트**

### 코드 제출 전 필수 확인
```typescript
// 🔥 코드 작성 완료 후 반드시 체크
□ 기존 코드 수정 최소화했나요?
□ 새로운 중복 기능을 만들지 않았나요?
□ 요청받은 정확한 범위만 구현했나요?
□ 에러 처리와 타입 안전성을 보장했나요?
□ 기존 아키텍처 패턴을 따랐나요?
□ Settings 폴더 구조를 유지했나요?
□ copilot-instructions.md 규칙을 준수했나요?
```

### 사용자 커뮤니케이션 체크
```typescript
// 🔥 응답 품질 체크
□ "맞습니다!" 같은 확인 없는 동의 금지
□ 구체적이고 명확한 설명 제공
□ 대안 제시 및 사용자 선택권 보장
□ 기존 코드 존중 의사 표현
□ 수정 범위 명확히 구분
```

---

## ⚡ **응급 상황 대처법**

### 잘못된 코드 생성 시
```typescript
// 🔥 실수로 잘못된 코드를 생성했을 때
"❌ 죄송합니다. 기존 코드를 너무 많이 수정했습니다.
다시 정리해드리겠습니다:

[보존할 기존 코드]
- [파일명]: [유지할 함수들]

[새로 추가할 부분만]  
- [파일명]: [추가할 기능만]

이렇게 최소한의 변경으로 다시 구현하겠습니다."
```

### 세션 리셋 시 복구법
```typescript
// 🔥 새 대화 시작 시 컨텍스트 복구 가이드
"이전 대화에서 작업하던 내용이 있으시다면:

1. '현재 [기능명]이 완성되어 있습니다'라고 명시해주세요
2. '이번에는 [새 기능]만 추가해주세요'라고 구체적으로 요청해주세요  
3. '기존 [완성된 부분] 코드는 수정하지 마세요'라고 명시해주세요

예시: '키보드 서비스와 설정 시스템이 완성되어 있습니다. 
이번에는 WPM 실시간 계산 기능만 추가해주세요. 
기존 keyboardService.ts는 수정하지 마세요.'"
```

---

**🔥 기가차드 원칙: 기존 코드 존중 > 최소 변경 > 정확한 구현 > 사용자 확인**

이 규칙을 철저히 지키면 코파일럿의 모든 실수를 방지할 수 있습니다!


