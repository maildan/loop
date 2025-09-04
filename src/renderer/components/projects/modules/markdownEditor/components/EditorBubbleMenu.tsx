// 🔥 EditorBubbleMenu - 선택 시 나타나는 포맷팅 메뉴 컴포넌트
// 기존 MarkdownEditor.tsx의 BubbleMenu JSX를 분리

import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Link,
    Quote,
    ImageIcon,
    Copy,
    Clipboard,
    MoreHorizontal
} from 'lucide-react';
import { Logger } from '../../../../../../shared/logger';
import { clipboardService } from '../services/ClipboardService';
import { DragDropHandler } from '../handlers/DragDropHandler';

interface EditorBubbleMenuProps {
    editor: Editor;
}

const BUBBLE_STYLES = {
    bubble: 'flex flex-nowrap gap-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-visible whitespace-nowrap',
    button: 'px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors flex items-center justify-center min-w-[30px]',
    activeButton: 'px-2 py-1 text-sm bg-blue-200 dark:bg-blue-800 rounded transition-colors flex items-center justify-center min-w-[30px]',
    divider: 'w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1'
} as const;

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps): React.ReactElement {
    // 🔥 포맷팅 버튼 핸들러들
    const handleBold = () => {
        editor.chain().focus().toggleBold().run();
    };

    const handleItalic = () => {
        editor.chain().focus().toggleItalic().run();
    };

    const handleUnderline = () => {
        editor.chain().focus().toggleUnderline().run();
    };

    const handleStrike = () => {
        editor.chain().focus().toggleStrike().run();
    };

    const handleCode = () => {
        editor.chain().focus().toggleCode().run();
    };

    const handleQuote = () => {
        editor.chain().focus().toggleBlockquote().run();
    };

    const handleHeading = () => {
        editor.chain().focus().setHeading({ level: 2 }).run();
    };

    // 🔥 이미지 추가 핸들러
    const handleImageAdd = async () => {
        try {
            await DragDropHandler.uploadFromFilePicker(editor);
            Logger.info('BUBBLE_MENU', 'Image upload initiated');
        } catch (error) {
            Logger.error('BUBBLE_MENU', 'Failed to upload image', error);
        }
    };

    // 🔥 클립보드 핸들러들
    const handleCopy = async () => {
        try {
            const result = await clipboardService.copySelectedText(editor);
            if (result.success) {
                Logger.info('BUBBLE_MENU', 'Text copied to clipboard');
            }
        } catch (error) {
            Logger.error('BUBBLE_MENU', 'Failed to copy text', error);
        }
    };

    const handlePaste = async () => {
        try {
            const result = await clipboardService.pasteToEditor(editor);
            if (result.success) {
                Logger.info('BUBBLE_MENU', 'Text pasted from clipboard');
            }
        } catch (error) {
            Logger.error('BUBBLE_MENU', 'Failed to paste text', error);
        }
    };

    // 🔥 링크 핸들러 (TODO: 링크 다이얼로그 구현 필요)
    const handleLink = () => {
        Logger.info('BUBBLE_MENU', 'Link feature - dialog implementation needed');
        // TODO: 링크 다이얼로그 모달 구현
    };

    return (
        <BubbleMenu
            editor={editor}
            className={BUBBLE_STYLES.bubble}
            shouldShow={({ from, to }) => from !== to} // 텍스트가 선택되었을 때만 표시
        >
            {/* 기본 포맷팅 버튼들 */}
            <button
                onClick={handleBold}
                className={editor.isActive('bold') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="볼드 (Ctrl+B)"
            >
                <Bold size={14} />
            </button>

            <button
                onClick={handleItalic}
                className={editor.isActive('italic') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="이탤릭 (Ctrl+I)"
            >
                <Italic size={14} />
            </button>

            <button
                onClick={handleUnderline}
                className={editor.isActive('underline') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="언더라인 (Ctrl+U)"
            >
                <UnderlineIcon size={14} />
            </button>

            <button
                onClick={handleStrike}
                className={editor.isActive('strike') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="취소선 (Ctrl+Shift+S)"
            >
                <Strikethrough size={14} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 고급 포맷팅 */}
            <button
                onClick={handleCode}
                className={editor.isActive('code') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="인라인 코드 (Ctrl+`)"
            >
                <Code size={14} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 링크 버튼 */}
            <button
                onClick={handleLink}
                className={editor.isActive('link') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="링크 추가"
            >
                <Link size={14} />
            </button>

            {/* 인용구 버튼 */}
            <button
                onClick={handleQuote}
                className={editor.isActive('blockquote') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="인용구"
            >
                <Quote size={14} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 이미지 추가 버튼 */}
            <button
                onClick={handleImageAdd}
                className={BUBBLE_STYLES.button}
                title="이미지 추가"
            >
                <ImageIcon size={14} />
            </button>

            {/* 복사 버튼 */}
            <button
                onClick={handleCopy}
                className={BUBBLE_STYLES.button}
                title="선택한 텍스트 복사"
            >
                <Copy size={14} />
            </button>

            {/* 클립보드에서 붙여넣기 버튼 */}
            <button
                onClick={handlePaste}
                className={BUBBLE_STYLES.button}
                title="클립보드에서 붙여넣기"
            >
                <Clipboard size={14} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 추가 옵션 (헤딩 설정) */}
            <button
                onClick={handleHeading}
                className={BUBBLE_STYLES.button}
                title="헤딩 설정"
            >
                <MoreHorizontal size={14} />
            </button>
        </BubbleMenu>
    );
}

export default EditorBubbleMenu;
