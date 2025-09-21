'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProjectGrid } from '../../components/projects/ProjectGrid';
import { ProjectCreator, type ProjectCreationData } from '../../components/projects/ProjectCreator';
import { ProjectEditorModal } from '../../components/projects/ProjectEditorModal';
import { ConfirmDeleteDialog } from '../../components/projects/components/ConfirmDeleteDialog';
import { type ProjectData } from '../../components/projects/ProjectCard';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const PROJECTS_PAGE_STYLES = {
  container: 'container mx-auto px-4 py-6 max-w-7xl',
  loading: 'flex items-center justify-center min-h-96',
  loadingText: 'text-lg text-slate-600 dark:text-slate-400',
  error: 'flex flex-col items-center justify-center min-h-96 text-center',
  errorTitle: 'text-xl font-semibold text-red-600 dark:text-red-400 mb-2',
  errorMessage: 'text-slate-600 dark:text-slate-400 mb-4',
  retryButton: 'mt-4',
} as const;

// 🔥 기가차드 규칙: BE 연동을 위한 기본값 (로딩 중 사용)
const DEFAULT_PROJECTS: readonly ProjectData[] = [] as const;

// 🔥 Suspense 래핑된 컴포넌트
function ProjectsPageContent(): React.ReactElement {
  const navigate = useNavigate(); // 🔥 Navigation 훅 추가
  const [searchParams] = useSearchParams(); // 🔥 URL 쿼리 파라미터 감지
  const [projects, setProjects] = useState<readonly ProjectData[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectData | null>(null);

  // 🔥 URL 쿼리 파라미터에서 create=true 감지 시 자동으로 생성 다이얼로그 열기
  useEffect(() => {
    const shouldCreate = searchParams.get('create') === 'true';
    if (shouldCreate) {
      Logger.info('PROJECTS_PAGE', '🚀 Auto-opening project creator from URL parameter');
      setShowCreator(true);

      // URL에서 쿼리 파라미터 제거 (깔끔한 URL 유지)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('create');
      window.history.replaceState({}, '', newUrl.pathname);
    }
  }, [searchParams]);

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
      const projectsData = result.data || [];
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
        genre: data.genre,
        platform: data.platform,
        content: data.content || '',
        status: 'active' as const,
        progress: 0,
        wordCount: 0,
        updatedAt: new Date(),
      };
      
      // 🔥 electronAPI를 통한 프로젝트 생성
      const result = await window.electronAPI?.projects?.create(projectData);
      
      if (result?.success && result.data) {
        const newProject = result.data;
        setProjects(prev => [newProject as ProjectData, ...prev]);
        setShowCreator(false);
        Logger.info('PROJECTS_PAGE', '✅ Project created successfully', { id: newProject.id });
        
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
  }, []);

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
          loadProjects();
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
        // TODO: Google Docs 가져오기 API 구현 필요
        setError('Google Docs 가져오기 기능은 아직 구현 중입니다.');
        Logger.warn('PROJECTS_PAGE', 'Google Docs import not implemented yet');
      }
    } catch (err) {
      Logger.error('PROJECTS_PAGE', '❌ Google Docs import error', err);
      setError('Google Docs 가져오기 중 오류가 발생했습니다.');
    }
  }, []);

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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={PROJECTS_PAGE_STYLES.container}>
      {/* 🔥 프로젝트 생성 다이얼로그 */}
      {showCreator && (
        <ProjectCreator
          isOpen={showCreator}
          onClose={() => setShowCreator(false)}
          onCreate={handleCreateProject}
        />
      )}

      {/* 🔥 프로젝트 수정 다이얼로그 */}
      {editingProject && (
        <ProjectEditorModal
          isOpen={true}
          project={{
            id: editingProject.id,
            title: editingProject.title,
            description: editingProject.description,
            genre: editingProject.genre || 'novel'
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
        onCreateProject={() => setShowCreator(true)}
        onImportFromFile={handleImportFromFile}
        onImportFromGoogleDocs={handleImportFromGoogleDocs}
        onEditProject={(project: ProjectData) => setEditingProject(project)}
        onDeleteProject={handleDeleteProject}
        onViewProject={handleSelectProject}
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