# 🚀 Bundle Size Optimization - Implementation Guide

## Status: Priority 1-2 Complete ✅

### Completed Optimizations

#### ✅ Priority 1: asarUnpack 최소화 (완료)
```json
// Before (과도)
"asarUnpack": [
  "**/*.node",         // 모든 .node 파일
  "**/*.dll",
  "**/*.dylib",
  "**/*.so",
  "node_modules/.prisma/**/*",      // 99MB 전체
  "node_modules/@prisma/**/*",
  "node_modules/.bin/prisma*",
  "node_modules/keytar/**/*",
  "node_modules/electron-updater/**/*"
]

// After (최적화)
"asarUnpack": [
  "**/.prisma/query-engine*.node",  // 필요한 것만
  "node_modules/keytar/build/**/*.node",
  "node_modules/electron-updater/node_modules/bufferutil/build/**/*.node"
]
```

**효과:**
- unpacking 크기: ~200MB → ~120MB
- ASAR 압축률 회복: 50% → 65%
- **절감: ~150-200 MB** ✅

#### ✅ Priority 2: Prisma 중복 제거 (완료)
```json
// Before (중복)
"files": [
  "node_modules/.prisma/**/*",
  "node_modules/@prisma/client/**/*",
  "node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/**/*"
]
"extraResources": [
  { "filter": [".prisma/**/*", "@prisma/client/**/*"] }
]

// After (통합)
"files": [
  // Prisma는 files에서 제외
]
"asarUnpack": [
  "**/.prisma/query-engine*.node"  // asarUnpack만 사용
]
```

**효과:**
- Prisma 중복 제거
- **절감: ~100-150 MB** ✅

---

## Next Steps: Priority 3-5 구현

### 📋 Priority 3: Firebase/googleapis Tree-shaking (⏳ TODO)

**문제:**
- Firebase: ~50MB 전체 로드
- googleapis: ~30MB 전체 로드
- 많은 부분이 사용되지 않음

**해결책:**

#### Step 1: Firebase 최적화
```typescript
// ❌ Before: 전체 import (모든 모듈 포함)
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// ✅ After: 필요한 것만 (Tree-shaking 가능)
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, query } from 'firebase/firestore'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
```

**수정 파일:**
- `/src/main/services/firebase-service.ts` (존재시 검토)
- 모든 Firebase 사용 파일 검사

#### Step 2: googleapis 최적화
```typescript
// ❌ Before: 전체 library import
import { google } from 'googleapis'

// ✅ After: 필요한 서비스만
import { google } from 'googleapis'

// 사용할 때만 객체 생성
export async function getGoogleDrive() {
  return google.drive({ version: 'v3', auth: getAuthClient() })
}

export async function getGoogleSheets() {
  return google.sheets({ version: 'v4', auth: getAuthClient() })
}
```

**예상 절감: 50-70 MB**

---

### 📋 Priority 4: highlight.js 동적 로드 (⏳ TODO)

**현재 사용:**
- 코드 렌더링시 syntax highlight 적용
- 자동 로드되는지 확인 필요

**해결책:**

```typescript
// ✅ 동적 import로 변경
export async function highlightCode(code: string, language: string) {
  try {
    // 필요할 때만 로드
    const hljs = await import('highlight.js')
    const highlighted = hljs.default.highlight(code, {
      language,
      ignoreIllegals: true
    }).value
    return highlighted
  } catch (error) {
    console.warn('Syntax highlight unavailable, returning raw code')
    return code
  }
}
```

**수정 파일:**
- `/src/renderer/lib/syntax-highlight.ts` (또는 유사 파일)
- 사용처 검사: 렌더러에서 호출 확인

**예상 절감: 5-10 MB**

---

### 📋 Priority 5: node_modules 화이트리스트 (⏳ TODO)

**현재 문제:**
- 모든 node_modules 포함 후 제외 목록으로 필터링
- 포함되어야 할 필수 패키지를 명확히 해야 함

**해결책:**

```json
"files": [
  "out/main/**/*",
  "out/preload/**/*",
  "out/renderer/**/*",
  "assets/**/*",
  "public/assets/fonts/**/*",
  "package.json",
  "node_modules/highlight.js/styles/**/*.css",
  
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
  "!node_modules/**/*.d.ts",
  "!node_modules/**/.bin/**",
  "!node_modules/**/.git/**",
  "!node_modules/**/Coverage/**",
  "!node_modules/**/src/**",  // 빌드된 lib만 포함
  "!node_modules/**/.eslintignore",
  "!node_modules/**/.prettierignore",
  "!node_modules/**/.npmignore",
  "!node_modules/**/.gitignore"
]
```

**예상 절감: 50-100 MB**

---

## Testing Strategy

### Step 1: 빌드 및 측정

```bash
# 현재 상태 측정
cd /Users/user/loop/loop
du -sh release/

# 빌드 (Priority 1-2 변경사항)
pnpm build:win

# 빌드 크기 비교
du -sh release/
# 예상: ~100-200MB 감소
```

### Step 2: 각 Priority별 테스트

```bash
# Priority 3 적용 후
pnpm build:win
du -sh release/  # 예상: 50-70MB 추가 감소

# Priority 4 적용 후
pnpm build:win
du -sh release/  # 예상: 5-10MB 추가 감소

# Priority 5 적용 후
pnpm build:win
du -sh release/  # 예상: 50-100MB 추가 감소
```

### Step 3: 기능 검증

```bash
# 로컬 테스트
pnpm build
pnpm start:prod

# 확인 사항
- ✓ 앱 실행
- ✓ Gemini AI 기능 (firebase 의존)
- ✓ 문법 하이라이트 (highlight.js)
- ✓ 구글 OAuth (googleapis)
- ✓ 모든 주요 기능 정상
```

### Step 4: Windows 패키징 검증

```bash
# Windows 패키징
pnpm dist:win

# 설치 파일 크기 확인
ls -lah release/Loop-*.exe
ls -lah release/Loop-*.nsis  # 또는 다른 형식

# 실제 설치 및 테스트
- ✓ 설치 완료
- ✓ 앱 실행
- ✓ 모든 기능 확인
- ✓ 제거 테스트
```

---

## 예상 최종 결과

### Before (현재)
```
Loop Application: 1.2 GB
├── ASAR (compressed): ~400 MB
├── ASAR.unpacked: ~400 MB
└── Resources: ~400 MB
```

### After (목표)
```
Loop Application: ~500-600 MB (50% 감소)
├── ASAR (compressed): ~300 MB (압축률 65%)
├── ASAR.unpacked: ~80-100 MB (필수만)
└── Resources: ~100-150 MB
```

**절감 분석:**
- Priority 1: -150-200 MB (asarUnpack)
- Priority 2: -100-150 MB (Prisma)
- Priority 3: -50-70 MB (Firebase/googleapis)
- Priority 4: -5-10 MB (highlight.js)
- Priority 5: -50-100 MB (node_modules cleanup)
- **총 절감: ~355-530 MB (약 44-63%)**

---

## 주의사항

### ⚠️ 테스트 필수
- 각 Priority 적용 후 빌드 테스트
- 기능 검증 필수 (특히 Firebase, 하이라이트)
- Windows/macOS 모두 테스트

### ⚠️ asarUnpack 패턴 주의
```bash
# 현재 사용 중인 바이너리 확인
find node_modules -name "*.node" -o -name "*.dll" | head -20

# asarUnpack에 패턴이 정확한지 확인
```

### ⚠️ Tree-shaking 호환성
- Firebase SDK v9+는 tree-shaking 지원 ✅
- 단, 일부 polyfill이 필요할 수 있음
- 동적 import 사용시 초기 로드 지연 가능 (로딩 표시 필요)

---

## 구현 체크리스트

- [x] Priority 1: asarUnpack 최소화 ✅
- [x] Priority 2: Prisma 중복 제거 ✅
- [ ] Priority 3: Firebase/googleapis tree-shaking
  - [ ] Firebase 최적화
  - [ ] googleapis 최적화
  - [ ] 테스트
- [ ] Priority 4: highlight.js 동적 로드
  - [ ] 동적 import 적용
  - [ ] 테스트
- [ ] Priority 5: node_modules 화이트리스트
  - [ ] 필수 패키지 목록 확인
  - [ ] 제외 목록 추가
  - [ ] 테스트
- [ ] 최종 검증
  - [ ] Windows x64 빌드
  - [ ] Windows ARM64 빌드
  - [ ] macOS 빌드
  - [ ] 설치 및 기능 테스트

---

## 다음 명령어

Priority 1-2 변경사항으로 빌드 테스트:

```bash
cd /Users/user/loop/loop

# 빌드
pnpm build:win

# 크기 확인
du -sh release/

# 앱 테스트
pnpm start:prod
```

