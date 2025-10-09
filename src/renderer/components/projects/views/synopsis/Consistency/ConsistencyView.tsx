'use client';

import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react';
import type { ConsistencyViewProps, ConsistencyWarning, CharacterConsistencyScore } from '../types';

/**
 * 📊 ConsistencyView - 캐릭터 일관성 체크
 * 
 * DC 웹연재 갤러리 리서치:
 * - "50화 넘어가면 AI가 캐릭터 설정을 까먹음"
 * - "캐릭터 말투가 회차마다 달라짐"
 * 
 * 기능:
 * 1. 캐릭터별 일관성 점수 (말투, 외모, 성격)
 * 2. 설정 모순 경고
 * 3. 최근 분석 결과
 * 
 * Phase 1: Mock 데이터로 UI 구현
 * Phase 2: Gemini AI 연동
 */

// 🔥 Mock 데이터 - Phase 2에서 실제 API로 대체
const MOCK_WARNINGS: ConsistencyWarning[] = [
    {
        id: '1',
        characterId: 'char-1',
        characterName: '김서준',
        type: 'speech_pattern',
        episode: 15,
        description: '말투 변경 감지: "~합니다체" → "~해요체"',
        severity: 'medium',
        createdAt: new Date('2025-10-05'),
    },
    {
        id: '2',
        characterId: 'char-1',
        characterName: '김서준',
        type: 'personality',
        episode: 23,
        description: '성격 불일치: 이전에는 내향적이었으나 갑자기 외향적으로 변경',
        severity: 'high',
        createdAt: new Date('2025-10-08'),
    },
    {
        id: '3',
        characterId: 'char-2',
        characterName: '이민서',
        type: 'appearance',
        episode: 18,
        description: '외모 모순: 1화에서 "긴 머리"였으나 18화에서 "단발머리"로 언급',
        severity: 'low',
        createdAt: new Date('2025-10-06'),
    },
];

export const ConsistencyView: React.FC<ConsistencyViewProps> = ({
    projectId,
    characters = [],
}) => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

    // 🔥 캐릭터별 일관성 점수 계산 (Mock)
    const characterScores = useMemo<CharacterConsistencyScore[]>(() => {
        return characters.map((char) => {
            const charWarnings = MOCK_WARNINGS.filter(w => w.characterId === char.id);
            const warningCount = charWarnings.length;
            
            // 간단한 점수 계산 (실제로는 AI 분석 결과 사용)
            const overallScore = Math.max(0, 100 - (warningCount * 15));
            
            return {
                characterId: char.id,
                characterName: char.name,
                overallScore,
                speechPatternScore: Math.max(0, 100 - (charWarnings.filter(w => w.type === 'speech_pattern').length * 20)),
                appearanceScore: Math.max(0, 100 - (charWarnings.filter(w => w.type === 'appearance').length * 20)),
                personalityScore: Math.max(0, 100 - (charWarnings.filter(w => w.type === 'personality').length * 20)),
                warningCount,
            };
        });
    }, [characters]);

    // 🔥 전체 일관성 점수 계산
    const overallConsistency = useMemo(() => {
        if (characterScores.length === 0) return 100;
        const avg = characterScores.reduce((sum, char) => sum + char.overallScore, 0) / characterScores.length;
        return Math.round(avg);
    }, [characterScores]);

    // 🔥 필터링된 경고 목록
    const filteredWarnings = useMemo(() => {
        if (!selectedCharacterId) return MOCK_WARNINGS;
        return MOCK_WARNINGS.filter(w => w.characterId === selectedCharacterId);
    }, [selectedCharacterId]);

    // 🔥 심각도별 아이콘
    const getSeverityIcon = (severity: ConsistencyWarning['severity']) => {
        switch (severity) {
            case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'medium': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'low': return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    // 🔥 심각도별 배경색
    const getSeverityBgColor = (severity: ConsistencyWarning['severity']) => {
        switch (severity) {
            case 'high': return 'bg-red-500/10 border-red-500/30';
            case 'medium': return 'bg-yellow-500/10 border-yellow-500/30';
            case 'low': return 'bg-blue-500/10 border-blue-500/30';
        }
    };

    return (
        <div className="flex h-full flex-col gap-6 p-6">
            {/* 🔥 전체 일관성 점수 */}
            <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">전체 일관성 점수</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            캐릭터 말투, 외모, 성격 일관성 평균
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="flex items-center gap-2">
                                <TrendingUp className={`h-6 w-6 ${overallConsistency >= 80 ? 'text-green-500' : overallConsistency >= 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                                <span className={`text-4xl font-bold ${overallConsistency >= 80 ? 'text-green-500' : overallConsistency >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {overallConsistency}
                                </span>
                                <span className="text-2xl text-muted-foreground">/100</span>
                            </div>
                        </div>
                        {overallConsistency >= 80 && (
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        )}
                    </div>
                </div>

                {/* 경고 요약 */}
                <div className="mt-4 flex gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">
                            {MOCK_WARNINGS.filter(w => w.severity === 'high').length} 심각
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-4 py-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-500">
                            {MOCK_WARNINGS.filter(w => w.severity === 'medium').length} 중간
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-500">
                            {MOCK_WARNINGS.filter(w => w.severity === 'low').length} 낮음
                        </span>
                    </div>
                </div>
            </div>

            {/* 🔥 캐릭터별 일관성 점수 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {characterScores.map((char) => (
                    <button
                        key={char.characterId}
                        onClick={() => setSelectedCharacterId(
                            selectedCharacterId === char.characterId ? null : char.characterId
                        )}
                        className={`rounded-lg border p-4 text-left transition-all ${
                            selectedCharacterId === char.characterId
                                ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10'
                                : 'border-border bg-card hover:border-[hsl(var(--accent-primary))]/50'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-foreground">{char.characterName}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {char.warningCount}개 경고
                                </p>
                            </div>
                            <div className="text-right">
                                <div className={`text-2xl font-bold ${
                                    char.overallScore >= 80 ? 'text-green-500' :
                                    char.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                                }`}>
                                    {char.overallScore}
                                </div>
                            </div>
                        </div>

                        {/* 세부 점수 */}
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">말투</span>
                                <span className="font-medium text-foreground">{char.speechPatternScore}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">외모</span>
                                <span className="font-medium text-foreground">{char.appearanceScore}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">성격</span>
                                <span className="font-medium text-foreground">{char.personalityScore}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* 🔥 경고 목록 */}
            <div className="flex-1 overflow-auto">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                        {selectedCharacterId ? '선택된 캐릭터 경고' : '전체 경고'}
                    </h3>
                    {selectedCharacterId && (
                        <button
                            onClick={() => setSelectedCharacterId(null)}
                            className="text-sm text-[hsl(var(--accent-primary))] hover:underline"
                        >
                            전체 보기
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {filteredWarnings.length === 0 ? (
                        <div className="rounded-lg border border-border bg-card p-8 text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                            <p className="text-foreground font-medium">일관성 문제가 발견되지 않았습니다!</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                모든 캐릭터 설정이 일관되게 유지되고 있습니다.
                            </p>
                        </div>
                    ) : (
                        filteredWarnings.map((warning) => (
                            <div
                                key={warning.id}
                                className={`rounded-lg border p-4 ${getSeverityBgColor(warning.severity)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {getSeverityIcon(warning.severity)}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground">
                                                {warning.characterName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                • {warning.episode}화
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground mt-1">
                                            {warning.description}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                {warning.type === 'speech_pattern' && '말투'}
                                                {warning.type === 'appearance' && '외모'}
                                                {warning.type === 'personality' && '성격'}
                                                {warning.type === 'location' && '위치'}
                                                {warning.type === 'timeline' && '타임라인'}
                                                {warning.type === 'other' && '기타'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {warning.createdAt.toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 🔥 분석 시작 버튼 (Phase 2에서 활성화) */}
            <div className="border-t border-border pt-4">
                <button
                    disabled
                    className="w-full rounded-lg bg-[hsl(var(--accent-primary))]/20 px-4 py-3 text-sm font-medium text-muted-foreground cursor-not-allowed"
                >
                    🤖 AI 일관성 분석 (Phase 2에서 구현 예정)
                </button>
            </div>
        </div>
    );
};
