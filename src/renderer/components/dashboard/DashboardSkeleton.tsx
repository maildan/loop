'use client';

import React, { memo } from 'react';
import { Skeleton } from '../ui/Skeleton';

// 🔥 로딩 스켈레톤 컴포넌트들 - 성능 최적화
const KpiCardSkeleton = memo(() => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-5 rounded" />
    </div>
    <Skeleton className="h-8 w-16 mb-2" />
    <Skeleton className="h-3 w-24" />
  </div>
));

KpiCardSkeleton.displayName = 'KpiCardSkeleton';

const ProjectCardSkeleton = memo(() => (
  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-2 w-full mb-2" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
));

ProjectCardSkeleton.displayName = 'ProjectCardSkeleton';

const FileItemSkeleton = memo(() => (
  <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
    <Skeleton className="h-4 w-4 mr-3" />
    <div className="flex-1">
      <Skeleton className="h-4 w-32 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="text-right">
      <Skeleton className="h-3 w-16 mb-1" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
));

FileItemSkeleton.displayName = 'FileItemSkeleton';

interface DashboardSkeletonProps {
  showKpi?: boolean;
  showProjects?: boolean;
  showRecentFiles?: boolean;
}

function DashboardSkeletonComponent({
  showKpi = true,
  showProjects = true,
  showRecentFiles = true,
}: DashboardSkeletonProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* KPI 카드 스켈레톤 */}
      {showKpi && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <KpiCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 프로젝트 스켈레톤 */}
        {showProjects && (
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {/* 최근 파일 스켈레톤 */}
        {showRecentFiles && (
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <FileItemSkeleton key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 메모화로 성능 최적화
export const DashboardSkeleton = memo(DashboardSkeletonComponent);
