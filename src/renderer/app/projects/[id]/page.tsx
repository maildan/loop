import React, { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import ProjectPageClient from './ProjectPageClient';
import { Logger } from '../../../../shared/logger';

// 🔥 동적 generateStaticParams - 안전한 정적 경로 생성
export async function generateStaticParams() {
  try {
    Logger.info('BUILD', 'Generating static params for projects');

    // 빌드 환경에서는 기본 경로만 사용 (안전성 우선)
    // 런타임에서 동적 라우팅으로 실제 프로젝트 처리
    const staticPaths = [
      { id: 'new' },        // 새 프로젝트 생성 페이지
      { id: 'sample' },     // 샘플 프로젝트
      { id: 'draft' },      // 임시저장 프로젝트
      { id: 'template' },   // 템플릿 프로젝트
    ];

    Logger.info('BUILD', `Generated ${staticPaths.length} static paths`);
    return staticPaths;

  } catch (error) {
    Logger.error('BUILD', 'Error in generateStaticParams', error);
    // 에러 발생 시에도 기본 경로 반환
    return [
      { id: 'new' },
      { id: 'sample' },
      { id: 'draft' }
    ];
  }
}

// 🔥 정적 빌드에서는 dynamicParams 사용 불가 (output: 'export'와 호환되지 않음)
// 정적으로 생성되지 않은 경로는 클라이언트에서 런타임 처리

// 🔥 서버 컴포넌트 - 클라이언트 컴포넌트 래퍼
export default function ProjectPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">프로젝트를 불러오는 중...</div>}>
      <ProjectPageClient />
    </Suspense>
  );
}