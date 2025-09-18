import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';

export interface SynopsisViewProps {
    projectId: string;
    synopsisId?: string;
    onBack?: () => void;
    characters?: any[];
    notes?: any[];
    content?: string;
}

export type ViewMode = 'timeline' | 'outline' | 'mindmap';

export interface TimelinePanelProps {
    analysis: ProjectAnalysis;
    elements: ProjectElement[];
    projectId?: string;
    characters?: any[];
    notes?: any[];
    content?: string;
    onNavigateToChapter?: (chapterId: string) => void;
}

export interface OutlinePanelProps {
    elements: ProjectElement[];
    projectId?: string;
    characters?: any[];
    notes?: any[];
    content?: string;
}

export interface MindmapCanvasProps {
    elements: ProjectElement[];
    analysis: ProjectAnalysis;
    onSelectElement: (element: ProjectElement) => void;
}

export interface AnalysisPanelProps {
    analysis: ProjectAnalysis;
    elements: ProjectElement[];
    selectedElement: string | null;
    getRelatedElements: (elementId: string) => ProjectElement[];
}

export interface ViewModeConfig {
    id: ViewMode;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Synopsis 스타일 상수
export const SYNOPSIS_STYLES = {
    container: 'h-full flex flex-col bg-gray-50 dark:bg-gray-900',
    header: 'flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700',
    title: 'text-xl font-semibold text-gray-900 dark:text-white',
    modeButtons: 'flex items-center space-x-2',
    modeButton: 'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    modeButtonActive: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    modeButtonInactive: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
    analysisToggle: 'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    analysisToggleActive: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    analysisToggleInactive: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
    mainContent: 'flex-1 flex overflow-hidden',
    statsBar: 'bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4',
    statsGrid: 'grid grid-cols-5 gap-4 text-center',
    statValue: 'text-2xl font-bold',
    statLabel: 'text-sm text-gray-500',
    loading: 'flex items-center justify-center h-full',
    loadingContent: 'text-center',
    loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto',
    loadingText: 'mt-2 text-gray-600 dark:text-gray-400',
    emptyState: 'flex items-center justify-center h-full',
    emptyContent: 'text-center',
    emptyIcon: 'h-12 w-12 text-gray-400 mx-auto mb-2',
    emptyTitle: 'text-gray-600 dark:text-gray-400',
    emptySubtitle: 'text-sm text-gray-500 dark:text-gray-500 mt-1',
} as const;