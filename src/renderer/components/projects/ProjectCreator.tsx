'use client';

// 프로젝트 생성

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';
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
  overlay: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4',
  modal: 'bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-slate-900/50 w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700',
  header: 'flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  title: 'text-2xl font-bold text-slate-900 dark:text-slate-100',
  closeButton: 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800',
  content: 'p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-white dark:bg-slate-900',

  // 플랫폼 선택
  platformSection: 'mb-8',
  sectionTitle: 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4',
  platformGrid: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  platformCard: 'p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20',
  platformCardSelected: 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/20',
  platformCardDefault: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
  platformIcon: 'w-8 h-8 text-blue-600 dark:text-blue-400 mb-2',
  platformTitle: 'font-semibold text-slate-900 dark:text-slate-100 mb-1',
  platformDescription: 'text-sm text-slate-600 dark:text-slate-400',

  // 프로젝트 정보
  formSection: 'mb-6',
  label: 'block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2',
  inputGroup: 'mb-4',
  genreGrid: 'grid grid-cols-2 md:grid-cols-4 gap-2 mt-2',
  genreButton: 'p-2 text-sm border rounded-lg transition-colors',
  genreSelected: 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
  genreDefault: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800',

  // 버튼
  footer: 'flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
  secondaryButton: 'px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800',
  primaryButton: 'px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
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

// 🔥 장르 옵션
const GENRE_OPTIONS = [
  { id: 'novel', name: '소설', icon: BookOpen },
  { id: 'essay', name: '에세이', icon: Coffee },
  { id: 'blog', name: '블로그', icon: Newspaper },
  { id: 'tech', name: '기술', icon: Code },
  { id: 'diary', name: '일기', icon: FileText },
  { id: 'poem', name: '시', icon: Lightbulb },
  { id: 'script', name: '대본', icon: FileText },
  { id: 'other', name: '기타', icon: Plus },
] as const;

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
  const [selectedGenre, setSelectedGenre] = useState<string>('novel');
  const [targetWords, setTargetWords] = useState<number>(10000); // 🔥 목표 단어 수
  const [deadline, setDeadline] = useState<string>(''); // 🔥 완료 목표 날짜
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // 🔥 Google Docs 선택 모달
  const [showGoogleDocsModal, setShowGoogleDocsModal] = useState<boolean>(false);
  const [googleDocs, setGoogleDocs] = useState<any[]>([]);

  // 🔥 선택된 Google Docs 문서 정보
  const [selectedGoogleDoc, setSelectedGoogleDoc] = useState<any>(null);

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

  if (!isOpen) return null;

  // 🔥 Google Docs 연동 처리 (강화된 인증 상태 확인)
  const handleGoogleDocsIntegration = async () => {
    try {
      Logger.info('PROJECT_CREATOR', 'Google Docs 연동 시작');

      if (!window.electronAPI) {
        alert('데스크톱 앱에서만 사용 가능합니다');
        return;
      }

      // 🔥 먼저 현재 인증 상태 확인 (개선된 getAuthStatus 활용)
      Logger.info('PROJECT_CREATOR', '현재 인증 상태 확인 중...');
      const authStatus = await window.electronAPI?.oauth?.getAuthStatus();

      Logger.info('PROJECT_CREATOR', '인증 상태 결과:', authStatus);

      if (authStatus && authStatus.success && authStatus.data && authStatus.data.isAuthenticated) {
        // 🔥 이미 인증된 경우 바로 문서 목록 표시
        Logger.info('PROJECT_CREATOR', '✅ 이미 인증됨 - 문서 목록 표시', {
          userEmail: authStatus.data.userEmail
        });
        await showGoogleDocsList();
        return;
      }

      // 🔥 인증이 필요한 경우 OAuth 브라우저 인증 시작
      Logger.info('PROJECT_CREATOR', '❌ 인증 필요 - OAuth 시작');
      try {
        // optional login hint from localStorage to suggest account
        const preferred = typeof window !== 'undefined' ? localStorage.getItem('preferredGoogleEmail') : null;
        const authResult = await window.electronAPI?.oauth?.startGoogleAuth(preferred || undefined);
        Logger.info('PROJECT_CREATOR', 'OAuth 시작 결과:', authResult);

        if (authResult && authResult.success) {
          alert('브라우저에서 Google 계정으로 로그인해주세요.\n로그인 완료 후 자동으로 문서 목록이 표시됩니다.');
        } else {
          throw new Error(authResult?.error || 'OAuth 시작 실패');
        }
      } catch (authError) {
        Logger.error('PROJECT_CREATOR', 'OAuth 시작 실패:', authError);
        alert(`Google 인증 시작 실패: ${authError instanceof Error ? authError.message : '알 수 없는 오류'}`);
      }
    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'Google Docs 연동 실패:', error);
      alert(`Google Docs 연동 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 🔥 Google Docs 목록 표시 (강화된 오류 처리 및 인증 재확인)
  const showGoogleDocsList = async () => {
    try {
      Logger.info('PROJECT_CREATOR', 'Google Docs 목록 조회 시작');

      // 🔥 문서 목록 조회 전 인증 상태 재확인
      const authCheck = await window.electronAPI?.oauth?.getAuthStatus();
      if (!authCheck || !authCheck.success || !authCheck.data || !authCheck.data.isAuthenticated) {
        Logger.warn('PROJECT_CREATOR', '인증 상태 확인 실패:', authCheck);
        alert('Google 인증이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }

      Logger.info('PROJECT_CREATOR', '✅ 인증 확인됨, 문서 목록 조회 중...', {
        userEmail: authCheck.data.userEmail
      });

      const docsResult = await window.electronAPI?.oauth?.getGoogleDocuments();

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
    } catch (error) {
      Logger.error('PROJECT_CREATOR', 'Google Docs 목록 조회 중 예외 발생:', error);
      alert(`문서 목록 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 🔥 Google Docs 선택 핸들러 (방어적 코딩 + 문서 정보 저장 + 내용 가져오기)
  const handleGoogleDocSelect = async (doc: any): Promise<void> => {
    const docName = doc?.name || doc?.title || '제목 없음';
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

    // 🔥 문서 내용 가져오기 시도
    if (doc?.id && window.electronAPI?.oauth?.importGoogleDoc) {
      try {
        Logger.info('PROJECT_CREATOR', 'Google Docs 내용 가져오는 중...', { documentId: doc.id });
        const result = await window.electronAPI.oauth.importGoogleDoc(doc.id);

        if (result.success && result.data?.content) {
          Logger.info('PROJECT_CREATOR', 'Google Docs 내용 가져오기 성공', {
            contentLength: result.data.content.length
          });
          // 가져온 내용은 selectedGoogleDoc에 저장하여 나중에 프로젝트 생성 시 사용
          setSelectedGoogleDoc({
            ...doc,
            content: result.data.content
          });
        } else {
          Logger.warn('PROJECT_CREATOR', 'Google Docs 내용 가져오기 실패', result.error);
        }
      } catch (error) {
        Logger.error('PROJECT_CREATOR', 'Google Docs 내용 가져오기 중 오류', error);
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
      setSelectedGenre('novel');
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
  };

  const handleGenreSelect = (genreId: string): void => {
    setSelectedGenre(genreId);
    Logger.debug('PROJECT_CREATOR', `Genre selected: ${genreId}`);
  };

  const getDefaultContent = (genre: string): string => {
    const templates: Record<string, string> = {
      novel: `제1장: 새로운 시작\n\n여기서부터 당신의 이야기가 시작됩니다.\n\n✍️ 작성 팁:\n- 등장인물을 구체적으로 묘사해보세요\n- 독자가 몰입할 수 있는 장면을 그려보세요\n- 하루에 500단어씩 꾸준히 작성해보세요`,
      essay: `# 제목을 여기에 입력하세요\n\n오늘의 생각을 자유롭게 써보세요.\n\n일상의 작은 순간들이 때로는 가장 의미 있는 글이 됩니다.`,
      blog: `# 블로그 포스트 제목\n\n## 소개\n\n독자들과 공유하고 싶은 이야기를 써보세요.\n\n## 본문\n\n경험, 배움, 생각을 자유롭게 표현해보세요.`,
      tech: `# 기술 문서 제목\n\n## 개요\n\n## 문제 정의\n\n## 해결 방법\n\n## 결론\n\n코드와 설명을 함께 작성해보세요.`,
      diary: `${new Date().toLocaleDateString('ko-KR')} 일기\n\n오늘 있었던 일들을 기록해보세요.\n\n소중한 순간들을 글로 남겨보세요.`,
      other: `새로운 프로젝트가 시작되었습니다.\n\n자유롭게 내용을 작성해보세요.`,
    };

    // genre가 undefined일 경우 대비하여 기본값 제공
    const defaultTemplate = `새로운 프로젝트가 시작되었습니다.\n\n자유롭게 내용을 작성해보세요.`;

    if (!genre) {
      return defaultTemplate;
    }

    return templates[genre] ?? templates.other ?? defaultTemplate;
  };

  return (
    <>
      <div className={PROJECT_CREATOR_STYLES.overlay} onClick={onClose}>
        <div className={PROJECT_CREATOR_STYLES.modal} onClick={e => e.stopPropagation()}>
          {/* 헤더 */}
          <div className={PROJECT_CREATOR_STYLES.header}>
            <h2 className={PROJECT_CREATOR_STYLES.title}>새 프로젝트 만들기</h2>
            <button
              onClick={onClose}
              className={PROJECT_CREATOR_STYLES.closeButton}
              aria-label="닫기"
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
                          <Badge className="ml-2 text-xs bg-blue-100 text-blue-700">추천</Badge>
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

            {/* 프로젝트 정보 */}
            <div className={PROJECT_CREATOR_STYLES.formSection}>
              <h3 className={PROJECT_CREATOR_STYLES.sectionTitle}>프로젝트 정보</h3>

              <div className={PROJECT_CREATOR_STYLES.inputGroup}>
                <label className={PROJECT_CREATOR_STYLES.label} htmlFor="project-title">
                  프로젝트 제목 *
                </label>
                <Input
                  id="project-title"
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
                <div className={PROJECT_CREATOR_STYLES.genreGrid}>
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
                      type="number"
                      placeholder="10000"
                      value={targetWords}
                      onChange={(e) => setTargetWords(Number(e.target.value) || 0)}
                      min="100"
                      max="1000000"
                      step="100"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">단어</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    목표 날짜를 설정하면 일일 권장 작성량을 계산해드립니다
                  </div>
                </div>
              </div>

              {/* 🔥 목표 미리보기 */}
              {targetWords > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">목표 미리보기</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                가져올 Google Docs 문서를 선택하세요:
              </p>

              <div className="space-y-3">
                {googleDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    onClick={() => handleGoogleDocSelect(doc)}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {doc.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          수정됨: {new Date(doc.modifiedTime).toLocaleDateString('ko-KR')}
                        </p>
                        {doc.webViewLink && (
                          <a
                            href={doc.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
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
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
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
