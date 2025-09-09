'use client';

// 🔥 시놉시스 편집 뷰 - 완전 리팩토링 버전

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Logger } from '../../../../shared/logger';
import { useStructureStore } from '../../../stores/useStructureStore';
import { NCPStoryAnalyzer, NCPNarrativeStructure, ReaderEngagementPrediction, TimelineAnalysis, MindmapAnalysis } from '../../../../shared/narrative/ncpAnalyzer';
import {
    Plus,
    Edit3,
    Trash2,
    Clock,
    Target,
    Zap,
    Heart,
    Users,
    MapPin,
    ArrowRight,
    MoreHorizontal,
    Save,
    X as XIcon,
    ChevronLeft,
    ChevronRight,
    Workflow,
    FileText,
    Eye,
    Lightbulb,
    AlertTriangle
} from 'lucide-react';

interface PlotPoint {
    id: string;
    act: 1 | 2 | 3;
    title: string;
    description: string;
    type: 'setup' | 'conflict' | 'resolution' | 'twist' | 'climax';
    characters: string[];
    location?: string;
    notes?: string;
    order: number;

    // 🔥 아웃라인 뷰용 - 독자 예측 관련
    readerPredictability?: 'predictable' | 'surprising' | 'shocking' | 'foreshadowed';
    tensionLevel?: 1 | 2 | 3 | 4 | 5; // 긴장감 레벨
    isReversalPoint?: boolean; // 반전 지점 여부
    foreshadowingPoints?: string[]; // 복선 요소들

    // 🔥 타임라인 뷰용 - 시간과 캐릭터 관련
    timeframe?: string; // "오전 10시", "3일 후" 등
    duration?: string; // "30분", "하루 종일" 등
    simultaneousEvents?: string[]; // 동시에 일어나는 다른 사건들
    characterActions?: { [characterName: string]: string }; // 캐릭터별 행동

    // 🔥 마인드맵 뷰용 - 관계와 연결
    connectedPlots?: string[]; // 연결된 다른 플롯 포인트 ID들
    thematicConnections?: string[]; // 테마적 연결점들
    characterRelationships?: { from: string; to: string; type: string }[]; // 인물 관계 변화
}

interface SynopsisViewProps {
    synopsisId: string;
    onBack: () => void;
}

// 🔥 3막 구조 템플릿 - 작가 친화적 색상과 설명
const ACT_TEMPLATES = {
    1: {
        title: '1막: 설정과 시작',
        color: 'from-emerald-400 to-teal-500',
        description: '세계관 구축, 캐릭터 소개, 갈등의 씨앗',
        bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
    },
    2: {
        title: '2막: 갈등과 발전',
        color: 'from-amber-400 to-orange-500',
        description: '갈등 심화, 캐릭터 성장, 중요한 전환점',
        bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
    },
    3: {
        title: '3막: 절정과 해결',
        color: 'from-purple-400 to-indigo-500',
        description: '클라이맥스, 갈등 해결, 새로운 균형',
        bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20'
    }
} as const;

// 🔥 플롯 타입별 스타일 - 작가가 이해하기 쉬운 색상과 아이콘
const PLOT_TYPE_STYLES = {
    setup: { icon: MapPin, color: 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-600' },
    conflict: { icon: Zap, color: 'bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-600' },
    resolution: { icon: Target, color: 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-600' },
    twist: { icon: MoreHorizontal, color: 'bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600' },
    climax: { icon: Zap, color: 'bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-600' }
} as const;

// 🔥 작가 친화적 스타일 정의
const SYNOPSIS_STYLES = {
    container: 'flex flex-col h-full bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',

    // 🔥 헤더 - 더 우아하고 전문적인 느낌
    header: 'flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-200/60 dark:border-gray-700/60 p-6 shadow-sm',
    headerContent: 'flex items-center justify-between',
    backButton: 'flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-200 font-medium',
    title: 'text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent',
    actions: 'flex items-center gap-3',
    actionButton: 'p-2.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-200 hover:scale-105',

    // 🔥 메인 컨텐츠
    content: 'flex-1 min-h-0 overflow-hidden',
    timeline: 'h-full overflow-y-auto p-8 space-y-8',

    // 🔥 편집 모달
    modal: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50',
    modalContent: 'bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden',
    modalHeader: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700',
    modalTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    modalBody: 'p-4 overflow-y-auto',
    modalFooter: 'flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-gray-700',

    // 🔥 폼 스타일
    formGroup: 'mb-4',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
    input: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    textarea: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
    select: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',

    button: 'px-4 py-2 rounded-lg font-medium transition-colors',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
} as const;

export function SynopsisView({ synopsisId: propSynopsisId, onBack }: SynopsisViewProps): React.ReactElement {
    const currentEditor = useStructureStore((s) => s.currentEditor);
    const structures = useStructureStore((s) => s.structures);
    const updateStructureItem = useStructureStore((s) => s.updateStructureItem);
    const setCurrentEditor = useStructureStore((s) => s.setCurrentEditor);

    const synopsisId = propSynopsisId || (currentEditor?.editorType === 'synopsis' ? currentEditor.itemId : undefined) || 'global_synopsis';

    // 🔥 상태 관리 - 빈 배열로 시작하고 useEffect에서 로드
    const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);

    // 🔥 NCP 기반 분석 결과 상태
    const [readerAnalysis, setReaderAnalysis] = useState<ReaderEngagementPrediction | null>(null);
    const [timelineAnalysis, setTimelineAnalysis] = useState<TimelineAnalysis | null>(null);
    const [mindmapAnalysis, setMindmapAnalysis] = useState<MindmapAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 🔥 iA Writer 스타일 Focus Mode - 작가 집중을 위한 UI
    const [focusMode, setFocusMode] = useState(false);
    const [currentFocusPlot, setCurrentFocusPlot] = useState<string | null>(null);
    const [distractionFree, setDistractionFree] = useState(false);

    // 🔥 초기 데이터 로드 및 스토어 변경 시 동기화
    useEffect(() => {
        try {
            const pid = currentEditor?.projectId;
            if (pid && structures[pid]) {
                const stored = structures[pid].find((it) => it.id === synopsisId);
                if (stored && stored.content) {
                    try {
                        const parsed = JSON.parse(stored.content);
                        if (Array.isArray(parsed)) {
                            setPlotPoints(parsed);
                            Logger.info('SYNOPSIS_VIEW', 'Synopsis loaded from store', {
                                plotCount: parsed.length,
                                projectId: pid,
                                synopsisId
                            });
                            return;
                        }
                    } catch (e) {
                        Logger.warn('SYNOPSIS_VIEW', 'Failed to parse stored content during sync', { error: e });
                    }
                }
            }

            // 데이터가 없으면 빈 배열 유지
            Logger.info('SYNOPSIS_VIEW', 'No stored synopsis data found, starting with empty array');
        } catch (e) {
            Logger.warn('SYNOPSIS_VIEW', 'Error during synopsis sync', { error: e });
        }
    }, [structures, currentEditor, synopsisId]);

    // 🔥 ESC 키로 뒤로가기
    useEffect(() => {
        const handleGlobalEscape = (event: CustomEvent): void => {
            Logger.info('SYNOPSIS_VIEW', 'ESC key pressed, going back to structure view');
            onBack();
            event.preventDefault();
        };

        window.addEventListener('global:escape', handleGlobalEscape as EventListener);
        return () => window.removeEventListener('global:escape', handleGlobalEscape as EventListener);
    }, [onBack]);

    // 🔥 데이터 저장 함수 - useStructureStore로 완전 전환
    const saveToStore = useCallback((newPlots: PlotPoint[]) => {
        try {
            const pid = currentEditor?.projectId;
            if (pid && synopsisId) {
                const content = JSON.stringify(newPlots);
                updateStructureItem(pid, synopsisId, { content });
                Logger.info('SYNOPSIS_VIEW', 'Synopsis saved to store', {
                    projectId: pid,
                    synopsisId,
                    plotCount: newPlots.length
                });
            }
        } catch (error) {
            Logger.error('SYNOPSIS_VIEW', 'Failed to save synopsis to store', { error });
        }
    }, [currentEditor?.projectId, synopsisId, updateStructureItem]);

    // 🔥 자동 저장이 포함된 setPlotPoints 래퍼
    const updatePlotPoints = useCallback((newPlots: PlotPoint[] | ((prev: PlotPoint[]) => PlotPoint[])) => {
        if (typeof newPlots === 'function') {
            setPlotPoints(prev => {
                const updated = newPlots(prev);
                saveToStore(updated);
                return updated;
            });
        } else {
            setPlotPoints(newPlots);
            saveToStore(newPlots);
        }
    }, [saveToStore]);

    const [viewMode, setViewMode] = useState<'timeline' | 'outline' | 'mindmap'>('timeline');
    const [editingPlot, setEditingPlot] = useState<PlotPoint | null>(null);
    const [showAddModal, setShowAddModal] = useState<{ show: boolean; act?: 1 | 2 | 3 }>({ show: false });
    const [detailPlot, setDetailPlot] = useState<PlotPoint | null>(null); // 🔥 아웃라인 상세 정보용

    // 🔥 마인드맵 상태 관리 (컴포넌트 레벨)
    const [mindmapZoom, setMindmapZoom] = useState(1);
    const [mindmapPan, setMindmapPan] = useState({ x: 0, y: 0 });
    const [mindmapDragging, setMindmapDragging] = useState(false);
    const [mindmapDragStart, setMindmapDragStart] = useState({ x: 0, y: 0 });
    const mindmapSvgRef = useRef<SVGSVGElement>(null);

    // 🔥 NCP 기반 스토리 분석 실행
    const runStoryAnalysis = useCallback(async () => {
        if (plotPoints.length === 0) return;

        setIsAnalyzing(true);
        try {
            // 🔥 기본 NCP 구조 생성 (실제 구현에서는 사용자 입력받음)
            const ncpStructure: NCPNarrativeStructure = {
                id: synopsisId,
                title: "현재 스토리",
                authoralIntent: "독자에게 감동과 깨달음을 주는 이야기",
                mainCharacter: {
                    name: plotPoints.find(p => p.characters.length > 0)?.characters[0] || "주인공",
                    motivation: "목표 달성",
                    methodology: "직접 행동",
                    evaluation: "성공/실패 판단",
                    purpose: "성장과 변화"
                },
                impactCharacter: {
                    name: "조력자",
                    influence: "새로운 관점 제시",
                    alternative: "다른 접근법 제안"
                },
                conflictMethods: {
                    universe: 'psychology',
                    domain: "개인적 성장",
                    concern: "정체성 확립",
                    issue: "자아 실현"
                },
                storyDynamics: {
                    driver: 'decision',
                    limit: 'optionlock',
                    outcome: 'success',
                    judgment: 'good'
                },
                vectors: {
                    goal: plotPoints.find(p => p.type === 'setup')?.description || "목표 설정",
                    consequence: plotPoints.find(p => p.type === 'conflict')?.description || "갈등 발생",
                    cost: "대가와 희생",
                    dividend: "성장과 보상",
                    requirement: "필요 조건",
                    prerequisite: "사전 준비",
                    precondition: "전제 조건",
                    forewarning: "경고와 복선"
                }
            };

            const analyzer = new NCPStoryAnalyzer(ncpStructure);

            // 🔥 프로젝트 캐릭터 정보 가져오기 (임시로 빈 배열 사용)
            const pid = currentEditor?.projectId;
            const characters: any[] = []; // 추후 캐릭터 스토어에서 가져올 예정

            // 병렬로 분석 실행
            const [readerPrediction, timelineResult, mindmapResult] = await Promise.all([
                Promise.resolve(analyzer.predictReaderEngagement(plotPoints)),
                Promise.resolve(analyzer.analyzeTimeline(plotPoints)),
                Promise.resolve(analyzer.analyzeMindmap(plotPoints, characters))
            ]);

            setReaderAnalysis(readerPrediction);
            setTimelineAnalysis(timelineResult);
            setMindmapAnalysis(mindmapResult);

            Logger.info('SYNOPSIS_VIEW', 'Story analysis completed', {
                engagementScore: readerPrediction.engagementScore,
                plotHolesFound: readerPrediction.plotHoles.length,
                predictability: readerPrediction.predictability
            });

        } catch (error) {
            Logger.error('SYNOPSIS_VIEW', 'Story analysis failed', error);
        } finally {
            setIsAnalyzing(false);
        }
    }, [plotPoints, synopsisId, currentEditor, structures]);

    // 🔥 플롯 포인트 변경 시 자동 분석 실행
    useEffect(() => {
        if (plotPoints.length > 0) {
            const timer = setTimeout(() => {
                runStoryAnalysis();
            }, 1000); // 1초 debounce

            return () => clearTimeout(timer);
        }
    }, [plotPoints, runStoryAnalysis]);

    // 🔥 플롯 포인트 생성
    const createPlotPoint = useCallback((act: 1 | 2 | 3) => {
        const newPlot: PlotPoint = {
            id: Date.now().toString(),
            act,
            title: '새 플롯 포인트',
            description: '',
            type: 'setup',
            characters: [],
            order: plotPoints.filter(p => p.act === act).length + 1,
            readerPredictability: 'predictable',
            tensionLevel: 3
        };
        setEditingPlot(newPlot);
        setShowAddModal({ show: true, act });
    }, [plotPoints]);

    // 🔥 플롯 포인트 저장
    const savePlotPoint = useCallback(() => {
        if (!editingPlot) return;

        if (showAddModal.show) {
            updatePlotPoints(prev => [...prev, editingPlot]);
        } else {
            updatePlotPoints(prev => prev.map(p => p.id === editingPlot.id ? editingPlot : p));
        }

        setEditingPlot(null);
        setShowAddModal({ show: false });
    }, [editingPlot, showAddModal.show, updatePlotPoints]);

    // 🔥 플롯 포인트 삭제
    const deletePlotPoint = useCallback((id: string) => {
        updatePlotPoints(prev => prev.filter(p => p.id !== id));
    }, [updatePlotPoints]);

    // 🔥 막별 플롯 포인트 필터링
    const getPlotPointsByAct = useCallback((act: 1 | 2 | 3) => {
        return plotPoints.filter(p => p.act === act).sort((a, b) => a.order - b.order);
    }, [plotPoints]);

    // 🔥 타임라인에서 에디터로 이동 (플롯 포인트 기반으로 새 문서 생성)
    const navigateToEditor = useCallback((plot: PlotPoint) => {
        const projectId = currentEditor?.projectId;
        if (!projectId) {
            Logger.warn('SYNOPSIS_VIEW', 'No project ID available for editor navigation');
            return;
        }

        // 플롯 포인트를 기반으로 새 구조 아이템 생성
        const newStructureId = `chapter_${plot.id}_${Date.now()}`;
        const structureTitle = `${plot.title} (${plot.act}막)`;
        const initialContent = `# ${structureTitle}

## 플롯 개요
${plot.description}

## 시간대
${plot.timeframe || '시간 미정'}

## 등장 인물
${plot.characters ? plot.characters.join(', ') : '없음'}

${plot.characterActions ? Object.entries(plot.characterActions).map(([char, action]) =>
            `### ${char}의 행동
${action}`
        ).join('\n\n') : ''}

${plot.isReversalPoint ? `
## ⚠️ 중요: 반전 지점
이 장면에서 스토리의 중요한 전환이 일어납니다.
` : ''}

${plot.foreshadowingPoints && plot.foreshadowingPoints.length > 0 ? `
## 복선 요소들
${plot.foreshadowingPoints.map(f => `- ${f}`).join('\n')}
` : ''}

---
*이 문서는 시놉시스에서 자동 생성되었습니다. 자유롭게 수정하세요.*
`;

        try {
            // 스토어에 새 구조 아이템 추가
            const newStructureItem = {
                id: newStructureId,
                title: structureTitle,
                type: 'chapter' as const,
                content: initialContent,
                order: plot.order,
                parentId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // 스토어에 구조 추가하고 에디터 설정
            setCurrentEditor({
                projectId,
                itemId: newStructureId,
                editorType: 'chapter'
            });

            Logger.info('SYNOPSIS_VIEW', 'Created new chapter from plot point and navigated to editor', {
                plotId: plot.id,
                structureId: newStructureId,
                title: structureTitle
            });

        } catch (error) {
            Logger.error('SYNOPSIS_VIEW', 'Failed to create chapter from plot point', { error });
        }
    }, [currentEditor, setCurrentEditor]);

    // 🔥 타임라인 뷰 렌더링 (캐릭터별 시간선)
    const renderTimelineView = () => (
        <div className="space-y-8">
            {/* 🔥 시간 흐름 분석 결과 */}
            {timelineAnalysis && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                        <Clock className="text-blue-500" size={24} />
                        시간 흐름 분석
                        {isAnalyzing && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                    </h3>

                    {/* 긴장감 그래프 */}
                    {readerAnalysis && (
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">긴장감 곡선</h4>
                            <div className="flex items-end space-x-1 h-20">
                                {readerAnalysis.tensionCurve.map((tension, index) => (
                                    <div
                                        key={index}
                                        className="bg-blue-500 rounded-t flex-1 transition-all duration-300"
                                        style={{ height: `${(tension / 10) * 100}%` }}
                                        title={`플롯 ${index + 1}: 긴장감 ${tension}/10`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>시작</span>
                                <span>절정</span>
                                <span>결말</span>
                            </div>
                        </div>
                    )}

                    {/* 시간적 일관성 체크 */}
                    {timelineAnalysis.temporalInconsistencies && timelineAnalysis.temporalInconsistencies.length > 0 && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                시간적 불일치 발견
                            </h4>
                            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                                {timelineAnalysis.temporalInconsistencies.slice(0, 3).map((issue, idx) => (
                                    <li key={idx}>• {issue.description}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <Clock className="text-blue-500" size={24} />
                    캐릭터별 타임라인
                </h3>
                <div className="space-y-6">
                    {plotPoints.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <Clock size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">아직 플롯 포인트가 없습니다</p>
                            <p className="text-sm">마인드맵에서 플롯을 추가해보세요</p>
                        </div>
                    ) : (
                        plotPoints.map((plot) => (
                            <div key={plot.id} className="relative pl-8 pb-8 border-l-2 border-blue-200 dark:border-blue-700 last:border-l-0">
                                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                                <div
                                    className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-pointer group ${focusMode && currentFocusPlot !== plot.id
                                            ? 'opacity-30 blur-[1px] scale-95'
                                            : 'opacity-100 blur-0 scale-100'
                                        }`}
                                    onClick={() => {
                                        setCurrentFocusPlot(plot.id);
                                        navigateToEditor(plot);
                                    }}
                                    onMouseEnter={() => focusMode && setCurrentFocusPlot(plot.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {plot.title}
                                        </h4>
                                        <div className="flex gap-2">
                                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full">
                                                {plot.timeframe || '시간 미정'}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                클릭하여 편집
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{plot.description}</p>
                                    {plot.characterActions && Object.keys(plot.characterActions).length > 0 && (
                                        <div className="space-y-2">
                                            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">캐릭터별 행동</h5>
                                            {Object.entries(plot.characterActions).map(([character, action]) => (
                                                <div key={character} className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{character}:</span>
                                                    <span className="text-gray-600 dark:text-gray-400">{action}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // 🔥 아웃라인 뷰 렌더링 (독자 예측 중심)
    const renderOutlineView = () => (
        <div className="space-y-8">
            {/* 🔥 NCP 기반 전체 분석 결과 */}
            {readerAnalysis && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                        <Eye className="text-purple-500" size={24} />
                        NCP 기반 독자 반응 예측
                        {isAnalyzing && <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />}
                    </h3>

                    {/* 핵심 지표들 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {readerAnalysis.engagementScore}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">몰입도 점수</div>
                        </div>
                        <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {readerAnalysis.emotionalResonance}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">감정적 공명</div>
                        </div>
                        <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {readerAnalysis.characterArcSatisfaction}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">캐릭터 아크</div>
                        </div>
                        <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                            <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                                {readerAnalysis.plotHoles.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">플롯홀 발견</div>
                        </div>
                    </div>

                    {/* 독자 예측 분석 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <Target size={16} className="text-purple-500" />
                                독자 예측
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">예측성: </span>
                                    <span className={`font-medium ${readerAnalysis.predictability === 'predictable' ? 'text-green-600' :
                                        readerAnalysis.predictability === 'surprising' ? 'text-yellow-600' :
                                            readerAnalysis.predictability === 'shocking' ? 'text-red-600' :
                                                'text-blue-600'
                                        }`}>
                                        {readerAnalysis.predictability === 'predictable' ? '예측 가능' :
                                            readerAnalysis.predictability === 'surprising' ? '놀라운 전개' :
                                                readerAnalysis.predictability === 'shocking' ? '충격적 반전' : '적절한 복선'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">주제 인식: </span>
                                    <span className="text-gray-900 dark:text-gray-100">{readerAnalysis.readerPredictions.themeRealization || '주제가 명확하게 전달됨'}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <Lightbulb size={16} className="text-indigo-500" />
                                개선 제안
                            </h4>
                            <div className="space-y-1 text-sm">
                                {readerAnalysis.improvements.foreshadowing.slice(0, 3).map((suggestion, idx) => (
                                    <div key={idx} className="text-gray-600 dark:text-gray-400">
                                        • {suggestion || '복선 배치를 더욱 정교하게 조정해보세요'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 플롯홀 경고 */}
                    {readerAnalysis.plotHoles.length > 0 && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                발견된 플롯홀들
                            </h4>
                            <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                                {readerAnalysis.plotHoles.slice(0, 3).map((hole, idx) => (
                                    <li key={idx}>• {hole}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <Eye className="text-purple-500" size={24} />
                    플롯 포인트별 독자 반응 분석
                </h3>
                <div className="space-y-6">
                    {plotPoints.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <Eye size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">아직 플롯 포인트가 없습니다</p>
                            <p className="text-sm">마인드맵이나 타임라인에서 플롯을 추가해보세요</p>
                        </div>
                    ) : (
                        plotPoints.map((plot) => (
                            <div key={plot.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => setDetailPlot(plot)}>
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{plot.title}</h4>
                                    <div className="flex gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${plot.readerPredictability === 'predictable' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            plot.readerPredictability === 'surprising' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                plot.readerPredictability === 'shocking' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                            {plot.readerPredictability === 'predictable' ? '예측 가능' :
                                                plot.readerPredictability === 'surprising' ? '놀라운' :
                                                    plot.readerPredictability === 'shocking' ? '충격적' : '복선'}
                                        </span>
                                        {plot.tensionLevel && (
                                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                                                긴장도 {plot.tensionLevel}/5
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{plot.description}</p>
                                {plot.isReversalPoint && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                                        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                                            <Zap size={16} />
                                            <span className="font-medium text-sm">반전 지점</span>
                                        </div>
                                    </div>
                                )}
                                {plot.foreshadowingPoints && plot.foreshadowingPoints.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">복선 요소</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {plot.foreshadowingPoints.map((foreshadow, index) => (
                                                <span key={index} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
                                                    {foreshadow}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                    <Eye size={12} />
                                    클릭하여 상세 분석 보기
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // 🔥 마인드맵 뷰 렌더링 (XMind 스타일)
    const renderMindmapView = () => {
        // 🔥 중심 노드 위치 (캔버스 중앙)
        const centerX = 400;
        const centerY = 300;

        // 🔥 막별 노드 위치 계산 (원형 배치)
        const getNodePosition = (act: 1 | 2 | 3, index: number, total: number) => {
            const radius = 200;
            const actAngle = ((act - 1) * 120) * Math.PI / 180; // 각 막은 120도씩 간격
            const nodeAngle = actAngle + (index - total / 2) * (Math.PI / 6); // 막 내에서 노드들 배치

            return {
                x: centerX + Math.cos(nodeAngle) * radius,
                y: centerY + Math.sin(nodeAngle) * radius
            };
        };

        // 🔥 마우스 이벤트 핸들러
        const handleMouseDown = (e: React.MouseEvent) => {
            setMindmapDragging(true);
            setMindmapDragStart({ x: e.clientX - mindmapPan.x, y: e.clientY - mindmapPan.y });
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            if (mindmapDragging) {
                setMindmapPan({
                    x: e.clientX - mindmapDragStart.x,
                    y: e.clientY - mindmapDragStart.y
                });
            }
        };

        const handleMouseUp = () => {
            setMindmapDragging(false);
        };

        const handleWheel = (e: React.WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setMindmapZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
        };

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
                    {/* 🔥 마인드맵 헤더 */}
                    <div className="p-6 border-b border-slate-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                <Workflow className="text-green-500" size={24} />
                                스토리 마인드맵
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">줌: {(mindmapZoom * 100).toFixed(0)}%</span>
                                <button
                                    onClick={() => { setMindmapZoom(1); setMindmapPan({ x: 0, y: 0 }); }}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                                >
                                    초기화
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            마우스 휠로 줌, 드래그로 이동, 노드 클릭으로 편집
                        </p>
                    </div>

                    {/* 🔥 XMind 스타일 마인드맵 캔버스 */}
                    <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                        <svg
                            ref={mindmapSvgRef}
                            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onWheel={handleWheel}
                        >
                            <defs>
                                {/* 🔥 연결선 화살표 */}
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="10"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon
                                        points="0 0, 10 3.5, 0 7"
                                        fill="#6B7280"
                                    />
                                </marker>

                                {/* 🔥 그라데이션 정의 */}
                                <linearGradient id="act1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 0.8 }} />
                                    <stop offset="100%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
                                </linearGradient>
                                <linearGradient id="act2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#F59E0B', stopOpacity: 0.8 }} />
                                    <stop offset="100%" style={{ stopColor: '#D97706', stopOpacity: 1 }} />
                                </linearGradient>
                                <linearGradient id="act3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.8 }} />
                                    <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>

                            <g transform={`translate(${mindmapPan.x}, ${mindmapPan.y}) scale(${mindmapZoom})`}>
                                {/* 🔥 중심 노드 */}
                                <g>
                                    <circle
                                        cx={centerX}
                                        cy={centerY}
                                        r="70"
                                        fill="url(#act2Gradient)"
                                        stroke="#1F2937"
                                        strokeWidth="3"
                                        className="drop-shadow-lg"
                                    />
                                    <text
                                        x={centerX}
                                        y={centerY - 5}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="fill-white font-bold text-base pointer-events-none"
                                        style={{ fontSize: '16px' }}
                                    >
                                        스토리
                                    </text>
                                    <text
                                        x={centerX}
                                        y={centerY + 15}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="fill-white text-sm pointer-events-none"
                                        style={{ fontSize: '12px' }}
                                    >
                                        시놉시스
                                    </text>
                                </g>

                                {/* 🔥 연결선과 노드들 */}
                                {([1, 2, 3] as const).map((act) => {
                                    const actPlots = getPlotPointsByAct(act);
                                    const actGradient = `url(#act${act}Gradient)`;

                                    return actPlots.map((plot, index) => {
                                        const pos = getNodePosition(act, index, actPlots.length);

                                        return (
                                            <g key={plot.id}>
                                                {/* 🔥 중심에서 노드로의 연결선 */}
                                                <line
                                                    x1={centerX}
                                                    y1={centerY}
                                                    x2={pos.x}
                                                    y2={pos.y}
                                                    stroke="#6B7280"
                                                    strokeWidth="2"
                                                    strokeDasharray="5,5"
                                                    markerEnd="url(#arrowhead)"
                                                    className="opacity-60"
                                                />

                                                {/* 🔥 플롯 노드 */}
                                                <g
                                                    className={`cursor-pointer hover:opacity-80 transition-all duration-300 ${focusMode && currentFocusPlot !== plot.id
                                                            ? 'opacity-30 blur-[1px]'
                                                            : 'opacity-100 blur-0'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentFocusPlot(plot.id);
                                                        setEditingPlot(plot);
                                                    }}
                                                    onMouseEnter={() => focusMode && setCurrentFocusPlot(plot.id)}
                                                >
                                                    <ellipse
                                                        cx={pos.x}
                                                        cy={pos.y}
                                                        rx="90"
                                                        ry="50"
                                                        fill={actGradient}
                                                        stroke="#1F2937"
                                                        strokeWidth="2"
                                                        className="drop-shadow-md"
                                                    />

                                                    {/* 🔥 플롯 제목 */}
                                                    <text
                                                        x={pos.x}
                                                        y={pos.y - 10}
                                                        textAnchor="middle"
                                                        dominantBaseline="central"
                                                        className="fill-white font-semibold pointer-events-none"
                                                        style={{ fontSize: '13px' }}
                                                    >
                                                        {plot.title.length > 12 ? plot.title.slice(0, 12) + '...' : plot.title}
                                                    </text>

                                                    {/* 🔥 막 표시 */}
                                                    <text
                                                        x={pos.x}
                                                        y={pos.y + 8}
                                                        textAnchor="middle"
                                                        dominantBaseline="central"
                                                        className="fill-white opacity-90 pointer-events-none"
                                                        style={{ fontSize: '11px' }}
                                                    >
                                                        {act}막
                                                    </text>

                                                    {/* 🔥 긴장도 표시 */}
                                                    {plot.tensionLevel && (
                                                        <text
                                                            x={pos.x}
                                                            y={pos.y + 25}
                                                            textAnchor="middle"
                                                            dominantBaseline="central"
                                                            className="fill-white pointer-events-none"
                                                            style={{ fontSize: '10px' }}
                                                        >
                                                            ⚡{plot.tensionLevel}
                                                        </text>
                                                    )}
                                                </g>

                                                {/* 🔥 반전 지점 표시 */}
                                                {plot.isReversalPoint && (
                                                    <g>
                                                        <circle
                                                            cx={pos.x + 70}
                                                            cy={pos.y - 35}
                                                            r="12"
                                                            fill="#EF4444"
                                                            stroke="#FFF"
                                                            strokeWidth="2"
                                                            className="animate-pulse"
                                                        />
                                                        <text
                                                            x={pos.x + 70}
                                                            y={pos.y - 30}
                                                            textAnchor="middle"
                                                            className="fill-white text-xs font-bold"
                                                        >
                                                            !
                                                        </text>
                                                    </g>
                                                )}
                                            </g>
                                        );
                                    });
                                })}

                                {/* 🔥 막별 레이블 */}
                                {([1, 2, 3] as const).map((act) => {
                                    const angle = ((act - 1) * 120) * Math.PI / 180;
                                    const labelPos = {
                                        x: centerX + Math.cos(angle) * 320,
                                        y: centerY + Math.sin(angle) * 320
                                    };

                                    return (
                                        <g key={`act-label-${act}`}>
                                            <rect
                                                x={labelPos.x - 40}
                                                y={labelPos.y - 15}
                                                width="80"
                                                height="30"
                                                rx="15"
                                                fill={ACT_TEMPLATES[act].color.includes('red') ? '#EF4444' :
                                                    ACT_TEMPLATES[act].color.includes('amber') ? '#F59E0B' : '#10B981'}
                                                className="opacity-90"
                                            />
                                            <text
                                                x={labelPos.x}
                                                y={labelPos.y + 5}
                                                textAnchor="middle"
                                                className="fill-white font-bold text-sm"
                                            >
                                                {ACT_TEMPLATES[act].title}
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        </svg>

                        {/* 🔥 빈 상태 표시 */}
                        {plotPoints.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <Workflow size={64} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-lg mb-2">마인드맵이 비어있습니다</p>
                                    <p className="text-sm">플롯 포인트를 추가하여 스토리 구조를 시각화해보세요</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 🔥 마인드맵 컨트롤 패널 */}
                    <div className="p-4 border-t border-slate-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => createPlotPoint(1)}
                                    className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    1막 추가
                                </button>
                                <button
                                    onClick={() => createPlotPoint(2)}
                                    className="px-3 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    2막 추가
                                </button>
                                <button
                                    onClick={() => createPlotPoint(3)}
                                    className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    3막 추가
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span>💡 드래그: 이동</span>
                                <span>🔍 휠: 줌</span>
                                <span>👆 클릭: 편집</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={SYNOPSIS_STYLES.container}>
            {/* 🔥 헤더 */}
            <div className={SYNOPSIS_STYLES.header}>
                <div className={SYNOPSIS_STYLES.headerContent}>
                    <button
                        onClick={onBack}
                        className={SYNOPSIS_STYLES.backButton}
                    >
                        <ChevronLeft size={20} />
                        <span>구조로 돌아가기</span>
                    </button>

                    <h1 className={SYNOPSIS_STYLES.title}>시놉시스 편집</h1>

                    <div className={SYNOPSIS_STYLES.actions}>
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mr-3">
                            <button
                                onClick={() => setViewMode('timeline')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'timeline'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                                title="캐릭터별 시간선 추적"
                            >
                                <Clock size={16} className="mr-1.5 inline" />
                                타임라인
                            </button>
                            <button
                                onClick={() => setViewMode('outline')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'outline'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                                title="독자 예측 분석"
                            >
                                <Eye size={16} className="mr-1.5 inline" />
                                아웃라인
                            </button>
                            <button
                                onClick={() => setViewMode('mindmap')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'mindmap'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                                title="인물 관계도 & 스토리 연결"
                            >
                                <Workflow size={16} className="mr-1.5 inline" />
                                마인드맵
                            </button>
                        </div>

                        {/* 🔥 iA Writer 스타일 Focus Mode 컨트롤 */}
                        <div className="flex items-center gap-2 mr-4">
                            <button
                                onClick={() => setFocusMode(!focusMode)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${focusMode
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300'
                                    }`}
                                title="Focus Mode - 현재 작업 중인 플롯만 하이라이트"
                            >
                                <Eye size={16} className="mr-1 inline" />
                                Focus
                            </button>
                            <button
                                onClick={() => setDistractionFree(!distractionFree)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${distractionFree
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300'
                                    }`}
                                title="방해 요소 제거 모드"
                            >
                                <Zap size={16} className="mr-1 inline" />
                                Zen
                            </button>
                        </div>

                        <button className={SYNOPSIS_STYLES.actionButton} title="저장">
                            <Save size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔥 메인 컨텐츠 - Focus Mode & Distraction Free 지원 */}
            <div className={`${SYNOPSIS_STYLES.content} ${distractionFree ? 'bg-gray-50 dark:bg-gray-900' : ''}`}>
                <div className={`${SYNOPSIS_STYLES.timeline} ${focusMode ? 'focus-mode-active' : ''}`}>
                    {/* 🔥 뷰 모드별 렌더링 - Focus Mode 적용 */}
                    {viewMode === 'timeline' && renderTimelineView()}
                    {viewMode === 'outline' && renderOutlineView()}
                    {viewMode === 'mindmap' && renderMindmapView()}
                </div>
            </div>

            {/* 🔥 편집 모달 */}
            {(editingPlot || showAddModal.show) && (
                <div className={SYNOPSIS_STYLES.modal}>
                    <div className={SYNOPSIS_STYLES.modalContent}>
                        <div className={SYNOPSIS_STYLES.modalHeader}>
                            <h2 className={SYNOPSIS_STYLES.modalTitle}>
                                {showAddModal.show ? '새 플롯 포인트' : '플롯 포인트 편집'}
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingPlot(null);
                                    setShowAddModal({ show: false });
                                }}
                                className={SYNOPSIS_STYLES.actionButton}
                            >
                                <XIcon size={18} />
                            </button>
                        </div>

                        <div className={SYNOPSIS_STYLES.modalBody}>
                            <div className={SYNOPSIS_STYLES.formGroup}>
                                <label className={SYNOPSIS_STYLES.label}>제목</label>
                                <input
                                    type="text"
                                    value={editingPlot?.title || ''}
                                    onChange={(e) => setEditingPlot(prev => prev ? { ...prev, title: e.target.value } : null)}
                                    className={SYNOPSIS_STYLES.input}
                                    placeholder="플롯 포인트 제목"
                                />
                            </div>

                            <div className={SYNOPSIS_STYLES.formGroup}>
                                <label className={SYNOPSIS_STYLES.label}>설명</label>
                                <textarea
                                    value={editingPlot?.description || ''}
                                    onChange={(e) => setEditingPlot(prev => prev ? { ...prev, description: e.target.value } : null)}
                                    className={SYNOPSIS_STYLES.textarea}
                                    rows={4}
                                    placeholder="상세한 설명을 입력하세요..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className={SYNOPSIS_STYLES.formGroup}>
                                    <label className={SYNOPSIS_STYLES.label}>타입</label>
                                    <select
                                        value={editingPlot?.type || 'setup'}
                                        onChange={(e) => setEditingPlot(prev => prev ? { ...prev, type: e.target.value as PlotPoint['type'] } : null)}
                                        className={SYNOPSIS_STYLES.select}
                                    >
                                        <option value="setup">설정</option>
                                        <option value="conflict">갈등</option>
                                        <option value="resolution">해결</option>
                                        <option value="twist">반전</option>
                                        <option value="climax">클라이맥스</option>
                                    </select>
                                </div>

                                <div className={SYNOPSIS_STYLES.formGroup}>
                                    <label className={SYNOPSIS_STYLES.label}>독자 예측도</label>
                                    <select
                                        value={editingPlot?.readerPredictability || 'predictable'}
                                        onChange={(e) => setEditingPlot(prev => prev ? { ...prev, readerPredictability: e.target.value as PlotPoint['readerPredictability'] } : null)}
                                        className={SYNOPSIS_STYLES.select}
                                    >
                                        <option value="predictable">예측 가능</option>
                                        <option value="foreshadowed">복선</option>
                                        <option value="surprising">놀라운</option>
                                        <option value="shocking">충격적</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className={SYNOPSIS_STYLES.formGroup}>
                                    <label className={SYNOPSIS_STYLES.label}>시간대</label>
                                    <input
                                        type="text"
                                        value={editingPlot?.timeframe || ''}
                                        onChange={(e) => setEditingPlot(prev => prev ? { ...prev, timeframe: e.target.value } : null)}
                                        className={SYNOPSIS_STYLES.input}
                                        placeholder="오전 10시, 3일 후 등"
                                    />
                                </div>

                                <div className={SYNOPSIS_STYLES.formGroup}>
                                    <label className={SYNOPSIS_STYLES.label}>긴장도 (1-5)</label>
                                    <select
                                        value={editingPlot?.tensionLevel || 3}
                                        onChange={(e) => setEditingPlot(prev => prev ? { ...prev, tensionLevel: Number(e.target.value) as PlotPoint['tensionLevel'] } : null)}
                                        className={SYNOPSIS_STYLES.select}
                                    >
                                        <option value={1}>1 - 평온</option>
                                        <option value={2}>2 - 약간 긴장</option>
                                        <option value={3}>3 - 보통</option>
                                        <option value={4}>4 - 높은 긴장</option>
                                        <option value={5}>5 - 최고조</option>
                                    </select>
                                </div>
                            </div>

                            <div className={SYNOPSIS_STYLES.formGroup}>
                                <label className={SYNOPSIS_STYLES.label}>장소</label>
                                <input
                                    type="text"
                                    value={editingPlot?.location || ''}
                                    onChange={(e) => setEditingPlot(prev => prev ? { ...prev, location: e.target.value } : null)}
                                    className={SYNOPSIS_STYLES.input}
                                    placeholder="이벤트가 일어나는 장소"
                                />
                            </div>
                        </div>

                        <div className={SYNOPSIS_STYLES.modalFooter}>
                            <button
                                onClick={() => {
                                    setEditingPlot(null);
                                    setShowAddModal({ show: false });
                                }}
                                className={`${SYNOPSIS_STYLES.button} ${SYNOPSIS_STYLES.secondaryButton}`}
                            >
                                취소
                            </button>
                            <button
                                onClick={savePlotPoint}
                                className={`${SYNOPSIS_STYLES.button} ${SYNOPSIS_STYLES.primaryButton}`}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔥 아웃라인 상세 정보 모달 (읽기 전용) */}
            {detailPlot && (
                <div className={SYNOPSIS_STYLES.modal}>
                    <div className={SYNOPSIS_STYLES.modalContent}>
                        <div className={SYNOPSIS_STYLES.modalHeader}>
                            <h2 className={SYNOPSIS_STYLES.modalTitle}>
                                독자 관점 분석 - {detailPlot.title}
                            </h2>
                            <button
                                onClick={() => setDetailPlot(null)}
                                className={SYNOPSIS_STYLES.actionButton}
                            >
                                <XIcon size={18} />
                            </button>
                        </div>

                        <div className={SYNOPSIS_STYLES.modalBody}>
                            <div className="space-y-6">
                                {/* 기본 정보 */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">📖 플롯 요약</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{detailPlot.description}</p>
                                </div>

                                {/* 독자 예측 분석 */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">🔮 독자 예측 분석</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">예측 가능성</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${detailPlot.readerPredictability === 'predictable' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                detailPlot.readerPredictability === 'surprising' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                    detailPlot.readerPredictability === 'shocking' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {detailPlot.readerPredictability === 'predictable' ? '예측 가능' :
                                                    detailPlot.readerPredictability === 'surprising' ? '놀라운' :
                                                        detailPlot.readerPredictability === 'shocking' ? '충격적' : '복선'}
                                            </span>
                                        </div>
                                        {detailPlot.tensionLevel && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">긴장도</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <div key={i} className={`w-3 h-3 rounded-full ${i <= (detailPlot.tensionLevel || 0) ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'
                                                                }`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-medium">{detailPlot.tensionLevel}/5</span>
                                                </div>
                                            </div>
                                        )}
                                        {detailPlot.isReversalPoint && (
                                            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                                                    <Zap size={16} />
                                                    <span className="font-medium">이 지점은 스토리의 중요한 반전을 일으킵니다</span>
                                                </div>
                                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                    독자의 기대를 뒤엎고 새로운 방향으로 이야기를 이끌어가는 전환점입니다.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 복선 요소 */}
                                {detailPlot.foreshadowingPoints && detailPlot.foreshadowingPoints.length > 0 && (
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                                        <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-3">🔍 복선 요소들</h3>
                                        <div className="space-y-2">
                                            {detailPlot.foreshadowingPoints.map((foreshadow, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                                                    <span className="text-gray-700 dark:text-gray-300">{foreshadow}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-3">
                                            💡 이 복선들이 나중에 어떻게 회수될지 계획해보세요
                                        </p>
                                    </div>
                                )}

                                {/* 캐릭터 & 시간 정보 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {detailPlot.characters && detailPlot.characters.length > 0 && (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                                            <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">👥 등장 인물</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {detailPlot.characters.map((char, index) => (
                                                    <span key={index} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                                                        {char}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {detailPlot.timeframe && (
                                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                                            <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">⏰ 시간대</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{detailPlot.timeframe}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 작가 팁 */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">✍️ 작가 팁</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {detailPlot.readerPredictability === 'predictable' ?
                                            '독자가 예측할 수 있는 전개입니다. 안정감을 주지만 때로는 작은 반전을 섞어 긴장감을 유지하세요.' :
                                            detailPlot.readerPredictability === 'foreshadowed' ?
                                                '복선이 깔린 전개입니다. 앞서 뿌린 떡밥들을 적절히 회수하여 독자에게 만족감을 주세요.' :
                                                detailPlot.readerPredictability === 'surprising' ?
                                                    '독자를 놀라게 할 전개입니다. 하지만 무리하지 않은 범위에서 논리적으로 연결되도록 주의하세요.' :
                                                    '충격적인 반전입니다. 이전 전개와의 연결고리를 명확히 하여 독자가 납득할 수 있게 만드세요.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
