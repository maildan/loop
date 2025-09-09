'use client';

import React, { useState, useMemo } from 'react';
import { Map, Brain, Sparkles, User, Lightbulb, FileText } from 'lucide-react';
import { ProjectElement } from '../../../../hooks/useProjectData';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Logger } from '@/shared/logger';

interface OutlinePanelProps {
    elements: ProjectElement[];
    projectId?: string;
}

export const OutlinePanel: React.FC<OutlinePanelProps> = ({
    elements,
    projectId = 'outline-demo'
}) => {
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);

    // 요소별로 분류
    const categorizedElements = useMemo(() => {
        const chapters = elements.filter(el => el.type === 'chapter');
        const characters = elements.filter(el => el.type === 'character');
        const ideas = elements.filter(el => el.type === 'idea');
        const memos = elements.filter(el => el.type === 'memo');
        const notes = elements.filter(el => el.type === 'note');

        return { chapters, characters, ideas, memos, notes };
    }, [elements]);

    const renderElementCard = (element: ProjectElement, icon: React.ReactNode) => (
        <Card key={element.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {element.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {element.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            {element.tags && element.tags.length > 0 && (
                                <div className="flex gap-1">
                                    {element.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                    {element.tags.length > 2 && (
                                        <span className="text-xs text-gray-500">+{element.tags.length - 2}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        {element.wordCount && (
                            <span className="text-xs text-gray-500">
                                {element.wordCount.toLocaleString()}자
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* 🎯 헤더 영역 */}
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
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

            <div className="flex-1 overflow-hidden px-6">
                <div className="grid grid-cols-12 gap-6 h-full">
                    {/* 🗂️ 아웃라인 메인 컨텐츠 */}
                    <div className={`${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300 overflow-y-auto h-full`}>
                        <div className="space-y-8 pb-6">
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
                                <>
                                    {/* 📖 챕터 섹션 */}
                                    {categorizedElements.chapters.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                챕터 ({categorizedElements.chapters.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {categorizedElements.chapters.map((element) =>
                                                    renderElementCard(element, <FileText className="w-4 h-4 text-blue-500" />)
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 👥 인물 섹션 */}
                                    {categorizedElements.characters.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                인물 ({categorizedElements.characters.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {categorizedElements.characters.map((element) =>
                                                    renderElementCard(element, <User className="w-4 h-4 text-green-500" />)
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 💡 아이디어 섹션 */}
                                    {categorizedElements.ideas.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                                <Lightbulb className="w-5 h-5" />
                                                아이디어 ({categorizedElements.ideas.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {categorizedElements.ideas.map((element) =>
                                                    renderElementCard(element, <Lightbulb className="w-4 h-4 text-yellow-500" />)
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 📝 메모 & 노트 섹션 */}
                                    {(categorizedElements.memos.length > 0 || categorizedElements.notes.length > 0) && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                메모 & 노트 ({categorizedElements.memos.length + categorizedElements.notes.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {[...categorizedElements.memos, ...categorizedElements.notes].map((element) =>
                                                    renderElementCard(element, <FileText className="w-4 h-4 text-gray-500" />)
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* 🤖 AI 분석 사이드바 */}
                    {showAIAnalysis && (
                        <div className="col-span-4 transition-all duration-300 overflow-y-auto h-full">
                            <AIAnalysisPanel
                                projectId={projectId}
                                analysisType="outline"
                                data={{
                                    elements,
                                    chapters: categorizedElements.chapters,
                                    characters: categorizedElements.characters,
                                    ideas: categorizedElements.ideas,
                                    totalElements: elements.length
                                }}
                                context={{
                                    content: elements.map(e => `${e.title}: ${e.content}`).join('\n'),
                                    themes: elements.map(e => e.type).filter((v, i, a) => a.indexOf(v) === i),
                                    characters: categorizedElements.characters,
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
        </div>
    );
};
