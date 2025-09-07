'use client';

import React, { useState, memo, useCallback } from 'react';
import {
  Edit3,
  FileText,
  Users,
  BookOpen,
  TrendingUp,
  Circle,
  CheckCircle,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Lightbulb,
  Target
} from 'lucide-react';
import { ProjectCharacter, ProjectStructure } from '../../../../shared/types';
import { WriterStats } from '../editor/WriterStats';
import { Logger } from '../../../../shared/logger';
import { useStructureStore } from '../../../stores/useStructureStore'; // 🔥 구조 스토어 추가
import { ConfirmDialog } from './ConfirmDialog'; // 🔥 ConfirmDialog 추가

interface WriterSidebarProps {
  projectId: string; // 🔥 projectId 추가
  currentView: string;
  onViewChange: (view: string) => void;
  structure?: ProjectStructure[]; // 🔥 optional로 변경 (스토어 사용)
  characters: ProjectCharacter[];
  stats: WriterStats;
  collapsed: boolean;
  // 🔥 추가 핸들러
  onAddStructure?: () => void;
  onAddCharacter?: () => void;
  onAddNote?: () => void;
  onEditStructure?: (id: string) => void; // 🔥 구조 편집 핸들러 추가
  onDuplicateStructure?: (id: string, title: string) => void; // 🔥 복제 핸들러 추가
  onDeleteStructure?: (id: string, title: string) => void; // 🔥 삭제 핸들러 추가
}

// 🔥 기가차드 간소화된 사이드바 스타일
const SIDEBAR_STYLES = {
  // 기본 컨테이너 (크기 확장 및 슬라이드 효과 개선)
  container: 'flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out transform',
  // 🔥 크기 확장: 320px → 더 넓게
  collapsed: 'w-12 -translate-x-full opacity-0',
  expanded: 'w-80 translate-x-0 opacity-100',
  // 🔥 높이 계산: ProjectHeader(~60px) + TabBar(~48px) 제외
  height: 'h-[calc(100vh-108px)]',

  // 🔥 얇은 스크롤바 적용 영역
  scrollArea: 'flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar',

  // 🔥 메뉴 섹션 간소화
  menuSection: 'p-3 space-y-1',
  menuItem: 'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md',
  menuItemActive: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  menuItemInactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',

  // 🔥 섹션 헤더 간소화
  sectionHeader: 'text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-3',

  // 🔥 구조 아이템 간소화
  structureList: 'space-y-1 px-3',
  structureItem: 'flex items-center gap-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors',

  // 🔥 통계 영역 간소화
  statsSection: 'p-3 border-t border-gray-200 dark:border-gray-700',
  statItem: 'flex justify-between items-center py-1 text-sm',
  statLabel: 'text-gray-600 dark:text-gray-400',
  statValue: 'font-medium text-gray-900 dark:text-gray-100',
} as const;

// 🔥 메뉴 아이템 정의 (모든 기능 포함)
const MENU_ITEMS = [
  { id: 'write', label: '글쓰기', icon: Edit3 },
  { id: 'structure', label: '구조', icon: FileText },
  { id: 'characters', label: '인물', icon: Users },
  { id: 'notes', label: '메모', icon: BookOpen },
  { id: 'synopsis', label: '시놉시스', icon: Target },
  { id: 'idea', label: '아이디어', icon: Lightbulb },
];

export const WriterSidebar = memo(function WriterSidebar({
  projectId, // 🔥 projectId 추가
  currentView,
  onViewChange,
  structure: propStructure, // 🔥 prop 이름 변경
  characters,
  stats,
  collapsed,
  onAddStructure,
  onAddCharacter,
  onAddNote,
  onEditStructure, // 🔥 구조 편집 핸들러 추가
  onDuplicateStructure, // 🔥 복제 핸들러 추가
  onDeleteStructure // 🔥 삭제 핸들러 추가
}: WriterSidebarProps): React.ReactElement {
  // 🔥 useStructureStore에서 실시간 구조 데이터 가져오기
  const storeStructures = useStructureStore((state) => {
    const projectStructures = state.structures[projectId];
    return projectStructures || [];
  });
  const deleteStructureItem = useStructureStore((state) => state.deleteStructureItem); // 🔥 삭제 함수 추가

  // 🔥 스토어 데이터를 우선 사용, 없으면 prop 사용
  const structure = storeStructures.length > 0 ? storeStructures : (propStructure || []);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['structure']));
  const [structureMenuId, setStructureMenuId] = useState<string | null>(null); // 🔥 구조 메뉴 상태 추가
  const [editingId, setEditingId] = useState<string | null>(null); // 🔥 인라인 편집 상태
  const [editingTitle, setEditingTitle] = useState<string>(''); // 🔥 편집 중인 제목
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false); // 🔥 삭제 확인 다이얼로그
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null); // 🔥 삭제할 아이템 정보
  const [, forceUpdate] = useState({}); // 🔥 강제 리렌더링용 상태

  // 🔥 강제 리렌더링 트리거
  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  // 🔥 구조 데이터 변경 감지 및 로깅
  React.useEffect(() => {
    Logger.debug('WRITER_SIDEBAR', 'Structure data updated', {
      projectId,
      structureCount: structure.length,
      structureIds: structure.map(s => s.id)
    });
  }, [structure, projectId]);

  // 🔥 메뉴 외부 클릭 시 메뉴 닫기
  React.useEffect(() => {
    const handleClickOutside = () => {
      setStructureMenuId(null);
    };

    if (structureMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [structureMenuId]);

  // 🔥 구조 아이템 삭제 핸들러 (StructureView와 동일한 방식)
  const handleDeleteStructure = useCallback((id: string, title: string) => {
    setItemToDelete({ id, title });
    setShowDeleteDialog(true);
    setStructureMenuId(null);
    Logger.info('WRITER_SIDEBAR', 'Delete dialog opened', { id, title });
  }, []);

  // 🔥 삭제 확인 핸들러
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await deleteStructureItem(projectId, itemToDelete.id);
      setShowDeleteDialog(false);
      setItemToDelete(null);
      triggerUpdate();
      Logger.info('WRITER_SIDEBAR', 'Structure item deleted successfully', {
        id: itemToDelete.id,
        title: itemToDelete.title
      });
    } catch (error) {
      Logger.error('WRITER_SIDEBAR', 'Failed to delete structure item', {
        id: itemToDelete.id,
        title: itemToDelete.title,
        error
      });
    }
  }, [itemToDelete, projectId, deleteStructureItem, triggerUpdate]);

  // 🔥 삭제 취소 핸들러
  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  }, []);

  // 🔥 구조 아이템 편집 핸들러
  const handleEditStructure = useCallback((id: string) => {
    setStructureMenuId(null);
    onEditStructure?.(id);
    Logger.info('WRITER_SIDEBAR', 'Structure item edit triggered', { id });
  }, [onEditStructure]);

  // 🔥 인라인 제목 편집 시작
  const handleStartTitleEdit = useCallback((id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
    setStructureMenuId(null);
    Logger.info('WRITER_SIDEBAR', 'Title edit started', { id, currentTitle });
  }, []);

  // 🔥 제목 편집 저장
  const handleSaveTitleEdit = useCallback(async () => {
    if (!editingId || !editingTitle.trim()) return;

    try {
      const updateStructureItem = useStructureStore.getState().updateStructureItem;
      await updateStructureItem(projectId, editingId, { title: editingTitle.trim() });
      setEditingId(null);
      setEditingTitle('');
      triggerUpdate();
      Logger.info('WRITER_SIDEBAR', 'Title updated', { id: editingId, newTitle: editingTitle.trim() });
    } catch (error) {
      Logger.error('WRITER_SIDEBAR', 'Failed to update title', { id: editingId, title: editingTitle, error });
    }
  }, [editingId, editingTitle, projectId, triggerUpdate]);

  // 🔥 제목 편집 취소
  const handleCancelTitleEdit = useCallback(() => {
    setEditingId(null);
    setEditingTitle('');
  }, []);

  // 🔥 챕터 복제 (부모 컴포넌트로 위임)
  const handleDuplicateStructure = useCallback((id: string, title: string) => {
    setStructureMenuId(null);
    onDuplicateStructure?.(id, title);
    Logger.info('WRITER_SIDEBAR', 'Structure item duplication requested', { id, title });
  }, [onDuplicateStructure]);

  const toggleSection = (sectionId: string): void => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // 🔥 축소 모드에서는 아이콘만 표시
  if (collapsed) {
    return (
      <div className={`${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.collapsed}`}>
        <div className={SIDEBAR_STYLES.menuSection}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${currentView === item.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              title={item.label}
            >
              <item.icon size={16} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${SIDEBAR_STYLES.container} ${collapsed ? SIDEBAR_STYLES.collapsed : SIDEBAR_STYLES.expanded} ${SIDEBAR_STYLES.height}`}>
      {/* 🔥 메인 메뉴 */}
      <div className={SIDEBAR_STYLES.menuSection}>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`${SIDEBAR_STYLES.menuItem} ${currentView === item.id ? SIDEBAR_STYLES.menuItemActive : SIDEBAR_STYLES.menuItemInactive
              }`}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 🔥 스크롤 가능한 컨텐츠 영역 - 뷰별 내용 표시 */}
      <div className={SIDEBAR_STYLES.scrollArea}>
        {/* 🔥 현재 뷰에 따른 컨텐츠 표시 */}
        {currentView === 'write' && (
          <>
            {/* 🔥 프로젝트 구조 */}
            <div className="p-3">
              <h3 className={SIDEBAR_STYLES.sectionHeader}>프로젝트 구조</h3>
              <div className={SIDEBAR_STYLES.structureList}>
                {structure.map((item, index) => (
                  <div key={item.id} className={SIDEBAR_STYLES.structureItem}>
                    <Circle size={12} className="text-blue-500" />
                    <span className="flex-1">{`${index + 1}챕터: ${item.title}`}</span>
                    <span className="text-xs text-gray-400">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 간단한 글쓰기 통계 */}
            <div className={SIDEBAR_STYLES.statsSection}>
              <h3 className={SIDEBAR_STYLES.sectionHeader}>글쓰기 통계</h3>
              <div className="space-y-2">
                <div className={SIDEBAR_STYLES.statItem}>
                  <span className={SIDEBAR_STYLES.statLabel}>단어</span>
                  <span className={SIDEBAR_STYLES.statValue}>{stats.wordCount}</span>
                </div>
                <div className={SIDEBAR_STYLES.statItem}>
                  <span className={SIDEBAR_STYLES.statLabel}>문자</span>
                  <span className={SIDEBAR_STYLES.statValue}>{stats.charCount}</span>
                </div>
                <div className={SIDEBAR_STYLES.statItem}>
                  <span className={SIDEBAR_STYLES.statLabel}>진행률</span>
                  <span className={SIDEBAR_STYLES.statValue}>{stats.progress}%</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 🔥 구조 뷰 */}
        {currentView === 'structure' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className={SIDEBAR_STYLES.sectionHeader}>구조 관리</h3>
              <button
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                onClick={onAddStructure}
                title="새 구조 추가"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className={SIDEBAR_STYLES.structureList}>
              {structure.map((item, index) => (
                <div key={item.id} className={`${SIDEBAR_STYLES.structureItem} justify-between relative`}>
                  <div className="flex items-center gap-2 flex-1">
                    <Circle size={12} className="text-blue-500" />
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitleEdit();
                          if (e.key === 'Escape') handleCancelTitleEdit();
                        }}
                        onBlur={handleSaveTitleEdit}
                        className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span className="flex-1 cursor-pointer" onClick={() => handleEditStructure(item.id)}>
                        {item.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{item.status}</span>
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStructureMenuId(structureMenuId === item.id ? null : item.id);
                        Logger.info('WRITER_SIDEBAR', '구조 관리 메뉴 클릭', { title: item.title, id: item.id });
                      }}
                      title="옵션"
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </div>

                  {/* 🔥 확장된 구조 아이템 메뉴 */}
                  {structureMenuId === item.id && (
                    <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                      <button
                        className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-left"
                        onClick={() => handleEditStructure(item.id)}
                      >
                        <Edit2 size={14} />
                        내용 편집
                      </button>
                      <button
                        className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-left"
                        onClick={() => handleStartTitleEdit(item.id, item.title)}
                      >
                        <Edit2 size={14} />
                        제목 변경
                      </button>
                      <button
                        className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-left"
                        onClick={() => handleDuplicateStructure(item.id, item.title)}
                      >
                        <FileText size={14} />
                        복제
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                      <button
                        className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-2 text-left"
                        onClick={() => handleDeleteStructure(item.id, item.title)}
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {structure.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">구조를 추가해보세요</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🔥 인물 뷰 */}
        {currentView === 'characters' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className={SIDEBAR_STYLES.sectionHeader}>인물 관리</h3>
              <button
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  Logger.info('WRITER_SIDEBAR', '인물 추가 버튼 클릭');
                  onAddCharacter?.();
                }}
                title="새 인물 추가"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {characters.map((character) => (
                <div key={character.id} className={`${SIDEBAR_STYLES.structureItem} justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-medium">
                      {character.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{character.name}</div>
                      {character.role && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{character.role}</div>
                      )}
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      Logger.info('WRITER_SIDEBAR', '인물 메뉴 클릭', { name: character.name });
                      // TODO: 인물 메뉴 표시
                    }}
                    title="옵션"
                  >
                    <MoreHorizontal size={12} />
                  </button>
                </div>
              ))}
              {characters.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">인물을 추가해보세요</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🔥 메모 뷰 */}
        {currentView === 'notes' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className={SIDEBAR_STYLES.sectionHeader}>메모 관리</h3>
              <button
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  Logger.info('WRITER_SIDEBAR', '메모 추가 버튼 클릭');
                  onAddNote?.();
                }}
                title="새 메모 추가"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {/* 🔥 임시 메모 데이터 (나중에 실제 데이터로 교체) */}
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">메모를 추가해보세요</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="구조 아이템 삭제"
        message={itemToDelete ? `"${itemToDelete.title}"을(를) 삭제하시겠습니까?` : ''}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
});
