/**
 * 🤖 GeminiSynopsisAgent - Gemini AI 시놉시스 어시스턴트 (개선된 테마 시스템)
 * 
 * 프로젝트 전반 분석 기반 작가 지원 에이전트
 * - "캐릭터를 좀 더 다채롭게" 같은 실용적 질문 처리
 * - 프로젝트 데이터 기반 맞춤형 조언
 * - 동적 테마 + 폰트 시스템 통합
 * - AppSettingsSection 패턴 기반 구현
 */

'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Send, Sparkles, RotateCcw, TrendingUp, Users, BookOpen, Lightbulb, X, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGeminiChat, type ProjectContext } from './useGeminiChat';
import { useTheme } from '../../../../../providers/ThemeProvider';
import { useDynamicFont } from '../../../../../hooks/useDynamicFont';

interface GeminiSynopsisAgentProps {
  projectId: string;
  onClose?: () => void;
}

export const GeminiSynopsisAgent: React.FC<GeminiSynopsisAgentProps> = ({
  projectId,
  onClose,
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [persistentError, setPersistentError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🔥 테마 및 폰트 훅
  const { theme: currentTheme } = useTheme();
  const { availableFonts, loading: fontsLoading } = useDynamicFont();

  // 🔥 클라이언트 마운트 확인 (SSR 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    messages,
    isLoading,
    projectContext,
    messagesEndRef,
    sendMessage,
    clearMessages,
    reloadContext,
    status,
    statusChecked,
    refreshStatus,
  } = useGeminiChat({
    projectId,
    onError: (err) => {
      setPersistentError(false);
      setError(err.message);
    },
  });

  useEffect(() => {
    if (!statusChecked) {
      return;
    }

    if (status?.available === false) {
      setPersistentError(true);
      setError(status.message ?? 'Gemini 기능을 사용하려면 환경변수 GEMINI_API_KEY를 설정해야 합니다.');
    } else if (persistentError) {
      setPersistentError(false);
      setError(null);
    }
  }, [status, statusChecked, persistentError]);

  useEffect(() => {
    if (!error || persistentError) {
      return;
    }

    const timer = window.setTimeout(() => {
      setError(null);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [error, persistentError]);

  const isGeminiAvailable = status?.available !== false;

  const missingEnvironmentKeys = useMemo(() => {
    if (!status?.status) {
      return [] as string[];
    }

    return Object.entries(status.status)
      .filter(([, value]) => value === 'missing')
      .map(([key]) => key);
  }, [status]);

  const handleDismissError = useCallback(() => {
    setError(null);
    setPersistentError(false);
  }, []);

  // 🔥 테마 기반 스타일 계산
  const isDarkMode = useMemo(() => {
    if (currentTheme === 'dark') return true;
    if (currentTheme === 'light') return false;
    // system 모드: OS 설정 확인
    return typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : false;
  }, [currentTheme]);

  // 🔥 테마 기반 색상 팔레트
  const colorScheme = useMemo(() => ({
    header: isDarkMode 
      ? 'bg-card border-border' 
      : 'bg-card border-border',
    headerText: isDarkMode 
      ? 'text-card-foreground' 
      : 'text-card-foreground',
    border: isDarkMode 
      ? 'border-border' 
      : 'border-border',
    contextBg: isDarkMode 
      ? 'bg-[hsl(var(--accent))]/15' 
      : 'bg-[hsl(var(--accent))]/10',
    contextText: isDarkMode 
      ? 'text-accent-primary' 
      : 'text-accent-primary',
    messageBg: isDarkMode 
      ? 'bg-card text-card-foreground border-border' 
      : 'bg-card text-card-foreground border-border',
    userBubble: isDarkMode 
      ? 'bg-accent-primary text-accent-foreground' 
      : 'bg-accent-primary text-accent-foreground',
    suggestionBtn: isDarkMode 
      ? 'bg-card hover:bg-accent/20 border-border text-card-foreground' 
      : 'bg-card hover:bg-accent/20 border-border text-card-foreground',
    input: isDarkMode 
      ? 'bg-muted border-border text-card-foreground placeholder:text-muted-foreground' 
      : 'bg-muted border-border text-card-foreground placeholder:text-muted-foreground',
    sendBtn: isDarkMode 
      ? 'bg-accent-primary hover:bg-accent-hover text-accent-foreground' 
      : 'bg-accent-primary hover:bg-accent-hover text-accent-foreground',
    loadingSpinner: isDarkMode 
      ? 'border-muted-foreground border-t-accent-primary' 
      : 'border-muted-foreground border-t-accent-primary'
  }), [isDarkMode]);

  // 🔥 메시지 전송 핸들러
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !statusChecked || !isGeminiAvailable) return;

    await sendMessage(input);
    setInput('');
  }, [input, isLoading, sendMessage, statusChecked, isGeminiAvailable]);

  // 🔥 Enter로 전송, Shift+Enter로 줄바꿈
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as React.FormEvent);
    }
  }, [handleSubmit]);

  // 🔥 추천 질문 (테마 기반 색상)
  const suggestedQuestions = useMemo(() => [
    { 
      icon: Users, 
      text: '캐릭터를 좀 더 다채롭게 만들고 싶어요', 
      color: isDarkMode ? 'text-blue-400' : 'text-blue-600' 
    },
    { 
      icon: BookOpen, 
      text: '플롯 구조를 개선할 방법을 알려주세요', 
      color: isDarkMode ? 'text-green-400' : 'text-green-600' 
    },
    { 
      icon: TrendingUp, 
      text: '독자 몰입도를 높이려면?', 
      color: isDarkMode ? 'text-purple-400' : 'text-purple-600' 
    },
    { 
      icon: Lightbulb, 
      text: '현재 진행 상황을 분석해주세요', 
      color: isDarkMode ? 'text-orange-400' : 'text-orange-600' 
    },
  ], [isDarkMode]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    setInput(question);
  }, []);

  // 🔥 SSR 방지
  if (!mounted) return null;

  return (
    <div className={`h-full w-[400px] ${colorScheme.header} border-l grid grid-rows-[auto_auto_1fr_auto]`}>
      {/* 헤더 */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${colorScheme.border} ${colorScheme.header}`}>
        <div className="flex items-center gap-2">
          <Sparkles className={`h-5 w-5 ${colorScheme.contextText}`} />
          <h2 className={`text-lg font-semibold ${colorScheme.headerText}`}>AI 어시스턴트</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!statusChecked || !isGeminiAvailable) {
                return;
              }
              reloadContext();
            }}
            disabled={!statusChecked || !isGeminiAvailable}
            className={`p-2 hover:bg-accent/20 rounded-lg transition-colors text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed`}
            title="컨텍스트 새로고침"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearMessages}
              disabled={!isGeminiAvailable}
              className="px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              대화 초기화
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`p-2 hover:bg-accent/20 rounded-lg transition-colors text-muted-foreground`}
              title="패널 닫기"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 프로젝트 컨텍스트 요약 */}
      {projectContext && (
        <div className={`px-4 py-3 border-b ${colorScheme.contextBg} ${colorScheme.border}`}>
          <div className="flex items-start gap-3">
            <BookOpen className={`h-4 w-4 ${colorScheme.contextText} mt-0.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${colorScheme.headerText} truncate`}>
                {projectContext.projectTitle}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-muted-foreground">
                  {projectContext.totalWords.toLocaleString()}자
                </span>
                <span className="text-xs text-muted-foreground">
                  {projectContext.totalEpisodes}회차
                </span>
                <span className="text-xs text-muted-foreground">
                  {projectContext.characterCount}명
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 영역 - 독립적인 스크롤 영역 */}
      <div className={`overflow-y-auto p-4 space-y-4 bg-background`}>
        {!statusChecked ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className={`w-10 h-10 rounded-full border-2 ${colorScheme.loadingSpinner} animate-spin`} />
            <p className="text-sm text-muted-foreground mt-4">Gemini 환경 상태를 확인하는 중입니다...</p>
          </div>
        ) : !isGeminiAvailable ? (
          <div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-left">
            <div className="flex items-start gap-3 text-destructive">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="text-base font-semibold">Gemini 기능을 사용할 수 없습니다</p>
                <p className="text-sm text-destructive/80 mt-1">
                  {status?.message ?? 'Gemini 기능을 사용하려면 GEMINI_API_KEY 환경변수를 설정한 뒤 앱을 다시 시작하세요.'}
                </p>
              </div>
            </div>

            {missingEnvironmentKeys.length > 0 && (
              <div>
                <p className="text-sm font-medium text-destructive/80">누락된 환경 변수</p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-destructive/70">
                  {missingEnvironmentKeys.map((key) => (
                    <li key={key}>{key}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              앱 루트의 <code className="px-1 py-0.5 rounded bg-background border border-border">.env</code> 파일이나 macOS Keychain에 Gemini API 키를 저장한 뒤, 아래 버튼을 눌러 상태를 다시 확인하세요. 자세한 안내는 <code className="px-1 py-0.5 rounded bg-background border border-border">docs/ENVIRONMENT_VARIABLES.md</code> 를 참고하세요.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { void refreshStatus(); }}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card text-card-foreground hover:bg-accent/10 transition-colors"
              >
                상태 다시 확인
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <Sparkles className={`h-12 w-12 ${colorScheme.contextText} mb-4 opacity-60`} />
            <h3 className={`text-lg font-semibold ${colorScheme.headerText} mb-2`}>
              AI 어시스턴트에게 질문하세요
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              프로젝트 데이터를 기반으로 스토리 개선 제안, 캐릭터 분석, 플롯 구조 조언 등을 제공합니다.
            </p>
            
            {/* 추천 질문 */}
            <div className="grid grid-cols-1 gap-2 w-full">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedQuestion(q.text)}
                  disabled={!isGeminiAvailable}
                  className={`flex items-center gap-3 p-3 text-left ${colorScheme.suggestionBtn} border rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <q.icon className={`h-5 w-5 ${q.color} flex-shrink-0`} />
                  <span className={`text-sm ${colorScheme.headerText} group-hover:text-accent-primary transition-colors`}>
                    {q.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? colorScheme.userBubble
                      : `${colorScheme.messageBg} border`
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Sparkles className={`h-4 w-4 ${colorScheme.contextText} mt-0.5 flex-shrink-0`} />
                    )}
                    <div className="flex-1 min-w-0">
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-accent-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                          {message.isStreaming && (
                            <span className="inline-block ml-1 animate-pulse">▊</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                      )}
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'opacity-70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && !messages[messages.length - 1]?.isStreaming && (
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <div className={`animate-spin w-4 h-4 border-2 rounded-full ${colorScheme.loadingSpinner}`} />
                <span className="text-sm">AI가 생각 중...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 에러 메시지 & 입력 영역 */}
      <div className={`border-t ${colorScheme.border} ${colorScheme.header}`}>
        {error && (
          <div className="mx-4 mt-2 px-4 py-2 bg-destructive/15 border border-destructive/30 rounded-lg flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-destructive">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleDismissError}
              className="text-destructive/70 hover:text-destructive"
              aria-label="에러 메시지 닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="질문을 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
                disabled={isLoading || !isGeminiAvailable || !statusChecked}
                rows={2}
                className={`w-full px-4 py-3 ${colorScheme.input} rounded-lg 
                         text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         resize-none min-h-[60px] max-h-32`}
                style={{
                  height: 'auto',
                  overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.max(60, target.scrollHeight)}px`;
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !isGeminiAvailable || !statusChecked}
              className={`px-5 py-3 ${colorScheme.sendBtn} rounded-lg 
                       active:opacity-90 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2 flex-shrink-0 font-medium shadow-sm`}
            >
              <Send className="h-4 w-4" />
              <span className="text-sm">전송</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
