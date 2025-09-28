// 'use client' 제거됨 - React에서 불필요
// AI 탭 이거 씀

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  Brain,
  Lightbulb,
  Search,
  Send,
  User,
  Bot
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { HydrationGuard } from '../../components/ui/HydrationGuard';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드 완전 지원
const AI_PAGE_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-7xl space-y-6 min-h-screen',
  header: 'text-center mb-8',
  pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2',
  pageSubtitle: 'text-lg text-slate-600 dark:text-slate-400',
  featuresGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
  featureCard: 'group hover:shadow-lg dark:hover:shadow-slate-900/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer',
  featureContent: 'p-6 text-center',
  featureIcon: 'w-12 h-12 mx-auto mb-4 p-2 rounded-full group-hover:scale-110 transition-transform duration-200',
  featureIconColors: {
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  },
  featureTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2',
  featureDescription: 'text-sm text-slate-600 dark:text-slate-400 mb-3',
  featureBadge: 'mt-2',
  chatSection: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  chatCard: 'lg:col-span-2 flex flex-col h-96',
  chatHeader: 'p-4 border-b border-slate-200 dark:border-slate-700',
  chatTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100',
  chatMessages: 'flex-1 p-4 overflow-y-auto space-y-4 bg-white dark:bg-slate-800',
  chatInput: 'p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
  chatInputForm: 'flex gap-2',
  message: 'flex gap-3 max-w-3xl',
  messageUser: 'ml-auto flex-row-reverse',
  messageAvatar: 'flex-shrink-0',
  messageContent: 'flex-1',
  messageBubble: 'rounded-lg p-3 max-w-md',
  messageBubbleUser: 'bg-blue-600 text-white ml-auto',
  messageBubbleAi: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100',
  messageTime: 'text-xs text-slate-500 dark:text-slate-400 mt-1',
  suggestionsCard: 'p-6',
  suggestionsTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4',
  suggestionsList: 'space-y-3',
  suggestionItem: 'p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
  suggestionText: 'text-sm text-slate-700 dark:text-slate-300',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
interface AiFeature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly color: keyof typeof AI_PAGE_STYLES.featureIconColors;
  readonly usageCount: number;
  readonly isNew?: boolean;
}

interface ChatMessage {
  readonly id: string;
  readonly content: string;
  readonly sender: 'user' | 'ai';
  readonly timestamp: Date;
}

const AI_FEATURES: readonly AiFeature[] = [
  {
    id: 'text-analysis',
    title: '텍스트 분석',
    description: '작성한 글의 문체, 어조, 가독성을 AI가 분석하여 개선점을 제안합니다.',
    icon: FileText,
    color: 'purple',
    usageCount: 127,
    isNew: false
  },
  {
    id: 'writing-assistant',
    title: '글쓰기 도우미',
    description: '문맥에 맞는 단어 추천, 문장 완성, 표현 개선을 실시간으로 지원합니다.',
    icon: Brain,
    color: 'blue',
    usageCount: 89,
    isNew: false
  },
  {
    id: 'continue-writing',
    title: '이어쓰기 도움',
    description: '현재 작성 중인 내용을 기반으로 자연스러운 다음 문장을 제안합니다.',
    icon: Lightbulb,
    color: 'green',
    usageCount: 156,
    isNew: true
  },
  {
    id: 'text-improvement',
    title: '문장 개선',
    description: '기존 문장을 더 매력적이고 자연스럽게 개선하여 제안합니다.',
    icon: TrendingUp,
    color: 'orange',
    usageCount: 203,
    isNew: false
  }
] as const;

const INITIAL_MESSAGES: readonly ChatMessage[] = [
  {
    id: '1',
    content: '안녕하세요! Loop AI 어시스턴트입니다. 글쓰기에 관한 어떤 도움이 필요하신가요?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 60000)
  }
] as const;

const CHAT_SUGGESTIONS = [
  '오늘 쓴 글의 문체를 분석해주세요',
  '창의적인 소설 아이디어를 제안해주세요',
  '이 문장을 더 자연스럽게 만들어주세요',
  '타이핑 실력 향상을 위한 조언을 해주세요'
] as const;

export default function AiPage(): React.ReactElement {
  const [messages, setMessages] = useState<readonly ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [aiStats, setAiStats] = useState<{ usageCount: number; available: boolean }>({
    usageCount: 0,
    available: false
  });

  // 🔥 AI 통계 로딩
  React.useEffect(() => {
    const loadAiStats = async (): Promise<void> => {
      try {
        if (window.electronAPI?.ai?.getUsageStats) {
          const result = await window.electronAPI.ai.getUsageStats();
          if (result.success) {
            setAiStats({
              usageCount: result.data?.totalRequests || 0,
              available: true
            });
          }
        }
        Logger.info('AI_PAGE', 'AI page loaded');
      } catch (error) {
        Logger.error('AI_PAGE', 'Failed to load AI stats', error);
      }
    };

    loadAiStats();
  }, []);

  // 🔥 기가차드 성능 최적화: 이벤트 핸들러 메모이제이션
  const handleFeatureClick = useCallback((feature: AiFeature): void => {
    Logger.info('AI_PAGE', `Feature clicked: ${feature.id}`, { title: feature.title });
    // TODO: 해당 기능 페이지로 이동 또는 모달 열기
    alert(`${feature.title} 기능을 구현 중입니다.`);
  }, []);

  const handleSendMessage = useCallback(async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.
trim(),
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    Logger.info('AI_PAGE', 'User message sent', { content: userMessage.content });

    try {
      // 🔥 실제 AI API 호출
      if (window.electronAPI?.ai?.analyzeText) {
        const result = await window.electronAPI.ai.analyzeText(userMessage.content);
        
        if (result.success && result.data) {
          const suggestions = result.data.suggestions || [];
          const response = suggestions.length > 0 
            ? suggestions.join('\n\n') 
            : '분석이 완료되었습니다. 더 구체적인 질문을 해주시면 더 나은 답변을 드릴 수 있습니다.';
            
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: response,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          throw new Error('AI API 응답 실패');
        }
      } else {
        throw new Error('AI API 사용 불가');
      }
    } catch (error) {
      Logger.error('AI_PAGE', 'AI API call failed', error);
      
      // 폴백 응답
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `죄송합니다. 현재 AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }
    
    setIsTyping(false);
    Logger.info('AI_PAGE', 'AI response completed');
  }, [inputMessage]);

  const handleSuggestionClick = useCallback((suggestion: string): void => {
    setInputMessage(suggestion);
    Logger.info('AI_PAGE', 'Suggestion clicked', { suggestion });
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={AI_PAGE_STYLES.container}>
      {/* 헤더 */}
      <div className={AI_PAGE_STYLES.header}>
        <h1 className={AI_PAGE_STYLES.pageTitle}>Loop AI</h1>
        <p className={AI_PAGE_STYLES.pageSubtitle}>
          인공지능이 당신의 글쓰기를 더욱 스마트하게 만들어드립니다
        </p>
      </div>

      {/* AI 기능 카드 그리드 */}
      <div className={AI_PAGE_STYLES.featuresGrid}>
        {AI_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              className={AI_PAGE_STYLES.featureCard}
              onClick={() => handleFeatureClick(feature)}
              role="button"
              aria-label={`${feature.title} 기능 사용하기`}
            >
              <div className={AI_PAGE_STYLES.featureContent}>
                <div className={`${AI_PAGE_STYLES.featureIcon} ${AI_PAGE_STYLES.featureIconColors[feature.color]}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className={AI_PAGE_STYLES.featureTitle}>{feature.title}</h3>
                <p className={AI_PAGE_STYLES.featureDescription}>{feature.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" size="sm">
                    {feature.usageCount}회 사용
                  </Badge>
                  {feature.isNew && (
                    <Badge variant="primary" size="sm">
                      NEW
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 채팅 섹션 */}
      <div className={AI_PAGE_STYLES.chatSection}>
        {/* 채팅 카드 */}
        <Card className={AI_PAGE_STYLES.chatCard}>
          <div className={AI_PAGE_STYLES.chatHeader}>
            <h3 className={AI_PAGE_STYLES.chatTitle}>AI 어시스턴트와 대화</h3>
          </div>
          
          <div className={AI_PAGE_STYLES.chatMessages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${AI_PAGE_STYLES.message} ${
                  message.sender === 'user' ? AI_PAGE_STYLES.messageUser : ''
                }`}
              >
                <div className={AI_PAGE_STYLES.messageAvatar}>
                  <Avatar
                    size="sm"
                    fallback={message.sender === 'user' ? 'U' : 'AI'}
                    alt={message.sender === 'user' ? '사용자' : 'AI 어시스턴트'}
                  />
                </div>
                <div className={AI_PAGE_STYLES.messageContent}>
                  <div
                    className={`${AI_PAGE_STYLES.messageBubble} ${
                      message.sender === 'user'
                        ? AI_PAGE_STYLES.messageBubbleUser
                        : AI_PAGE_STYLES.messageBubbleAi
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className={AI_PAGE_STYLES.messageTime}>
                    {/* 🔥 하이드레이션 에러 방지: 시간을 클라이언트에서만 렌더링 */}
                    <HydrationGuard fallback={<span className="text-slate-400">--:--</span>}>
                      <span suppressHydrationWarning>
                        {new Date(message.timestamp).toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </HydrationGuard>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={AI_PAGE_STYLES.message}>
                <div className={AI_PAGE_STYLES.messageAvatar}>
                  <Avatar
                    size="sm"
                    fallback="AI"
                    alt="AI 어시스턴트"
                  />
                </div>
                <div className={AI_PAGE_STYLES.messageContent}>
                  <div className={AI_PAGE_STYLES.messageBubbleAi}>
                    AI가 답변을 작성 중입니다...
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={AI_PAGE_STYLES.chatInput}>
            <div className={AI_PAGE_STYLES.chatInputForm}>
              <Input
                type="text"
                placeholder="AI에게 질문하거나 도움을 요청하세요..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                aria-label="메시지 전송"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* 추천 질문 카드 */}
        <Card className={AI_PAGE_STYLES.suggestionsCard}>
          <h3 className={AI_PAGE_STYLES.suggestionsTitle}>추천 질문</h3>
          <div className={AI_PAGE_STYLES.suggestionsList}>
            {CHAT_SUGGESTIONS.map((suggestion, index) => (
              <div
                key={index}
                className={AI_PAGE_STYLES.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
                role="button"
                aria-label={`추천 질문: ${suggestion}`}
              >
                <p className={AI_PAGE_STYLES.suggestionText}>{suggestion}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
