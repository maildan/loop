module.exports = {

"[project]/src/renderer/components/projects/modules/markdownEditor/services/MarkdownParserService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 MarkdownParser Service - 마크다운 구문 파싱 전담
// 기존 MarkdownEditor.tsx의 handleKeyDown 로직을 서비스로 분리
__turbopack_context__.s({
    "MarkdownParserService": (()=>MarkdownParserService),
    "markdownParserService": (()=>markdownParserService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ H1 applied');
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ H2 applied');
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ H3 applied');
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ Bullet list applied');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_PARSER', '✅ Ordered list applied');
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
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 ClipboardService - 클립보드 처리 전담 서비스
// 기존 MarkdownEditor.tsx의 중복된 클립보드 로직을 통합
__turbopack_context__.s({
    "ClipboardService": (()=>ClipboardService),
    "clipboardService": (()=>clipboardService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text copied successfully');
                return {
                    success: true,
                    data: text
                };
            } else {
                // 폴백: execCommand 방식
                return this.fallbackCopyText(text);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to copy text', error);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text pasted successfully');
            return {
                success: true,
                data: text
            };
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to paste text', error);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to handle image paste', error);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', `Processed ${successCount}/${imageFiles.length} images`);
            return {
                success: successCount > 0,
                data: `${successCount} images processed`
            };
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to handle image drop', error);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to copy selected text', error);
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text pasted to editor');
                return {
                    success: true,
                    data: result.data
                };
            }
            return result;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('CLIPBOARD_SERVICE', 'Failed to paste to editor', error);
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Image added to editor');
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CLIPBOARD_SERVICE', 'Text copied via fallback method');
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
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/handlers/KeyboardHandler.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 KeyboardHandler - 키보드 이벤트 처리 전담
// 기존 MarkdownEditor.tsx의 복잡한 키보드 로직을 분리
__turbopack_context__.s({
    "KeyboardHandler": (()=>KeyboardHandler),
    "keyboardHandler": (()=>KeyboardHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$MarkdownParserService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/MarkdownParserService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-ssr] (ecmascript)");
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
        const handled = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$MarkdownParserService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownParserService"].parseMarkdown(this.editor, textBefore, $from.pos);
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
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clipboardService"].copySelectedText(this.editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'Text copied via keyboard shortcut');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('KEYBOARD_HANDLER', 'Failed to copy text', error);
        }
    }
    // 🔥 붙여넣기 처리
    async handlePaste() {
        if (!this.editor) return;
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clipboardService"].pasteToEditor(this.editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'Text pasted via keyboard shortcut');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('KEYBOARD_HANDLER', 'Failed to paste text', error);
        }
    }
    // 🔥 저장 처리
    handleSave() {
        const saveEvent = new CustomEvent('project:save');
        window.dispatchEvent(saveEvent);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'Save triggered via keyboard shortcut');
    }
    // 🔥 ESC 키 처리 (포커스 모드 해제)
    handleEscape() {
        const exitFocusEvent = new CustomEvent('editor:exitFocus');
        window.dispatchEvent(exitFocusEvent);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('KEYBOARD_HANDLER', 'ESC pressed - exit focus mode');
    }
    // 🔥 전역 이벤트 리스너 시작
    startGlobalHandling() {
        if (this.globalHandlerActive) return;
        document.addEventListener('keydown', this.handleGlobalKeyDown);
        this.globalHandlerActive = true;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('KEYBOARD_HANDLER', 'Global keyboard handling started');
    }
    // 🔥 전역 이벤트 리스너 정지
    stopGlobalHandling() {
        if (!this.globalHandlerActive) return;
        document.removeEventListener('keydown', this.handleGlobalKeyDown);
        this.globalHandlerActive = false;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('KEYBOARD_HANDLER', 'Global keyboard handling stopped');
    }
    // 🔥 정리
    cleanup() {
        this.stopGlobalHandling();
        this.editor = null;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('KEYBOARD_HANDLER', 'Keyboard handler cleaned up');
    }
    // 🔥 Getter
    isGlobalHandlingActive() {
        return this.globalHandlerActive;
    }
}
;
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
                            fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                            lineNumber: 274,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
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
                                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
"[project]/src/renderer/components/projects/modules/markdownEditor/components/AdvancedNotionFeatures.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/renderer/components/projects/modules/markdownEditor/hooks/useTipTapEditor.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 useTipTapEditor Hook - TipTap 에디터 설정을 분리한 커스텀 훅
// 기존 MarkdownEditor.tsx의 복잡한 에디터 설정을 훅으로 추상화
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useTipTapEditor": (()=>useTipTapEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/starter-kit/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-placeholder/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-focus/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-typography/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-character-count/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-underline/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-image/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$KeyboardHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/handlers/KeyboardHandler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$SlashCommands$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/components/SlashCommands.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/components/AdvancedNotionFeatures.ts [app-ssr] (ecmascript)");
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
    const keyboardHandlerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isReadyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // 🔥 에디터 생성 및 설정
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"])({
        immediatelyRender: false,
        extensions: [
            // 🔥 기본 확장들
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$underline$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
            // 🔥 이미지 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$image$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                HTMLAttributes: {
                    class: 'rounded-lg shadow-md max-w-full h-auto my-4'
                },
                inline: false,
                allowBase64: true
            }),
            // 🔥 Placeholder 확장
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
            // 🔥 포커스 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$focus$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                className: 'has-focus',
                mode: 'all'
            }),
            // 🔥 타이포그래피 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$typography$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].configure({
                openDoubleQuote: '"',
                closeDoubleQuote: '"',
                openSingleQuote: "'",
                closeSingleQuote: "'",
                ellipsis: '...',
                emDash: '--'
            }),
            // 🔥 노션 스타일 확장들
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TaskList"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TaskItem"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Callout"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"],
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$AdvancedNotionFeatures$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Highlight"],
            // 🔥 슬래시 명령어 확장
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$SlashCommands$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SlashCommand"].configure({
                suggestion: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$SlashCommands$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["slashSuggestion"]
            }),
            // 🔥 문자 수 카운트
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$character$2d$count$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
        ],
        content,
        // 🔥 에디터 속성
        editorProps: {
            attributes: {
                class: `flex-1 p-6 prose max-w-none focus:outline-none text-gray-900 dark:text-gray-100 ${isFocusMode ? 'prose-lg' : ''}`,
                'data-placeholder': '이야기를 시작해보세요...'
            },
            // 🔥 키보드 핸들러 위임
            handleKeyDown: (view, event)=>{
                if (!keyboardHandlerRef.current) return false;
                return keyboardHandlerRef.current.handleEditorKeyDown(view, event);
            },
            // 🔥 클립보드 처리 위임
            handlePaste: (view, event)=>{
                const editorInstance = view.editor;
                if (!editorInstance || !event.clipboardData) return false;
                // 비동기 처리를 Promise로 처리 (반환값은 동기적)
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clipboardService"].handleImagePaste(editorInstance, event.clipboardData).then((result)=>{
                    if (result.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Image pasted successfully');
                    }
                }).catch((error)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('TIPTAP_EDITOR', 'Failed to paste image', error);
                });
                return false; // 기본 동작 허용
            },
            // 🔥 드래그앤드롭 처리는 별도 핸들러에서 관리
            handleDrop: ()=>false
        },
        // 🔥 이벤트 핸들러들
        onUpdate: ({ editor })=>{
            const newContent = editor.getHTML();
            onChange(newContent);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Content updated', {
                wordCount: editor.storage.characterCount?.words() || 0
            });
        },
        onCreate: ({ editor })=>{
            // 키보드 핸들러 초기화
            keyboardHandlerRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$KeyboardHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KeyboardHandler"](editor);
            keyboardHandlerRef.current.startGlobalHandling();
            isReadyRef.current = true;
            onReady?.();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TIPTAP_EDITOR', 'Editor created successfully');
        },
        onFocus: ({ editor })=>{
            onFocus?.();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor focused');
        },
        onBlur: ({ editor })=>{
            onBlur?.();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor blurred');
        },
        onDestroy: ()=>{
            if (keyboardHandlerRef.current) {
                keyboardHandlerRef.current.cleanup();
                keyboardHandlerRef.current = null;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TIPTAP_EDITOR', 'Editor destroyed');
        }
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
const __TURBOPACK__default__export__ = useTipTapEditor;
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/handlers/DragDropHandler.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 DragDropHandler - 드래그앤드롭 이벤트 처리 전담
// 기존 MarkdownEditor.tsx의 복잡한 드래그앤드롭 로직을 분리
__turbopack_context__.s({
    "DragDropHandler": (()=>DragDropHandler),
    "dragDropHandler": (()=>DragDropHandler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-ssr] (ecmascript)");
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Event listeners attached');
    }
    // 🔥 이벤트 리스너 정리
    cleanup() {
        if (!this.element) return;
        this.element.removeEventListener('dragenter', this.handleDragEnter);
        this.element.removeEventListener('dragover', this.handleDragOver);
        this.element.removeEventListener('dragleave', this.handleDragLeave);
        this.element.removeEventListener('drop', this.handleDrop);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Event listeners cleaned up');
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Drag enter detected');
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('DRAG_DROP_HANDLER', 'Drag leave detected');
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('DRAG_DROP_HANDLER', `Processing ${files.length} dropped files`);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clipboardService"].handleImageDrop(this.editor, files);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('DRAG_DROP_HANDLER', 'Files processed successfully');
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('DRAG_DROP_HANDLER', 'File processing failed', result.error);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('DRAG_DROP_HANDLER', 'Error processing dropped files', error);
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
                    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clipboardService"].handleImageDrop(editor, files);
                    if (result.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('DRAG_DROP_HANDLER', 'Files uploaded via file picker');
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
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 EditorBubbleMenu - 선택 시 나타나는 포맷팅 메뉴 컴포넌트
// 기존 MarkdownEditor.tsx의 BubbleMenu JSX를 분리
__turbopack_context__.s({
    "EditorBubbleMenu": (()=>EditorBubbleMenu),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bold.js [app-ssr] (ecmascript) <export default as Bold>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/italic.js [app-ssr] (ecmascript) <export default as Italic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/underline.js [app-ssr] (ecmascript) <export default as Underline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/strikethrough.js [app-ssr] (ecmascript) <export default as Strikethrough>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-ssr] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-ssr] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/quote.js [app-ssr] (ecmascript) <export default as Quote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard.js [app-ssr] (ecmascript) <export default as Clipboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/services/ClipboardService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/handlers/DragDropHandler.ts [app-ssr] (ecmascript)");
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DragDropHandler"].uploadFromFilePicker(editor);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Image upload initiated');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('BUBBLE_MENU', 'Failed to upload image', error);
        }
    };
    // 🔥 클립보드 핸들러들
    const handleCopy = async ()=>{
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clipboardService"].copySelectedText(editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Text copied to clipboard');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('BUBBLE_MENU', 'Failed to copy text', error);
        }
    };
    const handlePaste = async ()=>{
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$services$2f$ClipboardService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clipboardService"].pasteToEditor(editor);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Text pasted from clipboard');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('BUBBLE_MENU', 'Failed to paste text', error);
        }
    };
    // 🔥 링크 핸들러 (TODO: 링크 다이얼로그 구현 필요)
    const handleLink = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('BUBBLE_MENU', 'Link feature - dialog implementation needed');
    // TODO: 링크 다이얼로그 모달 구현
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BubbleMenu"], {
        editor: editor,
        className: BUBBLE_STYLES.bubble,
        shouldShow: ({ from, to })=>from !== to,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleBold,
                className: editor.isActive('bold') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "볼드 (Ctrl+B)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleItalic,
                className: editor.isActive('italic') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "이탤릭 (Ctrl+I)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleUnderline,
                className: editor.isActive('underline') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "언더라인 (Ctrl+U)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleStrike,
                className: editor.isActive('strike') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "취소선 (Ctrl+Shift+S)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$strikethrough$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Strikethrough$3e$__["Strikethrough"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 143,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleCode,
                className: editor.isActive('code') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "인라인 코드 (Ctrl+`)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 155,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleLink,
                className: editor.isActive('link') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "링크 추가",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleQuote,
                className: editor.isActive('blockquote') ? BUBBLE_STYLES.activeButton : BUBBLE_STYLES.button,
                title: "인용구",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$quote$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Quote$3e$__["Quote"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 176,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleImageAdd,
                className: BUBBLE_STYLES.button,
                title: "이미지 추가",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleCopy,
                className: BUBBLE_STYLES.button,
                title: "선택한 텍스트 복사",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handlePaste,
                className: BUBBLE_STYLES.button,
                title: "클립보드에서 붙여넣기",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__["Clipboard"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: BUBBLE_STYLES.divider
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx",
                lineNumber: 206,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleHeading,
                className: BUBBLE_STYLES.button,
                title: "헤딩 설정",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
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
const __TURBOPACK__default__export__ = EditorBubbleMenu;
}}),
"[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 Modularized MarkdownEditor - 모듈화된 새로운 에디터
// 기존 777줄 → 약 100줄로 축소, 단일 책임 원칙 준수
__turbopack_context__.s({
    "MarkdownEditor": (()=>MarkdownEditor),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$hooks$2f$useTipTapEditor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/hooks/useTipTapEditor.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/handlers/DragDropHandler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$EditorBubbleMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/components/EditorBubbleMenu.tsx [app-ssr] (ecmascript)");
'use client';
;
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
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isReady, setIsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragHandlerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 모듈화된 TipTap 에디터 훅 사용
    const { editor, wordCount, characterCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$hooks$2f$useTipTapEditor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTipTapEditor"])({
        content,
        onChange,
        isFocusMode,
        onReady: ()=>{
            setIsReady(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('MARKDOWN_EDITOR', 'Editor ready');
        },
        onFocus: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_EDITOR', 'Editor focused');
        },
        onBlur: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_EDITOR', 'Editor blurred');
        }
    });
    // 🔥 드래그앤드롭 핸들러 초기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!editor || !isReady) return;
        dragHandlerRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$handlers$2f$DragDropHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DragDropHandler"](editor, (state)=>setIsDragOver(state.isDragOver ?? false));
        return ()=>{
            if (dragHandlerRef.current) {
                dragHandlerRef.current.cleanup();
                dragHandlerRef.current = null;
            }
        };
    }, [
        editor,
        isReady
    ]);
    // 🔥 외부 content 변경 시 에디터 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [
        content,
        editor
    ]);
    // 🔥 로딩 중 표시
    if (!isReady || !editor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: EDITOR_STYLES.container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: EDITOR_STYLES.loading,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                            lineNumber: 81,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('MARKDOWN_EDITOR', 'Rendering editor', {
        wordCount,
        characterCount,
        isDragOver,
        isFocusMode
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${EDITOR_STYLES.container} ${isDragOver ? 'drag-over' : ''}`,
        children: [
            isDragOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: EDITOR_STYLES.dragOverlay,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$components$2f$EditorBubbleMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditorBubbleMenu"], {
                editor: editor
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                lineNumber: 108,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["EditorContent"], {
                editor: editor
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx",
                lineNumber: 111,
                columnNumber: 13
            }, this),
            ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
const __TURBOPACK__default__export__ = MarkdownEditor;
}}),
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
"[project]/src/renderer/components/projects/components/EditorTabBar.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditorTabBar": (()=>EditorTabBar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const TAB_STYLES = {
    container: 'flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative',
    tabsWrapper: 'flex-1 flex overflow-x-auto scrollbar-hide',
    tab: 'flex items-center gap-2 px-4 py-2 text-sm border-r border-gray-200 dark:border-gray-700 cursor-pointer select-none transition-all duration-150 min-w-[120px] max-w-[200px] group relative',
    activeTab: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
    inactiveTab: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750',
    dragOver: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600',
    tabIcon: 'text-xs',
    tabTitle: 'flex-1 truncate font-medium',
    closeButton: 'opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition-all duration-150',
    closeButtonVisible: 'opacity-100',
    newTabButton: 'px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150',
    contextMenu: 'absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[180px]',
    contextMenuItem: 'px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2',
    contextMenuSeparator: 'border-t border-gray-200 dark:border-gray-600 my-1'
};
const EditorTabBar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function EditorTabBar({ tabs, activeTabId, onTabClick, onTabClose, onNewTab, onTabReorder }) {
    const [draggedTabId, setDraggedTabId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOverTabId, setDragOverTabId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 탭 상태 변경 시 로깅으로 디버깅
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('EDITOR_TAB_BAR', 'Tabs updated', {
            tabCount: tabs.length,
            activeTabId,
            tabIds: tabs.map((tab)=>tab.id)
        });
    }, [
        tabs,
        activeTabId
    ]);
    // 🔥 안정적인 탭 배열 보장
    const stableTabs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>{
        return tabs.filter((tab)=>tab && tab.id); // null/undefined 탭 필터링
    }, [
        tabs
    ]);
    const [contextMenu, setContextMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        x: 0,
        y: 0,
        tabId: null
    });
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 🔥 드래그 앤 드롭 핸들러들
    const handleDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, tabId)=>{
        setDraggedTabId(tabId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tabId);
        // 드래그 중 스타일링을 위한 투명도 설정
        const target = e.currentTarget;
        target.style.opacity = '0.5';
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TAB_BAR', 'Drag started', {
            tabId
        });
    }, []);
    const handleDragEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const target = e.currentTarget;
        target.style.opacity = '1';
        setDraggedTabId(null);
        setDragOverTabId(null);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TAB_BAR', 'Drag ended');
    }, []);
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, tabId)=>{
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedTabId && draggedTabId !== tabId) {
            setDragOverTabId(tabId);
        }
    }, [
        draggedTabId
    ]);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setDragOverTabId(null);
    }, []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, targetTabId)=>{
        e.preventDefault();
        if (!draggedTabId || draggedTabId === targetTabId) return;
        const fromIndex = tabs.findIndex((tab)=>tab.id === draggedTabId);
        const toIndex = tabs.findIndex((tab)=>tab.id === targetTabId);
        if (fromIndex !== -1 && toIndex !== -1 && onTabReorder) {
            onTabReorder(fromIndex, toIndex);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TAB_BAR', 'Tab reordered', {
                from: fromIndex,
                to: toIndex,
                draggedTabId,
                targetTabId
            });
        }
        setDraggedTabId(null);
        setDragOverTabId(null);
    }, [
        draggedTabId,
        tabs,
        onTabReorder
    ]);
    // 🔥 컨텍스트 메뉴 핸들러들
    const handleContextMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, tabId)=>{
        e.preventDefault();
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setContextMenu({
            isOpen: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            tabId
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('TAB_BAR', 'Context menu opened', {
            tabId
        });
    }, []);
    const closeContextMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setContextMenu({
            isOpen: false,
            x: 0,
            y: 0,
            tabId: null
        });
    }, []);
    const handleCloseOtherTabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!contextMenu.tabId) return;
        tabs.forEach((tab)=>{
            if (tab.id !== contextMenu.tabId && tab.id !== 'main') {
                onTabClose(tab.id);
            }
        });
        closeContextMenu();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TAB_BAR', 'Closed other tabs', {
            keepTabId: contextMenu.tabId
        });
    }, [
        contextMenu.tabId,
        tabs,
        onTabClose,
        closeContextMenu
    ]);
    const handleCloseTabsToRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!contextMenu.tabId) return;
        const currentIndex = tabs.findIndex((tab)=>tab.id === contextMenu.tabId);
        if (currentIndex === -1) return;
        tabs.slice(currentIndex + 1).forEach((tab)=>{
            if (tab.id !== 'main') {
                onTabClose(tab.id);
            }
        });
        closeContextMenu();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('TAB_BAR', 'Closed tabs to right', {
            fromTabId: contextMenu.tabId
        });
    }, [
        contextMenu.tabId,
        tabs,
        onTabClose,
        closeContextMenu
    ]);
    // 🔥 탭 닫기 핸들러
    const handleTabCloseClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e, tabId)=>{
        e.preventDefault();
        e.stopPropagation();
        onTabClose(tabId);
    }, [
        onTabClose
    ]);
    // 🔥 탭 타입에 따른 아이콘 반환
    const getTabIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type)=>{
        const iconMap = {
            main: '📝',
            chapter: '📖'
        };
        return iconMap[type] || '📄';
    }, []);
    // 🔥 전역 클릭 시 컨텍스트 메뉴 닫기
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        const handleGlobalClick = ()=>closeContextMenu();
        if (contextMenu.isOpen) {
            document.addEventListener('click', handleGlobalClick);
            return ()=>document.removeEventListener('click', handleGlobalClick);
        }
    }, [
        contextMenu.isOpen,
        closeContextMenu
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: TAB_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: TAB_STYLES.tabsWrapper,
                children: stableTabs.map((tab, index)=>{
                    const isActive = tab.id === activeTabId;
                    const isDragOver = dragOverTabId === tab.id;
                    const canClose = tab.id !== 'main'; // 메인 탭은 닫을 수 없음
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        draggable: true,
                        className: `
                ${TAB_STYLES.tab}
                ${isActive ? TAB_STYLES.activeTab : TAB_STYLES.inactiveTab}
                ${isDragOver ? TAB_STYLES.dragOver : ''}
              `,
                        onClick: ()=>onTabClick(tab.id),
                        onContextMenu: (e)=>handleContextMenu(e, tab.id),
                        onDragStart: (e)=>handleDragStart(e, tab.id),
                        onDragEnd: handleDragEnd,
                        onDragOver: (e)=>handleDragOver(e, tab.id),
                        onDragLeave: handleDragLeave,
                        onDrop: (e)=>handleDrop(e, tab.id),
                        title: tab.title,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: TAB_STYLES.tabIcon,
                                children: getTabIcon(tab.type)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                                lineNumber: 231,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: TAB_STYLES.tabTitle,
                                children: tab.title
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                                lineNumber: 235,
                                columnNumber: 29
                            }, this),
                            tab.isDirty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-orange-500 text-xs",
                                children: "●"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                                lineNumber: 240,
                                columnNumber: 33
                            }, this),
                            canClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `
                    ${TAB_STYLES.closeButton}
                    ${isActive ? TAB_STYLES.closeButtonVisible : ''}
                  `,
                                onClick: (e)=>handleTabCloseClick(e, tab.id),
                                title: "탭 닫기",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 12
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                                    lineNumber: 252,
                                    columnNumber: 37
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                                lineNumber: 244,
                                columnNumber: 33
                            }, this)
                        ]
                    }, `${tab.id}-${index}`, true, {
                        fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                        lineNumber: 214,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                lineNumber: 207,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: TAB_STYLES.newTabButton,
                onClick: onNewTab,
                title: "새 챕터 추가",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                    lineNumber: 265,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                lineNumber: 260,
                columnNumber: 13
            }, this),
            contextMenu.isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: TAB_STYLES.contextMenu,
                style: {
                    left: contextMenu.x,
                    top: contextMenu.y
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: TAB_STYLES.contextMenuItem,
                        onClick: handleCloseOtherTabs,
                        children: "다른 탭 모두 닫기"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                        lineNumber: 277,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: TAB_STYLES.contextMenuItem,
                        onClick: handleCloseTabsToRight,
                        children: "오른쪽 탭 모두 닫기"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                        lineNumber: 284,
                        columnNumber: 21
                    }, this),
                    contextMenu.tabId !== 'main' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: TAB_STYLES.contextMenuSeparator
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                                lineNumber: 293,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: TAB_STYLES.contextMenuItem,
                                onClick: ()=>{
                                    if (contextMenu.tabId) {
                                        onTabClose(contextMenu.tabId);
                                    }
                                    closeContextMenu();
                                },
                                children: "이 탭 닫기"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                                lineNumber: 294,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
                lineNumber: 270,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/components/EditorTabBar.tsx",
        lineNumber: 206,
        columnNumber: 9
    }, this);
});
}}),
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
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            structures: state.structures,
            currentEditor: state.currentEditor
        })
}));
const __TURBOPACK__default__export__ = useStructureStore;
}}),
"[project]/src/renderer/components/projects/components/ConfirmDialog.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ConfirmDialog": (()=>ConfirmDialog)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
'use client';
;
;
// 🔥 범용 확인 다이얼로그 스타일
const CONFIRM_DIALOG_STYLES = {
    overlay: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
    dialog: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden',
    header: 'flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-700',
    icon: 'w-8 h-8 text-red-500 flex-shrink-0',
    headerText: 'flex-1',
    title: 'text-lg font-bold text-slate-900 dark:text-slate-100',
    message: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
    closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
    content: 'p-6',
    description: 'text-slate-700 dark:text-slate-300 leading-relaxed mb-4',
    itemName: 'font-semibold text-slate-900 dark:text-slate-100',
    warning: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200',
    footer: 'flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700',
    cancelButton: 'px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors',
    confirmButton: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium'
};
function ConfirmDialog({ isOpen, title, message, itemName, warning, confirmText = "삭제", cancelText = "취소", onConfirm, onCancel }) {
    if (!isOpen) return null;
    const handleOverlayClick = (event)=>{
        if (event.target === event.currentTarget) {
            onCancel();
        }
    };
    const handleEscapeKey = (event)=>{
        if (event.key === 'Escape') {
            onCancel();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: CONFIRM_DIALOG_STYLES.overlay,
        onClick: handleOverlayClick,
        onKeyDown: handleEscapeKey,
        tabIndex: -1,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: CONFIRM_DIALOG_STYLES.dialog,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CONFIRM_DIALOG_STYLES.header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: CONFIRM_DIALOG_STYLES.icon
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                            lineNumber: 72,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CONFIRM_DIALOG_STYLES.headerText,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: CONFIRM_DIALOG_STYLES.title,
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                                    lineNumber: 74,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CONFIRM_DIALOG_STYLES.message,
                                    children: "신중하게 확인해주세요"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                                    lineNumber: 77,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                            lineNumber: 73,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: CONFIRM_DIALOG_STYLES.closeButton,
                            type: "button",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                                lineNumber: 86,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                            lineNumber: 81,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                    lineNumber: 71,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CONFIRM_DIALOG_STYLES.content,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: CONFIRM_DIALOG_STYLES.description,
                            children: [
                                message,
                                itemName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: CONFIRM_DIALOG_STYLES.itemName,
                                            children: [
                                                '"',
                                                itemName,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                                            lineNumber: 97,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                            lineNumber: 92,
                            columnNumber: 21
                        }, this),
                        warning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: CONFIRM_DIALOG_STYLES.warning,
                            children: warning
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                            lineNumber: 105,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                    lineNumber: 91,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: CONFIRM_DIALOG_STYLES.footer,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: CONFIRM_DIALOG_STYLES.cancelButton,
                            type: "button",
                            children: cancelText
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                            lineNumber: 113,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onConfirm,
                            className: CONFIRM_DIALOG_STYLES.confirmButton,
                            type: "button",
                            children: confirmText
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                            lineNumber: 120,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
                    lineNumber: 112,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
            lineNumber: 69,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/components/ConfirmDialog.tsx",
        lineNumber: 63,
        columnNumber: 9
    }, this);
}
}}),
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
'use client';
;
;
;
;
;
;
// 🔥 기가차드 작가 친화적 구조 스타일
const STRUCTURE_STYLES = {
    container: 'flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800',
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
    chapter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"],
    synopsis: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
    idea: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"]
};
// 추가 메뉴 아이템
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
        label: '아이디어',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bookmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bookmark$3e$__["Bookmark"],
        description: '창작 아이디어'
    }
];
// 🔥 빈 배열 상수 - 참조 안정성 보장
const EMPTY_STRUCTURES = [];
const StructureView = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function StructureView({ projectId, onNavigateToChapterEdit, onNavigateToSynopsisEdit, onNavigateToIdeaEdit, onAddNewChapter }) {
    // 🔥 Zustand 스토어 사용 - 참조 안정성을 위한 최적화
    const structures = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>{
        const projectStructures = state.structures[projectId];
        return projectStructures || EMPTY_STRUCTURES;
    });
    const addStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.addStructureItem);
    const updateStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.updateStructureItem);
    const deleteStructureItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.deleteStructureItem);
    const setCurrentEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStructureStore"])((state)=>state.setCurrentEditor);
    const [showAddMenu, setShowAddMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editTitle, setEditTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 삭제 확인 다이얼로그
    const [itemToDelete, setItemToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // 🔥 삭제할 아이템 정보
    // 🔥 강제 리렌더링을 위한 상태
    const [, forceUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const triggerUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        forceUpdate({});
    }, []);
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
            const chapterStructures = structures.filter((item)=>item.type === 'chapter');
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
    }, [
        projectId,
        addStructureItem,
        setCurrentEditor,
        onAddNewChapter,
        onNavigateToIdeaEdit,
        onNavigateToSynopsisEdit
    ]);
    const handleItemClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((item)=>{
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
    }, [
        projectId,
        setCurrentEditor,
        onNavigateToChapterEdit,
        onNavigateToIdeaEdit,
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
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: STRUCTURE_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: STRUCTURE_STYLES.structureList,
                    children: [
                        structures.map((item)=>{
                            const IconComponent = TYPE_ICONS[item.type] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"];
                            const isEditing = editingId === item.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: STRUCTURE_STYLES.structureItem,
                                onClick: ()=>handleItemClick(item),
                                style: {
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                        className: STRUCTURE_STYLES.itemIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                        lineNumber: 336,
                                        columnNumber: 17
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
                                            lineNumber: 339,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: STRUCTURE_STYLES.itemTitle,
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                    lineNumber: 368,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                                lineNumber: 359,
                                                columnNumber: 19
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
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "새 항목 추가"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 397,
                                            columnNumber: 15
                                        }, this),
                                        showAddMenu ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
                                            lineNumber: 398,
                                            columnNumber: 30
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
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
                                                    lineNumber: 413,
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
                                                            lineNumber: 415,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                lineNumber: 431,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/StructureView.tsx",
        lineNumber: 313,
        columnNumber: 5
    }, this);
});
;
}}),
"[project]/src/renderer/hooks/useLongPress.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 롱프레스 훅 - 간단하고 확실한 구현
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useLongPress": (()=>useLongPress)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
;
;
function useLongPress({ onLongPress, onShortPress, delay = 600 }) {
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isLongPressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isPressingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (isPressingRef.current) return;
        isPressingRef.current = true;
        isLongPressRef.current = false;
        // 롱프레스 타이머 시작
        timeoutRef.current = setTimeout(()=>{
            if (isPressingRef.current) {
                isLongPressRef.current = true;
                onLongPress();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '롱프레스 실행됨!');
            }
        }, delay);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '롱프레스 시작', {
            delay
        });
    }, [
        onLongPress,
        delay
    ]);
    const endPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '숏프레스 실행됨!');
        }
        isLongPressRef.current = false;
    }, [
        onShortPress
    ]);
    const cancelPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        isPressingRef.current = false;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        isLongPressRef.current = false;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('LONGPRESS', '롱프레스 취소됨');
    }, []);
    // 마우스 이벤트 핸들러
    const onMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        if (event.button !== 0) return; // 왼쪽 클릭만
        event.preventDefault();
        startPress();
    }, [
        startPress
    ]);
    const onMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        event.preventDefault();
        endPress();
    }, [
        endPress
    ]);
    const onMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        cancelPress();
    }, [
        cancelPress
    ]);
    // 터치 이벤트 핸들러
    const onTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        if (event.touches.length > 1) return; // 단일 터치만
        event.preventDefault();
        startPress();
    }, [
        startPress
    ]);
    const onTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        event.preventDefault();
        endPress();
    }, [
        endPress
    ]);
    const onTouchCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        cancelPress();
    }, [
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
const __TURBOPACK__default__export__ = useLongPress;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useLongPress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/hooks/useLongPress.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDialog.tsx [app-ssr] (ecmascript)"); // 🔥 ConfirmDialog 추가
'use client';
;
;
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
function CharactersView({ projectId, characters, onCharactersChange }) {
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Character saved', {
                    id: result.data.id
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
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.role || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "역할을 설정해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 226,
                                        columnNumber: 36
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 223,
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
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.description || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터 설명을 추가해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 232,
                                        columnNumber: 43
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 231,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 222,
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
                                    lineNumber: 242,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.appearance || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "외모를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 244,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 243,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 241,
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
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.age || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "나이를 설정해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 250,
                                        columnNumber: 35
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 247,
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
                                    lineNumber: 254,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.occupation || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "직업을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 256,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 255,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 253,
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
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.birthplace || character.residence ? `${character.birthplace || '미기록'} / ${character.residence || '미기록'}` : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "출신지와 거주지를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 264,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 259,
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
                                    lineNumber: 269,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.family || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "가족 관계를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 271,
                                        columnNumber: 38
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 270,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 268,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 240,
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
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.personality || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "성격을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 283,
                                        columnNumber: 43
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 280,
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
                                    lineNumber: 287,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.background || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터 배경을 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 289,
                                        columnNumber: 42
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 286,
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
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: CHARACTERS_STYLES.fieldValue,
                                    children: character.goals || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: CHARACTERS_STYLES.fieldEmpty,
                                        children: "캐릭터의 목표를 기록해주세요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 295,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 294,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 279,
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
                                    lineNumber: 312,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CHARACTERS_STYLES.subtitle,
                                    children: "이야기 속 캐릭터들의 상세한 프로필을 관리하세요. 체계적인 캐릭터 설정으로 더욱 생생한 스토리를 만들어보세요."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 311,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 310,
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
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.total
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 324,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "총 인물"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 322,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 328,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.main
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "주요 인물"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: CHARACTERS_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                        className: CHARACTERS_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statValue,
                                        children: stats.detailed
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.statLabel,
                                        children: "상세 설정"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 321,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 309,
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
                                    lineNumber: 347,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: CHARACTERS_STYLES.emptyTitle,
                                    children: "첫 번째 인물을 만들어보세요"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 348,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: CHARACTERS_STYLES.emptyDescription,
                                    children: "매력적인 캐릭터들이 당신의 이야기를 더욱 생동감 있게 만들어줄 것입니다. 주인공부터 조연까지, 각자의 특별한 이야기를 담아보세요."
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 349,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddCharacter,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary} mt-6`,
                                    children: "첫 인물 만들기"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 353,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 346,
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
                                    // 🔥 Long press 핸들러 - 캐릭터 편집 뷰로 이동
                                    const longPressHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useLongPress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLongPress"])({
                                        onLongPress: ()=>{
                                            handleEditStart(character);
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('CHARACTERS_VIEW', 'Long press detected - entering edit mode', {
                                                name: character.name
                                            });
                                        },
                                        delay: 500 // 500ms
                                    });
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: CHARACTERS_STYLES.characterCard,
                                        onClick: handleCharacterClick,
                                        onDoubleClick: handleCharacterDoubleClick,
                                        ...longPressHandlers,
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
                                                                lineNumber: 403,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 395,
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
                                                                lineNumber: 413,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 394,
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
                                                            lineNumber: 419,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: CHARACTERS_STYLES.characterName,
                                                            children: character.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 422,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: CHARACTERS_STYLES.characterRole,
                                                            children: character.role
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 423,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 418,
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
                                                                    lineNumber: 435,
                                                                    columnNumber: 31
                                                                }, this),
                                                                label
                                                            ]
                                                        }, id, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                                    lineNumber: 427,
                                                    columnNumber: 25
                                                }, this),
                                                renderTabContent(character, currentTab)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 392,
                                            columnNumber: 23
                                        }, this)
                                    }, character.id, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 385,
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
                                            lineNumber: 453,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: CHARACTERS_STYLES.addButtonText,
                                            children: "새 인물 추가"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 454,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 449,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 361,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                        lineNumber: 343,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 342,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 341,
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
                                    lineNumber: 467,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditCancel,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                        lineNumber: 471,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 470,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 466,
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
                                                    lineNumber: 478,
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
                                                    lineNumber: 479,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 477,
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
                                                    lineNumber: 489,
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
                                                    lineNumber: 490,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 488,
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
                                                    lineNumber: 500,
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
                                                    lineNumber: 501,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 499,
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
                                                    lineNumber: 511,
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
                                                    lineNumber: 512,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 510,
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
                                                    lineNumber: 522,
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
                                                    lineNumber: 523,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 521,
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
                                                    lineNumber: 533,
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
                                                    lineNumber: 534,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 532,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 476,
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
                                                    lineNumber: 546,
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
                                                    lineNumber: 547,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 545,
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
                                                    lineNumber: 557,
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
                                                    lineNumber: 558,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 556,
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
                                                    lineNumber: 568,
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
                                                    lineNumber: 569,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 567,
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
                                                    lineNumber: 579,
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
                                                    lineNumber: 580,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 578,
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
                                                    lineNumber: 590,
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
                                                    lineNumber: 591,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                            lineNumber: 589,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 544,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 475,
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
                                    lineNumber: 603,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleEditSave,
                                    className: `${CHARACTERS_STYLES.button} ${CHARACTERS_STYLES.buttonPrimary}`,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                                    lineNumber: 609,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                            lineNumber: 602,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                    lineNumber: 465,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
                lineNumber: 464,
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
                lineNumber: 621,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/CharactersView.tsx",
        lineNumber: 307,
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
'use client';
;
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
function NotesView({ projectId, notes: propNotes, onNotesChange }) {
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
                                    lineNumber: 319,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.total
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 331,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 335,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.ideas
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.goals
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: NOTES_STYLES.statCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: NOTES_STYLES.statIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 345,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.statValue,
                                        children: stats.references
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                    lineNumber: 373,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: NOTES_STYLES.emptyTitle,
                                    children: selectedType === 'all' ? '첫 번째 노트를 만들어보세요' : `${NOTE_TYPES.find((t)=>t.id === selectedType)?.label} 노트를 추가해보세요`
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                    lineNumber: 374,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                        lineNumber: 420,
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
                                                        lineNumber: 422,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                                lineNumber: 444,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 437,
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
                                                                lineNumber: 453,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 446,
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
                                                                lineNumber: 465,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                                            lineNumber: 458,
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
                                            lineNumber: 484,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: NOTES_STYLES.noteDate,
                                        children: note.updatedAt.toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 497,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `${NOTES_STYLES.resizeHandle} resize-handle`,
                                        onMouseDown: (e)=>handleResizeStart(e, note.id),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
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
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('goal'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 527,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleAddNote('reference'),
                                className: NOTES_STYLES.addButton,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: NOTES_STYLES.addButtonIcon
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/NotesView.tsx",
                                        lineNumber: 534,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}}),
"[project]/src/renderer/components/projects/views/SynopsisView.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SynopsisView": (()=>SynopsisView)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// 🔥 시놉시스 편집 뷰 - 타임라인 + 카드 시스템
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useLongPress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/hooks/useLongPress.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/workflow.js [app-ssr] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
'use client';
;
;
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    },
    conflict: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    },
    resolution: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    },
    twist: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"],
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    },
    climax: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
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
    // 🔥 상태 관리 - localStorage에서 데이터 복원
    const [plotPoints, setPlotPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        try {
            const saved = localStorage.getItem(`synopsis_${synopsisId}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((plot)=>({
                        ...plot,
                        createdAt: new Date(plot.createdAt),
                        updatedAt: new Date(plot.updatedAt)
                    }));
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('SYNOPSIS_VIEW', 'Failed to load synopsis from localStorage', {
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
    });
    // 🔥 데이터 저장 함수
    const saveToLocalStorage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newPlots)=>{
        try {
            localStorage.setItem(`synopsis_${synopsisId}`, JSON.stringify(newPlots));
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('SYNOPSIS_VIEW', 'Failed to save synopsis to localStorage', {
                error
            });
        }
    }, [
        synopsisId
    ]);
    // 🔥 자동 저장이 포함된 setPlotPoints 래퍼
    const updatePlotPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newPlots)=>{
        if (typeof newPlots === 'function') {
            setPlotPoints((prev)=>{
                const updated = newPlots(prev);
                saveToLocalStorage(updated);
                return updated;
            });
        } else {
            setPlotPoints(newPlots);
            saveToLocalStorage(newPlots);
        }
    }, [
        saveToLocalStorage
    ]);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('timeline');
    const [editingPlot, setEditingPlot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        show: false
    });
    // 🔥 플롯 포인트 생성
    const createPlotPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((act)=>{
        const newPlot = {
            id: Date.now().toString(),
            act,
            title: '새 플롯 포인트',
            description: '',
            type: 'setup',
            characters: [],
            order: plotPoints.filter((p)=>p.act === act).length + 1
        };
        setEditingPlot(newPlot);
        setShowAddModal({
            show: true,
            act
        });
    }, [
        plotPoints
    ]);
    // 🔥 플롯 포인트 저장
    const savePlotPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!editingPlot) return;
        if (showAddModal.show) {
            setPlotPoints((prev)=>[
                    ...prev,
                    editingPlot
                ]);
        } else {
            setPlotPoints((prev)=>prev.map((p)=>p.id === editingPlot.id ? editingPlot : p));
        }
        setEditingPlot(null);
        setShowAddModal({
            show: false
        });
    }, [
        editingPlot,
        showAddModal.show
    ]);
    // 🔥 플롯 포인트 삭제
    const deletePlotPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setPlotPoints((prev)=>prev.filter((p)=>p.id !== id));
    }, []);
    // 🔥 막별 플롯 포인트 필터링
    const getPlotPointsByAct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((act)=>{
        return plotPoints.filter((p)=>p.act === act).sort((a, b)=>a.order - b.order);
    }, [
        plotPoints
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: SYNOPSIS_STYLES.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SYNOPSIS_STYLES.header,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SYNOPSIS_STYLES.headerContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onBack,
                            className: SYNOPSIS_STYLES.backButton,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 268,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "구조로 돌아가기"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 269,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 264,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: SYNOPSIS_STYLES.title,
                            children: "시놉시스 편집"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 272,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.actions,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mr-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('timeline'),
                                            className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`,
                                            title: "타임라인 뷰",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    size: 16,
                                                    className: "mr-1.5 inline"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 33
                                                }, this),
                                                "타임라인"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 276,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('outline'),
                                            className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'outline' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`,
                                            title: "아웃라인 뷰",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    size: 16,
                                                    className: "mr-1.5 inline"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 295,
                                                    columnNumber: 33
                                                }, this),
                                                "아웃라인"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 287,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('mindmap'),
                                            className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'mindmap' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`,
                                            title: "마인드맵 뷰",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"], {
                                                    size: 16,
                                                    className: "mr-1.5 inline"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 33
                                                }, this),
                                                "마인드맵"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 298,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 275,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: SYNOPSIS_STYLES.actionButton,
                                    title: "저장",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 311,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 310,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 274,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                    lineNumber: 263,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 262,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SYNOPSIS_STYLES.content,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SYNOPSIS_STYLES.timeline,
                    children: [
                        viewMode === 'timeline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.actsContainer,
                            children: [
                                1,
                                2,
                                3
                            ].map((act)=>{
                                const actTemplate = ACT_TEMPLATES[act];
                                const actPlots = getPlotPointsByAct(act);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.actSection,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${SYNOPSIS_STYLES.actHeader} bg-gradient-to-r ${actTemplate.color}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: SYNOPSIS_STYLES.actTitle,
                                                    children: actTemplate.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 332,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: SYNOPSIS_STYLES.actDescription,
                                                    children: actTemplate.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 331,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: SYNOPSIS_STYLES.actContent,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: SYNOPSIS_STYLES.plotPoints,
                                                    children: actPlots.map((plot)=>{
                                                        const TypeIcon = PLOT_TYPE_STYLES[plot.type].icon;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: SYNOPSIS_STYLES.plotPoint,
                                                            onClick: ()=>setEditingPlot(plot),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: SYNOPSIS_STYLES.plotHeader,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: SYNOPSIS_STYLES.plotInfo,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: SYNOPSIS_STYLES.plotTitle,
                                                                                children: plot.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 350,
                                                                                columnNumber: 69
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: SYNOPSIS_STYLES.plotDescription,
                                                                                children: plot.description
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 353,
                                                                                columnNumber: 69
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: SYNOPSIS_STYLES.plotMeta,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: `${SYNOPSIS_STYLES.plotType} ${PLOT_TYPE_STYLES[plot.type].color}`,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TypeIcon, {
                                                                                                size: 12
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                                lineNumber: 358,
                                                                                                columnNumber: 77
                                                                                            }, this),
                                                                                            plot.type
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                        lineNumber: 357,
                                                                                        columnNumber: 73
                                                                                    }, this),
                                                                                    plot.characters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                                                size: 12
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                                lineNumber: 363,
                                                                                                columnNumber: 81
                                                                                            }, this),
                                                                                            plot.characters.join(', ')
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                        lineNumber: 362,
                                                                                        columnNumber: 77
                                                                                    }, this),
                                                                                    plot.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                                                size: 12
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                                lineNumber: 369,
                                                                                                columnNumber: 81
                                                                                            }, this),
                                                                                            plot.location
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                        lineNumber: 368,
                                                                                        columnNumber: 77
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 356,
                                                                                columnNumber: 69
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                        lineNumber: 349,
                                                                        columnNumber: 65
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: SYNOPSIS_STYLES.plotActions,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    setEditingPlot(plot);
                                                                                },
                                                                                className: SYNOPSIS_STYLES.actionButton,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                    lineNumber: 384,
                                                                                    columnNumber: 73
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 377,
                                                                                columnNumber: 69
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: (e)=>{
                                                                                    e.stopPropagation();
                                                                                    deletePlotPoint(plot.id);
                                                                                },
                                                                                className: SYNOPSIS_STYLES.actionButton,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                    lineNumber: 393,
                                                                                    columnNumber: 73
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                                lineNumber: 386,
                                                                                columnNumber: 69
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                        lineNumber: 376,
                                                                        columnNumber: 65
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 61
                                                            }, this)
                                                        }, plot.id, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 57
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>createPlotPoint(act),
                                                    className: SYNOPSIS_STYLES.addButton,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 49
                                                        }, this),
                                                        "새 플롯 포인트 추가"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 403,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 337,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, act, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 329,
                                    columnNumber: 37
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 322,
                            columnNumber: 25
                        }, this),
                        viewMode === 'outline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",
                                        children: "구조 개요"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 421,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: plotPoints.map((plot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-l-4 border-blue-400 pl-4 py-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-medium text-blue-600 dark:text-blue-400",
                                                                children: [
                                                                    "Act ",
                                                                    plot.act
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full",
                                                                children: PLOT_TYPE_STYLES[plot.type].icon && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(PLOT_TYPE_STYLES[plot.type].icon, {
                                                                    size: 12
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "font-medium text-gray-900 dark:text-gray-100",
                                                        children: plot.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                        lineNumber: 435,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 dark:text-gray-400 mt-1",
                                                        children: plot.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                        lineNumber: 436,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, plot.id, true, {
                                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                lineNumber: 424,
                                                columnNumber: 41
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 422,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                lineNumber: 420,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 419,
                            columnNumber: 25
                        }, this),
                        viewMode === 'mindmap' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6",
                                    children: "관계도"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 447,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-8 min-h-[400px]",
                                    children: [
                                        1,
                                        2,
                                        3
                                    ].map((act)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-center p-3 rounded-lg bg-gradient-to-r ${ACT_TEMPLATES[act].color} text-white font-semibold`,
                                                    children: ACT_TEMPLATES[act].title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: getPlotPointsByAct(act).map((plot)=>{
                                                        // 🔥 롱프레스 핸들러
                                                        const longPressHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useLongPress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLongPress"])({
                                                            onLongPress: ()=>{
                                                                // 롱프레스 시 편집 모드
                                                                setEditingPlot(plot);
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('SYNOPSIS_VIEW', '롱프레스로 편집 모드 활성화', {
                                                                    title: plot.title
                                                                });
                                                            },
                                                            onShortPress: ()=>{
                                                                // 짧은 클릭 시 편집 모드
                                                                setEditingPlot(plot);
                                                            },
                                                            delay: 500
                                                        });
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors",
                                                            ...longPressHandlers,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "font-medium text-gray-900 dark:text-gray-100 mb-1",
                                                                    children: plot.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                    lineNumber: 476,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-gray-600 dark:text-gray-400",
                                                                    children: [
                                                                        plot.description?.slice(0, 60),
                                                                        "..."
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                                    lineNumber: 479,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, plot.id, true, {
                                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                            lineNumber: 471,
                                                            columnNumber: 53
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, act, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 450,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 448,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 446,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                    lineNumber: 319,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 318,
                columnNumber: 13
            }, this),
            (editingPlot || showAddModal.show) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: SYNOPSIS_STYLES.modal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SYNOPSIS_STYLES.modalContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.modalHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: SYNOPSIS_STYLES.modalTitle,
                                    children: showAddModal.show ? '새 플롯 포인트' : '플롯 포인트 편집'
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 499,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setEditingPlot(null);
                                        setShowAddModal({
                                            show: false
                                        });
                                    },
                                    className: SYNOPSIS_STYLES.actionButton,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                        lineNumber: 509,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 502,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 498,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.modalBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "제목"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 515,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 516,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 514,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "설명"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 526,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                            lineNumber: 527,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 525,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "타입"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 537,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: editingPlot?.type || 'setup',
                                            onChange: (e)=>setEditingPlot((prev)=>prev ? {
                                                        ...prev,
                                                        type: e.target.value
                                                    } : null),
                                            className: SYNOPSIS_STYLES.select,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "setup",
                                                    children: "설정"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "conflict",
                                                    children: "갈등"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "resolution",
                                                    children: "해결"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 545,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "twist",
                                                    children: "반전"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "climax",
                                                    children: "클라이맥스"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                                    lineNumber: 547,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 538,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 536,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: SYNOPSIS_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: SYNOPSIS_STYLES.label,
                                            children: "장소"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                            lineNumber: 552,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            lineNumber: 553,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 551,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 513,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SYNOPSIS_STYLES.modalFooter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    lineNumber: 564,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: savePlotPoint,
                                    className: `${SYNOPSIS_STYLES.button} ${SYNOPSIS_STYLES.primaryButton}`,
                                    children: "저장"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                                    lineNumber: 573,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                            lineNumber: 563,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                    lineNumber: 497,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
                lineNumber: 496,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/views/SynopsisView.tsx",
        lineNumber: 260,
        columnNumber: 9
    }, this);
}
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
// 🔥 카테고리별 스타일
const CATEGORY_STYLES = {
    character: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        label: '캐릭터'
    },
    plot: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        label: '플롯'
    },
    setting: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        label: '설정'
    },
    dialogue: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        label: '대사'
    },
    theme: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        label: '테마'
    },
    other: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"],
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
    // 🔥 상태 관리 - localStorage에서 데이터 복원
    const [ideas, setIdeas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
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
    });
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
                                        lineNumber: 494,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: IDEA_STYLES.title,
                                children: "아이디어 관리"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                lineNumber: 498,
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
                                                    lineNumber: 508,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                lineNumber: 502,
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleAddNewIdea,
                                        className: `${IDEA_STYLES.button} ${IDEA_STYLES.primaryButton}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
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
                                    lineNumber: 532,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                lineNumber: 558,
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
                                                lineNumber: 559,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                        lineNumber: 557,
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
                                                lineNumber: 573,
                                                columnNumber: 29
                                            }, this),
                                            Object.entries(CATEGORY_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                                lineNumber: 584,
                                                columnNumber: 29
                                            }, this),
                                            Object.entries(STAGE_STYLES).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                                lineNumber: 598,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 593,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('list'),
                                            className: `${IDEA_STYLES.viewButton} ${viewMode === 'list' ? IDEA_STYLES.viewButtonActive : IDEA_STYLES.viewButtonInactive}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
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
                                            lineNumber: 618,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.total
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 619,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 623,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.favorites
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 624,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 628,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.applied
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 629,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.statCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            className: IDEA_STYLES.statIcon
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 633,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.statValue,
                                            children: stats.highPriority
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 634,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        filteredIdeas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: IDEA_STYLES.emptyState,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                    className: IDEA_STYLES.emptyIcon
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 642,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: IDEA_STYLES.emptyTitle,
                                    children: "아이디어가 없습니다"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 643,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                                    lineNumber: 681,
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
                                                                lineNumber: 690,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 683,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: IDEA_STYLES.cardContent,
                                            children: idea.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 709,
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                idea.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: IDEA_STYLES.cardTags,
                                                    children: [
                                                        idea.tags.slice(0, 3).map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: IDEA_STYLES.tag,
                                                                children: tag
                                                            }, index, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 725,
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
                                                                lineNumber: 753,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `${IDEA_STYLES.badge} ${CATEGORY_STYLES[idea.category].color}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryIcon, {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `${IDEA_STYLES.badge} ${STAGE_STYLES[idea.stage].color}`,
                                                                children: STAGE_STYLES[idea.stage].label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                                lineNumber: 760,
                                                                columnNumber: 53
                                                            }, this),
                                                            idea.isFavorite && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2",
                                                        children: idea.content
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 767,
                                                        columnNumber: 49
                                                    }, this),
                                                    idea.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-1 flex-wrap",
                                                        children: idea.tags.map((tag, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                            lineNumber: 789,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                        lineNumber: 782,
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
                                    lineNumber: 815,
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
                                            lineNumber: 831,
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
                                            lineNumber: 832,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 830,
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
                                            lineNumber: 842,
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
                                            lineNumber: 843,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 841,
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
                                                    lineNumber: 854,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "개발 단계"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 867,
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: IDEA_STYLES.formGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: IDEA_STYLES.label,
                                                    children: "우선순위"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                    lineNumber: 880,
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
                                                            lineNumber: 886,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "medium",
                                                            children: "보통"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                                            lineNumber: 887,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: IDEA_STYLES.formGroup,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: IDEA_STYLES.label,
                                            children: "태그 (쉼표로 구분)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                            lineNumber: 894,
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
                                            lineNumber: 895,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/views/IdeaView.tsx",
                                    lineNumber: 893,
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
                                            lineNumber: 905,
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
                                    lineNumber: 917,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
"[project]/src/renderer/components/projects/hooks/useAutoSave.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAutoSave": (()=>useAutoSave)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
'use client';
;
;
function useAutoSave({ projectId, delay = 5000, onSave, onSaveSuccess, onSaveError }) {
    const saveTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isLoadingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const retryCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastTypingTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0); // 🔥 마지막 타이핑 시간 추적
    const maxRetries = 3;
    // 🔥 노션 스타일 Debounced 저장 (타이핑 중단 후에만)
    const debouncedSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // 🔥 타이핑 시간 업데이트
        lastTypingTimeRef.current = Date.now();
        // 기존 타이머 취소
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }
        // 새 타이머 설정 - 사용자가 타이핑을 멈춘 후에만 실행
        saveTimerRef.current = setTimeout(async ()=>{
            const timeSinceLastTyping = Date.now() - lastTypingTimeRef.current;
            // 🔥 핵심: 마지막 타이핑 후 충분한 시간이 지났는지 확인
            if (timeSinceLastTyping < delay * 0.9) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Still typing, postponing save', {
                    projectId,
                    timeSinceLastTyping,
                    requiredDelay: delay
                });
                // 다시 스케줄링
                debouncedSave();
                return;
            }
            if (isLoadingRef.current) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Save already in progress, skipping', {
                    projectId
                });
                return;
            }
            try {
                isLoadingRef.current = true;
                const startTime = Date.now();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', '💾 Starting auto-save (typing stopped)', {
                    projectId,
                    timeSinceLastTyping
                });
                await onSave();
                retryCountRef.current = 0; // 성공 시 재시도 카운터 리셋
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', '✅ Auto-save completed', {
                    projectId,
                    duration: `${duration}ms`,
                    timeSinceLastTyping
                });
                onSaveSuccess?.();
            } catch (error) {
                const errorObj = error instanceof Error ? error : new Error(String(error));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', '❌ Auto-save failed', errorObj);
                // 재시도 로직
                if (retryCountRef.current < maxRetries) {
                    retryCountRef.current++;
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('AUTO_SAVE', `Retrying save (${retryCountRef.current}/${maxRetries})`, {
                        projectId
                    });
                    // 재시도 딜레이 (2초, 4초, 8초로 점진적 증가)
                    setTimeout(()=>{
                        debouncedSave();
                    }, Math.pow(2, retryCountRef.current) * 1000);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', 'Max retries exceeded', {
                        projectId
                    });
                    onSaveError?.(errorObj);
                }
            } finally{
                isLoadingRef.current = false;
                saveTimerRef.current = null;
            }
        }, delay);
    }, [
        projectId,
        delay,
        onSave,
        onSaveSuccess,
        onSaveError
    ]);
    // 🔥 즉시 저장 (Ctrl+S용)
    const forceSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // 기존 debounced 저장 취소
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }
        if (isLoadingRef.current) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Save already in progress, cannot force save', {
                projectId
            });
            return;
        }
        try {
            isLoadingRef.current = true;
            const startTime = Date.now();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', 'Starting force save', {
                projectId
            });
            await onSave();
            retryCountRef.current = 0;
            const duration = Date.now() - startTime;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', '✅ Force save completed', {
                projectId,
                duration: `${duration}ms`
            });
            onSaveSuccess?.();
        } catch (error) {
            const errorObj = error instanceof Error ? error : new Error(String(error));
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', '❌ Force save failed', errorObj);
            onSaveError?.(errorObj);
        } finally{
            isLoadingRef.current = false;
        }
    }, [
        projectId,
        onSave,
        onSaveSuccess,
        onSaveError
    ]);
    // 🔥 컴포넌트 언마운트 시 정리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);
    return {
        debouncedSave,
        forceSave,
        isLoading: isLoadingRef.current
    };
}
}}),
"[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "useProjectData": (()=>useProjectData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/WriterStats.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useAutoSave.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-ssr] (ecmascript)"); // 🔥 스토어 import 추가
'use client';
;
;
;
;
;
function useProjectData(projectId) {
    const sessionStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(Date.now());
    // 🔥 성능 최적화: 기본 날짜 메모이제이션 (new Date() 반복 생성 방지)
    const defaultDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new Date(), []);
    // 🔥 성능 최적화: 기본 데이터 메모이제이션 (중복 객체 생성 방지)
    const defaultCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                id: '1',
                projectId: projectId,
                name: '주인공',
                role: '주요 인물',
                notes: '용감하고 정의로운 성격',
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '2',
                projectId: projectId,
                name: '조력자',
                role: '조력자',
                notes: '지혜롭고 경험이 많음',
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '3',
                projectId: projectId,
                name: '적대자',
                role: '적대자',
                notes: '야망이 크고 냉혹함',
                createdAt: defaultDate,
                updatedAt: defaultDate
            }
        ], [
        projectId,
        defaultDate
    ]);
    const defaultNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                id: '1',
                projectId: projectId,
                title: '첫 번째 메모',
                content: '이야기의 핵심 아이디어를 여기에 적어보세요.',
                tags: [
                    '아이디어'
                ],
                color: '#3b82f6',
                isPinned: false,
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '2',
                projectId: projectId,
                title: '설정 노트',
                content: '세계관, 배경 설정에 대한 내용을 정리합니다.',
                tags: [
                    '설정',
                    '세계관'
                ],
                color: '#10b981',
                isPinned: true,
                createdAt: defaultDate,
                updatedAt: defaultDate
            }
        ], [
        projectId,
        defaultDate
    ]);
    const defaultStructure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                id: '1',
                projectId: projectId,
                type: 'chapter',
                title: '1챕터: 시작',
                isActive: true,
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '2',
                projectId: projectId,
                type: 'synopsis',
                title: '첫 번째 장면',
                isActive: true,
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '3',
                projectId: projectId,
                type: 'synopsis',
                title: '두 번째 장면',
                isActive: true,
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '4',
                projectId: projectId,
                type: 'chapter',
                title: '2챕터: 전개',
                isActive: true,
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '5',
                projectId: projectId,
                type: 'synopsis',
                title: '세 번째 장면',
                isActive: true,
                createdAt: defaultDate,
                updatedAt: defaultDate
            },
            {
                id: '6',
                projectId: projectId,
                type: 'idea',
                title: '아이디어 메모',
                isActive: true,
                createdAt: defaultDate,
                updatedAt: defaultDate
            }
        ], [
        projectId,
        defaultDate
    ]);
    // 🔥 로딩 및 에러 상태 추가
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 기본 프로젝트 상태
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [chapters, setChapters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('{}'); // JSON 문자열
    const [lastSaved, setLastSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('saved');
    // 🔥 ref로 최신 값 추적 (성능 최적화: useEffect 제거)
    const titleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const chaptersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('{}'); // 🔥 chapters ref 추가
    // 🔥 최적화: setter에서 직접 ref 업데이트 (useEffect 불필요)
    const setTitleOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newTitle)=>{
        titleRef.current = newTitle;
        setTitle(newTitle);
    }, []);
    const setContentOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newContent)=>{
        contentRef.current = newContent;
        setContent(newContent);
    }, []);
    const setChaptersOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newChapters)=>{
        console.log('🔥 DEBUG: setChaptersOptimized called', {
            newChapters,
            currentRef: chaptersRef.current
        });
        chaptersRef.current = newChapters;
        setChapters(newChapters);
        console.log('🔥 DEBUG: setChaptersOptimized completed', {
            updatedRef: chaptersRef.current
        });
    }, []);
    // 🔥 작가 데이터
    const [characters, setCharacters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [structure, setStructure] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // 🔥 notes 상태 추가
    const [writerStats, setWriterStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        wordCount: 0,
        charCount: 0,
        paragraphCount: 0,
        readingTime: 0,
        wordGoal: 1000,
        progress: 0,
        sessionTime: 0,
        wpm: 0
    });
    // 🔥 프로젝트 로드 (무한루프 방지)
    const loadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            setIsLoading(true);
            setError(null);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Loading project', {
                projectId
            });
            // retry helper: 짧은 지연으로 재시도 (DB 동기화 지연 대응)
            const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
            const maxAttempts = 4;
            let attempt = 0;
            let result = null;
            while(attempt < maxAttempts){
                attempt += 1;
                try {
                    result = await window.electronAPI.projects.getById(projectId);
                    // 성공적으로 데이터를 받았거나 다른 에러가 발생하면 루프 종료
                    if (result?.success) break;
                    // 프로젝트를 찾을 수 없다는 에러인 경우에만 재시도
                    if (!(result && result.error && String(result.error).includes('찾을 수 없습니다'))) {
                        break;
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', `Project not found, retrying (${attempt}/${maxAttempts})`, {
                        projectId
                    });
                } catch (err) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', `Attempt ${attempt} failed`, err);
                }
                // 지수적 백오프: 100ms, 200ms, 400ms...
                await sleep(100 * Math.pow(2, attempt - 1));
            }
            // result는 위에서 설정된 값
            if (result && result.success && result.data) {
                setTitle(result.data.title);
                setContent(result.data.content || '');
                // 🔥 chapters 데이터 로드 및 ref 동기화
                const chaptersData = result.data.chapters || '{}';
                setChapters(chaptersData);
                chaptersRef.current = chaptersData; // ref도 동기화
                setLastSaved(new Date(result.data.lastModified));
                setSaveStatus('saved'); // 🔥 저장 상태 업데이트
                // 🔥 실제 데이터 로드 - 캐릭터 데이터
                try {
                    const charactersResult = await window.electronAPI.projects.getCharacters(projectId);
                    if (charactersResult.success && charactersResult.data) {
                        setCharacters(charactersResult.data);
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Characters loaded successfully', {
                            count: charactersResult.data.length
                        });
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No characters found, using defaults');
                        // 기본 캐릭터 데이터
                        setCharacters(defaultCharacters);
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load characters, using defaults', error);
                    setCharacters(defaultCharacters);
                }
                // 🔥 실제 데이터 로드 - 구조 데이터
                try {
                    const structureResult = await window.electronAPI.projects.getStructure(projectId);
                    if (structureResult.success && structureResult.data) {
                        setStructure(structureResult.data);
                        // 🔥 DB 데이터를 Zustand 스토어에 동기화
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getState().setStructures(projectId, structureResult.data);
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Structure loaded and synced to store', {
                            count: structureResult.data.length
                        });
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No structure found, using defaults');
                        // 기본 구조 데이터
                        setStructure(defaultStructure);
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load structure, using defaults', error);
                    setStructure(defaultStructure);
                }
                // 🔥 실제 데이터 로드 - 노트 데이터
                try {
                    const notesResult = await window.electronAPI.projects.getNotes(projectId);
                    if (notesResult.success && notesResult.data) {
                        setNotes(notesResult.data);
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Notes loaded successfully', {
                            count: notesResult.data.length
                        });
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No notes found, using defaults');
                        // 기본 노트 데이터
                        setNotes(defaultNotes);
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load notes, using defaults', error);
                    setNotes(defaultNotes);
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Project loaded successfully');
            } else {
                throw new Error(result.error || 'Failed to load project');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error loading project', error);
            setError(error instanceof Error ? error.message : 'Failed to load project');
            // 🔥 실패 시 로컬 백업 확인
            try {
                const backup = localStorage.getItem(`project_backup_${projectId}`);
                if (backup) {
                    const backupData = JSON.parse(backup);
                    setTitle(backupData.title || '');
                    setContent(backupData.content || '');
                    setSaveStatus('unsaved');
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Loaded from local backup');
                }
            } catch (storageError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to load backup', storageError);
            }
        } finally{
            setIsLoading(false); // 🔥 무조건 로딩 상태 해제
        }
    }, [
        projectId
    ]);
    // 🔥 프로젝트 저장 함수 (ref로 무한루프 방지)
    const saveProjectInternal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const currentTitle = titleRef.current;
            const currentContent = contentRef.current;
            const currentChapters = chaptersRef.current; // 🔥 ref에서 최신 chapters 가져오기
            if (!currentTitle.trim() && !currentContent.trim()) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving project to server', {
                projectId
            });
            // 🔥 로컬 백업 먼저 저장 (즉시)
            try {
                const backupData = {
                    title: currentTitle,
                    content: currentContent,
                    chapters: currentChapters,
                    lastModified: new Date()
                };
                localStorage.setItem(`project_backup_${projectId}`, JSON.stringify(backupData));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Local backup saved');
            } catch (storageError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to save local backup', storageError);
            }
            // 🔥 즉시 서버 저장
            const payload = {
                title: currentTitle,
                content: currentContent,
                chapters: currentChapters,
                lastModified: new Date()
            };
            console.log('🔥 DEBUG: Saving payload to server', {
                payload,
                chaptersLength: currentChapters.length,
                chaptersPreview: currentChapters.substring(0, 100)
            });
            const result = await window.electronAPI.projects.update(projectId, payload);
            if (result.success) {
                setLastSaved(new Date());
                setSaveStatus('saved');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Project saved successfully to server', {
                    hasChapters: !!currentChapters && currentChapters !== '{}'
                });
                // 성공 시 로컬 백업 제거
                try {
                    localStorage.removeItem(`project_backup_${projectId}`);
                } catch (e) {
                // 무시
                }
            } else {
                throw new Error(result.error || 'Failed to save project');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving project', error);
            setSaveStatus('error');
            throw error;
        }
    }, [
        projectId
    ]); // 🔥 projectId만 dependency로 설정
    // 🔥 노션 스타일 autoSave Hook 사용 - 타이핑 중단 후 저장
    const { debouncedSave, forceSave, isLoading: isSaving } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAutoSave"])({
        projectId,
        delay: 3000,
        onSave: saveProjectInternal,
        onSaveSuccess: ()=>{
            setSaveStatus('saved');
            setLastSaved(new Date());
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', '✅ 자동 저장 완료', {
                projectId
            });
        },
        onSaveError: (error)=>{
            setSaveStatus('error');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', '❌ 자동 저장 실패', {
                error: error.message,
                projectId
            });
            // 에러 발생 시 로컬 백업 생성
            try {
                localStorage.setItem(`project_backup_${projectId}`, JSON.stringify({
                    title,
                    content
                }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', '📦 로컬 백업 저장됨', {
                    projectId
                });
            } catch (backupError) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', '❌ 로컬 백업 실패', backupError);
            }
        }
    });
    // 🔥 호환성을 위한 saveProject 함수
    const saveProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await forceSave();
    }, [
        forceSave
    ]);
    // 🔥 비용이 큰 통계 계산을 메모이제이션 (Hook 규칙 준수)
    const memoizedStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!content) return writerStats;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateWriterStats"])(content, writerStats.wordGoal, sessionStartRef.current);
    }, [
        content,
        writerStats.wordGoal,
        writerStats
    ]);
    // 🔥 작가 통계 업데이트 (메모이제이션된 값 사용)
    const updateWriterStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setWriterStats(memoizedStats);
    }, [
        memoizedStats
    ]);
    const setWordGoal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((goal)=>{
        setWriterStats((prev)=>({
                ...prev,
                wordGoal: goal,
                progress: Math.min(100, Math.round(prev.wordCount / goal * 100))
            }));
    }, []);
    // 🔥 프로젝트 초기 로드 (성능 최적화: loadProject를 useRef로 안전하게 관리)
    const loadProjectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(loadProject);
    loadProjectRef.current = loadProject;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (projectId) {
            loadProjectRef.current();
        }
    }, [
        projectId
    ]); // 🔥 projectId만 dependency로 - 무한루프 완전 방지
    // 🔥 자동 저장 시스템 (성능 최적화: ref로 무한루프 방지)
    const debouncedSaveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(debouncedSave);
    debouncedSaveRef.current = debouncedSave;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // 🔥 JSON 문자열 검증: 빈 객체가 아닌 실제 데이터가 있을 때만 저장
        const hasRealChapters = (()=>{
            try {
                const parsed = JSON.parse(chapters);
                return Object.keys(parsed).length > 0;
            } catch  {
                return false;
            }
        })();
        if (title.trim() || content.trim() || hasRealChapters) {
            setSaveStatus('unsaved');
            debouncedSaveRef.current(); // ref를 통해 안전하게 호출
        }
    }, [
        title,
        content,
        chapters
    ]); // 🔥 chapters 추가로 auto-save 트리거
    // 🔥 저장 중 상태 관리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isSaving) {
            setSaveStatus('saving');
        }
    }, [
        isSaving
    ]);
    // 🔥 통계 업데이트 (기가차드 수정: interval 제거로 커서 리셋 완전 해결)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        updateWriterStats();
    // 🔥 30초 interval 완전 제거 - 커서 리셋 원인 제거
    // 세션 시간은 사용자가 통계를 볼 때만 계산하도록 변경
    }, []); // 🔥 dependency 완전 제거 - useEffect 지옥 해결
    // 🔥 캐릭터 저장 함수
    const saveCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (charactersToSave)=>{
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving characters', {
                count: charactersToSave.length
            });
            // 🔥 실제 API 호출
            const result = await window.electronAPI.projects.updateCharacters(projectId, charactersToSave);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Characters saved successfully');
            } else {
                throw new Error(result.error || 'Failed to save characters');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving characters', error);
            throw error;
        }
    }, [
        projectId
    ]);
    // 🔥 메모 저장 함수
    const saveNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (notesToSave)=>{
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving notes', {
                count: notesToSave.length
            });
            // 🔥 실제 API 호출
            const result = await window.electronAPI.projects.updateNotes(projectId, notesToSave);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Notes saved successfully');
            } else {
                throw new Error(result.error || 'Failed to save notes');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving notes', error);
            throw error;
        }
    }, [
        projectId
    ]);
    // 🔥 캐릭터 변경 핸들러 (자동 저장 포함)
    const handleCharactersChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (newCharacters)=>{
        setCharacters(newCharacters);
        try {
            await saveCharacters(newCharacters);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to save characters automatically', error);
        // 사용자에게 에러 표시할 수 있음
        }
    }, [
        saveCharacters
    ]);
    // 🔥 메모 변경 핸들러 (자동 저장 포함)  
    const handleNotesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (newNotes)=>{
        setNotes(newNotes);
        try {
            await saveNotes(newNotes);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to save notes automatically', error);
        // 사용자에게 에러 표시할 수 있음
        }
    }, [
        saveNotes
    ]);
    return {
        // 🔥 로딩 및 에러 상태
        isLoading,
        error,
        // 🔥 기본 프로젝트 데이터 (성능 최적화된 setter)
        title,
        setTitle: setTitleOptimized,
        content,
        setContent: setContentOptimized,
        chapters,
        setChapters: setChaptersOptimized,
        lastSaved,
        saveStatus,
        // 🔥 작가 데이터
        characters,
        setCharacters,
        structure,
        setStructure,
        notes,
        setNotes,
        writerStats,
        // 🔥 액션 함수들
        loadProject,
        saveProject,
        forceSave,
        updateWriterStats,
        setWordGoal
    };
}
}}),
"[project]/src/renderer/components/projects/hooks/useUIState.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "useUIState": (()=>useUIState)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function useUIState() {
    // 🔥 테마 관리를 ThemeProvider로 위임
    const { resolvedTheme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    // 🔥 UI 상태 (테마 제외)
    const [showLeftSidebar, setShowLeftSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showRightSidebar, setShowRightSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHeader, setShowHeader] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isFocusMode, setIsFocusMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 핸들러 함수들
    const toggleLeftSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setShowLeftSidebar((prev)=>!prev);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Left sidebar toggled');
    }, []);
    const toggleRightSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setShowRightSidebar((prev)=>!prev);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Right sidebar toggled');
    }, []);
    const toggleDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        toggleTheme(); // ThemeProvider의 토글 사용
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Dark mode toggled via ThemeProvider');
    }, [
        toggleTheme
    ]);
    const toggleFocusMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsFocusMode((prev)=>{
            const newValue = !prev;
            if (newValue) {
                setShowLeftSidebar(false);
                setShowRightSidebar(false);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('UI_STATE', `Focus mode ${newValue ? 'enabled' : 'disabled'}`);
            return newValue;
        });
    }, []);
    return {
        showLeftSidebar,
        showRightSidebar,
        showHeader,
        isDarkMode: resolvedTheme === 'dark',
        isFocusMode,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleDarkMode,
        toggleFocusMode,
        setShowHeader
    };
}
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/services/ProjectEditorStateService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 ProjectEditorStateService - ProjectEditor의 복잡한 상태 관리를 담당
// 15개 이상의 useState를 체계적으로 관리하는 서비스
__turbopack_context__.s({
    "ProjectEditorStateService": (()=>ProjectEditorStateService),
    "projectEditorStateService": (()=>projectEditorStateService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'View changed', {
                    view
                });
            },
            setCurrentSubView: (subView)=>{
                setState((prev)=>({
                        ...prev,
                        currentSubView: subView
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'SubView changed', {
                    subView
                });
            },
            setEditingItemId: (id)=>{
                setState((prev)=>({
                        ...prev,
                        editingItemId: id
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Editing item changed', {
                    id
                });
            },
            // UI 액션
            toggleCollapsed: ()=>{
                setState((prev)=>{
                    const newCollapsed = !prev.collapsed;
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Sidebar toggled', {
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Right sidebar toggled', {
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Delete dialog opened');
            },
            closeDeleteDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showDeleteDialog: false
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Delete dialog closed');
            },
            openShareDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showShareDialog: true
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Share dialog opened');
            },
            closeShareDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showShareDialog: false
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Share dialog closed');
            },
            openNewChapterModal: ()=>{
                setState((prev)=>({
                        ...prev,
                        showNewChapterModal: true
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'New chapter modal opened');
            },
            closeNewChapterModal: ()=>{
                setState((prev)=>({
                        ...prev,
                        showNewChapterModal: false
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'New chapter modal closed');
            },
            openChapterDeleteDialog: (chapter)=>{
                setState((prev)=>({
                        ...prev,
                        showChapterDeleteDialog: true,
                        chapterToDelete: chapter
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Chapter delete dialog opened', {
                    chapter
                });
            },
            closeChapterDeleteDialog: ()=>{
                setState((prev)=>({
                        ...prev,
                        showChapterDeleteDialog: false,
                        chapterToDelete: null
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Chapter delete dialog closed');
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Tab added', {
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Tab removed', {
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Active tab changed', {
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'Tab updated', {
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR_STATE', 'All tabs marked as saved');
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
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/hooks/useProjectEditorState.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 useProjectEditorState Hook - ProjectEditor 상태 관리를 위한 커스텀 훅
// 복잡한 상태 로직을 훅으로 추상화
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useProjectEditorState": (()=>useProjectEditorState)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$services$2f$ProjectEditorStateService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/services/ProjectEditorStateService.ts [app-ssr] (ecmascript)");
;
;
function useProjectEditorState() {
    // 🔥 단일 상태 객체로 모든 상태 관리
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$services$2f$ProjectEditorStateService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["projectEditorStateService"].createInitialState());
    // 🔥 상태 액션들 생성
    const actions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$services$2f$ProjectEditorStateService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["projectEditorStateService"].createStateActions(state, setState);
    return {
        state,
        actions
    };
}
const __TURBOPACK__default__export__ = useProjectEditorState;
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${WRITER_EDITOR_STYLES.container} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
function ProjectEditorHeader({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `${WRITER_EDITOR_STYLES.header} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
        lineNumber: 48,
        columnNumber: 9
    }, this);
}
function ProjectEditorMain({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: `${WRITER_EDITOR_STYLES.main} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx",
        lineNumber: 56,
        columnNumber: 9
    }, this);
}
function ProjectEditorContent({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${WRITER_EDITOR_STYLES.editorContainer} ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
const __TURBOPACK__default__export__ = {
    Container: ProjectEditorContainer,
    Header: ProjectEditorHeader,
    Main: ProjectEditorMain,
    Content: ProjectEditorContent,
    STYLES: WRITER_EDITOR_STYLES
};
}}),
"[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 Modularized ProjectEditor - 모듈화된 새로운 프로젝트 에디터
// 기존 1284줄 → 약 200줄로 축소, 단일 책임 원칙 준수
__turbopack_context__.s({
    "ProjectEditor": (()=>ProjectEditor),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$MarkdownEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/MarkdownEditor.tsx [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/markdownEditor/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$EditorTabBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/EditorTabBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/StructureView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/CharactersView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/NotesView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$SynopsisView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/SynopsisView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$IdeaView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/IdeaView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
// 🔥 모듈화된 hooks 및 services
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useUIState.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$hooks$2f$useProjectEditorState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/hooks/useProjectEditorState.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/components/ProjectEditorLayout.tsx [app-ssr] (ecmascript)");
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
const ProjectEditor = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(function ProjectEditor({ projectId }) {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'ProjectEditor render started', {
        projectId
    });
    // 🔥 모듈화된 상태 관리
    const { isLoading, error, ...projectData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectData"])(projectId);
    const uiState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUIState"])();
    const { state, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$hooks$2f$useProjectEditorState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProjectEditorState"])();
    // 🔥 저장 성공 처리
    const handleSaveSuccess = ()=>{
        actions.markAllTabsAsSaved();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'All tabs marked as saved');
    };
    // 🔥 로딩 상태 처리
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Container, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 59,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-slate-500 text-sm",
                            children: "프로젝트를 불러오는 중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 60,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 58,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 57,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
            lineNumber: 56,
            columnNumber: 13
        }, this);
    }
    // 🔥 에러 상태 처리
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Container, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-red-600 mb-4",
                            children: "오류"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 73,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-600",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 74,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 72,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 71,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
            lineNumber: 70,
            columnNumber: 13
        }, this);
    }
    // 🔥 현재 활성 탭 찾기
    const activeTab = state.tabs.find((tab)=>tab.id === state.activeTabId);
    // 🔥 뷰 렌더링 함수
    const renderCurrentView = ()=>{
        switch(state.currentView){
            case 'write':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditorProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col h-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$EditorTabBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditorTabBar"], {
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
                                lineNumber: 92,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$markdownEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MarkdownEditor"], {
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
                                    lineNumber: 111,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 110,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 90,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 89,
                    columnNumber: 21
                }, this);
            case 'structure':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StructureView"], {
                    projectId: projectId
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 130,
                    columnNumber: 21
                }, this);
            case 'characters':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CharactersView"], {
                    projectId: projectId,
                    characters: [],
                    onCharactersChange: ()=>{}
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 137,
                    columnNumber: 21
                }, this);
            case 'notes':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NotesView"], {
                    projectId: projectId
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 146,
                    columnNumber: 21
                }, this);
            case 'synopsis':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$SynopsisView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SynopsisView"], {
                    synopsisId: "default",
                    onBack: ()=>actions.setCurrentView('write')
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 153,
                    columnNumber: 21
                }, this);
            case 'idea':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$IdeaView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IdeaView"], {
                    ideaId: "default",
                    onBack: ()=>actions.setCurrentView('write')
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 161,
                    columnNumber: 21
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-500",
                        children: [
                            "알 수 없는 뷰: ",
                            state.currentView
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 170,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 169,
                    columnNumber: 21
                }, this);
        }
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Rendering with state', {
        currentView: state.currentView,
        activeTabId: state.activeTabId,
        tabsCount: state.tabs.length
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Container, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Header, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-lg font-semibold",
                                    children: "프로젝트 에디터"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                    lineNumber: 188,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-500",
                                    children: "모듈화된 버전"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                    lineNumber: 189,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 187,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: actions.toggleRightSidebar,
                                className: "px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600",
                                children: state.showRightSidebar ? 'AI 패널 숨기기' : 'AI 패널 보기'
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 193,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 192,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 186,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 185,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Main, {
                children: [
                    !state.collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold mb-4",
                                children: "사이드바"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 208,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>actions.setCurrentView('write'),
                                        className: `w-full text-left px-3 py-2 rounded ${state.currentView === 'write' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`,
                                        children: "글쓰기"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                        lineNumber: 210,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>actions.setCurrentView('structure'),
                                        className: `w-full text-left px-3 py-2 rounded ${state.currentView === 'structure' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`,
                                        children: "구조"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                        lineNumber: 217,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 209,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 207,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$components$2f$ProjectEditorLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Content, {
                        children: renderCurrentView()
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 229,
                        columnNumber: 17
                    }, this),
                    state.showRightSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold",
                                        children: "통계 패널"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                        lineNumber: 237,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: actions.toggleRightSidebar,
                                        className: "text-gray-500 hover:text-gray-700",
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                        lineNumber: 238,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 236,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-600",
                                                children: "총 탭 수:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                                lineNumber: 248,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 font-medium",
                                                children: state.tabs.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                                lineNumber: 249,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                        lineNumber: 247,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-600",
                                                children: "현재 탭 글자 수:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                                lineNumber: 253,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 font-medium",
                                                children: activeTab?.content?.length || 0
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                                lineNumber: 254,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                        lineNumber: 252,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-600",
                                                children: "수정된 탭:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                                lineNumber: 258,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 font-medium",
                                                children: [
                                                    state.tabs.filter((tab)=>tab.isDirty).length,
                                                    "개"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                                lineNumber: 259,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                        lineNumber: 257,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 246,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                        lineNumber: 235,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 204,
                columnNumber: 13
            }, this),
            state.showDeleteDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded-lg shadow-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-4",
                            children: "프로젝트 삭제"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 272,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-4",
                            children: "정말로 이 프로젝트를 삭제하시겠습니까?"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 273,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 justify-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: actions.closeDeleteDialog,
                                    className: "px-4 py-2 text-gray-600 hover:bg-gray-100 rounded",
                                    children: "취소"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                    lineNumber: 275,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        // TODO: 프로젝트 삭제 로직
                                        actions.closeDeleteDialog();
                                    },
                                    className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",
                                    children: "삭제"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                    lineNumber: 281,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 274,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 271,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 270,
                columnNumber: 17
            }, this),
            state.showShareDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded-lg shadow-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-4",
                            children: "프로젝트 공유"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 298,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-4",
                            children: [
                                "프로젝트 ID: ",
                                projectId
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 299,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: actions.closeShareDialog,
                                className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                                children: "닫기"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                                lineNumber: 301,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                            lineNumber: 300,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 297,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 296,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 right-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors",
                    children: "?"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                    lineNumber: 314,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
                lineNumber: 313,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/modules/projectEditor/index.tsx",
        lineNumber: 183,
        columnNumber: 9
    }, this);
});
const __TURBOPACK__default__export__ = ProjectEditor;
}}),
"[project]/src/renderer/components/projects/ProjectEditor.tsx [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 Re-exported Modularized ProjectEditor
// 기존 1284줄 파일을 새로운 모듈화된 구조로 완전 교체
// 원본 기능은 modules/projectEditor에서 모듈화되어 제공됨
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-ssr] (ecmascript)");
'use client';
;
}}),
"[project]/src/renderer/components/projects/ProjectEditor.tsx [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ProjectEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/ProjectEditor.tsx [app-ssr] (ecmascript) <locals>");
}}),
"[project]/src/renderer/components/projects/ErrorBoundary.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ProjectErrorBoundary": (()=>ProjectErrorBoundary)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
class ProjectErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        // 🔥 더 상세한 에러 로깅
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_ERROR_BOUNDARY', 'Client-side exception caught', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        // 🔥 DOM 관련 에러인지 확인
        if (error.message.includes('insertBefore') || error.message.includes('Node')) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_ERROR_BOUNDARY', 'DOM manipulation error detected', {
                errorMessage: error.message
            });
        }
    }
    // 🔥 에러 복구 함수
    handleReset = ()=>{
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined
        });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-screen flex items-center justify-center bg-white dark:bg-gray-900",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md text-center p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-6xl mb-4",
                            children: "😵"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-red-600 mb-4",
                            children: "앗! 오류가 발생했습니다"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 62,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400 mb-6",
                            children: "클라이언트에서 예외가 발생했습니다. 페이지를 새로고침하거나 다시 시도해보세요."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this),
                        ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "text-left text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "cursor-pointer font-medium",
                                    children: "기술적 세부사항"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 69,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "mt-2 whitespace-pre-wrap",
                                    children: [
                                        this.state.error.message,
                                        '\n\n',
                                        this.state.error.stack
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 70,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 68,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleReset,
                                    className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",
                                    children: "다시 시도"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.location.reload(),
                                    className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
                                    children: "페이지 새로고침"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.history.back(),
                                    className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700",
                                    children: "뒤로 가기"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 78,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
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

//# sourceMappingURL=src_renderer_b8d5163b._.js.map