// 🔥 ProjectEditorStateService - ProjectEditor의 복잡한 상태 관리를 담당
// 15개 이상의 useState를 체계적으로 관리하는 서비스

import { useState, useCallback } from 'react';
import { Logger } from '../../../../../../shared/logger';
import { EditorTab } from '../../../../../../shared/editor';

export interface ProjectEditorState {
    // View 상태
    currentView: string;
    currentSubView: string;
    editingItemId: string;

    // UI 상태
    collapsed: boolean;
    showRightSidebar: boolean;

    // Modal 상태
    showDeleteDialog: boolean;
    showShareDialog: boolean;
    showNewChapterModal: boolean;
    showNewCharacterModal: boolean;
    showNewNoteModal: boolean;
    showChapterDeleteDialog: boolean;
    chapterToDelete: { id: string; title: string } | null;

    // Tab 상태
    tabs: EditorTab[];
    activeTabId: string;
    nextTabOrder: number;
    tabHistory: string[];  // 🔥 Chrome-style: MRU (Most Recently Used) 탭 히스토리
}

export interface ProjectEditorStateActions {
    // View 액션
    setCurrentView: (view: string) => void;
    setCurrentSubView: (subView: string) => void;
    setEditingItemId: (id: string) => void;

    // UI 액션
    toggleCollapsed: () => void;
    toggleRightSidebar: () => void;

    // Modal 액션
    openDeleteDialog: () => void;
    closeDeleteDialog: () => void;
    openShareDialog: () => void;
    closeShareDialog: () => void;
    openNewChapterModal: () => void;
    closeNewChapterModal: () => void;
    openNewCharacterModal: () => void;
    closeNewCharacterModal: () => void;
    openNewNoteModal: () => void;
    closeNewNoteModal: () => void;
    openChapterDeleteDialog: (chapter: { id: string; title: string }) => void;
    closeChapterDeleteDialog: () => void;

    // Tab 액션
    addTab: (tab: Omit<EditorTab, 'order'>) => void;
    removeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;
    updateTab: (tabId: string, updates: Partial<EditorTab>) => void;
    markAllTabsAsSaved: () => void;
}

// 🔥 Chrome-style: 히스토리에서 다음 활성 탭 찾기
function findNextActiveTab(history: string[], tabs: EditorTab[]): string {
    // 1. 히스토리에서 존재하는 탭 찾기
    for (const historyTabId of history) {
        if (tabs.find(t => t.id === historyTabId)) {
            Logger.debug('TAB_HISTORY', 'Found valid tab in history', { historyTabId });
            return historyTabId;
        }
    }
    
    // 2. 히스토리에 없으면 첫 번째 탭 반환
    const firstTabId = tabs[0]?.id || 'main';
    Logger.debug('TAB_HISTORY', 'No valid history, using first tab', { firstTabId });
    return firstTabId;
}

export class ProjectEditorStateService {
    private static instance: ProjectEditorStateService;

    private constructor() { }

    public static getInstance(): ProjectEditorStateService {
        if (!ProjectEditorStateService.instance) {
            ProjectEditorStateService.instance = new ProjectEditorStateService();
        }
        return ProjectEditorStateService.instance;
    }

    // 🔥 초기 상태 생성
    public createInitialState(): ProjectEditorState {
        return {
            // View 상태
            currentView: 'write',
            currentSubView: '',
            editingItemId: '',

            // UI 상태
            collapsed: false,
            showRightSidebar: false,

            // Modal 상태
            showDeleteDialog: false,
            showShareDialog: false,
            showNewChapterModal: false,
            showNewCharacterModal: false,
            showNewNoteModal: false,
            showChapterDeleteDialog: false,
            chapterToDelete: null,

            // Tab 상태
            tabs: [
                {
                    id: 'main',
                    title: '메인',
                    type: 'main',
                    isActive: true,
                    order: 0,
                    content: ''
                }
            ],
            activeTabId: 'main',
            nextTabOrder: 1,
            tabHistory: [],  // 🔥 초기에는 히스토리 없음
        };
    }

    // 🔥 상태 액션 생성
    public createStateActions(
        state: ProjectEditorState,
        setState: React.Dispatch<React.SetStateAction<ProjectEditorState>>
    ): ProjectEditorStateActions {
        return {
            // View 액션
            setCurrentView: (view: string) => {
                setState(prev => ({ ...prev, currentView: view }));
                Logger.debug('PROJECT_EDITOR_STATE', 'View changed', { view });
            },

            setCurrentSubView: (subView: string) => {
                setState(prev => ({ ...prev, currentSubView: subView }));
                Logger.debug('PROJECT_EDITOR_STATE', 'SubView changed', { subView });
            },

            setEditingItemId: (id: string) => {
                setState(prev => ({ ...prev, editingItemId: id }));
                Logger.debug('PROJECT_EDITOR_STATE', 'Editing item changed', { id });
            },

            // UI 액션
            toggleCollapsed: () => {
                setState(prev => {
                    const newCollapsed = !prev.collapsed;
                    Logger.debug('PROJECT_EDITOR_STATE', 'Sidebar toggled', { collapsed: newCollapsed });
                    return { ...prev, collapsed: newCollapsed };
                });
            },

            toggleRightSidebar: () => {
                setState(prev => {
                    const newShowRightSidebar = !prev.showRightSidebar;
                    Logger.debug('PROJECT_EDITOR_STATE', 'Right sidebar toggled', { show: newShowRightSidebar });
                    return { ...prev, showRightSidebar: newShowRightSidebar };
                });
            },

            // Modal 액션
            openDeleteDialog: () => {
                setState(prev => ({ ...prev, showDeleteDialog: true }));
                Logger.debug('PROJECT_EDITOR_STATE', 'Delete dialog opened');
            },

            closeDeleteDialog: () => {
                setState(prev => ({ ...prev, showDeleteDialog: false }));
                Logger.debug('PROJECT_EDITOR_STATE', 'Delete dialog closed');
            },

            openShareDialog: () => {
                setState(prev => ({ ...prev, showShareDialog: true }));
                Logger.debug('PROJECT_EDITOR_STATE', 'Share dialog opened');
            },

            closeShareDialog: () => {
                setState(prev => ({ ...prev, showShareDialog: false }));
                Logger.debug('PROJECT_EDITOR_STATE', 'Share dialog closed');
            },

            openNewChapterModal: () => {
                setState(prev => ({ ...prev, showNewChapterModal: true }));
                Logger.debug('PROJECT_EDITOR_STATE', 'New chapter modal opened');
            },

            closeNewChapterModal: () => {
                setState(prev => ({ ...prev, showNewChapterModal: false }));
                Logger.debug('PROJECT_EDITOR_STATE', 'New chapter modal closed');
            },

            openNewCharacterModal: () => {
                setState(prev => ({ ...prev, showNewCharacterModal: true }));
                Logger.debug('PROJECT_EDITOR_STATE', 'New character modal opened');
            },

            closeNewCharacterModal: () => {
                setState(prev => ({ ...prev, showNewCharacterModal: false }));
                Logger.debug('PROJECT_EDITOR_STATE', 'New character modal closed');
            },

            openNewNoteModal: () => {
                setState(prev => ({ ...prev, showNewNoteModal: true }));
                Logger.debug('PROJECT_EDITOR_STATE', 'New note modal opened');
            },

            closeNewNoteModal: () => {
                setState(prev => ({ ...prev, showNewNoteModal: false }));
                Logger.debug('PROJECT_EDITOR_STATE', 'New note modal closed');
            },

            openChapterDeleteDialog: (chapter: { id: string; title: string }) => {
                setState(prev => ({
                    ...prev,
                    showChapterDeleteDialog: true,
                    chapterToDelete: chapter
                }));
                Logger.debug('PROJECT_EDITOR_STATE', 'Chapter delete dialog opened', { chapter });
            },

            closeChapterDeleteDialog: () => {
                setState(prev => ({
                    ...prev,
                    showChapterDeleteDialog: false,
                    chapterToDelete: null
                }));
                Logger.debug('PROJECT_EDITOR_STATE', 'Chapter delete dialog closed');
            },

            // Tab 액션
            addTab: (tab: Omit<EditorTab, 'order'>) => {
                setState(prev => {
                    const newTab: EditorTab = { ...tab, order: prev.nextTabOrder };
                    const newTabs = [...prev.tabs, newTab];
                    
                    // 🔥 Chrome-style: 새 탭 생성 시 현재 활성 탭을 히스토리에 추가
                    let newHistory = prev.tabHistory.filter(id => id !== tab.id);
                    if (prev.activeTabId && prev.activeTabId !== tab.id) {
                        newHistory.unshift(prev.activeTabId);
                    }
                    newHistory = newHistory.slice(0, 10);

                    Logger.debug('PROJECT_EDITOR_STATE', 'Tab added', { 
                        tab: newTab,
                        previousTab: prev.activeTabId,
                        historyLength: newHistory.length 
                    });

                    return {
                        ...prev,
                        tabs: newTabs,
                        nextTabOrder: prev.nextTabOrder + 1,
                        activeTabId: tab.id,
                        tabHistory: newHistory
                    };
                });
            },

            removeTab: (tabId: string) => {
                setState(prev => {
                    // 🔥 마지막 탭은 닫을 수 없음 (최소 1개 유지)
                    if (prev.tabs.length <= 1) {
                        Logger.warn('PROJECT_EDITOR_STATE', 'Cannot close last tab', { tabId });
                        return prev;
                    }

                    const newTabs = prev.tabs.filter(tab => tab.id !== tabId);
                    
                    // 🔥 Chrome-style: 닫는 탭이 활성 탭이면 히스토리에서 다음 탭 찾기
                    let newActiveTabId = prev.activeTabId;
                    if (prev.activeTabId === tabId) {
                        newActiveTabId = findNextActiveTab(prev.tabHistory, newTabs);
                    }

                    // 히스토리에서도 제거
                    const newHistory = prev.tabHistory.filter(id => id !== tabId);

                    Logger.debug('PROJECT_EDITOR_STATE', 'Tab removed', { 
                        removedTabId: tabId, 
                        newActiveTabId,
                        historyLength: newHistory.length 
                    });

                    return {
                        ...prev,
                        tabs: newTabs,
                        activeTabId: newActiveTabId,
                        tabHistory: newHistory
                    };
                });
            },

            setActiveTab: (tabId: string) => {
                setState(prev => {
                    const updatedTabs = prev.tabs.map(tab => ({
                        ...tab,
                        isActive: tab.id === tabId
                    }));

                    // 🔥 Chrome-style: 현재 활성 탭을 히스토리에 추가
                    let newHistory = prev.tabHistory.filter(id => id !== tabId);
                    if (prev.activeTabId && prev.activeTabId !== tabId) {
                        newHistory.unshift(prev.activeTabId);
                    }
                    // 최대 10개까지만 보관
                    newHistory = newHistory.slice(0, 10);

                    Logger.debug('PROJECT_EDITOR_STATE', 'Active tab changed', { 
                        tabId, 
                        previousTab: prev.activeTabId,
                        historyLength: newHistory.length 
                    });

                    return {
                        ...prev,
                        tabs: updatedTabs,
                        activeTabId: tabId,
                        tabHistory: newHistory
                    };
                });
            },

            updateTab: (tabId: string, updates: Partial<EditorTab>) => {
                setState(prev => {
                    const updatedTabs = prev.tabs.map(tab =>
                        tab.id === tabId ? { ...tab, ...updates } : tab
                    );

                    Logger.debug('PROJECT_EDITOR_STATE', 'Tab updated', { tabId, updates });

                    return { ...prev, tabs: updatedTabs };
                });
            },

            markAllTabsAsSaved: () => {
                setState(prev => {
                    const updatedTabs = prev.tabs.map(tab => ({ ...tab, isDirty: false }));
                    Logger.debug('PROJECT_EDITOR_STATE', 'All tabs marked as saved');

                    return { ...prev, tabs: updatedTabs };
                });
            },
        };
    }
}

export const projectEditorStateService = ProjectEditorStateService.getInstance();
