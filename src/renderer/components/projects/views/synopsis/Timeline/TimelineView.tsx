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
 * Phase 1: Mock 데이터로 UI 구현
 * Phase 2: 실제 Episode + ProjectNote 연동
 */

// 🔥 Mock Episode 타입
interface MockEpisode {
    id: string;
    number: number;
    title: string;
    wordCount: number;
    act: 'intro' | 'rising' | 'development' | 'climax' | 'conclusion';
    status: 'draft' | 'published';
}

// 🔥 Mock Foreshadow 타입
interface MockForeshadow {
    id: string;
    title: string;
    content: string;
    introducedEpisode: number;
    resolvedEpisode: number | null;
    importance: 'low' | 'medium' | 'high';
}

// 🔥 Mock 데이터 - Phase 2에서 실제 API로 대체
const MOCK_EPISODES: MockEpisode[] = [
    { id: '1', number: 1, title: '회귀의 시작', wordCount: 5500, act: 'intro', status: 'published' },
    { id: '2', number: 2, title: '숨겨진 진실', wordCount: 5200, act: 'rising', status: 'published' },
    { id: '3', number: 3, title: '첫 번째 시련', wordCount: 5800, act: 'rising', status: 'published' },
    { id: '4', number: 4, title: '과거의 그림자', wordCount: 5400, act: 'rising', status: 'published' },
    { id: '5', number: 5, title: '비밀의 폭로', wordCount: 6000, act: 'development', status: 'published' },
    { id: '6', number: 6, title: '새로운 동맹', wordCount: 5300, act: 'development', status: 'published' },
    { id: '7', number: 7, title: '위기의 순간', wordCount: 5700, act: 'climax', status: 'draft' },
    { id: '8', number: 8, title: '결전의 전야', wordCount: 0, act: 'climax', status: 'draft' },
];

const MOCK_FORESHADOWS: MockForeshadow[] = [
    {
        id: 'f1',
        title: '김서준의 과거 비밀',
        content: '주인공이 회귀 전에 숨긴 비밀',
        introducedEpisode: 1,
        resolvedEpisode: 5,
        importance: 'high',
    },
    {
        id: 'f2',
        title: '숨겨진 유물의 위치',
        content: '고대 유물이 숨겨진 장소에 대한 힌트',
        introducedEpisode: 3,
        resolvedEpisode: null, // 미회수!
        importance: 'medium',
    },
    {
        id: 'f3',
        title: '배신자의 정체',
        content: '팀 내부에 스파이가 있다는 암시',
        introducedEpisode: 2,
        resolvedEpisode: null, // 미회수!
        importance: 'high',
    },
    {
        id: 'f4',
        title: '예언의 의미',
        content: '1화에 나온 예언의 진짜 의미',
        introducedEpisode: 1,
        resolvedEpisode: null, // 미회수!
        importance: 'low',
    },
];

export const TimelineView: React.FC<TimelineViewProps> = ({
    projectId,
    notes = [],
}) => {
    const [selectedForeshadow, setSelectedForeshadow] = useState<MockForeshadow | null>(null);

    // 🔥 미회수 복선 개수
    const unresolvedCount = useMemo(() => {
        return MOCK_FORESHADOWS.filter(f => f.resolvedEpisode === null).length;
    }, []);

    // 🔥 에피소드별 복선 매핑
    const getForeshadowsForEpisode = (episodeNumber: number) => {
        const introduced = MOCK_FORESHADOWS.filter(f => f.introducedEpisode === episodeNumber);
        const resolved = MOCK_FORESHADOWS.filter(f => f.resolvedEpisode === episodeNumber);
        return { introduced, resolved };
    };

    // 🔥 5막 구조 레이블
    const getActLabel = (act: MockEpisode['act']) => {
        switch (act) {
            case 'intro': return '도입';
            case 'rising': return '발단';
            case 'development': return '전개';
            case 'climax': return '절정';
            case 'conclusion': return '결말';
        }
    };

    // 🔥 5막 구조 색상
    const getActColor = (act: MockEpisode['act']) => {
        switch (act) {
            case 'intro': return 'bg-blue-500/20 text-blue-500';
            case 'rising': return 'bg-green-500/20 text-green-500';
            case 'development': return 'bg-yellow-500/20 text-yellow-500';
            case 'climax': return 'bg-red-500/20 text-red-500';
            case 'conclusion': return 'bg-purple-500/20 text-purple-500';
        }
    };

    // 🔥 중요도 색상
    const getImportanceColor = (importance: MockForeshadow['importance']) => {
        switch (importance) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-blue-500';
        }
    };

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
                            <div className="text-2xl font-bold text-foreground">{MOCK_EPISODES.length}</div>
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
            </div>

            {/* 🔥 타임라인 */}
            <div className="flex-1 overflow-auto">
                <div className="relative space-y-4">
                    {/* 세로 연결선 */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                    {MOCK_EPISODES.map((episode, index) => {
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
                                            {/* 소개된 복선 */}
                                            {introduced.map(foreshadow => (
                                                <button
                                                    key={foreshadow.id}
                                                    onClick={() => setSelectedForeshadow(foreshadow)}
                                                    className="flex w-full items-start gap-2 rounded-lg border border-border bg-background/50 p-3 text-left hover:border-[hsl(var(--accent-primary))]/50 transition-colors"
                                                >
                                                    <Pin className={`h-4 w-4 mt-0.5 ${getImportanceColor(foreshadow.importance)}`} />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-foreground text-sm">
                                                            {foreshadow.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            복선 시작 {foreshadow.resolvedEpisode ? `• ${foreshadow.resolvedEpisode}화에서 회수` : '• 미회수'}
                                                        </div>
                                                    </div>
                                                    {foreshadow.resolvedEpisode === null && (
                                                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                                    )}
                                                </button>
                                            ))}

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
