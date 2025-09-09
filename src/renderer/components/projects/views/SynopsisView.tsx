'use client';

import React, { useState } from 'react';
import { Clock, Map, Network, Eye, BarChart3 } from 'lucide-react';
import { useIntegratedProjectData as useProjectData, ProjectElement } from '../../../hooks/useProjectData';

// 🔥 모듈화된 컴포넌트들 import
import { TimelinePanel } from './synopsis/TimelinePanel';
import { OutlinePanel } from './synopsis/OutlinePanel';
import { MindmapCanvas } from './synopsis/MindmapCanvas';
import { AnalysisPanel } from './synopsis/AnalysisPanel';

interface SynopsisViewProps {
    projectId: string;
    synopsisId?: string; // 🔥 ProjectEditor에서 전달되는 prop
    onBack?: () => void; // 🔥 ProjectEditor에서 전달되는 prop
}

type ViewMode = 'timeline' | 'outline' | 'mindmap';

export const SynopsisView: React.FC<SynopsisViewProps> = ({ projectId, synopsisId, onBack }) => {
    const { elements, analysis, loading } = useProjectData(projectId);
    const [viewMode, setViewMode] = useState<ViewMode>('timeline');
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(true);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">분석 중...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">분석할 데이터가 없습니다.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        챕터나 캐릭터를 추가해주세요.
                    </p>
                </div>
            </div>
        );
    }

    const viewModes = [
        { id: 'timeline', name: '타임라인', icon: Clock },
        { id: 'outline', name: '아웃라인', icon: Map },
        { id: 'mindmap', name: '마인드맵', icon: Network },
    ] as const;

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* 🔥 헤더: 뷰 모드 선택 */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        프로젝트 시놉시스
                    </h1>
                    <div className="flex items-center space-x-2">
                        {viewModes.map(({ id, name, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setViewMode(id)}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === id
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
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
                        onClick={() => setShowAnalysis(!showAnalysis)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showAnalysis
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        분석 패널
                    </button>
                </div>
            </div>

            {/* 🔥 메인 콘텐츠 */}
            <div className="flex-1 flex overflow-hidden">
                {/* 뷰 패널 */}
                {viewMode === 'timeline' && <TimelinePanel analysis={analysis} />}
                {viewMode === 'outline' && <OutlinePanel elements={elements} />}
                {viewMode === 'mindmap' && (
                    <MindmapCanvas
                        elements={elements}
                        analysis={analysis}
                        onSelectElement={setSelectedElement}
                    />
                )}

                {/* 분석 사이드바 */}
                {showAnalysis && (
                    <AnalysisPanel
                        analysis={analysis}
                        selectedElement={selectedElement}
                        getRelatedElements={getRelatedElements}
                    />
                )}
            </div>

            {/* 🔥 하단 통계 */}
            <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
                <div className="grid grid-cols-5 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {analysis.totalWords.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">총 단어 수</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {analysis.totalChapters}
                        </div>
                        <div className="text-sm text-gray-500">챕터</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {analysis.totalCharacters}
                        </div>
                        <div className="text-sm text-gray-500">캐릭터</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {analysis.storyConsistency}%
                        </div>
                        <div className="text-sm text-gray-500">스토리 일관성</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {analysis.characterConsistency}%
                        </div>
                        <div className="text-sm text-gray-500">캐릭터 일관성</div>
                    </div>
                </div>
            </div>
        </div>
    );
};