// 🔥 ProjectEditorLayout - ProjectEditor의 레이아웃과 스타일을 담당
// 하드코딩된 스타일을 별도 컴포넌트로 분리

import React from 'react';

export interface ProjectEditorLayoutProps {
    children: React.ReactNode;
    className?: string;
}

// 🔥 기가차드 UI 문제점 해결된 스타일
export const WRITER_EDITOR_STYLES = {
    // 전체 레이아웃
    container: 'h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200',

    // 헤더 (🔥 nav 중첩 문제 해결)
    header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
    headerLeft: 'flex items-center gap-3',
    headerCenter: 'flex-1 max-w-md mx-auto',
    headerRight: 'flex items-center gap-2',

    // 메인 레이아웃
    main: 'flex flex-1 overflow-hidden',

    // 🔥 에디터 영역 수정 (한줄 문제, 스크롤 제한 해결)
    editorContainer: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200',
    editorContent: 'flex-1 min-h-0 overflow-hidden', // 🔥 min-h-0 추가로 flex 영역 제대로 잡힘

    // UI 컨트롤
    iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
    iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',

    // 🔥 백 버튼 개선 (중첩 문제 해결)
    backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors',
} as const;

export function ProjectEditorContainer({ children, className = '' }: ProjectEditorLayoutProps): React.ReactElement {
    return (
        <div className={`${WRITER_EDITOR_STYLES.container} ${className}`}>
            {children}
        </div>
    );
}

export function ProjectEditorHeader({ children, className = '' }: ProjectEditorLayoutProps): React.ReactElement {
    return (
        <header className={`${WRITER_EDITOR_STYLES.header} ${className}`}>
            {children}
        </header>
    );
}

export function ProjectEditorMain({ children, className = '' }: ProjectEditorLayoutProps): React.ReactElement {
    return (
        <main className={`${WRITER_EDITOR_STYLES.main} ${className}`}>
            {children}
        </main>
    );
}

export function ProjectEditorContent({ children, className = '' }: ProjectEditorLayoutProps): React.ReactElement {
    return (
        <div className={`${WRITER_EDITOR_STYLES.editorContainer} ${className}`}>
            <div className={WRITER_EDITOR_STYLES.editorContent}>
                {children}
            </div>
        </div>
    );
}

export default {
    Container: ProjectEditorContainer,
    Header: ProjectEditorHeader,
    Main: ProjectEditorMain,
    Content: ProjectEditorContent,
    STYLES: WRITER_EDITOR_STYLES,
};
