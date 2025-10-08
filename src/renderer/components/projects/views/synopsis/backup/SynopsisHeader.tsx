'use client';

import React from 'react';
import { Clock, Map, Network, Eye } from 'lucide-react';
import { ViewMode, ViewModeConfig, SYNOPSIS_STYLES } from './types';

interface SynopsisHeaderProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    showAnalysis: boolean;
    onToggleAnalysis: () => void;
}

export const SynopsisHeader = React.memo(({
    viewMode,
    onViewModeChange,
    showAnalysis,
    onToggleAnalysis
}: SynopsisHeaderProps): React.ReactElement => {
    const viewModes: ViewModeConfig[] = [
        { id: 'timeline', name: '타임라인', icon: Clock },
        { id: 'outline', name: '아웃라인', icon: Map },
        { id: 'mindmap', name: '마인드맵', icon: Network },
    ];

    return (
        <div className={SYNOPSIS_STYLES.header}>
            <div className="flex items-center space-x-4">
                <h1 className={SYNOPSIS_STYLES.title}>
                    프로젝트 시놉시스
                </h1>
                <div className={SYNOPSIS_STYLES.modeButtons}>
                    {viewModes.map(({ id, name, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => onViewModeChange(id)}
                            className={`${SYNOPSIS_STYLES.modeButton} ${viewMode === id
                                    ? SYNOPSIS_STYLES.modeButtonActive
                                    : SYNOPSIS_STYLES.modeButtonInactive
                                }`}
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={onToggleAnalysis}
                    className={`${SYNOPSIS_STYLES.analysisToggle} ${showAnalysis
                            ? SYNOPSIS_STYLES.analysisToggleActive
                            : SYNOPSIS_STYLES.analysisToggleInactive
                        }`}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    분석 패널
                </button>
            </div>
        </div>
    );
});

SynopsisHeader.displayName = 'SynopsisHeader';