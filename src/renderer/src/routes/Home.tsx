'use client';

import React from 'react';
import { DashboardMain } from '../../components/dashboard/DashboardMain';

export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen">
      <DashboardMain />
    </div>
  );
}