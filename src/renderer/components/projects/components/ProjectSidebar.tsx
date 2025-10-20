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

// 🔥 Scrivener Binder + iA Writer 스타일 사이드바
const SIDEBAR_STYLES = {
    // 기본 컨테이너 - 작가 친화적 디자인 (애니메이션 개선)
    container: 'flex flex-col bg-[var(--editor-bg-secondary)] text-[color:var(--editor-text)] border-r border-[color:var(--editor-border)] transition-all duration-300 ease-out h-full relative shadow-sm will-change-transform overflow-x-hidden',
    default: 'w-16', // 🔥 기본 상태: 아이콘만 표시 (미니멀)
    expanded: 'w-80', // 🔥 hover 시: 더 넓은 320px로 확장
    collapsed: 'w-0 overflow-hidden', // 🔥 완전 숨김

    // 🔥 Scrivener Binder 스타일: 부드러운 슬라이드 효과 (개선된 애니메이션)
    hoverable: 'absolute left-0 top-14 h-[calc(100%-3.5rem)] w-80 bg-[var(--editor-bg-secondary)] text-[color:var(--editor-text)] border-r border-[color:var(--editor-border)] shadow-2xl z-40 transform -translate-x-full transition-all duration-300 ease-out backdrop-blur-sm will-change-transform overflow-x-hidden',
    hoverVisible: 'transform translate-x-0 opacity-100',
    hoverHidden: 'transform -translate-x-full opacity-90',

    // hover 감지 영역 - 더 넓게 설정하여 사용성 향상 (애니메이션 개선)
    hoverTrigger: 'absolute left-0 top-14 w-12 h-[calc(100%-3.5rem)] z-35 hover:w-16 transition-all duration-200 ease-out will-change-transform',

    // 🔥 Scrivener Binder 스타일 메뉴 섹션
    menuSection: 'p-4 space-y-2 border-b border-[color:var(--editor-border)]',
    menuSectionTitle: 'text-xs font-semibold text-[color:var(--editor-text-muted)] uppercase tracking-wide mb-3 px-2',
    menuItem: 'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer rounded-lg group relative',
    menuItemActive: 'bg-[var(--editor-accent-light)] text-[color:var(--editor-accent)] shadow-sm border-l-[3px] border-[color:var(--editor-accent)]',
    menuItemInactive: 'text-[color:var(--editor-text-muted)] hover:bg-[var(--editor-bg)] hover:text-[color:var(--editor-text)] hover:shadow-sm',

    // 섹션 헤더
    sectionHeader: 'text-xs font-semibold text-[color:var(--editor-text-muted)] mb-2 px-3',

    // 구조 아이템
    structureList: 'space-y-1 px-3',
    structureItem: 'flex items-center gap-2 py-1.5 text-sm text-[color:var(--editor-text-muted)] hover:text-[color:var(--editor-accent)] cursor-pointer transition-colors',

    // 통계 영역
    statsSection: 'p-3 border-t border-[color:var(--editor-border)]',
    statItem: 'flex justify-between items-center py-1 text-sm',
    statLabel: 'text-[color:var(--editor-text-muted)]',
    statValue: 'font-medium text-[color:var(--editor-text)]',

    // 스크롤 영역
    scrollArea: 'flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar',
} as const;

// 🔥 메뉴 아이템 정의 (Universal Tab System - Chrome 스타일)
const MENU_ITEMS = [
    { id: 'write', label: '글쓰기', icon: Edit3 },
    { id: 'structure', label: '구조', icon: FileText },
    { id: 'characters', label: '인물', icon: Users },
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
                <div className={`${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.expanded} flex-shrink-0`}>
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
                        {/* 메인 스토리 및 챕터 섹션 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-semibold text-[color:var(--editor-text-muted)]">스토리</h4>
                                <button
                                    className="text-[color:var(--editor-accent)] p-1 rounded transition-colors hover:bg-[var(--editor-accent-light)]"
                                    onClick={onAddStructure}
                                    title="새 챕터 추가"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <div className={SIDEBAR_STYLES.structureList}>
                                {/* 메인 스토리 표시 */}
                                <div className={`${SIDEBAR_STYLES.structureItem} justify-between relative`}>
                                    <div className="flex items-center gap-2 flex-1">
                                        <BookOpen size={12} className="text-[var(--success)]" />
                                        <span className="truncate font-medium text-[color:var(--editor-text)]">메인 스토리</span>
                                    </div>
                                </div>
                                {/* 챕터들 표시 */}
                                {structure.filter(item => item.type === 'chapter' || !item.type).map((item) => (
                                    <div key={item.id} className={`${SIDEBAR_STYLES.structureItem} justify-between relative`}>
                                        <div className="flex items-center gap-2 flex-1">
                                            <FileText size={12} className="text-[color:var(--editor-accent)]" />
                                            <span className="truncate text-[color:var(--editor-text)]">{item.title}</span>
                                        </div>
                                        <button
                                            className="text-[color:var(--editor-text-muted)] p-1 rounded transition-colors hover:text-[color:var(--editor-text)] hover:bg-[var(--editor-bg)]"
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
                                <h4 className="text-xs font-semibold text-[color:var(--editor-text-muted)]">시놉시스</h4>
                                <button
                                    className="text-[color:var(--editor-accent)] p-1 rounded transition-colors hover:bg-[var(--editor-accent-light)]"
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
                                            <Target size={12} className="text-[var(--success)]" />
                                            <span className="truncate text-[color:var(--editor-text)]">{item.title}</span>
                                        </div>
                                        <button
                                            className="text-[color:var(--editor-text-muted)] p-1 rounded transition-colors hover:text-[color:var(--editor-text)] hover:bg-[var(--editor-bg)]"
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
                                <h4 className="text-xs font-semibold text-[color:var(--editor-text-muted)]">메모</h4>
                                <button
                                    className="text-[color:var(--editor-accent)] p-1 rounded transition-colors hover:bg-[var(--editor-accent-light)]"
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
                                            <BookOpen size={12} className="text-[var(--warning)]" />
                                            <span className="truncate text-[color:var(--editor-text)]">{item.title}</span>
                                        </div>
                                        <button
                                            className="text-[color:var(--editor-text-muted)] p-1 rounded transition-colors hover:text-[color:var(--editor-text)] hover:bg-[var(--editor-bg)]"
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
                                className="text-[color:var(--editor-accent)] p-1 rounded transition-colors hover:bg-[var(--editor-accent-light)]"
                                onClick={onAddCharacter}
                                title="새 캐릭터 추가"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className={SIDEBAR_STYLES.structureList}>
                            {characters.map((character) => (
                                <div key={character.id} className={`${SIDEBAR_STYLES.structureItem}`}>
                                    <Users size={12} className="text-[var(--success)]" />
                                    <span className="truncate text-[color:var(--editor-text)]">{character.name}</span>
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
                                className="text-[color:var(--editor-accent)] p-1 rounded transition-colors hover:bg-[var(--editor-accent-light)]"
                                onClick={onAddNote}
                                title="새 메모 추가"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 🔥 통계 섹션 - scrollArea 내부로 이동 (빈 공간 채우기) */}
                <div className="mt-auto border-t border-[color:var(--editor-border)] p-3 space-y-2">
                    <h3 className={SIDEBAR_STYLES.sectionHeader}>프로젝트 통계</h3>
                    <div className={SIDEBAR_STYLES.statItem}>
                        <span className={SIDEBAR_STYLES.statLabel}>단어 수</span>
                        <span className={SIDEBAR_STYLES.statValue}>{stats.wordCount?.toLocaleString() || 0}</span>
                    </div>
                    <div className={SIDEBAR_STYLES.statItem}>
                        <span className={SIDEBAR_STYLES.statLabel}>문자 수</span>
                        <span className={SIDEBAR_STYLES.statValue}>{stats.charCount?.toLocaleString() || 0}</span>
                    </div>
                    <div className={SIDEBAR_STYLES.statItem}>
                        <span className={SIDEBAR_STYLES.statLabel}>예상 읽기 시간</span>
                        <span className={SIDEBAR_STYLES.statValue}>{stats.readingTime || 0}분</span>
                    </div>
                    <div className={SIDEBAR_STYLES.statItem}>
                        <span className={SIDEBAR_STYLES.statLabel}>진행률</span>
                        <span className={SIDEBAR_STYLES.statValue}>{stats.progress || 0}%</span>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ProjectSidebar;
