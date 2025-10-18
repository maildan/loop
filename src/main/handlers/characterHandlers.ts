'use strict';

// MIGRATION: MIGRATED FROM projectIpcHandlers.ts:581-754, 1013-1087
// MIGRATION: TODO verify ProjectCharacter type conversion, isActive default value

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse, ProjectCharacter } from '../../shared/types';
import { prismaService } from '../services/PrismaService';
import { globalRateLimiter, channelLimiters } from '../services/RateLimiterService';

/**
 * 🔥 프로젝트 캐릭터 IPC 핸들러
 * 
 * 등록된 채널:
 * - projects:get-characters
 * - projects:upsert-character
 * - projects:delete-character
 * - projects:update-characters
 */
export function registerCharacterHandlers(): void {
  Logger.debug('CHARACTER_IPC', 'Registering character IPC handlers');

  // 프로젝트 캐릭터 조회
  ipcMain.handle('projects:get-characters', async (_event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<ProjectCharacter[]>> => {
    try {
      Logger.debug('CHARACTER_IPC', 'Getting project characters', { projectId });

      const prisma = await prismaService.getClient();
      const characters = await prisma.projectCharacter.findMany({
        where: { projectId },
        orderBy: { sortOrder: 'asc' }
      });

      // Prisma 결과를 ProjectCharacter 타입으로 변환
      const convertedCharacters: ProjectCharacter[] = characters.map((char: {
        id: string;
        name: string;
        description: string | null;
        role: string;
        notes: string | null;
        appearance: string | null;
        personality: string | null;
        background: string | null;
        goals: string | null;
        conflicts: string | null;
        avatar: string | null;
        color: string;
        projectId: string;  
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      }) => ({
        id: char.id,
        projectId: char.projectId,
        name: char.name,
        role: char.role,
        description: char.description || undefined,
        notes: char.notes || undefined,
        appearance: char.appearance || undefined,
        personality: char.personality || undefined,
        background: char.background || undefined,
        goals: char.goals || undefined,
        conflicts: char.conflicts || undefined,
        avatar: char.avatar || undefined,
        color: char.color || undefined,
        sortOrder: char.sortOrder || 0,
        isActive: char.isActive || true,
        createdAt: char.createdAt,
        updatedAt: char.updatedAt,
      }));

      return {
        success: true,
        data: convertedCharacters,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('CHARACTER_IPC', 'Failed to get characters', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 캐릭터 생성/업데이트
  ipcMain.handle('projects:upsert-character', async (_event: IpcMainInvokeEvent, character: Partial<ProjectCharacter>): Promise<IpcResponse<ProjectCharacter>> => {
    try {
      // 🔒 V4 단계 0: 속도 제한 (Rate Limiting) 검증
      const rateLimitKey = 'projects:upsert-character';
      const limitResult = globalRateLimiter.checkLimit(rateLimitKey);
      if (!limitResult.allowed) {
        Logger.warn('CHARACTER_IPC', '⚠️ V4 Rate limit exceeded for upsert-character', {
          retryAfterMs: limitResult.retryAfter,
        });
        return {
          success: false,
          error: `캐릭터 업데이트 요청이 너무 많습니다. ${Math.ceil(limitResult.retryAfter / 1000)}초 후 다시 시도해주세요.`,
          timestamp: new Date(),
        };
      }

      const prisma = await prismaService.getClient();

      const upsertedCharacter = await prisma.projectCharacter.upsert({
        where: { id: character.id || '' },
        update: {
          name: character.name,
          role: character.role,
          description: character.description,
          notes: character.notes,
          appearance: character.appearance,
          personality: character.personality,
          background: character.background,
          goals: character.goals,
          conflicts: character.conflicts,
          avatar: character.avatar,
          color: character.color,
          sortOrder: character.sortOrder,
          isActive: character.isActive,
          updatedAt: new Date(),
        },
        create: {
          id: character.id || '',
          projectId: character.projectId || '',
          name: character.name || '',
          role: character.role || '',
          description: character.description,
          notes: character.notes,
          appearance: character.appearance,
          personality: character.personality,
          background: character.background,
          goals: character.goals,
          conflicts: character.conflicts,
          avatar: character.avatar,
          color: character.color,
          sortOrder: character.sortOrder || 0,
          isActive: character.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Prisma 결과를 ProjectCharacter 타입으로 변환
      const convertedCharacter: ProjectCharacter = {
        id: upsertedCharacter.id,
        projectId: upsertedCharacter.projectId,
        name: upsertedCharacter.name,
        role: upsertedCharacter.role,
        description: upsertedCharacter.description || undefined,
        notes: upsertedCharacter.notes || undefined,
        appearance: upsertedCharacter.appearance || undefined,
        personality: upsertedCharacter.personality || undefined,
        background: upsertedCharacter.background || undefined,
        goals: upsertedCharacter.goals || undefined,
        conflicts: upsertedCharacter.conflicts || undefined,
        avatar: upsertedCharacter.avatar || undefined,
        color: upsertedCharacter.color || undefined,
        sortOrder: upsertedCharacter.sortOrder || 0,
        isActive: upsertedCharacter.isActive || true,
        createdAt: upsertedCharacter.createdAt,
        updatedAt: upsertedCharacter.updatedAt,
      };

      Logger.info('CHARACTER_IPC', '✅ Character upserted successfully', { id: convertedCharacter.id });

      return {
        success: true,
        data: convertedCharacter,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('CHARACTER_IPC', 'Failed to upsert character', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 캐릭터 삭제
  ipcMain.handle('projects:delete-character', async (_event: IpcMainInvokeEvent, characterId: string): Promise<IpcResponse<boolean>> => {
    try {
      const prisma = await prismaService.getClient();

      await prisma.projectCharacter.delete({
        where: { id: characterId }
      });

      Logger.info('CHARACTER_IPC', '✅ Character deleted successfully', { characterId });

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('CHARACTER_IPC', 'Failed to delete character', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 캐릭터 일괄 업데이트 핸들러 추가
  ipcMain.handle('projects:update-characters', async (_event: IpcMainInvokeEvent, projectId: string, characters: ProjectCharacter[]): Promise<IpcResponse<ProjectCharacter[]>> => {
    try {
      Logger.debug('CHARACTER_IPC', 'Updating project characters', { projectId, count: characters.length });

      const prisma = await prismaService.getClient();

      // 🔥 기존 캐릭터들 삭제 후 새로 생성 (간단한 방법)
      await prisma.projectCharacter.deleteMany({
        where: { projectId }
      });

      // 🔥 새 캐릭터들 생성
      const createdCharacters = await Promise.all(
        characters.map(character =>
          prisma.projectCharacter.create({
            data: {
              id: character.id,
              projectId: character.projectId,
              name: character.name || '',
              role: character.role || '',
              description: character.description,
              notes: character.notes || '',
              appearance: character.appearance,
              personality: character.personality,
              background: character.background,
              goals: character.goals,
              conflicts: character.conflicts,
              avatar: character.avatar,
              color: character.color,
              sortOrder: character.sortOrder || 0,
              isActive: character.isActive ?? true,
              createdAt: character.createdAt || new Date(),
              updatedAt: new Date(),
            }
          })
        )
      );

      const convertedCharacters: ProjectCharacter[] = createdCharacters.map(char => ({
        id: char.id,
        projectId: char.projectId,
        name: char.name,
        role: char.role || '',
        description: char.description || undefined,
        notes: char.notes || undefined,
        appearance: char.appearance || undefined,
        personality: char.personality || undefined,
        background: char.background || undefined,
        goals: char.goals || undefined,
        conflicts: char.conflicts || undefined,
        avatar: char.avatar || undefined,
        color: char.color || undefined,
        sortOrder: char.sortOrder || 0,
        isActive: typeof char.isActive === 'boolean' ? char.isActive : true,
        createdAt: char.createdAt,
        updatedAt: char.updatedAt,
      }));

      Logger.info('CHARACTER_IPC', `✅ Characters updated successfully`, { count: convertedCharacters.length });

      return {
        success: true,
        data: convertedCharacters,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('CHARACTER_IPC', 'Failed to update characters', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('CHARACTER_IPC', '✅ Character IPC handlers registered');
}
