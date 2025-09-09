'use client';

import React, { useMemo, useState } from 'react';
import { Network, Brain, Sparkles, Lightbulb } from 'lucide-react';
import { ProjectElement, ProjectAnalysis } from '../../../../hooks/useProjectData';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';

interface MindmapCanvasProps {
    elements: ProjectElement[];
    analysis: ProjectAnalysis;
    onSelectElement: (elementId: string | null) => void;
    projectId?: string;
}

export const MindmapCanvas: React.FC<MindmapCanvasProps> = ({
    elements,
    analysis,
    onSelectElement,
    projectId = 'mindmap-demo'
}) => {
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);

    // 캐릭터와 챕터 간의 관계를 시각화하기 위한 계산
    const relationships = useMemo(() => {
        return analysis.relationships.filter(rel =>
            elements.find(e => e.id === rel.from) &&
            elements.find(e => e.id === rel.to)
        );
    }, [elements, analysis.relationships]);

    const handleElementClick = (elementId: string) => {
        onSelectElement(elementId);
    };

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* 🎯 헤더 영역 */}
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
                <h2 className="text-xl font-semibold flex items-center">
                    <Network className="h-5 w-5 mr-2" />
                    마인드맵 뷰
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

            <div className="flex-1 overflow-hidden px-6">
                <div className="grid grid-cols-12 gap-6 h-full">
                    {/* 🗂️ 마인드맵 메인 컨텐츠 */}
                    <div className={`${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300 overflow-y-auto h-full`}>
                        <div className="pb-6">{/* pb-6 for bottom padding */}
                            {elements.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <Network className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">마인드맵이 비어있습니다</h3>
                                    <p className="text-gray-500">사이드바에서 요소들을 추가하여 마인드맵을 구성해보세요.</p>
                                </Card>
                            ) : (
                                <div className="relative w-full h-[800px] bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-auto shadow-sm">
                                    {/* 🔗 관계선 시각화 */}
                                    <svg width="100%" height="100%" className="absolute inset-0">
                                        {relationships.map((rel, index) => {
                                            const fromElement = elements.find(e => e.id === rel.from);
                                            const toElement = elements.find(e => e.id === rel.to);

                                            if (!fromElement || !toElement) return null;

                                            // 간단한 위치 계산 (실제로는 더 복잡한 레이아웃 알고리즘 필요)
                                            const fromIndex = elements.indexOf(fromElement);
                                            const toIndex = elements.indexOf(toElement);

                                            const x1 = (fromIndex % 4) * 200 + 100;
                                            const y1 = Math.floor(fromIndex / 4) * 150 + 75;
                                            const x2 = (toIndex % 4) * 200 + 100;
                                            const y2 = Math.floor(toIndex / 4) * 150 + 75;

                                            return (
                                                <line
                                                    key={index}
                                                    x1={x1}
                                                    y1={y1}
                                                    x2={x2}
                                                    y2={y2}
                                                    stroke="#6b7280"
                                                    strokeWidth={2 + (rel.strength * 2)}
                                                    strokeOpacity={rel.strength}
                                                    className="dark:stroke-gray-400 transition-all duration-300"
                                                />
                                            );
                                        })}
                                    </svg>

                                    {/* 🎨 요소들을 절대 위치로 배치 */}
                                    <div className="relative w-full h-full p-4">
                                        {elements.slice(0, 12).map((element, index) => {
                                            const x = (index % 4) * 200;
                                            const y = Math.floor(index / 4) * 150;

                                            return (
                                                <div
                                                    key={element.id}
                                                    className="absolute cursor-pointer hover:scale-105 transition-all duration-200 hover:z-10"
                                                    style={{
                                                        left: `${x}px`,
                                                        top: `${y}px`,
                                                        width: '150px',
                                                    }}
                                                    onClick={() => handleElementClick(element.id)}
                                                >
                                                    <div className={`
                                                p-3 rounded-lg border-2 shadow-sm hover:shadow-md transition-all duration-200
                                                ${element.type === 'character'
                                                            ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                                            : element.type === 'chapter'
                                                                ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                                : 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                                                        }
                                            `}>
                                                        <h3 className="font-medium text-sm mb-1 truncate">{element.title}</h3>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                            {element.content}
                                                        </p>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <span className="px-2 py-1 bg-white/50 dark:bg-black/20 rounded text-xs">
                                                                {element.type}
                                                            </span>
                                                            {element.plotRelevance && (
                                                                <div className="flex items-center gap-1">
                                                                    <div className={`w-2 h-2 rounded-full ${element.plotRelevance >= 4 ? 'bg-red-500' :
                                                                        element.plotRelevance >= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                                        }`}></div>
                                                                    <span className="text-xs text-gray-500">{element.plotRelevance}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 💡 마인드맵 컨트롤 버튼들 */}
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <Button
                                            onClick={() => {
                                                console.log('마인드맵 자동 재배치');
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1 text-xs"
                                        >
                                            <Lightbulb className="w-3 h-3" />
                                            자동 배치
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* 📊 관계 통계 */}
                            {elements.length > 0 && relationships.length > 0 && (
                                <Card className="p-4">
                                    <h3 className="text-sm font-medium mb-2">연결 통계</h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-blue-600">{elements.length}</div>
                                            <div className="text-xs text-gray-600">총 요소</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-green-600">{relationships.length}</div>
                                            <div className="text-xs text-gray-600">연결 관계</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-purple-600">
                                                {Math.round(relationships.reduce((sum, rel) => sum + rel.strength, 0) / relationships.length * 100)}%
                                            </div>
                                            <div className="text-xs text-gray-600">평균 강도</div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* 🤖 AI 분석 사이드바 */}
                    {showAIAnalysis && (
                        <div className="col-span-4 transition-all duration-300 overflow-y-auto h-full">
                            <AIAnalysisPanel
                                projectId={projectId}
                                analysisType="mindmap"
                                data={{
                                    elements: elements,
                                    relationships: relationships,
                                    stats: {
                                        totalElements: elements.length,
                                        totalConnections: relationships.length,
                                        averageStrength: relationships.length > 0
                                            ? relationships.reduce((sum, rel) => sum + rel.strength, 0) / relationships.length
                                            : 0
                                    }
                                }}
                                context={{
                                    content: elements.map(e => `${e.title}: ${e.content}`).join('\n'),
                                    themes: elements.map(e => e.type).filter((v, i, a) => a.indexOf(v) === i),
                                    characters: elements.filter(e => e.type === 'character'),
                                    plotPoints: elements.filter(e => e.plotRelevance && e.plotRelevance >= 3)
                                }}
                                onAnalysisComplete={(result) => {
                                    console.log('마인드맵 AI 분석 완료:', result);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
