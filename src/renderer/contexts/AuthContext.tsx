"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Logger } from '../../shared/logger';
import LoginModal from '../components/auth/LoginModal';

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
                let email = res.data.userEmail;
                let userName = res.data.userName || (email ? email.split('@')[0] : 'Google 사용자');
                let picture = res.data.userPicture;

                Logger.debug('AUTH_CONTEXT', '📋 Auth 상태 로드됨', {
                  email,
                  userName,
                  hasPicture: !!picture,
                });

                // 🔥 Google 사용자 정보 추가 조회 (이름, 프로필 이미지)
                if (window.electronAPI?.googleOAuth?.getUserInfo) {
                  try {
                    Logger.debug('AUTH_CONTEXT', '👤 Google 사용자 정보 조회 중...');
                    const googleUserRes = await (window.electronAPI.googleOAuth as any).getUserInfo();
                    
                    Logger.debug('AUTH_CONTEXT', '📦 Google 사용자 정보 응답 구조', {
                      isObject: typeof googleUserRes === 'object',
                      keys: googleUserRes ? Object.keys(googleUserRes) : [],
                      hasSuccess: 'success' in (googleUserRes || {}),
                      hasData: 'data' in (googleUserRes || {}),
                    });

                    // 🔥 새로운 응답 구조: googleUserRes = { name, email, picture } (직접 객체)
                    // 또는 이전 구조: googleUserRes = { success, data: { name, email, picture } }
                    if (googleUserRes) {
                      // 직접 객체 구조 (구글 정보 직접)
                      if ((googleUserRes as any).name !== undefined || (googleUserRes as any).email !== undefined) {
                        Logger.debug('AUTH_CONTEXT', '✅ 직접 Google 데이터 수신');
                        if ((googleUserRes as any).name) {
                          userName = (googleUserRes as any).name;
                          Logger.info('AUTH_CONTEXT', '✅ Google 이름 적용', { name: userName });
                        }
                        if ((googleUserRes as any).picture) {
                          picture = (googleUserRes as any).picture;
                          Logger.info('AUTH_CONTEXT', '✅ Google 프로필 이미지 적용');
                        }
                        if ((googleUserRes as any).email && !email) {
                          email = (googleUserRes as any).email;
                        }
                      }
                      // 래핑된 구조 (Result 포맷)
                      else if ((googleUserRes as any).success && (googleUserRes as any).data) {
                        Logger.debug('AUTH_CONTEXT', '✅ 래핑된 Google 데이터 수신');
                        const googleData = (googleUserRes as any).data;
                        if (googleData.name) {
                          userName = googleData.name;
                          Logger.info('AUTH_CONTEXT', '✅ Google 이름 적용', { name: userName });
                        }
                        if (googleData.picture) {
                          picture = googleData.picture;
                          Logger.info('AUTH_CONTEXT', '✅ Google 프로필 이미지 적용');
                        }
                        if (googleData.email && !email) {
                          email = googleData.email;
                        }
                      } else {
                        Logger.warn('AUTH_CONTEXT', '⚠️ 예상치 못한 Google 응답 구조', googleUserRes);
                      }
                    }
                  } catch (error) {
                    Logger.warn('AUTH_CONTEXT', 'Google 사용자 정보 조회 실패 (계속 진행)', error);
                  }
                }

                // 프로필 이미지가 없으면 생성
                if (!picture && email) {
                  picture = `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=4f46e5&color=fff&size=64`;
                  Logger.debug('AUTH_CONTEXT', '🎨 기본 아바타 생성됨');
                }

                setAuthState({
                    isAuthenticated: true,
                    userEmail: email,
                    userName,
                    userPicture: picture,
                });
                Logger.info('AUTH_CONTEXT', '✅ Auth 상태 업데이트 완료', {
                  userEmail: email,
                  userName,
                  hasPicture: !!picture,
                });
            } else {
                // 개발 환경에서 Google OAuth 미설정 시 로그 억제 (정상 동작)
                if (process.env.NODE_ENV !== 'development') {
                    Logger.debug('AUTH_CONTEXT', '❌ 인증되지 않음');
                }
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
            
            // 🔥 OAuth 성공 이벤트 - 강화된 핸들러 (즉시 재검증)
            const oauthSuccessHandler = (payload?: any) => {
                Logger.info('AUTH_CONTEXT', '🔥 oauth-success 이벤트 수신 - 인증 상태 즉시 재검증', payload);
                
                // 토큰 저장 완료 대기 후 인증 상태 재로드
                setTimeout(() => {
                    Logger.debug('AUTH_CONTEXT', '📊 500ms 대기 후 loadAuthStatus() 호출');
                    loadAuthStatus();
                }, 500);
            };
            window.electronAPI.on('oauth-success', oauthSuccessHandler);
            
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
                window.electronAPI?.removeListener('oauth-success', oauthSuccessHandler);
                window.electronAPI?.removeListener('oauth:login-required', loginRequiredHandler);
            };
        }
    }, [loadAuthStatus]);

    const ctx = useMemo(() => ({ auth, loadAuthStatus, setAuth, clearAuth, loaded }), [auth, loadAuthStatus, setAuth, clearAuth, loaded]);

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
