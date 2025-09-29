import React from 'react';
import { Edit2, Trash2, Hash, FileText, Bookmark } from 'lucide-react';
import { ProjectStructure } from '../../../../../shared/types';

const TYPE_ICONS = {
    chapter: Hash,
    synopsis: FileText,
    idea: Bookmark,
} as const;

const TYPE_LABELS = {
    chapter: '챕터',
    synopsis: '시놉시스',
    idea: '노트',
} as const;

interface StructureItemRendererProps {
    item: ProjectStructure;
    index: number;
    totalItems: number;
    isEditing: boolean;
    editTitle: string;
    onItemClick: (item: ProjectStructure) => void;
    onEditStart: (item: ProjectStructure) => void;
    onEditSave: (itemId: string) => void;
    onKeyPress: (e: React.KeyboardEvent, itemId: string) => void;
    onDelete: (itemId: string) => void;
    onEditTitleChange: (value: string) => void;
    STRUCTURE_STYLES: {
        structureItem: string;
        itemIcon: string;
        itemContent: string;
        itemTitle: string;
        itemType: string;
        itemActions: string;
        actionButton: string;
        editInput: string;
    };
}

export const StructureItemRenderer: React.FC<StructureItemRendererProps> = ({
    item,
    index,
    totalItems,
    isEditing,
    editTitle,
    onItemClick,
    onEditStart,
    onEditSave,
    onKeyPress,
    onDelete,
    onEditTitleChange,
    STRUCTURE_STYLES
}) => {
    const IconComponent = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] || Hash;
    const typeLabel = TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] || item.type;
    const isConnected = index < totalItems - 1;

    return (
        <div className="relative">
            {/* 🔥 연결선 표시 */}
            {isConnected && (
                <div className="absolute left-3 top-12 w-0.5 h-8 bg-[hsl(var(--accent-primary))]/50 z-10"></div>
            )}

            <div
                className={STRUCTURE_STYLES.structureItem}
                onClick={() => onItemClick(item)}
                style={{ cursor: 'pointer' }}
            >
                <IconComponent className={STRUCTURE_STYLES.itemIcon} />
                <div className={STRUCTURE_STYLES.itemContent}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => onEditTitleChange(e.target.value)}
                            onKeyDown={(e) => onKeyPress(e, item.id)}
                            onBlur={() => onEditSave(item.id)}
                            className={STRUCTURE_STYLES.editInput}
                            autoFocus
                        />
                    ) : (
                        <>
                            <div className={STRUCTURE_STYLES.itemTitle}>{item.title}</div>
                            <div className={STRUCTURE_STYLES.itemType}>{typeLabel}</div>
                        </>
                    )}
                </div>
                <div className={STRUCTURE_STYLES.itemActions}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditStart(item);
                        }}
                        className={STRUCTURE_STYLES.actionButton}
                        title="편집"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(item.id);
                        }}
                        className={STRUCTURE_STYLES.actionButton}
                        title="삭제"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};