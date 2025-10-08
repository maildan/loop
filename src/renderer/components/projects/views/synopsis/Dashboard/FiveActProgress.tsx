'use client';

import React from 'react';
import { Card } from '../../../../ui/Card';
import { ProgressBar } from '../../../../ui/ProgressBar';
import { TrendingUp } from 'lucide-react';
import type { FiveActAnalysis } from '../../../../../../shared/types/episode';

interface FiveActProgressProps {
  fiveActData: FiveActAnalysis[];
}

const ACT_COLORS: Record<string, 'blue' | 'green' | 'orange' | 'purple' | 'red'> = {
  intro: 'blue',
  rising: 'green',
  development: 'orange',
  climax: 'red',
  conclusion: 'purple',
};

export const FiveActProgress: React.FC<FiveActProgressProps> = ({ fiveActData }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
          5막 구조 진행률
        </h3>
        <span className="text-xs text-muted-foreground">
          한국식 기승전결 구조
        </span>
      </div>

      <div className="space-y-4">
        {fiveActData.map((act) => {
          const percentage = act.targetWordCount > 0
            ? Math.round((act.currentWordCount / act.targetWordCount) * 100)
            : 0;

          return (
            <div key={act.act} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {act.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ({act.targetPercentage}%)
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${
                    act.isComplete ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {act.currentWordCount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {' '}/ {act.targetWordCount.toLocaleString()}자
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ProgressBar
                  value={percentage}
                  color={ACT_COLORS[act.act]}
                  className="h-2 flex-1"
                />
                <span className="text-xs font-medium text-muted-foreground min-w-[40px] text-right">
                  {percentage}%
                </span>
              </div>

              {act.episodes.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  📖 {act.episodes.length}개 회차
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          💡 <span className="font-medium">도입</span>(10%) → <span className="font-medium">발단</span>(20%) → <span className="font-medium">전개</span>(30%) → <span className="font-medium">절정</span>(25%) → <span className="font-medium">결말</span>(15%)
        </div>
      </div>
    </Card>
  );
};
