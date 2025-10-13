'use strict';

// MIGRATION: MIGRATED FROM projectIpcHandlers.ts:1159-1288
// MIGRATION: TODO verify IdeaService integration, error propagation

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';
import type { IdeaItem } from '../types/project';
import { IdeaService } from '../services/ideaService';

/**
 * 🔥 프로젝트 아이디어 IPC 핸들러
 * 
 * 등록된 채널:
 * - projects:get-ideas
 * - projects:create-idea
 * - projects:update-idea
 * - projects:delete-idea
 */
export function registerIdeaHandlers(): void {
  Logger.debug('IDEA_IPC', 'Registering idea IPC handlers');

  // 프로젝트 아이디어 조회
  ipcMain.handle('projects:get-ideas', async (event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<any[]>> => {
    try {
      Logger.debug('IDEA_IPC', 'Getting project ideas', { projectId });
      
      const result = await IdeaService.getIdeasByProject(projectId);
      
      if (result.success) {
        Logger.info('IDEA_IPC', `✅ Ideas retrieved successfully`, { count: result.data.length });
        return {
          success: true,
          data: result.data,
          timestamp: new Date(),
        };
      } else {
        Logger.error('IDEA_IPC', 'Failed to get ideas', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('IDEA_IPC', 'Failed to get ideas', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 아이디어 생성
  ipcMain.handle('projects:create-idea', async (event: IpcMainInvokeEvent, projectId: string, ideaData: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<IpcResponse<IdeaItem>> => {
    try {
      Logger.debug('IDEA_IPC', 'Creating new idea', { projectId, title: ideaData.title });
      
      const result = await IdeaService.createIdea(projectId, ideaData);
      
      if (result.success) {
        Logger.info('IDEA_IPC', `✅ Idea created successfully`, { id: result.data.id });
        return {
          success: true,
          data: result.data,
          timestamp: new Date(),
        };
      } else {
        Logger.error('IDEA_IPC', 'Failed to create idea', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('IDEA_IPC', 'Failed to create idea', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 아이디어 업데이트
  ipcMain.handle('projects:update-idea', async (event: IpcMainInvokeEvent, ideaId: string, updates: Partial<Omit<IdeaItem, 'id' | 'createdAt'>>): Promise<IpcResponse<IdeaItem>> => {
    try {
      Logger.debug('IDEA_IPC', 'Updating idea', { ideaId });
      
      const result = await IdeaService.updateIdea(ideaId, updates);
      
      if (result.success) {
        Logger.info('IDEA_IPC', `✅ Idea updated successfully`, { id: result.data.id });
        return {
          success: true,
          data: result.data,
          timestamp: new Date(),
        };
      } else {
        Logger.error('IDEA_IPC', 'Failed to update idea', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('IDEA_IPC', 'Failed to update idea', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 아이디어 삭제
  ipcMain.handle('projects:delete-idea', async (event: IpcMainInvokeEvent, ideaId: string): Promise<IpcResponse<void>> => {
    try {
      Logger.debug('IDEA_IPC', 'Deleting idea', { ideaId });
      
      const result = await IdeaService.deleteIdea(ideaId);
      
      if (result.success) {
        Logger.info('IDEA_IPC', `✅ Idea deleted successfully`, { ideaId });
        return {
          success: true,
          data: undefined,
          timestamp: new Date(),
        };
      } else {
        Logger.error('IDEA_IPC', 'Failed to delete idea', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('IDEA_IPC', 'Failed to delete idea', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('IDEA_IPC', '✅ Idea IPC handlers registered');
}
