'use client';

import React, { createContext, useContext, useRef, useCallback } from 'react';
import { Logger } from '../../../../shared/logger';
import { setupKoreanInputOptimization } from './MarkdownUtils';
import { getEditorOptions, getFocusModeOptions } from './EditorConfig';

interface EditorContextType {
  editorRef: React.RefObject<any>;
  initializeEditor: (editor: any) => void;
  getEditorOptions: () => any;
  getFocusModeOptions: () => any;
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
  const editorRef = useRef<any>(null);

  const initializeEditor = useCallback((editor: any) => {
    if (!editor || !editor.codemirror) return;
    
    try {
      Logger.debug('EDITOR', 'Initializing editor for Korean input optimization');
      
      // 🔥 한글 입력 최적화 설정
      setupKoreanInputOptimization(editor.codemirror);
      
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
