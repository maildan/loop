'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Episode } from '../../../../../../shared/types/episode';

interface RevenueChartProps {
    episodes: Episode[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ episodes }) => {
    // 발행된 에피소드만 필터링하고 회차 순으로 정렬
    const publishedEpisodes = episodes
        .filter(ep => ep.publishedAt && new Date(ep.publishedAt) <= new Date())
        .sort((a, b) => a.episodeNumber - b.episodeNumber);

    // 차트 데이터 생성
    // 한국 웹소설 수익 구조: 독자 100원 → 플랫폼 30% → CP 20-40% → 작가
    // 평균적으로 작가는 100원당 약 35-50원 수령
    const chartData = publishedEpisodes.map(ep => {
        const views = Math.floor(Math.random() * 5000) + 1000; // TODO: 실제 조회수로 대체
        const pricePerView = 100; // 회당 100원
        const totalRevenue = views * pricePerView;
        
        // 플랫폼 수수료 30%
        const platformFee = totalRevenue * 0.3;
        
        // CP 수수료 30% (20-40% 중간값)
        const cpFee = totalRevenue * 0.3;
        
        // 작가 수익
        const authorRevenue = totalRevenue - platformFee - cpFee;

        return {
            episode: `${ep.episodeNumber}화`,
            episodeNumber: ep.episodeNumber,
            totalRevenue: Math.round(totalRevenue),
            authorRevenue: Math.round(authorRevenue),
            platformFee: Math.round(platformFee),
            cpFee: Math.round(cpFee),
            title: ep.title,
        };
    });

    // 데이터가 없으면 안내 메시지
    if (chartData.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p>발행된 회차가 없습니다</p>
            </div>
        );
    }

    // 총 수익 계산
    const totalAuthorRevenue = chartData.reduce((sum, item) => sum + item.authorRevenue, 0);
    const totalRevenue = chartData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const avgAuthorRevenue = Math.round(totalAuthorRevenue / chartData.length);

    return (
        <div>
            {/* 통계 요약 */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">총 독자 지불액</p>
                    <p className="text-xl font-bold text-foreground">
                        ₩{totalRevenue.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">총 작가 수익 (예상)</p>
                    <p className="text-xl font-bold text-green-500">
                        ₩{totalAuthorRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        회당 평균 ₩{avgAuthorRevenue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* 차트 */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                        dataKey="episode" 
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
                        formatter={(value: number, name: string, props: any) => {
                            if (name === 'authorRevenue') {
                                return [
                                    `₩${value.toLocaleString()}`,
                                    '작가 수익'
                                ];
                            }
                            return null;
                        }}
                        labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0 && payload[0]?.payload) {
                                return payload[0].payload.title;
                            }
                            return label;
                        }}
                    />
                    <Bar 
                        dataKey="authorRevenue" 
                        fill="hsl(var(--accent-primary))"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* 수익 구조 안내 */}
            <div className="mt-4 space-y-2 rounded-lg border border-border p-3 text-xs">
                <p className="font-semibold text-foreground">💰 수익 구조 (예상)</p>
                <div className="space-y-1 text-muted-foreground">
                    <p>• 독자 지불액: 100원/회차</p>
                    <p>• 플랫폼 수수료: 30% (카카오페이지, 네이버시리즈 기준)</p>
                    <p>• CP 수수료: 20-40% (평균 30%)</p>
                    <p>• 작가 수익: 약 40% (플랫폼/CP 차감 후)</p>
                </div>
                <p className="text-orange-500">
                    ⚠️ 실제 수익은 플랫폼 계약 조건에 따라 다를 수 있습니다
                </p>
            </div>
        </div>
    );
};
