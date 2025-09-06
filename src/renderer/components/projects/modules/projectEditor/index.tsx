// 🔥 Modularized ProjectEditor - 모듈화된 새로운 프로젝트 에디터
// 기존 1284줄 → 약 200줄로 축소, 단일 책임 원칙 준수

'use client';

import React, { memo, useEffect, useCallback, useRef, useState } from 'react';
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
import { WriteView } from '../../views/WriteView';
import { StructureView } from '../../views/StructureView';
import { CharactersView } from '../../views/CharactersView';
import { NotesView } from '../../views/NotesView';
import { SynopsisView } from '../../views/SynopsisView';
import { IdeaView } from '../../views/IdeaView';
import { Logger } from '../../../../../shared/logger';

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
    const { settings, updateSetting } = useSettings();

    // 🔥 사이드바 관련 상태 (집중모드 제거, 사이드바 접기로 통합)
    const isZenMode = settings?.ui?.zenMode ?? false;
    const sidebarCollapsed = settings?.ui?.sidebarCollapsed ?? false;
    const appSidebarCollapsed = settings?.ui?.appSidebarCollapsed ?? false;

    // 🔥 tabBar hover 상태
    const [tabBarHovered, setTabBarHovered] = useState(false);

    // 🔥 ProjectSidebar hover 상태
    const [sidebarHovered, setSidebarHovered] = useState(false);

    // 🔥 집중모드와 사이드바 접기 분리
    const isSidebarCollapsed = sidebarCollapsed || appSidebarCollapsed || state.collapsed;

    // 🔥 디버깅: 사이드바 상태 확인
    console.log('🔍 Sidebar States:', {
        isSidebarCollapsed: isSidebarCollapsed, // hover시 표시
        reasons: {
            sidebarCollapsed,
            appSidebarCollapsed,
            'state.collapsed': state.collapsed
        }
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
                            {/* 탭 바 */}
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

                            {/* 에디터 - 전체 화면 활용 */}
                            <div className="flex-1 min-h-0">
                                <MarkdownEditor
                                    content={activeTab?.content || ''}
                                    onChange={(content) => {
                                        if (activeTab) {
                                            // 탭 업데이트
                                            actions.updateTab(activeTab.id, {
                                                content,
                                                isDirty: true
                                            });

                                            // 🔥 실제 프로젝트 content도 업데이트 (DB 자동저장)
                                            projectData.setContent(content);
                                        }
                                    }}
                                    isFocusMode={uiState?.isFocusMode || false}
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
                            // 새 탭으로 챕터 열기
                            const newTab = {
                                id: `chapter-${chapterId}`,
                                title: `챕터 ${chapterId}`,
                                type: 'chapter' as const,
                                isActive: true,
                                content: ''
                            };
                            actions.addTab(newTab);
                            actions.setCurrentView('write');
                            Logger.info('PROJECT_EDITOR', 'Chapter tab opened', { chapterId });
                        }}
                        onAddNewChapter={() => {
                            actions.openNewChapterModal();
                            Logger.info('PROJECT_EDITOR', 'New chapter modal opened');
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
                    />
                );

            case 'synopsis':
                return (
                    <SynopsisView
                        synopsisId={projectId}
                        onBack={() => {
                            Logger.info('PROJECT_EDITOR', 'Synopsis view back');
                        }}
                    />
                );

            case 'idea':
                return (
                    <IdeaView
                        ideaId={projectId}
                        onBack={() => {
                            Logger.info('PROJECT_EDITOR', 'Idea view back');
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
        <ProjectEditorLayout.Container className="relative overflow-hidden">
            {/* 🔥 tabBar 영역 항상 예약 + 조건부 ProjectHeader 표시 (축소된 높이) */}
            <div className="h-14 relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                {!isSidebarCollapsed ? (
                    <ProjectEditorLayout.Header>
                        <ProjectHeader
                            title={projectData?.title || '프로젝트'}
                            onTitleChange={(title) => {
                                projectData?.setTitle(title);
                                Logger.debug('PROJECT_EDITOR', 'Title changed', { title });
                            }}
                            onBack={() => {
                                Logger.debug('PROJECT_EDITOR', 'Back button clicked');
                            }}
                            sidebarCollapsed={state.collapsed}
                            onToggleSidebar={actions.toggleCollapsed}
                            showRightSidebar={state.showRightSidebar}
                            onToggleAISidebar={actions.toggleRightSidebar}
                            isZenMode={isZenMode}
                            onToggleZenMode={isZenMode ? disableZenMode : enableZenMode}
                            onSave={async () => {
                                try {
                                    // 모든 변경사항 저장
                                    if (projectData?.saveProject) {
                                        await projectData.saveProject();
                                        handleSaveSuccess();
                                        Logger.info('PROJECT_EDITOR', 'Project saved successfully');
                                    }
                                } catch (error) {
                                    Logger.error('PROJECT_EDITOR', 'Save failed', error);
                                }
                            }}
                            onShare={() => {
                                actions.openShareDialog();
                                Logger.info('PROJECT_EDITOR', 'Share dialog opened');
                            }}
                            onDownload={async () => {
                                try {
                                    // 프로젝트를 파일로 다운로드
                                    const content = JSON.stringify(projectData, null, 2);
                                    const blob = new Blob([content], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${projectData?.title || 'project'}.json`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                    Logger.info('PROJECT_EDITOR', 'Project downloaded');
                                } catch (error) {
                                    Logger.error('PROJECT_EDITOR', 'Download failed', error);
                                }
                            }}
                            onDelete={() => {
                                actions.openDeleteDialog();
                                Logger.info('PROJECT_EDITOR', 'Delete dialog opened');
                            }}
                        />
                    </ProjectEditorLayout.Header>
                ) : (
                    /* 사이드바 접힘: hover 영역 + 조건부 ProjectHeader */
                    <div
                        className="w-full h-full flex items-center justify-center relative"
                        onMouseEnter={() => setTabBarHovered(true)}
                        onMouseLeave={() => setTabBarHovered(false)}
                    >
                        {/* tabBar 영역 placeholder */}
                        <div className="text-gray-200 text-sm">

                        </div>

                        {/* hover 시 ProjectHeader 오버레이 - 슬라이드 다운 애니메이션 */}
                        {tabBarHovered && (
                            <div className="absolute inset-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transform transition-all duration-300 animate-in slide-in-from-top-2">
                                <ProjectEditorLayout.Header>
                                    <ProjectHeader
                                        title={projectData?.title || '프로젝트'}
                                        onTitleChange={(title) => {
                                            projectData?.setTitle(title);
                                            Logger.debug('PROJECT_EDITOR', 'Title changed', { title });
                                        }}
                                        onBack={() => {
                                            Logger.debug('PROJECT_EDITOR', 'Back button clicked');
                                        }}
                                        sidebarCollapsed={state.collapsed}
                                        onToggleSidebar={actions.toggleCollapsed}
                                        showRightSidebar={state.showRightSidebar}
                                        onToggleAISidebar={actions.toggleRightSidebar}
                                        isZenMode={isZenMode}
                                        onToggleZenMode={isZenMode ? disableZenMode : enableZenMode}
                                        onSave={async () => {
                                            try {
                                                if (projectData?.saveProject) {
                                                    await projectData.saveProject();
                                                    handleSaveSuccess();
                                                    Logger.info('PROJECT_EDITOR', 'Project saved successfully');
                                                }
                                            } catch (error) {
                                                Logger.error('PROJECT_EDITOR', 'Save failed', error);
                                            }
                                        }}
                                        onShare={() => {
                                            Logger.debug('PROJECT_EDITOR', 'Share button clicked');
                                        }}
                                        onDownload={() => {
                                            try {
                                                const data = JSON.stringify(projectData, null, 2);
                                                const blob = new Blob([data], { type: 'application/json' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `${projectData?.title || 'project'}.json`;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                                Logger.info('PROJECT_EDITOR', 'Project downloaded');
                                            } catch (error) {
                                                Logger.error('PROJECT_EDITOR', 'Download failed', error);
                                            }
                                        }}
                                        onDelete={() => {
                                            actions.openDeleteDialog();
                                            Logger.info('PROJECT_EDITOR', 'Delete dialog opened');
                                        }}
                                    />
                                </ProjectEditorLayout.Header>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 메인 컨텐츠 */}
            <ProjectEditorLayout.Main>
                {/* 🔥 ProjectSidebar hover 영역 - 왼쪽 끝자락 */}
                {isSidebarCollapsed && (
                    <div
                        className="absolute left-0 top-14 w-4 h-[calc(100%-3.5rem)] z-40"
                        onMouseEnter={() => setSidebarHovered(true)}
                        onMouseLeave={() => setSidebarHovered(false)}
                    >
                        {/* ProjectSidebar hover 시 표시 */}
                        {sidebarHovered && (
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
                        )}
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
                        onConfirm={(chapterData) => {
                            // TODO: 새 챕터 생성 로직
                            actions.closeNewChapterModal();
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
