'use client';

import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROGRESS_STYLES = {
  container: 'w-full bg-gray-200 rounded-full overflow-hidden',
  bar: 'h-full transition-all duration-500 ease-out rounded-full',
  colors: {
    blue: 'bg-blue-600',
    green: 'bg-green-600', 
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  },
  sizes: {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  },
  animated: 'bg-gradient-to-r bg-[length:200%_100%] animate-shimmer',
  label: 'text-sm font-medium text-gray-700 mb-2'
} as const;

export interface ProgressBarProps {
  readonly value: number; // 0-100
  readonly color?: keyof typeof PROGRESS_STYLES.colors;
  readonly size?: keyof typeof PROGRESS_STYLES.sizes;
  readonly showLabel?: boolean;
  readonly label?: string;
  readonly animated?: boolean;
  readonly className?: string;
  readonly 'aria-label'?: string;
}

export function ProgressBar({ 
  value, 
  color = 'blue', 
  size = 'md',
  showLabel = false,
  label,
  animated = false,
  className,
  'aria-label': ariaLabel 
}: ProgressBarProps) {
  // 🔥 기가차드 규칙: 입력값 검증
  const clampedValue = Math.max(0, Math.min(100, value));
  
  const containerClassName = cn(
    PROGRESS_STYLES.container,
    PROGRESS_STYLES.sizes[size],
    className
  );

  const barClassName = cn(
    PROGRESS_STYLES.bar,
    PROGRESS_STYLES.colors[color],
    animated && PROGRESS_STYLES.animated
  );

  const displayLabel = label || `${clampedValue}%`;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={PROGRESS_STYLES.label}>{displayLabel}</span>
          <span className="text-sm font-semibold text-gray-900">{clampedValue}%</span>
        </div>
      )}
      
      <div 
        className={containerClassName}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel || `Progress: ${clampedValue}%`}
      >
        <div 
          className={barClassName}
          style={{ width: `${clampedValue}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
