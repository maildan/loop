# Loop Typing Analytics - 유틸리티 함수 문서

## 🛠️ 유틸리티 함수 개요

Loop 애플리케이션에서 사용되는 모든 공통 유틸리티 함수들을 정리한 문서입니다. 모든 함수는 **타입 안전성**과 **성능 최적화**를 고려하여 설계되었습니다.

## 📚 카테고리별 유틸리티

### 1. 타입 안전성 유틸리티

#### `createSuccess<T>(data: T): Result<T>`
성공 결과 객체를 생성합니다.

```typescript
// src/shared/utils.ts
export function createSuccess<T>(data: T): Result<T> {
  return {
    success: true,
    data
  };
}

// 사용 예제
const userResult = createSuccess({ id: '123', name: 'John' });
console.log(userResult); // { success: true, data: { id: '123', name: 'John' } }
```

#### `createError(error: string): Result<never>`
에러 결과 객체를 생성합니다.

```typescript
export function createError(error: string): Result<never> {
  return {
    success: false,
    error
  };
}

// 사용 예제
const errorResult = createError('User not found');
console.log(errorResult); // { success: false, error: 'User not found' }
```

#### `isSuccess<T>(result: Result<T>): result is Result<T> & { success: true }`
Result 객체가 성공인지 타입 안전하게 확인합니다.

```typescript
export function isSuccess<T>(result: Result<T>): result is Result<T> & { success: true } {
  return result.success;
}

// 사용 예제
const result = await someOperation();
if (isSuccess(result)) {
  // 여기서 result.data는 타입 안전하게 접근 가능
  console.log(result.data);
} else {
  console.error(result.error);
}
```

#### `safeJsonParse<T>(json: string, guard: TypeGuard<T>): Result<T>`
JSON을 타입 안전하게 파싱합니다.

```typescript
export function safeJsonParse<T>(json: string, guard: TypeGuard<T>): Result<T> {
  try {
    const parsed = JSON.parse(json);
    if (guard(parsed)) {
      return createSuccess(parsed);
    } else {
      return createError('Invalid JSON structure');
    }
  } catch (error) {
    return createError(error instanceof Error ? error.message : 'JSON parse error');
  }
}

// 사용 예제
interface User { id: string; name: string; }
const isUser = (value: unknown): value is User => 
  typeof value === 'object' && value !== null &&
  typeof (value as User).id === 'string' &&
  typeof (value as User).name === 'string';

const userJson = '{"id":"123","name":"John"}';
const userResult = safeJsonParse(userJson, isUser);
if (isSuccess(userResult)) {
  console.log(userResult.data.name); // 타입 안전
}
```

### 2. 데이터 변환 유틸리티

#### `formatBytes(bytes: number, decimals?: number): string`
바이트를 읽기 쉬운 형식으로 변환합니다.

```typescript
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 사용 예제
console.log(formatBytes(1024)); // "1 KB"
console.log(formatBytes(1048576)); // "1 MB"
console.log(formatBytes(1073741824, 3)); // "1.000 GB"
```

#### `formatDuration(seconds: number): string`
초를 사람이 읽기 쉬운 형식으로 변환합니다.

```typescript
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
}

// 사용 예제
console.log(formatDuration(45)); // "45s"
console.log(formatDuration(125)); // "2m 5s"
console.log(formatDuration(3665)); // "1h 1m 5s"
```

#### `formatWpm(wpm: number): string`
WPM을 형식화합니다.

```typescript
export function formatWpm(wpm: number): string {
  return `${Math.round(wpm)} WPM`;
}

// 사용 예제
console.log(formatWpm(45.7)); // "46 WPM"
console.log(formatWpm(0)); // "0 WPM"
```

#### `formatAccuracy(accuracy: number): string`
정확도를 백분율로 형식화합니다.

```typescript
export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy * 100) / 100}%`;
}

// 사용 예제
console.log(formatAccuracy(95.567)); // "95.57%"
console.log(formatAccuracy(100)); // "100%"
```

### 3. 날짜/시간 유틸리티

#### `formatDate(date: Date, format?: string): string`
날짜를 지정된 형식으로 포맷합니다.

```typescript
export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 사용 예제
const now = new Date();
console.log(formatDate(now)); // "2024-01-15"
console.log(formatDate(now, 'YYYY-MM-DD HH:mm:ss')); // "2024-01-15 14:30:25"
console.log(formatDate(now, 'MM/DD/YYYY')); // "01/15/2024"
```

#### `getTimeAgo(date: Date): string`
경과 시간을 상대적으로 표시합니다.

```typescript
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
}

// 사용 예제
const oneHourAgo = new Date(Date.now() - 3600000);
console.log(getTimeAgo(oneHourAgo)); // "1 hour ago"
```

#### `isToday(date: Date): boolean`
날짜가 오늘인지 확인합니다.

```typescript
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// 사용 예제
console.log(isToday(new Date())); // true
console.log(isToday(new Date('2024-01-01'))); // false (예시 날짜)
```

### 4. 문자열 유틸리티

#### `slugify(text: string): string`
문자열을 URL 친화적인 슬러그로 변환합니다.

```typescript
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/[\s_-]+/g, '-') // 공백과 언더스코어를 하이픈으로
    .replace(/^-+|-+$/g, ''); // 시작/끝 하이픈 제거
}

// 사용 예제
console.log(slugify('Hello World!')); // "hello-world"
console.log(slugify('한글 테스트 123')); // "123"
console.log(slugify('Multi   spaces')); // "multi-spaces"
```

#### `truncate(text: string, maxLength: number, suffix = '...'): string`
문자열을 지정된 길이로 자릅니다.

```typescript
export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

// 사용 예제
console.log(truncate('This is a long text', 10)); // "This is..."
console.log(truncate('Short', 10)); // "Short"
console.log(truncate('Long text here', 8, '…')); // "Long te…"
```

#### `capitalize(text: string): string`
첫 글자를 대문자로 변환합니다.

```typescript
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// 사용 예제
console.log(capitalize('hello world')); // "Hello world"
console.log(capitalize('UPPER CASE')); // "Upper case"
console.log(capitalize('')); // ""
```

#### `camelCase(text: string): string`
문자열을 camelCase로 변환합니다.

```typescript
export function camelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

// 사용 예제
console.log(camelCase('hello world')); // "helloWorld"
console.log(camelCase('user-name')); // "userName"
console.log(camelCase('API Response')); // "apiResponse"
```

### 5. 수학 유틸리티

#### `clamp(value: number, min: number, max: number): number`
값을 지정된 범위로 제한합니다.

```typescript
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// 사용 예제
console.log(clamp(15, 10, 20)); // 15
console.log(clamp(5, 10, 20)); // 10
console.log(clamp(25, 10, 20)); // 20
```

#### `round(value: number, decimals: number): number`
지정된 소수점 자리로 반올림합니다.

```typescript
export function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// 사용 예제
console.log(round(3.14159, 2)); // 3.14
console.log(round(2.5, 0)); // 3
console.log(round(1.005, 2)); // 1.01
```

#### `average(numbers: number[]): number`
숫자 배열의 평균을 계산합니다.

```typescript
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

// 사용 예제
console.log(average([1, 2, 3, 4, 5])); // 3
console.log(average([10, 20, 30])); // 20
console.log(average([])); // 0
```

#### `median(numbers: number[]): number`
숫자 배열의 중앙값을 계산합니다.

```typescript
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

// 사용 예제
console.log(median([1, 2, 3, 4, 5])); // 3
console.log(median([1, 2, 3, 4])); // 2.5
console.log(median([5, 1, 3])); // 3
```

### 6. 배열 유틸리티

#### `chunk<T>(array: T[], size: number): T[][]`
배열을 지정된 크기의 청크로 나눕니다.

```typescript
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// 사용 예제
console.log(chunk([1, 2, 3, 4, 5, 6], 2)); // [[1, 2], [3, 4], [5, 6]]
console.log(chunk(['a', 'b', 'c', 'd', 'e'], 3)); // [['a', 'b', 'c'], ['d', 'e']]
```

#### `unique<T>(array: T[]): T[]`
배열에서 중복을 제거합니다.

```typescript
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// 사용 예제
console.log(unique([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(unique(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

#### `groupBy<T, K extends string | number>(array: T[], keyFn: (item: T) => K): Record<K, T[]>`
배열을 키 함수 결과로 그룹화합니다.

```typescript
export function groupBy<T, K extends string | number>(
  array: T[], 
  keyFn: (item: T) => K
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  
  for (const item of array) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  
  return groups;
}

// 사용 예제
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];

const groupedByAge = groupBy(users, user => user.age);
console.log(groupedByAge);
// {
//   25: [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   30: [{ name: 'Bob', age: 30 }]
// }
```

### 7. 객체 유틸리티

#### `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`
객체에서 지정된 키만 선택합니다.

```typescript
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

// 사용 예제
const user = { id: '123', name: 'John', email: 'john@example.com', age: 30 };
const userBasic = pick(user, ['id', 'name']);
console.log(userBasic); // { id: '123', name: 'John' }
```

#### `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>`
객체에서 지정된 키를 제외합니다.

```typescript
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

// 사용 예제
const user = { id: '123', name: 'John', password: 'secret', age: 30 };
const publicUser = omit(user, ['password']);
console.log(publicUser); // { id: '123', name: 'John', age: 30 }
```

#### `deepMerge<T>(target: T, ...sources: Partial<T>[]): T`
객체를 깊게 병합합니다.

```typescript
export function deepMerge<T>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// 사용 예제
const target = { a: 1, b: { c: 2 } };
const source = { b: { d: 3 }, e: 4 };
const merged = deepMerge(target, source);
console.log(merged); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

### 8. 비동기 유틸리티

#### `sleep(ms: number): Promise<void>`
지정된 시간만큼 대기합니다.

```typescript
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 사용 예제
async function example(): Promise<void> {
  console.log('Start');
  await sleep(1000); // 1초 대기
  console.log('End');
}
```

#### `retry<T>(fn: () => Promise<T>, maxAttempts: number, delay = 1000): Promise<T>`
함수를 지정된 횟수만큼 재시도합니다.

```typescript
export async function retry<T>(
  fn: () => Promise<T>, 
  maxAttempts: number, 
  delay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      await sleep(delay * attempt); // 지수적 백오프
    }
  }
  
  throw lastError!;
}

// 사용 예제
const result = await retry(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Network error');
    return response.json();
  },
  3, // 최대 3번 시도
  500 // 초기 지연 500ms
);
```

#### `timeout<T>(promise: Promise<T>, ms: number): Promise<T>`
Promise에 타임아웃을 설정합니다.

```typescript
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

// 사용 예제
try {
  const result = await timeout(
    fetch('/api/slow-endpoint'),
    5000 // 5초 타임아웃
  );
  console.log(result);
} catch (error) {
  console.error('Request failed or timed out:', error);
}
```

### 9. 성능 유틸리티

#### `debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T`
함수 호출을 지연시켜 마지막 호출만 실행합니다.

```typescript
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T, 
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

// 사용 예제
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

// 300ms 내에 여러 번 호출해도 마지막 호출만 실행됨
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // 이것만 실행됨
```

#### `throttle<T extends (...args: any[]) => any>(fn: T, limit: number): T`
함수 호출 빈도를 제한합니다.

```typescript
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T, 
  limit: number
): T {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>): ReturnType<T> | undefined => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

// 사용 예제
const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 100);

// 100ms마다 최대 한 번만 실행됨
window.addEventListener('scroll', throttledScroll);
```

#### `memoize<T extends (...args: any[]) => any>(fn: T): T`
함수 결과를 캐시합니다.

```typescript
export function memoize<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// 사용 예제
const expensiveCalculation = memoize((n: number): number => {
  console.log('Computing for', n);
  // 복잡한 계산...
  return n * n;
});

console.log(expensiveCalculation(5)); // "Computing for 5", returns 25
console.log(expensiveCalculation(5)); // returns 25 (cached, no log)
```

### 10. 검증 유틸리티

#### `isEmail(email: string): boolean`
이메일 형식을 검증합니다.

```typescript
export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 사용 예제
console.log(isEmail('user@example.com')); // true
console.log(isEmail('invalid-email')); // false
```

#### `isUrl(url: string): boolean`
URL 형식을 검증합니다.

```typescript
export function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 사용 예제
console.log(isUrl('https://example.com')); // true
console.log(isUrl('not-a-url')); // false
```

#### `isUuid(uuid: string): boolean`
UUID 형식을 검증합니다.

```typescript
export function isUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// 사용 예제
console.log(isUuid('123e4567-e89b-12d3-a456-426614174000')); // true
console.log(isUuid('invalid-uuid')); // false
```

---

**🔥 이러한 유틸리티 함수들은 Loop 애플리케이션 전반에서 재사용되며, 코드의 일관성과 유지보수성을 크게 향상시킵니다.**
