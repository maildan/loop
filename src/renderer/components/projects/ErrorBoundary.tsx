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
    
    Logger.error('PROJECT_ERROR_BOUNDARY', 'Client-side exception caught', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // 콘솔에도 상세 정보 출력
    console.error('🚨 ProjectErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="max-w-md text-center p-6">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">앗! 오류가 발생했습니다</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              클라이언트에서 예외가 발생했습니다. 페이지를 새로고침하거나 다시 시도해보세요.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
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
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                페이지 새로고침
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
