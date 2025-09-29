import React, { useState } from 'react';
import { WriteControls } from './WriteControls';
import { WriteEditor } from './WriteEditor';
import { WriteStats } from './WriteStats';
import type { WriteViewProps, WriteStats as StatsType } from './types';

const WRITE_STYLES = {
    container: 'flex-1 flex flex-col h-full bg-[color:hsl(var(--background))] transition-colors duration-300 writer-optimized',
} as const;

export const WriteView = React.memo<WriteViewProps>(({ content, onChange, isFocusMode }) => {
    const [typewriterMode, setTypewriterMode] = useState(false);
    const [distractionFree, setDistractionFree] = useState(false);
    const [showStats, setShowStats] = useState(true);

    // 🔥 실시간 텍스트 통계 계산
    const stats: StatsType = React.useMemo(() => {
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const chars = content.length;
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const readingTime = Math.ceil(words / 250); // 분당 250단어 기준

        return { words, chars, sentences, readingTime };
    }, [content]);

    return (
        <div className={WRITE_STYLES.container}>
            {/* iA Writer 스타일 플로팅 컨트롤 */}
            <WriteControls
                typewriterMode={typewriterMode}
                onTypewriterModeChange={setTypewriterMode}
                distractionFree={distractionFree}
                onDistractionFreeChange={setDistractionFree}
                showStats={showStats}
                onShowStatsChange={setShowStats}
            />

            {/* 메인 에디터 영역 */}
            <WriteEditor
                content={content}
                onChange={onChange}
                isFocusMode={isFocusMode}
                typewriterMode={typewriterMode}
                distractionFree={distractionFree}
            />

            {/* iA Writer 스타일 통계 바 */}
            <WriteStats
                stats={stats}
                showStats={showStats}
                distractionFree={distractionFree}
            />
        </div>
    );
});

WriteView.displayName = 'WriteView';