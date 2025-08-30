'use client';

import React, { ReactNode, useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const TOOLTIP_STYLES = {
  trigger: 'inline-block relative',
  tooltip: 'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200',
  arrow: 'absolute w-2 h-2 bg-slate-900 transform rotate-45',
  positions: {
    top: {
      tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3', // 마진 증가 (2 → 3)
      arrow: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    },
    bottom: {
      tooltip: 'top-full left-1/2 transform -translate-x-1/2 mt-3', // 마진 증가 (2 → 3)
      arrow: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2',
    },
    left: {
      tooltip: 'right-full top-1/2 transform -translate-y-1/2 mr-3', // 마진 증가 (2 → 3)
      arrow: 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2',
    },
    right: {
      tooltip: 'left-full top-1/2 transform -translate-y-1/2 ml-3', // 마진 증가 (2 → 3)
      arrow: 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2',
    },
  },
  variants: {
    default: 'bg-slate-900 text-white',
    light: 'bg-white text-slate-900 border border-slate-200 shadow-md',
    error: 'bg-red-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
  },
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface TooltipProps {
  readonly content: ReactNode;
  readonly children: ReactNode;
  readonly side?: keyof typeof TOOLTIP_STYLES.positions;
  readonly variant?: keyof typeof TOOLTIP_STYLES.variants;
  readonly delay?: number;
  readonly disabled?: boolean;
  readonly showArrow?: boolean;
  readonly trigger?: 'hover' | 'click' | 'focus' | 'manual';
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly className?: string;
  readonly sideOffset?: number;
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function Tooltip({
  content,
  children,
  side = 'top',
  variant = 'default',
  delay = 200,
  disabled = false,
  showArrow = true,
  trigger = 'hover',
  open: controlledOpen,
  onOpenChange,
  className,
  sideOffset = 0,
}: TooltipProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const isControlled = controlledOpen !== undefined;

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const setOpen = (open: boolean): void => {
    if (disabled) return;

    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setInternalOpen(open);
    }

    Logger.debug('TOOLTIP', `Tooltip ${open ? 'opened' : 'closed'}`, { side, trigger });
  };

  const showTooltip = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delay);
  };

  const hideTooltip = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setOpen(false);
  };

  const handleMouseEnter = (): void => {
    if (trigger === 'hover') {
      showTooltip();
    }
  };

  const handleMouseLeave = (): void => {
    if (trigger === 'hover') {
      hideTooltip();
    }
  };

  const handleClick = (): void => {
    if (trigger === 'click') {
      setOpen(!isOpen);
    }
  };

  const handleFocus = (): void => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = (): void => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape' && isOpen) {
      hideTooltip();
    }
  };

  // children에 이벤트 핸들러 추가
  const triggerElement = isValidElement(children) 
    ? (() => {
        const child = children as React.ReactElement<Record<string, unknown>>;
        const childProps = (child.props || {}) as Record<string, unknown>;
        return cloneElement(child as React.ReactElement<any>, {
          onMouseEnter: (e: React.MouseEvent) => { (childProps.onMouseEnter as ((e: React.MouseEvent)=>void) | undefined)?.(e); handleMouseEnter(); },
          onMouseLeave: (e: React.MouseEvent) => { (childProps.onMouseLeave as ((e: React.MouseEvent)=>void) | undefined)?.(e); handleMouseLeave(); },
          onClick: (e: React.MouseEvent) => { (childProps.onClick as ((e: React.MouseEvent)=>void) | undefined)?.(e); handleClick(); },
          onFocus: (e: React.FocusEvent) => { (childProps.onFocus as ((e: React.FocusEvent)=>void) | undefined)?.(e); handleFocus(); },
          onBlur: (e: React.FocusEvent) => { (childProps.onBlur as ((e: React.FocusEvent)=>void) | undefined)?.(e); handleBlur(); },
          onKeyDown: (e: React.KeyboardEvent) => { (childProps.onKeyDown as ((e: React.KeyboardEvent)=>void) | undefined)?.(e); handleKeyDown(e); },
          'aria-describedby': isOpen ? 'tooltip' : undefined,
        });
      })()
    : children;

  // Tooltip 스타일 계산
  const tooltipClassName = cn(
    TOOLTIP_STYLES.tooltip,
    TOOLTIP_STYLES.positions[side].tooltip,
    TOOLTIP_STYLES.variants[variant],
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
    className
  );

  const arrowClassName = cn(
    TOOLTIP_STYLES.arrow,
    TOOLTIP_STYLES.positions[side].arrow,
    variant === 'light' ? 'bg-white border-l border-t border-slate-200' : 'bg-slate-900'
  );

  if (!mounted) {
    return <div className={TOOLTIP_STYLES.trigger}>{children}</div>;
  }

  return (
    <div className={TOOLTIP_STYLES.trigger}>
      {triggerElement}
      {isOpen && content && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={tooltipClassName}
          style={{
            [side === 'top' || side === 'bottom' ? 'marginTop' as const : 'marginLeft' as const]:
              (side === 'top' || side === 'left') ? -sideOffset : sideOffset,
          }}
        >
          {content}
          {showArrow && (
            <div 
              className={arrowClassName} 
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
}

// 🔥 편의 함수들
export const TooltipProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  return <>{children}</>;
};

export const TooltipTrigger = ({ children }: { children: ReactNode }): React.ReactElement => {
  return <>{children}</>;
};

export const TooltipContent = ({ children }: { children: ReactNode }): React.ReactElement => {
  return <>{children}</>;
};
