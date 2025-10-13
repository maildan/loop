'use client';


import React, { useMemo } from 'react';
import { StatusOverview } from './StatusOverview';
import { QuickActions } from './QuickActions';
import { RecentWarnings } from './RecentWarnings';
import { StatsOverview } from './StatsOverview';
import { RadialProgressRing } from './RadialProgressRing';
import { NextActions } from './NextActions';
import { AlertTriangle, TrendingUp, Target, BookOpen, Clock, CheckCircle2, FileText, BarChart3, Calendar, Zap } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Legend } from 'recharts';
import type { DashboardViewProps } from '../types';
import type { ConsistencyWarning } from '../types';
import type { ManuscriptReserves } from '../../../../../../shared/types/episode';
import { useSynopsisStats } from '../../../../../hooks/useSynopsisStats';


const DASHBOARD_VIEW = Symbol.for('DASHBOARD_VIEW');
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

export const DashboardView: React.FC<DashboardViewProps> = ({
  projectId,
  elements,
  characters,
  notes,
  onTabChange,
}) => {
  // ✅ 실제 데이터 기반 계산
  const chapters = elements.filter(e => e.type === 'chapter');
  const totalEpisodes = chapters.length;
  const completedChapters = chapters.filter(ch => (ch.wordCount || 0) >= 500); // 500자 이상 완성으로 간주
  const reserveCount = completedChapters.length - 5; // 임시: 5개 발행 가정, Phase 2에서 실제 publishedEpisodes 사용
  const totalWordCount = chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);
  const averageWordCount = totalEpisodes > 0 ? Math.round(totalWordCount / totalEpisodes) : 0;

  // ⚠️ Warnings: Phase 2 (AI 분석)에서 채워질 예정, 현재 빈 배열
  const warnings: ConsistencyWarning[] = [];

  // 📌 복선 추적: notes에서 foreshadow 타입 필터링 (Phase 2에서 AI 자동 추출)
  const foreshadowNotes = notes?.filter(n => n.type === 'foreshadow' || n.tags?.toString().includes('복선')) || [];
  const unresolvedForeshadows = foreshadowNotes.length; // Phase 2: 미회수 여부 판별 로직 추가

  // 일관성 점수: Phase 2 (AI 분석)에서 계산, 현재 기본값
  const consistencyScore = warnings.length === 0 ? 100 : Math.max(0, 100 - warnings.length * 5);

  // 📊 실제 DB 데이터: useSynopsisStats 훅 사용
  const { data: statsData, loading: statsLoading, error: statsError } = useSynopsisStats(projectId);

  // 📊 Progress Timeline (30일 누적 글자 수)
  const progressTimelineData = useMemo(() => {
    if (!statsData.progressTimeline || statsData.progressTimeline.length === 0) {
      // 데이터 없을 시 빈 배열 반환
      return [];
    }
    return statsData.progressTimeline.map(item => ({
      date: item.date,
      words: item.words,
      goal: totalWordCount * 1.2, // 목표선 (현재 글자 수의 120%)
    }));
  }, [statsData.progressTimeline, totalWordCount]);

  // 📊 Writing Activity (7일 작성량)
  const writingActivityData = useMemo(() => {
    if (!statsData.writingActivity || statsData.writingActivity.length === 0) {
      return [];
    }
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const goal = 2000; // 목표: 일 2000자
    
    return statsData.writingActivity.map((item, index) => ({
      day: days[index % 7], // 요일 매핑
      words: item.words,
      goal,
      achieved: item.words >= goal,
    }));
  }, [statsData.writingActivity]);

  // 📊 Episode Status (5막 구조별 회차 분포)
  const episodeStatusData = useMemo(() => {
    if (!statsData.episodeStats || statsData.episodeStats.length === 0) {
      return [
        { act: '도입', count: 0, avgWords: 0, color: '#3b82f6' },
        { act: '발단', count: 0, avgWords: 0, color: '#10b981' },
        { act: '전개', count: 0, avgWords: 0, color: '#eab308' },
        { act: '절정', count: 0, avgWords: 0, color: '#ef4444' },
        { act: '결말', count: 0, avgWords: 0, color: '#8b5cf6' },
      ];
    }
    return statsData.episodeStats;
  }, [statsData.episodeStats]);

  const reserves: ManuscriptReserves = {
    totalEpisodes,
    draftEpisodes: totalEpisodes - completedChapters.length,
    inProgressEpisodes: 0, // Phase 2: status 필드 활용
    completedEpisodes: completedChapters.length,
    publishedEpisodes: 5, // Phase 2: 실제 발행 데이터 연동
    reserveCount: Math.max(0, reserveCount),
    lastPublishedDate: new Date(), // Phase 2: 실제 발행일
    nextScheduledPublish: new Date(), // Phase 2: 다음 예약일
    totalWordCount,
    averageWordCount,
  };

  // 탭 전환 핸들러
  const handleConsistencyCheck = () => {
    onTabChange?.('consistency');
  };

  const handleTimelineView = () => {
    onTabChange?.('timeline');
  };

  const handleNewEpisode = () => {
    // Phase 2: IPC 호출로 새 회차 작성 모달 열기
    Logger.debug(DASHBOARD_VIEW, '새 회차 작성 (Phase 2 구현 예정)');
  };

  const handleViewAllWarnings = () => {
    onTabChange?.('consistency');
  };

  // 🎯 다음 액션 제안 (우선순위순)
  const nextActions = useMemo(() => {
    const actions = [];

    // 비축 부족 (3회차 이하)
    if (reserveCount <= 3 && reserveCount >= 0) {
      actions.push({
        id: 'low-reserve',
        title: `비축이 ${reserveCount}회차만 남았어요!`,
        description: '새 회차를 작성하여 안정적인 연재를 유지하세요',
        priority: reserveCount <= 1 ? 'high' as const : 'medium' as const,
        icon: <AlertTriangle className="h-5 w-5" />,
        action: handleNewEpisode,
      });
    }

    // 경고 있음
    if (warnings.length > 0) {
      actions.push({
        id: 'warnings',
        title: `${warnings.length}개 경고 해결 필요`,
        description: '캐릭터 일관성 문제를 확인하세요',
        priority: 'high' as const,
        icon: <AlertTriangle className="h-5 w-5" />,
        action: handleConsistencyCheck,
      });
    }

    // 미회수 복선
    if (unresolvedForeshadows > 0) {
      actions.push({
        id: 'foreshadows',
        title: `복선 ${unresolvedForeshadows}개 회수 대기 중`,
        description: '타임라인에서 복선 추적 상태를 확인하세요',
        priority: unresolvedForeshadows >= 5 ? 'medium' as const : 'low' as const,
        icon: <Target className="h-5 w-5" />,
        action: handleTimelineView,
      });
    }

    // 정상: 새 회차 작성 권장
    if (actions.length === 0) {
      actions.push({
        id: 'write-new',
        title: '새 회차 작성하기',
        description: '현재 상태가 완벽합니다! 계속 좋은 작업하세요',
        priority: 'low' as const,
        icon: <TrendingUp className="h-5 w-5" />,
        action: handleNewEpisode,
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [reserveCount, warnings.length, unresolvedForeshadows]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* 🚀 Hero Section - Compact + Progress Ring + Next Actions */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--accent-primary))]/10 via-transparent to-transparent border border-[hsl(var(--accent-primary))]/20 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Ring + Title */}
          <div className="flex items-center gap-6">
            <RadialProgressRing
              value={consistencyScore}
              size={120}
              strokeWidth={10}
              label="일관성"
              sublabel={consistencyScore >= 85 ? '완벽!' : consistencyScore >= 70 ? '좋음' : '주의 필요'}
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Writer's Cockpit</h1>
              <p className="text-sm text-muted-foreground mt-1">
                프로젝트 전체 상황을 한눈에
              </p>
            </div>
          </div>

          {/* Right: Next Actions */}
          <div className="flex-1 lg:max-w-md">
            <NextActions actions={nextActions} />
          </div>
        </div>
      </div>

      {/* 📊 Key Metrics Grid (8개 메트릭으로 확장) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* 1. 전체 회차 */}
        <div className="rounded-lg border border-border bg-card p-3 hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">전체 회차</p>
              <p className="text-xl font-bold text-foreground mt-1">{totalEpisodes}</p>
            </div>
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        {/* 2. 완료 회차 */}
        <div className="rounded-lg border border-border bg-card p-3 hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">완료 회차</p>
              <p className="text-xl font-bold text-foreground mt-1">{completedChapters.length}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        </div>

        {/* 3. 비축 회차 */}
        <div className={`rounded-lg border p-3 transition-colors ${
          reserveCount <= 3 ? 'border-red-500/30 bg-red-500/10' : 'border-border bg-card hover:border-[hsl(var(--accent-primary))]/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">비축 회차</p>
              <p className={`text-xl font-bold mt-1 ${reserveCount <= 3 ? 'text-red-500' : 'text-foreground'}`}>
                {Math.max(0, reserveCount)}
              </p>
            </div>
            <Clock className={`h-6 w-6 ${reserveCount <= 3 ? 'text-red-500' : 'text-orange-500'}`} />
          </div>
        </div>

        {/* 4. 일관성 점수 */}
        <div className="rounded-lg border border-border bg-card p-3 hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">일관성 점수</p>
              <p className={`text-xl font-bold mt-1 ${
                consistencyScore >= 80 ? 'text-green-500' : consistencyScore >= 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {consistencyScore}
              </p>
            </div>
            <Target className={`h-6 w-6 ${
              consistencyScore >= 80 ? 'text-green-500' : consistencyScore >= 60 ? 'text-yellow-500' : 'text-red-500'
            }`} />
          </div>
        </div>

        {/* 5. 총 글자 수 */}
        <div className="rounded-lg border border-border bg-card p-3 hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">총 글자 수</p>
              <p className="text-xl font-bold text-foreground mt-1">{totalWordCount.toLocaleString()}</p>
            </div>
            <FileText className="h-6 w-6 text-purple-500" />
          </div>
        </div>

        {/* 6. 평균 글자수/회차 */}
        <div className="rounded-lg border border-border bg-card p-3 hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">평균 글자수</p>
              <p className="text-xl font-bold text-foreground mt-1">{averageWordCount.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-6 w-6 text-indigo-500" />
          </div>
        </div>

        {/* 7. 미회수 복선 */}
        <div className={`rounded-lg border p-3 transition-colors ${
          unresolvedForeshadows > 0 ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-border bg-card hover:border-[hsl(var(--accent-primary))]/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">미회수 복선</p>
              <p className={`text-xl font-bold mt-1 ${unresolvedForeshadows > 0 ? 'text-yellow-500' : 'text-foreground'}`}>
                {unresolvedForeshadows}
              </p>
            </div>
            <AlertTriangle className={`h-6 w-6 ${unresolvedForeshadows > 0 ? 'text-yellow-500' : 'text-blue-500'}`} />
          </div>
        </div>

        {/* 8. 캐릭터 수 */}
        <div className="rounded-lg border border-border bg-card p-3 hover:border-[hsl(var(--accent-primary))]/50 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">캐릭터</p>
              <p className="text-xl font-bold text-foreground mt-1">{characters?.length || 0}</p>
            </div>
            <Zap className="h-6 w-6 text-pink-500" />
          </div>
        </div>
      </div>

      {/* 📈 Progress Timeline (30일 누적 글자 수) */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">작성 진행 추이</h3>
            <p className="text-sm text-muted-foreground">최근 30일간 누적 글자 수</p>
          </div>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={progressTimelineData}>
            <defs>
              <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent-primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent-primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="words" 
              stroke="hsl(var(--accent-primary))" 
              fillOpacity={1}
              fill="url(#colorWords)" 
              name="누적 글자 수"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Grid 2-column: Writing Activity + Episode Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Writing Activity (7일 작성량) */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">주간 작성 활동</h3>
              <p className="text-sm text-muted-foreground">최근 7일간 작성량</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={writingActivityData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="words" 
                fill="hsl(var(--accent-primary))" 
                radius={[8, 8, 0, 0]}
                name="작성 글자 수"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Episode Status (5막 구조 분포) */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">5막 구조 분포</h3>
              <p className="text-sm text-muted-foreground">회차 개수 & 평균 글자 수</p>
            </div>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={episodeStatusData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="act" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="count" 
                fill="hsl(var(--accent-primary))" 
                radius={[8, 8, 0, 0]}
                name="회차 개수"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgWords" 
                stroke="#10b981" 
                strokeWidth={2}
                name="평균 글자 수"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🎯 Grid 2-column: Recent Warnings + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 경고 */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">최근 경고</h3>
          {warnings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <p className="text-sm text-muted-foreground">
                경고가 없습니다! 완벽하게 유지하고 계세요 ✨
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {warnings.slice(0, 3).map((warning) => (
                <div
                  key={warning.id}
                  className={`rounded-lg border p-3 ${
                    warning.severity === 'high' ? 'border-red-500/30 bg-red-500/10' :
                    warning.severity === 'medium' ? 'border-yellow-500/30 bg-yellow-500/10' :
                    'border-blue-500/30 bg-blue-500/10'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                      warning.severity === 'high' ? 'text-red-500' :
                      warning.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{warning.characterName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{warning.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleViewAllWarnings}
                className="w-full text-sm text-[hsl(var(--accent-primary))] hover:underline"
              >
                전체 경고 보기 →
              </button>
            </div>
          )}
        </div>

        {/* 빠른 액션 */}
        <QuickActions
          onConsistencyCheck={handleConsistencyCheck}
          onTimelineView={handleTimelineView}
          onNewEpisode={handleNewEpisode}
        />
      </div>

      {/* 📈 통계 개요 (실제 데이터) */}
      <StatsOverview reserves={reserves} />
    </div>
  );
};
