'use client';

// AI 및 WPM 도입 - 기가차드 완벽 구현

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '../../ui/Button';
import {
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
  Users,
  Map,
  MessageSquare as Speech,
  Loader2,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Send,
  BarChart2,
  Brain,
  AlignLeft
} from 'lucide-react';
import { formatTime, calculateWriterStats, type WriterStats } from './WriterStats';
import { Logger } from '../../../../shared/logger';

// Helper: send payload to AI endpoint(s) using env config and prefer HTTPS
async function aiPost(payload: Record<string, any>): Promise<any> {
  const PRIMARY_API = (process.env.NEXT_PUBLIC_AI_API_URL || 'https://loop-openai.onrender.com').replace(/\/$/, '');
  const FALLBACK_API = (process.env.NEXT_PUBLIC_AI_FALLBACK_URL || (process.env.NODE_ENV === 'development' ? 'http://0.0.0.0:8080' : '')).replace(/\/$/, '');

  const doPost = async (base: string) => {
    if (!base) throw new Error('No API URL configured');
    // Allow only secure endpoints (https) in production. Allow http only for localhost/127.0.0.1 during development.
    try {
      const parsed = new URL(base);
      const isSecure = parsed.protocol === 'https:';
      const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
      if (!isSecure && !(isLocalhost && process.env.NODE_ENV === 'development')) {
        throw new Error('Insecure API endpoint not allowed');
      }
    } catch (e) {
      throw new Error('Invalid API URL');
    }
    const resp = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`API 응답 에러: ${resp.status} - ${resp.statusText}`);
    return await resp.json();
  };

  try {
    return await doPost(PRIMARY_API);
  } catch (primaryErr) {
    if (FALLBACK_API) {
      try {
        return await doPost(FALLBACK_API);
      } catch (fallbackErr) {
        const err = new Error('Both AI endpoints failed');
        (err as any).primaryErr = primaryErr;
        (err as any).fallbackErr = fallbackErr;
        throw err;
      }
    }
    throw primaryErr;
  }
}

interface WriterStatsPanelProps {
  showRightSidebar: boolean;
  toggleRightSidebar: () => void;
  writerStats: WriterStats;
  setWordGoal: (goal: number) => void;
  currentText?: string; // 🔥 현재 편집 중인 텍스트
  projectId?: string; // 🔥 현재 프로젝트 ID
}

// 채팅 메시지 타입
interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const STATS_STYLES = {
  rightSidebar:
    'w-80 bg-[color:hsl(var(--card))] border-l border-[color:hsl(var(--border))] flex flex-col transition-all duration-300 ease-in-out text-[color:hsl(var(--foreground))]',
  rightSidebarCollapsed: 'w-0 overflow-hidden transition-all duration-300 ease-in-out',
  rightSidebarHeader:
    'flex items-center justify-between p-4 border-b border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))]',
  rightSidebarTitle: 'text-lg font-semibold text-[color:hsl(var(--foreground))]',
  iconButton:
    'flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/30 focus-visible:ring-offset-0',
  statCard:
    'bg-[color:hsl(var(--muted))]/45 rounded-lg p-3 mb-3 border border-[color:hsl(var(--border))]/60 shadow-[var(--shadow-sm,0_8px_18px_rgba(15,23,42,0.12))] transition-colors',
  statTitle: 'text-xs font-medium text-[color:hsl(var(--muted-foreground))] mb-1',
  statValue: 'text-lg font-bold text-[color:hsl(var(--foreground))]',
  statSubtext: 'text-xs text-[color:hsl(var(--muted-foreground))]',

  // 🔥 탭 스타일 추가
  tabs: 'flex border-b border-[color:hsl(var(--border))]',
  tab: 'px-4 py-2 text-sm text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] cursor-pointer transition-colors',
  tabActive: 'px-4 py-2 text-sm font-medium text-[color:var(--accent-primary)] border-b-2 border-[color:var(--accent-primary)] cursor-pointer',
  tabContent: 'p-4 flex-1 overflow-y-auto bg-[color:hsl(var(--card))]',

  // 🔥 AI 채팅 스타일 - UI 잘림 문제 해결
  chatContainer: 'flex flex-col h-full overflow-hidden bg-[color:hsl(var(--card))]',
  chatMessages: 'flex-1 overflow-y-auto px-2 py-3 space-y-3 max-h-[calc(100%-60px)]',
  chatMessage: 'p-3 rounded-lg text-sm break-words whitespace-pre-wrap max-w-[90%]',
  userMessage: 'bg-[color:var(--accent-light,#dbeafe)] ml-8 mr-2 text-[color:var(--accent-primary)]',
  aiMessage: 'bg-[color:hsl(var(--muted))] ml-2 mr-8 text-[color:hsl(var(--foreground))] overflow-auto',
  chatInputContainer: 'flex p-2 border-t border-[color:hsl(var(--border))] mt-auto bg-[color:hsl(var(--card))]',
  chatInput:
    'flex-1 rounded-l-md px-3 py-2 border border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))] text-[color:hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-primary)]',
  chatSendButton:
    'flex items-center justify-center px-3 py-2 bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover,#1d4ed8)] text-[color:var(--text-inverse,#ffffff)] rounded-r-md transition-colors disabled:bg-[color:var(--accent-primary)]/60 disabled:cursor-not-allowed',
  loadingDots: 'flex space-x-1 items-center justify-center py-2',
  loadingDot: 'w-2 h-2 bg-[color:hsl(var(--muted-foreground))] rounded-full animate-pulse',
  aiButton:
    'w-full justify-start transition-colors text-[color:hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/25 focus-visible:ring-offset-0',
  sectionIconAccent: 'w-4 h-4 mr-2 text-[color:var(--accent-primary)]'
} as const;

export function WriterStatsPanel({
  showRightSidebar,
  toggleRightSidebar,
  writerStats,
  setWordGoal,
  currentText = '',
  projectId
}: WriterStatsPanelProps): React.ReactElement {

  // 🔥 탭 관리
  const [activeTab, setActiveTab] = useState<'stats' | 'ai'>('stats');

  // 🔥 AI 기능 상태 관리
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, string>>({});

  // 🔥 AI 채팅 상태 관리
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🔥 실제 세션 관리
  const [sessionStartTime] = useState<number>(() => Date.now());
  const [realTimeStats, setRealTimeStats] = useState<WriterStats | null>(null);
  const [lastWordCount, setLastWordCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 OpenAI 채팅 통합 - Electron API를 통한 IPC 통신으로 변경
  const sendMessageToOpenAI = useCallback(async (content: string): Promise<void> => {
    try {
      // 사용자 메시지 추가
      const userMessage: ChatMessage = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      // AI 응답 로딩 상태 시작
      setIsAiTyping(true);

      Logger.info('AI_CHAT', 'AI request started', { preview: content.substring(0, 30) + '...' });

      // Electron API를 통한 AI 요청
      if (typeof window !== 'undefined' && window.electronAPI?.ai?.sendMessage) {
        const result = await window.electronAPI.ai.sendMessage(content);

        Logger.info('AI_CHAT', 'AI response status', { success: result.success });

        if (!result.success) {
          throw new Error(result.error || 'AI 응답 실패');
        }

        const responseData = result.data;
        Logger.info('AI_CHAT', 'AI response received', { preview: responseData?.response ? `${responseData.response.substring(0, 30)}...` : 'No response' });

        // AI 응답 추가
        const aiMessage: ChatMessage = {
          role: 'ai',
          content: responseData?.response || '죄송합니다, 응답을 생성하지 못했습니다.'
        };
        setMessages(prev => [...prev, aiMessage]);

      } else {
        // Fallback: 직접 fetch (개발 환경 또는 Electron API 미사용시)
        Logger.warn('AI_CHAT', 'Electron API not available, using fetch fallback');

        try {
          const data = await aiPost({ message: content });
          const aiMessage: ChatMessage = {
            role: 'ai',
            content: data.response || '죄송합니다, 응답을 생성하지 못했습니다.'
          };
          setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
          Logger.error('AI_CHAT', 'AI fallback fetch error', err);
          throw err;
        }
      }
    } catch (error) {
      const err = error as Error;
      Logger.error('AI_CHAT', 'AI response error', err);

      // 오류 메시지 추가
      const errorMessage: ChatMessage = {
        role: 'ai',
        content: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
      // 입력 필드 비우기
      setUserInput('');
      // 채팅창 스크롤 맨 아래로
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, projectId]);

  // 채팅 메시지 제출 처리
  const handleChatSubmit = useCallback((e?: React.FormEvent): void => {
    e?.preventDefault();
    if (userInput.trim() && !isAiTyping) {
      sendMessageToOpenAI(userInput.trim());
    }
  }, [userInput, isAiTyping, sendMessageToOpenAI]);

  // 🔥 실시간 통계 계산
  useEffect(() => {
    if (currentText) {
      const stats = calculateWriterStats(currentText, writerStats.wordGoal, sessionStartTime);
      setRealTimeStats(stats);

      // WPM 계산을 위한 단어 수 변경 추적
      if (stats.wordCount !== lastWordCount) {
        setLastWordCount(stats.wordCount);
      }
    }
  }, [currentText, writerStats.wordGoal, sessionStartTime, lastWordCount]);

  // 🔥 1초마다 세션 시간 업데이트
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (currentText) {
        const stats = calculateWriterStats(currentText, writerStats.wordGoal, sessionStartTime);
        setRealTimeStats(stats);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentText, writerStats.wordGoal, sessionStartTime]);

  // 🔥 실제 사용할 통계 데이터 (실시간 계산된 것 우선)
  const displayStats = realTimeStats || writerStats;

  // 🔥 AI 채팅창 스크롤 자동 조정
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 🔥 AI 채팅 전송 - Electron API를 통한 실제 연동
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // 사용자 메시지 추가
    const newMessage = { role: 'user' as const, content: userInput };
    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsAiTyping(true);

    try {
      Logger.info('AI_CHAT', 'AI chat request started', { preview: userInput.substring(0, 30) + '...' });

      // Electron API를 통한 AI 요청
      if (typeof window !== 'undefined' && window.electronAPI?.ai?.sendMessage) {
        const result = await window.electronAPI.ai.sendMessage(userInput.trim());

        if (!result.success) {
          throw new Error(result.error || 'AI 응답 실패');
        }

        const responseData = result.data;
        Logger.info('AI_CHAT', 'AI chat response success', { preview: responseData?.response ? `${responseData.response.substring(0, 30)}...` : 'No response' });

        // AI 응답 메시지 추가
        const aiMessage = {
          role: 'ai' as const,
          content: responseData?.response || '죄송합니다, 응답을 생성하지 못했습니다.'
        };
        setMessages(prev => [...prev, aiMessage]);

      } else {
        // Fallback: 직접 fetch (개발 환경 또는 Electron API 미사용시)
        Logger.warn('AI_CHAT', 'Electron API not available, using fetch fallback');

        try {
          const data = await aiPost({ message: userInput });
          const aiMessage = {
            role: 'ai' as const,
            content: data.response || '죄송합니다, 응답을 생성하지 못했습니다.'
          };
          setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
          Logger.error('AI_CHAT', 'AI chat fetch failed', err);
          throw err;
        }
      }

    } catch (error) {
      const err = error as Error;
      Logger.error('AI_CHAT', 'AI chat error', err);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '죄송합니다, 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.'
      }]);
    } finally {
      setIsAiTyping(false);
      // 채팅창 스크롤 맨 아래로
      setTimeout(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // 🔥 AI 기능 핸들러들
  const handleAIImproveText = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text to improve');
      return;
    }

    setAiLoading('improve');
    try {
      Logger.info('WRITER_STATS', 'Requesting text improvement', { textLength: currentText.length });

      const requestBody = JSON.stringify({
        message: `다음 텍스트의 문장을 더 생생하고 흥미롭게 개선해주세요. 2-3개 예시를 들어 어떻게 개선할 수 있는지 보여주세요:\n\n${currentText.substring(0, 500)}...`
      });

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      };

      try {
        const data = await aiPost({ message: `다음 텍스트의 문장을 더 생생하고 흥미롭게 개선해주세요. 2-3개 예시를 들어 어떻게 개선할 수 있는지 보여주세요:\n\n${currentText.substring(0, 500)}...` });
        setAiResults(prev => ({
          ...prev,
          improve: data.response || '문장 개선에 대한 제안을 생성하지 못했습니다. 다시 시도해주세요.'
        }));
      } catch (err) {
        Logger.error('WRITER_STATS', 'Text improvement API failed', err);
        setAiResults(prev => ({
          ...prev,
          improve: '죄송합니다, 문장 개선 중 오류가 발생했습니다. 다시 시도해주세요.'
        }));
      }

    } catch (error) {
      const err = error as Error;
      Logger.error('WRITER_STATS', 'Text improvement error', err);
      setAiResults(prev => ({
        ...prev,
        improve: '죄송합니다, 문장 개선 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [currentText, projectId]);

  const handleAICharacterAnalysis = useCallback(async () => {
    if (!projectId) {
      Logger.warn('WRITER_STATS', 'No project ID for character analysis');
      return;
    }

    setAiLoading('character');
    try {
      Logger.info('WRITER_STATS', 'Requesting character analysis', { projectId });

      // 텍스트 준비
      const analysisText = currentText ? currentText : "프로젝트에 대한 캐릭터 분석을 진행합니다.";

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: `다음 이야기에 등장하는 캐릭터들을 분석해주세요. 각 캐릭터의 강점, 약점, 동기, 발전 방향 등을 제시해주세요:\n\n${analysisText.substring(0, 1000)}...`
        })
      };

      try {
        const data = await aiPost({ message: `다음 이야기에 등장하는 캐릭터들을 분석해주세요. 각 캐릭터의 강점, 약점, 동기, 발전 방향 등을 제시해주세요:\n\n${analysisText.substring(0, 1000)}...` });
        setAiResults(prev => ({
          ...prev,
          character: data.response || '캐릭터 분석을 생성하지 못했습니다. 다시 시도해주세요.'
        }));
      } catch (err) {
        Logger.error('WRITER_STATS', 'Character analysis API failed', err);
        setAiResults(prev => ({
          ...prev,
          character: '죄송합니다, 캐릭터 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
        }));
      }
    } catch (error) {
      const err = error as Error;
      Logger.error('WRITER_STATS', 'Character analysis error', err);
      setAiResults(prev => ({
        ...prev,
        character: '죄송합니다, 캐릭터 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [projectId, currentText]);

  const handleAIPlotCheck = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text for plot analysis');
      return;
    }

    setAiLoading('plot');
    try {
      Logger.info('WRITER_STATS', 'Requesting plot analysis', { textLength: currentText.length });

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: `다음 이야기의 플롯 구조를 3막 구조에 맞춰 분석하고, 흐름과 페이스를 평가한 다음, 개선점을 제시해주세요:\n\n${currentText.substring(0, 1000)}...`
        })
      };

      try {
        const data = await aiPost({ message: `다음 이야기의 플롯 구조를 3막 구조에 맞춰 분석하고, 흐름과 페이스를 평가한 다음, 개선점을 제시해주세요:\n\n${currentText.substring(0, 1000)}...` });
        setAiResults(prev => ({
          ...prev,
          plot: data.response || '플롯 분석을 생성하지 못했습니다. 다시 시도해주세요.'
        }));
      } catch (err) {
        Logger.error('WRITER_STATS', 'Plot analysis API failed', err);
        setAiResults(prev => ({
          ...prev,
          plot: '죄송합니다, 플롯 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
        }));
      }
    } catch (error) {
      const err = error as Error;
      Logger.error('WRITER_STATS', 'Plot analysis error', err);
      setAiResults(prev => ({
        ...prev,
        plot: '죄송합니다, 플롯 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [currentText]);

  const handleAIDialogueImprovement = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text for dialogue improvement');
      return;
    }

    setAiLoading('dialogue');
    try {
      Logger.info('WRITER_STATS', 'Requesting dialogue improvement', { textLength: currentText.length });

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: `다음 이야기에서 대화를 분석하고, 더 자연스럽고 캐릭터를 잘 표현하는 대화 예시를 제안해주세요:\n\n${currentText.substring(0, 800)}...`
        })
      };

      try {
        const data = await aiPost({ message: `다음 이야기에서 대화를 분석하고, 더 자연스럽고 캐릭터를 잘 표현하는 대화 예시를 제안해주세요:\n\n${currentText.substring(0, 800)}...` });
        setAiResults(prev => ({
          ...prev,
          dialogue: data.response || '대화 개선 제안을 생성하지 못했습니다. 다시 시도해주세요.'
        }));
      } catch (err) {
        Logger.error('WRITER_STATS', 'Dialogue improvement API failed', err);
        setAiResults(prev => ({
          ...prev,
          dialogue: '죄송합니다, 대화 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
        }));
      }
    } catch (error) {
      const err = error as Error;
      Logger.error('WRITER_STATS', 'Dialogue improvement error', err);
      setAiResults(prev => ({
        ...prev,
        dialogue: '죄송합니다, 대화 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [currentText]);

  return (
    <div className={showRightSidebar ? STATS_STYLES.rightSidebar : STATS_STYLES.rightSidebarCollapsed}>
      <div className={STATS_STYLES.rightSidebarHeader}>
        <h2 className={STATS_STYLES.rightSidebarTitle}>
          {activeTab === 'stats' ? '작가 통계' : 'AI 창작 파트너'}
        </h2>
        <button className={STATS_STYLES.iconButton} onClick={toggleRightSidebar}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className={STATS_STYLES.tabs}>
        <div
          className={activeTab === 'stats' ? STATS_STYLES.tabActive : STATS_STYLES.tab}
          onClick={() => setActiveTab('stats')}
        >
          통계
        </div>
        <div
          className={activeTab === 'ai' ? STATS_STYLES.tabActive : STATS_STYLES.tab}
          onClick={() => setActiveTab('ai')}
        >
          AI
        </div>
      </div>

      {/* 통계 탭 */}
      {activeTab === 'stats' && (
        <div className="p-3 overflow-y-auto">
          {/* 단어 수 진행률 */}
          <div className={STATS_STYLES.statCard}>
            <div className="flex justify-between items-center mb-1">
              <span className={STATS_STYLES.statTitle}>단어 목표</span>
              <div className="flex items-center">
                <button
                  className={STATS_STYLES.iconButton}
                  onClick={() => setWordGoal(Math.max(500, displayStats.wordGoal - 500))}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs mx-1">{displayStats.wordGoal.toLocaleString()}</span>
                <button
                  className={STATS_STYLES.iconButton}
                  onClick={() => setWordGoal(displayStats.wordGoal + 500)}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="w-full bg-[color:hsl(var(--muted))]/70 rounded-full h-2 mb-2">
              <div
                className="bg-[color:var(--accent-primary)] h-2 rounded-full transition-all duration-300 shadow-[var(--shadow-sm,0_6px_12px_rgba(37,99,235,0.35))]"
                style={{ width: `${Math.min(100, displayStats.progress)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-[color:hsl(var(--muted-foreground))]">
              <span>{displayStats.wordCount.toLocaleString()} 단어</span>
              <span>{displayStats.progress}%</span>
            </div>
          </div>

          {/* 작성 통계 */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className={STATS_STYLES.statCard}>
              <span className={STATS_STYLES.statTitle}>단어 수</span>
              <div className={STATS_STYLES.statValue}>{displayStats.wordCount.toLocaleString()}</div>
              <div className="text-xs text-[color:hsl(var(--muted-foreground))] mt-1">
                {displayStats.wordCount > lastWordCount ? '↗' : displayStats.wordCount < lastWordCount ? '↘' : '→'}
                실시간
              </div>
            </div>

            <div className={STATS_STYLES.statCard}>
              <span className={STATS_STYLES.statTitle}>문자 수</span>
              <div className={STATS_STYLES.statValue}>{displayStats.charCount.toLocaleString()}</div>
              <div className="text-xs text-[color:hsl(var(--muted-foreground))] mt-1">공백 포함</div>
            </div>

            <div className={STATS_STYLES.statCard}>
              <span className={STATS_STYLES.statTitle}>단락 수</span>
              <div className={STATS_STYLES.statValue}>{displayStats.paragraphCount}</div>
              <div className="text-xs text-[color:hsl(var(--muted-foreground))] mt-1">구조 분석</div>
            </div>

            <div className={STATS_STYLES.statCard}>
              <span className={STATS_STYLES.statTitle}>읽기 시간</span>
              <div className={STATS_STYLES.statValue}>{displayStats.readingTime}분</div>
              <div className="text-xs text-[color:hsl(var(--muted-foreground))] mt-1">200 WPM 기준</div>
            </div>
          </div>

          {/* 세션 통계 */}
          <div className={STATS_STYLES.statCard}>
            <span className={STATS_STYLES.statTitle}>현재 세션</span>
            <div className="flex justify-between items-center">
              <div>
                <div className={STATS_STYLES.statValue}>{formatTime(displayStats.sessionTime)}</div>
                <div className={STATS_STYLES.statSubtext}>글쓰기 시간</div>
              </div>
              <div className="text-right">
                <div className={STATS_STYLES.statValue}>
                  {displayStats.wpm > 0 ? displayStats.wpm : 0}
                </div>
                <div className={STATS_STYLES.statSubtext}>WPM</div>
              </div>
            </div>
            {/* 🔥 WPM 성능 표시기 */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-[color:hsl(var(--muted-foreground))] mb-1">
                <span>타이핑 속도</span>
                <span>
                  {displayStats.wpm < 30 ? '천천히' :
                    displayStats.wpm < 60 ? '보통' :
                      displayStats.wpm < 90 ? '빠름' : '매우 빠름'}
                </span>
              </div>
              <div className="w-full bg-[color:hsl(var(--muted))]/70 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${displayStats.wpm < 30 ? 'bg-[color:var(--destructive)]' :
                    displayStats.wpm < 60 ? 'bg-[color:var(--warning)]' :
                      displayStats.wpm < 90 ? 'bg-[color:var(--success)]' : 'bg-[color:var(--accent-primary)]'
                    }`}
                  style={{ width: `${Math.min(100, (displayStats.wpm / 120) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 🌟 창작 파트너 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 animate-pulse bg-[color:var(--accent-primary)]"></div>
                <h3 className="text-sm font-medium text-[color:hsl(var(--foreground))]">창작 파트너</h3>
              </div>
              <div className="text-xs text-[color:hsl(var(--muted-foreground))]">✨ 함께 써봐요</div>
            </div>

            {/* 환영 메시지 */}
            {Object.keys(aiResults).length === 0 && (
              <div className="bg-[color:hsl(var(--muted))]/55 border border-[color:hsl(var(--border))]/60 p-4 rounded-lg mb-4 shadow-[var(--shadow-sm,0_12px_24px_rgba(15,23,42,0.14))]">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🌟</div>
                  <div>
                    <div className="text-sm font-medium text-[color:hsl(var(--foreground))] mb-2">
                      오늘도 멋진 이야기를 써보시네요!
                    </div>
                    <div className="text-xs text-[color:hsl(var(--muted-foreground))] leading-relaxed">
                      무엇을 도와드릴까요? 새로운 아이디어가 필요하거나, 막힌 부분을 뚫고 싶으시면 언제든 말씀해주세요.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className={`${STATS_STYLES.aiButton} border-[color:var(--accent-primary)]/35 hover:bg-[color:var(--accent-light,#dbeafe)]/60`}
                onClick={handleAIImproveText}
                disabled={aiLoading === 'improve' || !currentText}
              >
                {aiLoading === 'improve' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[color:var(--accent-primary)]" />
                ) : (
                  <Sparkles className={STATS_STYLES.sectionIconAccent} />
                )}
                ✨ 문장을 더 매력적으로 만들어봐요
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={`${STATS_STYLES.aiButton} border-[color:hsl(var(--border))]/60 hover:bg-[color:hsl(var(--muted))]/60`}
                onClick={handleAICharacterAnalysis}
                disabled={aiLoading === 'character' || !projectId}
              >
                {aiLoading === 'character' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[color:var(--accent-primary)]" />
                ) : (
                  <Users className={STATS_STYLES.sectionIconAccent} />
                )}
                👥 캐릭터들이 잘 살아있는지 볼까요?
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={`${STATS_STYLES.aiButton} border-[color:var(--success)]/35 hover:bg-[color:var(--success-light,#dcfce7)]/60`}
                onClick={handleAIPlotCheck}
                disabled={aiLoading === 'plot' || !currentText}
              >
                {aiLoading === 'plot' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[color:var(--success)]" />
                ) : (
                  <Map className="w-4 h-4 mr-2 text-[color:var(--success)]" />
                )}
                🗺️ 이야기 흐름을 함께 점검해볼까요?
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={`${STATS_STYLES.aiButton} border-[color:var(--warning)]/35 hover:bg-[color:var(--warning-light,#fef3c7)]/60`}
                onClick={handleAIDialogueImprovement}
                disabled={aiLoading === 'dialogue' || !currentText}
              >
                {aiLoading === 'dialogue' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[color:var(--warning)]" />
                ) : (
                  <Speech className="w-4 h-4 mr-2 text-[color:var(--warning)]" />
                )}
                💬 대화가 자연스럽게 들리나요?
              </Button>
            </div>

            {/* 🌟 창작 파트너 분석 결과 */}
            {Object.keys(aiResults).length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-[color:hsl(var(--foreground))]">창작 조언</div>
                    <div className="w-1 h-1 bg-[color:hsl(var(--muted-foreground))] rounded-full mx-2"></div>
                    <div className="text-xs text-[color:hsl(var(--muted-foreground))]">함께 만든 결과</div>
                  </div>
                  <button
                    onClick={() => setAiResults({})}
                    className="text-xs text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] transition-colors"
                  >
                    모두 지우기
                  </button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {Object.entries(aiResults).map(([key, result]) => (
                    <div
                      key={key}
                      className={`border p-4 rounded-lg transition-all duration-200 ${key === 'improve'
                        ? 'bg-[color:var(--accent-light,#dbeafe)]/70 border-[color:var(--accent-primary)]/45'
                        : key === 'character'
                          ? 'bg-[color:hsl(var(--muted))]/55 border-[color:hsl(var(--border))]/60'
                          : key === 'plot'
                            ? 'bg-[color:var(--success-light,#d1fae5)]/70 border-[color:var(--success)]/45'
                            : key === 'dialogue'
                              ? 'bg-[color:var(--warning-light,#fef3c7)]/70 border-[color:var(--warning)]/45'
                              : 'bg-[color:hsl(var(--muted))]/45 border-[color:hsl(var(--border))]/60'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {key === 'improve' && <Sparkles className={STATS_STYLES.sectionIconAccent} />}
                          {key === 'character' && <Users className={STATS_STYLES.sectionIconAccent} />}
                          {key === 'plot' && <Map className="w-4 h-4 mr-2 text-[color:var(--success)]" />}
                          {key === 'dialogue' && <Speech className="w-4 h-4 mr-2 text-[color:var(--warning)]" />}
                          <span className="text-sm font-medium text-[color:hsl(var(--foreground))]">
                            {key === 'improve' ? '✨ 문장 개선 조언' :
                              key === 'character' ? '👥 캐릭터 분석' :
                                key === 'plot' ? '🗺️ 플롯 점검' :
                                  key === 'dialogue' ? '💬 대화 개선' : key}
                          </span>
                        </div>
                        <button
                          onClick={() => setAiResults(prev => {
                            const newResults = { ...prev };
                            delete newResults[key];
                            return newResults;
                          })}
                          className="text-xs text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-xs text-[color:hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
                        {result}
                      </div>
                      <div className="mt-2 pt-2 border-t border-[color:hsl(var(--border))]">
                        <div className="text-xs text-[color:hsl(var(--muted-foreground))]">
                          💡 <span className="italic">이 조언이 도움이 되셨나요? 더 구체적인 도움이 필요하시면 언제든 말씀해주세요!</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI 챗봇 탭 */}
      {activeTab === 'ai' && (
        <div className={`${STATS_STYLES.chatContainer} h-full`}>
          <div className={STATS_STYLES.chatMessages}>
            {messages.length === 0 ? (
              <div className="text-center py-6 px-3 text-[color:hsl(var(--muted-foreground))] bg-[color:hsl(var(--muted))]/50 rounded-lg border border-[color:hsl(var(--border))]/70 shadow-[var(--shadow-sm,0_12px_24px_rgba(15,23,42,0.12))] mx-2">
                <Sparkles className="mx-auto w-8 h-8 mb-2 text-[color:var(--accent-primary)] opacity-90" />
                <p className="text-sm font-medium text-[color:hsl(var(--foreground))]">AI 창작 파트너에게 질문하세요</p>
                <p className="text-xs mt-2 leading-relaxed">
                  작품 구조, 캐릭터, 대화, 문체 등에 대한 도움을 받을 수 있습니다.<br />
                  예시: &ldquo;판타지 소설의 마법 체계를 만들어줘&rdquo;<br />또는 &ldquo;이 캐릭터를 더 흥미롭게 만드는 방법은?&rdquo;
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`${STATS_STYLES.chatMessage} ${message.role === 'user' ? STATS_STYLES.userMessage : STATS_STYLES.aiMessage
                      }`}
                  >
                    {message.role === 'ai' && (
                      <>
                        {/* 마크다운 해석 방지: 마크다운 특수 문자를 이스케이프 처리 */}
                        {message.content
                          .replace(/^# (.*)/gm, '**$1**') // # 헤더를 볼드로
                          .replace(/^## (.*)/gm, '**$1**') // ## 헤더를 볼드로 
                          .replace(/^### (.*)/gm, '**$1**') // ### 헤더를 볼드로
                        }
                      </>
                    )}
                    {message.role === 'user' && message.content}
                  </div>
                ))}
                {isAiTyping && (
                  <div className={`${STATS_STYLES.chatMessage} ${STATS_STYLES.aiMessage}`}>
                    <div className={STATS_STYLES.loadingDots}>
                      <span className={`${STATS_STYLES.loadingDot} animate-pulse`}></span>
                      <span className={`${STATS_STYLES.loadingDot} animate-pulse delay-150`}></span>
                      <span className={`${STATS_STYLES.loadingDot} animate-pulse delay-300`}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          <div className={STATS_STYLES.chatInputContainer}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChatSubmit()}
              placeholder="메시지 보내기..."
              className={STATS_STYLES.chatInput}
              disabled={isAiTyping}
            />
            <button
              className={STATS_STYLES.chatSendButton}
              onClick={() => handleChatSubmit()}
              disabled={isAiTyping || !userInput.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
