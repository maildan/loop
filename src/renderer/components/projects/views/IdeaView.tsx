'use client';

// 🔥 아이디어 편집 뷰 - 창의적 발상과 영감 관리 시스템

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Logger } from '../../../../shared/logger';
import { useStructureStore } from '../../../stores/useStructureStore';
import {
    Plus,
    Edit3,
    Trash2,
    Search,
    Filter,
    Tag,
    Clock,
    Lightbulb,
    Users,
    MessageSquare,
    FileText,
    Image,
    Link,
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Save,
    X as XIcon,
    Grid3x3,
    List,
    Shuffle,
    TrendingUp,
    Heart,
    Star,
    Archive,
    ArrowUpRight,
    MapPin,
    Undo2,
    Redo2
} from 'lucide-react'; interface IdeaItem {
    id: string;
    title: string;
    content: string;
    category: 'character' | 'plot' | 'setting' | 'dialogue' | 'theme' | 'other';
    stage: 'initial' | 'developing' | 'concrete' | 'applied';
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    connections: string[]; // 연결된 다른 아이디어 ID들
    attachments: string[]; // 이미지, 링크 등
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    isFavorite: boolean;
}

interface IdeaViewProps {
    ideaId: string;
    onBack: () => void;
}

// 🔥 카테고리별 스타일
const CATEGORY_STYLES = {
    character: { icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', label: '캐릭터' },
    plot: { icon: FileText, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', label: '플롯' },
    setting: { icon: MapPin, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', label: '설정' },
    dialogue: { icon: MessageSquare, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', label: '대사' },
    theme: { icon: Heart, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', label: '테마' },
    other: { icon: MoreHorizontal, color: 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300', label: '기타' }
} as const;

// 🔥 개발 단계별 스타일
const STAGE_STYLES = {
    initial: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', label: '초기' },
    developing: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', label: '발전' },
    concrete: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', label: '구체화' },
    applied: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', label: '적용됨' }
} as const;

// 🔥 스타일 정의
const IDEA_STYLES = {
    container: 'flex-1 h-full bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',

    // 🔥 헤더
    header: 'sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700',
    headerTop: 'flex items-center justify-between p-4',
    backButton: 'flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    title: 'text-xl font-bold text-gray-900 dark:text-gray-100',
    headerActions: 'flex items-center gap-2',

    // 🔥 빠른 캡처
    quickCapture: 'p-4 border-b border-slate-200 dark:border-gray-700',
    captureInput: 'w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400',
    captureButton: 'mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap min-w-[80px]',    // 🔥 툴바
    toolbar: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700',
    toolbarLeft: 'flex items-center gap-3',
    toolbarRight: 'flex items-center gap-2',
    viewToggle: 'flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1',
    viewButton: 'p-2 rounded-md transition-colors',
    viewButtonActive: 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm',
    viewButtonInactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',

    // 🔥 필터
    filterButton: 'flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    searchContainer: 'relative',
    searchInput: 'pl-9 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    searchIcon: 'absolute left-3 top-2.5 text-gray-400',

    // 🔥 메인 컨텐츠
    content: 'flex-1 overflow-hidden',
    scrollArea: 'h-full overflow-y-auto p-6',

    // 🔥 카드 뷰
    cardsContainer: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    ideaCard: 'group bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer',
    cardHeader: 'flex items-start justify-between mb-3',
    cardTitle: 'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400',
    cardActions: 'opacity-0 group-hover:opacity-100 transition-opacity flex gap-1',
    cardContent: 'text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3',
    cardFooter: 'flex items-center justify-between',
    cardMeta: 'flex items-center gap-2',
    cardTags: 'flex items-center gap-1 flex-wrap',

    // 🔥 리스트 뷰
    listContainer: 'space-y-2',
    listItem: 'group bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer',

    // 🔥 공통 요소
    badge: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap',
    tag: 'inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs whitespace-nowrap',
    actionButton: 'p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors',    // 🔥 통계 영역
    statsGrid: 'grid grid-cols-4 gap-4 mb-6',
    statCard: 'bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-4 text-center',
    statValue: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    statLabel: 'text-sm text-gray-600 dark:text-gray-400 mt-1',
    statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2',

    // 🔥 빈 상태
    emptyState: 'flex flex-col items-center justify-center h-64 text-center',
    emptyIcon: 'w-16 h-16 text-gray-400 dark:text-gray-500 mb-4',
    emptyTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2',
    emptyDescription: 'text-gray-600 dark:text-gray-400 max-w-md mx-auto',

    // 🔥 모달
    modal: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50',
    modalContent: 'bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden',
    modalHeader: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700',
    modalTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    modalBody: 'p-4 overflow-y-auto',
    modalFooter: 'flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-gray-700',

    // 🔥 폼 스타일
    formGroup: 'mb-4',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
    input: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    textarea: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
    select: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',

    button: 'px-4 py-2 rounded-lg font-medium transition-colors',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
} as const;

export function IdeaView({ ideaId: propIdeaId, onBack }: IdeaViewProps): React.ReactElement {
    // 🔥 우선적으로 StructureStore의 현재 에디터/구조 항목을 사용하여 초기 상태 구성
    const structures = useStructureStore((s) => s.structures);
    const currentEditor = useStructureStore((s) => s.currentEditor);
    const ideaId = propIdeaId || (currentEditor?.editorType === 'idea' ? currentEditor.itemId : undefined) || 'global_ideas';

    const storedStructureItem = (() => {
        try {
            const pid = currentEditor?.projectId;
            if (pid && structures[pid]) {
                return structures[pid].find((it) => it.id === ideaId);
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    })();

    const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
        // 1) 스토어에서 항목이 있으면 그걸 기반으로 초기화
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

        // 2) 기존 localStorage fallback
        try {
            const saved = localStorage.getItem(`ideas_${ideaId}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((idea: any) => ({
                    ...idea,
                    createdAt: new Date(idea.createdAt),
                    updatedAt: new Date(idea.updatedAt)
                }));
            }
        } catch (error) {
            Logger.error('IDEA_VIEW', 'Failed to load ideas from localStorage', { error });
        }

        // 3) 기본 mock 데이터
        return [
            {
                id: '1',
                title: '신비로운 도서관',
                content: '각 책이 살아있는 도서관. 독자가 책을 열면 그 세계로 빨려들어간다. 사서는 실제로는 차원의 수호자.',
                category: 'setting',
                stage: 'developing',
                tags: ['판타지', '도서관', '차원이동'],
                priority: 'high',
                connections: [],
                attachments: [],
                notes: 'Harry Potter의 움직이는 계단에서 영감을 받음',
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-20'),
                isFavorite: true
            }
        ];
    });

    // 🔁 currentEditor 또는 스토어 구조가 변경되면 상태 동기화
    useEffect(() => {
        const stored = (() => {
            try {
                const pid = currentEditor?.projectId;
                if (pid && structures[pid]) {
                    return structures[pid].find((it) => it.id === ideaId);
                }
            } catch (e) {
                // ignore
            }
            return undefined;
        })();

        if (stored) {
            setIdeas([{
                id: stored.id,
                title: stored.title,
                content: stored.content || '',
                category: 'other',
                stage: 'initial',
                tags: [],
                priority: 'medium',
                connections: [],
                attachments: [],
                notes: stored.description || '',
                createdAt: stored.createdAt || new Date(),
                updatedAt: stored.updatedAt || new Date(),
                isFavorite: false
            }]);
            return;
        }

        // fallback: localStorage
        try {
            const saved = localStorage.getItem(`ideas_${ideaId}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                setIdeas(parsed.map((idea: any) => ({
                    ...idea,
                    createdAt: new Date(idea.createdAt),
                    updatedAt: new Date(idea.updatedAt)
                })));
                return;
            }
        } catch (err) {
            Logger.error('IDEA_VIEW', 'Failed to sync ideas from localStorage', { err });
        }

        // otherwise keep existing state (mock)
    }, [structures, currentEditor, ideaId]);

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

    // 🔥 되돌리기/다시하기 기능
    const [undoStack, setUndoStack] = useState<IdeaItem[][]>([]);
    const [redoStack, setRedoStack] = useState<IdeaItem[][]>([]);
    const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStage, setSelectedStage] = useState<string>('all');
    const [editingIdea, setEditingIdea] = useState<IdeaItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [quickCaptureText, setQuickCaptureText] = useState('');
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

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

    // 🔥 통계 계산
    const stats = useMemo(() => {
        return {
            total: ideas.length,
            favorites: ideas.filter(i => i.isFavorite).length,
            applied: ideas.filter(i => i.stage === 'applied').length,
            highPriority: ideas.filter(i => i.priority === 'high').length
        };
    }, [ideas]);

    // 🔥 되돌리기/다시하기 함수들
    const saveToUndoStack = useCallback((currentIdeas: IdeaItem[]) => {
        setUndoStack(prev => [...prev.slice(-19), currentIdeas]); // 최대 20개 상태만 유지
        setRedoStack([]); // 새 동작 시 redo 스택 초기화
    }, []);

    // 🔥 빠른 캡처
    const handleQuickCapture = useCallback(() => {
        if (!quickCaptureText.trim()) return;

        saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장

        const newIdea: IdeaItem = {
            id: Date.now().toString(),
            title: quickCaptureText.slice(0, 50) + (quickCaptureText.length > 50 ? '...' : ''),
            content: quickCaptureText,
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
        };

        updateIdeas(prev => [newIdea, ...prev]);
        setQuickCaptureText('');
    }, [quickCaptureText, ideas, saveToUndoStack, updateIdeas]);

    // 🔥 아이디어 저장
    const saveIdea = useCallback(() => {
        if (!editingIdea) return;

        saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장

        if (showAddModal) {
            const newIdea = {
                ...editingIdea,
                id: Date.now().toString(),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            updateIdeas(prev => [newIdea, ...prev]);
        } else {
            updateIdeas(prev => prev.map(i => i.id === editingIdea.id ? { ...editingIdea, updatedAt: new Date() } : i));
        }

        setEditingIdea(null);
        setShowAddModal(false);
    }, [editingIdea, showAddModal, ideas, saveToUndoStack, updateIdeas]);

    // 🔥 아이디어 삭제
    const deleteIdea = useCallback((id: string) => {
        if (window.confirm('정말로 이 아이디어를 삭제하시겠습니까?')) {
            saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
            updateIdeas(prev => prev.filter(i => i.id !== id));
        }
    }, [ideas, saveToUndoStack, updateIdeas]);

    // 🔥 즐겨찾기 토글
    const toggleFavorite = useCallback((id: string) => {
        saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
        updateIdeas(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
    }, [ideas, saveToUndoStack, updateIdeas]);

    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;

        const previousState = undoStack[undoStack.length - 1];
        if (!previousState) return;

        setRedoStack(prev => [...prev, ideas]);
        updateIdeas(previousState);
        setUndoStack(prev => prev.slice(0, -1));
    }, [ideas, undoStack, updateIdeas]);

    const handleRedo = useCallback(() => {
        if (redoStack.length === 0) return;

        const nextState = redoStack[redoStack.length - 1];
        if (!nextState) return;

        setUndoStack(prev => [...prev, ideas]);
        updateIdeas(nextState);
        setRedoStack(prev => prev.slice(0, -1));
    }, [ideas, redoStack, updateIdeas]);

    // 🔥 단축키 처리
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

        if (isMac) {
            // Mac: Cmd+Z (Undo), Cmd+Shift+Z (Redo)
            if (e.metaKey && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        } else {
            // Windows/Linux: Ctrl+Z (Undo), Ctrl+Y (Redo)
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                handleRedo();
            }
        }
    }, [handleUndo, handleRedo]);

    // 🔥 단축키 이벤트 리스너 등록
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // 🔥 새 아이디어 추가
    const handleAddNewIdea = useCallback(() => {
        const newIdea: IdeaItem = {
            id: Date.now().toString(),
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
        };

        setEditingIdea(newIdea);
        setShowAddModal(true);
    }, []);

    // 🔥 드래그 앤 드롭 핸들러
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

        saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장

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
    }, [draggedItemId, ideas, saveToUndoStack, updateIdeas]);

    return (
        <div className={IDEA_STYLES.container}>
            {/* 🔥 헤더 */}
            <div className={IDEA_STYLES.header}>
                <div className={IDEA_STYLES.headerTop}>
                    <button onClick={onBack} className={IDEA_STYLES.backButton}>
                        <ChevronLeft size={20} />
                        <span>구조로 돌아가기</span>
                    </button>

                    <h1 className={IDEA_STYLES.title}>아이디어 관리</h1>

                    <div className={IDEA_STYLES.headerActions}>
                        <div className="flex gap-2 mr-3">
                            <button
                                onClick={handleUndo}
                                disabled={undoStack.length === 0}
                                className={`${IDEA_STYLES.button} ${undoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="되돌리기 (Ctrl+Z / Cmd+Z)"
                            >
                                <Undo2 size={16} />
                            </button>
                            <button
                                onClick={handleRedo}
                                disabled={redoStack.length === 0}
                                className={`${IDEA_STYLES.button} ${redoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="다시하기 (Ctrl+Y / Cmd+Shift+Z)"
                            >
                                <Redo2 size={16} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddNewIdea}
                            className={`${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`}
                        >
                            <Plus size={16} className="mr-1" />
                            새 아이디어
                        </button>
                    </div>
                </div>

                {/* 🔥 빠른 캡처 */}
                <div className={IDEA_STYLES.quickCapture}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={quickCaptureText}
                            onChange={(e) => setQuickCaptureText(e.target.value)}
                            placeholder="💡 떠오른 아이디어를 빠르게 메모하세요... (Enter로 저장)"
                            className={IDEA_STYLES.captureInput}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleQuickCapture();
                                }
                            }}
                        />
                        <button
                            onClick={handleQuickCapture}
                            disabled={!quickCaptureText.trim()}
                            className={IDEA_STYLES.captureButton}
                        >
                            저장
                        </button>
                    </div>
                </div>

                {/* 🔥 툴바 */}
                <div className={IDEA_STYLES.toolbar}>
                    <div className={IDEA_STYLES.toolbarLeft}>
                        <div className={IDEA_STYLES.searchContainer}>
                            <Search size={16} className={IDEA_STYLES.searchIcon} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="아이디어 검색..."
                                className={IDEA_STYLES.searchInput}
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={IDEA_STYLES.filterButton}
                        >
                            <option value="all">모든 카테고리</option>
                            {Object.entries(CATEGORY_STYLES).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStage}
                            onChange={(e) => setSelectedStage(e.target.value)}
                            className={IDEA_STYLES.filterButton}
                        >
                            <option value="all">모든 단계</option>
                            {Object.entries(STAGE_STYLES).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={IDEA_STYLES.toolbarRight}>
                        <div className={IDEA_STYLES.viewToggle}>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`${IDEA_STYLES.viewButton} ${viewMode === 'cards' ? IDEA_STYLES.viewButtonActive : IDEA_STYLES.viewButtonInactive
                                    }`}
                            >
                                <Grid3x3 size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`${IDEA_STYLES.viewButton} ${viewMode === 'list' ? IDEA_STYLES.viewButtonActive : IDEA_STYLES.viewButtonInactive
                                    }`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 메인 컨텐츠 */}
            <div className={IDEA_STYLES.content}>
                <div className={IDEA_STYLES.scrollArea}>
                    {/* 🔥 통계 */}
                    <div className={IDEA_STYLES.statsGrid}>
                        <div className={IDEA_STYLES.statCard}>
                            <Lightbulb className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>{stats.total}</div>
                            <div className={IDEA_STYLES.statLabel}>총 아이디어</div>
                        </div>
                        <div className={IDEA_STYLES.statCard}>
                            <Star className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>{stats.favorites}</div>
                            <div className={IDEA_STYLES.statLabel}>즐겨찾기</div>
                        </div>
                        <div className={IDEA_STYLES.statCard}>
                            <ArrowUpRight className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>{stats.applied}</div>
                            <div className={IDEA_STYLES.statLabel}>적용됨</div>
                        </div>
                        <div className={IDEA_STYLES.statCard}>
                            <TrendingUp className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>{stats.highPriority}</div>
                            <div className={IDEA_STYLES.statLabel}>높은 우선순위</div>
                        </div>
                    </div>

                    {/* 🔥 아이디어 목록 */}
                    {filteredIdeas.length === 0 ? (
                        <div className={IDEA_STYLES.emptyState}>
                            <Lightbulb className={IDEA_STYLES.emptyIcon} />
                            <h3 className={IDEA_STYLES.emptyTitle}>아이디어가 없습니다</h3>
                            <p className={IDEA_STYLES.emptyDescription}>
                                위의 빠른 캡처를 사용하여 첫 번째 아이디어를 추가해보세요!
                            </p>
                        </div>
                    ) : viewMode === 'cards' ? (
                        <div className={IDEA_STYLES.cardsContainer}>
                            {filteredIdeas.map((idea) => {
                                const CategoryIcon = CATEGORY_STYLES[idea.category].icon;

                                // 🔥 편집 핸들러들 (Hook 제거)
                                const handleIdeaClick = () => {
                                    setEditingIdea(idea);
                                    Logger.info('IDEA_VIEW', '클릭으로 편집 모드 활성화', { title: idea.title });
                                };

                                const handleIdeaDoubleClick = () => {
                                    setEditingIdea(idea);
                                    Logger.info('IDEA_VIEW', '더블클릭으로 편집 모드', { title: idea.title });
                                };

                                return (
                                    <div
                                        key={idea.id}
                                        className={`${IDEA_STYLES.ideaCard} ${draggedItemId === idea.id ? 'opacity-50' : ''
                                            } ${dragOverItemId === idea.id ? 'ring-2 ring-blue-500' : ''
                                            } select-none cursor-pointer`}
                                        style={{ userSelect: 'none' }}
                                        draggable={false}
                                        onClick={handleIdeaClick}
                                        onDoubleClick={handleIdeaDoubleClick}
                                    // 드래그 기능 일시적으로 비활성화
                                    // onDragStart={(e) => handleDragStart(e, idea.id)}
                                    // onDragOver={(e) => handleDragOver(e, idea.id)}
                                    // onDragLeave={handleDragLeave}
                                    // onDrop={(e) => handleDrop(e, idea.id)}
                                    >
                                        <div className={IDEA_STYLES.cardHeader}>
                                            <h3 className={IDEA_STYLES.cardTitle}>{idea.title}</h3>
                                            <div className={IDEA_STYLES.cardActions}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(idea.id);
                                                    }}
                                                    className={IDEA_STYLES.actionButton}
                                                >
                                                    <Star
                                                        size={14}
                                                        className={idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}
                                                    />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        deleteIdea(idea.id);
                                                    }}
                                                    className={IDEA_STYLES.actionButton}
                                                    title="삭제"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className={IDEA_STYLES.cardContent}>{idea.content}</p>

                                        <div className={IDEA_STYLES.cardFooter}>
                                            <div className={IDEA_STYLES.cardMeta}>
                                                <span className={`${IDEA_STYLES.badge} ${CATEGORY_STYLES[idea.category].color}`}>
                                                    <CategoryIcon size={12} />
                                                    {CATEGORY_STYLES[idea.category].label}
                                                </span>
                                                <span className={`${IDEA_STYLES.badge} ${STAGE_STYLES[idea.stage].color}`}>
                                                    {STAGE_STYLES[idea.stage].label}
                                                </span>
                                            </div>

                                            {idea.tags.length > 0 && (
                                                <div className={IDEA_STYLES.cardTags}>
                                                    {idea.tags.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className={IDEA_STYLES.tag}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {idea.tags.length > 3 && (
                                                        <span className={IDEA_STYLES.tag}>+{idea.tags.length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={IDEA_STYLES.listContainer}>
                            {filteredIdeas.map((idea) => {
                                const CategoryIcon = CATEGORY_STYLES[idea.category].icon;

                                return (
                                    <div
                                        key={idea.id}
                                        className={IDEA_STYLES.listItem}
                                        onClick={() => setEditingIdea(idea)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {idea.title}
                                                    </h3>
                                                    <span className={`${IDEA_STYLES.badge} ${CATEGORY_STYLES[idea.category].color}`}>
                                                        <CategoryIcon size={12} />
                                                        {CATEGORY_STYLES[idea.category].label}
                                                    </span>
                                                    <span className={`${IDEA_STYLES.badge} ${STAGE_STYLES[idea.stage].color}`}>
                                                        {STAGE_STYLES[idea.stage].label}
                                                    </span>
                                                    {idea.isFavorite && (
                                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                                    {idea.content}
                                                </p>
                                                {idea.tags.length > 0 && (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {idea.tags.map((tag, index) => (
                                                            <span key={index} className={IDEA_STYLES.tag}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(idea.id);
                                                    }}
                                                    className={IDEA_STYLES.actionButton}
                                                >
                                                    <Star size={14} className={idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteIdea(idea.id);
                                                    }}
                                                    className={IDEA_STYLES.actionButton}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 🔥 편집 모달 */}
            {(editingIdea || showAddModal) && (
                <div className={IDEA_STYLES.modal}>
                    <div className={IDEA_STYLES.modalContent}>
                        <div className={IDEA_STYLES.modalHeader}>
                            <h2 className={IDEA_STYLES.modalTitle}>
                                {showAddModal ? '새 아이디어' : '아이디어 편집'}
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingIdea(null);
                                    setShowAddModal(false);
                                }}
                                className={IDEA_STYLES.actionButton}
                            >
                                <XIcon size={18} />
                            </button>
                        </div>

                        <div className={IDEA_STYLES.modalBody}>
                            <div className={IDEA_STYLES.formGroup}>
                                <label className={IDEA_STYLES.label}>제목</label>
                                <input
                                    type="text"
                                    value={editingIdea?.title || ''}
                                    onChange={(e) => setEditingIdea(prev => prev ? { ...prev, title: e.target.value } : null)}
                                    className={IDEA_STYLES.input}
                                    placeholder="아이디어 제목"
                                />
                            </div>

                            <div className={IDEA_STYLES.formGroup}>
                                <label className={IDEA_STYLES.label}>내용</label>
                                <textarea
                                    value={editingIdea?.content || ''}
                                    onChange={(e) => setEditingIdea(prev => prev ? { ...prev, content: e.target.value } : null)}
                                    className={IDEA_STYLES.textarea}
                                    rows={4}
                                    placeholder="아이디어의 상세한 설명을 입력하세요..."
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className={IDEA_STYLES.formGroup}>
                                    <label className={IDEA_STYLES.label}>카테고리</label>
                                    <select
                                        value={editingIdea?.category || 'other'}
                                        onChange={(e) => setEditingIdea(prev => prev ? { ...prev, category: e.target.value as IdeaItem['category'] } : null)}
                                        className={IDEA_STYLES.select}
                                    >
                                        {Object.entries(CATEGORY_STYLES).map(([key, value]) => (
                                            <option key={key} value={key}>{value.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={IDEA_STYLES.formGroup}>
                                    <label className={IDEA_STYLES.label}>개발 단계</label>
                                    <select
                                        value={editingIdea?.stage || 'initial'}
                                        onChange={(e) => setEditingIdea(prev => prev ? { ...prev, stage: e.target.value as IdeaItem['stage'] } : null)}
                                        className={IDEA_STYLES.select}
                                    >
                                        {Object.entries(STAGE_STYLES).map(([key, value]) => (
                                            <option key={key} value={key}>{value.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={IDEA_STYLES.formGroup}>
                                    <label className={IDEA_STYLES.label}>우선순위</label>
                                    <select
                                        value={editingIdea?.priority || 'medium'}
                                        onChange={(e) => setEditingIdea(prev => prev ? { ...prev, priority: e.target.value as IdeaItem['priority'] } : null)}
                                        className={IDEA_STYLES.select}
                                    >
                                        <option value="low">낮음</option>
                                        <option value="medium">보통</option>
                                        <option value="high">높음</option>
                                    </select>
                                </div>
                            </div>

                            <div className={IDEA_STYLES.formGroup}>
                                <label className={IDEA_STYLES.label}>태그 (쉼표로 구분)</label>
                                <input
                                    type="text"
                                    value={editingIdea?.tags.join(', ') || ''}
                                    onChange={(e) => setEditingIdea(prev => prev ? { ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : null)}
                                    className={IDEA_STYLES.input}
                                    placeholder="예: 판타지, 마법, 모험"
                                />
                            </div>

                            <div className={IDEA_STYLES.formGroup}>
                                <label className={IDEA_STYLES.label}>메모</label>
                                <textarea
                                    value={editingIdea?.notes || ''}
                                    onChange={(e) => setEditingIdea(prev => prev ? { ...prev, notes: e.target.value } : null)}
                                    className={IDEA_STYLES.textarea}
                                    rows={3}
                                    placeholder="추가 메모나 영감의 출처를 기록하세요..."
                                />
                            </div>
                        </div>

                        <div className={IDEA_STYLES.modalFooter}>
                            <button
                                onClick={() => {
                                    setEditingIdea(null);
                                    setShowAddModal(false);
                                }}
                                className={`${IDEA_STYLES.button} ${IDEA_STYLES.secondaryButton}`}
                            >
                                취소
                            </button>
                            <button
                                onClick={saveIdea}
                                className={`${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
