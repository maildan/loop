// 🔥 Modularized ProjectEditor - 모듈화된 새로운 프로젝트 에디터
// 기존 1284줄 → 약 200줄로 축소, 단일 책임 원칙 준수

'use client';

import React, { memo, useEffect, useCallback } from 'react';
import { MarkdownEditor } from '../../editor/MarkdownEditor';
import { EditorProvider } from '../../editor/EditorProvider';
import { ShortcutHelp } from '../../editor/ShortcutHelp';
import { WriterSidebar } from '../../components/WriterSidebar';
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

    // 🔥 Zen mode 관련 상태
    const isZenMode = settings?.ui?.zenMode ?? false;
    const isFocusMode = settings?.ui?.focusMode ?? false;
    const sidebarCollapsed = settings?.ui?.sidebarCollapsed ?? false;
    const appSidebarCollapsed = settings?.ui?.appSidebarCollapsed ?? false;

    // 🔥 저장 성공 처리
    const handleSaveSuccess = () => {
        actions.markAllTabsAsSaved();
        Logger.info('PROJECT_EDITOR', 'All tabs marked as saved');
    };

    // 🔥 Zen mode 토글 함수들
    const toggleSidebar = useCallback(() => {
        updateSetting('ui', 'sidebarCollapsed', !sidebarCollapsed);
        Logger.info('PROJECT_EDITOR', 'Sidebar toggled', { collapsed: !sidebarCollapsed });
    }, [updateSetting, sidebarCollapsed]);

    const toggleFocusMode = useCallback(() => {
        updateSetting('ui', 'focusMode', !isFocusMode);
        Logger.info('PROJECT_EDITOR', 'Focus mode toggled', { enabled: !isFocusMode });
    }, [updateSetting, isFocusMode]);

    const enableZenMode = useCallback(() => {
        updateSetting('ui', 'zenMode', true);
        updateSetting('ui', 'sidebarCollapsed', true);
        updateSetting('ui', 'appSidebarCollapsed', true);
        updateSetting('ui', 'focusMode', true);
        Logger.info('PROJECT_EDITOR', 'Zen mode enabled');
    }, [updateSetting]);

    const disableZenMode = useCallback(() => {
        updateSetting('ui', 'zenMode', false);
        updateSetting('ui', 'sidebarCollapsed', false);
        updateSetting('ui', 'appSidebarCollapsed', false);
        updateSetting('ui', 'focusMode', false);
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

            // Escape: Focus mode 해제 또는 Zen mode 해제
            if (event.key === 'Escape') {
                if (isFocusMode) {
                    event.preventDefault();
                    toggleFocusMode();
                    Logger.info('PROJECT_EDITOR', 'Focus mode disabled via ESC');
                } else if (isZenMode) {
                    event.preventDefault();
                    disableZenMode();
                    Logger.info('PROJECT_EDITOR', 'Zen mode disabled via ESC');
                }
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZenMode, isFocusMode, toggleSidebar, toggleFocusMode, enableZenMode, disableZenMode]);

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
                                            actions.updateTab(activeTab.id, {
                                                content,
                                                isDirty: true
                                            });
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
        <ProjectEditorLayout.Container>
            {/* 🔥 Zen mode가 아닐 때만 헤더 표시 */}
            {!isZenMode && !isFocusMode && (
                <ProjectEditorLayout.Header>
                    <ProjectHeader
                        title={projectData?.title || '프로젝트'}
                        onTitleChange={(title) => {
                            projectData?.setTitle(title);
                            Logger.debug('PROJECT_EDITOR', 'Title changed', { title });
                        }}
                        onBack={() => {
                            // TODO: 뒤로가기 로직
                            Logger.debug('PROJECT_EDITOR', 'Back button clicked');
                        }}
                        sidebarCollapsed={state.collapsed}
                        onToggleSidebar={actions.toggleCollapsed}
                        showRightSidebar={state.showRightSidebar}
                        onToggleAISidebar={actions.toggleRightSidebar}
                        isFocusMode={isFocusMode}
                        onToggleFocusMode={toggleFocusMode}
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
            )}

            {/* 메인 컨텐츠 */}
            <ProjectEditorLayout.Main>
                {/* 🔥 Zen mode나 Focus mode가 아닐 때만 왼쪽 사이드바 표시 */}
                {!state.collapsed && !isZenMode && !isFocusMode && (
                    <WriterSidebar
                        projectId={projectId}
                        currentView={state.currentView}
                        onViewChange={actions.setCurrentView}
                        characters={projectData?.characters || []}
                        stats={projectData?.writerStats || {
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
                        collapsed={false}
                        onAddStructure={() => {
                            actions.openNewChapterModal();
                            Logger.info('PROJECT_EDITOR', 'Add structure clicked');
                        }}
                        onAddCharacter={() => {
                            // TODO: 캐릭터 추가 모달 열기
                            Logger.info('PROJECT_EDITOR', 'Add character clicked');
                        }}
                        onAddNote={() => {
                            // TODO: 노트 추가 모달 열기
                            Logger.info('PROJECT_EDITOR', 'Add note clicked');
                        }}
                        onEditStructure={(id) => {
                            // 구조 편집 - 해당 탭 열기
                            const newTab = {
                                id: `structure-${id}`,
                                title: `구조 ${id}`,
                                type: 'chapter' as const,
                                isActive: true,
                                content: ''
                            };
                            actions.addTab(newTab);
                            Logger.info('PROJECT_EDITOR', 'Edit structure clicked', { id });
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
                <NewChapterModal
                    isOpen={state.showNewChapterModal}
                    onClose={actions.closeNewChapterModal}
                    onConfirm={(chapterData) => {
                        // TODO: 새 챕터 생성 로직
                        actions.closeNewChapterModal();
                    }}
                />
            )}

            {/* 단축키 도움말 */}
            <ShortcutHelp />
        </ProjectEditorLayout.Container>
    );
});

export default ProjectEditor;
