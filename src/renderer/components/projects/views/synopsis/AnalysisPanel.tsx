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
        <div className="w-96 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l dark:border-gray-700 flex flex-col shadow-lg">
            {/* 🔥 우아한 헤더 */}
            <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    스토리 분석
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    AI 기반 작품 완성도 평가
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* 🔥 프로젝트 개요 */}
                <div className="p-4 border-b dark:border-gray-700">
                    <button
                        onClick={() => toggleSection('overview')}
                        className="flex items-center justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                    >
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                            프로젝트 개요
                        </h4>
                        {expandedSections.overview ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    
                    {expandedSections.overview && (
                        <div className="mt-4 space-y-3">
                            {/* 전체 통계 */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg" title="전체 단어 수 (메인 스토리 + 챕터 포함)">
                                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                        {analysis.totalWords.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400">총 단어 수</div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg" title="작성된 챕터 수">
                                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                        {elementStats.chapters}
                                    </div>
                                    <div className="text-xs text-purple-600 dark:text-purple-400">챕터 수</div>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg" title="등장인물 수">
                                    <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                        {elementStats.characters}
                                    </div>
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400">등장인물</div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg" title="아이디어/노트 수">
                                    <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                        {elementStats.notes}
                                    </div>
                                    <div className="text-xs text-orange-600 dark:text-orange-400">노트</div>
                                </div>
                            </div>

                            {/* 품질 점수 */}
                            <div className="space-y-2">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">스토리 일관성</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400" title="단어 수와 구조를 기반으로 한 일관성 점수">
                                            {analysis.storyConsistency}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                analysis.storyConsistency >= 80 ? 'bg-green-500' :
                                                analysis.storyConsistency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${analysis.storyConsistency}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">캐릭터 완성도</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400" title="등장인물 설정의 풍부함">
                                            {analysis.characterConsistency}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                analysis.characterConsistency >= 80 ? 'bg-green-500' :
                                                analysis.characterConsistency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
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
                <div className="p-4 border-b dark:border-gray-700">
                    <button
                        onClick={() => toggleSection('suggestions')}
                        className="flex items-center justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                    >
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                            맞춤형 개선 제안
                        </h4>
                        {expandedSections.suggestions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {expandedSections.suggestions && analysis.suggestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {analysis.suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 group hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start space-x-3">
                                        <ThumbsUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                                {suggestion}
                                            </p>
                                            <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="p-4 border-b dark:border-gray-700">
                    <button
                        onClick={() => toggleSection('elements')}
                        className="flex items-center justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                    >
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                            프로젝트 구성 요소
                        </h4>
                        {expandedSections.elements ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {expandedSections.elements && (
                        <div className="mt-4 space-y-3">
                            {/* 메인 스토리 */}
                            {elements.filter(e => e.type === 'main').map((element) => (
                                <div key={element.id} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BookOpen className="h-4 w-4 text-green-600" />
                                        <div className="font-medium text-sm text-green-800 dark:text-green-200">{element.title}</div>
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400">
                                        {element.wordCount || 0} 단어 • {element.createdAt?.toLocaleDateString() || '날짜 미상'}
                                    </div>
                                </div>
                            ))}

                            {/* 캐릭터 */}
                            {elements.filter(e => e.type === 'character').length > 0 && (
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                                        <Users className="h-3 w-3 mr-1" />
                                        등장인물 ({elements.filter(e => e.type === 'character').length})
                                    </div>
                                    {elements.filter(e => e.type === 'character').map((element) => (
                                        <div key={element.id} className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 mb-2">
                                            <div className="font-medium text-sm text-purple-800 dark:text-purple-200 mb-1">{element.title}</div>
                                            <div className="text-xs text-purple-600 dark:text-purple-400">
                                                {element.content?.substring(0, 50) || '설명 없음'}...
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 챕터 */}
                            {elements.filter(e => e.type === 'chapter').length > 0 && (
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                        챕터 ({elements.filter(e => e.type === 'chapter').length})
                                    </div>
                                    {elements.filter(e => e.type === 'chapter').slice(0, 3).map((element) => (
                                        <div key={element.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-2">
                                            <div className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">{element.title}</div>
                                            <div className="text-xs text-blue-600 dark:text-blue-400">
                                                {element.wordCount || 0} 단어
                                            </div>
                                        </div>
                                    ))}
                                    {elements.filter(e => e.type === 'chapter').length > 3 && (
                                        <div className="text-xs text-gray-500 text-center">
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
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <GitBranch className="h-4 w-4 mr-2 text-purple-600" />
                            선택된 요소
                        </h4>
                        <div className="space-y-2">
                            {getRelatedElements(selectedElement).map((element) => (
                                <div key={element.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow">
                                    <div className="font-medium text-sm mb-1 text-gray-900 dark:text-gray-100">{element.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {element.type === 'main' ? '메인 스토리' :
                                         element.type === 'chapter' ? '챕터' :
                                         element.type === 'character' ? '등장인물' :
                                         element.type === 'synopsis' ? '시놉시스' :
                                         element.type}
                                    </div>
                                    {element.content && (
                                        <div className="text-xs text-gray-600 dark:text-gray-300">
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
