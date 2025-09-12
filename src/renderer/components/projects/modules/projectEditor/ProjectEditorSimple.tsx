// 🔥 Simplified ProjectEditor - 레이아웃 문제 해결된 버전

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
import { WriteView } from '../../views/WriteView';
import { StructureView } from '../../views/StructureView';
import { CharactersView } from '../../views/CharactersView';
import { NotesView } from '../../views/NotesView';
import { SynopsisView } from '../../views/SynopsisView';
import { IdeaView } from '../../views/IdeaView';
import { Logger } from '../../../../../shared/logger';
import { useStructureStore } from '../../../../stores/useStructureStore';
import { useProjectData } from '../../hooks/useProjectData';
import { useUIState } from '../../hooks/useUIState';
import { useProjectEditorState } from './hooks/useProjectEditorState';
import { useSettings } from '../../../../app/settings/hooks/useSettings';

export interface ProjectEditorProps {
    projectId: string;
}

export const ProjectEditorSimple = memo(function ProjectEditorSimple({
    projectId
}: ProjectEditorProps): React.ReactElement {
    Logger.info('PROJECT_EDITOR', 'ProjectEditor render started', { projectId });

    const { isLoading, error, ...projectData } = useProjectData(projectId);
    const uiState = useUIState();
    const { state, actions } = useProjectEditorState();
    const { settings } = useSettings();

    // 🔥 뷰 렌더링 함수
    const renderCurrentView = () => {
        switch (state.currentView) {
            case 'write':
                return <div className="p-4">Write View</div>;
            case 'structure':
                return (
                    <StructureView 
                        projectId={projectId}
                        onNavigateToNotesView={() => {
                            actions.setCurrentView('notes');
                            Logger.info('PROJECT_EDITOR', 'Navigating to notes view from structure');
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
                        onBack={() => actions.setCurrentView('structure')}
                    />
                );
            case 'synopsis':
                return (
                    <SynopsisView
                        projectId={projectId}
                        synopsisId="default"
                        characters={projectData?.characters || []}
                        notes={projectData?.notes || []}
                        content={projectData?.content || ''}
                        onBack={() => actions.setCurrentView('structure')}
                    />
                );
            case 'idea':
                return <div className="p-4">Idea View</div>;
            default:
                return <div className="p-4">Default View</div>;
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">프로젝트 로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">프로젝트 로딩 실패: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
            {/* 🔥 ProjectHeader - 고정 상단 */}
            <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-[900]">
                <ProjectHeader
                    title={projectData?.title || '프로젝트'}
                    projectId={projectId}
                    projectContent={projectData?.content || ''}
                    onTitleChange={(title) => {
                        projectData?.setTitle(title);
                        Logger.debug('PROJECT_EDITOR', 'Title changed', { title });
                    }}
                    onBack={() => {
                        // /projects로 이동
                        if (typeof window !== 'undefined') {
                            window.location.href = '/projects';
                        }
                    }}
                    sidebarCollapsed={state.collapsed}
                    onToggleSidebar={actions.toggleCollapsed}
                    showRightSidebar={state.showRightSidebar}
                    onToggleAISidebar={actions.toggleRightSidebar}
                    isZenMode={false}
                    onToggleZenMode={() => { }}
                    onSave={async () => {
                        try {
                            if (projectData?.saveProject) {
                                await projectData.saveProject();
                                Logger.info('PROJECT_EDITOR', 'Project saved successfully');
                            }
                        } catch (error) {
                            Logger.error('PROJECT_EDITOR', 'Save failed', error);
                        }
                    }}
                    onShare={() => {
                        actions.openShareDialog();
                    }}
                    onDownload={async () => {
                        try {
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
                        } catch (error) {
                            Logger.error('PROJECT_EDITOR', 'Download failed', error);
                        }
                    }}
                    onDelete={() => {
                        actions.openDeleteDialog();
                    }}
                />
            </div>

            {/* 🔥 메인 컨텐츠 영역 */}
            <div className="flex flex-1 overflow-hidden">
                {/* 🔥 ProjectSidebar */}
                {!state.collapsed && (
                    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-4">프로젝트 사이드바</h3>
                            <div className="space-y-2">
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-lg ${state.currentView === 'structure' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    onClick={() => actions.setCurrentView('structure')}
                                >
                                    구조
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-lg ${state.currentView === 'synopsis' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    onClick={() => actions.setCurrentView('synopsis')}
                                >
                                    시놉시스
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-lg ${state.currentView === 'notes' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    onClick={() => actions.setCurrentView('notes')}
                                >
                                    노트
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🔥 메인 뷰 영역 */}
                <div className="flex-1 overflow-hidden">
                    {renderCurrentView()}
                </div>

                {/* 🔥 오른쪽 사이드바 (AI 파트너) */}
                {state.showRightSidebar && (
                    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-4">AI 창작 파트너</h3>
                            <p className="text-gray-600 dark:text-gray-400">AI 지원 기능이 여기에 표시됩니다.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
