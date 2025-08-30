'use client';

import React from 'react';
import { MarkdownEditor } from '../editor/MarkdownEditor';
import { Focus } from 'lucide-react';

interface WriteViewProps {
  content: string;
  onChange: (content: string) => void;
  isFocusMode: boolean;
}

// 🔥 기가차드 작가 친화적 스타일 - 단순화
const WRITE_STYLES = {
  container: 'flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300',

  // 🔥 메인 에디터 영역
  editorContainer: 'flex-1 min-h-0 relative',
  editorWrapper: 'h-full',

  // 🔥 포커스 모드 오버레이
  focusOverlay: 'absolute inset-0 bg-black/20 backdrop-blur-sm z-10 transition-opacity duration-300',
  focusContent: 'relative z-20 h-full',

  // 🔥 빈 상태 (새 문서)
  emptyState: 'flex flex-col items-center justify-center h-full text-center max-w-md mx-auto px-6',
  emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
  emptyTitle: 'text-xl font-semibold text-slate-900 dark:text-gray-100 mb-2',
  emptyDescription: 'text-slate-600 dark:text-gray-400 mb-6 leading-relaxed',
  startButton: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium',
} as const;

export function WriteView({ content, onChange, isFocusMode }: WriteViewProps): React.ReactElement {
  // 🔥 빈 상태 처리
  const isEmpty = !content.trim();

  if (isEmpty) {
    return (
      <div className={WRITE_STYLES.container}>
        <div className={WRITE_STYLES.emptyState}>
          <Focus className={WRITE_STYLES.emptyIcon} />
          <h2 className={WRITE_STYLES.emptyTitle}>새로운 이야기를 시작하세요</h2>
          <p className={WRITE_STYLES.emptyDescription}>
            이곳에서 당신의 창작 여정이 시작됩니다.
            첫 번째 문장을 작성하고 상상력을 현실로 만들어보세요.
          </p>
          <button
            className={WRITE_STYLES.startButton}
            onClick={() => onChange('# 새로운 장\n\n')}
          >
            글쓰기 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={WRITE_STYLES.container}>
      {/* 🔥 메인 에디터 영역 - 중복 통계 바 제거 */}
      <div className={WRITE_STYLES.editorContainer}>
        {isFocusMode && <div className={WRITE_STYLES.focusOverlay} />}
        <div className={WRITE_STYLES.focusContent}>
          <div className={WRITE_STYLES.editorWrapper}>
            <MarkdownEditor
              content={content}
              onChange={onChange}
              isFocusMode={isFocusMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
