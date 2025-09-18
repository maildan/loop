'use client';

import React from 'react';
import { ViewMode, SYNOPSIS_STYLES } from './types';
import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';
import { TimelinePanel } from './TimelinePanel';
import { OutlinePanel } from './OutlinePanel';
import { MindmapCanvas } from './MindmapCanvas';
import { AnalysisPanel } from './AnalysisPanel';

interface SynopsisContentProps {
    viewMode: ViewMode;
    showAnalysis: boolean;
    analysis: ProjectAnalysis;
    elements: ProjectElement[];
    projectId: string;
    characters: any[];
    notes: any[];
    content: string;
    selectedElement: string | null;
    onSelectElement: (elementId: string) => void;
    getRelatedElements: (elementId: string) => ProjectElement[];
}

export const SynopsisContent = React.memo(({
    viewMode,
    showAnalysis,
    analysis,
    elements,
    projectId,
    characters,
    notes,
    content,
    selectedElement,
    onSelectElement,
    getRelatedElements
}: SynopsisContentProps): React.ReactElement => {
    return (
        <div className={SYNOPSIS_STYLES.mainContent}>
            {/* 뷰 패널 */}
            {viewMode === 'timeline' && (
                <TimelinePanel
                    analysis={analysis}
                    elements={elements}
                    projectId={projectId}
                    characters={characters}
                    notes={notes}
                    content={content}
                />
            )}
            {viewMode === 'outline' && (
                <OutlinePanel
                    elements={elements}
                    projectId={projectId}
                    characters={characters}
                    notes={notes}
                    content={content}
                />
            )}
            {viewMode === 'mindmap' && (
                <MindmapCanvas
                    elements={elements}
                    analysis={analysis}
                    onSelectElement={(element) => onSelectElement(element.id)}
                />
            )}

            {/* 분석 사이드바 */}
            {showAnalysis && (
                <AnalysisPanel
                    analysis={analysis}
                    elements={elements}
                    selectedElement={selectedElement}
                    getRelatedElements={getRelatedElements}
                />
            )}
        </div>
    );
});

SynopsisContent.displayName = 'SynopsisContent';