// 🔥 useTipTapEditor Hook - TipTap 에디터 설정을 분리한 커스텀 훅
// 기존 MarkdownEditor.tsx의 복잡한 에디터 설정을 훅으로 추상화

import { useEditor, Editor } from '@tiptap/react';
import { useCallback, useRef, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { Logger } from '../../../../../../shared/logger';
import { KeyboardHandler } from '../handlers/KeyboardHandler';
import { clipboardService } from '../services/ClipboardService';
import { SlashCommand, slashSuggestion } from '../components/SlashCommands';
import { TaskList, TaskItem, Callout, Toggle, Highlight } from '../components/AdvancedNotionFeatures';
import '../MarkdownEditor.css';

export interface UseTipTapEditorOptions {
    content: string;
    onChange: (content: string) => void;
    isFocusMode: boolean;
    onReady?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export interface UseTipTapEditorReturn {
    editor: Editor | null;
    isReady: boolean;
    wordCount: number;
    characterCount: number;
}

export function useTipTapEditor({
    content,
    onChange,
    isFocusMode,
    onReady,
    onFocus,
    onBlur,
}: UseTipTapEditorOptions): UseTipTapEditorReturn {
    const keyboardHandlerRef = useRef<KeyboardHandler | null>(null);
    const isReadyRef = useRef(false);

    // 🔥 에디터 생성 및 설정
    const editor = useEditor({
        immediatelyRender: false, // SSR 하이드레이션 문제 해결

        extensions: [
            // 🔥 기본 확장들
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
                bulletList: {
                    HTMLAttributes: { class: 'list-disc list-outside ml-6' }
                },
                orderedList: {
                    HTMLAttributes: { class: 'list-decimal list-outside ml-6' }
                }
            }),

            // 🔥 포맷팅 확장들
            Underline,

            // 🔥 이미지 확장
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg shadow-md max-w-full h-auto my-4' },
                inline: false,
                allowBase64: true,
            }),

            // 🔥 Placeholder 확장
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        const level = node.attrs.level;
                        switch (level) {
                            case 1: return '제목을 입력하세요...';
                            case 2: return '챕터 제목...';
                            case 3: return '섹션 제목...';
                            default: return '소제목...';
                        }
                    }
                    if (node.type.name === 'callout') {
                        return '콜아웃 내용을 입력하세요...';
                    }
                    if (node.type.name === 'toggle') {
                        return '토글 내용을 입력하세요...';
                    }
                    return '/ 를 입력하여 명령어를 사용하거나 이야기를 시작해보세요...';
                },
                showOnlyWhenEditable: true,
                showOnlyCurrent: false,
            }),

            // 🔥 포커스 확장
            Focus.configure({
                className: 'has-focus',
                mode: 'all',
            }),

            // 🔥 타이포그래피 확장
            Typography.configure({
                openDoubleQuote: '"',
                closeDoubleQuote: '"',
                openSingleQuote: "'",
                closeSingleQuote: "'",
                ellipsis: '...',
                emDash: '--',
            }),

            // 🔥 노션 스타일 확장들
            TaskList,
            TaskItem,
            Callout,
            Toggle,
            Highlight,

            // 🔥 슬래시 명령어 확장
            SlashCommand.configure({
                suggestion: slashSuggestion,
            }),

            // 🔥 문자 수 카운트
            CharacterCount,
        ],

        content,

        // 🔥 에디터 속성
        editorProps: {
            attributes: {
                class: `flex-1 p-6 prose max-w-none focus:outline-none text-gray-900 dark:text-gray-100 ${isFocusMode ? 'prose-lg' : ''
                    }`,
                'data-placeholder': '이야기를 시작해보세요...',
            },

            // 🔥 키보드 핸들러 위임
            handleKeyDown: (view, event) => {
                if (!keyboardHandlerRef.current) return false;
                return keyboardHandlerRef.current.handleEditorKeyDown(view, event);
            },

            // 🔥 클립보드 처리 위임
            handlePaste: (view, event) => {
                const editorInstance = (view as any).editor;
                if (!editorInstance || !event.clipboardData) return false;

                // 비동기 처리를 Promise로 처리 (반환값은 동기적)
                clipboardService.handleImagePaste(editorInstance, event.clipboardData)
                    .then(result => {
                        if (result.success) {
                            Logger.info('TIPTAP_EDITOR', 'Image pasted successfully');
                        }
                    })
                    .catch(error => {
                        Logger.error('TIPTAP_EDITOR', 'Failed to paste image', error);
                    });

                return false; // 기본 동작 허용
            },

            // 🔥 드래그앤드롭 처리는 별도 핸들러에서 관리
            handleDrop: () => false, // DragDropHandler에서 처리
        },

        // 🔥 이벤트 핸들러들
        onUpdate: ({ editor }) => {
            const newContent = editor.getHTML();
            onChange(newContent);

            Logger.debug('TIPTAP_EDITOR', 'Content updated', {
                wordCount: editor.storage.characterCount?.words() || 0
            });
        },

        onCreate: ({ editor }) => {
            // 키보드 핸들러 초기화
            keyboardHandlerRef.current = new KeyboardHandler(editor);
            keyboardHandlerRef.current.startGlobalHandling();

            isReadyRef.current = true;
            onReady?.();
            Logger.info('TIPTAP_EDITOR', 'Editor created successfully');
        },

        onFocus: ({ editor }) => {
            onFocus?.();
            Logger.debug('TIPTAP_EDITOR', 'Editor focused');
        },

        onBlur: ({ editor }) => {
            onBlur?.();
            Logger.debug('TIPTAP_EDITOR', 'Editor blurred');
        },

        onDestroy: () => {
            if (keyboardHandlerRef.current) {
                keyboardHandlerRef.current.cleanup();
                keyboardHandlerRef.current = null;
            }
            Logger.debug('TIPTAP_EDITOR', 'Editor destroyed');
        },
    });

    // 🔥 content prop 변경 시 에디터 내용 동기화
    useEffect(() => {
        if (editor && content !== undefined && content !== null) {
            const currentContent = editor.getHTML();
            // content가 다른 경우 업데이트 (빈 문자열도 포함)
            if (currentContent !== content) {
                Logger.info('TIPTAP_EDITOR', 'Updating editor content from prop', {
                    previousLength: currentContent.length,
                    newLength: content.length,
                    contentPreview: content ? content.substring(0, 100) + '...' : '(empty)',
                    isEmpty: content === ''
                });
                editor.commands.setContent(content, false);
            }
        }
    }, [editor, content]);

    // 🔥 통계 계산
    const wordCount = editor?.storage.characterCount?.words() || 0;
    const characterCount = editor?.storage.characterCount?.characters() || 0;

    return {
        editor,
        isReady: isReadyRef.current,
        wordCount,
        characterCount,
    };
}

export default useTipTapEditor;
