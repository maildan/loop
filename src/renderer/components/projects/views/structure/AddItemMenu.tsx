import React from 'react';
import { Plus, ChevronDown, ChevronRight, Hash, FileText, Bookmark } from 'lucide-react';

const ADD_MENU_ITEMS = [
    { type: 'chapter', label: '새 장', icon: Hash, description: '스토리의 주요 단위' },
    { type: 'synopsis', label: '시놉시스', icon: FileText, description: '이야기 개요' },
    { type: 'idea', label: '노트', icon: Bookmark, description: '창작 노트 및 메모' },
] as const;

interface AddItemMenuProps {
    showAddMenu: boolean;
    onToggleMenu: () => void;
    onAddItem: (type: 'chapter' | 'synopsis' | 'idea') => void;
    STRUCTURE_STYLES: {
        addButton: string;
        addMenu: string;
        addMenuItem: string;
    };
}

export const AddItemMenu: React.FC<AddItemMenuProps> = ({
    showAddMenu,
    onToggleMenu,
    onAddItem,
    STRUCTURE_STYLES
}) => {
    return (
        <div className="mt-4">
            <button
                onClick={onToggleMenu}
                className={STRUCTURE_STYLES.addButton}
            >
                <Plus className="w-5 h-5" />
                <span>새 항목 추가</span>
                {showAddMenu ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {showAddMenu && (
                <div className={STRUCTURE_STYLES.addMenu}>
                    {ADD_MENU_ITEMS.map(({ type, label, icon: Icon, description }) => (
                        <div
                            key={type}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddItem(type);
                            }}
                            className={STRUCTURE_STYLES.addMenuItem}
                        >
                            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};