'use strict';

// MIGRATION: MIGRATED FROM projectIpcHandlers.ts:756-918
// MIGRATION: TODO verify depth/color/isActive default values, type conversion

import { randomUUID } from 'crypto';
import type { Prisma, PrismaClient, ProjectStructure as PrismaStructureModel } from '@prisma/client';
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse, ProjectStructure } from '../../shared/types';
import type { StructureStatus } from '../../shared/constants/enums';
import { calculateWordCount } from '../../shared/utils/text';
import { prismaService } from '../services/PrismaService';
import { databaseMutex } from '../services/DatabaseMutexService';  // 🔒 동시성 제어
import { recordDailyWritingActivity } from '../utils/writingActivity';

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
        status: StructureStatus;
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
      const upsertedStructure = await upsertStructureWithMetrics(prisma, structure);

      Logger.info('STRUCTURE_IPC', '✅ Structure upserted successfully', { id: upsertedStructure.id });

      return {
        success: true,
        data: upsertedStructure,
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

      const result = await databaseMutex.acquireWriteLock(async () => {
        const prisma = await prismaService.getClient();

        await prisma.projectStructure.delete({
          where: { id: structureId }
        });

        return true;
      });

      Logger.info('STRUCTURE_IPC', '✅ Structure item deleted successfully', { structureId });

      return {
        success: true,
        data: result,
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

async function upsertStructureWithMetrics(
  prisma: PrismaClient,
  structure: Partial<ProjectStructure>
): Promise<ProjectStructure> {
  const model = await prisma.$transaction(async (tx) => {
    const now = new Date();
    const structureId = structure.id ?? randomUUID();
    const existing = await tx.projectStructure.findUnique({ where: { id: structureId } });
    const projectId = structure.projectId ?? existing?.projectId;

    if (!projectId) {
      throw new Error('projectId is required to upsert structure');
    }

    const content = structure.content ?? existing?.content ?? '';
    const wordCount = calculateWordCount(content);
    const previousWordCount = existing?.wordCount ?? 0;
    const delta = wordCount - previousWordCount;

    const upserted = await tx.projectStructure.upsert({
      where: { id: structureId },
      update: buildUpdatePayload(structure, now, content, wordCount),
      create: buildCreatePayload(structure, projectId, structureId, now, content, wordCount, existing),
    });

    if (delta !== 0) {
      await tx.project.update({
        where: { id: projectId },
        data: { wordCount: { increment: delta } },
      });
    }

    if (delta > 0) {
      await recordDailyWritingActivity(tx, projectId, delta);
    }

    return upserted;
  });

  return mapToProjectStructure(model);
}

function buildUpdatePayload(
  structure: Partial<ProjectStructure>,
  now: Date,
  content: string,
  wordCount: number
): Prisma.ProjectStructureUncheckedUpdateInput {
  return {
    title: structure.title,
    type: structure.type,
    description: normalizeNullable(structure.description),
    content,
    status: structure.status,
    wordCount,
    sortOrder: structure.sortOrder,
    parentId: normalizeNullable(structure.parentId),
    depth: structure.depth,
    color: structure.color,
    isActive: structure.isActive,
    updatedAt: now,
  };
}

function buildCreatePayload(
  structure: Partial<ProjectStructure>,
  projectId: string,
  structureId: string,
  now: Date,
  content: string,
  wordCount: number,
  existing: PrismaStructureModel | null
): Prisma.ProjectStructureUncheckedCreateInput {
  return {
    id: structureId,
    projectId,
    title: structure.title ?? existing?.title ?? '',
    type: structure.type ?? existing?.type ?? 'scene',
    description: normalizeNullable(structure.description ?? existing?.description ?? undefined),
    content,
    status: structure.status ?? existing?.status ?? 'planned',
    wordCount,
    sortOrder: structure.sortOrder ?? existing?.sortOrder ?? 0,
    parentId: normalizeNullable(structure.parentId ?? existing?.parentId ?? undefined),
    depth: structure.depth ?? existing?.depth ?? 0,
    color: structure.color ?? existing?.color ?? '#6b7280',
    isActive: structure.isActive ?? existing?.isActive ?? true,
    createdAt: structure.createdAt ?? existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function mapToProjectStructure(model: PrismaStructureModel): ProjectStructure {
  return {
    id: model.id,
    projectId: model.projectId,
    type: model.type as ProjectStructure['type'],
    title: model.title,
    description: toOptionalString(model.description),
    content: toOptionalString(model.content),
    status: (model.status as StructureStatus) || 'draft',
    wordCount: model.wordCount ?? 0,
    sortOrder: model.sortOrder ?? 0,
    parentId: toOptionalString(model.parentId),
    depth: model.depth ?? 0,
    color: model.color ?? '#6b7280',
    isActive: model.isActive ?? true,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  };
}

function normalizeNullable<T>(value: T | null | undefined): T | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value ?? null;
}

function toOptionalString(value: string | null | undefined): string | undefined {
  return value === null ? undefined : value ?? undefined;
}
