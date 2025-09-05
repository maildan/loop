// StructureTab - 구조 관리 탭 컴포넌트
import React from 'react';
import { Plus, MoreHorizontal, FileText, Target, BookOpen } from 'lucide-react';
import { ProjectStructure } from '../../../../../../shared/types';
import { SIDEBAR_STYLES } from '../constants';

interface StructureTabProps {
    projectId: string;
    structure: ProjectStructure[];
    expandedSections: Set<string>;
    structureMenuId: string | null;
    editingId: string | null;
    editingTitle: string;
    onToggleSection: (sectionId: string) => void;
    onSetStructureMenuId: (id: string | null) => void;
    onAddStructure?: () => void;
    onAddNote?: () => void;
    onEditStructure?: (id: string) => void;
    onDeleteStructure?: (id: string, title: string) => void;
}

export function StructureTab({
    structure,
    onAddStructure,
    onAddNote,
    onSetStructureMenuId,
    structureMenuId,
}: StructureTabProps): React.ReactElement {

    return (
        <div className={SIDEBAR_STYLES.sectionContainer}>
            {/* 챕터 서브섹션 */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">챕터</h4>
                    <button
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={onAddStructure}
                        title="새 챕터 추가"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <div className={SIDEBAR_STYLES.structureList}>
                    {structure.filter(item => item.type === 'chapter' || !item.type).map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1.5 px-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors rounded group">
                            <div className="flex items-center gap-2 flex-1">
                                <FileText size={12} className="text-blue-500" />
                                <span className="truncate">{item.title}</span>
                            </div>
                            <button
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSetStructureMenuId(structureMenuId === item.id ? null : item.id);
                                }}
                            >
                                <MoreHorizontal size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 시놉시스 서브섹션 */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">시놉시스</h4>
                    <button
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={onAddStructure}
                        title="새 시놉시스 추가"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <div className={SIDEBAR_STYLES.structureList}>
                    {structure.filter(item => item.type === 'synopsis').map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1.5 px-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors rounded group">
                            <div className="flex items-center gap-2 flex-1">
                                <Target size={12} className="text-green-500" />
                                <span className="truncate">{item.title}</span>
                            </div>
                            <button
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSetStructureMenuId(structureMenuId === item.id ? null : item.id);
                                }}
                            >
                                <MoreHorizontal size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 메모 서브섹션 */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">메모</h4>
                    <button
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={onAddNote}
                        title="새 메모 추가"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <div className={SIDEBAR_STYLES.structureList}>
                    {structure.filter(item => item.type === 'section').map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1.5 px-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors rounded group">
                            <div className="flex items-center gap-2 flex-1">
                                <BookOpen size={12} className="text-yellow-500" />
                                <span className="truncate">{item.title}</span>
                            </div>
                            <button
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSetStructureMenuId(structureMenuId === item.id ? null : item.id);
                                }}
                            >
                                <MoreHorizontal size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
