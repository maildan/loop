'use client';

import React from 'react';
import { X as XIcon, AlertTriangle } from 'lucide-react';

// 🔥 범용 확인 다이얼로그 스타일
const CONFIRM_DIALOG_STYLES = {
    overlay: 'fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm',
    dialog: 'mx-4 w-full max-w-md overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-2xl',
    header: 'flex items-center gap-3 border-b border-border/60 bg-muted/50 p-6',
    icon: 'h-8 w-8 flex-shrink-0 text-[var(--warning)]',
    headerText: 'flex-1',
    title: 'text-lg font-bold text-foreground',
    message: 'mt-1 text-sm text-muted-foreground',
    closeButton: 'flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted/60',
    content: 'bg-card p-6',
    description: 'mb-4 text-sm leading-relaxed text-foreground/80',
    itemName: 'font-semibold text-foreground',
    warning: 'rounded-lg border border-[var(--warning)] bg-[var(--warning-light)] p-3 text-sm text-[var(--warning)]',
    footer: 'flex items-center justify-end gap-3 border-t border-border/60 bg-muted/40 p-6',
    cancelButton: 'rounded-lg px-4 py-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
    confirmButton: 'rounded-lg px-4 py-2 font-medium transition-colors bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive))]/85',
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
