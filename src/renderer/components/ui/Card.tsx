'use client';

import { forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드 완전 지원
const CARD_STYLES = {
  base: 'rounded-lg transition-all duration-200 ease-in-out',
  variants: {
    default: 'bg-card text-card-foreground border border-border shadow-sm',
    elevated: 'bg-card text-card-foreground shadow-lg border border-border/60',
    outlined: 'bg-transparent border-2 border-border/80',
    writer: 'bg-card/90 text-card-foreground border border-border backdrop-blur-sm'
  },
  padding: {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  },
  hover: {
    default: 'hover:shadow-md hover:border-border hover:bg-card/95',
    elevated: 'hover:shadow-xl hover:-translate-y-1 hover:bg-card',
    outlined: 'hover:border-border hover:bg-card/80',
    writer: 'hover:shadow-lg hover:bg-card/80 hover:border-border/70'
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
