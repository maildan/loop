'use client';

import React, { useState, useMemo } from 'react';
import { Clock, BookOpen, AlertCircle, CheckCircle2, Pin, Target } from 'lucide-react';
import type { TimelineViewProps } from '../types';

/**
 * 📅 TimelineView - 에피소드 타임라인 & 복선 추적
 * 
 * DC 웹연재 갤러리 리서치:
 * - "50화 넘어가면 복선을 까먹음"
 * - "이전에 깔아둔 복선을 언제 회수해야 할지 모름"
 * 
 * 기능:
 * 1. 에피소드 세로 타임라인
 * 2. 복선 추적 (깔아둔 회차 → 회수 회차)
 * 3. 미회수 복선 경고
 * 
 * ✅ Phase 1.5: Real data integration
 * Phase 2: Gemini AI 복선 자동 추출
 */

// � 실제 Episode 타입 (ProjectElement에서 chapter 필터)
interface Episode {
    id: string;
    number: number;
    title: string;
    wordCount: number;
    act: 'intro' | 'rising' | 'development' | 'climax' | 'conclusion';
    status: 'draft' | 'published';
}

// � 실제 Foreshadow 타입 (ProjectNote에서 foreshadow 필터)
interface Foreshadow {
    id: string;
    title: string;
    content: string;
    introducedEpisode: number;
    resolvedEpisode: number | null;
    importance: 'low' | 'medium' | 'high';
}

export const TimelineView: React.FC<TimelineViewProps> = ({
    projectId,
    notes = [],
    synopsisStats,
}) => {
    const [selectedForeshadow, setSelectedForeshadow] = useState<Foreshadow | null>(null);
    const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);
    const { data: statsData } = synopsisStats;
    const summary = statsData.summary;

    // ✅ 실제 복선 노트 필터링 (Phase 2: AI 자동 추출로 대체)
    const allForeshadowNotes = useMemo((): Foreshadow[] => {
        if (summary) {
            return summary.foreshadows.map((foreshadow): Foreshadow => {
                const normalizedImportance = ((): Foreshadow['importance'] => {
                    const importance = (foreshadow.importance ?? 'medium').toLowerCase();
                    if (importance === 'high' || importance === 'low' || importance === 'medium') {
                        return importance;
                    }
                    return 'medium';
                })();

                return {
                    id: foreshadow.id,
                    title: foreshadow.title,
                    content: '',
                    introducedEpisode: foreshadow.introducedEpisode ?? 0,
                    resolvedEpisode: foreshadow.resolvedEpisode ?? null,
                    importance: normalizedImportance,
                };
            });
        }

        return notes.filter(n => 
            n.type === 'foreshadow' || 
            n.tags?.toString().includes('복선') ||
            n.title.includes('복선')
        ).map((n, index): Foreshadow => {
            const sampleImportance: Foreshadow['importance'][] = ['high', 'medium', 'low'];
            const importance = sampleImportance[index % 3] || 'medium';
            
            return {
                id: n.id,
                title: n.title,
                content: n.content,
                introducedEpisode: 1,
                resolvedEpisode: null,
                importance,
            };
        });
    }, [notes, summary]);

    // 🔥 필터링된 복선 목록 (미회수 필터 적용)
    const foreshadowNotes = useMemo(() => {
        if (showOnlyUnresolved) {
            return allForeshadowNotes.filter(f => f.resolvedEpisode === null);
        }
        return allForeshadowNotes;
    }, [allForeshadowNotes, showOnlyUnresolved]);

    // 🔥 미회수 복선 개수
    const unresolvedCount = useMemo(() => {
        return foreshadowNotes.filter(f => f.resolvedEpisode === null).length;
    }, [foreshadowNotes]);

    // 🔥 에피소드별 복선 매핑 (Phase 2: 실제 매핑)
    const getForeshadowsForEpisode = (episodeNumber: number) => {
        // 현재: 빈 배열 (복선이 notes에만 있고 episode 연결 미구현)
        // Phase 2: AI가 복선과 회차를 자동 매칭
        const introduced = foreshadowNotes.filter(f => f.introducedEpisode === episodeNumber);
        const resolved = foreshadowNotes.filter(f => f.resolvedEpisode === episodeNumber);
        return { introduced, resolved };
    };

    // 🔥 5막 구조 레이블
    const getActLabel = (act: Episode['act']) => {
        switch (act) {
            case 'intro': return '도입';
            case 'rising': return '발단';
            case 'development': return '전개';
            case 'climax': return '절정';
            case 'conclusion': return '결말';
        }
    };

    // 🔥 5막 구조 색상
    const getActColor = (act: Episode['act']) => {
        switch (act) {
            case 'intro': return 'bg-blue-500/20 text-blue-500';
            case 'rising': return 'bg-green-500/20 text-green-500';
            case 'development': return 'bg-yellow-500/20 text-yellow-500';
            case 'climax': return 'bg-red-500/20 text-red-500';
            case 'conclusion': return 'bg-purple-500/20 text-purple-500';
        }
    };

    // 🔥 중요도 색상
    const getImportanceColor = (importance: Foreshadow['importance']) => {
        switch (importance) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-blue-500';
        }
    };

    // ⚠️ Phase 1.5: Chapter 데이터가 없으므로 빈 배열 (Phase 2에서 elements 추가)
    const episodes: Episode[] = useMemo(() => {
        if (!summary) {
            return [];
        }

        return summary.timelineEpisodes
            .map<Episode>((episode) => {
                const status = episode.status.includes('publish') || episode.status.includes('release')
                    ? 'published'
                    : 'draft';
                const normalizedAct = ((): Episode['act'] => {
                    const act = (episode.act ?? '').toLowerCase();
                    if (act === 'intro' || act === 'rising' || act === 'development' || act === 'climax' || act === 'conclusion') {
                        return act;
                    }
                    return 'development';
                })();

                return {
                    id: episode.id,
                    number: episode.episodeNumber,
                    title: episode.title,
                    wordCount: episode.wordCount,
                    act: normalizedAct,
                    status,
                };
            })
            .sort((a, b) => a.number - b.number);
    }, [summary]);

    return (
        <div className="flex h-full flex-col gap-6 p-6">
            {/* 🔥 헤더 */}
            <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">에피소드 타임라인</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            회차별 진행 상황 및 복선 추적
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="rounded-lg border border-border bg-background px-4 py-2 text-center">
                            <div className="text-2xl font-bold text-foreground">{episodes.length}</div>
                            <div className="text-xs text-muted-foreground">전체 회차</div>
                        </div>
                        <div className={`rounded-lg border px-4 py-2 text-center ${
                            unresolvedCount > 0 ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'
                        }`}>
                            <div className={`text-2xl font-bold ${unresolvedCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {unresolvedCount}
                            </div>
                            <div className="text-xs text-muted-foreground">미회수 복선</div>
                        </div>
                    </div>
                </div>

                {/* 🔥 필터 버튼 */}
                {foreshadowNotes.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                        <button
                            onClick={() => setShowOnlyUnresolved(!showOnlyUnresolved)}
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                                showOnlyUnresolved
                                    ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10 text-[hsl(var(--accent-primary))]'
                                    : 'border-border bg-background text-muted-foreground hover:border-[hsl(var(--accent-primary))]/50'
                            }`}
                        >
                            <Target className="h-4 w-4" />
                            미회수 복선만 보기
                            {showOnlyUnresolved && unresolvedCount > 0 && (
                                <span className="rounded-full bg-[hsl(var(--accent-primary))]/20 px-2 py-0.5 text-xs">
                                    {unresolvedCount}개
                                </span>
                            )}
                        </button>
                        {showOnlyUnresolved && (
                            <span className="text-xs text-muted-foreground">
                                {unresolvedCount === 0 ? '모든 복선이 회수되었습니다!' : `${unresolvedCount}개 미회수`}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* 🔥 타임라인 */}
            <div className="flex-1 overflow-auto">
                {episodes.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-8 text-center">
                        <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-foreground font-medium">아직 작성된 회차가 없습니다</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            첫 회차를 작성하여 타임라인을 시작하세요
                        </p>
                    </div>
                ) : (
                    <div className="relative space-y-4">
                        {/* 세로 연결선 - 더 굵고 그라데이션 효과 */}
                        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--accent-primary))]/30 via-[hsl(var(--accent-primary))]/10 to-border rounded-full" />

                        {episodes.map((episode, index) => {
                        const { introduced, resolved } = getForeshadowsForEpisode(episode.number);
                        
                        return (
                            <div key={episode.id} className="relative pl-16">
                                {/* 타임라인 점 */}
                                <div className={`absolute left-4 top-4 h-5 w-5 rounded-full border-4 ${
                                    episode.status === 'published' 
                                        ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/30'
                                        : 'border-border bg-background'
                                }`} />

                                {/* 에피소드 카드 */}
                                <div className="rounded-lg border border-border bg-card p-4 hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    {episode.number}화
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getActColor(episode.act)}`}>
                                                    {getActLabel(episode.act)}
                                                </span>
                                                {episode.status === 'published' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground mt-1">
                                                {episode.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{episode.wordCount.toLocaleString()}자</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 복선 정보 */}
                                    {(introduced.length > 0 || resolved.length > 0) && (
                                        <div className="mt-4 space-y-2 border-t border-border pt-4">
                                            {/* 소개된 복선 - 중요도별 색상 강화 */}
                                            {introduced.map(foreshadow => {
                                                const importanceStyles = {
                                                    high: 'border-red-500/40 bg-red-500/10 hover:border-red-500/60',
                                                    medium: 'border-yellow-500/40 bg-yellow-500/10 hover:border-yellow-500/60',
                                                    low: 'border-blue-500/40 bg-blue-500/10 hover:border-blue-500/60',
                                                };
                                                
                                                return (
                                                    <button
                                                        key={foreshadow.id}
                                                        onClick={() => setSelectedForeshadow(foreshadow)}
                                                        className={`flex w-full items-start gap-2 rounded-lg border p-3 text-left transition-colors ${importanceStyles[foreshadow.importance]}`}
                                                    >
                                                        <Pin className={`h-4 w-4 mt-0.5 ${getImportanceColor(foreshadow.importance)}`} />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-foreground text-sm">
                                                                    {foreshadow.title}
                                                                </span>
                                                                {foreshadow.importance === 'high' && (
                                                                    <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-500">
                                                                        중요
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                복선 시작 {foreshadow.resolvedEpisode ? `• ${foreshadow.resolvedEpisode}화에서 회수` : '• 미회수'}
                                                            </div>
                                                        </div>
                                                        {foreshadow.resolvedEpisode === null && (
                                                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                                        )}
                                                    </button>
                                                );
                                            })}

                                            {/* 회수된 복선 */}
                                            {resolved.map(foreshadow => (
                                                <button
                                                    key={foreshadow.id}
                                                    onClick={() => setSelectedForeshadow(foreshadow)}
                                                    className="flex w-full items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-left hover:border-green-500/50 transition-colors"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-foreground text-sm">
                                                            ✅ {foreshadow.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            복선 회수 • {foreshadow.introducedEpisode}화에서 시작
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    </div>
                )}
            </div>

            {/* 🔥 복선 상세 모달 (간단 버전) */}
            {selectedForeshadow && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setSelectedForeshadow(null)}
                >
                    <div 
                        className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {selectedForeshadow.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                        selectedForeshadow.importance === 'high' ? 'bg-red-500/20 text-red-500' :
                                        selectedForeshadow.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                        'bg-blue-500/20 text-blue-500'
                                    }`}>
                                        {selectedForeshadow.importance === 'high' && '높음'}
                                        {selectedForeshadow.importance === 'medium' && '중간'}
                                        {selectedForeshadow.importance === 'low' && '낮음'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {selectedForeshadow.introducedEpisode}화에서 시작
                                    </span>
                                    {selectedForeshadow.resolvedEpisode && (
                                        <span className="text-xs text-green-500">
                                            • {selectedForeshadow.resolvedEpisode}화에서 회수
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedForeshadow(null)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-foreground">
                            {selectedForeshadow.content}
                        </p>
                        {selectedForeshadow.resolvedEpisode === null && (
                            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-500 font-medium">
                                    아직 회수되지 않은 복선입니다
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
