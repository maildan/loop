/**
 * 🔥 useEpisodes Custom Hook
 * 
 * Episode 관리를 위한 통합 React Hook
 * - CRUD 작업
 * - Bulk 작업 (상태 변경, 삭제)
 * - Drag & Drop 순서 변경
 * - 5막 구조 편집
 */

import { useState, useEffect, useCallback } from 'react';
import { RendererLogger as Logger } from '../../shared/logger-renderer';
import type { Episode, CreateEpisodeInput, UpdateEpisodeInput, EpisodeFilterOptions, EpisodeSortOptions } from '../../shared/types/episode';

// 🔥 Symbol 기반 컴포넌트 이름
const USE_EPISODES_HOOK = Symbol.for('USE_EPISODES_HOOK');

// ============================================
// Exported Types
// ============================================

// Episode 타입은 shared/types/episode.ts에서 import하고 re-export
export type { Episode };

export interface EpisodeFilter {
  status?: Episode['status'] | 'all';
  act?: Episode['act'] | 'all';
  search?: string;
}

export interface EpisodeSort {
  field: 'episodeNumber' | 'createdAt' | 'updatedAt' | 'wordCount' | 'sortOrder';
  direction: 'asc' | 'desc';
}

// ============================================
// Hook: useEpisodes
// ============================================

export function useEpisodes(projectId: string) {
  // ============================================
  // State
  // ============================================

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<EpisodeFilter>({ status: 'all', act: 'all', search: '' });
  const [sort, setSort] = useState<EpisodeSort>({ field: 'sortOrder', direction: 'asc' });

  // ============================================
  // Fetch Episodes
  // ============================================

  const fetchEpisodes = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert internal filter/sort to shared types
      const options: EpisodeFilterOptions & EpisodeSortOptions = {
        // Filter options
        ...(filter.status && filter.status !== 'all' && { status: filter.status }),
        ...(filter.act && filter.act !== 'all' && { act: filter.act }),
        // Sort options
        sortBy: sort.field as any, // Type assertion needed due to internal vs shared type mismatch
        order: sort.direction,
      };

      const result = await window.electronAPI['episode:list'](projectId, options);

      if (Array.isArray(result)) {
        setEpisodes(result);
      } else if (result && typeof result === 'object' && 'success' in result) {
        const response = result as { success: boolean; data?: Episode[] };
        setEpisodes(response.success && Array.isArray(response.data) ? response.data : []);
      } else {
        setEpisodes([]);
      }
    } catch (err) {
            Logger.error(USE_EPISODES_HOOK, 'Error loading episodes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch episodes'));
    } finally {
      setLoading(false);
    }
  }, [projectId, filter, sort]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  // ============================================
  // CRUD Operations
  // ============================================

  const createEpisode = useCallback(async (input: Omit<CreateEpisodeInput, 'projectId'>) => {
    try {
      const createInput: CreateEpisodeInput = {
        ...input,
        projectId,
      };
      const result = await window.electronAPI['episode:create'](createInput);
      
      await fetchEpisodes(); // Refresh list
      return result;
    } catch (err) {
      Logger.error(USE_EPISODES_HOOK, 'Error creating episode', err);
      throw err;
    }
  }, [projectId, fetchEpisodes]);

  const updateEpisode = useCallback(async (id: string, updates: UpdateEpisodeInput) => {
    try {
      const result = await window.electronAPI['episode:update'](id, updates);
      await fetchEpisodes(); // Refresh list
      return result;
    } catch (err) {
      Logger.error(USE_EPISODES_HOOK, 'Error updating episode', err);
      throw err;
    }
  }, [fetchEpisodes]);

  const deleteEpisode = useCallback(async (id: string, hard: boolean = false) => {
    try {
      if (hard) {
        await window.electronAPI['episode:hardDelete'](id);
      } else {
        await window.electronAPI['episode:delete'](id);
      }
      await fetchEpisodes(); // Refresh list
    } catch (err) {
      Logger.error(USE_EPISODES_HOOK, 'Error deleting episode', err);
      throw err;
    }
  }, [fetchEpisodes]);

  const publishEpisode = useCallback(async (id: string, platforms: string[]) => {
    try {
      const result = await window.electronAPI['episode:publish'](id, platforms);
      await fetchEpisodes(); // Refresh list
      return result;
    } catch (err) {
      Logger.error(USE_EPISODES_HOOK, 'Error publishing episode', err);
      throw err;
    }
  }, [fetchEpisodes]);

  // ============================================
  // Bulk Operations
  // ============================================

  const bulkUpdateStatus = useCallback(async (episodeIds: string[], status: Episode['status']) => {
    try {
      await Promise.all(
        episodeIds.map(id => updateEpisode(id, { status }))
      );
    } catch (err) {
      Logger.error(USE_EPISODES_HOOK, 'Error bulk updating status', err);
      throw err;
    }
  }, [updateEpisode]);

  const bulkDelete = useCallback(async (episodeIds: string[]) => {
    try {
      await Promise.all(
        episodeIds.map(id => deleteEpisode(id, false))
      );
    } catch (err) {
      Logger.error(USE_EPISODES_HOOK, 'Error bulk deleting episodes', err);
      throw err;
    }
  }, [deleteEpisode]);

  // ============================================
  // Reorder (Drag & Drop)
  // ============================================

  const reorderEpisodes = useCallback(async (reorderedEpisodes: Episode[]) => {
    try {
      // Update sortOrder for each episode
      await Promise.all(
        reorderedEpisodes.map((ep, index) => 
          updateEpisode(ep.id, { sortOrder: index })
        )
      );
    } catch (err) {
      Logger.error(USE_EPISODES_HOOK, 'Error reordering episodes', err);
      throw err;
    }
  }, [updateEpisode]);

  // ============================================
  // Filter & Sort
  // ============================================

  const applyFilter = useCallback((newFilter: Partial<EpisodeFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const applySort = useCallback((newSort: EpisodeSort) => {
    setSort(newSort);
  }, []);

  // ============================================
  // Filtered & Sorted Episodes
  // ============================================

  const filteredEpisodes = episodes.filter(ep => {
    // Status filter
    if (filter.status && filter.status !== 'all' && ep.status !== filter.status) {
      return false;
    }

    // Act filter
    if (filter.act && filter.act !== 'all' && ep.act !== filter.act) {
      return false;
    }

    // Search filter
    if (filter.search) {
      const search = filter.search.toLowerCase();
      return (
        ep.title.toLowerCase().includes(search) ||
        ep.episodeNumber.toString().includes(search)
      );
    }

    return true;
  });

  // ============================================
  // Return
  // ============================================

  return {
    episodes: filteredEpisodes,
    loading,
    error,
    filter,
    sort,
    
    // CRUD
    createEpisode,
    updateEpisode,
    deleteEpisode,
    publishEpisode,
    
    // Bulk
    bulkUpdateStatus,
    bulkDelete,
    
    // Reorder
    reorderEpisodes,
    
    // Filter & Sort
    applyFilter,
    applySort,
    
    // Refetch
    refetch: fetchEpisodes,
  };
}
