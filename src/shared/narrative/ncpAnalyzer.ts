// 🔥 Narrative Context Protocol (NCP) 기반 독자 반응 예측 시스템
// USC Entertainment Technology Center와 Narrative First 협력으로 개발된 표준

import { DummyDataFilter } from '../services/dummyDataFilter';
import { Logger } from '../logger';

// 🔥 기본 타입 정의 (any 타입 제거)
export interface PlotPoint {
    id: string;
    title: string;
    content: string;
    position: number;
    timelineOrder: number;
    characters: string[];
    location: string;
    tags: string[];
    emotional_weight: number;
    conflict_level: number;
    plot_relevance: 1 | 2 | 3 | 4 | 5;
    createdAt: string;
    updatedAt: string;
}

export interface Character {
    id: string;
    name: string;
    role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
    description?: string;
    motivation: string;
    arc: CharacterArc;
    relationships: CharacterRelationship[];
}

export interface CharacterArc {
    start: string;
    middle: string;
    end: string;
    growth: number; // 0-10 scale
    conflicts: string[];
}

export interface CharacterRelationship {
    targetCharacterId: string;
    type: 'ally' | 'enemy' | 'neutral' | 'love' | 'mentor' | 'rival';
    strength: number; // 0-10 scale
    description: string;
}

export interface NarrativeAnalysis {
    structure: ThreeActStructure;
    complexity: number;
    characterCount: number;
    plotlineCount: number;
    themes: string[];
}

export interface ThreeActStructure {
    act1: { start: number; end: number; description: string };
    act2: { start: number; end: number; description: string };
    act3: { start: number; end: number; description: string };
    incitingIncident: number;
    midpoint: number;
    climax: number;
}

export interface ConflictAnalysis {
    total: number;
    averageIntensity: number;
    types: string[];
}

export interface ChronologyData {
    realTime: string;
    storyTime: string;
    duration: string;
    simultaneousEvents: string[];
}

export interface CharacterTimelines {
    [characterName: string]: {
        actions: string[];
        decisions: string[];
        revelations: string[];
        relationships: string[];
    };
}

export interface TemporalIssue {
    type: 'timeline' | 'causality' | 'character' | 'world';
    description: string;
    suggestion: string;
}

export interface TensionPoint {
    scene: string;
    tension: number;
    reason: string;
}

export interface RelationshipAnalysis {
    from: string;
    to: string;
    relationship: string;
    strength: number;
    development: 'strengthening' | 'weakening' | 'stable' | 'complex';
    keyMoments: string[];
}

export interface ThemeConnection {
    theme: string;
    elements: string[];
    strength: number;
    development: string;
}

export interface PlotConnection {
    plotA: string;
    plotB: string;
    connectionType: 'causal' | 'parallel' | 'contrasting' | 'reinforcing';
    strength: number;
}

export interface SymbolismAnalysis {
    symbol: string;
    meaning: string;
    occurrences: string[];
    significance: number;
}

export interface NCPNarrativeStructure {
    // 🔥 핵심 스토리 요소들
    id: string;
    title: string;
    authoralIntent: string; // 작가의 의도

    // 🔥 관점 시스템 (Perspectives)
    mainCharacter: {
        name: string;
        motivation: string;
        methodology: string; // 문제 해결 방식
        evaluation: string;  // 성공/실패 판단 기준
        purpose: string;    // 캐릭터의 목적
    };

    impactCharacter: {
        name: string;
        influence: string; // 주인공에게 미치는 영향
        alternative: string; // 대안적 관점 제시
    };

    // 🔥 갈등의 방법론 (Methods of Conflict)
    conflictMethods: {
        universe: 'physics' | 'mind' | 'psychology' | 'biology'; // 갈등의 영역
        domain: string; // 구체적 영역
        concern: string; // 관심사
        issue: string;   // 핵심 쟁점
    };

    // 🔥 역학 시스템 (Dynamics)
    storyDynamics: {
        driver: 'action' | 'decision'; // 스토리 추진력
        limit: 'timelock' | 'optionlock'; // 제한 요소
        outcome: 'success' | 'failure';   // 결과
        judgment: 'good' | 'bad';        // 판단
    };

    // 🔥 벡터 (Vectors) - 플롯 방향성
    vectors: {
        goal: string;        // 목표
        consequence: string; // 결과
        cost: string;       // 대가
        dividend: string;   // 보상
        requirement: string; // 요구사항
        prerequisite: string; // 전제조건
        precondition: string; // 사전조건
        forewarning: string;  // 경고
    };
}

export interface ReaderEngagementPrediction {
    predictability: 'predictable' | 'surprising' | 'shocking' | 'foreshadowed';
    engagementScore: number; // 1-100
    tensionCurve: number[];  // 장면별 긴장감
    emotionalResonance: number; // 감정적 공명도
    characterArcSatisfaction: number; // 캐릭터 아크 만족도
    plotHoles: string[]; // 감지된 플롯홀들

    // 🔥 독자 예측 분석
    readerPredictions: {
        whatWillHappen: string[];     // 독자가 예측하는 전개
        whenWillReveal: number;       // 반전 예상 시점
        characterFate: string[];      // 캐릭터 운명 예측
        themeRealization: string;     // 주제 인식도
    };

    // 🔥 개선 제안
    improvements: {
        foreshadowing: string[];      // 복선 개선 제안
        pacing: string[];            // 페이싱 개선
        characterDevelopment: string[]; // 캐릭터 발전 제안
        thematicResonance: string[];  // 테마적 공명 강화
    };
}

export interface TimelineAnalysis {
    // 🔥 시간 흐름 추적
    chronology: {
        realTime: string;    // 실제 시간
        storyTime: string;   // 스토리 시간
        duration: string;    // 지속 시간
        simultaneousEvents: string[]; // 동시 발생 사건
    };

    // 🔥 캐릭터별 시간선
    characterTimelines: {
        [characterName: string]: {
            actions: string[];     // 행동
            decisions: string[];   // 결정
            revelations: string[]; // 깨달음
            relationships: string[]; // 관계 변화
        };
    };

    // 🔥 플롯홀 감지
    temporalInconsistencies: {
        type: 'timeline' | 'causality' | 'character' | 'world';
        description: string;
        suggestion: string;
    }[];

    // 🔥 긴장감 그래프
    tensionGraph: {
        scene: string;
        tension: number;
        reason: string;
    }[];
}

export interface MindmapAnalysis {
    // 🔥 캐릭터 관계 네트워크
    characterRelationships: {
        from: string;
        to: string;
        relationship: string;
        strength: number; // 1-10
        development: 'strengthening' | 'weakening' | 'stable' | 'complex';
        keyMoments: string[]; // 관계 변화 순간들
    }[];

    // 🔥 테마 연결점
    thematicConnections: {
        theme: string;
        elements: string[]; // 연결된 요소들
        strength: number;   // 연결 강도
        development: string; // 발전 양상
    }[];

    // 🔥 플롯 연결망
    plotConnections: {
        plotA: string;
        plotB: string;
        connectionType: 'causal' | 'parallel' | 'contrasting' | 'reinforcing';
        strength: number;
    }[];

    // 🔥 상징과 모티프
    symbolism: {
        symbol: string;
        meaning: string;
        occurrences: string[]; // 등장 장면들
        significance: number;   // 중요도
    }[];
}

// 🔥 NCP 기반 스토리 분석 엔진
export class NCPStoryAnalyzer {
    private ncpStructure: NCPNarrativeStructure;

    constructor(structure: NCPNarrativeStructure) {
        this.ncpStructure = structure;
    }

    // 🔥 독자 반응 예측 (AutoCrit 알고리즘 기반)
    predictReaderEngagement(plotPoints: PlotPoint[]): ReaderEngagementPrediction {
        const analysis = this.analyzeNarrativeStructure(plotPoints);

        return {
            predictability: this.calculatePredictability(analysis),
            engagementScore: this.calculateEngagementScore(analysis),
            tensionCurve: this.generateTensionCurve(plotPoints),
            emotionalResonance: this.calculateEmotionalResonance(analysis),
            characterArcSatisfaction: this.evaluateCharacterArc(),
            plotHoles: this.detectPlotHoles(plotPoints),

            readerPredictions: {
                whatWillHappen: this.predictNextEvents(plotPoints),
                whenWillReveal: this.predictRevealTiming(analysis),
                characterFate: this.predictCharacterFates(),
                themeRealization: this.analyzeThemeClarity()
            },

            improvements: {
                foreshadowing: this.suggestForeshadowing(analysis),
                pacing: this.analyzePacing(plotPoints),
                characterDevelopment: this.suggestCharacterDevelopment(),
                thematicResonance: this.strengthenThemes()
            }
        };
    }

    // 🔥 시간선 분석 (Plottr 방식 기반)
    analyzeTimeline(plotPoints: PlotPoint[]): TimelineAnalysis {
        return {
            chronology: this.trackChronology(plotPoints),
            characterTimelines: this.mapCharacterTimelines(plotPoints),
            temporalInconsistencies: this.detectTemporalIssues(plotPoints),
            tensionGraph: this.generateTensionGraph(plotPoints)
        };
    }

    // 🔥 마인드맵 분석 (관계 및 테마 중심)
    analyzeMindmap(plotPoints: PlotPoint[], characters: Character[]): MindmapAnalysis {
        return {
            characterRelationships: this.analyzeRelationships(characters, plotPoints),
            thematicConnections: this.identifyThemes(plotPoints),
            plotConnections: this.mapPlotConnections(plotPoints),
            symbolism: this.extractSymbolism(plotPoints)
        };
    }

    // 🔥 내부 분석 메서드들
    private analyzeNarrativeStructure(plotPoints: PlotPoint[]): NarrativeAnalysis {
        // NCP 기반 구조 분석
        const structure = {
            acts: this.identifyActStructure(plotPoints),
            conflicts: this.analyzeConflicts(plotPoints),
            arcs: this.trackCharacterArcs(plotPoints),
            themes: this.extractThemes(plotPoints),
            totalPoints: plotPoints.length,
            complexityScore: this.calculateComplexityScore(plotPoints)
        };

        return {
            structure: structure.acts,
            complexity: structure.complexityScore,
            characterCount: this.extractUniqueCharacters(plotPoints).length,
            plotlineCount: this.identifyPlotlines(plotPoints).length,
            themes: structure.themes
        };
    }

    private calculateComplexityScore(plotPoints: PlotPoint[]): number {
        // 플롯의 복잡성을 0-1 사이로 계산
        const characterCount = this.extractUniqueCharacters(plotPoints).length;
        const plotlineCount = this.identifyPlotlines(plotPoints).length;
        const themeCount = this.extractThemes(plotPoints).length || 1;

        return Math.min(1, (characterCount * 0.1 + plotlineCount * 0.2 + themeCount * 0.1) / 2);
    }

    private extractUniqueCharacters(plotPoints: PlotPoint[]): string[] {
        const characters = new Set<string>();
        plotPoints.forEach(point => {
            if (point.characters) {
                point.characters.forEach((char: string) => characters.add(char));
            }
        });
        return Array.from(characters);
    }

    private identifyPlotlines(plotPoints: PlotPoint[]): string[] {
        const plotlines = new Set<string>();
        plotPoints.forEach(point => {
            if (point.tags && point.tags.length > 0) {
                point.tags.forEach(tag => plotlines.add(tag));
            }
        });
        return Array.from(plotlines);
    }

    private calculatePredictability(analysis: NarrativeAnalysis): 'predictable' | 'surprising' | 'shocking' | 'foreshadowed' {
        // NCP의 갈등 방법론과 역학 시스템을 기반으로 예측성 계산
        const conflictComplexity = analysis.complexity || 0.5;
        const foreshadowingRatio = this.calculateForeshadowingRatio(analysis);
        const themeConsistency = this.evaluateThematicConsistency();

        // 복합적 판단 로직
        if (foreshadowingRatio > 0.8 && conflictComplexity < 0.3) return 'predictable';
        if (foreshadowingRatio > 0.6 && themeConsistency > 0.7) return 'foreshadowed';
        if (conflictComplexity > 0.8 && foreshadowingRatio < 0.3) return 'shocking';
        return 'surprising';
    }

    private calculateForeshadowingRatio(analysis: NarrativeAnalysis): number {
        // 복선의 적절성을 0-1로 계산
        const totalPoints = analysis.characterCount + analysis.plotlineCount || 1;
        const foreshadowedEvents = Math.floor(totalPoints * 0.3); // 30% 정도가 복선

        return Math.min(1, foreshadowedEvents / totalPoints);
    }

    private calculateEngagementScore(analysis: NarrativeAnalysis): number {
        // 여러 요소를 종합한 독자 몰입도 점수 (1-100)
        let score = 0;

        // 갈등의 명확성 (25점)
        score += this.evaluateConflictClarity() * 25;

        // 캐릭터 아크의 완성도 (25점)
        score += this.evaluateCharacterArcCompleteness() * 25;

        // 테마의 일관성 (25점)
        score += this.evaluateThematicConsistency() * 25;

        // 페이싱의 적절성 (25점)
        score += this.evaluatePacing(analysis) * 25;

        return Math.round(score);
    }

    private generateTensionCurve(plotPoints: PlotPoint[]): number[] {
        return plotPoints.map((plot, index) => {
            // 각 플롯 포인트의 긴장감을 1-10으로 계산
            const baseProgress = (index + 1) / plotPoints.length;
            const conflictIntensity = this.calculateConflictIntensity(plot);
            const proximityToClimax = this.calculateClimaxProximity(index, plotPoints.length);

            return Math.round((conflictIntensity * 0.4 + proximityToClimax * 0.6) * 10);
        });
    }

    private detectPlotHoles(plotPoints: PlotPoint[]): string[] {
        const holes: string[] = [];

        // 인과관계 체크
        for (let i = 1; i < plotPoints.length; i++) {
            if (!this.validateCausality(plotPoints[i - 1], plotPoints[i])) {
                holes.push(`${plotPoints[i - 1]?.title}과 ${plotPoints[i]?.title} 사이의 인과관계가 불분명합니다.`);
            }
        }

        // 캐릭터 동기 일관성 체크
        const characterMotivationIssues = this.checkCharacterMotivationConsistency(plotPoints);
        holes.push(...characterMotivationIssues);

        // 시간적 일관성 체크
        const temporalIssues = this.checkTemporalConsistency(plotPoints);
        holes.push(...temporalIssues);

        return holes;
    }

    // 🔥 보조 메서드들
    private evaluateConflictComplexity(): number {
        // NCP의 갈등 방법론을 기반으로 복잡성 평가
        const methods = this.ncpStructure.conflictMethods;
        let complexity = 0;

        // 갈등 영역이 심리적일수록 복잡성 증가
        if (methods.universe === 'psychology') complexity += 0.4;
        if (methods.universe === 'mind') complexity += 0.3;
        if (methods.universe === 'biology') complexity += 0.2;
        if (methods.universe === 'physics') complexity += 0.1;

        return Math.min(complexity, 1);
    }

    private evaluateConflictClarity(): number {
        // 갈등의 명확성 평가 (0-1)
        const methods = this.ncpStructure.conflictMethods;
        let clarity = 0.5;

        // 명확한 갈등 영역일수록 점수 증가
        if (methods.concern && methods.issue) clarity += 0.3;
        if (methods.domain) clarity += 0.2;

        return Math.min(clarity, 1);
    }

    private evaluateCharacterArcCompleteness(): number {
        // 캐릭터 아크 완성도 평가 (0-1)
        const mainChar = this.ncpStructure.mainCharacter;
        let completeness = 0;

        if (mainChar.motivation) completeness += 0.25;
        if (mainChar.methodology) completeness += 0.25;
        if (mainChar.evaluation) completeness += 0.25;
        if (mainChar.purpose) completeness += 0.25;

        return completeness;
    }

    private evaluateThematicConsistency(): number {
        // 테마 일관성 평가 (0-1)
        const vectors = this.ncpStructure.vectors;
        let consistency = 0;

        if (vectors.goal && vectors.consequence) consistency += 0.3;
        if (vectors.cost && vectors.dividend) consistency += 0.3;
        if (vectors.requirement && vectors.prerequisite) consistency += 0.2;
        if (vectors.precondition && vectors.forewarning) consistency += 0.2;

        return consistency;
    }

    private evaluatePacing(analysis: NarrativeAnalysis): number {
        // 페이싱 적절성 평가 (0-1)
        return Math.min(1, analysis.complexity * 0.8 + 0.2);
    }

    private calculateConflictIntensity(plot: PlotPoint): number {
        // 개별 플롯의 갈등 강도 계산 (0-1)
        return Math.min(1, plot.conflict_level / 10);
    }

    private calculateClimaxProximity(index: number, total: number): number {
        // 클라이맥스 근접도 계산 (0-1)
        const progress = index / (total - 1);
        // 일반적으로 75% 지점이 클라이맥스
        const climaxPoint = 0.75;
        return 1 - Math.abs(progress - climaxPoint);
    }

    // ... 기타 보조 메서드들은 실제 구현에서 완성
    private calculateEmotionalResonance(analysis: NarrativeAnalysis): number {
        // 감정적 공명도 계산 (0-100)
        const themeCount = analysis.themes.length;
        const complexityFactor = analysis.complexity;

        // 테마의 수와 복잡성을 기반으로 감정적 공명도 계산
        const baseScore = Math.min(80, themeCount * 15 + 40);
        const complexityBonus = complexityFactor * 20;

        return Math.round(Math.min(100, baseScore + complexityBonus));
    }

    private evaluateCharacterArc(): number {
        // 캐릭터 아크 만족도 평가 (0-100)
        const characterData = this.ncpStructure.mainCharacter;
        let score = 0;

        // 동기의 명확성
        if (characterData.motivation) score += 25;

        // 방법론의 일관성
        if (characterData.methodology) score += 25;

        // 평가 기준의 명확성
        if (characterData.evaluation) score += 25;

        // 목적의 달성도
        if (characterData.purpose) score += 25;

        return score;
    }

    // 🔥 실제 구현된 분석 메서드들
    private validateCausality(plotA: PlotPoint | undefined, plotB: PlotPoint | undefined): boolean {
        // 간단한 인과관계 검증 로직
        if (!plotA || !plotB) return false;

        // 시간적 순서 검증
        if (plotA.timelineOrder >= plotB.timelineOrder) return false;

        // 캐릭터 연관성 검증
        const sharedCharacters = plotA.characters.filter(char =>
            plotB.characters.includes(char)
        );

        return sharedCharacters.length > 0;
    }

    private checkCharacterMotivationConsistency(plotPoints: PlotPoint[]): string[] {
        const issues: string[] = [];
        const characterActions = new Map<string, Array<{ point: PlotPoint; index: number }>>();

        // 캐릭터별 행동 추적
        plotPoints.forEach((point, index) => {
            if (point.characters) {
                point.characters.forEach((char: string) => {
                    if (!characterActions.has(char)) {
                        characterActions.set(char, []);
                    }
                    characterActions.get(char)?.push({ point, index });
                });
            }
        });

        // 동기 일관성 검증
        characterActions.forEach((actions, character) => {
            if (actions.length > 2) {
                const motivationChanges = this.detectMotivationChanges(actions);
                if (motivationChanges > actions.length * 0.5) {
                    issues.push(`${character}의 동기가 너무 자주 변합니다`);
                }
            }
        });

        return issues;
    }

    private detectMotivationChanges(actions: Array<{ point: PlotPoint; index: number }>): number {
        // 동기 변화 감지 로직 (단순화)
        let changes = 0;
        for (let i = 1; i < actions.length; i++) {
            const prev = actions[i - 1]?.point;
            const curr = actions[i]?.point;

            if (prev && curr && prev.conflict_level !== curr.conflict_level) {
                changes++;
            }
        }
        return changes;
    }

    private checkTemporalConsistency(plotPoints: PlotPoint[]): string[] {
        const issues: string[] = [];

        // 시간 순서 검증
        for (let i = 1; i < plotPoints.length; i++) {
            const prev = plotPoints[i - 1];
            const curr = plotPoints[i];

            if (prev && curr) {
                // timelineOrder 기반 검증
                if (prev.timelineOrder > curr.timelineOrder) {
                    issues.push(`시간순서 오류: ${prev.title} 후에 ${curr.title}이 올 수 없습니다`);
                }
            }
        }

        return issues;
    }

    private extractThemes(plotPoints: PlotPoint[]): string[] {
        const themes = new Set<string>();

        plotPoints.forEach(point => {
            if (point.tags && point.tags.length > 0) {
                point.tags.forEach((tag: string) => themes.add(tag));
            }

            // 내용 기반 테마 추출 (키워드 분석)
            if (point.content) {
                const thematicKeywords = this.extractThematicKeywords(point.content);
                thematicKeywords.forEach(keyword => themes.add(keyword));
            }
        });

        return Array.from(themes);
    }

    private extractThematicKeywords(description: string): string[] {
        const thematicWords = ['사랑', '복수', '성장', '자유', '정의', '가족', '우정', '용기', '희생'];
        const keywords: string[] = [];

        thematicWords.forEach(word => {
            if (description.includes(word)) {
                keywords.push(word);
            }
        });

        return keywords;
    }

    // 🔥 남은 분석 메서드들 구현
    private identifyActStructure(plotPoints: PlotPoint[]): ThreeActStructure {
        const totalPoints = plotPoints.length;
        const firstAct = Math.floor(totalPoints * 0.25);
        const secondAct = Math.floor(totalPoints * 0.75);

        return {
            act1: {
                start: 0,
                end: firstAct,
                description: 'Setup - 설정과 캐릭터 소개'
            },
            act2: {
                start: firstAct,
                end: secondAct,
                description: 'Confrontation - 갈등과 발전'
            },
            act3: {
                start: secondAct,
                end: totalPoints,
                description: 'Resolution - 해결과 결말'
            },
            incitingIncident: Math.floor(totalPoints * 0.1),
            midpoint: Math.floor(totalPoints * 0.5),
            climax: Math.floor(totalPoints * 0.75)
        };
    }

    private analyzeConflicts(plotPoints: PlotPoint[]): ConflictAnalysis {
        const conflicts = plotPoints.filter(point => point.conflict_level > 5);
        const totalIntensity = conflicts.reduce((sum, c) => sum + c.conflict_level, 0);

        return {
            total: conflicts.length,
            averageIntensity: conflicts.length > 0 ? totalIntensity / conflicts.length : 0,
            types: this.identifyConflictTypes(conflicts)
        };
    }

    private identifyConflictTypes(conflicts: PlotPoint[]): string[] {
        const types = new Set<string>();

        conflicts.forEach(conflict => {
            if (conflict.characters.length > 1) {
                types.add('interpersonal');
            }
            if (conflict.emotional_weight > 7) {
                types.add('internal');
            }
            if (conflict.plot_relevance >= 4) {
                types.add('central');
            }
        });

        return Array.from(types);
    }

    private trackCharacterArcs(plotPoints: PlotPoint[]): Record<string, PlotPoint[]> {
        const characterProgress = new Map<string, PlotPoint[]>();

        plotPoints.forEach(point => {
            if (point.characters) {
                point.characters.forEach((char: string) => {
                    if (!characterProgress.has(char)) {
                        characterProgress.set(char, []);
                    }
                    characterProgress.get(char)?.push(point);
                });
            }
        });

        return Object.fromEntries(characterProgress);
    }

    private predictNextEvents(plotPoints: PlotPoint[]): string[] {
        const lastPoint = plotPoints[plotPoints.length - 1];
        const predictions: string[] = [];

        if (!lastPoint) {
            return ['스토리 시작'];
        }

        if (lastPoint.conflict_level < 5) {
            predictions.push('갈등의 시작', '캐릭터 간의 대립');
        } else if (lastPoint.conflict_level >= 8) {
            predictions.push('클라이맥스 접근', '결정적 순간');
        } else {
            predictions.push('상황 악화', '새로운 장애물 등장');
        }

        return predictions;
    }

    private predictRevealTiming(analysis: NarrativeAnalysis): number {
        // 복잡성에 따른 반전 시점 예측 (0-1)
        const complexity = analysis.complexity || 0.5;
        return 0.6 + complexity * 0.3; // 60-90% 지점
    }

    private predictCharacterFates(): string[] {
        const mainChar = this.ncpStructure.mainCharacter;
        const dynamics = this.ncpStructure.storyDynamics;

        const fates = [];
        if (dynamics.outcome === 'success') {
            fates.push(`${mainChar.name}이(가) 목표를 달성할 것`);
        } else {
            fates.push(`${mainChar.name}이(가) 실패하지만 성장할 것`);
        }

        return fates;
    }

    private analyzeThemeClarity(): string {
        const vectors = this.ncpStructure.vectors;
        if (vectors.goal && vectors.consequence) {
            return '테마가 명확하게 드러납니다';
        }
        return '테마가 더 명확하게 표현될 필요가 있습니다';
    }

    private suggestForeshadowing(analysis: NarrativeAnalysis): string[] {
        const suggestions = [
            '중요한 사건 전에 미묘한 힌트 배치',
            '캐릭터 대사를 통한 암시',
            '상징적 이미지나 소품 활용'
        ];

        if (analysis.complexity > 0.7) {
            suggestions.push('복잡한 구조에 맞는 다층적 복선');
        }

        return suggestions;
    }

    private analyzePacing(plotPoints: PlotPoint[]): string[] {
        const suggestions: string[] = [];
        let tensionLevels = plotPoints.map(p => this.calculateConflictIntensity(p));

        // 연속된 고긴장 구간 체크
        let highCount = 0;
        tensionLevels.forEach(level => {
            if (level > 0.7) highCount++;
            else {
                if (highCount > 3) {
                    suggestions.push('긴장감 완화 구간 필요');
                }
                highCount = 0;
            }
        });

        return suggestions;
    }

    private suggestCharacterDevelopment(): string[] {
        return [
            '캐릭터의 내적 갈등 심화',
            '가치관 변화 과정 명확화',
            '관계 발전을 통한 성장 표현'
        ];
    }

    private strengthenThemes(): string[] {
        return [
            '핵심 테마를 여러 플롯라인으로 반복',
            '캐릭터 선택을 통한 테마 구현',
            '상징과 은유를 활용한 테마 강화'
        ];
    }

    private trackChronology(plotPoints: PlotPoint[]): ChronologyData {
        const firstPoint = plotPoints[0];
        const lastPoint = plotPoints[plotPoints.length - 1];

        return {
            realTime: firstPoint ? `${firstPoint.createdAt} ~ ${lastPoint?.updatedAt || firstPoint.createdAt}` : '미정',
            storyTime: plotPoints.length > 0 ? `Scene ${plotPoints[0]?.timelineOrder} ~ Scene ${plotPoints[plotPoints.length - 1]?.timelineOrder}` : '미정',
            duration: `${plotPoints.length}개 장면`,
            simultaneousEvents: []
        };
    }

    private mapCharacterTimelines(plotPoints: PlotPoint[]): CharacterTimelines {
        const timelines: CharacterTimelines = {};

        plotPoints.forEach(point => {
            if (point.characters) {
                point.characters.forEach((char: string) => {
                    if (!timelines[char]) {
                        timelines[char] = {
                            actions: [],
                            decisions: [],
                            revelations: [],
                            relationships: []
                        };
                    }
                    timelines[char]!.actions.push(point.title);
                });
            }
        });

        return timelines;
    }

    private detectTemporalIssues(plotPoints: PlotPoint[]): TemporalIssue[] {
        const issues = this.checkTemporalConsistency(plotPoints);

        return issues.map(issue => {
            let suggestion = '시간순서를 재검토하세요';

            // 이슈 타입에 따른 구체적인 제안
            if (issue.includes('시간순서 오류')) {
                suggestion = '이전 사건과 현재 사건의 시간적 순서를 확인하고 조정하세요';
            } else if (issue.includes('동시에 일어날 수 없는')) {
                suggestion = '동시성 문제를 해결하기 위해 사건의 타이밍을 조정하세요';
            } else if (issue.includes('시간 간격')) {
                suggestion = '사건 간의 시간 간격이 적절한지 확인하고 필요시 조정하세요';
            } else if (issue.includes('과거 회상')) {
                suggestion = '플래시백이 현재 시점과 명확히 구분되도록 표시하세요';
            } else if (issue.includes('미래 예견')) {
                suggestion = '예견이나 복선이 논리적으로 연결되도록 검토하세요';
            }

            return {
                type: 'timeline' as const,
                description: issue,
                suggestion
            };
        });
    }

    private generateTensionGraph(plotPoints: PlotPoint[]): TensionPoint[] {
        return plotPoints.map((point, index) => ({
            scene: point.title,
            tension: point.emotional_weight,
            reason: `긴장도 ${point.conflict_level} 장면`
        }));
    }

    private analyzeRelationships(characters: Character[], plotPoints: PlotPoint[]): RelationshipAnalysis[] {
        const relationships: RelationshipAnalysis[] = [];

        for (let i = 0; i < characters.length; i++) {
            for (let j = i + 1; j < characters.length; j++) {
                const char1 = characters[i];
                const char2 = characters[j];

                if (!char1 || !char2) continue;

                // 실제 관계 데이터 찾기
                const existingRelation = char1?.relationships?.find(
                    rel => rel.targetCharacterId === char2?.id
                );

                // 키 모멘트 추출 - 두 캐릭터가 함께 등장하는 장면들
                const keyMoments: string[] = [];
                plotPoints.forEach(point => {
                    if (point.characters.includes(char1.name) && point.characters.includes(char2.name)) {
                        keyMoments.push(point.title);
                    }
                });

                // 관계 발전도 분석
                let development: 'strengthening' | 'weakening' | 'stable' | 'complex';
                if (keyMoments.length === 0) {
                    development = 'stable';
                } else if (keyMoments.length >= 3) {
                    development = 'complex';
                } else if (existingRelation?.strength && existingRelation.strength > 7) {
                    development = 'strengthening';
                } else if (existingRelation?.strength && existingRelation.strength < 3) {
                    development = 'weakening';
                } else {
                    development = 'stable';
                }

                relationships.push({
                    from: char1?.name || `Character ${i}`,
                    to: char2?.name || `Character ${j}`,
                    relationship: existingRelation?.type || '알 수 없음',
                    strength: existingRelation?.strength || 5,
                    development,
                    keyMoments: keyMoments.length > 0 ? keyMoments : ['관계 시작']
                });
            }
        }

        return relationships;
    }

    private identifyThemes(plotPoints: PlotPoint[]): ThemeConnection[] {
        const themes = this.extractThemes(plotPoints);

        return themes.map(theme => {
            // 테마 관련 요소들 실제 추출
            const elements: string[] = [];
            let themeStrength = 1;

            plotPoints.forEach(point => {
                if (point.content && point.content.includes(theme)) {
                    elements.push(point.title);
                    themeStrength++;
                }

                if (point.tags && point.tags.includes(theme)) {
                    themeStrength += 2;
                }
            });

            // 개발 상태 판정
            let development: string;
            if (themeStrength >= 8) {
                development = '완전히 발전됨';
            } else if (themeStrength >= 5) {
                development = '발전 중';
            } else if (themeStrength >= 3) {
                development = '초기 단계';
            } else {
                development = '암시만 존재';
            }

            return {
                theme,
                elements: elements.length > 0 ? elements : [`${theme} 관련 요소들`],
                strength: Math.min(10, themeStrength),
                development
            };
        });
    }

    private mapPlotConnections(plotPoints: PlotPoint[]): PlotConnection[] {
        const connections: PlotConnection[] = [];

        for (let i = 0; i < plotPoints.length - 1; i++) {
            const currentPlot = plotPoints[i];
            const nextPlot = plotPoints[i + 1];

            if (!currentPlot || !nextPlot) continue;

            // 실제 연결 강도 계산
            let strength = 5; // 기본값

            // 공통 캐릭터가 있으면 연결성 증가
            const sharedCharacters = currentPlot.characters.filter(char =>
                nextPlot.characters.includes(char)
            );
            strength += sharedCharacters.length * 2;

            // 연속된 시간순서면 연결성 증가
            if (nextPlot.timelineOrder === currentPlot.timelineOrder + 1) {
                strength += 2;
            }

            // 갈등 수준이 비슷하면 연결성 증가
            const conflictDiff = Math.abs(currentPlot.conflict_level - nextPlot.conflict_level);
            if (conflictDiff <= 2) {
                strength += 1;
            }

            connections.push({
                plotA: currentPlot.title,
                plotB: nextPlot.title,
                connectionType: 'causal' as const,
                strength: Math.min(10, Math.max(1, strength))
            });
        }

        return connections;
    }

    private extractSymbolism(plotPoints: PlotPoint[]): SymbolismAnalysis[] {
        const symbolism: SymbolismAnalysis[] = [];
        const symbolPatterns = new Map<string, { keywords: string[]; meaning: string }>();

        // 상징 패턴 정의
        symbolPatterns.set('빛과 어둠', {
            keywords: ['빛', '어둠', '그림자', '햇살', '밤', '낮', '조명', '어둠침침'],
            meaning: '희망과 절망, 선과 악의 대비'
        });

        symbolPatterns.set('물', {
            keywords: ['물', '바다', '강', '비', '눈물', '홍수', '파도'],
            meaning: '정화, 재생, 감정의 흐름'
        });

        symbolPatterns.set('불', {
            keywords: ['불', '화염', '촛불', '폭발', '타오르는', '불타는'],
            meaning: '열정, 파괴, 변화'
        });

        symbolPatterns.set('새', {
            keywords: ['새', '날개', '비행', '하늘', '자유롭게'],
            meaning: '자유, 초월, 영혼'
        });

        symbolPatterns.forEach((pattern, symbolName) => {
            const occurrences: string[] = [];
            let totalMentions = 0;

            plotPoints.forEach(point => {
                let pointMentions = 0;
                pattern.keywords.forEach(keyword => {
                    if (point.content && point.content.includes(keyword)) {
                        pointMentions++;
                        totalMentions++;
                    }
                });

                if (pointMentions > 0) {
                    occurrences.push(point.title);
                }
            });

            if (totalMentions > 0) {
                symbolism.push({
                    symbol: symbolName,
                    meaning: pattern.meaning,
                    occurrences,
                    significance: Math.min(10, Math.round((totalMentions * 2) + (occurrences.length * 1.5)))
                });
            }
        });

        // 상징이 발견되지 않은 경우 빈 배열 반환
        return symbolism;
    }
}
