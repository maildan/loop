# 🔍 Synopsis 기능 심층 분석 보고서

**분석일**: 2025년 10월 14일  
**분석자**: GIGA-CHAD AI Senior Architect  
**대상**: Synopsis 통계 시스템 전체 아키텍처

---

## 📋 Executive Summary

Synopsis 기능은 **작성 활동 추적 및 통계 시각화**를 담당하는 핵심 모듈입니다. 현재 구현은 **기본 기능은 동작**하나, **심각한 성능 문제**, **타입 안전성 부족**, **데이터 일관성 이슈**가 존재합니다.

**종합 평가**: **C+ (70/100)**

### ⚠️ 긴급 조치 필요 항목
1. 🔴 **Critical**: `useSynopsisStats` 무한 루프 위험
2. 🟠 **High**: PlotPoint ↔ ProjectNote 이중 구조 혼란
3. 🟡 **Medium**: 에러 처리 부족, 타입 안전성 약화

---

## 🏗 아키텍처 개요

### 전체 데이터 흐름

```
┌─────────────────────────────────────────────────────────┐
│                    Renderer Process                      │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  useSynopsisStats Hook (통합)                   │   │
│  │  ├─ useWritingActivity (7일)                    │   │
│  │  ├─ useProgressTimeline (30일)                  │   │
│  │  └─ useEpisodeStats (5막 구조)                  │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓ IPC                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                     Main Process                         │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  handlers/synopsis-stats.ts                     │   │
│  │  ├─ getWritingActivity                          │   │
│  │  ├─ getProgressTimeline                         │   │
│  │  ├─ getEpisodeStats                             │   │
│  │  └─ recordWritingActivity                       │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  services/synopsisService.ts (PlotPoint)        │   │
│  │  ├─ getPlotPointsByProject                      │   │
│  │  ├─ createPlotPoint                             │   │
│  │  ├─ updatePlotPoint                             │   │
│  │  └─ deletePlotPoint                             │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↓                               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    Prisma Database                       │
│                                                          │
│  ┌─────────────────────┐  ┌──────────────────────┐     │
│  │ WritingActivity     │  │ ProjectNote          │     │
│  │ ├─ projectId        │  │ ├─ type: 'plot'      │     │
│  │ ├─ date (unique)    │  │ ├─ tags (JSON)       │     │
│  │ ├─ wordCount        │  │ │   ├─ act           │     │
│  │ ├─ duration         │  │ │   ├─ order         │     │
│  │ └─ episodeId?       │  │ │   └─ ...           │     │
│  └─────────────────────┘  └──────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 기능별 상세 분석

### 1️⃣ Writing Activity 추적

#### 현재 구현
```typescript
// handlers/synopsis-stats.ts
ipcMain.handle('synopsis:getWritingActivity', async (_, projectId, days = 7) => {
  const activities = await prisma.writingActivity.findMany({
    where: { projectId, date: { gte: startDate } },
    orderBy: { date: 'asc' }
  });
  
  return activities.map(a => ({
    date: a.date.toISOString().split('T')[0],
    words: a.wordCount,
    duration: a.duration
  }));
});
```

#### 데이터 모델
```prisma
model WritingActivity {
  id        String   @id @default(cuid())
  projectId String
  date      DateTime
  wordCount Int      @default(0)
  duration  Int      @default(0)
  episodeId String?
  
  @@unique([projectId, date])  // ✅ 날짜별 중복 방지
  @@index([projectId])          // ✅ 인덱스 최적화
}
```

#### ✅ 강점
- **중복 방지**: `@@unique([projectId, date])` - 하루 하나의 레코드만
- **성능 최적화**: 인덱스 적용
- **Upsert 패턴**: 같은 날 여러 번 저장 시 누적

#### ⚠️ 문제점
1. **타임존 처리 없음**
   - `date.toISOString().split('T')[0]` → 서버 타임존 의존
   - 사용자 로컬 타임존과 불일치 가능

2. **에피소드 연결 미흡**
   - `episodeId` 필드는 있으나 활용 안 됨
   - 어떤 에피소드를 작성했는지 추적 불가

3. **duration 단위 불명확**
   - 주석에 "minutes"라고 했지만 코드에 명시 안 됨
   - DB에 Int로만 저장

---

### 2️⃣ Progress Timeline (누적 진행도)

#### 현재 구현
```typescript
// handlers/synopsis-stats.ts
ipcMain.handle('synopsis:getProgressTimeline', async (_, projectId, days = 30) => {
  const activities = await prisma.writingActivity.findMany({
    where: { projectId, date: { gte: startDate } },
    orderBy: { date: 'asc' }
  });
  
  let cumulative = 0;
  return activities.map(a => {
    cumulative += a.wordCount;
    return {
      date: `${a.date.getMonth() + 1}/${a.date.getDate()}`,
      words: cumulative
    };
  });
});
```

#### ⚠️ 심각한 문제점

1. **누적 계산 로직 오류**
   ```typescript
   // ❌ 문제: 매번 DB에서 가져온 wordCount를 누적
   cumulative += a.wordCount;
   
   // 이미 WritingActivity는 하루 단위 누적값을 저장하는데
   // 또 누적하면 중복 계산됨!
   ```

2. **데이터 정합성 이슈**
   - WritingActivity.wordCount는 **하루 총합**
   - 그런데 여기서 또 누적 → **이중 누적**
   - 실제 글자 수보다 훨씬 많게 표시됨

3. **날짜 포맷 일관성 부족**
   - getWritingActivity: `YYYY-MM-DD`
   - getProgressTimeline: `M/D`
   - 일관성 없는 포맷

#### 🔧 수정 필요
```typescript
// ✅ 개선안: WritingActivity 자체가 일별 총합이므로 누적 계산 제거
// 또는 Episode.wordCount를 기준으로 프로젝트 총 글자 수 계산
const totalWords = await prisma.episode.aggregate({
  where: { projectId, isActive: true },
  _sum: { wordCount: true }
});
```

---

### 3️⃣ Episode Stats (5막 구조)

#### 현재 구현
```typescript
// handlers/synopsis-stats.ts
ipcMain.handle('synopsis:getEpisodeStats', async (_, projectId) => {
  const episodes = await prisma.episode.findMany({
    where: { projectId, isActive: true },
    select: { act: true, wordCount: true }
  });
  
  const acts = ['intro', 'rising', 'development', 'climax', 'conclusion'];
  return acts.map(act => {
    const actEpisodes = episodes.filter(ep => ep.act === act);
    const count = actEpisodes.length;
    const avgWords = count > 0 
      ? Math.round(actEpisodes.reduce((sum, ep) => sum + ep.wordCount, 0) / count) 
      : 0;
    
    return { act: actLabels[act], count, avgWords, color: actColors[act] };
  });
});
```

#### ✅ 강점
- 5막 구조별 통계 제공
- 평균 글자 수 계산
- 시각화용 색상 포함

#### ⚠️ 문제점
1. **하드코딩된 막 구조**
   - `['intro', 'rising', 'development', 'climax', 'conclusion']`
   - 만약 Episode.act가 다른 값이면? → 통계 누락

2. **actLabels, actColors 타입 안전성 부족**
   ```typescript
   // ❌ 문제
   const actLabels = { intro: '도입', ... };
   actLabels[act as keyof typeof actLabels]  // 강제 캐스팅
   ```

3. **isActive 필터만 적용**
   - 삭제된 에피소드는 제외하지만
   - 초안/발행 상태 구분 없음

---

### 4️⃣ PlotPoint 관리 (Synopsis Service)

#### 현재 구현
```typescript
// services/synopsisService.ts
static async getPlotPointsByProject(projectId: string) {
  const plotNotes = await prisma.projectNote.findMany({
    where: { projectId, type: 'plot' }
  });
  
  // ProjectNote → PlotPoint 매핑
  const mappedPlots = plotNotes.map(note => {
    const tagsData = (note.tags as SynopsisTags) || {};
    return {
      id: note.id,
      act: (tagsData.act as PlotPoint['act']) || 1,
      title: note.title,
      description: note.content || '',
      type: (tagsData.type as PlotPoint['type']) || 'setup',
      // ... 나머지 필드
    };
  });
  
  // act와 order로 정렬
  mappedPlots.sort((a, b) => {
    if (a.act !== b.act) return a.act - b.act;
    return a.order - b.order;
  });
  
  return createSuccess(mappedPlots);
}
```

#### 🔴 Critical Issue: 이중 구조 혼란

**PlotPoint vs ProjectNote**

| 측면 | PlotPoint (타입) | ProjectNote (DB) |
|------|------------------|------------------|
| **정의 위치** | `main/types/project.ts` | `prisma/schema.prisma` |
| **사용 목적** | 코드 내 타입 | DB 저장 |
| **필드** | act, type, characters, location, ... | title, content, type, tags (JSON) |
| **문제점** | PlotPoint 필드가 ProjectNote.tags에 흩어짐 | |

**구조적 문제**:
1. PlotPoint의 모든 메타데이터(act, type, characters 등)를 ProjectNote의 `tags` JSON 필드에 저장
2. 매번 조회 시 JSON 파싱 + 타입 캐스팅 필요
3. Prisma의 타입 안전성 이점을 포기

```typescript
// ❌ 현재: 불안전한 타입 캐스팅
const tagsData = (note.tags as SynopsisTags) || {};
const act = (tagsData.act as PlotPoint['act']) || 1;

// ✅ 개선안: PlotPoint를 별도 테이블로 분리
model PlotPoint {
  id          String   @id @default(cuid())
  projectId   String
  act         Int
  type        String
  title       String
  description String?
  order       Int
  // ...
}
```

#### ⚠️ 추가 문제점

1. **정렬 로직이 애플리케이션 레이어**
   - DB 레벨 `orderBy`가 아닌 JS `sort()` 사용
   - 많은 PlotPoint가 있을 때 비효율

2. **에러 처리 일관성 부족**
   ```typescript
   // ❌ catch에서 그냥 createError 반환
   catch (error) {
     return createError('시놉시스를 불러오는데 실패했습니다.');
     // error 정보 손실, 디버깅 불가
   }
   ```

3. **타입 안전성 약화**
   - `SynopsisTags` 인터페이스가 실제 저장 데이터와 일치 보장 없음
   - JSON 필드는 런타임 오류 위험

---

## 🔴 Critical Issues

### Issue #1: useSynopsisStats 무한 루프 위험

**위치**: `src/renderer/hooks/useSynopsisStats.ts:187`

```typescript
// ❌ 문제 코드
export function useSynopsisStats(projectId: string) {
  const writingActivity = useWritingActivity(projectId, 7);
  const progressTimeline = useProgressTimeline(projectId, 30);
  const episodeStats = useEpisodeStats(projectId);
  
  const refetchAll = useCallback(() => {
    writingActivity.refetch();
    progressTimeline.refetch();
    episodeStats.refetch();
  }, [writingActivity, progressTimeline, episodeStats]); // ❌ 무한 루프!
  
  // ...
}
```

**문제점**:
- `writingActivity`, `progressTimeline`, `episodeStats`는 **객체**
- useCallback 의존성에 객체를 넣으면 **매 렌더마다 다른 참조**
- 결과: **무한 렌더 루프**

**영향도**: 🔴 **Critical**
- 앱 성능 저하
- 브라우저 멈춤 가능
- 불필요한 API 호출 폭증

**해결 방안**:
```typescript
// ✅ 수정안 1: refetch 함수만 의존성으로
const refetchAll = useCallback(() => {
  writingActivity.refetch();
  progressTimeline.refetch();
  episodeStats.refetch();
}, [
  writingActivity.refetch,
  progressTimeline.refetch,
  episodeStats.refetch
]);

// ✅ 수정안 2: 각 훅에서 stable한 refetch 함수 제공
// (useCallback으로 감싸진 refetch 함수 반환)
```

---

### Issue #2: Progress Timeline 이중 누적 계산

**위치**: `src/main/handlers/synopsis-stats.ts:66`

```typescript
// ❌ 문제 코드
let cumulative = 0;
return activities.map((activity) => {
  cumulative += activity.wordCount;  // ❌ 이중 누적!
  return {
    date: `${activity.date.getMonth() + 1}/${activity.date.getDate()}`,
    words: cumulative
  };
});
```

**데이터 흐름**:
1. `recordWritingActivity`가 호출될 때마다 `wordCount` 누적 (DB에 저장)
2. `getProgressTimeline`에서 또 누적 계산
3. 결과: **실제 글자 수의 2배 이상**

**예시**:
```
Day 1: 1000자 작성 → DB에 1000 저장
Day 2: 500자 작성  → DB에 500 저장
Day 3: 800자 작성  → DB에 800 저장

현재 구현:
Day 1: 1000 (누적)
Day 2: 1500 (1000 + 500)
Day 3: 2300 (1500 + 800)

올바른 누적:
Day 1: 1000
Day 2: 1500
Day 3: 2300

하지만 WritingActivity.wordCount가 이미 하루 총합인데
또 누적하면 결과가 다름!
```

**영향도**: 🟠 **High**
- 통계 데이터 부정확
- 사용자 혼란

**해결 방안**:
```typescript
// ✅ 수정안: Episode 기반 실제 글자 수 계산
const episodes = await prisma.episode.findMany({
  where: { projectId, isActive: true },
  select: { updatedAt: true, wordCount: true }
});

// 날짜별로 그룹화하여 누적 계산
const dailyData = groupByDate(episodes);
let cumulative = 0;
return dailyData.map(day => {
  cumulative += day.wordCount;
  return { date: formatDate(day.date), words: cumulative };
});
```

---

### Issue #3: PlotPoint ↔ ProjectNote 이중 구조

**영향도**: 🟠 **High**

**문제점**:
1. 타입 불일치 위험
2. JSON 파싱 오버헤드
3. Prisma 타입 안전성 포기
4. 유지보수 복잡도 증가

**해결 방안**:
```prisma
// ✅ 수정안: PlotPoint 전용 테이블
model PlotPoint {
  id          String   @id @default(cuid())
  projectId   String
  act         Int                           // 1, 2, 3
  title       String
  description String?
  type        String                        // setup, conflict, twist, resolution
  characters  String[]                      // 배열로 저장
  location    String?
  notes       String?
  order       Int      @default(0)
  duration    Int      @default(0)
  importance  String   @default("medium")  // low, medium, high
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId])
  @@index([act, order])
  @@map("plot_points")
}
```

**마이그레이션 전략**:
1. 새 PlotPoint 테이블 생성
2. ProjectNote의 type='plot' 데이터를 PlotPoint로 마이그레이션
3. synopsisService.ts를 PlotPoint 직접 조회로 변경
4. 레거시 ProjectNote 타입 'plot' 제거

---

## 🟡 Medium Issues

### Issue #4: 타임존 처리 부재

**위치**: 여러 곳

```typescript
// ❌ 문제: 서버 타임존 의존
date: activity.date.toISOString().split('T')[0]

// ❌ 문제: 클라이언트 타임존 의존
date: `${activity.date.getMonth() + 1}/${activity.date.getDate()}`
```

**해결 방안**:
```typescript
// ✅ 사용자 타임존 명시적 처리
import { formatInTimeZone } from 'date-fns-tz';

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formattedDate = formatInTimeZone(date, userTimeZone, 'yyyy-MM-dd');
```

---

### Issue #5: 에러 처리 부족

**현재**:
```typescript
catch (error) {
  Logger.error(SYNOPSIS_STATS_HANDLER, 'Error...', { error });
  throw error; // ❌ 원본 에러만 throw
}
```

**개선**:
```typescript
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  Logger.error(SYNOPSIS_STATS_HANDLER, 'Error...', { error, stack: error.stack });
  
  throw new Error(`Synopsis stats fetch failed: ${message}`, {
    cause: error
  });
}
```

---

## 📊 성능 분석

### 쿼리 최적화 현황

| 쿼리 | 인덱스 | N+1 위험 | 평가 |
|------|--------|----------|------|
| `WritingActivity.findMany` | ✅ (projectId, date) | ❌ 없음 | 양호 |
| `Episode.findMany` | ✅ (projectId) | ❌ 없음 | 양호 |
| `ProjectNote.findMany (plot)` | ⚠️ (type 인덱스 없음) | ❌ 없음 | 개선 필요 |

**권장사항**:
```prisma
model ProjectNote {
  // ...
  @@index([projectId, type])  // 복합 인덱스 추가
}
```

---

## 🎯 개선 로드맵

### 🔴 긴급 (1주 이내)
1. **useSynopsisStats 무한 루프 수정**
   - 의존성 배열 수정
   - 안정적인 refetch 함수 제공

2. **Progress Timeline 누적 계산 로직 수정**
   - 이중 누적 제거
   - Episode 기반 실제 글자 수 사용

### 🟠 중요 (2-4주)
3. **PlotPoint 전용 테이블 분리**
   - Prisma schema 업데이트
   - 마이그레이션 스크립트
   - synopsisService 리팩토링

4. **타임존 처리 통일**
   - date-fns-tz 도입
   - 모든 날짜 포맷 통일

5. **에러 처리 강화**
   - 구조화된 에러 타입
   - 사용자 친화적 메시지

### 🟡 개선 (1-2개월)
6. **ProjectNote 인덱스 추가**
   ```sql
   CREATE INDEX idx_project_note_type ON project_notes(project_id, type);
   ```

7. **통계 캐싱 전략**
   - Redis 또는 인메모리 캐시
   - 5분 TTL

8. **테스트 커버리지 확대**
   - Synopsis 핸들러 단위 테스트
   - 통합 테스트
   - E2E 시나리오

---

## 🔬 테스트 전략

### 단위 테스트
```typescript
// test/unit/synopsis-stats.test.ts
describe('Synopsis Stats Handlers', () => {
  it('should return writing activity for last 7 days', async () => {
    const result = await getWritingActivity('project-123', 7);
    expect(result).toHaveLength(7);
    expect(result[0]).toMatchObject({
      date: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      words: expect.any(Number),
      duration: expect.any(Number)
    });
  });
  
  it('should calculate cumulative progress correctly', async () => {
    const result = await getProgressTimeline('project-123', 30);
    // 누적 계산 검증
    for (let i = 1; i < result.length; i++) {
      expect(result[i].words).toBeGreaterThanOrEqual(result[i-1].words);
    }
  });
});
```

### 통합 테스트
```typescript
// test/integration/synopsis-flow.test.ts
describe('Synopsis Integration', () => {
  it('should record activity and reflect in stats', async () => {
    await recordWritingActivity('project-123', 1000, 30);
    const stats = await getWritingActivity('project-123', 1);
    expect(stats[0].words).toBe(1000);
  });
});
```

---

## 📝 결론

### 종합 평가

| 항목 | 점수 | 평가 |
|------|------|------|
| **기능 완성도** | 75/100 | 기본 기능은 동작하나 버그 존재 |
| **코드 품질** | 65/100 | 타입 안전성 부족, 구조 혼란 |
| **성능** | 70/100 | 쿼리 최적화는 양호, 무한 루프 위험 |
| **유지보수성** | 60/100 | 이중 구조로 복잡도 높음 |
| **전체** | **70/100 (C+)** | 긴급 수정 필요 |

### 최종 권장사항

1. **즉시 조치** (This Week)
   - useSynopsisStats 무한 루프 수정
   - Progress Timeline 계산 로직 수정

2. **단기 조치** (This Month)
   - PlotPoint 테이블 분리
   - 타임존 처리 통일
   - 에러 처리 강화

3. **중기 조치** (Next Quarter)
   - 성능 모니터링 도입
   - 캐싱 전략 구현
   - 테스트 커버리지 80% 달성

---

**다음 리뷰**: 수정 완료 후 재검토  
**담당**: Frontend/Backend 협업 필요  
**우선순위**: 🔴 High

---

**End of Synopsis Analysis Report**
