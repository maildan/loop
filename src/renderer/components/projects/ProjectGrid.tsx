'use client';

// 프로젝트 검색 및 관리 컴포넌트}|

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, SortAsc, SortDesc } from 'lucide-react';
import { ProjectCard, type ProjectData } from './ProjectCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROJECT_GRID_STYLES = {
  container: 'space-y-6',
  header: 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
  title: 'text-2xl font-bold text-slate-900 dark:text-slate-100',
  controls: 'flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap',
  searchContainer: 'relative w-full md:flex-1 md:min-w-[260px] md:max-w-md',
  searchIcon: 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400',
  searchInput: 'pl-10',
  filters: 'flex items-center gap-2 flex-wrap',
  filterButton: 'h-9',
  sortButton: 'h-9 w-9 p-0',
  createButton: 'flex items-center gap-2 whitespace-nowrap',
  grid: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  emptyState: 'col-span-full text-center py-12',
  emptyStateIcon: 'w-16 h-16 mx-auto text-slate-400 mb-4',
  emptyStateTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2',
  emptyStateDescription: 'text-slate-500 dark:text-slate-400 mb-6',
  statsBar: 'flex items-center gap-4 flex-wrap text-sm text-slate-600 dark:text-slate-400',
  statsItem: 'flex items-center gap-1 whitespace-nowrap',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
type SortField = 'title' | 'createdAt' | 'updatedAt' | 'progress';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | ProjectData['status'];

export interface ProjectGridProps {
  readonly projects: readonly ProjectData[];
  readonly loading?: boolean;
  readonly onCreateProject?: () => void;
  readonly onViewProject?: (project: ProjectData) => void;
  readonly onEditProject?: (project: ProjectData) => void;
  readonly onShareProject?: (project: ProjectData) => void;
  readonly onDeleteProject?: (project: ProjectData) => void;
  readonly showCreateButton?: boolean;
  readonly searchPlaceholder?: string;
}

export function ProjectGrid({
  projects,
  loading = false,
  onCreateProject,
  onViewProject,
  onEditProject,
  onShareProject,
  onDeleteProject,
  showCreateButton = true,
  searchPlaceholder = '프로젝트 검색...'
}: ProjectGridProps): React.ReactElement {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 🔥 기가차드 규칙: 메모화로 성능 최적화
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.author?.toLowerCase().includes(query) ||
        project.genre?.toLowerCase().includes(query)
      );
    }

    // 상태 필터링
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // 정렬
    filtered.sort((a, b) => {
      let valueA: string | number | Date;
      let valueB: string | number | Date;

      switch (sortField) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'createdAt':
          valueA = a.createdAt.getTime();
          valueB = b.createdAt.getTime();
          break;
        case 'updatedAt':
          valueA = a.updatedAt.getTime();
          valueB = b.updatedAt.getTime();
          break;
        case 'progress':
          valueA = a.progress;
          valueB = b.progress;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, sortField, sortOrder]);

  const projectStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const paused = projects.filter(p => p.status === 'paused').length;

    return { total, active, completed, paused };
  }, [projects]);

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    Logger.debug('PROJECT_GRID', `Search query: ${value}`);
  };

  const handleStatusFilter = (status: StatusFilter): void => {
    setStatusFilter(status);
    Logger.debug('PROJECT_GRID', `Filter by status: ${status}`);
  };

  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    Logger.debug('PROJECT_GRID', `Sort by: ${field} ${sortOrder}`);
  };

  const handleCreateProject = (): void => {
    Logger.info('PROJECT_GRID', 'Create project button clicked');
    onCreateProject?.();
  };

  const statusFilters: Array<{ value: StatusFilter; label: string; count: number }> = [
    { value: 'all', label: '전체', count: projectStats.total },
    { value: 'active', label: '진행중', count: projectStats.active },
    { value: 'completed', label: '완료', count: projectStats.completed },
    { value: 'paused', label: '일시정지', count: projectStats.paused },
  ];

  if (loading) {
    return (
      <div className={PROJECT_GRID_STYLES.container}>
        <div className={PROJECT_GRID_STYLES.emptyState}>
          <div className={PROJECT_GRID_STYLES.emptyStateTitle}>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={PROJECT_GRID_STYLES.container} role="main" aria-label="프로젝트 목록">
      {/* 헤더 */}
      <div className={PROJECT_GRID_STYLES.header}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <h2 className={PROJECT_GRID_STYLES.title}>프로젝트</h2>
            <div className={PROJECT_GRID_STYLES.statsBar} role="tablist" aria-label="프로젝트 통계">
              <button
                type="button"
                onClick={() => { handleStatusFilter('all'); setSortField('updatedAt'); setSortOrder('desc'); }}
                className={`${PROJECT_GRID_STYLES.statsItem} ${statusFilter === 'all' ? 'font-medium text-slate-900 dark:text-slate-100' : ''}`}
                aria-pressed={statusFilter === 'all'}
              >
                총 {projectStats.total}개
              </button>
              <button
                type="button"
                onClick={() => { handleStatusFilter('active'); setSortField('updatedAt'); setSortOrder('desc'); }}
                className={`${PROJECT_GRID_STYLES.statsItem} ${statusFilter === 'active' ? 'font-medium text-slate-900 dark:text-slate-100' : ''}`}
                aria-pressed={statusFilter === 'active'}
              >
                진행중 {projectStats.active}개
              </button>
              <button
                type="button"
                onClick={() => { handleStatusFilter('completed'); setSortField('updatedAt'); setSortOrder('desc'); }}
                className={`${PROJECT_GRID_STYLES.statsItem} ${statusFilter === 'completed' ? 'font-medium text-slate-900 dark:text-slate-100' : ''}`}
                aria-pressed={statusFilter === 'completed'}
              >
                완료 {projectStats.completed}개
              </button>
            </div>
          </div>

          {/* 새 프로젝트 버튼 */}
          {showCreateButton && (
            <Button
              variant="primary"
              onClick={handleCreateProject}
              className={PROJECT_GRID_STYLES.createButton}
              aria-label="새 프로젝트 생성"
            >
              <Plus className="w-4 h-4" />
              새 프로젝트
            </Button>
          )}
        </div>

        {/* 컨트롤 */}
        <div className={PROJECT_GRID_STYLES.controls}>
          {/* 검색 */}
          <div className={PROJECT_GRID_STYLES.searchContainer}>
            <Search className={PROJECT_GRID_STYLES.searchIcon} aria-hidden="true" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={PROJECT_GRID_STYLES.searchInput}
              aria-label="프로젝트 검색"
            />
          </div>

          {/* 필터 */}
          <div className={PROJECT_GRID_STYLES.filters}>
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'primary' : 'outline'}
                size="sm"
                className={PROJECT_GRID_STYLES.filterButton}
                onClick={() => handleStatusFilter(filter.value)}
                aria-label={`${filter.label} 필터`}
                aria-pressed={statusFilter === filter.value}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>

          {/* 정렬 */}
          <Button
            variant="outline"
            size="sm"
            className={PROJECT_GRID_STYLES.sortButton}
            onClick={() => handleSort('updatedAt')}
            aria-label={`업데이트 순으로 ${sortOrder === 'asc' ? '내림차순' : '오름차순'} 정렬`}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* 프로젝트 그리드 */}
      {filteredAndSortedProjects.length > 0 ? (
        <div
          className={PROJECT_GRID_STYLES.grid}
          role="grid"
          aria-label={`${filteredAndSortedProjects.length}개의 프로젝트`}
        >
          {filteredAndSortedProjects.map((project) => (
            <div key={project.id} role="gridcell">
              <ProjectCard
                project={project}
                onView={onViewProject}
                onEdit={onEditProject}
                onShare={onShareProject}
                onDelete={onDeleteProject}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={PROJECT_GRID_STYLES.emptyState}>
          <div className={PROJECT_GRID_STYLES.emptyStateIcon}>
            {searchQuery || statusFilter !== 'all' ? <Search /> : <Plus />}
          </div>
          <h3 className={PROJECT_GRID_STYLES.emptyStateTitle}>
            {searchQuery || statusFilter !== 'all'
              ? '검색 결과가 없습니다'
              : '아직 프로젝트가 없습니다'
            }
          </h3>
          <p className={PROJECT_GRID_STYLES.emptyStateDescription}>
            {searchQuery || statusFilter !== 'all'
              ? '다른 검색어나 필터를 시도해보세요.'
              : '새 프로젝트를 만들어서 타이핑 분석을 시작해보세요.'
            }
          </p>
          {showCreateButton && (!searchQuery && statusFilter === 'all') && (
            <Button
              variant="primary"
              onClick={handleCreateProject}
              className={PROJECT_GRID_STYLES.createButton}
            >
              <Plus className="w-4 h-4" />
              첫 번째 프로젝트 만들기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
