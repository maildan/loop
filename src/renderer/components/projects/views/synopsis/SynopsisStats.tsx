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
            color: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            value: analysis.totalChapters.toString(),
            label: '챕터',
            color: 'text-green-600 dark:text-green-400'
        },
        {
            value: analysis.totalCharacters.toString(),
            label: '캐릭터',
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            value: `${analysis.storyConsistency}%`,
            label: '스토리 일관성',
            color: 'text-yellow-600 dark:text-yellow-400'
        },
        {
            value: `${analysis.characterConsistency}%`,
            label: '캐릭터 일관성',
            color: 'text-purple-600 dark:text-purple-400'
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