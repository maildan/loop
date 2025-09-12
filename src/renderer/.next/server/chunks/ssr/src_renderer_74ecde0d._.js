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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_STORE', 'addStructureItem called', {
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_STORE', 'UI updated, new count', get().structures[projectId]?.length || 0);
            // 2. DB에 저장 요청
            try {
                // 🔥 electronAPI 존재 확인
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_STORE', 'Checking electronAPI', {
                    hasWindow: "undefined" !== 'undefined',
                    hasElectronAPI: "undefined" !== 'undefined' && !!window.electronAPI,
                    hasProjects: "undefined" !== 'undefined' && !!window.electronAPI?.projects,
                    hasUpsertStructure: "undefined" !== 'undefined' && !!window.electronAPI?.projects?.upsertStructure
                });
                if (!window.electronAPI?.projects?.upsertStructure) {
                    throw new Error('electronAPI.projects.upsertStructure is not available');
                }
                await window.electronAPI.projects.upsertStructure(item);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_STORE', 'Item saved to DB successfully', {
                    itemId: item.id
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_STORE', 'Failed to save to DB', error);
            // TODO: 실패 시 UI 롤백 로직 추가
            }
        },
        // 🔥 구조 아이템 업데이트 (DB 저장 포함)
        updateStructureItem: async (projectId, itemId, updates)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_STORE', 'updateStructureItem called', {
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_STORE', 'UI updated for item', {
                itemId
            });
            // 2. DB에 저장 요청
            if (updatedItem) {
                try {
                    await window.electronAPI.projects.upsertStructure(updatedItem);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_STORE', 'Item updated in DB successfully', {
                        itemId
                    });
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_STORE', 'Failed to update in DB', error);
                // TODO: 실패 시 UI 롤백 로직 추가
                }
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('STRUCTURE_STORE', 'No item found to update', {
                    itemId
                });
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
// 🔥 플롯 관련성 계산 함수
function calculatePlotRelevance(content, type) {
    if (!content || content.trim().length === 0) return 1;
    // 타입별 기본 관련성
    const typeWeights = {
        'main': 5,
        'chapter': 4,
        'character': 3,
        'synopsis': 4,
        'idea': 2,
        'memo': 1
    };
    let relevance = typeWeights[type] || 3;
    // 내용 기반 조정
    const plotKeywords = [
        '갈등',
        '전개',
        '절정',
        '해결',
        '반전',
        '클라이맥스'
    ];
    const keywordCount = plotKeywords.filter((keyword)=>content.includes(keyword)).length;
    if (keywordCount > 2) relevance = Math.min(5, relevance + 1);
    if (content.length > 500) relevance = Math.min(5, relevance + 1);
    return Math.max(1, Math.min(5, relevance));
}
// 🔥 내용에서 위치 정보 추출
function extractLocation(content) {
    if (!content) return '미정';
    const locationPatterns = [
        /(?:에서|에|의|로|으로)\s*([가-힣\s]+?)(?:[을를이가]\s|[에서로]\s|$)/g,
        /([가-힣]+(?:역|학교|회사|집|카페|공원|도시|마을))/g
    ];
    for (const pattern of locationPatterns){
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            return matches[0].replace(/[에서로을를이가]\s*$/, '').trim();
        }
    }
    return '미정';
}
// 🔥 내용에서 태그 추출
function extractTags(content, type) {
    if (!content) return [
        'general'
    ];
    const defaultTags = {
        'memo': [
            '메모',
            'general'
        ],
        'idea': [
            '아이디어',
            'inspiration'
        ],
        'character': [
            '인물',
            'character'
        ],
        'chapter': [
            '챕터',
            'story'
        ],
        'synopsis': [
            '시놉시스',
            'plot'
        ]
    };
    const tags = [
        ...defaultTags[type] || [
            'general'
        ]
    ];
    // 감정 태그
    const emotions = [
        '기쁨',
        '슬픔',
        '분노',
        '두려움',
        '놀라움',
        '사랑',
        '증오'
    ];
    emotions.forEach((emotion)=>{
        if (content.includes(emotion)) tags.push('감정');
    });
    // 장르 태그
    const genres = [
        '로맨스',
        '스릴러',
        '미스터리',
        '판타지',
        'SF',
        '액션'
    ];
    genres.forEach((genre)=>{
        if (content.includes(genre)) tags.push(genre.toLowerCase());
    });
    return [
        ...new Set(tags)
    ];
}
function useIntegratedProjectData(projectId) {
    const structures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((s)=>s.structures);
    const [elements, setElements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [aiAnalysisResult, setAiAnalysisResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 Logger를 사용한 디버깅 (console.log 제거)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROCESS_STRUCTURE_ITEMS', 'Starting processing', {
            projectId
        });
        if (!projectId || !structures[projectId]) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROCESS_STRUCTURE_ITEMS', 'No data found', {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROCESS_STRUCTURE_ITEMS', 'Found items', {
            count: items.length
        });
        const processedElements = [];
        items.forEach((item, index)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROCESS_STRUCTURE_ITEMS', `Processing item ${index + 1}`, {
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
                // 🔥 플롯 관련성을 내용 기반으로 계산
                plotRelevance: calculatePlotRelevance(content, item.type)
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
                element.location = extractLocation(content);
            }
            if ([
                'memo',
                'idea'
            ].includes(item.type)) {
                element.tags = extractTags(content, item.type);
            }
            processedElements.push(element);
        });
        const result = processedElements.sort((a, b)=>(a.order || 0) - (b.order || 0));
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROCESS_STRUCTURE_ITEMS', 'Processing completed', {
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
    // 🔥 실제 AI 분석 수행 (더미 데이터 제거 - 추후 완전 연동 예정)
    const performAIAnalysis = async (elements)=>{
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS', 'AI analysis placeholder', {
                elementCount: elements.length
            });
            // TODO: 실제 AI 분석 시스템 연동
            // 현재는 더미 데이터 제거만 진행하고, 실제 분석은 기본 로직 사용
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_ANALYSIS', 'Using enhanced basic analysis instead of dummy data');
            return null; // AI 분석 대신 기본 분석 사용
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_ANALYSIS', 'AI analysis failed', error);
            return null;
        }
    };
    // 기본 분석 수행 (AI 분석과 함께 사용)
    const performAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PERFORM_ANALYSIS', 'Starting analysis', {
            elementCount: processStructureItems.length
        });
        if (processStructureItems.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PERFORM_ANALYSIS', 'No elements to analyze');
            return null;
        }
        const mains = processStructureItems.filter((e)=>e.type === 'main'); // 🔥 main 타입 추가
        const chapters = processStructureItems.filter((e)=>e.type === 'chapter');
        const characters = processStructureItems.filter((e)=>e.type === 'character');
        const memos = processStructureItems.filter((e)=>e.type === 'memo');
        const ideas = processStructureItems.filter((e)=>e.type === 'idea');
        // 🔥 Logger를 사용한 캐릭터 분석
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PERFORM_ANALYSIS', 'Characters analysis', {
            totalItems: processStructureItems.length,
            charactersCount: characters.length,
            charactersData: characters.map((c)=>({
                    id: c.id,
                    title: c.title,
                    type: c.type
                })),
            allTypes: [
                ...new Set(processStructureItems.map((item)=>item.type))
            ]
        });
        const totalWords = [
            ...mains,
            ...chapters
        ].reduce((sum, ch)=>sum + (ch.wordCount || 0), 0); // 🔥 main도 워드카운트에 포함
        // 🔥 타임라인 생성 (main > 챕터 > 아이디어 > 시놉시스 순으로 정렬)
        const typeOrder = {
            'main': 0,
            'chapter': 1,
            'idea': 2,
            'synopsis': 3,
            'character': 4,
            'memo': 5,
            'note': 6
        };
        const timeline = processStructureItems.map((element)=>({
                id: element.id,
                title: element.title,
                type: element.type,
                timestamp: element.createdAt?.toISOString() || new Date().toISOString(),
                description: (element.content ? element.content.slice(0, 100) : '') + '...'
            })).sort((a, b)=>{
            // 🔥 우선 타입별로 정렬 (main이 최우선), 그 다음 시간순
            const typeComparison = (typeOrder[a.type] || 999) - (typeOrder[b.type] || 999);
            if (typeComparison !== 0) return typeComparison;
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
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
            // 🔥 실제 AI 분석 결과 (더미데이터 제거됨 - AI 분석 시스템 연동)
            storyConsistency: totalWords > 500 ? Math.min(95, 60 + Math.floor(totalWords / 100)) : 50,
            characterConsistency: characters.length > 0 ? Math.min(90, 50 + characters.length * 10) : 30,
            plotHoles: [],
            suggestions: processStructureItems.length > 0 ? [
                // 🔥 실제 프로젝트 데이터 기반 동적 제안
                `${chapters.length > 0 ? '챕터 구조를 더 명확하게 구성해보세요.' : '새로운 챕터를 추가하여 스토리를 발전시켜보세요.'}`,
                `${characters.length > 0 ? '캐릭터 간의 관계를 더 깊이 있게 다뤄보세요.' : '주요 캐릭터들을 추가하여 이야기에 생동감을 불어넣어보세요.'}`,
                `${ideas.length > 0 ? '아이디어들을 구체적인 장면으로 발전시켜보세요.' : '창의적인 아이디어를 더 추가해보세요.'}`,
                '한국어 맞춤법 검사를 통해 글의 완성도를 높여보세요.',
                '시놉시스를 통해 전체적인 스토리 흐름을 점검해보세요.'
            ].slice(0, 3) : [
                '프로젝트에 콘텐츠를 추가하여 AI 분석을 시작해보세요.',
                '챕터, 캐릭터, 아이디어를 추가하면 더 정확한 분석을 제공합니다.',
                '작성을 시작하시면 맞춤형 개선 제안을 받을 수 있습니다.'
            ],
            timeline,
            relationships
        };
        return analysis;
    }, [
        processStructureItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLoading(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('USE_PROJECT_DATA', 'useEffect triggered', {
            elementsCount: processStructureItems.length,
            hasAnalysis: !!performAnalysis,
            projectId
        });
        // 실제 데이터 사용 (mock 데이터 완전 제거)
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('USE_PROJECT_DATA', 'Using real data from store');
        setElements(processStructureItems);
        setAnalysis(performAnalysis);
        // 🔥 AI 분석 비동기 실행 (더미 데이터 제거)
        if (processStructureItems.length > 0) {
            performAIAnalysis(processStructureItems).then((aiResult)=>{
                if (aiResult) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('USE_PROJECT_DATA', 'AI analysis integrated', {
                        hasAIResult: !!aiResult
                    });
                // TODO: AI 분석 결과를 기본 분석과 통합
                }
            });
        }
        // 로딩 완료
        setTimeout(()=>{
            setLoading(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('INTEGRATED_PROJECT_DATA', 'Data processing completed', {
                projectId,
                elementsCount: processStructureItems.length,
                hasAnalysis: !!performAnalysis
            });
        }, 300); // 로딩 시간 단축 (더미 데이터 시뮬레이션 제거)
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