(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/renderer/components/projects/views/StructureView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "StructureView": (()=>StructureView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 🔥 기가차드 스토리 구조 뷰 - 작가 친화적 개선
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)"); // 🔥 Logger import 추가
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDialog.tsx [app-client] (ecmascript)"); // 🔥 삭제 확인 다이얼로그 추가
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.js [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark.js [app-client] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen.js [app-client] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// 🔥 기가차드 작가 친화적 구조 스타일
const STRUCTURE_STYLES = {
    container: 'max-w-screen-xl mx-auto overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
    // 🔥 개선된 헤더
    header: 'p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700/50',
    headerTop: 'flex items-center justify-between mb-4',
    title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    subtitle: 'text-slate-600 dark:text-gray-400 leading-relaxed',
    // 🔥 통계 요약
    statsGrid: 'grid grid-cols-3 gap-4 mt-4',
    statCard: 'p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700',
    statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mb-2',
    statValue: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    statLabel: 'text-xs text-slate-600 dark:text-gray-400',
    // 🔥 메인 콘텐츠 - 스크롤 영역 개선
    content: 'flex-1 flex flex-col min-h-0',
    scrollArea: 'flex-1 overflow-y-auto',
    contentPadding: 'p-6',
    // 🔥 개선된 구조 아이템
    structureList: 'space-y-3 pb-4',
    structureItem: 'group relative flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer',
    itemDragHandle: 'opacity-0 group-hover:opacity-100 w-5 h-5 text-slate-400 dark:text-gray-500 cursor-grab active:cursor-grabbing transition-opacity',
    itemIcon: 'w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0',
    itemContent: 'flex-1 min-w-0',
    itemTitle: 'font-semibold text-gray-900 dark:text-gray-100 truncate',
    itemMeta: 'flex items-center gap-4 mt-1',
    itemType: 'text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium',
    itemStats: 'text-xs text-slate-500 dark:text-gray-400',
    itemActions: 'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
    actionButton: 'p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 transition-colors',
    // 🔥 개선된 추가 메뉴 - 크기 더 축소
    addMenuContainer: 'relative',
    addButton: 'flex items-center justify-center gap-1.5 w-full p-2 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-md text-slate-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 group',
    addIcon: 'w-3.5 h-3.5 group-hover:scale-110 transition-transform',
    addText: 'text-xs font-medium',
    addMenu: 'absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md shadow-lg z-10 overflow-hidden',
    addMenuItem: 'flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer transition-colors',
    addMenuIcon: 'w-3.5 h-3.5 text-slate-600 dark:text-gray-400',
    addMenuText: 'text-xs font-medium text-gray-900 dark:text-gray-100',
    addMenuDesc: 'text-xs text-slate-500 dark:text-gray-400',
    // 🔥 편집 모드
    editInput: 'w-full px-3 py-2 border-2 border-blue-400 rounded-lg text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500',
    // 🔥 빈 상태
    emptyState: 'flex flex-col items-center justify-center h-64 text-center',
    emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
    emptyTitle: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
    emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed'
};
// 타입별 아이콘 매핑
const TYPE_ICONS = {
    chapter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
    synopsis: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
    idea: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"]
};
// 추가 메뉴 아이템
const ADD_MENU_ITEMS = [
    {
        type: 'chapter',
        label: '새 장',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
        description: '스토리의 주요 단위'
    },
    {
        type: 'synopsis',
        label: '시놉시스',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        description: '이야기 개요'
    },
    {
        type: 'idea',
        label: '아이디어',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"],
        description: '창작 아이디어'
    }
];
// 🔥 빈 배열 상수 - 참조 안정성 보장
const EMPTY_STRUCTURES = [];
const StructureView = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function StructureView({ projectId, onNavigateToChapterEdit, onNavigateToSynopsisEdit, onNavigateToIdeaEdit, onAddNewChapter }) {
    _s();
    // 🔥 Zustand 스토어 사용 - 참조 안정성을 위한 최적화
    const structures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"])({
        "StructureView.StructureView.useStructureStore[structures]": (state)=>{
            const projectStructures = state.structures[projectId];
            return projectStructures || EMPTY_STRUCTURES;
        }
    }["StructureView.StructureView.useStructureStore[structures]"]);
    const addStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"])({
        "StructureView.StructureView.useStructureStore[addStructureItem]": (state)=>state.addStructureItem
    }["StructureView.StructureView.useStructureStore[addStructureItem]"]);
    const updateStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"])({
        "StructureView.StructureView.useStructureStore[updateStructureItem]": (state)=>state.updateStructureItem
    }["StructureView.StructureView.useStructureStore[updateStructureItem]"]);
    const deleteStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"])({
        "StructureView.StructureView.useStructureStore[deleteStructureItem]": (state)=>state.deleteStructureItem
    }["StructureView.StructureView.useStructureStore[deleteStructureItem]"]);
    const setCurrentEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"])({
        "StructureView.StructureView.useStructureStore[setCurrentEditor]": (state)=>state.setCurrentEditor
    }["StructureView.StructureView.useStructureStore[setCurrentEditor]"]);
    const [showAddMenu, setShowAddMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editTitle, setEditTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 삭제 확인 다이얼로그
    const [itemToDelete, setItemToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // 🔥 삭제할 아이템 정보
    // 🔥 강제 리렌더링을 위한 상태
    const [, forceUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const triggerUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[triggerUpdate]": ()=>{
            forceUpdate({});
        }
    }["StructureView.StructureView.useCallback[triggerUpdate]"], []);
    // 🔥 스토어 동기화 디버깅
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StructureView.StructureView.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_VIEW', 'Structures updated', {
                projectId,
                structuresCount: structures.length,
                structures: structures.map({
                    "StructureView.StructureView.useEffect": (s)=>({
                            id: s.id,
                            title: s.title,
                            type: s.type
                        })
                }["StructureView.StructureView.useEffect"])
            });
        }
    }["StructureView.StructureView.useEffect"], [
        structures,
        projectId
    ]);
    // 🔥 스토어 구독으로 실시간 업데이트 보장
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StructureView.StructureView.useEffect": ()=>{
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"].subscribe({
                "StructureView.StructureView.useEffect.unsubscribe": (state)=>{
                    const currentStructures = state.structures[projectId] || [];
                    if (currentStructures !== structures) {
                        triggerUpdate();
                    }
                }
            }["StructureView.StructureView.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["StructureView.StructureView.useEffect"], [
        projectId,
        structures,
        triggerUpdate
    ]);
    const handleAddItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleAddItem]": async (type)=>{
            // 🔥 NEW: chapter 타입일 때는 모달을 통해 처리
            if (type === 'chapter' && onAddNewChapter) {
                onAddNewChapter();
                setShowAddMenu(false);
                return;
            }
            // 기존 synopsis, idea 처리 로직
            const defaultTitles = {
                chapter: `새로운 챕터`,
                synopsis: `새로운 시놉시스`,
                idea: `새로운 아이디어`
            };
            // 🔥 chapter 타입의 경우 올바른 번호 계산
            let itemTitle = defaultTitles[type];
            if (type === 'chapter') {
                const chapterStructures = structures.filter({
                    "StructureView.StructureView.useCallback[handleAddItem].chapterStructures": (item)=>item.type === 'chapter'
                }["StructureView.StructureView.useCallback[handleAddItem].chapterStructures"]);
                const chapterCount = chapterStructures.length + 1;
                itemTitle = `${chapterCount}챕터`;
            }
            const newItem = {
                id: `${type}_${Date.now()}`,
                title: itemTitle,
                description: '',
                type,
                status: 'planning',
                projectId,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // 🔥 Zustand 스토어에 추가 (비동기)
            await addStructureItem(projectId, newItem);
            // 🔥 에디터 상태 업데이트
            setCurrentEditor({
                projectId,
                editorType: type,
                itemId: newItem.id,
                itemTitle: newItem.title
            });
            setShowAddMenu(false);
            // 🔥 해당 타입의 에디터로 이동
            if (type === 'idea') {
                onNavigateToIdeaEdit?.(newItem.id);
            } else if (type === 'synopsis') {
                onNavigateToSynopsisEdit?.(newItem.id);
            }
        }
    }["StructureView.StructureView.useCallback[handleAddItem]"], [
        projectId,
        addStructureItem,
        setCurrentEditor,
        onAddNewChapter,
        onNavigateToIdeaEdit,
        onNavigateToSynopsisEdit
    ]);
    const handleItemClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleItemClick]": (item)=>{
            // 🔥 에디터 상태 업데이트
            setCurrentEditor({
                projectId,
                editorType: item.type,
                itemId: item.id,
                itemTitle: item.title
            });
            if (item.type === 'chapter') {
                onNavigateToChapterEdit?.(item.id);
            } else if (item.type === 'idea') {
                onNavigateToIdeaEdit?.(item.id);
            } else if (item.type === 'synopsis') {
                onNavigateToSynopsisEdit?.(item.id);
            }
        }
    }["StructureView.StructureView.useCallback[handleItemClick]"], [
        projectId,
        setCurrentEditor,
        onNavigateToChapterEdit,
        onNavigateToIdeaEdit,
        onNavigateToSynopsisEdit
    ]);
    const handleEditStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleEditStart]": (item)=>{
            setEditingId(item.id);
            setEditTitle(item.title);
        }
    }["StructureView.StructureView.useCallback[handleEditStart]"], []);
    const handleEditSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleEditSave]": (id)=>{
            if (editTitle.trim()) {
                // 🔥 Zustand 스토어에서 업데이트
                updateStructureItem(projectId, id, {
                    title: editTitle.trim()
                });
            }
            setEditingId(null);
            setEditTitle('');
        }
    }["StructureView.StructureView.useCallback[handleEditSave]"], [
        projectId,
        editTitle,
        updateStructureItem
    ]);
    const handleEditCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleEditCancel]": ()=>{
            setEditingId(null);
            setEditTitle('');
        }
    }["StructureView.StructureView.useCallback[handleEditCancel]"], []);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleDelete]": (id)=>{
            // 🔥 삭제할 아이템 정보 찾기
            const itemToDeleteInfo = structures.find({
                "StructureView.StructureView.useCallback[handleDelete].itemToDeleteInfo": (structure)=>structure.id === id
            }["StructureView.StructureView.useCallback[handleDelete].itemToDeleteInfo"]);
            if (itemToDeleteInfo) {
                setItemToDelete({
                    id: itemToDeleteInfo.id,
                    title: itemToDeleteInfo.title
                });
                setShowDeleteDialog(true);
            }
        }
    }["StructureView.StructureView.useCallback[handleDelete]"], [
        structures
    ]);
    // 🔥 삭제 확인 핸들러
    const handleConfirmDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleConfirmDelete]": async ()=>{
            if (!itemToDelete) return;
            try {
                // 🔥 Zustand 스토어에서 삭제 (DB 삭제 포함)
                await deleteStructureItem(projectId, itemToDelete.id);
                // 🔥 삭제 성공 시 추가 정리 작업
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Structure item deleted successfully', {
                    id: itemToDelete.id,
                    title: itemToDelete.title,
                    projectId
                });
                // 편집 상태 초기화
                if (editingId === itemToDelete.id) {
                    setEditingId(null);
                    setEditTitle('');
                }
                // 다이얼로그 상태 초기화
                setShowDeleteDialog(false);
                setItemToDelete(null);
                // 강제 리렌더링
                triggerUpdate();
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_VIEW', 'Failed to delete structure item', {
                    id: itemToDelete.id,
                    title: itemToDelete.title,
                    projectId,
                    error
                });
            }
        }
    }["StructureView.StructureView.useCallback[handleConfirmDelete]"], [
        projectId,
        deleteStructureItem,
        editingId,
        itemToDelete,
        triggerUpdate
    ]);
    // 🔥 삭제 취소 핸들러
    const handleCancelDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleCancelDelete]": ()=>{
            setShowDeleteDialog(false);
            setItemToDelete(null);
        }
    }["StructureView.StructureView.useCallback[handleCancelDelete]"], []);
    const handleKeyPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StructureView.StructureView.useCallback[handleKeyPress]": (e, id)=>{
            if (e.key === 'Enter') {
                handleEditSave(id);
            } else if (e.key === 'Escape') {
                handleEditCancel();
            }
        }
    }["StructureView.StructureView.useCallback[handleKeyPress]"], [
        handleEditSave,
        handleEditCancel
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: STRUCTURE_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: STRUCTURE_STYLES.title,
                        children: "스토리 구조"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: STRUCTURE_STYLES.subtitle,
                        children: "장, 장면, 메모를 관리하여 이야기의 흐름을 구성하세요"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: STRUCTURE_STYLES.structureList,
                    children: [
                        structures.map((item)=>{
                            const IconComponent = TYPE_ICONS[item.type] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"];
                            const isEditing = editingId === item.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: STRUCTURE_STYLES.structureItem,
                                onClick: ()=>handleItemClick(item),
                                style: {
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                        className: STRUCTURE_STYLES.itemIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                        lineNumber: 336,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STRUCTURE_STYLES.itemContent,
                                        children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: editTitle,
                                            onChange: (e)=>setEditTitle(e.target.value),
                                            onKeyDown: (e)=>handleKeyPress(e, item.id),
                                            onBlur: ()=>handleEditSave(item.id),
                                            className: STRUCTURE_STYLES.editInput,
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 339,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: STRUCTURE_STYLES.itemTitle,
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: STRUCTURE_STYLES.itemType,
                                                    children: item.type === 'chapter' ? '장' : item.type === 'synopsis' ? '시놉시스' : '아이디어'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                        lineNumber: 337,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STRUCTURE_STYLES.itemActions,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>{
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleEditStart(item);
                                                },
                                                className: STRUCTURE_STYLES.actionButton,
                                                title: "편집",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                lineNumber: 359,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>{
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDelete(item.id);
                                                },
                                                className: STRUCTURE_STYLES.actionButton,
                                                title: "삭제",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                lineNumber: 370,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                lineNumber: 330,
                                columnNumber: 15
                            }, this);
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: STRUCTURE_STYLES.addMenuContainer,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowAddMenu(!showAddMenu);
                                    },
                                    className: STRUCTURE_STYLES.addButton,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "새 항목 추가"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 397,
                                            columnNumber: 15
                                        }, this),
                                        showAddMenu ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 398,
                                            columnNumber: 30
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 398,
                                            columnNumber: 68
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, this),
                                showAddMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: STRUCTURE_STYLES.addMenu,
                                    children: ADD_MENU_ITEMS.map(({ type, label, icon: Icon, description })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: (e)=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleAddItem(type);
                                            },
                                            className: STRUCTURE_STYLES.addMenuItem,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-gray-900 dark:text-gray-100",
                                                            children: label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 415,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                                            children: description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, type, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 404,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 402,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                            lineNumber: 387,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                isOpen: showDeleteDialog,
                title: "구조 항목 삭제",
                message: "이 항목을 삭제하시겠습니까?",
                itemName: itemToDelete?.title,
                warning: "삭제된 항목은 복구할 수 없습니다.",
                confirmText: "삭제",
                cancelText: "취소",
                onConfirm: handleConfirmDelete,
                onCancel: handleCancelDelete
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 431,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
        lineNumber: 313,
        columnNumber: 5
    }, this);
}, "DoC2CLdSSclGLA4GWVm9qeX8XT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"]
    ];
})), "DoC2CLdSSclGLA4GWVm9qeX8XT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStructureStore"]
    ];
});
_c1 = StructureView;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "StructureView$memo");
__turbopack_context__.k.register(_c1, "StructureView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/CharactersView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CharactersView": (()=>CharactersView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 🔥 기가차드 캐릭터 뷰 - 상세 정보 확장 및 정보 과부하 방지
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDialog.tsx [app-client] (ecmascript)"); // 🔥 ConfirmDialog 추가
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
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
    emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed'
};
// 🔥 탭 정의
const CHARACTER_TABS = [
    {
        id: 'basic',
        label: '기본',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    },
    {
        id: 'details',
        label: '상세',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    },
    {
        id: 'story',
        label: '스토리',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"]
    }
];
function CharactersView({ projectId, characters, onCharactersChange }) {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [editingCharacter, setEditingCharacter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // 🔥 삭제 관련 상태
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [characterToDelete, setCharacterToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 통계 계산
    const stats = {
        total: characters.length,
        main: characters.filter((c)=>c.role?.includes('주인공') || c.role?.includes('주연')).length,
        detailed: characters.filter((c)=>c.appearance && c.personality && c.background).length
    };
    const handleAddCharacter = async ()=>{
        const newCharacter = {
            id: Date.now().toString(),
            projectId,
            name: '새 인물',
            role: '역할 미정',
            description: '인물에 대한 기본 설명을 추가하세요.',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setEditingCharacter(newCharacter);
        setEditForm(newCharacter);
    };
    const handleEditStart = (character)=>{
        setEditingCharacter(character);
        setEditForm(character);
    };
    const handleEditSave = async ()=>{
        if (!editingCharacter || !editForm.name?.trim()) return;
        try {
            const characterToSave = {
                ...editForm,
                id: editingCharacter.id,
                projectId,
                updatedAt: new Date()
            };
            const result = await window.electronAPI.projects.upsertCharacter(characterToSave);
            if (result.success && result.data) {
                const updatedCharacters = editingCharacter.id === editForm.id ? characters.map((char)=>char.id === editingCharacter.id ? result.data : char) : [
                    ...characters,
                    result.data
                ];
                onCharactersChange(updatedCharacters);
                setEditingCharacter(null);
                setEditForm({});
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Character saved', {
                    id: result.data.id
                });
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CHARACTERS_VIEW', 'Failed to save character', error);
            alert('캐릭터 저장에 실패했습니다.');
        }
    };
    const handleEditCancel = ()=>{
        setEditingCharacter(null);
        setEditForm({});
    };
    const handleDelete = (id, name)=>{
        setCharacterToDelete({
            id,
            name
        });
        setShowDeleteDialog(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Delete dialog opened', {
            id,
            name
        });
    };
    // 🔥 삭제 확인 핸들러
    const handleConfirmDelete = ()=>{
        if (!characterToDelete) return;
        try {
            const updatedCharacters = characters.filter((char)=>char.id !== characterToDelete.id);
            onCharactersChange(updatedCharacters);
            setShowDeleteDialog(false);
            setCharacterToDelete(null);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Character deleted successfully', {
                id: characterToDelete.id,
                name: characterToDelete.name
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CHARACTERS_VIEW', 'Failed to delete character', {
                id: characterToDelete.id,
                name: characterToDelete.name,
                error
            });
        }
    };
    // 🔥 삭제 취소 핸들러
    const handleCancelDelete = ()=>{
        setShowDeleteDialog(false);
        setCharacterToDelete(null);
    };
    const getTabForCharacter = (characterId)=>{
        return activeTab[characterId] || 'basic';
    };
    const setTabForCharacter = (characterId, tab)=>{
        setActiveTab((prev)=>({
                ...prev,
                [characterId]: tab
            }));
    };
    const renderTabContent = (character, tab)=>{
        switch(tab){
            case 'basic':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.tabContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "역할"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.role || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "역할을 설정해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 225,
                                        columnNumber: 36
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 222,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "설명"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.description || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터 설명을 추가해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 231,
                                        columnNumber: 43
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 221,
                    columnNumber: 11
                }, this);
            case 'details':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.tabContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "외모"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 241,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.appearance || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "외모를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 243,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 242,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 240,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "나이"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.age || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "나이를 설정해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 249,
                                        columnNumber: 35
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 246,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "직업"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.occupation || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "직업을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 255,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 254,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 252,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "출신 / 거주지"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 259,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.birthplace || character.residence ? `${character.birthplace || '미기록'} / ${character.residence || '미기록'}` : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "출신지와 거주지를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 263,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 258,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "가족"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 268,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.family || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "가족 관계를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 270,
                                        columnNumber: 38
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 269,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 267,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 239,
                    columnNumber: 11
                }, this);
            case 'story':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.tabContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "성격"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 280,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.personality || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "성격을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 282,
                                        columnNumber: 43
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "배경"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 286,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.background || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터 배경을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 288,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 287,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 285,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "목표"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 292,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.goals || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터의 목표를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 294,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 291,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 278,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: CHARACTERS_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: CHARACTERS_STYLES.headerTop,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: CHARACTERS_STYLES.title,
                                    children: "등장인물"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 311,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CHARACTERS_STYLES.subtitle,
                                    children: "이야기 속 캐릭터들의 상세한 프로필을 관리하세요. 체계적인 캐릭터 설정으로 더욱 생생한 스토리를 만들어보세요."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 312,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 310,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: CHARACTERS_STYLES.statsGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.total
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "총 인물"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 324,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 321,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 327,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.main
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 328,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "주요 인물"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 332,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.detailed
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "상세 설정"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.scrollArea,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: CHARACTERS_STYLES.contentPadding,
                        children: characters.length === 0 ? // 빈 상태
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                    className: CHARACTERS_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 346,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: CHARACTERS_STYLES.emptyTitle,
                                    children: "첫 번째 인물을 만들어보세요"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 347,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CHARACTERS_STYLES.emptyDescription,
                                    children: "매력적인 캐릭터들이 당신의 이야기를 더욱 생동감 있게 만들어줄 것입니다. 주인공부터 조연까지, 각자의 특별한 이야기를 담아보세요."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 348,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddCharacter,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary} mt-6`,
                                    children: "첫 인물 만들기"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 352,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 345,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.characterGrid,
                            children: [
                                characters.map((character)=>{
                                    const currentTab = getTabForCharacter(character.id);
                                    // 🔥 편집 핸들러
                                    const handleCharacterClick = ()=>{
                                        handleEditStart(character);
                                    };
                                    const handleCharacterDoubleClick = ()=>{
                                        handleEditStart(character);
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', '더블클릭으로 편집 모드 활성화', {
                                            name: character.name
                                        });
                                    };
                                    // 🔥 Long press 핸들러 - 간단한 타이머 방식
                                    let pressTimer = null;
                                    const handleMouseDown = ()=>{
                                        pressTimer = setTimeout(()=>{
                                            handleEditStart(character);
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Long press detected - entering edit mode', {
                                                name: character.name
                                            });
                                        }, 500);
                                    };
                                    const handleMouseUp = ()=>{
                                        if (pressTimer) {
                                            clearTimeout(pressTimer);
                                            pressTimer = null;
                                        }
                                    };
                                    const handleMouseLeave = ()=>{
                                        if (pressTimer) {
                                            clearTimeout(pressTimer);
                                            pressTimer = null;
                                        }
                                    };
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.characterCard,
                                        onClick: handleCharacterClick,
                                        onDoubleClick: handleCharacterDoubleClick,
                                        onMouseDown: handleMouseDown,
                                        onMouseUp: handleMouseUp,
                                        onMouseLeave: handleMouseLeave,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: CHARACTERS_STYLES.actionButtons,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditStart(character);
                                                            },
                                                            className: CHARACTERS_STYLES.editButton,
                                                            title: "편집",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                                lineNumber: 416,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleDelete(character.id, character.name);
                                                            },
                                                            className: CHARACTERS_STYLES.deleteButton,
                                                            title: "삭제",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: CHARACTERS_STYLES.characterHeader,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: CHARACTERS_STYLES.characterAvatar,
                                                            children: character.name.charAt(0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 432,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: CHARACTERS_STYLES.characterName,
                                                            children: character.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: CHARACTERS_STYLES.characterRole,
                                                            children: character.role
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 436,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: CHARACTERS_STYLES.tabContainer,
                                                    children: CHARACTER_TABS.map(({ id, label, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setTabForCharacter(character.id, id),
                                                            className: `${CHARACTERS_STYLES.tab} ${currentTab === id ? CHARACTERS_STYLES.tabActive : ''}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                    className: "w-4 h-4 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                                    lineNumber: 448,
                                                                    columnNumber: 31
                                                                }, this),
                                                                label
                                                            ]
                                                        }, id, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 442,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 25
                                                }, this),
                                                renderTabContent(character, currentTab)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 405,
                                            columnNumber: 23
                                        }, this)
                                    }, character.id, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 396,
                                        columnNumber: 21
                                    }, this);
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddCharacter,
                                    className: CHARACTERS_STYLES.addButton,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: CHARACTERS_STYLES.addButtonIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 466,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: CHARACTERS_STYLES.addButtonText,
                                            children: "새 인물 추가"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 467,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 462,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 360,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 342,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 341,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this),
            editingCharacter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.modalOverlay,
                onClick: handleEditCancel,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.modal,
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.modalHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: CHARACTERS_STYLES.modalTitle,
                                    children: editingCharacter.id === editForm.id ? '캐릭터 편집' : '새 캐릭터'
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 480,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditCancel,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 484,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 483,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 479,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.modalBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.formGrid,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "이름 *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 491,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.name || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                name: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formInput,
                                                    placeholder: "캐릭터 이름"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 490,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "역할"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.role || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                role: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formInput,
                                                    placeholder: "주인공, 조연, 악역 등"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 503,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "나이"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.age || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                age: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formInput,
                                                    placeholder: "나이 또는 연령대"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 512,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "직업"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.occupation || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                occupation: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formInput,
                                                    placeholder: "직업이나 역할"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 523,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "출신"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 535,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.birthplace || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                birthplace: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formInput,
                                                    placeholder: "출생지"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 536,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 534,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "거주지"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.residence || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                residence: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formInput,
                                                    placeholder: "현재 거주지"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 547,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 545,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 489,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "외모"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: editForm.appearance || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                appearance: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formTextarea,
                                                    placeholder: "키, 몸무게, 헤어스타일, 특징 등",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 558,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "성격"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 570,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: editForm.personality || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                personality: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formTextarea,
                                                    placeholder: "성격적 특징, 말투, 습관 등",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 569,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "가족"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: editForm.family || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                family: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formTextarea,
                                                    placeholder: "가족 구성원과 관계",
                                                    rows: 2
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 582,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 580,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "배경"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 592,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: editForm.background || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                background: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formTextarea,
                                                    placeholder: "과거 경험, 중요한 사건 등",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 593,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 591,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "설명"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 603,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: editForm.description || '',
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                description: e.target.value
                                                            })),
                                                    className: CHARACTERS_STYLES.formTextarea,
                                                    placeholder: "캐릭터에 대한 전반적인 설명",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 604,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 602,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 557,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 488,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.modalFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditCancel,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonSecondary}`,
                                    children: "취소"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 616,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditSave,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary}`,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 622,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 615,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 478,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 477,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                isOpen: showDeleteDialog,
                title: "캐릭터 삭제",
                message: characterToDelete ? `"${characterToDelete.name}"을(를) 삭제하시겠습니까?` : '',
                confirmText: "삭제",
                cancelText: "취소",
                onConfirm: handleConfirmDelete,
                onCancel: handleCancelDelete
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 634,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
        lineNumber: 306,
        columnNumber: 5
    }, this);
}
_s(CharactersView, "Sn/eg+aiQ/VH4QmoASTsS+HJp3A=");
_c = CharactersView;
var _c;
__turbopack_context__.k.register(_c, "CharactersView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/NotesView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "NotesView": (()=>NotesView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 🔥 기가차드 노트 뷰 - 드래그, 크기조절, 타입별 생성 완전 개선
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sticky-note.js [app-client] (ecmascript) <export default as StickyNote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 기가차드 작가 친화적 노트 스타일
const NOTES_STYLES = {
    container: 'flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
    // 🔥 개선된 헤더
    header: 'p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-700/50',
    headerTop: 'flex items-center justify-between mb-4',
    title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    subtitle: 'text-slate-600 dark:text-gray-400 leading-relaxed',
    // 🔥 통계 카드
    statsGrid: 'grid grid-cols-4 gap-4 mt-4',
    statCard: 'p-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700',
    statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mb-2',
    statValue: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    statLabel: 'text-xs text-slate-600 dark:text-gray-400',
    // 🔥 컨텐츠 영역
    content: 'flex-1 relative overflow-hidden',
    // 🔥 개선된 타입 필터
    typeButtons: 'flex gap-3 mb-6 flex-wrap',
    typeButton: 'flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 dark:border-gray-700 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 cursor-pointer',
    typeButtonActive: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md',
    // 🔥 캔버스 영역 (드래그 가능)
    canvas: 'absolute inset-0 overflow-auto p-6',
    // 🔥 개선된 노트 카드 (드래그 가능, 크기 조절 가능)
    noteCard: 'absolute group select-none bg-gradient-to-br shadow-lg rounded-xl border-2 transition-all duration-200 cursor-move',
    noteCardIdea: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-300 dark:border-yellow-700',
    noteCardGoal: 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-700',
    noteCardReference: 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-700',
    noteCardHover: 'hover:shadow-xl hover:scale-105 hover:z-10',
    // 🔥 노트 헤더
    noteHeader: 'flex items-center justify-between p-4 border-b border-current/20',
    noteIcon: 'w-5 h-5 mr-2',
    noteTitle: 'font-bold text-gray-900 dark:text-gray-100 flex-1 text-sm',
    noteActions: 'flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
    // 🔥 노트 컨텐츠
    noteContent: 'p-4 text-gray-700 dark:text-gray-300 text-xs leading-relaxed overflow-hidden',
    noteDate: 'text-xs text-gray-500 dark:text-gray-500 px-4 pb-3 font-medium',
    // 🔥 크기 조절 핸들
    resizeHandle: 'absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity',
    resizeIcon: 'w-3 h-3 text-gray-400',
    // 🔥 개선된 추가 버튼들
    addButtonsContainer: 'absolute bottom-6 right-6 flex flex-col gap-3',
    addButton: 'group relative flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl',
    addButtonIcon: 'w-5 h-5 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors',
    addButtonText: 'text-sm font-medium text-slate-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
    // 🔥 편집 버튼 개선
    editButton: 'relative z-10 p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer',
    saveButton: 'relative z-10 p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors cursor-pointer',
    cancelButton: 'relative z-10 p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer',
    // 🔥 편집 인풋
    editInput: 'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500',
    editTextarea: 'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none',
    // 🔥 빈 상태
    emptyState: 'absolute inset-0 flex flex-col items-center justify-center text-center',
    emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
    emptyTitle: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
    emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed'
};
// 기본 메모 데이터
const DEFAULT_NOTES = [];
const NOTE_TYPES = [
    {
        id: 'all',
        label: '전체',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"]
    },
    {
        id: 'idea',
        label: '아이디어',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"]
    },
    {
        id: 'goal',
        label: '목표',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"]
    },
    {
        id: 'reference',
        label: '참고',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    }
];
const NOTE_TYPE_STYLES = {
    idea: NOTES_STYLES.noteCardIdea,
    goal: NOTES_STYLES.noteCardGoal,
    reference: NOTES_STYLES.noteCardReference
};
function NotesView({ projectId, notes: propNotes, onNotesChange }) {
    _s();
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((propNotes || DEFAULT_NOTES).map({
        "NotesView.useState": (note, index)=>({
                ...note,
                projectId,
                position: {
                    x: 50 + index % 3 * 250,
                    y: 50 + Math.floor(index / 3) * 200,
                    width: 240,
                    height: 180
                }
            })
    }["NotesView.useState"]));
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [dragData, setDragData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resizeData, setResizeData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 노트 편집 핸들러들
    const handleEditNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleEditNote]": (noteId)=>{
            const note = notes.find({
                "NotesView.useCallback[handleEditNote].note": (n)=>n.id === noteId
            }["NotesView.useCallback[handleEditNote].note"]);
            if (note) {
                setEditingId(noteId);
                setEditForm(note);
            }
        }
    }["NotesView.useCallback[handleEditNote]"], [
        notes
    ]);
    const handleLongPressEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleLongPressEdit]": (noteId)=>{
            handleEditNote(noteId);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('NOTES_VIEW', '🔥 롱프레스로 편집 모드 활성화', {
                noteId
            });
        }
    }["NotesView.useCallback[handleLongPressEdit]"], [
        handleEditNote
    ]);
    // 🔥 통계 계산
    const stats = {
        total: notes.length,
        ideas: notes.filter((note)=>note.type === 'idea').length,
        goals: notes.filter((note)=>note.type === 'goal').length,
        references: notes.filter((note)=>note.type === 'reference').length
    };
    // 🔥 필터링된 노트
    const filteredNotes = selectedType === 'all' ? notes : notes.filter((note)=>note.type === selectedType);
    // 🔥 새 노트 추가 (타입별)
    const handleAddNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleAddNote]": (type)=>{
            const newNote = {
                id: Date.now().toString(),
                projectId,
                title: type === 'idea' ? '새 아이디어' : type === 'goal' ? '새 목표' : '새 참고사항',
                content: type === 'idea' ? '떠오른 아이디어를 기록하세요...' : type === 'goal' ? '달성하고 싶은 목표를 설정하세요...' : '참고할 자료나 정보를 기록하세요...',
                type,
                createdAt: new Date(),
                updatedAt: new Date(),
                position: {
                    x: Math.random() * 300 + 50,
                    y: Math.random() * 200 + 50,
                    width: 240,
                    height: 180
                }
            };
            const updatedNotes = [
                ...notes,
                newNote
            ];
            setNotes(updatedNotes);
            onNotesChange?.(updatedNotes);
            // 바로 편집 모드로 진입
            setEditingId(newNote.id);
            setEditForm(newNote);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('NOTES_VIEW', 'New note added', {
                id: newNote.id,
                type
            });
        }
    }["NotesView.useCallback[handleAddNote]"], [
        notes,
        projectId,
        onNotesChange
    ]);
    // 🔥 드래그 시작
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleMouseDown]": (e, noteId)=>{
            if (e.target.closest('.resize-handle')) return;
            const note = notes.find({
                "NotesView.useCallback[handleMouseDown].note": (n)=>n.id === noteId
            }["NotesView.useCallback[handleMouseDown].note"]);
            if (!note?.position) return;
            setDragData({
                id: noteId,
                startX: note.position.x,
                startY: note.position.y,
                startMouseX: e.clientX,
                startMouseY: e.clientY
            });
        }
    }["NotesView.useCallback[handleMouseDown]"], [
        notes
    ]);
    // 🔥 크기 조절 시작
    const handleResizeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleResizeStart]": (e, noteId)=>{
            e.stopPropagation();
            const note = notes.find({
                "NotesView.useCallback[handleResizeStart].note": (n)=>n.id === noteId
            }["NotesView.useCallback[handleResizeStart].note"]);
            if (!note?.position) return;
            setResizeData({
                id: noteId,
                startWidth: note.position.width,
                startHeight: note.position.height,
                startMouseX: e.clientX,
                startMouseY: e.clientY
            });
        }
    }["NotesView.useCallback[handleResizeStart]"], [
        notes
    ]);
    // 🔥 마우스 이동 처리
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleMouseMove]": (e)=>{
            if (dragData) {
                const deltaX = e.clientX - dragData.startMouseX;
                const deltaY = e.clientY - dragData.startMouseY;
                setNotes({
                    "NotesView.useCallback[handleMouseMove]": (prev)=>prev.map({
                            "NotesView.useCallback[handleMouseMove]": (note)=>note.id === dragData.id && note.position ? {
                                    ...note,
                                    position: {
                                        ...note.position,
                                        x: Math.max(0, dragData.startX + deltaX),
                                        y: Math.max(0, dragData.startY + deltaY)
                                    }
                                } : note
                        }["NotesView.useCallback[handleMouseMove]"])
                }["NotesView.useCallback[handleMouseMove]"]);
            }
            if (resizeData) {
                const deltaX = e.clientX - resizeData.startMouseX;
                const deltaY = e.clientY - resizeData.startMouseY;
                setNotes({
                    "NotesView.useCallback[handleMouseMove]": (prev)=>prev.map({
                            "NotesView.useCallback[handleMouseMove]": (note)=>note.id === resizeData.id && note.position ? {
                                    ...note,
                                    position: {
                                        ...note.position,
                                        width: Math.max(200, resizeData.startWidth + deltaX),
                                        height: Math.max(150, resizeData.startHeight + deltaY)
                                    }
                                } : note
                        }["NotesView.useCallback[handleMouseMove]"])
                }["NotesView.useCallback[handleMouseMove]"]);
            }
        }
    }["NotesView.useCallback[handleMouseMove]"], [
        dragData,
        resizeData
    ]);
    // 🔥 마우스 업 처리
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleMouseUp]": ()=>{
            if (dragData || resizeData) {
                onNotesChange?.(notes);
            }
            setDragData(null);
            setResizeData(null);
        }
    }["NotesView.useCallback[handleMouseUp]"], [
        dragData,
        resizeData,
        notes,
        onNotesChange
    ]);
    // 🔥 이벤트 리스너 등록
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "NotesView.useEffect": ()=>{
            if (dragData || resizeData) {
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                return ({
                    "NotesView.useEffect": ()=>{
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                    }
                })["NotesView.useEffect"];
            }
        }
    }["NotesView.useEffect"], [
        dragData,
        resizeData,
        handleMouseMove,
        handleMouseUp
    ]);
    // 🔥 편집 관련 함수들
    const handleEditStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleEditStart]": (note)=>{
            setEditingId(note.id);
            setEditForm(note);
        }
    }["NotesView.useCallback[handleEditStart]"], []);
    const handleEditSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleEditSave]": ()=>{
            if (editingId && editForm) {
                const updatedNotes = notes.map({
                    "NotesView.useCallback[handleEditSave].updatedNotes": (note)=>note.id === editingId ? {
                            ...note,
                            ...editForm,
                            updatedAt: new Date()
                        } : note
                }["NotesView.useCallback[handleEditSave].updatedNotes"]);
                setNotes(updatedNotes);
                onNotesChange?.(updatedNotes);
                setEditingId(null);
                setEditForm({});
            }
        }
    }["NotesView.useCallback[handleEditSave]"], [
        editingId,
        editForm,
        notes,
        onNotesChange
    ]);
    const handleEditCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleEditCancel]": ()=>{
            setEditingId(null);
            setEditForm({});
        }
    }["NotesView.useCallback[handleEditCancel]"], []);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotesView.useCallback[handleDelete]": (id)=>{
            const updatedNotes = notes.filter({
                "NotesView.useCallback[handleDelete].updatedNotes": (note)=>note.id !== id
            }["NotesView.useCallback[handleDelete].updatedNotes"]);
            setNotes(updatedNotes);
            onNotesChange?.(updatedNotes);
        }
    }["NotesView.useCallback[handleDelete]"], [
        notes,
        onNotesChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: NOTES_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTES_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.headerTop,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: NOTES_STYLES.title,
                                    children: "창작 노트"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 319,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: NOTES_STYLES.subtitle,
                                    children: "아이디어, 목표, 참고사항을 자유롭게 배치하고 관리하세요. 드래그로 위치를 조정하고 크기를 조절할 수 있습니다."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 320,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                            lineNumber: 318,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.statsGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.total
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 331,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "총 노트"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 332,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 329,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.ideas
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "아이디어"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.goals
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "목표"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 345,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.references
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "참고"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.typeButtons,
                        children: NOTE_TYPES.map(({ id, label, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedType(id),
                                className: `${NOTES_STYLES.typeButton} ${selectedType === id ? NOTES_STYLES.typeButtonActive : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 361,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 354,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTES_STYLES.content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: canvasRef,
                        className: NOTES_STYLES.canvas,
                        children: filteredNotes.length === 0 ? // 빈 상태
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: NOTES_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                                    className: NOTES_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 373,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: NOTES_STYLES.emptyTitle,
                                    children: selectedType === 'all' ? '첫 번째 노트를 만들어보세요' : `${NOTE_TYPES.find((t)=>t.id === selectedType)?.label} 노트를 추가해보세요`
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 374,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: NOTES_STYLES.emptyDescription,
                                    children: "창작 과정에서 떠오르는 아이디어나 중요한 정보들을 자유롭게 배치할 수 있는 캔버스입니다."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 377,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                            lineNumber: 372,
                            columnNumber: 13
                        }, this) : // 노트들
                        filteredNotes.map((note)=>{
                            const isEditing = editingId === note.id;
                            const position = note.position || {
                                x: 50,
                                y: 50,
                                width: 240,
                                height: 180
                            };
                            const Icon = note.type === 'idea' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"] : note.type === 'goal' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"];
                            const noteTypeStyle = NOTE_TYPE_STYLES[note.type];
                            // 🔥 드래그 및 편집 핸들러
                            const handleNoteClick = ()=>{
                                setEditingId(note.id);
                                setEditForm(note);
                            };
                            const handleNoteDoubleClick = ()=>{
                                handleLongPressEdit(note.id);
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${NOTES_STYLES.noteCard} ${noteTypeStyle} ${NOTES_STYLES.noteCardHover}`,
                                style: {
                                    left: position.x,
                                    top: position.y,
                                    width: position.width,
                                    height: position.height,
                                    zIndex: dragData?.id === note.id ? 1000 : 1
                                },
                                onClick: handleNoteClick,
                                onDoubleClick: handleNoteDoubleClick,
                                onMouseDown: (e)=>{
                                    handleMouseDown(e, note.id);
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.noteHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: NOTES_STYLES.noteIcon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 23
                                                    }, this),
                                                    isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: editForm.title || '',
                                                        onChange: (e)=>setEditForm((prev)=>({
                                                                    ...prev,
                                                                    title: e.target.value
                                                                })),
                                                        className: NOTES_STYLES.editInput,
                                                        onClick: (e)=>e.stopPropagation()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                        lineNumber: 422,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: NOTES_STYLES.noteTitle,
                                                        children: note.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                        lineNumber: 430,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                lineNumber: 419,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: NOTES_STYLES.noteActions,
                                                children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditSave();
                                                            },
                                                            className: NOTES_STYLES.saveButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 444,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditCancel();
                                                            },
                                                            className: NOTES_STYLES.cancelButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 453,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 446,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditStart(note);
                                                            },
                                                            className: NOTES_STYLES.editButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 458,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleDelete(note.id);
                                                            },
                                                            className: NOTES_STYLES.cancelButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 474,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 467,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                lineNumber: 434,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 418,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.noteContent,
                                        children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: editForm.content || '',
                                            onChange: (e)=>setEditForm((prev)=>({
                                                        ...prev,
                                                        content: e.target.value
                                                    })),
                                            className: NOTES_STYLES.editTextarea,
                                            rows: 6,
                                            onClick: (e)=>e.stopPropagation()
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 484,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: note.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 492,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 482,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.noteDate,
                                        children: note.updatedAt.toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 497,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${NOTES_STYLES.resizeHandle} resize-handle`,
                                        onMouseDown: (e)=>handleResizeStart(e, note.id),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                            className: NOTES_STYLES.resizeIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 506,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 502,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, note.id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 401,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.addButtonsContainer,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('idea'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonText,
                                        children: "아이디어"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 521,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('goal'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 527,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonText,
                                        children: "목표"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 528,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('reference'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 534,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonText,
                                        children: "참고"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 535,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 530,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 515,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
        lineNumber: 314,
        columnNumber: 5
    }, this);
}
_s(NotesView, "SUw+VkQ1BWybANvbMsk4QYWMoAs=");
_c = NotesView;
var _c;
__turbopack_context__.k.register(_c, "NotesView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/SynopsisView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "SynopsisView": (()=>SynopsisView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 🔥 시놉시스 편집 뷰 - 타임라인 + 카드 시스템
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/workflow.js [app-client] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 3막 구조 템플릿
const ACT_TEMPLATES = {
    1: {
        title: 'Act 1: 설정',
        color: 'from-green-500 to-emerald-600',
        description: '인물, 배경, 상황 소개'
    },
    2: {
        title: 'Act 2: 전개',
        color: 'from-blue-500 to-indigo-600',
        description: '갈등 발생과 전개'
    },
    3: {
        title: 'Act 3: 해결',
        color: 'from-purple-500 to-violet-600',
        description: '클라이맥스와 결말'
    }
};
// 🔥 플롯 타입별 스타일
const PLOT_TYPE_STYLES = {
    setup: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    },
    conflict: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    },
    resolution: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    },
    twist: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"],
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    },
    climax: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    }
};
// 🔥 스타일 정의
const SYNOPSIS_STYLES = {
    container: 'flex flex-col h-full bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
    // 🔥 헤더
    header: 'flex-shrink-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 p-4',
    headerContent: 'flex items-center justify-between',
    backButton: 'flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    title: 'text-xl font-bold text-gray-900 dark:text-gray-100',
    actions: 'flex items-center gap-2',
    actionButton: 'p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    // 🔥 메인 컨텐츠
    content: 'flex-1 min-h-0 overflow-hidden',
    timeline: 'h-full overflow-y-auto p-6',
    actsContainer: 'space-y-8',
    actSection: 'bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden',
    actHeader: 'p-4 bg-gradient-to-r text-white',
    actTitle: 'text-lg font-bold',
    actDescription: 'text-sm opacity-90 mt-1',
    actContent: 'p-4',
    // 🔥 플롯 포인트
    plotPoints: 'space-y-3',
    plotPoint: 'group bg-slate-50 dark:bg-gray-700/50 rounded-lg p-4 border border-slate-200 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors cursor-pointer',
    plotHeader: 'flex items-start justify-between',
    plotInfo: 'flex-1',
    plotTitle: 'font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400',
    plotDescription: 'text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2',
    plotMeta: 'flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400',
    plotType: 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
    plotActions: 'opacity-0 group-hover:opacity-100 transition-opacity flex gap-1',
    // 🔥 추가 버튼
    addButton: 'w-full mt-3 p-3 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg text-slate-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2 text-sm',
    // 🔥 편집 모달
    modal: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50',
    modalContent: 'bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden',
    modalHeader: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700',
    modalTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    modalBody: 'p-4 overflow-y-auto',
    modalFooter: 'flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-gray-700',
    // 🔥 폼 스타일
    formGroup: 'mb-4',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
    input: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    textarea: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
    select: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    button: 'px-4 py-2 rounded-lg font-medium transition-colors',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
};
function SynopsisView({ synopsisId, onBack }) {
    _s();
    // 🔥 상태 관리 - localStorage에서 데이터 복원
    const [plotPoints, setPlotPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SynopsisView.useState": ()=>{
            try {
                const saved = localStorage.getItem(`synopsis_${synopsisId}`);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return parsed.map({
                        "SynopsisView.useState": (plot)=>({
                                ...plot,
                                createdAt: new Date(plot.createdAt),
                                updatedAt: new Date(plot.updatedAt)
                            })
                    }["SynopsisView.useState"]);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('SYNOPSIS_VIEW', 'Failed to load synopsis from localStorage', {
                    error
                });
            }
            // 기본 mock 데이터
            return [
                {
                    id: '1',
                    act: 1,
                    title: '주인공 소개',
                    description: '평범한 일상을 보내는 주인공의 모습을 보여준다. 성격과 배경을 자연스럽게 드러낸다.',
                    type: 'setup',
                    characters: [
                        '주인공'
                    ],
                    location: '주인공의 집',
                    order: 1,
                    duration: undefined,
                    notes: undefined,
                    importance: 'medium',
                    createdAt: new Date('2024-01-10'),
                    updatedAt: new Date('2024-01-15')
                },
                {
                    id: '2',
                    act: 1,
                    title: '사건의 시작',
                    description: '평범한 일상을 깨뜨리는 중요한 사건이 발생한다. 주인공이 선택해야 할 기로에 선다.',
                    type: 'conflict',
                    characters: [
                        '주인공',
                        '조력자'
                    ],
                    location: '사건 현장',
                    order: 2,
                    duration: undefined,
                    notes: undefined,
                    importance: 'high',
                    createdAt: new Date('2024-01-11'),
                    updatedAt: new Date('2024-01-16')
                },
                {
                    id: '3',
                    act: 2,
                    title: '첫 번째 시련',
                    description: '주인공이 목표를 향해 나아가면서 겪는 첫 번째 큰 어려움. 실패와 좌절을 경험한다.',
                    type: 'conflict',
                    characters: [
                        '주인공',
                        '적대자'
                    ],
                    location: '시련의 장소',
                    order: 3,
                    duration: undefined,
                    notes: undefined,
                    importance: 'medium',
                    createdAt: new Date('2024-01-12'),
                    updatedAt: new Date('2024-01-17')
                }
            ];
        }
    }["SynopsisView.useState"]);
    // 🔥 데이터 저장 함수
    const saveToLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SynopsisView.useCallback[saveToLocalStorage]": (newPlots)=>{
            try {
                localStorage.setItem(`synopsis_${synopsisId}`, JSON.stringify(newPlots));
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('SYNOPSIS_VIEW', 'Failed to save synopsis to localStorage', {
                    error
                });
            }
        }
    }["SynopsisView.useCallback[saveToLocalStorage]"], [
        synopsisId
    ]);
    // 🔥 자동 저장이 포함된 setPlotPoints 래퍼
    const updatePlotPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SynopsisView.useCallback[updatePlotPoints]": (newPlots)=>{
            if (typeof newPlots === 'function') {
                setPlotPoints({
                    "SynopsisView.useCallback[updatePlotPoints]": (prev)=>{
                        const updated = newPlots(prev);
                        saveToLocalStorage(updated);
                        return updated;
                    }
                }["SynopsisView.useCallback[updatePlotPoints]"]);
            } else {
                setPlotPoints(newPlots);
                saveToLocalStorage(newPlots);
            }
        }
    }["SynopsisView.useCallback[updatePlotPoints]"], [
        saveToLocalStorage
    ]);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('timeline');
    const [editingPlot, setEditingPlot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false
    });
    // 🔥 플롯 포인트 생성
    const createPlotPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SynopsisView.useCallback[createPlotPoint]": (act)=>{
            const newPlot = {
                id: Date.now().toString(),
                act,
                title: '새 플롯 포인트',
                description: '',
                type: 'setup',
                characters: [],
                order: plotPoints.filter({
                    "SynopsisView.useCallback[createPlotPoint]": (p)=>p.act === act
                }["SynopsisView.useCallback[createPlotPoint]"]).length + 1
            };
            setEditingPlot(newPlot);
            setShowAddModal({
                show: true,
                act
            });
        }
    }["SynopsisView.useCallback[createPlotPoint]"], [
        plotPoints
    ]);
    // 🔥 플롯 포인트 저장
    const savePlotPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SynopsisView.useCallback[savePlotPoint]": ()=>{
            if (!editingPlot) return;
            if (showAddModal.show) {
                setPlotPoints({
                    "SynopsisView.useCallback[savePlotPoint]": (prev)=>[
                            ...prev,
                            editingPlot
                        ]
                }["SynopsisView.useCallback[savePlotPoint]"]);
            } else {
                setPlotPoints({
                    "SynopsisView.useCallback[savePlotPoint]": (prev)=>prev.map({
                            "SynopsisView.useCallback[savePlotPoint]": (p)=>p.id === editingPlot.id ? editingPlot : p
                        }["SynopsisView.useCallback[savePlotPoint]"])
                }["SynopsisView.useCallback[savePlotPoint]"]);
            }
            setEditingPlot(null);
            setShowAddModal({
                show: false
            });
        }
    }["SynopsisView.useCallback[savePlotPoint]"], [
        editingPlot,
        showAddModal.show
    ]);
    // 🔥 플롯 포인트 삭제
    const deletePlotPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SynopsisView.useCallback[deletePlotPoint]": (id)=>{
            setPlotPoints({
                "SynopsisView.useCallback[deletePlotPoint]": (prev)=>prev.filter({
                        "SynopsisView.useCallback[deletePlotPoint]": (p)=>p.id !== id
                    }["SynopsisView.useCallback[deletePlotPoint]"])
            }["SynopsisView.useCallback[deletePlotPoint]"]);
        }
    }["SynopsisView.useCallback[deletePlotPoint]"], []);
    // 🔥 막별 플롯 포인트 필터링
    const getPlotPointsByAct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SynopsisView.useCallback[getPlotPointsByAct]": (act)=>{
            return plotPoints.filter({
                "SynopsisView.useCallback[getPlotPointsByAct]": (p)=>p.act === act
            }["SynopsisView.useCallback[getPlotPointsByAct]"]).sort({
                "SynopsisView.useCallback[getPlotPointsByAct]": (a, b)=>a.order - b.order
            }["SynopsisView.useCallback[getPlotPointsByAct]"]);
        }
    }["SynopsisView.useCallback[getPlotPointsByAct]"], [
        plotPoints
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: SYNOPSIS_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SYNOPSIS_STYLES.header,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SYNOPSIS_STYLES.headerContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onBack,
                            className: SYNOPSIS_STYLES.backButton,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 267,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "구조로 돌아가기"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 268,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 263,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: SYNOPSIS_STYLES.title,
                            children: "시놉시스 편집"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 271,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.actions,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mr-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('timeline'),
                                            className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`,
                                            title: "타임라인 뷰",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    size: 16,
                                                    className: "mr-1.5 inline"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 33
                                                }, this),
                                                "타임라인"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 275,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('outline'),
                                            className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'outline' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`,
                                            title: "아웃라인 뷰",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    size: 16,
                                                    className: "mr-1.5 inline"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 33
                                                }, this),
                                                "아웃라인"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 286,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('mindmap'),
                                            className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'mindmap' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`,
                                            title: "마인드맵 뷰",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"], {
                                                    size: 16,
                                                    className: "mr-1.5 inline"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 33
                                                }, this),
                                                "마인드맵"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 297,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 274,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: SYNOPSIS_STYLES.actionButton,
                                    title: "저장",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 310,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 309,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 273,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                    lineNumber: 262,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 261,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SYNOPSIS_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SYNOPSIS_STYLES.timeline,
                    children: [
                        viewMode === 'timeline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.actsContainer,
                            children: [
                                1,
                                2,
                                3
                            ].map((act)=>{
                                const actTemplate = ACT_TEMPLATES[act];
                                const actPlots = getPlotPointsByAct(act);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.actSection,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${SYNOPSIS_STYLES.actHeader} bg-gradient-to-r ${actTemplate.color}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: SYNOPSIS_STYLES.actTitle,
                                                    children: actTemplate.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: SYNOPSIS_STYLES.actDescription,
                                                    children: actTemplate.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 332,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 330,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: SYNOPSIS_STYLES.actContent,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: SYNOPSIS_STYLES.plotPoints,
                                                    children: actPlots.map((plot)=>{
                                                        const TypeIcon = PLOT_TYPE_STYLES[plot.type].icon;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: SYNOPSIS_STYLES.plotPoint,
                                                            onClick: ()=>setEditingPlot(plot),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: SYNOPSIS_STYLES.plotHeader,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: SYNOPSIS_STYLES.plotInfo,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: SYNOPSIS_STYLES.plotTitle,
                                                                                children: plot.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 349,
                                                                                columnNumber: 69
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: SYNOPSIS_STYLES.plotDescription,
                                                                                children: plot.description
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 352,
                                                                                columnNumber: 69
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: SYNOPSIS_STYLES.plotMeta,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: `${SYNOPSIS_STYLES.plotType} ${PLOT_TYPE_STYLES[plot.type].color}`,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypeIcon, {
                                                                                                size: 12
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                                lineNumber: 357,
                                                                                                columnNumber: 77
                                                                                            }, this),
                                                                                            plot.type
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                        lineNumber: 356,
                                                                                        columnNumber: 73
                                                                                    }, this),
                                                                                    plot.characters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                                                size: 12
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                                lineNumber: 362,
                                                                                                columnNumber: 81
                                                                                            }, this),
                                                                                            plot.characters.join(', ')
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                        lineNumber: 361,
                                                                                        columnNumber: 77
                                                                                    }, this),
                                                                                    plot.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                                                size: 12
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                                lineNumber: 368,
                                                                                                columnNumber: 81
                                                                                            }, this),
                                                                                            plot.location
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                        lineNumber: 367,
                                                                                        columnNumber: 77
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 355,
                                                                                columnNumber: 69
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                        lineNumber: 348,
                                                                        columnNumber: 65
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: SYNOPSIS_STYLES.plotActions,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    setEditingPlot(plot);
                                                                                },
                                                                                className: SYNOPSIS_STYLES.actionButton,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                    lineNumber: 383,
                                                                                    columnNumber: 73
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 376,
                                                                                columnNumber: 69
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    deletePlotPoint(plot.id);
                                                                                },
                                                                                className: SYNOPSIS_STYLES.actionButton,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                    lineNumber: 392,
                                                                                    columnNumber: 73
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 385,
                                                                                columnNumber: 69
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                        lineNumber: 375,
                                                                        columnNumber: 65
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                lineNumber: 347,
                                                                columnNumber: 61
                                                            }, this)
                                                        }, plot.id, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                            lineNumber: 342,
                                                            columnNumber: 57
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>createPlotPoint(act),
                                                    className: SYNOPSIS_STYLES.addButton,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                            lineNumber: 406,
                                                            columnNumber: 49
                                                        }, this),
                                                        "새 플롯 포인트 추가"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 336,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, act, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 328,
                                    columnNumber: 37
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 321,
                            columnNumber: 25
                        }, this),
                        viewMode === 'outline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",
                                        children: "구조 개요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 420,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: plotPoints.map((plot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-l-4 border-blue-400 pl-4 py-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium text-blue-600 dark:text-blue-400",
                                                                children: [
                                                                    "Act ",
                                                                    plot.act
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                lineNumber: 425,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full",
                                                                children: PLOT_TYPE_STYLES[plot.type].icon && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PLOT_TYPE_STYLES[plot.type].icon, {
                                                                    size: 12
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                lineNumber: 428,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                        lineNumber: 424,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "font-medium text-gray-900 dark:text-gray-100",
                                                        children: plot.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 dark:text-gray-400 mt-1",
                                                        children: plot.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                        lineNumber: 435,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, plot.id, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                lineNumber: 423,
                                                columnNumber: 41
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 421,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                lineNumber: 419,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 418,
                            columnNumber: 25
                        }, this),
                        viewMode === 'mindmap' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6",
                                    children: "관계도"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 446,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-8 min-h-[400px]",
                                    children: [
                                        1,
                                        2,
                                        3
                                    ].map((act)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-center p-3 rounded-lg bg-gradient-to-r ${ACT_TEMPLATES[act].color} text-white font-semibold`,
                                                    children: ACT_TEMPLATES[act].title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: getPlotPointsByAct(act).map((plot)=>{
                                                        // 🔥 롱프레스 핸들러 - 간단한 타이머 방식
                                                        let pressTimer = null;
                                                        const handleMouseDown = ()=>{
                                                            pressTimer = setTimeout(()=>{
                                                                setEditingPlot(plot);
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SYNOPSIS_VIEW', '롱프레스로 편집 모드 활성화', {
                                                                    title: plot.title
                                                                });
                                                            }, 500);
                                                        };
                                                        const handleMouseUp = ()=>{
                                                            if (pressTimer) {
                                                                clearTimeout(pressTimer);
                                                                pressTimer = null;
                                                            }
                                                        };
                                                        const handleMouseLeave = ()=>{
                                                            if (pressTimer) {
                                                                clearTimeout(pressTimer);
                                                                pressTimer = null;
                                                            }
                                                        };
                                                        const handleClick = ()=>{
                                                            // 짧은 클릭 시 편집 모드
                                                            setEditingPlot(plot);
                                                        };
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors",
                                                            onClick: handleClick,
                                                            onMouseDown: handleMouseDown,
                                                            onMouseUp: handleMouseUp,
                                                            onMouseLeave: handleMouseLeave,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "font-medium text-gray-900 dark:text-gray-100 mb-1",
                                                                    children: plot.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                    lineNumber: 489,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-gray-600 dark:text-gray-400",
                                                                    children: [
                                                                        plot.description?.slice(0, 60),
                                                                        "..."
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                    lineNumber: 492,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, plot.id, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                            lineNumber: 481,
                                                            columnNumber: 53
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, act, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 449,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 447,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 445,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                    lineNumber: 318,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 317,
                columnNumber: 13
            }, this),
            (editingPlot || showAddModal.show) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SYNOPSIS_STYLES.modal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SYNOPSIS_STYLES.modalContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.modalHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: SYNOPSIS_STYLES.modalTitle,
                                    children: showAddModal.show ? '새 플롯 포인트' : '플롯 포인트 편집'
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 512,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setEditingPlot(null);
                                        setShowAddModal({
                                            show: false
                                        });
                                    },
                                    className: SYNOPSIS_STYLES.actionButton,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 522,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 515,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 511,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.modalBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "제목"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 528,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: editingPlot?.title || '',
                                            onChange: (e)=>setEditingPlot((prev)=>prev ? {
                                                        ...prev,
                                                        title: e.target.value
                                                    } : null),
                                            className: SYNOPSIS_STYLES.input,
                                            placeholder: "플롯 포인트 제목"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 529,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 527,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "설명"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 539,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: editingPlot?.description || '',
                                            onChange: (e)=>setEditingPlot((prev)=>prev ? {
                                                        ...prev,
                                                        description: e.target.value
                                                    } : null),
                                            className: SYNOPSIS_STYLES.textarea,
                                            rows: 4,
                                            placeholder: "상세한 설명을 입력하세요..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 540,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 538,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "타입"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 550,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: editingPlot?.type || 'setup',
                                            onChange: (e)=>setEditingPlot((prev)=>prev ? {
                                                        ...prev,
                                                        type: e.target.value
                                                    } : null),
                                            className: SYNOPSIS_STYLES.select,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "setup",
                                                    children: "설정"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "conflict",
                                                    children: "갈등"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "resolution",
                                                    children: "해결"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 558,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "twist",
                                                    children: "반전"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "climax",
                                                    children: "클라이맥스"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 551,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 549,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "장소"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 565,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: editingPlot?.location || '',
                                            onChange: (e)=>setEditingPlot((prev)=>prev ? {
                                                        ...prev,
                                                        location: e.target.value
                                                    } : null),
                                            className: SYNOPSIS_STYLES.input,
                                            placeholder: "이벤트가 일어나는 장소"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 566,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 564,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 526,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.modalFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setEditingPlot(null);
                                        setShowAddModal({
                                            show: false
                                        });
                                    },
                                    className: `${SYNOPSIS_STYLES.button} ${SYNOPSIS_STYLES.secondaryButton}`,
                                    children: "취소"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 577,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: savePlotPoint,
                                    className: `${SYNOPSIS_STYLES.button} ${SYNOPSIS_STYLES.primaryButton}`,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 586,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 576,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                    lineNumber: 510,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 509,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
        lineNumber: 259,
        columnNumber: 9
    }, this);
}
_s(SynopsisView, "XsHbRsPv+klc/1loNLBVKotKOHI=");
_c = SynopsisView;
var _c;
__turbopack_context__.k.register(_c, "SynopsisView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/views/IdeaView.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "IdeaView": (()=>IdeaView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// 🔥 아이디어 편집 뷰 - 창의적 발상과 영감 관리 시스템
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3x3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-3x3.js [app-client] (ecmascript) <export default as Grid3x3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo-2.js [app-client] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/redo-2.js [app-client] (ecmascript) <export default as Redo2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 카테고리별 스타일
const CATEGORY_STYLES = {
    character: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        label: '캐릭터'
    },
    plot: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        label: '플롯'
    },
    setting: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        label: '설정'
    },
    dialogue: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        label: '대사'
    },
    theme: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        label: '테마'
    },
    other: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"],
        color: 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300',
        label: '기타'
    }
};
// 🔥 개발 단계별 스타일
const STAGE_STYLES = {
    initial: {
        color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
        label: '초기'
    },
    developing: {
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        label: '발전'
    },
    concrete: {
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        label: '구체화'
    },
    applied: {
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        label: '적용됨'
    }
};
// 🔥 스타일 정의
const IDEA_STYLES = {
    container: 'flex-1 h-full bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
    // 🔥 헤더
    header: 'sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700',
    headerTop: 'flex items-center justify-between p-4',
    backButton: 'flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    title: 'text-xl font-bold text-gray-900 dark:text-gray-100',
    headerActions: 'flex items-center gap-2',
    // 🔥 빠른 캡처
    quickCapture: 'p-4 border-b border-slate-200 dark:border-gray-700',
    captureInput: 'w-full px-4 py-3 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400',
    captureButton: 'mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap min-w-[80px]',
    toolbar: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700',
    toolbarLeft: 'flex items-center gap-3',
    toolbarRight: 'flex items-center gap-2',
    viewToggle: 'flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1',
    viewButton: 'p-2 rounded-md transition-colors',
    viewButtonActive: 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm',
    viewButtonInactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    // 🔥 필터
    filterButton: 'flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
    searchContainer: 'relative',
    searchInput: 'pl-9 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    searchIcon: 'absolute left-3 top-2.5 text-gray-400',
    // 🔥 메인 컨텐츠
    content: 'flex-1 overflow-hidden',
    scrollArea: 'h-full overflow-y-auto p-6',
    // 🔥 카드 뷰
    cardsContainer: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    ideaCard: 'group bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer',
    cardHeader: 'flex items-start justify-between mb-3',
    cardTitle: 'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400',
    cardActions: 'opacity-0 group-hover:opacity-100 transition-opacity flex gap-1',
    cardContent: 'text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3',
    cardFooter: 'flex items-center justify-between',
    cardMeta: 'flex items-center gap-2',
    cardTags: 'flex items-center gap-1 flex-wrap',
    // 🔥 리스트 뷰
    listContainer: 'space-y-2',
    listItem: 'group bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer',
    // 🔥 공통 요소
    badge: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap',
    tag: 'inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs whitespace-nowrap',
    actionButton: 'p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors',
    statsGrid: 'grid grid-cols-4 gap-4 mb-6',
    statCard: 'bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-4 text-center',
    statValue: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    statLabel: 'text-sm text-gray-600 dark:text-gray-400 mt-1',
    statIcon: 'w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2',
    // 🔥 빈 상태
    emptyState: 'flex flex-col items-center justify-center h-64 text-center',
    emptyIcon: 'w-16 h-16 text-gray-400 dark:text-gray-500 mb-4',
    emptyTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2',
    emptyDescription: 'text-gray-600 dark:text-gray-400 max-w-md mx-auto',
    // 🔥 모달
    modal: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50',
    modalContent: 'bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden',
    modalHeader: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700',
    modalTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    modalBody: 'p-4 overflow-y-auto',
    modalFooter: 'flex items-center justify-end gap-2 p-4 border-t border-slate-200 dark:border-gray-700',
    // 🔥 폼 스타일
    formGroup: 'mb-4',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
    input: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    textarea: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none',
    select: 'w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    button: 'px-4 py-2 rounded-lg font-medium transition-colors',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
};
function IdeaView({ ideaId, onBack }) {
    _s();
    // 🔥 상태 관리 - localStorage에서 데이터 복원
    const [ideas, setIdeas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "IdeaView.useState": ()=>{
            try {
                const saved = localStorage.getItem(`ideas_${ideaId}`);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return parsed.map({
                        "IdeaView.useState": (idea)=>({
                                ...idea,
                                createdAt: new Date(idea.createdAt),
                                updatedAt: new Date(idea.updatedAt)
                            })
                    }["IdeaView.useState"]);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('IDEA_VIEW', 'Failed to load ideas from localStorage', {
                    error
                });
            }
            // 기본 mock 데이터
            return [
                {
                    id: '1',
                    title: '신비로운 도서관',
                    content: '각 책이 살아있는 도서관. 독자가 책을 열면 그 세계로 빨려들어간다. 사서는 실제로는 차원의 수호자.',
                    category: 'setting',
                    stage: 'developing',
                    tags: [
                        '판타지',
                        '도서관',
                        '차원이동'
                    ],
                    priority: 'high',
                    connections: [],
                    attachments: [],
                    notes: 'Harry Potter의 움직이는 계단에서 영감을 받음',
                    createdAt: new Date('2024-01-15'),
                    updatedAt: new Date('2024-01-20'),
                    isFavorite: true
                },
                {
                    id: '2',
                    title: '시간을 먹는 괴물',
                    content: '사람들의 시간을 훔쳐먹는 보이지 않는 괴물. 피해자는 점점 늙어간다. 주인공만이 이를 볼 수 있다.',
                    category: 'character',
                    stage: 'concrete',
                    tags: [
                        '판타지',
                        '괴물',
                        '시간'
                    ],
                    priority: 'medium',
                    connections: [
                        '1'
                    ],
                    attachments: [],
                    notes: '',
                    createdAt: new Date('2024-01-10'),
                    updatedAt: new Date('2024-01-18'),
                    isFavorite: false
                },
                {
                    id: '3',
                    title: '"시간이 멈췄네"',
                    content: '주인공이 위기 상황에서 시간 정지 능력을 처음 발견했을 때의 첫 마디. 놀라움과 당황이 섞인 톤.',
                    category: 'dialogue',
                    stage: 'applied',
                    tags: [
                        '대사',
                        '능력각성',
                        '첫발견'
                    ],
                    priority: 'low',
                    connections: [
                        '2'
                    ],
                    attachments: [],
                    notes: '1챕터 클라이맥스에서 사용',
                    createdAt: new Date('2024-01-08'),
                    updatedAt: new Date('2024-01-25'),
                    isFavorite: true
                }
            ];
        }
    }["IdeaView.useState"]);
    // 🔥 데이터 저장 함수
    const saveToLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[saveToLocalStorage]": (newIdeas)=>{
            try {
                localStorage.setItem(`ideas_${ideaId}`, JSON.stringify(newIdeas));
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('IDEA_VIEW', 'Failed to save ideas to localStorage', {
                    error
                });
            }
        }
    }["IdeaView.useCallback[saveToLocalStorage]"], [
        ideaId
    ]);
    // 🔥 자동 저장이 포함된 setIdeas 래퍼
    const updateIdeas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[updateIdeas]": (newIdeas)=>{
            if (typeof newIdeas === 'function') {
                setIdeas({
                    "IdeaView.useCallback[updateIdeas]": (prev)=>{
                        const updated = newIdeas(prev);
                        saveToLocalStorage(updated);
                        return updated;
                    }
                }["IdeaView.useCallback[updateIdeas]"]);
            } else {
                setIdeas(newIdeas);
                saveToLocalStorage(newIdeas);
            }
        }
    }["IdeaView.useCallback[updateIdeas]"], [
        saveToLocalStorage
    ]);
    // 🔥 되돌리기/다시하기 기능
    const [undoStack, setUndoStack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [redoStack, setRedoStack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('cards');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [selectedStage, setSelectedStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [editingIdea, setEditingIdea] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quickCaptureText, setQuickCaptureText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [draggedItemId, setDraggedItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOverItemId, setDragOverItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 필터링된 아이디어
    const filteredIdeas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IdeaView.useMemo[filteredIdeas]": ()=>{
            return ideas.filter({
                "IdeaView.useMemo[filteredIdeas]": (idea)=>{
                    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || idea.content.toLowerCase().includes(searchTerm.toLowerCase()) || idea.tags.some({
                        "IdeaView.useMemo[filteredIdeas]": (tag)=>tag.toLowerCase().includes(searchTerm.toLowerCase())
                    }["IdeaView.useMemo[filteredIdeas]"]);
                    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
                    const matchesStage = selectedStage === 'all' || idea.stage === selectedStage;
                    return matchesSearch && matchesCategory && matchesStage;
                }
            }["IdeaView.useMemo[filteredIdeas]"]);
        }
    }["IdeaView.useMemo[filteredIdeas]"], [
        ideas,
        searchTerm,
        selectedCategory,
        selectedStage
    ]);
    // 🔥 통계 계산
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IdeaView.useMemo[stats]": ()=>{
            return {
                total: ideas.length,
                favorites: ideas.filter({
                    "IdeaView.useMemo[stats]": (i)=>i.isFavorite
                }["IdeaView.useMemo[stats]"]).length,
                applied: ideas.filter({
                    "IdeaView.useMemo[stats]": (i)=>i.stage === 'applied'
                }["IdeaView.useMemo[stats]"]).length,
                highPriority: ideas.filter({
                    "IdeaView.useMemo[stats]": (i)=>i.priority === 'high'
                }["IdeaView.useMemo[stats]"]).length
            };
        }
    }["IdeaView.useMemo[stats]"], [
        ideas
    ]);
    // 🔥 되돌리기/다시하기 함수들
    const saveToUndoStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[saveToUndoStack]": (currentIdeas)=>{
            setUndoStack({
                "IdeaView.useCallback[saveToUndoStack]": (prev)=>[
                        ...prev.slice(-19),
                        currentIdeas
                    ]
            }["IdeaView.useCallback[saveToUndoStack]"]); // 최대 20개 상태만 유지
            setRedoStack([]); // 새 동작 시 redo 스택 초기화
        }
    }["IdeaView.useCallback[saveToUndoStack]"], []);
    // 🔥 빠른 캡처
    const handleQuickCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleQuickCapture]": ()=>{
            if (!quickCaptureText.trim()) return;
            saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
            const newIdea = {
                id: Date.now().toString(),
                title: quickCaptureText.slice(0, 50) + (quickCaptureText.length > 50 ? '...' : ''),
                content: quickCaptureText,
                category: 'other',
                stage: 'initial',
                tags: [],
                priority: 'medium',
                connections: [],
                attachments: [],
                notes: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                isFavorite: false
            };
            updateIdeas({
                "IdeaView.useCallback[handleQuickCapture]": (prev)=>[
                        newIdea,
                        ...prev
                    ]
            }["IdeaView.useCallback[handleQuickCapture]"]);
            setQuickCaptureText('');
        }
    }["IdeaView.useCallback[handleQuickCapture]"], [
        quickCaptureText,
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    // 🔥 아이디어 저장
    const saveIdea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[saveIdea]": ()=>{
            if (!editingIdea) return;
            saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
            if (showAddModal) {
                const newIdea = {
                    ...editingIdea,
                    id: Date.now().toString(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                updateIdeas({
                    "IdeaView.useCallback[saveIdea]": (prev)=>[
                            newIdea,
                            ...prev
                        ]
                }["IdeaView.useCallback[saveIdea]"]);
            } else {
                updateIdeas({
                    "IdeaView.useCallback[saveIdea]": (prev)=>prev.map({
                            "IdeaView.useCallback[saveIdea]": (i)=>i.id === editingIdea.id ? {
                                    ...editingIdea,
                                    updatedAt: new Date()
                                } : i
                        }["IdeaView.useCallback[saveIdea]"])
                }["IdeaView.useCallback[saveIdea]"]);
            }
            setEditingIdea(null);
            setShowAddModal(false);
        }
    }["IdeaView.useCallback[saveIdea]"], [
        editingIdea,
        showAddModal,
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    // 🔥 아이디어 삭제
    const deleteIdea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[deleteIdea]": (id)=>{
            if (window.confirm('정말로 이 아이디어를 삭제하시겠습니까?')) {
                saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
                updateIdeas({
                    "IdeaView.useCallback[deleteIdea]": (prev)=>prev.filter({
                            "IdeaView.useCallback[deleteIdea]": (i)=>i.id !== id
                        }["IdeaView.useCallback[deleteIdea]"])
                }["IdeaView.useCallback[deleteIdea]"]);
            }
        }
    }["IdeaView.useCallback[deleteIdea]"], [
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    // 🔥 즐겨찾기 토글
    const toggleFavorite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[toggleFavorite]": (id)=>{
            saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
            updateIdeas({
                "IdeaView.useCallback[toggleFavorite]": (prev)=>prev.map({
                        "IdeaView.useCallback[toggleFavorite]": (i)=>i.id === id ? {
                                ...i,
                                isFavorite: !i.isFavorite
                            } : i
                    }["IdeaView.useCallback[toggleFavorite]"])
            }["IdeaView.useCallback[toggleFavorite]"]);
        }
    }["IdeaView.useCallback[toggleFavorite]"], [
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    const handleUndo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleUndo]": ()=>{
            if (undoStack.length === 0) return;
            const previousState = undoStack[undoStack.length - 1];
            if (!previousState) return;
            setRedoStack({
                "IdeaView.useCallback[handleUndo]": (prev)=>[
                        ...prev,
                        ideas
                    ]
            }["IdeaView.useCallback[handleUndo]"]);
            updateIdeas(previousState);
            setUndoStack({
                "IdeaView.useCallback[handleUndo]": (prev)=>prev.slice(0, -1)
            }["IdeaView.useCallback[handleUndo]"]);
        }
    }["IdeaView.useCallback[handleUndo]"], [
        ideas,
        undoStack,
        updateIdeas
    ]);
    const handleRedo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleRedo]": ()=>{
            if (redoStack.length === 0) return;
            const nextState = redoStack[redoStack.length - 1];
            if (!nextState) return;
            setUndoStack({
                "IdeaView.useCallback[handleRedo]": (prev)=>[
                        ...prev,
                        ideas
                    ]
            }["IdeaView.useCallback[handleRedo]"]);
            updateIdeas(nextState);
            setRedoStack({
                "IdeaView.useCallback[handleRedo]": (prev)=>prev.slice(0, -1)
            }["IdeaView.useCallback[handleRedo]"]);
        }
    }["IdeaView.useCallback[handleRedo]"], [
        ideas,
        redoStack,
        updateIdeas
    ]);
    // 🔥 단축키 처리
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleKeyDown]": (e)=>{
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            if (isMac) {
                // Mac: Cmd+Z (Undo), Cmd+Shift+Z (Redo)
                if (e.metaKey && e.key === 'z') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        handleRedo();
                    } else {
                        handleUndo();
                    }
                }
            } else {
                // Windows/Linux: Ctrl+Z (Undo), Ctrl+Y (Redo)
                if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    handleUndo();
                } else if (e.ctrlKey && e.key === 'y') {
                    e.preventDefault();
                    handleRedo();
                }
            }
        }
    }["IdeaView.useCallback[handleKeyDown]"], [
        handleUndo,
        handleRedo
    ]);
    // 🔥 단축키 이벤트 리스너 등록
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "IdeaView.useEffect": ()=>{
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "IdeaView.useEffect": ()=>document.removeEventListener('keydown', handleKeyDown)
            })["IdeaView.useEffect"];
        }
    }["IdeaView.useEffect"], [
        handleKeyDown
    ]);
    // 🔥 새 아이디어 추가
    const handleAddNewIdea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleAddNewIdea]": ()=>{
            const newIdea = {
                id: Date.now().toString(),
                title: '',
                content: '',
                category: 'other',
                stage: 'initial',
                tags: [],
                priority: 'medium',
                connections: [],
                attachments: [],
                notes: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                isFavorite: false
            };
            setEditingIdea(newIdea);
            setShowAddModal(true);
        }
    }["IdeaView.useCallback[handleAddNewIdea]"], []);
    // 🔥 드래그 앤 드롭 핸들러
    const handleDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleDragStart]": (e, ideaId)=>{
            setDraggedItemId(ideaId);
            e.dataTransfer.effectAllowed = 'move';
        }
    }["IdeaView.useCallback[handleDragStart]"], []);
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleDragOver]": (e, ideaId)=>{
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOverItemId(ideaId);
        }
    }["IdeaView.useCallback[handleDragOver]"], []);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleDragLeave]": ()=>{
            setDragOverItemId(null);
        }
    }["IdeaView.useCallback[handleDragLeave]"], []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IdeaView.useCallback[handleDrop]": (e, targetId)=>{
            e.preventDefault();
            if (!draggedItemId || draggedItemId === targetId) {
                setDraggedItemId(null);
                setDragOverItemId(null);
                return;
            }
            saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
            const draggedIndex = ideas.findIndex({
                "IdeaView.useCallback[handleDrop].draggedIndex": (idea)=>idea.id === draggedItemId
            }["IdeaView.useCallback[handleDrop].draggedIndex"]);
            const targetIndex = ideas.findIndex({
                "IdeaView.useCallback[handleDrop].targetIndex": (idea)=>idea.id === targetId
            }["IdeaView.useCallback[handleDrop].targetIndex"]);
            if (draggedIndex === -1 || targetIndex === -1) return;
            const newIdeas = [
                ...ideas
            ];
            const draggedItem = newIdeas.splice(draggedIndex, 1)[0];
            if (draggedItem) {
                newIdeas.splice(targetIndex, 0, draggedItem);
                updateIdeas(newIdeas);
            }
            setDraggedItemId(null);
            setDragOverItemId(null);
        }
    }["IdeaView.useCallback[handleDrop]"], [
        draggedItemId,
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: IDEA_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: IDEA_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: IDEA_STYLES.headerTop,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onBack,
                                className: IDEA_STYLES.backButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 494,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "구조로 돌아가기"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 495,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 493,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: IDEA_STYLES.title,
                                children: "아이디어 관리"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 498,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: IDEA_STYLES.headerActions,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 mr-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleUndo,
                                                disabled: undoStack.length === 0,
                                                className: `${IDEA_STYLES.button} ${undoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`,
                                                title: "되돌리기 (Ctrl+Z / Cmd+Z)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 508,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 502,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleRedo,
                                                disabled: redoStack.length === 0,
                                                className: `${IDEA_STYLES.button} ${redoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`,
                                                title: "다시하기 (Ctrl+Y / Cmd+Shift+Z)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__["Redo2"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 516,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 510,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 501,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleAddNewIdea,
                                        className: `${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 16,
                                                className: "mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 523,
                                                columnNumber: 29
                                            }, this),
                                            "새 아이디어"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 519,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 500,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                        lineNumber: 492,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: IDEA_STYLES.quickCapture,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: quickCaptureText,
                                    onChange: (e)=>setQuickCaptureText(e.target.value),
                                    placeholder: "💡 떠오른 아이디어를 빠르게 메모하세요... (Enter로 저장)",
                                    className: IDEA_STYLES.captureInput,
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter') {
                                            handleQuickCapture();
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 532,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleQuickCapture,
                                    disabled: !quickCaptureText.trim(),
                                    className: IDEA_STYLES.captureButton,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 544,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 531,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                        lineNumber: 530,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: IDEA_STYLES.toolbar,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: IDEA_STYLES.toolbarLeft,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: IDEA_STYLES.searchContainer,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                size: 16,
                                                className: IDEA_STYLES.searchIcon
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 558,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: searchTerm,
                                                onChange: (e)=>setSearchTerm(e.target.value),
                                                placeholder: "아이디어 검색...",
                                                className: IDEA_STYLES.searchInput
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 559,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 557,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedCategory,
                                        onChange: (e)=>setSelectedCategory(e.target.value),
                                        className: IDEA_STYLES.filterButton,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "모든 카테고리"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 573,
                                                columnNumber: 29
                                            }, this),
                                            Object.entries(CATEGORY_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: key,
                                                    children: value.label
                                                }, key, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 575,
                                                    columnNumber: 33
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 568,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedStage,
                                        onChange: (e)=>setSelectedStage(e.target.value),
                                        className: IDEA_STYLES.filterButton,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "모든 단계"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 584,
                                                columnNumber: 29
                                            }, this),
                                            Object.entries(STAGE_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: key,
                                                    children: value.label
                                                }, key, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 33
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 579,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 556,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: IDEA_STYLES.toolbarRight,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.viewToggle,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('cards'),
                                            className: `${IDEA_STYLES.viewButton} ${viewMode === 'cards' ? IDEA_STYLES.viewButtonActive : IDEA_STYLES.viewButtonInactive}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3x3$3e$__["Grid3x3"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 598,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 593,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('list'),
                                            className: `${IDEA_STYLES.viewButton} ${viewMode === 'list' ? IDEA_STYLES.viewButtonActive : IDEA_STYLES.viewButtonInactive}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 605,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 600,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 592,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 591,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                        lineNumber: 555,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                lineNumber: 491,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: IDEA_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: IDEA_STYLES.scrollArea,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.statsGrid,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 618,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.total
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 619,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "총 아이디어"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 620,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 617,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 623,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.favorites
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 624,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "즐겨찾기"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 625,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 622,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 628,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.applied
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 629,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "적용됨"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 630,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 627,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 633,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.highPriority
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 634,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "높은 우선순위"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 635,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 632,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 616,
                            columnNumber: 21
                        }, this),
                        filteredIdeas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                    className: IDEA_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 642,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: IDEA_STYLES.emptyTitle,
                                    children: "아이디어가 없습니다"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 643,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: IDEA_STYLES.emptyDescription,
                                    children: "위의 빠른 캡처를 사용하여 첫 번째 아이디어를 추가해보세요!"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 644,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 641,
                            columnNumber: 25
                        }, this) : viewMode === 'cards' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.cardsContainer,
                            children: filteredIdeas.map((idea)=>{
                                const CategoryIcon = CATEGORY_STYLES[idea.category].icon;
                                // 🔥 편집 핸들러들 (Hook 제거)
                                const handleIdeaClick = ()=>{
                                    setEditingIdea(idea);
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('IDEA_VIEW', '클릭으로 편집 모드 활성화', {
                                        title: idea.title
                                    });
                                };
                                const handleIdeaDoubleClick = ()=>{
                                    setEditingIdea(idea);
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('IDEA_VIEW', '더블클릭으로 편집 모드', {
                                        title: idea.title
                                    });
                                };
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${IDEA_STYLES.ideaCard} ${draggedItemId === idea.id ? 'opacity-50' : ''} ${dragOverItemId === idea.id ? 'ring-2 ring-blue-500' : ''} select-none cursor-pointer`,
                                    style: {
                                        userSelect: 'none'
                                    },
                                    draggable: false,
                                    onClick: handleIdeaClick,
                                    onDoubleClick: handleIdeaDoubleClick,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.cardHeader,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: IDEA_STYLES.cardTitle,
                                                    children: idea.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 681,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: IDEA_STYLES.cardActions,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                toggleFavorite(idea.id);
                                                            },
                                                            className: IDEA_STYLES.actionButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                size: 14,
                                                                className: idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 690,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 683,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                deleteIdea(idea.id);
                                                            },
                                                            className: IDEA_STYLES.actionButton,
                                                            title: "삭제",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 704,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 695,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 682,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 680,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: IDEA_STYLES.cardContent,
                                            children: idea.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 709,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.cardFooter,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: IDEA_STYLES.cardMeta,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `${IDEA_STYLES.badge} ${CATEGORY_STYLES[idea.category].color}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
                                                                    size: 12
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                    lineNumber: 714,
                                                                    columnNumber: 53
                                                                }, this),
                                                                CATEGORY_STYLES[idea.category].label
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 713,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `${IDEA_STYLES.badge} ${STAGE_STYLES[idea.stage].color}`,
                                                            children: STAGE_STYLES[idea.stage].label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 717,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 712,
                                                    columnNumber: 45
                                                }, this),
                                                idea.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: IDEA_STYLES.cardTags,
                                                    children: [
                                                        idea.tags.slice(0, 3).map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: IDEA_STYLES.tag,
                                                                children: tag
                                                            }, index, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 725,
                                                                columnNumber: 57
                                                            }, this)),
                                                        idea.tags.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: IDEA_STYLES.tag,
                                                            children: [
                                                                "+",
                                                                idea.tags.length - 3
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 730,
                                                            columnNumber: 57
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 723,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 711,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, idea.id, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 665,
                                    columnNumber: 37
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 649,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.listContainer,
                            children: filteredIdeas.map((idea)=>{
                                const CategoryIcon = CATEGORY_STYLES[idea.category].icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.listItem,
                                    onClick: ()=>setEditingIdea(idea),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-semibold text-gray-900 dark:text-gray-100",
                                                                children: idea.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 753,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `${IDEA_STYLES.badge} ${CATEGORY_STYLES[idea.category].color}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                        lineNumber: 757,
                                                                        columnNumber: 57
                                                                    }, this),
                                                                    CATEGORY_STYLES[idea.category].label
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 756,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `${IDEA_STYLES.badge} ${STAGE_STYLES[idea.stage].color}`,
                                                                children: STAGE_STYLES[idea.stage].label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 760,
                                                                columnNumber: 53
                                                            }, this),
                                                            idea.isFavorite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                size: 14,
                                                                className: "fill-yellow-400 text-yellow-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 764,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2",
                                                        children: idea.content
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 767,
                                                        columnNumber: 49
                                                    }, this),
                                                    idea.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-1 flex-wrap",
                                                        children: idea.tags.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: IDEA_STYLES.tag,
                                                                children: tag
                                                            }, index, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 773,
                                                                columnNumber: 61
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 771,
                                                        columnNumber: 53
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 751,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            toggleFavorite(idea.id);
                                                        },
                                                        className: IDEA_STYLES.actionButton,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                            size: 14,
                                                            className: idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 789,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 782,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            deleteIdea(idea.id);
                                                        },
                                                        className: IDEA_STYLES.actionButton,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 798,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 791,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 781,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 750,
                                        columnNumber: 41
                                    }, this)
                                }, idea.id, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 745,
                                    columnNumber: 37
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 740,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                    lineNumber: 614,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                lineNumber: 613,
                columnNumber: 13
            }, this),
            (editingIdea || showAddModal) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: IDEA_STYLES.modal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: IDEA_STYLES.modalContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.modalHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: IDEA_STYLES.modalTitle,
                                    children: showAddModal ? '새 아이디어' : '아이디어 편집'
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 815,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setEditingIdea(null);
                                        setShowAddModal(false);
                                    },
                                    className: IDEA_STYLES.actionButton,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 825,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 818,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 814,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.modalBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "제목"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 831,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: editingIdea?.title || '',
                                            onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                        ...prev,
                                                        title: e.target.value
                                                    } : null),
                                            className: IDEA_STYLES.input,
                                            placeholder: "아이디어 제목"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 832,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 830,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "내용"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 842,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: editingIdea?.content || '',
                                            onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                        ...prev,
                                                        content: e.target.value
                                                    } : null),
                                            className: IDEA_STYLES.textarea,
                                            rows: 4,
                                            placeholder: "아이디어의 상세한 설명을 입력하세요..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 843,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 841,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "카테고리"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 854,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editingIdea?.category || 'other',
                                                    onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                                ...prev,
                                                                category: e.target.value
                                                            } : null),
                                                    className: IDEA_STYLES.select,
                                                    children: Object.entries(CATEGORY_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: key,
                                                            children: value.label
                                                        }, key, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 861,
                                                            columnNumber: 45
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 855,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 853,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "개발 단계"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 867,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editingIdea?.stage || 'initial',
                                                    onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                                ...prev,
                                                                stage: e.target.value
                                                            } : null),
                                                    className: IDEA_STYLES.select,
                                                    children: Object.entries(STAGE_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: key,
                                                            children: value.label
                                                        }, key, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 874,
                                                            columnNumber: 45
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 868,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 866,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "우선순위"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 880,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editingIdea?.priority || 'medium',
                                                    onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                                ...prev,
                                                                priority: e.target.value
                                                            } : null),
                                                    className: IDEA_STYLES.select,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "low",
                                                            children: "낮음"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 886,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "medium",
                                                            children: "보통"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 887,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "high",
                                                            children: "높음"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 888,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 881,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 879,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 852,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "태그 (쉼표로 구분)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 894,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: editingIdea?.tags.join(', ') || '',
                                            onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                        ...prev,
                                                        tags: e.target.value.split(',').map((t)=>t.trim()).filter(Boolean)
                                                    } : null),
                                            className: IDEA_STYLES.input,
                                            placeholder: "예: 판타지, 마법, 모험"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 895,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 893,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "메모"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 905,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: editingIdea?.notes || '',
                                            onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                        ...prev,
                                                        notes: e.target.value
                                                    } : null),
                                            className: IDEA_STYLES.textarea,
                                            rows: 3,
                                            placeholder: "추가 메모나 영감의 출처를 기록하세요..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 906,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 904,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 829,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.modalFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setEditingIdea(null);
                                        setShowAddModal(false);
                                    },
                                    className: `${IDEA_STYLES.button} ${IDEA_STYLES.secondaryButton}`,
                                    children: "취소"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 917,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: saveIdea,
                                    className: `${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 926,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 916,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                    lineNumber: 813,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                lineNumber: 812,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
        lineNumber: 489,
        columnNumber: 9
    }, this);
}
_s(IdeaView, "XbiqrljRcREcZh1qepApBtkXzs0=");
_c = IdeaView;
var _c;
__turbopack_context__.k.register(_c, "IdeaView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_renderer_components_projects_views_34d4609d._.js.map