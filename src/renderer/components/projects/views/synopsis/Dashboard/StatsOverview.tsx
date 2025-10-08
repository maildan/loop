'use client';

import React from 'react';
import { Card } from '../../../../ui/Card';
import { BookOpen, FileText, Package, Calendar } from 'lucide-react';
import type { ManuscriptReserves } from '../../../../../../shared/types/episode';

interface StatsOverviewProps {
  reserves: ManuscriptReserves;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ reserves }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">작품 통계</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* 총 단어 수 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <BookOpen className="w-4 h-4" />
            <span>총 단어 수</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {reserves.totalWordCount.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">자</span>
          </p>
        </div>

        {/* 회차 수 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <FileText className="w-4 h-4" />
            <span>회차 수</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {reserves.totalEpisodes}
            <span className="text-sm font-normal text-muted-foreground ml-1">화</span>
          </p>
        </div>

        {/* 비축 현황 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Package className="w-4 h-4" />
            <span>비축 현황</span>
          </div>
          <p className={`text-2xl font-bold ${
            reserves.reserveCount >= 10
              ? 'text-green-600'
              : reserves.reserveCount >= 5
              ? 'text-orange-600'
              : 'text-red-600'
          }`}>
            {reserves.reserveCount}
            <span className="text-sm font-normal text-muted-foreground ml-1">화</span>
          </p>
          <p className="text-xs text-muted-foreground">
            완료 {reserves.completedEpisodes}화 · 발행 {reserves.publishedEpisodes}화
          </p>
        </div>

        {/* 평균 단어 수 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="w-4 h-4" />
            <span>평균 단어 수</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {reserves.averageWordCount.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">자</span>
          </p>
          {reserves.averageWordCount >= 5000 && reserves.averageWordCount <= 5500 && (
            <p className="text-xs text-green-600">
              ✅ 목표 범위 내
            </p>
          )}
        </div>
      </div>

      {/* 마지막 발행일 */}
      {reserves.lastPublishedDate && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            📅 마지막 발행: {new Date(reserves.lastPublishedDate).toLocaleDateString('ko-KR')}
          </p>
        </div>
      )}

      {/* 비축 부족 경고 */}
      {reserves.reserveCount < 5 && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm text-orange-700">
            ⚠️ 비축이 부족합니다. 최소 5화 이상 비축을 권장합니다.
          </p>
        </div>
      )}
    </Card>
  );
};
