'use client';

import React, { useState, memo, useCallback, useEffect } from 'react';
import {
    Edit3,
    FileText,
    Users,
    BookOpen,
    Target,
    Lightbulb,
    Circle,
    CheckCircle,
    Plus,
    MoreHorizontal,
    Edit2,
    Trash2
} from 'lucide-react';
import { ProjectCharacter, ProjectStructure } from '../../../../shared/types';
import { WriterStats } from '../editor/WriterStats';
import { Logger } from '../../../../shared/logger';
import { useSettings } from '../../../app/settings/hooks/useSettings';

interface ProjectSidebarProps {
    projectId: string;
    currentView: string;
    onViewChange: (view: string) => void;
    structure?: ProjectStructure[];
    characters: ProjectCharacter[];
    stats: WriterStats;

    // 🔥 핸들러들
    onAddStructure?: () => void;
    onAddCharacter?: () => void;
    onAddNote?: () => void;
    onEditStructure?: (id: string) => void;
    onDuplicateStructure?: (id: string, title: string) => void;
    onDeleteStructure?: (id: string, title: string) => void;
}

// 🔥 Zen Browser 스타일 사이드바 (hover 감지 포함)
const SIDEBAR_STYLES = {
    // 기본 컨테이너
    container: 'flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-full relative',
    expanded: 'w-64',
    collapsed: 'w-0 overflow-hidden',

    // 🔥 Zen Browser 스타일: hover 시 나타나는 버전
    hoverable: 'absolute left-0 top-0 h-full w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-50 transform -translate-x-full transition-transform duration-300 ease-in-out',
    hoverVisible: 'transform translate-x-0',

    // hover 감지 영역
    hoverTrigger: 'absolute left-0 top-0 w-4 h-full z-40',

    // 메뉴 섹션
    menuSection: 'p-3 space-y-1',
    menuItem: 'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md',
    menuItemActive: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    menuItemInactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',

    // 섹션 헤더
    sectionHeader: 'text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-3',

    // 구조 아이템
    structureList: 'space-y-1 px-3',
    structureItem: 'flex items-center gap-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors',

    // 통계 영역
    statsSection: 'p-3 border-t border-gray-200 dark:border-gray-700',
    statItem: 'flex justify-between items-center py-1 text-sm',
    statLabel: 'text-gray-600 dark:text-gray-400',
    statValue: 'font-medium text-gray-900 dark:text-gray-100',

    // 스크롤 영역
    scrollArea: 'flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar',
} as const;

// 🔥 메뉴 아이템 정의 (모든 view 포함)
const MENU_ITEMS = [
    { id: 'write', label: '글쓰기', icon: Edit3 },
    { id: 'structure', label: '구조', icon: FileText },
    { id: 'characters', label: '인물', icon: Users },
    { id: 'notes', label: '메모', icon: BookOpen },
    { id: 'synopsis', label: '시놉시스', icon: Target },
    { id: 'idea', label: '아이디어', icon: Lightbulb },
];

export const ProjectSidebar = memo(function ProjectSidebar({
    projectId,
    currentView,
    onViewChange,
    structure = [],
    characters,
    stats,
    onAddStructure,
    onAddCharacter,
    onAddNote,
    onEditStructure,
    onDuplicateStructure,
    onDeleteStructure
}: ProjectSidebarProps): React.ReactElement {

    const { settings } = useSettings();
    const [isHovered, setIsHovered] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState<string>('');
    const [structureMenuId, setStructureMenuId] = useState<string | null>(null);

    // 🔥 설정에서 상태 가져오기
    const isCollapsed = settings?.ui?.sidebarCollapsed ?? false;
    const isFocusMode = settings?.ui?.focusMode ?? false;
    const isZenMode = settings?.ui?.zenMode ?? false;

    // Note: Do NOT return early here — keep hooks stable across renders.
    // Focus mode is handled via `shouldShowHoverable` / `shouldShowExpanded` below.

    // 🔥 hover 감지 로직
    const handleMouseEnter = useCallback(() => {
        if (isCollapsed || isZenMode) {
            setIsHovered(true);
            Logger.debug('PROJECT_SIDEBAR', 'Hover detected - showing sidebar');
        }
    }, [isCollapsed, isZenMode]);

    const handleMouseLeave = useCallback(() => {
        if (isCollapsed || isZenMode) {
            setIsHovered(false);
            Logger.debug('PROJECT_SIDEBAR', 'Hover left - hiding sidebar');
        }
    }, [isCollapsed, isZenMode]);

    // 🔥 키보드 ESC로 사이드바 숨기기
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isHovered) {
                setIsHovered(false);
                Logger.debug('PROJECT_SIDEBAR', 'ESC pressed - hiding sidebar');
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isHovered]);

    // 🔥 렌더링 조건부 로직
    const shouldShowHoverable = (isCollapsed || isZenMode) && !isFocusMode;
    const shouldShowExpanded = !isCollapsed && !isZenMode && !isFocusMode;

    // Focus mode 제어용 플래그 (렌더 경로를 변경하지 않고 UI만 숨김)
    const isHiddenByFocusMode = isFocusMode;

    Logger.debug('PROJECT_SIDEBAR', 'Render state', {
        isCollapsed,
        isFocusMode,
        isZenMode,
        isHovered,
        shouldShowHoverable,
        shouldShowExpanded
    });

    return (
        <>
            {/* 🔥 Hover 감지 영역 (collapsed/zen mode에서만) */}
            {shouldShowHoverable && (
                <div
                    className={SIDEBAR_STYLES.hoverTrigger}
                    onMouseEnter={handleMouseEnter}
                />
            )}

            {/* 🔥 일반 확장된 사이드바 */}
            {shouldShowExpanded && (
                <div className={`${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.expanded}`}>
                    <SidebarContent
                        currentView={currentView}
                        onViewChange={onViewChange}
                        structure={structure}
                        characters={characters}
                        stats={stats}
                        onAddStructure={onAddStructure}
                        onAddCharacter={onAddCharacter}
                        onAddNote={onAddNote}
                        onEditStructure={onEditStructure}
                        onDuplicateStructure={onDuplicateStructure}
                        onDeleteStructure={onDeleteStructure}
                        editingId={editingId}
                        setEditingId={setEditingId}
                        editingTitle={editingTitle}
                        setEditingTitle={setEditingTitle}
                        structureMenuId={structureMenuId}
                        setStructureMenuId={setStructureMenuId}
                    />
                </div>
            )}

            {/* 🔥 Hover 시 나타나는 사이드바 (Zen Browser 스타일) */}
            {shouldShowHoverable && (
                <div
                    className={`${SIDEBAR_STYLES.hoverable} ${isHovered ? SIDEBAR_STYLES.hoverVisible : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <SidebarContent
                        currentView={currentView}
                        onViewChange={onViewChange}
                        structure={structure}
                        characters={characters}
                        stats={stats}
                        onAddStructure={onAddStructure}
                        onAddCharacter={onAddCharacter}
                        onAddNote={onAddNote}
                        onEditStructure={onEditStructure}
                        onDuplicateStructure={onDuplicateStructure}
                        onDeleteStructure={onDeleteStructure}
                        editingId={editingId}
                        setEditingId={setEditingId}
                        editingTitle={editingTitle}
                        setEditingTitle={setEditingTitle}
                        structureMenuId={structureMenuId}
                        setStructureMenuId={setStructureMenuId}
                    />
                </div>
            )}
        </>
    );
});

// 🔥 사이드바 콘텐츠 컴포넌트 (재사용)
interface SidebarContentProps {
    currentView: string;
    onViewChange: (view: string) => void;
    structure: ProjectStructure[];
    characters: ProjectCharacter[];
    stats: WriterStats;
    onAddStructure?: () => void;
    onAddCharacter?: () => void;
    onAddNote?: () => void;
    onEditStructure?: (id: string) => void;
    onDuplicateStructure?: (id: string, title: string) => void;
    onDeleteStructure?: (id: string, title: string) => void;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    editingTitle: string;
    setEditingTitle: (title: string) => void;
    structureMenuId: string | null;
    setStructureMenuId: (id: string | null) => void;
}

const SidebarContent = memo(function SidebarContent({
    currentView,
    onViewChange,
    structure,
    characters,
    stats,
    onAddStructure,
    onAddCharacter,
    onAddNote,
    onEditStructure,
    onDuplicateStructure,
    onDeleteStructure,
    editingId,
    setEditingId,
    editingTitle,
    setEditingTitle,
    structureMenuId,
    setStructureMenuId
}: SidebarContentProps): React.ReactElement {

    return (
        <>
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

            {/* 🔥 스크롤 가능한 컨텐츠 영역 */}
            <div className={SIDEBAR_STYLES.scrollArea}>
                {/* 🔥 구조 관리 섹션 */}
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
                            {structure.map((item) => (
                                <div key={item.id} className={`${SIDEBAR_STYLES.structureItem} justify-between relative`}>
                                    <div className="flex items-center gap-2 flex-1">
                                        <Circle size={12} className="text-blue-500" />
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                    <button
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStructureMenuId(structureMenuId === item.id ? null : item.id);
                                        }}
                                    >
                                        <MoreHorizontal size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🔥 캐릭터 관리 섹션 */}
                {currentView === 'characters' && (
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={SIDEBAR_STYLES.sectionHeader}>캐릭터 관리</h3>
                            <button
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                onClick={onAddCharacter}
                                title="새 캐릭터 추가"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className={SIDEBAR_STYLES.structureList}>
                            {characters.map((character) => (
                                <div key={character.id} className={`${SIDEBAR_STYLES.structureItem}`}>
                                    <Users size={12} className="text-green-500" />
                                    <span className="truncate">{character.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🔥 메모 관리 섹션 */}
                {currentView === 'notes' && (
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={SIDEBAR_STYLES.sectionHeader}>메모 관리</h3>
                            <button
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                onClick={onAddNote}
                                title="새 메모 추가"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 🔥 통계 섹션 */}
            <div className={SIDEBAR_STYLES.statsSection}>
                <h3 className={SIDEBAR_STYLES.sectionHeader}>프로젝트 통계</h3>
                <div className={SIDEBAR_STYLES.statItem}>
                    <span className={SIDEBAR_STYLES.statLabel}>단어 수</span>
                    <span className={SIDEBAR_STYLES.statValue}>{stats.wordCount}</span>
                </div>
                <div className={SIDEBAR_STYLES.statItem}>
                    <span className={SIDEBAR_STYLES.statLabel}>문자 수</span>
                    <span className={SIDEBAR_STYLES.statValue}>{stats.charCount}</span>
                </div>
                <div className={SIDEBAR_STYLES.statItem}>
                    <span className={SIDEBAR_STYLES.statLabel}>예상 읽기 시간</span>
                    <span className={SIDEBAR_STYLES.statValue}>{stats.readingTime}분</span>
                </div>
            </div>
        </>
    );
});

export default ProjectSidebar;
