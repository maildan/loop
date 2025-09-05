module.exports = {

"[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 Re-exported Modularized MarkdownEditor
// 기존 777줄 파일을 새로운 모듈화된 구조로 완전 교체
// 원본 기능은 modules/markdownEditor에서 모듈화되어 제공됨
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx [app-ssr] (ecmascript)");
'use client';
;
}}),
"[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$MarkdownEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-ssr] (ecmascript) <locals>");
}}),
"[project]/src/renderer/components/projects/editor/EditorConfig.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 EasyMDE 에디터 설정 모듈
// EasyMDE 타입 정의
__turbopack_context__.s({
    "getEditorOptions": (()=>getEditorOptions),
    "getFocusModeOptions": (()=>getFocusModeOptions)
});
const getEditorOptions = ()=>({
        autofocus: true,
        spellChecker: false,
        placeholder: '이야기를 시작해보세요...',
        status: [
            'lines',
            'words',
            'cursor'
        ],
        toolbar: false,
        shortcuts: {
            "toggleBold": "Cmd-B",
            "toggleItalic": "Cmd-I",
            "drawLink": "Cmd-K",
            "toggleHeading1": "Cmd-Alt-1",
            "toggleHeading2": "Cmd-Alt-2",
            "toggleHeading3": "Cmd-Alt-3",
            "cleanBlock": "Cmd-E",
            "drawImage": "Cmd-Alt-I",
            "toggleUnorderedList": "Cmd-Shift-8",
            "toggleOrderedList": "Cmd-Shift-7",
            "toggleBlockquote": "Cmd-Shift-9",
            "toggleCodeBlock": "Cmd-Alt-C",
            "togglePreview": "Cmd-P",
            "toggleSideBySide": "F9",
            "toggleFullScreen": "F11",
            "toggleDarkMode": "Cmd-D" // 🔥 다크모드 토글 단축키 추가
        },
        // 🔥 한글 입력 최적화 설정 (2024-2025 최신 IME 지원)
        inputStyle: "contenteditable",
        nativeSpellcheck: true,
        previewRender: (plainText)=>{
            return `<div class="prose dark:prose-invert max-w-none">${plainText}</div>`;
        },
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true
        },
        autoDownloadFontAwesome: false,
        tabSize: 2,
        lineWrapping: true,
        styleSelectedText: false,
        parsingConfig: {
            allowAtxHeaderWithoutSpace: true
        },
        lineNumbers: false,
        mode: {
            name: "markdown",
            highlightFormatting: false
        },
        // 🔥 한글 입력 최적화 설정 (IME 방해 요소 제거)
        configureMouse: ()=>({
                addNew: false
            }),
        indentWithTabs: false,
        smartIndent: false,
        electricChars: false,
        rtlMoveVisually: true,
        // 🔥 노션 스타일 커스텀 키 맵핑 (커서 위치 보존 강화)
        extraKeys: {
            // 🔥 노션 스타일 굵게 (Cmd+B) - 기가차드 수정: 포커스 조작 제거
            "Cmd-B": function(cm) {
                const cursor = cm.getCursor();
                const selection = cm.getSelection();
                if (selection) {
                    cm.replaceSelection(`**${selection}**`);
                } else {
                    cm.replaceSelection('****');
                    cm.setCursor({
                        line: cursor.line,
                        ch: cursor.ch + 2
                    });
                }
            },
            // 🔥 노션 스타일 기울임 (Cmd+I) - 기가차드 수정: 포커스 조작 제거
            "Cmd-I": function(cm) {
                const cursor = cm.getCursor();
                const selection = cm.getSelection();
                if (selection) {
                    cm.replaceSelection(`*${selection}*`);
                } else {
                    cm.replaceSelection('**');
                    cm.setCursor({
                        line: cursor.line,
                        ch: cursor.ch + 1
                    });
                }
            },
            // 🔥 노션 스타일 링크 (Cmd+K) - 기가차드 수정: 포커스 조작 제거
            "Cmd-K": function(cm) {
                const cursor = cm.getCursor();
                const selection = cm.getSelection();
                if (selection) {
                    cm.replaceSelection(`[${selection}]()`);
                    const newCursor = cm.getCursor();
                    cm.setCursor({
                        line: newCursor.line,
                        ch: newCursor.ch - 1
                    });
                } else {
                    cm.replaceSelection('[링크 텍스트]()');
                    cm.setSelection({
                        line: cursor.line,
                        ch: cursor.ch + 1
                    }, {
                        line: cursor.line,
                        ch: cursor.ch + 6
                    });
                }
            },
            // 🔥 기가차드 마크다운 변환: Space 키로 마크업 자동 변환
            "Space": function(cm) {
                const cursor = cm.getCursor();
                const line = cm.getLine(cursor.line);
                const lineStart = line.substring(0, cursor.ch);
                // 1. 헤딩 패턴 감지 (# 1-6개) - 정확한 마크다운 변환
                const headingMatch = lineStart.match(/^(#{1,6})$/);
                if (headingMatch) {
                    // 단순히 스페이스만 추가 (### -> ### )
                    cm.replaceSelection(' ');
                    return;
                }
                // 2. 리스트 패턴 감지 (- 또는 *)
                const listMatch = lineStart.match(/^([-*])$/);
                if (listMatch) {
                    cm.replaceSelection(' ');
                    return;
                }
                // 3. 번호 리스트 패턴 감지 (1. 2. 등)
                const numberedListMatch = lineStart.match(/^(\d+\.)$/);
                if (numberedListMatch) {
                    cm.replaceSelection(' ');
                    return;
                }
                // 4. 인용구 패턴 감지 (>)
                const quoteMatch = lineStart.match(/^(>)$/);
                if (quoteMatch) {
                    cm.replaceSelection(' ');
                    return;
                }
                // 기본 스페이스 입력
                cm.replaceSelection(' ');
            }
        }
    });
const getFocusModeOptions = ()=>({
        ...getEditorOptions(),
        toolbar: false,
        status: false
    });
}}),
"[project]/src/renderer/components/projects/editor/EditorProvider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditorProvider": (()=>EditorProvider),
    "useEditor": (()=>useEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorConfig.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const EditorContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function useEditor() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
}
function EditorProvider({ children }) {
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initializeEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((editor)=>{
        if (!editor) return;
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR', 'Initializing editor for Korean input optimization');
            // 🔥 에디터 레퍼런스 저장
            editorRef.current = editor;
            // 에디터 참조 저장
            editorRef.current = editor;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR', 'Editor initialized with Korean input optimization');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('EDITOR', 'Failed to initialize editor', error);
        }
    }, []);
    const contextValue = {
        editorRef,
        initializeEditor,
        getEditorOptions: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEditorOptions"],
        getFocusModeOptions: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFocusModeOptions"]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EditorContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/editor/EditorProvider.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ShortcutHelp": (()=>ShortcutHelp),
    "resetShortcutHelpVisibility": (()=>resetShortcutHelpVisibility)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-ssr] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$EditorShortcuts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/EditorShortcuts.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
// 🔥 단축키 도움말 스타일
const HELP_STYLES = {
    trigger: 'fixed bottom-4 right-4 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer',
    hidden: 'hidden',
    modal: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
    panel: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden',
    header: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700',
    title: 'text-xl font-bold text-slate-900 dark:text-slate-100',
    closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
    content: 'p-6 overflow-y-auto',
    helpText: 'prose prose-slate dark:prose-invert max-w-none text-sm',
    footer: 'p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between',
    hideButton: 'flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
};
function resetShortcutHelpVisibility() {
    localStorage.setItem('shortcutHelp.isVisible', 'true');
}
function ShortcutHelp({ className = '', isWriterStatsOpen = false }) {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // localStorage에서 가이드 표시 여부 상태 불러오기
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedVisibility = localStorage.getItem('shortcutHelp.isVisible');
        if (savedVisibility !== null) {
            setIsVisible(savedVisibility === 'true');
        }
    }, []);
    const handleToggle = ()=>{
        setIsOpen((prev)=>!prev);
    };
    const handleClose = ()=>{
        setIsOpen(false);
    };
    const handleHideGuide = ()=>{
        if (confirm('단축키 가이드를 항상 숨기시겠습니까? 설정 페이지에서 다시 표시할 수 있습니다.')) {
            setIsVisible(false);
            setIsOpen(false);
            localStorage.setItem('shortcutHelp.isVisible', 'false');
        }
    };
    const handleBackdropClick = (event)=>{
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };
    // 🔥 Escape 키로 닫기 및 F1 키로 열기
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleEscape = (event)=>{
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        const handleHelpShortcut = ()=>{
            setIsOpen((prev)=>!prev);
        };
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('shortcut:help', handleHelpShortcut);
        return ()=>{
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('shortcut:help', handleHelpShortcut);
        };
    }, [
        isOpen
    ]);
    // WriterStatsPanel이 열려있을 때 숨기기
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isWriterStatsOpen) {
            setIsOpen(false);
        }
    }, [
        isWriterStatsOpen
    ]);
    // 가이드 숨김 상태면 아무것도 표시하지 않음
    if (!isVisible) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {}, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `${HELP_STYLES.trigger} ${className}`,
                onClick: handleToggle,
                title: "단축키 도움말 (F1)",
                "aria-label": "단축키 도움말",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                    size: 24
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: HELP_STYLES.modal,
                onClick: handleBackdropClick,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: HELP_STYLES.panel,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: HELP_STYLES.header,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: HELP_STYLES.title,
                                    children: "키보드 단축키"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: HELP_STYLES.closeButton,
                                    onClick: handleClose,
                                    "aria-label": "닫기",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: HELP_STYLES.content,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: HELP_STYLES.helpText,
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$EditorShortcuts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getShortcutHelp"])().split('\n').map((line, idx)=>{
                                    if (line.startsWith('### ')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-md font-bold mt-2 mb-1",
                                        children: line.replace('### ', '')
                                    }, idx, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 132,
                                        columnNumber: 55
                                    }, this);
                                    if (line.startsWith('## ')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold mt-3 mb-2",
                                        children: line.replace('## ', '')
                                    }, idx, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 133,
                                        columnNumber: 54
                                    }, this);
                                    if (line.startsWith('# ')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl font-bold mt-4 mb-2",
                                        children: line.replace('# ', '')
                                    }, idx, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 134,
                                        columnNumber: 53
                                    }, this);
                                    // bold **text**
                                    const parts = [];
                                    let remaining = line;
                                    const boldRe = /\*\*(.*?)\*\*/;
                                    while(true){
                                        const m = remaining.match(boldRe);
                                        if (!m) break;
                                        const before = remaining.slice(0, m.index);
                                        if (before) parts.push(before);
                                        parts.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: m[1]
                                        }, `${idx}-b-${parts.length}`, false, {
                                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                            lineNumber: 144,
                                            columnNumber: 32
                                        }, this));
                                        remaining = remaining.slice((m.index || 0) + m[0].length);
                                    }
                                    if (remaining) parts.push(remaining);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "leading-relaxed",
                                        style: {
                                            marginTop: 4
                                        },
                                        children: parts
                                    }, idx, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                        lineNumber: 148,
                                        columnNumber: 26
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: HELP_STYLES.footer,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: HELP_STYLES.hideButton,
                                    onClick: handleHideGuide,
                                    title: "이 가이드를 항상 숨기기",
                                    "aria-label": "가이드 숨기기",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                            size: 16,
                                            className: "mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                            lineNumber: 162,
                                            columnNumber: 17
                                        }, this),
                                        "가이드 숨기기"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                                    lineNumber: 156,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                            lineNumber: 154,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
}}),
"[project]/src/renderer/components/projects/editor/WriterStats.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 작가 통계 계산 유틸리티
__turbopack_context__.s({
    "calculateWriterStats": (()=>calculateWriterStats),
    "formatLastSaved": (()=>formatLastSaved),
    "formatTime": (()=>formatTime),
    "getRecommendedWordGoal": (()=>getRecommendedWordGoal)
});
const calculateWriterStats = (content, wordGoal, sessionStartTime)=>{
    if (!content) {
        return {
            wordCount: 0,
            charCount: 0,
            paragraphCount: 0,
            readingTime: 0,
            wordGoal,
            progress: 0,
            sessionTime: 0,
            wpm: 0,
            headingCount: 0,
            listItemCount: 0
        };
    }
    const lines = content.split('\n');
    const wordCount = content.split(/\s+/).filter((word)=>word.length > 0).length;
    const charCount = content.length;
    const paragraphCount = content.split(/\n\s*\n/).filter((p)=>p.trim().length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // 분 단위 (200 WPM 기준)
    const progress = Math.min(100, Math.round(wordCount / wordGoal * 100));
    // 세션 시간 및 WPM 계산
    const sessionMinutes = Math.max(1, (Date.now() - sessionStartTime) / 1000 / 60);
    const wpm = Math.round(wordCount / sessionMinutes);
    const sessionTime = Math.floor(sessionMinutes);
    // 마크다운 요소 카운트
    const headingCount = lines.filter((line)=>line.match(/^#{1,6}\s/)).length;
    const listItemCount = lines.filter((line)=>line.match(/^[\s]*[-*+]\s/)).length;
    return {
        wordCount,
        charCount,
        paragraphCount,
        readingTime,
        wordGoal,
        progress,
        sessionTime,
        wpm,
        headingCount,
        listItemCount
    };
};
const formatTime = (minutes)=>{
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins ? `${mins}분` : ''}`;
};
const formatLastSaved = (lastSaved)=>{
    if (!lastSaved) return '저장되지 않음';
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
};
const getRecommendedWordGoal = (averageWordsPerDay)=>{
    const base = Math.max(500, averageWordsPerDay);
    return [
        Math.round(base * 0.8),
        base,
        Math.round(base * 1.2),
        Math.round(base * 1.5),
        Math.round(base * 2.0)
    ];
};
}}),
"[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "WriterStatsPanel": (()=>WriterStatsPanel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// AI 및 WPM 도입 - 기가차드 완벽 구현
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-ssr] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.js [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/WriterStats.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
// Helper: send payload to AI endpoint(s) using env config and prefer HTTPS
async function aiPost(payload) {
    const PRIMARY_API = (process.env.NEXT_PUBLIC_AI_API_URL || 'https://loop-openai.onrender.com').replace(/\/$/, '');
    const FALLBACK_API = (process.env.NEXT_PUBLIC_AI_FALLBACK_URL || (("TURBOPACK compile-time truthy", 1) ? 'http://0.0.0.0:8080' : ("TURBOPACK unreachable", undefined))).replace(/\/$/, '');
    const doPost = async (base)=>{
        if (!base) throw new Error('No API URL configured');
        // Allow only secure endpoints (https) in production. Allow http only for localhost/127.0.0.1 during development.
        try {
            const parsed = new URL(base);
            const isSecure = parsed.protocol === 'https:';
            const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
            if (!isSecure && !(isLocalhost && ("TURBOPACK compile-time value", "development") === 'development')) {
                throw new Error('Insecure API endpoint not allowed');
            }
        } catch (e) {
            throw new Error('Invalid API URL');
        }
        const resp = await fetch(`${base}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error(`API 응답 에러: ${resp.status} - ${resp.statusText}`);
        return await resp.json();
    };
    try {
        return await doPost(PRIMARY_API);
    } catch (primaryErr) {
        if (FALLBACK_API) {
            try {
                return await doPost(FALLBACK_API);
            } catch (fallbackErr) {
                const err = new Error('Both AI endpoints failed');
                err.primaryErr = primaryErr;
                err.fallbackErr = fallbackErr;
                throw err;
            }
        }
        throw primaryErr;
    }
}
const STATS_STYLES = {
    rightSidebar: 'w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out',
    rightSidebarCollapsed: 'w-0 overflow-hidden transition-all duration-300 ease-in-out',
    rightSidebarHeader: 'flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800',
    rightSidebarTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100',
    iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
    statCard: 'bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3',
    statTitle: 'text-xs font-medium text-slate-600 dark:text-slate-400 mb-1',
    statValue: 'text-lg font-bold text-slate-900 dark:text-slate-100',
    statSubtext: 'text-xs text-slate-500 dark:text-slate-400',
    // 🔥 탭 스타일 추가
    tabs: 'flex border-b border-slate-200 dark:border-slate-800',
    tab: 'px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer',
    tabActive: 'px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 cursor-pointer',
    tabContent: 'p-4 flex-1 overflow-y-auto',
    // 🔥 AI 채팅 스타일 - UI 잘림 문제 해결
    chatContainer: 'flex flex-col h-full overflow-hidden',
    chatMessages: 'flex-1 overflow-y-auto px-2 py-3 space-y-3 max-h-[calc(100%-60px)]',
    chatMessage: 'p-3 rounded-lg text-sm break-words whitespace-pre-wrap max-w-[90%]',
    userMessage: 'bg-blue-100 dark:bg-blue-900/40 ml-8 mr-2 text-slate-800 dark:text-slate-200',
    aiMessage: 'bg-slate-100 dark:bg-slate-800 ml-2 mr-8 text-slate-800 dark:text-slate-200 overflow-auto',
    chatInputContainer: 'flex p-2 border-t border-slate-200 dark:border-slate-800 mt-auto',
    chatInput: 'flex-1 rounded-l-md px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500',
    chatSendButton: 'flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed',
    loadingDots: 'flex space-x-1 items-center justify-center py-2',
    loadingDot: 'w-2 h-2 bg-slate-400 rounded-full animate-pulse'
};
function WriterStatsPanel({ showRightSidebar, toggleRightSidebar, writerStats, setWordGoal, currentText = '', projectId }) {
    // 🔥 탭 관리
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('stats');
    // 🔥 AI 기능 상태 관리
    const [aiLoading, setAiLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aiResults, setAiResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // 🔥 AI 채팅 상태 관리
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [userInput, setUserInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isAiTyping, setIsAiTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const chatEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 실제 세션 관리
    const [sessionStartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>Date.now());
    const [realTimeStats, setRealTimeStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastWordCount, setLastWordCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 OpenAI 채팅 통합 - Electron API를 통한 IPC 통신으로 변경
    const sendMessageToOpenAI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (content)=>{
        try {
            // 사용자 메시지 추가
            const userMessage = {
                role: 'user',
                content
            };
            setMessages((prev)=>[
                    ...prev,
                    userMessage
                ]);
            // AI 응답 로딩 상태 시작
            setIsAiTyping(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_CHAT', 'AI request started', {
                preview: content.substring(0, 30) + '...'
            });
            // Electron API를 통한 AI 요청
            if ("undefined" !== 'undefined' && window.electronAPI?.ai?.sendMessage) {
                "TURBOPACK unreachable";
            } else {
                // Fallback: 직접 fetch (개발 환경 또는 Electron API 미사용시)
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('AI_CHAT', 'Electron API not available, using fetch fallback');
                try {
                    const data = await aiPost({
                        message: content
                    });
                    const aiMessage = {
                        role: 'ai',
                        content: data.response || '죄송합니다, 응답을 생성하지 못했습니다.'
                    };
                    setMessages((prev)=>[
                            ...prev,
                            aiMessage
                        ]);
                } catch (err) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_CHAT', 'AI fallback fetch error', err);
                    throw err;
                }
            }
        } catch (error) {
            const err = error;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_CHAT', 'AI response error', err);
            // 오류 메시지 추가
            const errorMessage = {
                role: 'ai',
                content: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요."
            };
            setMessages((prev)=>[
                    ...prev,
                    errorMessage
                ]);
        } finally{
            setIsAiTyping(false);
            // 입력 필드 비우기
            setUserInput('');
            // 채팅창 스크롤 맨 아래로
            setTimeout(()=>{
                chatEndRef.current?.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [
        messages,
        projectId
    ]);
    // 채팅 메시지 제출 처리
    const handleChatSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e?.preventDefault();
        if (userInput.trim() && !isAiTyping) {
            sendMessageToOpenAI(userInput.trim());
        }
    }, [
        userInput,
        isAiTyping,
        sendMessageToOpenAI
    ]);
    // 🔥 실시간 통계 계산
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentText) {
            const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWriterStats"])(currentText, writerStats.wordGoal, sessionStartTime);
            setRealTimeStats(stats);
            // WPM 계산을 위한 단어 수 변경 추적
            if (stats.wordCount !== lastWordCount) {
                setLastWordCount(stats.wordCount);
            }
        }
    }, [
        currentText,
        writerStats.wordGoal,
        sessionStartTime,
        lastWordCount
    ]);
    // 🔥 1초마다 세션 시간 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        intervalRef.current = setInterval(()=>{
            if (currentText) {
                const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWriterStats"])(currentText, writerStats.wordGoal, sessionStartTime);
                setRealTimeStats(stats);
            }
        }, 1000);
        return ()=>{
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [
        currentText,
        writerStats.wordGoal,
        sessionStartTime
    ]);
    // 🔥 실제 사용할 통계 데이터 (실시간 계산된 것 우선)
    const displayStats = realTimeStats || writerStats;
    // 🔥 AI 채팅창 스크롤 자동 조정
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [
        messages
    ]);
    // 🔥 AI 채팅 전송 - Electron API를 통한 실제 연동
    const handleSendMessage = async ()=>{
        if (!userInput.trim()) return;
        // 사용자 메시지 추가
        const newMessage = {
            role: 'user',
            content: userInput
        };
        setMessages((prev)=>[
                ...prev,
                newMessage
            ]);
        setUserInput('');
        setIsAiTyping(true);
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AI_CHAT', 'AI chat request started', {
                preview: userInput.substring(0, 30) + '...'
            });
            // Electron API를 통한 AI 요청
            if ("undefined" !== 'undefined' && window.electronAPI?.ai?.sendMessage) {
                "TURBOPACK unreachable";
            } else {
                // Fallback: 직접 fetch (개발 환경 또는 Electron API 미사용시)
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('AI_CHAT', 'Electron API not available, using fetch fallback');
                try {
                    const data = await aiPost({
                        message: userInput
                    });
                    const aiMessage = {
                        role: 'ai',
                        content: data.response || '죄송합니다, 응답을 생성하지 못했습니다.'
                    };
                    setMessages((prev)=>[
                            ...prev,
                            aiMessage
                        ]);
                } catch (err) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_CHAT', 'AI chat fetch failed', err);
                    throw err;
                }
            }
        } catch (error) {
            const err = error;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AI_CHAT', 'AI chat error', err);
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: 'ai',
                        content: '죄송합니다, 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.'
                    }
                ]);
        } finally{
            setIsAiTyping(false);
            // 채팅창 스크롤 맨 아래로
            setTimeout(()=>{
                if (chatEndRef.current) {
                    chatEndRef.current.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    };
    // 🔥 AI 기능 핸들러들
    const handleAIImproveText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!currentText || currentText.trim().length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('WRITER_STATS', 'No text to improve');
            return;
        }
        setAiLoading('improve');
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('WRITER_STATS', 'Requesting text improvement', {
                textLength: currentText.length
            });
            const requestBody = JSON.stringify({
                message: `다음 텍스트의 문장을 더 생생하고 흥미롭게 개선해주세요. 2-3개 예시를 들어 어떻게 개선할 수 있는지 보여주세요:\n\n${currentText.substring(0, 500)}...`
            });
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: requestBody
            };
            try {
                const data = await aiPost({
                    message: `다음 텍스트의 문장을 더 생생하고 흥미롭게 개선해주세요. 2-3개 예시를 들어 어떻게 개선할 수 있는지 보여주세요:\n\n${currentText.substring(0, 500)}...`
                });
                setAiResults((prev)=>({
                        ...prev,
                        improve: data.response || '문장 개선에 대한 제안을 생성하지 못했습니다. 다시 시도해주세요.'
                    }));
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Text improvement API failed', err);
                setAiResults((prev)=>({
                        ...prev,
                        improve: '죄송합니다, 문장 개선 중 오류가 발생했습니다. 다시 시도해주세요.'
                    }));
            }
        } catch (error) {
            const err = error;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Text improvement error', err);
            setAiResults((prev)=>({
                    ...prev,
                    improve: '죄송합니다, 문장 개선 중 오류가 발생했습니다. 다시 시도해주세요.'
                }));
        } finally{
            setAiLoading(null);
        }
    }, [
        currentText,
        projectId
    ]);
    const handleAICharacterAnalysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!projectId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('WRITER_STATS', 'No project ID for character analysis');
            return;
        }
        setAiLoading('character');
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('WRITER_STATS', 'Requesting character analysis', {
                projectId
            });
            // 텍스트 준비
            const analysisText = currentText ? currentText : "프로젝트에 대한 캐릭터 분석을 진행합니다.";
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: `다음 이야기에 등장하는 캐릭터들을 분석해주세요. 각 캐릭터의 강점, 약점, 동기, 발전 방향 등을 제시해주세요:\n\n${analysisText.substring(0, 1000)}...`
                })
            };
            try {
                const data = await aiPost({
                    message: `다음 이야기에 등장하는 캐릭터들을 분석해주세요. 각 캐릭터의 강점, 약점, 동기, 발전 방향 등을 제시해주세요:\n\n${analysisText.substring(0, 1000)}...`
                });
                setAiResults((prev)=>({
                        ...prev,
                        character: data.response || '캐릭터 분석을 생성하지 못했습니다. 다시 시도해주세요.'
                    }));
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Character analysis API failed', err);
                setAiResults((prev)=>({
                        ...prev,
                        character: '죄송합니다, 캐릭터 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                    }));
            }
        } catch (error) {
            const err = error;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Character analysis error', err);
            setAiResults((prev)=>({
                    ...prev,
                    character: '죄송합니다, 캐릭터 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                }));
        } finally{
            setAiLoading(null);
        }
    }, [
        projectId,
        currentText
    ]);
    const handleAIPlotCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!currentText || currentText.trim().length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('WRITER_STATS', 'No text for plot analysis');
            return;
        }
        setAiLoading('plot');
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('WRITER_STATS', 'Requesting plot analysis', {
                textLength: currentText.length
            });
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: `다음 이야기의 플롯 구조를 3막 구조에 맞춰 분석하고, 흐름과 페이스를 평가한 다음, 개선점을 제시해주세요:\n\n${currentText.substring(0, 1000)}...`
                })
            };
            try {
                const data = await aiPost({
                    message: `다음 이야기의 플롯 구조를 3막 구조에 맞춰 분석하고, 흐름과 페이스를 평가한 다음, 개선점을 제시해주세요:\n\n${currentText.substring(0, 1000)}...`
                });
                setAiResults((prev)=>({
                        ...prev,
                        plot: data.response || '플롯 분석을 생성하지 못했습니다. 다시 시도해주세요.'
                    }));
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Plot analysis API failed', err);
                setAiResults((prev)=>({
                        ...prev,
                        plot: '죄송합니다, 플롯 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                    }));
            }
        } catch (error) {
            const err = error;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Plot analysis error', err);
            setAiResults((prev)=>({
                    ...prev,
                    plot: '죄송합니다, 플롯 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                }));
        } finally{
            setAiLoading(null);
        }
    }, [
        currentText
    ]);
    const handleAIDialogueImprovement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!currentText || currentText.trim().length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('WRITER_STATS', 'No text for dialogue improvement');
            return;
        }
        setAiLoading('dialogue');
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('WRITER_STATS', 'Requesting dialogue improvement', {
                textLength: currentText.length
            });
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: `다음 이야기에서 대화를 분석하고, 더 자연스럽고 캐릭터를 잘 표현하는 대화 예시를 제안해주세요:\n\n${currentText.substring(0, 800)}...`
                })
            };
            try {
                const data = await aiPost({
                    message: `다음 이야기에서 대화를 분석하고, 더 자연스럽고 캐릭터를 잘 표현하는 대화 예시를 제안해주세요:\n\n${currentText.substring(0, 800)}...`
                });
                setAiResults((prev)=>({
                        ...prev,
                        dialogue: data.response || '대화 개선 제안을 생성하지 못했습니다. 다시 시도해주세요.'
                    }));
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Dialogue improvement API failed', err);
                setAiResults((prev)=>({
                        ...prev,
                        dialogue: '죄송합니다, 대화 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                    }));
            }
        } catch (error) {
            const err = error;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('WRITER_STATS', 'Dialogue improvement error', err);
            setAiResults((prev)=>({
                    ...prev,
                    dialogue: '죄송합니다, 대화 분석 중 오류가 발생했습니다. 다시 시도해주세요.'
                }));
        } finally{
            setAiLoading(null);
        }
    }, [
        currentText
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: showRightSidebar ? STATS_STYLES.rightSidebar : STATS_STYLES.rightSidebarCollapsed,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STATS_STYLES.rightSidebarHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: STATS_STYLES.rightSidebarTitle,
                        children: activeTab === 'stats' ? '작가 통계' : 'AI 창작 파트너'
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 521,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: STATS_STYLES.iconButton,
                        onClick: toggleRightSidebar,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                            lineNumber: 525,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 524,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                lineNumber: 520,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STATS_STYLES.tabs,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: activeTab === 'stats' ? STATS_STYLES.tabActive : STATS_STYLES.tab,
                        onClick: ()=>setActiveTab('stats'),
                        children: "통계"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 531,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: activeTab === 'ai' ? STATS_STYLES.tabActive : STATS_STYLES.tab,
                        onClick: ()=>setActiveTab('ai'),
                        children: "AI"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 537,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                lineNumber: 530,
                columnNumber: 7
            }, this),
            activeTab === 'stats' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: STATS_STYLES.statCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: STATS_STYLES.statTitle,
                                        children: "단어 목표"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 551,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: STATS_STYLES.iconButton,
                                                onClick: ()=>setWordGoal(Math.max(500, displayStats.wordGoal - 500)),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 553,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs mx-1",
                                                children: displayStats.wordGoal.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 559,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: STATS_STYLES.iconButton,
                                                onClick: ()=>setWordGoal(displayStats.wordGoal + 500),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                    lineNumber: 564,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 560,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 550,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300",
                                    style: {
                                        width: `${Math.min(100, displayStats.progress)}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 570,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 569,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between text-xs text-slate-500 dark:text-slate-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            displayStats.wordCount.toLocaleString(),
                                            " 단어"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 577,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            displayStats.progress,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 578,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 576,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 549,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3 mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: STATS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: STATS_STYLES.statTitle,
                                        children: "단어 수"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 585,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STATS_STYLES.statValue,
                                        children: displayStats.wordCount.toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 586,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                        children: [
                                            displayStats.wordCount > lastWordCount ? '↗' : displayStats.wordCount < lastWordCount ? '↘' : '→',
                                            "실시간"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 587,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 584,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: STATS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: STATS_STYLES.statTitle,
                                        children: "문자 수"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 594,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STATS_STYLES.statValue,
                                        children: displayStats.charCount.toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 595,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                        children: "공백 포함"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 596,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 593,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: STATS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: STATS_STYLES.statTitle,
                                        children: "단락 수"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 600,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STATS_STYLES.statValue,
                                        children: displayStats.paragraphCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 601,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                        children: "구조 분석"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 602,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 599,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: STATS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: STATS_STYLES.statTitle,
                                        children: "읽기 시간"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 606,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STATS_STYLES.statValue,
                                        children: [
                                            displayStats.readingTime,
                                            "분"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 607,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                        children: "200 WPM 기준"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 608,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 605,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 583,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: STATS_STYLES.statCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: STATS_STYLES.statTitle,
                                children: "현재 세션"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 614,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: STATS_STYLES.statValue,
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(displayStats.sessionTime)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 617,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: STATS_STYLES.statSubtext,
                                                children: "글쓰기 시간"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 618,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 616,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: STATS_STYLES.statValue,
                                                children: displayStats.wpm > 0 ? displayStats.wpm : 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 621,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: STATS_STYLES.statSubtext,
                                                children: "WPM"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 624,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 620,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 615,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "타이핑 속도"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 630,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: displayStats.wpm < 30 ? '천천히' : displayStats.wpm < 60 ? '보통' : displayStats.wpm < 90 ? '빠름' : '매우 빠름'
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 631,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 629,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `h-1 rounded-full transition-all duration-300 ${displayStats.wpm < 30 ? 'bg-red-400' : displayStats.wpm < 60 ? 'bg-yellow-400' : displayStats.wpm < 90 ? 'bg-green-400' : 'bg-blue-400'}`,
                                            style: {
                                                width: `${Math.min(100, displayStats.wpm / 120 * 100)}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                            lineNumber: 638,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 637,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 628,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 613,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 653,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                                children: "창작 파트너"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 654,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 652,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-slate-500 dark:text-slate-400",
                                        children: "✨ 함께 써봐요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 656,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 651,
                                columnNumber: 13
                            }, this),
                            Object.keys(aiResults).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-2xl mr-3",
                                            children: "🌟"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                            lineNumber: 663,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium text-slate-700 dark:text-slate-300 mb-2",
                                                    children: "오늘도 멋진 이야기를 써보시네요!"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                    lineNumber: 665,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed",
                                                    children: "무엇을 도와드릴까요? 새로운 아이디어가 필요하거나, 막힌 부분을 뚫고 싶으시면 언제든 말씀해주세요."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                    lineNumber: 668,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                            lineNumber: 664,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 662,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 661,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        className: "w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                                        onClick: handleAIImproveText,
                                        disabled: aiLoading === 'improve' || !currentText,
                                        children: [
                                            aiLoading === 'improve' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 mr-2 animate-spin text-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 685,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                className: "w-4 h-4 mr-2 text-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 687,
                                                columnNumber: 19
                                            }, this),
                                            "✨ 문장을 더 매력적으로 만들어봐요"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 677,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        className: "w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800",
                                        onClick: handleAICharacterAnalysis,
                                        disabled: aiLoading === 'character' || !projectId,
                                        children: [
                                            aiLoading === 'character' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 mr-2 animate-spin text-purple-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 700,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                className: "w-4 h-4 mr-2 text-purple-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 702,
                                                columnNumber: 19
                                            }, this),
                                            "👥 캐릭터들이 잘 살아있는지 볼까요?"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 692,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        className: "w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800",
                                        onClick: handleAIPlotCheck,
                                        disabled: aiLoading === 'plot' || !currentText,
                                        children: [
                                            aiLoading === 'plot' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 mr-2 animate-spin text-green-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 715,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                                className: "w-4 h-4 mr-2 text-green-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 717,
                                                columnNumber: 19
                                            }, this),
                                            "🗺️ 이야기 흐름을 함께 점검해볼까요?"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 707,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        className: "w-full justify-start hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-800",
                                        onClick: handleAIDialogueImprovement,
                                        disabled: aiLoading === 'dialogue' || !currentText,
                                        children: [
                                            aiLoading === 'dialogue' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 mr-2 animate-spin text-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 730,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                className: "w-4 h-4 mr-2 text-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 732,
                                                columnNumber: 19
                                            }, this),
                                            "💬 대화가 자연스럽게 들리나요?"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 722,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 676,
                                columnNumber: 13
                            }, this),
                            Object.keys(aiResults).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                                        children: "창작 조언"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                        lineNumber: 743,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-1 h-1 bg-slate-400 rounded-full mx-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                        lineNumber: 744,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-slate-500",
                                                        children: "함께 만든 결과"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                        lineNumber: 745,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 742,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setAiResults({}),
                                                className: "text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
                                                children: "모두 지우기"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 747,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 741,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 max-h-48 overflow-y-auto",
                                        children: Object.entries(aiResults).map(([key, result])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `border p-4 rounded-lg transition-all duration-200 ${key === 'improve' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : key === 'character' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : key === 'plot' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : key === 'dialogue' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center",
                                                                children: [
                                                                    key === 'improve' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                        className: "w-4 h-4 mr-2 text-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                        lineNumber: 764,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    key === 'character' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                        className: "w-4 h-4 mr-2 text-purple-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                        lineNumber: 765,
                                                                        columnNumber: 51
                                                                    }, this),
                                                                    key === 'plot' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                                                        className: "w-4 h-4 mr-2 text-green-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                        lineNumber: 766,
                                                                        columnNumber: 46
                                                                    }, this),
                                                                    key === 'dialogue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                                        className: "w-4 h-4 mr-2 text-orange-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                        lineNumber: 767,
                                                                        columnNumber: 50
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                                                        children: key === 'improve' ? '✨ 문장 개선 조언' : key === 'character' ? '👥 캐릭터 분석' : key === 'plot' ? '🗺️ 플롯 점검' : key === 'dialogue' ? '💬 대화 개선' : key
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                        lineNumber: 768,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                lineNumber: 763,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setAiResults((prev)=>{
                                                                        const newResults = {
                                                                            ...prev
                                                                        };
                                                                        delete newResults[key];
                                                                        return newResults;
                                                                    }),
                                                                className: "text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
                                                                children: "✕"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                lineNumber: 775,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                        lineNumber: 762,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap break-words max-h-80 overflow-y-auto",
                                                        children: result
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                        lineNumber: 786,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 pt-2 border-t border-slate-200 dark:border-slate-600",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-slate-500 dark:text-slate-400",
                                                            children: [
                                                                "💡 ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "italic",
                                                                    children: "이 조언이 도움이 되셨나요? 더 구체적인 도움이 필요하시면 언제든 말씀해주세요!"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                                    lineNumber: 791,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                            lineNumber: 790,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                        lineNumber: 789,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 756,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 754,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 740,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 650,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                lineNumber: 547,
                columnNumber: 9
            }, this),
            activeTab === 'ai' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${STATS_STYLES.chatContainer} h-full`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: STATS_STYLES.chatMessages,
                        children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-6 px-3 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mx-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "mx-auto w-8 h-8 mb-2 text-blue-500 opacity-90"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 809,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium",
                                    children: "AI 창작 파트너에게 질문하세요"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 810,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs mt-2 leading-relaxed",
                                    children: [
                                        "작품 구조, 캐릭터, 대화, 문체 등에 대한 도움을 받을 수 있습니다.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                            lineNumber: 812,
                                            columnNumber: 58
                                        }, this),
                                        "예시: “판타지 소설의 마법 체계를 만들어줘”",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                            lineNumber: 813,
                                            columnNumber: 56
                                        }, this),
                                        "또는 “이 캐릭터를 더 흥미롭게 만드는 방법은?”"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 811,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                            lineNumber: 808,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                messages.map((message, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${STATS_STYLES.chatMessage} ${message.role === 'user' ? STATS_STYLES.userMessage : STATS_STYLES.aiMessage}`,
                                        children: [
                                            message.role === 'ai' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: message.content.replace(/^# (.*)/gm, '**$1**') // # 헤더를 볼드로
                                                .replace(/^## (.*)/gm, '**$1**') // ## 헤더를 볼드로 
                                                .replace(/^### (.*)/gm, '**$1**') // ### 헤더를 볼드로
                                            }, void 0, false),
                                            message.role === 'user' && message.content
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 819,
                                        columnNumber: 19
                                    }, this)),
                                isAiTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${STATS_STYLES.chatMessage} ${STATS_STYLES.aiMessage}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: STATS_STYLES.loadingDots,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${STATS_STYLES.loadingDot} animate-pulse`
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 840,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${STATS_STYLES.loadingDot} animate-pulse delay-150`
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 841,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `${STATS_STYLES.loadingDot} animate-pulse delay-300`
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                                lineNumber: 842,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                        lineNumber: 839,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 838,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: chatEndRef
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 846,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 806,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: STATS_STYLES.chatInputContainer,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: userInput,
                                onChange: (e)=>setUserInput(e.target.value),
                                onKeyDown: (e)=>e.key === 'Enter' && !e.shiftKey && handleChatSubmit(),
                                placeholder: "메시지 보내기...",
                                className: STATS_STYLES.chatInput,
                                disabled: isAiTyping
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 852,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: STATS_STYLES.chatSendButton,
                                onClick: ()=>handleChatSubmit(),
                                disabled: isAiTyping || !userInput.trim(),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                    lineNumber: 866,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                                lineNumber: 861,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                        lineNumber: 851,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
                lineNumber: 805,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx",
        lineNumber: 519,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_renderer_components_projects_editor_121441a5._.js.map