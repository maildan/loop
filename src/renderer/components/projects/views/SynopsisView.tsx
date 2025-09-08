'use client';

// 🔥 시놉시스 편집 뷰 - 타임라인 + 카드 시스템

import React, { useState, useCallback, useEffect } from 'react';
import { Logger } from '../../../../shared/logger';
import { useStructureStore } from '../../../stores/useStructureStore';
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
    Eye
} from 'lucide-react'; interface PlotPoint {
    id: string;
    act: 1 | 2 | 3;
    title: string;
    description: string;
    type: 'setup' | 'conflict' | 'resolution' | 'twist' | 'climax';
    characters: string[];
    location?: string;
    notes?: string;
    order: number;
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

    // 🔥 3막 구조 - 더 아름답고 직관적인 디자인
    actsContainer: 'space-y-10',
    actSection: 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300',
    actHeader: 'p-6 bg-gradient-to-r text-white shadow-sm',
    actTitle: 'text-xl font-bold tracking-wide',
    actDescription: 'text-sm opacity-95 mt-2 font-medium',
    actContent: 'p-6',

    // 🔥 플롯 포인트 - 카드형 디자인
    plotPoints: 'space-y-4',
    plotPoint: 'group bg-white/80 dark:bg-gray-700/40 backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-gray-600/60 hover:bg-white dark:hover:bg-gray-700/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer',
    plotHeader: 'flex items-start justify-between mb-3',
    plotInfo: 'flex-1',
    plotTitle: 'font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-tight',
    plotDescription: 'text-gray-600 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3',
    plotMeta: 'flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400',
    plotType: 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm',
    plotActions: 'opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2',

    // 🔥 추가 버튼 - 더 매력적인 디자인
    addButton: 'w-full mt-4 p-4 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-xl text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 flex items-center justify-center gap-3 text-sm font-medium hover:scale-105',

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
    const synopsisId = propSynopsisId || (currentEditor?.editorType === 'synopsis' ? currentEditor.itemId : undefined) || 'global_synopsis';
    // 🔥 상태 관리 - localStorage에서 데이터 복원
    const [plotPoints, setPlotPoints] = useState<PlotPoint[]>(() => {
        try {
            const saved = localStorage.getItem(`synopsis_${synopsisId}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((plot: {
                    id: string;
                    title: string;
                    description: string;
                    type: string;
                    importance: string;
                    characters: string[];
                    notes: string;
                    createdAt: string;
                    updatedAt: string;
                }) => ({
                    ...plot,
                    createdAt: new Date(plot.createdAt),
                    updatedAt: new Date(plot.updatedAt)
                }));
            }
        } catch (error) {
            Logger.error('SYNOPSIS_VIEW', 'Failed to load synopsis from localStorage', { error });
        }

        // 작가에게 실제로 도움이 되는 시놉시스 템플릿
        return [
            {
                id: '1',
                act: 1,
                title: '후크 (Hook) - 독자의 관심 끌기',
                description: '독자가 계속 읽고 싶어지도록 하는 강력한 시작. 흥미로운 상황이나 갈등을 암시하여 호기심을 자극합니다.',
                type: 'setup',
                characters: ['주인공'],
                location: '이야기가 시작되는 공간',
                order: 1
            },
            {
                id: '2',
                act: 1,
                title: '일상 세계 (Ordinary World)',
                description: '주인공의 평범한 일상을 보여줌으로써 독자가 캐릭터에 공감할 수 있게 합니다. 앞으로 벌어질 변화와 대비됩니다.',
                type: 'setup',
                characters: ['주인공', '주변 인물들'],
                location: '주인공의 일상 공간',
                order: 2
            },
            {
                id: '3',
                act: 1,
                title: '인사이팅 인시던트 (Inciting Incident)',
                description: '이야기의 중심 갈등을 촉발하는 사건. 주인공이 행동을 취해야 하는 상황을 만듭니다.',
                type: 'conflict',
                characters: ['주인공', '갈등 요소'],
                location: '갈등이 시작되는 장소',
                order: 3
            },
            {
                id: '4',
                act: 2,
                title: '플롯 포인트 1 - 새로운 세계로',
                description: '주인공이 익숙한 환경을 떠나 새로운 도전에 직면합니다. 본격적인 모험이 시작됩니다.',
                type: 'twist',
                characters: ['주인공', '조력자'],
                location: '새로운 환경',
                order: 4
            },
            {
                id: '5',
                act: 2,
                title: '중간점 (Midpoint) - 인식의 전환',
                description: '주인공이 진실을 깨닫거나 상황이 예상과 다르게 전개됩니다. 이야기의 방향이 바뀝니다.',
                type: 'twist',
                characters: ['주인공', '핵심 인물'],
                location: '진실이 밝혀지는 곳',
                order: 5
            },
            {
                id: '6',
                act: 3,
                title: '다크 모멘트 (All is Lost)',
                description: '주인공이 가장 절망적인 상황에 처합니다. 모든 것이 실패한 것처럼 보이는 순간입니다.',
                type: 'conflict',
                characters: ['주인공'],
                location: '절망의 장소',
                order: 6
            },
            {
                id: '7',
                act: 3,
                title: '클라이맥스 (Climax) - 최종 대결',
                description: '주인공이 내적/외적 갈등을 해결하는 최고조의 순간. 이야기의 핵심 질문에 답합니다.',
                type: 'climax',
                characters: ['주인공', '적대자/갈등 요소'],
                location: '최종 대결의 장소',
                order: 7
            },
            {
                id: '8',
                act: 3,
                title: '해결 (Resolution) - 새로운 균형',
                description: '갈등이 해결되고 새로운 현실이 자리잡습니다. 주인공의 변화가 확실히 드러납니다.',
                type: 'resolution',
                characters: ['주인공', '주요 인물들'],
                location: '이야기가 마무리되는 곳',
                order: 8
            }
        ];
    });

    // 🔁 currentEditor 또는 구조 변경시 동기화
    const structures = useStructureStore((s) => s.structures);
    useEffect(() => {
        try {
            const pid = currentEditor?.projectId;
            if (pid && structures[pid]) {
                const stored = structures[pid].find((it) => it.id === synopsisId);
                if (stored && stored.content) {
                    // content를 파싱하거나 필요한 형태로 변환해 setPlotPoints 할 수 있음
                    // 현재는 단일 텍스트라 mock fallback 유지
                }
            }
        } catch (e) {
            // ignore
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

    // 🔥 데이터 저장 함수
    const saveToLocalStorage = useCallback((newPlots: PlotPoint[]) => {
        try {
            localStorage.setItem(`synopsis_${synopsisId}`, JSON.stringify(newPlots));
        } catch (error) {
            Logger.error('SYNOPSIS_VIEW', 'Failed to save synopsis to localStorage', { error });
        }
    }, [synopsisId]);

    // 🔥 자동 저장이 포함된 setPlotPoints 래퍼
    const updatePlotPoints = useCallback((newPlots: PlotPoint[] | ((prev: PlotPoint[]) => PlotPoint[])) => {
        if (typeof newPlots === 'function') {
            setPlotPoints(prev => {
                const updated = newPlots(prev);
                saveToLocalStorage(updated);
                return updated;
            });
        } else {
            setPlotPoints(newPlots);
            saveToLocalStorage(newPlots);
        }
    }, [saveToLocalStorage]);

    const [viewMode, setViewMode] = useState<'timeline' | 'outline' | 'mindmap'>('timeline');
    const [editingPlot, setEditingPlot] = useState<PlotPoint | null>(null);
    const [showAddModal, setShowAddModal] = useState<{ show: boolean; act?: 1 | 2 | 3 }>({ show: false });

    // 🔥 플롯 포인트 생성
    const createPlotPoint = useCallback((act: 1 | 2 | 3) => {
        const newPlot: PlotPoint = {
            id: Date.now().toString(),
            act,
            title: '새 플롯 포인트',
            description: '',
            type: 'setup',
            characters: [],
            order: plotPoints.filter(p => p.act === act).length + 1
        };
        setEditingPlot(newPlot);
        setShowAddModal({ show: true, act });
    }, [plotPoints]);

    // 🔥 플롯 포인트 저장
    const savePlotPoint = useCallback(() => {
        if (!editingPlot) return;

        if (showAddModal.show) {
            setPlotPoints(prev => [...prev, editingPlot]);
        } else {
            setPlotPoints(prev => prev.map(p => p.id === editingPlot.id ? editingPlot : p));
        }

        setEditingPlot(null);
        setShowAddModal({ show: false });
    }, [editingPlot, showAddModal.show]);

    // 🔥 플롯 포인트 삭제
    const deletePlotPoint = useCallback((id: string) => {
        setPlotPoints(prev => prev.filter(p => p.id !== id));
    }, []);

    // 🔥 막별 플롯 포인트 필터링
    const getPlotPointsByAct = useCallback((act: 1 | 2 | 3) => {
        return plotPoints.filter(p => p.act === act).sort((a, b) => a.order - b.order);
    }, [plotPoints]);

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
                                title="타임라인 뷰"
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
                                title="아웃라인 뷰"
                            >
                                <FileText size={16} className="mr-1.5 inline" />
                                아웃라인
                            </button>
                            <button
                                onClick={() => setViewMode('mindmap')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'mindmap'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                                title="마인드맵 뷰"
                            >
                                <Workflow size={16} className="mr-1.5 inline" />
                                마인드맵
                            </button>
                        </div>
                        <button className={SYNOPSIS_STYLES.actionButton} title="저장">
                            <Save size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔥 메인 컨텐츠 */}
            <div className={SYNOPSIS_STYLES.content}>
                <div className={SYNOPSIS_STYLES.timeline}>
                    {/* 🔥 뷰 모드별 렌더링 */}
                    {viewMode === 'timeline' && (
                        <div className={SYNOPSIS_STYLES.actsContainer}>
                            {/* 🔥 3막 구조 렌더링 */}
                            {([1, 2, 3] as const).map((act) => {
                                const actTemplate = ACT_TEMPLATES[act];
                                const actPlots = getPlotPointsByAct(act);

                                return (
                                    <div key={act} className={SYNOPSIS_STYLES.actSection}>
                                        {/* 막 헤더 */}
                                        <div className={`${SYNOPSIS_STYLES.actHeader} bg-gradient-to-r ${actTemplate.color}`}>
                                            <div className={SYNOPSIS_STYLES.actTitle}>{actTemplate.title}</div>
                                            <div className={SYNOPSIS_STYLES.actDescription}>{actTemplate.description}</div>
                                        </div>

                                        {/* 막 컨텐츠 */}
                                        <div className={SYNOPSIS_STYLES.actContent}>
                                            <div className={SYNOPSIS_STYLES.plotPoints}>
                                                {actPlots.map((plot) => {
                                                    const TypeIcon = PLOT_TYPE_STYLES[plot.type].icon;

                                                    return (
                                                        <div
                                                            key={plot.id}
                                                            className={SYNOPSIS_STYLES.plotPoint}
                                                            onClick={() => setEditingPlot(plot)}
                                                        >
                                                            <div className={SYNOPSIS_STYLES.plotHeader}>
                                                                <div className={SYNOPSIS_STYLES.plotInfo}>
                                                                    <div className={SYNOPSIS_STYLES.plotTitle}>
                                                                        {plot.title}
                                                                    </div>
                                                                    <div className={SYNOPSIS_STYLES.plotDescription}>
                                                                        {plot.description}
                                                                    </div>
                                                                    <div className={SYNOPSIS_STYLES.plotMeta}>
                                                                        <span className={`${SYNOPSIS_STYLES.plotType} ${PLOT_TYPE_STYLES[plot.type].color}`}>
                                                                            <TypeIcon size={12} />
                                                                            {plot.type}
                                                                        </span>
                                                                        {plot.characters.length > 0 && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Users size={12} />
                                                                                {plot.characters.join(', ')}
                                                                            </span>
                                                                        )}
                                                                        {plot.location && (
                                                                            <span className="flex items-center gap-1">
                                                                                <MapPin size={12} />
                                                                                {plot.location}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className={SYNOPSIS_STYLES.plotActions}>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingPlot(plot);
                                                                        }}
                                                                        className={SYNOPSIS_STYLES.actionButton}
                                                                    >
                                                                        <Edit3 size={14} />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            deletePlotPoint(plot.id);
                                                                        }}
                                                                        className={SYNOPSIS_STYLES.actionButton}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* 새 플롯 포인트 추가 버튼 */}
                                            <button
                                                onClick={() => createPlotPoint(act)}
                                                className={SYNOPSIS_STYLES.addButton}
                                            >
                                                <Plus size={16} />
                                                새 플롯 포인트 추가
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 🔥 아웃라인 뷰 */}
                    {viewMode === 'outline' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">구조 개요</h3>
                                <div className="space-y-4">
                                    {plotPoints.map((plot) => (
                                        <div key={plot.id} className="border-l-4 border-blue-400 pl-4 py-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    Act {plot.act}
                                                </span>
                                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                    {PLOT_TYPE_STYLES[plot.type].icon &&
                                                        React.createElement(PLOT_TYPE_STYLES[plot.type].icon, { size: 12 })
                                                    }
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{plot.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plot.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🔥 마인드맵 뷰 */}
                    {viewMode === 'mindmap' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">관계도</h3>
                            <div className="grid grid-cols-3 gap-8 min-h-[400px]">
                                {([1, 2, 3] as const).map((act) => (
                                    <div key={act} className="space-y-4">
                                        <div className={`text-center p-3 rounded-lg bg-gradient-to-r ${ACT_TEMPLATES[act].color} text-white font-semibold`}>
                                            {ACT_TEMPLATES[act].title}
                                        </div>
                                        <div className="space-y-3">
                                            {getPlotPointsByAct(act).map((plot) => {
                                                // 🔥 롱프레스 핸들러 - 간단한 타이머 방식
                                                let pressTimer: NodeJS.Timeout | null = null;
                                                const handleMouseDown = () => {
                                                    pressTimer = setTimeout(() => {
                                                        setEditingPlot(plot);
                                                        Logger.info('SYNOPSIS_VIEW', '롱프레스로 편집 모드 활성화', { title: plot.title });
                                                    }, 500);
                                                };
                                                const handleMouseUp = () => {
                                                    if (pressTimer) {
                                                        clearTimeout(pressTimer);
                                                        pressTimer = null;
                                                    }
                                                };
                                                const handleMouseLeave = () => {
                                                    if (pressTimer) {
                                                        clearTimeout(pressTimer);
                                                        pressTimer = null;
                                                    }
                                                };
                                                const handleClick = () => {
                                                    // 짧은 클릭 시 편집 모드
                                                    setEditingPlot(plot);
                                                };

                                                return (
                                                    <div
                                                        key={plot.id}
                                                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                        onClick={handleClick}
                                                        onMouseDown={handleMouseDown}
                                                        onMouseUp={handleMouseUp}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                            {plot.title}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            {plot.description?.slice(0, 60)}...
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
        </div>
    );
}
