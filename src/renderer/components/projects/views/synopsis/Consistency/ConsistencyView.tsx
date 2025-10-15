'use client';

import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import { ProgressBar } from './ProgressBar';
import type { ConsistencyViewProps, ConsistencyWarning, CharacterConsistencyScore } from '../types';
import {
    analyzeNarrativeKeywords,
    getNarrativeKeywordDefinition,
    type NarrativeKeywordCategory,
    type NarrativeKeywordInsight,
} from '../../../../../../shared/narrative/keywordSets';

const SPEECH_KEYWORD_DEFINITION = getNarrativeKeywordDefinition('speechPattern');
const APPEARANCE_KEYWORD_DEFINITION = getNarrativeKeywordDefinition('appearance');
const PERSONALITY_KEYWORD_DEFINITION = getNarrativeKeywordDefinition('personality');
const SPEECH_PATTERN_KEYWORDS = SPEECH_KEYWORD_DEFINITION.keywords;
const APPEARANCE_KEYWORDS = APPEARANCE_KEYWORD_DEFINITION.keywords;
const PERSONALITY_KEYWORDS = PERSONALITY_KEYWORD_DEFINITION.keywords;

type ScoreDetail = {
    score: number;
    reason: string;
};

type CharacterAnalysis = {
    characterId: string;
    characterName: string;
    overallScore: number;
    scores: {
        speech: ScoreDetail;
        appearance: ScoreDetail;
        personality: ScoreDetail;
    };
    warnings: ConsistencyWarning[];
};

type CharacterScoreCard = CharacterConsistencyScore & {
    speechReason: string;
    appearanceReason: string;
    personalityReason: string;
};

const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

const collapseWhitespace = (text: string): string => text.replace(/\s+/g, ' ').trim();

const evaluateNarrativeField = (
    fieldLabel: string,
    sources: Array<string | undefined | null>,
    thresholds: { minimum: number; adequate: number; excellent: number; keywords?: string[]; keywordCategory?: NarrativeKeywordCategory }
): ScoreDetail => {
    const combined = collapseWhitespace(
        sources
            .filter((source): source is string => typeof source === 'string' && source.trim().length > 0)
            .join(' ')
    );

    if (combined.length === 0) {
        return {
            score: 20,
            reason: `${fieldLabel} 설명이 비어 있습니다. 짧더라도 핵심 습관이나 특징을 작성해 주세요.`,
        };
    }

    const length = combined.length;
    let base = 35;

    if (length >= thresholds.excellent) {
        base = 94 + Math.min(6, (length - thresholds.excellent) / 40);
    } else if (length >= thresholds.adequate) {
        base = 78 + ((length - thresholds.adequate) / (thresholds.excellent - thresholds.adequate)) * 16;
    } else if (length >= thresholds.minimum) {
        base = 58 + ((length - thresholds.minimum) / (thresholds.adequate - thresholds.minimum)) * 20;
    } else {
        base = 35 + (length / Math.max(thresholds.minimum, 1)) * 18;
    }

    let keywordInsight: NarrativeKeywordInsight | null = null;
    let keywordMessage = '핵심 어휘가 확인되지 않았습니다';

    if (thresholds.keywordCategory) {
        const insights = analyzeNarrativeKeywords([combined], [thresholds.keywordCategory]);
        const insight = insights[0];

        if (insight) {
            keywordInsight = insight;
            const totalKeywords = getNarrativeKeywordDefinition(thresholds.keywordCategory).keywords.length;

            if (insight.coverageRate === 0) {
                base -= 8;
                keywordMessage = `${fieldLabel} 핵심 어휘가 부족합니다`;
            } else {
                base += Math.min(12, insight.matchedKeywords.length * 3);
                const matchedLabel = insight.matchedKeywords.slice(0, 3).join(', ');
                keywordMessage = insight.matchedKeywords.length >= totalKeywords
                    ? `${fieldLabel} 핵심 어휘가 모두 확인되었습니다`
                    : `${insight.matchedKeywords.length}개의 핵심 어휘 확인${matchedLabel ? ` (${matchedLabel})` : ''}`;
            }
        }
    } else if (thresholds.keywords && thresholds.keywords.length > 0) {
        const matches = thresholds.keywords.filter(keyword => combined.includes(keyword)).length;
        if (matches === 0) {
            base -= 8;
            keywordMessage = `${fieldLabel} 핵심 어휘가 부족합니다`;
        } else {
            base += Math.min(12, matches * 3);
            keywordMessage = `${matches}개의 핵심 어휘 확인`;
        }
    }

    const qualitative = base >= 85
        ? '한국 연재 기준으로도 안정적인 묘사 길이입니다'
        : base >= 65
            ? '뼈대는 있지만 구체 사례를 더하면 좋습니다'
            : '감각적인 예시나 사건 묘사를 추가하면 독자가 기억하기 쉽습니다';

    const reasonParts = [
        `${fieldLabel} 서술 ${length.toLocaleString('ko-KR')}자`,
        keywordMessage,
        qualitative,
    ];

    if (keywordInsight) {
        reasonParts.push(keywordInsight.guidance);
    }

    return {
        score: clampScore(base),
        reason: reasonParts.filter(Boolean).join(' · '),
    };
};

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

export const ConsistencyView: React.FC<ConsistencyViewProps> = ({
    projectId,
    characters = [],
    synopsisStats,
}) => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
    const { data: statsData } = synopsisStats;
    const summary = statsData.summary;

    const characterAnalyses = useMemo<CharacterAnalysis[]>(() => {
        if (!characters || characters.length === 0) {
            return [];
        }

        return characters.map<CharacterAnalysis>((char) => {
            const speech = evaluateNarrativeField('말투', [char.notes, char.personality, char.description], {
                minimum: 80,
                adequate: 160,
                excellent: 260,
                keywords: SPEECH_PATTERN_KEYWORDS,
                keywordCategory: 'speechPattern',
            });

            const appearance = evaluateNarrativeField('외모', [char.appearance, char.description], {
                minimum: 70,
                adequate: 140,
                excellent: 220,
                keywords: APPEARANCE_KEYWORDS,
                keywordCategory: 'appearance',
            });

            const personality = evaluateNarrativeField('성격', [char.personality, char.background, char.conflicts], {
                minimum: 90,
                adequate: 180,
                excellent: 280,
                keywords: PERSONALITY_KEYWORDS,
                keywordCategory: 'personality',
            });

            const overallScore = clampScore(
                speech.score * 0.4 + appearance.score * 0.25 + personality.score * 0.35
            );

            const warnings: ConsistencyWarning[] = [];

            if (speech.score < 55) {
                warnings.push({
                    id: `speech-${char.id}`,
                    characterId: char.id,
                    characterName: char.name,
                    type: 'speech_pattern',
                    episode: 0,
                    description: `${char.name}의 말투 묘사가 짧습니다. 대표 대사나 억양을 기록해 주세요.`,
                    severity: speech.score < 40 ? 'high' : 'medium',
                    createdAt: char.updatedAt ? new Date(char.updatedAt) : undefined,
                });
            }

            if (appearance.score < 60) {
                warnings.push({
                    id: `appearance-${char.id}`,
                    characterId: char.id,
                    characterName: char.name,
                    type: 'appearance',
                    episode: 0,
                    description: `${char.name}의 외모 정보가 부족합니다. 색감·실루엣 등을 더해 주세요.`,
                    severity: appearance.score < 45 ? 'high' : 'medium',
                    createdAt: char.updatedAt ? new Date(char.updatedAt) : undefined,
                });
            }

            if (personality.score < 60) {
                warnings.push({
                    id: `personality-${char.id}`,
                    characterId: char.id,
                    characterName: char.name,
                    type: 'personality',
                    episode: 0,
                    description: `${char.name}의 성격·동기가 뚜렷하지 않습니다. 갈등이나 목표를 추가해 주세요.`,
                    severity: personality.score < 45 ? 'high' : 'medium',
                    createdAt: char.updatedAt ? new Date(char.updatedAt) : undefined,
                });
            }

            return {
                characterId: char.id,
                characterName: char.name,
                overallScore,
                scores: {
                    speech,
                    appearance,
                    personality,
                },
                warnings,
            };
        });
    }, [characters]);

    const timelineWarnings = useMemo<ConsistencyWarning[]>(() => {
        if (!summary) {
            return [];
        }

        return summary.foreshadows
            .filter(foreshadow => foreshadow.resolvedEpisode == null)
            .map<ConsistencyWarning>((foreshadow) => ({
                id: `foreshadow-${foreshadow.id}`,
                type: 'timeline',
                description: `복선 "${foreshadow.title}"이 아직 회수되지 않았습니다.`,
                severity: 'medium',
                episode: foreshadow.introducedEpisode ?? 0,
                characterName: '스토리 구조',
            }));
    }, [summary]);

    const characterGeneratedWarnings = useMemo<ConsistencyWarning[]>(() =>
        characterAnalyses.flatMap(analysis => analysis.warnings),
    [characterAnalyses]);

    const warnings: ConsistencyWarning[] = useMemo(() => [
        ...timelineWarnings,
        ...characterGeneratedWarnings,
    ], [timelineWarnings, characterGeneratedWarnings]);

    const characterScores = useMemo<CharacterScoreCard[]>(() => {
        if (characterAnalyses.length === 0) {
            return [];
        }

        return characterAnalyses.map<CharacterScoreCard>((analysis) => {
            const characterWarnings = warnings.filter(w => w.characterId === analysis.characterId);

            return {
                characterId: analysis.characterId,
                characterName: analysis.characterName,
                overallScore: analysis.overallScore,
                speechPatternScore: analysis.scores.speech.score,
                appearanceScore: analysis.scores.appearance.score,
                personalityScore: analysis.scores.personality.score,
                warningCount: characterWarnings.length,
                speechReason: analysis.scores.speech.reason,
                appearanceReason: analysis.scores.appearance.reason,
                personalityReason: analysis.scores.personality.reason,
            };
        });
    }, [characterAnalyses, warnings]);

    // ✅ 전체 일관성 점수 계산
    const overallConsistency = useMemo(() => {
        if (summary?.consistencyScore != null) {
            return Math.round(summary.consistencyScore);
        }

        if (characterScores.length === 0) return 100;
        const avg = characterScores.reduce((sum, char) => sum + char.overallScore, 0) / characterScores.length;
        return Math.round(avg);
    }, [characterScores, summary?.consistencyScore]);

    // ✅ 필터링된 경고 목록
    const filteredWarnings = useMemo(() => {
        if (!selectedCharacterId) return warnings;
        return warnings.filter(w => w.characterId === selectedCharacterId);
    }, [selectedCharacterId, warnings]);

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

                {/* 경고 요약 (Phase 2: AI 분석 후 표시) */}
                <div className="mt-4 flex gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">
                            {warnings.filter(w => w.severity === 'high').length} 심각
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-4 py-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-500">
                            {warnings.filter(w => w.severity === 'medium').length} 중간
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-4 py-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-500">
                            {warnings.filter(w => w.severity === 'low').length} 낮음
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
                        <div className="flex items-start gap-3">
                            {/* Character Avatar */}
                            <CharacterAvatar name={char.characterName} size="md" />
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground">{char.characterName}</h3>
                                        <p className="text-sm text-muted-foreground mt-0.5">
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

                                {/* Progress Bars for each metric */}
                                <div className="mt-4 space-y-2.5">
                                    <ProgressBar 
                                        value={char.speechPatternScore} 
                                        label="말투" 
                                        size="sm"
                                        tooltip={char.speechReason}
                                    />
                                    <ProgressBar 
                                        value={char.appearanceScore} 
                                        label="외모" 
                                        size="sm"
                                        tooltip={char.appearanceReason}
                                    />
                                    <ProgressBar 
                                        value={char.personalityScore} 
                                        label="성격" 
                                        size="sm"
                                        tooltip={char.personalityReason}
                                    />
                                </div>
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
                        <div className="rounded-lg border border-dashed border-green-500/30 bg-green-500/5 p-12 text-center">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <p className="text-lg text-foreground font-semibold">완벽합니다! 🎉</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                모든 캐릭터 설정이 일관되게 유지되고 있습니다.
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Phase 2에서 AI 분석이 추가되면 더 정밀한 체크가 가능합니다.
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
                                                • {warning.episode && warning.episode > 0 ? `${warning.episode}화` : '회차 정보 없음'}
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
                                                {warning.createdAt ? warning.createdAt.toLocaleDateString('ko-KR') : 'Unknown'}
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
