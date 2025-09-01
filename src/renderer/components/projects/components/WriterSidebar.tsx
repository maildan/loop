'use client';

import React, { useState, memo } from 'react';
import {
  Edit3,
  FileText,
  Users,
  BookOpen,
  TrendingUp,
  Circle,
  CheckCircle,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { ProjectCharacter, ProjectStructure } from '../../../../shared/types';
import { WriterStats } from '../editor/WriterStats';
import { Logger } from '../../../../shared/logger';
import { useStructureStore } from '../../../stores/useStructureStore'; // 🔥 구조 스토어 추가

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
}

// 🔥 기가차드 간소화된 사이드바 스타일
const SIDEBAR_STYLES = {
  // 기본 컨테이너 (스크롤바 문제 해결)
  container: 'flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-full',
  collapsed: 'w-12',
  expanded: 'w-64',

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

// 🔥 메뉴 아이템 정의 (핵심 기능만)
const MENU_ITEMS = [
  { id: 'write', label: '글쓰기', icon: Edit3 },
  { id: 'structure', label: '구조', icon: FileText },
  { id: 'characters', label: '인물', icon: Users },
  { id: 'notes', label: '메모', icon: BookOpen },
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
  onAddNote
}: WriterSidebarProps): React.ReactElement {
  // 🔥 useStructureStore에서 실시간 구조 데이터 가져오기
  const storeStructures = useStructureStore((state) => {
    const projectStructures = state.structures[projectId];
    return projectStructures || [];
  });

  // 🔥 스토어 데이터를 우선 사용, 없으면 prop 사용
  const structure = storeStructures.length > 0 ? storeStructures : (propStructure || []);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['structure']));

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
    <div className={`${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.expanded}`}>
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
                <div key={item.id} className={`${SIDEBAR_STYLES.structureItem} justify-between`}>
                  <div className="flex items-center gap-2">
                    <Circle size={12} className="text-blue-500" />
                    <span className="flex-1">{`${index + 1}챕터: ${item.title}`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{item.status}</span>
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        Logger.info('WRITER_SIDEBAR', '구조 관리 메뉴 클릭', { title: item.title });
                        // TODO: 구조 아이템 메뉴 표시
                      }}
                      title="옵션"
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
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
    </div>
  );
});
