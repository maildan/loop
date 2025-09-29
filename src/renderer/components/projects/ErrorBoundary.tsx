'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logger } from '../../../shared/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ProjectErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // 🔥 더 상세한 에러 로깅
    Logger.error('PROJECT_ERROR_BOUNDARY', 'Client-side exception caught', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });

    // 🔥 DOM 관련 에러인지 확인
    if (error.message.includes('insertBefore') || error.message.includes('Node')) {
      Logger.warn('PROJECT_ERROR_BOUNDARY', 'DOM manipulation error detected', {
        errorMessage: error.message
      });
    }
  }

  // 🔥 에러 복구 함수
  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
  <div className="h-screen flex items-center justify-center bg-[color:hsl(var(--background))]">
          <div className="max-w-md text-center p-6">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-[color:var(--error)] mb-4">앗! 오류가 발생했습니다</h1>
            <p className="text-[color:hsl(var(--muted-foreground))] mb-6">
              클라이언트에서 예외가 발생했습니다. 페이지를 새로고침하거나 다시 시도해보세요.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-xs bg-[color:hsl(var(--muted))] p-4 rounded mb-4">
                <summary className="cursor-pointer font-medium">기술적 세부사항</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="space-x-4">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded bg-[color:var(--success)] hover:bg-[color:var(--success)]/90 text-[color:var(--text-inverse,#ffffff)] transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded bg-[color:var(--accent-primary)] hover:bg-[color:var(--accent-hover)] text-[color:var(--text-inverse,#ffffff)] transition-colors"
              >
                페이지 새로고침
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 rounded bg-[color:hsl(var(--muted))] text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--muted) / 0.8)] transition-colors"
              >
                뒤로 가기
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
