// WriterSidebar 상태 관리 커스텀 훅
import { useState, useCallback } from 'react';
import { useStructureStore } from '../../../../../stores/useStructureStore';
import { WriterSidebarState } from '../types';
import { Logger } from '../../../../../../shared/logger';

export function useWriterSidebar(projectId: string) {
    // 🔥 구조 스토어 연결
    const storeStructures = useStructureStore((state) => {
        const projectStructures = state.structures[projectId];
        return projectStructures || [];
    });
    const deleteStructureItem = useStructureStore((state) => state.deleteStructureItem);

    // 🔥 내부 상태
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['structure']));
    const [structureMenuId, setStructureMenuId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState<string>('');
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
    const [, forceUpdate] = useState({});

    // 🔥 강제 리렌더링 함수
    const triggerUpdate = useCallback(() => {
        forceUpdate({});
        Logger.debug('WRITER_SIDEBAR', 'Force update triggered');
    }, []);

    // 🔥 섹션 토글
    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            Logger.debug('WRITER_SIDEBAR', 'Section toggled', { sectionId, expanded: newSet.has(sectionId) });
            return newSet;
        });
    }, []);

    // 🔥 삭제 관련 함수들
    const handleDeleteStructure = useCallback((id: string, title: string) => {
        setItemToDelete({ id, title });
        setShowDeleteDialog(true);
        Logger.debug('WRITER_SIDEBAR', 'Delete dialog opened', { id, title });
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!itemToDelete) return;

        try {
            await deleteStructureItem(projectId, itemToDelete.id);
            setShowDeleteDialog(false);
            setItemToDelete(null);
            triggerUpdate();
            Logger.info('WRITER_SIDEBAR', 'Structure deleted', itemToDelete);
        } catch (error) {
            Logger.error('WRITER_SIDEBAR', 'Failed to delete structure', error);
        }
    }, [itemToDelete, deleteStructureItem, triggerUpdate]);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteDialog(false);
        setItemToDelete(null);
        Logger.debug('WRITER_SIDEBAR', 'Delete canceled');
    }, []);

    // 🔥 편집 관련 함수들
    const handleEditStructure = useCallback((id: string) => {
        Logger.debug('WRITER_SIDEBAR', 'Edit structure', { id });
        // TODO: 구조 편집 로직
    }, []);

    const handleStartTitleEdit = useCallback((id: string, currentTitle: string) => {
        setEditingId(id);
        setEditingTitle(currentTitle);
        setStructureMenuId(null);
        Logger.debug('WRITER_SIDEBAR', 'Title edit started', { id, currentTitle });
    }, []);

    const state: WriterSidebarState = {
        expandedSections,
        structureMenuId,
        editingId,
        editingTitle,
        showDeleteDialog,
        itemToDelete,
    };

    return {
        state,
        storeStructures,
        actions: {
            setStructureMenuId,
            setEditingId,
            setEditingTitle,
            toggleSection,
            handleDeleteStructure,
            handleConfirmDelete,
            handleCancelDelete,
            handleEditStructure,
            handleStartTitleEdit,
            triggerUpdate,
        },
    };
}
