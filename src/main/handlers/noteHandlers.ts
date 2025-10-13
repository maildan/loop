'use strict';

// MIGRATION: MIGRATED FROM projectIpcHandlers.ts:920-1011, 1089-1157
// MIGRATION: TODO verify tags array handling, isPinned/isArchived defaults

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse, ProjectNote } from '../../shared/types';
import { prismaService } from '../services/PrismaService';

/**
 * 🔥 프로젝트 노트 IPC 핸들러
 * 
 * 등록된 채널:
 * - projects:get-notes
 * - projects:upsert-note
 * - projects:update-notes
 */
export function registerNoteHandlers(): void {
  Logger.debug('NOTE_IPC', 'Registering note IPC handlers');

  // 프로젝트 메모 조회
  ipcMain.handle('projects:get-notes', async (_event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<any[]>> => {
    try {
      Logger.debug('NOTE_IPC', 'Getting project notes', { projectId });

      const prisma = await prismaService.getClient();
      const notes = await prisma.projectNote.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: notes,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('NOTE_IPC', 'Failed to get notes', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 메모 생성/업데이트
  ipcMain.handle('projects:upsert-note', async (_event: IpcMainInvokeEvent, note: Partial<ProjectNote>): Promise<IpcResponse<ProjectNote>> => {
    try {
      const prisma = await prismaService.getClient();

      const upsertedNote = await prisma.projectNote.upsert({
        where: { id: note.id || '' },
        update: {
          title: note.title,
          content: note.content,
          type: note.type,
          tags: note.tags || [],
          color: note.color,
          isPinned: note.isPinned,
          isArchived: note.isArchived,
          sortOrder: note.sortOrder,
          updatedAt: new Date(),
        },
        create: {
          id: note.id || '',
          projectId: note.projectId || '',
          title: note.title || '',
          content: note.content || '',
          type: note.type,
          tags: note.tags || [],
          color: note.color,
          isPinned: note.isPinned || false,
          isArchived: note.isArchived || false,
          sortOrder: note.sortOrder || 0,
          createdAt: note.createdAt || new Date(),
          updatedAt: new Date(),
        },
      });

      // ProjectNote 타입으로 변환
      const convertedNote: ProjectNote = {
        id: upsertedNote.id,
        projectId: upsertedNote.projectId,
        title: upsertedNote.title,
        content: upsertedNote.content,
        type: upsertedNote.type || undefined,
        tags: Array.isArray(upsertedNote.tags) ? upsertedNote.tags as string[] : undefined,
        color: upsertedNote.color || undefined,
        isPinned: upsertedNote.isPinned || false,
        isArchived: upsertedNote.isArchived || false,
        sortOrder: upsertedNote.sortOrder || 0,
        createdAt: upsertedNote.createdAt,
        updatedAt: upsertedNote.updatedAt,
      };

      Logger.info('NOTE_IPC', '✅ Note upserted successfully', { id: convertedNote.id });

      return {
        success: true,
        data: convertedNote,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('NOTE_IPC', 'Failed to upsert note', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 노트 일괄 업데이트 핸들러 추가
  ipcMain.handle('projects:update-notes', async (_event: IpcMainInvokeEvent, projectId: string, notes: ProjectNote[]): Promise<IpcResponse<ProjectNote[]>> => {
    try {
      Logger.debug('NOTE_IPC', 'Updating project notes', { projectId, count: notes.length });

      const prisma = await prismaService.getClient();

      // 🔥 기존 노트들 삭제 후 새로 생성 (간단한 방법)
      await prisma.projectNote.deleteMany({
        where: { projectId }
      });

      // 🔥 새 노트들 생성
      const createdNotes = await Promise.all(
        notes.map(note =>
          prisma.projectNote.create({
            data: {
              id: note.id,
              projectId: note.projectId,
              title: note.title || '',
              content: note.content || '',
              type: note.type,
              tags: Array.isArray(note.tags) ? note.tags : note.tags || [],
              color: note.color,
              isPinned: note.isPinned ?? false,
              isArchived: note.isArchived ?? false,
              sortOrder: note.sortOrder || 0,
              createdAt: note.createdAt || new Date(),
              updatedAt: new Date(),
            }
          })
        )
      );

      const convertedNotes: ProjectNote[] = createdNotes.map(note => ({
        id: note.id,
        projectId: note.projectId,
        title: note.title,
        content: note.content || '',
        type: note.type || undefined,
        tags: Array.isArray(note.tags)
          ? (note.tags as string[])
          : (typeof note.tags === 'string' ? note.tags.split(',').map((t: string) => t.trim()) : undefined),
        color: note.color || undefined,
        isPinned: typeof note.isPinned === 'boolean' ? note.isPinned : false,
        isArchived: typeof note.isArchived === 'boolean' ? note.isArchived : false,
        sortOrder: note.sortOrder || 0,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }));

      Logger.info('NOTE_IPC', `✅ Notes updated successfully`, { count: convertedNotes.length });

      return {
        success: true,
        data: convertedNotes,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('NOTE_IPC', 'Failed to update notes', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('NOTE_IPC', '✅ Note IPC handlers registered');
}
