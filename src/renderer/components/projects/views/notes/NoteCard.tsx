'use client';

import React, { useState } from 'react';
import { Edit3, Save, X as XIcon, Lightbulb, Target, BookOpen, Maximize2 } from 'lucide-react';
import { NoteCardProps, NOTES_STYLES, NOTE_TYPE_STYLES } from './types';

export const NoteCard = React.memo(({
    note,
    editingNoteId,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onMove,
    onResize
}: NoteCardProps): React.ReactElement => {
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);

    const isEditing = editingNoteId === note.id;
    const position = note.position || { x: 50, y: 50, width: 240, height: 180 };
    const Icon = note.type === 'idea' ? Lightbulb : note.type === 'goal' ? Target : BookOpen;
    const noteTypeStyle = NOTE_TYPE_STYLES[note.type as keyof typeof NOTE_TYPE_STYLES];

    const handleSave = () => {
        onSave(note.id, editTitle, editContent);
    };

    const handleCancel = () => {
        setEditTitle(note.title);
        setEditContent(note.content);
        onCancel();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.resize-handle')) return;
        if ((e.target as HTMLElement).closest('input')) return;
        if ((e.target as HTMLElement).closest('textarea')) return;
        if ((e.target as HTMLElement).closest('button')) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const deltaX = e.clientX - rect.left;
        const deltaY = e.clientY - rect.top;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newX = Math.max(0, moveEvent.clientX - deltaX);
            const newY = Math.max(0, moveEvent.clientY - deltaY);

            onMove(note.id, {
                ...position,
                x: newX,
                y: newY
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - e.clientX;
            const deltaY = moveEvent.clientY - e.clientY;

            const newWidth = Math.max(200, position.width + deltaX);
            const newHeight = Math.max(150, position.height + deltaY);

            onResize(note.id, { width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className={`${NOTES_STYLES.noteCard} ${noteTypeStyle} ${NOTES_STYLES.noteCardHover}`}
            style={{
                left: position.x,
                top: position.y,
                width: position.width,
                height: position.height,
            }}
            onMouseDown={handleMouseDown}
        >
            {/* 헤더 */}
            <div className={NOTES_STYLES.noteHeader}>
                <div className="flex items-center flex-1">
                    <Icon className={NOTES_STYLES.noteIcon} />
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className={NOTES_STYLES.editInput}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className={NOTES_STYLES.noteTitle}>{note.title}</span>
                    )}
                </div>

                {/* 액션 버튼들 */}
                <div className={NOTES_STYLES.noteActions}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                }}
                                className={NOTES_STYLES.saveButton}
                            >
                                <Save className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancel();
                                }}
                                className={NOTES_STYLES.cancelButton}
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(note.id);
                                setEditTitle(note.title);
                                setEditContent(note.content);
                            }}
                            className={NOTES_STYLES.editButton}
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* 내용 */}
            <div className={NOTES_STYLES.noteContent}>
                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={NOTES_STYLES.editTextarea}
                        style={{ height: position.height - 120 }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div style={{ maxHeight: position.height - 120, overflow: 'auto' }}>
                        {note.content}
                    </div>
                )}
            </div>

            {/* 날짜 */}
            <div className={NOTES_STYLES.noteDate}>
                {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) : ''}
            </div>

            {/* 크기 조절 핸들 */}
            <div
                className={`${NOTES_STYLES.resizeHandle} resize-handle`}
                onMouseDown={handleResizeStart}
            >
                <Maximize2 className={NOTES_STYLES.resizeIcon} />
            </div>
        </div>
    );
});

NoteCard.displayName = 'NoteCard';