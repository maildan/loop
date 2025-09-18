'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useIntegratedProjectData as useProjectData, ProjectElement } from '../../../../hooks/useProjectData';
import { SynopsisViewProps, ViewMode, SYNOPSIS_STYLES } from './types';
import { SynopsisHeader } from './SynopsisHeader';
import { SynopsisContent } from './SynopsisContent';
import { SynopsisStats } from './SynopsisStats';

const SynopsisView = React.memo(({
    projectId,
    synopsisId,
    onBack,
    characters = [],
    notes = [],
    content = ''
}: SynopsisViewProps): React.ReactElement => {
    const { elements: structureElements, analysis, loading } = useProjectData(projectId);
    const [viewMode, setViewMode] = useState<ViewMode>('timeline');
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(true);

    // 🔥 main content를 ProjectElement로 변환하여 elements에 추가
    const elements = useMemo(() => {
        const allElements = [...structureElements];

        // main content가 있으면 ProjectElement로 변환하여 추가
        if (content && content.trim()) {
            const mainElement: ProjectElement = {
                id: 'main-content',
                type: 'main',
                title: '메인 스토리',
                content: content,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 0, // 최우선 순서
                wordCount: content.split(/\s+/).filter(word => word.trim().length > 0).length,
                plotRelevance: 5 as const
            };
            allElements.unshift(mainElement); // 맨 앞에 추가
        }

        return allElements;
    }, [structureElements, content]);

    // 🔥 연관 요소 찾기 함수
    const getRelatedElements = (elementId: string): ProjectElement[] => {
        if (!analysis) return [];

        const relationships = analysis.relationships.filter(
            rel => rel.from === elementId || rel.to === elementId
        );

        const relatedIds = relationships.map(rel =>
            rel.from === elementId ? rel.to : rel.from
        );

        return elements.filter(element => relatedIds.includes(element.id));
    };

    const handleSelectElement = (elementId: string) => {
        setSelectedElement(elementId);
    };

    if (loading) {
        return (
            <div className={SYNOPSIS_STYLES.loading}>
                <div className={SYNOPSIS_STYLES.loadingContent}>
                    <div className={SYNOPSIS_STYLES.loadingSpinner}></div>
                    <p className={SYNOPSIS_STYLES.loadingText}>분석 중...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className={SYNOPSIS_STYLES.emptyState}>
                <div className={SYNOPSIS_STYLES.emptyContent}>
                    <BarChart3 className={SYNOPSIS_STYLES.emptyIcon} />
                    <p className={SYNOPSIS_STYLES.emptyTitle}>분석할 데이터가 없습니다.</p>
                    <p className={SYNOPSIS_STYLES.emptySubtitle}>
                        챕터나 캐릭터를 추가해주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={SYNOPSIS_STYLES.container}>
            {/* 헤더 */}
            <SynopsisHeader
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showAnalysis={showAnalysis}
                onToggleAnalysis={() => setShowAnalysis(!showAnalysis)}
            />

            {/* 메인 콘텐츠 */}
            <SynopsisContent
                viewMode={viewMode}
                showAnalysis={showAnalysis}
                analysis={analysis}
                elements={elements}
                projectId={projectId}
                characters={characters}
                notes={notes}
                content={content}
                selectedElement={selectedElement}
                onSelectElement={handleSelectElement}
                getRelatedElements={getRelatedElements}
            />

            {/* 하단 통계 */}
            <SynopsisStats analysis={analysis} />
        </div>
    );
});

SynopsisView.displayName = 'SynopsisView';

export { SynopsisView };