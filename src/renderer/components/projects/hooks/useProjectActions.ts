'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Logger } from '../../../../shared/logger';

interface UseKeyboardShortcutsProps {
  saveProject: () => Promise<void>;
  toggleFocusMode: () => void;
  setShowHeader: (show: boolean) => void;
  isFocusMode: boolean;
}

export function useKeyboardShortcuts({
  saveProject,
  toggleFocusMode,
  setShowHeader,
  isFocusMode
}: UseKeyboardShortcutsProps): void {
  
  // 🔥 Ctrl+S 저장 및 자동 저장
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Ctrl+S: 저장
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveProject();
        Logger.debug('SHORTCUTS', 'Manual save triggered');
        return;
      }
      
      // Esc: 포커스 모드 토글
      if (event.key === 'Escape') {
        toggleFocusMode();
        Logger.debug('SHORTCUTS', 'Focus mode toggled');
        return;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // 마우스 움직임 감지하여 헤더 표시
    let timeout: NodeJS.Timeout;
    const handleMouseMove = (): void => {
      if (isFocusMode) {
        setShowHeader(true);
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
          setShowHeader(false);
        }, 3000);
      }
    };
    
    if (isFocusMode) {
      setShowHeader(false);
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      setShowHeader(true);
      document.removeEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFocusMode, saveProject, toggleFocusMode, setShowHeader]);
}

interface UseProjectActionsProps {
  projectId: string;
  saveProject: () => Promise<void>;
  title: string;
  content: string;
}

export function useProjectActions({
  projectId,
  saveProject,
  title,
  content
}: UseProjectActionsProps) {
  const router = useRouter();
  
  const handleBack = useCallback((): void => {
    Logger.info('PROJECT_ACTIONS', 'Navigating back to projects');
    saveProject().then(() => {
      router.push('/projects');
    });
  }, [router, saveProject]);
  
  const handleShare = useCallback((): void => {
    Logger.info('PROJECT_ACTIONS', 'Share project requested');
    // TODO: 실제 공유 기능 구현
    alert('공유 기능을 구현 중입니다.');
  }, []);
  
  const handleDownload = useCallback((): void => {
    Logger.info('PROJECT_ACTIONS', 'Download project requested');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || '프로젝트'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, title]);

  return {
    handleBack,
    handleShare,
    handleDownload
  };
}
