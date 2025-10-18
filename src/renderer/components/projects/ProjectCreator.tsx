'use client';

// 프로젝트 생성

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { KoreanWebNovelGenre } from '../../../shared/constants/enums';
import { SELECTABLE_GENRES, GENRE_LABELS } from '../../../shared/constants/enums';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';
import { markdownToHtml } from '../../utils/markdownToHtml';
import { useTutorial, useTutorialState } from '../../modules/tutorial/useTutorial';
import {
  FileText,
  Globe,
  Upload,
  X,
  Plus,
  ExternalLink,
  BookOpen,
  Newspaper,
  Coffee,
  Code,
  Lightbulb,
  Target
} from 'lucide-react';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 - 작가 친화적 다크모드 완전 지원
const PROJECT_CREATOR_STYLES = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(var(--background))]/70 supports-[backdrop-filter]:bg-[hsl(var(--background))]/55 backdrop-blur-md transition-colors',
  modal: 'bg-card text-card-foreground rounded-2xl shadow-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden',
  header: 'flex items-center justify-between p-6 border-b border-border bg-card/95 supports-[backdrop-filter]:bg-card/80',
  title: 'text-2xl font-bold text-[hsl(var(--foreground))]',
  closeButton: 'text-muted-foreground hover:text-[hsl(var(--foreground))] transition-colors p-1 rounded-lg hover:bg-[hsl(var(--accent))]/15',
  content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-card',

  // 플랫폼 선택
  platformSection: 'mb-8',
  sectionTitle: 'text-lg font-semibold text-[hsl(var(--foreground))] mb-4',
  platformGrid: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  platformCard: 'p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm bg-card text-card-foreground',
  platformCardSelected: 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent))]/20 ring-1 ring-[hsl(var(--accent))]/40',
  platformCardDefault: 'border-border hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10',
  platformIcon: 'w-8 h-8 text-[hsl(var(--accent-primary))] mb-2',
  platformTitle: 'font-semibold text-[hsl(var(--foreground))] mb-1 flex items-center',
  platformDescription: 'text-sm text-muted-foreground leading-relaxed',

  // 프로젝트 정보
  formSection: 'mb-6',
  label: 'block text-sm font-medium text-[hsl(var(--foreground))] mb-2',
  inputGroup: 'mb-4',
  genreGrid: 'grid grid-cols-2 md:grid-cols-4 gap-2 mt-2',
  genreButton: 'p-2 text-sm border rounded-lg transition-all duration-200 flex items-center justify-center gap-1',
  genreSelected: 'border-[hsl(var(--accent-primary))] bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent-primary))] shadow-sm',
  genreDefault: 'border-border text-muted-foreground hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10',

  // 버튼
  footer: 'flex items-center justify-between p-6 border-t border-border bg-card/95 supports-[backdrop-filter]:bg-card/80',
  secondaryButton: 'px-4 py-2 text-muted-foreground hover:text-[hsl(var(--foreground))] transition-colors rounded-lg hover:bg-[hsl(var(--accent))]/10',
  primaryButton: 'px-6 py-2 bg-[hsl(var(--accent-primary))] text-[hsl(var(--accent-foreground))] rounded-lg hover:bg-[hsl(var(--accent-hover))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

// 🔥 플랫폼 옵션 타입 정의
interface PlatformOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly recommended?: boolean;
  readonly external?: boolean;
  readonly action?: string;
}

// 🔥 플랫폼 옵션
const PLATFORM_OPTIONS: readonly PlatformOption[] = [
  {
    id: 'loop',
    name: 'Loop Editor',
    description: '통합 타이핑 분석과 함께하는 전용 에디터',
    icon: BookOpen,
    recommended: true,
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: '실시간 협업과 클라우드 동기화',
    icon: Globe,
    external: true,
  },
  {
    id: 'import',
    name: '파일 불러오기',
    description: 'Word, 텍스트 파일에서 프로젝트 생성',
    icon: Upload,
    action: 'import',
  },
] as const;

// 🔥 장르 옵션 - 선택 가능한 장르 목록에서 생성
const GENRE_OPTIONS = SELECTABLE_GENRES.map((genreId) => ({
  id: genreId,
  name: GENRE_LABELS[genreId] || genreId,
  icon: BookOpen, // 모든 장르에 동일한 아이콘 사용
}));

export interface ProjectCreatorProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCreate: (projectData: ProjectCreationData) => void | Promise<void>;
}

export interface ProjectCreationData {
  readonly title: string;
  readonly description: string;
  readonly genre: string;
  readonly platform: string;
  readonly content?: string;
  readonly targetWords?: number; // 🔥 목표 단어 수 추가
  readonly deadline?: Date; // 🔥 완료 목표 날짜 추가
  // 🔥 Google Docs 관련 필드 추가
  readonly googleDocId?: string; // Google Docs 문서 ID
  readonly googleDocUrl?: string; // Google Docs 문서 URL
}

export function ProjectCreator({ isOpen, onClose, onCreate }: ProjectCreatorProps): React.ReactElement | null {
  // 🔥 방어적 상태 초기화 - undefined 방지
  const [selectedPlatform, setSelectedPlatform] = useState<string>('loop');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<KoreanWebNovelGenre>('unknown');
  const [targetWords, setTargetWords] = useState<number>(10000); // 🔥 목표 단어 수
  const [deadline, setDeadline] = useState<string>(''); // 🔥 완료 목표 날짜
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // 🔥 Navigation Hook
  const navigate = useNavigate();

  // 🔥 튜토리얼 Hook - 여기서만 호출 (Hook 규칙 준수)
  const { startTutorial, closeTutorial, completeTutorial } = useTutorial();
  const { currentTutorialId, isActive } = useTutorialState();
  const hasNavigatedBackRef = useRef<boolean>(false);

  // 🔥 Google Docs 선택 모달
  const [showGoogleDocsModal, setShowGoogleDocsModal] = useState<boolean>(false);
  const [googleDocs, setGoogleDocs] = useState<any[]>([]);

  // 🔥 선택된 Google Docs 문서 정보
  const [selectedGoogleDoc, setSelectedGoogleDoc] = useState<any>(null);

  // 🔥 컴포넌트 렌더링 로그 - 매번 호출되어야 함
  Logger.debug('PROJECT_CREATOR', `🎨 ProjectCreator rendered`, { 
    isOpen,
    currentTutorialId,
    isActive
  });

  // 🔥 ProjectCreator 모달이 열릴 때 튜토리얼 자동 시작 제거
  // 이제는 Projects.tsx에서 모달 마운트 후 튜토리얼을 시작하므로
  // 여기서 중복 시작 방지!
  // (Projects.tsx의 재시도 로직이 모달 렌더링을 확인한 후 startTutorial)
  useEffect(() => {
    if (isOpen && currentTutorialId === 'project-creator' && !isActive) {
      Logger.debug('PROJECT_CREATOR', '� project-creator tutorial is pending but not yet active (Projects.tsx 대기 중)');
      // 여기서는 아무것도 하지 않음 - Projects.tsx가 모달 확인 후 startTutorial 호출
    }
  }, [isOpen, currentTutorialId, isActive]);

  useEffect(() => {
    if (isOpen) {
      hasNavigatedBackRef.current = false;
    }
  }, [isOpen]);

  // 🔥 튜토리얼 복귀 감지: currentTutorialId가 'dashboard-intro'로 변경되면 모달 자동 종료
  // 상황: ProjectCreator 튜토리얼의 마지막 step에서 completeTutorial() 호출
  // → currentTutorialId = 'project-creator'에서 'dashboard-intro'로 변경
  // → isActive = true (Dashboard 튜토리얼 활성)
  // → 이때 ProjectCreator 모달을 닫아야 dashboard 튜토리얼이 시작됨
  useEffect(() => {
    // 🔥 중요: currentTutorialId가 'dashboard-intro'로 변경되었으면 복귀 중
    // (completeTutorial()이 returnTutorialId 처리 완료)
    if (isOpen && currentTutorialId === 'dashboard-intro' && isActive && !hasNavigatedBackRef.current) {
      Logger.info(
        'PROJECT_CREATOR',
        '🎉 Returned to dashboard-intro → Auto-closing ProjectCreator modal'
      );
      // 약간의 딜레이 후 모달 닫기 (driver.js 정리 완료 대기)
      setTimeout(() => {
        onClose();
        Logger.info('PROJECT_CREATOR', '✅ Modal closed, dashboard tutorial ready to start');
        navigate('/dashboard');
        Logger.info('PROJECT_CREATOR', '📦 Navigated back to dashboard for tutorial continuation');
      }, 300);
      hasNavigatedBackRef.current = true;
    }
  }, [isOpen, isActive, currentTutorialId, onClose, navigate]);

  // 🔥 OAuth 성공 이벤트 리스너 설정 (강화된 다중 채널 지원)
  useEffect(() => {
    const handleOAuthSuccess = (payload?: any) => {
      Logger.info('PROJECT_CREATOR', '🔥 OAuth 성공 이벤트 수신 - Google Docs 목록 새로고침', payload);
      // Google Docs 목록 새로고침
      if (selectedPlatform === 'google-docs') {
        // 약간의 딜레이 후 실행 (토큰 저장 완료 대기)
        setTimeout(() => {
          showGoogleDocsList();
        }, 1000);
      }
    };

    const handleAuthStatusChanged = (payload?: any) => {
      Logger.info('PROJECT_CREATOR', '🔥 인증 상태 변경 이벤트 수신', payload);
      if (selectedPlatform === 'google-docs') {
        setTimeout(() => {
          showGoogleDocsList();
        }, 1000);
      }
    };

    const handleForceRefresh = (payload?: any) => {
      Logger.info('PROJECT_CREATOR', '🔥 강제 새로고침 이벤트 수신', payload);
      if (selectedPlatform === 'google-docs') {
        setTimeout(() => {
          showGoogleDocsList();
        }, 500);
      }
    };

    const handleDelayedCheck = (payload?: any) => {
      Logger.info('PROJECT_CREATOR', '🔥 지연된 인증 상태 확인 이벤트 수신', payload);
      if (selectedPlatform === 'google-docs') {
        showGoogleDocsList();
      }
    };

    if (typeof window !== 'undefined' && window.electronAPI) {
      // 🔥 다양한 OAuth 이벤트 리스너 등록
      window.electronAPI.on('oauth-success', handleOAuthSuccess);
      window.electronAPI.on('auth-status-changed', handleAuthStatusChanged);
      window.electronAPI.on('google-auth-completed', handleOAuthSuccess);
      window.electronAPI.on('force-auth-status-refresh', handleForceRefresh);
      window.electronAPI.on('delayed-auth-status-check', handleDelayedCheck);

      return () => {
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        window.electronAPI?.removeListener('oauth-success', handleOAuthSuccess);
        window.electronAPI?.removeListener('auth-status-changed', handleAuthStatusChanged);
        window.electronAPI?.removeListener('google-auth-completed', handleOAuthSuccess);
        window.electronAPI?.removeListener('force-auth-status-refresh', handleForceRefresh);
        window.electronAPI?.removeListener('delayed-auth-status-check', handleDelayedCheck);
      };
    }
  }, [selectedPlatform]);

  // 🔥 Google Docs 연동 처리 - End User 토큰 기반 (보안 강화)
  // googleOAuthService를 통해 사용자 토큰만 사용 (.env 토큰 미사용)
  const handleGoogleDocsIntegration = async () => {
    try {
      Logger.info('PROJECT_CREATOR', '🔥 Google Docs 연동 시작 (End User 토큰 사용)');

      if (!window.electronAPI) {
        alert('데스크톱 앱에서만 사용 가능합니다');
        return;
      }

      // 🔥 End User 토큰 확인 (googleOAuthService 사용)
      Logger.info('PROJECT_CREATOR', '현재 인증 상태 확인 중...');
      const connectionStatus = await window.electronAPI?.googleOAuth?.checkConnection();

      Logger.info('PROJECT_CREATOR', '📊 Google OAuth 연결 상태:', connectionStatus);

      if (connectionStatus?.success && connectionStatus?.data?.isConnected) {
        // 🔥 이미 인증된 경우 바로 문서 목록 표시
        Logger.info('PROJECT_CREATOR', '✅ 이미 인증됨 - 문서 목록 표시', {
          userEmail: connectionStatus.data.email
        });
        await showGoogleDocsList();
        return;
      }

      // 🔥 인증이 필요한 경우 OAuth 브라우저 인증 시작
      Logger.info('PROJECT_CREATOR', '❌ 인증 필요 - OAuth 시작');
      try {
        const authResult = await window.electronAPI?.googleOAuth?.startAuth();
        Logger.info('PROJECT_CREATOR', '🔐 OAuth 시작 결과:', authResult);

        if (authResult?.success) {
          alert('브라우저에서 Google 계정으로 로그인해주세요.\n로그인 완료 후 자동으로 문서 목록이 표시됩니다.');
          // OAuth 완료 후 자동으로 showGoogleDocsList 호출됨 (이벤트 리스너)
        } else {
          throw new Error(authResult?.error || 'OAuth 시작 실패');
        }
      } catch (authError) {
        Logger.error('PROJECT_CREATOR', '❌ OAuth 시작 실패:', authError);
        alert(`Google 인증 시작 실패: ${authError instanceof Error ? authError.message : '알 수 없는 오류'}`);
      }
    } catch (error) {
      Logger.error('PROJECT_CREATOR', '❌ Google Docs 연동 실패:', error);
      alert(`Google Docs 연동 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 🔥 파일 가져오기 처리
  const handleFileImport = async (): Promise<void> => {
    try {
      Logger.info('PROJECT_CREATOR', 'File import started');
      
      if (!window.electronAPI) {
        alert('데스크톱 앱에서만 사용 가능합니다');
        return;
      }

      const result = await window.electronAPI.projects.importFile();
      
      if (result.success && result.data) {
        // 파일 내용으로 폼 자동 채우기
        setTitle(result.data.title || '');
        setDescription(result.data.description || '');
        
        Logger.info('PROJECT_CREATOR', '✅ File imported successfully', result.data);
        alert('파일을 성공적으로 불러왔습니다!');
        
        // 파일에서 가져온 경우 바로 프로젝트 생성
        if (result.data.content) {
          const projectData: ProjectCreationData = {
            title: result.data.title || 'Imported Project',
            description: result.data.description || 'Imported from file',
            genre: selectedGenre,
            platform: 'loop',
            content: result.data.content,
            targetWords: 10000,
          };
          
          await onCreate(projectData);
          onClose();
        }
      } else {
        throw new Error(result.error || '파일 가져오기에 실패했습니다.');
      }
    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'File import failed', error);
      alert(`파일 가져오기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 🔥 Google Docs 목록 표시 (강화된 오류 처리 및 인증 재확인)
  const showGoogleDocsList = async () => {
    try {
      Logger.info('PROJECT_CREATOR', 'Google Docs 목록 조회 시작');

      // 🔥 문서 목록 조회 전 인증 상태 재확인
      const authCheck = await window.electronAPI?.googleOAuth?.checkConnection();
      
      // 🔥 응답 구조 상세 로깅
      Logger.debug('PROJECT_CREATOR', '📊 checkConnection() 응답 상세 로깅', {
        authCheckExists: !!authCheck,
        success: authCheck?.success,
        successType: typeof authCheck?.success,
        data: authCheck?.data,
        dataType: typeof authCheck?.data,
        isConnected: authCheck?.data?.isConnected,
        isConnectedType: typeof authCheck?.data?.isConnected,
        email: authCheck?.data?.email,
        fullResponse: JSON.stringify(authCheck, null, 2)
      });
      
      // ✅ 고정: 이중 래핑 제거 후 올바른 조건문
      if (authCheck?.success && authCheck?.data?.isConnected) {
        Logger.info('PROJECT_CREATOR', '✅ 인증 확인됨, 문서 목록 조회 중...', {
          email: authCheck.data.email
        });

        const docsResult = await window.electronAPI?.googleOAuth?.listDocuments();

        Logger.info('PROJECT_CREATOR', 'Google Docs 목록 조회 결과:', docsResult);

        if (docsResult && docsResult.success && docsResult.data) {
          const docs = docsResult.data;

          Logger.info('PROJECT_CREATOR', `✅ ${docs.length}개 문서 발견`);

          if (docs.length === 0) {
            alert('Google Docs에서 문서를 찾을 수 없습니다.\n\nGoogle Drive에 문서를 만들고 다시 시도해주세요.');
            return;
          }

          // 🔥 React 모달로 문서 선택 UI 표시
          setGoogleDocs(docs);
          setShowGoogleDocsModal(true);
        } else {
          Logger.error('PROJECT_CREATOR', 'Google Docs 목록 조회 실패:', docsResult);

          // 401 오류 등 인증 관련 오류인 경우 재인증 안내
          const errorMsg = docsResult?.error || '문서 목록을 가져올 수 없습니다';
          if (errorMsg.includes('인증') || errorMsg.includes('401')) {
            alert('Google 인증이 만료되었습니다. 다시 로그인해주세요.');
          } else {
            alert(`문서 목록 조회 실패: ${errorMsg}`);
          }
        }
      } else {
        Logger.warn('PROJECT_CREATOR', '❌ 인증 상태 확인 실패:', authCheck);
        Logger.info('PROJECT_CREATOR', '❌ 인증 필요 - OAuth 시작');
        alert('Google 인증이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'Google Docs 목록 조회 중 예외 발생:', error);
      alert(`문서 목록 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 🔥 Google Docs 선택 핸들러 (방어적 코딩 + 문서 정보 저장 + 내용 가져오기 + 직접 열기)
  const handleGoogleDocSelect = async (doc: any): Promise<void> => {
    const docName = doc?.name || doc?.title || doc?.webViewLink?.split('/').pop() || '제목 없음';
    setTitle(docName);
    setDescription(`Google Docs에서 가져온 문서: ${docName}`);
    setSelectedPlatform('google-docs');
    setSelectedGoogleDoc(doc); // 🔥 선택된 문서 정보 저장
    setShowGoogleDocsModal(false);

    Logger.info('PROJECT_CREATOR', 'Google Docs 선택됨:', {
      id: doc?.id,
      name: docName,
      webViewLink: doc?.webViewLink
    });

    // 🔥 Google Docs 문서를 앱 내에서 바로 편집 가능하도록 처리
    // 더 이상 외부 브라우저로 리다이렉트하지 않고, 앱 내에서 처리
    Logger.info('PROJECT_CREATOR', 'Google Docs 선택됨 - 앱 내 편집 준비', { 
      docId: doc.id, 
      title: docName 
    });

    // 🔥 문서 내용 가져오기 (이제 구현됨!)
    const googleOAuthApi = (window.electronAPI?.googleOAuth as any);
    if (doc?.id && googleOAuthApi?.getDocumentContent) {
      try {
        Logger.info('PROJECT_CREATOR', '📥 Google Docs 내용 가져오는 중...', { documentId: doc.id });
        const result = await googleOAuthApi.getDocumentContent(doc.id);

        // 🔥 IPC 응답은 이미 unwrap되어 { title, content, images, metadata }
        // result.success/result.data ❌ → result.title/result.content ✅
        // 🔥 전체 응답 구조 상세 로깅
        Logger.debug('PROJECT_CREATOR', '📊 IPC 응답 구조 (전체):', result);
        Logger.debug('PROJECT_CREATOR', '📊 IPC 응답 구조 (keys):', Object.keys(result || {}));
        Logger.debug('PROJECT_CREATOR', '📊 IPC 응답 구조 (분석):', {
          hasContent: !!result?.content,
          contentType: typeof result?.content,
          contentLength: result?.content?.length || 0,
          imageCount: result?.images?.length || 0,
          title: result?.title || 'N/A',
          hasSuccess: 'success' in (result || {}),
          hasData: 'data' in (result || {}),
          success: (result as any)?.success,
        });

        // 🔥 래핑된 응답 구조 확인: { success, data: { title, content, images, metadata } }
        const responseData = (result as any)?.data || result;
        
        if (responseData && responseData.content && typeof responseData.content === 'string') {
          Logger.info('PROJECT_CREATOR', '✅ Google Docs 내용 가져오기 성공', {
            contentLength: responseData.content.length,
            imageCount: responseData.images?.length || 0,
            title: responseData.title
          });
          
          // 가져온 내용은 selectedGoogleDoc에 저장하여 나중에 프로젝트 생성 시 사용
          const updatedGoogleDoc = {
            ...doc,
            content: responseData.content,
            images: responseData.images || [],
            title: responseData.title || doc.name || docName
          };
          setSelectedGoogleDoc(updatedGoogleDoc);

          // 제목과 설명을 자동으로 채우기
          const finalTitle = responseData.title || title || docName;
          setTitle(finalTitle);
          if (!description) {
            setDescription(`Google Docs에서 가져온 문서`);
          }

          // 🔥 자동 프로젝트 생성 시작 (약간의 지연으로 상태 업데이트 보장)
          Logger.info('PROJECT_CREATOR', '⏳ 1초 후 자동 프로젝트 생성 시작...');
          setTimeout(async () => {
            try {
              Logger.info('PROJECT_CREATOR', '🚀 자동 프로젝트 생성 중...');
              
              // 🔥 마크다운 → HTML 변환 (Google Docs 콘텐츠)
              const htmlContent = markdownToHtml(responseData.content);
              Logger.debug('PROJECT_CREATOR', '✨ 마크다운 → HTML 변환 완료', {
                markdownLength: responseData.content.length,
                htmlLength: htmlContent.length,
                preview: htmlContent.substring(0, 100),
              });
              
              const projectData: ProjectCreationData = {
                title: finalTitle.trim() || docName,
                description: `Google Docs에서 가져온 문서`,
                genre: 'fantasy', // 기본 장르
                platform: 'google-docs',
                content: htmlContent,  // 🔥 마크다운을 HTML로 변환하여 저장
                targetWords: 50000,
                deadline: undefined,
                googleDocId: doc.id,
                googleDocUrl: doc.webViewLink,
              };

              Logger.info('PROJECT_CREATOR', '✅ 자동 프로젝트 생성 데이터 준비 완료', {
                title: projectData.title,
                contentLength: projectData.content?.length,
              });

              setIsCreating(true);
              await onCreate(projectData);

              Logger.info('PROJECT_CREATOR', '🎉 프로젝트 생성 완료 - Editor로 이동 중...');
              // onCreate 콜백이 onClose를 호출하여 자동으로 팝업이 닫히고 Editor로 이동
            } catch (error) {
              Logger.error('PROJECT_CREATOR', '❌ 자동 프로젝트 생성 실패', error);
              setIsCreating(false);
              alert(`⚠️ 프로젝트 생성에 실패했습니다.\n\n오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n수동으로 "프로젝트 생성" 버튼을 클릭해주세요.`);
            }
          }, 1000);
        } else {
          Logger.warn('PROJECT_CREATOR', 'Google Docs 내용 가져오기 실패 (문서 정보로 계속)', (result as any)?.error);
          // ❌ alert 제거 → 문서 정보로 계속 진행 (콘텐츠 없이 생성)
          
          // 🔥 콘텐츠 없이 자동 프로젝트 생성
          Logger.info('PROJECT_CREATOR', '⏳ 1초 후 자동 프로젝트 생성 시작 (콘텐츠 없음)...');
          setTimeout(async () => {
            try {
              Logger.info('PROJECT_CREATOR', '🚀 자동 프로젝트 생성 중 (콘텐츠 없음)...');
              
              const projectData: ProjectCreationData = {
                title: docName,
                description: `Google Docs에서 가져온 문서`,
                genre: 'fantasy', // 기본 장르
                platform: 'google-docs',
                content: undefined, // 콘텐츠 없음
                targetWords: 50000,
                deadline: undefined,
                googleDocId: doc.id,
                googleDocUrl: doc.webViewLink,
              };

              Logger.info('PROJECT_CREATOR', '✅ 자동 프로젝트 생성 데이터 준비 완료', {
                title: projectData.title,
              });

              setIsCreating(true);
              await onCreate(projectData);

              Logger.info('PROJECT_CREATOR', '🎉 프로젝트 생성 완료 - Editor로 이동 중...');
            } catch (error) {
              Logger.error('PROJECT_CREATOR', '❌ 자동 프로젝트 생성 실패', error);
              setIsCreating(false);
              // 실패해도 alert 안 함 → 조용히 로그만 기록
            }
          }, 1000);
        }
      } catch (error) {
        Logger.error('PROJECT_CREATOR', 'Google Docs 내용 가져오기 중 오류', error);
        // ❌ alert 제거 → 문서 정보로 자동 생성 진행
        
        // 🔥 오류 발생해도 문서 정보로 자동 프로젝트 생성
        Logger.info('PROJECT_CREATOR', '⏳ 1초 후 자동 프로젝트 생성 시작 (오류 무시)...');
        setTimeout(async () => {
          try {
            Logger.info('PROJECT_CREATOR', '🚀 자동 프로젝트 생성 중 (오류 무시)...');
            
            const projectData: ProjectCreationData = {
              title: docName,
              description: `Google Docs에서 가져온 문서`,
              genre: 'fantasy', // 기본 장르
              platform: 'google-docs',
              content: undefined, // 콘텐츠 없음
              targetWords: 50000,
              deadline: undefined,
              googleDocId: doc.id,
              googleDocUrl: doc.webViewLink,
            };

            Logger.info('PROJECT_CREATOR', '✅ 자동 프로젝트 생성 데이터 준비 완료', {
              title: projectData.title,
            });

            setIsCreating(true);
            await onCreate(projectData);

            Logger.info('PROJECT_CREATOR', '🎉 프로젝트 생성 완료 - Editor로 이동 중...');
          } catch (error) {
            Logger.error('PROJECT_CREATOR', '❌ 자동 프로젝트 생성 실패', error);
            setIsCreating(false);
            // 실패해도 alert 안 함 → 조용히 로그만 기록
          }
        }, 1000);
      }
    }
  }; const handleCreate = async (): Promise<void> => {
    // 🔥 방어적 코딩: undefined 값에 대한 안전한 처리
    const safeTitle = title || '';
    const safeDescription = description || '';

    if (!safeTitle.trim()) {
      Logger.warn('PROJECT_CREATOR', 'Project title is required');
      return;
    }

    setIsCreating(true);
    try {
      const projectData: ProjectCreationData = {
        title: safeTitle.trim(),
        description: safeDescription.trim() || '새로운 프로젝트입니다.',
        genre: selectedGenre,
        platform: selectedPlatform,
        // 🔥 Google Docs인 경우 가져온 내용 사용, 아니면 기본 내용
        content: selectedPlatform === 'google-docs' && selectedGoogleDoc?.content
          ? selectedGoogleDoc.content
          : selectedPlatform === 'loop'
            ? getDefaultContent(selectedGenre)
            : undefined,
        targetWords: targetWords, // 🔥 목표 단어 수 포함
        deadline: deadline ? new Date(deadline) : undefined, // 🔥 목표 날짜 포함
        // 🔥 Google Docs 정보 포함
        googleDocId: selectedPlatform === 'google-docs' && selectedGoogleDoc ? selectedGoogleDoc.id : undefined,
        googleDocUrl: selectedPlatform === 'google-docs' && selectedGoogleDoc ? selectedGoogleDoc.webViewLink : undefined,
      };

      Logger.info('PROJECT_CREATOR', 'Creating new project', {
        title: projectData.title,
        platform: projectData.platform,
        genre: projectData.genre,
        googleDocId: projectData.googleDocId,
        googleDocUrl: projectData.googleDocUrl,
        hasContent: !!projectData.content,
        contentLength: projectData.content?.length || 0
      });

      await onCreate(projectData);

      // 성공 시 폼 리셋
      setTitle('');
      setDescription('');
      setSelectedGenre('unknown');
      setSelectedPlatform('loop');
      setTargetWords(10000);
      setDeadline('');
      setSelectedGoogleDoc(null); // 🔥 Google Docs 정보 초기화
      onClose();

    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'Failed to create project', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlatformSelect = async (platformId: string): Promise<void> => {
    setSelectedPlatform(platformId);
    Logger.debug('PROJECT_CREATOR', `Platform selected: ${platformId}`);

    // 🔥 Google Docs 선택 시 연동 처리 시작
    if (platformId === 'google-docs') {
      await handleGoogleDocsIntegration();
    }

    // 🔥 파일 가져오기 선택 시 처리
    if (platformId === 'import') {
      await handleFileImport();
    }
  };

  const handleGenreSelect = (genreId: string): void => {
    setSelectedGenre(genreId as KoreanWebNovelGenre);
    Logger.debug('PROJECT_CREATOR', `Genre selected: ${genreId}`);
  };

  const getDefaultContent = (genre: KoreanWebNovelGenre): string => {
    const templates: Record<KoreanWebNovelGenre, string> = {
      'romance-fantasy': `제1장: 새로운 세계\n\n로맨스와 판타지가 어우러진 새로운 이야기.\n\n✍️ 작성 팁:\n- 주인공의 감정을 생생하게 표현해보세요\n- 판타지 세계관을 독자가 느낄 수 있게 묘사하세요`,
      'romance': `제1장: 운명의 만남\n\n두 사람의 로맨스 스토리를 시작해보세요.\n\n✍️ 작성 팁:\n- 캐릭터 간의 감정 변화를 디테일하게 표현하세요\n- 독자가 감정이입할 수 있는 장면을 그려보세요`,
      'bl': `제1장: 숨겨진 감정\n\nBL 장르의 감정 표현을 자유롭게 담아보세요.\n\n✍️ 작성 팁:\n- 캐릭터들의 감정 변화를 생생하게 표현하세요\n- 신뢰와 감정의 성장을 보여주세요`,
      'modern-fantasy': `제1장: 이상한 일이 일어나다\n\n현대를 배경으로 한 판타지 스토리.\n\n✍️ 작성 팁:\n- 현대와 판타지 요소를 자연스럽게 섞어보세요\n- 세계관의 규칙을 명확히 설정하세요`,
      'hunter': `제1장: 각성\n\n헌터 장르의 액션 어드벤처를 시작해보세요.\n\n✍️ 작성 팁:\n- 전투 장면을 박진감 있게 표현하세요\n- 주인공의 성장 과정을 보여주세요`,
      'fantasy': `제1장: 새로운 세계로의 여정\n\n판타지 세계의 모험을 시작해보세요.\n\n✍️ 작성 팁:\n- 세계관을 상세하게 설정하세요\n- 독자가 세계에 몰입할 수 있게 묘사하세요`,
      'martial-arts': `제1장: 무림의 입장\n\n무협지의 액션과 인간관계를 담아보세요.\n\n✍️ 작성 팁:\n- 무술 체계를 명확하게 설정하세요\n- 인물의 성격과 무술 스타일의 조화를 보여주세요`,
      'historical': `제1장: 역사 속 발자국\n\n역사 배경의 스토리를 창작해보세요.\n\n✍️ 작성 팁:\n- 시대 배경을 정확하게 반영하세요\n- 역사적 사건과 개인의 이야기를 어우러지게 표현하세요`,
      'unknown': `새로운 프로젝트가 시작되었습니다.\n\n자유롭게 내용을 작성해보세요.`,
    };

    return templates[genre] || templates['unknown'];
  };

  return (
    <>
      {isOpen && Logger.debug('PROJECT_CREATOR', '🎨 ProjectCreator isOpen=true, rendering overlay')}
      <div 
        className={PROJECT_CREATOR_STYLES.overlay} 
        onClick={onClose}
        style={{ display: isOpen ? 'flex' : 'none' }}
      >
        <div className={PROJECT_CREATOR_STYLES.modal} onClick={e => e.stopPropagation()} data-tour="project-creator-container">
          {/* 헤더 */}
          <div className={PROJECT_CREATOR_STYLES.header}>
            <h2 className={PROJECT_CREATOR_STYLES.title}>새 프로젝트 만들기</h2>
            <button
              onClick={() => {
                // 🔥 **중요**: 튜토리얼 상태일 때만 completeTutorial() 호출
                // 조건: currentTutorialId === 'project-creator' AND isActive === true
                if (currentTutorialId === 'project-creator' && isActive) {
                  Logger.info('ProjectCreator', '🎬 X button: completeTutorial() → Dashboard');
                  completeTutorial().catch(err => {
                    Logger.error('ProjectCreator', 'Error completing tutorial', err);
                  }).finally(() => {
                    // 🔥 completeTutorial 완료 후 모달 닫기 + Dashboard로 네비게이션
                    Logger.info('ProjectCreator', '🚪 X button: Closing modal + navigate to /dashboard');
                    onClose();
                    // 🔥 모달 닫기와 동시에 Dashboard로 이동
                    setTimeout(() => {
                      navigate('/dashboard');
                      Logger.info('ProjectCreator', '✅ Navigated to /dashboard');
                    }, 0);
                  });
                } else {
                  // 비튜토리얼 상태: 그냥 모달 닫기
                  Logger.info('ProjectCreator', '❌ X button: onClose()');
                  onClose();
                }
              }}
              className={PROJECT_CREATOR_STYLES.closeButton}
              aria-label="닫기"
              data-tour="project-creator-close-btn"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 내용 */}
          <div className={PROJECT_CREATOR_STYLES.content}>
            {/* 플랫폼 선택 */}
            <div className={PROJECT_CREATOR_STYLES.platformSection}>
              <h3 className={PROJECT_CREATOR_STYLES.sectionTitle}>작성 플랫폼 선택</h3>
              <div className={PROJECT_CREATOR_STYLES.platformGrid}>
                {PLATFORM_OPTIONS.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div
                      key={platform.id}
                      data-tour={`platform-option-${platform.id}`}
                      className={`${PROJECT_CREATOR_STYLES.platformCard} ${selectedPlatform === platform.id
                        ? PROJECT_CREATOR_STYLES.platformCardSelected
                        : PROJECT_CREATOR_STYLES.platformCardDefault
                        }`}
                      onClick={() => handlePlatformSelect(platform.id)}
                    >
                      <Icon className={PROJECT_CREATOR_STYLES.platformIcon} />
                      <div className={PROJECT_CREATOR_STYLES.platformTitle}>
                        {platform.name}
                        {platform.recommended && (
                          <Badge className="ml-2 text-xs bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent-primary))] border border-[hsl(var(--accent))]/40">
                            추천
                          </Badge>
                        )}
                        {platform.external && (
                          <ExternalLink className="inline w-4 h-4 ml-1" />
                        )}
                      </div>
                      <p className={PROJECT_CREATOR_STYLES.platformDescription}>
                        {platform.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🔥 Google Docs 연동 상태 표시 */}
            {selectedPlatform === 'google-docs' && selectedGoogleDoc && (
              <div className="mb-6 p-4 rounded-lg border bg-[color:var(--success-light)] border-[color:var(--success)]/40 text-[color:var(--success)]/90">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[color:var(--success-light)]/70 text-[color:var(--success)]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[color:var(--success)]">
                      📄 Google Docs 문서 연결됨
                    </h4>
                    <p className="mt-1 text-sm text-[color:var(--success)]">
                      <strong>{selectedGoogleDoc.title || selectedGoogleDoc.name}</strong>
                    </p>
                    {selectedGoogleDoc.content && (
                      <p className="mt-1 text-xs text-[color:var(--success)]">
                        ✅ 내용 가져오기 완료 ({selectedGoogleDoc.content.length}자)
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[color:var(--success)]">
                      💡 프로젝트 생성 후 Loop에서 바로 편집할 수 있습니다
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 프로젝트 정보 */}
            <div className={PROJECT_CREATOR_STYLES.formSection} data-tour="project-details-section">
              <h3 className={PROJECT_CREATOR_STYLES.sectionTitle}>프로젝트 정보</h3>

              <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                <label className={PROJECT_CREATOR_STYLES.label} htmlFor="project-title">
                  프로젝트 제목 *
                </label>
                <Input
                  id="project-title"
                  data-tour="project-input-title"
                  type="text"
                  placeholder="예: 나의 첫 번째 소설"
                  value={title}
                  onChange={(e) => setTitle(e.target.value || '')}
                  maxLength={100}
                />
              </div>

              <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                <label className={PROJECT_CREATOR_STYLES.label} htmlFor="project-description">
                  프로젝트 설명
                </label>
                <Textarea
                  id="project-description"
                  placeholder="프로젝트에 대한 간단한 설명을 입력하세요..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value || '')}
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                <label className={PROJECT_CREATOR_STYLES.label}>장르</label>
                <div className={PROJECT_CREATOR_STYLES.genreGrid} data-tour="project-select-genre">
                  {GENRE_OPTIONS.map((genre) => {
                    const Icon = genre.icon;
                    return (
                      <button
                        key={genre.id}
                        className={`${PROJECT_CREATOR_STYLES.genreButton} ${selectedGenre === genre.id
                          ? PROJECT_CREATOR_STYLES.genreSelected
                          : PROJECT_CREATOR_STYLES.genreDefault
                          }`}
                        onClick={() => handleGenreSelect(genre.id)}
                      >
                        <Icon className="w-4 h-4 inline mr-1" />
                        {genre.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 🔥 목표 설정 섹션 */}
            <div className={PROJECT_CREATOR_STYLES.formSection}>
              <h3 className={PROJECT_CREATOR_STYLES.sectionTitle}>작성 목표 설정</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                  <label className={PROJECT_CREATOR_STYLES.label} htmlFor="target-words">
                    목표 단어 수
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="target-words"
                      data-tour="project-input-target-words"
                      type="number"
                      placeholder="10000"
                      value={targetWords}
                      onChange={(e) => setTargetWords(Number(e.target.value) || 0)}
                      min="100"
                      max="1000000"
                      step="100"
                    />
                    <span className="text-sm text-muted-foreground">단어</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    권장: 소설 50,000+ / 에세이 5,000+ / 블로그 1,000+
                  </div>
                </div>

                <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                  <label className={PROJECT_CREATOR_STYLES.label} htmlFor="deadline">
                    완료 목표 날짜 (선택사항)
                  </label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    목표 날짜를 설정하면 일일 권장 작성량을 계산해드립니다
                  </div>
                </div>
              </div>

              {/* 🔥 목표 미리보기 */}
              {targetWords > 0 && (
                <div className="mt-4 p-3 rounded-lg border bg-[hsl(var(--accent))]/15 border-[hsl(var(--accent))]/40">
                  <div className="flex items-center space-x-2 text-[hsl(var(--accent-primary))]">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">목표 미리보기</span>
                  </div>
                  <div className="mt-2 text-sm text-[hsl(var(--accent-primary))]">
                    총 목표: {targetWords.toLocaleString()}단어
                    {deadline && (() => {
                      const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const dailyWords = Math.ceil(targetWords / days);
                      return days > 0 ? (
                        <span className="block mt-1">
                          일일 권장: {dailyWords.toLocaleString()}단어 (약 {Math.ceil(dailyWords / 200)}분 소요)
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 푸터 */}
          <div className={PROJECT_CREATOR_STYLES.footer}>
            <button
              onClick={onClose}
              className={PROJECT_CREATOR_STYLES.secondaryButton}
            >
              취소
            </button>
            <Button
              onClick={handleCreate}
              disabled={!(title || '').trim() || isCreating}
              className={PROJECT_CREATOR_STYLES.primaryButton}
            >
              {isCreating ? '생성 중...' : '프로젝트 만들기'}
            </Button>
          </div>
        </div>
      </div>

      {/* 🔥 Google Docs 선택 모달 */}
      {showGoogleDocsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[hsl(var(--background))]/75 supports-[backdrop-filter]:bg-[hsl(var(--background))]/60 backdrop-blur-md">
          <div className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-border">
            <div className="flex items-center justify-between p-6 border-b border-border bg-card/95 supports-[backdrop-filter]:bg-card/80">
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">
                Google Docs 선택
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGoogleDocsModal(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <p className="text-sm text-muted-foreground mb-4">
                가져올 Google Docs 문서를 선택하세요:
              </p>

              <div className="space-y-3">
                {googleDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    onClick={() => handleGoogleDocSelect(doc)}
                    className="p-4 border border-border rounded-lg cursor-pointer transition-all bg-card hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[hsl(var(--accent-primary))] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[hsl(var(--foreground))] truncate">
                          {doc.name || doc.title || doc.webViewLink?.split('/').pop() || `문서 ${index + 1}`}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          수정됨: {new Date(doc.modifiedTime).toLocaleDateString('ko-KR')}
                        </p>
                        {doc.webViewLink && (
                          <a
                            href={doc.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-[hsl(var(--accent-primary))] hover:text-[hsl(var(--accent-hover))] hover:underline mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Google Docs에서 열기
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {googleDocs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  문서를 찾을 수 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectCreator;
