'use client';

import React, { useState } from 'react';
import { Calendar, Brain, Sparkles, BookOpen, Hash, FileText } from 'lucide-react';
import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { GoogleGenAI } from "@google/genai";
import { Logger } from '@/shared/logger';


interface TimelinePanelProps {
    analysis: ProjectAnalysis;
    elements: ProjectElement[]; // 🔥 프로젝트 요소들 (메인 스토리 포함)
    projectId?: string;
    characters?: any[]; // 캐릭터 데이터
    notes?: any[]; // 노트 데이터
    content?: string; // 프로젝트 내용
    onNavigateToChapter?: (chapterId: string) => void; // 🔥 챕터 네비게이션 추가
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
    analysis,
    elements,
    projectId = 'timeline-demo',
    characters = [],
    notes = [],
    content = '',
    onNavigateToChapter // 🔥 챕터 네비게이션 함수
}) => {
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);
    const [showKoreanAnalysis, setShowKoreanAnalysis] = useState(false);

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
                    <Button
                        onClick={() => setShowKoreanAnalysis(!showKoreanAnalysis)}
                        variant={showKoreanAnalysis ? "secondary" : "outline"}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {showKoreanAnalysis ? '한국 분석 숨기기' : '한국 웹소설 분석'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden px-6">
                <div className="grid grid-cols-12 gap-6 h-full">
                    {/* 🗂️ 타임라인 메인 컨텐츠 */}
                    <div className={`${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300 overflow-y-auto h-full`}>
                        <div className="space-y-4 pb-6">{/* pb-6 for bottom padding */}
                            {elements.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-medium text-muted-foreground">타임라인이 비어있습니다</h3>
                                    <p className="text-muted-foreground">프로젝트에 이벤트를 추가하여 타임라인을 구성해보세요.</p>
                                </Card>
                            ) : (
                                // 🔥 elements를 생성 순서로 정렬하여 타임라인 구성
                                elements
                                    .sort((a, b) => {
                                        // main이 맨 앞에, 나머지는 order 또는 생성시간 순
                                        if (a.type === 'main') return -1;
                                        if (b.type === 'main') return 1;
                                        if (a.order !== undefined && b.order !== undefined) {
                                            return a.order - b.order;
                                        }
                                        return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
                                    })
                                    .map((item, index) => (
                                    <div key={item.id} className="flex items-start space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-3 w-3 rounded-full ${
                                                item.type === 'main' ? 'bg-[var(--success)]' :
                                                item.type === 'chapter' ? 'bg-[hsl(var(--chart-1))]' :
                                                item.type === 'character' ? 'bg-[hsl(var(--chart-5))]' :
                                                item.type === 'synopsis' ? 'bg-[hsl(var(--chart-3))]' :
                                                'bg-muted-foreground'
                                            }`}></div>
                                            {index < elements.length - 1 && (
                                                <div className="mt-2 h-16 w-0.5 bg-border"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div
                                                className={`rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md ${item.type === 'chapter' && onNavigateToChapter ? 'cursor-pointer hover:bg-[hsl(var(--accent-primary))]/10' : ''
                                                    }`}
                                                onClick={() => {
                                                    // 🔥 챕터 클릭 시 네비게이션
                                                    if (item.type === 'chapter' && onNavigateToChapter) {
                                                        onNavigateToChapter(item.id);
                                                    }
                                                }}
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <h3 className={`flex items-center gap-2 font-medium ${item.type === 'chapter' && onNavigateToChapter
                                                        ? 'text-[hsl(var(--accent-primary))] hover:text-[var(--accent-hover)]'
                                                        : 'text-foreground'
                                                        }`}>
                                                        {item.type === 'main' && <BookOpen className="h-4 w-4 text-[var(--success)]" />}
                                                        {item.type === 'chapter' && <Hash className="h-4 w-4 text-[hsl(var(--chart-1))]" />}
                                                        {item.type === 'synopsis' && <FileText className="h-4 w-4 text-[hsl(var(--chart-3))]" />}
                                                        {!['main', 'chapter', 'synopsis'].includes(item.type) && <Sparkles className="h-4 w-4 text-[hsl(var(--chart-5))]" />}
                                                        {item.title}
                                                        {item.type === 'chapter' && onNavigateToChapter && (
                                                            <span className="ml-2 text-xs text-muted-foreground">(클릭하여 편집)</span>
                                                        )}
                                                    </h3>
                                                    <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                        {item.type === 'main' ? '메인' :
                                                            item.type === 'chapter' ? '챕터' :
                                                                item.type === 'character' ? '인물' :
                                                                    item.type === 'idea' ? '아이디어' :
                                                                        item.type === 'synopsis' ? '시놉시스' :
                                                                            item.type === 'memo' ? '메모' : item.type}
                                                    </span>
                                                </div>
                                                <div className="mb-2 text-sm text-muted-foreground">
                                                    {item.content?.substring(0, 150) || '내용 없음'}
                                                    {(item.content?.length || 0) > 150 && '...'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.createdAt?.toLocaleDateString('ko-KR') || '날짜 미상'}
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

                    {/* 🇰🇷 한국 웹소설 분석 사이드바 */}
                    {showKoreanAnalysis && (
                        <div className="col-span-4 transition-all duration-300 overflow-y-auto h-full">
                            <AIAnalysisPanel
                                projectId={projectId}
                                analysisType="korean"
                                data={{
                                    content: content || elements.map(e => e.content).join('\n'),
                                    title: elements.find(e => e.type === 'main')?.title || '프로젝트',
                                    characters: characters,
                                    totalWordCount: elements.reduce((sum, e) => sum + (e.wordCount || 0), 0)
                                }}
                                context={{
                                    content: content,
                                    characters: characters,
                                    notes: notes
                                }}
                                onAnalysisComplete={(result) => {
                                    Logger.warn("result",'🇰🇷 한국 웹소설 분석 완료:', result);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
