'use client';

// 🔥 기가차드 스토리 구조 뷰 - 모듈화된 버전

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { ProjectStructure } from '../../../../../shared/types';
import { useStructureStore } from '../../../../stores/useStructureStore';
import { useProjectData } from '../../hooks/useProjectData';
import { Logger } from '../../../../../shared/logger';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { MainStorySection } from './MainStorySection';
import { FolderSection } from './FolderSection';
import { AddItemMenu } from './AddItemMenu';
import {
    BarChart3,
} from 'lucide-react';

export interface StructureViewProps {
    projectId: string;
    onNavigateToChapterEdit?: (chapterId: string) => void;
    onNavigateToSynopsisEdit?: (synopsisId: string) => void;
    onNavigateToIdeaEdit?: (ideaId: string) => void;
    onNavigateToNotesView?: () => void;
    onAddNewChapter?: () => void;
}

// 🔥 기가차드 작가 친화적 구조 스타일
const STRUCTURE_STYLES = {
    container: 'max-w-screen-xl mx-auto bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
    header: 'p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700/50',
    headerTop: 'flex items-center justify-between mb-4',
    title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    subtitle: 'text-slate-600 dark:text-gray-400 leading-relaxed',

    // 구조 아이템 스타일
    structureItem: 'flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer',
    itemIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0',
    itemContent: 'flex-1 min-w-0',
    itemTitle: 'font-medium text-gray-900 dark:text-gray-100 truncate',
    itemType: 'text-xs text-gray-500 dark:text-gray-400 mt-1',
    itemActions: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
    actionButton: 'p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded',
    editInput: 'w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500',

    // 추가 메뉴 스타일
    addButton: 'w-full flex items-center justify-between gap-3 p-4 text-gray-600 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer',
    addMenu: 'mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden',
    addMenuItem: 'flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0',
} as const;

const EMPTY_STRUCTURES: ProjectStructure[] = [];

const StructureView = memo(function StructureView({
    projectId,
    onNavigateToChapterEdit,
    onNavigateToSynopsisEdit,
    onNavigateToIdeaEdit,
    onNavigateToNotesView,
    onAddNewChapter
}: StructureViewProps): React.ReactElement {
    // 🔥 프로젝트 데이터 가져오기
    const {
        content: mainContent,
        title: projectTitle,
        writerStats,
        isLoading: projectDataLoading
    } = useProjectData(projectId);

    // 🔥 Zustand 스토어 사용
    const structures = useStructureStore((state) => {
        const projectStructures = state.structures[projectId];
        return projectStructures ? Object.values(projectStructures) : EMPTY_STRUCTURES;
    });

    const {
        addStructureItem,
        updateStructureItem,
        deleteStructureItem,
        setCurrentEditor
    } = useStructureStore();

    // 🔥 로컬 상태
    const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
        isOpen: false,
        itemId: null
    });

    // 🔥 폴더별 데이터 그룹화
    const groupedStructures = useMemo(() => {
        const groups = {
            chapters: structures.filter(item => item.type === 'chapter').sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ),
            synopsis: structures.filter(item => item.type === 'synopsis').sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ),
            notes: structures.filter(item => item.type === 'idea').sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
        };

        Logger.debug('STRUCTURE_VIEW', 'Grouped structures', {
            chapters: groups.chapters.length,
            synopsis: groups.synopsis.length,
            notes: groups.notes.length
        });

        return groups;
    }, [structures]);

    // 🔥 폴더 토글
    const toggleFolder = useCallback((folderId: string) => {
        setCollapsedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    }, []);

    // 🔥 아이템 클릭 핸들러
    const handleItemClick = useCallback((item: ProjectStructure): void => {
        Logger.info('STRUCTURE_VIEW', 'Item clicked', { item: item.title, type: item.type });

        setCurrentEditor({
            editorType: item.type === 'idea' ? 'notes' :
                item.type === 'chapter' ? 'chapter' :
                    item.type === 'synopsis' ? 'synopsis' : 'structure',
            itemId: item.id,
            projectId
        });

        if (item.type === 'chapter') {
            onNavigateToChapterEdit?.(item.id);
        } else if (item.type === 'idea') {
            onNavigateToNotesView?.();
            Logger.info('STRUCTURE_VIEW', 'Navigating to notes view from idea click', { ideaId: item.id });
        } else if (item.type === 'synopsis' || (item.type as any) === 'main') {
            onNavigateToSynopsisEdit?.(item.id);
        }
    }, [projectId, setCurrentEditor, onNavigateToChapterEdit, onNavigateToIdeaEdit, onNavigateToNotesView, onNavigateToSynopsisEdit]);

    // 🔥 아이템 추가
    const handleAddItem = useCallback(async (type: 'chapter' | 'synopsis' | 'idea'): Promise<void> => {
        try {
            const defaultTitles = {
                chapter: `새로운 챕터`,
                synopsis: `새로운 시놉시스`,
                idea: `새로운 아이디어`
            };

            const newItem: Omit<ProjectStructure, 'id'> = {
                title: defaultTitles[type],
                content: '',
                type,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const addedItem = await addStructureItem(projectId, newItem);
            Logger.info('STRUCTURE_VIEW', 'Item added successfully', {
                type,
                title: newItem.title,
                itemId: addedItem.id
            });

            triggerUpdate();
            setShowAddMenu(false);

            // 해당 타입의 에디터로 이동
            if (type === 'idea') {
                onNavigateToNotesView?.();
                Logger.info('STRUCTURE_VIEW', 'Navigating to notes view', { ideaId: addedItem.id });
            } else if (type === 'synopsis') {
                onNavigateToSynopsisEdit?.(addedItem.id);
            } else if (type === 'chapter') {
                onNavigateToChapterEdit?.(addedItem.id);
            }
        } catch (error) {
            Logger.error('STRUCTURE_VIEW', 'Failed to add item', { type, error });
        }
    }, [projectId, structures, addStructureItem, setCurrentEditor, onAddNewChapter, onNavigateToIdeaEdit, onNavigateToNotesView, onNavigateToSynopsisEdit, triggerUpdate]);

    // 🔥 편집 관련 핸들러
    const handleEditStart = useCallback((item: ProjectStructure) => {
        setEditingId(item.id);
        setEditTitle(item.title);
    }, []);

    const handleEditSave = useCallback(async (itemId: string) => {
        if (!editTitle.trim()) return;

        try {
            await updateStructureItem(projectId, itemId, { title: editTitle.trim() });
            setEditingId(null);
            setEditTitle('');
            triggerUpdate();
            Logger.info('STRUCTURE_VIEW', 'Item title updated', { itemId, newTitle: editTitle });
        } catch (error) {
            Logger.error('STRUCTURE_VIEW', 'Failed to update item title', { itemId, error });
        }
    }, [projectId, editTitle, updateStructureItem, triggerUpdate]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent, itemId: string) => {
        if (e.key === 'Enter') {
            handleEditSave(itemId);
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditTitle('');
        }
    }, [handleEditSave]);

    // 🔥 삭제 핸들러
    const handleDelete = useCallback((itemId: string) => {
        setDeleteConfirm({ isOpen: true, itemId });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deleteConfirm.itemId) return;

        try {
            await deleteStructureItem(projectId, deleteConfirm.itemId);
            setDeleteConfirm({ isOpen: false, itemId: null });
            triggerUpdate();
            Logger.info('STRUCTURE_VIEW', 'Item deleted', { itemId: deleteConfirm.itemId });
        } catch (error) {
            Logger.error('STRUCTURE_VIEW', 'Failed to delete item', { itemId: deleteConfirm.itemId, error });
        }
    }, [deleteConfirm.itemId, projectId, deleteStructureItem, triggerUpdate]);

    // 🔥 폴더 헤더 렌더링 함수
    const renderFolderHeader = useCallback((
        folderType: string,
        title: string,
        icon: React.ComponentType<any>,
        count: number
    ) => {
        const isCollapsed = collapsedFolders.has(folderType);
        return (
            <div key={`${folderType}-header`}>
                {/* FolderHeader 컴포넌트 사용 */}
            </div>
        );
    }, [collapsedFolders, toggleFolder]);

    return (
        <div className={STRUCTURE_STYLES.container}>
            {/* 헤더 */}
            <div className={STRUCTURE_STYLES.header}>
                <div className={STRUCTURE_STYLES.headerTop}>
                    <div>
                        <h2 className={STRUCTURE_STYLES.title}>스토리 구조</h2>
                        <p className={STRUCTURE_STYLES.subtitle}>
                            프로젝트의 구조를 체계적으로 관리하고 편집하세요
                        </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="p-6">
                <div className="space-y-4">
                    {/* 메인 스토리 섹션 */}
                    <MainStorySection
                        projectId={projectId}
                        projectTitle={projectTitle}
                        mainContent={mainContent}
                        writerStats={writerStats}
                        projectDataLoading={projectDataLoading}
                        collapsedFolders={collapsedFolders}
                        renderFolderHeader={renderFolderHeader}
                        STRUCTURE_STYLES={STRUCTURE_STYLES}
                    />

                    {/* 챕터 섹션 */}
                    <FolderSection
                        folderId="chapters"
                        items={groupedStructures.chapters}
                        collapsedFolders={collapsedFolders}
                        editingId={editingId}
                        editTitle={editTitle}
                        onToggleFolder={toggleFolder}
                        onItemClick={handleItemClick}
                        onEditStart={handleEditStart}
                        onEditSave={handleEditSave}
                        onKeyPress={handleKeyPress}
                        onDelete={handleDelete}
                        onEditTitleChange={setEditTitle}
                        STRUCTURE_STYLES={STRUCTURE_STYLES}
                    />

                    {/* 시놉시스 섹션 */}
                    <FolderSection
                        folderId="synopsis"
                        items={groupedStructures.synopsis}
                        collapsedFolders={collapsedFolders}
                        editingId={editingId}
                        editTitle={editTitle}
                        onToggleFolder={toggleFolder}
                        onItemClick={handleItemClick}
                        onEditStart={handleEditStart}
                        onEditSave={handleEditSave}
                        onKeyPress={handleKeyPress}
                        onDelete={handleDelete}
                        onEditTitleChange={setEditTitle}
                        STRUCTURE_STYLES={STRUCTURE_STYLES}
                    />

                    {/* 노트 섹션 */}
                    <FolderSection
                        folderId="notes"
                        items={groupedStructures.notes}
                        collapsedFolders={collapsedFolders}
                        editingId={editingId}
                        editTitle={editTitle}
                        onToggleFolder={toggleFolder}
                        onItemClick={handleItemClick}
                        onEditStart={handleEditStart}
                        onEditSave={handleEditSave}
                        onKeyPress={handleKeyPress}
                        onDelete={handleDelete}
                        onEditTitleChange={setEditTitle}
                        STRUCTURE_STYLES={STRUCTURE_STYLES}
                    />

                    {/* 아이템 추가 메뉴 */}
                    <AddItemMenu
                        showAddMenu={showAddMenu}
                        onToggleMenu={() => setShowAddMenu(!showAddMenu)}
                        onAddItem={handleAddItem}
                        STRUCTURE_STYLES={STRUCTURE_STYLES}
                    />
                </div>
            </div>

            {/* 삭제 확인 다이얼로그 */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, itemId: null })}
                onConfirm={confirmDelete}
                title="항목 삭제"
                message="이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            />
        </div>
    );
});

export { StructureView };