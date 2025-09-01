'use client';

import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { MarkdownEditor } from './editor/MarkdownEditor';
import { EditorProvider } from './editor/EditorProvider';
import { ShortcutHelp } from './editor/ShortcutHelp';
import { WriterSidebar } from './components/WriterSidebar';
import { WriterStatsPanel } from './editor/WriterStatsPanel'; // 🔥 AI 창작 파트너 패널 추가
import { ProjectHeader } from './components/ProjectHeader'; // 🔥 새로운 모듈화된 헤더
import { EditorTabBar } from './components/EditorTabBar'; // 🔥 NEW: 탭 바
import { NewChapterModal } from './components/NewChapterModal'; // 🔥 NEW: 새 챕터 모달
import { ConfirmDeleteDialog } from './components/ConfirmDeleteDialog';
import { ConfirmDialog } from './components/ConfirmDialog'; // 🔥 범용 확인 다이얼로그 추가
import { ShareDialog } from './components/ShareDialog';
import { WriteView } from './views/WriteView';
import { StructureView } from './views/StructureView';
import useStructureStore from '../../stores/useStructureStore'; // 🔥 스토어 import 추가
import { CharactersView } from './views/CharactersView';
import { NotesView } from './views/NotesView';
import { SynopsisView } from './views/SynopsisView';
import { IdeaView } from './views/IdeaView';
import { Logger } from '../../../shared/logger';
import { EditorTab } from '../../../shared/editor';
import { ProjectStructure } from '../../../shared/types';

// 🔥 실제 hooks import (기가차드 수정)
import { useProjectData } from './hooks/useProjectData';
import { useUIState } from './hooks/useUIState';


// 🔥 기가차드 UI 문제점 해결된 스타일
const WRITER_EDITOR_STYLES = {
  // 전체 레이아웃
  container: 'h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200',

  // 헤더 (🔥 nav 중첩 문제 해결)
  header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
  headerLeft: 'flex items-center gap-3',
  headerCenter: 'flex-1 max-w-md mx-auto',
  headerRight: 'flex items-center gap-2',

  // 메인 레이아웃
  main: 'flex flex-1 overflow-hidden',

  // 🔥 에디터 영역 수정 (한줄 문제, 스크롤 제한 해결)
  editorContainer: 'flex-1 flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200',
  editorContent: 'flex-1 min-h-0 overflow-hidden', // 🔥 min-h-0 추가로 flex 영역 제대로 잡힘

  // UI 컨트롤
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
  iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  titleInput: 'border-none bg-transparent focus:outline-none focus:ring-0 text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100',

  // 🔥 백 버튼 개선 (중첩 문제 해결)
  backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors',
} as const;

export interface ProjectEditorProps {
  projectId: string;
}

// 🔥 React.memo로 무한 리렌더링 방지 (11원칙: 성능 최적화)
export const ProjectEditor = memo(function ProjectEditor({ projectId }: ProjectEditorProps): React.ReactElement {
  Logger.info('PROJECT_EDITOR', 'ProjectEditor render started', { projectId }); // replaced logger.log with Logger

  // 🔥 커스텀 hooks 사용
  const { isLoading, error, ...projectData } = useProjectData(projectId);
  const uiState = useUIState();
  const [currentView, setCurrentView] = useState<string>('write'); // 🔥 프로젝트 진입 시 바로 글쓰기 에디터 표시
  const [currentSubView, setCurrentSubView] = useState<string>(''); // 🔥 서브 뷰 상태 (시놉시스, 아이디어 등)
  const [editingItemId, setEditingItemId] = useState<string>(''); // 🔥 편집 중인 아이템 ID
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(false); // 🔥 AI 사이드바 상태 추가
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [showNewChapterModal, setShowNewChapterModal] = useState<boolean>(false); // 🔥 NEW: 새 챕터 모달 상태
  const [showChapterDeleteDialog, setShowChapterDeleteDialog] = useState<boolean>(false); // 🔥 챕터 삭제 확인 다이얼로그
  const [chapterToDelete, setChapterToDelete] = useState<{ id: string; title: string } | null>(null); // 🔥 삭제할 챕터 정보

  // 🔥 NEW: 탭 시스템 상태 (글쓰기 에디터만)
  const [tabs, setTabs] = useState<EditorTab[]>([
    {
      id: 'main',
      title: '메인',
      type: 'main',
      isActive: true,
      order: 0,
      content: '' // 메인 탭의 독립적인 컨텐츠
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('main');
  const [nextTabOrder, setNextTabOrder] = useState<number>(1);

  // 🔥 저장 완료 후 모든 탭의 isDirty 상태 초기화
  const handleSaveSuccess = useCallback(() => {
    setTabs(prevTabs =>
      prevTabs.map(tab => ({ ...tab, isDirty: false }))
    );
    Logger.info('PROJECT_EDITOR', 'All tabs marked as saved');
  }, []);

  // 🔥 저장 상태 변화 감지하여 탭 상태 업데이트
  useEffect(() => {
    if (projectData.saveStatus === 'saved') {
      handleSaveSuccess();
    }
  }, [projectData.saveStatus, handleSaveSuccess]);

  const editorRef = useRef<any>(null);
  const hasRestoredTabs = useRef(false); // 🔥 탭 복원 중복 방지

  // 🔥 프로젝트 로드 시 chapters에서 탭 복원 (중복 방지)
  useEffect(() => {
    if (!isLoading && projectData.chapters && !hasRestoredTabs.current) {
      try {
        const chaptersData = JSON.parse(projectData.chapters);
        const chapterIds = Object.keys(chaptersData);

        if (chapterIds.length === 0) return; // 빈 chapters는 무시

        // 🔥 useStructureStore의 데이터와 교차 검증 (삭제된 챕터 필터링)
        const structureStore = useStructureStore.getState();
        const existingStructures = structureStore.structures[projectId] || [];
        const validChapterIds = chapterIds.filter(chapterId =>
          existingStructures.some(structure => structure.id === chapterId && structure.type === 'chapter')
        );

        if (validChapterIds.length === 0) return; // 유효한 챕터가 없으면 복원하지 않음

        // 새로운 챕터 탭들 생성 (고유한 탭 ID 사용)
        const chapterTabs: EditorTab[] = validChapterIds.map((chapterId, index) => {
          const structure = existingStructures.find(s => s.id === chapterId);
          return {
            id: `tab-chapter-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`, // 🔥 고유한 탭 ID
            title: structure?.title || `${index + 1}챕터`, // 🔥 구조에서 제목 가져오기, 없으면 번호
            type: 'chapter' as const,
            isActive: false,
            order: index + 1,
            content: chaptersData[chapterId],
            chapterId, // 🔥 챕터 ID는 별도 저장
            isDirty: false // 🔥 복원된 탭은 저장된 상태
          };
        });

        // 메인 탭 + 복원된 챕터 탭들
        setTabs([
          {
            id: 'main',
            title: '메인',
            type: 'main',
            isActive: true,
            order: 0,
            content: projectData.content || '',
            isDirty: false // 🔥 초기 로드 시 저장된 상태
          },
          ...chapterTabs
        ]);

        // nextTabOrder 설정
        setNextTabOrder(chapterTabs.length + 1);
        hasRestoredTabs.current = true;

        Logger.info('PROJECT_EDITOR', 'Tabs restored from chapters with validation', {
          chaptersCount: chapterTabs.length,
          validChapterIds,
          totalChapterIds: chapterIds.length
        });
      } catch (error) {
        Logger.error('PROJECT_EDITOR', 'Failed to restore tabs from chapters', error);
      }
    }
  }, [isLoading, projectData.chapters, projectData.content, projectId]);

  const [isEditorReady, setIsEditorReady] = useState<boolean>(false); // 🔥 에디터 준비 상태 추가

  // 🔥 Google Docs 연동 감지 및 상태 관리
  const [isGoogleDocsProject, setIsGoogleDocsProject] = useState<boolean>(false);
  const [googleDocMeta, setGoogleDocMeta] = useState<{
    googleDocId?: string;
    googleDocUrl?: string;
    originalDescription?: string;
    isGoogleDocsProject?: boolean;
  } | null>(null);
  const [isSyncingWithGoogle, setIsSyncingWithGoogle] = useState<boolean>(false);
  const [fullProjectData, setFullProjectData] = useState<any>(null); // 🔥 전체 프로젝트 데이터

  // 🔥 프로젝트 전체 데이터 로드
  useEffect(() => {
    const loadFullProject = async () => {
      try {
        const result = await window.electronAPI?.projects?.getById(projectId);
        if (result?.success && result.data) {
          setFullProjectData(result.data);
        }
      } catch (error) {
        Logger.error('PROJECT_EDITOR', 'Failed to load full project data', error);
      }
    };

    if (projectId) {
      loadFullProject();
    }
  }, [projectId]);

  // 🔥 Google Docs 메타데이터 파싱 및 설정
  useEffect(() => {
    if (fullProjectData?.description) {
      try {
        const match = fullProjectData.description.match(/\[Google Docs 연동 정보: (\{.*\})\]$/s);
        if (match && match[1]) {
          const parsed = JSON.parse(match[1]);
          if (parsed && parsed.isGoogleDocsProject) {
            setIsGoogleDocsProject(true);
            setGoogleDocMeta(parsed);
            Logger.info('PROJECT_EDITOR', 'Google Docs project detected', {
              googleDocId: parsed.googleDocId,
              googleDocUrl: parsed.googleDocUrl
            });
          }
        }
      } catch (parseErr) {
        Logger.debug('PROJECT_EDITOR', 'Google Docs 메타데이터 파싱 실패', { err: parseErr, projectId });
      }
    }
  }, [fullProjectData?.description, projectId]);

  // 🔥 메인 탭 content를 프로젝트 데이터와 동기화
  useEffect(() => {
    if (projectData.content !== undefined) {
      setTabs(prevTabs =>
        prevTabs.map(tab =>
          tab.type === 'main'
            ? { ...tab, content: projectData.content }
            : tab
        )
      );
    }
  }, [projectData.content]);

  // 🔥 에디터 상태 업데이트
  const { setCurrentEditor, addStructureItem } = useStructureStore();

  // 🔥 현재 뷰에 따라 에디터 상태 업데이트 (안전한 버전)
  useEffect(() => {
    if (!projectId) return;

    if (currentView === 'structure') {
      setCurrentEditor({
        projectId,
        editorType: 'structure'
      });
    } else if (currentView === 'write') {
      setCurrentEditor({
        projectId,
        editorType: 'chapter',
        itemId: editingItemId,
        itemTitle: editingItemId ? `${editingItemId}챕터` : undefined
      });
    } else if (currentView === 'characters') {
      setCurrentEditor({
        projectId,
        editorType: 'characters'
      });
    } else if (currentView === 'notes') {
      setCurrentEditor({
        projectId,
        editorType: 'notes'
      });
    } else if (currentView === 'synopsis') {
      setCurrentEditor({
        projectId,
        editorType: 'synopsis',
        itemId: editingItemId,
        itemTitle: '시놉시스'
      });
    } else if (currentView === 'idea') {
      setCurrentEditor({
        projectId,
        editorType: 'idea',
        itemId: editingItemId,
        itemTitle: '아이디어'
      });
    }
  }, [currentView, editingItemId, projectId, setCurrentEditor]);

  // 🔥 Google Docs와 동기화 함수
  const syncWithGoogleDocs = useCallback(async () => {
    if (!isGoogleDocsProject || !googleDocMeta?.googleDocId) return;

    setIsSyncingWithGoogle(true);
    try {
      Logger.info('PROJECT_EDITOR', 'Syncing with Google Docs', { googleDocId: googleDocMeta.googleDocId });

      // Google Docs에서 최신 내용 가져오기
      const result = await window.electronAPI?.oauth?.importGoogleDoc(googleDocMeta.googleDocId);

      if (result?.success && result.data?.content) {
        // 프로젝트 내용 업데이트
        projectData.setContent(result.data.content);
        await projectData.forceSave();
        Logger.info('PROJECT_EDITOR', 'Google Docs sync completed', {
          contentLength: result.data.content.length
        });
      } else {
        Logger.warn('PROJECT_EDITOR', 'Google Docs sync failed', result?.error);
      }
    } catch (error) {
      Logger.error('PROJECT_EDITOR', 'Google Docs sync error', error);
    } finally {
      setIsSyncingWithGoogle(false);
    }
  }, [isGoogleDocsProject, googleDocMeta?.googleDocId, projectData]);

  // 🔥 탭 관리 함수들 (중복 key 방지)
  const createNewTab = useCallback((type: EditorTab['type'], title: string, chapterId?: string) => {
    // 🔥 항상 고유한 ID 생성 (chapterId와 구분)
    const uniqueTabId = `tab-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newTab: EditorTab = {
      id: uniqueTabId, // 🔥 고유한 탭 ID
      title,
      type,
      chapterId, // 🔥 챕터 ID는 별도 저장
      isActive: false,
      order: nextTabOrder,
      content: '', // 새 탭은 빈 content로 시작
      isDirty: false // 🔥 새 탭은 초기에 저장된 상태
    };

    setTabs(prevTabs => {
      // 🔥 중복 chapterId 체크
      if (chapterId) {
        const existingTab = prevTabs.find(tab => tab.chapterId === chapterId);
        if (existingTab) {
          Logger.warn('PROJECT_EDITOR', 'Tab with same chapterId already exists', { chapterId });
          // 기존 탭을 활성화
          setActiveTabId(existingTab.id);
          return prevTabs.map(tab => ({ ...tab, isActive: tab.id === existingTab.id }));
        }
      }

      const updatedTabs = prevTabs.map(tab => ({ ...tab, isActive: false }));
      return [...updatedTabs, { ...newTab, isActive: true }];
    });

    setActiveTabId(newTab.id);
    setNextTabOrder(prev => prev + 1);

    Logger.info('PROJECT_EDITOR', 'New tab created', {
      tabId: newTab.id,
      chapterId: newTab.chapterId,
      type: newTab.type,
      title: newTab.title
    });

    return newTab;
  }, [nextTabOrder]);

  const switchToTab = useCallback((tabId: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }))
    );
    setActiveTabId(tabId);

    // 탭에 따라 currentView 업데이트
    const targetTab = tabs.find(tab => tab.id === tabId);
    if (targetTab) {
      if (targetTab.type === 'chapter') {
        setCurrentView('write');
        setEditingItemId(targetTab.chapterId || '');
      } else if (targetTab.type === 'main') {
        // 🔥 메인 탭으로 전환 시 쓰기 뷰 활성화
        setCurrentView('write');
        setEditingItemId(''); // 메인은 editingItemId가 없음
      } else {
        setCurrentView(targetTab.type);
      }

      Logger.info('PROJECT_EDITOR', 'Switched to tab', {
        tabId,
        type: targetTab.type,
        title: targetTab.title,
        currentView: targetTab.type === 'main' ? 'write' : targetTab.type
      });
    }
  }, [tabs]);

  const closeTab = useCallback(async (tabId: string) => {
    if (tabId === 'main') return; // 메인 탭은 닫을 수 없음

    // 닫힐 탭의 정보 가져오기
    const tabToClose = tabs.find(tab => tab.id === tabId);

    // 🔥 챕터 탭을 닫을 때 삭제 확인 다이얼로그 표시
    if (tabToClose?.type === 'chapter' && tabToClose.chapterId) {
      setChapterToDelete({
        id: tabToClose.chapterId,
        title: tabToClose.title
      });
      setShowChapterDeleteDialog(true);
      return; // 다이얼로그 확인 후 실제 삭제 처리
    }

    // 메인 탭이나 다른 탭들은 바로 닫기
    performTabClose(tabId);
  }, [tabs]);

  // 🔥 실제 탭 닫기 처리 함수 (확인 후 실행)
  const performTabClose = useCallback(async (tabId: string) => {
    const tabToClose = tabs.find(tab => tab.id === tabId);

    setTabs(prevTabs => {
      const filteredTabs = prevTabs.filter(tab => tab.id !== tabId);

      // 닫힌 탭이 활성 탭이었다면 다른 탭으로 전환
      if (activeTabId === tabId && filteredTabs.length > 0) {
        const newActiveTab = filteredTabs[filteredTabs.length - 1];
        if (newActiveTab) {
          newActiveTab.isActive = true;
          setActiveTabId(newActiveTab.id);

          // currentView 업데이트
          if (newActiveTab.type === 'chapter') {
            setCurrentView('write');
            setEditingItemId(newActiveTab.chapterId || '');
          } else {
            setCurrentView(newActiveTab.type);
          }
        }
      }

      return filteredTabs.map(tab => ({
        ...tab,
        isActive: tab.id === (activeTabId === tabId ? filteredTabs[filteredTabs.length - 1]?.id : activeTabId)
      }));
    });

    // 🔥 챕터 탭을 닫을 때 chapters JSON에서도 제거
    if (tabToClose?.type === 'chapter' && tabToClose.chapterId) {
      try {
        const chapters = JSON.parse(projectData.chapters || '{}');
        delete chapters[tabToClose.chapterId];
        projectData.setChapters(JSON.stringify(chapters));
        await projectData.forceSave();

        // 🔥 구조 데이터에서도 삭제
        await useStructureStore.getState().deleteStructureItem(projectId, tabToClose.chapterId);

        Logger.info('PROJECT_EDITOR', 'Chapter deleted from both tabs and data', {
          tabId,
          chapterId: tabToClose.chapterId
        });
      } catch (error) {
        Logger.error('PROJECT_EDITOR', 'Failed to delete chapter data', { tabId, error });
      }
    }

    Logger.info('PROJECT_EDITOR', 'Tab closed', { tabId });
  }, [activeTabId, tabs, projectData, projectId]);

  // 🔥 탭 재정렬 핸들러
  const handleTabReorder = useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prevTabs => {
      const newTabs = [...prevTabs];
      const [movedTab] = newTabs.splice(fromIndex, 1);

      if (movedTab) {
        newTabs.splice(toIndex, 0, movedTab);

        // order 값 재정렬
        return newTabs.map((tab, index) => ({
          ...tab,
          order: index
        }));
      }

      return newTabs;
    });

    Logger.info('PROJECT_EDITOR', 'Tabs reordered', { fromIndex, toIndex });
  }, []);

  // 🔥 현재 활성 탭의 content 가져오기
  const getCurrentTabContent = useCallback(() => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);

    if (!activeTab) return '';

    // 메인 탭은 프로젝트 기본 content 사용
    if (activeTab.type === 'main') {
      return projectData.content || '';
    }

    // Chapter 탭은 chapters JSON에서 해당 chapter content 가져오기
    if (activeTab.type === 'chapter' && activeTab.chapterId) {
      try {
        const chapters = JSON.parse(projectData.chapters || '{}');
        return chapters[activeTab.chapterId] || '';
      } catch {
        return '';
      }
    }

    return '';
  }, [tabs, activeTabId, projectData.content, projectData.chapters]);

  // 🔥 현재 활성 탭의 content 업데이트
  const updateCurrentTabContent = useCallback((newContent: string) => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return;

    // 탭 상태 업데이트 (dirty 표시)
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, content: newContent, isDirty: true }
          : tab
      )
    );

    // 메인 탭의 경우 프로젝트 데이터 업데이트
    if (activeTab.type === 'main') {
      projectData.setContent(newContent);
    }

    // Chapter 탭의 경우 chapters JSON 업데이트  
    if (activeTab.type === 'chapter' && activeTab.chapterId) {
      try {
        const chapters = JSON.parse(projectData.chapters || '{}');
        chapters[activeTab.chapterId] = newContent;
        projectData.setChapters(JSON.stringify(chapters));

        Logger.debug('PROJECT_EDITOR', 'Chapter content updated', {
          chapterId: activeTab.chapterId,
          contentLength: newContent.length
        });
      } catch (error) {
        Logger.error('PROJECT_EDITOR', 'Failed to update chapter content', error);
      }
    }

    Logger.debug('PROJECT_EDITOR', 'Tab content updated', {
      tabId: activeTabId,
      type: activeTab.type,
      contentLength: newContent.length
    });
  }, [activeTabId, tabs, projectData]);

  // 🔥 Google Docs로 내용 업로드 (향후 구현 예정)
  const updateGoogleDocs = useCallback(async (content: string) => {
    if (!isGoogleDocsProject || !googleDocMeta?.googleDocId) return;

    try {
      Logger.info('PROJECT_EDITOR', 'Updating Google Docs', {
        googleDocId: googleDocMeta.googleDocId,
        contentLength: content.length
      });

      // TODO: Google Docs API를 통한 내용 업데이트 구현 필요
      // const result = await window.electronAPI?.oauth?.updateGoogleDoc(googleDocMeta.googleDocId, content);

    } catch (error) {
      Logger.error('PROJECT_EDITOR', 'Google Docs update error', error);
    }
  }, [isGoogleDocsProject, googleDocMeta?.googleDocId]);

  // 🔥 외부 링크 열기 함수
  const openGoogleDocsExternal = useCallback(() => {
    if (googleDocMeta?.googleDocUrl) {
      try {
        if (window.electronAPI?.shell?.openExternal) {
          window.electronAPI.shell.openExternal(googleDocMeta.googleDocUrl);
        } else {
          window.open(googleDocMeta.googleDocUrl, '_blank', 'noopener');
        }
        Logger.info('PROJECT_EDITOR', 'Opened Google Docs externally', { url: googleDocMeta.googleDocUrl });
      } catch (error) {
        Logger.error('PROJECT_EDITOR', 'Failed to open Google Docs', error);
      }
    }
  }, [googleDocMeta?.googleDocUrl]);

  // 🔥 에디터 준비 완료 핸들러 (fallback 에디터용)
  const handleEditorReady = useCallback((editor?: unknown) => {
    if (editor) {
      editorRef.current = editor;
    }
    setIsEditorReady(true); // 🔥 에디터 준비 완료 표시
    Logger.info('PROJECT_EDITOR', 'Editor ready (fallback mode)');
  }, []);

  const handleBack = useCallback(() => window.history.back(), []);
  const handleToggleSidebar = useCallback(() => setCollapsed((prev) => !prev), []);

  // 🔥 AI 사이드바 토글 핸들러 추가
  const handleToggleAISidebar = useCallback(() => {
    setShowRightSidebar((prev) => !prev);
    Logger.info('PROJECT_EDITOR', `AI sidebar ${!showRightSidebar ? 'opened' : 'closed'}`);
  }, [showRightSidebar]);

  // 🔥 내비게이션 핸들러들
  const handleNavigateToChapterEdit = useCallback((chapterId: string) => {
    // 🔥 해당 챕터 탭이 이미 있는지 확인
    const existingTab = tabs.find(tab => tab.chapterId === chapterId);

    if (existingTab) {
      // 기존 탭이 있으면 해당 탭으로 전환
      switchToTab(existingTab.id);
    } else {
      // 새 탭 생성 (챕터 제목은 구조에서 가져오기)
      const structureStore = useStructureStore.getState();
      const structures = structureStore.structures[projectId] || [];
      const chapterStructure = structures.find(s => s.id === chapterId && s.type === 'chapter');
      const chapterTitle = chapterStructure?.title || `챕터`;

      createNewTab('chapter', chapterTitle, chapterId);
    }

    setCurrentView('write');
    setEditingItemId(chapterId);
    Logger.info('PROJECT_EDITOR', 'Navigate to chapter edit', { chapterId });
  }, [tabs, switchToTab, createNewTab, projectId]);

  const handleNavigateToSynopsisEdit = useCallback((synopsisId: string) => {
    setCurrentView('synopsis');
    setCurrentSubView('synopsis');
    setEditingItemId(synopsisId);
    Logger.info('PROJECT_EDITOR', 'Navigate to synopsis edit', { synopsisId });
  }, []);

  const handleNavigateToIdeaEdit = useCallback((ideaId: string) => {
    setCurrentView('idea');
    setCurrentSubView('idea');
    setEditingItemId(ideaId);
    Logger.info('PROJECT_EDITOR', 'Navigate to idea edit', { ideaId });
  }, []);

  const handleBackToStructure = useCallback(() => {
    setCurrentView('structure');
    setCurrentSubView('');
    setEditingItemId('');
  }, []);

  // 🔥 WriterSidebar 핸들러들
  const handleAddStructure = useCallback(async () => {
    setShowNewChapterModal(true);
    Logger.info('PROJECT_EDITOR', 'New chapter modal opened');
  }, []);

  // 🔥 NEW: 새 챕터 생성 확정 핸들러
  const handleCreateNewChapter = useCallback(async (title: string) => {
    try {
      const newChapterId = `chapter-${Date.now()}`;

      // 1. 모달에서 입력받은 제목을 그대로 사용
      const chapterTitle = title.trim() || '새로운 챕터'; // 🔥 모달 입력값 사용

      // 2. chapters JSON에 새 챕터 추가
      const existingChapters = JSON.parse(projectData.chapters || '{}');
      existingChapters[newChapterId] = ''; // 빈 content로 시작

      console.log('🔥 DEBUG: About to call setChapters', {
        newChapterId,
        chapterTitle,
        userInputTitle: title,
        chapters: existingChapters,
        stringified: JSON.stringify(existingChapters)
      });

      projectData.setChapters(JSON.stringify(existingChapters));

      console.log('🔥 DEBUG: setChapters called, now calling forceSave');

      // 3. 구조 데이터에도 챕터 정보 저장
      const newStructureItem: ProjectStructure = {
        id: newChapterId,
        title: chapterTitle, // 🔥 사용자 입력 제목 사용
        description: '',
        type: 'chapter',
        status: 'planning',
        projectId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 🔥 Zustand 스토어에 추가 (DB 저장 포함)
      await useStructureStore.getState().addStructureItem(projectId, newStructureItem);

      // 4. 즉시 DB에 저장
      await projectData.forceSave();

      // 5. 새 탭 생성 (사용자 입력 제목 사용)
      createNewTab('chapter', chapterTitle, newChapterId);

      // 6. 쓰기 뷰로 설정
      setCurrentView('write');
      setEditingItemId(newChapterId);

      Logger.info('PROJECT_EDITOR', 'New chapter created and saved', {
        chapterId: newChapterId,
        title: chapterTitle // 🔥 실제 사용된 제목 로그
      });
    } catch (error) {
      Logger.error('PROJECT_EDITOR', 'Chapter creation error', error);
    }
  }, [createNewTab, projectData, projectId]); // 🔥 projectId 의존성 추가

  const handleAddCharacter = useCallback(() => {
    // 인물 뷰로 직접 이동 (탭 시스템 사용하지 않음)
    setCurrentView('characters');
    Logger.info('PROJECT_EDITOR', 'Add character triggered - switched to characters view');
  }, []);

  const handleAddNote = useCallback(() => {
    // 노트 뷰로 직접 이동 (탭 시스템 사용하지 않음) 
    setCurrentView('notes');
    Logger.info('PROJECT_EDITOR', 'Add note triggered - switched to notes view');
  }, []);

  // 🔥 공유 기능 핸들러
  const handleShare = useCallback(() => {
    setShowShareDialog(true);
    Logger.info('PROJECT_EDITOR', 'Share dialog opened');
  }, []);

  // 🔥 삭제 기능 핸들러
  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
    Logger.info('PROJECT_EDITOR', 'Delete confirmation dialog opened');
  }, []);

  // 🔥 삭제 확인 핸들러
  const handleConfirmDelete = useCallback(async () => {
    try {
      Logger.info('PROJECT_EDITOR', 'Deleting project', { projectId });

      const result = await window.electronAPI.projects.delete(projectId);

      if (result.success) {
        Logger.info('PROJECT_EDITOR', 'Project deleted successfully');
        setShowDeleteDialog(false);
        // 🔥 삭제 후 대시보드로 이동
        window.history.back();
      } else {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      Logger.error('PROJECT_EDITOR', 'Failed to delete project', error);
      // TODO: 에러 토스트 표시
    }
  }, [projectId]);

  // 🔥 내보내기 기능 핸들러 (Markdown 파일로 내보내기)
  const handleDownload = useCallback(async () => {
    try {
      const content = projectData.content || '';
      const title = projectData.title || '제목없음';

      // Markdown 파일로 내보내기
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9가-힣\s]/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Logger.info('PROJECT_EDITOR', 'Project exported as markdown', { title });
    } catch (error) {
      Logger.error('PROJECT_EDITOR', 'Export failed', error);
    }
  }, [projectData.content, projectData.title]);
  // 🔥 뷰 변경 핸들러 (글쓰기만 탭 시스템 사용)
  const handleViewChange = useCallback((view: string) => {
    Logger.info('PROJECT_EDITOR', 'View changed:', view);

    if (view === 'write') {
      // 글쓰기 뷰는 탭 시스템 사용 - 메인 탭으로 전환
      const mainTab = tabs.find(tab => tab.type === 'main');
      if (mainTab) {
        switchToTab(mainTab.id);
      }
    } else {
      // 다른 뷰들(구조, 인물, 노트 등)은 직접 전환
      setCurrentView(view);
    }
  }, [tabs, switchToTab]);

  // 🔥 챕터 삭제 확인 핸들러
  const handleConfirmChapterDelete = useCallback(async () => {
    if (!chapterToDelete) return;

    await performTabClose(tabs.find(tab => tab.chapterId === chapterToDelete.id)?.id || '');
    setShowChapterDeleteDialog(false);
    setChapterToDelete(null);
  }, [chapterToDelete, tabs]);

  // 🔥 챕터 삭제 취소 핸들러
  const handleCancelChapterDelete = useCallback(() => {
    setShowChapterDeleteDialog(false);
    setChapterToDelete(null);
  }, []);

  const handleToolbarAction = useCallback((action: string) => Logger.info('PROJECT_EDITOR', 'Toolbar action:', action), []);

  // 🔥 작가 친화적 키보드 단축키 핸들러
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const modKey = ctrlKey || metaKey; // Windows: Ctrl, Mac: Cmd

    // 🔥 기본 저장 단축키 (Ctrl+S / Cmd+S)
    if (modKey && key === 's') {
      event.preventDefault();
      projectData.forceSave().then(() => {
        handleSaveSuccess(); // 🔥 저장 완료 후 탭 상태 초기화
      });
      Logger.info('PROJECT_EDITOR', 'Save shortcut triggered');
      return;
    }

    // 🔥 포커스 모드 토글 (Ctrl+F / Cmd+F)
    if (modKey && key === 'f') {
      event.preventDefault();
      uiState.toggleFocusMode();
      Logger.info('PROJECT_EDITOR', 'Focus mode shortcut triggered');
      return;
    }

    // 🔥 사이드바 토글 (Ctrl+B / Cmd+B)
    if (modKey && key === 'b') {
      event.preventDefault();
      setCollapsed(prev => !prev);
      Logger.info('PROJECT_EDITOR', 'Sidebar shortcut triggered');
      return;
    }

    // 🔥 다크모드 토글 (Ctrl+D / Cmd+D)
    if (modKey && key === 'd') {
      event.preventDefault();
      uiState.toggleDarkMode();
      Logger.info('PROJECT_EDITOR', 'Dark mode shortcut triggered');
      return;
    }

    // 🔥 ESC 키 우선순위 (QA 가이드: 다이얼로그 > 슬라이드바 > 집중모드 > 뒤로가기)
    if (key === 'Escape') {
      // 1순위: 다이얼로그가 열려있는 경우
      if (showDeleteDialog || showShareDialog) {
        // 다이얼로그는 자체적으로 ESC 처리, 여기서는 무시
        return;
      }

      // 2순위: 집중모드인 경우 집중모드 해제
      if (uiState.isFocusMode) {
        event.preventDefault();
        uiState.toggleFocusMode();
        Logger.info('PROJECT_EDITOR', 'Focus mode disabled by ESC');
        return;
      }

      // 3순위: 전역 ESC 이벤트 발생 (ProjectHeader에서 슬라이드바 처리)
      const escapeEvent = new CustomEvent('global:escape', {
        detail: { source: 'ProjectEditor' }
      });
      window.dispatchEvent(escapeEvent);

      // 4순위: 마지막 수단으로 뒤로가기
      event.preventDefault();
      handleBack();
      Logger.info('PROJECT_EDITOR', 'Back shortcut triggered');
      return;
    }

    // 🔥 단축키 도움말 (F1)
    if (key === 'F1') {
      event.preventDefault();
      const helpEvent = new CustomEvent('shortcut:help');
      window.dispatchEvent(helpEvent);
      Logger.info('PROJECT_EDITOR', 'Help shortcut triggered');
      return;
    }
  }, [projectData.forceSave, uiState.toggleFocusMode, uiState.toggleDarkMode, handleBack]);

  // 🔥 키보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 🔥 에디터 저장 이벤트 리스너 (Ctrl+S에서 발생)
  useEffect(() => {
    const handleProjectSave = () => {
      projectData.forceSave();
      Logger.info('PROJECT_EDITOR', 'Project save triggered from editor');
    };

    window.addEventListener('project:save', handleProjectSave);
    return () => window.removeEventListener('project:save', handleProjectSave);
  }, [projectData.forceSave]);

  // 🔥 데이터 로딩 상태를 기준으로 로딩 화면 표시 (무한 로딩 문제 해결)
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center text-red-500">오류: {error}</div>;
  }

  return (
    <EditorProvider>
      <div className={WRITER_EDITOR_STYLES.container}>
        {/* 🔥 모듈화된 ProjectHeader 사용 */}
        <ProjectHeader
          title={projectData.title}
          onTitleChange={projectData.setTitle}
          onBack={handleBack}
          sidebarCollapsed={collapsed}
          onToggleSidebar={handleToggleSidebar}
          showRightSidebar={showRightSidebar}
          onToggleAISidebar={handleToggleAISidebar}
          isFocusMode={uiState.isFocusMode}
          onToggleFocusMode={uiState.toggleFocusMode}
          onSave={projectData.forceSave}
          onShare={handleShare}
          onDownload={handleDownload}
          onDelete={handleDelete}
          // 🔥 Google Docs 관련 props 추가
          isGoogleDocsProject={isGoogleDocsProject}
          googleDocMeta={googleDocMeta}
          isSyncingWithGoogle={isSyncingWithGoogle}
          onSyncWithGoogle={syncWithGoogleDocs}
          onOpenGoogleDocs={openGoogleDocsExternal}
        />

        {/* 🔥 Chrome 스타일 탭 바 (글쓰기 관련 뷰에서 표시) */}
        {['write', 'structure'].includes(currentView) && (
          <EditorTabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabClick={switchToTab}
            onTabClose={closeTab}
            onNewTab={() => createNewTab('chapter', `새 챕터 ${nextTabOrder}`)}
            onTabReorder={handleTabReorder}
          />
        )}

        {/* 🔥 메인 영역 */}
        <div className={WRITER_EDITOR_STYLES.main}>
          {/* 🔥 모듈화된 WriterSidebar 사용 */}
          {!collapsed && (
            <WriterSidebar
              projectId={projectId} // 🔥 projectId 전달
              currentView={currentView}
              onViewChange={handleViewChange}
              structure={projectData.structure}
              characters={projectData.characters}
              stats={projectData.writerStats}
              collapsed={false}
              onAddStructure={handleAddStructure}
              onAddCharacter={handleAddCharacter}
              onAddNote={handleAddNote}
            />
          )}

          {/* 🔥 뷰 전환 영역 - WriterSidebar와 연동 */}
          <div className={WRITER_EDITOR_STYLES.editorContainer}>
            {currentView === 'write' && (
              <WriteView
                content={getCurrentTabContent()}
                onChange={updateCurrentTabContent}
                isFocusMode={uiState.isFocusMode}
              />
            )}
            {currentView === 'structure' && (
              <StructureView
                projectId={projectId}
                onNavigateToChapterEdit={handleNavigateToChapterEdit}
                onNavigateToSynopsisEdit={handleNavigateToSynopsisEdit}
                onNavigateToIdeaEdit={handleNavigateToIdeaEdit}
                onAddNewChapter={() => setShowNewChapterModal(true)}
              />
            )}
            {currentView === 'characters' && (
              <CharactersView
                projectId={projectId}
                characters={projectData.characters}
                onCharactersChange={projectData.setCharacters}
              />
            )}
            {currentView === 'notes' && (
              <NotesView
                projectId={projectId}
                notes={projectData.notes || []}
                onNotesChange={projectData.setNotes}
              />
            )}
            {currentView === 'synopsis' && (
              <SynopsisView
                synopsisId={editingItemId}
                onBack={handleBackToStructure}
              />
            )}
            {currentView === 'idea' && (
              <IdeaView
                ideaId={editingItemId}
                onBack={handleBackToStructure}
              />
            )}
          </div>

          {/* 🔥 AI 창작 파트너 사이드바 (우측) */}
          <WriterStatsPanel
            showRightSidebar={showRightSidebar}
            toggleRightSidebar={handleToggleAISidebar}
            writerStats={projectData.writerStats}
            setWordGoal={projectData.setWordGoal}
            currentText={projectData.content}
            projectId={projectId}
          />
        </div>
      </div>

      {/* 🔥 단축키 도움말 (우측 하단 고정) */}
      <ShortcutHelp />

      {/* 🔥 삭제 확인 다이얼로그 */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        projectTitle={projectData.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* 🔥 공유 다이얼로그 */}
      <ShareDialog
        isOpen={showShareDialog}
        projectTitle={projectData.title}
        projectId={projectId}
        onClose={() => setShowShareDialog(false)}
      />

      {/* 🔥 NEW: 새 챕터 생성 모달 */}
      <NewChapterModal
        isOpen={showNewChapterModal}
        onClose={() => setShowNewChapterModal(false)}
        onConfirm={handleCreateNewChapter}
        defaultTitle="새로운 챕터"
      />

      {/* 🔥 챕터 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showChapterDeleteDialog}
        title="챕터 삭제"
        message="이 챕터를 삭제하시겠습니까?"
        itemName={chapterToDelete?.title}
        warning="삭제된 챕터는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmChapterDelete}
        onCancel={handleCancelChapterDelete}
      />
    </EditorProvider>
  );
});
