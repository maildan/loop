import React from 'react';
import { Users, Heart, BookOpen } from 'lucide-react';
import { ProjectCharacter } from '../../../../../shared/types';

interface CharacterStatsProps {
    characters: ProjectCharacter[];
}

const CHARACTERS_STYLES = {
    statsGrid: 'grid grid-cols-3 gap-4 mt-4',
    statCard: 'p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700',
    statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mb-2',
    statValue: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    statLabel: 'text-xs text-slate-600 dark:text-gray-400',
};

export function CharacterStats({ characters }: CharacterStatsProps) {
    const stats = {
        total: characters.length,
        main: characters.filter(c => c.role?.includes('주인공') || c.role?.includes('주연')).length,
        detailed: characters.filter(c => c.appearance && c.personality && c.background).length,
    };

    return (
        <div className={CHARACTERS_STYLES.statsGrid}>
            <div className={CHARACTERS_STYLES.statCard}>
                <Users className={CHARACTERS_STYLES.statIcon} />
                <div className={CHARACTERS_STYLES.statValue}>{stats.total}</div>
                <div className={CHARACTERS_STYLES.statLabel}>총 인물</div>
            </div>
            <div className={CHARACTERS_STYLES.statCard}>
                <Heart className={CHARACTERS_STYLES.statIcon} />
                <div className={CHARACTERS_STYLES.statValue}>{stats.main}</div>
                <div className={CHARACTERS_STYLES.statLabel}>주요 인물</div>
            </div>
            <div className={CHARACTERS_STYLES.statCard}>
                <BookOpen className={CHARACTERS_STYLES.statIcon} />
                <div className={CHARACTERS_STYLES.statValue}>{stats.detailed}</div>
                <div className={CHARACTERS_STYLES.statLabel}>상세 설정</div>
            </div>
        </div>
    );
}