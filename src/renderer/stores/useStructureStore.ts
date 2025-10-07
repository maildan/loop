// 🔥 스토리 구조 글로벌 스토어 - Zustand + 지속성

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProjectStructure } from '../../shared/types';
import { Logger } from '../../shared/logger';

interface StructureStore {
    structures: Record<string, ProjectStructure[]>; // projectId를 키로 하는 구조들
    currentEditor: {
        projectId: string;
        editorType: 'chapter' | 'synopsis' | 'idea' | 'notes' | 'characters' | 'structure';
        itemId?: string;
        itemTitle?: string;
    } | null;

    // 🔥 액션들
    setStructures: (projectId: string, structures: ProjectStructure[]) => void;
    loadStructuresFromDB: (projectId: string) => Promise<void>; // 🔥 새로 추가: DB에서 구조 로드
    addStructureItem: (projectId: string, item: ProjectStructure) => Promise<void>;
    updateStructureItem: (projectId: string, itemId: string, updates: Partial<ProjectStructure>) => Promise<void>;
    deleteStructureItem: (projectId: string, itemId: string) => Promise<void>;
    reorderStructures: (projectId: string, newOrder: ProjectStructure[]) => void;

    // 🔥 에디터 상태 관리
    setCurrentEditor: (editor: StructureStore['currentEditor']) => void;
    clearCurrentEditor: () => void;
}

export const useStructureStore = create<StructureStore>()(
    persist(
        (set, get) => ({
            structures: {},
            currentEditor: null,

            // 🔥 구조 설정
            setStructures: (projectId, structures) =>
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: structures,
                    },
                })),

            // 🔥 DB에서 구조 데이터 로드
            loadStructuresFromDB: async (projectId) => {
                try {
                    Logger.debug('STRUCTURE_STORE', 'loadStructuresFromDB called', { projectId });

                    if (!window.electronAPI?.projects?.getStructure) {
                        Logger.warn('STRUCTURE_STORE', 'electronAPI.projects.getStructure not available');
                        return;
                    }

                    const result = await window.electronAPI.projects.getStructure(projectId);

                    if (result.success && result.data) {
                        Logger.debug('STRUCTURE_STORE', 'Loaded structures from DB', {
                            projectId,
                            count: result.data.length,
                            structures: result.data.map(s => ({
                                id: s.id,
                                title: s.title,
                                type: s.type,
                                content: s.content ? `${s.content.substring(0, 50)}...` : 'EMPTY',
                                contentLength: s.content?.length || 0
                            }))
                        });

                        // DB 데이터로 상태 업데이트
                        set((state) => ({
                            structures: {
                                ...state.structures,
                                [projectId]: result.data || [],
                            },
                        }));

                        Logger.info('STRUCTURE_STORE', `✅ Loaded ${result.data.length} structures from DB`, { projectId });
                    } else {
                        Logger.debug('STRUCTURE_STORE', 'No structures found in DB or failed to load', { error: result.error });
                        Logger.warn('STRUCTURE_STORE', 'Failed to load structures from DB', { projectId, error: result.error });
                    }
                } catch (error) {
                    Logger.error('STRUCTURE_STORE', 'Error loading structures from DB', error);
                    Logger.error('STRUCTURE_STORE', 'Error loading structures from DB', error);
                }
            },

            // 🔥 구조 아이템 추가 (DB 저장 포함)
            addStructureItem: async (projectId, item) => {
                Logger.debug('STRUCTURE_STORE', 'addStructureItem called', {
                    projectId,
                    itemId: item.id,
                    itemType: item.type,
                    itemTitle: item.title,
                    currentStructuresCount: get().structures[projectId]?.length || 0
                });

                // 1. UI에 즉시 반영 (Optimistic Update)
                const previousState = get().structures[projectId] || [];
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: [...(state.structures[projectId] || []), item],
                    },
                }));

                Logger.debug('STRUCTURE_STORE', 'UI updated, new count',
                    get().structures[projectId]?.length || 0
                );

                // 2. DB에 저장 요청
                try {
                    // 🔥 electronAPI 존재 확인
                    Logger.debug('STRUCTURE_STORE', 'Checking electronAPI', {
                        hasWindow: typeof window !== 'undefined',
                        hasElectronAPI: typeof window !== 'undefined' && !!window.electronAPI,
                        hasProjects: typeof window !== 'undefined' && !!window.electronAPI?.projects,
                        hasUpsertStructure: typeof window !== 'undefined' && !!window.electronAPI?.projects?.upsertStructure
                    });

                    if (!window.electronAPI?.projects?.upsertStructure) {
                        throw new Error('electronAPI.projects.upsertStructure is not available');
                    }

                    await window.electronAPI.projects.upsertStructure(item);
                    Logger.info('STRUCTURE_STORE', 'Item saved to DB successfully', { itemId: item.id });
                } catch (error) {
                    Logger.error('STRUCTURE_STORE', 'Failed to save to DB', error);
                    // TODO: 실패 시 UI 롤백 로직 추가
                }
            },

            // 🔥 구조 아이템 업데이트 (DB 저장 포함)
            updateStructureItem: async (projectId, itemId, updates) => {
                Logger.debug('STRUCTURE_STORE', 'updateStructureItem called', {
                    projectId,
                    itemId,
                    updates: Object.keys(updates),
                    currentItem: get().structures[projectId]?.find(item => item.id === itemId)?.title
                });

                let updatedItem: ProjectStructure | null = null;

                // 1. UI에 즉시 반영
                set((state) => {
                    const newStructures = (state.structures[projectId] || []).map((item) => {
                        if (item.id === itemId) {
                            updatedItem = { ...item, ...updates, updatedAt: new Date() };
                            return updatedItem;
                        }
                        return item;
                    });
                    return {
                        structures: { ...state.structures, [projectId]: newStructures },
                    };
                });

                Logger.debug('STRUCTURE_STORE', 'UI updated for item', { itemId });

                // 2. DB에 저장 요청
                if (updatedItem) {
                    try {
                        await window.electronAPI.projects.upsertStructure(updatedItem);
                        Logger.info('STRUCTURE_STORE', 'Item updated in DB successfully', { itemId });
                    } catch (error) {
                        Logger.error('STRUCTURE_STORE', 'Failed to update in DB', error);
                        // TODO: 실패 시 UI 롤백 로직 추가
                    }
                } else {
                    // 아이템이 이미 삭제되었거나 존재하지 않음 (race condition)
                    Logger.debug('STRUCTURE_STORE', 'No item found to update (possibly deleted)', { itemId, projectId });
                    return; // DB 업데이트 시도하지 않음
                }
            },

            // 🔥 구조 아이템 삭제 (DB 삭제 포함)
            deleteStructureItem: async (projectId, itemId) => {
                // 1. UI에 즉시 반영
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: (state.structures[projectId] || []).filter((item) => item.id !== itemId),
                    },
                }));

                // 2. DB에서 삭제 요청
                try {
                    await window.electronAPI.projects.deleteStructure(itemId);
                    Logger.info('STRUCTURE_STORE', 'Structure item deleted from DB', { itemId });
                } catch (error) {
                    Logger.error('STRUCTURE_STORE', 'Failed to delete structure item from DB', error);
                    // TODO: 실패 시 UI 롤백 로직 추가
                }
            },

            // 🔥 구조 순서 변경
            reorderStructures: (projectId, newOrder) =>
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: newOrder,
                    },
                })),

            // 🔥 현재 에디터 설정
            setCurrentEditor: (editor) =>
                set({ currentEditor: editor }),

            // 🔥 현재 에디터 초기화
            clearCurrentEditor: () =>
                set({ currentEditor: null }),
        }),
        {
            name: 'loop-structure-store', // localStorage 키
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                structures: state.structures,
                currentEditor: state.currentEditor,
            }),
        }
    )
);

export default useStructureStore;
