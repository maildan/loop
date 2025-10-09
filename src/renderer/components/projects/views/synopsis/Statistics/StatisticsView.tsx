/**
 * 📊 Statistics View - 통계 메인 컨테이너
 * @module renderer/components/synopsis/Statistics/StatisticsView
 */

'use client';

import React, { useState } from 'react';
import { TrendingUp, Plus, Zap } from 'lucide-react';
import { InsightCards } from './InsightCards';
import { PlatformComparisonView } from './PlatformComparisonView';
import { PublicationModal } from './PublicationModal';

interface StatisticsViewProps {
  projectId: string;
  onQuickLogClick: () => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  projectId,
  onQuickLogClick
}) => {
  const [isPublicationModalOpen, setIsPublicationModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">플랫폼 성과 통계</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            조회수, 수익, 순위 등 플랫폼별 성과를 한눈에 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onQuickLogClick}
            className="flex items-center gap-2 rounded-lg bg-[hsl(var(--accent-primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Zap className="h-4 w-4" />
            Quick Log
          </button>
          <button
            onClick={() => setIsPublicationModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            플랫폼 추가
          </button>
        </div>
      </div>

      {/* 인사이트 카드 */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
          <TrendingUp className="h-5 w-5 text-[hsl(var(--accent-primary))]" />
          자동 인사이트
        </h3>
        <InsightCards projectId={projectId} />
      </div>

      {/* 플랫폼 비교 */}
      <div>
        <PlatformComparisonView
          projectId={projectId}
          onAddPublication={() => setIsPublicationModalOpen(true)}
        />
      </div>

      {/* Publication Modal */}
      <PublicationModal
        projectId={projectId}
        isOpen={isPublicationModalOpen}
        onClose={() => setIsPublicationModalOpen(false)}
        onSuccess={() => {
          setIsPublicationModalOpen(false);
          // TODO: 데이터 새로고침
        }}
      />
    </div>
  );
};
