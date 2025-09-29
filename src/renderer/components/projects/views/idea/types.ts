export interface IdeaItem {
    id: string;
    title: string;
    content: string;
    category: 'character' | 'plot' | 'setting' | 'dialogue' | 'theme' | 'other';
    stage: 'initial' | 'developing' | 'concrete' | 'applied';
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    connections: string[]; // 연결된 다른 아이디어 ID들
    attachments: string[]; // 이미지, 링크 등
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    isFavorite: boolean;
}

export interface IdeaViewProps {
    ideaId: string;
    onBack: () => void;
}

// 🔥 카테고리별 스타일 - 세련된 색상 팔레트
export const CATEGORY_STYLES = {
    character: {
        color: 'border border-[hsl(var(--chart-1))]/40 bg-[hsl(var(--chart-1))]/15 text-[hsl(var(--chart-1))]',
        label: '캐릭터'
    },
    plot: {
        color: 'border border-[hsl(var(--chart-2))]/40 bg-[hsl(var(--chart-2))]/15 text-[hsl(var(--chart-2))]',
        label: '플롯'
    },
    setting: {
        color: 'border border-[hsl(var(--chart-3))]/40 bg-[hsl(var(--chart-3))]/15 text-[hsl(var(--chart-3))]',
        label: '설정'
    },
    dialogue: {
        color: 'border border-[hsl(var(--chart-4))]/40 bg-[hsl(var(--chart-4))]/15 text-[hsl(var(--chart-4))]',
        label: '대사'
    },
    theme: {
        color: 'border border-[hsl(var(--chart-5))]/40 bg-[hsl(var(--chart-5))]/15 text-[hsl(var(--chart-5))]',
        label: '테마'
    },
    other: {
        color: 'border border-border bg-muted text-muted-foreground',
        label: '기타'
    }
} as const;

// 🔥 개발 단계별 스타일 - 진행 상태를 나타내는 세련된 색상
export const STAGE_STYLES = {
    initial: {
        color: 'border border-border bg-muted text-muted-foreground',
        label: '아이디어'
    },
    developing: {
        color: 'border border-[hsl(var(--chart-4))]/40 bg-[hsl(var(--chart-4))]/15 text-[hsl(var(--chart-4))]',
        label: '발전 중'
    },
    concrete: {
        color: 'border border-[hsl(var(--chart-3))]/40 bg-[hsl(var(--chart-3))]/15 text-[hsl(var(--chart-3))]',
        label: '구체화'
    },
    applied: {
        color: 'border border-[hsl(var(--chart-2))]/40 bg-[hsl(var(--chart-2))]/15 text-[hsl(var(--chart-2))]',
        label: '적용됨'
    }
} as const;