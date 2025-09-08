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

// 🔥 3막 구조 템플릿
const ACT_TEMPLATES = {
    1: { title: 'Act 1: 설정', color: 'from-green-500 to-emerald-600', description: '인물, 배경, 상황 소개' },
    2: { title: 'Act 2: 전개', color: 'from-blue-500 to-indigo-600', description: '갈등 발생과 전개' },
    3: { title: 'Act 3: 해결', color: 'from-purple-500 to-violet-600', description: '클라이맥스와 결말' }
} as const;

// 🔥 플롯 타입별 스타일
const PLOT_TYPE_STYLES = {
    setup: { icon: MapPin, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    conflict: { icon: Zap, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    resolution: { icon: Target, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    twist: { icon: MoreHorizontal, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    climax: { icon: Zap, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
} as const;

// 🔥 스타일 정의
const SYNOPSIS_STYLES = {
    container: 'flex flex-col h-full bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',

    // 🔥 헤더
    header: 'flex-shrink-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 p-4',
    headerContent: 'flex items-center justify-between',
    backButton: 'flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    title: 'text-xl font-bold text-gray-900 dark:text-gray-100',
    actions: 'flex items-center gap-2',
    actionButton: 'p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',

    // 🔥 메인 컨텐츠
    content: 'flex-1 min-h-0 overflow-hidden',
    timeline: 'h-full overflow-y-auto p-6',    // 🔥 3막 구조
    actsContainer: 'space-y-8',
    actSection: 'bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden',
    actHeader: 'p-4 bg-gradient-to-r text-white',
    actTitle: 'text-lg font-bold',
    actDescription: 'text-sm opacity-90 mt-1',
    actContent: 'p-4',

    // 🔥 플롯 포인트
    plotPoints: 'space-y-3',
    plotPoint: 'group bg-slate-50 dark:bg-gray-700/50 rounded-lg p-4 border border-slate-200 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors cursor-pointer',
    plotHeader: 'flex items-start justify-between',
    plotInfo: 'flex-1',
    plotTitle: 'font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400',
    plotDescription: 'text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2',
    plotMeta: 'flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400',
    plotType: 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
    plotActions: 'opacity-0 group-hover:opacity-100 transition-opacity flex gap-1',

    // 🔥 추가 버튼
    addButton: 'w-full mt-3 p-3 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg text-slate-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2 text-sm',

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

        // 기본 mock 데이터
        return [
            {
                id: '1',
                act: 1,
                title: '주인공 소개',
                description: '평범한 일상을 보내는 주인공의 모습을 보여준다. 성격과 배경을 자연스럽게 드러낸다.',
                type: 'setup',
                characters: ['주인공'],
                location: '주인공의 집',
                order: 1,
                duration: undefined,
                notes: undefined,
                importance: 'medium' as const,
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-01-15')
            },
            {
                id: '2',
                act: 1,
                title: '사건의 시작',
                description: '평범한 일상을 깨뜨리는 중요한 사건이 발생한다. 주인공이 선택해야 할 기로에 선다.',
                type: 'conflict',
                characters: ['주인공', '조력자'],
                location: '사건 현장',
                order: 2,
                duration: undefined,
                notes: undefined,
                importance: 'high' as const,
                createdAt: new Date('2024-01-11'),
                updatedAt: new Date('2024-01-16')
            },
            {
                id: '3',
                act: 2,
                title: '첫 번째 시련',
                description: '주인공이 목표를 향해 나아가면서 겪는 첫 번째 큰 어려움. 실패와 좌절을 경험한다.',
                type: 'conflict',
                characters: ['주인공', '적대자'],
                location: '시련의 장소',
                order: 3,
                duration: undefined,
                notes: undefined,
                importance: 'medium' as const,
                createdAt: new Date('2024-01-12'),
                updatedAt: new Date('2024-01-17')
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
