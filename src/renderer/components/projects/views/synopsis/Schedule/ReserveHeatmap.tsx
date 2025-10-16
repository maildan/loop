'use client';

import React, { useMemo } from 'react';
import type { ManuscriptReserves } from '../../../../../../shared/types/episode';

interface ReserveHeatmapProps {
    reserves: ManuscriptReserves;
    publishFrequency?: number; // 주당 발행 회차 수 (기본: 3)
}

/**
 * 비축 회차 수에 따른 색상 반환
 * - 빨강 (<5): 비상 상태
 * - 노랑 (5-10): 주의 필요
 * - 초록 (10+): 안정적
 */
const getReserveColor = (reserveCount: number): string => {
    if (reserveCount < 5) return 'bg-red-500/20 border-red-500 text-red-500';
    if (reserveCount < 10) return 'bg-yellow-500/20 border-yellow-500 text-yellow-500';
    return 'bg-green-500/20 border-green-500 text-green-500';
};

/**
 * 비축 소진 예상일 계산
 * @param reserveCount 현재 비축 회차 수
 * @param publishFrequency 주당 발행 회차 수
 * @returns D-Day (일 단위)
 */
const calculateDDay = (reserveCount: number, publishFrequency: number): number => {
    if (reserveCount <= 0 || publishFrequency <= 0) return 0;
    const weeksLeft = reserveCount / publishFrequency;
    const daysLeft = Math.floor(weeksLeft * 7);
    return daysLeft;
};

/**
 * 🔥 비축 히트맵 캘린더 (Reserve Heatmap)
 * 
 * 월별로 비축 회차 수를 시각화하여 작가가 연재 여유를 한눈에 파악할 수 있도록 함.
 * 
 * 기능:
 * - 6개월 간 월별 비축 추이 시각화
 * - 색상 코딩: 빨강 (<5), 노랑 (5-10), 초록 (10+)
 * - D-Day 카운터: 비축 소진 예상일 표시
 * - Hover tooltip으로 상세 정보 제공
 */
export const ReserveHeatmap: React.FC<ReserveHeatmapProps> = ({ 
    reserves, 
    publishFrequency = 3 // 기본값: 주 3회 발행 (카카오/네이버 일반 정책)
}) => {
    // 현재 날짜 기준으로 향후 6개월 생성
    const months = useMemo(() => {
        const today = new Date();
        const result = [];
        
        for (let i = 0; i < 6; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthName = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
            
            // 각 월별 비축 회차 수 시뮬레이션
            // 실제로는 예약 발행 데이터를 기반으로 계산해야 하지만
            // Phase 2에서는 현재 비축 회차 - (i * publishFrequency * 4) 로 근사
            const estimatedReserve = Math.max(0, reserves.reserveCount - (i * publishFrequency * 4));
            
            result.push({
                date,
                monthName,
                reserveCount: estimatedReserve,
                color: getReserveColor(estimatedReserve),
            });
        }
        
        return result;
    }, [reserves.reserveCount, publishFrequency]);

    // D-Day 계산
    const dDay = calculateDDay(reserves.reserveCount, publishFrequency);

    return (
        <div className="space-y-6">
            {/* 헤더 및 D-Day */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-foreground">비축 추이 예측</h4>
                    <p className="text-sm text-muted-foreground">
                        주 {publishFrequency}회 발행 기준
                    </p>
                </div>
                {reserves.reserveCount > 0 && (
                    <div className={`rounded-lg border p-3 ${getReserveColor(reserves.reserveCount)}`}>
                        <p className="text-xs font-medium">비축 소진 예상</p>
                        <p className="text-2xl font-bold">
                            D-{dDay}
                        </p>
                        <p className="text-xs opacity-80">
                            ({Math.floor(dDay / 7)}주 {dDay % 7}일 후)
                        </p>
                    </div>
                )}
            </div>

            {/* 월별 히트맵 그리드 */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {months.map((month, idx) => (
                    <div
                        key={month.monthName}
                        className={`group relative rounded-lg border p-4 transition-all hover:scale-105 ${month.color}`}
                        title={`${month.monthName}: 예상 비축 ${month.reserveCount}화`}
                    >
                        {/* 월 표시 */}
                        <div className="mb-2 text-sm font-medium opacity-80">
                            {month.monthName}
                        </div>
                        
                        {/* 비축 회차 수 */}
                        <div className="text-3xl font-bold">
                            {month.reserveCount}
                            <span className="ml-1 text-base font-normal">화</span>
                        </div>

                        {/* 경고 메시지 */}
                        {month.reserveCount < 5 && (
                            <div className="mt-2 text-xs font-medium">
                                ⚠️ 비축 부족!
                            </div>
                        )}
                        {month.reserveCount >= 5 && month.reserveCount < 10 && (
                            <div className="mt-2 text-xs font-medium">
                                ⚡ 주의 필요
                            </div>
                        )}
                        {month.reserveCount >= 10 && (
                            <div className="mt-2 text-xs font-medium">
                                ✅ 안정적
                            </div>
                        )}

                        {/* Hover Tooltip (추가 정보) */}
                        <div className="invisible absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-card p-2 text-xs shadow-lg group-hover:visible">
                            <p className="font-medium">{month.monthName} 예상 비축</p>
                            <p className="text-muted-foreground">
                                현재 비축: {reserves.reserveCount}화
                            </p>
                            <p className="text-muted-foreground">
                                {idx}개월 후: {month.reserveCount}화
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 범례 */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-green-500 bg-green-500/20" />
                    <span className="text-muted-foreground">안정 (10화 이상)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-yellow-500 bg-yellow-500/20" />
                    <span className="text-muted-foreground">주의 (5-9화)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-red-500 bg-red-500/20" />
                    <span className="text-muted-foreground">비상 (5화 미만)</span>
                </div>
            </div>

            {/* 안내 메시지 */}
            <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                    💡 <strong>비축 히트맵 안내:</strong> 현재 비축 회차와 주당 발행 빈도를 기반으로 향후 6개월 간 비축 추이를 예측합니다.
                    실제 발행 일정과 차이가 있을 수 있으니 참고용으로 활용하세요.
                </p>
            </div>
        </div>
    );
};
