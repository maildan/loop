module.exports = {

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
"[project]/src/renderer/components/projects/editor/EditorShortcuts.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 노션 스타일 단축키 시스템
__turbopack_context__.s({
    "ALL_SHORTCUTS": (()=>ALL_SHORTCUTS),
    "HEADING_SHORTCUTS": (()=>HEADING_SHORTCUTS),
    "LIST_SHORTCUTS": (()=>LIST_SHORTCUTS),
    "SAVE_SHORTCUTS": (()=>SAVE_SHORTCUTS),
    "TEXT_FORMATTING_SHORTCUTS": (()=>TEXT_FORMATTING_SHORTCUTS),
    "bindShortcutsToEditor": (()=>bindShortcutsToEditor),
    "getShortcutHelp": (()=>getShortcutHelp),
    "handleEditorKeyDown": (()=>handleEditorKeyDown)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
'use client';
;
// 🔥 플랫폼별 modifier 키 감지
const isMac = "undefined" !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const modifierKey = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : 'ctrlKey';
const TEXT_FORMATTING_SHORTCUTS = [
    {
        key: 'b',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleBold().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Bold toggled');
            return true;
        },
        description: '볼드 토글'
    },
    {
        key: 'i',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleItalic().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Italic toggled');
            return true;
        },
        description: '이탤릭 토글'
    },
    {
        key: 'u',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleUnderline().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Underline toggled');
            return true;
        },
        description: '언더라인 토글'
    },
    {
        key: 's',
        modifier: true,
        shift: true,
        action: (editor)=>{
            editor.chain().focus().toggleStrike().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Strikethrough toggled');
            return true;
        },
        description: '취소선 토글'
    },
    {
        key: 'k',
        modifier: true,
        action: (editor)=>{
            // 🔥 링크 생성 (추후 구현)
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Link shortcut triggered');
            return true;
        },
        description: '링크 생성'
    }
];
const HEADING_SHORTCUTS = [
    {
        key: '1',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().toggleHeading({
                level: 1
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H1 toggled');
            return true;
        },
        description: '제목 1'
    },
    {
        key: '2',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().toggleHeading({
                level: 2
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H2 toggled');
            return true;
        },
        description: '제목 2'
    },
    {
        key: '3',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().toggleHeading({
                level: 3
            }).run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H3 toggled');
            return true;
        },
        description: '제목 3'
    },
    {
        key: '0',
        modifier: true,
        alt: true,
        action: (editor)=>{
            editor.chain().focus().setParagraph().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Paragraph set');
            return true;
        },
        description: '일반 텍스트'
    }
];
const LIST_SHORTCUTS = [
    {
        key: '8',
        modifier: true,
        shift: true,
        action: (editor)=>{
            editor.chain().focus().toggleBulletList().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Bullet list toggled');
            return true;
        },
        description: '불릿 리스트'
    },
    {
        key: '7',
        modifier: true,
        shift: true,
        action: (editor)=>{
            editor.chain().focus().toggleOrderedList().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Ordered list toggled');
            return true;
        },
        description: '번호 리스트'
    }
];
const SAVE_SHORTCUTS = [
    {
        key: 's',
        modifier: true,
        action: (editor)=>{
            // 🔥 저장 이벤트 발생 (커스텀 이벤트)
            const saveEvent = new CustomEvent('editor:save');
            window.dispatchEvent(saveEvent);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR_SHORTCUTS', 'Save triggered');
            return true;
        },
        description: '저장'
    }
];
const ALL_SHORTCUTS = [
    ...TEXT_FORMATTING_SHORTCUTS,
    ...HEADING_SHORTCUTS,
    ...LIST_SHORTCUTS,
    ...SAVE_SHORTCUTS
];
function handleEditorKeyDown(editor, event) {
    if (!editor) return false;
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const isModifier = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : ctrlKey;
    // 🔥 Space 키는 마크다운 처리를 위해 완전 제외
    if (key === ' ') {
        return false;
    }
    // 🔥 마크다운 타이핑 방해 방지: modifier 키가 없는 단일 문자는 처리하지 않음
    if (!isModifier && !shiftKey && !altKey && key.length === 1) {
        return false;
    }
    // 🔥 단축키 매칭 및 실행
    for (const shortcut of ALL_SHORTCUTS){
        if (shortcut.key.toLowerCase() === key.toLowerCase() && Boolean(shortcut.modifier) === isModifier && Boolean(shortcut.shift) === shiftKey && Boolean(shortcut.alt) === altKey) {
            event.preventDefault();
            event.stopPropagation();
            try {
                const handled = shortcut.action(editor);
                if (handled) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', `Shortcut executed: ${shortcut.description}`, {
                        key: shortcut.key,
                        modifier: isModifier,
                        shift: shiftKey,
                        alt: altKey
                    });
                    return true;
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('EDITOR_SHORTCUTS', `Shortcut execution failed: ${shortcut.description}`, error);
            }
        }
    }
    return false;
}
function getShortcutHelp() {
    const isMacPlatform = isMac;
    const mod = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : 'Ctrl';
    const alt = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : 'Alt';
    return `
📝 **텍스트 포맷팅**
• ${mod}+B: 볼드
• ${mod}+I: 이탤릭  
• ${mod}+U: 언더라인
• ${mod}+Shift+S: 취소선
• ${mod}+K: 링크

📄 **헤딩**
• ${mod}+${alt}+1: 제목 1
• ${mod}+${alt}+2: 제목 2
• ${mod}+${alt}+3: 제목 3
• ${mod}+${alt}+0: 일반 텍스트

📋 **리스트**
• ${mod}+Shift+8: 불릿 리스트
• ${mod}+Shift+7: 번호 리스트

💾 **저장**
• ${mod}+S: 저장
`.trim();
}
function bindShortcutsToEditor(editor) {
    if (!editor) return ()=>{};
    // 🔥 전역 리스너 등록하지 않음 - TipTap 내부 handleKeyDown만 사용
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR_SHORTCUTS', 'Shortcuts system initialized', {
        shortcutCount: ALL_SHORTCUTS.length,
        platform: ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : 'Windows/Linux'
    });
    // 🔥 정리 함수 반환 (실제로는 아무것도 안 함)
    return ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Shortcuts system cleaned up');
    };
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorShortcuts.ts [app-ssr] (ecmascript)");
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
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getShortcutHelp"])().split('\n').map((line, idx)=>{
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
"[project]/src/renderer/components/projects/editor/SlashCommands.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SlashCommand": (()=>SlashCommand),
    "slashSuggestion": (()=>slashSuggestion)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/core/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$suggestion$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/suggestion/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tippy$2e$js$2f$dist$2f$tippy$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tippy.js/dist/tippy.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.js [app-ssr] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-ssr] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-ssr] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-ssr] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-ssr] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-ssr] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [app-ssr] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading1$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heading-1.js [app-ssr] (ecmascript) <export default as Heading1>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heading-2.js [app-ssr] (ecmascript) <export default as Heading2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heading-3.js [app-ssr] (ecmascript) <export default as Heading3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$highlighter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Highlighter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/highlighter.js [app-ssr] (ecmascript) <export default as Highlighter>");
'use client';
;
;
;
;
;
;
;
// 🔥 명령어 목록 정의 (Notion 스타일)
const SLASH_COMMANDS = [
    {
        title: '제목 1',
        description: '큰 섹션 헤딩',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$1$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading1$3e$__["Heading1"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHeading({
                level: 1
            }).run();
        }
    },
    {
        title: '제목 2',
        description: '중간 섹션 헤딩',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading2$3e$__["Heading2"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHeading({
                level: 2
            }).run();
        }
    },
    {
        title: '제목 3',
        description: '작은 섹션 헤딩',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading3$3e$__["Heading3"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHeading({
                level: 3
            }).run();
        }
    },
    {
        title: '본문',
        description: '일반 텍스트로 시작',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setParagraph().run();
        }
    },
    {
        title: '불릿 리스트',
        description: '간단한 불릿 목록',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        }
    },
    {
        title: '번호 리스트',
        description: '번호가 매겨진 목록',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        }
    },
    {
        title: '체크리스트',
        description: '할 일 목록',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleList('taskList', 'taskItem').run();
        }
    },
    {
        title: '콜아웃 - 정보',
        description: '💡 정보 강조',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent({
                type: 'callout',
                attrs: {
                    type: 'info',
                    icon: '💡'
                },
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '정보를 입력하세요...'
                            }
                        ]
                    }
                ]
            }).run();
        }
    },
    {
        title: '콜아웃 - 경고',
        description: '⚠️ 경고 메시지',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent({
                type: 'callout',
                attrs: {
                    type: 'warning',
                    icon: '⚠️'
                },
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '경고 내용을 입력하세요...'
                            }
                        ]
                    }
                ]
            }).run();
        }
    },
    {
        title: '콜아웃 - 에러',
        description: '❌ 에러 메시지',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent({
                type: 'callout',
                attrs: {
                    type: 'error',
                    icon: '❌'
                },
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '에러 내용을 입력하세요...'
                            }
                        ]
                    }
                ]
            }).run();
        }
    },
    {
        title: '토글',
        description: '▼ 접을 수 있는 섹션',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent({
                type: 'toggle',
                attrs: {
                    open: false,
                    summary: '토글 제목'
                },
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: '토글 내용을 입력하세요...'
                            }
                        ]
                    }
                ]
            }).run();
        }
    },
    {
        title: '하이라이트',
        description: '🖍️ 텍스트 강조',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$highlighter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Highlighter$3e$__["Highlighter"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent('하이라이트할 텍스트').setMark('highlight', {
                color: 'yellow'
            }).run();
        }
    },
    {
        title: '인용구',
        description: '인용 텍스트',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        }
    },
    {
        title: '코드 블록',
        description: '코드 스니펫',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        }
    },
    {
        title: '구분선',
        description: '섹션 구분선',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        }
    }
];
const CommandMenu = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ items, command }, ref)=>{
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, ()=>({
            onKeyDown: ({ event })=>{
                if (event.key === 'ArrowUp') {
                    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
                    return true;
                }
                if (event.key === 'ArrowDown') {
                    setSelectedIndex((selectedIndex + 1) % items.length);
                    return true;
                }
                if (event.key === 'Enter') {
                    selectItem(selectedIndex);
                    return true;
                }
                return false;
            }
        }));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setSelectedIndex(0), [
        items
    ]);
    const selectItem = (index)=>{
        const item = items[index];
        if (item) {
            command(item);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "z-50 w-72 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-auto",
        children: items.length ? items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `flex items-center gap-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'}`,
                onClick: ()=>selectItem(index),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-4 flex items-center justify-center text-gray-500 dark:text-gray-400",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
                            lineNumber: 274,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
                        lineNumber: 273,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium",
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500 dark:text-gray-400",
                                children: item.description
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
                                lineNumber: 278,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
                        lineNumber: 276,
                        columnNumber: 13
                    }, this)
                ]
            }, index, true, {
                fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
                lineNumber: 265,
                columnNumber: 11
            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-3 py-2 text-sm text-gray-500 dark:text-gray-400",
            children: "검색 결과가 없습니다"
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
            lineNumber: 283,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/editor/SlashCommands.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
});
CommandMenu.displayName = 'CommandMenu';
const SlashCommand = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Extension"].create({
    name: 'slashCommand',
    addOptions () {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props })=>{
                    props.command({
                        editor,
                        range
                    });
                }
            }
        };
    },
    addProseMirrorPlugins () {
        return [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$suggestion$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                editor: this.editor,
                ...this.options.suggestion
            })
        ];
    }
});
const slashSuggestion = {
    items: ({ query })=>{
        return SLASH_COMMANDS.filter((item)=>item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()));
    },
    render: ()=>{
        let component;
        let popup = [];
        return {
            onStart: (props)=>{
                component = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactRenderer"](CommandMenu, {
                    props,
                    editor: props.editor
                });
                if (!props.clientRect) {
                    return;
                }
                popup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tippy$2e$js$2f$dist$2f$tippy$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: ()=>document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start'
                });
            },
            onUpdate (props) {
                component.updateProps(props);
                if (!props.clientRect) {
                    return;
                }
                const instance = Array.isArray(popup) ? popup[0] : undefined;
                if (instance) {
                    instance.setProps({
                        getReferenceClientRect: props.clientRect
                    });
                }
            },
            onKeyDown (props) {
                if (props.event.key === 'Escape') {
                    const instance = Array.isArray(popup) ? popup[0] : undefined;
                    if (instance) instance.hide();
                    return true;
                }
                return component.ref?.onKeyDown({
                    event: props.event
                });
            },
            onExit () {
                const instance = Array.isArray(popup) ? popup[0] : undefined;
                if (instance) instance.destroy();
                component.destroy();
            }
        };
    }
};
}}),
"[project]/src/renderer/components/projects/editor/AdvancedNotionFeatures.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 TipTap 에디터에 추가할 노션 기능들 (기본 기능만)
// src/renderer/components/projects/editor/AdvancedNotionFeatures.ts
__turbopack_context__.s({
    "Callout": (()=>Callout),
    "Highlight": (()=>Highlight),
    "TaskItem": (()=>TaskItem),
    "TaskList": (()=>TaskList),
    "Toggle": (()=>Toggle),
    "extendedKeyboardShortcuts": (()=>extendedKeyboardShortcuts),
    "extendedSlashCommands": (()=>extendedSlashCommands)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/core/dist/index.js [app-ssr] (ecmascript)");
;
const TaskList = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Node"].create({
    name: 'taskList',
    group: 'block list',
    content: 'taskItem+',
    parseHTML () {
        return [
            {
                tag: 'ul[data-type="taskList"]'
            }
        ];
    },
    renderHTML ({ HTMLAttributes }) {
        return [
            'ul',
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeAttributes"])(HTMLAttributes, {
                'data-type': 'taskList',
                class: 'task-list'
            }),
            0
        ];
    }
});
const TaskItem = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Node"].create({
    name: 'taskItem',
    content: 'paragraph block*',
    defining: true,
    addAttributes () {
        return {
            checked: {
                default: false,
                parseHTML: (element)=>element.getAttribute('data-checked') === 'true',
                renderHTML: (attributes)=>({
                        'data-checked': attributes.checked
                    })
            }
        };
    },
    parseHTML () {
        return [
            {
                tag: 'li[data-type="taskItem"]'
            }
        ];
    },
    renderHTML ({ node, HTMLAttributes }) {
        return [
            'li',
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeAttributes"])(HTMLAttributes, {
                'data-type': 'taskItem',
                'data-checked': node.attrs.checked,
                class: 'task-item'
            }),
            [
                'label',
                {
                    class: 'task-checkbox-wrapper'
                },
                [
                    'input',
                    {
                        type: 'checkbox',
                        checked: node.attrs.checked ? 'checked' : null,
                        class: 'task-checkbox'
                    }
                ],
                [
                    'span',
                    {
                        class: 'task-content'
                    },
                    0
                ]
            ]
        ];
    }
});
const Callout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Node"].create({
    name: 'callout',
    group: 'block',
    content: 'block+',
    addAttributes () {
        return {
            type: {
                default: 'info',
                renderHTML: (attributes)=>({
                        'data-type': attributes.type
                    })
            },
            icon: {
                default: '💡',
                renderHTML: (attributes)=>({
                        'data-icon': attributes.icon
                    })
            }
        };
    },
    parseHTML () {
        return [
            {
                tag: 'div[data-callout]'
            }
        ];
    },
    renderHTML ({ HTMLAttributes }) {
        return [
            'div',
            {
                'data-callout': true,
                ...HTMLAttributes
            },
            0
        ];
    }
});
const Toggle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Node"].create({
    name: 'toggle',
    group: 'block',
    content: 'block+',
    addAttributes () {
        return {
            open: {
                default: false,
                renderHTML: (attributes)=>({
                        'data-open': attributes.open
                    })
            },
            summary: {
                default: '토글 제목',
                renderHTML: (attributes)=>({
                        'data-summary': attributes.summary
                    })
            }
        };
    },
    parseHTML () {
        return [
            {
                tag: 'details[data-toggle]'
            }
        ];
    },
    renderHTML ({ HTMLAttributes }) {
        return [
            'details',
            {
                'data-toggle': true,
                ...HTMLAttributes
            },
            [
                'summary',
                {},
                HTMLAttributes['data-summary'] || '토글 제목'
            ],
            [
                'div',
                {
                    class: 'toggle-content'
                },
                0
            ]
        ];
    }
});
const Highlight = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mark"].create({
    name: 'highlight',
    addAttributes () {
        return {
            color: {
                default: 'yellow',
                parseHTML: (element)=>element.getAttribute('data-color'),
                renderHTML: (attributes)=>{
                    if (!attributes.color) {
                        return {};
                    }
                    return {
                        'data-color': attributes.color
                    };
                }
            }
        };
    },
    parseHTML () {
        return [
            {
                tag: 'mark[data-highlight]'
            }
        ];
    },
    renderHTML ({ HTMLAttributes }) {
        return [
            'mark',
            {
                'data-highlight': true,
                ...HTMLAttributes
            },
            0
        ];
    }
});
const extendedSlashCommands = [
    {
        title: '체크박스',
        description: '☑️ 할 일 목록',
        icon: '☑️',
        searchTerms: [
            'checkbox',
            'todo',
            'task',
            '체크',
            '할일'
        ],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleList('taskList', 'taskItem').run();
        }
    },
    {
        title: '콜아웃 - 정보',
        description: '💡 정보 강조',
        icon: '💡',
        searchTerms: [
            'callout',
            'info',
            '콜아웃',
            '정보'
        ],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setCallout({
                type: 'info',
                icon: '💡'
            }).run();
        }
    },
    {
        title: '콜아웃 - 경고',
        description: '⚠️ 경고 메시지',
        icon: '⚠️',
        searchTerms: [
            'warning',
            'caution',
            '경고',
            '주의'
        ],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setCallout({
                type: 'warning',
                icon: '⚠️'
            }).run();
        }
    },
    {
        title: '콜아웃 - 에러',
        description: '❌ 에러 메시지',
        icon: '❌',
        searchTerms: [
            'error',
            'danger',
            '에러',
            '오류'
        ],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setCallout({
                type: 'error',
                icon: '❌'
            }).run();
        }
    },
    {
        title: '토글',
        description: '▼ 접을 수 있는 섹션',
        icon: '▼',
        searchTerms: [
            'toggle',
            'collapse',
            '토글',
            '접기'
        ],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setToggle({
                summary: '토글 제목',
                open: false
            }).run();
        }
    },
    {
        title: '하이라이트',
        description: '🖍️ 텍스트 강조',
        icon: '🖍️',
        searchTerms: [
            'highlight',
            'mark',
            '하이라이트',
            '강조'
        ],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent('하이라이트 텍스트').selectTextblockEnd().setHighlight({
                color: 'yellow'
            }).run();
        }
    },
    {
        title: '수식',
        description: '🔢 LaTeX 수식',
        icon: '🔢',
        searchTerms: [
            'math',
            'latex',
            'formula',
            '수식',
            '공식'
        ],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent('$E = mc^2$').run();
        }
    }
];
const extendedKeyboardShortcuts = [
    {
        key: 'Mod-Shift-1',
        description: '제목 1',
        command: ({ editor })=>editor.chain().focus().toggleHeading({
                level: 1
            }).run()
    },
    {
        key: 'Mod-Shift-2',
        description: '제목 2',
        command: ({ editor })=>editor.chain().focus().toggleHeading({
                level: 2
            }).run()
    },
    {
        key: 'Mod-Shift-3',
        description: '제목 3',
        command: ({ editor })=>editor.chain().focus().toggleHeading({
                level: 3
            }).run()
    },
    {
        key: 'Mod-Shift-7',
        description: '번호 리스트',
        command: ({ editor })=>editor.chain().focus().toggleOrderedList().run()
    },
    {
        key: 'Mod-Shift-8',
        description: '불릿 리스트',
        command: ({ editor })=>editor.chain().focus().toggleBulletList().run()
    },
    {
        key: 'Mod-Shift-9',
        description: '체크박스',
        command: ({ editor })=>editor.chain().focus().toggleList('taskList', 'taskItem').run()
    },
    {
        key: 'Mod-Shift-.',
        description: '인용구',
        command: ({ editor })=>editor.chain().focus().toggleBlockquote().run()
    },
    {
        key: 'Mod-Alt-C',
        description: '코드 블록',
        command: ({ editor })=>editor.chain().focus().toggleCodeBlock().run()
    },
    {
        key: 'Mod-Shift-H',
        description: '하이라이트',
        command: ({ editor })=>editor.chain().focus().toggleHighlight().run()
    }
];
}}),
"[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "MarkdownEditor": (()=>MarkdownEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/starter-kit/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-placeholder/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-focus/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-typography/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-character-count/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-underline/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-image/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$SlashCommands$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/SlashCommands.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bold.js [app-ssr] (ecmascript) <export default as Bold>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/italic.js [app-ssr] (ecmascript) <export default as Italic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/underline.js [app-ssr] (ecmascript) <export default as Underline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/strikethrough.js [app-ssr] (ecmascript) <export default as Strikethrough>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-ssr] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-ssr] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-ssr] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard.js [app-ssr] (ecmascript) <export default as Clipboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorShortcuts.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/AdvancedNotionFeatures.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// 🔥 작가 친화적 TipTap 에디터 스타일
const EDITOR_STYLES = {
    container: 'w-full h-full flex flex-col',
    editor: 'flex-1 p-6 prose max-w-none focus:outline-none text-gray-900 dark:text-gray-100',
    focused: 'prose-lg',
    placeholder: 'text-slate-400 pointer-events-none',
    bubble: 'flex flex-nowrap gap-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-visible whitespace-nowrap',
    bubbleButton: 'px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors flex items-center justify-center min-w-[30px]'
};
function MarkdownEditor({ content, onChange, isFocusMode }) {
    const [isReady, setIsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 드래그 오버 상태 추가
    // 🔥 드래그 앤 드롭 피드백을 위한 이벤트 리스너
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleDragOver = (e)=>{
            e.preventDefault();
            setIsDragOver(true);
        };
        const handleDragLeave = (e)=>{
            e.preventDefault();
            // 에디터 영역을 완전히 벗어날 때만 상태 변경
            if (!e.relatedTarget || !e.relatedTarget.closest('.ProseMirror')) {
                setIsDragOver(false);
            }
        };
        const handleDrop = (e)=>{
            e.preventDefault();
            setIsDragOver(false);
        };
        // 전역 이벤트 리스너 등록
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('drop', handleDrop);
        return ()=>{
            document.removeEventListener('dragover', handleDragOver);
            document.removeEventListener('dragleave', handleDragLeave);
            document.removeEventListener('drop', handleDrop);
        };
    }, []);
    // 🔥 복사 기능을 위한 키보드 이벤트 리스너
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleCopy = (e)=>{
            const isCtrlC = (e.ctrlKey || e.metaKey) && e.key === 'c';
            const isCtrlA = (e.ctrlKey || e.metaKey) && e.key === 'a';
            if (isCtrlC || isCtrlA) {
                // 기본 복사 동작 허용 (TipTap이 자동으로 처리)
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_EDITOR', 'Copy operation allowed', {
                    type: isCtrlC ? 'Ctrl+C' : 'Ctrl+A'
                });
            }
        };
        document.addEventListener('keydown', handleCopy);
        return ()=>document.removeEventListener('keydown', handleCopy);
    }, []);
    // 🔥 TipTap 에디터 초기화 (Notion 스타일 + 작가 친화적 설정)
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"])({
        extensions: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                // 🔥 작가 친화적 설정
                heading: {
                    levels: [
                        1,
                        2,
                        3,
                        4
                    ] // H1~H4만 사용
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc list-outside ml-6'
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal list-outside ml-6'
                    }
                }
            }),
            // 🔥 언더라인 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
            // 🔥 이미지 확장 (드래그앤드롭, 클립보드 붙여넣기 지원)
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                HTMLAttributes: {
                    class: 'rounded-lg shadow-md max-w-full h-auto my-4'
                },
                inline: false,
                allowBase64: true
            }),
            // 🔥 Placeholder 확장 (작가 친화적)
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                placeholder: ({ node })=>{
                    if (node.type.name === 'heading') {
                        const level = node.attrs.level;
                        switch(level){
                            case 1:
                                return '제목을 입력하세요...';
                            case 2:
                                return '챕터 제목...';
                            case 3:
                                return '섹션 제목...';
                            default:
                                return '소제목...';
                        }
                    }
                    if (node.type.name === 'callout') {
                        return '콜아웃 내용을 입력하세요...';
                    }
                    if (node.type.name === 'toggle') {
                        return '토글 내용을 입력하세요...';
                    }
                    return '/ 를 입력하여 명령어를 사용하거나 이야기를 시작해보세요...';
                },
                showOnlyWhenEditable: true,
                showOnlyCurrent: false
            }),
            // 🔥 Focus 확장 (포커스 모드)
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                className: 'has-focus',
                mode: 'all'
            }),
            // 🔥 Typography 확장 (작가 친화적 타이포그래피)
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                openDoubleQuote: '"',
                closeDoubleQuote: '"',
                openSingleQuote: "'",
                closeSingleQuote: "'",
                ellipsis: '...',
                emDash: '--'
            }),
            // 🔥 노션 스타일 확장들
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TaskList"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TaskItem"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Callout"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Highlight"],
            // 🔥 슬래시 명령어 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$SlashCommands$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SlashCommand"].configure({
                suggestion: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$SlashCommands$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["slashSuggestion"]
            }),
            // 🔥 문자 수 카운트
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
        ],
        content,
        // 🔥 에디터 설정
        editorProps: {
            attributes: {
                class: `${EDITOR_STYLES.editor} ${isFocusMode ? EDITOR_STYLES.focused : ''}`,
                'data-placeholder': '이야기를 시작해보세요...'
            },
            // 🔥 TipTap 공식 마크다운 처리 방식 (완전히 동기적 실행)
            handleKeyDown: (view, event)=>{
                if (event.key === ' ') {
                    const { state } = view;
                    const { selection } = state;
                    const { $from } = selection;
                    const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
                    // TipTap의 에디터 인스턴스에 직접 접근
                    const editorInstance = view.editor;
                    if (!editorInstance) return false;
                    // # 처리 (제목 1)
                    if (textBefore === '#') {
                        event.preventDefault();
                        event.stopPropagation();
                        // 텍스트 삭제 후 헤딩 적용을 체인으로 연결
                        editorInstance.chain().focus().deleteRange({
                            from: $from.pos - 1,
                            to: $from.pos
                        }).setHeading({
                            level: 1
                        }).run();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: H1 applied');
                        return true;
                    }
                    // ## 처리 (제목 2)
                    if (textBefore === '##') {
                        event.preventDefault();
                        event.stopPropagation();
                        editorInstance.chain().focus().deleteRange({
                            from: $from.pos - 2,
                            to: $from.pos
                        }).setHeading({
                            level: 2
                        }).run();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: H2 applied');
                        return true;
                    }
                    // ### 처리 (제목 3)
                    if (textBefore === '###') {
                        event.preventDefault();
                        event.stopPropagation();
                        editorInstance.chain().focus().deleteRange({
                            from: $from.pos - 3,
                            to: $from.pos
                        }).setHeading({
                            level: 3
                        }).run();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: H3 applied');
                        return true;
                    }
                    // - 처리 (불릿 리스트)
                    if (textBefore === '-') {
                        event.preventDefault();
                        event.stopPropagation();
                        editorInstance.chain().focus().deleteRange({
                            from: $from.pos - 1,
                            to: $from.pos
                        }).toggleBulletList().run();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: Bullet list applied');
                        return true;
                    }
                    // 1. 처리 (번호 리스트)
                    if (/^\d+\.$/.test(textBefore)) {
                        event.preventDefault();
                        event.stopPropagation();
                        editorInstance.chain().focus().deleteRange({
                            from: $from.pos - textBefore.length,
                            to: $from.pos
                        }).toggleOrderedList().run();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', '✅ Markdown: Ordered list applied');
                        return true;
                    }
                }
                return false;
            },
            // 🔥 클립보드 처리 (이미지 붙여넣기 지원)
            handlePaste: (view, event)=>{
                const editorInstance = view.editor;
                if (!editorInstance) return false;
                const clipboardData = event.clipboardData;
                if (!clipboardData) return false;
                // 이미지 파일 처리
                const items = Array.from(clipboardData.items);
                for (const item of items){
                    if (item.type.indexOf('image') === 0) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e)=>{
                                const src = e.target?.result;
                                if (src) {
                                    editorInstance.chain().focus().setImage({
                                        src
                                    }).run();
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Image pasted from clipboard');
                                }
                            };
                            reader.readAsDataURL(file);
                            return true;
                        }
                    }
                }
                // 텍스트 처리 (기본 동작 허용)
                return false;
            },
            // 🔥 드래그 앤 드롭 처리
            handleDrop: (view, event)=>{
                const editorInstance = view.editor;
                if (!editorInstance) return false;
                // 드래그 오버 클래스 제거
                const editorElement = view.dom;
                editorElement.classList.remove('drag-over');
                const files = Array.from(event.dataTransfer?.files || []);
                const imageFiles = files.filter((file)=>file.type.startsWith('image/'));
                if (imageFiles.length > 0) {
                    event.preventDefault();
                    imageFiles.forEach((file)=>{
                        const reader = new FileReader();
                        reader.onload = (e)=>{
                            const src = e.target?.result;
                            if (src) {
                                editorInstance.chain().focus().setImage({
                                    src
                                }).run();
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Image dropped into editor');
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                    return true;
                }
                return false;
            }
        },
        // 🔥 콘텐츠 변경 핸들러
        onUpdate: ({ editor })=>{
            const newContent = editor.getHTML();
            onChange(newContent);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Content updated', {
                wordCount: editor.storage.characterCount?.words() || 0
            });
        },
        // 🔥 에디터 준비 완료
        onCreate: ({ editor })=>{
            setIsReady(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Editor created successfully');
        },
        // 🔥 에디터 포커스
        onFocus: ({ editor })=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor focused');
        },
        // 🔥 에디터 블러
        onBlur: ({ editor })=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor blurred');
        }
    });
    // 🔥 외부 content 변경 시 에디터 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [
        content,
        editor
    ]);
    // 🔥 포커스 모드 변경 시 클래스 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (editor) {
            const editorElement = editor.view.dom;
            editorElement.className = `${EDITOR_STYLES.editor} ${isFocusMode ? EDITOR_STYLES.focused : ''}`;
        }
    }, [
        isFocusMode,
        editor
    ]);
    // 🔥 단축키 바인딩 및 저장 이벤트 리스너
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!editor) return;
        // 🔥 단축키 바인딩
        const unbindShortcuts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bindShortcutsToEditor"])(editor);
        // 🔥 클립보드 단축키 추가
        const handleKeyDown = (event)=>{
            const { key, ctrlKey, metaKey } = event;
            const modKey = ctrlKey || metaKey; // Windows: Ctrl, Mac: Cmd
            // Ctrl/Cmd + C: 복사
            if (modKey && key === 'c' && !event.shiftKey) {
                const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);
                if (selectedText) {
                    navigator.clipboard.writeText(selectedText).then(()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Text copied via keyboard shortcut');
                    }).catch((err)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('TIPTAP_EDITOR', 'Failed to copy text via shortcut', err);
                    });
                }
            }
            // Ctrl/Cmd + V: 붙여넣기
            if (modKey && key === 'v' && !event.shiftKey) {
                navigator.clipboard.readText().then((text)=>{
                    if (text) {
                        editor.chain().focus().insertContent(text).run();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Text pasted via keyboard shortcut');
                    }
                }).catch((err)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('TIPTAP_EDITOR', 'Failed to paste text via shortcut', err);
                });
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        // 🔥 저장 이벤트 리스너 (Ctrl+S)
        const handleSave = ()=>{
            const saveEvent = new CustomEvent('project:save');
            window.dispatchEvent(saveEvent);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Save event triggered from editor');
        };
        window.addEventListener('editor:save', handleSave);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Shortcuts and save event bound', {
            shortcutCount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorShortcuts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ALL_SHORTCUTS"].length
        });
        // 🔥 정리 함수
        return ()=>{
            unbindShortcuts();
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('editor:save', handleSave);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Shortcuts and events unbound');
        };
    }, [
        editor
    ]);
    // 🔥 컴포넌트 언마운트 시 정리 - DOM 에러 방지
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const currentEditor = editor;
        return ()=>{
            if (currentEditor && !currentEditor.isDestroyed) {
                try {
                    // 모든 DOM 조작 중단
                    if (currentEditor.view && currentEditor.view.dom) {
                        currentEditor.view.dom.style.display = 'none';
                    }
                    // 에디터 이벤트 리스너 정리
                    currentEditor.off('transaction');
                    currentEditor.off('update');
                    currentEditor.off('create');
                    currentEditor.off('focus');
                    currentEditor.off('blur');
                    currentEditor.off('selectionUpdate');
                    // 모든 pending 트랜잭션 취소
                    if (currentEditor.view && currentEditor.view.state) {
                        currentEditor.view.updateState(currentEditor.view.state);
                    }
                    // 에디터 소멸
                    setTimeout(()=>{
                        if (!currentEditor.isDestroyed) {
                            currentEditor.destroy();
                        }
                    }, 0);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor destroyed safely');
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('TIPTAP_EDITOR', 'Error during editor cleanup', error);
                }
            }
        };
    }, [
        editor
    ]); // 🔥 ESC 키 핸들러 (집중모드 해제) 및 복사 이벤트 리스너
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleEscKey = (event)=>{
            if (event.key === 'Escape' && isFocusMode) {
                // 집중모드 해제 이벤트 발생
                const exitFocusEvent = new CustomEvent('editor:exitFocus');
                window.dispatchEvent(exitFocusEvent);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'ESC pressed - exiting focus mode');
            }
        };
        // 🔥 QA 가이드: 에디터 내용 복사 이벤트 리스너
        const handleCopyContent = (event)=>{
            if (editor && event.detail && event.detail.callback) {
                const textContent = editor.getText();
                event.detail.callback(textContent);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Content copied via header button', {
                    length: textContent.length
                });
            }
        };
        window.addEventListener('keydown', handleEscKey);
        window.addEventListener('project:copyContent', handleCopyContent);
        return ()=>{
            window.removeEventListener('keydown', handleEscKey);
            window.removeEventListener('project:copyContent', handleCopyContent);
        };
    }, [
        isFocusMode,
        editor
    ]);
    // 🔥 에디터 드래그 앤 드롭 시각적 피드백
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!editor) return;
        const editorElement = editor.view.dom;
        const handleDragEnter = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            editorElement.classList.add('drag-over');
            setIsDragOver(true);
        };
        const handleDragOver = (e)=>{
            e.preventDefault();
            e.stopPropagation();
        };
        const handleDragLeave = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            // 에디터 영역을 완전히 벗어날 때만 상태 변경
            if (!editorElement.contains(e.relatedTarget)) {
                editorElement.classList.remove('drag-over');
                setIsDragOver(false);
            }
        };
        const handleDrop = (e)=>{
            e.preventDefault();
            e.stopPropagation();
            editorElement.classList.remove('drag-over');
            setIsDragOver(false);
        };
        // 에디터 전용 드래그 이벤트 리스너
        editorElement.addEventListener('dragenter', handleDragEnter);
        editorElement.addEventListener('dragover', handleDragOver);
        editorElement.addEventListener('dragleave', handleDragLeave);
        editorElement.addEventListener('drop', handleDrop);
        return ()=>{
            editorElement.removeEventListener('dragenter', handleDragEnter);
            editorElement.removeEventListener('dragover', handleDragOver);
            editorElement.removeEventListener('dragleave', handleDragLeave);
            editorElement.removeEventListener('drop', handleDrop);
        };
    }, [
        editor
    ]);
    // 🔥 로딩 중 표시
    if (!isReady) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: EDITOR_STYLES.container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 577,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-slate-500 text-sm",
                            children: "에디터 준비 중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 578,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                    lineNumber: 576,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                lineNumber: 575,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
            lineNumber: 574,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${EDITOR_STYLES.container} ${isDragOver ? 'drag-over' : ''}`,
        children: [
            isDragOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center z-10 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-blue-600 dark:text-blue-400 text-lg font-medium",
                    children: "📁 파일을 여기에 놓으세요"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                    lineNumber: 590,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                lineNumber: 589,
                columnNumber: 9
            }, this),
            editor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BubbleMenu"], {
                editor: editor,
                className: EDITOR_STYLES.bubble,
                shouldShow: ({ editor, view, state, oldState, from, to })=>{
                    // 텍스트가 선택되었을 때만 표시
                    return from !== to;
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleBold().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('bold') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "볼드 (Ctrl+B)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 614,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 608,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleItalic().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('italic') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "이탤릭 (Ctrl+I)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 623,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 617,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleUnderline().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('underline') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "언더라인 (Ctrl+U)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 632,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 626,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleStrike().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('strike') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "취소선 (Ctrl+Shift+S)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__["Strikethrough"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 641,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 635,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 645,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleCode().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('code') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "인라인 코드 (Ctrl+`)",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 654,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 648,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 658,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            // TODO: 링크 다이얼로그 모달로 교체 필요
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('MARKDOWN_EDITOR', 'Link feature - dialog implementation needed');
                        },
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('link') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "링크 추가",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 670,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 661,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleBlockquote().run(),
                        className: `${EDITOR_STYLES.bubbleButton} ${editor.isActive('blockquote') ? 'bg-blue-200 dark:bg-blue-800' : ''}`,
                        title: "인용구",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 680,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 674,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 684,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e)=>{
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event)=>{
                                        const src = event.target?.result;
                                        if (src) {
                                            editor.chain().focus().setImage({
                                                src
                                            }).run();
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Image added via file picker');
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };
                            input.click();
                        },
                        className: EDITOR_STYLES.bubbleButton,
                        title: "이미지 추가",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 711,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 687,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);
                            if (selectedText) {
                                navigator.clipboard.writeText(selectedText).then(()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Text copied to clipboard');
                                }).catch((err)=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('TIPTAP_EDITOR', 'Failed to copy text', err);
                                });
                            }
                        },
                        className: EDITOR_STYLES.bubbleButton,
                        title: "선택한 텍스트 복사",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 732,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 715,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: async ()=>{
                            try {
                                const text = await navigator.clipboard.readText();
                                if (text) {
                                    editor.chain().focus().insertContent(text).run();
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Text pasted from clipboard');
                                }
                            } catch (err) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('TIPTAP_EDITOR', 'Failed to paste from clipboard', err);
                            }
                        },
                        className: EDITOR_STYLES.bubbleButton,
                        title: "클립보드에서 붙여넣기",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__["Clipboard"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 751,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 736,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 755,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            // 기본으로 H2 헤딩 적용 (prompt 대신)
                            editor.chain().focus().setHeading({
                                level: 2
                            }).run();
                        },
                        className: EDITOR_STYLES.bubbleButton,
                        title: "헤딩 설정",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                            lineNumber: 766,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                        lineNumber: 758,
                        columnNumber: 11
                    }, this)
                ]
            }, "bubble-menu" // 🔥 고유 key 추가
            , true, {
                fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                lineNumber: 598,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["EditorContent"], {
                editor: editor
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
                lineNumber: 772,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx",
        lineNumber: 586,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_renderer_components_projects_editor_fc5984de._.js.map