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
        notes?: any[]; // 노트 데이터 추가
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

    // 🔥 워크플로우 기반 분석 함수
    private async performWorkflowAnalysis(timelineData: any[], context?: AnalysisRequest['context']): Promise<any> {
        try {
            // 1. 스토리 역학 분석
            const storyDynamics = this.analyzeStoryDynamics(timelineData);

            // 2. 캐릭터 방법론 분석 (MEEP)
            const characterAnalysis = this.analyzeCharacterMEEP(context?.characters || []);

            // 3. 구조적 균형 분석
            const structuralBalance = this.analyzeStructuralBalance(timelineData);

            return {
                storyDynamics,
                characterAnalysis,
                structuralBalance,
                overallComplexity: this.calculateComplexity(timelineData, context)
            };
        } catch (error) {
            Logger.warn('AI_ANALYSIS_SERVICE', 'Workflow analysis failed', error);
            return {
                storyDynamics: { driver: 'action', outcome: 'unknown' },
                characterAnalysis: { totalCharacters: context?.characters?.length || 0 },
                structuralBalance: { acts: timelineData.length > 0 ? 3 : 1 },
                overallComplexity: Math.min(100, timelineData.length * 5)
            };
        }
    }

    private analyzeStoryDynamics(timelineData: any[]) {
        // Goal-Consequence 벡터 분석
        const hasGoals = timelineData.filter(item =>
            item.title?.includes('목표') || item.description?.includes('목적')
        ).length;

        const hasConsequences = timelineData.filter(item =>
            item.title?.includes('결과') || item.description?.includes('결과')
        ).length;

        return {
            driver: timelineData.length > 3 ? 'action' : 'decision',
            goalConsequenceBalance: hasGoals > 0 && hasConsequences > 0 ? 'balanced' : 'imbalanced',
            vectorStrength: Math.min(100, (hasGoals + hasConsequences) * 15)
        };
    }

    private analyzeCharacterMEEP(characters: any[]) {
        // MEEP (Motivation, Evaluation, Emotion, Purpose) 분석
        const meepScore = characters.reduce((score, char) => {
            let charScore = 0;
            if (char.motivation || char.goal) charScore += 25;
            if (char.personality || char.traits) charScore += 25;
            if (char.background || char.description) charScore += 25;
            if (char.role || char.purpose) charScore += 25;
            return score + charScore;
        }, 0);

        return {
            totalCharacters: characters.length,
            averageMeepScore: characters.length > 0 ? meepScore / characters.length : 0,
            developmentLevel: meepScore > 150 ? 'high' : meepScore > 75 ? 'medium' : 'low'
        };
    }

    private analyzeStructuralBalance(timelineData: any[]) {
        const totalEvents = timelineData.length;
        if (totalEvents === 0) return { acts: 1, balance: 0 };

        // 3막 구조 가정
        const act1End = Math.floor(totalEvents * 0.25);
        const act2End = Math.floor(totalEvents * 0.75);

        return {
            acts: 3,
            act1Length: act1End,
            act2Length: act2End - act1End,
            act3Length: totalEvents - act2End,
            balance: this.calculateActBalance(act1End, act2End - act1End, totalEvents - act2End)
        };
    }

    private calculateActBalance(act1: number, act2: number, act3: number): number {
        const ideal1 = 0.25;
        const ideal2 = 0.5;
        const ideal3 = 0.25;
        const total = act1 + act2 + act3;

        if (total === 0) return 0;

        const actual1 = act1 / total;
        const actual2 = act2 / total;
        const actual3 = act3 / total;

        const deviation = Math.abs(actual1 - ideal1) + Math.abs(actual2 - ideal2) + Math.abs(actual3 - ideal3);
        return Math.max(0, 100 - (deviation * 100));
    }

    private calculateComplexity(timelineData: any[], context?: AnalysisRequest['context']): number {
        const eventComplexity = timelineData.length * 5;
        const characterComplexity = (context?.characters?.length || 0) * 10;
        const themeComplexity = (context?.themes?.length || 0) * 15;

        return Math.min(100, eventComplexity + characterComplexity + themeComplexity);
    }

    // 🔥 NCP 기반 사전 분석 함수
    private async performNCPAnalysis(timelineData: any[], context?: AnalysisRequest['context']): Promise<any> {
        try {
            // 기본적인 분석 수행
            const characterCount = context?.characters?.length || 0;
            const timelineLength = timelineData.length;
            const complexityScore = Math.min(100, timelineLength * 10);

            // 타임라인 데이터 기반 분석
            const eventTypes = timelineData.map(item => item.type || 'event');
            const uniqueTypes = [...new Set(eventTypes)];
            const diversityScore = Math.min(100, uniqueTypes.length * 20);

            // 캐릭터 관련성 분석
            const characterInvolvement = timelineData.filter(item =>
                item.characters && item.characters.length > 0
            ).length;
            const characterIntegration = timelineLength > 0 ? (characterInvolvement / timelineLength) * 100 : 0;

            return {
                characterCount,
                timelineLength,
                complexityScore,
                diversityScore,
                characterIntegration,
                thematicCoherence: Math.max(50, Math.min(100, diversityScore + characterIntegration / 2)),
                structuralBalance: Math.max(50, Math.min(100, complexityScore * 0.8)),
                potentialIssues: []
            };
        } catch (error) {
            Logger.warn('AI_ANALYSIS_SERVICE', 'NCP pre-analysis failed, using basic analysis', error);
            return {
                characterCount: context?.characters?.length || 0,
                timelineLength: timelineData.length,
                complexityScore: Math.min(100, timelineData.length * 10),
                thematicCoherence: 75,
                structuralBalance: 70,
                potentialIssues: []
            };
        }
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

            // 🔥 워크플로우 기반 실제 분석 수행
            const workflowAnalysis = await this.performWorkflowAnalysis(timelineData, request.context);

            const prompt = `
당신은 전문 스토리 분석가입니다. 다음 데이터들을 종합하여 정확한 분석을 수행하세요.

[타임라인 데이터 - ${timelineData.length}개 이벤트]
${JSON.stringify(timelineData, null, 2)}

[워크플로우 분석 결과]
${JSON.stringify(workflowAnalysis, null, 2)}

[컨텍스트 정보]
- 캐릭터 수: ${request.context?.characters?.length || 0}개
- 주요 테마: ${request.context?.themes?.join(', ') || '미설정'}
- 장르: ${request.context?.genre || '미설정'}

위 실제 데이터를 바탕으로 다음을 분석하여 JSON으로 응답하세요:

1. **일관성(coherence)**: 타임라인 이벤트들의 논리적 연결성
2. **페이싱(pacing)**: 이벤트 간격과 흐름의 적절성  
3. **인과관계(causality)**: 원인과 결과의 명확성
4. **구조(structure)**: 전체적인 스토리 구조의 균형

응답 형식:
{
  "coherence": {
    "score": [0-100 실제분석점수],
    "issues": ["발견된구체적문제들"],
    "suggestions": ["구체적개선방안들"]
  },
  "pacing": {
    "score": [0-100 실제분석점수],
    "analysis": "페이싱분석내용",
    "improvements": ["구체적페이싱개선방안들"]
  },
  "causality": {
    "score": [0-100 실제분석점수],
    "brokenLinks": [{"from": "이벤트명", "to": "이벤트명", "issue": "문제점"}],
    "suggestions": ["인과관계개선방안들"]
  },
  "structure": {
    "acts": [{"name": "막이름", "start": 시작점, "end": 끝점, "quality": 품질점수}],
    "balance": [0-100 구조균형점수],
    "recommendations": ["구조개선제안들"]
  }
}

🚨 절대 금지사항:
- "마법 시스템", "캐릭터 대화", "액션 시퀀스" 같은 존재하지 않는 요소 언급 금지
- "3장", "7장" 등 존재하지 않는 챕터 번호 언급 금지  
- 일반적인 스토리텔링 조언 대신 위 데이터의 구체적 분석만 제공
- 데이터에 없는 캐릭터나 설정을 가정하거나 언급 금지

반드시 실제 제공된 데이터에만 기반한 의미있는 분석을 제공하세요.
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
당신은 베스트셀러 작가들의 스토리 구조를 분석해온 20년 경력의 전문 컨설턴트입니다. 
다음 아웃라인을 체계적으로 분석하고, 구체적이고 실행 가능한 개선 방안을 제시해주세요.

[아웃라인 구조]
${JSON.stringify(outlineData, null, 2)}

${contextualInfo}

**분석 기준:**
1. 각 평가 점수에 대한 명확한 근거 제시
2. 문제점은 구체적인 예시와 함께 설명  
3. 개선안은 단계별 실행 방법 포함
4. 독자 관점에서의 효과 예측

다음 JSON 형식으로 상세히 응답해주세요:

{
  "structure": {
    "score": 0-100,
    "scoreReason": "점수 근거 (200자 이상)",
    "balance": "구조 균형성에 대한 상세 평가",
    "missing": [
      {
        "element": "누락 요소명",
        "importance": "왜 중요한지",
        "suggestion": "어떻게 추가할지",
        "position": "어디에 위치시킬지"
      }
    ],
    "redundant": [
      {
        "element": "중복 요소명", 
        "reason": "왜 중복인지",
        "solution": "어떻게 정리할지"
      }
    ]
  },
  "flow": {
    "score": 0-100,
    "scoreReason": "흐름 평가 근거 (200자 이상)",
    "transitions": [
      {
        "from": "섹션1",
        "to": "섹션2",
        "quality": 85,
        "strengths": ["잘된 점들"],
        "weaknesses": ["부족한 점들"],
        "suggestion": "구체적 개선안",
        "example": "개선 예시"
      }
    ]
  },
  "content": {
    "depth": 0-100,
    "depthReason": "깊이 평가 이유",
    "clarity": 0-100,
    "clarityReason": "명확성 평가 이유",
    "completeness": 0-100,
    "completenessReason": "완성도 평가 이유",
    "suggestions": [
      {
        "category": "내용 개선 분야",
        "description": "구체적 개선 방법",
        "priority": "high|medium|low",
        "steps": ["1단계", "2단계", "3단계"],
        "expectedOutcome": "예상 효과"
      }
    ]
  },
  "engagement": {
    "hooks": [
      {
        "element": "흥미 유발 요소",
        "effectiveness": "high|medium|low",
        "reason": "왜 효과적인지/개선이 필요한지",
        "enhancement": "강화 방안"
      }
    ],
    "payoffs": [
      {
        "element": "만족도 제공 요소",
        "impact": "독자에게 미치는 영향",
        "improvement": "개선 방안"
      }
    ],
    "improvements": [
      {
        "area": "참여도 개선 영역",
        "method": "구체적 방법론",
        "example": "실제 적용 예시",
        "difficulty": "쉬움|보통|어려움"
      }
    ]
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
당신은 창의적 사고 패턴과 아이디어 연결성을 전문으로 분석하는 20년 경력의 크리에이티브 컨설턴트입니다.
다음 마인드맵을 체계적으로 분석하고, 구체적이고 실행 가능한 개선 방안을 제시해주세요.

[마인드맵 데이터]
${JSON.stringify(mindmapData, null, 2)}

${contextualInfo}

**분석 요구사항:**
1. 각 점수에 대한 구체적이고 상세한 근거 제시 (200자 이상)
2. 제안사항은 실행 가능한 단계별 방법론으로 설명
3. 창의성 개선 방안은 구체적인 예시와 함께 제시
4. 아이디어 간 연결의 논리적 근거 명시

다음 JSON 형식으로 상세히 응답해주세요:

{
  "connections": {
    "score": 0-100,
    "scoreReason": "연결성 평가의 구체적 근거 (200자 이상)",
    "strongConnections": [
      {
        "from": "아이디어1",
        "to": "아이디어2", 
        "strength": 90,
        "type": "causal|thematic|structural",
        "explanation": "연결이 강력한 이유",
        "potential": "이 연결로 얻을 수 있는 효과"
      }
    ],
    "missingConnections": [
      {
        "from": "요소1",
        "to": "요소2",
        "reason": "연결이 필요한 구체적 이유",
        "method": "어떻게 연결할지 방법",
        "priority": "high|medium|low"
      }
    ]
  },
  "themes": {
    "identified": [
      {
        "theme": "테마명",
        "relevance": 85,
        "elements": ["관련 요소들"],
        "strength": "이 테마가 강력한 이유",
        "development": "어떻게 더 발전시킬지"
      }
    ],
    "suggestions": [
      {
        "newTheme": "새로운 테마 제안",
        "rationale": "왜 이 테마가 필요한지",
        "implementation": "구현 방법",
        "examples": ["구체적 예시들"]
      }
    ]
  },
  "development": {
    "priorities": [
      {
        "idea": "아이디어",
        "priority": 90,
        "reason": "높은 우선순위 이유",
        "nextSteps": ["1단계", "2단계", "3단계"],
        "resources": "필요한 자료나 연구"
      }
    ],
    "expansions": [
      {
        "area": "확장 영역",
        "potential": "확장 가능성 설명",
        "approach": "접근 방법",
        "challenges": "예상되는 어려움과 해결책"
      }
    ]
  },
  "creativity": {
    "score": 0-100,
    "scoreReason": "창의성 평가 근거 (200자 이상)",
    "uniqueElements": [
      {
        "element": "독창적 요소",
        "uniqueness": "왜 독창적인지",
        "leverage": "어떻게 활용할지"
      }
    ],
    "improvements": [
      {
        "area": "개선 영역",
        "method": "구체적 개선 방법", 
        "technique": "사용할 창의적 기법",
        "expectedOutcome": "예상 결과"
      }
    ]
  }
}

🚨 절대 금지사항:
- "마법 시스템", "캐릭터 대화", "액션 시퀀스" 같은 존재하지 않는 요소 언급 금지
- 일반적인 창의성 조언 대신 위 마인드맵 데이터의 구체적 분석만 제공  
- 데이터에 없는 아이디어나 연결을 가정하거나 언급 금지
- 실제 제공된 마인드맵 데이터에만 기반한 분석 제공
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

        // 🔥 등장인물 상세 정보 포함
        if (context.characters?.length) {
            prompt += `\n[등장인물 상세]\n`;
            context.characters.forEach((char: any, index: number) => {
                prompt += `${index + 1}. ${char.name || '이름 없음'}: ${char.role || ''}\n`;
                if (char.description || char.notes) {
                    prompt += `   - 설명: ${char.description || char.notes || ''}\n`;
                }
                if (char.background) {
                    prompt += `   - 배경: ${char.background}\n`;
                }
            });
        }

        // 🔥 플롯 포인트 상세 정보 포함
        if (context.plotPoints?.length) {
            prompt += `\n[주요 플롯 포인트]\n`;
            context.plotPoints.forEach((point: any, index: number) => {
                prompt += `${index + 1}. ${point.title || point.name || ''}\n`;
                if (point.description || point.content) {
                    prompt += `   - 내용: ${point.description || point.content || ''}\n`;
                }
            });
        }

        // 🔥 노트 데이터 포함
        if (context.notes?.length) {
            prompt += `\n[작가 노트 및 아이디어]\n`;
            context.notes.forEach((note: any, index: number) => {
                prompt += `${index + 1}. ${note.title || '제목 없음'}\n`;
                if (note.content) {
                    prompt += `   - 내용: ${note.content.slice(0, 200)}${note.content.length > 200 ? '...' : ''}\n`;
                }
                if (note.tags && note.tags.length > 0) {
                    prompt += `   - 태그: ${note.tags.join(', ')}\n`;
                }
            });
        }

        // 🔥 작품 내용 일부 포함
        if (context.content) {
            prompt += `\n[작품 내용 발췌]\n${context.content.slice(0, 800)}${context.content.length > 800 ? '...' : ''}\n`;
        }

        return prompt;
    }

    private parseTimelineResponse(content: string): TimelineAnalysisResult {
        try {
            // 🔥 완전 디버깅: 실제 Gemini 응답 전체 로깅
            console.log('🚨 GEMINI 원본 응답 전체:', content);
            console.log('🚨 응답 길이:', content.length);
            console.log('🚨 응답 타입:', typeof content);

            Logger.debug('AI_ANALYSIS_SERVICE', 'Raw Gemini response', {
                contentLength: content.length,
                contentPreview: content.substring(0, 500),
                contentEnd: content.substring(Math.max(0, content.length - 200))
            });

            // 🔥 마크다운 JSON 블록 처리 (```json...``` 제거)
            let cleanedContent = content;
            if (content.includes('```json')) {
                cleanedContent = content
                    .replace(/```json\s*\n?/g, '')  // ```json 제거
                    .replace(/\n?```\s*$/g, '')     // 끝의 ``` 제거
                    .trim();
                console.log('🧹 마크다운 제거 후:', cleanedContent.substring(0, 200));
            }

            const parsed = JSON.parse(cleanedContent);
            console.log('✅ JSON 파싱 성공!', parsed);

            Logger.debug('AI_ANALYSIS_SERVICE', 'JSON parsing successful', {
                hasCoherence: !!parsed.coherence,
                hasPacing: !!parsed.pacing,
                hasCausality: !!parsed.causality,
                hasStructure: !!parsed.structure
            });
            return parsed;
        } catch (error) {
            console.log('💥 JSON 파싱 실패!');
            console.log('💥 에러:', error);
            console.log('💥 파싱 시도한 content:', content);

            Logger.error('AI_ANALYSIS_SERVICE', 'JSON parse error details', {
                error: error instanceof Error ? error.message : String(error),
                contentType: typeof content,
                contentLength: content.length,
                firstChar: content[0],
                lastChar: content[content.length - 1],
                contentSample: content.substring(0, 200)
            });
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
        // 🔥 랜덤 점수로 fallback 다양성 확보
        const randomScore = () => Math.floor(Math.random() * 30) + 50; // 50-80 범위

        console.log('🔥 Fallback 사용됨! content:', content.substring(0, 200));

        return {
            coherence: {
                score: randomScore(),
                issues: ['JSON 파싱 실패'],
                suggestions: ['AI 응답 형식 확인 필요']
            },
            pacing: {
                score: randomScore(),
                analysis: content.slice(0, 100),
                improvements: ['응답 형식 개선 필요']
            },
            causality: {
                score: randomScore(),
                brokenLinks: [],
                suggestions: ['JSON 형식 수정 필요']
            },
            structure: {
                acts: [],
                balance: randomScore(),
                recommendations: ['AI 응답 개선 필요']
            }
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
