import React from 'react';
import type { WriteStatsProps } from './types';

const WRITE_STATS_STYLES = {
    statsBar: 'fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-[color:hsl(var(--card))]/90 backdrop-blur-sm rounded-full shadow-[var(--shadow-md)] border border-[color:hsl(var(--border))] text-xs text-[color:hsl(var(--muted-foreground))] z-30 opacity-0 hover:opacity-100 transition-opacity duration-300',
    statItem: 'flex items-center gap-1 text-[color:hsl(var(--muted-foreground))]',
} as const;

export const WriteStats = React.memo<WriteStatsProps>(({ stats, showStats, distractionFree }) => {
    if (!showStats || distractionFree) return null;

    return (
        <div className={WRITE_STATS_STYLES.statsBar}>
            <div className={WRITE_STATS_STYLES.statItem}>
                <span>{stats.words} 단어</span>
            </div>
            <div className="w-px h-3 bg-[color:hsl(var(--border))]" />
            <div className={WRITE_STATS_STYLES.statItem}>
                <span>{stats.chars} 글자</span>
            </div>
            <div className="w-px h-3 bg-[color:hsl(var(--border))]" />
            <div className={WRITE_STATS_STYLES.statItem}>
                <span>{stats.sentences} 문장</span>
            </div>
            <div className="w-px h-3 bg-[color:hsl(var(--border))]" />
            <div className={WRITE_STATS_STYLES.statItem}>
                <span>약 {stats.readingTime}분 읽기</span>
            </div>
        </div>
    );
});

WriteStats.displayName = 'WriteStats';