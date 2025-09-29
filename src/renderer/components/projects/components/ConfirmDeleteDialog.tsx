'use client';

// 삭제 다이어로그 

import React, { useState } from 'react';
import { X as XIcon, AlertTriangle } from 'lucide-react';

// 🔥 프리컴파일된 스타일 (11원칙 준수)
const CONFIRM_DIALOG_STYLES = {
  overlay: 'fixed inset-0 z-[100] flex items-center justify-center bg-[color:hsl(var(--foreground))]/55 backdrop-blur-sm',
  dialog: 'bg-[color:hsl(var(--card))] text-[color:hsl(var(--card-foreground))] rounded-xl shadow-[var(--shadow-xl)] border border-[color:hsl(var(--border))] max-w-md w-full mx-4 overflow-hidden transition-colors duration-200',
  header: 'flex items-center gap-3 p-6 border-b border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))]',
  icon: 'w-8 h-8 text-[color:var(--warning,#d97706)] flex-shrink-0',
  headerText: 'flex-1',
  title: 'text-lg font-bold text-[color:hsl(var(--foreground))]',
  message: 'text-sm text-[color:hsl(var(--muted-foreground))] mt-1',
  closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg text-[color:hsl(var(--muted-foreground))] hover:bg-[color:hsl(var(--muted))] hover:text-[color:hsl(var(--foreground))] transition-colors',
  content: 'p-6 bg-[color:hsl(var(--card))]',
  description: 'text-[color:hsl(var(--muted-foreground))] leading-relaxed mb-4',
  projectName: 'font-semibold text-[color:hsl(var(--foreground))]',
  warning: 'bg-[color:var(--warning-light,#fef3c7)] border border-[color:var(--warning,#d97706)]/40 rounded-lg p-3 text-sm text-[color:var(--warning,#d97706)] shadow-[var(--shadow-sm)]',
  footer: 'flex items-center justify-end gap-3 p-6 border-t border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))]',
  cancelButton: 'px-4 py-2 text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))] rounded-lg transition-colors font-medium',
  deleteButton: 'px-4 py-2 bg-[color:var(--destructive)] hover:bg-[color:var(--destructive)]/85 text-[color:var(--destructive-foreground,#ffffff)] rounded-lg transition-colors font-medium shadow-[var(--shadow-sm)]',
} as const;

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  projectTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({ isOpen, projectTitle, onConfirm, onCancel }: ConfirmDeleteDialogProps): React.ReactElement | null {
  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent): void => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const handleEscapeKey = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div 
      className={CONFIRM_DIALOG_STYLES.overlay} 
      onClick={handleOverlayClick}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div className={CONFIRM_DIALOG_STYLES.dialog}>
        {/* 🔥 헤더 */}
        <div className={CONFIRM_DIALOG_STYLES.header}>
          <AlertTriangle className={CONFIRM_DIALOG_STYLES.icon} />
          <div className={CONFIRM_DIALOG_STYLES.headerText}>
            <h3 className={CONFIRM_DIALOG_STYLES.title}>프로젝트 삭제</h3>
            <p className={CONFIRM_DIALOG_STYLES.message}>이 작업은 되돌릴 수 없습니다</p>
          </div>
          <button
            className={CONFIRM_DIALOG_STYLES.closeButton}
            onClick={onCancel}
            aria-label="닫기"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* 🔥 내용 */}
        <div className={CONFIRM_DIALOG_STYLES.content}>
          <p className={CONFIRM_DIALOG_STYLES.description}>
            <span className={CONFIRM_DIALOG_STYLES.projectName}>&ldquo;{projectTitle}&rdquo;</span> 프로젝트를 
            완전히 삭제하시겠습니까?
          </p>
          
          <div className={CONFIRM_DIALOG_STYLES.warning}>
            ⚠️ <strong>주의:</strong> 삭제된 프로젝트와 모든 데이터(캐릭터, 구조, 메모 등)는 복구할 수 없습니다.
          </div>
        </div>

        {/* 🔥 푸터 */}
        <div className={CONFIRM_DIALOG_STYLES.footer}>
          <button
            className={CONFIRM_DIALOG_STYLES.cancelButton}
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className={CONFIRM_DIALOG_STYLES.deleteButton}
            onClick={onConfirm}
            autoFocus
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
