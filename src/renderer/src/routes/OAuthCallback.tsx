'use client';

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/');
      return;
    }

    if (code && state) {
      // Handle OAuth callback
      console.log('OAuth callback received:', { code, state });
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