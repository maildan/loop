/**
 * 🤖 GeminiSynopsisAgent - Gemini AI 시놉시스 어시스턴트
 * 
 * 프로젝트 전반 분석 기반 작가 지원 에이전트
 * - "캐릭터를 좀 더 다채롭게" 같은 실용적 질문 처리
 * - 프로젝트 데이터 기반 맞춤형 조언
 * - NCP/Korean analyzer 인사이트 통합
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Send, Sparkles, RotateCcw, TrendingUp, Users, BookOpen, Lightbulb, X } from 'lucide-react';
import { useGeminiChat, type ProjectContext } from './useGeminiChat';

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

  const {
    messages,
    isLoading,
    projectContext,
    messagesEndRef,
    sendMessage,
    clearMessages,
    reloadContext,
  } = useGeminiChat({
    projectId,
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    },
  });

  // 🔥 메시지 전송 핸들러
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  }, [input, isLoading, sendMessage]);

  // 🔥 Enter로 전송, Shift+Enter로 줄바꿈
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }, [handleSubmit]);

  // 🔥 추천 질문 (사용자 편의)
  const suggestedQuestions = [
    { icon: Users, text: '캐릭터를 좀 더 다채롭게 만들고 싶어요', color: 'text-blue-500' },
    { icon: BookOpen, text: '플롯 구조를 개선할 방법을 알려주세요', color: 'text-green-500' },
    { icon: TrendingUp, text: '독자 몰입도를 높이려면?', color: 'text-purple-500' },
    { icon: Lightbulb, text: '현재 진행 상황을 분석해주세요', color: 'text-orange-500' },
  ];

  const handleSuggestedQuestion = useCallback((question: string) => {
    setInput(question);
  }, []);

  return (
    <div className="h-full w-[400px] bg-white border-l border-gray-200 grid grid-rows-[auto_auto_1fr_auto]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI 어시스턴트</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reloadContext}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="컨텍스트 새로고침"
          >
            <RotateCcw className="h-4 w-4 text-gray-600" />
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearMessages}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              대화 초기화
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="패널 닫기"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* 프로젝트 컨텍스트 요약 */}
      {projectContext && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start gap-3">
            <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {projectContext.projectTitle}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-gray-600">
                  {projectContext.totalWords.toLocaleString()}자
                </span>
                <span className="text-xs text-gray-600">
                  {projectContext.totalEpisodes}회차
                </span>
                <span className="text-xs text-gray-600">
                  {projectContext.characterCount}명
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 영역 - 독립적인 스크롤 영역 */}
      <div className="overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <Sparkles className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI 어시스턴트에게 질문하세요
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              프로젝트 데이터를 기반으로 스토리 개선 제안, 캐릭터 분석, 플롯 구조 조언 등을 제공합니다.
            </p>
            
            {/* 추천 질문 */}
            <div className="grid grid-cols-1 gap-2 w-full">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedQuestion(q.text)}
                  className="flex items-center gap-3 p-3 text-left bg-white hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors group"
                >
                  <q.icon className={`h-5 w-5 ${q.color} flex-shrink-0`} />
                  <span className="text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                        {message.isStreaming && (
                          <span className="inline-block ml-1 animate-pulse">▊</span>
                        )}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
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
              <div className="flex items-center gap-2 text-gray-600 justify-center">
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                <span className="text-sm">AI가 생각 중...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 에러 메시지 & 입력 영역 */}
      <div className="border-t border-gray-200 bg-white">
        {error && (
          <div className="mx-4 mt-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
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
                disabled={isLoading}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg 
                         text-sm text-gray-900 placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         resize-none min-h-[60px] max-h-32"
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
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 active:bg-blue-800 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2 flex-shrink-0 font-medium shadow-sm"
            >
              <Send className="h-4 w-4" />
              <span className="text-sm">전송</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            프로젝트 데이터 기반 AI 어시스턴트 • Powered by Gemini
          </p>
        </form>
      </div>
    </div>
  );
};
