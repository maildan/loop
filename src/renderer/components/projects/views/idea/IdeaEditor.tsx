import React from 'react';
import { X as XIcon } from 'lucide-react';
import { IdeaItem, CATEGORY_STYLES, STAGE_STYLES } from './types';

interface IdeaEditorProps {
    idea: IdeaItem | null;
    isVisible: boolean;
    isNew?: boolean;
    onChange: (updates: Partial<IdeaItem>) => void;
    onSave: () => void;
    onCancel: () => void;
}

const IDEA_STYLES = {
    modal: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
    modalContent: 'bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto',
    modalHeader: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700',
    modalTitle: 'text-xl font-bold text-gray-900 dark:text-gray-100',
    modalBody: 'p-6 space-y-6',
    modalFooter: 'flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-gray-700',
    formGroup: 'space-y-2',
    formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
    input: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    textarea: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
    select: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    button: 'px-4 py-2 rounded-lg font-medium transition-colors',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
    actionButton: 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
};

export function IdeaEditor({
    idea,
    isVisible,
    isNew = false,
    onChange,
    onSave,
    onCancel
}: IdeaEditorProps) {
    if (!isVisible || !idea) {
        return null;
    }

    const handleFieldChange = (field: keyof IdeaItem) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        if (field === 'tags') {
            onChange({
                [field]: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
            });
        } else {
            onChange({ [field]: e.target.value });
        }
    };

    return (
        <div className={IDEA_STYLES.modal} onClick={onCancel}>
            <div className={IDEA_STYLES.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={IDEA_STYLES.modalHeader}>
                    <h2 className={IDEA_STYLES.modalTitle}>
                        {isNew ? '새 아이디어' : '아이디어 편집'}
                    </h2>
                    <button onClick={onCancel} className={IDEA_STYLES.actionButton}>
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className={IDEA_STYLES.modalBody}>
                    <div className={IDEA_STYLES.formGroup}>
                        <label className={IDEA_STYLES.label}>제목</label>
                        <input
                            type="text"
                            value={idea.title}
                            onChange={handleFieldChange('title')}
                            className={IDEA_STYLES.input}
                            placeholder="아이디어 제목을 입력하세요..."
                            autoFocus
                        />
                    </div>

                    <div className={IDEA_STYLES.formGroup}>
                        <label className={IDEA_STYLES.label}>내용</label>
                        <textarea
                            value={idea.content}
                            onChange={handleFieldChange('content')}
                            className={IDEA_STYLES.textarea}
                            rows={4}
                            placeholder="아이디어의 상세 내용을 기록하세요..."
                        />
                    </div>

                    <div className={IDEA_STYLES.formGrid}>
                        <div className={IDEA_STYLES.formGroup}>
                            <label className={IDEA_STYLES.label}>카테고리</label>
                            <select
                                value={idea.category}
                                onChange={handleFieldChange('category')}
                                className={IDEA_STYLES.select}
                            >
                                {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
                                    <option key={key} value={key}>
                                        {style.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={IDEA_STYLES.formGroup}>
                            <label className={IDEA_STYLES.label}>단계</label>
                            <select
                                value={idea.stage}
                                onChange={handleFieldChange('stage')}
                                className={IDEA_STYLES.select}
                            >
                                {Object.entries(STAGE_STYLES).map(([key, style]) => (
                                    <option key={key} value={key}>
                                        {style.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={IDEA_STYLES.formGroup}>
                        <label className={IDEA_STYLES.label}>우선순위</label>
                        <select
                            value={idea.priority}
                            onChange={handleFieldChange('priority')}
                            className={IDEA_STYLES.select}
                        >
                            <option value="low">낮음</option>
                            <option value="medium">보통</option>
                            <option value="high">높음</option>
                        </select>
                    </div>

                    <div className={IDEA_STYLES.formGroup}>
                        <label className={IDEA_STYLES.label}>태그 (쉼표로 구분)</label>
                        <input
                            type="text"
                            value={idea.tags.join(', ')}
                            onChange={handleFieldChange('tags')}
                            className={IDEA_STYLES.input}
                            placeholder="예: 판타지, 마법, 모험"
                        />
                    </div>

                    <div className={IDEA_STYLES.formGroup}>
                        <label className={IDEA_STYLES.label}>메모</label>
                        <textarea
                            value={idea.notes}
                            onChange={handleFieldChange('notes')}
                            className={IDEA_STYLES.textarea}
                            rows={3}
                            placeholder="추가 메모나 영감의 출처를 기록하세요..."
                        />
                    </div>
                </div>

                <div className={IDEA_STYLES.modalFooter}>
                    <button
                        onClick={onCancel}
                        className={`${IDEA_STYLES.button} ${IDEA_STYLES.secondaryButton}`}
                    >
                        취소
                    </button>
                    <button
                        onClick={onSave}
                        className={`${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`}
                        disabled={!idea.title.trim()}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}