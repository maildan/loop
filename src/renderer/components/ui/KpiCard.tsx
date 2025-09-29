'use client';

import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 다크모드 완벽 지원
const KPI_STYLES = {
  container: 'p-6 transition-all duration-200',
  header: 'flex items-center justify-between mb-4',
  iconContainer: 'w-10 h-10 rounded-lg flex items-center justify-center',
  iconColors: {
    blue: 'bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]',
    green: 'bg-[hsl(var(--chart-3))]/20 text-[hsl(var(--chart-3))]',
    purple: 'bg-[hsl(var(--chart-4))]/20 text-[hsl(var(--chart-4))]',
    orange: 'bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]',
    red: 'bg-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive))]'
  },
  value: 'text-2xl font-bold text-[hsl(var(--foreground))] mb-1',
  label: 'text-sm text-muted-foreground mb-2',
  change: 'text-sm font-medium flex items-center gap-1',
  changeColors: {
    increase: 'text-[var(--success)]',
    decrease: 'text-[hsl(var(--destructive))]',
    neutral: 'text-muted-foreground'
  }
} as const;

export interface KpiCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly icon: LucideIcon;
  readonly change?: {
    readonly value: number;
    readonly type: 'increase' | 'decrease' | 'neutral';
    readonly period?: string;
  };
  readonly color?: keyof typeof KPI_STYLES.iconColors;
  readonly className?: string;
  readonly onClick?: () => void;
}

export function KpiCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = 'blue',
  className,
  onClick 
}: KpiCardProps) {
  const isClickable = Boolean(onClick);
  
  const containerClassName = cn(
    KPI_STYLES.container,
    isClickable && 'cursor-pointer hover:shadow-md',
    className
  );

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const formatChange = (changeValue: number): string => {
    const sign = changeValue > 0 ? '+' : '';
    return `${sign}${changeValue}%`;
  };

  return (
    <Card 
      variant="default" 
      padding="sm" 
      className={containerClassName}
      onClick={onClick}
      hoverable={isClickable}
      role={isClickable ? 'button' : undefined}
      aria-label={isClickable ? `${title} 상세 보기` : undefined}
    >
      <div className={KPI_STYLES.header}>
        <div className={cn(KPI_STYLES.iconContainer, KPI_STYLES.iconColors[color])}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        
        {change && (
          <div className={cn(KPI_STYLES.change, KPI_STYLES.changeColors[change.type])}>
            <span>{formatChange(change.value)}</span>
            {change.period && <span className="text-xs text-muted-foreground">({change.period})</span>}
          </div>
        )}
      </div>
      
      <div className={KPI_STYLES.value} aria-label={`값: ${formatValue(value)}`}>
        {formatValue(value)}
      </div>
      
      <div className={KPI_STYLES.label}>
        {title}
      </div>
    </Card>
  );
}
