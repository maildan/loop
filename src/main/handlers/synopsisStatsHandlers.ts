/**
 * Synopsis Statistics IPC Handlers
 * @module main/handlers/synopsisStatsHandlers
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { SynopsisStatsService } from '../services/SynopsisStatsService';
import type {
  CreatePublicationDTO,
  QuickLogDTO,
  PublisherRelation,
  CreateExperimentDTO
} from '../../shared/types/synopsis-stats';

const service = SynopsisStatsService.getInstance();

export function registerSynopsisStatsHandlers(): void {
  // ===========================
  // Publications
  // ===========================

  ipcMain.handle('synopsis-stats:get-publications', async (_event: IpcMainInvokeEvent, projectId: string) => {
    try {
      return await service.getPublications(projectId);
    } catch (error) {
      console.error('Error getting publications:', error);
      throw error;
    }
  });

  ipcMain.handle('synopsis-stats:create-publication', async (_event: any, data: CreatePublicationDTO) => {
    try {
      return await service.createPublication(data);
    } catch (error) {
      console.error('Error creating publication:', error);
      throw error;
    }
  });

  ipcMain.handle('synopsis-stats:delete-publication', async (_event: any, id: string) => {
    try {
      await service.deletePublication(id);
    } catch (error) {
      console.error('Error deleting publication:', error);
      throw error;
    }
  });

  // ===========================
  // Platform Metrics (Quick Log)
  // ===========================

  ipcMain.handle('synopsis-stats:create-metric', async (_event: any, data: QuickLogDTO) => {
    try {
      return await service.createMetric(data);
    } catch (error) {
      console.error('Error creating metric:', error);
      throw error;
    }
  });

  ipcMain.handle(
    'synopsis-stats:get-metrics',
    async (_event: any, publicationId: string, dateRange?: { start: Date; end: Date }) => {
      try {
        return await service.getMetrics(publicationId, dateRange);
      } catch (error) {
        console.error('Error getting metrics:', error);
        throw error;
      }
    }
  );

  ipcMain.handle('synopsis-stats:get-suggestions', async (_event: any, publicationId: string) => {
    try {
      return await service.getSuggestions(publicationId);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  });

  // ===========================
  // Platform Comparison
  // ===========================

  ipcMain.handle('synopsis-stats:get-comparison', async (_event: any, projectId: string) => {
    try {
      return await service.getPlatformComparison(projectId);
    } catch (error) {
      console.error('Error getting platform comparison:', error);
      throw error;
    }
  });

  ipcMain.handle('synopsis-stats:get-insights', async (_event: any, projectId: string) => {
    try {
      return await service.getInsights(projectId);
    } catch (error) {
      console.error('Error getting insights:', error);
      throw error;
    }
  });

  // ===========================
  // Publishers
  // ===========================

  ipcMain.handle('synopsis-stats:get-publishers', async (_event: any, projectId: string) => {
    try {
      return await service.getPublishers(projectId);
    } catch (error) {
      console.error('Error getting publishers:', error);
      throw error;
    }
  });

  ipcMain.handle(
    'synopsis-stats:create-publisher',
    async (_event: any, data: Omit<PublisherRelation, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        return await service.createPublisher(data);
      } catch (error) {
        console.error('Error creating publisher:', error);
        throw error;
      }
    }
  );

  // ===========================
  // Strategy Experiments
  // ===========================

  ipcMain.handle('synopsis-stats:get-experiments', async (_event: any, projectId: string) => {
    try {
      return await service.getExperiments(projectId);
    } catch (error) {
      console.error('Error getting experiments:', error);
      throw error;
    }
  });

  ipcMain.handle('synopsis-stats:create-experiment', async (_event: any, data: CreateExperimentDTO) => {
    try {
      return await service.createExperiment(data);
    } catch (error) {
      console.error('Error creating experiment:', error);
      throw error;
    }
  });
}
