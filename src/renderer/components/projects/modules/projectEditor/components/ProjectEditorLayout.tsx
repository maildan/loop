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
    container: 'h-screen flex flex-col bg-[color:hsl(var(--background))] text-[color:hsl(var(--foreground))] transition-colors duration-200',

    // 헤더 (🔥 nav 중첩 문제 해결)
    header: 'flex items-center justify-between px-4 py-3 bg-[color:hsl(var(--card))] border-b border-[color:hsl(var(--border))] shadow-[var(--shadow-sm,0_10px_20px_rgba(15,23,42,0.08))] transition-colors duration-200',
    headerLeft: 'flex items-center gap-3',
    headerCenter: 'flex-1 max-w-md mx-auto',
    headerRight: 'flex items-center gap-2',

    // 메인 레이아웃
    main: 'relative flex flex-row flex-1 overflow-hidden min-w-0 min-h-0', // 🔥 min-h-0 추가: 부모 h 계산 정확화

    // 🔥 에디터 영역 수정 (한줄 문제, 스크롤 제한 해결)
    editorContainer: 'flex-1 flex flex-col h-full bg-[color:hsl(var(--background))] transition-colors duration-200 min-w-0', // 🔥 min-w-0 추가
    editorContent: 'flex-1 min-h-0 min-w-0 overflow-hidden', // 🔥 min-w-0 추가로 flex 영역 제대로 잡힘

    // UI 컨트롤
    iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/25 focus-visible:ring-offset-0',
    iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-[color:var(--accent-light,#dbeafe)] text-[color:var(--accent-primary)] shadow-[var(--shadow-sm,0_6px_14px_rgba(37,99,235,0.18))]',
    titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-[color:hsl(var(--muted-foreground))] text-[color:hsl(var(--foreground))]',

    // 🔥 백 버튼 개선 (중첩 문제 해결)
    backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))]/55 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-primary)]/25 focus-visible:ring-offset-0',
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
