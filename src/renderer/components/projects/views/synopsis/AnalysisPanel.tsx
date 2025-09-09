'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, Target, GitBranch } from 'lucide-react';
import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';

interface AnalysisPanelProps {
    analysis: ProjectAnalysis;
    selectedElement: string | null;
    getRelatedElements: (elementId: string) => ProjectElement[];
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
    analysis,
    selectedElement,
    getRelatedElements
}) => {
    return (
        <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    AI 분석 결과
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* 발견된 문제점 */}
                {analysis.plotHoles.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-3 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            발견된 문제점
                        </h4>
                        <div className="space-y-2">
                            {analysis.plotHoles.map((issue, index) => (
                                <div key={index} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                                    <p className="text-sm text-red-800 dark:text-red-200">{issue}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 개선 제안 */}
                {analysis.suggestions.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            개선 제안
                        </h4>
                        <div className="space-y-2">
                            {analysis.suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 선택된 요소의 관련 요소들 */}
                {selectedElement && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                            <GitBranch className="h-4 w-4 mr-2" />
                            연관 요소
                        </h4>
                        <div className="space-y-2">
                            {getRelatedElements(selectedElement).map((element) => (
                                <div key={element.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                    <div className="font-medium text-sm mb-1">{element.title}</div>
                                    <div className="text-xs text-gray-500">{element.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
