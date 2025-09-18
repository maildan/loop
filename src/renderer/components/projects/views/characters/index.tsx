'use client';

import React, { useState } from 'react';
import { ProjectCharacter } from '../../../../../shared/types';
import { Logger } from '../../../../../shared/logger';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { CharacterStats } from './CharacterStats';
import { CharacterList } from './CharacterList';
import { CharacterForm } from './CharacterForm';

interface CharactersViewProps {
    projectId: string;
    characters: ProjectCharacter[];
    onCharactersChange: (characters: ProjectCharacter[]) => void;
    focusMode?: boolean;
}

const CHARACTERS_STYLES = {
    container: 'h-full flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
    header: 'p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700/50',
    headerTop: 'flex items-center justify-between mb-4',
    title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    subtitle: 'text-slate-600 dark:text-gray-400 leading-relaxed',
    content: 'flex-1 flex flex-col min-h-0 h-full',
    scrollArea: 'flex-1 overflow-y-auto max-h-full h-0',
    contentPadding: 'p-6',
};

const CharactersViewComponent = React.memo(({
    projectId,
    characters,
    onCharactersChange,
    focusMode = false
}: CharactersViewProps): React.ReactElement => {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Record<string, string>>({});
    const [editingCharacter, setEditingCharacter] = useState<ProjectCharacter | null>(null);
    const [editForm, setEditForm] = useState<Partial<ProjectCharacter>>({});

    // 🔥 삭제 관련 상태
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [characterToDelete, setCharacterToDelete] = useState<{ id: string; name: string } | null>(null);

    const handleAddCharacter = (): void => {
        const newCharacter: ProjectCharacter = {
            id: Date.now().toString(),
            projectId,
            name: '새 인물',
            role: '역할 미정',
            description: '인물에 대한 기본 설명을 추가하세요.',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setEditingCharacter(newCharacter);
        setEditForm(newCharacter);
    };

    const handleEditStart = (character: ProjectCharacter): void => {
        setEditingCharacter(character);
        setEditForm(character);
    };

    const handleEditSubmit = async (): Promise<void> => {
        if (!editingCharacter || !editForm.name?.trim()) return;

        try {
            const updatedCharacter: ProjectCharacter = {
                ...editingCharacter,
                ...editForm,
                name: editForm.name.trim(),
                updatedAt: new Date(),
            };

            // 새 캐릭터인지 기존 캐릭터 수정인지 확인
            const existingIndex = characters.findIndex(c => c.id === editingCharacter.id);
            let updatedCharacters: ProjectCharacter[];

            if (existingIndex >= 0) {
                // 기존 캐릭터 수정
                updatedCharacters = characters.map(c =>
                    c.id === editingCharacter.id ? updatedCharacter : c
                );
                Logger.info('CHARACTERS_VIEW', 'Character updated', {
                    id: updatedCharacter.id,
                    name: updatedCharacter.name
                });
            } else {
                // 새 캐릭터 추가
                updatedCharacters = [...characters, updatedCharacter];
                Logger.info('CHARACTERS_VIEW', 'Character added', {
                    id: updatedCharacter.id,
                    name: updatedCharacter.name
                });
            }

            onCharactersChange(updatedCharacters);
            setEditingCharacter(null);
            setEditForm({});
        } catch (error) {
            Logger.error('CHARACTERS_VIEW', 'Failed to save character', {
                character: editingCharacter,
                error
            });
        }
    };

    const handleEditCancel = (): void => {
        setEditingCharacter(null);
        setEditForm({});
    };

    const handleFormChange = (updates: Partial<ProjectCharacter>): void => {
        setEditForm(prev => ({ ...prev, ...updates }));
    };

    // 🔥 삭제 관련 핸들러
    const handleDelete = (id: string, name: string): void => {
        setCharacterToDelete({ id, name });
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async (): Promise<void> => {
        if (!characterToDelete) return;

        try {
            const updatedCharacters = characters.filter(char => char.id !== characterToDelete.id);
            onCharactersChange(updatedCharacters);
            setShowDeleteDialog(false);
            setCharacterToDelete(null);
            Logger.info('CHARACTERS_VIEW', 'Character deleted successfully', {
                id: characterToDelete.id,
                name: characterToDelete.name
            });
        } catch (error) {
            Logger.error('CHARACTERS_VIEW', 'Failed to delete character', {
                id: characterToDelete.id,
                name: characterToDelete.name,
                error
            });
        }
    };

    const handleCancelDelete = (): void => {
        setShowDeleteDialog(false);
        setCharacterToDelete(null);
    };

    const handleTabChange = (characterId: string, tab: string): void => {
        setActiveTab(prev => ({ ...prev, [characterId]: tab }));
    };

    const handleCharacterSelect = (id: string): void => {
        setSelectedCharacterId(id);
    };

    const handleCharacterDoubleClick = (character: ProjectCharacter): void => {
        handleEditStart(character);
    };

    return (
        <div className={CHARACTERS_STYLES.container}>
            {/* 🔥 개선된 헤더 */}
            <div className={CHARACTERS_STYLES.header}>
                <div className={CHARACTERS_STYLES.headerTop}>
                    <div>
                        <h1 className={CHARACTERS_STYLES.title}>등장인물</h1>
                        <p className={CHARACTERS_STYLES.subtitle}>
                            이야기 속 캐릭터들의 상세한 프로필을 관리하세요.
                            체계적인 캐릭터 설정으로 더욱 생생한 스토리를 만들어보세요.
                        </p>
                    </div>
                </div>

                {/* 🔥 통계 카드 */}
                <CharacterStats characters={characters} />
            </div>

            {/* 🔥 콘텐츠 영역 */}
            <div className={CHARACTERS_STYLES.content}>
                <div className={CHARACTERS_STYLES.scrollArea}>
                    <div className={CHARACTERS_STYLES.contentPadding}>
                        <CharacterList
                            characters={characters}
                            focusMode={focusMode}
                            selectedCharacterId={selectedCharacterId}
                            activeTab={activeTab}
                            onCharacterSelect={handleCharacterSelect}
                            onCharacterDoubleClick={handleCharacterDoubleClick}
                            onTabChange={handleTabChange}
                            onEditCharacter={handleEditStart}
                            onDeleteCharacter={handleDelete}
                            onAddCharacter={handleAddCharacter}
                        />
                    </div>
                </div>
            </div>

            {/* 🔥 편집 모달 */}
            <CharacterForm
                character={editingCharacter}
                editForm={editForm}
                onFormChange={handleFormChange}
                onSubmit={handleEditSubmit}
                onCancel={handleEditCancel}
                isVisible={!!editingCharacter}
            />

            {/* 🔥 삭제 확인 다이얼로그 */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="캐릭터 삭제"
                message={characterToDelete ? `"${characterToDelete.name}"을(를) 삭제하시겠습니까?` : ''}
                confirmText="삭제"
                cancelText="취소"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
});

CharactersViewComponent.displayName = 'CharactersView';

export { CharactersViewComponent as CharactersView };