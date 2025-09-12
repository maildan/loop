// 🔥 AI Analysis Panel - 간소화된 AI 분석 UI 컴포넌트
'use client';


import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
    Sparkles,
    Brain,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Zap,
    RefreshCw,
    Eye,
    Target,
    Lightbulb,
    BarChart3
} from 'lucide-react';
import { Logger } from '../../../shared/logger';
import type {
    AnalysisResponse,
    TimelineAnalysisResult,
    OutlineAnalysisResult,
    MindmapAnalysisResult
} from '../../../shared/services/aiAnalysisService';

export interface AIAnalysisPanelProps {
    projectId: string;
    analysisType: 'timeline' | 'outline' | 'mindmap';
    data: any;
    context?: {
        content?: string;
        characters?: any[];
        plotPoints?: any[];
        themes?: string[];
        genre?: string;
        targetAudience?: string;
        notes?: any[]; // 노트 데이터 추가
    };
    onAnalysisComplete?: (result: AnalysisResponse) => void;
    className?: string;
}

type AnalysisState = 'idle' | 'analyzing' | 'completed' | 'error';

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
    projectId,
    analysisType,
    data,
    context,
    onAnalysisComplete,
    className = ''
}) => {
    const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentTab, setCurrentTab] = useState<'overview' | 'detailed' | 'suggestions'>('overview');

    // 🔥 AI 분석 실행
    const handleAnalyze = async () => {
        setAnalysisState('analyzing');
        setError(null);
        setProgress(0);

        try {
            Logger.info('AI_ANALYSIS_PANEL', 'Starting analysis', {
                projectId,
                type: analysisType,
                dataSize: JSON.stringify(data).length
            });

            // 프로그레스 시뮬레이션
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + Math.random() * 15, 85));
            }, 500);

            // 동적 import로 서비스 로드
            const { getAIAnalysisService } = await import('../../../shared/services/aiAnalysisService');
            const aiService = getAIAnalysisService();

            let result: AnalysisResponse;

            switch (analysisType) {
                case 'timeline':
                    result = await aiService.analyzeTimeline({
                        projectId,
                        type: 'timeline',
                        data,
                        context
                    });
                    break;
                case 'outline':
                    result = await aiService.analyzeOutline({
                        projectId,
                        type: 'outline',
                        data,
                        context
                    });
                    break;
                case 'mindmap':
                    result = await aiService.analyzeMindmap({
                        projectId,
                        type: 'mindmap',
                        data,
                        context
                    });
                    break;
                default:
                    throw new Error(`Unsupported analysis type: ${analysisType}`);
            }

            clearInterval(progressInterval);
            setProgress(100);

            setAnalysisResult(result);
            setAnalysisState('completed');

            onAnalysisComplete?.(result);

            Logger.info('AI_ANALYSIS_PANEL', 'Analysis completed successfully', {
                analysisId: result.id,
                confidence: result.confidence,
                suggestionsCount: result.suggestions.length
            });

        } catch (err) {
            setAnalysisState('error');
            const errorMessage = err instanceof Error ? err.message : 'AI 분석 중 오류가 발생했습니다.';
            setError(errorMessage);

            Logger.error('AI_ANALYSIS_PANEL', 'Analysis failed', {
                error: errorMessage,
                projectId,
                type: analysisType
            });
        }
    };

    // 🔥 개요 렌더링
    const renderOverview = () => {
        if (!analysisResult) return null;

        const result = analysisResult.result;
        let overviewItems: Array<{ label: string; value: number; description: string; color: string }> = [];

        switch (analysisType) {
            case 'timeline':
                const timelineResult = result as TimelineAnalysisResult;
                overviewItems = [
                    {
                        label: '시간적 일관성',
                        value: timelineResult.coherence.score,
                        description: '타임라인의 논리적 일관성',
                        color: timelineResult.coherence.score > 80 ? 'bg-green-500' : timelineResult.coherence.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    },
                    {
                        label: '페이싱',
                        value: timelineResult.pacing.score,
                        description: '스토리 진행 속도의 적절성',
                        color: timelineResult.pacing.score > 80 ? 'bg-green-500' : timelineResult.pacing.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    },
                    {
                        label: '인과관계',
                        value: timelineResult.causality.score,
                        description: '사건 간의 논리적 연결성',
                        color: timelineResult.causality.score > 80 ? 'bg-green-500' : timelineResult.causality.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }
                ];
                break;
            case 'outline':
                const outlineResult = result as OutlineAnalysisResult;
                overviewItems = [
                    {
                        label: '구조적 완성도',
                        value: outlineResult.structure.score,
                        description: '아웃라인 구조의 완성도',
                        color: outlineResult.structure.score > 80 ? 'bg-green-500' : outlineResult.structure.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    },
                    {
                        label: '흐름',
                        value: outlineResult.flow.score,
                        description: '섹션 간 전환의 부드러움',
                        color: outlineResult.flow.score > 80 ? 'bg-green-500' : outlineResult.flow.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    },
                    {
                        label: '내용 깊이',
                        value: outlineResult.content.depth,
                        description: '내용의 세밀함과 깊이',
                        color: outlineResult.content.depth > 80 ? 'bg-green-500' : outlineResult.content.depth > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }
                ];
                break;
            case 'mindmap':
                const mindmapResult = result as MindmapAnalysisResult;
                overviewItems = [
                    {
                        label: '아이디어 연결성',
                        value: mindmapResult.connections.score,
                        description: '아이디어 간의 논리적 연결',
                        color: mindmapResult.connections.score > 80 ? 'bg-green-500' : mindmapResult.connections.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    },
                    {
                        label: '창의성',
                        value: mindmapResult.creativity.score,
                        description: '독창적이고 혁신적인 요소',
                        color: mindmapResult.creativity.score > 80 ? 'bg-green-500' : mindmapResult.creativity.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }
                ];
                break;
        }

        return (
            <div className="space-y-4">
                {overviewItems.map((item, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-800">{item.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-blue-600">{item.value}%</span>
                                <Badge variant="default" className="text-xs">
                                    {item.value > 80 ? '우수' : item.value > 60 ? '보통' : '개선 필요'}
                                </Badge>
                            </div>
                        </div>
                        <ProgressBar
                            value={item.value}
                            className="mb-2"
                            color={item.value > 80 ? 'green' : item.value > 60 ? 'blue' : 'red'}
                        />
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </Card>
                ))}
            </div>
        );
    };

    // 🔥 세부 분석 렌더링
    const renderDetailedAnalysis = () => {
        if (!analysisResult) return null;

        return (
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {analysisType === 'timeline' && renderTimelineDetails()}
                {analysisType === 'outline' && renderOutlineDetails()}
                {analysisType === 'mindmap' && renderMindmapDetails()}
            </div>
        );
    };

    // 🔥 타임라인 세부 분석
    const renderTimelineDetails = () => {
        const result = analysisResult!.result as TimelineAnalysisResult;

        return (
            <div className="space-y-4">
                {result.coherence.issues.length > 0 && (
                    <Card className="p-4 border-orange-200 bg-orange-50">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">시간적 일관성 문제</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {result.coherence.issues.map((issue: string, index: number) => (
                                <li key={index} className="text-sm text-orange-700">{issue}</li>
                            ))}
                        </ul>
                    </Card>
                )}

                {result.causality.brokenLinks.length > 0 && (
                    <Card className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            인과관계 문제점
                        </h4>
                        <div className="space-y-2">
                            {result.causality.brokenLinks.map((link: { from: string; to: string; issue: string }, index: number) => (
                                <div key={index} className="p-2 border border-gray-200 rounded bg-gray-50">
                                    <div className="font-medium text-sm">{link.from} → {link.to}</div>
                                    <div className="text-xs text-gray-600 mt-1">{link.issue}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        구조 분석
                    </h4>
                    <div className="space-y-2">
                        {result.structure.acts.map((act: { name: string; start: number; end: number; quality: number }, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                                <span className="font-medium text-sm">{act.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">{act.start}% - {act.end}%</span>
                                    <Badge variant={act.quality > 80 ? 'success' : 'warning'} className="text-xs">
                                        {act.quality}%
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    };

    // 🔥 아웃라인 세부 분석
    const renderOutlineDetails = () => {
        const result = analysisResult!.result as OutlineAnalysisResult;

        return (
            <div className="space-y-4">
                <Card className="p-4">
                    <h4 className="font-semibold mb-3">구조 평가</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm">균형성:</span>
                            <span className="text-sm font-medium">{result.structure.balance}</span>
                        </div>

                        {result.structure.missing.length > 0 && (
                            <div>
                                <span className="text-sm font-medium text-orange-600">누락 요소:</span>
                                <ul className="mt-1 ml-4 list-disc">
                                    {result.structure.missing.map((item: string, index: number) => (
                                        <li key={index} className="text-xs text-gray-700">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-4">
                    <h4 className="font-semibold mb-3">흐름 분석</h4>
                    <div className="space-y-2">
                        {result.flow.transitions.slice(0, 5).map((transition: { from: string; to: string; quality: number; suggestion?: string }, index: number) => (
                            <div key={index} className="p-2 border rounded">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">{transition.from} → {transition.to}</span>
                                    <Badge variant={transition.quality > 70 ? 'success' : 'warning'} className="text-xs">
                                        {transition.quality}%
                                    </Badge>
                                </div>
                                {transition.suggestion && (
                                    <div className="text-xs text-gray-600 mt-1">{transition.suggestion}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    };

    // 🔥 마인드맵 세부 분석
    const renderMindmapDetails = () => {
        const result = analysisResult!.result as MindmapAnalysisResult;

        return (
            <div className="space-y-4">
                <Card className="p-4">
                    <h4 className="font-semibold mb-3">강력한 연결고리</h4>
                    <div className="space-y-2">
                        {result.connections.strongConnections.slice(0, 5).map((connection: { from: string; to: string; strength: number; type: string }, index: number) => (
                            <div key={index} className="p-2 border rounded bg-green-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">{connection.from} ↔ {connection.to}</span>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="success" className="text-xs">{connection.type}</Badge>
                                        <span className="text-xs font-medium">{connection.strength}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-4">
                    <h4 className="font-semibold mb-3">식별된 테마</h4>
                    <div className="space-y-2">
                        {result.themes.identified.slice(0, 3).map((theme: { theme: string; relevance: number; elements: string[] }, index: number) => (
                            <div key={index} className="p-2 border rounded">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{theme.theme}</span>
                                    <Badge variant="outline" className="text-xs">{theme.relevance}%</Badge>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {theme.elements.slice(0, 3).map((element: string, elemIndex: number) => (
                                        <Badge key={elemIndex} variant="outline" className="text-xs">
                                            {element}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    };

    // 🔥 제안사항 렌더링
    const renderSuggestions = () => {
        if (!analysisResult || analysisResult.suggestions.length === 0) {
            return (
                <Card className="p-8 text-center">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">현재 제안사항이 없습니다.</p>
                </Card>
            );
        }

        return (
            <div className="space-y-3">
                {analysisResult.suggestions.slice(0, 8).map((suggestion: string, index: number) => (
                    <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <p className="text-sm leading-relaxed flex-grow">
                                {suggestion}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className={`ai-analysis-panel ${className}`}>
            {/* 🎯 분석 시작 버튼 */}
            {analysisState === 'idle' && (
                <Card className="p-6">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-purple-500" />
                            <h3 className="text-xl font-semibold">AI 분석</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {analysisType === 'timeline' && '타임라인의 일관성, 페이싱, 구조를 AI가 분석합니다.'}
                            {analysisType === 'outline' && '아웃라인의 구조, 흐름, 완성도를 AI가 분석합니다.'}
                            {analysisType === 'mindmap' && '마인드맵의 연결성, 창의성, 발전 가능성을 AI가 분석합니다.'}
                        </p>
                        <Button
                            onClick={handleAnalyze}
                            variant="primary"
                            className="w-full py-3"
                        >
                            <Brain className="w-4 h-4 mr-2" />
                            AI 분석 시작
                        </Button>
                    </div>
                </Card>
            )}

            {/* 🔄 분석 진행 중 */}
            {analysisState === 'analyzing' && (
                <Card className="p-6">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                            <h3 className="text-xl font-semibold">AI 분석 진행 중...</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Gemini AI가 데이터를 분석하고 있습니다. 잠시만 기다려주세요.
                        </p>
                        <div className="space-y-2">
                            <ProgressBar value={progress} />
                            <div className="text-sm text-gray-500">
                                {progress < 30 && '데이터 전처리 중...'}
                                {progress >= 30 && progress < 60 && 'AI 분석 수행 중...'}
                                {progress >= 60 && progress < 90 && '결과 정리 중...'}
                                {progress >= 90 && '분석 완료 중...'}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* ❌ 분석 오류 */}
            {analysisState === 'error' && (
                <Card className="p-6">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                            <h3 className="text-xl font-semibold text-red-600">분석 실패</h3>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                        <Button
                            onClick={handleAnalyze}
                            variant="outline"
                            className="w-full"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            다시 분석하기
                        </Button>
                    </div>
                </Card>
            )}

            {/* ✅ 분석 완료 */}
            {analysisState === 'completed' && analysisResult && (
                <div className="space-y-6">
                    {/* 헤더 */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-semibold">AI 분석 결과</h3>
                            </div>
                            <Badge variant={analysisResult.confidence > 0.8 ? 'success' : 'warning'}>
                                신뢰도 {Math.round(analysisResult.confidence * 100)}%
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {new Date(analysisResult.metadata.timestamp).toLocaleString('ko-KR')}에 분석 완료
                            (처리시간: {Math.round(analysisResult.metadata.processingTime / 1000)}초)
                        </p>
                    </Card>

                    {/* 탭 네비게이션 */}
                    <div className="flex gap-2 border-b">
                        <button
                            onClick={() => setCurrentTab('overview')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${currentTab === 'overview'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            개요
                        </button>
                        <button
                            onClick={() => setCurrentTab('detailed')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${currentTab === 'detailed'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            세부 분석
                        </button>
                        <button
                            onClick={() => setCurrentTab('suggestions')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${currentTab === 'suggestions'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            제안사항 ({analysisResult.suggestions.length})
                        </button>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className="min-h-[300px]">
                        {currentTab === 'overview' && renderOverview()}
                        {currentTab === 'detailed' && renderDetailedAnalysis()}
                        {currentTab === 'suggestions' && renderSuggestions()}
                    </div>
                </div>
            )}
        </div>
    );
};
