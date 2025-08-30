// 🔥 기가차드 OpenAI API 서비스 - 작가 친화적 AI 어시스턴트

import { Logger } from '../../shared/logger';
import { IpcResponse } from '../../shared/types';

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface OpenAIRequest {
  readonly message: string;
  readonly context?: string;
  readonly type?: 'chat' | 'writing' | 'analysis';
}

export interface OpenAIResponse {
  readonly response: string;
  readonly suggestions?: readonly string[];
  readonly analysis?: {
    readonly sentiment: string;
    readonly tone: string;
    readonly keywords: readonly string[];
  };
  readonly usage?: {
    readonly tokens: number;
    readonly cost: number;
  };
}

export interface OpenAIConfig {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
}

/**
 * 🔥 OpenAIService - 외부 OpenAI API 서버와 통신
 * Loop 전용 OpenAI API 서버에 연결하여 작가를 위한 AI 어시스턴트 기능 제공
 */
export class OpenAIService {
  private readonly componentName = 'OPENAI_SERVICE';
  private readonly config: OpenAIConfig;

  constructor(config: Partial<OpenAIConfig> = {}) {
    this.config = {
      apiUrl: 'https://loop-openai.onrender.com/api/chat',
      timeout: 60000, // 🔥 60초로 증가 (서버 응답 시간 고려)
      retries: 2, // 🔥 재시도 횟수 줄임 (더 빠른 실패)
      ...config,
    };

    Logger.info(this.componentName, 'OpenAI service initialized', {
      apiUrl: this.config.apiUrl,
      timeout: this.config.timeout,
    });
  }

  /**
   * 🔥 AI 채팅 메시지 전송
   */
  public async sendMessage(request: OpenAIRequest): Promise<IpcResponse<OpenAIResponse>> {
    const startTime = Date.now();
    
    try {
      Logger.debug(this.componentName, 'Sending message to OpenAI API', {
        messageLength: request.message.length,
        type: request.type || 'chat',
      });

      const response = await this.makeRequest(request);
      const duration = Date.now() - startTime;

      Logger.info(this.componentName, 'OpenAI API response received', {
        duration: `${duration}ms`,
        responseLength: response.response.length,
        hasSuggestions: !!response.suggestions,
      });

      return {
        success: true,
        data: response,
        timestamp: new Date(),
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      Logger.error(this.componentName, 'OpenAI API request failed', {
        error,
        duration: `${duration}ms`,
        message: request.message.substring(0, 100),
      });

      return {
        success: false,
        error: this.getErrorMessage(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 텍스트 분석 요청 (개선된 프롬프트)
   */
  public async analyzeText(text: string): Promise<IpcResponse<OpenAIResponse>> {
    const improvedPrompt = `당신은 전문 작가 어시스턴트입니다. 다음 텍스트를 분석하고 구체적인 개선점을 제시해주세요:

텍스트: "${text}"

다음 항목들을 분석해주세요:
1. 문장 구조와 가독성
2. 어조와 톤의 일관성  
3. 구체적인 개선 제안 (3-5개)
4. 강점과 약점

구체적이고 실행 가능한 피드백을 한국어로 제공해주세요.`;

    return this.sendMessage({
      message: improvedPrompt,
      type: 'analysis',
    });
  }

  /**
   * 🔥 글쓰기 도움 요청 (개선된 프롬프트)
   */
  public async getWritingHelp(prompt: string, context?: string): Promise<IpcResponse<OpenAIResponse>> {
    let improvedMessage: string;

    if (context) {
      improvedMessage = `당신은 전문 작가 어시스턴트입니다. 다음 컨텍스트를 바탕으로 구체적인 도움을 제공해주세요:

기존 글 컨텍스트:
"${context}"

작가의 요청:
"${prompt}"

다음과 같이 도움을 주세요:
1. 구체적이고 실용적인 조언
2. 예시 문장이나 표현 제안
3. 스타일과 톤 일관성 유지 방법
4. 즉시 적용 가능한 개선점

한국어로 상세하고 친근하게 답변해주세요.`;
    } else {
      improvedMessage = `당신은 전문 작가 어시스턴트입니다. 다음 요청에 대해 구체적이고 실용적인 도움을 제공해주세요:

요청: "${prompt}"

다음과 같이 도움을 주세요:
1. 단계별 접근 방법
2. 구체적인 예시와 템플릿
3. 주의사항과 팁
4. 추가 리소스나 참고사항

한국어로 상세하고 친근하게 답변해주세요.`;
    }

    return this.sendMessage({
      message: improvedMessage,
      type: 'writing',
      context,
    });
  }

  /**
   * 🔥 텍스트 개선 요청 (새로운 기능)
   */
  public async improveText(text: string, projectId?: string): Promise<IpcResponse<OpenAIResponse>> {
    const improvedPrompt = `당신은 전문 편집자입니다. 다음 텍스트를 더 자연스럽고 매력적으로 개선해주세요:

원본 텍스트:
"${text}"

개선 요청사항:
1. 문장 구조를 더 자연스럽게 만들어주세요
2. 어휘를 더 풍부하게 사용해주세요
3. 가독성을 높여주세요
4. 감정이나 분위기를 더 잘 전달하도록 해주세요

개선된 텍스트와 함께 어떤 부분이 왜 개선되었는지 간단히 설명해주세요.
한국어로 답변해주세요.`;

    return this.sendMessage({
      message: improvedPrompt,
      type: 'writing',
    });
  }

  /**
   * 🔥 프로젝트 컨텍스트 가져오기 (새로운 기능)
   */
  public async getProjectContext(projectId: string): Promise<IpcResponse<{ characters: string[], themes: string[], genre: string }>> {
    try {
      // 실제로는 프로젝트 데이터베이스에서 가져와야 하지만, 임시로 기본값 반환
      return {
        success: true,
        data: {
          characters: ['주인공', '조연'],
          themes: ['성장', '우정'],
          genre: '소설'
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: '프로젝트 컨텍스트를 가져올 수 없습니다',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 🔥 실제 API 요청 수행 (Primary + Fallback URL 지원)
   */
  private async makeRequest(request: OpenAIRequest): Promise<OpenAIResponse> {
    const primaryUrl = 'https://loop-openai.onrender.com/api/chat';
    const fallbackUrl = 'http://0.0.0.0:8080/api/chat';
    
    // 🔥 Primary URL 시도
    try {
      Logger.debug(this.componentName, 'Trying primary API endpoint', { url: primaryUrl });
      
      const response = await this.attemptRequest(primaryUrl, request);
      
      Logger.info(this.componentName, 'Primary API success', { 
        url: primaryUrl,
        responseLength: response.response.length 
      });
      
      return response;
      
    } catch (primaryError) {
      Logger.warn(this.componentName, 'Primary API failed, trying fallback', { 
        primaryUrl, 
        error: this.getErrorMessage(primaryError) 
      });
      
      // 🔥 Fallback URL 시도
      try {
        Logger.debug(this.componentName, 'Trying fallback API endpoint', { url: fallbackUrl });
        
        const response = await this.attemptRequest(fallbackUrl, request);
        
        Logger.info(this.componentName, 'Fallback API success', { 
          url: fallbackUrl,
          responseLength: response.response.length 
        });
        
        return response;
        
      } catch (fallbackError) {
        Logger.error(this.componentName, 'Both APIs failed', { 
          primaryError: this.getErrorMessage(primaryError),
          fallbackError: this.getErrorMessage(fallbackError) 
        });
        
        throw new Error(`모든 API 엔드포인트 실패 - Primary: ${this.getErrorMessage(primaryError)}, Fallback: ${this.getErrorMessage(fallbackError)}`);
      }
    }
  }

  /**
   * 🔥 단일 URL에 대한 요청 시도
   */
  private async attemptRequest(apiUrl: string, request: OpenAIRequest): Promise<OpenAIResponse> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        Logger.debug(this.componentName, `API request attempt ${attempt}/${this.config.retries}`, { url: apiUrl });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Loop-Desktop-App/1.0.0',
          },
          body: JSON.stringify({
            message: request.message
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // 🔥 단순한 응답 처리 (서버가 YAML로 튜닝됨)
        let responseText = '';
        
        if (typeof data === 'string') {
          responseText = data;
        } else if (data && typeof data === 'object') {
          // 서버 응답이 객체인 경우 message 필드 확인
          responseText = data.message || data.response || data.content || JSON.stringify(data);
        } else {
          responseText = String(data || '응답을 받지 못했습니다');
        }
        
        if (!responseText.trim()) {
          throw new Error('서버에서 빈 응답을 받았습니다');
        }

        return {
          response: responseText.trim(),
          suggestions: [],
          analysis: undefined,
          usage: undefined,
        };

      } catch (error) {
        lastError = error;
        
        // 🔥 상세한 에러 로깅
        Logger.warn(this.componentName, `API request attempt ${attempt} failed`, {
          attempt,
          error: this.getErrorMessage(error),
          request: {
            message: request.message?.substring(0, 100) + '...',
            type: request.type
          },
          url: apiUrl
        });

        // 마지막 시도가 아니면 잠시 대기
        if (attempt < this.config.retries) {
          await this.delay(1000 * attempt); // 지수 백오프
        }
      }
    }

    // 🔥 모든 재시도 실패 시 상세한 에러 정보와 함께 에러 던지기
    const errorMessage = this.getErrorMessage(lastError);
    Logger.error(this.componentName, `All ${this.config.retries} attempts failed for ${apiUrl}`, {
      finalError: errorMessage,
      request: {
        message: request.message?.substring(0, 100) + '...',
        type: request.type
      }
    });
    
    throw new Error(`API 요청 실패 (${apiUrl}): ${errorMessage}`);
  }

  /**
   * 🔥 에러 메시지 추출 (개선된 타임아웃 처리)
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return `요청 시간 초과 (${this.config.timeout}ms) - 서버 응답이 늦습니다`;
      }
      if (error.message.includes('fetch')) {
        return '네트워크 연결 오류 - 인터넷 연결을 확인해주세요';
      }
      if (error.message.includes('ENOTFOUND')) {
        return 'DNS 오류 - 서버 주소를 확인할 수 없습니다';
      }
      if (error.message.includes('ECONNREFUSED')) {
        return '연결 거부 - 서버가 응답하지 않습니다';
      }
      return error.message;
    }
    return '알 수 없는 오류가 발생했습니다';
  }

  /**
   * 🔥 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 🔥 서비스 상태 확인
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.sendMessage({
        message: 'health check',
        type: 'chat',
      });
      return response.success;
    } catch {
      return false;
    }
  }
}

// 🔥 싱글톤 인스턴스 생성
export const openAIService = new OpenAIService();
