// 🔥 Modularized ProjectEditor - 모듈화된 새로운 프로젝트 에디터
// 기존 1284줄 → 약 200줄로 축소, 단일 책임 원칙 준수

'use client';

import React, { memo, useEffect, useCallback, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { MarkdownEditor } from '../../editor/MarkdownEditor';
import { EditorProvider } from '../../editor/EditorProvider';
import { ShortcutHelp } from '../../editor/ShortcutHelp';
import { WriterSidebar } from '../../components/WriterSidebar';
import { ProjectSidebar } from '../../components/ProjectSidebar';
import { WriterStatsPanel } from '../../editor/WriterStatsPanel';
import { ProjectHeader } from '../../components/ProjectHeader';
import { EditorTabBar } from '../../components/EditorTabBar';
import { NewChapterModal } from '../../components/NewChapterModal';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ShareDialog } from '../../components/ShareDialog';
import { WriteView } from '../../views/write';
import { StructureView } from '../../views/StructureView';
import { CharactersView } from '../../views/CharactersView';
import { NotesView } from '../../views/notes';
import { SynopsisView } from '../../views/synopsis';
import { GeminiSynopsisAgent } from '../../views/synopsis/AI/GeminiSynopsisAgent';
import { IdeaView } from '../../views/idea';
import { EmptyEditorState } from './components/EmptyEditorState';
import { RendererLogger as Logger } from '../../../../../shared/logger-renderer';
import { ProjectStructure } from '../../../../../shared/types';
import { useStructureStore } from '../../../../stores/useStructureStore';
import { EditorTab } from '../../../../../shared/editor';

// 🔥 Symbol 기반 컴포넌트 이름
const PROJECT_EDITOR = Symbol.for('PROJECT_EDITOR');

// 🔥 모듈화된 hooks 및 services
import { useProjectData } from '../../hooks/useProjectData';
import { useUIState } from '../../hooks/useUIState';
import { useProjectEditorState } from './hooks/useProjectEditorState';
import { projectEditorStateService } from './services/ProjectEditorStateService';
import { useSettings } from '../../../../app/settings/hooks/useSettings';
import ProjectEditorLayout from './components/ProjectEditorLayout';

export interface ProjectEditorProps {
    projectId: string;
}

type ProjectEditorView = 'write' | 'synopsis' | 'characters' | 'structure' | 'notes' | 'idea';
const PROJECT_EDITOR_VIEWS: readonly ProjectEditorView[] = ['write', 'synopsis', 'characters', 'structure', 'notes', 'idea'] as const;

// 🔥 React.memo로 무한 리렌더링 방지
export const ProjectEditor = memo(function ProjectEditor({
    projectId
}: ProjectEditorProps): React.ReactElement {
    Logger.info(PROJECT_EDITOR, 'ProjectEditor render started', { projectId });

    // 🔥 모듈화된 상태 관리
    const { isLoading, error, ...projectData } = useProjectData(projectId);
    const uiState = useUIState();
    const { state, actions } = useProjectEditorState();
    // structure store actions
    const addStructureItem = useStructureStore((s) => s.addStructureItem);
    const updateStructureItem = useStructureStore((s) => s.updateStructureItem);
    const setCurrentEditor = useStructureStore((s) => s.setCurrentEditor);
    const loadStructuresFromDB = useStructureStore((s) => s.loadStructuresFromDB); // 🔥 새로 추가
    const { settings, updateSetting } = useSettings();

    // 🔥 캐시 로드 및 상태 초기화 (projectId 변경 시)
    useEffect(() => {
        if (projectId) {
            Logger.debug(PROJECT_EDITOR, 'Loading project - loading cache from storage', { projectId });
            
            // localStorage에서 캐시 복구
            const cachedMetadata = projectEditorStateService.loadCacheFromStorage(projectId);
            if (Object.keys(cachedMetadata).length > 0) {
                Logger.debug(PROJECT_EDITOR, 'Cache loaded from storage', {
                    projectId,
                    cacheSize: Object.keys(cachedMetadata).length,
                    cache: cachedMetadata
                });
                
                // 상태에 캐시 업데이트 - state 변경을 통해 리렌더링 트리거
                // 주의: 직접 setState가 필요한데, actions에 메서드가 없음
                // 임시 방법: state.tabMetadataCache가 비어있으면 캐시 설정
                if (Object.keys(state.tabMetadataCache).length === 0) {
                    // 캐시 상태 복구를 위해 액션 필요 - 아래서 처리
                }
            }
        }
    }, [projectId]);

    // 🔥 캐시 변경 시 localStorage에 자동 저장
    useEffect(() => {
        if (projectId && Object.keys(state.tabMetadataCache).length > 0) {
            projectEditorStateService.saveCacheToStorage(projectId, state.tabMetadataCache);
        }
    }, [projectId, state.tabMetadataCache]);

    // 🔥 Phase 0: 프로젝트 진입 시 최근 장 자동 오픈
    useEffect(() => {
        if (projectId && state.tabs.length === 0) {
            // tabHistory에서 가장 최근의 chapter 찾기
            const recentChapterId = state.tabHistory.find(tabId => 
                tabId.startsWith('chapter-')
            );

            if (recentChapterId) {
                // 최근 장이 있으면 자동으로 탭 추가
                const structureId = recentChapterId.replace('chapter-', '');
                const structures = useStructureStore.getState().structures[projectId] || [];
                const chapter = structures.find(s => s.id === structureId);

                if (chapter) {
                    actions.addTab({
                        id: recentChapterId,
                        title: chapter.title,
                        type: 'chapter',
                        chapterId: chapter.id,  // 🔥 CRITICAL: chapterId 반드시 저장
                        isActive: true,
                        content: chapter.content || ''
                    });
                    actions.setCurrentView('write');
                    Logger.info(PROJECT_EDITOR, 'Auto-opened recent chapter', { 
                        chapterId: chapter.id, 
                        title: chapter.title 
                    });
                }
            }
        }
    }, [projectId, state.tabs.length, state.tabHistory, actions]);

    // 🔥 NewChapterModal 상태 디버깅
    useEffect(() => {
        Logger.debug(PROJECT_EDITOR, 'NewChapterModal state changed', { 
            showNewChapterModal: state.showNewChapterModal 
        });
    }, [state.showNewChapterModal]);

    // NOTE: error/loading rendering handled later after hooks are declared

    // 🔥 사이드바 관련 상태 (집중모드 제거, 사이드바 접기로 통합)
    const isZenMode = settings?.ui?.zenMode ?? false;
    const sidebarCollapsed = settings?.ui?.sidebarCollapsed ?? false;
    const appSidebarCollapsed = settings?.ui?.appSidebarCollapsed ?? false;

    // 🔥 tabBar hover 상태
    const [tabBarHovered, setTabBarHovered] = useState(false);

    // 🔥 ProjectSidebar hover 상태
    const [sidebarHovered, setSidebarHovered] = useState(false);

    // 🔥 ProjectHeader hover 상태
    const [headerHovered, setHeaderHovered] = useState(false);

    // 🔥 에디터 인스턴스 상태
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

    // 🔥 사이드바 상태 단순화 - 메인 토글만 사용
    const isSidebarCollapsed = state.collapsed;

    // 🔥 디버깅: 사이드바 상태 확인 
    Logger.debug(PROJECT_EDITOR, 'Sidebar States', {
        isSidebarCollapsed: isSidebarCollapsed,
        mainCollapsed: state.collapsed,
        settingsCollapsed: sidebarCollapsed,
        appCollapsed: appSidebarCollapsed
    });    // 🔥 저장 성공 처리
    const handleSaveSuccess = () => {
        actions.markAllTabsAsSaved();
        Logger.info(PROJECT_EDITOR, 'All tabs marked as saved');
    };

    // 🔥 actions 안정적 참조를 위한 ref
    const actionsRef = useRef(actions);
    actionsRef.current = actions;

    // 🔥 저장 상태 감시하여 탭 상태 업데이트 - 중복 실행 방지
    const saveStatusRef = useRef<string>('');
    useEffect(() => {
        if (projectData.saveStatus === 'saved' && saveStatusRef.current !== 'saved') {
            saveStatusRef.current = 'saved';
            actionsRef.current.markAllTabsAsSaved();
            Logger.debug(PROJECT_EDITOR, 'Auto save completed - tabs updated');
        } else if (projectData.saveStatus !== 'saved') {
            saveStatusRef.current = projectData.saveStatus;
        }
    }, [projectData.saveStatus]);

    // 🔥 Zen mode 토글 함수들
    const toggleSidebar = useCallback(() => {
        updateSetting('ui', 'sidebarCollapsed', !sidebarCollapsed);
        Logger.info('PROJECT_EDITOR', 'Sidebar toggled', { collapsed: !sidebarCollapsed });
    }, [updateSetting, sidebarCollapsed]);

    // 🔥 수동 저장 함수 (Cmd+S / Ctrl+S)
    const handleManualSave = useCallback(async () => {
        if (projectData?.forceSave) {
            Logger.info('PROJECT_EDITOR', 'Manual save triggered');
            await projectData.forceSave();
        }
    }, [projectData]);

    // 🔥 키보드 단축키 처리 (Cmd+S / Ctrl+S)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Cmd+S (Mac) 또는 Ctrl+S (Windows/Linux)
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault(); // 브라우저 기본 저장 동작 방지
                handleManualSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleManualSave]);

    const enableZenMode = useCallback(() => {
        updateSetting('ui', 'zenMode', true);
        updateSetting('ui', 'sidebarCollapsed', true);
        updateSetting('ui', 'appSidebarCollapsed', true);
        updateSetting('ui', 'zenMode', true);
        Logger.info('PROJECT_EDITOR', 'Zen mode enabled');
    }, [updateSetting]);

    const disableZenMode = useCallback(() => {
        updateSetting('ui', 'zenMode', false);
        updateSetting('ui', 'sidebarCollapsed', false);
        updateSetting('ui', 'appSidebarCollapsed', false);
        updateSetting('ui', 'zenMode', false);
        Logger.info('PROJECT_EDITOR', 'Zen mode disabled');
    }, [updateSetting]);

    // 🔥 키보드 단축키 이벤트 리스너
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Alt + Ctrl + S: 사이드바 토글 (Zen 브라우저 스타일)
            if (event.altKey && event.ctrlKey && event.key === 's') {
                event.preventDefault();
                toggleSidebar();
                Logger.info('PROJECT_EDITOR', 'Sidebar toggled via keyboard shortcut');
                return;
            }

            // Alt + Ctrl + H: Zen mode 토글
            if (event.altKey && event.ctrlKey && event.key === 'h') {
                event.preventDefault();
                if (isZenMode) {
                    disableZenMode();
                } else {
                    enableZenMode();
                }
                Logger.info('PROJECT_EDITOR', 'Zen mode toggled via keyboard shortcut');
                return;
            }

            // Escape: Zen mode 해제
            if (event.key === 'Escape') {
                if (isZenMode) {
                    event.preventDefault();
                    disableZenMode();
                    Logger.info('PROJECT_EDITOR', 'Zen mode disabled via ESC');
                }
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZenMode, toggleSidebar, enableZenMode, disableZenMode]);

    // 🔥 Phase 0: main 탭 제거됨 - 더 이상 필요 없음

    // 🔥 Settings sidebar collapsed와 local state 동기화
    useEffect(() => {
        if (sidebarCollapsed !== state.collapsed) {
            if (sidebarCollapsed) {
                if (!state.collapsed) actions.toggleCollapsed();
            } else {
                if (state.collapsed) actions.toggleCollapsed();
            }
            Logger.debug('PROJECT_EDITOR', 'Sidebar state synced with settings', {
                settingsCollapsed: sidebarCollapsed,
                stateCollapsed: state.collapsed
            });
        }
    }, [sidebarCollapsed, state.collapsed, actions]);

    // 🔥 Chrome 스타일: 초기에는 메인 탭만 표시
    // 사용자가 사이드바에서 클릭할 때마다 해당 탭이 생성됨

    // 🎯 Phase 14-D: Performance optimization with useMemo
    // ✅ ALL hooks MUST be declared BEFORE conditional returns (React Hooks Rules)
    
    // Memoize characters and notes arrays to prevent unnecessary re-renders
    const memoizedCharacters = React.useMemo(
        () => projectData?.characters || [],
        [projectData?.characters]
    );
    
    const memoizedNotes = React.useMemo(
        () => projectData?.notes || [],
        [projectData?.notes]
    );

    // 🔥 로딩 상태 처리
    if (isLoading) {
        return (
            <ProjectEditorLayout.Container>
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-500 text-sm">프로젝트를 불러오는 중...</span>
                    </div>
                </div>
            </ProjectEditorLayout.Container>
        );
    }

    // 🔥 에러 상태 처리
    if (error) {
        return (
            <ProjectEditorLayout.Container>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">오류</h1>
                        <p className="text-slate-600">{error}</p>
                    </div>
                </div>
            </ProjectEditorLayout.Container>
        );
    }

    // 🔥 현재 활성 탭 찾기
    const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);

    // 🔥 뷰 렌더링 함수
    const renderCurrentView = () => {
        switch (state.currentView) {
            case 'write':
                return (
                    <EditorProvider>
                        <div className="flex flex-col h-full w-full">
                            {/* 에디터 - 전체 화면 활용 */}
                            <div className="flex-1 min-h-0 w-full overflow-hidden">
                                <MarkdownEditor
                                    content={activeTab?.content || ''}
                                    onChange={(content) => {
                                        Logger.debug(PROJECT_EDITOR, 'MarkdownEditor onChange', {
                                            activeTabId: activeTab?.id,
                                            activeTabType: activeTab?.type,
                                            contentLength: content.length,
                                            contentPreview: content.substring(0, 100) + '...'
                                        });

                                            if (activeTab) {
                                            // 탭 업데이트
                                            actions.updateTab(activeTab.id, {
                                                content,
                                                isDirty: true
                                            });

                                            // 🔥 모든 탭은 chapter 타입이므로 chapter 저장 로직만 필요
                                            if (activeTab.type === 'chapter') {
                                                // 챕터 탭: 해당 챕터 구조체에 저장
                                                Logger.debug(PROJECT_EDITOR, 'Saving to CHAPTER', { title: activeTab.title });

                                                // 탭 ID에서 구조체 ID 추출 (탭 ID 형식: 'chapter-{structureId}' 또는 구조체 ID 자체)
                                                const structureId = activeTab.id.startsWith('chapter-')
                                                    ? activeTab.id.replace('chapter-', '')
                                                    : activeTab.id;

                                                // 비동기 저장 (Promise로 처리, 에러는 로그로만)
                                                updateStructureItem(projectId, structureId, {
                                                    content: content
                                                }).then(() => {
                                                    Logger.info(PROJECT_EDITOR, 'Chapter saved successfully', { structureId });
                                                    // 🔥 저장 완료 후 isDirty 플래그 리셋
                                                    actions.updateTab(activeTab.id, { isDirty: false });
                                                }).catch((error) => {
                                                    Logger.error(PROJECT_EDITOR, 'Failed to save chapter', { error });
                                                });
                                            } else {
                                                // 기타 탭: 탭 자체에만 저장 (임시)
                                                Logger.debug(PROJECT_EDITOR, 'Saving to TAB only', { type: activeTab.type });
                                            }
                                        }
                                    }}
                                    isFocusMode={uiState?.isFocusMode || false}
                                    onEditorReady={(editor) => {
                                        setEditorInstance(editor);
                                        Logger.debug(PROJECT_EDITOR, 'Editor instance received', { hasEditor: !!editor });
                                    }}
                                />
                            </div>
                        </div>
                    </EditorProvider>
                );

            case 'structure':
                return (
                    <StructureView
                        projectId={projectId}
                        onNavigateToChapterEdit={(chapterId) => {
                            // 가능한 경우 스토어에서 챕터 제목을 찾아 사용
                            const all = useStructureStore.getState().structures[projectId] || [];
                            const chapter = all.find((s) => s.id === chapterId);
                            const title = chapter?.title || `챕터 ${chapterId}`;

                            const newTab = {
                                id: `chapter-${chapterId}`,
                                title,
                                type: 'chapter' as const,
                                isActive: true,
                                chapterId: chapterId,  // 🔥 CRITICAL: chapterId 반드시 저장
                                content: chapter?.content || ''  // 🔥 기존 content 사용
                            };
                            actions.addTab(newTab);
                            actions.setCurrentView('write');
                            Logger.info('PROJECT_EDITOR', 'Chapter tab opened', {
                                chapterId,
                                hasContent: !!chapter?.content,
                                contentLength: chapter?.content?.length || 0
                            });
                        }}
                        onAddNewChapter={() => {
                            actions.openNewChapterModal();
                            Logger.info('PROJECT_EDITOR', 'New chapter modal opened');
                        }}
                        onNavigateToIdeaEdit={(ideaId) => {
                            const all = useStructureStore.getState().structures[projectId] || [];
                            const idea = all.find((s) => s.id === ideaId);
                            setCurrentEditor({ projectId, editorType: 'idea', itemId: ideaId, itemTitle: idea?.title });
                            actions.setCurrentView('idea');
                            Logger.info('PROJECT_EDITOR', 'Idea view opened', { ideaId });
                        }}
                        onNavigateToSynopsisEdit={(synopsisId) => {
                            const all = useStructureStore.getState().structures[projectId] || [];
                            const syn = all.find((s) => s.id === synopsisId);
                            setCurrentEditor({ projectId, editorType: 'synopsis', itemId: synopsisId, itemTitle: syn?.title });
                            actions.setCurrentView('synopsis');
                            Logger.info('PROJECT_EDITOR', 'Synopsis view opened', { synopsisId });
                        }}
                        onNavigateToNotesView={() => {
                            actions.setCurrentView('notes');
                            Logger.info('PROJECT_EDITOR', 'Notes view opened from structure');
                        }}
                    />
                );

            case 'characters':
                return (
                    <CharactersView
                        projectId={projectId}
                        characters={memoizedCharacters}
                        onCharactersChange={(characters) => {
                            if (projectData?.setCharacters) {
                                projectData.setCharacters(characters);
                                Logger.info('PROJECT_EDITOR', 'Characters updated', { count: characters.length });
                            }
                        }}
                    />
                );

            case 'notes':
                return (
                    <NotesView
                        projectId={projectId}
                        notes={memoizedNotes}
                        onNotesChange={(notes) => {
                            if (projectData?.setNotes) {
                                projectData.setNotes(notes);
                                Logger.info('PROJECT_EDITOR', 'Notes updated', { count: notes.length });
                            }
                        }}
                        onBack={() => {
                            Logger.info('PROJECT_EDITOR', 'Notes view back - returning to structure view');
                            actions.setCurrentView('structure');
                        }}
                    />
                );

            case 'synopsis':
                return (
                    <SynopsisView
                        projectId={projectId}
                        elements={(projectData?.structure || []).map(item => ({
                            id: item.id,
                            type: item.type as 'main' | 'chapter' | 'character' | 'memo' | 'idea' | 'note' | 'synopsis',
                            title: item.title,
                            content: item.content || '',
                            createdAt: item.createdAt,
                            updatedAt: item.updatedAt,
                            order: item.sortOrder,
                            wordCount: item.wordCount,
                        }))}
                        characters={memoizedCharacters.map(char => ({
                            ...char,
                            color: char.color || '#3B82F6',
                            sortOrder: char.sortOrder ?? 0,
                            isActive: char.isActive ?? true
                        }))}
                        notes={memoizedNotes.map(note => ({
                            ...note,
                            type: note.type || 'general',
                            color: note.color || '#3B82F6',
                            isPinned: note.isPinned ?? false,
                            isArchived: note.isArchived ?? false,
                            sortOrder: note.sortOrder ?? 0
                        }))}
                        content={projectData?.content || ''}
                    />
                );

            case 'idea':
                return (
                    <IdeaView
                        ideaId={projectId}
                        onBack={() => {
                            Logger.info('PROJECT_EDITOR', 'Idea view back - returning to structure view');
                            actions.setCurrentView('structure');
                        }}
                    />
                ); default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">알 수 없는 뷰: {state.currentView}</p>
                    </div>
                );
        }
    };

    Logger.debug('PROJECT_EDITOR', 'Rendering with state', {
        currentView: state.currentView,
        activeTabId: state.activeTabId,
        tabsCount: state.tabs.length
    });

    const normalizedCurrentView = PROJECT_EDITOR_VIEWS.includes(state.currentView as ProjectEditorView)
        ? (state.currentView as ProjectEditorView)
        : 'write';

    const isWriteView = normalizedCurrentView === 'write';

    return (
        <ProjectEditorLayout.Container className="relative overflow-x-hidden">
            {/* 🔥 헤더 + 탭바를 하나의 스티키 영역으로 구성하여 안정적인 레이어링 확보 */}
            <div className="sticky top-0 z-[1200] flex flex-col bg-[color:hsl(var(--card))] transition-colors duration-200 shadow-[var(--shadow-sm,0_10px_20px_rgba(15,23,42,0.08))]">
                {/* 🔥 ProjectHeader - 글쓰기 탭일 때만 표시 (Chrome 스타일) */}
                {state.currentView === 'write' && (
                    <ProjectEditorLayout.Header className="relative z-[1500] min-h-[3.5rem] shadow-none">
                        <ProjectHeader
                            title={projectData?.title || '프로젝트'}
                            onTitleChange={(title) => {
                                projectData?.setTitle(title);
                                Logger.debug('PROJECT_EDITOR', 'Title changed', { title });
                            }}
                            onBack={() => {
                                Logger.debug('PROJECT_EDITOR', 'Back button clicked');
                                // /projects로 이동
                                if (typeof window !== 'undefined') {
                                    window.location.href = '/projects';
                                }
                            }}
                            editor={editorInstance}
                            sidebarCollapsed={isSidebarCollapsed}
                            onToggleSidebar={toggleSidebar}
                        />
                    </ProjectEditorLayout.Header>
                )}

                {/* 🔥 EditorTabBar - 헤더 바로 아래에 배치하여 상단에서 항상 노출 (Universal Tab System) */}
                <div className="relative overflow-hidden backdrop-blur-sm transition-all duration-200 border-b z-[1300] h-12 bg-[color:hsl(var(--muted))]/85 border-[color:hsl(var(--border))] opacity-100">
                    <EditorTabBar
                        tabs={state.tabs}
                        activeTabId={state.activeTabId}
                        currentView={normalizedCurrentView}
                        onTabClick={(tabId) => {
                            actions.setActiveTab(tabId);
                            
                            // 🔥 탭 타입에 따라 currentView 동기화
                            const tab = state.tabs.find(t => t.id === tabId);
                            if (tab) {
                                switch (tab.type) {
                                    case 'main':
                                    case 'chapter':
                                        actions.setCurrentView('write');
                                        break;
                                    case 'synopsis':
                                        actions.setCurrentView('synopsis');
                                        break;
                                    case 'characters':
                                        actions.setCurrentView('characters');
                                        break;
                                    case 'structure':
                                        actions.setCurrentView('structure');
                                        break;
                                    case 'notes':
                                        actions.setCurrentView('notes');
                                        break;
                                    case 'ideas':
                                        actions.setCurrentView('idea');
                                        break;
                                }
                                Logger.info('EDITOR_TAB_BAR', 'Tab clicked, view synced', { 
                                    tabId, 
                                    tabType: tab.type, 
                                    currentView: state.currentView 
                                });
                            }
                        }}
                        onTabClose={(tabId: string) => {
                            // 🔥 CRITICAL: removeTab 호출 후 즉시 localStorage 저장
                            actions.removeTab(tabId);
                            // setTimeout으로 state 업데이트 완료 후 저장
                            setTimeout(() => {
                                projectEditorStateService.saveCacheToStorage(projectId, state.tabMetadataCache);
                                Logger.debug(PROJECT_EDITOR, 'Cache saved immediately after removeTab', {
                                    projectId,
                                    cacheSize: Object.keys(state.tabMetadataCache).length
                                });
                            }, 0);
                        }}
                        onNewTab={() => {
                            const newTab = {
                                id: `tab-${Date.now()}`,
                                title: `새 탭 ${state.tabs.length}`,
                                type: 'chapter' as const,
                                isActive: true,
                                chapterId: `chapter_${Date.now()}`,  // 🔥 CRITICAL: chapterId 반드시 추가
                                content: ''
                            };
                            actions.addTab(newTab);
                        }}
                        onToggleAISidebar={actions.toggleRightSidebar}
                        isAISidebarOpen={state.showRightSidebar}
                    />
                </div>
            </div>

            {/* 🔥 메인 컨텐츠 영역 */}
            <ProjectEditorLayout.Main>
                {/* 🔥 ProjectSidebar hover 영역 - 완전 투명 */}
                {isSidebarCollapsed && (
                    <div
                        className="absolute left-0 top-0 w-8 h-full z-[100] opacity-0 cursor-pointer transition-all duration-200 hover:w-12"
                        onMouseEnter={() => {
                            setSidebarHovered(true);
                            Logger.debug('PROJECT_SIDEBAR', 'Hover activated');
                        }}
                        onMouseLeave={() => {
                            setSidebarHovered(false);
                            Logger.debug('PROJECT_SIDEBAR', 'Hover deactivated');
                        }}
                    >
                        {/* 완전 투명 hover 영역 */}
                    </div>
                )}

                {/* 🔥 ProjectSidebar 표시 - 헤더 아래 위치 조정 */}
                {sidebarHovered && isSidebarCollapsed && (
                    <div
                        className="absolute left-0 top-0 w-64 h-full z-[150] bg-[color:hsl(var(--card))]/95 backdrop-blur-lg border-r border-[color:hsl(var(--border))] shadow-[var(--shadow-xl,0_22px_46px_rgba(15,23,42,0.32))] transition-all duration-500 ease-in-out transform translate-x-0 pointer-events-auto animate-slide-in-left"
                        onMouseEnter={() => {
                            Logger.debug('PROJECT_SIDEBAR', 'Hover area entered');
                            setSidebarHovered(true);
                        }}
                        onMouseLeave={() => {
                            Logger.debug('PROJECT_SIDEBAR', 'Hover area left');
                            setSidebarHovered(false);
                        }}
                    >
                        <div className="h-full overflow-y-auto p-4 pointer-events-auto">
                            <ProjectSidebar
                                projectId={projectId}
                                currentView={state.currentView}
                                onViewChange={(view) => {
                                    // 🔥 Chrome 스타일: hover sidebar에서도 탭 생성/활성화
                                    actions.setCurrentView(view);
                                    
                                    let targetTabId: string | undefined;
                                    let tabTitle: string | undefined;
                                    let tabType: EditorTab['type'] | undefined;
                                    
                                    switch (view) {
                                        case 'write':
                                            // 🔥 Phase 0: 'main' 탭 제거 - write 뷰는 이미 열려있는 탭에서 처리
                                            // 탭이 없으면 EmptyEditorState 표시
                                            break;
                                        case 'synopsis':
                                            targetTabId = 'synopsis';
                                            tabTitle = '시놉시스';
                                            tabType = 'synopsis';
                                            break;
                                        case 'characters':
                                            targetTabId = 'characters';
                                            tabTitle = '인물';
                                            tabType = 'characters';
                                            break;
                                        case 'structure':
                                            targetTabId = 'structure';
                                            tabTitle = '구조';
                                            tabType = 'structure';
                                            break;
                                        case 'notes':
                                            targetTabId = 'notes';
                                            tabTitle = '노트';
                                            tabType = 'notes';
                                            break;
                                        case 'idea':
                                            targetTabId = 'ideas';
                                            tabTitle = '아이디어';
                                            tabType = 'ideas';
                                            break;
                                    }
                                    
                                    if (!targetTabId) return;
                                    
                                    const existingTab = state.tabs.find(t => t.id === targetTabId);
                                    if (existingTab) {
                                        actions.setActiveTab(targetTabId);
                                        Logger.info('PROJECT_SIDEBAR_HOVER', 'Existing tab activated', { 
                                            view, 
                                            targetTabId 
                                        });
                                    } else if (tabTitle && tabType) {
                                        actions.addTab({
                                            id: targetTabId,
                                            title: tabTitle,
                                            type: tabType,
                                            isActive: true,
                                            content: ''
                                        });
                                        Logger.info('PROJECT_SIDEBAR_HOVER', 'New tab created', { 
                                            view, 
                                            targetTabId,
                                            tabTitle 
                                        });
                                    }
                                }}
                                structure={projectData?.structure || []}
                                characters={memoizedCharacters}
                                collapsed={false}
                                stats={{
                                    wordCount: projectData?.writerStats?.wordCount || 0,
                                    charCount: projectData?.writerStats?.charCount || 0,
                                    paragraphCount: projectData?.writerStats?.paragraphCount || 0,
                                    readingTime: projectData?.writerStats?.readingTime || 0,
                                    wordGoal: projectData?.writerStats?.wordGoal || 1000,
                                    progress: projectData?.writerStats?.progress || 0,
                                    sessionTime: projectData?.writerStats?.sessionTime || 0,
                                    wpm: projectData?.writerStats?.wpm || 0
                                }}
                                onAddStructure={() => {
                                    actions.openNewChapterModal();
                                    Logger.info('PROJECT_EDITOR', 'Add structure clicked from hover sidebar');
                                }}
                                onAddCharacter={() => {
                                    actions.openNewCharacterModal();
                                    Logger.info('PROJECT_EDITOR', 'Add character clicked from hover sidebar');
                                }}
                                onAddNote={() => {
                                    actions.openNewNoteModal();
                                    Logger.info('PROJECT_EDITOR', 'Add note clicked from hover sidebar');
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* 🔥 일반 ProjectSidebar (사이드바 펼쳐져 있을 때) - absolute로 flow에서 제외 */}
                {!isSidebarCollapsed && (
                    <div className="absolute left-0 top-0 w-80 h-full z-[140] bg-[color:hsl(var(--card))] border-r border-[color:hsl(var(--border))] overflow-hidden shadow-sm">
                        <ProjectSidebar
                            projectId={projectId}
                            currentView={state.currentView}
                            onViewChange={(view) => {
                                // 🔥 Chrome 스타일: 탭이 없으면 생성, 있으면 활성화
                                actions.setCurrentView(view);
                                
                                // 뷰에 맞는 탭 ID와 정보 정의
                                let targetTabId: string | undefined;
                                let tabTitle: string | undefined;
                                let tabType: EditorTab['type'] | undefined;
                                
                                switch (view) {
                                    case 'write':
                                        // 🔥 Phase 0: 'main' 탭 제거 - write 뷰는 이미 열려있는 탭에서 처리
                                        // 탭이 없으면 EmptyEditorState 표시
                                        break;
                                    case 'synopsis':
                                        targetTabId = 'synopsis';
                                        tabTitle = '시놉시스';
                                        tabType = 'synopsis';
                                        break;
                                    case 'characters':
                                        targetTabId = 'characters';
                                        tabTitle = '인물';
                                        tabType = 'characters';
                                        break;
                                    case 'structure':
                                        targetTabId = 'structure';
                                        tabTitle = '구조';
                                        tabType = 'structure';
                                        break;
                                    case 'notes':
                                        targetTabId = 'notes';
                                        tabTitle = '노트';
                                        tabType = 'notes';
                                        break;
                                    case 'idea':
                                        targetTabId = 'ideas';
                                        tabTitle = '아이디어';
                                        tabType = 'ideas';
                                        break;
                                }
                                
                                if (!targetTabId) return;
                                
                                // 탭이 이미 존재하면 활성화
                                const existingTab = state.tabs.find(t => t.id === targetTabId);
                                if (existingTab) {
                                    actions.setActiveTab(targetTabId);
                                    Logger.info('PROJECT_SIDEBAR', 'Existing tab activated', { 
                                        view, 
                                        targetTabId 
                                    });
                                } 
                                // 탭이 없으면 새로 생성
                                else if (tabTitle && tabType) {
                                    actions.addTab({
                                        id: targetTabId,
                                        title: tabTitle,
                                        type: tabType,
                                        isActive: true,
                                        content: ''
                                    });
                                    Logger.info('PROJECT_SIDEBAR', 'New tab created', { 
                                        view, 
                                        targetTabId,
                                        tabTitle 
                                    });
                                }
                            }}
                            structure={projectData?.structure || []}
                            characters={memoizedCharacters}
                            collapsed={false}
                            stats={{
                                wordCount: projectData?.writerStats?.wordCount || 0,
                                charCount: projectData?.writerStats?.charCount || 0,
                                paragraphCount: projectData?.writerStats?.paragraphCount || 0,
                                readingTime: projectData?.writerStats?.readingTime || 0,
                                wordGoal: projectData?.writerStats?.wordGoal || 1000,
                                progress: projectData?.writerStats?.progress || 0,
                                sessionTime: projectData?.writerStats?.sessionTime || 0,
                                wpm: projectData?.writerStats?.wpm || 0
                            }}
                            onAddStructure={() => {
                                actions.openNewChapterModal();
                                Logger.info('PROJECT_EDITOR', 'Add structure clicked');
                            }}
                            onAddCharacter={() => {
                                actions.openNewCharacterModal();
                                Logger.info('PROJECT_EDITOR', 'Add character clicked');
                            }}
                            onAddNote={() => {
                                actions.openNewNoteModal();
                                Logger.info('PROJECT_EDITOR', 'Add note clicked');
                            }}
                        />
                    </div>
                )}

                {/* 🔥 메인 에디터 + 우측바를 flex row로 구성하여 스크롤바 제거 */}
                <div className="flex flex-row flex-1 min-w-0 h-full overflow-hidden">
                    {/* 🔥 Empty State: 모든 탭이 닫혀있는 경우 */}
                    {state.tabs.length === 0 ? (
                        <div className="flex-1 min-w-0 overflow-hidden">
                            {(() => {
                                // 🔥 1단계: 현재 state의 캐시 사용
                                let cachedTabIds = Object.keys(state.tabMetadataCache);
                                
                                // 🔥 2단계: 캐시가 비어있으면 localStorage에서 직접 로드
                                if (cachedTabIds.length === 0) {
                                    const storageCached = projectEditorStateService.loadCacheFromStorage(projectId);
                                    cachedTabIds = Object.keys(storageCached);
                                    const firstKey = Object.keys(storageCached)[0];
                                    Logger.info('PROJECT_EDITOR_DETAIL', '🔍 localStorage 로드 시작', {
                                        projectId,
                                        storageCachedKeys: Object.keys(storageCached),
                                        storageCachedSize: Object.keys(storageCached).length,
                                        sample: firstKey ? storageCached[firstKey] : 'none'
                                    });
                                    Logger.debug(PROJECT_EDITOR, 'Loaded cache from localStorage', {
                                        projectId,
                                        loaded: cachedTabIds.length > 0,
                                        cache: storageCached
                                    });
                                    
                                    // 캐시를 상태에 설정하려면 별도 액션이 필요
                                    // 임시: 직접 캐시 사용
                                    if (cachedTabIds.length > 0) {
                                        const mostRecentTabId = cachedTabIds.reduce((latest, current) => {
                                            const latestMeta = storageCached[latest];
                                            const currentMeta = storageCached[current];
                                            if (!latestMeta || !currentMeta) return latest;
                                            return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
                                        });
                                        
                                        const lastChapterMetadata = storageCached[mostRecentTabId];
                                        
                                        Logger.info('EMPTY_STATE_RENDER_STORAGE', 'Storage cache loaded', {
                                            mostRecentTabId,
                                            fullMetadata: JSON.stringify(lastChapterMetadata),
                                            keys: Object.keys(lastChapterMetadata || {}),
                                            chapterId_exists: !!lastChapterMetadata?.chapterId,
                                            chapterId_value: lastChapterMetadata?.chapterId,
                                            full_storageCached: JSON.stringify(storageCached)
                                        });
                                        
                                        return (
                                            <EmptyEditorState
                                                onCreateChapter={() => actions.openNewChapterModal()}
                                                onGoToLastChapter={() => {
                                                    Logger.info(PROJECT_EDITOR, 'Opening last chapter from storage', {
                                                        tabId: mostRecentTabId,
                                                        metadata: lastChapterMetadata,
                                                        chapterId_debug: lastChapterMetadata?.chapterId
                                                    });
                                                    
                                                    Logger.debug(PROJECT_EDITOR, 'Checking chapterId', {
                                                        hasChapterId: !!lastChapterMetadata?.chapterId,
                                                        chapterId: lastChapterMetadata?.chapterId,
                                                        metadata: lastChapterMetadata,
                                                        metadataKeys: Object.keys(lastChapterMetadata || {})
                                                    });
                                                    
                                                    if (lastChapterMetadata?.chapterId) {
                                                        // chapterId로 탭 재생성
                                                        const structures = useStructureStore.getState().structures[projectId] || [];
                                                        Logger.debug(PROJECT_EDITOR, 'Loaded structures', {
                                                            projectId,
                                                            structureCount: structures.length,
                                                            searchingFor: lastChapterMetadata.chapterId
                                                        });
                                                        
                                                        const chapter = structures.find(s => s.id === lastChapterMetadata.chapterId);
                                                        Logger.debug(PROJECT_EDITOR, 'Chapter search result', {
                                                            found: !!chapter,
                                                            chapterId: chapter?.id,
                                                            title: chapter?.title
                                                        });
                                                        
                                                        if (chapter?.id) {
                                                            Logger.debug(PROJECT_EDITOR, 'Adding tab from structures', {
                                                                tabId: `chapter-${chapter.id}`,
                                                                title: chapter.title
                                                            });
                                                            actions.addTab({
                                                                id: `chapter-${chapter.id}`,
                                                                title: chapter.title || lastChapterMetadata.title,
                                                                type: 'chapter',
                                                                chapterId: chapter.id,
                                                                isActive: true
                                                            });
                                                            actions.setCurrentView('write');
                                                        } else {
                                                            // 구조 데이터가 없으면 탭만 추가
                                                            Logger.warn('PROJECT_EDITOR', 'Chapter not found in structures, using cached data');
                                                            Logger.debug('PROJECT_EDITOR', 'Adding tab from cache', {
                                                                tabId: mostRecentTabId,
                                                                title: lastChapterMetadata.title,
                                                                chapterId: lastChapterMetadata.chapterId
                                                            });
                                                            actions.addTab({
                                                                id: mostRecentTabId,
                                                                title: lastChapterMetadata.title,
                                                                type: 'chapter',
                                                                chapterId: lastChapterMetadata.chapterId,
                                                                isActive: true
                                                            });
                                                            actions.setCurrentView('write');
                                                        }
                                                    } else {
                                                        Logger.warn('PROJECT_EDITOR', 'No chapterId in metadata');
                                                    }
                                                }}
                                                hasLastChapter={!!lastChapterMetadata}
                                                lastChapterTitle={lastChapterMetadata?.title || ''}
                                            />
                                        );
                                    }
                                }
                                
                                // 3단계: state 캐시 사용
                                const cachedMostRecentId = cachedTabIds.length > 0
                                    ? cachedTabIds.reduce((latest, current) => {
                                        const latestMeta = state.tabMetadataCache[latest];
                                        const currentMeta = state.tabMetadataCache[current];
                                        if (!latestMeta || !currentMeta) return latest;
                                        return currentMeta.lastAccessedAt > latestMeta.lastAccessedAt ? current : latest;
                                    })
                                    : null;
                                
                                const lastChapterMetadata = cachedMostRecentId ? state.tabMetadataCache[cachedMostRecentId] : null;
                                
                                return (
                                    <EmptyEditorState
                                        onCreateChapter={() => actions.openNewChapterModal()}
                                        onGoToLastChapter={() => {
                                            Logger.info(PROJECT_EDITOR, 'Opening last chapter from state cache', {
                                                tabId: cachedMostRecentId,
                                                metadata: lastChapterMetadata
                                            });
                                            
                                            if (cachedMostRecentId && lastChapterMetadata?.chapterId) {
                                                const structures = useStructureStore.getState().structures[projectId] || [];
                                                const chapter = structures.find(s => s.id === lastChapterMetadata.chapterId);
                                                
                                                if (chapter?.id) {
                                                    actions.addTab({
                                                        id: `chapter-${chapter.id}`,
                                                        title: chapter.title || lastChapterMetadata.title,
                                                        type: 'chapter',
                                                        chapterId: chapter.id,
                                                        isActive: true
                                                    });
                                                    actions.setCurrentView('write');
                                                }
                                            }
                                        }}
                                        hasLastChapter={!!lastChapterMetadata}
                                        lastChapterTitle={lastChapterMetadata?.title || ''}
                                    />
                                );
                            })()}
                        </div>
                    ) : (
                        <>
                            {/* 각 뷰의 메인 컨텐츠 */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                                {renderCurrentView()}
                            </div>

                            {/* 오른쪽 사이드바 (AI 패널) - fixed width, shrink 안 함 */}
                            {state.showRightSidebar && (
                                <div className="w-80 flex-shrink-0 overflow-hidden h-full border-l border-[color:hsl(var(--border))]">
                                    {normalizedCurrentView === 'synopsis' ? (
                                        <GeminiSynopsisAgent
                                            projectId={projectId}
                                            onClose={actions.toggleRightSidebar}
                                        />
                                    ) : (
                                        <WriterStatsPanel
                                            showRightSidebar={state.showRightSidebar}
                                            toggleRightSidebar={actions.toggleRightSidebar}
                                            writerStats={projectData?.writerStats || {
                                                wordCount: 0,
                                                charCount: 0,
                                                paragraphCount: 0,
                                                readingTime: 0,
                                                wordGoal: 1000,
                                                progress: 0,
                                                sessionTime: 0,
                                                wpm: 0,
                                                headingCount: 0,
                                                listItemCount: 0
                                            }}
                                            setWordGoal={(goal) => {
                                                projectData?.setWordGoal(goal);
                                            }}
                                            currentText={activeTab?.content || ''}
                                            projectId={projectId}
                                        />
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </ProjectEditorLayout.Main>

            {/* 모달들 */}
            {state.showDeleteDialog && (
                <ConfirmDeleteDialog
                    isOpen={state.showDeleteDialog}
                    projectTitle={projectData?.title || '프로젝트'}
                    onConfirm={() => {
                        // TODO: 프로젝트 삭제 로직
                        actions.closeDeleteDialog();
                    }}
                    onCancel={actions.closeDeleteDialog}
                />
            )}

            {state.showShareDialog && (
                <ShareDialog
                    isOpen={state.showShareDialog}
                    onClose={actions.closeShareDialog}
                    projectId={projectId}
                    projectTitle={projectData?.title || '프로젝트'}
                />
            )}

            {state.showNewChapterModal && (
                <>
                    <NewChapterModal
                        isOpen={state.showNewChapterModal}
                        onClose={actions.closeNewChapterModal}
                        onConfirm={async (title: string) => {
                            // 새 챕터 생성 로직
                            const safeTitle = (title && title.trim()) || `새 챕터 ${Date.now()}`;

                            const newItem: ProjectStructure = {
                                id: `chapter_${Date.now()}`,
                                title: safeTitle,
                                description: '',
                                type: 'chapter',
                                status: 'draft',
                                wordCount: 0,
                                sortOrder: 0,
                                depth: 0,
                                color: '#6b7280',
                                isActive: true,
                                projectId,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            };

                            try {
                                await addStructureItem(projectId, newItem);

                                // 에디터 상태로 전환
                                setCurrentEditor({ projectId, editorType: 'chapter', itemId: newItem.id, itemTitle: newItem.title });

                                // 새 탭으로 챕터 열기
                                const newTab = {
                                    id: `chapter-${newItem.id}`,
                                    title: newItem.title,
                                    type: 'chapter' as const,
                                    isActive: true,
                                    chapterId: newItem.id,  // 🔥 CRITICAL: chapterId 반드시 저장
                                    content: ''
                                };
                                actions.addTab(newTab);
                                actions.setActiveTab(newTab.id);

                                Logger.info('PROJECT_EDITOR', 'New chapter created', { id: newItem.id, title: newItem.title });
                            } catch (error) {
                                Logger.error('PROJECT_EDITOR', 'Failed to create new chapter', { error });
                            } finally {
                                actions.closeNewChapterModal();
                            }
                        }}
                    />
                </>
            )}

            {/* TODO: NewCharacterModal과 NewNoteModal 컴포넌트 생성 필요 */}
            {/* 임시로 NewChapterModal을 재사용하여 기능 테스트 */}
            {state.showNewCharacterModal && (
                <NewChapterModal
                    isOpen={state.showNewCharacterModal}
                    onClose={actions.closeNewCharacterModal}
                    onConfirm={(title: string) => {
                        // TODO: 새 캐릭터 생성 로직
                        actions.closeNewCharacterModal();
                    }}
                />
            )}

            {state.showNewNoteModal && (
                <NewChapterModal
                    isOpen={state.showNewNoteModal}
                    onClose={actions.closeNewNoteModal}
                    onConfirm={(title: string) => {
                        // TODO: 새 노트 생성 로직
                        actions.closeNewNoteModal();
                    }}
                />
            )}

            {/* 🔥 단축키 도움말 - 글쓰기 에디터에서만 표시 */}
            <ShortcutHelp isEditorView={state.currentView === 'write'} />
        </ProjectEditorLayout.Container>
    );
});

export default ProjectEditor;
