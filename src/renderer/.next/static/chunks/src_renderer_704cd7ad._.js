(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/renderer/stores/useStructureStore.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 스토리 구조 글로벌 스토어 - Zustand + 지속성
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useStructureStore": (()=>useStructureStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useStructureStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        structures: {},
        currentEditor: null,
        // 🔥 구조 설정
        setStructures: (projectId, structures)=>set((state)=>({
                    structures: {
                        ...state.structures,
                        [projectId]: structures
                    }
                })),
        // 🔥 구조 아이템 추가 (DB 저장 포함)
        addStructureItem: async (projectId, item)=>{
            // 1. UI에 즉시 반영 (Optimistic Update)
            set((state)=>({
                    structures: {
                        ...state.structures,
                        [projectId]: [
                            ...state.structures[projectId] || [],
                            item
                        ]
                    }
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
        updateStructureItem: async (projectId, itemId, updates)=>{
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
                console.log('✅ Structure item deleted from DB:', itemId);
            } catch (error) {
                console.error('❌ Failed to delete structure item from DB:', error);
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
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            structures: state.structures,
            currentEditor: state.currentEditor
        })
}));
const __TURBOPACK__default__export__ = useStructureStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/hooks/useLongPress.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 롱프레스 훅 - 간단하고 확실한 구현
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useLongPress": (()=>useLongPress)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useLongPress({ onLongPress, onShortPress, delay = 600 }) {
    _s();
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isLongPressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isPressingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[startPress]": ()=>{
            if (isPressingRef.current) return;
            isPressingRef.current = true;
            isLongPressRef.current = false;
            // 롱프레스 타이머 시작
            timeoutRef.current = setTimeout({
                "useLongPress.useCallback[startPress]": ()=>{
                    if (isPressingRef.current) {
                        isLongPressRef.current = true;
                        onLongPress();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '롱프레스 실행됨!');
                    }
                }
            }["useLongPress.useCallback[startPress]"], delay);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '롱프레스 시작', {
                delay
            });
        }
    }["useLongPress.useCallback[startPress]"], [
        onLongPress,
        delay
    ]);
    const endPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[endPress]": ()=>{
            if (!isPressingRef.current) return;
            isPressingRef.current = false;
            // 타이머 정리
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            // 롱프레스가 실행되지 않았다면 숏프레스 실행
            if (!isLongPressRef.current && onShortPress) {
                onShortPress();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '숏프레스 실행됨!');
            }
            isLongPressRef.current = false;
        }
    }["useLongPress.useCallback[endPress]"], [
        onShortPress
    ]);
    const cancelPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[cancelPress]": ()=>{
            isPressingRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            isLongPressRef.current = false;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '롱프레스 취소됨');
        }
    }["useLongPress.useCallback[cancelPress]"], []);
    // 마우스 이벤트 핸들러
    const onMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[onMouseDown]": (event)=>{
            if (event.button !== 0) return; // 왼쪽 클릭만
            event.preventDefault();
            startPress();
        }
    }["useLongPress.useCallback[onMouseDown]"], [
        startPress
    ]);
    const onMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[onMouseUp]": (event)=>{
            event.preventDefault();
            endPress();
        }
    }["useLongPress.useCallback[onMouseUp]"], [
        endPress
    ]);
    const onMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[onMouseLeave]": (event)=>{
            cancelPress();
        }
    }["useLongPress.useCallback[onMouseLeave]"], [
        cancelPress
    ]);
    // 터치 이벤트 핸들러
    const onTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[onTouchStart]": (event)=>{
            if (event.touches.length > 1) return; // 단일 터치만
            event.preventDefault();
            startPress();
        }
    }["useLongPress.useCallback[onTouchStart]"], [
        startPress
    ]);
    const onTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[onTouchEnd]": (event)=>{
            event.preventDefault();
            endPress();
        }
    }["useLongPress.useCallback[onTouchEnd]"], [
        endPress
    ]);
    const onTouchCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLongPress.useCallback[onTouchCancel]": (event)=>{
            cancelPress();
        }
    }["useLongPress.useCallback[onTouchCancel]"], [
        cancelPress
    ]);
    return {
        onMouseDown,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchEnd,
        onTouchCancel
    };
}
_s(useLongPress, "mB7KqGYRHVG/QtrfNxMmIpGxqwA=");
const __TURBOPACK__default__export__ = useLongPress;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProjectPageClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ProjectEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/ProjectEditor.tsx [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/ErrorBoundary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function ProjectPageClient() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
    const openId = searchParams.get('open') || searchParams.get('id') || undefined;
    // 🔥 정적 루트(`/projects/new`)에서 쿼리로 열린 경우 처리
    const projectId = paramId === 'new' && openId ? openId : paramId || openId;
    // 🔥 파라미터 검증
    if (!projectId) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_PAGE', 'Missing project ID in route parameters');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-red-600 mb-4",
                        children: "오류"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/projects/[id]/ProjectPageClient.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_PAGE', 'Loading project page', {
        projectId
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectErrorBoundary"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectEditor"], {
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
_s(ProjectPageClient, "VZyy9DvWoLdWC9W+EkySgP6A0yY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ProjectPageClient;
var _c;
__turbopack_context__.k.register(_c, "ProjectPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_renderer_704cd7ad._.js.map