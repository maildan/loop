'use client';

import React, { useState, useEffect } from 'react';
import { MarkdownEditor } from '../editor/MarkdownEditor';
import { Focus, Eye, EyeOff, Type, Zap } from 'lucide-react';

interface WriteViewProps {
  content: string;
  onChange: (content: string) => void;
  isFocusMode: boolean;
}

// 🔥 iA Writer 스타일 - 작가 전용 최적화 디자인
const WRITE_STYLES = {
  // 메인 컨테이너 - 방해요소 완전 제거
  container: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300 writer-optimized',

  // 🔥 작가를 위한 플로팅 컨트롤 바 (iA Writer 스타일)
  floatingControls: 'fixed top-20 right-6 flex flex-col gap-2 z-30 opacity-0 hover:opacity-100 transition-opacity duration-300',
  controlButton: 'w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:scale-105',
  controlButtonActive: 'w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all duration-200 hover:scale-105',

  // 메인 에디터 영역 - 완전한 몰입 환경
  editorContainer: 'flex-1 min-h-0 relative overflow-hidden',
  editorWrapper: 'h-full max-w-none mx-auto px-0',

  // 🔥 Focus Mode - iA Writer 스타일 센터링
  focusWrapper: 'h-full flex items-center justify-center',
  focusEditor: 'w-full max-w-4xl mx-auto px-8 py-16',

  // 🔥 통계 표시 (iA Writer 스타일) - 하단 중앙
  statsBar: 'fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 z-30 opacity-0 hover:opacity-100 transition-opacity duration-300',
  statItem: 'flex items-center gap-1',
} as const;

export function WriteView({ content, onChange, isFocusMode }: WriteViewProps): React.ReactElement {
  const [typewriterMode, setTypewriterMode] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // 🔥 실시간 텍스트 통계 계산
  const stats = React.useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readingTime = Math.ceil(words / 250); // 분당 250단어 기준

    return { words, chars, sentences, readingTime };
  }, [content]);

  return (
    <div className={WRITE_STYLES.container}>
      {/* 🔥 iA Writer 스타일 플로팅 컨트롤 */}
      {!distractionFree && (
        <div className={WRITE_STYLES.floatingControls}>
          <button
            onClick={() => setTypewriterMode(!typewriterMode)}
            className={typewriterMode ? WRITE_STYLES.controlButtonActive : WRITE_STYLES.controlButton}
            title="타이프라이터 모드"
          >
            <Type size={14} />
          </button>
          <button
            onClick={() => setDistractionFree(true)}
            className={WRITE_STYLES.controlButton}
            title="방해요소 제거 모드"
          >
            <Zap size={14} />
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className={showStats ? WRITE_STYLES.controlButtonActive : WRITE_STYLES.controlButton}
            title="통계 표시/숨김"
          >
            {showStats ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
      )}

      {/* 🔥 메인 에디터 영역 */}
      <div className={WRITE_STYLES.editorContainer}>
        <div className={isFocusMode ? WRITE_STYLES.focusWrapper : 'h-full'}>
          <div className={isFocusMode ? WRITE_STYLES.focusEditor : WRITE_STYLES.editorWrapper}>
            <MarkdownEditor
              content={content}
              onChange={onChange}
              isFocusMode={isFocusMode}
              typewriterMode={typewriterMode}
              distractionFree={distractionFree}
            />
          </div>
        </div>
      </div>

      {/* 🔥 iA Writer 스타일 통계 바 */}
      {showStats && !distractionFree && (
        <div className={WRITE_STYLES.statsBar}>
          <div className={WRITE_STYLES.statItem}>
            <span>{stats.words} 단어</span>
          </div>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
          <div className={WRITE_STYLES.statItem}>
            <span>{stats.chars} 글자</span>
          </div>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
          <div className={WRITE_STYLES.statItem}>
            <span>{stats.sentences} 문장</span>
          </div>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
          <div className={WRITE_STYLES.statItem}>
            <span>약 {stats.readingTime}분 읽기</span>
          </div>
        </div>
      )}

      {/* 🔥 방해요소 제거 모드 해제 버튼 */}
      {distractionFree && (
        <button
          onClick={() => setDistractionFree(false)}
          className="fixed top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-200 z-50"
          title="방해요소 제거 모드 해제 (ESC)"
        >
          <Eye size={14} />
        </button>
      )}
    </div>
  );
}
