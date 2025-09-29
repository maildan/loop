import React from 'react';
import { Users, FileText, MapPin, MessageSquare, Heart, MoreHorizontal, Edit3, Trash2, Star, Clock, Tag } from 'lucide-react';
import { IdeaItem, CATEGORY_STYLES, STAGE_STYLES } from './types';

interface IdeaCardProps {
    idea: IdeaItem;
    onClick: (idea: IdeaItem) => void;
    onEdit: (idea: IdeaItem) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    isDragged?: boolean;
    isDragOver?: boolean;
    onDragStart?: (e: React.DragEvent, id: string) => void;
    onDragOver?: (e: React.DragEvent, id: string) => void;
    onDragLeave?: () => void;
    onDrop?: (e: React.DragEvent, id: string) => void;
}

const ICON_MAP = {
    character: Users,
    plot: FileText,
    setting: MapPin,
    dialogue: MessageSquare,
    theme: Heart,
    other: MoreHorizontal,
};

const PRIORITY_STYLES = {
    low: 'text-[var(--success)]',
    medium: 'text-[var(--warning)]',
    high: 'text-[hsl(var(--destructive))]',
};

const IDEA_STYLES = {
    ideaCard: 'group rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer',
    cardHeader: 'p-4 border-b border-border/60',
    cardTitle: 'font-semibold text-foreground mb-2 group-hover:text-[hsl(var(--accent-primary))] transition-colors line-clamp-2',
    cardMeta: 'flex items-center gap-3',
    categoryBadge: 'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border',
    stageBadge: 'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
    cardContent: 'p-4',
    cardDescription: 'text-sm text-muted-foreground line-clamp-3 mb-3',
    cardTags: 'flex flex-wrap gap-1 mb-3',
    tag: 'inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md border border-border/60',
    cardFooter: 'flex items-center justify-between',
    cardDate: 'text-xs text-muted-foreground',
    cardActions: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground',
    actionButton: 'p-1.5 rounded-md transition-colors hover:bg-muted hover:text-foreground',
    favoriteButton: 'p-1.5 rounded-md transition-colors hover:bg-muted',
    favoriteButtonActive: 'text-[hsl(var(--accent-primary))]',
    favoriteButtonInactive: 'text-muted-foreground',
    deleteButton: 'p-1.5 rounded-md transition-colors hover:bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]',
};

export function IdeaCard({
    idea,
    onClick,
    onEdit,
    onDelete,
    onToggleFavorite,
    isDragged = false,
    isDragOver = false,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop
}: IdeaCardProps) {
    const CategoryIcon = ICON_MAP[idea.category];
    const categoryStyle = CATEGORY_STYLES[idea.category];
    const stageStyle = STAGE_STYLES[idea.stage];

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick(idea);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(idea);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(idea.id);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(idea.id);
    };

    return (
        <div
            className={`${IDEA_STYLES.ideaCard} ${isDragged ? 'opacity-50' : ''
                } ${isDragOver ? 'ring-2 ring-[hsl(var(--accent-primary))]' : ''
                }`}
            onClick={handleCardClick}
            draggable={!!onDragStart}
            onDragStart={onDragStart ? (e) => onDragStart(e, idea.id) : undefined}
            onDragOver={onDragOver ? (e) => onDragOver(e, idea.id) : undefined}
            onDragLeave={onDragLeave}
            onDrop={onDrop ? (e) => onDrop(e, idea.id) : undefined}
        >
            <div className={IDEA_STYLES.cardHeader}>
                <h3 className={IDEA_STYLES.cardTitle}>{idea.title}</h3>
                <div className={IDEA_STYLES.cardMeta}>
                    <span className={`${IDEA_STYLES.categoryBadge} ${categoryStyle.color}`}>
                        <CategoryIcon className="w-3 h-3" />
                        <span>{categoryStyle.label}</span>
                    </span>
                    <span className={`${IDEA_STYLES.stageBadge} ${stageStyle.color}`}>
                        {stageStyle.label}
                    </span>
                </div>
            </div>

            <div className={IDEA_STYLES.cardContent}>
                {idea.content && (
                    <p className={IDEA_STYLES.cardDescription}>
                        {idea.content}
                    </p>
                )}

                {idea.tags.length > 0 && (
                    <div className={IDEA_STYLES.cardTags}>
                        {idea.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className={IDEA_STYLES.tag}>
                                <Tag className="w-2.5 h-2.5 text-muted-foreground" />
                                <span>{tag}</span>
                            </span>
                        ))}
                        {idea.tags.length > 3 && (
                            <span className={IDEA_STYLES.tag}>
                                +{idea.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div className={IDEA_STYLES.cardFooter}>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className={IDEA_STYLES.cardDate}>
                            {idea.updatedAt.toLocaleDateString()}
                        </span>
                        {idea.priority !== 'medium' && (
                            <span className={`text-xs font-medium ${PRIORITY_STYLES[idea.priority]}`}>
                                {idea.priority === 'high' ? '높음' : '낮음'}
                            </span>
                        )}
                    </div>

                    <div className={IDEA_STYLES.cardActions}>
                        <button
                            onClick={handleFavoriteClick}
                            className={`${IDEA_STYLES.favoriteButton} ${idea.isFavorite
                                    ? IDEA_STYLES.favoriteButtonActive
                                    : IDEA_STYLES.favoriteButtonInactive
                                }`}
                            title={idea.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                        >
                            <Star className={`w-4 h-4 ${idea.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleEditClick}
                            className={IDEA_STYLES.actionButton}
                            title="편집"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className={IDEA_STYLES.deleteButton}
                            title="삭제"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}