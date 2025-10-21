/**
 * ProjectSidebarSection.tsx
 * Renders both hover and expanded sidebars
 *
 * Responsibility:
 * - Render ProjectSidebar in hover mode (collapsed)
 * - Render ProjectSidebar in expanded mode
 * - Manage sidebar visibility state and handlers
 */

import React from 'react';
import { ProjectSidebar } from '../../../components/ProjectSidebar';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

const PROJECT_SIDEBAR = 'PROJECT_SIDEBAR';

/**
 * Props for ProjectSidebarSection
 */
interface ProjectSidebarSectionProps {
  // State
  projectId: string;
  currentView: string;
  isSidebarCollapsed: boolean;
  sidebarHovered: boolean;

  // Data
  structure: any[];
  memoizedCharacters: any[];
  writerStats: {
    wordCount: number;
    charCount: number;
    paragraphCount: number;
    readingTime: number;
    wordGoal: number;
    progress: number;
    sessionTime: number;
    wpm: number;
  };

  // Handlers
  onViewChange: (view: string) => void;
  onHoverViewChange: (view: string) => void;
  onAddStructure: () => void;
  onAddCharacter: () => void;
  onAddNote: () => void;

  // Callbacks
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * ProjectSidebarSection - Renders sidebar (hover or expanded mode)
 * 
 * Layout strategy:
 * - Collapsed (hover): Absolute positioning at top-0, width transitions on hover
 * - Expanded: Relative positioning to participate in flex layout
 */
export const ProjectSidebarSection: React.FC<ProjectSidebarSectionProps> = ({
  projectId,
  currentView,
  isSidebarCollapsed,
  sidebarHovered,
  structure,
  memoizedCharacters,
  writerStats,
  onViewChange,
  onHoverViewChange,
  onAddStructure,
  onAddCharacter,
  onAddNote,
  onMouseEnter,
  onMouseLeave,
}) => {
  // ============================================================================
  // COLLAPSED STATE (Zen Browser style - hover overlay)
  // ============================================================================
  if (isSidebarCollapsed) {
    return (
      <>
        {/* Hover trigger area - minimal space, expands on hover */}
        <div
          className="relative w-8 h-full flex-shrink-0 z-[100] transition-all duration-200 hover:w-12"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />

        {/* Hover overlay - slides in from left */}
        {sidebarHovered && (
          <div
            className="absolute left-0 top-0 w-64 h-full z-[110] bg-[color:hsl(var(--card))]/95 backdrop-blur-lg border-r border-[color:hsl(var(--border))] shadow-[var(--shadow-xl,0_22px_46px_rgba(15,23,42,0.32))] overflow-y-auto pointer-events-auto"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="p-4">
              <ProjectSidebar
                projectId={projectId}
                currentView={currentView}
                onViewChange={onHoverViewChange}
                structure={structure}
                characters={memoizedCharacters}
                collapsed={false}
                stats={writerStats}
                onAddStructure={onAddStructure}
                onAddCharacter={onAddCharacter}
                onAddNote={onAddNote}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // ============================================================================
  // EXPANDED STATE (Sidebar fully visible in layout)
  // ============================================================================
  return (
    <div className="w-80 h-full flex-shrink-0 z-[100] overflow-hidden shadow-sm border-r border-[color:hsl(var(--border))] bg-[color:hsl(var(--card))] flex flex-col">
      {/* 🔥 임시 디버그 버튼 메뉴 */}
      <div className="flex flex-col gap-1 p-2 border-b border-[color:hsl(var(--border))]">
        <button onClick={() => { console.log('CLICKED: write'); onViewChange('write'); }} className="px-3 py-2 text-sm rounded hover:bg-[color:hsl(var(--muted))] text-left">글쓰기</button>
        <button onClick={() => { console.log('CLICKED: structure'); onViewChange('structure'); }} className="px-3 py-2 text-sm rounded hover:bg-[color:hsl(var(--muted))] text-left">구조</button>
        <button onClick={() => { console.log('CLICKED: characters'); onViewChange('characters'); }} className="px-3 py-2 text-sm rounded hover:bg-[color:hsl(var(--muted))] text-left">인물</button>
        <button onClick={() => { console.log('CLICKED: synopsis'); onViewChange('synopsis'); }} className="px-3 py-2 text-sm rounded hover:bg-[color:hsl(var(--muted))] text-left">시놉시스</button>
        <button onClick={() => { console.log('CLICKED: idea'); onViewChange('idea'); }} className="px-3 py-2 text-sm rounded hover:bg-[color:hsl(var(--muted))] text-left">아이디어</button>
      </div>
      
      {/* 원본 ProjectSidebar */}
      <div className="flex-1 overflow-y-auto">
        <ProjectSidebar
          projectId={projectId}
          currentView={currentView}
          onViewChange={onViewChange}
          structure={structure}
          characters={memoizedCharacters}
          collapsed={false}
          stats={writerStats}
          onAddStructure={onAddStructure}
          onAddCharacter={onAddCharacter}
          onAddNote={onAddNote}
        />
      </div>
    </div>
  );
};

export default ProjectSidebarSection;
