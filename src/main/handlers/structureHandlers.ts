'use strict';

// MIGRATION: MIGRATED FROM projectIpcHandlers.ts:756-918
// MIGRATION: TODO verify depth/color/isActive default values, type conversion

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse, ProjectStructure } from '../../shared/types';
import { prismaService } from '../services/PrismaService';

/**
 * 🔥 프로젝트 구조 IPC 핸들러
 * 
 * 등록된 채널:
 * - projects:get-structure
 * - projects:upsert-structure
 * - projects:delete-structure
 */
export function registerStructureHandlers(): void {
  Logger.debug('STRUCTURE_IPC', 'Registering structure IPC handlers');

  // 프로젝트 구조 조회
  ipcMain.handle('projects:get-structure', async (_event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<ProjectStructure[]>> => {
    try {
      Logger.debug('STRUCTURE_IPC', 'Getting project structure', { projectId });

      const prisma = await prismaService.getClient();
      const structure = await prisma.projectStructure.findMany({
        where: { projectId },
        orderBy: { sortOrder: 'asc' }
      });

      // Prisma 결과를 ProjectStructure 타입으로 변환
      const convertedStructure: ProjectStructure[] = structure.map((item: {
        id: string;
        projectId: string;
        type: string;
        title: string;
        description: string | null;
        content: string | null;
        status: string;
        wordCount: number;
        sortOrder: number;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
      }) => ({
        id: item.id,
        projectId: item.projectId,
        type: item.type as 'chapter' | 'synopsis' | 'idea' | 'act' | 'section',
        title: item.title,
        description: item.description || undefined,
        content: item.content || undefined,
        status: item.status || undefined,
        wordCount: item.wordCount || 0,
        sortOrder: item.sortOrder || 0,
        parentId: item.parentId || undefined,
        depth: 0, // 기본값으로 설정 (스키마에 없는 필드)
        color: undefined, // 기본값으로 설정 (스키마에 없는 필드)
        isActive: true, // 기본값으로 설정 (스키마에 없는 필드)
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      return {
        success: true,
        data: convertedStructure,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('STRUCTURE_IPC', 'Failed to get structure', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 구조 생성/업데이트
  ipcMain.handle('projects:upsert-structure', async (_event: IpcMainInvokeEvent, structure: Partial<ProjectStructure>): Promise<IpcResponse<ProjectStructure>> => {
    try {
      const prisma = await prismaService.getClient();

      const upsertedStructure = await prisma.projectStructure.upsert({
        where: { id: structure.id || '' },
        update: {
          title: structure.title,
          type: structure.type,
          description: structure.description,
          content: structure.content,
          status: structure.status,
          wordCount: structure.wordCount,
          sortOrder: structure.sortOrder,
          parentId: structure.parentId,
          depth: structure.depth,
          color: structure.color,
          isActive: structure.isActive,
          updatedAt: new Date(),
        },
        create: {
          id: structure.id || '',
          projectId: structure.projectId || '',
          title: structure.title || '',
          type: structure.type || 'scene',
          description: structure.description,
          content: structure.content,
          status: structure.status,
          wordCount: structure.wordCount || 0,
          sortOrder: structure.sortOrder || 0,
          parentId: structure.parentId,
          depth: structure.depth || 0,
          color: structure.color,
          isActive: structure.isActive !== undefined ? structure.isActive : true,
          createdAt: structure.createdAt || new Date(),
          updatedAt: new Date(),
        },
      });

      // ProjectStructure 타입으로 변환
      const convertedStructure: ProjectStructure = {
        id: upsertedStructure.id,
        projectId: upsertedStructure.projectId,
        type: upsertedStructure.type as 'chapter' | 'synopsis' | 'idea' | 'act' | 'section',
        title: upsertedStructure.title,
        description: upsertedStructure.description || undefined,
        content: upsertedStructure.content || undefined,
        status: upsertedStructure.status || undefined,
        wordCount: upsertedStructure.wordCount || 0,
        sortOrder: upsertedStructure.sortOrder || 0,
        parentId: upsertedStructure.parentId || undefined,
        depth: upsertedStructure.depth || 0,
        color: upsertedStructure.color || undefined,
        isActive: upsertedStructure.isActive || true,
        createdAt: upsertedStructure.createdAt,
        updatedAt: upsertedStructure.updatedAt,
      };

      Logger.info('STRUCTURE_IPC', '✅ Structure upserted successfully', { id: convertedStructure.id });

      return {
        success: true,
        data: convertedStructure,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('STRUCTURE_IPC', 'Failed to upsert structure', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 구조 아이템 삭제 핸들러
  ipcMain.handle('projects:delete-structure', async (_event: IpcMainInvokeEvent, structureId: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('STRUCTURE_IPC', 'Deleting structure item', { structureId });

      const prisma = await prismaService.getClient();

      await prisma.projectStructure.delete({
        where: { id: structureId }
      });

      Logger.info('STRUCTURE_IPC', '✅ Structure item deleted successfully', { structureId });

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('STRUCTURE_IPC', 'Failed to delete structure item', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('STRUCTURE_IPC', '✅ Structure IPC handlers registered');
}
