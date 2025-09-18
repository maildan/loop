export interface WriteViewProps {
    content: string;
    onChange: (content: string) => void;
    isFocusMode: boolean;
}

export interface WriteStats {
    words: number;
    chars: number;
    sentences: number;
    readingTime: number;
}

export interface WriteControlsProps {
    typewriterMode: boolean;
    onTypewriterModeChange: (mode: boolean) => void;
    distractionFree: boolean;
    onDistractionFreeChange: (mode: boolean) => void;
    showStats: boolean;
    onShowStatsChange: (show: boolean) => void;
}

export interface WriteStatsProps {
    stats: WriteStats;
    showStats: boolean;
    distractionFree: boolean;
}

export interface WriteEditorProps {
    content: string;
    onChange: (content: string) => void;
    isFocusMode: boolean;
    typewriterMode: boolean;
    distractionFree: boolean;
}