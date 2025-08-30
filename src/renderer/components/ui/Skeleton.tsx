'use client';

import React, { memo } from 'react';

// 🔥 프리컴파일된 스타일
const SKELETON_STYLES = {
  base: 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded',
  shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
} as const;

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rectangle' | 'circle' | 'text';
  shimmer?: boolean;
}

function SkeletonComponent({
  className = '',
  width,
  height,
  variant = 'rectangle',
  shimmer = true,
}: SkeletonProps): React.ReactElement {
  const baseClass = `${SKELETON_STYLES.base} ${shimmer ? SKELETON_STYLES.shimmer : ''}`;
  
  const variantClasses = {
    rectangle: '',
    circle: 'rounded-full',
    text: 'h-4',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// 🔥 메모화로 성능 최적화
export const Skeleton = memo(SkeletonComponent);

// 🔥 CSS 애니메이션을 위한 전역 스타일 (tailwind.config.mjs에 추가 필요)
export const skeletonAnimations = {
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
};
