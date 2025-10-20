'use client';

// 🤖 Gemini 기반 AI 채팅 통합 - 단일화된 AI 솔루션

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '../../ui/Button';
import {
  ChevronRight,
  ChevronDown,
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
  AlignLeft,
  AlertTriangle
} from 'lucide-react';
import { formatTime, calculateWriterStats, type WriterStats } from './WriterStats';
import { Logger } from '../../../../shared/logger';
import { useGeminiChat, type ChatMessage as GeminiChatMessage } from '../views/synopsis/AI/useGeminiChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WriterStatsPanelProps {
  showRightSidebar: boolean;
  toggleRightSidebar: () => void;
  writerStats: WriterStats;
  setWordGoal: (goal: number) => void;
  currentText?: string; // 🔥 현재 편집 중인 텍스트
  projectId?: string; // 🔥 현재 프로젝트 ID
}

// 🔥 로컬 메시지 타입 (UI 표시용)
interface DisplayMessage {
  role: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
}

const STATS_STYLES = {
  rightSidebar:
    'flex-1 flex flex-col h-full bg-[color:hsl(var(--card))] border-l border-[color:hsl(var(--border))] transition-all duration-300 ease-in-out text-[color:hsl(var(--foreground))] overflow-hidden min-w-0',
  rightSidebarCollapsed: 'w-0 overflow-hidden transition-all duration-300 ease-in-out',
  rightSidebarHeader:
    'flex items-center justify-between p-4 border-b border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))] flex-shrink-0',
  rightSidebarTitle: 'text-lg font-semibold text-[color:hsl(var(--foreground))]',
  iconButton:
    'flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/30 focus-visible:ring-offset-0',
  // 🔥 스크롤바 숨기는 클래스
  hideScrollbar: 'scrollbar-hide',
  statCard:
    'bg-[color:hsl(var(--muted))]/45 rounded-lg p-3 mb-3 border border-[color:hsl(var(--border))]/60 shadow-[var(--shadow-sm,0_8px_18px_rgba(15,23,42,0.12))] transition-colors',
  statTitle: 'text-xs font-medium text-[color:hsl(var(--muted-foreground))] mb-1',
  statValue: 'text-lg font-bold text-[color:hsl(var(--foreground))]',
  statSubtext: 'text-xs text-[color:hsl(var(--muted-foreground))]',

  // 🔥 탭 스타일 추가 - 아이콘 포함 (고정, 스크롤 안됨)
  tabs: 'flex border-b border-[color:hsl(var(--border))] flex-shrink-0 bg-[color:hsl(var(--card))]',
  tab: 'flex items-center gap-2 px-4 py-2 text-sm text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] cursor-pointer transition-colors',
  tabActive: 'flex items-center gap-2 px-4 py-2 text-sm font-medium text-[color:var(--accent-primary)] border-b-2 border-[color:var(--accent-primary)] cursor-pointer',
  tabContent: 'flex-1 overflow-y-auto bg-[color:hsl(var(--card))] flex flex-col min-h-0',

  // 🔥 AI 채팅 스타일 - UI 잘림 문제 해결 (스크롤바 문제 수정)
  chatContainer: 'flex flex-col h-full overflow-hidden bg-[color:hsl(var(--card))]',
  chatMessages: 'flex-1 overflow-y-auto px-2 py-2 space-y-2 min-h-0 scrollbar-hide',
  chatMessage: 'p-2 rounded-lg text-sm break-words whitespace-pre-wrap max-w-[90%]',
  userMessage: 'bg-[color:var(--accent-light,#dbeafe)] ml-8 mr-2 text-[color:var(--accent-primary)]',
  aiMessage: 'bg-[color:hsl(var(--muted))] ml-2 mr-8 text-[color:hsl(var(--foreground))] overflow-auto',
  chatInputContainer: 'flex-shrink-0 flex flex-col gap-1 p-2 border-t border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))]',
  chatInput:
    'flex-1 rounded-md px-3 py-2 border border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))] text-[color:hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[color:var(--accent-primary)] font-mono text-sm',
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

  // 🔥 탭 관리 - 3개 탭으로 확장
  const [activeTab, setActiveTab] = useState<'stats' | 'ai' | 'analysis'>('stats');

  // 🔥 AI 기능 상태 관리
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, string>>({});

  // 🔥 AI 채팅 상태 관리
  const [userInput, setUserInput] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🔥 실제 세션 관리
  const [sessionStartTime] = useState<number>(() => Date.now());
  const [realTimeStats, setRealTimeStats] = useState<WriterStats | null>(null);
  const [lastWordCount, setLastWordCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 Gemini 채팅 훅 통합 (projectId 필수)
  const {
    messages: geminiMessages,
    isLoading: isGeminiLoading,
    sendMessage: sendGeminiMessage,
    projectContext,
    status: geminiStatus,
    statusChecked: geminiStatusChecked,
  } = useGeminiChat({
    projectId: projectId || '',
    onError: (error) => {
      Logger.error('WRITER_STATS_GEMINI', 'Gemini error', error);
      setAiResults(prev => ({
        ...prev,
        error: error.message
      }));
    },
  });

  // 🔥 Display messages 변환 (Gemini 메시지 → UI 형식)
  const displayMessages = geminiMessages.map((msg: GeminiChatMessage) => ({
    role: msg.role === 'user' ? 'user' : 'ai' as const,
    content: msg.content,
    isStreaming: msg.isStreaming
  })) as DisplayMessage[];

  // 🔥 메시지 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [geminiMessages]);

  // 🔥 새 메시지 도착 시 자동으로 AI 탭 활성화
  useEffect(() => {
    if (geminiMessages.length > 0 && activeTab !== 'ai') {
      setActiveTab('ai');
    }
  }, [geminiMessages.length]);

  // 🔥 채팅 입력 제출
  const handleChatSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || isGeminiLoading || !geminiStatus?.available) {
      return;
    }
    
    // 즉시 입력창 비우기 (중복 방지)
    const messageToSend = userInput.trim();
    setUserInput('');
    
    await sendGeminiMessage(messageToSend);
  }, [userInput, isGeminiLoading, sendGeminiMessage, geminiStatus?.available]);

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
  }, [geminiMessages]);

  // 🔥 AI 기능 핸들러들 - 모두 Gemini 통합
  const handleAIImproveText = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text to improve');
      return;
    }

    if (!geminiStatus?.available) {
      setAiResults(prev => ({
        ...prev,
        improve: '⚠️ Gemini API를 설정해 주세요. (설정 > Gemini AI)'
      }));
      return;
    }

    setAiLoading('improve');
    try {
      Logger.info('WRITER_STATS', 'Requesting text improvement via Gemini', { textLength: currentText.length });
      const prompt = `다음 텍스트의 문장을 더 생생하고 흥미롭게 개선해주세요. 2-3개 예시를 들어 어떻게 개선할 수 있는지 보여주세요:\n\n${currentText.substring(0, 500)}...`;
      
      await sendGeminiMessage(prompt);
      
      // 마지막 메시지 가져오기
      if (geminiMessages.length > 0) {
        const lastMsg = geminiMessages[geminiMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          setAiResults(prev => ({
            ...prev,
            improve: lastMsg.content
          }));
        }
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Text improvement error', error);
      setAiResults(prev => ({
        ...prev,
        improve: '죄송합니다, 문장 개선 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [currentText, sendGeminiMessage, geminiStatus?.available, geminiMessages]);

  const handleAICharacterAnalysis = useCallback(async () => {
    if (!projectId) {
      Logger.warn('WRITER_STATS', 'No project ID for character analysis');
      return;
    }

    if (!geminiStatus?.available) {
      setAiResults(prev => ({
        ...prev,
        character: '⚠️ Gemini API를 설정해 주세요. (설정 > Gemini AI)'
      }));
      return;
    }

    setAiLoading('character');
    try {
      Logger.info('WRITER_STATS', 'Requesting character analysis via Gemini', { projectId });
      const analysisText = currentText ? currentText : "프로젝트에 대한 캐릭터 분석을 진행합니다.";
      const prompt = `다음 이야기에 등장하는 캐릭터들을 분석해주세요. 각 캐릭터의 강점, 약점, 동기, 발전 방향 등을 제시해주세요:\n\n${analysisText.substring(0, 1000)}...`;
      
      await sendGeminiMessage(prompt);
      
      // 마지막 메시지 가져오기
      if (geminiMessages.length > 0) {
        const lastMsg = geminiMessages[geminiMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          setAiResults(prev => ({
            ...prev,
            character: lastMsg.content
          }));
        }
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Character analysis error', error);
      setAiResults(prev => ({
        ...prev,
        character: '죄송합니다, 캐릭터 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [projectId, currentText, sendGeminiMessage, geminiStatus?.available, geminiMessages]);

  const handleAIPlotCheck = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text for plot analysis');
      return;
    }

    if (!geminiStatus?.available) {
      setAiResults(prev => ({
        ...prev,
        plot: '⚠️ Gemini API를 설정해 주세요. (설정 > Gemini AI)'
      }));
      return;
    }

    setAiLoading('plot');
    try {
      Logger.info('WRITER_STATS', 'Requesting plot analysis via Gemini', { textLength: currentText.length });
      const prompt = `다음 이야기의 플롯 구조를 3막 구조에 맞춰 분석하고, 흐름과 페이스를 평가한 다음, 개선점을 제시해주세요:\n\n${currentText.substring(0, 1000)}...`;
      
      await sendGeminiMessage(prompt);
      
      // 마지막 메시지 가져오기
      if (geminiMessages.length > 0) {
        const lastMsg = geminiMessages[geminiMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          setAiResults(prev => ({
            ...prev,
            plot: lastMsg.content
          }));
        }
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Plot analysis error', error);
      setAiResults(prev => ({
        ...prev,
        plot: '죄송합니다, 플롯 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [currentText, sendGeminiMessage, geminiStatus?.available, geminiMessages]);

  const handleAIDialogueImprovement = useCallback(async () => {
    if (!currentText || currentText.trim().length === 0) {
      Logger.warn('WRITER_STATS', 'No text for dialogue improvement');
      return;
    }

    if (!geminiStatus?.available) {
      setAiResults(prev => ({
        ...prev,
        dialogue: '⚠️ Gemini API를 설정해 주세요. (설정 > Gemini AI)'
      }));
      return;
    }

    setAiLoading('dialogue');
    try {
      Logger.info('WRITER_STATS', 'Requesting dialogue improvement via Gemini', { textLength: currentText.length });
      const prompt = `다음 이야기에서 대화를 분석하고, 더 자연스럽고 캐릭터를 잘 표현하는 대화 예시를 제안해주세요:\n\n${currentText.substring(0, 800)}...`;
      
      await sendGeminiMessage(prompt);
      
      // 마지막 메시지 가져오기
      if (geminiMessages.length > 0) {
        const lastMsg = geminiMessages[geminiMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          setAiResults(prev => ({
            ...prev,
            dialogue: lastMsg.content
          }));
        }
      }
    } catch (error) {
      Logger.error('WRITER_STATS', 'Dialogue improvement error', error);
      setAiResults(prev => ({
        ...prev,
        dialogue: '죄송합니다, 대화 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setAiLoading(null);
    }
  }, [currentText, sendGeminiMessage, geminiStatus?.available, geminiMessages]);

  return (
    <div className={showRightSidebar ? STATS_STYLES.rightSidebar : STATS_STYLES.rightSidebarCollapsed}>
      {/* 🔥 고정 헤더 */}
      <div className={STATS_STYLES.rightSidebarHeader}>
        <h2 className={STATS_STYLES.rightSidebarTitle}>
          {activeTab === 'stats' ? '작가 통계' : activeTab === 'ai' ? 'AI 창작 파트너' : '글쓰기 분석'}
        </h2>
        <button className={STATS_STYLES.iconButton} onClick={toggleRightSidebar}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 🔥 고정 탭 네비게이션 - 스크롤 안 됨 */}
      <div className={STATS_STYLES.tabs}>
        <div
          className={activeTab === 'stats' ? STATS_STYLES.tabActive : STATS_STYLES.tab}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart2 className="w-4 h-4" />
          통계
        </div>
        <div
          className={activeTab === 'ai' ? STATS_STYLES.tabActive : STATS_STYLES.tab}
          onClick={() => setActiveTab('ai')}
        >
          <Sparkles className="w-4 h-4" />
          AI
        </div>
        <div
          className={activeTab === 'analysis' ? STATS_STYLES.tabActive : STATS_STYLES.tab}
          onClick={() => setActiveTab('analysis')}
        >
          <Brain className="w-4 h-4" />
          분석
        </div>
      </div>

      {/* 🔥 스크롤 가능한 탭 컨텐츠 영역 */}
      {/* 통계 탭 */}
      {activeTab === 'stats' && (
        <div className={`${STATS_STYLES.tabContent} p-3`}>
          {/* 🔥 Goal Progress (전문 작가 도구 스타일) */}
          <div className={STATS_STYLES.statCard}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Target className={STATS_STYLES.sectionIconAccent} />
                <span className="text-sm font-semibold text-[color:hsl(var(--foreground))]">목표 진행률</span>
              </div>
              <div className="flex items-center">
                <button
                  className={STATS_STYLES.iconButton}
                  onClick={() => setWordGoal(Math.max(500, displayStats.wordGoal - 500))}
                  title="목표 -500"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs mx-1 font-medium">{displayStats.wordGoal.toLocaleString()}</span>
                <button
                  className={STATS_STYLES.iconButton}
                  onClick={() => setWordGoal(displayStats.wordGoal + 500)}
                  title="목표 +500"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 🔥 Progress Bar with Percentage */}
            <div className="w-full bg-[color:hsl(var(--muted))]/70 rounded-full h-3 mb-2 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-[color:var(--accent-primary)] to-[color:var(--accent-hover,#1d4ed8)] h-3 rounded-full transition-all duration-300 shadow-[var(--shadow-sm,0_6px_12px_rgba(37,99,235,0.35))] flex items-center justify-end pr-2"
                style={{ width: `${Math.min(100, displayStats.progress)}%` }}
              >
                {displayStats.progress >= 20 && (
                  <span className="text-[9px] font-bold text-white">{displayStats.progress}%</span>
                )}
              </div>
            </div>

            {/* 🔥 Professional Stats Display */}
            <div className="flex justify-between text-xs">
              <span className="text-[color:hsl(var(--muted-foreground))]">
                <span className="font-bold text-[color:hsl(var(--foreground))]">{displayStats.wordCount.toLocaleString()}</span>
                {' / '}{displayStats.wordGoal.toLocaleString()} 단어
              </span>
              <span className="font-bold text-[color:var(--accent-primary)]">
                {displayStats.progress}%
              </span>
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
        <div className={`${STATS_STYLES.tabContent} bg-[color:hsl(var(--card))]`}>
          {/* 🔥 Gemini 상태 경고 */}
          {!geminiStatusChecked ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-6 px-3">
                <Loader2 className="mx-auto w-8 h-8 mb-2 text-[color:var(--accent-primary)] animate-spin opacity-90" />
                <p className="text-sm font-medium text-[color:hsl(var(--foreground))]">Gemini 상태를 확인하는 중...</p>
              </div>
            </div>
          ) : !geminiStatus?.available ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="bg-[color:hsl(var(--muted))]/50 rounded-lg border border-[color:hsl(var(--border))]/70 shadow-md p-4 max-w-sm text-center">
                <AlertTriangle className="mx-auto w-8 h-8 mb-3 text-orange-500" />
                <p className="text-sm font-medium text-[color:hsl(var(--foreground))] mb-2">Gemini API 설정 필요</p>
                <p className="text-xs text-[color:hsl(var(--muted-foreground))] mb-3">
                  {geminiStatus?.message || 'Gemini API 키를 설정하십시오.'}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    // 설정 패널로 이동 (필요시 구현)
                    Logger.info('WRITER_STATS', 'Navigate to Gemini settings');
                  }}
                >
                  설정으로 이동
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={STATS_STYLES.chatMessages}>
                {displayMessages.length === 0 ? (
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
                    {displayMessages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`${STATS_STYLES.chatMessage} ${message.role === 'user' ? STATS_STYLES.userMessage : STATS_STYLES.aiMessage
                          }`}
                      >
                        {message.role === 'ai' && message.content && (
                          <div className="space-y-1">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            {message.isStreaming && (
                              <div className="text-xs text-[color:hsl(var(--muted-foreground))] italic flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--accent-primary)] animate-pulse"></span>
                                응답 중...
                              </div>
                            )}
                          </div>
                        )}
                        {message.role === 'user' && message.content}
                      </div>
                    ))}
                    {isGeminiLoading && (
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
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit();
                    }
                    // Shift+Enter은 자동으로 줄바꿈 (기본 동작)
                  }}
                  placeholder="메시지 보내기... (Shift+Enter 줄바꿈)"
                  className={`${STATS_STYLES.chatInput} resize-none`}
                  disabled={isGeminiLoading}
                  rows={3}
                />
                <button
                  className="flex items-center justify-center px-2 py-2 text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] transition-colors"
                  onClick={() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  title="아래로 스크롤"
                  type="button"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  className={STATS_STYLES.chatSendButton}
                  onClick={() => handleChatSubmit()}
                  disabled={isGeminiLoading || !userInput.trim() || !geminiStatus?.available}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 🔥 글쓰기 분석 탭 - 작가를 위한 실질적인 데이터 */}
      {activeTab === 'analysis' && (
        <div className={`${STATS_STYLES.tabContent} p-4 space-y-4`}>
          {/* 프로젝트 기본 정보 */}
          <div className={STATS_STYLES.statCard}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className={STATS_STYLES.sectionIconAccent} />
              <span className="text-sm font-semibold text-[color:hsl(var(--foreground))]">프로젝트 정보</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">프로젝트 ID</span>
                <span className="font-mono text-xs text-[color:hsl(var(--foreground))]">
                  {projectId?.substring(0, 8) || '없음'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">현재 세션</span>
                <span className="font-medium text-[color:hsl(var(--foreground))]">
                  {formatTime(Math.floor((Date.now() - sessionStartTime) / 1000 / 60))}
                </span>
              </div>
            </div>
          </div>

          {/* 글쓰기 속도 분석 */}
          <div className={STATS_STYLES.statCard}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className={STATS_STYLES.sectionIconAccent} />
              <span className="text-sm font-semibold text-[color:hsl(var(--foreground))]">글쓰기 속도</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[color:hsl(var(--muted-foreground))]">분당 타자 수 (WPM)</span>
                  <span className="text-lg font-bold text-[color:var(--accent-primary)]">
                    {displayStats.wpm}
                  </span>
                </div>
                <div className="w-full bg-[color:hsl(var(--muted))]/70 rounded-full h-1.5">
                  <div
                    className="bg-[color:var(--accent-primary)] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (displayStats.wpm / 100) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[color:hsl(var(--muted-foreground))] mt-1">
                  {displayStats.wpm < 30 && '천천히 작성 중'}
                  {displayStats.wpm >= 30 && displayStats.wpm < 60 && '평균 속도'}
                  {displayStats.wpm >= 60 && displayStats.wpm < 90 && '빠른 속도'}
                  {displayStats.wpm >= 90 && '매우 빠른 속도!'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[color:hsl(var(--muted))]/30 p-2 rounded">
                  <div className="text-[color:hsl(var(--muted-foreground))]">Words/Min</div>
                  <div className="text-base font-bold text-[color:var(--accent-primary)]">
                    {displayStats.wpm} <span className="text-xs font-normal text-[color:hsl(var(--muted-foreground))]">WPM</span>
                  </div>
                </div>
                <div className="bg-[color:hsl(var(--muted))]/30 p-2 rounded">
                  <div className="text-[color:hsl(var(--muted-foreground))]">Chars/Min</div>
                  <div className="text-base font-bold text-[color:hsl(var(--foreground))]">
                    {Math.round(displayStats.wpm * 5.5)} <span className="text-xs font-normal text-[color:hsl(var(--muted-foreground))]">CPM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 Writing Time (전문 작가 도구 스타일) */}
          <div className={STATS_STYLES.statCard}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className={STATS_STYLES.sectionIconAccent} />
              <span className="text-sm font-semibold text-[color:hsl(var(--foreground))]">Writing Time</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">현재 세션</span>
                <span className="font-mono font-bold text-[color:hsl(var(--foreground))] text-base">
                  {(() => {
                    const elapsed = Date.now() - sessionStartTime;
                    const formatSessionTime = (ms: number) => {
                      const totalSeconds = Math.floor(ms / 1000);
                      const hours = Math.floor(totalSeconds / 3600);
                      const minutes = Math.floor((totalSeconds % 3600) / 60);
                      const seconds = totalSeconds % 60;
                      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    };
                    return formatSessionTime(elapsed);
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">Speed (WPM)</span>
                <span className="font-bold text-[color:var(--accent-primary)] text-base">
                  {displayStats.wpm > 0 ? `${displayStats.wpm} WPM` : '---'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">예상 완료 시간</span>
                <span className="font-medium text-[color:hsl(var(--foreground))]">
                  {(() => {
                    const remaining = displayStats.wordGoal - displayStats.wordCount;
                    if (remaining <= 0) return '🎉 목표 달성!';
                    if (displayStats.wpm === 0) return '계산 중...';
                    const minutesLeft = Math.ceil(remaining / displayStats.wpm);
                    if (minutesLeft < 60) return `약 ${minutesLeft}분 남음`;
                    const hours = Math.floor(minutesLeft / 60);
                    const mins = minutesLeft % 60;
                    return `약 ${hours}시간 ${mins ? `${mins}분` : ''} 남음`;
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* 텍스트 통계 */}
          <div className={STATS_STYLES.statCard}>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className={STATS_STYLES.sectionIconAccent} />
              <span className="text-sm font-semibold text-[color:hsl(var(--foreground))]">텍스트 분석</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">전체 단어 수</span>
                <span className="font-bold text-[color:hsl(var(--foreground))]">
                  {displayStats.wordCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">전체 글자 수</span>
                <span className="font-bold text-[color:hsl(var(--foreground))]">
                  {displayStats.charCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">예상 문장 수</span>
                <span className="font-medium text-[color:hsl(var(--foreground))]">
                  {currentText.split(/[.!?]+/).filter(s => s.trim().length > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:hsl(var(--muted-foreground))]">예상 단락 수</span>
                <span className="font-medium text-[color:hsl(var(--foreground))]">
                  {currentText.split(/\n\n+/).filter(p => p.trim().length > 0).length}
                </span>
              </div>
            </div>
          </div>

          {/* AI 분석 버튼 */}
          <div className={STATS_STYLES.statCard}>
            <div className="flex items-center gap-2 mb-3">
              <Brain className={STATS_STYLES.sectionIconAccent} />
              <span className="text-sm font-semibold text-[color:hsl(var(--foreground))]">AI 분석</span>
            </div>
            <button
              className="w-full px-4 py-2 bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover,#1d4ed8)] text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => {
                if (!currentText.trim() || isGeminiLoading) return;
                
                const analysisPrompt = `다음 텍스트를 분석하고 개선점을 제안해주세요:\n\n${currentText.substring(0, 2000)}${currentText.length > 2000 ? '...' : ''}`;
                
                setActiveTab('ai');
                // 채팅 입력창도 함께 리셋 (중복 방지)
                setUserInput('');
                await sendGeminiMessage(analysisPrompt);
              }}
              disabled={isGeminiLoading || !currentText.trim()}
            >
              <Brain className="w-4 h-4" />
              현재 텍스트 분석하기
            </button>
            <p className="text-xs text-[color:hsl(var(--muted-foreground))] mt-2 text-center">
              AI가 글쓰기 스타일, 문법, 구조를 분석합니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
