'use client';

import React from 'react';
import { ProjectAnalysis } from '../../../../hooks/useProjectData';
import { SYNOPSIS_STYLES } from './types';

interface SynopsisStatsProps {
    analysis: ProjectAnalysis;
}

export const SynopsisStats = React.memo(({ analysis }: SynopsisStatsProps): React.ReactElement => {
    const stats = [
        {
            value: analysis.totalWords.toLocaleString(),
            label: '총 단어 수',
            color: 'text-[hsl(var(--chart-1))]'
        },
        {
            value: analysis.totalChapters.toString(),
            label: '챕터',
            color: 'text-[var(--success)]'
        },
        {
            value: analysis.totalCharacters.toString(),
            label: '캐릭터',
            color: 'text-[hsl(var(--chart-3))]'
        },
        {
            value: `${analysis.storyConsistency}%`,
            label: '스토리 일관성',
            color: 'text-[var(--warning)]'
        },
        {
            value: `${analysis.characterConsistency}%`,
            label: '캐릭터 일관성',
            color: 'text-[hsl(var(--chart-5))]'
        }
    ];

    return (
        <div className={SYNOPSIS_STYLES.statsBar}>
            <div className={SYNOPSIS_STYLES.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index}>
                        <div className={`${SYNOPSIS_STYLES.statValue} ${stat.color}`}>
                            {stat.value}
                        </div>
                        <div className={SYNOPSIS_STYLES.statLabel}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

SynopsisStats.displayName = 'SynopsisStats';