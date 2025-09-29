import React from 'react';
import { Lightbulb, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { IdeaItem } from './types';
import { IdeaCard } from './IdeaCard';

interface IdeaListProps {
    ideas: IdeaItem[];
    viewMode: 'grid' | 'list';
    onIdeaClick: (idea: IdeaItem) => void;
    onIdeaEdit: (idea: IdeaItem) => void;
    onIdeaDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    draggedItemId?: string | null;
    dragOverItemId?: string | null;
    onDragStart?: (e: React.DragEvent, id: string) => void;
    onDragOver?: (e: React.DragEvent, id: string) => void;
    onDragLeave?: () => void;
    onDrop?: (e: React.DragEvent, id: string) => void;
}

const IDEA_STYLES = {
    content: 'flex-1 overflow-hidden',
    scrollArea: 'h-full overflow-y-auto px-6 pb-6',
    statsGrid: 'grid grid-cols-2 gap-4 mb-6 md:grid-cols-4',
    statCard: 'rounded-xl border border-border bg-card p-4 shadow-sm',
    statIcon: 'mb-2 h-6 w-6 text-[hsl(var(--accent-primary))]',
    statValue: 'text-2xl font-bold text-foreground',
    statLabel: 'text-sm text-muted-foreground',
    cardsContainer: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    listContainer: 'space-y-3',
    emptyState: 'py-16 text-center',
    emptyIcon: 'mx-auto mb-4 h-16 w-16 text-muted-foreground',
    emptyTitle: 'mb-2 text-lg font-semibold text-muted-foreground',
    emptyDescription: 'mx-auto max-w-md text-muted-foreground',
};

export function IdeaList({
    ideas,
    viewMode,
    onIdeaClick,
    onIdeaEdit,
    onIdeaDelete,
    onToggleFavorite,
    draggedItemId,
    dragOverItemId,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop
}: IdeaListProps) {
    // 통계 계산
    const stats = {
        total: ideas.length,
        favorites: ideas.filter(idea => idea.isFavorite).length,
        applied: ideas.filter(idea => idea.stage === 'applied').length,
        highPriority: ideas.filter(idea => idea.priority === 'high').length,
    };

    if (ideas.length === 0) {
        return (
            <div className={IDEA_STYLES.content}>
                <div className={IDEA_STYLES.scrollArea}>
                    {/* 통계 (비어있을 때도 표시) */}
                    <div className={IDEA_STYLES.statsGrid}>
                        <div className={IDEA_STYLES.statCard}>
                            <Lightbulb className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>0</div>
                            <div className={IDEA_STYLES.statLabel}>총 아이디어</div>
                        </div>
                        <div className={IDEA_STYLES.statCard}>
                            <Star className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>0</div>
                            <div className={IDEA_STYLES.statLabel}>즐겨찾기</div>
                        </div>
                        <div className={IDEA_STYLES.statCard}>
                            <ArrowUpRight className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>0</div>
                            <div className={IDEA_STYLES.statLabel}>적용됨</div>
                        </div>
                        <div className={IDEA_STYLES.statCard}>
                            <TrendingUp className={IDEA_STYLES.statIcon} />
                            <div className={IDEA_STYLES.statValue}>0</div>
                            <div className={IDEA_STYLES.statLabel}>높은 우선순위</div>
                        </div>
                    </div>

                    <div className={IDEA_STYLES.emptyState}>
                        <Lightbulb className={IDEA_STYLES.emptyIcon} />
                        <h3 className={IDEA_STYLES.emptyTitle}>아이디어가 없습니다</h3>
                        <p className={IDEA_STYLES.emptyDescription}>
                            위의 빠른 캡처를 사용하여 첫 번째 아이디어를 추가해보세요!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={IDEA_STYLES.content}>
            <div className={IDEA_STYLES.scrollArea}>
                {/* 통계 */}
                <div className={IDEA_STYLES.statsGrid}>
                    <div className={IDEA_STYLES.statCard}>
                        <Lightbulb className={IDEA_STYLES.statIcon} />
                        <div className={IDEA_STYLES.statValue}>{stats.total}</div>
                        <div className={IDEA_STYLES.statLabel}>총 아이디어</div>
                    </div>
                    <div className={IDEA_STYLES.statCard}>
                        <Star className={IDEA_STYLES.statIcon} />
                        <div className={IDEA_STYLES.statValue}>{stats.favorites}</div>
                        <div className={IDEA_STYLES.statLabel}>즐겨찾기</div>
                    </div>
                    <div className={IDEA_STYLES.statCard}>
                        <ArrowUpRight className={IDEA_STYLES.statIcon} />
                        <div className={IDEA_STYLES.statValue}>{stats.applied}</div>
                        <div className={IDEA_STYLES.statLabel}>적용됨</div>
                    </div>
                    <div className={IDEA_STYLES.statCard}>
                        <TrendingUp className={IDEA_STYLES.statIcon} />
                        <div className={IDEA_STYLES.statValue}>{stats.highPriority}</div>
                        <div className={IDEA_STYLES.statLabel}>높은 우선순위</div>
                    </div>
                </div>

                {/* 아이디어 목록 */}
                <div className={viewMode === 'grid' ? IDEA_STYLES.cardsContainer : IDEA_STYLES.listContainer}>
                    {ideas.map((idea) => (
                        <IdeaCard
                            key={idea.id}
                            idea={idea}
                            onClick={onIdeaClick}
                            onEdit={onIdeaEdit}
                            onDelete={onIdeaDelete}
                            onToggleFavorite={onToggleFavorite}
                            isDragged={draggedItemId === idea.id}
                            isDragOver={dragOverItemId === idea.id}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}