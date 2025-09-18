import React from 'react';
import { Plus } from 'lucide-react';
import { ProjectCharacter } from '../../../../../shared/types';
import { CharacterCard } from './CharacterCard';

interface CharacterListProps {
    characters: ProjectCharacter[];
    focusMode?: boolean;
    selectedCharacterId: string | null;
    activeTab: Record<string, string>;
    onCharacterSelect: (id: string) => void;
    onCharacterDoubleClick: (character: ProjectCharacter) => void;
    onTabChange: (characterId: string, tab: string) => void;
    onEditCharacter: (character: ProjectCharacter) => void;
    onDeleteCharacter: (id: string, name: string) => void;
    onAddCharacter: () => void;
}

const CHARACTERS_STYLES = {
    characterGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    addButton: 'group bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 p-8 flex flex-col items-center justify-center text-center min-h-[200px] cursor-pointer',
    addButtonIcon: 'w-12 h-12 text-slate-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-3 transition-colors duration-200',
    addButtonText: 'text-slate-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors duration-200',
    emptyState: 'text-center py-16',
    emptyStateIcon: 'mx-auto w-24 h-24 text-slate-300 dark:text-gray-600 mb-4',
    emptyStateTitle: 'text-xl font-semibold text-slate-600 dark:text-gray-400 mb-2',
    emptyStateDescription: 'text-slate-500 dark:text-gray-500 mb-6 max-w-md mx-auto',
    emptyStateButton: 'inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-150',
};

export function CharacterList({
    characters,
    focusMode = false,
    selectedCharacterId,
    activeTab,
    onCharacterSelect,
    onCharacterDoubleClick,
    onTabChange,
    onEditCharacter,
    onDeleteCharacter,
    onAddCharacter
}: CharacterListProps) {
    const getTabForCharacter = (characterId: string): string => {
        return activeTab[characterId] || 'basic';
    };

    const setTabForCharacter = (characterId: string, tab: string): void => {
        onTabChange(characterId, tab);
    };

    if (characters.length === 0) {
        return (
            <div className={CHARACTERS_STYLES.emptyState}>
                <div className={CHARACTERS_STYLES.emptyStateIcon}>
                    👤
                </div>
                <h3 className={CHARACTERS_STYLES.emptyStateTitle}>아직 캐릭터가 없습니다</h3>
                <p className={CHARACTERS_STYLES.emptyStateDescription}>
                    첫 번째 캐릭터를 추가하여 이야기를 만들어보세요.
                    상세한 캐릭터 설정으로 더욱 풍부한 스토리를 만들 수 있습니다.
                </p>
                <button
                    onClick={onAddCharacter}
                    className={CHARACTERS_STYLES.emptyStateButton}
                >
                    <Plus className="w-5 h-5" />
                    <span>첫 캐릭터 추가하기</span>
                </button>
            </div>
        );
    }

    return (
        <div className={CHARACTERS_STYLES.characterGrid}>
            {characters.map((character) => (
                <CharacterCard
                    key={character.id}
                    character={character}
                    focusMode={focusMode}
                    isSelected={selectedCharacterId === character.id}
                    activeTab={getTabForCharacter(character.id)}
                    onTabChange={(tab) => setTabForCharacter(character.id, tab)}
                    onEdit={onEditCharacter}
                    onDelete={onDeleteCharacter}
                    onSelect={onCharacterSelect}
                    onDoubleClick={onCharacterDoubleClick}
                />
            ))}

            {/* 🔥 추가 버튼 */}
            <button
                onClick={onAddCharacter}
                className={CHARACTERS_STYLES.addButton}
            >
                <Plus className={CHARACTERS_STYLES.addButtonIcon} />
                <span className={CHARACTERS_STYLES.addButtonText}>새 인물 추가</span>
            </button>
        </div>
    );
}