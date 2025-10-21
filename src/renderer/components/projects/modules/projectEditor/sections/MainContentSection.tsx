/**
 * MainContentSection.tsx
 * Renders main editor content area with empty state handling
 *
 * Responsibility:
 * - Render EditorViewManager with all active tabs
 * - Render EmptyEditorState when no tabs are open
 * - Render RightSidebar (AI panel or stats)
 * - Handle MRU tab recovery logic
 */

import React, { useCallback } from 'react';
import { EditorViewManager } from '../views/EditorViewManager';
import { EmptyEditorState } from '../components/EmptyEditorState';
import { WriterStatsPanel } from '../../../editor/WriterStatsPanel';
import { GeminiSynopsisAgent } from '../../../views/synopsis/AI/GeminiSynopsisAgent';
import { useStructureStore } from '../../../../../stores/useStructureStore';
import { projectEditorStateService } from '../services/ProjectEditorStateService';
import type { Editor } from '@tiptap/react';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

const PROJECT_EDITOR = Symbol.for('PROJECT_EDITOR');

/**
 * Props for MainContentSection
 */
interface MainContentSectionProps {
  // State
  state: any;
  normalizedCurrentView: string;
  projectId: string;

  // Data
  projectData: any;
  editorInstance: Editor | null;
  memoizedCharacters: any[];
  memoizedNotes: any[];
  activeTab?: any;

  // Handlers
  onEditorReady?: (editor: Editor) => void;
  onTabUpdate?: (tabId: string, updates: any) => void;
  onViewChange?: (view: string) => void;
  onTabAdd?: (tab: any) => void;
  onOpenNewChapterModal?: () => void;

  // Store methods
  actions: any;
  setCurrentEditor: any;
  updateStructureItem: any;
}

/**
 * MainContentSection - Renders editor or empty state
 */
export const MainContentSection: React.FC<MainContentSectionProps> = ({
  state,
  normalizedCurrentView,
  projectId,
  projectData,
  editorInstance,
  memoizedCharacters,
  memoizedNotes,
  activeTab,
  onEditorReady,
  onTabUpdate,
  onViewChange,
  onTabAdd,
  onOpenNewChapterModal,
  actions,
  setCurrentEditor,
  updateStructureItem,
}) => {
  // Handle opening last chapter from storage
  const handleGoToLastChapter = useCallback(() => {
    // Check storage cache first
    const storageCached = projectEditorStateService.loadCacheFromStorage(projectId);
    const cachedTabIds = Object.keys(storageCached);

    if (cachedTabIds.length > 0) {
      // Find most recent tab
      const mostRecentTabId = cachedTabIds.reduce((latest, current) => {
        const latestMeta = storageCached[latest];
        const currentMeta = storageCached[current];
        if (!latestMeta || !currentMeta) return latest;
        return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
      });

      const lastChapterMetadata = storageCached[mostRecentTabId];

      Logger.info(PROJECT_EDITOR, 'Opening last chapter from storage', {
        tabId: mostRecentTabId,
        metadata: lastChapterMetadata,
      });

      if (lastChapterMetadata?.chapterId) {
        // Try to find chapter in structures
        const structures = useStructureStore.getState().structures[projectId] || [];
        const chapter = structures.find((s: any) => s.id === lastChapterMetadata.chapterId);

        if (chapter?.id) {
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
          actions.addTab({
            id: mostRecentTabId,
            title: lastChapterMetadata.title,
            type: 'chapter',
            chapterId: lastChapterMetadata.chapterId,
            isActive: true,
          });
          actions.setCurrentView('write');
        }
      } else {
        Logger.warn(PROJECT_EDITOR, 'No chapterId in metadata');
      }
    } else {
      // Use state cache as fallback
      const cachedTabIds = Object.keys(state.tabMetadataCache);
      if (cachedTabIds.length > 0) {
        const mostRecentId = cachedTabIds.reduce((latest, current) => {
          const latestMeta = state.tabMetadataCache[latest];
          const currentMeta = state.tabMetadataCache[current];
          if (!latestMeta || !currentMeta) return latest;
          return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
        });

        const lastChapterMetadata = state.tabMetadataCache[mostRecentId];
        if (mostRecentId && lastChapterMetadata?.chapterId) {
          const structures = useStructureStore.getState().structures[projectId] || [];
          const chapter = structures.find((s: any) => s.id === lastChapterMetadata.chapterId);

          if (chapter?.id) {
            actions.addTab({
              id: `chapter-${chapter.id}`,
              title: chapter.title || lastChapterMetadata.title,
              type: 'chapter',
              chapterId: chapter.id,
              isActive: true,
            });
            actions.setCurrentView('write');
          }
        }
      }
    }
  }, [projectId, state.tabMetadataCache, actions]);

  // Empty state
  if (state.tabs.length === 0) {
    // Get last chapter metadata for recovery
    let lastChapterMetadata: any = null;
    const storageCached = projectEditorStateService.loadCacheFromStorage(projectId);
    const cachedTabIds = Object.keys(storageCached);

    if (cachedTabIds.length > 0) {
      const mostRecentTabId = cachedTabIds.reduce((latest, current) => {
        const latestMeta = storageCached[latest];
        const currentMeta = storageCached[current];
        if (!latestMeta || !currentMeta) return latest;
        return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
      });
      lastChapterMetadata = storageCached[mostRecentTabId];
    } else {
      const stateCachedIds = Object.keys(state.tabMetadataCache);
      if (stateCachedIds.length > 0) {
        const mostRecentId = stateCachedIds.reduce((latest, current) => {
          const latestMeta = state.tabMetadataCache[latest];
          const currentMeta = state.tabMetadataCache[current];
          if (!latestMeta || !currentMeta) return latest;
          return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
        });
        lastChapterMetadata = state.tabMetadataCache[mostRecentId];
      }
    }

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
  }

  // Editor with content
  return (
    <>
      {/* Main editor area */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <EditorViewManager
          currentView={normalizedCurrentView}
          activeTab={activeTab}
          projectId={projectId}
          projectData={projectData}
          memoizedCharacters={memoizedCharacters}
          memoizedNotes={memoizedNotes}
          editorInstance={editorInstance}
          onEditorReady={onEditorReady}
          onTabUpdate={onTabUpdate}
          onViewChange={onViewChange}
          onTabAdd={onTabAdd}
          onOpenNewChapterModal={onOpenNewChapterModal}
          setCurrentEditor={setCurrentEditor}
          updateStructureItem={updateStructureItem}
        />
      </div>

      {/* Right sidebar - AI panel or stats */}
      {state.showRightSidebar && (
        <div className="w-80 flex-shrink-0 overflow-hidden h-full border-l border-[color:hsl(var(--border))]">
          {normalizedCurrentView === 'synopsis' ? (
            <GeminiSynopsisAgent
              projectId={projectId}
              onClose={actions.toggleRightSidebar}
            />
          ) : (
            <WriterStatsPanel
              showRightSidebar={state.showRightSidebar}
              toggleRightSidebar={actions.toggleRightSidebar}
              writerStats={projectData?.writerStats || {
                wordCount: 0,
                charCount: 0,
                paragraphCount: 0,
                readingTime: 0,
                wordGoal: 1000,
                progress: 0,
                sessionTime: 0,
                wpm: 0,
                headingCount: 0,
                listItemCount: 0,
              }}
              setWordGoal={(goal: number) => {
                projectData?.setWordGoal(goal);
              }}
              currentText={activeTab?.content || ''}
              projectId={projectId}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MainContentSection;
