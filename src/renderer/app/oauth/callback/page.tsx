'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Logger } from '../../../../shared/logger';

interface OAuthCallbackPageProps {}

function OAuthCallbackClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('인증 처리 중...');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // 에러가 있는 경우
        if (error) {
          Logger.error('OAuth Callback', '인증 오류:', error);
          setStatus('error');
          setMessage(`인증 실패: ${error}`);
          return;
        }

        // 코드가 없는 경우
        if (!code) {
          Logger.error('OAuth Callback', '인증 코드가 없습니다');
          setStatus('error');
          setMessage('인증 코드를 받지 못했습니다');
          return;
        }

        Logger.info('OAuth Callback', '인증 코드 수신:', { code: code.substring(0, 10) + '...' });

        // Electron API가 있는지 확인
        if (!window.electronAPI) {
          Logger.error('OAuth Callback', 'Electron API를 사용할 수 없습니다');
          setStatus('error');
          setMessage('데스크톱 앱에서만 사용 가능합니다');
          return;
        }

        // IPC로 메인 프로세스에 코드 전달
        const result = await window.electronAPI?.oauth?.handleCallback(code);

        if (result.success) {
          Logger.info('OAuth Callback', '인증 성공');
          setStatus('success');
          setMessage('Google 계정 연결이 완료되었습니다!');
          
          // 3초 후 프로젝트 페이지로 이동
          setTimeout(() => {
            router.push('/projects');
          }, 3000);
        } else {
          Logger.error('OAuth Callback', '인증 처리 실패:', result.error);
          setStatus('error');
          setMessage(result.error || '인증 처리 중 오류가 발생했습니다');
        }

      } catch (error) {
        Logger.error('OAuth Callback', '콜백 처리 중 오류:', error);
        setStatus('error');
        setMessage('예상치 못한 오류가 발생했습니다');
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* 로고/아이콘 */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Google 계정 연결
          </h1>

          {/* 상태별 내용 */}
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-medium">{message}</p>
              <p className="text-sm text-gray-500 mt-2">잠시 후 프로젝트 페이지로 이동합니다...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{message}</p>
              <button 
                onClick={() => router.push('/projects')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                프로젝트로 돌아가기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage({}: OAuthCallbackPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">페이지를 로딩 중...</p>
          </div>
        </div>
      </div>
    }>
      <OAuthCallbackClient />
    </Suspense>
  );
}
