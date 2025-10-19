'use client';

import React, { useState } from 'react';
import type { SynopsisViewProps, TabMode, TabModeConfig } from './types';
import { DashboardView } from './Dashboard/DashboardView';
import { EpisodesView } from './Episodes/EpisodesView';
import { ScheduleView } from './Schedule/ScheduleView';
import { ConsistencyView } from './Consistency/ConsistencyView';
import { TimelineView } from './Timeline/TimelineView';
import { LayoutDashboard, List, Network, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { RendererLogger as Logger } from '../../../../../shared/logger-renderer';
import { useSynopsisStats } from '../../../../hooks/useSynopsisStats';

// 🔥 Symbol 기반 컴포넌트 이름
const SYNOPSIS_VIEW = Symbol.for('SYNOPSIS_VIEW');

/**
 * 📖 SynopsisView - 연재 작가의 제2의 뇌
 * 
 * "플랫폼 대시보드 = 결과(조회수, 매출), Loop Synopsis = 과정(일관성, 복선 추적)"
 * 
 * Dashboard: 현재 회차, 비축 현황, 일관성 경고
 * Episodes: 회차별 관리 (추후 구현)
 * Schedule: 연재 캘린더
 * Structure: 5막 구조 시각화 (추후 구현)
 * 
 * Phase 1: Dashboard, Consistency, Timeline 구현 예정
 */

const TAB_CONFIGS: TabModeConfig[] = [
    { id: 'dashboard', name: '대시보드', icon: LayoutDashboard },
    { id: 'episodes', name: '회차 관리', icon: List },
    { id: 'schedule', name: '연재 관리', icon: Calendar },
    { id: 'consistency', name: '일관성 체크', icon: CheckCircle2 }, // ✅ Phase 1
    { id: 'timeline', name: '타임라인', icon: Clock }, // ✅ Phase 1
];

export const SynopsisView: React.FC<SynopsisViewProps> = ({
    projectId,
    elements,
    characters = [],
    notes = [],
    content = '',
}) => {
    const [activeTab, setActiveTab] = useState<TabMode>('dashboard');
    const [isProjectSaved, setIsProjectSaved] = useState(false);
    const synopsisStats = useSynopsisStats(projectId);

    // 🔥 프로젝트 DB 저장 확인 및 자동 저장
    React.useEffect(() => {
        const ensureProjectSaved = async () => {
            try {
                // 프로젝트 존재 여부 확인
                const checkResult = await window.electronAPI.projects.getById(projectId);
                
                if (!checkResult.success || !checkResult.data) {
                    Logger.warn(SYNOPSIS_VIEW, 'Project not found in DB, creating...', { projectId });
                    
                    // DB에 프로젝트 생성
                    const createResult = await window.electronAPI.projects.create({
                        title: '새 프로젝트',
                        description: '시놉시스를 통해 생성된 프로젝트',
                        content: content || '',
                        genre: 'unknown',
                        status: 'active',
                        progress: 0,
                        wordCount: 0,
                        author: '사용자'
                    });
                    
                    if (createResult.success) {
                        Logger.info(SYNOPSIS_VIEW, 'Project created in DB', { data: createResult.data });
                        setIsProjectSaved(true);
                    } else {
                        Logger.error(SYNOPSIS_VIEW, 'Failed to create project', { error: createResult.error });
                    }
                } else {
                    setIsProjectSaved(true);
                }
            } catch (error) {
                Logger.error(SYNOPSIS_VIEW, 'Error ensuring project saved', { projectId, error });
            }
        };

        ensureProjectSaved();
    }, [projectId, content]);

    return (
        <div className="flex h-full flex-col bg-background text-foreground">
            {/* 탭 네비게이션 */}
            <div className="flex items-center gap-2 border-b border-border bg-card/90 px-4 py-3 backdrop-blur-sm">
                {TAB_CONFIGS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
                                ${isActive 
                                    ? 'border border-[hsl(var(--accent-primary))]/40 bg-[hsl(var(--accent-primary))]/15 text-[hsl(var(--accent-primary))]'
                                    : 'border border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                }
                            `}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="flex-1 overflow-auto p-6">
                {activeTab === 'dashboard' && (
                    <DashboardView
                        projectId={projectId}
                        elements={elements}
                        characters={characters}
                        notes={notes}
                        content={content}
                        synopsisStats={synopsisStats}
                        onTabChange={setActiveTab}
                    />
                )}

                {activeTab === 'episodes' && (
                    <EpisodesView projectId={projectId} />
                )}

                {activeTab === 'schedule' && (
                    <ScheduleView projectId={projectId} />
                )}

                {activeTab === 'consistency' && (
                    <ConsistencyView
                        projectId={projectId}
                        characters={characters}
                        synopsisStats={synopsisStats}
                    />
                )}

                {activeTab === 'timeline' && (
                    <TimelineView
                        projectId={projectId}
                        notes={notes}
                        synopsisStats={synopsisStats}
                    />
                )}
            </div>

            {/* ❌ QuickLogModal removed - manual metric input deprecated */}
        </div>
    );
};
