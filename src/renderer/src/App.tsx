// React Router App: Main app component with routing structure
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { Inter } from 'next/font/google'; // Removed Next.js font import
import { themeManager } from '../utils/themeManager';
import { Logger } from '../../shared/logger';
import ClientLayout from '../app/ClientLayout';
import Home from './routes/Home';
import Analytics from './routes/Analytics';
import Projects from './routes/Projects';
import ProjectDetail from './routes/ProjectDetail';
import Settings from './routes/Settings';
import AI from './routes/AI';
import OAuthCallback from './routes/OAuthCallback';
import NotFound from './routes/NotFound';
import { UpdateNotification } from '../components/common/UpdateNotification';
import { TutorialProvider } from '../modules/tutorial';
import '../styles/index.css';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const LAYOUT_STYLES = {
  html: 'h-full',
  body: 'h-full bg-slate-50 dark:bg-slate-900 antialiased',
  container: 'h-full',
} as const;

/**
 * 🔥 트레이 액션 핸들러 컴포넌트
 * IPC 이벤트를 라우팅으로 변환
 */
function TrayActionHandler(): null {
  const navigate = useNavigate();

  useEffect(() => {
    const handleTrayAction = (...args: unknown[]) => {
      // IPC 이벤트는 (event, payload) 형식으로 전달됨
      const payload = args[1] as { action: string; projectId?: string; timestamp: number } | undefined;
      
      if (!payload) {
        Logger.warn('APP', 'Tray action received with no payload');
        return;
      }

      Logger.debug('APP', 'Tray action received', payload);

      switch (payload.action) {
        case 'new-project':
          navigate('/projects');
          break;
        case 'open-project':
          if (payload.projectId) {
            navigate(`/projects/${payload.projectId}`);
          }
          break;
        case 'open-settings':
          navigate('/settings');
          break;
        default:
          Logger.warn('APP', 'Unknown tray action', { action: payload.action });
      }
    };

    // 🔥 IPC 리스너 등록
    if (window.electronAPI?.on) {
      window.electronAPI.on('tray-action', handleTrayAction);
      Logger.info('APP', 'Tray action listener registered');
    } else {
      Logger.warn('APP', 'electronAPI.on not available, tray actions disabled');
    }

    // 🔥 정리
    return () => {
      if (window.electronAPI?.removeListener) {
        window.electronAPI.removeListener('tray-action', handleTrayAction);
        Logger.info('APP', 'Tray action listener removed');
      }
    };
  }, [navigate]);

  return null;
}

export default function App(): React.ReactElement {
  // 🎨 테마 매니저 초기화
  useEffect(() => {
    // setupSystemThemeListener는 ThemeProvider에서 처리됨
  }, []);

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
    <div className={LAYOUT_STYLES.container}>
      <BrowserRouter>
        <TutorialProvider>
          <TrayActionHandler />
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
          {/* 🔥 Auto-updater 알림 (전역 표시) */}
          <UpdateNotification />
        </TutorialProvider>
      </BrowserRouter>
    </div>
  );
}