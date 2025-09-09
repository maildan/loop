// 🔥 AI Analysis Service - 각 뷰에서 사용할 공통 AI 분석 서비스
import { getGeminiClient, type GeminiResponse } from '../ai/geminiClient';
import { performAIStoryAnalysis, type AIEnhancedAnalysisResult } from '../narrative/aiEnhancedAnalyzer';
import type { NCPNarrativeStructure } from '../narrative/ncpAnalyzer';
import { Logger } from '../logger';

// Prisma 타입 (실제로는 @prisma/client에서 import)
interface AIAnalysisRecord {
    id: string;
    projectId: string;
    analysisType: string;
    inputData: string;
    response: string;
    metadata?: any;
    confidence?: number;
    status: 'completed' | 'pending' | 'failed';
    createdAt: Date;
}

export interface AnalysisRequest {
    projectId: string;
    type: 'timeline' | 'outline' | 'mindmap' | 'synopsis' | 'comprehensive';
    data: any;
    context?: {
        content?: string;
        characters?: any[];
        plotPoints?: any[];
        themes?: string[];
        genre?: string;
        targetAudience?: string;
    };
}

export interface AnalysisResponse<T = any> {
    id: string;
    type: string;
    result: T;
    confidence: number;
    suggestions: string[];
    metadata: {
        processingTime: number;
        tokenUsage?: {
            input: number;
            output: number;
            total: number;
        };
        model: string;
        timestamp: string;
    };
}

export interface TimelineAnalysisResult {
    coherence: {
        score: number; // 0-100
        issues: string[];
        suggestions: string[];
    };
    pacing: {
        score: number;
        analysis: string;
        improvements: string[];
    };
    causality: {
        score: number;
        brokenLinks: Array<{
            from: string;
            to: string;
            issue: string;
        }>;
        suggestions: string[];
    };
    structure: {
        acts: Array<{
            name: string;
            start: number;
            end: number;
            quality: number;
        }>;
        balance: number;
        recommendations: string[];
    };
}

export interface OutlineAnalysisResult {
    structure: {
        score: number;
        balance: string;
        missing: string[];
        redundant: string[];
    };
    flow: {
        score: number;
        transitions: Array<{
            from: string;
            to: string;
            quality: number;
            suggestion?: string;
        }>;
    };
    content: {
        depth: number;
        clarity: number;
        completeness: number;
        suggestions: string[];
    };
    engagement: {
        hooks: string[];
        payoffs: string[];
        improvements: string[];
    };
}

export interface MindmapAnalysisResult {
    connections: {
        score: number;
        strongConnections: Array<{
            from: string;
            to: string;
            strength: number;
            type: string;
        }>;
        missingConnections: Array<{
            suggested: string;
            reason: string;
        }>;
    };
    themes: {
        identified: Array<{
            theme: string;
            relevance: number;
            elements: string[];
        }>;
        suggestions: string[];
    };
    development: {
        priorities: Array<{
            idea: string;
            priority: number;
            reason: string;
        }>;
        expansions: string[];
    };
    creativity: {
        score: number;
        uniqueElements: string[];
        improvements: string[];
    };
}

class AIAnalysisService {
    private geminiClient = getGeminiClient();
    private analysisCache = new Map<string, AnalysisResponse>();

    constructor() {
        Logger.info('AI_ANALYSIS_SERVICE', 'Initialized');
    }

    // 🔥 타임라인 분석
    async analyzeTimeline(request: AnalysisRequest): Promise<AnalysisResponse<TimelineAnalysisResult>> {
        const startTime = Date.now();
        Logger.info('AI_ANALYSIS_SERVICE', 'Starting timeline analysis', { projectId: request.projectId });

        try {
            const cacheKey = this.generateCacheKey(request);
            if (this.analysisCache.has(cacheKey)) {
                Logger.debug('AI_ANALYSIS_SERVICE', 'Returning cached timeline analysis');
                return this.analysisCache.get(cacheKey)!;
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

            const response: AnalysisResponse<TimelineAnalysisResult> = {
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

            Logger.info('AI_ANALYSIS_SERVICE', 'Timeline analysis completed', {
                duration: Date.now() - startTime,
                confidence: response.confidence
            });

            return response;
        } catch (error) {
            Logger.error('AI_ANALYSIS_SERVICE', 'Timeline analysis failed', error);
            throw new Error(`타임라인 분석 실패: ${error}`);
        }
    }

    // 🔥 아웃라인 분석
    async analyzeOutline(request: AnalysisRequest): Promise<AnalysisResponse<OutlineAnalysisResult>> {
        const startTime = Date.now();
        Logger.info('AI_ANALYSIS_SERVICE', 'Starting outline analysis', { projectId: request.projectId });

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

            const response: AnalysisResponse<OutlineAnalysisResult> = {
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
            Logger.info('AI_ANALYSIS_SERVICE', 'Outline analysis completed', {
                duration: Date.now() - startTime
            });

            return response;
        } catch (error) {
            Logger.error('AI_ANALYSIS_SERVICE', 'Outline analysis failed', error);
            throw new Error(`아웃라인 분석 실패: ${error}`);
        }
    }

    // 🔥 마인드맵 분석
    async analyzeMindmap(request: AnalysisRequest): Promise<AnalysisResponse<MindmapAnalysisResult>> {
        const startTime = Date.now();
        Logger.info('AI_ANALYSIS_SERVICE', 'Starting mindmap analysis', { projectId: request.projectId });

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

            const response: AnalysisResponse<MindmapAnalysisResult> = {
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
            Logger.info('AI_ANALYSIS_SERVICE', 'Mindmap analysis completed', {
                duration: Date.now() - startTime
            });

            return response;
        } catch (error) {
            Logger.error('AI_ANALYSIS_SERVICE', 'Mindmap analysis failed', error);
            throw new Error(`마인드맵 분석 실패: ${error}`);
        }
    }

    // 🔥 종합 분석 (모든 요소 포함)
    async performComprehensiveAnalysis(request: AnalysisRequest): Promise<AnalysisResponse<AIEnhancedAnalysisResult>> {
        const startTime = Date.now();
        Logger.info('AI_ANALYSIS_SERVICE', 'Starting comprehensive analysis', { projectId: request.projectId });

        try {
            // NCP 구조 생성 (기본값)
            const ncpStructure: NCPNarrativeStructure = {
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

            const result = await performAIStoryAnalysis(
                ncpStructure,
                request.context?.content || '',
                request.context?.characters || [],
                request.context?.plotPoints || [],
                request.context ? JSON.stringify(request.context) : undefined
            );

            const response: AnalysisResponse<AIEnhancedAnalysisResult> = {
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
            Logger.info('AI_ANALYSIS_SERVICE', 'Comprehensive analysis completed', {
                duration: Date.now() - startTime,
                grade: result.overallAssessment.grade
            });

            return response;
        } catch (error) {
            Logger.error('AI_ANALYSIS_SERVICE', 'Comprehensive analysis failed', error);
            throw new Error(`종합 분석 실패: ${error}`);
        }
    }

    // 🔧 유틸리티 메서드들
    private convertTokenUsage(geminiUsage: any): { input: number; output: number; total: number } | undefined {
        if (!geminiUsage) return undefined;

        return {
            input: geminiUsage.promptTokens || geminiUsage.inputTokens || 0,
            output: geminiUsage.completionTokens || geminiUsage.outputTokens || 0,
            total: geminiUsage.totalTokens || (geminiUsage.promptTokens || 0) + (geminiUsage.completionTokens || 0)
        };
    }

    private prepareTimelineData(data: any) {
        return Array.isArray(data) ? data.map((item, index) => ({
            order: index + 1,
            title: item.title || item.name || `Event ${index + 1}`,
            description: item.description || item.content || '',
            type: item.type || 'event',
            timestamp: item.timestamp || item.createdAt,
            duration: item.duration || 0
        })) : [];
    }

    private prepareOutlineData(data: any) {
        return Array.isArray(data) ? data.map((item, index) => ({
            section: index + 1,
            title: item.title || `Section ${index + 1}`,
            content: item.description || item.content || '',
            type: item.type || 'section',
            depth: item.depth || 0,
            wordCount: item.wordCount || 0
        })) : [];
    }

    private prepareMindmapData(data: any) {
        return {
            nodes: data.nodes || [],
            connections: data.edges || data.connections || [],
            centralTheme: data.centralTheme || '중심 아이디어',
            categories: data.categories || []
        };
    }

    private buildContextualPrompt(context?: AnalysisRequest['context']): string {
        if (!context) return '';

        let prompt = '\n[추가 컨텍스트]\n';
        if (context.genre) prompt += `장르: ${context.genre}\n`;
        if (context.targetAudience) prompt += `타겟 독자: ${context.targetAudience}\n`;
        if (context.themes?.length) prompt += `주요 테마: ${context.themes.join(', ')}\n`;
        if (context.characters?.length) prompt += `등장인물: ${context.characters.map(c => c.name || c.title).join(', ')}\n`;

        return prompt;
    }

    private parseTimelineResponse(content: string): TimelineAnalysisResult {
        try {
            return JSON.parse(content);
        } catch (error) {
            Logger.warn('AI_ANALYSIS_SERVICE', 'Failed to parse timeline JSON, using fallback');
            return this.createFallbackTimelineResult(content);
        }
    }

    private parseOutlineResponse(content: string): OutlineAnalysisResult {
        try {
            return JSON.parse(content);
        } catch (error) {
            Logger.warn('AI_ANALYSIS_SERVICE', 'Failed to parse outline JSON, using fallback');
            return this.createFallbackOutlineResult(content);
        }
    }

    private parseMindmapResponse(content: string): MindmapAnalysisResult {
        try {
            return JSON.parse(content);
        } catch (error) {
            Logger.warn('AI_ANALYSIS_SERVICE', 'Failed to parse mindmap JSON, using fallback');
            return this.createFallbackMindmapResult(content);
        }
    }

    private createFallbackTimelineResult(content: string): TimelineAnalysisResult {
        const score = this.extractScoreFromText(content);
        return {
            coherence: { score, issues: ['분석 파싱 오류'], suggestions: ['재분석 필요'] },
            pacing: { score, analysis: content.slice(0, 200), improvements: ['추가 분석 필요'] },
            causality: { score, brokenLinks: [], suggestions: ['세부 분석 필요'] },
            structure: { acts: [], balance: score, recommendations: ['구조 재검토'] }
        };
    }

    private createFallbackOutlineResult(content: string): OutlineAnalysisResult {
        const score = this.extractScoreFromText(content);
        return {
            structure: { score, balance: '분석 중', missing: [], redundant: [] },
            flow: { score, transitions: [] },
            content: { depth: score, clarity: score, completeness: score, suggestions: ['추가 분석 필요'] },
            engagement: { hooks: [], payoffs: [], improvements: ['재분석 필요'] }
        };
    }

    private createFallbackMindmapResult(content: string): MindmapAnalysisResult {
        const score = this.extractScoreFromText(content);
        return {
            connections: { score, strongConnections: [], missingConnections: [] },
            themes: { identified: [], suggestions: ['테마 분석 필요'] },
            development: { priorities: [], expansions: ['확장 가능성 분석 중'] },
            creativity: { score, uniqueElements: [], improvements: ['창의성 개선 분석 중'] }
        };
    }

    private extractScoreFromText(content: string): number {
        const scoreMatch = content.match(/(\d+)점|(\d+)\/100|score.*?(\d+)/i);
        return scoreMatch ? parseInt((scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) || '75') : 75;
    }

    private calculateConfidence(aiResponse: GeminiResponse): number {
        // 응답 품질 기반 신뢰도 계산
        let confidence = 0.8; // 기본값

        if (aiResponse.finishReason === 'stop') confidence += 0.1;
        if (aiResponse.content.length > 500) confidence += 0.05;
        if (aiResponse.usage && aiResponse.usage.totalTokens > 1000) confidence += 0.05;

        return Math.min(confidence, 1.0);
    }

    private extractSuggestions(result: any): string[] {
        const suggestions: string[] = [];

        // 결과 객체에서 suggestions, improvements, recommendations 등을 재귀적으로 찾아서 추출
        const extractFromObject = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;

            Object.values(obj).forEach(value => {
                if (Array.isArray(value)) {
                    value.forEach(item => {
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

    private generateAnalysisId(): string {
        return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateCacheKey(request: AnalysisRequest): string {
        return `${request.type}_${request.projectId}_${JSON.stringify(request.data).slice(0, 100)}`;
    }

    private async saveAnalysisToDatabase(request: AnalysisRequest, response: AnalysisResponse): Promise<void> {
        try {
            // 실제로는 Prisma를 통해 데이터베이스에 저장
            Logger.debug('AI_ANALYSIS_SERVICE', 'Saving analysis to database', {
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
            Logger.error('AI_ANALYSIS_SERVICE', 'Failed to save analysis to database', error);
            // 저장 실패해도 분석 결과는 반환
        }
    }
}

// 🔥 싱글톤 인스턴스
let aiAnalysisService: AIAnalysisService | null = null;

export function getAIAnalysisService(): AIAnalysisService {
    if (!aiAnalysisService) {
        aiAnalysisService = new AIAnalysisService();
    }
    return aiAnalysisService;
}

// 🔥 편의 함수들
export async function analyzeTimeline(projectId: string, timelineData: any[], context?: AnalysisRequest['context']): Promise<AnalysisResponse<TimelineAnalysisResult>> {
    const service = getAIAnalysisService();
    return service.analyzeTimeline({
        projectId,
        type: 'timeline',
        data: timelineData,
        context
    });
}

export async function analyzeOutline(projectId: string, outlineData: any[], context?: AnalysisRequest['context']): Promise<AnalysisResponse<OutlineAnalysisResult>> {
    const service = getAIAnalysisService();
    return service.analyzeOutline({
        projectId,
        type: 'outline',
        data: outlineData,
        context
    });
}

export async function analyzeMindmap(projectId: string, mindmapData: any, context?: AnalysisRequest['context']): Promise<AnalysisResponse<MindmapAnalysisResult>> {
    const service = getAIAnalysisService();
    return service.analyzeMindmap({
        projectId,
        type: 'mindmap',
        data: mindmapData,
        context
    });
}
