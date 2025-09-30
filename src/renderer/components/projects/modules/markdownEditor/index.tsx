// 🔥 Modularized MarkdownEditor - 모듈화된 새로운 에디터
// 기존 777줄 → 약 100줄로 축소, 단일 책임 원칙 준수

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { FontFamily } from './extensions/FontFamily';
import { FontSize } from './extensions/FontSize';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
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
    onEditorReady?: (editor: Editor) => void;
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
    distractionFree = false,
    onEditorReady
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
                Underline,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                Highlight,
                Link.configure({
                    openOnClick: false,
                }),
                Color,
                TextStyle,
                FontFamily.configure({
                    types: ['textStyle'],
                }),
                FontSize.configure({
                    types: ['textStyle'],
                }),
                TaskList.configure({
                    HTMLAttributes: {
                        'data-type': 'taskList',
                        class: 'task-list',
                    },
                }),
                TaskItem.configure({
                    nested: true,
                    HTMLAttributes: {
                        'data-type': 'taskItem',
                        class: 'task-item',
                    },
                }),
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

    // 🔥 에디터가 준비되면 부모에게 전달
    useEffect(() => {
        if (editor && isReady && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, isReady, onEditorReady]);


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

    // 🎨 동적 CSS 클래스 생성
    const editorClasses = [
        'markdown-editor', // 🔥 CSS와 매칭되는 클래스 추가
        EDITOR_STYLES.container,
        isDragOver && 'drag-over',
        isFocusMode && 'editor-focus-mode',
        typewriterMode && 'editor-typewriter-mode',
        distractionFree && 'editor-distraction-free'
    ].filter(Boolean).join(' ');

    return (
        <div className={editorClasses}>
            {/* 🔥 드래그 오버 상태 피드백 */}
            {isDragOver && (
                <div className={EDITOR_STYLES.dragOverlay}>
                    <div className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                        📁 파일을 여기에 놓으세요
                    </div>
                </div>
            )}

            {/* 🔥 몰입 모드가 아닐 때만 Bubble Menu 표시 */}
            {!distractionFree && <EditorBubbleMenu editor={editor} />}

            {/* 🔥 메인 에디터 */}
            <EditorContent editor={editor} />

            {/* 🌊 타이핑 사운드 피드백 (향후 구현을 위한 준비) */}
            {typewriterMode && (
                <div className="typing-sound-indicator opacity-0 pointer-events-none">
                    ✍️
                </div>
            )}

            {/* 🔥 작가를 위한 상태 표시 - 우아하게 */}
            {!distractionFree && process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-6 right-6 text-xs text-slate-400 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span>{wordCount} words</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>{characterCount} chars</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarkdownEditor;
