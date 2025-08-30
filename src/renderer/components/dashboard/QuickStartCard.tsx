'use client';

import React from 'react';
import { Plus, FileText, Download, BookOpen, type LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드
const QUICK_START_STYLES = {
  container: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-slate-900/20',
  content: 'text-center py-8 px-6',
  title: 'text-xl font-bold text-slate-900 dark:text-slate-100 mb-2',
  description: 'text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed',
  actionGrid: 'grid grid-cols-2 gap-3 max-w-sm mx-auto',
  actionButton: 'h-auto py-3 px-4 flex-col gap-2 text-sm hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/30',
  icon: 'w-5 h-5',
  emptyState: 'text-slate-500 dark:text-slate-400 text-sm',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
interface QuickAction {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly variant: 'primary' | 'secondary' | 'outline';
  readonly onClick: () => void;
  readonly ariaLabel?: string;
}

export interface QuickStartCardProps {
  readonly title?: string;
  readonly description?: string;
  readonly onCreateProject?: () => void;
  readonly onImportProject?: () => void;
  readonly onOpenSample?: () => void;
  readonly onViewDocs?: () => void;
  readonly showActions?: boolean;
}

export function QuickStartCard({
  title = '첫 번째 Loop 프로젝트를 시작해보세요',
  description = '새 프로젝트를 만들거나 기존 프로젝트를 가져와서 타이핑 분석을 시작할 수 있습니다.',
  onCreateProject,
  onImportProject,
  onOpenSample,
  onViewDocs,
  showActions = true
}: QuickStartCardProps): React.ReactElement {

  const handleAction = (actionId: string, callback?: () => void): void => {
    Logger.info('QUICK_START', `Quick action triggered: ${actionId}`);
    callback?.();
  };

  const quickActions: readonly QuickAction[] = [
    {
      id: 'create',
      label: '새 프로젝트',
      icon: Plus,
      variant: 'primary',
      onClick: () => handleAction('create', onCreateProject),
      ariaLabel: '새 프로젝트 만들기'
    },
    {
      id: 'import',
      label: '프로젝트 가져오기',
      icon: Download,
      variant: 'secondary',
      onClick: () => handleAction('import', onImportProject),
      ariaLabel: '기존 프로젝트 가져오기'
    },
    {
      id: 'sample',
      label: '샘플 열기',
      icon: FileText,
      variant: 'outline',
      onClick: () => handleAction('sample', onOpenSample),
      ariaLabel: '샘플 프로젝트 열기'
    },
    {
      id: 'docs',
      label: '사용법 보기',
      icon: BookOpen,
      variant: 'outline',
      onClick: () => handleAction('docs', onViewDocs),
      ariaLabel: '사용 가이드 보기'
    }
  ] as const;

  return (
    <Card className={QUICK_START_STYLES.container} role="region" aria-label="빠른 시작">
      <div className={QUICK_START_STYLES.content}>
        <h3 className={QUICK_START_STYLES.title}>{title}</h3>
        <p className={QUICK_START_STYLES.description}>{description}</p>
        
        {showActions ? (
          <div className={QUICK_START_STYLES.actionGrid}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  className={QUICK_START_STYLES.actionButton}
                  onClick={action.onClick}
                  aria-label={action.ariaLabel}
                >
                  <Icon className={QUICK_START_STYLES.icon} aria-hidden="true" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        ) : (
          <p className={QUICK_START_STYLES.emptyState}>
            아직 프로젝트가 없습니다.
          </p>
        )}
      </div>
    </Card>
  );
}
