// 🔥 기가차드 키보드 설정 섹션 - 최적화
'use client';

import React, { useCallback } from 'react';
import { Keyboard } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import { SettingItem } from '../controls/SettingItem';
import { Toggle } from '../controls/Toggle';
import type { SettingsData, UpdateSettingFunction } from '../../types';

/**
 * 🔥 키보드 설정 섹션 Props
 */
interface KeyboardSettingsSectionProps {
  settings: SettingsData['keyboard'];
  updateSetting: UpdateSettingFunction;
}

/**
 * 🔥 키보드 설정 섹션 컴포넌트
 */
export const KeyboardSettingsSection = React.memo<KeyboardSettingsSectionProps>(({ 
  settings, 
  updateSetting 
}) => {
  // 🔥 키보드 활성화 토글 핸들러
  const handleEnabledToggle = useCallback((checked: boolean) => {
    updateSetting('keyboard', 'enabled', checked);
  }, [updateSetting]);

  // 🔥 모든 앱 추적 토글 핸들러
  const handleTrackAllAppsToggle = useCallback((checked: boolean) => {
    updateSetting('keyboard', 'trackAllApps', checked);
  }, [updateSetting]);

  // 🔥 언어 변경 핸들러
  const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting('keyboard', 'language', event.target.value);
  }, [updateSetting]);

  // 🔥 세션 타임아웃 변경 핸들러
  const handleSessionTimeoutChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const timeout = parseInt(event.target.value, 10);
    if (timeout >= 5 && timeout <= 120) {
      updateSetting('keyboard', 'sessionTimeout', timeout);
    }
  }, [updateSetting]);

  return (
    <div className={SETTINGS_PAGE_STYLES.sectionCard}>
      <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
        <Keyboard className={SETTINGS_PAGE_STYLES.sectionIcon} />
        <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>키보드 설정</h2>
      </div>

      <div className={SETTINGS_PAGE_STYLES.sectionCardBody}>
        <div className={SETTINGS_PAGE_STYLES.settingItem}>
          <SettingItem
            title="키보드 모니터링 활성화"
            description="키보드 입력을 모니터링하여 타이핑 통계를 수집합니다"
            control={
              <Toggle
                checked={settings.enabled}
                onChange={handleEnabledToggle}
              />
            }
          />

          <SettingItem
            title="입력 언어"
            description="주로 사용하는 입력 언어를 선택하세요"
            control={
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                className={SETTINGS_PAGE_STYLES.select}
                disabled={!settings.enabled}
              >
                <option value="korean">한국어</option>
                <option value="english">English</option>
                <option value="japanese">日本語</option>
                <option value="chinese">中文</option>
              </select>
            }
          />

          <SettingItem
            title="모든 앱 추적"
            description="모든 애플리케이션에서의 타이핑을 추적합니다"
            control={
              <Toggle
                checked={settings.trackAllApps}
                onChange={handleTrackAllAppsToggle}
                disabled={!settings.enabled}
              />
            }
          />

          <SettingItem
            title="세션 타임아웃"
            description="타이핑 세션이 종료되는 시간(분)을 설정하세요 (5-120분)"
            control={
              <input
                type="number"
                min="5"
                max="120"
                value={settings.sessionTimeout}
                onChange={handleSessionTimeoutChange}
                className={SETTINGS_PAGE_STYLES.numberInput}
                disabled={!settings.enabled}
              />
            }
          />
        </div>
      </div>
    </div>
  );
});

KeyboardSettingsSection.displayName = 'KeyboardSettingsSection';
