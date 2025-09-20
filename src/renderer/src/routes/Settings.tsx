// 🔥 기가차드 Settings 페이지 - 완전 리팩토링 (756줄 → 80줄)
'use client';

import React, { useState } from 'react';
import { SETTINGS_PAGE_STYLES } from '../../app/settings/constants/styles';
import { useSettings } from '../../app/settings/hooks/useSettings';
import { SettingsNavigation } from '../../app/settings/components/SettingsNavigation';
import { AppSettingsSection } from '../../app/settings/components/sections/AppSettingsSection';
import ProfileSettingsSection from '../../app/settings/components/sections/ProfileSettingsSection';
import { KeyboardSettingsSection } from '../../app/settings/components/sections/KeyboardSettingsSection';
import { UISettingsSection } from '../../app/settings/components/sections/UISettingsSection';
import { NotificationSettingsSection } from '../../app/settings/components/sections/NotificationSettingsSection';
import { PerformanceSettingsSection } from '../../app/settings/components/sections/PerformanceSettingsSection';
import { SettingsActions } from '../../app/settings/components/SettingsActions';
import { useTheme } from '../../providers/ThemeProvider';
import type { SettingSection } from '../../app/settings/types';

/**
 * 🔥 기가차드 설정 페이지 - 완전 모듈화 (11원칙 준수)
 */
export default function Settings(): React.ReactElement {
  const { settings, loading, saving, updateSetting, saveAllSettings, resetSettings } = useSettings();
  const [activeSection, setActiveSection] = useState<SettingSection>('app');
  const { setTheme } = useTheme();

  // 🔥 로딩 상태 처리
  if (loading || !settings) {
    return (
      <div className={SETTINGS_PAGE_STYLES.container}>
        <div className={SETTINGS_PAGE_STYLES.loading}>
          <div className={SETTINGS_PAGE_STYLES.loadingContent}>
            <div className={SETTINGS_PAGE_STYLES.spinner} />
            <p className={SETTINGS_PAGE_STYLES.loadingText}>설정을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${SETTINGS_PAGE_STYLES.container} min-w-0`}>
      {/* 페이지 제목 */}
      <h1 className={SETTINGS_PAGE_STYLES.pageTitle}>설정</h1>

      {/* 네비게이션 */}
      <SettingsNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* 섹션 컨텐츠 */}
      <div className={`${SETTINGS_PAGE_STYLES.section} min-w-0`}>
        {activeSection === 'app' && (
          <AppSettingsSection
            settings={settings.app}
            updateSetting={updateSetting}
            setTheme={setTheme}
          />
        )}

        {activeSection === 'account' && (
          <ProfileSettingsSection
            settings={settings.account}
            updateSetting={updateSetting}
          />
        )}

        {activeSection === 'notifications' && (
          <NotificationSettingsSection
            settings={settings.notifications}
            updateSetting={updateSetting}
          />
        )}

        {activeSection === 'ui' && (
          <UISettingsSection
            settings={settings.ui}
            updateSetting={updateSetting}
          />
        )}

        {activeSection === 'keyboard' && (
          <KeyboardSettingsSection
            settings={settings.keyboard}
            updateSetting={updateSetting}
          />
        )}

        {activeSection === 'performance' && (
          <PerformanceSettingsSection
            settings={settings.performance}
            updateSetting={updateSetting}
          />
        )}
      </div>

      {/* 액션 버튼 */}
      <SettingsActions
        saving={saving}
        onSave={saveAllSettings}
        onReset={resetSettings}
      />
    </div>
  );
}