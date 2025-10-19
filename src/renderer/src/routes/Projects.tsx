'use client';

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ProjectGrid } from '../../components/projects/ProjectGrid';
import { ProjectCreator, type ProjectCreationData } from '../../components/projects/ProjectCreator';
import { ProjectEditorModal } from '../../components/projects/ProjectEditorModal';
import { ConfirmDeleteDialog } from '../../components/projects/components/ConfirmDeleteDialog';
import { type ProjectData } from '../../components/projects/ProjectCard';
import { Logger } from '../../../shared/logger';
import { useGuidedTour } from '../../modules/tutorial/useGuidedTour';
import { useTutorial } from '../../modules/tutorial/useTutorial';
import type { KoreanWebNovelGenre, ProjectStatus } from '../../../shared/constants/enums';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROJECTS_PAGE_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-7xl',
  loading: 'flex items-center justify-center min-h-96',
  loadingText: 'text-lg text-slate-600 dark:text-slate-400',
  error: 'flex flex-col items-center justify-center min-h-96 text-center',
  errorTitle: 'text-xl font-semibold text-red-600 dark:text-red-400 mb-2',
  errorMessage: 'text-slate-600 dark:text-slate-400 mb-4',
  retryButton: 'mt-4 px-4 py-2 rounded-lg bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--text-inverse,#ffffff)] transition-colors',
} as const;

// 🔥 기가차드 규칙: BE 연동을 위한 기본값 (로딩 중 사용)
const DEFAULT_PROJECTS: readonly ProjectData[] = [] as const;

// 🔥 Suspense 래핑된 컴포넌트
function ProjectsPageContent(): React.ReactElement {
  const navigate = useNavigate(); // 🔥 Navigation 훅 추가
  const [searchParams] = useSearchParams(); // 🔥 URL 쿼리 파라미터 감지
  const location = useLocation();
  
  // 🔥 매우 명확한 초기 로그 (여러 번 출력되는지 확인)
  Logger.info('PROJECTS_PAGE', '✅ ✅ ✅ Projects.tsx RENDERED ✅ ✅ ✅');
  
  // 🔥 튜토리얼 시스템 (Projects 페이지에서도 필요!)
  useGuidedTour();
  const { startTutorial, isActive, closeTutorial } = useTutorial();
  
  const [projects, setProjects] = useState<readonly ProjectData[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState<boolean>(false);
  // 🔥 중요: isCreateFlow는 매번 searchParams에서 계산 (state 유지 방지)
  const isCreateFlow = searchParams.get('create') === 'true';
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectData | null>(null);
  
  // 🔥 진행 중인 튜토리얼 시작 타이머 추적 (수동 열기 시 취소하기 위함)
  const tutorialStartTimerRef = useRef<number | null>(null);

  // 🔥 URL 쿼리 파라미터에서 create=true 감지 시 자동으로 생성 다이얼로그 열기
  // ⚠️ 중요: isCreateFlow는 이제 const로 계산되므로, 이 effect를 간단히 수정
  // URL ?create=true 감지 시 모달 자동 열기
  useEffect(() => {
    if (isCreateFlow && !showCreator) {
      Logger.info('PROJECTS_PAGE', `🚀 Auto-opening project creator from URL parameter (create=true)`);
      setShowCreator(true);
    }
  }, [isCreateFlow]);

  // 🔥 showCreator가 true가 되면, 수동으로 연 경우 튜토리얼 종료
  // ?create=true인 경우에는 자동으로 열린 것이므로 아무것도 안 함
  // 🔥 중요: 튜토리얼이 활성화되어 있으면 이 effect를 무시 (isActive=true일 때)
  useEffect(() => {
    console.log(`[DEBUG] showCreator=${showCreator}, isCreateFlow=${isCreateFlow}, isActive=${isActive}`);
    
    if (showCreator && !isCreateFlow && !isActive) {
      // 🔥 수동으로 모달을 연 경우 (isCreateFlow=false, 튜토리얼 비활성)
      console.log(`[DEBUG] >>> MANUAL OPEN - STOPPING TUTORIAL <<<`);
      
      // 진행 중인 튜토리얼 시작 타이머 취소
      if (tutorialStartTimerRef.current) {
        clearTimeout(tutorialStartTimerRef.current);
        tutorialStartTimerRef.current = null;
        Logger.info('PROJECTS_PAGE', '⏹️ Cancelled pending tutorial timer');
      }
      
      // 🔥 명시적으로 현재 튜토리얼을 즉시 종료
      // 중요: useGuidedTour가 복구하지 못하도록 Context를 명확히 초기화해야 함
      Logger.info('PROJECTS_PAGE', '⏹️ Explicitly closing any active tutorial - manual modal open');
      closeTutorial();
    }
  }, [showCreator, isCreateFlow, isActive, closeTutorial]);

  // 🔥 Projects 튜토리얼이 시작되면 ProjectCreator 모달 자동 열기
  // (Dashboard 튜토리얼에서 전환된 경우)
  useEffect(() => {
    if (isActive && !showCreator && !isCreateFlow) {
      Logger.info('PROJECTS_PAGE', '🚀 Projects tutorial started - auto-opening ProjectCreator modal');
      setShowCreator(true);
    }
  }, [isActive]);

  // 🔥 기가차드 규칙: 이펙트로 데이터 로딩
  useEffect(() => {
    loadProjects();
  }, []);

  // 🔥 앱으로 복귀/탭 포커스 시 목록 새로고침 (생성 후 뒤로가기 등 반영)
  useEffect(() => {
    const onFocus = () => {
      Logger.debug('PROJECTS_PAGE', 'Window focused - refreshing projects');
      loadProjects();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        Logger.debug('PROJECTS_PAGE', 'Document visible - refreshing projects');
        loadProjects();
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  /**
   * 🔥 실제 프로젝트 데이터 로딩 (BE 연동) - 더미 데이터 제거
   */
  const loadProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // 🔥 기가차드 규칙: 타입 안전한 IPC 통신
      const result = await window.electronAPI?.projects?.getAll();

      // 🔥 에러 처리 - IPC 응답 검증
      if (!result?.success) {
        throw new Error(result?.error || 'Projects API failed');
      }

      // 🔥 BE 데이터를 FE 형식으로 변환
      const projectsData = (result.data || []).map(p => ({
        ...p,
        description: p.description || '', // 🔥 undefined 방지
        status: (p.status || 'draft') as ProjectData['status'] // 🔥 타입 안전성
      })) as ProjectData[];
      setProjects(projectsData);

      Logger.info('PROJECTS_PAGE', `✅ Loaded ${projectsData.length} projects successfully`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      Logger.error('PROJECTS_PAGE', '❌ Failed to load projects', err);
      // 🔥 에러 시에도 기본값 사용
      setProjects(DEFAULT_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔥 프로젝트 생성 핸들러
   */
    const handleCreateProject = useCallback(async (data: ProjectCreationData): Promise<void> => {
    try {
      setLoading(true);
      Logger.info('PROJECTS_PAGE', '� Creating new project', data);
      
      // 🔥 ProjectCreationData를 Project 타입으로 변환
      const projectData = {
        title: data.title,
        description: data.description,
        genre: (data.genre || 'unknown') as KoreanWebNovelGenre,
        platform: data.platform,
        content: data.content || '',
        status: 'active' as ProjectStatus,
        progress: 0,
        wordCount: 0,
        author: 'Unknown', // 🔥 필수 필드 추가 (추후 유저 정보로 대체)
        updatedAt: new Date(),
      };
      
      // 🔥 electronAPI를 통한 프로젝트 생성
      const result = await window.electronAPI?.projects?.create(projectData);
      
      if (result?.success && result.data) {
        const newProject = result.data;
        setProjects(prev => [newProject as ProjectData, ...prev]);
        setShowCreator(false);
        // 🔥 isCreateFlow는 const이므로 리셋 불필요 (URL 정리로 자동 처리)
        Logger.info('PROJECTS_PAGE', '✅ Project created successfully', { id: newProject.id });
        
        // 🔥 URL 정리 (create 파라미터 제거)
        const params = new URLSearchParams(location.search);
        if (params.has('create')) {
          params.delete('create');
          const paramsString = params.toString();
          navigate(`${location.pathname}${paramsString ? `?${paramsString}` : ''}`, { replace: true });
        }
        
        // 🔥 생성된 프로젝트로 자동 리다이렉트
        navigate(`/projects/${newProject.id}`);
      } else {
        throw new Error(result?.error || 'Failed to create project');
      }
    } catch (error) {
      Logger.error('PROJECTS_PAGE', 'Failed to create project', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * 🔥 프로젝트 수정 핸들러
   */
  const handleUpdateProject = async (updates: Partial<ProjectData>): Promise<void> => {
    if (!editingProject) return;

    try {
      Logger.info('PROJECTS_PAGE', '🔄 Updating project', { id: editingProject.id, updates });

      const result = await window.electronAPI?.projects?.update(editingProject.id, updates as any);

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to update project');
      }

      // 🔥 목록에서 해당 프로젝트 업데이트
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...updates } : p));
      setEditingProject(null);

      Logger.info('PROJECTS_PAGE', '✅ Project updated successfully', { id: editingProject.id });

    } catch (err) {
      Logger.error('PROJECTS_PAGE', '❌ Failed to update project', err);
      throw err;
    }
  };

  /**
   * 🔥 프로젝트 삭제 요청 핸들러 (모달 띄우기)
   */
  const handleDeleteProject = (project: ProjectData): void => {
    setDeletingProject(project);
    Logger.info('PROJECTS_PAGE', '🗑️ Delete confirmation requested', { id: project.id, title: project.title });
  };

  /**
   * 🔥 프로젝트 삭제 확인 핸들러 (실제 삭제)
   */
  const confirmDeleteProject = useCallback(async (): Promise<void> => {
    if (!deletingProject) return;

    try {
      Logger.info('PROJECTS_PAGE', '🗑️ Deleting project', { id: deletingProject.id });

      const result = await window.electronAPI?.projects?.delete(deletingProject.id);

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to delete project');
      }

      // 🔥 목록에서 해당 프로젝트 제거
      setProjects(prev => prev.filter(p => p.id !== deletingProject.id));
      setDeletingProject(null);

      Logger.info('PROJECTS_PAGE', '✅ Project deleted successfully', { id: deletingProject.id });

    } catch (err) {
      Logger.error('PROJECTS_PAGE', '❌ Failed to delete project', err);
      setDeletingProject(null);
      throw err;
    }
  }, [deletingProject]);

  /**
   * 🔥 프로젝트 선택 핸들러 (상세 페이지로 이동)
   */
  const handleSelectProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', '🎯 Opening project', { id: project.id, title: project.title });
    navigate(`/projects/${project.id}`);
  };

  /**
   * 🔥 로컬 파일에서 프로젝트 가져오기
   */
  const handleImportFromFile = useCallback(async (): Promise<void> => {
    try {
      Logger.info('PROJECTS_PAGE', '📁 Starting file import');
      
      // 파일 선택 다이얼로그 열기
      if (typeof window !== 'undefined' && window.electronAPI) {
        const result = await window.electronAPI.projects.importFile();
        
        if (result.success) {
          Logger.info('PROJECTS_PAGE', '✅ File imported successfully', result.data);
          // 프로젝트 목록 새로고침
          await loadProjects();
          
          // 🔥 생성된 프로젝트로 리다이렉트
          if (result.data && result.data.id) {
            Logger.info('PROJECTS_PAGE', '🔄 Redirecting to imported project', { id: result.data.id });
            navigate(`/projects/${result.data.id}`);
          }
        } else {
          Logger.error('PROJECTS_PAGE', '❌ File import failed', result.error);
          setError(result.error || '파일 가져오기에 실패했습니다.');
        }
      }
    } catch (err) {
      Logger.error('PROJECTS_PAGE', '❌ File import error', err);
      setError('파일 가져오기 중 오류가 발생했습니다.');
    }
  }, []);

  /**
   * 🔥 Google Docs에서 프로젝트 가져오기
   */
  const handleImportFromGoogleDocs = useCallback(async (): Promise<void> => {
    try {
      Logger.info('PROJECTS_PAGE', '📄 Starting Google Docs import');
      
      if (typeof window !== 'undefined' && window.electronAPI) {
        // 1️⃣ OAuth 연결 상태 확인
        const connectionStatus = await window.electronAPI.googleOAuth?.checkConnection();
        
        if (!connectionStatus?.success || !connectionStatus.data?.isConnected) {
          Logger.info('PROJECTS_PAGE', '🔐 Not connected to Google - starting OAuth');
          
          // OAuth 인증 시작
          const authResult = await window.electronAPI.googleOAuth?.startAuth();
          if (!authResult?.success) {
            setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
            return;
          }
          
          Logger.info('PROJECTS_PAGE', '✅ Google OAuth authentication completed');
        }
        
        // 2️⃣ Google Docs 문서 목록 조회
        const docsResult = await window.electronAPI.googleOAuth?.listDocuments();
        
        if (!docsResult?.success || !docsResult.data || docsResult.data.length === 0) {
          setError('Google Docs 문서를 찾을 수 없습니다.');
          return;
        }
        
        // 3️⃣ 첫 번째 문서 선택 (임시 - 나중에 선택 UI 추가)
        const selectedDoc = docsResult.data[0];
        
        // 🔥 Null check 추가
        if (!selectedDoc || !selectedDoc.id || !selectedDoc.name) {
          setError('선택한 Google Docs 문서 정보가 올바르지 않습니다.');
          return;
        }
        
        Logger.info('PROJECTS_PAGE', `📝 Selected Google Doc: ${selectedDoc.name} (${selectedDoc.id})`);
        
        // 4️⃣ 프로젝트 생성 데이터 준비
        const projectData = {
          title: selectedDoc.name,
          description: `[Google Docs 연동 정보: ${JSON.stringify({
            googleDocId: selectedDoc.id,
            googleDocUrl: selectedDoc.webViewLink || '',
            originalDescription: '',
            isGoogleDocsProject: true
          })}]`,
          genre: 'unknown' as KoreanWebNovelGenre,
          platform: 'google-docs',
          content: '',
          progress: 0,
          status: 'active' as ProjectStatus,
          wordCount: 0,
          author: connectionStatus?.data?.email || 'Unknown',
        };
        
        // 5️⃣ 프로젝트 생성
        const createResult = await window.electronAPI.projects?.create(projectData);
        
        if (!createResult?.success || !createResult.data) {
          setError('프로젝트 생성에 실패했습니다.');
          return;
        }
        
        Logger.info('PROJECTS_PAGE', `✅ Project created from Google Doc: ${createResult.data.id}`);
        
        // 6️⃣ 프로젝트 목록 새로고침
        await loadProjects();
        
        // 7️⃣ 새 프로젝트 상세 페이지로 리다이렉트 (마치 새 프로젝트처럼)
        navigate(`/projects/${createResult.data.id}`);
      }
    } catch (err) {
      Logger.error('PROJECTS_PAGE', '❌ Google Docs import error', err);
      setError('Google Docs 가져오기 중 오류가 발생했습니다.');
    }
  }, [navigate]);

  // 🔥 로딩 상태
  if (loading) {
    return (
      <div className={PROJECTS_PAGE_STYLES.loading}>
        <div className={PROJECTS_PAGE_STYLES.loadingText}>
          프로젝트를 불러오는 중...
        </div>
      </div>
    );
  }

  // 🔥 에러 상태
  if (error) {
    return (
      <div className={PROJECTS_PAGE_STYLES.error}>
        <h2 className={PROJECTS_PAGE_STYLES.errorTitle}>
          프로젝트를 불러올 수 없습니다
        </h2>
        <p className={PROJECTS_PAGE_STYLES.errorMessage}>
          {error}
        </p>
        <button
          onClick={() => loadProjects()}
          className={PROJECTS_PAGE_STYLES.retryButton}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={PROJECTS_PAGE_STYLES.container} data-tour="projects-container">
      {/* 🔥 프로젝트 생성 다이얼로그 - 항상 렌더링 (isOpen으로만 제어) */}
      {/* 조건부 렌더링 제거 → element 검색 시 항상 찾을 수 있음 */}
      <ProjectCreator
        isOpen={showCreator}
        onClose={() => {
          setShowCreator(false);
          // 🔥 isCreateFlow는 const이므로 리셋 불필요 (URL 정리로 자동 처리)
          
          // 🔥 URL 정리 (튜토리얼 이후 또는 취소 시)
          const params = new URLSearchParams(location.search);
          if (params.has('create')) {
            params.delete('create');
            const paramsString = params.toString();
            navigate(`${location.pathname}${paramsString ? `?${paramsString}` : ''}`, { replace: true });
          }
        }}
        onCreate={handleCreateProject}
      />

      {/* 🔥 프로젝트 수정 다이얼로그 */}
      {editingProject && (
        <ProjectEditorModal
          isOpen={true}
          project={{
            id: editingProject.id,
            title: editingProject.title,
            description: editingProject.description,
            genre: (editingProject.genre || 'unknown') as KoreanWebNovelGenre
          }}
          onClose={() => setEditingProject(null)}
          onUpdated={handleUpdateProject}
        />
      )}

      {/* 🔥 프로젝트 삭제 확인 다이얼로그 */}
      {deletingProject && (
        <ConfirmDeleteDialog
          isOpen={!!deletingProject}
          projectTitle={deletingProject.title}
          onConfirm={confirmDeleteProject}
          onCancel={() => setDeletingProject(null)}
        />
      )}

      {/* 🔥 프로젝트 그리드 */}
      <ProjectGrid
        projects={projects}
        onCreateProject={() => {
          // 🔥 수동으로 "새 프로젝트" 버튼 클릭 시 튜토리얼 비활성화
          // ⚠️ CRITICAL: 즉시 TutorialContext 상태를 비활성화 해야 함
          // 그렇지 않으면 useGuidedTour 훅이 project-creator를 복구하기 전에
          // 이미 setShowCreator(true)로 인한 리렌더링이 시작됨
          closeTutorial();
          setShowCreator(true);
        }}
        onImportFromFile={handleImportFromFile}
        onImportFromGoogleDocs={handleImportFromGoogleDocs}
        onEditProject={(project: ProjectData) => setEditingProject(project)}
        onDeleteProject={handleDeleteProject}
        onViewProject={handleSelectProject}
        data-tour="projects-grid"
      />
    </div>
  );
}

export default function Projects(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className={PROJECTS_PAGE_STYLES.loading}>
        <div className={PROJECTS_PAGE_STYLES.loadingText}>
          프로젝트를 불러오는 중...
        </div>
      </div>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}