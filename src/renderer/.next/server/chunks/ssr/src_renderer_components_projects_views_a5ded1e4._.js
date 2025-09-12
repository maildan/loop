module.exports = {

"[project]/src/renderer/components/projects/views/StructureView.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "StructureView": (()=>StructureView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// 🔥 기가차드 스토리 구조 뷰 - 작가 친화적 개선
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-ssr] (ecmascript)"); // 🔥 프로젝트 데이터 가져오기
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)"); // 🔥 Logger import 추가
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDialog.tsx [app-ssr] (ecmascript)"); // 🔥 삭제 확인 다이얼로그 추가
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.js [app-ssr] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bookmark.js [app-ssr] (ecmascript) <export default as Bookmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen.js [app-ssr] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
'use client';
;
;
;
;
;
;
;
// 🔥 기가차드 작가 친화적 구조 스타일
const STRUCTURE_STYLES = {
    container: 'max-w-screen-xl mx-auto bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
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
    scrollArea: 'flex-1 overflow-y-auto overflow-x-visible',
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
    addMenu: 'absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md shadow-xl z-50 overflow-visible max-h-96 overflow-y-auto',
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
// 타입별 아이콘 매핑 (main 타입 제거)
const TYPE_ICONS = {
    chapter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
    synopsis: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
    idea: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"]
};
// 추가 메뉴 아이템 (main 타입 제거 - 실제 프로젝트 main content 사용)
const ADD_MENU_ITEMS = [
    {
        type: 'chapter',
        label: '새 장',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
        description: '스토리의 주요 단위'
    },
    {
        type: 'synopsis',
        label: '시놉시스',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        description: '이야기 개요'
    },
    {
        type: 'idea',
        label: '노트',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"],
        description: '창작 노트 및 메모'
    }
];
// 🔥 빈 배열 상수 - 참조 안정성 보장
const EMPTY_STRUCTURES = [];
const StructureView = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function StructureView({ projectId, onNavigateToChapterEdit, onNavigateToSynopsisEdit, onNavigateToIdeaEdit, onNavigateToNotesView, onAddNewChapter }) {
    // 🔥 Zustand 스토어 사용 - 참조 안정성을 위한 최적화
    const structures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>{
        const projectStructures = state.structures[projectId];
        return projectStructures || EMPTY_STRUCTURES;
    });
    // 🔥 프로젝트 데이터 가져오기 (메인 컨텐츠용)
    const projectData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectData"])(projectId);
    const addStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.addStructureItem);
    const updateStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.updateStructureItem);
    const deleteStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.deleteStructureItem);
    const setCurrentEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.setCurrentEditor);
    const [showAddMenu, setShowAddMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editTitle, setEditTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 삭제 확인 다이얼로그
    const [itemToDelete, setItemToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // 🔥 삭제할 아이템 정보
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 폴더 접기/펼치기 상태 관리 - localStorage 지원
    const [collapsedFolders, setCollapsedFolders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        // localStorage에서 상태 복원
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        return new Set();
    });
    // 🔥 강제 리렌더링을 위한 상태
    const [, forceUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const triggerUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        forceUpdate({});
    }, []);
    // 🔥 폴더 토글 함수 - localStorage 저장 포함
    const toggleFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((folderType)=>{
        setCollapsedFolders((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(folderType)) {
                newSet.delete(folderType);
            } else {
                newSet.add(folderType);
            }
            // localStorage에 저장
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_VIEW', 'Folder toggled', {
                folderType,
                collapsed: newSet.has(folderType)
            });
            return newSet;
        });
    }, [
        projectId
    ]);
    // 🔥 폴더별 데이터 그룹화 (main 타입 제거, idea → note 변경)
    const groupedStructures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const groups = {
            chapters: structures.filter((item)=>item.type === 'chapter').sort((a, b)=>new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            synopsis: structures.filter((item)=>item.type === 'synopsis').sort((a, b)=>new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            notes: structures.filter((item)=>item.type === 'idea').sort((a, b)=>new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_VIEW', 'Grouped structures', {
            chapters: groups.chapters.length,
            synopsis: groups.synopsis.length,
            notes: groups.notes.length
        });
        return groups;
    }, [
        structures
    ]);
    // 🔥 스토어 동기화 디버깅
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_VIEW', 'Structures updated', {
            projectId,
            structuresCount: structures.length,
            structures: structures.map((s)=>({
                    id: s.id,
                    title: s.title,
                    type: s.type
                }))
        });
    }, [
        structures,
        projectId
    ]);
    // 🔥 스토어 구독으로 실시간 업데이트 보장
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"].subscribe((state)=>{
            const currentStructures = state.structures[projectId] || [];
            if (currentStructures !== structures) {
                triggerUpdate();
            }
        });
        return unsubscribe;
    }, [
        projectId,
        structures,
        triggerUpdate
    ]);
    const handleAddItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (type)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Adding new item', {
            type,
            projectId
        });
        // 🔥 NEW: chapter 타입일 때는 모달을 통해 처리
        if (type === 'chapter' && onAddNewChapter) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Using chapter modal');
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
            const chapterStructures = structures.filter((item)=>item.type === 'chapter');
            const chapterCount = chapterStructures.length + 1;
            itemTitle = `${chapterCount}챕터`;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Creating new item', {
            type,
            title: itemTitle
        });
        const newItem = {
            id: `${type}_${Date.now()}`,
            title: itemTitle,
            description: '',
            type: type,
            status: 'planning',
            projectId,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            setIsLoading(true);
            // 🔥 Zustand 스토어에 추가 (비동기)
            await addStructureItem(projectId, newItem);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Item added successfully', {
                id: newItem.id,
                type,
                title: itemTitle
            });
            // 🔥 에디터 상태 업데이트 - main은 별도로 처리
            setCurrentEditor({
                projectId,
                editorType: type,
                itemId: newItem.id,
                itemTitle: newItem.title
            });
            setShowAddMenu(false);
            // 🔥 해당 타입의 에디터로 이동
            if (type === 'idea') {
                // 아이디어는 notes 뷰로 이동
                onNavigateToNotesView?.();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Navigating to notes view', {
                    ideaId: newItem.id
                });
            } else if (type === 'synopsis') {
                onNavigateToSynopsisEdit?.(newItem.id);
            } else if (type === 'chapter') {
                onNavigateToChapterEdit?.(newItem.id); // 챕터는 챕터 에디터로
            }
            // 강제 리렌더링
            triggerUpdate();
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_VIEW', 'Failed to add structure item', {
                type,
                error
            });
        } finally{
            setIsLoading(false);
        }
    }, [
        projectId,
        structures,
        addStructureItem,
        setCurrentEditor,
        onAddNewChapter,
        onNavigateToIdeaEdit,
        onNavigateToNotesView,
        onNavigateToSynopsisEdit,
        triggerUpdate
    ]);
    const handleItemClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((item)=>{
        // 🔥 에디터 상태 업데이트
        setCurrentEditor({
            projectId,
            editorType: item.type === 'main' ? 'synopsis' : item.type,
            itemId: item.id,
            itemTitle: item.title
        });
        if (item.type === 'chapter') {
            onNavigateToChapterEdit?.(item.id);
        } else if (item.type === 'idea') {
            // 🔥 아이디어는 NotesView로 이동
            onNavigateToNotesView?.();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Navigating to notes view from idea click', {
                ideaId: item.id
            });
        } else if (item.type === 'synopsis' || item.type === 'main') {
            onNavigateToSynopsisEdit?.(item.id);
        }
    }, [
        projectId,
        setCurrentEditor,
        onNavigateToChapterEdit,
        onNavigateToIdeaEdit,
        onNavigateToNotesView,
        onNavigateToSynopsisEdit
    ]);
    const handleEditStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((item)=>{
        setEditingId(item.id);
        setEditTitle(item.title);
    }, []);
    const handleEditSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        if (editTitle.trim()) {
            // 🔥 Zustand 스토어에서 업데이트
            updateStructureItem(projectId, id, {
                title: editTitle.trim()
            });
        }
        setEditingId(null);
        setEditTitle('');
    }, [
        projectId,
        editTitle,
        updateStructureItem
    ]);
    const handleEditCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setEditingId(null);
        setEditTitle('');
    }, []);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        // 🔥 삭제할 아이템 정보 찾기
        const itemToDeleteInfo = structures.find((structure)=>structure.id === id);
        if (itemToDeleteInfo) {
            setItemToDelete({
                id: itemToDeleteInfo.id,
                title: itemToDeleteInfo.title
            });
            setShowDeleteDialog(true);
        }
    }, [
        structures
    ]);
    // 🔥 삭제 확인 핸들러
    const handleConfirmDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!itemToDelete) return;
        try {
            setIsLoading(true);
            // 🔥 Zustand 스토어에서 삭제 (DB 삭제 포함)
            await deleteStructureItem(projectId, itemToDelete.id);
            // 🔥 삭제 성공 시 추가 정리 작업
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Structure item deleted successfully', {
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('STRUCTURE_VIEW', 'Failed to delete structure item', {
                id: itemToDelete.id,
                title: itemToDelete.title,
                projectId,
                error
            });
        } finally{
            setIsLoading(false);
        }
    }, [
        projectId,
        deleteStructureItem,
        editingId,
        itemToDelete,
        triggerUpdate
    ]);
    // 🔥 삭제 취소 핸들러
    const handleCancelDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setShowDeleteDialog(false);
        setItemToDelete(null);
    }, []);
    const handleKeyPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, id)=>{
        if (e.key === 'Enter') {
            handleEditSave(id);
        } else if (e.key === 'Escape') {
            handleEditCancel();
        }
    }, [
        handleEditSave,
        handleEditCancel
    ]);
    // 🔥 폴더 헤더 렌더링 함수
    const renderFolderHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((folderType, title, icon, count)=>{
        const isCollapsed = collapsedFolders.has(folderType);
        const IconComponent = icon;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between p-3 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
            onClick: ()=>toggleFolder(folderType),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `transform transition-transform ${isCollapsed ? '' : 'rotate-90'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "w-4 h-4 text-gray-500"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                            lineNumber: 426,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 425,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                        className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 428,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-gray-900 dark:text-gray-100",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 429,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full",
                        children: count
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 430,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 424,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
            lineNumber: 420,
            columnNumber: 7
        }, this);
    }, [
        collapsedFolders,
        toggleFolder
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: STRUCTURE_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: STRUCTURE_STYLES.title,
                        children: "스토리 구조"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 442,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: STRUCTURE_STYLES.subtitle,
                        children: "장, 장면, 메모를 관리하여 이야기의 흐름을 구성하세요"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                        lineNumber: 443,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 441,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: STRUCTURE_STYLES.structureList,
                    children: [
                        isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 text-center text-sm text-gray-500",
                            children: "로딩중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                            lineNumber: 452,
                            columnNumber: 13
                        }, this) : structures.length === 0 ? /* 🔥 빈 상태 */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: STRUCTURE_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                    className: STRUCTURE_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 456,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: STRUCTURE_STYLES.emptyTitle,
                                    children: "스토리 구조가 비어있습니다"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 457,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: STRUCTURE_STYLES.emptyDescription,
                                    children: "새로운 챕터, 시놉시스, 아이디어를 추가하여 스토리 구조를 구성해보세요."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 458,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                            lineNumber: 455,
                            columnNumber: 13
                        }, this) : /* 🔥 폴더형 구조 목록 */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        renderFolderHeader('main', '메인 스토리', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], 1),
                                        !collapsedFolders.has('main') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-6 space-y-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: STRUCTURE_STYLES.structureItem,
                                                onClick: ()=>{
                                                    // 메인 스토리 클릭 시 write 뷰로 이동
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('STRUCTURE_VIEW', 'Main story clicked');
                                                },
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                        className: STRUCTURE_STYLES.itemIcon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: STRUCTURE_STYLES.itemContent,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: STRUCTURE_STYLES.itemTitle,
                                                                children: "메인 스토리"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                lineNumber: 480,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: STRUCTURE_STYLES.itemType,
                                                                children: "프로젝트 메인 컨텐츠"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                lineNumber: 481,
                                                                columnNumber: 25
                                                            }, this),
                                                            projectData?.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500 mt-1",
                                                                children: [
                                                                    projectData.content.substring(0, 100),
                                                                    "..."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                lineNumber: 483,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                        lineNumber: 479,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: [
                                                            projectData?.writerStats?.wordCount || 0,
                                                            " 단어"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                lineNumber: 470,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 469,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 466,
                                    columnNumber: 15
                                }, this),
                                groupedStructures.chapters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        renderFolderHeader('chapters', '챕터', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], groupedStructures.chapters.length),
                                        !collapsedFolders.has('chapters') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-6 space-y-2",
                                            children: groupedStructures.chapters.map((item, index)=>{
                                                const isEditing = editingId === item.id;
                                                const isConnected = index < groupedStructures.chapters.length - 1;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        isConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute left-3 top-12 w-0.5 h-8 bg-blue-300 dark:bg-blue-600 z-10"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 510,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: STRUCTURE_STYLES.structureItem,
                                                            onClick: ()=>handleItemClick(item),
                                                            style: {
                                                                cursor: 'pointer'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], {
                                                                    className: STRUCTURE_STYLES.itemIcon
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                    lineNumber: 518,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: STRUCTURE_STYLES.itemContent,
                                                                    children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: editTitle,
                                                                        onChange: (e)=>setEditTitle(e.target.value),
                                                                        onKeyDown: (e)=>handleKeyPress(e, item.id),
                                                                        onBlur: ()=>handleEditSave(item.id),
                                                                        className: STRUCTURE_STYLES.editInput,
                                                                        autoFocus: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 521,
                                                                        columnNumber: 35
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: STRUCTURE_STYLES.itemTitle,
                                                                                children: item.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                                lineNumber: 532,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: STRUCTURE_STYLES.itemType,
                                                                                children: "챕터"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                                lineNumber: 533,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                    lineNumber: 519,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: STRUCTURE_STYLES.itemActions,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: (e)=>{
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleEditStart(item);
                                                                            },
                                                                            className: STRUCTURE_STYLES.actionButton,
                                                                            title: "편집",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                                lineNumber: 547,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                            lineNumber: 538,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: (e)=>{
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleDelete(item.id);
                                                                            },
                                                                            className: STRUCTURE_STYLES.actionButton,
                                                                            title: "삭제",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                                lineNumber: 558,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                            lineNumber: 549,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                    lineNumber: 537,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 513,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 501,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 498,
                                    columnNumber: 17
                                }, this),
                                groupedStructures.synopsis.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        renderFolderHeader('synopsis', '시놉시스', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], groupedStructures.synopsis.length),
                                        !collapsedFolders.has('synopsis') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-6 space-y-2",
                                            children: groupedStructures.synopsis.map((item)=>{
                                                const isEditing = editingId === item.id;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: STRUCTURE_STYLES.structureItem,
                                                    onClick: ()=>handleItemClick(item),
                                                    style: {
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: STRUCTURE_STYLES.itemIcon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: STRUCTURE_STYLES.itemContent,
                                                            children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: editTitle,
                                                                onChange: (e)=>setEditTitle(e.target.value),
                                                                onKeyDown: (e)=>handleKeyPress(e, item.id),
                                                                onBlur: ()=>handleEditSave(item.id),
                                                                className: STRUCTURE_STYLES.editInput,
                                                                autoFocus: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                lineNumber: 589,
                                                                columnNumber: 33
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: STRUCTURE_STYLES.itemTitle,
                                                                        children: item.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 600,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: STRUCTURE_STYLES.itemType,
                                                                        children: "시놉시스"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 601,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, void 0, true)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 587,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: STRUCTURE_STYLES.itemActions,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: (e)=>{
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleEditStart(item);
                                                                    },
                                                                    className: STRUCTURE_STYLES.actionButton,
                                                                    title: "편집",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 615,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                    lineNumber: 606,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: (e)=>{
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleDelete(item.id);
                                                                    },
                                                                    className: STRUCTURE_STYLES.actionButton,
                                                                    title: "삭제",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 626,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                    lineNumber: 617,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 605,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 575,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 572,
                                    columnNumber: 17
                                }, this),
                                groupedStructures.notes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        renderFolderHeader('notes', '노트', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], groupedStructures.notes.length),
                                        !collapsedFolders.has('notes') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-6 space-y-2",
                                            children: groupedStructures.notes.map((item)=>{
                                                const isEditing = editingId === item.id;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: STRUCTURE_STYLES.structureItem,
                                                    onClick: ()=>handleItemClick(item),
                                                    style: {
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"], {
                                                            className: STRUCTURE_STYLES.itemIcon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 653,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: STRUCTURE_STYLES.itemContent,
                                                            children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: editTitle,
                                                                onChange: (e)=>setEditTitle(e.target.value),
                                                                onKeyDown: (e)=>handleKeyPress(e, item.id),
                                                                onBlur: ()=>handleEditSave(item.id),
                                                                className: STRUCTURE_STYLES.editInput,
                                                                autoFocus: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                lineNumber: 656,
                                                                columnNumber: 33
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: STRUCTURE_STYLES.itemTitle,
                                                                        children: item.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 667,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: STRUCTURE_STYLES.itemType,
                                                                        children: "노트"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 668,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, void 0, true)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: STRUCTURE_STYLES.itemActions,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: (e)=>{
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleEditStart(item);
                                                                    },
                                                                    className: STRUCTURE_STYLES.actionButton,
                                                                    title: "편집",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 682,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                    lineNumber: 673,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: (e)=>{
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleDelete(item.id);
                                                                    },
                                                                    className: STRUCTURE_STYLES.actionButton,
                                                                    title: "삭제",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                        lineNumber: 693,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                                    lineNumber: 684,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 672,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 647,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 642,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 639,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                            lineNumber: 464,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: STRUCTURE_STYLES.addMenuContainer,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowAddMenu(!showAddMenu);
                                    },
                                    className: STRUCTURE_STYLES.addButton,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 716,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "새 항목 추가"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 717,
                                            columnNumber: 15
                                        }, this),
                                        showAddMenu ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 718,
                                            columnNumber: 30
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 718,
                                            columnNumber: 68
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 708,
                                    columnNumber: 13
                                }, this),
                                showAddMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: STRUCTURE_STYLES.addMenu,
                                    children: ADD_MENU_ITEMS.map(({ type, label, icon: Icon, description })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: (e)=>{
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleAddItem(type);
                                            },
                                            className: STRUCTURE_STYLES.addMenuItem,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 733,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-gray-900 dark:text-gray-100",
                                                            children: label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 735,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                                            children: description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                            lineNumber: 738,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 734,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, type, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 724,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                    lineNumber: 722,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                            lineNumber: 707,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                    lineNumber: 450,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                lineNumber: 449,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
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
                lineNumber: 751,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
        lineNumber: 439,
        columnNumber: 5
    }, this);
});
;
}}),
"[project]/src/renderer/components/projects/views/CharactersView.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CharactersView": (()=>CharactersView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// 🔥 기가차드 캐릭터 뷰 - 상세 정보 확장 및 정보 과부하 방지
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDialog.tsx [app-ssr] (ecmascript)"); // 🔥 ConfirmDialog 추가
'use client';
;
;
;
;
;
// 🔥 기가차드 캐릭터 스타일 - 카드 기반 레이아웃
const CHARACTERS_STYLES = {
    container: 'h-full flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
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
    // 🔥 콘텐츠 영역 - 강제 높이 설정
    content: 'flex-1 flex flex-col min-h-0 h-full',
    scrollArea: 'flex-1 overflow-y-auto max-h-full h-0',
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    },
    {
        id: 'details',
        label: '상세',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    },
    {
        id: 'story',
        label: '스토리',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"]
    }
];
function CharactersView({ projectId, characters, onCharactersChange, focusMode = false }) {
    const [selectedCharacterId, setSelectedCharacterId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [editingCharacter, setEditingCharacter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // 🔥 삭제 관련 상태
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [characterToDelete, setCharacterToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
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
    const handleEditSubmit = async ()=>{
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
                const isNewCharacter = editingCharacter.id === editForm.id && !characters.find((char)=>char.id === editingCharacter.id);
                const updatedCharacters = isNewCharacter ? [
                    ...characters,
                    result.data
                ] : characters.map((char)=>char.id === editingCharacter.id ? result.data : char);
                // 🔥 즉시 상태 업데이트
                onCharactersChange(updatedCharacters);
                // 🔥 편집 상태 초기화
                setEditingCharacter(null);
                setEditForm({});
                // 🔥 컴포넌트 강제 리렌더링 유발
                setTimeout(()=>{
                    onCharactersChange([
                        ...updatedCharacters
                    ]);
                }, 100);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Character saved', {
                    id: result.data.id,
                    isNew: isNewCharacter
                });
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CHARACTERS_VIEW', 'Failed to save character', error);
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Delete dialog opened', {
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Character deleted successfully', {
                id: characterToDelete.id,
                name: characterToDelete.name
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CHARACTERS_VIEW', 'Failed to delete character', {
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
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.tabContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "역할"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.role || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "역할을 설정해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 242,
                                        columnNumber: 36
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 241,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 239,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "설명"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 246,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.description || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터 설명을 추가해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 248,
                                        columnNumber: 43
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 238,
                    columnNumber: 11
                }, this);
            case 'details':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.tabContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "외모"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 258,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.appearance || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "외모를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 260,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 259,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 257,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "나이"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 264,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.age || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "나이를 설정해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 266,
                                        columnNumber: 35
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 265,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 263,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "직업"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 270,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.occupation || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "직업을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 272,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 271,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 269,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "출신 / 거주지"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.birthplace || character.residence ? `${character.birthplace || '미기록'} / ${character.residence || '미기록'}` : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "출신지와 거주지를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 280,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 277,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "가족"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 285,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.family || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "가족 관계를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 287,
                                        columnNumber: 38
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 286,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 284,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 256,
                    columnNumber: 11
                }, this);
            case 'story':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.tabContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "성격"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 297,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.personality || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "성격을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 299,
                                        columnNumber: 43
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 296,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "배경"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 303,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.background || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터 배경을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 305,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 304,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 302,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.fieldGroup,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldLabel,
                                    children: "목표"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 309,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.goals || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터의 목표를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 311,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 310,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 308,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 295,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: CHARACTERS_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: CHARACTERS_STYLES.headerTop,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: CHARACTERS_STYLES.title,
                                    children: "등장인물"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 328,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CHARACTERS_STYLES.subtitle,
                                    children: "이야기 속 캐릭터들의 상세한 프로필을 관리하세요. 체계적인 캐릭터 설정으로 더욱 생생한 스토리를 만들어보세요."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 329,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 327,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: CHARACTERS_STYLES.statsGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 339,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.total
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "총 인물"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.main
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 345,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "주요 인물"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 343,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 349,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.detailed
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "상세 설정"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 351,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.scrollArea,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: CHARACTERS_STYLES.contentPadding,
                        children: characters.length === 0 ? // 빈 상태
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                    className: CHARACTERS_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 363,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: CHARACTERS_STYLES.emptyTitle,
                                    children: "첫 번째 인물을 만들어보세요"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 364,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CHARACTERS_STYLES.emptyDescription,
                                    children: "매력적인 캐릭터들이 당신의 이야기를 더욱 생동감 있게 만들어줄 것입니다. 주인공부터 조연까지, 각자의 특별한 이야기를 담아보세요."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 365,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddCharacter,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary} mt-6`,
                                    children: "첫 인물 만들기"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 369,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 362,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', '더블클릭으로 편집 모드 활성화', {
                                            name: character.name
                                        });
                                    };
                                    // 🔥 Long press 핸들러 - 간단한 타이머 방식
                                    let pressTimer = null;
                                    const handleMouseDown = ()=>{
                                        pressTimer = setTimeout(()=>{
                                            handleEditStart(character);
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Long press detected - entering edit mode', {
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
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${CHARACTERS_STYLES.characterCard} ${focusMode && selectedCharacterId !== character.id ? 'opacity-30 blur-[1px] scale-95 transition-all duration-300' : 'opacity-100 blur-0 scale-100 transition-all duration-300'}`,
                                        onClick: handleCharacterClick,
                                        onDoubleClick: handleCharacterDoubleClick,
                                        onMouseDown: handleMouseDown,
                                        onMouseUp: handleMouseUp,
                                        onMouseLeave: handleMouseLeave,
                                        onMouseEnter: ()=>focusMode && setSelectedCharacterId(character.id),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: CHARACTERS_STYLES.actionButtons,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditStart(character);
                                                            },
                                                            className: CHARACTERS_STYLES.editButton,
                                                            title: "편집",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                                lineNumber: 437,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleDelete(character.id, character.name);
                                                            },
                                                            className: CHARACTERS_STYLES.deleteButton,
                                                            title: "삭제",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                                lineNumber: 447,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 428,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: CHARACTERS_STYLES.characterHeader,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: CHARACTERS_STYLES.characterAvatar,
                                                            children: character.name.charAt(0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 453,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: CHARACTERS_STYLES.characterName,
                                                            children: character.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 456,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: CHARACTERS_STYLES.characterRole,
                                                            children: character.role
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: CHARACTERS_STYLES.tabContainer,
                                                    children: CHARACTER_TABS.map(({ id, label, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setTabForCharacter(character.id, id),
                                                            className: `${CHARACTERS_STYLES.tab} ${currentTab === id ? CHARACTERS_STYLES.tabActive : ''}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                    className: "w-4 h-4 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                                    lineNumber: 469,
                                                                    columnNumber: 31
                                                                }, this),
                                                                label
                                                            ]
                                                        }, id, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 25
                                                }, this),
                                                renderTabContent(character, currentTab)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 426,
                                            columnNumber: 23
                                        }, this)
                                    }, character.id, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 413,
                                        columnNumber: 21
                                    }, this);
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddCharacter,
                                    className: CHARACTERS_STYLES.addButton,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: CHARACTERS_STYLES.addButtonIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 487,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: CHARACTERS_STYLES.addButtonText,
                                            children: "새 인물 추가"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 488,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 483,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 377,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 359,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 358,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            editingCharacter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTERS_STYLES.modalOverlay,
                onClick: handleEditCancel,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTERS_STYLES.modal,
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.modalHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: CHARACTERS_STYLES.modalTitle,
                                    children: editingCharacter.id === editForm.id ? '캐릭터 편집' : '새 캐릭터'
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 501,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditCancel,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 505,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 504,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 500,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.modalBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.formGrid,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "이름 *"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 512,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 513,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 511,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "역할"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 524,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 522,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "나이"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 535,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 533,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "직업"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 545,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 546,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 544,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "출신"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 557,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 555,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "거주지"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                    lineNumber: 568,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 566,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 510,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "외모"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                                    lineNumber: 581,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "성격"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                                    lineNumber: 592,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 590,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "가족"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                                    lineNumber: 603,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 601,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "배경"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 613,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                                    lineNumber: 614,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 612,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: CHARACTERS_STYLES.formField,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: CHARACTERS_STYLES.formLabel,
                                                    children: "설명"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 624,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                                    lineNumber: 625,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 623,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 578,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 509,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CHARACTERS_STYLES.modalFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditCancel,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonSecondary}`,
                                    children: "취소"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 637,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditSubmit,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary}`,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 643,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 636,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 499,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 498,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                isOpen: showDeleteDialog,
                title: "캐릭터 삭제",
                message: characterToDelete ? `"${characterToDelete.name}"을(를) 삭제하시겠습니까?` : '',
                confirmText: "삭제",
                cancelText: "취소",
                onConfirm: handleConfirmDelete,
                onCancel: handleCancelDelete
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 655,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
        lineNumber: 323,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/renderer/components/projects/views/NotesView.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "NotesView": (()=>NotesView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// 🔥 기가차드 노트 뷰 - 드래그, 크기조절, 타입별 생성 완전 개선
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sticky-note.js [app-ssr] (ecmascript) <export default as StickyNote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-ssr] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
// 🔥 작가 친화적 노트 스타일 - 창작 영감을 자극하는 디자인
const NOTES_STYLES = {
    container: 'flex-1 overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    // 🔥 우아한 헤더
    header: 'p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-amber-200/60 dark:border-gray-700/60 shadow-sm',
    headerTop: 'flex items-center justify-between mb-6',
    title: 'text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent',
    subtitle: 'text-amber-700/80 dark:text-amber-300/80 leading-relaxed font-medium',
    // 🔥 아름다운 통계 카드
    statsGrid: 'grid grid-cols-4 gap-6 mt-6',
    statCard: 'p-4 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200',
    statIcon: 'w-6 h-6 text-amber-600 dark:text-amber-400 mb-3',
    statValue: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    statLabel: 'text-sm text-amber-700/70 dark:text-amber-300/70 font-medium',
    // 🔥 컨텐츠 영역
    content: 'flex-1 relative overflow-hidden',
    // 🔥 세련된 타입 필터
    typeButtons: 'flex gap-4 mb-8 flex-wrap',
    typeButton: 'flex items-center gap-3 px-6 py-3 text-sm font-semibold border-2 border-amber-200/60 dark:border-gray-600 rounded-2xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm',
    typeButtonActive: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 hover:from-amber-600 hover:to-orange-600 shadow-lg transform scale-105',
    // 🔥 창작 캔버스
    canvas: 'absolute inset-0 overflow-auto p-8',
    // 🔥 아름다운 노트 카드
    noteCard: 'absolute group select-none bg-gradient-to-br shadow-xl rounded-2xl border-2 transition-all duration-300 cursor-move backdrop-blur-sm',
    noteCardIdea: 'from-yellow-100/90 to-amber-100/90 dark:from-yellow-900/40 dark:to-amber-900/40 border-yellow-300/60 dark:border-yellow-600/60',
    noteCardGoal: 'from-emerald-100/90 to-green-100/90 dark:from-emerald-900/40 dark:to-green-900/40 border-emerald-300/60 dark:border-emerald-600/60',
    noteCardReference: 'from-blue-100/90 to-cyan-100/90 dark:from-blue-900/40 dark:to-cyan-900/40 border-blue-300/60 dark:border-blue-600/60',
    noteCardHover: 'hover:shadow-2xl hover:scale-105 hover:z-20 hover:-rotate-1',
    // 🔥 노트 헤더
    noteHeader: 'flex items-center justify-between p-5 border-b border-current/20',
    noteIcon: 'w-5 h-5 mr-3',
    noteTitle: 'font-bold text-gray-900 dark:text-gray-100 flex-1 text-base leading-tight',
    noteActions: 'flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200',
    // 🔥 노트 컨텐츠
    noteContent: 'p-5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-hidden',
    noteDate: 'text-xs text-gray-500 dark:text-gray-400 px-5 pb-4 font-medium italic',
    // 🔥 크기 조절 핸들
    resizeHandle: 'absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tl from-gray-400/30 to-transparent rounded-tl-lg',
    resizeIcon: 'w-4 h-4 text-gray-500 absolute bottom-1 right-1',
    // 🔥 매력적인 추가 버튼들
    addButtonsContainer: 'absolute bottom-8 right-8 flex flex-col gap-4',
    addButton: 'group relative flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-white to-amber-50/80 dark:from-gray-800 dark:to-amber-900/20 border-2 border-dashed border-amber-300/60 dark:border-amber-600/60 rounded-2xl hover:border-amber-400 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105',
    addButtonIcon: 'w-6 h-6 text-amber-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors',
    addButtonText: 'text-sm font-semibold text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors',
    // 🔥 세련된 편집 버튼
    editButton: 'relative z-10 p-2 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all duration-200 hover:scale-110',
    saveButton: 'relative z-10 p-2 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-200 hover:scale-110',
    cancelButton: 'relative z-10 p-2 text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-200 hover:scale-110',
    // 🔥 편집 인풋
    editInput: 'w-full px-3 py-2 text-sm border-2 border-amber-300 dark:border-amber-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
    editTextarea: 'w-full px-3 py-2 text-sm border-2 border-amber-300 dark:border-amber-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none',
    // 🔥 영감을 주는 빈 상태
    emptyState: 'absolute inset-0 flex flex-col items-center justify-center text-center',
    emptyIcon: 'w-16 h-16 text-slate-400 dark:text-gray-500 mb-4',
    emptyTitle: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2',
    emptyDescription: 'text-slate-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed'
};
// 작가에게 유용한 기본 노트 템플릿
const DEFAULT_NOTES = [
    {
        id: 'template-idea-1',
        projectId: 'global_notes',
        title: '캐릭터 아이디어',
        content: '주인공의 숨겨진 과거나 트라우마가 현재 행동에 미치는 영향을 탐구해보세요. 독자가 공감할 수 있는 구체적인 경험을 설정하면 캐릭터가 더 생생해집니다.',
        type: 'idea',
        tags: [
            '캐릭터',
            '배경스토리',
            '심리'
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 'template-goal-1',
        projectId: 'global_notes',
        title: '이번 주 창작 목표',
        content: '1. 주인공의 성격 확립하기\n2. 갈등의 핵심 설정하기\n3. 첫 장 초안 완성하기\n4. 전체 플롯 개요 정리하기',
        type: 'goal',
        tags: [
            '목표',
            '진행상황'
        ],
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
    },
    {
        id: 'template-reference-1',
        projectId: 'global_notes',
        title: '참고 자료',
        content: '장르별 참고작품이나 영감을 준 자료들을 정리해보세요. 톤앤매너, 문체, 구조 등에서 배울 점들을 메모하면 창작에 도움이 됩니다.',
        type: 'reference',
        tags: [
            '참고자료',
            '영감'
        ],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
    }
];
const NOTE_TYPES = [
    {
        id: 'all',
        label: '전체',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"]
    },
    {
        id: 'idea',
        label: '아이디어',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"]
    },
    {
        id: 'goal',
        label: '목표',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"]
    },
    {
        id: 'reference',
        label: '참고',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    }
];
const NOTE_TYPE_STYLES = {
    idea: NOTES_STYLES.noteCardIdea,
    goal: NOTES_STYLES.noteCardGoal,
    reference: NOTES_STYLES.noteCardReference
};
function NotesView({ projectId: propProjectId, notes: propNotes, onNotesChange, onBack }) {
    const currentEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((s)=>s.currentEditor);
    const projectId = propProjectId || currentEditor?.projectId || 'global_notes';
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])((propNotes || DEFAULT_NOTES).map((note, index)=>({
            ...note,
            projectId,
            position: {
                x: 50 + index % 3 * 250,
                y: 50 + Math.floor(index / 3) * 200,
                width: 240,
                height: 180
            }
        })));
    // 🔁 currentEditor / store 변경 시 notes 동기화 (여기서는 propNotes 우선, store 확장 시 그 값을 사용할 수 있음)
    const structures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((s)=>s.structures);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const pid = currentEditor?.projectId || projectId;
            // If later we store notes in structures or a dedicated store, we can pull them here.
            // For now, if propNotes changed, update; otherwise keep local canvas state.
            if (propNotes) {
                const mapped = propNotes.map((note, index)=>({
                        ...note,
                        position: {
                            x: 50 + index % 3 * 250,
                            y: 50 + Math.floor(index / 3) * 200,
                            width: 240,
                            height: 180
                        }
                    }));
                setNotes(mapped);
            }
        } catch (e) {
        // ignore
        }
    }, [
        propNotes,
        currentEditor,
        structures,
        projectId
    ]);
    // 🔥 ESC 키로 뒤로가기 (onBack이 있을 때만)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!onBack) return;
        const handleGlobalEscape = (event)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('NOTES_VIEW', 'ESC key pressed, going back');
            onBack();
            event.preventDefault();
        };
        window.addEventListener('global:escape', handleGlobalEscape);
        return ()=>window.removeEventListener('global:escape', handleGlobalEscape);
    }, [
        onBack
    ]);
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [dragData, setDragData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resizeData, setResizeData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 노트 편집 핸들러들
    const handleEditNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((noteId)=>{
        const note = notes.find((n)=>n.id === noteId);
        if (note) {
            setEditingId(noteId);
            setEditForm(note);
        }
    }, [
        notes
    ]);
    const handleLongPressEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((noteId)=>{
        handleEditNote(noteId);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('NOTES_VIEW', '🔥 롱프레스로 편집 모드 활성화', {
            noteId
        });
    }, [
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
    const handleAddNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type)=>{
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('NOTES_VIEW', 'New note added', {
            id: newNote.id,
            type
        });
    }, [
        notes,
        projectId,
        onNotesChange
    ]);
    // 🔥 드래그 시작
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, noteId)=>{
        if (e.target.closest('.resize-handle')) return;
        const note = notes.find((n)=>n.id === noteId);
        if (!note?.position) return;
        setDragData({
            id: noteId,
            startX: note.position.x,
            startY: note.position.y,
            startMouseX: e.clientX,
            startMouseY: e.clientY
        });
    }, [
        notes
    ]);
    // 🔥 크기 조절 시작
    const handleResizeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, noteId)=>{
        e.stopPropagation();
        const note = notes.find((n)=>n.id === noteId);
        if (!note?.position) return;
        setResizeData({
            id: noteId,
            startWidth: note.position.width,
            startHeight: note.position.height,
            startMouseX: e.clientX,
            startMouseY: e.clientY
        });
    }, [
        notes
    ]);
    // 🔥 마우스 이동 처리
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (dragData) {
            const deltaX = e.clientX - dragData.startMouseX;
            const deltaY = e.clientY - dragData.startMouseY;
            setNotes((prev)=>prev.map((note)=>note.id === dragData.id && note.position ? {
                        ...note,
                        position: {
                            ...note.position,
                            x: Math.max(0, dragData.startX + deltaX),
                            y: Math.max(0, dragData.startY + deltaY)
                        }
                    } : note));
        }
        if (resizeData) {
            const deltaX = e.clientX - resizeData.startMouseX;
            const deltaY = e.clientY - resizeData.startMouseY;
            setNotes((prev)=>prev.map((note)=>note.id === resizeData.id && note.position ? {
                        ...note,
                        position: {
                            ...note.position,
                            width: Math.max(200, resizeData.startWidth + deltaX),
                            height: Math.max(150, resizeData.startHeight + deltaY)
                        }
                    } : note));
        }
    }, [
        dragData,
        resizeData
    ]);
    // 🔥 마우스 업 처리
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (dragData || resizeData) {
            onNotesChange?.(notes);
        }
        setDragData(null);
        setResizeData(null);
    }, [
        dragData,
        resizeData,
        notes,
        onNotesChange
    ]);
    // 🔥 이벤트 리스너 등록
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (dragData || resizeData) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return ()=>{
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [
        dragData,
        resizeData,
        handleMouseMove,
        handleMouseUp
    ]);
    // 🔥 편집 관련 함수들
    const handleEditStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((note)=>{
        setEditingId(note.id);
        setEditForm(note);
    }, []);
    const handleEditSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (editingId && editForm) {
            const updatedNotes = notes.map((note)=>note.id === editingId ? {
                    ...note,
                    ...editForm,
                    updatedAt: new Date()
                } : note);
            setNotes(updatedNotes);
            onNotesChange?.(updatedNotes);
            setEditingId(null);
            setEditForm({});
        }
    }, [
        editingId,
        editForm,
        notes,
        onNotesChange
    ]);
    const handleEditCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setEditingId(null);
        setEditForm({});
    }, []);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        const updatedNotes = notes.filter((note)=>note.id !== id);
        setNotes(updatedNotes);
        onNotesChange?.(updatedNotes);
    }, [
        notes,
        onNotesChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: NOTES_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTES_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.headerTop,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: NOTES_STYLES.title,
                                    children: "창작 노트"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: NOTES_STYLES.subtitle,
                                    children: "아이디어, 목표, 참고사항을 자유롭게 배치하고 관리하세요. 드래그로 위치를 조정하고 크기를 조절할 수 있습니다."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 389,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                            lineNumber: 387,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.statsGrid,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 399,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.total
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 400,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "총 노트"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 398,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.ideas
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "아이디어"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 403,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 409,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.goals
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 410,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "목표"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 411,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 408,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 414,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.references
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 415,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statLabel,
                                        children: "참고"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 416,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 413,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 397,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.typeButtons,
                        children: NOTE_TYPES.map(({ id, label, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedType(id),
                                className: `${NOTES_STYLES.typeButton} ${selectedType === id ? NOTES_STYLES.typeButtonActive : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 429,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 430,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 423,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 421,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTES_STYLES.content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: canvasRef,
                        className: NOTES_STYLES.canvas,
                        children: filteredNotes.length === 0 ? // 빈 상태
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: NOTES_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sticky$2d$note$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__StickyNote$3e$__["StickyNote"], {
                                    className: NOTES_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 442,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: NOTES_STYLES.emptyTitle,
                                    children: selectedType === 'all' ? '첫 번째 노트를 만들어보세요' : `${NOTE_TYPES.find((t)=>t.id === selectedType)?.label} 노트를 추가해보세요`
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 443,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: NOTES_STYLES.emptyDescription,
                                    children: "창작 과정에서 떠오르는 아이디어나 중요한 정보들을 자유롭게 배치할 수 있는 캔버스입니다."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                            lineNumber: 441,
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
                            const Icon = note.type === 'idea' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"] : note.type === 'goal' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"];
                            const noteTypeStyle = NOTE_TYPE_STYLES[note.type];
                            // 🔥 드래그 및 편집 핸들러
                            const handleNoteClick = ()=>{
                                setEditingId(note.id);
                                setEditForm(note);
                            };
                            const handleNoteDoubleClick = ()=>{
                                handleLongPressEdit(note.id);
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.noteHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: NOTES_STYLES.noteIcon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 23
                                                    }, this),
                                                    isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                        lineNumber: 491,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: NOTES_STYLES.noteTitle,
                                                        children: note.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                        lineNumber: 499,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                lineNumber: 488,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: NOTES_STYLES.noteActions,
                                                children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditSave();
                                                            },
                                                            className: NOTES_STYLES.saveButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 506,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditCancel();
                                                            },
                                                            className: NOTES_STYLES.cancelButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 522,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 515,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleEditStart(note);
                                                            },
                                                            className: NOTES_STYLES.editButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 534,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 527,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleDelete(note.id);
                                                            },
                                                            className: NOTES_STYLES.cancelButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                                lineNumber: 543,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 536,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                lineNumber: 503,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 487,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.noteContent,
                                        children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                            lineNumber: 553,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: note.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 561,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 551,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.noteDate,
                                        children: note.updatedAt.toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 566,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${NOTES_STYLES.resizeHandle} resize-handle`,
                                        onMouseDown: (e)=>handleResizeStart(e, note.id),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                            className: NOTES_STYLES.resizeIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                            lineNumber: 575,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 571,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, note.id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 470,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 438,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTES_STYLES.addButtonsContainer,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('idea'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 589,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonText,
                                        children: "아이디어"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 590,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 585,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('goal'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 596,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonText,
                                        children: "목표"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 597,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 592,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('reference'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 603,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTES_STYLES.addButtonText,
                                        children: "참고"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 604,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                lineNumber: 599,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                        lineNumber: 584,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                lineNumber: 437,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
        lineNumber: 383,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "TimelinePanel": (()=>TimelinePanel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-ssr] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.js [app-ssr] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$common$2f$AIAnalysisPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/common/AIAnalysisPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const TimelinePanel = ({ analysis, elements, projectId = 'timeline-demo', characters = [], notes = [], content = '', onNavigateToChapter// 🔥 챕터 네비게이션 함수
 })=>{
    const [showAIAnalysis, setShowAIAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 overflow-hidden flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-6 pb-4 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                className: "h-5 w-5 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                lineNumber: 38,
                                columnNumber: 21
                            }, this),
                            "타임라인 뷰"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                        lineNumber: 37,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>setShowAIAnalysis(!showAIAnalysis),
                            variant: showAIAnalysis ? "secondary" : "outline",
                            size: "sm",
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                    lineNumber: 48,
                                    columnNumber: 25
                                }, this),
                                showAIAnalysis ? 'AI 분석 숨기기' : 'AI 분석'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                            lineNumber: 42,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                lineNumber: 36,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-hidden px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-12 gap-6 h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300 overflow-y-auto h-full`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4 pb-6",
                                    children: elements.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "p-8 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                className: "w-12 h-12 mx-auto mb-4 text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                lineNumber: 61,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-medium text-gray-600 mb-2",
                                                children: "타임라인이 비어있습니다"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                lineNumber: 62,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500",
                                                children: "프로젝트에 이벤트를 추가하여 타임라인을 구성해보세요."
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                lineNumber: 63,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                        lineNumber: 60,
                                        columnNumber: 33
                                    }, this) : // 🔥 elements를 생성 순서로 정렬하여 타임라인 구성
                                    elements.sort((a, b)=>{
                                        // main이 맨 앞에, 나머지는 order 또는 생성시간 순
                                        if (a.type === 'main') return -1;
                                        if (b.type === 'main') return 1;
                                        if (a.order !== undefined && b.order !== undefined) {
                                            return a.order - b.order;
                                        }
                                        return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
                                    }).map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start space-x-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-3 h-3 rounded-full ${item.type === 'main' ? 'bg-green-500' : item.type === 'chapter' ? 'bg-indigo-500' : item.type === 'character' ? 'bg-purple-500' : item.type === 'synopsis' ? 'bg-blue-500' : 'bg-gray-500'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                            lineNumber: 80,
                                                            columnNumber: 45
                                                        }, this),
                                                        index < elements.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mt-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                            lineNumber: 88,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 pb-8",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow ${item.type === 'chapter' && onNavigateToChapter ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''}`,
                                                        onClick: ()=>{
                                                            // 🔥 챕터 클릭 시 네비게이션
                                                            if (item.type === 'chapter' && onNavigateToChapter) {
                                                                onNavigateToChapter(item.id);
                                                            }
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: `font-medium flex items-center gap-2 ${item.type === 'chapter' && onNavigateToChapter ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`,
                                                                        children: [
                                                                            item.type === 'main' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                                                className: "w-4 h-4 text-green-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                                lineNumber: 107,
                                                                                columnNumber: 82
                                                                            }, this),
                                                                            item.type === 'chapter' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], {
                                                                                className: "w-4 h-4 text-indigo-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                                lineNumber: 108,
                                                                                columnNumber: 85
                                                                            }, this),
                                                                            item.type === 'synopsis' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                className: "w-4 h-4 text-blue-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                                lineNumber: 109,
                                                                                columnNumber: 86
                                                                            }, this),
                                                                            ![
                                                                                'main',
                                                                                'chapter',
                                                                                'synopsis'
                                                                            ].includes(item.type) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                                className: "w-4 h-4 text-purple-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                                lineNumber: 110,
                                                                                columnNumber: 114
                                                                            }, this),
                                                                            item.title,
                                                                            item.type === 'chapter' && onNavigateToChapter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "ml-2 text-xs text-gray-500",
                                                                                children: "(클릭하여 편집)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                                lineNumber: 113,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                        lineNumber: 103,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded",
                                                                        children: item.type === 'main' ? '메인' : item.type === 'chapter' ? '챕터' : item.type === 'character' ? '인물' : item.type === 'idea' ? '아이디어' : item.type === 'synopsis' ? '시놉시스' : item.type === 'memo' ? '메모' : item.type
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                        lineNumber: 116,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                lineNumber: 102,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-600 dark:text-gray-400 mb-2",
                                                                children: [
                                                                    item.content?.substring(0, 150) || '내용 없음',
                                                                    (item.content?.length || 0) > 150 && '...'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                lineNumber: 125,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500",
                                                                children: item.createdAt?.toLocaleDateString('ko-KR') || '날짜 미상'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                                lineNumber: 129,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                        lineNumber: 92,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                            lineNumber: 78,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                    lineNumber: 58,
                                    columnNumber: 25
                                }, this),
                                analysis.timeline.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 text-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: ()=>{
                                            // 데모용 타임라인 데이터 추가 로직
                                            console.log('샘플 타임라인 데이터 추가');
                                        },
                                        variant: "outline",
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                                lineNumber: 150,
                                                columnNumber: 37
                                            }, this),
                                            "샘플 데이터 추가"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                        lineNumber: 142,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                    lineNumber: 141,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                            lineNumber: 57,
                            columnNumber: 21
                        }, this),
                        showAIAnalysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-4 transition-all duration-300 overflow-y-auto h-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$common$2f$AIAnalysisPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AIAnalysisPanel"], {
                                projectId: projectId,
                                analysisType: "timeline",
                                data: analysis.timeline,
                                context: {
                                    content: content || analysis.timeline.map((t)=>`${t.title}: ${t.description}`).join('\n'),
                                    characters: characters,
                                    plotPoints: analysis.timeline,
                                    themes: analysis.timeline.map((t)=>t.type).filter((v, i, a)=>a.indexOf(v) === i),
                                    notes: notes
                                },
                                onAnalysisComplete: (result)=>{
                                    console.log('🔍 타임라인 AI 분석 완료:', result);
                                    console.log('🔍 전달된 context:', {
                                        charactersCount: characters?.length || 0,
                                        charactersPreview: characters?.slice(0, 2),
                                        contentLength: content?.length || 0,
                                        notesCount: notes?.length || 0
                                    });
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                                lineNumber: 160,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                            lineNumber: 159,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                    lineNumber: 55,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
                lineNumber: 54,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx",
        lineNumber: 34,
        columnNumber: 9
    }, this);
};
}}),
"[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "OutlinePanel": (()=>OutlinePanel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.js [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-ssr] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$common$2f$AIAnalysisPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/common/AIAnalysisPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const OutlinePanel = ({ elements, projectId = 'outline-demo', characters = [], notes = [], content = '', onNavigateToChapter// 🔥 챕터 네비게이션 함수
 })=>{
    const [showAIAnalysis, setShowAIAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 페이지네이션 상태 - main 추가
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        mains: 1,
        chapters: 1,
        characters: 1,
        ideas: 1,
        memos: 1
    });
    const ITEMS_PER_PAGE = 6; // 페이지당 아이템 수
    // 🔥 페이지네이션 헬퍼 함수
    const getPaginatedItems = (items, type)=>{
        const startIndex = (currentPage[type] - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return items.slice(startIndex, endIndex);
    };
    const getTotalPages = (itemsCount)=>{
        return Math.ceil(itemsCount / ITEMS_PER_PAGE);
    };
    const handlePageChange = (type, newPage)=>{
        setCurrentPage((prev)=>({
                ...prev,
                [type]: newPage
            }));
    };
    // 🔥 페이지네이션 컴포넌트
    const renderPagination = (type, totalItems)=>{
        const totalPages = getTotalPages(totalItems);
        if (totalPages <= 1) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-2 mt-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handlePageChange(type, Math.max(1, currentPage[type] - 1)),
                    disabled: currentPage[type] === 1,
                    className: "px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800",
                    children: "이전"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                    lineNumber: 66,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-gray-600 dark:text-gray-400",
                    children: [
                        currentPage[type],
                        " / ",
                        totalPages
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                    lineNumber: 73,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handlePageChange(type, Math.min(totalPages, currentPage[type] + 1)),
                    disabled: currentPage[type] === totalPages,
                    className: "px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800",
                    children: "다음"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                    lineNumber: 76,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
            lineNumber: 65,
            columnNumber: 13
        }, this);
    };
    // 요소별로 분류 - main 타입 추가
    const categorizedElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const mains = elements.filter((el)=>el.type === 'main'); // 🔥 main 타입 추가
        const chapters = elements.filter((el)=>el.type === 'chapter');
        const characters = elements.filter((el)=>el.type === 'character');
        const ideas = elements.filter((el)=>el.type === 'idea');
        const memos = elements.filter((el)=>el.type === 'memo');
        const notes = elements.filter((el)=>el.type === 'note');
        // 🔥 디버그: 아이디어 수 확인
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('OUTLINE_PANEL', '🔍 Elements categorization', {
            total: elements.length,
            mains: mains.length,
            chapters: chapters.length,
            characters: characters.length,
            ideas: ideas.length,
            memos: memos.length,
            notes: notes.length,
            ideaData: ideas.map((i)=>({
                    id: i.id,
                    title: i.title,
                    type: i.type
                }))
        });
        return {
            mains,
            chapters,
            characters,
            ideas,
            memos,
            notes
        };
    }, [
        elements
    ]);
    const renderElementCard = (element, icon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
            className: `p-4 hover:shadow-md transition-shadow ${element.type === 'chapter' && onNavigateToChapter ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''}`,
            onClick: ()=>{
                // 🔥 챕터 클릭 시 네비게이션
                if (element.type === 'chapter' && onNavigateToChapter) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('OUTLINE_PANEL', 'Navigating to chapter', {
                        chapterId: element.id,
                        title: element.title
                    });
                    onNavigateToChapter(element.id);
                }
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 mt-1",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                        lineNumber: 125,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: `font-medium mb-2 ${element.type === 'chapter' && onNavigateToChapter ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`,
                                children: [
                                    element.title,
                                    element.type === 'chapter' && onNavigateToChapter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 text-xs text-gray-500",
                                        children: "(클릭하여 편집)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                        lineNumber: 135,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                lineNumber: 129,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-3",
                                children: element.content?.replace(/#{1,6}\s+/g, '') // 헤딩 마크 제거
                                ?.replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 마크 제거
                                ?.replace(/\*(.*?)\*/g, '$1') // 이탤릭 마크 제거
                                ?.replace(/`(.*?)`/g, '$1') // 인라인 코드 마크 제거
                                ?.replace(/\[(.*?)\]\(.*?\)/g, '$1') // 링크는 텍스트만
                                ?.replace(/\n+/g, ' ') // 줄바꿈을 스페이스로
                                ?.trim()
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                lineNumber: 138,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mt-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: element.tags && element.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1",
                                            children: [
                                                element.tags.slice(0, 2).map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded",
                                                        children: tag
                                                    }, tag, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 41
                                                    }, this)),
                                                element.tags.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-500",
                                                    children: [
                                                        "+",
                                                        element.tags.length - 2
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 153,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                        lineNumber: 151,
                                        columnNumber: 25
                                    }, this),
                                    element.wordCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500",
                                        children: [
                                            element.wordCount.toLocaleString(),
                                            "자"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                        lineNumber: 166,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                lineNumber: 150,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                lineNumber: 124,
                columnNumber: 13
            }, this)
        }, element.id, false, {
            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
            lineNumber: 112,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 overflow-hidden flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-6 pb-4 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                className: "h-5 w-5 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                lineNumber: 181,
                                columnNumber: 21
                            }, this),
                            "아웃라인 뷰"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                        lineNumber: 180,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: ()=>setShowAIAnalysis(!showAIAnalysis),
                            variant: showAIAnalysis ? "secondary" : "outline",
                            size: "sm",
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                    lineNumber: 191,
                                    columnNumber: 25
                                }, this),
                                showAIAnalysis ? 'AI 분석 숨기기' : 'AI 분석'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                            lineNumber: 185,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                        lineNumber: 184,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                lineNumber: 179,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-hidden px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-12 gap-6 h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${showAIAnalysis ? 'col-span-8' : 'col-span-12'} transition-all duration-300 overflow-y-auto h-full`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-8 pb-6",
                                children: elements.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "p-8 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                            className: "w-12 h-12 mx-auto mb-4 text-gray-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 204,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-medium text-gray-600 mb-2",
                                            children: "아웃라인이 비어있습니다"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 205,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500",
                                            children: "사이드바에서 챕터, 인물, 아이디어를 추가하여 아웃라인을 구성해보세요."
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 206,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                    lineNumber: 203,
                                    columnNumber: 33
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        categorizedElements.mains.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 49
                                                        }, this),
                                                        "메인 스토리 (",
                                                        categorizedElements.mains.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                    children: getPaginatedItems(categorizedElements.mains, 'mains').map((element)=>renderElementCard(element, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "w-4 h-4 text-purple-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 80
                                                        }, this)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 45
                                                }, this),
                                                renderPagination('mains', categorizedElements.mains.length)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 212,
                                            columnNumber: 41
                                        }, this),
                                        categorizedElements.chapters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 49
                                                        }, this),
                                                        "챕터 (",
                                                        categorizedElements.chapters.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                    children: getPaginatedItems(categorizedElements.chapters, 'chapters').map((element)=>renderElementCard(element, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "w-4 h-4 text-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 235,
                                                            columnNumber: 80
                                                        }, this)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 45
                                                }, this),
                                                renderPagination('chapters', categorizedElements.chapters.length)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 228,
                                            columnNumber: 41
                                        }, this),
                                        categorizedElements.characters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 49
                                                        }, this),
                                                        "인물 (",
                                                        categorizedElements.characters.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 245,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                                    children: getPaginatedItems(categorizedElements.characters, 'characters').map((element)=>renderElementCard(element, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            className: "w-4 h-4 text-green-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 80
                                                        }, this)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 45
                                                }, this),
                                                renderPagination('characters', categorizedElements.characters.length)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 244,
                                            columnNumber: 41
                                        }, this),
                                        categorizedElements.ideas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 262,
                                                            columnNumber: 49
                                                        }, this),
                                                        "아이디어 (",
                                                        categorizedElements.ideas.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                                    children: getPaginatedItems(categorizedElements.ideas, 'ideas').map((element)=>renderElementCard(element, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                                            className: "w-4 h-4 text-yellow-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 267,
                                                            columnNumber: 80
                                                        }, this)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 45
                                                }, this),
                                                renderPagination('ideas', categorizedElements.ideas.length)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 260,
                                            columnNumber: 41
                                        }, this),
                                        (categorizedElements.memos.length > 0 || categorizedElements.notes.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 49
                                                        }, this),
                                                        "메모 & 노트 (",
                                                        categorizedElements.memos.length + categorizedElements.notes.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                                    children: getPaginatedItems([
                                                        ...categorizedElements.memos,
                                                        ...categorizedElements.notes
                                                    ], 'memos').map((element)=>renderElementCard(element, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "w-4 h-4 text-gray-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 80
                                                        }, this)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 45
                                                }, this),
                                                renderPagination('memos', categorizedElements.memos.length + categorizedElements.notes.length)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                            lineNumber: 276,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                lineNumber: 201,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                            lineNumber: 200,
                            columnNumber: 21
                        }, this),
                        showAIAnalysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-4 transition-all duration-300 overflow-y-auto h-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$common$2f$AIAnalysisPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AIAnalysisPanel"], {
                                projectId: projectId,
                                analysisType: "outline",
                                data: {
                                    elements,
                                    chapters: categorizedElements.chapters,
                                    characters: categorizedElements.characters,
                                    ideas: categorizedElements.ideas,
                                    totalElements: elements.length
                                },
                                context: {
                                    content: content || elements.map((e)=>`${e.title}: ${e.content}`).join('\n'),
                                    themes: elements.map((e)=>e.type).filter((v, i, a)=>a.indexOf(v) === i),
                                    characters: [
                                        ...characters || [],
                                        ...categorizedElements.characters
                                    ],
                                    plotPoints: elements.filter((e)=>e.plotRelevance && e.plotRelevance >= 3),
                                    notes: notes
                                },
                                onAnalysisComplete: (result)=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('OUTLINE_PANEL', '아웃라인 AI 분석 완료', {
                                        result
                                    });
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                                lineNumber: 297,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                            lineNumber: 296,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                    lineNumber: 198,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
                lineNumber: 197,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx",
        lineNumber: 177,
        columnNumber: 9
    }, this);
};
}}),
"[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * 🧠 마인드맵 캔버스 - 방사형 레이아웃으로 완전 재설계
 * 프로젝트 요소들을 아름다운 방사형으로 배치
 */ __turbopack_context__.s({
    "MindmapCanvas": (()=>MindmapCanvas)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-ssr] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-cw.js [app-ssr] (ecmascript) <export default as RotateCw>");
'use client';
;
;
;
;
;
;
const MindmapCanvas = ({ elements = [], analysis, onSelectElement, projectId = 'mindmap-demo' })=>{
    const [zoom, setZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [panOffset, setPanOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [selectedNodeId, setSelectedNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 단순하고 아름다운 방사형 레이아웃
    const mindmapData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        console.log('🔍 [MindmapCanvas] Elements received:', elements.length);
        // 🔥 1. 중앙 프로젝트 노드
        const centerNode = {
            id: 'center',
            type: 'center',
            label: '프로젝트',
            x: 0,
            y: 0,
            level: 0,
            radius: 80
        };
        // 🔥 2. 데이터를 타입별로 분류
        const categories = [
            {
                type: 'main',
                items: elements.filter((e)=>e.type === 'main'),
                label: '메인 스토리',
                color: '#8b5cf6',
                icon: '📚'
            },
            {
                type: 'chapter',
                items: elements.filter((e)=>e.type === 'chapter'),
                label: '챕터',
                color: '#3b82f6',
                icon: '📖'
            },
            {
                type: 'character',
                items: elements.filter((e)=>e.type === 'character'),
                label: '캐릭터',
                color: '#10b981',
                icon: '👤'
            },
            {
                type: 'idea',
                items: elements.filter((e)=>e.type === 'idea'),
                label: '아이디어',
                color: '#f59e0b',
                icon: '💡'
            },
            {
                type: 'synopsis',
                items: elements.filter((e)=>e.type === 'synopsis'),
                label: '시놉시스',
                color: '#ef4444',
                icon: '📝'
            }
        ].filter((cat)=>cat.items.length > 0); // 빈 카테고리 제외
        // 🔥 3. 카테고리 노드들을 원형으로 배치
        const categoryNodes = [];
        const itemNodes = [];
        const connections = [];
        const categoryRadius = 250; // 카테고리 노드들의 거리
        const itemRadius = 150; // 각 아이템들의 거리
        categories.forEach((category, categoryIndex)=>{
            const categoryAngle = categoryIndex / categories.length * 2 * Math.PI;
            const categoryX = Math.cos(categoryAngle) * categoryRadius;
            const categoryY = Math.sin(categoryAngle) * categoryRadius;
            // 카테고리 노드 생성
            const categoryNode = {
                id: `category-${category.type}`,
                type: 'category',
                label: category.label,
                icon: category.icon,
                color: category.color,
                x: categoryX,
                y: categoryY,
                level: 1,
                radius: 60,
                itemCount: category.items.length
            };
            categoryNodes.push(categoryNode);
            // 중앙에서 카테고리로 연결선
            connections.push({
                from: 'center',
                to: categoryNode.id,
                type: 'main'
            });
            // 🔥 4. 각 카테고리의 아이템들을 해당 카테고리 주변에 배치
            category.items.forEach((item, itemIndex)=>{
                const itemAngle = categoryAngle + (itemIndex - (category.items.length - 1) / 2) * 0.4; // 0.4 라디안씩 간격
                const itemX = categoryX + Math.cos(itemAngle) * itemRadius;
                const itemY = categoryY + Math.sin(itemAngle) * itemRadius;
                const itemNode = {
                    id: item.id,
                    type: 'item',
                    label: item.title,
                    category: category.type,
                    color: category.color,
                    x: itemX,
                    y: itemY,
                    level: 2,
                    radius: 40,
                    data: item
                };
                itemNodes.push(itemNode);
                // 카테고리에서 아이템으로 연결선
                connections.push({
                    from: categoryNode.id,
                    to: item.id,
                    type: 'sub'
                });
            });
        });
        return {
            centerNode,
            categoryNodes,
            itemNodes,
            connections,
            totalNodes: 1 + categoryNodes.length + itemNodes.length
        };
    }, [
        elements
    ]);
    // 🔥 노드 클릭 핸들러
    const handleNodeClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node)=>{
        setSelectedNodeId(node.id);
        if (node.type === 'item' && node.data && onSelectElement) {
            onSelectElement(node.data);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('MINDMAP_CANVAS', 'Element selected', {
                elementId: node.id,
                title: node.label
            });
        }
    }, [
        onSelectElement
    ]);
    // 🔥 줌 컨트롤
    const handleZoomIn = ()=>setZoom((prev)=>Math.min(prev + 0.2, 3));
    const handleZoomOut = ()=>setZoom((prev)=>Math.max(prev - 0.2, 0.3));
    const handleResetView = ()=>{
        setZoom(1);
        setPanOffset({
            x: 0,
            y: 0
        });
    };
    // 🔥 SVG 렌더링
    const renderMindmap = ()=>{
        const { centerNode, categoryNodes, itemNodes, connections } = mindmapData;
        const allNodes = [
            centerNode,
            ...categoryNodes,
            ...itemNodes
        ];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            ref: svgRef,
            width: "100%",
            height: "100%",
            viewBox: "-500 -400 1000 800",
            className: "overflow-visible",
            style: {
                transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    className: "connections",
                    children: connections.map((conn, index)=>{
                        const fromNode = allNodes.find((n)=>n.id === conn.from);
                        const toNode = allNodes.find((n)=>n.id === conn.to);
                        if (!fromNode || !toNode) return null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: fromNode.x,
                            y1: fromNode.y,
                            x2: toNode.x,
                            y2: toNode.y,
                            stroke: conn.type === 'main' ? '#6b7280' : '#d1d5db',
                            strokeWidth: conn.type === 'main' ? 3 : 2,
                            strokeDasharray: conn.type === 'sub' ? '5,5' : 'none',
                            opacity: 0.6
                        }, index, false, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                            lineNumber: 199,
                            columnNumber: 29
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                    lineNumber: 191,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    className: "nodes",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: centerNode.x,
                                    cy: centerNode.y,
                                    r: centerNode.radius,
                                    fill: "url(#centerGradient)",
                                    stroke: "#4f46e5",
                                    strokeWidth: "4",
                                    className: "cursor-pointer filter drop-shadow-lg",
                                    onClick: ()=>handleNodeClick(centerNode)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                    lineNumber: 218,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: centerNode.x,
                                    y: centerNode.y,
                                    textAnchor: "middle",
                                    dominantBaseline: "middle",
                                    className: "text-lg font-bold fill-white pointer-events-none",
                                    children: centerNode.label
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                    lineNumber: 228,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                            lineNumber: 217,
                            columnNumber: 21
                        }, this),
                        categoryNodes.map((node)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: node.x,
                                        cy: node.y,
                                        r: node.radius,
                                        fill: node.color,
                                        stroke: selectedNodeId === node.id ? '#1f2937' : 'white',
                                        strokeWidth: selectedNodeId === node.id ? 4 : 2,
                                        className: "cursor-pointer filter drop-shadow-md transition-all duration-200 hover:brightness-110",
                                        onClick: ()=>handleNodeClick(node)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                        lineNumber: 242,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: node.x,
                                        y: node.y - 5,
                                        textAnchor: "middle",
                                        dominantBaseline: "middle",
                                        className: "text-sm font-semibold fill-white pointer-events-none",
                                        children: node.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                        lineNumber: 252,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: node.x,
                                        y: node.y + 10,
                                        textAnchor: "middle",
                                        dominantBaseline: "middle",
                                        className: "text-xs font-medium fill-white pointer-events-none",
                                        children: node.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                        lineNumber: 261,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: node.x,
                                        y: node.y + 25,
                                        textAnchor: "middle",
                                        dominantBaseline: "middle",
                                        className: "text-xs fill-white/80 pointer-events-none",
                                        children: [
                                            "(",
                                            node.itemCount,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                        lineNumber: 270,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, node.id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 241,
                                columnNumber: 25
                            }, this)),
                        itemNodes.map((node)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: node.x,
                                        cy: node.y,
                                        r: node.radius,
                                        fill: `${node.color}20`,
                                        stroke: node.color,
                                        strokeWidth: selectedNodeId === node.id ? 3 : 2,
                                        className: "cursor-pointer transition-all duration-200 hover:fill-opacity-40",
                                        onClick: ()=>handleNodeClick(node)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                        lineNumber: 285,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: node.x,
                                        y: node.y,
                                        textAnchor: "middle",
                                        dominantBaseline: "middle",
                                        className: "text-xs font-medium pointer-events-none",
                                        fill: node.color,
                                        children: node.label.length > 10 ? `${node.label.slice(0, 10)}...` : node.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                        lineNumber: 295,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, node.id, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 284,
                                columnNumber: 25
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                    lineNumber: 215,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "centerGradient",
                        cx: "0.5",
                        cy: "0.5",
                        r: "0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: "#6366f1"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 312,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: "#4f46e5"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 313,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                        lineNumber: 311,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                    lineNumber: 310,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
            lineNumber: 182,
            columnNumber: 13
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 rounded-lg overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 right-4 z-10 flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        size: "sm",
                        variant: "outline",
                        onClick: handleZoomIn,
                        className: "bg-white/90 hover:bg-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                            lineNumber: 330,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                        lineNumber: 324,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        size: "sm",
                        variant: "outline",
                        onClick: handleZoomOut,
                        className: "bg-white/90 hover:bg-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                            lineNumber: 338,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                        lineNumber: 332,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        size: "sm",
                        variant: "outline",
                        onClick: handleResetView,
                        className: "bg-white/90 hover:bg-white",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                            lineNumber: 346,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                        lineNumber: 340,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                lineNumber: 323,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 left-4 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-3 bg-white/90 backdrop-blur-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-600",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "총 노드: ",
                                    mindmapData.totalNodes
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 354,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "줌: ",
                                    Math.round(zoom * 100),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 355,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                        lineNumber: 353,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                    lineNumber: 352,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                lineNumber: 351,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-full",
                children: mindmapData.totalNodes > 1 ? renderMindmap() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                className: "w-16 h-16 mx-auto mb-4 opacity-50"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 367,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium mb-2",
                                children: "프로젝트 요소가 없습니다"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 368,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: "챕터, 캐릭터, 아이디어를 추가하여 마인드맵을 생성해보세요."
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                                lineNumber: 369,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                        lineNumber: 366,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                    lineNumber: 365,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
                lineNumber: 361,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx",
        lineNumber: 321,
        columnNumber: 9
    }, this);
};
}}),
"[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AnalysisPanel": (()=>AnalysisPanel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-ssr] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thumbs-up.js [app-ssr] (ecmascript) <export default as ThumbsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
'use client';
;
;
;
const AnalysisPanel = ({ analysis, elements, selectedElement, getRelatedElements })=>{
    // 🔥 접힘/펼침 상태 관리
    const [expandedSections, setExpandedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        overview: true,
        suggestions: true,
        details: false,
        elements: false
    });
    const toggleSection = (section)=>{
        setExpandedSections((prev)=>({
                ...prev,
                [section]: !prev[section]
            }));
    };
    // 🔥 요소별 통계
    const elementStats = {
        total: elements.length,
        main: elements.filter((e)=>e.type === 'main').length,
        chapters: elements.filter((e)=>e.type === 'chapter').length,
        characters: elements.filter((e)=>e.type === 'character').length,
        notes: elements.filter((e)=>e.type === 'idea' || e.type === 'note').length,
        synopsis: elements.filter((e)=>e.type === 'synopsis').length
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-96 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l dark:border-gray-700 flex flex-col shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-gray-900 dark:text-white flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                className: "h-5 w-5 mr-2 text-blue-600 dark:text-blue-400"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 63,
                                columnNumber: 21
                            }, this),
                            "스토리 분석"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                        lineNumber: 62,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 dark:text-gray-400 mt-1",
                        children: "AI 기반 작품 완성도 평가"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                        lineNumber: 66,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b dark:border-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleSection('overview'),
                                className: "flex items-center justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold text-gray-900 dark:text-white flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                className: "h-4 w-4 mr-2 text-green-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 79,
                                                columnNumber: 29
                                            }, this),
                                            "프로젝트 개요"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 78,
                                        columnNumber: 25
                                    }, this),
                                    expandedSections.overview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 82,
                                        columnNumber: 54
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 82,
                                        columnNumber: 92
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 74,
                                columnNumber: 21
                            }, this),
                            expandedSections.overview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg",
                                                title: "전체 단어 수 (메인 스토리 + 챕터 포함)",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-lg font-bold text-blue-700 dark:text-blue-300",
                                                        children: analysis.totalWords.toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-blue-600 dark:text-blue-400",
                                                        children: "총 단어 수"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 89,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg",
                                                title: "작성된 챕터 수",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-lg font-bold text-purple-700 dark:text-purple-300",
                                                        children: elementStats.chapters
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-purple-600 dark:text-purple-400",
                                                        children: "챕터 수"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 99,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 95,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg",
                                                title: "등장인물 수",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-lg font-bold text-emerald-700 dark:text-emerald-300",
                                                        children: elementStats.characters
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-emerald-600 dark:text-emerald-400",
                                                        children: "등장인물"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 101,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg",
                                                title: "아이디어/노트 수",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-lg font-bold text-orange-700 dark:text-orange-300",
                                                        children: elementStats.notes
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-orange-600 dark:text-orange-400",
                                                        children: "노트"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 107,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 88,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                                children: "스토리 일관성"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                                lineNumber: 119,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-600 dark:text-gray-400",
                                                                title: "단어 수와 구조를 기반으로 한 일관성 점수",
                                                                children: [
                                                                    analysis.storyConsistency,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                                lineNumber: 120,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `h-2 rounded-full ${analysis.storyConsistency >= 80 ? 'bg-green-500' : analysis.storyConsistency >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`,
                                                            style: {
                                                                width: `${analysis.storyConsistency}%`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 117,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                                children: "캐릭터 완성도"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                                lineNumber: 137,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-600 dark:text-gray-400",
                                                                title: "등장인물 설정의 풍부함",
                                                                children: [
                                                                    analysis.characterConsistency,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                                lineNumber: 138,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 136,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `h-2 rounded-full ${analysis.characterConsistency >= 80 ? 'bg-green-500' : analysis.characterConsistency >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`,
                                                            style: {
                                                                width: `${analysis.characterConsistency}%`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 135,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 116,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 86,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b dark:border-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleSection('suggestions'),
                                className: "flex items-center justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold text-gray-900 dark:text-white flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                                className: "h-4 w-4 mr-2 text-yellow-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 164,
                                                columnNumber: 29
                                            }, this),
                                            "맞춤형 개선 제안"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 163,
                                        columnNumber: 25
                                    }, this),
                                    expandedSections.suggestions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 167,
                                        columnNumber: 57
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 167,
                                        columnNumber: 95
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 159,
                                columnNumber: 21
                            }, this),
                            expandedSections.suggestions && analysis.suggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-2",
                                children: analysis.suggestions.map((suggestion, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 group hover:shadow-md transition-all duration-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start space-x-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__["ThumbsUp"], {
                                                    className: "h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-800 dark:text-gray-200 leading-relaxed",
                                                            children: suggestion
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                                    className: "h-3 w-3 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                                    lineNumber: 181,
                                                                    columnNumber: 49
                                                                }, this),
                                                                "AI가 프로젝트 상태를 분석하여 제안한 내용입니다"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                            lineNumber: 174,
                                            columnNumber: 37
                                        }, this)
                                    }, index, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 173,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 171,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                        lineNumber: 158,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b dark:border-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleSection('elements'),
                                className: "flex items-center justify-between w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold text-gray-900 dark:text-white flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                className: "h-4 w-4 mr-2 text-indigo-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 199,
                                                columnNumber: 29
                                            }, this),
                                            "프로젝트 구성 요소"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 198,
                                        columnNumber: 25
                                    }, this),
                                    expandedSections.elements ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 202,
                                        columnNumber: 54
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 202,
                                        columnNumber: 92
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 194,
                                columnNumber: 21
                            }, this),
                            expandedSections.elements && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 space-y-3",
                                children: [
                                    elements.filter((e)=>e.type === 'main').map((element)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                            className: "h-4 w-4 text-green-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-sm text-green-800 dark:text-green-200",
                                                            children: element.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-green-600 dark:text-green-400",
                                                    children: [
                                                        element.wordCount || 0,
                                                        " 단어 • ",
                                                        element.createdAt?.toLocaleDateString() || '날짜 미상'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, element.id, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                            lineNumber: 209,
                                            columnNumber: 33
                                        }, this)),
                                    elements.filter((e)=>e.type === 'character').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                        className: "h-3 w-3 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 41
                                                    }, this),
                                                    "등장인물 (",
                                                    elements.filter((e)=>e.type === 'character').length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 223,
                                                columnNumber: 37
                                            }, this),
                                            elements.filter((e)=>e.type === 'character').map((element)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-sm text-purple-800 dark:text-purple-200 mb-1",
                                                            children: element.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 229,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-purple-600 dark:text-purple-400",
                                                            children: [
                                                                element.content?.substring(0, 50) || '설명 없음',
                                                                "..."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, element.id, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 41
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 222,
                                        columnNumber: 33
                                    }, this),
                                    elements.filter((e)=>e.type === 'chapter').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2",
                                                children: [
                                                    "챕터 (",
                                                    elements.filter((e)=>e.type === 'chapter').length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 241,
                                                columnNumber: 37
                                            }, this),
                                            elements.filter((e)=>e.type === 'chapter').slice(0, 3).map((element)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-sm text-blue-800 dark:text-blue-200 mb-1",
                                                            children: element.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-blue-600 dark:text-blue-400",
                                                            children: [
                                                                element.wordCount || 0,
                                                                " 단어"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                            lineNumber: 247,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, element.id, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                    lineNumber: 245,
                                                    columnNumber: 41
                                                }, this)),
                                            elements.filter((e)=>e.type === 'chapter').length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500 text-center",
                                                children: [
                                                    "+",
                                                    elements.filter((e)=>e.type === 'chapter').length - 3,
                                                    "개 더"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 253,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 240,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 206,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                        lineNumber: 193,
                        columnNumber: 17
                    }, this),
                    selectedElement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-semibold text-gray-900 dark:text-white mb-3 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                        className: "h-4 w-4 mr-2 text-purple-600"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 267,
                                        columnNumber: 29
                                    }, this),
                                    "선택된 요소"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 266,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: getRelatedElements(selectedElement).map((element)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium text-sm mb-1 text-gray-900 dark:text-gray-100",
                                                children: element.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 273,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500 dark:text-gray-400 mb-1",
                                                children: element.type === 'main' ? '메인 스토리' : element.type === 'chapter' ? '챕터' : element.type === 'character' ? '등장인물' : element.type === 'synopsis' ? '시놉시스' : element.type
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 274,
                                                columnNumber: 37
                                            }, this),
                                            element.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-600 dark:text-gray-300",
                                                children: [
                                                    element.content.substring(0, 80),
                                                    "..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                                lineNumber: 282,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, element.id, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                        lineNumber: 272,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                                lineNumber: 270,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                        lineNumber: 265,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
                lineNumber: 71,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx",
        lineNumber: 59,
        columnNumber: 9
    }, this);
};
}}),
"[project]/src/renderer/components/projects/views/SynopsisView.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SynopsisView": (()=>SynopsisView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.js [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.js [app-ssr] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useProjectData$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/hooks/useProjectData.tsx [app-ssr] (ecmascript)");
// 🔥 모듈화된 컴포넌트들 import
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$TimelinePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/synopsis/TimelinePanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$OutlinePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/synopsis/OutlinePanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$MindmapCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/synopsis/MindmapCanvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$AnalysisPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/synopsis/AnalysisPanel.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const SynopsisView = ({ projectId, synopsisId, onBack, characters = [], notes = [], content = '' })=>{
    const { elements: structureElements, analysis, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useProjectData$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIntegratedProjectData"])(projectId);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('timeline');
    const [selectedElement, setSelectedElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAnalysis, setShowAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // 🔥 main content를 ProjectElement로 변환하여 elements에 추가
    const elements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const allElements = [
            ...structureElements
        ];
        // main content가 있으면 ProjectElement로 변환하여 추가
        if (content && content.trim()) {
            const mainElement = {
                id: 'main-content',
                type: 'main',
                title: '메인 스토리',
                content: content,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 0,
                wordCount: content.split(/\s+/).filter((word)=>word.trim().length > 0).length,
                plotRelevance: 5
            };
            allElements.unshift(mainElement); // 맨 앞에 추가
        }
        return allElements;
    }, [
        structureElements,
        content
    ]);
    // 🔥 연관 요소 찾기 함수
    const getRelatedElements = (elementId)=>{
        if (!analysis) return [];
        const relationships = analysis.relationships.filter((rel)=>rel.from === elementId || rel.to === elementId);
        const relatedIds = relationships.map((rel)=>rel.from === elementId ? rel.to : rel.from);
        return elements.filter((element)=>relatedIds.includes(element.id));
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 79,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-gray-600 dark:text-gray-400",
                        children: "분석 중..."
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 80,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 78,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
            lineNumber: 77,
            columnNumber: 13
        }, this);
    }
    if (!analysis) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                        className: "h-12 w-12 text-gray-400 mx-auto mb-2"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 90,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-400",
                        children: "분석할 데이터가 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 91,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-500 mt-1",
                        children: "챕터나 캐릭터를 추가해주세요."
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 92,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 89,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
            lineNumber: 88,
            columnNumber: 13
        }, this);
    }
    const viewModes = [
        {
            id: 'timeline',
            name: '타임라인',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
        },
        {
            id: 'outline',
            name: '아웃라인',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"]
        },
        {
            id: 'mindmap',
            name: '마인드맵',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col bg-gray-50 dark:bg-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-semibold text-gray-900 dark:text-white",
                                children: "프로젝트 시놉시스"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                lineNumber: 111,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: viewModes.map(({ id, name, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setViewMode(id),
                                        className: `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === id ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                lineNumber: 124,
                                                columnNumber: 33
                                            }, this),
                                            name
                                        ]
                                    }, id, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 116,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                lineNumber: 114,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 110,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowAnalysis(!showAnalysis),
                            className: `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showAnalysis ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, this),
                                "분석 패널"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 132,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 131,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 109,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex overflow-hidden",
                children: [
                    viewMode === 'timeline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$TimelinePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TimelinePanel"], {
                        analysis: analysis,
                        elements: elements,
                        projectId: projectId,
                        characters: characters,
                        notes: notes,
                        content: content
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 149,
                        columnNumber: 21
                    }, this),
                    viewMode === 'outline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$OutlinePanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OutlinePanel"], {
                        elements: elements,
                        projectId: projectId,
                        characters: characters,
                        notes: notes,
                        content: content
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 159,
                        columnNumber: 21
                    }, this),
                    viewMode === 'mindmap' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$MindmapCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MindmapCanvas"], {
                        elements: elements,
                        analysis: analysis,
                        onSelectElement: (element)=>setSelectedElement(element.id)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 168,
                        columnNumber: 21
                    }, this),
                    showAnalysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$synopsis$2f$AnalysisPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnalysisPanel"], {
                        analysis: analysis,
                        elements: elements,
                        selectedElement: selectedElement,
                        getRelatedElements: getRelatedElements
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                        lineNumber: 177,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 146,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-5 gap-4 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-indigo-600 dark:text-indigo-400",
                                    children: analysis.totalWords.toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 190,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-500",
                                    children: "총 단어 수"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 193,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 189,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-green-600 dark:text-green-400",
                                    children: analysis.totalChapters
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 196,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-500",
                                    children: "챕터"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 199,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 195,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-blue-600 dark:text-blue-400",
                                    children: analysis.totalCharacters
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 202,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-500",
                                    children: "캐릭터"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 205,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 201,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-yellow-600 dark:text-yellow-400",
                                    children: [
                                        analysis.storyConsistency,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 208,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-500",
                                    children: "스토리 일관성"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 211,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 207,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-purple-600 dark:text-purple-400",
                                    children: [
                                        analysis.characterConsistency,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 214,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-500",
                                    children: "캐릭터 일관성"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 217,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 213,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                    lineNumber: 188,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 187,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
        lineNumber: 107,
        columnNumber: 9
    }, this);
};
}}),
"[project]/src/renderer/components/projects/views/IdeaView.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "IdeaView": (()=>IdeaView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// 🔥 아이디어 편집 뷰 - 창의적 발상과 영감 관리 시스템
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3x3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-3x3.js [app-ssr] (ecmascript) <export default as Grid3x3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-ssr] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo-2.js [app-ssr] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/redo-2.js [app-ssr] (ecmascript) <export default as Redo2>");
'use client';
;
;
;
;
;
// 🔥 카테고리별 스타일 - 세련된 색상 팔레트
const CATEGORY_STYLES = {
    character: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        color: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
        label: '캐릭터'
    },
    plot: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        color: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
        label: '플롯'
    },
    setting: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
        color: 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
        label: '설정'
    },
    dialogue: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        color: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
        label: '대사'
    },
    theme: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        color: 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700',
        label: '테마'
    },
    other: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"],
        color: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
        label: '기타'
    }
};
// 🔥 개발 단계별 스타일 - 진행 상태를 나타내는 세련된 색상
const STAGE_STYLES = {
    initial: {
        color: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500',
        label: '아이디어'
    },
    developing: {
        color: 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-600',
        label: '발전 중'
    },
    concrete: {
        color: 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600',
        label: '구체화'
    },
    applied: {
        color: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600',
        label: '적용됨'
    }
};
// 🔥 스타일 정의
const IDEA_STYLES = {
    container: 'h-full flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
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
    // 🔥 메인 컨텐츠 - 강제 높이 설정
    content: 'flex-1 min-h-0 h-full overflow-hidden',
    scrollArea: 'h-full overflow-y-auto p-6',
    // 🔥 카드 뷰 - 모던하고 세련된 디자인
    cardsContainer: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6',
    ideaCard: 'group bg-white dark:bg-gray-800 rounded-2xl border border-slate-200/60 dark:border-gray-700/60 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/60 dark:hover:border-blue-600/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm',
    cardHeader: 'flex items-start justify-between mb-4',
    cardTitle: 'font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight',
    cardActions: 'opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1',
    cardContent: 'text-sm text-gray-600 dark:text-gray-400 line-clamp-4 mb-4 leading-relaxed',
    cardFooter: 'flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700',
    cardMeta: 'flex items-center gap-3',
    cardTags: 'flex items-center gap-2 flex-wrap',
    // 🔥 리스트 뷰
    listContainer: 'space-y-2',
    listItem: 'group bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer',
    // 🔥 공통 요소 - 세련된 배지와 태그
    badge: 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm',
    tag: 'inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all duration-200',
    actionButton: 'p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-105',
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
function IdeaView({ ideaId: propIdeaId, onBack }) {
    // 🔥 우선적으로 StructureStore의 현재 에디터/구조 항목을 사용하여 초기 상태 구성
    const structures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((s)=>s.structures);
    const currentEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((s)=>s.currentEditor);
    const ideaId = propIdeaId || (currentEditor?.editorType === 'idea' ? currentEditor.itemId : undefined) || 'global_ideas';
    const storedStructureItem = (()=>{
        try {
            const pid = currentEditor?.projectId;
            if (pid && structures[pid]) {
                return structures[pid].find((it)=>it.id === ideaId);
            }
        } catch (e) {
        // ignore
        }
        return undefined;
    })();
    const [ideas, setIdeas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        // 1) 스토어에서 항목이 있으면 그걸 기반으로 초기화
        if (storedStructureItem) {
            return [
                {
                    id: storedStructureItem.id,
                    title: storedStructureItem.title,
                    content: storedStructureItem.content || '',
                    category: 'other',
                    stage: 'initial',
                    tags: [],
                    priority: 'medium',
                    connections: [],
                    attachments: [],
                    notes: storedStructureItem.description || '',
                    createdAt: storedStructureItem.createdAt || new Date(),
                    updatedAt: storedStructureItem.updatedAt || new Date(),
                    isFavorite: false
                }
            ];
        }
        // 2) 기존 localStorage fallback
        try {
            const saved = localStorage.getItem(`ideas_${ideaId}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((idea)=>({
                        ...idea,
                        createdAt: new Date(idea.createdAt),
                        updatedAt: new Date(idea.updatedAt)
                    }));
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('IDEA_VIEW', 'Failed to load ideas from localStorage', {
                error
            });
        }
        // 3) 현실적이고 다양한 창작 아이디어 모음
        return [
            {
                id: '1',
                title: '완벽주의자의 작은 실수',
                content: '10년간 완벽한 기록을 유지해온 회계사가 커피를 쏟아 중요한 서류를 더럽히면서 시작되는 이야기. 작은 실수가 인생의 전환점이 되는 과정을 그린다.',
                category: 'character',
                stage: 'concrete',
                tags: [
                    '현실',
                    '성장',
                    '직장인',
                    '변화'
                ],
                priority: 'high',
                connections: [],
                attachments: [],
                notes: '현대인의 완벽주의 압박과 인간적 실수의 가치를 다룸',
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-20'),
                isFavorite: true
            },
            {
                id: '2',
                title: '서로 다른 방법, 같은 목표',
                content: '같은 문제를 해결하려는 두 사람이 정반대의 접근 방식으로 갈등하다가, 결국 각자의 장점을 인정하고 협력하게 되는 플롯 구조.',
                category: 'plot',
                stage: 'developing',
                tags: [
                    '갈등',
                    '협력',
                    '성장',
                    '관계'
                ],
                priority: 'medium',
                connections: [
                    '1'
                ],
                attachments: [],
                notes: '다양성과 상호보완의 가치를 보여주는 범용적 구조',
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-01-18'),
                isFavorite: false
            },
            {
                id: '3',
                title: '1990년대 소도시 서점',
                content: '인터넷이 없던 시절, 작은 서점이 동네 사람들의 정보 교환 허브 역할을 했던 공간. 책방 주인과 단골들 사이의 특별한 관계.',
                category: 'setting',
                stage: 'initial',
                tags: [
                    '향수',
                    '공동체',
                    '서점',
                    '90년대'
                ],
                priority: 'medium',
                connections: [],
                attachments: [],
                notes: '디지털 시대 이전의 따뜻한 인간관계와 정보 공유 문화',
                createdAt: new Date('2024-01-08'),
                updatedAt: new Date('2024-01-25'),
                isFavorite: true
            },
            {
                id: '4',
                title: '진정성 vs 완벽함',
                content: '겉으로는 완벽해 보이지만 속은 비어있는 것과, 불완전하지만 진실한 것 사이의 대립. 현대 사회의 SNS 문화와 연결.',
                category: 'theme',
                stage: 'applied',
                tags: [
                    '진정성',
                    'SNS',
                    '현대사회',
                    '자아'
                ],
                priority: 'high',
                connections: [
                    '1'
                ],
                attachments: [],
                notes: '현대인의 정체성 고민을 다루는 핵심 테마',
                createdAt: new Date('2024-01-12'),
                updatedAt: new Date('2024-01-22'),
                isFavorite: true
            },
            {
                id: '5',
                title: '"네가 옳다고 해서 내가 틀린 건 아니야"',
                content: '갈등 상황에서 상대방의 의견을 인정하면서도 자신의 입장을 포기하지 않는 성숙한 대화의 시작점이 되는 대사.',
                category: 'dialogue',
                stage: 'concrete',
                tags: [
                    '대화',
                    '갈등해결',
                    '성숙',
                    '소통'
                ],
                priority: 'medium',
                connections: [
                    '2'
                ],
                attachments: [],
                notes: '상대방을 존중하면서도 자신을 지키는 균형잡힌 표현',
                createdAt: new Date('2024-01-14'),
                updatedAt: new Date('2024-01-24'),
                isFavorite: false
            }
        ];
    });
    // 🔁 currentEditor 또는 스토어 구조가 변경되면 상태 동기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const stored = (()=>{
            try {
                const pid = currentEditor?.projectId;
                if (pid && structures[pid]) {
                    return structures[pid].find((it)=>it.id === ideaId);
                }
            } catch (e) {
            // ignore
            }
            return undefined;
        })();
        if (stored) {
            setIdeas([
                {
                    id: stored.id,
                    title: stored.title,
                    content: stored.content || '',
                    category: 'other',
                    stage: 'initial',
                    tags: [],
                    priority: 'medium',
                    connections: [],
                    attachments: [],
                    notes: stored.description || '',
                    createdAt: stored.createdAt || new Date(),
                    updatedAt: stored.updatedAt || new Date(),
                    isFavorite: false
                }
            ]);
            return;
        }
        // fallback: localStorage
        try {
            const saved = localStorage.getItem(`ideas_${ideaId}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                setIdeas(parsed.map((idea)=>({
                        ...idea,
                        createdAt: new Date(idea.createdAt),
                        updatedAt: new Date(idea.updatedAt)
                    })));
                return;
            }
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('IDEA_VIEW', 'Failed to sync ideas from localStorage', {
                err
            });
        }
    // otherwise keep existing state (mock)
    }, [
        structures,
        currentEditor,
        ideaId
    ]);
    // 🔥 ESC 키로 뒤로가기 - ProjectHeader와 동일한 방식
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleGlobalEscape = (event)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('IDEA_VIEW', 'ESC key pressed, going back to structure view');
            onBack();
            event.preventDefault();
        };
        window.addEventListener('global:escape', handleGlobalEscape);
        return ()=>window.removeEventListener('global:escape', handleGlobalEscape);
    }, [
        onBack
    ]);
    // 🔥 데이터 저장 함수
    const saveToLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newIdeas)=>{
        try {
            localStorage.setItem(`ideas_${ideaId}`, JSON.stringify(newIdeas));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('IDEA_VIEW', 'Failed to save ideas to localStorage', {
                error
            });
        }
    }, [
        ideaId
    ]);
    // 🔥 자동 저장이 포함된 setIdeas 래퍼
    const updateIdeas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newIdeas)=>{
        if (typeof newIdeas === 'function') {
            setIdeas((prev)=>{
                const updated = newIdeas(prev);
                saveToLocalStorage(updated);
                return updated;
            });
        } else {
            setIdeas(newIdeas);
            saveToLocalStorage(newIdeas);
        }
    }, [
        saveToLocalStorage
    ]);
    // 🔥 되돌리기/다시하기 기능
    const [undoStack, setUndoStack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [redoStack, setRedoStack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('cards');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [selectedStage, setSelectedStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [editingIdea, setEditingIdea] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quickCaptureText, setQuickCaptureText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [draggedItemId, setDraggedItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOverItemId, setDragOverItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 필터링된 아이디어
    const filteredIdeas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return ideas.filter((idea)=>{
            const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || idea.content.toLowerCase().includes(searchTerm.toLowerCase()) || idea.tags.some((tag)=>tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
            const matchesStage = selectedStage === 'all' || idea.stage === selectedStage;
            return matchesSearch && matchesCategory && matchesStage;
        });
    }, [
        ideas,
        searchTerm,
        selectedCategory,
        selectedStage
    ]);
    // 🔥 통계 계산
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return {
            total: ideas.length,
            favorites: ideas.filter((i)=>i.isFavorite).length,
            applied: ideas.filter((i)=>i.stage === 'applied').length,
            highPriority: ideas.filter((i)=>i.priority === 'high').length
        };
    }, [
        ideas
    ]);
    // 🔥 되돌리기/다시하기 함수들
    const saveToUndoStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((currentIdeas)=>{
        setUndoStack((prev)=>[
                ...prev.slice(-19),
                currentIdeas
            ]); // 최대 20개 상태만 유지
        setRedoStack([]); // 새 동작 시 redo 스택 초기화
    }, []);
    // 🔥 빠른 캡처
    const handleQuickCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
        updateIdeas((prev)=>[
                newIdea,
                ...prev
            ]);
        setQuickCaptureText('');
    }, [
        quickCaptureText,
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    // 🔥 아이디어 저장
    const saveIdea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!editingIdea) return;
        saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
        if (showAddModal) {
            const newIdea = {
                ...editingIdea,
                id: Date.now().toString(),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            updateIdeas((prev)=>[
                    newIdea,
                    ...prev
                ]);
        } else {
            updateIdeas((prev)=>prev.map((i)=>i.id === editingIdea.id ? {
                        ...editingIdea,
                        updatedAt: new Date()
                    } : i));
        }
        setEditingIdea(null);
        setShowAddModal(false);
    }, [
        editingIdea,
        showAddModal,
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    // 🔥 아이디어 삭제
    const deleteIdea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        if (window.confirm('정말로 이 아이디어를 삭제하시겠습니까?')) {
            saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
            updateIdeas((prev)=>prev.filter((i)=>i.id !== id));
        }
    }, [
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    // 🔥 즐겨찾기 토글
    const toggleFavorite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
        updateIdeas((prev)=>prev.map((i)=>i.id === id ? {
                    ...i,
                    isFavorite: !i.isFavorite
                } : i));
    }, [
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    const handleUndo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (undoStack.length === 0) return;
        const previousState = undoStack[undoStack.length - 1];
        if (!previousState) return;
        setRedoStack((prev)=>[
                ...prev,
                ideas
            ]);
        updateIdeas(previousState);
        setUndoStack((prev)=>prev.slice(0, -1));
    }, [
        ideas,
        undoStack,
        updateIdeas
    ]);
    const handleRedo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (redoStack.length === 0) return;
        const nextState = redoStack[redoStack.length - 1];
        if (!nextState) return;
        setUndoStack((prev)=>[
                ...prev,
                ideas
            ]);
        updateIdeas(nextState);
        setRedoStack((prev)=>prev.slice(0, -1));
    }, [
        ideas,
        redoStack,
        updateIdeas
    ]);
    // 🔥 단축키 처리
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
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
    }, [
        handleUndo,
        handleRedo
    ]);
    // 🔥 단축키 이벤트 리스너 등록
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        document.addEventListener('keydown', handleKeyDown);
        return ()=>document.removeEventListener('keydown', handleKeyDown);
    }, [
        handleKeyDown
    ]);
    // 🔥 새 아이디어 추가
    const handleAddNewIdea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
    }, []);
    // 🔥 드래그 앤 드롭 핸들러
    const handleDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, ideaId)=>{
        setDraggedItemId(ideaId);
        e.dataTransfer.effectAllowed = 'move';
    }, []);
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, ideaId)=>{
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverItemId(ideaId);
    }, []);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setDragOverItemId(null);
    }, []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, targetId)=>{
        e.preventDefault();
        if (!draggedItemId || draggedItemId === targetId) {
            setDraggedItemId(null);
            setDragOverItemId(null);
            return;
        }
        saveToUndoStack(ideas); // Undo 스택에 현재 상태 저장
        const draggedIndex = ideas.findIndex((idea)=>idea.id === draggedItemId);
        const targetIndex = ideas.findIndex((idea)=>idea.id === targetId);
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
    }, [
        draggedItemId,
        ideas,
        saveToUndoStack,
        updateIdeas
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: IDEA_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: IDEA_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: IDEA_STYLES.headerTop,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onBack,
                                className: IDEA_STYLES.backButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 613,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "구조로 돌아가기"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 614,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 612,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: IDEA_STYLES.title,
                                children: "아이디어 관리"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 617,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: IDEA_STYLES.headerActions,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 mr-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleUndo,
                                                disabled: undoStack.length === 0,
                                                className: `${IDEA_STYLES.button} ${undoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`,
                                                title: "되돌리기 (Ctrl+Z / Cmd+Z)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 621,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleRedo,
                                                disabled: redoStack.length === 0,
                                                className: `${IDEA_STYLES.button} ${redoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`,
                                                title: "다시하기 (Ctrl+Y / Cmd+Shift+Z)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__["Redo2"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 629,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 620,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleAddNewIdea,
                                        className: `${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 16,
                                                className: "mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 642,
                                                columnNumber: 29
                                            }, this),
                                            "새 아이디어"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 638,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 619,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                        lineNumber: 611,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: IDEA_STYLES.quickCapture,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                    lineNumber: 651,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleQuickCapture,
                                    disabled: !quickCaptureText.trim(),
                                    className: IDEA_STYLES.captureButton,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 663,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 650,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                        lineNumber: 649,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: IDEA_STYLES.toolbar,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: IDEA_STYLES.toolbarLeft,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: IDEA_STYLES.searchContainer,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                size: 16,
                                                className: IDEA_STYLES.searchIcon
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 677,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: searchTerm,
                                                onChange: (e)=>setSearchTerm(e.target.value),
                                                placeholder: "아이디어 검색...",
                                                className: IDEA_STYLES.searchInput
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 678,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 676,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedCategory,
                                        onChange: (e)=>setSelectedCategory(e.target.value),
                                        className: IDEA_STYLES.filterButton,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "모든 카테고리"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 692,
                                                columnNumber: 29
                                            }, this),
                                            Object.entries(CATEGORY_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: key,
                                                    children: value.label
                                                }, key, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 694,
                                                    columnNumber: 33
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 687,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedStage,
                                        onChange: (e)=>setSelectedStage(e.target.value),
                                        className: IDEA_STYLES.filterButton,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "모든 단계"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 703,
                                                columnNumber: 29
                                            }, this),
                                            Object.entries(STAGE_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: key,
                                                    children: value.label
                                                }, key, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 705,
                                                    columnNumber: 33
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 698,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 675,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: IDEA_STYLES.toolbarRight,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.viewToggle,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('cards'),
                                            className: `${IDEA_STYLES.viewButton} ${viewMode === 'cards' ? IDEA_STYLES.viewButtonActive : IDEA_STYLES.viewButtonInactive}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3x3$3e$__["Grid3x3"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 717,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 712,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('list'),
                                            className: `${IDEA_STYLES.viewButton} ${viewMode === 'list' ? IDEA_STYLES.viewButtonActive : IDEA_STYLES.viewButtonInactive}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 724,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 719,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 711,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 710,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                        lineNumber: 674,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                lineNumber: 610,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: IDEA_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: IDEA_STYLES.scrollArea,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.statsGrid,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 737,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.total
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 738,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "총 아이디어"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 739,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 736,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 742,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.favorites
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 743,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "즐겨찾기"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 744,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 741,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 747,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.applied
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 748,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "적용됨"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 749,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 746,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 752,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.highPriority
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 753,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statLabel,
                                            children: "높은 우선순위"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 754,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 751,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 735,
                            columnNumber: 21
                        }, this),
                        filteredIdeas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                    className: IDEA_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 761,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: IDEA_STYLES.emptyTitle,
                                    children: "아이디어가 없습니다"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 762,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: IDEA_STYLES.emptyDescription,
                                    children: "위의 빠른 캡처를 사용하여 첫 번째 아이디어를 추가해보세요!"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 763,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 760,
                            columnNumber: 25
                        }, this) : viewMode === 'cards' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.cardsContainer,
                            children: filteredIdeas.map((idea)=>{
                                const CategoryIcon = CATEGORY_STYLES[idea.category].icon;
                                // 🔥 편집 핸들러들 (Hook 제거)
                                const handleIdeaClick = ()=>{
                                    setEditingIdea(idea);
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('IDEA_VIEW', '클릭으로 편집 모드 활성화', {
                                        title: idea.title
                                    });
                                };
                                const handleIdeaDoubleClick = ()=>{
                                    setEditingIdea(idea);
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('IDEA_VIEW', '더블클릭으로 편집 모드', {
                                        title: idea.title
                                    });
                                };
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${IDEA_STYLES.ideaCard} ${draggedItemId === idea.id ? 'opacity-50' : ''} ${dragOverItemId === idea.id ? 'ring-2 ring-blue-500' : ''} select-none cursor-pointer`,
                                    style: {
                                        userSelect: 'none'
                                    },
                                    draggable: false,
                                    onClick: handleIdeaClick,
                                    onDoubleClick: handleIdeaDoubleClick,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.cardHeader,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: IDEA_STYLES.cardTitle,
                                                    children: idea.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 800,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: IDEA_STYLES.cardActions,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                toggleFavorite(idea.id);
                                                            },
                                                            className: IDEA_STYLES.actionButton,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                size: 14,
                                                                className: idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 809,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 802,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                deleteIdea(idea.id);
                                                            },
                                                            className: IDEA_STYLES.actionButton,
                                                            title: "삭제",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 823,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 814,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 801,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 799,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: IDEA_STYLES.cardContent,
                                            children: idea.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 828,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.cardFooter,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: IDEA_STYLES.cardMeta,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `${IDEA_STYLES.badge} ${CATEGORY_STYLES[idea.category].color}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
                                                                    size: 12
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                    lineNumber: 833,
                                                                    columnNumber: 53
                                                                }, this),
                                                                CATEGORY_STYLES[idea.category].label
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 832,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `${IDEA_STYLES.badge} ${STAGE_STYLES[idea.stage].color}`,
                                                            children: STAGE_STYLES[idea.stage].label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 836,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 831,
                                                    columnNumber: 45
                                                }, this),
                                                idea.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: IDEA_STYLES.cardTags,
                                                    children: [
                                                        idea.tags.slice(0, 3).map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: IDEA_STYLES.tag,
                                                                children: tag
                                                            }, index, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 844,
                                                                columnNumber: 57
                                                            }, this)),
                                                        idea.tags.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: IDEA_STYLES.tag,
                                                            children: [
                                                                "+",
                                                                idea.tags.length - 3
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 849,
                                                            columnNumber: 57
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 842,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 830,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, idea.id, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 784,
                                    columnNumber: 37
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 768,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.listContainer,
                            children: filteredIdeas.map((idea)=>{
                                const CategoryIcon = CATEGORY_STYLES[idea.category].icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.listItem,
                                    onClick: ()=>setEditingIdea(idea),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-semibold text-gray-900 dark:text-gray-100",
                                                                children: idea.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 872,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `${IDEA_STYLES.badge} ${CATEGORY_STYLES[idea.category].color}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                        lineNumber: 876,
                                                                        columnNumber: 57
                                                                    }, this),
                                                                    CATEGORY_STYLES[idea.category].label
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 875,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `${IDEA_STYLES.badge} ${STAGE_STYLES[idea.stage].color}`,
                                                                children: STAGE_STYLES[idea.stage].label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 879,
                                                                columnNumber: 53
                                                            }, this),
                                                            idea.isFavorite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                size: 14,
                                                                className: "fill-yellow-400 text-yellow-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 883,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 871,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2",
                                                        children: idea.content
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 886,
                                                        columnNumber: 49
                                                    }, this),
                                                    idea.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-1 flex-wrap",
                                                        children: idea.tags.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: IDEA_STYLES.tag,
                                                                children: tag
                                                            }, index, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 892,
                                                                columnNumber: 61
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 890,
                                                        columnNumber: 53
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 870,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            toggleFavorite(idea.id);
                                                        },
                                                        className: IDEA_STYLES.actionButton,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                            size: 14,
                                                            className: idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 908,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 901,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            deleteIdea(idea.id);
                                                        },
                                                        className: IDEA_STYLES.actionButton,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 917,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 910,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 900,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 869,
                                        columnNumber: 41
                                    }, this)
                                }, idea.id, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 864,
                                    columnNumber: 37
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 859,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                    lineNumber: 733,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                lineNumber: 732,
                columnNumber: 13
            }, this),
            (editingIdea || showAddModal) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: IDEA_STYLES.modal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: IDEA_STYLES.modalContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.modalHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: IDEA_STYLES.modalTitle,
                                    children: showAddModal ? '새 아이디어' : '아이디어 편집'
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 934,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setEditingIdea(null);
                                        setShowAddModal(false);
                                    },
                                    className: IDEA_STYLES.actionButton,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 944,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 937,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 933,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.modalBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "제목"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 950,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 951,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 949,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "내용"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 961,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                            lineNumber: 962,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 960,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "카테고리"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 973,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editingIdea?.category || 'other',
                                                    onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                                ...prev,
                                                                category: e.target.value
                                                            } : null),
                                                    className: IDEA_STYLES.select,
                                                    children: Object.entries(CATEGORY_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: key,
                                                            children: value.label
                                                        }, key, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 980,
                                                            columnNumber: 45
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 974,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 972,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "개발 단계"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 986,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editingIdea?.stage || 'initial',
                                                    onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                                ...prev,
                                                                stage: e.target.value
                                                            } : null),
                                                    className: IDEA_STYLES.select,
                                                    children: Object.entries(STAGE_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: key,
                                                            children: value.label
                                                        }, key, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 993,
                                                            columnNumber: 45
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 987,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 985,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "우선순위"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 999,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editingIdea?.priority || 'medium',
                                                    onChange: (e)=>setEditingIdea((prev)=>prev ? {
                                                                ...prev,
                                                                priority: e.target.value
                                                            } : null),
                                                    className: IDEA_STYLES.select,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "low",
                                                            children: "낮음"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 1005,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "medium",
                                                            children: "보통"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 1006,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "high",
                                                            children: "높음"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 1007,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 1000,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 998,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 971,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "태그 (쉼표로 구분)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 1013,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 1014,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 1012,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "메모"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 1024,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                            lineNumber: 1025,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 948,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.modalFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setEditingIdea(null);
                                        setShowAddModal(false);
                                    },
                                    className: `${IDEA_STYLES.button} ${IDEA_STYLES.secondaryButton}`,
                                    children: "취소"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 1036,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: saveIdea,
                                    className: `${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 1045,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                            lineNumber: 1035,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                    lineNumber: 932,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                lineNumber: 931,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
        lineNumber: 608,
        columnNumber: 9
    }, this);
}
}}),

};

//# sourceMappingURL=src_renderer_components_projects_views_a5ded1e4._.js.map