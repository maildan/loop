'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { ConsistencyWarning } from '../types';

interface RecentWarningsProps {
  warnings: ConsistencyWarning[];
  onViewAll: () => void;
}

export const RecentWarnings: React.FC<RecentWarningsProps> = ({ warnings, onViewAll }) => {
  // 최근 경고 3건만 표시
  const recentWarnings = warnings.slice(0, 3);

  // Severity 아이콘 매핑
  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'low':
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  // Severity 색상 클래스
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  if (warnings.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-border/40 bg-card/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">최근 경고</h3>
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">모든 일관성 검사 통과! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border border-border/40 bg-card/50">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">최근 경고</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-[hsl(var(--accent-primary))] hover:underline flex items-center gap-1"
        >
          전체 보기
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 경고 목록 */}
      <div className="space-y-3">
        {recentWarnings.map((warning) => (
          <div
            key={warning.id}
            className={`p-3 rounded-lg border ${getSeverityColor(warning.severity)} hover:shadow-sm transition-all cursor-pointer`}
            onClick={onViewAll}
          >
            <div className="flex items-start gap-3">
              {/* Severity Icon */}
              <div className="mt-0.5">{getSeverityIcon(warning.severity)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {warning.episode}화
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {warning.severity}
                  </span>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{warning.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
