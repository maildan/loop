/**
 * Quick Log Modal - 5초 입력 목표 플랫폼 성과 기록
 * @module renderer/components/synopsis/QuickLogModal
 */

import React, { useState, useEffect } from 'react';
import type {
  Publication,
  QuickLogDTO,
  MetricSuggestions,
  RankType
} from '../../../../../shared/types/synopsis-stats';

interface QuickLogModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<string>('');
  const [suggestions, setSuggestions] = useState<MetricSuggestions>({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<QuickLogDTO>>({
    date: new Date(),
    views: undefined,
    revenue: undefined,
    purchases: undefined,
    rank: undefined,
    rankType: undefined,
    episodeNumber: undefined,
    note: '',
    isEstimated: false
  });

  // Load publications on mount
  useEffect(() => {
    if (isOpen) {
      loadPublications();
      // Reset form
      setFormData({
        date: new Date(),
        views: undefined,
        revenue: undefined,
        purchases: undefined,
        rank: undefined,
        rankType: undefined,
        episodeNumber: undefined,
        note: '',
        isEstimated: false
      });
    }
  }, [isOpen, projectId]);

  // Load suggestions when publication changes
  useEffect(() => {
    if (selectedPublication) {
      loadSuggestions(selectedPublication);
    }
  }, [selectedPublication]);

  const loadPublications = async () => {
    try {
      const pubs = await window.electronAPI['synopsis-stats:get-publications'](projectId);
      setPublications(pubs);
      
      // Auto-select last used platform (from localStorage)
      const lastUsed = localStorage.getItem('lastUsedPublication');
      if (lastUsed && pubs.find((p: Publication) => p.id === lastUsed)) {
        setSelectedPublication(lastUsed);
      } else if (pubs.length > 0) {
        setSelectedPublication(pubs[0].id);
      }
    } catch (error) {
      console.error('Failed to load publications:', error);
    }
  };

  const loadSuggestions = async (publicationId: string) => {
    try {
      const sugg = await window.electronAPI['synopsis-stats:get-suggestions'](publicationId);
      setSuggestions(sugg);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPublication) return;

    setLoading(true);
    try {
      const data: QuickLogDTO = {
        publicationId: selectedPublication,
        date: formData.date || new Date(),
        views: formData.views,
        revenue: formData.revenue,
        purchases: formData.purchases,
        rank: formData.rank,
        rankType: formData.rankType,
        episodeNumber: formData.episodeNumber,
        note: formData.note,
        isEstimated: formData.isEstimated || false
      };

      await window.electronAPI['synopsis-stats:create-metric'](data);

      // Save last used publication
      localStorage.setItem('lastUsedPublication', selectedPublication);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create metric:', error);
      alert('데이터 저장 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillWithAverage = () => {
    setFormData((prev: Partial<QuickLogDTO>) => ({
      ...prev,
      views: suggestions.avgViews,
      revenue: suggestions.avgRevenue,
      purchases: suggestions.avgPurchases,
      isEstimated: true
    }));
  };

  if (!isOpen) return null;

  const selectedPub = publications.find((p) => p.id === selectedPublication);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">⚡ Quick Log</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform Selection */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              플랫폼
            </label>
            <select
              value={selectedPublication}
              onChange={(e) => setSelectedPublication(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
              required
            >
              {publications.map((pub) => (
                <option key={pub.id} value={pub.id}>
                  {pub.platform} {pub.status === 'ongoing' ? '🟢' : '⚫'}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              날짜
            </label>
            <input
              type="date"
              value={formData.date?.toISOString().split('T')[0]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: new Date(e.target.value) }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
              required
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Views */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                조회수
                {suggestions.avgViews && (
                  <span className="ml-1 text-gray-400">(평균: {suggestions.avgViews})</span>
                )}
              </label>
              <input
                type="number"
                value={formData.views ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    views: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Revenue */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                수익 (원)
                {suggestions.avgRevenue && (
                  <span className="ml-1 text-gray-400">(평균: {suggestions.avgRevenue})</span>
                )}
              </label>
              <input
                type="number"
                value={formData.revenue ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    revenue: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Purchases */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                구매수
              </label>
              <input
                type="number"
                value={formData.purchases ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    purchases: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Rank */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                순위
              </label>
              <input
                type="number"
                value={formData.rank ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rank: e.target.value ? Number(e.target.value) : undefined
                  }))
                }
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Rank Type (if rank is entered) */}
          {formData.rank && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                순위 유형
              </label>
              <select
                value={formData.rankType ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rankType: e.target.value as RankType
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="">선택</option>
                <option value="realtime">실시간</option>
                <option value="daily">일간</option>
                <option value="weekly">주간</option>
                <option value="genre">장르</option>
              </select>
            </div>
          )}

          {/* Episode Number */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              회차 번호 (선택)
            </label>
            <input
              type="number"
              value={formData.episodeNumber ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  episodeNumber: e.target.value ? Number(e.target.value) : undefined
                }))
              }
              placeholder="최신 회차"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              메모 (선택)
            </label>
            <input
              type="text"
              value={formData.note ?? ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              placeholder="추가 메모..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Estimated checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={formData.isEstimated}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isEstimated: e.target.checked }))
              }
              className="rounded"
            />
            추정치로 표시
          </label>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillWithAverage}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              평균값 채우기
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
