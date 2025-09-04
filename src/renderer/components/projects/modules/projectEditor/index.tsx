// 🔥 Modularized ProjectEditor - 모듈화된 새로운 프로젝트 에디터
// 기존 1284줄 → 약 200줄로 축소, 단일 책임 원칙 준수

'use client';

import React, { memo, useEffect } from 'react';
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

    // 🔥 저장 성공 처리
    const handleSaveSuccess = () => {
        actions.markAllTabsAsSaved();
        Logger.info('PROJECT_EDITOR', 'All tabs marked as saved');
    };

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
                    <div className="flex h-full">
                        {/* 왼쪽 사이드바 - write 뷰에서만 */}
                        {!state.collapsed && (
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
                            />
                        )}
                        
                        {/* 메인 에디터 영역 */}
                        <EditorProvider>
                            <div className="flex-1 flex flex-col h-full">
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

                                {/* 에디터 */}
                                <div className="flex-1">
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
                    </div>
                );

            case 'structure':
                return (
                    <StructureView
                        projectId={projectId}
                    />
                );

            case 'characters':
                return (
                    <CharactersView
                        projectId={projectId}
                        characters={[]}
                        onCharactersChange={() => { }}
                    />
                );

            case 'notes':
                return (
                    <NotesView
                        projectId={projectId}
                    />
                );

            case 'synopsis':
                return (
                    <SynopsisView
                        synopsisId="default"
                        onBack={() => actions.setCurrentView('write')}
                    />
                );

            case 'idea':
                return (
                    <IdeaView
                        ideaId="default"
                        onBack={() => actions.setCurrentView('write')}
                    />
                );

            default:
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
            {/* 헤더 */}
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
                    isFocusMode={uiState?.isFocusMode || false}
                    onToggleFocusMode={() => {
                        // TODO: 포커스 모드 토글 로직
                        Logger.debug('PROJECT_EDITOR', 'Focus mode toggled');
                    }}
                    onSave={() => {
                        // TODO: 저장 로직
                        actions.markAllTabsAsSaved();
                        Logger.debug('PROJECT_EDITOR', 'Save clicked');
                    }}
                    onShare={actions.openShareDialog}
                    onDownload={() => {
                        // TODO: 다운로드 로직
                        Logger.debug('PROJECT_EDITOR', 'Download clicked');
                    }}
                    onDelete={actions.openDeleteDialog}
                />
            </ProjectEditorLayout.Header>

            {/* 메인 컨텐츠 */}
            <ProjectEditorLayout.Main>
                {/* 각 뷰가 자체 사이드바를 포함 */}
                {renderCurrentView()}

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
