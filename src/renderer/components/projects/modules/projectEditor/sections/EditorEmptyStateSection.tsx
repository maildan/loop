/**
 * EditorEmptyStateSection.tsx
 * Handles empty state rendering when no tabs are open
 *
 * Responsibility:
 * - Render EmptyEditorState with MRU (Most Recently Used) chapter recovery
 * - Load cached tab metadata from localStorage and state cache
 * - Handle "Go to Last Chapter" functionality
 * - Manage recovery logic from both storage and state
 */

import React, { useCallback } from 'react';
import { EmptyEditorState } from '../components/EmptyEditorState';
import { useStructureStore } from '../../../../../stores/useStructureStore';
import { projectEditorStateService } from '../services/ProjectEditorStateService';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

const PROJECT_EDITOR = Symbol.for('PROJECT_EDITOR');

/**
 * Props for EditorEmptyStateSection
 */
interface EditorEmptyStateSectionProps {
  projectId: string;
  state: any; // Editor state with tabMetadataCache
  actions: any; // Editor actions
  onOpenNewChapterModal: () => void;
}

/**
 * EditorEmptyStateSection - Renders empty state with MRU recovery
 */
export const EditorEmptyStateSection: React.FC<EditorEmptyStateSectionProps> = ({
  projectId,
  state,
  actions,
  onOpenNewChapterModal,
}) => {
  // Get structures from store
  const structures = useStructureStore((s) => s.structures[projectId] || []);

  /**
   * Load cached tab metadata from storage first, then state cache as fallback
   */
  const getLastChapterMetadata = useCallback(() => {
    // Step 1: Try localStorage first
    const storageCached = projectEditorStateService.loadCacheFromStorage(projectId);
    let cachedTabIds = Object.keys(storageCached);

    // Step 2: If storage is empty, use state cache
    if (cachedTabIds.length === 0) {
      cachedTabIds = Object.keys(state.tabMetadataCache);

      if (cachedTabIds.length === 0) {
        Logger.debug(PROJECT_EDITOR, 'No cache found (storage or state)');
        return null;
      }

      // Use state cache
      const mostRecentTabId = cachedTabIds.reduce((latest, current) => {
        const latestMeta = state.tabMetadataCache[latest];
        const currentMeta = state.tabMetadataCache[current];
        if (!latestMeta || !currentMeta) return latest;
        return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
      });

      const lastChapterMetadata = state.tabMetadataCache[mostRecentTabId];

      Logger.info(PROJECT_EDITOR, 'Using state cache', {
        mostRecentTabId,
        hasChapterId: !!lastChapterMetadata?.chapterId,
      });

      return lastChapterMetadata;
    }

    // Use storage cache
    const mostRecentTabId = cachedTabIds.reduce((latest, current) => {
      const latestMeta = storageCached[latest];
      const currentMeta = storageCached[current];
      if (!latestMeta || !currentMeta) return latest;
      return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
    });

    const lastChapterMetadata = storageCached[mostRecentTabId];

    Logger.info(PROJECT_EDITOR, 'Using storage cache', {
      mostRecentTabId,
      metadata: lastChapterMetadata,
      hasChapterId: !!lastChapterMetadata?.chapterId,
    });

    return lastChapterMetadata;
  }, [projectId, state.tabMetadataCache]);

  const lastChapterMetadata = getLastChapterMetadata();

  /**
   * Handle "Go to Last Chapter" button click
   */
  const handleGoToLastChapter = useCallback(() => {
    if (!lastChapterMetadata?.chapterId) {
      Logger.warn(PROJECT_EDITOR, 'No chapterId in metadata');
      return;
    }

    Logger.info(PROJECT_EDITOR, 'Opening last chapter', {
      chapterId: lastChapterMetadata.chapterId,
      title: lastChapterMetadata.title,
    });

    // Try to find chapter in structures
    const chapter = structures.find((s: any) => s.id === lastChapterMetadata.chapterId);

    if (chapter?.id) {
      // Chapter found in structures - use it
      Logger.debug(PROJECT_EDITOR, 'Adding tab from structures', {
        tabId: `chapter-${chapter.id}`,
        title: chapter.title,
      });

      actions.addTab({
        id: `chapter-${chapter.id}`,
        title: chapter.title || lastChapterMetadata.title,
        type: 'chapter',
        chapterId: chapter.id,
        isActive: true,
      });

      actions.setCurrentView('write');
    } else {
      // Use cached data if structure not found
      Logger.warn(PROJECT_EDITOR, 'Chapter not found in structures, using cached data');

      // Get storage cache to get the tab ID
      const storageCached = projectEditorStateService.loadCacheFromStorage(projectId);
      const cachedTabIds = Object.keys(storageCached);

      if (cachedTabIds.length > 0) {
        const mostRecentTabId = cachedTabIds.reduce((latest, current) => {
          const latestMeta = storageCached[latest];
          const currentMeta = storageCached[current];
          if (!latestMeta || !currentMeta) return latest;
          return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
        });

        actions.addTab({
          id: mostRecentTabId,
          title: lastChapterMetadata.title,
          type: 'chapter',
          chapterId: lastChapterMetadata.chapterId,
          isActive: true,
        });

        actions.setCurrentView('write');
      }
    }
  }, [lastChapterMetadata, structures, projectId, actions]);

  return (
    <div className="flex-1 min-w-0 overflow-hidden">
      <EmptyEditorState
        onCreateChapter={onOpenNewChapterModal}
        onGoToLastChapter={handleGoToLastChapter}
        hasLastChapter={!!lastChapterMetadata}
        lastChapterTitle={lastChapterMetadata?.title || ''}
      />
    </div>
  );
};

export default EditorEmptyStateSection;
