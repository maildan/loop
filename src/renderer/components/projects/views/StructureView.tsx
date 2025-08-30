'use client';

// 🔥 기가차드 스토리 구조 뷰 - 작가 친화적 개선

import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { ProjectStructure } from '../../../../shared/types';
import { useStructureStore } from '../../../stores/useStructureStore';
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
  BarChart3
} from 'lucide-react';

interface StructureViewProps {
  projectId: string; // 🔥 projectId 필수로 변경
  onNavigateToChapterEdit?: (chapterId: string) => void;
  onNavigateToSynopsisEdit?: (synopsisId: string) => void;
  onNavigateToIdeaEdit?: (ideaId: string) => void;
  onAddNewChapter?: () => void; // 🔥 NEW: 새 장 추가 핸들러
}

// 🔥 기가차드 작가 친화적 구조 스타일
const STRUCTURE_STYLES = {
  container: 'flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',

  // 🔥 개선된 헤더
  header: 'p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700/50',
  headerTop: 'flex items-center justify-between mb-4',
  title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
  subtitle: 'text-slate-600 dark:text-gray-400 leading-relaxed',

  // 🔥 통계 요약
  statsGrid: 'grid grid-cols-3 gap-4 mt-4',
  statCard: 'p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700',
  statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mb-2',
  statValue: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  statLabel: 'text-xs text-slate-600 dark:text-gray-400',

  // 🔥 메인 콘텐츠 - 스크롤 영역 개선
  content: 'flex-1 flex flex-col min-h-0',
  scrollArea: 'flex-1 overflow-y-auto',
  contentPadding: 'p-6',

  // 🔥 개선된 구조 아이템
  structureList: 'space-y-3 pb-4',
  structureItem: 'group relative flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer',
  itemDragHandle: 'opacity-0 group-hover:opacity-100 w-5 h-5 text-slate-400 dark:text-gray-500 cursor-grab active:cursor-grabbing transition-opacity',
  itemIcon: 'w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0',
  itemContent: 'flex-1 min-w-0',
  itemTitle: 'font-semibold text-gray-900 dark:text-gray-100 truncate',
  itemMeta: 'flex items-center gap-4 mt-1',
  itemType: 'text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium',
  itemStats: 'text-xs text-slate-500 dark:text-gray-400',
  itemActions: 'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
  actionButton: 'p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 transition-colors',

  // 🔥 개선된 추가 메뉴 - 크기 더 축소
  addMenuContainer: 'relative',
  addButton: 'flex items-center justify-center gap-1.5 w-full p-2 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-md text-slate-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 group',
  addIcon: 'w-3.5 h-3.5 group-hover:scale-110 transition-transform',
  addText: 'text-xs font-medium',
  addMenu: 'absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md shadow-lg z-10 overflow-hidden',
  addMenuItem: 'flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer transition-colors',
  addMenuIcon: 'w-3.5 h-3.5 text-slate-600 dark:text-gray-400',
  addMenuText: 'text-xs font-medium text-gray-900 dark:text-gray-100',
  addMenuDesc: 'text-xs text-slate-500 dark:text-gray-400',

  // 🔥 편집 모드
  editInput: 'w-full px-3 py-2 border-2 border-blue-400 rounded-lg text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500',

  // 🔥 빈 상태
  emptyState: 'flex flex-col items-center justify-center h-64 text-center',
  emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
  emptyTitle: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
  emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed',
} as const;

// 타입별 아이콘 매핑
const TYPE_ICONS = {
  chapter: Hash,
  synopsis: FileText,
  idea: Bookmark,
} as const;

// 추가 메뉴 아이템
const ADD_MENU_ITEMS = [
  { type: 'chapter', label: '새 장', icon: Hash, description: '스토리의 주요 단위' },
  { type: 'synopsis', label: '시놉시스', icon: FileText, description: '이야기 개요' },
  { type: 'idea', label: '아이디어', icon: Bookmark, description: '창작 아이디어' },
] as const;

// 🔥 빈 배열 상수 - 참조 안정성 보장
const EMPTY_STRUCTURES: ProjectStructure[] = [];

const StructureView = memo(function StructureView({
  projectId,
  onNavigateToChapterEdit,
  onNavigateToSynopsisEdit,
  onNavigateToIdeaEdit,
  onAddNewChapter
}: StructureViewProps): React.ReactElement {
  // 🔥 Zustand 스토어 사용 - 참조 안정성을 위한 최적화
  const structures = useStructureStore((state) => {
    const projectStructures = state.structures[projectId];
    return projectStructures || EMPTY_STRUCTURES;
  });

  const addStructureItem = useStructureStore((state) => state.addStructureItem);
  const updateStructureItem = useStructureStore((state) => state.updateStructureItem);
  const deleteStructureItem = useStructureStore((state) => state.deleteStructureItem);
  const setCurrentEditor = useStructureStore((state) => state.setCurrentEditor);

  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  const handleAddItem = useCallback((type: 'chapter' | 'synopsis' | 'idea'): void => {
    // 🔥 NEW: chapter 타입일 때는 모달을 통해 처리
    if (type === 'chapter' && onAddNewChapter) {
      onAddNewChapter();
      setShowAddMenu(false);
      return;
    }

    // 기존 synopsis, idea 처리 로직
    const defaultTitles = {
      chapter: `새로운 챕터`,
      synopsis: `새로운 시놉시스`,
      idea: `새로운 아이디어`
    };

    const newItem: ProjectStructure = {
      id: `${type}_${Date.now()}`,
      title: defaultTitles[type],
      description: '',
      type,
      status: 'planning',
      projectId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 🔥 Zustand 스토어에 추가
    addStructureItem(projectId, newItem);

    // 🔥 에디터 상태 업데이트
    setCurrentEditor({
      projectId,
      editorType: type,
      itemId: newItem.id,
      itemTitle: newItem.title
    });

    setShowAddMenu(false);

    // 🔥 해당 타입의 에디터로 이동
    if (type === 'idea') {
      onNavigateToIdeaEdit?.(newItem.id);
    } else if (type === 'synopsis') {
      onNavigateToSynopsisEdit?.(newItem.id);
    }
  }, [projectId, addStructureItem, setCurrentEditor, onAddNewChapter, onNavigateToIdeaEdit, onNavigateToSynopsisEdit]);

  const handleItemClick = useCallback((item: ProjectStructure): void => {
    // 🔥 에디터 상태 업데이트
    setCurrentEditor({
      projectId,
      editorType: item.type as 'chapter' | 'synopsis' | 'idea',
      itemId: item.id,
      itemTitle: item.title
    });

    if (item.type === 'chapter') {
      onNavigateToChapterEdit?.(item.id);
    } else if (item.type === 'idea') {
      onNavigateToIdeaEdit?.(item.id);
    } else if (item.type === 'synopsis') {
      onNavigateToSynopsisEdit?.(item.id);
    }
  }, [projectId, setCurrentEditor, onNavigateToChapterEdit, onNavigateToIdeaEdit, onNavigateToSynopsisEdit]);

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
    // 🔥 Zustand 스토어에서 삭제
    deleteStructureItem(projectId, id);
  }, [projectId, deleteStructureItem]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, id: string): void => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  }, [handleEditSave, handleEditCancel]);

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
          {structures.map((item) => {
            const IconComponent = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] || FileText;
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={STRUCTURE_STYLES.structureItem}
                onClick={() => handleItemClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <IconComponent className={STRUCTURE_STYLES.itemIcon} />
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
                      <div className={STRUCTURE_STYLES.itemType}>
                        {item.type === 'chapter' ? '장' :
                          item.type === 'synopsis' ? '시놉시스' : '아이디어'}
                      </div>
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
              <Plus className="w-5 h-5" />
              <span>새 항목 추가</span>
              {showAddMenu ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
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
    </div>
  );
});

export { StructureView };
