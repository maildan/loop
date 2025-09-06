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
    collapsed?: boolean;

    // 🔥 핸들러들
    onAddStructure?: () => void;
    onAddCharacter?: () => void;
    onAddNote?: () => void;
    onEditStructure?: (id: string) => void;
    onDuplicateStructure?: (id: string, title: string) => void;
    onDeleteStructure?: (id: string, title: string) => void;
}

// 🔥 Zen Browser 스타일 사이드바 (3단계 상태: default/hover/collapsed)
const SIDEBAR_STYLES = {
    // 기본 컨테이너 (tabBar 아래 영역에만 표시)
    container: 'flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-[calc(100%-3.5rem)] relative mt-14',
    default: 'w-16', // 🔥 기본 상태: 아이콘만 표시
    expanded: 'w-64', // 🔥 hover 시: 전체 표시
    collapsed: 'w-0 overflow-hidden', // 🔥 완전 숨김

    // 🔥 Zen Browser 스타일: hover 시 나타나는 버전 (tabBar 아래 영역에만 제한)
    hoverable: 'absolute left-0 top-14 h-[calc(100%-3.5rem)] w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl z-30 transform -translate-x-full transition-all duration-300 ease-in-out',
    hoverVisible: 'transform translate-x-0',

    // hover 감지 영역 - 프로젝트 영역에서만 동작 (AppSidebar와 분리)  
    hoverTrigger: 'absolute left-64 top-0 w-8 h-full z-25',

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

// 🔥 메뉴 아이템 정의 (4개 탭으로 단순화)
const MENU_ITEMS = [
    { id: 'write', label: '글쓰기', icon: Edit3 },
    { id: 'structure', label: '구조', icon: FileText },
    { id: 'characters', label: '인물', icon: Users },
    { id: 'idea', label: '아이디어', icon: Lightbulb },
];

export const ProjectSidebar = memo(function ProjectSidebar({
    projectId,
    currentView,
    onViewChange,
    structure = [],
    characters,
    stats,
    collapsed = false,
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

    // 🔥 설정에서 상태 가져오기 (props로 전달된 값 우선 사용)
    const isCollapsed = collapsed ?? settings?.ui?.sidebarCollapsed ?? false;

    // Note: Do NOT return early here — keep hooks stable across renders.
    // Focus mode is handled via `shouldShowHoverable` / `shouldShowExpanded` below.

    // 🔥 hover 감지 로직
    const handleMouseEnter = useCallback(() => {
        if (isCollapsed) {
            setIsHovered(true);
            Logger.debug('PROJECT_SIDEBAR', 'Hover detected - showing sidebar');
        }
    }, [isCollapsed]);

    const handleMouseLeave = useCallback(() => {
        if (isCollapsed) {
            setIsHovered(false);
            Logger.debug('PROJECT_SIDEBAR', 'Hover left - hiding sidebar');
        }
    }, [isCollapsed]);

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

    // 🔥 3단계 상태 로직: default(아이콘만) → hover(전체) → collapsed(완전숨김)
    const shouldShowHoverable = collapsed;
    const shouldShowExpanded = !collapsed;

    // 🔥 전역 마우스 이벤트로 왼쪽 가장자리 감지 (Focus 모드에서 편의성 향상)
    useEffect(() => {
        if (!shouldShowHoverable) return;

        const handleGlobalMouseMove = (event: MouseEvent) => {
            // 화면 왼쪽 50px 이내로 마우스가 오면 사이드바 표시
            if (event.clientX <= 50 && !isHovered) {
                setIsHovered(true);
                Logger.debug('PROJECT_SIDEBAR', 'Mouse near left edge - showing sidebar');
            }
            // 화면 오른쪽으로 마우스가 멀어지면 사이드바 숨김
            else if (event.clientX > 300 && isHovered) {
                setIsHovered(false);
                Logger.debug('PROJECT_SIDEBAR', 'Mouse moved away - hiding sidebar');
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [shouldShowHoverable, isHovered]);

    // Focus mode 제어용 플래그 (렌더 경로를 변경하지 않고 UI만 숨김)
    const isHiddenByFocusMode = false;

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
                {/* 🔥 구조 관리 섹션 (확장됨: 챕터, 시놉시스, 메모 포함) */}
                {currentView === 'structure' && (
                    <div className="p-3 space-y-4">
                        {/* 챕터 서브섹션 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">챕터</h4>
                                <button
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    onClick={onAddStructure}
                                    title="새 챕터 추가"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <div className={SIDEBAR_STYLES.structureList}>
                                {structure.filter(item => item.type === 'chapter' || !item.type).map((item) => (
                                    <div key={item.id} className={`${SIDEBAR_STYLES.structureItem} justify-between relative`}>
                                        <div className="flex items-center gap-2 flex-1">
                                            <FileText size={12} className="text-blue-500" />
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

                        {/* 시놉시스 서브섹션 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">시놉시스</h4>
                                <button
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    onClick={() => onAddStructure?.()}
                                    title="새 시놉시스 추가"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <div className={SIDEBAR_STYLES.structureList}>
                                {structure.filter(item => item.type === 'synopsis').map((item) => (
                                    <div key={item.id} className={`${SIDEBAR_STYLES.structureItem} justify-between relative`}>
                                        <div className="flex items-center gap-2 flex-1">
                                            <Target size={12} className="text-green-500" />
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

                        {/* 메모 서브섹션 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">메모</h4>
                                <button
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    onClick={onAddNote}
                                    title="새 메모 추가"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <div className={SIDEBAR_STYLES.structureList}>
                                {structure.filter(item => item.type === 'section').map((item) => (
                                    <div key={item.id} className={`${SIDEBAR_STYLES.structureItem} justify-between relative`}>
                                        <div className="flex items-center gap-2 flex-1">
                                            <BookOpen size={12} className="text-yellow-500" />
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
