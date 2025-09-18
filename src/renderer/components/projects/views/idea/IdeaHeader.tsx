import React from 'react';
import { ChevronLeft, Plus, Grid3x3, List } from 'lucide-react';

interface IdeaHeaderProps {
    onBack: () => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onAddIdea: () => void;
}

const IDEA_STYLES = {
    header: 'sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700',
    headerTop: 'flex items-center justify-between p-4',
    backButton: 'flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    title: 'text-xl font-bold text-gray-900 dark:text-gray-100',
    headerActions: 'flex items-center gap-2',
    viewToggle: 'flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1',
    viewButton: 'p-2 rounded-md transition-colors',
    viewButtonActive: 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm',
    viewButtonInactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    addButton: 'flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors',
};

export function IdeaHeader({ onBack, viewMode, onViewModeChange, onAddIdea }: IdeaHeaderProps) {
    return (
        <div className={IDEA_STYLES.header}>
            <div className={IDEA_STYLES.headerTop}>
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className={IDEA_STYLES.backButton}>
                        <ChevronLeft className="w-4 h-4" />
                        <span>뒤로</span>
                    </button>
                    <h1 className={IDEA_STYLES.title}>아이디어 관리</h1>
                </div>

                <div className={IDEA_STYLES.headerActions}>
                    {/* 뷰 모드 토글 */}
                    <div className={IDEA_STYLES.viewToggle}>
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`${IDEA_STYLES.viewButton} ${viewMode === 'grid'
                                    ? IDEA_STYLES.viewButtonActive
                                    : IDEA_STYLES.viewButtonInactive
                                }`}
                            title="그리드 뷰"
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`${IDEA_STYLES.viewButton} ${viewMode === 'list'
                                    ? IDEA_STYLES.viewButtonActive
                                    : IDEA_STYLES.viewButtonInactive
                                }`}
                            title="리스트 뷰"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* 아이디어 추가 버튼 */}
                    <button onClick={onAddIdea} className={IDEA_STYLES.addButton}>
                        <Plus className="w-4 h-4" />
                        <span>새 아이디어</span>
                    </button>
                </div>
            </div>
        </div>
    );
}