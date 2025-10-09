'use client';

import React, { useState } from 'react';
import { SYNOPSIS_STYLES } from './types';
import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';
import { SynopsisView } from './SynopsisView';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Brain } from 'lucide-react';
import { Button } from '../../../ui/Button';

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
    const [showAISidebar, setShowAISidebar] = useState(false);

    return (
        <div className="flex h-full overflow-hidden">
            {/* 메인 콘텐츠 */}
            <div className="flex-1 overflow-auto">
                <SynopsisView
                    projectId={projectId}
                    elements={elements}
                    characters={characters}
                    notes={notes}
                    content={content}
                />
            </div>

            {/* AI 분석 Sidebar */}
            {showAISidebar && (
                <aside className="w-96 border-l border-border bg-card overflow-auto">
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 p-4 backdrop-blur-sm">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Brain className="h-5 w-5 text-[hsl(var(--accent-primary))]" />
                            AI 분석
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAISidebar(false)}
                        >
                            ✕
                        </Button>
                    </div>
                    <div className="p-4">
                        <AIAnalysisPanel
                            projectId={projectId}
                            analysisType="korean"
                            data={{
                                content,
                                title: elements.find(e => e.type === 'main')?.title || '',
                            }}
                            context={{
                                content,
                                characters,
                                notes,
                            }}
                        />
                    </div>
                </aside>
            )}

            {/* AI 분석 토글 버튼 */}
            {!showAISidebar && (
                <button
                    onClick={() => setShowAISidebar(true)}
                    className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent-primary))] text-white shadow-lg transition-transform hover:scale-110"
                    title="AI 분석 열기"
                >
                    <Brain className="h-6 w-6" />
                </button>
            )}
        </div>
    );
});

SynopsisContent.displayName = 'SynopsisContent';