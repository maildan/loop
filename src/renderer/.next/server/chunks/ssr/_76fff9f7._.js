module.exports = {

"[project]/src/shared/ai/geminiClient.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 Gemini AI API 클라이언트 - Google AI SDK 사용
__turbopack_context__.s({
    "GeminiClient": (()=>GeminiClient),
    "GeminiError": (()=>GeminiError),
    "analyzeStory": (()=>analyzeStory),
    "generateText": (()=>generateText),
    "getGeminiClient": (()=>getGeminiClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
;
;
class GeminiClient {
    genAI;
    model;
    config;
    constructor(config){
        this.config = {
            model: 'gemini-1.5-flash',
            maxTokens: 4096,
            temperature: 0.7,
            ...config
        };
        try {
            this.genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](this.config.apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: this.config.model || 'gemini-1.5-flash',
                generationConfig: {
                    maxOutputTokens: this.config.maxTokens,
                    temperature: this.config.temperature
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('GEMINI_CLIENT', `Initialized with model: ${this.config.model}`);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('GEMINI_CLIENT', 'Failed to initialize', error);
            throw new GeminiError('INITIALIZATION_ERROR', 'Failed to initialize Gemini client', error, false);
        }
    }
    async generateText(request) {
        const startTime = Date.now();
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('GEMINI_CLIENT', 'Generating text', {
                promptLength: request.prompt.length,
                hasContext: !!request.context
            });
            // 프롬프트 구성
            let fullPrompt = '';
            if (request.systemPrompt) {
                fullPrompt += `${request.systemPrompt}\n\n`;
            }
            if (request.context) {
                fullPrompt += `Context: ${request.context}\n\n`;
            }
            fullPrompt += request.prompt;
            // API 호출
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            const content = response.text();
            const finishReason = this.mapFinishReason(response.candidates?.[0]?.finishReason);
            // 사용량 정보 추출 (available in some responses)
            const usage = response.usageMetadata ? {
                promptTokens: response.usageMetadata.promptTokenCount || 0,
                completionTokens: response.usageMetadata.candidatesTokenCount || 0,
                totalTokens: response.usageMetadata.totalTokenCount || 0
            } : undefined;
            const geminiResponse = {
                content,
                usage,
                finishReason,
                metadata: {
                    model: this.config.model || 'gemini-1.5-flash',
                    timestamp: new Date().toISOString(),
                    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                }
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('GEMINI_CLIENT', 'Text generation completed', {
                duration: Date.now() - startTime,
                contentLength: content.length,
                finishReason,
                tokensUsed: usage?.totalTokens || 0
            });
            return geminiResponse;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('GEMINI_CLIENT', 'Text generation failed', {
                error: error.message,
                duration: Date.now() - startTime
            });
            // 오류 타입에 따른 분류
            if (error.message?.includes('API key')) {
                throw new GeminiError('INVALID_API_KEY', 'Invalid or missing API key', error, false);
            } else if (error.message?.includes('quota')) {
                throw new GeminiError('QUOTA_EXCEEDED', 'API quota exceeded', error, true);
            } else if (error.message?.includes('safety')) {
                throw new GeminiError('SAFETY_FILTER', 'Content blocked by safety filters', error, false);
            } else {
                throw new GeminiError('GENERATION_ERROR', `Text generation failed: ${error.message}`, error, true);
            }
        }
    }
    // 🎯 스토리 분석 전용 메서드들
    async analyzeStoryStructure(storyContent, analysisType = 'comprehensive') {
        const systemPrompt = `당신은 전문 서사 구조 분석가입니다. 
다음 스토리를 분석하여 구조적 완성도, 캐릭터 개발, 플롯 일관성, 테마 전달 등을 평가해주세요.
분석 결과는 명확하고 건설적인 피드백 형태로 제공해주세요.`;
        const analysisPrompt = `
[분석 유형: ${analysisType}]

다음 스토리를 전문적으로 분석해주세요:

${storyContent}

분석 항목:
1. 서사 구조 (3막 구조, 플롯 포인트)
2. 캐릭터 개발 (주인공의 성장 아크)
3. 테마와 메시지 전달
4. 대화와 서술의 균형
5. 독자 몰입도
6. 개선 제안사항

각 항목에 대해 점수(1-10)와 상세 분석을 제공해주세요.
        `;
        return this.generateText({
            prompt: analysisPrompt,
            systemPrompt,
            temperature: 0.3 // 분석은 일관성이 중요
        });
    }
    async generateStoryIdeas(genre, themes, wordCount = 500) {
        const systemPrompt = `당신은 창의적인 스토리텔링 전문가입니다. 
주어진 장르와 테마를 바탕으로 독창적이고 매력적인 스토리 아이디어를 생성해주세요.`;
        const ideaPrompt = `
장르: ${genre}
테마: ${themes.join(', ')}
목표 단어 수: ${wordCount}단어

다음을 포함한 스토리 아이디어를 생성해주세요:
1. 핵심 컨셉 (후크)
2. 주인공과 동기
3. 주요 갈등
4. 스토리 아크 개요
5. 독특한 설정이나 트위스트

창의적이고 실행 가능한 아이디어를 제공해주세요.
        `;
        return this.generateText({
            prompt: ideaPrompt,
            systemPrompt,
            temperature: 0.8 // 창의성을 위해 높은 온도
        });
    }
    async improveDialogue(dialogue, characterContext) {
        const systemPrompt = `당신은 대화 개선 전문가입니다. 
자연스럽고 캐릭터의 성격이 드러나는 대화로 개선해주세요.`;
        const dialoguePrompt = `
캐릭터 컨텍스트: ${characterContext}

개선할 대화:
${dialogue}

다음 관점에서 대화를 개선해주세요:
1. 자연스러운 말투
2. 캐릭터 개성 반영
3. 갈등과 긴장감 조성
4. 불필요한 설명 제거
5. 서브텍스트 활용

개선된 대화와 함께 변경 사유를 설명해주세요.
        `;
        return this.generateText({
            prompt: dialoguePrompt,
            systemPrompt,
            temperature: 0.5
        });
    }
    // 📊 사용량 및 상태 확인
    async checkStatus() {
        try {
            // 간단한 테스트 요청
            const testResult = await this.generateText({
                prompt: "Hello, are you working?",
                maxTokens: 10,
                temperature: 0.1
            });
            return {
                status: 'healthy',
                model: this.config.model || 'gemini-1.5-flash',
                available: true
            };
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('GEMINI_CLIENT', 'Status check failed', error);
            return {
                status: 'error',
                model: this.config.model || 'gemini-1.5-flash',
                available: false
            };
        }
    }
    // 🔧 헬퍼 메서드들
    mapFinishReason(reason) {
        switch(reason){
            case 'STOP':
                return 'stop';
            case 'MAX_TOKENS':
                return 'length';
            case 'SAFETY':
                return 'content_filter';
            case 'RECITATION':
                return 'content_filter';
            default:
                return 'other';
        }
    }
    // 설정 업데이트
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        if (newConfig.model) {
            this.model = this.genAI.getGenerativeModel({
                model: newConfig.model,
                generationConfig: {
                    maxOutputTokens: this.config.maxTokens,
                    temperature: this.config.temperature
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('GEMINI_CLIENT', `Model updated to: ${newConfig.model}`);
        }
    }
}
class GeminiError extends Error {
    code;
    details;
    retryable;
    constructor(code, message, details, retryable = false){
        super(message);
        this.name = 'GeminiError';
        this.code = code;
        this.details = details;
        this.retryable = retryable;
    }
}
// 🔥 싱글톤 인스턴스 관리
let geminiClient = null;
function getGeminiClient() {
    if (!geminiClient) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new GeminiError('MISSING_API_KEY', 'GEMINI_API_KEY environment variable is required', null, false);
        }
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        geminiClient = new GeminiClient({
            apiKey,
            model,
            maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '4096'),
            temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7')
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('GEMINI_CLIENT', 'Singleton instance created');
    }
    return geminiClient;
}
async function generateText(prompt, context) {
    const client = getGeminiClient();
    const response = await client.generateText({
        prompt,
        context
    });
    return response.content;
}
async function analyzeStory(content, type = 'comprehensive') {
    const client = getGeminiClient();
    const response = await client.analyzeStoryStructure(content, type);
    return response.content;
}
}}),
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
            themes: this.extractThemes(plotPoints),
            totalPoints: plotPoints.length,
            complexityScore: this.calculateComplexityScore(plotPoints)
        };
        return structure;
    }
    calculateComplexityScore(plotPoints) {
        // 플롯의 복잡성을 0-1 사이로 계산
        const characterCount = this.extractUniqueCharacters(plotPoints).length;
        const plotlineCount = this.identifyPlotlines(plotPoints).length;
        const themeCount = this.extractThemes(plotPoints).length || 1;
        return Math.min(1, (characterCount * 0.1 + plotlineCount * 0.2 + themeCount * 0.1) / 2);
    }
    extractUniqueCharacters(plotPoints) {
        const characters = new Set();
        plotPoints.forEach((point)=>{
            if (point.characters) {
                point.characters.forEach((char)=>characters.add(char));
            }
        });
        return Array.from(characters);
    }
    identifyPlotlines(plotPoints) {
        const plotlines = new Set();
        plotPoints.forEach((point)=>{
            if (point.plotline) plotlines.add(point.plotline);
        });
        return Array.from(plotlines);
    }
    calculatePredictability(analysis) {
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
    calculateForeshadowingRatio(analysis) {
        // 복선의 적절성을 0-1로 계산
        const totalPoints = analysis.totalPoints || 1;
        const foreshadowedEvents = Math.floor(totalPoints * 0.3); // 30% 정도가 복선
        return Math.min(1, foreshadowedEvents / totalPoints);
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
        if (methods.universe === 'biology') complexity += 0.2;
        if (methods.universe === 'physics') complexity += 0.1;
        return Math.min(complexity, 1);
    }
    evaluateConflictClarity() {
        // 갈등의 명확성 평가 (0-1)
        const methods = this.ncpStructure.conflictMethods;
        let clarity = 0.5;
        // 명확한 갈등 영역일수록 점수 증가
        if (methods.concern && methods.issue) clarity += 0.3;
        if (methods.domain) clarity += 0.2;
        return Math.min(clarity, 1);
    }
    evaluateCharacterArcCompleteness() {
        // 캐릭터 아크 완성도 평가 (0-1)
        const mainChar = this.ncpStructure.mainCharacter;
        let completeness = 0;
        if (mainChar.motivation) completeness += 0.25;
        if (mainChar.methodology) completeness += 0.25;
        if (mainChar.evaluation) completeness += 0.25;
        if (mainChar.purpose) completeness += 0.25;
        return completeness;
    }
    evaluateThematicConsistency() {
        // 테마 일관성 평가 (0-1)
        const vectors = this.ncpStructure.vectors;
        let consistency = 0;
        if (vectors.goal && vectors.consequence) consistency += 0.3;
        if (vectors.cost && vectors.dividend) consistency += 0.3;
        if (vectors.requirement && vectors.prerequisite) consistency += 0.2;
        if (vectors.precondition && vectors.forewarning) consistency += 0.2;
        return consistency;
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
    // 🔥 실제 구현된 분석 메서드들
    validateCausality(plotA, plotB) {
        // 간단한 인과관계 검증 로직
        if (!plotA?.type || !plotB?.type) return false;
        // 논리적 순서 검증
        const logicalOrder = [
            'setup',
            'conflict',
            'twist',
            'climax',
            'resolution'
        ];
        const indexA = logicalOrder.indexOf(plotA.type);
        const indexB = logicalOrder.indexOf(plotB.type);
        return indexB >= indexA || plotA.type === 'conflict' && plotB.type === 'conflict';
    }
    checkCharacterMotivationConsistency(plotPoints) {
        const issues = [];
        const characterActions = new Map();
        // 캐릭터별 행동 추적
        plotPoints.forEach((point, index)=>{
            if (point.characters) {
                point.characters.forEach((char)=>{
                    if (!characterActions.has(char)) {
                        characterActions.set(char, []);
                    }
                    characterActions.get(char)?.push({
                        point,
                        index
                    });
                });
            }
        });
        // 동기 일관성 검증
        characterActions.forEach((actions, character)=>{
            if (actions.length > 2) {
                const motivationChanges = this.detectMotivationChanges(actions);
                if (motivationChanges > actions.length * 0.5) {
                    issues.push(`${character}의 동기가 너무 자주 변합니다`);
                }
            }
        });
        return issues;
    }
    detectMotivationChanges(actions) {
        // 동기 변화 감지 로직 (단순화)
        let changes = 0;
        for(let i = 1; i < actions.length; i++){
            const prev = actions[i - 1].point;
            const curr = actions[i].point;
            if (prev.type !== curr.type && Math.abs(prev.index - curr.index) === 1) {
                changes++;
            }
        }
        return changes;
    }
    checkTemporalConsistency(plotPoints) {
        const issues = [];
        // 시간 순서 검증
        for(let i = 1; i < plotPoints.length; i++){
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
    extractThemes(plotPoints) {
        const themes = new Set();
        plotPoints.forEach((point)=>{
            if (point.themes) {
                point.themes.forEach((theme)=>themes.add(theme));
            }
            // 내용 기반 테마 추출 (키워드 분석)
            if (point.description) {
                const thematicKeywords = this.extractThematicKeywords(point.description);
                thematicKeywords.forEach((keyword)=>themes.add(keyword));
            }
        });
        return Array.from(themes);
    }
    extractThematicKeywords(description) {
        const thematicWords = [
            '사랑',
            '복수',
            '성장',
            '자유',
            '정의',
            '가족',
            '우정',
            '용기',
            '희생'
        ];
        const keywords = [];
        thematicWords.forEach((word)=>{
            if (description.includes(word)) {
                keywords.push(word);
            }
        });
        return keywords;
    }
    // 🔥 남은 분석 메서드들 구현
    identifyActStructure(plotPoints) {
        const totalPoints = plotPoints.length;
        const firstAct = Math.floor(totalPoints * 0.25);
        const secondAct = Math.floor(totalPoints * 0.75);
        return {
            setup: plotPoints.slice(0, firstAct),
            confrontation: plotPoints.slice(firstAct, secondAct),
            resolution: plotPoints.slice(secondAct)
        };
    }
    analyzeConflicts(plotPoints) {
        const conflicts = plotPoints.filter((point)=>point.type === 'conflict');
        return {
            total: conflicts.length,
            intensity: conflicts.reduce((sum, c)=>sum + this.calculateConflictIntensity(c), 0) / conflicts.length,
            types: [
                ...new Set(conflicts.map((c)=>c.conflictType || 'internal'))
            ]
        };
    }
    trackCharacterArcs(plotPoints) {
        const characterProgress = new Map();
        plotPoints.forEach((point)=>{
            if (point.characters) {
                point.characters.forEach((char)=>{
                    if (!characterProgress.has(char)) {
                        characterProgress.set(char, []);
                    }
                    characterProgress.get(char)?.push(point);
                });
            }
        });
        return Object.fromEntries(characterProgress);
    }
    predictNextEvents(plotPoints) {
        const lastPoint = plotPoints[plotPoints.length - 1];
        const predictions = [];
        switch(lastPoint?.type){
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
    predictRevealTiming(analysis) {
        // 복잡성에 따른 반전 시점 예측 (0-1)
        const complexity = analysis.complexityScore || 0.5;
        return 0.6 + complexity * 0.3; // 60-90% 지점
    }
    predictCharacterFates() {
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
    analyzeThemeClarity() {
        const vectors = this.ncpStructure.vectors;
        if (vectors.goal && vectors.consequence) {
            return '테마가 명확하게 드러납니다';
        }
        return '테마가 더 명확하게 표현될 필요가 있습니다';
    }
    suggestForeshadowing(analysis) {
        return [
            '중요한 사건 전에 미묘한 힌트 배치',
            '캐릭터 대사를 통한 암시',
            '상징적 이미지나 소품 활용'
        ];
    }
    analyzePacing(plotPoints) {
        const suggestions = [];
        let tensionLevels = plotPoints.map((p)=>this.calculateConflictIntensity(p));
        // 연속된 고긴장 구간 체크
        let highCount = 0;
        tensionLevels.forEach((level)=>{
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
    suggestCharacterDevelopment() {
        return [
            '캐릭터의 내적 갈등 심화',
            '가치관 변화 과정 명확화',
            '관계 발전을 통한 성장 표현'
        ];
    }
    strengthenThemes() {
        return [
            '핵심 테마를 여러 플롯라인으로 반복',
            '캐릭터 선택을 통한 테마 구현',
            '상징과 은유를 활용한 테마 강화'
        ];
    }
    trackChronology(plotPoints) {
        return {
            linearTime: plotPoints.map((p)=>p.timestamp || '미정'),
            storyTime: plotPoints.map((p)=>p.storyTime || '미정'),
            duration: `${plotPoints.length}개 장면`
        };
    }
    mapCharacterTimelines(plotPoints) {
        const timelines = {};
        plotPoints.forEach((point)=>{
            if (point.characters) {
                point.characters.forEach((char)=>{
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
    detectTemporalIssues(plotPoints) {
        return this.checkTemporalConsistency(plotPoints).map((issue)=>({
                type: 'timeline',
                description: issue,
                suggestion: '시간순서를 재검토하세요'
            }));
    }
    generateTensionGraph(plotPoints) {
        return plotPoints.map((point, index)=>({
                scene: point.title || `Scene ${index + 1}`,
                tension: this.calculateConflictIntensity(point) * 10,
                reason: `${point.type || 'general'} 장면`
            }));
    }
    analyzeRelationships(characters, plotPoints) {
        const relationships = [];
        for(let i = 0; i < characters.length; i++){
            for(let j = i + 1; j < characters.length; j++){
                relationships.push({
                    from: characters[i].name || `Character ${i}`,
                    to: characters[j].name || `Character ${j}`,
                    relationship: '알 수 없음',
                    strength: Math.random() * 10,
                    development: 'stable',
                    keyMoments: [
                        '첫 만남'
                    ]
                });
            }
        }
        return relationships;
    }
    identifyThemes(plotPoints) {
        const themes = this.extractThemes(plotPoints);
        return themes.map((theme)=>({
                theme,
                elements: [
                    `요소 관련 ${theme}`
                ],
                strength: Math.random() * 10,
                development: '점진적 발전'
            }));
    }
    mapPlotConnections(plotPoints) {
        const connections = [];
        for(let i = 0; i < plotPoints.length - 1; i++){
            connections.push({
                plotA: plotPoints[i].title || `Plot ${i}`,
                plotB: plotPoints[i + 1].title || `Plot ${i + 1}`,
                connectionType: 'causal',
                strength: Math.random() * 10
            });
        }
        return connections;
    }
    extractSymbolism(plotPoints) {
        return [
            {
                symbol: '빛과 어둠',
                meaning: '희망과 절망의 대비',
                occurrences: [
                    '장면 1',
                    '장면 3'
                ],
                significance: 8
            }
        ];
    }
}
}}),
"[project]/src/shared/narrative/aiEnhancedAnalyzer.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 AI-Enhanced NCP Story Analyzer - Gemini 연동
__turbopack_context__.s({
    "AIEnhancedNCPAnalyzer": (()=>AIEnhancedNCPAnalyzer),
    "performAIStoryAnalysis": (()=>performAIStoryAnalysis)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$narrative$2f$ncpAnalyzer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/narrative/ncpAnalyzer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ai$2f$geminiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/ai/geminiClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
;
;
;
class AIEnhancedNCPAnalyzer extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$narrative$2f$ncpAnalyzer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NCPStoryAnalyzer"] {
    geminiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ai$2f$geminiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeminiClient"])();
    constructor(structure){
        super(structure);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_NCP_ANALYZER', 'Initialized with AI enhancement');
    }
    // 🔥 종합 AI 분석 - 모든 분석을 통합하여 수행
    async performComprehensiveAnalysis(content, characters, plotPoints, additionalContext) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_NCP_ANALYZER', 'Starting comprehensive analysis', {
            contentLength: content.length,
            characterCount: characters.length,
            plotPointCount: plotPoints.length
        });
        try {
            // 1. 기존 NCP 분석 수행
            const ncpAnalysis = {
                readerEngagement: this.predictReaderEngagement(plotPoints),
                timeline: this.analyzeTimeline(plotPoints),
                mindmap: this.analyzeMindmap(plotPoints, characters)
            };
            // 2. AI 강화 분석 수행 (병렬 처리)
            const [synopsisAnalysis, characterAnalysis, plotAnalysis, themeAnalysis] = await Promise.all([
                this.performSynopsisAnalysis(content, additionalContext),
                this.performCharacterAnalysis(characters, content),
                this.performPlotAnalysis(plotPoints, content),
                this.performThemeAnalysis(content, plotPoints)
            ]);
            // 3. 통합 평가 계산
            const overallAssessment = this.calculateOverallAssessment({
                synopsis: synopsisAnalysis,
                characters: characterAnalysis,
                plot: plotAnalysis,
                themes: themeAnalysis,
                ncpEngagement: ncpAnalysis.readerEngagement
            });
            const result = {
                ncpAnalysis,
                aiAnalysis: {
                    synopsis: synopsisAnalysis,
                    characters: characterAnalysis,
                    plot: plotAnalysis,
                    themes: themeAnalysis
                },
                overallAssessment
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_NCP_ANALYZER', 'Comprehensive analysis completed', {
                overallScore: overallAssessment.totalScore,
                grade: overallAssessment.grade,
                duration: 'calculated'
            });
            return result;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_NCP_ANALYZER', 'Comprehensive analysis failed', error);
            throw error;
        }
    }
    // 🔥 시놉시스 분석
    async performSynopsisAnalysis(content, context) {
        const prompt = `
다음은 소설의 시놉시스입니다. 전문 편집자의 관점에서 종합적으로 분석해주세요.

${context ? `[추가 컨텍스트]\n${context}\n\n` : ''}

[시놉시스]
${content}

다음 형식으로 분석해주세요:
1. 전체적인 완성도 평가 (0-100점)
2. 주요 강점 3-5가지
3. 개선이 필요한 약점 3-5가지
4. 구체적인 개선 제안 5-7가지
5. 독자 타겟팅과 시장성 분석
6. 출간 준비도 평가
        `;
        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'synopsis');
        // AI 응답을 파싱하여 구조화된 데이터 생성
        const analysisData = this.parseSynopsisAnalysis(aiResponse.content);
        return {
            overall: aiResponse,
            strengths: analysisData.strengths,
            weaknesses: analysisData.weaknesses,
            score: analysisData.score,
            recommendations: analysisData.recommendations
        };
    }
    // 🔥 캐릭터 분석
    async performCharacterAnalysis(characters, content) {
        const characterData = characters.map((char)=>({
                name: char.name || char.title,
                role: char.role || 'unknown',
                description: char.description || char.content,
                background: char.background,
                goals: char.goals
            }));
        const prompt = `
다음은 소설의 등장인물 정보와 스토리 내용입니다. 캐릭터 개발 전문가로서 분석해주세요.

[등장인물 정보]
${JSON.stringify(characterData, null, 2)}

[스토리 내용]
${content.slice(0, 2000)}...

분석 요청사항:
1. 각 캐릭터의 동기와 목표 명확성 (0-100점)
2. 캐릭터 아크의 완성도 평가
3. 캐릭터 간 관계의 깊이와 발전성
4. 캐릭터 일관성과 현실감
5. 캐릭터 발전을 위한 구체적 제안
        `;
        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'character');
        const analysisData = this.parseCharacterAnalysis(aiResponse.content);
        return {
            analysis: aiResponse,
            arcCompleteness: analysisData.arcCompleteness,
            relationshipDepth: analysisData.relationshipDepth,
            developmentSuggestions: analysisData.developmentSuggestions
        };
    }
    // 🔥 플롯 분석
    async performPlotAnalysis(plotPoints, content) {
        const plotData = plotPoints.map((point)=>({
                title: point.title,
                type: point.type,
                description: point.description,
                order: point.order || point.sortOrder
            }));
        const prompt = `
다음은 소설의 플롯 구조와 내용입니다. 플롯 구조 전문가로서 분석해주세요.

[플롯 구조]
${JSON.stringify(plotData, null, 2)}

[스토리 내용]
${content.slice(0, 3000)}...

분석 요청사항:
1. 플롯의 논리적 일관성 (0-100점)
2. 3막 구조의 균형성 평가
3. 페이싱과 긴장감 곡선 분석
4. 클라이맥스의 효과성
5. 발견된 플롯홀과 논리적 오류
6. 구조 개선을 위한 제안
        `;
        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'plot');
        const analysisData = this.parsePlotAnalysis(aiResponse.content);
        return {
            analysis: aiResponse,
            coherenceScore: analysisData.coherenceScore,
            pacingScore: analysisData.pacingScore,
            climaxEffectiveness: analysisData.climaxEffectiveness,
            plotHoles: analysisData.plotHoles,
            structuralSuggestions: analysisData.structuralSuggestions
        };
    }
    // 🔥 테마 분석
    async performThemeAnalysis(content, plotPoints) {
        const prompt = `
다음 소설 내용의 테마를 분석해주세요. 테마 분석 전문가로서 깊이 있게 평가해주세요.

[스토리 내용]
${content.slice(0, 3000)}...

[주요 플롯 포인트]
${plotPoints.map((p)=>`- ${p.title}: ${p.description || ''}`).join('\n')}

분석 요청사항:
1. 핵심 테마 식별 및 명확성 평가 (0-100점)
2. 테마의 일관된 표현 정도
3. 독자에게 미치는 감정적 공명도
4. 서브테마와의 조화
5. 테마 강화를 위한 제안
        `;
        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'theme');
        const analysisData = this.parseThemeAnalysis(aiResponse.content);
        return {
            analysis: aiResponse,
            clarity: analysisData.clarity,
            consistency: analysisData.consistency,
            resonance: analysisData.resonance,
            themesSuggestions: analysisData.suggestions
        };
    }
    // 🔥 통합 평가 계산
    calculateOverallAssessment(analysisResults) {
        // 가중치가 적용된 점수 계산
        const weights = {
            synopsis: 0.3,
            characters: 0.25,
            plot: 0.25,
            themes: 0.2
        };
        const totalScore = Math.round(analysisResults.synopsis.score * weights.synopsis + analysisResults.characters.arcCompleteness * weights.characters + analysisResults.plot.coherenceScore * weights.plot + analysisResults.themes.clarity * weights.themes);
        const grade = this.calculateGrade(totalScore);
        const readyForPublication = totalScore >= 80 && grade !== 'F';
        const criticalIssues = [
            ...analysisResults.synopsis.weaknesses.slice(0, 2),
            ...analysisResults.plot.plotHoles.slice(0, 2)
        ].filter((issue)=>issue.length > 0);
        const nextSteps = [
            ...analysisResults.synopsis.recommendations.slice(0, 3),
            ...analysisResults.characters.developmentSuggestions.slice(0, 2),
            ...analysisResults.plot.structuralSuggestions.slice(0, 2)
        ].filter((step)=>step.length > 0);
        const estimatedRevisionTime = this.estimateRevisionTime(totalScore, criticalIssues.length);
        return {
            totalScore,
            grade,
            readyForPublication,
            criticalIssues,
            nextSteps,
            estimatedRevisionTime
        };
    }
    // 🔥 AI 응답 파싱 유틸리티들
    parseSynopsisAnalysis(content) {
        // AI 응답을 파싱하여 구조화된 데이터로 변환
        const scoreMatch = content.match(/(\d+)점|(\d+)\/100|점수[:\s]*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3] || '75') : 75;
        const strengthsSection = content.match(/강점[:\s]*\n*((?:.*\n)*?)(?=약점|개선|$)/i);
        const strengths = strengthsSection?.[1] ? strengthsSection[1].split('\n').filter((s)=>s.trim().length > 0).slice(0, 5) : [
            '구체적인 강점 분석 필요'
        ];
        const weaknessesSection = content.match(/약점[:\s]*\n*((?:.*\n)*?)(?=제안|개선|$)/i);
        const weaknesses = weaknessesSection?.[1] ? weaknessesSection[1].split('\n').filter((s)=>s.trim().length > 0).slice(0, 5) : [
            '구체적인 약점 분석 필요'
        ];
        const recommendationsSection = content.match(/제안[:\s]*\n*((?:.*\n)*?)$/i);
        const recommendations = recommendationsSection?.[1] ? recommendationsSection[1].split('\n').filter((s)=>s.trim().length > 0).slice(0, 7) : [
            '추가 분석이 필요합니다'
        ];
        return {
            score,
            strengths,
            weaknesses,
            recommendations
        };
    }
    parseCharacterAnalysis(content) {
        const arcMatch = content.match(/아크.*?(\d+)점|완성도.*?(\d+)/i);
        const arcCompleteness = arcMatch ? parseInt(arcMatch[1] || arcMatch[2] || '70') : 70;
        const relationshipMatch = content.match(/관계.*?(\d+)점|깊이.*?(\d+)/i);
        const relationshipDepth = relationshipMatch ? parseInt(relationshipMatch[1] || relationshipMatch[2] || '70') : 70;
        const suggestionsSection = content.match(/제안[:\s]*\n*((?:.*\n)*?)$/i);
        const developmentSuggestions = suggestionsSection?.[1] ? suggestionsSection[1].split('\n').filter((s)=>s.trim().length > 0).slice(0, 5) : [
            '캐릭터 발전 제안 분석 중'
        ];
        return {
            arcCompleteness,
            relationshipDepth,
            developmentSuggestions
        };
    }
    parsePlotAnalysis(content) {
        const coherenceMatch = content.match(/일관성.*?(\d+)점|논리.*?(\d+)/i);
        const coherenceScore = coherenceMatch ? parseInt(coherenceMatch[1] || coherenceMatch[2] || '75') : 75;
        const pacingMatch = content.match(/페이싱.*?(\d+)점|리듬.*?(\d+)/i);
        const pacingScore = pacingMatch ? parseInt(pacingMatch[1] || pacingMatch[2] || '75') : 75;
        const climaxMatch = content.match(/클라이맥스.*?(\d+)점|효과.*?(\d+)/i);
        const climaxEffectiveness = climaxMatch ? parseInt(climaxMatch[1] || climaxMatch[2] || '75') : 75;
        const plotHoles = content.match(/플롯홀|오류|문제/gi) ? [
            '플롯 일관성 검토 필요',
            '논리적 연결성 강화'
        ] : [];
        const structuralSuggestions = [
            '구조적 개선 방안 도출 중'
        ];
        return {
            coherenceScore,
            pacingScore,
            climaxEffectiveness,
            plotHoles,
            structuralSuggestions
        };
    }
    parseThemeAnalysis(content) {
        const clarityMatch = content.match(/명확성.*?(\d+)점|테마.*?(\d+)/i);
        const clarity = clarityMatch ? parseInt(clarityMatch[1] || clarityMatch[2] || '75') : 75;
        const consistencyMatch = content.match(/일관성.*?(\d+)점|표현.*?(\d+)/i);
        const consistency = consistencyMatch ? parseInt(consistencyMatch[1] || consistencyMatch[2] || '75') : 75;
        const resonanceMatch = content.match(/공명.*?(\d+)점|감정.*?(\d+)/i);
        const resonance = resonanceMatch ? parseInt(resonanceMatch[1] || resonanceMatch[2] || '75') : 75;
        const suggestions = [
            '테마 강화 방안 분석 중'
        ];
        return {
            clarity,
            consistency,
            resonance,
            suggestions
        };
    }
    calculateGrade(score) {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 75) return 'C+';
        if (score >= 70) return 'C';
        if (score >= 65) return 'D+';
        if (score >= 60) return 'D';
        return 'F';
    }
    estimateRevisionTime(score, criticalIssuesCount) {
        if (score >= 90 && criticalIssuesCount === 0) return '1-2주 (최종 검토)';
        if (score >= 80 && criticalIssuesCount <= 2) return '2-4주 (부분 수정)';
        if (score >= 70 && criticalIssuesCount <= 5) return '1-2개월 (전반적 수정)';
        if (score >= 60) return '2-3개월 (대폭 수정)';
        return '3-6개월 (전면 재작업)';
    }
}
async function performAIStoryAnalysis(structure, content, characters, plotPoints, additionalContext) {
    const analyzer = new AIEnhancedNCPAnalyzer(structure);
    return analyzer.performComprehensiveAnalysis(content, characters, plotPoints, additionalContext);
}
}}),
"[project]/src/shared/services/aiAnalysisService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 AI Analysis Service - 각 뷰에서 사용할 공통 AI 분석 서비스
__turbopack_context__.s({
    "analyzeMindmap": (()=>analyzeMindmap),
    "analyzeOutline": (()=>analyzeOutline),
    "analyzeTimeline": (()=>analyzeTimeline),
    "getAIAnalysisService": (()=>getAIAnalysisService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ai$2f$geminiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/ai/geminiClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$narrative$2f$aiEnhancedAnalyzer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/narrative/aiEnhancedAnalyzer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
;
;
;
class AIAnalysisService {
    geminiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ai$2f$geminiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeminiClient"])();
    analysisCache = new Map();
    constructor(){
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Initialized');
    }
    // 🔥 타임라인 분석
    async analyzeTimeline(request) {
        const startTime = Date.now();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Starting timeline analysis', {
            projectId: request.projectId
        });
        try {
            const cacheKey = this.generateCacheKey(request);
            if (this.analysisCache.has(cacheKey)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('AI_ANALYSIS_SERVICE', 'Returning cached timeline analysis');
                return this.analysisCache.get(cacheKey);
            }
            const timelineData = this.prepareTimelineData(request.data);
            const contextualInfo = this.buildContextualPrompt(request.context);
            const prompt = `
전문 서사 구조 분석가로서 다음 타임라인을 종합 분석해주세요:

[타임라인 데이터]
${JSON.stringify(timelineData, null, 2)}

${contextualInfo}

다음 항목들을 분석하여 JSON 형태로 응답해주세요:

{
  "coherence": {
    "score": 0-100,
    "issues": ["시간적 모순점들"],
    "suggestions": ["개선 제안들"]
  },
  "pacing": {
    "score": 0-100,
    "analysis": "페이싱 분석 내용",
    "improvements": ["페이싱 개선 방안들"]
  },
  "causality": {
    "score": 0-100,
    "brokenLinks": [{"from": "이벤트A", "to": "이벤트B", "issue": "문제점"}],
    "suggestions": ["인과관계 개선 방안들"]
  },
  "structure": {
    "acts": [{"name": "1막", "start": 0, "end": 25, "quality": 85}],
    "balance": 0-100,
    "recommendations": ["구조 개선 제안들"]
  }
}

반드시 유효한 JSON 형식으로만 응답해주세요.
            `;
            const aiResponse = await this.geminiClient.generateText({
                prompt,
                maxTokens: 2500,
                temperature: 0.2
            });
            const analysisResult = this.parseTimelineResponse(aiResponse.content);
            const response = {
                id: this.generateAnalysisId(),
                type: 'timeline',
                result: analysisResult,
                confidence: this.calculateConfidence(aiResponse),
                suggestions: this.extractSuggestions(analysisResult),
                metadata: {
                    processingTime: Date.now() - startTime,
                    tokenUsage: this.convertTokenUsage(aiResponse.usage),
                    model: aiResponse.metadata?.model || 'gemini-1.5-flash',
                    timestamp: new Date().toISOString()
                }
            };
            this.analysisCache.set(cacheKey, response);
            // DB에 저장 (실제로는 Prisma 사용)
            await this.saveAnalysisToDatabase(request, response);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Timeline analysis completed', {
                duration: Date.now() - startTime,
                confidence: response.confidence
            });
            return response;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_ANALYSIS_SERVICE', 'Timeline analysis failed', error);
            throw new Error(`타임라인 분석 실패: ${error}`);
        }
    }
    // 🔥 아웃라인 분석
    async analyzeOutline(request) {
        const startTime = Date.now();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Starting outline analysis', {
            projectId: request.projectId
        });
        try {
            const outlineData = this.prepareOutlineData(request.data);
            const contextualInfo = this.buildContextualPrompt(request.context);
            const prompt = `
전문 스토리 구조 컨설턴트로서 다음 아웃라인을 분석해주세요:

[아웃라인 구조]
${JSON.stringify(outlineData, null, 2)}

${contextualInfo}

다음 형식으로 JSON 응답해주세요:

{
  "structure": {
    "score": 0-100,
    "balance": "구조 균형성 평가",
    "missing": ["누락된 요소들"],
    "redundant": ["중복된 요소들"]
  },
  "flow": {
    "score": 0-100,
    "transitions": [{"from": "섹션1", "to": "섹션2", "quality": 85, "suggestion": "개선안"}]
  },
  "content": {
    "depth": 0-100,
    "clarity": 0-100,
    "completeness": 0-100,
    "suggestions": ["내용 개선 제안들"]
  },
  "engagement": {
    "hooks": ["흥미 유발 요소들"],
    "payoffs": ["만족도 제공 요소들"],
    "improvements": ["참여도 개선 방안들"]
  }
}
            `;
            const aiResponse = await this.geminiClient.generateText({
                prompt,
                maxTokens: 2200,
                temperature: 0.3
            });
            const analysisResult = this.parseOutlineResponse(aiResponse.content);
            const response = {
                id: this.generateAnalysisId(),
                type: 'outline',
                result: analysisResult,
                confidence: this.calculateConfidence(aiResponse),
                suggestions: this.extractSuggestions(analysisResult),
                metadata: {
                    processingTime: Date.now() - startTime,
                    tokenUsage: this.convertTokenUsage(aiResponse.usage),
                    model: aiResponse.metadata?.model || 'gemini-1.5-flash',
                    timestamp: new Date().toISOString()
                }
            };
            await this.saveAnalysisToDatabase(request, response);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Outline analysis completed', {
                duration: Date.now() - startTime
            });
            return response;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_ANALYSIS_SERVICE', 'Outline analysis failed', error);
            throw new Error(`아웃라인 분석 실패: ${error}`);
        }
    }
    // 🔥 마인드맵 분석
    async analyzeMindmap(request) {
        const startTime = Date.now();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Starting mindmap analysis', {
            projectId: request.projectId
        });
        try {
            const mindmapData = this.prepareMindmapData(request.data);
            const contextualInfo = this.buildContextualPrompt(request.context);
            const prompt = `
창작 프로세스 전문가로서 다음 마인드맵을 분석해주세요:

[마인드맵 데이터]
${JSON.stringify(mindmapData, null, 2)}

${contextualInfo}

다음 JSON 형식으로 응답해주세요:

{
  "connections": {
    "score": 0-100,
    "strongConnections": [{"from": "아이디어1", "to": "아이디어2", "strength": 90, "type": "causal"}],
    "missingConnections": [{"suggested": "연결 제안", "reason": "이유"}]
  },
  "themes": {
    "identified": [{"theme": "테마명", "relevance": 85, "elements": ["관련 요소들"]}],
    "suggestions": ["테마 발전 제안들"]
  },
  "development": {
    "priorities": [{"idea": "아이디어", "priority": 90, "reason": "우선순위 이유"}],
    "expansions": ["확장 가능한 영역들"]
  },
  "creativity": {
    "score": 0-100,
    "uniqueElements": ["독창적 요소들"],
    "improvements": ["창의성 개선 방안들"]
  }
}
            `;
            const aiResponse = await this.geminiClient.generateText({
                prompt,
                maxTokens: 2000,
                temperature: 0.4
            });
            const analysisResult = this.parseMindmapResponse(aiResponse.content);
            const response = {
                id: this.generateAnalysisId(),
                type: 'mindmap',
                result: analysisResult,
                confidence: this.calculateConfidence(aiResponse),
                suggestions: this.extractSuggestions(analysisResult),
                metadata: {
                    processingTime: Date.now() - startTime,
                    tokenUsage: this.convertTokenUsage(aiResponse.usage),
                    model: aiResponse.metadata?.model || 'gemini-1.5-flash',
                    timestamp: new Date().toISOString()
                }
            };
            await this.saveAnalysisToDatabase(request, response);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Mindmap analysis completed', {
                duration: Date.now() - startTime
            });
            return response;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_ANALYSIS_SERVICE', 'Mindmap analysis failed', error);
            throw new Error(`마인드맵 분석 실패: ${error}`);
        }
    }
    // 🔥 종합 분석 (모든 요소 포함)
    async performComprehensiveAnalysis(request) {
        const startTime = Date.now();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Starting comprehensive analysis', {
            projectId: request.projectId
        });
        try {
            // NCP 구조 생성 (기본값)
            const ncpStructure = {
                id: request.projectId,
                title: '분석 대상 스토리',
                authoralIntent: '독자 감동과 교훈',
                mainCharacter: {
                    name: '주인공',
                    motivation: '목표 달성',
                    methodology: '노력과 학습',
                    evaluation: '성과 평가',
                    purpose: '성장과 변화'
                },
                impactCharacter: {
                    name: '조력자/적대자',
                    influence: '주인공 변화 유도',
                    alternative: '다른 관점 제시'
                },
                conflictMethods: {
                    universe: 'psychology',
                    concern: '내적 갈등',
                    issue: '자아 정체성',
                    domain: '개인적 성장'
                },
                storyDynamics: {
                    driver: 'action',
                    limit: 'timelock',
                    outcome: 'success',
                    judgment: 'good'
                },
                vectors: {
                    goal: '목표 설정',
                    consequence: '결과 도출',
                    cost: '희생과 노력',
                    dividend: '성과와 보상',
                    requirement: '필요 조건',
                    prerequisite: '사전 준비',
                    precondition: '전제 조건',
                    forewarning: '예고와 암시'
                }
            };
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$narrative$2f$aiEnhancedAnalyzer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["performAIStoryAnalysis"])(ncpStructure, request.context?.content || '', request.context?.characters || [], request.context?.plotPoints || [], request.context ? JSON.stringify(request.context) : undefined);
            const response = {
                id: this.generateAnalysisId(),
                type: 'comprehensive',
                result,
                confidence: result.overallAssessment.totalScore / 100,
                suggestions: result.overallAssessment.nextSteps,
                metadata: {
                    processingTime: Date.now() - startTime,
                    model: 'gemini-1.5-flash',
                    timestamp: new Date().toISOString()
                }
            };
            await this.saveAnalysisToDatabase(request, response);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS_SERVICE', 'Comprehensive analysis completed', {
                duration: Date.now() - startTime,
                grade: result.overallAssessment.grade
            });
            return response;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_ANALYSIS_SERVICE', 'Comprehensive analysis failed', error);
            throw new Error(`종합 분석 실패: ${error}`);
        }
    }
    // 🔧 유틸리티 메서드들
    convertTokenUsage(geminiUsage) {
        if (!geminiUsage) return undefined;
        return {
            input: geminiUsage.promptTokens || geminiUsage.inputTokens || 0,
            output: geminiUsage.completionTokens || geminiUsage.outputTokens || 0,
            total: geminiUsage.totalTokens || (geminiUsage.promptTokens || 0) + (geminiUsage.completionTokens || 0)
        };
    }
    prepareTimelineData(data) {
        return Array.isArray(data) ? data.map((item, index)=>({
                order: index + 1,
                title: item.title || item.name || `Event ${index + 1}`,
                description: item.description || item.content || '',
                type: item.type || 'event',
                timestamp: item.timestamp || item.createdAt,
                duration: item.duration || 0
            })) : [];
    }
    prepareOutlineData(data) {
        return Array.isArray(data) ? data.map((item, index)=>({
                section: index + 1,
                title: item.title || `Section ${index + 1}`,
                content: item.description || item.content || '',
                type: item.type || 'section',
                depth: item.depth || 0,
                wordCount: item.wordCount || 0
            })) : [];
    }
    prepareMindmapData(data) {
        return {
            nodes: data.nodes || [],
            connections: data.edges || data.connections || [],
            centralTheme: data.centralTheme || '중심 아이디어',
            categories: data.categories || []
        };
    }
    buildContextualPrompt(context) {
        if (!context) return '';
        let prompt = '\n[추가 컨텍스트]\n';
        if (context.genre) prompt += `장르: ${context.genre}\n`;
        if (context.targetAudience) prompt += `타겟 독자: ${context.targetAudience}\n`;
        if (context.themes?.length) prompt += `주요 테마: ${context.themes.join(', ')}\n`;
        if (context.characters?.length) prompt += `등장인물: ${context.characters.map((c)=>c.name || c.title).join(', ')}\n`;
        return prompt;
    }
    parseTimelineResponse(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('AI_ANALYSIS_SERVICE', 'Failed to parse timeline JSON, using fallback');
            return this.createFallbackTimelineResult(content);
        }
    }
    parseOutlineResponse(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('AI_ANALYSIS_SERVICE', 'Failed to parse outline JSON, using fallback');
            return this.createFallbackOutlineResult(content);
        }
    }
    parseMindmapResponse(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('AI_ANALYSIS_SERVICE', 'Failed to parse mindmap JSON, using fallback');
            return this.createFallbackMindmapResult(content);
        }
    }
    createFallbackTimelineResult(content) {
        const score = this.extractScoreFromText(content);
        return {
            coherence: {
                score,
                issues: [
                    '분석 파싱 오류'
                ],
                suggestions: [
                    '재분석 필요'
                ]
            },
            pacing: {
                score,
                analysis: content.slice(0, 200),
                improvements: [
                    '추가 분석 필요'
                ]
            },
            causality: {
                score,
                brokenLinks: [],
                suggestions: [
                    '세부 분석 필요'
                ]
            },
            structure: {
                acts: [],
                balance: score,
                recommendations: [
                    '구조 재검토'
                ]
            }
        };
    }
    createFallbackOutlineResult(content) {
        const score = this.extractScoreFromText(content);
        return {
            structure: {
                score,
                balance: '분석 중',
                missing: [],
                redundant: []
            },
            flow: {
                score,
                transitions: []
            },
            content: {
                depth: score,
                clarity: score,
                completeness: score,
                suggestions: [
                    '추가 분석 필요'
                ]
            },
            engagement: {
                hooks: [],
                payoffs: [],
                improvements: [
                    '재분석 필요'
                ]
            }
        };
    }
    createFallbackMindmapResult(content) {
        const score = this.extractScoreFromText(content);
        return {
            connections: {
                score,
                strongConnections: [],
                missingConnections: []
            },
            themes: {
                identified: [],
                suggestions: [
                    '테마 분석 필요'
                ]
            },
            development: {
                priorities: [],
                expansions: [
                    '확장 가능성 분석 중'
                ]
            },
            creativity: {
                score,
                uniqueElements: [],
                improvements: [
                    '창의성 개선 분석 중'
                ]
            }
        };
    }
    extractScoreFromText(content) {
        const scoreMatch = content.match(/(\d+)점|(\d+)\/100|score.*?(\d+)/i);
        return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3] || '75') : 75;
    }
    calculateConfidence(aiResponse) {
        // 응답 품질 기반 신뢰도 계산
        let confidence = 0.8; // 기본값
        if (aiResponse.finishReason === 'stop') confidence += 0.1;
        if (aiResponse.content.length > 500) confidence += 0.05;
        if (aiResponse.usage && aiResponse.usage.totalTokens > 1000) confidence += 0.05;
        return Math.min(confidence, 1.0);
    }
    extractSuggestions(result) {
        const suggestions = [];
        // 결과 객체에서 suggestions, improvements, recommendations 등을 재귀적으로 찾아서 추출
        const extractFromObject = (obj)=>{
            if (!obj || typeof obj !== 'object') return;
            Object.values(obj).forEach((value)=>{
                if (Array.isArray(value)) {
                    value.forEach((item)=>{
                        if (typeof item === 'string') suggestions.push(item);
                    });
                } else if (typeof value === 'object') {
                    extractFromObject(value);
                }
            });
        };
        extractFromObject(result);
        return suggestions.slice(0, 10); // 최대 10개
    }
    generateAnalysisId() {
        return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateCacheKey(request) {
        return `${request.type}_${request.projectId}_${JSON.stringify(request.data).slice(0, 100)}`;
    }
    async saveAnalysisToDatabase(request, response) {
        try {
            // 실제로는 Prisma를 통해 데이터베이스에 저장
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('AI_ANALYSIS_SERVICE', 'Saving analysis to database', {
                projectId: request.projectId,
                type: request.type,
                analysisId: response.id
            });
        // TODO: Prisma를 통한 실제 DB 저장
        // await prisma.aIAnalysis.create({
        //   data: {
        //     projectId: request.projectId,
        //     analysisType: request.type,
        //     inputData: JSON.stringify(request.data),
        //     response: JSON.stringify(response.result),
        //     metadata: response.metadata,
        //     confidence: response.confidence,
        //     status: 'completed'
        //   }
        // });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_ANALYSIS_SERVICE', 'Failed to save analysis to database', error);
        // 저장 실패해도 분석 결과는 반환
        }
    }
}
// 🔥 싱글톤 인스턴스
let aiAnalysisService = null;
function getAIAnalysisService() {
    if (!aiAnalysisService) {
        aiAnalysisService = new AIAnalysisService();
    }
    return aiAnalysisService;
}
async function analyzeTimeline(projectId, timelineData, context) {
    const service = getAIAnalysisService();
    return service.analyzeTimeline({
        projectId,
        type: 'timeline',
        data: timelineData,
        context
    });
}
async function analyzeOutline(projectId, outlineData, context) {
    const service = getAIAnalysisService();
    return service.analyzeOutline({
        projectId,
        type: 'outline',
        data: outlineData,
        context
    });
}
async function analyzeMindmap(projectId, mindmapData, context) {
    const service = getAIAnalysisService();
    return service.analyzeMindmap({
        projectId,
        type: 'mindmap',
        data: mindmapData,
        context
    });
}
}}),
"[project]/node_modules/@google/generative-ai/dist/index.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Contains the list of OpenAPI data types
 * as defined by https://swagger.io/docs/specification/data-models/data-types/
 * @public
 */ __turbopack_context__.s({
    "BlockReason": (()=>BlockReason),
    "ChatSession": (()=>ChatSession),
    "DynamicRetrievalMode": (()=>DynamicRetrievalMode),
    "ExecutableCodeLanguage": (()=>ExecutableCodeLanguage),
    "FinishReason": (()=>FinishReason),
    "FunctionCallingMode": (()=>FunctionCallingMode),
    "GenerativeModel": (()=>GenerativeModel),
    "GoogleGenerativeAI": (()=>GoogleGenerativeAI),
    "GoogleGenerativeAIAbortError": (()=>GoogleGenerativeAIAbortError),
    "GoogleGenerativeAIError": (()=>GoogleGenerativeAIError),
    "GoogleGenerativeAIFetchError": (()=>GoogleGenerativeAIFetchError),
    "GoogleGenerativeAIRequestInputError": (()=>GoogleGenerativeAIRequestInputError),
    "GoogleGenerativeAIResponseError": (()=>GoogleGenerativeAIResponseError),
    "HarmBlockThreshold": (()=>HarmBlockThreshold),
    "HarmCategory": (()=>HarmCategory),
    "HarmProbability": (()=>HarmProbability),
    "Outcome": (()=>Outcome),
    "POSSIBLE_ROLES": (()=>POSSIBLE_ROLES),
    "SchemaType": (()=>SchemaType),
    "TaskType": (()=>TaskType)
});
var SchemaType;
(function(SchemaType) {
    /** String type. */ SchemaType["STRING"] = "string";
    /** Number type. */ SchemaType["NUMBER"] = "number";
    /** Integer type. */ SchemaType["INTEGER"] = "integer";
    /** Boolean type. */ SchemaType["BOOLEAN"] = "boolean";
    /** Array type. */ SchemaType["ARRAY"] = "array";
    /** Object type. */ SchemaType["OBJECT"] = "object";
})(SchemaType || (SchemaType = {}));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * @public
 */ var ExecutableCodeLanguage;
(function(ExecutableCodeLanguage) {
    ExecutableCodeLanguage["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
    ExecutableCodeLanguage["PYTHON"] = "python";
})(ExecutableCodeLanguage || (ExecutableCodeLanguage = {}));
/**
 * Possible outcomes of code execution.
 * @public
 */ var Outcome;
(function(Outcome) {
    /**
     * Unspecified status. This value should not be used.
     */ Outcome["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
    /**
     * Code execution completed successfully.
     */ Outcome["OUTCOME_OK"] = "outcome_ok";
    /**
     * Code execution finished but with a failure. `stderr` should contain the
     * reason.
     */ Outcome["OUTCOME_FAILED"] = "outcome_failed";
    /**
     * Code execution ran for too long, and was cancelled. There may or may not
     * be a partial output present.
     */ Outcome["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
})(Outcome || (Outcome = {}));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Possible roles.
 * @public
 */ const POSSIBLE_ROLES = [
    "user",
    "model",
    "function",
    "system"
];
/**
 * Harm categories that would cause prompts or candidates to be blocked.
 * @public
 */ var HarmCategory;
(function(HarmCategory) {
    HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
    HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
    HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
    HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
    HarmCategory["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
})(HarmCategory || (HarmCategory = {}));
/**
 * Threshold above which a prompt or candidate will be blocked.
 * @public
 */ var HarmBlockThreshold;
(function(HarmBlockThreshold) {
    /** Threshold is unspecified. */ HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
    /** Content with NEGLIGIBLE will be allowed. */ HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    /** Content with NEGLIGIBLE and LOW will be allowed. */ HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    /** Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed. */ HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    /** All content will be allowed. */ HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
/**
 * Probability that a prompt or candidate matches a harm category.
 * @public
 */ var HarmProbability;
(function(HarmProbability) {
    /** Probability is unspecified. */ HarmProbability["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
    /** Content has a negligible chance of being unsafe. */ HarmProbability["NEGLIGIBLE"] = "NEGLIGIBLE";
    /** Content has a low chance of being unsafe. */ HarmProbability["LOW"] = "LOW";
    /** Content has a medium chance of being unsafe. */ HarmProbability["MEDIUM"] = "MEDIUM";
    /** Content has a high chance of being unsafe. */ HarmProbability["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
/**
 * Reason that a prompt was blocked.
 * @public
 */ var BlockReason;
(function(BlockReason) {
    // A blocked reason was not specified.
    BlockReason["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
    // Content was blocked by safety settings.
    BlockReason["SAFETY"] = "SAFETY";
    // Content was blocked, but the reason is uncategorized.
    BlockReason["OTHER"] = "OTHER";
})(BlockReason || (BlockReason = {}));
/**
 * Reason that a candidate finished.
 * @public
 */ var FinishReason;
(function(FinishReason) {
    // Default value. This value is unused.
    FinishReason["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
    // Natural stop point of the model or provided stop sequence.
    FinishReason["STOP"] = "STOP";
    // The maximum number of tokens as specified in the request was reached.
    FinishReason["MAX_TOKENS"] = "MAX_TOKENS";
    // The candidate content was flagged for safety reasons.
    FinishReason["SAFETY"] = "SAFETY";
    // The candidate content was flagged for recitation reasons.
    FinishReason["RECITATION"] = "RECITATION";
    // The candidate content was flagged for using an unsupported language.
    FinishReason["LANGUAGE"] = "LANGUAGE";
    // Token generation stopped because the content contains forbidden terms.
    FinishReason["BLOCKLIST"] = "BLOCKLIST";
    // Token generation stopped for potentially containing prohibited content.
    FinishReason["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
    // Token generation stopped because the content potentially contains Sensitive Personally Identifiable Information (SPII).
    FinishReason["SPII"] = "SPII";
    // The function call generated by the model is invalid.
    FinishReason["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
    // Unknown reason.
    FinishReason["OTHER"] = "OTHER";
})(FinishReason || (FinishReason = {}));
/**
 * Task type for embedding content.
 * @public
 */ var TaskType;
(function(TaskType) {
    TaskType["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
    TaskType["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
    TaskType["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
    TaskType["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
    TaskType["CLASSIFICATION"] = "CLASSIFICATION";
    TaskType["CLUSTERING"] = "CLUSTERING";
})(TaskType || (TaskType = {}));
/**
 * @public
 */ var FunctionCallingMode;
(function(FunctionCallingMode) {
    // Unspecified function calling mode. This value should not be used.
    FunctionCallingMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    // Default model behavior, model decides to predict either a function call
    // or a natural language repspose.
    FunctionCallingMode["AUTO"] = "AUTO";
    // Model is constrained to always predicting a function call only.
    // If "allowed_function_names" are set, the predicted function call will be
    // limited to any one of "allowed_function_names", else the predicted
    // function call will be any one of the provided "function_declarations".
    FunctionCallingMode["ANY"] = "ANY";
    // Model will not predict any function call. Model behavior is same as when
    // not passing any function declarations.
    FunctionCallingMode["NONE"] = "NONE";
})(FunctionCallingMode || (FunctionCallingMode = {}));
/**
 * The mode of the predictor to be used in dynamic retrieval.
 * @public
 */ var DynamicRetrievalMode;
(function(DynamicRetrievalMode) {
    // Unspecified function calling mode. This value should not be used.
    DynamicRetrievalMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    // Run retrieval only when system decides it is necessary.
    DynamicRetrievalMode["MODE_DYNAMIC"] = "MODE_DYNAMIC";
})(DynamicRetrievalMode || (DynamicRetrievalMode = {}));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Basic error type for this SDK.
 * @public
 */ class GoogleGenerativeAIError extends Error {
    constructor(message){
        super(`[GoogleGenerativeAI Error]: ${message}`);
    }
}
/**
 * Errors in the contents of a response from the model. This includes parsing
 * errors, or responses including a safety block reason.
 * @public
 */ class GoogleGenerativeAIResponseError extends GoogleGenerativeAIError {
    constructor(message, response){
        super(message);
        this.response = response;
    }
}
/**
 * Error class covering HTTP errors when calling the server. Includes HTTP
 * status, statusText, and optional details, if provided in the server response.
 * @public
 */ class GoogleGenerativeAIFetchError extends GoogleGenerativeAIError {
    constructor(message, status, statusText, errorDetails){
        super(message);
        this.status = status;
        this.statusText = statusText;
        this.errorDetails = errorDetails;
    }
}
/**
 * Errors in the contents of a request originating from user input.
 * @public
 */ class GoogleGenerativeAIRequestInputError extends GoogleGenerativeAIError {
}
/**
 * Error thrown when a request is aborted, either due to a timeout or
 * intentional cancellation by the user.
 * @public
 */ class GoogleGenerativeAIAbortError extends GoogleGenerativeAIError {
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
const DEFAULT_API_VERSION = "v1beta";
/**
 * We can't `require` package.json if this runs on web. We will use rollup to
 * swap in the version number here at build time.
 */ const PACKAGE_VERSION = "0.24.1";
const PACKAGE_LOG_HEADER = "genai-js";
var Task;
(function(Task) {
    Task["GENERATE_CONTENT"] = "generateContent";
    Task["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
    Task["COUNT_TOKENS"] = "countTokens";
    Task["EMBED_CONTENT"] = "embedContent";
    Task["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
})(Task || (Task = {}));
class RequestUrl {
    constructor(model, task, apiKey, stream, requestOptions){
        this.model = model;
        this.task = task;
        this.apiKey = apiKey;
        this.stream = stream;
        this.requestOptions = requestOptions;
    }
    toString() {
        var _a, _b;
        const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
        const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
        let url = `${baseUrl}/${apiVersion}/${this.model}:${this.task}`;
        if (this.stream) {
            url += "?alt=sse";
        }
        return url;
    }
}
/**
 * Simple, but may become more complex if we add more versions to log.
 */ function getClientHeaders(requestOptions) {
    const clientHeaders = [];
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
        clientHeaders.push(requestOptions.apiClient);
    }
    clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
    return clientHeaders.join(" ");
}
async function getHeaders(url) {
    var _a;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
    headers.append("x-goog-api-key", url.apiKey);
    let customHeaders = (_a = url.requestOptions) === null || _a === void 0 ? void 0 : _a.customHeaders;
    if (customHeaders) {
        if (!(customHeaders instanceof Headers)) {
            try {
                customHeaders = new Headers(customHeaders);
            } catch (e) {
                throw new GoogleGenerativeAIRequestInputError(`unable to convert customHeaders value ${JSON.stringify(customHeaders)} to Headers: ${e.message}`);
            }
        }
        for (const [headerName, headerValue] of customHeaders.entries()){
            if (headerName === "x-goog-api-key") {
                throw new GoogleGenerativeAIRequestInputError(`Cannot set reserved header name ${headerName}`);
            } else if (headerName === "x-goog-api-client") {
                throw new GoogleGenerativeAIRequestInputError(`Header name ${headerName} can only be set using the apiClient field`);
            }
            headers.append(headerName, headerValue);
        }
    }
    return headers;
}
async function constructModelRequest(model, task, apiKey, stream, body, requestOptions) {
    const url = new RequestUrl(model, task, apiKey, stream, requestOptions);
    return {
        url: url.toString(),
        fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), {
            method: "POST",
            headers: await getHeaders(url),
            body
        })
    };
}
async function makeModelRequest(model, task, apiKey, stream, body, requestOptions = {}, // Allows this to be stubbed for tests
fetchFn = fetch) {
    const { url, fetchOptions } = await constructModelRequest(model, task, apiKey, stream, body, requestOptions);
    return makeRequest(url, fetchOptions, fetchFn);
}
async function makeRequest(url, fetchOptions, fetchFn = fetch) {
    let response;
    try {
        response = await fetchFn(url, fetchOptions);
    } catch (e) {
        handleResponseError(e, url);
    }
    if (!response.ok) {
        await handleResponseNotOk(response, url);
    }
    return response;
}
function handleResponseError(e, url) {
    let err = e;
    if (err.name === "AbortError") {
        err = new GoogleGenerativeAIAbortError(`Request aborted when fetching ${url.toString()}: ${e.message}`);
        err.stack = e.stack;
    } else if (!(e instanceof GoogleGenerativeAIFetchError || e instanceof GoogleGenerativeAIRequestInputError)) {
        err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
        err.stack = e.stack;
    }
    throw err;
}
async function handleResponseNotOk(response, url) {
    let message = "";
    let errorDetails;
    try {
        const json = await response.json();
        message = json.error.message;
        if (json.error.details) {
            message += ` ${JSON.stringify(json.error.details)}`;
            errorDetails = json.error.details;
        }
    } catch (e) {
    // ignored
    }
    throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
}
/**
 * Generates the request options to be passed to the fetch API.
 * @param requestOptions - The user-defined request options.
 * @returns The generated request options.
 */ function buildFetchOptions(requestOptions) {
    const fetchOptions = {};
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== undefined || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
        const controller = new AbortController();
        if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
            setTimeout(()=>controller.abort(), requestOptions.timeout);
        }
        if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) {
            requestOptions.signal.addEventListener("abort", ()=>{
                controller.abort();
            });
        }
        fetchOptions.signal = controller.signal;
    }
    return fetchOptions;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Adds convenience helper methods to a response object, including stream
 * chunks (as long as each chunk is a complete GenerateContentResponse JSON).
 */ function addHelpers(response) {
    response.text = ()=>{
        if (response.candidates && response.candidates.length > 0) {
            if (response.candidates.length > 1) {
                console.warn(`This response had ${response.candidates.length} ` + `candidates. Returning text from the first candidate only. ` + `Access response.candidates directly to use the other candidates.`);
            }
            if (hadBadFinishReason(response.candidates[0])) {
                throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
            }
            return getText(response);
        } else if (response.promptFeedback) {
            throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
        }
        return "";
    };
    /**
     * TODO: remove at next major version
     */ response.functionCall = ()=>{
        if (response.candidates && response.candidates.length > 0) {
            if (response.candidates.length > 1) {
                console.warn(`This response had ${response.candidates.length} ` + `candidates. Returning function calls from the first candidate only. ` + `Access response.candidates directly to use the other candidates.`);
            }
            if (hadBadFinishReason(response.candidates[0])) {
                throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
            }
            console.warn(`response.functionCall() is deprecated. ` + `Use response.functionCalls() instead.`);
            return getFunctionCalls(response)[0];
        } else if (response.promptFeedback) {
            throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
        }
        return undefined;
    };
    response.functionCalls = ()=>{
        if (response.candidates && response.candidates.length > 0) {
            if (response.candidates.length > 1) {
                console.warn(`This response had ${response.candidates.length} ` + `candidates. Returning function calls from the first candidate only. ` + `Access response.candidates directly to use the other candidates.`);
            }
            if (hadBadFinishReason(response.candidates[0])) {
                throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
            }
            return getFunctionCalls(response);
        } else if (response.promptFeedback) {
            throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
        }
        return undefined;
    };
    return response;
}
/**
 * Returns all text found in all parts of first candidate.
 */ function getText(response) {
    var _a, _b, _c, _d;
    const textStrings = [];
    if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
        for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts){
            if (part.text) {
                textStrings.push(part.text);
            }
            if (part.executableCode) {
                textStrings.push("\n```" + part.executableCode.language + "\n" + part.executableCode.code + "\n```\n");
            }
            if (part.codeExecutionResult) {
                textStrings.push("\n```\n" + part.codeExecutionResult.output + "\n```\n");
            }
        }
    }
    if (textStrings.length > 0) {
        return textStrings.join("");
    } else {
        return "";
    }
}
/**
 * Returns functionCall of first candidate.
 */ function getFunctionCalls(response) {
    var _a, _b, _c, _d;
    const functionCalls = [];
    if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
        for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts){
            if (part.functionCall) {
                functionCalls.push(part.functionCall);
            }
        }
    }
    if (functionCalls.length > 0) {
        return functionCalls;
    } else {
        return undefined;
    }
}
const badFinishReasons = [
    FinishReason.RECITATION,
    FinishReason.SAFETY,
    FinishReason.LANGUAGE
];
function hadBadFinishReason(candidate) {
    return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
}
function formatBlockErrorMessage(response) {
    var _a, _b, _c;
    let message = "";
    if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
        message += "Response was blocked";
        if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
            message += ` due to ${response.promptFeedback.blockReason}`;
        }
        if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
            message += `: ${response.promptFeedback.blockReasonMessage}`;
        }
    } else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
        const firstCandidate = response.candidates[0];
        if (hadBadFinishReason(firstCandidate)) {
            message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
            if (firstCandidate.finishMessage) {
                message += `: ${firstCandidate.finishMessage}`;
            }
        }
    }
    return message;
}
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ /* global Reflect, Promise, SuppressedError, Symbol */ function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    "TURBOPACK unreachable";
    function verb(n) {
        if (g[n]) i[n] = function(v) {
            return new Promise(function(a, b) {
                q.push([
                    n,
                    v,
                    a,
                    b
                ]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
/**
 * Process a response.body stream from the backend and return an
 * iterator that provides one complete GenerateContentResponse at a time
 * and a promise that resolves with a single aggregated
 * GenerateContentResponse.
 *
 * @param response - Response from a fetch call
 */ function processStream(response) {
    const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", {
        fatal: true
    }));
    const responseStream = getResponseStream(inputStream);
    const [stream1, stream2] = responseStream.tee();
    return {
        stream: generateResponseSequence(stream1),
        response: getResponsePromise(stream2)
    };
}
async function getResponsePromise(stream) {
    const allResponses = [];
    const reader = stream.getReader();
    while(true){
        const { done, value } = await reader.read();
        if (done) {
            return addHelpers(aggregateResponses(allResponses));
        }
        allResponses.push(value);
    }
}
function generateResponseSequence(stream) {
    return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
        const reader = stream.getReader();
        while(true){
            const { value, done } = yield __await(reader.read());
            if (done) {
                break;
            }
            yield yield __await(addHelpers(value));
        }
    });
}
/**
 * Reads a raw stream from the fetch response and join incomplete
 * chunks, returning a new stream that provides a single complete
 * GenerateContentResponse in each iteration.
 */ function getResponseStream(inputStream) {
    const reader = inputStream.getReader();
    const stream = new ReadableStream({
        start (controller) {
            let currentText = "";
            return pump();
            "TURBOPACK unreachable";
            function pump() {
                return reader.read().then(({ value, done })=>{
                    if (done) {
                        if (currentText.trim()) {
                            controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
                            return;
                        }
                        controller.close();
                        return;
                    }
                    currentText += value;
                    let match = currentText.match(responseLineRE);
                    let parsedResponse;
                    while(match){
                        try {
                            parsedResponse = JSON.parse(match[1]);
                        } catch (e) {
                            controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
                            return;
                        }
                        controller.enqueue(parsedResponse);
                        currentText = currentText.substring(match[0].length);
                        match = currentText.match(responseLineRE);
                    }
                    return pump();
                }).catch((e)=>{
                    let err = e;
                    err.stack = e.stack;
                    if (err.name === "AbortError") {
                        err = new GoogleGenerativeAIAbortError("Request aborted when reading from the stream");
                    } else {
                        err = new GoogleGenerativeAIError("Error reading from the stream");
                    }
                    throw err;
                });
            }
        }
    });
    return stream;
}
/**
 * Aggregates an array of `GenerateContentResponse`s into a single
 * GenerateContentResponse.
 */ function aggregateResponses(responses) {
    const lastResponse = responses[responses.length - 1];
    const aggregatedResponse = {
        promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
    };
    for (const response of responses){
        if (response.candidates) {
            let candidateIndex = 0;
            for (const candidate of response.candidates){
                if (!aggregatedResponse.candidates) {
                    aggregatedResponse.candidates = [];
                }
                if (!aggregatedResponse.candidates[candidateIndex]) {
                    aggregatedResponse.candidates[candidateIndex] = {
                        index: candidateIndex
                    };
                }
                // Keep overwriting, the last one will be final
                aggregatedResponse.candidates[candidateIndex].citationMetadata = candidate.citationMetadata;
                aggregatedResponse.candidates[candidateIndex].groundingMetadata = candidate.groundingMetadata;
                aggregatedResponse.candidates[candidateIndex].finishReason = candidate.finishReason;
                aggregatedResponse.candidates[candidateIndex].finishMessage = candidate.finishMessage;
                aggregatedResponse.candidates[candidateIndex].safetyRatings = candidate.safetyRatings;
                /**
                 * Candidates should always have content and parts, but this handles
                 * possible malformed responses.
                 */ if (candidate.content && candidate.content.parts) {
                    if (!aggregatedResponse.candidates[candidateIndex].content) {
                        aggregatedResponse.candidates[candidateIndex].content = {
                            role: candidate.content.role || "user",
                            parts: []
                        };
                    }
                    const newPart = {};
                    for (const part of candidate.content.parts){
                        if (part.text) {
                            newPart.text = part.text;
                        }
                        if (part.functionCall) {
                            newPart.functionCall = part.functionCall;
                        }
                        if (part.executableCode) {
                            newPart.executableCode = part.executableCode;
                        }
                        if (part.codeExecutionResult) {
                            newPart.codeExecutionResult = part.codeExecutionResult;
                        }
                        if (Object.keys(newPart).length === 0) {
                            newPart.text = "";
                        }
                        aggregatedResponse.candidates[candidateIndex].content.parts.push(newPart);
                    }
                }
            }
            candidateIndex++;
        }
        if (response.usageMetadata) {
            aggregatedResponse.usageMetadata = response.usageMetadata;
        }
    }
    return aggregatedResponse;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function generateContentStream(apiKey, model, params, requestOptions) {
    const response = await makeModelRequest(model, Task.STREAM_GENERATE_CONTENT, apiKey, /* stream */ true, JSON.stringify(params), requestOptions);
    return processStream(response);
}
async function generateContent(apiKey, model, params, requestOptions) {
    const response = await makeModelRequest(model, Task.GENERATE_CONTENT, apiKey, /* stream */ false, JSON.stringify(params), requestOptions);
    const responseJson = await response.json();
    const enhancedResponse = addHelpers(responseJson);
    return {
        response: enhancedResponse
    };
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function formatSystemInstruction(input) {
    // null or undefined
    if (input == null) {
        return undefined;
    } else if (typeof input === "string") {
        return {
            role: "system",
            parts: [
                {
                    text: input
                }
            ]
        };
    } else if (input.text) {
        return {
            role: "system",
            parts: [
                input
            ]
        };
    } else if (input.parts) {
        if (!input.role) {
            return {
                role: "system",
                parts: input.parts
            };
        } else {
            return input;
        }
    }
}
function formatNewContent(request) {
    let newParts = [];
    if (typeof request === "string") {
        newParts = [
            {
                text: request
            }
        ];
    } else {
        for (const partOrString of request){
            if (typeof partOrString === "string") {
                newParts.push({
                    text: partOrString
                });
            } else {
                newParts.push(partOrString);
            }
        }
    }
    return assignRoleToPartsAndValidateSendMessageRequest(newParts);
}
/**
 * When multiple Part types (i.e. FunctionResponsePart and TextPart) are
 * passed in a single Part array, we may need to assign different roles to each
 * part. Currently only FunctionResponsePart requires a role other than 'user'.
 * @private
 * @param parts Array of parts to pass to the model
 * @returns Array of content items
 */ function assignRoleToPartsAndValidateSendMessageRequest(parts) {
    const userContent = {
        role: "user",
        parts: []
    };
    const functionContent = {
        role: "function",
        parts: []
    };
    let hasUserContent = false;
    let hasFunctionContent = false;
    for (const part of parts){
        if ("functionResponse" in part) {
            functionContent.parts.push(part);
            hasFunctionContent = true;
        } else {
            userContent.parts.push(part);
            hasUserContent = true;
        }
    }
    if (hasUserContent && hasFunctionContent) {
        throw new GoogleGenerativeAIError("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
    }
    if (!hasUserContent && !hasFunctionContent) {
        throw new GoogleGenerativeAIError("No content is provided for sending chat message.");
    }
    if (hasUserContent) {
        return userContent;
    }
    return functionContent;
}
function formatCountTokensInput(params, modelParams) {
    var _a;
    let formattedGenerateContentRequest = {
        model: modelParams === null || modelParams === void 0 ? void 0 : modelParams.model,
        generationConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.generationConfig,
        safetySettings: modelParams === null || modelParams === void 0 ? void 0 : modelParams.safetySettings,
        tools: modelParams === null || modelParams === void 0 ? void 0 : modelParams.tools,
        toolConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.toolConfig,
        systemInstruction: modelParams === null || modelParams === void 0 ? void 0 : modelParams.systemInstruction,
        cachedContent: (_a = modelParams === null || modelParams === void 0 ? void 0 : modelParams.cachedContent) === null || _a === void 0 ? void 0 : _a.name,
        contents: []
    };
    const containsGenerateContentRequest = params.generateContentRequest != null;
    if (params.contents) {
        if (containsGenerateContentRequest) {
            throw new GoogleGenerativeAIRequestInputError("CountTokensRequest must have one of contents or generateContentRequest, not both.");
        }
        formattedGenerateContentRequest.contents = params.contents;
    } else if (containsGenerateContentRequest) {
        formattedGenerateContentRequest = Object.assign(Object.assign({}, formattedGenerateContentRequest), params.generateContentRequest);
    } else {
        // Array or string
        const content = formatNewContent(params);
        formattedGenerateContentRequest.contents = [
            content
        ];
    }
    return {
        generateContentRequest: formattedGenerateContentRequest
    };
}
function formatGenerateContentInput(params) {
    let formattedRequest;
    if (params.contents) {
        formattedRequest = params;
    } else {
        // Array or string
        const content = formatNewContent(params);
        formattedRequest = {
            contents: [
                content
            ]
        };
    }
    if (params.systemInstruction) {
        formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
    }
    return formattedRequest;
}
function formatEmbedContentInput(params) {
    if (typeof params === "string" || Array.isArray(params)) {
        const content = formatNewContent(params);
        return {
            content
        };
    }
    return params;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ // https://ai.google.dev/api/rest/v1beta/Content#part
const VALID_PART_FIELDS = [
    "text",
    "inlineData",
    "functionCall",
    "functionResponse",
    "executableCode",
    "codeExecutionResult"
];
const VALID_PARTS_PER_ROLE = {
    user: [
        "text",
        "inlineData"
    ],
    function: [
        "functionResponse"
    ],
    model: [
        "text",
        "functionCall",
        "executableCode",
        "codeExecutionResult"
    ],
    // System instructions shouldn't be in history anyway.
    system: [
        "text"
    ]
};
function validateChatHistory(history) {
    let prevContent = false;
    for (const currContent of history){
        const { role, parts } = currContent;
        if (!prevContent && role !== "user") {
            throw new GoogleGenerativeAIError(`First content should be with role 'user', got ${role}`);
        }
        if (!POSSIBLE_ROLES.includes(role)) {
            throw new GoogleGenerativeAIError(`Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
        }
        if (!Array.isArray(parts)) {
            throw new GoogleGenerativeAIError("Content should have 'parts' property with an array of Parts");
        }
        if (parts.length === 0) {
            throw new GoogleGenerativeAIError("Each Content should have at least one part");
        }
        const countFields = {
            text: 0,
            inlineData: 0,
            functionCall: 0,
            functionResponse: 0,
            fileData: 0,
            executableCode: 0,
            codeExecutionResult: 0
        };
        for (const part of parts){
            for (const key of VALID_PART_FIELDS){
                if (key in part) {
                    countFields[key] += 1;
                }
            }
        }
        const validParts = VALID_PARTS_PER_ROLE[role];
        for (const key of VALID_PART_FIELDS){
            if (!validParts.includes(key) && countFields[key] > 0) {
                throw new GoogleGenerativeAIError(`Content with role '${role}' can't contain '${key}' part`);
            }
        }
        prevContent = true;
    }
}
/**
 * Returns true if the response is valid (could be appended to the history), flase otherwise.
 */ function isValidResponse(response) {
    var _a;
    if (response.candidates === undefined || response.candidates.length === 0) {
        return false;
    }
    const content = (_a = response.candidates[0]) === null || _a === void 0 ? void 0 : _a.content;
    if (content === undefined) {
        return false;
    }
    if (content.parts === undefined || content.parts.length === 0) {
        return false;
    }
    for (const part of content.parts){
        if (part === undefined || Object.keys(part).length === 0) {
            return false;
        }
        if (part.text !== undefined && part.text === "") {
            return false;
        }
    }
    return true;
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Do not log a message for this error.
 */ const SILENT_ERROR = "SILENT_ERROR";
/**
 * ChatSession class that enables sending chat messages and stores
 * history of sent and received messages so far.
 *
 * @public
 */ class ChatSession {
    constructor(apiKey, model, params, _requestOptions = {}){
        this.model = model;
        this.params = params;
        this._requestOptions = _requestOptions;
        this._history = [];
        this._sendPromise = Promise.resolve();
        this._apiKey = apiKey;
        if (params === null || params === void 0 ? void 0 : params.history) {
            validateChatHistory(params.history);
            this._history = params.history;
        }
    }
    /**
     * Gets the chat history so far. Blocked prompts are not added to history.
     * Blocked candidates are not added to history, nor are the prompts that
     * generated them.
     */ async getHistory() {
        await this._sendPromise;
        return this._history;
    }
    /**
     * Sends a chat message and receives a non-streaming
     * {@link GenerateContentResult}.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */ async sendMessage(request, requestOptions = {}) {
        var _a, _b, _c, _d, _e, _f;
        await this._sendPromise;
        const newContent = formatNewContent(request);
        const generateContentRequest = {
            safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
            generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
            tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
            toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
            systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
            cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
            contents: [
                ...this._history,
                newContent
            ]
        };
        const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        let finalResult;
        // Add onto the chain.
        this._sendPromise = this._sendPromise.then(()=>generateContent(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions)).then((result)=>{
            var _a;
            if (isValidResponse(result.response)) {
                this._history.push(newContent);
                const responseContent = Object.assign({
                    parts: [],
                    // Response seems to come back without a role set.
                    role: "model"
                }, (_a = result.response.candidates) === null || _a === void 0 ? void 0 : _a[0].content);
                this._history.push(responseContent);
            } else {
                const blockErrorMessage = formatBlockErrorMessage(result.response);
                if (blockErrorMessage) {
                    console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                }
            }
            finalResult = result;
        }).catch((e)=>{
            // Resets _sendPromise to avoid subsequent calls failing and throw error.
            this._sendPromise = Promise.resolve();
            throw e;
        });
        await this._sendPromise;
        return finalResult;
    }
    /**
     * Sends a chat message and receives the response as a
     * {@link GenerateContentStreamResult} containing an iterable stream
     * and a response promise.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */ async sendMessageStream(request, requestOptions = {}) {
        var _a, _b, _c, _d, _e, _f;
        await this._sendPromise;
        const newContent = formatNewContent(request);
        const generateContentRequest = {
            safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
            generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
            tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
            toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
            systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
            cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
            contents: [
                ...this._history,
                newContent
            ]
        };
        const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions);
        // Add onto the chain.
        this._sendPromise = this._sendPromise.then(()=>streamPromise)// This must be handled to avoid unhandled rejection, but jump
        // to the final catch block with a label to not log this error.
        .catch((_ignored)=>{
            throw new Error(SILENT_ERROR);
        }).then((streamResult)=>streamResult.response).then((response)=>{
            if (isValidResponse(response)) {
                this._history.push(newContent);
                const responseContent = Object.assign({}, response.candidates[0].content);
                // Response seems to come back without a role set.
                if (!responseContent.role) {
                    responseContent.role = "model";
                }
                this._history.push(responseContent);
            } else {
                const blockErrorMessage = formatBlockErrorMessage(response);
                if (blockErrorMessage) {
                    console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                }
            }
        }).catch((e)=>{
            // Errors in streamPromise are already catchable by the user as
            // streamPromise is returned.
            // Avoid duplicating the error message in logs.
            if (e.message !== SILENT_ERROR) {
                // Users do not have access to _sendPromise to catch errors
                // downstream from streamPromise, so they should not throw.
                console.error(e);
            }
        });
        return streamPromise;
    }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function countTokens(apiKey, model, params, singleRequestOptions) {
    const response = await makeModelRequest(model, Task.COUNT_TOKENS, apiKey, false, JSON.stringify(params), singleRequestOptions);
    return response.json();
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ async function embedContent(apiKey, model, params, requestOptions) {
    const response = await makeModelRequest(model, Task.EMBED_CONTENT, apiKey, false, JSON.stringify(params), requestOptions);
    return response.json();
}
async function batchEmbedContents(apiKey, model, params, requestOptions) {
    const requestsWithModel = params.requests.map((request)=>{
        return Object.assign(Object.assign({}, request), {
            model
        });
    });
    const response = await makeModelRequest(model, Task.BATCH_EMBED_CONTENTS, apiKey, false, JSON.stringify({
        requests: requestsWithModel
    }), requestOptions);
    return response.json();
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Class for generative model APIs.
 * @public
 */ class GenerativeModel {
    constructor(apiKey, modelParams, _requestOptions = {}){
        this.apiKey = apiKey;
        this._requestOptions = _requestOptions;
        if (modelParams.model.includes("/")) {
            // Models may be named "models/model-name" or "tunedModels/model-name"
            this.model = modelParams.model;
        } else {
            // If path is not included, assume it's a non-tuned model.
            this.model = `models/${modelParams.model}`;
        }
        this.generationConfig = modelParams.generationConfig || {};
        this.safetySettings = modelParams.safetySettings || [];
        this.tools = modelParams.tools;
        this.toolConfig = modelParams.toolConfig;
        this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
        this.cachedContent = modelParams.cachedContent;
    }
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */ async generateContent(request, requestOptions = {}) {
        var _a;
        const formattedParams = formatGenerateContentInput(request);
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return generateContent(this.apiKey, this.model, Object.assign({
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name
        }, formattedParams), generativeModelRequestOptions);
    }
    /**
     * Makes a single streaming call to the model and returns an object
     * containing an iterable stream that iterates over all chunks in the
     * streaming response as well as a promise that returns the final
     * aggregated response.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */ async generateContentStream(request, requestOptions = {}) {
        var _a;
        const formattedParams = formatGenerateContentInput(request);
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return generateContentStream(this.apiKey, this.model, Object.assign({
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name
        }, formattedParams), generativeModelRequestOptions);
    }
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */ startChat(startChatParams) {
        var _a;
        return new ChatSession(this.apiKey, this.model, Object.assign({
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name
        }, startChatParams), this._requestOptions);
    }
    /**
     * Counts the tokens in the provided request.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */ async countTokens(request, requestOptions = {}) {
        const formattedParams = formatCountTokensInput(request, {
            model: this.model,
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            cachedContent: this.cachedContent
        });
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return countTokens(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
    }
    /**
     * Embeds the provided content.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */ async embedContent(request, requestOptions = {}) {
        const formattedParams = formatEmbedContentInput(request);
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return embedContent(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
    }
    /**
     * Embeds an array of {@link EmbedContentRequest}s.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */ async batchEmbedContents(batchEmbedContentRequest, requestOptions = {}) {
        const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
        return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, generativeModelRequestOptions);
    }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Top-level class for this SDK
 * @public
 */ class GoogleGenerativeAI {
    constructor(apiKey){
        this.apiKey = apiKey;
    }
    /**
     * Gets a {@link GenerativeModel} instance for the provided model name.
     */ getGenerativeModel(modelParams, requestOptions) {
        if (!modelParams.model) {
            throw new GoogleGenerativeAIError(`Must provide a model name. ` + `Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
        }
        return new GenerativeModel(this.apiKey, modelParams, requestOptions);
    }
    /**
     * Creates a {@link GenerativeModel} instance from provided content cache.
     */ getGenerativeModelFromCachedContent(cachedContent, modelParams, requestOptions) {
        if (!cachedContent.name) {
            throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `name` field.");
        }
        if (!cachedContent.model) {
            throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
        }
        /**
         * Not checking tools and toolConfig for now as it would require a deep
         * equality comparison and isn't likely to be a common case.
         */ const disallowedDuplicates = [
            "model",
            "systemInstruction"
        ];
        for (const key of disallowedDuplicates){
            if ((modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) && cachedContent[key] && (modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) !== cachedContent[key]) {
                if (key === "model") {
                    const modelParamsComp = modelParams.model.startsWith("models/") ? modelParams.model.replace("models/", "") : modelParams.model;
                    const cachedContentComp = cachedContent.model.startsWith("models/") ? cachedContent.model.replace("models/", "") : cachedContent.model;
                    if (modelParamsComp === cachedContentComp) {
                        continue;
                    }
                }
                throw new GoogleGenerativeAIRequestInputError(`Different value for "${key}" specified in modelParams` + ` (${modelParams[key]}) and cachedContent (${cachedContent[key]})`);
            }
        }
        const modelParamsFromCache = Object.assign(Object.assign({}, modelParams), {
            model: cachedContent.model,
            tools: cachedContent.tools,
            toolConfig: cachedContent.toolConfig,
            systemInstruction: cachedContent.systemInstruction,
            cachedContent
        });
        return new GenerativeModel(this.apiKey, modelParamsFromCache, requestOptions);
    }
}
;
 //# sourceMappingURL=index.mjs.map
}}),

};

//# sourceMappingURL=_76fff9f7._.js.map