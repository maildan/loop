# Browser Detector API

## 개요
`BrowserDetector`는 Loop 프로젝트의 브라우저 및 웹사이트 감지 모듈입니다. 실시간으로 활성 브라우저와 방문 중인 웹사이트를 추적하고, 생산성 분석을 위한 데이터를 제공합니다.

## 주요 기능

### 🔍 브라우저 감지
- Chrome, Firefox, Safari, Edge 등 주요 브라우저 감지
- 브라우저별 활성 탭 URL 추적
- Google Docs 특별 처리 (문서 타이핑 최적화)

### 📊 생산성 분석
- 사이트별 생산성 점수 계산
- 카테고리별 분류 (업무, 학습, 오락, 소셜 등)
- 시간대별 브라우저 사용 패턴 분석

### 🔄 이벤트 기반 시스템
- 실시간 브라우저 변경 감지
- 웹사이트 변경 알림
- 생산성 점수 변경 이벤트

## API 참조

### 클래스: BrowserDetector

#### 생성자
```typescript
constructor()
```

#### 주요 메서드

##### `initialize(): Promise<void>`
- 브라우저 감지기 초기화
- 지원되는 브라우저 목록 설정
- 이벤트 리스너 등록

##### `start(): Promise<void>`
- 브라우저 모니터링 시작
- 주기적 브라우저 상태 체크 활성화

##### `stop(): Promise<void>`
- 브라우저 모니터링 중지
- 모든 타이머 정리

##### `getCurrentBrowser(): BrowserInfo | null`
- 현재 활성 브라우저 정보 반환
```typescript
interface BrowserInfo {
  name: string;
  processName: string;
  url?: string;
  title?: string;
  isGoogleDocs?: boolean;
}
```

##### `getCurrentSite(): SiteInfo | null`
- 현재 방문 중인 사이트 정보 반환
```typescript
interface SiteInfo {
  domain: string;
  url: string;
  title: string;
  category: SiteCategory;
  productivityScore: number;
}
```

##### `getProductivityScore(): number`
- 현재 사이트의 생산성 점수 (0-100)
- 높을수록 업무 관련도가 높음

#### 이벤트

##### `browserChanged`
```typescript
emit('browserChanged', browserInfo: BrowserInfo)
```

##### `siteChanged`
```typescript
emit('siteChanged', siteInfo: SiteInfo)
```

##### `productivityScoreChanged`
```typescript
emit('productivityScoreChanged', score: number)
```

## 설정

### 지원 브라우저
```typescript
const SUPPORTED_BROWSERS = [
  { name: 'Chrome', processName: 'Google Chrome' },
  { name: 'Firefox', processName: 'Firefox' },
  { name: 'Safari', processName: 'Safari' },
  { name: 'Edge', processName: 'Microsoft Edge' }
];
```

### 생산성 점수 계산
```typescript
const PRODUCTIVITY_RULES = {
  work: 90,      // 업무 관련 사이트
  education: 85, // 교육/학습 사이트
  reference: 80, // 참고 자료 사이트
  neutral: 50,   // 중립적 사이트
  social: 30,    // 소셜 미디어
  entertainment: 10 // 오락 사이트
};
```

## 사용 예시

```typescript
import { BrowserDetector } from './managers/BrowserDetector';

const detector = new BrowserDetector();

// 초기화 및 시작
await detector.initialize();
await detector.start();

// 이벤트 리스너 등록
detector.on('browserChanged', (browserInfo) => {
  console.log('브라우저 변경:', browserInfo.name);
});

detector.on('siteChanged', (siteInfo) => {
  console.log('사이트 변경:', siteInfo.domain);
  console.log('생산성 점수:', siteInfo.productivityScore);
});

// 현재 정보 조회
const currentBrowser = detector.getCurrentBrowser();
const currentSite = detector.getCurrentSite();
const productivityScore = detector.getProductivityScore();
```

## 특별 기능

### Google Docs 감지
- Google Docs에서의 타이핑 활동 특별 처리
- 문서 작성 모드 최적화
- 실시간 타이핑 성능 모니터링

### 도메인 분류
- 자동 도메인 카테고리 분류
- 화이트리스트/블랙리스트 지원
- 사용자 정의 규칙 설정 가능

## 로깅

모든 주요 활동은 Logger를 통해 기록됩니다:
- 브라우저 감지 이벤트
- URL 변경 추적
- 생산성 점수 변화
- 에러 및 경고 메시지
