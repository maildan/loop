(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/shared/logger.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 기가차드 로거 시스템
__turbopack_context__.s({
    "LogLevel": (()=>LogLevel),
    "Logger": (()=>Logger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var LogLevel = /*#__PURE__*/ function(LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    return LogLevel;
}({});
class LoggerService {
    logLevel = 0;
    logs = [];
    maxLogs = 1000;
    timers = new Map();
    constructor(){
        // 🔥 환경변수 기반 로그 레벨 설정
        const envLogLevel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.LOG_LEVEL?.toLowerCase();
        const debugMode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DEBUG === 'true' || ("TURBOPACK compile-time value", "development") === 'development';
        if ("TURBOPACK compile-time truthy", 1) {
            this.logLevel = 0;
        } else {
            "TURBOPACK unreachable";
        }
        console.log(`🔥 [LOGGER] Logger initialized - Level: ${LogLevel[this.logLevel]}, ENV: ${("TURBOPACK compile-time value", "development")}, DEBUG: ${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DEBUG}`);
    }
    setLogLevel(level) {
        this.logLevel = level;
    }
    log(level, component, message, data) {
        if (level < this.logLevel) return;
        const entry = {
            level,
            component,
            message,
            data,
            timestamp: new Date()
        };
        this.logs.push(entry);
        // 로그 개수 제한
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        // 🔥 콘솔 출력 - 환경변수 기반 + 강제 출력 모드
        const timestamp = entry.timestamp.toISOString();
        const levelName = LogLevel[level];
        const prefix = `[${timestamp}] ${levelName} [${component}]`;
        const verboseMode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VERBOSE_LOGGING === 'true';
        // 🔥 강제 출력: DEBUG 레벨도 항상 표시
        const shouldForceOutput = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DEBUG === 'true' || ("TURBOPACK compile-time value", "development") === 'development';
        if (level >= this.logLevel || shouldForceOutput) {
            switch(level){
                case 0:
                    console.debug(`🔍 ${prefix}`, message, verboseMode && data ? data : '');
                    break;
                case 1:
                    console.info(`ℹ️ ${prefix}`, message, verboseMode && data ? data : '');
                    break;
                case 2:
                    console.warn(`⚠️ ${prefix}`, message, verboseMode && data ? data : '');
                    break;
                case 3:
                    console.error(`❌ ${prefix}`, message, data || '');
                    break;
            }
        }
    }
    debug(component, message, data) {
        this.log(0, component, message, data);
    }
    info(component, message, data) {
        this.log(1, component, message, data);
    }
    warn(component, message, data) {
        this.log(2, component, message, data);
    }
    error(component, message, data) {
        this.log(3, component, message, data);
    }
    getLogs() {
        return [
            ...this.logs
        ];
    }
    clearLogs() {
        this.logs = [];
    }
    getLogsByComponent(component) {
        return this.logs.filter((log)=>log.component === component);
    }
    getLogsByLevel(level) {
        return this.logs.filter((log)=>log.level >= level);
    }
    // 🔥 Timer 기능
    time(label) {
        this.timers.set(label, performance.now());
        this.debug('TIMER', `Timer started: ${label}`);
    }
    timeEnd(label) {
        const startTime = this.timers.get(label);
        if (startTime === undefined) {
            this.warn('TIMER', `Timer not found: ${label}`);
            return;
        }
        const duration = performance.now() - startTime;
        this.timers.delete(label);
        this.info('TIMER', `Timer completed: ${label}`, {
            duration: `${duration.toFixed(3)}ms`
        });
    }
}
const Logger = new LoggerService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn),
    "debounce": (()=>debounce),
    "delay": (()=>delay),
    "formatDate": (()=>formatDate),
    "formatNumber": (()=>formatNumber),
    "getObjectKeys": (()=>getObjectKeys),
    "isArray": (()=>isArray),
    "isNumber": (()=>isNumber),
    "isString": (()=>isString)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function getObjectKeys(obj) {
    return Object.keys(obj);
}
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function debounce(func, waitMs) {
    let timeoutId = null;
    return (...args)=>{
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            func(...args);
        }, waitMs);
    };
}
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(num);
}
function formatDate(date) {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}
function isString(value) {
    return typeof value === 'string';
}
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
function isArray(value) {
    return Array.isArray(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Button": (()=>Button)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
'use client';
;
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드
const BUTTON_STYLES = {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    variants: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400',
        secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-400',
        outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-slate-400',
        ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-slate-400',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400'
    },
    sizes: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2'
    }
};
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ variant = 'primary', size = 'md', loading = false, loadingText, disabled, className, children, 'aria-label': ariaLabel, ...props }, ref)=>{
    const isDisabled = disabled || loading;
    const buttonClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(BUTTON_STYLES.base, BUTTON_STYLES.variants[variant], BUTTON_STYLES.sizes[size], className);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        className: buttonClassName,
        disabled: isDisabled,
        "aria-label": ariaLabel,
        "aria-disabled": isDisabled,
        onClick: (e)=>{
            if (isDisabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            props.onClick?.(e);
        },
        ...props,
        children: [
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "w-4 h-4 mr-2 animate-spin",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Button.tsx",
                lineNumber: 71,
                columnNumber: 11
            }, this),
            loading && loadingText ? loadingText : children
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/Button.tsx",
        lineNumber: 58,
        columnNumber: 7
    }, this);
});
_c1 = Button;
Button.displayName = 'Button';
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/auth/LoginModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>LoginModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
"use client";
;
;
function LoginModal({ open, onClose, onLogin }) {
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Google 재로그인 필요",
            className: "bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100",
                    children: "Google 재로그인 필요"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/auth/LoginModal.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-4 text-sm text-slate-600 dark:text-slate-400",
                    children: "Google 인증이 만료되었거나 연결이 해제되었습니다. 계속하려면 다시 로그인해주세요."
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/auth/LoginModal.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            onClick: onClose,
                            children: "취소"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/auth/LoginModal.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: async ()=>{
                                await onLogin();
                                onClose();
                            },
                            children: "Google로 로그인"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/auth/LoginModal.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/auth/LoginModal.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/auth/LoginModal.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/auth/LoginModal.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = LoginModal;
var _c;
__turbopack_context__.k.register(_c, "LoginModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/contexts/AuthContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "default": (()=>__TURBOPACK__default__export__),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const getDefaultAuth = ()=>({
        isAuthenticated: false
    });
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children, initialAuth }) {
    _s();
    const [auth, setAuthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AuthProvider.useState": ()=>{
            if (initialAuth && initialAuth.isAuthenticated) {
                return {
                    isAuthenticated: true,
                    userEmail: initialAuth.userEmail || undefined,
                    userName: initialAuth.userName || undefined,
                    userPicture: initialAuth.userPicture || undefined
                };
            }
            return getDefaultAuth();
        }
    }["AuthProvider.useState"]);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AuthProvider.useState": ()=>!!initialAuth
    }["AuthProvider.useState"]);
    const [loginModalOpen, setLoginModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const latestLoadId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(0);
    const setAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[setAuth]": (next)=>{
            setAuthState({
                "AuthProvider.useCallback[setAuth]": (prev)=>({
                        ...prev,
                        ...next
                    })
            }["AuthProvider.useCallback[setAuth]"]);
        }
    }["AuthProvider.useCallback[setAuth]"], []);
    const clearAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[clearAuth]": ()=>{
            setAuthState(getDefaultAuth());
        }
    }["AuthProvider.useCallback[clearAuth]"], []);
    const loadAuthStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[loadAuthStatus]": async ()=>{
            const requestId = ++latestLoadId.current;
            try {
                if ("object" === 'undefined' || !window.electronAPI?.oauth?.getAuthStatus) return;
                const res = await window.electronAPI.oauth.getAuthStatus();
                // ignore stale responses
                if (requestId !== latestLoadId.current) return;
                if (res && res.success && res.data && res.data.isAuthenticated) {
                    const email = res.data.userEmail;
                    const picture = res.data.userPicture || (email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=4f46e5&color=fff&size=64` : undefined);
                    setAuthState({
                        isAuthenticated: true,
                        userEmail: email,
                        userName: email ? email.split('@')[0] : res.data.userName || 'Google 사용자',
                        userPicture: picture
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTH_CONTEXT', 'Auth status loaded', {
                        userEmail: email
                    });
                } else {
                    setAuthState(getDefaultAuth());
                }
            } catch (error) {
                // ignore stale errors
                if (requestId !== latestLoadId.current) return;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTH_CONTEXT', 'Failed to load auth status', error);
                setAuthState(getDefaultAuth());
            } finally{
                // mark loaded regardless of result (so UI can update safely)
                if (requestId === latestLoadId.current) setLoaded(true);
            }
        }
    }["AuthProvider.useCallback[loadAuthStatus]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // seed auth state from preload async snapshot to reduce flicker
            ({
                "AuthProvider.useEffect": async ()=>{
                    try {
                        // Try synchronous preload snapshot first to avoid waiting
                        if ("object" !== 'undefined' && window.loopSnapshot && typeof window.loopSnapshot.get === 'function') {
                            try {
                                const snap = window.loopSnapshot.get();
                                if (snap && snap.auth && snap.auth.isAuthenticated) {
                                    setAuthState({
                                        isAuthenticated: true,
                                        userEmail: snap.auth.userEmail || undefined,
                                        userName: snap.auth.userName || undefined,
                                        userPicture: snap.auth.userPicture || undefined
                                    });
                                    setLoaded(true);
                                }
                            } catch (e) {
                            // ignore sync preload errors
                            }
                        }
                        // fallback: async snapshot via electronAPI
                        if ("object" !== 'undefined' && window.electronAPI?.loopSnapshot?.getAsync) {
                            const snap = await window.electronAPI.loopSnapshot.getAsync();
                            if (snap && snap.auth && snap.auth.isAuthenticated) {
                                setAuthState({
                                    isAuthenticated: true,
                                    userEmail: snap.auth.userEmail || undefined,
                                    userName: snap.auth.userName || undefined,
                                    userPicture: snap.auth.userPicture || undefined
                                });
                                setLoaded(true);
                            }
                        }
                    } catch (e) {
                    // ignore
                    } finally{
                        // validate/refresh tokens after seeding
                        loadAuthStatus();
                    }
                }
            })["AuthProvider.useEffect"]();
            if ("object" !== 'undefined' && window.electronAPI?.on) {
                const handler = {
                    "AuthProvider.useEffect.handler": (payload)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTH_CONTEXT', 'auth-status-changed event received', payload);
                        // If the payload contains user data, update state immediately to improve UX
                        try {
                            if (payload && payload.userEmail) {
                                setAuthState({
                                    "AuthProvider.useEffect.handler": (prev)=>({
                                            ...prev,
                                            isAuthenticated: true,
                                            userEmail: payload.userEmail || prev.userEmail,
                                            userName: payload.userName || prev.userName,
                                            userPicture: payload.userPicture || prev.userPicture
                                        })
                                }["AuthProvider.useEffect.handler"]);
                                setLoaded(true);
                                return;
                            }
                        } catch (e) {
                        // continue to fallback
                        }
                        loadAuthStatus();
                    }
                }["AuthProvider.useEffect.handler"];
                window.electronAPI.on('auth-status-changed', handler);
                window.electronAPI.on('oauth-success', handler);
                const loginRequiredHandler = {
                    "AuthProvider.useEffect.loginRequiredHandler": ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTH_CONTEXT', 'oauth:login-required received - clearing auth and notifying user');
                        clearAuth();
                        try {
                            window.electronAPI.notifications.show('로그인 필요', 'Google 인증이 만료되었습니다. 다시 로그인해주세요.');
                        } catch (e) {
                        // ignore
                        }
                        // open modal to prompt user
                        setLoginModalOpen(true);
                    }
                }["AuthProvider.useEffect.loginRequiredHandler"];
                window.electronAPI.on('oauth:login-required', loginRequiredHandler);
                return ({
                    "AuthProvider.useEffect": ()=>{
                        window.electronAPI?.removeListener('auth-status-changed', handler);
                        window.electronAPI?.removeListener('oauth-success', handler);
                        window.electronAPI?.removeListener('oauth:login-required', loginRequiredHandler);
                    }
                })["AuthProvider.useEffect"];
            }
        }
    }["AuthProvider.useEffect"], [
        loadAuthStatus
    ]);
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[ctx]": ()=>({
                auth,
                loadAuthStatus,
                setAuth,
                clearAuth,
                loaded
            })
    }["AuthProvider.useMemo[ctx]"], [
        auth,
        loadAuthStatus,
        setAuth,
        clearAuth,
        loaded
    ]);
    // lazy load LoginModal to avoid SSR issues
    const LoginModal = __turbopack_context__.r("[project]/src/renderer/components/auth/LoginModal.tsx [app-client] (ecmascript)").default;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: ctx,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginModal, {
                open: loginModalOpen,
                onClose: ()=>setLoginModalOpen(false),
                onLogin: async ()=>{
                    try {
                        await window.electronAPI.oauth.startGoogleAuth();
                    } catch (e) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTH_CONTEXT', 'Failed to start google auth from modal', e);
                    }
                }
            }, void 0, false, {
                fileName: "[project]/src/renderer/contexts/AuthContext.tsx",
                lineNumber: 180,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/contexts/AuthContext.tsx",
        lineNumber: 178,
        columnNumber: 9
    }, this);
}
_s(AuthProvider, "YEC4BBB7l4AVihr/NF+k/+9RqnA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
const __TURBOPACK__default__export__ = AuthContext;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/settings/hooks/useSettings.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useSettings": (()=>useSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useSettings() {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 중복 요청 방지를 위한 ref
    const loadingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const savingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    /**
   * 🔥 CSS 변수 업데이트 함수 (폰트 설정)
   */ const updateCSSVariables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[updateCSSVariables]": ()=>{
            if (!settings) return;
            const root = document.documentElement;
            root.style.setProperty('--app-font-size', `${settings.app.fontSize}px`);
            root.style.setProperty('--app-font-family', settings.app.fontFamily);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', 'CSS variables updated', {
                fontSize: settings.app.fontSize,
                fontFamily: settings.app.fontFamily
            });
        }
    }["useSettings.useCallback[updateCSSVariables]"], [
        settings
    ]);
    /**
   * 🔥 기본값 정의 (main/settings와 동일)
   */ const defaultSettings = {
        app: {
            theme: 'system',
            language: 'ko',
            autoSave: true,
            startMinimized: false,
            minimizeToTray: true,
            fontSize: 14,
            fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
        },
        keyboard: {
            enabled: true,
            language: 'korean',
            trackAllApps: false,
            sessionTimeout: 30
        },
        ui: {
            windowWidth: 1400,
            windowHeight: 900,
            sidebarCollapsed: false,
            focusMode: false,
            showLineNumbers: true,
            showWordCount: true
        },
        performance: {
            enableGPUAcceleration: true,
            maxCPUUsage: 80,
            maxMemoryUsage: 2048,
            enableHardwareAcceleration: true
        },
        account: {
            userId: undefined,
            username: undefined,
            email: undefined,
            displayName: undefined,
            avatar: undefined,
            enableSync: false,
            syncProvider: 'local',
            syncInterval: 60,
            enableTwoFactor: false,
            authProvider: 'local',
            sessionTimeout: 60
        },
        notifications: {
            enableNotifications: true,
            enableSounds: true,
            notifyGoalAchieved: true,
            notifyDailyGoal: true,
            notifyErrors: true
        }
    };
    /**
   * 🔥 설정 로드 (중복 방지)
   */ const loadSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[loadSettings]": async ()=>{
            if (loadingRef.current) return;
            try {
                loadingRef.current = true;
                setLoading(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', 'Loading settings from main process');
                const result = await window.electronAPI.settings.getAll();
                if (result && result.success && result.data) {
                    // electron-store returns partial/full settings object; merge with defaults
                    const loaded = result.data;
                    const merged = {
                        ...defaultSettings,
                        ...loaded,
                        app: {
                            ...defaultSettings.app,
                            ...loaded.app || {}
                        },
                        keyboard: {
                            ...defaultSettings.keyboard,
                            ...loaded.keyboard || {}
                        },
                        ui: {
                            ...defaultSettings.ui,
                            ...loaded.ui || {}
                        },
                        performance: {
                            ...defaultSettings.performance,
                            ...loaded.performance || {}
                        },
                        account: {
                            ...defaultSettings.account,
                            ...loaded.account || {}
                        },
                        notifications: {
                            ...defaultSettings.notifications,
                            ...loaded.notifications || {}
                        }
                    };
                    setSettings(merged);
                    // 🔥 폰트 설정 CSS 변수 업데이트 (즉시 적용)
                    setTimeout({
                        "useSettings.useCallback[loadSettings]": ()=>{
                            const root = document.documentElement;
                            root.style.setProperty('--app-font-size', `${merged.app.fontSize}px`);
                            root.style.setProperty('--app-font-family', merged.app.fontFamily);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', 'Initial CSS font variables applied', {
                                fontSize: merged.app.fontSize,
                                fontFamily: merged.app.fontFamily
                            });
                        }
                    }["useSettings.useCallback[loadSettings]"], 0);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Settings loaded successfully', result.data);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('USE_SETTINGS', 'Failed to load settings, using defaults', result?.error);
                    setSettings(defaultSettings);
                    setError('기본 설정을 사용합니다.');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', 'Error loading settings', error);
                setSettings(defaultSettings);
                setError(error instanceof Error ? error.message : '설정 로드 중 오류가 발생했습니다.');
            } finally{
                setLoading(false);
                loadingRef.current = false;
            }
        }
    }["useSettings.useCallback[loadSettings]"], []);
    /**
   * 🔥 설정 업데이트 (타입 안전)
   */ const updateSetting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[updateSetting]": async (category, key, value)=>{
            if (!settings || savingRef.current) return;
            try {
                setSaving(true);
                savingRef.current = true;
                // 🔥 즉시 UI 업데이트 (낙관적 업데이트)
                setSettings({
                    "useSettings.useCallback[updateSetting]": (prev)=>{
                        if (!prev) return null;
                        return {
                            ...prev,
                            [category]: {
                                ...prev[category],
                                [key]: value
                            }
                        };
                    }
                }["useSettings.useCallback[updateSetting]"]);
                // 🔥 백엔드에 저장 (dot notation 사용)
                const keyPath = `${category}.${String(key)}`;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', `Updating setting: ${keyPath}`, {
                    value
                });
                const result = await window.electronAPI.settings.set(keyPath, value);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', `Setting updated successfully: ${keyPath}`, {
                        value
                    });
                    // 🔥 테마 설정의 경우 localStorage에도 즉시 저장 (백업)
                    if (category === 'app' && key === 'theme') {
                        try {
                            localStorage.setItem('loop-theme', value);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', 'Theme also saved to localStorage', {
                                theme: value
                            });
                        } catch (error) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('USE_SETTINGS', 'Failed to save theme to localStorage', error);
                        }
                    }
                    // 🔥 폰트 설정이 변경되면 CSS 변수 즉시 업데이트 (새 값으로)
                    if (category === 'app' && (key === 'fontSize' || key === 'fontFamily')) {
                        const root = document.documentElement;
                        if (key === 'fontSize') {
                            root.style.setProperty('--app-font-size', `${value}px`);
                        } else if (key === 'fontFamily') {
                            root.style.setProperty('--app-font-family', value);
                        }
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', 'CSS font variables updated immediately', {
                            key,
                            value
                        });
                    }
                } else {
                    throw new Error(result.error || `Failed to save ${keyPath}`);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', `Error updating setting: ${category}.${String(key)}`, error);
                // 🔥 에러 시 롤백
                await loadSettings();
                setError(`설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            } finally{
                setSaving(false);
                savingRef.current = false;
            }
        }
    }["useSettings.useCallback[updateSetting]"], [
        settings,
        loadSettings
    ]);
    /**
   * 🔥 모든 설정 저장 - 명시적 카테고리 저장으로 강화
   */ const saveAllSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[saveAllSettings]": async ()=>{
            if (!settings || savingRef.current) return;
            try {
                savingRef.current = true;
                setSaving(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Saving all settings...');
                // 🔥 명시적으로 모든 카테고리 저장 (누락 방지)
                const categories = [
                    'app',
                    'keyboard',
                    'ui',
                    'performance',
                    'account',
                    'notifications'
                ];
                for (const category of categories){
                    const categoryData = settings[category];
                    if (categoryData) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('USE_SETTINGS', `Saving category: ${category}`, categoryData);
                        const result = await window.electronAPI.settings.set(category, categoryData);
                        if (!result.success) {
                            throw new Error(`Failed to save ${category} settings: ${result.error}`);
                        }
                    }
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'All settings saved successfully');
                // 저장 성공 메시지 표시 (선택적)
                if ("object" !== 'undefined' && window.electronAPI?.notifications?.show) {
                    try {
                        await window.electronAPI.notifications.show('설정 저장 완료', '모든 설정이 성공적으로 저장되었습니다.');
                    } catch (e) {
                    // 알림 실패는 무시
                    }
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', 'Failed to save all settings', error);
                setError(`전체 설정 저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            } finally{
                setSaving(false);
                savingRef.current = false;
            }
        }
    }["useSettings.useCallback[saveAllSettings]"], [
        settings
    ]);
    /**
   * 🔥 설정 리셋
   */ const resetSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettings.useCallback[resetSettings]": async ()=>{
            if (savingRef.current) return;
            try {
                savingRef.current = true;
                setSaving(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Resetting all settings...');
                const result = await window.electronAPI.settings.reset();
                if (result.success) {
                    // 🔥 성공 시 기본값으로 설정하고 다시 로드
                    setSettings(defaultSettings);
                    await loadSettings();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('USE_SETTINGS', 'Settings reset successfully');
                } else {
                    throw new Error(result.error || 'Failed to reset settings');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('USE_SETTINGS', 'Failed to reset settings', error);
                setError(`설정 초기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            } finally{
                setSaving(false);
                savingRef.current = false;
            }
        }
    }["useSettings.useCallback[resetSettings]"], [
        loadSettings
    ]);
    /**
   * 🔥 초기 설정 로드
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSettings.useEffect": ()=>{
            loadSettings();
        }
    }["useSettings.useEffect"], [
        loadSettings
    ]);
    // subscribe to main process broadcasts so UI updates immediately when settings change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSettings.useEffect": ()=>{
            try {
                const unsub = window.electronAPI.settings.onDidChange?.({
                    "useSettings.useEffect": (payload)=>{
                        if (!payload || !payload.keyPath) return;
                        // dot-path merge into settings (safe with type guards)
                        setSettings({
                            "useSettings.useEffect": (prev)=>{
                                if (!prev) return prev;
                                const parts = payload.keyPath.split('.').filter(Boolean);
                                if (parts.length === 0) return prev;
                                if (parts.length === 1) {
                                    const category = parts[0];
                                    return Object.assign({}, prev, {
                                        [category]: payload.value
                                    });
                                }
                                const cat = parts[0];
                                const rest = parts.slice(1);
                                if (!cat) return prev;
                                const newCategory = Object.assign({}, prev[cat]);
                                let target = newCategory || {};
                                for(let i = 0; i < rest.length - 1; i++){
                                    const k = rest[i];
                                    if (!k) continue;
                                    if (!(k in target)) target[k] = {};
                                    target = target[k];
                                }
                                const lastKey = rest[rest.length - 1];
                                if (lastKey) target[lastKey] = payload.value;
                                return Object.assign({}, prev, {
                                    [cat]: newCategory
                                });
                            }
                        }["useSettings.useEffect"]);
                    }
                }["useSettings.useEffect"]);
                return ({
                    "useSettings.useEffect": ()=>{
                        if (typeof unsub === 'function') unsub();
                    }
                })["useSettings.useEffect"];
            } catch (e) {
                // ignore if API missing
                return ({
                    "useSettings.useEffect": ()=>{}
                })["useSettings.useEffect"];
            }
        }
    }["useSettings.useEffect"], []);
    /**
   * 🔥 에러 자동 클리어 (10초 후)
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSettings.useEffect": ()=>{
            if (error) {
                const timer = setTimeout({
                    "useSettings.useEffect.timer": ()=>{
                        setError(null);
                    }
                }["useSettings.useEffect.timer"], 10000);
                return ({
                    "useSettings.useEffect": ()=>clearTimeout(timer)
                })["useSettings.useEffect"];
            }
        }
    }["useSettings.useEffect"], [
        error
    ]);
    return {
        settings,
        loading,
        saving,
        error,
        updateSetting,
        saveAllSettings,
        resetSettings,
        setSettings
    };
}
_s(useSettings, "ho4oA+tHi0CeEaYXGAxN51D8qqc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Avatar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Avatar": (()=>Avatar),
    "AvatarFallback": (()=>AvatarFallback),
    "AvatarImage": (()=>AvatarImage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const AVATAR_STYLES = {
    root: 'relative inline-flex items-center justify-center overflow-hidden rounded-full select-none',
    sizes: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg'
    },
    image: 'aspect-square h-full w-full object-cover object-center',
    fallback: 'flex h-full w-full items-center justify-center bg-slate-100 text-slate-600 font-medium',
    icon: 'h-1/2 w-1/2 text-slate-400',
    status: {
        base: 'absolute bottom-0 right-0 rounded-full border-2 border-white',
        sizes: {
            sm: 'h-2 w-2',
            md: 'h-2.5 w-2.5',
            lg: 'h-3 w-3',
            xl: 'h-4 w-4'
        },
        variants: {
            online: 'bg-green-500',
            away: 'bg-yellow-500',
            busy: 'bg-red-500',
            offline: 'bg-slate-400'
        }
    }
};
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
const Avatar = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ size = 'md', src, alt, fallback, status, className, children, onClick, 'aria-label': ariaLabel, ...props }, ref)=>{
    _s();
    const [imageLoaded, setImageLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageError, setImageError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const avatarClassName = cn(AVATAR_STYLES.root, AVATAR_STYLES.sizes[size], onClick && 'cursor-pointer hover:opacity-80 transition-opacity', className);
    const handleClick = ()=>{
        if (!onClick) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AVATAR', 'Avatar clicked', {
            size,
            hasImage: !!src
        });
        onClick();
    };
    const handleKeyDown = (event)=>{
        if (!onClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };
    const showImage = src && !imageError && imageLoaded;
    const showFallback = !src || imageError || !imageLoaded;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: avatarClassName,
        onClick: onClick ? handleClick : undefined,
        onKeyDown: onClick ? handleKeyDown : undefined,
        role: onClick ? 'button' : undefined,
        tabIndex: onClick ? 0 : undefined,
        "aria-label": ariaLabel || alt,
        ...props,
        children: [
            src && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: src,
                alt: alt || '사용자 아바타',
                className: cn(AVATAR_STYLES.image, showImage ? 'opacity-100' : 'opacity-0'),
                onLoad: ()=>{
                    setImageLoaded(true);
                    setImageError(false);
                },
                onError: ()=>{
                    setImageError(true);
                    setImageLoaded(false);
                }
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                lineNumber: 121,
                columnNumber: 11
            }, this),
            showFallback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: AVATAR_STYLES.fallback,
                children: children || fallback ? children || fallback : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                    className: AVATAR_STYLES.icon,
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                    lineNumber: 145,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                lineNumber: 141,
                columnNumber: 11
            }, this),
            status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: cn(AVATAR_STYLES.status.base, AVATAR_STYLES.status.sizes[size], AVATAR_STYLES.status.variants[status]),
                "aria-label": `상태: ${status}`
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
                lineNumber: 152,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
        lineNumber: 109,
        columnNumber: 7
    }, this);
}, "+xC0VhkjkKdKpElgCoBFbVEZSxs=")), "+xC0VhkjkKdKpElgCoBFbVEZSxs=");
_c1 = Avatar;
Avatar.displayName = 'Avatar';
const AvatarImage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ src, alt, className, onLoadingStatusChange, ...props }, ref)=>{
    const handleLoad = ()=>{
        onLoadingStatusChange?.(false);
    };
    const handleError = ()=>{
        onLoadingStatusChange?.(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        ref: ref,
        src: src,
        alt: alt,
        className: cn(AVATAR_STYLES.image, className),
        onLoad: handleLoad,
        onError: handleError,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
        lineNumber: 180,
        columnNumber: 7
    }, this);
});
_c3 = AvatarImage;
AvatarImage.displayName = 'AvatarImage';
const AvatarFallback = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: cn(AVATAR_STYLES.fallback, className),
        ...props,
        children: children || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
            className: AVATAR_STYLES.icon,
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
            lineNumber: 203,
            columnNumber: 22
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Avatar.tsx",
        lineNumber: 198,
        columnNumber: 7
    }, this);
});
_c5 = AvatarFallback;
AvatarFallback.displayName = 'AvatarFallback';
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Avatar$forwardRef");
__turbopack_context__.k.register(_c1, "Avatar");
__turbopack_context__.k.register(_c2, "AvatarImage$forwardRef");
__turbopack_context__.k.register(_c3, "AvatarImage");
__turbopack_context__.k.register(_c4, "AvatarFallback$forwardRef");
__turbopack_context__.k.register(_c5, "AvatarFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Tooltip.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Tooltip": (()=>Tooltip),
    "TooltipContent": (()=>TooltipContent),
    "TooltipProvider": (()=>TooltipProvider),
    "TooltipTrigger": (()=>TooltipTrigger)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const TOOLTIP_STYLES = {
    trigger: 'inline-block relative',
    tooltip: 'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200',
    arrow: 'absolute w-2 h-2 bg-slate-900 transform rotate-45',
    positions: {
        top: {
            tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
            arrow: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2'
        },
        bottom: {
            tooltip: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
            arrow: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2'
        },
        left: {
            tooltip: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
            arrow: 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2'
        },
        right: {
            tooltip: 'left-full top-1/2 transform -translate-y-1/2 ml-3',
            arrow: 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2'
        }
    },
    variants: {
        default: 'bg-slate-900 text-white',
        light: 'bg-white text-slate-900 border border-slate-200 shadow-md',
        error: 'bg-red-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-yellow-600 text-white'
    }
};
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
function Tooltip({ content, children, side = 'top', variant = 'default', delay = 200, disabled = false, showArrow = true, trigger = 'hover', open: controlledOpen, onOpenChange, className, sideOffset = 0 }) {
    _s();
    const [internalOpen, setInternalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tooltipRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const isControlled = controlledOpen !== undefined;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Tooltip.useEffect": ()=>{
            setMounted(true);
            return ({
                "Tooltip.useEffect": ()=>{
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                }
            })["Tooltip.useEffect"];
        }
    }["Tooltip.useEffect"], []);
    const setOpen = (open)=>{
        if (disabled) return;
        if (isControlled) {
            onOpenChange?.(open);
        } else {
            setInternalOpen(open);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('TOOLTIP', `Tooltip ${open ? 'opened' : 'closed'}`, {
            side,
            trigger
        });
    };
    const showTooltip = ()=>{
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(()=>{
            setOpen(true);
        }, delay);
    };
    const hideTooltip = ()=>{
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setOpen(false);
    };
    const handleMouseEnter = ()=>{
        if (trigger === 'hover') {
            showTooltip();
        }
    };
    const handleMouseLeave = ()=>{
        if (trigger === 'hover') {
            hideTooltip();
        }
    };
    const handleClick = ()=>{
        if (trigger === 'click') {
            setOpen(!isOpen);
        }
    };
    const handleFocus = ()=>{
        if (trigger === 'focus') {
            showTooltip();
        }
    };
    const handleBlur = ()=>{
        if (trigger === 'focus') {
            hideTooltip();
        }
    };
    const handleKeyDown = (event)=>{
        if (event.key === 'Escape' && isOpen) {
            hideTooltip();
        }
    };
    // children에 이벤트 핸들러 추가
    const triggerElement = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(children) ? (()=>{
        const child = children;
        const childProps = child.props || {};
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(child, {
            onMouseEnter: (e)=>{
                childProps.onMouseEnter?.(e);
                handleMouseEnter();
            },
            onMouseLeave: (e)=>{
                childProps.onMouseLeave?.(e);
                handleMouseLeave();
            },
            onClick: (e)=>{
                childProps.onClick?.(e);
                handleClick();
            },
            onFocus: (e)=>{
                childProps.onFocus?.(e);
                handleFocus();
            },
            onBlur: (e)=>{
                childProps.onBlur?.(e);
                handleBlur();
            },
            onKeyDown: (e)=>{
                childProps.onKeyDown?.(e);
                handleKeyDown(e);
            },
            'aria-describedby': isOpen ? 'tooltip' : undefined
        });
    })() : children;
    // Tooltip 스타일 계산
    const tooltipClassName = cn(TOOLTIP_STYLES.tooltip, TOOLTIP_STYLES.positions[side].tooltip, TOOLTIP_STYLES.variants[variant], isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none', className);
    const arrowClassName = cn(TOOLTIP_STYLES.arrow, TOOLTIP_STYLES.positions[side].arrow, variant === 'light' ? 'bg-white border-l border-t border-slate-200' : 'bg-slate-900');
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: TOOLTIP_STYLES.trigger,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/ui/Tooltip.tsx",
            lineNumber: 189,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: TOOLTIP_STYLES.trigger,
        children: [
            triggerElement,
            isOpen && content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: tooltipRef,
                id: "tooltip",
                role: "tooltip",
                className: tooltipClassName,
                style: {
                    [side === 'top' || side === 'bottom' ? 'marginTop' : 'marginLeft']: side === 'top' || side === 'left' ? -sideOffset : sideOffset
                },
                children: [
                    content,
                    showArrow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: arrowClassName,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Tooltip.tsx",
                        lineNumber: 208,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/Tooltip.tsx",
                lineNumber: 196,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/Tooltip.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
_s(Tooltip, "opuZ+KBhXBwA6xiWO5uYB+f+WR8=");
_c = Tooltip;
const TooltipProvider = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
};
_c1 = TooltipProvider;
const TooltipTrigger = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
};
_c2 = TooltipTrigger;
const TooltipContent = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
};
_c3 = TooltipContent;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Tooltip");
__turbopack_context__.k.register(_c1, "TooltipProvider");
__turbopack_context__.k.register(_c2, "TooltipTrigger");
__turbopack_context__.k.register(_c3, "TooltipContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Badge.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Badge": (()=>Badge)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
'use client';
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const BADGE_STYLES = {
    base: 'inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    sizes: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
    },
    variants: {
        default: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
        primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        danger: 'bg-red-100 text-red-800 hover:bg-red-200',
        purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        solid: 'bg-slate-900 text-white hover:bg-slate-800',
        outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50'
    },
    interactive: 'cursor-pointer select-none',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none'
};
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
const Badge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ variant = 'default', size = 'md', interactive = false, disabled = false, className, children, onClick, role, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed, ...props }, ref)=>{
    const badgeClassName = cn(BADGE_STYLES.base, BADGE_STYLES.variants[variant], BADGE_STYLES.sizes[size], interactive && BADGE_STYLES.interactive, disabled && BADGE_STYLES.disabled, className);
    const handleClick = ()=>{
        if (disabled || !onClick) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('BADGE', `Badge clicked: ${variant}`, {
            size,
            interactive
        });
        onClick();
    };
    const handleKeyDown = (event)=>{
        if (disabled || !onClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: ref,
        className: badgeClassName,
        onClick: interactive ? handleClick : undefined,
        onKeyDown: interactive ? handleKeyDown : undefined,
        role: interactive ? role || 'button' : role,
        tabIndex: interactive && !disabled ? 0 : undefined,
        "aria-label": ariaLabel,
        "aria-pressed": interactive ? ariaPressed : undefined,
        "aria-disabled": disabled,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Badge.tsx",
        lineNumber: 88,
        columnNumber: 7
    }, this);
});
_c1 = Badge;
Badge.displayName = 'Badge';
var _c, _c1;
__turbopack_context__.k.register(_c, "Badge$forwardRef");
__turbopack_context__.k.register(_c1, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/layout/AppSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AppSidebar": (()=>AppSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/hooks/useSettings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as Folder>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
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
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const SIDEBAR_STYLES = {
    container: 'flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 min-w-0',
    collapsed: 'w-16',
    expanded: 'w-64',
    logoSection: 'h-auto min-h-[4rem] flex flex-col justify-center border-b border-slate-200 dark:border-slate-700 px-6 py-3',
    logoCollapsed: 'h-auto min-h-[8rem] flex items-center justify-center border-b border-slate-200 dark:border-slate-700 px-3 py-4',
    logoText: 'text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
    logoIcon: 'w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm',
    profileSection: 'border-b border-slate-200 dark:border-slate-700 p-4',
    profileCollapsed: 'border-b border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center gap-2',
    profileContent: 'flex items-center gap-3',
    profileInfo: 'flex-1',
    profileName: 'font-medium text-slate-900 dark:text-slate-100 text-sm',
    profileStatus: 'flex items-center gap-1 mt-0.5',
    statusDot: 'w-1.5 h-1.5 bg-green-500 rounded-full',
    statusText: 'text-xs text-slate-500 dark:text-slate-400',
    collapseButton: 'h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
    navSection: 'flex-1 py-4',
    navList: 'space-y-1 px-3',
    navItem: 'flex items-center h-10 px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 group cursor-pointer',
    navItemActive: 'flex items-center h-10 px-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg font-medium',
    navItemCollapsed: 'flex items-center justify-center h-10 w-10 mx-auto text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 cursor-pointer',
    navItemActiveCollapsed: 'flex items-center justify-center h-10 w-10 mx-auto bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg',
    icon: 'w-5 h-5 group-hover:scale-110 transition-transform duration-150 flex-shrink-0',
    iconCollapsed: 'w-5 h-5',
    text: 'ml-3 font-medium',
    badge: 'ml-auto',
    bottomSection: 'border-t border-slate-200 dark:border-slate-700 p-3'
};
// 🔥 기가차드 규칙: 상수 분리
const SIDEBAR_ITEMS = [
    {
        id: 'dashboard',
        label: '대시보드',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        href: '/',
        ariaLabel: '대시보드로 이동'
    },
    {
        id: 'projects',
        label: '프로젝트',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"],
        href: '/projects',
        ariaLabel: '프로젝트 관리로 이동'
    },
    {
        id: 'analytics',
        label: '통계',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        href: '/analytics',
        ariaLabel: '분석 및 통계로 이동'
    },
    {
        id: 'ai',
        label: 'Loop AI',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
        href: '/ai',
        badge: 2,
        ariaLabel: 'AI 도구로 이동'
    },
    {
        id: 'settings',
        label: '설정',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        href: '/settings',
        ariaLabel: '설정으로 이동'
    }
];
function AppSidebar({ activeRoute = '/', onNavigate, collapsed: controlledCollapsed, onToggleCollapse }) {
    _s();
    const [internalCollapsed, setInternalCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;
    const authCtx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { auth: googleUserInfo, loadAuthStatus, loaded: authLoaded } = authCtx;
    // settings hook for account-local profile (displayName, avatar)
    const { settings: loadedSettings, loading: settingsLoading, setSettings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    // avatar src state to handle onError fallback and controlled updates
    const defaultAvatar = '/static/avatar-default.png';
    const [avatarSrc, setAvatarSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Use consistent initial state to prevent layout shift
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isOnline, setIsOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // Default to online to prevent flash
    // Prefer account settings when not authenticated via Google. If Google auth present, use google profile.
    const accountProfile = loadedSettings?.account;
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // unify visible profile for legacy UI uses
    const visibleProfile = authLoaded && googleUserInfo && googleUserInfo.isAuthenticated ? googleUserInfo : accountProfile ? {
        isAuthenticated: !!(accountProfile.displayName || accountProfile.username || accountProfile.email),
        userName: accountProfile.displayName || accountProfile.username,
        userEmail: accountProfile.email,
        userPicture: accountProfile.avatar
    } : null;
    // update avatarSrc when authLoaded, googleUserInfo, or account settings change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppSidebar.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Avatar update triggered', {
                authLoaded,
                googleUserInfoAuthenticated: googleUserInfo?.isAuthenticated,
                accountProfileExists: !!accountProfile,
                accountProfileAvatar: accountProfile?.avatar,
                accountProfileAvatarThumb: accountProfile?.avatarThumb
            });
            // 🔥 수정: 로컬 아바타 설정이 있으면 그것을 우선으로 사용
            if (accountProfile?.avatar) {
                const avatarValue = accountProfile.avatar;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Using local account profile avatar (priority)', {
                    avatarValue
                });
                const v = String(avatarValue);
                if (v.startsWith('file://')) {
                    const path = v.replace(/^file:\/\//, '');
                    window.electronAPI.files?.readFileAsDataUrl(path).then({
                        "AppSidebar.useEffect": (r)=>{
                            if (r && r.success && r.data) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Loaded file:// avatar as data URL');
                                setAvatarSrc(r.data);
                            } else {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('APPSIDEBAR', 'Failed to load file:// avatar');
                                setAvatarSrc(null);
                            }
                        }
                    }["AppSidebar.useEffect"]).catch({
                        "AppSidebar.useEffect": ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('APPSIDEBAR', 'Error loading file:// avatar');
                            setAvatarSrc(null);
                        }
                    }["AppSidebar.useEffect"]);
                } else if (v.startsWith('loop-avatar://') || v.startsWith('data:')) {
                    // 🔥 loop-avatar:// 프로토콜과 data: URL 모두 직접 사용
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Using loop-avatar:// or data: URL', {
                        url: v.substring(0, 50) + '...'
                    });
                    setAvatarSrc(v);
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Using direct avatar URL', {
                        url: v
                    });
                    setAvatarSrc(v);
                }
                return; // 로컬 아바타가 있으면 Google 아바타 사용하지 않음
            }
            // prefer Google authenticated profile when available (only if no local avatar)
            if (authLoaded && googleUserInfo && googleUserInfo.isAuthenticated) {
                const picture = googleUserInfo.userPicture || (googleUserInfo.userEmail ? `https://ui-avatars.com/api/?name=${encodeURIComponent(googleUserInfo.userEmail)}&background=4f46e5&color=fff&size=64` : undefined);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Using Google profile picture (fallback)', {
                    picture
                });
                setAvatarSrc(picture || null);
                return;
            }
            // fallback to generated avatar or null
            if (accountProfile && (accountProfile.displayName || accountProfile.username || accountProfile.email)) {
                const name = String(accountProfile.displayName || accountProfile.username || accountProfile.email || '');
                const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=64`;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Using fallback generated avatar', {
                    name,
                    fallbackUrl
                });
                setAvatarSrc(fallbackUrl);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'No avatar data available, setting to null');
                setAvatarSrc(null);
            }
        }
    }["AppSidebar.useEffect"], [
        authLoaded,
        googleUserInfo,
        accountProfile
    ]);
    // subscribe to settings change broadcast for account.avatar and other profile fields
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppSidebar.useEffect": ()=>{
            try {
                const unsub = window.electronAPI.settings.onDidChange?.({
                    "AppSidebar.useEffect": (payload)=>{
                        if (!payload || !payload.keyPath) return;
                        // handle avatar and avatarThumb changes
                        if (payload.keyPath === 'account.avatar' || payload.keyPath === 'account.avatarThumb') {
                            const val = payload.value;
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Avatar setting changed via broadcast', {
                                keyPath: payload.keyPath,
                                hasValue: !!val,
                                valuePrefix: val?.substring(0, 50) + '...' || 'null'
                            });
                            if (!val) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Avatar value is null, clearing avatarSrc');
                                setAvatarSrc(null);
                                return;
                            }
                            if (val.startsWith('file://')) {
                                const p = val.replace(/^file:\/\//, '');
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Loading file:// avatar from broadcast', {
                                    path: p
                                });
                                window.electronAPI.files?.readFileAsDataUrl(p).then({
                                    "AppSidebar.useEffect": (r)=>{
                                        if (r && r.success && r.data) {
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Successfully loaded file:// avatar from broadcast');
                                            setAvatarSrc(r.data);
                                        }
                                    }
                                }["AppSidebar.useEffect"]).catch({
                                    "AppSidebar.useEffect": ()=>{
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('APPSIDEBAR', 'Failed to load file:// avatar from broadcast');
                                    }
                                }["AppSidebar.useEffect"]);
                            } else {
                                // 🔥 data: URL과 loop-avatar:// 프로토콜 모두 직접 사용
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('APPSIDEBAR', 'Setting avatar from broadcast', {
                                    valuePrefix: val.substring(0, 50) + '...'
                                });
                                setAvatarSrc(val);
                            }
                        }
                        // for other account.* changes, trigger settings re-fetch to update display name etc
                        if (payload.keyPath.startsWith('account.') && payload.keyPath !== 'account.avatar') {
                        // Force settings hook to re-merge (this will trigger accountProfile change)
                        // The useSettings hook already subscribes to onDidChange and updates its state
                        }
                    }
                }["AppSidebar.useEffect"]);
                return ({
                    "AppSidebar.useEffect": ()=>{
                        if (typeof unsub === 'function') unsub();
                    }
                })["AppSidebar.useEffect"];
            } catch (e) {
                return;
            }
        }
    }["AppSidebar.useEffect"], []);
    // handle avatar click -> upload when local account, open settings when Google-auth
    const handleAvatarClick = ()=>{
        if (authLoaded && googleUserInfo && googleUserInfo.isAuthenticated) {
            onNavigate?.('/settings');
            return;
        }
        fileInputRef.current?.click();
    };
    const handleFileChange = async (ev)=>{
        const f = ev.target.files?.[0];
        if (!f) return;
        // Size limit check (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (f.size > maxSize) {
            alert('파일 크기가 5MB를 초과합니다. 더 작은 파일을 선택해주세요.');
            return;
        }
        const reader = new FileReader();
        reader.onload = async ()=>{
            const dataUrl = reader.result;
            try {
                const res = await window.electronAPI.settings.set('account.avatar', dataUrl);
                if (res && res.success) {
                    // Don't update local settings state manually - onDidChange will handle it
                    // Just log success
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SIDEBAR', 'Avatar uploaded successfully');
                } else {
                    throw new Error(res?.error || 'save failed');
                }
            } catch (e) {
                console.error('Failed to save avatar to settings', e);
                alert('프로필 저장에 실패했습니다');
            }
        };
        reader.readAsDataURL(f);
    };
    // Synchronous state restoration to prevent flash
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "AppSidebar.useLayoutEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    // Load online status first
                    const snap = window.loopSnapshot && typeof window.loopSnapshot.get === 'function' ? window.loopSnapshot.get() : null;
                    if (snap && typeof snap.online === 'boolean') {
                        setIsOnline(snap.online);
                    } else {
                        setIsOnline(navigator.onLine);
                    }
                } catch (e) {
                    setIsOnline(navigator.onLine);
                }
            }
            setMounted(true);
        }
    }["AppSidebar.useLayoutEffect"], []);
    // Online/offline event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppSidebar.useEffect": ()=>{
            if (!mounted) return;
            const handleOnline = {
                "AppSidebar.useEffect.handleOnline": ()=>setIsOnline(true)
            }["AppSidebar.useEffect.handleOnline"];
            const handleOffline = {
                "AppSidebar.useEffect.handleOffline": ()=>setIsOnline(false)
            }["AppSidebar.useEffect.handleOffline"];
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            return ({
                "AppSidebar.useEffect": ()=>{
                    window.removeEventListener('online', handleOnline);
                    window.removeEventListener('offline', handleOffline);
                }
            })["AppSidebar.useEffect"];
        }
    }["AppSidebar.useEffect"], [
        mounted
    ]);
    // no extra sync needed - AuthContext bootstraps initial state from server
    const handleToggleCollapse = ()=>{
        if (isControlled) {
            onToggleCollapse?.();
        } else {
            setInternalCollapsed(!collapsed);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SIDEBAR', `Sidebar ${collapsed ? 'expanded' : 'collapsed'}`);
    };
    const handleNavigate = (item)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SIDEBAR', `Navigation to ${item.label}`, {
            href: item.href
        });
        onNavigate?.(item.href);
    };
    const handleKeyDown = (event, item)=>{
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleNavigate(item);
        }
    };
    const renderNavItem = (item)=>{
        const isActive = activeRoute === item.href;
        const Icon = item.icon;
        const navItemContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: collapsed ? isActive ? SIDEBAR_STYLES.navItemActiveCollapsed : SIDEBAR_STYLES.navItemCollapsed : isActive ? SIDEBAR_STYLES.navItemActive : SIDEBAR_STYLES.navItem,
            role: "button",
            tabIndex: 0,
            onClick: ()=>handleNavigate(item),
            onKeyDown: (e)=>handleKeyDown(e, item),
            "aria-label": item.ariaLabel || item.label,
            "aria-current": isActive ? 'page' : undefined,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: collapsed ? SIDEBAR_STYLES.iconCollapsed : SIDEBAR_STYLES.icon
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, this),
                !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: SIDEBAR_STYLES.text,
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                            lineNumber: 389,
                            columnNumber: 13
                        }, this),
                        item.badge && item.badge > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "danger",
                            size: "sm",
                            className: SIDEBAR_STYLES.badge,
                            children: item.badge > 9 ? '9+' : item.badge
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                            lineNumber: 391,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
            lineNumber: 369,
            columnNumber: 7
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                content: item.label,
                side: "right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: navItemContent
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                    lineNumber: 404,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                lineNumber: 403,
                columnNumber: 11
            }, this) : navItemContent
        }, item.id, false, {
            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
            lineNumber: 401,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `${SIDEBAR_STYLES.container} ${collapsed ? SIDEBAR_STYLES.collapsed : SIDEBAR_STYLES.expanded}`,
        "aria-label": "사이드바 네비게이션",
        role: "navigation",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: collapsed ? SIDEBAR_STYLES.logoCollapsed : SIDEBAR_STYLES.logoSection,
                children: collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-3 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: SIDEBAR_STYLES.logoIcon,
                            children: "L"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                            lineNumber: 426,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors mt-2",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SIDEBAR', 'User profile clicked (collapsed)');
                                onNavigate?.('/settings');
                            },
                            role: "button",
                            tabIndex: 0,
                            "aria-label": "사용자 프로필",
                            children: [
                                !authLoaded && settingsLoading ? // loading skeleton
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 441,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                    size: "md",
                                    src: avatarSrc || undefined,
                                    "aria-label": accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'Loop 사용자',
                                    className: "border-2 border-white dark:border-slate-800 shadow-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium",
                                        children: (accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'L').charAt(0).toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                        lineNumber: 449,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 443,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: isOnline ? 'w-1.5 h-1.5 bg-green-500 rounded-full' : 'w-1.5 h-1.5 bg-gray-400 rounded-full'
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 452,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                            lineNumber: 429,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            className: SIDEBAR_STYLES.collapseButton,
                            onClick: handleToggleCollapse,
                            "aria-label": "사이드바 확장",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                lineNumber: 462,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                            lineNumber: 455,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                    lineNumber: 425,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: SIDEBAR_STYLES.logoText,
                                    children: "Loop"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 468,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "sm",
                                    className: SIDEBAR_STYLES.collapseButton,
                                    onClick: handleToggleCollapse,
                                    "aria-label": "사이드바 축소",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                        lineNumber: 476,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 469,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                            lineNumber: 467,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('SIDEBAR', 'User profile clicked');
                                onNavigate?.('/settings');
                            },
                            role: "button",
                            tabIndex: 0,
                            "aria-label": "사용자 프로필",
                            children: [
                                !authLoaded && settingsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 492,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                    size: "lg",
                                    src: avatarSrc || undefined,
                                    "aria-label": accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'Loop 사용자',
                                    className: "border-2 border-white dark:border-slate-800 shadow-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-medium",
                                        children: (accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'L').charAt(0).toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                        lineNumber: 500,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 494,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-medium text-slate-900 dark:text-slate-100 text-sm",
                                            children: // skeleton for name until authLoaded
                                            !authLoaded && settingsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                                lineNumber: 507,
                                                columnNumber: 21
                                            }, this) : accountProfile?.displayName || accountProfile?.username || accountProfile?.email || (googleUserInfo?.isAuthenticated ? googleUserInfo.userName || googleUserInfo.userEmail : null) || 'Loop 사용자'
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                            lineNumber: 504,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1 mt-0.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: isOnline ? 'w-1.5 h-1.5 bg-green-500 rounded-full' : 'w-1.5 h-1.5 bg-gray-400 rounded-full'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    suppressHydrationWarning: true,
                                                    className: "text-xs text-slate-500 dark:text-slate-400",
                                                    children: !authLoaded ? '상태 확인 중...' : googleUserInfo?.isAuthenticated ? 'Google 계정' : accountProfile?.displayName || accountProfile?.username || accountProfile?.email ? '로컬 계정' : isOnline ? '온라인' : '오프라인'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                                    lineNumber: 515,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                            lineNumber: 513,
                                            columnNumber: 17
                                        }, this),
                                        visibleProfile && visibleProfile.isAuthenticated && visibleProfile.userEmail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-slate-500 dark:text-slate-400 mt-1 transition-opacity duration-200",
                                            children: visibleProfile.userEmail
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                            lineNumber: 520,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                                    lineNumber: 503,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                            lineNumber: 481,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                    lineNumber: 466,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: SIDEBAR_STYLES.navSection,
                "aria-label": "메인 메뉴",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: SIDEBAR_STYLES.navList,
                    children: SIDEBAR_ITEMS.map(renderNavItem)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                    lineNumber: 530,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
                lineNumber: 529,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/layout/AppSidebar.tsx",
        lineNumber: 416,
        columnNumber: 5
    }, this);
}
_s(AppSidebar, "nOLbeu/d4nPvagYw9K+mmXq/dLg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
_c = AppSidebar;
var _c;
__turbopack_context__.k.register(_c, "AppSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/Input.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Input": (()=>Input),
    "SearchInput": (()=>SearchInput)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const INPUT_STYLES = {
    base: 'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-blue-400',
    sizes: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base'
    },
    variants: {
        default: 'border-slate-300 focus:ring-blue-500',
        error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
        success: 'border-green-300 focus:ring-green-500 focus:border-green-500'
    },
    withIcon: {
        left: 'pl-10',
        right: 'pr-10'
    },
    container: 'relative w-full',
    iconContainer: {
        left: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500',
        right: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500'
    },
    iconButton: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer transition-colors'
};
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
const Input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_s(({ className, type = 'text', size = 'md', variant = 'default', leftIcon, rightIcon, clearable = false, label, error, helperText, required = false, disabled, value, onChange, onClear, ...props }, ref)=>{
    _s();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isPassword = type === 'password';
    const hasValue = value !== undefined && value !== '';
    const showClearButton = clearable && hasValue && !disabled;
    const showPasswordToggle = isPassword && !disabled;
    const inputClassName = cn(INPUT_STYLES.base, INPUT_STYLES.sizes[size], INPUT_STYLES.variants[error ? 'error' : variant], leftIcon ? INPUT_STYLES.withIcon.left : false, rightIcon || showClearButton || showPasswordToggle ? INPUT_STYLES.withIcon.right : false, className);
    const handleClear = ()=>{
        if (onClear) {
            onClear();
        } else if (onChange) {
            // 클리어 이벤트 시뮬레이션
            const event = {
                target: {
                    value: ''
                },
                currentTarget: {
                    value: ''
                }
            };
            onChange(event);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('INPUT', 'Input cleared');
    };
    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('INPUT', `Password visibility toggled: ${!showPassword}`);
    };
    const handleFocus = (event)=>{
        setFocused(true);
        props.onFocus?.(event);
    };
    const handleBlur = (event)=>{
        setFocused(false);
        props.onBlur?.(event);
    };
    const actualType = isPassword && showPassword ? 'text' : type;
    const _uid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const labelId = label ? `input-${_uid}-label` : undefined;
    const errorId = error ? `input-${_uid}-error` : undefined;
    const helperId = helperText ? `input-${_uid}-helper` : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                id: labelId,
                htmlFor: props.id,
                className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500 ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Input.tsx",
                        lineNumber: 133,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/Input.tsx",
                lineNumber: 127,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: INPUT_STYLES.container,
                children: [
                    leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: INPUT_STYLES.iconContainer.left,
                        children: leftIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Input.tsx",
                        lineNumber: 141,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: ref,
                        type: actualType,
                        className: inputClassName,
                        disabled: disabled,
                        value: value,
                        onChange: onChange,
                        onFocus: handleFocus,
                        onBlur: handleBlur,
                        "aria-labelledby": labelId,
                        "aria-describedby": cn(errorId && errorId, helperId && helperId) || undefined,
                        "aria-invalid": !!error,
                        "aria-required": required,
                        ...props
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Input.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: INPUT_STYLES.iconContainer.right,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1",
                            children: [
                                showClearButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: cn(INPUT_STYLES.iconButton, 'p-0.5'),
                                    onClick: handleClear,
                                    "aria-label": "입력 내용 지우기",
                                    tabIndex: -1,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/ui/Input.tsx",
                                        lineNumber: 178,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/ui/Input.tsx",
                                    lineNumber: 171,
                                    columnNumber: 17
                                }, this),
                                showPasswordToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: cn(INPUT_STYLES.iconButton, 'p-0.5'),
                                    onClick: togglePasswordVisibility,
                                    "aria-label": showPassword ? '패스워드 숨기기' : '패스워드 보기',
                                    tabIndex: -1,
                                    children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/ui/Input.tsx",
                                        lineNumber: 192,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/ui/Input.tsx",
                                        lineNumber: 194,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/ui/Input.tsx",
                                    lineNumber: 184,
                                    columnNumber: 17
                                }, this),
                                rightIcon && !showClearButton && !showPasswordToggle && rightIcon
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/ui/Input.tsx",
                            lineNumber: 168,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/ui/Input.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/ui/Input.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: errorId,
                className: "mt-2 text-sm text-red-600 dark:text-red-400",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Input.tsx",
                lineNumber: 207,
                columnNumber: 11
            }, this),
            helperText && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: helperId,
                className: "mt-2 text-sm text-slate-500 dark:text-slate-400",
                children: helperText
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/ui/Input.tsx",
                lineNumber: 218,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/ui/Input.tsx",
        lineNumber: 124,
        columnNumber: 7
    }, this);
}, "Yzz/lRXTxymxAbvUZQs+7OhZRcU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
}));
_c = Input;
Input.displayName = 'Input';
const SearchInput = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c1 = (props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
        ref: ref,
        type: "search",
        leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/ui/Input.tsx",
            lineNumber: 239,
            columnNumber: 19
        }, void 0),
        placeholder: "검색...",
        clearable: true,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/renderer/components/ui/Input.tsx",
        lineNumber: 236,
        columnNumber: 7
    }, this);
});
_c2 = SearchInput;
SearchInput.displayName = 'SearchInput';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Input");
__turbopack_context__.k.register(_c1, "SearchInput$forwardRef");
__turbopack_context__.k.register(_c2, "SearchInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/ui/HydrationGuard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "HydrationGuard": (()=>HydrationGuard),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function HydrationGuard({ children, fallback = null }) {
    _s();
    const [isHydrated, setIsHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HydrationGuard.useEffect": ()=>{
            setIsHydrated(true);
        }
    }["HydrationGuard.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: isHydrated ? children : fallback
    }, void 0, false);
}
_s(HydrationGuard, "I77IOq3pAPHaLortJPfCkmuM/a0=");
_c = HydrationGuard;
const __TURBOPACK__default__export__ = HydrationGuard;
var _c;
__turbopack_context__.k.register(_c, "HydrationGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/contexts/GlobalMonitoringContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "MonitoringContext": (()=>MonitoringContext),
    "MonitoringProvider": (()=>MonitoringProvider),
    "useMonitoring": (()=>useMonitoring)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const MonitoringContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// 🔥 초기 상태 상수화 (메모리 최적화)
const INITIAL_STATE = {
    isMonitoring: false,
    isAIOpen: false,
    startTime: null,
    sessionData: {
        wpm: 0,
        words: 0,
        time: 0
    }
};
function MonitoringProvider({ children }) {
    _s();
    // 🔥 하이드레이션 불일치 완전 해결: 서버와 클라이언트 동일한 초기값
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_STATE);
    // 🔥 클라이언트 마운트 후 localStorage에서 상태 복원 (모니터링은 항상 false로 시작)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "MonitoringProvider.useLayoutEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const savedState = localStorage.getItem('monitoring-state');
                    if (savedState) {
                        const parsed = JSON.parse(savedState);
                        setState({
                            "MonitoringProvider.useLayoutEffect": (prev)=>({
                                    ...prev,
                                    // 🔥 모니터링은 항상 false로 시작 (사용자 수동 시작 원칙)
                                    isMonitoring: false,
                                    isAIOpen: parsed.isAIOpen || false,
                                    startTime: null,
                                    sessionData: {
                                        ...prev.sessionData,
                                        ...parsed.sessionData
                                    }
                                })
                        }["MonitoringProvider.useLayoutEffect"]);
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MONITORING_CONTEXT', 'State restored from localStorage (monitoring disabled)', {
                            ...parsed,
                            isMonitoring: false
                        });
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTEXT', 'Failed to load state from localStorage', error);
                }
            }
        }
    }["MonitoringProvider.useLayoutEffect"], []);
    // 🔥 상태 변경 시 localStorage에 저장 (즉시 실행) - 디바운스 적용
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "MonitoringProvider.useLayoutEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const timeoutId = setTimeout({
                    "MonitoringProvider.useLayoutEffect.timeoutId": ()=>{
                        try {
                            localStorage.setItem('monitoring-state', JSON.stringify(state));
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('MONITORING_CONTEXT', 'State saved to localStorage', state);
                        } catch (error) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTEXT', 'Failed to save state to localStorage', error);
                        }
                    }
                }["MonitoringProvider.useLayoutEffect.timeoutId"], 100); // 100ms 디바운스
                return ({
                    "MonitoringProvider.useLayoutEffect": ()=>clearTimeout(timeoutId)
                })["MonitoringProvider.useLayoutEffect"];
            }
        }
    }["MonitoringProvider.useLayoutEffect"], [
        state
    ]);
    const startMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitoringProvider.useCallback[startMonitoring]": async ()=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTEXT', '🚀 모니터링 시작 요청');
                // 🔥 버튼 깜빡임 방지: 즉시 상태 업데이트 (낙관적 업데이트)
                setState({
                    "MonitoringProvider.useCallback[startMonitoring]": (prev)=>({
                            ...prev,
                            isMonitoring: true,
                            startTime: new Date()
                        })
                }["MonitoringProvider.useCallback[startMonitoring]"]);
                // 🔥 백엔드 요청
                const result = await window.electronAPI.keyboard.startMonitoring();
                if (!result.success) {
                    // 🔥 실패 시 상태 롤백
                    setState({
                        "MonitoringProvider.useCallback[startMonitoring]": (prev)=>({
                                ...prev,
                                isMonitoring: false,
                                startTime: null
                            })
                    }["MonitoringProvider.useCallback[startMonitoring]"]);
                    // 🔥 권한 관련 에러인지 확인
                    const isPermissionError = result.error && (result.error.includes('권한') || result.error.includes('permission') || result.error.includes('accessibility'));
                    if (isPermissionError) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('MONITORING_CONTEXT', '⚠️ 권한 필요:', result.error);
                        // TODO: 권한 요청 모달 표시
                        alert(`접근성 권한이 필요합니다.\n\n시스템 설정 → 보안 및 개인정보보호 → 개인정보보호 → 접근성\n에서 Loop 앱을 허용해주세요.`);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTEXT', '❌ 모니터링 시작 실패:', result.error);
                    }
                    throw new Error(result.error || 'Failed to start monitoring');
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTEXT', '✅ 모니터링 시작 성공!');
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTEXT', 'Error starting monitoring', error);
                // 🔥 에러 시 상태 롤백 확실히 실행
                setState({
                    "MonitoringProvider.useCallback[startMonitoring]": (prev)=>({
                            ...prev,
                            isMonitoring: false,
                            startTime: null
                        })
                }["MonitoringProvider.useCallback[startMonitoring]"]);
                throw error;
            }
        }
    }["MonitoringProvider.useCallback[startMonitoring]"], []);
    const stopMonitoring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitoringProvider.useCallback[stopMonitoring]": async ()=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTEXT', 'Stopping monitoring');
                // 🔥 버튼 깜빡임 방지: 즉시 상태 업데이트
                setState({
                    "MonitoringProvider.useCallback[stopMonitoring]": (prev)=>({
                            ...prev,
                            isMonitoring: false,
                            startTime: null
                        })
                }["MonitoringProvider.useCallback[stopMonitoring]"]);
                const result = await window.electronAPI.keyboard.stopMonitoring();
                if (!result.success) {
                    // 실패 시 상태 롤백
                    setState({
                        "MonitoringProvider.useCallback[stopMonitoring]": (prev)=>({
                                ...prev,
                                isMonitoring: true,
                                startTime: new Date()
                            })
                    }["MonitoringProvider.useCallback[stopMonitoring]"]);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTEXT', 'Failed to stop monitoring', result.error);
                    throw new Error(result.error || 'Failed to stop monitoring');
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTEXT', 'Monitoring stopped successfully');
            } catch (error) {
                // 에러 시 상태 롤백 (모니터링 재개)
                setState({
                    "MonitoringProvider.useCallback[stopMonitoring]": (prev)=>({
                            ...prev,
                            isMonitoring: true,
                            startTime: new Date()
                        })
                }["MonitoringProvider.useCallback[stopMonitoring]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('MONITORING_CONTEXT', 'Error stopping monitoring', error);
                throw error;
            }
        }
    }["MonitoringProvider.useCallback[stopMonitoring]"], []);
    const toggleAI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitoringProvider.useCallback[toggleAI]": ()=>{
            setState({
                "MonitoringProvider.useCallback[toggleAI]": (prev)=>({
                        ...prev,
                        isAIOpen: !prev.isAIOpen
                    })
            }["MonitoringProvider.useCallback[toggleAI]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('MONITORING_CONTEXT', 'AI Panel toggled');
        }
    }["MonitoringProvider.useCallback[toggleAI]"], []);
    const updateSessionData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MonitoringProvider.useCallback[updateSessionData]": (data)=>{
            setState({
                "MonitoringProvider.useCallback[updateSessionData]": (prev)=>({
                        ...prev,
                        sessionData: {
                            ...prev.sessionData,
                            ...data
                        }
                    })
            }["MonitoringProvider.useCallback[updateSessionData]"]);
        }
    }["MonitoringProvider.useCallback[updateSessionData]"], []);
    // 🔥 컨텍스트 값 메모화 (성능 최적화)
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MonitoringProvider.useMemo[contextValue]": ()=>({
                state,
                startMonitoring,
                stopMonitoring,
                toggleAI,
                updateSessionData
            })
    }["MonitoringProvider.useMemo[contextValue]"], [
        state,
        startMonitoring,
        stopMonitoring,
        toggleAI,
        updateSessionData
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MonitoringContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/renderer/contexts/GlobalMonitoringContext.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
_s(MonitoringProvider, "gYEeQ5+Y8vx3fFiNz0mUxi+3Xek=");
_c = MonitoringProvider;
function useMonitoring() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(MonitoringContext);
    if (context === undefined) {
        throw new Error('useMonitoring must be used within a MonitoringProvider');
    }
    return context;
}
_s1(useMonitoring, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "MonitoringProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/layout/AppHeader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AppHeader": (()=>AppHeader)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$HydrationGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/HydrationGuard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/contexts/GlobalMonitoringContext.tsx [app-client] (ecmascript)");
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
// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - macOS 스타일
const HEADER_STYLES = {
    container: 'h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-6 z-80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60',
    leftSection: 'flex items-center space-x-4 min-w-0',
    menuButton: 'lg:hidden',
    // make search responsive: full width on small screens, flexible on md+ with sensible min/max to avoid overflow
    searchContainer: 'relative hidden md:block md:flex-1 md:min-w-[260px] md:max-w-md w-full max-w-full min-w-0',
    rightSection: 'flex items-center space-x-3',
    notificationButton: 'relative',
    userSection: 'flex items-center space-x-2',
    userName: 'hidden sm:block font-medium text-slate-900 dark:text-slate-100'
};
function AppHeader({ onMenuToggle, user, notificationCount = 0, onSearch, onNotificationClick, onUserClick }) {
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitoring"])();
    const { isMonitoring } = state;
    const handleSearch = (event)=>{
        event.preventDefault();
        if (searchQuery.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('HEADER', 'Search performed', {
                query: searchQuery
            });
            onSearch?.(searchQuery.trim());
        }
    };
    const handleSearchChange = (event)=>{
        setSearchQuery(event.target.value);
    };
    const handleNotificationClick = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('HEADER', 'Notifications clicked', {
            count: notificationCount
        });
        onNotificationClick?.();
    };
    const handleUserClick = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('HEADER', 'User menu clicked', {
            user: user?.name || 'anonymous'
        });
        onUserClick?.();
    };
    const handleMenuToggle = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('HEADER', 'Menu toggle clicked');
        onMenuToggle?.();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: HEADER_STYLES.container,
        role: "banner",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: HEADER_STYLES.leftSection,
                children: [
                    onMenuToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        className: HEADER_STYLES.menuButton,
                        onClick: handleMenuToggle,
                        "aria-label": "메뉴 토글",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: HEADER_STYLES.searchContainer,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSearch,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchInput"], {
                                placeholder: "프로젝트, 파일 검색...",
                                value: searchQuery,
                                onChange: handleSearchChange,
                                "aria-label": "검색어 입력"
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: HEADER_STYLES.rightSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$HydrationGuard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HydrationGuard"], {
                        fallback: null,
                        children: isMonitoring && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                    className: "w-4 h-4 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                                    lineNumber: 115,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "모니터링 중"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                                    lineNumber: 116,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: HEADER_STYLES.notificationButton,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: handleNotificationClick,
                                "aria-label": `알림 ${notificationCount}개`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            notificationCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "danger",
                                size: "sm",
                                className: "absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs",
                                children: notificationCount > 9 ? '9+' : notificationCount
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/layout/AppHeader.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(AppHeader, "mvs25jxrN/z+2WJjpj2zByTUaho=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMonitoring"]
    ];
});
_c = AppHeader;
var _c;
__turbopack_context__.k.register(_c, "AppHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/providers/ThemeProvider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeProvider": (()=>ThemeProvider),
    "useTheme": (()=>useTheme)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// 🔥 Context 생성
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// 🔥 프리컴파일된 스타일
const THEME_STYLES = {
    root: 'transition-colors duration-200'
};
function ThemeProvider({ children, defaultTheme = 'system' }) {
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThemeProvider.useState": ()=>{
            // 🔥 하이드레이션 안전: 서버와 클라이언트 초기값 완전 동기화
            return defaultTheme; // 항상 'system'으로 시작 (서버와 동일)
        }
    }["ThemeProvider.useState"]);
    // 클라이언트 초기 렌더에서 서버가 넣어둔 HTML 속성(data-theme / class)을 우선 읽어
    // 초기값으로 사용하여 hydration mismatch를 방지합니다.
    // 초기값은 서버가 삽입한 HTML 속성(data-theme/class)을 우선 사용합니다.
    // 시스템 프리퍼런스(matchMedia)는 클라이언트 마운트 이후에만 적용합니다.
    const [resolvedTheme, setResolvedTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThemeProvider.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            try {
                const html = document.documentElement;
                const dataTheme = html.getAttribute('data-theme');
                if (dataTheme === 'dark' || dataTheme === 'light') return dataTheme;
                if (html.classList.contains('dark')) return 'dark';
                if (html.classList.contains('light')) return 'light';
                // 아무 설정이 없으면 서버 기본과 동일하게 'light'로 시작
                return 'light';
            } catch (e) {
                return 'light';
            }
        }
    }["ThemeProvider.useState"]);
    // 🔥 시스템 테마 감지
    const getSystemTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[getSystemTheme]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
    }["ThemeProvider.useCallback[getSystemTheme]"], []);
    // 🔥 해결된 테마 계산
    const calculateResolvedTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[calculateResolvedTheme]": (currentTheme)=>{
            if (currentTheme === 'system') {
                return getSystemTheme();
            }
            return currentTheme;
        }
    }["ThemeProvider.useCallback[calculateResolvedTheme]"], [
        getSystemTheme
    ]);
    // 🔥 테마 설정 함수
    const setTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[setTheme]": async (newTheme)=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'Theme changing', {
                    from: theme,
                    to: newTheme
                });
                setThemeState(newTheme);
                const resolved = calculateResolvedTheme(newTheme);
                setResolvedTheme(resolved);
                // 🔥 백엔드에 테마 저장
                try {
                    const result = await window.electronAPI.settings.set('theme', newTheme);
                    if (result.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'Theme saved to backend', {
                            theme: newTheme,
                            resolved
                        });
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('THEME_PROVIDER', 'Failed to save theme to backend', result.error);
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('THEME_PROVIDER', 'Error saving theme to backend', error);
                }
                // 🔥 HTML/Body 속성 및 클래스 업데이트 (즉시)
                const root = document.documentElement;
                const body = document.body;
                root.classList.remove('light', 'dark');
                root.classList.add(resolved);
                root.setAttribute('data-theme', resolved);
                root.style.colorScheme = resolved;
                if (body) {
                    body.setAttribute('data-theme', resolved);
                    body.style.colorScheme = resolved;
                }
                // 🔥 로컬 스토리지에도 저장 (백업)
                localStorage.setItem('loop-theme', newTheme);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'Theme applied successfully', {
                    theme: newTheme,
                    resolved,
                    htmlClass: root.className
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('THEME_PROVIDER', 'Error setting theme', error);
            }
        }
    }["ThemeProvider.useCallback[setTheme]"], [
        theme,
        calculateResolvedTheme
    ]);
    // 🔥 테마 토글 함수
    const toggleTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[toggleTheme]": ()=>{
            const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        }
    }["ThemeProvider.useCallback[toggleTheme]"], [
        resolvedTheme,
        setTheme
    ]);
    // 🔥 초기 테마 로드 (깜빡임 방지 - 블로킹 스크립트와 완전 동기화)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const loadInitialTheme = {
                "ThemeProvider.useEffect.loadInitialTheme": async ()=>{
                    try {
                        // 🔥 블로킹 스크립트에서 이미 HTML 클래스가 설정되었으므로 상태만 동기화
                        const htmlElement = document.documentElement;
                        let currentResolvedTheme = 'light';
                        // HTML 클래스에서 현재 테마 감지
                        if (htmlElement.classList.contains('dark')) {
                            currentResolvedTheme = 'dark';
                        } else if (htmlElement.classList.contains('light')) {
                            currentResolvedTheme = 'light';
                        }
                        // data-theme 속성도 확인
                        const dataTheme = htmlElement.getAttribute('data-theme');
                        if (dataTheme === 'dark' || dataTheme === 'light') {
                            currentResolvedTheme = dataTheme;
                        }
                        // 1. 백엔드에서 테마 가져오기 시도 (비동기)
                        let savedTheme = defaultTheme;
                        let themeSource = 'default';
                        try {
                            if (window.electronAPI?.settings?.get) {
                                const result = await window.electronAPI.settings.get('theme');
                                if (result.success && result.data) {
                                    const themeValue = result.data;
                                    if ([
                                        'light',
                                        'dark',
                                        'system'
                                    ].includes(themeValue)) {
                                        savedTheme = themeValue;
                                        themeSource = 'backend';
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'Theme loaded from backend', {
                                            theme: savedTheme
                                        });
                                    }
                                }
                            }
                        } catch (error) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('THEME_PROVIDER', 'Backend not available, using localStorage', error);
                            // 2. 로컬 스토리지 폴백
                            try {
                                const localTheme = localStorage.getItem('loop-theme');
                                if (localTheme && [
                                    'light',
                                    'dark',
                                    'system'
                                ].includes(localTheme)) {
                                    savedTheme = localTheme;
                                    themeSource = 'localStorage';
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'Theme loaded from localStorage', {
                                        theme: savedTheme
                                    });
                                }
                            } catch (error) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('THEME_PROVIDER', 'localStorage not available', error);
                            }
                        }
                        // 3. 상태 동기화 (HTML 클래스는 이미 설정됨)
                        if (savedTheme !== theme) {
                            setThemeState(savedTheme);
                        }
                        const resolved = calculateResolvedTheme(savedTheme);
                        // 4. 현재 HTML과 계산된 테마가 다르면 동기화
                        if (resolved !== currentResolvedTheme) {
                            setResolvedTheme(resolved);
                            htmlElement.classList.remove('light', 'dark');
                            htmlElement.classList.add(resolved);
                            htmlElement.setAttribute('data-theme', resolved);
                            htmlElement.style.setProperty('color-scheme', resolved);
                            document.body?.setAttribute('data-theme', resolved);
                            document.body?.style.setProperty('color-scheme', resolved);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'Theme synchronized with calculation', {
                                calculated: resolved,
                                current: currentResolvedTheme
                            });
                        } else {
                            // 이미 올바른 테마가 적용됨
                            setResolvedTheme(currentResolvedTheme);
                            // 보수적으로 body에도 동일 속성 보강
                            htmlElement.setAttribute('data-theme', currentResolvedTheme);
                            htmlElement.style.setProperty('color-scheme', currentResolvedTheme);
                            document.body?.setAttribute('data-theme', currentResolvedTheme);
                            document.body?.style.setProperty('color-scheme', currentResolvedTheme);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('THEME_PROVIDER', 'Theme already synchronized', {
                                theme: savedTheme,
                                resolved: currentResolvedTheme
                            });
                        }
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'Initial theme loaded successfully', {
                            theme: savedTheme,
                            resolved,
                            source: themeSource,
                            htmlClasses: htmlElement.className
                        });
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('THEME_PROVIDER', 'Error loading initial theme', error);
                        // 에러 시 안전한 폴백
                        const root = document.documentElement;
                        const body = document.body;
                        root.classList.remove('light', 'dark');
                        root.classList.add('light');
                        root.setAttribute('data-theme', 'light');
                        root.style.setProperty('color-scheme', 'light');
                        if (body) {
                            body.setAttribute('data-theme', 'light');
                            body.style.setProperty('color-scheme', 'light');
                        }
                        setResolvedTheme('light');
                    }
                }
            }["ThemeProvider.useEffect.loadInitialTheme"];
            // 🔥 즉시 실행 (블로킹 스크립트와 동기화)
            loadInitialTheme();
        }
    }["ThemeProvider.useEffect"], []); // 🔥 의존성 배열을 비워서 한 번만 실행
    // 🔥 시스템 테마 변경 감지
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleSystemThemeChange = {
                "ThemeProvider.useEffect.handleSystemThemeChange": ()=>{
                    if (theme === 'system') {
                        const newResolved = getSystemTheme();
                        setResolvedTheme(newResolved);
                        // HTML/Body 클래스 및 속성 업데이트
                        const root = document.documentElement;
                        const body = document.body;
                        root.classList.remove('light', 'dark');
                        root.classList.add(newResolved);
                        root.setAttribute('data-theme', newResolved);
                        root.style.setProperty('color-scheme', newResolved);
                        if (body) {
                            body.setAttribute('data-theme', newResolved);
                            body.style.setProperty('color-scheme', newResolved);
                        }
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('THEME_PROVIDER', 'System theme changed', {
                            theme: 'system',
                            resolved: newResolved
                        });
                    }
                }
            }["ThemeProvider.useEffect.handleSystemThemeChange"];
            mediaQuery.addEventListener('change', handleSystemThemeChange);
            return ({
                "ThemeProvider.useEffect": ()=>mediaQuery.removeEventListener('change', handleSystemThemeChange)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], [
        theme,
        getSystemTheme
    ]);
    const contextValue = {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: contextValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: THEME_STYLES.root,
            suppressHydrationWarning: true,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/renderer/providers/ThemeProvider.tsx",
            lineNumber: 277,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/providers/ThemeProvider.tsx",
        lineNumber: 276,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "t9yIH9Tvqi1STp+rhUbzEURhV7E=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/app/ClientLayout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ClientLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$layout$2f$AppSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/layout/AppSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$layout$2f$AppHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/layout/AppHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/contexts/GlobalMonitoringContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
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
function ClientLayout({ children, initialAuth }) {
    _s();
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isClientMounted, setIsClientMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // restore sidebar state before paint
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "ClientLayout.useLayoutEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const savedState = localStorage.getItem('sidebar-collapsed');
                    if (savedState === 'true') {
                        setSidebarCollapsed(true);
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LAYOUT', 'Sidebar state restored immediately', {
                        collapsed: savedState === 'true'
                    });
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('LAYOUT', 'Failed to restore sidebar state', error);
                }
            }
            setIsClientMounted(true);
        }
    }["ClientLayout.useLayoutEffect"], []);
    const handleNavigate = (href)=>{
        try {
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            // Parse the URL to validate it
            let url = null;
            try {
                url = new URL(href, window.location.href);
            } catch (e) {
                // malformed URL - block navigation
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('LAYOUT', 'Blocked malformed navigation URL', {
                    href
                });
                return;
            }
            const isSameOrigin = url.origin === window.location.origin;
            const isRelative = href.startsWith('/');
            if (isRelative || isSameOrigin) {
                // Use Next.js router for internal navigation (client-side routing)
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LAYOUT', 'Client-side navigation', {
                    href
                });
                router.push(href);
            } else {
                // treat as external - open in new tab/window safely
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LAYOUT', 'External navigation', {
                    href
                });
                window.open(url.toString(), '_blank', 'noopener,noreferrer');
            }
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('LAYOUT', 'Blocked unsafe navigation attempt', {
                href,
                error: e
            });
        }
    };
    const handleToggleSidebar = ()=>{
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                localStorage.setItem('sidebar-collapsed', newState.toString());
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('LAYOUT', 'Sidebar state saved', {
                    collapsed: newState
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('LAYOUT', 'Failed to save sidebar state', error);
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        defaultTheme: "system",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            initialAuth: initialAuth,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$contexts$2f$GlobalMonitoringContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonitoringProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-screen flex min-w-0 app-root",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$layout$2f$AppSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppSidebar"], {
                                activeRoute: pathname,
                                onNavigate: handleNavigate,
                                collapsed: sidebarCollapsed,
                                onToggleCollapse: handleToggleSidebar
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                                lineNumber: 91,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                            lineNumber: 90,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "flex-1 flex flex-col min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                    className: "flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$layout$2f$AppHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppHeader"], {}, void 0, false, {
                                        fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                                        lineNumber: 101,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                                    lineNumber: 100,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0 p-6 overflow-y-auto",
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                                    lineNumber: 104,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                            lineNumber: 99,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                    lineNumber: 89,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/ClientLayout.tsx",
                lineNumber: 88,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/ClientLayout.tsx",
            lineNumber: 87,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/ClientLayout.tsx",
        lineNumber: 86,
        columnNumber: 9
    }, this);
}
_s(ClientLayout, "Zl0Arw5F5ehnE+FviFFicJU57WM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ClientLayout;
var _c;
__turbopack_context__.k.register(_c, "ClientLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_fe91748e._.js.map