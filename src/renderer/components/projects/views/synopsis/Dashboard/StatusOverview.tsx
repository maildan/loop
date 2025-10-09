'use client';

import React from 'react';
import { FileText, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StatusMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

interface StatusOverviewProps {
  totalEpisodes: number;
  reserveCount: number;
  consistencyScore: number;
  unresolvedForeshadows: number;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({
  totalEpisodes,
  reserveCount,
  consistencyScore,
  unresolvedForeshadows,
}) => {
  // 일관성 점수 색상 코딩
  const getConsistencyColor = (score: number) => {
    if (score >= 85) return { color: 'text-green-600', bg: 'bg-green-500/10' };
    if (score >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
    return { color: 'text-red-600', bg: 'bg-red-500/10' };
  };

  const consistencyColors = getConsistencyColor(consistencyScore);

  const metrics: StatusMetric[] = [
    {
      label: '현재 회차',
      value: `${totalEpisodes}화`,
      icon: <FileText className="w-5 h-5" />,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-500/10',
    },
    {
      label: '비축분',
      value: `${reserveCount}화`,
      icon: <BookOpen className="w-5 h-5" />,
      colorClass: 'text-purple-600',
      bgClass: 'bg-purple-500/10',
    },
    {
      label: '일관성 점수',
      value: `${consistencyScore}/100`,
      icon: <CheckCircle2 className="w-5 h-5" />,
      colorClass: consistencyColors.color,
      bgClass: consistencyColors.bg,
    },
    {
      label: '미회수 복선',
      value: `${unresolvedForeshadows}건`,
      icon: <AlertTriangle className="w-5 h-5" />,
      colorClass: unresolvedForeshadows > 0 ? 'text-orange-600' : 'text-gray-600',
      bgClass: unresolvedForeshadows > 0 ? 'bg-orange-500/10' : 'bg-gray-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-border/40 bg-card/50 hover:shadow-md transition-all"
        >
          {/* Icon */}
          <div className={`w-10 h-10 rounded-lg ${metric.bgClass} flex items-center justify-center mb-3`}>
            <div className={metric.colorClass}>{metric.icon}</div>
          </div>

          {/* Value */}
          <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>

          {/* Label */}
          <div className="text-xs text-muted-foreground">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};
