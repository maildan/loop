/**
 * 🔥 EpisodeHeatmap - 회차별 충족률 히트맵 시각화
 * 
 * 기능:
 * - 회차별 플랫폼 기준 충족률을 색상으로 표시
 * - 빨강(<80%), 노랑(80-99%), 초록(100%+), 회색(플랫폼 미설정)
 * - Tooltip으로 회차 번호, 제목, 충족률 표시
 * - 한눈에 부족한 회차 파악
 */

'use client';

import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Episode } from '../../../../../hooks/useEpisodes';
import { calculateCompletionRate, getCompletionStatus } from '../../../../../../shared/constants/platform-requirements';

export interface EpisodeHeatmapProps {
  episodes: Episode[];
  onEpisodeClick?: (episode: Episode) => void;
}

/**
 * 🔥 EpisodeHeatmap Component
 */
export const EpisodeHeatmap: React.FC<EpisodeHeatmapProps> = ({
  episodes,
  onEpisodeClick,
}) => {
  // 회차별 충족률 계산
  const heatmapData = useMemo(() => {
    return episodes.map((episode) => {
      if (!episode.platform) {
        return {
          episode,
          completionRate: null,
          status: 'none' as const,
          color: 'bg-gray-200 dark:bg-gray-700',
          borderColor: 'border-gray-300 dark:border-gray-600',
        };
      }

      const completionRate = calculateCompletionRate(episode.wordCount, episode.platform);
      const status = getCompletionStatus(completionRate);

      let color = 'bg-gray-200 dark:bg-gray-700';
      let borderColor = 'border-gray-300 dark:border-gray-600';

      if (status === 'success') {
        color = 'bg-green-500 dark:bg-green-600';
        borderColor = 'border-green-600 dark:border-green-500';
      } else if (status === 'warning') {
        color = 'bg-yellow-500 dark:bg-yellow-600';
        borderColor = 'border-yellow-600 dark:border-yellow-500';
      } else if (status === 'danger') {
        color = 'bg-red-500 dark:bg-red-600';
        borderColor = 'border-red-600 dark:border-red-500';
      }

      return {
        episode,
        completionRate,
        status,
        color,
        borderColor,
      };
    });
  }, [episodes]);

  // 통계 계산
  const stats = useMemo(() => {
    const total = heatmapData.length;
    const success = heatmapData.filter((d) => d.status === 'success').length;
    const warning = heatmapData.filter((d) => d.status === 'warning').length;
    const danger = heatmapData.filter((d) => d.status === 'danger').length;
    const none = heatmapData.filter((d) => d.status === 'none').length;

    return { total, success, warning, danger, none };
  }, [heatmapData]);

  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">회차가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 범례 및 통계 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-muted-foreground">100% 이상 ({stats.success})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-sm text-muted-foreground">80-99% ({stats.warning})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-sm text-muted-foreground">80% 미만 ({stats.danger})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <span className="text-sm text-muted-foreground">플랫폼 미설정 ({stats.none})</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          전체 {stats.total}개 회차
        </div>
      </div>

      {/* 히트맵 그리드 */}
      <div className="grid grid-cols-10 gap-2">
        {heatmapData.map(({ episode, completionRate, status, color, borderColor }) => (
          <button
            key={episode.id}
            onClick={() => onEpisodeClick?.(episode)}
            className={`
              group relative aspect-square rounded-lg border-2 ${color} ${borderColor}
              hover:scale-110 hover:z-10 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
            `}
            title={
              completionRate !== null
                ? `${episode.episodeNumber}화: ${episode.title} (${completionRate}%)`
                : `${episode.episodeNumber}화: ${episode.title} (플랫폼 미설정)`
            }
          >
            {/* 회차 번호 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-md">
                {episode.episodeNumber}
              </span>
            </div>

            {/* Tooltip (Hover) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
              <div className="bg-card border border-border rounded-lg shadow-xl p-3 min-w-[200px]">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {episode.episodeNumber}화: {episode.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {completionRate !== null ? (
                    <>
                      {status === 'success' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                      {status === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                      {status === 'danger' && <AlertCircle className="h-3 w-3 text-red-500" />}
                      <span>{episode.wordCount.toLocaleString()}자 ({completionRate}%)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-gray-500" />
                      <span>플랫폼 미설정</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 요약 메시지 */}
      {stats.danger > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {stats.danger}개 회차가 목표 글자 수 80% 미만입니다
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              빨간색 회차를 클릭하여 내용을 보완하세요
            </p>
          </div>
        </div>
      )}

      {stats.danger === 0 && stats.warning === 0 && stats.none === 0 && (
        <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              모든 회차가 목표 글자 수를 충족했습니다! 🎉
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              완벽한 연재 준비가 완료되었습니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
