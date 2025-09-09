module.exports = {

"[project]/src/shared/narrative/ncpAnalyzer.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 Narrative Context Protocol (NCP) 기반 독자 반응 예측 시스템
// USC Entertainment Technology Center와 Narrative First 협력으로 개발된 표준
__turbopack_context__.s({
    "NCPStoryAnalyzer": (()=>NCPStoryAnalyzer)
});
class NCPStoryAnalyzer {
    ncpStructure;
    constructor(structure){
        this.ncpStructure = structure;
    }
    // 🔥 독자 반응 예측 (AutoCrit 알고리즘 기반)
    predictReaderEngagement(plotPoints) {
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
    analyzeTimeline(plotPoints) {
        return {
            chronology: this.trackChronology(plotPoints),
            characterTimelines: this.mapCharacterTimelines(plotPoints),
            temporalInconsistencies: this.detectTemporalIssues(plotPoints),
            tensionGraph: this.generateTensionGraph(plotPoints)
        };
    }
    // 🔥 마인드맵 분석 (관계 및 테마 중심)
    analyzeMindmap(plotPoints, characters) {
        return {
            characterRelationships: this.analyzeRelationships(characters, plotPoints),
            thematicConnections: this.identifyThemes(plotPoints),
            plotConnections: this.mapPlotConnections(plotPoints),
            symbolism: this.extractSymbolism(plotPoints)
        };
    }
    // 🔥 내부 분석 메서드들
    analyzeNarrativeStructure(plotPoints) {
        // NCP 기반 구조 분석
        const structure = {
            acts: this.identifyActStructure(plotPoints),
            conflicts: this.analyzeConflicts(plotPoints),
            arcs: this.trackCharacterArcs(plotPoints),
            themes: this.extractThemes(plotPoints)
        };
        return structure;
    }
    calculatePredictability(analysis) {
        // NCP의 갈등 방법론과 역학 시스템을 기반으로 예측성 계산
        const conflictComplexity = this.evaluateConflictComplexity();
        const foreshadowingRatio = this.calculateForeshadowingRatio(analysis);
        if (foreshadowingRatio > 0.8 && conflictComplexity < 0.3) return 'predictable';
        if (foreshadowingRatio > 0.5 && conflictComplexity > 0.5) return 'foreshadowed';
        if (conflictComplexity > 0.8) return 'shocking';
        return 'surprising';
    }
    calculateEngagementScore(analysis) {
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
    generateTensionCurve(plotPoints) {
        return plotPoints.map((plot, index)=>{
            // 각 플롯 포인트의 긴장감을 1-10으로 계산
            const baseProgress = (index + 1) / plotPoints.length;
            const conflictIntensity = this.calculateConflictIntensity(plot);
            const proximityToClimax = this.calculateClimaxProximity(index, plotPoints.length);
            return Math.round((conflictIntensity * 0.4 + proximityToClimax * 0.6) * 10);
        });
    }
    detectPlotHoles(plotPoints) {
        const holes = [];
        // 인과관계 체크
        for(let i = 1; i < plotPoints.length; i++){
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
    evaluateConflictComplexity() {
        // NCP의 갈등 방법론을 기반으로 복잡성 평가
        const methods = this.ncpStructure.conflictMethods;
        let complexity = 0;
        // 갈등 영역이 심리적일수록 복잡성 증가
        if (methods.universe === 'psychology') complexity += 0.4;
        if (methods.universe === 'mind') complexity += 0.3;
        return Math.min(complexity, 1);
    }
    calculateForeshadowingRatio(analysis) {
        // 복선 비율 계산 (0-1)
        return Math.random() * 0.8 + 0.1; // 임시 구현
    }
    evaluateConflictClarity() {
        // 갈등의 명확성 평가 (0-1)
        return 0.8; // 임시 구현
    }
    evaluateCharacterArcCompleteness() {
        // 캐릭터 아크 완성도 평가 (0-1)
        return 0.7; // 임시 구현
    }
    evaluateThematicConsistency() {
        // 테마 일관성 평가 (0-1)
        return 0.75; // 임시 구현
    }
    evaluatePacing(analysis) {
        // 페이싱 적절성 평가 (0-1)
        return 0.8; // 임시 구현
    }
    calculateConflictIntensity(plot) {
        // 개별 플롯의 갈등 강도 계산 (0-1)
        if (plot.type === 'climax') return 1;
        if (plot.type === 'conflict') return 0.8;
        if (plot.type === 'twist') return 0.9;
        if (plot.type === 'resolution') return 0.3;
        return 0.5; // setup
    }
    calculateClimaxProximity(index, total) {
        // 클라이맥스 근접도 계산 (0-1)
        const progress = index / (total - 1);
        // 일반적으로 75% 지점이 클라이맥스
        const climaxPoint = 0.75;
        return 1 - Math.abs(progress - climaxPoint);
    }
    // ... 기타 보조 메서드들은 실제 구현에서 완성
    calculateEmotionalResonance(analysis) {
        // 감정적 공명도 계산 (0-100)
        return Math.round(Math.random() * 40 + 60); // 임시 구현
    }
    evaluateCharacterArc() {
        // 캐릭터 아크 만족도 평가 (0-100)
        return Math.round(Math.random() * 30 + 70); // 임시 구현
    }
    identifyActStructure(plotPoints) {
        return {};
    }
    analyzeConflicts(plotPoints) {
        return {};
    }
    trackCharacterArcs(plotPoints) {
        return {};
    }
    extractThemes(plotPoints) {
        return {};
    }
    validateCausality(plotA, plotB) {
        return true;
    }
    checkCharacterMotivationConsistency(plotPoints) {
        return [];
    }
    checkTemporalConsistency(plotPoints) {
        return [];
    }
    predictNextEvents(plotPoints) {
        return [];
    }
    predictRevealTiming(analysis) {
        return 0;
    }
    predictCharacterFates() {
        return [];
    }
    analyzeThemeClarity() {
        return "";
    }
    suggestForeshadowing(analysis) {
        return [];
    }
    analyzePacing(plotPoints) {
        return [];
    }
    suggestCharacterDevelopment() {
        return [];
    }
    strengthenThemes() {
        return [];
    }
    trackChronology(plotPoints) {
        return {};
    }
    mapCharacterTimelines(plotPoints) {
        return {};
    }
    detectTemporalIssues(plotPoints) {
        return [];
    }
    generateTensionGraph(plotPoints) {
        return [];
    }
    analyzeRelationships(characters, plotPoints) {
        return [];
    }
    identifyThemes(plotPoints) {
        return [];
    }
    mapPlotConnections(plotPoints) {
        return [];
    }
    extractSymbolism(plotPoints) {
        return [];
    }
}
}}),

};

//# sourceMappingURL=src_shared_narrative_ncpAnalyzer_ts_a54a022e._.js.map