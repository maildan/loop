'use client';

// 🔥 기가차드 캐릭터 뷰 - 상세 정보 확장 및 정보 과부하 방지

import React, { useState } from 'react';
import { ProjectCharacter } from '../../../../shared/types';
import { Plus, Edit3, Save, X as XIcon, Users, Heart, BookOpen, User, Briefcase, Home, MapPin, Calendar, Palette, Trash2 } from 'lucide-react';
import { Logger } from '../../../../shared/logger';
import { ConfirmDialog } from '../components/ConfirmDialog'; // 🔥 ConfirmDialog 추가

interface CharactersViewProps {
  projectId: string;
  characters: ProjectCharacter[];
  onCharactersChange: (characters: ProjectCharacter[]) => void;
  focusMode?: boolean;  // 🔥 Focus Mode 지원
}

// 🔥 기가차드 캐릭터 스타일 - 카드 기반 레이아웃
const CHARACTERS_STYLES = {
  container: 'flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',

  // 🔥 개선된 헤더
  header: 'p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700/50',
  headerTop: 'flex items-center justify-between mb-4',
  title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
  subtitle: 'text-slate-600 dark:text-gray-400 leading-relaxed',

  // 🔥 통계 카드
  statsGrid: 'grid grid-cols-3 gap-4 mt-4',
  statCard: 'p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700',
  statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mb-2',
  statValue: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  statLabel: 'text-xs text-slate-600 dark:text-gray-400',

  // 🔥 콘텐츠 영역
  content: 'flex-1 flex flex-col min-h-0',
  scrollArea: 'flex-1 overflow-y-auto',
  contentPadding: 'p-6',

  // 🔥 캐릭터 그리드
  characterGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',

  // 🔥 캐릭터 카드 - 확장 가능
  characterCard: 'group bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden',
  characterHeader: 'p-4 border-b border-slate-100 dark:border-gray-700',
  characterAvatar: 'w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-3',
  characterName: 'font-bold text-lg text-gray-900 dark:text-gray-100 mb-1',
  characterRole: 'text-sm text-blue-600 dark:text-blue-400 font-medium',

  // 🔥 탭 시스템
  tabContainer: 'flex border-b border-slate-100 dark:border-gray-700',
  tab: 'px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors',
  tabActive: 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400',

  // 🔥 탭 콘텐츠
  tabContent: 'p-4 space-y-3',
  fieldGroup: 'space-y-2',
  fieldLabel: 'text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wide',
  fieldValue: 'text-sm text-gray-700 dark:text-gray-300 leading-relaxed',
  fieldEmpty: 'text-xs text-slate-400 dark:text-gray-500 italic',

  // 🔥 액션 버튼
  actionButtons: 'absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
  editButton: 'p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer',
  deleteButton: 'p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer',

  // 🔥 추가 버튼
  addButton: 'group relative flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-gray-800 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer',
  addButtonIcon: 'w-8 h-8 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors group-hover:scale-110 transform',
  addButtonText: 'text-base font-medium text-slate-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',

  // 🔥 편집 모달 오버레이
  modalOverlay: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4',
  modal: 'bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden',
  modalHeader: 'p-6 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between',
  modalTitle: 'text-xl font-bold text-gray-900 dark:text-gray-100',
  modalBody: 'p-6 overflow-y-auto max-h-[60vh]',
  modalFooter: 'p-6 border-t border-slate-200 dark:border-gray-700 flex gap-3 justify-end',

  // 🔥 폼 필드
  formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  formField: 'space-y-2',
  formLabel: 'text-sm font-medium text-gray-700 dark:text-gray-300',
  formInput: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
  formTextarea: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',

  // 🔥 버튼
  button: 'px-4 py-2 rounded-lg font-medium transition-colors',
  buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
  buttonSecondary: 'bg-slate-200 hover:bg-slate-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200',

  // 🔥 빈 상태
  emptyState: 'flex flex-col items-center justify-center h-64 text-center',
  emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
  emptyTitle: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
  emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed',
} as const;

// 🔥 탭 정의
const CHARACTER_TABS = [
  { id: 'basic', label: '기본', icon: User },
  { id: 'details', label: '상세', icon: BookOpen },
  { id: 'story', label: '스토리', icon: Heart },
] as const;

export function CharactersView({
  projectId,
  characters,
  onCharactersChange,
  focusMode = false
}: CharactersViewProps): React.ReactElement {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [editingCharacter, setEditingCharacter] = useState<ProjectCharacter | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectCharacter>>({});

  // 🔥 삭제 관련 상태
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [characterToDelete, setCharacterToDelete] = useState<{ id: string; name: string } | null>(null);

  // 🔥 통계 계산
  const stats = {
    total: characters.length,
    main: characters.filter(c => c.role?.includes('주인공') || c.role?.includes('주연')).length,
    detailed: characters.filter(c => c.appearance && c.personality && c.background).length,
  };

  const handleAddCharacter = async (): Promise<void> => {
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

  const handleEditSave = async (): Promise<void> => {
    if (!editingCharacter || !editForm.name?.trim()) return;

    try {
      const characterToSave = {
        ...editForm,
        id: editingCharacter.id,
        projectId,
        updatedAt: new Date()
      } as ProjectCharacter;

      const result = await window.electronAPI.projects.upsertCharacter(characterToSave);

      if (result.success && result.data) {
        const updatedCharacters = editingCharacter.id === editForm.id
          ? characters.map(char => char.id === editingCharacter.id ? result.data! : char)
          : [...characters, result.data];

        onCharactersChange(updatedCharacters);
        setEditingCharacter(null);
        setEditForm({});
        Logger.info('CHARACTERS_VIEW', 'Character saved', { id: result.data.id });
      }
    } catch (error) {
      Logger.error('CHARACTERS_VIEW', 'Failed to save character', error);
      alert('캐릭터 저장에 실패했습니다.');
    }
  };

  const handleEditCancel = (): void => {
    setEditingCharacter(null);
    setEditForm({});
  };

  const handleDelete = (id: string, name: string): void => {
    setCharacterToDelete({ id, name });
    setShowDeleteDialog(true);
    Logger.info('CHARACTERS_VIEW', 'Delete dialog opened', { id, name });
  };

  // 🔥 삭제 확인 핸들러
  const handleConfirmDelete = (): void => {
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

  // 🔥 삭제 취소 핸들러
  const handleCancelDelete = (): void => {
    setShowDeleteDialog(false);
    setCharacterToDelete(null);
  };

  const getTabForCharacter = (characterId: string): string => {
    return activeTab[characterId] || 'basic';
  };

  const setTabForCharacter = (characterId: string, tab: string): void => {
    setActiveTab(prev => ({ ...prev, [characterId]: tab }));
  };

  const renderTabContent = (character: ProjectCharacter, tab: string) => {
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
        <div className={CHARACTERS_STYLES.statsGrid}>
          <div className={CHARACTERS_STYLES.statCard}>
            <Users className={CHARACTERS_STYLES.statIcon} />
            <div className={CHARACTERS_STYLES.statValue}>{stats.total}</div>
            <div className={CHARACTERS_STYLES.statLabel}>총 인물</div>
          </div>
          <div className={CHARACTERS_STYLES.statCard}>
            <BookOpen className={CHARACTERS_STYLES.statIcon} />
            <div className={CHARACTERS_STYLES.statValue}>{stats.main}</div>
            <div className={CHARACTERS_STYLES.statLabel}>주요 인물</div>
          </div>
          <div className={CHARACTERS_STYLES.statCard}>
            <Heart className={CHARACTERS_STYLES.statIcon} />
            <div className={CHARACTERS_STYLES.statValue}>{stats.detailed}</div>
            <div className={CHARACTERS_STYLES.statLabel}>상세 설정</div>
          </div>
        </div>
      </div>

      {/* 🔥 캐릭터 목록 */}
      <div className={CHARACTERS_STYLES.content}>
        <div className={CHARACTERS_STYLES.scrollArea}>
          <div className={CHARACTERS_STYLES.contentPadding}>
            {characters.length === 0 ? (
              // 빈 상태
              <div className={CHARACTERS_STYLES.emptyState}>
                <Users className={CHARACTERS_STYLES.emptyIcon} />
                <h2 className={CHARACTERS_STYLES.emptyTitle}>첫 번째 인물을 만들어보세요</h2>
                <p className={CHARACTERS_STYLES.emptyDescription}>
                  매력적인 캐릭터들이 당신의 이야기를 더욱 생동감 있게 만들어줄 것입니다.
                  주인공부터 조연까지, 각자의 특별한 이야기를 담아보세요.
                </p>
                <button
                  onClick={handleAddCharacter}
                  className={`${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary} mt-6`}
                >
                  첫 인물 만들기
                </button>
              </div>
            ) : (
              <div className={CHARACTERS_STYLES.characterGrid}>
                {characters.map((character) => {
                  const currentTab = getTabForCharacter(character.id);

                  // 🔥 편집 핸들러
                  const handleCharacterClick = () => {
                    handleEditStart(character);
                  };

                  const handleCharacterDoubleClick = () => {
                    handleEditStart(character);
                    Logger.info('CHARACTERS_VIEW', '더블클릭으로 편집 모드 활성화', { name: character.name });
                  };

                  // 🔥 Long press 핸들러 - 간단한 타이머 방식
                  let pressTimer: NodeJS.Timeout | null = null;
                  const handleMouseDown = () => {
                    pressTimer = setTimeout(() => {
                      handleEditStart(character);
                      Logger.info('CHARACTERS_VIEW', 'Long press detected - entering edit mode', { name: character.name });
                    }, 500);
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
                      key={character.id}
                      className={`${CHARACTERS_STYLES.characterCard} ${focusMode && selectedCharacterId !== character.id
                          ? 'opacity-30 blur-[1px] scale-95 transition-all duration-300'
                          : 'opacity-100 blur-0 scale-100 transition-all duration-300'
                        }`}
                      onClick={handleCharacterClick}
                      onDoubleClick={handleCharacterDoubleClick}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave} // 🔥 Long press 이벤트 적용
                      onMouseEnter={() => focusMode && setSelectedCharacterId(character.id)}
                    >
                      <div className="relative">
                        {/* 🔥 액션 버튼들 */}
                        <div className={CHARACTERS_STYLES.actionButtons}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStart(character);
                            }}
                            className={CHARACTERS_STYLES.editButton}
                            title="편집"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(character.id, character.name);
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
                        <div className={CHARACTERS_STYLES.tabContainer}>
                          {CHARACTER_TABS.map(({ id, label, icon: Icon }) => (
                            <button
                              key={id}
                              onClick={() => setTabForCharacter(character.id, id)}
                              className={`${CHARACTERS_STYLES.tab} ${currentTab === id ? CHARACTERS_STYLES.tabActive : ''
                                }`}
                            >
                              <Icon className="w-4 h-4 mr-1" />
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* 🔥 탭 콘텐츠 */}
                        {renderTabContent(character, currentTab)}
                      </div>
                    </div>
                  );
                })}

                {/* 🔥 추가 버튼 */}
                <button
                  onClick={handleAddCharacter}
                  className={CHARACTERS_STYLES.addButton}
                >
                  <Plus className={CHARACTERS_STYLES.addButtonIcon} />
                  <span className={CHARACTERS_STYLES.addButtonText}>새 인물 추가</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 편집 모달 */}
      {editingCharacter && (
        <div className={CHARACTERS_STYLES.modalOverlay} onClick={handleEditCancel}>
          <div className={CHARACTERS_STYLES.modal} onClick={(e) => e.stopPropagation()}>
            <div className={CHARACTERS_STYLES.modalHeader}>
              <h2 className={CHARACTERS_STYLES.modalTitle}>
                {editingCharacter.id === editForm.id ? '캐릭터 편집' : '새 캐릭터'}
              </h2>
              <button onClick={handleEditCancel}>
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
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className={CHARACTERS_STYLES.formInput}
                    placeholder="캐릭터 이름"
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>역할</label>
                  <input
                    type="text"
                    value={editForm.role || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className={CHARACTERS_STYLES.formInput}
                    placeholder="주인공, 조연, 악역 등"
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>나이</label>
                  <input
                    type="text"
                    value={editForm.age || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                    className={CHARACTERS_STYLES.formInput}
                    placeholder="나이 또는 연령대"
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>직업</label>
                  <input
                    type="text"
                    value={editForm.occupation || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, occupation: e.target.value }))}
                    className={CHARACTERS_STYLES.formInput}
                    placeholder="직업이나 역할"
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>출신</label>
                  <input
                    type="text"
                    value={editForm.birthplace || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, birthplace: e.target.value }))}
                    className={CHARACTERS_STYLES.formInput}
                    placeholder="출생지"
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>거주지</label>
                  <input
                    type="text"
                    value={editForm.residence || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, residence: e.target.value }))}
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
                    onChange={(e) => setEditForm(prev => ({ ...prev, appearance: e.target.value }))}
                    className={CHARACTERS_STYLES.formTextarea}
                    placeholder="키, 몸무게, 헤어스타일, 특징 등"
                    rows={3}
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>성격</label>
                  <textarea
                    value={editForm.personality || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, personality: e.target.value }))}
                    className={CHARACTERS_STYLES.formTextarea}
                    placeholder="성격적 특징, 말투, 습관 등"
                    rows={3}
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>가족</label>
                  <textarea
                    value={editForm.family || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, family: e.target.value }))}
                    className={CHARACTERS_STYLES.formTextarea}
                    placeholder="가족 구성원과 관계"
                    rows={2}
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>배경</label>
                  <textarea
                    value={editForm.background || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, background: e.target.value }))}
                    className={CHARACTERS_STYLES.formTextarea}
                    placeholder="과거 경험, 중요한 사건 등"
                    rows={3}
                  />
                </div>

                <div className={CHARACTERS_STYLES.formField}>
                  <label className={CHARACTERS_STYLES.formLabel}>설명</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className={CHARACTERS_STYLES.formTextarea}
                    placeholder="캐릭터에 대한 전반적인 설명"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className={CHARACTERS_STYLES.modalFooter}>
              <button
                onClick={handleEditCancel}
                className={`${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonSecondary}`}
              >
                취소
              </button>
              <button
                onClick={handleEditSave}
                className={`${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary}`}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

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
}
