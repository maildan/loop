'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface NewChapterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (title: string) => void;
    defaultTitle?: string;
}

const MODAL_STYLES = {
    overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
    modal: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4',
    header: 'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700',
    title: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    closeButton: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors',
    content: 'p-6',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
    input: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100',
    footer: 'flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700',
    cancelButton: 'px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors',
    confirmButton: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

export function NewChapterModal({ isOpen, onClose, onConfirm, defaultTitle = '' }: NewChapterModalProps): React.ReactElement | null {
    const [title, setTitle] = useState(defaultTitle);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(defaultTitle);
            // 모달이 열릴 때 입력 필드에 포커스
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 100);
        }
    }, [isOpen, defaultTitle]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onConfirm(title.trim());
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={MODAL_STYLES.overlay} onClick={onClose}>
            <div
                className={MODAL_STYLES.modal}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className={MODAL_STYLES.header}>
                    <h2 className={MODAL_STYLES.title}>새 챕터 만들기</h2>
                    <button
                        onClick={onClose}
                        className={MODAL_STYLES.closeButton}
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={MODAL_STYLES.content}>
                        <label htmlFor="chapter-title" className={MODAL_STYLES.label}>
                            챕터 제목
                        </label>
                        <input
                            ref={inputRef}
                            id="chapter-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={MODAL_STYLES.input}
                            placeholder="새로운 챕터"
                            required
                        />
                    </div>

                    <div className={MODAL_STYLES.footer}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={MODAL_STYLES.cancelButton}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className={MODAL_STYLES.confirmButton}
                        >
                            생성
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
