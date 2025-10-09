/**
 * 📊 Platform Comparison View - 플랫폼별 성과 비교 대시보드
 * @module renderer/components/synopsis/Statistics/PlatformComparisonView
 */

'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, BarChart3, DollarSign, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Publication, PlatformComparison, PlatformMetric } from '../../../../../../shared/types/synopsis-stats';

interface PlatformComparisonViewProps {
  projectId: string;
  onAddPublication: () => void;
}

export const PlatformComparisonView: React.FC<PlatformComparisonViewProps> = ({
  projectId,
  onAddPublication
}) => {
  const [loading, setLoading] = useState(true);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [comparison, setComparison] = useState<PlatformComparison[]>([]);
  const [metricsData, setMetricsData] = useState<Record<string, PlatformMetric[]>>({});

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Publications 로드
      const pubs = await window.electronAPI['synopsis-stats:get-publications'](projectId);
      setPublications(pubs);

      // 2. Platform Comparison 로드
      const comp = await window.electronAPI['synopsis-stats:get-comparison'](projectId);
      setComparison(comp);

      // 3. 각 Publication의 시계열 메트릭 로드
      const metricsMap: Record<string, PlatformMetric[]> = {};
      for (const pub of pubs) {
        const metrics = await window.electronAPI['synopsis-stats:get-metrics'](pub.id);
        metricsMap[pub.id] = metrics;
      }
      setMetricsData(metricsMap);
    } catch (error) {
      console.error('Failed to load platform comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 효율성 색상 계산
  const getEfficiencyColor = (efficiency: 'high' | 'medium' | 'low') => {
    switch (efficiency) {
      case 'high': return 'text-green-500 bg-green-500/10 border-green-500/40';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/40';
      case 'low': return 'text-red-500 bg-red-500/10 border-red-500/40';
    }
  };

  const getEfficiencyLabel = (efficiency: 'high' | 'medium' | 'low') => {
    switch (efficiency) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
    }
  };

  // 시계열 차트 데이터 준비
  const prepareChartData = () => {
    const allDates = new Set<string>();
    
    // 모든 날짜 수집
    Object.values(metricsData).forEach(metrics => {
      metrics.forEach(m => {
        const dateStr = new Date(m.date).toISOString().split('T')[0];
        if (dateStr) allDates.add(dateStr);
      });
    });

    const sortedDates = Array.from(allDates).sort();

    // 날짜별 데이터 매핑
    return sortedDates.map(date => {
      const dataPoint: any = { date };

      publications.forEach(pub => {
        const metrics = metricsData[pub.id] || [];
        const metric = metrics.find(m => new Date(m.date).toISOString().split('T')[0] === date);
        
        dataPoint[`${pub.platform}_views`] = metric?.views || null;
        dataPoint[`${pub.platform}_revenue`] = metric?.revenue || null;
      });

      return dataPoint;
    });
  };

  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-[hsl(var(--accent-primary))]" />
          <p className="text-sm text-muted-foreground">플랫폼 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-center">
        <div>
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-lg font-semibold text-foreground">등록된 플랫폼이 없습니다</p>
          <p className="mb-4 text-sm text-muted-foreground">
            플랫폼을 추가하여 성과를 비교해보세요
          </p>
          <button
            onClick={onAddPublication}
            className="rounded-lg bg-[hsl(var(--accent-primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus className="mr-2 inline-block h-4 w-4" />
            플랫폼 추가
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">플랫폼 성과 비교</h3>
        <button
          onClick={onAddPublication}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          플랫폼 추가
        </button>
      </div>

      {/* 플랫폼 카드 그리드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comparison.map((comp) => (
          <div
            key={comp.platform}
            className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold text-foreground">{comp.platform}</h4>
              <span
                className={`rounded-full border px-2 py-1 text-xs font-medium ${getEfficiencyColor(comp.efficiency)}`}
              >
                효율성 {getEfficiencyLabel(comp.efficiency)}
              </span>
            </div>

            <div className="space-y-2">
              {/* 총 조회수 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  총 조회수
                </div>
                <div className="text-sm font-medium text-foreground">
                  {comp.totalViews.toLocaleString()}
                </div>
              </div>

              {/* 총 수익 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  총 수익
                </div>
                <div className="text-sm font-medium text-foreground">
                  ₩{comp.totalRevenue.toLocaleString()}
                </div>
              </div>

              {/* 조회당 수익 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  조회당 수익
                </div>
                <div className="text-sm font-medium text-foreground">
                  ₩{comp.revenuePerView.toFixed(2)}
                </div>
              </div>

              {/* 회차당 평균 조회수 */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">회차당 평균</div>
                <div className="text-sm font-medium text-foreground">
                  {Math.round(comp.avgViewsPerEpisode).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 시계열 차트 - 조회수 */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h4 className="mb-4 font-semibold text-foreground">조회수 추이</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend />
              {publications.map((pub, index) => (
                <Line
                  key={pub.id}
                  type="monotone"
                  dataKey={`${pub.platform}_views`}
                  name={pub.platform}
                  stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 시계열 차트 - 수익 */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h4 className="mb-4 font-semibold text-foreground">수익 추이</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
                tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
                formatter={(value: number) => [`₩${value.toLocaleString()}`, '']}
              />
              <Legend />
              {publications.map((pub, index) => (
                <Line
                  key={pub.id}
                  type="monotone"
                  dataKey={`${pub.platform}_revenue`}
                  name={pub.platform}
                  stroke={`hsl(${(index * 60 + 30) % 360}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
