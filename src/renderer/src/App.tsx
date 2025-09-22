// React Router App: Main app component with routing structure
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Inter } from 'next/font/google'; // Removed Next.js font import
import ClientLayout from '../app/ClientLayout';
import Home from './routes/Home';
import Analytics from './routes/Analytics';
import Projects from './routes/Projects';
import ProjectDetail from './routes/ProjectDetail';
import Settings from './routes/Settings';
import AI from './routes/AI';
import OAuthCallback from './routes/OAuthCallback';
import NotFound from './routes/NotFound';
import '../app/global.css';

// 🔥 기가차드 규칙: 폰트 클래스 (Next.js font 제거)
const fontClass = 'font-sans';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const LAYOUT_STYLES = {
  html: 'h-full',
  body: 'h-full bg-slate-50 dark:bg-slate-900 antialiased',
  container: 'h-full',
} as const;

export default function App(): React.ReactElement {
  // read auth snapshot synchronously
  let initialAuth: any = null;
  try {
    // In Electron environment, we'll handle auth differently
    const snapPath = '.auth_snapshot.json';
    // This will be handled by IPC in electron context
  } catch (e) {
    // ignore
  }

  return (
    <div className={`${fontClass} ${LAYOUT_STYLES.container}`}>
      <BrowserRouter>
        <ClientLayout initialAuth={initialAuth}>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai" element={<AI />} />
            
            {/* OAuth callback */}
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClientLayout>
      </BrowserRouter>
    </div>
  );
}