# 🚨 Critical #4: Transaction 처리 - 비관적 분석

## 📋 비관적 관점 (Pessimistic View)

### 현재 상황: 트랜잭션 부재로 인한 데이터 불일치 위험

#### 시나리오 1: 프로젝트 + 캐릭터 생성 실패

```typescript
// 현재 코드 (위험함)
ipcMain.handle('projects:create', async (_event, projectData) => {
  try {
    // ✅ Step 1: 프로젝트 생성 성공
    const project = await prisma.project.create({ data: projectData });
    Logger.info('프로젝트 생성 완료');
    
    // ❌ Step 2: 캐릭터 생성 시작 (별도 IPC 호출이라고 가정)
    // 사용자가 UI에서 "다음" 버튼 클릭하여 캐릭터 생성 시작
    
    return { success: true, data: project };
  } catch (error) {
    // Step 1은 성공했으므로 DB에 프로젝트가 남아있음
    // Step 2 없이 불완전한 프로젝트 상태
    Logger.error('실패:', error);
    return { success: false };
  }
});

// 결과: DB에 캐릭터 없는 프로젝트 존재 ⚠️
```

#### 시나리오 2: 에피소드 생성 + 프로젝트 wordCount 업데이트 불일치

```typescript
// 문제: 
const episode = await prisma.episode.create({...});  // ✅ 성공
// ... 네트워크 지연 1초 ...
const updated = await prisma.project.update({        // ❌ 실패 (DB 손상)
  where: { id: projectId },
  data: { wordCount: { increment: episode.wordCount } }
});

// 결과:
// - Episode: 생성됨 (DB에 존재)
// - Project: wordCount 미업데이트 (불일치) ❌
```

#### 시나리오 3: 배치 업데이트 중간 실패

```typescript
// projects:update-characters 핸들러
await prisma.projectCharacter.deleteMany({ where: { projectId } }); // ✅

// 이 시점에서 500명 캐릭터 삭제됨

for (let i = 0; i < newCharacters.length; i++) {
  if (i === 250) {
    // DB 연결 끊김 또는 디스크 부족
    throw new Error('Write failed at index 250');
  }
  await prisma.projectCharacter.create({ data: newCharacters[i] }); // ❌
}

// 결과:
// - 500명 삭제됨
// - 250명만 생성됨
// - 250명 캐릭터 손실 ❌❌❌ (데이터 손실!)
```

#### 시나리오 4: 프로젝트 삭제 + 계단식 삭제 불완전

```typescript
// Prisma CASCADE 설정이 있어도, 중간에 에러 발생 시:
await prisma.project.delete({ where: { id } }); // ❌ 실패

// 결과:
// - 프로젝트는 남아있음
// - 하지만 관련 캐릭터는 부분 삭제됨
// - 데이터 무결성 훼손 ❌
```

---

## 🔍 근본 원인

### 1️⃣ 단일 쓰기 작업만 Mutex로 보호
- ✅ `projects:create` 혼자는 안전
- ❌ **멀티스텝 작업들은 보호 불가**
  - Step A 성공 → Step B 실패 → 부분 저장

### 2️⃣ 별도 IPC 요청으로 관련 작업 분리
- 예: 프로젝트 생성 → 캐릭터 생성 (별도 요청)
- 중간에 사용자 취소 또는 네트워크 오류 가능

### 3️⃣ 배치 작업 중간 실패 처리 없음
- `deleteMany` + `createMany` 루프
- 하나 실패 시 이전 모두 롤백 안 됨

---

## 🎯 해결책: Prisma $transaction()

### 핵심: **All or Nothing (ACID)**

```typescript
// ✅ 올바른 방법 (트랜잭션)
const result = await databaseMutex.acquireWriteLock(async () => {
  const prisma = await prismaService.getClient();
  
  return await prisma.$transaction(async (tx) => {
    // Step 1: 프로젝트 생성
    const project = await tx.project.create({ data: projectData });
    
    // Step 2: 기본 캐릭터 생성
    const character = await tx.projectCharacter.create({
      data: {
        projectId: project.id,
        name: '주인공'
      }
    });
    
    return { project, character };
    // ✅ 모두 성공 → Commit
    // ❌ 하나라도 실패 → 전체 Rollback
  });
});
```

---

## 📊 적용 대상 (트랜잭션 필요 핸들러)

### 🔴 High Priority (반드시 필요)

1. **projects:create**
   - Issue: 프로젝트만 생성되고 캐릭터 생성 안 될 수 있음
   - Fix: 프로젝트 + 기본 캐릭터를 트랜잭션으로

2. **projects:update-characters** (배치)
   - Issue: 삭제 후 생성 중 실패 → 캐릭터 손실
   - Fix: deleteMany + createMany를 트랜잭션으로

3. **projects:update-notes** (배치)
   - Issue: 삭제 후 생성 중 실패 → 노트 손실
   - Fix: deleteMany + createMany를 트랜잭션으로

### 🟠 Medium Priority (권장)

4. **episode:create** (EpisodeService)
   - Issue: 에피소드 생성 + wordCount 업데이트 불일치
   - Status: ✅ 이미 사용 중 (EpisodeService.ts 참고)

5. **projects:delete**
   - Issue: Cascading 삭제가 불완전할 수 있음
   - Fix: delete 전에 관련 데이터 확인 및 함께 삭제

---

## 🛠️ 구현 계획

### Phase 1: 핵심 3개 핸들러 (필수)

```
목표 시간: 1시간

[ ] 1. projects:create 트랜잭션
[ ] 2. projects:update-characters 트랜잭션
[ ] 3. projects:update-notes 트랜잭션
```

### Phase 2: 추가 2개 (권장)

```
목표 시간: 30분

[ ] 4. projects:delete 트랜잭션 (검증)
[ ] 5. 테스트 작성
```

---

## ⚠️ 할루시네이션 제거 (Hallucination Removal)

### ❌ 제거할 가정들

1. "Mutex로 모든 동시성이 해결됨"
   - 사실: Mutex는 단일 작업만 보호
   - 멀티스텝은 여전히 위험

2. "IPC 핸들러 단위로 트랜잭션됨"
   - 사실: 핸들러 내 모든 쿼리를 감싸야 함
   - $transaction() 명시 필요

3. "Prisma CASCADE 설정이면 안전"
   - 사실: DB 제약은 있지만 애플리케이션 레벨 실패 시 보호 안 됨
   - 앱에서 롤백 로직 필요

4. "배치 작업은 자동 원자성"
   - 사실: 루프문 + 여러 쿼리는 원자성 보장 안 됨
   - $transaction() 필요

---

## 📈 개선 효과

| 시나리오 | 현재 | 트랜잭션 후 |
|---------|------|-----------|
| 멀티스텝 실패 | ⚠️ 부분 저장 | ✅ 완전 롤백 |
| 배치 실패 | ⚠️ 중간 실패 | ✅ 전체 복구 |
| 데이터 일관성 | ❌ 불완전 | ✅ ACID 보장 |

---

## 📝 구현 순서

1. **projects:create**: 기본 프로젝트 + 캐릭터
2. **projects:update-characters**: 배치 업데이트
3. **projects:update-notes**: 배치 업데이트
4. **테스트**: 트랜잭션 롤백 검증

**진행?** 🚀
