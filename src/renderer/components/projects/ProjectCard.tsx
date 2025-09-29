'use client';

// 프로젝트 카드 컴포넌트

import React from 'react';
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Share2,
  Trash2,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  type LucideIcon
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROJECT_CARD_STYLES = {
  container: 'group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[260px] flex flex-col',
  header: 'flex items-start justify-between p-4 pb-3',
  title: 'text-lg font-semibold text-foreground line-clamp-2 flex-1 mr-3 leading-relaxed',
  moreButton: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0',
  content: 'px-4 pb-3 flex-1 space-y-3',
  description: 'text-sm text-muted-foreground line-clamp-3 leading-relaxed',
  metaSection: 'flex items-center gap-4 text-xs text-muted-foreground',
  metaItem: 'flex items-center gap-1.5',
  progressSection: 'space-y-2',
  progressHeader: 'flex items-center justify-between',
  progressLabel: 'text-sm font-medium text-foreground/90',
  progressValue: 'text-sm text-muted-foreground',
  footer: 'px-4 pb-4 pt-2',
  actionButtons: 'flex items-center gap-2',
  actionButton: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
  statusBadge: 'flex items-center gap-2',
  icon: 'w-4 h-4', // 🔥 아이콘 크기 확대: 3→4
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface ProjectData {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'active' | 'completed' | 'paused' | 'draft';
  readonly progress: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly wordCount?: number;
  readonly author?: string;
  readonly genre?: string;
  readonly platform?: string;
}

interface ProjectAction {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly variant: 'ghost' | 'outline';
  readonly onClick: (project: ProjectData) => void;
  readonly ariaLabel?: string;
}

export interface ProjectCardProps {
  readonly project: ProjectData;
  readonly onView?: (project: ProjectData) => void;
  readonly onEdit?: (project: ProjectData) => void;
  readonly onShare?: (project: ProjectData) => void;
  readonly onDelete?: (project: ProjectData) => void;
  readonly onMore?: (project: ProjectData) => void;
  readonly showActions?: boolean;
}

export function ProjectCard({
  project,
  onView,
  onEdit,
  onShare,
  onDelete,
  onMore,
  showActions = true
}: ProjectCardProps): React.ReactElement {

  const handleAction = (actionId: string, callback?: (project: ProjectData) => void): void => {
    Logger.info('PROJECT_CARD', `Action triggered: ${actionId}`, { projectId: project.id });
    callback?.(project);
  };

  // 🔥 액션 버튼 클릭 핸들러 - 이벤트 전파 중단
  const handleActionClick = (
    event: React.MouseEvent,
    actionId: string,
    callback?: (project: ProjectData) => void
  ): void => {
    event.stopPropagation();
    event.preventDefault();
    Logger.info('PROJECT_CARD', `Action triggered: ${actionId}`, { projectId: project.id });
    callback?.(project);
  };

  // � Google Docs 연동 감지: description 끝에 삽입된 JSON 메타데이터 파싱
  let isGoogleDocsProject = false;
  let googleDocMeta: { googleDocId?: string; googleDocUrl?: string; originalDescription?: string; isGoogleDocsProject?: boolean } | null = null;
  try {
    const match = project.description?.match(/\[Google Docs 연동 정보: (\{.*\})\]$/s);
    if (match && match[1]) {
      const parsed = JSON.parse(match[1]);
      if (parsed && parsed.isGoogleDocsProject) {
        isGoogleDocsProject = true;
        googleDocMeta = parsed;
      }
    }
  } catch (parseErr) {
    Logger.debug('PROJECT_CARD', 'Google Docs 메타데이터 파싱 실패', { err: parseErr, projectId: project.id });
  }

  const displayedDescription = googleDocMeta?.originalDescription ? googleDocMeta.originalDescription : project.description;

  const openExternal = (url?: string) => {
    if (!url) return;
    try {
      if ((window as any).electronAPI?.shell?.openExternal) {
        (window as any).electronAPI.shell.openExternal(url);
      } else {
        window.open(url, '_blank', 'noopener');
      }
    } catch (err) {
      Logger.error('PROJECT_CARD', '외부 링크 열기 실패', err);
    }
  };

  // �🔥 더 보기 버튼 클릭 핸들러 - 이벤트 전파 중단
  const handleMoreClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    event.preventDefault();
    handleAction('more', onMore);
  };

  // 🔥 카드 클릭 핸들러 추가 - 프로젝트 상세 보기
  const handleCardClick = (): void => {
    Logger.info('PROJECT_CARD', 'Card clicked', { projectId: project.id });
    onView?.(project);
  };

  const getStatusColor = (status: ProjectData['status']): 'success' | 'warning' | 'primary' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'paused': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: ProjectData['status']): string => {
    switch (status) {
      case 'completed': return '완료';
      case 'active': return '진행중';
      case 'paused': return '일시정지';
      case 'draft': return '초안';
      default: return '알 수 없음';
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const projectActions: readonly ProjectAction[] = [
    {
      id: 'view',
      label: '보기',
      icon: Eye,
      variant: 'ghost',
      onClick: (project) => handleAction('view', onView),
      ariaLabel: '프로젝트 보기'
    },
    {
      id: 'edit',
      label: '편집',
      icon: Edit2,
      variant: 'ghost',
      onClick: (project) => handleAction('edit', onEdit),
      ariaLabel: '프로젝트 편집'
    },
    {
      id: 'share',
      label: '공유',
      icon: Share2,
      variant: 'ghost',
      onClick: (project) => handleAction('share', onShare),
      ariaLabel: '프로젝트 공유'
    },
    {
      id: 'delete',
      label: '삭제',
      icon: Trash2,
      variant: 'ghost',
      onClick: (project) => handleAction('delete', onDelete),
      ariaLabel: '프로젝트 삭제'
    }
  ] as const;

  const isImportProject = project.platform === 'import' || /파일에서 가져온/.test(project.description || '');

  return (
    <Card
      className={`${PROJECT_CARD_STYLES.container} cursor-pointer ${isGoogleDocsProject
        ? 'ring-2 ring-[var(--warning)] ring-offset-2 ring-offset-background'
        : isImportProject
          ? 'ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-background'
          : ''}`}
      role="article"
      aria-label={`프로젝트: ${project.title}`}
      onClick={handleCardClick}
    >
      {/* 헤더 */}
      <div className={PROJECT_CARD_STYLES.header}>
        <h3 className={PROJECT_CARD_STYLES.title}>
          {project.title}
          {isGoogleDocsProject && (
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); openExternal(googleDocMeta?.googleDocUrl || undefined); }}
              title="Google Docs 원본 열기"
              className="ml-2 inline-flex items-center text-[var(--warning)] transition-colors hover:opacity-90"
              aria-label="Open Google Docs"
            >
              <ExternalLink className={PROJECT_CARD_STYLES.icon} />
            </button>
          )}
        </h3>
        {showActions && onMore && (
          <Tooltip content="더 보기" side="bottom" sideOffset={4}>
            <Button
              variant="ghost"
              size="sm"
              className={PROJECT_CARD_STYLES.moreButton}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleMoreClick(e); }}
              aria-label="프로젝트 옵션 더 보기"
            >
              <MoreHorizontal className={PROJECT_CARD_STYLES.icon} />
            </Button>
          </Tooltip>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className={PROJECT_CARD_STYLES.content}>
        {/* 상태 배지 */}
        <div className={PROJECT_CARD_STYLES.statusBadge}>
          <Badge
            variant={isGoogleDocsProject ? 'warning' : getStatusColor(project.status)}
            size="sm"
          >
            {isGoogleDocsProject ? 'Google Docs' : getStatusText(project.status)}
          </Badge>
          {isGoogleDocsProject && googleDocMeta?.googleDocUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); openExternal(googleDocMeta?.googleDocUrl); }}
              className="ml-2 text-xs text-[var(--accent-primary)] underline transition-colors hover:opacity-90"
            >
              원본 열기
            </button>
          )}
        </div>

        {/* 설명 */}
        <p className={PROJECT_CARD_STYLES.description}>
          {displayedDescription}
        </p>

        {/* 메타 정보 */}
        <div className={PROJECT_CARD_STYLES.metaSection}>
          <div className={PROJECT_CARD_STYLES.metaItem}>
            <Calendar className={PROJECT_CARD_STYLES.icon} aria-hidden="true" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          {project.wordCount && (
            <div className={PROJECT_CARD_STYLES.metaItem}>
              <FileText className={PROJECT_CARD_STYLES.icon} aria-hidden="true" />
              <span>{formatNumber(project.wordCount)}자</span>
            </div>
          )}
          <div className={PROJECT_CARD_STYLES.metaItem}>
            <Clock className={PROJECT_CARD_STYLES.icon} aria-hidden="true" />
            <span>{formatDate(project.updatedAt)}</span>
          </div>
        </div>

        {/* 진행률 */}
        <div className={PROJECT_CARD_STYLES.progressSection}>
          <div className={PROJECT_CARD_STYLES.progressHeader}>
            <span className={PROJECT_CARD_STYLES.progressLabel}>진행률</span>
            <span className={PROJECT_CARD_STYLES.progressValue}>
              {Math.round(project.progress)}%
            </span>
          </div>
          <ProgressBar
            value={project.progress}
            size="sm"
            color={project.progress >= 100 ? 'green' : 'blue'}
            aria-label={`프로젝트 진행률 ${Math.round(project.progress)}%`}
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      {showActions && (
        <div
          className={PROJECT_CARD_STYLES.footer}
          onClick={(e) => {
            // 🔥 액션 버튼 영역 내에서는 카드 열기 동작 방지
            e.stopPropagation();
          }}
        >
          <div
            className={PROJECT_CARD_STYLES.actionButtons}
            onClick={(e) => {
              // 🔥 버튼 사이 공간(패딩/갭) 클릭 시에도 부모 클릭 방지
              e.stopPropagation();
            }}
          >
            {projectActions.map((action) => {
              const Icon = action.icon;
              return (
                <Tooltip key={action.id} content={action.label} side="bottom" sideOffset={4}>
                  <Button
                    variant={action.variant}
                    size="sm"
                    className={PROJECT_CARD_STYLES.actionButton}
                    onClick={(event) => handleActionClick(event, action.id, action.onClick?.bind(null, project))}
                    aria-label={action.ariaLabel}
                  >
                    <Icon className={PROJECT_CARD_STYLES.icon} />
                  </Button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
