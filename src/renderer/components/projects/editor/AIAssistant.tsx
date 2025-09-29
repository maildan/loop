'use client';

import React from 'react';
import { Button } from '../../ui/Button';
import {
  Sparkles,
  Users,
  Map,
  MessageSquare,
  Clock,
  TrendingUp,
  ChevronRight,
  PanelRightClose
} from 'lucide-react';

interface WriterStats {
  words: number;
  characters: number;
  paragraphs: number;
  readingTime: number;
  targetWords?: number;
  sessionWords: number;
  sessionTime: number;
  wpm: number;
}

interface AIAssistantProps {
  showRightSidebar: boolean;
  toggleRightSidebar: () => void;
  writerStats: WriterStats;
  onAIAction?: (action: 'improve' | 'character' | 'plot' | 'dialogue') => void;
}

const STYLES = {
  rightSidebar:
    'w-80 bg-[color:hsl(var(--card))] border-l border-[color:hsl(var(--border))] flex flex-col transition-all duration-300 ease-in-out text-[color:hsl(var(--foreground))]',
  rightSidebarCollapsed: 'w-0 overflow-hidden transition-all duration-300 ease-in-out',
  rightSidebarHeader:
    'flex items-center justify-between p-3 border-b border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))]',
  rightSidebarTitle: 'text-lg font-semibold text-[color:hsl(var(--foreground))]',
  iconButton:
    'flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/30 focus-visible:ring-offset-0',
  statCard:
    'bg-[color:hsl(var(--muted))]/45 rounded-lg p-3 mb-3 border border-[color:hsl(var(--border))]/60 shadow-[var(--shadow-sm,0_8px_18px_rgba(15,23,42,0.12))] transition-colors',
  statGrid: 'grid grid-cols-2 gap-2 mb-4',
  statItem: 'text-center',
  statValue: 'text-lg font-semibold text-[color:hsl(var(--foreground))]',
  statLabel: 'text-xs text-[color:hsl(var(--muted-foreground))]',
  statSubtext: 'text-xs text-[color:hsl(var(--muted-foreground))]',
  progressBar: 'w-full bg-[color:hsl(var(--muted))] rounded-full h-2 mb-2 overflow-hidden',
  progressFill:
    'bg-[color:var(--accent-primary)] h-2 rounded-full transition-all duration-300 shadow-[var(--shadow-sm,0_4px_10px_rgba(37,99,235,0.4))]',
  aiButton: 'w-full justify-start p-3 mb-2 h-auto text-[color:hsl(var(--foreground))]',
  sectionHeading: 'text-sm font-medium mb-3 flex items-center text-[color:hsl(var(--foreground))]',
  sectionIconAccent: 'w-4 h-4 mr-2 text-[color:var(--accent-primary)]',
  sectionIconSuccess: 'w-4 h-4 mr-2 text-[color:var(--success)]',
  sectionSubtitle: 'text-xs text-[color:hsl(var(--muted-foreground))]',
  chevron: 'w-4 h-4 text-[color:hsl(var(--muted-foreground))]',
} as const;

export function AIAssistant({
  showRightSidebar,
  toggleRightSidebar,
  writerStats,
  onAIAction
}: AIAssistantProps): React.ReactElement {
  const handleAIAction = (action: 'improve' | 'character' | 'plot' | 'dialogue') => {
    if (onAIAction) {
      onAIAction(action);
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  const getProgressPercentage = (): number => {
    if (!writerStats.targetWords) return 0;
    return Math.min((writerStats.words / writerStats.targetWords) * 100, 100);
  };

  return (
    <div className={showRightSidebar ? STYLES.rightSidebar : STYLES.rightSidebarCollapsed}>
      <div className={STYLES.rightSidebarHeader}>
        <h2 className={STYLES.rightSidebarTitle}>작가 도구</h2>
        <button className={STYLES.iconButton} onClick={toggleRightSidebar}>
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 overflow-y-auto bg-[color:hsl(var(--card))]">
        {/* 작가 통계 */}
        <div className={STYLES.statCard}>
          <h3 className={STYLES.sectionHeading}>
            <TrendingUp className={STYLES.sectionIconAccent} />
            작업 통계
          </h3>

          <div className={STYLES.statGrid}>
            <div className={STYLES.statItem}>
              <div className={STYLES.statValue}>{writerStats.words.toLocaleString()}</div>
              <div className={STYLES.statLabel}>단어</div>
            </div>
            <div className={STYLES.statItem}>
              <div className={STYLES.statValue}>{writerStats.characters.toLocaleString()}</div>
              <div className={STYLES.statLabel}>문자</div>
            </div>
            <div className={STYLES.statItem}>
              <div className={STYLES.statValue}>{writerStats.paragraphs}</div>
              <div className={STYLES.statLabel}>단락</div>
            </div>
            <div className={STYLES.statItem}>
              <div className={STYLES.statValue}>{writerStats.readingTime}분</div>
              <div className={STYLES.statLabel}>읽기 시간</div>
            </div>
          </div>

          {writerStats.targetWords && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className={STYLES.sectionSubtitle}>일일 목표</span>
                <span className="text-xs font-medium text-[color:hsl(var(--foreground))]">
                  {getProgressPercentage().toFixed(0)}%
                </span>
              </div>
              <div className={STYLES.progressBar}>
                <div className={STYLES.progressFill} style={{ width: `${getProgressPercentage()}%` }} />
              </div>
              <div className={`${STYLES.sectionSubtitle} text-center mt-1`}>
                {writerStats.words} / {writerStats.targetWords.toLocaleString()} 단어
              </div>
            </div>
          )}
        </div>

        {/* 세션 통계 */}
        <div className={STYLES.statCard}>
          <h3 className={STYLES.sectionHeading}>
            <Clock className={STYLES.sectionIconSuccess} />
            현재 세션
          </h3>

          <div className="flex justify-between items-center mb-2">
            <div>
              <div className={STYLES.sectionSubtitle}>작성한 단어</div>
              <div className="text-lg font-medium text-[color:var(--success)]">+{writerStats.sessionWords}</div>
            </div>
            <div className="text-right">
              <div className={STYLES.sectionSubtitle}>글쓰기 시간</div>
              <div className="text-lg font-medium text-[color:hsl(var(--foreground))]">
                {formatTime(writerStats.sessionTime)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className={STYLES.sectionSubtitle}>평균 속도</div>
            </div>
            <div className="text-right">
              <div className={STYLES.statValue}>{writerStats.wpm}</div>
              <div className={STYLES.sectionSubtitle}>WPM</div>
            </div>
          </div>
        </div>

        {/* AI 작가 도우미 */}
        <div className="mt-6">
          <h3 className={STYLES.sectionHeading}>
            <Sparkles className={STYLES.sectionIconAccent} />
            AI 작가 도우미
          </h3>

          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className={STYLES.aiButton}
              onClick={() => handleAIAction('improve')}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Sparkles className={STYLES.sectionIconAccent} />
                  <div className="text-left">
                    <div className="font-medium text-[color:hsl(var(--foreground))]">문장 개선 제안</div>
                    <div className={STYLES.sectionSubtitle}>더 나은 표현을 찾아드려요</div>
                  </div>
                </div>
                <ChevronRight className={STYLES.chevron} />
              </div>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className={STYLES.aiButton}
              onClick={() => handleAIAction('character')}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Users className={STYLES.sectionIconAccent} />
                  <div className="text-left">
                    <div className="font-medium text-[color:hsl(var(--foreground))]">캐릭터 확장</div>
                    <div className={STYLES.sectionSubtitle}>인물의 배경과 성격을 다듬어요</div>
                  </div>
                </div>
                <ChevronRight className={STYLES.chevron} />
              </div>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className={STYLES.aiButton}
              onClick={() => handleAIAction('plot')}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Map className={STYLES.sectionIconAccent} />
                  <div className="text-left">
                    <div className="font-medium text-[color:hsl(var(--foreground))]">플롯 구조 강화</div>
                    <div className={STYLES.sectionSubtitle}>스토리 전개를 설계해요</div>
                  </div>
                </div>
                <ChevronRight className={STYLES.chevron} />
              </div>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className={STYLES.aiButton}
              onClick={() => handleAIAction('dialogue')}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <MessageSquare className={STYLES.sectionIconAccent} />
                  <div className="text-left">
                    <div className="font-medium text-[color:hsl(var(--foreground))]">대화 개선</div>
                    <div className={STYLES.sectionSubtitle}>자연스럽고 생동감 있는 대사를 제안해요</div>
                  </div>
                </div>
                <ChevronRight className={STYLES.chevron} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
