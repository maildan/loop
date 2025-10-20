'use client';

// 🔥 기가차드 스토리 구조 뷰 - 작가 친화적 개선

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { ProjectStructure } from '../../../../shared/types';
import { useStructureStore } from '../../../stores/useStructureStore';
import { useProjectData } from '../hooks/useProjectData'; // 🔥 프로젝트 데이터 가져오기
import { Logger } from '../../../../shared/logger'; // 🔥 Logger import 추가
import { ConfirmDialog } from '../components/ConfirmDialog'; // 🔥 삭제 확인 다이얼로그 추가
import {
  FileText,
  Hash,
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Target,
  Clock,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface StructureViewProps {
  projectId: string; // 🔥 projectId 필수로 변경
  onNavigateToChapterEdit?: (chapterId: string) => void;
  onNavigateToSynopsisEdit?: (synopsisId: string) => void;
  onNavigateToIdeaEdit?: (ideaId: string) => void;
  onNavigateToNotesView?: () => void; // 🔥 NEW: 노트 뷰로 이동 핸들러
  onAddNewChapter?: () => void; // 🔥 NEW: 새 장 추가 핸들러
}


// 🔥 기가차드 작가 친화적 구조 스타일
const STRUCTURE_STYLES = {
  container: 'max-w-screen-xl mx-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',

  // 🔥 개선된 헤더
  header: 'p-6 bg-card/90 supports-[backdrop-filter]:bg-card/75 backdrop-blur-md border-b border-[hsl(var(--border))]/60',
  headerTop: 'flex items-center justify-between mb-4',
  title: 'text-2xl font-bold text-[hsl(var(--foreground))]',
  subtitle: 'text-sm text-muted-foreground leading-relaxed',

  // 🔥 통계 요약
  statsGrid: 'grid grid-cols-3 gap-4 mt-4',
  statCard: 'p-3 bg-card border border-border rounded-lg shadow-sm',
  statIcon: 'w-5 h-5 text-[hsl(var(--accent-primary))] mb-2',
  statValue: 'text-lg font-semibold text-[hsl(var(--foreground))]',
  statLabel: 'text-xs text-muted-foreground',

  // 🔥 메인 콘텐츠 - 스크롤 영역 개선
  content: 'flex-1 flex flex-col min-h-0',
  scrollArea: 'flex-1 overflow-y-auto overflow-x-visible',
  contentPadding: 'p-6',

  // 🔥 개선된 구조 아이템
  structureList: 'space-y-3 pb-4',
  structureItem: 'group relative flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-md hover:border-[hsl(var(--accent))]/60 hover:bg-[hsl(var(--accent))]/10 transition-all duration-200 cursor-pointer',
  itemDragHandle: 'opacity-0 group-hover:opacity-100 w-5 h-5 text-muted-foreground/70 cursor-grab active:cursor-grabbing transition-opacity',
  itemIcon: 'w-6 h-6 text-[hsl(var(--accent-primary))] flex-shrink-0',
  itemContent: 'flex-1 min-w-0',
  itemTitle: 'font-semibold text-[hsl(var(--foreground))] truncate',
  itemMeta: 'flex items-center gap-4 mt-1',
  itemType: 'text-xs px-2 py-1 bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent-primary))] rounded-full font-medium',
  itemStats: 'text-xs text-muted-foreground',
  itemActions: 'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
  actionButton: 'p-2 rounded-lg text-muted-foreground hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]/10 transition-colors',

  // 🔥 개선된 추가 메뉴 - 크기 더 축소
  addMenuContainer: 'relative',
  addButton: 'flex items-center justify-center gap-1.5 w-full p-2 border-2 border-dashed border-border text-muted-foreground rounded-md hover:border-[hsl(var(--accent-primary))] hover:text-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent))]/10 transition-all duration-200 group',
  addIcon: 'w-3.5 h-3.5 group-hover:scale-110 transition-transform',
  addText: 'text-xs font-medium',
  addMenu: 'absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-xl z-50 overflow-visible max-h-96 overflow-y-auto',
  addMenuItem: 'flex items-center gap-2 px-2.5 py-1.5 hover:bg-[hsl(var(--accent))]/10 cursor-pointer transition-colors',
  addMenuIcon: 'w-3.5 h-3.5 text-muted-foreground',
  addMenuText: 'text-xs font-medium text-[hsl(var(--foreground))]',
  addMenuDesc: 'text-xs text-muted-foreground',

  // 🔥 편집 모드
  editInput: 'w-full px-3 py-2 border-2 border-[hsl(var(--accent-primary))] rounded-lg text-sm font-semibold text-[hsl(var(--foreground))] bg-card focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/60',

  // 🔥 빈 상태
  emptyState: 'flex flex-col items-center justify-center h-64 text-center',
  emptyIcon: 'w-16 h-16 text-muted-foreground mb-4',
  emptyTitle: 'text-xl font-semibold text-[hsl(var(--foreground))] mb-2',
  emptyDescription: 'text-muted-foreground max-w-md mx-auto leading-relaxed',
} as const;

// 타입별 아이콘 매핑 (main 타입 제거)
const TYPE_ICONS = {
  chapter: Hash,
  synopsis: FileText,
  idea: Bookmark,
} as const;

// 추가 메뉴 아이템 (main 타입 제거 - 실제 프로젝트 main content 사용)
const ADD_MENU_ITEMS = [
  { type: 'chapter', label: '새 장', icon: Hash, description: '스토리의 주요 단위' },
  { type: 'synopsis', label: '시놉시스', icon: FileText, description: '이야기 개요' },
  { type: 'idea', label: '노트', icon: Bookmark, description: '창작 노트 및 메모' },
] as const;

// 🔥 빈 배열 상수 - 참조 안정성 보장
const EMPTY_STRUCTURES: ProjectStructure[] = [];

const StructureView = memo(function StructureView({
  projectId,
  onNavigateToChapterEdit,
  onNavigateToSynopsisEdit,
  onNavigateToIdeaEdit,
  onNavigateToNotesView,
  onAddNewChapter
}: StructureViewProps): React.ReactElement {
  // 🔥 프로젝트 데이터 가져오기 (메인 스토리 컨텐츠 포함)
  const {
    content: mainContent,
    title: projectTitle,
    writerStats,
    isLoading: projectDataLoading
  } = useProjectData(projectId);

  // 🔥 Zustand 스토어 사용 - 참조 안정성을 위한 최적화
  const structures = useStructureStore((state) => {
    const projectStructures = state.structures[projectId];
    return projectStructures || EMPTY_STRUCTURES;
  });

  // 🔥 프로젝트 데이터 가져오기 (메인 컨텐츠용)
  const projectData = useProjectData(projectId);

  const addStructureItem = useStructureStore((state) => state.addStructureItem);
  const updateStructureItem = useStructureStore((state) => state.updateStructureItem);
  const deleteStructureItem = useStructureStore((state) => state.deleteStructureItem);
  const setCurrentEditor = useStructureStore((state) => state.setCurrentEditor);

  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false); // 🔥 삭제 확인 다이얼로그
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null); // 🔥 삭제할 아이템 정보
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🔥 폴더 접기/펼치기 상태 관리 - localStorage 지원
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(() => {
    // localStorage에서 상태 복원
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`structureView_collapsed_${projectId}`);
        if (saved) {
          return new Set(JSON.parse(saved));
        }
      } catch (error) {
        Logger.warn('STRUCTURE_VIEW', 'Failed to load collapsed state from localStorage', error);
      }
    }
    return new Set();
  });

  // 🔥 강제 리렌더링을 위한 상태
  const [, forceUpdate] = useState({});
  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  // 🔥 폴더 토글 함수 - localStorage 저장 포함
  const toggleFolder = useCallback((folderType: string) => {
    setCollapsedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderType)) {
        newSet.delete(folderType);
      } else {
        newSet.add(folderType);
      }

      // localStorage에 저장
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`structureView_collapsed_${projectId}`, JSON.stringify([...newSet]));
        } catch (error) {
          Logger.warn('STRUCTURE_VIEW', 'Failed to save collapsed state to localStorage', error);
        }
      }

      Logger.debug('STRUCTURE_VIEW', 'Folder toggled', { folderType, collapsed: newSet.has(folderType) });
      return newSet;
    });
  }, [projectId]);

  // 🔥 폴더별 데이터 그룹화 (main 타입 제거, idea → note 변경)
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

  // 🔥 스토어 동기화 디버깅
  useEffect(() => {
    Logger.debug('STRUCTURE_VIEW', 'Structures updated', {
      projectId,
      structuresCount: structures.length,
      structures: structures.map(s => ({ id: s.id, title: s.title, type: s.type }))
    });
  }, [structures, projectId]);

  // 🔥 스토어 구독으로 실시간 업데이트 보장
  useEffect(() => {
    const unsubscribe = useStructureStore.subscribe((state) => {
      const currentStructures = state.structures[projectId] || [];
      if (currentStructures !== structures) {
        triggerUpdate();
      }
    });

    return unsubscribe;
  }, [projectId, structures, triggerUpdate]);

  const handleAddItem = useCallback(async (type: 'chapter' | 'synopsis' | 'idea'): Promise<void> => {
    Logger.info('STRUCTURE_VIEW', 'Adding new item', { type, projectId });

    // 🔥 NEW: chapter 타입일 때는 모달을 통해 처리
    if (type === 'chapter' && onAddNewChapter) {
      Logger.info('STRUCTURE_VIEW', 'Using chapter modal');
      onAddNewChapter();
      setShowAddMenu(false);
      return;
    }

    // 기존 synopsis, idea 처리 로직  
    const defaultTitles = {
      chapter: `새로운 챕터`, // 이 부분은 사용되지 않음 (모달 통해 처리)
      synopsis: `새로운 시놉시스`,
      idea: `새로운 아이디어`
    };

    // 🔥 chapter 타입의 경우 올바른 번호 계산
    let itemTitle = defaultTitles[type];
    if (type === 'chapter') {
      const chapterStructures = structures.filter(item => item.type === 'chapter');
      const chapterCount = chapterStructures.length + 1;
      itemTitle = `${chapterCount}챕터`;
    }

    Logger.info('STRUCTURE_VIEW', 'Creating new item', { type, title: itemTitle });

    const newItem: ProjectStructure = {
      id: `${type}_${Date.now()}`,
      title: itemTitle,
      description: '',
      type: type as any, // 🔥 임시 타입 캐스팅
      status: 'draft',
      wordCount: 0,
      sortOrder: structures.length,
      depth: 0,
      color: '#6366f1',
      isActive: true,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      setIsLoading(true);
      // 🔥 Zustand 스토어에 추가 (비동기)
      await addStructureItem(projectId, newItem);
      Logger.info('STRUCTURE_VIEW', 'Item added successfully', { id: newItem.id, type, title: itemTitle });

      // 🔥 에디터 상태 업데이트 - main은 별도로 처리
      setCurrentEditor({
        projectId,
        editorType: type as any, // 🔥 main을 main으로 유지
        itemId: newItem.id,
        itemTitle: newItem.title
      });

      setShowAddMenu(false);

      // 🔥 해당 타입의 에디터로 이동
      if (type === 'idea') {
        // 아이디어는 notes 뷰로 이동
        onNavigateToNotesView?.();
        Logger.info('STRUCTURE_VIEW', 'Navigating to notes view', { ideaId: newItem.id });
      } else if (type === 'synopsis') {
        onNavigateToSynopsisEdit?.(newItem.id);
      } else if (type === 'chapter') {
        onNavigateToChapterEdit?.(newItem.id); // 챕터는 챕터 에디터로
      }

      // 강제 리렌더링
      triggerUpdate();
    } catch (error) {
      Logger.error('STRUCTURE_VIEW', 'Failed to add structure item', { type, error });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, structures, addStructureItem, setCurrentEditor, onAddNewChapter, onNavigateToIdeaEdit, onNavigateToNotesView, onNavigateToSynopsisEdit, triggerUpdate]);

  const handleItemClick = useCallback((item: ProjectStructure): void => {
    // 🔥 에디터 상태 업데이트
    setCurrentEditor({
      projectId,
      editorType: ((item.type as any) === 'main' ? 'synopsis' : item.type) as any,
      itemId: item.id,
      itemTitle: item.title
    });

    if (item.type === 'chapter') {
      onNavigateToChapterEdit?.(item.id);
    } else if (item.type === 'idea') {
      // 🔥 아이디어는 NotesView로 이동
      onNavigateToNotesView?.();
      Logger.info('STRUCTURE_VIEW', 'Navigating to notes view from idea click', { ideaId: item.id });
    } else if (item.type === 'synopsis' || (item.type as any) === 'main') {
      onNavigateToSynopsisEdit?.(item.id);
    }
  }, [projectId, setCurrentEditor, onNavigateToChapterEdit, onNavigateToIdeaEdit, onNavigateToNotesView, onNavigateToSynopsisEdit]);

  const handleEditStart = useCallback((item: ProjectStructure): void => {
    setEditingId(item.id);
    setEditTitle(item.title);
  }, []);

  const handleEditSave = useCallback((id: string): void => {
    if (editTitle.trim()) {
      // 🔥 Zustand 스토어에서 업데이트
      updateStructureItem(projectId, id, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle('');
  }, [projectId, editTitle, updateStructureItem]);

  const handleEditCancel = useCallback((): void => {
    setEditingId(null);
    setEditTitle('');
  }, []);

  const handleDelete = useCallback((id: string): void => {
    // 🔥 삭제할 아이템 정보 찾기
    const itemToDeleteInfo = structures.find(structure => structure.id === id);
    if (itemToDeleteInfo) {
      setItemToDelete({
        id: itemToDeleteInfo.id,
        title: itemToDeleteInfo.title
      });
      setShowDeleteDialog(true);
    }
  }, [structures]);

  // 🔥 삭제 확인 핸들러
  const handleConfirmDelete = useCallback(async (): Promise<void> => {
    if (!itemToDelete) return;

    try {
      setIsLoading(true);
      // 🔥 Zustand 스토어에서 삭제 (DB 삭제 포함)
      await deleteStructureItem(projectId, itemToDelete.id);

      // 🔥 삭제 성공 시 추가 정리 작업
      Logger.info('STRUCTURE_VIEW', 'Structure item deleted successfully', {
        id: itemToDelete.id,
        title: itemToDelete.title,
        projectId
      });

      // 편집 상태 초기화
      if (editingId === itemToDelete.id) {
        setEditingId(null);
        setEditTitle('');
      }

      // 다이얼로그 상태 초기화
      setShowDeleteDialog(false);
      setItemToDelete(null);

      // 강제 리렌더링
      triggerUpdate();
    } catch (error) {
      Logger.error('STRUCTURE_VIEW', 'Failed to delete structure item', {
        id: itemToDelete.id,
        title: itemToDelete.title,
        projectId,
        error
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, deleteStructureItem, editingId, itemToDelete, triggerUpdate]);

  // 🔥 삭제 취소 핸들러
  const handleCancelDelete = useCallback((): void => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, id: string): void => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  }, [handleEditSave, handleEditCancel]);

  // 🔥 폴더 헤더 렌더링 함수
  const renderFolderHeader = useCallback((
    folderType: string,
    title: string,
    icon: React.ComponentType<any>,
    count: number
  ) => {
    const isCollapsed = collapsedFolders.has(folderType);
    const IconComponent = icon;

    return (
      <div
        className="flex items-center justify-between p-3 mb-2 bg-card border border-border rounded-lg cursor-pointer hover:bg-[hsl(var(--accent))]/10 transition-colors"
        onClick={() => toggleFolder(folderType)}
      >
        <div className="flex items-center gap-3">
          <div className={`transform transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <IconComponent className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
          <span className="font-medium text-[hsl(var(--foreground))]">{title}</span>
          <span className="text-xs px-2 py-1 bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent-primary))] rounded-full">
            {count}
          </span>
        </div>
      </div>
    );
  }, [collapsedFolders, toggleFolder]);

  return (
    <div className={STRUCTURE_STYLES.container}>
      {/* 헤더 */}
      <div className={STRUCTURE_STYLES.header}>
        <h2 className={STRUCTURE_STYLES.title}>스토리 구조</h2>
        <p className={STRUCTURE_STYLES.subtitle}>
          장, 장면, 메모를 관리하여 이야기의 흐름을 구성하세요
        </p>
      </div>

      {/* 구조 목록 */}
      <div className={STRUCTURE_STYLES.content}>
        <div className={STRUCTURE_STYLES.structureList}>
          {isLoading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">로딩중...</div>
          ) : structures.length === 0 ? (
            /* 🔥 빈 상태 */
            <div className={STRUCTURE_STYLES.emptyState}>
              <Target className={STRUCTURE_STYLES.emptyIcon} />
              <h3 className={STRUCTURE_STYLES.emptyTitle}>스토리 구조가 비어있습니다</h3>
              <p className={STRUCTURE_STYLES.emptyDescription}>
                새로운 챕터, 시놉시스, 아이디어를 추가하여 스토리 구조를 구성해보세요.
              </p>
            </div>
          ) : (
            /* 🔥 폴더형 구조 목록 */
            <div className="space-y-4">
              {/* 🔥 Phase 0: main 폴더 제거 - Empty State Pattern으로 전환 */}
              {/* 
              <div>
                {renderFolderHeader('main', '메인 스토리', BookOpen, 1)}
                {!collapsedFolders.has('main') && (
                  <div className="ml-6 space-y-2">
                    {projectDataLoading ? (
                      <div className={`${STRUCTURE_STYLES.structureItem} opacity-50`}>
                        <BookOpen className={STRUCTURE_STYLES.itemIcon} />
                        <div className={STRUCTURE_STYLES.itemContent}>
                          <div className={STRUCTURE_STYLES.itemTitle}>로딩 중...</div>
                          <div className={STRUCTURE_STYLES.itemType}>프로젝트 데이터를 불러오는 중</div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={STRUCTURE_STYLES.structureItem}
                        onClick={() => {
                          // 메인 스토리 클릭 시 write 뷰로 이동
                          Logger.info('STRUCTURE_VIEW', 'Main story clicked', {
                            projectId,
                            hasContent: !!mainContent,
                            wordCount: writerStats?.wordCount || 0
                          });
                          // TODO: Write 뷰로 네비게이션 추가
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <BookOpen className={STRUCTURE_STYLES.itemIcon} />
                        <div className={STRUCTURE_STYLES.itemContent}>
                          <div className={STRUCTURE_STYLES.itemTitle}>
                            {projectTitle || '메인 스토리'}
                          </div>
                          <div className={STRUCTURE_STYLES.itemType}>프로젝트 메인 컨텐츠</div>
                          {mainContent && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {mainContent.substring(0, 100)}
                              {mainContent.length > 100 && '...'}
                            </div>
                          )}
                          {!mainContent && (
                            <div className="text-xs text-muted-foreground italic mt-1">
                              Write 탭에서 메인 스토리를 작성해보세요
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex flex-col items-end">
                          <span>{writerStats?.wordCount || 0} 단어</span>
                          {writerStats?.charCount && (
                            <span className="text-xs text-muted-foreground/70">
                              {writerStats.charCount} 자
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              */}

              {/* 🔥 챕터 폴더 */}
              {groupedStructures.chapters.length > 0 && (
                <div>
                  {renderFolderHeader('chapters', '챕터', Hash, groupedStructures.chapters.length)}
                  {!collapsedFolders.has('chapters') && (
                    <div className="ml-6 space-y-2">
                      {groupedStructures.chapters.map((item, index) => {
                        const isEditing = editingId === item.id;
                        const isConnected = index < groupedStructures.chapters.length - 1;

                        return (
                          <div key={item.id} className="relative">
                            {/* 🔥 연결선 표시 */}
                            {isConnected && (
                              <div className="absolute left-3 top-12 w-0.5 h-8 bg-[hsl(var(--accent-primary))]/50 z-10"></div>
                            )}

                            <div
                              className={STRUCTURE_STYLES.structureItem}
                              onClick={() => handleItemClick(item)}
                              style={{ cursor: 'pointer' }}
                            >
                              <Hash className={STRUCTURE_STYLES.itemIcon} />
                              <div className={STRUCTURE_STYLES.itemContent}>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, item.id)}
                                    onBlur={() => handleEditSave(item.id)}
                                    className={STRUCTURE_STYLES.editInput}
                                    autoFocus
                                  />
                                ) : (
                                  <>
                                    <div className={STRUCTURE_STYLES.itemTitle}>{item.title}</div>
                                    <div className={STRUCTURE_STYLES.itemType}>챕터</div>
                                  </>
                                )}
                              </div>
                              <div className={STRUCTURE_STYLES.itemActions}>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleEditStart(item);
                                  }}
                                  className={STRUCTURE_STYLES.actionButton}
                                  title="편집"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                  }}
                                  className={STRUCTURE_STYLES.actionButton}
                                  title="삭제"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 🔥 시놉시스 폴더 */}
              {groupedStructures.synopsis.length > 0 && (
                <div>
                  {renderFolderHeader('synopsis', '시놉시스', FileText, groupedStructures.synopsis.length)}
                  {!collapsedFolders.has('synopsis') && (
                    <div className="ml-6 space-y-2">
                      {groupedStructures.synopsis.map((item) => {
                        const isEditing = editingId === item.id;

                        return (
                          <div
                            key={item.id}
                            className={STRUCTURE_STYLES.structureItem}
                            onClick={() => handleItemClick(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <FileText className={STRUCTURE_STYLES.itemIcon} />
                            <div className={STRUCTURE_STYLES.itemContent}>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  onKeyDown={(e) => handleKeyPress(e, item.id)}
                                  onBlur={() => handleEditSave(item.id)}
                                  className={STRUCTURE_STYLES.editInput}
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <div className={STRUCTURE_STYLES.itemTitle}>{item.title}</div>
                                  <div className={STRUCTURE_STYLES.itemType}>시놉시스</div>
                                </>
                              )}
                            </div>
                            <div className={STRUCTURE_STYLES.itemActions}>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleEditStart(item);
                                }}
                                className={STRUCTURE_STYLES.actionButton}
                                title="편집"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className={STRUCTURE_STYLES.actionButton}
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 🔥 노트 폴더 */}
              {groupedStructures.notes.length > 0 && (
                <div>
                  {renderFolderHeader('notes', '노트', Bookmark, groupedStructures.notes.length)}
                  {!collapsedFolders.has('notes') && (
                    <div className="ml-6 space-y-2">
                      {groupedStructures.notes.map((item) => {
                        const isEditing = editingId === item.id;

                        return (
                          <div
                            key={item.id}
                            className={STRUCTURE_STYLES.structureItem}
                            onClick={() => handleItemClick(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Bookmark className={STRUCTURE_STYLES.itemIcon} />
                            <div className={STRUCTURE_STYLES.itemContent}>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  onKeyDown={(e) => handleKeyPress(e, item.id)}
                                  onBlur={() => handleEditSave(item.id)}
                                  className={STRUCTURE_STYLES.editInput}
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <div className={STRUCTURE_STYLES.itemTitle}>{item.title}</div>
                                  <div className={STRUCTURE_STYLES.itemType}>노트</div>
                                </>
                              )}
                            </div>
                            <div className={STRUCTURE_STYLES.itemActions}>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleEditStart(item);
                                }}
                                className={STRUCTURE_STYLES.actionButton}
                                title="편집"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className={STRUCTURE_STYLES.actionButton}
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 추가 메뉴 */}
          <div className={STRUCTURE_STYLES.addMenuContainer}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddMenu(!showAddMenu);
              }}
              className={STRUCTURE_STYLES.addButton}
            >
              <Plus className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
              <span>새 항목 추가</span>
              {showAddMenu ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {showAddMenu && (
              <div className={STRUCTURE_STYLES.addMenu}>
                {ADD_MENU_ITEMS.map(({ type, label, icon: Icon, description }) => (
                  <div
                    key={type}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddItem(type);
                    }}
                    className={STRUCTURE_STYLES.addMenuItem}
                  >
                    <Icon className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
                    <div className="flex-1">
                      <div className="font-medium text-[hsl(var(--foreground))]">
                        {label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="구조 항목 삭제"
        message="이 항목을 삭제하시겠습니까?"
        itemName={itemToDelete?.title}
        warning="삭제된 항목은 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
});

export { StructureView };
