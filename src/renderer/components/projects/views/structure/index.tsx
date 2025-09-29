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
    container: 'max-w-screen-xl mx-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
    header: 'p-6 bg-card/90 supports-[backdrop-filter]:bg-card/75 backdrop-blur-md border-b border-[hsl(var(--border))]/60',
    headerTop: 'flex items-center justify-between mb-4',
    title: 'text-2xl font-bold text-[hsl(var(--foreground))]',
    subtitle: 'text-sm text-muted-foreground leading-relaxed',

    // 구조 아이템 스타일
    structureItem: 'group relative flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-md hover:border-[hsl(var(--accent))]/60 hover:bg-[hsl(var(--accent))]/10 transition-all duration-200 cursor-pointer',
    itemIcon: 'w-6 h-6 text-[hsl(var(--accent-primary))] flex-shrink-0',
    itemContent: 'flex-1 min-w-0',
    itemTitle: 'font-semibold text-[hsl(var(--foreground))] truncate',
    itemType: 'text-xs text-muted-foreground mt-1',
    itemActions: 'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
    actionButton: 'p-2 rounded-lg text-muted-foreground hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]/10 transition-colors',
    editInput: 'w-full px-3 py-2 border-2 border-[hsl(var(--accent-primary))] rounded-lg text-sm font-semibold text-[hsl(var(--foreground))] bg-card focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/60',

    // 추가 메뉴 스타일
    addButton: 'flex items-center justify-between gap-3 p-3 text-muted-foreground border-2 border-dashed border-border rounded-lg hover:border-[hsl(var(--accent-primary))] hover:text-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent))]/10 transition-colors cursor-pointer',
    addMenu: 'mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden',
    addMenuItem: 'flex items-center gap-3 p-3 hover:bg-[hsl(var(--accent))]/10 cursor-pointer transition-colors border-b border-border last:border-b-0',
    addMenuIcon: 'w-5 h-5 text-[hsl(var(--accent-primary))]',
    addMenuText: 'font-medium text-[hsl(var(--foreground))]',
    addMenuDesc: 'text-xs text-muted-foreground',
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

    const addStructureItem = useStructureStore((state) => state.addStructureItem);
    const updateStructureItem = useStructureStore((state) => state.updateStructureItem);
    const deleteStructureItem = useStructureStore((state) => state.deleteStructureItem);
    const setCurrentEditor = useStructureStore((state) => state.setCurrentEditor);
    const reorderStructures = useStructureStore((state) => state.reorderStructures);
    const clearCurrentEditor = useStructureStore((state) => state.clearCurrentEditor);

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

            const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const newItem: ProjectStructure = {
                id,
                title: defaultTitles[type],
                content: '',
                type,
                projectId,
                sortOrder: structures.length,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await addStructureItem(projectId, newItem);
            Logger.info('STRUCTURE_VIEW', 'Item added successfully', {
                type,
                title: newItem.title,
                itemId: newItem.id
            });

            setShowAddMenu(false);

            // 해당 타입의 에디터로 이동
            if (type === 'idea') {
                onNavigateToNotesView?.();
                Logger.info('STRUCTURE_VIEW', 'Navigating to notes view', { ideaId: newItem.id });
            } else if (type === 'synopsis') {
                onNavigateToSynopsisEdit?.(newItem.id);
            } else if (type === 'chapter') {
                onNavigateToChapterEdit?.(newItem.id);
            }
        } catch (error) {
            Logger.error('STRUCTURE_VIEW', 'Failed to add item', { type, error });
        }
    }, [projectId, structures, addStructureItem, setCurrentEditor, onAddNewChapter, onNavigateToIdeaEdit, onNavigateToNotesView, onNavigateToSynopsisEdit]);

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
            Logger.info('STRUCTURE_VIEW', 'Item title updated', { itemId, newTitle: editTitle });
        } catch (error) {
            Logger.error('STRUCTURE_VIEW', 'Failed to update item title', { itemId, error });
        }
    }, [projectId, editTitle, updateStructureItem]);

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
            Logger.info('STRUCTURE_VIEW', 'Item deleted', { itemId: deleteConfirm.itemId });
        } catch (error) {
            Logger.error('STRUCTURE_VIEW', 'Failed to delete item', { itemId: deleteConfirm.itemId, error });
        }
    }, [deleteConfirm.itemId, projectId, deleteStructureItem]);

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
                    <BarChart3 className="w-8 h-8 text-[hsl(var(--accent-primary))]" />
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
                onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
                onConfirm={confirmDelete}
                title="항목 삭제"
                message="이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            />
        </div>
    );
});

export { StructureView };