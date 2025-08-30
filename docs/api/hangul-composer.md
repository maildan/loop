# HangulComposer API 가이드

## 개요

HangulComposer는 Loop Typing Analytics의 한글 조합 시스템으로, 실시간 한글 입력 처리, 조합, 분해, 오토마타 기반 상태 관리를 담당합니다. 완벽한 한글 입력 분석을 위한 핵심 컴포넌트입니다.

## 주요 기능

- 🇰🇷 **완벽한 한글 조합**: 초성, 중성, 종성 조합 처리
- 🔄 **실시간 처리**: 키 입력에 따른 즉시 조합 상태 업데이트
- 🧠 **오토마타 기반**: 한글 입력 규칙에 따른 상태 관리
- ⏱️ **자동 완료**: 타임아웃 기반 조합 완료
- 🔍 **상태 추적**: 조합 진행 상황 실시간 모니터링

## API 레퍼런스

### HangulComposer 클래스

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

const hangulComposer = new HangulComposer();
```

#### 생명주기 메서드

##### `initialize()`

HangulComposer를 초기화합니다.

```typescript
await hangulComposer.initialize();
```

**반환값**: `Promise<void>`

##### `start()`

한글 조합 처리를 시작합니다.

```typescript
await hangulComposer.start();
```

**반환값**: `Promise<void>`

##### `stop()`

한글 조합 처리를 중지합니다.

```typescript
await hangulComposer.stop();
```

**반환값**: `Promise<void>`

#### 조합 처리

##### `processKey()`

키 입력을 처리하여 한글 조합을 수행합니다.

```typescript
const result = hangulComposer.processKey('ㄱ');
console.log(result);
// {
//   completed: '',
//   composing: 'ㄱ',
//   isComposing: true
// }

const result2 = hangulComposer.processKey('ㅏ');
console.log(result2);
// {
//   completed: '',
//   composing: '가',
//   isComposing: true
// }
```

**매개변수**:
- `char: string` - 입력된 문자

**반환값**: `HangulCompositionResult`

##### `finishComposition()`

현재 진행 중인 조합을 강제로 완료합니다.

```typescript
const completed = hangulComposer.finishComposition();
console.log(completed); // '가'
```

**반환값**: `string` - 완성된 글자

##### `resetComposition()`

조합 상태를 초기화합니다.

```typescript
hangulComposer.resetComposition();
```

**반환값**: `void`

#### 상태 조회

##### `getCompositionState()`

현재 조합 상태를 반환합니다.

```typescript
const state = hangulComposer.getCompositionState();
console.log(state);
// {
//   isComposing: true,
//   initial: 'ㄱ',
//   medial: 'ㅏ',
//   final: '',
//   current: '가'
// }
```

**반환값**: `HangulCompositionState`

##### `isHangulKey()`

입력된 키가 한글 키인지 확인합니다.

```typescript
const isHangul = hangulComposer.isHangulKey('ㄱ');
console.log(isHangul); // true

const isNotHangul = hangulComposer.isHangulKey('a');
console.log(isNotHangul); // false
```

**매개변수**:
- `char: string` - 확인할 문자

**반환값**: `boolean`

##### `healthCheck()`

시스템 헬스 체크를 수행합니다.

```typescript
const health = await hangulComposer.healthCheck();
console.log(health);
// {
//   healthy: true,
//   uptime: 3600000,
//   isComposing: false,
//   keyMappingCount: 68
// }
```

**반환값**: `Promise<HealthCheckResult>`

## 이벤트

HangulComposer는 EventEmitter를 확장하여 다음 이벤트를 발생시킵니다:

### `composition-started`

한글 조합이 시작될 때 발생합니다.

```typescript
hangulComposer.on('composition-started', (char: string) => {
  console.log('Composition started with:', char);
});
```

### `composition-updated`

조합이 업데이트될 때 발생합니다.

```typescript
hangulComposer.on('composition-updated', (result: HangulCompositionResult) => {
  console.log('Composition updated:', result.composing);
});
```

### `composition-completed`

조합이 완료될 때 발생합니다.

```typescript
hangulComposer.on('composition-completed', (completed: string) => {
  console.log('Composition completed:', completed);
});
```

### `composition-cancelled`

조합이 취소될 때 발생합니다.

```typescript
hangulComposer.on('composition-cancelled', () => {
  console.log('Composition cancelled');
});
```

## 타입 정의

### HangulCompositionState

```typescript
interface HangulCompositionState {
  isComposing: boolean;    // 조합 중 여부
  initial: string;         // 초성
  medial: string;          // 중성
  final: string;           // 종성
  current: string;         // 현재 조합된 글자
}
```

### HangulCompositionResult

```typescript
interface HangulCompositionResult {
  completed: string;       // 완성된 글자
  composing: string;       // 조합 중인 글자
  isComposing: boolean;    // 조합 중 여부
}
```

### HangulKeyType

```typescript
type HangulKeyType = 'initial' | 'medial' | 'final' | 'other';
```

## 사용 예제

### 기본 사용법

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

const hangulComposer = new HangulComposer();

// 초기화 및 시작
await hangulComposer.initialize();
await hangulComposer.start();

// 한글 입력 시뮬레이션: "안녕"
const chars = ['ㅇ', 'ㅏ', 'ㄴ', 'ㄴ', 'ㅕ', 'ㅇ'];
let result = '';

for (const char of chars) {
  const composition = hangulComposer.processKey(char);
  
  if (composition.completed) {
    result += composition.completed;
  }
  
  console.log(`Input: ${char}, Composing: ${composition.composing}, Completed: ${composition.completed}`);
}

// 마지막 조합 완료
const final = hangulComposer.finishComposition();
if (final) {
  result += final;
}

console.log('Final result:', result); // "안녕"
```

### 실시간 타이핑 모니터링

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

const hangulComposer = new HangulComposer();

// 조합 상태 모니터링
hangulComposer.on('composition-updated', (result) => {
  const state = hangulComposer.getCompositionState();
  
  console.log('=== Composition Status ===');
  console.log(`Initial: ${state.initial}`);
  console.log(`Medial: ${state.medial}`);
  console.log(`Final: ${state.final}`);
  console.log(`Current: ${state.current}`);
  console.log(`Composing: ${result.composing}`);
  console.log('========================');
});

// 완성된 글자 수집
let completedText = '';

hangulComposer.on('composition-completed', (completed) => {
  completedText += completed;
  console.log(`Completed character: ${completed}`);
  console.log(`Full text so far: ${completedText}`);
});

// 키 입력 처리 함수
const handleKeyInput = (char: string) => {
  if (hangulComposer.isHangulKey(char)) {
    hangulComposer.processKey(char);
  } else {
    // 한글이 아닌 키가 입력되면 조합 완료
    const completed = hangulComposer.finishComposition();
    if (completed) {
      completedText += completed;
    }
    
    // 한글이 아닌 문자 추가
    completedText += char;
  }
};

// 사용 예제
handleKeyInput('ㅎ');
handleKeyInput('ㅏ');
handleKeyInput('ㄴ');
handleKeyInput('ㄱ');
handleKeyInput('ㅡ');
handleKeyInput('ㄹ');
handleKeyInput(' '); // 공백으로 조합 완료
handleKeyInput('ㅇ');
handleKeyInput('ㅓ');
// 결과: "한글 어"
```

### 한글 입력 분석기

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

class HangulAnalyzer {
  private hangulComposer: HangulComposer;
  private stats = {
    totalCompositions: 0,
    completedCharacters: 0,
    averageCompositionTime: 0,
    compositionStartTime: 0
  };

  constructor() {
    this.hangulComposer = new HangulComposer();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.hangulComposer.on('composition-started', () => {
      this.stats.compositionStartTime = Date.now();
    });

    this.hangulComposer.on('composition-completed', (completed) => {
      this.stats.completedCharacters++;
      
      if (this.stats.compositionStartTime > 0) {
        const compositionTime = Date.now() - this.stats.compositionStartTime;
        this.stats.averageCompositionTime = 
          (this.stats.averageCompositionTime * (this.stats.completedCharacters - 1) + compositionTime) / 
          this.stats.completedCharacters;
      }
      
      console.log(`Character completed: ${completed}`);
      console.log(`Total characters: ${this.stats.completedCharacters}`);
      console.log(`Average composition time: ${this.stats.averageCompositionTime.toFixed(2)}ms`);
    });

    this.hangulComposer.on('composition-updated', () => {
      this.stats.totalCompositions++;
    });
  }

  public async analyze(text: string): Promise<void> {
    await this.hangulComposer.initialize();
    await this.hangulComposer.start();

    console.log(`Analyzing text: "${text}"`);
    console.log('=================================');

    for (const char of text) {
      if (this.hangulComposer.isHangulKey(char)) {
        this.hangulComposer.processKey(char);
      } else {
        // 한글이 아닌 문자 처리
        const completed = this.hangulComposer.finishComposition();
        if (completed) {
          // composition-completed 이벤트가 발생
        }
      }
    }

    // 마지막 조합 완료
    const final = this.hangulComposer.finishComposition();
    if (final) {
      // composition-completed 이벤트가 발생
    }

    console.log('=================================');
    console.log('Analysis Summary:');
    console.log(`Total compositions: ${this.stats.totalCompositions}`);
    console.log(`Completed characters: ${this.stats.completedCharacters}`);
    console.log(`Average composition time: ${this.stats.averageCompositionTime.toFixed(2)}ms`);
  }

  public getStats() {
    return { ...this.stats };
  }
}

// 사용 예제
const analyzer = new HangulAnalyzer();
await analyzer.analyze('안녕하세요 반갑습니다');
```

### 입력 오류 감지

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

class HangulErrorDetector {
  private hangulComposer: HangulComposer;
  private errorCount = 0;
  private corrections = 0;

  constructor() {
    this.hangulComposer = new HangulComposer();
    this.setupErrorDetection();
  }

  private setupErrorDetection(): void {
    this.hangulComposer.on('composition-updated', (result) => {
      const state = this.hangulComposer.getCompositionState();
      
      // 잘못된 조합 패턴 감지
      if (this.isInvalidComposition(state)) {
        this.errorCount++;
        console.warn(`Invalid composition detected: ${result.composing}`);
        console.warn(`State: initial=${state.initial}, medial=${state.medial}, final=${state.final}`);
      }
    });

    this.hangulComposer.on('composition-cancelled', () => {
      this.corrections++;
      console.log('Composition cancelled - possible correction');
    });
  }

  private isInvalidComposition(state: HangulCompositionState): boolean {
    // 중성 없이 종성이 있는 경우
    if (!state.medial && state.final) {
      return true;
    }

    // 초성 없이 중성이 있는 경우 (일부 케이스)
    if (!state.initial && state.medial) {
      return true;
    }

    return false;
  }

  public async detectErrors(text: string): Promise<{
    errors: number;
    corrections: number;
    accuracy: number;
  }> {
    await this.hangulComposer.initialize();
    await this.hangulComposer.start();

    this.errorCount = 0;
    this.corrections = 0;

    for (const char of text) {
      if (this.hangulComposer.isHangulKey(char)) {
        this.hangulComposer.processKey(char);
      } else {
        this.hangulComposer.finishComposition();
      }
    }

    this.hangulComposer.finishComposition();

    const totalAttempts = this.errorCount + this.corrections + text.length;
    const accuracy = totalAttempts > 0 ? ((totalAttempts - this.errorCount) / totalAttempts) * 100 : 100;

    return {
      errors: this.errorCount,
      corrections: this.corrections,
      accuracy: Math.round(accuracy * 100) / 100
    };
  }
}

// 사용 예제
const detector = new HangulErrorDetector();
const result = await detector.detectErrors('한글 입력 테스트');
console.log('Error detection result:', result);
```

## 고급 기능

### 자동 완료 설정

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

const hangulComposer = new HangulComposer();

// 자동 완료 타임아웃 설정 (기본: 2초)
hangulComposer.setAutoCompleteTimeout(1000); // 1초로 변경

// 자동 완료 비활성화
hangulComposer.setAutoCompleteEnabled(false);

// 수동으로 자동 완료 타이머 시작
hangulComposer.startAutoCompleteTimer();
```

### 커스텀 키 매핑

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

const hangulComposer = new HangulComposer();

// 커스텀 키 매핑 추가
hangulComposer.addKeyMapping('q', 'ㅂ');
hangulComposer.addKeyMapping('w', 'ㅈ');

// 키 매핑 제거
hangulComposer.removeKeyMapping('q');

// 모든 키 매핑 초기화
hangulComposer.resetKeyMappings();
```

### 배치 처리

```typescript
import { HangulComposer } from '../main/keyboard/HangulComposer';

const hangulComposer = new HangulComposer();

// 여러 키를 한 번에 처리
const processMultipleKeys = (keys: string[]): string => {
  let result = '';
  
  for (const key of keys) {
    const composition = hangulComposer.processKey(key);
    
    if (composition.completed) {
      result += composition.completed;
    }
  }
  
  // 마지막 조합 완료
  const final = hangulComposer.finishComposition();
  if (final) {
    result += final;
  }
  
  return result;
};

// 사용 예제
const keys = ['ㅎ', 'ㅏ', 'ㄴ', 'ㄱ', 'ㅡ', 'ㄹ'];
const result = processMultipleKeys(keys);
console.log(result); // "한글"
```

## 성능 최적화

### 메모리 관리

```typescript
// 주기적으로 조합 상태 정리
setInterval(() => {
  const state = hangulComposer.getCompositionState();
  
  // 10초 이상 조합 중인 상태라면 강제 완료
  if (state.isComposing) {
    hangulComposer.finishComposition();
  }
}, 10000);
```

### 이벤트 리스너 관리

```typescript
// 이벤트 리스너 제거
const cleanup = () => {
  hangulComposer.removeAllListeners('composition-started');
  hangulComposer.removeAllListeners('composition-updated');
  hangulComposer.removeAllListeners('composition-completed');
  hangulComposer.removeAllListeners('composition-cancelled');
};

// 앱 종료 시 정리
process.on('exit', cleanup);
```

## 문제 해결

### 조합 상태 디버깅

```typescript
// 조합 상태 디버깅 활성화
const enableDebugging = () => {
  hangulComposer.on('composition-updated', (result) => {
    const state = hangulComposer.getCompositionState();
    
    console.debug('Composition Debug:', {
      timestamp: new Date().toISOString(),
      state: state,
      result: result,
      isValid: hangulComposer.isValidComposition(state)
    });
  });
};

if (process.env.NODE_ENV === 'development') {
  enableDebugging();
}
```

### 헬스 체크 모니터링

```typescript
// 주기적 헬스 체크
setInterval(async () => {
  const health = await hangulComposer.healthCheck();
  
  if (!health.healthy) {
    console.error('HangulComposer health check failed:', health);
    
    // 필요시 재시작
    await hangulComposer.stop();
    await hangulComposer.start();
  }
}, 30000); // 30초마다 체크
```

## 관련 문서

- [UnifiedHandler API](./unified-handler.md)
- [KeyboardEngine API](./keyboard-engine.md)
- [Korean Input Guide](./korean-input.md)
- [Types Reference](./types.md)
- [Architecture](./architecture.md)
