'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Logger } from '../../../../shared/logger';
import { calculateWriterStats, type WriterStats as WriterStatsType } from '../editor/WriterStats';
import { useAutoSave } from './useAutoSave';
import { ProjectCharacter, ProjectStructure, ProjectNote } from '../../../../shared/types';
import useStructureStore from '../../../stores/useStructureStore'; // 🔥 스토어 import 추가

// 저장 상태 타입
type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'error';

interface UseProjectDataReturn {
  // 🔥 로딩 및 에러 상태
  isLoading: boolean;
  error: string | null;

  // 프로젝트 상태
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  chapters: string; // JSON 문자열
  setChapters: (chapters: string) => void;
  lastSaved: Date | null;
  saveStatus: SaveStatus;

  // 작가 데이터
  characters: ProjectCharacter[];
  setCharacters: (characters: ProjectCharacter[]) => void;
  structure: ProjectStructure[];
  setStructure: (structure: ProjectStructure[]) => void;
  notes: ProjectNote[]; // 🔥 notes 추가
  setNotes: (notes: ProjectNote[]) => void; // 🔥 setNotes 추가
  writerStats: WriterStatsType;

  // 액션
  loadProject: () => Promise<void>;
  saveProject: () => Promise<void>;
  forceSave: () => Promise<void>; // 🔥 즉시 저장 (Ctrl+S)
  updateWriterStats: () => void;
  setWordGoal: (goal: number) => void;
}

export function useProjectData(projectId: string): UseProjectDataReturn {
  const sessionStartRef = useRef<number>(Date.now());

  // 🔥 성능 최적화: 기본 날짜 메모이제이션 (new Date() 반복 생성 방지)
  const defaultDate = useMemo(() => new Date(), []);

  // 🔥 성능 최적화: 기본 데이터 메모이제이션 (중복 객체 생성 방지)
  const defaultCharacters = useMemo(() => [
    {
      id: '1',
      projectId: projectId,
      name: '주인공',
      role: '주요 인물',
      notes: '용감하고 정의로운 성격',
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '2',
      projectId: projectId,
      name: '조력자',
      role: '조력자',
      notes: '지혜롭고 경험이 많음',
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '3',
      projectId: projectId,
      name: '적대자',
      role: '적대자',
      notes: '야망이 크고 냉혹함',
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
  ], [projectId, defaultDate]);

  const defaultNotes = useMemo(() => [
    {
      id: '1',
      projectId: projectId,
      title: '첫 번째 메모',
      content: '이야기의 핵심 아이디어를 여기에 적어보세요.',
      tags: ['아이디어'],
  color: 'var(--accent-primary)',
      isPinned: false,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '2',
      projectId: projectId,
      title: '설정 노트',
      content: '세계관, 배경 설정에 대한 내용을 정리합니다.',
      tags: ['설정', '세계관'],
  color: 'var(--success)',
      isPinned: true,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
  ], [projectId, defaultDate]);

  const defaultStructure = useMemo(() => [
    {
      id: '1',
      projectId: projectId,
      type: 'chapter' as const,
      title: '1챕터: 시작',
      isActive: true,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '2',
      projectId: projectId,
      type: 'synopsis' as const,
      title: '첫 번째 장면',
      isActive: true,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '3',
      projectId: projectId,
      type: 'synopsis' as const,
      title: '두 번째 장면',
      isActive: true,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '4',
      projectId: projectId,
      type: 'chapter' as const,
      title: '2챕터: 전개',
      isActive: true,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '5',
      projectId: projectId,
      type: 'synopsis' as const,
      title: '세 번째 장면',
      isActive: true,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
    {
      id: '6',
      projectId: projectId,
      type: 'idea' as const,
      title: '아이디어 메모',
      isActive: true,
      createdAt: defaultDate,
      updatedAt: defaultDate
    },
  ], [projectId, defaultDate]);

  // 🔥 로딩 및 에러 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 기본 프로젝트 상태
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [chapters, setChapters] = useState<string>('{}'); // JSON 문자열
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // 🔥 ref로 최신 값 추적 (성능 최적화: useEffect 제거)
  const titleRef = useRef<string>('');
  const contentRef = useRef<string>('');
  const chaptersRef = useRef<string>('{}'); // 🔥 chapters ref 추가

  // 🔥 최적화: setter에서 직접 ref 업데이트 (useEffect 불필요)
  const setTitleOptimized = useCallback((newTitle: string) => {
    titleRef.current = newTitle;
    setTitle(newTitle);
  }, []);

  const setContentOptimized = useCallback((newContent: string) => {
    contentRef.current = newContent;
    setContent(newContent);
  }, []);

  const setChaptersOptimized = useCallback((newChapters: string) => {
    Logger.debug('PROJECT_DATA', 'setChaptersOptimized called', { newChaptersLength: newChapters.length });
    chaptersRef.current = newChapters;
    setChapters(newChapters);
    Logger.debug('PROJECT_DATA', 'setChaptersOptimized completed', { updatedRefLength: chaptersRef.current.length });
  }, []);

  // 🔥 작가 데이터
  const [characters, setCharacters] = useState<ProjectCharacter[]>([]);
  const [structure, setStructure] = useState<ProjectStructure[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]); // 🔥 notes 상태 추가
  const [writerStats, setWriterStats] = useState<WriterStatsType>({
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0,
    readingTime: 0,
    wordGoal: 1000,
    progress: 0,
    sessionTime: 0,
    wpm: 0
  });

  // 🔥 프로젝트 로드 (무한루프 방지)
  const loadProject = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      Logger.debug('PROJECT_DATA', 'Loading project', { projectId });
      // retry helper: 짧은 지연으로 재시도 (DB 동기화 지연 대응)
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      const maxAttempts = 4;
      let attempt = 0;
      let result: { success: boolean; data?: any; error?: string } | null = null;
      while (attempt < maxAttempts) {
        attempt += 1;
        try {
          result = await window.electronAPI.projects.getById(projectId);
          // 성공적으로 데이터를 받았거나 다른 에러가 발생하면 루프 종료
          if (result?.success) break;
          // 프로젝트를 찾을 수 없다는 에러인 경우에만 재시도
          if (!(result && result.error && String(result.error).includes('찾을 수 없습니다'))) {
            break;
          }
          Logger.debug('PROJECT_DATA', `Project not found, retrying (${attempt}/${maxAttempts})`, { projectId });
        } catch (err) {
          Logger.warn('PROJECT_DATA', `Attempt ${attempt} failed`, err);
        }

        // 지수적 백오프: 100ms, 200ms, 400ms...
        await sleep(100 * Math.pow(2, attempt - 1));
      }


      // result는 위에서 설정된 값
      if (result && result.success && result.data) {
        setTitle(result.data.title);
        setContent(result.data.content || '');

        // 🔥 chapters 데이터 로드 및 ref 동기화
        const chaptersData = result.data.chapters || '{}';
        setChapters(chaptersData);
        chaptersRef.current = chaptersData; // ref도 동기화

        setLastSaved(new Date(result.data.lastModified));
        setSaveStatus('saved'); // 🔥 저장 상태 업데이트

        // 🔥 실제 데이터 로드 - 캐릭터 데이터
        try {
          const charactersResult = await window.electronAPI.projects.getCharacters(projectId);
          if (charactersResult.success && charactersResult.data) {
            setCharacters(charactersResult.data);
            Logger.debug('PROJECT_DATA', 'Characters loaded successfully', { count: charactersResult.data.length });
          } else {
            Logger.warn('PROJECT_DATA', 'No characters found, using defaults');
            // 기본 캐릭터 데이터
            setCharacters(defaultCharacters);
          }
        } catch (error) {
          Logger.warn('PROJECT_DATA', 'Failed to load characters, using defaults', error);
          setCharacters(defaultCharacters);
        }

        // 🔥 실제 데이터 로드 - 구조 데이터
        try {
          const structureResult = await window.electronAPI.projects.getStructure(projectId);
          if (structureResult.success && structureResult.data) {
            setStructure(structureResult.data);
            // 🔥 DB 데이터를 Zustand 스토어에 동기화
            useStructureStore.getState().setStructures(projectId, structureResult.data);
            Logger.debug('PROJECT_DATA', 'Structure loaded and synced to store', { count: structureResult.data.length });
          } else {
            Logger.warn('PROJECT_DATA', 'No structure found, using defaults');
            // 기본 구조 데이터
            setStructure(defaultStructure);
          }
        } catch (error) {
          Logger.warn('PROJECT_DATA', 'Failed to load structure, using defaults', error);
          setStructure(defaultStructure);
        }

        // 🔥 실제 데이터 로드 - 노트 데이터
        try {
          const notesResult = await window.electronAPI.projects.getNotes(projectId);
          if (notesResult.success && notesResult.data) {
            setNotes(notesResult.data);
            Logger.debug('PROJECT_DATA', 'Notes loaded successfully', { count: notesResult.data.length });
          } else {
            Logger.warn('PROJECT_DATA', 'No notes found, using defaults');
            // 기본 노트 데이터
            setNotes(defaultNotes);
          }
        } catch (error) {
          Logger.warn('PROJECT_DATA', 'Failed to load notes, using defaults', error);
          setNotes(defaultNotes);
        }

        Logger.info('PROJECT_DATA', 'Project loaded successfully');
      } else {
        // 🔥 프로젝트가 존재하지 않는 경우 처리 개선
        const errorMsg = result?.error || 'Failed to load project';
        Logger.error('PROJECT_DATA', 'Project not found or failed to load', { projectId, error: errorMsg });

        // 🔥 프로젝트가 삭제되었거나 존재하지 않는 경우 프로젝트 목록으로 리다이렉트
        if (errorMsg.includes('찾을 수 없습니다') || errorMsg.includes('not found')) {
          Logger.info('PROJECT_DATA', 'Project does not exist, redirecting to projects page');
          // 브라우저 히스토리를 통해 프로젝트 목록으로 이동
          window.location.href = '/projects';
          return;
        }

        throw new Error(errorMsg);
      }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error loading project', error);
      setError(error instanceof Error ? error.message : 'Failed to load project');

      // 🔥 실패 시 로컬 백업 확인
      try {
        const backup = localStorage.getItem(`project_backup_${projectId}`);
        if (backup) {
          const backupData = JSON.parse(backup);
          setTitle(backupData.title || '');
          setContent(backupData.content || '');
          setSaveStatus('unsaved');
          Logger.info('PROJECT_DATA', 'Loaded from local backup');
        }
      } catch (storageError) {
        Logger.error('PROJECT_DATA', 'Failed to load backup', storageError);
      }
    } finally {
      setIsLoading(false); // 🔥 무조건 로딩 상태 해제
    }
  }, [projectId]);

  // 🔥 프로젝트 저장 함수 (ref로 무한루프 방지)
  const saveProjectInternal = useCallback(async (): Promise<void> => {
    try {
      const currentTitle = titleRef.current;
      const currentContent = contentRef.current;
      const currentChapters = chaptersRef.current; // 🔥 ref에서 최신 chapters 가져오기

      if (!currentTitle.trim() && !currentContent.trim()) return;

      Logger.debug('PROJECT_DATA', 'Saving project to server', { projectId });

      // 🔥 로컬 백업 먼저 저장 (즉시)
      try {
        const backupData = { title: currentTitle, content: currentContent, chapters: currentChapters, lastModified: new Date() };
        localStorage.setItem(`project_backup_${projectId}`, JSON.stringify(backupData));
        Logger.debug('PROJECT_DATA', 'Local backup saved');
      } catch (storageError) {
        Logger.warn('PROJECT_DATA', 'Failed to save local backup', storageError);
      }

      // 🔥 즉시 서버 저장
      const payload: {
        title: string;
        content: string;
        chapters?: string;
        lastModified: Date;
      } = {
        title: currentTitle,
        content: currentContent,
        chapters: currentChapters, // 🔥 ref에서 가져온 최신 chapters 사용
        lastModified: new Date()
      };

      Logger.debug('PROJECT_DATA', 'Saving payload to server', {
        chaptersLength: currentChapters.length,
        chaptersPreview: currentChapters.substring(0, 100),
        payloadKeys: Object.keys(payload)
      });

      // 🔥 저장 전 프로젝트 존재 여부 확인
      try {
        const existsResult = await window.electronAPI.projects.getById(projectId);
        if (!existsResult.success) {
          Logger.error('PROJECT_DATA', 'Cannot save: project does not exist', { projectId });
          throw new Error('프로젝트가 존재하지 않습니다. 프로젝트 목록으로 이동합니다.');
        }
      } catch (checkError) {
        Logger.error('PROJECT_DATA', 'Project existence check failed', checkError);
        // 프로젝트가 존재하지 않는 경우 리다이렉트
        window.location.href = '/projects';
        throw new Error('프로젝트를 찾을 수 없어 저장할 수 없습니다.');
      }

      const result = await window.electronAPI.projects.update(projectId, payload);

      if (result.success) {
        setLastSaved(new Date());
        setSaveStatus('saved');
        Logger.info('PROJECT_DATA', 'Project saved successfully to server', {
          hasChapters: !!currentChapters && currentChapters !== '{}'
        });

        // 성공 시 로컬 백업 제거
        try {
          localStorage.removeItem(`project_backup_${projectId}`);
        } catch (e) {
          // 무시
        }
      } else {
        throw new Error(result.error || 'Failed to save project');
      }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error saving project', error);
      setSaveStatus('error');
      throw error;
    }
  }, [projectId]); // 🔥 projectId만 dependency로 설정

  // 🔥 노션 스타일 autoSave Hook 사용 - 타이핑 중단 후 저장
  const { debouncedSave, forceSave, isLoading: isSaving } = useAutoSave({
    projectId,
    delay: 3000, // 🔥 3초 딜레이 (더 안전한 타이핑) - 타이핑 멈춘 후에만 저장
    onSave: saveProjectInternal,
    onSaveSuccess: () => {
      setSaveStatus('saved');
      setLastSaved(new Date());
      Logger.info('PROJECT_DATA', '✅ 자동 저장 완료', { projectId });
    },
    onSaveError: (error: Error) => {
      setSaveStatus('error');
      Logger.error('PROJECT_DATA', '❌ 자동 저장 실패', { error: error.message, projectId });

      // 에러 발생 시 로컬 백업 생성
      try {
        localStorage.setItem(`project_backup_${projectId}`, JSON.stringify({ title, content }));
        Logger.info('PROJECT_DATA', '📦 로컬 백업 저장됨', { projectId });
      } catch (backupError) {
        Logger.error('PROJECT_DATA', '❌ 로컬 백업 실패', backupError);
      }
    }
  });

  // 🔥 호환성을 위한 saveProject 함수
  const saveProject = useCallback(async (): Promise<void> => {
    await forceSave();
  }, [forceSave]);

  // 🔥 비용이 큰 통계 계산을 메모이제이션 (Hook 규칙 준수)
  const memoizedStats = useMemo(() => {
    if (!content) return writerStats;
    return calculateWriterStats(content, writerStats.wordGoal, sessionStartRef.current);
  }, [content, writerStats.wordGoal, writerStats]);

  // 🔥 작가 통계 업데이트 (메모이제이션된 값 사용)
  const updateWriterStats = useCallback((): void => {
    setWriterStats(memoizedStats);
  }, [memoizedStats]);

  const setWordGoal = useCallback((goal: number): void => {
    setWriterStats((prev: WriterStatsType) => ({
      ...prev,
      wordGoal: goal,
      progress: Math.min(100, Math.round((prev.wordCount / goal) * 100))
    }));
  }, []);

  // 🔥 프로젝트 초기 로드 (성능 최적화: loadProject를 useRef로 안전하게 관리)
  const loadProjectRef = useRef(loadProject);
  loadProjectRef.current = loadProject;

  useEffect(() => {
    if (projectId) {
      loadProjectRef.current();
    }
  }, [projectId]); // 🔥 projectId만 dependency로 - 무한루프 완전 방지

  // 🔥 자동 저장 시스템 (성능 최적화: ref로 무한루프 방지)
  const debouncedSaveRef = useRef(debouncedSave);
  debouncedSaveRef.current = debouncedSave;

  useEffect(() => {
    // 🔥 JSON 문자열 검증: 빈 객체가 아닌 실제 데이터가 있을 때만 저장
    const hasRealChapters = (() => {
      try {
        const parsed = JSON.parse(chapters);
        return Object.keys(parsed).length > 0;
      } catch {
        return false;
      }
    })();

    if (title.trim() || content.trim() || hasRealChapters) {
      setSaveStatus('unsaved');
      debouncedSaveRef.current(); // ref를 통해 안전하게 호출
    }
  }, [title, content, chapters]); // 🔥 chapters 추가로 auto-save 트리거

  // 🔥 저장 중 상태 관리
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    }
  }, [isSaving]);

  // 🔥 통계 업데이트 (기가차드 수정: interval 제거로 커서 리셋 완전 해결)
  useEffect(() => {
    updateWriterStats();
    // 🔥 30초 interval 완전 제거 - 커서 리셋 원인 제거
    // 세션 시간은 사용자가 통계를 볼 때만 계산하도록 변경
  }, []); // 🔥 dependency 완전 제거 - useEffect 지옥 해결

  // 🔥 캐릭터 저장 함수
  const saveCharacters = useCallback(async (charactersToSave: ProjectCharacter[]): Promise<void> => {
    try {
      Logger.debug('PROJECT_DATA', 'Saving characters', { count: charactersToSave.length });

      // 🔥 실제 API 호출
      const result = await window.electronAPI.projects.updateCharacters(projectId, charactersToSave);

      if (result.success) {
        Logger.info('PROJECT_DATA', 'Characters saved successfully');
      } else {
        throw new Error(result.error || 'Failed to save characters');
      }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error saving characters', error);
      throw error;
    }
  }, [projectId]);

  // 🔥 메모 저장 함수
  const saveNotes = useCallback(async (notesToSave: ProjectNote[]): Promise<void> => {
    try {
      Logger.debug('PROJECT_DATA', 'Saving notes', { count: notesToSave.length });

      // 🔥 실제 API 호출
      const result = await window.electronAPI.projects.updateNotes(projectId, notesToSave);

      if (result.success) {
        Logger.info('PROJECT_DATA', 'Notes saved successfully');
      } else {
        throw new Error(result.error || 'Failed to save notes');
      }
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Error saving notes', error);
      throw error;
    }
  }, [projectId]);

  // 🔥 캐릭터 변경 핸들러 (자동 저장 포함)
  const handleCharactersChange = useCallback(async (newCharacters: ProjectCharacter[]): Promise<void> => {
    setCharacters(newCharacters);

    try {
      await saveCharacters(newCharacters);
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Failed to save characters automatically', error);
      // 사용자에게 에러 표시할 수 있음
    }
  }, [saveCharacters]);

  // 🔥 메모 변경 핸들러 (자동 저장 포함)  
  const handleNotesChange = useCallback(async (newNotes: ProjectNote[]): Promise<void> => {
    setNotes(newNotes);

    try {
      await saveNotes(newNotes);
    } catch (error) {
      Logger.error('PROJECT_DATA', 'Failed to save notes automatically', error);
      // 사용자에게 에러 표시할 수 있음
    }
  }, [saveNotes]);

  return {
    // 🔥 로딩 및 에러 상태
    isLoading,
    error,

    // 🔥 기본 프로젝트 데이터 (성능 최적화된 setter)
    title,
    setTitle: setTitleOptimized,
    content,
    setContent: setContentOptimized,
    chapters,
    setChapters: setChaptersOptimized, // 🔥 최적화된 setter 사용
    lastSaved,
    saveStatus,

    // 🔥 작가 데이터
    characters,
    setCharacters,
    structure,
    setStructure,
    notes, // 🔥 notes 추가
    setNotes, // 🔥 setNotes 추가
    writerStats,

    // 🔥 액션 함수들
    loadProject,
    saveProject,
    forceSave, // 🔥 새로운 즉시 저장 함수
    updateWriterStats,
    setWordGoal
  };
}
