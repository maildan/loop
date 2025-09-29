import React from 'react';
import { User, BookOpen, Heart } from 'lucide-react';
import { ProjectCharacter } from '../../../../../shared/types';

interface CharacterTabsProps {
    character: ProjectCharacter;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const CHARACTER_TABS = [
    { id: 'basic', label: '기본', icon: User },
    { id: 'details', label: '상세', icon: BookOpen },
    { id: 'story', label: '스토리', icon: Heart },
] as const;

const CHARACTERS_STYLES = {
    tabHeader: 'flex space-x-1 bg-muted/60 p-1 rounded-lg border border-border/60',
    tabButton: (active: boolean) => `
        flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors border border-transparent
        ${active
            ? 'bg-card text-[hsl(var(--accent-primary))] shadow-sm border-[hsl(var(--accent))]/40'
            : 'text-muted-foreground hover:text-[hsl(var(--foreground))] hover:bg-muted/50'
        }
    `,
    tabIcon: 'w-4 h-4',
    tabContent: 'p-4 space-y-4',
    fieldGroup: 'space-y-2',
    fieldLabel: 'text-sm font-medium text-muted-foreground',
    fieldValue: 'text-sm text-[hsl(var(--foreground))] leading-relaxed',
    fieldEmpty: 'text-muted-foreground italic',
};

function TabContent({ character, tab }: { character: ProjectCharacter; tab: string }) {
    switch (tab) {
        case 'basic':
            return (
                <div className={CHARACTERS_STYLES.tabContent}>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>역할</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.role || <span className={CHARACTERS_STYLES.fieldEmpty}>역할을 설정해주세요</span>}
                        </div>
                    </div>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>설명</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.description || <span className={CHARACTERS_STYLES.fieldEmpty}>캐릭터 설명을 추가해주세요</span>}
                        </div>
                    </div>
                </div>
            );

        case 'details':
            return (
                <div className={CHARACTERS_STYLES.tabContent}>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>외모</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.appearance || <span className={CHARACTERS_STYLES.fieldEmpty}>외모를 기록해주세요</span>}
                        </div>
                    </div>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>나이</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.age || <span className={CHARACTERS_STYLES.fieldEmpty}>나이를 설정해주세요</span>}
                        </div>
                    </div>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>직업</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.occupation || <span className={CHARACTERS_STYLES.fieldEmpty}>직업을 기록해주세요</span>}
                        </div>
                    </div>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>출신 / 거주지</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.birthplace || character.residence ?
                                `${character.birthplace || '미기록'} / ${character.residence || '미기록'}` :
                                <span className={CHARACTERS_STYLES.fieldEmpty}>출신지와 거주지를 기록해주세요</span>
                            }
                        </div>
                    </div>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>가족</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.family || <span className={CHARACTERS_STYLES.fieldEmpty}>가족 관계를 기록해주세요</span>}
                        </div>
                    </div>
                </div>
            );

        case 'story':
            return (
                <div className={CHARACTERS_STYLES.tabContent}>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>성격</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.personality || <span className={CHARACTERS_STYLES.fieldEmpty}>성격을 기록해주세요</span>}
                        </div>
                    </div>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>배경</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.background || <span className={CHARACTERS_STYLES.fieldEmpty}>캐릭터 배경을 기록해주세요</span>}
                        </div>
                    </div>
                    <div className={CHARACTERS_STYLES.fieldGroup}>
                        <div className={CHARACTERS_STYLES.fieldLabel}>목표</div>
                        <div className={CHARACTERS_STYLES.fieldValue}>
                            {character.goals || <span className={CHARACTERS_STYLES.fieldEmpty}>캐릭터의 목표를 기록해주세요</span>}
                        </div>
                    </div>
                </div>
            );

        default:
            return null;
    }
}

export function CharacterTabs({ character, activeTab, onTabChange }: CharacterTabsProps) {
    return (
        <div>
            {/* 탭 헤더 */}
            <div className={CHARACTERS_STYLES.tabHeader}>
                {CHARACTER_TABS.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={CHARACTERS_STYLES.tabButton(isActive)}
                        >
                            <IconComponent className={CHARACTERS_STYLES.tabIcon} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 탭 콘텐츠 */}
            <TabContent character={character} tab={activeTab} />
        </div>
    );
}