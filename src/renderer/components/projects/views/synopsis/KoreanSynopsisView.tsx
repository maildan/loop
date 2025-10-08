'use client';

import React, { useState } from 'react';
import { TabMode, TabModeConfig, DashboardViewProps } from './types';
import { LayoutDashboard, List, Network, Sparkles } from 'lucide-react';
import { DashboardView } from './Dashboard/DashboardView';

/**
 * 🇰🇷 KoreanSynopsisView - 한국 웹소설 특화 시놉시스 뷰
 * 
 * Dashboard: 장르, 5막 구조, 비축 현황 한눈에 보기
 * Episodes: 회차별 관리 (추후 구현)
 * Structure: 5막 구조 시각화 (추후 구현)
 * Analysis: AI 분석 (추후 구현)
 */

const TAB_CONFIGS: TabModeConfig[] = [
    { id: 'dashboard', name: '대시보드', icon: LayoutDashboard },
    { id: 'episodes', name: '회차 관리', icon: List },
    { id: 'structure', name: '5막 구조', icon: Network },
    { id: 'analysis', name: 'AI 분석', icon: Sparkles },
];

export const KoreanSynopsisView: React.FC<DashboardViewProps> = ({
    projectId,
    elements,
    characters = [],
    notes = [],
    content = '',
}) => {
    const [activeTab, setActiveTab] = useState<TabMode>('dashboard');

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
                    />
                )}

                {activeTab === 'episodes' && (
                    <div className="flex h-full items-center justify-center text-center">
                        <div>
                            <List className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground mb-2">
                                📝 회차 관리
                            </p>
                            <p className="text-sm text-muted-foreground">
                                에피소드별 관리 기능이 곧 추가됩니다.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'structure' && (
                    <div className="flex h-full items-center justify-center text-center">
                        <div>
                            <Network className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground mb-2">
                                🎬 5막 구조 시각화
                            </p>
                            <p className="text-sm text-muted-foreground">
                                도입 → 발단 → 전개 → 절정 → 결말 흐름 시각화가 곧 추가됩니다.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div className="flex h-full items-center justify-center text-center">
                        <div>
                            <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground mb-2">
                                ✨ AI 분석
                            </p>
                            <p className="text-sm text-muted-foreground">
                                AI 기반 스토리 분석 기능이 곧 추가됩니다.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
