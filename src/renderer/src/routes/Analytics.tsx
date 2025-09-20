'use client';

import React from 'react';
import { AnalyticsPageClient } from '../../components/pages/AnalyticsPageClient';

/**
 * 🔥 Analytics 페이지 - 실제 DB 데이터 연동
 * 사용자 활동, 프로젝트 통계, 성과 분석 등을 실제 데이터로 제공
 */
export default function Analytics(): React.ReactElement {
  return (
    <div className="h-full w-full">
      <AnalyticsPageClient />
    </div>
  );
}