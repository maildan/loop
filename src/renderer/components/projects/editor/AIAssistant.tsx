'use client';

import React from 'react';
import { Button } from '../../ui/Button';
import {
  Sparkles,
  Users,
  Map,
  MessageSquare,
  Clock,
  Target,
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
  rightSidebar: 'w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out',
  rightSidebarCollapsed: 'w-0 overflow-hidden transition-all duration-300 ease-in-out',
  rightSidebarHeader: 'flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800',
  rightSidebarTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100',
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  statCard: 'bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-3',
  statGrid: 'grid grid-cols-2 gap-2 mb-4',
  statItem: 'text-center',
  statValue: 'text-lg font-semibold text-slate-900 dark:text-slate-100',
  statLabel: 'text-xs text-slate-500 dark:text-slate-400',
  statSubtext: 'text-xs text-slate-500 dark:text-slate-400',
  progressBar: 'w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2',
  progressFill: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
  aiButton: 'w-full justify-start p-3 mb-2 h-auto',
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

      <div className="p-3 overflow-y-auto">
        {/* 작가 통계 */}
        <div className={STYLES.statCard}>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
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

          {/* 목표 진행률 */}
          {writerStats.targetWords && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-600 dark:text-slate-400">일일 목표</span>
                <span className="text-xs font-medium">{getProgressPercentage().toFixed(0)}%</span>
              </div>
              <div className={STYLES.progressBar}>
                <div
                  className={STYLES.progressFill}
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1">
                {writerStats.words} / {writerStats.targetWords.toLocaleString()} 단어
              </div>
            </div>
          )}
        </div>

        {/* 세션 통계 */}
        <div className={STYLES.statCard}>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-green-500" />
            현재 세션
          </h3>

          <div className="flex justify-between items-center mb-2">
            <div>
              <div className={STYLES.statSubtext}>작성한 단어</div>
              <div className="text-lg font-medium text-green-600 dark:text-green-400">
                +{writerStats.sessionWords}
              </div>
            </div>
            <div className="text-right">
              <div className={STYLES.statSubtext}>글쓰기 시간</div>
              <div className="text-lg font-medium">
                {formatTime(writerStats.sessionTime)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className={STYLES.statSubtext}>평균 속도</div>
            </div>
            <div className="text-right">
              <div className={STYLES.statValue}>{writerStats.wpm}</div>
              <div className={STYLES.statSubtext}>WPM</div>
            </div>
          </div>
        </div>

        {/* AI 작가 도우미 */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
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
                  <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">문장 개선 제안</div>
                    <div className="text-xs text-slate-500">더 나은 표현을 찾아드려요</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
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
                  <Users className="w-4 h-4 mr-2 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">등장인물 분석</div>
                    <div className="text-xs text-slate-500">캐릭터의 일관성을 확인해요</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
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
                  <Map className="w-4 h-4 mr-2 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">플롯 구조 확인</div>
                    <div className="text-xs text-slate-500">이야기 흐름을 분석해요</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
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
                  <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
                  <div className="text-left">
                    <div className="font-medium">대화문 개선</div>
                    <div className="text-xs text-slate-500">자연스러운 대화를 만들어요</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
