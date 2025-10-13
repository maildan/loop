'use client';

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RendererLogger as Logger } from '../../../shared/logger-renderer';

// 🔥 Symbol 기반 컴포넌트 이름
const OAUTH_CALLBACK = Symbol.for('OAUTH_CALLBACK');

export default function OAuthCallback(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      Logger.error(OAUTH_CALLBACK, 'OAuth error', { error });
      navigate('/');
      return;
    }

    if (code && state) {
      // Handle OAuth callback
      Logger.debug(OAUTH_CALLBACK, 'OAuth callback received', { code, state });
      // Process OAuth callback via IPC
      navigate('/');
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-4">OAuth 인증 처리 중...</p>
      </div>
    </div>
  );
}