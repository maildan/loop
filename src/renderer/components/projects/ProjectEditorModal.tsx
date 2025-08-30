'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';
import { 
  FileText, 
  BookOpen,
  Newspaper,
  Coffee,
  Code,
  Lightbulb,
  Plus,
  X,
  Target
} from 'lucide-react';
import type { Project } from '../../../shared/types';

// 스타일 – ProjectCreator와 동일한 룩앤필 유지
const EDITOR_STYLES = {
  overlay: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4',
  modal: 'bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-slate-900/50 w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700',
  header: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  title: 'text-2xl font-bold text-slate-900 dark:text-slate-100',
  closeButton: 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800',
  content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-white dark:bg-slate-900',
  formSection: 'mb-6',
  sectionTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4',
  label: 'block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2',
  inputGroup: 'mb-4',
  genreGrid: 'grid grid-cols-2 md:grid-cols-4 gap-2 mt-2',
  genreButton: 'p-2 text-sm border rounded-lg transition-colors',
  genreSelected: 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
  genreDefault: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800',
  footer: 'flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  secondaryButton: 'px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800',
  primaryButton: 'px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

const GENRE_OPTIONS = [
  { id: 'novel', name: '소설', icon: BookOpen },
  { id: 'essay', name: '에세이', icon: Coffee },
  { id: 'blog', name: '블로그', icon: Newspaper },
  { id: 'tech', name: '기술', icon: Code },
  { id: 'diary', name: '일기', icon: FileText },
  { id: 'poem', name: '시', icon: Lightbulb },
  { id: 'script', name: '대본', icon: FileText },
  { id: 'other', name: '기타', icon: Plus },
];

export interface ProjectEditorModalProps {
  readonly isOpen: boolean;
  readonly project: Pick<Project, 'id' | 'title' | 'description' | 'genre'> | null;
  readonly onClose: () => void;
  readonly onUpdated: (updated: { id: string; title: string; description: string; genre: string; targetWords?: number; deadline?: Date }) => void;
}

export function ProjectEditorModal({ isOpen, project, onClose, onUpdated }: ProjectEditorModalProps): React.ReactElement | null {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [genre, setGenre] = useState<string>('novel');
  const [targetWords, setTargetWords] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setGenre((project.genre as string) || 'novel');
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSave = async (): Promise<void> => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const updates: Partial<Project> = {
        title: title.trim(),
        description: description.trim(),
        genre,
        lastModified: new Date(),
      };

      const result = await window.electronAPI.projects.update(project.id, updates);
      if (!result.success) throw new Error(result.error || 'Failed to update project');

      onUpdated({ id: project.id, title: updates.title || title, description: updates.description || description, genre, targetWords, deadline: deadline ? new Date(deadline) : undefined });
      onClose();
    } catch (error) {
      Logger.error('PROJECT_EDITOR_MODAL', 'Failed to update project', error);
      alert('프로젝트 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={EDITOR_STYLES.overlay} onClick={onClose}>
      <div className={EDITOR_STYLES.modal} onClick={(e) => e.stopPropagation()}>
        <div className={EDITOR_STYLES.header}>
          <h2 className={EDITOR_STYLES.title}>프로젝트 편집</h2>
          <button onClick={onClose} className={EDITOR_STYLES.closeButton} aria-label="닫기">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={EDITOR_STYLES.content}>
          <div className={EDITOR_STYLES.formSection}>
            <h3 className={EDITOR_STYLES.sectionTitle}>기본 정보</h3>
            <div className={EDITOR_STYLES.inputGroup}>
              <label className={EDITOR_STYLES.label} htmlFor="edit-title">프로젝트 제목 *</label>
              <Input id="edit-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
            </div>
            <div className={EDITOR_STYLES.inputGroup}>
              <label className={EDITOR_STYLES.label} htmlFor="edit-desc">프로젝트 설명</label>
              <Textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} />
            </div>

            <div className={EDITOR_STYLES.inputGroup}>
              <label className={EDITOR_STYLES.label}>장르</label>
              <div className={EDITOR_STYLES.genreGrid}>
                {GENRE_OPTIONS.map(g => {
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      className={`${EDITOR_STYLES.genreButton} ${genre === g.id ? EDITOR_STYLES.genreSelected : EDITOR_STYLES.genreDefault}`}
                      onClick={() => setGenre(g.id)}
                    >
                      <Icon className="w-4 h-4 inline mr-1" />{g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={EDITOR_STYLES.formSection}>
            <h3 className={EDITOR_STYLES.sectionTitle}>목표 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={EDITOR_STYLES.inputGroup}>
                <label className={EDITOR_STYLES.label} htmlFor="edit-target">목표 단어 수</label>
                <div className="flex items-center space-x-2">
                  <Input id="edit-target" type="number" value={targetWords} onChange={(e) => setTargetWords(Number(e.target.value) || 0)} min="0" step="100" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">단어</span>
                </div>
              </div>
              <div className={EDITOR_STYLES.inputGroup}>
                <label className={EDITOR_STYLES.label} htmlFor="edit-deadline">완료 목표 날짜 (선택사항)</label>
                <Input id="edit-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>
            {targetWords > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">목표 미리보기</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={EDITOR_STYLES.footer}>
          <button onClick={onClose} className={EDITOR_STYLES.secondaryButton}>취소</button>
          <Button onClick={handleSave} disabled={!title.trim() || isSaving} className={EDITOR_STYLES.primaryButton}>
            {isSaving ? '저장 중...' : '변경 사항 저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProjectEditorModal;


