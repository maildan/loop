'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Logger } from '../../../../../shared/logger';
import { useStructureStore } from '../../../../stores/useStructureStore';
import { NoteStats } from './NoteStats';
import { NoteToolbar } from './NoteToolbar';
import { NoteCanvas } from './NoteCanvas';
import { NotesViewProps, NoteWithPosition, NOTES_STYLES, DEFAULT_NOTES } from './types';

const NotesView = React.memo(({
    projectId: propProjectId,
    notes: propNotes,
    onNotesChange,
    onBack
}: NotesViewProps): React.ReactElement => {
    const currentEditor = useStructureStore((s) => s.currentEditor);
    const structures = useStructureStore((s) => s.structures);
    const projectId = propProjectId || currentEditor?.projectId || 'global_notes';

    // 초기 노트 데이터
    const [notes, setNotes] = useState<NoteWithPosition[]>(
        (propNotes || DEFAULT_NOTES).map((note, index) => ({
            ...note,
            projectId,
            position: {
                x: 50 + (index % 3) * 250,
                y: 50 + Math.floor(index / 3) * 200,
                width: 240,
                height: 180
            }
        }))
    );

    // UI 상태
    const [selectedType, setSelectedType] = useState<string>('all');
    const [editingId, setEditingId] = useState<string | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    // propNotes 변경 시 동기화
    useEffect(() => {
        if (propNotes) {
            const mapped = propNotes.map((note, index) => ({
                ...note,
                position: notes.find(n => n.id === note.id)?.position || {
                    x: 50 + (index % 3) * 250,
                    y: 50 + Math.floor(index / 3) * 200,
                    width: 240,
                    height: 180
                }
            }));
            setNotes(mapped);
        }
    }, [propNotes]);

    // ESC 키로 뒤로가기
    useEffect(() => {
        if (!onBack) return;

        const handleGlobalEscape = (event: CustomEvent): void => {
            Logger.info('NOTES_VIEW', 'ESC key pressed, going back');
            onBack();
            event.preventDefault();
        };

        window.addEventListener('global:escape', handleGlobalEscape as EventListener);
        return () => window.removeEventListener('global:escape', handleGlobalEscape as EventListener);
    }, [onBack]);

    // 노트 추가
    const handleAddNote = useCallback((type: 'idea' | 'goal' | 'reference') => {
        const newNote: NoteWithPosition = {
            id: Date.now().toString(),
            projectId,
            title: type === 'idea' ? '새 아이디어' : type === 'goal' ? '새 목표' : '새 참고사항',
            content: type === 'idea' ? '떠오른 아이디어를 기록하세요...' :
                type === 'goal' ? '달성하고 싶은 목표를 설정하세요...' :
                    '참고할 자료나 정보를 기록하세요...',
            type,
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            position: {
                x: Math.random() * 300 + 50,
                y: Math.random() * 200 + 50,
                width: 240,
                height: 180
            }
        };

        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        onNotesChange?.(updatedNotes);

        // 바로 편집 모드로 진입
        setEditingId(newNote.id);
        Logger.info('NOTES_VIEW', 'New note added', { id: newNote.id, type });
    }, [notes, projectId, onNotesChange]);

    // 노트 편집
    const handleNoteEdit = useCallback((noteId: string) => {
        setEditingId(noteId);
    }, []);

    // 노트 저장
    const handleNoteSave = useCallback((noteId: string, title: string, content: string) => {
        const updatedNotes = notes.map(note =>
            note.id === noteId
                ? { ...note, title, content, updatedAt: new Date() }
                : note
        );
        setNotes(updatedNotes);
        onNotesChange?.(updatedNotes);
        setEditingId(null);
    }, [notes, onNotesChange]);

    // 노트 편집 취소
    const handleNoteCancel = useCallback(() => {
        setEditingId(null);
    }, []);

    // 노트 삭제
    const handleNoteDelete = useCallback((id: string) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        onNotesChange?.(updatedNotes);
    }, [notes, onNotesChange]);

    // 노트 이동
    const handleNoteMove = useCallback((noteId: string, position: { x: number; y: number; width: number; height: number }) => {
        const updatedNotes = notes.map(note =>
            note.id === noteId
                ? { ...note, position }
                : note
        );
        setNotes(updatedNotes);
        onNotesChange?.(updatedNotes);
    }, [notes, onNotesChange]);

    // 노트 크기 조절
    const handleNoteResize = useCallback((noteId: string, size: { width: number; height: number }) => {
        const updatedNotes = notes.map(note =>
            note.id === noteId && note.position
                ? { ...note, position: { ...note.position, ...size } }
                : note
        );
        setNotes(updatedNotes);
        onNotesChange?.(updatedNotes);
    }, [notes, onNotesChange]);

    return (
        <div className={NOTES_STYLES.container}>
            {/* 헤더 */}
            <div className={NOTES_STYLES.header}>
                <div className={NOTES_STYLES.headerTop}>
                    <div>
                        <h1 className={NOTES_STYLES.title}>창작 노트</h1>
                        <p className={NOTES_STYLES.subtitle}>
                            아이디어, 목표, 참고사항을 자유롭게 배치하고 관리하세요.
                            드래그로 위치를 조정하고 크기를 조절할 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* 통계 */}
                <NoteStats notes={notes} />

                {/* 타입 필터 */}
                <NoteToolbar
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                />
            </div>

            {/* 캔버스 */}
            <NoteCanvas
                notes={notes}
                selectedType={selectedType}
                editingNoteId={editingId}
                onNoteEdit={handleNoteEdit}
                onNoteSave={handleNoteSave}
                onNoteCancel={handleNoteCancel}
                onNoteDelete={handleNoteDelete}
                onNoteMove={handleNoteMove}
                onNoteResize={handleNoteResize}
                onAddNote={handleAddNote}
            />
        </div>
    );
});

NotesView.displayName = 'NotesView';

export { NotesView };