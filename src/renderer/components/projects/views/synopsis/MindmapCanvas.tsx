/**
 * 🧠 마인드맵 캔버스 - 방사형 레이아웃으로 완전 재설계
 * 프로젝트 요소들을 아름다운 방사형으로 배치
 */

'use client';

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { Card } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Logger } from '../../../../../shared/logger';
import {
    BookOpen,
    User,
    Lightbulb,
    FileText,
    Target,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Maximize2
} from 'lucide-react';

interface ProjectElement {
    id: string;
    title: string;
    content?: string;
    type: 'main' | 'chapter' | 'character' | 'idea' | 'synopsis' | 'memo' | 'note';
    tags?: string[];
    wordCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}interface ProjectAnalysis {
    totalWords: number;
    totalChapters: number;
    totalCharacters: number;
    timeline: any[];
    relationships: any[];
}

interface MindmapCanvasProps {
    elements: ProjectElement[];
    analysis?: ProjectAnalysis;
    onSelectElement?: (element: ProjectElement) => void;
    projectId?: string;
}

export const MindmapCanvas: React.FC<MindmapCanvasProps> = ({
    elements = [],
    analysis,
    onSelectElement,
    projectId = 'mindmap-demo'
}) => {
    const [zoom, setZoom] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // 🔥 단순하고 아름다운 방사형 레이아웃
    const mindmapData = useMemo(() => {
        console.log('🔍 [MindmapCanvas] Elements received:', elements.length);

        // 🔥 1. 중앙 프로젝트 노드
        const centerNode = {
            id: 'center',
            type: 'center',
            label: '프로젝트',
            x: 0,
            y: 0,
            level: 0,
            radius: 80
        };

        // 🔥 2. 데이터를 타입별로 분류
        const categories = [
            { type: 'main', items: elements.filter(e => e.type === 'main'), label: '메인 스토리', color: '#8b5cf6', icon: '📚' },
            { type: 'chapter', items: elements.filter(e => e.type === 'chapter'), label: '챕터', color: '#3b82f6', icon: '📖' },
            { type: 'character', items: elements.filter(e => e.type === 'character'), label: '캐릭터', color: '#10b981', icon: '👤' },
            { type: 'idea', items: elements.filter(e => e.type === 'idea'), label: '아이디어', color: '#f59e0b', icon: '💡' },
            { type: 'synopsis', items: elements.filter(e => e.type === 'synopsis'), label: '시놉시스', color: '#ef4444', icon: '📝' }
        ].filter(cat => cat.items.length > 0); // 빈 카테고리 제외

        // 🔥 3. 카테고리 노드들을 원형으로 배치
        const categoryNodes: any[] = [];
        const itemNodes: any[] = [];
        const connections: any[] = [];

        const categoryRadius = 250; // 카테고리 노드들의 거리
        const itemRadius = 150; // 각 아이템들의 거리

        categories.forEach((category, categoryIndex) => {
            const categoryAngle = (categoryIndex / categories.length) * 2 * Math.PI;
            const categoryX = Math.cos(categoryAngle) * categoryRadius;
            const categoryY = Math.sin(categoryAngle) * categoryRadius;

            // 카테고리 노드 생성
            const categoryNode = {
                id: `category-${category.type}`,
                type: 'category',
                label: category.label,
                icon: category.icon,
                color: category.color,
                x: categoryX,
                y: categoryY,
                level: 1,
                radius: 60,
                itemCount: category.items.length
            };

            categoryNodes.push(categoryNode);

            // 중앙에서 카테고리로 연결선
            connections.push({
                from: 'center',
                to: categoryNode.id,
                type: 'main'
            });

            // 🔥 4. 각 카테고리의 아이템들을 해당 카테고리 주변에 배치
            category.items.forEach((item, itemIndex) => {
                const itemAngle = categoryAngle + (itemIndex - (category.items.length - 1) / 2) * 0.4; // 0.4 라디안씩 간격
                const itemX = categoryX + Math.cos(itemAngle) * itemRadius;
                const itemY = categoryY + Math.sin(itemAngle) * itemRadius;

                const itemNode = {
                    id: item.id,
                    type: 'item',
                    label: item.title,
                    category: category.type,
                    color: category.color,
                    x: itemX,
                    y: itemY,
                    level: 2,
                    radius: 40,
                    data: item
                };

                itemNodes.push(itemNode);

                // 카테고리에서 아이템으로 연결선
                connections.push({
                    from: categoryNode.id,
                    to: item.id,
                    type: 'sub'
                });
            });
        });

        return {
            centerNode,
            categoryNodes,
            itemNodes,
            connections,
            totalNodes: 1 + categoryNodes.length + itemNodes.length
        };
    }, [elements]);

    // 🔥 노드 클릭 핸들러
    const handleNodeClick = useCallback((node: any) => {
        setSelectedNodeId(node.id);

        if (node.type === 'item' && node.data && onSelectElement) {
            onSelectElement(node.data);
            Logger.info('MINDMAP_CANVAS', 'Element selected', { elementId: node.id, title: node.label });
        }
    }, [onSelectElement]);

    // 🔥 줌 컨트롤
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.3));
    const handleResetView = () => {
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
    };

    // 🔥 SVG 렌더링
    const renderMindmap = () => {
        const { centerNode, categoryNodes, itemNodes, connections } = mindmapData;
        const allNodes = [centerNode, ...categoryNodes, ...itemNodes];

        return (
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="-500 -400 1000 800"
                className="overflow-visible"
                style={{ transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)` }}
            >
                {/* 연결선 그리기 */}
                <g className="connections">
                    {connections.map((conn, index) => {
                        const fromNode = allNodes.find(n => n.id === conn.from);
                        const toNode = allNodes.find(n => n.id === conn.to);

                        if (!fromNode || !toNode) return null;

                        return (
                            <line
                                key={index}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke={conn.type === 'main' ? '#6b7280' : '#d1d5db'}
                                strokeWidth={conn.type === 'main' ? 3 : 2}
                                strokeDasharray={conn.type === 'sub' ? '5,5' : 'none'}
                                opacity={0.6}
                            />
                        );
                    })}
                </g>

                {/* 노드 그리기 */}
                <g className="nodes">
                    {/* 중앙 노드 */}
                    <g>
                        <circle
                            cx={centerNode.x}
                            cy={centerNode.y}
                            r={centerNode.radius}
                            fill="url(#centerGradient)"
                            stroke="#4f46e5"
                            strokeWidth="4"
                            className="cursor-pointer filter drop-shadow-lg"
                            onClick={() => handleNodeClick(centerNode)}
                        />
                        <text
                            x={centerNode.x}
                            y={centerNode.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-lg font-bold fill-white pointer-events-none"
                        >
                            {centerNode.label}
                        </text>
                    </g>

                    {/* 카테고리 노드들 */}
                    {categoryNodes.map((node) => (
                        <g key={node.id}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.radius}
                                fill={node.color}
                                stroke={selectedNodeId === node.id ? '#1f2937' : 'white'}
                                strokeWidth={selectedNodeId === node.id ? 4 : 2}
                                className="cursor-pointer filter drop-shadow-md transition-all duration-200 hover:brightness-110"
                                onClick={() => handleNodeClick(node)}
                            />
                            <text
                                x={node.x}
                                y={node.y - 5}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-sm font-semibold fill-white pointer-events-none"
                            >
                                {node.icon}
                            </text>
                            <text
                                x={node.x}
                                y={node.y + 10}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs font-medium fill-white pointer-events-none"
                            >
                                {node.label}
                            </text>
                            <text
                                x={node.x}
                                y={node.y + 25}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs fill-white/80 pointer-events-none"
                            >
                                ({node.itemCount})
                            </text>
                        </g>
                    ))}

                    {/* 아이템 노드들 */}
                    {itemNodes.map((node) => (
                        <g key={node.id}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.radius}
                                fill={`${node.color}20`}
                                stroke={node.color}
                                strokeWidth={selectedNodeId === node.id ? 3 : 2}
                                className="cursor-pointer transition-all duration-200 hover:fill-opacity-40"
                                onClick={() => handleNodeClick(node)}
                            />
                            <text
                                x={node.x}
                                y={node.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs font-medium pointer-events-none"
                                fill={node.color}
                            >
                                {node.label.length > 10 ? `${node.label.slice(0, 10)}...` : node.label}
                            </text>
                        </g>
                    ))}
                </g>

                {/* 그라데이션 정의 */}
                <defs>
                    <radialGradient id="centerGradient" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                    </radialGradient>
                </defs>
            </svg>
        );
    };

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-lg overflow-hidden">
            {/* 컨트롤 패널 */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleZoomIn}
                    className="bg-white/90 hover:bg-white"
                >
                    <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleZoomOut}
                    className="bg-white/90 hover:bg-white"
                >
                    <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetView}
                    className="bg-white/90 hover:bg-white"
                >
                    <RotateCw className="w-4 h-4" />
                </Button>
            </div>

            {/* 정보 패널 */}
            <div className="absolute top-4 left-4 z-10">
                <Card className="p-3 bg-white/90 backdrop-blur-sm">
                    <div className="text-sm text-gray-600">
                        <div>총 노드: {mindmapData.totalNodes}</div>
                        <div>줌: {Math.round(zoom * 100)}%</div>
                    </div>
                </Card>
            </div>

            {/* 마인드맵 캔버스 */}
            <div className="w-full h-full">
                {mindmapData.totalNodes > 1 ? (
                    renderMindmap()
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">프로젝트 요소가 없습니다</h3>
                            <p className="text-sm">챕터, 캐릭터, 아이디어를 추가하여 마인드맵을 생성해보세요.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
