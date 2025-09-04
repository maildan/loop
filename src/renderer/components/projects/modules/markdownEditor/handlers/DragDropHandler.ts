// 🔥 DragDropHandler - 드래그앤드롭 이벤트 처리 전담
// 기존 MarkdownEditor.tsx의 복잡한 드래그앤드롭 로직을 분리

import { Editor } from '@tiptap/react';
import { Logger } from '../../../../../../shared/logger';
import { clipboardService } from '../services/ClipboardService';

export interface DragDropState {
    isDragOver: boolean;
    files: File[];
}

export interface DragDropHandlers {
    onDragEnter: (e: DragEvent) => void;
    onDragOver: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
}

export class DragDropHandler {
    private editor: Editor | null = null;
    private setState: ((state: Partial<DragDropState>) => void) | null = null;
    private element: HTMLElement | null = null;

    constructor(
        editor: Editor,
        setState: (state: Partial<DragDropState>) => void,
        element?: HTMLElement
    ) {
        this.editor = editor;
        this.setState = setState;
        this.element = element || (editor.view.dom as HTMLElement);
        this.setupEventListeners();
    }

    // 🔥 이벤트 리스너 설정
    private setupEventListeners(): void {
        if (!this.element) return;

        this.element.addEventListener('dragenter', this.handleDragEnter);
        this.element.addEventListener('dragover', this.handleDragOver);
        this.element.addEventListener('dragleave', this.handleDragLeave);
        this.element.addEventListener('drop', this.handleDrop);

        Logger.debug('DRAG_DROP_HANDLER', 'Event listeners attached');
    }

    // 🔥 이벤트 리스너 정리
    public cleanup(): void {
        if (!this.element) return;

        this.element.removeEventListener('dragenter', this.handleDragEnter);
        this.element.removeEventListener('dragover', this.handleDragOver);
        this.element.removeEventListener('dragleave', this.handleDragLeave);
        this.element.removeEventListener('drop', this.handleDrop);

        Logger.debug('DRAG_DROP_HANDLER', 'Event listeners cleaned up');
    }

    // 🔥 드래그 시작 핸들러
    private handleDragEnter = (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (!this.hasValidFiles(e.dataTransfer)) return;

        this.element?.classList.add('drag-over');
        this.setState?.({ isDragOver: true });

        Logger.debug('DRAG_DROP_HANDLER', 'Drag enter detected');
    };

    // 🔥 드래그 오버 핸들러
    private handleDragOver = (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        // 드래그 효과 설정
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
    };

    // 🔥 드래그 떠남 핸들러
    private handleDragLeave = (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        // 에디터 영역을 완전히 벗어날 때만 상태 변경
        if (!this.element?.contains(e.relatedTarget as Node)) {
            this.element?.classList.remove('drag-over');
            this.setState?.({ isDragOver: false });
            Logger.debug('DRAG_DROP_HANDLER', 'Drag leave detected');
        }
    };

    // 🔥 드롭 핸들러
    private handleDrop = async (e: DragEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        this.element?.classList.remove('drag-over');
        this.setState?.({ isDragOver: false });

        if (!this.editor || !e.dataTransfer) return;

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        Logger.info('DRAG_DROP_HANDLER', `Processing ${files.length} dropped files`);

        try {
            const result = await clipboardService.handleImageDrop(this.editor, files);
            if (result.success) {
                Logger.info('DRAG_DROP_HANDLER', 'Files processed successfully');
            } else {
                Logger.warn('DRAG_DROP_HANDLER', 'File processing failed', result.error);
            }
        } catch (error) {
            Logger.error('DRAG_DROP_HANDLER', 'Error processing dropped files', error);
        }
    };

    // 🔥 파일 유효성 검증
    private hasValidFiles(dataTransfer: DataTransfer | null): boolean {
        if (!dataTransfer) return false;

        const items = Array.from(dataTransfer.items);
        return items.some(item =>
            item.kind === 'file' && item.type.startsWith('image/')
        );
    }

    // 🔥 수동 파일 업로드 (파일 선택기)
    public static async uploadFromFilePicker(editor: Editor): Promise<void> {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;

            input.onchange = async (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                    const result = await clipboardService.handleImageDrop(editor, files);
                    if (result.success) {
                        Logger.info('DRAG_DROP_HANDLER', 'Files uploaded via file picker');
                    }
                }
                resolve();
            };

            input.oncancel = () => resolve();
            input.click();
        });
    }

    // 🔥 Getter methods
    public getEditor(): Editor | null {
        return this.editor;
    }

    public getElement(): HTMLElement | null {
        return this.element;
    }
}

export { DragDropHandler as dragDropHandler };
