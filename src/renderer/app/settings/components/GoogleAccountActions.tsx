'use client';

import React, { useState, useCallback } from 'react';
import { LogOut } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../constants/styles';
import { SettingItem } from './SettingItem';

export const GoogleAccountActions: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        if (!window.electronAPI?.oauth?.revokeAuth) {
            alert('이 기능은 데스크톱 앱에서만 동작합니다');
            return;
        }

        const confirmed = window.confirm('Google 계정 연결을 끊고 로그아웃하시겠습니까?');
        if (!confirmed) return;

        setLoading(true);
        try {
            const result = await window.electronAPI.oauth.revokeAuth();
            if (result && result.success) {
                alert('Google 로그아웃 완료');
                // simple approach: reload page to refresh UI and clear sidebar state
                setTimeout(() => window.location.reload(), 300);
            } else {
                alert('로그아웃에 실패했습니다. 콘솔을 확인하세요.');
            }
        } catch (err) {
            console.error('Failed to revoke auth', err);
            alert('로그아웃 중 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className={SETTINGS_PAGE_STYLES.sectionCard}>
            <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
                <LogOut className={SETTINGS_PAGE_STYLES.sectionIcon} />
                <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>Google 계정</h2>
            </div>

            <div className={SETTINGS_PAGE_STYLES.settingItem}>
                <SettingItem
                    title="Google 로그아웃"
                    description="앱에 연결된 Google 계정의 토큰을 삭제하고 연결을 해제합니다"
                    control={(
                        <button
                            type="button"
                            className={`${SETTINGS_PAGE_STYLES.button} ${SETTINGS_PAGE_STYLES.secondaryButton}`}
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            {loading ? '로그아웃 중...' : '로그아웃'}
                        </button>
                    )}
                />
            </div>
        </div>
    );
};

export default GoogleAccountActions;
