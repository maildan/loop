/**
 * projectValidation.spec.ts
 * V3 보안 수정 - 프로젝트 입력 검증 테스트 (30 테스트 케이스)
 */

import {
  ProjectCreateSchema,
  ProjectUpdateSchema,
  detectSuspiciousInput,
  isValidGenre,
  isValidStatus,
} from '../../src/shared/validation/projectValidation';

describe('V3: Project Input Validation', () => {
  
  // ========== 그룹 1: 기본 유효성 검증 (6 cases) ==========
  describe('Basic Validation', () => {
    it('✅ Should accept valid project', async () => {
      const result = await ProjectCreateSchema.parseAsync({
        title: '새로운 프로젝트',
        genre: '판타지',
        status: 'active',
      });
      expect(result.title).toBe('새로운 프로젝트');
      expect(result.genre).toBe('판타지');
    });

    it('✅ Should apply default values', async () => {
      const result = await ProjectCreateSchema.parseAsync({ title: '제목' });
      expect(result.genre).toBe('기타');
      expect(result.status).toBe('active');
    });

    it('❌ Should reject empty title', async () => {
      await expect(ProjectCreateSchema.parseAsync({ title: '' })).rejects.toThrow();
    });

    it('❌ Should reject title exceeding 100 chars', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({ title: 'x'.repeat(101) })
      ).rejects.toThrow();
    });

    it('✅ Should accept 1-100 character titles', async () => {
      const result1 = await ProjectCreateSchema.parseAsync({ title: '가' });
      expect(result1.title).toBe('가');
      
      const result100 = await ProjectCreateSchema.parseAsync({ title: 'x'.repeat(100) });
      expect(result100.title.length).toBe(100);
    });

    it('❌ Should reject content exceeding 1MB', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({ title: 'a', content: 'x'.repeat(1_000_001) })
      ).rejects.toThrow();
    });
  });

  // ========== 그룹 2: 장르 & 상태 검증 (6 cases) ==========
  describe('Genre & Status Validation', () => {
    it('✅ isValidGenre accepts valid genres', () => {
      expect(isValidGenre('미스터리')).toBe(true);
      expect(isValidGenre('판타지')).toBe(true);
      expect(isValidGenre('기타')).toBe(true);
    });

    it('❌ isValidGenre rejects invalid genres', () => {
      expect(isValidGenre('invalid')).toBe(false);
      expect(isValidGenre('sql"; DROP--')).toBe(false);
    });

    it('✅ isValidStatus accepts valid statuses', () => {
      expect(isValidStatus('active')).toBe(true);
      expect(isValidStatus('completed')).toBe(true);
      expect(isValidStatus('paused')).toBe(true);
    });

    it('❌ isValidStatus rejects invalid statuses', () => {
      expect(isValidStatus('deleted')).toBe(false);
      expect(isValidStatus('<img src=x>')).toBe(false);
    });

    it('❌ Should reject invalid genre in create', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({ title: 'a', genre: 'invalid' })
      ).rejects.toThrow();
    });

    it('❌ Should reject invalid status in create', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({ title: 'a', status: 'deleted' })
      ).rejects.toThrow();
    });
  });

  // ========== 그룹 3: 공격 벡터 (8 cases) ==========
  describe('Attack Vector Detection', () => {
    it('✅ Should detect SQL injection patterns', () => {
      expect(detectSuspiciousInput('"; DROP TABLE users;--')).toBe(true);
      expect(detectSuspiciousInput("'; DELETE FROM--")).toBe(true);
    });

    it('✅ Should detect XSS patterns', () => {
      expect(detectSuspiciousInput('<script>alert("XSS")</script>')).toBe(true);
      expect(detectSuspiciousInput('<img src=x onerror=alert()>')).toBe(true);
    });

    it('✅ Should detect command injection', () => {
      expect(detectSuspiciousInput('test; rm -rf /')).toBe(true);
      expect(detectSuspiciousInput('|| cat /etc/passwd')).toBe(true);
    });

    it('✅ Should detect LDAP injection', () => {
      expect(detectSuspiciousInput('*)(cn=*')).toBe(true);
    });

    it('✅ Should allow normal text', () => {
      expect(detectSuspiciousInput('This is a normal project')).toBe(false);
      expect(detectSuspiciousInput('새로운 프로젝트입니다')).toBe(false);
    });

    it('❌ Should reject SQL injection in genre', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({ title: 'a', genre: 'sql"; DROP--' })
      ).rejects.toThrow();
    });

    it('❌ Should reject XSS in status', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({ title: 'a', status: '<script>' })
      ).rejects.toThrow();
    });

    it('❌ Should reject extremely large content (DoS)', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({ title: 'a', content: 'x'.repeat(10_000_000) })
      ).rejects.toThrow();
    });
  });

  // ========== 그룹 4: Update 스키마 (7 cases) ==========
  describe('ProjectUpdateSchema Validation', () => {
    it('✅ Should accept valid updates', async () => {
      const result = await ProjectUpdateSchema.parseAsync({
        title: '업데이트',
        status: 'completed',
      });
      expect(result.title).toBe('업데이트');
      expect(result.status).toBe('completed');
    });

    it('✅ Should allow empty updates', async () => {
      const result = await ProjectUpdateSchema.parseAsync({});
      expect(result).toEqual({});
    });

    it('❌ Should reject unknown fields (strict mode)', async () => {
      await expect(
        ProjectUpdateSchema.parseAsync({ malicious_field: 'attack' })
      ).rejects.toThrow();
    });

    it('❌ Should reject proto pollution attempt', async () => {
      await expect(
        ProjectUpdateSchema.parseAsync({ __proto__: { admin: true } })
      ).rejects.toThrow();
    });

    it('❌ Should reject exceeding content in update', async () => {
      await expect(
        ProjectUpdateSchema.parseAsync({ content: 'x'.repeat(1_000_001) })
      ).rejects.toThrow();
    });

    it('✅ Should accept partial updates with progress', async () => {
      const result = await ProjectUpdateSchema.parseAsync({
        progress: 50,
        content: '업데이트된 내용',
      });
      expect(result.progress).toBe(50);
    });

    it('❌ Should reject progress over 100', async () => {
      await expect(
        ProjectUpdateSchema.parseAsync({ progress: 101 })
      ).rejects.toThrow();
    });
  });

  // ========== 그룹 3: 종합 테스트 (3 cases) ==========
  describe('Integration Scenarios', () => {
    it('✅ Real-world project creation', async () => {
      const project = {
        title: '나의 판타지 소설',
        description: '마법과 모험이 있는 이야기',
        content: '옛날 옛날 먼 곳에...',
        genre: '판타지',
        status: 'active',
        author: '홍길동',
      };
      const result = await ProjectCreateSchema.parseAsync(project);
      expect(result.title).toBe('나의 판타지 소설');
      expect(result.genre).toBe('판타지');
    });

    it('✅ Real-world project update', async () => {
      const updates = {
        content: '새로운 장을 추가했습니다...',
        progress: 75,
        status: 'completed',
      };
      const result = await ProjectUpdateSchema.parseAsync(updates);
      expect(result.progress).toBe(75);
      expect(result.status).toBe('completed');
    });

    it('❌ Should prevent 1MB+ size attack', async () => {
      await expect(
        ProjectCreateSchema.parseAsync({
          title: 'test',
          content: 'A'.repeat(1_000_001),
        })
      ).rejects.toThrow();
    });
  });
});
