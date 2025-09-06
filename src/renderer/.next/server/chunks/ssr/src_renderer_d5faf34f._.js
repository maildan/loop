module.exports = {

"[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ICON_SIZES": (()=>ICON_SIZES),
    "SETTINGS_PAGE_STYLES": (()=>SETTINGS_PAGE_STYLES),
    "SPACING": (()=>SPACING)
});
'use client';
const SETTINGS_PAGE_STYLES = {
    // 메인 컨테이너
    // Use full width with a max-width to avoid flex overflow inside the app layout
    container: 'w-full max-w-4xl mx-auto px-4 py-6 space-y-6 min-w-0',
    pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6',
    // 네비게이션
    nav: 'flex flex-wrap gap-2 mb-6',
    navButton: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
    navButtonActive: 'bg-blue-600 text-white shadow-md',
    navButtonInactive: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    // 섹션
    section: 'space-y-6',
    sectionCard: 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6',
    sectionHeader: 'flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700',
    sectionIcon: 'w-6 h-6 text-blue-600 flex-shrink-0',
    sectionTitle: 'text-xl font-semibold text-slate-900 dark:text-slate-100',
    sectionDescription: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
    // 설정 항목
    settingItem: 'space-y-4',
    settingRow: 'flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 min-h-[60px]',
    settingLabel: 'flex-1 pr-4',
    settingTitle: 'font-medium text-slate-900 dark:text-slate-100 text-base',
    settingDescription: 'text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md',
    settingControl: 'flex items-center gap-3 flex-shrink-0',
    // 입력 필드
    inputGroup: 'space-y-2',
    inputLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
    textInput: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors',
    numberInput: 'w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors',
    select: 'px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 min-w-[120px] transition-colors',
    // 체크박스 및 토글
    checkbox: 'w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 transition-colors',
    toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer',
    toggleActive: 'bg-blue-600',
    toggleInactive: 'bg-slate-200 dark:bg-slate-600',
    toggleSwitch: 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm',
    toggleSwitchActive: 'translate-x-6',
    toggleSwitchInactive: 'translate-x-1',
    toggleDisabled: 'opacity-50 cursor-not-allowed',
    // 액션 버튼
    actions: 'flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700',
    button: 'inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondaryButton: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 focus:ring-slate-500',
    dangerButton: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500',
    // 로딩 상태
    loading: 'flex items-center justify-center h-64',
    loadingContent: 'text-center',
    spinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4',
    loadingText: 'text-slate-600 dark:text-slate-400',
    loadingContainer: 'flex items-center justify-center h-64',
    loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4',
    // 에러 상태
    errorContainer: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4',
    errorText: 'text-red-800 dark:text-red-400 text-sm',
    // 성공 상태
    successContainer: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4',
    successText: 'text-green-800 dark:text-green-400 text-sm',
    // 유틸리티
    srOnly: 'sr-only',
    visuallyHidden: 'absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0'
};
const ICON_SIZES = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
};
const SPACING = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6'
};
}}),
"[project]/src/renderer/app/settings/components/SettingsNavigation.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 설정 네비게이션 컴포넌트 - 최적화
__turbopack_context__.s({
    "SettingsNavigation": (()=>SettingsNavigation)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/palette.js [app-ssr] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/keyboard.js [app-ssr] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.js [app-ssr] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
/**
 * 🔥 설정 섹션 메타데이터 - 단순한 플랫 구조
 */ const SECTIONS = [
    {
        id: 'app',
        label: '앱 설정',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    },
    {
        id: 'account',
        label: '사용자 프로필',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    },
    {
        id: 'notifications',
        label: '알림',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        id: 'ui',
        label: 'UI/UX',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"]
    },
    {
        id: 'keyboard',
        label: '키보드',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"]
    },
    {
        id: 'performance',
        label: '성능',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"]
    }
];
/**
 * 🔥 섹션 버튼 컴포넌트
 */ const SectionButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ section, isActive, onClick })=>{
    const Icon = section.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].navButton} ${isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].navButtonActive : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].navButtonInactive}`,
        onClick: onClick,
        "aria-current": isActive ? 'page' : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: "w-4 h-4 mr-2"
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            section.label
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
});
SectionButton.displayName = 'SectionButton';
const SettingsNavigation = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ activeSection, onSectionChange })=>{
    const createSectionHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sectionId)=>{
        return ()=>onSectionChange(sectionId);
    }, [
        onSectionChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "flex flex-wrap gap-2 mb-6",
        role: "navigation",
        "aria-label": "설정 네비게이션",
        children: SECTIONS.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionButton, {
                section: section,
                isActive: activeSection === section.id,
                onClick: createSectionHandler(section.id)
            }, section.id, false, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/settings/components/SettingsNavigation.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
});
SettingsNavigation.displayName = 'SettingsNavigation';
}}),
"[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 SettingItem 공통 컴포넌트 - 최적화
__turbopack_context__.s({
    "SettingItem": (()=>SettingItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const SettingItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ title, description, control })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingRow,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingLabel,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingTitle,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingDescription,
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingControl,
                children: control
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/controls/SettingItem.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
});
SettingItem.displayName = 'SettingItem';
}}),
"[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 Toggle 컴포넌트 - 완전 최적화
__turbopack_context__.s({
    "Toggle": (()=>Toggle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const Toggle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ checked, onChange, disabled = false })=>{
    // 🔥 이벤트 핸들러 메모이제이션
    const handleToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!disabled) {
            onChange(!checked);
        }
    }, [
        checked,
        onChange,
        disabled
    ]);
    // 🔥 키보드 이벤트 핸들러
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
            event.preventDefault();
            onChange(!checked);
        }
    }, [
        checked,
        onChange,
        disabled
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        disabled: disabled,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggle} ${checked ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleActive : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleInactive} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        onClick: handleToggle,
        onKeyDown: handleKeyDown,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleSwitch} ${checked ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleSwitchActive : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].toggleSwitchInactive}`
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/settings/components/controls/Toggle.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/settings/components/controls/Toggle.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
});
Toggle.displayName = 'Toggle';
}}),
"[project]/src/renderer/hooks/useDynamicFont.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 동적 폰트 훅 - public/fonts TTF 기반
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "useDynamicFont": (()=>useDynamicFont)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
;
;
function useDynamicFont() {
    const [currentFont, setCurrentFont] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [availableFonts, setAvailableFonts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 폰트 CSS 주입
    const injectFontCSS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const css = await window.electronAPI?.font?.generateCSS?.();
            if (css) {
                // 기존 동적 폰트 스타일 제거
                const existingStyle = document.getElementById('dynamic-fonts');
                if (existingStyle) {
                    existingStyle.remove();
                }
                // 폰트 정규화 CSS 추가
                const normalizedCSS = css + `
                    /* 🔥 폰트 사이즈 정규화 */
                    * {
                        font-size-adjust: 0.5 !important;
                        line-height: 1.6 !important;
                    }
                    
                    /* 텍스트 에디터 영역 정규화 */
                    textarea, input[type="text"], input[type="email"], .text-editor {
                        font-size-adjust: 0.5 !important;
                        line-height: 1.6 !important;
                        vertical-align: baseline !important;
                    }
                    
                    /* 특정 컴포넌트 정규화 */
                    .idea-content, .synopsis-content, .character-content, .notes-content {
                        font-size-adjust: 0.5 !important;
                        line-height: 1.6 !important;
                    }
                    
                    /* 폰트 패밀리별 개별 조정 */
                    .font-korean { font-size-adjust: 0.48 !important; }
                    .font-english { font-size-adjust: 0.52 !important; }
                    .font-monospace { font-size-adjust: 0.45 !important; }
                `;
                // 새 폰트 스타일 추가
                const style = document.createElement('style');
                style.id = 'dynamic-fonts';
                style.textContent = normalizedCSS;
                document.head.appendChild(style);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('DYNAMIC_FONT', '정규화된 폰트 CSS 주입 완료', {
                    cssLength: normalizedCSS.length
                });
            }
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('DYNAMIC_FONT', '폰트 CSS 주입 실패', e);
        }
    }, []);
    // 🔥 사용 가능한 폰트 로드
    const loadAvailableFonts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            setLoading(true);
            setError(null);
            // 폰트 서비스 초기화
            await window.electronAPI?.font?.initialize?.();
            // 동적 폰트 + 정적 폰트 조합
            const [dynamicFonts, staticFonts] = await Promise.all([
                window.electronAPI?.font?.getAvailableFonts?.() || [],
                window.electronAPI?.font?.getStaticFonts?.() || []
            ]);
            const allFonts = [
                ...staticFonts,
                ...dynamicFonts
            ];
            setAvailableFonts(allFonts);
            // 폰트 CSS 주입
            await injectFontCSS();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('DYNAMIC_FONT', '폰트 목록 로드 완료', {
                dynamicCount: dynamicFonts.length,
                staticCount: staticFonts.length,
                totalCount: allFonts.length
            });
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('DYNAMIC_FONT', '폰트 로드 실패', e);
            setError('폰트를 불러오는데 실패했습니다.');
            // 폴백 폰트 목록
            setAvailableFonts([
                {
                    value: 'system-ui, sans-serif',
                    label: '시스템 기본',
                    category: 'system'
                },
                {
                    value: '-apple-system, BlinkMacSystemFont, sans-serif',
                    label: 'Apple 시스템',
                    category: 'system'
                }
            ]);
        } finally{
            setLoading(false);
        }
    }, [
        injectFontCSS
    ]);
    // 🔥 초기 로드
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (async ()=>{
            await loadAvailableFonts();
            // 현재 적용된 폰트 감지
            const initial = (getComputedStyle(document.documentElement).getPropertyValue('--app-font-family') || getComputedStyle(document.body).fontFamily).trim();
            setCurrentFont(initial);
        })();
    }, [
        loadAvailableFonts
    ]);
    // 🔥 폰트 적용 - 기가차드 강화버전 + 사이즈 정규화
    const setFont = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((family)=>{
        try {
            // 🔥 CSS 변수와 body 동시 적용으로 깜빡임 방지
            document.documentElement.style.setProperty('--app-font-family', family);
            document.body.style.fontFamily = family;
            // 🔥 폰트 정규화 스타일 적용
            const normalizeStyle = `
                font-size-adjust: 0.5 !important;
                line-height: 1.6 !important;
                vertical-align: baseline !important;
            `;
            // 🔥 모든 요소에 즉시 적용 (깜빡임 없는 전환 + 정규화)
            const allElements = document.querySelectorAll('*');
            allElements.forEach((element)=>{
                if (element instanceof HTMLElement) {
                    element.style.fontFamily = family;
                    // 텍스트 입력 요소들에는 정규화 적용
                    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT' || element.classList.contains('text-editor') || element.classList.contains('idea-content') || element.classList.contains('synopsis-content')) {
                        element.style.fontSizeAdjust = '0.5';
                        element.style.lineHeight = '1.6';
                        element.style.verticalAlign = 'baseline';
                    }
                }
            });
            setCurrentFont(family);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('DYNAMIC_FONT', '🔥 기가차드 정규화 폰트 적용 완료', {
                family,
                appliedToElements: allElements.length
            });
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('DYNAMIC_FONT', '폰트 적용 실패', e);
        }
    }, []);
    // 🔥 폰트 리로드
    const reload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await window.electronAPI?.font?.reload?.();
            await loadAvailableFonts();
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('DYNAMIC_FONT', '폰트 리로드 실패', e);
        }
    }, [
        loadAvailableFonts
    ]);
    return {
        currentFont,
        availableFonts,
        setFont,
        loading,
        error,
        reload
    };
}
const __TURBOPACK__default__export__ = useDynamicFont;
}}),
"[project]/src/renderer/app/settings/components/SettingItem.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SettingItem": (()=>SettingItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const SettingItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ title, description, control })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingRow,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingLabel,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingTitle,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/SettingItem.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingDescription,
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/SettingItem.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/SettingItem.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingControl,
                children: control
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/components/SettingItem.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/SettingItem.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
});
SettingItem.displayName = 'SettingItem';
}}),
"[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GoogleAccountActions": (()=>GoogleAccountActions),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/SettingItem.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const GoogleAccountActions = ()=>{
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!window.electronAPI?.oauth?.revokeAuth) {
            alert('이 기능은 데스크톱 앱에서만 동작합니다');
            return;
        }
        const confirmed = window.confirm('Google 계정 연결을 끊고 로그아웃하시겠습니까?');
        if (!confirmed) return;
        setLoading(true);
        try {
            const result = await window.electronAPI.oauth.revokeAuth();
            if (result && result.success) {
                alert('Google 로그아웃 완료');
                // simple approach: reload page to refresh UI and clear sidebar state
                setTimeout(()=>window.location.reload(), 300);
            } else {
                alert('로그아웃에 실패했습니다. 콘솔을 확인하세요.');
            }
        } catch (err) {
            console.error('Failed to revoke auth', err);
            alert('로그아웃 중 오류가 발생했습니다');
        } finally{
            setLoading(false);
        }
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "Google 계정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                    title: "Google 로그아웃",
                    description: "앱에 연결된 Google 계정의 토큰을 삭제하고 연결을 해제합니다",
                    control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].secondaryButton}`,
                        onClick: handleLogout,
                        disabled: loading,
                        children: loading ? '로그아웃 중...' : '로그아웃'
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx",
                        lineNumber: 50,
                        columnNumber: 25
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx",
                    lineNumber: 46,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx",
        lineNumber: 39,
        columnNumber: 9
    }, this);
};
const __TURBOPACK__default__export__ = GoogleAccountActions;
}}),
"[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 앱 설정 섹션 - 최적화
__turbopack_context__.s({
    "AppSettingsSection": (()=>AppSettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useDynamicFont$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/hooks/useDynamicFont.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$GoogleAccountActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/GoogleAccountActions.tsx [app-ssr] (ecmascript)");
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
const AppSettingsSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ settings, updateSetting, setTheme })=>{
    const { theme: currentTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const { availableFonts, loading: fontsLoading, error: fontsError, setFont } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$hooks$2f$useDynamicFont$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDynamicFont"])();
    // 🔥 로컬 테마 상태 (설정 UI 표시용)
    const [displayTheme, setDisplayTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(settings.theme);
    // 🔥 설정이 변경되면 로컬 상태 동기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setDisplayTheme(settings.theme);
    }, [
        settings.theme
    ]);
    // 🔥 ThemeProvider의 테마가 변경되면 동기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentTheme !== displayTheme && currentTheme !== 'system') {
            setDisplayTheme(currentTheme);
        }
    }, [
        currentTheme,
        displayTheme
    ]);
    // 🔥 테마 변경 핸들러 (ThemeProvider + 설정 동시 업데이트)
    const handleThemeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (event)=>{
        const newTheme = event.target.value;
        try {
            // 1. 로컬 상태 즉시 업데이트 (UI 반응성)
            setDisplayTheme(newTheme);
            // 2. ThemeProvider 업데이트 (실제 테마 적용)
            setTheme(newTheme);
            // 3. 설정 저장 (백엔드 동기화)
            await updateSetting('app', 'theme', newTheme);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('APP_SETTINGS', 'Theme updated successfully', {
                theme: newTheme,
                source: 'settings_page'
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('APP_SETTINGS', 'Failed to update theme', error);
            // 🔥 에러 시 원래 상태로 롤백
            setDisplayTheme(settings.theme);
        }
    }, [
        updateSetting,
        setTheme,
        settings.theme
    ]);
    // 🔥 언어 변경 핸들러
    const handleLanguageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        updateSetting('app', 'language', event.target.value);
    }, [
        updateSetting
    ]);
    // 🔥 글꼴 크기 변경 핸들러 - 기가차드 강화버전
    const handleFontSizeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const size = parseInt(event.target.value, 10);
        if (size >= 10 && size <= 24) {
            try {
                // 🔥 즉시 CSS 변수 적용
                document.documentElement.style.setProperty('--app-font-size', `${size}px`);
                document.body.style.fontSize = `${size}px`;
                // 🔥 설정 저장
                updateSetting('app', 'fontSize', size);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('APP_SETTINGS', '🔥 기가차드 폰트 크기 변경 완료', {
                    newSize: size,
                    timestamp: Date.now()
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('APP_SETTINGS', '폰트 크기 변경 실패', error);
            }
        }
    }, [
        updateSetting
    ]);
    // 🔥 글꼴 패밀리 변경 핸들러 - 기가차드 강화버전
    const handleFontFamilyChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const selectedFont = event.target.value;
        try {
            // 🔥 즉시 폰트 적용 (useDynamicFont의 setFont 사용)
            setFont(selectedFont);
            // 🔥 설정 저장
            updateSetting('app', 'fontFamily', selectedFont);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('APP_SETTINGS', '🔥 기가차드 폰트 변경 완료', {
                newFont: selectedFont,
                timestamp: Date.now()
            });
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('APP_SETTINGS', '폰트 변경 실패', error);
        }
    }, [
        updateSetting,
        setFont
    ]);
    // 🔥 토글 핸들러들
    const handleAutoSaveToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('app', 'autoSave', checked);
    }, [
        updateSetting
    ]);
    const handleStartMinimizedToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('app', 'startMinimized', checked);
    }, [
        updateSetting
    ]);
    const handleMinimizeToTrayToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('app', 'minimizeToTray', checked);
    }, [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "앱 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "테마",
                        description: "앱의 외관 테마를 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: displayTheme,
                            onChange: handleThemeChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "system",
                                    children: "시스템"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 153,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "light",
                                    children: "라이트"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "dark",
                                    children: "다크"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "언어",
                        description: "앱에서 사용할 언어를 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: settings.language,
                            onChange: handleLanguageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "ko",
                                    children: "한국어"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 169,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "en",
                                    children: "English"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "ja",
                                    children: "日本語"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                    lineNumber: 171,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 164,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "자동 저장",
                        description: "작업 내용을 자동으로 저장합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.autoSave,
                            onChange: handleAutoSaveToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "최소화 상태로 시작",
                        description: "앱 시작 시 최소화된 상태로 실행합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.startMinimized,
                            onChange: handleStartMinimizedToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 191,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "시스템 트레이로 최소화",
                        description: "창을 닫을 때 시스템 트레이로 최소화합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.minimizeToTray,
                            onChange: handleMinimizeToTrayToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "글꼴 크기",
                        description: "앱에서 사용할 글꼴 크기를 설정하세요 (10-24px)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "10",
                            max: "24",
                            value: settings.fontSize,
                            onChange: handleFontSizeChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 213,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "글꼴 패밀리",
                        description: fontsError ? `폰트를 불러오는데 문제가 있습니다: ${fontsError}` : "앱에서 사용할 글꼴을 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: settings.fontFamily,
                            onChange: handleFontFamilyChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            disabled: fontsLoading,
                            children: fontsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "폰트 목록 로딩 중..."
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                lineNumber: 239,
                                columnNumber: 17
                            }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    ...new Set(availableFonts.map((f)=>f.category))
                                ].map((category)=>{
                                    const categoryFonts = availableFonts.filter((f)=>f.category === category);
                                    const categoryLabels = {
                                        system: '시스템 폰트',
                                        korean: '한국어 폰트',
                                        japanese: '일본어 폰트',
                                        english: '영어 폰트'
                                    };
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                        label: categoryLabels[category] || category,
                                        children: categoryFonts.map((font)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: font.value,
                                                children: font.label
                                            }, font.value, false, {
                                                fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                                lineNumber: 255,
                                                columnNumber: 27
                                            }, void 0))
                                    }, category, false, {
                                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                                        lineNumber: 253,
                                        columnNumber: 23
                                    }, void 0);
                                })
                            }, void 0, false)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$GoogleAccountActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
});
AppSettingsSection.displayName = 'AppSettingsSection';
}}),
"[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 사용자 프로필 섹션
__turbopack_context__.s({
    "ProfileSettingsSection": (()=>ProfileSettingsSection),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-cw.js [app-ssr] (ecmascript) <export default as RotateCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-ssr] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/ui/Avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const ProfileSettingsSection = ({ settings, updateSetting })=>{
    const [displayName, setDisplayName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(settings.displayName || settings.username || '');
    const [avatarSrc, setAvatarSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(settings.avatar || undefined);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingImage, setEditingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const debounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setDisplayName(settings.displayName || settings.username || '');
        // Handle different avatar protocols
        if (settings.avatar && settings.avatar.startsWith('file://')) {
            const path = settings.avatar.replace(/^file:\/\//, '');
            window.electronAPI.files?.readFileAsDataUrl(path).then((r)=>{
                if (r && r.success && r.data) {
                    setAvatarSrc(r.data);
                } else {
                    setAvatarSrc(undefined);
                }
            }).catch(()=>setAvatarSrc(undefined));
        } else if (settings.avatar && (settings.avatar.startsWith('loop-avatar://') || settings.avatar.startsWith('data:'))) {
            // 🔥 loop-avatar:// 프로토콜과 data: URL 직접 사용
            setAvatarSrc(settings.avatar);
        } else {
            setAvatarSrc(settings.avatar || undefined);
        }
    }, [
        settings
    ]);
    const handleDisplayNameChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const newName = e.target.value;
        setDisplayName(newName);
        // Clear existing debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        // Debounce the save operation by 500ms
        debounceRef.current = setTimeout(async ()=>{
            try {
                await updateSetting('account', 'displayName', newName || undefined);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROFILE_SETTINGS', 'Display name updated', {
                    displayName: newName
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROFILE_SETTINGS', 'Failed to update display name', error);
            }
        }, 500);
    }, [
        updateSetting
    ]);
    // Cleanup debounce on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);
    const handleAvatarUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (e)=>{
        const f = e.target.files?.[0];
        if (!f) return;
        // Size limit check (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (f.size > maxSize) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].warn('PROFILE_SETTINGS', 'File size exceeds 5MB limit', {
                size: f.size,
                maxSize
            });
            return;
        }
        try {
            const reader = new FileReader();
            reader.onload = async ()=>{
                const dataUrl = reader.result;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROFILE_SETTINGS', 'File upload detected', {
                    fileName: f.name,
                    fileType: f.type,
                    dataUrlPrefix: dataUrl.substring(0, 30) + '...'
                });
                // 🔥 수정: 모든 이미지를 편집기로 전달 (GIF 포함)
                setEditingImage(dataUrl);
                // allow re-uploading same file by clearing input value
                try {
                    if (fileInputRef.current) fileInputRef.current.value = '';
                } catch (e) {}
            };
            reader.readAsDataURL(f);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROFILE_SETTINGS', 'Failed to read file', error);
        }
    }, [
        updateSetting
    ]);
    // initial-letter fallback component
    const initial = (displayName || settings.username || settings.email || 'L').charAt(0).toUpperCase();
    // save cropped image from modal
    const handleSaveCropped = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (dataUrl)=>{
        try {
            setUploading(true);
            await updateSetting('account', 'avatar', dataUrl);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].info('PROFILE_SETTINGS', 'Avatar saved from cropper');
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Logger"].error('PROFILE_SETTINGS', 'Failed to save cropped avatar', e);
        } finally{
            setUploading(false);
            setEditingImage(null);
        }
    }, [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                        lineNumber: 128,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "사용자 프로필"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                        lineNumber: 129,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "프로필 사진",
                        description: "파일 업로드 또는 기본 이니셜을 사용합니다 (최대 5MB, 모든 이미지 편집 가능)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$ui$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                                    size: "lg",
                                    src: avatarSrc,
                                    fallback: initial,
                                    "aria-label": "프로필 이미지",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-medium",
                                        children: initial
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                        lineNumber: 139,
                                        columnNumber: 33
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 138,
                                    columnNumber: 29
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].secondaryButton} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            ref: fileInputRef,
                                            type: "file",
                                            accept: "image/*",
                                            onChange: handleAvatarUpload,
                                            className: "hidden",
                                            disabled: uploading
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 142,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                            className: "w-4 h-4 mr-2 inline"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 150,
                                            columnNumber: 33
                                        }, void 0),
                                        uploading ? '업로드 중...' : '업로드'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 141,
                                    columnNumber: 29
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 137,
                            columnNumber: 25
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                        lineNumber: 133,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "이름(별명)",
                        description: "앱에 표시될 이름을 입력하세요 (변경 시 자동 저장)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: displayName,
                            onChange: handleDisplayNameChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].textInput,
                            placeholder: "표시될 이름을 입력하세요"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 161,
                            columnNumber: 25
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                        lineNumber: 157,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                lineNumber: 132,
                columnNumber: 13
            }, this),
            editingImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImageCropperModal, {
                src: editingImage,
                onCancel: ()=>setEditingImage(null),
                onSave: handleSaveCropped
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                lineNumber: 172,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
        lineNumber: 126,
        columnNumber: 9
    }, this);
};
// Simple image cropper modal for circular crop
function ImageCropperModal({ src, onCancel, onSave }) {
    const containerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const imgRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const [scale, setScale] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(1);
    const [rotation, setRotation] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(0);
    const [offset, setOffset] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState({
        x: 0,
        y: 0
    });
    const dragging = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef({
        active: false,
        startX: 0,
        startY: 0,
        origX: 0,
        origY: 0
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        // reset
        setScale(1);
        setOffset({
            x: 0,
            y: 0
        });
    }, [
        src
    ]);
    const onMouseDown = (e)=>{
        dragging.current = {
            active: true,
            startX: e.clientX,
            startY: e.clientY,
            origX: offset.x,
            origY: offset.y
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };
    const onMouseMove = (e)=>{
        if (!dragging.current.active) return;
        const dx = e.clientX - dragging.current.startX;
        const dy = e.clientY - dragging.current.startY;
        setOffset({
            x: dragging.current.origX + dx,
            y: dragging.current.origY + dy
        });
    };
    const onMouseUp = ()=>{
        dragging.current.active = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };
    const handleSave = ()=>{
        const size = 256; // output thumbnail size
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx || !imgRef.current || !containerRef.current) return;
        // Draw circular clip
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const img = imgRef.current;
        const rect = containerRef.current.getBoundingClientRect();
        // compute drawn image parameters relative to container
        const imgW = img.naturalWidth * scale;
        const imgH = img.naturalHeight * scale;
        // position of image center relative to container center
        const cx = rect.width / 2 + offset.x;
        const cy = rect.height / 2 + offset.y;
        // top-left in container coords
        const sx = cx - imgW / 2;
        const sy = cy - imgH / 2;
        // draw with scaling to canvas
        // compute scale factor from container -> canvas
        const factor = size / rect.width;
        // apply rotation by translating canvas
        if (rotation % 360 !== 0) {
            ctx.translate(size / 2, size / 2);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.translate(-size / 2, -size / 2);
        }
        ctx.drawImage(img, sx * factor, sy * factor, imgW * factor, imgH * factor);
        ctx.restore();
        // 🔥 수정: PNG로 변환하는 로직만 남기고, GIF 관련 분기 모두 제거
        const thumbDataUrl = canvas.toDataURL('image/png');
        onSave(thumbDataUrl);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white dark:bg-slate-800 rounded-2xl p-6 w-[540px] max-w-[90vw] shadow-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold text-slate-900 dark:text-slate-100",
                            children: "아바타 편집"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 272,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1",
                            onClick: onCancel,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "24",
                                height: "24",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M18 6L6 18M6 6l12 12",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 278,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                lineNumber: 277,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 273,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                    lineNumber: 271,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden mb-6",
                    style: {
                        height: 320
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: containerRef,
                        className: "w-full h-full flex items-center justify-center relative cursor-move select-none",
                        onMouseDown: onMouseDown,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                ref: imgRef,
                                src: src,
                                alt: "편집 중",
                                style: {
                                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotation}deg)`,
                                    maxWidth: 'none',
                                    userSelect: 'none',
                                    pointerEvents: 'none'
                                },
                                draggable: false
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                lineNumber: 290,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute pointer-events-none",
                                style: {
                                    left: '50%',
                                    top: '50%',
                                    width: 224,
                                    height: 224,
                                    transform: 'translate(-50%, -50%)',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                                    border: '3px solid rgba(255,255,255,0.9)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                lineNumber: 303,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                        lineNumber: 285,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                    lineNumber: 284,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-slate-600 dark:text-slate-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 324,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium min-w-[2rem]",
                                            children: "크기"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 325,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 323,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "range",
                                    min: 0.5,
                                    max: 3,
                                    step: 0.05,
                                    value: scale,
                                    onChange: (e)=>setScale(Number(e.target.value)),
                                    className: "flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 327,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                    className: "w-4 h-4 text-slate-600 dark:text-slate-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 336,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 322,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-slate-600 dark:text-slate-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 342,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium min-w-[2rem]",
                                            children: "회전"
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 343,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 341,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors",
                                            onClick: ()=>setRotation((r)=>(r - 90) % 360),
                                            title: "왼쪽으로 90° 회전",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                                lineNumber: 352,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 346,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors",
                                            onClick: ()=>setRotation((r)=>(r + 90) % 360),
                                            title: "오른쪽으로 90° 회전",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                                lineNumber: 360,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                            lineNumber: 354,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 345,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-slate-500 dark:text-slate-400 min-w-[3rem]",
                                    children: [
                                        rotation,
                                        "°"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                                    lineNumber: 363,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 340,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                    lineNumber: 320,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                            onClick: onCancel,
                            children: "취소"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 369,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors",
                            onClick: handleSave,
                            children: "저장"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                            lineNumber: 375,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
                    lineNumber: 368,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
            lineNumber: 269,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx",
        lineNumber: 268,
        columnNumber: 9
    }, this);
}
const __TURBOPACK__default__export__ = ProfileSettingsSection;
}}),
"[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 키보드 설정 섹션 - 최적화
__turbopack_context__.s({
    "KeyboardSettingsSection": (()=>KeyboardSettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/keyboard.js [app-ssr] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const KeyboardSettingsSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ settings, updateSetting })=>{
    // 🔥 키보드 활성화 토글 핸들러
    const handleEnabledToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('keyboard', 'enabled', checked);
    }, [
        updateSetting
    ]);
    // 🔥 모든 앱 추적 토글 핸들러
    const handleTrackAllAppsToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('keyboard', 'trackAllApps', checked);
    }, [
        updateSetting
    ]);
    // 🔥 언어 변경 핸들러
    const handleLanguageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        updateSetting('keyboard', 'language', event.target.value);
    }, [
        updateSetting
    ]);
    // 🔥 세션 타임아웃 변경 핸들러
    const handleSessionTimeoutChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const timeout = parseInt(event.target.value, 10);
        if (timeout >= 5 && timeout <= 120) {
            updateSetting('keyboard', 'sessionTimeout', timeout);
        }
    }, [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "키보드 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "키보드 모니터링 활성화",
                        description: "키보드 입력을 모니터링하여 타이핑 통계를 수집합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enabled,
                            onChange: handleEnabledToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "입력 언어",
                        description: "주로 사용하는 입력 언어를 선택하세요",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: settings.language,
                            onChange: handleLanguageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].select,
                            disabled: !settings.enabled,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "korean",
                                    children: "한국어"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "english",
                                    children: "English"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "japanese",
                                    children: "日本語"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "chinese",
                                    children: "中文"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "모든 앱 추적",
                        description: "모든 애플리케이션에서의 타이핑을 추적합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.trackAllApps,
                            onChange: handleTrackAllAppsToggle,
                            disabled: !settings.enabled
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 90,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "세션 타임아웃",
                        description: "타이핑 세션이 종료되는 시간(분)을 설정하세요 (5-120분)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "5",
                            max: "120",
                            value: settings.sessionTimeout,
                            onChange: handleSessionTimeoutChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput,
                            disabled: !settings.enabled
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
});
KeyboardSettingsSection.displayName = 'KeyboardSettingsSection';
}}),
"[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 UI 설정 섹션 - 최적화
__turbopack_context__.s({
    "UISettingsSection": (()=>UISettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/palette.js [app-ssr] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const UISettingsSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ settings, updateSetting })=>{
    // 🔥 창 너비 변경 핸들러
    const handleWindowWidthChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const width = parseInt(event.target.value, 10);
        if (width >= 800 && width <= 2560) {
            updateSetting('ui', 'windowWidth', width);
        }
    }, [
        updateSetting
    ]);
    // 🔥 창 높이 변경 핸들러
    const handleWindowHeightChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const height = parseInt(event.target.value, 10);
        if (height >= 600 && height <= 1440) {
            updateSetting('ui', 'windowHeight', height);
        }
    }, [
        updateSetting
    ]);
    // 🔥 토글 핸들러들
    const handleSidebarCollapsedToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('ui', 'sidebarCollapsed', checked);
    }, [
        updateSetting
    ]);
    const handleShowLineNumbersToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('ui', 'showLineNumbers', checked);
    }, [
        updateSetting
    ]);
    const handleShowWordCountToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('ui', 'showWordCount', checked);
    }, [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "UI/UX 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "창 너비",
                        description: "앱 창의 기본 너비를 설정하세요 (800-2560px)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "800",
                            max: "2560",
                            step: "50",
                            value: settings.windowWidth,
                            onChange: handleWindowWidthChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "창 높이",
                        description: "앱 창의 기본 높이를 설정하세요 (600-1440px)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "600",
                            max: "1440",
                            step: "50",
                            value: settings.windowHeight,
                            onChange: handleWindowHeightChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "사이드바 접기",
                        description: "앱 시작 시 사이드바를 접힌 상태로 표시합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.sidebarCollapsed,
                            onChange: handleSidebarCollapsedToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "줄 번호 표시",
                        description: "에디터에서 줄 번호를 표시합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.showLineNumbers,
                            onChange: handleShowLineNumbersToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "단어 수 표시",
                        description: "상태바에 단어 수를 표시합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.showWordCount,
                            onChange: handleShowWordCountToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
});
UISettingsSection.displayName = 'UISettingsSection';
}}),
"[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 알림 설정 섹션 - 최적화
__turbopack_context__.s({
    "NotificationSettingsSection": (()=>NotificationSettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const NotificationSettingsSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ settings, updateSetting })=>{
    // 🔥 알림 활성화 토글 핸들러
    const handleNotificationsToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('notifications', 'enableNotifications', checked);
    }, [
        updateSetting
    ]);
    // 🔥 사운드 활성화 토글 핸들러
    const handleSoundsToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('notifications', 'enableSounds', checked);
    }, [
        updateSetting
    ]);
    // 🔥 목표 달성 알림 토글 핸들러
    const handleGoalAchievedToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('notifications', 'notifyGoalAchieved', checked);
    }, [
        updateSetting
    ]);
    // 🔥 일일 목표 알림 토글 핸들러
    const handleDailyGoalToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('notifications', 'notifyDailyGoal', checked);
    }, [
        updateSetting
    ]);
    // 🔥 에러 알림 토글 핸들러
    const handleErrorsToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('notifications', 'notifyErrors', checked);
    }, [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "알림 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                        lineNumber: 55,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                lineNumber: 53,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "알림 활성화",
                        description: "시스템 알림을 받아보실 수 있습니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enableNotifications,
                            onChange: handleNotificationsToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                            lineNumber: 63,
                            columnNumber: 25
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                        lineNumber: 59,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "알림 사운드",
                        description: "알림 시 사운드를 재생합니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enableSounds,
                            onChange: handleSoundsToggle,
                            disabled: !settings.enableNotifications
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                            lineNumber: 74,
                            columnNumber: 25
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                        lineNumber: 70,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "목표 달성 알림",
                        description: "설정한 목표를 달성했을 때 알림을 받습니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.notifyGoalAchieved,
                            onChange: handleGoalAchievedToggle,
                            disabled: !settings.enableNotifications
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                            lineNumber: 86,
                            columnNumber: 25
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                        lineNumber: 82,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "일일 목표 알림",
                        description: "매일 설정된 목표에 대한 진행상황을 알림으로 받습니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.notifyDailyGoal,
                            onChange: handleDailyGoalToggle,
                            disabled: !settings.enableNotifications
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                            lineNumber: 98,
                            columnNumber: 25
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                        lineNumber: 94,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "에러 알림",
                        description: "시스템 오류나 문제가 발생했을 때 알림을 받습니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.notifyErrors,
                            onChange: handleErrorsToggle,
                            disabled: !settings.enableNotifications
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                            lineNumber: 110,
                            columnNumber: 25
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                        lineNumber: 106,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
                lineNumber: 58,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx",
        lineNumber: 52,
        columnNumber: 9
    }, this);
});
NotificationSettingsSection.displayName = 'NotificationSettingsSection';
}}),
"[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 성능 설정 섹션 - 최적화
__turbopack_context__.s({
    "PerformanceSettingsSection": (()=>PerformanceSettingsSection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.js [app-ssr] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/SettingItem.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/controls/Toggle.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const PerformanceSettingsSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ settings, updateSetting })=>{
    // 🔥 최대 CPU 사용률 변경 핸들러
    const handleMaxCPUUsageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const usage = parseInt(event.target.value, 10);
        if (usage >= 20 && usage <= 100) {
            updateSetting('performance', 'maxCPUUsage', usage);
        }
    }, [
        updateSetting
    ]);
    // 🔥 최대 메모리 사용량 변경 핸들러
    const handleMaxMemoryUsageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const memory = parseInt(event.target.value, 10);
        if (memory >= 512 && memory <= 8192) {
            updateSetting('performance', 'maxMemoryUsage', memory);
        }
    }, [
        updateSetting
    ]);
    // 🔥 토글 핸들러들
    const handleGPUAccelerationToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('performance', 'enableGPUAcceleration', checked);
    }, [
        updateSetting
    ]);
    const handleHardwareAccelerationToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((checked)=>{
        updateSetting('performance', 'enableHardwareAcceleration', checked);
    }, [
        updateSetting
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionIcon
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].sectionTitle,
                        children: "성능 설정"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].settingItem,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "GPU 가속 활성화",
                        description: "GPU를 사용하여 렌더링 성능을 향상시킵니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enableGPUAcceleration,
                            onChange: handleGPUAccelerationToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "하드웨어 가속 활성화",
                        description: "하드웨어 가속을 사용하여 전반적인 성능을 향상시킵니다",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$Toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toggle"], {
                            checked: settings.enableHardwareAcceleration,
                            onChange: handleHardwareAccelerationToggle
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "최대 CPU 사용률",
                        description: "앱이 사용할 수 있는 최대 CPU 사용률(%)을 설정하세요 (20-100%)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "20",
                            max: "100",
                            step: "5",
                            value: settings.maxCPUUsage,
                            onChange: handleMaxCPUUsageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$controls$2f$SettingItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingItem"], {
                        title: "최대 메모리 사용량",
                        description: "앱이 사용할 수 있는 최대 메모리 사용량(MB)을 설정하세요 (512-8192MB)",
                        control: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "512",
                            max: "8192",
                            step: "256",
                            value: settings.maxMemoryUsage,
                            onChange: handleMaxMemoryUsageChange,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].numberInput
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
});
PerformanceSettingsSection.displayName = 'PerformanceSettingsSection';
}}),
"[project]/src/renderer/app/settings/components/SettingsActions.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 설정 액션 버튼 컴포넌트 - 최적화
__turbopack_context__.s({
    "SettingsActions": (()=>SettingsActions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const SettingsActions = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].memo(({ saving, onSave, onReset })=>{
    // 🔥 저장 핸들러
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await onSave();
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }, [
        onSave
    ]);
    // 🔥 리셋 핸들러 (확인 다이얼로그 포함)
    const handleReset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const confirmed = window.confirm('모든 설정을 기본값으로 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.');
        if (confirmed) {
            try {
                await onReset();
            } catch (error) {
                console.error('Failed to reset settings:', error);
            }
        }
    }, [
        onReset
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].actions,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].secondaryButton}`,
                onClick: handleReset,
                disabled: saving,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                        className: "w-4 h-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    "기본값으로 복원"
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].primaryButton}`,
                onClick: handleSave,
                disabled: saving,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                        className: "w-4 h-4 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    saving ? '저장 중...' : '모든 설정 저장'
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/components/SettingsActions.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
});
SettingsActions.displayName = 'SettingsActions';
}}),
"[project]/src/renderer/app/settings/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// 🔥 기가차드 Settings 페이지 - 완전 리팩토링 (756줄 → 80줄)
__turbopack_context__.s({
    "default": (()=>SettingsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/constants/styles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/hooks/useSettings.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsNavigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/SettingsNavigation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$AppSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/AppSettingsSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$ProfileSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/ProfileSettingsSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$KeyboardSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/KeyboardSettingsSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$UISettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/UISettingsSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$NotificationSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/NotificationSettingsSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$PerformanceSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/sections/PerformanceSettingsSection.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/app/settings/components/SettingsActions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-ssr] (ecmascript)");
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
function SettingsPage() {
    const { settings, loading, saving, updateSetting, saveAllSettings, resetSettings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSettings"])();
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('app');
    const { setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    // 🔥 로딩 상태 처리
    if (loading || !settings) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].loading,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].loadingContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].spinner
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/page.tsx",
                            lineNumber: 32,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].loadingText,
                            children: "설정을 불러오는 중..."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/app/settings/page.tsx",
                            lineNumber: 33,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/renderer/app/settings/page.tsx",
                    lineNumber: 31,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/app/settings/page.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].container} min-w-0`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].pageTitle,
                children: "설정"
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsNavigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsNavigation"], {
                activeSection: activeSection,
                onSectionChange: setActiveSection
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$constants$2f$styles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SETTINGS_PAGE_STYLES"].section} min-w-0`,
                children: [
                    activeSection === 'app' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$AppSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppSettingsSection"], {
                        settings: settings.app,
                        updateSetting: updateSetting,
                        setTheme: setTheme
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    activeSection === 'account' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$ProfileSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        settings: settings.account,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this),
                    activeSection === 'notifications' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$NotificationSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NotificationSettingsSection"], {
                        settings: settings.notifications,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    activeSection === 'ui' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$UISettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UISettingsSection"], {
                        settings: settings.ui,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    activeSection === 'keyboard' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$KeyboardSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KeyboardSettingsSection"], {
                        settings: settings.keyboard,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    activeSection === 'performance' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$sections$2f$PerformanceSettingsSection$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PerformanceSettingsSection"], {
                        settings: settings.performance,
                        updateSetting: updateSetting
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/app/settings/page.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$app$2f$settings$2f$components$2f$SettingsActions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsActions"], {
                saving: saving,
                onSave: saveAllSettings,
                onReset: resetSettings
            }, void 0, false, {
                fileName: "[project]/src/renderer/app/settings/page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/app/settings/page.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_renderer_d5faf34f._.js.map