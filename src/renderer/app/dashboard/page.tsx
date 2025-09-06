'use client';

import React from 'react';
import { DashboardMain } from '../../components/dashboard/DashboardMain';

/**
 * 🔥 Dashboard 페이지 - Next.js App Router 구조
 * 사용자 활동 모니터링, 통계, 빠른 작업 등을 제공하는 메인 대시보드
 */
export default function DashboardPage(): React.ReactElement {
    return (
        <div className="h-full w-full">
            <DashboardMain />
        </div>
    );
}
