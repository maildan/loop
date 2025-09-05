// WriterSidebar 메인 컴포넌트 (리팩토링된 버전)
'use client';

import React, { memo } from 'react';
import { Plus } from 'lucide-react';
import { WriterSidebarProps } from './types';
import { SIDEBAR_STYLES, MENU_ITEMS } from './constants';
import { useWriterSidebar } from './hooks/useWriterSidebar';
import { StructureTab } from './components/StructureTab';
import { ConfirmDialog } from '../ConfirmDialog';
import { Logger } from '../../../../../shared/logger';

export const WriterSidebar = memo(function WriterSidebar({
    projectId,
    currentView,
    onViewChange,
    structure: propStructure = [],
    characters,
    stats,
    collapsed,
    onAddStructure,
    onAddCharacter,
    onAddNote,
    onEditStructure,
    onDuplicateStructure,
    onDeleteStructure
}: WriterSidebarProps): React.ReactElement {

    const { state, storeStructures, actions } = useWriterSidebar(projectId);

    // 구조 데이터는 스토어를 우선으로, fallback으로 props 사용
    const structure = storeStructures.length > 0 ? storeStructures : propStructure;

    if (collapsed) {
        return (
            <div className={`${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.collapsed}`}>
                {/* Collapsed state - 최소화된 상태 */}
                <div className="p-2">
                    {MENU_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors mb-2 ${currentView === item.id
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
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
                        onClick={() => {
                            onViewChange(item.id);
                            Logger.debug('WRITER_SIDEBAR', 'View changed', { view: item.id });
                        }}
                        className={`${SIDEBAR_STYLES.menuItem} ${currentView === item.id
                            ? SIDEBAR_STYLES.menuItemActive
                            : SIDEBAR_STYLES.menuItemInactive
                            }`}
                    >
                        <item.icon size={16} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* 🔥 스크롤 가능한 컨텐츠 영역 */}
            <div className={SIDEBAR_STYLES.scrollArea}>
                {/* 구조 탭 */}
                {currentView === 'structure' && (
                    <StructureTab
                        projectId={projectId}
                        structure={structure}
                        expandedSections={state.expandedSections}
                        structureMenuId={state.structureMenuId}
                        editingId={state.editingId}
                        editingTitle={state.editingTitle}
                        onToggleSection={actions.toggleSection}
                        onSetStructureMenuId={actions.setStructureMenuId}
                        onAddStructure={onAddStructure}
                        onAddNote={onAddNote}
                        onEditStructure={onEditStructure}
                        onDeleteStructure={onDeleteStructure}
                    />
                )}

                {/* 캐릭터 탭 */}
                {currentView === 'characters' && (
                    <div className={SIDEBAR_STYLES.sectionContainer}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">캐릭터 관리</h3>
                            <button
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                onClick={onAddCharacter}
                                title="새 캐릭터 추가"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {characters.map((character) => (
                                <div
                                    key={character.id}
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {character.name?.charAt(0) || 'C'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {character.name}
                                        </div>
                                        {character.role && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {character.role}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {characters.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p className="text-sm">아직 캐릭터가 없습니다</p>
                                    <p className="text-xs mt-1">새 캐릭터를 추가해보세요</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 아이디어 탭 */}
                {currentView === 'idea' && (
                    <div className={SIDEBAR_STYLES.sectionContainer}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400">아이디어</h3>
                            <button
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                title="새 아이디어 추가"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {structure.filter(item => item.type === 'idea').map((idea) => (
                                <div
                                    key={idea.id}
                                    className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-700"
                                >
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        {idea.title}
                                    </div>
                                    {idea.description && (
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {idea.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {structure.filter(item => item.type === 'idea').length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p className="text-sm">아직 아이디어가 없습니다</p>
                                    <p className="text-xs mt-1">새 아이디어를 추가해보세요</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 🔥 통계 섹션 */}
            <div className={SIDEBAR_STYLES.statsSection}>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">오늘의 통계</div>
                <div className="space-y-1">
                    <div className={SIDEBAR_STYLES.statItem}>
                        <span className={SIDEBAR_STYLES.statLabel}>작성한 단어</span>
                        <span className={SIDEBAR_STYLES.statValue}>{stats.wordCount || 0}</span>
                    </div>
                    <div className={SIDEBAR_STYLES.statItem}>
                        <span className={SIDEBAR_STYLES.statLabel}>목표</span>
                        <span className={SIDEBAR_STYLES.statValue}>{stats.wordGoal || 0}</span>
                    </div>
                    <div className={SIDEBAR_STYLES.statItem}>
                        <span className={SIDEBAR_STYLES.statLabel}>진행률</span>
                        <span className={SIDEBAR_STYLES.statValue}>{stats.progress || 0}%</span>
                    </div>
                </div>
            </div>

            {/* 🔥 삭제 확인 다이얼로그 */}
            {state.showDeleteDialog && state.itemToDelete && (
                <ConfirmDialog
                    isOpen={state.showDeleteDialog}
                    title="구조 삭제"
                    message={`"${state.itemToDelete.title}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
                    confirmText="삭제"
                    cancelText="취소"
                    onConfirm={actions.handleConfirmDelete}
                    onCancel={actions.handleCancelDelete}
                />
            )}
        </div>
    );
});

export default WriterSidebar;
