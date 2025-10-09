'use client';

import React from 'react';

interface RadialProgressRingProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    label?: string;
    sublabel?: string;
}

/**
 * 📊 RadialProgressRing - SVG 기반 Progress Ring
 * Recharts 없이 순수 SVG로 구현 (의존성 최소화)
 */
export const RadialProgressRing: React.FC<RadialProgressRingProps> = ({
    value,
    size = 120,
    strokeWidth = 10,
    label,
    sublabel,
}) => {
    const normalizedValue = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (normalizedValue / 100) * circumference;

    // 색상 선택 (점수 기반)
    const getColor = (score: number) => {
        if (score >= 80) return 'hsl(142, 76%, 36%)'; // green-600
        if (score >= 60) return 'hsl(48, 96%, 53%)'; // yellow-500
        return 'hsl(0, 84%, 60%)'; // red-500
    };

    const color = getColor(normalizedValue);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    className="transform -rotate-90"
                    width={size}
                    height={size}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">
                        {normalizedValue}
                    </span>
                    {label && (
                        <span className="text-xs text-muted-foreground mt-1">
                            {label}
                        </span>
                    )}
                </div>
            </div>
            {sublabel && (
                <span className="text-sm font-medium text-muted-foreground">
                    {sublabel}
                </span>
            )}
        </div>
    );
};
