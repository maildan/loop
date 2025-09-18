'use client';

import React from 'react';
import { StickyNote, Plus, Lightbulb, Target, BookOpen } from 'lucide-react';
import { NoteCard } from './NoteCard';
import { NOTES_STYLES, NOTE_TYPES, NoteWithPosition } from './types';

interface NoteCanvasProps {
    notes: NoteWithPosition[];
    selectedType: string;
    editingNoteId: string | null;
    onNoteEdit: (id: string) => void;
    onNoteSave: (id: string, title: string, content: string) => void;
    onNoteCancel: () => void;
    onNoteDelete: (id: string) => void;
    onNoteMove: (id: string, position: { x: number; y: number; width: number; height: number }) => void;
    onNoteResize: (id: string, size: { width: number; height: number }) => void;
    onAddNote: (type: 'idea' | 'goal' | 'reference') => void;
}

export const NoteCanvas = React.memo(({
    notes,
    selectedType,
    editingNoteId,
    onNoteEdit,
    onNoteSave,
    onNoteCancel,
    onNoteDelete,
    onNoteMove,
    onNoteResize,
    onAddNote
}: NoteCanvasProps): React.ReactElement => {
    // 필터링된 노트
    const filteredNotes = selectedType === 'all'
        ? notes
        : notes.filter(note => note.type === selectedType);

    const addButtons = [
        { type: 'idea' as const, label: '아이디어', icon: Lightbulb },
        { type: 'goal' as const, label: '목표', icon: Target },
        { type: 'reference' as const, label: '참고자료', icon: BookOpen },
    ];

    return (
        <div className={NOTES_STYLES.content}>
            <div className={NOTES_STYLES.canvas}>
                {filteredNotes.length === 0 ? (
                    // 빈 상태
                    <div className={NOTES_STYLES.emptyState}>
                        <StickyNote className={NOTES_STYLES.emptyIcon} />
                        <h2 className={NOTES_STYLES.emptyTitle}>
                            {selectedType === 'all'
                                ? '첫 번째 노트를 만들어보세요'
                                : `${NOTE_TYPES.find(t => t.id === selectedType)?.label} 노트를 추가해보세요`
                            }
                        </h2>
                        <p className={NOTES_STYLES.emptyDescription}>
                            창작 과정에서 떠오르는 아이디어나 중요한 정보들을
                            자유롭게 배치할 수 있는 캔버스입니다.
                        </p>
                    </div>
                ) : (
                    // 노트들
                    filteredNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            editingNoteId={editingNoteId}
                            onEdit={onNoteEdit}
                            onSave={onNoteSave}
                            onCancel={onNoteCancel}
                            onDelete={onNoteDelete}
                            onMove={onNoteMove}
                            onResize={onNoteResize}
                        />
                    ))
                )}

                {/* 노트 추가 버튼들 */}
                <div className={NOTES_STYLES.addButtonsContainer}>
                    {addButtons.map(({ type, label, icon: Icon }) => (
                        <button
                            key={type}
                            onClick={() => onAddNote(type)}
                            className={NOTES_STYLES.addButton}
                        >
                            <Icon className={NOTES_STYLES.addButtonIcon} />
                            <span className={NOTES_STYLES.addButtonText}>{label} 추가</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

NoteCanvas.displayName = 'NoteCanvas';