// 🔥 현재 에디터 표시 헤더 컴포넌트

import React from 'react';
import { useStructureStore } from '../stores/useStructureStore';
import {
    FileText,
    Hash,
    Bookmark,
    StickyNote,
    Users,
    LayoutGrid,
    ChevronRight
} from 'lucide-react';

const EDITOR_ICONS = {
    chapter: Hash,
    synopsis: FileText,
    idea: Bookmark,
    notes: StickyNote,
    characters: Users,
    structure: LayoutGrid,
} as const;

const EDITOR_LABELS = {
    chapter: '장 편집',
    synopsis: '시놉시스',
    idea: '아이디어',
    notes: '노트',
    characters: '인물',
    structure: '구조 관리',
} as const;

export function CurrentEditorHeader(): React.ReactElement {
    const currentEditor = useStructureStore((state) => state.currentEditor);

    if (!currentEditor) {
        return (
            <div className="px-4 py-2 bg-slate-100 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                    <LayoutGrid className="w-4 h-4" />
                    <span>프로젝트 홈</span>
                </div>
            </div>
        );
    }

    const IconComponent = EDITOR_ICONS[currentEditor.editorType];
    const label = EDITOR_LABELS[currentEditor.editorType];

    return (
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-700/50">
            <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                </div>

                {currentEditor.itemTitle && (
                    <>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-700 dark:text-gray-300 font-medium">
                            {currentEditor.itemTitle}
                        </span>
                    </>
                )}

                <div className="ml-auto">
                    <div className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        활성
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentEditorHeader;
