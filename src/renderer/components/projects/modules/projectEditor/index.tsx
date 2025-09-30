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
import { IdeaView } from '../../views/idea';
import { Logger } from '../../../../../shared/logger';
import { ProjectStructure } from '../../../../../shared/types';
import { useStructureStore } from '../../../../stores/useStructureStore';

// 🔥 모듈화된 hooks 및 services
import { useProjectData } from '../../hooks/useProjectData';
import { useUIState } from '../../hooks/useUIState';
import { useProjectEditorState } from './hooks/useProjectEditorState';
import { useSettings } from '../../../../app/settings/hooks/useSettings';
import ProjectEditorLayout from './components/ProjectEditorLayout';

export interface ProjectEditorProps {
    projectId: string;
}

// 🔥 React.memo로 무한 리렌더링 방지
export const ProjectEditor = memo(function ProjectEditor({
    projectId
}: ProjectEditorProps): React.ReactElement {
    Logger.info('PROJECT_EDITOR', 'ProjectEditor render started', { projectId });

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

    // 🔥 프로젝트 변경 시 DB에서 구조 데이터 로드
    useEffect(() => {
        if (projectId) {
            console.log('🔄 [ProjectEditor] Loading structures from DB for project:', projectId);
            loadStructuresFromDB(projectId).catch(error => {
                console.error('❌ [ProjectEditor] Failed to load structures from DB:', error);
                Logger.error('PROJECT_EDITOR', 'Failed to load structures from DB', { projectId, error });
            });
        }
    }, [projectId, loadStructuresFromDB]);

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
    Logger.debug('PROJECT_EDITOR', 'Sidebar States', {
        isSidebarCollapsed: isSidebarCollapsed,
        mainCollapsed: state.collapsed,
        settingsCollapsed: sidebarCollapsed,
        appCollapsed: appSidebarCollapsed
    });    // 🔥 저장 성공 처리
    const handleSaveSuccess = () => {
        actions.markAllTabsAsSaved();
        Logger.info('PROJECT_EDITOR', 'All tabs marked as saved');
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
            Logger.debug('PROJECT_EDITOR', 'Auto save completed - tabs updated');
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

    // 🔥 프로젝트 데이터 로드 시 메인 탭 content 초기화
    useEffect(() => {
        if (projectData?.content && state.tabs.length > 0) {
            const mainTab = state.tabs.find(tab => tab.id === 'main');
            if (mainTab && mainTab.content === '') {
                // 메인 탭의 content가 비어있으면 프로젝트 content로 초기화
                actions.updateTab('main', {
                    content: projectData.content
                });
                Logger.info('PROJECT_EDITOR', 'Main tab content initialized from project data', {
                    contentLength: projectData.content.length
                });
            }
        }
    }, [projectData?.content, state.tabs, actions]);

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
                        <div className="flex flex-col h-full">
                            {/* 에디터 - 전체 화면 활용 */}
                            <div className="flex-1 min-h-0">
                                <MarkdownEditor
                                    content={activeTab?.content || ''}
                                    onChange={(content) => {
                                        console.log('🔥 [ProjectEditor] MarkdownEditor onChange:', {
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

                                            // 🔥 탭 타입에 따라 다른 저장 로직
                                            if (activeTab.type === 'main') {
                                                // 메인 탭: 프로젝트 메인 content에 저장
                                                console.log('🔥 [ProjectEditor] Saving to MAIN project content');
                                                projectData.setContent(content);
                                            } else if (activeTab.type === 'chapter') {
                                                // 챕터 탭: 해당 챕터 구조체에 저장
                                                console.log('🔥 [ProjectEditor] Saving to CHAPTER:', activeTab.title);

                                                // 탭 ID에서 구조체 ID 추출 (탭 ID 형식: 'chapter-{structureId}' 또는 구조체 ID 자체)
                                                const structureId = activeTab.id.startsWith('chapter-')
                                                    ? activeTab.id.replace('chapter-', '')
                                                    : activeTab.id;

                                                // 비동기 저장 (Promise로 처리, 에러는 로그로만)
                                                updateStructureItem(projectId, structureId, {
                                                    content: content
                                                }).then(() => {
                                                    console.log('✅ [ProjectEditor] Chapter saved successfully:', structureId);
                                                }).catch((error) => {
                                                    console.error('❌ [ProjectEditor] Failed to save chapter:', error);
                                                });
                                            } else {
                                                // 기타 탭: 탭 자체에만 저장 (임시)
                                                console.log('🔥 [ProjectEditor] Saving to TAB only:', activeTab.type);
                                            }
                                        }
                                    }}
                                    isFocusMode={uiState?.isFocusMode || false}
                                    onEditorReady={(editor) => {
                                        setEditorInstance(editor);
                                        Logger.debug('PROJECT_EDITOR', 'Editor instance received', { hasEditor: !!editor });
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
                    />
                );

            case 'characters':
                return (
                    <CharactersView
                        projectId={projectId}
                        characters={projectData?.characters || []}
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
                        notes={projectData?.notes || []}
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
                        synopsisId="default" // 기본 시놉시스 ID
                        characters={projectData?.characters || []}
                        notes={projectData?.notes || []}
                        content={projectData?.content || ''}
                        onBack={() => {
                            Logger.info('PROJECT_EDITOR', 'Synopsis view back - returning to structure view');
                            actions.setCurrentView('structure');
                        }}
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

    return (
    <ProjectEditorLayout.Container className="relative overflow-x-hidden">
            {/* 🔥 ProjectHeader 고정 영역 */}
            <div className="h-14 relative bg-[color:hsl(var(--card))] border-b border-[color:hsl(var(--border))] shadow-[var(--shadow-sm,0_10px_20px_rgba(15,23,42,0.08))] z-[900] transition-colors duration-200">
                <ProjectEditorLayout.Header>
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
            </div>

            {/* 🔥 EditorTabBar - ProjectHeader와 동일한 레벨에서 렌더링 */}
            {state.currentView === 'write' && (
                <div className="h-12 sticky top-14 bg-[color:hsl(var(--muted))]/80 border-b border-[color:hsl(var(--border))] z-[1300] backdrop-blur-sm transition-colors duration-200 shadow-[var(--shadow-md,0_10px_30px_rgba(15,23,42,0.18))]">
                    <EditorTabBar
                        tabs={state.tabs}
                        activeTabId={state.activeTabId}
                        onTabClick={actions.setActiveTab}
                        onTabClose={actions.removeTab}
                        onNewTab={() => {
                            const newTab = {
                                id: `tab-${Date.now()}`,
                                title: `새 탭 ${state.tabs.length}`,
                                type: 'chapter' as const,
                                isActive: true,
                                content: ''
                            };
                            actions.addTab(newTab);
                        }}
                    />
                </div>
            )}

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
                        className="absolute left-0 top-14 w-64 h-[calc(100%-3.5rem)] z-[150] bg-[color:hsl(var(--card))]/95 backdrop-blur-lg border-r border-[color:hsl(var(--border))] shadow-[var(--shadow-xl,0_22px_46px_rgba(15,23,42,0.32))] transition-all duration-500 ease-in-out transform translate-x-0 pointer-events-auto animate-slide-in-left"
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
                                onViewChange={actions.setCurrentView}
                                structure={projectData?.structure || []}
                                characters={projectData?.characters || []}
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

                {/* 🔥 일반 ProjectSidebar (사이드바 펼쳐져 있을 때) */}
                {!isSidebarCollapsed && (
                    <ProjectSidebar
                        projectId={projectId}
                        currentView={state.currentView}
                        onViewChange={actions.setCurrentView}
                        structure={projectData?.structure || []}
                        characters={projectData?.characters || []}
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
                )}

                {/* 각 뷰의 메인 컨텐츠 */}
                <div className="flex-1 h-full">
                    {renderCurrentView()}
                </div>

                {/* 오른쪽 사이드바 (AI 패널) */}
                {state.showRightSidebar && (
                    <WriterStatsPanel
                        showRightSidebar={state.showRightSidebar}
                        toggleRightSidebar={actions.toggleRightSidebar}
                        writerStats={projectData?.writerStats || {
                            wordCount: 0,
                            characterCount: 0,
                            paragraphCount: 0,
                            pageCount: 0,
                            readingTime: '0분',
                            typingSpeed: 0,
                            sessionWords: 0,
                            dailyGoal: 1000,
                            progressPercentage: 0
                        }}
                        setWordGoal={(goal) => {
                            projectData?.setWordGoal(goal);
                        }}
                        currentText={activeTab?.content || ''}
                        projectId={projectId}
                    />
                )}
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
                    {/* 🔥 디버깅: 모달 렌더링 확인 */}
                    {console.log('🔍 Rendering NewChapterModal, state:', state.showNewChapterModal)}
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
                                status: 'planning',
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

            {/* 단축키 도움말 */}
            <ShortcutHelp />
        </ProjectEditorLayout.Container>
    );
});

export default ProjectEditor;
