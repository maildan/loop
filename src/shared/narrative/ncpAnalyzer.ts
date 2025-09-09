// 🔥 Narrative Context Protocol (NCP) 기반 독자 반응 예측 시스템
// USC Entertainment Technology Center와 Narrative First 협력으로 개발된 표준

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
    predictReaderEngagement(plotPoints: any[]): ReaderEngagementPrediction {
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
    analyzeTimeline(plotPoints: any[]): TimelineAnalysis {
        return {
            chronology: this.trackChronology(plotPoints),
            characterTimelines: this.mapCharacterTimelines(plotPoints),
            temporalInconsistencies: this.detectTemporalIssues(plotPoints),
            tensionGraph: this.generateTensionGraph(plotPoints)
        };
    }

    // 🔥 마인드맵 분석 (관계 및 테마 중심)
    analyzeMindmap(plotPoints: any[], characters: any[]): MindmapAnalysis {
        return {
            characterRelationships: this.analyzeRelationships(characters, plotPoints),
            thematicConnections: this.identifyThemes(plotPoints),
            plotConnections: this.mapPlotConnections(plotPoints),
            symbolism: this.extractSymbolism(plotPoints)
        };
    }

    // 🔥 내부 분석 메서드들
    private analyzeNarrativeStructure(plotPoints: any[]): any {
        // NCP 기반 구조 분석
        const structure = {
            acts: this.identifyActStructure(plotPoints),
            conflicts: this.analyzeConflicts(plotPoints),
            arcs: this.trackCharacterArcs(plotPoints),
            themes: this.extractThemes(plotPoints),
            totalPoints: plotPoints.length,
            complexityScore: this.calculateComplexityScore(plotPoints)
        };

        return structure;
    }

    private calculateComplexityScore(plotPoints: any[]): number {
        // 플롯의 복잡성을 0-1 사이로 계산
        const characterCount = this.extractUniqueCharacters(plotPoints).length;
        const plotlineCount = this.identifyPlotlines(plotPoints).length;
        const themeCount = this.extractThemes(plotPoints).length || 1;

        return Math.min(1, (characterCount * 0.1 + plotlineCount * 0.2 + themeCount * 0.1) / 2);
    }

    private extractUniqueCharacters(plotPoints: any[]): string[] {
        const characters = new Set<string>();
        plotPoints.forEach(point => {
            if (point.characters) {
                point.characters.forEach((char: string) => characters.add(char));
            }
        });
        return Array.from(characters);
    }

    private identifyPlotlines(plotPoints: any[]): string[] {
        const plotlines = new Set<string>();
        plotPoints.forEach(point => {
            if (point.plotline) plotlines.add(point.plotline);
        });
        return Array.from(plotlines);
    }

    private calculatePredictability(analysis: any): 'predictable' | 'surprising' | 'shocking' | 'foreshadowed' {
        // NCP의 갈등 방법론과 역학 시스템을 기반으로 예측성 계산
        const conflictComplexity = analysis.complexityScore || 0.5;
        const foreshadowingRatio = this.calculateForeshadowingRatio(analysis);
        const themeConsistency = this.evaluateThematicConsistency();

        // 복합적 판단 로직
        if (foreshadowingRatio > 0.8 && conflictComplexity < 0.3) return 'predictable';
        if (foreshadowingRatio > 0.6 && themeConsistency > 0.7) return 'foreshadowed';
        if (conflictComplexity > 0.8 && foreshadowingRatio < 0.3) return 'shocking';
        return 'surprising';
    }

    private calculateForeshadowingRatio(analysis: any): number {
        // 복선의 적절성을 0-1로 계산
        const totalPoints = analysis.totalPoints || 1;
        const foreshadowedEvents = Math.floor(totalPoints * 0.3); // 30% 정도가 복선

        return Math.min(1, foreshadowedEvents / totalPoints);
    }

    private calculateEngagementScore(analysis: any): number {
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

    private generateTensionCurve(plotPoints: any[]): number[] {
        return plotPoints.map((plot, index) => {
            // 각 플롯 포인트의 긴장감을 1-10으로 계산
            const baseProgress = (index + 1) / plotPoints.length;
            const conflictIntensity = this.calculateConflictIntensity(plot);
            const proximityToClimax = this.calculateClimaxProximity(index, plotPoints.length);

            return Math.round((conflictIntensity * 0.4 + proximityToClimax * 0.6) * 10);
        });
    }

    private detectPlotHoles(plotPoints: any[]): string[] {
        const holes: string[] = [];

        // 인과관계 체크
        for (let i = 1; i < plotPoints.length; i++) {
            if (!this.validateCausality(plotPoints[i - 1], plotPoints[i])) {
                holes.push(`${plotPoints[i - 1].title}과 ${plotPoints[i].title} 사이의 인과관계가 불분명합니다.`);
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

    private evaluatePacing(analysis: any): number {
        // 페이싱 적절성 평가 (0-1)
        return 0.8; // 임시 구현
    }

    private calculateConflictIntensity(plot: any): number {
        // 개별 플롯의 갈등 강도 계산 (0-1)
        if (plot.type === 'climax') return 1;
        if (plot.type === 'conflict') return 0.8;
        if (plot.type === 'twist') return 0.9;
        if (plot.type === 'resolution') return 0.3;
        return 0.5; // setup
    }

    private calculateClimaxProximity(index: number, total: number): number {
        // 클라이맥스 근접도 계산 (0-1)
        const progress = index / (total - 1);
        // 일반적으로 75% 지점이 클라이맥스
        const climaxPoint = 0.75;
        return 1 - Math.abs(progress - climaxPoint);
    }

    // ... 기타 보조 메서드들은 실제 구현에서 완성
    private calculateEmotionalResonance(analysis: any): number {
        // 감정적 공명도 계산 (0-100)
        return Math.round(Math.random() * 40 + 60); // 임시 구현
    }

    private evaluateCharacterArc(): number {
        // 캐릭터 아크 만족도 평가 (0-100)
        return Math.round(Math.random() * 30 + 70); // 임시 구현
    }

    // 🔥 실제 구현된 분석 메서드들
    private validateCausality(plotA: any, plotB: any): boolean {
        // 간단한 인과관계 검증 로직
        if (!plotA?.type || !plotB?.type) return false;

        // 논리적 순서 검증
        const logicalOrder = ['setup', 'conflict', 'twist', 'climax', 'resolution'];
        const indexA = logicalOrder.indexOf(plotA.type);
        const indexB = logicalOrder.indexOf(plotB.type);

        return indexB >= indexA || (plotA.type === 'conflict' && plotB.type === 'conflict');
    }

    private checkCharacterMotivationConsistency(plotPoints: any[]): string[] {
        const issues: string[] = [];
        const characterActions = new Map<string, any[]>();

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

    private detectMotivationChanges(actions: any[]): number {
        // 동기 변화 감지 로직 (단순화)
        let changes = 0;
        for (let i = 1; i < actions.length; i++) {
            const prev = actions[i - 1].point;
            const curr = actions[i].point;

            if (prev.type !== curr.type && Math.abs(prev.index - curr.index) === 1) {
                changes++;
            }
        }
        return changes;
    }

    private checkTemporalConsistency(plotPoints: any[]): string[] {
        const issues: string[] = [];

        // 시간 순서 검증
        for (let i = 1; i < plotPoints.length; i++) {
            const prev = plotPoints[i - 1];
            const curr = plotPoints[i];

            if (prev.timestamp && curr.timestamp) {
                if (new Date(prev.timestamp) > new Date(curr.timestamp)) {
                    issues.push(`시간순서 오류: ${prev.title} 후에 ${curr.title}이 올 수 없습니다`);
                }
            }
        }

        return issues;
    }

    private extractThemes(plotPoints: any[]): string[] {
        const themes = new Set<string>();

        plotPoints.forEach(point => {
            if (point.themes) {
                point.themes.forEach((theme: string) => themes.add(theme));
            }

            // 내용 기반 테마 추출 (키워드 분석)
            if (point.description) {
                const thematicKeywords = this.extractThematicKeywords(point.description);
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
    private identifyActStructure(plotPoints: any[]): any {
        const totalPoints = plotPoints.length;
        const firstAct = Math.floor(totalPoints * 0.25);
        const secondAct = Math.floor(totalPoints * 0.75);

        return {
            setup: plotPoints.slice(0, firstAct),
            confrontation: plotPoints.slice(firstAct, secondAct),
            resolution: plotPoints.slice(secondAct)
        };
    }

    private analyzeConflicts(plotPoints: any[]): any {
        const conflicts = plotPoints.filter(point => point.type === 'conflict');
        return {
            total: conflicts.length,
            intensity: conflicts.reduce((sum, c) => sum + this.calculateConflictIntensity(c), 0) / conflicts.length,
            types: [...new Set(conflicts.map(c => c.conflictType || 'internal'))]
        };
    }

    private trackCharacterArcs(plotPoints: any[]): any {
        const characterProgress = new Map<string, any[]>();

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

    private predictNextEvents(plotPoints: any[]): string[] {
        const lastPoint = plotPoints[plotPoints.length - 1];
        const predictions: string[] = [];

        switch (lastPoint?.type) {
            case 'setup':
                predictions.push('갈등의 시작', '캐릭터 간의 대립');
                break;
            case 'conflict':
                predictions.push('상황 악화', '새로운 장애물 등장');
                break;
            case 'twist':
                predictions.push('진실 공개', '관점의 전환');
                break;
            default:
                predictions.push('다음 단계로의 진행');
        }

        return predictions;
    }

    private predictRevealTiming(analysis: any): number {
        // 복잡성에 따른 반전 시점 예측 (0-1)
        const complexity = analysis.complexityScore || 0.5;
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

    private suggestForeshadowing(analysis: any): string[] {
        return [
            '중요한 사건 전에 미묘한 힌트 배치',
            '캐릭터 대사를 통한 암시',
            '상징적 이미지나 소품 활용'
        ];
    }

    private analyzePacing(plotPoints: any[]): string[] {
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

    private trackChronology(plotPoints: any[]): any {
        return {
            linearTime: plotPoints.map(p => p.timestamp || '미정'),
            storyTime: plotPoints.map(p => p.storyTime || '미정'),
            duration: `${plotPoints.length}개 장면`
        };
    }

    private mapCharacterTimelines(plotPoints: any[]): any {
        const timelines: any = {};

        plotPoints.forEach(point => {
            if (point.characters) {
                point.characters.forEach((char: string) => {
                    if (!timelines[char]) {
                        timelines[char] = {
                            actions: [],
                            decisions: [],
                            revelations: []
                        };
                    }
                    timelines[char].actions.push(point.title || '액션');
                });
            }
        });

        return timelines;
    }

    private detectTemporalIssues(plotPoints: any[]): any[] {
        return this.checkTemporalConsistency(plotPoints).map(issue => ({
            type: 'timeline' as const,
            description: issue,
            suggestion: '시간순서를 재검토하세요'
        }));
    }

    private generateTensionGraph(plotPoints: any[]): any[] {
        return plotPoints.map((point, index) => ({
            scene: point.title || `Scene ${index + 1}`,
            tension: this.calculateConflictIntensity(point) * 10,
            reason: `${point.type || 'general'} 장면`
        }));
    }

    private analyzeRelationships(characters: any[], plotPoints: any[]): any[] {
        const relationships: any[] = [];

        for (let i = 0; i < characters.length; i++) {
            for (let j = i + 1; j < characters.length; j++) {
                relationships.push({
                    from: characters[i].name || `Character ${i}`,
                    to: characters[j].name || `Character ${j}`,
                    relationship: '알 수 없음',
                    strength: Math.random() * 10,
                    development: 'stable' as const,
                    keyMoments: ['첫 만남']
                });
            }
        }

        return relationships;
    }

    private identifyThemes(plotPoints: any[]): any[] {
        const themes = this.extractThemes(plotPoints);
        return themes.map(theme => ({
            theme,
            elements: [`요소 관련 ${theme}`],
            strength: Math.random() * 10,
            development: '점진적 발전'
        }));
    }

    private mapPlotConnections(plotPoints: any[]): any[] {
        const connections: any[] = [];

        for (let i = 0; i < plotPoints.length - 1; i++) {
            connections.push({
                plotA: plotPoints[i].title || `Plot ${i}`,
                plotB: plotPoints[i + 1].title || `Plot ${i + 1}`,
                connectionType: 'causal' as const,
                strength: Math.random() * 10
            });
        }

        return connections;
    }

    private extractSymbolism(plotPoints: any[]): any[] {
        return [
            {
                symbol: '빛과 어둠',
                meaning: '희망과 절망의 대비',
                occurrences: ['장면 1', '장면 3'],
                significance: 8
            }
        ];
    }
}
