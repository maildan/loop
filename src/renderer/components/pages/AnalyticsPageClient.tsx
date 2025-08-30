'use client';

import React, { useState, useEffect } from 'react';
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

// 🔥 Window 타입 확장
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 3모드 분석
const ANALYTICS_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-7xl space-y-6',
  pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6',
  
  // 🎯 탭 시스템 스타일
  tabContainer: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 mb-8',
  tabList: 'flex space-x-2',
  tab: 'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer',
  tabActive: 'bg-blue-600 text-white shadow-lg',
  tabInactive: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
  tabIcon: 'text-2xl',
  tabLabel: 'font-medium',
  
  // 🔥 KPI 카드 우선순위별 스타일
  kpiGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
  kpiPrimary: 'lg:col-span-2 scale-105', // 1순위: 오늘 작성량 & 목표
  kpiSecondary: '', // 2순위: WPM & 몰입도
  kpiTertiary: 'opacity-90', // 3순위: 트렌드 & 프로젝트 수
  
  // 💡 액션 카드 스타일
  insightCard: 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded-2xl p-6 mb-6',
  insightHeader: 'flex items-center justify-between mb-4',
  insightIcon: 'text-3xl mr-3',
  insightTitle: 'text-blue-200 font-semibold text-lg',
  insightDescription: 'text-slate-300 text-sm mb-4',
  insightAction: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors',
  
  // 📊 차트 그리드
  chartsGrid: 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8',
  chartCard: 'p-6 hover:shadow-lg transition-shadow cursor-pointer',
  chartTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center',
  chartPlaceholder: 'h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 dark:text-slate-400',
  
  // 🎯 빈 상태 스타일
  emptyState: 'flex flex-col items-center justify-center py-16 px-8',
  emptyIcon: 'text-8xl mb-6 opacity-50',
  emptyTitle: 'text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4',
  emptyDescription: 'text-lg text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md',
  emptyAction: 'px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium',
  
  // 🏆 프로젝트 랭킹 스타일
  rankingCard: 'p-4 bg-slate-50 dark:bg-slate-800 rounded-xl mb-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer',
  rankingHeader: 'flex items-center justify-between mb-2',
  rankingRank: 'text-2xl font-bold text-blue-600',
  rankingTitle: 'font-semibold text-slate-900 dark:text-slate-100',
  rankingScore: 'text-sm text-green-600 font-medium',
  rankingDetails: 'text-sm text-slate-600 dark:text-slate-400',
  
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
    icon: '�',
    description: '전체 프로젝트 성과 랭킹과 비교'
  }
] as const;

// �🔥 타입 정의
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
  // 🎯 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [timeFilter, setTimeFilter] = useState<string>('이번 주');
  const [hasData, setHasData] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState({
    todayWords: 1247,
    todayGoal: 2500,
    weekWords: 8650,
    monthWords: 24750,
    avgWpm: 75,
    totalProjects: 3,
    activeProjects: 2,
    completedProjects: 1,
    accuracy: 92.5,
    streakDays: 7,
    goldenTime: '14:00-16:00',
    nextTarget: '오후 2시 집중 시간',
    weeklyTrend: ['월', '화', '수'],
    totalWords: 147382
  });

  // 💡 인사이트 데이터
  const insights: WritingInsight[] = [
    {
      id: '1',
      type: 'goldenTime',
      title: '오후 2-4시에 가장 높은 생산성을 보입니다',
      description: '평균 WPM 75로 다른 시간대 대비 47% 높은 효율성',
      action: '내일 오후 2시 집중 시간 알림 설정',
      priority: 'high',
      actionable: true
    },
    {
      id: '2',
      type: 'goal',
      title: '오늘 목표의 49.8% 달성 중',
      description: '2,500자 중 1,247자 완료, 예상 완료 시간: 오후 6시',
      action: '지금 30분만 더 써보세요',
      priority: 'medium',
      actionable: true
    },
    {
      id: '3',
      type: 'trend',
      title: '주간 패턴이 일정합니다',
      description: '월>화>수 순으로 생산성이 높음, 일관된 패턴 유지',
      action: '이 패턴을 다음 주에도 적용해보세요',
      priority: 'low',
      actionable: false
    }
  ];

  // 🏆 프로젝트 랭킹 데이터
  const projectRankings: ProjectRanking[] = [
    {
      id: '1',
      title: '로맨스 소설 A',
      score: 87,
      progress: 47.4,
      genre: '로맨스',
      insights: ['높은 몰입도', '빠른 진행', '일정한 페이스'],
      trend: 'up'
    },
    {
      id: '2',
      title: '에세이 B',
      score: 72,
      progress: 23.1,
      genre: '에세이',
      insights: ['꾸준한 페이스', '안정적', '개선 여지'],
      trend: 'stable'
    },
    {
      id: '3',
      title: '시나리오 C',
      score: 65,
      progress: 12.8,
      genre: '시나리오',
      insights: ['느린 시작', '개선 필요', '잠재력 높음'],
      trend: 'down'
    }
  ];

  // 🔥 데이터 로드
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        if (typeof window !== 'undefined' && window.electronAPI) {
          const response = await window.electronAPI.dashboard.getStats();
          if (response.success && response.data) {
            setDashboardData(prev => ({
              ...prev,
              ...response.data
            }));
            setHasData(true);
          }
        }
      } catch (error) {
        Logger.error('ANALYTICS_PAGE', '대시보드 데이터 로드 실패', error);
        // 데모 데이터로 계속 진행
        setHasData(true);
      }
    };

    loadData();
  }, []);

  // 🎯 빈 상태 컴포넌트
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
      <Button className={ANALYTICS_STYLES.emptyAction}>
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
        <div className="flex items-center gap-2">
          {project.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
          {project.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
          {project.trend === 'stable' && <Activity className="w-4 h-4 text-blue-500" />}
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
    <div className="space-y-8">
      {/* 💡 액션 가능한 인사이트 */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
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
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
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
            <p className="font-medium">{dashboardData.weeklyTrend.join(' > ')} 순 생산성</p>
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
            <p className="font-medium">로맨스 60% • 에세이 25% • 기타 15%</p>
            <p className="text-sm mt-2">클릭하여 상세 분석 보기 →</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderProjectView = () => (
    <div className="space-y-8">
      {/* 🎯 프로젝트 선택 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          <BookOpen className="w-5 h-5 inline mr-2" />
          프로젝트별 세부 분석
        </h2>
        <div className="flex gap-2 mb-6">
          {['로맨스 소설 A', '에세이 B', '시나리오 C'].map(project => (
            <Button 
              key={project}
              variant="ghost"
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              {project}
            </Button>
          ))}
        </div>

        {/* 선택된 프로젝트 상세 정보 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            📖 로맨스 소설 A - 세부 분석
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">진행률</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                47,382 / 100,000자 (47.4%)
              </div>
              <ProgressBar value={47.4} className="mt-2" />
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">예상 완료</div>
              <div className="text-lg font-semibold text-blue-600">2024년 8월 15일</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">현재 페이스 기준</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">장르 벤치마크</div>
              <div className="text-lg font-semibold text-green-600">평균 대비 12% 빠름</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">로맨스 소설 기준</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">다음 액션</div>
                <div className="text-sm text-blue-700 dark:text-blue-200">이번 주 3,500자 더 써야 일정 맞춤</div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                목표 설정
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 📊 프로젝트 차트 */}
      <div className={ANALYTICS_STYLES.chartsGrid}>
        <Card className={ANALYTICS_STYLES.chartCard}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <LineChart className="w-5 h-5 mr-2" />
            일일 진행률
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <LineChart className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">지난 7일 평균: 1,247자/일</p>
            <p className="text-sm mt-2">일관된 페이스 유지 중</p>
          </div>
        </Card>

        <Card className={ANALYTICS_STYLES.chartCard}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <Target className="w-5 h-5 mr-2" />
            목표 달성률
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <Target className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">이번 주: 89% 달성</p>
            <p className="text-sm mt-2">목표보다 앞서 진행 중</p>
          </div>
        </Card>

        <Card className={ANALYTICS_STYLES.chartCard}>
          <h3 className={ANALYTICS_STYLES.chartTitle}>
            <Activity className="w-5 h-5 mr-2" />
            집중도 분석
          </h3>
          <div className={ANALYTICS_STYLES.chartPlaceholder}>
            <Activity className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-medium">평균 집중도: 87%</p>
            <p className="text-sm mt-2">높은 몰입 상태 유지</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCompareView = () => (
    <div className="space-y-8">
      {/* 🏆 프로젝트 성과 랭킹 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          <Award className="w-5 h-5 inline mr-2" />
          프로젝트 성과 랭킹
        </h2>
        {projectRankings.map((project, index) => (
          <ProjectRankingCard key={project.id} project={project} rank={index + 1} />
        ))}
        
        {/* 📊 종합 추천 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-green-900 dark:text-green-100">💡 추천</div>
              <div className="text-sm text-green-700 dark:text-green-200">
                로맨스 소설의 성공 패턴을 다른 프로젝트에 적용해보세요
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              패턴 적용
            </Button>
          </div>
        </div>
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
            <p className="font-medium">로맨스 87점 &gt; 에세이 72점 &gt; 시나리오 65점</p>
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
            <p className="font-medium">평균 1,200자/일 • 최고 2,100자/일</p>
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
              className={`px-4 py-2 ${timeFilter === period ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
              onClick={() => setTimeFilter(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* 🎯 상단 탭 시스템 */}
      <div className={ANALYTICS_STYLES.tabContainer}>
        <div className={ANALYTICS_STYLES.tabList}>
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.id}
              className={`${ANALYTICS_STYLES.tab} ${
                activeTab === tab.id 
                  ? ANALYTICS_STYLES.tabActive 
                  : ANALYTICS_STYLES.tabInactive
              }`}
              onClick={() => setActiveTab(tab.id as TabType)}
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
      {!hasData ? (
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
