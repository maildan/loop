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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {getTypeLabel()} 추가
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* 제목 입력 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!title.trim() || !content.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
});

NoteEditor.displayName = 'NoteEditor';