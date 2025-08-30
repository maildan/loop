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
    addStructureItem: (projectId: string, item: ProjectStructure) => void;
    updateStructureItem: (projectId: string, itemId: string, updates: Partial<ProjectStructure>) => void;
    deleteStructureItem: (projectId: string, itemId: string) => void;
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

            // 🔥 구조 아이템 추가
            addStructureItem: (projectId, item) =>
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: [...(state.structures[projectId] || []), item],
                    },
                })),

            // 🔥 구조 아이템 업데이트
            updateStructureItem: (projectId, itemId, updates) =>
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: (state.structures[projectId] || []).map((item) =>
                            item.id === itemId ? { ...item, ...updates, updatedAt: new Date() } : item
                        ),
                    },
                })),

            // 🔥 구조 아이템 삭제
            deleteStructureItem: (projectId, itemId) =>
                set((state) => ({
                    structures: {
                        ...state.structures,
                        [projectId]: (state.structures[projectId] || []).filter((item) => item.id !== itemId),
                    },
                })),

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
