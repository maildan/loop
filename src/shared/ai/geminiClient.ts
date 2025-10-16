// 🔥 Gemini AI API 클라이언트 - Google AI SDK 사용
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Logger } from '../logger';

export interface GeminiConfig {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
}

export interface GeminiRequest {
    prompt: string;
    context?: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
}

export interface GeminiResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason: 'stop' | 'length' | 'content_filter' | 'other';
    metadata?: {
        model: string;
        timestamp: string;
        requestId?: string;
    };
}

export interface IGeminiError {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
}

const GEMINI_ENV_KEYS = ['GEMINI_API_KEY'] as const;
export type GeminiEnvKey = (typeof GEMINI_ENV_KEYS)[number];
export type EnvStatus = 'set' | 'missing';

export interface GeminiApiKeyResolution {
    apiKey: string | null;
    source: GeminiEnvKey | null;
    statuses: Record<GeminiEnvKey, EnvStatus>;
}

function getEnvValue(key: string): string | undefined {
    const fromProcess = typeof process !== 'undefined' ? process.env?.[key] : undefined;
    if (typeof fromProcess === 'string' && fromProcess.trim().length > 0) {
        return fromProcess.trim();
    }

    const loopRendererEnv = (globalThis as { __LOOP_RENDERER_ENV__?: Record<string, unknown> }).__LOOP_RENDERER_ENV__;
    const fromGlobal = loopRendererEnv?.[key];
    if (typeof fromGlobal === 'string' && fromGlobal.trim().length > 0) {
        return (fromGlobal as string).trim();
    }

    return undefined;
}

function resolveGeminiApiKey(): GeminiApiKeyResolution {
    const statuses = {} as Record<GeminiEnvKey, EnvStatus>;
    let apiKey: string | null = null;
    let source: GeminiEnvKey | null = null;

    for (const key of GEMINI_ENV_KEYS) {
        const value = getEnvValue(key);
        if (value) {
            statuses[key] = 'set';
            if (!apiKey) {
                apiKey = value;
                source = key;
            }
        } else {
            statuses[key] = 'missing';
        }
    }

    return { apiKey, source, statuses };
}

export function getGeminiEnvDiagnostics(): { hasApiKey: boolean; source: GeminiEnvKey | null; statuses: Record<GeminiEnvKey, EnvStatus> } {
    const { apiKey, source, statuses } = resolveGeminiApiKey();
    return {
        hasApiKey: Boolean(apiKey),
        source,
        statuses
    };
}

function parseInteger(value: string | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseFloatSafe(value: string | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

// 🔥 Gemini API 클라이언트 - Google AI SDK 기반
export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private config: GeminiConfig;

    constructor(config: GeminiConfig) {
        this.config = {
            model: 'gemini-2.5-flash',
            maxTokens: 4096,
            temperature: 0.7,
            ...config
        };

        try {
            this.genAI = new GoogleGenerativeAI(this.config.apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: this.config.model || 'gemini-1.5-flash',
                generationConfig: {
                    maxOutputTokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                }
            });

            Logger.info('GEMINI_CLIENT', `Initialized with model: ${this.config.model}`);
        } catch (error) {
            Logger.error('GEMINI_CLIENT', 'Failed to initialize', error);
            throw new GeminiError('INITIALIZATION_ERROR', 'Failed to initialize Gemini client', error, false);
        }
    }

    async generateText(request: GeminiRequest): Promise<GeminiResponse> {
        const startTime = Date.now();

        try {
            Logger.debug('GEMINI_CLIENT', 'Generating text', {
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

            const geminiResponse: GeminiResponse = {
                content,
                usage,
                finishReason,
                metadata: {
                    model: this.config.model || 'gemini-1.5-flash',
                    timestamp: new Date().toISOString(),
                    requestId: `req_${Date.now()}_${crypto.randomUUID ? crypto.randomUUID().substring(0, 8) : Date.now().toString(36)}`
                }
            };

            Logger.info('GEMINI_CLIENT', 'Text generation completed', {
                duration: Date.now() - startTime,
                contentLength: content.length,
                finishReason,
                tokensUsed: usage?.totalTokens || 0
            });

            return geminiResponse;

        } catch (error: any) {
            Logger.error('GEMINI_CLIENT', 'Text generation failed', {
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
    async analyzeStoryStructure(storyContent: string, analysisType: string = 'comprehensive'): Promise<GeminiResponse> {
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

    async generateStoryIdeas(genre: string, themes: string[], wordCount: number = 500): Promise<GeminiResponse> {
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

    async improveDialogue(dialogue: string, characterContext: string): Promise<GeminiResponse> {
        const systemPrompt = `당신은 전문 작가이자 대화 개선 전문가입니다. 
한국 문학의 깊이와 현대적 감각을 모두 갖춘 자연스럽고 매력적인 대화를 작성해주세요.`;

        const dialoguePrompt = `
캐릭터 컨텍스트: ${characterContext}

개선할 대화:
${dialogue}

다음 관점에서 대화를 개선해주세요:
1. 자연스러운 한국어 말투 (세대별, 상황별 적절성)
2. 캐릭터만의 독특한 어조와 개성 부여
3. 갈등과 긴장감을 높이는 대화 구조
4. 불필요한 설명 대신 함축적 표현 활용
5. 서브텍스트와 행간의 의미 강화
6. 감정의 층위와 복잡성 표현

개선된 대화와 함께 구체적인 변경 사유 및 작가 팁을 제공해주세요.
        `;

        return this.generateText({
            prompt: dialoguePrompt,
            systemPrompt,
            temperature: 0.6
        });
    }

    // 🔥 작가 전용 기능: 캐릭터 심화 분석
    async analyzeCharacterDepth(character: any): Promise<GeminiResponse> {
        const systemPrompt = `당신은 캐릭터 창조 전문가입니다. 
입체적이고 매력적인 캐릭터 개발을 위한 깊이 있는 분석과 조언을 제공합니다.`;

        const characterPrompt = `
캐릭터 정보:
이름: ${character.name || '미정'}
역할: ${character.role || '미정'}
설명: ${character.description || '기본 설명 없음'}

다음을 분석하고 개선 방안을 제시해주세요:
1. 캐릭터의 심리적 동기와 내적 갈등
2. 성격의 모순과 복합성
3. 성장 가능성과 변화 궤도
4. 다른 캐릭터와의 화학적 관계성
5. 독자 몰입을 높이는 매력 포인트
6. 스토리 전체에서의 기능과 역할

구체적인 개선 제안과 함께 캐릭터 개발 로드맵을 제공해주세요.
        `;

        return this.generateText({
            prompt: characterPrompt,
            systemPrompt,
            temperature: 0.7
        });
    }

    // 🔥 작가 전용 기능: 플롯 홀 탐지 및 해결
    async detectPlotHoles(storyContent: string, chapters: any[]): Promise<GeminiResponse> {
        const systemPrompt = `당신은 스토리 구조 전문가입니다. 
플롯의 논리적 결함을 찾아내고 창의적인 해결책을 제시합니다.`;

        const analysisPrompt = `
스토리 내용:
${storyContent}

챕터 구조:
${chapters.map((ch, idx) => `${idx + 1}. ${ch.title}: ${ch.content?.substring(0, 200)}...`).join('\n')}

다음을 체크하고 문제점을 지적해주세요:
1. 시간적 일관성 (타임라인 오류)
2. 인과관계의 논리성
3. 캐릭터 동기의 일관성
4. 설정과 세계관의 모순
5. 복선과 회수의 완결성
6. 감정적 흐름의 자연스러움

각 문제점에 대해 구체적인 수정 방안을 제시해주세요.
        `;

        return this.generateText({
            prompt: analysisPrompt,
            systemPrompt,
            temperature: 0.4
        });
    }

    // � GenerativeModel 인스턴스 접근 (Streaming 용)
    getModel(): GenerativeModel {
        return this.model;
    }

    // �📊 사용량 및 상태 확인
    async checkStatus(): Promise<{ status: string; model: string; available: boolean }> {
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
            Logger.warn('GEMINI_CLIENT', 'Status check failed', error);
            return {
                status: 'error',
                model: this.config.model || 'gemini-1.5-flash',
                available: false
            };
        }
    }

    // 🔧 헬퍼 메서드들
    private mapFinishReason(reason: any): 'stop' | 'length' | 'content_filter' | 'other' {
        switch (reason) {
            case 'STOP': return 'stop';
            case 'MAX_TOKENS': return 'length';
            case 'SAFETY': return 'content_filter';
            case 'RECITATION': return 'content_filter';
            default: return 'other';
        }
    }

    // 설정 업데이트
    updateConfig(newConfig: Partial<GeminiConfig>): void {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.model) {
            this.model = this.genAI.getGenerativeModel({
                model: newConfig.model,
                generationConfig: {
                    maxOutputTokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                }
            });
            Logger.info('GEMINI_CLIENT', `Model updated to: ${newConfig.model}`);
        }
    }
}

// 🔥 GeminiError 클래스
export class GeminiError extends Error implements IGeminiError {
    public code: string;
    public details?: any;
    public retryable: boolean;

    constructor(code: string, message: string, details?: any, retryable: boolean = false) {
        super(message);
        this.name = 'GeminiError';
        this.code = code;
        this.details = details;
        this.retryable = retryable;
    }
}

// 🔥 싱글톤 인스턴스 관리
let geminiClient: GeminiClient | null = null;

export function getGeminiClient(): GeminiClient {
    if (!geminiClient) {
        const { apiKey, source, statuses } = resolveGeminiApiKey();

        if (!apiKey) {
            const diagnosticMessage = [
                'Gemini API 키를 찾을 수 없습니다.',
                '환경변수 GEMINI_API_KEY를 설정해주세요.',
                '',
                `현재 상태:
  - GEMINI_API_KEY: ${statuses.GEMINI_API_KEY}`,
                '',
                '자세한 설정 방법은 docs/ENVIRONMENT_VARIABLES.md 파일을 참고하세요.'
            ].join('\n');

            throw new GeminiError('MISSING_API_KEY', diagnosticMessage, { env: statuses }, false);
        }

        const model = getEnvValue('GEMINI_MODEL') || 'gemini-2.5-flash';
        const maxTokens = parseInteger(getEnvValue('GEMINI_MAX_TOKENS'), 4096);
        const temperature = parseFloatSafe(getEnvValue('GEMINI_TEMPERATURE'), 0.7);

        geminiClient = new GeminiClient({
            apiKey,
            model,
            maxTokens,
            temperature
        });

        Logger.info('GEMINI_CLIENT', 'Singleton instance created', { source, envStatus: statuses });
    }
    return geminiClient;
}

// 편의 함수들
export async function generateText(prompt: string, context?: string): Promise<string> {
    const client = getGeminiClient();
    const response = await client.generateText({ prompt, context });
    return response.content;
}

export async function analyzeStory(content: string, type: string = 'comprehensive'): Promise<string> {
    const client = getGeminiClient();
    const response = await client.analyzeStoryStructure(content, type);
    return response.content;
}
