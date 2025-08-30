'use client';

import { forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드 완전 지원
const CARD_STYLES = {
  base: 'rounded-lg transition-all duration-200 ease-in-out',
  variants: {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/20',
    elevated: 'bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900/30 border-0',
    outlined: 'bg-transparent border-2 border-slate-300 dark:border-slate-600',
    writer: 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 backdrop-blur-sm'
  },
  padding: {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  },
  hover: {
    default: 'hover:shadow-md dark:hover:shadow-slate-900/40 hover:border-slate-300 dark:hover:border-slate-600',
    elevated: 'hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-1',
    outlined: 'hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50',
    writer: 'hover:shadow-lg dark:hover:shadow-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
  }
} as const;

export interface CardProps {
  readonly variant?: keyof typeof CARD_STYLES.variants;
  readonly padding?: keyof typeof CARD_STYLES.padding;
  readonly hoverable?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly role?: string;
  readonly 'aria-label'?: string;
}

// 🔥 기가차드 규칙: forwardRef로 ref 전달 지원
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default', 
    padding = 'md', 
    hoverable = false,
    className, 
    children, 
    onClick,
    role,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    
    const cardClassName = cn(
      CARD_STYLES.base,
      CARD_STYLES.variants[variant],
      CARD_STYLES.padding[padding],
      hoverable && CARD_STYLES.hover[variant],
      onClick && 'cursor-pointer',
      className
    );

    return (
      <div
        ref={ref}
        className={cardClassName}
        onClick={onClick}
        role={role}
        aria-label={ariaLabel}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
