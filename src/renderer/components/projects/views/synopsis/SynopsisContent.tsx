'use client';

import React from 'react';
import { SYNOPSIS_STYLES } from './types';
import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';
import { KoreanSynopsisView } from './KoreanSynopsisView';

interface SynopsisContentProps {
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
            <KoreanSynopsisView
                projectId={projectId}
                elements={elements}
                characters={characters}
                notes={notes}
                content={content}
            />
        </div>
    );
});

SynopsisContent.displayName = 'SynopsisContent';