import { ProjectAnalysis, ProjectElement } from '../../../../hooks/useProjectData';
import { ProjectCharacter, ProjectNote } from '../../../../../shared/types/project';

export interface SynopsisViewProps {
    projectId: string;
    synopsisId?: string;
    onBack?: () => void;
    characters?: ProjectCharacter[];
    notes?: ProjectNote[];
    content?: string;
}

// 🔥 Synopsis 탭 모드 - "연재 작가의 제2의 뇌"
export type TabMode = 'dashboard' | 'episodes' | 'schedule' | 'consistency' | 'timeline';

export interface DashboardViewProps {
    projectId: string;
    elements: ProjectElement[];
    characters?: ProjectCharacter[];
    notes?: ProjectNote[];
    content?: string;
    onTabChange?: (tab: TabMode) => void; // 탭 전환 핸들러
}

export interface ScheduleViewProps {
    projectId: string;
}

export interface ConsistencyViewProps {
    projectId: string;
    characters?: ProjectCharacter[];
}

export interface TimelineViewProps {
    projectId: string;
    notes?: ProjectNote[];
}

export interface TabModeConfig {
    id: TabMode;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
}

// 🔥 Consistency 관련 타입
export interface ConsistencyWarning {
    id: string;
    characterId?: string;
    characterName?: string;
    type: 'speech_pattern' | 'appearance' | 'personality' | 'location' | 'timeline' | 'other';
    episode: number;
    description: string;
    severity: 'low' | 'medium' | 'high';
    createdAt?: Date; // Optional for mock data
}

export interface CharacterConsistencyScore {
    characterId: string;
    characterName: string;
    overallScore: number; // 0-100
    speechPatternScore: number;
    appearanceScore: number;
    personalityScore: number;
    warningCount: number;
}

// Synopsis 스타일 상수
export const SYNOPSIS_STYLES = {
    container: 'flex h-full flex-col bg-background text-foreground',
    header: 'flex items-center justify-between border-b border-border bg-card/90 p-4 backdrop-blur-sm',
    title: 'text-xl font-semibold text-foreground',
    modeButtons: 'flex flex-wrap items-center gap-2',
    modeButton: 'flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors',
    modeButtonActive: 'border-[hsl(var(--accent-primary))]/40 bg-[hsl(var(--accent-primary))]/15 text-[hsl(var(--accent-primary))]',
    modeButtonInactive: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
    analysisToggle: 'flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors',
    analysisToggleActive: 'border-[var(--success)]/40 bg-[var(--success-light)] text-[var(--success)]',
    analysisToggleInactive: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
    mainContent: 'flex flex-1 overflow-hidden',
    statsBar: 'border-t border-border bg-card/90 p-4 backdrop-blur-sm',
    statsGrid: 'grid grid-cols-5 gap-4 text-center',
    statValue: 'text-2xl font-bold text-foreground',
    statLabel: 'text-sm text-muted-foreground',
    loading: 'flex h-full items-center justify-center',
    loadingContent: 'flex flex-col items-center gap-2 text-center text-muted-foreground',
    loadingSpinner: 'mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[hsl(var(--accent-primary))]',
    loadingText: 'text-muted-foreground',
    emptyState: 'flex h-full items-center justify-center',
    emptyContent: 'text-center',
    emptyIcon: 'mx-auto mb-2 h-12 w-12 text-muted-foreground',
    emptyTitle: 'text-muted-foreground',
    emptySubtitle: 'mt-1 text-sm text-muted-foreground',
} as const;