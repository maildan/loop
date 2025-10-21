/**
 * HeaderSection.tsx
 * Renders header and tab bar sections
 *
 * Responsibility:
 * - Render ProjectHeader (title, back button, editor controls)
 * - Render EditorTabBar (tabs, new tab button, AI sidebar toggle)
 * - Only show header in write view (Chrome style)
 */

import React from 'react';
import type { Editor } from '@tiptap/react';
import { ProjectHeader } from '../../../components/ProjectHeader';
import { EditorTabBar } from '../../../components/EditorTabBar';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

const PROJECT_EDITOR = Symbol.for('PROJECT_EDITOR');

/**
 * Props for HeaderSection
 */
interface HeaderSectionProps {
  // State
  state: any;
  normalizedCurrentView: 'write' | 'synopsis' | 'characters' | 'structure' | 'notes' | 'idea';

  // Project data
  projectData: any;
  editorInstance: Editor | null;

  // UI state
  isSidebarCollapsed: boolean;

  // Handlers
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  onToggleAISidebar: () => void;
  onToggleSidebar: () => void;
  onTitleChange?: (title: string) => void;
  onBack?: () => void;

  // Actions
  actions: any;
}

/**
 * HeaderSection - Renders sticky header and tab bar
 */
export const HeaderSection: React.FC<HeaderSectionProps> = ({
  // State
  state,
  normalizedCurrentView,

  // Project data
  projectData,
  editorInstance,

  // UI state
  isSidebarCollapsed,

  // Handlers
  onTabClick,
  onTabClose,
  onNewTab,
  onToggleAISidebar,
  onToggleSidebar,
  onTitleChange,
  onBack,

  // Actions
  actions,
}) => {
  return (
    <div className="sticky top-0 z-[1200] flex flex-col bg-[color:hsl(var(--card))] transition-colors duration-200 shadow-[var(--shadow-sm,0_10px_20px_rgba(15,23,42,0.08))]">
      {/* ProjectHeader - only show in write view (Chrome style) */}
      {state.currentView === 'write' && (
        <div className="relative z-[1500] min-h-[3.5rem] shadow-none">
          <ProjectHeader
            title={projectData?.title || '프로젝트'}
            onTitleChange={(title) => {
              projectData?.setTitle(title);
              Logger.debug(PROJECT_EDITOR, 'Title changed', { title });
              onTitleChange?.(title);
            }}
            onBack={() => {
              Logger.debug(PROJECT_EDITOR, 'Back button clicked');
              onBack?.();
              if (typeof window !== 'undefined') {
                window.location.href = '/projects';
              }
            }}
            editor={editorInstance}
            sidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={onToggleSidebar}
          />
        </div>
      )}

      {/* EditorTabBar - always visible */}
      <div className="relative overflow-hidden backdrop-blur-sm transition-all duration-200 border-b z-[1300] h-12 bg-[color:hsl(var(--muted))]/85 border-[color:hsl(var(--border))] opacity-100">
        <EditorTabBar
          tabs={state.tabs}
          activeTabId={state.activeTabId}
          currentView={normalizedCurrentView}
          onTabClick={onTabClick}
          onTabClose={onTabClose}
          onNewTab={onNewTab}
          onToggleAISidebar={onToggleAISidebar}
          isAISidebarOpen={state.showRightSidebar}
        />
      </div>
    </div>
  );
};

export default HeaderSection;
