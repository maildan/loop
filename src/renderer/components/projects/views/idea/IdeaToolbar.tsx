import React from 'react';
import { Search, Filter, Shuffle, TrendingUp } from 'lucide-react';
import { CATEGORY_STYLES, STAGE_STYLES } from './types';

interface IdeaToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    selectedStage: string;
    onStageChange: (stage: string) => void;
    onShuffle: () => void;
    onSort: () => void;
}

const IDEA_STYLES = {
    toolbar: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700',
    toolbarLeft: 'flex items-center gap-3',
    toolbarRight: 'flex items-center gap-2',
    searchContainer: 'relative',
    searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400',
    searchInput: 'pl-10 pr-4 py-2 w-64 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400',
    filterSelect: 'px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    actionButton: 'p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
};

export function IdeaToolbar({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedStage,
    onStageChange,
    onShuffle,
    onSort
}: IdeaToolbarProps) {
    return (
        <div className={IDEA_STYLES.toolbar}>
            <div className={IDEA_STYLES.toolbarLeft}>
                {/* 검색 */}
                <div className={IDEA_STYLES.searchContainer}>
                    <Search className={IDEA_STYLES.searchIcon} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="아이디어 검색..."
                        className={IDEA_STYLES.searchInput}
                    />
                </div>

                {/* 카테고리 필터 */}
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className={IDEA_STYLES.filterSelect}
                >
                    <option value="all">모든 카테고리</option>
                    {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
                        <option key={key} value={key}>
                            {style.label}
                        </option>
                    ))}
                </select>

                {/* 단계 필터 */}
                <select
                    value={selectedStage}
                    onChange={(e) => onStageChange(e.target.value)}
                    className={IDEA_STYLES.filterSelect}
                >
                    <option value="all">모든 단계</option>
                    {Object.entries(STAGE_STYLES).map(([key, style]) => (
                        <option key={key} value={key}>
                            {style.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className={IDEA_STYLES.toolbarRight}>
                {/* 셔플 */}
                <button
                    onClick={onShuffle}
                    className={IDEA_STYLES.actionButton}
                    title="무작위 섞기"
                >
                    <Shuffle className="w-4 h-4" />
                </button>

                {/* 정렬 */}
                <button
                    onClick={onSort}
                    className={IDEA_STYLES.actionButton}
                    title="최신순 정렬"
                >
                    <TrendingUp className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}