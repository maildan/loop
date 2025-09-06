'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const SIDEBAR_STYLES = {
  container: 'relative flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300',
  collapsed: 'w-0 overflow-hidden', // 🔥 완전히 숨김 (아이콘까지 모두)
  expanded: 'w-64',
  hoverContent: 'absolute left-full top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-l border-slate-200 dark:border-slate-700 shadow-lg z-30',
  logoSection: 'h-auto min-h-[4rem] flex flex-col justify-center border-b border-slate-200 dark:border-slate-700 px-6 py-3',
  logoCollapsed: 'h-auto min-h-[8rem] flex items-center justify-center border-b border-slate-200 dark:border-slate-700 px-3 py-4',
  logoText: 'text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
  logoIcon: 'w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm',
  profileSection: 'border-b border-slate-200 dark:border-slate-700 p-4',
  profileCollapsed: 'border-b border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center gap-2',
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
  navItemCollapsed: 'flex items-center justify-center h-10 w-10 mx-auto text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-150 cursor-pointer',
  navItemActiveCollapsed: 'flex items-center justify-center h-10 w-10 mx-auto bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg',
  icon: 'w-5 h-5 group-hover:scale-110 transition-transform duration-150 flex-shrink-0',
  iconCollapsed: 'w-5 h-5',
  text: 'ml-3 font-medium',
  badge: 'ml-auto',
  bottomSection: 'border-t border-slate-200 dark:border-slate-700 p-3',
} as const;

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

// 🔥 기가차드 규칙: 상수 분리
const SIDEBAR_ITEMS: readonly SidebarItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: Home,
    href: '/',
    ariaLabel: '대시보드로 이동'
  },
  {
    id: 'projects',
    label: '프로젝트',
    icon: Folder,
    href: '/projects',
    ariaLabel: '프로젝트 관리로 이동'
  },
  {
    id: 'analytics',
    label: '통계',
    icon: BarChart3,
    href: '/analytics',
    ariaLabel: '분석 및 통계로 이동'
  },
  {
    id: 'ai',
    label: 'Loop AI',
    icon: Sparkles,
    href: '/ai',
    badge: 2,
    ariaLabel: 'AI 도구로 이동'
  },
  {
    id: 'settings',
    label: '설정',
    icon: Settings,
    href: '/settings',
    ariaLabel: '설정으로 이동'
  },
] as const;

export function AppSidebar({
  activeRoute = '/',
  onNavigate,
  collapsed: controlledCollapsed,
  onToggleCollapse
}: AppSidebarProps): React.ReactElement {

  const authCtx = useAuth() as any;
  const { auth: googleUserInfo, loadAuthStatus, loaded: authLoaded } = authCtx;

  // settings hook for account-local profile (displayName, avatar)
  const { settings: loadedSettings, loading: settingsLoading, setSettings, updateSetting } = useSettings();

  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const isControlled = controlledCollapsed !== undefined;

  // 🔥 settings에서 collapse 상태 가져오기
  const settingsCollapsed = loadedSettings?.ui?.appSidebarCollapsed ?? false;

  const collapsed = isControlled ? controlledCollapsed : settingsCollapsed;

  // avatar src state to handle onError fallback and controlled updates
  const defaultAvatar = '/static/avatar-default.png';
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  // Use consistent initial state to prevent layout shift
  const [mounted, setMounted] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true); // Default to online to prevent flash
  const [isHovered, setIsHovered] = useState(false);

  // Prefer account settings when not authenticated via Google. If Google auth present, use google profile.
  const accountProfile = loadedSettings?.account;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // unify visible profile for legacy UI uses
  const visibleProfile: any = (authLoaded && googleUserInfo && googleUserInfo.isAuthenticated)
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
        (window.electronAPI as any).files?.readFileAsDataUrl(path).then((r: any) => {
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
      const unsub = (window.electronAPI as any).settings.onDidChange?.((payload: any) => {
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
            (window.electronAPI as any).files?.readFileAsDataUrl(p).then((r: any) => {
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
    setMounted(true);
  }, []);

  // Online/offline event listeners
  useEffect(() => {
    if (!mounted) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [mounted]);

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

  const handleMouseEnter = () => {
    // hover는 collapsed 상태에서만 동작
    if (collapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    // hover는 collapsed 상태에서만 동작  
    if (collapsed) {
      setIsHovered(false);
    }
  };

  const handleNavigate = (item: SidebarItem): void => {
    Logger.info('SIDEBAR', `Navigation to ${item.label}`, { href: item.href });
    onNavigate?.(item.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent, item: SidebarItem): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate(item);
    }
  };

  const renderNavItem = (item: SidebarItem, isExpanded: boolean): React.ReactElement => {
    const isActive = activeRoute === item.href;
    const Icon = item.icon;

    const navItemContent = (
      <div
        className={
          isExpanded
            ? (isActive ? SIDEBAR_STYLES.navItemActive : SIDEBAR_STYLES.navItem)
            : (isActive ? SIDEBAR_STYLES.navItemActiveCollapsed : SIDEBAR_STYLES.navItemCollapsed)
        }
        role="button"
        tabIndex={0}
        onClick={() => handleNavigate(item)}
        onKeyDown={(e) => handleKeyDown(e, item)}
        aria-label={item.ariaLabel || item.label}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={isExpanded ? SIDEBAR_STYLES.icon : SIDEBAR_STYLES.iconCollapsed} />
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
      <div className={isExpanded ? SIDEBAR_STYLES.logoSection : SIDEBAR_STYLES.logoCollapsed}>
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
            <div className={SIDEBAR_STYLES.logoIcon}>L</div>

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
    <div className="relative">
      {/* 🔥 hover 감지 영역 - collapsed 상태에서만 표시 (AppSidebar 전용) */}
      {collapsed && (
        <div
          className="absolute left-0 top-0 w-4 h-full z-50 hover:cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="앱 사이드바 펼치기"
        />
      )}

      <aside
        className={`${SIDEBAR_STYLES.container} ${collapsed && !isHovered ? SIDEBAR_STYLES.collapsed : SIDEBAR_STYLES.expanded}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="사이드바 네비게이션"
        role="navigation"
      >
        <SidebarContent isExpanded={!collapsed || isHovered} />
      </aside>
    </div>
  );
}
