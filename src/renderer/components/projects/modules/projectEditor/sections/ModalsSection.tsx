/**
 * ModalsSection.tsx
 * Renders all modals for project editor
 *
 * Responsibility:
 * - Render all modal components (NewChapterModal, ConfirmDeleteDialog, etc.)
 * - Handle modal state management
 * - Handle modal confirmation logic
 */

import React from 'react';
import { NewChapterModal } from '../../../components/NewChapterModal';
import { ConfirmDeleteDialog } from '../../../components/ConfirmDeleteDialog';
import { ShareDialog } from '../../../components/ShareDialog';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ShortcutHelp } from '../../../editor/ShortcutHelp';
import { useStructureStore } from '../../../../../stores/useStructureStore';
import type { ProjectStructure } from '../../../../../../shared/types/project';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

const PROJECT_EDITOR = Symbol.for('PROJECT_EDITOR');

/**
 * Props for ModalsSection
 */
interface ModalsSectionProps {
  // State
  state: any;

  // Project data
  projectId: string;
  projectData: any;

  // Actions
  actions: any;

  // Store methods
  addStructureItem: (projectId: string, item: ProjectStructure) => Promise<void>;
  setCurrentEditor: (config: any) => void;
}

/**
 * ModalsSection - Renders all modals
 */
export const ModalsSection: React.FC<ModalsSectionProps> = ({
  state,
  projectId,
  projectData,
  actions,
  addStructureItem,
  setCurrentEditor,
}) => {
  /**
   * Handle new chapter creation
   */
  const handleCreateChapter = async (title: string) => {
    const safeTitle = (title && title.trim()) || `새 챕터 ${Date.now()}`;

    const newItem: ProjectStructure = {
      id: `chapter_${Date.now()}`,
      title: safeTitle,
      description: '',
      type: 'chapter',
      status: 'draft',
      wordCount: 0,
      sortOrder: 0,
      depth: 0,
      color: '#6b7280',
      isActive: true,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await addStructureItem(projectId, newItem);

      // Set current editor
      setCurrentEditor({
        projectId,
        editorType: 'chapter',
        itemId: newItem.id,
        itemTitle: newItem.title,
      });

      // Add new tab
      const newTab = {
        id: `chapter-${newItem.id}`,
        title: newItem.title,
        type: 'chapter' as const,
        isActive: true,
        chapterId: newItem.id, // 🔥 CRITICAL: chapterId must be saved
        content: '',
      };

      actions.addTab(newTab);
      actions.setActiveTab(newTab.id);

      Logger.info(PROJECT_EDITOR, 'New chapter created', {
        id: newItem.id,
        title: newItem.title,
      });
    } catch (error) {
      Logger.error(PROJECT_EDITOR, 'Failed to create new chapter', { error });
    } finally {
      actions.closeNewChapterModal();
    }
  };

  return (
    <>
      {/* Delete confirmation dialog */}
      {state.showDeleteDialog && (
        <ConfirmDeleteDialog
          isOpen={state.showDeleteDialog}
          projectTitle={projectData?.title || '프로젝트'}
          onConfirm={() => {
            // TODO: Implement project deletion logic
            actions.closeDeleteDialog();
          }}
          onCancel={actions.closeDeleteDialog}
        />
      )}

      {/* Share dialog */}
      {state.showShareDialog && (
        <ShareDialog
          isOpen={state.showShareDialog}
          onClose={actions.closeShareDialog}
          projectId={projectId}
          projectTitle={projectData?.title || '프로젝트'}
        />
      )}

      {/* New chapter modal */}
      {state.showNewChapterModal && (
        <NewChapterModal
          isOpen={state.showNewChapterModal}
          onClose={actions.closeNewChapterModal}
          onConfirm={handleCreateChapter}
        />
      )}

      {/* New character modal (reuse NewChapterModal for now) */}
      {state.showNewCharacterModal && (
        <NewChapterModal
          isOpen={state.showNewCharacterModal}
          onClose={actions.closeNewCharacterModal}
          onConfirm={(title: string) => {
            // TODO: Implement new character creation logic
            actions.closeNewCharacterModal();
          }}
        />
      )}

      {/* New note modal (reuse NewChapterModal for now) */}
      {state.showNewNoteModal && (
        <NewChapterModal
          isOpen={state.showNewNoteModal}
          onClose={actions.closeNewNoteModal}
          onConfirm={(title: string) => {
            // TODO: Implement new note creation logic
            actions.closeNewNoteModal();
          }}
        />
      )}

      {/* Keyboard shortcuts help - only show in write view */}
      <ShortcutHelp isEditorView={state.currentView === 'write'} />
    </>
  );
};

export default ModalsSection;
