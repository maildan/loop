'use strict';

// 🔥 Prisma 싱글톤 서비스 - 연결 풀링으로 성능 개선
import { Logger } from '../../shared/logger';
import { Project, ProjectCharacter, ProjectStructure, ProjectNote } from '../../shared/types';
import { ensureDatabaseUrl } from '../utils/prismaPaths';

// PrismaClient 타입 정의 (런타임에 동적 로드)
type PrismaClient = any;

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

      const { dbPath, databaseUrl } = ensureDatabaseUrl();
      Logger.info('PRISMA_SERVICE', '🔍 Prisma database resolved', {
        dbPath,
        databaseUrl,
        cwd: process.cwd(),
        dirname: __dirname,
      });

      // Prisma 클라이언트 동적 로딩 (databaseService와 동일한 패턴)
      const { app } = require('electron');
      let PrismaClientConstructor;
      
      if (app.isPackaged) {
        // 패키지 앱: extraResources/prisma/client/index.js를 직접 require (default.js의 exports condition 우회)
        const path = require('path');
        const prismaClientDir = path.join(process.resourcesPath, 'prisma', 'client');
        
        // default.js 대신 index.js 직접 로드
        const indexPath = path.join(prismaClientDir, 'index.js');
        Logger.info('PRISMA_SERVICE', 'Loading Prisma client from extraResources', { indexPath });
        
        // index.js 직접 require
        const prismaModule = require(indexPath);
        PrismaClientConstructor = prismaModule.PrismaClient;
      } else {
        // 개발 환경: 일반 node_modules에서 로드
        Logger.info('PRISMA_SERVICE', 'Loading Prisma client from node_modules');
        const { PrismaClient: PC } = await import('@prisma/client');
        PrismaClientConstructor = PC;
      }

      if (!PrismaClientConstructor) {
        throw new Error('PrismaClient not found in module');
      }

      this.client = new PrismaClientConstructor({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
        log: ['error', 'warn'],
      });

      // Prisma v6에서는 lazy connection - 첫 쿼리에서 자동 연결
      Logger.info('PRISMA_SERVICE', '✅ Prisma client created successfully');

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
   * 🔥 트랜잭션 실행 - Prisma v6 호환
   */
  public async transaction<T>(
    fn: (client: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    return client.$transaction(async (prisma: any) => {
      return fn(prisma);
    });
  }

  /**
   * 🔥 배치 저장 - 성능 최적화를 위한 여러 작업 일괄 처리
   */
  public async batchWrite<T>(
    operations: Array<(tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>>
  ): Promise<T[]> {
    const client = await this.getClient();

    return await client.$transaction(async (tx: any) => {
      const results: T[] = [];
      for (const operation of operations) {
        const result = await operation(tx);
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

    await client.$transaction(async (tx: any) => {
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
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('Valid projectId is required');
    }

    if (!saveFunction || typeof saveFunction !== 'function') {
      throw new Error('Valid saveFunction is required');
    }

    if (delay < 0 || !Number.isInteger(delay)) {
      throw new Error('Delay must be a non-negative integer');
    }

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
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('Valid projectId is required');
    }

    if (!saveFunction || typeof saveFunction !== 'function') {
      throw new Error('Valid saveFunction is required');
    }

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
