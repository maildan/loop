"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Logger } from '../../shared/logger';

export interface AuthState {
    isAuthenticated: boolean;
    userEmail?: string;
    userName?: string;
    userPicture?: string;
}

export interface AuthContextType {
    auth: AuthState;
    loadAuthStatus: () => Promise<void>;
    setAuth: (next: Partial<AuthState>) => void;
    clearAuth: () => void;
}

// Extended context type with loaded flag
export interface AuthContextTypeEx extends AuthContextType {
    loaded: boolean;
}

const getDefaultAuth = (): AuthState => ({ isAuthenticated: false });

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialAuth }: { children: React.ReactNode; initialAuth?: any }) {
    const [auth, setAuthState] = useState<AuthState>(() => {
        if (initialAuth && initialAuth.isAuthenticated) {
            return {
                isAuthenticated: true,
                userEmail: initialAuth.userEmail || undefined,
                userName: initialAuth.userName || undefined,
                userPicture: initialAuth.userPicture || undefined,
            } as AuthState;
        }
        return getDefaultAuth();
    });
    const [loaded, setLoaded] = useState<boolean>(() => !!(initialAuth));
    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
    const latestLoadId = React.useRef(0);

    const setAuth = useCallback((next: Partial<AuthState>) => {
        setAuthState(prev => ({ ...prev, ...next }));
    }, []);

    const clearAuth = useCallback(() => {
        setAuthState(getDefaultAuth());
    }, []);

    const loadAuthStatus = useCallback(async (): Promise<void> => {
        const requestId = ++latestLoadId.current;
        try {
            if (typeof window === 'undefined' || !window.electronAPI?.oauth?.getAuthStatus) return;
            const res = await window.electronAPI.oauth.getAuthStatus();
            // ignore stale responses
            if (requestId !== latestLoadId.current) return;

            if (res && res.success && res.data && res.data.isAuthenticated) {
                const email = res.data.userEmail;
                const picture = res.data.userPicture || (email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=4f46e5&color=fff&size=64` : undefined);
                setAuthState({
                    isAuthenticated: true,
                    userEmail: email,
                    userName: email ? email.split('@')[0] : res.data.userName || 'Google 사용자',
                    userPicture: picture,
                });
                Logger.info('AUTH_CONTEXT', 'Auth status loaded', { userEmail: email });
            } else {
                setAuthState(getDefaultAuth());
            }
        } catch (error) {
            // ignore stale errors
            if (requestId !== latestLoadId.current) return;
            Logger.error('AUTH_CONTEXT', 'Failed to load auth status', error);
            setAuthState(getDefaultAuth());
        }
        finally {
            // mark loaded regardless of result (so UI can update safely)
            if (requestId === latestLoadId.current) setLoaded(true);
        }
    }, []);

    useEffect(() => {
        // seed auth state from preload async snapshot to reduce flicker
        (async () => {
            try {
                // Try synchronous preload snapshot first to avoid waiting
                if (typeof window !== 'undefined' && (window as any).loopSnapshot && typeof (window as any).loopSnapshot.get === 'function') {
                    try {
                        const snap = (window as any).loopSnapshot.get();
                        if (snap && snap.auth && snap.auth.isAuthenticated) {
                            setAuthState({
                                isAuthenticated: true,
                                userEmail: snap.auth.userEmail || undefined,
                                userName: snap.auth.userName || undefined,
                                userPicture: snap.auth.userPicture || undefined,
                            });
                            setLoaded(true);
                        }
                    } catch (e) {
                        // ignore sync preload errors
                    }
                }

                // fallback: async snapshot via electronAPI
                if (typeof window !== 'undefined' && (window as any).electronAPI?.loopSnapshot?.getAsync) {
                    const snap = await (window as any).electronAPI.loopSnapshot.getAsync();
                    if (snap && snap.auth && snap.auth.isAuthenticated) {
                        setAuthState({
                            isAuthenticated: true,
                            userEmail: snap.auth.userEmail || undefined,
                            userName: snap.auth.userName || undefined,
                            userPicture: snap.auth.userPicture || undefined,
                        });
                        setLoaded(true);
                    }
                }
            } catch (e) {
                // ignore
            } finally {
                // validate/refresh tokens after seeding
                loadAuthStatus();
            }
        })();

        if (typeof window !== 'undefined' && window.electronAPI?.on) {
            const handler = (payload?: any) => {
                Logger.info('AUTH_CONTEXT', 'auth-status-changed event received', payload);
                // If the payload contains user data, update state immediately to improve UX
                try {
                    if (payload && payload.userEmail) {
                        setAuthState((prev) => ({
                            ...prev,
                            isAuthenticated: true,
                            userEmail: payload.userEmail || prev.userEmail,
                            userName: payload.userName || prev.userName,
                            userPicture: payload.userPicture || prev.userPicture,
                        }));
                        setLoaded(true);
                        return;
                    }
                } catch (e) {
                    // continue to fallback
                }
                loadAuthStatus();
            };
            window.electronAPI.on('auth-status-changed', handler);
            window.electronAPI.on('oauth-success', handler);
            const loginRequiredHandler = () => {
                Logger.info('AUTH_CONTEXT', 'oauth:login-required received - clearing auth and notifying user');
                clearAuth();
                try {
                    window.electronAPI.notifications.show('로그인 필요', 'Google 인증이 만료되었습니다. 다시 로그인해주세요.');
                } catch (e) {
                    // ignore
                }
                // open modal to prompt user
                setLoginModalOpen(true);
            };
            window.electronAPI.on('oauth:login-required', loginRequiredHandler);
            return () => {
                window.electronAPI?.removeListener('auth-status-changed', handler);
                window.electronAPI?.removeListener('oauth-success', handler);
                window.electronAPI?.removeListener('oauth:login-required', loginRequiredHandler);
            };
        }
    }, [loadAuthStatus]);

    const ctx = useMemo(() => ({ auth, loadAuthStatus, setAuth, clearAuth, loaded }), [auth, loadAuthStatus, setAuth, clearAuth, loaded]);

    // lazy load LoginModal to avoid SSR issues
    const LoginModal = require('../components/auth/LoginModal').default;

    return (
        <AuthContext.Provider value={ctx as unknown as AuthContextType}>
            {children}
            <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} onLogin={async () => {
                try {
                    await window.electronAPI.oauth.startGoogleAuth();
                } catch (e) {
                    Logger.error('AUTH_CONTEXT', 'Failed to start google auth from modal', e);
                }
            }} />
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export default AuthContext;
