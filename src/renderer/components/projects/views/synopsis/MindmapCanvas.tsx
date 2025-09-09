'use client';

import React, { useMemo } from 'react';
import { Network } from 'lucide-react';
import { ProjectElement, ProjectAnalysis } from '../../../../hooks/useProjectData';

interface MindmapCanvasProps {
    elements: ProjectElement[];
    analysis: ProjectAnalysis;
    onSelectElement: (elementId: string | null) => void;
}

export const MindmapCanvas: React.FC<MindmapCanvasProps> = ({ 
    elements, 
    analysis, 
    onSelectElement 
}) => {
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
        <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Network className="h-5 w-5 mr-2" />
                마인드맵 뷰
            </h2>
            <div className="relative w-full h-96 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
                <svg width="100%" height="100%" className="absolute inset-0">
                    {/* 관계선 그리기 */}
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
                                strokeWidth="2"
                                strokeOpacity={rel.strength}
                                className="dark:stroke-gray-400"
                            />
                        );
                    })}
                </svg>

                {/* 요소들을 절대 위치로 배치 */}
                <div className="relative w-full h-full p-4">
                    {elements.slice(0, 12).map((element, index) => {
                        const x = (index % 4) * 200;
                        const y = Math.floor(index / 4) * 150;

                        return (
                            <div
                                key={element.id}
                                className="absolute cursor-pointer hover:scale-105 transition-transform"
                                style={{
                                    left: `${x}px`,
                                    top: `${y}px`,
                                    width: '150px',
                                }}
                                onClick={() => handleElementClick(element.id)}
                            >
                                <div className={`
                                    p-3 rounded-lg border-2 shadow-sm
                                    ${element.type === 'character' 
                                        ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                                        : element.type === 'chapter'
                                        ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
                                        : 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700'
                                    }
                                `}>
                                    <h3 className="font-medium text-sm mb-1 truncate">{element.title}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {element.content}
                                    </p>
                                    <div className="mt-2 text-xs">
                                        <span className="px-2 py-1 bg-white/50 dark:bg-black/20 rounded">
                                            {element.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
