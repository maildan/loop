'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../app/settings/hooks/useSettings';
import { Avatar } from '../ui/Avatar';
import {
  Home,
  Folder,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Wifi,
  WifiOff,
  type LucideIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { Badge } from '../ui/Badge';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수 (단순화된 상태)
const SIDEBAR_STYLES = {
  container: 'relative flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300',
  collapsed: 'w-0 overflow-hidden', // 🔥 완전히 숨김 (아이콘 없음)
  expanded: 'w-64',
  hoverContent: 'absolute left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-l border-slate-200 dark:border-slate-700 shadow-lg z-30',
  logoSection: 'h-auto min-h-[4rem] flex flex-col justify-center border-b border-slate-200 dark:border-slate-700 px-6 py-3',
  logoText: 'text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
  profileSection: 'border-b border-slate-200 dark:border-slate-700 p-4',
  profileContent: 'flex items-center gap-3',
  profileInfo: 'flex-1',
  profileName: 'font-medium text-slate-900 dark:text-slate-100 text-sm',
  profileStatus: 'flex items-center gap-1 mt-0.5',
  statusDot: 'w-1.5 h-1.5 bg-green-500 rounded-full',
  statusText: 'text-xs text-slate-500 dark:text-slate-400',
  collapseButton: 'h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
  navSection: 'flex-1 py-4',
  navList: 'space-y-1 px-3',
  navItem: 'flex items-center h-10 px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 group cursor-pointer',
  navItemActive: 'flex items-center h-10 px-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg font-medium',
  icon: 'w-5 h-5 group-hover:scale-110 transition-transform duration-150 flex-shrink-0',
  text: 'ml-3 font-medium',
  badge: 'ml-auto',
  bottomSection: 'border-t border-slate-200 dark:border-slate-700 p-3',
} as const;

// 🔥 사이드바 네비게이션 아이템들 (컴포넌트 외부로 이동, id 추가)
const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  {
    id: 'home',
    icon: Home,
    label: '홈',
    href: '/',
    ariaLabel: '홈으로 이동'
  },
  {
    id: 'projects',
    icon: Folder,
    label: '프로젝트',
    href: '/projects',
    ariaLabel: '프로젝트 목록으로 이동'
  },
  {
    id: 'dashboard',
    icon: BarChart3,
    label: '대시보드',
    href: '/dashboard',
    ariaLabel: '대시보드로 이동'
  },
  {
    id: 'ai',
    icon: Sparkles,
    label: 'AI 어시스턴트',
    href: '/ai',
    badge: 3,
    ariaLabel: 'AI 어시스턴트로 이동'
  },
  {
    id: 'settings',
    icon: Settings,
    label: '설정',
    href: '/settings',
    ariaLabel: '설정으로 이동'
  },
] as const;

// 🔥 상수들
const DEFAULT_AVATAR = '/static/avatar-default.png';

// 🔥 기가차드 규칙: 명시적 타입 정의
interface SidebarItem {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly href: string;
  readonly badge?: number;
  readonly ariaLabel?: string;
}

export interface AppSidebarProps {
  readonly activeRoute?: string;
  readonly onNavigate?: (href: string) => void;
  readonly collapsed?: boolean;
  readonly onToggleCollapse?: () => void;
}

export function AppSidebar({
  activeRoute = '/',
  onNavigate,
  collapsed: controlledCollapsed,
  onToggleCollapse
}: AppSidebarProps): React.ReactElement {

  // 🔥 Next.js 라우터와 경로 정보 사용
  const router = useRouter();
  const pathname = usePathname();

  const authCtx = useAuth() as any;
  const { auth: googleUserInfo, loadAuthStatus, loaded: authLoaded } = authCtx;

  // settings hook for account-local profile (displayName, avatar)
  const { settings: loadedSettings, loading: settingsLoading, setSettings, updateSetting } = useSettings();

  // 🔥 최적화된 상태 관리 (중복 제거)
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const isControlled = controlledCollapsed !== undefined;

  // 🔥 settings에서 collapse 상태 가져오기 + 강제 테스트
  const settingsCollapsed = loadedSettings?.ui?.appSidebarCollapsed ?? false;

  // 🔥 디버깅: 강제로 collapsed를 true로 설정해서 테스트
  const collapsed = process.env.NODE_ENV === 'development'
    ? true  // 개발 모드에서는 항상 collapsed로 테스트
    : (isControlled ? controlledCollapsed : settingsCollapsed);

  // 🔥 hover 영역 크기 설정 (Next.js 문양까지만)
  const hoverAreaClass = useMemo(() => {
    const isProjectPage = pathname.startsWith('/projects/');
    return isProjectPage ? 'w-8' : 'w-12'; // 프로젝트 페이지: 32px, 다른 페이지: 48px (Next.js 문양까지만)
  }, [pathname]);

  // Prefer account settings when not authenticated via Google. If Google auth present, use google profile.
  const accountProfile = loadedSettings?.account;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // unify visible profile for legacy UI uses
  const visibleProfile: {
    isAuthenticated: boolean;
    userName?: string;
    userEmail?: string;
    userPicture?: string;
  } | null = (authLoaded && googleUserInfo && googleUserInfo.isAuthenticated)
      ? googleUserInfo
      : accountProfile
        ? {
          isAuthenticated: !!(accountProfile.displayName || accountProfile.username || accountProfile.email),
          userName: accountProfile.displayName || accountProfile.username,
          userEmail: accountProfile.email,
          userPicture: accountProfile.avatar,
        }
        : null;

  // update avatarSrc when authLoaded, googleUserInfo, or account settings change
  useEffect(() => {
    Logger.debug('APPSIDEBAR', 'Avatar update triggered', {
      authLoaded,
      googleUserInfoAuthenticated: googleUserInfo?.isAuthenticated,
      accountProfileExists: !!accountProfile,
      accountProfileAvatar: accountProfile?.avatar,
      accountProfileAvatarThumb: (accountProfile as any)?.avatarThumb
    });

    // 🔥 수정: 로컬 아바타 설정이 있으면 그것을 우선으로 사용
    if (accountProfile?.avatar) {
      const avatarValue = accountProfile.avatar;
      Logger.debug('APPSIDEBAR', 'Using local account profile avatar (priority)', { avatarValue });

      const v = String(avatarValue);
      if (v.startsWith('file://')) {
        const path = v.replace(/^file:\/\//, '');
        (window.electronAPI as any).files?.readFileAsDataUrl(path).then((r: { success: boolean; data?: string }) => {
          if (r && r.success && r.data) {
            Logger.debug('APPSIDEBAR', 'Loaded file:// avatar as data URL');
            setAvatarSrc(r.data as string);
          } else {
            Logger.warn('APPSIDEBAR', 'Failed to load file:// avatar');
            setAvatarSrc(null);
          }
        }).catch(() => {
          Logger.warn('APPSIDEBAR', 'Error loading file:// avatar');
          setAvatarSrc(null);
        });
      } else if (v.startsWith('loop-avatar://') || v.startsWith('data:')) {
        // 🔥 loop-avatar:// 프로토콜과 data: URL 모두 직접 사용
        Logger.debug('APPSIDEBAR', 'Using loop-avatar:// or data: URL', { url: v.substring(0, 50) + '...' });
        setAvatarSrc(v);
      } else {
        Logger.debug('APPSIDEBAR', 'Using direct avatar URL', { url: v });
        setAvatarSrc(v);
      }
      return; // 로컬 아바타가 있으면 Google 아바타 사용하지 않음
    }

    // prefer Google authenticated profile when available (only if no local avatar)
    if (authLoaded && googleUserInfo && googleUserInfo.isAuthenticated) {
      const picture = googleUserInfo.userPicture || (googleUserInfo.userEmail ? `https://ui-avatars.com/api/?name=${encodeURIComponent(googleUserInfo.userEmail)}&background=4f46e5&color=fff&size=64` : undefined);
      Logger.debug('APPSIDEBAR', 'Using Google profile picture (fallback)', { picture });
      setAvatarSrc(picture || null);
      return;
    }

    // fallback to generated avatar or null
    if (accountProfile && (accountProfile.displayName || accountProfile.username || accountProfile.email)) {
      const name = String(accountProfile.displayName || accountProfile.username || accountProfile.email || '');
      const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=64`;
      Logger.debug('APPSIDEBAR', 'Using fallback generated avatar', { name, fallbackUrl });
      setAvatarSrc(fallbackUrl);
    } else {
      Logger.debug('APPSIDEBAR', 'No avatar data available, setting to null');
      setAvatarSrc(null);
    }
  }, [authLoaded, googleUserInfo, accountProfile]);

  // subscribe to settings change broadcast for account.avatar and other profile fields
  useEffect(() => {
    try {
      const unsub = (window.electronAPI as any).settings.onDidChange?.((payload: { keyPath: string; value: any }) => {
        if (!payload || !payload.keyPath) return;

        // handle avatar and avatarThumb changes
        if (payload.keyPath === 'account.avatar' || payload.keyPath === 'account.avatarThumb') {
          const val = payload.value as string | null;
          Logger.debug('APPSIDEBAR', 'Avatar setting changed via broadcast', {
            keyPath: payload.keyPath,
            hasValue: !!val,
            valuePrefix: val?.substring(0, 50) + '...' || 'null'
          });

          if (!val) {
            Logger.debug('APPSIDEBAR', 'Avatar value is null, clearing avatarSrc');
            setAvatarSrc(null);
            return;
          }
          if (val.startsWith('file://')) {
            const p = val.replace(/^file:\/\//, '');
            Logger.debug('APPSIDEBAR', 'Loading file:// avatar from broadcast', { path: p });
            (window.electronAPI as any).files?.readFileAsDataUrl(p).then((r: { success: boolean; data?: string }) => {
              if (r && r.success && r.data) {
                Logger.debug('APPSIDEBAR', 'Successfully loaded file:// avatar from broadcast');
                setAvatarSrc(r.data as string);
              }
            }).catch(() => {
              Logger.warn('APPSIDEBAR', 'Failed to load file:// avatar from broadcast');
            });
          } else {
            // 🔥 data: URL과 loop-avatar:// 프로토콜 모두 직접 사용
            Logger.debug('APPSIDEBAR', 'Setting avatar from broadcast', { valuePrefix: val.substring(0, 50) + '...' });
            setAvatarSrc(val);
          }
        }

        // for other account.* changes, trigger settings re-fetch to update display name etc
        if (payload.keyPath.startsWith('account.') && payload.keyPath !== 'account.avatar') {
          // Force settings hook to re-merge (this will trigger accountProfile change)
          // The useSettings hook already subscribes to onDidChange and updates its state
        }
      });

      return () => { if (typeof unsub === 'function') unsub(); };
    } catch (e) {
      return;
    }
  }, []);

  // handle avatar click -> upload when local account, open settings when Google-auth
  const handleAvatarClick = () => {
    if (authLoaded && googleUserInfo && googleUserInfo.isAuthenticated) {
      onNavigate?.('/settings');
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f) return;

    // Size limit check (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (f.size > maxSize) {
      alert('파일 크기가 5MB를 초과합니다. 더 작은 파일을 선택해주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await window.electronAPI.settings.set('account.avatar', dataUrl);
        if (res && res.success) {
          // Don't update local settings state manually - onDidChange will handle it
          // Just log success
          Logger.info('SIDEBAR', 'Avatar uploaded successfully');
        } else {
          throw new Error(res?.error || 'save failed');
        }
      } catch (e) {
        console.error('Failed to save avatar to settings', e);
        alert('프로필 저장에 실패했습니다');
      }
    };
    reader.readAsDataURL(f);
  };

  // Synchronous state restoration to prevent flash
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load online status first
        const snap = (window as any).loopSnapshot && typeof (window as any).loopSnapshot.get === 'function' ? (window as any).loopSnapshot.get() : null;
        if (snap && typeof snap.online === 'boolean') {
          setIsOnline(snap.online);
        } else {
          setIsOnline(navigator.onLine);
        }
      } catch (e) {
        setIsOnline(navigator.onLine);
      }
    }
    setIsClient(true);
  }, []);

  // Online/offline event listeners
  useEffect(() => {
    if (!isClient) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isClient]);

  // no extra sync needed - AuthContext bootstraps initial state from server

  const handleToggleCollapse = (): void => {
    const newCollapsed = !collapsed;

    if (isControlled) {
      onToggleCollapse?.();
    } else {
      // 🔥 settings와 연동하여 상태 영구 업데이트
      updateSetting('ui', 'appSidebarCollapsed', newCollapsed);

      // collapsed로 변경 시 hover 상태 초기화
      if (newCollapsed) {
        setIsHovered(false);
      }
    }
    Logger.info('SIDEBAR', `Sidebar ${newCollapsed ? 'collapsed' : 'expanded'} permanently`);
  };

  // 🔥 최적화된 이벤트 핸들러들 (useCallback 사용) + 강화된 디버깅
  const handleMouseEnter = useCallback(() => {
    console.log('🔥 HOVER: MouseEnter triggered', { collapsed, isHovered, timestamp: Date.now() });
    if (collapsed) {
      console.log('🔥 HOVER: Setting isHovered to true');
      setIsHovered(true);

      // 🔥 추가 디버깅: 상태 변경 확인
      setTimeout(() => {
        console.log('🔥 HOVER: isHovered state after 100ms:', isHovered);
      }, 100);
    } else {
      console.log('🔥 HOVER: Not setting isHovered because collapsed is false');
    }
  }, [collapsed, isHovered]);

  const handleMouseLeave = useCallback(() => {
    console.log('🔥 HOVER: MouseLeave triggered', { collapsed, isHovered, timestamp: Date.now() });
    if (collapsed) {
      console.log('🔥 HOVER: Setting isHovered to false');
      setIsHovered(false);

      // 🔥 추가 디버깅: 상태 변경 확인
      setTimeout(() => {
        console.log('🔥 HOVER: isHovered state after 100ms:', isHovered);
      }, 100);
    } else {
      console.log('🔥 HOVER: Not setting isHovered because collapsed is false');
    }
  }, [collapsed, isHovered]);

  const handleNavigate = useCallback((item: SidebarItem): void => {
    Logger.info('SIDEBAR', `Navigation to ${item.label}`, { href: item.href });

    // 🔥 직접 Next.js router 사용 (onNavigate prop에 의존하지 않음)
    try {
      router.push(item.href);
    } catch (error) {
      Logger.error('SIDEBAR', 'Navigation failed', { href: item.href, error });
      // fallback으로 onNavigate prop 사용
      onNavigate?.(item.href);
    }
  }, [router, onNavigate]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, item: SidebarItem): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate(item);
    }
  }, [handleNavigate]);

  const renderNavItem = (item: SidebarItem, isExpanded: boolean): React.ReactElement => {
    const isActive = activeRoute === item.href;
    const Icon = item.icon;

    const navItemContent = (
      <div
        className={
          isExpanded
            ? (isActive ? SIDEBAR_STYLES.navItemActive : SIDEBAR_STYLES.navItem)
            : (isActive ? SIDEBAR_STYLES.navItemActive : SIDEBAR_STYLES.navItem)
        }
        role="button"
        tabIndex={0}
        onClick={() => handleNavigate(item)}
        onKeyDown={(e) => handleKeyDown(e, item)}
        aria-label={item.ariaLabel || item.label}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={SIDEBAR_STYLES.icon} />
        {isExpanded && (
          <>
            <span className={SIDEBAR_STYLES.text}>{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge variant="danger" size="sm" className={SIDEBAR_STYLES.badge}>
                {item.badge > 9 ? '9+' : item.badge}
              </Badge>
            )}
          </>
        )}
      </div>
    );

    return (
      <div key={item.id}>
        {isExpanded ? (
          navItemContent
        ) : (
          <Tooltip content={item.label} side="right">
            <div>
              {navItemContent}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const SidebarContent = ({ isExpanded }: { isExpanded: boolean }) => (
    <div className={`flex flex-col h-full ${isExpanded ? 'w-64' : 'w-16'}`}>
      {/* 로고 */}
      <div className={SIDEBAR_STYLES.logoSection}>
        {isExpanded ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between w-full">
              <h1 className={SIDEBAR_STYLES.logoText}>Loop</h1>
              <Button
                variant="ghost"
                size="sm"
                className={SIDEBAR_STYLES.collapseButton}
                onClick={handleToggleCollapse}
                aria-label="사이드바 축소"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
            </div>

            {/* 확장 시 사용자 프로필: Google 계정 정보 노출 */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
              onClick={() => {
                Logger.info('SIDEBAR', 'User profile clicked');
                onNavigate?.('/settings');
              }}
              role="button"
              tabIndex={0}
              aria-label="사용자 프로필"
            >
              {!authLoaded && settingsLoading ? (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              ) : (
                <Avatar
                  size="lg"
                  src={avatarSrc || undefined}
                  aria-label={(accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'Loop 사용자')}
                  className="border-2 border-white dark:border-slate-800 shadow-sm"
                >
                  <span className="text-lg font-medium">{(accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'L').charAt(0).toUpperCase()}</span>
                </Avatar>
              )}
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{
                  // skeleton for name until authLoaded
                  !authLoaded && settingsLoading ? (
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  ) : (
                    // Show display name from account settings, or fall back to email, or Loop 사용자
                    (accountProfile?.displayName || accountProfile?.username || accountProfile?.email || (googleUserInfo?.isAuthenticated ? (googleUserInfo.userName || googleUserInfo.userEmail) : null) || 'Loop 사용자')
                  )
                }</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={isOnline ? 'w-1.5 h-1.5 bg-green-500 rounded-full' : 'w-1.5 h-1.5 bg-gray-400 rounded-full'} />
                  <span suppressHydrationWarning className="text-xs text-slate-500 dark:text-slate-400">{
                    !authLoaded ? '상태 확인 중...' : (googleUserInfo?.isAuthenticated ? 'Google 계정' : (accountProfile?.displayName || accountProfile?.username || accountProfile?.email ? '로컬 계정' : (isOnline ? '온라인' : '오프라인')))
                  }</span>
                </div>
                {visibleProfile && visibleProfile.isAuthenticated && visibleProfile.userEmail && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-opacity duration-200">{visibleProfile.userEmail}</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>

            {/* 축소 시 사용자 프로필 - Google 계정 정보 표시 */}
            <div
              className="flex flex-col items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors mt-2"
              onClick={() => {
                Logger.info('SIDEBAR', 'User profile clicked (collapsed)');
                onNavigate?.('/settings');
              }}
              role="button"
              tabIndex={0}
              aria-label="사용자 프로필"
            >
              {!authLoaded && settingsLoading ? (
                // loading skeleton
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              ) : (
                <Avatar
                  size="md"
                  src={avatarSrc || undefined}
                  aria-label={(accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'Loop 사용자')}
                  className="border-2 border-white dark:border-slate-800 shadow-sm"
                >
                  <span className="text-sm font-medium">{(accountProfile?.displayName || accountProfile?.username || googleUserInfo?.userName || 'L').charAt(0).toUpperCase()}</span>
                </Avatar>
              )}
              <div className={isOnline ? 'w-1.5 h-1.5 bg-green-500 rounded-full' : 'w-1.5 h-1.5 bg-gray-400 rounded-full'} />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className={SIDEBAR_STYLES.collapseButton}
              onClick={handleToggleCollapse}
              aria-label="사이드바 확장"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* 네비게이션 */}
      <nav className={SIDEBAR_STYLES.navSection} aria-label="메인 메뉴">
        <div className={SIDEBAR_STYLES.navList}>
          {SIDEBAR_ITEMS.map(item => renderNavItem(item, isExpanded))}
        </div>
      </nav>
    </div>
  );

  return (
    <div className="relative h-full">
      {/* 🔥 디버깅용 상태 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-2 text-xs rounded-lg shadow-lg z-[10000] font-mono">
          <div><strong>🔥 DEBUG INFO:</strong></div>
          <div>Collapsed: <span className="bg-yellow-400 text-black px-1">{String(collapsed)}</span></div>
          <div>Hovered: <span className="bg-green-400 text-black px-1">{String(isHovered)}</span></div>
          <div>SettingsCollapsed: {String(settingsCollapsed)}</div>
          <div>ControlledCollapsed: {String(controlledCollapsed)}</div>
          <div>IsControlled: {String(isControlled)}</div>
          <div>Pathname: {pathname}</div>
          <div>HoverClass: <span className="bg-purple-400 text-black px-1">{hoverAreaClass}</span></div>
          <div>Client: {String(isClient)}</div>
        </div>
      )}
      {/* 🔥 hover 감지 영역 - Next.js 문양까지만 */}
      {collapsed && (
        <div
          className={`absolute left-0 top-0 ${hoverAreaClass} h-full z-[9999] hover:cursor-pointer bg-transparent transition-all duration-300`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="앱 사이드바 펼치기"
          style={{
            // 🔥 디버깅용: 개발 중에만 보이는 하얀색 배경 + 강화된 표시
            backgroundColor: process.env.NODE_ENV === 'development' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            border: process.env.NODE_ENV === 'development' ? '3px dashed #3b82f6' : 'none',
            boxShadow: process.env.NODE_ENV === 'development' ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
          }}
          onMouseMove={(e) => {
            // 🔥 디버깅: 마우스 이벤트 확인 + 위치 추적
            console.log('🔥 HOVER AREA: Mouse move detected', {
              collapsed,
              isHovered,
              mouseX: e.clientX,
              mouseY: e.clientY,
              target: e.target
            });

            // 🔥 강제 hover 상태 설정 (마우스가 영역에 있을 때)
            if (collapsed && !isHovered) {
              console.log('🔥 HOVER AREA: Forcing isHovered to true via mouse move');
              setIsHovered(true);
            }
          }}
        >
          {/* 🔥 디버깅용: hover 영역 표시 텍스트 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 font-bold text-xs writing-mode-vertical rotate-90 whitespace-nowrap">
              HOVER ZONE
            </div>
          )}
        </div>
      )}

      {/* 🔥 완전 숨김 상태 - 아무것도 렌더링하지 않음 */}
      {collapsed && !isHovered && null}

      {/* 🔥 hover 시 절대 위치 오버레이 */}
      {collapsed && isHovered && (
        <div
          className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl z-[9998] transition-all duration-300 transform animate-in slide-in-from-left"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="사이드바 네비게이션 (hover)"
          role="navigation"
          style={{
            // 🔥 디버깅용: hover 사이드바 확인 + 강화된 시각 효과
            boxShadow: process.env.NODE_ENV === 'development'
              ? '0 0 30px rgba(0, 255, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: process.env.NODE_ENV === 'development' ? '3px solid #10b981' : undefined
          }}
        >
          <SidebarContent isExpanded={true} />
          {/* 🔥 디버깅 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded animate-pulse">
              🎉 HOVER ACTIVE! 🎉
            </div>
          )}
          {/* 🔥 추가 디버깅 정보 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
              Time: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* 🔥 완전 펼침 상태 - 일반 사이드바 */}
      {!collapsed && (
        <aside
          className={`${SIDEBAR_STYLES.container} ${SIDEBAR_STYLES.expanded}`}
          aria-label="사이드바 네비게이션"
          role="navigation"
        >
          <SidebarContent isExpanded={true} />
        </aside>
      )}
    </div>
  );
}
