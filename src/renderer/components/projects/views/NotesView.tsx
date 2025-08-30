'use client';

// 🔥 기가차드 노트 뷰 - 드래그, 크기조절, 타입별 생성 완전 개선

import React, { useState, useRef, useCallback } from 'react';
import { ProjectNote } from '../../../../shared/types';
import { Plus, Edit3, Save, X as XIcon, Lightbulb, Target, BookOpen, StickyNote, Palette, Move, Maximize2 } from 'lucide-react';
import { Logger } from '../../../../shared/logger';
import { useLongPress } from '../../../hooks/useLongPress';

interface NotesViewProps {
  projectId: string;
  notes?: ProjectNote[];
  onNotesChange?: (notes: ProjectNote[]) => void;
}

interface NotePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 🔥 기가차드 작가 친화적 노트 스타일
const NOTES_STYLES = {
  container: 'flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',

  // 🔥 개선된 헤더
  header: 'p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700/50',
  headerTop: 'flex items-center justify-between mb-4',
  title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
  subtitle: 'text-slate-600 dark:text-gray-400 leading-relaxed',

  // 🔥 통계 카드
  statsGrid: 'grid grid-cols-4 gap-4 mt-4',
  statCard: 'p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700',
  statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mb-2',
  statValue: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  statLabel: 'text-xs text-slate-600 dark:text-gray-400',

  // 🔥 컨텐츠 영역
  content: 'flex-1 relative overflow-hidden',

  // 🔥 개선된 타입 필터
  typeButtons: 'flex gap-3 mb-6 flex-wrap',
  typeButton: 'flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 dark:border-gray-700 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 cursor-pointer',
  typeButtonActive: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md',

  // 🔥 캔버스 영역 (드래그 가능)
  canvas: 'absolute inset-0 overflow-auto p-6',

  // 🔥 개선된 노트 카드 (드래그 가능, 크기 조절 가능)
  noteCard: 'absolute group select-none bg-gradient-to-br shadow-lg rounded-xl border-2 transition-all duration-200 cursor-move',
  noteCardIdea: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-300 dark:border-yellow-700',
  noteCardGoal: 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-700',
  noteCardReference: 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-700',
  noteCardHover: 'hover:shadow-xl hover:scale-105 hover:z-10',

  // 🔥 노트 헤더
  noteHeader: 'flex items-center justify-between p-4 border-b border-current/20',
  noteIcon: 'w-5 h-5 mr-2',
  noteTitle: 'font-bold text-gray-900 dark:text-gray-100 flex-1 text-sm',
  noteActions: 'flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',

  // 🔥 노트 컨텐츠
  noteContent: 'p-4 text-gray-700 dark:text-gray-300 text-xs leading-relaxed overflow-hidden',
  noteDate: 'text-xs text-gray-500 dark:text-gray-500 px-4 pb-3 font-medium',

  // 🔥 크기 조절 핸들
  resizeHandle: 'absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity',
  resizeIcon: 'w-3 h-3 text-gray-400',

  // 🔥 개선된 추가 버튼들
  addButtonsContainer: 'absolute bottom-6 right-6 flex flex-col gap-3',
  addButton: 'group relative flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl',
  addButtonIcon: 'w-5 h-5 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
  addButtonText: 'text-sm font-medium text-slate-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',

  // 🔥 편집 버튼 개선
  editButton: 'relative z-10 p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer',
  saveButton: 'relative z-10 p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors cursor-pointer',
  cancelButton: 'relative z-10 p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer',

  // 🔥 편집 인풋
  editInput: 'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500',
  editTextarea: 'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none',

  // 🔥 빈 상태
  emptyState: 'absolute inset-0 flex flex-col items-center justify-center text-center',
  emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
  emptyTitle: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
  emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed',
} as const;

// 기본 메모 데이터
const DEFAULT_NOTES: ProjectNote[] = [];

const NOTE_TYPES = [
  { id: 'all', label: '전체', icon: StickyNote },
  { id: 'idea', label: '아이디어', icon: Lightbulb },
  { id: 'goal', label: '목표', icon: Target },
  { id: 'reference', label: '참고', icon: BookOpen },
];

const NOTE_TYPE_STYLES = {
  idea: NOTES_STYLES.noteCardIdea,
  goal: NOTES_STYLES.noteCardGoal,
  reference: NOTES_STYLES.noteCardReference,
};

export function NotesView({ projectId, notes: propNotes, onNotesChange }: NotesViewProps): React.ReactElement {
  const [notes, setNotes] = useState<(ProjectNote & { position?: NotePosition })[]>(
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
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectNote>>({});
  const [dragData, setDragData] = useState<{ id: string; startX: number; startY: number; startMouseX: number; startMouseY: number } | null>(null);
  const [resizeData, setResizeData] = useState<{ id: string; startWidth: number; startHeight: number; startMouseX: number; startMouseY: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // 🔥 노트 편집 핸들러들
  const handleEditNote = useCallback((noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingId(noteId);
      setEditForm(note);
    }
  }, [notes]);

  const handleLongPressEdit = useCallback((noteId: string) => {
    handleEditNote(noteId);
    Logger.info('NOTES_VIEW', '🔥 롱프레스로 편집 모드 활성화', { noteId });
  }, [handleEditNote]);

  // 🔥 통계 계산
  const stats = {
    total: notes.length,
    ideas: notes.filter(note => note.type === 'idea').length,
    goals: notes.filter(note => note.type === 'goal').length,
    references: notes.filter(note => note.type === 'reference').length,
  };

  // 🔥 필터링된 노트
  const filteredNotes = selectedType === 'all'
    ? notes
    : notes.filter(note => note.type === selectedType);

  // 🔥 새 노트 추가 (타입별)
  const handleAddNote = useCallback((type: 'idea' | 'goal' | 'reference') => {
    const newNote = {
      id: Date.now().toString(),
      projectId,
      title: type === 'idea' ? '새 아이디어' : type === 'goal' ? '새 목표' : '새 참고사항',
      content: type === 'idea' ? '떠오른 아이디어를 기록하세요...' :
        type === 'goal' ? '달성하고 싶은 목표를 설정하세요...' :
          '참고할 자료나 정보를 기록하세요...',
      type,
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
    setEditForm(newNote);
    Logger.info('NOTES_VIEW', 'New note added', { id: newNote.id, type });
  }, [notes, projectId, onNotesChange]);

  // 🔥 드래그 시작
  const handleMouseDown = useCallback((e: React.MouseEvent, noteId: string) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;

    const note = notes.find(n => n.id === noteId);
    if (!note?.position) return;

    setDragData({
      id: noteId,
      startX: note.position.x,
      startY: note.position.y,
      startMouseX: e.clientX,
      startMouseY: e.clientY
    });
  }, [notes]);

  // 🔥 크기 조절 시작
  const handleResizeStart = useCallback((e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();

    const note = notes.find(n => n.id === noteId);
    if (!note?.position) return;

    setResizeData({
      id: noteId,
      startWidth: note.position.width,
      startHeight: note.position.height,
      startMouseX: e.clientX,
      startMouseY: e.clientY
    });
  }, [notes]);

  // 🔥 마우스 이동 처리
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragData) {
      const deltaX = e.clientX - dragData.startMouseX;
      const deltaY = e.clientY - dragData.startMouseY;

      setNotes(prev => prev.map(note =>
        note.id === dragData.id && note.position
          ? {
            ...note,
            position: {
              ...note.position,
              x: Math.max(0, dragData.startX + deltaX),
              y: Math.max(0, dragData.startY + deltaY)
            }
          }
          : note
      ));
    }

    if (resizeData) {
      const deltaX = e.clientX - resizeData.startMouseX;
      const deltaY = e.clientY - resizeData.startMouseY;

      setNotes(prev => prev.map(note =>
        note.id === resizeData.id && note.position
          ? {
            ...note,
            position: {
              ...note.position,
              width: Math.max(200, resizeData.startWidth + deltaX),
              height: Math.max(150, resizeData.startHeight + deltaY)
            }
          }
          : note
      ));
    }
  }, [dragData, resizeData]);

  // 🔥 마우스 업 처리
  const handleMouseUp = useCallback(() => {
    if (dragData || resizeData) {
      onNotesChange?.(notes);
    }
    setDragData(null);
    setResizeData(null);
  }, [dragData, resizeData, notes, onNotesChange]);

  // 🔥 이벤트 리스너 등록
  React.useEffect(() => {
    if (dragData || resizeData) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragData, resizeData, handleMouseMove, handleMouseUp]);

  // 🔥 편집 관련 함수들
  const handleEditStart = useCallback((note: ProjectNote) => {
    setEditingId(note.id);
    setEditForm(note);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingId && editForm) {
      const updatedNotes = notes.map(note =>
        note.id === editingId
          ? { ...note, ...editForm, updatedAt: new Date() }
          : note
      );
      setNotes(updatedNotes);
      onNotesChange?.(updatedNotes);
      setEditingId(null);
      setEditForm({});
    }
  }, [editingId, editForm, notes, onNotesChange]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditForm({});
  }, []);

  const handleDelete = useCallback((id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    onNotesChange?.(updatedNotes);
  }, [notes, onNotesChange]);

  return (
    <div className={NOTES_STYLES.container}>
      {/* 🔥 개선된 헤더 */}
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

        {/* 🔥 통계 카드 */}
        <div className={NOTES_STYLES.statsGrid}>
          <div className={NOTES_STYLES.statCard}>
            <StickyNote className={NOTES_STYLES.statIcon} />
            <div className={NOTES_STYLES.statValue}>{stats.total}</div>
            <div className={NOTES_STYLES.statLabel}>총 노트</div>
          </div>
          <div className={NOTES_STYLES.statCard}>
            <Lightbulb className={NOTES_STYLES.statIcon} />
            <div className={NOTES_STYLES.statValue}>{stats.ideas}</div>
            <div className={NOTES_STYLES.statLabel}>아이디어</div>
          </div>
          <div className={NOTES_STYLES.statCard}>
            <Target className={NOTES_STYLES.statIcon} />
            <div className={NOTES_STYLES.statValue}>{stats.goals}</div>
            <div className={NOTES_STYLES.statLabel}>목표</div>
          </div>
          <div className={NOTES_STYLES.statCard}>
            <BookOpen className={NOTES_STYLES.statIcon} />
            <div className={NOTES_STYLES.statValue}>{stats.references}</div>
            <div className={NOTES_STYLES.statLabel}>참고</div>
          </div>
        </div>

        {/* 🔥 타입 필터 */}
        <div className={NOTES_STYLES.typeButtons}>
          {NOTE_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className={`${NOTES_STYLES.typeButton} ${selectedType === id ? NOTES_STYLES.typeButtonActive : ''
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 캔버스 영역 */}
      <div className={NOTES_STYLES.content}>
        <div ref={canvasRef} className={NOTES_STYLES.canvas}>
          {filteredNotes.length === 0 ? (
            // 빈 상태
            <div className={NOTES_STYLES.emptyState}>
              <StickyNote className={NOTES_STYLES.emptyIcon} />
              <h2 className={NOTES_STYLES.emptyTitle}>
                {selectedType === 'all' ? '첫 번째 노트를 만들어보세요' : `${NOTE_TYPES.find(t => t.id === selectedType)?.label} 노트를 추가해보세요`}
              </h2>
              <p className={NOTES_STYLES.emptyDescription}>
                창작 과정에서 떠오르는 아이디어나 중요한 정보들을
                자유롭게 배치할 수 있는 캔버스입니다.
              </p>
            </div>
          ) : (
            // 노트들
            filteredNotes.map((note) => {
              const isEditing = editingId === note.id;
              const position = note.position || { x: 50, y: 50, width: 240, height: 180 };
              const Icon = note.type === 'idea' ? Lightbulb : note.type === 'goal' ? Target : BookOpen;
              const noteTypeStyle = NOTE_TYPE_STYLES[note.type as keyof typeof NOTE_TYPE_STYLES];

              // 🔥 드래그 및 편집 핸들러
              const handleNoteClick = () => {
                setEditingId(note.id);
                setEditForm(note);
              };

              const handleNoteDoubleClick = () => {
                handleLongPressEdit(note.id);
              };

              return (
                <div
                  key={note.id}
                  className={`${NOTES_STYLES.noteCard} ${noteTypeStyle} ${NOTES_STYLES.noteCardHover}`}
                  style={{
                    left: position.x,
                    top: position.y,
                    width: position.width,
                    height: position.height,
                    zIndex: dragData?.id === note.id ? 1000 : 1
                  }}
                  onClick={handleNoteClick}
                  onDoubleClick={handleNoteDoubleClick}
                  onMouseDown={(e) => {
                    handleMouseDown(e, note.id);
                  }}
                >
                  {/* 헤더 */}
                  <div className={NOTES_STYLES.noteHeader}>
                    <div className="flex items-center flex-1">
                      <Icon className={NOTES_STYLES.noteIcon} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className={NOTES_STYLES.editInput}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className={NOTES_STYLES.noteTitle}>{note.title}</span>
                      )}
                    </div>

                    <div className={NOTES_STYLES.noteActions}>
                      {isEditing ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSave();
                            }}
                            className={NOTES_STYLES.saveButton}
                          >
                            <Save size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCancel();
                            }}
                            className={NOTES_STYLES.cancelButton}
                          >
                            <XIcon size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStart(note);
                            }}
                            className={NOTES_STYLES.editButton}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(note.id);
                            }}
                            className={NOTES_STYLES.cancelButton}
                          >
                            <XIcon size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 컨텐츠 */}
                  <div className={NOTES_STYLES.noteContent}>
                    {isEditing ? (
                      <textarea
                        value={editForm.content || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                        className={NOTES_STYLES.editTextarea}
                        rows={6}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div>{note.content}</div>
                    )}
                  </div>

                  {/* 날짜 */}
                  <div className={NOTES_STYLES.noteDate}>
                    {note.updatedAt.toLocaleDateString()}
                  </div>

                  {/* 크기 조절 핸들 */}
                  <div
                    className={`${NOTES_STYLES.resizeHandle} resize-handle`}
                    onMouseDown={(e) => handleResizeStart(e, note.id)}
                  >
                    <Maximize2 className={NOTES_STYLES.resizeIcon} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 🔥 추가 버튼들 */}
        <div className={NOTES_STYLES.addButtonsContainer}>
          <button
            onClick={() => handleAddNote('idea')}
            className={NOTES_STYLES.addButton}
          >
            <Lightbulb className={NOTES_STYLES.addButtonIcon} />
            <span className={NOTES_STYLES.addButtonText}>아이디어</span>
          </button>
          <button
            onClick={() => handleAddNote('goal')}
            className={NOTES_STYLES.addButton}
          >
            <Target className={NOTES_STYLES.addButtonIcon} />
            <span className={NOTES_STYLES.addButtonText}>목표</span>
          </button>
          <button
            onClick={() => handleAddNote('reference')}
            className={NOTES_STYLES.addButton}
          >
            <BookOpen className={NOTES_STYLES.addButtonIcon} />
            <span className={NOTES_STYLES.addButtonText}>참고</span>
          </button>
        </div>
      </div>
    </div>
  );
}
