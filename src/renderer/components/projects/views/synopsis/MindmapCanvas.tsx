'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Network, Brain, Sparkles, Lightbulb, Plus, Minus, RotateCcw, BookOpen, Hash, FileText, User } from 'lucide-react';
import { ProjectElement, ProjectAnalysis } from '../../../../hooks/useProjectData';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';

// 🔥 Xmind 스타일 커스텀 노드 컴포넌트들
const CenterNode = ({ data }: { data: any }) => (
    <div className="relative">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-full shadow-lg border-4 border-white dark:border-gray-800 min-w-[160px] text-center">
            <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold text-lg">{data.label}</span>
            </div>
        </div>
    </div>
);

const BranchNode = ({ data }: { data: any }) => {
    const getColor = (category: string) => {
        switch (category) {
            case 'chapters': return 'from-blue-400 to-blue-600';
            case 'characters': return 'from-green-400 to-green-600';
            case 'ideas': return 'from-yellow-400 to-yellow-600';
            case 'synopsis': return 'from-purple-400 to-purple-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'chapters': return <Hash className="w-4 h-4" />;
            case 'characters': return <User className="w-4 h-4" />;
            case 'ideas': return <Lightbulb className="w-4 h-4" />;
            case 'synopsis': return <FileText className="w-4 h-4" />;
            default: return <Network className="w-4 h-4" />;
        }
    };

    return (
        <div className="relative">
            <div className={`bg-gradient-to-br ${getColor(data.category)} text-white px-4 py-3 rounded-lg shadow-md border-2 border-white dark:border-gray-800 min-w-[120px] text-center cursor-pointer hover:scale-105 transition-all duration-200`}>
                <div className="flex items-center justify-center gap-2">
                    {getIcon(data.category)}
                    <span className="font-medium text-sm">{data.label}</span>
                </div>
            </div>
        </div>
    );
};

const LeafNode = ({ data }: { data: any }) => (
    <div className="relative">
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-w-[100px] max-w-[200px]">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {data.label}
            </div>
            {data.subtitle && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {data.subtitle}
                </div>
            )}
        </div>
    </div>
);

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
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    // 🔥 Xmind 스타일 방사형 레이아웃 계산
    const mindmapData = useMemo(() => {
        // 데이터를 카테고리별로 그룹화
        const grouped = {
            chapters: elements.filter(e => e.type === 'chapter'),
            characters: elements.filter(e => e.type === 'character'),
            ideas: elements.filter(e => e.type === 'idea'),
            synopsis: elements.filter(e => e.type === 'synopsis'),
        };

        // 중앙 노드
        const centerNode = {
            id: 'center',
            type: 'centerNode',
            label: '프로젝트',
            x: 0,
            y: 0,
            level: 0
        };

        // 메인 브랜치들 (카테고리)
        const mainBranches: any[] = [];
        const categories = Object.keys(grouped).filter(key => grouped[key as keyof typeof grouped].length > 0);
        const angleStep = (2 * Math.PI) / Math.max(categories.length, 1);

        categories.forEach((category, index) => {
            const angle = index * angleStep;
            const radius = 200;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            mainBranches.push({
                id: `branch-${category}`,
                type: 'branchNode',
                label: category === 'chapters' ? '챕터' :
                    category === 'characters' ? '인물' :
                        category === 'ideas' ? '아이디어' : '시놉시스',
                category,
                x,
                y,
                level: 1,
                angle
            });
        });

        // 서브 브랜치들 (개별 요소들)
        const subBranches: any[] = [];
        categories.forEach((category, categoryIndex) => {
            const items = grouped[category as keyof typeof grouped];
            const parentBranch = mainBranches[categoryIndex];
            if (!parentBranch || items.length === 0) return;

            const subAngleStep = Math.PI / 6; // 30도씩
            const startAngle = parentBranch.angle - (items.length - 1) * subAngleStep / 2;

            items.forEach((item, itemIndex) => {
                const angle = startAngle + itemIndex * subAngleStep;
                const radius = 120;
                const x = parentBranch.x + Math.cos(angle) * radius;
                const y = parentBranch.y + Math.sin(angle) * radius;

                subBranches.push({
                    id: item.id,
                    type: 'leafNode',
                    label: item.title,
                    subtitle: item.content?.slice(0, 50) + '...',
                    category,
                    x,
                    y,
                    level: 2,
                    data: item
                });
            });
        });

        // 연결선 데이터
        const connections: any[] = [];
        // 중앙 → 메인 브랜치
        mainBranches.forEach(branch => {
            connections.push({
                from: { x: centerNode.x, y: centerNode.y },
                to: { x: branch.x, y: branch.y },
                type: 'main'
            });
        });

        // 메인 브랜치 → 서브 브랜치
        subBranches.forEach(sub => {
            const parent = mainBranches.find(b => b.category === sub.category);
            if (parent) {
                connections.push({
                    from: { x: parent.x, y: parent.y },
                    to: { x: sub.x, y: sub.y },
                    type: 'sub'
                });
            }
        });

        return {
            centerNode,
            mainBranches,
            subBranches,
            connections
        };
    }, [elements]);

    const handleNodeClick = useCallback((nodeData: any) => {
        if (nodeData.data) {
            onSelectElement(nodeData.data.id);
        }
    }, [onSelectElement]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.3));
    const handleReset = () => {
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
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
                    {/* 🔥 줌 컨트롤 */}
                    <div className="flex items-center gap-1 mr-2">
                        <Button
                            onClick={handleZoomOut}
                            variant="outline"
                            size="sm"
                            className="p-2"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Button
                            onClick={handleZoomIn}
                            variant="outline"
                            size="sm"
                            className="p-2"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size="sm"
                            className="p-2 ml-1"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>

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
                    <div className={`${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300 overflow-hidden h-full`}>
                        <div className="w-full h-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg relative overflow-auto">
                            {elements.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Card className="p-8 text-center">
                                        <Network className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">마인드맵이 비어있습니다</h3>
                                        <p className="text-gray-500">사이드바에서 요소들을 추가하여 마인드맵을 구성해보세요.</p>
                                    </Card>
                                </div>
                            ) : (
                                <div
                                    className="absolute inset-0 w-full h-full"
                                    style={{
                                        transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                                        transformOrigin: 'center center',
                                        transition: 'transform 0.2s ease-out'
                                    }}
                                >
                                    {/* 🔥 Xmind 스타일 SVG 캔버스 */}
                                    <svg
                                        className="absolute inset-0 w-full h-full"
                                        style={{ minWidth: '1200px', minHeight: '800px' }}
                                        viewBox="-600 -400 1200 800"
                                    >
                                        {/* 🔗 연결선들 - 부드러운 곡선 */}
                                        {mindmapData.connections.map((conn, index) => (
                                            <path
                                                key={index}
                                                d={`M ${conn.from.x} ${conn.from.y} Q ${(conn.from.x + conn.to.x) / 2} ${(conn.from.y + conn.to.y) / 2 - 30} ${conn.to.x} ${conn.to.y}`}
                                                stroke={conn.type === 'main' ? '#6366f1' : '#94a3b8'}
                                                strokeWidth={conn.type === 'main' ? 4 : 2}
                                                fill="none"
                                                className="transition-all duration-300"
                                            />
                                        ))}
                                    </svg>

                                    {/* 🎯 중앙 노드 */}
                                    <div
                                        className="absolute"
                                        style={{
                                            left: '50%',
                                            top: '50%',
                                            transform: `translate(-50%, -50%)`
                                        }}
                                    >
                                        <CenterNode data={mindmapData.centerNode} />
                                    </div>

                                    {/* 🌿 메인 브랜치 노드들 */}
                                    {mindmapData.mainBranches.map((branch) => (
                                        <div
                                            key={branch.id}
                                            className="absolute"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                transform: `translate(calc(-50% + ${branch.x}px), calc(-50% + ${branch.y}px))`
                                            }}
                                        >
                                            <BranchNode data={branch} />
                                        </div>
                                    ))}

                                    {/* 🍃 서브 브랜치 노드들 */}
                                    {mindmapData.subBranches.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="absolute"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                transform: `translate(calc(-50% + ${sub.x}px), calc(-50% + ${sub.y}px))`
                                            }}
                                            onClick={() => handleNodeClick(sub)}
                                        >
                                            <LeafNode data={sub} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 🤖 AI 분석 사이드바 */}
                    {showAIAnalysis && (
                        <div className="col-span-4 transition-all duration-300 overflow-y-auto h-full">
                            <AIAnalysisPanel
                                projectId={projectId}
                                analysisType="mindmap"
                                data={elements}
                                context={{
                                    content: elements.map(e => `${e.title}: ${e.content}`).join('\n')
                                }}
                                onAnalysisComplete={(result) => {
                                    console.log('🧠 마인드맵 AI 분석 완료:', result);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
