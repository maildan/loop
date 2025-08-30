// 🔥 기가차드 알림 설정 섹션 - 최적화
'use client';

import React, { useCallback } from 'react';
import { Bell } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import { SettingItem } from '../controls/SettingItem';
import { Toggle } from '../controls/Toggle';
import type { SettingsData, UpdateSettingFunction } from '../../types';

/**
 * 🔥 알림 설정 섹션 Props
 */
interface NotificationSettingsSectionProps {
    settings: SettingsData['notifications'];
    updateSetting: UpdateSettingFunction;
}

/**
 * 🔥 알림 설정 섹션 컴포넌트
 */
export const NotificationSettingsSection = React.memo<NotificationSettingsSectionProps>(({
    settings,
    updateSetting
}) => {
    // 🔥 알림 활성화 토글 핸들러
    const handleNotificationsToggle = useCallback((checked: boolean) => {
        updateSetting('notifications', 'enableNotifications', checked);
    }, [updateSetting]);

    // 🔥 사운드 활성화 토글 핸들러
    const handleSoundsToggle = useCallback((checked: boolean) => {
        updateSetting('notifications', 'enableSounds', checked);
    }, [updateSetting]);

    // 🔥 목표 달성 알림 토글 핸들러
    const handleGoalAchievedToggle = useCallback((checked: boolean) => {
        updateSetting('notifications', 'notifyGoalAchieved', checked);
    }, [updateSetting]);

    // 🔥 일일 목표 알림 토글 핸들러
    const handleDailyGoalToggle = useCallback((checked: boolean) => {
        updateSetting('notifications', 'notifyDailyGoal', checked);
    }, [updateSetting]);

    // 🔥 에러 알림 토글 핸들러
    const handleErrorsToggle = useCallback((checked: boolean) => {
        updateSetting('notifications', 'notifyErrors', checked);
    }, [updateSetting]);

    return (
        <div className={SETTINGS_PAGE_STYLES.sectionCard}>
            <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
                <Bell className={SETTINGS_PAGE_STYLES.sectionIcon} />
                <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>알림 설정</h2>
            </div>

            <div className={SETTINGS_PAGE_STYLES.settingItem}>
                <SettingItem
                    title="알림 활성화"
                    description="시스템 알림을 받아보실 수 있습니다"
                    control={
                        <Toggle
                            checked={settings.enableNotifications}
                            onChange={handleNotificationsToggle}
                        />
                    }
                />

                <SettingItem
                    title="알림 사운드"
                    description="알림 시 사운드를 재생합니다"
                    control={
                        <Toggle
                            checked={settings.enableSounds}
                            onChange={handleSoundsToggle}
                            disabled={!settings.enableNotifications}
                        />
                    }
                />

                <SettingItem
                    title="목표 달성 알림"
                    description="설정한 목표를 달성했을 때 알림을 받습니다"
                    control={
                        <Toggle
                            checked={settings.notifyGoalAchieved}
                            onChange={handleGoalAchievedToggle}
                            disabled={!settings.enableNotifications}
                        />
                    }
                />

                <SettingItem
                    title="일일 목표 알림"
                    description="매일 설정된 목표에 대한 진행상황을 알림으로 받습니다"
                    control={
                        <Toggle
                            checked={settings.notifyDailyGoal}
                            onChange={handleDailyGoalToggle}
                            disabled={!settings.enableNotifications}
                        />
                    }
                />

                <SettingItem
                    title="에러 알림"
                    description="시스템 오류나 문제가 발생했을 때 알림을 받습니다"
                    control={
                        <Toggle
                            checked={settings.notifyErrors}
                            onChange={handleErrorsToggle}
                            disabled={!settings.enableNotifications}
                        />
                    }
                />
            </div>
        </div>
    );
});

NotificationSettingsSection.displayName = 'NotificationSettingsSection';
