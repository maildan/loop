'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Logger } from '../../../../../shared/logger';
import { useStructureStore } from '../../../../stores/useStructureStore';
import { IdeaItem, IdeaViewProps } from './types';
import { IdeaHeader } from './IdeaHeader';
import { QuickCapture } from './QuickCapture';
import { IdeaToolbar } from './IdeaToolbar';
import { IdeaList } from './IdeaList';
import { IdeaEditor } from './IdeaEditor';

const IDEA_STYLES = {
    container: 'h-full flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
};

const IdeaView = React.memo(({ ideaId: propIdeaId, onBack }: IdeaViewProps): React.ReactElement => {
    // 🔥 스토어에서 현재 에디터 정보 가져오기
    const structures = useStructureStore((s) => s.structures);
    const currentEditor = useStructureStore((s) => s.currentEditor);
    const ideaId = propIdeaId || (currentEditor?.editorType === 'idea' ? currentEditor.itemId : undefined) || 'global_ideas';

    // 🔥 스토어에서 구조 항목 찾기
    const storedStructureItem = useMemo(() => {
        try {
            const pid = currentEditor?.projectId;
            if (pid && structures[pid]) {
                return structures[pid].find((it) => it.id === ideaId);
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    }, [structures, currentEditor?.projectId, ideaId]);

    // 🔥 아이디어 상태 관리
    const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
        // 스토어에 항목이 있으면 그것을 기반으로 초기화
        if (storedStructureItem) {
            return [
                {
                    id: storedStructureItem.id,
                    title: storedStructureItem.title,
                    content: storedStructureItem.content || '',
                    category: 'other',
                    stage: 'initial',
                    tags: [],
                    priority: 'medium',
                    connections: [],
                    attachments: [],
                    notes: storedStructureItem.description || '',
                    createdAt: storedStructureItem.createdAt || new Date(),
                    updatedAt: storedStructureItem.updatedAt || new Date(),
                    isFavorite: false
                }
            ];
        }

        // localStorage에서 로드 시도
        try {
            const stored = localStorage.getItem(`ideas_${ideaId}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed.map((idea: any) => ({
                    ...idea,
                    createdAt: new Date(idea.createdAt),
                    updatedAt: new Date(idea.updatedAt)
                }));
            }
        } catch (error) {
            Logger.error('IDEA_VIEW', 'Failed to load ideas from localStorage', { error });
        }

        // 기본값 반환
        return [];
    });

    // 🔥 UI 상태 관리
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStage, setSelectedStage] = useState<string>('all');
    const [editingIdea, setEditingIdea] = useState<IdeaItem | null>(null);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

    // 🔥 데이터 저장 함수
    const saveToLocalStorage = useCallback((newIdeas: IdeaItem[]) => {
        try {
            localStorage.setItem(`ideas_${ideaId}`, JSON.stringify(newIdeas));
        } catch (error) {
            Logger.error('IDEA_VIEW', 'Failed to save ideas to localStorage', { error });
        }
    }, [ideaId]);

    // 🔥 자동 저장이 포함된 setIdeas 래퍼
    const updateIdeas = useCallback((newIdeas: IdeaItem[] | ((prev: IdeaItem[]) => IdeaItem[])) => {
        if (typeof newIdeas === 'function') {
            setIdeas(prev => {
                const updated = newIdeas(prev);
                saveToLocalStorage(updated);
                return updated;
            });
        } else {
            setIdeas(newIdeas);
            saveToLocalStorage(newIdeas);
        }
    }, [saveToLocalStorage]);

    // 🔥 ESC 키로 뒤로 가기
    useEffect(() => {
        const handleGlobalEscape = (event: CustomEvent): void => {
            Logger.info('IDEA_VIEW', 'ESC key pressed, going back to structure view');
            onBack();
            event.preventDefault();
        };

        window.addEventListener('global:escape', handleGlobalEscape as EventListener);
        return () => window.removeEventListener('global:escape', handleGlobalEscape as EventListener);
    }, [onBack]);

    // 🔥 필터링된 아이디어
    const filteredIdeas = useMemo(() => {
        return ideas.filter(idea => {
            const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                idea.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
            const matchesStage = selectedStage === 'all' || idea.stage === selectedStage;

            return matchesSearch && matchesCategory && matchesStage;
        });
    }, [ideas, searchTerm, selectedCategory, selectedStage]);

    // 🔥 아이디어 추가
    const handleAddIdea = useCallback((newIdea: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        const idea: IdeaItem = {
            ...newIdea,
            id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        updateIdeas(prev => [...prev, idea]);
        Logger.info('IDEA_VIEW', 'New idea added', { title: idea.title });
    }, [updateIdeas]);

    // 🔥 아이디어 편집
    const handleEditIdea = useCallback((idea: IdeaItem) => {
        setEditingIdea({ ...idea });
    }, []);

    // 🔥 아이디어 저장
    const handleSaveIdea = useCallback(() => {
        if (!editingIdea) return;

        const updatedIdea = {
            ...editingIdea,
            updatedAt: new Date(),
        };

        updateIdeas(prev => {
            const existingIndex = prev.findIndex(i => i.id === updatedIdea.id);
            if (existingIndex >= 0) {
                // 기존 아이디어 업데이트
                const newIdeas = [...prev];
                newIdeas[existingIndex] = updatedIdea;
                return newIdeas;
            } else {
                // 새 아이디어 추가
                return [...prev, updatedIdea];
            }
        });

        setEditingIdea(null);
        Logger.info('IDEA_VIEW', 'Idea saved', { title: updatedIdea.title });
    }, [editingIdea, updateIdeas]);

    // 🔥 아이디어 삭제
    const handleDeleteIdea = useCallback((id: string) => {
        updateIdeas(prev => prev.filter(idea => idea.id !== id));
        Logger.info('IDEA_VIEW', 'Idea deleted', { id });
    }, [updateIdeas]);

    // 🔥 즐겨찾기 토글
    const handleToggleFavorite = useCallback((id: string) => {
        updateIdeas(prev => prev.map(idea =>
            idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
        ));
    }, [updateIdeas]);

    // 🔥 섞기
    const handleShuffle = useCallback(() => {
        updateIdeas(prev => [...prev].sort(() => Math.random() - 0.5));
    }, [updateIdeas]);

    // 🔥 정렬
    const handleSort = useCallback(() => {
        updateIdeas(prev => [...prev].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    }, [updateIdeas]);

    // 🔥 드래그 앤 드롭
    const handleDragStart = useCallback((e: React.DragEvent, ideaId: string) => {
        setDraggedItemId(ideaId);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, ideaId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverItemId(ideaId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOverItemId(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
        e.preventDefault();

        if (!draggedItemId || draggedItemId === targetId) {
            setDraggedItemId(null);
            setDragOverItemId(null);
            return;
        }

        const draggedIndex = ideas.findIndex(idea => idea.id === draggedItemId);
        const targetIndex = ideas.findIndex(idea => idea.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newIdeas = [...ideas];
        const draggedItem = newIdeas.splice(draggedIndex, 1)[0];
        if (draggedItem) {
            newIdeas.splice(targetIndex, 0, draggedItem);
            updateIdeas(newIdeas);
        }

        setDraggedItemId(null);
        setDragOverItemId(null);
    }, [draggedItemId, ideas, updateIdeas]);

    return (
        <div className={IDEA_STYLES.container}>
            {/* 헤더 */}
            <IdeaHeader
                onBack={onBack}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onAddIdea={() => handleEditIdea({
                    id: `temp_${Date.now()}`,
                    title: '',
                    content: '',
                    category: 'other',
                    stage: 'initial',
                    tags: [],
                    priority: 'medium',
                    connections: [],
                    attachments: [],
                    notes: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isFavorite: false
                })}
            />

            {/* 빠른 캡처 */}
            <QuickCapture onAddIdea={handleAddIdea} />

            {/* 툴바 */}
            <IdeaToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStage={selectedStage}
                onStageChange={setSelectedStage}
                onShuffle={handleShuffle}
                onSort={handleSort}
            />

            {/* 아이디어 목록 */}
            <IdeaList
                ideas={filteredIdeas}
                viewMode={viewMode}
                onIdeaClick={handleEditIdea}
                onIdeaEdit={handleEditIdea}
                onIdeaDelete={handleDeleteIdea}
                onToggleFavorite={handleToggleFavorite}
                draggedItemId={draggedItemId}
                dragOverItemId={dragOverItemId}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            />

            {/* 편집 모달 */}
            <IdeaEditor
                idea={editingIdea}
                isVisible={!!editingIdea}
                isNew={!editingIdea?.id || editingIdea.id.startsWith('temp_')}
                onChange={(updates) => setEditingIdea(prev => prev ? { ...prev, ...updates } : null)}
                onSave={handleSaveIdea}
                onCancel={() => setEditingIdea(null)}
            />
        </div>
    );
});

IdeaView.displayName = 'IdeaView';

export { IdeaView };