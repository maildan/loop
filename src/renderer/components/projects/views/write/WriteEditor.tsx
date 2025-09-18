import React from 'react';
import { MarkdownEditor } from '../../editor/MarkdownEditor';
import type { WriteEditorProps } from './types';

const WRITE_EDITOR_STYLES = {
    editorContainer: 'flex-1 min-h-0 relative overflow-hidden',
    editorWrapper: 'h-full max-w-none mx-auto px-0',
    focusWrapper: 'h-full flex items-center justify-center',
    focusEditor: 'w-full max-w-4xl mx-auto px-8 py-16',
} as const;

export const WriteEditor = React.memo<WriteEditorProps>(({
    content,
    onChange,
    isFocusMode,
    typewriterMode,
    distractionFree
}) => {
    return (
        <div className={WRITE_EDITOR_STYLES.editorContainer}>
            <div className={isFocusMode ? WRITE_EDITOR_STYLES.focusWrapper : 'h-full'}>
                <div className={isFocusMode ? WRITE_EDITOR_STYLES.focusEditor : WRITE_EDITOR_STYLES.editorWrapper}>
                    <MarkdownEditor
                        content={content}
                        onChange={onChange}
                        isFocusMode={isFocusMode}
                        typewriterMode={typewriterMode}
                        distractionFree={distractionFree}
                    />
                </div>
            </div>
        </div>
    );
});

WriteEditor.displayName = 'WriteEditor';