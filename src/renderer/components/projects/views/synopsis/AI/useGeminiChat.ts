/**
 * 🤖 useGeminiChat - Gemini AI 채팅 관리 Hook
 * 
 * 프로젝트 분석 기반 AI 어시스턴트
 * - 메시지 히스토리 관리
 * - 스트리밍 응답 처리
 * - 프로젝트 컨텍스트 전달
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';
import type { GeminiChatRole, GeminiEnvironmentStatus } from '../../../../../../shared/types';

const USE_GEMINI_CHAT = Symbol.for('USE_GEMINI_CHAT');

const FALLBACK_ENV_STATUS: GeminiEnvironmentStatus['status'] = {
  GEMINI_API_KEY: 'missing',
  GEMINI_MODEL: 'missing',
  GOOGLE_CLIENT_ID: 'missing',
  GOOGLE_CLIENT_SECRET: 'missing',
  GOOGLE_REDIRECT_URI: 'missing',
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ProjectContext {
  projectTitle: string;
  totalEpisodes: number;
  totalWords: number;
  characters: Array<{
    name: string;
    role: string;
    description?: string;
  }>;
  aiInsights: string[];
  wordCount: number;
  characterCount: number;
  recentMessages?: Array<{
    role: GeminiChatRole;
    content: string;
    createdAt: Date;
  }>;
}

interface UseGeminiChatOptions {
  projectId: string;
  onError?: (error: Error) => void;
}

export function useGeminiChat({ projectId, onError }: UseGeminiChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectContext, setProjectContext] = useState<ProjectContext | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<GeminiEnvironmentStatus | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentStreamId = useRef<string | null>(null);
  const errorHandlerRef = useRef(onError);
  const isContextLoadingRef = useRef(false);
  const lastLoadedProjectRef = useRef<string | null>(null);
  const isHistoryLoadingRef = useRef(false);

  useEffect(() => {
    errorHandlerRef.current = onError;
  }, [onError]);

  const refreshGeminiStatus = useCallback(async () => {
    setStatusChecked(false);

    try {
      const response = await window.electronAPI['gemini:get-status']();

      if (response.success && response.data) {
        setServiceStatus(response.data);

        if (!response.data.available) {
          const message = response.data.message ?? 'Gemini 기능을 사용하려면 환경변수 GEMINI_API_KEY를 설정해야 합니다.';
          errorHandlerRef.current?.(new Error(message));
        }
      } else {
        const message = response.error ?? 'Gemini 환경 상태를 확인하지 못했습니다.';
        setServiceStatus({ available: false, status: FALLBACK_ENV_STATUS, message });
        errorHandlerRef.current?.(new Error(message));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gemini 환경 상태를 확인하지 못했습니다.';
      setServiceStatus({ available: false, status: FALLBACK_ENV_STATUS, message });
      errorHandlerRef.current?.(error instanceof Error ? error : new Error(message));
    } finally {
      setStatusChecked(true);
    }
  }, []);

  useEffect(() => {
    void refreshGeminiStatus();
  }, [refreshGeminiStatus]);

  useEffect(() => {
    if (!statusChecked) {
      return;
    }

    if (serviceStatus?.available === false) {
      setProjectContext(null);
      setMessages([]);
      setSessionId(null);
    }
  }, [serviceStatus, statusChecked]);

  // 🔥 자동 스크롤
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadChatHistory = useCallback(async () => {
    if (!projectId) {
      return;
    }

    if (isHistoryLoadingRef.current) {
      return;
    }

    if (!statusChecked) {
      Logger.debug(USE_GEMINI_CHAT, 'Skipping chat history load until status resolves');
      return;
    }

    if (serviceStatus?.available === false) {
      Logger.debug(USE_GEMINI_CHAT, 'Skipping chat history load - Gemini unavailable');
      return;
    }

    isHistoryLoadingRef.current = true;

    try {
      Logger.debug(USE_GEMINI_CHAT, 'Loading Gemini chat history', { projectId, sessionId });

      const response = await window.electronAPI['gemini:get-chat-history']({
        projectId,
        sessionId: sessionId ?? undefined,
      });

      if (response.success && response.data) {
        const remoteSessionId = response.data.session.id;
        const historyMessages = response.data.messages.map(message => ({
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: new Date(message.createdAt),
          isStreaming: Boolean(message.isStreaming),
        } satisfies ChatMessage));

        setSessionId(remoteSessionId);
        setMessages(historyMessages);

        Logger.info(USE_GEMINI_CHAT, 'Chat history synced', {
          projectId,
          sessionId: remoteSessionId,
          messageCount: historyMessages.length,
        });
      }
    } catch (error) {
      Logger.error(USE_GEMINI_CHAT, 'Failed to load Gemini chat history', error);
      errorHandlerRef.current?.(error instanceof Error ? error : new Error('Failed to load chat history'));
    } finally {
      isHistoryLoadingRef.current = false;
    }
  }, [projectId, sessionId, serviceStatus?.available, statusChecked]);

  useEffect(() => {
    void loadChatHistory();
  }, [loadChatHistory]);

  useEffect(() => {
    setSessionId(null);
    setMessages([]);
  }, [projectId]);

  // 🔥 프로젝트 컨텍스트 로드
  const loadProjectContext = useCallback(async ({ force = false } = {}) => {
    if (!projectId) return;

    if (!statusChecked) {
      Logger.debug(USE_GEMINI_CHAT, 'Skipping context load until status resolves', { projectId });
      return;
    }

    if (serviceStatus?.available === false) {
      Logger.debug(USE_GEMINI_CHAT, 'Skipping context load - Gemini unavailable', { projectId });
      return;
    }

    if (!force) {
      if (isContextLoadingRef.current) {
        Logger.debug(USE_GEMINI_CHAT, 'Context load skipped - already in flight', { projectId });
        return;
      }

      if (lastLoadedProjectRef.current === projectId) {
        Logger.debug(USE_GEMINI_CHAT, 'Context load skipped - already loaded', { projectId });
        return;
      }
    }

    isContextLoadingRef.current = true;
    try {
      Logger.debug(USE_GEMINI_CHAT, 'Loading project context', { projectId });

      // IPC를 통해 프로젝트 분석 데이터 가져오기
      const response = await window.electronAPI['gemini:get-project-context'](projectId);
      
      if (response.success && response.data) {
        const contextData = response.data;
        const rawRecentMessages = Array.isArray((contextData as { recentMessages?: unknown }).recentMessages)
          ? (contextData as { recentMessages?: Array<{ role: GeminiChatRole; content: string; createdAt: string | Date }> }).recentMessages ?? []
          : [];

        const context: ProjectContext = {
          projectTitle: contextData.projectTitle,
          totalEpisodes: contextData.totalEpisodes,
          totalWords: contextData.totalWords,
          characters: contextData.characters,
          aiInsights: contextData.aiInsights,
          wordCount: contextData.totalWords,
          characterCount: contextData.characters.length,
          recentMessages: rawRecentMessages.map(message => ({
            role: message.role,
            content: message.content,
            createdAt: new Date(message.createdAt),
          })),
        };
        setProjectContext(context);
        
        Logger.info(USE_GEMINI_CHAT, 'Project context loaded', {
          projectId,
          wordCount: context.wordCount,
          characterCount: context.characters.length
        });

        lastLoadedProjectRef.current = projectId;
      }
    } catch (error) {
      Logger.error(USE_GEMINI_CHAT, 'Failed to load project context', error);
      errorHandlerRef.current?.(error instanceof Error ? error : new Error('Failed to load context'));
    } finally {
      isContextLoadingRef.current = false;
    }
  }, [projectId, serviceStatus?.available, statusChecked]);

  useEffect(() => {
    void loadProjectContext();
  }, [loadProjectContext]);

  const reloadProjectContext = useCallback(() => loadProjectContext({ force: true }), [loadProjectContext]);

  // 🔥 시스템 프롬프트 생성
  const buildSystemPrompt = useCallback((): string => {
    if (!projectContext) {
      return '당신은 한국 웹소설 작가를 돕는 전문 AI 어시스턴트입니다. 작가의 창작을 돕고, 스토리 개선 제안을 제공합니다.';
    }

    const { projectTitle, totalWords, totalEpisodes, characters, aiInsights } = projectContext;

    let prompt = `당신은 한국 웹소설 작가를 돕는 전문 AI 어시스턴트입니다.\n\n`;
    prompt += `**현재 프로젝트 정보:**\n`;
    prompt += `- 제목: ${projectTitle}\n`;
    prompt += `- 총 단어 수: ${totalWords.toLocaleString()}자\n`;
    prompt += `- 총 회차: ${totalEpisodes}개\n`;

    if (characters.length > 0) {
      prompt += `\n**등장인물:**\n`;
      characters.slice(0, 5).forEach(char => {
        prompt += `- ${char.name} (${char.role})`;
        if (char.description) prompt += `: ${char.description.substring(0, 100)}`;
        prompt += `\n`;
      });
      if (characters.length > 5) {
        prompt += `... 외 ${characters.length - 5}명\n`;
      }
    }

    if (aiInsights && aiInsights.length > 0) {
      prompt += `\n**분석 인사이트:**\n`;
      aiInsights.slice(0, 5).forEach(insight => {
        prompt += `- ${insight}\n`;
      });
    }

    if (projectContext.recentMessages && projectContext.recentMessages.length > 0) {
      prompt += `\n**최근 대화:**\n`;
      projectContext.recentMessages.slice(-3).forEach(message => {
        const speaker = message.role === 'assistant' ? 'AI' : '작가';
        const excerpt = message.content.length > 120 ? `${message.content.slice(0, 120)}...` : message.content;
        prompt += `- ${speaker}: ${excerpt}\n`;
      });
    }

    prompt += `\n작가의 질문에 구체적이고 실용적인 답변을 제공하세요. 프로젝트 데이터를 기반으로 한 맞춤형 조언을 우선하세요.`;

    return prompt;
  }, [projectContext]);

  // 🔥 메시지 전송 (스트리밍)
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!statusChecked) {
      errorHandlerRef.current?.(new Error('Gemini 상태를 확인하는 중입니다. 잠시 후 다시 시도해 주세요.'));
      return;
    }

    if (serviceStatus?.available === false) {
      const message = serviceStatus.message ?? 'Gemini 기능을 사용하려면 환경변수 GEMINI_API_KEY를 설정해야 합니다.';
      errorHandlerRef.current?.(new Error(message));
      return;
    }

    if (!userMessage.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    // 사용자 메시지 추가
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: userMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    currentStreamId.current = assistantMsgId;

    // 어시스턴트 메시지 placeholder
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    let handleStreamChunk: ((...args: unknown[]) => void) | null = null;
    let handleStreamError: ((...args: unknown[]) => void) | null = null;

    try {
      Logger.debug(USE_GEMINI_CHAT, 'Sending message to Gemini', {
        projectId,
        messageLength: userMessage.length
      });

      const systemPrompt = buildSystemPrompt();

      const historyPayload = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        }));

      handleStreamChunk = (...args: unknown[]) => {
        const data = args[0] as {
          projectId?: string;
          sessionId?: string;
          messageId?: string;
          chunk: string;
          accumulated: string;
        };

        if (!data || (data.projectId && data.projectId !== projectId)) {
          return;
        }

        if (data.sessionId && sessionId !== data.sessionId) {
          setSessionId(data.sessionId);
        }

        const targetId = currentStreamId.current ?? assistantMsgId;
        const messageId = data.messageId ?? targetId;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === targetId || msg.id === messageId
              ? {
                  ...msg,
                  id: messageId,
                  content: data.accumulated,
                  isStreaming: true,
                }
              : msg
          )
        );

        currentStreamId.current = messageId;
      };

      handleStreamError = (...args: unknown[]) => {
        const data = args[0] as {
          projectId?: string;
          sessionId?: string;
          messageId?: string;
          error?: string;
        };

        if (!data || (data.projectId && data.projectId !== projectId)) {
          return;
        }

        const targetId = data.messageId ?? currentStreamId.current ?? assistantMsgId;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === targetId
              ? {
                  ...msg,
                  content: data.error ?? '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
                  isStreaming: false,
                }
              : msg
          )
        );

        if (data.sessionId && sessionId !== data.sessionId) {
          setSessionId(data.sessionId);
        }
      };

      // Listener 등록
      window.electronAPI.on('gemini:stream-chunk', handleStreamChunk);
      window.electronAPI.on('gemini:stream-error', handleStreamError);

      // IPC를 통해 Gemini에게 메시지 전송 (streaming)
      const response = await window.electronAPI['gemini:send-message']({
        projectId,
        sessionId: sessionId ?? undefined,
        message: userMessage,
        history: historyPayload,
        systemPrompt,
      });

      if (response.success && response.data) {
        const finalContent = response.data.response;
        const resolvedSessionId = response.data.sessionId ?? sessionId ?? undefined;
        if (resolvedSessionId) {
          setSessionId(resolvedSessionId);
        }

        const resolvedAssistantId = currentStreamId.current ?? assistantMsgId;

        setMessages(prev => 
          prev.map(msg => 
            msg.id === resolvedAssistantId
              ? { ...msg, content: finalContent, isStreaming: false }
              : msg
          )
        );

        Logger.info(USE_GEMINI_CHAT, 'Message sent successfully', {
          assistantMsgId: resolvedAssistantId,
          contentLength: finalContent.length
        });

        void loadChatHistory();
      } else {
        throw new Error(response.error || 'Failed to get response from Gemini');
      }

    } catch (error) {
      Logger.error(USE_GEMINI_CHAT, 'Failed to send message', error);
      const targetId = currentStreamId.current ?? assistantMsgId;

      // 에러 메시지로 교체
      setMessages(prev =>
        prev.map(msg =>
          msg.id === targetId
            ? {
                ...msg,
                content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
                isStreaming: false
              }
            : msg
        )
      );

      errorHandlerRef.current?.(error instanceof Error ? error : new Error('Failed to send message'));
      void loadChatHistory();
    } finally {
      if (handleStreamChunk) {
        window.electronAPI.removeListener('gemini:stream-chunk', handleStreamChunk);
      }
      if (handleStreamError) {
        window.electronAPI.removeListener('gemini:stream-error', handleStreamError);
      }
      setIsLoading(false);
      currentStreamId.current = null;
    }
  }, [projectId, messages, isLoading, buildSystemPrompt, sessionId, loadChatHistory, serviceStatus, statusChecked]);

  // 🔥 대화 초기화
  const clearMessages = useCallback(() => {
    setMessages([]);
    currentStreamId.current = null;
    Logger.info(USE_GEMINI_CHAT, 'Messages cleared');
  }, []);

  return {
    messages,
    isLoading,
    projectContext,
    messagesEndRef,
    sendMessage,
    clearMessages,
    reloadContext: reloadProjectContext,
    status: serviceStatus,
    statusChecked,
    refreshStatus: refreshGeminiStatus,
  };
}
