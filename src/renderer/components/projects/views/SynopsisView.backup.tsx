'use client';

// 🔥 에이전트화된 시놉시스 뷰 - 프로젝트 전체 통합 분석

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Logger } from '../../../../shared/logger';
import { useStructureStore } from '../../../stores/useStructureStore';
import { useIntegratedProjectData } from '../../../hooks/useProjectData';
import {
    BarChart3,
    Users,
    FileText,
    Lightbulb,
    AlertTriangle,
    Clock,
    GitBranch,
    Eye,
    Target,
    Zap,
    Calendar,
    Map,
    Network,
    TrendingUp,
    BookOpen,
    MessageSquare
} from 'lucide-react';

// 뷰 모드 타입
type ViewMode = 'timeline' | 'outline' | 'mindmap';

interface SynopsisViewProps {
    projectId: string;
    synopsisId: string;
    onBack: () => void;
}

export const SynopsisView: React.FC<SynopsisViewProps> = ({
    projectId,
    synopsisId,
    onBack
}) => {
    const currentEditor = useStructureStore((s) => s.currentEditor);
    const [viewMode, setViewMode] = useState<ViewMode>('timeline');
    const [selectedElement, setSelectedElement] = useState<string | null>(null);

    // 🔥 디버깅: projectId 확인
    console.log('🔍 [SynopsisView] Props:', { projectId, synopsisId, currentEditor });

    // 통합 프로젝트 데이터 가져오기
    const { elements, analysis, loading, getElementsByType, getRelatedElements } =
        useIntegratedProjectData(projectId);

    // 🔥 디버깅: 데이터 상태 확인
    console.log('📊 [SynopsisView] Data state:', {
        elementsCount: elements.length,
        hasAnalysis: !!analysis,
        loading
    });

    useEffect(() => {
        // 전역 ESC 키 처리
        const handleGlobalEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            onBack();
            event.preventDefault();
        };

        window.addEventListener('global:escape', handleGlobalEscape as EventListener);
        return () => window.removeEventListener('global:escape', handleGlobalEscape as EventListener);
    }, [onBack]);

    // 로딩 상태
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">프로젝트 분석 중...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">분석할 데이터가 없습니다</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            {/* 🔥 헤더 - 프로젝트 통합 정보 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">프로젝트 시놉시스</h1>
                        <div className="flex items-center space-x-6 text-indigo-100">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4" />
                                <span>{analysis.totalChapters}개 챕터</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>{analysis.totalCharacters}명 캐릭터</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{analysis.totalWords.toLocaleString()}단어</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Lightbulb className="h-4 w-4" />
                                <span>{analysis.totalIdeas}개 아이디어</span>
                            </div>
                        </div>
                    </div>

                    {/* AI 분석 점수 */}
                    <div className="text-right">
                        <div className="mb-2">
                            <div className="text-sm opacity-75">스토리 일관성</div>
                            <div className="text-2xl font-bold">{analysis.storyConsistency}%</div>
                        </div>
                        <div>
                            <div className="text-sm opacity-75">캐릭터 일관성</div>
                            <div className="text-2xl font-bold">{analysis.characterConsistency}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 뷰 모드 탭 */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b dark:border-gray-700">
                <div className="flex space-x-1">
                    {[
                        { mode: 'timeline' as ViewMode, icon: Calendar, label: '타임라인' },
                        { mode: 'outline' as ViewMode, icon: Map, label: '아웃라인' },
                        { mode: 'mindmap' as ViewMode, icon: Network, label: '마인드맵' }
                    ].map(({ mode, icon: Icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${viewMode === mode
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 🔥 메인 콘텐츠 영역 */}
            <div className="flex-1 flex overflow-hidden">
                {/* 왼쪽 패널 - 프로젝트 요소 트리 */}
                <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">프로젝트 요소</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* 챕터 */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                챕터 ({getElementsByType('chapter').length})
                            </h4>
                            <div className="space-y-2">
                                {getElementsByType('chapter').map((element) => (
                                    <div
                                        key={element.id}
                                        onClick={() => setSelectedElement(element.id)}
                                        className={`p-2 rounded-lg cursor-pointer transition-colors ${selectedElement === element.id
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{element.title}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {element.wordCount}단어 • 중요도 {element.plotRelevance}/5
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 캐릭터 */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                캐릭터 ({getElementsByType('character').length})
                            </h4>
                            <div className="space-y-2">
                                {getElementsByType('character').map((element) => (
                                    <div
                                        key={element.id}
                                        onClick={() => setSelectedElement(element.id)}
                                        className={`p-2 rounded-lg cursor-pointer transition-colors ${selectedElement === element.id
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{element.title}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {element.characterTraits?.slice(0, 2).join(', ')}
                                            {element.characterTraits && element.characterTraits.length > 2 && '...'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 아이디어 */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                아이디어 ({getElementsByType('idea').length})
                            </h4>
                            <div className="space-y-2">
                                {getElementsByType('idea').map((element) => (
                                    <div
                                        key={element.id}
                                        onClick={() => setSelectedElement(element.id)}
                                        className={`p-2 rounded-lg cursor-pointer transition-colors ${selectedElement === element.id
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{element.title}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {element.tags?.join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 메모 */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                메모 ({getElementsByType('memo').length})
                            </h4>
                            <div className="space-y-2">
                                {getElementsByType('memo').map((element) => (
                                    <div
                                        key={element.id}
                                        onClick={() => setSelectedElement(element.id)}
                                        className={`p-2 rounded-lg cursor-pointer transition-colors ${selectedElement === element.id
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{element.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 중앙 패널 - 선택된 뷰 모드 */}
                <div className="flex-1 flex flex-col">
                    {viewMode === 'timeline' && (
                        <div className="flex-1 p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Calendar className="h-5 w-5 mr-2" />
                                타임라인 뷰
                            </h2>
                            <div className="space-y-4">
                                {analysis.timeline.map((item, index) => (
                                    <div key={item.id} className="flex items-start space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                            {index < analysis.timeline.length - 1 && (
                                                <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-medium">{item.title}</h3>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {item.description}
                                                </p>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(item.timestamp).toLocaleDateString('ko-KR')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {viewMode === 'outline' && (
                        <div className="flex-1 p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Map className="h-5 w-5 mr-2" />
                                아웃라인 뷰
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {elements.map((element) => (
                                    <div
                                        key={element.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium truncate">{element.title}</h3>
                                            <div className={`w-3 h-3 rounded-full ${element.plotRelevance && element.plotRelevance >= 4
                                                ? 'bg-red-500'
                                                : element.plotRelevance && element.plotRelevance >= 3
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                                }`}></div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                                            {element.content}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{element.type}</span>
                                            <span>중요도 {element.plotRelevance}/5</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {viewMode === 'mindmap' && (
                        <div className="flex-1 p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Network className="h-5 w-5 mr-2" />
                                마인드맵 뷰
                            </h2>
                            <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                <div className="text-center">
                                    <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        마인드맵 뷰는 곧 구현 예정입니다
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        React Flow를 사용한 상호작용 노드 기반 시각화
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 오른쪽 패널 - AI 분석 결과 */}
                <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            AI 분석 결과
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* 발견된 문제점 */}
                        {analysis.plotHoles.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-3 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    발견된 문제점
                                </h4>
                                <div className="space-y-2">
                                    {analysis.plotHoles.map((issue, index) => (
                                        <div key={index} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                                            <p className="text-sm text-red-800 dark:text-red-200">{issue}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 개선 제안 */}
                        {analysis.suggestions.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                                    <Target className="h-4 w-4 mr-2" />
                                    개선 제안
                                </h4>
                                <div className="space-y-2">
                                    {analysis.suggestions.map((suggestion, index) => (
                                        <div key={index} className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                                            <p className="text-sm text-blue-800 dark:text-blue-200">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 선택된 요소의 관련 요소들 */}
                        {selectedElement && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <GitBranch className="h-4 w-4 mr-2" />
                                    연관 요소
                                </h4>
                                <div className="space-y-2">
                                    {getRelatedElements(selectedElement).map((element) => (
                                        <div key={element.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                            <div className="font-medium text-sm mb-1">{element.title}</div>
                                            <div className="text-xs text-gray-500">{element.type}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
