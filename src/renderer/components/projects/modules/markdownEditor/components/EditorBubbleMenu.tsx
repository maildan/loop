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
    bubble: 'flex flex-wrap items-center gap-2 px-3 py-2 bg-[var(--toolbar-bg)]/95 text-[color:var(--toolbar-foreground)] border border-[color:var(--toolbar-border)] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md z-[1600] whitespace-nowrap',
    button: 'min-w-[2.75rem] px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-colors bg-transparent text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] hover:text-[color:var(--toolbar-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/40 focus-visible:ring-offset-0 flex items-center justify-center gap-1',
    activeButton: 'min-w-[2.75rem] px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-[var(--button-active)] text-[color:var(--editor-accent)] shadow-inner transition-colors flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/50 focus-visible:ring-offset-0',
    divider: 'w-px h-6 bg-[color:var(--toolbar-divider)]/70 mx-1.5'
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
        editor.chain().focus().toggleMark('underline').run();
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
                type="button"
                onClick={handleBold}
                className={editor.isActive('bold') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="볼드 (Ctrl+B)"
            >
                <Bold size={16} />
            </button>

            <button
                type="button"
                onClick={handleItalic}
                className={editor.isActive('italic') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="이탤릭 (Ctrl+I)"
            >
                <Italic size={16} />
            </button>

            <button
                type="button"
                onClick={handleUnderline}
                className={editor.isActive('underline') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="언더라인 (Ctrl+U)"
            >
                <UnderlineIcon size={16} />
            </button>

            <button
                type="button"
                onClick={handleStrike}
                className={editor.isActive('strike') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="취소선 (Ctrl+Shift+S)"
            >
                <Strikethrough size={16} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 고급 포맷팅 */}
            <button
                type="button"
                onClick={handleCode}
                className={editor.isActive('code') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="인라인 코드 (Ctrl+`)"
            >
                <Code size={16} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 링크 버튼 */}
            <button
                type="button"
                onClick={handleLink}
                className={editor.isActive('link') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="링크 추가"
            >
                <Link size={16} />
            </button>

            {/* 인용구 버튼 */}
            <button
                type="button"
                onClick={handleQuote}
                className={editor.isActive('blockquote') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button}
                title="인용구"
            >
                <Quote size={16} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 이미지 추가 버튼 */}
            <button
                type="button"
                onClick={handleImageAdd}
                className={BUBBLE_STYLES.button}
                title="이미지 추가"
            >
                <ImageIcon size={16} />
            </button>

            {/* 복사 버튼 */}
            <button
                type="button"
                onClick={handleCopy}
                className={BUBBLE_STYLES.button}
                title="선택한 텍스트 복사"
            >
                <Copy size={16} />
            </button>

            {/* 클립보드에서 붙여넣기 버튼 */}
            <button
                type="button"
                onClick={handlePaste}
                className={BUBBLE_STYLES.button}
                title="클립보드에서 붙여넣기"
            >
                <Clipboard size={16} />
            </button>

            {/* 구분선 */}
            <div className={BUBBLE_STYLES.divider} />

            {/* 추가 옵션 (헤딩 설정) */}
            <button
                type="button"
                onClick={handleHeading}
                className={BUBBLE_STYLES.button}
                title="헤딩 설정"
            >
                <MoreHorizontal size={16} />
            </button>
        </BubbleMenu>
    );
}

export default EditorBubbleMenu;
