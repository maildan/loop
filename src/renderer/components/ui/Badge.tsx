'use client';

import { ReactNode, forwardRef } from 'react';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const BADGE_STYLES = {
  base: 'inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  sizes: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  },
  variants: {
    default: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-800 hover:bg-red-200',
    purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    solid: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50',
  },
  interactive: 'cursor-pointer select-none',
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface BadgeProps {
  readonly variant?: keyof typeof BADGE_STYLES.variants;
  readonly size?: keyof typeof BADGE_STYLES.sizes;
  readonly interactive?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly role?: string;
  readonly 'aria-label'?: string;
  readonly 'aria-pressed'?: boolean;
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default', 
    size = 'md',
    interactive = false,
    disabled = false,
    className, 
    children, 
    onClick,
    role,
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
    ...props 
  }, ref) => {
    
    const badgeClassName = cn(
      BADGE_STYLES.base,
      BADGE_STYLES.variants[variant],
      BADGE_STYLES.sizes[size],
      interactive && BADGE_STYLES.interactive,
      disabled && BADGE_STYLES.disabled,
      className
    );

    const handleClick = (): void => {
      if (disabled || !onClick) return;
      
      Logger.info('BADGE', `Badge clicked: ${variant}`, { size, interactive });
      onClick();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>): void => {
      if (disabled || !onClick) return;
      
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <span
        ref={ref}
        className={badgeClassName}
        onClick={interactive ? handleClick : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        role={interactive ? (role || 'button') : role}
        tabIndex={interactive && !disabled ? 0 : undefined}
        aria-label={ariaLabel}
        aria-pressed={interactive ? ariaPressed : undefined}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
