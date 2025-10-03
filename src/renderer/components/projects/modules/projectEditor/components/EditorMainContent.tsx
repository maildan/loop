/**
 * EditorMainContent - Main view rendering component
 * Handles switching between different editor views (write, structure, characters, notes, synopsis, idea)
 */

import React from 'react';
import { WriteView } from '../../../views/write';
import { StructureView } from '../../../views/StructureView';
import { CharactersView } from '../../../views/CharactersView';
import { NotesView } from '../../../views/notes';
import { SynopsisView } from '../../../views/synopsis';
import { IdeaView } from '../../../views/idea';
import type { ProjectCharacter, ProjectNote } from '../../../../../../shared/types';

export interface EditorMainContentProps {
  currentView: string;
  projectId: string;
  // Write view
  onBack: () => void;
  // Structure view
  onNavigateToChapterEdit?: (chapterId: string) => void;
  onAddNewChapter?: () => void;
  onNavigateToIdeaEdit?: (ideaId: string) => void;
  onNavigateToSynopsisEdit?: (synopsisId: string) => void;
  // Characters view
  characters: ProjectCharacter[];
  onCharactersChange: (characters: ProjectCharacter[]) => void;
  // Notes view
  notes: ProjectNote[];
  onNotesChange: (notes: ProjectNote[]) => void;
  // Synopsis view
  synopsisId?: string;
  content?: string;
}

export function EditorMainContent({
  currentView,
  projectId,
  onBack,
  onNavigateToChapterEdit,
  onAddNewChapter,
  onNavigateToIdeaEdit,
  onNavigateToSynopsisEdit,
  characters,
  onCharactersChange,
  notes,
  onNotesChange,
  synopsisId = 'default',
  content = '',
}: EditorMainContentProps): React.ReactElement {
  switch (currentView) {
    case 'write':
      return <WriteView />;

    case 'structure':
      return (
        <StructureView
          projectId={projectId}
          onNavigateToChapterEdit={onNavigateToChapterEdit || (() => {})}
          onAddNewChapter={onAddNewChapter || (() => {})}
          onNavigateToIdeaEdit={onNavigateToIdeaEdit || (() => {})}
          onNavigateToSynopsisEdit={onNavigateToSynopsisEdit || (() => {})}
        />
      );

    case 'characters':
      return (
        <CharactersView
          projectId={projectId}
          characters={characters}
          onCharactersChange={onCharactersChange}
        />
      );

    case 'notes':
      return (
        <NotesView
          projectId={projectId}
          notes={notes}
          onNotesChange={onNotesChange}
          onBack={onBack}
        />
      );

    case 'synopsis':
      return (
        <SynopsisView
          projectId={projectId}
          synopsisId={synopsisId}
          characters={characters.map(char => ({
            ...char,
            color: char.color || '#3B82F6',
            sortOrder: char.sortOrder ?? 0,
            isActive: char.isActive ?? true
          }))}
          notes={notes.map(note => ({
            ...note,
            type: note.type || 'general',
            color: note.color || '#3B82F6',
            isPinned: note.isPinned ?? false,
            isArchived: note.isArchived ?? false,
            sortOrder: note.sortOrder ?? 0
          }))}
          content={content}
          onBack={onBack}
        />
      );

    case 'idea':
      return <IdeaView ideaId={projectId} onBack={onBack} />;

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">알 수 없는 뷰입니다.</p>
        </div>
      );
  }
}
