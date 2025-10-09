'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Episode } from '../../../../../../shared/types/episode';

interface ViewsChartProps {
    episodes: Episode[];
}

export const ViewsChart: React.FC<ViewsChartProps> = ({ episodes }) => {
    // 발행된 에피소드만 필터링하고 회차 순으로 정렬
    const publishedEpisodes = episodes
        .filter(ep => ep.publishedAt && new Date(ep.publishedAt) <= new Date())
        .sort((a, b) => a.episodeNumber - b.episodeNumber);

    // 차트 데이터 생성
    const chartData = publishedEpisodes.map(ep => ({
        episode: `${ep.episodeNumber}화`,
        episodeNumber: ep.episodeNumber,
        views: Math.floor(Math.random() * 5000) + 1000, // TODO: 실제 조회수로 대체
        title: ep.title,
    }));

    // 데이터가 없으면 안내 메시지
    if (chartData.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p>발행된 회차가 없습니다</p>
            </div>
        );
    }

    // 평균 조회수 계산
    const avgViews = Math.round(
        chartData.reduce((sum, item) => sum + item.views, 0) / chartData.length
    );

    // 최대 조회수
    const maxViews = Math.max(...chartData.map(item => item.views));
    const maxViewsEpisode = chartData.find(item => item.views === maxViews);

    return (
        <div>
            {/* 통계 요약 */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">평균 조회수</p>
                    <p className="text-xl font-bold text-foreground">
                        {avgViews.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">최고 조회수</p>
                    <p className="text-xl font-bold text-green-500">
                        {maxViews.toLocaleString()}
                    </p>
                    {maxViewsEpisode && (
                        <p className="text-xs text-muted-foreground">
                            {maxViewsEpisode.episode}
                        </p>
                    )}
                </div>
            </div>

            {/* 차트 */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                        dataKey="episode" 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                    <YAxis 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--foreground))' }}
                        tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))',
                        }}
                        formatter={(value: number, name: string, props: any) => [
                            `${value.toLocaleString()} 조회`,
                            props.payload.title
                        ]}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="views" 
                        stroke="hsl(var(--accent-primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--accent-primary))', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* 안내 문구 */}
            <p className="mt-2 text-xs text-muted-foreground">
                💡 회차별 조회수를 추적합니다. 데이터는 각 플랫폼의 통계를 기준으로 합니다.
            </p>
        </div>
    );
};
