/**
 * EditorViewManager.tsx
 * Renders the appropriate editor view based on currentView state.
 *
 * Responsibility:
 * - Manage view switching logic (write, structure, characters, notes, synopsis, idea)
 * - Render view-specific components with proper props
 * - Handle navigation callbacks between views
 * - Maintain data transformation for each view
 */

import React, { useMemo, useCallback } from 'react';
import { MarkdownEditor } from '../../../editor/MarkdownEditor';
import { EditorProvider } from '../../../editor/EditorProvider';
import { StructureView } from '../../../views/StructureView';
import { CharactersView } from '../../../views/CharactersView';
import { NotesView } from '../../../views/notes';
import { SynopsisView } from '../../../views/synopsis';
import { IdeaView } from '../../../views/idea';
import { useStructureStore } from '../../../../../stores/useStructureStore';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

const PROJECT_EDITOR = 'PROJECT_EDITOR';

/**
 * Props for EditorViewManager
 */
interface EditorViewManagerProps {
  /** Current active view type */
  currentView: string;
  /** Currently active tab (for write view) */
  activeTab?: { id: string; title: string; type: string; content: string; isDirty?: boolean };
  /** Project ID */
  projectId: string;
  /** Project data containing structure, characters, notes */
  projectData?: any;
  /** Memoized characters list */
  memoizedCharacters: any[];
  /** Memoized notes list */
  memoizedNotes: any[];
  /** Editor instance reference */
  editorInstance?: any;
  /** Callback when editor is ready */
  onEditorReady?: (editor: any) => void;
  /** Callback for tab updates */
  onTabUpdate?: (tabId: string, updates: { content?: string; isDirty?: boolean }) => void;
  /** Callback for view navigation */
  onViewChange?: (view: string) => void;
  /** Callback for tab addition */
  onTabAdd?: (tab: any) => void;
  /** Callback for opening new chapter modal */
  onOpenNewChapterModal?: () => void;
  /** Callback for setting current editor */
  setCurrentEditor?: (editor: any) => void;
  /** Update structure item function from store */
  updateStructureItem: (projectId: string, structureId: string, updates: any) => Promise<void>;
}

/**
 * EditorViewManager - Renders appropriate view based on state
 *
 * This component consolidates all view rendering logic, replacing the 175-line
 * renderCurrentView() function. Each case is responsible for rendering its
 * corresponding view with proper data transformation and callbacks.
 */
export const EditorViewManager: React.FC<EditorViewManagerProps> = ({
  currentView,
  activeTab,
  projectId,
  projectData,
  memoizedCharacters,
  memoizedNotes,
  editorInstance,
  onEditorReady,
  onTabUpdate,
  onViewChange,
  onTabAdd,
  onOpenNewChapterModal,
  setCurrentEditor,
  updateStructureItem,
}) => {
  // Memoize structure mapping to avoid re-renders
  const synopsisElements = useMemo(() => {
    return (projectData?.structure || []).map((item: any) => ({
      id: item.id,
      type: item.type as 'main' | 'chapter' | 'character' | 'memo' | 'idea' | 'note' | 'synopsis',
      title: item.title,
      content: item.content || '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      order: item.sortOrder,
      wordCount: item.wordCount,
    }));
  }, [projectData?.structure]);

  // Memoize character mapping with defaults
  const synopsisCharacters = useMemo(() => {
    return memoizedCharacters.map((char: any) => ({
      ...char,
      color: char.color || '#3B82F6',
      sortOrder: char.sortOrder ?? 0,
      isActive: char.isActive ?? true,
    }));
  }, [memoizedCharacters]);

  // Memoize notes mapping with defaults
  const synopsisNotes = useMemo(() => {
    return memoizedNotes.map((note: any) => ({
      ...note,
      type: note.type || 'general',
      color: note.color || '#3B82F6',
      isPinned: note.isPinned ?? false,
      isArchived: note.isArchived ?? false,
      sortOrder: note.sortOrder ?? 0,
    }));
  }, [memoizedNotes]);

  // Handle editor content change for write view
  const handleEditorChange = useCallback(
    (content: string) => {
      Logger.debug(PROJECT_EDITOR, 'MarkdownEditor onChange', {
        activeTabId: activeTab?.id,
        activeTabType: activeTab?.type,
        contentLength: content.length,
        contentPreview: content.substring(0, 100) + '...',
      });

      if (activeTab) {
        // Update tab
        onTabUpdate?.(activeTab.id, {
          content,
          isDirty: true,
        });

        // Save chapter if applicable
        if (activeTab.type === 'chapter') {
          Logger.debug(PROJECT_EDITOR, 'Saving to CHAPTER', { title: activeTab.title });

          const structureId = activeTab.id.startsWith('chapter-') ? activeTab.id.replace('chapter-', '') : activeTab.id;

          updateStructureItem(projectId, structureId, {
            content: content,
          })
            .then(() => {
              Logger.info(PROJECT_EDITOR, 'Chapter saved successfully', { structureId });
              onTabUpdate?.(activeTab.id, { isDirty: false });
            })
            .catch((error: any) => {
              Logger.error(PROJECT_EDITOR, 'Failed to save chapter', { error });
            });
        } else {
          Logger.debug(PROJECT_EDITOR, 'Saving to TAB only', { type: activeTab.type });
        }
      }
    },
    [activeTab, onTabUpdate, projectId, updateStructureItem]
  );

  // Handle navigation to chapter edit from structure view
  const handleNavigateToChapterEdit = useCallback(
    (chapterId: string) => {
      const all = useStructureStore.getState().structures[projectId] || [];
      const chapter = all.find((s: any) => s.id === chapterId);
      const title = chapter?.title || `챕터 ${chapterId}`;

      const newTab = {
        id: `chapter-${chapterId}`,
        title,
        type: 'chapter' as const,
        isActive: true,
        chapterId: chapterId,
        content: chapter?.content || '',
      };
      onTabAdd?.(newTab);
      onViewChange?.('write');
      Logger.info(PROJECT_EDITOR, 'Chapter tab opened', {
        chapterId,
        hasContent: !!chapter?.content,
        contentLength: chapter?.content?.length || 0,
      });
    },
    [projectId, onTabAdd, onViewChange]
  );

  // Handle navigation to idea edit
  const handleNavigateToIdeaEdit = useCallback(
    (ideaId: string) => {
      const all = useStructureStore.getState().structures[projectId] || [];
      const idea = all.find((s: any) => s.id === ideaId);
      setCurrentEditor?.({
        projectId,
        editorType: 'idea',
        itemId: ideaId,
        itemTitle: idea?.title,
      });
      onViewChange?.('idea');
      Logger.info(PROJECT_EDITOR, 'Idea view opened', { ideaId });
    },
    [projectId, setCurrentEditor, onViewChange]
  );

  // Handle navigation to synopsis edit
  const handleNavigateToSynopsisEdit = useCallback(
    (synopsisId: string) => {
      const all = useStructureStore.getState().structures[projectId] || [];
      const syn = all.find((s: any) => s.id === synopsisId);
      setCurrentEditor?.({
        projectId,
        editorType: 'synopsis',
        itemId: synopsisId,
        itemTitle: syn?.title,
      });
      onViewChange?.('synopsis');
      Logger.info(PROJECT_EDITOR, 'Synopsis view opened', { synopsisId });
    },
    [projectId, setCurrentEditor, onViewChange]
  );

  // Handle navigation to notes view
  const handleNavigateToNotesView = useCallback(() => {
    onViewChange?.('notes');
    Logger.info(PROJECT_EDITOR, 'Notes view opened from structure');
  }, [onViewChange]);

  // Handle back from notes
  const handleNotesBack = useCallback(() => {
    Logger.info(PROJECT_EDITOR, 'Notes view back - returning to structure view');
    onViewChange?.('structure');
  }, [onViewChange]);

  // Handle back from idea
  const handleIdeaBack = useCallback(() => {
    Logger.info(PROJECT_EDITOR, 'Idea view back - returning to structure view');
    onViewChange?.('structure');
  }, [onViewChange]);

  // 🔥 DEBUG: 각 view 렌더링 확인
  Logger.debug(PROJECT_EDITOR, '🔥 EditorViewManager render check', {
    currentView,
    willRenderWrite: currentView === 'write',
    willRenderStructure: currentView === 'structure',
    willRenderCharacters: currentView === 'characters',
    willRenderNotes: currentView === 'notes',
    willRenderSynopsis: currentView === 'synopsis',
    willRenderIdea: currentView === 'idea',
    noMatch: !['write', 'structure', 'characters', 'notes', 'synopsis', 'idea'].includes(currentView),
  });

  // Render write view
  if (currentView === 'write') {
    return (
      <EditorProvider>
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 min-h-0 w-full overflow-hidden">
            <MarkdownEditor
              content={activeTab?.content || ''}
              onChange={handleEditorChange}
              isFocusMode={false}
              onEditorReady={onEditorReady}
            />
          </div>
        </div>
      </EditorProvider>
    );
  }

  // Render structure view
  if (currentView === 'structure') {
    return (
      <StructureView
        projectId={projectId}
        onNavigateToChapterEdit={handleNavigateToChapterEdit}
        onAddNewChapter={onOpenNewChapterModal || (() => {})}
        onNavigateToIdeaEdit={handleNavigateToIdeaEdit}
        onNavigateToSynopsisEdit={handleNavigateToSynopsisEdit}
        onNavigateToNotesView={handleNavigateToNotesView}
      />
    );
  }

  // Render characters view
  if (currentView === 'characters') {
    return (
      <CharactersView
        projectId={projectId}
        characters={memoizedCharacters}
        onCharactersChange={(characters: any) => {
          if (projectData?.setCharacters) {
            projectData.setCharacters(characters);
            Logger.info(PROJECT_EDITOR, 'Characters updated', { count: characters.length });
          }
        }}
      />
    );
  }

  // Render notes view
  if (currentView === 'notes') {
    return (
      <NotesView
        projectId={projectId}
        notes={memoizedNotes}
        onNotesChange={(notes: any) => {
          if (projectData?.setNotes) {
            projectData.setNotes(notes);
            Logger.info(PROJECT_EDITOR, 'Notes updated', { count: notes.length });
          }
        }}
        onBack={handleNotesBack}
      />
    );
  }

  // Render synopsis view
  if (currentView === 'synopsis') {
    return (
      <SynopsisView
        projectId={projectId}
        elements={synopsisElements}
        characters={synopsisCharacters}
        notes={synopsisNotes}
        content={projectData?.content || ''}
      />
    );
  }

  // Render idea view
  if (currentView === 'idea') {
    return <IdeaView ideaId={projectId} onBack={handleIdeaBack} />;
  }

  // Render unknown view
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-500">알 수 없는 뷰: {currentView}</p>
    </div>
  );
};

export default EditorViewManager;
