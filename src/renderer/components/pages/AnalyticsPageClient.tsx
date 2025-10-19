'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Clock,
  Target,
  BookOpen,
  Zap,
  Globe,
  Award,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  Users,
  PieChart,
  LineChart,
  Filter,
  Sparkles
} from 'lucide-react';
import { KpiCard } from '../ui/KpiCard';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Logger } from '../../../shared/logger';
import type { ElectronAPI } from '../../../shared/types';
import { useGuidedTour } from '../../modules/tutorial/useGuidedTour';

// 🔥 Window 타입 확장
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 3모드 분석
const ANALYTICS_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-7xl space-y-6',
  pageTitle: 'text-3xl font-bold text-[color:hsl(var(--foreground))] mb-6',

  // 🎯 탭 시스템 스타일
  tabContainer: 'bg-[color:hsl(var(--card))] border border-[color:hsl(var(--border))] rounded-2xl p-2 mb-8 shadow-sm',
  tabList: 'flex space-x-2',
  tab: 'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer',
  tabActive: 'bg-[color:var(--accent-primary)] text-[color:var(--text-inverse,#ffffff)] shadow-lg',
  tabInactive: 'text-[color:hsl(var(--muted-foreground))] hover:bg-[color:hsl(var(--muted))]',
  tabIcon: 'text-2xl',
  tabLabel: 'font-medium',

  // 🔥 KPI 카드 우선순위별 스타일
  kpiGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
  kpiPrimary: 'lg:col-span-2 scale-105', // 1순위: 오늘 작성량 & 목표
  kpiSecondary: '', // 2순위: WPM & 몰입도
  kpiTertiary: 'opacity-90', // 3순위: 트렌드 & 프로젝트 수

  // 💡 액션 카드 스타일
  insightCard: 'bg-[color:var(--accent-light)] border border-[color:var(--accent-primary)]/40 rounded-2xl p-6 mb-6 shadow-sm',
  insightHeader: 'flex items-center justify-between mb-4',
  insightIcon: 'text-3xl mr-3',
  insightTitle: 'text-[color:var(--accent-primary)] font-semibold text-lg',
  insightDescription: 'text-[color:hsl(var(--muted-foreground))] text-sm mb-4',
  insightAction: 'px-4 py-2 bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--text-inverse,#ffffff)] rounded-lg transition-colors',

  // 📊 차트 그리드
  chartsGrid: 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8',
  chartCard: 'p-6 hover:shadow-lg transition-shadow cursor-pointer bg-[color:hsl(var(--card))] border border-[color:hsl(var(--border))] rounded-2xl',
  chartTitle: 'text-lg font-semibold text-[color:hsl(var(--foreground))] mb-4 flex items-center',
  chartPlaceholder: 'h-48 bg-[color:hsl(var(--muted))] rounded-lg flex flex-col items-center justify-center text-[color:hsl(var(--muted-foreground))]',

  // 🎯 빈 상태 스타일
  emptyState: 'flex flex-col items-center justify-center py-16 px-8',
  emptyIcon: 'text-8xl mb-6 opacity-50',
  emptyTitle: 'text-2xl font-bold text-[color:hsl(var(--foreground))] mb-4',
  emptyDescription: 'text-lg text-[color:hsl(var(--muted-foreground))] text-center mb-8 max-w-md',
  emptyAction: 'px-8 py-3 bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--text-inverse,#ffffff)] rounded-xl transition-colors font-medium',

  // 🏆 프로젝트 랭킹 스타일
  rankingCard: 'p-4 bg-[color:hsl(var(--muted))] rounded-xl mb-4 hover:bg-[color:hsl(var(--muted) / 0.85)] transition-colors cursor-pointer',
  rankingHeader: 'flex items-center justify-between mb-2',
  rankingRank: 'text-2xl font-bold text-[color:var(--accent-primary)]',
  rankingTitle: 'font-semibold text-[color:hsl(var(--foreground))]',
  rankingScore: 'text-sm text-[color:var(--success)] font-medium',
  rankingDetails: 'text-sm text-[color:hsl(var(--muted-foreground))]',

  // 📱 모바일 최적화
  mobileGrid: 'grid grid-cols-2 gap-4 sm:grid-cols-4',
} as const;

// 🎯 탭 설정
const TAB_CONFIG = [
  {
    id: 'global',
    label: '전역 통계',
    icon: '🌍',
    description: '전체 글쓰기 패턴과 골든타임 분석'
  },
  {
    id: 'project',
    label: '프로젝트 분석',
    icon: '📖',
    description: '개별 프로젝트 세부 분석과 진행률'
  },
  {
    id: 'compare',
    label: '종합 비교',
    icon: '🏆',
    description: '전체 프로젝트 성과 랭킹과 비교'
  }
] as const;

// 🔥 타입 정의
type TabType = 'global' | 'project' | 'compare';

interface WritingInsight {
  id: string;
  type: 'goldenTime' | 'goal' | 'trend' | 'recommendation';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface ProjectRanking {
  id: string;
  title: string;
  score: number;
  progress: number;
  genre: string;
  insights: string[];
  trend: 'up' | 'down' | 'stable';
}

// 🔥 분리된 Analytics 페이지 클라이언트 컴포넌트
export function AnalyticsPageClient(): React.ReactElement {
  const navigate = useNavigate(); // 🔥 라우터 추가

  // 🔥 분석 페이지에서도 튜토리얼 드라이버 활성화
  useGuidedTour();

  // 🎯 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [timeFilter, setTimeFilter] = useState<string>('이번 주');
  const [hasData, setHasData] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState({
    todayWords: 0,
    todayGoal: 2500, // 기본 목표만 유지
    weekWords: 0,
    monthWords: 0,
    avgWpm: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    accuracy: 0,
    streakDays: 0,
    goldenTime: '14:00-16:00', // 기본 골든타임 유지
    nextTarget: '목표 설정 필요',
    weeklyTrend: [] as string[],
    totalWords: 0
  });

  // � 실제 Analytics API 데이터 상태
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<WritingInsight[]>([]);
  const [projectRankings, setProjectRankings] = useState<ProjectRanking[]>([]);

  // 🔥 실제 데이터 로드
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);

        // 🎯 실제 Electron Analytics API 호출
        if (typeof window !== 'undefined' && window.electronAPI) {
          const response = await window.electronAPI.dashboard.getAnalytics();

          // 🔥 디버깅: API 응답 구조 로깅
          Logger.info('ANALYTICS_PAGE', 'API Response received', {
            hasResponse: !!response,
            success: response?.success,
            hasData: !!response?.data,
            responseKeys: response ? Object.keys(response) : [],
            dataKeys: response?.data ? Object.keys(response.data) : []
          });

          if (response.success && response.data) {
            const data = response.data;
            setAnalyticsData(data);

            // 🎯 대시보드 데이터 업데이트
            setDashboardData({
              todayWords: data.todayWords || 0,
              todayGoal: 2500, // 목표는 설정값 유지
              weekWords: data.weeklyWords || 0,
              monthWords: data.totalWords || 0,
              avgWpm: Math.round(data.avgWpm) || 0,
              totalProjects: data.totalProjects || 0,
              activeProjects: data.activeProjects || 0,
              completedProjects: data.completedProjects || 0,
              accuracy: Math.round(data.avgAccuracy) || 0,
              streakDays: 7, // TODO: 실제 연속 일수 계산
              goldenTime: '14:00-16:00', // TODO: 실제 최고 시간대 분석
              nextTarget: '다음 목표 설정',
              weeklyTrend: ['월', '화', '수', '목', '금'], // TODO: 실제 주간 트렌드
              totalWords: data.totalWords || 0
            });

            // 🎯 인사이트 데이터 업데이트
            setInsights(data.insights || []);

            // 🎯 프로젝트 랭킹 데이터 업데이트
            setProjectRankings(data.topProjects?.map((project: any) => ({
              id: project.id,
              title: project.title,
              score: Math.min(100, Math.round((project.wordCount || 0) / 100)), // 단어수 기반 점수
              progress: project.progress || 0,
              genre: project.genre || '기타',
              insights: [
                `${(project.wordCount || 0).toLocaleString()}단어`,
                `진행률 ${project.progress || 0}%`
              ],
              trend: (project.wordCount || 0) > 5000 ? 'up' : (project.wordCount || 0) > 1000 ? 'stable' : 'down'
            })) || []);

            setHasData(data.hasData);
            Logger.info('ANALYTICS_PAGE', 'Real data loaded successfully', {
              projects: data.totalProjects,
              characters: data.totalCharacters,
              sessions: data.totalSessions
            });
          } else {
            throw new Error('Invalid Analytics API response');
          }
        } else {
          throw new Error('ElectronAPI not available');
        }
      } catch (error) {
        Logger.error('ANALYTICS_PAGE', 'Failed to load analytics data', error);

        // 🚨 실패시 빈 상태로 설정 (더미 데이터 없음)
        setHasData(false);
        setInsights([]);
        setProjectRankings([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  //  빈 상태 컴포넌트
  const EmptyState = ({ type }: { type: string }) => (
    <div className={ANALYTICS_STYLES.emptyState}>
      <div className={ANALYTICS_STYLES.emptyIcon}>✍️</div>
      <h3 className={ANALYTICS_STYLES.emptyTitle}>
        {type === 'noData' && '아직 데이터가 없습니다'}
        {type === 'firstWeek' && '첫 주 데이터를 수집 중입니다'}
        {type === 'analyzing' && '패턴을 분석 중입니다'}
      </h3>
      <p className={ANALYTICS_STYLES.emptyDescription}>
        {type === 'noData' && '글쓰기를 시작하면 의미있는 분석을 제공해드려요!'}
        {type === 'firstWeek' && '조금만 더 써보시면 더 정확한 분석이 가능해요!'}
        {type === 'analyzing' && '더 정확한 분석을 위해 계속 써보세요!'}
      </p>
      <Button
        className={ANALYTICS_STYLES.emptyAction}
        onClick={() => {
          Logger.info('ANALYTICS_PAGE', 'Redirecting to project creator');
          navigate('/projects?create=true');
        }}
      >
        글쓰기 시작하기
      </Button>
    </div>
  );

  // 💡 액션 가능한 인사이트 카드
  const ActionableInsight = ({ insight }: { insight: WritingInsight }) => (
    <div className={ANALYTICS_STYLES.insightCard}>
      <div className={ANALYTICS_STYLES.insightHeader}>
        <div className="flex items-center">
          <span className={ANALYTICS_STYLES.insightIcon}>
            {insight.type === 'goldenTime' && '⏰'}
            {insight.type === 'goal' && '🎯'}
            {insight.type === 'trend' && '📈'}
            {insight.type === 'recommendation' && '💡'}
          </span>
          <div>
            <h4 className={ANALYTICS_STYLES.insightTitle}>{insight.title}</h4>
            <p className={ANALYTICS_STYLES.insightDescription}>{insight.description}</p>
          </div>
        </div>
        {insight.actionable && (
          <Button className={ANALYTICS_STYLES.insightAction}>
            {insight.action}
          </Button>
        )}
      </div>
    </div>
  );

  // 🏆 프로젝트 랭킹 카드
  const ProjectRankingCard = ({ project, rank }: { project: ProjectRanking; rank: number }) => (
    <div className={ANALYTICS_STYLES.rankingCard}>
      <div className={ANALYTICS_STYLES.rankingHeader}>
        <div className="flex items-center gap-3">
          <span className={ANALYTICS_STYLES.rankingRank}>{rank}</span>
          <div>
            <h4 className={ANALYTICS_STYLES.rankingTitle}>{project.title}</h4>
            <span className={ANALYTICS_STYLES.rankingScore}>{project.score}점</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[color:hsl(var(--muted-foreground))]">
          {project.trend === 'up' && <ArrowUp className="w-4 h-4 text-[color:var(--success)]" />}
          {project.trend === 'down' && <ArrowDown className="w-4 h-4 text-[color:var(--error)]" />}
          {project.trend === 'stable' && <Activity className="w-4 h-4 text-[color:var(--accent-primary)]" />}
          <span className="text-sm font-medium">{project.progress}%</span>
        </div>
      </div>
      <div className={ANALYTICS_STYLES.rankingDetails}>
        {project.insights.join(' • ')}
      </div>
      <ProgressBar value={project.progress} className="mt-2" />
    </div>
  );

  // 🎯 탭별 렌더링 함수
  const renderGlobalView = () => (
    <div className="space-y-8" data-tour="analytics-global-view">
      {/* 💡 액션 가능한 인사이트 */}
      <div>
        <h2 className="text-xl font-bold text-[color:hsl(var(--foreground))] mb-4">
          <Sparkles className="w-5 h-5 inline mr-2" />
          오늘의 인사이트
        </h2>
        {insights.map(insight => (
          <ActionableInsight key={insight.id} insight={insight} />
        ))}
      </div>

      {/* 🎯 핵심 KPI (우선순위 적용) */}
      <div className={ANALYTICS_STYLES.kpiGrid}>
        <div className={ANALYTICS_STYLES.kpiPrimary}>
          <KpiCard
            title="오늘 작성량 / 목표"
            value={`${dashboardData.todayWords.toLocaleString()} / ${dashboardData.todayGoal.toLocaleString()}자`}
            change={{
              value: Math.round((dashboardData.todayWords / dashboardData.todayGoal) * 100),
              type: 'increase',
              period: '목표 달성률'
            }}
            icon={Target}
            className="bg-[color:var(--accent-light)] border border-[color:var(--accent-primary)]/20"
          />
        </div>
        <KpiCard
          title="평균 WPM"
          value={dashboardData.avgWpm}
          change={{ value: 12.5, type: 'increase', period: '어제 대비' }}
          icon={Zap}
        />
        <KpiCard
          title="몰입도 점수"
          value={`${dashboardData.accuracy}%`}
          change={{ value: 5.2, type: 'increase', period: '지난주 대비' }}
          icon={Award}
        />
        <div className={ANALYTICS_STYLES.kpiTertiary}>
          <KpiCard
            title="연속 작성 일수"
            value={`${dashboardData.streakDays}일`}
            change={{ value: 1, type: 'increase', period: '어제 대비' }}
            icon={Calendar}
            className="opacity-90"
          />
        </div>
      </div>

      {/* 📊 차트 영역 */}
      <div className={ANALYTICS_STYLES.chartsGrid}>
        <Card className={`${ANALYTICS_STYLES.chartCard} hover:scale-105 transition-transform`}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <Activity className="w-5 h-5 mr-2" />
            골든타임 분석
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <Clock className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">최고 생산성: {dashboardData.goldenTime}</p>
            <p className="text-sm mt-2">클릭하여 시간대별 분석 보기 →</p>
          </div>
        </Card>

        <Card className={`${ANALYTICS_STYLES.chartCard} hover:scale-105 transition-transform`}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <TrendingUp className="w-5 h-5 mr-2" />
            주간 패턴
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">
              {analyticsData?.recentActivity?.length > 0
                ? `최근 ${analyticsData.recentActivity.length}개 세션 활동`
                : '주간 활동 데이터 없음'
              }
            </p>
            <p className="text-sm mt-2">클릭하여 패턴 분석 보기 →</p>
          </div>
        </Card>

        <Card className={`${ANALYTICS_STYLES.chartCard} hover:scale-105 transition-transform`}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <PieChart className="w-5 h-5 mr-2" />
            장르별 분포
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <PieChart className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">
              {analyticsData?.topProjects?.length > 0
                ? (() => {
                  const genreCount = analyticsData.topProjects.reduce((acc: Record<string, number>, project: any) => {
                    const genre = project.genre || '기타';
                    acc[genre] = (acc[genre] || 0) + 1;
                    return acc;
                  }, {});
                  const total = analyticsData.topProjects.length;
                  return Object.entries(genreCount)
                    .map(([genre, count]) => `${genre} ${Math.round((count as number) / total * 100)}%`)
                    .join(' • ');
                })()
                : '장르 데이터 없음'
              }
            </p>
            <p className="text-sm mt-2">클릭하여 상세 분석 보기 →</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderProjectView = () => (
    <div className="space-y-8" data-tour="analytics-project-view">
      {/* 🎯 프로젝트 목록 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[color:hsl(var(--foreground))] mb-6">
          <BookOpen className="w-5 h-5 inline mr-2" />
          프로젝트별 분석
        </h2>

        {projectRankings.length > 0 ? (
          <div className="space-y-4">
            {projectRankings.map((project, index) => (
              <div key={project.id} className={ANALYTICS_STYLES.rankingCard}>
                <div className={ANALYTICS_STYLES.rankingHeader}>
                  <div className="flex items-center space-x-4">
                    <div className={ANALYTICS_STYLES.rankingRank}>#{index + 1}</div>
                    <div className="flex-1">
                      <div className={ANALYTICS_STYLES.rankingTitle}>{project.title}</div>
                      <div className={ANALYTICS_STYLES.rankingDetails}>
                        {project.genre} • {project.insights.join(' • ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={ANALYTICS_STYLES.rankingScore}>
                        {project.trend === 'up' && <ArrowUp className="w-4 h-4 inline text-[color:var(--success)]" />}
                        {project.trend === 'down' && <ArrowDown className="w-4 h-4 inline text-[color:var(--error)]" />}
                        {project.trend === 'stable' && <span className="w-4 h-4 inline-block text-[color:var(--accent-primary)]">-</span>}
                        진행률 {project.progress}%
                      </div>
                      <ProgressBar value={project.progress} className="w-32 mt-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    className="px-4 py-2 rounded-lg bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--text-inverse,#ffffff)] transition-colors"
                    onClick={() => {
                      Logger.info('ANALYTICS_PAGE', 'Navigating to project details', { projectId: project.id });
                      navigate(`/projects/${project.id}`);
                    }}
                  >
                    자세히 보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 mx-auto text-[color:hsl(var(--muted-foreground))] mb-4" />
            <p className="text-lg text-[color:hsl(var(--muted-foreground))] mb-4">
              아직 생성된 프로젝트가 없습니다
            </p>
            <Button
              className="px-6 py-2 rounded-lg bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--text-inverse,#ffffff)] transition-colors"
              onClick={() => {
                Logger.info('ANALYTICS_PAGE', 'Creating new project from analytics');
                navigate('/projects?create=true');
              }}
            >
              첫 프로젝트 만들기
            </Button>
          </div>
        )}
      </Card>

      {/* 🎯 프로젝트 통계 개요 */}
      {projectRankings.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[color:hsl(var(--foreground))] mb-4">
            프로젝트 통계 개요
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-[color:var(--accent-light)] rounded-lg">
              <div className="text-2xl font-bold text-[color:var(--accent-primary)]">{dashboardData.totalProjects}</div>
              <div className="text-sm text-[color:hsl(var(--muted-foreground))]">총 프로젝트</div>
            </div>
            <div className="text-center p-4 bg-[color:var(--success-light,#d1fae5)] rounded-lg">
              <div className="text-2xl font-bold text-[color:var(--success)]">{dashboardData.activeProjects}</div>
              <div className="text-sm text-[color:hsl(var(--muted-foreground))]">진행 중</div>
            </div>
            <div className="text-center p-4 bg-[color:var(--accent-light)] rounded-lg">
              <div className="text-2xl font-bold text-[color:var(--accent-primary)]">{dashboardData.completedProjects}</div>
              <div className="text-sm text-[color:hsl(var(--muted-foreground))]">완료됨</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderCompareView = () => (
    <div className="space-y-8" data-tour="analytics-compare-view">
      {/* 🏆 프로젝트 성과 랭킹 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[color:hsl(var(--foreground))] mb-6">
          <Award className="w-5 h-5 inline mr-2" />
          프로젝트 성과 랭킹
        </h2>
        {projectRankings.length > 0 ? (
          <div className="space-y-4">
            {projectRankings.map((project, index) => (
              <ProjectRankingCard key={project.id} project={project} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="w-16 h-16 mx-auto text-[color:hsl(var(--muted-foreground))] mb-4" />
            <p className="text-lg text-[color:hsl(var(--muted-foreground))]">
              프로젝트 랭킹을 위해서는 더 많은 데이터가 필요합니다
            </p>
          </div>
        )}

        {/* 📊 종합 추천 */}
        {projectRankings.length > 0 && (
          <div className="mt-6 p-4 bg-[color:var(--success-light,#d1fae5)] border border-[color:var(--success)]/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[color:var(--success)]">💡 추천</div>
                <div className="text-sm text-[color:hsl(var(--muted-foreground))]">
                  {projectRankings[0]?.title}의 성공 패턴을 다른 프로젝트에 적용해보세요
                </div>
              </div>
              <Button className="bg-[color:var(--success)] hover:bg-[color:var(--success)]/90 text-[color:var(--text-inverse,#ffffff)]">
                패턴 적용
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 📊 비교 차트 */}
      <div className={ANALYTICS_STYLES.chartsGrid}>
        <Card className={ANALYTICS_STYLES.chartCard}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <BarChart3 className="w-5 h-5 mr-2" />
            장르별 성과 비교
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">
              {analyticsData?.topProjects?.length > 0
                ? (() => {
                  const genreScores = analyticsData.topProjects.reduce((acc: Record<string, number>, project: any) => {
                    const genre = project.genre || '기타';
                    const score = Math.min(100, Math.round((project.wordCount || 0) / 100));
                    if (!acc[genre] || acc[genre] < score) {
                      acc[genre] = score;
                    }
                    return acc;
                  }, {});
                  return Object.entries(genreScores)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([genre, score]) => `${genre} ${score}점`)
                    .join(' > ');
                })()
                : '장르별 데이터 없음'
              }
            </p>
            <p className="text-sm mt-2">클릭하여 상세 비교 보기 →</p>
          </div>
        </Card>

        <Card className={ANALYTICS_STYLES.chartCard}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <TrendingUp className="w-5 h-5 mr-2" />
            진행 속도 분석
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">
              {dashboardData.totalWords > 0
                ? `평균 ${Math.round(dashboardData.totalWords / 30)}자/일 • 총 ${dashboardData.totalWords.toLocaleString()}자`
                : '속도 분석 데이터 없음'
              }
            </p>
            <p className="text-sm mt-2">프로젝트별 속도 차이 분석</p>
          </div>
        </Card>

        <Card className={ANALYTICS_STYLES.chartCard}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <Users className="w-5 h-5 mr-2" />
            작가 벤치마크
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">상위 23% 작가군</p>
            <p className="text-sm mt-2">동일 장르 작가 대비 성과</p>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className={ANALYTICS_STYLES.container}>
      {/* 🎯 페이지 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className={ANALYTICS_STYLES.pageTitle}>
          작가 전용 분석 대시보드
        </h1>

        {/* 🔍 시간 필터 */}
        <div className="flex gap-2">
          {['오늘', '이번 주', '이번 달', '전체'].map(period => (
            <Button
              key={period}
              variant={timeFilter === period ? 'primary' : 'ghost'}
              className={`px-4 py-2 transition-colors ${
                timeFilter === period
                  ? 'bg-[color:var(--accent-primary)] text-[color:var(--text-inverse,#ffffff)]'
                  : 'text-[color:hsl(var(--muted-foreground))] hover:bg-[color:hsl(var(--muted))]'
              }`}
              onClick={() => setTimeFilter(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* 🎯 상단 탭 시스템 */}
      <div className={ANALYTICS_STYLES.tabContainer} data-tour="analytics-tabs-container">
        <div className={ANALYTICS_STYLES.tabList}>
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.id}
              className={`${ANALYTICS_STYLES.tab} ${activeTab === tab.id
                ? ANALYTICS_STYLES.tabActive
                : ANALYTICS_STYLES.tabInactive
                }`}
              onClick={() => setActiveTab(tab.id as TabType)}
              data-tour={`analytics-tab-${tab.id}`}
            >
              <span className={ANALYTICS_STYLES.tabIcon}>{tab.icon}</span>
              <div className="text-left">
                <div className={ANALYTICS_STYLES.tabLabel}>{tab.label}</div>
                <div className="text-xs opacity-75">{tab.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 🎯 탭별 컨텐츠 */}
      {loading ? (
        /* 🔄 로딩 상태 */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="p-6 rounded-xl border bg-[color:hsl(var(--card))] border-[color:hsl(var(--border))] shadow-sm"
              >
                <div className="animate-pulse space-y-2">
                  <div className="h-4 rounded w-3/4 bg-[color:hsl(var(--muted))]"></div>
                  <div className="h-8 rounded w-1/2 bg-[color:hsl(var(--muted))]"></div>
                  <div className="h-3 rounded w-full bg-[color:hsl(var(--muted))]"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center py-8">
            <div className="text-lg text-[color:hsl(var(--foreground))]/80">실제 데이터를 불러오는 중...</div>
            <div className="text-sm text-[color:hsl(var(--muted-foreground))] mt-1">프로젝트, 캐릭터, 통계 분석 중</div>
          </div>
        </div>
      ) : !hasData ? (
        <EmptyState type="firstWeek" />
      ) : (
        <>
          {activeTab === 'global' && renderGlobalView()}
          {activeTab === 'project' && renderProjectView()}
          {activeTab === 'compare' && renderCompareView()}
        </>
      )}
    </div>
  );
}

export default AnalyticsPageClient;
