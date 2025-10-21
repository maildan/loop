/**
 * editorEventHandlers.ts
 * Centralized event handler factory for EditorTabBar and ProjectSidebar
 *
 * Responsibility:
 * - Handle tab click, close, new events
 * - Handle sidebar view changes and tab/modal creation
 * - Cache persistence on tab close
 * - View synchronization with tab type
 */

import type { EditorTab } from '../../../../../../shared/editor';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';
import { projectEditorStateService } from './ProjectEditorStateService';

const PROJECT_EDITOR = Symbol.for('PROJECT_EDITOR');
const EDITOR_TAB_BAR = 'EDITOR_TAB_BAR';
const PROJECT_SIDEBAR_HOVER = 'PROJECT_SIDEBAR_HOVER';

/**
 * Props for event handler creation
 */
interface EventHandlerContextProps {
  projectId: string;
  state: any; // EditorState from useEditorState
  actions: any; // EditorActions from useEditorState
}

/**
 * Create tab click handler
 * Syncs currentView based on tab type
 */
export const createTabClickHandler = (context: EventHandlerContextProps) => {
  const { state, actions } = context;

  return (tabId: string) => {
    actions.setActiveTab(tabId);

    // Sync currentView based on tab type
    const tab = state.tabs.find((t: any) => t.id === tabId);
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
      Logger.info(EDITOR_TAB_BAR, 'Tab clicked, view synced', {
        tabId,
        tabType: tab.type,
        currentView: state.currentView,
      });
    }
  };
};

/**
 * Create tab close handler
 * Persists cache immediately before state update
 */
export const createTabCloseHandler = (context: EventHandlerContextProps) => {
  const { projectId, state, actions } = context;

  return (tabId: string) => {
    // Capture current state before removeTab
    const currentState = state;

    // Call removeTab (triggers setState)
    actions.removeTab(tabId);

    // Calculate new metadata cache and save immediately
    const removedTab = currentState.tabs.find((tab: any) => tab.id === tabId);
    const newMetadataCache = { ...currentState.tabMetadataCache };

    if (removedTab) {
      newMetadataCache[tabId] = {
        id: removedTab.id,
        title: removedTab.title,
        chapterId: removedTab.chapterId,
        lastAccessedAt: removedTab.lastAccessedAt,
      };
    }

    // Save to localStorage synchronously
    projectEditorStateService.saveCacheToStorage(projectId, newMetadataCache);
    Logger.debug(PROJECT_EDITOR, '⚡ Cache saved IMMEDIATELY after removeTab (sync)', {
      projectId,
      cacheSize: Object.keys(newMetadataCache).length,
      removedTabId: tabId,
      removedTabChapterId: removedTab?.chapterId,
      savedMetadata: JSON.stringify(newMetadataCache[tabId]),
    });
  };
};

/**
 * Create new tab handler
 * Creates a new chapter tab with unique ID and metadata
 */
export const createNewTabHandler = (context: EventHandlerContextProps) => {
  const { state, actions } = context;

  return () => {
    const newTab: EditorTab = {
      id: `tab-${Date.now()}`,
      title: `새 탭 ${state.tabs.length}`,
      type: 'chapter' as const,
      isActive: true,
      chapterId: `chapter_${Date.now()}`, // CRITICAL: chapterId must be present
      content: '',
      order: state.tabs.length,
      lastAccessedAt: Date.now(),
    };
    actions.addTab(newTab);
  };
};

/**
 * Create view change handler for sidebar
 * Creates or activates tabs based on view type
 */
export const createViewChangeHandler = (context: EventHandlerContextProps, location: 'hover' | 'expanded') => {
  const { state, actions } = context;

  return (view: string) => {
    // Set current view
    actions.setCurrentView(view);

    // Determine target tab ID and info based on view
    let targetTabId: string | undefined;
    let tabTitle: string | undefined;
    let tabType: EditorTab['type'] | undefined;

    switch (view) {
      case 'write':
        // Write view is handled by existing tabs
        return;
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

    // Activate existing tab or create new one
    const existingTab = state.tabs.find((t: any) => t.id === targetTabId);
    if (existingTab) {
      actions.setActiveTab(targetTabId);
      Logger.info(
        location === 'hover' ? PROJECT_SIDEBAR_HOVER : 'PROJECT_SIDEBAR',
        'Existing tab activated',
        {
          view,
          targetTabId,
          location,
        }
      );
    } else if (tabTitle && tabType) {
      actions.addTab({
        id: targetTabId,
        title: tabTitle,
        type: tabType,
        isActive: true,
        content: '',
        order: state.tabs.length,
        lastAccessedAt: Date.now(),
      });
      Logger.info(
        location === 'hover' ? PROJECT_SIDEBAR_HOVER : 'PROJECT_SIDEBAR',
        'New tab created',
        {
          view,
          targetTabId,
          tabTitle,
          location,
        }
      );
    }
  };
};

/**
 * Create modal opening handlers
 */
export const createModalHandlers = (context: EventHandlerContextProps) => {
  const { actions } = context;

  return {
    openNewChapterModal: () => {
      actions.openNewChapterModal();
      Logger.info(PROJECT_EDITOR, 'Add structure clicked');
    },
    openNewCharacterModal: () => {
      actions.openNewCharacterModal();
      Logger.info(PROJECT_EDITOR, 'Add character clicked');
    },
    openNewNoteModal: () => {
      actions.openNewNoteModal();
      Logger.info(PROJECT_EDITOR, 'Add note clicked');
    },
  };
};

/**
 * Create sidebar toggle handler (AI sidebar)
 */
export const createAISidebarToggleHandler = (context: EventHandlerContextProps) => {
  const { actions } = context;

  return () => {
    actions.toggleRightSidebar();
  };
};
