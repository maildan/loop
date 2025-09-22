// 🔥 ClipboardService - 클립보드 처리 전담 서비스
// 기존 MarkdownEditor.tsx의 중복된 클립보드 로직을 통합

import { Editor } from '@tiptap/react';
import { Logger } from '../../../../../../shared/logger';

export interface ClipboardResult {
    success: boolean;
    error?: string;
    data?: string | File;
}

export class ClipboardService {
    private static instance: ClipboardService;

    private constructor() { }

    public static getInstance(): ClipboardService {
        if (!ClipboardService.instance) {
            ClipboardService.instance = new ClipboardService();
        }
        return ClipboardService.instance;
    }

    // 🔥 텍스트 복사
    public async copyText(text: string): Promise<ClipboardResult> {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                Logger.info('CLIPBOARD_SERVICE', 'Text copied successfully');
                return { success: true, data: text };
            } else {
                // 폴백: execCommand 방식
                return this.fallbackCopyText(text);
            }
        } catch (error) {
            Logger.error('CLIPBOARD_SERVICE', 'Failed to copy text', error);
            return { success: false, error: String(error) };
        }
    }

    // 🔥 텍스트 붙여넣기
    public async pasteText(): Promise<ClipboardResult> {
        try {
            const text = await navigator.clipboard.readText();
            Logger.info('CLIPBOARD_SERVICE', 'Text pasted successfully');
            return { success: true, data: text };
        } catch (error) {
            Logger.error('CLIPBOARD_SERVICE', 'Failed to paste text', error);
            return { success: false, error: String(error) };
        }
    }

    // 🔥 이미지 처리 (클립보드에서)
    public async handleImagePaste(editor: Editor, clipboardData: DataTransfer): Promise<ClipboardResult> {
        try {
            const items = Array.from(clipboardData.items);

            for (const item of items) {
                if (item.type.indexOf('image') === 0) {
                    const file = item.getAsFile();
                    if (file) {
                        const result = await this.processImageFile(editor, file);
                        if (result.success) {
                            return result;
                        }
                    }
                }
            }

            return { success: false, error: 'No image found in clipboard' };
        } catch (error) {
            Logger.error('CLIPBOARD_SERVICE', 'Failed to handle image paste', error);
            return { success: false, error: String(error) };
        }
    }

    // 🔥 드래그앤드롭 이미지 처리
    public async handleImageDrop(editor: Editor, files: FileList): Promise<ClipboardResult> {
        try {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

            if (imageFiles.length === 0) {
                return { success: false, error: 'No image files found' };
            }

            const results = await Promise.all(
                imageFiles.map(file => this.processImageFile(editor, file))
            );

            const successCount = results.filter(r => r.success).length;
            Logger.info('CLIPBOARD_SERVICE', `Processed ${successCount}/${imageFiles.length} images`);

            return {
                success: successCount > 0,
                data: `${successCount} images processed`
            };
        } catch (error) {
            Logger.error('CLIPBOARD_SERVICE', 'Failed to handle image drop', error);
            return { success: false, error: String(error) };
        }
    }

    // 🔥 에디터에서 선택된 텍스트 복사
    public async copySelectedText(editor: Editor): Promise<ClipboardResult> {
        try {
            const selectedText = editor.state.doc.textBetween(
                editor.state.selection.from,
                editor.state.selection.to
            );

            if (!selectedText) {
                return { success: false, error: 'No text selected' };
            }

            return await this.copyText(selectedText);
        } catch (error) {
            Logger.error('CLIPBOARD_SERVICE', 'Failed to copy selected text', error);
            return { success: false, error: String(error) };
        }
    }

    // 🔥 에디터에 텍스트 붙여넣기
    public async pasteToEditor(editor: Editor): Promise<ClipboardResult> {
        try {
            const result = await this.pasteText();
            if (result.success && result.data) {
                editor.chain().focus().insertContent(result.data as string).run();
                Logger.info('CLIPBOARD_SERVICE', 'Text pasted to editor');
                return { success: true, data: result.data };
            }
            return result;
        } catch (error) {
            Logger.error('CLIPBOARD_SERVICE', 'Failed to paste to editor', error);
            return { success: false, error: String(error) };
        }
    }

    // 🔥 Private helper methods

    private async processImageFile(editor: Editor, file: File): Promise<ClipboardResult> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const src = e.target?.result as string;
                if (src) {
                    try {
                        // 🔥 React DOM 에러 방지를 위한 안전한 처리
                        setTimeout(() => {
                            if (editor && !editor.isDestroyed) {
                                // insertContent 방식으로 변경하여 DOM 조작 안전성 확보
                                const imageHtml = `<img src="${src}" alt="Uploaded image" />`;
                                editor.chain().focus().insertContent(imageHtml).run();
                                Logger.info('CLIPBOARD_SERVICE', 'Image added to editor safely');
                                resolve({ success: true, data: src });
                            } else {
                                resolve({ success: false, error: 'Editor is destroyed' });
                            }
                        }, 0);
                    } catch (error) {
                        Logger.error('CLIPBOARD_SERVICE', 'Failed to insert image', error);
                        resolve({ success: false, error: String(error) });
                    }
                } else {
                    resolve({ success: false, error: 'Failed to read image file' });
                }
            };
            reader.onerror = () => {
                resolve({ success: false, error: 'Failed to read image file' });
            };
            reader.readAsDataURL(file);
        });
    }

    private fallbackCopyText(text: string): ClipboardResult {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (success) {
                Logger.info('CLIPBOARD_SERVICE', 'Text copied via fallback method');
                return { success: true, data: text };
            } else {
                return { success: false, error: 'execCommand failed' };
            }
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }
}

export const clipboardService = ClipboardService.getInstance();
