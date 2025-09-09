module.exports = {

"[project]/src/renderer/stores/useStructureStore.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 스토리 구조 글로벌 스토어 - Zustand + 지속성
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useStructureStore": (()=>useStructureStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
;
;
;
const useStructureStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        structures: {},
        currentEditor: null,
        // 🔥 구조 설정
        setStructures: (projectId, structures)=>set((state)=>({
                    structures: {
                        ...state.structures,
                        [projectId]: structures
                    }
                })),
        // 🔥 DB에서 구조 데이터 로드
        loadStructuresFromDB: async (projectId)=>{
            try {
                console.log('🔍 [useStructureStore] loadStructuresFromDB called:', {
                    projectId
                });
                if (!window.electronAPI?.projects?.getStructure) {
                    console.warn('⚠️ [useStructureStore] electronAPI.projects.getStructure not available');
                    return;
                }
                const result = await window.electronAPI.projects.getStructure(projectId);
                if (result.success && result.data) {
                    console.log('📊 [useStructureStore] Loaded structures from DB:', {
                        projectId,
                        count: result.data.length,
                        structures: result.data.map((s)=>({
                                id: s.id,
                                title: s.title,
                                type: s.type,
                                content: s.content ? `${s.content.substring(0, 50)}...` : 'EMPTY',
                                contentLength: s.content?.length || 0
                            }))
                    });
                    // DB 데이터로 상태 업데이트
                    set((state)=>({
                            structures: {
                                ...state.structures,
                                [projectId]: result.data || []
                            }
                        }));
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_STORE', `✅ Loaded ${result.data.length} structures from DB`, {
                        projectId
                    });
                } else {
                    console.log('📭 [useStructureStore] No structures found in DB or failed to load:', result.error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('STRUCTURE_STORE', 'Failed to load structures from DB', {
                        projectId,
                        error: result.error
                    });
                }
            } catch (error) {
                console.error('❌ [useStructureStore] Error loading structures from DB:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_STORE', 'Error loading structures from DB', error);
            }
        },
        // 🔥 구조 아이템 추가 (DB 저장 포함)
        addStructureItem: async (projectId, item)=>{
            console.log('🚀 [useStructureStore] addStructureItem called:', {
                projectId,
                itemId: item.id,
                itemType: item.type,
                itemTitle: item.title,
                currentStructuresCount: get().structures[projectId]?.length || 0
            });
            // 1. UI에 즉시 반영 (Optimistic Update)
            const previousState = get().structures[projectId] || [];
            set((state)=>({
                    structures: {
                        ...state.structures,
                        [projectId]: [
                            ...state.structures[projectId] || [],
                            item
                        ]
                    }
                }));
            console.log('✅ [useStructureStore] UI updated, new count:', get().structures[projectId]?.length || 0);
            // 2. DB에 저장 요청
            try {
                // 🔥 electronAPI 존재 확인
                console.log('🔍 [useStructureStore] Checking electronAPI:', {
                    hasWindow: "undefined" !== 'undefined',
                    hasElectronAPI: "undefined" !== 'undefined' && !!window.electronAPI,
                    hasProjects: "undefined" !== 'undefined' && !!window.electronAPI?.projects,
                    hasUpsertStructure: "undefined" !== 'undefined' && !!window.electronAPI?.projects?.upsertStructure
                });
                if (!window.electronAPI?.projects?.upsertStructure) {
                    throw new Error('electronAPI.projects.upsertStructure is not available');
                }
                await window.electronAPI.projects.upsertStructure(item);
                console.log('💾 [useStructureStore] Item saved to DB successfully:', item.id);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_STORE', 'Structure item saved to DB', {
                    itemId: item.id
                });
            } catch (error) {
                console.error('❌ [useStructureStore] Failed to save to DB:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_STORE', 'Failed to save structure item to DB', error);
            // TODO: 실패 시 UI 롤백 로직 추가
            }
        },
        // 🔥 구조 아이템 업데이트 (DB 저장 포함)
        updateStructureItem: async (projectId, itemId, updates)=>{
            console.log('🔄 [useStructureStore] updateStructureItem called:', {
                projectId,
                itemId,
                updates: Object.keys(updates),
                currentItem: get().structures[projectId]?.find((item)=>item.id === itemId)?.title
            });
            let updatedItem = null;
            // 1. UI에 즉시 반영
            set((state)=>{
                const newStructures = (state.structures[projectId] || []).map((item)=>{
                    if (item.id === itemId) {
                        updatedItem = {
                            ...item,
                            ...updates,
                            updatedAt: new Date()
                        };
                        return updatedItem;
                    }
                    return item;
                });
                return {
                    structures: {
                        ...state.structures,
                        [projectId]: newStructures
                    }
                };
            });
            console.log('✅ [useStructureStore] UI updated for item:', itemId);
            // 2. DB에 저장 요청
            if (updatedItem) {
                try {
                    await window.electronAPI.projects.upsertStructure(updatedItem);
                    console.log('💾 [useStructureStore] Item updated in DB successfully:', itemId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_STORE', 'Structure item updated in DB', {
                        itemId
                    });
                } catch (error) {
                    console.error('❌ [useStructureStore] Failed to update in DB:', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_STORE', 'Failed to update structure item in DB', error);
                // TODO: 실패 시 UI 롤백 로직 추가
                }
            } else {
                console.warn('⚠️ [useStructureStore] No item found to update:', itemId);
            }
        },
        // 🔥 구조 아이템 삭제 (DB 삭제 포함)
        deleteStructureItem: async (projectId, itemId)=>{
            // 1. UI에 즉시 반영
            set((state)=>({
                    structures: {
                        ...state.structures,
                        [projectId]: (state.structures[projectId] || []).filter((item)=>item.id !== itemId)
                    }
                }));
            // 2. DB에서 삭제 요청
            try {
                await window.electronAPI.projects.deleteStructure(itemId);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_STORE', 'Structure item deleted from DB', {
                    itemId
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_STORE', 'Failed to delete structure item from DB', error);
            // TODO: 실패 시 UI 롤백 로직 추가
            }
        },
        // 🔥 구조 순서 변경
        reorderStructures: (projectId, newOrder)=>set((state)=>({
                    structures: {
                        ...state.structures,
                        [projectId]: newOrder
                    }
                })),
        // 🔥 현재 에디터 설정
        setCurrentEditor: (editor)=>set({
                currentEditor: editor
            }),
        // 🔥 현재 에디터 초기화
        clearCurrentEditor: ()=>set({
                currentEditor: null
            })
    }), {
    name: 'loop-structure-store',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            structures: state.structures,
            currentEditor: state.currentEditor
        })
}));
const __TURBOPACK__default__export__ = useStructureStore;
}}),
"[project]/src/renderer/hooks/useProjectData.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * 🔥 GIGA-CHAD useProjectData Hook
 * 프로젝트의 모든 요소를 통합하여 에이전트화된 SynopsisView에 제공
 */ __turbopack_context__.s({
    "useIntegratedProjectData": (()=>useIntegratedProjectData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
;
;
;
function useIntegratedProjectData(projectId) {
    const structures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((s)=>s.structures);
    const [elements, setElements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // 🔥 디버깅 로그 추가
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log('🔍 [useIntegratedProjectData] Debug Info:', {
            projectId,
            structures,
            hasProjectData: !!structures[projectId],
            projectItems: structures[projectId]?.length || 0,
            allProjects: Object.keys(structures)
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('INTEGRATED_PROJECT_DATA', 'Debug info', {
            projectId,
            structureKeys: Object.keys(structures),
            hasProjectData: !!structures[projectId],
            itemCount: structures[projectId]?.length || 0
        });
    }, [
        projectId,
        structures
    ]);
    // 프로젝트 요소들을 통합 데이터 형태로 변환
    const processStructureItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        console.log('🔄 [processStructureItems] Starting processing for projectId:', projectId);
        if (!projectId || !structures[projectId]) {
            console.log('❌ [processStructureItems] No data found:', {
                hasProjectId: !!projectId,
                hasStructureData: !!structures[projectId],
                availableProjects: Object.keys(structures)
            });
            // 🔥 임시 mock 데이터 생성 (데이터가 없을 때)
            return [
                {
                    id: 'mock-chapter-1',
                    type: 'chapter',
                    title: '첫 번째 챕터',
                    content: '이것은 샘플 챕터 내용입니다.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    order: 1,
                    wordCount: 10,
                    plotRelevance: 4
                },
                {
                    id: 'mock-character-1',
                    type: 'character',
                    title: '주인공',
                    content: '주인공 설명',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    order: 1,
                    wordCount: 3,
                    plotRelevance: 5,
                    characterTraits: [
                        '용감함',
                        '지혜로움'
                    ]
                }
            ];
        }
        const items = structures[projectId] || [];
        console.log('📊 [processStructureItems] Found items:', items.length);
        const processedElements = [];
        items.forEach((item, index)=>{
            console.log(`📝 [processStructureItems] Processing item ${index + 1}:`, {
                id: item.id,
                type: item.type,
                title: item.title,
                hasContent: !!item.content
            });
            let content = '';
            try {
                content = typeof item.content === 'string' ? item.content : JSON.stringify(item.content);
            } catch (e) {
                console.warn(`⚠️ [processStructureItems] Failed to parse content for item ${item.id}:`, e);
                content = String(item.content || '');
            }
            const element = {
                id: item.id,
                type: item.type,
                title: item.title,
                content,
                createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
                order: item.order,
                wordCount: (content || '').split(/\s+/).filter((word)=>word.trim().length > 0).length,
                plotRelevance: Math.floor(Math.random() * 5) + 1
            };
            // 타입별 특수 처리
            if (item.type === 'character') {
                try {
                    const parsed = JSON.parse(content);
                    element.characterTraits = parsed.traits || [];
                } catch (e) {
                    element.characterTraits = [];
                }
            }
            if (item.type === 'chapter') {
                element.location = '미정'; // TODO: 내용에서 추출
            }
            if ([
                'memo',
                'idea'
            ].includes(item.type)) {
                element.tags = [
                    'general'
                ]; // TODO: 내용에서 태그 추출
            }
            processedElements.push(element);
        });
        const result = processedElements.sort((a, b)=>(a.order || 0) - (b.order || 0));
        console.log('✅ [processStructureItems] Processing completed:', {
            inputItemsCount: items.length,
            processedElementsCount: result.length,
            elementTypes: result.reduce((acc, el)=>{
                acc[el.type] = (acc[el.type] || 0) + 1;
                return acc;
            }, {})
        });
        return result;
    }, [
        structures,
        projectId
    ]);
    // AI 분석 수행 (시뮬레이션)
    const performAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        console.log('🧠 [performAnalysis] Starting analysis with elements:', processStructureItems.length);
        if (processStructureItems.length === 0) {
            console.log('❌ [performAnalysis] No elements to analyze');
            return null;
        }
        const chapters = processStructureItems.filter((e)=>e.type === 'chapter');
        const characters = processStructureItems.filter((e)=>e.type === 'character');
        const memos = processStructureItems.filter((e)=>e.type === 'memo');
        const ideas = processStructureItems.filter((e)=>e.type === 'idea');
        const totalWords = chapters.reduce((sum, ch)=>sum + (ch.wordCount || 0), 0);
        // 타임라인 생성 (시간순 정렬)
        const timeline = processStructureItems.map((element)=>({
                id: element.id,
                title: element.title,
                type: element.type,
                timestamp: element.createdAt?.toISOString() || new Date().toISOString(),
                description: element.content.slice(0, 100) + '...'
            })).sort((a, b)=>new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        // 관계성 분석 (간단한 시뮬레이션)
        const relationships = [];
        for (const character of characters){
            for (const chapter of chapters){
                if (chapter.content.toLowerCase().includes(character.title.toLowerCase())) {
                    relationships.push({
                        from: character.id,
                        to: chapter.id,
                        type: 'appears_in',
                        strength: 0.8
                    });
                }
            }
        }
        const analysis = {
            totalWords,
            totalChapters: chapters.length,
            totalCharacters: characters.length,
            totalMemos: memos.length,
            totalIdeas: ideas.length,
            // 임시 AI 분석 결과
            storyConsistency: Math.floor(Math.random() * 30) + 70,
            characterConsistency: Math.floor(Math.random() * 40) + 60,
            plotHoles: [
                '3장에서 언급된 마법 시스템이 7장에서 다르게 작동함',
                '주인공의 나이가 일관되지 않음',
                '2장의 시간 설정과 4장이 모순됨'
            ].slice(0, Math.floor(Math.random() * 4)),
            suggestions: [
                '캐릭터 간의 대화가 더 자연스러워야 함',
                '액션 시퀀스에 더 많은 디테일 필요',
                '배경 설명을 점진적으로 공개하는 것이 좋겠음',
                '갈등의 해결이 너무 급작스러움'
            ].slice(0, Math.floor(Math.random() * 5)),
            timeline,
            relationships
        };
        return analysis;
    }, [
        processStructureItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLoading(true);
        console.log('🔄 [useProjectData] useEffect triggered:', {
            elementsCount: processStructureItems.length,
            hasAnalysis: !!performAnalysis,
            projectId
        });
        // 실제 데이터 사용 (mock 데이터 완전 제거)
        console.log('📊 [useProjectData] Using real data from store');
        setElements(processStructureItems);
        setAnalysis(performAnalysis);
        // 로딩 시뮬레이션
        setTimeout(()=>{
            setLoading(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('INTEGRATED_PROJECT_DATA', 'Data processing completed', {
                projectId,
                elementsCount: processStructureItems.length,
                hasAnalysis: !!performAnalysis
            });
        }, 500);
    }, [
        processStructureItems,
        performAnalysis,
        projectId
    ]);
    return {
        elements,
        analysis,
        loading,
        // 유틸리티 함수들
        getElementsByType: (type)=>elements.filter((e)=>e.type === type),
        getElementByTitle: (title)=>elements.find((e)=>e.title.toLowerCase().includes(title.toLowerCase())),
        getRelatedElements: (elementId)=>{
            if (!analysis) return [];
            return analysis.relationships.filter((r)=>r.from === elementId || r.to === elementId).map((r)=>r.from === elementId ? r.to : r.from).map((id)=>elements.find((e)=>e.id === id)).filter(Boolean);
        }
    };
}
}}),
"[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProjectPageClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ProjectEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/ProjectEditor.tsx [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ErrorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/ErrorBoundary.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function ProjectPageClient() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
    const openId = searchParams.get('open') || searchParams.get('id') || undefined;
    // 🔥 정적 루트(`/projects/new`)에서 쿼리로 열린 경우 처리
    const projectId = paramId === 'new' && openId ? openId : paramId || openId;
    // 🔥 파라미터 검증
    if (!projectId) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_PAGE', 'Missing project ID in route parameters');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-red-600 mb-4",
                        children: "오류"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: "프로젝트 ID가 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_PAGE', 'Loading project page', {
        projectId
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ErrorBoundary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProjectErrorBoundary"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProjectEditor"], {
            projectId: projectId
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_renderer_74ecde0d._.js.map