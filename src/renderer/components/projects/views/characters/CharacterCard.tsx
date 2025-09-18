import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { ProjectCharacter } from '../../../../../shared/types';
import { CharacterTabs } from './CharacterTabs';

interface CharacterCardProps {
    character: ProjectCharacter;
    focusMode?: boolean;
    isSelected?: boolean;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onEdit: (character: ProjectCharacter) => void;
    onDelete: (id: string, name: string) => void;
    onSelect?: (id: string) => void;
    onDoubleClick?: (character: ProjectCharacter) => void;
}

const CHARACTERS_STYLES = {
    characterCard: 'group bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden',
    characterHeader: 'p-4 border-b border-slate-100 dark:border-gray-700',
    characterAvatar: 'w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-3',
    characterName: 'font-bold text-lg text-gray-900 dark:text-gray-100 mb-1',
    characterRole: 'text-sm text-blue-600 dark:text-blue-400 font-medium',
    actionButtons: 'absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10',
    editButton: 'p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-150',
    deleteButton: 'p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-150',
};

export function CharacterCard({
    character,
    focusMode = false,
    isSelected = false,
    activeTab,
    onTabChange,
    onEdit,
    onDelete,
    onSelect,
    onDoubleClick
}: CharacterCardProps) {
    let pressTimer: NodeJS.Timeout | null = null;

    const handleCharacterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onSelect?.(character.id);
    };

    const handleCharacterDoubleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onDoubleClick?.(character);
    };

    // 🔥 Long press 이벤트 핸들러
    const handleMouseDown = () => {
        pressTimer = setTimeout(() => {
            onEdit(character);
        }, 500); // 500ms 롱프레스
    };

    const handleMouseUp = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    };

    const handleMouseLeave = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    };

    return (
        <div
            className={`${CHARACTERS_STYLES.characterCard} ${focusMode && !isSelected
                ? 'opacity-30 blur-[1px] scale-95 transition-all duration-300'
                : 'opacity-100 blur-0 scale-100 transition-all duration-300'
                }`}
            onClick={handleCharacterClick}
            onDoubleClick={handleCharacterDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => focusMode && onSelect?.(character.id)}
        >
            <div className="relative">
                {/* 🔥 액션 버튼들 */}
                <div className={CHARACTERS_STYLES.actionButtons}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(character);
                        }}
                        className={CHARACTERS_STYLES.editButton}
                        title="편집"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(character.id, character.name);
                        }}
                        className={CHARACTERS_STYLES.deleteButton}
                        title="삭제"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* 🔥 캐릭터 헤더 */}
                <div className={CHARACTERS_STYLES.characterHeader}>
                    <div className={CHARACTERS_STYLES.characterAvatar}>
                        {character.name.charAt(0)}
                    </div>
                    <h3 className={CHARACTERS_STYLES.characterName}>{character.name}</h3>
                    <span className={CHARACTERS_STYLES.characterRole}>{character.role}</span>
                </div>

                {/* 🔥 탭 시스템 */}
                <CharacterTabs
                    character={character}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />
            </div>
        </div>
    );
}