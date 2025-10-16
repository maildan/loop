# 🧪 QA 검증 및 추가 최적화 전략

## 📋 현재 상태 요약

### ✅ 완료된 최적화 (Priority 1-2)
- asarUnpack 최소화: 150-200 MB 절감
- Prisma 중복 제거: 100-150 MB 절감
- **예상 누적: 250-350 MB 절감**

### ⏳ 다음 단계
1. QA 검증 (Prisma, Windows/macOS)
2. Priority 3-5 추가 최적화
3. 최종 번들 크기 확인

---

## 🧪 QA 검증 계획

### Phase 1: Prisma 경로 설정 검증

**현재 코드 상태:**
```typescript
// src/main/services/databaseService.ts (라인 89-105)
const { dbPath, databaseUrl } = await ensureDatabaseUrl();
this.prisma = new PrismaClient({
  datasources: {
    db: {
      url: this.config.databaseUrl,
    },
  },
});
await this.prisma.$connect();
```

**검증 항목:**
- ✅ `ensureDatabaseUrl()` 함수가 `process.resourcesPath` 사용 확인
- ✅ 패키징 후 `prisma/loop.db` 파일 존재 확인
- ✅ PrismaClient가 정상 연결 확인

**파일 위치:**
- `src/main/utils/prismaPaths.ts` (라인 146)
- `src/main/services/databaseService.ts` (라인 89)
- `src/main/services/PrismaService.ts` (라인 54)

### Phase 2: Windows 빌드 검증

**테스트 항목:**
1. **빌드 성공**
   ```bash
   pnpm build:win
   # 예상 크기: 800-950 MB (Priority 1-2 적용 후)
   ```

2. **설치 테스트 (x64)**
   ```bash
   # release/Loop-x.x.x.exe 실행
   # - 설치 완료 확인
   # - 설치 폴더 크기 측정
   ```

3. **런타임 기능 검증**
   - ✓ 앱 시작
   - ✓ 기존 프로젝트 로드 (데이터베이스 읽기)
   - ✓ 새 에피소드 생성 (데이터베이스 쓰기)
   - ✓ 동기화 기능 (네트워크)
   - ✓ Google OAuth 로그인
   - ✓ Gemini AI 분석

4. **ARM64 빌드 테스트**
   ```bash
   # release/Loop-x.x.x-arm64.exe 실행
   # 동일한 기능 검증
   ```

**측정 명령:**
```bash
# 설치 폴더 크기
du -sh "C:\Program Files\Loop"
# release 빌드 폴더 크기
du -sh release/
```

### Phase 3: macOS 빌드 검증

**테스트 항목:**
1. **빌드 성공**
   ```bash
   pnpm build:mac
   # 예상 크기: 800-950 MB (Priority 1-2 적용 후)
   ```

2. **DMG 설치 테스트**
   ```bash
   # release/Loop-x.x.x.dmg 마운트
   # - Loop.app 끌어놓기 설치
   # - 앱 폴더 크기 측정
   ```

3. **런타임 기능 검증** (Windows와 동일)

4. **ARM64 (M1/M2) 테스트**
   - x64 빌드 Rosetta 2 호환성 확인
   - ARM64 네이티브 빌드 성능 확인

**측정 명령:**
```bash
# 앱 폴더 크기
du -sh /Applications/Loop.app
# release 빌드 폴더 크기
du -sh release/
```

### Phase 4: 크기 측정 비교

```
Priority 1-2 적용 전후 비교:
┌─────────────────────────┬───────────┬───────────┬──────────┐
│ 항목                    │ 현재      │ 예상      │ 절감     │
├─────────────────────────┼───────────┼───────────┼──────────┤
│ Windows (installed)     │ 1.2 GB    │ 800-950MB │ 250-350MB│
│ Windows x64 (.exe)      │ ~1.1 GB   │ ~750MB    │ ~350MB   │
│ Windows ARM64 (.exe)    │ ~1.1 GB   │ ~750MB    │ ~350MB   │
│ macOS (.app)            │ 1.2 GB    │ 850MB     │ 350MB    │
│ macOS x64 (.dmg)        │ ~600 MB   │ ~400MB    │ ~200MB   │
│ macOS ARM64 (.dmg)      │ ~600 MB   │ ~400MB    │ ~200MB   │
└─────────────────────────┴───────────┴───────────┴──────────┘
```

---

## 🔍 추가 최적화 기회 분석

### 발견된 패키지 상황

**package.json 분석:**
```json
Dependencies (프로덕션):
├── @google/genai: 1.25.0 (AI용 - Gemini)
├── @google/generative-ai: 0.24.1 (AI용 - 동일?)
├── googleapis: 156.0.0 (Google API - 50-60MB)
├── google-auth-library: 10.3.0 (OAuth)
├── highlight.js: 11.11.1 (코드 하이라이트)
├── @tiptap/*: 10개 패키지 (에디터)
├── recharts: 3.2.1 (차트)
└── 기타 15개
```

### Priority 3: Firebase 제거 ✅ (이미 완료)
- **상태**: Firebase 없음 (Google AI SDK 사용 중)
- **절감량**: N/A (이미 제거됨)

### Priority 3: googleapis + google-auth-library 최적화 (📌 권장)

**현황:**
- googleapis: ~50-60 MB (전체 Google API 포함)
- google-auth-library: ~10 MB
- **총: ~60-70 MB**

**최적화 방법:**
```typescript
// Before: 전체 googleapis 로드
const google = require('googleapis');
const { people, calendar } = google;

// After: 필요한 서비스만
const { google } = require('googleapis');
const peopleService = google.people('v1');
// 또는 동적 로드
async function getGoogleService(serviceName) {
  const { google } = require('googleapis');
  return google[serviceName]('v1');
}
```

**예상 절감: 30-40 MB** (googleapis 60% 감소)

**실행 위치:**
- `src/renderer/lib/google/` (Google 서비스 호출)
- `src/main/services/` (서비스 초기화)
- grep: `googleapis`, `google.`

### Priority 4: highlight.js 동적 로드 (📌 권장)

**현황:**
- highlight.js: ~5-10 MB (코드 렌더링용)
- 항상 로드되지만 필요할 때만 사용

**최적화 방법:**
```typescript
// Before: 일반적
import hljs from 'highlight.js';

// After: 동적 로드
async function highlightCode(code, language) {
  try {
    const hljs = await import('highlight.js');
    return hljs.highlight(code, { language }).value;
  } catch {
    // Fallback
    return code;
  }
}
```

**예상 절감: 5-8 MB** (번들에서 제거)

**실행 위치:**
- `src/renderer/components/` (코드 렌더링 컴포넌트)
- grep: `highlight.js`, `hljs`

### Priority 5: node_modules 정크 제거 (📌 고려)

**현황:**
- node_modules 전체: 2.0 GB
- 실제 사용: ~1.4 GB
- 불필요한 파일: ~600 MB

**불필요한 파일 패턴:**
```
test/, tests/          (테스트 코드)
docs/, documentation/  (문서)
examples/              (예제)
.github/               (GitHub 설정)
*.map                  (소스 맵)
*.d.ts                 (타입 정의)
coverage/              (커버리지 리포트)
.eslintrc, .prettierrc (린터 설정)
```

**현재 제외 설정:**
```json
"files": [
  "!node_modules/**/*.ts",
  "!node_modules/**/LICENSE*",
  "!node_modules/**/*.map",
  "!node_modules/**/README*",
  "!node_modules/**/*.md",
  "!node_modules/**/test/**",
  "!node_modules/**/tests/**",
  "!node_modules/**/__tests__/**",
  "!node_modules/**/.github/**",
  "!node_modules/**/examples/**",
  "!node_modules/**/*.d.ts"
]
```

**추가 제외 가능:**
```json
"!node_modules/**/coverage/**",
"!node_modules/**/.eslintrc*",
"!node_modules/**/.prettierrc*",
"!node_modules/**/.babelrc*",
"!node_modules/**/.DS_Store",
"!node_modules/**/.git/**",
"!node_modules/**/src/**",
"!node_modules/**/rollup.config.js",
"!node_modules/**/webpack.config.js"
```

**예상 절감: 50-100 MB** (최악의 경우)

---

## 📊 예상 최종 결과

### 시나리오 1: Priority 1-2만 적용 (현재)
```
초기: 1.2 GB
Priority 1-2: -250-350 MB
─────────────────────────
최종: 800-950 MB ✅
절감: 21-29%
```

### 시나리오 2: Priority 1-3 적용 (권장)
```
초기: 1.2 GB
Priority 1-2: -250-350 MB
Priority 3: -30-40 MB (googleapis 최적화)
─────────────────────────
최종: 750-870 MB ✅✅
절감: 27-37%
```

### 시나리오 3: Priority 1-4 적용 (우수)
```
초기: 1.2 GB
Priority 1-2: -250-350 MB
Priority 3: -30-40 MB
Priority 4: -5-8 MB (highlight.js)
─────────────────────────
최종: 745-860 MB ✅✅✅
절감: 28-38%
```

### 시나리오 4: Priority 1-5 적용 (최적)
```
초기: 1.2 GB
Priority 1-2: -250-350 MB
Priority 3: -30-40 MB
Priority 4: -5-8 MB
Priority 5: -50-100 MB (node_modules 정크)
─────────────────────────
최종: 600-750 MB 🎯🎯🎯
절감: 37-50%
```

---

## 🎯 권장 실행 순서

### Step 1: 즉시 실행 (오늘)
- ✅ Priority 1-2 검증 (빌드 테스트)
- ✅ Windows/macOS 기능 검증
- ✅ Prisma 동작 확인

### Step 2: 선택적 최적화 (내일)
```bash
# Priority 3: googleapis 최적화
grep -r "googleapis" src/renderer src/main
# → 실제 사용 패턴 분석
# → 필요한 서비스만 import

# Priority 4: highlight.js 동적 로드
grep -r "highlight.js" src/renderer
# → 동적 import로 변환
```

### Step 3: 최종 정리 (선택)
- node_modules 제외 패턴 추가
- 재빌드 및 최종 테스트

---

## 🔧 예상 코드 변경 위치

### Priority 3: googleapis
```
src/renderer/lib/google/
src/main/services/
src/renderer/hooks/
```

### Priority 4: highlight.js
```
src/renderer/components/editors/
src/renderer/components/renderers/
src/renderer/lib/markdown/
```

### Priority 5: node_modules
```
electron-builder.json (files 배열 확장)
```

---

## 📝 체크리스트

### QA 검증
- [ ] Priority 1-2 빌드 완료
- [ ] Windows x64 설치 및 실행 테스트
- [ ] Windows ARM64 설치 및 실행 테스트
- [ ] macOS x64 설치 및 실행 테스트
- [ ] macOS ARM64 설치 및 실행 테스트
- [ ] Prisma 데이터베이스 읽기/쓰기 확인
- [ ] Google OAuth 로그인 확인
- [ ] Gemini AI 분석 확인
- [ ] 크기 측정 기록

### 추가 최적화
- [ ] Priority 3 구현 (googleapis)
- [ ] Priority 4 구현 (highlight.js)
- [ ] Priority 5 구현 (node_modules)
- [ ] 재빌드 및 크기 측정
- [ ] 최종 기능 검증

---

## 🚀 예상 일정

| 단계 | 작업 | 예상 시간 | 상태 |
|------|------|---------|------|
| 1 | Priority 1-2 QA | 1-2시간 | ⏳ 다음 |
| 2 | googleapis 최적화 | 30-45분 | ⏳ 이후 |
| 3 | highlight.js 최적화 | 20-30분 | ⏳ 이후 |
| 4 | node_modules 정크 | 15-20분 | ⏳ 선택 |
| 5 | 최종 검증 | 1-2시간 | ⏳ 마지막 |

**총 예상 시간:** 3-4시간 (완전 최적화)

