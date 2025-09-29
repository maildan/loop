import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FolderHeaderProps {
    folderType: string;
    title: string;
    icon: React.ComponentType<any>;
    count: number;
    isCollapsed: boolean;
    onToggle: (folderType: string) => void;
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({
    folderType,
    title,
    icon: IconComponent,
    count,
    isCollapsed,
    onToggle
}) => {
    return (
        <div
            className="flex items-center justify-between p-3 mb-2 bg-card border border-border rounded-lg cursor-pointer hover:bg-[hsl(var(--accent))]/10 transition-colors"
            onClick={() => onToggle(folderType)}
        >
            <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <IconComponent className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
                <span className="font-medium text-[hsl(var(--foreground))]">{title}</span>
                <span className="text-xs px-2 py-1 bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent-primary))] rounded-full">
                    {count}
                </span>
            </div>
        </div>
    );
};