'use client';

import React from 'react';
import { X as XIcon, AlertTriangle } from 'lucide-react';

// 🔥 범용 확인 다이얼로그 스타일
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
    itemName: 'font-semibold text-slate-900 dark:text-slate-100',
    warning: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200',
    footer: 'flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700',
    cancelButton: 'px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors',
    confirmButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium',
} as const;

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    warning?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    itemName,
    warning,
    confirmText = "삭제",
    cancelText = "취소",
    onConfirm,
    onCancel
}: ConfirmDialogProps): React.ReactElement | null {
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
                {/* 헤더 */}
                <div className={CONFIRM_DIALOG_STYLES.header}>
                    <AlertTriangle className={CONFIRM_DIALOG_STYLES.icon} />
                    <div className={CONFIRM_DIALOG_STYLES.headerText}>
                        <h2 className={CONFIRM_DIALOG_STYLES.title}>
                            {title}
                        </h2>
                        <p className={CONFIRM_DIALOG_STYLES.message}>
                            신중하게 확인해주세요
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className={CONFIRM_DIALOG_STYLES.closeButton}
                        type="button"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* 내용 */}
                <div className={CONFIRM_DIALOG_STYLES.content}>
                    <p className={CONFIRM_DIALOG_STYLES.description}>
                        {message}
                        {itemName && (
                            <>
                                {' '}
                                <span className={CONFIRM_DIALOG_STYLES.itemName}>
                                    &ldquo;{itemName}&rdquo;
                                </span>
                            </>
                        )}
                    </p>

                    {warning && (
                        <div className={CONFIRM_DIALOG_STYLES.warning}>
                            {warning}
                        </div>
                    )}
                </div>

                {/* 하단 버튼 */}
                <div className={CONFIRM_DIALOG_STYLES.footer}>
                    <button
                        onClick={onCancel}
                        className={CONFIRM_DIALOG_STYLES.cancelButton}
                        type="button"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={CONFIRM_DIALOG_STYLES.confirmButton}
                        type="button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
