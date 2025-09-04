(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/renderer/components/projects/modules/markdownEditor/services/MarkdownParserService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 MarkdownParser Service - 마크다운 구문 파싱 전담
// 기존 MarkdownEditor.tsx의 handleKeyDown 로직을 서비스로 분리
__turbopack_context__.s({
    "MarkdownParserService": (()=>MarkdownParserService),
    "markdownParserService": (()=>markdownParserService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
class MarkdownParserService {
    static instance;
    patterns = [];
    constructor(){
        this.initializePatterns();
    }
    static getInstance() {
        if (!MarkdownParserService.instance) {
            MarkdownParserService.instance = new MarkdownParserService();
        }
        return MarkdownParserService.instance;
    }
    initializePatterns() {
        this.patterns = [
            {
                pattern: '#',
                action: (editor, pos)=>{
                    editor.chain().focus().deleteRange({
                        from: pos - 1,
                        to: pos
                    }).setHeading({
                        level: 1
                    }).run();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ H1 applied');
                    return true;
                },
                description: 'Heading 1'
            },
            {
                pattern: '##',
                action: (editor, pos)=>{
                    editor.chain().focus().deleteRange({
                        from: pos - 2,
                        to: pos
                    }).setHeading({
                        level: 2
                    }).run();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ H2 applied');
                    return true;
                },
                description: 'Heading 2'
            },
            {
                pattern: '###',
                action: (editor, pos)=>{
                    editor.chain().focus().deleteRange({
                        from: pos - 3,
                        to: pos
                    }).setHeading({
                        level: 3
                    }).run();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ H3 applied');
                    return true;
                },
                description: 'Heading 3'
            },
            {
                pattern: '-',
                action: (editor, pos)=>{
                    editor.chain().focus().deleteRange({
                        from: pos - 1,
                        to: pos
                    }).toggleBulletList().run();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ Bullet list applied');
                    return true;
                },
                description: 'Bullet List'
            }
        ];
    }
    parseMarkdown(editor, textBefore, position) {
        // 정확한 매칭을 위한 패턴 검사
        for (const pattern of this.patterns){
            if (textBefore === pattern.pattern) {
                return pattern.action(editor, position);
            }
        }
        // 숫자 리스트 처리 (동적 패턴)
        if (/^\d+\.$/.test(textBefore)) {
            editor.chain().focus().deleteRange({
                from: position - textBefore.length,
                to: position
            }).toggleOrderedList().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ Ordered list applied');
            return true;
        }
        return false;
    }
    getAvailablePatterns() {
        return [
            ...this.patterns
        ];
    }
}
const markdownParserService = MarkdownParserService.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 ClipboardService - 클립보드 처리 전담 서비스
// 기존 MarkdownEditor.tsx의 중복된 클립보드 로직을 통합
__turbopack_context__.s({
    "ClipboardService": (()=>ClipboardService),
    "clipboardService": (()=>clipboardService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
class ClipboardService {
    static instance;
    constructor(){}
    static getInstance() {
        if (!ClipboardService.instance) {
            ClipboardService.instance = new ClipboardService();
        }
        return ClipboardService.instance;
    }
    // 🔥 텍스트 복사
    async copyText(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text copied successfully');
                return {
                    success: true,
                    data: text
                };
            } else {
                // 폴백: execCommand 방식
                return this.fallbackCopyText(text);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to copy text', error);
            return {
                success: false,
                error: String(error)
            };
        }
    }
    // 🔥 텍스트 붙여넣기
    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text pasted successfully');
            return {
                success: true,
                data: text
            };
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to paste text', error);
            return {
                success: false,
                error: String(error)
            };
        }
    }
    // 🔥 이미지 처리 (클립보드에서)
    async handleImagePaste(editor, clipboardData) {
        try {
            const items = Array.from(clipboardData.items);
            for (const item of items){
                if (item.type.indexOf('image') === 0) {
                    const file = item.getAsFile();
                    if (file) {
                        const result = await this.processImageFile(editor, file);
                        if (result.success) {
                            return result;
                        }
                    }
                }
            }
            return {
                success: false,
                error: 'No image found in clipboard'
            };
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to handle image paste', error);
            return {
                success: false,
                error: String(error)
            };
        }
    }
    // 🔥 드래그앤드롭 이미지 처리
    async handleImageDrop(editor, files) {
        try {
            const imageFiles = Array.from(files).filter((file)=>file.type.startsWith('image/'));
            if (imageFiles.length === 0) {
                return {
                    success: false,
                    error: 'No image files found'
                };
            }
            const results = await Promise.all(imageFiles.map((file)=>this.processImageFile(editor, file)));
            const successCount = results.filter((r)=>r.success).length;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', `Processed ${successCount}/${imageFiles.length} images`);
            return {
                success: successCount > 0,
                data: `${successCount} images processed`
            };
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to handle image drop', error);
            return {
                success: false,
                error: String(error)
            };
        }
    }
    // 🔥 에디터에서 선택된 텍스트 복사
    async copySelectedText(editor) {
        try {
            const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to);
            if (!selectedText) {
                return {
                    success: false,
                    error: 'No text selected'
                };
            }
            return await this.copyText(selectedText);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to copy selected text', error);
            return {
                success: false,
                error: String(error)
            };
        }
    }
    // 🔥 에디터에 텍스트 붙여넣기
    async pasteToEditor(editor) {
        try {
            const result = await this.pasteText();
            if (result.success && result.data) {
                editor.chain().focus().insertContent(result.data).run();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text pasted to editor');
                return {
                    success: true,
                    data: result.data
                };
            }
            return result;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to paste to editor', error);
            return {
                success: false,
                error: String(error)
            };
        }
    }
    // 🔥 Private helper methods
    async processImageFile(editor, file) {
        return new Promise((resolve)=>{
            const reader = new FileReader();
            reader.onload = (e)=>{
                const src = e.target?.result;
                if (src) {
                    editor.chain().focus().setImage({
                        src
                    }).run();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Image added to editor');
                    resolve({
                        success: true,
                        data: src
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Failed to read image file'
                    });
                }
            };
            reader.onerror = ()=>{
                resolve({
                    success: false,
                    error: 'Failed to read image file'
                });
            };
            reader.readAsDataURL(file);
        });
    }
    fallbackCopyText(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text copied via fallback method');
                return {
                    success: true,
                    data: text
                };
            } else {
                return {
                    success: false,
                    error: 'execCommand failed'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: String(error)
            };
        }
    }
}
const clipboardService = ClipboardService.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/handlers/KeyboardHandler.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 KeyboardHandler - 키보드 이벤트 처리 전담
// 기존 MarkdownEditor.tsx의 복잡한 키보드 로직을 분리
__turbopack_context__.s({
    "KeyboardHandler": (()=>KeyboardHandler),
    "keyboardHandler": (()=>KeyboardHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$MarkdownParserService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/MarkdownParserService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-client] (ecmascript)");
;
;
;
class KeyboardHandler {
    editor = null;
    globalHandlerActive = false;
    constructor(editor){
        this.editor = editor;
    }
    // 🔥 TipTap 에디터 키 다운 핸들러 (마크다운 구문 처리)
    handleEditorKeyDown = (view, event)=>{
        if (!this.editor || event.key !== ' ') return false;
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        const textBefore = $from.parent.textContent.slice(0, $from.parentOffset);
        // 마크다운 파서 서비스 사용
        const handled = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$MarkdownParserService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markdownParserService"].parseMarkdown(this.editor, textBefore, $from.pos);
        if (handled) {
            event.preventDefault();
            event.stopPropagation();
            return true;
        }
        return false;
    };
    // 🔥 전역 키보드 핸들러 (단축키 처리)
    handleGlobalKeyDown = async (event)=>{
        if (!this.editor) return;
        const { key, ctrlKey, metaKey, shiftKey } = event;
        const modKey = ctrlKey || metaKey; // Windows: Ctrl, Mac: Cmd
        // 🔥 클립보드 단축키
        if (modKey && !shiftKey) {
            switch(key){
                case 'c':
                    await this.handleCopy();
                    break;
                case 'v':
                    await this.handlePaste();
                    break;
                case 's':
                    this.handleSave();
                    event.preventDefault(); // 브라우저 기본 저장 방지
                    break;
            }
        }
        // 🔥 포맷팅 단축키
        if (modKey) {
            switch(key){
                case 'b':
                    if (!shiftKey) {
                        this.editor.chain().focus().toggleBold().run();
                        event.preventDefault();
                    }
                    break;
                case 'i':
                    if (!shiftKey) {
                        this.editor.chain().focus().toggleItalic().run();
                        event.preventDefault();
                    }
                    break;
                case 'u':
                    if (!shiftKey) {
                        this.editor.chain().focus().toggleUnderline().run();
                        event.preventDefault();
                    }
                    break;
                case '`':
                    this.editor.chain().focus().toggleCode().run();
                    event.preventDefault();
                    break;
            }
        }
        // 🔥 기타 단축키
        if (key === 'Escape') {
            this.handleEscape();
        }
    };
    // 🔥 복사 처리
    async handleCopy() {
        if (!this.editor) return;
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clipboardService"].copySelectedText(this.editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'Text copied via keyboard shortcut');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('KEYBOARD_HANDLER', 'Failed to copy text', error);
        }
    }
    // 🔥 붙여넣기 처리
    async handlePaste() {
        if (!this.editor) return;
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clipboardService"].pasteToEditor(this.editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'Text pasted via keyboard shortcut');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('KEYBOARD_HANDLER', 'Failed to paste text', error);
        }
    }
    // 🔥 저장 처리
    handleSave() {
        const saveEvent = new CustomEvent('project:save');
        window.dispatchEvent(saveEvent);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'Save triggered via keyboard shortcut');
    }
    // 🔥 ESC 키 처리 (포커스 모드 해제)
    handleEscape() {
        const exitFocusEvent = new CustomEvent('editor:exitFocus');
        window.dispatchEvent(exitFocusEvent);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'ESC pressed - exit focus mode');
    }
    // 🔥 전역 이벤트 리스너 시작
    startGlobalHandling() {
        if (this.globalHandlerActive) return;
        document.addEventListener('keydown', this.handleGlobalKeyDown);
        this.globalHandlerActive = true;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('KEYBOARD_HANDLER', 'Global keyboard handling started');
    }
    // 🔥 전역 이벤트 리스너 정지
    stopGlobalHandling() {
        if (!this.globalHandlerActive) return;
        document.removeEventListener('keydown', this.handleGlobalKeyDown);
        this.globalHandlerActive = false;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('KEYBOARD_HANDLER', 'Global keyboard handling stopped');
    }
    // 🔥 정리
    cleanup() {
        this.stopGlobalHandling();
        this.editor = null;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('KEYBOARD_HANDLER', 'Keyboard handler cleaned up');
    }
    // 🔥 Getter
    isGlobalHandlingActive() {
        return this.globalHandlerActive;
    }
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "SlashCommand": (()=>SlashCommand),
    "slashSuggestion": (()=>slashSuggestion)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/core/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$suggestion$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/suggestion/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tippy$2e$js$2f$dist$2f$tippy$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tippy.js/dist/tippy.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.js [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [app-client] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading1$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heading-1.js [app-client] (ecmascript) <export default as Heading1>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heading-2.js [app-client] (ecmascript) <export default as Heading2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heading-3.js [app-client] (ecmascript) <export default as Heading3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$highlighter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Highlighter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/highlighter.js [app-client] (ecmascript) <export default as Highlighter>");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading1$3e$__["Heading1"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHeading({
                level: 1
            }).run();
        }
    },
    {
        title: '제목 2',
        description: '중간 섹션 헤딩',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading2$3e$__["Heading2"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHeading({
                level: 2
            }).run();
        }
    },
    {
        title: '제목 3',
        description: '작은 섹션 헤딩',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heading$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading3$3e$__["Heading3"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHeading({
                level: 3
            }).run();
        }
    },
    {
        title: '본문',
        description: '일반 텍스트로 시작',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setParagraph().run();
        }
    },
    {
        title: '불릿 리스트',
        description: '간단한 불릿 목록',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        }
    },
    {
        title: '번호 리스트',
        description: '번호가 매겨진 목록',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        }
    },
    {
        title: '체크리스트',
        description: '할 일 목록',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleList('taskList', 'taskItem').run();
        }
    },
    {
        title: '콜아웃 - 정보',
        description: '💡 정보 강조',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$highlighter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Highlighter$3e$__["Highlighter"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).insertContent('하이라이트할 텍스트').setMark('highlight', {
                color: 'yellow'
            }).run();
        }
    },
    {
        title: '인용구',
        description: '인용 텍스트',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        }
    },
    {
        title: '코드 블록',
        description: '코드 스니펫',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        }
    },
    {
        title: '구분선',
        description: '섹션 구분선',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"],
        command: ({ editor, range })=>{
            editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        }
    }
];
const CommandMenu = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ items, command }, ref)=>{
    _s();
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "CommandMenu.useImperativeHandle": ()=>({
                onKeyDown: ({
                    "CommandMenu.useImperativeHandle": ({ event })=>{
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
                })["CommandMenu.useImperativeHandle"]
            })
    }["CommandMenu.useImperativeHandle"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommandMenu.useEffect": ()=>setSelectedIndex(0)
    }["CommandMenu.useEffect"], [
        items
    ]);
    const selectItem = (index)=>{
        const item = items[index];
        if (item) {
            command(item);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "z-50 w-72 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-auto",
        children: items.length ? items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `flex items-center gap-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'}`,
                onClick: ()=>selectItem(index),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-4 flex items-center justify-center text-gray-500 dark:text-gray-400",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                            lineNumber: 274,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                        lineNumber: 273,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium",
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500 dark:text-gray-400",
                                children: item.description
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                                lineNumber: 278,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                        lineNumber: 276,
                        columnNumber: 13
                    }, this)
                ]
            }, index, true, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                lineNumber: 265,
                columnNumber: 11
            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-3 py-2 text-sm text-gray-500 dark:text-gray-400",
            children: "검색 결과가 없습니다"
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
            lineNumber: 283,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
}, "0WYdeZ8CC4xedvNOJ65nXZeOqTc=")), "0WYdeZ8CC4xedvNOJ65nXZeOqTc=");
_c1 = CommandMenu;
CommandMenu.displayName = 'CommandMenu';
const SlashCommand = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Extension"].create({
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$suggestion$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
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
                component = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactRenderer"](CommandMenu, {
                    props,
                    editor: props.editor
                });
                if (!props.clientRect) {
                    return;
                }
                popup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tippy$2e$js$2f$dist$2f$tippy$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('body', {
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
var _c, _c1;
__turbopack_context__.k.register(_c, "CommandMenu$forwardRef");
__turbopack_context__.k.register(_c1, "CommandMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/components/AdvancedNotionFeatures.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/core/dist/index.js [app-client] (ecmascript)");
;
const TaskList = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].create({
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeAttributes"])(HTMLAttributes, {
                'data-type': 'taskList',
                class: 'task-list'
            }),
            0
        ];
    }
});
const TaskItem = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].create({
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeAttributes"])(HTMLAttributes, {
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
const Callout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].create({
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
const Toggle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].create({
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
const Highlight = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mark"].create({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/hooks/useTipTapEditor.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 useTipTapEditor Hook - TipTap 에디터 설정을 분리한 커스텀 훅
// 기존 MarkdownEditor.tsx의 복잡한 에디터 설정을 훅으로 추상화
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useTipTapEditor": (()=>useTipTapEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/starter-kit/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-placeholder/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-focus/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-typography/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-character-count/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-underline/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-image/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$KeyboardHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/handlers/KeyboardHandler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$SlashCommands$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/components/AdvancedNotionFeatures.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
function useTipTapEditor({ content, onChange, isFocusMode, onReady, onFocus, onBlur }) {
    _s();
    const keyboardHandlerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isReadyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // 🔥 에디터 생성 및 설정
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"])({
        immediatelyRender: false,
        extensions: [
            // 🔥 기본 확장들
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                heading: {
                    levels: [
                        1,
                        2,
                        3,
                        4
                    ]
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
            // 🔥 포맷팅 확장들
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            // 🔥 이미지 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                HTMLAttributes: {
                    class: 'rounded-lg shadow-md max-w-full h-auto my-4'
                },
                inline: false,
                allowBase64: true
            }),
            // 🔥 Placeholder 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                placeholder: {
                    "useTipTapEditor.useEditor[editor]": ({ node })=>{
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
                    }
                }["useTipTapEditor.useEditor[editor]"],
                showOnlyWhenEditable: true,
                showOnlyCurrent: false
            }),
            // 🔥 포커스 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                className: 'has-focus',
                mode: 'all'
            }),
            // 🔥 타이포그래피 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                openDoubleQuote: '"',
                closeDoubleQuote: '"',
                openSingleQuote: "'",
                closeSingleQuote: "'",
                ellipsis: '...',
                emDash: '--'
            }),
            // 🔥 노션 스타일 확장들
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskList"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskItem"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Callout"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toggle"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Highlight"],
            // 🔥 슬래시 명령어 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$SlashCommands$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SlashCommand"].configure({
                suggestion: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$SlashCommands$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slashSuggestion"]
            }),
            // 🔥 문자 수 카운트
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
        ],
        content,
        // 🔥 에디터 속성
        editorProps: {
            attributes: {
                class: `flex-1 p-6 prose max-w-none focus:outline-none text-gray-900 dark:text-gray-100 ${isFocusMode ? 'prose-lg' : ''}`,
                'data-placeholder': '이야기를 시작해보세요...'
            },
            // 🔥 키보드 핸들러 위임
            handleKeyDown: {
                "useTipTapEditor.useEditor[editor]": (view, event)=>{
                    if (!keyboardHandlerRef.current) return false;
                    return keyboardHandlerRef.current.handleEditorKeyDown(view, event);
                }
            }["useTipTapEditor.useEditor[editor]"],
            // 🔥 클립보드 처리 위임
            handlePaste: {
                "useTipTapEditor.useEditor[editor]": (view, event)=>{
                    const editorInstance = view.editor;
                    if (!editorInstance || !event.clipboardData) return false;
                    // 비동기 처리를 Promise로 처리 (반환값은 동기적)
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clipboardService"].handleImagePaste(editorInstance, event.clipboardData).then({
                        "useTipTapEditor.useEditor[editor]": (result)=>{
                            if (result.success) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Image pasted successfully');
                            }
                        }
                    }["useTipTapEditor.useEditor[editor]"]).catch({
                        "useTipTapEditor.useEditor[editor]": (error)=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('TIPTAP_EDITOR', 'Failed to paste image', error);
                        }
                    }["useTipTapEditor.useEditor[editor]"]);
                    return false; // 기본 동작 허용
                }
            }["useTipTapEditor.useEditor[editor]"],
            // 🔥 드래그앤드롭 처리는 별도 핸들러에서 관리
            handleDrop: {
                "useTipTapEditor.useEditor[editor]": ()=>false
            }["useTipTapEditor.useEditor[editor]"]
        },
        // 🔥 이벤트 핸들러들
        onUpdate: {
            "useTipTapEditor.useEditor[editor]": ({ editor })=>{
                const newContent = editor.getHTML();
                onChange(newContent);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Content updated', {
                    wordCount: editor.storage.characterCount?.words() || 0
                });
            }
        }["useTipTapEditor.useEditor[editor]"],
        onCreate: {
            "useTipTapEditor.useEditor[editor]": ({ editor })=>{
                // 키보드 핸들러 초기화
                keyboardHandlerRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$KeyboardHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardHandler"](editor);
                keyboardHandlerRef.current.startGlobalHandling();
                isReadyRef.current = true;
                onReady?.();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Editor created successfully');
            }
        }["useTipTapEditor.useEditor[editor]"],
        onFocus: {
            "useTipTapEditor.useEditor[editor]": ({ editor })=>{
                onFocus?.();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor focused');
            }
        }["useTipTapEditor.useEditor[editor]"],
        onBlur: {
            "useTipTapEditor.useEditor[editor]": ({ editor })=>{
                onBlur?.();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor blurred');
            }
        }["useTipTapEditor.useEditor[editor]"],
        onDestroy: {
            "useTipTapEditor.useEditor[editor]": ()=>{
                if (keyboardHandlerRef.current) {
                    keyboardHandlerRef.current.cleanup();
                    keyboardHandlerRef.current = null;
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor destroyed');
            }
        }["useTipTapEditor.useEditor[editor]"]
    });
    // 🔥 통계 계산
    const wordCount = editor?.storage.characterCount?.words() || 0;
    const characterCount = editor?.storage.characterCount?.characters() || 0;
    return {
        editor,
        isReady: isReadyRef.current,
        wordCount,
        characterCount
    };
}
_s(useTipTapEditor, "Zh9YDn21wKH/Hh8gn5ycqlJMKxQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"]
    ];
});
const __TURBOPACK__default__export__ = useTipTapEditor;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/handlers/DragDropHandler.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 DragDropHandler - 드래그앤드롭 이벤트 처리 전담
// 기존 MarkdownEditor.tsx의 복잡한 드래그앤드롭 로직을 분리
__turbopack_context__.s({
    "DragDropHandler": (()=>DragDropHandler),
    "dragDropHandler": (()=>DragDropHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-client] (ecmascript)");
;
;
class DragDropHandler {
    editor = null;
    setState = null;
    element = null;
    constructor(editor, setState, element){
        this.editor = editor;
        this.setState = setState;
        this.element = element || editor.view.dom;
        this.setupEventListeners();
    }
    // 🔥 이벤트 리스너 설정
    setupEventListeners() {
        if (!this.element) return;
        this.element.addEventListener('dragenter', this.handleDragEnter);
        this.element.addEventListener('dragover', this.handleDragOver);
        this.element.addEventListener('dragleave', this.handleDragLeave);
        this.element.addEventListener('drop', this.handleDrop);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Event listeners attached');
    }
    // 🔥 이벤트 리스너 정리
    cleanup() {
        if (!this.element) return;
        this.element.removeEventListener('dragenter', this.handleDragEnter);
        this.element.removeEventListener('dragover', this.handleDragOver);
        this.element.removeEventListener('dragleave', this.handleDragLeave);
        this.element.removeEventListener('drop', this.handleDrop);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Event listeners cleaned up');
    }
    // 🔥 드래그 시작 핸들러
    handleDragEnter = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!this.hasValidFiles(e.dataTransfer)) return;
        this.element?.classList.add('drag-over');
        this.setState?.({
            isDragOver: true
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Drag enter detected');
    };
    // 🔥 드래그 오버 핸들러
    handleDragOver = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        // 드래그 효과 설정
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
    };
    // 🔥 드래그 떠남 핸들러
    handleDragLeave = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        // 에디터 영역을 완전히 벗어날 때만 상태 변경
        if (!this.element?.contains(e.relatedTarget)) {
            this.element?.classList.remove('drag-over');
            this.setState?.({
                isDragOver: false
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Drag leave detected');
        }
    };
    // 🔥 드롭 핸들러
    handleDrop = async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.element?.classList.remove('drag-over');
        this.setState?.({
            isDragOver: false
        });
        if (!this.editor || !e.dataTransfer) return;
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DRAG_DROP_HANDLER', `Processing ${files.length} dropped files`);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clipboardService"].handleImageDrop(this.editor, files);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DRAG_DROP_HANDLER', 'Files processed successfully');
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('DRAG_DROP_HANDLER', 'File processing failed', result.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('DRAG_DROP_HANDLER', 'Error processing dropped files', error);
        }
    };
    // 🔥 파일 유효성 검증
    hasValidFiles(dataTransfer) {
        if (!dataTransfer) return false;
        const items = Array.from(dataTransfer.items);
        return items.some((item)=>item.kind === 'file' && item.type.startsWith('image/'));
    }
    // 🔥 수동 파일 업로드 (파일 선택기)
    static async uploadFromFilePicker(editor) {
        return new Promise((resolve)=>{
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.onchange = async (e)=>{
                const files = e.target.files;
                if (files && files.length > 0) {
                    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clipboardService"].handleImageDrop(editor, files);
                    if (result.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('DRAG_DROP_HANDLER', 'Files uploaded via file picker');
                    }
                }
                resolve();
            };
            input.oncancel = ()=>resolve();
            input.click();
        });
    }
    // 🔥 Getter methods
    getEditor() {
        return this.editor;
    }
    getElement() {
        return this.element;
    }
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 EditorBubbleMenu - 선택 시 나타나는 포맷팅 메뉴 컴포넌트
// 기존 MarkdownEditor.tsx의 BubbleMenu JSX를 분리
__turbopack_context__.s({
    "EditorBubbleMenu": (()=>EditorBubbleMenu),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bold.js [app-client] (ecmascript) <export default as Bold>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/italic.js [app-client] (ecmascript) <export default as Italic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/underline.js [app-client] (ecmascript) <export default as Underline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/strikethrough.js [app-client] (ecmascript) <export default as Strikethrough>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-client] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard.js [app-client] (ecmascript) <export default as Clipboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/handlers/DragDropHandler.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const BUBBLE_STYLES = {
    bubble: 'flex flex-nowrap gap-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-visible whitespace-nowrap',
    button: 'px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition-colors flex items-center justify-center min-w-[30px]',
    activeButton: 'px-2 py-1 text-sm bg-blue-200 dark:bg-blue-800 rounded transition-colors flex items-center justify-center min-w-[30px]',
    divider: 'w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1'
};
function EditorBubbleMenu({ editor }) {
    // 🔥 포맷팅 버튼 핸들러들
    const handleBold = ()=>{
        editor.chain().focus().toggleBold().run();
    };
    const handleItalic = ()=>{
        editor.chain().focus().toggleItalic().run();
    };
    const handleUnderline = ()=>{
        editor.chain().focus().toggleUnderline().run();
    };
    const handleStrike = ()=>{
        editor.chain().focus().toggleStrike().run();
    };
    const handleCode = ()=>{
        editor.chain().focus().toggleCode().run();
    };
    const handleQuote = ()=>{
        editor.chain().focus().toggleBlockquote().run();
    };
    const handleHeading = ()=>{
        editor.chain().focus().setHeading({
            level: 2
        }).run();
    };
    // 🔥 이미지 추가 핸들러
    const handleImageAdd = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DragDropHandler"].uploadFromFilePicker(editor);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Image upload initiated');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('BUBBLE_MENU', 'Failed to upload image', error);
        }
    };
    // 🔥 클립보드 핸들러들
    const handleCopy = async ()=>{
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clipboardService"].copySelectedText(editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Text copied to clipboard');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('BUBBLE_MENU', 'Failed to copy text', error);
        }
    };
    const handlePaste = async ()=>{
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clipboardService"].pasteToEditor(editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Text pasted from clipboard');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('BUBBLE_MENU', 'Failed to paste text', error);
        }
    };
    // 🔥 링크 핸들러 (TODO: 링크 다이얼로그 구현 필요)
    const handleLink = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Link feature - dialog implementation needed');
    // TODO: 링크 다이얼로그 모달 구현
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BubbleMenu"], {
        editor: editor,
        className: BUBBLE_STYLES.bubble,
        shouldShow: ({ from, to })=>from !== to,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleBold,
                className: editor.isActive('bold') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "볼드 (Ctrl+B)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 115,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 110,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleItalic,
                className: editor.isActive('italic') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "이탤릭 (Ctrl+I)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 123,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 118,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleUnderline,
                className: editor.isActive('underline') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "언더라인 (Ctrl+U)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 131,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 126,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleStrike,
                className: editor.isActive('strike') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "취소선 (Ctrl+Shift+S)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__["Strikethrough"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 139,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 134,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 143,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleCode,
                className: editor.isActive('code') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "인라인 코드 (Ctrl+`)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 151,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 146,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 155,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleLink,
                className: editor.isActive('link') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "링크 추가",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 163,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 158,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleQuote,
                className: editor.isActive('blockquote') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "인용구",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 172,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 167,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 176,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleImageAdd,
                className: BUBBLE_STYLES.button,
                title: "이미지 추가",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 184,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 179,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleCopy,
                className: BUBBLE_STYLES.button,
                title: "선택한 텍스트 복사",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 193,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 188,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handlePaste,
                className: BUBBLE_STYLES.button,
                title: "클립보드에서 붙여넣기",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__["Clipboard"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 202,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 197,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 206,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleHeading,
                className: BUBBLE_STYLES.button,
                title: "헤딩 설정",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                    size: 14
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                    lineNumber: 214,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 209,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
        lineNumber: 104,
        columnNumber: 9
    }, this);
}
_c = EditorBubbleMenu;
const __TURBOPACK__default__export__ = EditorBubbleMenu;
var _c;
__turbopack_context__.k.register(_c, "EditorBubbleMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 Modularized MarkdownEditor - 모듈화된 새로운 에디터
// 기존 777줄 → 약 100줄로 축소, 단일 책임 원칙 준수
__turbopack_context__.s({
    "MarkdownEditor": (()=>MarkdownEditor),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$hooks$2f$useTipTapEditor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/hooks/useTipTapEditor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/handlers/DragDropHandler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$EditorBubbleMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const EDITOR_STYLES = {
    container: 'w-full h-full flex flex-col',
    loading: 'flex items-center justify-center h-full',
    dragOverlay: 'absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center z-10 pointer-events-none'
};
function MarkdownEditor({ content, onChange, isFocusMode }) {
    _s();
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isReady, setIsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragHandlerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 모듈화된 TipTap 에디터 훅 사용
    const { editor, wordCount, characterCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$hooks$2f$useTipTapEditor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTipTapEditor"])({
        content,
        onChange,
        isFocusMode,
        onReady: {
            "MarkdownEditor.useTipTapEditor": ()=>{
                setIsReady(true);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MARKDOWN_EDITOR', 'Editor ready');
            }
        }["MarkdownEditor.useTipTapEditor"],
        onFocus: {
            "MarkdownEditor.useTipTapEditor": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_EDITOR', 'Editor focused');
            }
        }["MarkdownEditor.useTipTapEditor"],
        onBlur: {
            "MarkdownEditor.useTipTapEditor": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_EDITOR', 'Editor blurred');
            }
        }["MarkdownEditor.useTipTapEditor"]
    });
    // 🔥 드래그앤드롭 핸들러 초기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarkdownEditor.useEffect": ()=>{
            if (!editor || !isReady) return;
            dragHandlerRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DragDropHandler"](editor, {
                "MarkdownEditor.useEffect": (state)=>setIsDragOver(state.isDragOver ?? false)
            }["MarkdownEditor.useEffect"]);
            return ({
                "MarkdownEditor.useEffect": ()=>{
                    if (dragHandlerRef.current) {
                        dragHandlerRef.current.cleanup();
                        dragHandlerRef.current = null;
                    }
                }
            })["MarkdownEditor.useEffect"];
        }
    }["MarkdownEditor.useEffect"], [
        editor,
        isReady
    ]);
    // 🔥 외부 content 변경 시 에디터 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarkdownEditor.useEffect": ()=>{
            if (editor && content !== editor.getHTML()) {
                editor.commands.setContent(content, false);
            }
        }
    }["MarkdownEditor.useEffect"], [
        content,
        editor
    ]);
    // 🔥 로딩 중 표시
    if (!isReady || !editor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: EDITOR_STYLES.container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: EDITOR_STYLES.loading,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                            lineNumber: 81,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-slate-500 text-sm",
                            children: "에디터 준비 중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                            lineNumber: 82,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                    lineNumber: 80,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                lineNumber: 79,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
            lineNumber: 78,
            columnNumber: 13
        }, this);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_EDITOR', 'Rendering editor', {
        wordCount,
        characterCount,
        isDragOver,
        isFocusMode
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${EDITOR_STYLES.container} ${isDragOver ? 'drag-over' : ''}`,
        children: [
            isDragOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: EDITOR_STYLES.dragOverlay,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-blue-600 dark:text-blue-400 text-lg font-medium",
                    children: "📁 파일을 여기에 놓으세요"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                    lineNumber: 101,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                lineNumber: 100,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$EditorBubbleMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorBubbleMenu"], {
                editor: editor
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                lineNumber: 108,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["EditorContent"], {
                editor: editor
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                lineNumber: 111,
                columnNumber: 13
            }, this),
            ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 right-4 text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow",
                children: [
                    "Words: ",
                    wordCount,
                    " | Chars: ",
                    characterCount
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                lineNumber: 115,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
        lineNumber: 97,
        columnNumber: 9
    }, this);
}
_s(MarkdownEditor, "F7B5HIMknmz9A9Fl+9pWlv3aC90=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$hooks$2f$useTipTapEditor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTipTapEditor"]
    ];
});
_c = MarkdownEditor;
const __TURBOPACK__default__export__ = MarkdownEditor;
var _c;
__turbopack_context__.k.register(_c, "MarkdownEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/services/EditorShortcuts.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
'use client';
;
// 🔥 플랫폼별 modifier 키 감지
const isMac = "object" !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const modifierKey = isMac ? 'metaKey' : 'ctrlKey';
const TEXT_FORMATTING_SHORTCUTS = [
    {
        key: 'b',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleBold().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Bold toggled');
            return true;
        },
        description: '볼드 토글'
    },
    {
        key: 'i',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleItalic().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Italic toggled');
            return true;
        },
        description: '이탤릭 토글'
    },
    {
        key: 'u',
        modifier: true,
        action: (editor)=>{
            editor.chain().focus().toggleUnderline().run();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Underline toggled');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Strikethrough toggled');
            return true;
        },
        description: '취소선 토글'
    },
    {
        key: 'k',
        modifier: true,
        action: (editor)=>{
            // 🔥 링크 생성 (추후 구현)
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Link shortcut triggered');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H1 toggled');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H2 toggled');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'H3 toggled');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Paragraph set');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Bullet list toggled');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Ordered list toggled');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR_SHORTCUTS', 'Save triggered');
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
    const isModifier = isMac ? metaKey : ctrlKey;
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', `Shortcut executed: ${shortcut.description}`, {
                        key: shortcut.key,
                        modifier: isModifier,
                        shift: shiftKey,
                        alt: altKey
                    });
                    return true;
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('EDITOR_SHORTCUTS', `Shortcut execution failed: ${shortcut.description}`, error);
            }
        }
    }
    return false;
}
function bindShortcutsToEditor(editor) {
    if (!editor) return ()=>{};
    // 🔥 전역 리스너 등록하지 않음 - TipTap 내부 handleKeyDown만 사용
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('EDITOR_SHORTCUTS', 'Shortcuts system initialized', {
        shortcutCount: ALL_SHORTCUTS.length,
        platform: isMac ? 'macOS' : 'Windows/Linux'
    });
    // 🔥 정리 함수 반환 (실제로는 아무것도 안 함)
    return ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_SHORTCUTS', 'Shortcuts system cleaned up');
    };
}
function getShortcutHelp() {
    const modifier = isMac ? '⌘' : 'Ctrl';
    const shortcuts = [
        '📝 텍스트 포맷팅',
        `${modifier} + B: 볼드`,
        `${modifier} + I: 이탤릭`,
        `${modifier} + U: 밑줄`,
        `${modifier} + Shift + S: 취소선`,
        `${modifier} + \`: 인라인 코드`,
        '',
        '📋 편집',
        `${modifier} + C: 복사`,
        `${modifier} + V: 붙여넣기`,
        `${modifier} + X: 잘라내기`,
        `${modifier} + Z: 실행 취소`,
        `${modifier} + Y: 다시 실행`,
        '',
        '🔤 제목 및 구조',
        `${modifier} + Alt + 1: 제목 1`,
        `${modifier} + Alt + 2: 제목 2`,
        `${modifier} + Alt + 3: 제목 3`,
        `${modifier} + Shift + 8: 불릿 리스트`,
        `${modifier} + Shift + 7: 번호 리스트`,
        '',
        '⚡ 고급 기능',
        `${modifier} + K: 링크 삽입`,
        `${modifier} + Shift + K: 코드 블록`,
        `${modifier} + Shift + >: 인용구`,
        `${modifier} + Enter: 줄바꿈`,
        'ESC: 포커스 모드 해제'
    ];
    return shortcuts.join('\n');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/services/ProjectEditorStateService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 ProjectEditorStateService - ProjectEditor의 복잡한 상태 관리를 담당
// 15개 이상의 useState를 체계적으로 관리하는 서비스
__turbopack_context__.s({
    "ProjectEditorStateService": (()=>ProjectEditorStateService),
    "projectEditorStateService": (()=>projectEditorStateService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
class ProjectEditorStateService {
    static instance;
    constructor(){}
    static getInstance() {
        if (!ProjectEditorStateService.instance) {
            ProjectEditorStateService.instance = new ProjectEditorStateService();
        }
        return ProjectEditorStateService.instance;
    }
    // 🔥 초기 상태 생성
    createInitialState() {
        return {
            // View 상태
            currentView: 'write',
            currentSubView: '',
            editingItemId: '',
            // UI 상태
            collapsed: false,
            showRightSidebar: false,
            // Modal 상태
            showDeleteDialog: false,
            showShareDialog: false,
            showNewChapterModal: false,
            showChapterDeleteDialog: false,
            chapterToDelete: null,
            // Tab 상태
            tabs: [
                {
                    id: 'main',
                    title: '메인',
                    type: 'main',
                    isActive: true,
                    order: 0,
                    content: ''
                }
            ],
            activeTabId: 'main',
            nextTabOrder: 1
        };
    }
    // 🔥 상태 액션 생성
    createStateActions(state, setState) {
        return {
            // View 액션
            setCurrentView: (view)=>{
                setState((prev)=>({
                        ...prev,
                        currentView: view
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'View changed', {
                    view
                });
            },
            setCurrentSubView: (subView)=>{
                setState((prev)=>({
                        ...prev,
                        currentSubView: subView
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'SubView changed', {
                    subView
                });
            },
            setEditingItemId: (id)=>{
                setState((prev)=>({
                        ...prev,
                        editingItemId: id
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Editing item changed', {
                    id
                });
            },
            // UI 액션
            toggleCollapsed: ()=>{
                setState((prev)=>{
                    const newCollapsed = !prev.collapsed;
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Sidebar toggled', {
                        collapsed: newCollapsed
                    });
                    return {
                        ...prev,
                        collapsed: newCollapsed
                    };
                });
            },
            toggleRightSidebar: ()=>{
                setState((prev)=>{
                    const newShowRightSidebar = !prev.showRightSidebar;
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Right sidebar toggled', {
                        show: newShowRightSidebar
                    });
                    return {
                        ...prev,
                        showRightSidebar: newShowRightSidebar
                    };
                });
            },
            // Modal 액션
            openDeleteDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showDeleteDialog: true
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Delete dialog opened');
            },
            closeDeleteDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showDeleteDialog: false
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Delete dialog closed');
            },
            openShareDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showShareDialog: true
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Share dialog opened');
            },
            closeShareDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showShareDialog: false
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Share dialog closed');
            },
            openNewChapterModal: ()=>{
                setState((prev)=>({
                        ...prev,
                        showNewChapterModal: true
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'New chapter modal opened');
            },
            closeNewChapterModal: ()=>{
                setState((prev)=>({
                        ...prev,
                        showNewChapterModal: false
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'New chapter modal closed');
            },
            openChapterDeleteDialog: (chapter)=>{
                setState((prev)=>({
                        ...prev,
                        showChapterDeleteDialog: true,
                        chapterToDelete: chapter
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Chapter delete dialog opened', {
                    chapter
                });
            },
            closeChapterDeleteDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showChapterDeleteDialog: false,
                        chapterToDelete: null
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Chapter delete dialog closed');
            },
            // Tab 액션
            addTab: (tab)=>{
                setState((prev)=>{
                    const newTab = {
                        ...tab,
                        order: prev.nextTabOrder
                    };
                    const newTabs = [
                        ...prev.tabs,
                        newTab
                    ];
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Tab added', {
                        tab: newTab
                    });
                    return {
                        ...prev,
                        tabs: newTabs,
                        nextTabOrder: prev.nextTabOrder + 1,
                        activeTabId: tab.id
                    };
                });
            },
            removeTab: (tabId)=>{
                setState((prev)=>{
                    const newTabs = prev.tabs.filter((tab)=>tab.id !== tabId);
                    const newActiveTabId = prev.activeTabId === tabId ? newTabs.length > 0 ? newTabs[0]?.id || 'main' : 'main' : prev.activeTabId;
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Tab removed', {
                        tabId,
                        newActiveTabId
                    });
                    return {
                        ...prev,
                        tabs: newTabs,
                        activeTabId: newActiveTabId
                    };
                });
            },
            setActiveTab: (tabId)=>{
                setState((prev)=>{
                    const updatedTabs = prev.tabs.map((tab)=>({
                            ...tab,
                            isActive: tab.id === tabId
                        }));
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Active tab changed', {
                        tabId
                    });
                    return {
                        ...prev,
                        tabs: updatedTabs,
                        activeTabId: tabId
                    };
                });
            },
            updateTab: (tabId, updates)=>{
                setState((prev)=>{
                    const updatedTabs = prev.tabs.map((tab)=>tab.id === tabId ? {
                            ...tab,
                            ...updates
                        } : tab);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Tab updated', {
                        tabId,
                        updates
                    });
                    return {
                        ...prev,
                        tabs: updatedTabs
                    };
                });
            },
            markAllTabsAsSaved: ()=>{
                setState((prev)=>{
                    const updatedTabs = prev.tabs.map((tab)=>({
                            ...tab,
                            isDirty: false
                        }));
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'All tabs marked as saved');
                    return {
                        ...prev,
                        tabs: updatedTabs
                    };
                });
            }
        };
    }
}
const projectEditorStateService = ProjectEditorStateService.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/hooks/useProjectEditorState.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 useProjectEditorState Hook - ProjectEditor 상태 관리를 위한 커스텀 훅
// 복잡한 상태 로직을 훅으로 추상화
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useProjectEditorState": (()=>useProjectEditorState)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$services$2f$ProjectEditorStateService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/services/ProjectEditorStateService.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useProjectEditorState() {
    _s();
    // 🔥 단일 상태 객체로 모든 상태 관리
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useProjectEditorState.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$services$2f$ProjectEditorStateService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectEditorStateService"].createInitialState()
    }["useProjectEditorState.useState"]);
    // 🔥 상태 액션들 생성
    const actions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$services$2f$ProjectEditorStateService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectEditorStateService"].createStateActions(state, setState);
    return {
        state,
        actions
    };
}
_s(useProjectEditorState, "V0f+Dc1qQydeD1YJQGhhrqzMDSg=");
const __TURBOPACK__default__export__ = useProjectEditorState;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 ProjectEditorLayout - ProjectEditor의 레이아웃과 스타일을 담당
// 하드코딩된 스타일을 별도 컴포넌트로 분리
__turbopack_context__.s({
    "ProjectEditorContainer": (()=>ProjectEditorContainer),
    "ProjectEditorContent": (()=>ProjectEditorContent),
    "ProjectEditorHeader": (()=>ProjectEditorHeader),
    "ProjectEditorMain": (()=>ProjectEditorMain),
    "WRITER_EDITOR_STYLES": (()=>WRITER_EDITOR_STYLES),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const WRITER_EDITOR_STYLES = {
    // 전체 레이아웃
    container: 'h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200',
    // 헤더 (🔥 nav 중첩 문제 해결)
    header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
    headerLeft: 'flex items-center gap-3',
    headerCenter: 'flex-1 max-w-md mx-auto',
    headerRight: 'flex items-center gap-2',
    // 메인 레이아웃
    main: 'flex flex-1 overflow-hidden',
    // 🔥 에디터 영역 수정 (한줄 문제, 스크롤 제한 해결)
    editorContainer: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200',
    editorContent: 'flex-1 min-h-0 overflow-hidden',
    // UI 컨트롤
    iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
    iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',
    // 🔥 백 버튼 개선 (중첩 문제 해결)
    backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
};
function ProjectEditorContainer({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${WRITER_EDITOR_STYLES.container} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_c = ProjectEditorContainer;
function ProjectEditorHeader({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `${WRITER_EDITOR_STYLES.header} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
        lineNumber: 48,
        columnNumber: 9
    }, this);
}
_c1 = ProjectEditorHeader;
function ProjectEditorMain({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: `${WRITER_EDITOR_STYLES.main} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
        lineNumber: 56,
        columnNumber: 9
    }, this);
}
_c2 = ProjectEditorMain;
function ProjectEditorContent({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${WRITER_EDITOR_STYLES.editorContainer} ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: WRITER_EDITOR_STYLES.editorContent,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
            lineNumber: 65,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
        lineNumber: 64,
        columnNumber: 9
    }, this);
}
_c3 = ProjectEditorContent;
const __TURBOPACK__default__export__ = {
    Container: ProjectEditorContainer,
    Header: ProjectEditorHeader,
    Main: ProjectEditorMain,
    Content: ProjectEditorContent,
    STYLES: WRITER_EDITOR_STYLES
};
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ProjectEditorContainer");
__turbopack_context__.k.register(_c1, "ProjectEditorHeader");
__turbopack_context__.k.register(_c2, "ProjectEditorMain");
__turbopack_context__.k.register(_c3, "ProjectEditorContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "WritingSidebar": (()=>WritingSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
// 🔥 작가 전용 사이드바 스타일
const WRITING_SIDEBAR_STYLES = {
    container: 'w-64 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-r border-blue-200 dark:border-gray-700 p-4 h-full overflow-y-auto',
    header: 'flex items-center gap-3 mb-6 pb-4 border-b border-blue-200 dark:border-gray-700',
    headerIcon: 'w-6 h-6 text-blue-600 dark:text-blue-400',
    headerTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    // 통계 섹션
    statsGrid: 'grid grid-cols-1 gap-4 mb-6',
    statCard: 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-gray-700',
    statHeader: 'flex items-center gap-2 mb-2',
    statIcon: 'w-4 h-4 text-blue-500 dark:text-blue-400',
    statLabel: 'text-sm font-medium text-gray-600 dark:text-gray-400',
    statValue: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
    statSubValue: 'text-xs text-gray-500 dark:text-gray-500 mt-1',
    // 목표 설정
    goalSection: 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-gray-700 mb-6',
    goalHeader: 'flex items-center gap-2 mb-3',
    goalProgress: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2',
    goalProgressBar: 'h-2 rounded-full transition-all duration-300',
    goalText: 'text-sm text-gray-600 dark:text-gray-400',
    // 세션 정보
    sessionSection: 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-gray-700',
    sessionItem: 'flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0',
    sessionLabel: 'text-sm text-gray-600 dark:text-gray-400',
    sessionValue: 'text-sm font-medium text-gray-900 dark:text-gray-100'
};
const WritingSidebar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function WritingSidebar({ projectId, stats, onSetGoal }) {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('WRITING_SIDEBAR', 'Rendering writing sidebar', {
        projectId,
        stats
    });
    // 진행률 계산
    const progressPercentage = Math.min(stats.wordCount / stats.dailyGoal * 100, 100);
    const progressColor = progressPercentage >= 100 ? 'bg-green-500' : progressPercentage >= 70 ? 'bg-blue-500' : progressPercentage >= 30 ? 'bg-yellow-500' : 'bg-gray-400';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: WRITING_SIDEBAR_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: WRITING_SIDEBAR_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                        className: WRITING_SIDEBAR_STYLES.headerIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 78,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: WRITING_SIDEBAR_STYLES.headerTitle,
                        children: "글쓰기 통계"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 79,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                lineNumber: 77,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: WRITING_SIDEBAR_STYLES.statsGrid,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.statCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: WRITING_SIDEBAR_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                        lineNumber: 87,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: WRITING_SIDEBAR_STYLES.statLabel,
                                        children: "총 단어"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                        lineNumber: 88,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 86,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statValue,
                                children: stats.wordCount.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 90,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statSubValue,
                                children: [
                                    stats.characterCount.toLocaleString(),
                                    " 글자"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 93,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 85,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.statCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                        className: WRITING_SIDEBAR_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                        lineNumber: 101,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: WRITING_SIDEBAR_STYLES.statLabel,
                                        children: "타이핑 속도"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                        lineNumber: 102,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 100,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statValue,
                                children: stats.typingSpeed
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 104,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statSubValue,
                                children: "단어/분"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 107,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 99,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.statCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: WRITING_SIDEBAR_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                        lineNumber: 115,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: WRITING_SIDEBAR_STYLES.statLabel,
                                        children: "읽기 시간"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                        lineNumber: 116,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 114,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statValue,
                                children: stats.readingTime
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 118,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITING_SIDEBAR_STYLES.statSubValue,
                                children: [
                                    stats.pageCount,
                                    " 페이지"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 121,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 113,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                lineNumber: 83,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: WRITING_SIDEBAR_STYLES.goalSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.goalHeader,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                className: WRITING_SIDEBAR_STYLES.statIcon
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 130,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.statLabel,
                                children: "일일 목표"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 131,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 129,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.goalProgress,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${WRITING_SIDEBAR_STYLES.goalProgressBar} ${progressColor}`,
                            style: {
                                width: `${progressPercentage}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                            lineNumber: 135,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 134,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.goalText,
                        children: [
                            stats.wordCount,
                            " / ",
                            stats.dailyGoal.toLocaleString(),
                            " 단어 (",
                            progressPercentage.toFixed(0),
                            "%)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 141,
                        columnNumber: 17
                    }, this),
                    progressPercentage >= 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-green-600 dark:text-green-400 text-sm font-medium mt-2",
                        children: "🎉 오늘 목표 달성!"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 146,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                lineNumber: 128,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: WRITING_SIDEBAR_STYLES.sessionSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.goalHeader,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                className: WRITING_SIDEBAR_STYLES.statIcon
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 155,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.statLabel,
                                children: "오늘 세션"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 156,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 154,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.sessionItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.sessionLabel,
                                children: "세션 단어"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 160,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.sessionValue,
                                children: stats.sessionWords.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 161,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 159,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.sessionItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.sessionLabel,
                                children: "문단 수"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 167,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.sessionValue,
                                children: stats.paragraphCount
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 168,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 166,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITING_SIDEBAR_STYLES.sessionItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.sessionLabel,
                                children: "평균 속도"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 174,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: WRITING_SIDEBAR_STYLES.sessionValue,
                                children: [
                                    stats.typingSpeed,
                                    " WPM"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                                lineNumber: 175,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                        lineNumber: 173,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
                lineNumber: 153,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx",
        lineNumber: 75,
        columnNumber: 9
    }, this);
});
_c1 = WritingSidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "WritingSidebar$memo");
__turbopack_context__.k.register(_c1, "WritingSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "StructureSidebar": (()=>StructureSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-open.js [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 구조 관리 전용 사이드바 스타일
const STRUCTURE_SIDEBAR_STYLES = {
    container: 'w-64 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-r border-green-200 dark:border-gray-700 p-4 h-full overflow-y-auto',
    header: 'flex items-center gap-3 mb-6 pb-4 border-b border-green-200 dark:border-gray-700',
    headerIcon: 'w-6 h-6 text-green-600 dark:text-green-400',
    headerTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    // 액션 버튼
    actionSection: 'mb-6',
    addButton: 'w-full flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium',
    addButtonIcon: 'w-4 h-4',
    // 구조 트리
    treeContainer: 'space-y-1',
    treeItem: 'group relative',
    treeItemButton: 'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left',
    treeItemNormal: 'hover:bg-green-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    treeItemSelected: 'bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    treeItemIndent: 'ml-6',
    // 아이템 아이콘 및 텍스트
    itemIcon: 'w-4 h-4 flex-shrink-0',
    itemText: 'flex-1 text-sm font-medium',
    itemMeta: 'text-xs text-gray-500 dark:text-gray-400',
    // 확장/축소 버튼
    expandButton: 'w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
    // 메뉴 버튼
    menuButton: 'w-6 h-6 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity',
    // 드롭다운 메뉴
    menu: 'absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10',
    menuItem: 'flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg'
};
// 아이템 타입별 아이콘
const getItemIcon = (type)=>{
    switch(type){
        case 'synopsis':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"];
        case 'chapter':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"];
        case 'note':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"];
        case 'folder':
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"];
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"];
    }
};
// 아이템 타입별 색상
const getItemColor = (type)=>{
    switch(type){
        case 'synopsis':
            return 'text-purple-500';
        case 'chapter':
            return 'text-blue-500';
        case 'note':
            return 'text-yellow-500';
        case 'folder':
            return 'text-green-500';
        default:
            return 'text-gray-500';
    }
};
const StructureSidebar = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function StructureSidebar({ projectId, structure, onAddItem, onEditItem, onDeleteItem, onSelectItem, selectedItemId }) {
    _s();
    const [expandedItems, setExpandedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [openMenuId, setOpenMenuId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('STRUCTURE_SIDEBAR', 'Rendering structure sidebar', {
        projectId,
        structureCount: structure.length
    });
    // 아이템 확장/축소 토글
    const toggleExpanded = (itemId)=>{
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };
    // 메뉴 토글
    const toggleMenu = (itemId, event)=>{
        event.stopPropagation();
        setOpenMenuId(openMenuId === itemId ? null : itemId);
    };
    // 재귀적으로 구조 아이템 렌더링
    const renderStructureItem = (item, level = 0)=>{
        const Icon = getItemIcon(item.type);
        const iconColor = getItemColor(item.type);
        const isSelected = selectedItemId === item.id;
        const isExpanded = expandedItems.has(item.id);
        const hasChildren = item.children && item.children.length > 0;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: STRUCTURE_SIDEBAR_STYLES.treeItem,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${STRUCTURE_SIDEBAR_STYLES.treeItemButton} ${isSelected ? STRUCTURE_SIDEBAR_STYLES.treeItemSelected : STRUCTURE_SIDEBAR_STYLES.treeItemNormal}`,
                    style: {
                        paddingLeft: `${12 + level * 20}px`
                    },
                    onClick: ()=>onSelectItem?.(item.id),
                    children: [
                        hasChildren && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: (e)=>{
                                e.stopPropagation();
                                toggleExpanded(item.id);
                            },
                            className: STRUCTURE_SIDEBAR_STYLES.expandButton,
                            children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {}, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                                lineNumber: 155,
                                columnNumber: 43
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {}, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                                lineNumber: 155,
                                columnNumber: 61
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 148,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: `${STRUCTURE_SIDEBAR_STYLES.itemIcon} ${iconColor}`
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 160,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: STRUCTURE_SIDEBAR_STYLES.itemText,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: item.title
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                                    lineNumber: 164,
                                    columnNumber: 25
                                }, this),
                                item.wordCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: STRUCTURE_SIDEBAR_STYLES.itemMeta,
                                    children: [
                                        item.wordCount.toLocaleString(),
                                        "자"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                                    lineNumber: 166,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 163,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: (e)=>toggleMenu(item.id, e),
                            className: STRUCTURE_SIDEBAR_STYLES.menuButton,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {}, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                                lineNumber: 177,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 173,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                    lineNumber: 138,
                    columnNumber: 17
                }, this),
                openMenuId === item.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: STRUCTURE_SIDEBAR_STYLES.menu,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: STRUCTURE_SIDEBAR_STYLES.menuItem,
                            onClick: ()=>{
                                onEditItem?.(item.id);
                                setOpenMenuId(null);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                                    lineNumber: 191,
                                    columnNumber: 29
                                }, this),
                                "편집"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 184,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: STRUCTURE_SIDEBAR_STYLES.menuItem,
                            onClick: ()=>{
                                onDeleteItem?.(item.id);
                                setOpenMenuId(null);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "w-4 h-4 text-red-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                                    lineNumber: 201,
                                    columnNumber: 29
                                }, this),
                                "삭제"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 194,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                    lineNumber: 183,
                    columnNumber: 21
                }, this),
                hasChildren && isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: item.children.map((child)=>renderStructureItem(child, level + 1))
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                    lineNumber: 209,
                    columnNumber: 21
                }, this)
            ]
        }, item.id, true, {
            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
            lineNumber: 137,
            columnNumber: 13
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: STRUCTURE_SIDEBAR_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_SIDEBAR_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                        className: STRUCTURE_SIDEBAR_STYLES.headerIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                        lineNumber: 221,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: STRUCTURE_SIDEBAR_STYLES.headerTitle,
                        children: "프로젝트 구조"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                        lineNumber: 222,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                lineNumber: 220,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_SIDEBAR_STYLES.actionSection,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>onAddItem?.('chapter'),
                    className: STRUCTURE_SIDEBAR_STYLES.addButton,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: STRUCTURE_SIDEBAR_STYLES.addButtonIcon
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 231,
                            columnNumber: 21
                        }, this),
                        "새 챕터 추가"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                    lineNumber: 227,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                lineNumber: 226,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_SIDEBAR_STYLES.treeContainer,
                children: structure.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-8 text-gray-500 dark:text-gray-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                            className: "w-12 h-12 mx-auto mb-3 opacity-50"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 240,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm",
                            children: "아직 구조가 없습니다"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 241,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs mt-1",
                            children: "새 챕터를 추가해보세요"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                            lineNumber: 242,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                    lineNumber: 239,
                    columnNumber: 21
                }, this) : structure.map((item)=>renderStructureItem(item))
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
                lineNumber: 237,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx",
        lineNumber: 218,
        columnNumber: 9
    }, this);
}, "GDu94z563SAJc6K7W/Uidgey54U=")), "GDu94z563SAJc6K7W/Uidgey54U=");
_c1 = StructureSidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "StructureSidebar$memo");
__turbopack_context__.k.register(_c1, "StructureSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CharacterSidebar": (()=>CharacterSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sword$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sword$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sword.js [app-client] (ecmascript) <export default as Sword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crown.js [app-client] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 인물 관리 전용 사이드바 스타일
const CHARACTER_SIDEBAR_STYLES = {
    container: 'w-64 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-r border-purple-200 dark:border-gray-700 p-4 h-full overflow-y-auto',
    header: 'flex items-center gap-3 mb-6 pb-4 border-b border-purple-200 dark:border-gray-700',
    headerIcon: 'w-6 h-6 text-purple-600 dark:text-purple-400',
    headerTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    // 검색 및 액션
    actionSection: 'mb-6 space-y-3',
    searchBox: 'w-full px-3 py-2 border border-purple-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 placeholder-gray-500',
    addButton: 'w-full flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium',
    addButtonIcon: 'w-4 h-4',
    // 인물 카드
    characterList: 'space-y-3',
    characterCard: 'bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-gray-700 transition-all hover:shadow-md',
    characterCardSelected: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600',
    characterHeader: 'flex items-center gap-3 mb-2',
    characterAvatar: 'w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-semibold',
    characterInfo: 'flex-1',
    characterName: 'font-medium text-gray-900 dark:text-gray-100 text-sm',
    characterRole: 'text-xs text-gray-500 dark:text-gray-400',
    characterMenu: 'w-6 h-6 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded',
    // 인물 상세
    characterDesc: 'text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2',
    characterStats: 'flex items-center gap-2 text-xs text-gray-500',
    // 역할별 아이콘
    roleIcon: 'w-4 h-4',
    // 빈 상태
    emptyState: 'text-center py-8 text-gray-500 dark:text-gray-400',
    emptyIcon: 'w-12 h-12 mx-auto mb-3 opacity-50',
    emptyText: 'text-sm',
    emptySubtext: 'text-xs mt-1'
};
// 역할별 아이콘 및 색상
const getRoleIcon = (role)=>{
    switch(role){
        case 'protagonist':
            return {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"],
                color: 'text-yellow-500'
            };
        case 'antagonist':
            return {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sword$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sword$3e$__["Sword"],
                color: 'text-red-500'
            };
        case 'supporting':
            return {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
                color: 'text-blue-500'
            };
        case 'minor':
            return {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"],
                color: 'text-gray-500'
            };
        default:
            return {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                color: 'text-gray-500'
            };
    }
};
// 역할별 한글 이름
const getRoleName = (role)=>{
    switch(role){
        case 'protagonist':
            return '주인공';
        case 'antagonist':
            return '적대자';
        case 'supporting':
            return '조연';
        case 'minor':
            return '단역';
        default:
            return '기타';
    }
};
const CharacterSidebar = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function CharacterSidebar({ projectId, characters, onAddCharacter, onEditCharacter, onDeleteCharacter, onSelectCharacter, selectedCharacterId }) {
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [openMenuId, setOpenMenuId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('CHARACTER_SIDEBAR', 'Rendering character sidebar', {
        projectId,
        characterCount: characters.length
    });
    // 검색 필터링
    const filteredCharacters = characters.filter((character)=>character.name.toLowerCase().includes(searchTerm.toLowerCase()) || character.description.toLowerCase().includes(searchTerm.toLowerCase()));
    // 메뉴 토글
    const toggleMenu = (characterId, event)=>{
        event.stopPropagation();
        setOpenMenuId(openMenuId === characterId ? null : characterId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: CHARACTER_SIDEBAR_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTER_SIDEBAR_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                        className: CHARACTER_SIDEBAR_STYLES.headerIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: CHARACTER_SIDEBAR_STYLES.headerTitle,
                        children: "인물 관리"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                        lineNumber: 137,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                lineNumber: 135,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTER_SIDEBAR_STYLES.actionSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                lineNumber: 143,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "인물 검색...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: `${CHARACTER_SIDEBAR_STYLES.searchBox} pl-10`
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                lineNumber: 144,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                        lineNumber: 142,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onAddCharacter,
                        className: CHARACTER_SIDEBAR_STYLES.addButton,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                className: CHARACTER_SIDEBAR_STYLES.addButtonIcon
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                lineNumber: 157,
                                columnNumber: 21
                            }, this),
                            "새 인물 추가"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                        lineNumber: 153,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                lineNumber: 141,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: CHARACTER_SIDEBAR_STYLES.characterList,
                children: filteredCharacters.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CHARACTER_SIDEBAR_STYLES.emptyState,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                            className: CHARACTER_SIDEBAR_STYLES.emptyIcon
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                            lineNumber: 166,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: CHARACTER_SIDEBAR_STYLES.emptyText,
                            children: searchTerm ? '검색 결과가 없습니다' : '아직 인물이 없습니다'
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                            lineNumber: 167,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: CHARACTER_SIDEBAR_STYLES.emptySubtext,
                            children: searchTerm ? '다른 검색어를 시도해보세요' : '새 인물을 추가해보세요'
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                            lineNumber: 170,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                    lineNumber: 165,
                    columnNumber: 21
                }, this) : filteredCharacters.map((character)=>{
                    const { icon: RoleIcon, color } = getRoleIcon(character.role);
                    const isSelected = selectedCharacterId === character.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${CHARACTER_SIDEBAR_STYLES.characterCard} ${isSelected ? CHARACTER_SIDEBAR_STYLES.characterCardSelected : ''} group cursor-pointer`,
                        onClick: ()=>onSelectCharacter?.(character.id),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTER_SIDEBAR_STYLES.characterHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTER_SIDEBAR_STYLES.characterAvatar,
                                        children: character.name.charAt(0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                        lineNumber: 188,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTER_SIDEBAR_STYLES.characterInfo,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: CHARACTER_SIDEBAR_STYLES.characterName,
                                                children: character.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                                lineNumber: 193,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: CHARACTER_SIDEBAR_STYLES.characterRole,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoleIcon, {
                                                        className: `inline w-3 h-3 mr-1 ${color}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 45
                                                    }, this),
                                                    getRoleName(character.role)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                                lineNumber: 196,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                        lineNumber: 192,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>toggleMenu(character.id, e),
                                        className: `${CHARACTER_SIDEBAR_STYLES.characterMenu} opacity-0 group-hover:opacity-100 transition-opacity`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {}, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                            lineNumber: 206,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                        lineNumber: 202,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                lineNumber: 187,
                                columnNumber: 33
                            }, this),
                            character.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTER_SIDEBAR_STYLES.characterDesc,
                                children: character.description
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                lineNumber: 212,
                                columnNumber: 37
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTER_SIDEBAR_STYLES.characterStats,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "관계 ",
                                            character.relationships.length,
                                            "개"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                        lineNumber: 219,
                                        columnNumber: 37
                                    }, this),
                                    character.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "• 노트 있음"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                        lineNumber: 220,
                                        columnNumber: 57
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                lineNumber: 218,
                                columnNumber: 33
                            }, this),
                            openMenuId === character.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-2 top-8 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-t-lg",
                                        onClick: ()=>{
                                            onEditCharacter?.(character.id);
                                            setOpenMenuId(null);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                                lineNumber: 233,
                                                columnNumber: 45
                                            }, this),
                                            "편집"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                        lineNumber: 226,
                                        columnNumber: 41
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-b-lg",
                                        onClick: ()=>{
                                            onDeleteCharacter?.(character.id);
                                            setOpenMenuId(null);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                                lineNumber: 243,
                                                columnNumber: 45
                                            }, this),
                                            "삭제"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                        lineNumber: 236,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                                lineNumber: 225,
                                columnNumber: 37
                            }, this)
                        ]
                    }, character.id, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                        lineNumber: 180,
                        columnNumber: 29
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
                lineNumber: 163,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx",
        lineNumber: 133,
        columnNumber: 9
    }, this);
}, "uaYi5by6Ht06zZMZ3dNM6QexMaA=")), "uaYi5by6Ht06zZMZ3dNM6QexMaA=");
_c1 = CharacterSidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "CharacterSidebar$memo");
__turbopack_context__.k.register(_c1, "CharacterSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "NoteSidebar": (()=>NoteSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 메모 관리 전용 사이드바 스타일
const NOTE_SIDEBAR_STYLES = {
    container: 'w-64 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border-r border-orange-200 dark:border-gray-700 p-4 h-full overflow-y-auto',
    header: 'flex items-center gap-3 mb-6 pb-4 border-b border-orange-200 dark:border-gray-700',
    headerIcon: 'w-6 h-6 text-orange-600 dark:text-orange-400',
    headerTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
    // 검색 및 필터
    actionSection: 'mb-6 space-y-3',
    searchBox: 'w-full px-3 py-2 border border-orange-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 placeholder-gray-500',
    filterButtons: 'flex gap-1 flex-wrap',
    filterButton: 'px-2 py-1 text-xs rounded-full border transition-colors',
    filterButtonActive: 'bg-orange-600 text-white border-orange-600',
    filterButtonInactive: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
    addButton: 'w-full flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium',
    addButtonIcon: 'w-4 h-4',
    // 메모 카드
    noteList: 'space-y-3',
    noteCard: 'bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-100 dark:border-gray-700 transition-all hover:shadow-md',
    noteCardSelected: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-600',
    noteCardPinned: 'ring-1 ring-orange-300 dark:ring-orange-600',
    noteHeader: 'flex items-start gap-2 mb-2',
    noteInfo: 'flex-1 min-w-0',
    noteTitle: 'font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-1',
    noteContent: 'text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2',
    noteMeta: 'flex items-center gap-2 text-xs text-gray-500',
    noteActions: 'flex gap-1',
    // 태그
    tagContainer: 'flex flex-wrap gap-1 mb-2',
    tag: 'inline-flex items-center px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full',
    // 우선순위 색상
    priorityDot: 'w-2 h-2 rounded-full',
    priorityHigh: 'bg-red-500',
    priorityMedium: 'bg-yellow-500',
    priorityLow: 'bg-green-500',
    // 카테고리 색상
    categoryDot: 'w-3 h-3 rounded-full',
    // 액션 버튼
    actionButton: 'w-5 h-5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded',
    pinButton: 'w-5 h-5 p-1 text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 rounded',
    menuButton: 'w-5 h-5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded',
    // 빈 상태
    emptyState: 'text-center py-8 text-gray-500 dark:text-gray-400',
    emptyIcon: 'w-12 h-12 mx-auto mb-3 opacity-50',
    emptyText: 'text-sm',
    emptySubtext: 'text-xs mt-1'
};
// 카테고리별 색상
const getCategoryColor = (category)=>{
    switch(category){
        case 'research':
            return 'bg-blue-500';
        case 'idea':
            return 'bg-yellow-500';
        case 'plot':
            return 'bg-purple-500';
        case 'character':
            return 'bg-pink-500';
        case 'dialogue':
            return 'bg-green-500';
        case 'other':
            return 'bg-gray-500';
        default:
            return 'bg-gray-500';
    }
};
// 카테고리별 한글 이름
const getCategoryName = (category)=>{
    switch(category){
        case 'research':
            return '자료';
        case 'idea':
            return '아이디어';
        case 'plot':
            return '플롯';
        case 'character':
            return '인물';
        case 'dialogue':
            return '대화';
        case 'other':
            return '기타';
        default:
            return '기타';
    }
};
// 시간 포맷팅
const formatTimeAgo = (date)=>{
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return `${Math.floor(diffDays / 30)}개월 전`;
};
const NoteSidebar = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function NoteSidebar({ projectId, notes, onAddNote, onEditNote, onDeleteNote, onSelectNote, onTogglePin, selectedNoteId }) {
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [openMenuId, setOpenMenuId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('NOTE_SIDEBAR', 'Rendering note sidebar', {
        projectId,
        noteCount: notes.length
    });
    // 필터링된 메모
    const filteredNotes = notes.filter((note)=>{
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()) || note.tags.some((tag)=>tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b)=>{
        // 고정된 메모가 먼저 오도록
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // 그 다음은 업데이트 시간 순
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
    // 카테고리 필터 버튼
    const categories = [
        {
            value: 'all',
            label: '전체'
        },
        {
            value: 'idea',
            label: '아이디어'
        },
        {
            value: 'plot',
            label: '플롯'
        },
        {
            value: 'character',
            label: '인물'
        },
        {
            value: 'research',
            label: '자료'
        },
        {
            value: 'dialogue',
            label: '대화'
        },
        {
            value: 'other',
            label: '기타'
        }
    ];
    // 메뉴 토글
    const toggleMenu = (noteId, event)=>{
        event.stopPropagation();
        setOpenMenuId(openMenuId === noteId ? null : noteId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: NOTE_SIDEBAR_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTE_SIDEBAR_STYLES.header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                        className: NOTE_SIDEBAR_STYLES.headerIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                        lineNumber: 191,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: NOTE_SIDEBAR_STYLES.headerTitle,
                        children: "메모 관리"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                        lineNumber: 192,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                lineNumber: 190,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTE_SIDEBAR_STYLES.actionSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 198,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "메모 검색...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: `${NOTE_SIDEBAR_STYLES.searchBox} pl-10`
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 199,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                        lineNumber: 197,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: NOTE_SIDEBAR_STYLES.filterButtons,
                        children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedCategory(category.value),
                                className: `${NOTE_SIDEBAR_STYLES.filterButton} ${selectedCategory === category.value ? NOTE_SIDEBAR_STYLES.filterButtonActive : NOTE_SIDEBAR_STYLES.filterButtonInactive}`,
                                children: category.label
                            }, category.value, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 211,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                        lineNumber: 209,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onAddNote,
                        className: NOTE_SIDEBAR_STYLES.addButton,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: NOTE_SIDEBAR_STYLES.addButtonIcon
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 228,
                                columnNumber: 21
                            }, this),
                            "새 메모 추가"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                        lineNumber: 224,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                lineNumber: 196,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: NOTE_SIDEBAR_STYLES.noteList,
                children: filteredNotes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: NOTE_SIDEBAR_STYLES.emptyState,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: NOTE_SIDEBAR_STYLES.emptyIcon
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                            lineNumber: 237,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: NOTE_SIDEBAR_STYLES.emptyText,
                            children: searchTerm || selectedCategory !== 'all' ? '검색 결과가 없습니다' : '아직 메모가 없습니다'
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                            lineNumber: 238,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: NOTE_SIDEBAR_STYLES.emptySubtext,
                            children: searchTerm || selectedCategory !== 'all' ? '다른 검색어나 카테고리를 시도해보세요' : '새 메모를 추가해보세요'
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                            lineNumber: 241,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                    lineNumber: 236,
                    columnNumber: 21
                }, this) : filteredNotes.map((note)=>{
                    const isSelected = selectedNoteId === note.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${NOTE_SIDEBAR_STYLES.noteCard} ${isSelected ? NOTE_SIDEBAR_STYLES.noteCardSelected : ''} ${note.isPinned ? NOTE_SIDEBAR_STYLES.noteCardPinned : ''} group cursor-pointer`,
                        onClick: ()=>onSelectNote?.(note.id),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTE_SIDEBAR_STYLES.noteHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTE_SIDEBAR_STYLES.noteInfo,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: NOTE_SIDEBAR_STYLES.noteTitle,
                                            children: [
                                                note.isPinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                    className: "inline w-3 h-3 mr-1 text-orange-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 63
                                                }, this),
                                                note.title
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                            lineNumber: 259,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 258,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTE_SIDEBAR_STYLES.noteActions,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    onTogglePin?.(note.id);
                                                },
                                                className: note.isPinned ? NOTE_SIDEBAR_STYLES.pinButton : NOTE_SIDEBAR_STYLES.actionButton,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                    className: note.isPinned ? 'fill-current' : ''
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                lineNumber: 266,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>toggleMenu(note.id, e),
                                                className: `${NOTE_SIDEBAR_STYLES.menuButton} opacity-0 group-hover:opacity-100 transition-opacity`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {}, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                lineNumber: 276,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 265,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 257,
                                columnNumber: 33
                            }, this),
                            note.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTE_SIDEBAR_STYLES.noteContent,
                                children: note.content
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 287,
                                columnNumber: 37
                            }, this),
                            note.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTE_SIDEBAR_STYLES.tagContainer,
                                children: [
                                    note.tags.slice(0, 3).map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: NOTE_SIDEBAR_STYLES.tag,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                    className: "w-2 h-2 mr-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 49
                                                }, this),
                                                tag
                                            ]
                                        }, tag, true, {
                                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                            lineNumber: 296,
                                            columnNumber: 45
                                        }, this)),
                                    note.tags.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: NOTE_SIDEBAR_STYLES.tag,
                                        children: [
                                            "+",
                                            note.tags.length - 3
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 302,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 294,
                                columnNumber: 37
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTE_SIDEBAR_STYLES.noteMeta,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${NOTE_SIDEBAR_STYLES.categoryDot} ${getCategoryColor(note.category)}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 311,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: getCategoryName(note.category)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 312,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${NOTE_SIDEBAR_STYLES.priorityDot} ${note.priority === 'high' ? NOTE_SIDEBAR_STYLES.priorityHigh : note.priority === 'medium' ? NOTE_SIDEBAR_STYLES.priorityMedium : NOTE_SIDEBAR_STYLES.priorityLow}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 313,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 317,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: formatTimeAgo(note.updatedAt)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 318,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 310,
                                columnNumber: 33
                            }, this),
                            openMenuId === note.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-2 top-8 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-t-lg",
                                        onClick: ()=>{
                                            onEditNote?.(note.id);
                                            setOpenMenuId(null);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                lineNumber: 331,
                                                columnNumber: 45
                                            }, this),
                                            "편집"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 324,
                                        columnNumber: 41
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-b-lg",
                                        onClick: ()=>{
                                            onDeleteNote?.(note.id);
                                            setOpenMenuId(null);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                                lineNumber: 341,
                                                columnNumber: 45
                                            }, this),
                                            "삭제"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                        lineNumber: 334,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                                lineNumber: 323,
                                columnNumber: 37
                            }, this)
                        ]
                    }, note.id, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                        lineNumber: 250,
                        columnNumber: 29
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
                lineNumber: 234,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx",
        lineNumber: 188,
        columnNumber: 9
    }, this);
}, "YjHd+Q8iVmuW5hqKQJZi7aZnLHg=")), "YjHd+Q8iVmuW5hqKQJZi7aZnLHg=");
_c1 = NoteSidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "NoteSidebar$memo");
__turbopack_context__.k.register(_c1, "NoteSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DynamicSidebar": (()=>DynamicSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$WritingSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$StructureSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$CharacterSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$NoteSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const DynamicSidebar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function DynamicSidebar({ projectId, currentView, writerStats, structure = [], characters = [], notes = [], onSetWordGoal, onAddStructureItem, onEditStructureItem, onDeleteStructureItem, onSelectStructureItem, onAddCharacter, onEditCharacter, onDeleteCharacter, onSelectCharacter, onAddNote, onEditNote, onDeleteNote, onSelectNote, onToggleNotePin, selectedStructureId, selectedCharacterId, selectedNoteId }) {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('DYNAMIC_SIDEBAR', 'Rendering dynamic sidebar', {
        projectId,
        currentView,
        hasWriterStats: !!writerStats,
        structureCount: structure.length,
        charactersCount: characters.length,
        notesCount: notes.length
    });
    // 뷰에 따른 사이드바 렌더링
    switch(currentView){
        case 'write':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$WritingSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WritingSidebar"], {
                projectId: projectId,
                stats: writerStats || {
                    wordCount: 0,
                    characterCount: 0,
                    paragraphCount: 0,
                    pageCount: 0,
                    readingTime: '0분',
                    typingSpeed: 0,
                    sessionWords: 0,
                    dailyGoal: 1000,
                    progressPercentage: 0
                },
                onSetGoal: onSetWordGoal
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx",
                lineNumber: 125,
                columnNumber: 17
            }, this);
        case 'structure':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$StructureSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StructureSidebar"], {
                projectId: projectId,
                structure: structure,
                onAddItem: onAddStructureItem,
                onEditItem: onEditStructureItem,
                onDeleteItem: onDeleteStructureItem,
                onSelectItem: onSelectStructureItem,
                selectedItemId: selectedStructureId
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx",
                lineNumber: 144,
                columnNumber: 17
            }, this);
        case 'characters':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$CharacterSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CharacterSidebar"], {
                projectId: projectId,
                characters: characters,
                onAddCharacter: onAddCharacter,
                onEditCharacter: onEditCharacter,
                onDeleteCharacter: onDeleteCharacter,
                onSelectCharacter: onSelectCharacter,
                selectedCharacterId: selectedCharacterId
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx",
                lineNumber: 157,
                columnNumber: 17
            }, this);
        case 'notes':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$NoteSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoteSidebar"], {
                projectId: projectId,
                notes: notes,
                onAddNote: onAddNote,
                onEditNote: onEditNote,
                onDeleteNote: onDeleteNote,
                onSelectNote: onSelectNote,
                onTogglePin: onToggleNotePin,
                selectedNoteId: selectedNoteId
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx",
                lineNumber: 170,
                columnNumber: 17
            }, this);
        // 기본값으로 WritingSidebar 사용
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$WritingSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WritingSidebar"], {
                projectId: projectId,
                stats: writerStats || {
                    wordCount: 0,
                    characterCount: 0,
                    paragraphCount: 0,
                    pageCount: 0,
                    readingTime: '0분',
                    typingSpeed: 0,
                    sessionWords: 0,
                    dailyGoal: 1000,
                    progressPercentage: 0
                },
                onSetGoal: onSetWordGoal
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx",
                lineNumber: 185,
                columnNumber: 17
            }, this);
    }
});
_c1 = DynamicSidebar;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "DynamicSidebar$memo");
__turbopack_context__.k.register(_c1, "DynamicSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$WritingSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/WritingSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$StructureSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/StructureSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$CharacterSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/CharacterSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$NoteSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/NoteSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$DynamicSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx [app-client] (ecmascript) <locals>");
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 Modularized ProjectEditor - 모듈화된 새로운 프로젝트 에디터
// 기존 1284줄 → 약 200줄로 축소, 단일 책임 원칙 준수
__turbopack_context__.s({
    "ProjectEditor": (()=>ProjectEditor),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$MarkdownEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStatsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ProjectHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ProjectHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$EditorTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/EditorTabBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$NewChapterModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/NewChapterModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDeleteDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ShareDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ShareDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/StructureView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/CharactersView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/NotesView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$SynopsisView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/SynopsisView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$IdeaView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/IdeaView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
// 🔥 모듈화된 hooks 및 services
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useUIState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$hooks$2f$useProjectEditorState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/hooks/useProjectEditorState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$DynamicSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$DynamicSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/sidebars/DynamicSidebar.tsx [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
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
;
;
;
;
;
const ProjectEditor = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function ProjectEditor({ projectId }) {
    _s();
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'ProjectEditor render started', {
        projectId
    });
    // 🔥 모듈화된 상태 관리
    const { isLoading, error, ...projectData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"])(projectId);
    const uiState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"])();
    const { state, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$hooks$2f$useProjectEditorState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectEditorState"])();
    // 🔥 저장 성공 처리
    const handleSaveSuccess = ()=>{
        actions.markAllTabsAsSaved();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'All tabs marked as saved');
    };
    // 🔥 로딩 상태 처리
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Container, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 60,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-slate-500 text-sm",
                            children: "프로젝트를 불러오는 중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 61,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 59,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 58,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
            lineNumber: 57,
            columnNumber: 13
        }, this);
    }
    // 🔥 에러 상태 처리
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Container, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-red-600 mb-4",
                            children: "오류"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 74,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-600",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 75,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 73,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 72,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
            lineNumber: 71,
            columnNumber: 13
        }, this);
    }
    // 🔥 현재 활성 탭 찾기
    const activeTab = state.tabs.find((tab)=>tab.id === state.activeTabId);
    // 🔥 뷰 렌더링 함수
    const renderCurrentView = ()=>{
        switch(state.currentView){
            case 'write':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$EditorTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorTabBar"], {
                                tabs: state.tabs,
                                activeTabId: state.activeTabId,
                                onTabClick: actions.setActiveTab,
                                onTabClose: actions.removeTab,
                                onNewTab: ()=>{
                                    const newTab = {
                                        id: `tab-${Date.now()}`,
                                        title: `새 탭 ${state.tabs.length}`,
                                        type: 'chapter',
                                        isActive: true,
                                        content: ''
                                    };
                                    actions.addTab(newTab);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 93,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkdownEditor"], {
                                    content: activeTab?.content || '',
                                    onChange: (content)=>{
                                        if (activeTab) {
                                            actions.updateTab(activeTab.id, {
                                                content,
                                                isDirty: true
                                            });
                                        }
                                    },
                                    isFocusMode: uiState?.isFocusMode || false
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                    lineNumber: 112,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 111,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 91,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 90,
                    columnNumber: 21
                }, this);
            case 'structure':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StructureView"], {
                    projectId: projectId
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 131,
                    columnNumber: 21
                }, this);
            case 'characters':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CharactersView"], {
                    projectId: projectId,
                    characters: [],
                    onCharactersChange: ()=>{}
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 138,
                    columnNumber: 21
                }, this);
            case 'notes':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotesView"], {
                    projectId: projectId
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 147,
                    columnNumber: 21
                }, this);
            case 'synopsis':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$SynopsisView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SynopsisView"], {
                    synopsisId: "default",
                    onBack: ()=>actions.setCurrentView('write')
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 154,
                    columnNumber: 21
                }, this);
            case 'idea':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$IdeaView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IdeaView"], {
                    ideaId: "default",
                    onBack: ()=>actions.setCurrentView('write')
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 162,
                    columnNumber: 21
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-500",
                        children: [
                            "알 수 없는 뷰: ",
                            state.currentView
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 171,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 170,
                    columnNumber: 21
                }, this);
        }
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Rendering with state', {
        currentView: state.currentView,
        activeTabId: state.activeTabId,
        tabsCount: state.tabs.length
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Container, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Header, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ProjectHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectHeader"], {
                    title: projectData?.title || '프로젝트',
                    onTitleChange: (title)=>{
                        projectData?.setTitle(title);
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Title changed', {
                            title
                        });
                    },
                    onBack: ()=>{
                        // TODO: 뒤로가기 로직
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Back button clicked');
                    },
                    sidebarCollapsed: state.collapsed,
                    onToggleSidebar: actions.toggleCollapsed,
                    showRightSidebar: state.showRightSidebar,
                    onToggleAISidebar: actions.toggleRightSidebar,
                    isFocusMode: uiState?.isFocusMode || false,
                    onToggleFocusMode: ()=>{
                        // TODO: 포커스 모드 토글 로직
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Focus mode toggled');
                    },
                    onSave: ()=>{
                        // TODO: 저장 로직
                        actions.markAllTabsAsSaved();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Save clicked');
                    },
                    onShare: actions.openShareDialog,
                    onDownload: ()=>{
                        // TODO: 다운로드 로직
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Download clicked');
                    },
                    onDelete: actions.openDeleteDialog
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 187,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 186,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Main, {
                children: [
                    !state.collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$sidebars$2f$DynamicSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DynamicSidebar"], {
                        projectId: projectId,
                        currentView: state.currentView,
                        writerStats: {
                            wordCount: projectData?.writerStats?.wordCount || 0,
                            characterCount: (projectData?.writerStats?.wordCount || 0) * 5,
                            paragraphCount: projectData?.writerStats?.paragraphCount || 0,
                            pageCount: Math.ceil((projectData?.writerStats?.wordCount || 0) / 250),
                            readingTime: typeof projectData?.writerStats?.readingTime === 'string' ? projectData.writerStats.readingTime : `${projectData?.writerStats?.readingTime || 0}분`,
                            typingSpeed: 0,
                            sessionWords: 0,
                            dailyGoal: 1000,
                            progressPercentage: 0 // TODO: 진행률 계산
                        },
                        structure: (projectData?.structure || []).map((item)=>({
                                id: item.id,
                                title: item.title,
                                type: item.type === 'section' ? 'folder' : item.type === 'act' ? 'folder' : item.type === 'idea' ? 'note' : item.type,
                                children: [],
                                wordCount: item.wordCount,
                                isExpanded: false
                            })),
                        characters: (projectData?.characters || []).map((char)=>({
                                id: char.id,
                                name: char.name,
                                role: char.role,
                                description: char.description || '',
                                relationships: [],
                                notes: char.notes || '',
                                avatarUrl: char.avatar
                            })),
                        notes: (projectData?.notes || []).map((note)=>({
                                id: note.id,
                                title: note.title,
                                content: note.content,
                                tags: note.tags || [],
                                category: 'other',
                                priority: 'medium',
                                createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
                                updatedAt: note.updatedAt ? new Date(note.updatedAt) : new Date(),
                                isPinned: false // TODO: 고정 상태 추가
                            })),
                        onSetWordGoal: (goal)=>{
                            projectData?.setWordGoal(goal);
                        },
                        onAddStructureItem: (type, parentId)=>{
                            // TODO: 구조 아이템 추가 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Add structure item', {
                                type,
                                parentId
                            });
                        },
                        onEditStructureItem: (id)=>{
                            // TODO: 구조 아이템 편집 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Edit structure item', {
                                id
                            });
                        },
                        onDeleteStructureItem: (id)=>{
                            // TODO: 구조 아이템 삭제 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Delete structure item', {
                                id
                            });
                        },
                        onSelectStructureItem: (id)=>{
                            // TODO: 구조 아이템 선택 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Select structure item', {
                                id
                            });
                        },
                        onAddCharacter: ()=>{
                            // TODO: 인물 추가 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Add character');
                        },
                        onEditCharacter: (id)=>{
                            // TODO: 인물 편집 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Edit character', {
                                id
                            });
                        },
                        onDeleteCharacter: (id)=>{
                            // TODO: 인물 삭제 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Delete character', {
                                id
                            });
                        },
                        onSelectCharacter: (id)=>{
                            // TODO: 인물 선택 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Select character', {
                                id
                            });
                        },
                        onAddNote: ()=>{
                            // TODO: 메모 추가 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Add note');
                        },
                        onEditNote: (id)=>{
                            // TODO: 메모 편집 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Edit note', {
                                id
                            });
                        },
                        onDeleteNote: (id)=>{
                            // TODO: 메모 삭제 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Delete note', {
                                id
                            });
                        },
                        onSelectNote: (id)=>{
                            // TODO: 메모 선택 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Select note', {
                                id
                            });
                        },
                        onToggleNotePin: (id)=>{
                            // TODO: 메모 고정 토글 로직
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Toggle note pin', {
                                id
                            });
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 224,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Content, {
                        children: renderCurrentView()
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 330,
                        columnNumber: 17
                    }, this),
                    state.showRightSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStatsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WriterStatsPanel"], {
                        showRightSidebar: state.showRightSidebar,
                        toggleRightSidebar: actions.toggleRightSidebar,
                        writerStats: projectData?.writerStats || {
                            wordCount: 0,
                            characterCount: 0,
                            paragraphCount: 0,
                            pageCount: 0,
                            readingTime: '0분',
                            typingSpeed: 0,
                            sessionWords: 0,
                            dailyGoal: 1000,
                            progressPercentage: 0
                        },
                        setWordGoal: (goal)=>{
                            projectData?.setWordGoal(goal);
                        },
                        currentText: activeTab?.content || '',
                        projectId: projectId
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 336,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 221,
                columnNumber: 13
            }, this),
            state.showDeleteDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDeleteDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDeleteDialog"], {
                isOpen: state.showDeleteDialog,
                projectTitle: projectData?.title || '프로젝트',
                onConfirm: ()=>{
                    // TODO: 프로젝트 삭제 로직
                    actions.closeDeleteDialog();
                },
                onCancel: actions.closeDeleteDialog
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 361,
                columnNumber: 17
            }, this),
            state.showShareDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ShareDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShareDialog"], {
                isOpen: state.showShareDialog,
                onClose: actions.closeShareDialog,
                projectId: projectId,
                projectTitle: projectData?.title || '프로젝트'
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 373,
                columnNumber: 17
            }, this),
            state.showNewChapterModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$NewChapterModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NewChapterModal"], {
                isOpen: state.showNewChapterModal,
                onClose: actions.closeNewChapterModal,
                onConfirm: (chapterData)=>{
                    // TODO: 새 챕터 생성 로직
                    actions.closeNewChapterModal();
                }
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 382,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShortcutHelp"], {}, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 393,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
        lineNumber: 184,
        columnNumber: 9
    }, this);
}, "aH41N7uGsTr9J5UoLzqKd4vGF6U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$hooks$2f$useProjectEditorState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectEditorState"]
    ];
})), "aH41N7uGsTr9J5UoLzqKd4vGF6U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$hooks$2f$useProjectEditorState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectEditorState"]
    ];
});
_c1 = ProjectEditor;
const __TURBOPACK__default__export__ = ProjectEditor;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProjectEditor$memo");
__turbopack_context__.k.register(_c1, "ProjectEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_renderer_components_projects_modules_00391ba3._.js.map