import React from 'react';
import { Save, X as XIcon } from 'lucide-react';
import { ProjectCharacter } from '../../../../../shared/types';

interface CharacterFormProps {
    character: ProjectCharacter | null;
    editForm: Partial<ProjectCharacter>;
    onFormChange: (updates: Partial<ProjectCharacter>) => void;
    onSubmit: () => Promise<void>;
    onCancel: () => void;
    isVisible: boolean;
}

const CHARACTERS_STYLES = {
    modalOverlay: 'fixed inset-0 bg-[hsl(var(--background))]/80 backdrop-blur-sm flex items-center justify-center z-50',
    modal: 'bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto text-[hsl(var(--foreground))]',
    modalHeader: 'flex items-center justify-between p-6 border-b border-border/60',
    modalTitle: 'text-xl font-bold text-[hsl(var(--foreground))]',
    modalBody: 'p-6',
    modalFooter: 'flex justify-end gap-3 p-6 border-t border-border/60',
    formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    formField: 'flex flex-col space-y-2',
    formLabel: 'text-sm font-medium text-muted-foreground',
    formInput: 'px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/50 focus:border-[hsl(var(--accent-primary))] bg-background text-[hsl(var(--foreground))]',
    formTextarea: 'px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[hsl(var(--accent-primary))]/50 focus:border-[hsl(var(--accent-primary))] bg-background text-[hsl(var(--foreground))] resize-none',
    button: 'px-4 py-2 rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--accent-primary))]/40 focus:ring-offset-background',
    buttonPrimary: 'bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-primary))]/90 text-[hsl(var(--accent-foreground))]',
    buttonSecondary: 'bg-muted hover:bg-muted/80 text-[hsl(var(--foreground))]',
};

export function CharacterForm({
    character,
    editForm,
    onFormChange,
    onSubmit,
    onCancel,
    isVisible
}: CharacterFormProps) {
    if (!isVisible || !character) {
        return null;
    }

    const handleFieldChange = (field: keyof ProjectCharacter) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onFormChange({ [field]: e.target.value });
    };

    return (
        <div className={CHARACTERS_STYLES.modalOverlay} onClick={onCancel}>
            <div className={CHARACTERS_STYLES.modal} onClick={(e) => e.stopPropagation()}>
                <div className={CHARACTERS_STYLES.modalHeader}>
                    <h2 className={CHARACTERS_STYLES.modalTitle}>
                        {character.id === editForm.id ? '캐릭터 편집' : '새 캐릭터'}
                    </h2>
                    <button onClick={onCancel}>
                        <XIcon size={20} />
                    </button>
                </div>

                <div className={CHARACTERS_STYLES.modalBody}>
                    <div className={CHARACTERS_STYLES.formGrid}>
                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>이름 *</label>
                            <input
                                type="text"
                                value={editForm.name || ''}
                                onChange={handleFieldChange('name')}
                                className={CHARACTERS_STYLES.formInput}
                                placeholder="캐릭터 이름"
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>역할</label>
                            <input
                                type="text"
                                value={editForm.role || ''}
                                onChange={handleFieldChange('role')}
                                className={CHARACTERS_STYLES.formInput}
                                placeholder="주인공, 조연, 악역 등"
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>나이</label>
                            <input
                                type="text"
                                value={editForm.age || ''}
                                onChange={handleFieldChange('age')}
                                className={CHARACTERS_STYLES.formInput}
                                placeholder="나이 또는 연령대"
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>직업</label>
                            <input
                                type="text"
                                value={editForm.occupation || ''}
                                onChange={handleFieldChange('occupation')}
                                className={CHARACTERS_STYLES.formInput}
                                placeholder="직업이나 역할"
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>출신</label>
                            <input
                                type="text"
                                value={editForm.birthplace || ''}
                                onChange={handleFieldChange('birthplace')}
                                className={CHARACTERS_STYLES.formInput}
                                placeholder="출생지"
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>거주지</label>
                            <input
                                type="text"
                                value={editForm.residence || ''}
                                onChange={handleFieldChange('residence')}
                                className={CHARACTERS_STYLES.formInput}
                                placeholder="현재 거주지"
                            />
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>외모</label>
                            <textarea
                                value={editForm.appearance || ''}
                                onChange={handleFieldChange('appearance')}
                                className={CHARACTERS_STYLES.formTextarea}
                                placeholder="키, 몸무게, 헤어스타일, 특징 등"
                                rows={3}
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>성격</label>
                            <textarea
                                value={editForm.personality || ''}
                                onChange={handleFieldChange('personality')}
                                className={CHARACTERS_STYLES.formTextarea}
                                placeholder="성격적 특징, 말투, 습관 등"
                                rows={3}
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>가족</label>
                            <textarea
                                value={editForm.family || ''}
                                onChange={handleFieldChange('family')}
                                className={CHARACTERS_STYLES.formTextarea}
                                placeholder="가족 구성원과 관계"
                                rows={2}
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>배경</label>
                            <textarea
                                value={editForm.background || ''}
                                onChange={handleFieldChange('background')}
                                className={CHARACTERS_STYLES.formTextarea}
                                placeholder="과거 경험, 중요한 사건 등"
                                rows={3}
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>목표</label>
                            <textarea
                                value={editForm.goals || ''}
                                onChange={handleFieldChange('goals')}
                                className={CHARACTERS_STYLES.formTextarea}
                                placeholder="캐릭터의 목표나 바람"
                                rows={2}
                            />
                        </div>

                        <div className={CHARACTERS_STYLES.formField}>
                            <label className={CHARACTERS_STYLES.formLabel}>설명</label>
                            <textarea
                                value={editForm.description || ''}
                                onChange={handleFieldChange('description')}
                                className={CHARACTERS_STYLES.formTextarea}
                                placeholder="캐릭터에 대한 전반적인 설명"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                <div className={CHARACTERS_STYLES.modalFooter}>
                    <button
                        onClick={onCancel}
                        className={`${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonSecondary}`}
                    >
                        취소
                    </button>
                    <button
                        onClick={onSubmit}
                        className={`${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary}`}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}