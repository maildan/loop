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
        color: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
        label: '캐릭터'
    },
    plot: {
        color: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
        label: '플롯'
    },
    setting: {
        color: 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
        label: '설정'
    },
    dialogue: {
        color: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
        label: '대사'
    },
    theme: {
        color: 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700',
        label: '테마'
    },
    other: {
        color: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
        label: '기타'
    }
} as const;

// 🔥 개발 단계별 스타일 - 진행 상태를 나타내는 세련된 색상
export const STAGE_STYLES = {
    initial: {
        color: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500',
        label: '아이디어'
    },
    developing: {
        color: 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-600',
        label: '발전 중'
    },
    concrete: {
        color: 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600',
        label: '구체화'
    },
    applied: {
        color: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600',
        label: '적용됨'
    }
} as const;