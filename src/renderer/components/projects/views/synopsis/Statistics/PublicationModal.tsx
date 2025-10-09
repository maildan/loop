/**
 * 📝 Publication Modal - 플랫폼 추가/수정 모달
 * @module renderer/components/synopsis/Statistics/PublicationModal
 */

'use client';

import React, { useState } from 'react';
import type {
  CreatePublicationDTO,
  PlatformType,
  PublicationStatus,
  ContractType
} from '../../../../../../shared/types/synopsis-stats';

interface PublicationModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PublicationModal: React.FC<PublicationModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreatePublicationDTO>>({
    projectId,
    platform: undefined,
    platformUrl: '',
    startDate: undefined,
    status: 'ongoing',
    contractType: undefined,
    note: ''
  });

  const platforms: { value: PlatformType; label: string }[] = [
    { value: 'naver', label: '네이버 시리즈' },
    { value: 'kakao', label: '카카오페이지' },
    { value: 'munpia', label: '문피아' },
    { value: 'joara', label: '조아라' },
    { value: 'ridibooks', label: '리디북스' },
    { value: 'toksoda', label: '톡소다' }
  ];

  const statuses: { value: PublicationStatus; label: string }[] = [
    { value: 'ongoing', label: '연재 중' },
    { value: 'completed', label: '완결' },
    { value: 'hiatus', label: '휴재' },
    { value: 'discontinued', label: '중단' }
  ];

  const contractTypes: { value: ContractType; label: string }[] = [
    { value: 'exclusive', label: '독점' },
    { value: 'non-exclusive', label: '비독점' },
    { value: 'revenue_share', label: '수익 분배' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform) {
      alert('플랫폼을 선택해주세요');
      return;
    }

    setLoading(true);
    try {
      await window.electronAPI['synopsis-stats:create-publication']({
        projectId,
        platform: formData.platform!,
        platformUrl: formData.platformUrl,
        startDate: formData.startDate,
        status: formData.status,
        contractType: formData.contractType,
        note: formData.note
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create publication:', error);
      alert('플랫폼 추가 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">플랫폼 추가</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform 선택 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              플랫폼 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.platform || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, platform: e.target.value as PlatformType }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
              required
            >
              <option value="">선택하세요</option>
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Platform URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              플랫폼 URL (선택)
            </label>
            <input
              type="url"
              value={formData.platformUrl || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, platformUrl: e.target.value }))}
              placeholder="https://example.com/novel/123"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              연재 시작일 (선택)
            </label>
            <input
              type="date"
              value={
                formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: e.target.value ? new Date(e.target.value) : undefined
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              상태
            </label>
            <select
              value={formData.status || 'ongoing'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as PublicationStatus
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              계약 유형 (선택)
            </label>
            <select
              value={formData.contractType || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contractType: e.target.value as ContractType | undefined
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="">선택하세요</option>
              {contractTypes.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              메모 (선택)
            </label>
            <textarea
              value={formData.note || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              placeholder="계약 조건, 특이사항 등..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
