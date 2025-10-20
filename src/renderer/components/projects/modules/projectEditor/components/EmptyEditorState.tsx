/**
 * 🎨 EmptyEditorState
 * 
 * 모든 탭이 닫혀있는 상태를 표시하는 컴포넌트
 * "작가님의 상상을 펼치세요!" 메시지와 함께 새 장 만들기 버튼을 제공합니다.
 * 
 * Phase 0: Empty State Pattern
 * - 사용자가 모든 탭을 닫을 수 있는 자유도 제공
 * - 명확한 Empty 상태 UI
 * - StructureView로 자연스럽게 유도
 */

'use client';

import React, { useCallback } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Logger } from '../../../../../../shared/logger-renderer';

export interface EmptyEditorStateProps {
  /** 새 장 만들기 버튼 클릭 시 콜백 */
  onCreateChapter?: () => void;
  /** 마지막 장으로 이동 시 콜백 */
  onGoToLastChapter?: () => void;
  /** 마지막 장이 있는지 여부 */
  hasLastChapter?: boolean;
  /** 마지막 장의 제목 */
  lastChapterTitle?: string;
  /** 최근 장으로 이동 시 콜백 */
  onGoToRecentChapter?: () => void;
  /** 최근 장이 있는지 여부 */
  hasRecentChapter?: boolean;
}

const EMPTY_EDITOR_SYMBOL = Symbol.for('EMPTY_EDITOR_STATE');

/**
 * EmptyEditorState 컴포넌트
 * 
 * 렌더링 조건:
 * - state.tabs.length === 0
 * - state.activeTabId === ''
 * 
 * @example
 * ```tsx
 * if (state.tabs.length === 0) {
 *   return <EmptyEditorState 
 *     onCreateChapter={() => actions.openNewChapterModal()} 
 *     onNavigateToStructure={() => actions.setCurrentView('structure')}
 *   />;
 * }
 * ```
 */
export const EmptyEditorState = React.memo(function EmptyEditorState({
  onCreateChapter,
  onGoToLastChapter,
  hasLastChapter = false,
  lastChapterTitle = '',
  onGoToRecentChapter,
  hasRecentChapter = false,
}: EmptyEditorStateProps): React.ReactElement {

  // 🎯 새 장 만들기 핸들러
  const handleCreateChapter = useCallback(() => {
    onCreateChapter?.();
  }, [onCreateChapter]);

  // 🎯 마지막 장으로 이동 핸들러
  const handleGoToLastChapter = useCallback(() => {
    onGoToLastChapter?.();
  }, [onGoToLastChapter]);

  // 🎯 최근 장으로 이동 핸들러
  const handleGoToRecentChapter = useCallback(() => {
    onGoToRecentChapter?.();
  }, [onGoToRecentChapter]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-[color:hsl(var(--background))] to-[color:hsl(var(--muted))]/50 overflow-hidden">
      {/* 배경 decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[color:var(--accent-primary,#3b82f6)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[color:var(--accent-primary,#3b82f6)] blur-3xl" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-lg">
        {/* 아이콘 */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[color:var(--accent-light,#dbeafe)] text-[color:var(--accent-primary,#3b82f6)]">
          <BookOpen size={40} strokeWidth={1.5} />
        </div>

        {/* 타이틀 */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-[color:hsl(var(--foreground))] tracking-tight">
            작가님의 상상을 펼치세요! ✨
          </h2>
          <p className="text-base text-[color:hsl(var(--muted-foreground))] leading-relaxed">
            새로운 장을 만들어 이야기를 시작하세요.
            <br />
            당신의 창작물이 이곳에서 태어납니다.
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-3 w-full pt-4">
          {/* 마지막 장 열기 또는 새 장 만들기 (Primary) */}
          {hasLastChapter ? (
            <button
              onClick={handleGoToLastChapter}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[color:var(--accent-primary,#3b82f6)] text-white font-medium transition-all duration-200 hover:bg-[color:var(--accent-primary,#3b82f6)]/90 active:scale-95 shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_8px_20px_rgba(59,130,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary,#3b82f6)]/40"
              title="마지막에 작성하던 장을 계속 작성합니다"
            >
              <BookOpen size={20} strokeWidth={2.5} />
              <span>계속 작성하기</span>
            </button>
          ) : (
            <button
              onClick={handleCreateChapter}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[color:var(--accent-primary,#3b82f6)] text-white font-medium transition-all duration-200 hover:bg-[color:var(--accent-primary,#3b82f6)]/90 active:scale-95 shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_8px_20px_rgba(59,130,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary,#3b82f6)]/40"
              title="새로운 장을 만들어 작성을 시작합니다"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>새 장 만들기</span>
            </button>
          )}

          {/* 구조 보기 버튼 (Secondary) */}
          <button
            onClick={() => {
              Logger.debug('EMPTY_EDITOR_STATE', 'Structure view button clicked', { hasLastChapter });
              handleGoToLastChapter();
            }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[color:hsl(var(--muted))]/40 text-[color:hsl(var(--foreground))] font-medium transition-all duration-200 hover:bg-[color:hsl(var(--muted))]/60 active:scale-95 border border-[color:hsl(var(--border))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary,#3b82f6)]/25"
            title={lastChapterTitle ? `${lastChapterTitle}로 이동합니다` : "좌측 구조 패널에서 장을 관리합니다"}
          >
            <BookOpen size={18} strokeWidth={2} />
            <span>{lastChapterTitle ? `${lastChapterTitle}로 바로 가기` : '구조 보기'}</span>
          </button>
        </div>

        {/* 힌트 */}
        <div className="pt-2 text-center text-sm text-[color:hsl(var(--muted-foreground))]/70 space-y-1">
          <p>💡 팁: 좌측 <strong>구조 패널</strong>에서 장을 추가하거나,</p>
          <p>위의 <strong>새 장 만들기</strong> 버튼을 클릭하세요.</p>
        </div>
      </div>
    </div>
  );
});

EmptyEditorState.displayName = 'EmptyEditorState';
