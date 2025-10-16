/**
 * 🔥 EpisodeDetailModal - 회차 상세 편집 모달
 * 
 * 기능:
 * - 회차 제목/내용 편집
 * - 5막 구조 선택
import { RendererLogger as Logger } from '../../../../../shared/logger-renderer';
const EPISODE_DETAIL_MODAL = Symbol.for('EPISODE_DETAIL_MODAL');

import { RendererLogger as Logger } from '../../../../../shared/logger-renderer';
const EPISODE_DETAIL_MODAL = Symbol.for('EPISODE_DETAIL_MODAL');

 * - 상태 변경 (draft/in-progress/completed)
 * - 클리프행어 설정
 * - 작가 메모
 * - 글자 수 목표 설정
 */

'use client';

import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { Episode } from '../../../../../hooks/useEpisodes';
import { Logger } from '../../../../../../shared/logger-renderer';
import { PLATFORM_NAMES, type PlatformType } from '../../../../../../shared/constants/platform-requirements';

export interface EpisodeDetailModalProps {
  episode: Episode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Episode>) => Promise<void>;
}

const actOptions = [
  { value: 'intro', label: '도입' },
  { value: 'rising', label: '발단' },
  { value: 'development', label: '전개' },
  { value: 'climax', label: '절정' },
  { value: 'conclusion', label: '결말' },
];

const statusOptions = [
  { value: 'draft', label: '초안', color: 'text-gray-500' },
  { value: 'in-progress', label: '진행 중', color: 'text-blue-500' },
  { value: 'completed', label: '완료', color: 'text-green-500' },
  { value: 'published', label: '발행됨', color: 'text-purple-500' },
];

const cliffhangerTypes = [
  { value: 'revelation', label: '반전/폭로' },
  { value: 'danger', label: '위험/위기' },
  { value: 'emotional', label: '감정/갈등' },
  { value: 'mystery', label: '미스터리' },
];

const platformOptions: Array<{ value: PlatformType; label: string }> = [
  { value: 'kakao', label: PLATFORM_NAMES.kakao },
  { value: 'naver', label: PLATFORM_NAMES.naver },
  { value: 'munpia', label: PLATFORM_NAMES.munpia },
  { value: 'joara', label: PLATFORM_NAMES.joara },
  { value: 'novelpia', label: PLATFORM_NAMES.novelpia },
];

export const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Episode>>({});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (episode) {
      setFormData({
        title: episode.title,
        content: episode.content,
        act: episode.act,
        status: episode.status,
        targetWordCount: episode.targetWordCount,
        cliffhangerType: episode.cliffhangerType,
        cliffhangerIntensity: episode.cliffhangerIntensity,
        notes: episode.notes,
        platform: episode.platform,
      });
    }
  }, [episode]);

  const handleSave = async () => {
    if (!episode) return;

    try {
      setSaving(true);
      await onSave(episode.id, formData);
      onClose();
    } catch (error) {
      Logger.error('EPISODE_DETAIL_MODAL', 'Error saving episode', { error });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !episode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {episode.episodeNumber}화: {episode.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {episode.wordCount.toLocaleString()}자 / {episode.targetWordCount.toLocaleString()}자
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              회차 제목
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="예: 회귀의 시작"
            />
          </div>

          {/* Status + Act + Platform */}
          <div className="grid grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                상태
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Episode['status'] })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Act */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                5막 구조
              </label>
              <select
                value={formData.act || ''}
                onChange={(e) => setFormData({ ...formData, act: e.target.value as Episode['act'] })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              >
                <option value="">선택 안 함</option>
                {actOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                연재 플랫폼
              </label>
              <select
                value={formData.platform || ''}
                onChange={(e) => setFormData({ ...formData, platform: (e.target.value || null) as PlatformType | null })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              >
                <option value="">선택 안 함</option>
                {platformOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cliffhanger */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cliffhanger Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                클리프행어 유형
              </label>
              <select
                value={formData.cliffhangerType || ''}
                onChange={(e) => setFormData({ ...formData, cliffhangerType: e.target.value as Episode['cliffhangerType'] })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              >
                <option value="">없음</option>
                {cliffhangerTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cliffhanger Intensity */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                강도 (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.cliffhangerIntensity || 5}
                onChange={(e) => setFormData({ ...formData, cliffhangerIntensity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Target Word Count */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              목표 글자 수
            </label>
            <input
              type="number"
              value={formData.targetWordCount || 5500}
              onChange={(e) => setFormData({ ...formData, targetWordCount: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="5500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              작가 메모
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
              placeholder="이 회차에 대한 메모를 입력하세요..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                저장
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
