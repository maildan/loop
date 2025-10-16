/**
 * 🎴 EpisodeCard - 회차 카드 컴포넌트
 * 
 * Grid/List 뷰 모두 지원
 * - 회차 번호, 제목, 상태
 * - 5막 구조 뱃지
 * - 글자 수 진행 바
 * - 🔥 Phase 2: 플랫폼 배지 + 충족률 Progress Bar
 * - Quick Actions (편집/삭제)
 */

'use client';

import React from 'react';
import { Edit, Trash2, MoreVertical, FileText, Calendar, Target } from 'lucide-react';
import type { Episode } from '../../../../../hooks/useEpisodes';
import type { FiveActType } from '../../../../../../shared/types/episode';
import {
  calculateCompletionRate,
  getCompletionStatus,
  getProgressColor,
  PLATFORM_NAMES,
  PLATFORM_COLORS,
  type PlatformType,
} from '../../../../../../shared/constants/platform-requirements';

export interface EpisodeCardProps {
  episode: Episode;
  viewMode: 'grid' | 'list';
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (episode: Episode) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  published: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

const statusLabels = {
  draft: '초안',
  'in-progress': '진행 중',
  completed: '완료',
  published: '발행됨',
};

const actColors: Record<FiveActType, string> = {
  introduction: 'bg-blue-500/10 text-blue-500',
  rising: 'bg-green-500/10 text-green-500',
  development: 'bg-yellow-500/10 text-yellow-500',
  climax: 'bg-red-500/10 text-red-500',
  conclusion: 'bg-purple-500/10 text-purple-500',
};

const actLabels: Record<FiveActType, string> = {
  introduction: '도입',
  rising: '발단',
  development: '전개',
  climax: '절정',
  conclusion: '결말',
};

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  viewMode,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const progress = (episode.wordCount / episode.targetWordCount) * 100;
  const isOverTarget = progress > 100;

  // 🔥 Phase 2: 플랫폼별 충족률 계산
  const completionRate = calculateCompletionRate(episode.wordCount, episode.platform);
  const completionStatus = getCompletionStatus(completionRate);
  const progressColor = getProgressColor(completionRate);

  if (viewMode === 'list') {
    return (
      <div
        className={`
          flex items-center gap-4 p-4 rounded-lg border transition-all
          ${isSelected ? 'border-accent-primary bg-accent-primary/5' : 'border-border bg-card hover:border-accent-primary/50'}
        `}
      >
        {/* Checkbox */}
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(episode.id)}
            className="h-4 w-4 rounded border-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
          />
        )}

        {/* Episode Number */}
        <div className="flex-shrink-0 w-16 text-center">
          <div className="text-2xl font-bold text-foreground">{episode.episodeNumber}</div>
          <div className="text-xs text-muted-foreground">회차</div>
        </div>

        {/* Title & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {episode.title}
            </h3>
            {/* 🔥 Phase 2: 플랫폼 배지 */}
            {episode.platform && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[episode.platform as PlatformType]}`}>
                {PLATFORM_NAMES[episode.platform as PlatformType]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Status */}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[episode.status]}`}>
              {statusLabels[episode.status]}
            </span>
            
            {/* Act */}
            {episode.act && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actColors[episode.act]}`}>
                {actLabels[episode.act]}
              </span>
            )}

            {/* Word Count */}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {episode.wordCount.toLocaleString()} / {episode.targetWordCount.toLocaleString()}자
            </span>
          </div>
        </div>

        {/* 🔥 Phase 2: 플랫폼 충족률 Progress Bar */}
        <div className="flex-shrink-0 w-40">
          {episode.platform ? (
            <>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>충족률</span>
                <span className={`font-medium ${
                  completionStatus === 'success' ? 'text-green-600' :
                  completionStatus === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${progressColor}`}
                  style={{ width: `${Math.min(completionRate, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {episode.wordCount.toLocaleString()}자 / {PLATFORM_NAMES[episode.platform as PlatformType]}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>진행률</span>
                <span className={isOverTarget ? 'text-green-500 font-medium' : ''}>
                  {Math.min(progress, 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${isOverTarget ? 'bg-green-500' : 'bg-accent-primary'}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(episode)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="편집"
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(episode.id)}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
              title="삭제"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={`
        relative p-4 rounded-lg border transition-all group
        ${isSelected ? 'border-accent-primary bg-accent-primary/5' : 'border-border bg-card hover:border-accent-primary/50'}
      `}
    >
      {/* Checkbox (Top-left) */}
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(episode.id)}
          className="absolute top-3 left-3 h-4 w-4 rounded border-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
        />
      )}

      {/* Episode Number Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-bold">
            {episode.episodeNumber}화
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[episode.status]}`}>
            {statusLabels[episode.status]}
          </span>
          {/* 🔥 Phase 2: 플랫폼 배지 */}
          {episode.platform && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[episode.platform as PlatformType]}`}>
              {PLATFORM_NAMES[episode.platform as PlatformType]}
            </span>
          )}
        </div>

        {/* Actions (Hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(episode)}
              className="p-1.5 hover:bg-accent rounded-lg transition-colors"
              title="편집"
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(episode.id)}
              className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
              title="삭제"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-base font-semibold text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-accent-primary transition-colors"
        onClick={() => onEdit?.(episode)}
      >
        {episode.title}
      </h3>

      {/* Act Badge */}
      {episode.act && (
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${actColors[episode.act]}`}>
            {actLabels[episode.act]}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-2 mb-3">
        {/* Word Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            글자 수
          </span>
          <span className="font-medium text-foreground">
            {episode.wordCount.toLocaleString()} / {episode.targetWordCount.toLocaleString()}
          </span>
        </div>

        {/* Created At */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            생성일
          </span>
          <span className="text-muted-foreground">
            {new Date(episode.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>

      {/* 🔥 Phase 2: 플랫폼 충족률 Progress Bar */}
      <div>
        {episode.platform ? (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                충족률
              </span>
              <span className={`font-medium ${
                completionStatus === 'success' ? 'text-green-600' :
                completionStatus === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {completionRate.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${progressColor}`}
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1.5 text-center">
              {episode.wordCount.toLocaleString()}자 · {PLATFORM_NAMES[episode.platform as PlatformType]}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                진행률
              </span>
              <span className={isOverTarget ? 'text-green-500 font-medium' : ''}>
                {Math.min(progress, 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${isOverTarget ? 'bg-green-500' : 'bg-accent-primary'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
