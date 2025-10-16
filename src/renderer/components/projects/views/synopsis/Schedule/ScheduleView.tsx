'use client';

import React, { useEffect, useState } from 'react';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';
const SCHEDULE_VIEW = Symbol.for('SCHEDULE_VIEW');

import { Calendar, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Card } from '../../../../ui/Card';
import { episodeServiceClient } from '../../../../../../shared/services/EpisodeServiceClient';
import type { Episode, ManuscriptReserves } from '../../../../../../shared/types/episode';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ReserveHeatmap } from './ReserveHeatmap';
import { RevenueChart } from './RevenueChart';
import { ViewsChart } from './ViewsChart';

interface ScheduleViewProps {
    projectId: string;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ projectId }) => {
    const [loading, setLoading] = useState(true);
    const [reserves, setReserves] = useState<ManuscriptReserves | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [scheduledEpisodes, setScheduledEpisodes] = useState<Episode[]>([]);

    useEffect(() => {
        loadScheduleData();
    }, [projectId]);

    const loadScheduleData = async () => {
        try {
            setLoading(true);

            // 1. 비축 현황 로드
            const manuscriptReserves = await episodeServiceClient.getManuscriptReserves(projectId);
            setReserves(manuscriptReserves);

            // 2. 전체 에피소드 로드
            const allEpisodes = await episodeServiceClient.listEpisodes(projectId);
            setEpisodes(allEpisodes);

            // 3. 예약된 에피소드만 필터링
            const scheduled = allEpisodes.filter(ep => 
                ep.publishedAt && new Date(ep.publishedAt) > new Date()
            );
            setScheduledEpisodes(scheduled);
        } catch (error) {
            Logger.error(SCHEDULE_VIEW, '연재 관리 데이터 로드 실패', { error });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-[hsl(var(--accent-primary))]" />
                    <p className="text-sm text-muted-foreground">연재 관리 데이터 로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* 헤더 */}
            <div>
                <h2 className="text-2xl font-bold text-foreground">연재 관리</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    연재 일정을 한눈에 관리하세요
                </p>
            </div>

            {/* 상단 통계 카드 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* 비축 현황 */}
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">비축 회차</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">
                                {reserves?.reserveCount || 0}화
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                </Card>

                {/* 완료된 회차 */}
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">완료 회차</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">
                                {reserves?.completedEpisodes || 0}화
                            </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                </Card>

                {/* 발행된 회차 */}
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">발행 회차</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">
                                {reserves?.publishedEpisodes || 0}화
                            </p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                </Card>

                {/* 예약된 회차 */}
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">예약 발행</p>
                            <p className="mt-1 text-2xl font-bold text-foreground">
                                {scheduledEpisodes.length}화
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-purple-500" />
                    </div>
                </Card>
            </div>

            {/* 비축 히트맵 */}
            {reserves && (
                <Card className="p-6">
                    <ReserveHeatmap reserves={reserves} publishFrequency={3} />
                </Card>
            )}

            {/* 연재 캘린더 */}
            <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">연재 캘린더</h3>
                <ScheduleCalendar 
                    projectId={projectId}
                    episodes={episodes}
                    scheduledEpisodes={scheduledEpisodes}
                    onRefresh={loadScheduleData}
                />
            </Card>

            {/* 차트 그리드 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 조회수 차트 */}
                <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">회차별 조회수</h3>
                    <ViewsChart episodes={episodes} />
                </Card>

                {/* 수익 차트 */}
                <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">예상 수익</h3>
                    <RevenueChart episodes={episodes} />
                </Card>
            </div>

            {/* 예약 발행 목록 */}
            {scheduledEpisodes.length > 0 && (
                <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">예약된 회차</h3>
                    <div className="space-y-2">
                        {scheduledEpisodes.map((episode) => (
                            <div
                                key={episode.id}
                                className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                                <div>
                                    <p className="font-medium text-foreground">
                                        {episode.episodeNumber}화: {episode.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {episode.wordCount.toLocaleString()}자
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-foreground">
                                        {episode.publishedAt 
                                            ? new Date(episode.publishedAt).toLocaleString('ko-KR')
                                            : '-'
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};
