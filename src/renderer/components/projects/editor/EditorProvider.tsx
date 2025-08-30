'use client';

import React, { createContext, useContext, useRef, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import { Logger } from '../../../../shared/logger';
import { setupKoreanInputOptimization } from './MarkdownUtils';
import { getEditorOptions, getFocusModeOptions } from './EditorConfig';

interface EditorContextType {
  editorRef: React.RefObject<Editor | null>;
  initializeEditor: (editor: Editor) => void;
  getEditorOptions: () => Record<string, unknown>;
  getFocusModeOptions: () => Record<string, unknown>;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}

interface EditorProviderProps {
  children: React.ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps): React.ReactElement {
  const editorRef = useRef<Editor | null>(null);

  const initializeEditor = useCallback((editor: Editor) => {
    if (!editor) return;

    try {
      Logger.debug('EDITOR', 'Initializing editor for Korean input optimization');

      // 🔥 에디터 레퍼런스 저장
      editorRef.current = editor;

      // 에디터 참조 저장
      editorRef.current = editor;

      Logger.info('EDITOR', 'Editor initialized with Korean input optimization');
    } catch (error) {
      Logger.error('EDITOR', 'Failed to initialize editor', error);
    }
  }, []);

  const contextValue: EditorContextType = {
    editorRef,
    initializeEditor,
    getEditorOptions,
    getFocusModeOptions
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}
