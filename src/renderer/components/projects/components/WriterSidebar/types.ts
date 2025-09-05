// WriterSidebar 타입 정의
import { ProjectCharacter, ProjectStructure } from '../../../../../shared/types';
import { WriterStats } from '../../editor/WriterStats';

export interface WriterSidebarProps {
    projectId: string;
    currentView: string;
    onViewChange: (view: string) => void;
    structure?: ProjectStructure[];
    characters: ProjectCharacter[];
    stats: WriterStats;
    collapsed: boolean;

    // 핸들러들
    onAddStructure?: () => void;
    onAddCharacter?: () => void;
    onAddNote?: () => void;
    onEditStructure?: (id: string) => void;
    onDuplicateStructure?: (id: string, title: string) => void;
    onDeleteStructure?: (id: string, title: string) => void;
}

export interface MenuItemType {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface WriterSidebarState {
    expandedSections: Set<string>;
    structureMenuId: string | null;
    editingId: string | null;
    editingTitle: string;
    showDeleteDialog: boolean;
    itemToDelete: { id: string; title: string } | null;
}
