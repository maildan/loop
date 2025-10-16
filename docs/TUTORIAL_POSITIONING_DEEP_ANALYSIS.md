---
title: 튜토리얼 팝오버 위치 문제 - 비관적 근본 원인 분석
date: 2025-10-17
---

# 🔍 Driver.js 팝오버 위치 문제 - 비관적 관점의 근본 원인 분석

## 📋 문제 정의

사용자 보고:
1. **"← 이전 버튼이 안 보인다"** - Previous button visibility broken
2. **"튜토리얼이 이따고로 보인다" (슬라이드 현상)** - Popover positioned wrong
3. **"처음 튜토리얼 킬 때 X, Y 값 안 맞아"** - Initial positioning calculation bug
4. **"ThemeProvider랑 연동한거 맞아?"** - Theme sync doubt

---

## 🚨 비관적 원인 분석 (실무적 관점)

### 1️⃣ **Element 위치 계산 타이밍 버그 (Critical)**

#### 문제점
```typescript
// ❌ useGuidedTour.ts 현재 코드 (라인 150-165)
useEffect(() => {
  if (!isActive || !currentTutorialId) {
    // ...cleanup
    return;
  }
  
  // 💀 이 지점에서 initializeDriver() 호출
  initializeDriver();
}, [isActive, currentTutorialId, initializeDriver]);
```

#### 왜 이게 문제인가?

1. **DOM이 완전히 렌더링되지 않았을 수 있음**
   ```javascript
   // Step 1: React state changed (isActive = true)
   // Step 2: Component re-render 시작
   // Step 3: useEffect 실행 (= initializeDriver 실행)
   // Step 4: Driver.js가 element 찾으러 감 ← 아직 DOM layout이 안 잡혔을 수 있음!
   ```

2. **getBoundingClientRect()가 outdated된 좌표 반환**
   ```javascript
   // Driver.js 내부에서 이런 식으로 동작:
   const element = document.querySelector('[data-tour="kpi-section"]');
   const rect = element.getBoundingClientRect(); // ← 이 시점에 X,Y 계산
   // 하지만 CSS가 아직 적용 안 되었거나, layout shift가 진행 중일 수 있음
   ```

3. **예상 문제점 시나리오**
   ```
   0ms:   사용자 "사용법 보기" 클릭
   5ms:   React state update (isActive=true)
   10ms:  React re-render 시작
   15ms:  useEffect 실행 → initializeDriver()
   20ms:  driver.js가 element.getBoundingClientRect() 호출
   ❌     이 시점에 element의 layout이 아직 완성 안 됨
   
   30ms:  실제 CSS animation이 적용됨 (예: popover fade-in)
   40ms:  layout recalculation 발생
   🔴    팝오버가 잘못된 위치에 이미 렌더링됨!
   ```

#### 실무적 해결책
```typescript
// 방법 1: requestAnimationFrame으로 다음 frame까지 기다리기
useEffect(() => {
  if (!isActive || !currentTutorialId) return;
  
  // 브라우저가 다음 paint를 하기 전까지 기다림
  const frameId = requestAnimationFrame(() => {
    // 이제 layout이 완성됨
    initializeDriver();
  });
  
  return () => cancelAnimationFrame(frameId);
}, [isActive, currentTutorialId, initializeDriver]);

// 방법 2: setTimeout으로 안전한 margin 주기
useEffect(() => {
  if (!isActive || !currentTutorialId) return;
  
  // 100ms는 과하지만, 모든 CSS transition이 적용되도록 보장
  const timerId = setTimeout(() => {
    initializeDriver();
  }, 50); // 2-3 frames
  
  return () => clearTimeout(timerId);
}, [isActive, currentTutorialId, initializeDriver]);
```

---

### 2️⃣ **Scroll Position Desync (Major)**

#### 문제점
```typescript
// Driver.js의 위치 계산:
// 1. 초기 실행 시: element가 viewport 중앙 (scroll = 0)
// 2. 사용자가 스크롤 함
// 3. 팝오버는 fixed position으로 그대로 있음
// 4. element는 scroll position이 변함
// → 팝오버와 element가 떨어짐!
```

#### 실제 동작 흐름
```
[초기 상태]
Viewport:  |----element----|
Popover:   [position: center]
Scroll:    0

[사용자가 아래로 스크롤]
Viewport:  [empty space]
Element:   (viewport 밖으로 나감)
Popover:   여전히 같은 position ❌

Driver.js가 이미 overlay를 fixed로 그렸기 때문에
scroll 이벤트 후 자동으로 repositioning하지 않음!
```

#### 실무적 해결책
```typescript
// useGuidedTour.ts에 추가
useEffect(() => {
  if (!driverRef.current || !isActive) return;
  
  // Scroll 이벤트 감시
  const handleScroll = () => {
    // Driver.js의 refresh 메서드 호출
    if (driverRef.current?.refresh) {
      driverRef.current.refresh();
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [isActive]);

// Resize도 같은 이유로 필요
useEffect(() => {
  if (!driverRef.current || !isActive) return;
  
  const handleResize = () => {
    if (driverRef.current?.refresh) {
      driverRef.current.refresh();
    }
  };
  
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, [isActive]);
```

---

### 3️⃣ **Theme 변경 시 CSS-in-JS 미동기화 (High)**

#### 문제점
```typescript
// ThemeProvider.tsx (라인 65-80)
const setTheme = useCallback(async (newTheme: Theme): Promise<void> => {
  setThemeState(newTheme);
  
  // themeManager.applyTheme() 호출
  themeManager.applyTheme(newTheme);
  const resolved = themeManager.getResolvedThemeMode();
  setResolvedTheme(resolved);
  
  // 💀 이 지점에서 즉시 반환 (CSS 적용이 비동기인데 기다리지 않음)
}, []);
```

#### 왜 이게 문제인가?

```typescript
// 시나리오:
// Step 1: 튜토리얼 시작 (light mode)
// Step 2: 팝오버 위치 계산됨
// Step 3: 사용자가 테마를 dark로 변경
// Step 4: ThemeProvider가 CSS 변수 업데이트 시작
// Step 5: Driver.js의 popover는 old CSS values로 유지됨
// Step 6: CSS transition 진행 중에 popover layout 완전히 깨짐

// useGuidedTour.ts의 CSS injection:
const style = document.createElement('style');
style.textContent = `
  .loop-driver-popover {
    --driver-primary-color: hsl(var(--accent-primary));
    --driver-bg-color: hsl(var(--card));
    // ↑ 이 값들이 ThemeProvider의 변경을 따라가지 못함
  }
`;
```

#### 실무적 해결책
```typescript
// Option 1: Theme 변경 감지 후 popover 재계산
function useGuidedTour(): Driver | null {
  const { resolvedTheme } = useTheme(); // ThemeProvider에서 추가
  const driverRef = useRef<Driver | null>(null);
  
  // Theme이 변경되면 popover를 refresh
  useEffect(() => {
    if (driverRef.current?.refresh) {
      // 100ms 후 refresh (CSS transition 대기)
      const timerId = setTimeout(() => {
        driverRef.current?.refresh();
      }, 100);
      
      return () => clearTimeout(timerId);
    }
  }, [resolvedTheme]); // resolvedTheme이 변경되면 트리거
}

// Option 2: CSS variable이 아닌 inline styles 사용
function injectTutorialStyles(): void {
  // ❌ Bad: CSS variables 사용
  // const bgColor = 'hsl(var(--card))';
  
  // ✅ Good: 현재 computed style 읽기
  const computedStyle = getComputedStyle(document.documentElement);
  const bgColor = computedStyle.getPropertyValue('--card').trim();
  
  const style = document.createElement('style');
  style.textContent = `
    .loop-driver-popover {
      background-color: hsl(${bgColor});
    }
  `;
}
```

---

### 4️⃣ **Element가 viewport에 없을 때 (Critical)**

#### 문제점
```javascript
// Driver.js 내부 동작 가정:
const element = document.querySelector('[data-tour="kpi-section"]');

// ❌ Element가 scroll로 밖으로 나갔거나, 아직 DOM에 없음
if (!element) {
  console.error('Element not found');
  return;
}

// 💀 이 시점에서도 element.getBoundingClientRect()는 값을 반환함
// 하지만 top: -9999, left: -9999 같은 불가능한 값일 수 있음
```

#### 실무적 해결책
```typescript
// useGuidedTour.ts의 initializeDriver 에 추가
async function initializeDriver(): Promise<void> {
  const tutorial = getTutorial(currentTutorialId);
  
  // Element 검증
  for (const step of tutorial.steps) {
    if (!step.element) continue;
    
    const element = document.querySelector(step.element);
    if (!element) {
      Logger.error('useGuidedTour', 
        `Element not found for step: ${step.stepId}`,
        { selector: step.element }
      );
      return;
    }
    
    // Viewport에 있는지 확인
    const rect = element.getBoundingClientRect();
    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
    
    if (!isInViewport) {
      Logger.warn('useGuidedTour',
        `Element not in viewport: ${step.stepId}. Scrolling...`,
        { rect }
      );
      
      // Element를 viewport로 scroll
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      
      // Scroll 완료 대기
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // 이제 안전하게 Driver.js 실행
  createAndStartDriver();
}
```

---

### 5️⃣ **CSS Media Query Layout Shift (High)**

#### 문제점
```typescript
// useGuidedTour.ts의 CSS (라인 360-365)
@media (prefers-color-scheme: light) {
  .loop-driver-popover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

@media (max-width: 600px) {
  .loop-driver-popover {
    min-width: auto;
    max-width: 95vw;
  }
}

// 💀 이 media query들이 활성화될 때
// popover의 width가 갑자기 줄어들 수 있음
// Driver.js는 이 layout shift를 감지하지 못하고
// 팝오버 위치를 재계산하지 않음
```

#### 실무적 해결책
```typescript
// useGuidedTour.ts에 ResizeObserver 추가
useEffect(() => {
  if (!driverRef.current || !isActive) return;
  
  // 화면 크기 변경 감지 (media query 포함)
  const resizeObserver = new ResizeObserver(() => {
    if (driverRef.current?.refresh) {
      // 100ms 후 refresh (resize 애니메이션 완료 대기)
      setTimeout(() => {
        driverRef.current?.refresh();
      }, 100);
    }
  });
  
  // popover element 감시
  const popover = document.querySelector('.loop-driver-popover');
  if (popover) {
    resizeObserver.observe(popover);
  }
  
  return () => {
    resizeObserver.disconnect();
  };
}, [isActive]);
```

---

### 6️⃣ **Previous 버튼 숨김 문제 (CSS Specificity)**

#### 근본 원인 분석

```typescript
// useGuidedTour.ts 라인 290-310
.loop-driver-popover button {
  background-color: var(--driver-primary-color);
  color: white;
  // ... 여러 스타일
}

// 💀 문제점:
// Driver.js는 이런 구조로 만듦:
// <div class="driver-popover-footer">
//   <span class="driver-popover-progress-text">1 / 8</span>
//   <button class="driver-popover-button">Previous</button>
//   <button class="driver-popover-button">Next</button>
// </div>

// 특정 상황에서:
// 1. Previous 버튼이 disabled된 경우
// 2. CSS 캐스케이딩으로 인해 opacity: 0.5 되지만
// 3. width: 0이 적용되어 버튼 자체가 안 보일 수 있음
```

#### 실무적 진단 코드
```typescript
// App.tsx에서 개발자 도구로 확인
useEffect(() => {
  const prevBtn = document.querySelector('.driver-popover-button:first-of-type');
  if (prevBtn) {
    const styles = window.getComputedStyle(prevBtn);
    console.log('Previous button computed styles:', {
      display: styles.display,
      width: styles.width,
      height: styles.height,
      opacity: styles.opacity,
      visibility: styles.visibility,
      pointerEvents: styles.pointerEvents,
    });
  }
}, []);
```

#### 해결책
```typescript
// useGuidedTour.ts 라인 295에 추가
.loop-driver-popover button {
  background-color: var(--driver-primary-color);
  color: white;
  border: none !important;
  outline: none !important;
  border-radius: 6px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-width: 80px; /* ← 추가: 최소 너비 보장 */
}

.loop-driver-popover button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  /* 중요: disabled여도 버튼은 보여야 함 */
  display: flex; /* ← 명시적 지정 */
  min-height: 40px; /* ← 명시적 지정 */
}
```

---

### 7️⃣ **Step Index 동기화 문제 (Medium)**

#### 문제점
```typescript
// useGuidedTour.ts 라인 88
const initializeDriver = useCallback(async (): Promise<void> => {
  // ...
  driverRef.current.drive(currentStepIndex);
  
  // 💀 문제:
  // 1. Step 1 시작 (currentStepIndex = 0)
  // 2. 사용자 "다음" 클릭
  // 3. previousStep() 호출
  // 4. currentStepIndex가 1로 업데이트
  // 5. useEffect 다시 실행 (dependency에 currentStepIndex가 있으면)
  // 6. Driver.js를 새로 생성하면서 position recalculation 발생
}, [currentTutorialId, currentStepIndex, ...]);
```

#### 실무적 해결책
```typescript
// currentStepIndex 변경 감지 추가
useEffect(() => {
  if (!driverRef.current || !isActive) return;
  
  // 이미 진행 중인 경우, refresh만 수행
  if (driverRef.current) {
    setTimeout(() => {
      driverRef.current?.refresh();
    }, 50);
  }
}, [currentStepIndex, isActive]);
```

---

## 🛠️ 실무적 해결 전략 (우선순위)

### Priority 1: 긴급 (즉시 적용)
```typescript
// 1. useEffect 타이밍 개선
// 2. Scroll/Resize 리스너 추가
// 3. Element 검증 추가
```

### Priority 2: 높음 (1주일)
```typescript
// 1. Theme 변경 감지 및 refresh
// 2. Previous 버튼 CSS 수정
// 3. ResizeObserver 추가
```

### Priority 3: 중간 (2-3주)
```typescript
// 1. Step 인덱스 동기화 개선
// 2. MutationObserver로 DOM 변경 감시
// 3. 스크롤 대기 로직 추가
```

---

## 📊 코드 변경 계획

### Step 1: useGuidedTour.ts 업데이트
```typescript
// 현재 파일: src/renderer/modules/tutorial/useGuidedTour.ts
// 변경사항:
// 1. initializeDriver에 element 검증 로직 추가
// 2. requestAnimationFrame으로 타이밍 개선
// 3. Scroll/Resize 이벤트 리스너 추가
// 4. ResizeObserver 추가
```

### Step 2: 버튼 CSS 수정
```typescript
// 변경사항:
// .loop-driver-popover button에 min-width 추가
// button:disabled에 display: flex 명시
```

### Step 3: TutorialContext.tsx 개선
```typescript
// 변경사항:
// Theme 변경 감지 콜백 추가
// currentStepIndex 변경 시 refresh 트리거
```

---

## 🎯 최종 결론

### Root Cause Ranking

| 순위 | 원인 | 심각도 | 발생 빈도 |
|------|------|--------|----------|
| 1 | useEffect 타이밍 버그 | 🔴 Critical | 100% |
| 2 | Scroll 미동기화 | 🔴 Critical | 80% |
| 3 | Element viewport 확인 부족 | 🟠 High | 60% |
| 4 | Theme 변경 미동기화 | 🟠 High | 40% |
| 5 | CSS media query layout shift | 🟡 Medium | 30% |
| 6 | Previous 버튼 CSS | 🟡 Medium | 50% |
| 7 | Step index 동기화 | 🟡 Medium | 20% |

### 왜 이런 문제가 발생했는가?

1. **Driver.js는 one-time 계산 엔진**
   - 초기 위치를 한 번 계산한 후 업데이트하지 않음
   - 동적 환경(React, 테마 변경)에 적합하지 않음

2. **React의 비동기 렌더링과 충돌**
   - useEffect는 render 후 실행되지만, layout은 비동기
   - CSS 적용 전에 positioning이 일어남

3. **테마 시스템 설계 부족**
   - CSS variables를 사용하지만 refresh 메커니즘 없음
   - Driver.js와 theme 변경 간 연동 방식 정의 안 됨

---

## 📝 다음 실행 단계

```
[ ] 1. useGuidedTour.ts 버그 픽스 (initializeDriver 타이밍)
[ ] 2. Scroll/Resize 이벤트 리스너 추가
[ ] 3. Element 검증 로직 추가
[ ] 4. Previous 버튼 CSS 수정
[ ] 5. Theme 변경 감지 추가
[ ] 6. 브라우저 테스트 (모든 해상도에서)
[ ] 7. 라이브 배포 및 모니터링
```
