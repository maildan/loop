import React from 'react';
import { Eye, EyeOff, Type, Zap } from 'lucide-react';
import type { WriteControlsProps } from './types';

const WRITE_CONTROLS_STYLES = {
    floatingControls: 'fixed top-20 right-6 flex flex-col gap-2 z-30 opacity-0 hover:opacity-100 transition-opacity duration-300',
    controlButton: 'w-10 h-10 flex items-center justify-center rounded-full bg-[color:hsl(var(--card))]/90 backdrop-blur-sm shadow-[var(--shadow-md)] border border-[color:hsl(var(--border))] text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted))] transition-all duration-200 hover:scale-105',
    controlButtonActive: 'w-10 h-10 flex items-center justify-center rounded-full bg-[color:var(--accent-primary)] text-[color:var(--text-inverse,#ffffff)] shadow-[var(--shadow-md)] transition-all duration-200 hover:scale-105',
    distractionFreeExit: 'fixed top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[color:hsl(var(--foreground))]/65 text-[color:var(--text-inverse,#ffffff)] hover:bg-[color:hsl(var(--foreground))]/80 transition-colors duration-200 z-50',
} as const;

export const WriteControls = React.memo<WriteControlsProps>(({
    typewriterMode,
    onTypewriterModeChange,
    distractionFree,
    onDistractionFreeChange,
    showStats,
    onShowStatsChange
}) => {
    // 방해요소 제거 모드일 때는 플로팅 컨트롤 대신 해제 버튼만 표시
    if (distractionFree) {
        return (
            <button
                onClick={() => onDistractionFreeChange(false)}
                className={WRITE_CONTROLS_STYLES.distractionFreeExit}
                title="방해요소 제거 모드 해제 (ESC)"
            >
                <Eye size={14} />
            </button>
        );
    }

    return (
        <div className={WRITE_CONTROLS_STYLES.floatingControls}>
            <button
                onClick={() => onTypewriterModeChange(!typewriterMode)}
                className={typewriterMode ? WRITE_CONTROLS_STYLES.controlButtonActive : WRITE_CONTROLS_STYLES.controlButton}
                title="타이프라이터 모드"
            >
                <Type size={14} />
            </button>
            <button
                onClick={() => onDistractionFreeChange(true)}
                className={WRITE_CONTROLS_STYLES.controlButton}
                title="방해요소 제거 모드"
            >
                <Zap size={14} />
            </button>
            <button
                onClick={() => onShowStatsChange(!showStats)}
                className={showStats ? WRITE_CONTROLS_STYLES.controlButtonActive : WRITE_CONTROLS_STYLES.controlButton}
                title="통계 표시/숨김"
            >
                {showStats ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
        </div>
    );
});

WriteControls.displayName = 'WriteControls';