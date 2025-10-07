'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, X as XIcon, EyeOff } from 'lucide-react';
import { getShortcutHelp } from '../modules/markdownEditor/services/EditorShortcuts';

// 🔥 단축키 도움말 스타일
const HELP_STYLES = {
  trigger: 'fixed bottom-4 right-4 z-[9999] w-12 h-12 bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover,#1d4ed8)] text-[color:var(--text-inverse,#ffffff)] rounded-full flex items-center justify-center shadow-[var(--shadow-lg,0_20px_48px_rgba(15,23,42,0.24))] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/40 focus-visible:ring-offset-0',
  hidden: 'hidden',
  modal: 'fixed inset-0 z-[10000] flex items-center justify-center bg-[color:hsl(var(--foreground))]/60 backdrop-blur-sm',
  panel: 'bg-[color:hsl(var(--card))] rounded-xl shadow-[var(--shadow-xl,0_26px_60px_rgba(15,23,42,0.32))] max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden border border-[color:hsl(var(--border))] transition-colors flex flex-col',
  header: 'flex items-center justify-between p-6 border-b border-[color:hsl(var(--border))] flex-shrink-0',
  title: 'text-xl font-bold text-[color:hsl(var(--foreground))]',
  closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[color:hsl(var(--muted))]/70 transition-colors text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/40 focus-visible:ring-offset-0',
  content: 'p-6 overflow-y-auto bg-[color:hsl(var(--card))] flex-1 max-h-[calc(80vh-150px)]',
  helpText: 'prose max-w-none text-sm text-[color:hsl(var(--foreground))] prose-headings:text-[color:hsl(var(--foreground))] prose-p:text-[color:hsl(var(--foreground))] prose-strong:text-[color:var(--accent-primary)] [font-family:var(--font-primary,inherit)]',
  footer: 'p-4 border-t border-[color:hsl(var(--border))] flex justify-between bg-[color:hsl(var(--card))] flex-shrink-0',
  hideButton: 'flex items-center gap-2 text-sm text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] transition-colors',
} as const;

interface ShortcutHelpProps {
  className?: string;
  isWriterStatsOpen?: boolean;
  isEditorView?: boolean; // 🔥 에디터 뷰인지 확인
}

// 정적 메서드: 숨겨진 가이드를 다시 표시
export function resetShortcutHelpVisibility(): void {
  localStorage.setItem('shortcutHelp.isVisible', 'true');
}

export function ShortcutHelp({ className = '', isWriterStatsOpen = false, isEditorView = false }: ShortcutHelpProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // localStorage에서 가이드 표시 여부 상태 불러오기
  useEffect(() => {
    const savedVisibility = localStorage.getItem('shortcutHelp.isVisible');
    if (savedVisibility !== null) {
      setIsVisible(savedVisibility === 'true');
    }
  }, []);

  const handleToggle = (): void => {
    setIsOpen(prev => !prev);
  };

  const handleClose = (): void => {
    setIsOpen(false);
  };

  const handleHideGuide = (): void => {
    if (confirm('단축키 가이드를 항상 숨기시겠습니까? 설정 페이지에서 다시 표시할 수 있습니다.')) {
      setIsVisible(false);
      setIsOpen(false);
      localStorage.setItem('shortcutHelp.isVisible', 'false');
    }
  };

  const handleBackdropClick = (event: React.MouseEvent): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  // 🔥 Escape 키로 닫기 및 F1 키로 열기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleHelpShortcut = (): void => {
      setIsOpen(prev => !prev);
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('shortcut:help', handleHelpShortcut);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('shortcut:help', handleHelpShortcut);
    };
  }, [isOpen]);

  // WriterStatsPanel이 열려있을 때 숨기기
  useEffect(() => {
    if (isWriterStatsOpen) {
      setIsOpen(false);
    }
  }, [isWriterStatsOpen]);

  // 🔥 가이드 숨김 상태이거나 에디터 뷰가 아니면 표시하지 않음
  if (!isVisible || !isEditorView) {
    return <></>;
  }

  return (
    <>
      {/* 🔥 도움말 트리거 버튼 */}
      <button
        className={`${HELP_STYLES.trigger} ${className}`}
        onClick={handleToggle}
        title="단축키 도움말 (F1)"
        aria-label="단축키 도움말"
      >
        <HelpCircle size={24} />
      </button>

      {/* 🔥 도움말 모달 */}
      {isOpen && (
        <div className={HELP_STYLES.modal} onClick={handleBackdropClick}>
          <div className={HELP_STYLES.panel}>
            {/* 🔥 헤더 */}
            <div className={HELP_STYLES.header}>
              <h2 className={HELP_STYLES.title}>  단축키</h2>
              <button
                className={HELP_STYLES.closeButton}
                onClick={handleClose}
                aria-label="닫기"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* 🔥 도움말 내용 */}
            <div className={HELP_STYLES.content}>
              <div className={HELP_STYLES.helpText}>
                {/* Render markdown-like shortcuts safely without using innerHTML */}
                {getShortcutHelp().split('\n').map((line: string, idx: number) => {
                  if (line.startsWith('### ')) return <h3 key={idx} className="text-md font-bold mt-2 mb-1">{line.replace('### ', '')}</h3>;
                  if (line.startsWith('## ')) return <h2 key={idx} className="text-lg font-bold mt-3 mb-2">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('# ')) return <h1 key={idx} className="text-xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
                  // bold **text**
                  const parts = [];
                  let remaining = line;
                  const boldRe = /\*\*(.*?)\*\*/;
                  while (true) {
                    const m = remaining.match(boldRe);
                    if (!m) break;
                    const before = remaining.slice(0, m.index);
                    if (before) parts.push(before);
                    parts.push(<strong key={`${idx}-b-${parts.length}`}>{m[1]}</strong>);
                    remaining = remaining.slice((m.index || 0) + m[0].length);
                  }
                  if (remaining) parts.push(remaining);
                  return <p key={idx} className="leading-relaxed" style={{ marginTop: 4 }}>{parts}</p>;
                })}
              </div>
            </div>

            {/* 🔥 푸터 추가 - 가이드 숨기기 버튼 */}
            <div className={HELP_STYLES.footer}>
              <div></div> {/* 왼쪽 빈 공간 */}
              <button
                className={HELP_STYLES.hideButton}
                onClick={handleHideGuide}
                title="이 가이드를 항상 숨기기"
                aria-label="가이드 숨기기"
              >
                <EyeOff size={16} className="mr-2" />
                가이드 숨기기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
