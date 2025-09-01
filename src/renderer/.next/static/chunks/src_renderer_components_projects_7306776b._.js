(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/renderer/components/projects/hooks/useAutoSave.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAutoSave": (()=>useAutoSave)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useAutoSave({ projectId, delay = 5000, onSave, onSaveSuccess, onSaveError }) {
    _s();
    const saveTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isLoadingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const retryCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastTypingTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0); // 🔥 마지막 타이핑 시간 추적
    const maxRetries = 3;
    // 🔥 노션 스타일 Debounced 저장 (타이핑 중단 후에만)
    const debouncedSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[debouncedSave]": ()=>{
            // 🔥 타이핑 시간 업데이트
            lastTypingTimeRef.current = Date.now();
            // 기존 타이머 취소
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            // 새 타이머 설정 - 사용자가 타이핑을 멈춘 후에만 실행
            saveTimerRef.current = setTimeout({
                "useAutoSave.useCallback[debouncedSave]": async ()=>{
                    const timeSinceLastTyping = Date.now() - lastTypingTimeRef.current;
                    // 🔥 핵심: 마지막 타이핑 후 충분한 시간이 지났는지 확인
                    if (timeSinceLastTyping < delay * 0.9) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Still typing, postponing save', {
                            projectId,
                            timeSinceLastTyping,
                            requiredDelay: delay
                        });
                        // 다시 스케줄링
                        debouncedSave();
                        return;
                    }
                    if (isLoadingRef.current) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Save already in progress, skipping', {
                            projectId
                        });
                        return;
                    }
                    try {
                        isLoadingRef.current = true;
                        const startTime = Date.now();
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', '💾 Starting auto-save (typing stopped)', {
                            projectId,
                            timeSinceLastTyping
                        });
                        await onSave();
                        retryCountRef.current = 0; // 성공 시 재시도 카운터 리셋
                        const duration = Date.now() - startTime;
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', '✅ Auto-save completed', {
                            projectId,
                            duration: `${duration}ms`,
                            timeSinceLastTyping
                        });
                        onSaveSuccess?.();
                    } catch (error) {
                        const errorObj = error instanceof Error ? error : new Error(String(error));
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', '❌ Auto-save failed', errorObj);
                        // 재시도 로직
                        if (retryCountRef.current < maxRetries) {
                            retryCountRef.current++;
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('AUTO_SAVE', `Retrying save (${retryCountRef.current}/${maxRetries})`, {
                                projectId
                            });
                            // 재시도 딜레이 (2초, 4초, 8초로 점진적 증가)
                            setTimeout({
                                "useAutoSave.useCallback[debouncedSave]": ()=>{
                                    debouncedSave();
                                }
                            }["useAutoSave.useCallback[debouncedSave]"], Math.pow(2, retryCountRef.current) * 1000);
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', 'Max retries exceeded', {
                                projectId
                            });
                            onSaveError?.(errorObj);
                        }
                    } finally{
                        isLoadingRef.current = false;
                        saveTimerRef.current = null;
                    }
                }
            }["useAutoSave.useCallback[debouncedSave]"], delay);
        }
    }["useAutoSave.useCallback[debouncedSave]"], [
        projectId,
        delay,
        onSave,
        onSaveSuccess,
        onSaveError
    ]);
    // 🔥 즉시 저장 (Ctrl+S용)
    const forceSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[forceSave]": async ()=>{
            // 기존 debounced 저장 취소
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
                saveTimerRef.current = null;
            }
            if (isLoadingRef.current) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('AUTO_SAVE', 'Save already in progress, cannot force save', {
                    projectId
                });
                return;
            }
            try {
                isLoadingRef.current = true;
                const startTime = Date.now();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', 'Starting force save', {
                    projectId
                });
                await onSave();
                retryCountRef.current = 0;
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('AUTO_SAVE', '✅ Force save completed', {
                    projectId,
                    duration: `${duration}ms`
                });
                onSaveSuccess?.();
            } catch (error) {
                const errorObj = error instanceof Error ? error : new Error(String(error));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('AUTO_SAVE', '❌ Force save failed', errorObj);
                onSaveError?.(errorObj);
            } finally{
                isLoadingRef.current = false;
            }
        }
    }["useAutoSave.useCallback[forceSave]"], [
        projectId,
        onSave,
        onSaveSuccess,
        onSaveError
    ]);
    // 🔥 컴포넌트 언마운트 시 정리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAutoSave.useEffect": ()=>{
            return ({
                "useAutoSave.useEffect": ()=>{
                    if (saveTimerRef.current) {
                        clearTimeout(saveTimerRef.current);
                    }
                }
            })["useAutoSave.useEffect"];
        }
    }["useAutoSave.useEffect"], []);
    return {
        debouncedSave,
        forceSave,
        isLoading: isLoadingRef.current
    };
}
_s(useAutoSave, "ymrcmsaSX6lbDFp649yCD4Rm2D8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useProjectData": (()=>useProjectData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/WriterStats.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useAutoSave.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-client] (ecmascript)"); // 🔥 스토어 import 추가
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function useProjectData(projectId) {
    _s();
    const sessionStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Date.now());
    // 🔥 성능 최적화: 기본 날짜 메모이제이션 (new Date() 반복 생성 방지)
    const defaultDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultDate]": ()=>new Date()
    }["useProjectData.useMemo[defaultDate]"], []);
    // 🔥 성능 최적화: 기본 데이터 메모이제이션 (중복 객체 생성 방지)
    const defaultCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultCharacters]": ()=>[
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
            ]
    }["useProjectData.useMemo[defaultCharacters]"], [
        projectId,
        defaultDate
    ]);
    const defaultNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultNotes]": ()=>[
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
            ]
    }["useProjectData.useMemo[defaultNotes]"], [
        projectId,
        defaultDate
    ]);
    const defaultStructure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[defaultStructure]": ()=>[
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
            ]
    }["useProjectData.useMemo[defaultStructure]"], [
        projectId,
        defaultDate
    ]);
    // 🔥 로딩 및 에러 상태 추가
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🔥 기본 프로젝트 상태
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [chapters, setChapters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('{}'); // JSON 문자열
    const [lastSaved, setLastSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('saved');
    // 🔥 ref로 최신 값 추적 (성능 최적화: useEffect 제거)
    const titleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const chaptersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('{}'); // 🔥 chapters ref 추가
    // 🔥 최적화: setter에서 직접 ref 업데이트 (useEffect 불필요)
    const setTitleOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[setTitleOptimized]": (newTitle)=>{
            titleRef.current = newTitle;
            setTitle(newTitle);
        }
    }["useProjectData.useCallback[setTitleOptimized]"], []);
    const setContentOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[setContentOptimized]": (newContent)=>{
            contentRef.current = newContent;
            setContent(newContent);
        }
    }["useProjectData.useCallback[setContentOptimized]"], []);
    const setChaptersOptimized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[setChaptersOptimized]": (newChapters)=>{
            console.log('🔥 DEBUG: setChaptersOptimized called', {
                newChapters,
                currentRef: chaptersRef.current
            });
            chaptersRef.current = newChapters;
            setChapters(newChapters);
            console.log('🔥 DEBUG: setChaptersOptimized completed', {
                updatedRef: chaptersRef.current
            });
        }
    }["useProjectData.useCallback[setChaptersOptimized]"], []);
    // 🔥 작가 데이터
    const [characters, setCharacters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [structure, setStructure] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // 🔥 notes 상태 추가
    const [writerStats, setWriterStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
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
    const loadProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[loadProject]": async ()=>{
            try {
                setIsLoading(true);
                setError(null);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Loading project', {
                    projectId
                });
                // retry helper: 짧은 지연으로 재시도 (DB 동기화 지연 대응)
                const sleep = {
                    "useProjectData.useCallback[loadProject].sleep": (ms)=>new Promise({
                            "useProjectData.useCallback[loadProject].sleep": (resolve)=>setTimeout(resolve, ms)
                        }["useProjectData.useCallback[loadProject].sleep"])
                }["useProjectData.useCallback[loadProject].sleep"];
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
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', `Project not found, retrying (${attempt}/${maxAttempts})`, {
                            projectId
                        });
                    } catch (err) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', `Attempt ${attempt} failed`, err);
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
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Characters loaded successfully', {
                                count: charactersResult.data.length
                            });
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No characters found, using defaults');
                            // 기본 캐릭터 데이터
                            setCharacters(defaultCharacters);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load characters, using defaults', error);
                        setCharacters(defaultCharacters);
                    }
                    // 🔥 실제 데이터 로드 - 구조 데이터
                    try {
                        const structureResult = await window.electronAPI.projects.getStructure(projectId);
                        if (structureResult.success && structureResult.data) {
                            setStructure(structureResult.data);
                            // 🔥 DB 데이터를 Zustand 스토어에 동기화
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().setStructures(projectId, structureResult.data);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Structure loaded and synced to store', {
                                count: structureResult.data.length
                            });
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No structure found, using defaults');
                            // 기본 구조 데이터
                            setStructure(defaultStructure);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load structure, using defaults', error);
                        setStructure(defaultStructure);
                    }
                    // 🔥 실제 데이터 로드 - 노트 데이터
                    try {
                        const notesResult = await window.electronAPI.projects.getNotes(projectId);
                        if (notesResult.success && notesResult.data) {
                            setNotes(notesResult.data);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Notes loaded successfully', {
                                count: notesResult.data.length
                            });
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'No notes found, using defaults');
                            // 기본 노트 데이터
                            setNotes(defaultNotes);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to load notes, using defaults', error);
                        setNotes(defaultNotes);
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Project loaded successfully');
                } else {
                    throw new Error(result.error || 'Failed to load project');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error loading project', error);
                setError(error instanceof Error ? error.message : 'Failed to load project');
                // 🔥 실패 시 로컬 백업 확인
                try {
                    const backup = localStorage.getItem(`project_backup_${projectId}`);
                    if (backup) {
                        const backupData = JSON.parse(backup);
                        setTitle(backupData.title || '');
                        setContent(backupData.content || '');
                        setSaveStatus('unsaved');
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Loaded from local backup');
                    }
                } catch (storageError) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to load backup', storageError);
                }
            } finally{
                setIsLoading(false); // 🔥 무조건 로딩 상태 해제
            }
        }
    }["useProjectData.useCallback[loadProject]"], [
        projectId
    ]);
    // 🔥 프로젝트 저장 함수 (ref로 무한루프 방지)
    const saveProjectInternal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveProjectInternal]": async ()=>{
            try {
                const currentTitle = titleRef.current;
                const currentContent = contentRef.current;
                const currentChapters = chaptersRef.current; // 🔥 ref에서 최신 chapters 가져오기
                if (!currentTitle.trim() && !currentContent.trim()) return;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving project to server', {
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Local backup saved');
                } catch (storageError) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_DATA', 'Failed to save local backup', storageError);
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Project saved successfully to server', {
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
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving project', error);
                setSaveStatus('error');
                throw error;
            }
        }
    }["useProjectData.useCallback[saveProjectInternal]"], [
        projectId
    ]); // 🔥 projectId만 dependency로 설정
    // 🔥 노션 스타일 autoSave Hook 사용 - 타이핑 중단 후 저장
    const { debouncedSave, forceSave, isLoading: isSaving } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoSave"])({
        projectId,
        delay: 3000,
        onSave: saveProjectInternal,
        onSaveSuccess: {
            "useProjectData.useAutoSave": ()=>{
                setSaveStatus('saved');
                setLastSaved(new Date());
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', '✅ 자동 저장 완료', {
                    projectId
                });
            }
        }["useProjectData.useAutoSave"],
        onSaveError: {
            "useProjectData.useAutoSave": (error)=>{
                setSaveStatus('error');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', '❌ 자동 저장 실패', {
                    error: error.message,
                    projectId
                });
                // 에러 발생 시 로컬 백업 생성
                try {
                    localStorage.setItem(`project_backup_${projectId}`, JSON.stringify({
                        title,
                        content
                    }));
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', '📦 로컬 백업 저장됨', {
                        projectId
                    });
                } catch (backupError) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', '❌ 로컬 백업 실패', backupError);
                }
            }
        }["useProjectData.useAutoSave"]
    });
    // 🔥 호환성을 위한 saveProject 함수
    const saveProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveProject]": async ()=>{
            await forceSave();
        }
    }["useProjectData.useCallback[saveProject]"], [
        forceSave
    ]);
    // 🔥 비용이 큰 통계 계산을 메모이제이션 (Hook 규칙 준수)
    const memoizedStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProjectData.useMemo[memoizedStats]": ()=>{
            if (!content) return writerStats;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateWriterStats"])(content, writerStats.wordGoal, sessionStartRef.current);
        }
    }["useProjectData.useMemo[memoizedStats]"], [
        content,
        writerStats.wordGoal,
        writerStats
    ]);
    // 🔥 작가 통계 업데이트 (메모이제이션된 값 사용)
    const updateWriterStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[updateWriterStats]": ()=>{
            setWriterStats(memoizedStats);
        }
    }["useProjectData.useCallback[updateWriterStats]"], [
        memoizedStats
    ]);
    const setWordGoal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[setWordGoal]": (goal)=>{
            setWriterStats({
                "useProjectData.useCallback[setWordGoal]": (prev)=>({
                        ...prev,
                        wordGoal: goal,
                        progress: Math.min(100, Math.round(prev.wordCount / goal * 100))
                    })
            }["useProjectData.useCallback[setWordGoal]"]);
        }
    }["useProjectData.useCallback[setWordGoal]"], []);
    // 🔥 프로젝트 초기 로드 (성능 최적화: loadProject를 useRef로 안전하게 관리)
    const loadProjectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(loadProject);
    loadProjectRef.current = loadProject;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            if (projectId) {
                loadProjectRef.current();
            }
        }
    }["useProjectData.useEffect"], [
        projectId
    ]); // 🔥 projectId만 dependency로 - 무한루프 완전 방지
    // 🔥 자동 저장 시스템 (성능 최적화: ref로 무한루프 방지)
    const debouncedSaveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(debouncedSave);
    debouncedSaveRef.current = debouncedSave;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            // 🔥 JSON 문자열 검증: 빈 객체가 아닌 실제 데이터가 있을 때만 저장
            const hasRealChapters = ({
                "useProjectData.useEffect.hasRealChapters": ()=>{
                    try {
                        const parsed = JSON.parse(chapters);
                        return Object.keys(parsed).length > 0;
                    } catch  {
                        return false;
                    }
                }
            })["useProjectData.useEffect.hasRealChapters"]();
            if (title.trim() || content.trim() || hasRealChapters) {
                setSaveStatus('unsaved');
                debouncedSaveRef.current(); // ref를 통해 안전하게 호출
            }
        }
    }["useProjectData.useEffect"], [
        title,
        content,
        chapters
    ]); // 🔥 chapters 추가로 auto-save 트리거
    // 🔥 저장 중 상태 관리
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            if (isSaving) {
                setSaveStatus('saving');
            }
        }
    }["useProjectData.useEffect"], [
        isSaving
    ]);
    // 🔥 통계 업데이트 (기가차드 수정: interval 제거로 커서 리셋 완전 해결)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProjectData.useEffect": ()=>{
            updateWriterStats();
        // 🔥 30초 interval 완전 제거 - 커서 리셋 원인 제거
        // 세션 시간은 사용자가 통계를 볼 때만 계산하도록 변경
        }
    }["useProjectData.useEffect"], []); // 🔥 dependency 완전 제거 - useEffect 지옥 해결
    // 🔥 캐릭터 저장 함수
    const saveCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveCharacters]": async (charactersToSave)=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving characters', {
                    count: charactersToSave.length
                });
                // 🔥 실제 API 호출
                const result = await window.electronAPI.projects.updateCharacters(projectId, charactersToSave);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Characters saved successfully');
                } else {
                    throw new Error(result.error || 'Failed to save characters');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving characters', error);
                throw error;
            }
        }
    }["useProjectData.useCallback[saveCharacters]"], [
        projectId
    ]);
    // 🔥 메모 저장 함수
    const saveNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[saveNotes]": async (notesToSave)=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_DATA', 'Saving notes', {
                    count: notesToSave.length
                });
                // 🔥 실제 API 호출
                const result = await window.electronAPI.projects.updateNotes(projectId, notesToSave);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_DATA', 'Notes saved successfully');
                } else {
                    throw new Error(result.error || 'Failed to save notes');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Error saving notes', error);
                throw error;
            }
        }
    }["useProjectData.useCallback[saveNotes]"], [
        projectId
    ]);
    // 🔥 캐릭터 변경 핸들러 (자동 저장 포함)
    const handleCharactersChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[handleCharactersChange]": async (newCharacters)=>{
            setCharacters(newCharacters);
            try {
                await saveCharacters(newCharacters);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to save characters automatically', error);
            // 사용자에게 에러 표시할 수 있음
            }
        }
    }["useProjectData.useCallback[handleCharactersChange]"], [
        saveCharacters
    ]);
    // 🔥 메모 변경 핸들러 (자동 저장 포함)  
    const handleNotesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProjectData.useCallback[handleNotesChange]": async (newNotes)=>{
            setNotes(newNotes);
            try {
                await saveNotes(newNotes);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_DATA', 'Failed to save notes automatically', error);
            // 사용자에게 에러 표시할 수 있음
            }
        }
    }["useProjectData.useCallback[handleNotesChange]"], [
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
_s(useProjectData, "5byDQ9XXKNfhrwhCCJ0xB6KxBuc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useAutoSave$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoSave"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/hooks/useUIState.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useUIState": (()=>useUIState)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/providers/ThemeProvider.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function useUIState() {
    _s();
    // 🔥 테마 관리를 ThemeProvider로 위임
    const { resolvedTheme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    // 🔥 UI 상태 (테마 제외)
    const [showLeftSidebar, setShowLeftSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showRightSidebar, setShowRightSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHeader, setShowHeader] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isFocusMode, setIsFocusMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 핸들러 함수들
    const toggleLeftSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleLeftSidebar]": ()=>{
            setShowLeftSidebar({
                "useUIState.useCallback[toggleLeftSidebar]": (prev)=>!prev
            }["useUIState.useCallback[toggleLeftSidebar]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Left sidebar toggled');
        }
    }["useUIState.useCallback[toggleLeftSidebar]"], []);
    const toggleRightSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleRightSidebar]": ()=>{
            setShowRightSidebar({
                "useUIState.useCallback[toggleRightSidebar]": (prev)=>!prev
            }["useUIState.useCallback[toggleRightSidebar]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Right sidebar toggled');
        }
    }["useUIState.useCallback[toggleRightSidebar]"], []);
    const toggleDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleDarkMode]": ()=>{
            toggleTheme(); // ThemeProvider의 토글 사용
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('UI_STATE', 'Dark mode toggled via ThemeProvider');
        }
    }["useUIState.useCallback[toggleDarkMode]"], [
        toggleTheme
    ]);
    const toggleFocusMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUIState.useCallback[toggleFocusMode]": ()=>{
            setIsFocusMode({
                "useUIState.useCallback[toggleFocusMode]": (prev)=>{
                    const newValue = !prev;
                    if (newValue) {
                        setShowLeftSidebar(false);
                        setShowRightSidebar(false);
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('UI_STATE', `Focus mode ${newValue ? 'enabled' : 'disabled'}`);
                    return newValue;
                }
            }["useUIState.useCallback[toggleFocusMode]"]);
        }
    }["useUIState.useCallback[toggleFocusMode]"], []);
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
_s(useUIState, "iDq1zUEYv1oeR2DnzwMUemb5lWs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$providers$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/ProjectEditor.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ProjectEditor": (()=>ProjectEditor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/EditorProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/ShortcutHelp.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$WriterSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/WriterSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStatsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/editor/WriterStatsPanel.tsx [app-client] (ecmascript)"); // 🔥 AI 창작 파트너 패널 추가
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ProjectHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ProjectHeader.tsx [app-client] (ecmascript)"); // 🔥 새로운 모듈화된 헤더
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$EditorTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/EditorTabBar.tsx [app-client] (ecmascript)"); // 🔥 NEW: 탭 바
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$NewChapterModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/NewChapterModal.tsx [app-client] (ecmascript)"); // 🔥 NEW: 새 챕터 모달
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDeleteDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDeleteDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ConfirmDialog.tsx [app-client] (ecmascript)"); // 🔥 범용 확인 다이얼로그 추가
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ShareDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/components/ShareDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$WriteView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/WriteView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/StructureView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/stores/useStructureStore.ts [app-client] (ecmascript)"); // 🔥 스토어 import 추가
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/CharactersView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/NotesView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$SynopsisView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/SynopsisView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$IdeaView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/views/IdeaView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
// 🔥 실제 hooks import (기가차드 수정)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useProjectData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/hooks/useUIState.ts [app-client] (ecmascript)");
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
// 🔥 기가차드 UI 문제점 해결된 스타일
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
const ProjectEditor = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function ProjectEditor({ projectId }) {
    _s();
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'ProjectEditor render started', {
        projectId
    }); // replaced logger.log with Logger
    // 🔥 커스텀 hooks 사용
    const { isLoading, error, ...projectData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"])(projectId);
    const uiState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"])();
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('write'); // 🔥 프로젝트 진입 시 바로 글쓰기 에디터 표시
    const [currentSubView, setCurrentSubView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''); // 🔥 서브 뷰 상태 (시놉시스, 아이디어 등)
    const [editingItemId, setEditingItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''); // 🔥 편집 중인 아이템 ID
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRightSidebar, setShowRightSidebar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 AI 사이드바 상태 추가
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showShareDialog, setShowShareDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNewChapterModal, setShowNewChapterModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 NEW: 새 챕터 모달 상태
    const [showChapterDeleteDialog, setShowChapterDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 챕터 삭제 확인 다이얼로그
    const [chapterToDelete, setChapterToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // 🔥 삭제할 챕터 정보
    // 🔥 NEW: 탭 시스템 상태 (글쓰기 에디터만)
    const [tabs, setTabs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 'main',
            title: '메인',
            type: 'main',
            isActive: true,
            order: 0,
            content: '' // 메인 탭의 독립적인 컨텐츠
        }
    ]);
    const [activeTabId, setActiveTabId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('main');
    const [nextTabOrder, setNextTabOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    // 🔥 저장 완료 후 모든 탭의 isDirty 상태 초기화
    const handleSaveSuccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleSaveSuccess]": ()=>{
            setTabs({
                "ProjectEditor.ProjectEditor.useCallback[handleSaveSuccess]": (prevTabs)=>prevTabs.map({
                        "ProjectEditor.ProjectEditor.useCallback[handleSaveSuccess]": (tab)=>({
                                ...tab,
                                isDirty: false
                            })
                    }["ProjectEditor.ProjectEditor.useCallback[handleSaveSuccess]"])
            }["ProjectEditor.ProjectEditor.useCallback[handleSaveSuccess]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'All tabs marked as saved');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleSaveSuccess]"], []);
    // 🔥 저장 상태 변화 감지하여 탭 상태 업데이트
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            if (projectData.saveStatus === 'saved') {
                handleSaveSuccess();
            }
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        projectData.saveStatus,
        handleSaveSuccess
    ]);
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hasRestoredTabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false); // 🔥 탭 복원 중복 방지
    // 🔥 프로젝트 로드 시 chapters에서 탭 복원 (중복 방지)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            if (!isLoading && projectData.chapters && !hasRestoredTabs.current) {
                try {
                    const chaptersData = JSON.parse(projectData.chapters);
                    const chapterIds = Object.keys(chaptersData);
                    if (chapterIds.length === 0) return; // 빈 chapters는 무시
                    // 🔥 useStructureStore의 데이터와 교차 검증 (삭제된 챕터 필터링)
                    const structureStore = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState();
                    const existingStructures = structureStore.structures[projectId] || [];
                    const validChapterIds = chapterIds.filter({
                        "ProjectEditor.ProjectEditor.useEffect.validChapterIds": (chapterId)=>existingStructures.some({
                                "ProjectEditor.ProjectEditor.useEffect.validChapterIds": (structure)=>structure.id === chapterId && structure.type === 'chapter'
                            }["ProjectEditor.ProjectEditor.useEffect.validChapterIds"])
                    }["ProjectEditor.ProjectEditor.useEffect.validChapterIds"]);
                    if (validChapterIds.length === 0) return; // 유효한 챕터가 없으면 복원하지 않음
                    // 새로운 챕터 탭들 생성 (고유한 탭 ID 사용)
                    const chapterTabs = validChapterIds.map({
                        "ProjectEditor.ProjectEditor.useEffect.chapterTabs": (chapterId, index)=>{
                            const structure = existingStructures.find({
                                "ProjectEditor.ProjectEditor.useEffect.chapterTabs.structure": (s)=>s.id === chapterId
                            }["ProjectEditor.ProjectEditor.useEffect.chapterTabs.structure"]);
                            return {
                                id: `tab-chapter-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                                title: structure?.title || `${index + 1}챕터`,
                                type: 'chapter',
                                isActive: false,
                                order: index + 1,
                                content: chaptersData[chapterId],
                                chapterId,
                                isDirty: false // 🔥 복원된 탭은 저장된 상태
                            };
                        }
                    }["ProjectEditor.ProjectEditor.useEffect.chapterTabs"]);
                    // 메인 탭 + 복원된 챕터 탭들
                    setTabs([
                        {
                            id: 'main',
                            title: '메인',
                            type: 'main',
                            isActive: true,
                            order: 0,
                            content: projectData.content || '',
                            isDirty: false // 🔥 초기 로드 시 저장된 상태
                        },
                        ...chapterTabs
                    ]);
                    // nextTabOrder 설정
                    setNextTabOrder(chapterTabs.length + 1);
                    hasRestoredTabs.current = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Tabs restored from chapters with validation', {
                        chaptersCount: chapterTabs.length,
                        validChapterIds,
                        totalChapterIds: chapterIds.length
                    });
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Failed to restore tabs from chapters', error);
                }
            }
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        isLoading,
        projectData.chapters,
        projectData.content,
        projectId
    ]);
    const [isEditorReady, setIsEditorReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 🔥 에디터 준비 상태 추가
    // 🔥 Google Docs 연동 감지 및 상태 관리
    const [isGoogleDocsProject, setIsGoogleDocsProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [googleDocMeta, setGoogleDocMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSyncingWithGoogle, setIsSyncingWithGoogle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fullProjectData, setFullProjectData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // 🔥 전체 프로젝트 데이터
    // 🔥 프로젝트 전체 데이터 로드
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            const loadFullProject = {
                "ProjectEditor.ProjectEditor.useEffect.loadFullProject": async ()=>{
                    try {
                        const result = await window.electronAPI?.projects?.getById(projectId);
                        if (result?.success && result.data) {
                            setFullProjectData(result.data);
                        }
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Failed to load full project data', error);
                    }
                }
            }["ProjectEditor.ProjectEditor.useEffect.loadFullProject"];
            if (projectId) {
                loadFullProject();
            }
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        projectId
    ]);
    // 🔥 Google Docs 메타데이터 파싱 및 설정
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            if (fullProjectData?.description) {
                try {
                    const match = fullProjectData.description.match(/\[Google Docs 연동 정보: (\{.*\})\]$/s);
                    if (match && match[1]) {
                        const parsed = JSON.parse(match[1]);
                        if (parsed && parsed.isGoogleDocsProject) {
                            setIsGoogleDocsProject(true);
                            setGoogleDocMeta(parsed);
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Google Docs project detected', {
                                googleDocId: parsed.googleDocId,
                                googleDocUrl: parsed.googleDocUrl
                            });
                        }
                    }
                } catch (parseErr) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Google Docs 메타데이터 파싱 실패', {
                        err: parseErr,
                        projectId
                    });
                }
            }
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        fullProjectData?.description,
        projectId
    ]);
    // 🔥 메인 탭 content를 프로젝트 데이터와 동기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            if (projectData.content !== undefined) {
                setTabs({
                    "ProjectEditor.ProjectEditor.useEffect": (prevTabs)=>prevTabs.map({
                            "ProjectEditor.ProjectEditor.useEffect": (tab)=>tab.type === 'main' ? {
                                    ...tab,
                                    content: projectData.content
                                } : tab
                        }["ProjectEditor.ProjectEditor.useEffect"])
                }["ProjectEditor.ProjectEditor.useEffect"]);
            }
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        projectData.content
    ]);
    // 🔥 에디터 상태 업데이트
    const { setCurrentEditor, addStructureItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    // 🔥 현재 뷰에 따라 에디터 상태 업데이트 (안전한 버전)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            if (!projectId) return;
            if (currentView === 'structure') {
                setCurrentEditor({
                    projectId,
                    editorType: 'structure'
                });
            } else if (currentView === 'write') {
                setCurrentEditor({
                    projectId,
                    editorType: 'chapter',
                    itemId: editingItemId,
                    itemTitle: editingItemId ? `${editingItemId}챕터` : undefined
                });
            } else if (currentView === 'characters') {
                setCurrentEditor({
                    projectId,
                    editorType: 'characters'
                });
            } else if (currentView === 'notes') {
                setCurrentEditor({
                    projectId,
                    editorType: 'notes'
                });
            } else if (currentView === 'synopsis') {
                setCurrentEditor({
                    projectId,
                    editorType: 'synopsis',
                    itemId: editingItemId,
                    itemTitle: '시놉시스'
                });
            } else if (currentView === 'idea') {
                setCurrentEditor({
                    projectId,
                    editorType: 'idea',
                    itemId: editingItemId,
                    itemTitle: '아이디어'
                });
            }
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        currentView,
        editingItemId,
        projectId,
        setCurrentEditor
    ]);
    // 🔥 Google Docs와 동기화 함수
    const syncWithGoogleDocs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[syncWithGoogleDocs]": async ()=>{
            if (!isGoogleDocsProject || !googleDocMeta?.googleDocId) return;
            setIsSyncingWithGoogle(true);
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Syncing with Google Docs', {
                    googleDocId: googleDocMeta.googleDocId
                });
                // Google Docs에서 최신 내용 가져오기
                const result = await window.electronAPI?.oauth?.importGoogleDoc(googleDocMeta.googleDocId);
                if (result?.success && result.data?.content) {
                    // 프로젝트 내용 업데이트
                    projectData.setContent(result.data.content);
                    await projectData.forceSave();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Google Docs sync completed', {
                        contentLength: result.data.content.length
                    });
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_EDITOR', 'Google Docs sync failed', result?.error);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Google Docs sync error', error);
            } finally{
                setIsSyncingWithGoogle(false);
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[syncWithGoogleDocs]"], [
        isGoogleDocsProject,
        googleDocMeta?.googleDocId,
        projectData
    ]);
    // 🔥 탭 관리 함수들 (중복 key 방지)
    const createNewTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[createNewTab]": (type, title, chapterId)=>{
            // 🔥 항상 고유한 ID 생성 (chapterId와 구분)
            const uniqueTabId = `tab-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newTab = {
                id: uniqueTabId,
                title,
                type,
                chapterId,
                isActive: false,
                order: nextTabOrder,
                content: '',
                isDirty: false // 🔥 새 탭은 초기에 저장된 상태
            };
            setTabs({
                "ProjectEditor.ProjectEditor.useCallback[createNewTab]": (prevTabs)=>{
                    // 🔥 중복 chapterId 체크
                    if (chapterId) {
                        const existingTab = prevTabs.find({
                            "ProjectEditor.ProjectEditor.useCallback[createNewTab].existingTab": (tab)=>tab.chapterId === chapterId
                        }["ProjectEditor.ProjectEditor.useCallback[createNewTab].existingTab"]);
                        if (existingTab) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_EDITOR', 'Tab with same chapterId already exists', {
                                chapterId
                            });
                            // 기존 탭을 활성화
                            setActiveTabId(existingTab.id);
                            return prevTabs.map({
                                "ProjectEditor.ProjectEditor.useCallback[createNewTab]": (tab)=>({
                                        ...tab,
                                        isActive: tab.id === existingTab.id
                                    })
                            }["ProjectEditor.ProjectEditor.useCallback[createNewTab]"]);
                        }
                    }
                    const updatedTabs = prevTabs.map({
                        "ProjectEditor.ProjectEditor.useCallback[createNewTab].updatedTabs": (tab)=>({
                                ...tab,
                                isActive: false
                            })
                    }["ProjectEditor.ProjectEditor.useCallback[createNewTab].updatedTabs"]);
                    return [
                        ...updatedTabs,
                        {
                            ...newTab,
                            isActive: true
                        }
                    ];
                }
            }["ProjectEditor.ProjectEditor.useCallback[createNewTab]"]);
            setActiveTabId(newTab.id);
            setNextTabOrder({
                "ProjectEditor.ProjectEditor.useCallback[createNewTab]": (prev)=>prev + 1
            }["ProjectEditor.ProjectEditor.useCallback[createNewTab]"]);
            // 🔥 새 탭 생성 후 즉시 해당 뷰로 전환
            if (type === 'chapter' && chapterId) {
                setCurrentView('write');
                setEditingItemId(chapterId);
            } else if (type === 'main') {
                setCurrentView('write');
                setEditingItemId('');
            } else {
                setCurrentView(type);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'New tab created and activated', {
                tabId: newTab.id,
                title,
                type,
                chapterId,
                currentView: type === 'chapter' ? 'write' : type
            });
            return newTab;
        }
    }["ProjectEditor.ProjectEditor.useCallback[createNewTab]"], [
        nextTabOrder
    ]);
    const switchToTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[switchToTab]": (tabId)=>{
            setTabs({
                "ProjectEditor.ProjectEditor.useCallback[switchToTab]": (prevTabs)=>prevTabs.map({
                        "ProjectEditor.ProjectEditor.useCallback[switchToTab]": (tab)=>({
                                ...tab,
                                isActive: tab.id === tabId
                            })
                    }["ProjectEditor.ProjectEditor.useCallback[switchToTab]"])
            }["ProjectEditor.ProjectEditor.useCallback[switchToTab]"]);
            setActiveTabId(tabId);
            // 탭에 따라 currentView 업데이트
            const targetTab = tabs.find({
                "ProjectEditor.ProjectEditor.useCallback[switchToTab].targetTab": (tab)=>tab.id === tabId
            }["ProjectEditor.ProjectEditor.useCallback[switchToTab].targetTab"]);
            if (targetTab) {
                if (targetTab.type === 'chapter') {
                    setCurrentView('write');
                    setEditingItemId(targetTab.chapterId || '');
                } else if (targetTab.type === 'main') {
                    // 🔥 메인 탭으로 전환 시 쓰기 뷰 활성화
                    setCurrentView('write');
                    setEditingItemId(''); // 메인은 editingItemId가 없음
                } else {
                    setCurrentView(targetTab.type);
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Switched to tab', {
                    tabId,
                    type: targetTab.type,
                    title: targetTab.title,
                    currentView: targetTab.type === 'main' ? 'write' : targetTab.type
                });
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[switchToTab]"], [
        tabs
    ]);
    const closeTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[closeTab]": async (tabId)=>{
            if (tabId === 'main') return; // 메인 탭은 닫을 수 없음
            // 닫힐 탭의 정보 가져오기
            const tabToClose = tabs.find({
                "ProjectEditor.ProjectEditor.useCallback[closeTab].tabToClose": (tab)=>tab.id === tabId
            }["ProjectEditor.ProjectEditor.useCallback[closeTab].tabToClose"]);
            // 🔥 챕터 탭을 닫을 때 삭제 확인 다이얼로그 표시
            if (tabToClose?.type === 'chapter' && tabToClose.chapterId) {
                setChapterToDelete({
                    id: tabToClose.chapterId,
                    title: tabToClose.title
                });
                setShowChapterDeleteDialog(true);
                return; // 다이얼로그 확인 후 실제 삭제 처리
            }
            // 메인 탭이나 다른 탭들은 바로 닫기
            performTabClose(tabId);
        }
    }["ProjectEditor.ProjectEditor.useCallback[closeTab]"], [
        tabs
    ]);
    // 🔥 실제 탭 닫기 처리 함수 (확인 후 실행)
    const performTabClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[performTabClose]": async (tabId)=>{
            const tabToClose = tabs.find({
                "ProjectEditor.ProjectEditor.useCallback[performTabClose].tabToClose": (tab)=>tab.id === tabId
            }["ProjectEditor.ProjectEditor.useCallback[performTabClose].tabToClose"]);
            // 🔥 탭 삭제 로그
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Performing tab close', {
                tabId,
                tabTitle: tabToClose?.title,
                totalTabs: tabs.length
            });
            setTabs({
                "ProjectEditor.ProjectEditor.useCallback[performTabClose]": (prevTabs)=>{
                    const filteredTabs = prevTabs.filter({
                        "ProjectEditor.ProjectEditor.useCallback[performTabClose].filteredTabs": (tab)=>tab.id !== tabId
                    }["ProjectEditor.ProjectEditor.useCallback[performTabClose].filteredTabs"]);
                    // 🔥 삭제 후 탭 상태 로그
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Tabs after deletion', {
                        remainingTabs: filteredTabs.length,
                        remainingTabIds: filteredTabs.map({
                            "ProjectEditor.ProjectEditor.useCallback[performTabClose]": (tab)=>tab.id
                        }["ProjectEditor.ProjectEditor.useCallback[performTabClose]"])
                    });
                    // 닫힌 탭이 활성 탭이었다면 다른 탭으로 전환
                    if (activeTabId === tabId && filteredTabs.length > 0) {
                        const newActiveTab = filteredTabs[filteredTabs.length - 1];
                        if (newActiveTab) {
                            // 🔥 모든 탭의 isActive 상태를 명확히 설정
                            const updatedTabs = filteredTabs.map({
                                "ProjectEditor.ProjectEditor.useCallback[performTabClose].updatedTabs": (tab)=>({
                                        ...tab,
                                        isActive: tab.id === newActiveTab.id
                                    })
                            }["ProjectEditor.ProjectEditor.useCallback[performTabClose].updatedTabs"]);
                            setActiveTabId(newActiveTab.id);
                            // currentView 업데이트
                            if (newActiveTab.type === 'chapter') {
                                setCurrentView('write');
                                setEditingItemId(newActiveTab.chapterId || '');
                            } else {
                                setCurrentView(newActiveTab.type);
                            }
                            return updatedTabs;
                        }
                    }
                    return filteredTabs.map({
                        "ProjectEditor.ProjectEditor.useCallback[performTabClose]": (tab)=>({
                                ...tab,
                                isActive: tab.id === activeTabId && tab.id !== tabId
                            })
                    }["ProjectEditor.ProjectEditor.useCallback[performTabClose]"]);
                }
            }["ProjectEditor.ProjectEditor.useCallback[performTabClose]"]);
            // 🔥 챕터 탭을 닫을 때 chapters JSON에서도 제거
            if (tabToClose?.type === 'chapter' && tabToClose.chapterId) {
                try {
                    const chapters = JSON.parse(projectData.chapters || '{}');
                    delete chapters[tabToClose.chapterId];
                    projectData.setChapters(JSON.stringify(chapters));
                    await projectData.forceSave();
                    // 🔥 구조 데이터에서도 삭제
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().deleteStructureItem(projectId, tabToClose.chapterId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Chapter deleted from both tabs and data', {
                        tabId,
                        chapterId: tabToClose.chapterId
                    });
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Failed to delete chapter data', {
                        tabId,
                        error
                    });
                }
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Tab closed', {
                tabId
            });
        }
    }["ProjectEditor.ProjectEditor.useCallback[performTabClose]"], [
        activeTabId,
        tabs,
        projectData,
        projectId
    ]);
    // 🔥 탭 재정렬 핸들러
    const handleTabReorder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleTabReorder]": (fromIndex, toIndex)=>{
            setTabs({
                "ProjectEditor.ProjectEditor.useCallback[handleTabReorder]": (prevTabs)=>{
                    const newTabs = [
                        ...prevTabs
                    ];
                    const [movedTab] = newTabs.splice(fromIndex, 1);
                    if (movedTab) {
                        newTabs.splice(toIndex, 0, movedTab);
                        // order 값 재정렬
                        return newTabs.map({
                            "ProjectEditor.ProjectEditor.useCallback[handleTabReorder]": (tab, index)=>({
                                    ...tab,
                                    order: index
                                })
                        }["ProjectEditor.ProjectEditor.useCallback[handleTabReorder]"]);
                    }
                    return newTabs;
                }
            }["ProjectEditor.ProjectEditor.useCallback[handleTabReorder]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Tabs reordered', {
                fromIndex,
                toIndex
            });
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleTabReorder]"], []);
    // 🔥 현재 활성 탭의 content 가져오기
    const getCurrentTabContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[getCurrentTabContent]": ()=>{
            const activeTab = tabs.find({
                "ProjectEditor.ProjectEditor.useCallback[getCurrentTabContent].activeTab": (tab)=>tab.id === activeTabId
            }["ProjectEditor.ProjectEditor.useCallback[getCurrentTabContent].activeTab"]);
            if (!activeTab) return '';
            // 메인 탭은 프로젝트 기본 content 사용
            if (activeTab.type === 'main') {
                return projectData.content || '';
            }
            // Chapter 탭은 chapters JSON에서 해당 chapter content 가져오기
            if (activeTab.type === 'chapter' && activeTab.chapterId) {
                try {
                    const chapters = JSON.parse(projectData.chapters || '{}');
                    return chapters[activeTab.chapterId] || '';
                } catch  {
                    return '';
                }
            }
            return '';
        }
    }["ProjectEditor.ProjectEditor.useCallback[getCurrentTabContent]"], [
        tabs,
        activeTabId,
        projectData.content,
        projectData.chapters
    ]);
    // 🔥 현재 활성 탭의 content 업데이트
    const updateCurrentTabContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent]": (newContent)=>{
            const activeTab = tabs.find({
                "ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent].activeTab": (tab)=>tab.id === activeTabId
            }["ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent].activeTab"]);
            if (!activeTab) return;
            // 탭 상태 업데이트 (dirty 표시)
            setTabs({
                "ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent]": (prevTabs)=>prevTabs.map({
                        "ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent]": (tab)=>tab.id === activeTabId ? {
                                ...tab,
                                content: newContent,
                                isDirty: true
                            } : tab
                    }["ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent]"])
            }["ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent]"]);
            // 메인 탭의 경우 프로젝트 데이터 업데이트
            if (activeTab.type === 'main') {
                projectData.setContent(newContent);
            }
            // Chapter 탭의 경우 chapters JSON 업데이트  
            if (activeTab.type === 'chapter' && activeTab.chapterId) {
                try {
                    const chapters = JSON.parse(projectData.chapters || '{}');
                    chapters[activeTab.chapterId] = newContent;
                    projectData.setChapters(JSON.stringify(chapters));
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Chapter content updated', {
                        chapterId: activeTab.chapterId,
                        contentLength: newContent.length
                    });
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Failed to update chapter content', error);
                }
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].debug('PROJECT_EDITOR', 'Tab content updated', {
                tabId: activeTabId,
                type: activeTab.type,
                contentLength: newContent.length
            });
        }
    }["ProjectEditor.ProjectEditor.useCallback[updateCurrentTabContent]"], [
        activeTabId,
        tabs,
        projectData
    ]);
    // 🔥 Google Docs로 내용 업로드 (향후 구현 예정)
    const updateGoogleDocs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[updateGoogleDocs]": async (content)=>{
            if (!isGoogleDocsProject || !googleDocMeta?.googleDocId) return;
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Updating Google Docs', {
                    googleDocId: googleDocMeta.googleDocId,
                    contentLength: content.length
                });
            // TODO: Google Docs API를 통한 내용 업데이트 구현 필요
            // const result = await window.electronAPI?.oauth?.updateGoogleDoc(googleDocMeta.googleDocId, content);
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Google Docs update error', error);
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[updateGoogleDocs]"], [
        isGoogleDocsProject,
        googleDocMeta?.googleDocId
    ]);
    // 🔥 외부 링크 열기 함수
    const openGoogleDocsExternal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[openGoogleDocsExternal]": ()=>{
            if (googleDocMeta?.googleDocUrl) {
                try {
                    if (window.electronAPI?.shell?.openExternal) {
                        window.electronAPI.shell.openExternal(googleDocMeta.googleDocUrl);
                    } else {
                        window.open(googleDocMeta.googleDocUrl, '_blank', 'noopener');
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Opened Google Docs externally', {
                        url: googleDocMeta.googleDocUrl
                    });
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Failed to open Google Docs', error);
                }
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[openGoogleDocsExternal]"], [
        googleDocMeta?.googleDocUrl
    ]);
    // 🔥 에디터 준비 완료 핸들러 (fallback 에디터용)
    const handleEditorReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleEditorReady]": (editor)=>{
            if (editor) {
                editorRef.current = editor;
            }
            setIsEditorReady(true); // 🔥 에디터 준비 완료 표시
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Editor ready (fallback mode)');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleEditorReady]"], []);
    const handleBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleBack]": ()=>window.history.back()
    }["ProjectEditor.ProjectEditor.useCallback[handleBack]"], []);
    const handleToggleSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]": ()=>setCollapsed({
                "ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]": (prev)=>!prev
            }["ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]"])
    }["ProjectEditor.ProjectEditor.useCallback[handleToggleSidebar]"], []);
    // 🔥 AI 사이드바 토글 핸들러 추가
    const handleToggleAISidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleToggleAISidebar]": ()=>{
            setShowRightSidebar({
                "ProjectEditor.ProjectEditor.useCallback[handleToggleAISidebar]": (prev)=>!prev
            }["ProjectEditor.ProjectEditor.useCallback[handleToggleAISidebar]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', `AI sidebar ${!showRightSidebar ? 'opened' : 'closed'}`);
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleToggleAISidebar]"], [
        showRightSidebar
    ]);
    // 🔥 내비게이션 핸들러들
    const handleNavigateToChapterEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleNavigateToChapterEdit]": (chapterId)=>{
            // 🔥 먼저 챕터가 실제로 존재하는지 확인
            const structureStore = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState();
            const structures = structureStore.structures[projectId] || [];
            const chapterStructure = structures.find({
                "ProjectEditor.ProjectEditor.useCallback[handleNavigateToChapterEdit].chapterStructure": (s)=>s.id === chapterId && s.type === 'chapter'
            }["ProjectEditor.ProjectEditor.useCallback[handleNavigateToChapterEdit].chapterStructure"]);
            if (!chapterStructure) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_EDITOR', 'Chapter not found in structure', {
                    chapterId
                });
                return; // 삭제된 챕터면 탭을 열지 않음
            }
            // 🔥 해당 챕터 탭이 이미 있는지 확인
            const existingTab = tabs.find({
                "ProjectEditor.ProjectEditor.useCallback[handleNavigateToChapterEdit].existingTab": (tab)=>tab.chapterId === chapterId
            }["ProjectEditor.ProjectEditor.useCallback[handleNavigateToChapterEdit].existingTab"]);
            if (existingTab) {
                // 기존 탭이 있으면 해당 탭으로 전환
                switchToTab(existingTab.id);
            } else {
                // 새 탭 생성 (챕터 제목은 구조에서 가져오기)
                const chapterTitle = chapterStructure.title || `챕터`;
                createNewTab('chapter', chapterTitle, chapterId);
            }
            setCurrentView('write');
            setEditingItemId(chapterId);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Navigate to chapter edit', {
                chapterId
            });
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleNavigateToChapterEdit]"], [
        tabs,
        switchToTab,
        createNewTab,
        projectId
    ]);
    const handleNavigateToSynopsisEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleNavigateToSynopsisEdit]": (synopsisId)=>{
            setCurrentView('synopsis');
            setCurrentSubView('synopsis');
            setEditingItemId(synopsisId);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Navigate to synopsis edit', {
                synopsisId
            });
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleNavigateToSynopsisEdit]"], []);
    const handleNavigateToIdeaEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleNavigateToIdeaEdit]": (ideaId)=>{
            setCurrentView('idea');
            setCurrentSubView('idea');
            setEditingItemId(ideaId);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Navigate to idea edit', {
                ideaId
            });
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleNavigateToIdeaEdit]"], []);
    const handleBackToStructure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleBackToStructure]": ()=>{
            setCurrentView('structure');
            setCurrentSubView('');
            setEditingItemId('');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleBackToStructure]"], []);
    // 🔥 WriterSidebar 핸들러들
    const handleAddStructure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleAddStructure]": async ()=>{
            setShowNewChapterModal(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'New chapter modal opened');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleAddStructure]"], []);
    // 🔥 NEW: 새 챕터 생성 확정 핸들러
    const handleCreateNewChapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter]": async (title)=>{
            try {
                const newChapterId = `chapter-${Date.now()}`;
                // 1. 자동 챕터 번호 생성 (빈 제목인 경우)
                let chapterTitle = title.trim();
                if (!chapterTitle) {
                    const existingChapters = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().structures[projectId] || [];
                    const chapterNumbers = existingChapters.filter({
                        "ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter].chapterNumbers": (s)=>s.type === 'chapter'
                    }["ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter].chapterNumbers"]).map({
                        "ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter].chapterNumbers": (s)=>{
                            const match = s.title.match(/(\d+)장/);
                            return match && match[1] ? parseInt(match[1]) : 0;
                        }
                    }["ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter].chapterNumbers"]).filter({
                        "ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter].chapterNumbers": (n)=>n > 0
                    }["ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter].chapterNumbers"]);
                    const nextChapterNumber = chapterNumbers.length > 0 ? Math.max(...chapterNumbers) + 1 : 1;
                    chapterTitle = `${nextChapterNumber}장`;
                }
                // 2. chapters JSON에 새 챕터 추가
                const existingChapters = JSON.parse(projectData.chapters || '{}');
                existingChapters[newChapterId] = ''; // 빈 content로 시작
                console.log('🔥 DEBUG: About to call setChapters', {
                    newChapterId,
                    chapterTitle,
                    userInputTitle: title,
                    chapters: existingChapters,
                    stringified: JSON.stringify(existingChapters)
                });
                projectData.setChapters(JSON.stringify(existingChapters));
                console.log('🔥 DEBUG: setChapters called, now calling forceSave');
                // 3. 구조 데이터에도 챕터 정보 저장
                const newStructureItem = {
                    id: newChapterId,
                    title: chapterTitle,
                    description: '',
                    type: 'chapter',
                    status: 'planning',
                    projectId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                // 🔥 Zustand 스토어에 추가 (DB 저장 포함)
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().addStructureItem(projectId, newStructureItem);
                // 4. 즉시 DB에 저장
                await projectData.forceSave();
                // 5. 새 탭 생성 (사용자 입력 제목 사용)
                createNewTab('chapter', chapterTitle, newChapterId);
                // 6. 쓰기 뷰로 설정
                setCurrentView('write');
                setEditingItemId(newChapterId);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'New chapter created and saved', {
                    chapterId: newChapterId,
                    title: chapterTitle // 🔥 실제 사용된 제목 로그
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Chapter creation error', error);
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleCreateNewChapter]"], [
        createNewTab,
        projectData,
        projectId
    ]); // 🔥 projectId 의존성 추가
    // 🔥 챕터 복제 핸들러
    const handleDuplicateChapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleDuplicateChapter]": async (originalId, originalTitle)=>{
            try {
                const newChapterId = `chapter-${Date.now()}`;
                const duplicatedTitle = `${originalTitle} (복사본)`;
                // 1. 원본 챕터 content 가져오기
                const existingChapters = JSON.parse(projectData.chapters || '{}');
                const originalContent = existingChapters[originalId] || '';
                // 2. 새 챕터를 chapters JSON에 추가
                existingChapters[newChapterId] = originalContent;
                projectData.setChapters(JSON.stringify(existingChapters));
                // 3. 구조 데이터에도 복제된 챕터 정보 저장
                const newStructureItem = {
                    id: newChapterId,
                    title: duplicatedTitle,
                    description: '',
                    type: 'chapter',
                    status: 'planning',
                    projectId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().addStructureItem(projectId, newStructureItem);
                // 4. 즉시 DB에 저장
                await projectData.forceSave();
                // 5. 새 탭 생성
                createNewTab('chapter', duplicatedTitle, newChapterId);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Chapter duplicated successfully', {
                    originalId,
                    newChapterId,
                    originalTitle,
                    duplicatedTitle
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Chapter duplication error', error);
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleDuplicateChapter]"], [
        createNewTab,
        projectData,
        projectId
    ]);
    // 🔥 완전한 챕터 삭제 핸들러 (스토어 + chapters JSON + 탭 정리)
    const handleDeleteChapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]": async (chapterId, title)=>{
            try {
                // 1. 구조 스토어에서 삭제
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().deleteStructureItem(projectId, chapterId);
                // 2. chapters JSON에서도 삭제
                const existingChapters = JSON.parse(projectData.chapters || '{}');
                delete existingChapters[chapterId];
                projectData.setChapters(JSON.stringify(existingChapters));
                // 3. 해당 챕터의 열린 탭들 모두 닫기
                setTabs({
                    "ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]": (prevTabs)=>{
                        const remainingTabs = prevTabs.filter({
                            "ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter].remainingTabs": (tab)=>tab.chapterId !== chapterId
                        }["ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter].remainingTabs"]);
                        // 활성 탭이 삭제된 경우 다른 탭으로 전환
                        if (activeTabId && prevTabs.find({
                            "ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]": (tab)=>tab.id === activeTabId
                        }["ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]"])?.chapterId === chapterId) {
                            if (remainingTabs.length > 0) {
                                const newActiveTab = remainingTabs[remainingTabs.length - 1];
                                if (newActiveTab) {
                                    setActiveTabId(newActiveTab.id);
                                    if (newActiveTab.type === 'chapter') {
                                        setCurrentView('write');
                                        setEditingItemId(newActiveTab.chapterId || '');
                                    }
                                }
                            } else {
                                // 탭이 없으면 구조 뷰로 이동
                                setCurrentView('structure');
                                setActiveTabId('');
                            }
                        }
                        return remainingTabs.map({
                            "ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]": (tab)=>({
                                    ...tab,
                                    isActive: tab.id === (remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1]?.id || '' : '')
                                })
                        }["ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]"]);
                    }
                }["ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]"]);
                // 4. 데이터베이스에 저장
                await projectData.forceSave();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Chapter completely deleted', {
                    chapterId,
                    title,
                    removedFromStore: true,
                    removedFromChapters: true,
                    tabsClosed: true
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Complete chapter deletion failed', {
                    chapterId,
                    title,
                    error
                });
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleDeleteChapter]"], [
        projectData,
        projectId,
        activeTabId
    ]);
    // 🔥 자동 챕터 번호 생성 함수
    const getNextChapterTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle]": ()=>{
            const existingChapters = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().structures[projectId] || [];
            const chapterNumbers = existingChapters.filter({
                "ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle].chapterNumbers": (s)=>s.type === 'chapter'
            }["ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle].chapterNumbers"]).map({
                "ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle].chapterNumbers": (s)=>{
                    const match = s.title.match(/(\d+)장/);
                    return match && match[1] ? parseInt(match[1]) : 0;
                }
            }["ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle].chapterNumbers"]).filter({
                "ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle].chapterNumbers": (n)=>n > 0
            }["ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle].chapterNumbers"]);
            const nextChapterNumber = chapterNumbers.length > 0 ? Math.max(...chapterNumbers) + 1 : 1;
            return `${nextChapterNumber}장`;
        }
    }["ProjectEditor.ProjectEditor.useCallback[getNextChapterTitle]"], [
        projectId
    ]);
    // 🔥 탭바에서 새 챕터 생성 핸들러
    const handleNewTabFromTabBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleNewTabFromTabBar]": async ()=>{
            const newChapterId = `chapter-${Date.now()}`;
            const chapterTitle = getNextChapterTitle();
            // 1. chapters JSON에 새 챕터 추가
            const existingChapters = JSON.parse(projectData.chapters || '{}');
            existingChapters[newChapterId] = '';
            projectData.setChapters(JSON.stringify(existingChapters));
            // 2. 구조 데이터에도 챕터 정보 저장
            const newStructureItem = {
                id: newChapterId,
                title: chapterTitle,
                description: '',
                type: 'chapter',
                status: 'planning',
                projectId,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getState().addStructureItem(projectId, newStructureItem);
            await projectData.forceSave();
            // 3. 새 탭 생성
            createNewTab('chapter', chapterTitle, newChapterId);
            setCurrentView('write');
            setEditingItemId(newChapterId);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'New chapter created from tab bar', {
                chapterId: newChapterId,
                title: chapterTitle
            });
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleNewTabFromTabBar]"], [
        getNextChapterTitle,
        projectData,
        projectId,
        createNewTab
    ]);
    const handleAddCharacter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleAddCharacter]": ()=>{
            // 인물 뷰로 직접 이동 (탭 시스템 사용하지 않음)
            setCurrentView('characters');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Add character triggered - switched to characters view');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleAddCharacter]"], []);
    const handleAddNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleAddNote]": ()=>{
            // 노트 뷰로 직접 이동 (탭 시스템 사용하지 않음) 
            setCurrentView('notes');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Add note triggered - switched to notes view');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleAddNote]"], []);
    // 🔥 공유 기능 핸들러
    const handleShare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleShare]": ()=>{
            setShowShareDialog(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Share dialog opened');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleShare]"], []);
    // 🔥 삭제 기능 핸들러
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleDelete]": ()=>{
            setShowDeleteDialog(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Delete confirmation dialog opened');
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleDelete]"], []);
    // 🔥 삭제 확인 핸들러
    const handleConfirmDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleConfirmDelete]": async ()=>{
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Deleting project', {
                    projectId
                });
                const result = await window.electronAPI.projects.delete(projectId);
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Project deleted successfully');
                    setShowDeleteDialog(false);
                    // 🔥 삭제 후 대시보드로 이동
                    window.history.back();
                } else {
                    throw new Error(result.error || 'Failed to delete project');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Failed to delete project', error);
            // TODO: 에러 토스트 표시
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleConfirmDelete]"], [
        projectId
    ]);
    // 🔥 내보내기 기능 핸들러 (Markdown 파일로 내보내기)
    const handleDownload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleDownload]": async ()=>{
            try {
                const content = projectData.content || '';
                const title = projectData.title || '제목없음';
                // Markdown 파일로 내보내기
                const blob = new Blob([
                    content
                ], {
                    type: 'text/markdown;charset=utf-8'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title.replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Project exported as markdown', {
                    title
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_EDITOR', 'Export failed', error);
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleDownload]"], [
        projectData.content,
        projectData.title
    ]);
    // 🔥 뷰 변경 핸들러 (글쓰기만 탭 시스템 사용)
    const handleViewChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleViewChange]": (view)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'View changed:', view);
            if (view === 'write') {
                // 글쓰기 뷰는 탭 시스템 사용 - 메인 탭으로 전환
                const mainTab = tabs.find({
                    "ProjectEditor.ProjectEditor.useCallback[handleViewChange].mainTab": (tab)=>tab.type === 'main'
                }["ProjectEditor.ProjectEditor.useCallback[handleViewChange].mainTab"]);
                if (mainTab) {
                    switchToTab(mainTab.id);
                }
            } else {
                // 다른 뷰들(구조, 인물, 노트 등)은 직접 전환
                setCurrentView(view);
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleViewChange]"], [
        tabs,
        switchToTab
    ]);
    // 🔥 챕터 삭제 확인 핸들러
    const handleConfirmChapterDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleConfirmChapterDelete]": async ()=>{
            if (!chapterToDelete) return;
            await performTabClose(tabs.find({
                "ProjectEditor.ProjectEditor.useCallback[handleConfirmChapterDelete]": (tab)=>tab.chapterId === chapterToDelete.id
            }["ProjectEditor.ProjectEditor.useCallback[handleConfirmChapterDelete]"])?.id || '');
            setShowChapterDeleteDialog(false);
            setChapterToDelete(null);
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleConfirmChapterDelete]"], [
        chapterToDelete,
        tabs
    ]);
    // 🔥 챕터 삭제 취소 핸들러
    const handleCancelChapterDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleCancelChapterDelete]": ()=>{
            setShowChapterDeleteDialog(false);
            setChapterToDelete(null);
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleCancelChapterDelete]"], []);
    const handleToolbarAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleToolbarAction]": (action)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Toolbar action:', action)
    }["ProjectEditor.ProjectEditor.useCallback[handleToolbarAction]"], []);
    // 🔥 작가 친화적 키보드 단축키 핸들러
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProjectEditor.ProjectEditor.useCallback[handleKeyDown]": (event)=>{
            const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
            const modKey = ctrlKey || metaKey; // Windows: Ctrl, Mac: Cmd
            // 🔥 기본 저장 단축키 (Ctrl+S / Cmd+S)
            if (modKey && key === 's') {
                event.preventDefault();
                projectData.forceSave().then({
                    "ProjectEditor.ProjectEditor.useCallback[handleKeyDown]": ()=>{
                        handleSaveSuccess(); // 🔥 저장 완료 후 탭 상태 초기화
                    }
                }["ProjectEditor.ProjectEditor.useCallback[handleKeyDown]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Save shortcut triggered');
                return;
            }
            // 🔥 포커스 모드 토글 (Ctrl+F / Cmd+F)
            if (modKey && key === 'f') {
                event.preventDefault();
                uiState.toggleFocusMode();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Focus mode shortcut triggered');
                return;
            }
            // 🔥 사이드바 토글 (Ctrl+B / Cmd+B)
            if (modKey && key === 'b') {
                event.preventDefault();
                setCollapsed({
                    "ProjectEditor.ProjectEditor.useCallback[handleKeyDown]": (prev)=>!prev
                }["ProjectEditor.ProjectEditor.useCallback[handleKeyDown]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Sidebar shortcut triggered');
                return;
            }
            // 🔥 다크모드 토글 (Ctrl+D / Cmd+D)
            if (modKey && key === 'd') {
                event.preventDefault();
                uiState.toggleDarkMode();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Dark mode shortcut triggered');
                return;
            }
            // 🔥 ESC 키 우선순위 (QA 가이드: 다이얼로그 > 슬라이드바 > 집중모드 > 뒤로가기)
            if (key === 'Escape') {
                // 1순위: 다이얼로그가 열려있는 경우
                if (showDeleteDialog || showShareDialog) {
                    // 다이얼로그는 자체적으로 ESC 처리, 여기서는 무시
                    return;
                }
                // 2순위: 집중모드인 경우 집중모드 해제
                if (uiState.isFocusMode) {
                    event.preventDefault();
                    uiState.toggleFocusMode();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Focus mode disabled by ESC');
                    return;
                }
                // 3순위: 전역 ESC 이벤트 발생 (ProjectHeader에서 슬라이드바 처리)
                const escapeEvent = new CustomEvent('global:escape', {
                    detail: {
                        source: 'ProjectEditor'
                    }
                });
                window.dispatchEvent(escapeEvent);
                // 4순위: 마지막 수단으로 뒤로가기
                event.preventDefault();
                handleBack();
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Back shortcut triggered');
                return;
            }
            // 🔥 단축키 도움말 (F1)
            if (key === 'F1') {
                event.preventDefault();
                const helpEvent = new CustomEvent('shortcut:help');
                window.dispatchEvent(helpEvent);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Help shortcut triggered');
                return;
            }
        }
    }["ProjectEditor.ProjectEditor.useCallback[handleKeyDown]"], [
        projectData.forceSave,
        uiState.toggleFocusMode,
        uiState.toggleDarkMode,
        handleBack
    ]);
    // 🔥 키보드 이벤트 리스너 등록
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "ProjectEditor.ProjectEditor.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["ProjectEditor.ProjectEditor.useEffect"];
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        handleKeyDown
    ]);
    // 🔥 에디터 저장 이벤트 리스너 (Ctrl+S에서 발생)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectEditor.ProjectEditor.useEffect": ()=>{
            const handleProjectSave = {
                "ProjectEditor.ProjectEditor.useEffect.handleProjectSave": ()=>{
                    projectData.forceSave();
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].info('PROJECT_EDITOR', 'Project save triggered from editor');
                }
            }["ProjectEditor.ProjectEditor.useEffect.handleProjectSave"];
            window.addEventListener('project:save', handleProjectSave);
            return ({
                "ProjectEditor.ProjectEditor.useEffect": ()=>window.removeEventListener('project:save', handleProjectSave)
            })["ProjectEditor.ProjectEditor.useEffect"];
        }
    }["ProjectEditor.ProjectEditor.useEffect"], [
        projectData.forceSave
    ]);
    // 🔥 데이터 로딩 상태를 기준으로 로딩 화면 표시 (무한 로딩 문제 해결)
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center bg-white dark:bg-gray-900",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 1114,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-400",
                        children: "프로젝트를 불러오는 중..."
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 1115,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 1113,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
            lineNumber: 1112,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center text-red-500",
            children: [
                "오류: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
            lineNumber: 1122,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$EditorProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: WRITER_EDITOR_STYLES.container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ProjectHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectHeader"], {
                        title: projectData.title,
                        onTitleChange: projectData.setTitle,
                        onBack: handleBack,
                        sidebarCollapsed: collapsed,
                        onToggleSidebar: handleToggleSidebar,
                        showRightSidebar: showRightSidebar,
                        onToggleAISidebar: handleToggleAISidebar,
                        isFocusMode: uiState.isFocusMode,
                        onToggleFocusMode: uiState.toggleFocusMode,
                        onSave: projectData.forceSave,
                        onShare: handleShare,
                        onDownload: handleDownload,
                        onDelete: handleDelete,
                        // 🔥 Google Docs 관련 props 추가
                        isGoogleDocsProject: isGoogleDocsProject,
                        googleDocMeta: googleDocMeta,
                        isSyncingWithGoogle: isSyncingWithGoogle,
                        onSyncWithGoogle: syncWithGoogleDocs,
                        onOpenGoogleDocs: openGoogleDocsExternal
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 1129,
                        columnNumber: 9
                    }, this),
                    [
                        'write',
                        'structure'
                    ].includes(currentView) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$EditorTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditorTabBar"], {
                        tabs: tabs,
                        activeTabId: activeTabId,
                        onTabClick: switchToTab,
                        onTabClose: closeTab,
                        onNewTab: handleNewTabFromTabBar,
                        onTabReorder: handleTabReorder
                    }, void 0, false, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 1153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: WRITER_EDITOR_STYLES.main,
                        children: [
                            !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$WriterSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WriterSidebar"], {
                                projectId: projectId,
                                currentView: currentView,
                                onViewChange: handleViewChange,
                                structure: projectData.structure,
                                characters: projectData.characters,
                                stats: projectData.writerStats,
                                collapsed: false,
                                onAddStructure: handleAddStructure,
                                onAddCharacter: handleAddCharacter,
                                onAddNote: handleAddNote,
                                onEditStructure: handleNavigateToChapterEdit,
                                onDuplicateStructure: handleDuplicateChapter,
                                onDeleteStructure: handleDeleteChapter
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                lineNumber: 1167,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: WRITER_EDITOR_STYLES.editorContainer,
                                children: [
                                    currentView === 'write' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$WriteView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WriteView"], {
                                        content: getCurrentTabContent(),
                                        onChange: updateCurrentTabContent,
                                        isFocusMode: uiState.isFocusMode
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 1187,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'structure' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$StructureView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StructureView"], {
                                        projectId: projectId,
                                        onNavigateToChapterEdit: handleNavigateToChapterEdit,
                                        onNavigateToSynopsisEdit: handleNavigateToSynopsisEdit,
                                        onNavigateToIdeaEdit: handleNavigateToIdeaEdit,
                                        onAddNewChapter: ()=>setShowNewChapterModal(true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 1194,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'characters' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$CharactersView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CharactersView"], {
                                        projectId: projectId,
                                        characters: projectData.characters,
                                        onCharactersChange: projectData.setCharacters
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 1203,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'notes' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$NotesView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotesView"], {
                                        projectId: projectId,
                                        notes: projectData.notes || [],
                                        onNotesChange: projectData.setNotes
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 1210,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'synopsis' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$SynopsisView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SynopsisView"], {
                                        synopsisId: editingItemId,
                                        onBack: handleBackToStructure
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 1217,
                                        columnNumber: 15
                                    }, this),
                                    currentView === 'idea' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$views$2f$IdeaView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IdeaView"], {
                                        ideaId: editingItemId,
                                        onBack: handleBackToStructure
                                    }, void 0, false, {
                                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                        lineNumber: 1223,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                lineNumber: 1185,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$WriterStatsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WriterStatsPanel"], {
                                showRightSidebar: showRightSidebar,
                                toggleRightSidebar: handleToggleAISidebar,
                                writerStats: projectData.writerStats,
                                setWordGoal: projectData.setWordGoal,
                                currentText: projectData.content,
                                projectId: projectId
                            }, void 0, false, {
                                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                                lineNumber: 1231,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                        lineNumber: 1164,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 1127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$editor$2f$ShortcutHelp$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShortcutHelp"], {}, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 1243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDeleteDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDeleteDialog"], {
                isOpen: showDeleteDialog,
                projectTitle: projectData.title,
                onConfirm: handleConfirmDelete,
                onCancel: ()=>setShowDeleteDialog(false)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 1246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ShareDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShareDialog"], {
                isOpen: showShareDialog,
                projectTitle: projectData.title,
                projectId: projectId,
                onClose: ()=>setShowShareDialog(false)
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 1254,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$NewChapterModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NewChapterModal"], {
                isOpen: showNewChapterModal,
                onClose: ()=>setShowNewChapterModal(false),
                onConfirm: handleCreateNewChapter,
                defaultTitle: "새로운 챕터"
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 1262,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                isOpen: showChapterDeleteDialog,
                title: "챕터 삭제",
                message: "이 챕터를 삭제하시겠습니까?",
                itemName: chapterToDelete?.title,
                warning: "삭제된 챕터는 복구할 수 없습니다.",
                confirmText: "삭제",
                cancelText: "취소",
                onConfirm: handleConfirmChapterDelete,
                onCancel: handleCancelChapterDelete
            }, void 0, false, {
                fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
                lineNumber: 1270,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/renderer/components/projects/ProjectEditor.tsx",
        lineNumber: 1126,
        columnNumber: 5
    }, this);
}, "Roptyx4oCoxs/tr+OXi+SEVxQHA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
})), "Roptyx4oCoxs/tr+OXi+SEVxQHA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useProjectData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$hooks$2f$useUIState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$stores$2f$useStructureStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c1 = ProjectEditor;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProjectEditor$memo");
__turbopack_context__.k.register(_c1, "ProjectEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/ErrorBoundary.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ProjectErrorBoundary": (()=>ProjectErrorBoundary)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/logger.ts [app-client] (ecmascript)");
'use client';
;
;
;
class ProjectErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].error('PROJECT_ERROR_BOUNDARY', 'Client-side exception caught', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        // 🔥 DOM 관련 에러인지 확인
        if (error.message.includes('insertBefore') || error.message.includes('Node')) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].warn('PROJECT_ERROR_BOUNDARY', 'DOM manipulation error detected', {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-screen flex items-center justify-center bg-white dark:bg-gray-900",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md text-center p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-6xl mb-4",
                            children: "😵"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-red-600 mb-4",
                            children: "앗! 오류가 발생했습니다"
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 62,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400 mb-6",
                            children: "클라이언트에서 예외가 발생했습니다. 페이지를 새로고침하거나 다시 시도해보세요."
                        }, void 0, false, {
                            fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this),
                        ("TURBOPACK compile-time value", "development") === 'development' && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "text-left text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "cursor-pointer font-medium",
                                    children: "기술적 세부사항"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 69,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleReset,
                                    className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",
                                    children: "다시 시도"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.location.reload(),
                                    className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
                                    children: "페이지 새로고침"
                                }, void 0, false, {
                                    fileName: "[project]/src/renderer/components/projects/ErrorBoundary.tsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_renderer_components_projects_7306776b._.js.map