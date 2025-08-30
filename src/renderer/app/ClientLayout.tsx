'use client';

import React, { ReactNode, useState, useLayoutEffect, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { MonitoringProvider } from '../contexts/GlobalMonitoringContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Logger } from '../../shared/logger';
import './globals.css';

interface ClientLayoutProps {
    readonly children: ReactNode;
    readonly initialAuth?: any;
}

export default function ClientLayout({ children, initialAuth }: ClientLayoutProps): React.ReactElement {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [isClientMounted, setIsClientMounted] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();

    // restore sidebar state before paint
    useLayoutEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedState = localStorage.getItem('sidebar-collapsed');
                if (savedState === 'true') {
                    setSidebarCollapsed(true);
                }
                Logger.debug('LAYOUT', 'Sidebar state restored immediately', { collapsed: savedState === 'true' });
            } catch (error) {
                Logger.error('LAYOUT', 'Failed to restore sidebar state', error);
            }
        }
        setIsClientMounted(true);
    }, []);

    const handleNavigate = (href: string): void => {
        try {
            if (typeof window === 'undefined') return;

            // Parse the URL to validate it
            let url: URL | null = null;
            try {
                url = new URL(href, window.location.href);
            } catch (e) {
                // malformed URL - block navigation
                Logger.warn('LAYOUT', 'Blocked malformed navigation URL', { href });
                return;
            }

            const isSameOrigin = url.origin === window.location.origin;
            const isRelative = href.startsWith('/');

            if (isRelative || isSameOrigin) {
                // Use Next.js router for internal navigation (client-side routing)
                Logger.debug('LAYOUT', 'Client-side navigation', { href });
                router.push(href);
            } else {
                // treat as external - open in new tab/window safely
                Logger.debug('LAYOUT', 'External navigation', { href });
                window.open(url.toString(), '_blank', 'noopener,noreferrer');
            }
        } catch (e) {
            Logger.warn('LAYOUT', 'Blocked unsafe navigation attempt', { href, error: e });
        }
    };

    const handleToggleSidebar = (): void => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);

        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('sidebar-collapsed', newState.toString());
                Logger.debug('LAYOUT', 'Sidebar state saved', { collapsed: newState });
            } catch (error) {
                Logger.error('LAYOUT', 'Failed to save sidebar state', error);
            }
        }
    };

    return (
        <ThemeProvider defaultTheme="system">
            <AuthProvider initialAuth={initialAuth}>
                <MonitoringProvider>
                    <div className="min-h-screen flex min-w-0 app-root">
                        <aside className="flex-shrink-0">
                            <AppSidebar
                                activeRoute={pathname}
                                onNavigate={handleNavigate}
                                collapsed={sidebarCollapsed}
                                onToggleCollapse={handleToggleSidebar}
                            />
                        </aside>

                        <main className="flex-1 flex flex-col min-w-0">
                            <header className="flex-shrink-0">
                                <AppHeader />
                            </header>

                            <div className="flex-1 min-w-0 p-6 overflow-y-auto">
                                {children}
                            </div>
                        </main>
                    </div>
                </MonitoringProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
