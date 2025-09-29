import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { IdeaItem } from './types';

interface QuickCaptureProps {
    onAddIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const IDEA_STYLES = {
    quickCapture: 'border-b border-border bg-card/80 p-4',
    captureContainer: 'flex flex-col gap-3 sm:flex-row',
    captureInput: 'flex-1 rounded-lg border border-border bg-background px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-[hsl(var(--accent-primary))] focus:ring-2 focus:ring-[hsl(var(--accent-primary))]',
    captureButton: 'flex min-w-[80px] items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-6 py-3 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[var(--accent-hover)] disabled:pointer-events-none disabled:opacity-60',
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