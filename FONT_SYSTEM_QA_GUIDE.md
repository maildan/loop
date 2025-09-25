# 🔥 폰트 시스템 QA 실행 가이드

## 📋 QA 체크리스트 실행 방법

### 1️⃣ 브라우저 개발자 도구에서 실행

```javascript
// 전체 QA 체크리스트 실행 (권장)
runFontQA()

// 빠른 폰트 상태 확인
quickFontCheck()

// 수동 QA 인스턴스 생성
const qa = new FontSystemQA()
await qa.runFullChecklist()
```

### 2️⃣ QA 체크리스트 항목들

1. **폰트 파일 로딩 검증** - Network 및 Document.fonts API 확인
2. **CSS 변수 설정 검증** - `--app-font-family` 등 CSS 변수 적용 상태
3. **DOM 요소 폰트 적용 검증** - body, p, div 등 요소들의 실제 폰트 확인
4. **TipTap 에디터 폰트 적용 검증** - `.ProseMirror` 요소 폰트 적용 확인
5. **블랙리스트 시스템 작동 검증** - 문제 폰트들이 차단되는지 확인
6. **FontProvider Context 상태 검증** - React Context 및 설정 상태
7. **실시간 폰트 변경 테스트** - 폰트 변경이 즉시 반영되는지 테스트

### 3️⃣ 주요 수정 사항 요약

#### ✅ 완료된 수정 사항
- **FontSystemQA.js** - 7단계 종합 QA 도구 생성
- **CSSVariableManager.ts** - CSS 변수 적용 검증 로직 수정, TipTap 강제 적용 개선
- **FontBlacklistSystem.ts** - gaw_Light.otf 사전 블랙리스트, 부분 매칭 로직 강화
- **FontProvider.tsx** - useMemo로 Context 성능 최적화

#### 🔧 핵심 개선 내용
1. **CSS 적용 시스템**: `!important` 사용으로 TipTap 에디터 폰트 강제 적용
2. **블랙리스트 시스템**: 부분 매칭으로 gaw.otf 관련 모든 폰트 차단
3. **실시간 검증**: `verifyVariableApplication()`으로 CSS 변수 적용 즉시 확인
4. **성능 최적화**: React Context value 객체 memoization

### 4️⃣ 테스트 시나리오

#### 시나리오 1: 정상 폰트 적용 테스트
```javascript
// 1. QA 실행
runFontQA()

// 2. 성공률 80% 이상 확인
// 3. TipTap 에디터 폰트 적용 확인
```

#### 시나리오 2: 문제 폰트 차단 테스트
```javascript
// 블랙리스트된 폰트들이 로드되지 않는지 확인
const blacklisted = await window.FontSystemQA.prototype.getBlacklistedFonts()
console.log('차단된 폰트들:', blacklisted)
```

#### 시나리오 3: 실시간 폰트 변경 테스트
```javascript
// QA 도구에서 자동으로 3가지 폰트로 변경 테스트 수행
// 각 변경이 DOM에 즉시 반영되는지 확인
```

### 5️⃣ 결과 해석

#### 🎉 성공 기준 (성공률 80% 이상)
- 모든 CSS 변수가 정상 설정됨
- TipTap 에디터에 커스텀 폰트 적용됨
- 블랙리스트된 폰트들이 차단됨

#### ⚠️ 부분 성공 (성공률 60-80%)
- 일부 CSS 변수 누락
- TipTap 에디터 폰트 부분 적용
- 수동 개입 필요

#### 🚨 실패 (성공률 60% 미만)
- CSS 변수 시스템 오작동
- 폰트 로딩 자체 실패
- 즉시 수정 필요

### 6️⃣ 수정 제안 확인

QA 실행 후 `qa.suggestFixes()`가 자동으로 실행되어 실패한 테스트에 대한 구체적인 수정 방안을 제시합니다.

### 7️⃣ 상세 결과 데이터

```javascript
// 모든 테스트 결과 데이터 접근
window.fontSystemQAResults.summary        // 요약 통계
window.fontSystemQAResults.allResults     // 전체 테스트 결과
window.fontSystemQAResults.failedTests    // 실패한 테스트들
window.fontSystemQAResults.warningTests   // 경고 테스트들
```

## 🚀 실행 순서

1. **브라우저에서 앱 실행**
2. **개발자 도구 열기** (F12)
3. **Console 탭으로 이동**
4. **`runFontQA()` 명령어 실행**
5. **결과 확인 및 필요시 수정**

---

> 💡 **참고**: 이 QA 도구는 브라우저 환경에서만 실행 가능하며, 모든 폰트 시스템 컴포넌트가 로드된 후에 실행해야 정확한 결과를 얻을 수 있습니다.