'use client';

import React, { useState, useMemo } from 'react';
import { Map, Brain, Sparkles, User, Lightbulb, FileText } from 'lucide-react';
import { ProjectElement } from '../../../../hooks/useProjectData';
import { AIAnalysisPanel } from '../../../common/AIAnalysisPanel';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Logger } from '../../../../../shared/logger';

interface OutlinePanelProps {
    elements: ProjectElement[];
    projectId?: string;
    characters?: Array<{ id: string; name: string; role?: string; notes?: string }>; // 캐릭터 데이터
    notes?: Array<{ id: string; title: string; content: string; tags?: string[] }>; // 노트 데이터
    content?: string; // 프로젝트 내용
    onNavigateToChapter?: (chapterId: string) => void; // 🔥 챕터 네비게이션 추가
}

export const OutlinePanel: React.FC<OutlinePanelProps> = ({
    elements,
    projectId = 'outline-demo',
    characters = [],
    notes = [],
    content = '',
    onNavigateToChapter // 🔥 챕터 네비게이션 함수
}) => {
    const [showAIAnalysis, setShowAIAnalysis] = useState(false);

    // 🔥 페이지네이션 상태 - main 추가
    const [currentPage, setCurrentPage] = useState({
        mains: 1,     // 🔥 main 추가
        chapters: 1,
        characters: 1,
        ideas: 1,
        memos: 1
    });

    const ITEMS_PER_PAGE = 6; // 페이지당 아이템 수

    // 🔥 페이지네이션 헬퍼 함수
    const getPaginatedItems = (items: ProjectElement[], type: keyof typeof currentPage) => {
        const startIndex = (currentPage[type] - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return items.slice(startIndex, endIndex);
    };

    const getTotalPages = (itemsCount: number) => {
        return Math.ceil(itemsCount / ITEMS_PER_PAGE);
    };

    const handlePageChange = (type: keyof typeof currentPage, newPage: number) => {
        setCurrentPage(prev => ({
            ...prev,
            [type]: newPage
        }));
    };

    // 🔥 페이지네이션 컴포넌트
    const renderPagination = (type: keyof typeof currentPage, totalItems: number) => {
        const totalPages = getTotalPages(totalItems);
        if (totalPages <= 1) return null;

        return (
            <div className="mt-4 flex items-center justify-center gap-2">
                <button
                    onClick={() => handlePageChange(type, Math.max(1, currentPage[type] - 1))}
                    disabled={currentPage[type] === 1}
                    className="rounded-md border border-border px-3 py-1 text-sm transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    이전
                </button>
                <span className="text-sm text-muted-foreground">
                    {currentPage[type]} / {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(type, Math.min(totalPages, currentPage[type] + 1))}
                    disabled={currentPage[type] === totalPages}
                    className="rounded-md border border-border px-3 py-1 text-sm transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    다음
                </button>
            </div>
        );
    };

    // 요소별로 분류 - main 타입 추가
    const categorizedElements = useMemo(() => {
        const mains = elements.filter(el => el.type === 'main'); // 🔥 main 타입 추가
        const chapters = elements.filter(el => el.type === 'chapter');
        const characters = elements.filter(el => el.type === 'character');
        const ideas = elements.filter(el => el.type === 'idea');
        const memos = elements.filter(el => el.type === 'memo');
        const notes = elements.filter(el => el.type === 'note');

        // 🔥 디버그: 아이디어 수 확인
        Logger.info('OUTLINE_PANEL', '🔍 Elements categorization', {
            total: elements.length,
            mains: mains.length,
            chapters: chapters.length,
            characters: characters.length,
            ideas: ideas.length,
            memos: memos.length,
            notes: notes.length,
            ideaData: ideas.map(i => ({ id: i.id, title: i.title, type: i.type }))
        });

        return { mains, chapters, characters, ideas, memos, notes };
    }, [elements]);

    const renderElementCard = (element: ProjectElement, icon: React.ReactNode) => (
        <Card
            key={element.id}
            className={`p-4 transition-shadow hover:shadow-md ${element.type === 'chapter' && onNavigateToChapter ? 'cursor-pointer hover:bg-[hsl(var(--accent-primary))]/10' : ''
                }`}
            onClick={() => {
                // 🔥 챕터 클릭 시 네비게이션
                if (element.type === 'chapter' && onNavigateToChapter) {
                    Logger.info('OUTLINE_PANEL', 'Navigating to chapter', { chapterId: element.id, title: element.title });
                    onNavigateToChapter(element.id);
                }
            }}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    {icon}
                </div>
                <div className="flex-1">
                    <h4 className={`mb-2 font-medium ${element.type === 'chapter' && onNavigateToChapter
                        ? 'text-[hsl(var(--accent-primary))] hover:text-[var(--accent-hover)]'
                        : 'text-foreground'
                        }`}>
                        {element.title}
                        {element.type === 'chapter' && onNavigateToChapter && (
                            <span className="ml-2 text-xs text-muted-foreground">(클릭하여 편집)</span>
                        )}
                    </h4>
                    <div className="text-sm text-muted-foreground line-clamp-3">
                        {/* 🔥 마크다운 텍스트를 간단히 정리해서 표시 */}
                        {element.content
                            ?.replace(/#{1,6}\s+/g, '') // 헤딩 마크 제거
                            ?.replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 마크 제거
                            ?.replace(/\*(.*?)\*/g, '$1') // 이탤릭 마크 제거
                            ?.replace(/`(.*?)`/g, '$1') // 인라인 코드 마크 제거
                            ?.replace(/\[(.*?)\]\(.*?\)/g, '$1') // 링크는 텍스트만
                            ?.replace(/\n+/g, ' ') // 줄바꿈을 스페이스로
                            ?.trim()
                        }
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            {element.tags && element.tags.length > 0 && (
                                <div className="flex gap-1">
                                    {element.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="rounded bg-[hsl(var(--accent-primary))]/15 px-2 py-1 text-xs text-[hsl(var(--accent-primary))]">
                                            {tag}
                                        </span>
                                    ))}
                                    {element.tags.length > 2 && (
                                        <span className="text-xs text-muted-foreground">+{element.tags.length - 2}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        {element.wordCount && (
                            <span className="text-xs text-muted-foreground">
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
                                    <Map className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-medium text-muted-foreground">아웃라인이 비어있습니다</h3>
                                    <p className="text-muted-foreground">사이드바에서 챕터, 인물, 아이디어를 추가하여 아웃라인을 구성해보세요.</p>
                                </Card>
                            ) : (
                                <>
                                    {/* � 메인 스토리 섹션 */}
                                    {categorizedElements.mains.length > 0 && (
                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                                                <FileText className="h-5 w-5 text-[hsl(var(--chart-5))]" />
                                                메인 스토리 ({categorizedElements.mains.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {getPaginatedItems(categorizedElements.mains, 'mains').map((element) =>
                                                    renderElementCard(element, <FileText className="h-4 w-4 text-[hsl(var(--chart-5))]" />)
                                                )}
                                            </div>
                                            {renderPagination('mains', categorizedElements.mains.length)}
                                        </div>
                                    )}

                                    {/* �📖 챕터 섹션 */}
                                    {categorizedElements.chapters.length > 0 && (
                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                                                <FileText className="h-5 w-5 text-[hsl(var(--chart-1))]" />
                                                챕터 ({categorizedElements.chapters.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {getPaginatedItems(categorizedElements.chapters, 'chapters').map((element) =>
                                                    renderElementCard(element, <FileText className="h-4 w-4 text-[hsl(var(--chart-1))]" />)
                                                )}
                                            </div>
                                            {renderPagination('chapters', categorizedElements.chapters.length)}
                                        </div>
                                    )}

                                    {/* 👥 인물 섹션 */}
                                    {categorizedElements.characters.length > 0 && (
                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                                                <User className="h-5 w-5 text-[var(--success)]" />
                                                인물 ({categorizedElements.characters.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {getPaginatedItems(categorizedElements.characters, 'characters').map((element) =>
                                                    renderElementCard(element, <User className="h-4 w-4 text-[var(--success)]" />)
                                                )}
                                            </div>
                                            {renderPagination('characters', categorizedElements.characters.length)}
                                        </div>
                                    )}

                                    {/* 💡 아이디어 섹션 */}
                                    {categorizedElements.ideas.length > 0 && (
                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                                                <Lightbulb className="h-5 w-5 text-[var(--warning)]" />
                                                아이디어 ({categorizedElements.ideas.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {getPaginatedItems(categorizedElements.ideas, 'ideas').map((element) =>
                                                    renderElementCard(element, <Lightbulb className="h-4 w-4 text-[var(--warning)]" />)
                                                )}
                                            </div>
                                            {renderPagination('ideas', categorizedElements.ideas.length)}
                                        </div>
                                    )}

                                    {/* 📝 메모 & 노트 섹션 */}
                                    {(categorizedElements.memos.length > 0 || categorizedElements.notes.length > 0) && (
                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                메모 & 노트 ({categorizedElements.memos.length + categorizedElements.notes.length})
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {getPaginatedItems([...categorizedElements.memos, ...categorizedElements.notes], 'memos').map((element) =>
                                                    renderElementCard(element, <FileText className="h-4 w-4 text-muted-foreground" />)
                                                )}
                                            </div>
                                            {renderPagination('memos', categorizedElements.memos.length + categorizedElements.notes.length)}
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
                                    content: content || elements.map(e => `${e.title}: ${e.content}`).join('\n'),
                                    themes: elements.map(e => e.type).filter((v, i, a) => a.indexOf(v) === i),
                                    characters: [...(characters || []), ...categorizedElements.characters],
                                    plotPoints: elements.filter(e => e.plotRelevance && e.plotRelevance >= 3),
                                    notes: notes
                                }}
                                onAnalysisComplete={(result) => {
                                    Logger.info('OUTLINE_PANEL', '아웃라인 AI 분석 완료', { result });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
