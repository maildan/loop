'use client';

import React, { useState } from 'react';
import { Map, Brain, Sparkles } from 'lucide-react';
import { ProjectElement } from '../../../../hooks/useProjectData';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';

interface OutlinePanelProps {
    elements: ProjectElement[];
    projectId?: string;
}

export const OutlinePanel: React.FC<OutlinePanelProps> = ({
    elements,
    projectId = 'outline-demo'
}) => {
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);

    return (
        <div className="flex-1 p-6 space-y-6">
            {/* 🎯 헤더 영역 */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                    <Map className="h-5 w-5 mr-2" />
                    아웃라인 뷰
                </h2>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                        variant={showAIAnalysis ? "secondary" : "outline"}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Brain className="w-4 h-4" />
                        {showAIAnalysis ? 'AI 분석 숨기기' : 'AI 분석'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* 🗂️ 아웃라인 메인 컨텐츠 */}
                <div className={`${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300`}>
                    {elements.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Map className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">아웃라인이 비어있습니다</h3>
                            <p className="text-gray-500">스토리 요소들을 추가하여 아웃라인을 구성해보세요.</p>
                            <div className="mt-6">
                                <Button
                                    onClick={() => {
                                        console.log('샘플 아웃라인 데이터 추가');
                                    }}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    샘플 데이터 추가
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {elements.map((element) => (
                                <div
                                    key={element.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium truncate">{element.title}</h3>
                                        <div className={`w-3 h-3 rounded-full ${element.plotRelevance && element.plotRelevance >= 4
                                            ? 'bg-red-500'
                                            : element.plotRelevance && element.plotRelevance >= 3
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                            }`}></div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                                        {element.content}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                            {element.type}
                                        </span>
                                        <span className="font-medium">
                                            중요도 {element.plotRelevance}/5
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🤖 AI 분석 사이드바 */}
                {showAIAnalysis && (
                    <div className="col-span-4 transition-all duration-300">
                        <AIAnalysisPanel
                            projectId={projectId}
                            analysisType="outline"
                            data={elements}
                            context={{
                                content: elements.map(e => `${e.title}: ${e.content}`).join('\n'),
                                themes: elements.map(e => e.type).filter((v, i, a) => a.indexOf(v) === i),
                                plotPoints: elements.filter(e => e.plotRelevance && e.plotRelevance >= 3)
                            }}
                            onAnalysisComplete={(result) => {
                                console.log('아웃라인 AI 분석 완료:', result);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
