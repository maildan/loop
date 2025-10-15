'use client';

import React from 'react';

interface ProgressBarProps {
    value: number; // 0-100
    label: string;
    showValue?: boolean;
    size?: 'sm' | 'md';
    className?: string;
    tooltip?: string;
}

/**
 * ProgressBar - 일관성 점수 시각화
 * 
 * Features:
 * - 0-100 값 표시
 * - 색상 자동 변경 (green/yellow/red)
 * - 라벨 + 값 표시 옵션
 * - 애니메이션 효과
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    label,
    showValue = true,
    size = 'md',
    className = '',
    tooltip,
}) => {
    // 값 정규화 (0-100)
    const normalizedValue = Math.min(100, Math.max(0, value));

    // 색상 결정
    const getColor = (): string => {
        if (normalizedValue >= 80) return 'bg-green-500';
        if (normalizedValue >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // 사이즈별 높이
    const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

    return (
        <div className={`space-y-1 ${className}`} title={tooltip}>
            {/* 라벨 + 값 */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                {showValue && (
                    <span className="font-medium text-foreground tabular-nums">
                        {normalizedValue}
                    </span>
                )}
            </div>

            {/* 프로그레스 바 */}
            <div className={`w-full rounded-full bg-secondary overflow-hidden ${heightClass}`}>
                <div
                    className={`${heightClass} rounded-full transition-all duration-500 ease-out ${getColor()}`}
                    style={{ width: `${normalizedValue}%` }}
                />
            </div>
        </div>
    );
};
