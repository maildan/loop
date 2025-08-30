'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectGrid } from '../../components/projects/ProjectGrid';
import { ProjectCreator, type ProjectCreationData } from '../../components/projects/ProjectCreator';
import { ProjectEditorModal } from '../../components/projects/ProjectEditorModal';
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
  const router = useRouter(); // 🔥 Navigation 훅 추가
  const searchParams = useSearchParams(); // 🔥 URL 쿼리 파라미터 감지
  const [projects, setProjects] = useState<readonly ProjectData[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

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
      const result = await window.electronAPI.projects.getAll();

      // 🔥 에러 처리 - IPC 응답 검증
      if (!result.success) {
        throw new Error(result.error || 'Projects API failed');
      }

      // 🔥 BE 데이터를 FE 형식으로 변환
      const projectsData = convertToProjectData(result.data || []);
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
   * 🔥 BE 데이터를 FE ProjectData 타입으로 변환
   */
  const convertToProjectData = (backendProjects: Array<Partial<ProjectData & { lastModified?: Date; createdAt?: Date; updatedAt?: Date }>>): readonly ProjectData[] => {
    return backendProjects.map((project) => ({
      id: project.id || '',
      title: project.title || '제목 없음',
      description: project.description || '',
      status: project.status || 'draft',
      progress: project.progress || 0,
      createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
      updatedAt: project.updatedAt ? new Date(project.updatedAt) :
        project.lastModified ? new Date(project.lastModified) : new Date(),
      wordCount: project.wordCount || 0,
      author: project.author || '사용자',
      genre: project.genre || '기타'
    }));
  };

  /**
   * 🔥 실제 프로젝트 생성 (더미 데이터 제거)
   */
  const handleCreateProject = (): void => {
    Logger.info('PROJECTS_PAGE', 'Opening project creator');
    setShowCreator(true);
  };

  /**
   * 🔥 프로젝트 생성 완료 처리 - 플랫폼별 로직 및 DB 연동
   */
  const handleProjectCreated = async (projectData: ProjectCreationData): Promise<void> => {
    try {
      Logger.info('PROJECTS_PAGE', '🚀 Creating new project', projectData);

      // 🔥 플랫폼별 처리 로직
      if (projectData.platform === 'import') {
        // 파일 불러오기 플랫폼
        Logger.info('PROJECTS_PAGE', '📁 Importing file for project creation');
        const result = await window.electronAPI.projects.importFile();
        if (result.success && result.data) {
          Logger.info('PROJECTS_PAGE', '✅ Project imported successfully', { projectId: result.data.id });
          // 생성된 프로젝트 에디터로 즉시 이동 (정적 빌드 호환)
          router.push(`/projects/new?open=${encodeURIComponent(String(result.data.id))}`);
          return;
        } else {
          throw new Error(result.error || 'Failed to import project');
        }
      } else if (projectData.platform === 'google-docs') {
        // 🔥 Google Docs 프로젝트도 Loop 데이터베이스에 저장하여 관리
        Logger.info('PROJECTS_PAGE', '📝 Creating Google Docs project in Loop database');

        // Google Docs 정보를 description에 JSON으로 저장
        const googleDocsInfo = {
          originalDescription: projectData.description,
          googleDocId: projectData.googleDocId,
          googleDocUrl: projectData.googleDocUrl,
          isGoogleDocsProject: true
        };

        // Google Docs 전용 프로젝트 데이터 생성
        const createData = {
          title: projectData.title,
          description: `${projectData.description}\n\n[Google Docs 연동 정보: ${JSON.stringify(googleDocsInfo)}]`,
          genre: projectData.genre,
          content: projectData.content || '# Google Docs 연동 프로젝트\n\n이 프로젝트는 Google Docs와 연동되어 있습니다.\n\n원본 문서 링크: ' + (projectData.googleDocUrl || ''),
          progress: 0,
          wordCount: projectData.content ? projectData.content.length : 0,
          status: 'active' as const,
          author: '사용자',
          platform: projectData.platform,
          updatedAt: new Date(),
        };

        const result = await window.electronAPI.projects.create(createData);

        if (!result.success) {
          throw new Error(result.error || 'Failed to create Google Docs project');
        }

        Logger.info('PROJECTS_PAGE', '✅ Google Docs project created successfully in DB', {
          id: result.data?.id,
          googleDocId: projectData.googleDocId,
          title: projectData.title
        });

        // 🔥 프로젝트 목록 새로고침
        await loadProjects();

        // 🔥 생성된 프로젝트 에디터로 즉시 이동 (약간의 지연으로 DB 동기화 보장)
        const createdId = result.data?.id;
        if (createdId) {
          Logger.info('PROJECTS_PAGE', '🚀 Navigating to new Google Docs project editor', { id: createdId });
          setTimeout(() => {
            router.push(`/projects/new?open=${encodeURIComponent(String(createdId))}`);
          }, 100);
          return;
        }
      }

      // Loop Editor - 실제 Prisma DB에 프로젝트 생성
      const createData = {
        title: projectData.title,
        description: projectData.description,
        genre: projectData.genre,
        content: projectData.content || '새 프로젝트를 시작해보세요...\n\n',
        progress: 0,
        wordCount: 0,
        status: 'active' as const,
        author: '사용자', // TODO: 실제 사용자 정보 연동
        platform: projectData.platform,
        updatedAt: new Date(),
      };

      const result = await window.electronAPI.projects.create(createData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create project');
      }

      Logger.info('PROJECTS_PAGE', '✅ Project created successfully in DB', { id: result.data?.id });

      // 🔥 프로젝트 목록 새로고침
      await loadProjects();

      // 🔥 생성된 프로젝트 에디터로 즉시 이동 (Google Docs 스타일)
      if (result.data?.id) {
        Logger.info('PROJECTS_PAGE', '🚀 Navigating to new project editor', { id: result.data.id });
        router.push(`/projects/new?open=${encodeURIComponent(String(result.data.id))}`);
        return; // 성공적으로 이동했으므로 여기서 종료
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로젝트 생성 중 오류가 발생했습니다.';
      Logger.error('PROJECTS_PAGE', '❌ Failed to create project', err);
      setError(errorMessage);
    }
  };

  const handleViewProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `🔍 View project: ${project.id}`, { title: project.title });
    // 🔥 정적 프리렌더 경로 한계 대응: 쿼리로 실제 ID 전달
    router.push(`/projects/new?open=${encodeURIComponent(project.id)}`);
  };

  const handleEditProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `✏️ Edit project (modal): ${project.id}`, { title: project.title });
    setEditingProject(project);
  };

  const handleShareProject = (project: ProjectData): void => {
    Logger.info('PROJECTS_PAGE', `Share project: ${project.id}`, { title: project.title });
    alert('공유 기능은 준비 중입니다.');
  };

  const handleDeleteProject = async (project: ProjectData): Promise<void> => {
    Logger.info('PROJECTS_PAGE', `Delete project requested: ${project.id}`, { title: project.title });
    const confirmed = confirm(`정말로 "${project.title}" 프로젝트를 삭제하시겠습니까?`);
    if (!confirmed) return;
    try {
      const result = await window.electronAPI.projects.delete(project.id);
      if (result.success) {
        setProjects(prev => prev.filter(p => p.id !== project.id));
        Logger.info('PROJECTS_PAGE', `Project deleted: ${project.id}`);
      } else {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (err) {
      Logger.error('PROJECTS_PAGE', 'Failed to delete project', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRetry = (): void => {
    Logger.info('PROJECTS_PAGE', 'Retry loading projects');
    setError(null);
    // 컴포넌트 리마운트 효과로 useEffect 재실행
    setLoading(true);
  };

  if (loading) {
    return (
      <div className={PROJECTS_PAGE_STYLES.container}>
        <div className={PROJECTS_PAGE_STYLES.loading}>
          <div className={PROJECTS_PAGE_STYLES.loadingText}>
            프로젝트를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={PROJECTS_PAGE_STYLES.container}>
        <div className={PROJECTS_PAGE_STYLES.error}>
          <h2 className={PROJECTS_PAGE_STYLES.errorTitle}>오류 발생</h2>
          <p className={PROJECTS_PAGE_STYLES.errorMessage}>{error}</p>
          <button
            onClick={handleRetry}
            className={PROJECTS_PAGE_STYLES.retryButton}
            type="button"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={PROJECTS_PAGE_STYLES.container}>
      <ProjectGrid
        projects={projects}
        onCreateProject={handleCreateProject}
        onViewProject={handleViewProject}
        onEditProject={handleEditProject}
        onShareProject={handleShareProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* 🔥 프로젝트 생성 모달 */}
      <ProjectCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onCreate={handleProjectCreated}
      />

      <ProjectEditorModal
        isOpen={!!editingProject}
        project={editingProject ? { id: editingProject.id, title: editingProject.title, description: editingProject.description, genre: editingProject.genre || 'novel' } : null}
        onClose={() => setEditingProject(null)}
        onUpdated={(u) => {
          setProjects(prev => prev.map(p => p.id === u.id ? { ...p, title: u.title, description: u.description, genre: u.genre, updatedAt: new Date() } : p));
        }}
      />
    </div>
  );
}

// 🔥 Suspense로 래핑된 메인 컴포넌트
export default function ProjectsPage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className={PROJECTS_PAGE_STYLES.loading}>
        <div className={PROJECTS_PAGE_STYLES.loadingText}>프로젝트 로딩 중...</div>
      </div>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}
