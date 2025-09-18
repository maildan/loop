import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { IdeaItem } from './types';

interface QuickCaptureProps {
    onAddIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const IDEA_STYLES = {
    quickCapture: 'p-4 border-b border-slate-200 dark:border-gray-700',
    captureContainer: 'flex gap-3',
    captureInput: 'flex-1 px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400',
    captureButton: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap min-w-[80px] flex items-center gap-2',
};

export function QuickCapture({ onAddIdea }: QuickCaptureProps) {
    const [quickInput, setQuickInput] = useState('');

    const handleQuickCapture = () => {
        if (!quickInput.trim()) return;

        const newIdea: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'> = {
            title: quickInput.trim(),
            content: '',
            category: 'other',
            stage: 'initial',
            tags: [],
            priority: 'medium',
            connections: [],
            attachments: [],
            notes: '',
            isFavorite: false,
        };

        onAddIdea(newIdea);
        setQuickInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleQuickCapture();
        }
    };

    return (
        <div className={IDEA_STYLES.quickCapture}>
            <div className={IDEA_STYLES.captureContainer}>
                <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="빠른 아이디어 메모... (Ctrl+Enter로 저장)"
                    className={IDEA_STYLES.captureInput}
                />
                <button
                    onClick={handleQuickCapture}
                    disabled={!quickInput.trim()}
                    className={IDEA_STYLES.captureButton}
                >
                    <Plus className="w-4 h-4" />
                    <span>저장</span>
                </button>
            </div>
        </div>
    );
}