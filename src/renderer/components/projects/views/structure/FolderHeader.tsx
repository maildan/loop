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
            className="flex items-center justify-between p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => onToggle(folderType)}
        >
            <div className="flex items-center gap-3">
                <div className={`transform transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {count}
                </span>
            </div>
        </div>
    );
};