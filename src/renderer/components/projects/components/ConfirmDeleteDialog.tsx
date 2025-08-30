'use client';

// 삭제 다이어로그 

import React, { useState } from 'react';
import { X as XIcon, AlertTriangle } from 'lucide-react';

// 🔥 프리컴파일된 스타일 (11원칙 준수)
const CONFIRM_DIALOG_STYLES = {
  overlay: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
  dialog: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden',
  header: 'flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-700',
  icon: 'w-8 h-8 text-red-500 flex-shrink-0',
  headerText: 'flex-1',
  title: 'text-lg font-bold text-slate-900 dark:text-slate-100',
  message: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
  closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
  content: 'p-6',
  description: 'text-slate-700 dark:text-slate-300 leading-relaxed mb-4',
  projectName: 'font-semibold text-slate-900 dark:text-slate-100',
  warning: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200',
  footer: 'flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700',
  cancelButton: 'px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors',
  deleteButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium',
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
