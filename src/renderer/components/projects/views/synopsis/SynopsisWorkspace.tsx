// 🔥 Synopsis Workspace - 한국 웹소설 작가 중심 전문 워크스페이스
'use client';

import React, { useState } from 'react';
import {
    FileText,
    BarChart3,
    Users,
    List,
    Sparkles,
    ChevronRight
} from 'lucide-react';
import { Card } from '../../../ui/Card';
import { Badge } from '../../../ui/Badge';
import { OverviewTab } from './OverviewTab';

// Tab 타입 정의
export type SynopsisTab = 'overview' | 'structure' | 'characters' | 'episodes' | 'ai-analysis';

interface SynopsisWorkspaceProps {
    projectId: string;
    synopsisId?: string;
}

interface TabConfig {
    id: SynopsisTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badge?: string;
}

const TABS: TabConfig[] = [
    {
        id: 'overview',
        label: '전체 개요',
        icon: FileText,
        description: '작품 메타데이터 및 완성도 대시보드',
        badge: '기본'
    },
    {
        id: 'structure',
        label: '구조',
        icon: BarChart3,
        description: '5막 구조 및 플롯 포인트',
        badge: '한국식'
    },
    {
        id: 'characters',
        label: '캐릭터',
        icon: Users,
        description: 'MBTI 프로필 및 관계도'
    },
    {
        id: 'episodes',
        label: '회차 관리',
        icon: List,
        description: '연재 관리 및 조판 미리보기',
        badge: '웹소설'
    },
    {
        id: 'ai-analysis',
        label: 'AI 분석',
        icon: Sparkles,
        description: 'NCP 분석 및 맞춤형 제안'
    }
];

export const SynopsisWorkspace: React.FC<SynopsisWorkspaceProps> = ({
    projectId,
    synopsisId
}) => {
    const [activeTab, setActiveTab] = useState<SynopsisTab>('overview');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // 탭별 컴포넌트 렌더링
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="p-6">
                        <OverviewTab projectId={projectId} />
                    </div>
                );

            case 'structure':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">구조 분석</h2>
                            <p className="text-muted-foreground">
                                한국식 5막 구조(기승전결)와 클리프행어 포인트를 관리하세요.
                            </p>
                        </div>
                        {/* StructureTab 컴포넌트가 여기 들어갈 예정 */}
                        <Card className="p-6">
                            <p className="text-muted-foreground">개발 중...</p>
                        </Card>
                    </div>
                );

            case 'characters':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">캐릭터 데이터베이스</h2>
                            <p className="text-muted-foreground">
                                MBTI 프로필과 캐릭터 아크를 관리하세요.
                            </p>
                        </div>
                        {/* CharactersTab 컴포넌트가 여기 들어갈 예정 */}
                        <Card className="p-6">
                            <p className="text-muted-foreground">개발 중...</p>
                        </Card>
                    </div>
                );

            case 'episodes':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                회차 관리
                                <Badge variant="primary">한국 웹소설 특화</Badge>
                            </h2>
                            <p className="text-muted-foreground">
                                회차별 분량 관리와 연재 일정을 추적하세요.
                            </p>
                        </div>
                        {/* EpisodesTab 컴포넌트가 여기 들어갈 예정 */}
                        <Card className="p-6">
                            <p className="text-muted-foreground">개발 중...</p>
                        </Card>
                    </div>
                );

            case 'ai-analysis':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">AI 분석</h2>
                            <p className="text-muted-foreground">
                                NCP 기반 심층 분석과 맞춤형 제안을 확인하세요.
                            </p>
                        </div>
                        {/* AIAnalysisTab 컴포넌트가 여기 들어갈 예정 */}
                        <Card className="p-6">
                            <p className="text-muted-foreground">개발 중...</p>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex h-full bg-background">
            {/* 사이드바 */}
            <div
                className={`
                    border-r border-border bg-card transition-all duration-300
                    ${sidebarCollapsed ? 'w-16' : 'w-64'}
                `}
            >
                {/* 사이드바 헤더 */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <h2 className="font-semibold text-sm text-muted-foreground">
                            워크스페이스
                        </h2>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
                    >
                        <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                                sidebarCollapsed ? '' : 'rotate-180'
                            }`}
                        />
                    </button>
                </div>

                {/* 탭 리스트 */}
                <nav className="p-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                    transition-colors mb-1 group
                                    ${
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                                    }
                                `}
                                title={sidebarCollapsed ? tab.label : undefined}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!sidebarCollapsed && (
                                    <>
                                        <div className="flex-1 text-left">
                                            <div className="text-sm font-medium flex items-center gap-2">
                                                {tab.label}
                                                {tab.badge && (
                                                    <Badge
                                                        variant={isActive ? 'outline' : 'default'}
                                                        className="text-xs"
                                                    >
                                                        {tab.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs opacity-70 mt-0.5">
                                                {tab.description}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* 사이드바 푸터 */}
                {!sidebarCollapsed && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                            <div className="font-medium mb-1">한국 웹소설 작가 도구</div>
                            <div className="opacity-70">
                                Loop v1.0 - Professional Writer's Workspace
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 overflow-auto">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default SynopsisWorkspace;
