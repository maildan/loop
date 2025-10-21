// 🔥 useEditorShortcuts Hook - 키보드 단축키 관리
// Step 2 리팩토링: 모든 키보드 단축키 로직을 분리
// 책임: 4가지 단축키 처리 (Cmd+S, Alt+Ctrl+S, Alt+Ctrl+H, Escape)

'use client';

import { useEffect, useCallback } from 'react';
import { RendererLogger as Logger } from '../../../../../../shared/logger-renderer';

export interface UseEditorShortcutsProps {
  projectId: string;
  isZenMode: boolean;
  onManualSave: () => Promise<void>;
  onToggleSidebar: () => void;
  onToggleZenMode: () => void;
}

/**
 * 🔥 에디터 키보드 단축키 Hook
 * 
 * 4가지 단축키를 관리:
 * - Cmd+S / Ctrl+S: 수동 저장
 * - Alt+Ctrl+S: 사이드바 토글
 * - Alt+Ctrl+H: Zen 모드 토글
 * - Escape: Zen 모드 해제
 * 
 * @param props - { projectId, isZenMode, onManualSave, onToggleSidebar, onToggleZenMode }
 */
export function useEditorShortcuts({
  projectId,
  isZenMode,
  onManualSave,
  onToggleSidebar,
  onToggleZenMode,
}: UseEditorShortcutsProps): void {
  // 🔥 단축키 1: Cmd+S / Ctrl+S - 수동 저장
  const handleManualSave = useCallback(async () => {
    try {
      Logger.info('EDITOR_SHORTCUTS', 'Manual save triggered (Cmd+S / Ctrl+S)', { projectId });
      await onManualSave();
    } catch (error) {
      Logger.error('EDITOR_SHORTCUTS', 'Manual save failed', { error, projectId });
    }
  }, [onManualSave, projectId]);

  useEffect(() => {
    const handleSaveKeyDown = (event: KeyboardEvent) => {
      // Cmd+S (Mac) 또는 Ctrl+S (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        handleManualSave();
      }
    };

    window.addEventListener('keydown', handleSaveKeyDown);
    return () => window.removeEventListener('keydown', handleSaveKeyDown);
  }, [handleManualSave]);

  // 🔥 단축키 2-4: Alt+Ctrl+S, Alt+Ctrl+H, Escape
  useEffect(() => {
    const handleMultiKeyDown = (event: KeyboardEvent) => {
      // Alt + Ctrl + S: 사이드바 토글
      if (event.altKey && event.ctrlKey && event.key === 's') {
        event.preventDefault();
        Logger.info('EDITOR_SHORTCUTS', 'Sidebar toggled (Alt+Ctrl+S)', { projectId });
        onToggleSidebar();
        return;
      }

      // Alt + Ctrl + H: Zen 모드 토글
      if (event.altKey && event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        Logger.info('EDITOR_SHORTCUTS', 'Zen mode toggled (Alt+Ctrl+H)', {
          projectId,
          newZenMode: !isZenMode,
        });
        onToggleZenMode();
        return;
      }

      // Escape: Zen 모드 해제 (Zen 모드일 때만)
      if (event.key === 'Escape' && isZenMode) {
        event.preventDefault();
        Logger.info('EDITOR_SHORTCUTS', 'Zen mode disabled (ESC)', { projectId });
        onToggleZenMode();
        return;
      }
    };

    window.addEventListener('keydown', handleMultiKeyDown);
    return () => window.removeEventListener('keydown', handleMultiKeyDown);
  }, [isZenMode, onToggleSidebar, onToggleZenMode, projectId]);

  Logger.debug('EDITOR_SHORTCUTS', 'Shortcuts initialized', {
    projectId,
    shortcuts: ['Cmd+S / Ctrl+S (Save)', 'Alt+Ctrl+S (Toggle Sidebar)', 'Alt+Ctrl+H (Toggle Zen)', 'Escape (Exit Zen)'],
  });
}

export default useEditorShortcuts;
