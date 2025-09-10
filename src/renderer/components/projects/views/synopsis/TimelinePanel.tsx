'use client';

import React, { useState } from 'react';
import { Calendar, Brain, Sparkles } from 'lucide-react';
import { ProjectAnalysis } from '../../../../hooks/useProjectData';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { GoogleGenAI } from "@google/genai";


interface TimelinePanelProps {
    analysis: ProjectAnalysis;
    projectId?: string;
    characters?: any[]; // 캐릭터 데이터
    notes?: any[]; // 노트 데이터
    content?: string; // 프로젝트 내용
    onNavigateToChapter?: (chapterId: string) => void; // 🔥 챕터 네비게이션 추가
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
    analysis,
    projectId = 'timeline-demo',
    characters = [],
    notes = [],
    content = '',
    onNavigateToChapter // 🔥 챕터 네비게이션 함수
}) => {
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* 🎯 헤더 영역 */}
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
                <h2 className="text-xl font-semibold flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    타임라인 뷰
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
                    {/* 🗂️ 타임라인 메인 컨텐츠 */}
                    <div className={`${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300 overflow-y-auto h-full`}>
                        <div className="space-y-4 pb-6">{/* pb-6 for bottom padding */}
                            {analysis.timeline.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">타임라인이 비어있습니다</h3>
                                    <p className="text-gray-500">프로젝트에 이벤트를 추가하여 타임라인을 구성해보세요.</p>
                                </Card>
                            ) : (
                                analysis.timeline.map((item, index) => (
                                    <div key={item.id} className="flex items-start space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                            {index < analysis.timeline.length - 1 && (
                                                <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div
                                                className={`bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${item.type === 'chapter' && onNavigateToChapter ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''
                                                    }`}
                                                onClick={() => {
                                                    // 🔥 챕터 클릭 시 네비게이션
                                                    if (item.type === 'chapter' && onNavigateToChapter) {
                                                        onNavigateToChapter(item.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className={`font-medium ${item.type === 'chapter' && onNavigateToChapter
                                                            ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                                                            : 'text-gray-900 dark:text-gray-100'
                                                        }`}>
                                                        {item.title}
                                                        {item.type === 'chapter' && onNavigateToChapter && (
                                                            <span className="ml-2 text-xs text-gray-500">(클릭하여 편집)</span>
                                                        )}
                                                    </h3>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div
                                                    className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                                />
                                                <div className="text-xs text-gray-500">
                                                    {new Date(item.timestamp).toLocaleDateString('ko-KR')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 🎲 데모용 샘플 데이터 추가 버튼 */}
                        {analysis.timeline.length === 0 && (
                            <div className="mt-6 text-center">
                                <Button
                                    onClick={() => {
                                        // 데모용 타임라인 데이터 추가 로직
                                        console.log('샘플 타임라인 데이터 추가');
                                    }}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    샘플 데이터 추가
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* 🤖 AI 분석 사이드바 */}
                    {showAIAnalysis && (
                        <div className="col-span-4 transition-all duration-300 overflow-y-auto h-full">
                            <AIAnalysisPanel
                                projectId={projectId}
                                analysisType="timeline"
                                data={analysis.timeline}
                                context={{
                                    content: content || analysis.timeline.map(t => `${t.title}: ${t.description}`).join('\n'),
                                    characters: characters,
                                    plotPoints: analysis.timeline,
                                    themes: analysis.timeline.map(t => t.type).filter((v, i, a) => a.indexOf(v) === i),
                                    notes: notes
                                }}
                                onAnalysisComplete={(result) => {
                                    console.log('🔍 타임라인 AI 분석 완료:', result);
                                    console.log('🔍 전달된 context:', {
                                        charactersCount: characters?.length || 0,
                                        charactersPreview: characters?.slice(0, 2),
                                        contentLength: content?.length || 0,
                                        notesCount: notes?.length || 0
                                    });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
