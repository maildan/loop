'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X as XIcon, Lightbulb, Target, BookOpen } from 'lucide-react';
import { NoteEditorProps, NOTES_STYLES } from './types';

export const NoteEditor = React.memo(({
    isVisible,
    noteType,
    onClose,
    onSave
}: NoteEditorProps): React.ReactElement => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 노트 타입에 따른 기본값 설정
    useEffect(() => {
        if (isVisible) {
            const defaultTitles = {
                idea: '새 아이디어',
                goal: '새 목표',
                reference: '새 참고사항'
            };

            const defaultContents = {
                idea: '떠오른 아이디어를 기록하세요...',
                goal: '달성하고 싶은 목표를 설정하세요...',
                reference: '참고할 자료나 정보를 기록하세요...'
            };

            setTitle(defaultTitles[noteType as keyof typeof defaultTitles] || '새 노트');
            setContent(defaultContents[noteType as keyof typeof defaultContents] || '내용을 입력하세요...');
        }
    }, [isVisible, noteType]);

    const handleSave = () => {
        if (title.trim() && content.trim()) {
            onSave(title.trim(), content.trim(), noteType);
            setTitle('');
            setContent('');
        }
    };

    const handleClose = () => {
        setTitle('');
        setContent('');
        onClose();
    };

    const getIcon = () => {
        switch (noteType) {
            case 'idea': return Lightbulb;
            case 'goal': return Target;
            case 'reference': return BookOpen;
            default: return Plus;
        }
    };

    const getTypeLabel = () => {
        switch (noteType) {
            case 'idea': return '아이디어';
            case 'goal': return '목표';
            case 'reference': return '참고자료';
            default: return '노트';
        }
    };

    if (!isVisible) return <></>;

    const Icon = getIcon();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:hsl(var(--foreground))]/55 backdrop-blur-sm">
            <div className="bg-[color:hsl(var(--card))] text-[color:hsl(var(--card-foreground))] border border-[color:hsl(var(--border))] rounded-2xl shadow-[var(--shadow-xl)] p-6 w-full max-w-lg mx-4 transition-colors">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-[color:var(--accent-primary)]" />
                        <h3 className="text-xl font-bold text-[color:hsl(var(--foreground))]">
                            {getTypeLabel()} 추가
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))] rounded-lg transition-colors"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* 제목 입력 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-[color:hsl(var(--muted-foreground))] mb-2">
                        제목
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={NOTES_STYLES.editInput}
                        placeholder={`${getTypeLabel()} 제목을 입력하세요`}
                        autoFocus
                    />
                </div>

                {/* 내용 입력 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[color:hsl(var(--muted-foreground))] mb-2">
                        내용
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={NOTES_STYLES.editTextarea}
                        style={{ height: '120px' }}
                        placeholder={`${getTypeLabel()} 내용을 입력하세요`}
                    />
                </div>

                {/* 버튼들 */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))] rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!title.trim() || !content.trim()}
                        className="px-6 py-2 bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover,#1d4ed8)] text-[color:var(--text-inverse,#ffffff)] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 hover:scale-105 shadow-[var(--shadow-md)]"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
});

NoteEditor.displayName = 'NoteEditor';