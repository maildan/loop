# 🔍 Loop App Bundle Size Analysis Report

## Executive Summary

**현재 상태:**
- 설치 크기: 1.2 GB (비정상)
- 예상 크기: 400-600 MB
- **차이: ~600-800 MB (50-100% 초과)**

**측정 결과:**
- node_modules: 2.0 GB
- release/ 빌드: 2.0 GB (거의 그대로)
- Prisma 바이너리: 99 MB

---

## 1. 근본 원인 분석

### 1.1 asarUnpack 과도 설정 ❌ **CRITICAL**

**현재 설정 (electron-builder.json):**
```json
"asarUnpack": [
  "**/*.node",
  "**/*.dll",
  "**/*.dylib",
  "**/*.so",
  "node_modules/.prisma/**/*",
  "node_modules/@prisma/**/*",
  "node_modules/.bin/prisma*",
  "node_modules/keytar/**/*",
  "node_modules/electron-updater/**/*"
]
```

**문제:**
- ASAR 압축 해제되는 파일들은 압축 효율 ↓
- `**/*.node` 패턴은 모든 디렉토리의 모든 .node 파일
- Prisma 바이너리(99MB) 전체가 unpacking → 약 50% 이상 용량 증가
- keytar, electron-updater 전체 unpacking 불필요

**영향:**
- ASAR 압축률: ~70% → ~50% (예상)
- 증가분: ~300-400 MB

### 1.2 Prisma 바이너리 중복 ❌ **HIGH**

**현재 구조:**
```json
"files": [
  "node_modules/.prisma/**/*",
  "node_modules/@prisma/client/**/*",
],
"asarUnpack": [
  "node_modules/.prisma/**/*",
  "node_modules/@prisma/**/*",
],
"extraResources": [
  {
    "from": "node_modules",
    "to": "node_modules",
    "filter": [
      ".prisma/**/*",
      "@prisma/client/**/*"
    ]
  }
]
```

**문제:**
- 같은 파일이 3곳에 지정되어 있음
- `files` + `extraResources` 중복 가능성

**영향:**
- Prisma 99MB가 2-3번 포함되면 → +100-200 MB

### 1.3 무거운 의존성 ❌ **HIGH**

**분석 결과:**
| 패키지 | 추정 크기 | 필요도 | 최적화 여부 |
|--------|---------|--------|----------|
| firebase | ~50MB | 🔴 검증 필요 | ✗ 동적 import 검토 |
| googleapis | ~30MB | 🟡 부분 필요 | ✗ tree-shaking 필요 |
| @tiptap/* | ~20MB | 🟢 필요 | ✓ 사용 중 |
| highlight.js | ~5MB | 🔴 선택적 | ✗ Dynamic import로 변경 |
| recharts | ~3MB | 🔴 검증 필요 | ✗ 필요한지 확인 |

**영향:**
- 불필요한 의존성: ~50-80 MB

### 1.4 node_modules 전체 포함 ❌ **MEDIUM**

**현재:**
```json
"files": [
  "out/main/**/*",
  "out/preload/**/*",
  "out/renderer/**/*",
  "assets/**/*",
  "public/assets/fonts/**/*",
  "!node_modules/**/*.ts",
  "!node_modules/**/LICENSE*",
  "!node_modules/**/*.map",
  "!node_modules/**/*.md",
  // ... 여러 제외 설정
]
```

**문제:**
- devDependencies 명시적 제외 없음
- 제외 목록이 길고 유지보수 어려움
- `!node_modules/**/*.ts` 등은 glob 패턴 비효율

**영향:**
- 불필요한 파일들: ~50-100 MB

---

## 2. 세부 파일 구조 분석

### 2.1 번들 구성 (예상)

```
Loop.app (1.2 GB)
├── Resources/
│   ├── app.asar (~500-600 MB) ← ASAR 압축 (하지만 unpacking으로 효율 감소)
│   ├── app.asar.unpacked/ (~400-500 MB)
│   │   ├── node_modules/.prisma/ (99 MB - 여기서 unpacking)
│   │   └── [기타 native modules]
│   └── [기타 리소스]
├── Contents/MacOS/Loop (실행파일)
└── [기타 프레임워크]
```

### 2.2 ASAR vs Unpacked Trade-off

**ASAR 압축 효율:**
- 평균 압축률: 70% (텍스트 기반 코드)
- Unpacked 파일들의 영향:
  - 99 MB Prisma 바이너리 → unpacked (비압축)
  - 기타 .node/.dll 파일들도 → unpacked
  - **전체 ASAR 압축률 하락: 70% → 50-55%**

---

## 3. 최적화 전략

### 3.1 Priority 1: asarUnpack 최소화 🔥

**변경:**
```json
"asarUnpack": [
  // ✅ 필요한 것만
  "**/.prisma/query-engine*.node",
  "**/.prisma/schema.prisma",
  "node_modules/keytar/build/**/*.node",  // 구체적으로
  "node_modules/electron-updater/node_modules/bufferutil/build/**/*.node"  // 선택적
]
```

**효과:**
- asarUnpack 크기: ~200MB → ~120MB
- ASAR 압축률 회복: 50% → 65%
- **절감: ~150-200 MB**

### 3.2 Priority 2: Prisma 중복 제거 🔥

**변경:**
```json
// ❌ 제거
"files": [
  // Prisma는 여기서 제외
],

// ✅ asarUnpack만 사용 (또는 extraResources만)
"asarUnpack": [
  "**/.prisma/query-engine*.node"
]
```

**효과:**
- Prisma 99MB 중복 제거
- **절감: ~100-150 MB**

### 3.3 Priority 3: 무거운 의존성 정리

**Firebase 최적화:**
```typescript
// ❌ Before: 전체 import
import firebase from 'firebase/app'
import 'firebase/auth'

// ✅ After: 필요한 것만 (아래는 예시)
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
```

**Google APIs 최적화:**
```typescript
// ❌ Before: 전체 googleapis 로드
import { google } from 'googleapis'

// ✅ After: 필요한 서비스만
import { google } from 'googleapis'
const drive = google.drive('v3')  // 필요한 것만
```

**효과:**
- firebase tree-shaking: ~50MB → ~15-20MB
- googleapis 최적화: ~30MB → ~5-10MB
- **절감: ~50-70 MB**

### 3.4 Priority 4: 동적 import 적용

**highlight.js 사용 (선택적인 경우):**
```typescript
// ✅ 필요할 때만 로드
if (shouldHighlight) {
  const hljs = await import('highlight.js')
  return hljs.default.highlight(code, options)
}
```

**효과:**
- highlight.js: ~5MB 제외 (필요할 때만 로드)
- **절감: ~5 MB**

### 3.5 Priority 5: node_modules 정리

**Whitelist 방식 설정:**
```json
"files": [
  "out/main/**/*",
  "out/preload/**/*",
  "out/renderer/**/*",
  "assets/**/*",
  "public/assets/fonts/**/*",
  "package.json",
  // ✅ 명시적 포함
  "node_modules/@prisma/**/*",
  "node_modules/keytar/**/*",
  "node_modules/electron-updater/**/*",
  // ... 기타 필수 패키지만
],
"excludeFiles": [
  "node_modules/**/*.ts",
  "node_modules/**/*.d.ts",
  "node_modules/**/*.map",
  "node_modules/**/*.md",
  "node_modules/**/LICENSE",
  "node_modules/**/README",
  "node_modules/**/CHANGELOG",
  "node_modules/**/test",
  "node_modules/**/tests",
  "node_modules/**/.github",
  "node_modules/**/examples",
  "node_modules/**/docs"
]
```

**효과:**
- 불필요한 파일 제거
- **절감: ~50-100 MB**

---

## 4. 예상 최적화 결과

### 현재 상태
```
Total: 1.2 GB
├── ASAR (압축): ~400 MB
├── ASAR.unpacked: ~400 MB (Prisma, native modules)
└── 기타: ~400 MB
```

### 최적화 후 (모든 우선순위 적용)
```
Total: ~500-600 MB
├── ASAR (압축): ~300 MB (압축률 65%)
├── ASAR.unpacked: ~80-100 MB (Prisma .node만)
└── 기타: ~100-150 MB

절감: ~600 MB (50% 감소) ✅
```

---

## 5. 플랫폼별 고려사항

### macOS
- ✅ Electron 빌드 표준 구조
- ❌ 코드 서명으로 인한 크기 증가 (무시 가능)
- 예상: 500-550 MB

### Windows x64 / ARM64
- ✅ nsis-web로 설치 최적화 가능
- ⚠️ 두 개 바이너리 (x64 + ARM64) 제공
- 예상: 550-650 MB (각각)

---

## 6. 구현 체크리스트

- [ ] **Step 1**: asarUnpack 최소화 (Priority 1)
  - 테스트: `pnpm dist:win --publish never`
  - 결과 측정: release/ 크기 체크

- [ ] **Step 2**: Prisma 중복 제거 (Priority 2)
  - electron-builder.json 정리
  - 테스트: Windows/Mac 모두 확인

- [ ] **Step 3**: 의존성 tree-shaking (Priority 3)
  - firebase 동적 import 적용
  - googleapis 선택적 로드 검토
  - 테스트: AI 기능 정상 작동

- [ ] **Step 4**: 동적 import (Priority 4)
  - highlight.js, recharts 검토
  - 필요시 동적 로드 적용

- [ ] **Step 5**: node_modules 화이트리스트 (Priority 5)
  - 필수 패키지만 명시
  - 불필요한 폴더 제외

- [ ] **Step 6**: 통합 테스트
  - Windows 빌드: `pnpm build:win`
  - macOS 빌드: `pnpm build:mac`
  - 설치 및 실행 테스트
  - 모든 기능 정상 작동 확인

- [ ] **Step 7**: CI/CD 업데이트
  - release.yml 성능 모니터링 추가
  - 크기 변화 로깅

---

## 7. 추가 도구 & 분석

### 번들 분석 도구

1. **ASAR 분석:**
```bash
# asar 패키지 설치
npm install -g asar

# app.asar 내용 확인
asar list path/to/app.asar | head -50

# 크기 분석
asar list path/to/app.asar | wc -l
```

2. **node_modules 분석:**
```bash
# 상위 N개 큰 폴더 확인
du -sh node_modules/*/ | sort -rh | head -20

# Specific 패키지 크기
du -sh node_modules/firebase node_modules/googleapis node_modules/@tiptap
```

3. **빌드 산물 분석:**
```bash
# release 폴더 내용 확인
du -sh release/*
find release -name "*.node" -exec ls -lh {} \;
```

---

## 8. 예상 일정

| Priority | 작업 | 예상 시간 | 절감량 |
|----------|------|---------|-------|
| 1 | asarUnpack 최소화 | 30분 | 150-200 MB |
| 2 | Prisma 중복 제거 | 20분 | 100-150 MB |
| 3 | 의존성 정리 | 1-2시간 | 50-70 MB |
| 4 | 동적 import | 30분 | 5 MB |
| 5 | node_modules 정리 | 1시간 | 50-100 MB |
| 6 | 테스트 | 1-2시간 | - |
| **총계** | | **~5-6시간** | **~355-515 MB (30-43%)** |

---

## 9. 참고 자료

- [electron-builder 공식 문서](https://www.electron.build)
- [ASAR 압축 가이드](https://github.com/electron/asar)
- [Electron 번들 크기 최적화](https://medium.com/@mkniazi.886/reducing-build-size-of-your-electron-app-2024-cbb30425dc31)
- [Node modules 최적화](https://tsh.io/blog/reduce-node-modules-for-better-performance/)

