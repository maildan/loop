'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[color:hsl(var(--background))]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[color:hsl(var(--foreground))] mb-4">404</h1>
        <p className="text-xl text-[color:hsl(var(--muted-foreground))] mb-8">페이지를 찾을 수 없습니다</p>
        <Link 
          to="/" 
          className="px-6 py-3 rounded-lg transition-colors bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--text-inverse,#ffffff)]"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}