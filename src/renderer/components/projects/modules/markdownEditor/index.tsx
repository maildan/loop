// 🔥 Modularized MarkdownEditor - 모듈화된 새로운 에디터
// 기존 777줄 → 약 100줄로 축소, 단일 책임 원칙 준수

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Logger } from '../../../../../shared/logger';
import { DragDropHandler } from './handlers/DragDropHandler';
import { EditorBubbleMenu } from './components/EditorBubbleMenu';
import { SlashCommand, slashSuggestion } from './components/SlashCommands';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
    content: string;
    onChange: (content: string) => void;
    isFocusMode: boolean;
    typewriterMode?: boolean;
    distractionFree?: boolean;
}

const EDITOR_STYLES = {
    container: 'w-full h-full flex flex-col relative',
    loading: 'flex items-center justify-center h-full',
    dragOverlay: 'absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center z-10 pointer-events-none',
} as const;

export function MarkdownEditor({
    content,
    onChange,
    isFocusMode,
    typewriterMode = false,
    distractionFree = false
}: MarkdownEditorProps): React.ReactElement {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const dragHandlerRef = useRef<DragDropHandler | null>(null);

    const useTipTapEditor = (opts: {
        content: string;
        onChange: (content: string) => void;
        isFocusMode: boolean;
        onReady?: () => void;
        onFocus?: () => void;
        onBlur?: () => void;
    }) => {
        const editor = useEditor({
            extensions: [
                StarterKit,
                SlashCommand.configure({
                    suggestion: slashSuggestion,
                }),
            ],
            content: opts.content,
            onCreate: () => {
                opts.onReady?.();
            },
            onUpdate: ({ editor }) => {
                opts.onChange(editor.getHTML());
            },
            onFocus: () => {
                opts.onFocus?.();
            },
            onBlur: () => {
                opts.onBlur?.();
            },
        }) as Editor | null;

        const text = editor?.getText() ?? '';
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characterCount = text.length;

        return { editor, wordCount, characterCount };
    };

    const { editor, wordCount, characterCount } = useTipTapEditor({
        content,
        onChange,
        isFocusMode,
        onReady: () => {
            setIsReady(true);
            Logger.info('MARKDOWN_EDITOR', 'Editor ready');
        },
        onFocus: () => {
            Logger.debug('MARKDOWN_EDITOR', 'Editor focused');
        },
        onBlur: () => {
            Logger.debug('MARKDOWN_EDITOR', 'Editor blurred');
        },
    });


    // 🔥 드래그앤드롭 핸들러 초기화
    useEffect(() => {
        if (!editor || !isReady) return;

        dragHandlerRef.current = new DragDropHandler(
            editor,
            (state) => setIsDragOver(state.isDragOver ?? false)
        );

        return () => {
            if (dragHandlerRef.current) {
                dragHandlerRef.current.cleanup();
                dragHandlerRef.current = null;
            }
        };
    }, [editor, isReady]);

    // 🔥 외부 content 변경 시 에디터 업데이트
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    // 🔥 로딩 중 표시
    if (!isReady || !editor) {
        return (
            <div className={EDITOR_STYLES.container}>
                <div className={EDITOR_STYLES.loading}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-500 text-sm">에디터 준비 중...</span>
                    </div>
                </div>
            </div>
        );
    }

    Logger.debug('MARKDOWN_EDITOR', 'Rendering editor', {
        wordCount,
        characterCount,
        isDragOver,
        isFocusMode
    });

    return (
        <div className={`${EDITOR_STYLES.container} ${isDragOver ? 'drag-over' : ''}`}>
            {/* 🔥 드래그 오버 상태 피드백 */}
            {isDragOver && (
                <div className={EDITOR_STYLES.dragOverlay}>
                    <div className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                        📁 파일을 여기에 놓으세요
                    </div>
                </div>
            )}

            {/* 🔥 모듈화된 Bubble Menu */}
            <EditorBubbleMenu editor={editor} />

            {/* 🔥 메인 에디터 */}
            <EditorContent editor={editor} />

            {/* 🔥 개발용 디버그 정보 (프로덕션에서는 제거) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
                    Words: {wordCount} | Chars: {characterCount}
                </div>
            )}
        </div>
    );
}

export default MarkdownEditor;
