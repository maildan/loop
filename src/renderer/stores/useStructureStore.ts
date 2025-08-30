// 🔥 스토리 구조 글로벌 스토어 - Zustand + 지속성

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProjectStructure } from '../../shared/types';

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

            // 🔥 구조 아이템 추가 (DB 저장 포함)
            addStructureItem: async (projectId, item) => {
                // 1. UI에 즉시 반영 (Optimistic Update)
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: [...(state.structures[projectId] || []), item],
                    },
                }));

                // 2. DB에 저장 요청
                try {
                    await window.electronAPI.projects.upsertStructure(item);
                    console.log('✅ Structure item saved to DB:', item.id);
                } catch (error) {
                    console.error('❌ Failed to save structure item to DB:', error);
                    // TODO: 실패 시 UI 롤백 로직 추가
                }
            },

            // 🔥 구조 아이템 업데이트 (DB 저장 포함)
            updateStructureItem: async (projectId, itemId, updates) => {
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

                // 2. DB에 저장 요청
                if (updatedItem) {
                    try {
                        await window.electronAPI.projects.upsertStructure(updatedItem);
                        console.log('✅ Structure item updated in DB:', itemId);
                    } catch (error) {
                        console.error('❌ Failed to update structure item in DB:', error);
                        // TODO: 실패 시 UI 롤백 로직 추가
                    }
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
                    console.log('✅ Structure item deleted from DB:', itemId);
                } catch (error) {
                    console.error('❌ Failed to delete structure item from DB:', error);
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
