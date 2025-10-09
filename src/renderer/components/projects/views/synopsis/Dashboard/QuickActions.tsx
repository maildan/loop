'use client';

import React from 'react';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

interface QuickActionsProps {
  onConsistencyCheck: () => void;
  onTimelineView: () => void;
  onNewEpisode: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onConsistencyCheck,
  onTimelineView,
  onNewEpisode,
}) => {
  const actions = [
    {
      label: '일관성 체크',
      icon: <CheckCircle2 className="w-5 h-5" />,
      onClick: onConsistencyCheck,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-500/10',
      hoverClass: 'hover:bg-green-500/20',
    },
    {
      label: '타임라인 보기',
      icon: <Clock className="w-5 h-5" />,
      onClick: onTimelineView,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-500/10',
      hoverClass: 'hover:bg-blue-500/20',
    },
    {
      label: '새 회차 작성',
      icon: <FileText className="w-5 h-5" />,
      onClick: onNewEpisode,
      colorClass: 'text-purple-600',
      bgClass: 'bg-purple-500/10',
      hoverClass: 'hover:bg-purple-500/20',
    },
  ];

  return (
    <div className="p-6 rounded-lg border border-border/40 bg-card/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">빠른 액션</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg border border-border/40 ${action.bgClass} ${action.hoverClass} transition-all text-left group`}
          >
            <div className="flex items-center gap-3">
              <div className={action.colorClass}>{action.icon}</div>
              <span className="text-sm font-medium text-foreground group-hover:text-[hsl(var(--accent-primary))] transition-colors">
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
