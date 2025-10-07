// 🔥 Overview Tab - 작품 전체 개요 및 한국 웹소설 분석
'use client';

import React from 'react';
import {
    BookOpen,
    Target,
    TrendingUp,
    Award,
    Clock,
    FileText,
    Sparkles,
    BarChart3
} from 'lucide-react';
import { Card } from '../../../ui/Card';
import { Badge } from '../../../ui/Badge';
import { ProgressBar } from '../../../ui/ProgressBar';

interface OverviewTabProps {
    projectId: string;
    // 🔥 한국 웹소설 분석 데이터 (추후 실제 데이터 연결)
    koreanAnalysis?: {
        detectedGenre: string;
        genreConsistency: number;
        detectedCliches: string[];
        keywordScore: number;
        targetAudience: string;
        recommendations: string[];
    };
    // 기본 프로젝트 데이터
    metadata?: {
        title: string;
        genre?: string;
        targetWordCount?: number;
        currentWordCount?: number;
        createdAt?: Date;
        updatedAt?: Date;
    };
    // 완성도 데이터
    completeness?: {
        storyConsistency: number;
        characterConsistency: number;
        plotCompleteness: number;
        fiveActProgress: {
            intro: number; // 도입
            rising: number; // 발단
            development: number; // 전개
            climax: number; // 절정
            conclusion: number; // 결말
        };
    };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
    projectId,
    koreanAnalysis = {
        detectedGenre: '분석 대기',
        genreConsistency: 0,
        detectedCliches: [],
        keywordScore: 0,
        targetAudience: '미정',
        recommendations: []
    },
    metadata = {
        title: '새 프로젝트',
        targetWordCount: 100000,
        currentWordCount: 0
    },
    completeness = {
        storyConsistency: 0,
        characterConsistency: 0,
        plotCompleteness: 0,
        fiveActProgress: {
            intro: 0,
            rising: 0,
            development: 0,
            climax: 0,
            conclusion: 0
        }
    }
}) => {
    // 전체 완성도 계산
    const overallCompleteness = Math.round(
        (completeness.storyConsistency +
            completeness.characterConsistency +
            completeness.plotCompleteness) /
            3
    );

    // 진행률 계산
    const progressPercentage = metadata.targetWordCount
        ? Math.round((metadata.currentWordCount || 0) / metadata.targetWordCount * 100)
        : 0;

    // 장르 Badge 색상
    const getGenreBadgeVariant = (genre: string) => {
        const genreMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'orange'> = {
            'romance-fantasy': 'purple',
            '로맨스판타지': 'purple',
            'hunter': 'danger',
            '헌터물': 'danger',
            'fantasy': 'primary',
            '판타지': 'primary',
            'martial-arts': 'orange',
            '무협': 'orange',
            'romance': 'success',
            '로맨스': 'success'
        };
        return genreMap[genre] || 'default';
    };

    // 키워드 점수 Badge 색상
    const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'danger' => {
        if (score >= 70) return 'success';
        if (score >= 40) return 'warning';
        return 'danger';
    };

    return (
        <div className="space-y-6">
            {/* 🔥 작품 메타데이터 카드 */}
            <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{metadata.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                작품 기본 정보
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        프로젝트 ID: {projectId.slice(0, 8)}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 목표 분량 */}
                    <div className="p-4 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">목표 분량</span>
                        </div>
                        <p className="text-2xl font-bold">
                            {(metadata.targetWordCount || 0).toLocaleString()}자
                        </p>
                    </div>

                    {/* 현재 분량 */}
                    <div className="p-4 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">현재 분량</span>
                        </div>
                        <p className="text-2xl font-bold">
                            {(metadata.currentWordCount || 0).toLocaleString()}자
                        </p>
                    </div>

                    {/* 진행률 */}
                    <div className="p-4 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">진행률</span>
                        </div>
                        <p className="text-2xl font-bold">{progressPercentage}%</p>
                    </div>

                    {/* 전체 완성도 */}
                    <div className="p-4 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">완성도</span>
                        </div>
                        <p className="text-2xl font-bold">{overallCompleteness}%</p>
                    </div>
                </div>

                {/* 진행률 바 */}
                <div className="mt-4">
                    <ProgressBar
                        value={progressPercentage}
                        className="h-2"
                    />
                </div>
            </Card>

            {/* 🔥 한국 웹소설 분석 카드 */}
            <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Sparkles className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">한국 웹소설 분석</h3>
                            <p className="text-sm text-muted-foreground">
                                2025 시장 트렌드 기반 자동 분석
                            </p>
                        </div>
                    </div>
                    <Badge variant="primary">AI 분석</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* 장르 감지 */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">감지된 장르</h4>
                            <Badge variant={getGenreBadgeVariant(koreanAnalysis.detectedGenre)}>
                                {koreanAnalysis.detectedGenre}
                            </Badge>
                        </div>
                        <div className="mb-2">
                            <span className="text-sm text-muted-foreground">장르 일관성</span>
                        </div>
                        <ProgressBar
                            value={koreanAnalysis.genreConsistency}
                            className="h-2 mb-1"
                        />
                        <span className="text-xs text-muted-foreground">
                            {koreanAnalysis.genreConsistency}%
                        </span>
                    </div>

                    {/* 키워드 점수 */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">키워드 매력도</h4>
                            <Badge variant={getScoreBadgeVariant(koreanAnalysis.keywordScore)}>
                                {koreanAnalysis.keywordScore}/100
                            </Badge>
                        </div>
                        <div className="mb-2">
                            <span className="text-sm text-muted-foreground">
                                주 타겟: {koreanAnalysis.targetAudience}
                            </span>
                        </div>
                        <ProgressBar
                            value={koreanAnalysis.keywordScore}
                            className="h-2 mb-1"
                        />
                        <span className="text-xs text-muted-foreground">
                            2025 트렌드 부합도
                        </span>
                    </div>
                </div>

                {/* 감지된 클리셰 */}
                {koreanAnalysis.detectedCliches.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold mb-3">감지된 클리셰</h4>
                        <div className="flex flex-wrap gap-2">
                            {koreanAnalysis.detectedCliches.map((cliche, index) => (
                                <Badge key={index} variant="outline" className="text-sm">
                                    #{cliche}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* 개선 제안 */}
                {koreanAnalysis.recommendations.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold mb-3">개선 제안</h4>
                        <ul className="space-y-2">
                            {koreanAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>

            {/* 🔥 완성도 대시보드 */}
            <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success/10 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">완성도 대시보드</h3>
                            <p className="text-sm text-muted-foreground">
                                스토리, 캐릭터, 플롯 분석
                            </p>
                        </div>
                    </div>
                </div>

                {/* 일관성 지표 */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">스토리 일관성</span>
                            <span className="text-sm text-muted-foreground">
                                {completeness.storyConsistency}%
                            </span>
                        </div>
                        <ProgressBar
                            value={completeness.storyConsistency}
                            className="h-2"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">캐릭터 일관성</span>
                            <span className="text-sm text-muted-foreground">
                                {completeness.characterConsistency}%
                            </span>
                        </div>
                        <ProgressBar
                            value={completeness.characterConsistency}
                            className="h-2"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">플롯 완성도</span>
                            <span className="text-sm text-muted-foreground">
                                {completeness.plotCompleteness}%
                            </span>
                        </div>
                        <ProgressBar
                            value={completeness.plotCompleteness}
                            className="h-2"
                        />
                    </div>
                </div>

                {/* 🔥 한국식 5막 구조 진행도 */}
                <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                        한국식 5막 구조 진행도
                        <Badge variant="primary" className="text-xs">기승전결</Badge>
                    </h4>
                    <div className="space-y-3">
                        {[
                            { label: '1막 (도입)', key: 'intro', color: 'bg-blue-500' },
                            { label: '2막 (발단)', key: 'rising', color: 'bg-green-500' },
                            { label: '3막 (전개)', key: 'development', color: 'bg-yellow-500' },
                            { label: '4막 (절정)', key: 'climax', color: 'bg-red-500' },
                            { label: '5막 (결말)', key: 'conclusion', color: 'bg-purple-500' }
                        ].map(({ label, key, color }) => {
                            const progress =
                                completeness.fiveActProgress[
                                    key as keyof typeof completeness.fiveActProgress
                                ];
                            return (
                                <div key={key}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{label}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${color} transition-all`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* 🔥 빠른 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">최근 수정</span>
                    </div>
                    <p className="text-lg font-semibold">
                        {metadata.updatedAt
                            ? new Date(metadata.updatedAt).toLocaleDateString('ko-KR')
                            : '오늘'}
                    </p>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">생성일</span>
                    </div>
                    <p className="text-lg font-semibold">
                        {metadata.createdAt
                            ? new Date(metadata.createdAt).toLocaleDateString('ko-KR')
                            : '오늘'}
                    </p>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">평균 일관성</span>
                    </div>
                    <p className="text-lg font-semibold">{overallCompleteness}%</p>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">남은 분량</span>
                    </div>
                    <p className="text-lg font-semibold">
                        {(
                            (metadata.targetWordCount || 0) - (metadata.currentWordCount || 0)
                        ).toLocaleString()}
                        자
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default OverviewTab;
