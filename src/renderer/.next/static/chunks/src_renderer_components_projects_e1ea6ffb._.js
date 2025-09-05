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
"[project]/src/renderer/components/projects/ProjectEditor.tsx [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 🔥 Re-exported Modularized ProjectEditor
// 기존 1284줄 파일을 새로운 모듈화된 구조로 완전 교체
// 원본 기능은 modules/projectEditor에서 모듈화되어 제공됨
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-client] (ecmascript)");
'use client';
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/renderer/components/projects/ProjectEditor.tsx [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$modules$2f$projectEditor$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/modules/projectEditor/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$renderer$2f$components$2f$projects$2f$ProjectEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/renderer/components/projects/ProjectEditor.tsx [app-client] (ecmascript) <locals>");
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

//# sourceMappingURL=src_renderer_components_projects_e1ea6ffb._.js.map