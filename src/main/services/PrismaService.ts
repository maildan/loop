'use strict';

// 🔥 Prisma 싱글톤 서비스 - 연결 풀링으로 성능 개선
import { PrismaClient } from '@prisma/client';
import { Logger } from '../../shared/logger';
import { Project, ProjectCharacter, ProjectStructure, ProjectNote } from '../../shared/types';

/**
 * 🔥 Prisma 싱글톤 서비스
 * 매번 새로운 연결을 생성하지 않고 하나의 인스턴스를 재사용하여 성능 개선
 */
class PrismaService {
  private static instance: PrismaService;
  private client: PrismaClient | null = null;
  private isConnecting = false;

  private constructor() {
    // private 생성자로 싱글톤 보장
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  /**
   * 🔥 Prisma 클라이언트 가져오기 (지연 초기화)
   */
  public async getClient(): Promise<PrismaClient> {
    if (this.client) {
      return this.client;
    }

    if (this.isConnecting) {
      // 연결 중인 경우 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getClient();
    }

    try {
      this.isConnecting = true;
      Logger.debug('PRISMA_SERVICE', 'Creating new Prisma client');

      // 🔥 절대 경로로 데이터베이스 URL 설정
      const path = await import('path');
      const { app } = await import('electron');
      const fs = await import('fs');

      let dbPath: string;
      const isProduction = process.env.NODE_ENV === 'production';

      if (app.isPackaged) {
        // 패키징된 앱에서는 app.getPath('userData') 사용
        dbPath = path.join(app.getPath('userData'), 'loop.db');
      } else {
        // 모든 환경에서 loop.db 통일 사용 (dev.db 제거)
        const loopCandidates = [
          path.join(__dirname, '../../../prisma/loop.db'),
          path.resolve(process.cwd(), 'prisma/loop.db'),
          path.resolve(__dirname, '../../prisma/loop.db'),
        ];
        const loopPath = loopCandidates.find(p => fs.existsSync(p));
        dbPath = loopPath || path.resolve(process.cwd(), 'prisma/loop.db');
        Logger.info('PRISMA_SERVICE', `🎯 모든 환경 loop.db 통합 사용 → ${dbPath}`);
      }

      Logger.info('PRISMA_SERVICE', `🔍 DB 경로 설정: ${dbPath}`);
      Logger.info('PRISMA_SERVICE', `🔍 DB 파일 존재: ${fs.existsSync(dbPath)}`);
      Logger.info('PRISMA_SERVICE', `🔍 현재 작업 디렉토리: ${process.cwd()}`);
      Logger.info('PRISMA_SERVICE', `🔍 __dirname: ${__dirname}`);

      this.client = new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
          db: {
            url: `file:${dbPath}`
          }
        }
      });

      // 연결 테스트
      await this.client.$connect();
      Logger.info('PRISMA_SERVICE', '✅ Prisma client connected successfully');

      return this.client;
    } catch (error) {
      Logger.error('PRISMA_SERVICE', '❌ Failed to connect Prisma client', error);
      this.client = null;
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * 🔥 안전한 클라이언트 연결 해제
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.$disconnect();
        Logger.info('PRISMA_SERVICE', 'Prisma client disconnected');
      } catch (error) {
        Logger.error('PRISMA_SERVICE', 'Error disconnecting Prisma client', error);
      } finally {
        this.client = null;
      }
    }
  }

  /**
   * 🔥 헬스체크 - DB 연결 상태 확인
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const client = await this.getClient();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      Logger.error('PRISMA_SERVICE', 'Health check failed', error);
      return false;
    }
  }

  /**
   * 🔥 트랜잭션 실행
   */
  public async transaction<T>(
    fn: (client: PrismaClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    return client.$transaction(async (prisma) => {
      return fn(prisma as PrismaClient);
    });
  }

  /**
   * 🔥 배치 저장 - 성능 최적화를 위한 여러 작업 일괄 처리
   */
  public async batchWrite<T>(
    operations: Array<() => Promise<T>>
  ): Promise<T[]> {
    const client = await this.getClient();

    return await client.$transaction(async (tx) => {
      const results: T[] = [];
      for (const operation of operations) {
        // 각 operation은 tx를 사용하도록 수정 필요
        const result = await operation();
        results.push(result);
      }
      return results;
    });
  }

  /**
   * 🔥 프로젝트 저장 최적화 - 단일 트랜잭션으로 관련 데이터 모두 저장
   */
  public async saveProjectWithRelations(
    projectData: {
      project: Project;
      characters?: ProjectCharacter[];
      structure?: ProjectStructure[];
      notes?: ProjectNote[];
    }
  ): Promise<void> {
    const client = await this.getClient();

    await client.$transaction(async (tx) => {
      Logger.debug('PRISMA_SERVICE', 'Starting project save transaction', {
        projectId: projectData.project.id,
        charactersCount: projectData.characters?.length || 0,
        structureCount: projectData.structure?.length || 0,
        notesCount: projectData.notes?.length || 0,
      });

      // 프로젝트 기본 정보 저장/업데이트
      const project = await tx.project.upsert({
        where: { id: projectData.project.id },
        update: {
          title: projectData.project.title,
          content: projectData.project.content,
          wordCount: projectData.project.wordCount || 0,
          progress: projectData.project.progress || 0,
          lastModified: new Date(),
        },
        create: projectData.project,
      });

      // 캐릭터 정보 저장 (있는 경우)
      if (projectData.characters && projectData.characters.length > 0) {
        for (const character of projectData.characters) {
          await tx.projectCharacter.upsert({
            where: { id: character.id },
            update: character,
            create: { ...character, projectId: project.id },
          });
        }
      }

      // 구조 정보 저장 (있는 경우)
      if (projectData.structure && projectData.structure.length > 0) {
        for (const structureItem of projectData.structure) {
          await tx.projectStructure.upsert({
            where: { id: structureItem.id },
            update: structureItem,
            create: { ...structureItem, projectId: project.id },
          });
        }
      }

      // 메모 정보 저장 (있는 경우)
      if (projectData.notes && projectData.notes.length > 0) {
        for (const note of projectData.notes) {
          await tx.projectNote.upsert({
            where: { id: note.id },
            update: note,
            create: { ...note, projectId: project.id },
          });
        }
      }
    });

    Logger.info('PRISMA_SERVICE', '✅ Project saved with all relations successfully');
  }

  /**
   * 🔥 실시간 저장을 위한 debounced 저장 시스템
   */
  private saveQueue = new Map<string, NodeJS.Timeout>();

  public async debouncedSave(
    projectId: string,
    saveFunction: () => Promise<void>,
    delay = 1000 // 1초 딜레이
  ): Promise<void> {
    // 기존 타이머가 있으면 취소
    const existingTimer = this.saveQueue.get(projectId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // 새 타이머 설정
    const timer = setTimeout(async () => {
      try {
        await saveFunction();
        this.saveQueue.delete(projectId);
        Logger.debug('PRISMA_SERVICE', 'Debounced save completed', { projectId });
      } catch (error) {
        Logger.error('PRISMA_SERVICE', 'Debounced save failed', error);
        this.saveQueue.delete(projectId);
      }
    }, delay);

    this.saveQueue.set(projectId, timer);
  }

  /**
   * 🔥 즉시 저장 (debounce 무시)
   */
  public async forceSave(projectId: string, saveFunction: () => Promise<void>): Promise<void> {
    // 기존 debounced 저장 취소
    const existingTimer = this.saveQueue.get(projectId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.saveQueue.delete(projectId);
    }

    // 즉시 저장 실행
    try {
      await saveFunction();
      Logger.info('PRISMA_SERVICE', 'Force save completed', { projectId });
    } catch (error) {
      Logger.error('PRISMA_SERVICE', 'Force save failed', error);
      throw error;
    }
  }
}

// 🔥 싱글톤 인스턴스 내보내기
export const prismaService = PrismaService.getInstance();
export default prismaService;
