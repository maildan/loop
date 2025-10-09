'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import type { Episode } from '../../../../../../shared/types/episode';

interface ScheduleCalendarProps {
    projectId: string;
    episodes: Episode[];
    scheduledEpisodes: Episode[];
    onRefresh: () => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
    episodes,
    scheduledEpisodes,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // 현재 달의 첫날과 마지막날
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // 달력 시작 요일 (일요일 = 0)
    const startDay = firstDayOfMonth.getDay();
    
    // 이전/다음 달로 이동
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // 특정 날짜에 발행된 에피소드 찾기
    const getEpisodesForDate = (date: Date) => {
        return episodes.filter(ep => {
            if (!ep.publishedAt) return false;
            const publishDate = new Date(ep.publishedAt);
            return (
                publishDate.getDate() === date.getDate() &&
                publishDate.getMonth() === date.getMonth() &&
                publishDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // 특정 날짜에 예약된 에피소드 찾기
    const getScheduledForDate = (date: Date) => {
        return scheduledEpisodes.filter(ep => {
            if (!ep.publishedAt) return false;
            const publishDate = new Date(ep.publishedAt);
            return (
                publishDate.getDate() === date.getDate() &&
                publishDate.getMonth() === date.getMonth() &&
                publishDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // 달력 날짜 배열 생성
    const calendarDays: (Date | null)[] = [];
    
    // 빈 칸 채우기 (이전 달 날짜)
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }
    
    // 현재 달 날짜 채우기
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return (
        <div>
            {/* 헤더 */}
            <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold">
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </h4>
                <div className="flex gap-2">
                    <Button
                        onClick={prevMonth}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={nextMonth}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* 요일 헤더 */}
            <div className="mb-2 grid grid-cols-7 gap-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                    <div
                        key={day}
                        className={`text-center text-sm font-medium ${
                            idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-foreground'
                        }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 달력 그리드 */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, idx) => {
                    if (!date) {
                        return <div key={`empty-${idx}`} className="aspect-square" />;
                    }

                    const publishedEpisodes = getEpisodesForDate(date);
                    const scheduled = getScheduledForDate(date);
                    const isToday = 
                        date.getDate() === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear();

                    return (
                        <div
                            key={`day-${idx}`}
                            className={`
                                aspect-square rounded-lg border p-2 transition-colors
                                ${isToday ? 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent-primary))]/10' : 'border-border'}
                                ${publishedEpisodes.length > 0 ? 'bg-green-500/10' : ''}
                                ${scheduled.length > 0 ? 'bg-purple-500/10' : ''}
                            `}
                        >
                            <div className="text-right text-sm font-medium text-foreground">
                                {date.getDate()}
                            </div>
                            <div className="mt-1 space-y-1">
                                {publishedEpisodes.map(ep => (
                                    <div
                                        key={ep.id}
                                        className="rounded bg-green-500 px-1 py-0.5 text-xs text-white"
                                        title={`${ep.episodeNumber}화: ${ep.title}`}
                                    >
                                        {ep.episodeNumber}화
                                    </div>
                                ))}
                                {scheduled.map(ep => (
                                    <div
                                        key={ep.id}
                                        className="rounded border border-purple-500 px-1 py-0.5 text-xs text-purple-500"
                                        title={`예약: ${ep.episodeNumber}화: ${ep.title}`}
                                    >
                                        예약 {ep.episodeNumber}화
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 범례 */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-500/20 border border-green-500" />
                    <span className="text-muted-foreground">발행됨</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-purple-500/20 border border-purple-500" />
                    <span className="text-muted-foreground">예약됨</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-[hsl(var(--accent-primary))]" />
                    <span className="text-muted-foreground">오늘</span>
                </div>
            </div>
        </div>
    );
};
