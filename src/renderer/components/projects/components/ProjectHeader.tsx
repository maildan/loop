'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Save,
  Share2,
  Download,
  Trash2,
  Sidebar,
  Eye,
  EyeOff,
  MessageCircle,
  Sun,
  Moon,
  Copy,
  FileDown,
  Maximize2,
  Focus,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Cloud,
  Minimize2  // 🔥 Zen mode 아이콘
} from 'lucide-react';
import { Logger } from '../../../../shared/logger';

// 🔥 프리컴파일된 스타일 (기가차드 원칙)
const PROJECT_HEADER_STYLES = {
  header: 'flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 w-full animate-slideDown',
  headerLeft: 'flex items-center gap-3',
  headerCenter: 'flex items-center gap-3 max-w-md',
  headerRight: 'flex items-center gap-2 relative',

  backButton: 'flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors',
  titleInput: 'border-none bg-transparent text-lg font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 outline-none focus:ring-0 focus:border-transparent',
  iconButton: 'flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 relative group outline-none focus:ring-0 focus:border-transparent border-none',
  iconButtonActive: 'flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 relative group outline-none focus:ring-0 focus:border-transparent border-none',

  // 🔥 툴팁 스타일 (더 아래로 위치 조정)
  tooltip: 'absolute top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50',
  tooltipWithShortcut: 'absolute top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50',
  shortcut: 'block text-gray-400 text-xs mt-1',

  // 슬라이드바 스타일
  slidebar: 'fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out z-40',
  slidebarOpen: 'translate-x-0',
  slidebarClosed: 'translate-x-full',
  slidebarHeader: 'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700',
  slidebarTitle: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
  slidebarContent: 'p-4 overflow-y-auto h-full',
  slidebarOverlay: 'fixed inset-0 bg-black/50 z-30',
} as const;

// 🔥 HeaderAction 타입 정의
interface HeaderAction {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  shortcut?: string;
  onClick: () => void;
  isActive?: boolean;
}

// 슬라이드바 타입 (테마 제거)
type SlidebarType = null;

interface ProjectHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onBack: () => void;

  // 🔥 사이드바 컨트롤
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;

  // 🔥 AI 창작 파트너 사이드바 컨트롤
  showRightSidebar?: boolean;
  onToggleAISidebar?: () => void;

  // 🔥 Zen mode 컨트롤
  isZenMode?: boolean;
  onToggleZenMode?: () => void;

  // 🔥 프로젝트 액션들
  onSave: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDelete: () => void;

  // 🔥 Google Docs 연동 관련
  isGoogleDocsProject?: boolean;
  googleDocMeta?: {
    googleDocId?: string;
    googleDocUrl?: string;
    originalDescription?: string;
    isGoogleDocsProject?: boolean;
  } | null;
  isSyncingWithGoogle?: boolean;
  onSyncWithGoogle?: () => void;
  onOpenGoogleDocs?: () => void;
}

export function ProjectHeader({
  title,
  onTitleChange,
  onBack,
  sidebarCollapsed,
  onToggleSidebar,
  showRightSidebar = false,
  onToggleAISidebar,
  isZenMode = false,
  onToggleZenMode,
  onSave,
  onShare,
  onDownload,
  onDelete,
  // 🔥 Google Docs 관련 props
  isGoogleDocsProject = false,
  googleDocMeta = null,
  isSyncingWithGoogle = false,
  onSyncWithGoogle,
  onOpenGoogleDocs
}: ProjectHeaderProps): React.ReactElement | null {

  const [activeSlideBar, setActiveSlideBar] = useState<SlidebarType>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );

  // 🔥 슬라이드바 토글 함수
  const toggleSlideBar = (type: SlidebarType): void => {
    setActiveSlideBar(activeSlideBar === type ? null : type);
  };

  // 🔥 테마 원클릭 토글
  const toggleTheme = (): void => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    Logger.info('PROJECT_HEADER', `Theme changed to ${newDarkMode ? 'dark' : 'light'}`);
  };

  // 🔥 에디터 내용 복사 (QA 가이드: 에디터 내용 복사 구현)
  const copyContent = async (): Promise<void> => {
    try {
      // 에디터에서 텍스트 내용 가져오기 위한 이벤트 발생
      const copyEvent = new CustomEvent('project:copyContent', {
        detail: {
          callback: async (content: string) => {
            try {
              await navigator.clipboard.writeText(content);
              Logger.info('PROJECT_HEADER', 'Editor content copied to clipboard', {
                length: content.length
              });
            } catch (error) {
              Logger.error('PROJECT_HEADER', 'Failed to copy content', error);
            }
          }
        }
      });
      window.dispatchEvent(copyEvent);

      Logger.info('PROJECT_HEADER', 'Copy content event dispatched');
    } catch (error) {
      Logger.error('PROJECT_HEADER', 'Failed to copy content', error);
    }
  };

  // 🔥 헤더 액션 정의 (CRUD + 복사, 공유 개선)
  const headerActions: HeaderAction[] = [
    { icon: Save, label: '저장', shortcut: 'Cmd+S', onClick: onSave },
    { icon: Copy, label: '복사', shortcut: 'Cmd+C', onClick: copyContent },
    { icon: Share2, label: '공유', shortcut: 'Cmd+Shift+S', onClick: onShare },
    { icon: FileDown, label: '내보내기', shortcut: 'Cmd+E', onClick: onDownload },
    // 🔥 Google Docs 관련 액션들 (Google Docs 프로젝트인 경우에만)
    ...(isGoogleDocsProject ? [
      {
        icon: isSyncingWithGoogle ? RefreshCw : Cloud,
        label: isSyncingWithGoogle ? '동기화 중...' : 'Google Docs와 동기화',
        onClick: onSyncWithGoogle || (() => { }),
        isActive: isSyncingWithGoogle
      },
      {
        icon: ExternalLink,
        label: 'Google Docs에서 열기',
        onClick: onOpenGoogleDocs || (() => { })
      }
    ] : []),
    { icon: Trash2, label: '삭제', shortcut: 'Cmd+Del', onClick: onDelete },
  ];

  // 🔥 툴바 확장 액션들 (테마 원클릭, 복사, zen mode)
  const toolbarActions: HeaderAction[] = [
    { icon: Copy, label: '콘텐츠 복사', shortcut: 'Cmd+C', onClick: copyContent },
    {
      icon: Minimize2,
      label: isZenMode ? 'Zen 모드 해제' : 'Zen 모드',
      shortcut: 'Ctrl+Alt+H',
      onClick: onToggleZenMode || (() => { }),
      isActive: isZenMode
    },
    {
      icon: isDarkMode ? Sun : Moon,
      label: isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경',
      onClick: toggleTheme
    },
  ];

  // 🔥 ESC 키 이벤트 리스너 (슬라이드바 우선 닫기)
  useEffect(() => {
    const handleGlobalEscape = (event: CustomEvent): void => {
      if (activeSlideBar) {
        setActiveSlideBar(null);
        event.preventDefault(); // 이벤트 처리됨을 표시
        Logger.info('PROJECT_HEADER', 'Sidebar closed by ESC key');
      }
    };

    window.addEventListener('global:escape', handleGlobalEscape as EventListener);
    return () => window.removeEventListener('global:escape', handleGlobalEscape as EventListener);
  }, [activeSlideBar]);

  return (
    <>
      <div className={PROJECT_HEADER_STYLES.header}>
        {/* 🔥 프로젝트 제목 (왼쪽) */}
        <div className={PROJECT_HEADER_STYLES.headerCenter}>
          <div className="flex items-center gap-2">
            {/* 🔥 Google Docs 표시 배지 */}
            {isGoogleDocsProject && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-xs font-medium">
                <Cloud size={12} />
                <span>Google Docs</span>
              </div>
            )}
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="프로젝트 제목"
              className={PROJECT_HEADER_STYLES.titleInput}
              style={{ width: '200px' }}
            />
          </div>
        </div>

        {/* 🔥 액션 버튼들 (오른쪽) */}
        <div className={PROJECT_HEADER_STYLES.headerRight}>
          {/* 프로젝트 액션들 */}
          {headerActions.map((action, index) => (
            <button
              key={`action-${index}`}
              className={`${PROJECT_HEADER_STYLES.iconButton} group relative`}
              onClick={action.onClick}
            >
              <action.icon size={16} />
              {/* 🔥 Context7 패턴: 올바른 툴팁 구현 */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div>{action.label}</div>
                {action.shortcut && <div className="text-gray-400 text-xs mt-1">{action.shortcut}</div>}
              </div>
            </button>
          ))}

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* 툴바 확장 액션들 */}
          {toolbarActions.map((action, index) => (
            <button
              key={`toolbar-${index}`}
              className={`${action.isActive ? PROJECT_HEADER_STYLES.iconButtonActive : PROJECT_HEADER_STYLES.iconButton} group relative`}
              onClick={action.onClick}
            >
              <action.icon size={16} />
              {/* 🔥 Context7 패턴: 올바른 툴팁 구현 */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                {action.label}
              </div>
            </button>
          ))}

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* 🔥 AI 창작 파트너 토글 */}
          {onToggleAISidebar && (
            <button
              className={`${showRightSidebar ? PROJECT_HEADER_STYLES.iconButtonActive : PROJECT_HEADER_STYLES.iconButton} group relative`}
              onClick={onToggleAISidebar}
            >
              <Sparkles size={16} />
              {/* 🔥 Context7 패턴: 올바른 툴팁 구현 */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                <div>창작 파트너</div>
                <div className="text-blue-200 text-xs mt-1">함께 써봐요</div>
              </div>
            </button>
          )}

          {/* UI 컨트롤들 */}
          <button
            className={`${sidebarCollapsed ? PROJECT_HEADER_STYLES.iconButton : PROJECT_HEADER_STYLES.iconButtonActive} group relative`}
            onClick={onToggleSidebar}
          >
            <Sidebar size={16} />
          </button>
        </div>
      </div>

      {/* 🔥 슬라이드바 오버레이 */}
      {activeSlideBar && (
        <div
          className={PROJECT_HEADER_STYLES.slidebarOverlay}
          onClick={() => setActiveSlideBar(null)}
        />
      )}
    </>
  );
}
