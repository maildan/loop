'use client';

import React, { useState } from 'react';
import { 
    TrendingUp, 
    AlertTriangle, 
    Target, 
    GitBranch, 
    BookOpen, 
    Users, 
    BarChart3, 
    Lightbulb,
    ThumbsUp,
    HelpCircle,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';

interface AnalysisPanelProps {
    analysis: ProjectAnalysis;
    elements: ProjectElement[]; // 🔥 메인/캐릭터 포함 전체 요소
    selectedElement: string | null;
    getRelatedElements: (elementId: string) => ProjectElement[];
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
    analysis,
    elements,
    selectedElement,
    getRelatedElements
}) => {
    // 🔥 접힘/펼침 상태 관리
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        overview: true,
        suggestions: true,
        details: false,
        elements: false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // 🔥 요소별 통계
    const elementStats = {
        total: elements.length,
        main: elements.filter(e => e.type === 'main').length,
        chapters: elements.filter(e => e.type === 'chapter').length,
        characters: elements.filter(e => e.type === 'character').length,
        notes: elements.filter(e => e.type === 'idea' || e.type === 'note').length,
        synopsis: elements.filter(e => e.type === 'synopsis').length,
    };

    return (
        <div className="flex w-96 flex-col border-l border-border bg-card shadow-lg">
            {/* 🔥 우아한 헤더 */}
            <div className="border-b border-border bg-gradient-to-r from-[var(--accent-light)]/70 to-[hsl(var(--accent-primary))]/15 px-6 py-6">
                <h3 className="flex items-center text-xl font-bold text-foreground">
                    <BarChart3 className="mr-2 h-5 w-5 text-[hsl(var(--accent-primary))]" />
                    스토리 분석
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    AI 기반 작품 완성도 평가
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* 🔥 프로젝트 개요 */}
                <div className="border-b border-border p-4">
                    <button
                        onClick={() => toggleSection('overview')}
                        className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-muted/60"
                    >
                        <h4 className="flex items-center font-semibold text-foreground">
                            <TrendingUp className="mr-2 h-4 w-4 text-[var(--success)]" />
                            프로젝트 개요
                        </h4>
                        {expandedSections.overview ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    
                    {expandedSections.overview && (
                        <div className="mt-4 space-y-3">
                            {/* 전체 통계 */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-lg border border-[hsl(var(--chart-1))]/40 bg-[hsl(var(--chart-1))]/15 p-3" title="전체 단어 수 (메인 스토리 + 챕터 포함)">
                                    <div className="text-lg font-bold text-[hsl(var(--chart-1))]">
                                        {analysis.totalWords.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-[hsl(var(--chart-1))]">총 단어 수</div>
                                </div>
                                <div className="rounded-lg border border-[hsl(var(--chart-5))]/40 bg-[hsl(var(--chart-5))]/15 p-3" title="작성된 챕터 수">
                                    <div className="text-lg font-bold text-[hsl(var(--chart-5))]">
                                        {elementStats.chapters}
                                    </div>
                                    <div className="text-xs text-[hsl(var(--chart-5))]">챕터 수</div>
                                </div>
                                <div className="rounded-lg border border-[var(--success)]/40 bg-[var(--success-light)] p-3" title="등장인물 수">
                                    <div className="text-lg font-bold text-[var(--success)]">
                                        {elementStats.characters}
                                    </div>
                                    <div className="text-xs text-[var(--success)]">등장인물</div>
                                </div>
                                <div className="rounded-lg border border-[var(--warning)]/40 bg-[var(--warning-light)] p-3" title="아이디어/노트 수">
                                    <div className="text-lg font-bold text-[var(--warning)]">
                                        {elementStats.notes}
                                    </div>
                                    <div className="text-xs text-[var(--warning)]">노트</div>
                                </div>
                            </div>

                            {/* 품질 점수 */}
                            <div className="space-y-2">
                                <div className="rounded-lg border border-border bg-card p-3">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">스토리 일관성</span>
                                        <span className="text-sm text-muted-foreground" title="단어 수와 구조를 기반으로 한 일관성 점수">
                                            {analysis.storyConsistency}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                analysis.storyConsistency >= 80 ? 'bg-[var(--success)]' :
                                                analysis.storyConsistency >= 60 ? 'bg-[var(--warning)]' : 'bg-[hsl(var(--destructive))]'
                                            }`}
                                            style={{ width: `${analysis.storyConsistency}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-border bg-card p-3">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">캐릭터 완성도</span>
                                        <span className="text-sm text-muted-foreground" title="등장인물 설정의 풍부함">
                                            {analysis.characterConsistency}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                analysis.characterConsistency >= 80 ? 'bg-[var(--success)]' :
                                                analysis.characterConsistency >= 60 ? 'bg-[var(--warning)]' : 'bg-[hsl(var(--destructive))]'
                                            }`}
                                            style={{ width: `${analysis.characterConsistency}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 🔥 AI 개선 제안 */}
                <div className="border-b border-border p-4">
                    <button
                        onClick={() => toggleSection('suggestions')}
                        className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-muted/60"
                    >
                        <h4 className="flex items-center font-semibold text-foreground">
                            <Lightbulb className="mr-2 h-4 w-4 text-[var(--warning)]" />
                            맞춤형 개선 제안
                        </h4>
                        {expandedSections.suggestions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {expandedSections.suggestions && analysis.suggestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {analysis.suggestions.map((suggestion, index) => (
                                <div key={index} className="group rounded-lg border border-[hsl(var(--accent-primary))]/40 bg-gradient-to-r from-[var(--accent-light)]/60 to-[hsl(var(--accent-primary))]/15 p-4 transition-all duration-200 hover:shadow-md">
                                    <div className="flex items-start space-x-3">
                                        <ThumbsUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--accent-primary))]" />
                                        <div className="flex-1">
                                            <p className="text-sm leading-relaxed text-foreground">
                                                {suggestion}
                                            </p>
                                            <div className="mt-2 flex items-center text-xs text-[hsl(var(--accent-primary))] opacity-0 transition-opacity group-hover:opacity-100">
                                                <HelpCircle className="h-3 w-3 mr-1" />
                                                AI가 프로젝트 상태를 분석하여 제안한 내용입니다
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🔥 프로젝트 요소 상세 */}
                <div className="border-b border-border p-4">
                    <button
                        onClick={() => toggleSection('elements')}
                        className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-muted/60"
                    >
                        <h4 className="flex items-center font-semibold text-foreground">
                            <BookOpen className="mr-2 h-4 w-4 text-[hsl(var(--chart-3))]" />
                            프로젝트 구성 요소
                        </h4>
                        {expandedSections.elements ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {expandedSections.elements && (
                        <div className="mt-4 space-y-3">
                            {/* 메인 스토리 */}
                            {elements.filter(e => e.type === 'main').map((element) => (
                                <div key={element.id} className="rounded-lg border border-[var(--success)]/40 bg-[var(--success-light)] p-3">
                                    <div className="mb-1 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-[var(--success)]" />
                                        <div className="text-sm font-medium text-[var(--success)]">{element.title}</div>
                                    </div>
                                    <div className="text-xs text-[var(--success)]">
                                        {element.wordCount || 0} 단어 • {element.createdAt?.toLocaleDateString() || '날짜 미상'}
                                    </div>
                                </div>
                            ))}

                            {/* 캐릭터 */}
                            {elements.filter(e => e.type === 'character').length > 0 && (
                                <div>
                                    <div className="mb-2 flex items-center text-xs font-semibold text-muted-foreground">
                                        <Users className="h-3 w-3 mr-1" />
                                        등장인물 ({elements.filter(e => e.type === 'character').length})
                                    </div>
                                    {elements.filter(e => e.type === 'character').map((element) => (
                                        <div key={element.id} className="mb-2 rounded-lg border border-[hsl(var(--chart-5))]/40 bg-[hsl(var(--chart-5))]/15 p-3">
                                            <div className="mb-1 text-sm font-medium text-[hsl(var(--chart-5))]">{element.title}</div>
                                            <div className="text-xs text-[hsl(var(--chart-5))]">
                                                {element.content?.substring(0, 50) || '설명 없음'}...
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 챕터 */}
                            {elements.filter(e => e.type === 'chapter').length > 0 && (
                                <div>
                                    <div className="mb-2 text-xs font-semibold text-muted-foreground">
                                        챕터 ({elements.filter(e => e.type === 'chapter').length})
                                    </div>
                                    {elements.filter(e => e.type === 'chapter').slice(0, 3).map((element) => (
                                        <div key={element.id} className="mb-2 rounded-lg border border-[hsl(var(--chart-1))]/40 bg-[hsl(var(--chart-1))]/15 p-3">
                                            <div className="mb-1 text-sm font-medium text-[hsl(var(--chart-1))]">{element.title}</div>
                                            <div className="text-xs text-[hsl(var(--chart-1))]">
                                                {element.wordCount || 0} 단어
                                            </div>
                                        </div>
                                    ))}
                                    {elements.filter(e => e.type === 'chapter').length > 3 && (
                                        <div className="text-center text-xs text-muted-foreground">
                                            +{elements.filter(e => e.type === 'chapter').length - 3}개 더
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 🔥 선택된 요소 상세 정보 */}
                {selectedElement && (
                    <div className="p-4">
                        <h4 className="mb-3 flex items-center font-semibold text-foreground">
                            <GitBranch className="mr-2 h-4 w-4 text-[hsl(var(--chart-5))]" />
                            선택된 요소
                        </h4>
                        <div className="space-y-2">
                            {getRelatedElements(selectedElement).map((element) => (
                                <div key={element.id} className="rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md">
                                    <div className="mb-1 text-sm font-medium text-foreground">{element.title}</div>
                                    <div className="mb-1 text-xs text-muted-foreground">
                                        {element.type === 'main' ? '메인 스토리' :
                                         element.type === 'chapter' ? '챕터' :
                                         element.type === 'character' ? '등장인물' :
                                         element.type === 'synopsis' ? '시놉시스' :
                                         element.type}
                                    </div>
                                    {element.content && (
                                        <div className="text-xs text-muted-foreground">
                                            {element.content.substring(0, 80)}...
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
