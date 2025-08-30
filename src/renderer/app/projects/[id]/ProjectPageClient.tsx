'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProjectEditor } from '../../../components/projects/ProjectEditor';
import { ProjectErrorBoundary } from '../../../components/projects/ErrorBoundary';
import { Logger } from '../../../../shared/logger';

// 🔥 클라이언트 컴포넌트 - 동적 라우팅 로직
export default function ProjectPageClient(): React.ReactElement {
  const params = useParams();
  const searchParams = useSearchParams();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
  const openId = searchParams.get('open') || searchParams.get('id') || undefined;

  // 🔥 정적 루트(`/projects/new`)에서 쿼리로 열린 경우 처리
  const projectId = (paramId === 'new' && openId) ? openId : (paramId || openId);

  // 🔥 파라미터 검증
  if (!projectId) {
    Logger.error('PROJECT_PAGE', 'Missing project ID in route parameters');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류</h1>
          <p className="text-slate-600">프로젝트 ID가 없습니다.</p>
        </div>
      </div>
    );
  }

  Logger.debug('PROJECT_PAGE', 'Loading project page', { projectId });

  return (
    <ProjectErrorBoundary>
      <ProjectEditor projectId={projectId} />
    </ProjectErrorBoundary>
  );
}
