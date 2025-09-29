import React from 'react';
import { ChevronLeft, Plus, Grid3x3, List } from 'lucide-react';

interface IdeaHeaderProps {
    onBack: () => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onAddIdea: () => void;
}

const IDEA_STYLES = {
    header: 'sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur-sm',
    headerTop: 'flex items-center justify-between p-4',
    backButton: 'flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
    title: 'text-xl font-bold text-foreground',
    headerActions: 'flex items-center gap-2',
    viewToggle: 'flex items-center rounded-lg border border-border/60 bg-muted/60 p-1',
    viewButton: 'p-2 rounded-md transition-colors',
    viewButtonActive: 'bg-background text-[hsl(var(--accent-primary))] shadow-sm',
    viewButtonInactive: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
    addButton: 'flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[var(--accent-hover)]',
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