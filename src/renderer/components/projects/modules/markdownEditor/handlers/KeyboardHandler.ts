// 🔥 KeyboardHandler - 키보드 이벤트 처리 전담
// 기존 MarkdownEditor.tsx의 복잡한 키보드 로직을 분리

import { Editor } from '@tiptap/react';
import { Logger } from '../../../../../../shared/logger';
import { markdownParserService } from '../services/MarkdownParserService';
import { clipboardService } from '../services/ClipboardService';

export interface KeyboardHandlers {
    handleKeyDown: (view: any, event: KeyboardEvent) => boolean;
    handleGlobalKeyDown: (event: KeyboardEvent) => void;
}

export class KeyboardHandler {
    private editor: Editor | null = null;
    private globalHandlerActive = false;

    constructor(editor: Editor) {
        this.editor = editor;
    }

    // 🔥 TipTap 에디터 키 다운 핸들러 (마크다운 구문 처리)
    public handleEditorKeyDown = (view: any, event: KeyboardEvent): boolean => {
        if (!this.editor || event.key !== ' ') return false;

        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);

        // 마크다운 파서 서비스 사용
        const handled = markdownParserService.parseMarkdown(this.editor, textBefore, $from.pos);

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
            return true;
        }

        return false;
    };

    // 🔥 전역 키보드 핸들러 (단축키 처리)
    public handleGlobalKeyDown = async (event: KeyboardEvent): Promise<void> => {
        if (!this.editor) return;

        const { key, ctrlKey, metaKey, shiftKey } = event;
        const modKey = ctrlKey || metaKey; // Windows: Ctrl, Mac: Cmd

        // 🔥 클립보드 단축키
        if (modKey && !shiftKey) {
            switch (key) {
                case 'c':
                    await this.handleCopy();
                    break;
                case 'v':
                    await this.handlePaste();
                    break;
                case 's':
                    this.handleSave();
                    event.preventDefault(); // 브라우저 기본 저장 방지
                    break;
            }
        }

        // 🔥 포맷팅 단축키
        if (modKey) {
            switch (key) {
                case 'b':
                    if (!shiftKey) {
                        this.editor.chain().focus().toggleBold().run();
                        event.preventDefault();
                    }
                    break;
                case 'i':
                    if (!shiftKey) {
                        this.editor.chain().focus().toggleItalic().run();
                        event.preventDefault();
                    }
                    break;
                case 'u':
                    if (!shiftKey) {
                        this.editor.chain().focus().toggleUnderline().run();
                        event.preventDefault();
                    }
                    break;
                case '`':
                    this.editor.chain().focus().toggleCode().run();
                    event.preventDefault();
                    break;
            }
        }

        // 🔥 기타 단축키
        if (key === 'Escape') {
            this.handleEscape();
        }
    };

    // 🔥 복사 처리
    private async handleCopy(): Promise<void> {
        if (!this.editor) return;

        try {
            const result = await clipboardService.copySelectedText(this.editor);
            if (result.success) {
                Logger.info('KEYBOARD_HANDLER', 'Text copied via keyboard shortcut');
            }
        } catch (error) {
            Logger.error('KEYBOARD_HANDLER', 'Failed to copy text', error);
        }
    }

    // 🔥 붙여넣기 처리
    private async handlePaste(): Promise<void> {
        if (!this.editor) return;

        try {
            const result = await clipboardService.pasteToEditor(this.editor);
            if (result.success) {
                Logger.info('KEYBOARD_HANDLER', 'Text pasted via keyboard shortcut');
            }
        } catch (error) {
            Logger.error('KEYBOARD_HANDLER', 'Failed to paste text', error);
        }
    }

    // 🔥 저장 처리
    private handleSave(): void {
        const saveEvent = new CustomEvent('project:save');
        window.dispatchEvent(saveEvent);
        Logger.info('KEYBOARD_HANDLER', 'Save triggered via keyboard shortcut');
    }

    // 🔥 ESC 키 처리 (포커스 모드 해제)
    private handleEscape(): void {
        const exitFocusEvent = new CustomEvent('editor:exitFocus');
        window.dispatchEvent(exitFocusEvent);
        Logger.info('KEYBOARD_HANDLER', 'ESC pressed - exit focus mode');
    }

    // 🔥 전역 이벤트 리스너 시작
    public startGlobalHandling(): void {
        if (this.globalHandlerActive) return;

        document.addEventListener('keydown', this.handleGlobalKeyDown);
        this.globalHandlerActive = true;
        Logger.debug('KEYBOARD_HANDLER', 'Global keyboard handling started');
    }

    // 🔥 전역 이벤트 리스너 정지
    public stopGlobalHandling(): void {
        if (!this.globalHandlerActive) return;

        document.removeEventListener('keydown', this.handleGlobalKeyDown);
        this.globalHandlerActive = false;
        Logger.debug('KEYBOARD_HANDLER', 'Global keyboard handling stopped');
    }

    // 🔥 정리
    public cleanup(): void {
        this.stopGlobalHandling();
        this.editor = null;
        Logger.debug('KEYBOARD_HANDLER', 'Keyboard handler cleaned up');
    }

    // 🔥 Getter
    public isGlobalHandlingActive(): boolean {
        return this.globalHandlerActive;
    }
}

export { KeyboardHandler as keyboardHandler };
