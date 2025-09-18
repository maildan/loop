import React from 'react';
import { LucideIcon, StickyNote, Lightbulb, Target, BookOpen } from 'lucide-react';
import { ProjectNote } from '../../../../../shared/types';

export interface NotesViewProps {
    projectId: string;
    notes?: ProjectNote[];
    onNotesChange?: (notes: ProjectNote[]) => void;
    onBack?: () => void;
}

export interface NotePosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface NoteWithPosition extends ProjectNote {
    position?: NotePosition;
}

export interface NoteType {
    id: string;
    label: string;
    icon: LucideIcon;
}

export interface NoteCardProps {
    note: NoteWithPosition;
    editingNoteId: string | null;
    onEdit: (id: string) => void;
    onSave: (id: string, title: string, content: string) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
    onMove: (id: string, position: NotePosition) => void;
    onResize: (id: string, size: { width: number; height: number }) => void;
}

export interface NoteEditorProps {
    isVisible: boolean;
    noteType: string;
    onClose: () => void;
    onSave: (title: string, content: string, type: string) => void;
}

export interface NoteStatsProps {
    notes: ProjectNote[];
}

export interface NoteToolbarProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
}

// 작가에게 유용한 기본 노트 템플릿
export const DEFAULT_NOTES: ProjectNote[] = [
    {
        id: 'template-idea-1',
        projectId: 'global_notes',
        title: '캐릭터 아이디어',
        content: '주인공의 숨겨진 과거나 트라우마가 현재 행동에 미치는 영향을 탐구해보세요. 독자가 공감할 수 있는 구체적인 경험을 설정하면 캐릭터가 더 생생해집니다.',
        type: 'idea',
        tags: ['캐릭터', '배경스토리', '심리'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 'template-goal-1',
        projectId: 'global_notes',
        title: '이번 주 창작 목표',
        content: '1. 주인공의 성격 확립하기\n2. 갈등의 핵심 설정하기\n3. 첫 장 초안 완성하기\n4. 전체 플롯 개요 정리하기',
        type: 'goal',
        tags: ['목표', '진행상황'],
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
    },
    {
        id: 'template-reference-1',
        projectId: 'global_notes',
        title: '참고 자료',
        content: '장르별 참고작품이나 영감을 준 자료들을 정리해보세요. 톤앤매너, 문체, 구조 등에서 배울 점들을 메모하면 창작에 도움이 됩니다.',
        type: 'reference',
        tags: ['참고자료', '영감'],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
    }
];

export const NOTE_TYPES: NoteType[] = [
    { id: 'all', label: '전체', icon: StickyNote },
    { id: 'idea', label: '아이디어', icon: Lightbulb },
    { id: 'goal', label: '목표', icon: Target },
    { id: 'reference', label: '참고', icon: BookOpen },
];

// 🔥 작가 친화적 노트 스타일 - 창작 영감을 자극하는 디자인
export const NOTES_STYLES = {
    container: 'flex-1 overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',

    // 🔥 우아한 헤더
    header: 'p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-amber-200/60 dark:border-gray-700/60 shadow-sm',
    headerTop: 'flex items-center justify-between mb-6',
    title: 'text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent',
    subtitle: 'text-amber-700/80 dark:text-amber-300/80 leading-relaxed font-medium',

    // 🔥 아름다운 통계 카드
    statsGrid: 'grid grid-cols-4 gap-6 mt-6',
    statCard: 'p-4 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200',
    statIcon: 'w-6 h-6 text-amber-600 dark:text-amber-400 mb-3',
    statValue: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    statLabel: 'text-sm text-amber-700/70 dark:text-amber-300/70 font-medium',

    // 🔥 컨텐츠 영역
    content: 'flex-1 relative overflow-hidden',

    // 🔥 세련된 타입 필터
    typeButtons: 'flex gap-4 mb-8 flex-wrap',
    typeButton: 'flex items-center gap-3 px-6 py-3 text-sm font-semibold border-2 border-amber-200/60 dark:border-gray-600 rounded-2xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm',
    typeButtonActive: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 hover:from-amber-600 hover:to-orange-600 shadow-lg transform scale-105',

    // 🔥 창작 캔버스
    canvas: 'absolute inset-0 overflow-auto p-8',

    // 🔥 아름다운 노트 카드
    noteCard: 'absolute group select-none bg-gradient-to-br shadow-xl rounded-2xl border-2 transition-all duration-300 cursor-move backdrop-blur-sm',
    noteCardIdea: 'from-yellow-100/90 to-amber-100/90 dark:from-yellow-900/40 dark:to-amber-900/40 border-yellow-300/60 dark:border-yellow-600/60',
    noteCardGoal: 'from-emerald-100/90 to-green-100/90 dark:from-emerald-900/40 dark:to-green-900/40 border-emerald-300/60 dark:border-emerald-600/60',
    noteCardReference: 'from-blue-100/90 to-cyan-100/90 dark:from-blue-900/40 dark:to-cyan-900/40 border-blue-300/60 dark:border-blue-600/60',
    noteCardHover: 'hover:shadow-2xl hover:scale-105 hover:z-20 hover:-rotate-1',

    // 🔥 노트 헤더
    noteHeader: 'flex items-center justify-between p-5 border-b border-current/20',
    noteIcon: 'w-5 h-5 mr-3',
    noteTitle: 'font-bold text-gray-900 dark:text-gray-100 flex-1 text-base leading-tight',
    noteActions: 'flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200',

    // 🔥 노트 컨텐츠
    noteContent: 'p-5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-hidden',
    noteDate: 'text-xs text-gray-500 dark:text-gray-400 px-5 pb-4 font-medium italic',

    // 🔥 크기 조절 핸들
    resizeHandle: 'absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tl from-gray-400/30 to-transparent rounded-tl-lg',
    resizeIcon: 'w-4 h-4 text-gray-500 absolute bottom-1 right-1',

    // 🔥 매력적인 추가 버튼들
    addButtonsContainer: 'absolute bottom-8 right-8 flex flex-col gap-4',
    addButton: 'group relative flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-white to-amber-50/80 dark:from-gray-800 dark:to-amber-900/20 border-2 border-dashed border-amber-300/60 dark:border-amber-600/60 rounded-2xl hover:border-amber-400 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105',
    addButtonIcon: 'w-6 h-6 text-amber-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors',
    addButtonText: 'text-sm font-semibold text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors',

    // 🔥 세련된 편집 버튼
    editButton: 'relative z-10 p-2 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-200 hover:scale-110',
    saveButton: 'relative z-10 p-2 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-200 hover:scale-110',
    cancelButton: 'relative z-10 p-2 text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-200 hover:scale-110',

    // 🔥 편집 인풋
    editInput: 'w-full px-3 py-2 text-sm border-2 border-amber-300 dark:border-amber-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
    editTextarea: 'w-full px-3 py-2 text-sm border-2 border-amber-300 dark:border-amber-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none',

    // 🔥 영감을 주는 빈 상태
    emptyState: 'absolute inset-0 flex flex-col items-center justify-center text-center',
    emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
    emptyTitle: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
    emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed',
} as const;

export const NOTE_TYPE_STYLES = {
    idea: NOTES_STYLES.noteCardIdea,
    goal: NOTES_STYLES.noteCardGoal,
    reference: NOTES_STYLES.noteCardReference,
};