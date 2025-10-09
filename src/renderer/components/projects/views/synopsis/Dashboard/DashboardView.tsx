'use client';

import React from 'react';
import { StatusOverview } from './StatusOverview';
import { QuickActions } from './QuickActions';
import { RecentWarnings } from './RecentWarnings';
import { StatsOverview } from './StatsOverview';
import type { DashboardViewProps } from '../types';
import type { ConsistencyWarning } from '../types';
import type { ManuscriptReserves } from '../../../../../../shared/types/episode';

// Mock data (Phase 2에서 IPC로 대체 예정)
const MOCK_WARNINGS: ConsistencyWarning[] = [
  {
    id: '1',
    characterId: 'char-1',
    characterName: '김서준',
    type: 'speech_pattern',
    episode: 15,
    description: '김서준의 말투가 이전과 다르게 변경되었습니다. (존댓말 → 반말)',
    severity: 'medium',
  },
  {
    id: '2',
    characterId: 'char-1',
    characterName: '김서준',
    type: 'personality',
    episode: 23,
    description: '김서준이 갑자기 소극적인 태도를 보입니다. 기존 성격과 불일치.',
    severity: 'high',
  },
  {
    id: '3',
    characterId: 'char-2',
    characterName: '이민서',
    type: 'appearance',
    episode: 18,
    description: '이민서의 눈동자 색이 갈색으로 묘사되었습니다. (기존: 파란색)',
    severity: 'low',
  },
];

const MOCK_RESERVES: ManuscriptReserves = {
  totalEpisodes: 8,
  draftEpisodes: 0,
  inProgressEpisodes: 0,
  completedEpisodes: 8,
  publishedEpisodes: 5,
  reserveCount: 3,
  lastPublishedDate: new Date('2024-01-15'),
  nextScheduledPublish: new Date('2024-01-20'),
  totalWordCount: 72000,
  averageWordCount: 9000,
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  projectId,
  onTabChange,
}) => {
  // Mock 데이터 기반 계산
  const totalEpisodes = MOCK_RESERVES.totalEpisodes;
  const reserveCount = MOCK_RESERVES.reserveCount;
  const consistencyScore = 87; // ConsistencyView의 MOCK_OVERALL_SCORE와 동일
  const unresolvedForeshadows = 3; // TimelineView의 미회수 복선 개수

  // 탭 전환 핸들러
  const handleConsistencyCheck = () => {
    onTabChange?.('consistency');
  };

  const handleTimelineView = () => {
    onTabChange?.('timeline');
  };

  const handleNewEpisode = () => {
    // Phase 2: IPC 호출로 새 회차 작성 모달 열기
    console.log('새 회차 작성 (Phase 2 구현 예정)');
  };

  const handleViewAllWarnings = () => {
    onTabChange?.('consistency');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Writer's Cockpit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          연재 작가의 제2의 뇌 — 모든 정보를 한눈에
        </p>
      </div>

      {/* 상태 개요 (4개 메트릭) */}
      <StatusOverview
        totalEpisodes={totalEpisodes}
        reserveCount={reserveCount}
        consistencyScore={consistencyScore}
        unresolvedForeshadows={unresolvedForeshadows}
      />

      {/* Grid 2-column 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 빠른 액션 */}
        <QuickActions
          onConsistencyCheck={handleConsistencyCheck}
          onTimelineView={handleTimelineView}
          onNewEpisode={handleNewEpisode}
        />

        {/* 최근 경고 */}
        <RecentWarnings warnings={MOCK_WARNINGS} onViewAll={handleViewAllWarnings} />
      </div>

      {/* 통계 개요 (기존 컴포넌트 재사용) */}
      <StatsOverview reserves={MOCK_RESERVES} />

      {/* 추가 인사이트 */}
      {consistencyScore >= 85 && reserveCount >= 5 && unresolvedForeshadows <= 1 && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-700">
            🎉 축하합니다! 일관성도 높고, 비축도 충분하며, 미회수 복선이 거의 없습니다. 거의 완벽한 상태입니다!
          </p>
        </div>
      )}
    </div>
  );
};
