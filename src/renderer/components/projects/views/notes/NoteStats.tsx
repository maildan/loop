'use client';

import React from 'react';
import { Lightbulb, Target, BookOpen, StickyNote } from 'lucide-react';
import { NoteStatsProps, NOTES_STYLES } from './types';

export const NoteStats = React.memo(({ notes }: NoteStatsProps): React.ReactElement => {
    const totalNotes = notes.length;
    const ideaNotes = notes.filter(note => note.type === 'idea').length;
    const goalNotes = notes.filter(note => note.type === 'goal').length;
    const referenceNotes = notes.filter(note => note.type === 'reference').length;

    const stats = [
        {
            icon: StickyNote,
            label: '전체 노트',
            value: totalNotes,
            color: 'text-amber-600 dark:text-amber-400'
        },
        {
            icon: Lightbulb,
            label: '아이디어',
            value: ideaNotes,
            color: 'text-yellow-600 dark:text-yellow-400'
        },
        {
            icon: Target,
            label: '목표',
            value: goalNotes,
            color: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            icon: BookOpen,
            label: '참고자료',
            value: referenceNotes,
            color: 'text-blue-600 dark:text-blue-400'
        }
    ];

    return (
        <div className={NOTES_STYLES.statsGrid}>
            {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <div key={index} className={NOTES_STYLES.statCard}>
                        <IconComponent className={`${NOTES_STYLES.statIcon} ${stat.color}`} />
                        <div className={NOTES_STYLES.statValue}>{stat.value}</div>
                        <div className={NOTES_STYLES.statLabel}>{stat.label}</div>
                    </div>
                );
            })}
        </div>
    );
});

NoteStats.displayName = 'NoteStats';