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
    container: 'flex-1 overflow-hidden bg-[color:hsl(var(--background))]',

    // 🔥 우아한 헤더
    header: 'p-8 bg-[color:hsl(var(--card))]/85 backdrop-blur-md border-b border-[color:hsl(var(--border))] shadow-[var(--shadow-sm)] transition-colors',
    headerTop: 'flex items-center justify-between mb-6',
    title: 'text-3xl font-bold text-[color:var(--accent-primary)]',
    subtitle: 'text-[color:hsl(var(--muted-foreground))] leading-relaxed font-medium',

    // 🔥 아름다운 통계 카드
    statsGrid: 'grid grid-cols-4 gap-6 mt-6',
    statCard: 'p-4 rounded-2xl bg-[color:hsl(var(--card))] border border-[color:hsl(var(--border))] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-200',
    statIcon: 'w-6 h-6 text-[color:var(--accent-primary)] mb-3',
    statValue: 'text-2xl font-bold text-[color:hsl(var(--foreground))]',
    statLabel: 'text-sm text-[color:hsl(var(--muted-foreground))] font-medium',

    // 🔥 컨텐츠 영역
    content: 'flex-1 relative overflow-hidden',

    // 🔥 세련된 타입 필터
    typeButtons: 'flex gap-4 mb-8 flex-wrap',
    typeButton: 'flex items-center gap-3 px-6 py-3 text-sm font-semibold border border-[color:hsl(var(--border))] text-[color:hsl(var(--muted-foreground))] rounded-2xl hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))] transition-all duration-200 hover:scale-105 cursor-pointer shadow-[var(--shadow-sm)]',
    typeButtonActive: 'bg-[color:var(--accent-primary)] text-[color:var(--text-inverse,#ffffff)] border border-[color:var(--accent-primary)] shadow-[var(--shadow-md)] transform scale-105',

    // 🔥 창작 캔버스
    canvas: 'absolute inset-0 overflow-auto p-8',

    // 🔥 아름다운 노트 카드
    noteCard: 'absolute group select-none bg-[color:hsl(var(--card))] border border-[color:hsl(var(--border))] text-[color:hsl(var(--foreground))] shadow-[var(--shadow-md)] rounded-2xl transition-all duration-300 cursor-move backdrop-blur-sm',
    noteCardIdea: 'bg-[color:var(--accent-light,#dbeafe)] border-[color:var(--accent-primary)]/50 text-[color:var(--accent-dark,#1e40af)]',
    noteCardGoal: 'bg-[color:var(--success-light,#d1fae5)] border-[color:var(--success)]/45 text-[color:var(--success,#059669)]',
    noteCardReference: 'bg-[color:var(--warning-light,#fde68a)] border-[color:var(--warning)]/45 text-[color:var(--warning,#d97706)]',
    noteCardHover: 'hover:shadow-[var(--shadow-lg)] hover:scale-105 hover:z-20 hover:-rotate-1',

    // 🔥 노트 헤더
    noteHeader: 'flex items-center justify-between p-5 border-b border-[color:hsl(var(--border))]/60',
    noteIcon: 'w-5 h-5 mr-3 text-[color:var(--accent-primary)]',
    noteTitle: 'font-bold text-[color:hsl(var(--foreground))] flex-1 text-base leading-tight',
    noteActions: 'flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200',

    // 🔥 노트 컨텐츠
    noteContent: 'p-5 text-[color:hsl(var(--muted-foreground))] text-sm leading-relaxed overflow-hidden',
    noteDate: 'text-xs text-[color:hsl(var(--muted-foreground))]/75 px-5 pb-4 font-medium italic',

    // 🔥 크기 조절 핸들
    resizeHandle: 'absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity bg-[color:hsl(var(--muted))]/50 rounded-tl-lg',
    resizeIcon: 'w-4 h-4 text-[color:hsl(var(--muted-foreground))] absolute bottom-1 right-1',

    // 🔥 매력적인 추가 버튼들
    addButtonsContainer: 'absolute bottom-8 right-8 flex flex-col gap-4',
    addButton: 'group relative flex items-center gap-4 px-6 py-4 bg-[color:hsl(var(--card))] border border-dashed border-[color:hsl(var(--border))] rounded-2xl hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-light,#dbeafe)]/60 transition-all duration-300 cursor-pointer shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] hover:scale-105',
    addButtonIcon: 'w-6 h-6 text-[color:var(--accent-primary)] group-hover:text-[color:var(--accent-dark,#1e40af)] transition-colors',
    addButtonText: 'text-sm font-semibold text-[color:hsl(var(--muted-foreground))] group-hover:text-[color:hsl(var(--foreground))] transition-colors',

    // 🔥 세련된 편집 버튼
    editButton: 'relative z-10 p-2 text-[color:hsl(var(--muted-foreground))] hover:text-[color:var(--accent-primary)] hover:bg-[color:var(--accent-light,#dbeafe)]/60 rounded-xl transition-all duration-200 hover:scale-110',
    saveButton: 'relative z-10 p-2 text-[color:hsl(var(--muted-foreground))] hover:text-[color:var(--success)] hover:bg-[color:var(--success-light,#d1fae5)]/70 rounded-xl transition-all duration-200 hover:scale-110',
    cancelButton: 'relative z-10 p-2 text-[color:hsl(var(--muted-foreground))] hover:text-[color:var(--destructive)] hover:bg-[color:var(--error-light,#fee2e2)]/70 rounded-xl transition-all duration-200 hover:scale-110',

    // 🔥 편집 인풋
    editInput: 'w-full px-3 py-2 text-sm border border-[color:hsl(var(--border))] rounded-xl bg-[color:hsl(var(--card))] text-[color:hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-[color:var(--accent-primary)]',
    editTextarea: 'w-full px-3 py-2 text-sm border border-[color:hsl(var(--border))] rounded-xl bg-[color:hsl(var(--card))] text-[color:hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-[color:var(--accent-primary)] resize-none',

    // 🔥 영감을 주는 빈 상태
    emptyState: 'absolute inset-0 flex flex-col items-center justify-center text-center',
    emptyIcon: 'w-16 h-16 text-[color:hsl(var(--muted-foreground))] mb-4',
    emptyTitle: 'text-xl font-semibold text-[color:hsl(var(--foreground))] mb-2',
    emptyDescription: 'text-[color:hsl(var(--muted-foreground))] max-w-md mx-auto leading-relaxed',
} as const;

export const NOTE_TYPE_STYLES = {
    idea: NOTES_STYLES.noteCardIdea,
    goal: NOTES_STYLES.noteCardGoal,
    reference: NOTES_STYLES.noteCardReference,
};