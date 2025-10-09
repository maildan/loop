'use client';

import React, { useEffect, useState } from 'react';
import { GenreCard } from './GenreCard';
import { FiveActProgress } from './FiveActProgress';
import { StatsOverview } from './StatsOverview';
import { Loader2 } from 'lucide-react';
import { episodeServiceClient } from '../../../../../../shared/services/EpisodeServiceClient';
import { KoreanWebNovelAnalyzer } from '../../../../../../shared/narrative/koreanWebNovelAnalyzer';
import type { FiveActAnalysis, ManuscriptReserves } from '../../../../../../shared/types/episode';
import type { DashboardViewProps } from '../types';

export const DashboardView: React.FC<DashboardViewProps> = ({
  projectId,
  elements,
  characters = [],
  notes = [],
  content = '',
}) => {
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('unknown');
  const [genreConsistency, setGenreConsistency] = useState(0);
  const [fiveActData, setFiveActData] = useState<FiveActAnalysis[]>([]);
  const [reserves, setReserves] = useState<ManuscriptReserves | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // 1. 장르 감지
        const title = elements.find(e => e.type === 'main')?.title || '';
        const detectedGenre = KoreanWebNovelAnalyzer.detectGenre(content, title);
        setGenre(detectedGenre);

        // 2. 장르 일관성 (시놉시스 분석)
        const synopsisAnalysis = KoreanWebNovelAnalyzer.analyzeSynopsis(content, title);
        setGenreConsistency(synopsisAnalysis.genreConsistency);

        // 3. 5막 구조 분석
        const fiveAct = await episodeServiceClient.analyzeFiveActStructure(projectId);
        setFiveActData(fiveAct);

        // 4. 비축 현황
        const manuscriptReserves = await episodeServiceClient.getManuscriptReserves(projectId);
        setReserves(manuscriptReserves);
      } catch (error) {
        console.error('Dashboard 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [projectId, content, elements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[hsl(var(--accent-primary))]" />
          <p className="text-sm text-muted-foreground">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">한국 웹소설 대시보드</h2>
        <p className="text-sm text-muted-foreground mt-1">
          장르 감지, 5막 구조, 비축 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Grid 2x3 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 장르 카드 */}
        <GenreCard genre={genre} genreConsistency={genreConsistency} />

        {/* 통계 개요 */}
        {reserves && <StatsOverview reserves={reserves} />}

        {/* 5막 구조 진행률 (col-span-2) */}
        <div className="lg:col-span-2">
          <FiveActProgress fiveActData={fiveActData} />
        </div>
      </div>

      {/* 추가 인사이트 */}
      {genreConsistency >= 80 && reserves && reserves.reserveCount >= 10 && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-700">
            🎉 축하합니다! 장르 일관성도 높고 비축도 충분합니다. 출간 준비 완료!
          </p>
        </div>
      )}
    </div>
  );
};
