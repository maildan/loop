import React from 'react';
import { Hash, FileText, Bookmark } from 'lucide-react';
import { ProjectStructure } from '../../../../../shared/types';
import { FolderHeader } from './FolderHeader';
import { StructureItemRenderer } from './StructureItemRenderer';

const FOLDER_CONFIGS = {
    chapters: {
        title: '챕터',
        icon: Hash,
        type: 'chapter' as const
    },
    synopsis: {
        title: '시놉시스',
        icon: FileText,
        type: 'synopsis' as const
    },
    notes: {
        title: '노트',
        icon: Bookmark,
        type: 'idea' as const
    }
};

interface FolderSectionProps {
    folderId: keyof typeof FOLDER_CONFIGS;
    items: ProjectStructure[];
    collapsedFolders: Set<string>;
    editingId: string | null;
    editTitle: string;
    onToggleFolder: (folderId: string) => void;
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

export const FolderSection: React.FC<FolderSectionProps> = ({
    folderId,
    items,
    collapsedFolders,
    editingId,
    editTitle,
    onToggleFolder,
    onItemClick,
    onEditStart,
    onEditSave,
    onKeyPress,
    onDelete,
    onEditTitleChange,
    STRUCTURE_STYLES
}) => {
    const config = FOLDER_CONFIGS[folderId];
    const isCollapsed = collapsedFolders.has(folderId);

    if (items.length === 0) {
        return null;
    }

    return (
        <div>
            <FolderHeader
                folderType={folderId}
                title={config.title}
                icon={config.icon}
                count={items.length}
                isCollapsed={isCollapsed}
                onToggle={onToggleFolder}
            />

            {!isCollapsed && (
                <div className="ml-6 space-y-2">
                    {items.map((item, index) => (
                        <StructureItemRenderer
                            key={item.id}
                            item={item}
                            index={index}
                            totalItems={items.length}
                            isEditing={editingId === item.id}
                            editTitle={editTitle}
                            onItemClick={onItemClick}
                            onEditStart={onEditStart}
                            onEditSave={onEditSave}
                            onKeyPress={onKeyPress}
                            onDelete={onDelete}
                            onEditTitleChange={onEditTitleChange}
                            STRUCTURE_STYLES={STRUCTURE_STYLES}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};