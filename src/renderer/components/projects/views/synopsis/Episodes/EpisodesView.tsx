/**
 * 📚 EpisodesView - 회차 관리 (완전 재작성)
 * 
 * useEpisodes hook 기반 실제 DB 연동
 * - Grid/List 뷰 전환
 * - Filter (상태) + Search
 * - EpisodeCard 컴포넌트 사용
 * - EpisodeDetailModal 통합
 * - Bulk Actions (선택 일괄 처리)
 */

'use client';

import React, { useState } from 'react';
import { Search, Filter, Grid, List, Plus, Loader2, AlertTriangle, FileText, BarChart3 } from 'lucide-react';
import { useEpisodes, type Episode } from '../../../../../hooks/useEpisodes';
import type { UpdateEpisodeInput } from '../../../../../../shared/types/episode';
import { EpisodeCard } from './EpisodeCard';
import { EpisodeDetailModal } from './EpisodeDetailModal';
import { EpisodeHeatmap } from './EpisodeHeatmap';

export interface EpisodesViewProps {
  projectId: string;
}

type ViewMode = 'grid' | 'list' | 'heatmap';
type FilterStatus = 'all' | 'draft' | 'in-progress' | 'completed' | 'published';

/**
 * 📚 EpisodesView - 회차 관리
 */
export const EpisodesView: React.FC<EpisodesViewProps> = ({ projectId }) => {
  // ============================================
  // State
  // ============================================

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpisodes, setSelectedEpisodes] = useState<Set<string>>(new Set());
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================
  // useEpisodes Hook
  // ============================================

  const {
    episodes,
    loading,
    error,
    filter,
    applyFilter,
    updateEpisode,
    deleteEpisode,
    bulkUpdateStatus,
    bulkDelete,
    refetch,
  } = useEpisodes(projectId);

  // ============================================
  // Handlers
  // ============================================

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
    applyFilter({ status: status === 'all' ? undefined : status });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilter({ search: query });
  };

  const handleSelectEpisode = (id: string) => {
    setSelectedEpisodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedEpisodes.size === episodes.length) {
      setSelectedEpisodes(new Set());
    } else {
      setSelectedEpisodes(new Set(episodes.map((ep) => ep.id)));
    }
  };

  const handleEdit = (episode: Episode) => {
    setEditingEpisode(episode);
    setIsModalOpen(true);
  };

  const handleSave = async (id: string, updates: Partial<Episode>) => {
    // Filter out null values to match UpdateEpisodeInput type expectations
    const filteredUpdates: UpdateEpisodeInput = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== null)
    ) as UpdateEpisodeInput;
    
    await updateEpisode(id, filteredUpdates);
    setIsModalOpen(false);
    setEditingEpisode(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 회차를 삭제하시겠습니까?')) {
      await deleteEpisode(id);
    }
  };

  const handleBulkStatusChange = async (status: Episode['status']) => {
    await bulkUpdateStatus(Array.from(selectedEpisodes), status);
    setSelectedEpisodes(new Set());
  };

  const handleBulkDelete = async () => {
    if (confirm(`선택한 ${selectedEpisodes.size}개의 회차를 삭제하시겠습니까?`)) {
      await bulkDelete(Array.from(selectedEpisodes));
      setSelectedEpisodes(new Set());
    }
  };

  // ============================================
  // Stats
  // ============================================

  const stats = {
    total: episodes.length,
    draft: episodes.filter((e) => e.status === 'draft').length,
    inProgress: episodes.filter((e) => e.status === 'in-progress').length,
    completed: episodes.filter((e) => e.status === 'completed').length,
    published: episodes.filter((e) => e.status === 'published').length,
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">회차 관리</h2>
          <p className="text-sm text-muted-foreground mt-1">
            전체 {stats.total}개 회차 (완료: {stats.completed}, 진행 중: {stats.inProgress}, 초안: {stats.draft})
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEpisode({
              id: '',
              projectId,
              episodeNumber: episodes.length + 1,
              title: `${episodes.length + 1}화`,
              content: '',
              wordCount: 0,
              targetWordCount: 5500,
              status: 'draft',
              sortOrder: episodes.length,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as Episode);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          새 회차 추가
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['all', 'draft', 'in-progress', 'completed', 'published'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-accent-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {status === 'all' ? '전체' : status === 'draft' ? '초안' : status === 'in-progress' ? '진행 중' : status === 'completed' ? '완료' : '발행됨'}
              {status !== 'all' && (
                <span className="ml-1.5">
                  ({status === 'draft' ? stats.draft : status === 'in-progress' ? stats.inProgress : status === 'completed' ? stats.completed : stats.published})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="회차 검색..."
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent-primary focus:border-transparent w-64"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
              title="그리드 뷰"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
              title="리스트 뷰"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'heatmap' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
              title="히트맵 뷰"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedEpisodes.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedEpisodes.size}개 선택됨
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('in-progress')}
              className="px-3 py-1.5 text-sm bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              진행 중으로 변경
            </button>
            <button
              onClick={() => handleBulkStatusChange('completed')}
              className="px-3 py-1.5 text-sm bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              완료로 변경
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
            >
              선택 삭제
            </button>
            <button
              onClick={() => setSelectedEpisodes(new Set())}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors"
            >
              선택 해제
            </button>
          </div>
        </div>
      )}

      {/* Episodes Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">회차 목록 로드 중...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive">회차 목록을 불러올 수 없습니다.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 text-sm bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : episodes.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">회차가 없습니다</h3>
            <p className="text-sm text-muted-foreground mb-4">
              새 회차를 추가하여 작품을 시작하세요.
            </p>
            <button
              onClick={() => {
                setEditingEpisode({
                  id: '',
                  projectId,
                  episodeNumber: 1,
                  title: '1화',
                  content: '',
                  wordCount: 0,
                  targetWordCount: 5500,
                  status: 'draft',
                  sortOrder: 0,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                } as Episode);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              첫 회차 추가
            </button>
          </div>
        </div>
      ) : viewMode === 'heatmap' ? (
        <EpisodeHeatmap
          episodes={episodes}
          onEpisodeClick={handleEdit}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              viewMode={viewMode as 'grid' | 'list'}
              isSelected={selectedEpisodes.has(episode.id)}
              onSelect={handleSelectEpisode}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Episode Detail Modal */}
      <EpisodeDetailModal
        episode={editingEpisode}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEpisode(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};
