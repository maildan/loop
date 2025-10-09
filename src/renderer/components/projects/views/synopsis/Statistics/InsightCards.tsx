/**
 * 💡 Insight Cards - 자동화된 인사이트 카드
 * @module renderer/components/synopsis/Statistics/InsightCards
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';
import type { InsightCard } from '../../../../../../shared/types/synopsis-stats';

interface InsightCardsProps {
  projectId: string;
}

export const InsightCards: React.FC<InsightCardsProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<InsightCard[]>([]);

  useEffect(() => {
    loadInsights();
  }, [projectId]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI['synopsis-stats:get-insights'](projectId);
      setInsights(data);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: InsightCard['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'action':
        return <Zap className="h-5 w-5 text-red-500" />;
    }
  };

  const getInsightColor = (type: InsightCard['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/40 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/40 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/40 bg-blue-500/10';
      case 'action':
        return 'border-red-500/40 bg-red-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[hsl(var(--accent-primary))]" />
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <Info className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          데이터가 충분히 쌓이면 인사이트가 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`rounded-lg border p-4 transition-shadow hover:shadow-md ${getInsightColor(insight.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{getInsightIcon(insight.type)}</div>
            <div className="flex-1">
              <h4 className="mb-1 font-semibold text-foreground">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              {insight.actionLabel && insight.actionUrl && (
                <a
                  href={insight.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-[hsl(var(--accent-primary))] hover:underline"
                >
                  {insight.actionLabel} →
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
