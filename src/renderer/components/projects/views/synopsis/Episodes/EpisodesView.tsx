'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Plus, ChevronDown, Edit, Trash2, Copy, MoveVertical, CheckCircle, Clock, FileText } from 'lucide-react';

export interface Episode {
    id: string;
    number?: number;
    title: string;
    type: string;
    wordCount?: number;
    act?: 'intro' | 'rising' | 'development' | 'climax' | 'conclusion';
    createdAt?: Date;
}

export interface EpisodesViewProps {
    projectId: string;
    elements: Episode[];
    onTabChange?: (tab: string) => void;
}

type FilterMode = 'all' | 'completed' | 'in-progress' | 'draft';
type SortMode = 'number' | 'date' | 'wordCount' | 'act';
type ViewMode = 'grid' | 'list';

/**
 * 📚 EpisodesView - 회차 관리
 * 
 * 기능:
 * 1. 회차 목록 (Grid/List 전환)
 * 2. 필터/정렬/검색
 * 3. Quick Actions (편집/삭제/복제)
 * 4. Bulk Actions (선택 일괄 처리)
 * 5. Progress Bar (전체 진행률)
 */

export const EpisodesView: React.FC<EpisodesViewProps> = ({
    projectId,
    elements = [],
}) => {
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [sortMode, setSortMode] = useState<SortMode>('number');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEpisodes, setSelectedEpisodes] = useState<Set<string>>(new Set());

    // 🔥 회차 필터링 (chapters만)
    const chapters = useMemo(() => {
        return elements.filter(e => e.type === 'chapter');
    }, [elements]);

    // 🔥 필터링된 회차 목록
    const filteredChapters = useMemo(() => {
        let result = [...chapters];

        // 검색 필터
        if (searchQuery) {
            result = result.filter(ch => 
                ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ch.number?.toString().includes(searchQuery)
            );
        }

        // 상태 필터
        if (filterMode !== 'all') {
            result = result.filter(ch => {
                const wordCount = ch.wordCount || 0;
                if (filterMode === 'completed') return wordCount >= 500; // 500자 이상 완성
                if (filterMode === 'in-progress') return wordCount > 0 && wordCount < 500;
                if (filterMode === 'draft') return wordCount === 0;
                return true;
            });
        }

        // 정렬
        result.sort((a, b) => {
            if (sortMode === 'number') return (a.number || 0) - (b.number || 0);
            if (sortMode === 'date') return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
            if (sortMode === 'wordCount') return (b.wordCount || 0) - (a.wordCount || 0);
            if (sortMode === 'act') {
                const actOrder: Record<string, number> = { intro: 0, rising: 1, development: 2, climax: 3, conclusion: 4 };
                const aOrder = actOrder[a.act || 'intro'] || 0;
                const bOrder = actOrder[b.act || 'intro'] || 0;
                return aOrder - bOrder;
            }
            return 0;
        });

        return result;
    }, [chapters, filterMode, searchQuery, sortMode]);

    // 🔥 통계 계산
    const stats = useMemo(() => {
        const total = chapters.length;
        const completed = chapters.filter(ch => (ch.wordCount || 0) >= 500).length;
        const inProgress = chapters.filter(ch => (ch.wordCount || 0) > 0 && (ch.wordCount || 0) < 500).length;
        const draft = chapters.filter(ch => (ch.wordCount || 0) === 0).length;
        const totalWords = chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, inProgress, draft, totalWords, progressPercent };
    }, [chapters]);

    // 🔥 5막 구조 배지 색상
    const getActBadge = (act?: string) => {
        const badges = {
            intro: { label: '도입', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
            rising: { label: '발단', color: 'bg-green-500/20 text-green-500 border-green-500/30' },
            development: { label: '전개', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
            climax: { label: '절정', color: 'bg-red-500/20 text-red-500 border-red-500/30' },
            conclusion: { label: '결말', color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' },
        };
        return badges[act as keyof typeof badges] || badges.intro;
    };

    // 🔥 상태 배지
    const getStatusBadge = (wordCount: number) => {
        if (wordCount >= 500) return { label: '완료', color: 'bg-green-500/20 text-green-500 border-green-500/30', icon: CheckCircle };
        if (wordCount > 0) return { label: '진행중', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', icon: Clock };
        return { label: '초안', color: 'bg-gray-500/20 text-gray-500 border-gray-500/30', icon: FileText };
    };

    // 🔥 선택 토글
    const toggleSelection = (episodeId: string) => {
        const newSelection = new Set(selectedEpisodes);
        if (newSelection.has(episodeId)) {
            newSelection.delete(episodeId);
        } else {
            newSelection.add(episodeId);
        }
        setSelectedEpisodes(newSelection);
    };

    // 🔥 전체 선택/해제
    const toggleSelectAll = () => {
        if (selectedEpisodes.size === filteredChapters.length) {
            setSelectedEpisodes(new Set());
        } else {
            setSelectedEpisodes(new Set(filteredChapters.map(ch => ch.id)));
        }
    };

    return (
        <div className="flex h-full flex-col gap-6 p-6">
            {/* 🔥 Header + Progress Bar */}
            <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">회차 관리</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            전체 {stats.total}개 회차 • 완료 {stats.completed}개 • 진행 {stats.inProgress}개
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 rounded-lg bg-[hsl(var(--accent-primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        <Plus className="h-4 w-4" />
                        새 회차 작성
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">전체 진행률</span>
                        <span className="font-semibold text-foreground">{stats.progressPercent}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-background overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[hsl(var(--accent-primary))] to-green-500 transition-all duration-500"
                            style={{ width: `${stats.progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 🔥 Filters + Sort + Search + View Mode */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* 검색 */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="회차 제목 또는 번호로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--accent-primary))] focus:outline-none"
                    />
                </div>

                {/* 필터 */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterMode('all')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            filterMode === 'all'
                                ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10 text-[hsl(var(--accent-primary))]'
                                : 'border-border bg-background text-muted-foreground hover:border-[hsl(var(--accent-primary))]/50'
                        }`}
                    >
                        전체 ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilterMode('completed')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            filterMode === 'completed'
                                ? 'border-green-500 bg-green-500/10 text-green-500'
                                : 'border-border bg-background text-muted-foreground hover:border-green-500/50'
                        }`}
                    >
                        완료 ({stats.completed})
                    </button>
                    <button
                        onClick={() => setFilterMode('in-progress')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            filterMode === 'in-progress'
                                ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                                : 'border-border bg-background text-muted-foreground hover:border-yellow-500/50'
                        }`}
                    >
                        진행중 ({stats.inProgress})
                    </button>
                    <button
                        onClick={() => setFilterMode('draft')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            filterMode === 'draft'
                                ? 'border-gray-500 bg-gray-500/10 text-gray-500'
                                : 'border-border bg-background text-muted-foreground hover:border-gray-500/50'
                        }`}
                    >
                        초안 ({stats.draft})
                    </button>
                </div>

                {/* 정렬 */}
                <div className="relative">
                    <select
                        value={sortMode}
                        onChange={(e) => setSortMode(e.target.value as SortMode)}
                        className="appearance-none px-4 py-2 pr-10 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:border-[hsl(var(--accent-primary))] focus:outline-none cursor-pointer"
                    >
                        <option value="number">회차 번호</option>
                        <option value="date">작성일</option>
                        <option value="wordCount">글자 수</option>
                        <option value="act">5막 구조</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg border transition-colors ${
                            viewMode === 'grid'
                                ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10 text-[hsl(var(--accent-primary))]'
                                : 'border-border bg-background text-muted-foreground hover:border-[hsl(var(--accent-primary))]/50'
                        }`}
                    >
                        <Grid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg border transition-colors ${
                            viewMode === 'list'
                                ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10 text-[hsl(var(--accent-primary))]'
                                : 'border-border bg-background text-muted-foreground hover:border-[hsl(var(--accent-primary))]/50'
                        }`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* 🔥 Bulk Actions (선택된 항목이 있을 때) */}
            {selectedEpisodes.size > 0 && (
                <div className="rounded-lg border border-[hsl(var(--accent-primary))]/50 bg-[hsl(var(--accent-primary))]/10 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                            {selectedEpisodes.size}개 선택됨
                        </span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
                                상태 변경
                            </button>
                            <button className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
                                5막 구조 변경
                            </button>
                            <button
                                onClick={() => setSelectedEpisodes(new Set())}
                                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-medium text-muted-foreground hover:border-red-500/50 hover:text-red-500 transition-colors"
                            >
                                선택 해제
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔥 Grid/List View */}
            <div className="flex-1 overflow-auto">
                {filteredChapters.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
                        <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-foreground font-medium">
                            {searchQuery ? '검색 결과가 없습니다' : '아직 작성된 회차가 없습니다'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {searchQuery ? '다른 키워드로 검색해보세요' : '첫 회차를 작성하여 시작하세요'}
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredChapters.map((chapter) => {
                            const actBadge = getActBadge(chapter.act);
                            const statusBadge = getStatusBadge(chapter.wordCount || 0);
                            const StatusIcon = statusBadge.icon;
                            const isSelected = selectedEpisodes.has(chapter.id);

                            return (
                                <div
                                    key={chapter.id}
                                    className={`rounded-lg border p-4 transition-all cursor-pointer ${
                                        isSelected
                                            ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                            : 'border-border bg-card hover:border-[hsl(var(--accent-primary))]/50'
                                    }`}
                                    onClick={() => toggleSelection(chapter.id)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-[hsl(var(--accent-primary))]">
                                                    {chapter.number}화
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${actBadge.color}`}>
                                                    {actBadge.label}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-foreground line-clamp-2">
                                                {chapter.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">글자 수</span>
                                            <span className="font-medium text-foreground">
                                                {(chapter.wordCount || 0).toLocaleString()}자
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className="h-4 w-4" />
                                            <span className={`text-xs font-medium ${statusBadge.color.split(' ')[1]}`}>
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex gap-2 pt-3 border-t border-border">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 편집 액션
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:border-[hsl(var(--accent-primary))]/50 transition-colors"
                                        >
                                            <Edit className="h-3 w-3" />
                                            편집
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 복제 액션
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:border-[hsl(var(--accent-primary))]/50 transition-colors"
                                        >
                                            <Copy className="h-3 w-3" />
                                            복제
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 삭제 액션
                                            }}
                                            className="px-2 py-1.5 rounded-lg border border-border bg-background hover:border-red-500/50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // List View (추후 구현)
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">List View (구현 예정)</p>
                    </div>
                )}
            </div>
        </div>
    );
};
